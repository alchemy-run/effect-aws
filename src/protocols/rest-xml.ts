/**
 * AWS restXml Protocol Implementation
 *
 * https://smithy.io/2.0/aws/protocols/aws-restxml-protocol.html
 */

import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import type * as AST from "effect/SchemaAST";
import type { Operation } from "../client/operation.ts";
import type { Protocol, ProtocolHandler } from "../client/protocol.ts";
import type { Request } from "../client/request.ts";
import type { Response } from "../client/response.ts";
import { ParseError } from "../errors.ts";
import {
  parseEventStreamToUnion,
  type PayloadParser,
} from "../eventstream/parser.ts";
import {
  getHttpHeader,
  getHttpPrefixHeaders,
  getHttpQuery,
  getPropAnnotations,
  getTimestampFormatFromAST,
  getXmlNameProp,
  hasHttpLabel,
  hasHttpPayload,
  hasHttpQueryParams,
  hasS3UnwrappedXmlOutput,
  hasXmlAttribute,
  hasXmlFlattened,
  isOutputEventStream,
  isStreamingType,
  type StreamingInputBody,
} from "../traits.ts";
import {
  getArrayElementAST,
  getEncodedPropertySignatures,
  getIdentifier,
  getXmlNameFromAST,
  getXmlNamespace,
  isArrayAST,
  isBooleanAST,
  isNumberAST,
  unwrapUnion,
} from "../util/ast.ts";
import { sanitizeErrorCode } from "../util/error.ts";
import { extractStaticQueryParams } from "../util/query-params.ts";
import { applyHttpTrait, bindInputToRequest } from "../util/serialize-input.ts";
import {
  convertStreamingInput,
  readableToEffectStream,
  readStreamAsText,
} from "../util/stream.ts";
import { formatTimestamp } from "../util/timestamp.ts";
import {
  deserializePrimitive,
  escapeXml,
  parseXml,
  unwrapArrayValue,
  wrapTag,
} from "../util/xml.ts";

// =============================================================================
// Protocol Export
// =============================================================================

export const restXmlProtocol: Protocol = (
  operation: Operation,
): ProtocolHandler => {
  const inputSchema = operation.input;
  const outputSchema = operation.output;
  const inputAst = inputSchema.ast;
  const outputAst = outputSchema.ast;

  // Pre-compute encoder (done once at init)
  const encodeInput = S.encode(inputSchema);
  const outputXmlName =
    getXmlNameFromAST(outputAst) ?? getIdentifier(outputAst);

  // Pre-compute s3UnwrappedXmlOutput handling (done once at init)
  const isUnwrappedOutput = hasS3UnwrappedXmlOutput(outputAst);
  const outputProps = getEncodedPropertySignatures(outputAst);
  const unwrappedPropName = isUnwrappedOutput
    ? outputProps.find(
        (prop) => (getXmlNameProp(prop) ?? String(prop.name)) === outputXmlName,
      )?.name
    : undefined;

  // Pre-compute httpPayload property info for serialization (done once at init)
  const inputProps = getEncodedPropertySignatures(inputAst);
  const payloadProp = inputProps.find((prop) => hasHttpPayload(prop));
  const payloadXmlName = payloadProp
    ? (getXmlNameProp(payloadProp) ??
      getXmlNameFromAST(payloadProp.type) ??
      getIdentifier(payloadProp.type))
    : undefined;
  const payloadIsStreaming = payloadProp
    ? isStreamingType(payloadProp.type)
    : false;
  const inputXmlNamespace = getXmlNamespace(inputAst);

  // Pre-classify output properties by their HTTP binding (done once at init)
  // This avoids repeated trait lookups during deserialization
  type HeaderProp = {
    name: string;
    header: string;
    headerLower: string;
    isNumber: boolean;
    isBoolean: boolean;
  };
  type PrefixHeaderProp = { name: string; prefix: string };
  type PayloadProp = {
    name: string;
    type: AST.AST;
    isStreaming: boolean;
    isEventStream: boolean;
    isRawString: boolean;
    xmlName?: string;
  };

  const headerProps: HeaderProp[] = [];
  const prefixHeaderProps: PrefixHeaderProp[] = [];
  let outputPayloadProp: PayloadProp | undefined;
  let responseCodePropName: string | undefined;

  for (const prop of outputProps) {
    const name = String(prop.name);
    const header = getHttpHeader(prop);
    const prefixHeader = getHttpPrefixHeaders(prop);
    const annotations = getPropAnnotations(prop);

    if (annotations.responseCode) {
      // Property bound to HTTP response status code
      responseCodePropName = name;
    } else if (header) {
      headerProps.push({
        name,
        header,
        headerLower: header.toLowerCase(),
        isNumber: isNumberAST(prop.type),
        isBoolean: isBooleanAST(prop.type),
      });
    } else if (prefixHeader) {
      prefixHeaderProps.push({ name, prefix: prefixHeader.toLowerCase() });
    } else if (hasHttpPayload(prop)) {
      const unwrapped = unwrapUnion(prop.type);
      outputPayloadProp = {
        name,
        type: prop.type,
        isStreaming: isStreamingType(prop.type),
        isEventStream: isOutputEventStream(prop.type),
        isRawString:
          unwrapped._tag === "Union" || unwrapped._tag === "StringKeyword",
        // Use property name as fallback when type annotations aren't preserved
        // (e.g., when using Schema.pipe to add HttpPayload annotation)
        xmlName:
          getXmlNameFromAST(prop.type) ?? getIdentifier(prop.type) ?? name,
      };
    }
  }

  return {
    serializeRequest: Effect.fn(function* (input: unknown) {
      // Encode the input via schema - handles all transformations
      const encoded = yield* encodeInput(input);

      const request: Request = {
        method: "POST",
        path: "/",
        query: {},
        headers: {},
      };

      applyHttpTrait(inputAst, request);
      const { payloadValue, payloadAst, bodyMembers, hasBodyMembers } =
        bindInputToRequest(
          inputAst,
          encoded as Record<string, unknown>,
          request,
        );
      extractStaticQueryParams(request);

      // Serialize body
      if (payloadValue !== undefined && payloadAst !== undefined) {
        if (payloadIsStreaming) {
          request.body = convertStreamingInput(
            payloadValue as StreamingInputBody,
          );
        } else if (typeof payloadValue === "string") {
          request.body = payloadValue;
        } else {
          request.headers["Content-Type"] = "application/xml";
          request.body = serializeValue(
            payloadAst,
            payloadValue,
            payloadXmlName,
            inputXmlNamespace,
          );
        }
      } else if (hasBodyMembers) {
        request.headers["Content-Type"] = "application/xml";
        const tagName = getIdentifier(inputAst);
        request.body = serializeObject(
          inputAst,
          bodyMembers,
          tagName,
          getXmlNamespace(inputAst),
        );
      }

      return request;
    }),

    deserializeResponse: Effect.fn(function* (response: Response) {
      const result: Record<string, unknown> = {};

      // Extract HTTP response status code if bound to a property
      if (responseCodePropName) {
        result[responseCodePropName] = response.status;
      }

      // Extract header-bound properties using pre-computed metadata
      for (const hp of headerProps) {
        const v =
          response.headers[hp.headerLower] ?? response.headers[hp.header];
        if (v !== undefined) {
          result[hp.name] = hp.isNumber
            ? Number(v)
            : hp.isBoolean
              ? v === "true"
              : v;
        }
      }

      // Extract prefix header properties
      for (const php of prefixHeaderProps) {
        const prefixed: Record<string, string> = {};
        for (const [k, v] of Object.entries(response.headers)) {
          if (k.toLowerCase().startsWith(php.prefix)) {
            prefixed[k.slice(php.prefix.length)] = v;
          }
        }
        if (Object.keys(prefixed).length) result[php.name] = prefixed;
      }

      // Handle streaming output payload - return early
      if (outputPayloadProp?.isStreaming) {
        if (outputPayloadProp.isEventStream && response.body) {
          // Parse event stream with XML payload parser
          const xmlPayloadParser: PayloadParser = (payload: Uint8Array) => {
            const text = new TextDecoder().decode(payload);
            if (!text) return {};
            try {
              return parseXml(text);
            } catch {
              return { payload: text };
            }
          };
          result[outputPayloadProp.name] = parseEventStreamToUnion(
            response.body as ReadableStream<Uint8Array>,
            xmlPayloadParser,
          );
        } else {
          // Raw streaming output (blob)
          result[outputPayloadProp.name] = readableToEffectStream(
            response.body,
          );
        }
        return result;
      }

      // Non-streaming response - read body as text
      const bodyText = yield* readStreamAsText(response.body);

      // Handle httpPayload property
      if (outputPayloadProp && bodyText) {
        if (outputPayloadProp.isRawString) {
          result[outputPayloadProp.name] = bodyText;
        } else {
          const parsed = parseXml(bodyText);
          result[outputPayloadProp.name] = deserializeValue(
            outputPayloadProp.type,
            outputPayloadProp.xmlName
              ? (parsed[outputPayloadProp.xmlName] ?? parsed)
              : parsed,
          );
        }
      }

      // Parse body XML for non-payload properties
      if (bodyText && !outputPayloadProp) {
        const parsed = parseXml(bodyText);
        const rawContent = outputXmlName ? parsed[outputXmlName] : parsed;

        if (isUnwrappedOutput && unwrappedPropName) {
          const textContent = extractTextContent(rawContent);
          if (textContent !== undefined) {
            result[String(unwrappedPropName)] = textContent;
          }
        } else if (rawContent && typeof rawContent === "object") {
          Object.assign(
            result,
            deserializeObject(outputAst, rawContent as Record<string, unknown>),
          );
        }
      }

      return result;
    }),

    deserializeError: Effect.fn(function* (response: Response) {
      // Read body as text
      const bodyText = yield* readStreamAsText(response.body);

      if (!bodyText) {
        return yield* new ParseError({ message: "Empty error response body" });
      }

      // Check if this is an HTML error response (e.g., S3 503 Slow Down)
      // Format: <html>...<li>Code: SlowDown</li><li>Message: ...</li>...</html>
      if (bodyText.trimStart().toLowerCase().startsWith("<html")) {
        const htmlError = parseHtmlError(bodyText);
        if (htmlError) {
          return htmlError;
        }
        // HTML response without parseable error - don't try XML parsing
        return yield* new ParseError({
          message: `Could not parse HTML error response: ${bodyText}`,
        });
      }

      // Parse XML body
      const parsed = parseXml(bodyText);

      // restXml error structure:
      // Default: <ErrorResponse><Error><Code>...</Code><Message>...</Message>...</Error><RequestId>...</RequestId></ErrorResponse>
      // With noErrorWrapping: <Error><Code>...</Code><Message>...</Message>...</Error>
      // Note: noErrorWrapping is a protocol trait, but we handle both formats for flexibility
      let errorContent: Record<string, unknown> | undefined;

      // Try wrapped format first: <ErrorResponse><Error>...</Error></ErrorResponse>
      if (parsed.ErrorResponse && typeof parsed.ErrorResponse === "object") {
        const errorResponse = parsed.ErrorResponse as Record<string, unknown>;
        if (errorResponse.Error && typeof errorResponse.Error === "object") {
          errorContent = errorResponse.Error as Record<string, unknown>;
        }
      }

      // Try unwrapped format: <Error>...</Error>
      if (!errorContent && parsed.Error && typeof parsed.Error === "object") {
        errorContent = parsed.Error as Record<string, unknown>;
      }

      if (!errorContent) {
        return yield* new ParseError({
          message: `Could not find Error element in XML response: ${bodyText}`,
        });
      }

      // Extract error code from <Code> element
      const rawErrorCode = errorContent.Code;
      if (typeof rawErrorCode !== "string") {
        return yield* new ParseError({
          message: `No Code element found in error response: ${bodyText}`,
        });
      }

      const errorCode = sanitizeErrorCode(rawErrorCode);

      // Extract remaining data (remove Code, keep Message, Type, RequestId, etc.)
      const { Code: _Code, ...data } = errorContent;

      return { errorCode, data };
    }),
  };
};

// =============================================================================
// XML Serialization
// =============================================================================

function serializeValue(
  ast: AST.AST,
  value: unknown,
  tagName?: string,
  xmlns?: string,
): string {
  if (value == null) return "";

  // Primitives and Dates
  if (typeof value !== "object") {
    const content = escapeXml(String(value));
    return tagName ? wrapTag(tagName, content, xmlns) : content;
  }

  if (value instanceof Date) {
    const content = formatTimestamp(value, getTimestampFormatFromAST(ast));
    return tagName ? wrapTag(tagName, content, xmlns) : content;
  }

  // Arrays
  if (Array.isArray(value)) {
    const elementAST = getArrayElementAST(ast);
    const tag = tagName ?? (elementAST && getIdentifier(elementAST));
    return value
      .map((item, i) =>
        serializeValue(
          elementAST ?? ast,
          item,
          tag,
          i === 0 ? xmlns : undefined,
        ),
      )
      .join("");
  }

  // Objects
  return serializeObject(ast, value as Record<string, unknown>, tagName, xmlns);
}

function serializeObject(
  ast: AST.AST,
  value: Record<string, unknown>,
  tagName?: string,
  xmlns?: string,
): string {
  const props = getEncodedPropertySignatures(ast);
  const attrs: string[] = [];
  const elems: string[] = [];

  for (const prop of props) {
    const key = String(prop.name);
    const v = value[key];
    if (v === undefined) continue;

    if (hasXmlAttribute(prop)) {
      attrs.push(`${getXmlNameProp(prop) ?? key}="${escapeXml(String(v))}"`);
      continue;
    }

    const xmlName = getXmlNameProp(prop) ?? key;
    if (!Array.isArray(v)) {
      elems.push(serializeValue(prop.type, v, xmlName));
      continue;
    }

    const elementAST = getArrayElementAST(prop.type);
    if (hasXmlFlattened(prop)) {
      elems.push(
        v
          .map((item) => serializeValue(elementAST ?? prop.type, item, xmlName))
          .join(""),
      );
    } else {
      // Use xmlName trait first, then fall back to class identifier
      const itemTag =
        elementAST &&
        (getXmlNameFromAST(elementAST) ?? getIdentifier(elementAST));
      elems.push(
        `<${xmlName}>${v.map((item) => serializeValue(elementAST ?? prop.type, item, itemTag)).join("")}</${xmlName}>`,
      );
    }
  }

  if (!tagName) return elems.join("");

  const ns = xmlns ?? getXmlNamespace(ast);
  const attrStr =
    (ns ? ` xmlns="${escapeXml(ns)}"` : "") +
    (attrs.length ? ` ${attrs.join(" ")}` : "");
  return `<${tagName}${attrStr}>${elems.join("")}</${tagName}>`;
}

// =============================================================================
// XML Deserialization
// =============================================================================

function deserializeValue(ast: AST.AST, value: unknown): unknown {
  if (value == null || value === "") return undefined;

  // Handle empty objects (from empty XML elements) - treat as undefined
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  ) {
    return undefined;
  }

  if (isArrayAST(ast)) {
    const elAST = getArrayElementAST(ast);
    if (!elAST) return Array.isArray(value) ? value : [value];

    // Handle wrapped arrays: { Item: [...] }
    // Use xmlName trait first, then fall back to class identifier
    const elTag = getXmlNameFromAST(elAST) ?? getIdentifier(elAST);
    const unwrapped = unwrapArrayValue(value, elTag);

    const items = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    return items.map((item) => deserializeValue(elAST, item));
  }

  if (typeof value === "string") {
    return deserializePrimitive(ast, value);
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return deserializeObject(ast, value as Record<string, unknown>);
  }

  return value;
}

/**
 * Extract text content from fast-xml-parser's format.
 * Handles: { "#text": "value", "@_xmlns": "..." } → "value"
 * Or: { "@_xmlns": "..." } (empty element) → undefined
 */
function extractTextContent(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value !== "object") return value;

  const obj = value as Record<string, unknown>;
  if ("#text" in obj) return obj["#text"];
  if (Object.keys(obj).every((k) => k.startsWith("@_"))) return undefined;
  return value;
}

function deserializeObject(
  ast: AST.AST,
  value: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const prop of getEncodedPropertySignatures(ast)) {
    const key = String(prop.name);

    // Skip HTTP-bound properties (headers, query, labels)
    if (
      getHttpHeader(prop) ||
      getHttpQuery(prop) ||
      hasHttpLabel(prop) ||
      getHttpPrefixHeaders(prop) ||
      hasHttpQueryParams(prop)
    )
      continue;

    if (hasHttpPayload(prop)) {
      result[key] = deserializeValue(prop.type, value);
      continue;
    }

    const xmlName = getXmlNameProp(prop) ?? key;

    // Handle XML attributes (parser prefixes attributes with @_)
    if (hasXmlAttribute(prop)) {
      const attrValue = value[`@_${xmlName}`];
      if (attrValue !== undefined) {
        result[key] = deserializeValue(prop.type, attrValue);
      }
      continue;
    }

    const propValue = value[xmlName];
    if (propValue === undefined) continue;

    if (hasXmlFlattened(prop) && isArrayAST(prop.type)) {
      const elAST = getArrayElementAST(prop.type) ?? prop.type;
      const items = Array.isArray(propValue) ? propValue : [propValue];
      result[key] = items.map((item) => deserializeValue(elAST, item));
    } else {
      const deserialized = deserializeValue(prop.type, propValue);
      // Only assign if not undefined (empty XML elements become undefined)
      if (deserialized !== undefined) {
        result[key] = deserialized;
      }
    }
  }

  return result;
}

/**
 * Parse HTML error responses (e.g., S3 503 Slow Down rate limiting).
 * Format: <html>...<li>Code: SlowDown</li><li>Message: ...</li>...</html>
 */
function parseHtmlError(
  html: string,
): { errorCode: string; data: Record<string, unknown> } | undefined {
  // Extract <li>Key: Value</li> pairs
  const liPattern = /<li>([^:]+):\s*([^<]*)<\/li>/gi;
  const data: Record<string, string> = {};
  let errorCode: string | undefined;

  let match: RegExpExecArray | null;
  while ((match = liPattern.exec(html)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (key === "Code") {
      errorCode = sanitizeErrorCode(value);
    } else {
      data[key] = value;
    }
  }

  if (!errorCode) return undefined;

  return { errorCode, data };
}

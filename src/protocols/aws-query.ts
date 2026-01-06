/**
 * AWS Query Protocol Implementation
 *
 * https://smithy.io/2.0/aws/protocols/aws-query-protocol.html
 *
 * Key differences from EC2 Query:
 * - Query key uses xmlName directly (not capitalized like EC2)
 * - Lists use .member.N format by default (not flattened)
 * - Maps use .entry.N.key and .entry.N.value format
 * - Response has {Op}Result wrapper inside {Op}Response
 * - Errors wrapped in <ErrorResponse><Error>...</Error><RequestId>...</RequestId></ErrorResponse>
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
  getServiceVersion,
  getXmlName,
  getXmlNameProp,
  hasXmlAttribute,
  hasXmlFlattened,
} from "../traits.ts";
import {
  getArrayElementAST,
  getEncodedPropertySignatures,
  getIdentifier,
  getMapKeyValueAST,
  isArrayAST,
  isMapAST,
} from "../util/ast.ts";
import { sanitizeErrorCode } from "../util/error.ts";
import { readStreamAsText } from "../util/stream.ts";
import {
  deserializePrimitive,
  extractXmlRoot,
  parseXml,
  unwrapArrayValue,
} from "../util/xml.ts";

// =============================================================================
// Protocol Export
// =============================================================================

export const awsQueryProtocol: Protocol = (
  operation: Operation,
): ProtocolHandler => {
  const inputSchema = operation.input;
  const outputSchema = operation.output;
  const inputAst = inputSchema.ast;
  const outputAst = outputSchema.ast;

  // Pre-compute encoder (done once at init)
  const encodeInput = S.encode(inputSchema);

  // Pre-compute operation name and version from annotations
  const identifier = getIdentifier(inputAst) ?? "";
  const action = identifier.replace(/(?:Request|Input)$/, "");
  const version = getServiceVersion(inputAst) ?? "";

  return {
    serializeRequest: Effect.fn(function* (input: unknown) {
      // Encode the input via schema - handles all transformations
      // (TimestampFormat → ISO 8601 strings, etc.)
      const encoded = yield* encodeInput(input);

      const request: Request = {
        method: "POST",
        path: "/",
        query: {},
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };

      // Build form-urlencoded body
      const params: string[] = [];
      params.push(`Action=${encodeURIComponent(action)}`);
      params.push(`Version=${encodeURIComponent(version)}`);

      // Serialize already-encoded input members
      serializeMembers(
        inputAst,
        encoded as Record<string, unknown>,
        "",
        params,
      );

      request.body = params.join("&");

      return request;
    }),

    deserializeResponse: Effect.fn(function* (response: Response) {
      const result: Record<string, unknown> = {};

      // Read body as text
      const bodyText = yield* readStreamAsText(response.body);

      // Parse body XML
      if (bodyText) {
        const parsed = parseXml(bodyText);

        // AWS Query response structure:
        // <{OperationName}Response xmlns="...">
        //   <{OperationName}Result>
        //     ...actual content...
        //   </{OperationName}Result>
        //   <ResponseMetadata>
        //     <RequestId>...</RequestId>
        //   </ResponseMetadata>
        // </{OperationName}Response>

        let content = extractXmlRoot(parsed);

        // Look for the Result wrapper inside the Response
        if (content && typeof content === "object") {
          // Find the *Result key (e.g., GetUserResult, ListUsersResult)
          const resultKey = Object.keys(content).find((k) =>
            k.endsWith("Result"),
          );
          if (resultKey) {
            content = content[resultKey] as Record<string, unknown>;
          }
        }

        if (content && typeof content === "object") {
          Object.assign(result, deserializeObject(outputAst, content));
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

      // Parse XML body
      const parsed = parseXml(bodyText);

      // AWS Query error structure:
      // <ErrorResponse>
      //   <Error>
      //     <Type>Sender</Type>
      //     <Code>InvalidGreeting</Code>
      //     <Message>Hi</Message>
      //     ...other members...
      //   </Error>
      //   <RequestId>xxx</RequestId>
      // </ErrorResponse>

      let errorContent: Record<string, unknown> | undefined;
      let requestId: string | undefined;

      if (parsed.ErrorResponse && typeof parsed.ErrorResponse === "object") {
        const errorResponse = parsed.ErrorResponse as Record<string, unknown>;
        if (errorResponse.Error && typeof errorResponse.Error === "object") {
          errorContent = errorResponse.Error as Record<string, unknown>;
        }
        if (typeof errorResponse.RequestId === "string") {
          requestId = errorResponse.RequestId;
        }
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

      // Extract remaining data (remove Code, keep Message, Type, etc.)
      const { Code: _code, ...data } = errorContent;

      // Include RequestId if present
      if (requestId) {
        data.RequestId = requestId;
      }

      return { errorCode, data };
    }),
  };
};

// =============================================================================
// Query String Serialization
// =============================================================================

/**
 * Get the query key name for a member following AWS Query key resolution:
 * 1. Use xmlName trait if present
 * 2. Use member name (no capitalization, unlike EC2)
 */
function getQueryKeyName(prop: AST.PropertySignature): string {
  const xmlName = getXmlNameProp(prop);
  if (xmlName) return xmlName;

  return String(prop.name);
}

/**
 * Serialize object members to query parameters
 */
function serializeMembers(
  ast: AST.AST,
  input: Record<string, unknown>,
  prefix: string,
  params: string[],
): void {
  for (const prop of getEncodedPropertySignatures(ast)) {
    const memberName = String(prop.name);
    const value = input[memberName];
    if (value === undefined || value === null) continue;

    const queryKey = getQueryKeyName(prop);
    const fullKey = prefix ? `${prefix}.${queryKey}` : queryKey;

    serializeValue(prop.type, value, fullKey, params, prop);
  }
}

/**
 * Serialize a value to query parameters.
 * Values are already encoded (dates as ISO 8601 strings, etc.)
 */
function serializeValue(
  ast: AST.AST,
  value: unknown,
  key: string,
  params: string[],
  prop?: AST.PropertySignature,
): void {
  if (value === undefined || value === null) return;

  // Handle primitives (includes encoded dates as strings, blobs as base64)
  // Blob schema transforms Uint8Array → base64 string during encoding
  if (typeof value !== "object") {
    params.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
    return;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    // Empty arrays are not serialized
    if (value.length === 0) return;

    const elementAST = getArrayElementAST(ast);
    const isFlattened = prop ? hasXmlFlattened(prop) : false;

    // AWS Query uses "member" as default for list elements
    // xmlName trait on the element AST can override this
    const elementTag = elementAST
      ? (getXmlName(elementAST) ?? "member")
      : "member";

    for (let i = 0; i < value.length; i++) {
      // AWS Query format: Key.member.N for non-flattened, Key.N for flattened
      const itemKey = isFlattened
        ? `${key}.${i + 1}`
        : `${key}.${elementTag}.${i + 1}`;
      serializeValue(elementAST ?? ast, value[i], itemKey, params);
    }
    return;
  }

  // Handle maps
  if (isMapAST(ast)) {
    const mapValue = value as Record<string, unknown>;
    const entries = Object.entries(mapValue);
    if (entries.length === 0) return;

    const { keyAST, valueAST } = getMapKeyValueAST(ast) ?? {};
    const isFlattened = prop ? hasXmlFlattened(prop) : false;

    // Get custom key/value names if specified via xmlName trait on the schema
    const keyName = keyAST ? (getXmlName(keyAST) ?? "key") : "key";
    const valueName = valueAST ? (getXmlName(valueAST) ?? "value") : "value";

    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i];
      // AWS Query format: Key.entry.N.key/value for non-flattened
      // Flattened: Key.N.key/value
      const entryPrefix = isFlattened
        ? `${key}.${i + 1}`
        : `${key}.entry.${i + 1}`;
      params.push(
        `${encodeURIComponent(`${entryPrefix}.${keyName}`)}=${encodeURIComponent(String(k))}`,
      );
      serializeValue(valueAST ?? ast, v, `${entryPrefix}.${valueName}`, params);
    }
    return;
  }

  // Handle objects (nested structures)
  if (typeof value === "object") {
    serializeMembers(ast, value as Record<string, unknown>, key, params);
  }
}

// =============================================================================
// XML Deserialization
// =============================================================================

function deserializeValue(ast: AST.AST, value: unknown): unknown {
  if (value == null || value === "") return undefined;

  // Handle maps - must check before general object handling
  if (isMapAST(ast)) {
    return deserializeMap(ast, value);
  }

  // Handle arrays
  if (isArrayAST(ast)) {
    const elAST = getArrayElementAST(ast);
    if (!elAST) return Array.isArray(value) ? value : [value];

    // Handle wrapped arrays: { member: [...] } or { Item: [...] }
    const elTag = getXmlName(elAST) ?? getIdentifier(elAST);
    const unwrapped = unwrapArrayValue(value, elTag, ["member"]);

    const items = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    return items.map((item) => deserializeValue(elAST, item));
  }

  // Handle strings
  if (typeof value === "string") {
    return deserializePrimitive(ast, value);
  }

  // Handle numbers/booleans from parser
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  // Handle objects
  if (typeof value === "object" && !Array.isArray(value)) {
    return deserializeObject(ast, value as Record<string, unknown>);
  }

  return value;
}

function deserializeObject(
  ast: AST.AST,
  value: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const prop of getEncodedPropertySignatures(ast)) {
    const key = String(prop.name);
    const xmlName = getXmlNameProp(prop) ?? key;

    // Handle XML attributes (parser prefixes attributes with @_)
    if (hasXmlAttribute(prop)) {
      const attrValue = value[`@_${xmlName}`];
      if (attrValue !== undefined) {
        result[key] = deserializeValue(prop.type, attrValue);
      }
      continue;
    }

    // Try member name first, then xmlName
    let propValue = value[key] ?? value[xmlName];

    if (propValue === undefined) continue;

    // Handle arrays
    if (isArrayAST(prop.type)) {
      const elAST = getArrayElementAST(prop.type) ?? prop.type;

      // Handle empty elements - XML parser returns "" for <Tags />
      if (propValue === "" || propValue === null) {
        result[key] = [];
        continue;
      }

      // Unwrap list wrapper elements from XML parser output
      const elTag = getXmlName(elAST) ?? getIdentifier(elAST);
      const arrayValue = unwrapArrayValue(propValue, elTag, ["member"]);

      // Handle empty unwrapped arrays or empty objects (no member elements)
      if (
        arrayValue === "" ||
        arrayValue === null ||
        arrayValue === undefined ||
        (typeof arrayValue === "object" &&
          !Array.isArray(arrayValue) &&
          Object.keys(arrayValue as object).length === 0)
      ) {
        result[key] = [];
        continue;
      }

      const items = Array.isArray(arrayValue) ? arrayValue : [arrayValue];
      // Filter out undefined/null items that may come from empty member elements
      result[key] = items
        .filter((item) => item !== undefined && item !== null && item !== "")
        .map((item) => deserializeValue(elAST, item));
    } else {
      result[key] = deserializeValue(prop.type, propValue);
    }
  }

  return result;
}

/**
 * Deserialize AWS Query XML map format: <entry><key>K</key><value>V</value></entry>
 * Handles empty values (from self-closing <value /> tags) by converting to empty strings.
 */
function deserializeMap(ast: AST.AST, value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) return {};

  const { keyAST, valueAST } = getMapKeyValueAST(ast) ?? {};
  const keyName = keyAST ? (getXmlName(keyAST) ?? "key") : "key";
  const valueName = valueAST ? (getXmlName(valueAST) ?? "value") : "value";

  const objValue = value as Record<string, unknown>;
  const entries = objValue.entry ?? objValue.Entry;
  if (entries == null) return {};

  const result: Record<string, unknown> = {};
  const entriesArray = Array.isArray(entries) ? entries : [entries];

  for (const entry of entriesArray) {
    if (!entry || typeof entry !== "object") continue;

    const entryObj = entry as Record<string, unknown>;
    const key = entryObj[keyName] as string | undefined;
    if (key === undefined) continue;

    const val = entryObj[valueName];
    // Empty XML elements (<value />) become undefined/null/"" - convert to empty string
    if (val == null || val === "") {
      result[key] = "";
    } else {
      const deserialized = valueAST ? deserializeValue(valueAST, val) : val;
      result[key] = deserialized ?? "";
    }
  }

  return result;
}

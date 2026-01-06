/**
 * AWS restJson1 Protocol Implementation
 *
 * https://smithy.io/2.0/aws/protocols/aws-restjson1-protocol.html
 *
 * Key characteristics:
 * - JSON payloads with HTTP binding traits
 * - jsonName trait for custom property names
 * - Default timestamp format is epoch-seconds
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as AST from "effect/SchemaAST";
import type * as Stream from "effect/Stream";
import type { Operation } from "../client/operation.ts";
import type { Protocol, ProtocolHandler } from "../client/protocol.ts";
import type { Request } from "../client/request.ts";
import type { Response } from "../client/response.ts";
import {
  applyApiGatewayCustomizations,
  isApiGateway,
} from "../customizations/api-gateway.ts";
import {
  applyGlacierCustomizations,
  isGlacier,
} from "../customizations/glacier.ts";
import { ParseError } from "../errors.ts";
import { parseEventStreamToUnion } from "../eventstream/parser.ts";
import {
  serializeInputEventStream,
  serializeInputEventStreamWithPayloads,
  type InputEvent,
} from "../eventstream/serializer.ts";
import {
  getAwsApiService,
  getEventPayloadMap,
  getEventSchema,
  getHttpHeader,
  getHttpPrefixHeaders,
  getPropAnnotations,
  getServiceVersion,
  hasHttpPayload,
  isInputEventStream,
  isOutputEventStream,
  isStreamingType,
  type StreamingInputBody,
} from "../traits.ts";
import {
  getEncodedPropertySignatures,
  isBooleanAST,
  isNumberAST,
} from "../util/ast.ts";
import {
  extractJsonErrorCode,
  extractJsonErrorData,
  sanitizeErrorCode,
} from "../util/error.ts";
import { extractStaticQueryParams } from "../util/query-params.ts";
import { applyHttpTrait, bindInputToRequest } from "../util/serialize-input.ts";
import {
  convertStreamingInput,
  isEffectStream,
  readableToEffectStream,
  readStreamAsText,
} from "../util/stream.ts";

export const restJson1Protocol: Protocol = (
  operation: Operation,
): ProtocolHandler => {
  const inputSchema = operation.input;
  const outputSchema = operation.output;
  const inputAst = inputSchema.ast;
  const outputAst = outputSchema.ast;

  // Pre-compute encoder (done once at init)
  const encodeInput = Schema.encode(inputSchema);

  // Check for service-specific customizations (done once at init)
  const serviceInfo = getAwsApiService(inputAst);
  const isApiGatewayService = isApiGateway(serviceInfo?.sdkId);
  const isGlacierService = isGlacier(serviceInfo?.sdkId);
  const serviceVersion = getServiceVersion(inputAst);

  // Pre-classify output properties by their HTTP binding (done once at init)
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
    isStreaming: boolean;
    isRaw: boolean;
    isEventStream: boolean;
    eventSchema?: Schema.Schema<unknown>;
  };

  const headerProps: HeaderProp[] = [];
  const prefixHeaderProps: PrefixHeaderProp[] = [];
  let outputPayloadProp: PayloadProp | undefined;
  let responseCodePropName: string | undefined;

  for (const prop of getEncodedPropertySignatures(outputAst)) {
    const name = String(prop.name);
    const header = getHttpHeader(prop);
    const prefix = getHttpPrefixHeaders(prop);
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
    } else if (prefix) {
      prefixHeaderProps.push({ name, prefix: prefix.toLowerCase() });
    } else if (hasHttpPayload(prop)) {
      const isEventStream = isOutputEventStream(prop.type);
      outputPayloadProp = {
        name,
        isStreaming: isStreamingType(prop.type),
        isRaw: isRawPayload(prop.type),
        isEventStream,
        eventSchema: isEventStream ? getEventSchema(prop.type) : undefined,
      };
    } else if (isStreamingType(prop.type)) {
      // Streaming members (including event streams) implicitly become the payload
      const isEventStream = isOutputEventStream(prop.type);
      outputPayloadProp = {
        name,
        isStreaming: true,
        isRaw: false,
        isEventStream,
        eventSchema: isEventStream ? getEventSchema(prop.type) : undefined,
      };
    }
  }

  return {
    serializeRequest: Effect.fn(function* (input: unknown) {
      const encoded = yield* encodeInput(input);

      let request: Request = {
        method: "POST",
        path: "/",
        query: {},
        headers: { "Content-Type": "application/json" },
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
        // Check for input event stream - a streaming type where the user provided an Effect Stream
        // This happens when a streaming union (T.EventStream) is used in an input context
        const isInputEventStreamPayload =
          (isInputEventStream(payloadAst) || isStreamingType(payloadAst)) &&
          isEffectStream(payloadValue);

        if (isInputEventStreamPayload) {
          // Input event stream - serialize each event to wire format
          const eventPayloadMap = getEventPayloadMap(payloadAst);
          if (eventPayloadMap && Object.keys(eventPayloadMap).length > 0) {
            request.body = serializeInputEventStreamWithPayloads(
              payloadValue as Stream.Stream<InputEvent, unknown>,
              eventPayloadMap,
            );
          } else {
            request.body = serializeInputEventStream(
              payloadValue as Stream.Stream<InputEvent, unknown>,
            );
          }
          // Set content type for event streams
          request.headers["Content-Type"] =
            "application/vnd.amazon.eventstream";
        } else if (isStreamingType(payloadAst)) {
          request.body = convertStreamingInput(
            payloadValue as StreamingInputBody,
          );
        } else if (isRawPayload(payloadAst)) {
          request.body = payloadValue as string;
        } else {
          request.body = JSON.stringify(payloadValue);
        }
      } else if (hasBodyMembers) {
        request.body = JSON.stringify(bodyMembers);
      }

      // Apply API Gateway customizations
      if (isApiGatewayService) {
        request = applyApiGatewayCustomizations(request);
      }

      // Apply Glacier customizations
      if (isGlacierService && serviceVersion) {
        request = applyGlacierCustomizations(request, serviceVersion);
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
          // Convert string header values to appropriate types
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
          // Parse event stream - converts raw bytes to typed union events
          result[outputPayloadProp.name] = parseEventStreamToUnion(
            response.body as ReadableStream<Uint8Array>,
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

      // Handle httpPayload with raw body
      if (outputPayloadProp?.isRaw && bodyText) {
        result[outputPayloadProp.name] = bodyText;
      }

      // Parse JSON body (reviver converts null → undefined since AWS returns null for absent fields)
      if (bodyText) {
        try {
          const parsed = JSON.parse(bodyText, (_, v) =>
            v === null ? undefined : v,
          );
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            Object.assign(result, parsed);
          }
        } catch {
          return yield* new ParseError({
            message: `Failed to parse JSON body: ${bodyText}`,
          });
        }
      }

      return result;
    }),

    deserializeError: Effect.fn(function* (response: Response) {
      // Read body as text
      const bodyText = yield* readStreamAsText(response.body);

      // Parse JSON body (reviver converts null → undefined)
      let body: Record<string, unknown> = {};
      if (bodyText) {
        try {
          const parsed = JSON.parse(bodyText, (_, v) =>
            v === null ? undefined : v,
          );
          if (parsed && typeof parsed === "object") {
            body = parsed as Record<string, unknown>;
          }
        } catch {
          return yield* new ParseError({
            message: `Failed to parse error JSON body: ${bodyText}`,
          });
        }
      }

      // Extract error code: check X-Amzn-Errortype header first, then body fields
      const rawErrorCode =
        response.headers["x-amzn-errortype"] ??
        response.headers["X-Amzn-Errortype"] ??
        extractJsonErrorCode(body);

      if (!rawErrorCode) {
        return yield* new ParseError({
          message: `No error code found in response. Headers: ${JSON.stringify(response.headers)}, Body: ${bodyText}`,
        });
      }

      // Sanitize the error code
      const errorCode = sanitizeErrorCode(rawErrorCode);

      // Extract data (remove __type and code fields)
      // Note: Error shapes can have HTTP bindings (httpHeader, etc.) but we extract
      // those in the response-parser when matching against error schemas
      const data = extractJsonErrorData(body);

      return { errorCode, data };
    }),
  };
};

/** Check if AST represents a raw payload type (string, blob, stream) */
function isRawPayload(ast: AST.AST): boolean {
  if (isStreamingType(ast)) return true;
  if (ast._tag === "StringKeyword") return true;
  if (AST.isUnion(ast)) return ast.types.some(isRawPayload);
  return false;
}

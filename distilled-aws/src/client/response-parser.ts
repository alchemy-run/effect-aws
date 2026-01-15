/**
 * Response Parser - wraps Protocol to parse responses.
 *
 * This layer:
 * 1. Uses the Protocol to deserialize the response
 * 2. Applies schema decoding/validation
 * 3. Handles error responses
 * 4. Delegates event stream parsing to stream-parser.ts
 *
 * This is independently testable without making HTTP requests.
 */

import * as Effect from "effect/Effect";
import * as ParseResult from "effect/ParseResult";
import * as Schema from "effect/Schema";
import { COMMON_ERRORS, UnknownAwsError } from "../errors.ts";
import { getAwsQueryError, getHttpHeader, getProtocol } from "../traits.ts";
import { getIdentifier, getPropertySignatures } from "../util/ast.ts";
import type { Operation } from "./operation.ts";
import type { Protocol, ProtocolHandler } from "./protocol.ts";
import type { Response } from "./response.ts";
import { makeStreamParser } from "./stream-parser.ts";

export interface ResponseParserOptions {
  /** Override the protocol (otherwise discovered from schema annotations) */
  protocol?: Protocol;
  /** Skip schema validation - returns raw deserialized response */
  skipValidation?: boolean;
  /** AWS service SDK ID for error context (e.g., "S3", "DynamoDB") */
  service?: string;
  /** Operation name for error context (e.g., "createBucket", "putObject") */
  operation?: string;
}

export type ResponseParser<A, R> = (
  response: Response,
) => Effect.Effect<A, ParseResult.ParseError, R>;

/**
 * Create a response parser for a given operation.
 *
 * Expensive work (protocol discovery, preprocessing) is done once at creation time.
 *
 * @param operation - The operation (with input/output schemas and protocol annotations)
 * @param options - Optional overrides
 * @returns A function that parses responses
 */
export const makeResponseParser = <A>(
  operation: Operation,
  options?: ResponseParserOptions,
) => {
  const inputAst = operation.input.ast;
  const outputSchema = operation.output;
  const outputAst = outputSchema.ast;

  // Discover protocol factory from annotations or use override (done once)
  const protocolFactory = options?.protocol ?? getProtocol(inputAst);
  if (!protocolFactory) {
    throw new Error("No protocol found on input schema");
  }

  // Create the protocol handler (preprocessing done once)
  const protocol: ProtocolHandler = protocolFactory(operation as Operation);

  // Pre-create the decoder (done once, unless skipping validation)
  const decode = options?.skipValidation
    ? undefined
    : Schema.decodeUnknown(outputSchema);

  // Create stream parser if output has event stream member (done once)
  const streamParser = makeStreamParser(outputAst);

  // Build error schema map: errorCode -> Schema (done once)
  // We register errors by multiple keys to handle AWS wire format variations:
  // 1. Schema identifier (e.g., "EntityAlreadyExistsException")
  // 2. awsQueryError code if present (e.g., "EntityAlreadyExists")
  // 3. Short form without Exception/Error suffix (for services that return short codes)
  const errorSchemas = new Map<string, Schema.Schema.AnyNoContext>();

  const registerError = (err: Schema.Schema.AnyNoContext) => {
    const tag = getIdentifier(err.ast);
    if (tag) {
      errorSchemas.set(tag, err);
      // Also register short form (strip Exception/Error suffix)
      for (const suffix of ["Exception", "Error"]) {
        if (tag.endsWith(suffix)) {
          errorSchemas.set(tag.slice(0, -suffix.length), err);
          break;
        }
      }
    }
    // Also register by awsQueryError code if present (for aws-query/ec2-query protocols)
    const queryError = getAwsQueryError(err.ast);
    if (queryError?.code) errorSchemas.set(queryError.code, err);
  };

  for (const err of operation.errors ?? []) {
    registerError(err);
  }
  for (const err of COMMON_ERRORS) {
    registerError(err);
  }

  // Return a function that parses responses
  return Effect.fn(function* (response: Response) {
    // Success path
    if (response.status >= 200 && response.status < 300) {
      const deserialized = (yield* protocol.deserializeResponse(response)) as
        | Record<string, unknown>
        | undefined;

      // If the output has an event stream member, parse and decode it
      const stream = streamParser?.(deserialized);
      if (stream) {
        return stream as A;
      }

      // Skip validation if requested - return raw deserialized response
      if (!decode) {
        return deserialized as A;
      }

      return yield* decode(deserialized);
    }

    // Error path
    const { errorCode, data } = yield* protocol.deserializeError(response);
    const errorSchema = errorSchemas.get(errorCode);

    if (errorSchema) {
      // Extract headers for error members with HttpHeader traits
      // This handles error fields not in the body (e.g., x-amz-bucket-region)
      const errorProps = getPropertySignatures(errorSchema.ast);
      for (const prop of errorProps) {
        const headerName = getHttpHeader(prop);
        if (headerName) {
          const headerValue = response.headers[headerName.toLowerCase()];
          if (headerValue !== undefined) {
            (data as Record<string, unknown>)[String(prop.name)] = headerValue;
          }
        }
      }

      // Get the schema identifier to use as _tag (may differ from wire errorCode)
      // e.g., wire code "EntityAlreadyExists" maps to schema tag "EntityAlreadyExistsException"
      const schemaTag = getIdentifier(errorSchema.ast) ?? errorCode;
      // Add _tag to data for TaggedError decoding
      const dataWithTag = { _tag: schemaTag, ...data };
      const decoded = yield* Schema.decodeUnknown(errorSchema)(
        dataWithTag,
      ).pipe(Effect.catchAll(() => Effect.succeed(dataWithTag)));
      return yield* Effect.fail(decoded);
    }

    return yield* Effect.fail(
      new UnknownAwsError({
        errorTag: errorCode,
        errorData: data,
        service: options?.service,
        operation: options?.operation,
      }),
    );
  });
};

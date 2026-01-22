/**
 * Request Builder - wraps Protocol and Middleware to build complete requests.
 *
 * This layer:
 * 1. Fills in idempotency tokens with generated UUIDs if not provided
 * 2. Uses the Protocol to serialize the input into a Request
 * 3. Applies middleware (e.g., checksum computation, streaming body handling)
 * 4. Adds common headers
 *
 * This is independently testable without making HTTP requests.
 */

import * as Effect from "effect/Effect";
import { makeStreamingBodyMiddleware } from "../middleware/streaming-body.ts";
import { getMiddleware, getProtocol } from "../traits.ts";
import {
  fillIdempotencyTokens,
  findIdempotencyTokenProps,
} from "./generate-idempotency-tokens.ts";
import type { Operation } from "./operation.ts";
import type { Protocol, ProtocolHandler } from "./protocol.ts";

export interface RequestBuilderOptions {
  /** Override the protocol (otherwise discovered from schema annotations) */
  protocol?: Protocol;
}

/**
 * Create a request builder for a given operation.
 *
 * Expensive work (protocol/middleware discovery, preprocessing) is done once at creation time.
 *
 * @param operation - The operation (with input/output schemas and protocol annotations)
 * @param options - Optional overrides
 * @returns A function that builds requests from input values
 */
export const makeRequestBuilder = (
  operation: Operation,
  options?: RequestBuilderOptions,
) => {
  const inputSchema = operation.input;
  const inputAst = inputSchema.ast;

  // Discover protocol factory from annotations or use override (done once)
  const protocolFactory = options?.protocol ?? getProtocol(inputAst);
  if (!protocolFactory) {
    throw new Error("No protocol found on input schema");
  }

  // Create the protocol handler (preprocessing done once)
  const protocol: ProtocolHandler = protocolFactory(operation);

  // Discover middleware from annotations (done once)
  const middleware = getMiddleware(inputAst);

  // Create streaming body middleware (schema analysis done once)
  const applyStreamingBody = makeStreamingBodyMiddleware(inputSchema);

  // Find idempotency token properties (done once at creation time)
  const idempotencyTokenProps = findIdempotencyTokenProps(inputSchema);

  // Return a function that builds requests
  return Effect.fn(function* (input: unknown) {
    // Fill in any undefined idempotency tokens with generated UUIDs
    const filledInput = fillIdempotencyTokens(input, idempotencyTokenProps);

    // Serialize request using the protocol handler
    let request = yield* protocol.serializeRequest(filledInput);

    // Apply annotation-based middleware (e.g., checksum)
    for (const mw of middleware) {
      request = yield* mw(inputSchema, request);
    }

    // Apply streaming body middleware
    // Buffers streaming bodies without Content-Length to compute the length
    request = yield* applyStreamingBody(request);

    // Add common headers
    request = {
      ...request,
      headers: {
        ...request.headers,
        "User-Agent": "distilled-aws/1.0",
      },
    };

    return request;
  });
};

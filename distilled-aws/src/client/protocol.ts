import type * as Effect from "effect/Effect";
import type { ParseError } from "../errors.ts";
import type { Operation } from "./operation.ts";
import type { Request } from "./request.ts";
import type { Response } from "./response.ts";

/**
 * A ProtocolHandler is created by a Protocol factory function
 * with the operation pre-bound, allowing one-time preprocessing
 * of schema metadata (like getEncodedPropertySignatures, etc.).
 */
/**
 * Result of deserializing an error response.
 * Contains the sanitized error code and any additional data fields.
 */
export interface DeserializedError {
  /** The sanitized error code (e.g., "ValidationException") */
  errorCode: string;
  /** Additional data fields from the error response */
  data: Record<string, unknown>;
}

export interface ProtocolHandler {
  /**
   * Serialize an input object into an HTTP request.
   * @param input - The input object to serialize
   * @returns Effect yielding the serialized HTTP request
   */
  serializeRequest(input: unknown): Effect.Effect<Request, ParseError>;

  /**
   * Deserialize an HTTP response into an output object.
   * @param response - The HTTP response to deserialize
   * @returns Effect yielding the deserialized output object
   */
  deserializeResponse(response: Response): Effect.Effect<unknown, ParseError>;

  /**
   * Deserialize an error response and extract the error code and data.
   * @param response - The HTTP error response to deserialize
   * @returns Effect yielding the error code and additional data
   */
  deserializeError(
    response: Response,
  ): Effect.Effect<DeserializedError, ParseError>;
}

/**
 * A Protocol is a factory function that takes an operation
 * and returns a ProtocolHandler with pre-computed metadata.
 *
 * This allows expensive operations like getEncodedPropertySignatures
 * to be done once at initialization time rather than on every request.
 */
export type Protocol = (operation: Operation) => ProtocolHandler;

/**
 * A protocol-agnostic HTTP response representation.
 * This is what the protocol deserializer consumes.
 *
 * Body is always a ReadableStream for streaming-first architecture.
 * Protocols consume lazily - only reading when needed for parsing.
 */
export interface Response {
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Response headers */
  headers: Record<string, string>;
  /** Response body as a stream - protocols consume as needed */
  body: string | ReadableStream<Uint8Array>;
}

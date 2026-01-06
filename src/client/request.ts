/**
 * A protocol-agnostic HTTP request representation.
 * This is what the protocol serializer produces.
 */
export interface Request {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method: string;
  /** Request path (e.g., "/{Bucket}/{Key+}") */
  path: string;
  /** Query string parameters (arrays for repeated params like tagKeys=A&tagKeys=B) */
  query: Record<string, string | string[]>;
  /** HTTP headers */
  headers: Record<string, string>;
  /** Request body (undefined for GET/HEAD/DELETE without body) */
  body?: string | Uint8Array | ReadableStream;
}

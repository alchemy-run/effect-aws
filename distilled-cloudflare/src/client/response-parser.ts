/**
 * Response parser for Cloudflare API.
 *
 * Parses HTTP responses and matches errors using schema annotations.
 * Cloudflare error format: { success: boolean, errors: [{ code, message }], messages: [], result: T }
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { CloudflareHttpError, UnknownCloudflareError } from "../errors.ts";
import * as T from "../traits.ts";

/**
 * Cloudflare API response envelope.
 */
export interface CloudflareResponse<T> {
  success: boolean;
  errors: Array<{ code: number; message: string }> | null;
  messages: Array<{ code: number; message: string }> | null;
  result: T | null;
  result_info?: {
    page?: number;
    per_page?: number;
    count?: number;
    total_count?: number;
    total_pages?: number;
    cursor?: string;
  };
}

/**
 * Result of finding a matching error schema.
 */
interface MatchedError {
  schema: Schema.Schema.AnyNoContext;
  tag: string;
}

/**
 * Check if an error matches an expression-based matcher.
 */
function matchesExpression(
  matcher: T.ErrorMatcherAnnotation,
  code: number,
  status: number,
  message: string,
): boolean {
  // Code must match
  if (matcher.code !== code) return false;

  // Status must match if specified
  if (matcher.status !== undefined && matcher.status !== status) return false;

  // Message must match if specified
  if (matcher.message !== undefined) {
    if (matcher.message.includes !== undefined) {
      if (!message.includes(matcher.message.includes)) return false;
    }
    if (matcher.message.matches !== undefined) {
      if (!new RegExp(matcher.message.matches).test(message)) return false;
    }
  }

  return true;
}

/**
 * Calculate specificity score for a matcher.
 * Higher score = more specific match.
 */
function matcherSpecificity(matcher: T.ErrorMatcherAnnotation): number {
  let score = 1; // Base score for code match
  if (matcher.status !== undefined) score += 1;
  if (matcher.message !== undefined) score += 1;
  return score;
}

/**
 * Find matching error schema using annotations from the schema AST.
 *
 * Matches errors using two mechanisms:
 * 1. Expression-based matchers (T.HttpErrorMatchers) - new, preferred
 * 2. Legacy annotations (T.HttpErrorCode, T.HttpErrorCodes, etc.) - backwards compatible
 *
 * More specific matches (with status and/or message) take priority.
 */
function findMatchingError(
  errorSchemas: Map<string, Schema.Schema.AnyNoContext>,
  code: number,
  status: number,
  message: string,
): MatchedError | undefined {
  let bestMatch: MatchedError | undefined;
  let bestScore = 0;

  for (const [name, schema] of errorSchemas) {
    const ast = schema.ast;

    // Try new expression-based matchers first
    const matchers = T.getHttpErrorMatchers(ast);
    if (matchers && matchers.length > 0) {
      for (const matcher of matchers) {
        if (matchesExpression(matcher, code, status, message)) {
          const score = matcherSpecificity(matcher);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = { schema, tag: name };
          }
        }
      }
      continue; // Skip legacy matching if using new matchers
    }

    // Fall back to legacy annotations for backwards compatibility
    const expectedCodes = T.getHttpErrorCodes(ast);
    const expectedCode = T.getHttpErrorCode(ast);
    const expectedStatus = T.getHttpErrorStatus(ast);
    const expectedMessage = T.getHttpErrorMessage(ast);

    // Build codes array from either annotation
    const codes: number[] =
      expectedCodes ?? (expectedCode !== undefined ? [expectedCode] : []);

    // Must match at least one code
    if (codes.length === 0 || !codes.includes(code)) continue;

    let score = 1; // Base score for code match

    // If status specified, must match
    if (expectedStatus !== undefined) {
      if (expectedStatus !== status) continue;
      score += 1; // Bonus for status match
    }

    // If message pattern specified, must match (substring)
    if (expectedMessage !== undefined) {
      if (!message.includes(expectedMessage)) continue;
      score += 1; // Bonus for message match
    }

    // Keep best match (most specific)
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { schema, tag: name };
    }
  }

  return bestMatch;
}

/**
 * Parse multipart form-data body into a FormData object.
 *
 * Multipart format:
 * --boundary\r\n
 * Content-Disposition: form-data; name="worker.js"; filename="worker.js"\r\n
 * Content-Type: application/javascript+module\r\n
 * \r\n
 * <content>\r\n
 * --boundary\r\n
 * Content-Disposition: form-data; name="utils.js"; filename="utils.js"\r\n
 * Content-Type: application/javascript+module\r\n
 * \r\n
 * <content>\r\n
 * --boundary--\r\n
 */
function parseMultipartBody(body: Uint8Array, contentType: string): FormData {
  const formData = new FormData();

  // Extract boundary from content-type header
  const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
  if (!boundaryMatch) {
    // If no boundary found, return raw body as single entry
    formData.append("body", new Blob([new Uint8Array(body)]));
    return formData;
  }

  const boundary = boundaryMatch[1];
  const bodyText = new TextDecoder().decode(body);
  const rawParts = bodyText.split(`--${boundary}`);

  for (const part of rawParts) {
    if (part.trim() === "" || part.trim() === "--") continue;

    // Find the double newline that separates headers from content
    const headerEndIndex = part.indexOf("\r\n\r\n");
    if (headerEndIndex === -1) continue;

    // Parse headers
    const headerSection = part.slice(0, headerEndIndex);
    const headers = new Map<string, string>();
    for (const line of headerSection.split("\r\n")) {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim().toLowerCase();
        const value = line.slice(colonIndex + 1).trim();
        headers.set(key, value);
      }
    }

    // Extract name and filename from Content-Disposition
    const disposition = headers.get("content-disposition") ?? "";
    const nameMatch = disposition.match(/name="([^"]+)"/);
    const filenameMatch = disposition.match(/filename="([^"]+)"/);

    // Extract the content (trim trailing \r\n before next boundary)
    const content = part.slice(headerEndIndex + 4).replace(/\r\n$/, "");
    const partContentType =
      headers.get("content-type") ?? "application/octet-stream";
    const name = nameMatch?.[1] ?? "unknown";
    const filename = filenameMatch?.[1];

    // Create a File or Blob depending on whether we have a filename
    if (filename) {
      formData.append(
        name,
        new File([content], filename, { type: partContentType }),
      );
    } else {
      formData.append(name, new Blob([content], { type: partContentType }));
    }
  }

  return formData;
}

/**
 * Parse a Cloudflare API response.
 *
 * @param response - The HTTP response
 * @param outputSchema - Schema to decode the result
 * @param errorSchemas - Map of error names to their schema classes
 */
export const parseResponse = <O>(
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: ReadableStream<Uint8Array>;
  },
  outputSchema: Schema.Schema<O, unknown>,
  errorSchemas: Map<string, Schema.Schema.AnyNoContext>,
): Effect.Effect<O, UnknownCloudflareError | CloudflareHttpError> =>
  Effect.gen(function* () {
    // Read body as bytes
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const result = yield* Effect.promise(() => reader.read());
      if (result.done) {
        done = true;
      } else {
        chunks.push(result.value);
      }
    }

    const bodyBytes = chunks.reduce((acc, chunk) => {
      const result = new Uint8Array(acc.length + chunk.length);
      result.set(acc);
      result.set(chunk, acc.length);
      return result;
    }, new Uint8Array());

    // Check if this is a multipart response (e.g., worker script content)
    const contentType = response.headers["content-type"] ?? "";
    const isMultipart = T.getHttpMultipartResponse(outputSchema.ast) === true;
    const isActuallyMultipart = contentType.includes("multipart/form-data");

    // Only treat as multipart if:
    // 1. Content-type is actually multipart, OR
    // 2. The operation expects multipart AND response is successful (2xx)
    // This ensures error responses (404 with JSON) are handled as errors, not wrapped in FormData
    if (
      isActuallyMultipart ||
      (isMultipart && response.status >= 200 && response.status < 300)
    ) {
      // For multipart responses, return FormData
      return parseMultipartBody(bodyBytes, contentType) as unknown as O;
    }

    const bodyText = new TextDecoder().decode(bodyBytes);

    // Parse JSON
    let json: CloudflareResponse<unknown>;
    try {
      json = JSON.parse(bodyText);
    } catch {
      return yield* Effect.fail(
        new CloudflareHttpError({
          status: response.status,
          statusText: response.statusText,
          body: bodyText,
        }),
      );
    }

    // Check for success: false
    if (!json.success) {
      const errors = json.errors ?? [];
      const error = errors[0];
      if (!error) {
        return yield* Effect.fail(
          new UnknownCloudflareError({
            message:
              "There were zero errors when success: false, this is totally unexpected",
          }),
        );
      }

      // Handle case where error code is missing
      const errorCode = typeof error.code === "number" ? error.code : 0;
      const errorMessage = error.message ?? "Unknown error";

      // Find matching error using trait annotations
      const matched = findMatchingError(
        errorSchemas,
        errorCode,
        response.status,
        errorMessage,
      );

      if (matched) {
        // Decode using the schema - this properly instantiates TaggedError classes
        // Include the _tag field required by TaggedError schemas
        const errorData = {
          _tag: matched.tag,
          code: errorCode,
          message: errorMessage,
        };
        const decodeResult = yield* Schema.decodeUnknown(matched.schema)(
          errorData,
        ).pipe(
          Effect.mapError(
            () =>
              new UnknownCloudflareError({
                code: errorCode,
                message: errorMessage,
              }),
          ),
        );
        return yield* Effect.fail(decodeResult as UnknownCloudflareError);
      }

      // Unknown error - record for discovery
      return yield* Effect.fail(
        new UnknownCloudflareError({
          code: errorCode,
          message: errorMessage,
        }),
      );
    }

    // Decode the result directly using the output schema
    // The output schema represents the unwrapped result type (not the Cloudflare envelope)
    // Use onExcessProperty: "ignore" to allow unknown fields from the API
    // Use propertyOrder: "none" to handle snake_case → camelCase mappings via fromKey
    const result = yield* Schema.decodeUnknown(outputSchema, {
      onExcessProperty: "ignore",
      propertyOrder: "none",
    })(json.result ?? {}).pipe(
      Effect.mapError(
        () =>
          new CloudflareHttpError({
            status: response.status,
            statusText: "Schema decode failed",
            body: bodyText,
          }),
      ),
    );

    return result;
  });

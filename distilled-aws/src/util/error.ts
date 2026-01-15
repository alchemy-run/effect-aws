/**
 * Error handling utilities for AWS protocols.
 *
 * All AWS protocols need to extract and sanitize error codes from responses.
 * The error code may appear in different locations depending on the protocol,
 * but the sanitization rules are consistent across all protocols.
 */

/**
 * Sanitize an error type value according to the Smithy specification.
 *
 * Legacy server implementations sometimes include additional information
 * in error type values. This function cleans them up:
 *
 * 1. If a `:` is present, take only the contents BEFORE the first `:`
 * 2. If a `#` is present, take only the contents AFTER the first `#`
 *
 * Examples:
 * - `FooError` → `FooError`
 * - `FooError:http://internal.amazon.com/coral/...` → `FooError`
 * - `aws.protocoltests.restjson#FooError` → `FooError`
 * - `aws.protocoltests.restjson#FooError:http://...` → `FooError`
 *
 * @param value - The raw error type value from the response
 * @returns The sanitized error code
 */
export function sanitizeErrorCode(value: string): string {
  // 1. Take before first ':'
  let code = value.split(":")[0];
  // 2. Take after first '#'
  const hashIndex = code.indexOf("#");
  if (hashIndex >= 0) {
    code = code.slice(hashIndex + 1);
  }
  return code;
}

/**
 * Extract the error code from a JSON error response body.
 *
 * Checks for error code in order of preference:
 * 1. `__type` field (AWS JSON protocols)
 * 2. `code` field (alternative format)
 *
 * @param body - The parsed JSON body
 * @returns The raw error code (before sanitization), or undefined if not found
 */
export function extractJsonErrorCode(
  body: Record<string, unknown>,
): string | undefined {
  // Check __type first (standard for AWS JSON protocols)
  if (typeof body.__type === "string") {
    return body.__type;
  }
  // Fall back to code field
  if (typeof body.code === "string") {
    return body.code;
  }
  return undefined;
}

/**
 * Extract error data from a JSON body, removing the error code fields.
 *
 * @param body - The parsed JSON body
 * @returns The body with __type and code fields removed
 */
export function extractJsonErrorData(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const { __type, code, ...data } = body;
  return data;
}

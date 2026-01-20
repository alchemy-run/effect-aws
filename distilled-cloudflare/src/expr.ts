/**
 * Expression DSL types for error matching.
 *
 * These types define the structure for patch files that map
 * Cloudflare error codes to typed error classes.
 *
 * Patch files are located at: patch/{service}/{operation}.json
 */

/**
 * Matcher for error message content.
 *
 * @example
 * // Match if message contains a substring
 * { includes: "not found" }
 *
 * @example
 * // Match if message matches a regex pattern
 * { matches: "bucket .* does not exist" }
 */
export type MessageMatcher = { includes: string } | { matches: string }; // regex pattern

/**
 * Matcher for a single error condition.
 *
 * At minimum, an error code is required. Status and message
 * matchers are optional and provide additional specificity.
 *
 * @example
 * // Match by code only
 * { code: 10006 }
 *
 * @example
 * // Match by code and status
 * { code: 10002, status: 409 }
 *
 * @example
 * // Match by code and message pattern
 * { code: 10000, message: { includes: "CORS configuration not found" } }
 */
export interface ErrorMatcher {
  /** Cloudflare error code (required) */
  code: number;

  /** HTTP status code (optional, for disambiguation) */
  status?: number;

  /** Message matcher (optional, for disambiguation) */
  message?: MessageMatcher;
}

/**
 * Structure of a patch file for an operation.
 *
 * Maps error tag names to arrays of matchers. Multiple matchers
 * allow the same error tag to match different error codes.
 *
 * @example
 * {
 *   "errors": {
 *     "NoSuchBucket": [
 *       { "code": 10006 }
 *     ],
 *     "NoCorsConfiguration": [
 *       { "code": 10059 },
 *       { "code": 10000, "message": { "includes": "CORS configuration not found" } }
 *     ]
 *   }
 * }
 */
export interface OperationPatch {
  /** Map of error tag names to their matchers */
  errors: Record<string, ErrorMatcher[]>;
}

/**
 * Check if a message matches a MessageMatcher.
 */
export function matchesMessage(
  matcher: MessageMatcher,
  message: string,
): boolean {
  if ("includes" in matcher) {
    return message.includes(matcher.includes);
  }
  if ("matches" in matcher) {
    return new RegExp(matcher.matches).test(message);
  }
  return false;
}

/**
 * Check if an error matches an ErrorMatcher.
 */
export function matchesError(
  matcher: ErrorMatcher,
  code: number,
  status: number,
  message: string,
): boolean {
  // Code must match
  if (matcher.code !== code) return false;

  // Status must match if specified
  if (matcher.status !== undefined && matcher.status !== status) return false;

  // Message must match if specified
  if (
    matcher.message !== undefined &&
    !matchesMessage(matcher.message, message)
  )
    return false;

  return true;
}

/**
 * Calculate specificity score for a matcher.
 * Higher score = more specific match.
 */
export function matcherSpecificity(matcher: ErrorMatcher): number {
  let score = 1; // Base score for code match
  if (matcher.status !== undefined) score += 1;
  if (matcher.message !== undefined) score += 1;
  return score;
}

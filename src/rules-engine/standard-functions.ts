/**
 * Standard Smithy Rules Engine Functions
 *
 * Implementation of built-in functions for the rules engine.
 * @see https://smithy.io/2.0/additional-specs/rules-engine/specification.html#standard-library-functions
 */

import type { ParsedUrl, RulesValue } from "./expression.ts";

/** Returns true if the value is set (not null or undefined). */
export const isSet = (value: RulesValue): boolean =>
  value !== null && value !== undefined;

/** Returns the boolean negation of the input. */
export const not = (value: RulesValue): boolean => !value;

/** Returns true if both values are strictly equal. */
export const booleanEquals = (a: RulesValue, b: RulesValue): boolean => a === b;

/** Alias for booleanEquals - both use strict equality. */
export const stringEquals = booleanEquals;

/** Gets an attribute from an object using dot/bracket notation (e.g. "foo.bar[0].baz") */
export function getAttr(value: RulesValue, path: string): RulesValue {
  if (value == null) return undefined;

  // Split path into segments, converting numeric strings to numbers for array access
  const segments = path.split(/\.|\[|\]/).filter(Boolean);
  let result: RulesValue = value;

  for (const seg of segments) {
    if (result == null) return undefined;
    const idx = /^\d+$/.test(seg) ? parseInt(seg, 10) : seg;
    if (typeof idx === "number" && Array.isArray(result)) {
      result = result[idx];
    } else if (typeof result === "object" && !Array.isArray(result)) {
      result = (result as Record<string, RulesValue>)[String(idx)];
    } else {
      return undefined;
    }
  }
  return result;
}

/** Returns a substring. If reverse is true, indexes are from the end. */
export function substring(
  input: RulesValue,
  start: RulesValue,
  stop: RulesValue,
  reverse: RulesValue,
): RulesValue {
  if (typeof input !== "string") {
    return undefined;
  }

  const startIdx = typeof start === "number" ? start : 0;
  const stopIdx = typeof stop === "number" ? stop : input.length;

  if (startIdx < 0 || stopIdx < 0 || startIdx >= stopIdx) {
    return undefined;
  }

  if (reverse) {
    // Reverse indexing: start from the end
    const len = input.length;
    if (stopIdx > len) {
      return undefined;
    }
    return input.slice(len - stopIdx, len - startIdx);
  }

  if (stopIdx > input.length) {
    return undefined;
  }

  return input.slice(startIdx, stopIdx);
}

/** Parses a URL string into its components. */
export function parseURL(url: RulesValue): ParsedUrl | undefined {
  if (typeof url !== "string") {
    return undefined;
  }

  try {
    const parsed = new URL(url);

    // Reject URLs with query strings
    if (parsed.search) {
      return undefined;
    }

    // Check if authority is an IP address
    const host = parsed.hostname;
    const isIp = isIpAddress(host);

    // Get path - JavaScript's URL.pathname returns "/" for URLs without a path,
    // but the Smithy Java implementation returns empty string.
    // We need to match Java's behavior for compatibility.
    let path = parsed.pathname;
    if (path === "/" && !url.includes(parsed.host + "/")) {
      // URL has no explicit path, Java returns empty string
      path = "";
    }

    // Build normalized path (ensure starts and ends with slash)
    let normalizedPath = path;
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = "/" + normalizedPath;
    }
    if (!normalizedPath.endsWith("/")) {
      normalizedPath += "/";
    }

    return {
      scheme: parsed.protocol.replace(":", ""),
      authority: parsed.host,
      path,
      normalizedPath,
      isIp,
    };
  } catch {
    return undefined;
  }
}

/**
 * Check if a string is an IP address (v4 or v6).
 */
export function isIpAddress(host: string): boolean {
  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(host)) {
    // Validate each octet is 0-255
    const octets = host.split(".");
    return octets.every((o) => {
      const n = parseInt(o, 10);
      return n >= 0 && n <= 255;
    });
  }

  // IPv6 pattern (simplified - checks for presence of colons and hex chars)
  if (host.includes(":")) {
    // Remove brackets if present
    const ipv6 = host.replace(/^\[|\]$/g, "");
    const ipv6Pattern = /^[0-9a-fA-F:]+$/;
    return ipv6Pattern.test(ipv6);
  }

  return false;
}

/** URI encodes a string value. */
export function uriEncode(value: RulesValue): RulesValue {
  if (typeof value !== "string") {
    return undefined;
  }

  return encodeURIComponent(value);
}

/** Checks if a string is a valid DNS host label. */
export function isValidHostLabel(
  value: RulesValue,
  allowSubDomains: RulesValue,
): boolean {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  if (allowSubDomains) {
    // Split by dots and validate each label
    const labels = value.split(".");
    return labels.every((label) => isValidSingleHostLabel(label));
  }

  return isValidSingleHostLabel(value);
}

/**
 * Validates a single DNS label (no dots).
 * - Must be 1-63 characters
 * - Must start and end with alphanumeric
 * - Can contain alphanumeric and hyphens
 */
function isValidSingleHostLabel(label: string): boolean {
  if (label.length < 1 || label.length > 63) {
    return false;
  }

  // Must match RFC 1123 host label pattern
  const pattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

  // Single character labels are valid
  if (label.length === 1) {
    return /^[a-zA-Z0-9]$/.test(label);
  }

  return pattern.test(label);
}

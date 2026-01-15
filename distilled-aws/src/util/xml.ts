/**
 * Shared XML utilities for AWS protocols (aws-query, ec2-query, rest-xml)
 */

import type * as AST from "effect/SchemaAST";
import { XMLParser } from "fast-xml-parser";
import { isBooleanAST, isNumberAST } from "./ast.ts";

// =============================================================================
// XML Parser
// =============================================================================

/**
 * Shared XML parser configured for AWS protocol responses.
 * - Preserves attributes with @_ prefix
 * - Keeps values as strings (schema handles type conversion)
 * - Preserves namespace prefixes
 */
export const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
  parseTagValue: false, // Keep values as strings, let schema handle conversion
  parseAttributeValue: false,
  removeNSPrefix: false,
});

/**
 * Parse an XML string into a JavaScript object.
 * Returns empty object for empty/whitespace-only input.
 */
export function parseXml(xml: string): Record<string, unknown> {
  if (!xml?.trim()) return {};
  return xmlParser.parse(xml) as Record<string, unknown>;
}

// =============================================================================
// XML Escaping
// =============================================================================

const xmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * Escape special XML characters in a string.
 */
export const escapeXml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => xmlEscapes[c]);

// =============================================================================
// XML Tag Helpers
// =============================================================================

/**
 * Wrap content in an XML tag with optional xmlns attribute.
 */
export const wrapTag = (tag: string, content: string, xmlns?: string): string =>
  `<${tag}${xmlns ? ` xmlns="${escapeXml(xmlns)}"` : ""}>${content}</${tag}>`;

// =============================================================================
// XML Response Helpers
// =============================================================================

/**
 * Extract the root element content from parsed XML.
 * Filters out processing instructions (keys starting with "?").
 * Used by aws-query and ec2-query protocols.
 */
export function extractXmlRoot(
  parsed: Record<string, unknown>,
): Record<string, unknown> {
  const rootKeys = Object.keys(parsed).filter((k) => !k.startsWith("?"));
  const responseKey = rootKeys[0];
  return responseKey
    ? (parsed[responseKey] as Record<string, unknown>)
    : (parsed as Record<string, unknown>);
}

// =============================================================================
// XML Deserialization Helpers
// =============================================================================

/**
 * Deserialize a primitive string value based on AST type.
 * Converts strings to numbers or booleans as needed.
 * Note: Dates are left as strings - Schema.decode handles the Date transformation.
 */
export function deserializePrimitive(ast: AST.AST, value: string): unknown {
  if (isNumberAST(ast)) return Number(value);
  if (isBooleanAST(ast)) return value === "true";
  // Dates stay as strings - S.Date (DateFromString) handles the conversion
  return value;
}

/**
 * Unwrap an array value from a wrapper object.
 * XML parsers often produce { member: [...] } instead of just [...].
 *
 * @param value - The value to unwrap
 * @param primaryTag - Primary tag to look for (e.g., from xmlName or identifier)
 * @param fallbackTags - Additional fallback tags to try (e.g., ["member", "item"])
 * @returns The unwrapped array value
 */
export function unwrapArrayValue(
  value: unknown,
  primaryTag: string | undefined,
  fallbackTags: string[] = [],
): unknown {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return value;
  }

  const objValue = value as Record<string, unknown>;

  // Try primary tag first
  if (primaryTag && primaryTag in objValue) {
    return objValue[primaryTag];
  }

  // Try fallback tags
  for (const tag of fallbackTags) {
    if (tag in objValue) {
      return objValue[tag];
    }
  }

  return value;
}

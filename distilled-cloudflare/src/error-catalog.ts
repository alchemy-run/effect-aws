/**
 * Error catalog for Cloudflare API.
 *
 * Maps numeric error codes to semantic error names and categories.
 * Used by the response parser to match errors to typed TaggedError classes.
 */

import * as Effect from "effect/Effect";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";

export interface ErrorCatalogEntry {
  name: string;
  category: string;
}

export interface ErrorPattern {
  regex: string;
  name: string;
  category: string;
}

export interface CodeRange {
  min: number;
  max: number;
  defaultCategory: string;
}

export interface ErrorCatalogData {
  codes: Record<string, ErrorCatalogEntry>;
  patterns: ErrorPattern[];
  codeRanges: CodeRange[];
}

/**
 * Classify an error by code and message.
 *
 * 1. Check exact code match
 * 2. Check message patterns
 * 3. Fall back to code range defaults
 * 4. Return unknown
 */
export const classifyError = (
  catalog: ErrorCatalogData,
  code: number,
  message: string,
): ErrorCatalogEntry => {
  // 1. Check exact code match
  const codeStr = String(code);
  if (catalog.codes[codeStr]) {
    return catalog.codes[codeStr]!;
  }

  // 2. Check message patterns
  const lowerMessage = message.toLowerCase();
  for (const pattern of catalog.patterns) {
    if (new RegExp(pattern.regex, "i").test(lowerMessage)) {
      return {
        name: `${pattern.name}_${code}`,
        category: pattern.category,
      };
    }
  }

  // 3. Fall back to code range defaults
  for (const range of catalog.codeRanges) {
    if (code >= range.min && code <= range.max) {
      return {
        name: `Error_${code}`,
        category: range.defaultCategory,
      };
    }
  }

  // 4. Return unknown
  return {
    name: `UnknownError_${code}`,
    category: "UnknownError",
  };
};

/**
 * Load the error catalog from the spec directory.
 */
export const loadErrorCatalog = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const catalogPath = path.join("spec", "error-catalog.json");
  const content = yield* fs.readFileString(catalogPath);
  const data = JSON.parse(content) as ErrorCatalogData;

  return data;
}).pipe(
  Effect.catchAll(() =>
    Effect.succeed<ErrorCatalogData>({
      codes: {},
      patterns: [],
      codeRanges: [],
    }),
  ),
);

/**
 * Create an empty error catalog.
 */
export const emptyErrorCatalog = (): ErrorCatalogData => ({
  codes: {},
  patterns: [],
  codeRanges: [],
});

/**
 * Add an error code to the catalog.
 * Returns the updated catalog data (does not persist).
 */
export const addErrorCode = (
  catalog: ErrorCatalogData,
  code: number,
  name: string,
  category: string,
): ErrorCatalogData => ({
  ...catalog,
  codes: {
    ...catalog.codes,
    [String(code)]: { name, category },
  },
});

/**
 * Convert error catalog to a Map for response parser.
 */
export const catalogToMap = (catalog: ErrorCatalogData): Map<number, ErrorCatalogEntry> => {
  const map = new Map<number, ErrorCatalogEntry>();
  for (const [code, entry] of Object.entries(catalog.codes)) {
    map.set(Number(code), entry);
  }
  return map;
};

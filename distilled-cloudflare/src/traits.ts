/**
 * Effect Schema annotations for HTTP binding traits.
 *
 * These traits are applied to schema properties to specify how they map
 * to HTTP request/response components (path, query, headers, body).
 *
 * Simpler than distilled-aws since Cloudflare uses only REST JSON.
 */

import * as Schema from "effect/Schema";
import type * as AST from "effect/SchemaAST";

// =============================================================================
// Annotation Infrastructure
// =============================================================================

const annotationMetaSymbol = Symbol.for("distilled-cloudflare/annotation-meta");

type Annotatable = {
  annotations(annotations: Record<symbol, unknown>): Annotatable;
};

export interface Annotation {
  <A extends Annotatable>(schema: A): A;
  readonly [annotationMetaSymbol]: Array<{ symbol: symbol; value: unknown }>;
  readonly [key: symbol]: unknown;
}

function makeAnnotation<T>(sym: symbol, value: T): Annotation {
  const fn = <A extends Annotatable>(schema: A): A =>
    schema.annotations({ [sym]: value }) as A;

  Object.defineProperty(fn, annotationMetaSymbol, {
    value: [{ symbol: sym, value }],
    writable: false,
    enumerable: false,
  });
  Object.defineProperty(fn, sym, {
    value,
    writable: false,
    enumerable: false,
  });

  return fn as Annotation;
}

/**
 * Combine multiple annotations into one.
 */
export function all(...annotations: Annotation[]): Annotation {
  const entries: Array<{ symbol: symbol; value: unknown }> = [];
  const raw: Record<symbol, unknown> = {};

  for (const a of annotations) {
    for (const entry of a[annotationMetaSymbol]) {
      entries.push(entry);
      raw[entry.symbol] = entry.value;
    }
  }

  const fn = <A extends Annotatable>(schema: A): A =>
    schema.annotations(raw) as A;

  Object.defineProperty(fn, annotationMetaSymbol, {
    value: entries,
    writable: false,
    enumerable: false,
  });

  for (const { symbol, value } of entries) {
    Object.defineProperty(fn, symbol, {
      value,
      writable: false,
      enumerable: false,
    });
  }

  return fn as Annotation;
}

// =============================================================================
// HTTP Binding Traits
// =============================================================================

/** Bind member to a URL path parameter */
export const httpPathSymbol = Symbol.for("distilled-cloudflare/http-path");
export const HttpPath = (name: string) => makeAnnotation(httpPathSymbol, name);

/** Bind member to a query string parameter */
export const httpQuerySymbol = Symbol.for("distilled-cloudflare/http-query");
export const HttpQuery = (name: string) =>
  makeAnnotation(httpQuerySymbol, name);

/** Bind member to an HTTP header */
export const httpHeaderSymbol = Symbol.for("distilled-cloudflare/http-header");
export const HttpHeader = (name: string) =>
  makeAnnotation(httpHeaderSymbol, name);

/** Bind member to the request/response body */
export const httpBodySymbol = Symbol.for("distilled-cloudflare/http-body");
export const HttpBody = () => makeAnnotation(httpBodySymbol, true);

/** Wire name for property serialization (when TS name differs from API name) */
export const jsonNameSymbol = Symbol.for("distilled-cloudflare/json-name");

/** Symbol used to detect PropertySignature types */
const propertySignatureSymbol = Symbol.for("effect/PropertySignature");

/**
 * JsonName trait - uses Effect Schema's fromKey for automatic key renaming.
 *
 * When applied to a PropertySignature (from Schema.optional), pipes Schema.fromKey.
 * When applied to a Schema, wraps in Schema.propertySignature and pipes Schema.fromKey.
 *
 * This allows Effect Schema's encode/decode to handle key renaming automatically.
 */
export const JsonName = (name: string) => {
  return <A>(schema: A): A => {
    // Check if it's a PropertySignature (has the symbol)
    if (
      schema !== null &&
      typeof schema === "object" &&
      propertySignatureSymbol in schema
    ) {
      // It's already a PropertySignature - pipe fromKey onto it
      return (schema as any).pipe(Schema.fromKey(name)) as A;
    }

    // It's a Schema - wrap in propertySignature and apply fromKey
    if (Schema.isSchema(schema)) {
      return Schema.propertySignature(schema as Schema.Schema.Any).pipe(
        Schema.fromKey(name),
      ) as A;
    }

    // Fallback: just add annotation (shouldn't happen in practice)
    if (
      schema !== null &&
      typeof schema === "object" &&
      "annotations" in schema &&
      typeof (schema as any).annotations === "function"
    ) {
      return (schema as any).annotations({ [jsonNameSymbol]: name }) as A;
    }

    return schema;
  };
};

/** Content type for the request body */
export const httpContentTypeSymbol = Symbol.for(
  "distilled-cloudflare/http-content-type",
);
export const HttpContentType = (contentType: string) =>
  makeAnnotation(httpContentTypeSymbol, contentType);

/** Text body binding (plain text, JavaScript, etc.) */
export const HttpTextBody = (contentType: string = "text/plain") =>
  all(HttpBody(), HttpContentType(contentType));

/** FormData body binding (multipart/form-data) */
export const httpFormDataSymbol = Symbol.for(
  "distilled-cloudflare/http-form-data",
);
export const HttpFormData = () =>
  all(HttpBody(), makeAnnotation(httpFormDataSymbol, true));

/** Check if body is FormData */
export const hasHttpFormData = (prop: AST.PropertySignature): boolean =>
  hasPropAnnotation(prop, httpFormDataSymbol);

/** Mark a property as a file/files for multipart form upload */
export const httpFormDataFileSymbol = Symbol.for(
  "distilled-cloudflare/http-form-data-file",
);
export const HttpFormDataFile = () =>
  makeAnnotation(httpFormDataFileSymbol, true);

/** Check if property is a file upload */
export const hasHttpFormDataFile = (prop: AST.PropertySignature): boolean =>
  hasPropAnnotation(prop, httpFormDataFileSymbol);

/** HTTP response status code binding */
export const httpStatusSymbol = Symbol.for("distilled-cloudflare/http-status");
export const HttpStatus = () => makeAnnotation(httpStatusSymbol, true);

// =============================================================================
// Operation-Level Traits
// =============================================================================

export const httpOperationSymbol = Symbol.for(
  "distilled-cloudflare/http-operation",
);

export interface HttpOperationTrait {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  path: string;
  /**
   * Request body content type.
   * - "json" (default): JSON body
   * - "multipart": multipart/form-data (for file uploads)
   */
  contentType?: "json" | "multipart";
}

export const Http = (trait: HttpOperationTrait) =>
  makeAnnotation(httpOperationSymbol, trait);

// =============================================================================
// Service-Level Traits
// =============================================================================

export const serviceSymbol = Symbol.for("distilled-cloudflare/service");

export interface ServiceTrait {
  name: string;
  version?: string;
}

export const Service = (trait: ServiceTrait) =>
  makeAnnotation(serviceSymbol, trait);

// =============================================================================
// Pagination Trait
// =============================================================================

export const paginationSymbol = Symbol.for("distilled-cloudflare/pagination");

export interface PaginationTrait {
  inputToken: string;
  outputToken: string;
  items?: string;
  pageSize?: string;
}

export const Pagination = (trait: PaginationTrait) =>
  makeAnnotation(paginationSymbol, trait);

// =============================================================================
// Annotation Retrieval Helpers
// =============================================================================

export const getAnnotation = <T>(
  ast: AST.AST,
  symbol: symbol,
): T | undefined => {
  return ast.annotations?.[symbol] as T | undefined;
};

export const getPropAnnotation = <T>(
  prop: AST.PropertySignature,
  symbol: symbol,
): T | undefined => {
  const propAnnot = prop.annotations?.[symbol] as T | undefined;
  if (propAnnot !== undefined) return propAnnot;
  return getAnnotationUnwrap(prop.type, symbol);
};

export const hasPropAnnotation = (
  prop: AST.PropertySignature,
  symbol: symbol,
): boolean => {
  if (prop.annotations?.[symbol] !== undefined) return true;
  return hasAnnotation(prop.type, symbol);
};

export const hasAnnotation = (ast: AST.AST, symbol: symbol): boolean => {
  if (ast.annotations?.[symbol] !== undefined) return true;

  if (ast._tag === "Suspend") {
    return hasAnnotation(ast.f(), symbol);
  }

  if (ast._tag === "Union") {
    const nonNullishTypes = ast.types.filter(
      (t: AST.AST) =>
        t._tag !== "UndefinedKeyword" &&
        !(t._tag === "Literal" && t.literal === null),
    );
    return nonNullishTypes.some((t: AST.AST) => hasAnnotation(t, symbol));
  }

  if (ast._tag === "Transformation") {
    if (ast.annotations?.[symbol] !== undefined) return true;
    if (ast.to?.annotations?.[symbol] !== undefined) return true;
    return hasAnnotation(ast.from, symbol);
  }

  return false;
};

export const getAnnotationUnwrap = <T>(
  ast: AST.AST,
  symbol: symbol,
): T | undefined => {
  const direct = ast.annotations?.[symbol] as T | undefined;
  if (direct !== undefined) return direct;

  if (ast._tag === "Suspend") {
    return getAnnotationUnwrap(ast.f(), symbol);
  }

  if (ast._tag === "Transformation") {
    const toValue = ast.to?.annotations?.[symbol] as T | undefined;
    if (toValue !== undefined) return toValue;
    const fromValue = ast.from?.annotations?.[symbol] as T | undefined;
    if (fromValue !== undefined) return fromValue;
  }

  if (ast._tag === "Union") {
    const nonNullishTypes = ast.types.filter(
      (t) =>
        t._tag !== "UndefinedKeyword" &&
        !(t._tag === "Literal" && t.literal === null),
    );
    if (nonNullishTypes.length === 1) {
      return getAnnotationUnwrap(nonNullishTypes[0]!, symbol);
    }
  }

  return undefined;
};

// =============================================================================
// Property Annotation Helpers
// =============================================================================

export const getHttpPath = (prop: AST.PropertySignature): string | undefined =>
  getPropAnnotation<string>(prop, httpPathSymbol);

export const getHttpQuery = (prop: AST.PropertySignature): string | undefined =>
  getPropAnnotation<string>(prop, httpQuerySymbol);

export const getHttpHeader = (
  prop: AST.PropertySignature,
): string | undefined => getPropAnnotation<string>(prop, httpHeaderSymbol);

export const hasHttpBody = (prop: AST.PropertySignature): boolean =>
  hasPropAnnotation(prop, httpBodySymbol);

export const getHttpContentType = (
  prop: AST.PropertySignature,
): string | undefined => getPropAnnotation<string>(prop, httpContentTypeSymbol);

export const hasHttpStatus = (prop: AST.PropertySignature): boolean =>
  hasPropAnnotation(prop, httpStatusSymbol);

// =============================================================================
// Operation Trait Helpers
// =============================================================================

export const getHttpOperation = (
  ast: AST.AST,
): HttpOperationTrait | undefined =>
  getAnnotationUnwrap<HttpOperationTrait>(ast, httpOperationSymbol);

export const getService = (ast: AST.AST): ServiceTrait | undefined =>
  getAnnotationUnwrap<ServiceTrait>(ast, serviceSymbol);

export const getPagination = (ast: AST.AST): PaginationTrait | undefined =>
  getAnnotationUnwrap<PaginationTrait>(ast, paginationSymbol);

// =============================================================================
// Streaming Types (for large responses)
// =============================================================================

export const streamingSymbol = Symbol.for("distilled-cloudflare/streaming");
export const Streaming = () => makeAnnotation(streamingSymbol, true);

export const isStreamingType = (ast: AST.AST): boolean => {
  if (ast.annotations?.[streamingSymbol]) return true;
  if (ast._tag === "Union") {
    return ast.types.some((t) => isStreamingType(t));
  }
  return false;
};

// =============================================================================
// Error Matching Traits
// =============================================================================

/** Error code trait - matches against Cloudflare error code in response */
export const httpErrorCodeSymbol = Symbol.for(
  "distilled-cloudflare/http-error-code",
);
export const HttpErrorCode = (code: number) =>
  makeAnnotation(httpErrorCodeSymbol, code);

/** Error codes trait - matches against multiple Cloudflare error codes */
export const httpErrorCodesSymbol = Symbol.for(
  "distilled-cloudflare/http-error-codes",
);
export const HttpErrorCodes = (codes: number[]) =>
  makeAnnotation(httpErrorCodesSymbol, codes);

/** Error HTTP status trait - matches against HTTP status code */
export const httpErrorStatusSymbol = Symbol.for(
  "distilled-cloudflare/http-error-status",
);
export const HttpErrorStatus = (status: number) =>
  makeAnnotation(httpErrorStatusSymbol, status);

/** Error message pattern trait - matches if message contains this substring */
export const httpErrorMessageSymbol = Symbol.for(
  "distilled-cloudflare/http-error-message",
);
export const HttpErrorMessage = (pattern: string) =>
  makeAnnotation(httpErrorMessageSymbol, pattern);

/** Expression-based error matchers - array of matchers from patch files */
export const httpErrorMatchersSymbol = Symbol.for(
  "distilled-cloudflare/http-error-matchers",
);

/**
 * Matcher structure used in HttpErrorMatchers trait.
 * Matches the ErrorMatcher type from expr.ts for use in annotations.
 */
export interface ErrorMatcherAnnotation {
  code: number;
  status?: number;
  message?: { includes?: string; matches?: string };
}

/**
 * Apply error matchers from a patch file to an error schema.
 *
 * @example
 * ```typescript
 * export class NoSuchBucket extends Schema.TaggedError<NoSuchBucket>()(
 *   "NoSuchBucket",
 *   { code: Schema.Number, message: Schema.String }
 * ).pipe(T.HttpErrorMatchers([
 *   { code: 10006 },
 *   { code: 10000, message: { includes: "bucket not found" } }
 * ])) {}
 * ```
 */
export const HttpErrorMatchers = (matchers: ErrorMatcherAnnotation[]) =>
  makeAnnotation(httpErrorMatchersSymbol, matchers);

// =============================================================================
// Error Trait Helpers
// =============================================================================

export const getHttpErrorCode = (ast: AST.AST): number | undefined =>
  getAnnotationUnwrap<number>(ast, httpErrorCodeSymbol);

export const getHttpErrorCodes = (ast: AST.AST): number[] | undefined =>
  getAnnotationUnwrap<number[]>(ast, httpErrorCodesSymbol);

export const getHttpErrorStatus = (ast: AST.AST): number | undefined =>
  getAnnotationUnwrap<number>(ast, httpErrorStatusSymbol);

export const getHttpErrorMessage = (ast: AST.AST): string | undefined =>
  getAnnotationUnwrap<string>(ast, httpErrorMessageSymbol);

export const getHttpErrorMatchers = (
  ast: AST.AST,
): ErrorMatcherAnnotation[] | undefined =>
  getAnnotationUnwrap<ErrorMatcherAnnotation[]>(ast, httpErrorMatchersSymbol);

// =============================================================================
// Response Type Traits
// =============================================================================

/** Multipart response trait - marks operations that return multipart/form-data */
export const httpMultipartResponseSymbol = Symbol.for(
  "distilled-cloudflare/http-multipart-response",
);
export const HttpMultipartResponse = () =>
  makeAnnotation(httpMultipartResponseSymbol, true);

export const getHttpMultipartResponse = (ast: AST.AST): boolean | undefined =>
  getAnnotationUnwrap<boolean>(ast, httpMultipartResponseSymbol);

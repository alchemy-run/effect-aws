/**
 * Error categories for Cloudflare API errors.
 *
 * These categories group errors by their semantic meaning, enabling
 * pattern-based error handling (e.g., retry all throttling errors).
 *
 * Categories are applied to error classes via .pipe() and stored on the prototype.
 * This allows runtime checking of error categories for retry decisions.
 */

import * as Effect from "effect/Effect";
import * as Predicate from "effect/Predicate";

// =============================================================================
// Category Constants
// =============================================================================

/** Authentication/authorization failures */
export const AuthError = "AuthError" as const;
export type AuthError = typeof AuthError;

/** Invalid request parameters */
export const BadRequestError = "BadRequestError" as const;
export type BadRequestError = typeof BadRequestError;

/** Resource state conflicts (already exists, dependency violation) */
export const ConflictError = "ConflictError" as const;
export type ConflictError = typeof ConflictError;

/** Resource not found */
export const NotFoundError = "NotFoundError" as const;
export type NotFoundError = typeof NotFoundError;

/** Service quota exceeded */
export const QuotaError = "QuotaError" as const;
export type QuotaError = typeof QuotaError;

/** Rate limiting */
export const ThrottlingError = "ThrottlingError" as const;
export type ThrottlingError = typeof ThrottlingError;

/** Request timeouts */
export const TimeoutError = "TimeoutError" as const;
export type TimeoutError = typeof TimeoutError;

/** Cloudflare service errors */
export const ServerError = "ServerError" as const;
export type ServerError = typeof ServerError;

/** Network/transport failures */
export const NetworkError = "NetworkError" as const;
export type NetworkError = typeof NetworkError;

/** General retryable error */
export const RetryableError = "RetryableError" as const;
export type RetryableError = typeof RetryableError;

/** Unknown error type */
export const UnknownError = "UnknownError" as const;
export type UnknownError = typeof UnknownError;

export type Category =
  | AuthError
  | BadRequestError
  | ConflictError
  | NotFoundError
  | QuotaError
  | ThrottlingError
  | TimeoutError
  | ServerError
  | NetworkError
  | RetryableError
  | UnknownError;

// =============================================================================
// Category Infrastructure
// =============================================================================

export const categoriesKey = "@distilled/cloudflare/error/categories";

/**
 * Key for storing retryable trait on error prototypes.
 * Used for runtime checking of whether an error can be retried.
 */
export const retryableKey = "@distilled/cloudflare/error/retryable";

export interface RetryableInfo {
  throttling?: boolean;
}

/**
 * Apply categories to an error class prototype.
 * Use with .pipe() on Schema.TaggedError classes.
 *
 * @example
 * ```ts
 * export class RateLimited extends Schema.TaggedError<RateLimited>()(
 *   "RateLimited",
 *   { code: Schema.Number, message: Schema.String },
 * ).pipe(withCategory(ThrottlingError, RetryableError)) {}
 * ```
 */
export const withCategory =
  <Categories extends Array<Category>>(...categories: Categories) =>
  <Args extends Array<any>, Ret, C extends { new (...args: Args): Ret }>(
    C: C,
  ): C & {
    new (...args: Args): Ret & { [categoriesKey]: { [Cat in Categories[number]]: true } };
  } => {
    for (const category of categories) {
      if (!(categoriesKey in C.prototype)) {
        C.prototype[categoriesKey] = {};
      }
      C.prototype[categoriesKey][category] = true;
    }
    return C as any;
  };

/**
 * Mark an error class as retryable.
 * Use this in addition to withCategory for errors that should be retried.
 */
export const withRetryable =
  (info: RetryableInfo = {}) =>
  <Args extends Array<any>, Ret, C extends { new (...args: Args): Ret }>(
    C: C,
  ): C & {
    new (...args: Args): Ret & { [retryableKey]: RetryableInfo };
  } => {
    C.prototype[retryableKey] = info;
    return C as any;
  };

// =============================================================================
// Category Decorators (for .pipe())
// =============================================================================

export const withAuthError = withCategory(AuthError);
export const withBadRequestError = withCategory(BadRequestError);
export const withConflictError = withCategory(ConflictError);
export const withNotFoundError = withCategory(NotFoundError);
export const withQuotaError = withCategory(QuotaError);
export const withThrottlingError = withCategory(ThrottlingError);
export const withTimeoutError = withCategory(TimeoutError);
export const withServerError = withCategory(ServerError);
export const withNetworkError = withCategory(NetworkError);
export const withRetryableError = withCategory(RetryableError);

// =============================================================================
// Category Checking
// =============================================================================

/**
 * Check if an error has a specific category
 */
export const hasCategory = (error: unknown, category: Category): boolean => {
  if (Predicate.isObject(error) && Predicate.hasProperty(categoriesKey)(error)) {
    // @ts-expect-error - accessing dynamic property
    return category in error[categoriesKey];
  }
  return false;
};

// =============================================================================
// Category Predicates
// =============================================================================

/**
 * Check if an error is a throttling error (rate limited).
 */
export const isThrottlingError = (error: unknown): boolean => {
  // Check category first
  if (hasCategory(error, ThrottlingError)) {
    return true;
  }
  // Check retryable trait with throttling flag
  if (Predicate.isObject(error) && Predicate.hasProperty(retryableKey)(error)) {
    // @ts-expect-error - accessing dynamic property
    return error[retryableKey]?.throttling === true;
  }
  // Fall back to tag-based checking
  if (Predicate.isObject(error) && "_tag" in error) {
    const tag = (error as { _tag: string })._tag;
    return tag === "RateLimited" || tag.includes("RateLimit") || tag === "TooManyRequests";
  }
  return false;
};

/**
 * Check if an error is an authentication error.
 */
export const isAuthError = (error: unknown): boolean => {
  if (hasCategory(error, AuthError)) {
    return true;
  }
  if (Predicate.isObject(error) && "_tag" in error) {
    const tag = (error as { _tag: string })._tag;
    return tag === "AuthenticationError" || tag === "Unauthorized" || tag.includes("Auth");
  }
  return false;
};

/**
 * Check if an error is a not found error.
 */
export const isNotFoundError = (error: unknown): boolean => {
  if (hasCategory(error, NotFoundError)) {
    return true;
  }
  if (Predicate.isObject(error) && "_tag" in error) {
    const tag = (error as { _tag: string })._tag;
    return tag.includes("NotFound") || tag.includes("NoSuch");
  }
  return false;
};

/**
 * Check if an error is a conflict error.
 */
export const isConflictError = (error: unknown): boolean => {
  if (hasCategory(error, ConflictError)) {
    return true;
  }
  if (Predicate.isObject(error) && "_tag" in error) {
    const tag = (error as { _tag: string })._tag;
    return tag.includes("AlreadyExists") || tag.includes("Conflict") || tag.includes("InUse");
  }
  return false;
};

/**
 * Check if an error is a server error.
 */
export const isServerError = (error: unknown): boolean => {
  if (hasCategory(error, ServerError)) {
    return true;
  }
  if (Predicate.isObject(error) && "_tag" in error) {
    const tag = (error as { _tag: string })._tag;
    return tag.includes("Internal") || tag.includes("Server");
  }
  return false;
};

/**
 * Check if an error has the retryable trait.
 */
export const isRetryable = <E>(error: E): error is E & RetryableInfo => {
  if (Predicate.isObject(error) && Predicate.hasProperty(retryableKey)(error)) {
    return true;
  }
  return false;
};

/**
 * Check if an error is an HttpClientError transport error (network failure).
 * These come from @effect/platform's HttpClient when there's a connection issue.
 */
export const isHttpClientTransportError = (error: unknown): boolean => {
  if (
    Predicate.isObject(error) &&
    "_tag" in error &&
    error._tag === "RequestError" &&
    "reason" in error &&
    error.reason === "Transport"
  ) {
    return true;
  }
  return false;
};

/**
 * Check if an error is a transient error that should be automatically retried.
 * Checks for:
 * 1. Retryable trait (via withRetryable)
 * 2. ThrottlingError, ServerError, NetworkError, or RetryableError categories
 * 3. HttpClientError transport errors (network failures from @effect/platform)
 */
export const isTransientError = (error: unknown): boolean => {
  // Check for retryable trait first
  if (isRetryable(error)) {
    return true;
  }

  // Check for HttpClient transport errors (network failures)
  if (isHttpClientTransportError(error)) {
    return true;
  }

  // Check for category-based retryable errors
  return (
    hasCategory(error, RetryableError) ||
    hasCategory(error, ThrottlingError) ||
    hasCategory(error, ServerError) ||
    hasCategory(error, NetworkError)
  );
};

// =============================================================================
// Type Helpers for catchCategory
// =============================================================================

export type AllKeys<E> = E extends { [categoriesKey]: infer Q } ? keyof Q : never;

export type ExtractAll<E, Cats extends PropertyKey> = Cats extends any
  ? Extract<E, { [categoriesKey]: { [K in Cats]: any } }>
  : never;

/**
 * Catch errors matching specific categories.
 *
 * @example
 * ```ts
 * effect.pipe(
 *   catchCategory(ThrottlingError, ServerError, (err) => ...)
 * )
 * ```
 */
export const catchCategory =
  <E, const Categories extends Array<AllKeys<E>>, A2, E2, R2>(
    ...args: [
      ...Categories,
      f: (err: ExtractAll<E, Categories[number]>) => Effect.Effect<A2, E2, R2>,
    ]
  ) =>
  <A, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A | A2, E2 | Exclude<E, ExtractAll<E, Categories[number]>>, R | R2> => {
    const f = args.pop()!;
    const categories = args;
    return Effect.catchIf(
      effect,
      (e) => {
        if (Predicate.isObject(e) && Predicate.hasProperty(categoriesKey)(e)) {
          for (const cat of categories) {
            // @ts-expect-error - accessing dynamic property
            if (cat in e[categoriesKey]) {
              return true;
            }
          }
        }
        return false;
      },
      // @ts-expect-error - type narrowing
      (e) => f(e),
    ) as any;
  };

// =============================================================================
// Category Catchers
// =============================================================================

const makeCatcher =
  (category: Category) =>
  <A2, E2, R2>(f: (err: any) => Effect.Effect<A2, E2, R2>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.catchIf(effect, (e) => hasCategory(e, category), f) as Effect.Effect<
      A | A2,
      E | E2,
      R | R2
    >;

export const catchAuthError = makeCatcher(AuthError);
export const catchBadRequestError = makeCatcher(BadRequestError);
export const catchConflictError = makeCatcher(ConflictError);
export const catchNotFoundError = makeCatcher(NotFoundError);
export const catchQuotaError = makeCatcher(QuotaError);
export const catchThrottlingError = makeCatcher(ThrottlingError);
export const catchTimeoutError = makeCatcher(TimeoutError);
export const catchServerError = makeCatcher(ServerError);
export const catchNetworkError = makeCatcher(NetworkError);
export const catchRetryableError = makeCatcher(RetryableError);

/**
 * Catch errors matching any of the specified categories.
 *
 * @example
 * ```ts
 * effect.pipe(
 *   Category.catch(Category.AuthError, Category.BadRequestError, (err) => ...)
 * )
 * ```
 */
export const catchErrors =
  <Categories extends Category[], A2, E2, R2>(
    ...args: [...Categories, (err: any) => Effect.Effect<A2, E2, R2>]
  ) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) => {
    const handler = args.pop() as (err: any) => Effect.Effect<A2, E2, R2>;
    const categories = args as unknown as Categories;
    return Effect.catchIf(
      effect,
      (e) => categories.some((cat) => hasCategory(e, cat)),
      handler,
    ) as Effect.Effect<A | A2, E | E2, R | R2>;
  };

// Alias for convenience
export { catchErrors as catch };

import * as Effect from "effect/Effect";
import * as Predicate from "effect/Predicate";

export const AbortedError = "AbortedError";
export const AlreadyExistsError = "AlreadyExistsError";
export const AuthError = "AuthError";
export const BadRequestError = "BadRequestError";
export const ConflictError = "ConflictError";
export const DependencyViolationError = "DependencyViolationError";
export const NetworkError = "NetworkError";
export const QuotaError = "QuotaError";
export const RetryableError = "RetryableError";
export const ServerError = "ServerError";
export const ThrottlingError = "ThrottlingError";
export const TimeoutError = "TimeoutError";

export type Category =
  | typeof AbortedError
  | typeof AlreadyExistsError
  | typeof AuthError
  | typeof BadRequestError
  | typeof ConflictError
  | typeof DependencyViolationError
  | typeof NetworkError
  | typeof QuotaError
  | typeof RetryableError
  | typeof ServerError
  | typeof ThrottlingError
  | typeof TimeoutError;

export const categoriesKey = "@alchemy-run/itty-aws/error/categories";

/**
 * Key for storing retryable trait on error prototypes.
 * Mirrors Smithy's @retryable trait for runtime checking.
 */
export const retryableKey = "@alchemy-run/itty-aws/error/retryable";

export interface RetryableInfo {
  throttling?: boolean;
}

export const withCategory =
  <Categories extends Array<Category>>(...categories: Categories) =>
  <Args extends Array<any>, Ret, C extends { new (...args: Args): Ret }>(
    C: C,
  ): C & {
    new (
      ...args: Args
    ): Ret & { [categoriesKey]: { [Cat in Categories[number]]: true } };
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
 * Mark an error class as retryable (mirrors Smithy's @retryable trait).
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

export type AllKeys<E> = E extends { [categoriesKey]: infer Q }
  ? keyof Q
  : never;
export type ExtractAll<E, Cats extends PropertyKey> = Cats extends any
  ? Extract<E, { [categoriesKey]: { [K in Cats]: any } }>
  : never;

export const catchCategory =
  <E, const Categories extends Array<AllKeys<E>>, A2, E2, R2>(
    ...args: [
      ...Categories,
      f: (err: ExtractAll<E, Categories[number]>) => Effect.Effect<A2, E2, R2>,
    ]
  ) =>
  <A, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<
    A | A2,
    E2 | Exclude<E, ExtractAll<E, Categories[number]>>,
    R | R2
  > => {
    const f = args.pop()!;
    const categories = args;
    return Effect.catchIf(
      effect,
      (e) => {
        if (Predicate.isObject(e) && Predicate.hasProperty(categoriesKey)(e)) {
          for (const cat of categories) {
            // @ts-expect-error
            if (cat in e[categoriesKey]) {
              return true;
            }
          }
        }
        return false;
      }, // @ts-expect-error
      (e) => f(e),
    ) as any;
  };

// ============================================================================
// Category decorators (for annotating error classes with .pipe())
// ============================================================================

export const withAbortedError = withCategory(AbortedError);
export const withAlreadyExistsError = withCategory(AlreadyExistsError);
export const withAuthError = withCategory(AuthError);
export const withBadRequestError = withCategory(BadRequestError);
export const withConflictError = withCategory(ConflictError);
export const withDependencyViolationError = withCategory(
  DependencyViolationError,
);
export const withNetworkError = withCategory(NetworkError);
export const withQuotaError = withCategory(QuotaError);
export const withRetryableError = withCategory(RetryableError);
export const withServerError = withCategory(ServerError);
export const withThrottlingError = withCategory(ThrottlingError);
export const withTimeoutError = withCategory(TimeoutError);

/**
 * Check if an error has a specific category
 */
export const hasCategory = (error: unknown, category: Category): boolean => {
  if (
    Predicate.isObject(error) &&
    Predicate.hasProperty(categoriesKey)(error)
  ) {
    // @ts-expect-error
    return category in error[categoriesKey];
  }
  return false;
};

// ============================================================================
// Category predicates (for use with Effect.retry({ while: ... }))
// ============================================================================

export const isAbortedError = (error: unknown): boolean =>
  hasCategory(error, AbortedError);

export const isAlreadyExistsError = (error: unknown): boolean =>
  hasCategory(error, AlreadyExistsError);

export const isAuthError = (error: unknown): boolean =>
  hasCategory(error, AuthError);

export const isBadRequestError = (error: unknown): boolean =>
  hasCategory(error, BadRequestError);

export const isConflictError = (error: unknown): boolean =>
  hasCategory(error, ConflictError);

export const isDependencyViolationError = (error: unknown): boolean =>
  hasCategory(error, DependencyViolationError);

export const isNetworkError = (error: unknown): boolean =>
  hasCategory(error, NetworkError);

export const isQuotaError = (error: unknown): boolean =>
  hasCategory(error, QuotaError);

export const isRetryableError = (error: unknown): boolean =>
  hasCategory(error, RetryableError);

export const isServerError = (error: unknown): boolean =>
  hasCategory(error, ServerError);

export const isTimeoutError = (error: unknown): boolean =>
  hasCategory(error, TimeoutError);

// ============================================================================
// Category catchers (for use with .pipe(Category.catchBadRequestError(...)))
// ============================================================================

const makeCatcher =
  (category: Category) =>
  <A2, E2, R2>(f: (err: any) => Effect.Effect<A2, E2, R2>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.catchIf(effect, (e) => hasCategory(e, category), f) as Effect.Effect<
      A | A2,
      E | E2,
      R | R2
    >;

/**
 * Catch errors matching any of the specified categories.
 *
 * @example
 * ```ts
 * eff.pipe(
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

export const catchAbortedError = makeCatcher(AbortedError);

export const catchAlreadyExistsError = makeCatcher(AlreadyExistsError);

export const catchAuthError = makeCatcher(AuthError);

export const catchBadRequestError = makeCatcher(BadRequestError);

export const catchConflictError = makeCatcher(ConflictError);

export const catchDependencyViolationError = makeCatcher(
  DependencyViolationError,
);

export const catchNetworkError = makeCatcher(NetworkError);

export const catchQuotaError = makeCatcher(QuotaError);

export const catchRetryableError = makeCatcher(RetryableError);

export const catchServerError = makeCatcher(ServerError);

export const catchThrottlingError = makeCatcher(ThrottlingError);

export const catchTimeoutError = makeCatcher(TimeoutError);

export interface RetryableError {
  readonly retryAfterSeconds?: number;
  readonly RetryAfterSeconds?: number;
}
/**
 * Check if an error has the retryable trait
 */
export const isRetryable = <E>(error: E): error is E & RetryableError => {
  if (Predicate.isObject(error) && Predicate.hasProperty(retryableKey)(error)) {
    return true;
  }
  return false;
};

/**
 * Check if an error is a throttling error (has retryable trait with throttling: true)
 */
export const isThrottlingError = (error: unknown): boolean => {
  if (Predicate.isObject(error) && Predicate.hasProperty(retryableKey)(error)) {
    // @ts-expect-error
    return error[retryableKey]?.throttling === true;
  }
  // Also check for ThrottlingError category for backwards compatibility
  return hasCategory(error, ThrottlingError);
};

export interface TransientError {}

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
 * 1. Smithy's @retryable trait (via withRetryable)
 * 2. ThrottlingError, ServerError, or NetworkError categories
 * 3. HttpClientError transport errors (network failures from @effect/platform)
 */
export const isTransientError = <E>(error: E): error is E & TransientError => {
  // Check for retryable trait first (Smithy's @retryable)
  if (isRetryable(error)) {
    return true;
  }

  // Check for HttpClient transport errors (network failures)
  if (isHttpClientTransportError(error)) {
    return true;
  }

  // Fall back to category-based checking
  return (
    hasCategory(error, RetryableError) ||
    hasCategory(error, ThrottlingError) ||
    hasCategory(error, ServerError) ||
    hasCategory(error, NetworkError)
  );
};

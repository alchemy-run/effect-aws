import * as Effect from "effect/Effect";
import * as Predicate from "effect/Predicate";

export const ERROR_CATEGORIES = {
  AWS_ERROR: "AWS_ERROR",
  COMMON_ERROR: "COMMON_ERROR",
  THROTTLING_ERROR: "THROTTLING_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ERROR_CATEGORY =
  (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];

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
  <Categories extends Array<ERROR_CATEGORY>>(...categories: Categories) =>
  <Args extends Array<any>, Ret, C extends { new (...args: Args): Ret }>(
    C: C,
  ): C & {
    new (
      ...args: Args
    ): Ret & { [categoriesKey]: { [Cat in Categories[number]]: true } };
  } => {
    // @ts-expect-error
    const Mixed = class extends C {};

    for (const category of categories) {
      if (!(categoriesKey in Mixed.prototype)) {
        // @ts-expect-error
        Mixed.prototype[categoriesKey] = {};
      }
      // @ts-expect-error
      Mixed.prototype[categoriesKey][category] = true;
    }

    return Mixed as any;
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
    // @ts-expect-error
    const Mixed = class extends C {};
    // @ts-expect-error
    Mixed.prototype[retryableKey] = info;
    return Mixed as any;
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

/**
 * Check if an error has a specific category
 */
export const hasCategory = (
  error: unknown,
  category: ERROR_CATEGORY,
): boolean => {
  if (
    Predicate.isObject(error) &&
    Predicate.hasProperty(categoriesKey)(error)
  ) {
    // @ts-expect-error
    return category in error[categoriesKey];
  }
  return false;
};

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
  // Also check for THROTTLING_ERROR category for backwards compatibility
  return hasCategory(error, ERROR_CATEGORIES.THROTTLING_ERROR);
};

export interface TransientError {}
/**
 * Check if an error is a transient error that should be automatically retried.
 * Checks for:
 * 1. Smithy's @retryable trait (via withRetryable)
 * 2. THROTTLING_ERROR, SERVER_ERROR, or NETWORK_ERROR categories
 */
export const isTransientError = <E>(error: E): error is E & TransientError => {
  // Check for retryable trait first (Smithy's @retryable)
  if (isRetryable(error)) {
    return true;
  }

  // Fall back to category-based checking
  return (
    hasCategory(error, ERROR_CATEGORIES.THROTTLING_ERROR) ||
    hasCategory(error, ERROR_CATEGORIES.SERVER_ERROR) ||
    hasCategory(error, ERROR_CATEGORIES.NETWORK_ERROR)
  );
};

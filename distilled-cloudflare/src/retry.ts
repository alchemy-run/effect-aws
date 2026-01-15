/**
 * Retry policy infrastructure for Cloudflare API calls.
 *
 * Provides configurable retry behavior via Effect context.
 * Users can apply different policies at different scopes.
 *
 * @example
 * ```ts
 * import * as Retry from "distilled-cloudflare/retry"
 *
 * // Use default policy (5 retries with exponential backoff)
 * myEffect.pipe(Retry.policy(Retry.makeDefault))
 *
 * // Retry transient errors indefinitely (for tests)
 * myEffect.pipe(Retry.transient)
 *
 * // Disable retries
 * myEffect.pipe(Retry.none)
 * ```
 */

import * as Context from "effect/Context";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Layer from "effect/Layer";
import type * as Ref from "effect/Ref";
import * as Schedule from "effect/Schedule";
import { isRetryable, isThrottlingError, isTransientError } from "./category.ts";

/**
 * Retry policy options that match the Effect.retry contract.
 */
export interface Options {
  /**
   * Predicate to determine if an error should trigger a retry.
   */
  readonly while?: (error: unknown) => boolean;
  /**
   * The schedule to use for retrying.
   */
  readonly schedule?: Schedule.Schedule<unknown>;
}

/**
 * A factory function that creates retry policy options with access to the last error ref.
 * This allows dynamic policies that can inspect the last error for retry-after headers, etc.
 */
export type Factory = (lastError: Ref.Ref<unknown>) => Options;

/**
 * A retry policy can be either static options or a factory that receives the last error ref.
 */
export type Policy = Options | Factory;

/**
 * Context tag for configuring retry behavior of Cloudflare API calls.
 */
export class Retry extends Context.Tag("Retry")<Retry, Policy>() {}

/**
 * Provides a custom retry policy to all Cloudflare API calls in the effect.
 *
 * @example
 * ```ts
 * import * as Retry from "distilled-cloudflare/retry"
 * import * as Schedule from "effect/Schedule"
 *
 * // Static policy
 * myEffect.pipe(
 *   Retry.policy({
 *     while: isThrottlingError,
 *     schedule: Schedule.exponential(1000),
 *   })
 * )
 *
 * // Dynamic policy with access to last error ref
 * myEffect.pipe(
 *   Retry.policy((lastError) => ({
 *     while: isThrottlingError,
 *     schedule: Schedule.exponential(1000).pipe(
 *       Schedule.modifyDelayEffect(
 *         Effect.gen(function* () {
 *           const error = yield* lastError;
 *           if (error?.retryAfterSeconds) {
 *             return Duration.seconds(error.retryAfterSeconds);
 *           }
 *           return duration;
 *         })
 *       )
 *     ),
 *   }))
 * )
 * ```
 */
export const policy: {
  (
    options: Options,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, Exclude<R, Retry>>;
  (
    factory: Factory,
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, Exclude<R, Retry>>;
} = (optionsOrFactory: Options | Factory) => Effect.provide(Layer.succeed(Retry, optionsOrFactory));

/**
 * Disables all automatic retries.
 *
 * @example
 * ```ts
 * import * as Retry from "distilled-cloudflare/retry"
 *
 * myEffect.pipe(Retry.none)
 * ```
 */
export const none: <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E, Exclude<R, Retry>> = Effect.provide(
  Layer.succeed(Retry, { while: () => false }),
);

/**
 * Creates the default retry policy used by distilled-cloudflare.
 *
 * This policy:
 * - Retries transient errors, throttling errors, and errors with the retryable trait
 * - Uses exponential backoff starting at 100ms with a factor of 2
 * - Respects RetryAfter headers when present
 * - Ensures at least 500ms delay for throttling errors
 * - Limits to 5 retry attempts
 * - Applies jitter to avoid thundering herd
 */
export const makeDefault: Factory = (lastError) => ({
  while: (error) => isTransientError(error) || isThrottlingError(error) || isRetryable(error),
  schedule: pipe(
    Schedule.exponential(100, 2),
    Schedule.modifyDelayEffect(
      Effect.fnUntraced(function* (duration) {
        const error = yield* lastError;
        if (isRetryable(error)) {
          const retryable = error as { retryAfterSeconds?: number; RetryAfterSeconds?: number };
          const retryAfter = Number(
            retryable.retryAfterSeconds ?? retryable.RetryAfterSeconds ?? 0,
          );
          if (!isNaN(retryAfter) && retryAfter > 0) {
            return Duration.toMillis(Duration.seconds(retryAfter));
          }
        }
        if (isThrottlingError(error)) {
          if (Duration.toMillis(duration) < 500) {
            // if we got throttled, ensure the delay is at least 500ms
            return Duration.toMillis(Duration.millis(500));
          }
        }
        return Duration.toMillis(duration);
      }),
    ),
    Schedule.intersect(Schedule.recurs(5)),
    Schedule.jittered,
  ),
});

/**
 * Retry options that retries all throttling errors indefinitely.
 */
export const throttlingOptions: Options = {
  while: isThrottlingError,
  schedule: pipe(
    Schedule.exponential(1000, 2),
    Schedule.modifyDelay((duration) =>
      Duration.toMillis(duration) > 5000 ? Duration.millis(5000) : duration,
    ),
    Schedule.jittered,
  ),
};

/**
 * Retries all throttling errors indefinitely.
 *
 * @example
 * ```ts
 * import * as Retry from "distilled-cloudflare/retry"
 *
 * myEffect.pipe(Retry.throttling)
 * ```
 */
export const throttling: <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E, Exclude<R, Retry>> = policy(throttlingOptions);

/**
 * Retry options that retries all transient errors indefinitely.
 *
 * This includes:
 * 1. Throttling errors
 * 2. Retryable trait errors
 * 3. Server errors
 * 4. Network errors
 */
export const transientOptions: Options = {
  while: isTransientError,
  schedule: pipe(
    Schedule.exponential(1000, 2),
    Schedule.modifyDelay((duration) =>
      Duration.toMillis(duration) > 5000 ? Duration.millis(5000) : duration,
    ),
    Schedule.jittered,
  ),
};

/**
 * Retries all transient errors indefinitely.
 *
 * @example
 * ```ts
 * import * as Retry from "distilled-cloudflare/retry"
 *
 * myEffect.pipe(Retry.transient)
 * ```
 */
export const transient: <A, E, R>(
  effect: Effect.Effect<A, E, R>,
) => Effect.Effect<A, E, Exclude<R, Retry>> = policy(transientOptions);

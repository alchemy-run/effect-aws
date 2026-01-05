/**
 * AWS Credentials providers for obtaining temporary or long-lived credentials.
 *
 * @example
 * ```ts
 * import { Credentials } from "effect-aws"
 *
 * // Use the default credential chain
 * const layer = Credentials.fromChain()
 *
 * // Or use SSO credentials
 * const ssoLayer = Credentials.fromSSO("my-profile")
 * ```
 *
 * @since 1.0.0
 */
export * as Credentials from "./aws/credentials.ts";

/**
 * AWS Endpoint configuration for custom or local endpoints.
 *
 * @example
 * ```ts
 * import { Endpoint } from "effect-aws"
 * import { Layer } from "effect"
 *
 * // Point to LocalStack
 * const localstack = Layer.succeed(Endpoint.Endpoint, "http://localhost:4566")
 * ```
 *
 * @since 1.0.0
 */
export * as Endpoint from "./aws/endpoint.ts";

/**
 * AWS Region configuration.
 *
 * @example
 * ```ts
 * import { Region } from "effect-aws"
 * import { Layer } from "effect"
 *
 * const region = Layer.succeed(Region.Region, "us-east-1")
 * ```
 *
 * @since 1.0.0
 */
export * as Region from "./aws/region.ts";

/**
 * Common AWS error types shared across all services.
 *
 * @example
 * ```ts
 * import { Errors } from "effect-aws"
 *
 * // Handle common errors
 * Effect.catchTag("ThrottlingException", (e) => ...)
 * ```
 *
 * @since 1.0.0
 */
export * as Errors from "./aws/errors.ts";

/**
 * Smithy trait annotations for AWS service schemas.
 *
 * @since 1.0.0
 */
export * as Traits from "./traits.ts";

/**
 * Error categories for classifying AWS errors.
 *
 * @example
 * ```ts
 * import { ErrorCategory } from "effect-aws"
 *
 * // Check if an error is transient
 * if (ErrorCategory.isTransientError(error)) {
 *   // Retry logic
 * }
 *
 * // Use category-based error handling
 * effect.pipe(
 *   ErrorCategory.catchCategory("THROTTLING_ERROR", (e) => ...)
 * )
 * ```
 *
 * @since 1.0.0
 */
export * as ErrorCategory from "./error-category.ts";

/**
 * Retry policy configuration for AWS API calls.
 *
 * @example
 * ```ts
 * import { Retry } from "effect-aws"
 * import * as Schedule from "effect/Schedule"
 *
 * // Custom policy
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
 *       Schedule.modifyDelayEffect(Effect.gen(function* () {
 *         const error = yield* lastError;
 *         // inspect error for retry-after headers, etc.
 *       }))
 *     ),
 *   }))
 * )
 *
 * // Disable retries
 * myEffect.pipe(Retry.none)
 *
 * // Retry throttling errors indefinitely
 * myEffect.pipe(Retry.throttling)
 *
 * // Retry all transient errors indefinitely
 * myEffect.pipe(Retry.transient)
 * ```
 *
 * @since 1.0.0
 */
export * as Retry from "./retry-policy.ts";

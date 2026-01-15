/**
 * AWS Credentials providers for obtaining temporary or long-lived credentials.
 *
 * @example
 * ```ts
 * import { Credentials } from "distilled-aws"
 *
 * // Use the default credential chain
 * const layer = Credentials.fromChain()
 *
 * // Or use SSO credentials
 * const ssoLayer = Credentials.fromSSO("my-profile")
 * ```
 *
 * @since 0.0.0
 */
export * as Credentials from "./credentials.ts";

/**
 * AWS Endpoint configuration for custom or local endpoints.
 *
 * @example
 * ```ts
 * import { Endpoint } from "distilled-aws"
 * import { Layer } from "effect"
 *
 * // Point to LocalStack
 * const localstack = Layer.succeed(Endpoint.Endpoint, "http://localhost:4566")
 * ```
 *
 * @since 0.0.0
 */
export * as Endpoint from "./endpoint.ts";

/**
 * Common AWS error types shared across all services.
 *
 * @example
 * ```ts
 * import { Errors } from "distilled-aws"
 *
 * // Handle common errors
 * Effect.catchTag("ThrottlingException", (e) => ...)
 * ```
 *
 * @since 0.0.0
 */
export * as Errors from "./errors.ts";

/**
 * AWS Region configuration.
 *
 * @example
 * ```ts
 * import { Region } from "distilled-aws"
 * import { Layer } from "effect"
 *
 * const region = Layer.succeed(Region.Region, "us-east-1")
 * ```
 *
 * @since 0.0.0
 */
export * as Region from "./region.ts";

/**
 * Retry policy configuration for AWS API calls.
 *
 * @example
 * ```ts
 * import { Retry } from "distilled-aws"
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
 * @since 0.0.0
 */
export * as Retry from "./retry.ts";

/**
 * Sensitive data schemas for the smithy.api#sensitive trait.
 * Wraps values in Effect's Redacted type to prevent accidental logging.
 *
 * @since 0.0.0
 */
export * as Sensitive from "./sensitive.ts";

/**
 * Smithy trait annotations for AWS service schemas.
 *
 * @since 0.0.0
 */
export * as Traits from "./traits.ts";

/**
 * Base error types for Cloudflare API errors.
 *
 * All Cloudflare API responses follow this pattern:
 * {
 *   success: boolean;
 *   errors: Array<{ code: number; message: string }>;
 *   messages: Array<{ code: number; message: string }>;
 *   result: T | null;
 * }
 */

import * as Schema from "effect/Schema";

/**
 * A single Cloudflare error from the errors array.
 */
export class CloudflareErrorInfo extends Schema.Class<CloudflareErrorInfo>("CloudflareErrorInfo")({
  code: Schema.Number,
  message: Schema.String,
}) {}

/**
 * Base tagged error for all Cloudflare API errors.
 * Contains the error code and message from the API response.
 */
export class CloudflareError extends Schema.TaggedError<CloudflareError>()("CloudflareError", {
  code: Schema.Number,
  message: Schema.String,
}) {}

/**
 * Unknown Cloudflare error - returned when an error code is not recognized.
 * Contains the raw error code for later cataloging.
 */
export class UnknownCloudflareError extends Schema.TaggedError<UnknownCloudflareError>()(
  "UnknownCloudflareError",
  {
    code: Schema.Number,
    message: Schema.String,
    /** The error code as a string for error discovery tooling */
    errorCode: Schema.String,
  },
) {}

/**
 * Network error - HTTP request failed at the transport level.
 */
export class CloudflareNetworkError extends Schema.TaggedError<CloudflareNetworkError>()(
  "CloudflareNetworkError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
) {}

/**
 * HTTP error - non-2xx response without a parseable Cloudflare error body.
 */
export class CloudflareHttpError extends Schema.TaggedError<CloudflareHttpError>()(
  "CloudflareHttpError",
  {
    status: Schema.Number,
    statusText: Schema.String,
    body: Schema.optional(Schema.String),
  },
) {}

/**
 * Common errors that can occur on any Cloudflare API operation.
 */
export type CommonErrors =
  | CloudflareError
  | UnknownCloudflareError
  | CloudflareNetworkError
  | CloudflareHttpError;

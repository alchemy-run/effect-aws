import * as S from "effect/Schema";
import * as Category from "./category.ts";

//==== Common AWS Errors ====
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
).pipe(Category.withAuthError) {}

export class ExpiredTokenException extends S.TaggedError<ExpiredTokenException>()(
  "ExpiredTokenException",
  {},
).pipe(Category.withAuthError) {}

export class IncompleteSignature extends S.TaggedError<IncompleteSignature>()(
  "IncompleteSignature",
  {},
).pipe(Category.withAuthError) {}

export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  {},
).pipe(Category.withServerError) {}

export class MalformedHttpRequestException extends S.TaggedError<MalformedHttpRequestException>()(
  "MalformedHttpRequestException",
  {},
).pipe(Category.withBadRequestError) {}

export class NotAuthorized extends S.TaggedError<NotAuthorized>()(
  "NotAuthorized",
  {},
).pipe(Category.withAuthError) {}

export class OptInRequired extends S.TaggedError<OptInRequired>()(
  "OptInRequired",
  {},
).pipe(Category.withAuthError) {}

export class RequestAbortedException extends S.TaggedError<RequestAbortedException>()(
  "RequestAbortedException",
  {},
).pipe(Category.withAbortedError) {}

export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  {},
).pipe(Category.withBadRequestError) {}

export class RequestExpired extends S.TaggedError<RequestExpired>()(
  "RequestExpired",
  {},
).pipe(Category.withBadRequestError, Category.withTimeoutError) {}

export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  {},
).pipe(Category.withTimeoutError) {}

export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  {},
).pipe(Category.withServerError) {}

export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
).pipe(Category.withThrottlingError) {}

export class UnrecognizedClientException extends S.TaggedError<UnrecognizedClientException>()(
  "UnrecognizedClientException",
  {},
).pipe(Category.withAuthError) {}

export class UnknownOperationException extends S.TaggedError<UnknownOperationException>()(
  "UnknownOperationException",
  {},
).pipe(Category.withBadRequestError) {}

export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  {},
).pipe(Category.withBadRequestError) {}

export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
).pipe(Category.withBadRequestError) {}

export class OperationAborted extends S.TaggedError<OperationAborted>()(
  "OperationAborted",
  {},
).pipe(Category.withAbortedError) {}

export class UnknownAwsError extends S.TaggedError<UnknownAwsError>()(
  "UnknownAwsError",
  {
    errorTag: S.String,
    errorData: S.Any,
  },
) {}

/**
 * Check if an error is a transient network error that should be retried.
 * These are low-level fetch/socket errors that indicate temporary connectivity issues.
 */
export const isTransientNetworkError = (err: unknown): boolean => {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; name?: string; cause?: unknown };
  // Check for common transient error codes
  if (
    e.code === "UND_ERR_SOCKET" ||
    e.code === "ECONNRESET" ||
    e.code === "UND_ERR_CONNECT_TIMEOUT" ||
    e.code === "EPIPE" ||
    e.name === "FetchError"
  ) {
    return true;
  }
  // Also check the cause chain for nested errors (fetch wraps errors)
  if (e.cause) {
    return isTransientNetworkError(e.cause);
  }
  return false;
};

/**
 * Error thrown when a fetch request fails due to a transient network issue.
 * Marked as retryable so the default retry policy will automatically retry these.
 */
export class TransientFetchError extends S.TaggedError<TransientFetchError>()(
  "TransientFetchError",
  {
    message: S.String,
    cause: S.Any,
  },
).pipe(Category.withNetworkError) {}

export class InternalError extends S.TaggedError<InternalError>()(
  "InternalError",
  {},
).pipe(Category.withServerError) {}

/** Error when endpoint resolution fails due to a rule error */
export class EndpointError extends S.TaggedError<EndpointError>()(
  "EndpointError",
  { message: S.String },
).pipe(Category.withServerError) {}

/** Error when no rule matches in the ruleset */
export class NoMatchingRuleError extends S.TaggedError<NoMatchingRuleError>()(
  "NoMatchingRuleError",
  {},
) {}

export class ParseError extends S.TaggedError<ParseError>()("ParseError", {}) {}

export const COMMON_ERRORS = [
  AccessDeniedException,
  ExpiredTokenException,
  IncompleteSignature,
  InternalError,
  InternalFailure,
  MalformedHttpRequestException,
  NotAuthorized,
  OperationAborted,
  OptInRequired,
  RequestAbortedException,
  RequestEntityTooLargeException,
  RequestExpired,
  RequestTimeoutException,
  ServiceUnavailable,
  ThrottlingException,
  UnknownOperationException,
  UnrecognizedClientException,
  ValidationError,
  ValidationException,
] as const;

export type CommonAwsError =
  | AccessDeniedException
  | ExpiredTokenException
  | IncompleteSignature
  | InternalFailure
  | MalformedHttpRequestException
  | NotAuthorized
  | OptInRequired
  | RequestAbortedException
  | RequestEntityTooLargeException
  | RequestExpired
  | RequestTimeoutException
  | ServiceUnavailable
  | ThrottlingException
  | UnrecognizedClientException
  | UnknownOperationException
  | ValidationError
  | ValidationException
  | OperationAborted;

/** All error types that can be returned by AWS operations */
export type CommonErrors =
  | UnknownAwsError
  | CommonAwsError
  | EndpointError
  | NoMatchingRuleError;

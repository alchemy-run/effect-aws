import * as S from "effect/Schema";
import {
  ERROR_CATEGORIES,
  withCategory,
  withRetryable,
} from "../error-category.ts";

//==== Common AWS Errors ====
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class ExpiredTokenException extends S.TaggedError<ExpiredTokenException>()(
  "ExpiredTokenException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class IncompleteSignature extends S.TaggedError<IncompleteSignature>()(
  "IncompleteSignature",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  {},
).pipe(
  withCategory(
    ERROR_CATEGORIES.AWS_ERROR,
    ERROR_CATEGORIES.COMMON_ERROR,
    ERROR_CATEGORIES.SERVER_ERROR,
  ),
  withRetryable(),
) {}

export class MalformedHttpRequestException extends S.TaggedError<MalformedHttpRequestException>()(
  "MalformedHttpRequestException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class NotAuthorized extends S.TaggedError<NotAuthorized>()(
  "NotAuthorized",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class OptInRequired extends S.TaggedError<OptInRequired>()(
  "OptInRequired",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class RequestAbortedException extends S.TaggedError<RequestAbortedException>()(
  "RequestAbortedException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class RequestExpired extends S.TaggedError<RequestExpired>()(
  "RequestExpired",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class RequestTimeoutException extends S.TaggedError<RequestTimeoutException>()(
  "RequestTimeoutException",
  {},
).pipe(
  withCategory(
    ERROR_CATEGORIES.AWS_ERROR,
    ERROR_CATEGORIES.COMMON_ERROR,
    ERROR_CATEGORIES.SERVER_ERROR,
  ),
  withRetryable(),
) {}

export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  {},
).pipe(
  withCategory(
    ERROR_CATEGORIES.AWS_ERROR,
    ERROR_CATEGORIES.COMMON_ERROR,
    ERROR_CATEGORIES.SERVER_ERROR,
  ),
  withRetryable(),
) {}

export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
).pipe(
  withCategory(
    ERROR_CATEGORIES.AWS_ERROR,
    ERROR_CATEGORIES.COMMON_ERROR,
    ERROR_CATEGORIES.THROTTLING_ERROR,
  ),
  withRetryable({ throttling: true }),
) {}

export class UnrecognizedClientException extends S.TaggedError<UnrecognizedClientException>()(
  "UnrecognizedClientException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class UnknownOperationException extends S.TaggedError<UnknownOperationException>()(
  "UnknownOperationException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class OperationAborted extends S.TaggedError<OperationAborted>()(
  "OperationAborted",
  {},
).pipe(
  withCategory(ERROR_CATEGORIES.AWS_ERROR, ERROR_CATEGORIES.COMMON_ERROR),
) {}

export class UnknownAwsError extends S.TaggedError<UnknownAwsError>()(
  "UnknownAwsError",
  {
    errorTag: S.String,
    errorData: S.Any,
  },
).pipe(withCategory(ERROR_CATEGORIES.AWS_ERROR)) {}

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
).pipe(withCategory(ERROR_CATEGORIES.NETWORK_ERROR), withRetryable()) {}

export class InternalError extends S.TaggedError<InternalError>()(
  "InternalError",
  {},
).pipe(
  withCategory(
    ERROR_CATEGORIES.AWS_ERROR,
    ERROR_CATEGORIES.COMMON_ERROR,
    ERROR_CATEGORIES.SERVER_ERROR,
  ),
  withRetryable(),
) {}

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

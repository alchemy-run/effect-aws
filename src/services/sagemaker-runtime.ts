import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker Runtime",
  serviceShapeName: "AmazonSageMakerRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2017-05-13");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(
                `https://runtime-fips.sagemaker.${Region}.amazonaws.com`,
              );
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://runtime.sagemaker.${Region}.amazonaws.com`);
            }
            return e(
              `https://runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EndpointName = string;
export type Header = string;
export type CustomAttributesHeader = string | redacted.Redacted<string>;
export type TargetModelHeader = string;
export type TargetVariantHeader = string;
export type TargetContainerHostnameHeader = string;
export type InferenceId = string;
export type EnableExplanationsHeader = string;
export type InferenceComponentHeader = string;
export type SessionIdOrNewSessionConstantHeader = string;
export type InputLocationHeader = string;
export type RequestTTLSecondsHeader = number;
export type InvocationTimeoutSecondsHeader = number;
export type SessionIdHeader = string;
export type NewSessionResponseHeader = string;
export type Message = string;
export type PartBlob = Uint8Array | redacted.Redacted<Uint8Array>;
export type ErrorCode = string;
export type StatusCode = number;
export type LogStreamArn = string;

//# Schemas
export interface InvokeEndpointInput {
  EndpointName: string;
  Body?: T.StreamingInputBody;
  ContentType?: string;
  Accept?: string;
  CustomAttributes?: string | redacted.Redacted<string>;
  TargetModel?: string;
  TargetVariant?: string;
  TargetContainerHostname?: string;
  InferenceId?: string;
  EnableExplanations?: string;
  InferenceComponentName?: string;
  SessionId?: string;
}
export const InvokeEndpointInput = S.suspend(() =>
  S.Struct({
    EndpointName: S.String.pipe(T.HttpLabel("EndpointName")),
    Body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    CustomAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    TargetModel: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Model"),
    ),
    TargetVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Variant"),
    ),
    TargetContainerHostname: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Container-Hostname"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    EnableExplanations: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Enable-Explanations"),
    ),
    InferenceComponentName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Component"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Session-Id"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/endpoints/{EndpointName}/invocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeEndpointInput",
}) as any as S.Schema<InvokeEndpointInput>;
export interface InvokeEndpointAsyncInput {
  EndpointName: string;
  ContentType?: string;
  Accept?: string;
  CustomAttributes?: string | redacted.Redacted<string>;
  InferenceId?: string;
  InputLocation?: string;
  RequestTTLSeconds?: number;
  InvocationTimeoutSeconds?: number;
}
export const InvokeEndpointAsyncInput = S.suspend(() =>
  S.Struct({
    EndpointName: S.String.pipe(T.HttpLabel("EndpointName")),
    ContentType: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Content-Type"),
    ),
    Accept: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-SageMaker-Accept")),
    CustomAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    InputLocation: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-InputLocation"),
    ),
    RequestTTLSeconds: S.optional(S.Number).pipe(
      T.HttpHeader("X-Amzn-SageMaker-RequestTTLSeconds"),
    ),
    InvocationTimeoutSeconds: S.optional(S.Number).pipe(
      T.HttpHeader("X-Amzn-SageMaker-InvocationTimeoutSeconds"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/endpoints/{EndpointName}/async-invocations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeEndpointAsyncInput",
}) as any as S.Schema<InvokeEndpointAsyncInput>;
export interface InvokeEndpointWithResponseStreamInput {
  EndpointName: string;
  Body?: T.StreamingInputBody;
  ContentType?: string;
  Accept?: string;
  CustomAttributes?: string | redacted.Redacted<string>;
  TargetVariant?: string;
  TargetContainerHostname?: string;
  InferenceId?: string;
  InferenceComponentName?: string;
  SessionId?: string;
}
export const InvokeEndpointWithResponseStreamInput = S.suspend(() =>
  S.Struct({
    EndpointName: S.String.pipe(T.HttpLabel("EndpointName")),
    Body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Accept: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-SageMaker-Accept")),
    CustomAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    TargetVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Variant"),
    ),
    TargetContainerHostname: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Container-Hostname"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    InferenceComponentName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Component"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Session-Id"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/endpoints/{EndpointName}/invocations-response-stream",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeEndpointWithResponseStreamInput",
}) as any as S.Schema<InvokeEndpointWithResponseStreamInput>;
export interface InvokeEndpointOutput {
  Body: T.StreamingOutputBody;
  ContentType?: string;
  InvokedProductionVariant?: string;
  CustomAttributes?: string | redacted.Redacted<string>;
  NewSessionId?: string;
  ClosedSessionId?: string;
}
export const InvokeEndpointOutput = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    InvokedProductionVariant: S.optional(S.String).pipe(
      T.HttpHeader("x-Amzn-Invoked-Production-Variant"),
    ),
    CustomAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    NewSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-New-Session-Id"),
    ),
    ClosedSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Closed-Session-Id"),
    ),
  }),
).annotations({
  identifier: "InvokeEndpointOutput",
}) as any as S.Schema<InvokeEndpointOutput>;
export interface InvokeEndpointAsyncOutput {
  InferenceId?: string;
  OutputLocation?: string;
  FailureLocation?: string;
}
export const InvokeEndpointAsyncOutput = S.suspend(() =>
  S.Struct({
    InferenceId: S.optional(S.String),
    OutputLocation: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-OutputLocation"),
    ),
    FailureLocation: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-FailureLocation"),
    ),
  }),
).annotations({
  identifier: "InvokeEndpointAsyncOutput",
}) as any as S.Schema<InvokeEndpointAsyncOutput>;
export interface PayloadPart {
  Bytes?: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const PayloadPart = S.suspend(() =>
  S.Struct({ Bytes: S.optional(SensitiveBlob).pipe(T.EventPayload()) }),
).annotations({ identifier: "PayloadPart" }) as any as S.Schema<PayloadPart>;
export type ResponseStream =
  | { PayloadPart: PayloadPart }
  | { ModelStreamError: ModelStreamError }
  | { InternalStreamFailure: InternalStreamFailure };
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ PayloadPart: PayloadPart }),
    S.Struct({
      ModelStreamError: S.suspend(() => ModelStreamError).annotations({
        identifier: "ModelStreamError",
      }),
    }),
    S.Struct({
      InternalStreamFailure: S.suspend(() => InternalStreamFailure).annotations(
        { identifier: "InternalStreamFailure" },
      ),
    }),
  ),
) as any as S.Schema<stream.Stream<ResponseStream, Error, never>>;
export interface InvokeEndpointWithResponseStreamOutput {
  Body: stream.Stream<ResponseStream, Error, never>;
  ContentType?: string;
  InvokedProductionVariant?: string;
  CustomAttributes?: string | redacted.Redacted<string>;
}
export const InvokeEndpointWithResponseStreamOutput = S.suspend(() =>
  S.Struct({
    Body: ResponseStream.pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Content-Type"),
    ),
    InvokedProductionVariant: S.optional(S.String).pipe(
      T.HttpHeader("x-Amzn-Invoked-Production-Variant"),
    ),
    CustomAttributes: S.optional(SensitiveString).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
  }),
).annotations({
  identifier: "InvokeEndpointWithResponseStreamOutput",
}) as any as S.Schema<InvokeEndpointWithResponseStreamOutput>;

//# Errors
export class InternalDependencyException extends S.TaggedError<InternalDependencyException>()(
  "InternalDependencyException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalStreamFailure extends S.TaggedError<InternalStreamFailure>()(
  "InternalStreamFailure",
  { Message: S.optional(S.String) },
) {}
export class ModelError extends S.TaggedError<ModelError>()("ModelError", {
  Message: S.optional(S.String),
  OriginalStatusCode: S.optional(S.Number),
  OriginalMessage: S.optional(S.String),
  LogStreamArn: S.optional(S.String),
}) {}
export class ModelStreamError extends S.TaggedError<ModelStreamError>()(
  "ModelStreamError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ModelNotReadyException extends S.TaggedError<ModelNotReadyException>()(
  "ModelNotReadyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ModelNotReadyException", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * After you deploy a model into production using Amazon SageMaker AI hosting services,
 * your client applications use this API to get inferences from the model hosted at the
 * specified endpoint in an asynchronous manner.
 *
 * Inference requests sent to this API are enqueued for asynchronous processing. The
 * processing of the inference request may or may not complete before you receive a
 * response from this API. The response from this API will not contain the result of the
 * inference request but contain information about where you can locate it.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpointAsync` are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating
 * Requests (Amazon Web Services Signature Version 4) in the *Amazon S3 API Reference*.
 */
export const invokeEndpointAsync: (
  input: InvokeEndpointAsyncInput,
) => effect.Effect<
  InvokeEndpointAsyncOutput,
  InternalFailure | ServiceUnavailable | ValidationError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointAsyncInput,
  output: InvokeEndpointAsyncOutput,
  errors: [InternalFailure, ServiceUnavailable, ValidationError],
}));
/**
 * After you deploy a model into production using Amazon SageMaker AI hosting services,
 * your client applications use this API to get inferences from the model hosted at the
 * specified endpoint.
 *
 * For an overview of Amazon SageMaker AI, see How It Works.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpoint` are authenticated by using Amazon Web Services
 * Signature Version 4. For information, see Authenticating
 * Requests (Amazon Web Services Signature Version 4) in the *Amazon S3 API Reference*.
 *
 * A customer's model containers must respond to requests within 60 seconds. The model
 * itself can have a maximum processing time of 60 seconds before responding to
 * invocations. If your model is going to take 50-60 seconds of processing time, the SDK
 * socket timeout should be set to be 70 seconds.
 *
 * Endpoints are scoped to an individual account, and are not public. The URL does
 * not contain the account ID, but Amazon SageMaker AI determines the account ID from
 * the authentication token that is supplied by the caller.
 */
export const invokeEndpoint: (
  input: InvokeEndpointInput,
) => effect.Effect<
  InvokeEndpointOutput,
  | InternalDependencyException
  | InternalFailure
  | ModelError
  | ModelNotReadyException
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointInput,
  output: InvokeEndpointOutput,
  errors: [
    InternalDependencyException,
    InternalFailure,
    ModelError,
    ModelNotReadyException,
    ServiceUnavailable,
    ValidationError,
  ],
}));
/**
 * Invokes a model at the specified endpoint to return the inference response as a
 * stream. The inference stream provides the response payload incrementally as a series of
 * parts. Before you can get an inference stream, you must have access to a model that's
 * deployed using Amazon SageMaker AI hosting services, and the container for that model
 * must support inference streaming.
 *
 * For more information that can help you use this API, see the following sections in the
 * *Amazon SageMaker AI Developer Guide*:
 *
 * - For information about how to add streaming support to a model, see How Containers Serve Requests.
 *
 * - For information about how to process the streaming response, see Invoke real-time endpoints.
 *
 * Before you can use this operation, your IAM permissions must allow the
 * `sagemaker:InvokeEndpoint` action. For more information about Amazon SageMaker AI actions for IAM policies, see Actions, resources, and condition keys for Amazon SageMaker AI in the IAM Service Authorization
 * Reference.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpointWithResponseStream` are authenticated by using
 * Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the
 * *Amazon S3 API Reference*.
 */
export const invokeEndpointWithResponseStream: (
  input: InvokeEndpointWithResponseStreamInput,
) => effect.Effect<
  InvokeEndpointWithResponseStreamOutput,
  | InternalFailure
  | InternalStreamFailure
  | ModelError
  | ModelStreamError
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointWithResponseStreamInput,
  output: InvokeEndpointWithResponseStreamOutput,
  errors: [
    InternalFailure,
    InternalStreamFailure,
    ModelError,
    ModelStreamError,
    ServiceUnavailable,
    ValidationError,
  ],
}));

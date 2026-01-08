import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker Runtime HTTP2",
  serviceShapeName: "AmazonSageMakerRuntimeHttp2",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2025-10-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}:8443`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://runtime-fips.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}:8443`,
          );
        }
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
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
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

//# Schemas
export interface RequestPayloadPart {
  Bytes?: Uint8Array | Redacted.Redacted<Uint8Array>;
  DataType?: string;
  CompletionState?: string;
  P?: string;
}
export const RequestPayloadPart = S.suspend(() =>
  S.Struct({
    Bytes: S.optional(SensitiveBlob).pipe(T.EventPayload()),
    DataType: S.optional(S.String).pipe(T.EventHeader()),
    CompletionState: S.optional(S.String).pipe(T.EventHeader()),
    P: S.optional(S.String).pipe(T.EventHeader()),
  }),
).annotations({
  identifier: "RequestPayloadPart",
}) as any as S.Schema<RequestPayloadPart>;
export const RequestStreamEvent = T.InputEventStream(
  S.Union(S.Struct({ PayloadPart: RequestPayloadPart })),
);
export interface InvokeEndpointWithBidirectionalStreamInput {
  EndpointName: string;
  Body: (typeof RequestStreamEvent)["Type"];
  TargetVariant?: string;
  ModelInvocationPath?: string;
  ModelQueryString?: string;
}
export const InvokeEndpointWithBidirectionalStreamInput = S.suspend(() =>
  S.Struct({
    EndpointName: S.String.pipe(T.HttpLabel("EndpointName")),
    Body: RequestStreamEvent.pipe(T.HttpPayload()),
    TargetVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Variant"),
    ),
    ModelInvocationPath: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Model-Invocation-Path"),
    ),
    ModelQueryString: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Model-Query-String"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/endpoints/{EndpointName}/invocations-bidirectional-stream",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeEndpointWithBidirectionalStreamInput",
}) as any as S.Schema<InvokeEndpointWithBidirectionalStreamInput>;
export interface ResponsePayloadPart {
  Bytes?: Uint8Array | Redacted.Redacted<Uint8Array>;
  DataType?: string;
  CompletionState?: string;
  P?: string;
}
export const ResponsePayloadPart = S.suspend(() =>
  S.Struct({
    Bytes: S.optional(SensitiveBlob).pipe(T.EventPayload()),
    DataType: S.optional(S.String).pipe(T.EventHeader()),
    CompletionState: S.optional(S.String).pipe(T.EventHeader()),
    P: S.optional(S.String).pipe(T.EventHeader()),
  }),
).annotations({
  identifier: "ResponsePayloadPart",
}) as any as S.Schema<ResponsePayloadPart>;
export const ResponseStreamEvent = T.EventStream(
  S.Union(
    S.Struct({ PayloadPart: ResponsePayloadPart }),
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
);
export interface InvokeEndpointWithBidirectionalStreamOutput {
  Body: (typeof ResponseStreamEvent)["Type"];
  InvokedProductionVariant?: string;
}
export const InvokeEndpointWithBidirectionalStreamOutput = S.suspend(() =>
  S.Struct({
    Body: ResponseStreamEvent.pipe(T.HttpPayload()),
    InvokedProductionVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Invoked-Production-Variant"),
    ),
  }),
).annotations({
  identifier: "InvokeEndpointWithBidirectionalStreamOutput",
}) as any as S.Schema<InvokeEndpointWithBidirectionalStreamOutput>;

//# Errors
export class InputValidationError extends S.TaggedError<InputValidationError>()(
  "InputValidationError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
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
  ErrorCode: S.optional(S.String),
}) {}
export class ModelStreamError extends S.TaggedError<ModelStreamError>()(
  "ModelStreamError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
) {}
export class ServiceUnavailableError extends S.TaggedError<ServiceUnavailableError>()(
  "ServiceUnavailableError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
).pipe(C.withServerError) {}

//# Operations
/**
 * Invokes a model endpoint with bidirectional streaming capabilities. This operation establishes a persistent connection that allows you to send multiple requests and receive streaming responses from the model in real-time.
 *
 * Bidirectional streaming is useful for interactive applications such as chatbots, real-time translation, or any scenario where you need to maintain a conversation-like interaction with the model. The connection remains open, allowing you to send additional input and receive responses without establishing a new connection for each request.
 *
 * For an overview of Amazon SageMaker AI, see How It Works.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add additional headers. You should not rely on the behavior of headers outside those enumerated in the request syntax.
 *
 * Calls to `InvokeEndpointWithBidirectionalStream` are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the *Amazon S3 API Reference*.
 *
 * The bidirectional stream maintains the connection until either the client closes it or the model indicates completion. Each request and response in the stream is sent as an event with optional headers for data type and completion state.
 *
 * Endpoints are scoped to an individual account, and are not public. The URL does not contain the account ID, but Amazon SageMaker AI determines the account ID from the authentication token that is supplied by the caller.
 */
export const invokeEndpointWithBidirectionalStream: (
  input: InvokeEndpointWithBidirectionalStreamInput,
) => Effect.Effect<
  InvokeEndpointWithBidirectionalStreamOutput,
  | InputValidationError
  | InternalServerError
  | InternalStreamFailure
  | ModelError
  | ModelStreamError
  | ServiceUnavailableError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointWithBidirectionalStreamInput,
  output: InvokeEndpointWithBidirectionalStreamOutput,
  errors: [
    InputValidationError,
    InternalServerError,
    InternalStreamFailure,
    ModelError,
    ModelStreamError,
    ServiceUnavailableError,
  ],
}));

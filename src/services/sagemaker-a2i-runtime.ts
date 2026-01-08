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
  sdkId: "SageMaker A2I Runtime",
  serviceShapeName: "AmazonSageMakerA2IRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2019-11-07");
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
              `https://a2i-runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://a2i-runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://a2i-runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://a2i-runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type HumanLoopName = string;
export type FlowDefinitionArn = string;
export type NextToken = string;
export type MaxResults = number;
export type InputContent = string;
export type FailureReason = string;
export type HumanLoopArn = string;

//# Schemas
export interface DeleteHumanLoopRequest {
  HumanLoopName: string;
}
export const DeleteHumanLoopRequest = S.suspend(() =>
  S.Struct({ HumanLoopName: S.String.pipe(T.HttpLabel("HumanLoopName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/human-loops/{HumanLoopName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteHumanLoopRequest",
}) as any as S.Schema<DeleteHumanLoopRequest>;
export interface DeleteHumanLoopResponse {}
export const DeleteHumanLoopResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteHumanLoopResponse",
}) as any as S.Schema<DeleteHumanLoopResponse>;
export interface DescribeHumanLoopRequest {
  HumanLoopName: string;
}
export const DescribeHumanLoopRequest = S.suspend(() =>
  S.Struct({ HumanLoopName: S.String.pipe(T.HttpLabel("HumanLoopName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/human-loops/{HumanLoopName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeHumanLoopRequest",
}) as any as S.Schema<DescribeHumanLoopRequest>;
export interface ListHumanLoopsRequest {
  CreationTimeAfter?: Date;
  CreationTimeBefore?: Date;
  FlowDefinitionArn: string;
  SortOrder?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListHumanLoopsRequest = S.suspend(() =>
  S.Struct({
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("CreationTimeAfter")),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("CreationTimeBefore")),
    FlowDefinitionArn: S.String.pipe(T.HttpQuery("FlowDefinitionArn")),
    SortOrder: S.optional(S.String).pipe(T.HttpQuery("SortOrder")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/human-loops" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListHumanLoopsRequest",
}) as any as S.Schema<ListHumanLoopsRequest>;
export interface StopHumanLoopRequest {
  HumanLoopName: string;
}
export const StopHumanLoopRequest = S.suspend(() =>
  S.Struct({ HumanLoopName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/human-loops/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopHumanLoopRequest",
}) as any as S.Schema<StopHumanLoopRequest>;
export interface StopHumanLoopResponse {}
export const StopHumanLoopResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopHumanLoopResponse",
}) as any as S.Schema<StopHumanLoopResponse>;
export type ContentClassifiers = string[];
export const ContentClassifiers = S.Array(S.String);
export interface HumanLoopInput {
  InputContent: string;
}
export const HumanLoopInput = S.suspend(() =>
  S.Struct({ InputContent: S.String }),
).annotations({
  identifier: "HumanLoopInput",
}) as any as S.Schema<HumanLoopInput>;
export interface HumanLoopDataAttributes {
  ContentClassifiers: ContentClassifiers;
}
export const HumanLoopDataAttributes = S.suspend(() =>
  S.Struct({ ContentClassifiers: ContentClassifiers }),
).annotations({
  identifier: "HumanLoopDataAttributes",
}) as any as S.Schema<HumanLoopDataAttributes>;
export interface StartHumanLoopRequest {
  HumanLoopName: string;
  FlowDefinitionArn: string;
  HumanLoopInput: HumanLoopInput;
  DataAttributes?: HumanLoopDataAttributes;
}
export const StartHumanLoopRequest = S.suspend(() =>
  S.Struct({
    HumanLoopName: S.String,
    FlowDefinitionArn: S.String,
    HumanLoopInput: HumanLoopInput,
    DataAttributes: S.optional(HumanLoopDataAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/human-loops" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartHumanLoopRequest",
}) as any as S.Schema<StartHumanLoopRequest>;
export interface HumanLoopOutput {
  OutputS3Uri: string;
}
export const HumanLoopOutput = S.suspend(() =>
  S.Struct({ OutputS3Uri: S.String }),
).annotations({
  identifier: "HumanLoopOutput",
}) as any as S.Schema<HumanLoopOutput>;
export interface HumanLoopSummary {
  HumanLoopName?: string;
  HumanLoopStatus?: string;
  CreationTime?: Date;
  FailureReason?: string;
  FlowDefinitionArn?: string;
}
export const HumanLoopSummary = S.suspend(() =>
  S.Struct({
    HumanLoopName: S.optional(S.String),
    HumanLoopStatus: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    FailureReason: S.optional(S.String),
    FlowDefinitionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "HumanLoopSummary",
}) as any as S.Schema<HumanLoopSummary>;
export type HumanLoopSummaries = HumanLoopSummary[];
export const HumanLoopSummaries = S.Array(HumanLoopSummary);
export interface DescribeHumanLoopResponse {
  CreationTime: Date;
  FailureReason?: string;
  FailureCode?: string;
  HumanLoopStatus: string;
  HumanLoopName: string;
  HumanLoopArn: string;
  FlowDefinitionArn: string;
  HumanLoopOutput?: HumanLoopOutput;
}
export const DescribeHumanLoopResponse = S.suspend(() =>
  S.Struct({
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    FailureReason: S.optional(S.String),
    FailureCode: S.optional(S.String),
    HumanLoopStatus: S.String,
    HumanLoopName: S.String,
    HumanLoopArn: S.String,
    FlowDefinitionArn: S.String,
    HumanLoopOutput: S.optional(HumanLoopOutput),
  }),
).annotations({
  identifier: "DescribeHumanLoopResponse",
}) as any as S.Schema<DescribeHumanLoopResponse>;
export interface ListHumanLoopsResponse {
  HumanLoopSummaries: HumanLoopSummaries;
  NextToken?: string;
}
export const ListHumanLoopsResponse = S.suspend(() =>
  S.Struct({
    HumanLoopSummaries: HumanLoopSummaries,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListHumanLoopsResponse",
}) as any as S.Schema<ListHumanLoopsResponse>;
export interface StartHumanLoopResponse {
  HumanLoopArn?: string;
}
export const StartHumanLoopResponse = S.suspend(() =>
  S.Struct({ HumanLoopArn: S.optional(S.String) }),
).annotations({
  identifier: "StartHumanLoopResponse",
}) as any as S.Schema<StartHumanLoopResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Deletes the specified human loop for a flow definition.
 *
 * If the human loop was deleted, this operation will return a
 * `ResourceNotFoundException`.
 */
export const deleteHumanLoop: (
  input: DeleteHumanLoopRequest,
) => Effect.Effect<
  DeleteHumanLoopResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHumanLoopRequest,
  output: DeleteHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a human loop, provided that at least one activation condition is met.
 */
export const startHumanLoop: (
  input: StartHumanLoopRequest,
) => Effect.Effect<
  StartHumanLoopResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartHumanLoopRequest,
  output: StartHumanLoopResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the specified human loop. If the human loop was deleted, this
 * operation will return a `ResourceNotFoundException` error.
 */
export const describeHumanLoop: (
  input: DescribeHumanLoopRequest,
) => Effect.Effect<
  DescribeHumanLoopResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHumanLoopRequest,
  output: DescribeHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about human loops, given the specified parameters. If a human loop was deleted, it will not be included.
 */
export const listHumanLoops: {
  (
    input: ListHumanLoopsRequest,
  ): Effect.Effect<
    ListHumanLoopsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHumanLoopsRequest,
  ) => Stream.Stream<
    ListHumanLoopsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHumanLoopsRequest,
  ) => Stream.Stream<
    HumanLoopSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHumanLoopsRequest,
  output: ListHumanLoopsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "HumanLoopSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Stops the specified human loop.
 */
export const stopHumanLoop: (
  input: StopHumanLoopRequest,
) => Effect.Effect<
  StopHumanLoopResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopHumanLoopRequest,
  output: StopHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

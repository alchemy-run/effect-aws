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
  sdkId: "WorkMailMessageFlow",
  serviceShapeName: "GiraffeMessageInTransitService",
});
const auth = T.AwsAuthSigv4({ name: "workmailmessageflow" });
const ver = T.ServiceVersion("2019-05-01");
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
              `https://workmailmessageflow-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://workmailmessageflow-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://workmailmessageflow.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://workmailmessageflow.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MessageIdType = string;
export type S3BucketIdType = string;
export type S3KeyIdType = string;
export type S3VersionType = string;
export type ErrorMessage = string;

//# Schemas
export interface GetRawMessageContentRequest {
  messageId: string;
}
export const GetRawMessageContentRequest = S.suspend(() =>
  S.Struct({ messageId: S.String.pipe(T.HttpLabel("messageId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/messages/{messageId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRawMessageContentRequest",
}) as any as S.Schema<GetRawMessageContentRequest>;
export interface GetRawMessageContentResponse {
  messageContent: T.StreamingOutputBody;
}
export const GetRawMessageContentResponse = S.suspend(() =>
  S.Struct({ messageContent: T.StreamingOutput.pipe(T.HttpPayload()) }),
).annotations({
  identifier: "GetRawMessageContentResponse",
}) as any as S.Schema<GetRawMessageContentResponse>;
export interface S3Reference {
  bucket: string;
  key: string;
  objectVersion?: string;
}
export const S3Reference = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    key: S.String,
    objectVersion: S.optional(S.String),
  }),
).annotations({ identifier: "S3Reference" }) as any as S.Schema<S3Reference>;
export interface RawMessageContent {
  s3Reference: S3Reference;
}
export const RawMessageContent = S.suspend(() =>
  S.Struct({ s3Reference: S3Reference }),
).annotations({
  identifier: "RawMessageContent",
}) as any as S.Schema<RawMessageContent>;
export interface PutRawMessageContentRequest {
  messageId: string;
  content: RawMessageContent;
}
export const PutRawMessageContentRequest = S.suspend(() =>
  S.Struct({
    messageId: S.String.pipe(T.HttpLabel("messageId")),
    content: RawMessageContent,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/messages/{messageId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRawMessageContentRequest",
}) as any as S.Schema<PutRawMessageContentRequest>;
export interface PutRawMessageContentResponse {}
export const PutRawMessageContentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRawMessageContentResponse",
}) as any as S.Schema<PutRawMessageContentResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidContentLocation extends S.TaggedError<InvalidContentLocation>()(
  "InvalidContentLocation",
  { message: S.optional(S.String) },
) {}
export class MessageFrozen extends S.TaggedError<MessageFrozen>()(
  "MessageFrozen",
  { message: S.optional(S.String) },
) {}
export class MessageRejected extends S.TaggedError<MessageRejected>()(
  "MessageRejected",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the raw content of an in-transit email message, in MIME format.
 */
export const getRawMessageContent: (
  input: GetRawMessageContentRequest,
) => effect.Effect<
  GetRawMessageContentResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRawMessageContentRequest,
  output: GetRawMessageContentResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates the raw content of an in-transit email message, in MIME format.
 *
 * This example describes how to update in-transit email message. For more information and examples for using this API, see
 *
 * Updating message content with AWS Lambda.
 *
 * Updates to an in-transit message only appear when you call `PutRawMessageContent` from an AWS Lambda function
 * configured with a synchronous
 * Run Lambda rule. If you call `PutRawMessageContent` on a delivered or sent message, the message remains unchanged,
 * even though GetRawMessageContent returns an updated
 * message.
 */
export const putRawMessageContent: (
  input: PutRawMessageContentRequest,
) => effect.Effect<
  PutRawMessageContentResponse,
  | InvalidContentLocation
  | MessageFrozen
  | MessageRejected
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRawMessageContentRequest,
  output: PutRawMessageContentResponse,
  errors: [
    InvalidContentLocation,
    MessageFrozen,
    MessageRejected,
    ResourceNotFoundException,
  ],
}));

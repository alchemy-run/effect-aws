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
  sdkId: "WorkMailMessageFlow",
  serviceShapeName: "GiraffeMessageInTransitService",
});
const auth = T.AwsAuthSigv4({ name: "workmailmessageflow" });
const ver = T.ServiceVersion("2019-05-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://workmailmessageflow-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://workmailmessageflow-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://workmailmessageflow.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://workmailmessageflow.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Newtypes
export type messageIdType = string;
export type s3BucketIdType = string;
export type s3KeyIdType = string;
export type s3VersionType = string;
export type errorMessage = string;

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
) => Effect.Effect<
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
) => Effect.Effect<
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

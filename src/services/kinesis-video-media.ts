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
  sdkId: "Kinesis Video Media",
  serviceShapeName: "AWSAcuityInletService",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2017-09-30");
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kinesisvideo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kinesisvideo.{Region}.{PartitionResult#dnsSuffix}",
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
export type StreamName = string;
export type ResourceARN = string;
export type FragmentNumberString = string;
export type ContinuationToken = string;
export type ContentType = string;
export type ErrorMessage = string;

//# Schemas
export interface StartSelector {
  StartSelectorType: string;
  AfterFragmentNumber?: string;
  StartTimestamp?: Date;
  ContinuationToken?: string;
}
export const StartSelector = S.suspend(() =>
  S.Struct({
    StartSelectorType: S.String,
    AfterFragmentNumber: S.optional(S.String),
    StartTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ContinuationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "StartSelector",
}) as any as S.Schema<StartSelector>;
export interface GetMediaInput {
  StreamName?: string;
  StreamARN?: string;
  StartSelector: StartSelector;
}
export const GetMediaInput = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String),
    StreamARN: S.optional(S.String),
    StartSelector: StartSelector,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getMedia" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMediaInput",
}) as any as S.Schema<GetMediaInput>;
export interface GetMediaOutput {
  ContentType?: string;
  Payload?: T.StreamingOutputBody;
}
export const GetMediaOutput = S.suspend(() =>
  S.Struct({
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Payload: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "GetMediaOutput",
}) as any as S.Schema<GetMediaOutput>;

//# Errors
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConnectionLimitExceededException extends S.TaggedError<ConnectionLimitExceededException>()(
  "ConnectionLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidEndpointException extends S.TaggedError<InvalidEndpointException>()(
  "InvalidEndpointException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use this API to retrieve media content from a Kinesis video stream. In the request,
 * you identify the stream name or stream Amazon Resource Name (ARN), and the starting chunk.
 * Kinesis Video Streams then returns a stream of chunks in order by fragment number.
 *
 * You must first call the `GetDataEndpoint` API to get an endpoint. Then
 * send the `GetMedia` requests to this endpoint using the --endpoint-url parameter.
 *
 * When you put media data (fragments) on a stream, Kinesis Video Streams stores each
 * incoming fragment and related metadata in what is called a "chunk." For more information, see
 * PutMedia. The `GetMedia` API returns a stream of these chunks starting
 * from the chunk that you specify in the request.
 *
 * The following limits apply when using the `GetMedia` API:
 *
 * - A client can call `GetMedia` up to five times per second per stream.
 *
 * - Kinesis Video Streams sends media data at a rate of up to 25 megabytes per second
 * (or 200 megabits per second) during a `GetMedia` session.
 *
 * If an error is thrown after invoking a Kinesis Video Streams media API, in addition to
 * the HTTP status code and the response body, it includes the following pieces of information:
 *
 * - `x-amz-ErrorType` HTTP header – contains a more specific error type in
 * addition to what the HTTP status code provides.
 *
 * - `x-amz-RequestId` HTTP header – if you want to report an issue to AWS,
 * the support team can better diagnose the problem if given the Request Id.
 *
 * Both the HTTP status code and the ErrorType header can be utilized to make programmatic
 * decisions about whether errors are retry-able and under what conditions, as well as provide
 * information on what actions the client programmer might need to take in order to
 * successfully try again.
 *
 * For more information, see the **Errors** section at the
 * bottom of this topic, as well as Common Errors.
 */
export const getMedia: (
  input: GetMediaInput,
) => Effect.Effect<
  GetMediaOutput,
  | ClientLimitExceededException
  | ConnectionLimitExceededException
  | InvalidArgumentException
  | InvalidEndpointException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMediaInput,
  output: GetMediaOutput,
  errors: [
    ClientLimitExceededException,
    ConnectionLimitExceededException,
    InvalidArgumentException,
    InvalidEndpointException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));

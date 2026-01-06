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
  sdkId: "CloudTrail Data",
  serviceShapeName: "CloudTrailDataService",
});
const auth = T.AwsAuthSigv4({ name: "cloudtrail-data" });
const ver = T.ServiceVersion("2021-08-11");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cloudtrail-data-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cloudtrail-data-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cloudtrail-data.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cloudtrail-data.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Newtypes
export type ChannelArn = string;
export type ExternalId = string;
export type Uuid = string;
export type ErrorCode = string;
export type ErrorMessage = string;

//# Schemas
export interface AuditEvent {
  id: string;
  eventData: string;
  eventDataChecksum?: string;
}
export const AuditEvent = S.suspend(() =>
  S.Struct({
    id: S.String,
    eventData: S.String,
    eventDataChecksum: S.optional(S.String),
  }),
).annotations({ identifier: "AuditEvent" }) as any as S.Schema<AuditEvent>;
export type AuditEvents = AuditEvent[];
export const AuditEvents = S.Array(AuditEvent);
export interface PutAuditEventsRequest {
  auditEvents: AuditEvents;
  channelArn: string;
  externalId?: string;
}
export const PutAuditEventsRequest = S.suspend(() =>
  S.Struct({
    auditEvents: AuditEvents,
    channelArn: S.String.pipe(T.HttpQuery("channelArn")),
    externalId: S.optional(S.String).pipe(T.HttpQuery("externalId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutAuditEvents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAuditEventsRequest",
}) as any as S.Schema<PutAuditEventsRequest>;
export interface AuditEventResultEntry {
  id: string;
  eventID: string;
}
export const AuditEventResultEntry = S.suspend(() =>
  S.Struct({ id: S.String, eventID: S.String }),
).annotations({
  identifier: "AuditEventResultEntry",
}) as any as S.Schema<AuditEventResultEntry>;
export type AuditEventResultEntries = AuditEventResultEntry[];
export const AuditEventResultEntries = S.Array(AuditEventResultEntry);
export interface ResultErrorEntry {
  id: string;
  errorCode: string;
  errorMessage: string;
}
export const ResultErrorEntry = S.suspend(() =>
  S.Struct({ id: S.String, errorCode: S.String, errorMessage: S.String }),
).annotations({
  identifier: "ResultErrorEntry",
}) as any as S.Schema<ResultErrorEntry>;
export type ResultErrorEntries = ResultErrorEntry[];
export const ResultErrorEntries = S.Array(ResultErrorEntry);
export interface PutAuditEventsResponse {
  successful: AuditEventResultEntries;
  failed: ResultErrorEntries;
}
export const PutAuditEventsResponse = S.suspend(() =>
  S.Struct({ successful: AuditEventResultEntries, failed: ResultErrorEntries }),
).annotations({
  identifier: "PutAuditEventsResponse",
}) as any as S.Schema<PutAuditEventsResponse>;

//# Errors
export class ChannelInsufficientPermission extends S.TaggedError<ChannelInsufficientPermission>()(
  "ChannelInsufficientPermission",
  { message: S.optional(S.String) },
) {}
export class ChannelNotFound extends S.TaggedError<ChannelNotFound>()(
  "ChannelNotFound",
  { message: S.optional(S.String) },
) {}
export class ChannelUnsupportedSchema extends S.TaggedError<ChannelUnsupportedSchema>()(
  "ChannelUnsupportedSchema",
  { message: S.optional(S.String) },
) {}
export class DuplicatedAuditEventId extends S.TaggedError<DuplicatedAuditEventId>()(
  "DuplicatedAuditEventId",
  { message: S.optional(S.String) },
) {}
export class InvalidChannelARN extends S.TaggedError<InvalidChannelARN>()(
  "InvalidChannelARN",
  { message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Ingests your application events into CloudTrail Lake. A required parameter,
 * `auditEvents`, accepts the JSON records (also called
 * *payload*) of events that you want CloudTrail to ingest. You
 * can add up to 100 of these events (or up to 1 MB) per `PutAuditEvents`
 * request.
 */
export const putAuditEvents: (
  input: PutAuditEventsRequest,
) => Effect.Effect<
  PutAuditEventsResponse,
  | ChannelInsufficientPermission
  | ChannelNotFound
  | ChannelUnsupportedSchema
  | DuplicatedAuditEventId
  | InvalidChannelARN
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAuditEventsRequest,
  output: PutAuditEventsResponse,
  errors: [
    ChannelInsufficientPermission,
    ChannelNotFound,
    ChannelUnsupportedSchema,
    DuplicatedAuditEventId,
    InvalidChannelARN,
    UnsupportedOperationException,
  ],
}));

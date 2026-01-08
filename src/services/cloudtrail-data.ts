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
              `https://cloudtrail-data-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cloudtrail-data-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloudtrail-data.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloudtrail-data.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
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

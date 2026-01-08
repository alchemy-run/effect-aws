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
  sdkId: "SageMaker FeatureStore Runtime",
  serviceShapeName: "AmazonSageMakerFeatureStoreRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2020-07-01");
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
              `https://featurestore-runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://featurestore-runtime.sagemaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://featurestore-runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://featurestore-runtime.sagemaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type FeatureGroupNameOrArn = string;
export type ValueAsString = string;
export type FeatureName = string;
export type TtlDurationValue = number;
export type Message = string;
export type ExpiresAt = string;

//# Schemas
export type ExpirationTimeResponse = "Enabled" | "Disabled";
export const ExpirationTimeResponse = S.Literal("Enabled", "Disabled");
export type TargetStore = "OnlineStore" | "OfflineStore";
export const TargetStore = S.Literal("OnlineStore", "OfflineStore");
export type TargetStores = TargetStore[];
export const TargetStores = S.Array(TargetStore);
export type DeletionMode = "SoftDelete" | "HardDelete";
export const DeletionMode = S.Literal("SoftDelete", "HardDelete");
export type FeatureNames = string[];
export const FeatureNames = S.Array(S.String);
export interface DeleteRecordRequest {
  FeatureGroupName: string;
  RecordIdentifierValueAsString?: string;
  EventTime?: string;
  TargetStores?: TargetStore[];
  DeletionMode?: DeletionMode;
}
export const DeleteRecordRequest = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    RecordIdentifierValueAsString: S.optional(S.String).pipe(
      T.HttpQuery("RecordIdentifierValueAsString"),
    ),
    EventTime: S.optional(S.String).pipe(T.HttpQuery("EventTime")),
    TargetStores: S.optional(TargetStores).pipe(T.HttpQuery("TargetStores")),
    DeletionMode: S.optional(DeletionMode).pipe(T.HttpQuery("DeletionMode")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/FeatureGroup/{FeatureGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecordRequest",
}) as any as S.Schema<DeleteRecordRequest>;
export interface DeleteRecordResponse {}
export const DeleteRecordResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRecordResponse",
}) as any as S.Schema<DeleteRecordResponse>;
export interface GetRecordRequest {
  FeatureGroupName: string;
  RecordIdentifierValueAsString?: string;
  FeatureNames?: string[];
  ExpirationTimeResponse?: ExpirationTimeResponse;
}
export const GetRecordRequest = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    RecordIdentifierValueAsString: S.optional(S.String).pipe(
      T.HttpQuery("RecordIdentifierValueAsString"),
    ),
    FeatureNames: S.optional(FeatureNames).pipe(T.HttpQuery("FeatureName")),
    ExpirationTimeResponse: S.optional(ExpirationTimeResponse).pipe(
      T.HttpQuery("ExpirationTimeResponse"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/FeatureGroup/{FeatureGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecordRequest",
}) as any as S.Schema<GetRecordRequest>;
export type RecordIdentifiers = string[];
export const RecordIdentifiers = S.Array(S.String);
export type ValueAsStringList = string[];
export const ValueAsStringList = S.Array(S.String);
export type TtlDurationUnit =
  | "Seconds"
  | "Minutes"
  | "Hours"
  | "Days"
  | "Weeks";
export const TtlDurationUnit = S.Literal(
  "Seconds",
  "Minutes",
  "Hours",
  "Days",
  "Weeks",
);
export interface BatchGetRecordIdentifier {
  FeatureGroupName?: string;
  RecordIdentifiersValueAsString?: string[];
  FeatureNames?: string[];
}
export const BatchGetRecordIdentifier = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.optional(S.String),
    RecordIdentifiersValueAsString: S.optional(RecordIdentifiers),
    FeatureNames: S.optional(FeatureNames),
  }),
).annotations({
  identifier: "BatchGetRecordIdentifier",
}) as any as S.Schema<BatchGetRecordIdentifier>;
export type BatchGetRecordIdentifiers = BatchGetRecordIdentifier[];
export const BatchGetRecordIdentifiers = S.Array(BatchGetRecordIdentifier);
export interface FeatureValue {
  FeatureName?: string;
  ValueAsString?: string;
  ValueAsStringList?: string[];
}
export const FeatureValue = S.suspend(() =>
  S.Struct({
    FeatureName: S.optional(S.String),
    ValueAsString: S.optional(S.String),
    ValueAsStringList: S.optional(ValueAsStringList),
  }),
).annotations({ identifier: "FeatureValue" }) as any as S.Schema<FeatureValue>;
export type Record = FeatureValue[];
export const Record = S.Array(FeatureValue);
export interface TtlDuration {
  Unit?: TtlDurationUnit;
  Value?: number;
}
export const TtlDuration = S.suspend(() =>
  S.Struct({ Unit: S.optional(TtlDurationUnit), Value: S.optional(S.Number) }),
).annotations({ identifier: "TtlDuration" }) as any as S.Schema<TtlDuration>;
export interface BatchGetRecordRequest {
  Identifiers?: BatchGetRecordIdentifier[];
  ExpirationTimeResponse?: ExpirationTimeResponse;
}
export const BatchGetRecordRequest = S.suspend(() =>
  S.Struct({
    Identifiers: S.optional(BatchGetRecordIdentifiers),
    ExpirationTimeResponse: S.optional(ExpirationTimeResponse),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetRecord" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRecordRequest",
}) as any as S.Schema<BatchGetRecordRequest>;
export interface GetRecordResponse {
  Record?: (FeatureValue & { FeatureName: FeatureName })[];
  ExpiresAt?: string;
}
export const GetRecordResponse = S.suspend(() =>
  S.Struct({ Record: S.optional(Record), ExpiresAt: S.optional(S.String) }),
).annotations({
  identifier: "GetRecordResponse",
}) as any as S.Schema<GetRecordResponse>;
export interface PutRecordRequest {
  FeatureGroupName: string;
  Record?: FeatureValue[];
  TargetStores?: TargetStore[];
  TtlDuration?: TtlDuration;
}
export const PutRecordRequest = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    Record: S.optional(Record),
    TargetStores: S.optional(TargetStores),
    TtlDuration: S.optional(TtlDuration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/FeatureGroup/{FeatureGroupName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRecordRequest",
}) as any as S.Schema<PutRecordRequest>;
export interface PutRecordResponse {}
export const PutRecordResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutRecordResponse",
}) as any as S.Schema<PutRecordResponse>;
export type UnprocessedIdentifiers = BatchGetRecordIdentifier[];
export const UnprocessedIdentifiers = S.Array(BatchGetRecordIdentifier);
export interface BatchGetRecordResultDetail {
  FeatureGroupName?: string;
  RecordIdentifierValueAsString?: string;
  Record?: FeatureValue[];
  ExpiresAt?: string;
}
export const BatchGetRecordResultDetail = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.optional(S.String),
    RecordIdentifierValueAsString: S.optional(S.String),
    Record: S.optional(Record),
    ExpiresAt: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetRecordResultDetail",
}) as any as S.Schema<BatchGetRecordResultDetail>;
export type BatchGetRecordResultDetails = BatchGetRecordResultDetail[];
export const BatchGetRecordResultDetails = S.Array(BatchGetRecordResultDetail);
export interface BatchGetRecordError {
  FeatureGroupName?: string;
  RecordIdentifierValueAsString?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const BatchGetRecordError = S.suspend(() =>
  S.Struct({
    FeatureGroupName: S.optional(S.String),
    RecordIdentifierValueAsString: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetRecordError",
}) as any as S.Schema<BatchGetRecordError>;
export type BatchGetRecordErrors = BatchGetRecordError[];
export const BatchGetRecordErrors = S.Array(BatchGetRecordError);
export interface BatchGetRecordResponse {
  Records: (BatchGetRecordResultDetail & {
    FeatureGroupName: ValueAsString;
    RecordIdentifierValueAsString: ValueAsString;
    Record: (FeatureValue & { FeatureName: FeatureName })[];
  })[];
  Errors: (BatchGetRecordError & {
    FeatureGroupName: ValueAsString;
    RecordIdentifierValueAsString: ValueAsString;
    ErrorCode: ValueAsString;
    ErrorMessage: Message;
  })[];
  UnprocessedIdentifiers: (BatchGetRecordIdentifier & {
    FeatureGroupName: FeatureGroupNameOrArn;
    RecordIdentifiersValueAsString: RecordIdentifiers;
  })[];
}
export const BatchGetRecordResponse = S.suspend(() =>
  S.Struct({
    Records: S.optional(BatchGetRecordResultDetails),
    Errors: S.optional(BatchGetRecordErrors),
    UnprocessedIdentifiers: S.optional(UnprocessedIdentifiers),
  }),
).annotations({
  identifier: "BatchGetRecordResponse",
}) as any as S.Schema<BatchGetRecordResponse>;

//# Errors
export class AccessForbidden extends S.TaggedError<AccessForbidden>()(
  "AccessForbidden",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a `Record` from a `FeatureGroup` in the
 * `OnlineStore`. Feature Store supports both `SoftDelete` and
 * `HardDelete`. For `SoftDelete` (default), feature columns are set
 * to `null` and the record is no longer retrievable by `GetRecord` or
 * `BatchGetRecord`. For `HardDelete`, the complete
 * `Record` is removed from the `OnlineStore`. In both cases, Feature
 * Store appends the deleted record marker to the `OfflineStore`. The deleted
 * record marker is a record with the same `RecordIdentifer` as the original, but
 * with `is_deleted` value set to `True`, `EventTime` set to
 * the delete input `EventTime`, and other feature values set to
 * `null`.
 *
 * Note that the `EventTime` specified in `DeleteRecord` should be
 * set later than the `EventTime` of the existing record in the
 * `OnlineStore` for that `RecordIdentifer`. If it is not, the
 * deletion does not occur:
 *
 * - For `SoftDelete`, the existing (not deleted) record remains in the
 * `OnlineStore`, though the delete record marker is still written to the
 * `OfflineStore`.
 *
 * - `HardDelete` returns `EventTime`: 400
 * ValidationException to indicate that the delete operation failed. No delete
 * record marker is written to the `OfflineStore`.
 *
 * When a record is deleted from the `OnlineStore`, the deleted record marker is
 * appended to the `OfflineStore`. If you have the Iceberg table format enabled for
 * your `OfflineStore`, you can remove all history of a record from the
 * `OfflineStore` using Amazon Athena or Apache Spark. For information on how to
 * hard delete a record from the `OfflineStore` with the Iceberg table format
 * enabled, see Delete records from the offline store.
 */
export const deleteRecord: (
  input: DeleteRecordRequest,
) => effect.Effect<
  DeleteRecordResponse,
  | AccessForbidden
  | InternalFailure
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecordRequest,
  output: DeleteRecordResponse,
  errors: [
    AccessForbidden,
    InternalFailure,
    ServiceUnavailable,
    ValidationError,
  ],
}));
/**
 * Use for `OnlineStore` serving from a `FeatureStore`. Only the
 * latest records stored in the `OnlineStore` can be retrieved. If no Record with
 * `RecordIdentifierValue` is found, then an empty result is returned.
 */
export const getRecord: (
  input: GetRecordRequest,
) => effect.Effect<
  GetRecordResponse,
  | AccessForbidden
  | InternalFailure
  | ResourceNotFound
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecordRequest,
  output: GetRecordResponse,
  errors: [
    AccessForbidden,
    InternalFailure,
    ResourceNotFound,
    ServiceUnavailable,
    ValidationError,
  ],
}));
/**
 * The `PutRecord` API is used to ingest a list of `Records` into
 * your feature group.
 *
 * If a new record’s `EventTime` is greater, the new record is written to both
 * the `OnlineStore` and `OfflineStore`. Otherwise, the record is a
 * historic record and it is written only to the `OfflineStore`.
 *
 * You can specify the ingestion to be applied to the `OnlineStore`,
 * `OfflineStore`, or both by using the `TargetStores` request
 * parameter.
 *
 * You can set the ingested record to expire at a given time to live (TTL) duration after
 * the record’s event time, `ExpiresAt` = `EventTime` +
 * `TtlDuration`, by specifying the `TtlDuration` parameter. A record
 * level `TtlDuration` is set when specifying the `TtlDuration`
 * parameter using the `PutRecord` API call. If the input `TtlDuration`
 * is `null` or unspecified, `TtlDuration` is set to the default feature
 * group level `TtlDuration`. A record level `TtlDuration` supersedes
 * the group level `TtlDuration`.
 */
export const putRecord: (
  input: PutRecordRequest,
) => effect.Effect<
  PutRecordResponse,
  | AccessForbidden
  | InternalFailure
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordRequest,
  output: PutRecordResponse,
  errors: [
    AccessForbidden,
    InternalFailure,
    ServiceUnavailable,
    ValidationError,
  ],
}));
/**
 * Retrieves a batch of `Records` from a `FeatureGroup`.
 */
export const batchGetRecord: (
  input: BatchGetRecordRequest,
) => effect.Effect<
  BatchGetRecordResponse,
  | AccessForbidden
  | InternalFailure
  | ServiceUnavailable
  | ValidationError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRecordRequest,
  output: BatchGetRecordResponse,
  errors: [
    AccessForbidden,
    InternalFailure,
    ServiceUnavailable,
    ValidationError,
  ],
}));

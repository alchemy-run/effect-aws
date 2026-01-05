import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker FeatureStore Runtime",
  serviceShapeName: "AmazonSageMakerFeatureStoreRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2020-07-01");
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
                        url: "https://featurestore-runtime.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://featurestore-runtime.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://featurestore-runtime.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://featurestore-runtime.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export const TargetStores = S.Array(S.String);
export const FeatureNames = S.Array(S.String);
export class DeleteRecordRequest extends S.Class<DeleteRecordRequest>(
  "DeleteRecordRequest",
)(
  {
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    RecordIdentifierValueAsString: S.String.pipe(
      T.HttpQuery("RecordIdentifierValueAsString"),
    ),
    EventTime: S.String.pipe(T.HttpQuery("EventTime")),
    TargetStores: S.optional(TargetStores).pipe(T.HttpQuery("TargetStores")),
    DeletionMode: S.optional(S.String).pipe(T.HttpQuery("DeletionMode")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/FeatureGroup/{FeatureGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecordResponse extends S.Class<DeleteRecordResponse>(
  "DeleteRecordResponse",
)({}) {}
export class GetRecordRequest extends S.Class<GetRecordRequest>(
  "GetRecordRequest",
)(
  {
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    RecordIdentifierValueAsString: S.String.pipe(
      T.HttpQuery("RecordIdentifierValueAsString"),
    ),
    FeatureNames: S.optional(FeatureNames).pipe(T.HttpQuery("FeatureName")),
    ExpirationTimeResponse: S.optional(S.String).pipe(
      T.HttpQuery("ExpirationTimeResponse"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/FeatureGroup/{FeatureGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RecordIdentifiers = S.Array(S.String);
export const ValueAsStringList = S.Array(S.String);
export class BatchGetRecordIdentifier extends S.Class<BatchGetRecordIdentifier>(
  "BatchGetRecordIdentifier",
)({
  FeatureGroupName: S.String,
  RecordIdentifiersValueAsString: RecordIdentifiers,
  FeatureNames: S.optional(FeatureNames),
}) {}
export const BatchGetRecordIdentifiers = S.Array(BatchGetRecordIdentifier);
export class FeatureValue extends S.Class<FeatureValue>("FeatureValue")({
  FeatureName: S.String,
  ValueAsString: S.optional(S.String),
  ValueAsStringList: S.optional(ValueAsStringList),
}) {}
export const Record = S.Array(FeatureValue);
export class TtlDuration extends S.Class<TtlDuration>("TtlDuration")({
  Unit: S.String,
  Value: S.Number,
}) {}
export class BatchGetRecordRequest extends S.Class<BatchGetRecordRequest>(
  "BatchGetRecordRequest",
)(
  {
    Identifiers: BatchGetRecordIdentifiers,
    ExpirationTimeResponse: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/BatchGetRecord" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecordResponse extends S.Class<GetRecordResponse>(
  "GetRecordResponse",
)({ Record: S.optional(Record), ExpiresAt: S.optional(S.String) }) {}
export class PutRecordRequest extends S.Class<PutRecordRequest>(
  "PutRecordRequest",
)(
  {
    FeatureGroupName: S.String.pipe(T.HttpLabel("FeatureGroupName")),
    Record: Record,
    TargetStores: S.optional(TargetStores),
    TtlDuration: S.optional(TtlDuration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/FeatureGroup/{FeatureGroupName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRecordResponse extends S.Class<PutRecordResponse>(
  "PutRecordResponse",
)({}) {}
export const UnprocessedIdentifiers = S.Array(BatchGetRecordIdentifier);
export class BatchGetRecordResultDetail extends S.Class<BatchGetRecordResultDetail>(
  "BatchGetRecordResultDetail",
)({
  FeatureGroupName: S.String,
  RecordIdentifierValueAsString: S.String,
  Record: Record,
  ExpiresAt: S.optional(S.String),
}) {}
export const BatchGetRecordResultDetails = S.Array(BatchGetRecordResultDetail);
export class BatchGetRecordError extends S.Class<BatchGetRecordError>(
  "BatchGetRecordError",
)({
  FeatureGroupName: S.String,
  RecordIdentifierValueAsString: S.String,
  ErrorCode: S.String,
  ErrorMessage: S.String,
}) {}
export const BatchGetRecordErrors = S.Array(BatchGetRecordError);
export class BatchGetRecordResponse extends S.Class<BatchGetRecordResponse>(
  "BatchGetRecordResponse",
)({
  Records: BatchGetRecordResultDetails,
  Errors: BatchGetRecordErrors,
  UnprocessedIdentifiers: UnprocessedIdentifiers,
}) {}

//# Errors
export class AccessForbidden extends S.TaggedError<AccessForbidden>()(
  "AccessForbidden",
  { Message: S.optional(S.String) },
) {}
export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  { Message: S.optional(S.String) },
) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  { Message: S.optional(S.String) },
) {}

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
export const deleteRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRecordRequest,
  output: BatchGetRecordResponse,
  errors: [
    AccessForbidden,
    InternalFailure,
    ServiceUnavailable,
    ValidationError,
  ],
}));

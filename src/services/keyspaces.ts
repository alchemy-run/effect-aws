import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Keyspaces",
  serviceShapeName: "KeyspacesService",
});
const auth = T.AwsAuthSigv4({ name: "cassandra" });
const ver = T.ServiceVersion("2022-02-10");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://cassandra-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://cassandra.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cassandra-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cassandra.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cassandra.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteKeyspaceRequest extends S.Class<DeleteKeyspaceRequest>(
  "DeleteKeyspaceRequest",
)(
  { keyspaceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteKeyspaceResponse extends S.Class<DeleteKeyspaceResponse>(
  "DeleteKeyspaceResponse",
)({}) {}
export class DeleteTableRequest extends S.Class<DeleteTableRequest>(
  "DeleteTableRequest",
)(
  { keyspaceName: S.String, tableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableResponse extends S.Class<DeleteTableResponse>(
  "DeleteTableResponse",
)({}) {}
export class DeleteTypeRequest extends S.Class<DeleteTypeRequest>(
  "DeleteTypeRequest",
)(
  { keyspaceName: S.String, typeName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetKeyspaceRequest extends S.Class<GetKeyspaceRequest>(
  "GetKeyspaceRequest",
)(
  { keyspaceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableRequest extends S.Class<GetTableRequest>(
  "GetTableRequest",
)(
  { keyspaceName: S.String, tableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableAutoScalingSettingsRequest extends S.Class<GetTableAutoScalingSettingsRequest>(
  "GetTableAutoScalingSettingsRequest",
)(
  { keyspaceName: S.String, tableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTypeRequest extends S.Class<GetTypeRequest>("GetTypeRequest")(
  { keyspaceName: S.String, typeName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListKeyspacesRequest extends S.Class<ListKeyspacesRequest>(
  "ListKeyspacesRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTablesRequest extends S.Class<ListTablesRequest>(
  "ListTablesRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    keyspaceName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    resourceArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTypesRequest extends S.Class<ListTypesRequest>(
  "ListTypesRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    keyspaceName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CapacitySpecification extends S.Class<CapacitySpecification>(
  "CapacitySpecification",
)({
  throughputMode: S.String,
  readCapacityUnits: S.optional(S.Number),
  writeCapacityUnits: S.optional(S.Number),
}) {}
export class EncryptionSpecification extends S.Class<EncryptionSpecification>(
  "EncryptionSpecification",
)({ type: S.String, kmsKeyIdentifier: S.optional(S.String) }) {}
export class PointInTimeRecovery extends S.Class<PointInTimeRecovery>(
  "PointInTimeRecovery",
)({ status: S.String }) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TargetTrackingScalingPolicyConfiguration extends S.Class<TargetTrackingScalingPolicyConfiguration>(
  "TargetTrackingScalingPolicyConfiguration",
)({
  disableScaleIn: S.optional(S.Boolean),
  scaleInCooldown: S.optional(S.Number),
  scaleOutCooldown: S.optional(S.Number),
  targetValue: S.Number,
}) {}
export class AutoScalingPolicy extends S.Class<AutoScalingPolicy>(
  "AutoScalingPolicy",
)({
  targetTrackingScalingPolicyConfiguration: S.optional(
    TargetTrackingScalingPolicyConfiguration,
  ),
}) {}
export class AutoScalingSettings extends S.Class<AutoScalingSettings>(
  "AutoScalingSettings",
)({
  autoScalingDisabled: S.optional(S.Boolean),
  minimumUnits: S.optional(S.Number),
  maximumUnits: S.optional(S.Number),
  scalingPolicy: S.optional(AutoScalingPolicy),
}) {}
export class AutoScalingSpecification extends S.Class<AutoScalingSpecification>(
  "AutoScalingSpecification",
)({
  writeCapacityAutoScaling: S.optional(AutoScalingSettings),
  readCapacityAutoScaling: S.optional(AutoScalingSettings),
}) {}
export class ReplicaSpecification extends S.Class<ReplicaSpecification>(
  "ReplicaSpecification",
)({
  region: S.String,
  readCapacityUnits: S.optional(S.Number),
  readCapacityAutoScaling: S.optional(AutoScalingSettings),
}) {}
export const ReplicaSpecificationList = S.Array(ReplicaSpecification);
export class RestoreTableRequest extends S.Class<RestoreTableRequest>(
  "RestoreTableRequest",
)(
  {
    sourceKeyspaceName: S.String,
    sourceTableName: S.String,
    targetKeyspaceName: S.String,
    targetTableName: S.String,
    restoreTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    capacitySpecificationOverride: S.optional(CapacitySpecification),
    encryptionSpecificationOverride: S.optional(EncryptionSpecification),
    pointInTimeRecoveryOverride: S.optional(PointInTimeRecovery),
    tagsOverride: S.optional(TagList),
    autoScalingSpecification: S.optional(AutoScalingSpecification),
    replicaSpecifications: S.optional(ReplicaSpecificationList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const RegionList = S.Array(S.String);
export class ReplicationSpecification extends S.Class<ReplicationSpecification>(
  "ReplicationSpecification",
)({ replicationStrategy: S.String, regionList: S.optional(RegionList) }) {}
export class ClientSideTimestamps extends S.Class<ClientSideTimestamps>(
  "ClientSideTimestamps",
)({ status: S.String }) {}
export class UpdateKeyspaceRequest extends S.Class<UpdateKeyspaceRequest>(
  "UpdateKeyspaceRequest",
)(
  {
    keyspaceName: S.String,
    replicationSpecification: ReplicationSpecification,
    clientSideTimestamps: S.optional(ClientSideTimestamps),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Comment extends S.Class<Comment>("Comment")({
  message: S.String,
}) {}
export class TimeToLive extends S.Class<TimeToLive>("TimeToLive")({
  status: S.String,
}) {}
export class CdcSpecification extends S.Class<CdcSpecification>(
  "CdcSpecification",
)({
  status: S.String,
  viewType: S.optional(S.String),
  tags: S.optional(TagList),
  propagateTags: S.optional(S.String),
}) {}
export class FieldDefinition extends S.Class<FieldDefinition>(
  "FieldDefinition",
)({ name: S.String, type: S.String }) {}
export const FieldList = S.Array(FieldDefinition);
export const TableNameList = S.Array(S.String);
export const TypeNameList = S.Array(S.String);
export class ColumnDefinition extends S.Class<ColumnDefinition>(
  "ColumnDefinition",
)({ name: S.String, type: S.String }) {}
export const ColumnDefinitionList = S.Array(ColumnDefinition);
export class CreateKeyspaceRequest extends S.Class<CreateKeyspaceRequest>(
  "CreateKeyspaceRequest",
)(
  {
    keyspaceName: S.String,
    tags: S.optional(TagList),
    replicationSpecification: S.optional(ReplicationSpecification),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTypeRequest extends S.Class<CreateTypeRequest>(
  "CreateTypeRequest",
)(
  { keyspaceName: S.String, typeName: S.String, fieldDefinitions: FieldList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTypeResponse extends S.Class<DeleteTypeResponse>(
  "DeleteTypeResponse",
)({ keyspaceArn: S.String, typeName: S.String }) {}
export class GetTypeResponse extends S.Class<GetTypeResponse>(
  "GetTypeResponse",
)({
  keyspaceName: S.String,
  typeName: S.String,
  fieldDefinitions: S.optional(FieldList),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  directReferringTables: S.optional(TableNameList),
  directParentTypes: S.optional(TypeNameList),
  maxNestingDepth: S.optional(S.Number),
  keyspaceArn: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ nextToken: S.optional(S.String), tags: S.optional(TagList) }) {}
export class ListTypesResponse extends S.Class<ListTypesResponse>(
  "ListTypesResponse",
)({ nextToken: S.optional(S.String), types: TypeNameList }) {}
export class RestoreTableResponse extends S.Class<RestoreTableResponse>(
  "RestoreTableResponse",
)({ restoredTableARN: S.String }) {}
export class UpdateKeyspaceResponse extends S.Class<UpdateKeyspaceResponse>(
  "UpdateKeyspaceResponse",
)({ resourceArn: S.String }) {}
export class UpdateTableRequest extends S.Class<UpdateTableRequest>(
  "UpdateTableRequest",
)(
  {
    keyspaceName: S.String,
    tableName: S.String,
    addColumns: S.optional(ColumnDefinitionList),
    capacitySpecification: S.optional(CapacitySpecification),
    encryptionSpecification: S.optional(EncryptionSpecification),
    pointInTimeRecovery: S.optional(PointInTimeRecovery),
    ttl: S.optional(TimeToLive),
    defaultTimeToLive: S.optional(S.Number),
    clientSideTimestamps: S.optional(ClientSideTimestamps),
    autoScalingSpecification: S.optional(AutoScalingSpecification),
    replicaSpecifications: S.optional(ReplicaSpecificationList),
    cdcSpecification: S.optional(CdcSpecification),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PartitionKey extends S.Class<PartitionKey>("PartitionKey")({
  name: S.String,
}) {}
export const PartitionKeyList = S.Array(PartitionKey);
export class ClusteringKey extends S.Class<ClusteringKey>("ClusteringKey")({
  name: S.String,
  orderBy: S.String,
}) {}
export const ClusteringKeyList = S.Array(ClusteringKey);
export class StaticColumn extends S.Class<StaticColumn>("StaticColumn")({
  name: S.String,
}) {}
export const StaticColumnList = S.Array(StaticColumn);
export class SchemaDefinition extends S.Class<SchemaDefinition>(
  "SchemaDefinition",
)({
  allColumns: ColumnDefinitionList,
  partitionKeys: PartitionKeyList,
  clusteringKeys: S.optional(ClusteringKeyList),
  staticColumns: S.optional(StaticColumnList),
}) {}
export class ReplicationGroupStatus extends S.Class<ReplicationGroupStatus>(
  "ReplicationGroupStatus",
)({
  region: S.String,
  keyspaceStatus: S.String,
  tablesReplicationProgress: S.optional(S.String),
}) {}
export const ReplicationGroupStatusList = S.Array(ReplicationGroupStatus);
export class CapacitySpecificationSummary extends S.Class<CapacitySpecificationSummary>(
  "CapacitySpecificationSummary",
)({
  throughputMode: S.String,
  readCapacityUnits: S.optional(S.Number),
  writeCapacityUnits: S.optional(S.Number),
  lastUpdateToPayPerRequestTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class PointInTimeRecoverySummary extends S.Class<PointInTimeRecoverySummary>(
  "PointInTimeRecoverySummary",
)({
  status: S.String,
  earliestRestorableTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ReplicaSpecificationSummary extends S.Class<ReplicaSpecificationSummary>(
  "ReplicaSpecificationSummary",
)({
  region: S.optional(S.String),
  status: S.optional(S.String),
  capacitySpecification: S.optional(CapacitySpecificationSummary),
}) {}
export const ReplicaSpecificationSummaryList = S.Array(
  ReplicaSpecificationSummary,
);
export class CdcSpecificationSummary extends S.Class<CdcSpecificationSummary>(
  "CdcSpecificationSummary",
)({ status: S.String, viewType: S.optional(S.String) }) {}
export class ReplicaAutoScalingSpecification extends S.Class<ReplicaAutoScalingSpecification>(
  "ReplicaAutoScalingSpecification",
)({
  region: S.optional(S.String),
  autoScalingSpecification: S.optional(AutoScalingSpecification),
}) {}
export const ReplicaAutoScalingSpecificationList = S.Array(
  ReplicaAutoScalingSpecification,
);
export class KeyspaceSummary extends S.Class<KeyspaceSummary>(
  "KeyspaceSummary",
)({
  keyspaceName: S.String,
  resourceArn: S.String,
  replicationStrategy: S.String,
  replicationRegions: S.optional(RegionList),
}) {}
export const KeyspaceSummaryList = S.Array(KeyspaceSummary);
export class TableSummary extends S.Class<TableSummary>("TableSummary")({
  keyspaceName: S.String,
  tableName: S.String,
  resourceArn: S.String,
}) {}
export const TableSummaryList = S.Array(TableSummary);
export class CreateKeyspaceResponse extends S.Class<CreateKeyspaceResponse>(
  "CreateKeyspaceResponse",
)({ resourceArn: S.String }) {}
export class CreateTypeResponse extends S.Class<CreateTypeResponse>(
  "CreateTypeResponse",
)({ keyspaceArn: S.String, typeName: S.String }) {}
export class GetKeyspaceResponse extends S.Class<GetKeyspaceResponse>(
  "GetKeyspaceResponse",
)({
  keyspaceName: S.String,
  resourceArn: S.String,
  replicationStrategy: S.String,
  replicationRegions: S.optional(RegionList),
  replicationGroupStatuses: S.optional(ReplicationGroupStatusList),
}) {}
export class GetTableResponse extends S.Class<GetTableResponse>(
  "GetTableResponse",
)({
  keyspaceName: S.String,
  tableName: S.String,
  resourceArn: S.String,
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  schemaDefinition: S.optional(SchemaDefinition),
  capacitySpecification: S.optional(CapacitySpecificationSummary),
  encryptionSpecification: S.optional(EncryptionSpecification),
  pointInTimeRecovery: S.optional(PointInTimeRecoverySummary),
  ttl: S.optional(TimeToLive),
  defaultTimeToLive: S.optional(S.Number),
  comment: S.optional(Comment),
  clientSideTimestamps: S.optional(ClientSideTimestamps),
  replicaSpecifications: S.optional(ReplicaSpecificationSummaryList),
  latestStreamArn: S.optional(S.String),
  cdcSpecification: S.optional(CdcSpecificationSummary),
}) {}
export class GetTableAutoScalingSettingsResponse extends S.Class<GetTableAutoScalingSettingsResponse>(
  "GetTableAutoScalingSettingsResponse",
)({
  keyspaceName: S.String,
  tableName: S.String,
  resourceArn: S.String,
  autoScalingSpecification: S.optional(AutoScalingSpecification),
  replicaSpecifications: S.optional(ReplicaAutoScalingSpecificationList),
}) {}
export class ListKeyspacesResponse extends S.Class<ListKeyspacesResponse>(
  "ListKeyspacesResponse",
)({ nextToken: S.optional(S.String), keyspaces: KeyspaceSummaryList }) {}
export class ListTablesResponse extends S.Class<ListTablesResponse>(
  "ListTablesResponse",
)({ nextToken: S.optional(S.String), tables: S.optional(TableSummaryList) }) {}
export class UpdateTableResponse extends S.Class<UpdateTableResponse>(
  "UpdateTableResponse",
)({ resourceArn: S.String }) {}
export class CreateTableRequest extends S.Class<CreateTableRequest>(
  "CreateTableRequest",
)(
  {
    keyspaceName: S.String,
    tableName: S.String,
    schemaDefinition: SchemaDefinition,
    comment: S.optional(Comment),
    capacitySpecification: S.optional(CapacitySpecification),
    encryptionSpecification: S.optional(EncryptionSpecification),
    pointInTimeRecovery: S.optional(PointInTimeRecovery),
    ttl: S.optional(TimeToLive),
    defaultTimeToLive: S.optional(S.Number),
    tags: S.optional(TagList),
    clientSideTimestamps: S.optional(ClientSideTimestamps),
    autoScalingSpecification: S.optional(AutoScalingSpecification),
    replicaSpecifications: S.optional(ReplicaSpecificationList),
    cdcSpecification: S.optional(CdcSpecification),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTableResponse extends S.Class<CreateTableResponse>(
  "CreateTableResponse",
)({ resourceArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceArn: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceQuotaExceededException",
    httpResponseCode: 402,
  }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * The `CreateKeyspace` operation adds a new keyspace to your account. In an Amazon Web Services account, keyspace names must be unique within each Region.
 *
 * `CreateKeyspace` is an asynchronous operation. You can monitor the creation status of the new keyspace by using the `GetKeyspace` operation.
 *
 * For more information, see Create a keyspace in the *Amazon Keyspaces Developer Guide*.
 */
export const createKeyspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyspaceRequest,
  output: CreateKeyspaceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * The `ListKeyspaces` operation returns a list of keyspaces.
 */
export const listKeyspaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKeyspacesRequest,
    output: ListKeyspacesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "keyspaces",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * The `ListTables` operation returns a list of tables for a specified keyspace.
 *
 * To read keyspace metadata using `ListTables`, the IAM principal needs `Select` action permissions for the system keyspace.
 */
export const listTables = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tables",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds new columns to the table or updates one of the table's settings, for example capacity mode, auto scaling, encryption, point-in-time recovery, or ttl settings. Note that you can only update one specific table setting per update operation.
 */
export const updateTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableRequest,
  output: UpdateTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * The `DeleteType` operation deletes a user-defined type (UDT). You can only delete a type that is not used in a table or another UDT.
 *
 * To configure the required permissions, see Permissions to delete a UDT in the *Amazon Keyspaces Developer Guide*.
 */
export const deleteType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTypeRequest,
  output: DeleteTypeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Restores the table to the specified point in time within the `earliest_restorable_timestamp` and the current time. For more information about restore points, see Time window for PITR continuous backups in the *Amazon Keyspaces Developer Guide*.
 *
 * Any number of users can execute up to 4 concurrent restores (any type of restore) in a given account.
 *
 * When you restore using point in time recovery, Amazon Keyspaces restores your source table's schema and data to the state based on the selected timestamp `(day:hour:minute:second)` to a new table. The Time to Live (TTL) settings are also restored to the state based on the selected timestamp.
 *
 * In addition to the table's schema, data, and TTL settings, `RestoreTable` restores the capacity mode, auto scaling settings, encryption settings, and point-in-time recovery settings from the source table. Unlike the table's schema data and TTL settings, which are restored based on the selected timestamp, these settings are always restored based on the table's settings as of the current time or when the table was deleted.
 *
 * You can also overwrite these settings during restore:
 *
 * - Read/write capacity mode
 *
 * - Provisioned throughput capacity units
 *
 * - Auto scaling settings
 *
 * - Point-in-time (PITR) settings
 *
 * - Tags
 *
 * For more information, see PITR restore settings in the *Amazon Keyspaces Developer Guide*.
 *
 * Note that the following settings are not restored, and you must configure them manually for the new table:
 *
 * - Identity and Access Management (IAM) policies
 *
 * - Amazon CloudWatch metrics and alarms
 */
export const restoreTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreTableRequest,
  output: RestoreTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Adds a new Amazon Web Services Region to the keyspace. You can add a new Region to a keyspace that is either a single or a multi-Region keyspace. Amazon Keyspaces is going to replicate all tables in the keyspace to the new Region. To successfully replicate all tables to the new Region, they must use client-side timestamps for conflict resolution. To enable client-side timestamps, specify `clientSideTimestamps.status = enabled` when invoking the API. For more information about client-side timestamps, see Client-side timestamps in Amazon Keyspaces in the *Amazon Keyspaces Developer Guide*.
 *
 * To add a Region to a keyspace using the `UpdateKeyspace` API, the IAM principal needs permissions for the following IAM actions:
 *
 * - `cassandra:Alter`
 *
 * - `cassandra:AlterMultiRegionResource`
 *
 * - `cassandra:Create`
 *
 * - `cassandra:CreateMultiRegionResource`
 *
 * - `cassandra:Select`
 *
 * - `cassandra:SelectMultiRegionResource`
 *
 * - `cassandra:Modify`
 *
 * - `cassandra:ModifyMultiRegionResource`
 *
 * If the keyspace contains a table that is configured in provisioned mode with auto scaling enabled, the following additional IAM actions need to be allowed.
 *
 * - `application-autoscaling:RegisterScalableTarget`
 *
 * - `application-autoscaling:DeregisterScalableTarget`
 *
 * - `application-autoscaling:DescribeScalableTargets`
 *
 * - `application-autoscaling:PutScalingPolicy`
 *
 * - `application-autoscaling:DescribeScalingPolicies`
 *
 * To use the `UpdateKeyspace` API, the IAM principal also needs permissions to create a service-linked role with the following elements:
 *
 * - `iam:CreateServiceLinkedRole` - The **action** the principal can perform.
 *
 * - `arn:aws:iam::*:role/aws-service-role/replication.cassandra.amazonaws.com/AWSServiceRoleForKeyspacesReplication` - The **resource** that the action can be performed on.
 *
 * - `iam:AWSServiceName: replication.cassandra.amazonaws.com` - The only Amazon Web Services service that this role can be attached to is Amazon Keyspaces.
 *
 * For more information, see Configure the IAM permissions required to add an Amazon Web Services Region to a keyspace in the *Amazon Keyspaces Developer Guide*.
 */
export const updateKeyspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeyspaceRequest,
  output: UpdateKeyspaceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * The `DeleteTable` operation deletes a table and all of its data. After a `DeleteTable` request is received, the specified table is in the `DELETING` state until Amazon Keyspaces completes the deletion. If the table is in the `ACTIVE` state, you can delete it. If a table is either in the `CREATING` or `UPDATING` states, then Amazon Keyspaces returns a `ResourceInUseException`. If the specified table does not exist, Amazon Keyspaces returns a `ResourceNotFoundException`. If the table is already in the `DELETING` state, no error is returned.
 */
export const deleteTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableRequest,
  output: DeleteTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Associates a set of tags with a Amazon Keyspaces resource. You can then activate these user-defined tags so that they appear on the Cost Management Console for cost allocation tracking. For more information, see Adding tags and labels to Amazon Keyspaces resources in the *Amazon Keyspaces Developer Guide*.
 *
 * For IAM policy examples that show how to control access to Amazon Keyspaces resources based on tags, see Amazon Keyspaces resource access based on tags in the *Amazon Keyspaces Developer Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Removes the association of tags from a Amazon Keyspaces resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * The `CreateType` operation creates a new user-defined type in the specified keyspace.
 *
 * To configure the required permissions, see Permissions to create a UDT in the *Amazon Keyspaces Developer Guide*.
 *
 * For more information, see User-defined types (UDTs) in the *Amazon Keyspaces Developer Guide*.
 */
export const createType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTypeRequest,
  output: CreateTypeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all tags associated with the specified Amazon Keyspaces resource.
 *
 * To read keyspace metadata using `ListTagsForResource`, the IAM principal needs `Select` action permissions for the specified resource and the system keyspace.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "tags",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * The `ListTypes` operation returns a list of types for a specified keyspace.
 *
 * To read keyspace metadata using `ListTypes`, the IAM principal needs `Select` action permissions for the system keyspace. To configure the required permissions, see Permissions to view a UDT in the *Amazon Keyspaces Developer Guide*.
 */
export const listTypes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypesRequest,
  output: ListTypesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "types",
    pageSize: "maxResults",
  } as const,
}));
/**
 * The `DeleteKeyspace` operation deletes a keyspace and all of its tables.
 */
export const deleteKeyspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyspaceRequest,
  output: DeleteKeyspaceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the name of the specified keyspace, the Amazon Resource Name (ARN), the replication strategy, the Amazon Web Services Regions of a multi-Region keyspace, and the status of newly added Regions after an `UpdateKeyspace` operation.
 */
export const getKeyspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKeyspaceRequest,
  output: GetKeyspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns information about the table, including the table's name and current status, the keyspace name, configuration settings, and metadata.
 *
 * To read table metadata using `GetTable`, the IAM principal needs `Select` action permissions for the table and the system keyspace.
 */
export const getTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableRequest,
  output: GetTableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns auto scaling related settings of the specified table in JSON format. If the table is a multi-Region table, the Amazon Web Services Region specific auto scaling settings of the table are included.
 *
 * Amazon Keyspaces auto scaling helps you provision throughput capacity for variable workloads efficiently by increasing and decreasing your table's read and write capacity automatically in response to application traffic. For more information, see Managing throughput capacity automatically with Amazon Keyspaces auto scaling in the *Amazon Keyspaces Developer Guide*.
 *
 * `GetTableAutoScalingSettings` can't be used as an action in an IAM policy.
 *
 * To define permissions for `GetTableAutoScalingSettings`, you must allow the following two actions in the IAM policy statement's `Action` element:
 *
 * - `application-autoscaling:DescribeScalableTargets`
 *
 * - `application-autoscaling:DescribeScalingPolicies`
 */
export const getTableAutoScalingSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTableAutoScalingSettingsRequest,
    output: GetTableAutoScalingSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * The `GetType` operation returns information about the type, for example the field definitions, the timestamp when the type was last modified, the level of nesting, the status, and details about if the type is used in other types and tables.
 *
 * To read keyspace metadata using `GetType`, the IAM principal needs `Select` action permissions for the system keyspace. To configure the required permissions, see Permissions to view a UDT in the *Amazon Keyspaces Developer Guide*.
 */
export const getType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTypeRequest,
  output: GetTypeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * The `CreateTable` operation adds a new table to the specified keyspace. Within a keyspace, table names must be unique.
 *
 * `CreateTable` is an asynchronous operation. When the request is received, the status of the table is set to `CREATING`. You can monitor the creation status of the new table by using the `GetTable` operation, which returns the current `status` of the table. You can start using a table when the status is `ACTIVE`.
 *
 * For more information, see Create a table in the *Amazon Keyspaces Developer Guide*.
 */
export const createTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableRequest,
  output: CreateTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "DocDB Elastic",
  serviceShapeName: "ChimeraDbLionfishServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "docdb-elastic" });
const ver = T.ServiceVersion("2022-11-28");
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
                                url: "https://docdb-elastic-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://docdb-elastic-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://docdb-elastic.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://docdb-elastic.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export const StringList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class ApplyPendingMaintenanceActionInput extends S.Class<ApplyPendingMaintenanceActionInput>(
  "ApplyPendingMaintenanceActionInput",
)(
  {
    resourceArn: S.String,
    applyAction: S.String,
    optInType: S.String,
    applyOn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/pending-action" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateClusterInput extends S.Class<CreateClusterInput>(
  "CreateClusterInput",
)(
  {
    clusterName: S.String,
    authType: S.String,
    adminUserName: S.String,
    adminUserPassword: S.String,
    shardCapacity: S.Number,
    shardCount: S.Number,
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    kmsKeyId: S.optional(S.String),
    clientToken: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    tags: S.optional(TagMap),
    backupRetentionPeriod: S.optional(S.Number),
    preferredBackupWindow: S.optional(S.String),
    shardInstanceCount: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateClusterSnapshotInput extends S.Class<CreateClusterSnapshotInput>(
  "CreateClusterSnapshotInput",
)(
  { clusterArn: S.String, snapshotName: S.String, tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/cluster-snapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterInput extends S.Class<DeleteClusterInput>(
  "DeleteClusterInput",
)(
  { clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cluster/{clusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteClusterSnapshotInput extends S.Class<DeleteClusterSnapshotInput>(
  "DeleteClusterSnapshotInput",
)(
  { snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/cluster-snapshot/{snapshotArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClusterInput extends S.Class<GetClusterInput>(
  "GetClusterInput",
)(
  { clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/cluster/{clusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClusterSnapshotInput extends S.Class<GetClusterSnapshotInput>(
  "GetClusterSnapshotInput",
)(
  { snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/cluster-snapshot/{snapshotArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPendingMaintenanceActionInput extends S.Class<GetPendingMaintenanceActionInput>(
  "GetPendingMaintenanceActionInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/pending-action/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersInput extends S.Class<ListClustersInput>(
  "ListClustersInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClusterSnapshotsInput extends S.Class<ListClusterSnapshotsInput>(
  "ListClusterSnapshotsInput",
)(
  {
    clusterArn: S.optional(S.String).pipe(T.HttpQuery("clusterArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    snapshotType: S.optional(S.String).pipe(T.HttpQuery("snapshotType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/cluster-snapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPendingMaintenanceActionsInput extends S.Class<ListPendingMaintenanceActionsInput>(
  "ListPendingMaintenanceActionsInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/pending-actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestoreClusterFromSnapshotInput extends S.Class<RestoreClusterFromSnapshotInput>(
  "RestoreClusterFromSnapshotInput",
)(
  {
    clusterName: S.String,
    snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")),
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    shardCapacity: S.optional(S.Number),
    shardInstanceCount: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster-snapshot/{snapshotArn}/restore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartClusterInput extends S.Class<StartClusterInput>(
  "StartClusterInput",
)(
  { clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) },
  T.all(
    T.Http({ method: "POST", uri: "/cluster/{clusterArn}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopClusterInput extends S.Class<StopClusterInput>(
  "StopClusterInput",
)(
  { clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) },
  T.all(
    T.Http({ method: "POST", uri: "/cluster/{clusterArn}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateClusterInput extends S.Class<UpdateClusterInput>(
  "UpdateClusterInput",
)(
  {
    clusterArn: S.String.pipe(T.HttpLabel("clusterArn")),
    authType: S.optional(S.String),
    shardCapacity: S.optional(S.Number),
    shardCount: S.optional(S.Number),
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    adminUserPassword: S.optional(S.String),
    clientToken: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    backupRetentionPeriod: S.optional(S.Number),
    preferredBackupWindow: S.optional(S.String),
    shardInstanceCount: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cluster/{clusterArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PendingMaintenanceActionDetails extends S.Class<PendingMaintenanceActionDetails>(
  "PendingMaintenanceActionDetails",
)({
  action: S.String,
  autoAppliedAfterDate: S.optional(S.String),
  forcedApplyDate: S.optional(S.String),
  optInStatus: S.optional(S.String),
  currentApplyDate: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const PendingMaintenanceActionDetailsList = S.Array(
  PendingMaintenanceActionDetails,
);
export class ResourcePendingMaintenanceAction extends S.Class<ResourcePendingMaintenanceAction>(
  "ResourcePendingMaintenanceAction",
)({
  resourceArn: S.optional(S.String),
  pendingMaintenanceActionDetails: S.optional(
    PendingMaintenanceActionDetailsList,
  ),
}) {}
export const ResourcePendingMaintenanceActionList = S.Array(
  ResourcePendingMaintenanceAction,
);
export class CopyClusterSnapshotInput extends S.Class<CopyClusterSnapshotInput>(
  "CopyClusterSnapshotInput",
)(
  {
    snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")),
    targetSnapshotName: S.String,
    kmsKeyId: S.optional(S.String),
    copyTags: S.optional(S.Boolean),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster-snapshot/{snapshotArn}/copy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Shard extends S.Class<Shard>("Shard")({
  shardId: S.String,
  createTime: S.String,
  status: S.String,
}) {}
export const ShardList = S.Array(Shard);
export class Cluster extends S.Class<Cluster>("Cluster")({
  clusterName: S.String,
  clusterArn: S.String,
  status: S.String,
  clusterEndpoint: S.String,
  createTime: S.String,
  adminUserName: S.String,
  authType: S.String,
  shardCapacity: S.Number,
  shardCount: S.Number,
  vpcSecurityGroupIds: StringList,
  subnetIds: StringList,
  preferredMaintenanceWindow: S.String,
  kmsKeyId: S.String,
  shards: S.optional(ShardList),
  backupRetentionPeriod: S.optional(S.Number),
  preferredBackupWindow: S.optional(S.String),
  shardInstanceCount: S.optional(S.Number),
}) {}
export class DeleteClusterOutput extends S.Class<DeleteClusterOutput>(
  "DeleteClusterOutput",
)({ cluster: Cluster }) {}
export class ClusterSnapshot extends S.Class<ClusterSnapshot>(
  "ClusterSnapshot",
)({
  subnetIds: StringList,
  snapshotName: S.String,
  snapshotArn: S.String,
  snapshotCreationTime: S.String,
  clusterArn: S.String,
  clusterCreationTime: S.String,
  status: S.String,
  vpcSecurityGroupIds: StringList,
  adminUserName: S.String,
  kmsKeyId: S.String,
  snapshotType: S.optional(S.String),
}) {}
export class DeleteClusterSnapshotOutput extends S.Class<DeleteClusterSnapshotOutput>(
  "DeleteClusterSnapshotOutput",
)({ snapshot: ClusterSnapshot }) {}
export class GetClusterOutput extends S.Class<GetClusterOutput>(
  "GetClusterOutput",
)({ cluster: Cluster }) {}
export class GetClusterSnapshotOutput extends S.Class<GetClusterSnapshotOutput>(
  "GetClusterSnapshotOutput",
)({ snapshot: ClusterSnapshot }) {}
export class GetPendingMaintenanceActionOutput extends S.Class<GetPendingMaintenanceActionOutput>(
  "GetPendingMaintenanceActionOutput",
)({ resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction }) {}
export class ListPendingMaintenanceActionsOutput extends S.Class<ListPendingMaintenanceActionsOutput>(
  "ListPendingMaintenanceActionsOutput",
)({
  resourcePendingMaintenanceActions: ResourcePendingMaintenanceActionList,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class RestoreClusterFromSnapshotOutput extends S.Class<RestoreClusterFromSnapshotOutput>(
  "RestoreClusterFromSnapshotOutput",
)({ cluster: Cluster }) {}
export class StartClusterOutput extends S.Class<StartClusterOutput>(
  "StartClusterOutput",
)({ cluster: Cluster }) {}
export class StopClusterOutput extends S.Class<StopClusterOutput>(
  "StopClusterOutput",
)({ cluster: Cluster }) {}
export class UpdateClusterOutput extends S.Class<UpdateClusterOutput>(
  "UpdateClusterOutput",
)({ cluster: Cluster }) {}
export class ClusterInList extends S.Class<ClusterInList>("ClusterInList")({
  clusterName: S.String,
  clusterArn: S.String,
  status: S.String,
}) {}
export const ClusterList = S.Array(ClusterInList);
export class ClusterSnapshotInList extends S.Class<ClusterSnapshotInList>(
  "ClusterSnapshotInList",
)({
  snapshotName: S.String,
  snapshotArn: S.String,
  clusterArn: S.String,
  status: S.String,
  snapshotCreationTime: S.String,
}) {}
export const ClusterSnapshotList = S.Array(ClusterSnapshotInList);
export class CopyClusterSnapshotOutput extends S.Class<CopyClusterSnapshotOutput>(
  "CopyClusterSnapshotOutput",
)({ snapshot: ClusterSnapshot }) {}
export class CreateClusterSnapshotOutput extends S.Class<CreateClusterSnapshotOutput>(
  "CreateClusterSnapshotOutput",
)({ snapshot: ClusterSnapshot }) {}
export class ListClustersOutput extends S.Class<ListClustersOutput>(
  "ListClustersOutput",
)({ clusters: S.optional(ClusterList), nextToken: S.optional(S.String) }) {}
export class ListClusterSnapshotsOutput extends S.Class<ListClusterSnapshotsOutput>(
  "ListClusterSnapshotsOutput",
)({
  snapshots: S.optional(ClusterSnapshotList),
  nextToken: S.optional(S.String),
}) {}
export class ApplyPendingMaintenanceActionOutput extends S.Class<ApplyPendingMaintenanceActionOutput>(
  "ApplyPendingMaintenanceActionOutput",
)({ resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction }) {}
export class CreateClusterOutput extends S.Class<CreateClusterOutput>(
  "CreateClusterOutput",
)({ cluster: Cluster }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Returns information about provisioned Amazon DocumentDB elastic clusters.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListClustersInput,
    output: ListClustersOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "clusters",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Delete an elastic cluster snapshot.
 */
export const deleteClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClusterSnapshotInput,
    output: DeleteClusterSnapshotOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves all maintenance actions that are pending.
 */
export const getPendingMaintenanceAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPendingMaintenanceActionInput,
    output: GetPendingMaintenanceActionOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Modifies an elastic cluster. This includes updating admin-username/password,
 * upgrading the API version, and setting up a backup window and maintenance window
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterInput,
  output: UpdateClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The type of pending maintenance action to be applied to the resource.
 */
export const applyPendingMaintenanceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplyPendingMaintenanceActionInput,
    output: ApplyPendingMaintenanceActionOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about snapshots for a specified elastic cluster.
 */
export const listClusterSnapshots =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListClusterSnapshotsInput,
    output: ListClusterSnapshotsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "snapshots",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Adds metadata tags to an elastic cluster resource
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific elastic cluster.
 */
export const getCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterInput,
  output: GetClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific elastic cluster snapshot
 */
export const getClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterSnapshotInput,
  output: GetClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all maintenance actions that are pending.
 */
export const listPendingMaintenanceActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPendingMaintenanceActionsInput,
    output: ListPendingMaintenanceActionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "resourcePendingMaintenanceActions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Restarts the stopped elastic cluster that is specified by `clusterARN`.
 */
export const startCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartClusterInput,
  output: StartClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops the running elastic cluster that is specified by `clusterArn`.
 * The elastic cluster must be in the *available* state.
 */
export const stopCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopClusterInput,
  output: StopClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes metadata tags from an elastic cluster resource
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags on a elastic cluster resource
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an elastic cluster.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterInput,
  output: DeleteClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Restores an elastic cluster from a snapshot.
 */
export const restoreClusterFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreClusterFromSnapshotInput,
    output: RestoreClusterFromSnapshotOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Copies a snapshot of an elastic cluster.
 */
export const copyClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyClusterSnapshotInput,
  output: CopyClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of an elastic cluster.
 */
export const createClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClusterSnapshotInput,
    output: CreateClusterSnapshotOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new Amazon DocumentDB elastic cluster and returns its cluster structure.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterInput,
  output: CreateClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

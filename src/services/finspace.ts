import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "finspace",
  serviceShapeName: "AWSHabaneroManagementService",
});
const auth = T.AwsAuthSigv4({ name: "finspace" });
const ver = T.ServiceVersion("2021-03-12");
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
                        url: "https://finspace-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://finspace-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://finspace.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://finspace.{Region}.{PartitionResult#dnsSuffix}",
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
export const DataBundleArns = S.Array(S.String);
export const AvailabilityZoneIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateKxDatabaseRequest extends S.Class<CreateKxDatabaseRequest>(
  "CreateKxDatabaseRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/databases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxEnvironmentRequest extends S.Class<CreateKxEnvironmentRequest>(
  "CreateKxEnvironmentRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    kmsKeyId: S.String,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/kx/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxScalingGroupRequest extends S.Class<CreateKxScalingGroupRequest>(
  "CreateKxScalingGroupRequest",
)(
  {
    clientToken: S.String,
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String,
    hostType: S.String,
    availabilityZoneId: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/scalingGroups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxUserRequest extends S.Class<CreateKxUserRequest>(
  "CreateKxUserRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    userName: S.String,
    iamRole: S.String,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/kx/environments/{environmentId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/environment/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({}) {}
export class DeleteKxClusterRequest extends S.Class<DeleteKxClusterRequest>(
  "DeleteKxClusterRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxClusterResponse extends S.Class<DeleteKxClusterResponse>(
  "DeleteKxClusterResponse",
)({}) {}
export class DeleteKxClusterNodeRequest extends S.Class<DeleteKxClusterNodeRequest>(
  "DeleteKxClusterNodeRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nodeId: S.String.pipe(T.HttpLabel("nodeId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}/nodes/{nodeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxClusterNodeResponse extends S.Class<DeleteKxClusterNodeResponse>(
  "DeleteKxClusterNodeResponse",
)({}) {}
export class DeleteKxDatabaseRequest extends S.Class<DeleteKxDatabaseRequest>(
  "DeleteKxDatabaseRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    clientToken: S.String.pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxDatabaseResponse extends S.Class<DeleteKxDatabaseResponse>(
  "DeleteKxDatabaseResponse",
)({}) {}
export class DeleteKxDataviewRequest extends S.Class<DeleteKxDataviewRequest>(
  "DeleteKxDataviewRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
    clientToken: S.String.pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxDataviewResponse extends S.Class<DeleteKxDataviewResponse>(
  "DeleteKxDataviewResponse",
)({}) {}
export class DeleteKxEnvironmentRequest extends S.Class<DeleteKxEnvironmentRequest>(
  "DeleteKxEnvironmentRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/kx/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxEnvironmentResponse extends S.Class<DeleteKxEnvironmentResponse>(
  "DeleteKxEnvironmentResponse",
)({}) {}
export class DeleteKxScalingGroupRequest extends S.Class<DeleteKxScalingGroupRequest>(
  "DeleteKxScalingGroupRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String.pipe(T.HttpLabel("scalingGroupName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/scalingGroups/{scalingGroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxScalingGroupResponse extends S.Class<DeleteKxScalingGroupResponse>(
  "DeleteKxScalingGroupResponse",
)({}) {}
export class DeleteKxUserRequest extends S.Class<DeleteKxUserRequest>(
  "DeleteKxUserRequest",
)(
  {
    userName: S.String.pipe(T.HttpLabel("userName")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/users/{userName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxUserResponse extends S.Class<DeleteKxUserResponse>(
  "DeleteKxUserResponse",
)({}) {}
export class DeleteKxVolumeRequest extends S.Class<DeleteKxVolumeRequest>(
  "DeleteKxVolumeRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKxVolumeResponse extends S.Class<DeleteKxVolumeResponse>(
  "DeleteKxVolumeResponse",
)({}) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/environment/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxChangesetRequest extends S.Class<GetKxChangesetRequest>(
  "GetKxChangesetRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    changesetId: S.String.pipe(T.HttpLabel("changesetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets/{changesetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxClusterRequest extends S.Class<GetKxClusterRequest>(
  "GetKxClusterRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxConnectionStringRequest extends S.Class<GetKxConnectionStringRequest>(
  "GetKxConnectionStringRequest",
)(
  {
    userArn: S.String.pipe(T.HttpQuery("userArn")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpQuery("clusterName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/connectionString",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxDatabaseRequest extends S.Class<GetKxDatabaseRequest>(
  "GetKxDatabaseRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxDataviewRequest extends S.Class<GetKxDataviewRequest>(
  "GetKxDataviewRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxEnvironmentRequest extends S.Class<GetKxEnvironmentRequest>(
  "GetKxEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/kx/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxScalingGroupRequest extends S.Class<GetKxScalingGroupRequest>(
  "GetKxScalingGroupRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    scalingGroupName: S.String.pipe(T.HttpLabel("scalingGroupName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/scalingGroups/{scalingGroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxUserRequest extends S.Class<GetKxUserRequest>(
  "GetKxUserRequest",
)(
  {
    userName: S.String.pipe(T.HttpLabel("userName")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/users/{userName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxVolumeRequest extends S.Class<GetKxVolumeRequest>(
  "GetKxVolumeRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/environment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxChangesetsRequest extends S.Class<ListKxChangesetsRequest>(
  "ListKxChangesetsRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxClusterNodesRequest extends S.Class<ListKxClusterNodesRequest>(
  "ListKxClusterNodesRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}/nodes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxClustersRequest extends S.Class<ListKxClustersRequest>(
  "ListKxClustersRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterType: S.optional(S.String).pipe(T.HttpQuery("clusterType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/kx/environments/{environmentId}/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxDatabasesRequest extends S.Class<ListKxDatabasesRequest>(
  "ListKxDatabasesRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxDataviewsRequest extends S.Class<ListKxDataviewsRequest>(
  "ListKxDataviewsRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxEnvironmentsRequest extends S.Class<ListKxEnvironmentsRequest>(
  "ListKxEnvironmentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/kx/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxScalingGroupsRequest extends S.Class<ListKxScalingGroupsRequest>(
  "ListKxScalingGroupsRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/scalingGroups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxUsersRequest extends S.Class<ListKxUsersRequest>(
  "ListKxUsersRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/kx/environments/{environmentId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKxVolumesRequest extends S.Class<ListKxVolumesRequest>(
  "ListKxVolumesRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    volumeType: S.optional(S.String).pipe(T.HttpQuery("volumeType")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/kx/environments/{environmentId}/kxvolumes",
    }),
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
export const AttributeMap = S.Record({ key: S.String, value: S.String });
export class FederationParameters extends S.Class<FederationParameters>(
  "FederationParameters",
)({
  samlMetadataDocument: S.optional(S.String),
  samlMetadataURL: S.optional(S.String),
  applicationCallBackURL: S.optional(S.String),
  federationURN: S.optional(S.String),
  federationProviderName: S.optional(S.String),
  attributeMap: S.optional(AttributeMap),
}) {}
export class UpdateEnvironmentRequest extends S.Class<UpdateEnvironmentRequest>(
  "UpdateEnvironmentRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    federationMode: S.optional(S.String),
    federationParameters: S.optional(FederationParameters),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/environment/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxDatabaseRequest extends S.Class<UpdateKxDatabaseRequest>(
  "UpdateKxDatabaseRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    description: S.optional(S.String),
    clientToken: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SegmentConfigurationDbPathList = S.Array(S.String);
export class KxDataviewSegmentConfiguration extends S.Class<KxDataviewSegmentConfiguration>(
  "KxDataviewSegmentConfiguration",
)({
  dbPaths: SegmentConfigurationDbPathList,
  volumeName: S.String,
  onDemand: S.optional(S.Boolean),
}) {}
export const KxDataviewSegmentConfigurationList = S.Array(
  KxDataviewSegmentConfiguration,
);
export class UpdateKxDataviewRequest extends S.Class<UpdateKxDataviewRequest>(
  "UpdateKxDataviewRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String.pipe(T.HttpLabel("dataviewName")),
    description: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    clientToken: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews/{dataviewName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxEnvironmentRequest extends S.Class<UpdateKxEnvironmentRequest>(
  "UpdateKxEnvironmentRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/kx/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxUserRequest extends S.Class<UpdateKxUserRequest>(
  "UpdateKxUserRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    userName: S.String.pipe(T.HttpLabel("userName")),
    iamRole: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/kx/environments/{environmentId}/users/{userName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class KxNAS1Configuration extends S.Class<KxNAS1Configuration>(
  "KxNAS1Configuration",
)({ type: S.optional(S.String), size: S.optional(S.Number) }) {}
export class UpdateKxVolumeRequest extends S.Class<UpdateKxVolumeRequest>(
  "UpdateKxVolumeRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeName: S.String.pipe(T.HttpLabel("volumeName")),
    description: S.optional(S.String),
    clientToken: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/kx/environments/{environmentId}/kxvolumes/{volumeName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TickerplantLogVolumes = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export class SuperuserParameters extends S.Class<SuperuserParameters>(
  "SuperuserParameters",
)({ emailAddress: S.String, firstName: S.String, lastName: S.String }) {}
export class ChangeRequest extends S.Class<ChangeRequest>("ChangeRequest")({
  changeType: S.String,
  s3Path: S.optional(S.String),
  dbPath: S.String,
}) {}
export const ChangeRequests = S.Array(ChangeRequest);
export class TickerplantLogConfiguration extends S.Class<TickerplantLogConfiguration>(
  "TickerplantLogConfiguration",
)({ tickerplantLogVolumes: S.optional(TickerplantLogVolumes) }) {}
export class KxCacheStorageConfiguration extends S.Class<KxCacheStorageConfiguration>(
  "KxCacheStorageConfiguration",
)({ type: S.String, size: S.Number }) {}
export const KxCacheStorageConfigurations = S.Array(
  KxCacheStorageConfiguration,
);
export class AutoScalingConfiguration extends S.Class<AutoScalingConfiguration>(
  "AutoScalingConfiguration",
)({
  minNodeCount: S.optional(S.Number),
  maxNodeCount: S.optional(S.Number),
  autoScalingMetric: S.optional(S.String),
  metricTarget: S.optional(S.Number),
  scaleInCooldownSeconds: S.optional(S.Number),
  scaleOutCooldownSeconds: S.optional(S.Number),
}) {}
export class CapacityConfiguration extends S.Class<CapacityConfiguration>(
  "CapacityConfiguration",
)({ nodeType: S.optional(S.String), nodeCount: S.optional(S.Number) }) {}
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({
  vpcId: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupIdList),
  subnetIds: S.optional(SubnetIdList),
  ipAddressType: S.optional(S.String),
}) {}
export class KxCommandLineArgument extends S.Class<KxCommandLineArgument>(
  "KxCommandLineArgument",
)({ key: S.optional(S.String), value: S.optional(S.String) }) {}
export const KxCommandLineArguments = S.Array(KxCommandLineArgument);
export class CodeConfiguration extends S.Class<CodeConfiguration>(
  "CodeConfiguration",
)({
  s3Bucket: S.optional(S.String),
  s3Key: S.optional(S.String),
  s3ObjectVersion: S.optional(S.String),
}) {}
export class KxSavedownStorageConfiguration extends S.Class<KxSavedownStorageConfiguration>(
  "KxSavedownStorageConfiguration",
)({
  type: S.optional(S.String),
  size: S.optional(S.Number),
  volumeName: S.optional(S.String),
}) {}
export class KxScalingGroupConfiguration extends S.Class<KxScalingGroupConfiguration>(
  "KxScalingGroupConfiguration",
)({
  scalingGroupName: S.String,
  memoryLimit: S.optional(S.Number),
  memoryReservation: S.Number,
  nodeCount: S.Number,
  cpu: S.optional(S.Number),
}) {}
export const KxClusterNameList = S.Array(S.String);
export class Environment extends S.Class<Environment>("Environment")({
  name: S.optional(S.String),
  environmentId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  status: S.optional(S.String),
  environmentUrl: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  sageMakerStudioDomainUrl: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dedicatedServiceAccountId: S.optional(S.String),
  federationMode: S.optional(S.String),
  federationParameters: S.optional(FederationParameters),
}) {}
export const EnvironmentList = S.Array(Environment);
export class KxClusterCodeDeploymentConfiguration extends S.Class<KxClusterCodeDeploymentConfiguration>(
  "KxClusterCodeDeploymentConfiguration",
)({ deploymentStrategy: S.String }) {}
export class KxDeploymentConfiguration extends S.Class<KxDeploymentConfiguration>(
  "KxDeploymentConfiguration",
)({ deploymentStrategy: S.String }) {}
export class CustomDNSServer extends S.Class<CustomDNSServer>(
  "CustomDNSServer",
)({ customDNSServerName: S.String, customDNSServerIP: S.String }) {}
export const CustomDNSConfiguration = S.Array(CustomDNSServer);
export const DbPaths = S.Array(S.String);
export class CreateKxChangesetRequest extends S.Class<CreateKxChangesetRequest>(
  "CreateKxChangesetRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    changeRequests: ChangeRequests,
    clientToken: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/changesets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxDatabaseResponse extends S.Class<CreateKxDatabaseResponse>(
  "CreateKxDatabaseResponse",
)({
  databaseName: S.optional(S.String),
  databaseArn: S.optional(S.String),
  environmentId: S.optional(S.String),
  description: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CreateKxDataviewRequest extends S.Class<CreateKxDataviewRequest>(
  "CreateKxDataviewRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    databaseName: S.String.pipe(T.HttpLabel("databaseName")),
    dataviewName: S.String,
    azMode: S.String,
    availabilityZoneId: S.optional(S.String),
    changesetId: S.optional(S.String),
    segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
    autoUpdate: S.optional(S.Boolean),
    readWrite: S.optional(S.Boolean),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/databases/{databaseName}/dataviews",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxEnvironmentResponse extends S.Class<CreateKxEnvironmentResponse>(
  "CreateKxEnvironmentResponse",
)({
  name: S.optional(S.String),
  status: S.optional(S.String),
  environmentId: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CreateKxScalingGroupResponse extends S.Class<CreateKxScalingGroupResponse>(
  "CreateKxScalingGroupResponse",
)({
  environmentId: S.optional(S.String),
  scalingGroupName: S.optional(S.String),
  hostType: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  status: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateKxUserResponse extends S.Class<CreateKxUserResponse>(
  "CreateKxUserResponse",
)({
  userName: S.optional(S.String),
  userArn: S.optional(S.String),
  environmentId: S.optional(S.String),
  iamRole: S.optional(S.String),
}) {}
export class CreateKxVolumeRequest extends S.Class<CreateKxVolumeRequest>(
  "CreateKxVolumeRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    volumeType: S.String,
    volumeName: S.String,
    description: S.optional(S.String),
    nas1Configuration: S.optional(KxNAS1Configuration),
    azMode: S.String,
    availabilityZoneIds: AvailabilityZoneIds,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/kxvolumes",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetKxConnectionStringResponse extends S.Class<GetKxConnectionStringResponse>(
  "GetKxConnectionStringResponse",
)({ signedConnectionString: S.optional(S.String) }) {}
export class GetKxDatabaseResponse extends S.Class<GetKxDatabaseResponse>(
  "GetKxDatabaseResponse",
)({
  databaseName: S.optional(S.String),
  databaseArn: S.optional(S.String),
  environmentId: S.optional(S.String),
  description: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastCompletedChangesetId: S.optional(S.String),
  numBytes: S.optional(S.Number),
  numChangesets: S.optional(S.Number),
  numFiles: S.optional(S.Number),
}) {}
export class PortRange extends S.Class<PortRange>("PortRange")({
  from: S.Number,
  to: S.Number,
}) {}
export class IcmpTypeCode extends S.Class<IcmpTypeCode>("IcmpTypeCode")({
  type: S.Number,
  code: S.Number,
}) {}
export class NetworkACLEntry extends S.Class<NetworkACLEntry>(
  "NetworkACLEntry",
)({
  ruleNumber: S.Number,
  protocol: S.String,
  ruleAction: S.String,
  portRange: S.optional(PortRange),
  icmpTypeCode: S.optional(IcmpTypeCode),
  cidrBlock: S.String,
}) {}
export const NetworkACLConfiguration = S.Array(NetworkACLEntry);
export class TransitGatewayConfiguration extends S.Class<TransitGatewayConfiguration>(
  "TransitGatewayConfiguration",
)({
  transitGatewayID: S.String,
  routableCIDRSpace: S.String,
  attachmentNetworkAclConfiguration: S.optional(NetworkACLConfiguration),
}) {}
export class GetKxEnvironmentResponse extends S.Class<GetKxEnvironmentResponse>(
  "GetKxEnvironmentResponse",
)({
  name: S.optional(S.String),
  environmentId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  status: S.optional(S.String),
  tgwStatus: S.optional(S.String),
  dnsStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dedicatedServiceAccountId: S.optional(S.String),
  transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
  customDNSConfiguration: S.optional(CustomDNSConfiguration),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  updateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  certificateAuthorityArn: S.optional(S.String),
}) {}
export class GetKxScalingGroupResponse extends S.Class<GetKxScalingGroupResponse>(
  "GetKxScalingGroupResponse",
)({
  scalingGroupName: S.optional(S.String),
  scalingGroupArn: S.optional(S.String),
  hostType: S.optional(S.String),
  clusters: S.optional(KxClusterNameList),
  availabilityZoneId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetKxUserResponse extends S.Class<GetKxUserResponse>(
  "GetKxUserResponse",
)({
  userName: S.optional(S.String),
  userArn: S.optional(S.String),
  environmentId: S.optional(S.String),
  iamRole: S.optional(S.String),
}) {}
export class ListEnvironmentsResponse extends S.Class<ListEnvironmentsResponse>(
  "ListEnvironmentsResponse",
)({
  environments: S.optional(EnvironmentList),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class UpdateEnvironmentResponse extends S.Class<UpdateEnvironmentResponse>(
  "UpdateEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class UpdateKxClusterCodeConfigurationRequest extends S.Class<UpdateKxClusterCodeConfigurationRequest>(
  "UpdateKxClusterCodeConfigurationRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String),
    code: CodeConfiguration,
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    deploymentConfiguration: S.optional(KxClusterCodeDeploymentConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}/configuration/code",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxClusterCodeConfigurationResponse extends S.Class<UpdateKxClusterCodeConfigurationResponse>(
  "UpdateKxClusterCodeConfigurationResponse",
)({}) {}
export class KxDatabaseCacheConfiguration extends S.Class<KxDatabaseCacheConfiguration>(
  "KxDatabaseCacheConfiguration",
)({
  cacheType: S.String,
  dbPaths: DbPaths,
  dataviewName: S.optional(S.String),
}) {}
export const KxDatabaseCacheConfigurations = S.Array(
  KxDatabaseCacheConfiguration,
);
export class KxDataviewConfiguration extends S.Class<KxDataviewConfiguration>(
  "KxDataviewConfiguration",
)({
  dataviewName: S.optional(S.String),
  dataviewVersionId: S.optional(S.String),
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
}) {}
export class KxDatabaseConfiguration extends S.Class<KxDatabaseConfiguration>(
  "KxDatabaseConfiguration",
)({
  databaseName: S.String,
  cacheConfigurations: S.optional(KxDatabaseCacheConfigurations),
  changesetId: S.optional(S.String),
  dataviewName: S.optional(S.String),
  dataviewConfiguration: S.optional(KxDataviewConfiguration),
}) {}
export const KxDatabaseConfigurations = S.Array(KxDatabaseConfiguration);
export class UpdateKxClusterDatabasesRequest extends S.Class<UpdateKxClusterDatabasesRequest>(
  "UpdateKxClusterDatabasesRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    clientToken: S.optional(S.String),
    databases: KxDatabaseConfigurations,
    deploymentConfiguration: S.optional(KxDeploymentConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/kx/environments/{environmentId}/clusters/{clusterName}/configuration/databases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxClusterDatabasesResponse extends S.Class<UpdateKxClusterDatabasesResponse>(
  "UpdateKxClusterDatabasesResponse",
)({}) {}
export class UpdateKxDatabaseResponse extends S.Class<UpdateKxDatabaseResponse>(
  "UpdateKxDatabaseResponse",
)({
  databaseName: S.optional(S.String),
  environmentId: S.optional(S.String),
  description: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AttachedClusterList = S.Array(S.String);
export class KxDataviewActiveVersion extends S.Class<KxDataviewActiveVersion>(
  "KxDataviewActiveVersion",
)({
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  attachedClusters: S.optional(AttachedClusterList),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  versionId: S.optional(S.String),
}) {}
export const KxDataviewActiveVersionList = S.Array(KxDataviewActiveVersion);
export class UpdateKxDataviewResponse extends S.Class<UpdateKxDataviewResponse>(
  "UpdateKxDataviewResponse",
)({
  environmentId: S.optional(S.String),
  databaseName: S.optional(S.String),
  dataviewName: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  activeVersions: S.optional(KxDataviewActiveVersionList),
  status: S.optional(S.String),
  autoUpdate: S.optional(S.Boolean),
  readWrite: S.optional(S.Boolean),
  description: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class UpdateKxEnvironmentResponse extends S.Class<UpdateKxEnvironmentResponse>(
  "UpdateKxEnvironmentResponse",
)({
  name: S.optional(S.String),
  environmentId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  status: S.optional(S.String),
  tgwStatus: S.optional(S.String),
  dnsStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dedicatedServiceAccountId: S.optional(S.String),
  transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
  customDNSConfiguration: S.optional(CustomDNSConfiguration),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  updateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
}) {}
export class UpdateKxUserResponse extends S.Class<UpdateKxUserResponse>(
  "UpdateKxUserResponse",
)({
  userName: S.optional(S.String),
  userArn: S.optional(S.String),
  environmentId: S.optional(S.String),
  iamRole: S.optional(S.String),
}) {}
export class KxAttachedCluster extends S.Class<KxAttachedCluster>(
  "KxAttachedCluster",
)({
  clusterName: S.optional(S.String),
  clusterType: S.optional(S.String),
  clusterStatus: S.optional(S.String),
}) {}
export const KxAttachedClusters = S.Array(KxAttachedCluster);
export class UpdateKxVolumeResponse extends S.Class<UpdateKxVolumeResponse>(
  "UpdateKxVolumeResponse",
)({
  environmentId: S.optional(S.String),
  volumeName: S.optional(S.String),
  volumeType: S.optional(S.String),
  volumeArn: S.optional(S.String),
  nas1Configuration: S.optional(KxNAS1Configuration),
  status: S.optional(S.String),
  description: S.optional(S.String),
  statusReason: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  azMode: S.optional(S.String),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  attachedClusters: S.optional(KxAttachedClusters),
}) {}
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  errorMessage: S.optional(S.String),
  errorType: S.optional(S.String),
}) {}
export class Volume extends S.Class<Volume>("Volume")({
  volumeName: S.optional(S.String),
  volumeType: S.optional(S.String),
}) {}
export const Volumes = S.Array(Volume);
export class KxChangesetListEntry extends S.Class<KxChangesetListEntry>(
  "KxChangesetListEntry",
)({
  changesetId: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  activeFromTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
}) {}
export const KxChangesets = S.Array(KxChangesetListEntry);
export class KxNode extends S.Class<KxNode>("KxNode")({
  nodeId: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  launchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export const KxNodeSummaries = S.Array(KxNode);
export class KxCluster extends S.Class<KxCluster>("KxCluster")({
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  clusterName: S.optional(S.String),
  clusterType: S.optional(S.String),
  clusterDescription: S.optional(S.String),
  releaseLabel: S.optional(S.String),
  volumes: S.optional(Volumes),
  initializationScript: S.optional(S.String),
  executionRole: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const KxClusters = S.Array(KxCluster);
export class KxDatabaseListEntry extends S.Class<KxDatabaseListEntry>(
  "KxDatabaseListEntry",
)({
  databaseName: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const KxDatabases = S.Array(KxDatabaseListEntry);
export class KxDataviewListEntry extends S.Class<KxDataviewListEntry>(
  "KxDataviewListEntry",
)({
  environmentId: S.optional(S.String),
  databaseName: S.optional(S.String),
  dataviewName: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  activeVersions: S.optional(KxDataviewActiveVersionList),
  status: S.optional(S.String),
  description: S.optional(S.String),
  autoUpdate: S.optional(S.Boolean),
  readWrite: S.optional(S.Boolean),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  statusReason: S.optional(S.String),
}) {}
export const KxDataviews = S.Array(KxDataviewListEntry);
export class KxEnvironment extends S.Class<KxEnvironment>("KxEnvironment")({
  name: S.optional(S.String),
  environmentId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  status: S.optional(S.String),
  tgwStatus: S.optional(S.String),
  dnsStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dedicatedServiceAccountId: S.optional(S.String),
  transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
  customDNSConfiguration: S.optional(CustomDNSConfiguration),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  updateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  certificateAuthorityArn: S.optional(S.String),
}) {}
export const KxEnvironmentList = S.Array(KxEnvironment);
export class KxScalingGroup extends S.Class<KxScalingGroup>("KxScalingGroup")({
  scalingGroupName: S.optional(S.String),
  hostType: S.optional(S.String),
  clusters: S.optional(KxClusterNameList),
  availabilityZoneId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const KxScalingGroupList = S.Array(KxScalingGroup);
export class KxUser extends S.Class<KxUser>("KxUser")({
  userArn: S.optional(S.String),
  userName: S.optional(S.String),
  iamRole: S.optional(S.String),
  createTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const KxUserList = S.Array(KxUser);
export class KxVolume extends S.Class<KxVolume>("KxVolume")({
  volumeName: S.optional(S.String),
  volumeType: S.optional(S.String),
  status: S.optional(S.String),
  description: S.optional(S.String),
  statusReason: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const KxVolumes = S.Array(KxVolume);
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    federationMode: S.optional(S.String),
    federationParameters: S.optional(FederationParameters),
    superuserParameters: S.optional(SuperuserParameters),
    dataBundles: S.optional(DataBundleArns),
  },
  T.all(
    T.Http({ method: "POST", uri: "/environment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxChangesetResponse extends S.Class<CreateKxChangesetResponse>(
  "CreateKxChangesetResponse",
)({
  changesetId: S.optional(S.String),
  databaseName: S.optional(S.String),
  environmentId: S.optional(S.String),
  changeRequests: S.optional(ChangeRequests),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  errorInfo: S.optional(ErrorInfo),
}) {}
export class CreateKxClusterRequest extends S.Class<CreateKxClusterRequest>(
  "CreateKxClusterRequest",
)(
  {
    clientToken: S.optional(S.String),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    clusterName: S.String,
    clusterType: S.String,
    tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
    databases: S.optional(KxDatabaseConfigurations),
    cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
    autoScalingConfiguration: S.optional(AutoScalingConfiguration),
    clusterDescription: S.optional(S.String),
    capacityConfiguration: S.optional(CapacityConfiguration),
    releaseLabel: S.String,
    vpcConfiguration: VpcConfiguration,
    initializationScript: S.optional(S.String),
    commandLineArguments: S.optional(KxCommandLineArguments),
    code: S.optional(CodeConfiguration),
    executionRole: S.optional(S.String),
    savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
    azMode: S.String,
    availabilityZoneId: S.optional(S.String),
    tags: S.optional(TagMap),
    scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/kx/environments/{environmentId}/clusters",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateKxDataviewResponse extends S.Class<CreateKxDataviewResponse>(
  "CreateKxDataviewResponse",
)({
  dataviewName: S.optional(S.String),
  databaseName: S.optional(S.String),
  environmentId: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  description: S.optional(S.String),
  autoUpdate: S.optional(S.Boolean),
  readWrite: S.optional(S.Boolean),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
}) {}
export class CreateKxVolumeResponse extends S.Class<CreateKxVolumeResponse>(
  "CreateKxVolumeResponse",
)({
  environmentId: S.optional(S.String),
  volumeName: S.optional(S.String),
  volumeType: S.optional(S.String),
  volumeArn: S.optional(S.String),
  nas1Configuration: S.optional(KxNAS1Configuration),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  azMode: S.optional(S.String),
  description: S.optional(S.String),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetEnvironmentResponse extends S.Class<GetEnvironmentResponse>(
  "GetEnvironmentResponse",
)({ environment: S.optional(Environment) }) {}
export class GetKxChangesetResponse extends S.Class<GetKxChangesetResponse>(
  "GetKxChangesetResponse",
)({
  changesetId: S.optional(S.String),
  databaseName: S.optional(S.String),
  environmentId: S.optional(S.String),
  changeRequests: S.optional(ChangeRequests),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  activeFromTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  errorInfo: S.optional(ErrorInfo),
}) {}
export class GetKxClusterResponse extends S.Class<GetKxClusterResponse>(
  "GetKxClusterResponse",
)({
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  clusterName: S.optional(S.String),
  clusterType: S.optional(S.String),
  tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
  volumes: S.optional(Volumes),
  databases: S.optional(KxDatabaseConfigurations),
  cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
  autoScalingConfiguration: S.optional(AutoScalingConfiguration),
  clusterDescription: S.optional(S.String),
  capacityConfiguration: S.optional(CapacityConfiguration),
  releaseLabel: S.optional(S.String),
  vpcConfiguration: S.optional(VpcConfiguration),
  initializationScript: S.optional(S.String),
  commandLineArguments: S.optional(KxCommandLineArguments),
  code: S.optional(CodeConfiguration),
  executionRole: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
}) {}
export class GetKxDataviewResponse extends S.Class<GetKxDataviewResponse>(
  "GetKxDataviewResponse",
)({
  databaseName: S.optional(S.String),
  dataviewName: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  changesetId: S.optional(S.String),
  segmentConfigurations: S.optional(KxDataviewSegmentConfigurationList),
  activeVersions: S.optional(KxDataviewActiveVersionList),
  description: S.optional(S.String),
  autoUpdate: S.optional(S.Boolean),
  readWrite: S.optional(S.Boolean),
  environmentId: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class GetKxVolumeResponse extends S.Class<GetKxVolumeResponse>(
  "GetKxVolumeResponse",
)({
  environmentId: S.optional(S.String),
  volumeName: S.optional(S.String),
  volumeType: S.optional(S.String),
  volumeArn: S.optional(S.String),
  nas1Configuration: S.optional(KxNAS1Configuration),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  description: S.optional(S.String),
  azMode: S.optional(S.String),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  attachedClusters: S.optional(KxAttachedClusters),
}) {}
export class ListKxChangesetsResponse extends S.Class<ListKxChangesetsResponse>(
  "ListKxChangesetsResponse",
)({
  kxChangesets: S.optional(KxChangesets),
  nextToken: S.optional(S.String),
}) {}
export class ListKxClusterNodesResponse extends S.Class<ListKxClusterNodesResponse>(
  "ListKxClusterNodesResponse",
)({ nodes: S.optional(KxNodeSummaries), nextToken: S.optional(S.String) }) {}
export class ListKxClustersResponse extends S.Class<ListKxClustersResponse>(
  "ListKxClustersResponse",
)({
  kxClusterSummaries: S.optional(KxClusters),
  nextToken: S.optional(S.String),
}) {}
export class ListKxDatabasesResponse extends S.Class<ListKxDatabasesResponse>(
  "ListKxDatabasesResponse",
)({ kxDatabases: S.optional(KxDatabases), nextToken: S.optional(S.String) }) {}
export class ListKxDataviewsResponse extends S.Class<ListKxDataviewsResponse>(
  "ListKxDataviewsResponse",
)({ kxDataviews: S.optional(KxDataviews), nextToken: S.optional(S.String) }) {}
export class ListKxEnvironmentsResponse extends S.Class<ListKxEnvironmentsResponse>(
  "ListKxEnvironmentsResponse",
)({
  environments: S.optional(KxEnvironmentList),
  nextToken: S.optional(S.String),
}) {}
export class ListKxScalingGroupsResponse extends S.Class<ListKxScalingGroupsResponse>(
  "ListKxScalingGroupsResponse",
)({
  scalingGroups: S.optional(KxScalingGroupList),
  nextToken: S.optional(S.String),
}) {}
export class ListKxUsersResponse extends S.Class<ListKxUsersResponse>(
  "ListKxUsersResponse",
)({ users: S.optional(KxUserList), nextToken: S.optional(S.String) }) {}
export class ListKxVolumesResponse extends S.Class<ListKxVolumesResponse>(
  "ListKxVolumesResponse",
)({
  kxVolumeSummaries: S.optional(KxVolumes),
  nextToken: S.optional(S.String),
}) {}
export class CreateEnvironmentResponse extends S.Class<CreateEnvironmentResponse>(
  "CreateEnvironmentResponse",
)({
  environmentId: S.optional(S.String),
  environmentArn: S.optional(S.String),
  environmentUrl: S.optional(S.String),
}) {}
export class CreateKxClusterResponse extends S.Class<CreateKxClusterResponse>(
  "CreateKxClusterResponse",
)({
  environmentId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  clusterName: S.optional(S.String),
  clusterType: S.optional(S.String),
  tickerplantLogConfiguration: S.optional(TickerplantLogConfiguration),
  volumes: S.optional(Volumes),
  databases: S.optional(KxDatabaseConfigurations),
  cacheStorageConfigurations: S.optional(KxCacheStorageConfigurations),
  autoScalingConfiguration: S.optional(AutoScalingConfiguration),
  clusterDescription: S.optional(S.String),
  capacityConfiguration: S.optional(CapacityConfiguration),
  releaseLabel: S.optional(S.String),
  vpcConfiguration: S.optional(VpcConfiguration),
  initializationScript: S.optional(S.String),
  commandLineArguments: S.optional(KxCommandLineArguments),
  code: S.optional(CodeConfiguration),
  executionRole: S.optional(S.String),
  lastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  savedownStorageConfiguration: S.optional(KxSavedownStorageConfiguration),
  azMode: S.optional(S.String),
  availabilityZoneId: S.optional(S.String),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  scalingGroupConfiguration: S.optional(KxScalingGroupConfiguration),
}) {}
export class UpdateKxEnvironmentNetworkRequest extends S.Class<UpdateKxEnvironmentNetworkRequest>(
  "UpdateKxEnvironmentNetworkRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
    customDNSConfiguration: S.optional(CustomDNSConfiguration),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/kx/environments/{environmentId}/network" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKxEnvironmentNetworkResponse extends S.Class<UpdateKxEnvironmentNetworkResponse>(
  "UpdateKxEnvironmentNetworkResponse",
)({
  name: S.optional(S.String),
  environmentId: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  status: S.optional(S.String),
  tgwStatus: S.optional(S.String),
  dnsStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
  description: S.optional(S.String),
  environmentArn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dedicatedServiceAccountId: S.optional(S.String),
  transitGatewayConfiguration: S.optional(TransitGatewayConfiguration),
  customDNSConfiguration: S.optional(CustomDNSConfiguration),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  updateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  availabilityZoneIds: S.optional(AvailabilityZoneIds),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * A list of all of your FinSpace environments.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Removes metadata tags from a FinSpace resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * A list of all tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the FinSpace environment object.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves all the information for the specified kdb environment.
 */
export const getKxEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxEnvironmentRequest,
  output: GetKxEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds metadata tags to a FinSpace resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of kdb environments created in an account.
 */
export const listKxEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKxEnvironmentsRequest,
    output: ListKxEnvironmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Update your FinSpace environment.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified dataview. The dataviews get automatically updated when any new changesets are ingested. Each update of the dataview creates a new version, including changeset details and cache configurations
 */
export const updateKxDataview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxDataviewRequest,
  output: UpdateKxDataviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the nodes in a kdb cluster.
 */
export const listKxClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKxClusterNodesRequest,
    output: ListKxClusterNodesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of clusters.
 */
export const listKxClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxClustersRequest,
  output: ListKxClustersResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of scaling groups in a kdb environment.
 */
export const listKxScalingGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListKxScalingGroupsRequest,
    output: ListKxScalingGroupsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all the volumes in a kdb environment.
 */
export const listKxVolumes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxVolumesRequest,
  output: ListKxVolumesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of a scaling group.
 */
export const getKxScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxScalingGroupRequest,
  output: GetKxScalingGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to update code configuration on a running cluster. By using this API you can update the code, the initialization script path, and the command line arguments for a specific cluster.
 * The configuration that you want to update will override any existing configurations on the cluster.
 */
export const updateKxClusterCodeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateKxClusterCodeConfigurationRequest,
    output: UpdateKxClusterCodeConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the databases mounted on a kdb cluster, which includes the `changesetId` and all the dbPaths to be cached. This API does not allow you to change a database name or add a database if you created a cluster without one.
 *
 * Using this API you can point a cluster to a different changeset and modify a list of partitions being cached.
 */
export const updateKxClusterDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateKxClusterDatabasesRequest,
    output: UpdateKxClusterDatabasesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the user details. You can only update the IAM role associated with a user.
 */
export const updateKxUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxUserRequest,
  output: UpdateKxUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the throughput or capacity of a volume. During the update process, the filesystem
 * might be unavailable for a few minutes. You can retry any operations after the update is complete.
 */
export const updateKxVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxVolumeRequest,
  output: UpdateKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a kdb cluster.
 */
export const deleteKxCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxClusterRequest,
  output: DeleteKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified scaling group. This action is irreversible. You cannot delete a scaling group until all the clusters running on it have been deleted.
 */
export const deleteKxScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteKxScalingGroupRequest,
    output: DeleteKxScalingGroupResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a volume. You can only delete a volume if it's not attached to a cluster or a dataview. When a volume is deleted, any data on the volume is lost. This action is irreversible.
 */
export const deleteKxVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxVolumeRequest,
  output: DeleteKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new kdb database in the environment.
 */
export const createKxDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxDatabaseRequest,
  output: CreateKxDatabaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new scaling group.
 */
export const createKxScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateKxScalingGroupRequest,
    output: CreateKxScalingGroupResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a user in FinSpace kdb environment with an associated IAM role.
 */
export const createKxUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxUserRequest,
  output: CreateKxUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a changeset for a kdb database. A changeset allows you to add and delete existing files by using an ordered list of change requests.
 */
export const createKxChangeset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxChangesetRequest,
  output: CreateKxChangesetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of kdb database with tiered storage capabilities and a pre-warmed cache, ready for mounting on kdb clusters. Dataviews are only available for clusters running on a scaling group. They are not supported on dedicated clusters.
 */
export const createKxDataview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxDataviewRequest,
  output: CreateKxDataviewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new volume with a specific amount of throughput and storage capacity.
 */
export const createKxVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxVolumeRequest,
  output: CreateKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a kdb cluster.
 */
export const getKxCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxClusterRequest,
  output: GetKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new kdb cluster.
 */
export const createKxCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxClusterRequest,
  output: CreateKxClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates information for the given kdb database.
 */
export const updateKxDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxDatabaseRequest,
  output: UpdateKxDatabaseResponse,
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
 * Updates information for the given kdb environment.
 */
export const updateKxEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKxEnvironmentRequest,
  output: UpdateKxEnvironmentResponse,
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
 * Deletes the specified database and all of its associated data. This action is irreversible. You must copy any data out of the database before deleting it if the data is to be retained.
 */
export const deleteKxDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxDatabaseRequest,
  output: DeleteKxDatabaseResponse,
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
 * Deletes the specified dataview. Before deleting a dataview, make sure that it is not in use by any cluster.
 */
export const deleteKxDataview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxDataviewRequest,
  output: DeleteKxDataviewResponse,
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
 * Deletes the kdb environment. This action is irreversible. Deleting a kdb environment will remove all the associated data and any services running in it.
 */
export const deleteKxEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxEnvironmentRequest,
  output: DeleteKxEnvironmentResponse,
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
 * Deletes a user in the specified kdb environment.
 */
export const deleteKxUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxUserRequest,
  output: DeleteKxUserResponse,
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
 * Deletes the specified nodes from a cluster.
 */
export const deleteKxClusterNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKxClusterNodeRequest,
  output: DeleteKxClusterNodeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an FinSpace environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a connection string for a user to connect to a kdb cluster. You must call this API using the same role that you have defined while creating a user.
 */
export const getKxConnectionString = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetKxConnectionStringRequest,
    output: GetKxConnectionStringResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns database information for the specified environment ID.
 */
export const getKxDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxDatabaseRequest,
  output: GetKxDatabaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified kdb user.
 */
export const getKxUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxUserRequest,
  output: GetKxUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a kdb changeset.
 */
export const getKxChangeset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxChangesetRequest,
  output: GetKxChangesetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the dataview.
 */
export const getKxDataview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxDataviewRequest,
  output: GetKxDataviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all the changesets for a database.
 */
export const listKxChangesets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKxChangesetsRequest,
    output: ListKxChangesetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of all the databases in the kdb environment.
 */
export const listKxDatabases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKxDatabasesRequest,
    output: ListKxDatabasesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of all the dataviews in the database.
 */
export const listKxDataviews = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListKxDataviewsRequest,
    output: ListKxDataviewsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all the users in a kdb environment.
 */
export const listKxUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListKxUsersRequest,
  output: ListKxUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the information about the volume.
 */
export const getKxVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKxVolumeRequest,
  output: GetKxVolumeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates environment network to connect to your internal network by using a transit gateway. This API supports request to create a transit gateway attachment from FinSpace VPC to your transit gateway ID and create a custom Route-53 outbound resolvers.
 *
 * Once you send a request to update a network, you cannot change it again. Network update might require termination of any clusters that are running in the existing network.
 */
export const updateKxEnvironmentNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateKxEnvironmentNetworkRequest,
    output: UpdateKxEnvironmentNetworkResponse,
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
 * Creates a managed kdb environment for the account.
 */
export const createKxEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKxEnvironmentRequest,
  output: CreateKxEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a new FinSpace environment.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

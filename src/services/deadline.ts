import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "deadline",
  serviceShapeName: "Deadline",
});
const auth = T.AwsAuthSigv4({ name: "deadline" });
const ver = T.ServiceVersion("2023-10-12");
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
                                url: "https://deadline-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://deadline-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://deadline.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://deadline.{Region}.{PartitionResult#dnsSuffix}",
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
export const QueueIds = S.Array(S.String);
export const FleetIds = S.Array(S.String);
export const UsageGroupBy = S.Array(S.String);
export const UsageStatistics = S.Array(S.String);
export const StringList = S.Array(S.String);
export const RequiredFileSystemLocationNames = S.Array(S.String);
export const AllowedStorageProfileIds = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class CreateQueueFleetAssociationRequest extends S.Class<CreateQueueFleetAssociationRequest>(
  "CreateQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String,
    fleetId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueFleetAssociationResponse extends S.Class<CreateQueueFleetAssociationResponse>(
  "CreateQueueFleetAssociationResponse",
)({}) {}
export class CreateQueueLimitAssociationRequest extends S.Class<CreateQueueLimitAssociationRequest>(
  "CreateQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String,
    limitId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueLimitAssociationResponse extends S.Class<CreateQueueLimitAssociationResponse>(
  "CreateQueueLimitAssociationResponse",
)({}) {}
export class DeleteQueueFleetAssociationRequest extends S.Class<DeleteQueueFleetAssociationRequest>(
  "DeleteQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueFleetAssociationResponse extends S.Class<DeleteQueueFleetAssociationResponse>(
  "DeleteQueueFleetAssociationResponse",
)({}) {}
export class DeleteQueueLimitAssociationRequest extends S.Class<DeleteQueueLimitAssociationRequest>(
  "DeleteQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueLimitAssociationResponse extends S.Class<DeleteQueueLimitAssociationResponse>(
  "DeleteQueueLimitAssociationResponse",
)({}) {}
export class GetQueueFleetAssociationRequest extends S.Class<GetQueueFleetAssociationRequest>(
  "GetQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueueLimitAssociationRequest extends S.Class<GetQueueLimitAssociationRequest>(
  "GetQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionsStatisticsAggregationRequest extends S.Class<GetSessionsStatisticsAggregationRequest>(
  "GetSessionsStatisticsAggregationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    aggregationId: S.String.pipe(T.HttpQuery("aggregationId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/sessions-statistics-aggregation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAvailableMeteredProductsRequest extends S.Class<ListAvailableMeteredProductsRequest>(
  "ListAvailableMeteredProductsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/metered-products" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueFleetAssociationsRequest extends S.Class<ListQueueFleetAssociationsRequest>(
  "ListQueueFleetAssociationsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    fleetId: S.optional(S.String).pipe(T.HttpQuery("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueLimitAssociationsRequest extends S.Class<ListQueueLimitAssociationsRequest>(
  "ListQueueLimitAssociationsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    limitId: S.optional(S.String).pipe(T.HttpQuery("limitId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations",
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
    T.Http({ method: "GET", uri: "/2023-10-12/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchGroupedFilterExpressions extends S.Class<SearchGroupedFilterExpressions>(
  "SearchGroupedFilterExpressions",
)({ filters: S.suspend(() => SearchFilterExpressions), operator: S.String }) {}
export class UserJobsFirst extends S.Class<UserJobsFirst>("UserJobsFirst")({
  userIdentityId: S.String,
}) {}
export class FieldSortExpression extends S.Class<FieldSortExpression>(
  "FieldSortExpression",
)({ sortOrder: S.String, name: S.String }) {}
export class ParameterSortExpression extends S.Class<ParameterSortExpression>(
  "ParameterSortExpression",
)({ sortOrder: S.String, name: S.String }) {}
export const SearchSortExpression = S.Union(
  S.Struct({ userJobsFirst: UserJobsFirst }),
  S.Struct({ fieldSort: FieldSortExpression }),
  S.Struct({ parameterSort: ParameterSortExpression }),
);
export const SearchSortExpressions = S.Array(SearchSortExpression);
export class SearchStepsRequest extends S.Class<SearchStepsRequest>(
  "SearchStepsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/steps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchTasksRequest extends S.Class<SearchTasksRequest>(
  "SearchTasksRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchWorkersRequest extends S.Class<SearchWorkersRequest>(
  "SearchWorkersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetIds: FleetIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/search/workers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: StringList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/2023-10-12/tags/{resourceArn}" }),
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
export class UpdateQueueFleetAssociationRequest extends S.Class<UpdateQueueFleetAssociationRequest>(
  "UpdateQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueFleetAssociationResponse extends S.Class<UpdateQueueFleetAssociationResponse>(
  "UpdateQueueFleetAssociationResponse",
)({}) {}
export class UpdateQueueLimitAssociationRequest extends S.Class<UpdateQueueLimitAssociationRequest>(
  "UpdateQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueLimitAssociationResponse extends S.Class<UpdateQueueLimitAssociationResponse>(
  "UpdateQueueLimitAssociationResponse",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateFarmRequest extends S.Class<CreateFarmRequest>(
  "CreateFarmRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFarmRequest extends S.Class<GetFarmRequest>("GetFarmRequest")(
  { farmId: S.String.pipe(T.HttpLabel("farmId")) },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFarmRequest extends S.Class<UpdateFarmRequest>(
  "UpdateFarmRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/2023-10-12/farms/{farmId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFarmResponse extends S.Class<UpdateFarmResponse>(
  "UpdateFarmResponse",
)({}) {}
export class DeleteFarmRequest extends S.Class<DeleteFarmRequest>(
  "DeleteFarmRequest",
)(
  { farmId: S.String.pipe(T.HttpLabel("farmId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2023-10-12/farms/{farmId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFarmResponse extends S.Class<DeleteFarmResponse>(
  "DeleteFarmResponse",
)({}) {}
export class ListFarmsRequest extends S.Class<ListFarmsRequest>(
  "ListFarmsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToFarmRequest extends S.Class<AssociateMemberToFarmRequest>(
  "AssociateMemberToFarmRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToFarmResponse extends S.Class<AssociateMemberToFarmResponse>(
  "AssociateMemberToFarmResponse",
)({}) {}
export class CreateLimitRequest extends S.Class<CreateLimitRequest>(
  "CreateLimitRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    amountRequirementName: S.String,
    maxCount: S.Number,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/limits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLimitRequest extends S.Class<DeleteLimitRequest>(
  "DeleteLimitRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/limits/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLimitResponse extends S.Class<DeleteLimitResponse>(
  "DeleteLimitResponse",
)({}) {}
export class DeleteStorageProfileRequest extends S.Class<DeleteStorageProfileRequest>(
  "DeleteStorageProfileRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/storage-profiles/{storageProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStorageProfileResponse extends S.Class<DeleteStorageProfileResponse>(
  "DeleteStorageProfileResponse",
)({}) {}
export class DisassociateMemberFromFarmRequest extends S.Class<DisassociateMemberFromFarmRequest>(
  "DisassociateMemberFromFarmRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberFromFarmResponse extends S.Class<DisassociateMemberFromFarmResponse>(
  "DisassociateMemberFromFarmResponse",
)({}) {}
export class GetLimitRequest extends S.Class<GetLimitRequest>(
  "GetLimitRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/limits/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStorageProfileRequest extends S.Class<GetStorageProfileRequest>(
  "GetStorageProfileRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/storage-profiles/{storageProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFarmMembersRequest extends S.Class<ListFarmMembersRequest>(
  "ListFarmMembersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLimitsRequest extends S.Class<ListLimitsRequest>(
  "ListLimitsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/limits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStorageProfilesRequest extends S.Class<ListStorageProfilesRequest>(
  "ListStorageProfilesRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/storage-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLimitRequest extends S.Class<UpdateLimitRequest>(
  "UpdateLimitRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    maxCount: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/limits/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLimitResponse extends S.Class<UpdateLimitResponse>(
  "UpdateLimitResponse",
)({}) {}
export class FileSystemLocation extends S.Class<FileSystemLocation>(
  "FileSystemLocation",
)({ name: S.String, path: S.String, type: S.String }) {}
export const FileSystemLocationsList = S.Array(FileSystemLocation);
export class UpdateStorageProfileRequest extends S.Class<UpdateStorageProfileRequest>(
  "UpdateStorageProfileRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
    displayName: S.optional(S.String),
    osFamily: S.optional(S.String),
    fileSystemLocationsToAdd: S.optional(FileSystemLocationsList),
    fileSystemLocationsToRemove: S.optional(FileSystemLocationsList),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/storage-profiles/{storageProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStorageProfileResponse extends S.Class<UpdateStorageProfileResponse>(
  "UpdateStorageProfileResponse",
)({}) {}
export class GetBudgetRequest extends S.Class<GetBudgetRequest>(
  "GetBudgetRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/budgets/{budgetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBudgetRequest extends S.Class<DeleteBudgetRequest>(
  "DeleteBudgetRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/budgets/{budgetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBudgetResponse extends S.Class<DeleteBudgetResponse>(
  "DeleteBudgetResponse",
)({}) {}
export class ListBudgetsRequest extends S.Class<ListBudgetsRequest>(
  "ListBudgetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/budgets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFleetRequest extends S.Class<GetFleetRequest>(
  "GetFleetRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VCpuCountRange extends S.Class<VCpuCountRange>("VCpuCountRange")({
  min: S.Number,
  max: S.optional(S.Number),
}) {}
export class MemoryMiBRange extends S.Class<MemoryMiBRange>("MemoryMiBRange")({
  min: S.Number,
  max: S.optional(S.Number),
}) {}
export const AcceleratorTypes = S.Array(S.String);
export class AcceleratorCountRange extends S.Class<AcceleratorCountRange>(
  "AcceleratorCountRange",
)({ min: S.Number, max: S.optional(S.Number) }) {}
export class AcceleratorTotalMemoryMiBRange extends S.Class<AcceleratorTotalMemoryMiBRange>(
  "AcceleratorTotalMemoryMiBRange",
)({ min: S.Number, max: S.optional(S.Number) }) {}
export class FleetAmountCapability extends S.Class<FleetAmountCapability>(
  "FleetAmountCapability",
)({ name: S.String, min: S.Number, max: S.optional(S.Number) }) {}
export const CustomFleetAmountCapabilities = S.Array(FleetAmountCapability);
export const AttributeCapabilityValuesList = S.Array(S.String);
export class FleetAttributeCapability extends S.Class<FleetAttributeCapability>(
  "FleetAttributeCapability",
)({ name: S.String, values: AttributeCapabilityValuesList }) {}
export const CustomFleetAttributeCapabilities = S.Array(
  FleetAttributeCapability,
);
export class CustomerManagedWorkerCapabilities extends S.Class<CustomerManagedWorkerCapabilities>(
  "CustomerManagedWorkerCapabilities",
)({
  vCpuCount: VCpuCountRange,
  memoryMiB: MemoryMiBRange,
  acceleratorTypes: S.optional(AcceleratorTypes),
  acceleratorCount: S.optional(AcceleratorCountRange),
  acceleratorTotalMemoryMiB: S.optional(AcceleratorTotalMemoryMiBRange),
  osFamily: S.String,
  cpuArchitectureType: S.String,
  customAmounts: S.optional(CustomFleetAmountCapabilities),
  customAttributes: S.optional(CustomFleetAttributeCapabilities),
}) {}
export class CustomerManagedFleetConfiguration extends S.Class<CustomerManagedFleetConfiguration>(
  "CustomerManagedFleetConfiguration",
)({
  mode: S.String,
  workerCapabilities: CustomerManagedWorkerCapabilities,
  storageProfileId: S.optional(S.String),
  tagPropagationMode: S.optional(S.String),
}) {}
export class Ec2EbsVolume extends S.Class<Ec2EbsVolume>("Ec2EbsVolume")({
  sizeGiB: S.optional(S.Number),
  iops: S.optional(S.Number),
  throughputMiB: S.optional(S.Number),
}) {}
export class AcceleratorSelection extends S.Class<AcceleratorSelection>(
  "AcceleratorSelection",
)({ name: S.String, runtime: S.optional(S.String) }) {}
export const AcceleratorSelections = S.Array(AcceleratorSelection);
export class AcceleratorCapabilities extends S.Class<AcceleratorCapabilities>(
  "AcceleratorCapabilities",
)({
  selections: AcceleratorSelections,
  count: S.optional(AcceleratorCountRange),
}) {}
export const InstanceTypes = S.Array(S.String);
export class ServiceManagedEc2InstanceCapabilities extends S.Class<ServiceManagedEc2InstanceCapabilities>(
  "ServiceManagedEc2InstanceCapabilities",
)({
  vCpuCount: VCpuCountRange,
  memoryMiB: MemoryMiBRange,
  osFamily: S.String,
  cpuArchitectureType: S.String,
  rootEbsVolume: S.optional(Ec2EbsVolume),
  acceleratorCapabilities: S.optional(AcceleratorCapabilities),
  allowedInstanceTypes: S.optional(InstanceTypes),
  excludedInstanceTypes: S.optional(InstanceTypes),
  customAmounts: S.optional(CustomFleetAmountCapabilities),
  customAttributes: S.optional(CustomFleetAttributeCapabilities),
}) {}
export class ServiceManagedEc2InstanceMarketOptions extends S.Class<ServiceManagedEc2InstanceMarketOptions>(
  "ServiceManagedEc2InstanceMarketOptions",
)({ type: S.String }) {}
export const VpcResourceConfigurationArns = S.Array(S.String);
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({ resourceConfigurationArns: S.optional(VpcResourceConfigurationArns) }) {}
export class ServiceManagedEc2FleetConfiguration extends S.Class<ServiceManagedEc2FleetConfiguration>(
  "ServiceManagedEc2FleetConfiguration",
)({
  instanceCapabilities: ServiceManagedEc2InstanceCapabilities,
  instanceMarketOptions: ServiceManagedEc2InstanceMarketOptions,
  vpcConfiguration: S.optional(VpcConfiguration),
  storageProfileId: S.optional(S.String),
}) {}
export const FleetConfiguration = S.Union(
  S.Struct({ customerManaged: CustomerManagedFleetConfiguration }),
  S.Struct({ serviceManagedEc2: ServiceManagedEc2FleetConfiguration }),
);
export class HostConfiguration extends S.Class<HostConfiguration>(
  "HostConfiguration",
)({ scriptBody: S.String, scriptTimeoutSeconds: S.optional(S.Number) }) {}
export class UpdateFleetRequest extends S.Class<UpdateFleetRequest>(
  "UpdateFleetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
    minWorkerCount: S.optional(S.Number),
    maxWorkerCount: S.optional(S.Number),
    configuration: S.optional(FleetConfiguration),
    hostConfiguration: S.optional(HostConfiguration),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFleetResponse extends S.Class<UpdateFleetResponse>(
  "UpdateFleetResponse",
)({}) {}
export class DeleteFleetRequest extends S.Class<DeleteFleetRequest>(
  "DeleteFleetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFleetResponse extends S.Class<DeleteFleetResponse>(
  "DeleteFleetResponse",
)({}) {}
export class ListFleetsRequest extends S.Class<ListFleetsRequest>(
  "ListFleetsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    displayName: S.optional(S.String).pipe(T.HttpQuery("displayName")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/fleets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToFleetRequest extends S.Class<AssociateMemberToFleetRequest>(
  "AssociateMemberToFleetRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToFleetResponse extends S.Class<AssociateMemberToFleetResponse>(
  "AssociateMemberToFleetResponse",
)({}) {}
export class AssumeFleetRoleForReadRequest extends S.Class<AssumeFleetRoleForReadRequest>(
  "AssumeFleetRoleForReadRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/read-roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberFromFleetRequest extends S.Class<DisassociateMemberFromFleetRequest>(
  "DisassociateMemberFromFleetRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberFromFleetResponse extends S.Class<DisassociateMemberFromFleetResponse>(
  "DisassociateMemberFromFleetResponse",
)({}) {}
export class ListFleetMembersRequest extends S.Class<ListFleetMembersRequest>(
  "ListFleetMembersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkerRequest extends S.Class<GetWorkerRequest>(
  "GetWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkerRequest extends S.Class<DeleteWorkerRequest>(
  "DeleteWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkerResponse extends S.Class<DeleteWorkerResponse>(
  "DeleteWorkerResponse",
)({}) {}
export class ListWorkersRequest extends S.Class<ListWorkersRequest>(
  "ListWorkersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssumeFleetRoleForWorkerRequest extends S.Class<AssumeFleetRoleForWorkerRequest>(
  "AssumeFleetRoleForWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}/fleet-roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssumeQueueRoleForWorkerRequest extends S.Class<AssumeQueueRoleForWorkerRequest>(
  "AssumeQueueRoleForWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    queueId: S.String.pipe(T.HttpQuery("queueId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}/queue-roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsForWorkerRequest extends S.Class<ListSessionsForWorkerRequest>(
  "ListSessionsForWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}/sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueueRequest extends S.Class<GetQueueRequest>(
  "GetQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JobAttachmentSettings extends S.Class<JobAttachmentSettings>(
  "JobAttachmentSettings",
)({ s3BucketName: S.String, rootPrefix: S.String }) {}
export class PosixUser extends S.Class<PosixUser>("PosixUser")({
  user: S.String,
  group: S.String,
}) {}
export class WindowsUser extends S.Class<WindowsUser>("WindowsUser")({
  user: S.String,
  passwordArn: S.String,
}) {}
export class JobRunAsUser extends S.Class<JobRunAsUser>("JobRunAsUser")({
  posix: S.optional(PosixUser),
  windows: S.optional(WindowsUser),
  runAs: S.String,
}) {}
export class UpdateQueueRequest extends S.Class<UpdateQueueRequest>(
  "UpdateQueueRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    defaultBudgetAction: S.optional(S.String),
    jobAttachmentSettings: S.optional(JobAttachmentSettings),
    roleArn: S.optional(S.String),
    jobRunAsUser: S.optional(JobRunAsUser),
    requiredFileSystemLocationNamesToAdd: S.optional(
      RequiredFileSystemLocationNames,
    ),
    requiredFileSystemLocationNamesToRemove: S.optional(
      RequiredFileSystemLocationNames,
    ),
    allowedStorageProfileIdsToAdd: S.optional(AllowedStorageProfileIds),
    allowedStorageProfileIdsToRemove: S.optional(AllowedStorageProfileIds),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueResponse extends S.Class<UpdateQueueResponse>(
  "UpdateQueueResponse",
)({}) {}
export class DeleteQueueRequest extends S.Class<DeleteQueueRequest>(
  "DeleteQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueResponse extends S.Class<DeleteQueueResponse>(
  "DeleteQueueResponse",
)({}) {}
export class ListQueuesRequest extends S.Class<ListQueuesRequest>(
  "ListQueuesRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/queues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToQueueRequest extends S.Class<AssociateMemberToQueueRequest>(
  "AssociateMemberToQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToQueueResponse extends S.Class<AssociateMemberToQueueResponse>(
  "AssociateMemberToQueueResponse",
)({}) {}
export class AssumeQueueRoleForReadRequest extends S.Class<AssumeQueueRoleForReadRequest>(
  "AssumeQueueRoleForReadRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/read-roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssumeQueueRoleForUserRequest extends S.Class<AssumeQueueRoleForUserRequest>(
  "AssumeQueueRoleForUserRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/user-roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueEnvironmentRequest extends S.Class<CreateQueueEnvironmentRequest>(
  "CreateQueueEnvironmentRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    priority: S.Number,
    templateType: S.String,
    template: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueEnvironmentRequest extends S.Class<DeleteQueueEnvironmentRequest>(
  "DeleteQueueEnvironmentRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/environments/{queueEnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueEnvironmentResponse extends S.Class<DeleteQueueEnvironmentResponse>(
  "DeleteQueueEnvironmentResponse",
)({}) {}
export class DisassociateMemberFromQueueRequest extends S.Class<DisassociateMemberFromQueueRequest>(
  "DisassociateMemberFromQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberFromQueueResponse extends S.Class<DisassociateMemberFromQueueResponse>(
  "DisassociateMemberFromQueueResponse",
)({}) {}
export class GetQueueEnvironmentRequest extends S.Class<GetQueueEnvironmentRequest>(
  "GetQueueEnvironmentRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/environments/{queueEnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStorageProfileForQueueRequest extends S.Class<GetStorageProfileForQueueRequest>(
  "GetStorageProfileForQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/storage-profiles/{storageProfileId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueEnvironmentsRequest extends S.Class<ListQueueEnvironmentsRequest>(
  "ListQueueEnvironmentsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/environments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueMembersRequest extends S.Class<ListQueueMembersRequest>(
  "ListQueueMembersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStorageProfilesForQueueRequest extends S.Class<ListStorageProfilesForQueueRequest>(
  "ListStorageProfilesForQueueRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/storage-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueEnvironmentRequest extends S.Class<UpdateQueueEnvironmentRequest>(
  "UpdateQueueEnvironmentRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
    priority: S.optional(S.Number),
    templateType: S.optional(S.String),
    template: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/environments/{queueEnvironmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueEnvironmentResponse extends S.Class<UpdateQueueEnvironmentResponse>(
  "UpdateQueueEnvironmentResponse",
)({}) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateJobRequest extends S.Class<UpdateJobRequest>(
  "UpdateJobRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    targetTaskRunStatus: S.optional(S.String),
    priority: S.optional(S.Number),
    maxFailedTasksCount: S.optional(S.Number),
    maxRetriesPerTask: S.optional(S.Number),
    lifecycleStatus: S.optional(S.String),
    maxWorkerCount: S.optional(S.Number),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateJobResponse extends S.Class<UpdateJobResponse>(
  "UpdateJobResponse",
)({}) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToJobRequest extends S.Class<AssociateMemberToJobRequest>(
  "AssociateMemberToJobRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateMemberToJobResponse extends S.Class<AssociateMemberToJobResponse>(
  "AssociateMemberToJobResponse",
)({}) {}
export class DisassociateMemberFromJobRequest extends S.Class<DisassociateMemberFromJobRequest>(
  "DisassociateMemberFromJobRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/members/{principalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberFromJobResponse extends S.Class<DisassociateMemberFromJobResponse>(
  "DisassociateMemberFromJobResponse",
)({}) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionActionRequest extends S.Class<GetSessionActionRequest>(
  "GetSessionActionRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionActionId: S.String.pipe(T.HttpLabel("sessionActionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/session-actions/{sessionActionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStepRequest extends S.Class<GetStepRequest>("GetStepRequest")(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTaskRequest extends S.Class<GetTaskRequest>("GetTaskRequest")(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}/tasks/{taskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobMembersRequest extends S.Class<ListJobMembersRequest>(
  "ListJobMembersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobParameterDefinitionsRequest extends S.Class<ListJobParameterDefinitionsRequest>(
  "ListJobParameterDefinitionsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/parameter-definitions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionActionsRequest extends S.Class<ListSessionActionsRequest>(
  "ListSessionActionsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    taskId: S.optional(S.String).pipe(T.HttpQuery("taskId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/session-actions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStepConsumersRequest extends S.Class<ListStepConsumersRequest>(
  "ListStepConsumersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}/consumers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStepDependenciesRequest extends S.Class<ListStepDependenciesRequest>(
  "ListStepDependenciesRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}/dependencies",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStepsRequest extends S.Class<ListStepsRequest>(
  "ListStepsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTasksRequest extends S.Class<ListTasksRequest>(
  "ListTasksRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}/tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSessionRequest extends S.Class<UpdateSessionRequest>(
  "UpdateSessionRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    targetLifecycleStatus: S.String,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSessionResponse extends S.Class<UpdateSessionResponse>(
  "UpdateSessionResponse",
)({}) {}
export class UpdateStepRequest extends S.Class<UpdateStepRequest>(
  "UpdateStepRequest",
)(
  {
    targetTaskRunStatus: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStepResponse extends S.Class<UpdateStepResponse>(
  "UpdateStepResponse",
)({}) {}
export class UpdateTaskRequest extends S.Class<UpdateTaskRequest>(
  "UpdateTaskRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    targetRunStatus: S.String,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/steps/{stepId}/tasks/{taskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTaskResponse extends S.Class<UpdateTaskResponse>(
  "UpdateTaskResponse",
)({}) {}
export class CreateLicenseEndpointRequest extends S.Class<CreateLicenseEndpointRequest>(
  "CreateLicenseEndpointRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/license-endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLicenseEndpointRequest extends S.Class<GetLicenseEndpointRequest>(
  "GetLicenseEndpointRequest",
)(
  { licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/license-endpoints/{licenseEndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLicenseEndpointRequest extends S.Class<DeleteLicenseEndpointRequest>(
  "DeleteLicenseEndpointRequest",
)(
  { licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/license-endpoints/{licenseEndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLicenseEndpointResponse extends S.Class<DeleteLicenseEndpointResponse>(
  "DeleteLicenseEndpointResponse",
)({}) {}
export class ListLicenseEndpointsRequest extends S.Class<ListLicenseEndpointsRequest>(
  "ListLicenseEndpointsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/license-endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMeteredProductRequest extends S.Class<PutMeteredProductRequest>(
  "PutMeteredProductRequest",
)(
  {
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    productId: S.String.pipe(T.HttpLabel("productId")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/license-endpoints/{licenseEndpointId}/metered-products/{productId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMeteredProductResponse extends S.Class<PutMeteredProductResponse>(
  "PutMeteredProductResponse",
)({}) {}
export class DeleteMeteredProductRequest extends S.Class<DeleteMeteredProductRequest>(
  "DeleteMeteredProductRequest",
)(
  {
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    productId: S.String.pipe(T.HttpLabel("productId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/license-endpoints/{licenseEndpointId}/metered-products/{productId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMeteredProductResponse extends S.Class<DeleteMeteredProductResponse>(
  "DeleteMeteredProductResponse",
)({}) {}
export class ListMeteredProductsRequest extends S.Class<ListMeteredProductsRequest>(
  "ListMeteredProductsRequest",
)(
  {
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/license-endpoints/{licenseEndpointId}/metered-products",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMonitorRequest extends S.Class<CreateMonitorRequest>(
  "CreateMonitorRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    identityCenterInstanceArn: S.String,
    subdomain: S.String,
    roleArn: S.String,
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMonitorRequest extends S.Class<GetMonitorRequest>(
  "GetMonitorRequest",
)(
  { monitorId: S.String.pipe(T.HttpLabel("monitorId")) },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/monitors/{monitorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMonitorRequest extends S.Class<UpdateMonitorRequest>(
  "UpdateMonitorRequest",
)(
  {
    monitorId: S.String.pipe(T.HttpLabel("monitorId")),
    subdomain: S.optional(S.String),
    displayName: S.optional(S.String),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/2023-10-12/monitors/{monitorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMonitorResponse extends S.Class<UpdateMonitorResponse>(
  "UpdateMonitorResponse",
)({}) {}
export class DeleteMonitorRequest extends S.Class<DeleteMonitorRequest>(
  "DeleteMonitorRequest",
)(
  { monitorId: S.String.pipe(T.HttpLabel("monitorId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/2023-10-12/monitors/{monitorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorResponse extends S.Class<DeleteMonitorResponse>(
  "DeleteMonitorResponse",
)({}) {}
export class ListMonitorsRequest extends S.Class<ListMonitorsRequest>(
  "ListMonitorsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SessionsStatisticsResources = S.Union(
  S.Struct({ queueIds: QueueIds }),
  S.Struct({ fleetIds: FleetIds }),
);
export const UsageTrackingResource = S.Union(S.Struct({ queueId: S.String }));
export class BudgetActionToAdd extends S.Class<BudgetActionToAdd>(
  "BudgetActionToAdd",
)({
  type: S.String,
  thresholdPercentage: S.Number,
  description: S.optional(S.String),
}) {}
export const BudgetActionsToAdd = S.Array(BudgetActionToAdd);
export class BudgetActionToRemove extends S.Class<BudgetActionToRemove>(
  "BudgetActionToRemove",
)({ type: S.String, thresholdPercentage: S.Number }) {}
export const BudgetActionsToRemove = S.Array(BudgetActionToRemove);
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucketName: S.String,
  key: S.String,
}) {}
export const JobParameterDefinitions = S.Array(S.Any);
export const IpV4Addresses = S.Array(S.String);
export const IpV6Addresses = S.Array(S.String);
export const OutputRelativeDirectoriesList = S.Array(S.String);
export class GetQueueFleetAssociationResponse extends S.Class<GetQueueFleetAssociationResponse>(
  "GetQueueFleetAssociationResponse",
)({
  queueId: S.String,
  fleetId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class GetQueueLimitAssociationResponse extends S.Class<GetQueueLimitAssociationResponse>(
  "GetQueueLimitAssociationResponse",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  queueId: S.String,
  limitId: S.String,
  status: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class StartSessionsStatisticsAggregationRequest extends S.Class<StartSessionsStatisticsAggregationRequest>(
  "StartSessionsStatisticsAggregationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    resourceIds: SessionsStatisticsResources,
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    timezone: S.optional(S.String),
    period: S.optional(S.String),
    groupBy: UsageGroupBy,
    statistics: UsageStatistics,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/sessions-statistics-aggregation",
    }),
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
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/tags/{resourceArn}" }),
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
export class CreateFarmResponse extends S.Class<CreateFarmResponse>(
  "CreateFarmResponse",
)({ farmId: S.String }) {}
export class GetFarmResponse extends S.Class<GetFarmResponse>(
  "GetFarmResponse",
)({
  farmId: S.String,
  displayName: S.String,
  description: S.optional(S.String),
  kmsKeyArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class CreateLimitResponse extends S.Class<CreateLimitResponse>(
  "CreateLimitResponse",
)({ limitId: S.String }) {}
export class CreateStorageProfileRequest extends S.Class<CreateStorageProfileRequest>(
  "CreateStorageProfileRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    osFamily: S.String,
    fileSystemLocations: S.optional(FileSystemLocationsList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/storage-profiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLimitResponse extends S.Class<GetLimitResponse>(
  "GetLimitResponse",
)({
  displayName: S.String,
  amountRequirementName: S.String,
  maxCount: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  farmId: S.String,
  limitId: S.String,
  currentCount: S.Number,
  description: S.optional(S.String),
}) {}
export class GetStorageProfileResponse extends S.Class<GetStorageProfileResponse>(
  "GetStorageProfileResponse",
)({
  storageProfileId: S.String,
  displayName: S.String,
  osFamily: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  fileSystemLocations: S.optional(FileSystemLocationsList),
}) {}
export class FixedBudgetSchedule extends S.Class<FixedBudgetSchedule>(
  "FixedBudgetSchedule",
)({
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const BudgetSchedule = S.Union(S.Struct({ fixed: FixedBudgetSchedule }));
export class UpdateBudgetRequest extends S.Class<UpdateBudgetRequest>(
  "UpdateBudgetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    approximateDollarLimit: S.optional(S.Number),
    actionsToAdd: S.optional(BudgetActionsToAdd),
    actionsToRemove: S.optional(BudgetActionsToRemove),
    schedule: S.optional(BudgetSchedule),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/budgets/{budgetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBudgetResponse extends S.Class<UpdateBudgetResponse>(
  "UpdateBudgetResponse",
)({}) {}
export class AwsCredentials extends S.Class<AwsCredentials>("AwsCredentials")({
  accessKeyId: S.String,
  secretAccessKey: S.String,
  sessionToken: S.String,
  expiration: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class AssumeFleetRoleForWorkerResponse extends S.Class<AssumeFleetRoleForWorkerResponse>(
  "AssumeFleetRoleForWorkerResponse",
)({ credentials: AwsCredentials }) {}
export class AssumeQueueRoleForWorkerResponse extends S.Class<AssumeQueueRoleForWorkerResponse>(
  "AssumeQueueRoleForWorkerResponse",
)({ credentials: S.optional(AwsCredentials) }) {}
export class GetQueueResponse extends S.Class<GetQueueResponse>(
  "GetQueueResponse",
)({
  queueId: S.String,
  displayName: S.String,
  description: S.optional(S.String),
  farmId: S.String,
  status: S.String,
  defaultBudgetAction: S.String,
  blockedReason: S.optional(S.String),
  jobAttachmentSettings: S.optional(JobAttachmentSettings),
  roleArn: S.optional(S.String),
  requiredFileSystemLocationNames: S.optional(RequiredFileSystemLocationNames),
  allowedStorageProfileIds: S.optional(AllowedStorageProfileIds),
  jobRunAsUser: S.optional(JobRunAsUser),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class AssumeQueueRoleForReadResponse extends S.Class<AssumeQueueRoleForReadResponse>(
  "AssumeQueueRoleForReadResponse",
)({ credentials: AwsCredentials }) {}
export class AssumeQueueRoleForUserResponse extends S.Class<AssumeQueueRoleForUserResponse>(
  "AssumeQueueRoleForUserResponse",
)({ credentials: AwsCredentials }) {}
export class CreateQueueEnvironmentResponse extends S.Class<CreateQueueEnvironmentResponse>(
  "CreateQueueEnvironmentResponse",
)({ queueEnvironmentId: S.String }) {}
export class GetQueueEnvironmentResponse extends S.Class<GetQueueEnvironmentResponse>(
  "GetQueueEnvironmentResponse",
)({
  queueEnvironmentId: S.String,
  name: S.String,
  priority: S.Number,
  templateType: S.String,
  template: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class GetStorageProfileForQueueResponse extends S.Class<GetStorageProfileForQueueResponse>(
  "GetStorageProfileForQueueResponse",
)({
  storageProfileId: S.String,
  displayName: S.String,
  osFamily: S.String,
  fileSystemLocations: S.optional(FileSystemLocationsList),
}) {}
export class StorageProfileSummary extends S.Class<StorageProfileSummary>(
  "StorageProfileSummary",
)({ storageProfileId: S.String, displayName: S.String, osFamily: S.String }) {}
export const StorageProfileSummaries = S.Array(StorageProfileSummary);
export class ListStorageProfilesForQueueResponse extends S.Class<ListStorageProfilesForQueueResponse>(
  "ListStorageProfilesForQueueResponse",
)({
  storageProfiles: StorageProfileSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CopyJobTemplateRequest extends S.Class<CopyJobTemplateRequest>(
  "CopyJobTemplateRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    targetS3Location: S3Location,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs/{jobId}/template",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const LogOptions = S.Record({ key: S.String, value: S.String });
export const LogParameters = S.Record({ key: S.String, value: S.String });
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({
  logDriver: S.String,
  options: S.optional(LogOptions),
  parameters: S.optional(LogParameters),
  error: S.optional(S.String),
}) {}
export class IpAddresses extends S.Class<IpAddresses>("IpAddresses")({
  ipV4Addresses: S.optional(IpV4Addresses),
  ipV6Addresses: S.optional(IpV6Addresses),
}) {}
export class HostPropertiesResponse extends S.Class<HostPropertiesResponse>(
  "HostPropertiesResponse",
)({
  ipAddresses: S.optional(IpAddresses),
  hostName: S.optional(S.String),
  ec2InstanceArn: S.optional(S.String),
  ec2InstanceType: S.optional(S.String),
}) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
  sessionId: S.String,
  fleetId: S.String,
  workerId: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  log: LogConfiguration,
  lifecycleStatus: S.String,
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  targetLifecycleStatus: S.optional(S.String),
  hostProperties: S.optional(HostPropertiesResponse),
  workerLog: S.optional(LogConfiguration),
}) {}
export class ListJobParameterDefinitionsResponse extends S.Class<ListJobParameterDefinitionsResponse>(
  "ListJobParameterDefinitionsResponse",
)({
  jobParameterDefinitions: JobParameterDefinitions,
  nextToken: S.optional(S.String),
}) {}
export class CreateLicenseEndpointResponse extends S.Class<CreateLicenseEndpointResponse>(
  "CreateLicenseEndpointResponse",
)({ licenseEndpointId: S.String }) {}
export class GetLicenseEndpointResponse extends S.Class<GetLicenseEndpointResponse>(
  "GetLicenseEndpointResponse",
)({
  licenseEndpointId: S.String,
  status: S.String,
  statusMessage: S.String,
  vpcId: S.optional(S.String),
  dnsName: S.optional(S.String),
  subnetIds: S.optional(SubnetIdList),
  securityGroupIds: S.optional(SecurityGroupIdList),
}) {}
export class MeteredProductSummary extends S.Class<MeteredProductSummary>(
  "MeteredProductSummary",
)({
  productId: S.String,
  family: S.String,
  vendor: S.String,
  port: S.Number,
}) {}
export const MeteredProductSummaryList = S.Array(MeteredProductSummary);
export class ListMeteredProductsResponse extends S.Class<ListMeteredProductsResponse>(
  "ListMeteredProductsResponse",
)({
  meteredProducts: MeteredProductSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateMonitorResponse extends S.Class<CreateMonitorResponse>(
  "CreateMonitorResponse",
)({ monitorId: S.String, identityCenterApplicationArn: S.String }) {}
export class GetMonitorResponse extends S.Class<GetMonitorResponse>(
  "GetMonitorResponse",
)({
  monitorId: S.String,
  displayName: S.String,
  subdomain: S.String,
  url: S.String,
  roleArn: S.String,
  identityCenterInstanceArn: S.String,
  identityCenterApplicationArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class WorkerAmountCapability extends S.Class<WorkerAmountCapability>(
  "WorkerAmountCapability",
)({ name: S.String, value: S.Number }) {}
export const WorkerAmountCapabilityList = S.Array(WorkerAmountCapability);
export class WorkerAttributeCapability extends S.Class<WorkerAttributeCapability>(
  "WorkerAttributeCapability",
)({ name: S.String, values: AttributeCapabilityValuesList }) {}
export const WorkerAttributeCapabilityList = S.Array(WorkerAttributeCapability);
export class JobDetailsIdentifiers extends S.Class<JobDetailsIdentifiers>(
  "JobDetailsIdentifiers",
)({ jobId: S.String }) {}
export class JobAttachmentDetailsIdentifiers extends S.Class<JobAttachmentDetailsIdentifiers>(
  "JobAttachmentDetailsIdentifiers",
)({ jobId: S.String }) {}
export class StepDetailsIdentifiers extends S.Class<StepDetailsIdentifiers>(
  "StepDetailsIdentifiers",
)({ jobId: S.String, stepId: S.String }) {}
export class EnvironmentDetailsIdentifiers extends S.Class<EnvironmentDetailsIdentifiers>(
  "EnvironmentDetailsIdentifiers",
)({ jobId: S.String, environmentId: S.String }) {}
export const JobParameter = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
);
export class ManifestProperties extends S.Class<ManifestProperties>(
  "ManifestProperties",
)({
  fileSystemLocationName: S.optional(S.String),
  rootPath: S.String,
  rootPathFormat: S.String,
  outputRelativeDirectories: S.optional(OutputRelativeDirectoriesList),
  inputManifestPath: S.optional(S.String),
  inputManifestHash: S.optional(S.String),
}) {}
export const ManifestPropertiesList = S.Array(ManifestProperties);
export const ExceptionContext = S.Record({ key: S.String, value: S.String });
export class QueueFleetAssociationSummary extends S.Class<QueueFleetAssociationSummary>(
  "QueueFleetAssociationSummary",
)({
  queueId: S.String,
  fleetId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const QueueFleetAssociationSummaries = S.Array(
  QueueFleetAssociationSummary,
);
export class QueueLimitAssociationSummary extends S.Class<QueueLimitAssociationSummary>(
  "QueueLimitAssociationSummary",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  queueId: S.String,
  limitId: S.String,
  status: S.String,
}) {}
export const QueueLimitAssociationSummaries = S.Array(
  QueueLimitAssociationSummary,
);
export const TaskRunStatusCounts = S.Record({ key: S.String, value: S.Number });
export class StepParameter extends S.Class<StepParameter>("StepParameter")({
  name: S.String,
  type: S.String,
}) {}
export const StepParameterList = S.Array(StepParameter);
export class ParameterSpace extends S.Class<ParameterSpace>("ParameterSpace")({
  parameters: StepParameterList,
  combination: S.optional(S.String),
}) {}
export class StepSearchSummary extends S.Class<StepSearchSummary>(
  "StepSearchSummary",
)({
  stepId: S.optional(S.String),
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  name: S.optional(S.String),
  lifecycleStatus: S.optional(S.String),
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  parameterSpace: S.optional(ParameterSpace),
}) {}
export const StepSearchSummaries = S.Array(StepSearchSummary);
export const TaskParameterValue = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
  S.Struct({ chunkInt: S.String }),
);
export const TaskParameters = S.Record({
  key: S.String,
  value: TaskParameterValue,
});
export class TaskSearchSummary extends S.Class<TaskSearchSummary>(
  "TaskSearchSummary",
)({
  taskId: S.optional(S.String),
  stepId: S.optional(S.String),
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  runStatus: S.optional(S.String),
  targetRunStatus: S.optional(S.String),
  parameters: S.optional(TaskParameters),
  failureRetryCount: S.optional(S.Number),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const TaskSearchSummaries = S.Array(TaskSearchSummary);
export class WorkerSearchSummary extends S.Class<WorkerSearchSummary>(
  "WorkerSearchSummary",
)({
  fleetId: S.optional(S.String),
  workerId: S.optional(S.String),
  status: S.optional(S.String),
  hostProperties: S.optional(HostPropertiesResponse),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const WorkerSearchSummaries = S.Array(WorkerSearchSummary);
export class FarmSummary extends S.Class<FarmSummary>("FarmSummary")({
  farmId: S.String,
  displayName: S.String,
  kmsKeyArn: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const FarmSummaries = S.Array(FarmSummary);
export class FarmMember extends S.Class<FarmMember>("FarmMember")({
  farmId: S.String,
  principalId: S.String,
  principalType: S.String,
  identityStoreId: S.String,
  membershipLevel: S.String,
}) {}
export const FarmMembers = S.Array(FarmMember);
export class LimitSummary extends S.Class<LimitSummary>("LimitSummary")({
  displayName: S.String,
  amountRequirementName: S.String,
  maxCount: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  farmId: S.String,
  limitId: S.String,
  currentCount: S.Number,
}) {}
export const LimitSummaries = S.Array(LimitSummary);
export class ConsumedUsages extends S.Class<ConsumedUsages>("ConsumedUsages")({
  approximateDollarUsage: S.Number,
}) {}
export class ResponseBudgetAction extends S.Class<ResponseBudgetAction>(
  "ResponseBudgetAction",
)({
  type: S.String,
  thresholdPercentage: S.Number,
  description: S.optional(S.String),
}) {}
export const ResponseBudgetActionList = S.Array(ResponseBudgetAction);
export class BudgetSummary extends S.Class<BudgetSummary>("BudgetSummary")({
  budgetId: S.String,
  usageTrackingResource: UsageTrackingResource,
  status: S.String,
  displayName: S.String,
  description: S.optional(S.String),
  approximateDollarLimit: S.Number,
  usages: ConsumedUsages,
  createdBy: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const BudgetSummaries = S.Array(BudgetSummary);
export class FleetSummary extends S.Class<FleetSummary>("FleetSummary")({
  fleetId: S.String,
  farmId: S.String,
  displayName: S.String,
  status: S.String,
  statusMessage: S.optional(S.String),
  autoScalingStatus: S.optional(S.String),
  targetWorkerCount: S.optional(S.Number),
  workerCount: S.Number,
  minWorkerCount: S.Number,
  maxWorkerCount: S.Number,
  configuration: FleetConfiguration,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const FleetSummaries = S.Array(FleetSummary);
export class FleetMember extends S.Class<FleetMember>("FleetMember")({
  farmId: S.String,
  fleetId: S.String,
  principalId: S.String,
  principalType: S.String,
  identityStoreId: S.String,
  membershipLevel: S.String,
}) {}
export const FleetMembers = S.Array(FleetMember);
export class HostPropertiesRequest extends S.Class<HostPropertiesRequest>(
  "HostPropertiesRequest",
)({ ipAddresses: S.optional(IpAddresses), hostName: S.optional(S.String) }) {}
export class WorkerCapabilities extends S.Class<WorkerCapabilities>(
  "WorkerCapabilities",
)({
  amounts: WorkerAmountCapabilityList,
  attributes: WorkerAttributeCapabilityList,
}) {}
export class WorkerSummary extends S.Class<WorkerSummary>("WorkerSummary")({
  workerId: S.String,
  farmId: S.String,
  fleetId: S.String,
  status: S.String,
  hostProperties: S.optional(HostPropertiesResponse),
  log: S.optional(LogConfiguration),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const WorkerSummaries = S.Array(WorkerSummary);
export const JobEntityIdentifiersUnion = S.Union(
  S.Struct({ jobDetails: JobDetailsIdentifiers }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsIdentifiers }),
  S.Struct({ stepDetails: StepDetailsIdentifiers }),
  S.Struct({ environmentDetails: EnvironmentDetailsIdentifiers }),
);
export const JobEntityIdentifiers = S.Array(JobEntityIdentifiersUnion);
export class WorkerSessionSummary extends S.Class<WorkerSessionSummary>(
  "WorkerSessionSummary",
)({
  sessionId: S.String,
  queueId: S.String,
  jobId: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lifecycleStatus: S.String,
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  targetLifecycleStatus: S.optional(S.String),
}) {}
export const ListSessionsForWorkerSummaries = S.Array(WorkerSessionSummary);
export class QueueSummary extends S.Class<QueueSummary>("QueueSummary")({
  farmId: S.String,
  queueId: S.String,
  displayName: S.String,
  status: S.String,
  defaultBudgetAction: S.String,
  blockedReason: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const QueueSummaries = S.Array(QueueSummary);
export class QueueEnvironmentSummary extends S.Class<QueueEnvironmentSummary>(
  "QueueEnvironmentSummary",
)({ queueEnvironmentId: S.String, name: S.String, priority: S.Number }) {}
export const QueueEnvironmentSummaries = S.Array(QueueEnvironmentSummary);
export class QueueMember extends S.Class<QueueMember>("QueueMember")({
  farmId: S.String,
  queueId: S.String,
  principalId: S.String,
  principalType: S.String,
  identityStoreId: S.String,
  membershipLevel: S.String,
}) {}
export const QueueMemberList = S.Array(QueueMember);
export const JobParameters = S.Record({ key: S.String, value: JobParameter });
export class Attachments extends S.Class<Attachments>("Attachments")({
  manifests: ManifestPropertiesList,
  fileSystem: S.optional(S.String),
}) {}
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  jobId: S.String,
  name: S.String,
  lifecycleStatus: S.String,
  lifecycleStatusMessage: S.String,
  priority: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  maxFailedTasksCount: S.optional(S.Number),
  maxRetriesPerTask: S.optional(S.Number),
  maxWorkerCount: S.optional(S.Number),
  sourceJobId: S.optional(S.String),
}) {}
export const JobSummaries = S.Array(JobSummary);
export class AcquiredLimit extends S.Class<AcquiredLimit>("AcquiredLimit")({
  limitId: S.String,
  count: S.Number,
}) {}
export const AcquiredLimits = S.Array(AcquiredLimit);
export class TaskRunManifestPropertiesResponse extends S.Class<TaskRunManifestPropertiesResponse>(
  "TaskRunManifestPropertiesResponse",
)({
  outputManifestPath: S.optional(S.String),
  outputManifestHash: S.optional(S.String),
}) {}
export const TaskRunManifestPropertiesListResponse = S.Array(
  TaskRunManifestPropertiesResponse,
);
export class DependencyCounts extends S.Class<DependencyCounts>(
  "DependencyCounts",
)({
  dependenciesResolved: S.Number,
  dependenciesUnresolved: S.Number,
  consumersResolved: S.Number,
  consumersUnresolved: S.Number,
}) {}
export class JobMember extends S.Class<JobMember>("JobMember")({
  farmId: S.String,
  queueId: S.String,
  jobId: S.String,
  principalId: S.String,
  principalType: S.String,
  identityStoreId: S.String,
  membershipLevel: S.String,
}) {}
export const JobMembers = S.Array(JobMember);
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
  fleetId: S.String,
  workerId: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lifecycleStatus: S.String,
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  targetLifecycleStatus: S.optional(S.String),
}) {}
export const SessionSummaries = S.Array(SessionSummary);
export class StepConsumer extends S.Class<StepConsumer>("StepConsumer")({
  stepId: S.String,
  status: S.String,
}) {}
export const StepConsumers = S.Array(StepConsumer);
export class StepDependency extends S.Class<StepDependency>("StepDependency")({
  stepId: S.String,
  status: S.String,
}) {}
export const StepDependencies = S.Array(StepDependency);
export class StepSummary extends S.Class<StepSummary>("StepSummary")({
  stepId: S.String,
  name: S.String,
  lifecycleStatus: S.String,
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.String,
  taskRunStatusCounts: TaskRunStatusCounts,
  taskFailureRetryCount: S.optional(S.Number),
  targetTaskRunStatus: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dependencyCounts: S.optional(DependencyCounts),
}) {}
export const StepSummaries = S.Array(StepSummary);
export class TaskSummary extends S.Class<TaskSummary>("TaskSummary")({
  taskId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  runStatus: S.String,
  targetRunStatus: S.optional(S.String),
  failureRetryCount: S.optional(S.Number),
  parameters: S.optional(TaskParameters),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  latestSessionActionId: S.optional(S.String),
}) {}
export const TaskSummaries = S.Array(TaskSummary);
export class LicenseEndpointSummary extends S.Class<LicenseEndpointSummary>(
  "LicenseEndpointSummary",
)({
  licenseEndpointId: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  vpcId: S.optional(S.String),
}) {}
export const LicenseEndpointSummaries = S.Array(LicenseEndpointSummary);
export class MonitorSummary extends S.Class<MonitorSummary>("MonitorSummary")({
  monitorId: S.String,
  displayName: S.String,
  subdomain: S.String,
  url: S.String,
  roleArn: S.String,
  identityCenterInstanceArn: S.String,
  identityCenterApplicationArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const MonitorSummaries = S.Array(MonitorSummary);
export class DateTimeFilterExpression extends S.Class<DateTimeFilterExpression>(
  "DateTimeFilterExpression",
)({
  name: S.String,
  operator: S.String,
  dateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ParameterFilterExpression extends S.Class<ParameterFilterExpression>(
  "ParameterFilterExpression",
)({ name: S.String, operator: S.String, value: S.String }) {}
export class SearchTermFilterExpression extends S.Class<SearchTermFilterExpression>(
  "SearchTermFilterExpression",
)({ searchTerm: S.String, matchType: S.optional(S.String) }) {}
export class StringFilterExpression extends S.Class<StringFilterExpression>(
  "StringFilterExpression",
)({ name: S.String, operator: S.String, value: S.String }) {}
export class TaskRunManifestPropertiesRequest extends S.Class<TaskRunManifestPropertiesRequest>(
  "TaskRunManifestPropertiesRequest",
)({
  outputManifestPath: S.optional(S.String),
  outputManifestHash: S.optional(S.String),
}) {}
export const TaskRunManifestPropertiesListRequest = S.Array(
  TaskRunManifestPropertiesRequest,
);
export const ListAttributeCapabilityValue = S.Array(S.String);
export class ListAvailableMeteredProductsResponse extends S.Class<ListAvailableMeteredProductsResponse>(
  "ListAvailableMeteredProductsResponse",
)({
  meteredProducts: MeteredProductSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListQueueFleetAssociationsResponse extends S.Class<ListQueueFleetAssociationsResponse>(
  "ListQueueFleetAssociationsResponse",
)({
  queueFleetAssociations: QueueFleetAssociationSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListQueueLimitAssociationsResponse extends S.Class<ListQueueLimitAssociationsResponse>(
  "ListQueueLimitAssociationsResponse",
)({
  queueLimitAssociations: QueueLimitAssociationSummaries,
  nextToken: S.optional(S.String),
}) {}
export class SearchStepsResponse extends S.Class<SearchStepsResponse>(
  "SearchStepsResponse",
)({
  steps: StepSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class SearchTasksResponse extends S.Class<SearchTasksResponse>(
  "SearchTasksResponse",
)({
  tasks: TaskSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class SearchWorkersResponse extends S.Class<SearchWorkersResponse>(
  "SearchWorkersResponse",
)({
  workers: WorkerSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class StartSessionsStatisticsAggregationResponse extends S.Class<StartSessionsStatisticsAggregationResponse>(
  "StartSessionsStatisticsAggregationResponse",
)({ aggregationId: S.String }) {}
export class ListFarmsResponse extends S.Class<ListFarmsResponse>(
  "ListFarmsResponse",
)({ nextToken: S.optional(S.String), farms: FarmSummaries }) {}
export class CreateStorageProfileResponse extends S.Class<CreateStorageProfileResponse>(
  "CreateStorageProfileResponse",
)({ storageProfileId: S.String }) {}
export class ListFarmMembersResponse extends S.Class<ListFarmMembersResponse>(
  "ListFarmMembersResponse",
)({ members: FarmMembers, nextToken: S.optional(S.String) }) {}
export class ListLimitsResponse extends S.Class<ListLimitsResponse>(
  "ListLimitsResponse",
)({ limits: LimitSummaries, nextToken: S.optional(S.String) }) {}
export class ListStorageProfilesResponse extends S.Class<ListStorageProfilesResponse>(
  "ListStorageProfilesResponse",
)({
  storageProfiles: StorageProfileSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CreateBudgetRequest extends S.Class<CreateBudgetRequest>(
  "CreateBudgetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    usageTrackingResource: UsageTrackingResource,
    displayName: S.String,
    description: S.optional(S.String),
    approximateDollarLimit: S.Number,
    actions: BudgetActionsToAdd,
    schedule: BudgetSchedule,
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/budgets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBudgetResponse extends S.Class<GetBudgetResponse>(
  "GetBudgetResponse",
)({
  budgetId: S.String,
  usageTrackingResource: UsageTrackingResource,
  status: S.String,
  displayName: S.String,
  description: S.optional(S.String),
  approximateDollarLimit: S.Number,
  usages: ConsumedUsages,
  actions: ResponseBudgetActionList,
  schedule: BudgetSchedule,
  createdBy: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  queueStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListBudgetsResponse extends S.Class<ListBudgetsResponse>(
  "ListBudgetsResponse",
)({ nextToken: S.optional(S.String), budgets: BudgetSummaries }) {}
export class ListFleetsResponse extends S.Class<ListFleetsResponse>(
  "ListFleetsResponse",
)({ fleets: FleetSummaries, nextToken: S.optional(S.String) }) {}
export class AssumeFleetRoleForReadResponse extends S.Class<AssumeFleetRoleForReadResponse>(
  "AssumeFleetRoleForReadResponse",
)({ credentials: AwsCredentials }) {}
export class ListFleetMembersResponse extends S.Class<ListFleetMembersResponse>(
  "ListFleetMembersResponse",
)({ members: FleetMembers, nextToken: S.optional(S.String) }) {}
export class CreateWorkerRequest extends S.Class<CreateWorkerRequest>(
  "CreateWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    hostProperties: S.optional(HostPropertiesRequest),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkerRequest extends S.Class<UpdateWorkerRequest>(
  "UpdateWorkerRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    status: S.optional(S.String),
    capabilities: S.optional(WorkerCapabilities),
    hostProperties: S.optional(HostPropertiesRequest),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkersResponse extends S.Class<ListWorkersResponse>(
  "ListWorkersResponse",
)({ nextToken: S.optional(S.String), workers: WorkerSummaries }) {}
export class BatchGetJobEntityRequest extends S.Class<BatchGetJobEntityRequest>(
  "BatchGetJobEntityRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    identifiers: JobEntityIdentifiers,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}/batchGetJobEntity",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsForWorkerResponse extends S.Class<ListSessionsForWorkerResponse>(
  "ListSessionsForWorkerResponse",
)({
  sessions: ListSessionsForWorkerSummaries,
  nextToken: S.optional(S.String),
}) {}
export class CreateQueueRequest extends S.Class<CreateQueueRequest>(
  "CreateQueueRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    description: S.optional(S.String),
    defaultBudgetAction: S.optional(S.String),
    jobAttachmentSettings: S.optional(JobAttachmentSettings),
    roleArn: S.optional(S.String),
    jobRunAsUser: S.optional(JobRunAsUser),
    requiredFileSystemLocationNames: S.optional(
      RequiredFileSystemLocationNames,
    ),
    allowedStorageProfileIds: S.optional(AllowedStorageProfileIds),
    tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/queues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueuesResponse extends S.Class<ListQueuesResponse>(
  "ListQueuesResponse",
)({ queues: QueueSummaries, nextToken: S.optional(S.String) }) {}
export class ListQueueEnvironmentsResponse extends S.Class<ListQueueEnvironmentsResponse>(
  "ListQueueEnvironmentsResponse",
)({
  environments: QueueEnvironmentSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListQueueMembersResponse extends S.Class<ListQueueMembersResponse>(
  "ListQueueMembersResponse",
)({ members: QueueMemberList, nextToken: S.optional(S.String) }) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    template: S.optional(S.String),
    templateType: S.optional(S.String),
    priority: S.Number,
    parameters: S.optional(JobParameters),
    attachments: S.optional(Attachments),
    storageProfileId: S.optional(S.String),
    targetTaskRunStatus: S.optional(S.String),
    maxFailedTasksCount: S.optional(S.Number),
    maxRetriesPerTask: S.optional(S.Number),
    maxWorkerCount: S.optional(S.Number),
    sourceJobId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/queues/{queueId}/jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobResponse extends S.Class<GetJobResponse>("GetJobResponse")({
  jobId: S.String,
  name: S.String,
  lifecycleStatus: S.String,
  lifecycleStatusMessage: S.String,
  priority: S.Number,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  storageProfileId: S.optional(S.String),
  maxFailedTasksCount: S.optional(S.Number),
  maxRetriesPerTask: S.optional(S.Number),
  parameters: S.optional(JobParameters),
  attachments: S.optional(Attachments),
  description: S.optional(S.String),
  maxWorkerCount: S.optional(S.Number),
  sourceJobId: S.optional(S.String),
}) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ jobs: JobSummaries, nextToken: S.optional(S.String) }) {}
export class CopyJobTemplateResponse extends S.Class<CopyJobTemplateResponse>(
  "CopyJobTemplateResponse",
)({ templateType: S.String }) {}
export class ListJobMembersResponse extends S.Class<ListJobMembersResponse>(
  "ListJobMembersResponse",
)({ members: JobMembers, nextToken: S.optional(S.String) }) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({ sessions: SessionSummaries, nextToken: S.optional(S.String) }) {}
export class ListStepConsumersResponse extends S.Class<ListStepConsumersResponse>(
  "ListStepConsumersResponse",
)({ consumers: StepConsumers, nextToken: S.optional(S.String) }) {}
export class ListStepDependenciesResponse extends S.Class<ListStepDependenciesResponse>(
  "ListStepDependenciesResponse",
)({ dependencies: StepDependencies, nextToken: S.optional(S.String) }) {}
export class ListStepsResponse extends S.Class<ListStepsResponse>(
  "ListStepsResponse",
)({ steps: StepSummaries, nextToken: S.optional(S.String) }) {}
export class ListTasksResponse extends S.Class<ListTasksResponse>(
  "ListTasksResponse",
)({ tasks: TaskSummaries, nextToken: S.optional(S.String) }) {}
export class ListLicenseEndpointsResponse extends S.Class<ListLicenseEndpointsResponse>(
  "ListLicenseEndpointsResponse",
)({
  licenseEndpoints: LicenseEndpointSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListMonitorsResponse extends S.Class<ListMonitorsResponse>(
  "ListMonitorsResponse",
)({ nextToken: S.optional(S.String), monitors: MonitorSummaries }) {}
export class Stats extends S.Class<Stats>("Stats")({
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  avg: S.optional(S.Number),
  sum: S.optional(S.Number),
}) {}
export type SearchFilterExpression =
  | { dateTimeFilter: DateTimeFilterExpression }
  | { parameterFilter: ParameterFilterExpression }
  | { searchTermFilter: SearchTermFilterExpression }
  | { stringFilter: StringFilterExpression }
  | { groupFilter: SearchGroupedFilterExpressions };
export const SearchFilterExpression = S.Union(
  S.Struct({ dateTimeFilter: DateTimeFilterExpression }),
  S.Struct({ parameterFilter: ParameterFilterExpression }),
  S.Struct({ searchTermFilter: SearchTermFilterExpression }),
  S.Struct({ stringFilter: StringFilterExpression }),
  S.Struct({
    groupFilter: S.suspend(
      (): S.Schema<SearchGroupedFilterExpressions, any> =>
        SearchGroupedFilterExpressions,
    ),
  }),
) as any as S.Schema<SearchFilterExpression>;
export type SearchFilterExpressions = SearchFilterExpression[];
export const SearchFilterExpressions = S.Array(
  S.suspend(() => SearchFilterExpression),
) as any as S.Schema<SearchFilterExpressions>;
export const FleetAmountCapabilities = S.Array(FleetAmountCapability);
export const FleetAttributeCapabilities = S.Array(FleetAttributeCapability);
export class UpdatedSessionActionInfo extends S.Class<UpdatedSessionActionInfo>(
  "UpdatedSessionActionInfo",
)({
  completedStatus: S.optional(S.String),
  processExitCode: S.optional(S.Number),
  progressMessage: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  progressPercent: S.optional(S.Number),
  manifests: S.optional(TaskRunManifestPropertiesListRequest),
}) {}
export class EnvironmentEnterSessionActionDefinition extends S.Class<EnvironmentEnterSessionActionDefinition>(
  "EnvironmentEnterSessionActionDefinition",
)({ environmentId: S.String }) {}
export class EnvironmentExitSessionActionDefinition extends S.Class<EnvironmentExitSessionActionDefinition>(
  "EnvironmentExitSessionActionDefinition",
)({ environmentId: S.String }) {}
export class TaskRunSessionActionDefinition extends S.Class<TaskRunSessionActionDefinition>(
  "TaskRunSessionActionDefinition",
)({
  taskId: S.optional(S.String),
  stepId: S.String,
  parameters: TaskParameters,
}) {}
export class SyncInputJobAttachmentsSessionActionDefinition extends S.Class<SyncInputJobAttachmentsSessionActionDefinition>(
  "SyncInputJobAttachmentsSessionActionDefinition",
)({ stepId: S.optional(S.String) }) {}
export class StepAttributeCapability extends S.Class<StepAttributeCapability>(
  "StepAttributeCapability",
)({
  name: S.String,
  anyOf: S.optional(ListAttributeCapabilityValue),
  allOf: S.optional(ListAttributeCapabilityValue),
}) {}
export const StepAttributeCapabilities = S.Array(StepAttributeCapability);
export class StepAmountCapability extends S.Class<StepAmountCapability>(
  "StepAmountCapability",
)({
  name: S.String,
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  value: S.optional(S.Number),
}) {}
export const StepAmountCapabilities = S.Array(StepAmountCapability);
export class Statistics extends S.Class<Statistics>("Statistics")({
  queueId: S.optional(S.String),
  fleetId: S.optional(S.String),
  jobId: S.optional(S.String),
  jobName: S.optional(S.String),
  userId: S.optional(S.String),
  usageType: S.optional(S.String),
  licenseProduct: S.optional(S.String),
  instanceType: S.optional(S.String),
  count: S.Number,
  costInUsd: Stats,
  runtimeInSeconds: Stats,
  aggregationStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  aggregationEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const StatisticsList = S.Array(Statistics);
export class FleetCapabilities extends S.Class<FleetCapabilities>(
  "FleetCapabilities",
)({
  amounts: S.optional(FleetAmountCapabilities),
  attributes: S.optional(FleetAttributeCapabilities),
}) {}
export const UpdatedSessionActions = S.Record({
  key: S.String,
  value: UpdatedSessionActionInfo,
});
export const SessionActionDefinition = S.Union(
  S.Struct({ envEnter: EnvironmentEnterSessionActionDefinition }),
  S.Struct({ envExit: EnvironmentExitSessionActionDefinition }),
  S.Struct({ taskRun: TaskRunSessionActionDefinition }),
  S.Struct({
    syncInputJobAttachments: SyncInputJobAttachmentsSessionActionDefinition,
  }),
);
export class StepRequiredCapabilities extends S.Class<StepRequiredCapabilities>(
  "StepRequiredCapabilities",
)({ attributes: StepAttributeCapabilities, amounts: StepAmountCapabilities }) {}
export class EnvironmentEnterSessionActionDefinitionSummary extends S.Class<EnvironmentEnterSessionActionDefinitionSummary>(
  "EnvironmentEnterSessionActionDefinitionSummary",
)({ environmentId: S.String }) {}
export class EnvironmentExitSessionActionDefinitionSummary extends S.Class<EnvironmentExitSessionActionDefinitionSummary>(
  "EnvironmentExitSessionActionDefinitionSummary",
)({ environmentId: S.String }) {}
export class TaskRunSessionActionDefinitionSummary extends S.Class<TaskRunSessionActionDefinitionSummary>(
  "TaskRunSessionActionDefinitionSummary",
)({
  taskId: S.optional(S.String),
  stepId: S.String,
  parameters: S.optional(TaskParameters),
}) {}
export class SyncInputJobAttachmentsSessionActionDefinitionSummary extends S.Class<SyncInputJobAttachmentsSessionActionDefinitionSummary>(
  "SyncInputJobAttachmentsSessionActionDefinitionSummary",
)({ stepId: S.optional(S.String) }) {}
export class GetSessionsStatisticsAggregationResponse extends S.Class<GetSessionsStatisticsAggregationResponse>(
  "GetSessionsStatisticsAggregationResponse",
)({
  statistics: S.optional(StatisticsList),
  nextToken: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
}) {}
export class SearchJobsRequest extends S.Class<SearchJobsRequest>(
  "SearchJobsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBudgetResponse extends S.Class<CreateBudgetResponse>(
  "CreateBudgetResponse",
)({ budgetId: S.String }) {}
export class GetFleetResponse extends S.Class<GetFleetResponse>(
  "GetFleetResponse",
)({
  fleetId: S.String,
  farmId: S.String,
  displayName: S.String,
  description: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  autoScalingStatus: S.optional(S.String),
  targetWorkerCount: S.optional(S.Number),
  workerCount: S.Number,
  minWorkerCount: S.Number,
  maxWorkerCount: S.Number,
  configuration: FleetConfiguration,
  hostConfiguration: S.optional(HostConfiguration),
  capabilities: S.optional(FleetCapabilities),
  roleArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class CreateWorkerResponse extends S.Class<CreateWorkerResponse>(
  "CreateWorkerResponse",
)({ workerId: S.String }) {}
export class GetWorkerResponse extends S.Class<GetWorkerResponse>(
  "GetWorkerResponse",
)({
  farmId: S.String,
  fleetId: S.String,
  workerId: S.String,
  hostProperties: S.optional(HostPropertiesResponse),
  status: S.String,
  log: S.optional(LogConfiguration),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class UpdateWorkerResponse extends S.Class<UpdateWorkerResponse>(
  "UpdateWorkerResponse",
)({
  log: S.optional(LogConfiguration),
  hostConfiguration: S.optional(HostConfiguration),
}) {}
export class UpdateWorkerScheduleRequest extends S.Class<UpdateWorkerScheduleRequest>(
  "UpdateWorkerScheduleRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    updatedSessionActions: S.optional(UpdatedSessionActions),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/fleets/{fleetId}/workers/{workerId}/schedule",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueResponse extends S.Class<CreateQueueResponse>(
  "CreateQueueResponse",
)({ queueId: S.String }) {}
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({ jobId: S.String }) {}
export class GetSessionActionResponse extends S.Class<GetSessionActionResponse>(
  "GetSessionActionResponse",
)({
  sessionActionId: S.String,
  status: S.String,
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  workerUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  progressPercent: S.optional(S.Number),
  sessionId: S.String,
  processExitCode: S.optional(S.Number),
  progressMessage: S.optional(S.String),
  definition: SessionActionDefinition,
  acquiredLimits: S.optional(AcquiredLimits),
  manifests: S.optional(TaskRunManifestPropertiesListResponse),
}) {}
export class GetStepResponse extends S.Class<GetStepResponse>(
  "GetStepResponse",
)({
  stepId: S.String,
  name: S.String,
  lifecycleStatus: S.String,
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.String,
  taskRunStatusCounts: TaskRunStatusCounts,
  taskFailureRetryCount: S.optional(S.Number),
  targetTaskRunStatus: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  dependencyCounts: S.optional(DependencyCounts),
  requiredCapabilities: S.optional(StepRequiredCapabilities),
  parameterSpace: S.optional(ParameterSpace),
  description: S.optional(S.String),
}) {}
export class GetTaskResponse extends S.Class<GetTaskResponse>(
  "GetTaskResponse",
)({
  taskId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  runStatus: S.String,
  targetRunStatus: S.optional(S.String),
  failureRetryCount: S.optional(S.Number),
  parameters: S.optional(TaskParameters),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  latestSessionActionId: S.optional(S.String),
}) {}
export const SessionActionDefinitionSummary = S.Union(
  S.Struct({ envEnter: EnvironmentEnterSessionActionDefinitionSummary }),
  S.Struct({ envExit: EnvironmentExitSessionActionDefinitionSummary }),
  S.Struct({ taskRun: TaskRunSessionActionDefinitionSummary }),
  S.Struct({
    syncInputJobAttachments:
      SyncInputJobAttachmentsSessionActionDefinitionSummary,
  }),
);
export class SessionActionSummary extends S.Class<SessionActionSummary>(
  "SessionActionSummary",
)({
  sessionActionId: S.String,
  status: S.String,
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  workerUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  progressPercent: S.optional(S.Number),
  definition: SessionActionDefinitionSummary,
  manifests: S.optional(TaskRunManifestPropertiesListResponse),
}) {}
export const SessionActionSummaries = S.Array(SessionActionSummary);
export const DependenciesList = S.Array(S.String);
export class ListSessionActionsResponse extends S.Class<ListSessionActionsResponse>(
  "ListSessionActionsResponse",
)({
  sessionActions: SessionActionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class JobAttachmentDetailsEntity extends S.Class<JobAttachmentDetailsEntity>(
  "JobAttachmentDetailsEntity",
)({ jobId: S.String, attachments: Attachments }) {}
export class StepDetailsEntity extends S.Class<StepDetailsEntity>(
  "StepDetailsEntity",
)({
  jobId: S.String,
  stepId: S.String,
  schemaVersion: S.String,
  template: S.Any,
  dependencies: DependenciesList,
}) {}
export class EnvironmentDetailsEntity extends S.Class<EnvironmentDetailsEntity>(
  "EnvironmentDetailsEntity",
)({
  jobId: S.String,
  environmentId: S.String,
  schemaVersion: S.String,
  template: S.Any,
}) {}
export class JobDetailsError extends S.Class<JobDetailsError>(
  "JobDetailsError",
)({ jobId: S.String, code: S.String, message: S.String }) {}
export class JobAttachmentDetailsError extends S.Class<JobAttachmentDetailsError>(
  "JobAttachmentDetailsError",
)({ jobId: S.String, code: S.String, message: S.String }) {}
export class StepDetailsError extends S.Class<StepDetailsError>(
  "StepDetailsError",
)({ jobId: S.String, stepId: S.String, code: S.String, message: S.String }) {}
export class EnvironmentDetailsError extends S.Class<EnvironmentDetailsError>(
  "EnvironmentDetailsError",
)({
  jobId: S.String,
  environmentId: S.String,
  code: S.String,
  message: S.String,
}) {}
export const SessionActionIdList = S.Array(S.String);
export class JobSearchSummary extends S.Class<JobSearchSummary>(
  "JobSearchSummary",
)({
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  name: S.optional(S.String),
  lifecycleStatus: S.optional(S.String),
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  priority: S.optional(S.Number),
  maxFailedTasksCount: S.optional(S.Number),
  maxRetriesPerTask: S.optional(S.Number),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  jobParameters: S.optional(JobParameters),
  maxWorkerCount: S.optional(S.Number),
  sourceJobId: S.optional(S.String),
}) {}
export const JobSearchSummaries = S.Array(JobSearchSummary);
export const GetJobEntityError = S.Union(
  S.Struct({ jobDetails: JobDetailsError }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsError }),
  S.Struct({ stepDetails: StepDetailsError }),
  S.Struct({ environmentDetails: EnvironmentDetailsError }),
);
export const BatchGetJobEntityErrors = S.Array(GetJobEntityError);
export const CancelSessionActions = S.Record({
  key: S.String,
  value: SessionActionIdList,
});
export class PathMappingRule extends S.Class<PathMappingRule>(
  "PathMappingRule",
)({
  sourcePathFormat: S.String,
  sourcePath: S.String,
  destinationPath: S.String,
}) {}
export const PathMappingRules = S.Array(PathMappingRule);
export class SearchJobsResponse extends S.Class<SearchJobsResponse>(
  "SearchJobsResponse",
)({
  jobs: JobSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class CreateFleetRequest extends S.Class<CreateFleetRequest>(
  "CreateFleetRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    minWorkerCount: S.optional(S.Number),
    maxWorkerCount: S.Number,
    configuration: FleetConfiguration,
    tags: S.optional(Tags),
    hostConfiguration: S.optional(HostConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/fleets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JobDetailsEntity extends S.Class<JobDetailsEntity>(
  "JobDetailsEntity",
)({
  jobId: S.String,
  jobAttachmentSettings: S.optional(JobAttachmentSettings),
  jobRunAsUser: S.optional(JobRunAsUser),
  logGroupName: S.String,
  queueRoleArn: S.optional(S.String),
  parameters: S.optional(JobParameters),
  schemaVersion: S.String,
  pathMappingRules: S.optional(PathMappingRules),
}) {}
export const JobEntity = S.Union(
  S.Struct({ jobDetails: JobDetailsEntity }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsEntity }),
  S.Struct({ stepDetails: StepDetailsEntity }),
  S.Struct({ environmentDetails: EnvironmentDetailsEntity }),
);
export const BatchGetJobEntityList = S.Array(JobEntity);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateFleetResponse extends S.Class<CreateFleetResponse>(
  "CreateFleetResponse",
)({ fleetId: S.String }) {}
export class BatchGetJobEntityResponse extends S.Class<BatchGetJobEntityResponse>(
  "BatchGetJobEntityResponse",
)({ entities: BatchGetJobEntityList, errors: BatchGetJobEntityErrors }) {}
export class AssignedEnvironmentEnterSessionActionDefinition extends S.Class<AssignedEnvironmentEnterSessionActionDefinition>(
  "AssignedEnvironmentEnterSessionActionDefinition",
)({ environmentId: S.String }) {}
export class AssignedEnvironmentExitSessionActionDefinition extends S.Class<AssignedEnvironmentExitSessionActionDefinition>(
  "AssignedEnvironmentExitSessionActionDefinition",
)({ environmentId: S.String }) {}
export class AssignedTaskRunSessionActionDefinition extends S.Class<AssignedTaskRunSessionActionDefinition>(
  "AssignedTaskRunSessionActionDefinition",
)({
  taskId: S.optional(S.String),
  stepId: S.String,
  parameters: TaskParameters,
}) {}
export class AssignedSyncInputJobAttachmentsSessionActionDefinition extends S.Class<AssignedSyncInputJobAttachmentsSessionActionDefinition>(
  "AssignedSyncInputJobAttachmentsSessionActionDefinition",
)({ stepId: S.optional(S.String) }) {}
export const AssignedSessionActionDefinition = S.Union(
  S.Struct({ envEnter: AssignedEnvironmentEnterSessionActionDefinition }),
  S.Struct({ envExit: AssignedEnvironmentExitSessionActionDefinition }),
  S.Struct({ taskRun: AssignedTaskRunSessionActionDefinition }),
  S.Struct({
    syncInputJobAttachments:
      AssignedSyncInputJobAttachmentsSessionActionDefinition,
  }),
);
export class AssignedSessionAction extends S.Class<AssignedSessionAction>(
  "AssignedSessionAction",
)({ sessionActionId: S.String, definition: AssignedSessionActionDefinition }) {}
export const AssignedSessionActions = S.Array(AssignedSessionAction);
export class AssignedSession extends S.Class<AssignedSession>(
  "AssignedSession",
)({
  queueId: S.String,
  jobId: S.String,
  sessionActions: AssignedSessionActions,
  logConfiguration: LogConfiguration,
}) {}
export const AssignedSessions = S.Record({
  key: S.String,
  value: AssignedSession,
});
export class UpdateWorkerScheduleResponse extends S.Class<UpdateWorkerScheduleResponse>(
  "UpdateWorkerScheduleResponse",
)({
  assignedSessions: AssignedSessions,
  cancelSessionActions: CancelSessionActions,
  desiredWorkerStatus: S.optional(S.String),
  updateIntervalSeconds: S.Number,
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String, context: S.optional(ExceptionContext) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    reason: S.String,
    resourceId: S.String,
    resourceType: S.String,
    context: S.optional(ExceptionContext),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    context: S.optional(ExceptionContext),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
    context: S.optional(ExceptionContext),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    reason: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
    resourceId: S.optional(S.String),
    context: S.optional(ExceptionContext),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
    context: S.optional(ExceptionContext),
  },
) {}

//# Operations
/**
 * A list of the available metered products.
 */
export const listAvailableMeteredProducts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAvailableMeteredProductsRequest,
    output: ListAvailableMeteredProductsResponse,
    errors: [InternalServerErrorException, ThrottlingException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "meteredProducts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists queue-fleet associations.
 */
export const listQueueFleetAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListQueueFleetAssociationsRequest,
    output: ListQueueFleetAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "queueFleetAssociations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a list of the associations between queues and limits defined in a farm.
 */
export const listQueueLimitAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListQueueLimitAssociationsRequest,
    output: ListQueueLimitAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "queueLimitAssociations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates an Amazon Web Services Deadline Cloud monitor that you can use to view your farms, queues, and
 * fleets. After you submit a job, you can track the progress of the tasks and steps that make
 * up the job, and then download the job's results.
 */
export const createMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorRequest,
  output: CreateMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a set of statistics for queues or farms. Before you can call the
 * `GetSessionStatisticsAggregation` operation, you must first call the
 * `StartSessionsStatisticsAggregation` operation. Statistics are available for
 * 1 hour after you call the `StartSessionsStatisticsAggregation` operation.
 */
export const getSessionsStatisticsAggregation =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetSessionsStatisticsAggregationRequest,
    output: GetSessionsStatisticsAggregationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "statistics",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a budget to set spending thresholds for your rendering activity.
 */
export const createBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBudgetRequest,
  output: CreateBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a fleet.
 */
export const getFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFleetRequest,
  output: GetFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a worker.
 */
export const getWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkerRequest,
  output: GetWorkerResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a queue to coordinate the order in which jobs run on a farm. A queue can also
 * specify where to pull resources and indicate where to output completed jobs.
 */
export const createQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueRequest,
  output: CreateQueueResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a job. A job is a set of instructions that Deadline Cloud uses to schedule
 * and run work on available workers. For more information, see Deadline Cloud
 * jobs.
 */
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a session action for the job.
 */
export const getSessionAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionActionRequest,
  output: GetSessionActionResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a step.
 */
export const getStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStepRequest,
  output: GetStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a task.
 */
export const getTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaskRequest,
  output: GetTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a queue-fleet association.
 */
export const deleteQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueueFleetAssociationRequest,
    output: DeleteQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Searches for steps.
 */
export const searchSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchStepsRequest,
  output: SearchStepsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for tasks.
 */
export const searchTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchTasksRequest,
  output: SearchTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for workers.
 */
export const searchWorkers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchWorkersRequest,
  output: SearchWorkersResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an asynchronous request for getting aggregated statistics about queues and farms.
 * Get the statistics using the `GetSessionsStatisticsAggregation` operation. You
 * can only have one running aggregation for your Deadline Cloud farm. Call the
 * `GetSessionsStatisticsAggregation` operation and check the
 * `status` field to see if an aggregation is running. Statistics are available
 * for 1 hour after you call the `StartSessionsStatisticsAggregation`
 * operation.
 */
export const startSessionsStatisticsAggregation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartSessionsStatisticsAggregationRequest,
    output: StartSessionsStatisticsAggregationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a storage profile that specifies the operating system, file type, and file
 * location of resources used on a farm.
 */
export const createStorageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStorageProfileRequest,
    output: CreateStorageProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the members of a farm.
 */
export const listFarmMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFarmMembersRequest,
    output: ListFarmMembersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "members",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets a list of limits defined in the specified farm.
 */
export const listLimits = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLimitsRequest,
  output: ListLimitsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "limits",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists storage profiles.
 */
export const listStorageProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStorageProfilesRequest,
    output: ListStorageProfilesResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "storageProfiles",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get a budget.
 */
export const getBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBudgetRequest,
  output: GetBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * A list of budgets in a farm.
 */
export const listBudgets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBudgetsRequest,
    output: ListBudgetsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "budgets",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists fleets.
 */
export const listFleets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFleetsRequest,
  output: ListFleetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "fleets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get Amazon Web Services credentials from the fleet role. The IAM permissions of the credentials are
 * scoped down to have read-only access.
 */
export const assumeFleetRoleForRead = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeFleetRoleForReadRequest,
    output: AssumeFleetRoleForReadResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists fleet members.
 */
export const listFleetMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFleetMembersRequest,
    output: ListFleetMembersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "members",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists workers.
 */
export const listWorkers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkersRequest,
    output: ListWorkersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workers",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists sessions for a worker.
 */
export const listSessionsForWorker =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSessionsForWorkerRequest,
    output: ListSessionsForWorkerResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sessions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists queues.
 */
export const listQueues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuesRequest,
  output: ListQueuesResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "queues",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists queue environments.
 */
export const listQueueEnvironments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListQueueEnvironmentsRequest,
    output: ListQueueEnvironmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environments",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the members in a queue.
 */
export const listQueueMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListQueueMembersRequest,
    output: ListQueueMembersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "members",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets a Deadline Cloud job.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists jobs.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Copies a job template to an Amazon S3 bucket.
 */
export const copyJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyJobTemplateRequest,
  output: CopyJobTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists members on a job.
 */
export const listJobMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListJobMembersRequest,
    output: ListJobMembersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "members",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists sessions.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSessionsRequest,
    output: ListSessionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sessions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists step consumers.
 */
export const listStepConsumers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListStepConsumersRequest,
    output: ListStepConsumersResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "consumers",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the dependencies for a step.
 */
export const listStepDependencies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStepDependenciesRequest,
    output: ListStepDependenciesResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dependencies",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists steps for a job.
 */
export const listSteps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStepsRequest,
  output: ListStepsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "steps",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists tasks for a job.
 */
export const listTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTasksRequest,
  output: ListTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists license endpoints.
 */
export const listLicenseEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLicenseEndpointsRequest,
    output: ListLicenseEndpointsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "licenseEndpoints",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Associates a limit with a particular queue. After the limit is associated, all workers
 * for jobs that specify the limit associated with the queue are subject to the limit. You
 * can't associate two limits with the same `amountRequirementName` to the same
 * queue.
 */
export const createQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateQueueLimitAssociationRequest,
    output: CreateQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a queue-fleet association.
 */
export const updateQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueFleetAssociationRequest,
    output: UpdateQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the status of the queue. If you set the status to one of the
 * `STOP_LIMIT_USAGE*` values, there will be a delay before the status
 * transitions to the `STOPPED` state.
 */
export const updateQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueLimitAssociationRequest,
    output: UpdateQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a farm.
 */
export const updateFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFarmRequest,
  output: UpdateFarmResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a farm.
 */
export const deleteFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFarmRequest,
  output: DeleteFarmResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns a farm membership level to a member.
 */
export const associateMemberToFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMemberToFarmRequest,
    output: AssociateMemberToFarmResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates a member from a farm.
 */
export const disassociateMemberFromFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMemberFromFarmRequest,
    output: DisassociateMemberFromFarmResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the properties of the specified limit.
 */
export const updateLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLimitRequest,
  output: UpdateLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a storage profile.
 */
export const updateStorageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStorageProfileRequest,
    output: UpdateStorageProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a budget.
 */
export const deleteBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBudgetRequest,
  output: DeleteBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a fleet.
 */
export const updateFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetRequest,
  output: UpdateFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns a fleet membership level to a member.
 */
export const associateMemberToFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMemberToFleetRequest,
    output: AssociateMemberToFleetResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a queue.
 */
export const updateQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueRequest,
  output: UpdateQueueResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns a queue membership level to a member
 */
export const associateMemberToQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMemberToQueueRequest,
    output: AssociateMemberToQueueResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the queue environment.
 */
export const updateQueueEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueEnvironmentRequest,
    output: UpdateQueueEnvironmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Assigns a job membership level to a member
 */
export const associateMemberToJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMemberToJobRequest,
    output: AssociateMemberToJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates a member from a job.
 */
export const disassociateMemberFromJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMemberFromJobRequest,
    output: DisassociateMemberFromJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Adds a metered product.
 */
export const putMeteredProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMeteredProductRequest,
  output: PutMeteredProductResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a metered product.
 */
export const deleteMeteredProduct = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMeteredProductRequest,
    output: DeleteMeteredProductResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Modifies the settings for a Deadline Cloud monitor. You can modify one or all of the settings
 * when you call `UpdateMonitor`.
 */
export const updateMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitorRequest,
  output: UpdateMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a Deadline Cloud monitor. After you delete a monitor, you can create a new one and
 * attach farms to the monitor.
 */
export const deleteMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorRequest,
  output: DeleteMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a queue-fleet association.
 */
export const getQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQueueFleetAssociationRequest,
    output: GetQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a specific association between a queue and a limit.
 */
export const getQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQueueLimitAssociationRequest,
    output: GetQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a farm to allow space for queues and fleets. Farms are the space where the
 * components of your renders gather and are pieced together in the cloud. Farms contain
 * budgets and allow you to enforce permissions. Deadline Cloud farms are a useful container for
 * large projects.
 */
export const createFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFarmRequest,
  output: CreateFarmResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a farm.
 */
export const getFarm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFarmRequest,
  output: GetFarmResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a limit that manages the distribution of shared resources, such as floating
 * licenses. A limit can throttle work assignments, help manage workloads, and track current
 * usage. Before you use a limit, you must associate the limit with one or more queues.
 *
 * You must add the `amountRequirementName` to a step in a job template to
 * declare the limit requirement.
 */
export const createLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLimitRequest,
  output: CreateLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific limit.
 */
export const getLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLimitRequest,
  output: GetLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a storage profile.
 */
export const getStorageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageProfileRequest,
  output: GetStorageProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a budget that sets spending thresholds for rendering activity.
 */
export const updateBudget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBudgetRequest,
  output: UpdateBudgetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a queue.
 */
export const getQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueRequest,
  output: GetQueueResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets Amazon Web Services credentials from the queue role. The IAM permissions of the credentials are
 * scoped down to have read-only access.
 */
export const assumeQueueRoleForRead = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeQueueRoleForReadRequest,
    output: AssumeQueueRoleForReadResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Allows a user to assume a role for a queue.
 */
export const assumeQueueRoleForUser = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeQueueRoleForUserRequest,
    output: AssumeQueueRoleForUserResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an environment for a queue that defines how jobs in the queue run.
 */
export const createQueueEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateQueueEnvironmentRequest,
    output: CreateQueueEnvironmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a queue environment.
 */
export const getQueueEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueEnvironmentRequest,
  output: GetQueueEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a storage profile for a queue.
 */
export const getStorageProfileForQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetStorageProfileForQueueRequest,
    output: GetStorageProfileForQueueResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists storage profiles for a queue.
 */
export const listStorageProfilesForQueue =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStorageProfilesForQueueRequest,
    output: ListStorageProfilesForQueueResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "storageProfiles",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a session.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists parameter definitions of a job.
 */
export const listJobParameterDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListJobParameterDefinitionsRequest,
    output: ListJobParameterDefinitionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobParameterDefinitions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a licence endpoint.
 */
export const getLicenseEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseEndpointRequest,
  output: GetLicenseEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists metered products.
 */
export const listMeteredProducts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMeteredProductsRequest,
    output: ListMeteredProductsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "meteredProducts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets information about the specified monitor.
 */
export const getMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitorRequest,
  output: GetMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association between a queue and a limit. You must use the
 * `UpdateQueueLimitAssociation` operation to set the status to
 * `STOP_LIMIT_USAGE_AND_COMPLETE_TASKS` or
 * `STOP_LIMIT_USAGE_AND_CANCEL_TASKS`. The status does not change immediately.
 * Use the `GetQueueLimitAssociation` operation to see if the status changed to
 * `STOPPED` before deleting the association.
 */
export const deleteQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueueLimitAssociationRequest,
    output: DeleteQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a tag from a resource using the resource's ARN and tag to remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a fleet.
 */
export const deleteFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetRequest,
  output: DeleteFleetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a member from a fleet.
 */
export const disassociateMemberFromFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMemberFromFleetRequest,
    output: DisassociateMemberFromFleetResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a worker.
 */
export const deleteWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkerRequest,
  output: DeleteWorkerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a queue.
 *
 * You can't recover the jobs in a queue if you delete the queue. Deleting the queue
 * also deletes the jobs in that queue.
 */
export const deleteQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueRequest,
  output: DeleteQueueResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a member from a queue.
 */
export const disassociateMemberFromQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMemberFromQueueRequest,
    output: DisassociateMemberFromQueueResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a job.
 *
 * When you change the status of the job to `ARCHIVED`, the job can't be
 * scheduled or archived.
 *
 * An archived jobs and its steps and tasks are deleted after 120 days. The job can't be
 * recovered.
 */
export const updateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a session.
 */
export const updateSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSessionRequest,
  output: UpdateSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a step.
 */
export const updateStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStepRequest,
  output: UpdateStepResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a task.
 */
export const updateTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskRequest,
  output: UpdateTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a license endpoint.
 */
export const deleteLicenseEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLicenseEndpointRequest,
    output: DeleteLicenseEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Tags a resource using the resource's ARN and desired tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get credentials from the fleet role for a worker.
 */
export const assumeFleetRoleForWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeFleetRoleForWorkerRequest,
    output: AssumeFleetRoleForWorkerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Allows a worker to assume a queue role.
 */
export const assumeQueueRoleForWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeQueueRoleForWorkerRequest,
    output: AssumeQueueRoleForWorkerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a worker. A worker tells your instance how much processing power (vCPU), and
 * memory (GiB) you’ll need to assemble the digital assets held within a particular instance.
 * You can specify certain instance types to use, or let the worker know which instances types
 * to exclude.
 *
 * Deadline Cloud limits the number of workers to less than or equal to the fleet's
 * maximum worker count. The service maintains eventual consistency for the worker count. If
 * you make multiple rapid calls to `CreateWorker` before the field updates, you
 * might exceed your fleet's maximum worker count. For example, if your
 * `maxWorkerCount` is 10 and you currently have 9 workers, making two quick
 * `CreateWorker` calls might successfully create 2 workers instead of 1,
 * resulting in 11 total workers.
 */
export const createWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkerRequest,
  output: CreateWorkerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a worker.
 */
export const updateWorker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkerRequest,
  output: UpdateWorkerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists farms.
 */
export const listFarms = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFarmsRequest,
  output: ListFarmsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "farms",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of your monitors in Deadline Cloud.
 */
export const listMonitors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMonitorsRequest,
    output: ListMonitorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "monitors",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Removes a limit from the specified farm. Before you delete a limit you must use the
 * `DeleteQueueLimitAssociation` operation to remove the association with any
 * queues.
 */
export const deleteLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLimitRequest,
  output: DeleteLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a storage profile.
 */
export const deleteStorageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStorageProfileRequest,
    output: DeleteStorageProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a queue environment.
 */
export const deleteQueueEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueueEnvironmentRequest,
    output: DeleteQueueEnvironmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an association between a queue and a fleet.
 */
export const createQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateQueueFleetAssociationRequest,
    output: CreateQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists session actions.
 */
export const listSessionActions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSessionActionsRequest,
    output: ListSessionActionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "sessionActions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a license endpoint to integrate your various licensed software used for
 * rendering on Deadline Cloud.
 */
export const createLicenseEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseEndpointRequest,
    output: CreateLicenseEndpointResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Searches for jobs.
 */
export const searchJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchJobsRequest,
  output: SearchJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a fleet. Fleets gather information relating to compute, or capacity, for renders
 * within your farms. You can choose to manage your own capacity or opt to have fleets fully
 * managed by Deadline Cloud.
 */
export const createFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetRequest,
  output: CreateFleetResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get batched job details for a worker.
 */
export const batchGetJobEntity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetJobEntityRequest,
  output: BatchGetJobEntityResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the schedule for a worker.
 */
export const updateWorkerSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkerScheduleRequest,
    output: UpdateWorkerScheduleResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

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
  sdkId: "deadline",
  serviceShapeName: "Deadline",
});
const auth = T.AwsAuthSigv4({ name: "deadline" });
const ver = T.ServiceVersion("2023-10-12");
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
              `https://deadline-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://deadline-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://deadline.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://deadline.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type FarmId = string;
export type QueueId = string;
export type FleetId = string;
export type LimitId = string;
export type AggregationId = string;
export type MaxResults = number;
export type Integer = number;
export type JobId = string;
export type Timezone = string;
export type ClientToken = string;
export type ResourceName = string;
export type Description = string | Redacted.Redacted<string>;
export type KmsKeyArn = string;
export type IdentityCenterPrincipalId = string;
export type IdentityStoreId = string;
export type AmountRequirementName = string;
export type MaxCount = number;
export type StorageProfileId = string;
export type ConsumedUsageLimit = number;
export type BudgetId = string;
export type IamRoleArn = string;
export type MinZeroMaxInteger = number;
export type WorkerId = string;
export type FileSystemLocationName = string;
export type Priority = number;
export type EnvironmentTemplate = string | Redacted.Redacted<string>;
export type QueueEnvironmentId = string;
export type JobTemplate = string | Redacted.Redacted<string>;
export type JobPriority = number;
export type MaxFailedTasksCount = number;
export type MaxRetriesPerTask = number;
export type MaxWorkerCount = number;
export type SessionId = string;
export type SessionActionId = string;
export type StepId = string;
export type TaskId = string;
export type VpcId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type LicenseEndpointId = string;
export type MeteredProductId = string;
export type IdentityCenterInstanceArn = string;
export type Subdomain = string;
export type MonitorId = string;
export type PathString = string;
export type ThresholdPercentage = number;
export type HostConfigurationScript = string | Redacted.Redacted<string>;
export type HostConfigurationScriptTimeoutSeconds = number;
export type HostName = string;
export type S3BucketName = string;
export type S3Prefix = string;
export type S3Key = string;
export type CreatedBy = string;
export type UpdatedBy = string;
export type NextItemOffset = number;
export type TotalResults = number;
export type EnvironmentName = string;
export type JobName = string;
export type TaskFailureRetryCount = number;
export type JobDescription = string | Redacted.Redacted<string>;
export type SessionActionProgressPercent = number;
export type ProcessExitCode = number;
export type SessionActionProgressMessage = string | Redacted.Redacted<string>;
export type StepName = string;
export type StepDescription = string | Redacted.Redacted<string>;
export type TaskRetryCount = number;
export type StatusMessage = string;
export type DnsName = string;
export type IdentityCenterApplicationArn = string;
export type Url = string;
export type IpV4Address = string;
export type IpV6Address = string;
export type AmountCapabilityName = string;
export type AttributeCapabilityName = string;
export type AttributeCapabilityValue = string;
export type EnvironmentId = string;
export type IntString = string;
export type FloatString = string;
export type ParameterString = string;
export type UserId = string;
export type LicenseProduct = string;
export type InstanceType = string;
export type BoundedString = string;
export type PortNumber = number;
export type AccessKeyId = string | Redacted.Redacted<string>;
export type SecretAccessKey = string | Redacted.Redacted<string>;
export type SessionToken = string | Redacted.Redacted<string>;
export type LogDriver = string;
export type LogError = string;
export type MinOneMaxInteger = number;
export type CombinationExpression = string;
export type ParameterValue = string;
export type SearchTerm = string;
export type StringFilter = string;
export type VpcResourceConfigurationArn = string;
export type Double = number;
export type StepParameterName = string;
export type MinOneMaxTenThousand = number;
export type MemoryAmountMiB = number;
export type EbsIops = number;
export type EbsThroughputMiB = number;
export type AcceleratorRuntime = string;
export type UpdateWorkerScheduleInterval = number;

//# Schemas
export type QueueIds = string[];
export const QueueIds = S.Array(S.String);
export type FleetIds = string[];
export const FleetIds = S.Array(S.String);
export type UsageGroupBy = string[];
export const UsageGroupBy = S.Array(S.String);
export type UsageStatistics = string[];
export const UsageStatistics = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type RequiredFileSystemLocationNames = string[];
export const RequiredFileSystemLocationNames = S.Array(S.String);
export type AllowedStorageProfileIds = string[];
export const AllowedStorageProfileIds = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface CreateQueueFleetAssociationRequest {
  farmId: string;
  queueId: string;
  fleetId: string;
}
export const CreateQueueFleetAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String,
    fleetId: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateQueueFleetAssociationRequest",
}) as any as S.Schema<CreateQueueFleetAssociationRequest>;
export interface CreateQueueFleetAssociationResponse {}
export const CreateQueueFleetAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateQueueFleetAssociationResponse",
}) as any as S.Schema<CreateQueueFleetAssociationResponse>;
export interface CreateQueueLimitAssociationRequest {
  farmId: string;
  queueId: string;
  limitId: string;
}
export const CreateQueueLimitAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String,
    limitId: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateQueueLimitAssociationRequest",
}) as any as S.Schema<CreateQueueLimitAssociationRequest>;
export interface CreateQueueLimitAssociationResponse {}
export const CreateQueueLimitAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateQueueLimitAssociationResponse",
}) as any as S.Schema<CreateQueueLimitAssociationResponse>;
export interface DeleteQueueFleetAssociationRequest {
  farmId: string;
  queueId: string;
  fleetId: string;
}
export const DeleteQueueFleetAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteQueueFleetAssociationRequest",
}) as any as S.Schema<DeleteQueueFleetAssociationRequest>;
export interface DeleteQueueFleetAssociationResponse {}
export const DeleteQueueFleetAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQueueFleetAssociationResponse",
}) as any as S.Schema<DeleteQueueFleetAssociationResponse>;
export interface DeleteQueueLimitAssociationRequest {
  farmId: string;
  queueId: string;
  limitId: string;
}
export const DeleteQueueLimitAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteQueueLimitAssociationRequest",
}) as any as S.Schema<DeleteQueueLimitAssociationRequest>;
export interface DeleteQueueLimitAssociationResponse {}
export const DeleteQueueLimitAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQueueLimitAssociationResponse",
}) as any as S.Schema<DeleteQueueLimitAssociationResponse>;
export interface GetQueueFleetAssociationRequest {
  farmId: string;
  queueId: string;
  fleetId: string;
}
export const GetQueueFleetAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueueFleetAssociationRequest",
}) as any as S.Schema<GetQueueFleetAssociationRequest>;
export interface GetQueueLimitAssociationRequest {
  farmId: string;
  queueId: string;
  limitId: string;
}
export const GetQueueLimitAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueueLimitAssociationRequest",
}) as any as S.Schema<GetQueueLimitAssociationRequest>;
export interface GetSessionsStatisticsAggregationRequest {
  farmId: string;
  aggregationId: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetSessionsStatisticsAggregationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    aggregationId: S.String.pipe(T.HttpQuery("aggregationId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSessionsStatisticsAggregationRequest",
}) as any as S.Schema<GetSessionsStatisticsAggregationRequest>;
export interface ListAvailableMeteredProductsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAvailableMeteredProductsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/metered-products" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAvailableMeteredProductsRequest",
}) as any as S.Schema<ListAvailableMeteredProductsRequest>;
export interface ListQueueFleetAssociationsRequest {
  farmId: string;
  queueId?: string;
  fleetId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueueFleetAssociationsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    fleetId: S.optional(S.String).pipe(T.HttpQuery("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListQueueFleetAssociationsRequest",
}) as any as S.Schema<ListQueueFleetAssociationsRequest>;
export interface ListQueueLimitAssociationsRequest {
  farmId: string;
  queueId?: string;
  limitId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueueLimitAssociationsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    limitId: S.optional(S.String).pipe(T.HttpQuery("limitId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListQueueLimitAssociationsRequest",
}) as any as S.Schema<ListQueueLimitAssociationsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface SearchGroupedFilterExpressions {
  filters: SearchFilterExpressions;
  operator: string;
}
export const SearchGroupedFilterExpressions = S.suspend(() =>
  S.Struct({
    filters: S.suspend(() => SearchFilterExpressions).annotations({
      identifier: "SearchFilterExpressions",
    }),
    operator: S.String,
  }),
).annotations({
  identifier: "SearchGroupedFilterExpressions",
}) as any as S.Schema<SearchGroupedFilterExpressions>;
export interface UserJobsFirst {
  userIdentityId: string;
}
export const UserJobsFirst = S.suspend(() =>
  S.Struct({ userIdentityId: S.String }),
).annotations({
  identifier: "UserJobsFirst",
}) as any as S.Schema<UserJobsFirst>;
export interface FieldSortExpression {
  sortOrder: string;
  name: string;
}
export const FieldSortExpression = S.suspend(() =>
  S.Struct({ sortOrder: S.String, name: S.String }),
).annotations({
  identifier: "FieldSortExpression",
}) as any as S.Schema<FieldSortExpression>;
export interface ParameterSortExpression {
  sortOrder: string;
  name: string;
}
export const ParameterSortExpression = S.suspend(() =>
  S.Struct({ sortOrder: S.String, name: S.String }),
).annotations({
  identifier: "ParameterSortExpression",
}) as any as S.Schema<ParameterSortExpression>;
export type SearchSortExpression =
  | { userJobsFirst: UserJobsFirst }
  | { fieldSort: FieldSortExpression }
  | { parameterSort: ParameterSortExpression };
export const SearchSortExpression = S.Union(
  S.Struct({ userJobsFirst: UserJobsFirst }),
  S.Struct({ fieldSort: FieldSortExpression }),
  S.Struct({ parameterSort: ParameterSortExpression }),
);
export type SearchSortExpressions = (typeof SearchSortExpression)["Type"][];
export const SearchSortExpressions = S.Array(SearchSortExpression);
export interface SearchStepsRequest {
  farmId: string;
  queueIds: QueueIds;
  jobId?: string;
  filterExpressions?: SearchGroupedFilterExpressions;
  sortExpressions?: SearchSortExpressions;
  itemOffset: number;
  pageSize?: number;
}
export const SearchStepsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2023-10-12/farms/{farmId}/search/steps",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchStepsRequest",
}) as any as S.Schema<SearchStepsRequest>;
export interface SearchTasksRequest {
  farmId: string;
  queueIds: QueueIds;
  jobId?: string;
  filterExpressions?: SearchGroupedFilterExpressions;
  sortExpressions?: SearchSortExpressions;
  itemOffset: number;
  pageSize?: number;
}
export const SearchTasksRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2023-10-12/farms/{farmId}/search/tasks",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchTasksRequest",
}) as any as S.Schema<SearchTasksRequest>;
export interface SearchWorkersRequest {
  farmId: string;
  fleetIds: FleetIds;
  filterExpressions?: SearchGroupedFilterExpressions;
  sortExpressions?: SearchSortExpressions;
  itemOffset: number;
  pageSize?: number;
}
export const SearchWorkersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetIds: FleetIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "SearchWorkersRequest",
}) as any as S.Schema<SearchWorkersRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: StringList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: StringList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2023-10-12/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateQueueFleetAssociationRequest {
  farmId: string;
  queueId: string;
  fleetId: string;
  status: string;
}
export const UpdateQueueFleetAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    status: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateQueueFleetAssociationRequest",
}) as any as S.Schema<UpdateQueueFleetAssociationRequest>;
export interface UpdateQueueFleetAssociationResponse {}
export const UpdateQueueFleetAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateQueueFleetAssociationResponse",
}) as any as S.Schema<UpdateQueueFleetAssociationResponse>;
export interface UpdateQueueLimitAssociationRequest {
  farmId: string;
  queueId: string;
  limitId: string;
  status: string;
}
export const UpdateQueueLimitAssociationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
    status: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateQueueLimitAssociationRequest",
}) as any as S.Schema<UpdateQueueLimitAssociationRequest>;
export interface UpdateQueueLimitAssociationResponse {}
export const UpdateQueueLimitAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateQueueLimitAssociationResponse",
}) as any as S.Schema<UpdateQueueLimitAssociationResponse>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateFarmRequest {
  clientToken?: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  kmsKeyArn?: string;
  tags?: Tags;
}
export const CreateFarmRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    description: S.optional(SensitiveString),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFarmRequest",
}) as any as S.Schema<CreateFarmRequest>;
export interface GetFarmRequest {
  farmId: string;
}
export const GetFarmRequest = S.suspend(() =>
  S.Struct({ farmId: S.String.pipe(T.HttpLabel("farmId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFarmRequest",
}) as any as S.Schema<GetFarmRequest>;
export interface UpdateFarmRequest {
  farmId: string;
  displayName?: string;
  description?: string | Redacted.Redacted<string>;
}
export const UpdateFarmRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.optional(S.String),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/2023-10-12/farms/{farmId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFarmRequest",
}) as any as S.Schema<UpdateFarmRequest>;
export interface UpdateFarmResponse {}
export const UpdateFarmResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateFarmResponse",
}) as any as S.Schema<UpdateFarmResponse>;
export interface DeleteFarmRequest {
  farmId: string;
}
export const DeleteFarmRequest = S.suspend(() =>
  S.Struct({ farmId: S.String.pipe(T.HttpLabel("farmId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2023-10-12/farms/{farmId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFarmRequest",
}) as any as S.Schema<DeleteFarmRequest>;
export interface DeleteFarmResponse {}
export const DeleteFarmResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFarmResponse",
}) as any as S.Schema<DeleteFarmResponse>;
export interface ListFarmsRequest {
  nextToken?: string;
  principalId?: string;
  maxResults?: number;
}
export const ListFarmsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFarmsRequest",
}) as any as S.Schema<ListFarmsRequest>;
export interface AssociateMemberToFarmRequest {
  farmId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const AssociateMemberToFarmRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateMemberToFarmRequest",
}) as any as S.Schema<AssociateMemberToFarmRequest>;
export interface AssociateMemberToFarmResponse {}
export const AssociateMemberToFarmResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMemberToFarmResponse",
}) as any as S.Schema<AssociateMemberToFarmResponse>;
export interface CreateLimitRequest {
  clientToken?: string;
  displayName: string;
  amountRequirementName: string;
  maxCount: number;
  farmId: string;
  description?: string | Redacted.Redacted<string>;
}
export const CreateLimitRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    amountRequirementName: S.String,
    maxCount: S.Number,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/limits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLimitRequest",
}) as any as S.Schema<CreateLimitRequest>;
export interface DeleteLimitRequest {
  farmId: string;
  limitId: string;
}
export const DeleteLimitRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteLimitRequest",
}) as any as S.Schema<DeleteLimitRequest>;
export interface DeleteLimitResponse {}
export const DeleteLimitResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLimitResponse",
}) as any as S.Schema<DeleteLimitResponse>;
export interface DeleteStorageProfileRequest {
  farmId: string;
  storageProfileId: string;
}
export const DeleteStorageProfileRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteStorageProfileRequest",
}) as any as S.Schema<DeleteStorageProfileRequest>;
export interface DeleteStorageProfileResponse {}
export const DeleteStorageProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteStorageProfileResponse",
}) as any as S.Schema<DeleteStorageProfileResponse>;
export interface DisassociateMemberFromFarmRequest {
  farmId: string;
  principalId: string;
}
export const DisassociateMemberFromFarmRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateMemberFromFarmRequest",
}) as any as S.Schema<DisassociateMemberFromFarmRequest>;
export interface DisassociateMemberFromFarmResponse {}
export const DisassociateMemberFromFarmResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberFromFarmResponse",
}) as any as S.Schema<DisassociateMemberFromFarmResponse>;
export interface GetLimitRequest {
  farmId: string;
  limitId: string;
}
export const GetLimitRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetLimitRequest",
}) as any as S.Schema<GetLimitRequest>;
export interface GetStorageProfileRequest {
  farmId: string;
  storageProfileId: string;
}
export const GetStorageProfileRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetStorageProfileRequest",
}) as any as S.Schema<GetStorageProfileRequest>;
export interface ListFarmMembersRequest {
  farmId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFarmMembersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/members" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFarmMembersRequest",
}) as any as S.Schema<ListFarmMembersRequest>;
export interface ListLimitsRequest {
  farmId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListLimitsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/limits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLimitsRequest",
}) as any as S.Schema<ListLimitsRequest>;
export interface ListStorageProfilesRequest {
  farmId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStorageProfilesRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListStorageProfilesRequest",
}) as any as S.Schema<ListStorageProfilesRequest>;
export interface UpdateLimitRequest {
  farmId: string;
  limitId: string;
  displayName?: string;
  description?: string | Redacted.Redacted<string>;
  maxCount?: number;
}
export const UpdateLimitRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    limitId: S.String.pipe(T.HttpLabel("limitId")),
    displayName: S.optional(S.String),
    description: S.optional(SensitiveString),
    maxCount: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateLimitRequest",
}) as any as S.Schema<UpdateLimitRequest>;
export interface UpdateLimitResponse {}
export const UpdateLimitResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateLimitResponse",
}) as any as S.Schema<UpdateLimitResponse>;
export interface FileSystemLocation {
  name: string;
  path: string;
  type: string;
}
export const FileSystemLocation = S.suspend(() =>
  S.Struct({ name: S.String, path: S.String, type: S.String }),
).annotations({
  identifier: "FileSystemLocation",
}) as any as S.Schema<FileSystemLocation>;
export type FileSystemLocationsList = FileSystemLocation[];
export const FileSystemLocationsList = S.Array(FileSystemLocation);
export interface UpdateStorageProfileRequest {
  clientToken?: string;
  farmId: string;
  storageProfileId: string;
  displayName?: string;
  osFamily?: string;
  fileSystemLocationsToAdd?: FileSystemLocationsList;
  fileSystemLocationsToRemove?: FileSystemLocationsList;
}
export const UpdateStorageProfileRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
    displayName: S.optional(S.String),
    osFamily: S.optional(S.String),
    fileSystemLocationsToAdd: S.optional(FileSystemLocationsList),
    fileSystemLocationsToRemove: S.optional(FileSystemLocationsList),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateStorageProfileRequest",
}) as any as S.Schema<UpdateStorageProfileRequest>;
export interface UpdateStorageProfileResponse {}
export const UpdateStorageProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateStorageProfileResponse",
}) as any as S.Schema<UpdateStorageProfileResponse>;
export interface GetBudgetRequest {
  farmId: string;
  budgetId: string;
}
export const GetBudgetRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBudgetRequest",
}) as any as S.Schema<GetBudgetRequest>;
export interface DeleteBudgetRequest {
  farmId: string;
  budgetId: string;
}
export const DeleteBudgetRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteBudgetRequest",
}) as any as S.Schema<DeleteBudgetRequest>;
export interface DeleteBudgetResponse {}
export const DeleteBudgetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteBudgetResponse",
}) as any as S.Schema<DeleteBudgetResponse>;
export interface ListBudgetsRequest {
  nextToken?: string;
  farmId: string;
  maxResults?: number;
  status?: string;
}
export const ListBudgetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/budgets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBudgetsRequest",
}) as any as S.Schema<ListBudgetsRequest>;
export interface GetFleetRequest {
  farmId: string;
  fleetId: string;
}
export const GetFleetRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetFleetRequest",
}) as any as S.Schema<GetFleetRequest>;
export interface VCpuCountRange {
  min: number;
  max?: number;
}
export const VCpuCountRange = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "VCpuCountRange",
}) as any as S.Schema<VCpuCountRange>;
export interface MemoryMiBRange {
  min: number;
  max?: number;
}
export const MemoryMiBRange = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "MemoryMiBRange",
}) as any as S.Schema<MemoryMiBRange>;
export type AcceleratorTypes = string[];
export const AcceleratorTypes = S.Array(S.String);
export interface AcceleratorCountRange {
  min: number;
  max?: number;
}
export const AcceleratorCountRange = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorCountRange",
}) as any as S.Schema<AcceleratorCountRange>;
export interface AcceleratorTotalMemoryMiBRange {
  min: number;
  max?: number;
}
export const AcceleratorTotalMemoryMiBRange = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorTotalMemoryMiBRange",
}) as any as S.Schema<AcceleratorTotalMemoryMiBRange>;
export interface FleetAmountCapability {
  name: string;
  min: number;
  max?: number;
}
export const FleetAmountCapability = S.suspend(() =>
  S.Struct({ name: S.String, min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "FleetAmountCapability",
}) as any as S.Schema<FleetAmountCapability>;
export type CustomFleetAmountCapabilities = FleetAmountCapability[];
export const CustomFleetAmountCapabilities = S.Array(FleetAmountCapability);
export type AttributeCapabilityValuesList = string[];
export const AttributeCapabilityValuesList = S.Array(S.String);
export interface FleetAttributeCapability {
  name: string;
  values: AttributeCapabilityValuesList;
}
export const FleetAttributeCapability = S.suspend(() =>
  S.Struct({ name: S.String, values: AttributeCapabilityValuesList }),
).annotations({
  identifier: "FleetAttributeCapability",
}) as any as S.Schema<FleetAttributeCapability>;
export type CustomFleetAttributeCapabilities = FleetAttributeCapability[];
export const CustomFleetAttributeCapabilities = S.Array(
  FleetAttributeCapability,
);
export interface CustomerManagedWorkerCapabilities {
  vCpuCount: VCpuCountRange;
  memoryMiB: MemoryMiBRange;
  acceleratorTypes?: AcceleratorTypes;
  acceleratorCount?: AcceleratorCountRange;
  acceleratorTotalMemoryMiB?: AcceleratorTotalMemoryMiBRange;
  osFamily: string;
  cpuArchitectureType: string;
  customAmounts?: CustomFleetAmountCapabilities;
  customAttributes?: CustomFleetAttributeCapabilities;
}
export const CustomerManagedWorkerCapabilities = S.suspend(() =>
  S.Struct({
    vCpuCount: VCpuCountRange,
    memoryMiB: MemoryMiBRange,
    acceleratorTypes: S.optional(AcceleratorTypes),
    acceleratorCount: S.optional(AcceleratorCountRange),
    acceleratorTotalMemoryMiB: S.optional(AcceleratorTotalMemoryMiBRange),
    osFamily: S.String,
    cpuArchitectureType: S.String,
    customAmounts: S.optional(CustomFleetAmountCapabilities),
    customAttributes: S.optional(CustomFleetAttributeCapabilities),
  }),
).annotations({
  identifier: "CustomerManagedWorkerCapabilities",
}) as any as S.Schema<CustomerManagedWorkerCapabilities>;
export interface CustomerManagedFleetConfiguration {
  mode: string;
  workerCapabilities: CustomerManagedWorkerCapabilities;
  storageProfileId?: string;
  tagPropagationMode?: string;
}
export const CustomerManagedFleetConfiguration = S.suspend(() =>
  S.Struct({
    mode: S.String,
    workerCapabilities: CustomerManagedWorkerCapabilities,
    storageProfileId: S.optional(S.String),
    tagPropagationMode: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomerManagedFleetConfiguration",
}) as any as S.Schema<CustomerManagedFleetConfiguration>;
export interface Ec2EbsVolume {
  sizeGiB?: number;
  iops?: number;
  throughputMiB?: number;
}
export const Ec2EbsVolume = S.suspend(() =>
  S.Struct({
    sizeGiB: S.optional(S.Number),
    iops: S.optional(S.Number),
    throughputMiB: S.optional(S.Number),
  }),
).annotations({ identifier: "Ec2EbsVolume" }) as any as S.Schema<Ec2EbsVolume>;
export interface AcceleratorSelection {
  name: string;
  runtime?: string;
}
export const AcceleratorSelection = S.suspend(() =>
  S.Struct({ name: S.String, runtime: S.optional(S.String) }),
).annotations({
  identifier: "AcceleratorSelection",
}) as any as S.Schema<AcceleratorSelection>;
export type AcceleratorSelections = AcceleratorSelection[];
export const AcceleratorSelections = S.Array(AcceleratorSelection);
export interface AcceleratorCapabilities {
  selections: AcceleratorSelections;
  count?: AcceleratorCountRange;
}
export const AcceleratorCapabilities = S.suspend(() =>
  S.Struct({
    selections: AcceleratorSelections,
    count: S.optional(AcceleratorCountRange),
  }),
).annotations({
  identifier: "AcceleratorCapabilities",
}) as any as S.Schema<AcceleratorCapabilities>;
export type InstanceTypes = string[];
export const InstanceTypes = S.Array(S.String);
export interface ServiceManagedEc2InstanceCapabilities {
  vCpuCount: VCpuCountRange;
  memoryMiB: MemoryMiBRange;
  osFamily: string;
  cpuArchitectureType: string;
  rootEbsVolume?: Ec2EbsVolume;
  acceleratorCapabilities?: AcceleratorCapabilities;
  allowedInstanceTypes?: InstanceTypes;
  excludedInstanceTypes?: InstanceTypes;
  customAmounts?: CustomFleetAmountCapabilities;
  customAttributes?: CustomFleetAttributeCapabilities;
}
export const ServiceManagedEc2InstanceCapabilities = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ServiceManagedEc2InstanceCapabilities",
}) as any as S.Schema<ServiceManagedEc2InstanceCapabilities>;
export interface ServiceManagedEc2InstanceMarketOptions {
  type: string;
}
export const ServiceManagedEc2InstanceMarketOptions = S.suspend(() =>
  S.Struct({ type: S.String }),
).annotations({
  identifier: "ServiceManagedEc2InstanceMarketOptions",
}) as any as S.Schema<ServiceManagedEc2InstanceMarketOptions>;
export type VpcResourceConfigurationArns = string[];
export const VpcResourceConfigurationArns = S.Array(S.String);
export interface VpcConfiguration {
  resourceConfigurationArns?: VpcResourceConfigurationArns;
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({
    resourceConfigurationArns: S.optional(VpcResourceConfigurationArns),
  }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export interface ServiceManagedEc2FleetConfiguration {
  instanceCapabilities: ServiceManagedEc2InstanceCapabilities;
  instanceMarketOptions: ServiceManagedEc2InstanceMarketOptions;
  vpcConfiguration?: VpcConfiguration;
  storageProfileId?: string;
}
export const ServiceManagedEc2FleetConfiguration = S.suspend(() =>
  S.Struct({
    instanceCapabilities: ServiceManagedEc2InstanceCapabilities,
    instanceMarketOptions: ServiceManagedEc2InstanceMarketOptions,
    vpcConfiguration: S.optional(VpcConfiguration),
    storageProfileId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceManagedEc2FleetConfiguration",
}) as any as S.Schema<ServiceManagedEc2FleetConfiguration>;
export type FleetConfiguration =
  | { customerManaged: CustomerManagedFleetConfiguration }
  | { serviceManagedEc2: ServiceManagedEc2FleetConfiguration };
export const FleetConfiguration = S.Union(
  S.Struct({ customerManaged: CustomerManagedFleetConfiguration }),
  S.Struct({ serviceManagedEc2: ServiceManagedEc2FleetConfiguration }),
);
export interface HostConfiguration {
  scriptBody: string | Redacted.Redacted<string>;
  scriptTimeoutSeconds?: number;
}
export const HostConfiguration = S.suspend(() =>
  S.Struct({
    scriptBody: SensitiveString,
    scriptTimeoutSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "HostConfiguration",
}) as any as S.Schema<HostConfiguration>;
export interface UpdateFleetRequest {
  clientToken?: string;
  farmId: string;
  fleetId: string;
  displayName?: string;
  description?: string | Redacted.Redacted<string>;
  roleArn?: string;
  minWorkerCount?: number;
  maxWorkerCount?: number;
  configuration?: (typeof FleetConfiguration)["Type"];
  hostConfiguration?: HostConfiguration;
}
export const UpdateFleetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    displayName: S.optional(S.String),
    description: S.optional(SensitiveString),
    roleArn: S.optional(S.String),
    minWorkerCount: S.optional(S.Number),
    maxWorkerCount: S.optional(S.Number),
    configuration: S.optional(FleetConfiguration),
    hostConfiguration: S.optional(HostConfiguration),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateFleetRequest",
}) as any as S.Schema<UpdateFleetRequest>;
export interface UpdateFleetResponse {}
export const UpdateFleetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateFleetResponse",
}) as any as S.Schema<UpdateFleetResponse>;
export interface DeleteFleetRequest {
  clientToken?: string;
  farmId: string;
  fleetId: string;
}
export const DeleteFleetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteFleetRequest",
}) as any as S.Schema<DeleteFleetRequest>;
export interface DeleteFleetResponse {}
export const DeleteFleetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFleetResponse",
}) as any as S.Schema<DeleteFleetResponse>;
export interface ListFleetsRequest {
  farmId: string;
  principalId?: string;
  displayName?: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFleetsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    displayName: S.optional(S.String).pipe(T.HttpQuery("displayName")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/fleets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFleetsRequest",
}) as any as S.Schema<ListFleetsRequest>;
export interface AssociateMemberToFleetRequest {
  farmId: string;
  fleetId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const AssociateMemberToFleetRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateMemberToFleetRequest",
}) as any as S.Schema<AssociateMemberToFleetRequest>;
export interface AssociateMemberToFleetResponse {}
export const AssociateMemberToFleetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMemberToFleetResponse",
}) as any as S.Schema<AssociateMemberToFleetResponse>;
export interface AssumeFleetRoleForReadRequest {
  farmId: string;
  fleetId: string;
}
export const AssumeFleetRoleForReadRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssumeFleetRoleForReadRequest",
}) as any as S.Schema<AssumeFleetRoleForReadRequest>;
export interface DisassociateMemberFromFleetRequest {
  farmId: string;
  fleetId: string;
  principalId: string;
}
export const DisassociateMemberFromFleetRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateMemberFromFleetRequest",
}) as any as S.Schema<DisassociateMemberFromFleetRequest>;
export interface DisassociateMemberFromFleetResponse {}
export const DisassociateMemberFromFleetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberFromFleetResponse",
}) as any as S.Schema<DisassociateMemberFromFleetResponse>;
export interface ListFleetMembersRequest {
  farmId: string;
  fleetId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFleetMembersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListFleetMembersRequest",
}) as any as S.Schema<ListFleetMembersRequest>;
export interface GetWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
}
export const GetWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkerRequest",
}) as any as S.Schema<GetWorkerRequest>;
export interface DeleteWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
}
export const DeleteWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteWorkerRequest",
}) as any as S.Schema<DeleteWorkerRequest>;
export interface DeleteWorkerResponse {}
export const DeleteWorkerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteWorkerResponse",
}) as any as S.Schema<DeleteWorkerResponse>;
export interface ListWorkersRequest {
  farmId: string;
  fleetId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListWorkersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListWorkersRequest",
}) as any as S.Schema<ListWorkersRequest>;
export interface AssumeFleetRoleForWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
}
export const AssumeFleetRoleForWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssumeFleetRoleForWorkerRequest",
}) as any as S.Schema<AssumeFleetRoleForWorkerRequest>;
export interface AssumeQueueRoleForWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
  queueId: string;
}
export const AssumeQueueRoleForWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    queueId: S.String.pipe(T.HttpQuery("queueId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssumeQueueRoleForWorkerRequest",
}) as any as S.Schema<AssumeQueueRoleForWorkerRequest>;
export interface ListSessionsForWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSessionsForWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionsForWorkerRequest",
}) as any as S.Schema<ListSessionsForWorkerRequest>;
export interface GetQueueRequest {
  farmId: string;
  queueId: string;
}
export const GetQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueueRequest",
}) as any as S.Schema<GetQueueRequest>;
export interface JobAttachmentSettings {
  s3BucketName: string;
  rootPrefix: string;
}
export const JobAttachmentSettings = S.suspend(() =>
  S.Struct({ s3BucketName: S.String, rootPrefix: S.String }),
).annotations({
  identifier: "JobAttachmentSettings",
}) as any as S.Schema<JobAttachmentSettings>;
export interface PosixUser {
  user: string;
  group: string;
}
export const PosixUser = S.suspend(() =>
  S.Struct({ user: S.String, group: S.String }),
).annotations({ identifier: "PosixUser" }) as any as S.Schema<PosixUser>;
export interface WindowsUser {
  user: string;
  passwordArn: string;
}
export const WindowsUser = S.suspend(() =>
  S.Struct({ user: S.String, passwordArn: S.String }),
).annotations({ identifier: "WindowsUser" }) as any as S.Schema<WindowsUser>;
export interface JobRunAsUser {
  posix?: PosixUser;
  windows?: WindowsUser;
  runAs: string;
}
export const JobRunAsUser = S.suspend(() =>
  S.Struct({
    posix: S.optional(PosixUser),
    windows: S.optional(WindowsUser),
    runAs: S.String,
  }),
).annotations({ identifier: "JobRunAsUser" }) as any as S.Schema<JobRunAsUser>;
export interface UpdateQueueRequest {
  clientToken?: string;
  farmId: string;
  queueId: string;
  displayName?: string;
  description?: string | Redacted.Redacted<string>;
  defaultBudgetAction?: string;
  jobAttachmentSettings?: JobAttachmentSettings;
  roleArn?: string;
  jobRunAsUser?: JobRunAsUser;
  requiredFileSystemLocationNamesToAdd?: RequiredFileSystemLocationNames;
  requiredFileSystemLocationNamesToRemove?: RequiredFileSystemLocationNames;
  allowedStorageProfileIdsToAdd?: AllowedStorageProfileIds;
  allowedStorageProfileIdsToRemove?: AllowedStorageProfileIds;
}
export const UpdateQueueRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    displayName: S.optional(S.String),
    description: S.optional(SensitiveString),
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateQueueRequest",
}) as any as S.Schema<UpdateQueueRequest>;
export interface UpdateQueueResponse {}
export const UpdateQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateQueueResponse",
}) as any as S.Schema<UpdateQueueResponse>;
export interface DeleteQueueRequest {
  farmId: string;
  queueId: string;
}
export const DeleteQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteQueueRequest",
}) as any as S.Schema<DeleteQueueRequest>;
export interface DeleteQueueResponse {}
export const DeleteQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteQueueResponse",
}) as any as S.Schema<DeleteQueueResponse>;
export interface ListQueuesRequest {
  farmId: string;
  principalId?: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueuesRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/farms/{farmId}/queues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListQueuesRequest",
}) as any as S.Schema<ListQueuesRequest>;
export interface AssociateMemberToQueueRequest {
  farmId: string;
  queueId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const AssociateMemberToQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateMemberToQueueRequest",
}) as any as S.Schema<AssociateMemberToQueueRequest>;
export interface AssociateMemberToQueueResponse {}
export const AssociateMemberToQueueResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMemberToQueueResponse",
}) as any as S.Schema<AssociateMemberToQueueResponse>;
export interface AssumeQueueRoleForReadRequest {
  farmId: string;
  queueId: string;
}
export const AssumeQueueRoleForReadRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssumeQueueRoleForReadRequest",
}) as any as S.Schema<AssumeQueueRoleForReadRequest>;
export interface AssumeQueueRoleForUserRequest {
  farmId: string;
  queueId: string;
}
export const AssumeQueueRoleForUserRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "AssumeQueueRoleForUserRequest",
}) as any as S.Schema<AssumeQueueRoleForUserRequest>;
export interface CreateQueueEnvironmentRequest {
  clientToken?: string;
  farmId: string;
  queueId: string;
  priority: number;
  templateType: string;
  template: string | Redacted.Redacted<string>;
}
export const CreateQueueEnvironmentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    priority: S.Number,
    templateType: S.String,
    template: SensitiveString,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateQueueEnvironmentRequest",
}) as any as S.Schema<CreateQueueEnvironmentRequest>;
export interface DeleteQueueEnvironmentRequest {
  farmId: string;
  queueId: string;
  queueEnvironmentId: string;
}
export const DeleteQueueEnvironmentRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteQueueEnvironmentRequest",
}) as any as S.Schema<DeleteQueueEnvironmentRequest>;
export interface DeleteQueueEnvironmentResponse {}
export const DeleteQueueEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteQueueEnvironmentResponse",
}) as any as S.Schema<DeleteQueueEnvironmentResponse>;
export interface DisassociateMemberFromQueueRequest {
  farmId: string;
  queueId: string;
  principalId: string;
}
export const DisassociateMemberFromQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateMemberFromQueueRequest",
}) as any as S.Schema<DisassociateMemberFromQueueRequest>;
export interface DisassociateMemberFromQueueResponse {}
export const DisassociateMemberFromQueueResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberFromQueueResponse",
}) as any as S.Schema<DisassociateMemberFromQueueResponse>;
export interface GetQueueEnvironmentRequest {
  farmId: string;
  queueId: string;
  queueEnvironmentId: string;
}
export const GetQueueEnvironmentRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetQueueEnvironmentRequest",
}) as any as S.Schema<GetQueueEnvironmentRequest>;
export interface GetStorageProfileForQueueRequest {
  farmId: string;
  queueId: string;
  storageProfileId: string;
}
export const GetStorageProfileForQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    storageProfileId: S.String.pipe(T.HttpLabel("storageProfileId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetStorageProfileForQueueRequest",
}) as any as S.Schema<GetStorageProfileForQueueRequest>;
export interface ListQueueEnvironmentsRequest {
  farmId: string;
  queueId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueueEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListQueueEnvironmentsRequest",
}) as any as S.Schema<ListQueueEnvironmentsRequest>;
export interface ListQueueMembersRequest {
  farmId: string;
  queueId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueueMembersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListQueueMembersRequest",
}) as any as S.Schema<ListQueueMembersRequest>;
export interface ListStorageProfilesForQueueRequest {
  farmId: string;
  queueId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStorageProfilesForQueueRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListStorageProfilesForQueueRequest",
}) as any as S.Schema<ListStorageProfilesForQueueRequest>;
export interface UpdateQueueEnvironmentRequest {
  clientToken?: string;
  farmId: string;
  queueId: string;
  queueEnvironmentId: string;
  priority?: number;
  templateType?: string;
  template?: string | Redacted.Redacted<string>;
}
export const UpdateQueueEnvironmentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    queueEnvironmentId: S.String.pipe(T.HttpLabel("queueEnvironmentId")),
    priority: S.optional(S.Number),
    templateType: S.optional(S.String),
    template: S.optional(SensitiveString),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateQueueEnvironmentRequest",
}) as any as S.Schema<UpdateQueueEnvironmentRequest>;
export interface UpdateQueueEnvironmentResponse {}
export const UpdateQueueEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateQueueEnvironmentResponse",
}) as any as S.Schema<UpdateQueueEnvironmentResponse>;
export interface GetJobRequest {
  farmId: string;
  queueId: string;
  jobId: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface UpdateJobRequest {
  clientToken?: string;
  targetTaskRunStatus?: string;
  priority?: number;
  maxFailedTasksCount?: number;
  maxRetriesPerTask?: number;
  lifecycleStatus?: string;
  maxWorkerCount?: number;
  farmId: string;
  queueId: string;
  jobId: string;
}
export const UpdateJobRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateJobRequest",
}) as any as S.Schema<UpdateJobRequest>;
export interface UpdateJobResponse {}
export const UpdateJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateJobResponse",
}) as any as S.Schema<UpdateJobResponse>;
export interface ListJobsRequest {
  farmId: string;
  principalId?: string;
  queueId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    principalId: S.optional(S.String).pipe(T.HttpQuery("principalId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface AssociateMemberToJobRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const AssociateMemberToJobRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateMemberToJobRequest",
}) as any as S.Schema<AssociateMemberToJobRequest>;
export interface AssociateMemberToJobResponse {}
export const AssociateMemberToJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMemberToJobResponse",
}) as any as S.Schema<AssociateMemberToJobResponse>;
export interface DisassociateMemberFromJobRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  principalId: string;
}
export const DisassociateMemberFromJobRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    principalId: S.String.pipe(T.HttpLabel("principalId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateMemberFromJobRequest",
}) as any as S.Schema<DisassociateMemberFromJobRequest>;
export interface DisassociateMemberFromJobResponse {}
export const DisassociateMemberFromJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberFromJobResponse",
}) as any as S.Schema<DisassociateMemberFromJobResponse>;
export interface GetSessionRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  sessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface GetSessionActionRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  sessionActionId: string;
}
export const GetSessionActionRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionActionId: S.String.pipe(T.HttpLabel("sessionActionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSessionActionRequest",
}) as any as S.Schema<GetSessionActionRequest>;
export interface GetStepRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
}
export const GetStepRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetStepRequest",
}) as any as S.Schema<GetStepRequest>;
export interface GetTaskRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
  taskId: string;
}
export const GetTaskRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetTaskRequest",
}) as any as S.Schema<GetTaskRequest>;
export interface ListJobMembersRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobMembersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListJobMembersRequest",
}) as any as S.Schema<ListJobMembersRequest>;
export interface ListJobParameterDefinitionsRequest {
  farmId: string;
  jobId: string;
  queueId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobParameterDefinitionsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListJobParameterDefinitionsRequest",
}) as any as S.Schema<ListJobParameterDefinitionsRequest>;
export interface ListSessionActionsRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  sessionId?: string;
  taskId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSessionActionsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.optional(S.String).pipe(T.HttpQuery("sessionId")),
    taskId: S.optional(S.String).pipe(T.HttpQuery("taskId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionActionsRequest",
}) as any as S.Schema<ListSessionActionsRequest>;
export interface ListSessionsRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface ListStepConsumersRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStepConsumersRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListStepConsumersRequest",
}) as any as S.Schema<ListStepConsumersRequest>;
export interface ListStepDependenciesRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStepDependenciesRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListStepDependenciesRequest",
}) as any as S.Schema<ListStepDependenciesRequest>;
export interface ListStepsRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListStepsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListStepsRequest",
}) as any as S.Schema<ListStepsRequest>;
export interface ListTasksRequest {
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTasksRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTasksRequest",
}) as any as S.Schema<ListTasksRequest>;
export interface UpdateSessionRequest {
  clientToken?: string;
  targetLifecycleStatus: string;
  farmId: string;
  queueId: string;
  jobId: string;
  sessionId: string;
}
export const UpdateSessionRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    targetLifecycleStatus: S.String,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSessionRequest",
}) as any as S.Schema<UpdateSessionRequest>;
export interface UpdateSessionResponse {}
export const UpdateSessionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateSessionResponse",
}) as any as S.Schema<UpdateSessionResponse>;
export interface UpdateStepRequest {
  targetTaskRunStatus: string;
  clientToken?: string;
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
}
export const UpdateStepRequest = S.suspend(() =>
  S.Struct({
    targetTaskRunStatus: S.String,
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateStepRequest",
}) as any as S.Schema<UpdateStepRequest>;
export interface UpdateStepResponse {}
export const UpdateStepResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateStepResponse",
}) as any as S.Schema<UpdateStepResponse>;
export interface UpdateTaskRequest {
  clientToken?: string;
  targetRunStatus: string;
  farmId: string;
  queueId: string;
  jobId: string;
  stepId: string;
  taskId: string;
}
export const UpdateTaskRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    targetRunStatus: S.String,
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    stepId: S.String.pipe(T.HttpLabel("stepId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateTaskRequest",
}) as any as S.Schema<UpdateTaskRequest>;
export interface UpdateTaskResponse {}
export const UpdateTaskResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateTaskResponse",
}) as any as S.Schema<UpdateTaskResponse>;
export interface CreateLicenseEndpointRequest {
  clientToken?: string;
  vpcId: string;
  subnetIds: SubnetIdList;
  securityGroupIds: SecurityGroupIdList;
  tags?: Tags;
}
export const CreateLicenseEndpointRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    vpcId: S.String,
    subnetIds: SubnetIdList,
    securityGroupIds: SecurityGroupIdList,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/license-endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLicenseEndpointRequest",
}) as any as S.Schema<CreateLicenseEndpointRequest>;
export interface GetLicenseEndpointRequest {
  licenseEndpointId: string;
}
export const GetLicenseEndpointRequest = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetLicenseEndpointRequest",
}) as any as S.Schema<GetLicenseEndpointRequest>;
export interface DeleteLicenseEndpointRequest {
  licenseEndpointId: string;
}
export const DeleteLicenseEndpointRequest = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteLicenseEndpointRequest",
}) as any as S.Schema<DeleteLicenseEndpointRequest>;
export interface DeleteLicenseEndpointResponse {}
export const DeleteLicenseEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLicenseEndpointResponse",
}) as any as S.Schema<DeleteLicenseEndpointResponse>;
export interface ListLicenseEndpointsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListLicenseEndpointsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/license-endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLicenseEndpointsRequest",
}) as any as S.Schema<ListLicenseEndpointsRequest>;
export interface PutMeteredProductRequest {
  licenseEndpointId: string;
  productId: string;
}
export const PutMeteredProductRequest = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    productId: S.String.pipe(T.HttpLabel("productId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutMeteredProductRequest",
}) as any as S.Schema<PutMeteredProductRequest>;
export interface PutMeteredProductResponse {}
export const PutMeteredProductResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutMeteredProductResponse",
}) as any as S.Schema<PutMeteredProductResponse>;
export interface DeleteMeteredProductRequest {
  licenseEndpointId: string;
  productId: string;
}
export const DeleteMeteredProductRequest = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    productId: S.String.pipe(T.HttpLabel("productId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteMeteredProductRequest",
}) as any as S.Schema<DeleteMeteredProductRequest>;
export interface DeleteMeteredProductResponse {}
export const DeleteMeteredProductResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMeteredProductResponse",
}) as any as S.Schema<DeleteMeteredProductResponse>;
export interface ListMeteredProductsRequest {
  licenseEndpointId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMeteredProductsRequest = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String.pipe(T.HttpLabel("licenseEndpointId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListMeteredProductsRequest",
}) as any as S.Schema<ListMeteredProductsRequest>;
export interface CreateMonitorRequest {
  clientToken?: string;
  displayName: string;
  identityCenterInstanceArn: string;
  subdomain: string;
  roleArn: string;
  tags?: Tags;
}
export const CreateMonitorRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    displayName: S.String,
    identityCenterInstanceArn: S.String,
    subdomain: S.String,
    roleArn: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMonitorRequest",
}) as any as S.Schema<CreateMonitorRequest>;
export interface GetMonitorRequest {
  monitorId: string;
}
export const GetMonitorRequest = S.suspend(() =>
  S.Struct({ monitorId: S.String.pipe(T.HttpLabel("monitorId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/monitors/{monitorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMonitorRequest",
}) as any as S.Schema<GetMonitorRequest>;
export interface UpdateMonitorRequest {
  monitorId: string;
  subdomain?: string;
  displayName?: string;
  roleArn?: string;
}
export const UpdateMonitorRequest = S.suspend(() =>
  S.Struct({
    monitorId: S.String.pipe(T.HttpLabel("monitorId")),
    subdomain: S.optional(S.String),
    displayName: S.optional(S.String),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/2023-10-12/monitors/{monitorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMonitorRequest",
}) as any as S.Schema<UpdateMonitorRequest>;
export interface UpdateMonitorResponse {}
export const UpdateMonitorResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateMonitorResponse",
}) as any as S.Schema<UpdateMonitorResponse>;
export interface DeleteMonitorRequest {
  monitorId: string;
}
export const DeleteMonitorRequest = S.suspend(() =>
  S.Struct({ monitorId: S.String.pipe(T.HttpLabel("monitorId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/2023-10-12/monitors/{monitorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMonitorRequest",
}) as any as S.Schema<DeleteMonitorRequest>;
export interface DeleteMonitorResponse {}
export const DeleteMonitorResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMonitorResponse",
}) as any as S.Schema<DeleteMonitorResponse>;
export interface ListMonitorsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListMonitorsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2023-10-12/monitors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMonitorsRequest",
}) as any as S.Schema<ListMonitorsRequest>;
export type SessionsStatisticsResources =
  | { queueIds: QueueIds }
  | { fleetIds: FleetIds };
export const SessionsStatisticsResources = S.Union(
  S.Struct({ queueIds: QueueIds }),
  S.Struct({ fleetIds: FleetIds }),
);
export type UsageTrackingResource = { queueId: string };
export const UsageTrackingResource = S.Union(S.Struct({ queueId: S.String }));
export interface BudgetActionToAdd {
  type: string;
  thresholdPercentage: number;
  description?: string | Redacted.Redacted<string>;
}
export const BudgetActionToAdd = S.suspend(() =>
  S.Struct({
    type: S.String,
    thresholdPercentage: S.Number,
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "BudgetActionToAdd",
}) as any as S.Schema<BudgetActionToAdd>;
export type BudgetActionsToAdd = BudgetActionToAdd[];
export const BudgetActionsToAdd = S.Array(BudgetActionToAdd);
export interface BudgetActionToRemove {
  type: string;
  thresholdPercentage: number;
}
export const BudgetActionToRemove = S.suspend(() =>
  S.Struct({ type: S.String, thresholdPercentage: S.Number }),
).annotations({
  identifier: "BudgetActionToRemove",
}) as any as S.Schema<BudgetActionToRemove>;
export type BudgetActionsToRemove = BudgetActionToRemove[];
export const BudgetActionsToRemove = S.Array(BudgetActionToRemove);
export interface S3Location {
  bucketName: string;
  key: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucketName: S.String, key: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export type JobParameterDefinitions = any[];
export const JobParameterDefinitions = S.Array(S.Any);
export type IpV4Addresses = string[];
export const IpV4Addresses = S.Array(S.String);
export type IpV6Addresses = string[];
export const IpV6Addresses = S.Array(S.String);
export type OutputRelativeDirectoriesList = string[];
export const OutputRelativeDirectoriesList = S.Array(S.String);
export interface GetQueueFleetAssociationResponse {
  queueId: string;
  fleetId: string;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetQueueFleetAssociationResponse = S.suspend(() =>
  S.Struct({
    queueId: S.String,
    fleetId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueueFleetAssociationResponse",
}) as any as S.Schema<GetQueueFleetAssociationResponse>;
export interface GetQueueLimitAssociationResponse {
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  queueId: string;
  limitId: string;
  status: string;
}
export const GetQueueLimitAssociationResponse = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    queueId: S.String,
    limitId: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "GetQueueLimitAssociationResponse",
}) as any as S.Schema<GetQueueLimitAssociationResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartSessionsStatisticsAggregationRequest {
  farmId: string;
  resourceIds: (typeof SessionsStatisticsResources)["Type"];
  startTime: Date;
  endTime: Date;
  timezone?: string;
  period?: string;
  groupBy: UsageGroupBy;
  statistics: UsageStatistics;
}
export const StartSessionsStatisticsAggregationRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    resourceIds: SessionsStatisticsResources,
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    timezone: S.optional(S.String),
    period: S.optional(S.String),
    groupBy: UsageGroupBy,
    statistics: UsageStatistics,
  }).pipe(
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
  ),
).annotations({
  identifier: "StartSessionsStatisticsAggregationRequest",
}) as any as S.Schema<StartSessionsStatisticsAggregationRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags?: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateFarmResponse {
  farmId: string;
}
export const CreateFarmResponse = S.suspend(() =>
  S.Struct({ farmId: S.String }),
).annotations({
  identifier: "CreateFarmResponse",
}) as any as S.Schema<CreateFarmResponse>;
export interface GetFarmResponse {
  farmId: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  kmsKeyArn: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetFarmResponse = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    displayName: S.String,
    description: S.optional(SensitiveString),
    kmsKeyArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFarmResponse",
}) as any as S.Schema<GetFarmResponse>;
export interface CreateLimitResponse {
  limitId: string;
}
export const CreateLimitResponse = S.suspend(() =>
  S.Struct({ limitId: S.String }),
).annotations({
  identifier: "CreateLimitResponse",
}) as any as S.Schema<CreateLimitResponse>;
export interface CreateStorageProfileRequest {
  clientToken?: string;
  farmId: string;
  displayName: string;
  osFamily: string;
  fileSystemLocations?: FileSystemLocationsList;
}
export const CreateStorageProfileRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    osFamily: S.String,
    fileSystemLocations: S.optional(FileSystemLocationsList),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateStorageProfileRequest",
}) as any as S.Schema<CreateStorageProfileRequest>;
export interface GetLimitResponse {
  displayName: string;
  amountRequirementName: string;
  maxCount: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  farmId: string;
  limitId: string;
  currentCount: number;
  description?: string | Redacted.Redacted<string>;
}
export const GetLimitResponse = S.suspend(() =>
  S.Struct({
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
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GetLimitResponse",
}) as any as S.Schema<GetLimitResponse>;
export interface GetStorageProfileResponse {
  storageProfileId: string;
  displayName: string;
  osFamily: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  fileSystemLocations?: FileSystemLocationsList;
}
export const GetStorageProfileResponse = S.suspend(() =>
  S.Struct({
    storageProfileId: S.String,
    displayName: S.String,
    osFamily: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    fileSystemLocations: S.optional(FileSystemLocationsList),
  }),
).annotations({
  identifier: "GetStorageProfileResponse",
}) as any as S.Schema<GetStorageProfileResponse>;
export interface FixedBudgetSchedule {
  startTime: Date;
  endTime: Date;
}
export const FixedBudgetSchedule = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "FixedBudgetSchedule",
}) as any as S.Schema<FixedBudgetSchedule>;
export type BudgetSchedule = { fixed: FixedBudgetSchedule };
export const BudgetSchedule = S.Union(S.Struct({ fixed: FixedBudgetSchedule }));
export interface UpdateBudgetRequest {
  clientToken?: string;
  farmId: string;
  budgetId: string;
  displayName?: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  approximateDollarLimit?: number;
  actionsToAdd?: BudgetActionsToAdd;
  actionsToRemove?: BudgetActionsToRemove;
  schedule?: (typeof BudgetSchedule)["Type"];
}
export const UpdateBudgetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    budgetId: S.String.pipe(T.HttpLabel("budgetId")),
    displayName: S.optional(S.String),
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    approximateDollarLimit: S.optional(S.Number),
    actionsToAdd: S.optional(BudgetActionsToAdd),
    actionsToRemove: S.optional(BudgetActionsToRemove),
    schedule: S.optional(BudgetSchedule),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateBudgetRequest",
}) as any as S.Schema<UpdateBudgetRequest>;
export interface UpdateBudgetResponse {}
export const UpdateBudgetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateBudgetResponse",
}) as any as S.Schema<UpdateBudgetResponse>;
export interface AwsCredentials {
  accessKeyId: string | Redacted.Redacted<string>;
  secretAccessKey: string | Redacted.Redacted<string>;
  sessionToken: string | Redacted.Redacted<string>;
  expiration: Date;
}
export const AwsCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: SensitiveString,
    secretAccessKey: SensitiveString,
    sessionToken: SensitiveString,
    expiration: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AwsCredentials",
}) as any as S.Schema<AwsCredentials>;
export interface AssumeFleetRoleForWorkerResponse {
  credentials: AwsCredentials;
}
export const AssumeFleetRoleForWorkerResponse = S.suspend(() =>
  S.Struct({ credentials: AwsCredentials }),
).annotations({
  identifier: "AssumeFleetRoleForWorkerResponse",
}) as any as S.Schema<AssumeFleetRoleForWorkerResponse>;
export interface AssumeQueueRoleForWorkerResponse {
  credentials?: AwsCredentials;
}
export const AssumeQueueRoleForWorkerResponse = S.suspend(() =>
  S.Struct({ credentials: S.optional(AwsCredentials) }),
).annotations({
  identifier: "AssumeQueueRoleForWorkerResponse",
}) as any as S.Schema<AssumeQueueRoleForWorkerResponse>;
export interface GetQueueResponse {
  queueId: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  farmId: string;
  status: string;
  defaultBudgetAction: string;
  blockedReason?: string;
  jobAttachmentSettings?: JobAttachmentSettings;
  roleArn?: string;
  requiredFileSystemLocationNames?: RequiredFileSystemLocationNames;
  allowedStorageProfileIds?: AllowedStorageProfileIds;
  jobRunAsUser?: JobRunAsUser;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetQueueResponse = S.suspend(() =>
  S.Struct({
    queueId: S.String,
    displayName: S.String,
    description: S.optional(SensitiveString),
    farmId: S.String,
    status: S.String,
    defaultBudgetAction: S.String,
    blockedReason: S.optional(S.String),
    jobAttachmentSettings: S.optional(JobAttachmentSettings),
    roleArn: S.optional(S.String),
    requiredFileSystemLocationNames: S.optional(
      RequiredFileSystemLocationNames,
    ),
    allowedStorageProfileIds: S.optional(AllowedStorageProfileIds),
    jobRunAsUser: S.optional(JobRunAsUser),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueueResponse",
}) as any as S.Schema<GetQueueResponse>;
export interface AssumeQueueRoleForReadResponse {
  credentials: AwsCredentials;
}
export const AssumeQueueRoleForReadResponse = S.suspend(() =>
  S.Struct({ credentials: AwsCredentials }),
).annotations({
  identifier: "AssumeQueueRoleForReadResponse",
}) as any as S.Schema<AssumeQueueRoleForReadResponse>;
export interface AssumeQueueRoleForUserResponse {
  credentials: AwsCredentials;
}
export const AssumeQueueRoleForUserResponse = S.suspend(() =>
  S.Struct({ credentials: AwsCredentials }),
).annotations({
  identifier: "AssumeQueueRoleForUserResponse",
}) as any as S.Schema<AssumeQueueRoleForUserResponse>;
export interface CreateQueueEnvironmentResponse {
  queueEnvironmentId: string;
}
export const CreateQueueEnvironmentResponse = S.suspend(() =>
  S.Struct({ queueEnvironmentId: S.String }),
).annotations({
  identifier: "CreateQueueEnvironmentResponse",
}) as any as S.Schema<CreateQueueEnvironmentResponse>;
export interface GetQueueEnvironmentResponse {
  queueEnvironmentId: string;
  name: string;
  priority: number;
  templateType: string;
  template: string | Redacted.Redacted<string>;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetQueueEnvironmentResponse = S.suspend(() =>
  S.Struct({
    queueEnvironmentId: S.String,
    name: S.String,
    priority: S.Number,
    templateType: S.String,
    template: SensitiveString,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueueEnvironmentResponse",
}) as any as S.Schema<GetQueueEnvironmentResponse>;
export interface GetStorageProfileForQueueResponse {
  storageProfileId: string;
  displayName: string;
  osFamily: string;
  fileSystemLocations?: FileSystemLocationsList;
}
export const GetStorageProfileForQueueResponse = S.suspend(() =>
  S.Struct({
    storageProfileId: S.String,
    displayName: S.String,
    osFamily: S.String,
    fileSystemLocations: S.optional(FileSystemLocationsList),
  }),
).annotations({
  identifier: "GetStorageProfileForQueueResponse",
}) as any as S.Schema<GetStorageProfileForQueueResponse>;
export interface StorageProfileSummary {
  storageProfileId: string;
  displayName: string;
  osFamily: string;
}
export const StorageProfileSummary = S.suspend(() =>
  S.Struct({
    storageProfileId: S.String,
    displayName: S.String,
    osFamily: S.String,
  }),
).annotations({
  identifier: "StorageProfileSummary",
}) as any as S.Schema<StorageProfileSummary>;
export type StorageProfileSummaries = StorageProfileSummary[];
export const StorageProfileSummaries = S.Array(StorageProfileSummary);
export interface ListStorageProfilesForQueueResponse {
  storageProfiles: StorageProfileSummaries;
  nextToken?: string;
}
export const ListStorageProfilesForQueueResponse = S.suspend(() =>
  S.Struct({
    storageProfiles: StorageProfileSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStorageProfilesForQueueResponse",
}) as any as S.Schema<ListStorageProfilesForQueueResponse>;
export interface CopyJobTemplateRequest {
  farmId: string;
  jobId: string;
  queueId: string;
  targetS3Location: S3Location;
}
export const CopyJobTemplateRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    targetS3Location: S3Location,
  }).pipe(
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
  ),
).annotations({
  identifier: "CopyJobTemplateRequest",
}) as any as S.Schema<CopyJobTemplateRequest>;
export type LogOptions = { [key: string]: string };
export const LogOptions = S.Record({ key: S.String, value: S.String });
export type LogParameters = { [key: string]: string };
export const LogParameters = S.Record({ key: S.String, value: S.String });
export interface LogConfiguration {
  logDriver: string;
  options?: LogOptions;
  parameters?: LogParameters;
  error?: string;
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({
    logDriver: S.String,
    options: S.optional(LogOptions),
    parameters: S.optional(LogParameters),
    error: S.optional(S.String),
  }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export interface IpAddresses {
  ipV4Addresses?: IpV4Addresses;
  ipV6Addresses?: IpV6Addresses;
}
export const IpAddresses = S.suspend(() =>
  S.Struct({
    ipV4Addresses: S.optional(IpV4Addresses),
    ipV6Addresses: S.optional(IpV6Addresses),
  }),
).annotations({ identifier: "IpAddresses" }) as any as S.Schema<IpAddresses>;
export interface HostPropertiesResponse {
  ipAddresses?: IpAddresses;
  hostName?: string;
  ec2InstanceArn?: string;
  ec2InstanceType?: string;
}
export const HostPropertiesResponse = S.suspend(() =>
  S.Struct({
    ipAddresses: S.optional(IpAddresses),
    hostName: S.optional(S.String),
    ec2InstanceArn: S.optional(S.String),
    ec2InstanceType: S.optional(S.String),
  }),
).annotations({
  identifier: "HostPropertiesResponse",
}) as any as S.Schema<HostPropertiesResponse>;
export interface GetSessionResponse {
  sessionId: string;
  fleetId: string;
  workerId: string;
  startedAt: Date;
  log: LogConfiguration;
  lifecycleStatus: string;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  targetLifecycleStatus?: string;
  hostProperties?: HostPropertiesResponse;
  workerLog?: LogConfiguration;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface ListJobParameterDefinitionsResponse {
  jobParameterDefinitions: JobParameterDefinitions;
  nextToken?: string;
}
export const ListJobParameterDefinitionsResponse = S.suspend(() =>
  S.Struct({
    jobParameterDefinitions: JobParameterDefinitions,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobParameterDefinitionsResponse",
}) as any as S.Schema<ListJobParameterDefinitionsResponse>;
export interface CreateLicenseEndpointResponse {
  licenseEndpointId: string;
}
export const CreateLicenseEndpointResponse = S.suspend(() =>
  S.Struct({ licenseEndpointId: S.String }),
).annotations({
  identifier: "CreateLicenseEndpointResponse",
}) as any as S.Schema<CreateLicenseEndpointResponse>;
export interface GetLicenseEndpointResponse {
  licenseEndpointId: string;
  status: string;
  statusMessage: string;
  vpcId?: string;
  dnsName?: string;
  subnetIds?: SubnetIdList;
  securityGroupIds?: SecurityGroupIdList;
}
export const GetLicenseEndpointResponse = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.String,
    status: S.String,
    statusMessage: S.String,
    vpcId: S.optional(S.String),
    dnsName: S.optional(S.String),
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
  }),
).annotations({
  identifier: "GetLicenseEndpointResponse",
}) as any as S.Schema<GetLicenseEndpointResponse>;
export interface MeteredProductSummary {
  productId: string;
  family: string;
  vendor: string;
  port: number;
}
export const MeteredProductSummary = S.suspend(() =>
  S.Struct({
    productId: S.String,
    family: S.String,
    vendor: S.String,
    port: S.Number,
  }),
).annotations({
  identifier: "MeteredProductSummary",
}) as any as S.Schema<MeteredProductSummary>;
export type MeteredProductSummaryList = MeteredProductSummary[];
export const MeteredProductSummaryList = S.Array(MeteredProductSummary);
export interface ListMeteredProductsResponse {
  meteredProducts: MeteredProductSummaryList;
  nextToken?: string;
}
export const ListMeteredProductsResponse = S.suspend(() =>
  S.Struct({
    meteredProducts: MeteredProductSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMeteredProductsResponse",
}) as any as S.Schema<ListMeteredProductsResponse>;
export interface CreateMonitorResponse {
  monitorId: string;
  identityCenterApplicationArn: string;
}
export const CreateMonitorResponse = S.suspend(() =>
  S.Struct({ monitorId: S.String, identityCenterApplicationArn: S.String }),
).annotations({
  identifier: "CreateMonitorResponse",
}) as any as S.Schema<CreateMonitorResponse>;
export interface GetMonitorResponse {
  monitorId: string;
  displayName: string;
  subdomain: string;
  url: string;
  roleArn: string;
  identityCenterInstanceArn: string;
  identityCenterApplicationArn: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetMonitorResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetMonitorResponse",
}) as any as S.Schema<GetMonitorResponse>;
export interface WorkerAmountCapability {
  name: string;
  value: number;
}
export const WorkerAmountCapability = S.suspend(() =>
  S.Struct({ name: S.String, value: S.Number }),
).annotations({
  identifier: "WorkerAmountCapability",
}) as any as S.Schema<WorkerAmountCapability>;
export type WorkerAmountCapabilityList = WorkerAmountCapability[];
export const WorkerAmountCapabilityList = S.Array(WorkerAmountCapability);
export interface WorkerAttributeCapability {
  name: string;
  values: AttributeCapabilityValuesList;
}
export const WorkerAttributeCapability = S.suspend(() =>
  S.Struct({ name: S.String, values: AttributeCapabilityValuesList }),
).annotations({
  identifier: "WorkerAttributeCapability",
}) as any as S.Schema<WorkerAttributeCapability>;
export type WorkerAttributeCapabilityList = WorkerAttributeCapability[];
export const WorkerAttributeCapabilityList = S.Array(WorkerAttributeCapability);
export interface JobDetailsIdentifiers {
  jobId: string;
}
export const JobDetailsIdentifiers = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "JobDetailsIdentifiers",
}) as any as S.Schema<JobDetailsIdentifiers>;
export interface JobAttachmentDetailsIdentifiers {
  jobId: string;
}
export const JobAttachmentDetailsIdentifiers = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "JobAttachmentDetailsIdentifiers",
}) as any as S.Schema<JobAttachmentDetailsIdentifiers>;
export interface StepDetailsIdentifiers {
  jobId: string;
  stepId: string;
}
export const StepDetailsIdentifiers = S.suspend(() =>
  S.Struct({ jobId: S.String, stepId: S.String }),
).annotations({
  identifier: "StepDetailsIdentifiers",
}) as any as S.Schema<StepDetailsIdentifiers>;
export interface EnvironmentDetailsIdentifiers {
  jobId: string;
  environmentId: string;
}
export const EnvironmentDetailsIdentifiers = S.suspend(() =>
  S.Struct({ jobId: S.String, environmentId: S.String }),
).annotations({
  identifier: "EnvironmentDetailsIdentifiers",
}) as any as S.Schema<EnvironmentDetailsIdentifiers>;
export type JobParameter =
  | { int: string }
  | { float: string }
  | { string: string }
  | { path: string };
export const JobParameter = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
);
export interface ManifestProperties {
  fileSystemLocationName?: string;
  rootPath: string;
  rootPathFormat: string;
  outputRelativeDirectories?: OutputRelativeDirectoriesList;
  inputManifestPath?: string;
  inputManifestHash?: string;
}
export const ManifestProperties = S.suspend(() =>
  S.Struct({
    fileSystemLocationName: S.optional(S.String),
    rootPath: S.String,
    rootPathFormat: S.String,
    outputRelativeDirectories: S.optional(OutputRelativeDirectoriesList),
    inputManifestPath: S.optional(S.String),
    inputManifestHash: S.optional(S.String),
  }),
).annotations({
  identifier: "ManifestProperties",
}) as any as S.Schema<ManifestProperties>;
export type ManifestPropertiesList = ManifestProperties[];
export const ManifestPropertiesList = S.Array(ManifestProperties);
export type ExceptionContext = { [key: string]: string };
export const ExceptionContext = S.Record({ key: S.String, value: S.String });
export interface QueueFleetAssociationSummary {
  queueId: string;
  fleetId: string;
  status: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const QueueFleetAssociationSummary = S.suspend(() =>
  S.Struct({
    queueId: S.String,
    fleetId: S.String,
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "QueueFleetAssociationSummary",
}) as any as S.Schema<QueueFleetAssociationSummary>;
export type QueueFleetAssociationSummaries = QueueFleetAssociationSummary[];
export const QueueFleetAssociationSummaries = S.Array(
  QueueFleetAssociationSummary,
);
export interface QueueLimitAssociationSummary {
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  queueId: string;
  limitId: string;
  status: string;
}
export const QueueLimitAssociationSummary = S.suspend(() =>
  S.Struct({
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    queueId: S.String,
    limitId: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "QueueLimitAssociationSummary",
}) as any as S.Schema<QueueLimitAssociationSummary>;
export type QueueLimitAssociationSummaries = QueueLimitAssociationSummary[];
export const QueueLimitAssociationSummaries = S.Array(
  QueueLimitAssociationSummary,
);
export type TaskRunStatusCounts = { [key: string]: number };
export const TaskRunStatusCounts = S.Record({ key: S.String, value: S.Number });
export interface StepParameter {
  name: string;
  type: string;
}
export const StepParameter = S.suspend(() =>
  S.Struct({ name: S.String, type: S.String }),
).annotations({
  identifier: "StepParameter",
}) as any as S.Schema<StepParameter>;
export type StepParameterList = StepParameter[];
export const StepParameterList = S.Array(StepParameter);
export interface ParameterSpace {
  parameters: StepParameterList;
  combination?: string;
}
export const ParameterSpace = S.suspend(() =>
  S.Struct({
    parameters: StepParameterList,
    combination: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterSpace",
}) as any as S.Schema<ParameterSpace>;
export interface StepSearchSummary {
  stepId?: string;
  jobId?: string;
  queueId?: string;
  name?: string;
  lifecycleStatus?: string;
  lifecycleStatusMessage?: string;
  taskRunStatus?: string;
  targetTaskRunStatus?: string;
  taskRunStatusCounts?: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  createdAt?: Date;
  createdBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  parameterSpace?: ParameterSpace;
}
export const StepSearchSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "StepSearchSummary",
}) as any as S.Schema<StepSearchSummary>;
export type StepSearchSummaries = StepSearchSummary[];
export const StepSearchSummaries = S.Array(StepSearchSummary);
export type TaskParameterValue =
  | { int: string }
  | { float: string }
  | { string: string }
  | { path: string }
  | { chunkInt: string };
export const TaskParameterValue = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
  S.Struct({ chunkInt: S.String }),
);
export type TaskParameters = {
  [key: string]: (typeof TaskParameterValue)["Type"];
};
export const TaskParameters = S.Record({
  key: S.String,
  value: TaskParameterValue,
});
export interface TaskSearchSummary {
  taskId?: string;
  stepId?: string;
  jobId?: string;
  queueId?: string;
  runStatus?: string;
  targetRunStatus?: string;
  parameters?: TaskParameters;
  failureRetryCount?: number;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
}
export const TaskSearchSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TaskSearchSummary",
}) as any as S.Schema<TaskSearchSummary>;
export type TaskSearchSummaries = TaskSearchSummary[];
export const TaskSearchSummaries = S.Array(TaskSearchSummary);
export interface WorkerSearchSummary {
  fleetId?: string;
  workerId?: string;
  status?: string;
  hostProperties?: HostPropertiesResponse;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
export const WorkerSearchSummary = S.suspend(() =>
  S.Struct({
    fleetId: S.optional(S.String),
    workerId: S.optional(S.String),
    status: S.optional(S.String),
    hostProperties: S.optional(HostPropertiesResponse),
    createdBy: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "WorkerSearchSummary",
}) as any as S.Schema<WorkerSearchSummary>;
export type WorkerSearchSummaries = WorkerSearchSummary[];
export const WorkerSearchSummaries = S.Array(WorkerSearchSummary);
export interface FarmSummary {
  farmId: string;
  displayName: string;
  kmsKeyArn?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const FarmSummary = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    displayName: S.String,
    kmsKeyArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdBy: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({ identifier: "FarmSummary" }) as any as S.Schema<FarmSummary>;
export type FarmSummaries = FarmSummary[];
export const FarmSummaries = S.Array(FarmSummary);
export interface FarmMember {
  farmId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const FarmMember = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    principalId: S.String,
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }),
).annotations({ identifier: "FarmMember" }) as any as S.Schema<FarmMember>;
export type FarmMembers = FarmMember[];
export const FarmMembers = S.Array(FarmMember);
export interface LimitSummary {
  displayName: string;
  amountRequirementName: string;
  maxCount: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  farmId: string;
  limitId: string;
  currentCount: number;
}
export const LimitSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "LimitSummary" }) as any as S.Schema<LimitSummary>;
export type LimitSummaries = LimitSummary[];
export const LimitSummaries = S.Array(LimitSummary);
export interface ConsumedUsages {
  approximateDollarUsage: number;
}
export const ConsumedUsages = S.suspend(() =>
  S.Struct({ approximateDollarUsage: S.Number }),
).annotations({
  identifier: "ConsumedUsages",
}) as any as S.Schema<ConsumedUsages>;
export interface ResponseBudgetAction {
  type: string;
  thresholdPercentage: number;
  description?: string | Redacted.Redacted<string>;
}
export const ResponseBudgetAction = S.suspend(() =>
  S.Struct({
    type: S.String,
    thresholdPercentage: S.Number,
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ResponseBudgetAction",
}) as any as S.Schema<ResponseBudgetAction>;
export type ResponseBudgetActionList = ResponseBudgetAction[];
export const ResponseBudgetActionList = S.Array(ResponseBudgetAction);
export interface BudgetSummary {
  budgetId: string;
  usageTrackingResource: (typeof UsageTrackingResource)["Type"];
  status: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  approximateDollarLimit: number;
  usages: ConsumedUsages;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}
export const BudgetSummary = S.suspend(() =>
  S.Struct({
    budgetId: S.String,
    usageTrackingResource: UsageTrackingResource,
    status: S.String,
    displayName: S.String,
    description: S.optional(SensitiveString),
    approximateDollarLimit: S.Number,
    usages: ConsumedUsages,
    createdBy: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BudgetSummary",
}) as any as S.Schema<BudgetSummary>;
export type BudgetSummaries = BudgetSummary[];
export const BudgetSummaries = S.Array(BudgetSummary);
export interface FleetSummary {
  fleetId: string;
  farmId: string;
  displayName: string;
  status: string;
  statusMessage?: string;
  autoScalingStatus?: string;
  targetWorkerCount?: number;
  workerCount: number;
  minWorkerCount: number;
  maxWorkerCount: number;
  configuration: (typeof FleetConfiguration)["Type"];
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const FleetSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "FleetSummary" }) as any as S.Schema<FleetSummary>;
export type FleetSummaries = FleetSummary[];
export const FleetSummaries = S.Array(FleetSummary);
export interface FleetMember {
  farmId: string;
  fleetId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const FleetMember = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    fleetId: S.String,
    principalId: S.String,
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }),
).annotations({ identifier: "FleetMember" }) as any as S.Schema<FleetMember>;
export type FleetMembers = FleetMember[];
export const FleetMembers = S.Array(FleetMember);
export interface HostPropertiesRequest {
  ipAddresses?: IpAddresses;
  hostName?: string;
}
export const HostPropertiesRequest = S.suspend(() =>
  S.Struct({
    ipAddresses: S.optional(IpAddresses),
    hostName: S.optional(S.String),
  }),
).annotations({
  identifier: "HostPropertiesRequest",
}) as any as S.Schema<HostPropertiesRequest>;
export interface WorkerCapabilities {
  amounts: WorkerAmountCapabilityList;
  attributes: WorkerAttributeCapabilityList;
}
export const WorkerCapabilities = S.suspend(() =>
  S.Struct({
    amounts: WorkerAmountCapabilityList,
    attributes: WorkerAttributeCapabilityList,
  }),
).annotations({
  identifier: "WorkerCapabilities",
}) as any as S.Schema<WorkerCapabilities>;
export interface WorkerSummary {
  workerId: string;
  farmId: string;
  fleetId: string;
  status: string;
  hostProperties?: HostPropertiesResponse;
  log?: LogConfiguration;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const WorkerSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WorkerSummary",
}) as any as S.Schema<WorkerSummary>;
export type WorkerSummaries = WorkerSummary[];
export const WorkerSummaries = S.Array(WorkerSummary);
export type JobEntityIdentifiersUnion =
  | { jobDetails: JobDetailsIdentifiers }
  | { jobAttachmentDetails: JobAttachmentDetailsIdentifiers }
  | { stepDetails: StepDetailsIdentifiers }
  | { environmentDetails: EnvironmentDetailsIdentifiers };
export const JobEntityIdentifiersUnion = S.Union(
  S.Struct({ jobDetails: JobDetailsIdentifiers }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsIdentifiers }),
  S.Struct({ stepDetails: StepDetailsIdentifiers }),
  S.Struct({ environmentDetails: EnvironmentDetailsIdentifiers }),
);
export type JobEntityIdentifiers = (typeof JobEntityIdentifiersUnion)["Type"][];
export const JobEntityIdentifiers = S.Array(JobEntityIdentifiersUnion);
export interface WorkerSessionSummary {
  sessionId: string;
  queueId: string;
  jobId: string;
  startedAt: Date;
  lifecycleStatus: string;
  endedAt?: Date;
  targetLifecycleStatus?: string;
}
export const WorkerSessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    queueId: S.String,
    jobId: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lifecycleStatus: S.String,
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    targetLifecycleStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkerSessionSummary",
}) as any as S.Schema<WorkerSessionSummary>;
export type ListSessionsForWorkerSummaries = WorkerSessionSummary[];
export const ListSessionsForWorkerSummaries = S.Array(WorkerSessionSummary);
export interface QueueSummary {
  farmId: string;
  queueId: string;
  displayName: string;
  status: string;
  defaultBudgetAction: string;
  blockedReason?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const QueueSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "QueueSummary" }) as any as S.Schema<QueueSummary>;
export type QueueSummaries = QueueSummary[];
export const QueueSummaries = S.Array(QueueSummary);
export interface QueueEnvironmentSummary {
  queueEnvironmentId: string;
  name: string;
  priority: number;
}
export const QueueEnvironmentSummary = S.suspend(() =>
  S.Struct({
    queueEnvironmentId: S.String,
    name: S.String,
    priority: S.Number,
  }),
).annotations({
  identifier: "QueueEnvironmentSummary",
}) as any as S.Schema<QueueEnvironmentSummary>;
export type QueueEnvironmentSummaries = QueueEnvironmentSummary[];
export const QueueEnvironmentSummaries = S.Array(QueueEnvironmentSummary);
export interface QueueMember {
  farmId: string;
  queueId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const QueueMember = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    queueId: S.String,
    principalId: S.String,
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }),
).annotations({ identifier: "QueueMember" }) as any as S.Schema<QueueMember>;
export type QueueMemberList = QueueMember[];
export const QueueMemberList = S.Array(QueueMember);
export type JobParameters = { [key: string]: (typeof JobParameter)["Type"] };
export const JobParameters = S.Record({ key: S.String, value: JobParameter });
export interface Attachments {
  manifests: ManifestPropertiesList;
  fileSystem?: string;
}
export const Attachments = S.suspend(() =>
  S.Struct({
    manifests: ManifestPropertiesList,
    fileSystem: S.optional(S.String),
  }),
).annotations({ identifier: "Attachments" }) as any as S.Schema<Attachments>;
export interface JobSummary {
  jobId: string;
  name: string;
  lifecycleStatus: string;
  lifecycleStatusMessage: string;
  priority: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  taskRunStatus?: string;
  targetTaskRunStatus?: string;
  taskRunStatusCounts?: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  maxFailedTasksCount?: number;
  maxRetriesPerTask?: number;
  maxWorkerCount?: number;
  sourceJobId?: string;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaries = JobSummary[];
export const JobSummaries = S.Array(JobSummary);
export interface AcquiredLimit {
  limitId: string;
  count: number;
}
export const AcquiredLimit = S.suspend(() =>
  S.Struct({ limitId: S.String, count: S.Number }),
).annotations({
  identifier: "AcquiredLimit",
}) as any as S.Schema<AcquiredLimit>;
export type AcquiredLimits = AcquiredLimit[];
export const AcquiredLimits = S.Array(AcquiredLimit);
export interface TaskRunManifestPropertiesResponse {
  outputManifestPath?: string;
  outputManifestHash?: string;
}
export const TaskRunManifestPropertiesResponse = S.suspend(() =>
  S.Struct({
    outputManifestPath: S.optional(S.String),
    outputManifestHash: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskRunManifestPropertiesResponse",
}) as any as S.Schema<TaskRunManifestPropertiesResponse>;
export type TaskRunManifestPropertiesListResponse =
  TaskRunManifestPropertiesResponse[];
export const TaskRunManifestPropertiesListResponse = S.Array(
  TaskRunManifestPropertiesResponse,
);
export interface DependencyCounts {
  dependenciesResolved: number;
  dependenciesUnresolved: number;
  consumersResolved: number;
  consumersUnresolved: number;
}
export const DependencyCounts = S.suspend(() =>
  S.Struct({
    dependenciesResolved: S.Number,
    dependenciesUnresolved: S.Number,
    consumersResolved: S.Number,
    consumersUnresolved: S.Number,
  }),
).annotations({
  identifier: "DependencyCounts",
}) as any as S.Schema<DependencyCounts>;
export interface JobMember {
  farmId: string;
  queueId: string;
  jobId: string;
  principalId: string;
  principalType: string;
  identityStoreId: string;
  membershipLevel: string;
}
export const JobMember = S.suspend(() =>
  S.Struct({
    farmId: S.String,
    queueId: S.String,
    jobId: S.String,
    principalId: S.String,
    principalType: S.String,
    identityStoreId: S.String,
    membershipLevel: S.String,
  }),
).annotations({ identifier: "JobMember" }) as any as S.Schema<JobMember>;
export type JobMembers = JobMember[];
export const JobMembers = S.Array(JobMember);
export interface SessionSummary {
  sessionId: string;
  fleetId: string;
  workerId: string;
  startedAt: Date;
  lifecycleStatus: string;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  targetLifecycleStatus?: string;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    fleetId: S.String,
    workerId: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lifecycleStatus: S.String,
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    targetLifecycleStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaries = SessionSummary[];
export const SessionSummaries = S.Array(SessionSummary);
export interface StepConsumer {
  stepId: string;
  status: string;
}
export const StepConsumer = S.suspend(() =>
  S.Struct({ stepId: S.String, status: S.String }),
).annotations({ identifier: "StepConsumer" }) as any as S.Schema<StepConsumer>;
export type StepConsumers = StepConsumer[];
export const StepConsumers = S.Array(StepConsumer);
export interface StepDependency {
  stepId: string;
  status: string;
}
export const StepDependency = S.suspend(() =>
  S.Struct({ stepId: S.String, status: S.String }),
).annotations({
  identifier: "StepDependency",
}) as any as S.Schema<StepDependency>;
export type StepDependencies = StepDependency[];
export const StepDependencies = S.Array(StepDependency);
export interface StepSummary {
  stepId: string;
  name: string;
  lifecycleStatus: string;
  lifecycleStatusMessage?: string;
  taskRunStatus: string;
  taskRunStatusCounts: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  targetTaskRunStatus?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  dependencyCounts?: DependencyCounts;
}
export const StepSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "StepSummary" }) as any as S.Schema<StepSummary>;
export type StepSummaries = StepSummary[];
export const StepSummaries = S.Array(StepSummary);
export interface TaskSummary {
  taskId: string;
  createdAt: Date;
  createdBy: string;
  runStatus: string;
  targetRunStatus?: string;
  failureRetryCount?: number;
  parameters?: TaskParameters;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  latestSessionActionId?: string;
}
export const TaskSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "TaskSummary" }) as any as S.Schema<TaskSummary>;
export type TaskSummaries = TaskSummary[];
export const TaskSummaries = S.Array(TaskSummary);
export interface LicenseEndpointSummary {
  licenseEndpointId?: string;
  status?: string;
  statusMessage?: string;
  vpcId?: string;
}
export const LicenseEndpointSummary = S.suspend(() =>
  S.Struct({
    licenseEndpointId: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    vpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "LicenseEndpointSummary",
}) as any as S.Schema<LicenseEndpointSummary>;
export type LicenseEndpointSummaries = LicenseEndpointSummary[];
export const LicenseEndpointSummaries = S.Array(LicenseEndpointSummary);
export interface MonitorSummary {
  monitorId: string;
  displayName: string;
  subdomain: string;
  url: string;
  roleArn: string;
  identityCenterInstanceArn: string;
  identityCenterApplicationArn: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const MonitorSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "MonitorSummary",
}) as any as S.Schema<MonitorSummary>;
export type MonitorSummaries = MonitorSummary[];
export const MonitorSummaries = S.Array(MonitorSummary);
export interface DateTimeFilterExpression {
  name: string;
  operator: string;
  dateTime: Date;
}
export const DateTimeFilterExpression = S.suspend(() =>
  S.Struct({
    name: S.String,
    operator: S.String,
    dateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DateTimeFilterExpression",
}) as any as S.Schema<DateTimeFilterExpression>;
export interface ParameterFilterExpression {
  name: string;
  operator: string;
  value: string;
}
export const ParameterFilterExpression = S.suspend(() =>
  S.Struct({ name: S.String, operator: S.String, value: S.String }),
).annotations({
  identifier: "ParameterFilterExpression",
}) as any as S.Schema<ParameterFilterExpression>;
export interface SearchTermFilterExpression {
  searchTerm: string;
  matchType?: string;
}
export const SearchTermFilterExpression = S.suspend(() =>
  S.Struct({ searchTerm: S.String, matchType: S.optional(S.String) }),
).annotations({
  identifier: "SearchTermFilterExpression",
}) as any as S.Schema<SearchTermFilterExpression>;
export interface StringFilterExpression {
  name: string;
  operator: string;
  value: string;
}
export const StringFilterExpression = S.suspend(() =>
  S.Struct({ name: S.String, operator: S.String, value: S.String }),
).annotations({
  identifier: "StringFilterExpression",
}) as any as S.Schema<StringFilterExpression>;
export interface TaskRunManifestPropertiesRequest {
  outputManifestPath?: string;
  outputManifestHash?: string;
}
export const TaskRunManifestPropertiesRequest = S.suspend(() =>
  S.Struct({
    outputManifestPath: S.optional(S.String),
    outputManifestHash: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskRunManifestPropertiesRequest",
}) as any as S.Schema<TaskRunManifestPropertiesRequest>;
export type TaskRunManifestPropertiesListRequest =
  TaskRunManifestPropertiesRequest[];
export const TaskRunManifestPropertiesListRequest = S.Array(
  TaskRunManifestPropertiesRequest,
);
export type ListAttributeCapabilityValue = string[];
export const ListAttributeCapabilityValue = S.Array(S.String);
export interface ListAvailableMeteredProductsResponse {
  meteredProducts: MeteredProductSummaryList;
  nextToken?: string;
}
export const ListAvailableMeteredProductsResponse = S.suspend(() =>
  S.Struct({
    meteredProducts: MeteredProductSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAvailableMeteredProductsResponse",
}) as any as S.Schema<ListAvailableMeteredProductsResponse>;
export interface ListQueueFleetAssociationsResponse {
  queueFleetAssociations: QueueFleetAssociationSummaries;
  nextToken?: string;
}
export const ListQueueFleetAssociationsResponse = S.suspend(() =>
  S.Struct({
    queueFleetAssociations: QueueFleetAssociationSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQueueFleetAssociationsResponse",
}) as any as S.Schema<ListQueueFleetAssociationsResponse>;
export interface ListQueueLimitAssociationsResponse {
  queueLimitAssociations: QueueLimitAssociationSummaries;
  nextToken?: string;
}
export const ListQueueLimitAssociationsResponse = S.suspend(() =>
  S.Struct({
    queueLimitAssociations: QueueLimitAssociationSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQueueLimitAssociationsResponse",
}) as any as S.Schema<ListQueueLimitAssociationsResponse>;
export interface SearchStepsResponse {
  steps: StepSearchSummaries;
  nextItemOffset?: number;
  totalResults: number;
}
export const SearchStepsResponse = S.suspend(() =>
  S.Struct({
    steps: StepSearchSummaries,
    nextItemOffset: S.optional(S.Number),
    totalResults: S.Number,
  }),
).annotations({
  identifier: "SearchStepsResponse",
}) as any as S.Schema<SearchStepsResponse>;
export interface SearchTasksResponse {
  tasks: TaskSearchSummaries;
  nextItemOffset?: number;
  totalResults: number;
}
export const SearchTasksResponse = S.suspend(() =>
  S.Struct({
    tasks: TaskSearchSummaries,
    nextItemOffset: S.optional(S.Number),
    totalResults: S.Number,
  }),
).annotations({
  identifier: "SearchTasksResponse",
}) as any as S.Schema<SearchTasksResponse>;
export interface SearchWorkersResponse {
  workers: WorkerSearchSummaries;
  nextItemOffset?: number;
  totalResults: number;
}
export const SearchWorkersResponse = S.suspend(() =>
  S.Struct({
    workers: WorkerSearchSummaries,
    nextItemOffset: S.optional(S.Number),
    totalResults: S.Number,
  }),
).annotations({
  identifier: "SearchWorkersResponse",
}) as any as S.Schema<SearchWorkersResponse>;
export interface StartSessionsStatisticsAggregationResponse {
  aggregationId: string;
}
export const StartSessionsStatisticsAggregationResponse = S.suspend(() =>
  S.Struct({ aggregationId: S.String }),
).annotations({
  identifier: "StartSessionsStatisticsAggregationResponse",
}) as any as S.Schema<StartSessionsStatisticsAggregationResponse>;
export interface ListFarmsResponse {
  nextToken?: string;
  farms: FarmSummaries;
}
export const ListFarmsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), farms: FarmSummaries }),
).annotations({
  identifier: "ListFarmsResponse",
}) as any as S.Schema<ListFarmsResponse>;
export interface CreateStorageProfileResponse {
  storageProfileId: string;
}
export const CreateStorageProfileResponse = S.suspend(() =>
  S.Struct({ storageProfileId: S.String }),
).annotations({
  identifier: "CreateStorageProfileResponse",
}) as any as S.Schema<CreateStorageProfileResponse>;
export interface ListFarmMembersResponse {
  members: FarmMembers;
  nextToken?: string;
}
export const ListFarmMembersResponse = S.suspend(() =>
  S.Struct({ members: FarmMembers, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFarmMembersResponse",
}) as any as S.Schema<ListFarmMembersResponse>;
export interface ListLimitsResponse {
  limits: LimitSummaries;
  nextToken?: string;
}
export const ListLimitsResponse = S.suspend(() =>
  S.Struct({ limits: LimitSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListLimitsResponse",
}) as any as S.Schema<ListLimitsResponse>;
export interface ListStorageProfilesResponse {
  storageProfiles: StorageProfileSummaries;
  nextToken?: string;
}
export const ListStorageProfilesResponse = S.suspend(() =>
  S.Struct({
    storageProfiles: StorageProfileSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStorageProfilesResponse",
}) as any as S.Schema<ListStorageProfilesResponse>;
export interface CreateBudgetRequest {
  clientToken?: string;
  farmId: string;
  usageTrackingResource: (typeof UsageTrackingResource)["Type"];
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  approximateDollarLimit: number;
  actions: BudgetActionsToAdd;
  schedule: (typeof BudgetSchedule)["Type"];
}
export const CreateBudgetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    usageTrackingResource: UsageTrackingResource,
    displayName: S.String,
    description: S.optional(SensitiveString),
    approximateDollarLimit: S.Number,
    actions: BudgetActionsToAdd,
    schedule: BudgetSchedule,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/budgets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBudgetRequest",
}) as any as S.Schema<CreateBudgetRequest>;
export interface GetBudgetResponse {
  budgetId: string;
  usageTrackingResource: (typeof UsageTrackingResource)["Type"];
  status: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  approximateDollarLimit: number;
  usages: ConsumedUsages;
  actions: ResponseBudgetActionList;
  schedule: (typeof BudgetSchedule)["Type"];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  queueStoppedAt?: Date;
}
export const GetBudgetResponse = S.suspend(() =>
  S.Struct({
    budgetId: S.String,
    usageTrackingResource: UsageTrackingResource,
    status: S.String,
    displayName: S.String,
    description: S.optional(SensitiveString),
    approximateDollarLimit: S.Number,
    usages: ConsumedUsages,
    actions: ResponseBudgetActionList,
    schedule: BudgetSchedule,
    createdBy: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    queueStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetBudgetResponse",
}) as any as S.Schema<GetBudgetResponse>;
export interface ListBudgetsResponse {
  nextToken?: string;
  budgets: BudgetSummaries;
}
export const ListBudgetsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), budgets: BudgetSummaries }),
).annotations({
  identifier: "ListBudgetsResponse",
}) as any as S.Schema<ListBudgetsResponse>;
export interface ListFleetsResponse {
  fleets: FleetSummaries;
  nextToken?: string;
}
export const ListFleetsResponse = S.suspend(() =>
  S.Struct({ fleets: FleetSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFleetsResponse",
}) as any as S.Schema<ListFleetsResponse>;
export interface AssumeFleetRoleForReadResponse {
  credentials: AwsCredentials;
}
export const AssumeFleetRoleForReadResponse = S.suspend(() =>
  S.Struct({ credentials: AwsCredentials }),
).annotations({
  identifier: "AssumeFleetRoleForReadResponse",
}) as any as S.Schema<AssumeFleetRoleForReadResponse>;
export interface ListFleetMembersResponse {
  members: FleetMembers;
  nextToken?: string;
}
export const ListFleetMembersResponse = S.suspend(() =>
  S.Struct({ members: FleetMembers, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFleetMembersResponse",
}) as any as S.Schema<ListFleetMembersResponse>;
export interface CreateWorkerRequest {
  farmId: string;
  fleetId: string;
  hostProperties?: HostPropertiesRequest;
  clientToken?: string;
  tags?: Tags;
}
export const CreateWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    hostProperties: S.optional(HostPropertiesRequest),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    tags: S.optional(Tags),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateWorkerRequest",
}) as any as S.Schema<CreateWorkerRequest>;
export interface UpdateWorkerRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
  status?: string;
  capabilities?: WorkerCapabilities;
  hostProperties?: HostPropertiesRequest;
}
export const UpdateWorkerRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    status: S.optional(S.String),
    capabilities: S.optional(WorkerCapabilities),
    hostProperties: S.optional(HostPropertiesRequest),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateWorkerRequest",
}) as any as S.Schema<UpdateWorkerRequest>;
export interface ListWorkersResponse {
  nextToken?: string;
  workers: WorkerSummaries;
}
export const ListWorkersResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), workers: WorkerSummaries }),
).annotations({
  identifier: "ListWorkersResponse",
}) as any as S.Schema<ListWorkersResponse>;
export interface BatchGetJobEntityRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
  identifiers: JobEntityIdentifiers;
}
export const BatchGetJobEntityRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    identifiers: JobEntityIdentifiers,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchGetJobEntityRequest",
}) as any as S.Schema<BatchGetJobEntityRequest>;
export interface ListSessionsForWorkerResponse {
  sessions: ListSessionsForWorkerSummaries;
  nextToken?: string;
}
export const ListSessionsForWorkerResponse = S.suspend(() =>
  S.Struct({
    sessions: ListSessionsForWorkerSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionsForWorkerResponse",
}) as any as S.Schema<ListSessionsForWorkerResponse>;
export interface CreateQueueRequest {
  clientToken?: string;
  farmId: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  defaultBudgetAction?: string;
  jobAttachmentSettings?: JobAttachmentSettings;
  roleArn?: string;
  jobRunAsUser?: JobRunAsUser;
  requiredFileSystemLocationNames?: RequiredFileSystemLocationNames;
  allowedStorageProfileIds?: AllowedStorageProfileIds;
  tags?: Tags;
}
export const CreateQueueRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    description: S.optional(SensitiveString),
    defaultBudgetAction: S.optional(S.String),
    jobAttachmentSettings: S.optional(JobAttachmentSettings),
    roleArn: S.optional(S.String),
    jobRunAsUser: S.optional(JobRunAsUser),
    requiredFileSystemLocationNames: S.optional(
      RequiredFileSystemLocationNames,
    ),
    allowedStorageProfileIds: S.optional(AllowedStorageProfileIds),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/queues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQueueRequest",
}) as any as S.Schema<CreateQueueRequest>;
export interface ListQueuesResponse {
  queues: QueueSummaries;
  nextToken?: string;
}
export const ListQueuesResponse = S.suspend(() =>
  S.Struct({ queues: QueueSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListQueuesResponse",
}) as any as S.Schema<ListQueuesResponse>;
export interface ListQueueEnvironmentsResponse {
  environments: QueueEnvironmentSummaries;
  nextToken?: string;
}
export const ListQueueEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    environments: QueueEnvironmentSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQueueEnvironmentsResponse",
}) as any as S.Schema<ListQueueEnvironmentsResponse>;
export interface ListQueueMembersResponse {
  members: QueueMemberList;
  nextToken?: string;
}
export const ListQueueMembersResponse = S.suspend(() =>
  S.Struct({ members: QueueMemberList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListQueueMembersResponse",
}) as any as S.Schema<ListQueueMembersResponse>;
export interface CreateJobRequest {
  farmId: string;
  queueId: string;
  clientToken?: string;
  template?: string | Redacted.Redacted<string>;
  templateType?: string;
  priority: number;
  parameters?: JobParameters;
  attachments?: Attachments;
  storageProfileId?: string;
  targetTaskRunStatus?: string;
  maxFailedTasksCount?: number;
  maxRetriesPerTask?: number;
  maxWorkerCount?: number;
  sourceJobId?: string;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueId: S.String.pipe(T.HttpLabel("queueId")),
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    template: S.optional(SensitiveString),
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
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface GetJobResponse {
  jobId: string;
  name: string;
  lifecycleStatus: string;
  lifecycleStatusMessage: string;
  priority: number;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  taskRunStatus?: string;
  targetTaskRunStatus?: string;
  taskRunStatusCounts?: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  storageProfileId?: string;
  maxFailedTasksCount?: number;
  maxRetriesPerTask?: number;
  parameters?: JobParameters;
  attachments?: Attachments;
  description?: string | Redacted.Redacted<string>;
  maxWorkerCount?: number;
  sourceJobId?: string;
}
export const GetJobResponse = S.suspend(() =>
  S.Struct({
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
    description: S.optional(SensitiveString),
    maxWorkerCount: S.optional(S.Number),
    sourceJobId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetJobResponse",
}) as any as S.Schema<GetJobResponse>;
export interface ListJobsResponse {
  jobs: JobSummaries;
  nextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({ jobs: JobSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface CopyJobTemplateResponse {
  templateType: string;
}
export const CopyJobTemplateResponse = S.suspend(() =>
  S.Struct({ templateType: S.String }),
).annotations({
  identifier: "CopyJobTemplateResponse",
}) as any as S.Schema<CopyJobTemplateResponse>;
export interface ListJobMembersResponse {
  members: JobMembers;
  nextToken?: string;
}
export const ListJobMembersResponse = S.suspend(() =>
  S.Struct({ members: JobMembers, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobMembersResponse",
}) as any as S.Schema<ListJobMembersResponse>;
export interface ListSessionsResponse {
  sessions: SessionSummaries;
  nextToken?: string;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({ sessions: SessionSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface ListStepConsumersResponse {
  consumers: StepConsumers;
  nextToken?: string;
}
export const ListStepConsumersResponse = S.suspend(() =>
  S.Struct({ consumers: StepConsumers, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStepConsumersResponse",
}) as any as S.Schema<ListStepConsumersResponse>;
export interface ListStepDependenciesResponse {
  dependencies: StepDependencies;
  nextToken?: string;
}
export const ListStepDependenciesResponse = S.suspend(() =>
  S.Struct({ dependencies: StepDependencies, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStepDependenciesResponse",
}) as any as S.Schema<ListStepDependenciesResponse>;
export interface ListStepsResponse {
  steps: StepSummaries;
  nextToken?: string;
}
export const ListStepsResponse = S.suspend(() =>
  S.Struct({ steps: StepSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStepsResponse",
}) as any as S.Schema<ListStepsResponse>;
export interface ListTasksResponse {
  tasks: TaskSummaries;
  nextToken?: string;
}
export const ListTasksResponse = S.suspend(() =>
  S.Struct({ tasks: TaskSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTasksResponse",
}) as any as S.Schema<ListTasksResponse>;
export interface ListLicenseEndpointsResponse {
  licenseEndpoints: LicenseEndpointSummaries;
  nextToken?: string;
}
export const ListLicenseEndpointsResponse = S.suspend(() =>
  S.Struct({
    licenseEndpoints: LicenseEndpointSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLicenseEndpointsResponse",
}) as any as S.Schema<ListLicenseEndpointsResponse>;
export interface ListMonitorsResponse {
  nextToken?: string;
  monitors: MonitorSummaries;
}
export const ListMonitorsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), monitors: MonitorSummaries }),
).annotations({
  identifier: "ListMonitorsResponse",
}) as any as S.Schema<ListMonitorsResponse>;
export interface Stats {
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}
export const Stats = S.suspend(() =>
  S.Struct({
    min: S.optional(S.Number),
    max: S.optional(S.Number),
    avg: S.optional(S.Number),
    sum: S.optional(S.Number),
  }),
).annotations({ identifier: "Stats" }) as any as S.Schema<Stats>;
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
    ).annotations({ identifier: "SearchGroupedFilterExpressions" }),
  }),
) as any as S.Schema<SearchFilterExpression>;
export type SearchFilterExpressions = SearchFilterExpression[];
export const SearchFilterExpressions = S.Array(
  S.suspend(() => SearchFilterExpression).annotations({
    identifier: "SearchFilterExpression",
  }),
) as any as S.Schema<SearchFilterExpressions>;
export type FleetAmountCapabilities = FleetAmountCapability[];
export const FleetAmountCapabilities = S.Array(FleetAmountCapability);
export type FleetAttributeCapabilities = FleetAttributeCapability[];
export const FleetAttributeCapabilities = S.Array(FleetAttributeCapability);
export interface UpdatedSessionActionInfo {
  completedStatus?: string;
  processExitCode?: number;
  progressMessage?: string | Redacted.Redacted<string>;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  progressPercent?: number;
  manifests?: TaskRunManifestPropertiesListRequest;
}
export const UpdatedSessionActionInfo = S.suspend(() =>
  S.Struct({
    completedStatus: S.optional(S.String),
    processExitCode: S.optional(S.Number),
    progressMessage: S.optional(SensitiveString),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    progressPercent: S.optional(S.Number),
    manifests: S.optional(TaskRunManifestPropertiesListRequest),
  }),
).annotations({
  identifier: "UpdatedSessionActionInfo",
}) as any as S.Schema<UpdatedSessionActionInfo>;
export interface EnvironmentEnterSessionActionDefinition {
  environmentId: string;
}
export const EnvironmentEnterSessionActionDefinition = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "EnvironmentEnterSessionActionDefinition",
}) as any as S.Schema<EnvironmentEnterSessionActionDefinition>;
export interface EnvironmentExitSessionActionDefinition {
  environmentId: string;
}
export const EnvironmentExitSessionActionDefinition = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "EnvironmentExitSessionActionDefinition",
}) as any as S.Schema<EnvironmentExitSessionActionDefinition>;
export interface TaskRunSessionActionDefinition {
  taskId?: string;
  stepId: string;
  parameters: TaskParameters;
}
export const TaskRunSessionActionDefinition = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    stepId: S.String,
    parameters: TaskParameters,
  }),
).annotations({
  identifier: "TaskRunSessionActionDefinition",
}) as any as S.Schema<TaskRunSessionActionDefinition>;
export interface SyncInputJobAttachmentsSessionActionDefinition {
  stepId?: string;
}
export const SyncInputJobAttachmentsSessionActionDefinition = S.suspend(() =>
  S.Struct({ stepId: S.optional(S.String) }),
).annotations({
  identifier: "SyncInputJobAttachmentsSessionActionDefinition",
}) as any as S.Schema<SyncInputJobAttachmentsSessionActionDefinition>;
export interface StepAttributeCapability {
  name: string;
  anyOf?: ListAttributeCapabilityValue;
  allOf?: ListAttributeCapabilityValue;
}
export const StepAttributeCapability = S.suspend(() =>
  S.Struct({
    name: S.String,
    anyOf: S.optional(ListAttributeCapabilityValue),
    allOf: S.optional(ListAttributeCapabilityValue),
  }),
).annotations({
  identifier: "StepAttributeCapability",
}) as any as S.Schema<StepAttributeCapability>;
export type StepAttributeCapabilities = StepAttributeCapability[];
export const StepAttributeCapabilities = S.Array(StepAttributeCapability);
export interface StepAmountCapability {
  name: string;
  min?: number;
  max?: number;
  value?: number;
}
export const StepAmountCapability = S.suspend(() =>
  S.Struct({
    name: S.String,
    min: S.optional(S.Number),
    max: S.optional(S.Number),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "StepAmountCapability",
}) as any as S.Schema<StepAmountCapability>;
export type StepAmountCapabilities = StepAmountCapability[];
export const StepAmountCapabilities = S.Array(StepAmountCapability);
export interface Statistics {
  queueId?: string;
  fleetId?: string;
  jobId?: string;
  jobName?: string;
  userId?: string;
  usageType?: string;
  licenseProduct?: string;
  instanceType?: string;
  count: number;
  costInUsd: Stats;
  runtimeInSeconds: Stats;
  aggregationStartTime?: Date;
  aggregationEndTime?: Date;
}
export const Statistics = S.suspend(() =>
  S.Struct({
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
    aggregationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    aggregationEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Statistics" }) as any as S.Schema<Statistics>;
export type StatisticsList = Statistics[];
export const StatisticsList = S.Array(Statistics);
export interface FleetCapabilities {
  amounts?: FleetAmountCapabilities;
  attributes?: FleetAttributeCapabilities;
}
export const FleetCapabilities = S.suspend(() =>
  S.Struct({
    amounts: S.optional(FleetAmountCapabilities),
    attributes: S.optional(FleetAttributeCapabilities),
  }),
).annotations({
  identifier: "FleetCapabilities",
}) as any as S.Schema<FleetCapabilities>;
export type UpdatedSessionActions = { [key: string]: UpdatedSessionActionInfo };
export const UpdatedSessionActions = S.Record({
  key: S.String,
  value: UpdatedSessionActionInfo,
});
export type SessionActionDefinition =
  | { envEnter: EnvironmentEnterSessionActionDefinition }
  | { envExit: EnvironmentExitSessionActionDefinition }
  | { taskRun: TaskRunSessionActionDefinition }
  | { syncInputJobAttachments: SyncInputJobAttachmentsSessionActionDefinition };
export const SessionActionDefinition = S.Union(
  S.Struct({ envEnter: EnvironmentEnterSessionActionDefinition }),
  S.Struct({ envExit: EnvironmentExitSessionActionDefinition }),
  S.Struct({ taskRun: TaskRunSessionActionDefinition }),
  S.Struct({
    syncInputJobAttachments: SyncInputJobAttachmentsSessionActionDefinition,
  }),
);
export interface StepRequiredCapabilities {
  attributes: StepAttributeCapabilities;
  amounts: StepAmountCapabilities;
}
export const StepRequiredCapabilities = S.suspend(() =>
  S.Struct({
    attributes: StepAttributeCapabilities,
    amounts: StepAmountCapabilities,
  }),
).annotations({
  identifier: "StepRequiredCapabilities",
}) as any as S.Schema<StepRequiredCapabilities>;
export interface EnvironmentEnterSessionActionDefinitionSummary {
  environmentId: string;
}
export const EnvironmentEnterSessionActionDefinitionSummary = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "EnvironmentEnterSessionActionDefinitionSummary",
}) as any as S.Schema<EnvironmentEnterSessionActionDefinitionSummary>;
export interface EnvironmentExitSessionActionDefinitionSummary {
  environmentId: string;
}
export const EnvironmentExitSessionActionDefinitionSummary = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "EnvironmentExitSessionActionDefinitionSummary",
}) as any as S.Schema<EnvironmentExitSessionActionDefinitionSummary>;
export interface TaskRunSessionActionDefinitionSummary {
  taskId?: string;
  stepId: string;
  parameters?: TaskParameters;
}
export const TaskRunSessionActionDefinitionSummary = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    stepId: S.String,
    parameters: S.optional(TaskParameters),
  }),
).annotations({
  identifier: "TaskRunSessionActionDefinitionSummary",
}) as any as S.Schema<TaskRunSessionActionDefinitionSummary>;
export interface SyncInputJobAttachmentsSessionActionDefinitionSummary {
  stepId?: string;
}
export const SyncInputJobAttachmentsSessionActionDefinitionSummary = S.suspend(
  () => S.Struct({ stepId: S.optional(S.String) }),
).annotations({
  identifier: "SyncInputJobAttachmentsSessionActionDefinitionSummary",
}) as any as S.Schema<SyncInputJobAttachmentsSessionActionDefinitionSummary>;
export interface GetSessionsStatisticsAggregationResponse {
  statistics?: StatisticsList;
  nextToken?: string;
  status: string;
  statusMessage?: string;
}
export const GetSessionsStatisticsAggregationResponse = S.suspend(() =>
  S.Struct({
    statistics: S.optional(StatisticsList),
    nextToken: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSessionsStatisticsAggregationResponse",
}) as any as S.Schema<GetSessionsStatisticsAggregationResponse>;
export interface SearchJobsRequest {
  farmId: string;
  queueIds: QueueIds;
  filterExpressions?: SearchGroupedFilterExpressions;
  sortExpressions?: SearchSortExpressions;
  itemOffset: number;
  pageSize?: number;
}
export const SearchJobsRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    queueIds: QueueIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchJobsRequest",
}) as any as S.Schema<SearchJobsRequest>;
export interface CreateBudgetResponse {
  budgetId: string;
}
export const CreateBudgetResponse = S.suspend(() =>
  S.Struct({ budgetId: S.String }),
).annotations({
  identifier: "CreateBudgetResponse",
}) as any as S.Schema<CreateBudgetResponse>;
export interface GetFleetResponse {
  fleetId: string;
  farmId: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  status: string;
  statusMessage?: string;
  autoScalingStatus?: string;
  targetWorkerCount?: number;
  workerCount: number;
  minWorkerCount: number;
  maxWorkerCount: number;
  configuration: (typeof FleetConfiguration)["Type"];
  hostConfiguration?: HostConfiguration;
  capabilities?: FleetCapabilities;
  roleArn: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetFleetResponse = S.suspend(() =>
  S.Struct({
    fleetId: S.String,
    farmId: S.String,
    displayName: S.String,
    description: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "GetFleetResponse",
}) as any as S.Schema<GetFleetResponse>;
export interface CreateWorkerResponse {
  workerId: string;
}
export const CreateWorkerResponse = S.suspend(() =>
  S.Struct({ workerId: S.String }),
).annotations({
  identifier: "CreateWorkerResponse",
}) as any as S.Schema<CreateWorkerResponse>;
export interface GetWorkerResponse {
  farmId: string;
  fleetId: string;
  workerId: string;
  hostProperties?: HostPropertiesResponse;
  status: string;
  log?: LogConfiguration;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const GetWorkerResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetWorkerResponse",
}) as any as S.Schema<GetWorkerResponse>;
export interface UpdateWorkerResponse {
  log?: LogConfiguration;
  hostConfiguration?: HostConfiguration;
}
export const UpdateWorkerResponse = S.suspend(() =>
  S.Struct({
    log: S.optional(LogConfiguration),
    hostConfiguration: S.optional(HostConfiguration),
  }),
).annotations({
  identifier: "UpdateWorkerResponse",
}) as any as S.Schema<UpdateWorkerResponse>;
export interface UpdateWorkerScheduleRequest {
  farmId: string;
  fleetId: string;
  workerId: string;
  updatedSessionActions?: UpdatedSessionActions;
}
export const UpdateWorkerScheduleRequest = S.suspend(() =>
  S.Struct({
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    fleetId: S.String.pipe(T.HttpLabel("fleetId")),
    workerId: S.String.pipe(T.HttpLabel("workerId")),
    updatedSessionActions: S.optional(UpdatedSessionActions),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateWorkerScheduleRequest",
}) as any as S.Schema<UpdateWorkerScheduleRequest>;
export interface CreateQueueResponse {
  queueId: string;
}
export const CreateQueueResponse = S.suspend(() =>
  S.Struct({ queueId: S.String }),
).annotations({
  identifier: "CreateQueueResponse",
}) as any as S.Schema<CreateQueueResponse>;
export interface CreateJobResponse {
  jobId: string;
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;
export interface GetSessionActionResponse {
  sessionActionId: string;
  status: string;
  startedAt?: Date;
  endedAt?: Date;
  workerUpdatedAt?: Date;
  progressPercent?: number;
  sessionId: string;
  processExitCode?: number;
  progressMessage?: string | Redacted.Redacted<string>;
  definition: (typeof SessionActionDefinition)["Type"];
  acquiredLimits?: AcquiredLimits;
  manifests?: TaskRunManifestPropertiesListResponse;
}
export const GetSessionActionResponse = S.suspend(() =>
  S.Struct({
    sessionActionId: S.String,
    status: S.String,
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    workerUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    progressPercent: S.optional(S.Number),
    sessionId: S.String,
    processExitCode: S.optional(S.Number),
    progressMessage: S.optional(SensitiveString),
    definition: SessionActionDefinition,
    acquiredLimits: S.optional(AcquiredLimits),
    manifests: S.optional(TaskRunManifestPropertiesListResponse),
  }),
).annotations({
  identifier: "GetSessionActionResponse",
}) as any as S.Schema<GetSessionActionResponse>;
export interface GetStepResponse {
  stepId: string;
  name: string;
  lifecycleStatus: string;
  lifecycleStatusMessage?: string;
  taskRunStatus: string;
  taskRunStatusCounts: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  targetTaskRunStatus?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  startedAt?: Date;
  endedAt?: Date;
  dependencyCounts?: DependencyCounts;
  requiredCapabilities?: StepRequiredCapabilities;
  parameterSpace?: ParameterSpace;
  description?: string | Redacted.Redacted<string>;
}
export const GetStepResponse = S.suspend(() =>
  S.Struct({
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
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "GetStepResponse",
}) as any as S.Schema<GetStepResponse>;
export interface GetTaskResponse {
  taskId: string;
  createdAt: Date;
  createdBy: string;
  runStatus: string;
  targetRunStatus?: string;
  failureRetryCount?: number;
  parameters?: TaskParameters;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  latestSessionActionId?: string;
}
export const GetTaskResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetTaskResponse",
}) as any as S.Schema<GetTaskResponse>;
export type SessionActionDefinitionSummary =
  | { envEnter: EnvironmentEnterSessionActionDefinitionSummary }
  | { envExit: EnvironmentExitSessionActionDefinitionSummary }
  | { taskRun: TaskRunSessionActionDefinitionSummary }
  | {
      syncInputJobAttachments: SyncInputJobAttachmentsSessionActionDefinitionSummary;
    };
export const SessionActionDefinitionSummary = S.Union(
  S.Struct({ envEnter: EnvironmentEnterSessionActionDefinitionSummary }),
  S.Struct({ envExit: EnvironmentExitSessionActionDefinitionSummary }),
  S.Struct({ taskRun: TaskRunSessionActionDefinitionSummary }),
  S.Struct({
    syncInputJobAttachments:
      SyncInputJobAttachmentsSessionActionDefinitionSummary,
  }),
);
export interface SessionActionSummary {
  sessionActionId: string;
  status: string;
  startedAt?: Date;
  endedAt?: Date;
  workerUpdatedAt?: Date;
  progressPercent?: number;
  definition: (typeof SessionActionDefinitionSummary)["Type"];
  manifests?: TaskRunManifestPropertiesListResponse;
}
export const SessionActionSummary = S.suspend(() =>
  S.Struct({
    sessionActionId: S.String,
    status: S.String,
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    workerUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    progressPercent: S.optional(S.Number),
    definition: SessionActionDefinitionSummary,
    manifests: S.optional(TaskRunManifestPropertiesListResponse),
  }),
).annotations({
  identifier: "SessionActionSummary",
}) as any as S.Schema<SessionActionSummary>;
export type SessionActionSummaries = SessionActionSummary[];
export const SessionActionSummaries = S.Array(SessionActionSummary);
export type DependenciesList = string[];
export const DependenciesList = S.Array(S.String);
export interface ListSessionActionsResponse {
  sessionActions: SessionActionSummaries;
  nextToken?: string;
}
export const ListSessionActionsResponse = S.suspend(() =>
  S.Struct({
    sessionActions: SessionActionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionActionsResponse",
}) as any as S.Schema<ListSessionActionsResponse>;
export interface JobAttachmentDetailsEntity {
  jobId: string;
  attachments: Attachments;
}
export const JobAttachmentDetailsEntity = S.suspend(() =>
  S.Struct({ jobId: S.String, attachments: Attachments }),
).annotations({
  identifier: "JobAttachmentDetailsEntity",
}) as any as S.Schema<JobAttachmentDetailsEntity>;
export interface StepDetailsEntity {
  jobId: string;
  stepId: string;
  schemaVersion: string;
  template: any;
  dependencies: DependenciesList;
}
export const StepDetailsEntity = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    stepId: S.String,
    schemaVersion: S.String,
    template: S.Any,
    dependencies: DependenciesList,
  }),
).annotations({
  identifier: "StepDetailsEntity",
}) as any as S.Schema<StepDetailsEntity>;
export interface EnvironmentDetailsEntity {
  jobId: string;
  environmentId: string;
  schemaVersion: string;
  template: any;
}
export const EnvironmentDetailsEntity = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    environmentId: S.String,
    schemaVersion: S.String,
    template: S.Any,
  }),
).annotations({
  identifier: "EnvironmentDetailsEntity",
}) as any as S.Schema<EnvironmentDetailsEntity>;
export interface JobDetailsError {
  jobId: string;
  code: string;
  message: string;
}
export const JobDetailsError = S.suspend(() =>
  S.Struct({ jobId: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "JobDetailsError",
}) as any as S.Schema<JobDetailsError>;
export interface JobAttachmentDetailsError {
  jobId: string;
  code: string;
  message: string;
}
export const JobAttachmentDetailsError = S.suspend(() =>
  S.Struct({ jobId: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "JobAttachmentDetailsError",
}) as any as S.Schema<JobAttachmentDetailsError>;
export interface StepDetailsError {
  jobId: string;
  stepId: string;
  code: string;
  message: string;
}
export const StepDetailsError = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    stepId: S.String,
    code: S.String,
    message: S.String,
  }),
).annotations({
  identifier: "StepDetailsError",
}) as any as S.Schema<StepDetailsError>;
export interface EnvironmentDetailsError {
  jobId: string;
  environmentId: string;
  code: string;
  message: string;
}
export const EnvironmentDetailsError = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    environmentId: S.String,
    code: S.String,
    message: S.String,
  }),
).annotations({
  identifier: "EnvironmentDetailsError",
}) as any as S.Schema<EnvironmentDetailsError>;
export type SessionActionIdList = string[];
export const SessionActionIdList = S.Array(S.String);
export interface JobSearchSummary {
  jobId?: string;
  queueId?: string;
  name?: string;
  lifecycleStatus?: string;
  lifecycleStatusMessage?: string;
  taskRunStatus?: string;
  targetTaskRunStatus?: string;
  taskRunStatusCounts?: TaskRunStatusCounts;
  taskFailureRetryCount?: number;
  priority?: number;
  maxFailedTasksCount?: number;
  maxRetriesPerTask?: number;
  createdBy?: string;
  createdAt?: Date;
  endedAt?: Date;
  startedAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  jobParameters?: JobParameters;
  maxWorkerCount?: number;
  sourceJobId?: string;
}
export const JobSearchSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "JobSearchSummary",
}) as any as S.Schema<JobSearchSummary>;
export type JobSearchSummaries = JobSearchSummary[];
export const JobSearchSummaries = S.Array(JobSearchSummary);
export type GetJobEntityError =
  | { jobDetails: JobDetailsError }
  | { jobAttachmentDetails: JobAttachmentDetailsError }
  | { stepDetails: StepDetailsError }
  | { environmentDetails: EnvironmentDetailsError };
export const GetJobEntityError = S.Union(
  S.Struct({ jobDetails: JobDetailsError }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsError }),
  S.Struct({ stepDetails: StepDetailsError }),
  S.Struct({ environmentDetails: EnvironmentDetailsError }),
);
export type BatchGetJobEntityErrors = (typeof GetJobEntityError)["Type"][];
export const BatchGetJobEntityErrors = S.Array(GetJobEntityError);
export type CancelSessionActions = { [key: string]: SessionActionIdList };
export const CancelSessionActions = S.Record({
  key: S.String,
  value: SessionActionIdList,
});
export interface PathMappingRule {
  sourcePathFormat: string;
  sourcePath: string;
  destinationPath: string;
}
export const PathMappingRule = S.suspend(() =>
  S.Struct({
    sourcePathFormat: S.String,
    sourcePath: S.String,
    destinationPath: S.String,
  }),
).annotations({
  identifier: "PathMappingRule",
}) as any as S.Schema<PathMappingRule>;
export type PathMappingRules = PathMappingRule[];
export const PathMappingRules = S.Array(PathMappingRule);
export interface SearchJobsResponse {
  jobs: JobSearchSummaries;
  nextItemOffset?: number;
  totalResults: number;
}
export const SearchJobsResponse = S.suspend(() =>
  S.Struct({
    jobs: JobSearchSummaries,
    nextItemOffset: S.optional(S.Number),
    totalResults: S.Number,
  }),
).annotations({
  identifier: "SearchJobsResponse",
}) as any as S.Schema<SearchJobsResponse>;
export interface CreateFleetRequest {
  clientToken?: string;
  farmId: string;
  displayName: string;
  description?: string | Redacted.Redacted<string>;
  roleArn: string;
  minWorkerCount?: number;
  maxWorkerCount: number;
  configuration: (typeof FleetConfiguration)["Type"];
  tags?: Tags;
  hostConfiguration?: HostConfiguration;
}
export const CreateFleetRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.HttpHeader("X-Amz-Client-Token")),
    farmId: S.String.pipe(T.HttpLabel("farmId")),
    displayName: S.String,
    description: S.optional(SensitiveString),
    roleArn: S.String,
    minWorkerCount: S.optional(S.Number),
    maxWorkerCount: S.Number,
    configuration: FleetConfiguration,
    tags: S.optional(Tags),
    hostConfiguration: S.optional(HostConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/fleets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFleetRequest",
}) as any as S.Schema<CreateFleetRequest>;
export interface JobDetailsEntity {
  jobId: string;
  jobAttachmentSettings?: JobAttachmentSettings;
  jobRunAsUser?: JobRunAsUser;
  logGroupName: string;
  queueRoleArn?: string;
  parameters?: JobParameters;
  schemaVersion: string;
  pathMappingRules?: PathMappingRules;
}
export const JobDetailsEntity = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    jobAttachmentSettings: S.optional(JobAttachmentSettings),
    jobRunAsUser: S.optional(JobRunAsUser),
    logGroupName: S.String,
    queueRoleArn: S.optional(S.String),
    parameters: S.optional(JobParameters),
    schemaVersion: S.String,
    pathMappingRules: S.optional(PathMappingRules),
  }),
).annotations({
  identifier: "JobDetailsEntity",
}) as any as S.Schema<JobDetailsEntity>;
export type JobEntity =
  | { jobDetails: JobDetailsEntity }
  | { jobAttachmentDetails: JobAttachmentDetailsEntity }
  | { stepDetails: StepDetailsEntity }
  | { environmentDetails: EnvironmentDetailsEntity };
export const JobEntity = S.Union(
  S.Struct({ jobDetails: JobDetailsEntity }),
  S.Struct({ jobAttachmentDetails: JobAttachmentDetailsEntity }),
  S.Struct({ stepDetails: StepDetailsEntity }),
  S.Struct({ environmentDetails: EnvironmentDetailsEntity }),
);
export type BatchGetJobEntityList = (typeof JobEntity)["Type"][];
export const BatchGetJobEntityList = S.Array(JobEntity);
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateFleetResponse {
  fleetId: string;
}
export const CreateFleetResponse = S.suspend(() =>
  S.Struct({ fleetId: S.String }),
).annotations({
  identifier: "CreateFleetResponse",
}) as any as S.Schema<CreateFleetResponse>;
export interface BatchGetJobEntityResponse {
  entities: BatchGetJobEntityList;
  errors: BatchGetJobEntityErrors;
}
export const BatchGetJobEntityResponse = S.suspend(() =>
  S.Struct({
    entities: BatchGetJobEntityList,
    errors: BatchGetJobEntityErrors,
  }),
).annotations({
  identifier: "BatchGetJobEntityResponse",
}) as any as S.Schema<BatchGetJobEntityResponse>;
export interface AssignedEnvironmentEnterSessionActionDefinition {
  environmentId: string;
}
export const AssignedEnvironmentEnterSessionActionDefinition = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "AssignedEnvironmentEnterSessionActionDefinition",
}) as any as S.Schema<AssignedEnvironmentEnterSessionActionDefinition>;
export interface AssignedEnvironmentExitSessionActionDefinition {
  environmentId: string;
}
export const AssignedEnvironmentExitSessionActionDefinition = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "AssignedEnvironmentExitSessionActionDefinition",
}) as any as S.Schema<AssignedEnvironmentExitSessionActionDefinition>;
export interface AssignedTaskRunSessionActionDefinition {
  taskId?: string;
  stepId: string;
  parameters: TaskParameters;
}
export const AssignedTaskRunSessionActionDefinition = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    stepId: S.String,
    parameters: TaskParameters,
  }),
).annotations({
  identifier: "AssignedTaskRunSessionActionDefinition",
}) as any as S.Schema<AssignedTaskRunSessionActionDefinition>;
export interface AssignedSyncInputJobAttachmentsSessionActionDefinition {
  stepId?: string;
}
export const AssignedSyncInputJobAttachmentsSessionActionDefinition = S.suspend(
  () => S.Struct({ stepId: S.optional(S.String) }),
).annotations({
  identifier: "AssignedSyncInputJobAttachmentsSessionActionDefinition",
}) as any as S.Schema<AssignedSyncInputJobAttachmentsSessionActionDefinition>;
export type AssignedSessionActionDefinition =
  | { envEnter: AssignedEnvironmentEnterSessionActionDefinition }
  | { envExit: AssignedEnvironmentExitSessionActionDefinition }
  | { taskRun: AssignedTaskRunSessionActionDefinition }
  | {
      syncInputJobAttachments: AssignedSyncInputJobAttachmentsSessionActionDefinition;
    };
export const AssignedSessionActionDefinition = S.Union(
  S.Struct({ envEnter: AssignedEnvironmentEnterSessionActionDefinition }),
  S.Struct({ envExit: AssignedEnvironmentExitSessionActionDefinition }),
  S.Struct({ taskRun: AssignedTaskRunSessionActionDefinition }),
  S.Struct({
    syncInputJobAttachments:
      AssignedSyncInputJobAttachmentsSessionActionDefinition,
  }),
);
export interface AssignedSessionAction {
  sessionActionId: string;
  definition: (typeof AssignedSessionActionDefinition)["Type"];
}
export const AssignedSessionAction = S.suspend(() =>
  S.Struct({
    sessionActionId: S.String,
    definition: AssignedSessionActionDefinition,
  }),
).annotations({
  identifier: "AssignedSessionAction",
}) as any as S.Schema<AssignedSessionAction>;
export type AssignedSessionActions = AssignedSessionAction[];
export const AssignedSessionActions = S.Array(AssignedSessionAction);
export interface AssignedSession {
  queueId: string;
  jobId: string;
  sessionActions: AssignedSessionActions;
  logConfiguration: LogConfiguration;
}
export const AssignedSession = S.suspend(() =>
  S.Struct({
    queueId: S.String,
    jobId: S.String,
    sessionActions: AssignedSessionActions,
    logConfiguration: LogConfiguration,
  }),
).annotations({
  identifier: "AssignedSession",
}) as any as S.Schema<AssignedSession>;
export type AssignedSessions = { [key: string]: AssignedSession };
export const AssignedSessions = S.Record({
  key: S.String,
  value: AssignedSession,
});
export interface UpdateWorkerScheduleResponse {
  assignedSessions: AssignedSessions;
  cancelSessionActions: CancelSessionActions;
  desiredWorkerStatus?: string;
  updateIntervalSeconds: number;
}
export const UpdateWorkerScheduleResponse = S.suspend(() =>
  S.Struct({
    assignedSessions: AssignedSessions,
    cancelSessionActions: CancelSessionActions,
    desiredWorkerStatus: S.optional(S.String),
    updateIntervalSeconds: S.Number,
  }),
).annotations({
  identifier: "UpdateWorkerScheduleResponse",
}) as any as S.Schema<UpdateWorkerScheduleResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String, context: S.optional(ExceptionContext) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    reason: S.String,
    resourceId: S.String,
    resourceType: S.String,
    context: S.optional(ExceptionContext),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    context: S.optional(ExceptionContext),
  },
).pipe(C.withBadRequestError) {}
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
).pipe(C.withThrottlingError, C.withRetryableError) {}
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
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
    context: S.optional(ExceptionContext),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * A list of the available metered products.
 */
export const listAvailableMeteredProducts: {
  (
    input: ListAvailableMeteredProductsRequest,
  ): Effect.Effect<
    ListAvailableMeteredProductsResponse,
    InternalServerErrorException | ThrottlingException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAvailableMeteredProductsRequest,
  ) => Stream.Stream<
    ListAvailableMeteredProductsResponse,
    InternalServerErrorException | ThrottlingException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAvailableMeteredProductsRequest,
  ) => Stream.Stream<
    MeteredProductSummary,
    InternalServerErrorException | ThrottlingException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQueueFleetAssociations: {
  (
    input: ListQueueFleetAssociationsRequest,
  ): Effect.Effect<
    ListQueueFleetAssociationsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueueFleetAssociationsRequest,
  ) => Stream.Stream<
    ListQueueFleetAssociationsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueueFleetAssociationsRequest,
  ) => Stream.Stream<
    QueueFleetAssociationSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQueueLimitAssociations: {
  (
    input: ListQueueLimitAssociationsRequest,
  ): Effect.Effect<
    ListQueueLimitAssociationsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueueLimitAssociationsRequest,
  ) => Stream.Stream<
    ListQueueLimitAssociationsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueueLimitAssociationsRequest,
  ) => Stream.Stream<
    QueueLimitAssociationSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createMonitor: (
  input: CreateMonitorRequest,
) => Effect.Effect<
  CreateMonitorResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSessionsStatisticsAggregation: {
  (
    input: GetSessionsStatisticsAggregationRequest,
  ): Effect.Effect<
    GetSessionsStatisticsAggregationResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSessionsStatisticsAggregationRequest,
  ) => Stream.Stream<
    GetSessionsStatisticsAggregationResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSessionsStatisticsAggregationRequest,
  ) => Stream.Stream<
    Statistics,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createBudget: (
  input: CreateBudgetRequest,
) => Effect.Effect<
  CreateBudgetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFleet: (
  input: GetFleetRequest,
) => Effect.Effect<
  GetFleetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorker: (
  input: GetWorkerRequest,
) => Effect.Effect<
  GetWorkerResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createQueue: (
  input: CreateQueueRequest,
) => Effect.Effect<
  CreateQueueResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJob: (
  input: CreateJobRequest,
) => Effect.Effect<
  CreateJobResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSessionAction: (
  input: GetSessionActionRequest,
) => Effect.Effect<
  GetSessionActionResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStep: (
  input: GetStepRequest,
) => Effect.Effect<
  GetStepResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTask: (
  input: GetTaskRequest,
) => Effect.Effect<
  GetTaskResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteQueueFleetAssociation: (
  input: DeleteQueueFleetAssociationRequest,
) => Effect.Effect<
  DeleteQueueFleetAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Searches for steps.
 */
export const searchSteps: (
  input: SearchStepsRequest,
) => Effect.Effect<
  SearchStepsResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchTasks: (
  input: SearchTasksRequest,
) => Effect.Effect<
  SearchTasksResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchWorkers: (
  input: SearchWorkersRequest,
) => Effect.Effect<
  SearchWorkersResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSessionsStatisticsAggregation: (
  input: StartSessionsStatisticsAggregationRequest,
) => Effect.Effect<
  StartSessionsStatisticsAggregationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStorageProfile: (
  input: CreateStorageProfileRequest,
) => Effect.Effect<
  CreateStorageProfileResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the members of a farm.
 */
export const listFarmMembers: {
  (
    input: ListFarmMembersRequest,
  ): Effect.Effect<
    ListFarmMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFarmMembersRequest,
  ) => Stream.Stream<
    ListFarmMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFarmMembersRequest,
  ) => Stream.Stream<
    FarmMember,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Gets a list of limits defined in the specified farm.
 */
export const listLimits: {
  (
    input: ListLimitsRequest,
  ): Effect.Effect<
    ListLimitsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLimitsRequest,
  ) => Stream.Stream<
    ListLimitsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLimitsRequest,
  ) => Stream.Stream<
    LimitSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listStorageProfiles: {
  (
    input: ListStorageProfilesRequest,
  ): Effect.Effect<
    ListStorageProfilesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStorageProfilesRequest,
  ) => Stream.Stream<
    ListStorageProfilesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStorageProfilesRequest,
  ) => Stream.Stream<
    StorageProfileSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getBudget: (
  input: GetBudgetRequest,
) => Effect.Effect<
  GetBudgetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBudgets: {
  (
    input: ListBudgetsRequest,
  ): Effect.Effect<
    ListBudgetsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBudgetsRequest,
  ) => Stream.Stream<
    ListBudgetsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBudgetsRequest,
  ) => Stream.Stream<
    BudgetSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists fleets.
 */
export const listFleets: {
  (
    input: ListFleetsRequest,
  ): Effect.Effect<
    ListFleetsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetsRequest,
  ) => Stream.Stream<
    ListFleetsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetsRequest,
  ) => Stream.Stream<
    FleetSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const assumeFleetRoleForRead: (
  input: AssumeFleetRoleForReadRequest,
) => Effect.Effect<
  AssumeFleetRoleForReadResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeFleetRoleForReadRequest,
  output: AssumeFleetRoleForReadResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists fleet members.
 */
export const listFleetMembers: {
  (
    input: ListFleetMembersRequest,
  ): Effect.Effect<
    ListFleetMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetMembersRequest,
  ) => Stream.Stream<
    ListFleetMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetMembersRequest,
  ) => Stream.Stream<
    FleetMember,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists workers.
 */
export const listWorkers: {
  (
    input: ListWorkersRequest,
  ): Effect.Effect<
    ListWorkersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkersRequest,
  ) => Stream.Stream<
    ListWorkersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkersRequest,
  ) => Stream.Stream<
    WorkerSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists sessions for a worker.
 */
export const listSessionsForWorker: {
  (
    input: ListSessionsForWorkerRequest,
  ): Effect.Effect<
    ListSessionsForWorkerResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsForWorkerRequest,
  ) => Stream.Stream<
    ListSessionsForWorkerResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsForWorkerRequest,
  ) => Stream.Stream<
    WorkerSessionSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQueues: {
  (
    input: ListQueuesRequest,
  ): Effect.Effect<
    ListQueuesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    ListQueuesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    QueueSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQueueEnvironments: {
  (
    input: ListQueueEnvironmentsRequest,
  ): Effect.Effect<
    ListQueueEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueueEnvironmentsRequest,
  ) => Stream.Stream<
    ListQueueEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueueEnvironmentsRequest,
  ) => Stream.Stream<
    QueueEnvironmentSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listQueueMembers: {
  (
    input: ListQueueMembersRequest,
  ): Effect.Effect<
    ListQueueMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueueMembersRequest,
  ) => Stream.Stream<
    ListQueueMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueueMembersRequest,
  ) => Stream.Stream<
    QueueMember,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Gets a Deadline Cloud job.
 */
export const getJob: (
  input: GetJobRequest,
) => Effect.Effect<
  GetJobResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJobs: {
  (
    input: ListJobsRequest,
  ): Effect.Effect<
    ListJobsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    ListJobsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    JobSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const copyJobTemplate: (
  input: CopyJobTemplateRequest,
) => Effect.Effect<
  CopyJobTemplateResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJobMembers: {
  (
    input: ListJobMembersRequest,
  ): Effect.Effect<
    ListJobMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobMembersRequest,
  ) => Stream.Stream<
    ListJobMembersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobMembersRequest,
  ) => Stream.Stream<
    JobMember,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists sessions.
 */
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): Effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists step consumers.
 */
export const listStepConsumers: {
  (
    input: ListStepConsumersRequest,
  ): Effect.Effect<
    ListStepConsumersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStepConsumersRequest,
  ) => Stream.Stream<
    ListStepConsumersResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStepConsumersRequest,
  ) => Stream.Stream<
    StepConsumer,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the dependencies for a step.
 */
export const listStepDependencies: {
  (
    input: ListStepDependenciesRequest,
  ): Effect.Effect<
    ListStepDependenciesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStepDependenciesRequest,
  ) => Stream.Stream<
    ListStepDependenciesResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStepDependenciesRequest,
  ) => Stream.Stream<
    StepDependency,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSteps: {
  (
    input: ListStepsRequest,
  ): Effect.Effect<
    ListStepsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStepsRequest,
  ) => Stream.Stream<
    ListStepsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStepsRequest,
  ) => Stream.Stream<
    StepSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTasks: {
  (
    input: ListTasksRequest,
  ): Effect.Effect<
    ListTasksResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTasksRequest,
  ) => Stream.Stream<
    ListTasksResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTasksRequest,
  ) => Stream.Stream<
    TaskSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listLicenseEndpoints: {
  (
    input: ListLicenseEndpointsRequest,
  ): Effect.Effect<
    ListLicenseEndpointsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLicenseEndpointsRequest,
  ) => Stream.Stream<
    ListLicenseEndpointsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLicenseEndpointsRequest,
  ) => Stream.Stream<
    LicenseEndpointSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createQueueLimitAssociation: (
  input: CreateQueueLimitAssociationRequest,
) => Effect.Effect<
  CreateQueueLimitAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueLimitAssociationRequest,
  output: CreateQueueLimitAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a queue-fleet association.
 */
export const updateQueueFleetAssociation: (
  input: UpdateQueueFleetAssociationRequest,
) => Effect.Effect<
  UpdateQueueFleetAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueFleetAssociationRequest,
  output: UpdateQueueFleetAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the status of the queue. If you set the status to one of the
 * `STOP_LIMIT_USAGE*` values, there will be a delay before the status
 * transitions to the `STOPPED` state.
 */
export const updateQueueLimitAssociation: (
  input: UpdateQueueLimitAssociationRequest,
) => Effect.Effect<
  UpdateQueueLimitAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueLimitAssociationRequest,
  output: UpdateQueueLimitAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a farm.
 */
export const updateFarm: (
  input: UpdateFarmRequest,
) => Effect.Effect<
  UpdateFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFarm: (
  input: DeleteFarmRequest,
) => Effect.Effect<
  DeleteFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateMemberToFarm: (
  input: AssociateMemberToFarmRequest,
) => Effect.Effect<
  AssociateMemberToFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates a member from a farm.
 */
export const disassociateMemberFromFarm: (
  input: DisassociateMemberFromFarmRequest,
) => Effect.Effect<
  DisassociateMemberFromFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMemberFromFarmRequest,
  output: DisassociateMemberFromFarmResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of the specified limit.
 */
export const updateLimit: (
  input: UpdateLimitRequest,
) => Effect.Effect<
  UpdateLimitResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStorageProfile: (
  input: UpdateStorageProfileRequest,
) => Effect.Effect<
  UpdateStorageProfileResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStorageProfileRequest,
  output: UpdateStorageProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a budget.
 */
export const deleteBudget: (
  input: DeleteBudgetRequest,
) => Effect.Effect<
  DeleteBudgetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFleet: (
  input: UpdateFleetRequest,
) => Effect.Effect<
  UpdateFleetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateMemberToFleet: (
  input: AssociateMemberToFleetRequest,
) => Effect.Effect<
  AssociateMemberToFleetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a queue.
 */
export const updateQueue: (
  input: UpdateQueueRequest,
) => Effect.Effect<
  UpdateQueueResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateMemberToQueue: (
  input: AssociateMemberToQueueRequest,
) => Effect.Effect<
  AssociateMemberToQueueResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the queue environment.
 */
export const updateQueueEnvironment: (
  input: UpdateQueueEnvironmentRequest,
) => Effect.Effect<
  UpdateQueueEnvironmentResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueEnvironmentRequest,
  output: UpdateQueueEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns a job membership level to a member
 */
export const associateMemberToJob: (
  input: AssociateMemberToJobRequest,
) => Effect.Effect<
  AssociateMemberToJobResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disassociates a member from a job.
 */
export const disassociateMemberFromJob: (
  input: DisassociateMemberFromJobRequest,
) => Effect.Effect<
  DisassociateMemberFromJobResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMemberFromJobRequest,
  output: DisassociateMemberFromJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a metered product.
 */
export const putMeteredProduct: (
  input: PutMeteredProductRequest,
) => Effect.Effect<
  PutMeteredProductResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMeteredProduct: (
  input: DeleteMeteredProductRequest,
) => Effect.Effect<
  DeleteMeteredProductResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMeteredProductRequest,
  output: DeleteMeteredProductResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies the settings for a Deadline Cloud monitor. You can modify one or all of the settings
 * when you call `UpdateMonitor`.
 */
export const updateMonitor: (
  input: UpdateMonitorRequest,
) => Effect.Effect<
  UpdateMonitorResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMonitor: (
  input: DeleteMonitorRequest,
) => Effect.Effect<
  DeleteMonitorResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueueFleetAssociation: (
  input: GetQueueFleetAssociationRequest,
) => Effect.Effect<
  GetQueueFleetAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueFleetAssociationRequest,
  output: GetQueueFleetAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specific association between a queue and a limit.
 */
export const getQueueLimitAssociation: (
  input: GetQueueLimitAssociationRequest,
) => Effect.Effect<
  GetQueueLimitAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueLimitAssociationRequest,
  output: GetQueueLimitAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFarm: (
  input: CreateFarmRequest,
) => Effect.Effect<
  CreateFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getFarm: (
  input: GetFarmRequest,
) => Effect.Effect<
  GetFarmResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLimit: (
  input: CreateLimitRequest,
) => Effect.Effect<
  CreateLimitResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLimit: (
  input: GetLimitRequest,
) => Effect.Effect<
  GetLimitResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStorageProfile: (
  input: GetStorageProfileRequest,
) => Effect.Effect<
  GetStorageProfileResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBudget: (
  input: UpdateBudgetRequest,
) => Effect.Effect<
  UpdateBudgetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueue: (
  input: GetQueueRequest,
) => Effect.Effect<
  GetQueueResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const assumeQueueRoleForRead: (
  input: AssumeQueueRoleForReadRequest,
) => Effect.Effect<
  AssumeQueueRoleForReadResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeQueueRoleForReadRequest,
  output: AssumeQueueRoleForReadResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows a user to assume a role for a queue.
 */
export const assumeQueueRoleForUser: (
  input: AssumeQueueRoleForUserRequest,
) => Effect.Effect<
  AssumeQueueRoleForUserResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeQueueRoleForUserRequest,
  output: AssumeQueueRoleForUserResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an environment for a queue that defines how jobs in the queue run.
 */
export const createQueueEnvironment: (
  input: CreateQueueEnvironmentRequest,
) => Effect.Effect<
  CreateQueueEnvironmentResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets a queue environment.
 */
export const getQueueEnvironment: (
  input: GetQueueEnvironmentRequest,
) => Effect.Effect<
  GetQueueEnvironmentResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStorageProfileForQueue: (
  input: GetStorageProfileForQueueRequest,
) => Effect.Effect<
  GetStorageProfileForQueueResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStorageProfileForQueueRequest,
  output: GetStorageProfileForQueueResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists storage profiles for a queue.
 */
export const listStorageProfilesForQueue: {
  (
    input: ListStorageProfilesForQueueRequest,
  ): Effect.Effect<
    ListStorageProfilesForQueueResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStorageProfilesForQueueRequest,
  ) => Stream.Stream<
    ListStorageProfilesForQueueResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStorageProfilesForQueueRequest,
  ) => Stream.Stream<
    StorageProfileSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSession: (
  input: GetSessionRequest,
) => Effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJobParameterDefinitions: {
  (
    input: ListJobParameterDefinitionsRequest,
  ): Effect.Effect<
    ListJobParameterDefinitionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobParameterDefinitionsRequest,
  ) => Stream.Stream<
    ListJobParameterDefinitionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobParameterDefinitionsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getLicenseEndpoint: (
  input: GetLicenseEndpointRequest,
) => Effect.Effect<
  GetLicenseEndpointResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listMeteredProducts: {
  (
    input: ListMeteredProductsRequest,
  ): Effect.Effect<
    ListMeteredProductsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMeteredProductsRequest,
  ) => Stream.Stream<
    ListMeteredProductsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMeteredProductsRequest,
  ) => Stream.Stream<
    MeteredProductSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getMonitor: (
  input: GetMonitorRequest,
) => Effect.Effect<
  GetMonitorResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteQueueLimitAssociation: (
  input: DeleteQueueLimitAssociationRequest,
) => Effect.Effect<
  DeleteQueueLimitAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Removes a tag from a resource using the resource's ARN and tag to remove.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFleet: (
  input: DeleteFleetRequest,
) => Effect.Effect<
  DeleteFleetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateMemberFromFleet: (
  input: DisassociateMemberFromFleetRequest,
) => Effect.Effect<
  DisassociateMemberFromFleetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a worker.
 */
export const deleteWorker: (
  input: DeleteWorkerRequest,
) => Effect.Effect<
  DeleteWorkerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteQueue: (
  input: DeleteQueueRequest,
) => Effect.Effect<
  DeleteQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateMemberFromQueue: (
  input: DisassociateMemberFromQueueRequest,
) => Effect.Effect<
  DisassociateMemberFromQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a job.
 *
 * When you change the status of the job to `ARCHIVED`, the job can't be
 * scheduled or archived.
 *
 * An archived jobs and its steps and tasks are deleted after 120 days. The job can't be
 * recovered.
 */
export const updateJob: (
  input: UpdateJobRequest,
) => Effect.Effect<
  UpdateJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSession: (
  input: UpdateSessionRequest,
) => Effect.Effect<
  UpdateSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateStep: (
  input: UpdateStepRequest,
) => Effect.Effect<
  UpdateStepResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTask: (
  input: UpdateTaskRequest,
) => Effect.Effect<
  UpdateTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteLicenseEndpoint: (
  input: DeleteLicenseEndpointRequest,
) => Effect.Effect<
  DeleteLicenseEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tags a resource using the resource's ARN and desired tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const assumeFleetRoleForWorker: (
  input: AssumeFleetRoleForWorkerRequest,
) => Effect.Effect<
  AssumeFleetRoleForWorkerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Allows a worker to assume a queue role.
 */
export const assumeQueueRoleForWorker: (
  input: AssumeQueueRoleForWorkerRequest,
) => Effect.Effect<
  AssumeQueueRoleForWorkerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const createWorker: (
  input: CreateWorkerRequest,
) => Effect.Effect<
  CreateWorkerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorker: (
  input: UpdateWorkerRequest,
) => Effect.Effect<
  UpdateWorkerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listFarms: {
  (
    input: ListFarmsRequest,
  ): Effect.Effect<
    ListFarmsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFarmsRequest,
  ) => Stream.Stream<
    ListFarmsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFarmsRequest,
  ) => Stream.Stream<
    FarmSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listMonitors: {
  (
    input: ListMonitorsRequest,
  ): Effect.Effect<
    ListMonitorsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitorsRequest,
  ) => Stream.Stream<
    ListMonitorsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitorsRequest,
  ) => Stream.Stream<
    MonitorSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Removes a limit from the specified farm. Before you delete a limit you must use the
 * `DeleteQueueLimitAssociation` operation to remove the association with any
 * queues.
 */
export const deleteLimit: (
  input: DeleteLimitRequest,
) => Effect.Effect<
  DeleteLimitResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteStorageProfile: (
  input: DeleteStorageProfileRequest,
) => Effect.Effect<
  DeleteStorageProfileResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageProfileRequest,
  output: DeleteStorageProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a queue environment.
 */
export const deleteQueueEnvironment: (
  input: DeleteQueueEnvironmentRequest,
) => Effect.Effect<
  DeleteQueueEnvironmentResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueEnvironmentRequest,
  output: DeleteQueueEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a queue and a fleet.
 */
export const createQueueFleetAssociation: (
  input: CreateQueueFleetAssociationRequest,
) => Effect.Effect<
  CreateQueueFleetAssociationResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueFleetAssociationRequest,
  output: CreateQueueFleetAssociationResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists session actions.
 */
export const listSessionActions: {
  (
    input: ListSessionActionsRequest,
  ): Effect.Effect<
    ListSessionActionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionActionsRequest,
  ) => Stream.Stream<
    ListSessionActionsResponse,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionActionsRequest,
  ) => Stream.Stream<
    SessionActionSummary,
    | AccessDeniedException
    | InternalServerErrorException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a license endpoint to integrate your various licensed software used for
 * rendering on Deadline Cloud.
 */
export const createLicenseEndpoint: (
  input: CreateLicenseEndpointRequest,
) => Effect.Effect<
  CreateLicenseEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Searches for jobs.
 */
export const searchJobs: (
  input: SearchJobsRequest,
) => Effect.Effect<
  SearchJobsResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFleet: (
  input: CreateFleetRequest,
) => Effect.Effect<
  CreateFleetResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetJobEntity: (
  input: BatchGetJobEntityRequest,
) => Effect.Effect<
  BatchGetJobEntityResponse,
  | AccessDeniedException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkerSchedule: (
  input: UpdateWorkerScheduleRequest,
) => Effect.Effect<
  UpdateWorkerScheduleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));

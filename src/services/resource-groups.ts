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
  sdkId: "Resource Groups",
  serviceShapeName: "Ardi",
});
const auth = T.AwsAuthSigv4({ name: "resource-groups" });
const ver = T.ServiceVersion("2017-11-27");
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
                        url: "https://resource-groups-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://resource-groups.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://resource-groups-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://resource-groups.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://resource-groups.{Region}.{PartitionResult#dnsSuffix}",
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
export type TagSyncTaskArn = string;
export type CreateGroupName = string;
export type Description = string;
export type Criticality = number;
export type Owner = string;
export type DisplayName = string;
export type GroupName = string;
export type GroupStringV2 = string;
export type GroupString = string;
export type GroupArnV2 = string;
export type ResourceArn = string;
export type MaxResults = number;
export type NextToken = string;
export type TagKey = string;
export type TagValue = string;
export type RoleArn = string;
export type Query = string;
export type GroupConfigurationType = string;
export type GroupLifecycleEventsStatusMessage = string;
export type ListGroupingStatusesFilterValue = string;
export type ResourceFilterValue = string;
export type GroupFilterValue = string;
export type ErrorMessage = string;
export type GroupConfigurationParameterName = string;
export type GroupConfigurationParameterValue = string;
export type GroupConfigurationFailureReason = string;
export type ErrorCode = string;
export type ResourceType = string;
export type QueryErrorMessage = string;
export type ApplicationTagKey = string;
export type ApplicationArn = string;
export type GroupArn = string;

//# Schemas
export interface GetAccountSettingsRequest {}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelTagSyncTaskInput {
  TaskArn: string;
}
export const CancelTagSyncTaskInput = S.suspend(() =>
  S.Struct({ TaskArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cancel-tag-sync-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTagSyncTaskInput",
}) as any as S.Schema<CancelTagSyncTaskInput>;
export interface CancelTagSyncTaskResponse {}
export const CancelTagSyncTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTagSyncTaskResponse",
}) as any as S.Schema<CancelTagSyncTaskResponse>;
export interface DeleteGroupInput {
  GroupName?: string;
  Group?: string;
}
export const DeleteGroupInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGroupInput",
}) as any as S.Schema<DeleteGroupInput>;
export interface GetGroupInput {
  GroupName?: string;
  Group?: string;
}
export const GetGroupInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupInput",
}) as any as S.Schema<GetGroupInput>;
export interface GetGroupConfigurationInput {
  Group?: string;
}
export const GetGroupConfigurationInput = S.suspend(() =>
  S.Struct({ Group: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-group-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupConfigurationInput",
}) as any as S.Schema<GetGroupConfigurationInput>;
export interface GetGroupQueryInput {
  GroupName?: string;
  Group?: string;
}
export const GetGroupQueryInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-group-query" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupQueryInput",
}) as any as S.Schema<GetGroupQueryInput>;
export interface GetTagsInput {
  Arn: string;
}
export const GetTagsInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resources/{Arn}/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetTagsInput" }) as any as S.Schema<GetTagsInput>;
export interface GetTagSyncTaskInput {
  TaskArn: string;
}
export const GetTagSyncTaskInput = S.suspend(() =>
  S.Struct({ TaskArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-tag-sync-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTagSyncTaskInput",
}) as any as S.Schema<GetTagSyncTaskInput>;
export interface GroupResourcesInput {
  Group: string;
  ResourceArns: ResourceArnList;
}
export const GroupResourcesInput = S.suspend(() =>
  S.Struct({ Group: S.String, ResourceArns: ResourceArnList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/group-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GroupResourcesInput",
}) as any as S.Schema<GroupResourcesInput>;
export type GroupConfigurationParameterValueList = string[];
export const GroupConfigurationParameterValueList = S.Array(S.String);
export interface GroupConfigurationParameter {
  Name: string;
  Values?: GroupConfigurationParameterValueList;
}
export const GroupConfigurationParameter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Values: S.optional(GroupConfigurationParameterValueList),
  }),
).annotations({
  identifier: "GroupConfigurationParameter",
}) as any as S.Schema<GroupConfigurationParameter>;
export type GroupParameterList = GroupConfigurationParameter[];
export const GroupParameterList = S.Array(GroupConfigurationParameter);
export interface GroupConfigurationItem {
  Type: string;
  Parameters?: GroupParameterList;
}
export const GroupConfigurationItem = S.suspend(() =>
  S.Struct({ Type: S.String, Parameters: S.optional(GroupParameterList) }),
).annotations({
  identifier: "GroupConfigurationItem",
}) as any as S.Schema<GroupConfigurationItem>;
export type GroupConfigurationList = GroupConfigurationItem[];
export const GroupConfigurationList = S.Array(GroupConfigurationItem);
export interface PutGroupConfigurationInput {
  Group?: string;
  Configuration?: GroupConfigurationList;
}
export const PutGroupConfigurationInput = S.suspend(() =>
  S.Struct({
    Group: S.optional(S.String),
    Configuration: S.optional(GroupConfigurationList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/put-group-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutGroupConfigurationInput",
}) as any as S.Schema<PutGroupConfigurationInput>;
export interface PutGroupConfigurationOutput {}
export const PutGroupConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutGroupConfigurationOutput",
}) as any as S.Schema<PutGroupConfigurationOutput>;
export interface ResourceQuery {
  Type: string;
  Query: string;
}
export const ResourceQuery = S.suspend(() =>
  S.Struct({ Type: S.String, Query: S.String }),
).annotations({
  identifier: "ResourceQuery",
}) as any as S.Schema<ResourceQuery>;
export interface SearchResourcesInput {
  ResourceQuery: ResourceQuery;
  MaxResults?: number;
  NextToken?: string;
}
export const SearchResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceQuery: ResourceQuery,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resources/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchResourcesInput",
}) as any as S.Schema<SearchResourcesInput>;
export interface StartTagSyncTaskInput {
  Group: string;
  TagKey?: string;
  TagValue?: string;
  ResourceQuery?: ResourceQuery;
  RoleArn: string;
}
export const StartTagSyncTaskInput = S.suspend(() =>
  S.Struct({
    Group: S.String,
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    ResourceQuery: S.optional(ResourceQuery),
    RoleArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-tag-sync-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTagSyncTaskInput",
}) as any as S.Schema<StartTagSyncTaskInput>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagInput {
  Arn: string;
  Tags: Tags;
}
export const TagInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")), Tags: Tags }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/resources/{Arn}/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "TagInput" }) as any as S.Schema<TagInput>;
export interface UngroupResourcesInput {
  Group: string;
  ResourceArns: ResourceArnList;
}
export const UngroupResourcesInput = S.suspend(() =>
  S.Struct({ Group: S.String, ResourceArns: ResourceArnList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ungroup-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UngroupResourcesInput",
}) as any as S.Schema<UngroupResourcesInput>;
export interface UntagInput {
  Arn: string;
  Keys: TagKeyList;
}
export const UntagInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")), Keys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/resources/{Arn}/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "UntagInput" }) as any as S.Schema<UntagInput>;
export interface UpdateAccountSettingsInput {
  GroupLifecycleEventsDesiredStatus?: string;
}
export const UpdateAccountSettingsInput = S.suspend(() =>
  S.Struct({ GroupLifecycleEventsDesiredStatus: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-account-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountSettingsInput",
}) as any as S.Schema<UpdateAccountSettingsInput>;
export interface UpdateGroupInput {
  GroupName?: string;
  Group?: string;
  Description?: string;
  Criticality?: number;
  Owner?: string;
  DisplayName?: string;
}
export const UpdateGroupInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
    Description: S.optional(S.String),
    Criticality: S.optional(S.Number),
    Owner: S.optional(S.String),
    DisplayName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGroupInput",
}) as any as S.Schema<UpdateGroupInput>;
export interface UpdateGroupQueryInput {
  GroupName?: string;
  Group?: string;
  ResourceQuery: ResourceQuery;
}
export const UpdateGroupQueryInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
    ResourceQuery: ResourceQuery,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-group-query" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGroupQueryInput",
}) as any as S.Schema<UpdateGroupQueryInput>;
export type ListGroupingStatusesFilterValues = string[];
export const ListGroupingStatusesFilterValues = S.Array(S.String);
export type ResourceFilterValues = string[];
export const ResourceFilterValues = S.Array(S.String);
export type GroupFilterValues = string[];
export const GroupFilterValues = S.Array(S.String);
export interface AccountSettings {
  GroupLifecycleEventsDesiredStatus?: string;
  GroupLifecycleEventsStatus?: string;
  GroupLifecycleEventsStatusMessage?: string;
}
export const AccountSettings = S.suspend(() =>
  S.Struct({
    GroupLifecycleEventsDesiredStatus: S.optional(S.String),
    GroupLifecycleEventsStatus: S.optional(S.String),
    GroupLifecycleEventsStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountSettings",
}) as any as S.Schema<AccountSettings>;
export interface ListGroupingStatusesFilter {
  Name: string;
  Values: ListGroupingStatusesFilterValues;
}
export const ListGroupingStatusesFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: ListGroupingStatusesFilterValues }),
).annotations({
  identifier: "ListGroupingStatusesFilter",
}) as any as S.Schema<ListGroupingStatusesFilter>;
export type ListGroupingStatusesFilterList = ListGroupingStatusesFilter[];
export const ListGroupingStatusesFilterList = S.Array(
  ListGroupingStatusesFilter,
);
export interface ResourceFilter {
  Name: string;
  Values: ResourceFilterValues;
}
export const ResourceFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: ResourceFilterValues }),
).annotations({
  identifier: "ResourceFilter",
}) as any as S.Schema<ResourceFilter>;
export type ResourceFilterList = ResourceFilter[];
export const ResourceFilterList = S.Array(ResourceFilter);
export interface GroupFilter {
  Name: string;
  Values: GroupFilterValues;
}
export const GroupFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: GroupFilterValues }),
).annotations({ identifier: "GroupFilter" }) as any as S.Schema<GroupFilter>;
export type GroupFilterList = GroupFilter[];
export const GroupFilterList = S.Array(GroupFilter);
export interface ListTagSyncTasksFilter {
  GroupArn?: string;
  GroupName?: string;
}
export const ListTagSyncTasksFilter = S.suspend(() =>
  S.Struct({ GroupArn: S.optional(S.String), GroupName: S.optional(S.String) }),
).annotations({
  identifier: "ListTagSyncTasksFilter",
}) as any as S.Schema<ListTagSyncTasksFilter>;
export type ListTagSyncTasksFilterList = ListTagSyncTasksFilter[];
export const ListTagSyncTasksFilterList = S.Array(ListTagSyncTasksFilter);
export interface GetAccountSettingsOutput {
  AccountSettings?: AccountSettings;
}
export const GetAccountSettingsOutput = S.suspend(() =>
  S.Struct({ AccountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "GetAccountSettingsOutput",
}) as any as S.Schema<GetAccountSettingsOutput>;
export type ApplicationTag = { [key: string]: string };
export const ApplicationTag = S.Record({ key: S.String, value: S.String });
export interface Group {
  GroupArn: string;
  Name: string;
  Description?: string;
  Criticality?: number;
  Owner?: string;
  DisplayName?: string;
  ApplicationTag?: ApplicationTag;
}
export const Group = S.suspend(() =>
  S.Struct({
    GroupArn: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    Criticality: S.optional(S.Number),
    Owner: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ApplicationTag: S.optional(ApplicationTag),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export interface GetGroupOutput {
  Group?: Group;
}
export const GetGroupOutput = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "GetGroupOutput",
}) as any as S.Schema<GetGroupOutput>;
export interface GetTagsOutput {
  Arn?: string;
  Tags?: Tags;
}
export const GetTagsOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Tags: S.optional(Tags) }),
).annotations({
  identifier: "GetTagsOutput",
}) as any as S.Schema<GetTagsOutput>;
export interface GetTagSyncTaskOutput {
  GroupArn?: string;
  GroupName?: string;
  TaskArn?: string;
  TagKey?: string;
  TagValue?: string;
  ResourceQuery?: ResourceQuery;
  RoleArn?: string;
  Status?: string;
  ErrorMessage?: string;
  CreatedAt?: Date;
}
export const GetTagSyncTaskOutput = S.suspend(() =>
  S.Struct({
    GroupArn: S.optional(S.String),
    GroupName: S.optional(S.String),
    TaskArn: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    ResourceQuery: S.optional(ResourceQuery),
    RoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetTagSyncTaskOutput",
}) as any as S.Schema<GetTagSyncTaskOutput>;
export interface ListGroupingStatusesInput {
  Group: string;
  MaxResults?: number;
  Filters?: ListGroupingStatusesFilterList;
  NextToken?: string;
}
export const ListGroupingStatusesInput = S.suspend(() =>
  S.Struct({
    Group: S.String,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListGroupingStatusesFilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-grouping-statuses" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupingStatusesInput",
}) as any as S.Schema<ListGroupingStatusesInput>;
export interface ListGroupResourcesInput {
  GroupName?: string;
  Group?: string;
  Filters?: ResourceFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListGroupResourcesInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    Group: S.optional(S.String),
    Filters: S.optional(ResourceFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-group-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupResourcesInput",
}) as any as S.Schema<ListGroupResourcesInput>;
export interface ListGroupsInput {
  Filters?: GroupFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListGroupsInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(GroupFilterList),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/groups-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupsInput",
}) as any as S.Schema<ListGroupsInput>;
export interface ListTagSyncTasksInput {
  Filters?: ListTagSyncTasksFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagSyncTasksInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListTagSyncTasksFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-tag-sync-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagSyncTasksInput",
}) as any as S.Schema<ListTagSyncTasksInput>;
export interface StartTagSyncTaskOutput {
  GroupArn?: string;
  GroupName?: string;
  TaskArn?: string;
  TagKey?: string;
  TagValue?: string;
  ResourceQuery?: ResourceQuery;
  RoleArn?: string;
}
export const StartTagSyncTaskOutput = S.suspend(() =>
  S.Struct({
    GroupArn: S.optional(S.String),
    GroupName: S.optional(S.String),
    TaskArn: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    ResourceQuery: S.optional(ResourceQuery),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "StartTagSyncTaskOutput",
}) as any as S.Schema<StartTagSyncTaskOutput>;
export interface TagOutput {
  Arn?: string;
  Tags?: Tags;
}
export const TagOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Tags: S.optional(Tags) }),
).annotations({ identifier: "TagOutput" }) as any as S.Schema<TagOutput>;
export interface FailedResource {
  ResourceArn?: string;
  ErrorMessage?: string;
  ErrorCode?: string;
}
export const FailedResource = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedResource",
}) as any as S.Schema<FailedResource>;
export type FailedResourceList = FailedResource[];
export const FailedResourceList = S.Array(FailedResource);
export interface PendingResource {
  ResourceArn?: string;
}
export const PendingResource = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }),
).annotations({
  identifier: "PendingResource",
}) as any as S.Schema<PendingResource>;
export type PendingResourceList = PendingResource[];
export const PendingResourceList = S.Array(PendingResource);
export interface UngroupResourcesOutput {
  Succeeded?: ResourceArnList;
  Failed?: FailedResourceList;
  Pending?: PendingResourceList;
}
export const UngroupResourcesOutput = S.suspend(() =>
  S.Struct({
    Succeeded: S.optional(ResourceArnList),
    Failed: S.optional(FailedResourceList),
    Pending: S.optional(PendingResourceList),
  }),
).annotations({
  identifier: "UngroupResourcesOutput",
}) as any as S.Schema<UngroupResourcesOutput>;
export interface UntagOutput {
  Arn?: string;
  Keys?: TagKeyList;
}
export const UntagOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Keys: S.optional(TagKeyList) }),
).annotations({ identifier: "UntagOutput" }) as any as S.Schema<UntagOutput>;
export interface UpdateAccountSettingsOutput {
  AccountSettings?: AccountSettings;
}
export const UpdateAccountSettingsOutput = S.suspend(() =>
  S.Struct({ AccountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "UpdateAccountSettingsOutput",
}) as any as S.Schema<UpdateAccountSettingsOutput>;
export interface UpdateGroupOutput {
  Group?: Group;
}
export const UpdateGroupOutput = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "UpdateGroupOutput",
}) as any as S.Schema<UpdateGroupOutput>;
export interface GroupQuery {
  GroupName: string;
  ResourceQuery: ResourceQuery;
}
export const GroupQuery = S.suspend(() =>
  S.Struct({ GroupName: S.String, ResourceQuery: ResourceQuery }),
).annotations({ identifier: "GroupQuery" }) as any as S.Schema<GroupQuery>;
export interface UpdateGroupQueryOutput {
  GroupQuery?: GroupQuery;
}
export const UpdateGroupQueryOutput = S.suspend(() =>
  S.Struct({ GroupQuery: S.optional(GroupQuery) }),
).annotations({
  identifier: "UpdateGroupQueryOutput",
}) as any as S.Schema<UpdateGroupQueryOutput>;
export interface GroupConfiguration {
  Configuration?: GroupConfigurationList;
  ProposedConfiguration?: GroupConfigurationList;
  Status?: string;
  FailureReason?: string;
}
export const GroupConfiguration = S.suspend(() =>
  S.Struct({
    Configuration: S.optional(GroupConfigurationList),
    ProposedConfiguration: S.optional(GroupConfigurationList),
    Status: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GroupConfiguration",
}) as any as S.Schema<GroupConfiguration>;
export type GroupList = Group[];
export const GroupList = S.Array(Group);
export interface ResourceIdentifier {
  ResourceArn?: string;
  ResourceType?: string;
}
export const ResourceIdentifier = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceIdentifier",
}) as any as S.Schema<ResourceIdentifier>;
export type ResourceIdentifierList = ResourceIdentifier[];
export const ResourceIdentifierList = S.Array(ResourceIdentifier);
export interface QueryError {
  ErrorCode?: string;
  Message?: string;
}
export const QueryError = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({ identifier: "QueryError" }) as any as S.Schema<QueryError>;
export type QueryErrorList = QueryError[];
export const QueryErrorList = S.Array(QueryError);
export interface CreateGroupInput {
  Name: string;
  Description?: string;
  ResourceQuery?: ResourceQuery;
  Tags?: Tags;
  Configuration?: GroupConfigurationList;
  Criticality?: number;
  Owner?: string;
  DisplayName?: string;
}
export const CreateGroupInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ResourceQuery: S.optional(ResourceQuery),
    Tags: S.optional(Tags),
    Configuration: S.optional(GroupConfigurationList),
    Criticality: S.optional(S.Number),
    Owner: S.optional(S.String),
    DisplayName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGroupInput",
}) as any as S.Schema<CreateGroupInput>;
export interface GetGroupConfigurationOutput {
  GroupConfiguration?: GroupConfiguration;
}
export const GetGroupConfigurationOutput = S.suspend(() =>
  S.Struct({ GroupConfiguration: S.optional(GroupConfiguration) }),
).annotations({
  identifier: "GetGroupConfigurationOutput",
}) as any as S.Schema<GetGroupConfigurationOutput>;
export interface GetGroupQueryOutput {
  GroupQuery?: GroupQuery;
}
export const GetGroupQueryOutput = S.suspend(() =>
  S.Struct({ GroupQuery: S.optional(GroupQuery) }),
).annotations({
  identifier: "GetGroupQueryOutput",
}) as any as S.Schema<GetGroupQueryOutput>;
export interface GroupResourcesOutput {
  Succeeded?: ResourceArnList;
  Failed?: FailedResourceList;
  Pending?: PendingResourceList;
}
export const GroupResourcesOutput = S.suspend(() =>
  S.Struct({
    Succeeded: S.optional(ResourceArnList),
    Failed: S.optional(FailedResourceList),
    Pending: S.optional(PendingResourceList),
  }),
).annotations({
  identifier: "GroupResourcesOutput",
}) as any as S.Schema<GroupResourcesOutput>;
export interface SearchResourcesOutput {
  ResourceIdentifiers?: ResourceIdentifierList;
  NextToken?: string;
  QueryErrors?: QueryErrorList;
}
export const SearchResourcesOutput = S.suspend(() =>
  S.Struct({
    ResourceIdentifiers: S.optional(ResourceIdentifierList),
    NextToken: S.optional(S.String),
    QueryErrors: S.optional(QueryErrorList),
  }),
).annotations({
  identifier: "SearchResourcesOutput",
}) as any as S.Schema<SearchResourcesOutput>;
export interface GroupingStatusesItem {
  ResourceArn?: string;
  Action?: string;
  Status?: string;
  ErrorMessage?: string;
  ErrorCode?: string;
  UpdatedAt?: Date;
}
export const GroupingStatusesItem = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Action: S.optional(S.String),
    Status: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GroupingStatusesItem",
}) as any as S.Schema<GroupingStatusesItem>;
export type GroupingStatusesList = GroupingStatusesItem[];
export const GroupingStatusesList = S.Array(GroupingStatusesItem);
export interface GroupIdentifier {
  GroupName?: string;
  GroupArn?: string;
  Description?: string;
  Criticality?: number;
  Owner?: string;
  DisplayName?: string;
}
export const GroupIdentifier = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    GroupArn: S.optional(S.String),
    Description: S.optional(S.String),
    Criticality: S.optional(S.Number),
    Owner: S.optional(S.String),
    DisplayName: S.optional(S.String),
  }),
).annotations({
  identifier: "GroupIdentifier",
}) as any as S.Schema<GroupIdentifier>;
export type GroupIdentifierList = GroupIdentifier[];
export const GroupIdentifierList = S.Array(GroupIdentifier);
export interface TagSyncTaskItem {
  GroupArn?: string;
  GroupName?: string;
  TaskArn?: string;
  TagKey?: string;
  TagValue?: string;
  ResourceQuery?: ResourceQuery;
  RoleArn?: string;
  Status?: string;
  ErrorMessage?: string;
  CreatedAt?: Date;
}
export const TagSyncTaskItem = S.suspend(() =>
  S.Struct({
    GroupArn: S.optional(S.String),
    GroupName: S.optional(S.String),
    TaskArn: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    ResourceQuery: S.optional(ResourceQuery),
    RoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TagSyncTaskItem",
}) as any as S.Schema<TagSyncTaskItem>;
export type TagSyncTaskList = TagSyncTaskItem[];
export const TagSyncTaskList = S.Array(TagSyncTaskItem);
export interface CreateGroupOutput {
  Group?: Group;
  ResourceQuery?: ResourceQuery;
  Tags?: Tags;
  GroupConfiguration?: GroupConfiguration;
}
export const CreateGroupOutput = S.suspend(() =>
  S.Struct({
    Group: S.optional(Group),
    ResourceQuery: S.optional(ResourceQuery),
    Tags: S.optional(Tags),
    GroupConfiguration: S.optional(GroupConfiguration),
  }),
).annotations({
  identifier: "CreateGroupOutput",
}) as any as S.Schema<CreateGroupOutput>;
export interface DeleteGroupOutput {
  Group?: Group;
}
export const DeleteGroupOutput = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "DeleteGroupOutput",
}) as any as S.Schema<DeleteGroupOutput>;
export interface ListGroupingStatusesOutput {
  Group?: string;
  GroupingStatuses?: GroupingStatusesList;
  NextToken?: string;
}
export const ListGroupingStatusesOutput = S.suspend(() =>
  S.Struct({
    Group: S.optional(S.String),
    GroupingStatuses: S.optional(GroupingStatusesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupingStatusesOutput",
}) as any as S.Schema<ListGroupingStatusesOutput>;
export interface ListGroupsOutput {
  GroupIdentifiers?: GroupIdentifierList;
  Groups?: GroupList;
  NextToken?: string;
}
export const ListGroupsOutput = S.suspend(() =>
  S.Struct({
    GroupIdentifiers: S.optional(GroupIdentifierList),
    Groups: S.optional(GroupList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupsOutput",
}) as any as S.Schema<ListGroupsOutput>;
export interface ListTagSyncTasksOutput {
  TagSyncTasks?: TagSyncTaskList;
  NextToken?: string;
}
export const ListTagSyncTasksOutput = S.suspend(() =>
  S.Struct({
    TagSyncTasks: S.optional(TagSyncTaskList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTagSyncTasksOutput",
}) as any as S.Schema<ListTagSyncTasksOutput>;
export interface ResourceStatus {
  Name?: string;
}
export const ResourceStatus = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "ResourceStatus",
}) as any as S.Schema<ResourceStatus>;
export interface ListGroupResourcesItem {
  Identifier?: ResourceIdentifier;
  Status?: ResourceStatus;
}
export const ListGroupResourcesItem = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(ResourceIdentifier),
    Status: S.optional(ResourceStatus),
  }),
).annotations({
  identifier: "ListGroupResourcesItem",
}) as any as S.Schema<ListGroupResourcesItem>;
export type ListGroupResourcesItemList = ListGroupResourcesItem[];
export const ListGroupResourcesItemList = S.Array(ListGroupResourcesItem);
export interface ListGroupResourcesOutput {
  Resources?: ListGroupResourcesItemList;
  ResourceIdentifiers?: ResourceIdentifierList;
  NextToken?: string;
  QueryErrors?: QueryErrorList;
}
export const ListGroupResourcesOutput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ListGroupResourcesItemList),
    ResourceIdentifiers: S.optional(ResourceIdentifierList),
    NextToken: S.optional(S.String),
    QueryErrors: S.optional(QueryErrorList),
  }),
).annotations({
  identifier: "ListGroupResourcesOutput",
}) as any as S.Schema<ListGroupResourcesOutput>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Creates a resource group with the specified name and description. You can optionally
 * include either a resource query or a service configuration. For more information about
 * constructing a resource query, see Build queries and groups in
 * Resource Groups in the *Resource Groups User Guide*. For more information
 * about service-linked groups and service configurations, see Service configurations for Resource Groups.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:CreateGroup`
 */
export const createGroup: (
  input: CreateGroupInput,
) => Effect.Effect<
  CreateGroupOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupInput,
  output: CreateGroupOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the status of the last grouping or ungrouping action for
 * each resource in the specified application group.
 */
export const listGroupingStatuses: {
  (
    input: ListGroupingStatusesInput,
  ): Effect.Effect<
    ListGroupingStatusesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupingStatusesInput,
  ) => Stream.Stream<
    ListGroupingStatusesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupingStatusesInput,
  ) => Stream.Stream<
    GroupingStatusesItem,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupingStatusesInput,
  output: ListGroupingStatusesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "GroupingStatuses",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of existing Resource Groups in your account.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:ListGroups`
 */
export const listGroups: {
  (
    input: ListGroupsInput,
  ): Effect.Effect<
    ListGroupsOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsInput,
  ) => Stream.Stream<
    ListGroupsOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsInput,
  ) => Stream.Stream<
    GroupIdentifier,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsInput,
  output: ListGroupsOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "GroupIdentifiers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the current status of optional features in Resource Groups.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => Effect.Effect<
  GetAccountSettingsOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Turns on or turns off optional features in Resource Groups.
 *
 * The preceding example shows that the request to turn on group lifecycle events is
 * `IN_PROGRESS`. You can call the GetAccountSettings
 * operation to check for completion by looking for `GroupLifecycleEventsStatus`
 * to change to `ACTIVE`.
 */
export const updateAccountSettings: (
  input: UpdateAccountSettingsInput,
) => Effect.Effect<
  UpdateAccountSettingsOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSettingsInput,
  output: UpdateAccountSettingsOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the specified resource group. Deleting a resource group does not delete any
 * resources that are members of the group; it only deletes the group structure.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:DeleteGroup`
 */
export const deleteGroup: (
  input: DeleteGroupInput,
) => Effect.Effect<
  DeleteGroupOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupInput,
  output: DeleteGroupOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the service configuration associated with the specified resource group. For
 * details about the service configuration syntax, see Service configurations for Resource Groups.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GetGroupConfiguration`
 */
export const getGroupConfiguration: (
  input: GetGroupConfigurationInput,
) => Effect.Effect<
  GetGroupConfigurationOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupConfigurationInput,
  output: GetGroupConfigurationOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the resource query associated with the specified resource group. For more
 * information about resource queries, see Create
 * a tag-based group in Resource Groups.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GetGroupQuery`
 */
export const getGroupQuery: (
  input: GetGroupQueryInput,
) => Effect.Effect<
  GetGroupQueryOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupQueryInput,
  output: GetGroupQueryOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds the specified resources to the specified group.
 *
 * You can only use this operation with the following groups:
 *
 * - `AWS::EC2::HostManagement`
 *
 * - `AWS::EC2::CapacityReservationPool`
 *
 * - `AWS::ResourceGroups::ApplicationGroup`
 *
 * Other resource group types and resource types are not currently supported by this
 * operation.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GroupResources`
 */
export const groupResources: (
  input: GroupResourcesInput,
) => Effect.Effect<
  GroupResourcesOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GroupResourcesInput,
  output: GroupResourcesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information about a specified resource group.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GetGroup`
 */
export const getGroup: (
  input: GetGroupInput,
) => Effect.Effect<
  GetGroupOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupInput,
  output: GetGroupOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of tags that are associated with a resource group, specified by an
 * Amazon resource name (ARN).
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GetTags`
 */
export const getTags: (
  input: GetTagsInput,
) => Effect.Effect<
  GetTagsOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsInput,
  output: GetTagsOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds tags to a resource group with the specified Amazon resource name (ARN). Existing tags on a resource
 * group are not changed if they are not specified in the request parameters.
 *
 * Do not store personally identifiable information (PII) or other confidential or
 * sensitive information in tags. We use tags to provide you with billing and
 * administration services. Tags are not intended to be used for private or sensitive
 * data.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:Tag`
 */
export const tag: (
  input: TagInput,
) => Effect.Effect<
  TagOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagInput,
  output: TagOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes the specified resources from the specified group. This operation works only
 * with static groups that you populated using the GroupResources
 * operation. It doesn't work with any resource groups that are automatically populated by
 * tag-based or CloudFormation stack-based queries.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:UngroupResources`
 */
export const ungroupResources: (
  input: UngroupResourcesInput,
) => Effect.Effect<
  UngroupResourcesOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UngroupResourcesInput,
  output: UngroupResourcesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes tags from a specified resource group.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:Untag`
 */
export const untag: (
  input: UntagInput,
) => Effect.Effect<
  UntagOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagInput,
  output: UntagOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the description for an existing group. You cannot update the name of a
 * resource group.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:UpdateGroup`
 */
export const updateGroup: (
  input: UpdateGroupInput,
) => Effect.Effect<
  UpdateGroupOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupInput,
  output: UpdateGroupOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the resource query of a group. For more information about resource queries,
 * see Create a tag-based group in Resource Groups.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:UpdateGroupQuery`
 */
export const updateGroupQuery: (
  input: UpdateGroupQueryInput,
) => Effect.Effect<
  UpdateGroupQueryOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupQueryInput,
  output: UpdateGroupQueryOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Attaches a service configuration to the specified group. This occurs asynchronously,
 * and can take time to complete. You can use GetGroupConfiguration to
 * check the status of the update.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:PutGroupConfiguration`
 */
export const putGroupConfiguration: (
  input: PutGroupConfigurationInput,
) => Effect.Effect<
  PutGroupConfigurationOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGroupConfigurationInput,
  output: PutGroupConfigurationOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Cancels the specified tag-sync task.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:CancelTagSyncTask` on the application group
 *
 * - `resource-groups:DeleteGroup`
 */
export const cancelTagSyncTask: (
  input: CancelTagSyncTaskInput,
) => Effect.Effect<
  CancelTagSyncTaskResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTagSyncTaskInput,
  output: CancelTagSyncTaskResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of Amazon resource names (ARNs) of the resources that are members of a specified resource
 * group.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:ListGroupResources`
 *
 * - `cloudformation:DescribeStacks`
 *
 * - `cloudformation:ListStackResources`
 *
 * - `tag:GetResources`
 */
export const listGroupResources: {
  (
    input: ListGroupResourcesInput,
  ): Effect.Effect<
    ListGroupResourcesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupResourcesInput,
  ) => Stream.Stream<
    ListGroupResourcesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupResourcesInput,
  ) => Stream.Stream<
    ResourceIdentifier,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | NotFoundException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupResourcesInput,
  output: ListGroupResourcesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceIdentifiers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of tag-sync tasks.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:ListTagSyncTasks` with the group passed in the filters as the resource
 * or * if using no filters
 */
export const listTagSyncTasks: {
  (
    input: ListTagSyncTasksInput,
  ): Effect.Effect<
    ListTagSyncTasksOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagSyncTasksInput,
  ) => Stream.Stream<
    ListTagSyncTasksOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagSyncTasksInput,
  ) => Stream.Stream<
    TagSyncTaskItem,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagSyncTasksInput,
  output: ListTagSyncTasksOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TagSyncTasks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of Amazon Web Services resource identifiers that matches the specified query. The
 * query uses the same format as a resource query in a CreateGroup or
 * UpdateGroupQuery operation.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:SearchResources`
 *
 * - `cloudformation:DescribeStacks`
 *
 * - `cloudformation:ListStackResources`
 *
 * - `tag:GetResources`
 */
export const searchResources: {
  (
    input: SearchResourcesInput,
  ): Effect.Effect<
    SearchResourcesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchResourcesInput,
  ) => Stream.Stream<
    SearchResourcesOutput,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchResourcesInput,
  ) => Stream.Stream<
    ResourceIdentifier,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | MethodNotAllowedException
    | TooManyRequestsException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchResourcesInput,
  output: SearchResourcesOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceIdentifiers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about a specified tag-sync task.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:GetTagSyncTask` on the application group
 */
export const getTagSyncTask: (
  input: GetTagSyncTaskInput,
) => Effect.Effect<
  GetTagSyncTaskOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagSyncTaskInput,
  output: GetTagSyncTaskOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new tag-sync task to onboard and sync resources tagged with a specific tag key-value pair to an
 * application. To start a tag-sync task, you need a resource tagging role.
 * The resource tagging role grants permissions to tag and untag applications resources and must include a
 * trust policy that allows Resource Groups to assume the role and perform resource tagging tasks on your behalf.
 *
 * For instructions on creating a tag-sync task, see Create a tag-sync
 * using the Resource Groups API in the *Amazon Web Services Service Catalog AppRegistry Administrator Guide*.
 *
 * **Minimum permissions**
 *
 * To run this command, you must have the following permissions:
 *
 * - `resource-groups:StartTagSyncTask` on the application group
 *
 * - `resource-groups:CreateGroup`
 *
 * - `iam:PassRole` on the role provided in the request
 */
export const startTagSyncTask: (
  input: StartTagSyncTaskInput,
) => Effect.Effect<
  StartTagSyncTaskOutput,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | TooManyRequestsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTagSyncTaskInput,
  output: StartTagSyncTaskOutput,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));

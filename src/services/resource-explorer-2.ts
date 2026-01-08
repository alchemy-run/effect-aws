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
  sdkId: "Resource Explorer 2",
  serviceShapeName: "ResourceExplorer",
});
const auth = T.AwsAuthSigv4({ name: "resource-explorer-2" });
const ver = T.ServiceVersion("2022-07-28");
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
              `https://resource-explorer-2-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://resource-explorer-2-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://resource-explorer-2.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://resource-explorer-2.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IndexType = string;
export type IndexState = string;
export type AccountId = string;
export type QueryString = string | Redacted.Redacted<string>;
export type ViewName = string;
export type AWSServiceAccessStatus = string;
export type OperationStatus = string;

//# Schemas
export interface DisassociateDefaultViewRequest {}
export const DisassociateDefaultViewRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateDefaultViewRequest",
}) as any as S.Schema<DisassociateDefaultViewRequest>;
export interface DisassociateDefaultViewResponse {}
export const DisassociateDefaultViewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateDefaultViewResponse",
}) as any as S.Schema<DisassociateDefaultViewResponse>;
export interface GetAccountLevelServiceConfigurationRequest {}
export const GetAccountLevelServiceConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountLevelServiceConfigurationRequest",
}) as any as S.Schema<GetAccountLevelServiceConfigurationRequest>;
export interface GetDefaultViewRequest {}
export const GetDefaultViewRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDefaultViewRequest",
}) as any as S.Schema<GetDefaultViewRequest>;
export interface GetIndexRequest {}
export const GetIndexRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIndexRequest",
}) as any as S.Schema<GetIndexRequest>;
export interface GetServiceIndexRequest {}
export const GetServiceIndexRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceIndexRequest",
}) as any as S.Schema<GetServiceIndexRequest>;
export type ViewArnList = string[];
export const ViewArnList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface BatchGetViewInput {
  ViewArns?: ViewArnList;
}
export const BatchGetViewInput = S.suspend(() =>
  S.Struct({ ViewArns: S.optional(ViewArnList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchGetView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetViewInput",
}) as any as S.Schema<BatchGetViewInput>;
export interface CreateResourceExplorerSetupInput {
  RegionList: RegionList;
  AggregatorRegions?: RegionList;
  ViewName: string;
}
export const CreateResourceExplorerSetupInput = S.suspend(() =>
  S.Struct({
    RegionList: RegionList,
    AggregatorRegions: S.optional(RegionList),
    ViewName: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateResourceExplorerSetup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceExplorerSetupInput",
}) as any as S.Schema<CreateResourceExplorerSetupInput>;
export interface DeleteResourceExplorerSetupInput {
  RegionList?: RegionList;
  DeleteInAllRegions?: boolean;
}
export const DeleteResourceExplorerSetupInput = S.suspend(() =>
  S.Struct({
    RegionList: S.optional(RegionList),
    DeleteInAllRegions: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteResourceExplorerSetup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceExplorerSetupInput",
}) as any as S.Schema<DeleteResourceExplorerSetupInput>;
export interface GetDefaultViewOutput {
  ViewArn?: string;
}
export const GetDefaultViewOutput = S.suspend(() =>
  S.Struct({ ViewArn: S.optional(S.String) }),
).annotations({
  identifier: "GetDefaultViewOutput",
}) as any as S.Schema<GetDefaultViewOutput>;
export interface GetManagedViewInput {
  ManagedViewArn: string;
}
export const GetManagedViewInput = S.suspend(() =>
  S.Struct({ ManagedViewArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetManagedView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedViewInput",
}) as any as S.Schema<GetManagedViewInput>;
export interface GetResourceExplorerSetupInput {
  TaskId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetResourceExplorerSetupInput = S.suspend(() =>
  S.Struct({
    TaskId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceExplorerSetup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceExplorerSetupInput",
}) as any as S.Schema<GetResourceExplorerSetupInput>;
export interface GetServiceIndexOutput {
  Arn?: string;
  Type?: string;
}
export const GetServiceIndexOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "GetServiceIndexOutput",
}) as any as S.Schema<GetServiceIndexOutput>;
export interface GetServiceViewInput {
  ServiceViewArn: string;
}
export const GetServiceViewInput = S.suspend(() =>
  S.Struct({ ServiceViewArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetServiceView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceViewInput",
}) as any as S.Schema<GetServiceViewInput>;
export interface ListIndexesForMembersInput {
  AccountIdList: AccountIdList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListIndexesForMembersInput = S.suspend(() =>
  S.Struct({
    AccountIdList: AccountIdList,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListIndexesForMembers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIndexesForMembersInput",
}) as any as S.Schema<ListIndexesForMembersInput>;
export interface ListManagedViewsInput {
  MaxResults?: number;
  NextToken?: string;
  ServicePrincipal?: string;
}
export const ListManagedViewsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServicePrincipal: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListManagedViews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedViewsInput",
}) as any as S.Schema<ListManagedViewsInput>;
export interface ListServiceIndexesInput {
  Regions?: RegionList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListServiceIndexesInput = S.suspend(() =>
  S.Struct({
    Regions: S.optional(RegionList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListServiceIndexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServiceIndexesInput",
}) as any as S.Schema<ListServiceIndexesInput>;
export interface ListServiceViewsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListServiceViewsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListServiceViews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServiceViewsInput",
}) as any as S.Schema<ListServiceViewsInput>;
export interface ListStreamingAccessForServicesInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListStreamingAccessForServicesInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListStreamingAccessForServices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStreamingAccessForServicesInput",
}) as any as S.Schema<ListStreamingAccessForServicesInput>;
export interface ListSupportedResourceTypesInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListSupportedResourceTypesInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListSupportedResourceTypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSupportedResourceTypesInput",
}) as any as S.Schema<ListSupportedResourceTypesInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface SearchInput {
  QueryString: string | Redacted.Redacted<string>;
  MaxResults?: number;
  ViewArn?: string;
  NextToken?: string;
}
export const SearchInput = S.suspend(() =>
  S.Struct({
    QueryString: SensitiveString,
    MaxResults: S.optional(S.Number),
    ViewArn: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/Search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "SearchInput" }) as any as S.Schema<SearchInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceInput {
  resourceArn: string;
  Tags?: TagMap;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: StringList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: StringList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface CreateIndexInput {
  ClientToken?: string;
  Tags?: TagMap;
}
export const CreateIndexInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateIndex" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIndexInput",
}) as any as S.Schema<CreateIndexInput>;
export interface UpdateIndexTypeInput {
  Arn: string;
  Type: string;
}
export const UpdateIndexTypeInput = S.suspend(() =>
  S.Struct({ Arn: S.String, Type: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateIndexType" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIndexTypeInput",
}) as any as S.Schema<UpdateIndexTypeInput>;
export interface DeleteIndexInput {
  Arn: string;
}
export const DeleteIndexInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteIndex" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIndexInput",
}) as any as S.Schema<DeleteIndexInput>;
export interface ListIndexesInput {
  Type?: string;
  Regions?: RegionList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListIndexesInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Regions: S.optional(RegionList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListIndexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIndexesInput",
}) as any as S.Schema<ListIndexesInput>;
export interface GetViewInput {
  ViewArn: string;
}
export const GetViewInput = S.suspend(() =>
  S.Struct({ ViewArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetViewInput" }) as any as S.Schema<GetViewInput>;
export interface IncludedProperty {
  Name: string;
}
export const IncludedProperty = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "IncludedProperty",
}) as any as S.Schema<IncludedProperty>;
export type IncludedPropertyList = IncludedProperty[];
export const IncludedPropertyList = S.Array(IncludedProperty);
export interface SearchFilter {
  FilterString: string;
}
export const SearchFilter = S.suspend(() =>
  S.Struct({ FilterString: S.String }),
).annotations({ identifier: "SearchFilter" }) as any as S.Schema<SearchFilter>;
export interface UpdateViewInput {
  ViewArn: string;
  IncludedProperties?: IncludedPropertyList;
  Filters?: SearchFilter;
}
export const UpdateViewInput = S.suspend(() =>
  S.Struct({
    ViewArn: S.String,
    IncludedProperties: S.optional(IncludedPropertyList),
    Filters: S.optional(SearchFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateViewInput",
}) as any as S.Schema<UpdateViewInput>;
export interface DeleteViewInput {
  ViewArn: string;
}
export const DeleteViewInput = S.suspend(() =>
  S.Struct({ ViewArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteViewInput",
}) as any as S.Schema<DeleteViewInput>;
export interface ListViewsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListViewsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListViews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListViewsInput",
}) as any as S.Schema<ListViewsInput>;
export interface AssociateDefaultViewInput {
  ViewArn: string;
}
export const AssociateDefaultViewInput = S.suspend(() =>
  S.Struct({ ViewArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssociateDefaultView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateDefaultViewInput",
}) as any as S.Schema<AssociateDefaultViewInput>;
export interface OrgConfiguration {
  AWSServiceAccessStatus: string;
  ServiceLinkedRole?: string;
}
export const OrgConfiguration = S.suspend(() =>
  S.Struct({
    AWSServiceAccessStatus: S.String,
    ServiceLinkedRole: S.optional(S.String),
  }),
).annotations({
  identifier: "OrgConfiguration",
}) as any as S.Schema<OrgConfiguration>;
export type ManagedViewArnList = string[];
export const ManagedViewArnList = S.Array(S.String);
export type ServiceViewArnList = string[];
export const ServiceViewArnList = S.Array(S.String);
export interface CreateResourceExplorerSetupOutput {
  TaskId: string;
}
export const CreateResourceExplorerSetupOutput = S.suspend(() =>
  S.Struct({ TaskId: S.String }),
).annotations({
  identifier: "CreateResourceExplorerSetupOutput",
}) as any as S.Schema<CreateResourceExplorerSetupOutput>;
export interface DeleteResourceExplorerSetupOutput {
  TaskId: string;
}
export const DeleteResourceExplorerSetupOutput = S.suspend(() =>
  S.Struct({ TaskId: S.String }),
).annotations({
  identifier: "DeleteResourceExplorerSetupOutput",
}) as any as S.Schema<DeleteResourceExplorerSetupOutput>;
export interface GetAccountLevelServiceConfigurationOutput {
  OrgConfiguration?: OrgConfiguration;
}
export const GetAccountLevelServiceConfigurationOutput = S.suspend(() =>
  S.Struct({ OrgConfiguration: S.optional(OrgConfiguration) }),
).annotations({
  identifier: "GetAccountLevelServiceConfigurationOutput",
}) as any as S.Schema<GetAccountLevelServiceConfigurationOutput>;
export interface GetIndexOutput {
  Arn?: string;
  Type?: string;
  State?: string;
  ReplicatingFrom?: RegionList;
  ReplicatingTo?: RegionList;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Tags?: TagMap;
}
export const GetIndexOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    State: S.optional(S.String),
    ReplicatingFrom: S.optional(RegionList),
    ReplicatingTo: S.optional(RegionList),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetIndexOutput",
}) as any as S.Schema<GetIndexOutput>;
export interface ListManagedViewsOutput {
  NextToken?: string;
  ManagedViews?: ManagedViewArnList;
}
export const ListManagedViewsOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ManagedViews: S.optional(ManagedViewArnList),
  }),
).annotations({
  identifier: "ListManagedViewsOutput",
}) as any as S.Schema<ListManagedViewsOutput>;
export interface ListResourcesInput {
  Filters?: SearchFilter;
  MaxResults?: number;
  ViewArn?: string;
  NextToken?: string;
}
export const ListResourcesInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(SearchFilter),
    MaxResults: S.optional(S.Number),
    ViewArn: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcesInput",
}) as any as S.Schema<ListResourcesInput>;
export interface ListServiceViewsOutput {
  NextToken?: string;
  ServiceViews?: ServiceViewArnList;
}
export const ListServiceViewsOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServiceViews: S.optional(ServiceViewArnList),
  }),
).annotations({
  identifier: "ListServiceViewsOutput",
}) as any as S.Schema<ListServiceViewsOutput>;
export interface ListTagsForResourceOutput {
  Tags?: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface CreateIndexOutput {
  Arn?: string;
  State?: string;
  CreatedAt?: Date;
}
export const CreateIndexOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    State: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateIndexOutput",
}) as any as S.Schema<CreateIndexOutput>;
export interface UpdateIndexTypeOutput {
  Arn?: string;
  Type?: string;
  State?: string;
  LastUpdatedAt?: Date;
}
export const UpdateIndexTypeOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateIndexTypeOutput",
}) as any as S.Schema<UpdateIndexTypeOutput>;
export interface DeleteIndexOutput {
  Arn?: string;
  State?: string;
  LastUpdatedAt?: Date;
}
export const DeleteIndexOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    State: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DeleteIndexOutput",
}) as any as S.Schema<DeleteIndexOutput>;
export interface Index {
  Region?: string;
  Arn?: string;
  Type?: string;
}
export const Index = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "Index" }) as any as S.Schema<Index>;
export type IndexList = Index[];
export const IndexList = S.Array(Index);
export interface ListIndexesOutput {
  Indexes?: IndexList;
  NextToken?: string;
}
export const ListIndexesOutput = S.suspend(() =>
  S.Struct({ Indexes: S.optional(IndexList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListIndexesOutput",
}) as any as S.Schema<ListIndexesOutput>;
export interface CreateViewInput {
  ClientToken?: string;
  ViewName: string;
  IncludedProperties?: IncludedPropertyList;
  Scope?: string;
  Filters?: SearchFilter;
  Tags?: TagMap;
}
export const CreateViewInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    ViewName: S.String,
    IncludedProperties: S.optional(IncludedPropertyList),
    Scope: S.optional(S.String),
    Filters: S.optional(SearchFilter),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateView" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateViewInput",
}) as any as S.Schema<CreateViewInput>;
export interface View {
  ViewArn?: string;
  Owner?: string;
  LastUpdatedAt?: Date;
  Scope?: string;
  IncludedProperties?: IncludedPropertyList;
  Filters?: SearchFilter;
}
export const View = S.suspend(() =>
  S.Struct({
    ViewArn: S.optional(S.String),
    Owner: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Scope: S.optional(S.String),
    IncludedProperties: S.optional(IncludedPropertyList),
    Filters: S.optional(SearchFilter),
  }),
).annotations({ identifier: "View" }) as any as S.Schema<View>;
export interface GetViewOutput {
  View?: View;
  Tags?: TagMap;
}
export const GetViewOutput = S.suspend(() =>
  S.Struct({ View: S.optional(View), Tags: S.optional(TagMap) }),
).annotations({
  identifier: "GetViewOutput",
}) as any as S.Schema<GetViewOutput>;
export interface UpdateViewOutput {
  View?: View;
}
export const UpdateViewOutput = S.suspend(() =>
  S.Struct({ View: S.optional(View) }),
).annotations({
  identifier: "UpdateViewOutput",
}) as any as S.Schema<UpdateViewOutput>;
export interface DeleteViewOutput {
  ViewArn?: string;
}
export const DeleteViewOutput = S.suspend(() =>
  S.Struct({ ViewArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteViewOutput",
}) as any as S.Schema<DeleteViewOutput>;
export interface ListViewsOutput {
  Views?: ViewArnList;
  NextToken?: string;
}
export const ListViewsOutput = S.suspend(() =>
  S.Struct({ Views: S.optional(ViewArnList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListViewsOutput",
}) as any as S.Schema<ListViewsOutput>;
export interface AssociateDefaultViewOutput {
  ViewArn?: string;
}
export const AssociateDefaultViewOutput = S.suspend(() =>
  S.Struct({ ViewArn: S.optional(S.String) }),
).annotations({
  identifier: "AssociateDefaultViewOutput",
}) as any as S.Schema<AssociateDefaultViewOutput>;
export type ViewList = View[];
export const ViewList = S.Array(View);
export interface BatchGetViewError {
  ViewArn: string;
  ErrorMessage: string;
}
export const BatchGetViewError = S.suspend(() =>
  S.Struct({ ViewArn: S.String, ErrorMessage: S.String }),
).annotations({
  identifier: "BatchGetViewError",
}) as any as S.Schema<BatchGetViewError>;
export type BatchGetViewErrors = BatchGetViewError[];
export const BatchGetViewErrors = S.Array(BatchGetViewError);
export interface ManagedView {
  ManagedViewArn?: string;
  ManagedViewName?: string;
  TrustedService?: string;
  LastUpdatedAt?: Date;
  Owner?: string;
  Scope?: string;
  IncludedProperties?: IncludedPropertyList;
  Filters?: SearchFilter;
  ResourcePolicy?: string;
  Version?: string;
}
export const ManagedView = S.suspend(() =>
  S.Struct({
    ManagedViewArn: S.optional(S.String),
    ManagedViewName: S.optional(S.String),
    TrustedService: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Owner: S.optional(S.String),
    Scope: S.optional(S.String),
    IncludedProperties: S.optional(IncludedPropertyList),
    Filters: S.optional(SearchFilter),
    ResourcePolicy: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({ identifier: "ManagedView" }) as any as S.Schema<ManagedView>;
export interface ServiceView {
  ServiceViewArn: string;
  Filters?: SearchFilter;
  IncludedProperties?: IncludedPropertyList;
  StreamingAccessForService?: string;
  ScopeType?: string;
}
export const ServiceView = S.suspend(() =>
  S.Struct({
    ServiceViewArn: S.String,
    Filters: S.optional(SearchFilter),
    IncludedProperties: S.optional(IncludedPropertyList),
    StreamingAccessForService: S.optional(S.String),
    ScopeType: S.optional(S.String),
  }),
).annotations({ identifier: "ServiceView" }) as any as S.Schema<ServiceView>;
export interface MemberIndex {
  AccountId?: string;
  Region?: string;
  Arn?: string;
  Type?: string;
}
export const MemberIndex = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Region: S.optional(S.String),
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "MemberIndex" }) as any as S.Schema<MemberIndex>;
export type MemberIndexList = MemberIndex[];
export const MemberIndexList = S.Array(MemberIndex);
export interface StreamingAccessDetails {
  ServicePrincipal: string;
  CreatedAt: Date;
}
export const StreamingAccessDetails = S.suspend(() =>
  S.Struct({
    ServicePrincipal: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "StreamingAccessDetails",
}) as any as S.Schema<StreamingAccessDetails>;
export type StreamingAccessDetailsList = StreamingAccessDetails[];
export const StreamingAccessDetailsList = S.Array(StreamingAccessDetails);
export interface SupportedResourceType {
  Service?: string;
  ResourceType?: string;
}
export const SupportedResourceType = S.suspend(() =>
  S.Struct({
    Service: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "SupportedResourceType",
}) as any as S.Schema<SupportedResourceType>;
export type ResourceTypeList = SupportedResourceType[];
export const ResourceTypeList = S.Array(SupportedResourceType);
export interface ResourceCount {
  TotalResources?: number;
  Complete?: boolean;
}
export const ResourceCount = S.suspend(() =>
  S.Struct({
    TotalResources: S.optional(S.Number),
    Complete: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResourceCount",
}) as any as S.Schema<ResourceCount>;
export interface BatchGetViewOutput {
  Views?: ViewList;
  Errors?: BatchGetViewErrors;
}
export const BatchGetViewOutput = S.suspend(() =>
  S.Struct({
    Views: S.optional(ViewList),
    Errors: S.optional(BatchGetViewErrors),
  }),
).annotations({
  identifier: "BatchGetViewOutput",
}) as any as S.Schema<BatchGetViewOutput>;
export interface GetManagedViewOutput {
  ManagedView?: ManagedView;
}
export const GetManagedViewOutput = S.suspend(() =>
  S.Struct({ ManagedView: S.optional(ManagedView) }),
).annotations({
  identifier: "GetManagedViewOutput",
}) as any as S.Schema<GetManagedViewOutput>;
export interface GetServiceViewOutput {
  View: ServiceView;
}
export const GetServiceViewOutput = S.suspend(() =>
  S.Struct({ View: ServiceView }),
).annotations({
  identifier: "GetServiceViewOutput",
}) as any as S.Schema<GetServiceViewOutput>;
export interface ListIndexesForMembersOutput {
  Indexes?: MemberIndexList;
  NextToken?: string;
}
export const ListIndexesForMembersOutput = S.suspend(() =>
  S.Struct({
    Indexes: S.optional(MemberIndexList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIndexesForMembersOutput",
}) as any as S.Schema<ListIndexesForMembersOutput>;
export interface ResourceProperty {
  Name?: string;
  LastReportedAt?: Date;
  Data?: any;
}
export const ResourceProperty = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    LastReportedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Data: S.optional(S.Any),
  }),
).annotations({
  identifier: "ResourceProperty",
}) as any as S.Schema<ResourceProperty>;
export type ResourcePropertyList = ResourceProperty[];
export const ResourcePropertyList = S.Array(ResourceProperty);
export interface Resource {
  Arn?: string;
  OwningAccountId?: string;
  Region?: string;
  ResourceType?: string;
  Service?: string;
  LastReportedAt?: Date;
  Properties?: ResourcePropertyList;
}
export const Resource = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    OwningAccountId: S.optional(S.String),
    Region: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Service: S.optional(S.String),
    LastReportedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Properties: S.optional(ResourcePropertyList),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface ListResourcesOutput {
  Resources?: ResourceList;
  NextToken?: string;
  ViewArn?: string;
}
export const ListResourcesOutput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ResourceList),
    NextToken: S.optional(S.String),
    ViewArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesOutput",
}) as any as S.Schema<ListResourcesOutput>;
export interface ListServiceIndexesOutput {
  Indexes?: IndexList;
  NextToken?: string;
}
export const ListServiceIndexesOutput = S.suspend(() =>
  S.Struct({ Indexes: S.optional(IndexList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListServiceIndexesOutput",
}) as any as S.Schema<ListServiceIndexesOutput>;
export interface ListStreamingAccessForServicesOutput {
  StreamingAccessForServices: StreamingAccessDetailsList;
  NextToken?: string;
}
export const ListStreamingAccessForServicesOutput = S.suspend(() =>
  S.Struct({
    StreamingAccessForServices: StreamingAccessDetailsList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStreamingAccessForServicesOutput",
}) as any as S.Schema<ListStreamingAccessForServicesOutput>;
export interface ListSupportedResourceTypesOutput {
  ResourceTypes?: ResourceTypeList;
  NextToken?: string;
}
export const ListSupportedResourceTypesOutput = S.suspend(() =>
  S.Struct({
    ResourceTypes: S.optional(ResourceTypeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSupportedResourceTypesOutput",
}) as any as S.Schema<ListSupportedResourceTypesOutput>;
export interface CreateViewOutput {
  View?: View;
}
export const CreateViewOutput = S.suspend(() =>
  S.Struct({ View: S.optional(View) }),
).annotations({
  identifier: "CreateViewOutput",
}) as any as S.Schema<CreateViewOutput>;
export interface ErrorDetails {
  Code?: string;
  Message?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface ViewStatus {
  Status?: string;
  View?: View;
  ErrorDetails?: ErrorDetails;
}
export const ViewStatus = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    View: S.optional(View),
    ErrorDetails: S.optional(ErrorDetails),
  }),
).annotations({ identifier: "ViewStatus" }) as any as S.Schema<ViewStatus>;
export interface SearchOutput {
  Resources?: ResourceList;
  NextToken?: string;
  ViewArn?: string;
  Count?: ResourceCount;
}
export const SearchOutput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ResourceList),
    NextToken: S.optional(S.String),
    ViewArn: S.optional(S.String),
    Count: S.optional(ResourceCount),
  }),
).annotations({ identifier: "SearchOutput" }) as any as S.Schema<SearchOutput>;
export interface IndexStatus {
  Status?: string;
  Index?: Index;
  ErrorDetails?: ErrorDetails;
}
export const IndexStatus = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    Index: S.optional(Index),
    ErrorDetails: S.optional(ErrorDetails),
  }),
).annotations({ identifier: "IndexStatus" }) as any as S.Schema<IndexStatus>;
export interface RegionStatus {
  Region?: string;
  Index?: IndexStatus;
  View?: ViewStatus;
}
export const RegionStatus = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    Index: S.optional(IndexStatus),
    View: S.optional(ViewStatus),
  }),
).annotations({ identifier: "RegionStatus" }) as any as S.Schema<RegionStatus>;
export type RegionStatusList = RegionStatus[];
export const RegionStatusList = S.Array(RegionStatus);
export interface ValidationExceptionField {
  Name: string;
  ValidationIssue: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, ValidationIssue: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface GetResourceExplorerSetupOutput {
  Regions?: RegionStatusList;
  NextToken?: string;
}
export const GetResourceExplorerSetupOutput = S.suspend(() =>
  S.Struct({
    Regions: S.optional(RegionStatusList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceExplorerSetupOutput",
}) as any as S.Schema<GetResourceExplorerSetupOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, Name: S.String, Value: S.String },
).pipe(C.withQuotaError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, FieldList: S.optional(ValidationExceptionFieldList) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves the status of your account's Amazon Web Services service access, and validates the service linked role required to access the multi-account search feature. Only the management account can invoke this API call.
 */
export const getAccountLevelServiceConfiguration: (
  input: GetAccountLevelServiceConfigurationRequest,
) => Effect.Effect<
  GetAccountLevelServiceConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountLevelServiceConfigurationRequest,
  output: GetAccountLevelServiceConfigurationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all Resource Explorer indexes across the specified Amazon Web Services Regions. This operation returns information about indexes including their ARNs, types, and Regions.
 */
export const listServiceIndexes: {
  (
    input: ListServiceIndexesInput,
  ): Effect.Effect<
    ListServiceIndexesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceIndexesInput,
  ) => Stream.Stream<
    ListServiceIndexesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceIndexesInput,
  ) => Stream.Stream<
    Index,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceIndexesInput,
  output: ListServiceIndexesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Indexes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of Amazon Web Services services that have been granted streaming access to your Resource Explorer data. Streaming access allows Amazon Web Services services to receive real-time updates about your resources as they are indexed by Resource Explorer.
 */
export const listStreamingAccessForServices: {
  (
    input: ListStreamingAccessForServicesInput,
  ): Effect.Effect<
    ListStreamingAccessForServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStreamingAccessForServicesInput,
  ) => Stream.Stream<
    ListStreamingAccessForServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStreamingAccessForServicesInput,
  ) => Stream.Stream<
    StreamingAccessDetails,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStreamingAccessForServicesInput,
  output: ListStreamingAccessForServicesOutput,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StreamingAccessForServices",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of all resource types currently supported by Amazon Web Services Resource Explorer.
 */
export const listSupportedResourceTypes: {
  (
    input: ListSupportedResourceTypesInput,
  ): Effect.Effect<
    ListSupportedResourceTypesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSupportedResourceTypesInput,
  ) => Stream.Stream<
    ListSupportedResourceTypesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSupportedResourceTypesInput,
  ) => Stream.Stream<
    SupportedResourceType,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSupportedResourceTypesInput,
  output: ListSupportedResourceTypesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceTypes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves details about the Amazon Web Services Resource Explorer index in the Amazon Web Services Region in which you invoked the operation.
 */
export const getIndex: (
  input: GetIndexRequest,
) => Effect.Effect<
  GetIndexOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIndexRequest,
  output: GetIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Changes the type of the index from one of the following types to the other. For more information about indexes and the role they perform in Amazon Web Services Resource Explorer, see Turning on cross-Region search by creating an aggregator index in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * - ** `AGGREGATOR` index type**
 *
 * The index contains information about resources from all Amazon Web Services Regions in the Amazon Web Services account in which you've created a Resource Explorer index. Resource information from all other Regions is replicated to this Region's index.
 *
 * When you change the index type to `AGGREGATOR`, Resource Explorer turns on replication of all discovered resource information from the other Amazon Web Services Regions in your account to this index. You can then, from this Region only, perform resource search queries that span all Amazon Web Services Regions in the Amazon Web Services account. Turning on replication from all other Regions is performed by asynchronous background tasks. You can check the status of the asynchronous tasks by using the GetIndex operation. When the asynchronous tasks complete, the `Status` response of that operation changes from `UPDATING` to `ACTIVE`. After that, you can start to see results from other Amazon Web Services Regions in query results. However, it can take several hours for replication from all other Regions to complete.
 *
 * You can have only one aggregator index per Amazon Web Services account. Before you can promote a different index to be the aggregator index for the account, you must first demote the existing aggregator index to type `LOCAL`.
 *
 * - ** `LOCAL` index type**
 *
 * The index contains information about resources in only the Amazon Web Services Region in which the index exists. If an aggregator index in another Region exists, then information in this local index is replicated to the aggregator index.
 *
 * When you change the index type to `LOCAL`, Resource Explorer turns off the replication of resource information from all other Amazon Web Services Regions in the Amazon Web Services account to this Region. The aggregator index remains in the `UPDATING` state until all replication with other Regions successfully stops. You can check the status of the asynchronous task by using the GetIndex operation. When Resource Explorer successfully stops all replication with other Regions, the `Status` response of that operation changes from `UPDATING` to `ACTIVE`. Separately, the resource information from other Regions that was previously stored in the index is deleted within 30 days by another background task. Until that asynchronous task completes, some results from other Regions can continue to appear in search results.
 *
 * After you demote an aggregator index to a local index, you must wait 24 hours before you can promote another index to be the new aggregator index for the account.
 */
export const updateIndexType: (
  input: UpdateIndexTypeInput,
) => Effect.Effect<
  UpdateIndexTypeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIndexTypeInput,
  output: UpdateIndexTypeOutput,
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
 * Deletes the specified index and turns off Amazon Web Services Resource Explorer in the specified Amazon Web Services Region. When you delete an index, Resource Explorer stops discovering and indexing resources in that Region. Resource Explorer also deletes all views in that Region. These actions occur as asynchronous background tasks. You can check to see when the actions are complete by using the GetIndex operation and checking the `Status` response value.
 *
 * If the index you delete is the aggregator index for the Amazon Web Services account, you must wait 24 hours before you can promote another local index to be the aggregator index for the account. Users can't perform account-wide searches using Resource Explorer until another aggregator index is configured.
 */
export const deleteIndex: (
  input: DeleteIndexInput,
) => Effect.Effect<
  DeleteIndexOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIndexInput,
  output: DeleteIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets the specified view as the default for the Amazon Web Services Region in which you call this operation. When a user performs a Search that doesn't explicitly specify which view to use, then Amazon Web Services Resource Explorer automatically chooses this default view for searches performed in this Amazon Web Services Region.
 *
 * If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every `Search` operation performed in that Region.
 */
export const associateDefaultView: (
  input: AssociateDefaultViewInput,
) => Effect.Effect<
  AssociateDefaultViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDefaultViewInput,
  output: AssociateDefaultViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the Amazon Resource Name (ARN) of the view that is the default for the Amazon Web Services Region in which you call this operation. You can then call GetView to retrieve the details of that view.
 */
export const getDefaultView: (
  input: GetDefaultViewRequest,
) => Effect.Effect<
  GetDefaultViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDefaultViewRequest,
  output: GetDefaultViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the Resource Explorer index in the current Amazon Web Services Region. This operation returns the ARN and type of the index if one exists.
 */
export const getServiceIndex: (
  input: GetServiceIndexRequest,
) => Effect.Effect<
  GetServiceIndexOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceIndexRequest,
  output: GetServiceIndexOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Resource Explorer service views available in the current Amazon Web Services account. This operation returns the ARNs of available service views.
 */
export const listServiceViews: {
  (
    input: ListServiceViewsInput,
  ): Effect.Effect<
    ListServiceViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceViewsInput,
  ) => Stream.Stream<
    ListServiceViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceViewsInput,
  ) => Stream.Stream<
    string,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceViewsInput,
  output: ListServiceViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServiceViews",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Turns on Amazon Web Services Resource Explorer in the Amazon Web Services Region in which you called this operation by creating an index. Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the Search operation. You can create only one index in a Region.
 *
 * This operation creates only a *local* index. To promote the local index in one Amazon Web Services Region into the aggregator index for the Amazon Web Services account, use the UpdateIndexType operation. For more information, see Turning on cross-Region search by creating an aggregator index in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * For more details about what happens when you turn on Resource Explorer in an Amazon Web Services Region, see Turn on Resource Explorer to index your resources in an Amazon Web Services Region in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * If this is the first Amazon Web Services Region in which you've created an index for Resource Explorer, then this operation also creates a service-linked role in your Amazon Web Services account that allows Resource Explorer to enumerate your resources to populate the index.
 *
 * - **Action**: `resource-explorer-2:CreateIndex`
 *
 * **Resource**: The ARN of the index (as it will exist after the operation completes) in the Amazon Web Services Region and account in which you're trying to create the index. Use the wildcard character (`*`) at the end of the string to match the eventual UUID. For example, the following `Resource` element restricts the role or user to creating an index in only the `us-east-2` Region of the specified account.
 *
 * `"Resource": "arn:aws:resource-explorer-2:us-west-2:*<account-id>*:index/*"`
 *
 * Alternatively, you can use `"Resource": "*"` to allow the role or user to create an index in any Region.
 *
 * - **Action**: `iam:CreateServiceLinkedRole`
 *
 * **Resource**: No specific resource (*).
 *
 * This permission is required only the first time you create an index to turn on Resource Explorer in the account. Resource Explorer uses this to create the service-linked role needed to index the resources in your account. Resource Explorer uses the same service-linked role for all additional indexes you create afterwards.
 */
export const createIndex: (
  input: CreateIndexInput,
) => Effect.Effect<
  CreateIndexOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIndexInput,
  output: CreateIndexOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all of the indexes in Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer.
 */
export const listIndexes: {
  (
    input: ListIndexesInput,
  ): Effect.Effect<
    ListIndexesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndexesInput,
  ) => Stream.Stream<
    ListIndexesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndexesInput,
  ) => Stream.Stream<
    Index,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndexesInput,
  output: ListIndexesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Indexes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Amazon resource names (ARNs) of the views available in the Amazon Web Services Region in which you call this operation.
 *
 * Always check the `NextToken` response parameter for a `null` value when calling a paginated operation. These operations can occasionally return an empty set of results even when there are more results available. The `NextToken` response parameter value is `null` *only* when there are no more results to display.
 */
export const listViews: {
  (
    input: ListViewsInput,
  ): Effect.Effect<
    ListViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListViewsInput,
  ) => Stream.Stream<
    ListViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListViewsInput,
  ) => Stream.Stream<
    string,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListViewsInput,
  output: ListViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Views",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a Resource Explorer setup configuration across multiple Amazon Web Services Regions. This operation sets up indexes and views in the specified Regions. This operation can also be used to set an aggregator Region for cross-Region resource search.
 */
export const createResourceExplorerSetup: (
  input: CreateResourceExplorerSetupInput,
) => Effect.Effect<
  CreateResourceExplorerSetupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceExplorerSetupInput,
  output: CreateResourceExplorerSetupOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a Resource Explorer setup configuration. This operation removes indexes and views from the specified Regions or all Regions where Resource Explorer is configured.
 */
export const deleteResourceExplorerSetup: (
  input: DeleteResourceExplorerSetupInput,
) => Effect.Effect<
  DeleteResourceExplorerSetupOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceExplorerSetupInput,
  output: DeleteResourceExplorerSetupOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * After you call this operation, the affected Amazon Web Services Region no longer has a default view. All Search operations in that Region must explicitly specify a view or the operation fails. You can configure a new default by calling the AssociateDefaultView operation.
 *
 * If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every `Search` operation performed in that Region.
 */
export const disassociateDefaultView: (
  input: DisassociateDefaultViewRequest,
) => Effect.Effect<
  DisassociateDefaultViewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateDefaultViewRequest,
  output: DisassociateDefaultViewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific Resource Explorer service view. This operation returns the configuration and properties of the specified view.
 */
export const getServiceView: (
  input: GetServiceViewInput,
) => Effect.Effect<
  GetServiceViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceViewInput,
  output: GetServiceViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of a member's indexes in all Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer. Only the management account or a delegated administrator with service access enabled can invoke this API call.
 */
export const listIndexesForMembers: {
  (
    input: ListIndexesForMembersInput,
  ): Effect.Effect<
    ListIndexesForMembersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIndexesForMembersInput,
  ) => Stream.Stream<
    ListIndexesForMembersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIndexesForMembersInput,
  ) => Stream.Stream<
    MemberIndex,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIndexesForMembersInput,
  output: ListIndexesForMembersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Indexes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the Amazon resource names (ARNs) of the Amazon Web Services-managed views available in the Amazon Web Services Region in which you call this operation.
 */
export const listManagedViews: {
  (
    input: ListManagedViewsInput,
  ): Effect.Effect<
    ListManagedViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedViewsInput,
  ) => Stream.Stream<
    ListManagedViewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedViewsInput,
  ) => Stream.Stream<
    string,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedViewsInput,
  output: ListManagedViewsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ManagedViews",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Searches for resources and displays details about all resources that match the specified criteria. You must specify a query string.
 *
 * All search queries must use a view. If you don't explicitly specify a view, then Amazon Web Services Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation. The results are the logical intersection of the results that match both the `QueryString` parameter supplied to this operation and the `SearchFilter` parameter attached to the view.
 *
 * For the complete syntax supported by the `QueryString` parameter, see Search query syntax reference for Resource Explorer.
 *
 * If your search results are empty, or are missing results that you think should be there, see Troubleshooting Resource Explorer search.
 */
export const search: {
  (
    input: SearchInput,
  ): Effect.Effect<
    SearchOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchInput,
  ) => Stream.Stream<
    SearchOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchInput,
  ) => Stream.Stream<
    Resource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchInput,
  output: SearchOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of resources and their details that match the specified criteria. This query must use a view. If you don’t explicitly specify a view, then Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation.
 */
export const listResources: {
  (
    input: ListResourcesInput,
  ): Effect.Effect<
    ListResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesInput,
  ) => Stream.Stream<
    ListResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesInput,
  ) => Stream.Stream<
    Resource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesInput,
  output: ListResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Modifies some of the details of a view. You can change the filter string and the list of included properties. You can't change the name of the view.
 */
export const updateView: (
  input: UpdateViewInput,
) => Effect.Effect<
  UpdateViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateViewInput,
  output: UpdateViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the tags that are attached to the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the specified view.
 */
export const getView: (
  input: GetViewInput,
) => Effect.Effect<
  GetViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetViewInput,
  output: GetViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified view.
 *
 * If the specified view is the default view for its Amazon Web Services Region, then all Search operations in that Region must explicitly specify the view to use until you configure a new default by calling the AssociateDefaultView operation.
 */
export const deleteView: (
  input: DeleteViewInput,
) => Effect.Effect<
  DeleteViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteViewInput,
  output: DeleteViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tag key and value pairs from an Amazon Web Services Resource Explorer view or index.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tag key and value pairs to an Amazon Web Services Resource Explorer view or index.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a list of views.
 */
export const batchGetView: (
  input: BatchGetViewInput,
) => Effect.Effect<
  BatchGetViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetViewInput,
  output: BatchGetViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of the specified Amazon Web Services-managed view.
 */
export const getManagedView: (
  input: GetManagedViewInput,
) => Effect.Effect<
  GetManagedViewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedViewInput,
  output: GetManagedViewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Creates a view that users can query by using the Search operation. Results from queries that you make using this view include only resources that match the view's `Filters`. For more information about Amazon Web Services Resource Explorer views, see Managing views in the *Amazon Web Services Resource Explorer User Guide*.
 *
 * Only the principals with an IAM identity-based policy that grants `Allow` to the `Search` action on a `Resource` with the Amazon resource name (ARN) of this view can Search using views you create with this operation.
 */
export const createView: (
  input: CreateViewInput,
) => Effect.Effect<
  CreateViewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateViewInput,
  output: CreateViewOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status and details of a Resource Explorer setup operation. This operation returns information about the progress of creating or deleting Resource Explorer configurations across Regions.
 */
export const getResourceExplorerSetup: {
  (
    input: GetResourceExplorerSetupInput,
  ): Effect.Effect<
    GetResourceExplorerSetupOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceExplorerSetupInput,
  ) => Stream.Stream<
    GetResourceExplorerSetupOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceExplorerSetupInput,
  ) => Stream.Stream<
    RegionStatus,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceExplorerSetupInput,
  output: GetResourceExplorerSetupOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Regions",
    pageSize: "MaxResults",
  } as const,
}));

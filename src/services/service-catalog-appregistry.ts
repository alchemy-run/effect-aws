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
  sdkId: "Service Catalog AppRegistry",
  serviceShapeName: "AWS242AppRegistry",
});
const auth = T.AwsAuthSigv4({ name: "servicecatalog" });
const ver = T.ServiceVersion("2020-06-24");
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
              `https://servicecatalog-appregistry-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(
                `https://servicecatalog-appregistry.${Region}.amazonaws.com`,
              );
            }
            return e(
              `https://servicecatalog-appregistry-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://servicecatalog-appregistry.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://servicecatalog-appregistry.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationSpecifier = string;
export type AttributeGroupSpecifier = string;
export type ResourceSpecifier = string;
export type Name = string;
export type Description = string;
export type ClientToken = string;
export type Attributes = string;
export type NextToken = string;
export type MaxResults = number;
export type Arn = string;
export type TagKey = string;
export type TagValue = string;
export type ApplicationArn = string;
export type AttributeGroupArn = string;
export type ApplicationId = string;
export type AssociationCount = number;
export type AttributeGroupId = string;
export type CreatedBy = string;
export type TagKeyConfig = string;
export type ResourcesListItemErrorMessage = string;
export type ResourceItemType = string;

//# Schemas
export interface GetConfigurationRequest {}
export const GetConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConfigurationRequest",
}) as any as S.Schema<GetConfigurationRequest>;
export type Options = string[];
export const Options = S.Array(S.String);
export type GetAssociatedResourceFilter = string[];
export const GetAssociatedResourceFilter = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AssociateAttributeGroupRequest {
  application: string;
  attributeGroup: string;
}
export const AssociateAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    attributeGroup: S.String.pipe(T.HttpLabel("attributeGroup")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{application}/attribute-groups/{attributeGroup}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAttributeGroupRequest",
}) as any as S.Schema<AssociateAttributeGroupRequest>;
export interface AssociateResourceRequest {
  application: string;
  resourceType: string;
  resource: string;
  options?: Options;
}
export const AssociateResourceRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    resourceType: S.String.pipe(T.HttpLabel("resourceType")),
    resource: S.String.pipe(T.HttpLabel("resource")),
    options: S.optional(Options),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/applications/{application}/resources/{resourceType}/{resource}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateResourceRequest",
}) as any as S.Schema<AssociateResourceRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateAttributeGroupRequest {
  name: string;
  description?: string;
  attributes: string;
  tags?: Tags;
  clientToken: string;
}
export const CreateAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    attributes: S.String,
    tags: S.optional(Tags),
    clientToken: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/attribute-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAttributeGroupRequest",
}) as any as S.Schema<CreateAttributeGroupRequest>;
export interface DeleteApplicationRequest {
  application: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ application: S.String.pipe(T.HttpLabel("application")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/applications/{application}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteAttributeGroupRequest {
  attributeGroup: string;
}
export const DeleteAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    attributeGroup: S.String.pipe(T.HttpLabel("attributeGroup")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/attribute-groups/{attributeGroup}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAttributeGroupRequest",
}) as any as S.Schema<DeleteAttributeGroupRequest>;
export interface DisassociateAttributeGroupRequest {
  application: string;
  attributeGroup: string;
}
export const DisassociateAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    attributeGroup: S.String.pipe(T.HttpLabel("attributeGroup")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{application}/attribute-groups/{attributeGroup}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAttributeGroupRequest",
}) as any as S.Schema<DisassociateAttributeGroupRequest>;
export interface DisassociateResourceRequest {
  application: string;
  resourceType: string;
  resource: string;
}
export const DisassociateResourceRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    resourceType: S.String.pipe(T.HttpLabel("resourceType")),
    resource: S.String.pipe(T.HttpLabel("resource")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{application}/resources/{resourceType}/{resource}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateResourceRequest",
}) as any as S.Schema<DisassociateResourceRequest>;
export interface GetApplicationRequest {
  application: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ application: S.String.pipe(T.HttpLabel("application")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{application}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface GetAssociatedResourceRequest {
  application: string;
  resourceType: string;
  resource: string;
  nextToken?: string;
  resourceTagStatus?: GetAssociatedResourceFilter;
  maxResults?: number;
}
export const GetAssociatedResourceRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    resourceType: S.String.pipe(T.HttpLabel("resourceType")),
    resource: S.String.pipe(T.HttpLabel("resource")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceTagStatus: S.optional(GetAssociatedResourceFilter).pipe(
      T.HttpQuery("resourceTagStatus"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{application}/resources/{resourceType}/{resource}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssociatedResourceRequest",
}) as any as S.Schema<GetAssociatedResourceRequest>;
export interface GetAttributeGroupRequest {
  attributeGroup: string;
}
export const GetAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    attributeGroup: S.String.pipe(T.HttpLabel("attributeGroup")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/attribute-groups/{attributeGroup}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAttributeGroupRequest",
}) as any as S.Schema<GetAttributeGroupRequest>;
export interface ListApplicationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListAssociatedAttributeGroupsRequest {
  application: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssociatedAttributeGroupsRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{application}/attribute-groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedAttributeGroupsRequest",
}) as any as S.Schema<ListAssociatedAttributeGroupsRequest>;
export interface ListAssociatedResourcesRequest {
  application: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssociatedResourcesRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{application}/resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedResourcesRequest",
}) as any as S.Schema<ListAssociatedResourcesRequest>;
export interface ListAttributeGroupsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAttributeGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/attribute-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttributeGroupsRequest",
}) as any as S.Schema<ListAttributeGroupsRequest>;
export interface ListAttributeGroupsForApplicationRequest {
  application: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAttributeGroupsForApplicationRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{application}/attribute-group-details",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttributeGroupsForApplicationRequest",
}) as any as S.Schema<ListAttributeGroupsForApplicationRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface TagQueryConfiguration {
  tagKey?: string;
}
export const TagQueryConfiguration = S.suspend(() =>
  S.Struct({ tagKey: S.optional(S.String) }),
).annotations({
  identifier: "TagQueryConfiguration",
}) as any as S.Schema<TagQueryConfiguration>;
export interface AppRegistryConfiguration {
  tagQueryConfiguration?: TagQueryConfiguration;
}
export const AppRegistryConfiguration = S.suspend(() =>
  S.Struct({ tagQueryConfiguration: S.optional(TagQueryConfiguration) }),
).annotations({
  identifier: "AppRegistryConfiguration",
}) as any as S.Schema<AppRegistryConfiguration>;
export interface PutConfigurationRequest {
  configuration: AppRegistryConfiguration;
}
export const PutConfigurationRequest = S.suspend(() =>
  S.Struct({ configuration: AppRegistryConfiguration }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationRequest",
}) as any as S.Schema<PutConfigurationRequest>;
export interface PutConfigurationResponse {}
export const PutConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationResponse",
}) as any as S.Schema<PutConfigurationResponse>;
export interface SyncResourceRequest {
  resourceType: string;
  resource: string;
}
export const SyncResourceRequest = S.suspend(() =>
  S.Struct({
    resourceType: S.String.pipe(T.HttpLabel("resourceType")),
    resource: S.String.pipe(T.HttpLabel("resource")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/sync/{resourceType}/{resource}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SyncResourceRequest",
}) as any as S.Schema<SyncResourceRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateApplicationRequest {
  application: string;
  name?: string;
  description?: string;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    application: S.String.pipe(T.HttpLabel("application")),
    name: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/applications/{application}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateAttributeGroupRequest {
  attributeGroup: string;
  name?: string;
  description?: string;
  attributes?: string;
}
export const UpdateAttributeGroupRequest = S.suspend(() =>
  S.Struct({
    attributeGroup: S.String.pipe(T.HttpLabel("attributeGroup")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    attributes: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/attribute-groups/{attributeGroup}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAttributeGroupRequest",
}) as any as S.Schema<UpdateAttributeGroupRequest>;
export interface ApplicationSummary {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaries = ApplicationSummary[];
export const ApplicationSummaries = S.Array(ApplicationSummary);
export type AttributeGroupIds = string[];
export const AttributeGroupIds = S.Array(S.String);
export interface AttributeGroupSummary {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  createdBy?: string;
}
export const AttributeGroupSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AttributeGroupSummary",
}) as any as S.Schema<AttributeGroupSummary>;
export type AttributeGroupSummaries = AttributeGroupSummary[];
export const AttributeGroupSummaries = S.Array(AttributeGroupSummary);
export interface AssociateAttributeGroupResponse {
  applicationArn?: string;
  attributeGroupArn?: string;
}
export const AssociateAttributeGroupResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.optional(S.String),
    attributeGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateAttributeGroupResponse",
}) as any as S.Schema<AssociateAttributeGroupResponse>;
export interface AssociateResourceResponse {
  applicationArn?: string;
  resourceArn?: string;
  options?: Options;
}
export const AssociateResourceResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.optional(S.String),
    resourceArn: S.optional(S.String),
    options: S.optional(Options),
  }),
).annotations({
  identifier: "AssociateResourceResponse",
}) as any as S.Schema<AssociateResourceResponse>;
export interface CreateApplicationRequest {
  name: string;
  description?: string;
  tags?: Tags;
  clientToken: string;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(Tags),
    clientToken: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DisassociateAttributeGroupResponse {
  applicationArn?: string;
  attributeGroupArn?: string;
}
export const DisassociateAttributeGroupResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.optional(S.String),
    attributeGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateAttributeGroupResponse",
}) as any as S.Schema<DisassociateAttributeGroupResponse>;
export interface DisassociateResourceResponse {
  applicationArn?: string;
  resourceArn?: string;
}
export const DisassociateResourceResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.optional(S.String),
    resourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateResourceResponse",
}) as any as S.Schema<DisassociateResourceResponse>;
export interface GetAttributeGroupResponse {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  attributes?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  tags?: Tags;
  createdBy?: string;
}
export const GetAttributeGroupResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    attributes: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(Tags),
    createdBy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAttributeGroupResponse",
}) as any as S.Schema<GetAttributeGroupResponse>;
export interface ListApplicationsResponse {
  applications?: ApplicationSummaries;
  nextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    applications: S.optional(ApplicationSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListAssociatedAttributeGroupsResponse {
  attributeGroups?: AttributeGroupIds;
  nextToken?: string;
}
export const ListAssociatedAttributeGroupsResponse = S.suspend(() =>
  S.Struct({
    attributeGroups: S.optional(AttributeGroupIds),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedAttributeGroupsResponse",
}) as any as S.Schema<ListAssociatedAttributeGroupsResponse>;
export interface ListAttributeGroupsResponse {
  attributeGroups?: AttributeGroupSummaries;
  nextToken?: string;
}
export const ListAttributeGroupsResponse = S.suspend(() =>
  S.Struct({
    attributeGroups: S.optional(AttributeGroupSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttributeGroupsResponse",
}) as any as S.Schema<ListAttributeGroupsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SyncResourceResponse {
  applicationArn?: string;
  resourceArn?: string;
  actionTaken?: string;
}
export const SyncResourceResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.optional(S.String),
    resourceArn: S.optional(S.String),
    actionTaken: S.optional(S.String),
  }),
).annotations({
  identifier: "SyncResourceResponse",
}) as any as S.Schema<SyncResourceResponse>;
export interface AttributeGroup {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  tags?: Tags;
}
export const AttributeGroup = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "AttributeGroup",
}) as any as S.Schema<AttributeGroup>;
export interface UpdateAttributeGroupResponse {
  attributeGroup?: AttributeGroup;
}
export const UpdateAttributeGroupResponse = S.suspend(() =>
  S.Struct({ attributeGroup: S.optional(AttributeGroup) }),
).annotations({
  identifier: "UpdateAttributeGroupResponse",
}) as any as S.Schema<UpdateAttributeGroupResponse>;
export type ApplicationTagDefinition = { [key: string]: string };
export const ApplicationTagDefinition = S.Record({
  key: S.String,
  value: S.String,
});
export interface AttributeGroupDetails {
  id?: string;
  arn?: string;
  name?: string;
  createdBy?: string;
}
export const AttributeGroupDetails = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    createdBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AttributeGroupDetails",
}) as any as S.Schema<AttributeGroupDetails>;
export type AttributeGroupDetailsList = AttributeGroupDetails[];
export const AttributeGroupDetailsList = S.Array(AttributeGroupDetails);
export interface Application {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  tags?: Tags;
  applicationTag?: ApplicationTagDefinition;
}
export const Application = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(Tags),
    applicationTag: S.optional(ApplicationTagDefinition),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export interface CreateApplicationResponse {
  application?: Application;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ application: S.optional(Application) }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateAttributeGroupResponse {
  attributeGroup?: AttributeGroup;
}
export const CreateAttributeGroupResponse = S.suspend(() =>
  S.Struct({ attributeGroup: S.optional(AttributeGroup) }),
).annotations({
  identifier: "CreateAttributeGroupResponse",
}) as any as S.Schema<CreateAttributeGroupResponse>;
export interface DeleteApplicationResponse {
  application?: ApplicationSummary;
}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({ application: S.optional(ApplicationSummary) }),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteAttributeGroupResponse {
  attributeGroup?: AttributeGroupSummary;
}
export const DeleteAttributeGroupResponse = S.suspend(() =>
  S.Struct({ attributeGroup: S.optional(AttributeGroupSummary) }),
).annotations({
  identifier: "DeleteAttributeGroupResponse",
}) as any as S.Schema<DeleteAttributeGroupResponse>;
export interface GetConfigurationResponse {
  configuration?: AppRegistryConfiguration;
}
export const GetConfigurationResponse = S.suspend(() =>
  S.Struct({ configuration: S.optional(AppRegistryConfiguration) }),
).annotations({
  identifier: "GetConfigurationResponse",
}) as any as S.Schema<GetConfigurationResponse>;
export interface ListAttributeGroupsForApplicationResponse {
  attributeGroupsDetails?: AttributeGroupDetailsList;
  nextToken?: string;
}
export const ListAttributeGroupsForApplicationResponse = S.suspend(() =>
  S.Struct({
    attributeGroupsDetails: S.optional(AttributeGroupDetailsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAttributeGroupsForApplicationResponse",
}) as any as S.Schema<ListAttributeGroupsForApplicationResponse>;
export interface UpdateApplicationResponse {
  application?: Application;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({ application: S.optional(Application) }),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface ResourceGroup {
  state?: string;
  arn?: string;
  errorMessage?: string;
}
export const ResourceGroup = S.suspend(() =>
  S.Struct({
    state: S.optional(S.String),
    arn: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceGroup",
}) as any as S.Schema<ResourceGroup>;
export interface ResourceIntegrations {
  resourceGroup?: ResourceGroup;
}
export const ResourceIntegrations = S.suspend(() =>
  S.Struct({ resourceGroup: S.optional(ResourceGroup) }),
).annotations({
  identifier: "ResourceIntegrations",
}) as any as S.Schema<ResourceIntegrations>;
export interface ResourcesListItem {
  resourceArn?: string;
  errorMessage?: string;
  status?: string;
  resourceType?: string;
}
export const ResourcesListItem = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    errorMessage: S.optional(S.String),
    status: S.optional(S.String),
    resourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourcesListItem",
}) as any as S.Schema<ResourcesListItem>;
export type ResourcesList = ResourcesListItem[];
export const ResourcesList = S.Array(ResourcesListItem);
export interface ResourceDetails {
  tagValue?: string;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({ tagValue: S.optional(S.String) }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface Integrations {
  resourceGroup?: ResourceGroup;
  applicationTagResourceGroup?: ResourceGroup;
}
export const Integrations = S.suspend(() =>
  S.Struct({
    resourceGroup: S.optional(ResourceGroup),
    applicationTagResourceGroup: S.optional(ResourceGroup),
  }),
).annotations({ identifier: "Integrations" }) as any as S.Schema<Integrations>;
export interface Resource {
  name?: string;
  arn?: string;
  associationTime?: Date;
  integrations?: ResourceIntegrations;
}
export const Resource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    associationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    integrations: S.optional(ResourceIntegrations),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export interface ApplicationTagResult {
  applicationTagStatus?: string;
  errorMessage?: string;
  resources?: ResourcesList;
  nextToken?: string;
}
export const ApplicationTagResult = S.suspend(() =>
  S.Struct({
    applicationTagStatus: S.optional(S.String),
    errorMessage: S.optional(S.String),
    resources: S.optional(ResourcesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationTagResult",
}) as any as S.Schema<ApplicationTagResult>;
export interface ResourceInfo {
  name?: string;
  arn?: string;
  resourceType?: string;
  resourceDetails?: ResourceDetails;
  options?: Options;
}
export const ResourceInfo = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    resourceType: S.optional(S.String),
    resourceDetails: S.optional(ResourceDetails),
    options: S.optional(Options),
  }),
).annotations({ identifier: "ResourceInfo" }) as any as S.Schema<ResourceInfo>;
export type Resources = ResourceInfo[];
export const Resources = S.Array(ResourceInfo);
export interface GetApplicationResponse {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  associatedResourceCount?: number;
  tags?: Tags;
  integrations?: Integrations;
  applicationTag?: ApplicationTagDefinition;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    associatedResourceCount: S.optional(S.Number),
    tags: S.optional(Tags),
    integrations: S.optional(Integrations),
    applicationTag: S.optional(ApplicationTagDefinition),
  }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface GetAssociatedResourceResponse {
  resource?: Resource;
  options?: Options;
  applicationTagResult?: ApplicationTagResult;
}
export const GetAssociatedResourceResponse = S.suspend(() =>
  S.Struct({
    resource: S.optional(Resource),
    options: S.optional(Options),
    applicationTagResult: S.optional(ApplicationTagResult),
  }),
).annotations({
  identifier: "GetAssociatedResourceResponse",
}) as any as S.Schema<GetAssociatedResourceResponse>;
export interface ListAssociatedResourcesResponse {
  resources?: Resources;
  nextToken?: string;
}
export const ListAssociatedResourcesResponse = S.suspend(() =>
  S.Struct({
    resources: S.optional(Resources),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedResourcesResponse",
}) as any as S.Schema<ListAssociatedResourcesResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String, serviceCode: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Retrieves a `TagKey` configuration
 * from an account.
 */
export const getConfiguration: (
  input: GetConfigurationRequest,
) => Effect.Effect<
  GetConfigurationResponse,
  InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationRequest,
  output: GetConfigurationResponse,
  errors: [InternalServerException],
}));
/**
 * Retrieves a list of all of your applications. Results are paginated.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): Effect.Effect<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ApplicationSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "applications",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing attribute group with new details.
 */
export const updateAttributeGroup: (
  input: UpdateAttributeGroupRequest,
) => Effect.Effect<
  UpdateAttributeGroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAttributeGroupRequest,
  output: UpdateAttributeGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves an attribute group
 * by its ARN, ID, or name.
 * The attribute group can be specified
 * by its ARN, ID, or name.
 */
export const getAttributeGroup: (
  input: GetAttributeGroupRequest,
) => Effect.Effect<
  GetAttributeGroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAttributeGroupRequest,
  output: GetAttributeGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 *
 * This operation returns an empty response if the call was successful.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Disassociates an attribute group from an application to remove the extra attributes contained in the attribute group from the application's metadata. This operation reverts `AssociateAttributeGroup`.
 */
export const disassociateAttributeGroup: (
  input: DisassociateAttributeGroupRequest,
) => Effect.Effect<
  DisassociateAttributeGroupResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAttributeGroupRequest,
  output: DisassociateAttributeGroupResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all attribute groups that are associated with specified application. Results are paginated.
 */
export const listAssociatedAttributeGroups: {
  (
    input: ListAssociatedAttributeGroupsRequest,
  ): Effect.Effect<
    ListAssociatedAttributeGroupsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedAttributeGroupsRequest,
  ) => Stream.Stream<
    ListAssociatedAttributeGroupsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedAttributeGroupsRequest,
  ) => Stream.Stream<
    AttributeGroupId,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedAttributeGroupsRequest,
  output: ListAssociatedAttributeGroupsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "attributeGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all of the tags on the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an application that is specified either by its application ID, name, or ARN. All associated attribute groups and resources must be disassociated from it before deleting an application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an attribute group, specified either by its attribute group ID, name, or ARN.
 */
export const deleteAttributeGroup: (
  input: DeleteAttributeGroupRequest,
) => Effect.Effect<
  DeleteAttributeGroupResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttributeGroupRequest,
  output: DeleteAttributeGroupResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the details of all attribute groups associated with a specific application. The results display in pages.
 */
export const listAttributeGroupsForApplication: {
  (
    input: ListAttributeGroupsForApplicationRequest,
  ): Effect.Effect<
    ListAttributeGroupsForApplicationResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttributeGroupsForApplicationRequest,
  ) => Stream.Stream<
    ListAttributeGroupsForApplicationResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttributeGroupsForApplicationRequest,
  ) => Stream.Stream<
    AttributeGroupDetails,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttributeGroupsForApplicationRequest,
  output: ListAttributeGroupsForApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "attributeGroupsDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all attribute groups which you have access to. Results are paginated.
 */
export const listAttributeGroups: {
  (
    input: ListAttributeGroupsRequest,
  ): Effect.Effect<
    ListAttributeGroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttributeGroupsRequest,
  ) => Stream.Stream<
    ListAttributeGroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttributeGroupsRequest,
  ) => Stream.Stream<
    AttributeGroupSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttributeGroupsRequest,
  output: ListAttributeGroupsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "attributeGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Associates a `TagKey` configuration
 * to an account.
 */
export const putConfiguration: (
  input: PutConfigurationRequest,
) => Effect.Effect<
  PutConfigurationResponse,
  | ConflictException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationRequest,
  output: PutConfigurationResponse,
  errors: [ConflictException, InternalServerException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified resource.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
 *
 * This operation returns an empty response if the call was successful.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves metadata information
 * about one
 * of your applications.
 * The application can be specified
 * by its ARN, ID, or name
 * (which is unique
 * within one account
 * in one region
 * at a given point
 * in time).
 * Specify
 * by ARN or ID
 * in automated workflows
 * if you want
 * to make sure
 * that the exact same application is returned or a `ResourceNotFoundException` is thrown,
 * avoiding the ABA addressing problem.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => Effect.Effect<
  GetApplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the resource associated with the application.
 */
export const getAssociatedResource: (
  input: GetAssociatedResourceRequest,
) => Effect.Effect<
  GetAssociatedResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssociatedResourceRequest,
  output: GetAssociatedResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all
 * of the resources
 * that are associated
 * with the specified application.
 * Results are paginated.
 *
 * If you share an application,
 * and a consumer account associates a tag query
 * to the application,
 * all of the users
 * who can access the application
 * can also view the tag values
 * in all accounts
 * that are associated
 * with it
 * using this API.
 */
export const listAssociatedResources: {
  (
    input: ListAssociatedResourcesRequest,
  ): Effect.Effect<
    ListAssociatedResourcesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedResourcesRequest,
  ) => Stream.Stream<
    ListAssociatedResourcesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedResourcesRequest,
  ) => Stream.Stream<
    ResourceInfo,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedResourcesRequest,
  output: ListAssociatedResourcesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing application with new attributes.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new attribute group as a container for user-defined attributes. This feature
 * enables users to have full control over their cloud application's metadata in a rich
 * machine-readable format to facilitate integration with automated workflows and third-party
 * tools.
 */
export const createAttributeGroup: (
  input: CreateAttributeGroupRequest,
) => Effect.Effect<
  CreateAttributeGroupResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAttributeGroupRequest,
  output: CreateAttributeGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Associates an attribute group with an application to augment the application's metadata
 * with the group's attributes. This feature enables applications to be described with
 * user-defined details that are machine-readable, such as third-party integrations.
 */
export const associateAttributeGroup: (
  input: AssociateAttributeGroupRequest,
) => Effect.Effect<
  AssociateAttributeGroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAttributeGroupRequest,
  output: AssociateAttributeGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Associates a resource with an application.
 * The resource can be specified by its ARN or name.
 * The application can be specified by ARN, ID, or name.
 *
 * **Minimum permissions**
 *
 * You must have the following permissions to associate a resource using the `OPTIONS` parameter set to `APPLY_APPLICATION_TAG`.
 *
 * - `tag:GetResources`
 *
 * - `tag:TagResources`
 *
 * You must also have these additional permissions if you don't use the `AWSServiceCatalogAppRegistryFullAccess` policy.
 * For more information, see AWSServiceCatalogAppRegistryFullAccess in the AppRegistry Administrator Guide.
 *
 * - `resource-groups:AssociateResource`
 *
 * - `cloudformation:UpdateStack`
 *
 * - `cloudformation:DescribeStacks`
 *
 * In addition, you must have the tagging permission defined by the Amazon Web Services service that creates the resource.
 * For more information, see TagResources in the *Resource Groups Tagging API Reference*.
 */
export const associateResource: (
  input: AssociateResourceRequest,
) => Effect.Effect<
  AssociateResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateResourceRequest,
  output: AssociateResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disassociates a resource from application.
 * Both the resource and the application can be specified either by ID or name.
 *
 * **Minimum permissions**
 *
 * You must have the following permissions to remove a resource that's been associated with an application using the `APPLY_APPLICATION_TAG` option for AssociateResource.
 *
 * - `tag:GetResources`
 *
 * - `tag:UntagResources`
 *
 * You must also have the following permissions if you don't use the `AWSServiceCatalogAppRegistryFullAccess` policy.
 * For more information, see AWSServiceCatalogAppRegistryFullAccess in the AppRegistry Administrator Guide.
 *
 * - `resource-groups:DisassociateResource`
 *
 * - `cloudformation:UpdateStack`
 *
 * - `cloudformation:DescribeStacks`
 *
 * In addition, you must have the tagging permission defined by the Amazon Web Services service that creates the resource.
 * For more information, see UntagResources in the *Resource Groups Tagging API Reference*.
 */
export const disassociateResource: (
  input: DisassociateResourceRequest,
) => Effect.Effect<
  DisassociateResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceRequest,
  output: DisassociateResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Syncs the resource with current AppRegistry records.
 *
 * Specifically, the resource’s AppRegistry system tags sync with its associated application. We remove the resource's AppRegistry system tags if it does not associate with the application. The caller must have permissions to read and update the resource.
 */
export const syncResource: (
  input: SyncResourceRequest,
) => Effect.Effect<
  SyncResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SyncResourceRequest,
  output: SyncResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new application that is the top-level node in a hierarchy of related cloud resource abstractions.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

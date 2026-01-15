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
  sdkId: "IoTThingsGraph",
  serviceShapeName: "IotThingsGraphFrontEndService",
});
const auth = T.AwsAuthSigv4({ name: "iotthingsgraph" });
const ver = T.ServiceVersion("2018-09-06");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://iotthingsgraph-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iotthingsgraph-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iotthingsgraph.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://iotthingsgraph.${Region}.amazonaws.com`);
        }
        return e(
          `https://iotthingsgraph.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ThingName = string;
export type Urn = string;
export type Version = number;
export type GroupName = string;
export type S3BucketName = string;
export type RoleArn = string;
export type Arn = string;
export type NamespaceName = string;
export type NextToken = string;
export type MaxResults = number;
export type UploadId = string;
export type FlowExecutionId = string;
export type ResourceArn = string;
export type TagKey = string;
export type SyncWithPublicNamespace = boolean;
export type DeprecateExistingEntities = boolean;
export type DefinitionText = string;
export type TagValue = string;
export type Enabled = boolean;
export type EntityFilterValue = string;
export type FlowTemplateFilterValue = string;
export type SystemInstanceFilterValue = string;
export type SystemTemplateFilterValue = string;
export type ErrorMessage = string;
export type GreengrassDeploymentId = string;
export type GreengrassGroupId = string;
export type GreengrassGroupVersionId = string;
export type FlowExecutionMessageId = string;
export type FlowExecutionMessagePayload = string;
export type ThingArn = string;

//# Schemas
export interface DeleteNamespaceRequest {}
export const DeleteNamespaceRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNamespaceRequest",
}) as any as S.Schema<DeleteNamespaceRequest>;
export interface GetNamespaceDeletionStatusRequest {}
export const GetNamespaceDeletionStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNamespaceDeletionStatusRequest",
}) as any as S.Schema<GetNamespaceDeletionStatusRequest>;
export type DeploymentTarget = "GREENGRASS" | "CLOUD" | (string & {});
export const DeploymentTarget = S.String;
export type EntityType =
  | "DEVICE"
  | "SERVICE"
  | "DEVICE_MODEL"
  | "CAPABILITY"
  | "STATE"
  | "ACTION"
  | "EVENT"
  | "PROPERTY"
  | "MAPPING"
  | "ENUM"
  | (string & {});
export const EntityType = S.String;
export type Urns = string[];
export const Urns = S.Array(S.String);
export type NamespaceDeletionStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const NamespaceDeletionStatus = S.String;
export type NamespaceDeletionStatusErrorCodes =
  | "VALIDATION_FAILED"
  | (string & {});
export const NamespaceDeletionStatusErrorCodes = S.String;
export type EntityTypes = EntityType[];
export const EntityTypes = S.Array(EntityType);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateEntityToThingRequest {
  thingName: string;
  entityId: string;
  namespaceVersion?: number;
}
export const AssociateEntityToThingRequest = S.suspend(() =>
  S.Struct({
    thingName: S.String,
    entityId: S.String,
    namespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateEntityToThingRequest",
}) as any as S.Schema<AssociateEntityToThingRequest>;
export interface AssociateEntityToThingResponse {}
export const AssociateEntityToThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateEntityToThingResponse",
}) as any as S.Schema<AssociateEntityToThingResponse>;
export type DefinitionLanguage = "GRAPHQL" | (string & {});
export const DefinitionLanguage = S.String;
export interface DefinitionDocument {
  language: DefinitionLanguage;
  text: string;
}
export const DefinitionDocument = S.suspend(() =>
  S.Struct({ language: DefinitionLanguage, text: S.String }),
).annotations({
  identifier: "DefinitionDocument",
}) as any as S.Schema<DefinitionDocument>;
export interface CreateSystemTemplateRequest {
  definition: DefinitionDocument;
  compatibleNamespaceVersion?: number;
}
export const CreateSystemTemplateRequest = S.suspend(() =>
  S.Struct({
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSystemTemplateRequest",
}) as any as S.Schema<CreateSystemTemplateRequest>;
export interface DeleteFlowTemplateRequest {
  id: string;
}
export const DeleteFlowTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFlowTemplateRequest",
}) as any as S.Schema<DeleteFlowTemplateRequest>;
export interface DeleteFlowTemplateResponse {}
export const DeleteFlowTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFlowTemplateResponse",
}) as any as S.Schema<DeleteFlowTemplateResponse>;
export interface DeleteNamespaceResponse {
  namespaceArn?: string;
  namespaceName?: string;
}
export const DeleteNamespaceResponse = S.suspend(() =>
  S.Struct({
    namespaceArn: S.optional(S.String),
    namespaceName: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteNamespaceResponse",
}) as any as S.Schema<DeleteNamespaceResponse>;
export interface DeleteSystemInstanceRequest {
  id?: string;
}
export const DeleteSystemInstanceRequest = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSystemInstanceRequest",
}) as any as S.Schema<DeleteSystemInstanceRequest>;
export interface DeleteSystemInstanceResponse {}
export const DeleteSystemInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSystemInstanceResponse",
}) as any as S.Schema<DeleteSystemInstanceResponse>;
export interface DeleteSystemTemplateRequest {
  id: string;
}
export const DeleteSystemTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSystemTemplateRequest",
}) as any as S.Schema<DeleteSystemTemplateRequest>;
export interface DeleteSystemTemplateResponse {}
export const DeleteSystemTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSystemTemplateResponse",
}) as any as S.Schema<DeleteSystemTemplateResponse>;
export interface DeploySystemInstanceRequest {
  id?: string;
}
export const DeploySystemInstanceRequest = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeploySystemInstanceRequest",
}) as any as S.Schema<DeploySystemInstanceRequest>;
export interface DeprecateFlowTemplateRequest {
  id: string;
}
export const DeprecateFlowTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeprecateFlowTemplateRequest",
}) as any as S.Schema<DeprecateFlowTemplateRequest>;
export interface DeprecateFlowTemplateResponse {}
export const DeprecateFlowTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeprecateFlowTemplateResponse",
}) as any as S.Schema<DeprecateFlowTemplateResponse>;
export interface DeprecateSystemTemplateRequest {
  id: string;
}
export const DeprecateSystemTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeprecateSystemTemplateRequest",
}) as any as S.Schema<DeprecateSystemTemplateRequest>;
export interface DeprecateSystemTemplateResponse {}
export const DeprecateSystemTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeprecateSystemTemplateResponse",
}) as any as S.Schema<DeprecateSystemTemplateResponse>;
export interface DescribeNamespaceRequest {
  namespaceName?: string;
}
export const DescribeNamespaceRequest = S.suspend(() =>
  S.Struct({ namespaceName: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeNamespaceRequest",
}) as any as S.Schema<DescribeNamespaceRequest>;
export interface DissociateEntityFromThingRequest {
  thingName: string;
  entityType: EntityType;
}
export const DissociateEntityFromThingRequest = S.suspend(() =>
  S.Struct({ thingName: S.String, entityType: EntityType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DissociateEntityFromThingRequest",
}) as any as S.Schema<DissociateEntityFromThingRequest>;
export interface DissociateEntityFromThingResponse {}
export const DissociateEntityFromThingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DissociateEntityFromThingResponse",
}) as any as S.Schema<DissociateEntityFromThingResponse>;
export interface GetEntitiesRequest {
  ids: string[];
  namespaceVersion?: number;
}
export const GetEntitiesRequest = S.suspend(() =>
  S.Struct({ ids: Urns, namespaceVersion: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEntitiesRequest",
}) as any as S.Schema<GetEntitiesRequest>;
export interface GetFlowTemplateRequest {
  id: string;
  revisionNumber?: number;
}
export const GetFlowTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String, revisionNumber: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFlowTemplateRequest",
}) as any as S.Schema<GetFlowTemplateRequest>;
export interface GetFlowTemplateRevisionsRequest {
  id: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetFlowTemplateRevisionsRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetFlowTemplateRevisionsRequest",
}) as any as S.Schema<GetFlowTemplateRevisionsRequest>;
export interface GetNamespaceDeletionStatusResponse {
  namespaceArn?: string;
  namespaceName?: string;
  status?: NamespaceDeletionStatus;
  errorCode?: NamespaceDeletionStatusErrorCodes;
  errorMessage?: string;
}
export const GetNamespaceDeletionStatusResponse = S.suspend(() =>
  S.Struct({
    namespaceArn: S.optional(S.String),
    namespaceName: S.optional(S.String),
    status: S.optional(NamespaceDeletionStatus),
    errorCode: S.optional(NamespaceDeletionStatusErrorCodes),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetNamespaceDeletionStatusResponse",
}) as any as S.Schema<GetNamespaceDeletionStatusResponse>;
export interface GetSystemInstanceRequest {
  id: string;
}
export const GetSystemInstanceRequest = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSystemInstanceRequest",
}) as any as S.Schema<GetSystemInstanceRequest>;
export interface GetSystemTemplateRequest {
  id: string;
  revisionNumber?: number;
}
export const GetSystemTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String, revisionNumber: S.optional(S.Number) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSystemTemplateRequest",
}) as any as S.Schema<GetSystemTemplateRequest>;
export interface GetSystemTemplateRevisionsRequest {
  id: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetSystemTemplateRevisionsRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSystemTemplateRevisionsRequest",
}) as any as S.Schema<GetSystemTemplateRevisionsRequest>;
export interface GetUploadStatusRequest {
  uploadId: string;
}
export const GetUploadStatusRequest = S.suspend(() =>
  S.Struct({ uploadId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUploadStatusRequest",
}) as any as S.Schema<GetUploadStatusRequest>;
export interface ListFlowExecutionMessagesRequest {
  flowExecutionId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFlowExecutionMessagesRequest = S.suspend(() =>
  S.Struct({
    flowExecutionId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFlowExecutionMessagesRequest",
}) as any as S.Schema<ListFlowExecutionMessagesRequest>;
export interface ListTagsForResourceRequest {
  maxResults?: number;
  resourceArn: string;
  nextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    resourceArn: S.String,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface SearchFlowExecutionsRequest {
  systemInstanceId: string;
  flowExecutionId?: string;
  startTime?: Date;
  endTime?: Date;
  nextToken?: string;
  maxResults?: number;
}
export const SearchFlowExecutionsRequest = S.suspend(() =>
  S.Struct({
    systemInstanceId: S.String,
    flowExecutionId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchFlowExecutionsRequest",
}) as any as S.Schema<SearchFlowExecutionsRequest>;
export interface SearchThingsRequest {
  entityId: string;
  nextToken?: string;
  maxResults?: number;
  namespaceVersion?: number;
}
export const SearchThingsRequest = S.suspend(() =>
  S.Struct({
    entityId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    namespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchThingsRequest",
}) as any as S.Schema<SearchThingsRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UndeploySystemInstanceRequest {
  id?: string;
}
export const UndeploySystemInstanceRequest = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UndeploySystemInstanceRequest",
}) as any as S.Schema<UndeploySystemInstanceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateFlowTemplateRequest {
  id: string;
  definition: DefinitionDocument;
  compatibleNamespaceVersion?: number;
}
export const UpdateFlowTemplateRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFlowTemplateRequest",
}) as any as S.Schema<UpdateFlowTemplateRequest>;
export interface UpdateSystemTemplateRequest {
  id: string;
  definition: DefinitionDocument;
  compatibleNamespaceVersion?: number;
}
export const UpdateSystemTemplateRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSystemTemplateRequest",
}) as any as S.Schema<UpdateSystemTemplateRequest>;
export interface UploadEntityDefinitionsRequest {
  document?: DefinitionDocument;
  syncWithPublicNamespace?: boolean;
  deprecateExistingEntities?: boolean;
}
export const UploadEntityDefinitionsRequest = S.suspend(() =>
  S.Struct({
    document: S.optional(DefinitionDocument),
    syncWithPublicNamespace: S.optional(S.Boolean),
    deprecateExistingEntities: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UploadEntityDefinitionsRequest",
}) as any as S.Schema<UploadEntityDefinitionsRequest>;
export type EntityFilterName =
  | "NAME"
  | "NAMESPACE"
  | "SEMANTIC_TYPE_PATH"
  | "REFERENCED_ENTITY_ID"
  | (string & {});
export const EntityFilterName = S.String;
export type EntityFilterValues = string[];
export const EntityFilterValues = S.Array(S.String);
export type FlowTemplateFilterName = "DEVICE_MODEL_ID" | (string & {});
export const FlowTemplateFilterName = S.String;
export type FlowTemplateFilterValues = string[];
export const FlowTemplateFilterValues = S.Array(S.String);
export type SystemInstanceFilterName =
  | "SYSTEM_TEMPLATE_ID"
  | "STATUS"
  | "GREENGRASS_GROUP_NAME"
  | (string & {});
export const SystemInstanceFilterName = S.String;
export type SystemInstanceFilterValues = string[];
export const SystemInstanceFilterValues = S.Array(S.String);
export type SystemTemplateFilterName = "FLOW_TEMPLATE_ID" | (string & {});
export const SystemTemplateFilterName = S.String;
export type SystemTemplateFilterValues = string[];
export const SystemTemplateFilterValues = S.Array(S.String);
export interface MetricsConfiguration {
  cloudMetricEnabled?: boolean;
  metricRuleRoleArn?: string;
}
export const MetricsConfiguration = S.suspend(() =>
  S.Struct({
    cloudMetricEnabled: S.optional(S.Boolean),
    metricRuleRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricsConfiguration",
}) as any as S.Schema<MetricsConfiguration>;
export interface SystemTemplateSummary {
  id?: string;
  arn?: string;
  revisionNumber?: number;
  createdAt?: Date;
}
export const SystemTemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    revisionNumber: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SystemTemplateSummary",
}) as any as S.Schema<SystemTemplateSummary>;
export type SystemTemplateSummaries = SystemTemplateSummary[];
export const SystemTemplateSummaries = S.Array(SystemTemplateSummary);
export type UploadStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const UploadStatus = S.String;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface EntityFilter {
  name?: EntityFilterName;
  value?: string[];
}
export const EntityFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(EntityFilterName),
    value: S.optional(EntityFilterValues),
  }),
).annotations({ identifier: "EntityFilter" }) as any as S.Schema<EntityFilter>;
export type EntityFilters = EntityFilter[];
export const EntityFilters = S.Array(EntityFilter);
export interface FlowTemplateFilter {
  name: FlowTemplateFilterName;
  value: string[];
}
export const FlowTemplateFilter = S.suspend(() =>
  S.Struct({ name: FlowTemplateFilterName, value: FlowTemplateFilterValues }),
).annotations({
  identifier: "FlowTemplateFilter",
}) as any as S.Schema<FlowTemplateFilter>;
export type FlowTemplateFilters = FlowTemplateFilter[];
export const FlowTemplateFilters = S.Array(FlowTemplateFilter);
export interface SystemInstanceFilter {
  name?: SystemInstanceFilterName;
  value?: string[];
}
export const SystemInstanceFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(SystemInstanceFilterName),
    value: S.optional(SystemInstanceFilterValues),
  }),
).annotations({
  identifier: "SystemInstanceFilter",
}) as any as S.Schema<SystemInstanceFilter>;
export type SystemInstanceFilters = SystemInstanceFilter[];
export const SystemInstanceFilters = S.Array(SystemInstanceFilter);
export interface SystemTemplateFilter {
  name: SystemTemplateFilterName;
  value: string[];
}
export const SystemTemplateFilter = S.suspend(() =>
  S.Struct({
    name: SystemTemplateFilterName,
    value: SystemTemplateFilterValues,
  }),
).annotations({
  identifier: "SystemTemplateFilter",
}) as any as S.Schema<SystemTemplateFilter>;
export type SystemTemplateFilters = SystemTemplateFilter[];
export const SystemTemplateFilters = S.Array(SystemTemplateFilter);
export interface CreateFlowTemplateRequest {
  definition: DefinitionDocument;
  compatibleNamespaceVersion?: number;
}
export const CreateFlowTemplateRequest = S.suspend(() =>
  S.Struct({
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFlowTemplateRequest",
}) as any as S.Schema<CreateFlowTemplateRequest>;
export interface CreateSystemInstanceRequest {
  tags?: Tag[];
  definition: DefinitionDocument;
  target: DeploymentTarget;
  greengrassGroupName?: string;
  s3BucketName?: string;
  metricsConfiguration?: MetricsConfiguration;
  flowActionsRoleArn?: string;
}
export const CreateSystemInstanceRequest = S.suspend(() =>
  S.Struct({
    tags: S.optional(TagList),
    definition: DefinitionDocument,
    target: DeploymentTarget,
    greengrassGroupName: S.optional(S.String),
    s3BucketName: S.optional(S.String),
    metricsConfiguration: S.optional(MetricsConfiguration),
    flowActionsRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSystemInstanceRequest",
}) as any as S.Schema<CreateSystemInstanceRequest>;
export interface DescribeNamespaceResponse {
  namespaceArn?: string;
  namespaceName?: string;
  trackingNamespaceName?: string;
  trackingNamespaceVersion?: number;
  namespaceVersion?: number;
}
export const DescribeNamespaceResponse = S.suspend(() =>
  S.Struct({
    namespaceArn: S.optional(S.String),
    namespaceName: S.optional(S.String),
    trackingNamespaceName: S.optional(S.String),
    trackingNamespaceVersion: S.optional(S.Number),
    namespaceVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeNamespaceResponse",
}) as any as S.Schema<DescribeNamespaceResponse>;
export interface GetSystemTemplateRevisionsResponse {
  summaries?: SystemTemplateSummary[];
  nextToken?: string;
}
export const GetSystemTemplateRevisionsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(SystemTemplateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSystemTemplateRevisionsResponse",
}) as any as S.Schema<GetSystemTemplateRevisionsResponse>;
export interface GetUploadStatusResponse {
  uploadId: string;
  uploadStatus: UploadStatus;
  namespaceArn?: string;
  namespaceName?: string;
  namespaceVersion?: number;
  failureReason?: string[];
  createdDate: Date;
}
export const GetUploadStatusResponse = S.suspend(() =>
  S.Struct({
    uploadId: S.String,
    uploadStatus: UploadStatus,
    namespaceArn: S.optional(S.String),
    namespaceName: S.optional(S.String),
    namespaceVersion: S.optional(S.Number),
    failureReason: S.optional(StringList),
    createdDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetUploadStatusResponse",
}) as any as S.Schema<GetUploadStatusResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
  nextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface SearchEntitiesRequest {
  entityTypes: EntityType[];
  filters?: EntityFilter[];
  nextToken?: string;
  maxResults?: number;
  namespaceVersion?: number;
}
export const SearchEntitiesRequest = S.suspend(() =>
  S.Struct({
    entityTypes: EntityTypes,
    filters: S.optional(EntityFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    namespaceVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchEntitiesRequest",
}) as any as S.Schema<SearchEntitiesRequest>;
export interface SearchFlowTemplatesRequest {
  filters?: FlowTemplateFilter[];
  nextToken?: string;
  maxResults?: number;
}
export const SearchFlowTemplatesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(FlowTemplateFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchFlowTemplatesRequest",
}) as any as S.Schema<SearchFlowTemplatesRequest>;
export interface SearchSystemInstancesRequest {
  filters?: SystemInstanceFilter[];
  nextToken?: string;
  maxResults?: number;
}
export const SearchSystemInstancesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(SystemInstanceFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchSystemInstancesRequest",
}) as any as S.Schema<SearchSystemInstancesRequest>;
export interface SearchSystemTemplatesRequest {
  filters?: SystemTemplateFilter[];
  nextToken?: string;
  maxResults?: number;
}
export const SearchSystemTemplatesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(SystemTemplateFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchSystemTemplatesRequest",
}) as any as S.Schema<SearchSystemTemplatesRequest>;
export type SystemInstanceDeploymentStatus =
  | "NOT_DEPLOYED"
  | "BOOTSTRAP"
  | "DEPLOY_IN_PROGRESS"
  | "DEPLOYED_IN_TARGET"
  | "UNDEPLOY_IN_PROGRESS"
  | "FAILED"
  | "PENDING_DELETE"
  | "DELETED_IN_TARGET"
  | (string & {});
export const SystemInstanceDeploymentStatus = S.String;
export interface SystemInstanceSummary {
  id?: string;
  arn?: string;
  status?: SystemInstanceDeploymentStatus;
  target?: DeploymentTarget;
  greengrassGroupName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  greengrassGroupId?: string;
  greengrassGroupVersionId?: string;
}
export const SystemInstanceSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(SystemInstanceDeploymentStatus),
    target: S.optional(DeploymentTarget),
    greengrassGroupName: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    greengrassGroupId: S.optional(S.String),
    greengrassGroupVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "SystemInstanceSummary",
}) as any as S.Schema<SystemInstanceSummary>;
export interface UndeploySystemInstanceResponse {
  summary?: SystemInstanceSummary;
}
export const UndeploySystemInstanceResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(SystemInstanceSummary) }),
).annotations({
  identifier: "UndeploySystemInstanceResponse",
}) as any as S.Schema<UndeploySystemInstanceResponse>;
export interface FlowTemplateSummary {
  id?: string;
  arn?: string;
  revisionNumber?: number;
  createdAt?: Date;
}
export const FlowTemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    revisionNumber: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "FlowTemplateSummary",
}) as any as S.Schema<FlowTemplateSummary>;
export interface UpdateFlowTemplateResponse {
  summary?: FlowTemplateSummary;
}
export const UpdateFlowTemplateResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(FlowTemplateSummary) }),
).annotations({
  identifier: "UpdateFlowTemplateResponse",
}) as any as S.Schema<UpdateFlowTemplateResponse>;
export interface UpdateSystemTemplateResponse {
  summary?: SystemTemplateSummary;
}
export const UpdateSystemTemplateResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(SystemTemplateSummary) }),
).annotations({
  identifier: "UpdateSystemTemplateResponse",
}) as any as S.Schema<UpdateSystemTemplateResponse>;
export interface UploadEntityDefinitionsResponse {
  uploadId: string;
}
export const UploadEntityDefinitionsResponse = S.suspend(() =>
  S.Struct({ uploadId: S.String }),
).annotations({
  identifier: "UploadEntityDefinitionsResponse",
}) as any as S.Schema<UploadEntityDefinitionsResponse>;
export type FlowExecutionEventType =
  | "EXECUTION_STARTED"
  | "EXECUTION_FAILED"
  | "EXECUTION_ABORTED"
  | "EXECUTION_SUCCEEDED"
  | "STEP_STARTED"
  | "STEP_FAILED"
  | "STEP_SUCCEEDED"
  | "ACTIVITY_SCHEDULED"
  | "ACTIVITY_STARTED"
  | "ACTIVITY_FAILED"
  | "ACTIVITY_SUCCEEDED"
  | "START_FLOW_EXECUTION_TASK"
  | "SCHEDULE_NEXT_READY_STEPS_TASK"
  | "THING_ACTION_TASK"
  | "THING_ACTION_TASK_FAILED"
  | "THING_ACTION_TASK_SUCCEEDED"
  | "ACKNOWLEDGE_TASK_MESSAGE"
  | (string & {});
export const FlowExecutionEventType = S.String;
export type FlowExecutionStatus =
  | "RUNNING"
  | "ABORTED"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const FlowExecutionStatus = S.String;
export interface EntityDescription {
  id?: string;
  arn?: string;
  type?: EntityType;
  createdAt?: Date;
  definition?: DefinitionDocument;
}
export const EntityDescription = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    type: S.optional(EntityType),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    definition: S.optional(DefinitionDocument),
  }),
).annotations({
  identifier: "EntityDescription",
}) as any as S.Schema<EntityDescription>;
export type EntityDescriptions = EntityDescription[];
export const EntityDescriptions = S.Array(EntityDescription);
export interface FlowTemplateDescription {
  summary?: FlowTemplateSummary;
  definition?: DefinitionDocument;
  validatedNamespaceVersion?: number;
}
export const FlowTemplateDescription = S.suspend(() =>
  S.Struct({
    summary: S.optional(FlowTemplateSummary),
    definition: S.optional(DefinitionDocument),
    validatedNamespaceVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "FlowTemplateDescription",
}) as any as S.Schema<FlowTemplateDescription>;
export type FlowTemplateSummaries = FlowTemplateSummary[];
export const FlowTemplateSummaries = S.Array(FlowTemplateSummary);
export interface SystemTemplateDescription {
  summary?: SystemTemplateSummary;
  definition?: DefinitionDocument;
  validatedNamespaceVersion?: number;
}
export const SystemTemplateDescription = S.suspend(() =>
  S.Struct({
    summary: S.optional(SystemTemplateSummary),
    definition: S.optional(DefinitionDocument),
    validatedNamespaceVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "SystemTemplateDescription",
}) as any as S.Schema<SystemTemplateDescription>;
export interface FlowExecutionMessage {
  messageId?: string;
  eventType?: FlowExecutionEventType;
  timestamp?: Date;
  payload?: string;
}
export const FlowExecutionMessage = S.suspend(() =>
  S.Struct({
    messageId: S.optional(S.String),
    eventType: S.optional(FlowExecutionEventType),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    payload: S.optional(S.String),
  }),
).annotations({
  identifier: "FlowExecutionMessage",
}) as any as S.Schema<FlowExecutionMessage>;
export type FlowExecutionMessages = FlowExecutionMessage[];
export const FlowExecutionMessages = S.Array(FlowExecutionMessage);
export interface FlowExecutionSummary {
  flowExecutionId?: string;
  status?: FlowExecutionStatus;
  systemInstanceId?: string;
  flowTemplateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const FlowExecutionSummary = S.suspend(() =>
  S.Struct({
    flowExecutionId: S.optional(S.String),
    status: S.optional(FlowExecutionStatus),
    systemInstanceId: S.optional(S.String),
    flowTemplateId: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "FlowExecutionSummary",
}) as any as S.Schema<FlowExecutionSummary>;
export type FlowExecutionSummaries = FlowExecutionSummary[];
export const FlowExecutionSummaries = S.Array(FlowExecutionSummary);
export type SystemInstanceSummaries = SystemInstanceSummary[];
export const SystemInstanceSummaries = S.Array(SystemInstanceSummary);
export interface Thing {
  thingArn?: string;
  thingName?: string;
}
export const Thing = S.suspend(() =>
  S.Struct({ thingArn: S.optional(S.String), thingName: S.optional(S.String) }),
).annotations({ identifier: "Thing" }) as any as S.Schema<Thing>;
export type Things = Thing[];
export const Things = S.Array(Thing);
export interface CreateFlowTemplateResponse {
  summary?: FlowTemplateSummary;
}
export const CreateFlowTemplateResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(FlowTemplateSummary) }),
).annotations({
  identifier: "CreateFlowTemplateResponse",
}) as any as S.Schema<CreateFlowTemplateResponse>;
export interface CreateSystemInstanceResponse {
  summary?: SystemInstanceSummary;
}
export const CreateSystemInstanceResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(SystemInstanceSummary) }),
).annotations({
  identifier: "CreateSystemInstanceResponse",
}) as any as S.Schema<CreateSystemInstanceResponse>;
export interface CreateSystemTemplateResponse {
  summary?: SystemTemplateSummary;
}
export const CreateSystemTemplateResponse = S.suspend(() =>
  S.Struct({ summary: S.optional(SystemTemplateSummary) }),
).annotations({
  identifier: "CreateSystemTemplateResponse",
}) as any as S.Schema<CreateSystemTemplateResponse>;
export interface DeploySystemInstanceResponse {
  summary: SystemInstanceSummary;
  greengrassDeploymentId?: string;
}
export const DeploySystemInstanceResponse = S.suspend(() =>
  S.Struct({
    summary: SystemInstanceSummary,
    greengrassDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploySystemInstanceResponse",
}) as any as S.Schema<DeploySystemInstanceResponse>;
export interface GetEntitiesResponse {
  descriptions?: EntityDescription[];
}
export const GetEntitiesResponse = S.suspend(() =>
  S.Struct({ descriptions: S.optional(EntityDescriptions) }),
).annotations({
  identifier: "GetEntitiesResponse",
}) as any as S.Schema<GetEntitiesResponse>;
export interface GetFlowTemplateResponse {
  description?: FlowTemplateDescription;
}
export const GetFlowTemplateResponse = S.suspend(() =>
  S.Struct({ description: S.optional(FlowTemplateDescription) }),
).annotations({
  identifier: "GetFlowTemplateResponse",
}) as any as S.Schema<GetFlowTemplateResponse>;
export interface GetFlowTemplateRevisionsResponse {
  summaries?: FlowTemplateSummary[];
  nextToken?: string;
}
export const GetFlowTemplateRevisionsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(FlowTemplateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFlowTemplateRevisionsResponse",
}) as any as S.Schema<GetFlowTemplateRevisionsResponse>;
export interface GetSystemTemplateResponse {
  description?: SystemTemplateDescription;
}
export const GetSystemTemplateResponse = S.suspend(() =>
  S.Struct({ description: S.optional(SystemTemplateDescription) }),
).annotations({
  identifier: "GetSystemTemplateResponse",
}) as any as S.Schema<GetSystemTemplateResponse>;
export interface ListFlowExecutionMessagesResponse {
  messages?: FlowExecutionMessage[];
  nextToken?: string;
}
export const ListFlowExecutionMessagesResponse = S.suspend(() =>
  S.Struct({
    messages: S.optional(FlowExecutionMessages),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFlowExecutionMessagesResponse",
}) as any as S.Schema<ListFlowExecutionMessagesResponse>;
export interface SearchEntitiesResponse {
  descriptions?: EntityDescription[];
  nextToken?: string;
}
export const SearchEntitiesResponse = S.suspend(() =>
  S.Struct({
    descriptions: S.optional(EntityDescriptions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchEntitiesResponse",
}) as any as S.Schema<SearchEntitiesResponse>;
export interface SearchFlowExecutionsResponse {
  summaries?: FlowExecutionSummary[];
  nextToken?: string;
}
export const SearchFlowExecutionsResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(FlowExecutionSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchFlowExecutionsResponse",
}) as any as S.Schema<SearchFlowExecutionsResponse>;
export interface SearchFlowTemplatesResponse {
  summaries?: FlowTemplateSummary[];
  nextToken?: string;
}
export const SearchFlowTemplatesResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(FlowTemplateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchFlowTemplatesResponse",
}) as any as S.Schema<SearchFlowTemplatesResponse>;
export interface SearchSystemInstancesResponse {
  summaries?: SystemInstanceSummary[];
  nextToken?: string;
}
export const SearchSystemInstancesResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(SystemInstanceSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSystemInstancesResponse",
}) as any as S.Schema<SearchSystemInstancesResponse>;
export interface SearchSystemTemplatesResponse {
  summaries?: SystemTemplateSummary[];
  nextToken?: string;
}
export const SearchSystemTemplatesResponse = S.suspend(() =>
  S.Struct({
    summaries: S.optional(SystemTemplateSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSystemTemplatesResponse",
}) as any as S.Schema<SearchSystemTemplatesResponse>;
export interface SearchThingsResponse {
  things?: Thing[];
  nextToken?: string;
}
export const SearchThingsResponse = S.suspend(() =>
  S.Struct({ things: S.optional(Things), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "SearchThingsResponse",
}) as any as S.Schema<SearchThingsResponse>;
export interface DependencyRevision {
  id?: string;
  revisionNumber?: number;
}
export const DependencyRevision = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), revisionNumber: S.optional(S.Number) }),
).annotations({
  identifier: "DependencyRevision",
}) as any as S.Schema<DependencyRevision>;
export type DependencyRevisions = DependencyRevision[];
export const DependencyRevisions = S.Array(DependencyRevision);
export interface SystemInstanceDescription {
  summary?: SystemInstanceSummary;
  definition?: DefinitionDocument;
  s3BucketName?: string;
  metricsConfiguration?: MetricsConfiguration;
  validatedNamespaceVersion?: number;
  validatedDependencyRevisions?: DependencyRevision[];
  flowActionsRoleArn?: string;
}
export const SystemInstanceDescription = S.suspend(() =>
  S.Struct({
    summary: S.optional(SystemInstanceSummary),
    definition: S.optional(DefinitionDocument),
    s3BucketName: S.optional(S.String),
    metricsConfiguration: S.optional(MetricsConfiguration),
    validatedNamespaceVersion: S.optional(S.Number),
    validatedDependencyRevisions: S.optional(DependencyRevisions),
    flowActionsRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SystemInstanceDescription",
}) as any as S.Schema<SystemInstanceDescription>;
export interface GetSystemInstanceResponse {
  description?: SystemInstanceDescription;
}
export const GetSystemInstanceResponse = S.suspend(() =>
  S.Struct({ description: S.optional(SystemInstanceDescription) }),
).annotations({
  identifier: "GetSystemInstanceResponse",
}) as any as S.Schema<GetSystemInstanceResponse>;

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified namespace. This action deletes all of the entities in the namespace. Delete the systems and flows that use entities in the namespace before performing this action. This action takes no
 * request parameters.
 */
export const deleteNamespace: (
  input: DeleteNamespaceRequest,
) => effect.Effect<
  DeleteNamespaceResponse,
  InternalFailureException | ThrottlingException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [InternalFailureException, ThrottlingException],
}));
/**
 * Asynchronously uploads one or more entity definitions to the user's namespace. The `document` parameter is required if
 * `syncWithPublicNamespace` and `deleteExistingEntites` are false. If the `syncWithPublicNamespace` parameter is set to
 * `true`, the user's namespace will synchronize with the latest version of the public namespace. If `deprecateExistingEntities` is set to true,
 * all entities in the latest version will be deleted before the new `DefinitionDocument` is uploaded.
 *
 * When a user uploads entity definitions for the first time, the service creates a new namespace for the user. The new namespace tracks the public namespace. Currently users
 * can have only one namespace. The namespace version increments whenever a user uploads entity definitions that are backwards-incompatible and whenever a user sets the
 * `syncWithPublicNamespace` parameter or the `deprecateExistingEntities` parameter to `true`.
 *
 * The IDs for all of the entities should be in URN format. Each entity must be in the user's namespace. Users can't create entities in the public namespace, but entity definitions can refer to entities in the public namespace.
 *
 * Valid entities are `Device`, `DeviceModel`, `Service`, `Capability`, `State`, `Action`, `Event`, `Property`,
 * `Mapping`, `Enum`.
 */
export const uploadEntityDefinitions: (
  input: UploadEntityDefinitionsRequest,
) => effect.Effect<
  UploadEntityDefinitionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadEntityDefinitionsRequest,
  output: UploadEntityDefinitionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Gets the status of a namespace deletion task.
 */
export const getNamespaceDeletionStatus: (
  input: GetNamespaceDeletionStatusRequest,
) => effect.Effect<
  GetNamespaceDeletionStatusResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamespaceDeletionStatusRequest,
  output: GetNamespaceDeletionStatusResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Searches for entities of the specified type. You can search for entities in your namespace and the public namespace that you're tracking.
 */
export const searchEntities: {
  (
    input: SearchEntitiesRequest,
  ): effect.Effect<
    SearchEntitiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchEntitiesRequest,
  ) => stream.Stream<
    SearchEntitiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchEntitiesRequest,
  ) => stream.Stream<
    EntityDescription,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchEntitiesRequest,
  output: SearchEntitiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "descriptions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for summary information about workflows.
 */
export const searchFlowTemplates: {
  (
    input: SearchFlowTemplatesRequest,
  ): effect.Effect<
    SearchFlowTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchFlowTemplatesRequest,
  ) => stream.Stream<
    SearchFlowTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchFlowTemplatesRequest,
  ) => stream.Stream<
    FlowTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchFlowTemplatesRequest,
  output: SearchFlowTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for system instances in the user's account.
 */
export const searchSystemInstances: {
  (
    input: SearchSystemInstancesRequest,
  ): effect.Effect<
    SearchSystemInstancesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSystemInstancesRequest,
  ) => stream.Stream<
    SearchSystemInstancesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSystemInstancesRequest,
  ) => stream.Stream<
    SystemInstanceSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSystemInstancesRequest,
  output: SearchSystemInstancesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for summary information about systems in the user's account. You can filter by the ID of a workflow to return only systems that use the specified workflow.
 */
export const searchSystemTemplates: {
  (
    input: SearchSystemTemplatesRequest,
  ): effect.Effect<
    SearchSystemTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSystemTemplatesRequest,
  ) => stream.Stream<
    SearchSystemTemplatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSystemTemplatesRequest,
  ) => stream.Stream<
    SystemTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSystemTemplatesRequest,
  output: SearchSystemTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Associates a device with a concrete thing that is in the user's registry.
 *
 * A thing can be associated with only one device at a time. If you associate a thing with a new device id, its previous association will be removed.
 */
export const associateEntityToThing: (
  input: AssociateEntityToThingRequest,
) => effect.Effect<
  AssociateEntityToThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEntityToThingRequest,
  output: AssociateEntityToThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a system. The system is validated against the entities in the
 * latest version of the user's namespace unless another namespace version is specified in the request.
 */
export const createSystemTemplate: (
  input: CreateSystemTemplateRequest,
) => effect.Effect<
  CreateSystemTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSystemTemplateRequest,
  output: CreateSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * **Greengrass and Cloud Deployments**
 *
 * Deploys the system instance to the target specified in `CreateSystemInstance`.
 *
 * **Greengrass Deployments**
 *
 * If the system or any workflows and entities have been updated before this action is called, then the deployment will create a new Amazon Simple Storage Service
 * resource file and then deploy it.
 *
 * Since this action creates a Greengrass deployment on the caller's behalf, the calling identity must have write permissions
 * to the specified Greengrass group. Otherwise, the call will fail with an authorization error.
 *
 * For information about the artifacts that get added to your Greengrass core device when you use this API, see AWS IoT Things Graph and AWS IoT Greengrass.
 */
export const deploySystemInstance: (
  input: DeploySystemInstanceRequest,
) => effect.Effect<
  DeploySystemInstanceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeploySystemInstanceRequest,
  output: DeploySystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets a system instance.
 */
export const getSystemInstance: (
  input: GetSystemInstanceRequest,
) => effect.Effect<
  GetSystemInstanceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSystemInstanceRequest,
  output: GetSystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets definitions of the specified entities. Uses the latest version of the user's namespace by default. This API returns the
 * following TDM entities.
 *
 * - Properties
 *
 * - States
 *
 * - Events
 *
 * - Actions
 *
 * - Capabilities
 *
 * - Mappings
 *
 * - Devices
 *
 * - Device Models
 *
 * - Services
 *
 * This action doesn't return definitions for systems, flows, and deployments.
 */
export const getEntities: (
  input: GetEntitiesRequest,
) => effect.Effect<
  GetEntitiesResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEntitiesRequest,
  output: GetEntitiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the latest version of the `DefinitionDocument` and `FlowTemplateSummary` for the specified workflow.
 */
export const getFlowTemplate: (
  input: GetFlowTemplateRequest,
) => effect.Effect<
  GetFlowTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowTemplateRequest,
  output: GetFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets revisions of the specified workflow. Only the last 100 revisions are stored. If the workflow has been deprecated,
 * this action will return revisions that occurred before the deprecation. This action won't work for workflows that have been deleted.
 */
export const getFlowTemplateRevisions: {
  (
    input: GetFlowTemplateRevisionsRequest,
  ): effect.Effect<
    GetFlowTemplateRevisionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFlowTemplateRevisionsRequest,
  ) => stream.Stream<
    GetFlowTemplateRevisionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFlowTemplateRevisionsRequest,
  ) => stream.Stream<
    FlowTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFlowTemplateRevisionsRequest,
  output: GetFlowTemplateRevisionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a system.
 */
export const getSystemTemplate: (
  input: GetSystemTemplateRequest,
) => effect.Effect<
  GetSystemTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSystemTemplateRequest,
  output: GetSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of objects that contain information about events in a flow execution.
 */
export const listFlowExecutionMessages: {
  (
    input: ListFlowExecutionMessagesRequest,
  ): effect.Effect<
    ListFlowExecutionMessagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowExecutionMessagesRequest,
  ) => stream.Stream<
    ListFlowExecutionMessagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowExecutionMessagesRequest,
  ) => stream.Stream<
    FlowExecutionMessage,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowExecutionMessagesRequest,
  output: ListFlowExecutionMessagesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "messages",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for AWS IoT Things Graph workflow execution instances.
 */
export const searchFlowExecutions: {
  (
    input: SearchFlowExecutionsRequest,
  ): effect.Effect<
    SearchFlowExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchFlowExecutionsRequest,
  ) => stream.Stream<
    SearchFlowExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchFlowExecutionsRequest,
  ) => stream.Stream<
    FlowExecutionSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchFlowExecutionsRequest,
  output: SearchFlowExecutionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for things associated with the specified entity. You can search by both device and device model.
 *
 * For example, if two different devices, camera1 and camera2, implement the camera device model, the user can associate thing1 to camera1 and thing2 to camera2.
 * `SearchThings(camera2)` will return only thing2, but `SearchThings(camera)` will return both thing1 and thing2.
 *
 * This action searches for exact matches and doesn't perform partial text matching.
 */
export const searchThings: {
  (
    input: SearchThingsRequest,
  ): effect.Effect<
    SearchThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchThingsRequest,
  ) => stream.Stream<
    SearchThingsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchThingsRequest,
  ) => stream.Stream<
    Thing,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchThingsRequest,
  output: SearchThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "things",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the latest version of the user's namespace and the public version that it is tracking.
 */
export const describeNamespace: (
  input: DescribeNamespaceRequest,
) => effect.Effect<
  DescribeNamespaceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNamespaceRequest,
  output: DescribeNamespaceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets revisions made to the specified system template. Only the previous 100 revisions are stored. If the system has been deprecated, this action will return
 * the revisions that occurred before its deprecation. This action won't work with systems that have been deleted.
 */
export const getSystemTemplateRevisions: {
  (
    input: GetSystemTemplateRevisionsRequest,
  ): effect.Effect<
    GetSystemTemplateRevisionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSystemTemplateRevisionsRequest,
  ) => stream.Stream<
    GetSystemTemplateRevisionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSystemTemplateRevisionsRequest,
  ) => stream.Stream<
    SystemTemplateSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSystemTemplateRevisionsRequest,
  output: GetSystemTemplateRevisionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "summaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the status of the specified upload.
 */
export const getUploadStatus: (
  input: GetUploadStatusRequest,
) => effect.Effect<
  GetUploadStatusResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadStatusRequest,
  output: GetUploadStatusResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified workflow. All deployed systems and system instances that use the workflow will see the changes in the flow when it is redeployed. If you don't want this
 * behavior, copy the workflow (creating a new workflow with a different ID), and update the copy. The workflow can contain only entities in the specified namespace.
 */
export const updateFlowTemplate: (
  input: UpdateFlowTemplateRequest,
) => effect.Effect<
  UpdateFlowTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowTemplateRequest,
  output: UpdateFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified system. You don't need to run this action after updating a workflow. Any deployment that uses the system will see the changes in the system when it is redeployed.
 */
export const updateSystemTemplate: (
  input: UpdateSystemTemplateRequest,
) => effect.Effect<
  UpdateSystemTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSystemTemplateRequest,
  output: UpdateSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deprecates the specified workflow. This action marks the workflow for deletion. Deprecated flows can't be deployed, but existing deployments will continue to run.
 */
export const deprecateFlowTemplate: (
  input: DeprecateFlowTemplateRequest,
) => effect.Effect<
  DeprecateFlowTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateFlowTemplateRequest,
  output: DeprecateFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deprecates the specified system.
 */
export const deprecateSystemTemplate: (
  input: DeprecateSystemTemplateRequest,
) => effect.Effect<
  DeprecateSystemTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeprecateSystemTemplateRequest,
  output: DeprecateSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Dissociates a device entity from a concrete thing. The action takes only the type of the entity that you need to dissociate because only
 * one entity of a particular type can be associated with a thing.
 */
export const dissociateEntityFromThing: (
  input: DissociateEntityFromThingRequest,
) => effect.Effect<
  DissociateEntityFromThingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DissociateEntityFromThingRequest,
  output: DissociateEntityFromThingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a system instance.
 *
 * This action validates the system instance, prepares the deployment-related resources. For Greengrass deployments, it updates the Greengrass group that is
 * specified by the `greengrassGroupName` parameter. It also adds a file to the S3 bucket specified by the `s3BucketName` parameter. You need to
 * call `DeploySystemInstance` after running this action.
 *
 * For Greengrass deployments, since this action modifies and adds resources to a Greengrass group and an S3 bucket on the caller's behalf, the calling identity must have write permissions
 * to both the specified Greengrass group and S3 bucket. Otherwise, the call will fail with an authorization error.
 *
 * For cloud deployments, this action requires a `flowActionsRoleArn` value. This is an IAM role
 * that has permissions to access AWS services, such as AWS Lambda and AWS IoT, that the flow uses when it executes.
 *
 * If the definition document doesn't specify a version of the user's namespace, the latest version will be used by default.
 */
export const createSystemInstance: (
  input: CreateSystemInstanceRequest,
) => effect.Effect<
  CreateSystemInstanceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSystemInstanceRequest,
  output: CreateSystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Lists all tags on an AWS IoT Things Graph resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceAlreadyExistsException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceAlreadyExistsException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    Tag,
    | InternalFailureException
    | InvalidRequestException
    | ResourceAlreadyExistsException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tags",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a tag for the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Removes a tag from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a workflow template. Workflows can be created only in the user's namespace. (The public namespace contains only
 * entities.) The workflow can contain only entities in the specified namespace. The workflow is validated against the entities in the
 * latest version of the user's namespace unless another namespace version is specified in the request.
 */
export const createFlowTemplate: (
  input: CreateFlowTemplateRequest,
) => effect.Effect<
  CreateFlowTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowTemplateRequest,
  output: CreateFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Removes a system instance from its target (Cloud or Greengrass).
 */
export const undeploySystemInstance: (
  input: UndeploySystemInstanceRequest,
) => effect.Effect<
  UndeploySystemInstanceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UndeploySystemInstanceRequest,
  output: UndeploySystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a workflow. Any new system or deployment that contains this workflow will fail to update or deploy.
 * Existing deployments that contain the workflow will continue to run (since they use a snapshot of the workflow taken at the time of deployment).
 */
export const deleteFlowTemplate: (
  input: DeleteFlowTemplateRequest,
) => effect.Effect<
  DeleteFlowTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowTemplateRequest,
  output: DeleteFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a system instance.
 * Only system instances that have never been deployed, or that have been undeployed can be deleted.
 *
 * Users can create a new system instance that has the same ID as a deleted system instance.
 */
export const deleteSystemInstance: (
  input: DeleteSystemInstanceRequest,
) => effect.Effect<
  DeleteSystemInstanceResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSystemInstanceRequest,
  output: DeleteSystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a system. New deployments can't contain the system after its deletion.
 * Existing deployments that contain the system will continue to work because they use a snapshot of the system that is taken when it is deployed.
 */
export const deleteSystemTemplate: (
  input: DeleteSystemTemplateRequest,
) => effect.Effect<
  DeleteSystemTemplateResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceInUseException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSystemTemplateRequest,
  output: DeleteSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ThrottlingException,
  ],
}));

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
  sdkId: "IoTTwinMaker",
  serviceShapeName: "AWSIoTTwinMaker",
});
const auth = T.AwsAuthSigv4({ name: "iottwinmaker" });
const ver = T.ServiceVersion("2021-11-29");
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
              `https://iottwinmaker-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iottwinmaker-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iottwinmaker.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://iottwinmaker.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Id = string;
export type ComponentTypeId = string;
export type Description = string;
export type ComponentTypeName = string;
export type EntityId = string;
export type EntityName = string;
export type ParentEntityId = string;
export type S3Url = string;
export type SceneCapability = string;
export type SyncSource = string;
export type RoleArn = string;
export type S3Location = string;
export type QueryStatement = string;
export type QueryServiceMaxResults = number;
export type NextToken = string;
export type Name = string;
export type ComponentPath = string;
export type MaxResults = number;
export type OrderByTime = string;
export type Time = string;
export type IdOrArn = string;
export type SourceType = string;
export type DestinationType = string;
export type TwinMakerArn = string;
export type TagKey = string;
export type PricingMode = string;
export type BundleName = string;
export type TagValue = string;
export type SceneMetadataValue = string;
export type Long = number;
export type UpdateReason = string;
export type InterpolationType = string;
export type IntervalInSeconds = number;
export type MetadataTransferJobState = string;
export type SyncResourceState = string;
export type SyncResourceType = string;
export type ParentEntityUpdateType = string;
export type SyncJobState = string;
export type State = string;
export type ErrorMessage = string;
export type WorkspaceDeleteMessage = string;
export type LinkedService = string;
export type PropertyDisplayName = string;
export type Scope = string;
export type GroupType = string;
export type S3SourceLocation = string;
export type S3DestinationLocation = string;
export type PricingTier = string;
export type Order = string;
export type Double = number;
export type Integer = number;
export type Expression = string;
export type ComponentUpdateType = string;
export type ColumnName = string;
export type ColumnType = string;
export type SceneErrorCode = string;
export type Type = string;
export type Value = string;
export type ErrorCode = string;
export type LambdaArn = string;
export type PropertyUpdateType = string;
export type PropertyGroupUpdateType = string;
export type Uuid = string;
export type SiteWiseExternalId = string;
export type ExceptionMessage = string;

//# Schemas
export interface GetPricingPlanRequest {}
export const GetPricingPlanRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pricingplan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPricingPlanRequest",
}) as any as S.Schema<GetPricingPlanRequest>;
export type ExtendsFrom = string[];
export const ExtendsFrom = S.Array(S.String);
export type SceneCapabilities = string[];
export const SceneCapabilities = S.Array(S.String);
export type SelectedPropertyList = string[];
export const SelectedPropertyList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type PricingBundles = string[];
export const PricingBundles = S.Array(S.String);
export interface CancelMetadataTransferJobRequest {
  metadataTransferJobId: string;
}
export const CancelMetadataTransferJobRequest = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String.pipe(T.HttpLabel("metadataTransferJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/metadata-transfer-jobs/{metadataTransferJobId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMetadataTransferJobRequest",
}) as any as S.Schema<CancelMetadataTransferJobRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateSyncJobRequest {
  workspaceId: string;
  syncSource: string;
  syncRole: string;
  tags?: TagMap;
}
export const CreateSyncJobRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    syncSource: S.String.pipe(T.HttpLabel("syncSource")),
    syncRole: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/sync-jobs/{syncSource}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSyncJobRequest",
}) as any as S.Schema<CreateSyncJobRequest>;
export interface CreateWorkspaceRequest {
  workspaceId: string;
  description?: string;
  s3Location?: string;
  role?: string;
  tags?: TagMap;
}
export const CreateWorkspaceRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    description: S.optional(S.String),
    s3Location: S.optional(S.String),
    role: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workspaces/{workspaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkspaceRequest",
}) as any as S.Schema<CreateWorkspaceRequest>;
export interface DeleteComponentTypeRequest {
  workspaceId: string;
  componentTypeId: string;
}
export const DeleteComponentTypeRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    componentTypeId: S.String.pipe(T.HttpLabel("componentTypeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workspaces/{workspaceId}/component-types/{componentTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteComponentTypeRequest",
}) as any as S.Schema<DeleteComponentTypeRequest>;
export interface DeleteEntityRequest {
  workspaceId: string;
  entityId: string;
  isRecursive?: boolean;
}
export const DeleteEntityRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.String.pipe(T.HttpLabel("entityId")),
    isRecursive: S.optional(S.Boolean).pipe(T.HttpQuery("isRecursive")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workspaces/{workspaceId}/entities/{entityId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEntityRequest",
}) as any as S.Schema<DeleteEntityRequest>;
export interface DeleteSceneRequest {
  workspaceId: string;
  sceneId: string;
}
export const DeleteSceneRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    sceneId: S.String.pipe(T.HttpLabel("sceneId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workspaces/{workspaceId}/scenes/{sceneId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSceneRequest",
}) as any as S.Schema<DeleteSceneRequest>;
export interface DeleteSceneResponse {}
export const DeleteSceneResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSceneResponse",
}) as any as S.Schema<DeleteSceneResponse>;
export interface DeleteSyncJobRequest {
  workspaceId: string;
  syncSource: string;
}
export const DeleteSyncJobRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    syncSource: S.String.pipe(T.HttpLabel("syncSource")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workspaces/{workspaceId}/sync-jobs/{syncSource}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSyncJobRequest",
}) as any as S.Schema<DeleteSyncJobRequest>;
export interface DeleteWorkspaceRequest {
  workspaceId: string;
}
export const DeleteWorkspaceRequest = S.suspend(() =>
  S.Struct({ workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/workspaces/{workspaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkspaceRequest",
}) as any as S.Schema<DeleteWorkspaceRequest>;
export interface ExecuteQueryRequest {
  workspaceId: string;
  queryStatement: string;
  maxResults?: number;
  nextToken?: string;
}
export const ExecuteQueryRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    queryStatement: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/queries/execution" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteQueryRequest",
}) as any as S.Schema<ExecuteQueryRequest>;
export interface GetComponentTypeRequest {
  workspaceId: string;
  componentTypeId: string;
}
export const GetComponentTypeRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    componentTypeId: S.String.pipe(T.HttpLabel("componentTypeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workspaces/{workspaceId}/component-types/{componentTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComponentTypeRequest",
}) as any as S.Schema<GetComponentTypeRequest>;
export interface GetEntityRequest {
  workspaceId: string;
  entityId: string;
}
export const GetEntityRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.String.pipe(T.HttpLabel("entityId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workspaces/{workspaceId}/entities/{entityId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEntityRequest",
}) as any as S.Schema<GetEntityRequest>;
export interface GetMetadataTransferJobRequest {
  metadataTransferJobId: string;
}
export const GetMetadataTransferJobRequest = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String.pipe(T.HttpLabel("metadataTransferJobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/metadata-transfer-jobs/{metadataTransferJobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMetadataTransferJobRequest",
}) as any as S.Schema<GetMetadataTransferJobRequest>;
export interface GetSceneRequest {
  workspaceId: string;
  sceneId: string;
}
export const GetSceneRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    sceneId: S.String.pipe(T.HttpLabel("sceneId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workspaces/{workspaceId}/scenes/{sceneId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSceneRequest",
}) as any as S.Schema<GetSceneRequest>;
export interface GetSyncJobRequest {
  syncSource: string;
  workspaceId?: string;
}
export const GetSyncJobRequest = S.suspend(() =>
  S.Struct({
    syncSource: S.String.pipe(T.HttpLabel("syncSource")),
    workspaceId: S.optional(S.String).pipe(T.HttpQuery("workspace")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sync-jobs/{syncSource}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSyncJobRequest",
}) as any as S.Schema<GetSyncJobRequest>;
export interface GetWorkspaceRequest {
  workspaceId: string;
}
export const GetWorkspaceRequest = S.suspend(() =>
  S.Struct({ workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workspaces/{workspaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkspaceRequest",
}) as any as S.Schema<GetWorkspaceRequest>;
export interface ListComponentsRequest {
  workspaceId: string;
  entityId: string;
  componentPath?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListComponentsRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.String.pipe(T.HttpLabel("entityId")),
    componentPath: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/entities/{entityId}/components-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComponentsRequest",
}) as any as S.Schema<ListComponentsRequest>;
export interface ListPropertiesRequest {
  workspaceId: string;
  componentName?: string;
  componentPath?: string;
  entityId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPropertiesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    componentName: S.optional(S.String),
    componentPath: S.optional(S.String),
    entityId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/properties-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPropertiesRequest",
}) as any as S.Schema<ListPropertiesRequest>;
export interface ListScenesRequest {
  workspaceId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListScenesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/scenes-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScenesRequest",
}) as any as S.Schema<ListScenesRequest>;
export interface ListSyncJobsRequest {
  workspaceId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSyncJobsRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/sync-jobs-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSyncJobsRequest",
}) as any as S.Schema<ListSyncJobsRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags-list" }),
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
export interface ListWorkspacesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListWorkspacesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workspaces-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkspacesRequest",
}) as any as S.Schema<ListWorkspacesRequest>;
export interface TagResourceRequest {
  resourceARN: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tags: TagMap }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
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
  resourceARN: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String.pipe(T.HttpQuery("resourceARN")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags" }),
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
export interface Relationship {
  targetComponentTypeId?: string;
  relationshipType?: string;
}
export const Relationship = S.suspend(() =>
  S.Struct({
    targetComponentTypeId: S.optional(S.String),
    relationshipType: S.optional(S.String),
  }),
).annotations({ identifier: "Relationship" }) as any as S.Schema<Relationship>;
export interface DataType {
  type: string;
  nestedType?: DataType;
  allowedValues?: DataValueList;
  unitOfMeasure?: string;
  relationship?: Relationship;
}
export const DataType = S.suspend(() =>
  S.Struct({
    type: S.String,
    nestedType: S.optional(
      S.suspend((): S.Schema<DataType, any> => DataType).annotations({
        identifier: "DataType",
      }),
    ),
    allowedValues: S.optional(
      S.suspend(() => DataValueList).annotations({
        identifier: "DataValueList",
      }),
    ),
    unitOfMeasure: S.optional(S.String),
    relationship: S.optional(Relationship),
  }),
).annotations({ identifier: "DataType" }) as any as S.Schema<DataType>;
export interface RelationshipValue {
  targetEntityId?: string;
  targetComponentName?: string;
}
export const RelationshipValue = S.suspend(() =>
  S.Struct({
    targetEntityId: S.optional(S.String),
    targetComponentName: S.optional(S.String),
  }),
).annotations({
  identifier: "RelationshipValue",
}) as any as S.Schema<RelationshipValue>;
export interface DataValue {
  booleanValue?: boolean;
  doubleValue?: number;
  integerValue?: number;
  longValue?: number;
  stringValue?: string;
  listValue?: DataValueList;
  mapValue?: DataValueMap;
  relationshipValue?: RelationshipValue;
  expression?: string;
}
export const DataValue = S.suspend(() =>
  S.Struct({
    booleanValue: S.optional(S.Boolean),
    doubleValue: S.optional(S.Number),
    integerValue: S.optional(S.Number),
    longValue: S.optional(S.Number),
    stringValue: S.optional(S.String),
    listValue: S.optional(
      S.suspend(() => DataValueList).annotations({
        identifier: "DataValueList",
      }),
    ),
    mapValue: S.optional(
      S.suspend(() => DataValueMap).annotations({ identifier: "DataValueMap" }),
    ),
    relationshipValue: S.optional(RelationshipValue),
    expression: S.optional(S.String),
  }),
).annotations({ identifier: "DataValue" }) as any as S.Schema<DataValue>;
export type Configuration = { [key: string]: string };
export const Configuration = S.Record({ key: S.String, value: S.String });
export interface PropertyDefinitionRequest {
  dataType?: DataType;
  isRequiredInEntity?: boolean;
  isExternalId?: boolean;
  isStoredExternally?: boolean;
  isTimeSeries?: boolean;
  defaultValue?: DataValue;
  configuration?: Configuration;
  displayName?: string;
}
export const PropertyDefinitionRequest = S.suspend(() =>
  S.Struct({
    dataType: S.optional(DataType),
    isRequiredInEntity: S.optional(S.Boolean),
    isExternalId: S.optional(S.Boolean),
    isStoredExternally: S.optional(S.Boolean),
    isTimeSeries: S.optional(S.Boolean),
    defaultValue: S.optional(DataValue),
    configuration: S.optional(Configuration),
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertyDefinitionRequest",
}) as any as S.Schema<PropertyDefinitionRequest>;
export type PropertyDefinitionsRequest = {
  [key: string]: PropertyDefinitionRequest;
};
export const PropertyDefinitionsRequest = S.Record({
  key: S.String,
  value: PropertyDefinitionRequest,
});
export type RequiredProperties = string[];
export const RequiredProperties = S.Array(S.String);
export interface LambdaFunction {
  arn: string;
}
export const LambdaFunction = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "LambdaFunction",
}) as any as S.Schema<LambdaFunction>;
export interface DataConnector {
  lambda?: LambdaFunction;
  isNative?: boolean;
}
export const DataConnector = S.suspend(() =>
  S.Struct({
    lambda: S.optional(LambdaFunction),
    isNative: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DataConnector",
}) as any as S.Schema<DataConnector>;
export interface FunctionRequest {
  requiredProperties?: RequiredProperties;
  scope?: string;
  implementedBy?: DataConnector;
}
export const FunctionRequest = S.suspend(() =>
  S.Struct({
    requiredProperties: S.optional(RequiredProperties),
    scope: S.optional(S.String),
    implementedBy: S.optional(DataConnector),
  }),
).annotations({
  identifier: "FunctionRequest",
}) as any as S.Schema<FunctionRequest>;
export type FunctionsRequest = { [key: string]: FunctionRequest };
export const FunctionsRequest = S.Record({
  key: S.String,
  value: FunctionRequest,
});
export type PropertyNames = string[];
export const PropertyNames = S.Array(S.String);
export interface PropertyGroupRequest {
  groupType?: string;
  propertyNames?: PropertyNames;
}
export const PropertyGroupRequest = S.suspend(() =>
  S.Struct({
    groupType: S.optional(S.String),
    propertyNames: S.optional(PropertyNames),
  }),
).annotations({
  identifier: "PropertyGroupRequest",
}) as any as S.Schema<PropertyGroupRequest>;
export type PropertyGroupsRequest = { [key: string]: PropertyGroupRequest };
export const PropertyGroupsRequest = S.Record({
  key: S.String,
  value: PropertyGroupRequest,
});
export interface CompositeComponentTypeRequest {
  componentTypeId?: string;
}
export const CompositeComponentTypeRequest = S.suspend(() =>
  S.Struct({ componentTypeId: S.optional(S.String) }),
).annotations({
  identifier: "CompositeComponentTypeRequest",
}) as any as S.Schema<CompositeComponentTypeRequest>;
export type CompositeComponentTypesRequest = {
  [key: string]: CompositeComponentTypeRequest;
};
export const CompositeComponentTypesRequest = S.Record({
  key: S.String,
  value: CompositeComponentTypeRequest,
});
export interface UpdateComponentTypeRequest {
  workspaceId: string;
  isSingleton?: boolean;
  componentTypeId: string;
  description?: string;
  propertyDefinitions?: PropertyDefinitionsRequest;
  extendsFrom?: ExtendsFrom;
  functions?: FunctionsRequest;
  propertyGroups?: PropertyGroupsRequest;
  componentTypeName?: string;
  compositeComponentTypes?: CompositeComponentTypesRequest;
}
export const UpdateComponentTypeRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    isSingleton: S.optional(S.Boolean),
    componentTypeId: S.String.pipe(T.HttpLabel("componentTypeId")),
    description: S.optional(S.String),
    propertyDefinitions: S.optional(PropertyDefinitionsRequest),
    extendsFrom: S.optional(ExtendsFrom),
    functions: S.optional(FunctionsRequest),
    propertyGroups: S.optional(PropertyGroupsRequest),
    componentTypeName: S.optional(S.String),
    compositeComponentTypes: S.optional(CompositeComponentTypesRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/workspaces/{workspaceId}/component-types/{componentTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateComponentTypeRequest",
}) as any as S.Schema<UpdateComponentTypeRequest>;
export interface UpdatePricingPlanRequest {
  pricingMode: string;
  bundleNames?: PricingBundles;
}
export const UpdatePricingPlanRequest = S.suspend(() =>
  S.Struct({
    pricingMode: S.String,
    bundleNames: S.optional(PricingBundles),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pricingplan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePricingPlanRequest",
}) as any as S.Schema<UpdatePricingPlanRequest>;
export type SceneMetadataMap = { [key: string]: string };
export const SceneMetadataMap = S.Record({ key: S.String, value: S.String });
export interface UpdateSceneRequest {
  workspaceId: string;
  sceneId: string;
  contentLocation?: string;
  description?: string;
  capabilities?: SceneCapabilities;
  sceneMetadata?: SceneMetadataMap;
}
export const UpdateSceneRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    sceneId: S.String.pipe(T.HttpLabel("sceneId")),
    contentLocation: S.optional(S.String),
    description: S.optional(S.String),
    capabilities: S.optional(SceneCapabilities),
    sceneMetadata: S.optional(SceneMetadataMap),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/workspaces/{workspaceId}/scenes/{sceneId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSceneRequest",
}) as any as S.Schema<UpdateSceneRequest>;
export interface UpdateWorkspaceRequest {
  workspaceId: string;
  description?: string;
  role?: string;
  s3Location?: string;
}
export const UpdateWorkspaceRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    description: S.optional(S.String),
    role: S.optional(S.String),
    s3Location: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkspaceRequest",
}) as any as S.Schema<UpdateWorkspaceRequest>;
export interface InterpolationParameters {
  interpolationType?: string;
  intervalInSeconds?: number;
}
export const InterpolationParameters = S.suspend(() =>
  S.Struct({
    interpolationType: S.optional(S.String),
    intervalInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "InterpolationParameters",
}) as any as S.Schema<InterpolationParameters>;
export type LinkedServices = string[];
export const LinkedServices = S.Array(S.String);
export type ListComponentTypesFilter =
  | { extendsFrom: string }
  | { namespace: string }
  | { isAbstract: boolean };
export const ListComponentTypesFilter = S.Union(
  S.Struct({ extendsFrom: S.String }),
  S.Struct({ namespace: S.String }),
  S.Struct({ isAbstract: S.Boolean }),
);
export type ListComponentTypesFilters =
  (typeof ListComponentTypesFilter)["Type"][];
export const ListComponentTypesFilters = S.Array(ListComponentTypesFilter);
export type ListEntitiesFilter =
  | { parentEntityId: string }
  | { componentTypeId: string }
  | { externalId: string };
export const ListEntitiesFilter = S.Union(
  S.Struct({ parentEntityId: S.String }),
  S.Struct({ componentTypeId: S.String }),
  S.Struct({ externalId: S.String }),
);
export type ListEntitiesFilters = (typeof ListEntitiesFilter)["Type"][];
export const ListEntitiesFilters = S.Array(ListEntitiesFilter);
export type ListMetadataTransferJobsFilter =
  | { workspaceId: string }
  | { state: string };
export const ListMetadataTransferJobsFilter = S.Union(
  S.Struct({ workspaceId: S.String }),
  S.Struct({ state: S.String }),
);
export type ListMetadataTransferJobsFilters =
  (typeof ListMetadataTransferJobsFilter)["Type"][];
export const ListMetadataTransferJobsFilters = S.Array(
  ListMetadataTransferJobsFilter,
);
export type SyncResourceFilter =
  | { state: string }
  | { resourceType: string }
  | { resourceId: string }
  | { externalId: string };
export const SyncResourceFilter = S.Union(
  S.Struct({ state: S.String }),
  S.Struct({ resourceType: S.String }),
  S.Struct({ resourceId: S.String }),
  S.Struct({ externalId: S.String }),
);
export type SyncResourceFilters = (typeof SyncResourceFilter)["Type"][];
export const SyncResourceFilters = S.Array(SyncResourceFilter);
export interface ParentEntityUpdateRequest {
  updateType: string;
  parentEntityId?: string;
}
export const ParentEntityUpdateRequest = S.suspend(() =>
  S.Struct({ updateType: S.String, parentEntityId: S.optional(S.String) }),
).annotations({
  identifier: "ParentEntityUpdateRequest",
}) as any as S.Schema<ParentEntityUpdateRequest>;
export type DataValueList = DataValue[];
export const DataValueList = S.Array(
  S.suspend((): S.Schema<DataValue, any> => DataValue).annotations({
    identifier: "DataValue",
  }),
) as any as S.Schema<DataValueList>;
export interface CreateSceneRequest {
  workspaceId: string;
  sceneId: string;
  contentLocation: string;
  description?: string;
  capabilities?: SceneCapabilities;
  tags?: TagMap;
  sceneMetadata?: SceneMetadataMap;
}
export const CreateSceneRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    sceneId: S.String,
    contentLocation: S.String,
    description: S.optional(S.String),
    capabilities: S.optional(SceneCapabilities),
    tags: S.optional(TagMap),
    sceneMetadata: S.optional(SceneMetadataMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/scenes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSceneRequest",
}) as any as S.Schema<CreateSceneRequest>;
export interface CreateSyncJobResponse {
  arn: string;
  creationDateTime: Date;
  state: string;
}
export const CreateSyncJobResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    state: S.String,
  }),
).annotations({
  identifier: "CreateSyncJobResponse",
}) as any as S.Schema<CreateSyncJobResponse>;
export interface CreateWorkspaceResponse {
  arn: string;
  creationDateTime: Date;
}
export const CreateWorkspaceResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CreateWorkspaceResponse",
}) as any as S.Schema<CreateWorkspaceResponse>;
export interface DeleteComponentTypeResponse {
  state: string;
}
export const DeleteComponentTypeResponse = S.suspend(() =>
  S.Struct({ state: S.String }),
).annotations({
  identifier: "DeleteComponentTypeResponse",
}) as any as S.Schema<DeleteComponentTypeResponse>;
export interface DeleteEntityResponse {
  state: string;
}
export const DeleteEntityResponse = S.suspend(() =>
  S.Struct({ state: S.String }),
).annotations({
  identifier: "DeleteEntityResponse",
}) as any as S.Schema<DeleteEntityResponse>;
export interface DeleteSyncJobResponse {
  state: string;
}
export const DeleteSyncJobResponse = S.suspend(() =>
  S.Struct({ state: S.String }),
).annotations({
  identifier: "DeleteSyncJobResponse",
}) as any as S.Schema<DeleteSyncJobResponse>;
export interface DeleteWorkspaceResponse {
  message?: string;
}
export const DeleteWorkspaceResponse = S.suspend(() =>
  S.Struct({ message: S.optional(S.String) }),
).annotations({
  identifier: "DeleteWorkspaceResponse",
}) as any as S.Schema<DeleteWorkspaceResponse>;
export interface S3SourceConfiguration {
  location: string;
}
export const S3SourceConfiguration = S.suspend(() =>
  S.Struct({ location: S.String }),
).annotations({
  identifier: "S3SourceConfiguration",
}) as any as S.Schema<S3SourceConfiguration>;
export interface FilterByAssetModel {
  assetModelId?: string;
  assetModelExternalId?: string;
  includeOffspring?: boolean;
  includeAssets?: boolean;
}
export const FilterByAssetModel = S.suspend(() =>
  S.Struct({
    assetModelId: S.optional(S.String),
    assetModelExternalId: S.optional(S.String),
    includeOffspring: S.optional(S.Boolean),
    includeAssets: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FilterByAssetModel",
}) as any as S.Schema<FilterByAssetModel>;
export interface FilterByAsset {
  assetId?: string;
  assetExternalId?: string;
  includeOffspring?: boolean;
  includeAssetModel?: boolean;
}
export const FilterByAsset = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String),
    assetExternalId: S.optional(S.String),
    includeOffspring: S.optional(S.Boolean),
    includeAssetModel: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FilterByAsset",
}) as any as S.Schema<FilterByAsset>;
export type IotSiteWiseSourceConfigurationFilter =
  | { filterByAssetModel: FilterByAssetModel }
  | { filterByAsset: FilterByAsset };
export const IotSiteWiseSourceConfigurationFilter = S.Union(
  S.Struct({ filterByAssetModel: FilterByAssetModel }),
  S.Struct({ filterByAsset: FilterByAsset }),
);
export type IotSiteWiseSourceConfigurationFilters =
  (typeof IotSiteWiseSourceConfigurationFilter)["Type"][];
export const IotSiteWiseSourceConfigurationFilters = S.Array(
  IotSiteWiseSourceConfigurationFilter,
);
export interface IotSiteWiseSourceConfiguration {
  filters?: IotSiteWiseSourceConfigurationFilters;
}
export const IotSiteWiseSourceConfiguration = S.suspend(() =>
  S.Struct({ filters: S.optional(IotSiteWiseSourceConfigurationFilters) }),
).annotations({
  identifier: "IotSiteWiseSourceConfiguration",
}) as any as S.Schema<IotSiteWiseSourceConfiguration>;
export interface FilterByComponentType {
  componentTypeId: string;
}
export const FilterByComponentType = S.suspend(() =>
  S.Struct({ componentTypeId: S.String }),
).annotations({
  identifier: "FilterByComponentType",
}) as any as S.Schema<FilterByComponentType>;
export interface FilterByEntity {
  entityId: string;
}
export const FilterByEntity = S.suspend(() =>
  S.Struct({ entityId: S.String }),
).annotations({
  identifier: "FilterByEntity",
}) as any as S.Schema<FilterByEntity>;
export type IotTwinMakerSourceConfigurationFilter =
  | { filterByComponentType: FilterByComponentType }
  | { filterByEntity: FilterByEntity };
export const IotTwinMakerSourceConfigurationFilter = S.Union(
  S.Struct({ filterByComponentType: FilterByComponentType }),
  S.Struct({ filterByEntity: FilterByEntity }),
);
export type IotTwinMakerSourceConfigurationFilters =
  (typeof IotTwinMakerSourceConfigurationFilter)["Type"][];
export const IotTwinMakerSourceConfigurationFilters = S.Array(
  IotTwinMakerSourceConfigurationFilter,
);
export interface IotTwinMakerSourceConfiguration {
  workspace: string;
  filters?: IotTwinMakerSourceConfigurationFilters;
}
export const IotTwinMakerSourceConfiguration = S.suspend(() =>
  S.Struct({
    workspace: S.String,
    filters: S.optional(IotTwinMakerSourceConfigurationFilters),
  }),
).annotations({
  identifier: "IotTwinMakerSourceConfiguration",
}) as any as S.Schema<IotTwinMakerSourceConfiguration>;
export interface SourceConfiguration {
  type: string;
  s3Configuration?: S3SourceConfiguration;
  iotSiteWiseConfiguration?: IotSiteWiseSourceConfiguration;
  iotTwinMakerConfiguration?: IotTwinMakerSourceConfiguration;
}
export const SourceConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    s3Configuration: S.optional(S3SourceConfiguration),
    iotSiteWiseConfiguration: S.optional(IotSiteWiseSourceConfiguration),
    iotTwinMakerConfiguration: S.optional(IotTwinMakerSourceConfiguration),
  }),
).annotations({
  identifier: "SourceConfiguration",
}) as any as S.Schema<SourceConfiguration>;
export type SourceConfigurations = SourceConfiguration[];
export const SourceConfigurations = S.Array(SourceConfiguration);
export interface S3DestinationConfiguration {
  location: string;
}
export const S3DestinationConfiguration = S.suspend(() =>
  S.Struct({ location: S.String }),
).annotations({
  identifier: "S3DestinationConfiguration",
}) as any as S.Schema<S3DestinationConfiguration>;
export interface IotTwinMakerDestinationConfiguration {
  workspace: string;
}
export const IotTwinMakerDestinationConfiguration = S.suspend(() =>
  S.Struct({ workspace: S.String }),
).annotations({
  identifier: "IotTwinMakerDestinationConfiguration",
}) as any as S.Schema<IotTwinMakerDestinationConfiguration>;
export interface DestinationConfiguration {
  type: string;
  s3Configuration?: S3DestinationConfiguration;
  iotTwinMakerConfiguration?: IotTwinMakerDestinationConfiguration;
}
export const DestinationConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    s3Configuration: S.optional(S3DestinationConfiguration),
    iotTwinMakerConfiguration: S.optional(IotTwinMakerDestinationConfiguration),
  }),
).annotations({
  identifier: "DestinationConfiguration",
}) as any as S.Schema<DestinationConfiguration>;
export interface ErrorDetails {
  code?: string;
  message?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface MetadataTransferJobStatus {
  state?: string;
  error?: ErrorDetails;
  queuedPosition?: number;
}
export const MetadataTransferJobStatus = S.suspend(() =>
  S.Struct({
    state: S.optional(S.String),
    error: S.optional(ErrorDetails),
    queuedPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetadataTransferJobStatus",
}) as any as S.Schema<MetadataTransferJobStatus>;
export interface MetadataTransferJobProgress {
  totalCount?: number;
  succeededCount?: number;
  skippedCount?: number;
  failedCount?: number;
}
export const MetadataTransferJobProgress = S.suspend(() =>
  S.Struct({
    totalCount: S.optional(S.Number),
    succeededCount: S.optional(S.Number),
    skippedCount: S.optional(S.Number),
    failedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetadataTransferJobProgress",
}) as any as S.Schema<MetadataTransferJobProgress>;
export interface GetMetadataTransferJobResponse {
  metadataTransferJobId: string;
  arn: string;
  description?: string;
  sources: SourceConfigurations;
  destination: DestinationConfiguration;
  metadataTransferJobRole: string;
  reportUrl?: string;
  creationDateTime: Date;
  updateDateTime: Date;
  status: MetadataTransferJobStatus;
  progress?: MetadataTransferJobProgress;
}
export const GetMetadataTransferJobResponse = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String,
    arn: S.String,
    description: S.optional(S.String),
    sources: SourceConfigurations,
    destination: DestinationConfiguration,
    metadataTransferJobRole: S.String,
    reportUrl: S.optional(S.String),
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: MetadataTransferJobStatus,
    progress: S.optional(MetadataTransferJobProgress),
  }),
).annotations({
  identifier: "GetMetadataTransferJobResponse",
}) as any as S.Schema<GetMetadataTransferJobResponse>;
export interface GetWorkspaceResponse {
  workspaceId: string;
  arn: string;
  description?: string;
  linkedServices?: LinkedServices;
  s3Location?: string;
  role?: string;
  creationDateTime: Date;
  updateDateTime: Date;
}
export const GetWorkspaceResponse = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    arn: S.String,
    description: S.optional(S.String),
    linkedServices: S.optional(LinkedServices),
    s3Location: S.optional(S.String),
    role: S.optional(S.String),
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetWorkspaceResponse",
}) as any as S.Schema<GetWorkspaceResponse>;
export interface ListComponentTypesRequest {
  workspaceId: string;
  filters?: ListComponentTypesFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListComponentTypesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    filters: S.optional(ListComponentTypesFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/component-types-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComponentTypesRequest",
}) as any as S.Schema<ListComponentTypesRequest>;
export interface ListEntitiesRequest {
  workspaceId: string;
  filters?: ListEntitiesFilters;
  maxResults?: number;
  nextToken?: string;
}
export const ListEntitiesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    filters: S.optional(ListEntitiesFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/entities-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEntitiesRequest",
}) as any as S.Schema<ListEntitiesRequest>;
export interface ListMetadataTransferJobsRequest {
  sourceType: string;
  destinationType: string;
  filters?: ListMetadataTransferJobsFilters;
  nextToken?: string;
  maxResults?: number;
}
export const ListMetadataTransferJobsRequest = S.suspend(() =>
  S.Struct({
    sourceType: S.String,
    destinationType: S.String,
    filters: S.optional(ListMetadataTransferJobsFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/metadata-transfer-jobs-list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMetadataTransferJobsRequest",
}) as any as S.Schema<ListMetadataTransferJobsRequest>;
export interface ListSyncResourcesRequest {
  workspaceId: string;
  syncSource: string;
  filters?: SyncResourceFilters;
  maxResults?: number;
  nextToken?: string;
}
export const ListSyncResourcesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    syncSource: S.String.pipe(T.HttpLabel("syncSource")),
    filters: S.optional(SyncResourceFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/sync-jobs/{syncSource}/resources-list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSyncResourcesRequest",
}) as any as S.Schema<ListSyncResourcesRequest>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
  nextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateComponentTypeResponse {
  workspaceId: string;
  arn: string;
  componentTypeId: string;
  state: string;
}
export const UpdateComponentTypeResponse = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    arn: S.String,
    componentTypeId: S.String,
    state: S.String,
  }),
).annotations({
  identifier: "UpdateComponentTypeResponse",
}) as any as S.Schema<UpdateComponentTypeResponse>;
export interface BundleInformation {
  bundleNames: PricingBundles;
  pricingTier?: string;
}
export const BundleInformation = S.suspend(() =>
  S.Struct({ bundleNames: PricingBundles, pricingTier: S.optional(S.String) }),
).annotations({
  identifier: "BundleInformation",
}) as any as S.Schema<BundleInformation>;
export interface PricingPlan {
  billableEntityCount?: number;
  bundleInformation?: BundleInformation;
  effectiveDateTime: Date;
  pricingMode: string;
  updateDateTime: Date;
  updateReason: string;
}
export const PricingPlan = S.suspend(() =>
  S.Struct({
    billableEntityCount: S.optional(S.Number),
    bundleInformation: S.optional(BundleInformation),
    effectiveDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    pricingMode: S.String,
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateReason: S.String,
  }),
).annotations({ identifier: "PricingPlan" }) as any as S.Schema<PricingPlan>;
export interface UpdatePricingPlanResponse {
  currentPricingPlan: PricingPlan;
  pendingPricingPlan?: PricingPlan;
}
export const UpdatePricingPlanResponse = S.suspend(() =>
  S.Struct({
    currentPricingPlan: PricingPlan,
    pendingPricingPlan: S.optional(PricingPlan),
  }),
).annotations({
  identifier: "UpdatePricingPlanResponse",
}) as any as S.Schema<UpdatePricingPlanResponse>;
export interface UpdateSceneResponse {
  updateDateTime: Date;
}
export const UpdateSceneResponse = S.suspend(() =>
  S.Struct({ updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
).annotations({
  identifier: "UpdateSceneResponse",
}) as any as S.Schema<UpdateSceneResponse>;
export interface UpdateWorkspaceResponse {
  updateDateTime: Date;
}
export const UpdateWorkspaceResponse = S.suspend(() =>
  S.Struct({ updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
).annotations({
  identifier: "UpdateWorkspaceResponse",
}) as any as S.Schema<UpdateWorkspaceResponse>;
export interface PropertyValue {
  timestamp?: Date;
  value: DataValue;
  time?: string;
}
export const PropertyValue = S.suspend(() =>
  S.Struct({
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    value: DataValue,
    time: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertyValue",
}) as any as S.Schema<PropertyValue>;
export type PropertyValues = PropertyValue[];
export const PropertyValues = S.Array(PropertyValue);
export interface PropertyRequest {
  definition?: PropertyDefinitionRequest;
  value?: DataValue;
  updateType?: string;
}
export const PropertyRequest = S.suspend(() =>
  S.Struct({
    definition: S.optional(PropertyDefinitionRequest),
    value: S.optional(DataValue),
    updateType: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertyRequest",
}) as any as S.Schema<PropertyRequest>;
export type PropertyRequests = { [key: string]: PropertyRequest };
export const PropertyRequests = S.Record({
  key: S.String,
  value: PropertyRequest,
});
export interface ComponentPropertyGroupRequest {
  groupType?: string;
  propertyNames?: PropertyNames;
  updateType?: string;
}
export const ComponentPropertyGroupRequest = S.suspend(() =>
  S.Struct({
    groupType: S.optional(S.String),
    propertyNames: S.optional(PropertyNames),
    updateType: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentPropertyGroupRequest",
}) as any as S.Schema<ComponentPropertyGroupRequest>;
export type ComponentPropertyGroupRequests = {
  [key: string]: ComponentPropertyGroupRequest;
};
export const ComponentPropertyGroupRequests = S.Record({
  key: S.String,
  value: ComponentPropertyGroupRequest,
});
export interface CompositeComponentRequest {
  description?: string;
  properties?: PropertyRequests;
  propertyGroups?: ComponentPropertyGroupRequests;
}
export const CompositeComponentRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    properties: S.optional(PropertyRequests),
    propertyGroups: S.optional(ComponentPropertyGroupRequests),
  }),
).annotations({
  identifier: "CompositeComponentRequest",
}) as any as S.Schema<CompositeComponentRequest>;
export type RowData = any[];
export const RowData = S.Array(S.Any);
export interface OrderBy {
  order?: string;
  propertyName: string;
}
export const OrderBy = S.suspend(() =>
  S.Struct({ order: S.optional(S.String), propertyName: S.String }),
).annotations({ identifier: "OrderBy" }) as any as S.Schema<OrderBy>;
export type OrderByList = OrderBy[];
export const OrderByList = S.Array(OrderBy);
export interface ComponentUpdateRequest {
  updateType?: string;
  description?: string;
  componentTypeId?: string;
  propertyUpdates?: PropertyRequests;
  propertyGroupUpdates?: ComponentPropertyGroupRequests;
}
export const ComponentUpdateRequest = S.suspend(() =>
  S.Struct({
    updateType: S.optional(S.String),
    description: S.optional(S.String),
    componentTypeId: S.optional(S.String),
    propertyUpdates: S.optional(PropertyRequests),
    propertyGroupUpdates: S.optional(ComponentPropertyGroupRequests),
  }),
).annotations({
  identifier: "ComponentUpdateRequest",
}) as any as S.Schema<ComponentUpdateRequest>;
export interface CompositeComponentUpdateRequest {
  updateType?: string;
  description?: string;
  propertyUpdates?: PropertyRequests;
  propertyGroupUpdates?: ComponentPropertyGroupRequests;
}
export const CompositeComponentUpdateRequest = S.suspend(() =>
  S.Struct({
    updateType: S.optional(S.String),
    description: S.optional(S.String),
    propertyUpdates: S.optional(PropertyRequests),
    propertyGroupUpdates: S.optional(ComponentPropertyGroupRequests),
  }),
).annotations({
  identifier: "CompositeComponentUpdateRequest",
}) as any as S.Schema<CompositeComponentUpdateRequest>;
export type CompositeComponentsMapRequest = {
  [key: string]: CompositeComponentRequest;
};
export const CompositeComponentsMapRequest = S.Record({
  key: S.String,
  value: CompositeComponentRequest,
});
export interface ColumnDescription {
  name?: string;
  type?: string;
}
export const ColumnDescription = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "ColumnDescription",
}) as any as S.Schema<ColumnDescription>;
export type ColumnDescriptions = ColumnDescription[];
export const ColumnDescriptions = S.Array(ColumnDescription);
export interface Row {
  rowData?: RowData;
}
export const Row = S.suspend(() =>
  S.Struct({ rowData: S.optional(RowData) }),
).annotations({ identifier: "Row" }) as any as S.Schema<Row>;
export type Rows = Row[];
export const Rows = S.Array(Row);
export interface Status {
  state?: string;
  error?: ErrorDetails;
}
export const Status = S.suspend(() =>
  S.Struct({ state: S.optional(S.String), error: S.optional(ErrorDetails) }),
).annotations({ identifier: "Status" }) as any as S.Schema<Status>;
export interface PropertyFilter {
  propertyName?: string;
  operator?: string;
  value?: DataValue;
}
export const PropertyFilter = S.suspend(() =>
  S.Struct({
    propertyName: S.optional(S.String),
    operator: S.optional(S.String),
    value: S.optional(DataValue),
  }),
).annotations({
  identifier: "PropertyFilter",
}) as any as S.Schema<PropertyFilter>;
export type PropertyFilters = PropertyFilter[];
export const PropertyFilters = S.Array(PropertyFilter);
export interface TabularConditions {
  orderBy?: OrderByList;
  propertyFilters?: PropertyFilters;
}
export const TabularConditions = S.suspend(() =>
  S.Struct({
    orderBy: S.optional(OrderByList),
    propertyFilters: S.optional(PropertyFilters),
  }),
).annotations({
  identifier: "TabularConditions",
}) as any as S.Schema<TabularConditions>;
export type GeneratedSceneMetadataMap = { [key: string]: string };
export const GeneratedSceneMetadataMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface SceneError {
  code?: string;
  message?: string;
}
export const SceneError = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "SceneError" }) as any as S.Schema<SceneError>;
export interface SyncJobStatus {
  state?: string;
  error?: ErrorDetails;
}
export const SyncJobStatus = S.suspend(() =>
  S.Struct({ state: S.optional(S.String), error: S.optional(ErrorDetails) }),
).annotations({
  identifier: "SyncJobStatus",
}) as any as S.Schema<SyncJobStatus>;
export interface PropertyDefinitionResponse {
  dataType: DataType;
  isTimeSeries: boolean;
  isRequiredInEntity: boolean;
  isExternalId: boolean;
  isStoredExternally: boolean;
  isImported: boolean;
  isFinal: boolean;
  isInherited: boolean;
  defaultValue?: DataValue;
  configuration?: Configuration;
  displayName?: string;
}
export const PropertyDefinitionResponse = S.suspend(() =>
  S.Struct({
    dataType: DataType,
    isTimeSeries: S.Boolean,
    isRequiredInEntity: S.Boolean,
    isExternalId: S.Boolean,
    isStoredExternally: S.Boolean,
    isImported: S.Boolean,
    isFinal: S.Boolean,
    isInherited: S.Boolean,
    defaultValue: S.optional(DataValue),
    configuration: S.optional(Configuration),
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertyDefinitionResponse",
}) as any as S.Schema<PropertyDefinitionResponse>;
export interface PropertySummary {
  definition?: PropertyDefinitionResponse;
  propertyName: string;
  value?: DataValue;
  areAllPropertyValuesReturned?: boolean;
}
export const PropertySummary = S.suspend(() =>
  S.Struct({
    definition: S.optional(PropertyDefinitionResponse),
    propertyName: S.String,
    value: S.optional(DataValue),
    areAllPropertyValuesReturned: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PropertySummary",
}) as any as S.Schema<PropertySummary>;
export type PropertySummaries = PropertySummary[];
export const PropertySummaries = S.Array(PropertySummary);
export interface SceneSummary {
  sceneId: string;
  contentLocation: string;
  arn: string;
  creationDateTime: Date;
  updateDateTime: Date;
  description?: string;
}
export const SceneSummary = S.suspend(() =>
  S.Struct({
    sceneId: S.String,
    contentLocation: S.String,
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
  }),
).annotations({ identifier: "SceneSummary" }) as any as S.Schema<SceneSummary>;
export type SceneSummaries = SceneSummary[];
export const SceneSummaries = S.Array(SceneSummary);
export interface SyncJobSummary {
  arn?: string;
  workspaceId?: string;
  syncSource?: string;
  status?: SyncJobStatus;
  creationDateTime?: Date;
  updateDateTime?: Date;
}
export const SyncJobSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    workspaceId: S.optional(S.String),
    syncSource: S.optional(S.String),
    status: S.optional(SyncJobStatus),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    updateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SyncJobSummary",
}) as any as S.Schema<SyncJobSummary>;
export type SyncJobSummaries = SyncJobSummary[];
export const SyncJobSummaries = S.Array(SyncJobSummary);
export interface WorkspaceSummary {
  workspaceId: string;
  arn: string;
  description?: string;
  linkedServices?: LinkedServices;
  creationDateTime: Date;
  updateDateTime: Date;
}
export const WorkspaceSummary = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    arn: S.String,
    description: S.optional(S.String),
    linkedServices: S.optional(LinkedServices),
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "WorkspaceSummary",
}) as any as S.Schema<WorkspaceSummary>;
export type WorkspaceSummaries = WorkspaceSummary[];
export const WorkspaceSummaries = S.Array(WorkspaceSummary);
export type ComponentUpdatesMapRequest = {
  [key: string]: ComponentUpdateRequest;
};
export const ComponentUpdatesMapRequest = S.Record({
  key: S.String,
  value: ComponentUpdateRequest,
});
export type CompositeComponentUpdatesMapRequest = {
  [key: string]: CompositeComponentUpdateRequest;
};
export const CompositeComponentUpdatesMapRequest = S.Record({
  key: S.String,
  value: CompositeComponentUpdateRequest,
});
export type ExternalIdProperty = { [key: string]: string };
export const ExternalIdProperty = S.Record({ key: S.String, value: S.String });
export type DataValueMap = { [key: string]: DataValue };
export const DataValueMap = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<DataValue, any> => DataValue).annotations({
    identifier: "DataValue",
  }),
}) as any as S.Schema<DataValueMap>;
export interface CreateSceneResponse {
  arn: string;
  creationDateTime: Date;
}
export const CreateSceneResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CreateSceneResponse",
}) as any as S.Schema<CreateSceneResponse>;
export interface ExecuteQueryResponse {
  columnDescriptions?: ColumnDescriptions;
  rows?: Rows;
  nextToken?: string;
}
export const ExecuteQueryResponse = S.suspend(() =>
  S.Struct({
    columnDescriptions: S.optional(ColumnDescriptions),
    rows: S.optional(Rows),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecuteQueryResponse",
}) as any as S.Schema<ExecuteQueryResponse>;
export interface GetPricingPlanResponse {
  currentPricingPlan: PricingPlan;
  pendingPricingPlan?: PricingPlan;
}
export const GetPricingPlanResponse = S.suspend(() =>
  S.Struct({
    currentPricingPlan: PricingPlan,
    pendingPricingPlan: S.optional(PricingPlan),
  }),
).annotations({
  identifier: "GetPricingPlanResponse",
}) as any as S.Schema<GetPricingPlanResponse>;
export interface GetPropertyValueRequest {
  componentName?: string;
  componentPath?: string;
  componentTypeId?: string;
  entityId?: string;
  selectedProperties: SelectedPropertyList;
  workspaceId: string;
  maxResults?: number;
  nextToken?: string;
  propertyGroupName?: string;
  tabularConditions?: TabularConditions;
}
export const GetPropertyValueRequest = S.suspend(() =>
  S.Struct({
    componentName: S.optional(S.String),
    componentPath: S.optional(S.String),
    componentTypeId: S.optional(S.String),
    entityId: S.optional(S.String),
    selectedProperties: SelectedPropertyList,
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    propertyGroupName: S.optional(S.String),
    tabularConditions: S.optional(TabularConditions),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/entity-properties/value",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPropertyValueRequest",
}) as any as S.Schema<GetPropertyValueRequest>;
export interface GetSceneResponse {
  workspaceId: string;
  sceneId: string;
  contentLocation: string;
  arn: string;
  creationDateTime: Date;
  updateDateTime: Date;
  description?: string;
  capabilities?: SceneCapabilities;
  sceneMetadata?: SceneMetadataMap;
  generatedSceneMetadata?: GeneratedSceneMetadataMap;
  error?: SceneError;
}
export const GetSceneResponse = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    sceneId: S.String,
    contentLocation: S.String,
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    capabilities: S.optional(SceneCapabilities),
    sceneMetadata: S.optional(SceneMetadataMap),
    generatedSceneMetadata: S.optional(GeneratedSceneMetadataMap),
    error: S.optional(SceneError),
  }),
).annotations({
  identifier: "GetSceneResponse",
}) as any as S.Schema<GetSceneResponse>;
export interface GetSyncJobResponse {
  arn: string;
  workspaceId: string;
  syncSource: string;
  syncRole: string;
  status: SyncJobStatus;
  creationDateTime: Date;
  updateDateTime: Date;
}
export const GetSyncJobResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    workspaceId: S.String,
    syncSource: S.String,
    syncRole: S.String,
    status: SyncJobStatus,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetSyncJobResponse",
}) as any as S.Schema<GetSyncJobResponse>;
export interface ListPropertiesResponse {
  propertySummaries: PropertySummaries;
  nextToken?: string;
}
export const ListPropertiesResponse = S.suspend(() =>
  S.Struct({
    propertySummaries: PropertySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPropertiesResponse",
}) as any as S.Schema<ListPropertiesResponse>;
export interface ListScenesResponse {
  sceneSummaries?: SceneSummaries;
  nextToken?: string;
}
export const ListScenesResponse = S.suspend(() =>
  S.Struct({
    sceneSummaries: S.optional(SceneSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListScenesResponse",
}) as any as S.Schema<ListScenesResponse>;
export interface ListSyncJobsResponse {
  syncJobSummaries?: SyncJobSummaries;
  nextToken?: string;
}
export const ListSyncJobsResponse = S.suspend(() =>
  S.Struct({
    syncJobSummaries: S.optional(SyncJobSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSyncJobsResponse",
}) as any as S.Schema<ListSyncJobsResponse>;
export interface ListWorkspacesResponse {
  workspaceSummaries?: WorkspaceSummaries;
  nextToken?: string;
}
export const ListWorkspacesResponse = S.suspend(() =>
  S.Struct({
    workspaceSummaries: S.optional(WorkspaceSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkspacesResponse",
}) as any as S.Schema<ListWorkspacesResponse>;
export interface UpdateEntityRequest {
  workspaceId: string;
  entityId: string;
  entityName?: string;
  description?: string;
  componentUpdates?: ComponentUpdatesMapRequest;
  compositeComponentUpdates?: CompositeComponentUpdatesMapRequest;
  parentEntityUpdate?: ParentEntityUpdateRequest;
}
export const UpdateEntityRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.String.pipe(T.HttpLabel("entityId")),
    entityName: S.optional(S.String),
    description: S.optional(S.String),
    componentUpdates: S.optional(ComponentUpdatesMapRequest),
    compositeComponentUpdates: S.optional(CompositeComponentUpdatesMapRequest),
    parentEntityUpdate: S.optional(ParentEntityUpdateRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/workspaces/{workspaceId}/entities/{entityId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEntityRequest",
}) as any as S.Schema<UpdateEntityRequest>;
export interface EntityPropertyReference {
  componentName?: string;
  componentPath?: string;
  externalIdProperty?: ExternalIdProperty;
  entityId?: string;
  propertyName: string;
}
export const EntityPropertyReference = S.suspend(() =>
  S.Struct({
    componentName: S.optional(S.String),
    componentPath: S.optional(S.String),
    externalIdProperty: S.optional(ExternalIdProperty),
    entityId: S.optional(S.String),
    propertyName: S.String,
  }),
).annotations({
  identifier: "EntityPropertyReference",
}) as any as S.Schema<EntityPropertyReference>;
export interface FunctionResponse {
  requiredProperties?: RequiredProperties;
  scope?: string;
  implementedBy?: DataConnector;
  isInherited?: boolean;
}
export const FunctionResponse = S.suspend(() =>
  S.Struct({
    requiredProperties: S.optional(RequiredProperties),
    scope: S.optional(S.String),
    implementedBy: S.optional(DataConnector),
    isInherited: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FunctionResponse",
}) as any as S.Schema<FunctionResponse>;
export interface PropertyGroupResponse {
  groupType: string;
  propertyNames: PropertyNames;
  isInherited: boolean;
}
export const PropertyGroupResponse = S.suspend(() =>
  S.Struct({
    groupType: S.String,
    propertyNames: PropertyNames,
    isInherited: S.Boolean,
  }),
).annotations({
  identifier: "PropertyGroupResponse",
}) as any as S.Schema<PropertyGroupResponse>;
export interface CompositeComponentTypeResponse {
  componentTypeId?: string;
  isInherited?: boolean;
}
export const CompositeComponentTypeResponse = S.suspend(() =>
  S.Struct({
    componentTypeId: S.optional(S.String),
    isInherited: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CompositeComponentTypeResponse",
}) as any as S.Schema<CompositeComponentTypeResponse>;
export interface PropertyValueEntry {
  entityPropertyReference: EntityPropertyReference;
  propertyValues?: PropertyValues;
}
export const PropertyValueEntry = S.suspend(() =>
  S.Struct({
    entityPropertyReference: EntityPropertyReference,
    propertyValues: S.optional(PropertyValues),
  }),
).annotations({
  identifier: "PropertyValueEntry",
}) as any as S.Schema<PropertyValueEntry>;
export type Entries = PropertyValueEntry[];
export const Entries = S.Array(PropertyValueEntry);
export type PropertyDefinitionsResponse = {
  [key: string]: PropertyDefinitionResponse;
};
export const PropertyDefinitionsResponse = S.Record({
  key: S.String,
  value: PropertyDefinitionResponse,
});
export type FunctionsResponse = { [key: string]: FunctionResponse };
export const FunctionsResponse = S.Record({
  key: S.String,
  value: FunctionResponse,
});
export type PropertyGroupsResponse = { [key: string]: PropertyGroupResponse };
export const PropertyGroupsResponse = S.Record({
  key: S.String,
  value: PropertyGroupResponse,
});
export type CompositeComponentTypesResponse = {
  [key: string]: CompositeComponentTypeResponse;
};
export const CompositeComponentTypesResponse = S.Record({
  key: S.String,
  value: CompositeComponentTypeResponse,
});
export interface ComponentTypeSummary {
  arn: string;
  componentTypeId: string;
  creationDateTime: Date;
  updateDateTime: Date;
  description?: string;
  status?: Status;
  componentTypeName?: string;
}
export const ComponentTypeSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    componentTypeId: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    status: S.optional(Status),
    componentTypeName: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentTypeSummary",
}) as any as S.Schema<ComponentTypeSummary>;
export type ComponentTypeSummaries = ComponentTypeSummary[];
export const ComponentTypeSummaries = S.Array(ComponentTypeSummary);
export interface EntitySummary {
  entityId: string;
  entityName: string;
  arn: string;
  parentEntityId?: string;
  status: Status;
  description?: string;
  hasChildEntities?: boolean;
  creationDateTime: Date;
  updateDateTime: Date;
}
export const EntitySummary = S.suspend(() =>
  S.Struct({
    entityId: S.String,
    entityName: S.String,
    arn: S.String,
    parentEntityId: S.optional(S.String),
    status: Status,
    description: S.optional(S.String),
    hasChildEntities: S.optional(S.Boolean),
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "EntitySummary",
}) as any as S.Schema<EntitySummary>;
export type EntitySummaries = EntitySummary[];
export const EntitySummaries = S.Array(EntitySummary);
export interface MetadataTransferJobSummary {
  metadataTransferJobId: string;
  arn: string;
  creationDateTime: Date;
  updateDateTime: Date;
  status: MetadataTransferJobStatus;
  progress?: MetadataTransferJobProgress;
}
export const MetadataTransferJobSummary = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String,
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: MetadataTransferJobStatus,
    progress: S.optional(MetadataTransferJobProgress),
  }),
).annotations({
  identifier: "MetadataTransferJobSummary",
}) as any as S.Schema<MetadataTransferJobSummary>;
export type MetadataTransferJobSummaries = MetadataTransferJobSummary[];
export const MetadataTransferJobSummaries = S.Array(MetadataTransferJobSummary);
export interface ComponentPropertyGroupResponse {
  groupType: string;
  propertyNames: PropertyNames;
  isInherited: boolean;
}
export const ComponentPropertyGroupResponse = S.suspend(() =>
  S.Struct({
    groupType: S.String,
    propertyNames: PropertyNames,
    isInherited: S.Boolean,
  }),
).annotations({
  identifier: "ComponentPropertyGroupResponse",
}) as any as S.Schema<ComponentPropertyGroupResponse>;
export type ComponentPropertyGroupResponses = {
  [key: string]: ComponentPropertyGroupResponse;
};
export const ComponentPropertyGroupResponses = S.Record({
  key: S.String,
  value: ComponentPropertyGroupResponse,
});
export interface ComponentSummary {
  componentName: string;
  componentTypeId: string;
  definedIn?: string;
  description?: string;
  propertyGroups?: ComponentPropertyGroupResponses;
  status: Status;
  syncSource?: string;
  componentPath?: string;
}
export const ComponentSummary = S.suspend(() =>
  S.Struct({
    componentName: S.String,
    componentTypeId: S.String,
    definedIn: S.optional(S.String),
    description: S.optional(S.String),
    propertyGroups: S.optional(ComponentPropertyGroupResponses),
    status: Status,
    syncSource: S.optional(S.String),
    componentPath: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentSummary",
}) as any as S.Schema<ComponentSummary>;
export type CompositeComponentResponse = { [key: string]: ComponentSummary };
export const CompositeComponentResponse = S.Record({
  key: S.String,
  value: ComponentSummary,
});
export interface BatchPutPropertyValuesRequest {
  workspaceId: string;
  entries: Entries;
}
export const BatchPutPropertyValuesRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entries: Entries,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/entity-properties",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutPropertyValuesRequest",
}) as any as S.Schema<BatchPutPropertyValuesRequest>;
export interface CancelMetadataTransferJobResponse {
  metadataTransferJobId: string;
  arn: string;
  updateDateTime: Date;
  status: MetadataTransferJobStatus;
  progress?: MetadataTransferJobProgress;
}
export const CancelMetadataTransferJobResponse = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String,
    arn: S.String,
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: MetadataTransferJobStatus,
    progress: S.optional(MetadataTransferJobProgress),
  }),
).annotations({
  identifier: "CancelMetadataTransferJobResponse",
}) as any as S.Schema<CancelMetadataTransferJobResponse>;
export interface GetComponentTypeResponse {
  workspaceId: string;
  isSingleton?: boolean;
  componentTypeId: string;
  description?: string;
  propertyDefinitions?: PropertyDefinitionsResponse;
  extendsFrom?: ExtendsFrom;
  functions?: FunctionsResponse;
  creationDateTime: Date;
  updateDateTime: Date;
  arn: string;
  isAbstract?: boolean;
  isSchemaInitialized?: boolean;
  status?: Status;
  propertyGroups?: PropertyGroupsResponse;
  syncSource?: string;
  componentTypeName?: string;
  compositeComponentTypes?: CompositeComponentTypesResponse;
}
export const GetComponentTypeResponse = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    isSingleton: S.optional(S.Boolean),
    componentTypeId: S.String,
    description: S.optional(S.String),
    propertyDefinitions: S.optional(PropertyDefinitionsResponse),
    extendsFrom: S.optional(ExtendsFrom),
    functions: S.optional(FunctionsResponse),
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    arn: S.String,
    isAbstract: S.optional(S.Boolean),
    isSchemaInitialized: S.optional(S.Boolean),
    status: S.optional(Status),
    propertyGroups: S.optional(PropertyGroupsResponse),
    syncSource: S.optional(S.String),
    componentTypeName: S.optional(S.String),
    compositeComponentTypes: S.optional(CompositeComponentTypesResponse),
  }),
).annotations({
  identifier: "GetComponentTypeResponse",
}) as any as S.Schema<GetComponentTypeResponse>;
export interface GetPropertyValueHistoryRequest {
  workspaceId: string;
  entityId?: string;
  componentName?: string;
  componentPath?: string;
  componentTypeId?: string;
  selectedProperties: SelectedPropertyList;
  propertyFilters?: PropertyFilters;
  startDateTime?: Date;
  endDateTime?: Date;
  interpolation?: InterpolationParameters;
  nextToken?: string;
  maxResults?: number;
  orderByTime?: string;
  startTime?: string;
  endTime?: string;
}
export const GetPropertyValueHistoryRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.optional(S.String),
    componentName: S.optional(S.String),
    componentPath: S.optional(S.String),
    componentTypeId: S.optional(S.String),
    selectedProperties: SelectedPropertyList,
    propertyFilters: S.optional(PropertyFilters),
    startDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    interpolation: S.optional(InterpolationParameters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    orderByTime: S.optional(S.String),
    startTime: S.optional(S.String),
    endTime: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/entity-properties/history",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPropertyValueHistoryRequest",
}) as any as S.Schema<GetPropertyValueHistoryRequest>;
export interface ListComponentTypesResponse {
  workspaceId: string;
  componentTypeSummaries: ComponentTypeSummaries;
  nextToken?: string;
  maxResults?: number;
}
export const ListComponentTypesResponse = S.suspend(() =>
  S.Struct({
    workspaceId: S.String,
    componentTypeSummaries: ComponentTypeSummaries,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListComponentTypesResponse",
}) as any as S.Schema<ListComponentTypesResponse>;
export interface ListEntitiesResponse {
  entitySummaries?: EntitySummaries;
  nextToken?: string;
}
export const ListEntitiesResponse = S.suspend(() =>
  S.Struct({
    entitySummaries: S.optional(EntitySummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntitiesResponse",
}) as any as S.Schema<ListEntitiesResponse>;
export interface ListMetadataTransferJobsResponse {
  metadataTransferJobSummaries: MetadataTransferJobSummaries;
  nextToken?: string;
}
export const ListMetadataTransferJobsResponse = S.suspend(() =>
  S.Struct({
    metadataTransferJobSummaries: MetadataTransferJobSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMetadataTransferJobsResponse",
}) as any as S.Schema<ListMetadataTransferJobsResponse>;
export interface UpdateEntityResponse {
  updateDateTime: Date;
  state: string;
}
export const UpdateEntityResponse = S.suspend(() =>
  S.Struct({
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    state: S.String,
  }),
).annotations({
  identifier: "UpdateEntityResponse",
}) as any as S.Schema<UpdateEntityResponse>;
export interface ComponentRequest {
  description?: string;
  componentTypeId?: string;
  properties?: PropertyRequests;
  propertyGroups?: ComponentPropertyGroupRequests;
}
export const ComponentRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    componentTypeId: S.optional(S.String),
    properties: S.optional(PropertyRequests),
    propertyGroups: S.optional(ComponentPropertyGroupRequests),
  }),
).annotations({
  identifier: "ComponentRequest",
}) as any as S.Schema<ComponentRequest>;
export interface SyncResourceStatus {
  state?: string;
  error?: ErrorDetails;
}
export const SyncResourceStatus = S.suspend(() =>
  S.Struct({ state: S.optional(S.String), error: S.optional(ErrorDetails) }),
).annotations({
  identifier: "SyncResourceStatus",
}) as any as S.Schema<SyncResourceStatus>;
export interface PropertyResponse {
  definition?: PropertyDefinitionResponse;
  value?: DataValue;
  areAllPropertyValuesReturned?: boolean;
}
export const PropertyResponse = S.suspend(() =>
  S.Struct({
    definition: S.optional(PropertyDefinitionResponse),
    value: S.optional(DataValue),
    areAllPropertyValuesReturned: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PropertyResponse",
}) as any as S.Schema<PropertyResponse>;
export type ComponentsMapRequest = { [key: string]: ComponentRequest };
export const ComponentsMapRequest = S.Record({
  key: S.String,
  value: ComponentRequest,
});
export type PropertyTableValue = { [key: string]: DataValue };
export const PropertyTableValue = S.Record({
  key: S.String,
  value: S.suspend((): S.Schema<DataValue, any> => DataValue).annotations({
    identifier: "DataValue",
  }),
});
export type TabularPropertyValue = PropertyTableValue[];
export const TabularPropertyValue = S.Array(PropertyTableValue);
export type TabularPropertyValues = TabularPropertyValue[];
export const TabularPropertyValues = S.Array(TabularPropertyValue);
export type ComponentSummaries = ComponentSummary[];
export const ComponentSummaries = S.Array(ComponentSummary);
export interface SyncResourceSummary {
  resourceType?: string;
  externalId?: string;
  resourceId?: string;
  status?: SyncResourceStatus;
  updateDateTime?: Date;
}
export const SyncResourceSummary = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    externalId: S.optional(S.String),
    resourceId: S.optional(S.String),
    status: S.optional(SyncResourceStatus),
    updateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SyncResourceSummary",
}) as any as S.Schema<SyncResourceSummary>;
export type SyncResourceSummaries = SyncResourceSummary[];
export const SyncResourceSummaries = S.Array(SyncResourceSummary);
export type PropertyResponses = { [key: string]: PropertyResponse };
export const PropertyResponses = S.Record({
  key: S.String,
  value: PropertyResponse,
});
export interface CreateComponentTypeRequest {
  workspaceId: string;
  isSingleton?: boolean;
  componentTypeId: string;
  description?: string;
  propertyDefinitions?: PropertyDefinitionsRequest;
  extendsFrom?: ExtendsFrom;
  functions?: FunctionsRequest;
  tags?: TagMap;
  propertyGroups?: PropertyGroupsRequest;
  componentTypeName?: string;
  compositeComponentTypes?: CompositeComponentTypesRequest;
}
export const CreateComponentTypeRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    isSingleton: S.optional(S.Boolean),
    componentTypeId: S.String.pipe(T.HttpLabel("componentTypeId")),
    description: S.optional(S.String),
    propertyDefinitions: S.optional(PropertyDefinitionsRequest),
    extendsFrom: S.optional(ExtendsFrom),
    functions: S.optional(FunctionsRequest),
    tags: S.optional(TagMap),
    propertyGroups: S.optional(PropertyGroupsRequest),
    componentTypeName: S.optional(S.String),
    compositeComponentTypes: S.optional(CompositeComponentTypesRequest),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workspaces/{workspaceId}/component-types/{componentTypeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateComponentTypeRequest",
}) as any as S.Schema<CreateComponentTypeRequest>;
export interface CreateEntityRequest {
  workspaceId: string;
  entityId?: string;
  entityName: string;
  description?: string;
  components?: ComponentsMapRequest;
  compositeComponents?: CompositeComponentsMapRequest;
  parentEntityId?: string;
  tags?: TagMap;
}
export const CreateEntityRequest = S.suspend(() =>
  S.Struct({
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    entityId: S.optional(S.String),
    entityName: S.String,
    description: S.optional(S.String),
    components: S.optional(ComponentsMapRequest),
    compositeComponents: S.optional(CompositeComponentsMapRequest),
    parentEntityId: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/entities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEntityRequest",
}) as any as S.Schema<CreateEntityRequest>;
export interface CreateMetadataTransferJobRequest {
  metadataTransferJobId?: string;
  description?: string;
  sources: SourceConfigurations;
  destination: DestinationConfiguration;
}
export const CreateMetadataTransferJobRequest = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.optional(S.String),
    description: S.optional(S.String),
    sources: SourceConfigurations,
    destination: DestinationConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/metadata-transfer-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMetadataTransferJobRequest",
}) as any as S.Schema<CreateMetadataTransferJobRequest>;
export interface ListComponentsResponse {
  componentSummaries: ComponentSummaries;
  nextToken?: string;
}
export const ListComponentsResponse = S.suspend(() =>
  S.Struct({
    componentSummaries: ComponentSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentsResponse",
}) as any as S.Schema<ListComponentsResponse>;
export interface ListSyncResourcesResponse {
  syncResources?: SyncResourceSummaries;
  nextToken?: string;
}
export const ListSyncResourcesResponse = S.suspend(() =>
  S.Struct({
    syncResources: S.optional(SyncResourceSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSyncResourcesResponse",
}) as any as S.Schema<ListSyncResourcesResponse>;
export interface ComponentResponse {
  componentName?: string;
  description?: string;
  componentTypeId?: string;
  status?: Status;
  definedIn?: string;
  properties?: PropertyResponses;
  propertyGroups?: ComponentPropertyGroupResponses;
  syncSource?: string;
  areAllPropertiesReturned?: boolean;
  compositeComponents?: CompositeComponentResponse;
  areAllCompositeComponentsReturned?: boolean;
}
export const ComponentResponse = S.suspend(() =>
  S.Struct({
    componentName: S.optional(S.String),
    description: S.optional(S.String),
    componentTypeId: S.optional(S.String),
    status: S.optional(Status),
    definedIn: S.optional(S.String),
    properties: S.optional(PropertyResponses),
    propertyGroups: S.optional(ComponentPropertyGroupResponses),
    syncSource: S.optional(S.String),
    areAllPropertiesReturned: S.optional(S.Boolean),
    compositeComponents: S.optional(CompositeComponentResponse),
    areAllCompositeComponentsReturned: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ComponentResponse",
}) as any as S.Schema<ComponentResponse>;
export interface PropertyLatestValue {
  propertyReference: EntityPropertyReference;
  propertyValue?: DataValue;
}
export const PropertyLatestValue = S.suspend(() =>
  S.Struct({
    propertyReference: EntityPropertyReference,
    propertyValue: S.optional(DataValue),
  }),
).annotations({
  identifier: "PropertyLatestValue",
}) as any as S.Schema<PropertyLatestValue>;
export type Values = PropertyValue[];
export const Values = S.Array(PropertyValue);
export type ComponentsMap = { [key: string]: ComponentResponse };
export const ComponentsMap = S.Record({
  key: S.String,
  value: ComponentResponse,
});
export type PropertyLatestValueMap = { [key: string]: PropertyLatestValue };
export const PropertyLatestValueMap = S.Record({
  key: S.String,
  value: PropertyLatestValue,
});
export interface PropertyValueHistory {
  entityPropertyReference: EntityPropertyReference;
  values?: Values;
}
export const PropertyValueHistory = S.suspend(() =>
  S.Struct({
    entityPropertyReference: EntityPropertyReference,
    values: S.optional(Values),
  }),
).annotations({
  identifier: "PropertyValueHistory",
}) as any as S.Schema<PropertyValueHistory>;
export type PropertyValueList = PropertyValueHistory[];
export const PropertyValueList = S.Array(PropertyValueHistory);
export interface CreateComponentTypeResponse {
  arn: string;
  creationDateTime: Date;
  state: string;
}
export const CreateComponentTypeResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    state: S.String,
  }),
).annotations({
  identifier: "CreateComponentTypeResponse",
}) as any as S.Schema<CreateComponentTypeResponse>;
export interface CreateEntityResponse {
  entityId: string;
  arn: string;
  creationDateTime: Date;
  state: string;
}
export const CreateEntityResponse = S.suspend(() =>
  S.Struct({
    entityId: S.String,
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    state: S.String,
  }),
).annotations({
  identifier: "CreateEntityResponse",
}) as any as S.Schema<CreateEntityResponse>;
export interface CreateMetadataTransferJobResponse {
  metadataTransferJobId: string;
  arn: string;
  creationDateTime: Date;
  status: MetadataTransferJobStatus;
}
export const CreateMetadataTransferJobResponse = S.suspend(() =>
  S.Struct({
    metadataTransferJobId: S.String,
    arn: S.String,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: MetadataTransferJobStatus,
  }),
).annotations({
  identifier: "CreateMetadataTransferJobResponse",
}) as any as S.Schema<CreateMetadataTransferJobResponse>;
export interface GetEntityResponse {
  entityId: string;
  entityName: string;
  arn: string;
  status: Status;
  workspaceId: string;
  description?: string;
  components?: ComponentsMap;
  parentEntityId: string;
  hasChildEntities: boolean;
  creationDateTime: Date;
  updateDateTime: Date;
  syncSource?: string;
  areAllComponentsReturned?: boolean;
}
export const GetEntityResponse = S.suspend(() =>
  S.Struct({
    entityId: S.String,
    entityName: S.String,
    arn: S.String,
    status: Status,
    workspaceId: S.String,
    description: S.optional(S.String),
    components: S.optional(ComponentsMap),
    parentEntityId: S.String,
    hasChildEntities: S.Boolean,
    creationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    syncSource: S.optional(S.String),
    areAllComponentsReturned: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetEntityResponse",
}) as any as S.Schema<GetEntityResponse>;
export interface GetPropertyValueResponse {
  propertyValues?: PropertyLatestValueMap;
  nextToken?: string;
  tabularPropertyValues?: TabularPropertyValues;
}
export const GetPropertyValueResponse = S.suspend(() =>
  S.Struct({
    propertyValues: S.optional(PropertyLatestValueMap),
    nextToken: S.optional(S.String),
    tabularPropertyValues: S.optional(TabularPropertyValues),
  }),
).annotations({
  identifier: "GetPropertyValueResponse",
}) as any as S.Schema<GetPropertyValueResponse>;
export interface GetPropertyValueHistoryResponse {
  propertyValues: PropertyValueList;
  nextToken?: string;
}
export const GetPropertyValueHistoryResponse = S.suspend(() =>
  S.Struct({
    propertyValues: PropertyValueList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPropertyValueHistoryResponse",
}) as any as S.Schema<GetPropertyValueHistoryResponse>;
export interface BatchPutPropertyError {
  errorCode: string;
  errorMessage: string;
  entry: PropertyValueEntry;
}
export const BatchPutPropertyError = S.suspend(() =>
  S.Struct({
    errorCode: S.String,
    errorMessage: S.String,
    entry: PropertyValueEntry,
  }),
).annotations({
  identifier: "BatchPutPropertyError",
}) as any as S.Schema<BatchPutPropertyError>;
export type Errors = BatchPutPropertyError[];
export const Errors = S.Array(BatchPutPropertyError);
export interface BatchPutPropertyErrorEntry {
  errors: Errors;
}
export const BatchPutPropertyErrorEntry = S.suspend(() =>
  S.Struct({ errors: Errors }),
).annotations({
  identifier: "BatchPutPropertyErrorEntry",
}) as any as S.Schema<BatchPutPropertyErrorEntry>;
export type ErrorEntries = BatchPutPropertyErrorEntry[];
export const ErrorEntries = S.Array(BatchPutPropertyErrorEntry);
export interface BatchPutPropertyValuesResponse {
  errorEntries: ErrorEntries;
}
export const BatchPutPropertyValuesResponse = S.suspend(() =>
  S.Struct({ errorEntries: ErrorEntries }),
).annotations({
  identifier: "BatchPutPropertyValuesResponse",
}) as any as S.Schema<BatchPutPropertyValuesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class QueryTimeoutException extends S.TaggedError<QueryTimeoutException>()(
  "QueryTimeoutException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConnectorFailureException extends S.TaggedError<ConnectorFailureException>()(
  "ConnectorFailureException",
  { message: S.optional(S.String) },
) {}
export class ConnectorTimeoutException extends S.TaggedError<ConnectorTimeoutException>()(
  "ConnectorTimeoutException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists all tags associated with a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Adds tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Gets the pricing plan.
 */
export const getPricingPlan: (
  input: GetPricingPlanRequest,
) => Effect.Effect<
  GetPricingPlanResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPricingPlanRequest,
  output: GetPricingPlanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API lists the components of an entity.
 */
export const listComponents: {
  (
    input: ListComponentsRequest,
  ): Effect.Effect<
    ListComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    ListComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsRequest,
  output: ListComponentsResponse,
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
}));
/**
 * Lists the sync resources.
 */
export const listSyncResources: {
  (
    input: ListSyncResourcesRequest,
  ): Effect.Effect<
    ListSyncResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSyncResourcesRequest,
  ) => Stream.Stream<
    ListSyncResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSyncResourcesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSyncResourcesRequest,
  output: ListSyncResourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
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
 * Lists all component types in a workspace.
 */
export const listComponentTypes: {
  (
    input: ListComponentTypesRequest,
  ): Effect.Effect<
    ListComponentTypesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentTypesRequest,
  ) => Stream.Stream<
    ListComponentTypesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentTypesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentTypesRequest,
  output: ListComponentTypesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
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
 * Lists the metadata transfer jobs.
 */
export const listMetadataTransferJobs: {
  (
    input: ListMetadataTransferJobsRequest,
  ): Effect.Effect<
    ListMetadataTransferJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetadataTransferJobsRequest,
  ) => Stream.Stream<
    ListMetadataTransferJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMetadataTransferJobsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetadataTransferJobsRequest,
  output: ListMetadataTransferJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
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
 * List all SyncJobs.
 */
export const listSyncJobs: {
  (
    input: ListSyncJobsRequest,
  ): Effect.Effect<
    ListSyncJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSyncJobsRequest,
  ) => Stream.Stream<
    ListSyncJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSyncJobsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSyncJobsRequest,
  output: ListSyncJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
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
 * Updates an entity.
 */
export const updateEntity: (
  input: UpdateEntityRequest,
) => Effect.Effect<
  UpdateEntityResponse,
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
  input: UpdateEntityRequest,
  output: UpdateEntityResponse,
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
 * Lists all scenes in a workspace.
 */
export const listScenes: {
  (
    input: ListScenesRequest,
  ): Effect.Effect<
    ListScenesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScenesRequest,
  ) => Stream.Stream<
    ListScenesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScenesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScenesRequest,
  output: ListScenesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
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
 * Deletes a scene.
 */
export const deleteScene: (
  input: DeleteSceneRequest,
) => Effect.Effect<
  DeleteSceneResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSceneRequest,
  output: DeleteSceneResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a workspace.
 */
export const deleteWorkspace: (
  input: DeleteWorkspaceRequest,
) => Effect.Effect<
  DeleteWorkspaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkspaceRequest,
  output: DeleteWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a nmetadata transfer job.
 */
export const getMetadataTransferJob: (
  input: GetMetadataTransferJobRequest,
) => Effect.Effect<
  GetMetadataTransferJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMetadataTransferJobRequest,
  output: GetMetadataTransferJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the pricing plan.
 */
export const updatePricingPlan: (
  input: UpdatePricingPlanRequest,
) => Effect.Effect<
  UpdatePricingPlanResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePricingPlanRequest,
  output: UpdatePricingPlanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a scene.
 */
export const updateScene: (
  input: UpdateSceneRequest,
) => Effect.Effect<
  UpdateSceneResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSceneRequest,
  output: UpdateSceneResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a component type.
 */
export const deleteComponentType: (
  input: DeleteComponentTypeRequest,
) => Effect.Effect<
  DeleteComponentTypeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentTypeRequest,
  output: DeleteComponentTypeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a scene.
 */
export const getScene: (
  input: GetSceneRequest,
) => Effect.Effect<
  GetSceneResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSceneRequest,
  output: GetSceneResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This API lists the properties of a component.
 */
export const listProperties: {
  (
    input: ListPropertiesRequest,
  ): Effect.Effect<
    ListPropertiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPropertiesRequest,
  ) => Stream.Stream<
    ListPropertiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPropertiesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPropertiesRequest,
  output: ListPropertiesResponse,
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
}));
/**
 * Cancels the metadata transfer job.
 */
export const cancelMetadataTransferJob: (
  input: CancelMetadataTransferJobRequest,
) => Effect.Effect<
  CancelMetadataTransferJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMetadataTransferJobRequest,
  output: CancelMetadataTransferJobResponse,
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
 * Retrieves information about a component type.
 */
export const getComponentType: (
  input: GetComponentTypeRequest,
) => Effect.Effect<
  GetComponentTypeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentTypeRequest,
  output: GetComponentTypeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about workspaces in the current account.
 */
export const listWorkspaces: {
  (
    input: ListWorkspacesRequest,
  ): Effect.Effect<
    ListWorkspacesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkspacesRequest,
  ) => Stream.Stream<
    ListWorkspacesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkspacesRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkspacesRequest,
  output: ListWorkspacesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
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
 * Delete the SyncJob.
 */
export const deleteSyncJob: (
  input: DeleteSyncJobRequest,
) => Effect.Effect<
  DeleteSyncJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSyncJobRequest,
  output: DeleteSyncJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a workspace.
 */
export const getWorkspace: (
  input: GetWorkspaceRequest,
) => Effect.Effect<
  GetWorkspaceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkspaceRequest,
  output: GetWorkspaceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates information in a component type.
 */
export const updateComponentType: (
  input: UpdateComponentTypeRequest,
) => Effect.Effect<
  UpdateComponentTypeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentTypeRequest,
  output: UpdateComponentTypeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a workspace.
 */
export const updateWorkspace: (
  input: UpdateWorkspaceRequest,
) => Effect.Effect<
  UpdateWorkspaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkspaceRequest,
  output: UpdateWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This action creates a SyncJob.
 */
export const createSyncJob: (
  input: CreateSyncJobRequest,
) => Effect.Effect<
  CreateSyncJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSyncJobRequest,
  output: CreateSyncJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an entity.
 */
export const deleteEntity: (
  input: DeleteEntityRequest,
) => Effect.Effect<
  DeleteEntityResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEntityRequest,
  output: DeleteEntityResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the SyncJob.
 */
export const getSyncJob: (
  input: GetSyncJobRequest,
) => Effect.Effect<
  GetSyncJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSyncJobRequest,
  output: GetSyncJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a workplace.
 */
export const createWorkspace: (
  input: CreateWorkspaceRequest,
) => Effect.Effect<
  CreateWorkspaceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkspaceRequest,
  output: CreateWorkspaceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a scene.
 */
export const createScene: (
  input: CreateSceneRequest,
) => Effect.Effect<
  CreateSceneResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSceneRequest,
  output: CreateSceneResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Run queries to access information from your knowledge graph of entities within
 * individual workspaces.
 *
 * The ExecuteQuery action only works with Amazon Web Services Java SDK2.
 * ExecuteQuery will not work with any Amazon Web Services Java SDK version < 2.x.
 */
export const executeQuery: {
  (
    input: ExecuteQueryRequest,
  ): Effect.Effect<
    ExecuteQueryResponse,
    | AccessDeniedException
    | InternalServerException
    | QueryTimeoutException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ExecuteQueryRequest,
  ) => Stream.Stream<
    ExecuteQueryResponse,
    | AccessDeniedException
    | InternalServerException
    | QueryTimeoutException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ExecuteQueryRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | QueryTimeoutException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ExecuteQueryRequest,
  output: ExecuteQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    QueryTimeoutException,
    ServiceQuotaExceededException,
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
 * Lists all entities in a workspace.
 */
export const listEntities: {
  (
    input: ListEntitiesRequest,
  ): Effect.Effect<
    ListEntitiesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntitiesRequest,
  ) => Stream.Stream<
    ListEntitiesResponse,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntitiesRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEntitiesRequest,
  output: ListEntitiesResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
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
 * Creates a component type.
 */
export const createComponentType: (
  input: CreateComponentTypeRequest,
) => Effect.Effect<
  CreateComponentTypeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentTypeRequest,
  output: CreateComponentTypeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an entity.
 */
export const createEntity: (
  input: CreateEntityRequest,
) => Effect.Effect<
  CreateEntityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEntityRequest,
  output: CreateEntityResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new metadata transfer job.
 */
export const createMetadataTransferJob: (
  input: CreateMetadataTransferJobRequest,
) => Effect.Effect<
  CreateMetadataTransferJobResponse,
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
  input: CreateMetadataTransferJobRequest,
  output: CreateMetadataTransferJobResponse,
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
 * Retrieves information about an entity.
 */
export const getEntity: (
  input: GetEntityRequest,
) => Effect.Effect<
  GetEntityResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEntityRequest,
  output: GetEntityResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets values for multiple time series properties.
 */
export const batchPutPropertyValues: (
  input: BatchPutPropertyValuesRequest,
) => Effect.Effect<
  BatchPutPropertyValuesResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutPropertyValuesRequest,
  output: BatchPutPropertyValuesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the property values for a component, component type, entity, or workspace.
 *
 * You must specify a value for either `componentName`,
 * `componentTypeId`, `entityId`, or `workspaceId`.
 */
export const getPropertyValue: {
  (
    input: GetPropertyValueRequest,
  ): Effect.Effect<
    GetPropertyValueResponse,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetPropertyValueRequest,
  ) => Stream.Stream<
    GetPropertyValueResponse,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetPropertyValueRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPropertyValueRequest,
  output: GetPropertyValueResponse,
  errors: [
    AccessDeniedException,
    ConnectorFailureException,
    ConnectorTimeoutException,
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
}));
/**
 * Retrieves information about the history of a time series property value for a component,
 * component type, entity, or workspace.
 *
 * You must specify a value for `workspaceId`. For entity-specific queries,
 * specify values for `componentName` and `entityId`. For cross-entity
 * quries, specify a value for `componentTypeId`.
 */
export const getPropertyValueHistory: {
  (
    input: GetPropertyValueHistoryRequest,
  ): Effect.Effect<
    GetPropertyValueHistoryResponse,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    GetPropertyValueHistoryResponse,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | ConnectorFailureException
    | ConnectorTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPropertyValueHistoryRequest,
  output: GetPropertyValueHistoryResponse,
  errors: [
    AccessDeniedException,
    ConnectorFailureException,
    ConnectorTimeoutException,
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
}));

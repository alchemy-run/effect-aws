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
  sdkId: "IoTSiteWise",
  serviceShapeName: "AWSIoTSiteWise",
});
const auth = T.AwsAuthSigv4({ name: "iotsitewise" });
const ver = T.ServiceVersion("2019-12-02");
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
              `https://iotsitewise-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iotsitewise-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iotsitewise.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://iotsitewise.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CustomID = string;
export type ClientToken = string;
export type PropertyAlias = string;
export type ID = string;
export type NextToken = string;
export type BatchGetAssetPropertyAggregatesMaxResults = number;
export type BatchGetAssetPropertyValueHistoryMaxResults = number;
export type Name = string;
export type ExternalId = string;
export type Description = string;
export type ETag = string;
export type SelectAll = string;
export type ARN = string;
export type RestrictedName = string;
export type RestrictedDescription = string;
export type DashboardDefinition = string;
export type GatewayName = string;
export type GatewayVersion = string;
export type Email = string | Redacted.Redacted<string>;
export type IamArn = string;
export type AssetModelVersionFilter = string;
export type ComputationModelVersionFilter = string;
export type CapabilityNamespace = string;
export type QueryStatement = string;
export type ExecuteQueryNextToken = string;
export type ExecuteQueryMaxResults = number;
export type AssetPropertyAlias = string;
export type Resolution = string;
export type GetAssetPropertyValueAggregatesMaxResults = number;
export type GetAssetPropertyValueHistoryMaxResults = number;
export type TimeInSeconds = number;
export type OffsetInNanos = number;
export type IntervalInSeconds = number;
export type MaxInterpolatedResults = number;
export type InterpolationType = string;
export type IntervalWindowInSeconds = number;
export type ConversationId = string;
export type MessageInput = string | Redacted.Redacted<string>;
export type IdentityId = string;
export type MaxResults = number;
export type AmazonResourceName = string;
export type KmsKeyId = string;
export type TagKey = string;
export type PropertyUnit = string;
export type CapabilityConfiguration = string;
export type EntryId = string;
export type TagValue = string;
export type Bucket = string;
export type ComputationModelDataBindingVariable = string;
export type PortalTypeKey = string;
export type NumberOfDays = number;
export type ActionPayloadString = string;
export type ErrorMessage = string;
export type ResourceId = string;
export type ResourceArn = string;
export type Version = string;
export type PortalClientId = string;
export type Url = string;
export type TimeSeriesId = string;
export type InputProperties = string;
export type ResultProperty = string;
export type CoreDeviceThingName = string;
export type IotCoreThingName = string;
export type AssetErrorMessage = string;
export type ComputationModelExecutionSummaryKey = string;
export type ComputationModelExecutionSummaryValue = string;
export type ExecutionResultKey = string;
export type ExecutionResultValue = string;
export type ExecutionDetailsKey = string;
export type ExecutionDetailsValue = string;
export type PropertyValueStringValue = string;
export type PropertyValueIntegerValue = number;
export type PropertyValueDoubleValue = number;
export type DefaultValue = string;
export type Expression = string;
export type MonitorErrorMessage = string;
export type PropertyNotificationTopic = string;
export type ScalarValue = string;
export type AggregatedDoubleValue = number;
export type VariableName = string;
export type DetailedErrorMessage = string;
export type Macro = string;
export type Interval = string;
export type Offset = string;
export type SSOApplicationId = string;
export type ExceptionMessage = string;

//# Schemas
export interface DescribeDefaultEncryptionConfigurationRequest {}
export const DescribeDefaultEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configuration/account/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDefaultEncryptionConfigurationRequest",
}) as any as S.Schema<DescribeDefaultEncryptionConfigurationRequest>;
export interface DescribeLoggingOptionsRequest {}
export const DescribeLoggingOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoggingOptionsRequest",
}) as any as S.Schema<DescribeLoggingOptionsRequest>;
export interface DescribeStorageConfigurationRequest {}
export const DescribeStorageConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configuration/account/storage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStorageConfigurationRequest",
}) as any as S.Schema<DescribeStorageConfigurationRequest>;
export type IDs = string[];
export const IDs = S.Array(S.String);
export type AggregateTypes = string[];
export const AggregateTypes = S.Array(S.String);
export type Qualities = string[];
export const Qualities = S.Array(S.String);
export type ListAssetModelsTypeFilter = string[];
export const ListAssetModelsTypeFilter = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateAssetsRequest {
  assetId: string;
  hierarchyId: string;
  childAssetId: string;
  clientToken?: string;
}
export const AssociateAssetsRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    hierarchyId: S.String,
    childAssetId: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assets/{assetId}/associate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAssetsRequest",
}) as any as S.Schema<AssociateAssetsRequest>;
export interface AssociateAssetsResponse {}
export const AssociateAssetsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateAssetsResponse",
}) as any as S.Schema<AssociateAssetsResponse>;
export interface AssociateTimeSeriesToAssetPropertyRequest {
  alias: string;
  assetId: string;
  propertyId: string;
  clientToken?: string;
}
export const AssociateTimeSeriesToAssetPropertyRequest = S.suspend(() =>
  S.Struct({
    alias: S.String.pipe(T.HttpQuery("alias")),
    assetId: S.String.pipe(T.HttpQuery("assetId")),
    propertyId: S.String.pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/timeseries/associate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateTimeSeriesToAssetPropertyRequest",
}) as any as S.Schema<AssociateTimeSeriesToAssetPropertyRequest>;
export interface AssociateTimeSeriesToAssetPropertyResponse {}
export const AssociateTimeSeriesToAssetPropertyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateTimeSeriesToAssetPropertyResponse",
}) as any as S.Schema<AssociateTimeSeriesToAssetPropertyResponse>;
export interface BatchAssociateProjectAssetsRequest {
  projectId: string;
  assetIds: IDs;
  clientToken?: string;
}
export const BatchAssociateProjectAssetsRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpLabel("projectId")),
    assetIds: IDs,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects/{projectId}/assets/associate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAssociateProjectAssetsRequest",
}) as any as S.Schema<BatchAssociateProjectAssetsRequest>;
export interface BatchDisassociateProjectAssetsRequest {
  projectId: string;
  assetIds: IDs;
  clientToken?: string;
}
export const BatchDisassociateProjectAssetsRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpLabel("projectId")),
    assetIds: IDs,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{projectId}/assets/disassociate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDisassociateProjectAssetsRequest",
}) as any as S.Schema<BatchDisassociateProjectAssetsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateAssetRequest {
  assetName: string;
  assetModelId: string;
  assetId?: string;
  assetExternalId?: string;
  clientToken?: string;
  tags?: TagMap;
  assetDescription?: string;
}
export const CreateAssetRequest = S.suspend(() =>
  S.Struct({
    assetName: S.String,
    assetModelId: S.String,
    assetId: S.optional(S.String),
    assetExternalId: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
    assetDescription: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetRequest",
}) as any as S.Schema<CreateAssetRequest>;
export interface Attribute {
  defaultValue?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ defaultValue: S.optional(S.String) }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export interface ForwardingConfig {
  state: string;
}
export const ForwardingConfig = S.suspend(() =>
  S.Struct({ state: S.String }),
).annotations({
  identifier: "ForwardingConfig",
}) as any as S.Schema<ForwardingConfig>;
export interface MeasurementProcessingConfig {
  forwardingConfig: ForwardingConfig;
}
export const MeasurementProcessingConfig = S.suspend(() =>
  S.Struct({ forwardingConfig: ForwardingConfig }),
).annotations({
  identifier: "MeasurementProcessingConfig",
}) as any as S.Schema<MeasurementProcessingConfig>;
export interface Measurement {
  processingConfig?: MeasurementProcessingConfig;
}
export const Measurement = S.suspend(() =>
  S.Struct({ processingConfig: S.optional(MeasurementProcessingConfig) }),
).annotations({ identifier: "Measurement" }) as any as S.Schema<Measurement>;
export interface AssetModelPropertyPathSegment {
  id?: string;
  name?: string;
}
export const AssetModelPropertyPathSegment = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "AssetModelPropertyPathSegment",
}) as any as S.Schema<AssetModelPropertyPathSegment>;
export type AssetModelPropertyPath = AssetModelPropertyPathSegment[];
export const AssetModelPropertyPath = S.Array(AssetModelPropertyPathSegment);
export interface VariableValue {
  propertyId?: string;
  hierarchyId?: string;
  propertyPath?: AssetModelPropertyPath;
}
export const VariableValue = S.suspend(() =>
  S.Struct({
    propertyId: S.optional(S.String),
    hierarchyId: S.optional(S.String),
    propertyPath: S.optional(AssetModelPropertyPath),
  }),
).annotations({
  identifier: "VariableValue",
}) as any as S.Schema<VariableValue>;
export interface ExpressionVariable {
  name: string;
  value: VariableValue;
}
export const ExpressionVariable = S.suspend(() =>
  S.Struct({ name: S.String, value: VariableValue }),
).annotations({
  identifier: "ExpressionVariable",
}) as any as S.Schema<ExpressionVariable>;
export type ExpressionVariables = ExpressionVariable[];
export const ExpressionVariables = S.Array(ExpressionVariable);
export interface TransformProcessingConfig {
  computeLocation: string;
  forwardingConfig?: ForwardingConfig;
}
export const TransformProcessingConfig = S.suspend(() =>
  S.Struct({
    computeLocation: S.String,
    forwardingConfig: S.optional(ForwardingConfig),
  }),
).annotations({
  identifier: "TransformProcessingConfig",
}) as any as S.Schema<TransformProcessingConfig>;
export interface Transform {
  expression: string;
  variables: ExpressionVariables;
  processingConfig?: TransformProcessingConfig;
}
export const Transform = S.suspend(() =>
  S.Struct({
    expression: S.String,
    variables: ExpressionVariables,
    processingConfig: S.optional(TransformProcessingConfig),
  }),
).annotations({ identifier: "Transform" }) as any as S.Schema<Transform>;
export interface TumblingWindow {
  interval: string;
  offset?: string;
}
export const TumblingWindow = S.suspend(() =>
  S.Struct({ interval: S.String, offset: S.optional(S.String) }),
).annotations({
  identifier: "TumblingWindow",
}) as any as S.Schema<TumblingWindow>;
export interface MetricWindow {
  tumbling?: TumblingWindow;
}
export const MetricWindow = S.suspend(() =>
  S.Struct({ tumbling: S.optional(TumblingWindow) }),
).annotations({ identifier: "MetricWindow" }) as any as S.Schema<MetricWindow>;
export interface MetricProcessingConfig {
  computeLocation: string;
}
export const MetricProcessingConfig = S.suspend(() =>
  S.Struct({ computeLocation: S.String }),
).annotations({
  identifier: "MetricProcessingConfig",
}) as any as S.Schema<MetricProcessingConfig>;
export interface Metric {
  expression?: string;
  variables?: ExpressionVariables;
  window: MetricWindow;
  processingConfig?: MetricProcessingConfig;
}
export const Metric = S.suspend(() =>
  S.Struct({
    expression: S.optional(S.String),
    variables: S.optional(ExpressionVariables),
    window: MetricWindow,
    processingConfig: S.optional(MetricProcessingConfig),
  }),
).annotations({ identifier: "Metric" }) as any as S.Schema<Metric>;
export interface PropertyType {
  attribute?: Attribute;
  measurement?: Measurement;
  transform?: Transform;
  metric?: Metric;
}
export const PropertyType = S.suspend(() =>
  S.Struct({
    attribute: S.optional(Attribute),
    measurement: S.optional(Measurement),
    transform: S.optional(Transform),
    metric: S.optional(Metric),
  }),
).annotations({ identifier: "PropertyType" }) as any as S.Schema<PropertyType>;
export interface AssetModelPropertyDefinition {
  id?: string;
  externalId?: string;
  name: string;
  dataType: string;
  dataTypeSpec?: string;
  unit?: string;
  type: PropertyType;
}
export const AssetModelPropertyDefinition = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    unit: S.optional(S.String),
    type: PropertyType,
  }),
).annotations({
  identifier: "AssetModelPropertyDefinition",
}) as any as S.Schema<AssetModelPropertyDefinition>;
export type AssetModelPropertyDefinitions = AssetModelPropertyDefinition[];
export const AssetModelPropertyDefinitions = S.Array(
  AssetModelPropertyDefinition,
);
export interface CreateAssetModelCompositeModelRequest {
  assetModelId: string;
  assetModelCompositeModelExternalId?: string;
  parentAssetModelCompositeModelId?: string;
  assetModelCompositeModelId?: string;
  assetModelCompositeModelDescription?: string;
  assetModelCompositeModelName: string;
  assetModelCompositeModelType: string;
  clientToken?: string;
  composedAssetModelId?: string;
  assetModelCompositeModelProperties?: AssetModelPropertyDefinitions;
  ifMatch?: string;
  ifNoneMatch?: string;
  matchForVersionType?: string;
}
export const CreateAssetModelCompositeModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    assetModelCompositeModelExternalId: S.optional(S.String),
    parentAssetModelCompositeModelId: S.optional(S.String),
    assetModelCompositeModelId: S.optional(S.String),
    assetModelCompositeModelDescription: S.optional(S.String),
    assetModelCompositeModelName: S.String,
    assetModelCompositeModelType: S.String,
    clientToken: S.optional(S.String),
    composedAssetModelId: S.optional(S.String),
    assetModelCompositeModelProperties: S.optional(
      AssetModelPropertyDefinitions,
    ),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/asset-models/{assetModelId}/composite-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetModelCompositeModelRequest",
}) as any as S.Schema<CreateAssetModelCompositeModelRequest>;
export interface CreateDashboardRequest {
  projectId: string;
  dashboardName: string;
  dashboardDescription?: string;
  dashboardDefinition: string;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateDashboardRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    dashboardName: S.String,
    dashboardDescription: S.optional(S.String),
    dashboardDefinition: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/dashboards" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDashboardRequest",
}) as any as S.Schema<CreateDashboardRequest>;
export interface CreateProjectRequest {
  portalId: string;
  projectName: string;
  projectDescription?: string;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateProjectRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String,
    projectName: S.String,
    projectDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectRequest",
}) as any as S.Schema<CreateProjectRequest>;
export interface DeleteAccessPolicyRequest {
  accessPolicyId: string;
  clientToken?: string;
}
export const DeleteAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    accessPolicyId: S.String.pipe(T.HttpLabel("accessPolicyId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/access-policies/{accessPolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessPolicyRequest",
}) as any as S.Schema<DeleteAccessPolicyRequest>;
export interface DeleteAccessPolicyResponse {}
export const DeleteAccessPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessPolicyResponse",
}) as any as S.Schema<DeleteAccessPolicyResponse>;
export interface DeleteAssetRequest {
  assetId: string;
  clientToken?: string;
}
export const DeleteAssetRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assets/{assetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetRequest",
}) as any as S.Schema<DeleteAssetRequest>;
export interface DeleteAssetModelRequest {
  assetModelId: string;
  clientToken?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
  matchForVersionType?: string;
}
export const DeleteAssetModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/asset-models/{assetModelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetModelRequest",
}) as any as S.Schema<DeleteAssetModelRequest>;
export interface DeleteAssetModelCompositeModelRequest {
  assetModelId: string;
  assetModelCompositeModelId: string;
  clientToken?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
  matchForVersionType?: string;
}
export const DeleteAssetModelCompositeModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    assetModelCompositeModelId: S.String.pipe(
      T.HttpLabel("assetModelCompositeModelId"),
    ),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetModelCompositeModelRequest",
}) as any as S.Schema<DeleteAssetModelCompositeModelRequest>;
export interface DeleteAssetModelInterfaceRelationshipRequest {
  assetModelId: string;
  interfaceAssetModelId: string;
  clientToken?: string;
}
export const DeleteAssetModelInterfaceRelationshipRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel("interfaceAssetModelId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetModelInterfaceRelationshipRequest",
}) as any as S.Schema<DeleteAssetModelInterfaceRelationshipRequest>;
export interface DeleteComputationModelRequest {
  computationModelId: string;
  clientToken?: string;
}
export const DeleteComputationModelRequest = S.suspend(() =>
  S.Struct({
    computationModelId: S.String.pipe(T.HttpLabel("computationModelId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/computation-models/{computationModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteComputationModelRequest",
}) as any as S.Schema<DeleteComputationModelRequest>;
export interface DeleteDashboardRequest {
  dashboardId: string;
  clientToken?: string;
}
export const DeleteDashboardRequest = S.suspend(() =>
  S.Struct({
    dashboardId: S.String.pipe(T.HttpLabel("dashboardId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/dashboards/{dashboardId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDashboardRequest",
}) as any as S.Schema<DeleteDashboardRequest>;
export interface DeleteDashboardResponse {}
export const DeleteDashboardResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDashboardResponse",
}) as any as S.Schema<DeleteDashboardResponse>;
export interface DeleteDatasetRequest {
  datasetId: string;
  clientToken?: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datasets/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteGatewayRequest {
  gatewayId: string;
}
export const DeleteGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/20200301/gateways/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGatewayRequest",
}) as any as S.Schema<DeleteGatewayRequest>;
export interface DeleteGatewayResponse {}
export const DeleteGatewayResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGatewayResponse",
}) as any as S.Schema<DeleteGatewayResponse>;
export interface DeletePortalRequest {
  portalId: string;
  clientToken?: string;
}
export const DeletePortalRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/portals/{portalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePortalRequest",
}) as any as S.Schema<DeletePortalRequest>;
export interface DeleteProjectRequest {
  projectId: string;
  clientToken?: string;
}
export const DeleteProjectRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpLabel("projectId")),
    clientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/projects/{projectId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectRequest",
}) as any as S.Schema<DeleteProjectRequest>;
export interface DeleteProjectResponse {}
export const DeleteProjectResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProjectResponse",
}) as any as S.Schema<DeleteProjectResponse>;
export interface DeleteTimeSeriesRequest {
  alias?: string;
  assetId?: string;
  propertyId?: string;
  clientToken?: string;
}
export const DeleteTimeSeriesRequest = S.suspend(() =>
  S.Struct({
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/timeseries/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTimeSeriesRequest",
}) as any as S.Schema<DeleteTimeSeriesRequest>;
export interface DeleteTimeSeriesResponse {}
export const DeleteTimeSeriesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTimeSeriesResponse",
}) as any as S.Schema<DeleteTimeSeriesResponse>;
export interface DescribeAccessPolicyRequest {
  accessPolicyId: string;
}
export const DescribeAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    accessPolicyId: S.String.pipe(T.HttpLabel("accessPolicyId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-policies/{accessPolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccessPolicyRequest",
}) as any as S.Schema<DescribeAccessPolicyRequest>;
export interface DescribeActionRequest {
  actionId: string;
}
export const DescribeActionRequest = S.suspend(() =>
  S.Struct({ actionId: S.String.pipe(T.HttpLabel("actionId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/actions/{actionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActionRequest",
}) as any as S.Schema<DescribeActionRequest>;
export interface DescribeAssetRequest {
  assetId: string;
  excludeProperties?: boolean;
}
export const DescribeAssetRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    excludeProperties: S.optional(S.Boolean).pipe(
      T.HttpQuery("excludeProperties"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets/{assetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetRequest",
}) as any as S.Schema<DescribeAssetRequest>;
export interface DescribeAssetCompositeModelRequest {
  assetId: string;
  assetCompositeModelId: string;
}
export const DescribeAssetCompositeModelRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    assetCompositeModelId: S.String.pipe(T.HttpLabel("assetCompositeModelId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assets/{assetId}/composite-models/{assetCompositeModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetCompositeModelRequest",
}) as any as S.Schema<DescribeAssetCompositeModelRequest>;
export interface DescribeAssetModelRequest {
  assetModelId: string;
  excludeProperties?: boolean;
  assetModelVersion?: string;
}
export const DescribeAssetModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    excludeProperties: S.optional(S.Boolean).pipe(
      T.HttpQuery("excludeProperties"),
    ),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/asset-models/{assetModelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetModelRequest",
}) as any as S.Schema<DescribeAssetModelRequest>;
export interface DescribeAssetModelCompositeModelRequest {
  assetModelId: string;
  assetModelCompositeModelId: string;
  assetModelVersion?: string;
}
export const DescribeAssetModelCompositeModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    assetModelCompositeModelId: S.String.pipe(
      T.HttpLabel("assetModelCompositeModelId"),
    ),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetModelCompositeModelRequest",
}) as any as S.Schema<DescribeAssetModelCompositeModelRequest>;
export interface DescribeAssetModelInterfaceRelationshipRequest {
  assetModelId: string;
  interfaceAssetModelId: string;
}
export const DescribeAssetModelInterfaceRelationshipRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel("interfaceAssetModelId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetModelInterfaceRelationshipRequest",
}) as any as S.Schema<DescribeAssetModelInterfaceRelationshipRequest>;
export interface DescribeAssetPropertyRequest {
  assetId: string;
  propertyId: string;
}
export const DescribeAssetPropertyRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    propertyId: S.String.pipe(T.HttpLabel("propertyId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assets/{assetId}/properties/{propertyId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssetPropertyRequest",
}) as any as S.Schema<DescribeAssetPropertyRequest>;
export interface DescribeBulkImportJobRequest {
  jobId: string;
}
export const DescribeBulkImportJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String.pipe(T.HttpLabel("jobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBulkImportJobRequest",
}) as any as S.Schema<DescribeBulkImportJobRequest>;
export interface DescribeComputationModelRequest {
  computationModelId: string;
  computationModelVersion?: string;
}
export const DescribeComputationModelRequest = S.suspend(() =>
  S.Struct({
    computationModelId: S.String.pipe(T.HttpLabel("computationModelId")),
    computationModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("computationModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/computation-models/{computationModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComputationModelRequest",
}) as any as S.Schema<DescribeComputationModelRequest>;
export interface DescribeComputationModelExecutionSummaryRequest {
  computationModelId: string;
  resolveToResourceType?: string;
  resolveToResourceId?: string;
}
export const DescribeComputationModelExecutionSummaryRequest = S.suspend(() =>
  S.Struct({
    computationModelId: S.String.pipe(T.HttpLabel("computationModelId")),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/computation-models/{computationModelId}/execution-summary",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComputationModelExecutionSummaryRequest",
}) as any as S.Schema<DescribeComputationModelExecutionSummaryRequest>;
export interface DescribeDashboardRequest {
  dashboardId: string;
}
export const DescribeDashboardRequest = S.suspend(() =>
  S.Struct({ dashboardId: S.String.pipe(T.HttpLabel("dashboardId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dashboards/{dashboardId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDashboardRequest",
}) as any as S.Schema<DescribeDashboardRequest>;
export interface DescribeDatasetRequest {
  datasetId: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ datasetId: S.String.pipe(T.HttpLabel("datasetId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeExecutionRequest {
  executionId: string;
}
export const DescribeExecutionRequest = S.suspend(() =>
  S.Struct({ executionId: S.String.pipe(T.HttpLabel("executionId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/executions/{executionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeExecutionRequest",
}) as any as S.Schema<DescribeExecutionRequest>;
export interface DescribeGatewayRequest {
  gatewayId: string;
}
export const DescribeGatewayRequest = S.suspend(() =>
  S.Struct({ gatewayId: S.String.pipe(T.HttpLabel("gatewayId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/20200301/gateways/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGatewayRequest",
}) as any as S.Schema<DescribeGatewayRequest>;
export interface DescribeGatewayCapabilityConfigurationRequest {
  gatewayId: string;
  capabilityNamespace: string;
}
export const DescribeGatewayCapabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    capabilityNamespace: S.String.pipe(T.HttpLabel("capabilityNamespace")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/20200301/gateways/{gatewayId}/capability/{capabilityNamespace}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGatewayCapabilityConfigurationRequest",
}) as any as S.Schema<DescribeGatewayCapabilityConfigurationRequest>;
export interface DescribePortalRequest {
  portalId: string;
}
export const DescribePortalRequest = S.suspend(() =>
  S.Struct({ portalId: S.String.pipe(T.HttpLabel("portalId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals/{portalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePortalRequest",
}) as any as S.Schema<DescribePortalRequest>;
export interface DescribeProjectRequest {
  projectId: string;
}
export const DescribeProjectRequest = S.suspend(() =>
  S.Struct({ projectId: S.String.pipe(T.HttpLabel("projectId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{projectId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProjectRequest",
}) as any as S.Schema<DescribeProjectRequest>;
export interface DescribeTimeSeriesRequest {
  alias?: string;
  assetId?: string;
  propertyId?: string;
}
export const DescribeTimeSeriesRequest = S.suspend(() =>
  S.Struct({
    alias: S.optional(S.String).pipe(T.HttpQuery("alias")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/timeseries/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTimeSeriesRequest",
}) as any as S.Schema<DescribeTimeSeriesRequest>;
export interface DisassociateAssetsRequest {
  assetId: string;
  hierarchyId: string;
  childAssetId: string;
  clientToken?: string;
}
export const DisassociateAssetsRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    hierarchyId: S.String,
    childAssetId: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assets/{assetId}/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAssetsRequest",
}) as any as S.Schema<DisassociateAssetsRequest>;
export interface DisassociateAssetsResponse {}
export const DisassociateAssetsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateAssetsResponse",
}) as any as S.Schema<DisassociateAssetsResponse>;
export interface DisassociateTimeSeriesFromAssetPropertyRequest {
  alias: string;
  assetId: string;
  propertyId: string;
  clientToken?: string;
}
export const DisassociateTimeSeriesFromAssetPropertyRequest = S.suspend(() =>
  S.Struct({
    alias: S.String.pipe(T.HttpQuery("alias")),
    assetId: S.String.pipe(T.HttpQuery("assetId")),
    propertyId: S.String.pipe(T.HttpQuery("propertyId")),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/timeseries/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateTimeSeriesFromAssetPropertyRequest",
}) as any as S.Schema<DisassociateTimeSeriesFromAssetPropertyRequest>;
export interface DisassociateTimeSeriesFromAssetPropertyResponse {}
export const DisassociateTimeSeriesFromAssetPropertyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateTimeSeriesFromAssetPropertyResponse",
}) as any as S.Schema<DisassociateTimeSeriesFromAssetPropertyResponse>;
export interface ExecuteQueryRequest {
  queryStatement: string;
  nextToken?: string;
  maxResults?: number;
  clientToken?: string;
}
export const ExecuteQueryRequest = S.suspend(() =>
  S.Struct({
    queryStatement: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    clientToken: S.optional(S.String),
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
export interface GetAssetPropertyAggregatesRequest {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  aggregateTypes: AggregateTypes;
  resolution: string;
  qualities?: Qualities;
  startDate: Date;
  endDate: Date;
  timeOrdering?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetAssetPropertyAggregatesRequest = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    aggregateTypes: AggregateTypes.pipe(T.HttpQuery("aggregateTypes")),
    resolution: S.String.pipe(T.HttpQuery("resolution")),
    qualities: S.optional(Qualities).pipe(T.HttpQuery("qualities")),
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("endDate"),
    ),
    timeOrdering: S.optional(S.String).pipe(T.HttpQuery("timeOrdering")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/properties/aggregates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetPropertyAggregatesRequest",
}) as any as S.Schema<GetAssetPropertyAggregatesRequest>;
export interface GetAssetPropertyValueRequest {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
}
export const GetAssetPropertyValueRequest = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/properties/latest" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetPropertyValueRequest",
}) as any as S.Schema<GetAssetPropertyValueRequest>;
export interface GetAssetPropertyValueHistoryRequest {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  startDate?: Date;
  endDate?: Date;
  qualities?: Qualities;
  timeOrdering?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetAssetPropertyValueHistoryRequest = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startDate"),
    ),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endDate"),
    ),
    qualities: S.optional(Qualities).pipe(T.HttpQuery("qualities")),
    timeOrdering: S.optional(S.String).pipe(T.HttpQuery("timeOrdering")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/properties/history" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetPropertyValueHistoryRequest",
}) as any as S.Schema<GetAssetPropertyValueHistoryRequest>;
export interface GetInterpolatedAssetPropertyValuesRequest {
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  startTimeInSeconds: number;
  startTimeOffsetInNanos?: number;
  endTimeInSeconds: number;
  endTimeOffsetInNanos?: number;
  quality: string;
  intervalInSeconds: number;
  nextToken?: string;
  maxResults?: number;
  type: string;
  intervalWindowInSeconds?: number;
}
export const GetInterpolatedAssetPropertyValuesRequest = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    propertyId: S.optional(S.String).pipe(T.HttpQuery("propertyId")),
    propertyAlias: S.optional(S.String).pipe(T.HttpQuery("propertyAlias")),
    startTimeInSeconds: S.Number.pipe(T.HttpQuery("startTimeInSeconds")),
    startTimeOffsetInNanos: S.optional(S.Number).pipe(
      T.HttpQuery("startTimeOffsetInNanos"),
    ),
    endTimeInSeconds: S.Number.pipe(T.HttpQuery("endTimeInSeconds")),
    endTimeOffsetInNanos: S.optional(S.Number).pipe(
      T.HttpQuery("endTimeOffsetInNanos"),
    ),
    quality: S.String.pipe(T.HttpQuery("quality")),
    intervalInSeconds: S.Number.pipe(T.HttpQuery("intervalInSeconds")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.String.pipe(T.HttpQuery("type")),
    intervalWindowInSeconds: S.optional(S.Number).pipe(
      T.HttpQuery("intervalWindowInSeconds"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/properties/interpolated" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInterpolatedAssetPropertyValuesRequest",
}) as any as S.Schema<GetInterpolatedAssetPropertyValuesRequest>;
export interface InvokeAssistantRequest {
  conversationId?: string;
  message: string | Redacted.Redacted<string>;
  enableTrace?: boolean;
}
export const InvokeAssistantRequest = S.suspend(() =>
  S.Struct({
    conversationId: S.optional(S.String),
    message: SensitiveString,
    enableTrace: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assistant/invocation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeAssistantRequest",
}) as any as S.Schema<InvokeAssistantRequest>;
export interface ListAccessPoliciesRequest {
  identityType?: string;
  identityId?: string;
  resourceType?: string;
  resourceId?: string;
  iamArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAccessPoliciesRequest = S.suspend(() =>
  S.Struct({
    identityType: S.optional(S.String).pipe(T.HttpQuery("identityType")),
    identityId: S.optional(S.String).pipe(T.HttpQuery("identityId")),
    resourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    resourceId: S.optional(S.String).pipe(T.HttpQuery("resourceId")),
    iamArn: S.optional(S.String).pipe(T.HttpQuery("iamArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessPoliciesRequest",
}) as any as S.Schema<ListAccessPoliciesRequest>;
export interface ListActionsRequest {
  targetResourceType: string;
  targetResourceId: string;
  nextToken?: string;
  maxResults?: number;
  resolveToResourceType?: string;
  resolveToResourceId?: string;
}
export const ListActionsRequest = S.suspend(() =>
  S.Struct({
    targetResourceType: S.String.pipe(T.HttpQuery("targetResourceType")),
    targetResourceId: S.String.pipe(T.HttpQuery("targetResourceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListActionsRequest",
}) as any as S.Schema<ListActionsRequest>;
export interface ListAssetModelCompositeModelsRequest {
  assetModelId: string;
  nextToken?: string;
  maxResults?: number;
  assetModelVersion?: string;
}
export const ListAssetModelCompositeModelsRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/asset-models/{assetModelId}/composite-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetModelCompositeModelsRequest",
}) as any as S.Schema<ListAssetModelCompositeModelsRequest>;
export interface ListAssetModelPropertiesRequest {
  assetModelId: string;
  nextToken?: string;
  maxResults?: number;
  filter?: string;
  assetModelVersion?: string;
}
export const ListAssetModelPropertiesRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/asset-models/{assetModelId}/properties" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetModelPropertiesRequest",
}) as any as S.Schema<ListAssetModelPropertiesRequest>;
export interface ListAssetModelsRequest {
  assetModelTypes?: ListAssetModelsTypeFilter;
  nextToken?: string;
  maxResults?: number;
  assetModelVersion?: string;
}
export const ListAssetModelsRequest = S.suspend(() =>
  S.Struct({
    assetModelTypes: S.optional(ListAssetModelsTypeFilter).pipe(
      T.HttpQuery("assetModelTypes"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelVersion: S.optional(S.String).pipe(
      T.HttpQuery("assetModelVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/asset-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetModelsRequest",
}) as any as S.Schema<ListAssetModelsRequest>;
export interface ListAssetPropertiesRequest {
  assetId: string;
  nextToken?: string;
  maxResults?: number;
  filter?: string;
}
export const ListAssetPropertiesRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets/{assetId}/properties" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetPropertiesRequest",
}) as any as S.Schema<ListAssetPropertiesRequest>;
export interface ListAssetRelationshipsRequest {
  assetId: string;
  traversalType: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssetRelationshipsRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    traversalType: S.String.pipe(T.HttpQuery("traversalType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets/{assetId}/assetRelationships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetRelationshipsRequest",
}) as any as S.Schema<ListAssetRelationshipsRequest>;
export interface ListAssetsRequest {
  nextToken?: string;
  maxResults?: number;
  assetModelId?: string;
  filter?: string;
}
export const ListAssetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetModelId: S.optional(S.String).pipe(T.HttpQuery("assetModelId")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssetsRequest",
}) as any as S.Schema<ListAssetsRequest>;
export interface ListAssociatedAssetsRequest {
  assetId: string;
  hierarchyId?: string;
  traversalDirection?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssociatedAssetsRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    hierarchyId: S.optional(S.String).pipe(T.HttpQuery("hierarchyId")),
    traversalDirection: S.optional(S.String).pipe(
      T.HttpQuery("traversalDirection"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assets/{assetId}/hierarchies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedAssetsRequest",
}) as any as S.Schema<ListAssociatedAssetsRequest>;
export interface ListBulkImportJobsRequest {
  nextToken?: string;
  maxResults?: number;
  filter?: string;
}
export const ListBulkImportJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    filter: S.optional(S.String).pipe(T.HttpQuery("filter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBulkImportJobsRequest",
}) as any as S.Schema<ListBulkImportJobsRequest>;
export interface ListCompositionRelationshipsRequest {
  assetModelId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCompositionRelationshipsRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/asset-models/{assetModelId}/composition-relationships",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCompositionRelationshipsRequest",
}) as any as S.Schema<ListCompositionRelationshipsRequest>;
export interface ListComputationModelResolveToResourcesRequest {
  computationModelId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListComputationModelResolveToResourcesRequest = S.suspend(() =>
  S.Struct({
    computationModelId: S.String.pipe(T.HttpLabel("computationModelId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/computation-models/{computationModelId}/resolve-to-resources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComputationModelResolveToResourcesRequest",
}) as any as S.Schema<ListComputationModelResolveToResourcesRequest>;
export interface ListComputationModelsRequest {
  computationModelType?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListComputationModelsRequest = S.suspend(() =>
  S.Struct({
    computationModelType: S.optional(S.String).pipe(
      T.HttpQuery("computationModelType"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/computation-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComputationModelsRequest",
}) as any as S.Schema<ListComputationModelsRequest>;
export interface ListDashboardsRequest {
  projectId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDashboardsRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpQuery("projectId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dashboards" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDashboardsRequest",
}) as any as S.Schema<ListDashboardsRequest>;
export interface ListDatasetsRequest {
  sourceType: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    sourceType: S.String.pipe(T.HttpQuery("sourceType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListExecutionsRequest {
  targetResourceType: string;
  targetResourceId: string;
  resolveToResourceType?: string;
  resolveToResourceId?: string;
  nextToken?: string;
  maxResults?: number;
  actionType?: string;
}
export const ListExecutionsRequest = S.suspend(() =>
  S.Struct({
    targetResourceType: S.String.pipe(T.HttpQuery("targetResourceType")),
    targetResourceId: S.String.pipe(T.HttpQuery("targetResourceId")),
    resolveToResourceType: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceType"),
    ),
    resolveToResourceId: S.optional(S.String).pipe(
      T.HttpQuery("resolveToResourceId"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    actionType: S.optional(S.String).pipe(T.HttpQuery("actionType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExecutionsRequest",
}) as any as S.Schema<ListExecutionsRequest>;
export interface ListGatewaysRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListGatewaysRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/20200301/gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGatewaysRequest",
}) as any as S.Schema<ListGatewaysRequest>;
export interface ListInterfaceRelationshipsRequest {
  interfaceAssetModelId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListInterfaceRelationshipsRequest = S.suspend(() =>
  S.Struct({
    interfaceAssetModelId: S.String.pipe(T.HttpLabel("interfaceAssetModelId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/interface/{interfaceAssetModelId}/asset-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInterfaceRelationshipsRequest",
}) as any as S.Schema<ListInterfaceRelationshipsRequest>;
export interface ListPortalsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPortalsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPortalsRequest",
}) as any as S.Schema<ListPortalsRequest>;
export interface ListProjectAssetsRequest {
  projectId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListProjectAssetsRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpLabel("projectId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{projectId}/assets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectAssetsRequest",
}) as any as S.Schema<ListProjectAssetsRequest>;
export interface ListProjectsRequest {
  portalId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListProjectsRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpQuery("portalId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsRequest",
}) as any as S.Schema<ListProjectsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ListTimeSeriesRequest {
  nextToken?: string;
  maxResults?: number;
  assetId?: string;
  aliasPrefix?: string;
  timeSeriesType?: string;
}
export const ListTimeSeriesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    assetId: S.optional(S.String).pipe(T.HttpQuery("assetId")),
    aliasPrefix: S.optional(S.String).pipe(T.HttpQuery("aliasPrefix")),
    timeSeriesType: S.optional(S.String).pipe(T.HttpQuery("timeSeriesType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/timeseries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTimeSeriesRequest",
}) as any as S.Schema<ListTimeSeriesRequest>;
export interface PutDefaultEncryptionConfigurationRequest {
  encryptionType: string;
  kmsKeyId?: string;
}
export const PutDefaultEncryptionConfigurationRequest = S.suspend(() =>
  S.Struct({ encryptionType: S.String, kmsKeyId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configuration/account/encryption" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDefaultEncryptionConfigurationRequest",
}) as any as S.Schema<PutDefaultEncryptionConfigurationRequest>;
export interface LoggingOptions {
  level: string;
}
export const LoggingOptions = S.suspend(() =>
  S.Struct({ level: S.String }),
).annotations({
  identifier: "LoggingOptions",
}) as any as S.Schema<LoggingOptions>;
export interface PutLoggingOptionsRequest {
  loggingOptions: LoggingOptions;
}
export const PutLoggingOptionsRequest = S.suspend(() =>
  S.Struct({ loggingOptions: LoggingOptions }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLoggingOptionsRequest",
}) as any as S.Schema<PutLoggingOptionsRequest>;
export interface PutLoggingOptionsResponse {}
export const PutLoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutLoggingOptionsResponse",
}) as any as S.Schema<PutLoggingOptionsResponse>;
export interface CustomerManagedS3Storage {
  s3ResourceArn: string;
  roleArn: string;
}
export const CustomerManagedS3Storage = S.suspend(() =>
  S.Struct({ s3ResourceArn: S.String, roleArn: S.String }),
).annotations({
  identifier: "CustomerManagedS3Storage",
}) as any as S.Schema<CustomerManagedS3Storage>;
export interface MultiLayerStorage {
  customerManagedS3Storage: CustomerManagedS3Storage;
}
export const MultiLayerStorage = S.suspend(() =>
  S.Struct({ customerManagedS3Storage: CustomerManagedS3Storage }),
).annotations({
  identifier: "MultiLayerStorage",
}) as any as S.Schema<MultiLayerStorage>;
export interface RetentionPeriod {
  numberOfDays?: number;
  unlimited?: boolean;
}
export const RetentionPeriod = S.suspend(() =>
  S.Struct({
    numberOfDays: S.optional(S.Number),
    unlimited: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RetentionPeriod",
}) as any as S.Schema<RetentionPeriod>;
export interface WarmTierRetentionPeriod {
  numberOfDays?: number;
  unlimited?: boolean;
}
export const WarmTierRetentionPeriod = S.suspend(() =>
  S.Struct({
    numberOfDays: S.optional(S.Number),
    unlimited: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "WarmTierRetentionPeriod",
}) as any as S.Schema<WarmTierRetentionPeriod>;
export interface PutStorageConfigurationRequest {
  storageType: string;
  multiLayerStorage?: MultiLayerStorage;
  disassociatedDataStorage?: string;
  retentionPeriod?: RetentionPeriod;
  warmTier?: string;
  warmTierRetentionPeriod?: WarmTierRetentionPeriod;
  disallowIngestNullNaN?: boolean;
}
export const PutStorageConfigurationRequest = S.suspend(() =>
  S.Struct({
    storageType: S.String,
    multiLayerStorage: S.optional(MultiLayerStorage),
    disassociatedDataStorage: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
    warmTier: S.optional(S.String),
    warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
    disallowIngestNullNaN: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configuration/account/storage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutStorageConfigurationRequest",
}) as any as S.Schema<PutStorageConfigurationRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tags: TagMap,
  }).pipe(
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
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
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
export interface UserIdentity {
  id: string;
}
export const UserIdentity = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({ identifier: "UserIdentity" }) as any as S.Schema<UserIdentity>;
export interface GroupIdentity {
  id: string;
}
export const GroupIdentity = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "GroupIdentity",
}) as any as S.Schema<GroupIdentity>;
export interface IAMUserIdentity {
  arn: string;
}
export const IAMUserIdentity = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "IAMUserIdentity",
}) as any as S.Schema<IAMUserIdentity>;
export interface IAMRoleIdentity {
  arn: string;
}
export const IAMRoleIdentity = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "IAMRoleIdentity",
}) as any as S.Schema<IAMRoleIdentity>;
export interface Identity {
  user?: UserIdentity;
  group?: GroupIdentity;
  iamUser?: IAMUserIdentity;
  iamRole?: IAMRoleIdentity;
}
export const Identity = S.suspend(() =>
  S.Struct({
    user: S.optional(UserIdentity),
    group: S.optional(GroupIdentity),
    iamUser: S.optional(IAMUserIdentity),
    iamRole: S.optional(IAMRoleIdentity),
  }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export interface PortalResource {
  id: string;
}
export const PortalResource = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "PortalResource",
}) as any as S.Schema<PortalResource>;
export interface ProjectResource {
  id: string;
}
export const ProjectResource = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "ProjectResource",
}) as any as S.Schema<ProjectResource>;
export interface Resource {
  portal?: PortalResource;
  project?: ProjectResource;
}
export const Resource = S.suspend(() =>
  S.Struct({
    portal: S.optional(PortalResource),
    project: S.optional(ProjectResource),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export interface UpdateAccessPolicyRequest {
  accessPolicyId: string;
  accessPolicyIdentity: Identity;
  accessPolicyResource: Resource;
  accessPolicyPermission: string;
  clientToken?: string;
}
export const UpdateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    accessPolicyId: S.String.pipe(T.HttpLabel("accessPolicyId")),
    accessPolicyIdentity: Identity,
    accessPolicyResource: Resource,
    accessPolicyPermission: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/access-policies/{accessPolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccessPolicyRequest",
}) as any as S.Schema<UpdateAccessPolicyRequest>;
export interface UpdateAccessPolicyResponse {}
export const UpdateAccessPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAccessPolicyResponse",
}) as any as S.Schema<UpdateAccessPolicyResponse>;
export interface UpdateAssetRequest {
  assetId: string;
  assetExternalId?: string;
  assetName: string;
  clientToken?: string;
  assetDescription?: string;
}
export const UpdateAssetRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    assetExternalId: S.optional(S.String),
    assetName: S.String,
    clientToken: S.optional(S.String),
    assetDescription: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assets/{assetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetRequest",
}) as any as S.Schema<UpdateAssetRequest>;
export interface AssetModelProperty {
  id?: string;
  externalId?: string;
  name: string;
  dataType: string;
  dataTypeSpec?: string;
  unit?: string;
  type: PropertyType;
  path?: AssetModelPropertyPath;
}
export const AssetModelProperty = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    unit: S.optional(S.String),
    type: PropertyType,
    path: S.optional(AssetModelPropertyPath),
  }),
).annotations({
  identifier: "AssetModelProperty",
}) as any as S.Schema<AssetModelProperty>;
export type AssetModelProperties = AssetModelProperty[];
export const AssetModelProperties = S.Array(AssetModelProperty);
export interface UpdateAssetModelCompositeModelRequest {
  assetModelId: string;
  assetModelCompositeModelId: string;
  assetModelCompositeModelExternalId?: string;
  assetModelCompositeModelDescription?: string;
  assetModelCompositeModelName: string;
  clientToken?: string;
  assetModelCompositeModelProperties?: AssetModelProperties;
  ifMatch?: string;
  ifNoneMatch?: string;
  matchForVersionType?: string;
}
export const UpdateAssetModelCompositeModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    assetModelCompositeModelId: S.String.pipe(
      T.HttpLabel("assetModelCompositeModelId"),
    ),
    assetModelCompositeModelExternalId: S.optional(S.String),
    assetModelCompositeModelDescription: S.optional(S.String),
    assetModelCompositeModelName: S.String,
    clientToken: S.optional(S.String),
    assetModelCompositeModelProperties: S.optional(AssetModelProperties),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/asset-models/{assetModelId}/composite-models/{assetModelCompositeModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetModelCompositeModelRequest",
}) as any as S.Schema<UpdateAssetModelCompositeModelRequest>;
export interface UpdateAssetPropertyRequest {
  assetId: string;
  propertyId: string;
  propertyAlias?: string;
  propertyNotificationState?: string;
  clientToken?: string;
  propertyUnit?: string;
}
export const UpdateAssetPropertyRequest = S.suspend(() =>
  S.Struct({
    assetId: S.String.pipe(T.HttpLabel("assetId")),
    propertyId: S.String.pipe(T.HttpLabel("propertyId")),
    propertyAlias: S.optional(S.String),
    propertyNotificationState: S.optional(S.String),
    clientToken: S.optional(S.String),
    propertyUnit: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assets/{assetId}/properties/{propertyId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetPropertyRequest",
}) as any as S.Schema<UpdateAssetPropertyRequest>;
export interface UpdateAssetPropertyResponse {}
export const UpdateAssetPropertyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAssetPropertyResponse",
}) as any as S.Schema<UpdateAssetPropertyResponse>;
export interface ComputationModelAnomalyDetectionConfiguration {
  inputProperties: string;
  resultProperty: string;
}
export const ComputationModelAnomalyDetectionConfiguration = S.suspend(() =>
  S.Struct({ inputProperties: S.String, resultProperty: S.String }),
).annotations({
  identifier: "ComputationModelAnomalyDetectionConfiguration",
}) as any as S.Schema<ComputationModelAnomalyDetectionConfiguration>;
export interface ComputationModelConfiguration {
  anomalyDetection?: ComputationModelAnomalyDetectionConfiguration;
}
export const ComputationModelConfiguration = S.suspend(() =>
  S.Struct({
    anomalyDetection: S.optional(ComputationModelAnomalyDetectionConfiguration),
  }),
).annotations({
  identifier: "ComputationModelConfiguration",
}) as any as S.Schema<ComputationModelConfiguration>;
export interface AssetModelPropertyBindingValue {
  assetModelId: string;
  propertyId: string;
}
export const AssetModelPropertyBindingValue = S.suspend(() =>
  S.Struct({ assetModelId: S.String, propertyId: S.String }),
).annotations({
  identifier: "AssetModelPropertyBindingValue",
}) as any as S.Schema<AssetModelPropertyBindingValue>;
export interface AssetPropertyBindingValue {
  assetId: string;
  propertyId: string;
}
export const AssetPropertyBindingValue = S.suspend(() =>
  S.Struct({ assetId: S.String, propertyId: S.String }),
).annotations({
  identifier: "AssetPropertyBindingValue",
}) as any as S.Schema<AssetPropertyBindingValue>;
export interface ComputationModelDataBindingValue {
  assetModelProperty?: AssetModelPropertyBindingValue;
  assetProperty?: AssetPropertyBindingValue;
  list?: BindingValueList;
}
export const ComputationModelDataBindingValue = S.suspend(() =>
  S.Struct({
    assetModelProperty: S.optional(AssetModelPropertyBindingValue),
    assetProperty: S.optional(AssetPropertyBindingValue),
    list: S.optional(
      S.suspend(() => BindingValueList).annotations({
        identifier: "BindingValueList",
      }),
    ),
  }),
).annotations({
  identifier: "ComputationModelDataBindingValue",
}) as any as S.Schema<ComputationModelDataBindingValue>;
export type ComputationModelDataBinding = {
  [key: string]: ComputationModelDataBindingValue;
};
export const ComputationModelDataBinding = S.Record({
  key: S.String,
  value: S.suspend(
    (): S.Schema<ComputationModelDataBindingValue, any> =>
      ComputationModelDataBindingValue,
  ).annotations({ identifier: "ComputationModelDataBindingValue" }),
});
export interface UpdateComputationModelRequest {
  computationModelId: string;
  computationModelName: string;
  computationModelDescription?: string;
  computationModelConfiguration: ComputationModelConfiguration;
  computationModelDataBinding: ComputationModelDataBinding;
  clientToken?: string;
}
export const UpdateComputationModelRequest = S.suspend(() =>
  S.Struct({
    computationModelId: S.String.pipe(T.HttpLabel("computationModelId")),
    computationModelName: S.String,
    computationModelDescription: S.optional(S.String),
    computationModelConfiguration: ComputationModelConfiguration,
    computationModelDataBinding: ComputationModelDataBinding,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/computation-models/{computationModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateComputationModelRequest",
}) as any as S.Schema<UpdateComputationModelRequest>;
export interface UpdateDashboardRequest {
  dashboardId: string;
  dashboardName: string;
  dashboardDescription?: string;
  dashboardDefinition: string;
  clientToken?: string;
}
export const UpdateDashboardRequest = S.suspend(() =>
  S.Struct({
    dashboardId: S.String.pipe(T.HttpLabel("dashboardId")),
    dashboardName: S.String,
    dashboardDescription: S.optional(S.String),
    dashboardDefinition: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/dashboards/{dashboardId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDashboardRequest",
}) as any as S.Schema<UpdateDashboardRequest>;
export interface UpdateDashboardResponse {}
export const UpdateDashboardResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDashboardResponse",
}) as any as S.Schema<UpdateDashboardResponse>;
export interface KendraSourceDetail {
  knowledgeBaseArn: string;
  roleArn: string;
}
export const KendraSourceDetail = S.suspend(() =>
  S.Struct({ knowledgeBaseArn: S.String, roleArn: S.String }),
).annotations({
  identifier: "KendraSourceDetail",
}) as any as S.Schema<KendraSourceDetail>;
export interface SourceDetail {
  kendra?: KendraSourceDetail;
}
export const SourceDetail = S.suspend(() =>
  S.Struct({ kendra: S.optional(KendraSourceDetail) }),
).annotations({ identifier: "SourceDetail" }) as any as S.Schema<SourceDetail>;
export interface DatasetSource {
  sourceType: string;
  sourceFormat: string;
  sourceDetail?: SourceDetail;
}
export const DatasetSource = S.suspend(() =>
  S.Struct({
    sourceType: S.String,
    sourceFormat: S.String,
    sourceDetail: S.optional(SourceDetail),
  }),
).annotations({
  identifier: "DatasetSource",
}) as any as S.Schema<DatasetSource>;
export interface UpdateDatasetRequest {
  datasetId: string;
  datasetName: string;
  datasetDescription?: string;
  datasetSource: DatasetSource;
  clientToken?: string;
}
export const UpdateDatasetRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.String.pipe(T.HttpLabel("datasetId")),
    datasetName: S.String,
    datasetDescription: S.optional(S.String),
    datasetSource: DatasetSource,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/datasets/{datasetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDatasetRequest",
}) as any as S.Schema<UpdateDatasetRequest>;
export interface UpdateGatewayRequest {
  gatewayId: string;
  gatewayName: string;
}
export const UpdateGatewayRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    gatewayName: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/20200301/gateways/{gatewayId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGatewayRequest",
}) as any as S.Schema<UpdateGatewayRequest>;
export interface UpdateGatewayResponse {}
export const UpdateGatewayResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateGatewayResponse",
}) as any as S.Schema<UpdateGatewayResponse>;
export interface UpdateGatewayCapabilityConfigurationRequest {
  gatewayId: string;
  capabilityNamespace: string;
  capabilityConfiguration: string;
}
export const UpdateGatewayCapabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    gatewayId: S.String.pipe(T.HttpLabel("gatewayId")),
    capabilityNamespace: S.String,
    capabilityConfiguration: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/20200301/gateways/{gatewayId}/capability",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGatewayCapabilityConfigurationRequest",
}) as any as S.Schema<UpdateGatewayCapabilityConfigurationRequest>;
export interface UpdateProjectRequest {
  projectId: string;
  projectName: string;
  projectDescription?: string;
  clientToken?: string;
}
export const UpdateProjectRequest = S.suspend(() =>
  S.Struct({
    projectId: S.String.pipe(T.HttpLabel("projectId")),
    projectName: S.String,
    projectDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/projects/{projectId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectRequest",
}) as any as S.Schema<UpdateProjectRequest>;
export interface UpdateProjectResponse {}
export const UpdateProjectResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateProjectResponse",
}) as any as S.Schema<UpdateProjectResponse>;
export interface AssetErrorDetails {
  assetId: string;
  code: string;
  message: string;
}
export const AssetErrorDetails = S.suspend(() =>
  S.Struct({ assetId: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "AssetErrorDetails",
}) as any as S.Schema<AssetErrorDetails>;
export type BatchDisassociateProjectAssetsErrors = AssetErrorDetails[];
export const BatchDisassociateProjectAssetsErrors = S.Array(AssetErrorDetails);
export interface BatchGetAssetPropertyAggregatesEntry {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  aggregateTypes: AggregateTypes;
  resolution: string;
  startDate: Date;
  endDate: Date;
  qualities?: Qualities;
  timeOrdering?: string;
}
export const BatchGetAssetPropertyAggregatesEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
    aggregateTypes: AggregateTypes,
    resolution: S.String,
    startDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    qualities: S.optional(Qualities),
    timeOrdering: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesEntry",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesEntry>;
export type BatchGetAssetPropertyAggregatesEntries =
  BatchGetAssetPropertyAggregatesEntry[];
export const BatchGetAssetPropertyAggregatesEntries = S.Array(
  BatchGetAssetPropertyAggregatesEntry,
);
export interface BatchGetAssetPropertyValueEntry {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
}
export const BatchGetAssetPropertyValueEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueEntry>;
export type BatchGetAssetPropertyValueEntries =
  BatchGetAssetPropertyValueEntry[];
export const BatchGetAssetPropertyValueEntries = S.Array(
  BatchGetAssetPropertyValueEntry,
);
export interface BatchGetAssetPropertyValueHistoryEntry {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  startDate?: Date;
  endDate?: Date;
  qualities?: Qualities;
  timeOrdering?: string;
}
export const BatchGetAssetPropertyValueHistoryEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    qualities: S.optional(Qualities),
    timeOrdering: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistoryEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueHistoryEntry>;
export type BatchGetAssetPropertyValueHistoryEntries =
  BatchGetAssetPropertyValueHistoryEntry[];
export const BatchGetAssetPropertyValueHistoryEntries = S.Array(
  BatchGetAssetPropertyValueHistoryEntry,
);
export interface AssetModelHierarchyDefinition {
  id?: string;
  externalId?: string;
  name: string;
  childAssetModelId: string;
}
export const AssetModelHierarchyDefinition = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    childAssetModelId: S.String,
  }),
).annotations({
  identifier: "AssetModelHierarchyDefinition",
}) as any as S.Schema<AssetModelHierarchyDefinition>;
export type AssetModelHierarchyDefinitions = AssetModelHierarchyDefinition[];
export const AssetModelHierarchyDefinitions = S.Array(
  AssetModelHierarchyDefinition,
);
export interface AssetModelCompositeModelDefinition {
  id?: string;
  externalId?: string;
  name: string;
  description?: string;
  type: string;
  properties?: AssetModelPropertyDefinitions;
}
export const AssetModelCompositeModelDefinition = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    description: S.optional(S.String),
    type: S.String,
    properties: S.optional(AssetModelPropertyDefinitions),
  }),
).annotations({
  identifier: "AssetModelCompositeModelDefinition",
}) as any as S.Schema<AssetModelCompositeModelDefinition>;
export type AssetModelCompositeModelDefinitions =
  AssetModelCompositeModelDefinition[];
export const AssetModelCompositeModelDefinitions = S.Array(
  AssetModelCompositeModelDefinition,
);
export interface File {
  bucket: string;
  key: string;
  versionId?: string;
}
export const File = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    key: S.String,
    versionId: S.optional(S.String),
  }),
).annotations({ identifier: "File" }) as any as S.Schema<File>;
export type Files = File[];
export const Files = S.Array(File);
export interface ErrorReportLocation {
  bucket: string;
  prefix: string;
}
export const ErrorReportLocation = S.suspend(() =>
  S.Struct({ bucket: S.String, prefix: S.String }),
).annotations({
  identifier: "ErrorReportLocation",
}) as any as S.Schema<ErrorReportLocation>;
export interface ImageFile {
  data: Uint8Array;
  type: string;
}
export const ImageFile = S.suspend(() =>
  S.Struct({ data: T.Blob, type: S.String }),
).annotations({ identifier: "ImageFile" }) as any as S.Schema<ImageFile>;
export interface Alarms {
  alarmRoleArn: string;
  notificationLambdaArn?: string;
}
export const Alarms = S.suspend(() =>
  S.Struct({
    alarmRoleArn: S.String,
    notificationLambdaArn: S.optional(S.String),
  }),
).annotations({ identifier: "Alarms" }) as any as S.Schema<Alarms>;
export interface TargetResource {
  assetId?: string;
  computationModelId?: string;
}
export const TargetResource = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String),
    computationModelId: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetResource",
}) as any as S.Schema<TargetResource>;
export interface ActionPayload {
  stringValue: string;
}
export const ActionPayload = S.suspend(() =>
  S.Struct({ stringValue: S.String }),
).annotations({
  identifier: "ActionPayload",
}) as any as S.Schema<ActionPayload>;
export interface ResolveTo {
  assetId: string;
}
export const ResolveTo = S.suspend(() =>
  S.Struct({ assetId: S.String }),
).annotations({ identifier: "ResolveTo" }) as any as S.Schema<ResolveTo>;
export interface PropertyValueNullValue {
  valueType: string;
}
export const PropertyValueNullValue = S.suspend(() =>
  S.Struct({ valueType: S.String }),
).annotations({
  identifier: "PropertyValueNullValue",
}) as any as S.Schema<PropertyValueNullValue>;
export interface Variant {
  stringValue?: string;
  integerValue?: number;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: PropertyValueNullValue;
}
export const Variant = S.suspend(() =>
  S.Struct({
    stringValue: S.optional(S.String),
    integerValue: S.optional(S.Number),
    doubleValue: S.optional(S.Number),
    booleanValue: S.optional(S.Boolean),
    nullValue: S.optional(PropertyValueNullValue),
  }),
).annotations({ identifier: "Variant" }) as any as S.Schema<Variant>;
export interface TimeInNanos {
  timeInSeconds: number;
  offsetInNanos?: number;
}
export const TimeInNanos = S.suspend(() =>
  S.Struct({ timeInSeconds: S.Number, offsetInNanos: S.optional(S.Number) }),
).annotations({ identifier: "TimeInNanos" }) as any as S.Schema<TimeInNanos>;
export interface AssetPropertyValue {
  value: Variant;
  timestamp: TimeInNanos;
  quality?: string;
}
export const AssetPropertyValue = S.suspend(() =>
  S.Struct({
    value: Variant,
    timestamp: TimeInNanos,
    quality: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetPropertyValue",
}) as any as S.Schema<AssetPropertyValue>;
export type AssetPropertyValueHistory = AssetPropertyValue[];
export const AssetPropertyValueHistory = S.Array(AssetPropertyValue);
export type AssetIDs = string[];
export const AssetIDs = S.Array(S.String);
export interface AssetModelHierarchy {
  id?: string;
  externalId?: string;
  name: string;
  childAssetModelId: string;
}
export const AssetModelHierarchy = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    childAssetModelId: S.String,
  }),
).annotations({
  identifier: "AssetModelHierarchy",
}) as any as S.Schema<AssetModelHierarchy>;
export type AssetModelHierarchies = AssetModelHierarchy[];
export const AssetModelHierarchies = S.Array(AssetModelHierarchy);
export interface AssetModelCompositeModel {
  name: string;
  description?: string;
  type: string;
  properties?: AssetModelProperties;
  id?: string;
  externalId?: string;
}
export const AssetModelCompositeModel = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    type: S.String,
    properties: S.optional(AssetModelProperties),
    id: S.optional(S.String),
    externalId: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetModelCompositeModel",
}) as any as S.Schema<AssetModelCompositeModel>;
export type AssetModelCompositeModels = AssetModelCompositeModel[];
export const AssetModelCompositeModels = S.Array(AssetModelCompositeModel);
export interface Image {
  id?: string;
  file?: ImageFile;
}
export const Image = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), file: S.optional(ImageFile) }),
).annotations({ identifier: "Image" }) as any as S.Schema<Image>;
export interface Parquet {}
export const Parquet = S.suspend(() => S.Struct({})).annotations({
  identifier: "Parquet",
}) as any as S.Schema<Parquet>;
export type BindingValueList = ComputationModelDataBindingValue[];
export const BindingValueList = S.Array(
  S.suspend(
    (): S.Schema<ComputationModelDataBindingValue, any> =>
      ComputationModelDataBindingValue,
  ).annotations({ identifier: "ComputationModelDataBindingValue" }),
) as any as S.Schema<BindingValueList>;
export type PortalTools = string[];
export const PortalTools = S.Array(S.String);
export interface BatchDisassociateProjectAssetsResponse {
  errors?: BatchDisassociateProjectAssetsErrors;
}
export const BatchDisassociateProjectAssetsResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchDisassociateProjectAssetsErrors) }),
).annotations({
  identifier: "BatchDisassociateProjectAssetsResponse",
}) as any as S.Schema<BatchDisassociateProjectAssetsResponse>;
export interface BatchGetAssetPropertyAggregatesRequest {
  entries: BatchGetAssetPropertyAggregatesEntries;
  nextToken?: string;
  maxResults?: number;
}
export const BatchGetAssetPropertyAggregatesRequest = S.suspend(() =>
  S.Struct({
    entries: BatchGetAssetPropertyAggregatesEntries,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/properties/batch/aggregates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesRequest",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesRequest>;
export interface BatchGetAssetPropertyValueRequest {
  entries: BatchGetAssetPropertyValueEntries;
  nextToken?: string;
}
export const BatchGetAssetPropertyValueRequest = S.suspend(() =>
  S.Struct({
    entries: BatchGetAssetPropertyValueEntries,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/properties/batch/latest" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAssetPropertyValueRequest",
}) as any as S.Schema<BatchGetAssetPropertyValueRequest>;
export interface BatchGetAssetPropertyValueHistoryRequest {
  entries: BatchGetAssetPropertyValueHistoryEntries;
  nextToken?: string;
  maxResults?: number;
}
export const BatchGetAssetPropertyValueHistoryRequest = S.suspend(() =>
  S.Struct({
    entries: BatchGetAssetPropertyValueHistoryEntries,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/properties/batch/history" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistoryRequest",
}) as any as S.Schema<BatchGetAssetPropertyValueHistoryRequest>;
export interface CreateDashboardResponse {
  dashboardId: string;
  dashboardArn: string;
}
export const CreateDashboardResponse = S.suspend(() =>
  S.Struct({ dashboardId: S.String, dashboardArn: S.String }),
).annotations({
  identifier: "CreateDashboardResponse",
}) as any as S.Schema<CreateDashboardResponse>;
export interface CreateProjectResponse {
  projectId: string;
  projectArn: string;
}
export const CreateProjectResponse = S.suspend(() =>
  S.Struct({ projectId: S.String, projectArn: S.String }),
).annotations({
  identifier: "CreateProjectResponse",
}) as any as S.Schema<CreateProjectResponse>;
export interface DetailedError {
  code: string;
  message: string;
}
export const DetailedError = S.suspend(() =>
  S.Struct({ code: S.String, message: S.String }),
).annotations({
  identifier: "DetailedError",
}) as any as S.Schema<DetailedError>;
export type DetailedErrors = DetailedError[];
export const DetailedErrors = S.Array(DetailedError);
export interface ErrorDetails {
  code: string;
  message: string;
  details?: DetailedErrors;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({
    code: S.String,
    message: S.String,
    details: S.optional(DetailedErrors),
  }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface AssetStatus {
  state: string;
  error?: ErrorDetails;
}
export const AssetStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(ErrorDetails) }),
).annotations({ identifier: "AssetStatus" }) as any as S.Schema<AssetStatus>;
export interface DeleteAssetResponse {
  assetStatus: AssetStatus;
}
export const DeleteAssetResponse = S.suspend(() =>
  S.Struct({ assetStatus: AssetStatus }),
).annotations({
  identifier: "DeleteAssetResponse",
}) as any as S.Schema<DeleteAssetResponse>;
export interface AssetModelStatus {
  state: string;
  error?: ErrorDetails;
}
export const AssetModelStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(ErrorDetails) }),
).annotations({
  identifier: "AssetModelStatus",
}) as any as S.Schema<AssetModelStatus>;
export interface DeleteAssetModelResponse {
  assetModelStatus: AssetModelStatus;
}
export const DeleteAssetModelResponse = S.suspend(() =>
  S.Struct({ assetModelStatus: AssetModelStatus }),
).annotations({
  identifier: "DeleteAssetModelResponse",
}) as any as S.Schema<DeleteAssetModelResponse>;
export interface DeleteAssetModelCompositeModelResponse {
  assetModelStatus: AssetModelStatus;
}
export const DeleteAssetModelCompositeModelResponse = S.suspend(() =>
  S.Struct({ assetModelStatus: AssetModelStatus }),
).annotations({
  identifier: "DeleteAssetModelCompositeModelResponse",
}) as any as S.Schema<DeleteAssetModelCompositeModelResponse>;
export interface DeleteAssetModelInterfaceRelationshipResponse {
  assetModelId: string;
  interfaceAssetModelId: string;
  assetModelArn: string;
  assetModelStatus: AssetModelStatus;
}
export const DeleteAssetModelInterfaceRelationshipResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    interfaceAssetModelId: S.String,
    assetModelArn: S.String,
    assetModelStatus: AssetModelStatus,
  }),
).annotations({
  identifier: "DeleteAssetModelInterfaceRelationshipResponse",
}) as any as S.Schema<DeleteAssetModelInterfaceRelationshipResponse>;
export interface DescribeAccessPolicyResponse {
  accessPolicyId: string;
  accessPolicyArn: string;
  accessPolicyIdentity: Identity;
  accessPolicyResource: Resource;
  accessPolicyPermission: string;
  accessPolicyCreationDate: Date;
  accessPolicyLastUpdateDate: Date;
}
export const DescribeAccessPolicyResponse = S.suspend(() =>
  S.Struct({
    accessPolicyId: S.String,
    accessPolicyArn: S.String,
    accessPolicyIdentity: Identity,
    accessPolicyResource: Resource,
    accessPolicyPermission: S.String,
    accessPolicyCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    accessPolicyLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeAccessPolicyResponse",
}) as any as S.Schema<DescribeAccessPolicyResponse>;
export interface DescribeActionResponse {
  actionId: string;
  targetResource: TargetResource;
  actionDefinitionId: string;
  actionPayload: ActionPayload;
  executionTime: Date;
  resolveTo?: ResolveTo;
}
export const DescribeActionResponse = S.suspend(() =>
  S.Struct({
    actionId: S.String,
    targetResource: TargetResource,
    actionDefinitionId: S.String,
    actionPayload: ActionPayload,
    executionTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    resolveTo: S.optional(ResolveTo),
  }),
).annotations({
  identifier: "DescribeActionResponse",
}) as any as S.Schema<DescribeActionResponse>;
export type ColumnNames = string[];
export const ColumnNames = S.Array(S.String);
export interface Csv {
  columnNames: ColumnNames;
}
export const Csv = S.suspend(() =>
  S.Struct({ columnNames: ColumnNames }),
).annotations({ identifier: "Csv" }) as any as S.Schema<Csv>;
export interface FileFormat {
  csv?: Csv;
  parquet?: Parquet;
}
export const FileFormat = S.suspend(() =>
  S.Struct({ csv: S.optional(Csv), parquet: S.optional(Parquet) }),
).annotations({ identifier: "FileFormat" }) as any as S.Schema<FileFormat>;
export interface JobConfiguration {
  fileFormat: FileFormat;
}
export const JobConfiguration = S.suspend(() =>
  S.Struct({ fileFormat: FileFormat }),
).annotations({
  identifier: "JobConfiguration",
}) as any as S.Schema<JobConfiguration>;
export interface DescribeBulkImportJobResponse {
  jobId: string;
  jobName: string;
  jobStatus: string;
  jobRoleArn: string;
  files: Files;
  errorReportLocation: ErrorReportLocation;
  jobConfiguration: JobConfiguration;
  jobCreationDate: Date;
  jobLastUpdateDate: Date;
  adaptiveIngestion?: boolean;
  deleteFilesAfterImport?: boolean;
}
export const DescribeBulkImportJobResponse = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    jobName: S.String,
    jobStatus: S.String,
    jobRoleArn: S.String,
    files: Files,
    errorReportLocation: ErrorReportLocation,
    jobConfiguration: JobConfiguration,
    jobCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    jobLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    adaptiveIngestion: S.optional(S.Boolean),
    deleteFilesAfterImport: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeBulkImportJobResponse",
}) as any as S.Schema<DescribeBulkImportJobResponse>;
export interface ComputationModelStatus {
  state: string;
  error?: ErrorDetails;
}
export const ComputationModelStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(ErrorDetails) }),
).annotations({
  identifier: "ComputationModelStatus",
}) as any as S.Schema<ComputationModelStatus>;
export interface ActionDefinition {
  actionDefinitionId: string;
  actionName: string;
  actionType: string;
}
export const ActionDefinition = S.suspend(() =>
  S.Struct({
    actionDefinitionId: S.String,
    actionName: S.String,
    actionType: S.String,
  }),
).annotations({
  identifier: "ActionDefinition",
}) as any as S.Schema<ActionDefinition>;
export type ActionDefinitions = ActionDefinition[];
export const ActionDefinitions = S.Array(ActionDefinition);
export interface DescribeComputationModelResponse {
  computationModelId: string;
  computationModelArn: string;
  computationModelName: string;
  computationModelDescription?: string;
  computationModelConfiguration: ComputationModelConfiguration;
  computationModelDataBinding: ComputationModelDataBinding;
  computationModelCreationDate: Date;
  computationModelLastUpdateDate: Date;
  computationModelStatus: ComputationModelStatus;
  computationModelVersion: string;
  actionDefinitions: ActionDefinitions;
}
export const DescribeComputationModelResponse = S.suspend(() =>
  S.Struct({
    computationModelId: S.String,
    computationModelArn: S.String,
    computationModelName: S.String,
    computationModelDescription: S.optional(S.String),
    computationModelConfiguration: ComputationModelConfiguration,
    computationModelDataBinding: ComputationModelDataBinding,
    computationModelCreationDate: S.Date.pipe(
      T.TimestampFormat("epoch-seconds"),
    ),
    computationModelLastUpdateDate: S.Date.pipe(
      T.TimestampFormat("epoch-seconds"),
    ),
    computationModelStatus: ComputationModelStatus,
    computationModelVersion: S.String,
    actionDefinitions: ActionDefinitions,
  }),
).annotations({
  identifier: "DescribeComputationModelResponse",
}) as any as S.Schema<DescribeComputationModelResponse>;
export interface DescribeDashboardResponse {
  dashboardId: string;
  dashboardArn: string;
  dashboardName: string;
  projectId: string;
  dashboardDescription?: string;
  dashboardDefinition: string;
  dashboardCreationDate: Date;
  dashboardLastUpdateDate: Date;
}
export const DescribeDashboardResponse = S.suspend(() =>
  S.Struct({
    dashboardId: S.String,
    dashboardArn: S.String,
    dashboardName: S.String,
    projectId: S.String,
    dashboardDescription: S.optional(S.String),
    dashboardDefinition: S.String,
    dashboardCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    dashboardLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeDashboardResponse",
}) as any as S.Schema<DescribeDashboardResponse>;
export interface DatasetStatus {
  state: string;
  error?: ErrorDetails;
}
export const DatasetStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(ErrorDetails) }),
).annotations({
  identifier: "DatasetStatus",
}) as any as S.Schema<DatasetStatus>;
export interface DescribeDatasetResponse {
  datasetId: string;
  datasetArn: string;
  datasetName: string;
  datasetDescription: string;
  datasetSource: DatasetSource;
  datasetStatus: DatasetStatus;
  datasetCreationDate: Date;
  datasetLastUpdateDate: Date;
  datasetVersion?: string;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.String,
    datasetArn: S.String,
    datasetName: S.String,
    datasetDescription: S.String,
    datasetSource: DatasetSource,
    datasetStatus: DatasetStatus,
    datasetCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    datasetLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    datasetVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeGatewayCapabilityConfigurationResponse {
  gatewayId: string;
  capabilityNamespace: string;
  capabilityConfiguration: string;
  capabilitySyncStatus: string;
}
export const DescribeGatewayCapabilityConfigurationResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    capabilityNamespace: S.String,
    capabilityConfiguration: S.String,
    capabilitySyncStatus: S.String,
  }),
).annotations({
  identifier: "DescribeGatewayCapabilityConfigurationResponse",
}) as any as S.Schema<DescribeGatewayCapabilityConfigurationResponse>;
export interface DescribeLoggingOptionsResponse {
  loggingOptions: LoggingOptions;
}
export const DescribeLoggingOptionsResponse = S.suspend(() =>
  S.Struct({ loggingOptions: LoggingOptions }),
).annotations({
  identifier: "DescribeLoggingOptionsResponse",
}) as any as S.Schema<DescribeLoggingOptionsResponse>;
export interface DescribeProjectResponse {
  projectId: string;
  projectArn: string;
  projectName: string;
  portalId: string;
  projectDescription?: string;
  projectCreationDate: Date;
  projectLastUpdateDate: Date;
}
export const DescribeProjectResponse = S.suspend(() =>
  S.Struct({
    projectId: S.String,
    projectArn: S.String,
    projectName: S.String,
    portalId: S.String,
    projectDescription: S.optional(S.String),
    projectCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    projectLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeProjectResponse",
}) as any as S.Schema<DescribeProjectResponse>;
export interface DescribeTimeSeriesResponse {
  assetId?: string;
  propertyId?: string;
  alias?: string;
  timeSeriesId: string;
  dataType: string;
  dataTypeSpec?: string;
  timeSeriesCreationDate: Date;
  timeSeriesLastUpdateDate: Date;
  timeSeriesArn: string;
}
export const DescribeTimeSeriesResponse = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    alias: S.optional(S.String),
    timeSeriesId: S.String,
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    timeSeriesCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeSeriesLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeSeriesArn: S.String,
  }),
).annotations({
  identifier: "DescribeTimeSeriesResponse",
}) as any as S.Schema<DescribeTimeSeriesResponse>;
export interface ExecuteActionRequest {
  targetResource: TargetResource;
  actionDefinitionId: string;
  actionPayload: ActionPayload;
  clientToken?: string;
  resolveTo?: ResolveTo;
}
export const ExecuteActionRequest = S.suspend(() =>
  S.Struct({
    targetResource: TargetResource,
    actionDefinitionId: S.String,
    actionPayload: ActionPayload,
    clientToken: S.optional(S.String),
    resolveTo: S.optional(ResolveTo),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteActionRequest",
}) as any as S.Schema<ExecuteActionRequest>;
export interface GetAssetPropertyValueResponse {
  propertyValue?: AssetPropertyValue;
}
export const GetAssetPropertyValueResponse = S.suspend(() =>
  S.Struct({ propertyValue: S.optional(AssetPropertyValue) }),
).annotations({
  identifier: "GetAssetPropertyValueResponse",
}) as any as S.Schema<GetAssetPropertyValueResponse>;
export interface GetAssetPropertyValueHistoryResponse {
  assetPropertyValueHistory: AssetPropertyValueHistory;
  nextToken?: string;
}
export const GetAssetPropertyValueHistoryResponse = S.suspend(() =>
  S.Struct({
    assetPropertyValueHistory: AssetPropertyValueHistory,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAssetPropertyValueHistoryResponse",
}) as any as S.Schema<GetAssetPropertyValueHistoryResponse>;
export interface AssetModelCompositeModelPathSegment {
  id?: string;
  name?: string;
}
export const AssetModelCompositeModelPathSegment = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "AssetModelCompositeModelPathSegment",
}) as any as S.Schema<AssetModelCompositeModelPathSegment>;
export type AssetModelCompositeModelPath =
  AssetModelCompositeModelPathSegment[];
export const AssetModelCompositeModelPath = S.Array(
  AssetModelCompositeModelPathSegment,
);
export interface AssetModelCompositeModelSummary {
  id: string;
  externalId?: string;
  name: string;
  type: string;
  description?: string;
  path?: AssetModelCompositeModelPath;
}
export const AssetModelCompositeModelSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    name: S.String,
    type: S.String,
    description: S.optional(S.String),
    path: S.optional(AssetModelCompositeModelPath),
  }),
).annotations({
  identifier: "AssetModelCompositeModelSummary",
}) as any as S.Schema<AssetModelCompositeModelSummary>;
export type AssetModelCompositeModelSummaries =
  AssetModelCompositeModelSummary[];
export const AssetModelCompositeModelSummaries = S.Array(
  AssetModelCompositeModelSummary,
);
export interface ListAssetModelCompositeModelsResponse {
  assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries;
  nextToken?: string;
}
export const ListAssetModelCompositeModelsResponse = S.suspend(() =>
  S.Struct({
    assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetModelCompositeModelsResponse",
}) as any as S.Schema<ListAssetModelCompositeModelsResponse>;
export interface ListProjectAssetsResponse {
  assetIds: AssetIDs;
  nextToken?: string;
}
export const ListProjectAssetsResponse = S.suspend(() =>
  S.Struct({ assetIds: AssetIDs, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListProjectAssetsResponse",
}) as any as S.Schema<ListProjectAssetsResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ConfigurationErrorDetails {
  code: string;
  message: string;
}
export const ConfigurationErrorDetails = S.suspend(() =>
  S.Struct({ code: S.String, message: S.String }),
).annotations({
  identifier: "ConfigurationErrorDetails",
}) as any as S.Schema<ConfigurationErrorDetails>;
export interface ConfigurationStatus {
  state: string;
  error?: ConfigurationErrorDetails;
}
export const ConfigurationStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(ConfigurationErrorDetails) }),
).annotations({
  identifier: "ConfigurationStatus",
}) as any as S.Schema<ConfigurationStatus>;
export interface PutDefaultEncryptionConfigurationResponse {
  encryptionType: string;
  kmsKeyArn?: string;
  configurationStatus: ConfigurationStatus;
}
export const PutDefaultEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
    configurationStatus: ConfigurationStatus,
  }),
).annotations({
  identifier: "PutDefaultEncryptionConfigurationResponse",
}) as any as S.Schema<PutDefaultEncryptionConfigurationResponse>;
export interface PutStorageConfigurationResponse {
  storageType: string;
  multiLayerStorage?: MultiLayerStorage;
  disassociatedDataStorage?: string;
  retentionPeriod?: RetentionPeriod;
  configurationStatus: ConfigurationStatus;
  warmTier?: string;
  warmTierRetentionPeriod?: WarmTierRetentionPeriod;
  disallowIngestNullNaN?: boolean;
}
export const PutStorageConfigurationResponse = S.suspend(() =>
  S.Struct({
    storageType: S.String,
    multiLayerStorage: S.optional(MultiLayerStorage),
    disassociatedDataStorage: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
    configurationStatus: ConfigurationStatus,
    warmTier: S.optional(S.String),
    warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
    disallowIngestNullNaN: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PutStorageConfigurationResponse",
}) as any as S.Schema<PutStorageConfigurationResponse>;
export interface UpdateAssetResponse {
  assetStatus: AssetStatus;
}
export const UpdateAssetResponse = S.suspend(() =>
  S.Struct({ assetStatus: AssetStatus }),
).annotations({
  identifier: "UpdateAssetResponse",
}) as any as S.Schema<UpdateAssetResponse>;
export interface UpdateAssetModelCompositeModelResponse {
  assetModelCompositeModelPath: AssetModelCompositeModelPath;
  assetModelStatus: AssetModelStatus;
}
export const UpdateAssetModelCompositeModelResponse = S.suspend(() =>
  S.Struct({
    assetModelCompositeModelPath: AssetModelCompositeModelPath,
    assetModelStatus: AssetModelStatus,
  }),
).annotations({
  identifier: "UpdateAssetModelCompositeModelResponse",
}) as any as S.Schema<UpdateAssetModelCompositeModelResponse>;
export interface UpdateComputationModelResponse {
  computationModelStatus: ComputationModelStatus;
}
export const UpdateComputationModelResponse = S.suspend(() =>
  S.Struct({ computationModelStatus: ComputationModelStatus }),
).annotations({
  identifier: "UpdateComputationModelResponse",
}) as any as S.Schema<UpdateComputationModelResponse>;
export interface UpdateDatasetResponse {
  datasetId?: string;
  datasetArn?: string;
  datasetStatus?: DatasetStatus;
}
export const UpdateDatasetResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    datasetArn: S.optional(S.String),
    datasetStatus: S.optional(DatasetStatus),
  }),
).annotations({
  identifier: "UpdateDatasetResponse",
}) as any as S.Schema<UpdateDatasetResponse>;
export interface UpdateGatewayCapabilityConfigurationResponse {
  capabilityNamespace: string;
  capabilitySyncStatus: string;
}
export const UpdateGatewayCapabilityConfigurationResponse = S.suspend(() =>
  S.Struct({ capabilityNamespace: S.String, capabilitySyncStatus: S.String }),
).annotations({
  identifier: "UpdateGatewayCapabilityConfigurationResponse",
}) as any as S.Schema<UpdateGatewayCapabilityConfigurationResponse>;
export interface PortalTypeEntry {
  portalTools?: PortalTools;
}
export const PortalTypeEntry = S.suspend(() =>
  S.Struct({ portalTools: S.optional(PortalTools) }),
).annotations({
  identifier: "PortalTypeEntry",
}) as any as S.Schema<PortalTypeEntry>;
export type PortalTypeConfiguration = { [key: string]: PortalTypeEntry };
export const PortalTypeConfiguration = S.Record({
  key: S.String,
  value: PortalTypeEntry,
});
export interface UpdatePortalRequest {
  portalId: string;
  portalName: string;
  portalDescription?: string;
  portalContactEmail: string | Redacted.Redacted<string>;
  portalLogoImage?: Image;
  roleArn: string;
  clientToken?: string;
  notificationSenderEmail?: string | Redacted.Redacted<string>;
  alarms?: Alarms;
  portalType?: string;
  portalTypeConfiguration?: PortalTypeConfiguration;
}
export const UpdatePortalRequest = S.suspend(() =>
  S.Struct({
    portalId: S.String.pipe(T.HttpLabel("portalId")),
    portalName: S.String,
    portalDescription: S.optional(S.String),
    portalContactEmail: SensitiveString,
    portalLogoImage: S.optional(Image),
    roleArn: S.String,
    clientToken: S.optional(S.String),
    notificationSenderEmail: S.optional(SensitiveString),
    alarms: S.optional(Alarms),
    portalType: S.optional(S.String),
    portalTypeConfiguration: S.optional(PortalTypeConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/portals/{portalId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePortalRequest",
}) as any as S.Schema<UpdatePortalRequest>;
export interface Greengrass {
  groupArn: string;
}
export const Greengrass = S.suspend(() =>
  S.Struct({ groupArn: S.String }),
).annotations({ identifier: "Greengrass" }) as any as S.Schema<Greengrass>;
export interface GreengrassV2 {
  coreDeviceThingName: string;
  coreDeviceOperatingSystem?: string;
}
export const GreengrassV2 = S.suspend(() =>
  S.Struct({
    coreDeviceThingName: S.String,
    coreDeviceOperatingSystem: S.optional(S.String),
  }),
).annotations({ identifier: "GreengrassV2" }) as any as S.Schema<GreengrassV2>;
export interface SiemensIE {
  iotCoreThingName: string;
}
export const SiemensIE = S.suspend(() =>
  S.Struct({ iotCoreThingName: S.String }),
).annotations({ identifier: "SiemensIE" }) as any as S.Schema<SiemensIE>;
export interface AssetBindingValueFilter {
  assetId: string;
}
export const AssetBindingValueFilter = S.suspend(() =>
  S.Struct({ assetId: S.String }),
).annotations({
  identifier: "AssetBindingValueFilter",
}) as any as S.Schema<AssetBindingValueFilter>;
export interface AssetModelBindingValueFilter {
  assetModelId: string;
}
export const AssetModelBindingValueFilter = S.suspend(() =>
  S.Struct({ assetModelId: S.String }),
).annotations({
  identifier: "AssetModelBindingValueFilter",
}) as any as S.Schema<AssetModelBindingValueFilter>;
export interface AssetPropertyBindingValueFilter {
  assetId: string;
  propertyId: string;
}
export const AssetPropertyBindingValueFilter = S.suspend(() =>
  S.Struct({ assetId: S.String, propertyId: S.String }),
).annotations({
  identifier: "AssetPropertyBindingValueFilter",
}) as any as S.Schema<AssetPropertyBindingValueFilter>;
export interface AssetModelPropertyBindingValueFilter {
  assetModelId: string;
  propertyId: string;
}
export const AssetModelPropertyBindingValueFilter = S.suspend(() =>
  S.Struct({ assetModelId: S.String, propertyId: S.String }),
).annotations({
  identifier: "AssetModelPropertyBindingValueFilter",
}) as any as S.Schema<AssetModelPropertyBindingValueFilter>;
export interface PropertyMapping {
  assetModelPropertyId: string;
  interfaceAssetModelPropertyId: string;
}
export const PropertyMapping = S.suspend(() =>
  S.Struct({
    assetModelPropertyId: S.String,
    interfaceAssetModelPropertyId: S.String,
  }),
).annotations({
  identifier: "PropertyMapping",
}) as any as S.Schema<PropertyMapping>;
export type PropertyMappings = PropertyMapping[];
export const PropertyMappings = S.Array(PropertyMapping);
export type BatchAssociateProjectAssetsErrors = AssetErrorDetails[];
export const BatchAssociateProjectAssetsErrors = S.Array(AssetErrorDetails);
export interface GatewayPlatform {
  greengrass?: Greengrass;
  greengrassV2?: GreengrassV2;
  siemensIE?: SiemensIE;
}
export const GatewayPlatform = S.suspend(() =>
  S.Struct({
    greengrass: S.optional(Greengrass),
    greengrassV2: S.optional(GreengrassV2),
    siemensIE: S.optional(SiemensIE),
  }),
).annotations({
  identifier: "GatewayPlatform",
}) as any as S.Schema<GatewayPlatform>;
export interface AssetHierarchy {
  id?: string;
  externalId?: string;
  name: string;
}
export const AssetHierarchy = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
  }),
).annotations({
  identifier: "AssetHierarchy",
}) as any as S.Schema<AssetHierarchy>;
export type AssetHierarchies = AssetHierarchy[];
export const AssetHierarchies = S.Array(AssetHierarchy);
export interface PropertyNotification {
  topic: string;
  state: string;
}
export const PropertyNotification = S.suspend(() =>
  S.Struct({ topic: S.String, state: S.String }),
).annotations({
  identifier: "PropertyNotification",
}) as any as S.Schema<PropertyNotification>;
export interface AssetPropertyPathSegment {
  id?: string;
  name?: string;
}
export const AssetPropertyPathSegment = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "AssetPropertyPathSegment",
}) as any as S.Schema<AssetPropertyPathSegment>;
export type AssetPropertyPath = AssetPropertyPathSegment[];
export const AssetPropertyPath = S.Array(AssetPropertyPathSegment);
export interface AssetProperty {
  id: string;
  externalId?: string;
  name: string;
  alias?: string;
  notification?: PropertyNotification;
  dataType: string;
  dataTypeSpec?: string;
  unit?: string;
  path?: AssetPropertyPath;
}
export const AssetProperty = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    name: S.String,
    alias: S.optional(S.String),
    notification: S.optional(PropertyNotification),
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    unit: S.optional(S.String),
    path: S.optional(AssetPropertyPath),
  }),
).annotations({
  identifier: "AssetProperty",
}) as any as S.Schema<AssetProperty>;
export type AssetProperties = AssetProperty[];
export const AssetProperties = S.Array(AssetProperty);
export interface AssetCompositeModel {
  name: string;
  description?: string;
  type: string;
  properties: AssetProperties;
  id?: string;
  externalId?: string;
}
export const AssetCompositeModel = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    type: S.String,
    properties: AssetProperties,
    id: S.optional(S.String),
    externalId: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetCompositeModel",
}) as any as S.Schema<AssetCompositeModel>;
export type AssetCompositeModels = AssetCompositeModel[];
export const AssetCompositeModels = S.Array(AssetCompositeModel);
export interface AssetCompositeModelPathSegment {
  id?: string;
  name?: string;
}
export const AssetCompositeModelPathSegment = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "AssetCompositeModelPathSegment",
}) as any as S.Schema<AssetCompositeModelPathSegment>;
export type AssetCompositeModelPath = AssetCompositeModelPathSegment[];
export const AssetCompositeModelPath = S.Array(AssetCompositeModelPathSegment);
export interface AssetCompositeModelSummary {
  id: string;
  externalId?: string;
  name: string;
  type: string;
  description: string;
  path: AssetCompositeModelPath;
}
export const AssetCompositeModelSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    name: S.String,
    type: S.String,
    description: S.String,
    path: AssetCompositeModelPath,
  }),
).annotations({
  identifier: "AssetCompositeModelSummary",
}) as any as S.Schema<AssetCompositeModelSummary>;
export type AssetCompositeModelSummaries = AssetCompositeModelSummary[];
export const AssetCompositeModelSummaries = S.Array(AssetCompositeModelSummary);
export interface InterfaceRelationship {
  id: string;
}
export const InterfaceRelationship = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "InterfaceRelationship",
}) as any as S.Schema<InterfaceRelationship>;
export type InterfaceDetails = InterfaceRelationship[];
export const InterfaceDetails = S.Array(InterfaceRelationship);
export interface HierarchyMapping {
  assetModelHierarchyId: string;
  interfaceAssetModelHierarchyId: string;
}
export const HierarchyMapping = S.suspend(() =>
  S.Struct({
    assetModelHierarchyId: S.String,
    interfaceAssetModelHierarchyId: S.String,
  }),
).annotations({
  identifier: "HierarchyMapping",
}) as any as S.Schema<HierarchyMapping>;
export type HierarchyMappings = HierarchyMapping[];
export const HierarchyMappings = S.Array(HierarchyMapping);
export interface Property {
  id: string;
  externalId?: string;
  name: string;
  alias?: string;
  notification?: PropertyNotification;
  dataType: string;
  unit?: string;
  type?: PropertyType;
  path?: AssetPropertyPath;
}
export const Property = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    name: S.String,
    alias: S.optional(S.String),
    notification: S.optional(PropertyNotification),
    dataType: S.String,
    unit: S.optional(S.String),
    type: S.optional(PropertyType),
    path: S.optional(AssetPropertyPath),
  }),
).annotations({ identifier: "Property" }) as any as S.Schema<Property>;
export interface CompositeModelProperty {
  name: string;
  type: string;
  assetProperty: Property;
  id?: string;
  externalId?: string;
}
export const CompositeModelProperty = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    assetProperty: Property,
    id: S.optional(S.String),
    externalId: S.optional(S.String),
  }),
).annotations({
  identifier: "CompositeModelProperty",
}) as any as S.Schema<CompositeModelProperty>;
export type ComputationModelExecutionSummary = { [key: string]: string };
export const ComputationModelExecutionSummary = S.Record({
  key: S.String,
  value: S.String,
});
export interface ExecutionStatus {
  state: string;
}
export const ExecutionStatus = S.suspend(() =>
  S.Struct({ state: S.String }),
).annotations({
  identifier: "ExecutionStatus",
}) as any as S.Schema<ExecutionStatus>;
export type ExecutionResult = { [key: string]: string };
export const ExecutionResult = S.Record({ key: S.String, value: S.String });
export type ExecutionDetails = { [key: string]: string };
export const ExecutionDetails = S.Record({ key: S.String, value: S.String });
export interface GatewayCapabilitySummary {
  capabilityNamespace: string;
  capabilitySyncStatus: string;
}
export const GatewayCapabilitySummary = S.suspend(() =>
  S.Struct({ capabilityNamespace: S.String, capabilitySyncStatus: S.String }),
).annotations({
  identifier: "GatewayCapabilitySummary",
}) as any as S.Schema<GatewayCapabilitySummary>;
export type GatewayCapabilitySummaries = GatewayCapabilitySummary[];
export const GatewayCapabilitySummaries = S.Array(GatewayCapabilitySummary);
export interface ImageLocation {
  id: string;
  url: string;
}
export const ImageLocation = S.suspend(() =>
  S.Struct({ id: S.String, url: S.String }),
).annotations({
  identifier: "ImageLocation",
}) as any as S.Schema<ImageLocation>;
export interface InterpolatedAssetPropertyValue {
  timestamp: TimeInNanos;
  value: Variant;
}
export const InterpolatedAssetPropertyValue = S.suspend(() =>
  S.Struct({ timestamp: TimeInNanos, value: Variant }),
).annotations({
  identifier: "InterpolatedAssetPropertyValue",
}) as any as S.Schema<InterpolatedAssetPropertyValue>;
export type InterpolatedAssetPropertyValues = InterpolatedAssetPropertyValue[];
export const InterpolatedAssetPropertyValues = S.Array(
  InterpolatedAssetPropertyValue,
);
export interface AccessPolicySummary {
  id: string;
  identity: Identity;
  resource: Resource;
  permission: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}
export const AccessPolicySummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    identity: Identity,
    resource: Resource,
    permission: S.String,
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AccessPolicySummary",
}) as any as S.Schema<AccessPolicySummary>;
export type AccessPolicySummaries = AccessPolicySummary[];
export const AccessPolicySummaries = S.Array(AccessPolicySummary);
export interface ActionSummary {
  actionId?: string;
  actionDefinitionId?: string;
  targetResource?: TargetResource;
  resolveTo?: ResolveTo;
}
export const ActionSummary = S.suspend(() =>
  S.Struct({
    actionId: S.optional(S.String),
    actionDefinitionId: S.optional(S.String),
    targetResource: S.optional(TargetResource),
    resolveTo: S.optional(ResolveTo),
  }),
).annotations({
  identifier: "ActionSummary",
}) as any as S.Schema<ActionSummary>;
export type ActionSummaries = ActionSummary[];
export const ActionSummaries = S.Array(ActionSummary);
export interface AssetModelSummary {
  id: string;
  externalId?: string;
  arn: string;
  name: string;
  assetModelType?: string;
  description: string;
  creationDate: Date;
  lastUpdateDate: Date;
  status: AssetModelStatus;
  version?: string;
}
export const AssetModelSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    arn: S.String,
    name: S.String,
    assetModelType: S.optional(S.String),
    description: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: AssetModelStatus,
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetModelSummary",
}) as any as S.Schema<AssetModelSummary>;
export type AssetModelSummaries = AssetModelSummary[];
export const AssetModelSummaries = S.Array(AssetModelSummary);
export interface AssetPropertySummary {
  id: string;
  externalId?: string;
  alias?: string;
  unit?: string;
  notification?: PropertyNotification;
  assetCompositeModelId?: string;
  path?: AssetPropertyPath;
}
export const AssetPropertySummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    alias: S.optional(S.String),
    unit: S.optional(S.String),
    notification: S.optional(PropertyNotification),
    assetCompositeModelId: S.optional(S.String),
    path: S.optional(AssetPropertyPath),
  }),
).annotations({
  identifier: "AssetPropertySummary",
}) as any as S.Schema<AssetPropertySummary>;
export type AssetPropertySummaries = AssetPropertySummary[];
export const AssetPropertySummaries = S.Array(AssetPropertySummary);
export interface AssetSummary {
  id: string;
  externalId?: string;
  arn: string;
  name: string;
  assetModelId: string;
  creationDate: Date;
  lastUpdateDate: Date;
  status: AssetStatus;
  hierarchies: AssetHierarchies;
  description?: string;
}
export const AssetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    arn: S.String,
    name: S.String,
    assetModelId: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: AssetStatus,
    hierarchies: AssetHierarchies,
    description: S.optional(S.String),
  }),
).annotations({ identifier: "AssetSummary" }) as any as S.Schema<AssetSummary>;
export type AssetSummaries = AssetSummary[];
export const AssetSummaries = S.Array(AssetSummary);
export interface AssociatedAssetsSummary {
  id: string;
  externalId?: string;
  arn: string;
  name: string;
  assetModelId: string;
  creationDate: Date;
  lastUpdateDate: Date;
  status: AssetStatus;
  hierarchies: AssetHierarchies;
  description?: string;
}
export const AssociatedAssetsSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    externalId: S.optional(S.String),
    arn: S.String,
    name: S.String,
    assetModelId: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: AssetStatus,
    hierarchies: AssetHierarchies,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedAssetsSummary",
}) as any as S.Schema<AssociatedAssetsSummary>;
export type AssociatedAssetsSummaries = AssociatedAssetsSummary[];
export const AssociatedAssetsSummaries = S.Array(AssociatedAssetsSummary);
export interface JobSummary {
  id: string;
  name: string;
  status: string;
}
export const JobSummary = S.suspend(() =>
  S.Struct({ id: S.String, name: S.String, status: S.String }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaries = JobSummary[];
export const JobSummaries = S.Array(JobSummary);
export interface CompositionRelationshipSummary {
  assetModelId: string;
  assetModelCompositeModelId: string;
  assetModelCompositeModelType: string;
}
export const CompositionRelationshipSummary = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    assetModelCompositeModelId: S.String,
    assetModelCompositeModelType: S.String,
  }),
).annotations({
  identifier: "CompositionRelationshipSummary",
}) as any as S.Schema<CompositionRelationshipSummary>;
export type CompositionRelationshipSummaries = CompositionRelationshipSummary[];
export const CompositionRelationshipSummaries = S.Array(
  CompositionRelationshipSummary,
);
export interface DataBindingValueFilter {
  asset?: AssetBindingValueFilter;
  assetModel?: AssetModelBindingValueFilter;
  assetProperty?: AssetPropertyBindingValueFilter;
  assetModelProperty?: AssetModelPropertyBindingValueFilter;
}
export const DataBindingValueFilter = S.suspend(() =>
  S.Struct({
    asset: S.optional(AssetBindingValueFilter),
    assetModel: S.optional(AssetModelBindingValueFilter),
    assetProperty: S.optional(AssetPropertyBindingValueFilter),
    assetModelProperty: S.optional(AssetModelPropertyBindingValueFilter),
  }),
).annotations({
  identifier: "DataBindingValueFilter",
}) as any as S.Schema<DataBindingValueFilter>;
export interface ComputationModelResolveToResourceSummary {
  resolveTo?: ResolveTo;
}
export const ComputationModelResolveToResourceSummary = S.suspend(() =>
  S.Struct({ resolveTo: S.optional(ResolveTo) }),
).annotations({
  identifier: "ComputationModelResolveToResourceSummary",
}) as any as S.Schema<ComputationModelResolveToResourceSummary>;
export type ComputationModelResolveToResourceSummaries =
  ComputationModelResolveToResourceSummary[];
export const ComputationModelResolveToResourceSummaries = S.Array(
  ComputationModelResolveToResourceSummary,
);
export interface ComputationModelSummary {
  id: string;
  arn: string;
  name: string;
  description?: string;
  type: string;
  creationDate: Date;
  lastUpdateDate: Date;
  status: ComputationModelStatus;
  version: string;
}
export const ComputationModelSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.optional(S.String),
    type: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: ComputationModelStatus,
    version: S.String,
  }),
).annotations({
  identifier: "ComputationModelSummary",
}) as any as S.Schema<ComputationModelSummary>;
export type ComputationModelSummaries = ComputationModelSummary[];
export const ComputationModelSummaries = S.Array(ComputationModelSummary);
export interface DashboardSummary {
  id: string;
  name: string;
  description?: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}
export const DashboardSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DashboardSummary",
}) as any as S.Schema<DashboardSummary>;
export type DashboardSummaries = DashboardSummary[];
export const DashboardSummaries = S.Array(DashboardSummary);
export interface DatasetSummary {
  id: string;
  arn: string;
  name: string;
  description: string;
  creationDate: Date;
  lastUpdateDate: Date;
  status: DatasetStatus;
}
export const DatasetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.String,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: DatasetStatus,
  }),
).annotations({
  identifier: "DatasetSummary",
}) as any as S.Schema<DatasetSummary>;
export type DatasetSummaries = DatasetSummary[];
export const DatasetSummaries = S.Array(DatasetSummary);
export interface ExecutionSummary {
  executionId: string;
  actionType?: string;
  targetResource: TargetResource;
  targetResourceVersion: string;
  resolveTo?: ResolveTo;
  executionStartTime: Date;
  executionEndTime?: Date;
  executionStatus: ExecutionStatus;
  executionEntityVersion?: string;
}
export const ExecutionSummary = S.suspend(() =>
  S.Struct({
    executionId: S.String,
    actionType: S.optional(S.String),
    targetResource: TargetResource,
    targetResourceVersion: S.String,
    resolveTo: S.optional(ResolveTo),
    executionStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    executionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    executionStatus: ExecutionStatus,
    executionEntityVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionSummary",
}) as any as S.Schema<ExecutionSummary>;
export type ExecutionSummaries = ExecutionSummary[];
export const ExecutionSummaries = S.Array(ExecutionSummary);
export interface GatewaySummary {
  gatewayId: string;
  gatewayName: string;
  gatewayPlatform?: GatewayPlatform;
  gatewayVersion?: string;
  gatewayCapabilitySummaries?: GatewayCapabilitySummaries;
  creationDate: Date;
  lastUpdateDate: Date;
}
export const GatewaySummary = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    gatewayName: S.String,
    gatewayPlatform: S.optional(GatewayPlatform),
    gatewayVersion: S.optional(S.String),
    gatewayCapabilitySummaries: S.optional(GatewayCapabilitySummaries),
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GatewaySummary",
}) as any as S.Schema<GatewaySummary>;
export type GatewaySummaries = GatewaySummary[];
export const GatewaySummaries = S.Array(GatewaySummary);
export interface InterfaceRelationshipSummary {
  id: string;
}
export const InterfaceRelationshipSummary = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "InterfaceRelationshipSummary",
}) as any as S.Schema<InterfaceRelationshipSummary>;
export type InterfaceRelationshipSummaries = InterfaceRelationshipSummary[];
export const InterfaceRelationshipSummaries = S.Array(
  InterfaceRelationshipSummary,
);
export interface MonitorErrorDetails {
  code?: string;
  message?: string;
}
export const MonitorErrorDetails = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "MonitorErrorDetails",
}) as any as S.Schema<MonitorErrorDetails>;
export interface PortalStatus {
  state: string;
  error?: MonitorErrorDetails;
}
export const PortalStatus = S.suspend(() =>
  S.Struct({ state: S.String, error: S.optional(MonitorErrorDetails) }),
).annotations({ identifier: "PortalStatus" }) as any as S.Schema<PortalStatus>;
export interface PortalSummary {
  id: string;
  name: string;
  description?: string;
  startUrl: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
  roleArn?: string;
  status: PortalStatus;
  portalType?: string;
}
export const PortalSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(S.String),
    startUrl: S.String,
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    roleArn: S.optional(S.String),
    status: PortalStatus,
    portalType: S.optional(S.String),
  }),
).annotations({
  identifier: "PortalSummary",
}) as any as S.Schema<PortalSummary>;
export type PortalSummaries = PortalSummary[];
export const PortalSummaries = S.Array(PortalSummary);
export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  creationDate?: Date;
  lastUpdateDate?: Date;
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.String,
    description: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export type ProjectSummaries = ProjectSummary[];
export const ProjectSummaries = S.Array(ProjectSummary);
export interface TimeSeriesSummary {
  assetId?: string;
  propertyId?: string;
  alias?: string;
  timeSeriesId: string;
  dataType: string;
  dataTypeSpec?: string;
  timeSeriesCreationDate: Date;
  timeSeriesLastUpdateDate: Date;
  timeSeriesArn: string;
}
export const TimeSeriesSummary = S.suspend(() =>
  S.Struct({
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    alias: S.optional(S.String),
    timeSeriesId: S.String,
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    timeSeriesCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeSeriesLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    timeSeriesArn: S.String,
  }),
).annotations({
  identifier: "TimeSeriesSummary",
}) as any as S.Schema<TimeSeriesSummary>;
export type TimeSeriesSummaries = TimeSeriesSummary[];
export const TimeSeriesSummaries = S.Array(TimeSeriesSummary);
export interface PropertyMappingConfiguration {
  matchByPropertyName?: boolean;
  createMissingProperty?: boolean;
  overrides?: PropertyMappings;
}
export const PropertyMappingConfiguration = S.suspend(() =>
  S.Struct({
    matchByPropertyName: S.optional(S.Boolean),
    createMissingProperty: S.optional(S.Boolean),
    overrides: S.optional(PropertyMappings),
  }),
).annotations({
  identifier: "PropertyMappingConfiguration",
}) as any as S.Schema<PropertyMappingConfiguration>;
export interface BatchAssociateProjectAssetsResponse {
  errors?: BatchAssociateProjectAssetsErrors;
}
export const BatchAssociateProjectAssetsResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchAssociateProjectAssetsErrors) }),
).annotations({
  identifier: "BatchAssociateProjectAssetsResponse",
}) as any as S.Schema<BatchAssociateProjectAssetsResponse>;
export interface CreateAccessPolicyRequest {
  accessPolicyIdentity: Identity;
  accessPolicyResource: Resource;
  accessPolicyPermission: string;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateAccessPolicyRequest = S.suspend(() =>
  S.Struct({
    accessPolicyIdentity: Identity,
    accessPolicyResource: Resource,
    accessPolicyPermission: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/access-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessPolicyRequest",
}) as any as S.Schema<CreateAccessPolicyRequest>;
export interface CreateAssetModelCompositeModelResponse {
  assetModelCompositeModelId: string;
  assetModelCompositeModelPath: AssetModelCompositeModelPath;
  assetModelStatus: AssetModelStatus;
}
export const CreateAssetModelCompositeModelResponse = S.suspend(() =>
  S.Struct({
    assetModelCompositeModelId: S.String,
    assetModelCompositeModelPath: AssetModelCompositeModelPath,
    assetModelStatus: AssetModelStatus,
  }),
).annotations({
  identifier: "CreateAssetModelCompositeModelResponse",
}) as any as S.Schema<CreateAssetModelCompositeModelResponse>;
export interface CreateGatewayRequest {
  gatewayName: string;
  gatewayPlatform: GatewayPlatform;
  gatewayVersion?: string;
  tags?: TagMap;
}
export const CreateGatewayRequest = S.suspend(() =>
  S.Struct({
    gatewayName: S.String,
    gatewayPlatform: GatewayPlatform,
    gatewayVersion: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/20200301/gateways" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGatewayRequest",
}) as any as S.Schema<CreateGatewayRequest>;
export interface CreatePortalRequest {
  portalName: string;
  portalDescription?: string;
  portalContactEmail: string | Redacted.Redacted<string>;
  clientToken?: string;
  portalLogoImageFile?: ImageFile;
  roleArn: string;
  tags?: TagMap;
  portalAuthMode?: string;
  notificationSenderEmail?: string | Redacted.Redacted<string>;
  alarms?: Alarms;
  portalType?: string;
  portalTypeConfiguration?: PortalTypeConfiguration;
}
export const CreatePortalRequest = S.suspend(() =>
  S.Struct({
    portalName: S.String,
    portalDescription: S.optional(S.String),
    portalContactEmail: SensitiveString,
    clientToken: S.optional(S.String),
    portalLogoImageFile: S.optional(ImageFile),
    roleArn: S.String,
    tags: S.optional(TagMap),
    portalAuthMode: S.optional(S.String),
    notificationSenderEmail: S.optional(SensitiveString),
    alarms: S.optional(Alarms),
    portalType: S.optional(S.String),
    portalTypeConfiguration: S.optional(PortalTypeConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/portals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePortalRequest",
}) as any as S.Schema<CreatePortalRequest>;
export interface DeleteComputationModelResponse {
  computationModelStatus: ComputationModelStatus;
}
export const DeleteComputationModelResponse = S.suspend(() =>
  S.Struct({ computationModelStatus: ComputationModelStatus }),
).annotations({
  identifier: "DeleteComputationModelResponse",
}) as any as S.Schema<DeleteComputationModelResponse>;
export interface DeleteDatasetResponse {
  datasetStatus: DatasetStatus;
}
export const DeleteDatasetResponse = S.suspend(() =>
  S.Struct({ datasetStatus: DatasetStatus }),
).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DescribeAssetCompositeModelResponse {
  assetId: string;
  assetCompositeModelId: string;
  assetCompositeModelExternalId?: string;
  assetCompositeModelPath: AssetCompositeModelPath;
  assetCompositeModelName: string;
  assetCompositeModelDescription: string;
  assetCompositeModelType: string;
  assetCompositeModelProperties: AssetProperties;
  assetCompositeModelSummaries: AssetCompositeModelSummaries;
  actionDefinitions?: ActionDefinitions;
}
export const DescribeAssetCompositeModelResponse = S.suspend(() =>
  S.Struct({
    assetId: S.String,
    assetCompositeModelId: S.String,
    assetCompositeModelExternalId: S.optional(S.String),
    assetCompositeModelPath: AssetCompositeModelPath,
    assetCompositeModelName: S.String,
    assetCompositeModelDescription: S.String,
    assetCompositeModelType: S.String,
    assetCompositeModelProperties: AssetProperties,
    assetCompositeModelSummaries: AssetCompositeModelSummaries,
    actionDefinitions: S.optional(ActionDefinitions),
  }),
).annotations({
  identifier: "DescribeAssetCompositeModelResponse",
}) as any as S.Schema<DescribeAssetCompositeModelResponse>;
export interface DescribeAssetModelResponse {
  assetModelId: string;
  assetModelExternalId?: string;
  assetModelArn: string;
  assetModelName: string;
  assetModelType?: string;
  assetModelDescription: string;
  assetModelProperties: AssetModelProperties;
  assetModelHierarchies: AssetModelHierarchies;
  assetModelCompositeModels?: AssetModelCompositeModels;
  assetModelCompositeModelSummaries?: AssetModelCompositeModelSummaries;
  assetModelCreationDate: Date;
  assetModelLastUpdateDate: Date;
  assetModelStatus: AssetModelStatus;
  assetModelVersion?: string;
  interfaceDetails?: InterfaceDetails;
  eTag?: string;
}
export const DescribeAssetModelResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    assetModelExternalId: S.optional(S.String),
    assetModelArn: S.String,
    assetModelName: S.String,
    assetModelType: S.optional(S.String),
    assetModelDescription: S.String,
    assetModelProperties: AssetModelProperties,
    assetModelHierarchies: AssetModelHierarchies,
    assetModelCompositeModels: S.optional(AssetModelCompositeModels),
    assetModelCompositeModelSummaries: S.optional(
      AssetModelCompositeModelSummaries,
    ),
    assetModelCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    assetModelLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    assetModelStatus: AssetModelStatus,
    assetModelVersion: S.optional(S.String),
    interfaceDetails: S.optional(InterfaceDetails),
    eTag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "DescribeAssetModelResponse",
}) as any as S.Schema<DescribeAssetModelResponse>;
export interface DescribeAssetModelInterfaceRelationshipResponse {
  assetModelId: string;
  interfaceAssetModelId: string;
  propertyMappings: PropertyMappings;
  hierarchyMappings: HierarchyMappings;
}
export const DescribeAssetModelInterfaceRelationshipResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    interfaceAssetModelId: S.String,
    propertyMappings: PropertyMappings,
    hierarchyMappings: HierarchyMappings,
  }),
).annotations({
  identifier: "DescribeAssetModelInterfaceRelationshipResponse",
}) as any as S.Schema<DescribeAssetModelInterfaceRelationshipResponse>;
export interface DescribeAssetPropertyResponse {
  assetId: string;
  assetExternalId?: string;
  assetName: string;
  assetModelId: string;
  assetProperty?: Property;
  compositeModel?: CompositeModelProperty;
}
export const DescribeAssetPropertyResponse = S.suspend(() =>
  S.Struct({
    assetId: S.String,
    assetExternalId: S.optional(S.String),
    assetName: S.String,
    assetModelId: S.String,
    assetProperty: S.optional(Property),
    compositeModel: S.optional(CompositeModelProperty),
  }),
).annotations({
  identifier: "DescribeAssetPropertyResponse",
}) as any as S.Schema<DescribeAssetPropertyResponse>;
export interface DescribeComputationModelExecutionSummaryResponse {
  computationModelId: string;
  resolveTo?: ResolveTo;
  computationModelExecutionSummary: ComputationModelExecutionSummary;
}
export const DescribeComputationModelExecutionSummaryResponse = S.suspend(() =>
  S.Struct({
    computationModelId: S.String,
    resolveTo: S.optional(ResolveTo),
    computationModelExecutionSummary: ComputationModelExecutionSummary,
  }),
).annotations({
  identifier: "DescribeComputationModelExecutionSummaryResponse",
}) as any as S.Schema<DescribeComputationModelExecutionSummaryResponse>;
export interface DescribeDefaultEncryptionConfigurationResponse {
  encryptionType: string;
  kmsKeyArn?: string;
  configurationStatus: ConfigurationStatus;
}
export const DescribeDefaultEncryptionConfigurationResponse = S.suspend(() =>
  S.Struct({
    encryptionType: S.String,
    kmsKeyArn: S.optional(S.String),
    configurationStatus: ConfigurationStatus,
  }),
).annotations({
  identifier: "DescribeDefaultEncryptionConfigurationResponse",
}) as any as S.Schema<DescribeDefaultEncryptionConfigurationResponse>;
export interface DescribeExecutionResponse {
  executionId: string;
  actionType?: string;
  targetResource: TargetResource;
  targetResourceVersion: string;
  resolveTo?: ResolveTo;
  executionStartTime: Date;
  executionEndTime?: Date;
  executionStatus: ExecutionStatus;
  executionResult?: ExecutionResult;
  executionDetails?: ExecutionDetails;
  executionEntityVersion?: string;
}
export const DescribeExecutionResponse = S.suspend(() =>
  S.Struct({
    executionId: S.String,
    actionType: S.optional(S.String),
    targetResource: TargetResource,
    targetResourceVersion: S.String,
    resolveTo: S.optional(ResolveTo),
    executionStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    executionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    executionStatus: ExecutionStatus,
    executionResult: S.optional(ExecutionResult),
    executionDetails: S.optional(ExecutionDetails),
    executionEntityVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeExecutionResponse",
}) as any as S.Schema<DescribeExecutionResponse>;
export interface DescribeGatewayResponse {
  gatewayId: string;
  gatewayName: string;
  gatewayArn: string;
  gatewayPlatform?: GatewayPlatform;
  gatewayVersion?: string;
  gatewayCapabilitySummaries: GatewayCapabilitySummaries;
  creationDate: Date;
  lastUpdateDate: Date;
}
export const DescribeGatewayResponse = S.suspend(() =>
  S.Struct({
    gatewayId: S.String,
    gatewayName: S.String,
    gatewayArn: S.String,
    gatewayPlatform: S.optional(GatewayPlatform),
    gatewayVersion: S.optional(S.String),
    gatewayCapabilitySummaries: GatewayCapabilitySummaries,
    creationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeGatewayResponse",
}) as any as S.Schema<DescribeGatewayResponse>;
export interface DescribePortalResponse {
  portalId: string;
  portalArn: string;
  portalName: string;
  portalDescription?: string;
  portalClientId: string;
  portalStartUrl: string;
  portalContactEmail: string | Redacted.Redacted<string>;
  portalStatus: PortalStatus;
  portalCreationDate: Date;
  portalLastUpdateDate: Date;
  portalLogoImageLocation?: ImageLocation;
  roleArn?: string;
  portalAuthMode?: string;
  notificationSenderEmail?: string | Redacted.Redacted<string>;
  alarms?: Alarms;
  portalType?: string;
  portalTypeConfiguration?: PortalTypeConfiguration;
}
export const DescribePortalResponse = S.suspend(() =>
  S.Struct({
    portalId: S.String,
    portalArn: S.String,
    portalName: S.String,
    portalDescription: S.optional(S.String),
    portalClientId: S.String,
    portalStartUrl: S.String,
    portalContactEmail: SensitiveString,
    portalStatus: PortalStatus,
    portalCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    portalLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    portalLogoImageLocation: S.optional(ImageLocation),
    roleArn: S.optional(S.String),
    portalAuthMode: S.optional(S.String),
    notificationSenderEmail: S.optional(SensitiveString),
    alarms: S.optional(Alarms),
    portalType: S.optional(S.String),
    portalTypeConfiguration: S.optional(PortalTypeConfiguration),
  }),
).annotations({
  identifier: "DescribePortalResponse",
}) as any as S.Schema<DescribePortalResponse>;
export interface DescribeStorageConfigurationResponse {
  storageType: string;
  multiLayerStorage?: MultiLayerStorage;
  disassociatedDataStorage?: string;
  retentionPeriod?: RetentionPeriod;
  configurationStatus: ConfigurationStatus;
  lastUpdateDate?: Date;
  warmTier?: string;
  warmTierRetentionPeriod?: WarmTierRetentionPeriod;
  disallowIngestNullNaN?: boolean;
}
export const DescribeStorageConfigurationResponse = S.suspend(() =>
  S.Struct({
    storageType: S.String,
    multiLayerStorage: S.optional(MultiLayerStorage),
    disassociatedDataStorage: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
    configurationStatus: ConfigurationStatus,
    lastUpdateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    warmTier: S.optional(S.String),
    warmTierRetentionPeriod: S.optional(WarmTierRetentionPeriod),
    disallowIngestNullNaN: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeStorageConfigurationResponse",
}) as any as S.Schema<DescribeStorageConfigurationResponse>;
export interface ExecuteActionResponse {
  actionId: string;
}
export const ExecuteActionResponse = S.suspend(() =>
  S.Struct({ actionId: S.String }),
).annotations({
  identifier: "ExecuteActionResponse",
}) as any as S.Schema<ExecuteActionResponse>;
export interface GetInterpolatedAssetPropertyValuesResponse {
  interpolatedAssetPropertyValues: InterpolatedAssetPropertyValues;
  nextToken?: string;
}
export const GetInterpolatedAssetPropertyValuesResponse = S.suspend(() =>
  S.Struct({
    interpolatedAssetPropertyValues: InterpolatedAssetPropertyValues,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetInterpolatedAssetPropertyValuesResponse",
}) as any as S.Schema<GetInterpolatedAssetPropertyValuesResponse>;
export interface ListAccessPoliciesResponse {
  accessPolicySummaries: AccessPolicySummaries;
  nextToken?: string;
}
export const ListAccessPoliciesResponse = S.suspend(() =>
  S.Struct({
    accessPolicySummaries: AccessPolicySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessPoliciesResponse",
}) as any as S.Schema<ListAccessPoliciesResponse>;
export interface ListActionsResponse {
  actionSummaries: ActionSummaries;
  nextToken: string;
}
export const ListActionsResponse = S.suspend(() =>
  S.Struct({ actionSummaries: ActionSummaries, nextToken: S.String }),
).annotations({
  identifier: "ListActionsResponse",
}) as any as S.Schema<ListActionsResponse>;
export interface ListAssetModelsResponse {
  assetModelSummaries: AssetModelSummaries;
  nextToken?: string;
}
export const ListAssetModelsResponse = S.suspend(() =>
  S.Struct({
    assetModelSummaries: AssetModelSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetModelsResponse",
}) as any as S.Schema<ListAssetModelsResponse>;
export interface ListAssetPropertiesResponse {
  assetPropertySummaries: AssetPropertySummaries;
  nextToken?: string;
}
export const ListAssetPropertiesResponse = S.suspend(() =>
  S.Struct({
    assetPropertySummaries: AssetPropertySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetPropertiesResponse",
}) as any as S.Schema<ListAssetPropertiesResponse>;
export interface ListAssetsResponse {
  assetSummaries: AssetSummaries;
  nextToken?: string;
}
export const ListAssetsResponse = S.suspend(() =>
  S.Struct({ assetSummaries: AssetSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAssetsResponse",
}) as any as S.Schema<ListAssetsResponse>;
export interface ListAssociatedAssetsResponse {
  assetSummaries: AssociatedAssetsSummaries;
  nextToken?: string;
}
export const ListAssociatedAssetsResponse = S.suspend(() =>
  S.Struct({
    assetSummaries: AssociatedAssetsSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedAssetsResponse",
}) as any as S.Schema<ListAssociatedAssetsResponse>;
export interface ListBulkImportJobsResponse {
  jobSummaries: JobSummaries;
  nextToken?: string;
}
export const ListBulkImportJobsResponse = S.suspend(() =>
  S.Struct({ jobSummaries: JobSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBulkImportJobsResponse",
}) as any as S.Schema<ListBulkImportJobsResponse>;
export interface ListCompositionRelationshipsResponse {
  compositionRelationshipSummaries: CompositionRelationshipSummaries;
  nextToken?: string;
}
export const ListCompositionRelationshipsResponse = S.suspend(() =>
  S.Struct({
    compositionRelationshipSummaries: CompositionRelationshipSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCompositionRelationshipsResponse",
}) as any as S.Schema<ListCompositionRelationshipsResponse>;
export interface ListComputationModelDataBindingUsagesRequest {
  dataBindingValueFilter: DataBindingValueFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListComputationModelDataBindingUsagesRequest = S.suspend(() =>
  S.Struct({
    dataBindingValueFilter: DataBindingValueFilter,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/computation-models/data-binding-usages",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComputationModelDataBindingUsagesRequest",
}) as any as S.Schema<ListComputationModelDataBindingUsagesRequest>;
export interface ListComputationModelResolveToResourcesResponse {
  computationModelResolveToResourceSummaries: ComputationModelResolveToResourceSummaries;
  nextToken?: string;
}
export const ListComputationModelResolveToResourcesResponse = S.suspend(() =>
  S.Struct({
    computationModelResolveToResourceSummaries:
      ComputationModelResolveToResourceSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComputationModelResolveToResourcesResponse",
}) as any as S.Schema<ListComputationModelResolveToResourcesResponse>;
export interface ListComputationModelsResponse {
  computationModelSummaries: ComputationModelSummaries;
  nextToken?: string;
}
export const ListComputationModelsResponse = S.suspend(() =>
  S.Struct({
    computationModelSummaries: ComputationModelSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComputationModelsResponse",
}) as any as S.Schema<ListComputationModelsResponse>;
export interface ListDashboardsResponse {
  dashboardSummaries: DashboardSummaries;
  nextToken?: string;
}
export const ListDashboardsResponse = S.suspend(() =>
  S.Struct({
    dashboardSummaries: DashboardSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDashboardsResponse",
}) as any as S.Schema<ListDashboardsResponse>;
export interface ListDatasetsResponse {
  datasetSummaries: DatasetSummaries;
  nextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({
    datasetSummaries: DatasetSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListExecutionsResponse {
  executionSummaries: ExecutionSummaries;
  nextToken?: string;
}
export const ListExecutionsResponse = S.suspend(() =>
  S.Struct({
    executionSummaries: ExecutionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExecutionsResponse",
}) as any as S.Schema<ListExecutionsResponse>;
export interface ListGatewaysResponse {
  gatewaySummaries: GatewaySummaries;
  nextToken?: string;
}
export const ListGatewaysResponse = S.suspend(() =>
  S.Struct({
    gatewaySummaries: GatewaySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGatewaysResponse",
}) as any as S.Schema<ListGatewaysResponse>;
export interface ListInterfaceRelationshipsResponse {
  interfaceRelationshipSummaries: InterfaceRelationshipSummaries;
  nextToken?: string;
}
export const ListInterfaceRelationshipsResponse = S.suspend(() =>
  S.Struct({
    interfaceRelationshipSummaries: InterfaceRelationshipSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInterfaceRelationshipsResponse",
}) as any as S.Schema<ListInterfaceRelationshipsResponse>;
export interface ListPortalsResponse {
  portalSummaries?: PortalSummaries;
  nextToken?: string;
}
export const ListPortalsResponse = S.suspend(() =>
  S.Struct({
    portalSummaries: S.optional(PortalSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPortalsResponse",
}) as any as S.Schema<ListPortalsResponse>;
export interface ListProjectsResponse {
  projectSummaries: ProjectSummaries;
  nextToken?: string;
}
export const ListProjectsResponse = S.suspend(() =>
  S.Struct({
    projectSummaries: ProjectSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProjectsResponse",
}) as any as S.Schema<ListProjectsResponse>;
export interface ListTimeSeriesResponse {
  TimeSeriesSummaries: TimeSeriesSummaries;
  nextToken?: string;
}
export const ListTimeSeriesResponse = S.suspend(() =>
  S.Struct({
    TimeSeriesSummaries: TimeSeriesSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTimeSeriesResponse",
}) as any as S.Schema<ListTimeSeriesResponse>;
export interface PutAssetModelInterfaceRelationshipRequest {
  assetModelId: string;
  interfaceAssetModelId: string;
  propertyMappingConfiguration: PropertyMappingConfiguration;
  clientToken?: string;
}
export const PutAssetModelInterfaceRelationshipRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    interfaceAssetModelId: S.String.pipe(T.HttpLabel("interfaceAssetModelId")),
    propertyMappingConfiguration: PropertyMappingConfiguration,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/asset-models/{assetModelId}/interface/{interfaceAssetModelId}/asset-model-interface-relationship",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAssetModelInterfaceRelationshipRequest",
}) as any as S.Schema<PutAssetModelInterfaceRelationshipRequest>;
export interface UpdateAssetModelRequest {
  assetModelId: string;
  assetModelExternalId?: string;
  assetModelName: string;
  assetModelDescription?: string;
  assetModelProperties?: AssetModelProperties;
  assetModelHierarchies?: AssetModelHierarchies;
  assetModelCompositeModels?: AssetModelCompositeModels;
  clientToken?: string;
  ifMatch?: string;
  ifNoneMatch?: string;
  matchForVersionType?: string;
}
export const UpdateAssetModelRequest = S.suspend(() =>
  S.Struct({
    assetModelId: S.String.pipe(T.HttpLabel("assetModelId")),
    assetModelExternalId: S.optional(S.String),
    assetModelName: S.String,
    assetModelDescription: S.optional(S.String),
    assetModelProperties: S.optional(AssetModelProperties),
    assetModelHierarchies: S.optional(AssetModelHierarchies),
    assetModelCompositeModels: S.optional(AssetModelCompositeModels),
    clientToken: S.optional(S.String),
    ifMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    ifNoneMatch: S.optional(S.String).pipe(T.HttpHeader("If-None-Match")),
    matchForVersionType: S.optional(S.String).pipe(
      T.HttpHeader("Match-For-Version-Type"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/asset-models/{assetModelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetModelRequest",
}) as any as S.Schema<UpdateAssetModelRequest>;
export interface UpdatePortalResponse {
  portalStatus: PortalStatus;
}
export const UpdatePortalResponse = S.suspend(() =>
  S.Struct({ portalStatus: PortalStatus }),
).annotations({
  identifier: "UpdatePortalResponse",
}) as any as S.Schema<UpdatePortalResponse>;
export interface CompositionRelationshipItem {
  id?: string;
}
export const CompositionRelationshipItem = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "CompositionRelationshipItem",
}) as any as S.Schema<CompositionRelationshipItem>;
export type CompositionRelationship = CompositionRelationshipItem[];
export const CompositionRelationship = S.Array(CompositionRelationshipItem);
export interface ColumnType {
  scalarType?: string;
}
export const ColumnType = S.suspend(() =>
  S.Struct({ scalarType: S.optional(S.String) }),
).annotations({ identifier: "ColumnType" }) as any as S.Schema<ColumnType>;
export interface Datum {
  scalarValue?: string;
  arrayValue?: DatumList;
  rowValue?: Row;
  nullValue?: boolean;
}
export const Datum = S.suspend(() =>
  S.Struct({
    scalarValue: S.optional(S.String),
    arrayValue: S.optional(
      S.suspend(() => DatumList).annotations({ identifier: "DatumList" }),
    ),
    rowValue: S.optional(
      S.suspend((): S.Schema<Row, any> => Row).annotations({
        identifier: "Row",
      }),
    ),
    nullValue: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Datum" }) as any as S.Schema<Datum>;
export type DatumList = Datum[];
export const DatumList = S.Array(
  S.suspend((): S.Schema<Datum, any> => Datum).annotations({
    identifier: "Datum",
  }),
) as any as S.Schema<DatumList>;
export interface Aggregates {
  average?: number;
  count?: number;
  maximum?: number;
  minimum?: number;
  sum?: number;
  standardDeviation?: number;
}
export const Aggregates = S.suspend(() =>
  S.Struct({
    average: S.optional(S.Number),
    count: S.optional(S.Number),
    maximum: S.optional(S.Number),
    minimum: S.optional(S.Number),
    sum: S.optional(S.Number),
    standardDeviation: S.optional(S.Number),
  }),
).annotations({ identifier: "Aggregates" }) as any as S.Schema<Aggregates>;
export interface Trace {
  text?: string;
}
export const Trace = S.suspend(() =>
  S.Struct({ text: S.optional(S.String) }),
).annotations({ identifier: "Trace" }) as any as S.Schema<Trace>;
export interface InterfaceSummary {
  interfaceAssetModelId: string;
  interfaceAssetModelPropertyId: string;
}
export const InterfaceSummary = S.suspend(() =>
  S.Struct({
    interfaceAssetModelId: S.String,
    interfaceAssetModelPropertyId: S.String,
  }),
).annotations({
  identifier: "InterfaceSummary",
}) as any as S.Schema<InterfaceSummary>;
export type InterfaceSummaries = InterfaceSummary[];
export const InterfaceSummaries = S.Array(InterfaceSummary);
export interface AssetHierarchyInfo {
  parentAssetId?: string;
  childAssetId?: string;
}
export const AssetHierarchyInfo = S.suspend(() =>
  S.Struct({
    parentAssetId: S.optional(S.String),
    childAssetId: S.optional(S.String),
  }),
).annotations({
  identifier: "AssetHierarchyInfo",
}) as any as S.Schema<AssetHierarchyInfo>;
export interface BatchGetAssetPropertyAggregatesErrorEntry {
  errorCode: string;
  errorMessage: string;
  entryId: string;
}
export const BatchGetAssetPropertyAggregatesErrorEntry = S.suspend(() =>
  S.Struct({ errorCode: S.String, errorMessage: S.String, entryId: S.String }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesErrorEntry",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesErrorEntry>;
export type BatchGetAssetPropertyAggregatesErrorEntries =
  BatchGetAssetPropertyAggregatesErrorEntry[];
export const BatchGetAssetPropertyAggregatesErrorEntries = S.Array(
  BatchGetAssetPropertyAggregatesErrorEntry,
);
export interface AggregatedValue {
  timestamp: Date;
  quality?: string;
  value: Aggregates;
}
export const AggregatedValue = S.suspend(() =>
  S.Struct({
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    quality: S.optional(S.String),
    value: Aggregates,
  }),
).annotations({
  identifier: "AggregatedValue",
}) as any as S.Schema<AggregatedValue>;
export type AggregatedValues = AggregatedValue[];
export const AggregatedValues = S.Array(AggregatedValue);
export interface BatchGetAssetPropertyAggregatesSuccessEntry {
  entryId: string;
  aggregatedValues: AggregatedValues;
}
export const BatchGetAssetPropertyAggregatesSuccessEntry = S.suspend(() =>
  S.Struct({ entryId: S.String, aggregatedValues: AggregatedValues }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesSuccessEntry",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesSuccessEntry>;
export type BatchGetAssetPropertyAggregatesSuccessEntries =
  BatchGetAssetPropertyAggregatesSuccessEntry[];
export const BatchGetAssetPropertyAggregatesSuccessEntries = S.Array(
  BatchGetAssetPropertyAggregatesSuccessEntry,
);
export interface BatchGetAssetPropertyValueErrorEntry {
  errorCode: string;
  errorMessage: string;
  entryId: string;
}
export const BatchGetAssetPropertyValueErrorEntry = S.suspend(() =>
  S.Struct({ errorCode: S.String, errorMessage: S.String, entryId: S.String }),
).annotations({
  identifier: "BatchGetAssetPropertyValueErrorEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueErrorEntry>;
export type BatchGetAssetPropertyValueErrorEntries =
  BatchGetAssetPropertyValueErrorEntry[];
export const BatchGetAssetPropertyValueErrorEntries = S.Array(
  BatchGetAssetPropertyValueErrorEntry,
);
export interface BatchGetAssetPropertyValueSuccessEntry {
  entryId: string;
  assetPropertyValue?: AssetPropertyValue;
}
export const BatchGetAssetPropertyValueSuccessEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetPropertyValue: S.optional(AssetPropertyValue),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueSuccessEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueSuccessEntry>;
export type BatchGetAssetPropertyValueSuccessEntries =
  BatchGetAssetPropertyValueSuccessEntry[];
export const BatchGetAssetPropertyValueSuccessEntries = S.Array(
  BatchGetAssetPropertyValueSuccessEntry,
);
export interface BatchGetAssetPropertyValueHistoryErrorEntry {
  errorCode: string;
  errorMessage: string;
  entryId: string;
}
export const BatchGetAssetPropertyValueHistoryErrorEntry = S.suspend(() =>
  S.Struct({ errorCode: S.String, errorMessage: S.String, entryId: S.String }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistoryErrorEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueHistoryErrorEntry>;
export type BatchGetAssetPropertyValueHistoryErrorEntries =
  BatchGetAssetPropertyValueHistoryErrorEntry[];
export const BatchGetAssetPropertyValueHistoryErrorEntries = S.Array(
  BatchGetAssetPropertyValueHistoryErrorEntry,
);
export interface BatchGetAssetPropertyValueHistorySuccessEntry {
  entryId: string;
  assetPropertyValueHistory: AssetPropertyValueHistory;
}
export const BatchGetAssetPropertyValueHistorySuccessEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetPropertyValueHistory: AssetPropertyValueHistory,
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistorySuccessEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueHistorySuccessEntry>;
export type BatchGetAssetPropertyValueHistorySuccessEntries =
  BatchGetAssetPropertyValueHistorySuccessEntry[];
export const BatchGetAssetPropertyValueHistorySuccessEntries = S.Array(
  BatchGetAssetPropertyValueHistorySuccessEntry,
);
export interface CompositionDetails {
  compositionRelationship?: CompositionRelationship;
}
export const CompositionDetails = S.suspend(() =>
  S.Struct({ compositionRelationship: S.optional(CompositionRelationship) }),
).annotations({
  identifier: "CompositionDetails",
}) as any as S.Schema<CompositionDetails>;
export interface ColumnInfo {
  name?: string;
  type?: ColumnType;
}
export const ColumnInfo = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.optional(ColumnType) }),
).annotations({ identifier: "ColumnInfo" }) as any as S.Schema<ColumnInfo>;
export type ColumnsList = ColumnInfo[];
export const ColumnsList = S.Array(ColumnInfo);
export interface Row {
  data: DatumList;
}
export const Row = S.suspend(() =>
  S.Struct({
    data: S.suspend(() => DatumList).annotations({ identifier: "DatumList" }),
  }),
).annotations({ identifier: "Row" }) as any as S.Schema<Row>;
export type Rows = Row[];
export const Rows = S.Array(
  S.suspend((): S.Schema<Row, any> => Row).annotations({ identifier: "Row" }),
);
export interface AssetModelPropertySummary {
  id?: string;
  externalId?: string;
  name: string;
  dataType: string;
  dataTypeSpec?: string;
  unit?: string;
  type: PropertyType;
  assetModelCompositeModelId?: string;
  path?: AssetModelPropertyPath;
  interfaceSummaries?: InterfaceSummaries;
}
export const AssetModelPropertySummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    externalId: S.optional(S.String),
    name: S.String,
    dataType: S.String,
    dataTypeSpec: S.optional(S.String),
    unit: S.optional(S.String),
    type: PropertyType,
    assetModelCompositeModelId: S.optional(S.String),
    path: S.optional(AssetModelPropertyPath),
    interfaceSummaries: S.optional(InterfaceSummaries),
  }),
).annotations({
  identifier: "AssetModelPropertySummary",
}) as any as S.Schema<AssetModelPropertySummary>;
export type AssetModelPropertySummaries = AssetModelPropertySummary[];
export const AssetModelPropertySummaries = S.Array(AssetModelPropertySummary);
export interface AssetRelationshipSummary {
  hierarchyInfo?: AssetHierarchyInfo;
  relationshipType: string;
}
export const AssetRelationshipSummary = S.suspend(() =>
  S.Struct({
    hierarchyInfo: S.optional(AssetHierarchyInfo),
    relationshipType: S.String,
  }),
).annotations({
  identifier: "AssetRelationshipSummary",
}) as any as S.Schema<AssetRelationshipSummary>;
export type AssetRelationshipSummaries = AssetRelationshipSummary[];
export const AssetRelationshipSummaries = S.Array(AssetRelationshipSummary);
export interface CreateAccessPolicyResponse {
  accessPolicyId: string;
  accessPolicyArn: string;
}
export const CreateAccessPolicyResponse = S.suspend(() =>
  S.Struct({ accessPolicyId: S.String, accessPolicyArn: S.String }),
).annotations({
  identifier: "CreateAccessPolicyResponse",
}) as any as S.Schema<CreateAccessPolicyResponse>;
export interface CreateBulkImportJobRequest {
  jobName: string;
  jobRoleArn: string;
  files: Files;
  errorReportLocation: ErrorReportLocation;
  jobConfiguration: JobConfiguration;
  adaptiveIngestion?: boolean;
  deleteFilesAfterImport?: boolean;
}
export const CreateBulkImportJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    jobRoleArn: S.String,
    files: Files,
    errorReportLocation: ErrorReportLocation,
    jobConfiguration: JobConfiguration,
    adaptiveIngestion: S.optional(S.Boolean),
    deleteFilesAfterImport: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBulkImportJobRequest",
}) as any as S.Schema<CreateBulkImportJobRequest>;
export interface CreateComputationModelRequest {
  computationModelName: string;
  computationModelDescription?: string;
  computationModelConfiguration: ComputationModelConfiguration;
  computationModelDataBinding: ComputationModelDataBinding;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateComputationModelRequest = S.suspend(() =>
  S.Struct({
    computationModelName: S.String,
    computationModelDescription: S.optional(S.String),
    computationModelConfiguration: ComputationModelConfiguration,
    computationModelDataBinding: ComputationModelDataBinding,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/computation-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateComputationModelRequest",
}) as any as S.Schema<CreateComputationModelRequest>;
export interface CreateDatasetRequest {
  datasetId?: string;
  datasetName: string;
  datasetDescription?: string;
  datasetSource: DatasetSource;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    datasetId: S.optional(S.String),
    datasetName: S.String,
    datasetDescription: S.optional(S.String),
    datasetSource: DatasetSource,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateGatewayResponse {
  gatewayId: string;
  gatewayArn: string;
}
export const CreateGatewayResponse = S.suspend(() =>
  S.Struct({ gatewayId: S.String, gatewayArn: S.String }),
).annotations({
  identifier: "CreateGatewayResponse",
}) as any as S.Schema<CreateGatewayResponse>;
export interface CreatePortalResponse {
  portalId: string;
  portalArn: string;
  portalStartUrl: string;
  portalStatus: PortalStatus;
  ssoApplicationId: string;
}
export const CreatePortalResponse = S.suspend(() =>
  S.Struct({
    portalId: S.String,
    portalArn: S.String,
    portalStartUrl: S.String,
    portalStatus: PortalStatus,
    ssoApplicationId: S.String,
  }),
).annotations({
  identifier: "CreatePortalResponse",
}) as any as S.Schema<CreatePortalResponse>;
export interface DeletePortalResponse {
  portalStatus: PortalStatus;
}
export const DeletePortalResponse = S.suspend(() =>
  S.Struct({ portalStatus: PortalStatus }),
).annotations({
  identifier: "DeletePortalResponse",
}) as any as S.Schema<DeletePortalResponse>;
export interface DescribeAssetResponse {
  assetId: string;
  assetExternalId?: string;
  assetArn: string;
  assetName: string;
  assetModelId: string;
  assetProperties: AssetProperties;
  assetHierarchies: AssetHierarchies;
  assetCompositeModels?: AssetCompositeModels;
  assetCreationDate: Date;
  assetLastUpdateDate: Date;
  assetStatus: AssetStatus;
  assetDescription?: string;
  assetCompositeModelSummaries?: AssetCompositeModelSummaries;
}
export const DescribeAssetResponse = S.suspend(() =>
  S.Struct({
    assetId: S.String,
    assetExternalId: S.optional(S.String),
    assetArn: S.String,
    assetName: S.String,
    assetModelId: S.String,
    assetProperties: AssetProperties,
    assetHierarchies: AssetHierarchies,
    assetCompositeModels: S.optional(AssetCompositeModels),
    assetCreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    assetLastUpdateDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    assetStatus: AssetStatus,
    assetDescription: S.optional(S.String),
    assetCompositeModelSummaries: S.optional(AssetCompositeModelSummaries),
  }),
).annotations({
  identifier: "DescribeAssetResponse",
}) as any as S.Schema<DescribeAssetResponse>;
export interface DescribeAssetModelCompositeModelResponse {
  assetModelId: string;
  assetModelCompositeModelId: string;
  assetModelCompositeModelExternalId?: string;
  assetModelCompositeModelPath: AssetModelCompositeModelPath;
  assetModelCompositeModelName: string;
  assetModelCompositeModelDescription: string;
  assetModelCompositeModelType: string;
  assetModelCompositeModelProperties: AssetModelProperties;
  compositionDetails?: CompositionDetails;
  assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries;
  actionDefinitions?: ActionDefinitions;
}
export const DescribeAssetModelCompositeModelResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    assetModelCompositeModelId: S.String,
    assetModelCompositeModelExternalId: S.optional(S.String),
    assetModelCompositeModelPath: AssetModelCompositeModelPath,
    assetModelCompositeModelName: S.String,
    assetModelCompositeModelDescription: S.String,
    assetModelCompositeModelType: S.String,
    assetModelCompositeModelProperties: AssetModelProperties,
    compositionDetails: S.optional(CompositionDetails),
    assetModelCompositeModelSummaries: AssetModelCompositeModelSummaries,
    actionDefinitions: S.optional(ActionDefinitions),
  }),
).annotations({
  identifier: "DescribeAssetModelCompositeModelResponse",
}) as any as S.Schema<DescribeAssetModelCompositeModelResponse>;
export interface ExecuteQueryResponse {
  columns?: ColumnsList;
  rows?: Rows;
  nextToken?: string;
}
export const ExecuteQueryResponse = S.suspend(() =>
  S.Struct({
    columns: S.optional(ColumnsList),
    rows: S.optional(Rows),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecuteQueryResponse",
}) as any as S.Schema<ExecuteQueryResponse>;
export interface GetAssetPropertyAggregatesResponse {
  aggregatedValues: AggregatedValues;
  nextToken?: string;
}
export const GetAssetPropertyAggregatesResponse = S.suspend(() =>
  S.Struct({
    aggregatedValues: AggregatedValues,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAssetPropertyAggregatesResponse",
}) as any as S.Schema<GetAssetPropertyAggregatesResponse>;
export interface ListAssetModelPropertiesResponse {
  assetModelPropertySummaries: AssetModelPropertySummaries;
  nextToken?: string;
}
export const ListAssetModelPropertiesResponse = S.suspend(() =>
  S.Struct({
    assetModelPropertySummaries: AssetModelPropertySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetModelPropertiesResponse",
}) as any as S.Schema<ListAssetModelPropertiesResponse>;
export interface ListAssetRelationshipsResponse {
  assetRelationshipSummaries: AssetRelationshipSummaries;
  nextToken?: string;
}
export const ListAssetRelationshipsResponse = S.suspend(() =>
  S.Struct({
    assetRelationshipSummaries: AssetRelationshipSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssetRelationshipsResponse",
}) as any as S.Schema<ListAssetRelationshipsResponse>;
export interface PutAssetModelInterfaceRelationshipResponse {
  assetModelId: string;
  interfaceAssetModelId: string;
  assetModelArn: string;
  assetModelStatus: AssetModelStatus;
}
export const PutAssetModelInterfaceRelationshipResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    interfaceAssetModelId: S.String,
    assetModelArn: S.String,
    assetModelStatus: AssetModelStatus,
  }),
).annotations({
  identifier: "PutAssetModelInterfaceRelationshipResponse",
}) as any as S.Schema<PutAssetModelInterfaceRelationshipResponse>;
export interface UpdateAssetModelResponse {
  assetModelStatus: AssetModelStatus;
}
export const UpdateAssetModelResponse = S.suspend(() =>
  S.Struct({ assetModelStatus: AssetModelStatus }),
).annotations({
  identifier: "UpdateAssetModelResponse",
}) as any as S.Schema<UpdateAssetModelResponse>;
export interface BatchGetAssetPropertyAggregatesErrorInfo {
  errorCode: string;
  errorTimestamp: Date;
}
export const BatchGetAssetPropertyAggregatesErrorInfo = S.suspend(() =>
  S.Struct({
    errorCode: S.String,
    errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesErrorInfo",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesErrorInfo>;
export interface BatchGetAssetPropertyValueErrorInfo {
  errorCode: string;
  errorTimestamp: Date;
}
export const BatchGetAssetPropertyValueErrorInfo = S.suspend(() =>
  S.Struct({
    errorCode: S.String,
    errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueErrorInfo",
}) as any as S.Schema<BatchGetAssetPropertyValueErrorInfo>;
export interface BatchGetAssetPropertyValueHistoryErrorInfo {
  errorCode: string;
  errorTimestamp: Date;
}
export const BatchGetAssetPropertyValueHistoryErrorInfo = S.suspend(() =>
  S.Struct({
    errorCode: S.String,
    errorTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistoryErrorInfo",
}) as any as S.Schema<BatchGetAssetPropertyValueHistoryErrorInfo>;
export type AssetPropertyValues = AssetPropertyValue[];
export const AssetPropertyValues = S.Array(AssetPropertyValue);
export type ComputationModelIdList = string[];
export const ComputationModelIdList = S.Array(S.String);
export interface Content {
  text?: string;
}
export const Content = S.suspend(() =>
  S.Struct({ text: S.optional(S.String) }),
).annotations({ identifier: "Content" }) as any as S.Schema<Content>;
export interface BatchGetAssetPropertyAggregatesSkippedEntry {
  entryId: string;
  completionStatus: string;
  errorInfo?: BatchGetAssetPropertyAggregatesErrorInfo;
}
export const BatchGetAssetPropertyAggregatesSkippedEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    completionStatus: S.String,
    errorInfo: S.optional(BatchGetAssetPropertyAggregatesErrorInfo),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesSkippedEntry",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesSkippedEntry>;
export type BatchGetAssetPropertyAggregatesSkippedEntries =
  BatchGetAssetPropertyAggregatesSkippedEntry[];
export const BatchGetAssetPropertyAggregatesSkippedEntries = S.Array(
  BatchGetAssetPropertyAggregatesSkippedEntry,
);
export interface BatchGetAssetPropertyValueSkippedEntry {
  entryId: string;
  completionStatus: string;
  errorInfo?: BatchGetAssetPropertyValueErrorInfo;
}
export const BatchGetAssetPropertyValueSkippedEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    completionStatus: S.String,
    errorInfo: S.optional(BatchGetAssetPropertyValueErrorInfo),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueSkippedEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueSkippedEntry>;
export type BatchGetAssetPropertyValueSkippedEntries =
  BatchGetAssetPropertyValueSkippedEntry[];
export const BatchGetAssetPropertyValueSkippedEntries = S.Array(
  BatchGetAssetPropertyValueSkippedEntry,
);
export interface BatchGetAssetPropertyValueHistorySkippedEntry {
  entryId: string;
  completionStatus: string;
  errorInfo?: BatchGetAssetPropertyValueHistoryErrorInfo;
}
export const BatchGetAssetPropertyValueHistorySkippedEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    completionStatus: S.String,
    errorInfo: S.optional(BatchGetAssetPropertyValueHistoryErrorInfo),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistorySkippedEntry",
}) as any as S.Schema<BatchGetAssetPropertyValueHistorySkippedEntry>;
export type BatchGetAssetPropertyValueHistorySkippedEntries =
  BatchGetAssetPropertyValueHistorySkippedEntry[];
export const BatchGetAssetPropertyValueHistorySkippedEntries = S.Array(
  BatchGetAssetPropertyValueHistorySkippedEntry,
);
export interface PutAssetPropertyValueEntry {
  entryId: string;
  assetId?: string;
  propertyId?: string;
  propertyAlias?: string;
  propertyValues: AssetPropertyValues;
}
export const PutAssetPropertyValueEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    assetId: S.optional(S.String),
    propertyId: S.optional(S.String),
    propertyAlias: S.optional(S.String),
    propertyValues: AssetPropertyValues,
  }),
).annotations({
  identifier: "PutAssetPropertyValueEntry",
}) as any as S.Schema<PutAssetPropertyValueEntry>;
export type PutAssetPropertyValueEntries = PutAssetPropertyValueEntry[];
export const PutAssetPropertyValueEntries = S.Array(PutAssetPropertyValueEntry);
export interface BatchGetAssetPropertyAggregatesResponse {
  errorEntries: BatchGetAssetPropertyAggregatesErrorEntries;
  successEntries: BatchGetAssetPropertyAggregatesSuccessEntries;
  skippedEntries: BatchGetAssetPropertyAggregatesSkippedEntries;
  nextToken?: string;
}
export const BatchGetAssetPropertyAggregatesResponse = S.suspend(() =>
  S.Struct({
    errorEntries: BatchGetAssetPropertyAggregatesErrorEntries,
    successEntries: BatchGetAssetPropertyAggregatesSuccessEntries,
    skippedEntries: BatchGetAssetPropertyAggregatesSkippedEntries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyAggregatesResponse",
}) as any as S.Schema<BatchGetAssetPropertyAggregatesResponse>;
export interface BatchGetAssetPropertyValueResponse {
  errorEntries: BatchGetAssetPropertyValueErrorEntries;
  successEntries: BatchGetAssetPropertyValueSuccessEntries;
  skippedEntries: BatchGetAssetPropertyValueSkippedEntries;
  nextToken?: string;
}
export const BatchGetAssetPropertyValueResponse = S.suspend(() =>
  S.Struct({
    errorEntries: BatchGetAssetPropertyValueErrorEntries,
    successEntries: BatchGetAssetPropertyValueSuccessEntries,
    skippedEntries: BatchGetAssetPropertyValueSkippedEntries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueResponse",
}) as any as S.Schema<BatchGetAssetPropertyValueResponse>;
export interface BatchGetAssetPropertyValueHistoryResponse {
  errorEntries: BatchGetAssetPropertyValueHistoryErrorEntries;
  successEntries: BatchGetAssetPropertyValueHistorySuccessEntries;
  skippedEntries: BatchGetAssetPropertyValueHistorySkippedEntries;
  nextToken?: string;
}
export const BatchGetAssetPropertyValueHistoryResponse = S.suspend(() =>
  S.Struct({
    errorEntries: BatchGetAssetPropertyValueHistoryErrorEntries,
    successEntries: BatchGetAssetPropertyValueHistorySuccessEntries,
    skippedEntries: BatchGetAssetPropertyValueHistorySkippedEntries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetAssetPropertyValueHistoryResponse",
}) as any as S.Schema<BatchGetAssetPropertyValueHistoryResponse>;
export interface BatchPutAssetPropertyValueRequest {
  enablePartialEntryProcessing?: boolean;
  entries: PutAssetPropertyValueEntries;
}
export const BatchPutAssetPropertyValueRequest = S.suspend(() =>
  S.Struct({
    enablePartialEntryProcessing: S.optional(S.Boolean),
    entries: PutAssetPropertyValueEntries,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/properties" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutAssetPropertyValueRequest",
}) as any as S.Schema<BatchPutAssetPropertyValueRequest>;
export interface CreateAssetResponse {
  assetId: string;
  assetArn: string;
  assetStatus: AssetStatus;
}
export const CreateAssetResponse = S.suspend(() =>
  S.Struct({ assetId: S.String, assetArn: S.String, assetStatus: AssetStatus }),
).annotations({
  identifier: "CreateAssetResponse",
}) as any as S.Schema<CreateAssetResponse>;
export interface CreateBulkImportJobResponse {
  jobId: string;
  jobName: string;
  jobStatus: string;
}
export const CreateBulkImportJobResponse = S.suspend(() =>
  S.Struct({ jobId: S.String, jobName: S.String, jobStatus: S.String }),
).annotations({
  identifier: "CreateBulkImportJobResponse",
}) as any as S.Schema<CreateBulkImportJobResponse>;
export interface CreateComputationModelResponse {
  computationModelId: string;
  computationModelArn: string;
  computationModelStatus: ComputationModelStatus;
}
export const CreateComputationModelResponse = S.suspend(() =>
  S.Struct({
    computationModelId: S.String,
    computationModelArn: S.String,
    computationModelStatus: ComputationModelStatus,
  }),
).annotations({
  identifier: "CreateComputationModelResponse",
}) as any as S.Schema<CreateComputationModelResponse>;
export interface CreateDatasetResponse {
  datasetId: string;
  datasetArn: string;
  datasetStatus: DatasetStatus;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({
    datasetId: S.String,
    datasetArn: S.String,
    datasetStatus: DatasetStatus,
  }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;
export interface DataBindingValue {
  assetModelProperty?: AssetModelPropertyBindingValue;
  assetProperty?: AssetPropertyBindingValue;
}
export const DataBindingValue = S.suspend(() =>
  S.Struct({
    assetModelProperty: S.optional(AssetModelPropertyBindingValue),
    assetProperty: S.optional(AssetPropertyBindingValue),
  }),
).annotations({
  identifier: "DataBindingValue",
}) as any as S.Schema<DataBindingValue>;
export interface CreateAssetModelRequest {
  assetModelName: string;
  assetModelType?: string;
  assetModelId?: string;
  assetModelExternalId?: string;
  assetModelDescription?: string;
  assetModelProperties?: AssetModelPropertyDefinitions;
  assetModelHierarchies?: AssetModelHierarchyDefinitions;
  assetModelCompositeModels?: AssetModelCompositeModelDefinitions;
  clientToken?: string;
  tags?: TagMap;
}
export const CreateAssetModelRequest = S.suspend(() =>
  S.Struct({
    assetModelName: S.String,
    assetModelType: S.optional(S.String),
    assetModelId: S.optional(S.String),
    assetModelExternalId: S.optional(S.String),
    assetModelDescription: S.optional(S.String),
    assetModelProperties: S.optional(AssetModelPropertyDefinitions),
    assetModelHierarchies: S.optional(AssetModelHierarchyDefinitions),
    assetModelCompositeModels: S.optional(AssetModelCompositeModelDefinitions),
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/asset-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssetModelRequest",
}) as any as S.Schema<CreateAssetModelRequest>;
export interface Location {
  uri?: string;
}
export const Location = S.suspend(() =>
  S.Struct({ uri: S.optional(S.String) }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export interface MatchedDataBinding {
  value: DataBindingValue;
}
export const MatchedDataBinding = S.suspend(() =>
  S.Struct({ value: DataBindingValue }),
).annotations({
  identifier: "MatchedDataBinding",
}) as any as S.Schema<MatchedDataBinding>;
export interface Source {
  arn?: string;
  location?: Location;
}
export const Source = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), location: S.optional(Location) }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export interface ComputationModelDataBindingUsageSummary {
  computationModelIds: ComputationModelIdList;
  matchedDataBinding: MatchedDataBinding;
}
export const ComputationModelDataBindingUsageSummary = S.suspend(() =>
  S.Struct({
    computationModelIds: ComputationModelIdList,
    matchedDataBinding: MatchedDataBinding,
  }),
).annotations({
  identifier: "ComputationModelDataBindingUsageSummary",
}) as any as S.Schema<ComputationModelDataBindingUsageSummary>;
export type ComputationModelDataBindingUsageSummaries =
  ComputationModelDataBindingUsageSummary[];
export const ComputationModelDataBindingUsageSummaries = S.Array(
  ComputationModelDataBindingUsageSummary,
);
export type Timestamps = TimeInNanos[];
export const Timestamps = S.Array(TimeInNanos);
export interface CreateAssetModelResponse {
  assetModelId: string;
  assetModelArn: string;
  assetModelStatus: AssetModelStatus;
}
export const CreateAssetModelResponse = S.suspend(() =>
  S.Struct({
    assetModelId: S.String,
    assetModelArn: S.String,
    assetModelStatus: AssetModelStatus,
  }),
).annotations({
  identifier: "CreateAssetModelResponse",
}) as any as S.Schema<CreateAssetModelResponse>;
export interface DataSetReference {
  datasetArn?: string;
  source?: Source;
}
export const DataSetReference = S.suspend(() =>
  S.Struct({ datasetArn: S.optional(S.String), source: S.optional(Source) }),
).annotations({
  identifier: "DataSetReference",
}) as any as S.Schema<DataSetReference>;
export interface ListComputationModelDataBindingUsagesResponse {
  dataBindingUsageSummaries: ComputationModelDataBindingUsageSummaries;
  nextToken?: string;
}
export const ListComputationModelDataBindingUsagesResponse = S.suspend(() =>
  S.Struct({
    dataBindingUsageSummaries: ComputationModelDataBindingUsageSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComputationModelDataBindingUsagesResponse",
}) as any as S.Schema<ListComputationModelDataBindingUsagesResponse>;
export interface BatchPutAssetPropertyError {
  errorCode: string;
  errorMessage: string;
  timestamps: Timestamps;
}
export const BatchPutAssetPropertyError = S.suspend(() =>
  S.Struct({
    errorCode: S.String,
    errorMessage: S.String,
    timestamps: Timestamps,
  }),
).annotations({
  identifier: "BatchPutAssetPropertyError",
}) as any as S.Schema<BatchPutAssetPropertyError>;
export type BatchPutAssetPropertyErrors = BatchPutAssetPropertyError[];
export const BatchPutAssetPropertyErrors = S.Array(BatchPutAssetPropertyError);
export interface Reference {
  dataset?: DataSetReference;
}
export const Reference = S.suspend(() =>
  S.Struct({ dataset: S.optional(DataSetReference) }),
).annotations({ identifier: "Reference" }) as any as S.Schema<Reference>;
export interface BatchPutAssetPropertyErrorEntry {
  entryId: string;
  errors: BatchPutAssetPropertyErrors;
}
export const BatchPutAssetPropertyErrorEntry = S.suspend(() =>
  S.Struct({ entryId: S.String, errors: BatchPutAssetPropertyErrors }),
).annotations({
  identifier: "BatchPutAssetPropertyErrorEntry",
}) as any as S.Schema<BatchPutAssetPropertyErrorEntry>;
export type BatchPutAssetPropertyErrorEntries =
  BatchPutAssetPropertyErrorEntry[];
export const BatchPutAssetPropertyErrorEntries = S.Array(
  BatchPutAssetPropertyErrorEntry,
);
export interface Citation {
  reference?: Reference;
  content?: Content;
}
export const Citation = S.suspend(() =>
  S.Struct({ reference: S.optional(Reference), content: S.optional(Content) }),
).annotations({ identifier: "Citation" }) as any as S.Schema<Citation>;
export type Citations = Citation[];
export const Citations = S.Array(Citation);
export interface BatchPutAssetPropertyValueResponse {
  errorEntries: BatchPutAssetPropertyErrorEntries;
}
export const BatchPutAssetPropertyValueResponse = S.suspend(() =>
  S.Struct({ errorEntries: BatchPutAssetPropertyErrorEntries }),
).annotations({
  identifier: "BatchPutAssetPropertyValueResponse",
}) as any as S.Schema<BatchPutAssetPropertyValueResponse>;
export interface InvocationOutput {
  message?: string;
  citations?: Citations;
}
export const InvocationOutput = S.suspend(() =>
  S.Struct({ message: S.optional(S.String), citations: S.optional(Citations) }),
).annotations({
  identifier: "InvocationOutput",
}) as any as S.Schema<InvocationOutput>;
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ trace: Trace }),
    S.Struct({ output: InvocationOutput }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictingOperationException: S.suspend(
        () => ConflictingOperationException,
      ).annotations({ identifier: "ConflictingOperationException" }),
    }),
    S.Struct({
      internalFailureException: S.suspend(
        () => InternalFailureException,
      ).annotations({ identifier: "InternalFailureException" }),
    }),
    S.Struct({
      invalidRequestException: S.suspend(
        () => InvalidRequestException,
      ).annotations({ identifier: "InvalidRequestException" }),
    }),
    S.Struct({
      limitExceededException: S.suspend(
        () => LimitExceededException,
      ).annotations({ identifier: "LimitExceededException" }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
  ),
);
export interface InvokeAssistantResponse {
  body: (typeof ResponseStream)["Type"];
  conversationId: string;
}
export const InvokeAssistantResponse = S.suspend(() =>
  S.Struct({
    body: ResponseStream.pipe(T.HttpPayload()),
    conversationId: S.String.pipe(
      T.HttpHeader("x-amz-iotsitewise-assistant-conversation-id"),
    ),
  }),
).annotations({
  identifier: "InvokeAssistantResponse",
}) as any as S.Schema<InvokeAssistantResponse>;

//# Errors
export class ConflictingOperationException extends S.TaggedError<ConflictingOperationException>()(
  "ConflictingOperationException",
  { message: S.String, resourceId: S.String, resourceArn: S.String },
).pipe(C.withConflictError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.String },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class PreconditionFailedException extends S.TaggedError<PreconditionFailedException>()(
  "PreconditionFailedException",
  { message: S.String, resourceId: S.String, resourceArn: S.String },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.String, resourceId: S.String, resourceArn: S.String },
).pipe(C.withConflictError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
).pipe(C.withServerError) {}
export class QueryTimeoutException extends S.TaggedError<QueryTimeoutException>()(
  "QueryTimeoutException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves information about the storage configuration for IoT SiteWise.
 */
export const describeStorageConfiguration: (
  input: DescribeStorageConfigurationRequest,
) => Effect.Effect<
  DescribeStorageConfigurationResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStorageConfigurationRequest,
  output: DescribeStorageConfigurationResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Executes an action on a target resource.
 */
export const executeAction: (
  input: ExecuteActionRequest,
) => Effect.Effect<
  ExecuteActionResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteActionRequest,
  output: ExecuteActionResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Sets the default encryption configuration for the Amazon Web Services account. For more information, see
 * Key management in
 * the *IoT SiteWise User Guide*.
 */
export const putDefaultEncryptionConfiguration: (
  input: PutDefaultEncryptionConfigurationRequest,
) => Effect.Effect<
  PutDefaultEncryptionConfigurationResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDefaultEncryptionConfigurationRequest,
  output: PutDefaultEncryptionConfigurationResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Updates a dataset.
 */
export const updateDataset: (
  input: UpdateDatasetRequest,
) => Effect.Effect<
  UpdateDatasetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a gateway capability configuration or defines a new capability configuration. Each gateway capability defines data sources for a gateway.
 *
 * Important workflow notes:
 *
 * Each gateway capability defines data sources for a gateway. This is the namespace of the gateway capability.
 *
 * . The namespace follows the format `service:capability:version`, where:
 *
 * - `service` - The service providing the capability, or `iotsitewise`.
 *
 * - `capability` - The specific capability type. Options include: `opcuacollector` for the OPC UA data source collector, or `publisher` for data publisher capability.
 *
 * - `version` - The version number of the capability. Option include `2` for Classic streams, V2 gateways, and `3` for MQTT-enabled, V3 gateways.
 *
 * After updating a capability configuration, the sync status becomes `OUT_OF_SYNC` until the gateway processes the configuration.Use `DescribeGatewayCapabilityConfiguration` to check the sync status and verify the configuration was applied.
 *
 * A gateway can have multiple capability configurations with different namespaces.
 */
export const updateGatewayCapabilityConfiguration: (
  input: UpdateGatewayCapabilityConfigurationRequest,
) => Effect.Effect<
  UpdateGatewayCapabilityConfigurationResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayCapabilityConfigurationRequest,
  output: UpdateGatewayCapabilityConfigurationResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a dashboard in an IoT SiteWise Monitor project.
 */
export const createDashboard: (
  input: CreateDashboardRequest,
) => Effect.Effect<
  CreateDashboardResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a project in the specified portal.
 *
 * Make sure that the project name and description don't contain confidential
 * information.
 */
export const createProject: (
  input: CreateProjectRequest,
) => Effect.Effect<
  CreateProjectResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a group (batch) of assets with an IoT SiteWise Monitor project.
 */
export const batchAssociateProjectAssets: (
  input: BatchAssociateProjectAssetsRequest,
) => Effect.Effect<
  BatchAssociateProjectAssetsResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateProjectAssetsRequest,
  output: BatchAssociateProjectAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an access policy that grants the specified identity access to the specified
 * IoT SiteWise Monitor resource. You can use this operation to revoke access to an IoT SiteWise Monitor
 * resource.
 */
export const deleteAccessPolicy: (
  input: DeleteAccessPolicyRequest,
) => Effect.Effect<
  DeleteAccessPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPolicyRequest,
  output: DeleteAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a computation model. This action can't be undone.
 */
export const deleteComputationModel: (
  input: DeleteComputationModelRequest,
) => Effect.Effect<
  DeleteComputationModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComputationModelRequest,
  output: DeleteComputationModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a dataset. This cannot be undone.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => Effect.Effect<
  DeleteDatasetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset composite model (also known as an asset component).
 * An `AssetCompositeModel` is an instance of an
 * `AssetModelCompositeModel`. If you want to see information about the model this is
 * based on, call DescribeAssetModelCompositeModel.
 */
export const describeAssetCompositeModel: (
  input: DescribeAssetCompositeModelRequest,
) => Effect.Effect<
  DescribeAssetCompositeModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetCompositeModelRequest,
  output: DescribeAssetCompositeModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset model. This includes details about the asset model's
 * properties, hierarchies, composite models, and any interface relationships if the asset model
 * implements interfaces.
 */
export const describeAssetModel: (
  input: DescribeAssetModelRequest,
) => Effect.Effect<
  DescribeAssetModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetModelRequest,
  output: DescribeAssetModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an interface relationship between an asset model and an
 * interface asset model.
 */
export const describeAssetModelInterfaceRelationship: (
  input: DescribeAssetModelInterfaceRelationshipRequest,
) => Effect.Effect<
  DescribeAssetModelInterfaceRelationshipResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetModelInterfaceRelationshipRequest,
  output: DescribeAssetModelInterfaceRelationshipResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset property.
 *
 * When you call this operation for an attribute property, this response includes the
 * default attribute value that you define in the asset model. If you update the default value
 * in the model, this operation's response includes the new default value.
 *
 * This operation doesn't return the value of the asset property. To get the value of an
 * asset property, use GetAssetPropertyValue.
 */
export const describeAssetProperty: (
  input: DescribeAssetPropertyRequest,
) => Effect.Effect<
  DescribeAssetPropertyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetPropertyRequest,
  output: DescribeAssetPropertyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about the execution summary of a computation model.
 */
export const describeComputationModelExecutionSummary: (
  input: DescribeComputationModelExecutionSummaryRequest,
) => Effect.Effect<
  DescribeComputationModelExecutionSummaryResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComputationModelExecutionSummaryRequest,
  output: DescribeComputationModelExecutionSummaryResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about the execution.
 */
export const describeExecution: (
  input: DescribeExecutionRequest,
) => Effect.Effect<
  DescribeExecutionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExecutionRequest,
  output: DescribeExecutionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a gateway.
 */
export const describeGateway: (
  input: DescribeGatewayRequest,
) => Effect.Effect<
  DescribeGatewayResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayRequest,
  output: DescribeGatewayResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a portal.
 */
export const describePortal: (
  input: DescribePortalRequest,
) => Effect.Effect<
  DescribePortalResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePortalRequest,
  output: DescribePortalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of actions for a specific target resource.
 */
export const listActions: (
  input: ListActionsRequest,
) => Effect.Effect<
  ListActionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActionsRequest,
  output: ListActionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of properties associated with an asset.
 * If you update properties associated with the model before you finish listing all the properties,
 * you need to start all over again.
 */
export const listAssetProperties: {
  (
    input: ListAssetPropertiesRequest,
  ): Effect.Effect<
    ListAssetPropertiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetPropertiesRequest,
  ) => Stream.Stream<
    ListAssetPropertiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetPropertiesRequest,
  ) => Stream.Stream<
    AssetPropertySummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetPropertiesRequest,
  output: ListAssetPropertiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetPropertySummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of asset summaries.
 *
 * You can use this operation to do the following:
 *
 * - List assets based on a specific asset model.
 *
 * - List top-level assets.
 *
 * You can't use this operation to list all assets. To retrieve summaries for all of your
 * assets, use ListAssetModels to get all of your asset model IDs. Then, use ListAssets to get all
 * assets for each asset model.
 */
export const listAssets: {
  (
    input: ListAssetsRequest,
  ): Effect.Effect<
    ListAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetsRequest,
  ) => Stream.Stream<
    ListAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetsRequest,
  ) => Stream.Stream<
    AssetSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetsRequest,
  output: ListAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of associated assets.
 *
 * You can use this operation to do the following:
 *
 * - `CHILD` - List all child assets associated to the asset.
 *
 * - `PARENT` - List the asset's parent asset.
 */
export const listAssociatedAssets: {
  (
    input: ListAssociatedAssetsRequest,
  ): Effect.Effect<
    ListAssociatedAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedAssetsRequest,
  ) => Stream.Stream<
    ListAssociatedAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedAssetsRequest,
  ) => Stream.Stream<
    AssociatedAssetsSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedAssetsRequest,
  output: ListAssociatedAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of bulk import job requests. For more information, see List bulk
 * import jobs (CLI) in the *IoT SiteWise User Guide*.
 */
export const listBulkImportJobs: {
  (
    input: ListBulkImportJobsRequest,
  ): Effect.Effect<
    ListBulkImportJobsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBulkImportJobsRequest,
  ) => Stream.Stream<
    ListBulkImportJobsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBulkImportJobsRequest,
  ) => Stream.Stream<
    JobSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBulkImportJobsRequest,
  output: ListBulkImportJobsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of composition relationships for an asset model of type
 * `COMPONENT_MODEL`.
 */
export const listCompositionRelationships: {
  (
    input: ListCompositionRelationshipsRequest,
  ): Effect.Effect<
    ListCompositionRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCompositionRelationshipsRequest,
  ) => Stream.Stream<
    ListCompositionRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCompositionRelationshipsRequest,
  ) => Stream.Stream<
    CompositionRelationshipSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCompositionRelationshipsRequest,
  output: ListCompositionRelationshipsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "compositionRelationshipSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all distinct resources that are resolved from the executed actions of the
 * computation model.
 */
export const listComputationModelResolveToResources: {
  (
    input: ListComputationModelResolveToResourcesRequest,
  ): Effect.Effect<
    ListComputationModelResolveToResourcesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComputationModelResolveToResourcesRequest,
  ) => Stream.Stream<
    ListComputationModelResolveToResourcesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComputationModelResolveToResourcesRequest,
  ) => Stream.Stream<
    ComputationModelResolveToResourceSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComputationModelResolveToResourcesRequest,
  output: ListComputationModelResolveToResourcesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "computationModelResolveToResourceSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of summaries of all executions.
 */
export const listExecutions: {
  (
    input: ListExecutionsRequest,
  ): Effect.Effect<
    ListExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ListExecutionsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ExecutionSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExecutionsRequest,
  output: ListExecutionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "executionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of asset models that have a specific interface asset model
 * applied to them.
 */
export const listInterfaceRelationships: {
  (
    input: ListInterfaceRelationshipsRequest,
  ): Effect.Effect<
    ListInterfaceRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInterfaceRelationshipsRequest,
  ) => Stream.Stream<
    ListInterfaceRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInterfaceRelationshipsRequest,
  ) => Stream.Stream<
    InterfaceRelationshipSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInterfaceRelationshipsRequest,
  output: ListInterfaceRelationshipsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "interfaceRelationshipSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of time series (data streams).
 */
export const listTimeSeries: {
  (
    input: ListTimeSeriesRequest,
  ): Effect.Effect<
    ListTimeSeriesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTimeSeriesRequest,
  ) => Stream.Stream<
    ListTimeSeriesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTimeSeriesRequest,
  ) => Stream.Stream<
    TimeSeriesSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTimeSeriesRequest,
  output: ListTimeSeriesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "TimeSeriesSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an IoT SiteWise Monitor portal.
 */
export const updatePortal: (
  input: UpdatePortalRequest,
) => Effect.Effect<
  UpdatePortalResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePortalRequest,
  output: UpdatePortalResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an asset. This action can't be undone. For more information, see Deleting assets and
 * models in the *IoT SiteWise User Guide*.
 *
 * You can't delete an asset that's associated to another asset. For more information, see
 * DisassociateAssets.
 */
export const deleteAsset: (
  input: DeleteAssetRequest,
) => Effect.Effect<
  DeleteAssetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetRequest,
  output: DeleteAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an interface relationship between an asset model and an interface asset
 * model.
 */
export const deleteAssetModelInterfaceRelationship: (
  input: DeleteAssetModelInterfaceRelationshipRequest,
) => Effect.Effect<
  DeleteAssetModelInterfaceRelationshipResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetModelInterfaceRelationshipRequest,
  output: DeleteAssetModelInterfaceRelationshipResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes an access policy, which specifies an identity's access to an IoT SiteWise Monitor portal or
 * project.
 */
export const describeAccessPolicy: (
  input: DescribeAccessPolicyRequest,
) => Effect.Effect<
  DescribeAccessPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccessPolicyRequest,
  output: DescribeAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an action.
 */
export const describeAction: (
  input: DescribeActionRequest,
) => Effect.Effect<
  DescribeActionResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActionRequest,
  output: DescribeActionResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a bulk import job request. For more information, see Describe
 * a bulk import job (CLI) in the *Amazon Simple Storage Service User Guide*.
 */
export const describeBulkImportJob: (
  input: DescribeBulkImportJobRequest,
) => Effect.Effect<
  DescribeBulkImportJobResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBulkImportJobRequest,
  output: DescribeBulkImportJobResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a computation model.
 */
export const describeComputationModel: (
  input: DescribeComputationModelRequest,
) => Effect.Effect<
  DescribeComputationModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComputationModelRequest,
  output: DescribeComputationModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a dashboard.
 */
export const describeDashboard: (
  input: DescribeDashboardRequest,
) => Effect.Effect<
  DescribeDashboardResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDashboardRequest,
  output: DescribeDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a dataset.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => Effect.Effect<
  DescribeDatasetResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Each gateway capability defines data sources for a gateway. This is the namespace of the gateway capability.
 *
 * . The namespace follows the format `service:capability:version`, where:
 *
 * - `service` - The service providing the capability, or `iotsitewise`.
 *
 * - `capability` - The specific capability type. Options include: `opcuacollector` for the OPC UA data source collector, or `publisher` for data publisher capability.
 *
 * - `version` - The version number of the capability. Option include `2` for Classic streams, V2 gateways, and `3` for MQTT-enabled, V3 gateways.
 *
 * After updating a capability configuration, the sync status becomes `OUT_OF_SYNC` until the gateway processes the configuration.Use `DescribeGatewayCapabilityConfiguration` to check the sync status and verify the configuration was applied.
 *
 * A gateway can have multiple capability configurations with different namespaces.
 */
export const describeGatewayCapabilityConfiguration: (
  input: DescribeGatewayCapabilityConfigurationRequest,
) => Effect.Effect<
  DescribeGatewayCapabilityConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayCapabilityConfigurationRequest,
  output: DescribeGatewayCapabilityConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the current IoT SiteWise logging options.
 */
export const describeLoggingOptions: (
  input: DescribeLoggingOptionsRequest,
) => Effect.Effect<
  DescribeLoggingOptionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoggingOptionsRequest,
  output: DescribeLoggingOptionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a project.
 */
export const describeProject: (
  input: DescribeProjectRequest,
) => Effect.Effect<
  DescribeProjectResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProjectRequest,
  output: DescribeProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a time series (data stream).
 *
 * To identify a time series, do one of the following:
 *
 * - If the time series isn't associated with an asset property,
 * specify the `alias` of the time series.
 *
 * - If the time series is associated with an asset property,
 * specify one of the following:
 *
 * - The `alias` of the time series.
 *
 * - The `assetId` and `propertyId` that identifies the asset property.
 */
export const describeTimeSeries: (
  input: DescribeTimeSeriesRequest,
) => Effect.Effect<
  DescribeTimeSeriesResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTimeSeriesRequest,
  output: DescribeTimeSeriesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of composite models associated with the asset model
 */
export const listAssetModelCompositeModels: {
  (
    input: ListAssetModelCompositeModelsRequest,
  ): Effect.Effect<
    ListAssetModelCompositeModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetModelCompositeModelsRequest,
  ) => Stream.Stream<
    ListAssetModelCompositeModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetModelCompositeModelsRequest,
  ) => Stream.Stream<
    AssetModelCompositeModelSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetModelCompositeModelsRequest,
  output: ListAssetModelCompositeModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetModelCompositeModelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Associates a time series (data stream) with an asset property.
 */
export const associateTimeSeriesToAssetProperty: (
  input: AssociateTimeSeriesToAssetPropertyRequest,
) => Effect.Effect<
  AssociateTimeSeriesToAssetPropertyResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateTimeSeriesToAssetPropertyRequest,
  output: AssociateTimeSeriesToAssetPropertyResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a gateway from IoT SiteWise. When you delete a gateway, some of the gateway's files remain
 * in your gateway's file system.
 */
export const deleteGateway: (
  input: DeleteGatewayRequest,
) => Effect.Effect<
  DeleteGatewayResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayRequest,
  output: DeleteGatewayResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a time series (data stream). If you delete a time series that's associated with an
 * asset property, the asset property still exists, but the time series will no longer be
 * associated with this asset property.
 *
 * To identify a time series, do one of the following:
 *
 * - If the time series isn't associated with an asset property,
 * specify the `alias` of the time series.
 *
 * - If the time series is associated with an asset property,
 * specify one of the following:
 *
 * - The `alias` of the time series.
 *
 * - The `assetId` and `propertyId` that identifies the asset property.
 */
export const deleteTimeSeries: (
  input: DeleteTimeSeriesRequest,
) => Effect.Effect<
  DeleteTimeSeriesResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTimeSeriesRequest,
  output: DeleteTimeSeriesResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a child asset from the given parent asset through a hierarchy defined in the
 * parent asset's model.
 */
export const disassociateAssets: (
  input: DisassociateAssetsRequest,
) => Effect.Effect<
  DisassociateAssetsResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAssetsRequest,
  output: DisassociateAssetsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a time series (data stream) from an asset property.
 */
export const disassociateTimeSeriesFromAssetProperty: (
  input: DisassociateTimeSeriesFromAssetPropertyRequest,
) => Effect.Effect<
  DisassociateTimeSeriesFromAssetPropertyResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateTimeSeriesFromAssetPropertyRequest,
  output: DisassociateTimeSeriesFromAssetPropertyResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Sets logging options for IoT SiteWise.
 */
export const putLoggingOptions: (
  input: PutLoggingOptionsRequest,
) => Effect.Effect<
  PutLoggingOptionsResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an asset property's alias and notification state.
 *
 * This operation overwrites the property's existing alias and notification state. To keep
 * your existing property's alias or notification state, you must include the existing values
 * in the UpdateAssetProperty request. For more information, see DescribeAssetProperty.
 */
export const updateAssetProperty: (
  input: UpdateAssetPropertyRequest,
) => Effect.Effect<
  UpdateAssetPropertyResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetPropertyRequest,
  output: UpdateAssetPropertyResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a gateway's name.
 */
export const updateGateway: (
  input: UpdateGatewayRequest,
) => Effect.Effect<
  UpdateGatewayResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayRequest,
  output: UpdateGatewayResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a dashboard from IoT SiteWise Monitor.
 */
export const deleteDashboard: (
  input: DeleteDashboardRequest,
) => Effect.Effect<
  DeleteDashboardResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a project from IoT SiteWise Monitor.
 */
export const deleteProject: (
  input: DeleteProjectRequest,
) => Effect.Effect<
  DeleteProjectResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an existing access policy that specifies an identity's access to an IoT SiteWise Monitor
 * portal or project resource.
 */
export const updateAccessPolicy: (
  input: UpdateAccessPolicyRequest,
) => Effect.Effect<
  UpdateAccessPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessPolicyRequest,
  output: UpdateAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an IoT SiteWise Monitor dashboard.
 */
export const updateDashboard: (
  input: UpdateDashboardRequest,
) => Effect.Effect<
  UpdateDashboardResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an IoT SiteWise Monitor project.
 */
export const updateProject: (
  input: UpdateProjectRequest,
) => Effect.Effect<
  UpdateProjectResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Disassociates a group (batch) of assets from an IoT SiteWise Monitor project.
 */
export const batchDisassociateProjectAssets: (
  input: BatchDisassociateProjectAssetsRequest,
) => Effect.Effect<
  BatchDisassociateProjectAssetsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateProjectAssetsRequest,
  output: BatchDisassociateProjectAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about the default encryption configuration for the Amazon Web Services account in
 * the default or specified Region. For more information, see Key management in the
 * *IoT SiteWise User Guide*.
 */
export const describeDefaultEncryptionConfiguration: (
  input: DescribeDefaultEncryptionConfigurationRequest,
) => Effect.Effect<
  DescribeDefaultEncryptionConfigurationResponse,
  | InternalFailureException
  | InvalidRequestException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDefaultEncryptionConfigurationRequest,
  output: DescribeDefaultEncryptionConfigurationResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of access policies for an identity (an IAM Identity Center user, an IAM Identity Center
 * group, or an IAM user) or an IoT SiteWise Monitor resource (a portal or project).
 */
export const listAccessPolicies: {
  (
    input: ListAccessPoliciesRequest,
  ): Effect.Effect<
    ListAccessPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPoliciesRequest,
  ) => Stream.Stream<
    ListAccessPoliciesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPoliciesRequest,
  ) => Stream.Stream<
    AccessPolicySummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPoliciesRequest,
  output: ListAccessPoliciesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accessPolicySummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of summaries of all asset models.
 */
export const listAssetModels: {
  (
    input: ListAssetModelsRequest,
  ): Effect.Effect<
    ListAssetModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetModelsRequest,
  ) => Stream.Stream<
    ListAssetModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetModelsRequest,
  ) => Stream.Stream<
    AssetModelSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetModelsRequest,
  output: ListAssetModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetModelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of summaries of all computation models.
 */
export const listComputationModels: {
  (
    input: ListComputationModelsRequest,
  ): Effect.Effect<
    ListComputationModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComputationModelsRequest,
  ) => Stream.Stream<
    ListComputationModelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComputationModelsRequest,
  ) => Stream.Stream<
    ComputationModelSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComputationModelsRequest,
  output: ListComputationModelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "computationModelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of dashboards for an IoT SiteWise Monitor project.
 */
export const listDashboards: {
  (
    input: ListDashboardsRequest,
  ): Effect.Effect<
    ListDashboardsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDashboardsRequest,
  ) => Stream.Stream<
    ListDashboardsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDashboardsRequest,
  ) => Stream.Stream<
    DashboardSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dashboardSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of datasets for a specific target resource.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): Effect.Effect<
    ListDatasetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => Stream.Stream<
    ListDatasetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => Stream.Stream<
    DatasetSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of gateways.
 */
export const listGateways: {
  (
    input: ListGatewaysRequest,
  ): Effect.Effect<
    ListGatewaysResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewaysRequest,
  ) => Stream.Stream<
    ListGatewaysResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewaysRequest,
  ) => Stream.Stream<
    GatewaySummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGatewaysRequest,
  output: ListGatewaysResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "gatewaySummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of IoT SiteWise Monitor portals.
 */
export const listPortals: {
  (
    input: ListPortalsRequest,
  ): Effect.Effect<
    ListPortalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPortalsRequest,
  ) => Stream.Stream<
    ListPortalsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPortalsRequest,
  ) => Stream.Stream<
    PortalSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPortalsRequest,
  output: ListPortalsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "portalSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of projects for an IoT SiteWise Monitor portal.
 */
export const listProjects: {
  (
    input: ListProjectsRequest,
  ): Effect.Effect<
    ListProjectsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ListProjectsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ProjectSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projectSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of assets associated with an IoT SiteWise Monitor project.
 */
export const listProjectAssets: {
  (
    input: ListProjectAssetsRequest,
  ): Effect.Effect<
    ListProjectAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectAssetsRequest,
  ) => Stream.Stream<
    ListProjectAssetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectAssetsRequest,
  ) => Stream.Stream<
    ID,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectAssetsRequest,
  output: ListProjectAssetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an access policy that grants the specified identity (IAM Identity Center user, IAM Identity Center group, or
 * IAM user) access to the specified IoT SiteWise Monitor portal or project resource.
 *
 * Support for access policies that use an SSO Group as the identity is not supported at this time.
 */
export const createAccessPolicy: (
  input: CreateAccessPolicyRequest,
) => Effect.Effect<
  CreateAccessPolicyResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPolicyRequest,
  output: CreateAccessPolicyResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a portal, which can contain projects and dashboards. IoT SiteWise Monitor uses IAM Identity Center or IAM
 * to authenticate portal users and manage user permissions.
 *
 * Before you can sign in to a new portal, you must add at least one identity to that
 * portal. For more information, see Adding or removing portal
 * administrators in the *IoT SiteWise User Guide*.
 */
export const createPortal: (
  input: CreatePortalRequest,
) => Effect.Effect<
  CreatePortalResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePortalRequest,
  output: CreatePortalResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a portal from IoT SiteWise Monitor.
 */
export const deletePortal: (
  input: DeletePortalRequest,
) => Effect.Effect<
  DeletePortalResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePortalRequest,
  output: DeletePortalResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset.
 */
export const describeAsset: (
  input: DescribeAssetRequest,
) => Effect.Effect<
  DescribeAssetResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetRequest,
  output: DescribeAssetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about an asset model composite model (also known as an asset model
 * component). For more information, see Custom composite models
 * (Components) in the *IoT SiteWise User Guide*.
 */
export const describeAssetModelCompositeModel: (
  input: DescribeAssetModelCompositeModelRequest,
) => Effect.Effect<
  DescribeAssetModelCompositeModelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssetModelCompositeModelRequest,
  output: DescribeAssetModelCompositeModelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a paginated list of properties associated with an asset model.
 * If you update properties associated with the model before you finish listing all the properties,
 * you need to start all over again.
 */
export const listAssetModelProperties: {
  (
    input: ListAssetModelPropertiesRequest,
  ): Effect.Effect<
    ListAssetModelPropertiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetModelPropertiesRequest,
  ) => Stream.Stream<
    ListAssetModelPropertiesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetModelPropertiesRequest,
  ) => Stream.Stream<
    AssetModelPropertySummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetModelPropertiesRequest,
  output: ListAssetModelPropertiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetModelPropertySummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a paginated list of asset relationships for an asset. You can use this operation
 * to identify an asset's root asset and all associated assets between that asset and its
 * root.
 */
export const listAssetRelationships: {
  (
    input: ListAssetRelationshipsRequest,
  ): Effect.Effect<
    ListAssetRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssetRelationshipsRequest,
  ) => Stream.Stream<
    ListAssetRelationshipsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssetRelationshipsRequest,
  ) => Stream.Stream<
    AssetRelationshipSummary,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssetRelationshipsRequest,
  output: ListAssetRelationshipsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetRelationshipSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates or updates an interface relationship between an asset model and an interface asset
 * model. This operation applies an interface to an asset model.
 */
export const putAssetModelInterfaceRelationship: (
  input: PutAssetModelInterfaceRelationshipRequest,
) => Effect.Effect<
  PutAssetModelInterfaceRelationshipResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAssetModelInterfaceRelationshipRequest,
  output: PutAssetModelInterfaceRelationshipResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an asset model. This action can't be undone. You must delete all assets created
 * from an asset model before you can delete the model. Also, you can't delete an asset model if
 * a parent asset model exists that contains a property formula expression that depends on the
 * asset model that you want to delete. For more information, see Deleting assets and models in the
 * *IoT SiteWise User Guide*.
 */
export const deleteAssetModel: (
  input: DeleteAssetModelRequest,
) => Effect.Effect<
  DeleteAssetModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetModelRequest,
  output: DeleteAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an asset's name. For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 */
export const updateAsset: (
  input: UpdateAssetRequest,
) => Effect.Effect<
  UpdateAssetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetRequest,
  output: UpdateAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a composite model. This action can't be undone. You must delete all assets created
 * from a composite model before you can delete the model. Also, you can't delete a composite
 * model if a parent asset model exists that contains a property formula expression that depends
 * on the asset model that you want to delete. For more information, see Deleting assets and
 * models in the *IoT SiteWise User Guide*.
 */
export const deleteAssetModelCompositeModel: (
  input: DeleteAssetModelCompositeModelRequest,
) => Effect.Effect<
  DeleteAssetModelCompositeModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | PreconditionFailedException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetModelCompositeModelRequest,
  output: DeleteAssetModelCompositeModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    PreconditionFailedException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a composite model and all of the assets that were created from the model. Each
 * asset created from the model inherits the updated asset model's property and hierarchy
 * definitions. For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 *
 * If you remove a property from a composite asset model, IoT SiteWise deletes all previous data
 * for that property. You can’t change the type or data type of an existing property.
 *
 * To replace an existing composite asset model property with a new one with the same
 * `name`, do the following:
 *
 * - Submit an `UpdateAssetModelCompositeModel` request with the entire
 * existing property removed.
 *
 * - Submit a second `UpdateAssetModelCompositeModel` request that includes
 * the new property. The new asset property will have the same `name` as the
 * previous one and IoT SiteWise will generate a new unique `id`.
 */
export const updateAssetModelCompositeModel: (
  input: UpdateAssetModelCompositeModelRequest,
) => Effect.Effect<
  UpdateAssetModelCompositeModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | PreconditionFailedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetModelCompositeModelRequest,
  output: UpdateAssetModelCompositeModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    PreconditionFailedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a custom composite model from specified property and hierarchy definitions. There
 * are two types of custom composite models, `inline` and
 * `component-model-based`.
 *
 * Use component-model-based custom composite models to define standard, reusable components.
 * A component-model-based custom composite model consists of a name, a description, and the ID
 * of the component model it references. A component-model-based custom composite model has no
 * properties of its own; its referenced component model provides its associated properties to
 * any created assets. For more information, see Custom composite models (Components)
 * in the *IoT SiteWise User Guide*.
 *
 * Use inline custom composite models to organize the properties of an asset model. The
 * properties of inline custom composite models are local to the asset model where they are
 * included and can't be used to create multiple assets.
 *
 * To create a component-model-based model, specify the `composedAssetModelId` of
 * an existing asset model with `assetModelType` of
 * `COMPONENT_MODEL`.
 *
 * To create an inline model, specify the `assetModelCompositeModelProperties` and
 * don't include an `composedAssetModelId`.
 */
export const createAssetModelCompositeModel: (
  input: CreateAssetModelCompositeModelRequest,
) => Effect.Effect<
  CreateAssetModelCompositeModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | PreconditionFailedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetModelCompositeModelRequest,
  output: CreateAssetModelCompositeModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    PreconditionFailedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates an asset model and all of the assets that were created from the model. Each asset
 * created from the model inherits the updated asset model's property and hierarchy definitions.
 * For more information, see Updating assets and models in the
 * *IoT SiteWise User Guide*.
 *
 * If you remove a property from an asset model, IoT SiteWise deletes all previous data for that
 * property. You can’t change the type or data type of an existing property.
 *
 * To replace an existing asset model property with a new one with the same
 * `name`, do the following:
 *
 * - Submit an `UpdateAssetModel` request with the entire existing property
 * removed.
 *
 * - Submit a second `UpdateAssetModel` request that includes the new
 * property. The new asset property will have the same `name` as the previous
 * one and IoT SiteWise will generate a new unique `id`.
 */
export const updateAssetModel: (
  input: UpdateAssetModelRequest,
) => Effect.Effect<
  UpdateAssetModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | PreconditionFailedException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetModelRequest,
  output: UpdateAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    PreconditionFailedException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Configures storage settings for IoT SiteWise.
 */
export const putStorageConfiguration: (
  input: PutStorageConfigurationRequest,
) => Effect.Effect<
  PutStorageConfigurationResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutStorageConfigurationRequest,
  output: PutStorageConfigurationResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the computation model.
 */
export const updateComputationModel: (
  input: UpdateComputationModelRequest,
) => Effect.Effect<
  UpdateComputationModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComputationModelRequest,
  output: UpdateComputationModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Associates a child asset with the given parent asset through a hierarchy defined in the
 * parent asset's model. For more information, see Associating assets in the
 * *IoT SiteWise User Guide*.
 */
export const associateAssets: (
  input: AssociateAssetsRequest,
) => Effect.Effect<
  AssociateAssetsResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAssetsRequest,
  output: AssociateAssetsResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a gateway, which is a virtual or edge device that delivers industrial data streams
 * from local servers to IoT SiteWise. For more information, see Ingesting data using a gateway in the
 * *IoT SiteWise User Guide*.
 */
export const createGateway: (
  input: CreateGatewayRequest,
) => Effect.Effect<
  CreateGatewayResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGatewayRequest,
  output: CreateGatewayResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the list of tags for an IoT SiteWise resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Adds tags to an IoT SiteWise resource. If a tag already exists for the resource, this operation
 * updates the tag's value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    UnauthorizedException,
  ],
}));
/**
 * Get interpolated values for an asset property for a specified time interval, during a
 * period of time. If your time series is missing data points during the specified time interval,
 * you can use interpolation to estimate the missing data.
 *
 * For example, you can use this operation to return the interpolated temperature values for
 * a wind turbine every 24 hours over a duration of 7 days.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getInterpolatedAssetPropertyValues: {
  (
    input: GetInterpolatedAssetPropertyValuesRequest,
  ): Effect.Effect<
    GetInterpolatedAssetPropertyValuesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetInterpolatedAssetPropertyValuesRequest,
  ) => Stream.Stream<
    GetInterpolatedAssetPropertyValuesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetInterpolatedAssetPropertyValuesRequest,
  ) => Stream.Stream<
    InterpolatedAssetPropertyValue,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInterpolatedAssetPropertyValuesRequest,
  output: GetInterpolatedAssetPropertyValuesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "interpolatedAssetPropertyValues",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a tag from an IoT SiteWise resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
  ],
}));
/**
 * Gets an asset property's current value. For more information, see Querying
 * current values in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyValue: (
  input: GetAssetPropertyValueRequest,
) => Effect.Effect<
  GetAssetPropertyValueResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetPropertyValueRequest,
  output: GetAssetPropertyValueResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Gets the history of an asset property's values. For more information, see Querying
 * historical values in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyValueHistory: {
  (
    input: GetAssetPropertyValueHistoryRequest,
  ): Effect.Effect<
    GetAssetPropertyValueHistoryResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAssetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    GetAssetPropertyValueHistoryResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAssetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    AssetPropertyValue,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAssetPropertyValueHistoryRequest,
  output: GetAssetPropertyValueHistoryResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "assetPropertyValueHistory",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets aggregated values for an asset property. For more information, see Querying
 * aggregates in the *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 */
export const getAssetPropertyAggregates: {
  (
    input: GetAssetPropertyAggregatesRequest,
  ): Effect.Effect<
    GetAssetPropertyAggregatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAssetPropertyAggregatesRequest,
  ) => Stream.Stream<
    GetAssetPropertyAggregatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAssetPropertyAggregatesRequest,
  ) => Stream.Stream<
    AggregatedValue,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAssetPropertyAggregatesRequest,
  output: GetAssetPropertyAggregatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "aggregatedValues",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets aggregated values (for example, average, minimum, and maximum) for one or more asset
 * properties. For more information, see Querying aggregates in the
 * *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyAggregates: {
  (
    input: BatchGetAssetPropertyAggregatesRequest,
  ): Effect.Effect<
    BatchGetAssetPropertyAggregatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetAssetPropertyAggregatesRequest,
  ) => Stream.Stream<
    BatchGetAssetPropertyAggregatesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetAssetPropertyAggregatesRequest,
  ) => Stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetAssetPropertyAggregatesRequest,
  output: BatchGetAssetPropertyAggregatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the current value for one or more asset properties. For more information, see Querying
 * current values in the *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyValue: {
  (
    input: BatchGetAssetPropertyValueRequest,
  ): Effect.Effect<
    BatchGetAssetPropertyValueResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetAssetPropertyValueRequest,
  ) => Stream.Stream<
    BatchGetAssetPropertyValueResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetAssetPropertyValueRequest,
  ) => Stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetAssetPropertyValueRequest,
  output: BatchGetAssetPropertyValueResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Gets the historical values for one or more asset properties. For more information, see
 * Querying historical values in the *IoT SiteWise User Guide*.
 */
export const batchGetAssetPropertyValueHistory: {
  (
    input: BatchGetAssetPropertyValueHistoryRequest,
  ): Effect.Effect<
    BatchGetAssetPropertyValueHistoryResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetAssetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    BatchGetAssetPropertyValueHistoryResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetAssetPropertyValueHistoryRequest,
  ) => Stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetAssetPropertyValueHistoryRequest,
  output: BatchGetAssetPropertyValueHistoryResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an asset from an existing asset model. For more information, see Creating assets in the
 * *IoT SiteWise User Guide*.
 */
export const createAsset: (
  input: CreateAssetRequest,
) => Effect.Effect<
  CreateAssetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetRequest,
  output: CreateAssetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Defines a job to ingest data to IoT SiteWise from Amazon S3. For more information, see Create a
 * bulk import job (CLI) in the *Amazon Simple Storage Service User Guide*.
 *
 * Before you create a bulk import job, you must enable IoT SiteWise warm tier or IoT SiteWise cold tier.
 * For more information about how to configure storage settings, see PutStorageConfiguration.
 *
 * Bulk import is designed to store historical data to IoT SiteWise.
 *
 * - Newly ingested data in the hot tier triggers notifications and computations.
 *
 * - After data moves from the hot tier to the warm or cold tier based on retention
 * settings, it does not trigger computations or notifications.
 *
 * - Data older than 7 days does not trigger computations or notifications.
 */
export const createBulkImportJob: (
  input: CreateBulkImportJobRequest,
) => Effect.Effect<
  CreateBulkImportJobResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBulkImportJobRequest,
  output: CreateBulkImportJobResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Create a computation model with a configuration and data binding.
 */
export const createComputationModel: (
  input: CreateComputationModelRequest,
) => Effect.Effect<
  CreateComputationModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComputationModelRequest,
  output: CreateComputationModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a dataset to connect an external datasource.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => Effect.Effect<
  CreateDatasetResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Run SQL queries to retrieve metadata and time-series data from asset models, assets,
 * measurements, metrics, transforms, and aggregates.
 */
export const executeQuery: {
  (
    input: ExecuteQueryRequest,
  ): Effect.Effect<
    ExecuteQueryResponse,
    | AccessDeniedException
    | InternalFailureException
    | InvalidRequestException
    | QueryTimeoutException
    | ServiceUnavailableException
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
    | InternalFailureException
    | InvalidRequestException
    | QueryTimeoutException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ExecuteQueryRequest,
  ) => Stream.Stream<
    Row,
    | AccessDeniedException
    | InternalFailureException
    | InvalidRequestException
    | QueryTimeoutException
    | ServiceUnavailableException
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
    InternalFailureException,
    InvalidRequestException,
    QueryTimeoutException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "rows",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an asset model from specified property and hierarchy definitions. You create
 * assets from asset models. With asset models, you can easily create assets of the same type
 * that have standardized definitions. Each asset created from a model inherits the asset model's
 * property and hierarchy definitions. For more information, see Defining asset models in the
 * *IoT SiteWise User Guide*.
 *
 * You can create three types of asset models, `ASSET_MODEL`,
 * `COMPONENT_MODEL`, or an `INTERFACE`.
 *
 * - **ASSET_MODEL** – (default) An asset model that
 * you can use to create assets. Can't be included as a component in another asset
 * model.
 *
 * - **COMPONENT_MODEL** – A reusable component that
 * you can include in the composite models of other asset models. You can't create
 * assets directly from this type of asset model.
 *
 * - **INTERFACE** – An interface is a type of model
 * that defines a standard structure that can be applied to different asset models.
 */
export const createAssetModel: (
  input: CreateAssetModelRequest,
) => Effect.Effect<
  CreateAssetModelResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssetModelRequest,
  output: CreateAssetModelResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all data binding usages for computation models. This allows to identify where
 * specific data bindings are being utilized across the computation models. This track
 * dependencies between data sources and computation models.
 */
export const listComputationModelDataBindingUsages: {
  (
    input: ListComputationModelDataBindingUsagesRequest,
  ): Effect.Effect<
    ListComputationModelDataBindingUsagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComputationModelDataBindingUsagesRequest,
  ) => Stream.Stream<
    ListComputationModelDataBindingUsagesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComputationModelDataBindingUsagesRequest,
  ) => Stream.Stream<
    ComputationModelDataBindingUsageSummary,
    | InternalFailureException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComputationModelDataBindingUsagesRequest,
  output: ListComputationModelDataBindingUsagesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "dataBindingUsageSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Sends a list of asset property values to IoT SiteWise. Each value is a timestamp-quality-value
 * (TQV) data point. For more information, see Ingesting data using the API in the
 * *IoT SiteWise User Guide*.
 *
 * To identify an asset property, you must specify one of the following:
 *
 * - The `assetId` and `propertyId` of an asset property.
 *
 * - A `propertyAlias`, which is a data stream alias (for example,
 * `/company/windfarm/3/turbine/7/temperature`). To define an asset property's alias, see UpdateAssetProperty.
 *
 * With respect to Unix epoch time, IoT SiteWise accepts only TQVs that have a timestamp of no more
 * than 7 days in the past and no more than 10 minutes in the future. IoT SiteWise rejects timestamps
 * outside of the inclusive range of [-7 days, +10 minutes] and returns a
 * `TimestampOutOfRangeException` error.
 *
 * For each asset property, IoT SiteWise overwrites TQVs with duplicate timestamps unless the newer
 * TQV has a different quality. For example, if you store a TQV `{T1, GOOD, V1}`,
 * then storing `{T1, GOOD, V2}` replaces the existing TQV.
 *
 * IoT SiteWise authorizes access to each `BatchPutAssetPropertyValue` entry individually.
 * For more information, see BatchPutAssetPropertyValue authorization in the
 * *IoT SiteWise User Guide*.
 */
export const batchPutAssetPropertyValue: (
  input: BatchPutAssetPropertyValueRequest,
) => Effect.Effect<
  BatchPutAssetPropertyValueResponse,
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutAssetPropertyValueRequest,
  output: BatchPutAssetPropertyValueResponse,
  errors: [
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Invokes SiteWise Assistant to start or continue a conversation.
 */
export const invokeAssistant: (
  input: InvokeAssistantRequest,
) => Effect.Effect<
  InvokeAssistantResponse,
  | AccessDeniedException
  | ConflictingOperationException
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeAssistantRequest,
  output: InvokeAssistantResponse,
  errors: [
    AccessDeniedException,
    ConflictingOperationException,
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));

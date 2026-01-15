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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Appflow",
  serviceShapeName: "SandstoneConfigurationServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "appflow" });
const ver = T.ServiceVersion("2020-08-23");
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
              `https://appflow-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://appflow-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://appflow.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://appflow.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type FlowName = string;
export type ExecutionId = string;
export type ConnectorProfileName = string;
export type KMSArn = string;
export type ConnectorLabel = string;
export type ClientToken = string;
export type FlowDescription = string;
export type EntityName = string;
export type ApiVersion = string;
export type MaxResults = number;
export type NextToken = string;
export type EntitiesPath = string;
export type ListEntitiesMaxResults = number;
export type ARN = string;
export type Description = string;
export type TagKey = string;
export type DestinationField = string;
export type TagValue = string;
export type ErrorMessage = string;
export type FlowArn = string;
export type FlowStatusMessage = string;
export type CreatedBy = string;
export type UpdatedBy = string;
export type ConnectorProfileArn = string;
export type DatetimeTypeFieldName = string;
export type Property = string;
export type GlueDataCatalogIAMRole = string;
export type GlueDataCatalogDatabaseName = string;
export type GlueDataCatalogTablePrefix = string;
export type ConnectorDescription = string;
export type ConnectorOwner = string;
export type ConnectorName = string;
export type ConnectorVersion = string;
export type ConnectorMode = string;
export type SupportedApiVersion = string;
export type LogoURL = string;
export type RegisteredBy = string;
export type Identifier = string;
export type Label = string;
export type ApplicationType = string;
export type MostRecentExecutionMessage = string;
export type Group = string;
export type InstanceUrl = string;
export type DatabaseUrl = string;
export type BucketName = string;
export type BucketPrefix = string;
export type RoleArn = string;
export type DataApiRoleArn = string;
export type ClusterIdentifier = string;
export type WorkgroupName = string;
export type DatabaseName = string;
export type Warehouse = string;
export type Stage = string;
export type PrivateLinkServiceName = string;
export type AccountName = string;
export type Region = string;
export type ApplicationHostUrl = string;
export type ApplicationServicePath = string;
export type PortNumber = number;
export type ClientNumber = string;
export type LogonLanguage = string;
export type BusinessUnitId = string;
export type ApiKey = string | redacted.Redacted<string>;
export type SecretKey = string | redacted.Redacted<string>;
export type ApplicationKey = string;
export type ApiToken = string;
export type ClientId = string;
export type ClientSecret = string | redacted.Redacted<string>;
export type AccessToken = string | redacted.Redacted<string>;
export type RefreshToken = string;
export type AccessKeyId = string | redacted.Redacted<string>;
export type Username = string;
export type Key = string;
export type Password = string | redacted.Redacted<string>;
export type ClientCredentialsArn = string | redacted.Redacted<string>;
export type JwtToken = string | redacted.Redacted<string>;
export type ApiSecretKey = string | redacted.Redacted<string>;
export type ScheduleExpression = string;
export type Timezone = string;
export type ScheduleOffset = number;
export type FlowErrorDeactivationThreshold = number;
export type DocumentType = string;
export type Name = string;
export type UpsolverBucketName = string;
export type DomainName = string;
export type ObjectTypeName = string;
export type ConnectorRuntimeSettingDataType = string;
export type ConnectorRuntimeSettingScope = string;
export type ConnectorSuppliedValue = string;
export type DataTransferApiTypeName = string;
export type CustomPropertyKey = string;
export type CustomPropertyValue = string;
export type PrivateConnectionProvisioningFailureMessage = string;
export type TokenUrl = string;
export type AuthCodeUrl = string;
export type OAuthScope = string;
export type ProfilePropertyKey = string;
export type ProfilePropertyValue = string;
export type AuthCode = string;
export type RedirectUri = string;
export type CustomAuthenticationType = string;
export type SAPODataMaxParallelism = number;
export type SAPODataMaxPageSize = number;
export type JavaBoolean = boolean;
export type FieldType = string;
export type Value = string;
export type ExecutionMessage = string;
export type CredentialsMapKey = string | redacted.Redacted<string>;
export type CredentialsMapValue = string | redacted.Redacted<string>;

//# Schemas
export type ExecutionIds = string[];
export const ExecutionIds = S.Array(S.String);
export type ConnectorType =
  | "Salesforce"
  | "Singular"
  | "Slack"
  | "Redshift"
  | "S3"
  | "Marketo"
  | "Googleanalytics"
  | "Zendesk"
  | "Servicenow"
  | "Datadog"
  | "Trendmicro"
  | "Snowflake"
  | "Dynatrace"
  | "Infornexus"
  | "Amplitude"
  | "Veeva"
  | "EventBridge"
  | "LookoutMetrics"
  | "Upsolver"
  | "Honeycode"
  | "CustomerProfiles"
  | "SAPOData"
  | "CustomConnector"
  | "Pardot"
  | (string & {});
export const ConnectorType = S.String;
export type ConnectionMode = "Public" | "Private" | (string & {});
export const ConnectionMode = S.String;
export type ConnectorProfileNameList = string[];
export const ConnectorProfileNameList = S.Array(S.String);
export type ConnectorTypeList = ConnectorType[];
export const ConnectorTypeList = S.Array(ConnectorType);
export type ConnectorProvisioningType = "LAMBDA" | (string & {});
export const ConnectorProvisioningType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelFlowExecutionsRequest {
  flowName: string;
  executionIds?: string[];
}
export const CancelFlowExecutionsRequest = S.suspend(() =>
  S.Struct({ flowName: S.String, executionIds: S.optional(ExecutionIds) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cancel-flow-executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelFlowExecutionsRequest",
}) as any as S.Schema<CancelFlowExecutionsRequest>;
export interface DeleteConnectorProfileRequest {
  connectorProfileName: string;
  forceDelete?: boolean;
}
export const DeleteConnectorProfileRequest = S.suspend(() =>
  S.Struct({
    connectorProfileName: S.String,
    forceDelete: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-connector-profile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorProfileRequest",
}) as any as S.Schema<DeleteConnectorProfileRequest>;
export interface DeleteConnectorProfileResponse {}
export const DeleteConnectorProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorProfileResponse",
}) as any as S.Schema<DeleteConnectorProfileResponse>;
export interface DeleteFlowRequest {
  flowName: string;
  forceDelete?: boolean;
}
export const DeleteFlowRequest = S.suspend(() =>
  S.Struct({ flowName: S.String, forceDelete: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFlowRequest",
}) as any as S.Schema<DeleteFlowRequest>;
export interface DeleteFlowResponse {}
export const DeleteFlowResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFlowResponse",
}) as any as S.Schema<DeleteFlowResponse>;
export interface DescribeConnectorRequest {
  connectorType: ConnectorType;
  connectorLabel?: string;
}
export const DescribeConnectorRequest = S.suspend(() =>
  S.Struct({
    connectorType: ConnectorType,
    connectorLabel: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-connector" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorRequest",
}) as any as S.Schema<DescribeConnectorRequest>;
export interface DescribeConnectorEntityRequest {
  connectorEntityName: string;
  connectorType?: ConnectorType;
  connectorProfileName?: string;
  apiVersion?: string;
}
export const DescribeConnectorEntityRequest = S.suspend(() =>
  S.Struct({
    connectorEntityName: S.String,
    connectorType: S.optional(ConnectorType),
    connectorProfileName: S.optional(S.String),
    apiVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-connector-entity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorEntityRequest",
}) as any as S.Schema<DescribeConnectorEntityRequest>;
export interface DescribeConnectorProfilesRequest {
  connectorProfileNames?: string[];
  connectorType?: ConnectorType;
  connectorLabel?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeConnectorProfilesRequest = S.suspend(() =>
  S.Struct({
    connectorProfileNames: S.optional(ConnectorProfileNameList),
    connectorType: S.optional(ConnectorType),
    connectorLabel: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-connector-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorProfilesRequest",
}) as any as S.Schema<DescribeConnectorProfilesRequest>;
export interface DescribeConnectorsRequest {
  connectorTypes?: ConnectorType[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeConnectorsRequest = S.suspend(() =>
  S.Struct({
    connectorTypes: S.optional(ConnectorTypeList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectorsRequest",
}) as any as S.Schema<DescribeConnectorsRequest>;
export interface DescribeFlowRequest {
  flowName: string;
}
export const DescribeFlowRequest = S.suspend(() =>
  S.Struct({ flowName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFlowRequest",
}) as any as S.Schema<DescribeFlowRequest>;
export interface DescribeFlowExecutionRecordsRequest {
  flowName: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeFlowExecutionRecordsRequest = S.suspend(() =>
  S.Struct({
    flowName: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-flow-execution-records" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFlowExecutionRecordsRequest",
}) as any as S.Schema<DescribeFlowExecutionRecordsRequest>;
export interface ListConnectorEntitiesRequest {
  connectorProfileName?: string;
  connectorType?: ConnectorType;
  entitiesPath?: string;
  apiVersion?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListConnectorEntitiesRequest = S.suspend(() =>
  S.Struct({
    connectorProfileName: S.optional(S.String),
    connectorType: S.optional(ConnectorType),
    entitiesPath: S.optional(S.String),
    apiVersion: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-connector-entities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorEntitiesRequest",
}) as any as S.Schema<ListConnectorEntitiesRequest>;
export interface ListConnectorsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListConnectorsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorsRequest",
}) as any as S.Schema<ListConnectorsRequest>;
export interface ListFlowsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListFlowsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-flows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFlowsRequest",
}) as any as S.Schema<ListFlowsRequest>;
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
export interface ResetConnectorMetadataCacheRequest {
  connectorProfileName?: string;
  connectorType?: ConnectorType;
  connectorEntityName?: string;
  entitiesPath?: string;
  apiVersion?: string;
}
export const ResetConnectorMetadataCacheRequest = S.suspend(() =>
  S.Struct({
    connectorProfileName: S.optional(S.String),
    connectorType: S.optional(ConnectorType),
    connectorEntityName: S.optional(S.String),
    entitiesPath: S.optional(S.String),
    apiVersion: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reset-connector-metadata-cache" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetConnectorMetadataCacheRequest",
}) as any as S.Schema<ResetConnectorMetadataCacheRequest>;
export interface ResetConnectorMetadataCacheResponse {}
export const ResetConnectorMetadataCacheResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResetConnectorMetadataCacheResponse",
}) as any as S.Schema<ResetConnectorMetadataCacheResponse>;
export interface StartFlowRequest {
  flowName: string;
  clientToken?: string;
}
export const StartFlowRequest = S.suspend(() =>
  S.Struct({
    flowName: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartFlowRequest",
}) as any as S.Schema<StartFlowRequest>;
export interface StopFlowRequest {
  flowName: string;
}
export const StopFlowRequest = S.suspend(() =>
  S.Struct({ flowName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/stop-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopFlowRequest",
}) as any as S.Schema<StopFlowRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
export interface UnregisterConnectorRequest {
  connectorLabel: string;
  forceDelete?: boolean;
}
export const UnregisterConnectorRequest = S.suspend(() =>
  S.Struct({
    connectorLabel: S.String,
    forceDelete: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/unregister-connector" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UnregisterConnectorRequest",
}) as any as S.Schema<UnregisterConnectorRequest>;
export interface UnregisterConnectorResponse {}
export const UnregisterConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UnregisterConnectorResponse",
}) as any as S.Schema<UnregisterConnectorResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export interface AmplitudeConnectorProfileProperties {}
export const AmplitudeConnectorProfileProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AmplitudeConnectorProfileProperties",
}) as any as S.Schema<AmplitudeConnectorProfileProperties>;
export interface DatadogConnectorProfileProperties {
  instanceUrl: string;
}
export const DatadogConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "DatadogConnectorProfileProperties",
}) as any as S.Schema<DatadogConnectorProfileProperties>;
export interface DynatraceConnectorProfileProperties {
  instanceUrl: string;
}
export const DynatraceConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "DynatraceConnectorProfileProperties",
}) as any as S.Schema<DynatraceConnectorProfileProperties>;
export interface GoogleAnalyticsConnectorProfileProperties {}
export const GoogleAnalyticsConnectorProfileProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "GoogleAnalyticsConnectorProfileProperties",
}) as any as S.Schema<GoogleAnalyticsConnectorProfileProperties>;
export interface HoneycodeConnectorProfileProperties {}
export const HoneycodeConnectorProfileProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "HoneycodeConnectorProfileProperties",
}) as any as S.Schema<HoneycodeConnectorProfileProperties>;
export interface InforNexusConnectorProfileProperties {
  instanceUrl: string;
}
export const InforNexusConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "InforNexusConnectorProfileProperties",
}) as any as S.Schema<InforNexusConnectorProfileProperties>;
export interface MarketoConnectorProfileProperties {
  instanceUrl: string;
}
export const MarketoConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "MarketoConnectorProfileProperties",
}) as any as S.Schema<MarketoConnectorProfileProperties>;
export interface RedshiftConnectorProfileProperties {
  databaseUrl?: string;
  bucketName: string;
  bucketPrefix?: string;
  roleArn: string;
  dataApiRoleArn?: string;
  isRedshiftServerless?: boolean;
  clusterIdentifier?: string;
  workgroupName?: string;
  databaseName?: string;
}
export const RedshiftConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    databaseUrl: S.optional(S.String),
    bucketName: S.String,
    bucketPrefix: S.optional(S.String),
    roleArn: S.String,
    dataApiRoleArn: S.optional(S.String),
    isRedshiftServerless: S.optional(S.Boolean),
    clusterIdentifier: S.optional(S.String),
    workgroupName: S.optional(S.String),
    databaseName: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftConnectorProfileProperties",
}) as any as S.Schema<RedshiftConnectorProfileProperties>;
export interface SalesforceConnectorProfileProperties {
  instanceUrl?: string;
  isSandboxEnvironment?: boolean;
  usePrivateLinkForMetadataAndAuthorization?: boolean;
}
export const SalesforceConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    instanceUrl: S.optional(S.String),
    isSandboxEnvironment: S.optional(S.Boolean),
    usePrivateLinkForMetadataAndAuthorization: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SalesforceConnectorProfileProperties",
}) as any as S.Schema<SalesforceConnectorProfileProperties>;
export interface ServiceNowConnectorProfileProperties {
  instanceUrl: string;
}
export const ServiceNowConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "ServiceNowConnectorProfileProperties",
}) as any as S.Schema<ServiceNowConnectorProfileProperties>;
export interface SingularConnectorProfileProperties {}
export const SingularConnectorProfileProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SingularConnectorProfileProperties",
}) as any as S.Schema<SingularConnectorProfileProperties>;
export interface SlackConnectorProfileProperties {
  instanceUrl: string;
}
export const SlackConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "SlackConnectorProfileProperties",
}) as any as S.Schema<SlackConnectorProfileProperties>;
export interface SnowflakeConnectorProfileProperties {
  warehouse: string;
  stage: string;
  bucketName: string;
  bucketPrefix?: string;
  privateLinkServiceName?: string;
  accountName?: string;
  region?: string;
}
export const SnowflakeConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    warehouse: S.String,
    stage: S.String,
    bucketName: S.String,
    bucketPrefix: S.optional(S.String),
    privateLinkServiceName: S.optional(S.String),
    accountName: S.optional(S.String),
    region: S.optional(S.String),
  }),
).annotations({
  identifier: "SnowflakeConnectorProfileProperties",
}) as any as S.Schema<SnowflakeConnectorProfileProperties>;
export interface TrendmicroConnectorProfileProperties {}
export const TrendmicroConnectorProfileProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TrendmicroConnectorProfileProperties",
}) as any as S.Schema<TrendmicroConnectorProfileProperties>;
export interface VeevaConnectorProfileProperties {
  instanceUrl: string;
}
export const VeevaConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "VeevaConnectorProfileProperties",
}) as any as S.Schema<VeevaConnectorProfileProperties>;
export interface ZendeskConnectorProfileProperties {
  instanceUrl: string;
}
export const ZendeskConnectorProfileProperties = S.suspend(() =>
  S.Struct({ instanceUrl: S.String }),
).annotations({
  identifier: "ZendeskConnectorProfileProperties",
}) as any as S.Schema<ZendeskConnectorProfileProperties>;
export type OAuthScopeList = string[];
export const OAuthScopeList = S.Array(S.String);
export interface OAuthProperties {
  tokenUrl: string;
  authCodeUrl: string;
  oAuthScopes: string[];
}
export const OAuthProperties = S.suspend(() =>
  S.Struct({
    tokenUrl: S.String,
    authCodeUrl: S.String,
    oAuthScopes: OAuthScopeList,
  }),
).annotations({
  identifier: "OAuthProperties",
}) as any as S.Schema<OAuthProperties>;
export interface SAPODataConnectorProfileProperties {
  applicationHostUrl: string;
  applicationServicePath: string;
  portNumber: number;
  clientNumber: string;
  logonLanguage?: string;
  privateLinkServiceName?: string;
  oAuthProperties?: OAuthProperties;
  disableSSO?: boolean;
}
export const SAPODataConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    applicationHostUrl: S.String,
    applicationServicePath: S.String,
    portNumber: S.Number,
    clientNumber: S.String,
    logonLanguage: S.optional(S.String),
    privateLinkServiceName: S.optional(S.String),
    oAuthProperties: S.optional(OAuthProperties),
    disableSSO: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SAPODataConnectorProfileProperties",
}) as any as S.Schema<SAPODataConnectorProfileProperties>;
export type ProfilePropertiesMap = { [key: string]: string | undefined };
export const ProfilePropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type OAuth2GrantType =
  | "CLIENT_CREDENTIALS"
  | "AUTHORIZATION_CODE"
  | "JWT_BEARER"
  | (string & {});
export const OAuth2GrantType = S.String;
export type TokenUrlCustomProperties = { [key: string]: string | undefined };
export const TokenUrlCustomProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface OAuth2Properties {
  tokenUrl: string;
  oAuth2GrantType: OAuth2GrantType;
  tokenUrlCustomProperties?: { [key: string]: string | undefined };
}
export const OAuth2Properties = S.suspend(() =>
  S.Struct({
    tokenUrl: S.String,
    oAuth2GrantType: OAuth2GrantType,
    tokenUrlCustomProperties: S.optional(TokenUrlCustomProperties),
  }),
).annotations({
  identifier: "OAuth2Properties",
}) as any as S.Schema<OAuth2Properties>;
export interface CustomConnectorProfileProperties {
  profileProperties?: { [key: string]: string | undefined };
  oAuth2Properties?: OAuth2Properties;
}
export const CustomConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    profileProperties: S.optional(ProfilePropertiesMap),
    oAuth2Properties: S.optional(OAuth2Properties),
  }),
).annotations({
  identifier: "CustomConnectorProfileProperties",
}) as any as S.Schema<CustomConnectorProfileProperties>;
export interface PardotConnectorProfileProperties {
  instanceUrl?: string;
  isSandboxEnvironment?: boolean;
  businessUnitId?: string;
}
export const PardotConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    instanceUrl: S.optional(S.String),
    isSandboxEnvironment: S.optional(S.Boolean),
    businessUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "PardotConnectorProfileProperties",
}) as any as S.Schema<PardotConnectorProfileProperties>;
export interface ConnectorProfileProperties {
  Amplitude?: AmplitudeConnectorProfileProperties;
  Datadog?: DatadogConnectorProfileProperties;
  Dynatrace?: DynatraceConnectorProfileProperties;
  GoogleAnalytics?: GoogleAnalyticsConnectorProfileProperties;
  Honeycode?: HoneycodeConnectorProfileProperties;
  InforNexus?: InforNexusConnectorProfileProperties;
  Marketo?: MarketoConnectorProfileProperties;
  Redshift?: RedshiftConnectorProfileProperties;
  Salesforce?: SalesforceConnectorProfileProperties;
  ServiceNow?: ServiceNowConnectorProfileProperties;
  Singular?: SingularConnectorProfileProperties;
  Slack?: SlackConnectorProfileProperties;
  Snowflake?: SnowflakeConnectorProfileProperties;
  Trendmicro?: TrendmicroConnectorProfileProperties;
  Veeva?: VeevaConnectorProfileProperties;
  Zendesk?: ZendeskConnectorProfileProperties;
  SAPOData?: SAPODataConnectorProfileProperties;
  CustomConnector?: CustomConnectorProfileProperties;
  Pardot?: PardotConnectorProfileProperties;
}
export const ConnectorProfileProperties = S.suspend(() =>
  S.Struct({
    Amplitude: S.optional(AmplitudeConnectorProfileProperties),
    Datadog: S.optional(DatadogConnectorProfileProperties),
    Dynatrace: S.optional(DynatraceConnectorProfileProperties),
    GoogleAnalytics: S.optional(GoogleAnalyticsConnectorProfileProperties),
    Honeycode: S.optional(HoneycodeConnectorProfileProperties),
    InforNexus: S.optional(InforNexusConnectorProfileProperties),
    Marketo: S.optional(MarketoConnectorProfileProperties),
    Redshift: S.optional(RedshiftConnectorProfileProperties),
    Salesforce: S.optional(SalesforceConnectorProfileProperties),
    ServiceNow: S.optional(ServiceNowConnectorProfileProperties),
    Singular: S.optional(SingularConnectorProfileProperties),
    Slack: S.optional(SlackConnectorProfileProperties),
    Snowflake: S.optional(SnowflakeConnectorProfileProperties),
    Trendmicro: S.optional(TrendmicroConnectorProfileProperties),
    Veeva: S.optional(VeevaConnectorProfileProperties),
    Zendesk: S.optional(ZendeskConnectorProfileProperties),
    SAPOData: S.optional(SAPODataConnectorProfileProperties),
    CustomConnector: S.optional(CustomConnectorProfileProperties),
    Pardot: S.optional(PardotConnectorProfileProperties),
  }),
).annotations({
  identifier: "ConnectorProfileProperties",
}) as any as S.Schema<ConnectorProfileProperties>;
export interface AmplitudeConnectorProfileCredentials {
  apiKey: string | redacted.Redacted<string>;
  secretKey: string | redacted.Redacted<string>;
}
export const AmplitudeConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ apiKey: SensitiveString, secretKey: SensitiveString }),
).annotations({
  identifier: "AmplitudeConnectorProfileCredentials",
}) as any as S.Schema<AmplitudeConnectorProfileCredentials>;
export interface DatadogConnectorProfileCredentials {
  apiKey: string | redacted.Redacted<string>;
  applicationKey: string;
}
export const DatadogConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ apiKey: SensitiveString, applicationKey: S.String }),
).annotations({
  identifier: "DatadogConnectorProfileCredentials",
}) as any as S.Schema<DatadogConnectorProfileCredentials>;
export interface DynatraceConnectorProfileCredentials {
  apiToken: string;
}
export const DynatraceConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ apiToken: S.String }),
).annotations({
  identifier: "DynatraceConnectorProfileCredentials",
}) as any as S.Schema<DynatraceConnectorProfileCredentials>;
export interface ConnectorOAuthRequest {
  authCode?: string;
  redirectUri?: string;
}
export const ConnectorOAuthRequest = S.suspend(() =>
  S.Struct({
    authCode: S.optional(S.String),
    redirectUri: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorOAuthRequest",
}) as any as S.Schema<ConnectorOAuthRequest>;
export interface GoogleAnalyticsConnectorProfileCredentials {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const GoogleAnalyticsConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "GoogleAnalyticsConnectorProfileCredentials",
}) as any as S.Schema<GoogleAnalyticsConnectorProfileCredentials>;
export interface HoneycodeConnectorProfileCredentials {
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const HoneycodeConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "HoneycodeConnectorProfileCredentials",
}) as any as S.Schema<HoneycodeConnectorProfileCredentials>;
export interface InforNexusConnectorProfileCredentials {
  accessKeyId: string | redacted.Redacted<string>;
  userId: string;
  secretAccessKey: string;
  datakey: string;
}
export const InforNexusConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: SensitiveString,
    userId: S.String,
    secretAccessKey: S.String,
    datakey: S.String,
  }),
).annotations({
  identifier: "InforNexusConnectorProfileCredentials",
}) as any as S.Schema<InforNexusConnectorProfileCredentials>;
export interface MarketoConnectorProfileCredentials {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const MarketoConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    accessToken: S.optional(SensitiveString),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "MarketoConnectorProfileCredentials",
}) as any as S.Schema<MarketoConnectorProfileCredentials>;
export interface RedshiftConnectorProfileCredentials {
  username?: string;
  password?: string | redacted.Redacted<string>;
}
export const RedshiftConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    username: S.optional(S.String),
    password: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RedshiftConnectorProfileCredentials",
}) as any as S.Schema<RedshiftConnectorProfileCredentials>;
export interface SalesforceConnectorProfileCredentials {
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
  clientCredentialsArn?: string | redacted.Redacted<string>;
  oAuth2GrantType?: OAuth2GrantType;
  jwtToken?: string | redacted.Redacted<string>;
}
export const SalesforceConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
    clientCredentialsArn: S.optional(SensitiveString),
    oAuth2GrantType: S.optional(OAuth2GrantType),
    jwtToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SalesforceConnectorProfileCredentials",
}) as any as S.Schema<SalesforceConnectorProfileCredentials>;
export interface OAuth2Credentials {
  clientId?: string;
  clientSecret?: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const OAuth2Credentials = S.suspend(() =>
  S.Struct({
    clientId: S.optional(S.String),
    clientSecret: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "OAuth2Credentials",
}) as any as S.Schema<OAuth2Credentials>;
export interface ServiceNowConnectorProfileCredentials {
  username?: string;
  password?: string | redacted.Redacted<string>;
  oAuth2Credentials?: OAuth2Credentials;
}
export const ServiceNowConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    username: S.optional(S.String),
    password: S.optional(SensitiveString),
    oAuth2Credentials: S.optional(OAuth2Credentials),
  }),
).annotations({
  identifier: "ServiceNowConnectorProfileCredentials",
}) as any as S.Schema<ServiceNowConnectorProfileCredentials>;
export interface SingularConnectorProfileCredentials {
  apiKey: string | redacted.Redacted<string>;
}
export const SingularConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ apiKey: SensitiveString }),
).annotations({
  identifier: "SingularConnectorProfileCredentials",
}) as any as S.Schema<SingularConnectorProfileCredentials>;
export interface SlackConnectorProfileCredentials {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const SlackConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    accessToken: S.optional(SensitiveString),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "SlackConnectorProfileCredentials",
}) as any as S.Schema<SlackConnectorProfileCredentials>;
export interface SnowflakeConnectorProfileCredentials {
  username: string;
  password: string | redacted.Redacted<string>;
}
export const SnowflakeConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ username: S.String, password: SensitiveString }),
).annotations({
  identifier: "SnowflakeConnectorProfileCredentials",
}) as any as S.Schema<SnowflakeConnectorProfileCredentials>;
export interface TrendmicroConnectorProfileCredentials {
  apiSecretKey: string | redacted.Redacted<string>;
}
export const TrendmicroConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ apiSecretKey: SensitiveString }),
).annotations({
  identifier: "TrendmicroConnectorProfileCredentials",
}) as any as S.Schema<TrendmicroConnectorProfileCredentials>;
export interface VeevaConnectorProfileCredentials {
  username: string;
  password: string | redacted.Redacted<string>;
}
export const VeevaConnectorProfileCredentials = S.suspend(() =>
  S.Struct({ username: S.String, password: SensitiveString }),
).annotations({
  identifier: "VeevaConnectorProfileCredentials",
}) as any as S.Schema<VeevaConnectorProfileCredentials>;
export interface ZendeskConnectorProfileCredentials {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const ZendeskConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    accessToken: S.optional(SensitiveString),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "ZendeskConnectorProfileCredentials",
}) as any as S.Schema<ZendeskConnectorProfileCredentials>;
export interface BasicAuthCredentials {
  username: string;
  password: string | redacted.Redacted<string>;
}
export const BasicAuthCredentials = S.suspend(() =>
  S.Struct({ username: S.String, password: SensitiveString }),
).annotations({
  identifier: "BasicAuthCredentials",
}) as any as S.Schema<BasicAuthCredentials>;
export interface OAuthCredentials {
  clientId: string;
  clientSecret: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
}
export const OAuthCredentials = S.suspend(() =>
  S.Struct({
    clientId: S.String,
    clientSecret: SensitiveString,
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
  }),
).annotations({
  identifier: "OAuthCredentials",
}) as any as S.Schema<OAuthCredentials>;
export interface SAPODataConnectorProfileCredentials {
  basicAuthCredentials?: BasicAuthCredentials;
  oAuthCredentials?: OAuthCredentials;
}
export const SAPODataConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    basicAuthCredentials: S.optional(BasicAuthCredentials),
    oAuthCredentials: S.optional(OAuthCredentials),
  }),
).annotations({
  identifier: "SAPODataConnectorProfileCredentials",
}) as any as S.Schema<SAPODataConnectorProfileCredentials>;
export type AuthenticationType =
  | "OAUTH2"
  | "APIKEY"
  | "BASIC"
  | "CUSTOM"
  | (string & {});
export const AuthenticationType = S.String;
export interface ApiKeyCredentials {
  apiKey: string | redacted.Redacted<string>;
  apiSecretKey?: string | redacted.Redacted<string>;
}
export const ApiKeyCredentials = S.suspend(() =>
  S.Struct({
    apiKey: SensitiveString,
    apiSecretKey: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ApiKeyCredentials",
}) as any as S.Schema<ApiKeyCredentials>;
export type CredentialsMap = {
  [key: string]: string | redacted.Redacted<string> | undefined;
};
export const CredentialsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(SensitiveString),
});
export interface CustomAuthCredentials {
  customAuthenticationType: string;
  credentialsMap?: {
    [key: string]: string | redacted.Redacted<string> | undefined;
  };
}
export const CustomAuthCredentials = S.suspend(() =>
  S.Struct({
    customAuthenticationType: S.String,
    credentialsMap: S.optional(CredentialsMap),
  }),
).annotations({
  identifier: "CustomAuthCredentials",
}) as any as S.Schema<CustomAuthCredentials>;
export interface CustomConnectorProfileCredentials {
  authenticationType: AuthenticationType;
  basic?: BasicAuthCredentials;
  oauth2?: OAuth2Credentials;
  apiKey?: ApiKeyCredentials;
  custom?: CustomAuthCredentials;
}
export const CustomConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    authenticationType: AuthenticationType,
    basic: S.optional(BasicAuthCredentials),
    oauth2: S.optional(OAuth2Credentials),
    apiKey: S.optional(ApiKeyCredentials),
    custom: S.optional(CustomAuthCredentials),
  }),
).annotations({
  identifier: "CustomConnectorProfileCredentials",
}) as any as S.Schema<CustomConnectorProfileCredentials>;
export interface PardotConnectorProfileCredentials {
  accessToken?: string | redacted.Redacted<string>;
  refreshToken?: string;
  oAuthRequest?: ConnectorOAuthRequest;
  clientCredentialsArn?: string | redacted.Redacted<string>;
}
export const PardotConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    accessToken: S.optional(SensitiveString),
    refreshToken: S.optional(S.String),
    oAuthRequest: S.optional(ConnectorOAuthRequest),
    clientCredentialsArn: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "PardotConnectorProfileCredentials",
}) as any as S.Schema<PardotConnectorProfileCredentials>;
export interface ConnectorProfileCredentials {
  Amplitude?: AmplitudeConnectorProfileCredentials;
  Datadog?: DatadogConnectorProfileCredentials;
  Dynatrace?: DynatraceConnectorProfileCredentials;
  GoogleAnalytics?: GoogleAnalyticsConnectorProfileCredentials;
  Honeycode?: HoneycodeConnectorProfileCredentials;
  InforNexus?: InforNexusConnectorProfileCredentials;
  Marketo?: MarketoConnectorProfileCredentials;
  Redshift?: RedshiftConnectorProfileCredentials;
  Salesforce?: SalesforceConnectorProfileCredentials;
  ServiceNow?: ServiceNowConnectorProfileCredentials;
  Singular?: SingularConnectorProfileCredentials;
  Slack?: SlackConnectorProfileCredentials;
  Snowflake?: SnowflakeConnectorProfileCredentials;
  Trendmicro?: TrendmicroConnectorProfileCredentials;
  Veeva?: VeevaConnectorProfileCredentials;
  Zendesk?: ZendeskConnectorProfileCredentials;
  SAPOData?: SAPODataConnectorProfileCredentials;
  CustomConnector?: CustomConnectorProfileCredentials;
  Pardot?: PardotConnectorProfileCredentials;
}
export const ConnectorProfileCredentials = S.suspend(() =>
  S.Struct({
    Amplitude: S.optional(AmplitudeConnectorProfileCredentials),
    Datadog: S.optional(DatadogConnectorProfileCredentials),
    Dynatrace: S.optional(DynatraceConnectorProfileCredentials),
    GoogleAnalytics: S.optional(GoogleAnalyticsConnectorProfileCredentials),
    Honeycode: S.optional(HoneycodeConnectorProfileCredentials),
    InforNexus: S.optional(InforNexusConnectorProfileCredentials),
    Marketo: S.optional(MarketoConnectorProfileCredentials),
    Redshift: S.optional(RedshiftConnectorProfileCredentials),
    Salesforce: S.optional(SalesforceConnectorProfileCredentials),
    ServiceNow: S.optional(ServiceNowConnectorProfileCredentials),
    Singular: S.optional(SingularConnectorProfileCredentials),
    Slack: S.optional(SlackConnectorProfileCredentials),
    Snowflake: S.optional(SnowflakeConnectorProfileCredentials),
    Trendmicro: S.optional(TrendmicroConnectorProfileCredentials),
    Veeva: S.optional(VeevaConnectorProfileCredentials),
    Zendesk: S.optional(ZendeskConnectorProfileCredentials),
    SAPOData: S.optional(SAPODataConnectorProfileCredentials),
    CustomConnector: S.optional(CustomConnectorProfileCredentials),
    Pardot: S.optional(PardotConnectorProfileCredentials),
  }),
).annotations({
  identifier: "ConnectorProfileCredentials",
}) as any as S.Schema<ConnectorProfileCredentials>;
export interface ConnectorProfileConfig {
  connectorProfileProperties: ConnectorProfileProperties;
  connectorProfileCredentials?: ConnectorProfileCredentials;
}
export const ConnectorProfileConfig = S.suspend(() =>
  S.Struct({
    connectorProfileProperties: ConnectorProfileProperties,
    connectorProfileCredentials: S.optional(ConnectorProfileCredentials),
  }),
).annotations({
  identifier: "ConnectorProfileConfig",
}) as any as S.Schema<ConnectorProfileConfig>;
export interface UpdateConnectorProfileRequest {
  connectorProfileName: string;
  connectionMode: ConnectionMode;
  connectorProfileConfig: ConnectorProfileConfig;
  clientToken?: string;
}
export const UpdateConnectorProfileRequest = S.suspend(() =>
  S.Struct({
    connectorProfileName: S.String,
    connectionMode: ConnectionMode,
    connectorProfileConfig: ConnectorProfileConfig,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-connector-profile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectorProfileRequest",
}) as any as S.Schema<UpdateConnectorProfileRequest>;
export interface LambdaConnectorProvisioningConfig {
  lambdaArn: string;
}
export const LambdaConnectorProvisioningConfig = S.suspend(() =>
  S.Struct({ lambdaArn: S.String }),
).annotations({
  identifier: "LambdaConnectorProvisioningConfig",
}) as any as S.Schema<LambdaConnectorProvisioningConfig>;
export interface ConnectorProvisioningConfig {
  lambda?: LambdaConnectorProvisioningConfig;
}
export const ConnectorProvisioningConfig = S.suspend(() =>
  S.Struct({ lambda: S.optional(LambdaConnectorProvisioningConfig) }),
).annotations({
  identifier: "ConnectorProvisioningConfig",
}) as any as S.Schema<ConnectorProvisioningConfig>;
export interface UpdateConnectorRegistrationRequest {
  connectorLabel: string;
  description?: string;
  connectorProvisioningConfig?: ConnectorProvisioningConfig;
  clientToken?: string;
}
export const UpdateConnectorRegistrationRequest = S.suspend(() =>
  S.Struct({
    connectorLabel: S.String,
    description: S.optional(S.String),
    connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-connector-registration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectorRegistrationRequest",
}) as any as S.Schema<UpdateConnectorRegistrationRequest>;
export type TriggerType = "Scheduled" | "Event" | "OnDemand" | (string & {});
export const TriggerType = S.String;
export type DataPullMode = "Incremental" | "Complete" | (string & {});
export const DataPullMode = S.String;
export interface ScheduledTriggerProperties {
  scheduleExpression: string;
  dataPullMode?: DataPullMode;
  scheduleStartTime?: Date;
  scheduleEndTime?: Date;
  timezone?: string;
  scheduleOffset?: number;
  firstExecutionFrom?: Date;
  flowErrorDeactivationThreshold?: number;
}
export const ScheduledTriggerProperties = S.suspend(() =>
  S.Struct({
    scheduleExpression: S.String,
    dataPullMode: S.optional(DataPullMode),
    scheduleStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    scheduleEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    timezone: S.optional(S.String),
    scheduleOffset: S.optional(S.Number),
    firstExecutionFrom: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    flowErrorDeactivationThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScheduledTriggerProperties",
}) as any as S.Schema<ScheduledTriggerProperties>;
export interface TriggerProperties {
  Scheduled?: ScheduledTriggerProperties;
}
export const TriggerProperties = S.suspend(() =>
  S.Struct({ Scheduled: S.optional(ScheduledTriggerProperties) }),
).annotations({
  identifier: "TriggerProperties",
}) as any as S.Schema<TriggerProperties>;
export interface TriggerConfig {
  triggerType: TriggerType;
  triggerProperties?: TriggerProperties;
}
export const TriggerConfig = S.suspend(() =>
  S.Struct({
    triggerType: TriggerType,
    triggerProperties: S.optional(TriggerProperties),
  }),
).annotations({
  identifier: "TriggerConfig",
}) as any as S.Schema<TriggerConfig>;
export interface AmplitudeSourceProperties {
  object: string;
}
export const AmplitudeSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "AmplitudeSourceProperties",
}) as any as S.Schema<AmplitudeSourceProperties>;
export interface DatadogSourceProperties {
  object: string;
}
export const DatadogSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "DatadogSourceProperties",
}) as any as S.Schema<DatadogSourceProperties>;
export interface DynatraceSourceProperties {
  object: string;
}
export const DynatraceSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "DynatraceSourceProperties",
}) as any as S.Schema<DynatraceSourceProperties>;
export interface GoogleAnalyticsSourceProperties {
  object: string;
}
export const GoogleAnalyticsSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "GoogleAnalyticsSourceProperties",
}) as any as S.Schema<GoogleAnalyticsSourceProperties>;
export interface InforNexusSourceProperties {
  object: string;
}
export const InforNexusSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "InforNexusSourceProperties",
}) as any as S.Schema<InforNexusSourceProperties>;
export interface MarketoSourceProperties {
  object: string;
}
export const MarketoSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "MarketoSourceProperties",
}) as any as S.Schema<MarketoSourceProperties>;
export type S3InputFileType = "CSV" | "JSON" | (string & {});
export const S3InputFileType = S.String;
export interface S3InputFormatConfig {
  s3InputFileType?: S3InputFileType;
}
export const S3InputFormatConfig = S.suspend(() =>
  S.Struct({ s3InputFileType: S.optional(S3InputFileType) }),
).annotations({
  identifier: "S3InputFormatConfig",
}) as any as S.Schema<S3InputFormatConfig>;
export interface S3SourceProperties {
  bucketName: string;
  bucketPrefix?: string;
  s3InputFormatConfig?: S3InputFormatConfig;
}
export const S3SourceProperties = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    bucketPrefix: S.optional(S.String),
    s3InputFormatConfig: S.optional(S3InputFormatConfig),
  }),
).annotations({
  identifier: "S3SourceProperties",
}) as any as S.Schema<S3SourceProperties>;
export type SalesforceDataTransferApi =
  | "AUTOMATIC"
  | "BULKV2"
  | "REST_SYNC"
  | (string & {});
export const SalesforceDataTransferApi = S.String;
export interface SalesforceSourceProperties {
  object: string;
  enableDynamicFieldUpdate?: boolean;
  includeDeletedRecords?: boolean;
  dataTransferApi?: SalesforceDataTransferApi;
}
export const SalesforceSourceProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    enableDynamicFieldUpdate: S.optional(S.Boolean),
    includeDeletedRecords: S.optional(S.Boolean),
    dataTransferApi: S.optional(SalesforceDataTransferApi),
  }),
).annotations({
  identifier: "SalesforceSourceProperties",
}) as any as S.Schema<SalesforceSourceProperties>;
export interface ServiceNowSourceProperties {
  object: string;
}
export const ServiceNowSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "ServiceNowSourceProperties",
}) as any as S.Schema<ServiceNowSourceProperties>;
export interface SingularSourceProperties {
  object: string;
}
export const SingularSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "SingularSourceProperties",
}) as any as S.Schema<SingularSourceProperties>;
export interface SlackSourceProperties {
  object: string;
}
export const SlackSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "SlackSourceProperties",
}) as any as S.Schema<SlackSourceProperties>;
export interface TrendmicroSourceProperties {
  object: string;
}
export const TrendmicroSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "TrendmicroSourceProperties",
}) as any as S.Schema<TrendmicroSourceProperties>;
export interface VeevaSourceProperties {
  object: string;
  documentType?: string;
  includeSourceFiles?: boolean;
  includeRenditions?: boolean;
  includeAllVersions?: boolean;
}
export const VeevaSourceProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    documentType: S.optional(S.String),
    includeSourceFiles: S.optional(S.Boolean),
    includeRenditions: S.optional(S.Boolean),
    includeAllVersions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VeevaSourceProperties",
}) as any as S.Schema<VeevaSourceProperties>;
export interface ZendeskSourceProperties {
  object: string;
}
export const ZendeskSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "ZendeskSourceProperties",
}) as any as S.Schema<ZendeskSourceProperties>;
export interface SAPODataParallelismConfig {
  maxParallelism: number;
}
export const SAPODataParallelismConfig = S.suspend(() =>
  S.Struct({ maxParallelism: S.Number }),
).annotations({
  identifier: "SAPODataParallelismConfig",
}) as any as S.Schema<SAPODataParallelismConfig>;
export interface SAPODataPaginationConfig {
  maxPageSize: number;
}
export const SAPODataPaginationConfig = S.suspend(() =>
  S.Struct({ maxPageSize: S.Number }),
).annotations({
  identifier: "SAPODataPaginationConfig",
}) as any as S.Schema<SAPODataPaginationConfig>;
export interface SAPODataSourceProperties {
  objectPath?: string;
  parallelismConfig?: SAPODataParallelismConfig;
  paginationConfig?: SAPODataPaginationConfig;
}
export const SAPODataSourceProperties = S.suspend(() =>
  S.Struct({
    objectPath: S.optional(S.String),
    parallelismConfig: S.optional(SAPODataParallelismConfig),
    paginationConfig: S.optional(SAPODataPaginationConfig),
  }),
).annotations({
  identifier: "SAPODataSourceProperties",
}) as any as S.Schema<SAPODataSourceProperties>;
export type CustomProperties = { [key: string]: string | undefined };
export const CustomProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type DataTransferApiType =
  | "SYNC"
  | "ASYNC"
  | "AUTOMATIC"
  | (string & {});
export const DataTransferApiType = S.String;
export interface DataTransferApi {
  Name?: string;
  Type?: DataTransferApiType;
}
export const DataTransferApi = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(DataTransferApiType),
  }),
).annotations({
  identifier: "DataTransferApi",
}) as any as S.Schema<DataTransferApi>;
export interface CustomConnectorSourceProperties {
  entityName: string;
  customProperties?: { [key: string]: string | undefined };
  dataTransferApi?: DataTransferApi;
}
export const CustomConnectorSourceProperties = S.suspend(() =>
  S.Struct({
    entityName: S.String,
    customProperties: S.optional(CustomProperties),
    dataTransferApi: S.optional(DataTransferApi),
  }),
).annotations({
  identifier: "CustomConnectorSourceProperties",
}) as any as S.Schema<CustomConnectorSourceProperties>;
export interface PardotSourceProperties {
  object: string;
}
export const PardotSourceProperties = S.suspend(() =>
  S.Struct({ object: S.String }),
).annotations({
  identifier: "PardotSourceProperties",
}) as any as S.Schema<PardotSourceProperties>;
export interface SourceConnectorProperties {
  Amplitude?: AmplitudeSourceProperties;
  Datadog?: DatadogSourceProperties;
  Dynatrace?: DynatraceSourceProperties;
  GoogleAnalytics?: GoogleAnalyticsSourceProperties;
  InforNexus?: InforNexusSourceProperties;
  Marketo?: MarketoSourceProperties;
  S3?: S3SourceProperties;
  Salesforce?: SalesforceSourceProperties;
  ServiceNow?: ServiceNowSourceProperties;
  Singular?: SingularSourceProperties;
  Slack?: SlackSourceProperties;
  Trendmicro?: TrendmicroSourceProperties;
  Veeva?: VeevaSourceProperties;
  Zendesk?: ZendeskSourceProperties;
  SAPOData?: SAPODataSourceProperties;
  CustomConnector?: CustomConnectorSourceProperties;
  Pardot?: PardotSourceProperties;
}
export const SourceConnectorProperties = S.suspend(() =>
  S.Struct({
    Amplitude: S.optional(AmplitudeSourceProperties),
    Datadog: S.optional(DatadogSourceProperties),
    Dynatrace: S.optional(DynatraceSourceProperties),
    GoogleAnalytics: S.optional(GoogleAnalyticsSourceProperties),
    InforNexus: S.optional(InforNexusSourceProperties),
    Marketo: S.optional(MarketoSourceProperties),
    S3: S.optional(S3SourceProperties),
    Salesforce: S.optional(SalesforceSourceProperties),
    ServiceNow: S.optional(ServiceNowSourceProperties),
    Singular: S.optional(SingularSourceProperties),
    Slack: S.optional(SlackSourceProperties),
    Trendmicro: S.optional(TrendmicroSourceProperties),
    Veeva: S.optional(VeevaSourceProperties),
    Zendesk: S.optional(ZendeskSourceProperties),
    SAPOData: S.optional(SAPODataSourceProperties),
    CustomConnector: S.optional(CustomConnectorSourceProperties),
    Pardot: S.optional(PardotSourceProperties),
  }),
).annotations({
  identifier: "SourceConnectorProperties",
}) as any as S.Schema<SourceConnectorProperties>;
export interface IncrementalPullConfig {
  datetimeTypeFieldName?: string;
}
export const IncrementalPullConfig = S.suspend(() =>
  S.Struct({ datetimeTypeFieldName: S.optional(S.String) }),
).annotations({
  identifier: "IncrementalPullConfig",
}) as any as S.Schema<IncrementalPullConfig>;
export interface SourceFlowConfig {
  connectorType: ConnectorType;
  apiVersion?: string;
  connectorProfileName?: string;
  sourceConnectorProperties: SourceConnectorProperties;
  incrementalPullConfig?: IncrementalPullConfig;
}
export const SourceFlowConfig = S.suspend(() =>
  S.Struct({
    connectorType: ConnectorType,
    apiVersion: S.optional(S.String),
    connectorProfileName: S.optional(S.String),
    sourceConnectorProperties: SourceConnectorProperties,
    incrementalPullConfig: S.optional(IncrementalPullConfig),
  }),
).annotations({
  identifier: "SourceFlowConfig",
}) as any as S.Schema<SourceFlowConfig>;
export interface ErrorHandlingConfig {
  failOnFirstDestinationError?: boolean;
  bucketPrefix?: string;
  bucketName?: string;
}
export const ErrorHandlingConfig = S.suspend(() =>
  S.Struct({
    failOnFirstDestinationError: S.optional(S.Boolean),
    bucketPrefix: S.optional(S.String),
    bucketName: S.optional(S.String),
  }),
).annotations({
  identifier: "ErrorHandlingConfig",
}) as any as S.Schema<ErrorHandlingConfig>;
export interface RedshiftDestinationProperties {
  object: string;
  intermediateBucketName: string;
  bucketPrefix?: string;
  errorHandlingConfig?: ErrorHandlingConfig;
}
export const RedshiftDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    intermediateBucketName: S.String,
    bucketPrefix: S.optional(S.String),
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
  }),
).annotations({
  identifier: "RedshiftDestinationProperties",
}) as any as S.Schema<RedshiftDestinationProperties>;
export type FileType = "CSV" | "JSON" | "PARQUET" | (string & {});
export const FileType = S.String;
export type PrefixType =
  | "FILENAME"
  | "PATH"
  | "PATH_AND_FILENAME"
  | (string & {});
export const PrefixType = S.String;
export type PrefixFormat =
  | "YEAR"
  | "MONTH"
  | "DAY"
  | "HOUR"
  | "MINUTE"
  | (string & {});
export const PrefixFormat = S.String;
export type PathPrefix = "EXECUTION_ID" | "SCHEMA_VERSION" | (string & {});
export const PathPrefix = S.String;
export type PathPrefixHierarchy = PathPrefix[];
export const PathPrefixHierarchy = S.Array(PathPrefix);
export interface PrefixConfig {
  prefixType?: PrefixType;
  prefixFormat?: PrefixFormat;
  pathPrefixHierarchy?: PathPrefix[];
}
export const PrefixConfig = S.suspend(() =>
  S.Struct({
    prefixType: S.optional(PrefixType),
    prefixFormat: S.optional(PrefixFormat),
    pathPrefixHierarchy: S.optional(PathPrefixHierarchy),
  }),
).annotations({ identifier: "PrefixConfig" }) as any as S.Schema<PrefixConfig>;
export type AggregationType = "None" | "SingleFile" | (string & {});
export const AggregationType = S.String;
export interface AggregationConfig {
  aggregationType?: AggregationType;
  targetFileSize?: number;
}
export const AggregationConfig = S.suspend(() =>
  S.Struct({
    aggregationType: S.optional(AggregationType),
    targetFileSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "AggregationConfig",
}) as any as S.Schema<AggregationConfig>;
export interface S3OutputFormatConfig {
  fileType?: FileType;
  prefixConfig?: PrefixConfig;
  aggregationConfig?: AggregationConfig;
  preserveSourceDataTyping?: boolean;
}
export const S3OutputFormatConfig = S.suspend(() =>
  S.Struct({
    fileType: S.optional(FileType),
    prefixConfig: S.optional(PrefixConfig),
    aggregationConfig: S.optional(AggregationConfig),
    preserveSourceDataTyping: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "S3OutputFormatConfig",
}) as any as S.Schema<S3OutputFormatConfig>;
export interface S3DestinationProperties {
  bucketName: string;
  bucketPrefix?: string;
  s3OutputFormatConfig?: S3OutputFormatConfig;
}
export const S3DestinationProperties = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    bucketPrefix: S.optional(S.String),
    s3OutputFormatConfig: S.optional(S3OutputFormatConfig),
  }),
).annotations({
  identifier: "S3DestinationProperties",
}) as any as S.Schema<S3DestinationProperties>;
export type IdFieldNameList = string[];
export const IdFieldNameList = S.Array(S.String);
export type WriteOperationType =
  | "INSERT"
  | "UPSERT"
  | "UPDATE"
  | "DELETE"
  | (string & {});
export const WriteOperationType = S.String;
export interface SalesforceDestinationProperties {
  object: string;
  idFieldNames?: string[];
  errorHandlingConfig?: ErrorHandlingConfig;
  writeOperationType?: WriteOperationType;
  dataTransferApi?: SalesforceDataTransferApi;
}
export const SalesforceDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    idFieldNames: S.optional(IdFieldNameList),
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
    writeOperationType: S.optional(WriteOperationType),
    dataTransferApi: S.optional(SalesforceDataTransferApi),
  }),
).annotations({
  identifier: "SalesforceDestinationProperties",
}) as any as S.Schema<SalesforceDestinationProperties>;
export interface SnowflakeDestinationProperties {
  object: string;
  intermediateBucketName: string;
  bucketPrefix?: string;
  errorHandlingConfig?: ErrorHandlingConfig;
}
export const SnowflakeDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    intermediateBucketName: S.String,
    bucketPrefix: S.optional(S.String),
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
  }),
).annotations({
  identifier: "SnowflakeDestinationProperties",
}) as any as S.Schema<SnowflakeDestinationProperties>;
export interface EventBridgeDestinationProperties {
  object: string;
  errorHandlingConfig?: ErrorHandlingConfig;
}
export const EventBridgeDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
  }),
).annotations({
  identifier: "EventBridgeDestinationProperties",
}) as any as S.Schema<EventBridgeDestinationProperties>;
export interface LookoutMetricsDestinationProperties {}
export const LookoutMetricsDestinationProperties = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "LookoutMetricsDestinationProperties",
}) as any as S.Schema<LookoutMetricsDestinationProperties>;
export interface UpsolverS3OutputFormatConfig {
  fileType?: FileType;
  prefixConfig: PrefixConfig;
  aggregationConfig?: AggregationConfig;
}
export const UpsolverS3OutputFormatConfig = S.suspend(() =>
  S.Struct({
    fileType: S.optional(FileType),
    prefixConfig: PrefixConfig,
    aggregationConfig: S.optional(AggregationConfig),
  }),
).annotations({
  identifier: "UpsolverS3OutputFormatConfig",
}) as any as S.Schema<UpsolverS3OutputFormatConfig>;
export interface UpsolverDestinationProperties {
  bucketName: string;
  bucketPrefix?: string;
  s3OutputFormatConfig: UpsolverS3OutputFormatConfig;
}
export const UpsolverDestinationProperties = S.suspend(() =>
  S.Struct({
    bucketName: S.String,
    bucketPrefix: S.optional(S.String),
    s3OutputFormatConfig: UpsolverS3OutputFormatConfig,
  }),
).annotations({
  identifier: "UpsolverDestinationProperties",
}) as any as S.Schema<UpsolverDestinationProperties>;
export interface HoneycodeDestinationProperties {
  object: string;
  errorHandlingConfig?: ErrorHandlingConfig;
}
export const HoneycodeDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
  }),
).annotations({
  identifier: "HoneycodeDestinationProperties",
}) as any as S.Schema<HoneycodeDestinationProperties>;
export interface CustomerProfilesDestinationProperties {
  domainName: string;
  objectTypeName?: string;
}
export const CustomerProfilesDestinationProperties = S.suspend(() =>
  S.Struct({ domainName: S.String, objectTypeName: S.optional(S.String) }),
).annotations({
  identifier: "CustomerProfilesDestinationProperties",
}) as any as S.Schema<CustomerProfilesDestinationProperties>;
export interface ZendeskDestinationProperties {
  object: string;
  idFieldNames?: string[];
  errorHandlingConfig?: ErrorHandlingConfig;
  writeOperationType?: WriteOperationType;
}
export const ZendeskDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    idFieldNames: S.optional(IdFieldNameList),
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
    writeOperationType: S.optional(WriteOperationType),
  }),
).annotations({
  identifier: "ZendeskDestinationProperties",
}) as any as S.Schema<ZendeskDestinationProperties>;
export interface MarketoDestinationProperties {
  object: string;
  errorHandlingConfig?: ErrorHandlingConfig;
}
export const MarketoDestinationProperties = S.suspend(() =>
  S.Struct({
    object: S.String,
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
  }),
).annotations({
  identifier: "MarketoDestinationProperties",
}) as any as S.Schema<MarketoDestinationProperties>;
export interface CustomConnectorDestinationProperties {
  entityName: string;
  errorHandlingConfig?: ErrorHandlingConfig;
  writeOperationType?: WriteOperationType;
  idFieldNames?: string[];
  customProperties?: { [key: string]: string | undefined };
}
export const CustomConnectorDestinationProperties = S.suspend(() =>
  S.Struct({
    entityName: S.String,
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
    writeOperationType: S.optional(WriteOperationType),
    idFieldNames: S.optional(IdFieldNameList),
    customProperties: S.optional(CustomProperties),
  }),
).annotations({
  identifier: "CustomConnectorDestinationProperties",
}) as any as S.Schema<CustomConnectorDestinationProperties>;
export interface SuccessResponseHandlingConfig {
  bucketPrefix?: string;
  bucketName?: string;
}
export const SuccessResponseHandlingConfig = S.suspend(() =>
  S.Struct({
    bucketPrefix: S.optional(S.String),
    bucketName: S.optional(S.String),
  }),
).annotations({
  identifier: "SuccessResponseHandlingConfig",
}) as any as S.Schema<SuccessResponseHandlingConfig>;
export interface SAPODataDestinationProperties {
  objectPath: string;
  successResponseHandlingConfig?: SuccessResponseHandlingConfig;
  idFieldNames?: string[];
  errorHandlingConfig?: ErrorHandlingConfig;
  writeOperationType?: WriteOperationType;
}
export const SAPODataDestinationProperties = S.suspend(() =>
  S.Struct({
    objectPath: S.String,
    successResponseHandlingConfig: S.optional(SuccessResponseHandlingConfig),
    idFieldNames: S.optional(IdFieldNameList),
    errorHandlingConfig: S.optional(ErrorHandlingConfig),
    writeOperationType: S.optional(WriteOperationType),
  }),
).annotations({
  identifier: "SAPODataDestinationProperties",
}) as any as S.Schema<SAPODataDestinationProperties>;
export interface DestinationConnectorProperties {
  Redshift?: RedshiftDestinationProperties;
  S3?: S3DestinationProperties;
  Salesforce?: SalesforceDestinationProperties;
  Snowflake?: SnowflakeDestinationProperties;
  EventBridge?: EventBridgeDestinationProperties;
  LookoutMetrics?: LookoutMetricsDestinationProperties;
  Upsolver?: UpsolverDestinationProperties;
  Honeycode?: HoneycodeDestinationProperties;
  CustomerProfiles?: CustomerProfilesDestinationProperties;
  Zendesk?: ZendeskDestinationProperties;
  Marketo?: MarketoDestinationProperties;
  CustomConnector?: CustomConnectorDestinationProperties;
  SAPOData?: SAPODataDestinationProperties;
}
export const DestinationConnectorProperties = S.suspend(() =>
  S.Struct({
    Redshift: S.optional(RedshiftDestinationProperties),
    S3: S.optional(S3DestinationProperties),
    Salesforce: S.optional(SalesforceDestinationProperties),
    Snowflake: S.optional(SnowflakeDestinationProperties),
    EventBridge: S.optional(EventBridgeDestinationProperties),
    LookoutMetrics: S.optional(LookoutMetricsDestinationProperties),
    Upsolver: S.optional(UpsolverDestinationProperties),
    Honeycode: S.optional(HoneycodeDestinationProperties),
    CustomerProfiles: S.optional(CustomerProfilesDestinationProperties),
    Zendesk: S.optional(ZendeskDestinationProperties),
    Marketo: S.optional(MarketoDestinationProperties),
    CustomConnector: S.optional(CustomConnectorDestinationProperties),
    SAPOData: S.optional(SAPODataDestinationProperties),
  }),
).annotations({
  identifier: "DestinationConnectorProperties",
}) as any as S.Schema<DestinationConnectorProperties>;
export interface DestinationFlowConfig {
  connectorType: ConnectorType;
  apiVersion?: string;
  connectorProfileName?: string;
  destinationConnectorProperties: DestinationConnectorProperties;
}
export const DestinationFlowConfig = S.suspend(() =>
  S.Struct({
    connectorType: ConnectorType,
    apiVersion: S.optional(S.String),
    connectorProfileName: S.optional(S.String),
    destinationConnectorProperties: DestinationConnectorProperties,
  }),
).annotations({
  identifier: "DestinationFlowConfig",
}) as any as S.Schema<DestinationFlowConfig>;
export type DestinationFlowConfigList = DestinationFlowConfig[];
export const DestinationFlowConfigList = S.Array(DestinationFlowConfig);
export type SourceFields = string[];
export const SourceFields = S.Array(S.String);
export type AmplitudeConnectorOperator = "BETWEEN" | (string & {});
export const AmplitudeConnectorOperator = S.String;
export type DatadogConnectorOperator =
  | "PROJECTION"
  | "BETWEEN"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const DatadogConnectorOperator = S.String;
export type DynatraceConnectorOperator =
  | "PROJECTION"
  | "BETWEEN"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const DynatraceConnectorOperator = S.String;
export type GoogleAnalyticsConnectorOperator =
  | "PROJECTION"
  | "BETWEEN"
  | (string & {});
export const GoogleAnalyticsConnectorOperator = S.String;
export type InforNexusConnectorOperator =
  | "PROJECTION"
  | "BETWEEN"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const InforNexusConnectorOperator = S.String;
export type MarketoConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "BETWEEN"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const MarketoConnectorOperator = S.String;
export type S3ConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const S3ConnectorOperator = S.String;
export type SalesforceConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "CONTAINS"
  | "GREATER_THAN"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const SalesforceConnectorOperator = S.String;
export type ServiceNowConnectorOperator =
  | "PROJECTION"
  | "CONTAINS"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const ServiceNowConnectorOperator = S.String;
export type SingularConnectorOperator =
  | "PROJECTION"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const SingularConnectorOperator = S.String;
export type SlackConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const SlackConnectorOperator = S.String;
export type TrendmicroConnectorOperator =
  | "PROJECTION"
  | "EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const TrendmicroConnectorOperator = S.String;
export type VeevaConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "CONTAINS"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const VeevaConnectorOperator = S.String;
export type ZendeskConnectorOperator =
  | "PROJECTION"
  | "GREATER_THAN"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const ZendeskConnectorOperator = S.String;
export type SAPODataConnectorOperator =
  | "PROJECTION"
  | "LESS_THAN"
  | "CONTAINS"
  | "GREATER_THAN"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const SAPODataConnectorOperator = S.String;
export type Operator =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "CONTAINS"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const Operator = S.String;
export type PardotConnectorOperator =
  | "PROJECTION"
  | "EQUAL_TO"
  | "NO_OP"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | (string & {});
export const PardotConnectorOperator = S.String;
export interface ConnectorOperator {
  Amplitude?: AmplitudeConnectorOperator;
  Datadog?: DatadogConnectorOperator;
  Dynatrace?: DynatraceConnectorOperator;
  GoogleAnalytics?: GoogleAnalyticsConnectorOperator;
  InforNexus?: InforNexusConnectorOperator;
  Marketo?: MarketoConnectorOperator;
  S3?: S3ConnectorOperator;
  Salesforce?: SalesforceConnectorOperator;
  ServiceNow?: ServiceNowConnectorOperator;
  Singular?: SingularConnectorOperator;
  Slack?: SlackConnectorOperator;
  Trendmicro?: TrendmicroConnectorOperator;
  Veeva?: VeevaConnectorOperator;
  Zendesk?: ZendeskConnectorOperator;
  SAPOData?: SAPODataConnectorOperator;
  CustomConnector?: Operator;
  Pardot?: PardotConnectorOperator;
}
export const ConnectorOperator = S.suspend(() =>
  S.Struct({
    Amplitude: S.optional(AmplitudeConnectorOperator),
    Datadog: S.optional(DatadogConnectorOperator),
    Dynatrace: S.optional(DynatraceConnectorOperator),
    GoogleAnalytics: S.optional(GoogleAnalyticsConnectorOperator),
    InforNexus: S.optional(InforNexusConnectorOperator),
    Marketo: S.optional(MarketoConnectorOperator),
    S3: S.optional(S3ConnectorOperator),
    Salesforce: S.optional(SalesforceConnectorOperator),
    ServiceNow: S.optional(ServiceNowConnectorOperator),
    Singular: S.optional(SingularConnectorOperator),
    Slack: S.optional(SlackConnectorOperator),
    Trendmicro: S.optional(TrendmicroConnectorOperator),
    Veeva: S.optional(VeevaConnectorOperator),
    Zendesk: S.optional(ZendeskConnectorOperator),
    SAPOData: S.optional(SAPODataConnectorOperator),
    CustomConnector: S.optional(Operator),
    Pardot: S.optional(PardotConnectorOperator),
  }),
).annotations({
  identifier: "ConnectorOperator",
}) as any as S.Schema<ConnectorOperator>;
export type TaskType =
  | "Arithmetic"
  | "Filter"
  | "Map"
  | "Map_all"
  | "Mask"
  | "Merge"
  | "Passthrough"
  | "Truncate"
  | "Validate"
  | "Partition"
  | (string & {});
export const TaskType = S.String;
export type OperatorPropertiesKeys =
  | "VALUE"
  | "VALUES"
  | "DATA_TYPE"
  | "UPPER_BOUND"
  | "LOWER_BOUND"
  | "SOURCE_DATA_TYPE"
  | "DESTINATION_DATA_TYPE"
  | "VALIDATION_ACTION"
  | "MASK_VALUE"
  | "MASK_LENGTH"
  | "TRUNCATE_LENGTH"
  | "MATH_OPERATION_FIELDS_ORDER"
  | "CONCAT_FORMAT"
  | "SUBFIELD_CATEGORY_MAP"
  | "EXCLUDE_SOURCE_FIELDS_LIST"
  | "INCLUDE_NEW_FIELDS"
  | "ORDERED_PARTITION_KEYS_LIST"
  | (string & {});
export const OperatorPropertiesKeys = S.String;
export type TaskPropertiesMap = { [key in OperatorPropertiesKeys]?: string };
export const TaskPropertiesMap = S.partial(
  S.Record({ key: OperatorPropertiesKeys, value: S.UndefinedOr(S.String) }),
);
export interface Task {
  sourceFields: string[];
  connectorOperator?: ConnectorOperator;
  destinationField?: string;
  taskType: TaskType;
  taskProperties?: { [key: string]: string | undefined };
}
export const Task = S.suspend(() =>
  S.Struct({
    sourceFields: SourceFields,
    connectorOperator: S.optional(ConnectorOperator),
    destinationField: S.optional(S.String),
    taskType: TaskType,
    taskProperties: S.optional(TaskPropertiesMap),
  }),
).annotations({ identifier: "Task" }) as any as S.Schema<Task>;
export type Tasks = Task[];
export const Tasks = S.Array(Task);
export interface GlueDataCatalogConfig {
  roleArn: string;
  databaseName: string;
  tablePrefix: string;
}
export const GlueDataCatalogConfig = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    databaseName: S.String,
    tablePrefix: S.String,
  }),
).annotations({
  identifier: "GlueDataCatalogConfig",
}) as any as S.Schema<GlueDataCatalogConfig>;
export interface MetadataCatalogConfig {
  glueDataCatalog?: GlueDataCatalogConfig;
}
export const MetadataCatalogConfig = S.suspend(() =>
  S.Struct({ glueDataCatalog: S.optional(GlueDataCatalogConfig) }),
).annotations({
  identifier: "MetadataCatalogConfig",
}) as any as S.Schema<MetadataCatalogConfig>;
export interface UpdateFlowRequest {
  flowName: string;
  description?: string;
  triggerConfig: TriggerConfig;
  sourceFlowConfig: SourceFlowConfig;
  destinationFlowConfigList: DestinationFlowConfig[];
  tasks: Task[];
  metadataCatalogConfig?: MetadataCatalogConfig;
  clientToken?: string;
}
export const UpdateFlowRequest = S.suspend(() =>
  S.Struct({
    flowName: S.String,
    description: S.optional(S.String),
    triggerConfig: TriggerConfig,
    sourceFlowConfig: SourceFlowConfig,
    destinationFlowConfigList: DestinationFlowConfigList,
    tasks: Tasks,
    metadataCatalogConfig: S.optional(MetadataCatalogConfig),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFlowRequest",
}) as any as S.Schema<UpdateFlowRequest>;
export type FlowStatus =
  | "Active"
  | "Deprecated"
  | "Deleted"
  | "Draft"
  | "Errored"
  | "Suspended"
  | (string & {});
export const FlowStatus = S.String;
export interface CancelFlowExecutionsResponse {
  invalidExecutions?: string[];
}
export const CancelFlowExecutionsResponse = S.suspend(() =>
  S.Struct({ invalidExecutions: S.optional(ExecutionIds) }),
).annotations({
  identifier: "CancelFlowExecutionsResponse",
}) as any as S.Schema<CancelFlowExecutionsResponse>;
export type ConnectorModeList = string[];
export const ConnectorModeList = S.Array(S.String);
export type SupportedDataTransferType = "RECORD" | "FILE" | (string & {});
export const SupportedDataTransferType = S.String;
export type SupportedDataTransferTypeList = SupportedDataTransferType[];
export const SupportedDataTransferTypeList = S.Array(SupportedDataTransferType);
export interface ConnectorDetail {
  connectorDescription?: string;
  connectorName?: string;
  connectorOwner?: string;
  connectorVersion?: string;
  applicationType?: string;
  connectorType?: ConnectorType;
  connectorLabel?: string;
  registeredAt?: Date;
  registeredBy?: string;
  connectorProvisioningType?: ConnectorProvisioningType;
  connectorModes?: string[];
  supportedDataTransferTypes?: SupportedDataTransferType[];
}
export const ConnectorDetail = S.suspend(() =>
  S.Struct({
    connectorDescription: S.optional(S.String),
    connectorName: S.optional(S.String),
    connectorOwner: S.optional(S.String),
    connectorVersion: S.optional(S.String),
    applicationType: S.optional(S.String),
    connectorType: S.optional(ConnectorType),
    connectorLabel: S.optional(S.String),
    registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registeredBy: S.optional(S.String),
    connectorProvisioningType: S.optional(ConnectorProvisioningType),
    connectorModes: S.optional(ConnectorModeList),
    supportedDataTransferTypes: S.optional(SupportedDataTransferTypeList),
  }),
).annotations({
  identifier: "ConnectorDetail",
}) as any as S.Schema<ConnectorDetail>;
export type ConnectorList = ConnectorDetail[];
export const ConnectorList = S.Array(ConnectorDetail);
export interface ListConnectorsResponse {
  connectors?: ConnectorDetail[];
  nextToken?: string;
}
export const ListConnectorsResponse = S.suspend(() =>
  S.Struct({
    connectors: S.optional(ConnectorList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorsResponse",
}) as any as S.Schema<ListConnectorsResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartFlowResponse {
  flowArn?: string;
  flowStatus?: FlowStatus;
  executionId?: string;
}
export const StartFlowResponse = S.suspend(() =>
  S.Struct({
    flowArn: S.optional(S.String),
    flowStatus: S.optional(FlowStatus),
    executionId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartFlowResponse",
}) as any as S.Schema<StartFlowResponse>;
export interface StopFlowResponse {
  flowArn?: string;
  flowStatus?: FlowStatus;
}
export const StopFlowResponse = S.suspend(() =>
  S.Struct({
    flowArn: S.optional(S.String),
    flowStatus: S.optional(FlowStatus),
  }),
).annotations({
  identifier: "StopFlowResponse",
}) as any as S.Schema<StopFlowResponse>;
export interface UpdateConnectorProfileResponse {
  connectorProfileArn?: string;
}
export const UpdateConnectorProfileResponse = S.suspend(() =>
  S.Struct({ connectorProfileArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateConnectorProfileResponse",
}) as any as S.Schema<UpdateConnectorProfileResponse>;
export interface UpdateConnectorRegistrationResponse {
  connectorArn?: string;
}
export const UpdateConnectorRegistrationResponse = S.suspend(() =>
  S.Struct({ connectorArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateConnectorRegistrationResponse",
}) as any as S.Schema<UpdateConnectorRegistrationResponse>;
export interface UpdateFlowResponse {
  flowStatus?: FlowStatus;
}
export const UpdateFlowResponse = S.suspend(() =>
  S.Struct({ flowStatus: S.optional(FlowStatus) }),
).annotations({
  identifier: "UpdateFlowResponse",
}) as any as S.Schema<UpdateFlowResponse>;
export type ScheduleFrequencyType =
  | "BYMINUTE"
  | "HOURLY"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "ONCE"
  | (string & {});
export const ScheduleFrequencyType = S.String;
export type SchedulingFrequencyTypeList = ScheduleFrequencyType[];
export const SchedulingFrequencyTypeList = S.Array(ScheduleFrequencyType);
export type TriggerTypeList = TriggerType[];
export const TriggerTypeList = S.Array(TriggerType);
export type SupportedApiVersionList = string[];
export const SupportedApiVersionList = S.Array(S.String);
export type Operators =
  | "PROJECTION"
  | "LESS_THAN"
  | "GREATER_THAN"
  | "CONTAINS"
  | "BETWEEN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "ADDITION"
  | "MULTIPLICATION"
  | "DIVISION"
  | "SUBTRACTION"
  | "MASK_ALL"
  | "MASK_FIRST_N"
  | "MASK_LAST_N"
  | "VALIDATE_NON_NULL"
  | "VALIDATE_NON_ZERO"
  | "VALIDATE_NON_NEGATIVE"
  | "VALIDATE_NUMERIC"
  | "NO_OP"
  | (string & {});
export const Operators = S.String;
export type SupportedOperatorList = Operators[];
export const SupportedOperatorList = S.Array(Operators);
export type SupportedWriteOperationList = WriteOperationType[];
export const SupportedWriteOperationList = S.Array(WriteOperationType);
export type ExecutionStatus =
  | "InProgress"
  | "Successful"
  | "Error"
  | "CancelStarted"
  | "Canceled"
  | (string & {});
export const ExecutionStatus = S.String;
export type CatalogType = "GLUE" | (string & {});
export const CatalogType = S.String;
export interface AmplitudeMetadata {}
export const AmplitudeMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "AmplitudeMetadata",
}) as any as S.Schema<AmplitudeMetadata>;
export interface DatadogMetadata {}
export const DatadogMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "DatadogMetadata",
}) as any as S.Schema<DatadogMetadata>;
export interface DynatraceMetadata {}
export const DynatraceMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "DynatraceMetadata",
}) as any as S.Schema<DynatraceMetadata>;
export interface GoogleAnalyticsMetadata {
  oAuthScopes?: string[];
}
export const GoogleAnalyticsMetadata = S.suspend(() =>
  S.Struct({ oAuthScopes: S.optional(OAuthScopeList) }),
).annotations({
  identifier: "GoogleAnalyticsMetadata",
}) as any as S.Schema<GoogleAnalyticsMetadata>;
export interface InforNexusMetadata {}
export const InforNexusMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "InforNexusMetadata",
}) as any as S.Schema<InforNexusMetadata>;
export interface MarketoMetadata {}
export const MarketoMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "MarketoMetadata",
}) as any as S.Schema<MarketoMetadata>;
export interface RedshiftMetadata {}
export const RedshiftMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "RedshiftMetadata",
}) as any as S.Schema<RedshiftMetadata>;
export interface S3Metadata {}
export const S3Metadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "S3Metadata",
}) as any as S.Schema<S3Metadata>;
export type SalesforceDataTransferApiList = SalesforceDataTransferApi[];
export const SalesforceDataTransferApiList = S.Array(SalesforceDataTransferApi);
export type OAuth2GrantTypeSupportedList = OAuth2GrantType[];
export const OAuth2GrantTypeSupportedList = S.Array(OAuth2GrantType);
export interface SalesforceMetadata {
  oAuthScopes?: string[];
  dataTransferApis?: SalesforceDataTransferApi[];
  oauth2GrantTypesSupported?: OAuth2GrantType[];
}
export const SalesforceMetadata = S.suspend(() =>
  S.Struct({
    oAuthScopes: S.optional(OAuthScopeList),
    dataTransferApis: S.optional(SalesforceDataTransferApiList),
    oauth2GrantTypesSupported: S.optional(OAuth2GrantTypeSupportedList),
  }),
).annotations({
  identifier: "SalesforceMetadata",
}) as any as S.Schema<SalesforceMetadata>;
export interface ServiceNowMetadata {}
export const ServiceNowMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "ServiceNowMetadata",
}) as any as S.Schema<ServiceNowMetadata>;
export interface SingularMetadata {}
export const SingularMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "SingularMetadata",
}) as any as S.Schema<SingularMetadata>;
export interface SlackMetadata {
  oAuthScopes?: string[];
}
export const SlackMetadata = S.suspend(() =>
  S.Struct({ oAuthScopes: S.optional(OAuthScopeList) }),
).annotations({
  identifier: "SlackMetadata",
}) as any as S.Schema<SlackMetadata>;
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export interface SnowflakeMetadata {
  supportedRegions?: string[];
}
export const SnowflakeMetadata = S.suspend(() =>
  S.Struct({ supportedRegions: S.optional(RegionList) }),
).annotations({
  identifier: "SnowflakeMetadata",
}) as any as S.Schema<SnowflakeMetadata>;
export interface TrendmicroMetadata {}
export const TrendmicroMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "TrendmicroMetadata",
}) as any as S.Schema<TrendmicroMetadata>;
export interface VeevaMetadata {}
export const VeevaMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "VeevaMetadata",
}) as any as S.Schema<VeevaMetadata>;
export interface ZendeskMetadata {
  oAuthScopes?: string[];
}
export const ZendeskMetadata = S.suspend(() =>
  S.Struct({ oAuthScopes: S.optional(OAuthScopeList) }),
).annotations({
  identifier: "ZendeskMetadata",
}) as any as S.Schema<ZendeskMetadata>;
export interface EventBridgeMetadata {}
export const EventBridgeMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "EventBridgeMetadata",
}) as any as S.Schema<EventBridgeMetadata>;
export interface UpsolverMetadata {}
export const UpsolverMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpsolverMetadata",
}) as any as S.Schema<UpsolverMetadata>;
export interface CustomerProfilesMetadata {}
export const CustomerProfilesMetadata = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CustomerProfilesMetadata",
}) as any as S.Schema<CustomerProfilesMetadata>;
export interface HoneycodeMetadata {
  oAuthScopes?: string[];
}
export const HoneycodeMetadata = S.suspend(() =>
  S.Struct({ oAuthScopes: S.optional(OAuthScopeList) }),
).annotations({
  identifier: "HoneycodeMetadata",
}) as any as S.Schema<HoneycodeMetadata>;
export interface SAPODataMetadata {}
export const SAPODataMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "SAPODataMetadata",
}) as any as S.Schema<SAPODataMetadata>;
export interface PardotMetadata {}
export const PardotMetadata = S.suspend(() => S.Struct({})).annotations({
  identifier: "PardotMetadata",
}) as any as S.Schema<PardotMetadata>;
export interface ConnectorMetadata {
  Amplitude?: AmplitudeMetadata;
  Datadog?: DatadogMetadata;
  Dynatrace?: DynatraceMetadata;
  GoogleAnalytics?: GoogleAnalyticsMetadata;
  InforNexus?: InforNexusMetadata;
  Marketo?: MarketoMetadata;
  Redshift?: RedshiftMetadata;
  S3?: S3Metadata;
  Salesforce?: SalesforceMetadata;
  ServiceNow?: ServiceNowMetadata;
  Singular?: SingularMetadata;
  Slack?: SlackMetadata;
  Snowflake?: SnowflakeMetadata;
  Trendmicro?: TrendmicroMetadata;
  Veeva?: VeevaMetadata;
  Zendesk?: ZendeskMetadata;
  EventBridge?: EventBridgeMetadata;
  Upsolver?: UpsolverMetadata;
  CustomerProfiles?: CustomerProfilesMetadata;
  Honeycode?: HoneycodeMetadata;
  SAPOData?: SAPODataMetadata;
  Pardot?: PardotMetadata;
}
export const ConnectorMetadata = S.suspend(() =>
  S.Struct({
    Amplitude: S.optional(AmplitudeMetadata),
    Datadog: S.optional(DatadogMetadata),
    Dynatrace: S.optional(DynatraceMetadata),
    GoogleAnalytics: S.optional(GoogleAnalyticsMetadata),
    InforNexus: S.optional(InforNexusMetadata),
    Marketo: S.optional(MarketoMetadata),
    Redshift: S.optional(RedshiftMetadata),
    S3: S.optional(S3Metadata),
    Salesforce: S.optional(SalesforceMetadata),
    ServiceNow: S.optional(ServiceNowMetadata),
    Singular: S.optional(SingularMetadata),
    Slack: S.optional(SlackMetadata),
    Snowflake: S.optional(SnowflakeMetadata),
    Trendmicro: S.optional(TrendmicroMetadata),
    Veeva: S.optional(VeevaMetadata),
    Zendesk: S.optional(ZendeskMetadata),
    EventBridge: S.optional(EventBridgeMetadata),
    Upsolver: S.optional(UpsolverMetadata),
    CustomerProfiles: S.optional(CustomerProfilesMetadata),
    Honeycode: S.optional(HoneycodeMetadata),
    SAPOData: S.optional(SAPODataMetadata),
    Pardot: S.optional(PardotMetadata),
  }),
).annotations({
  identifier: "ConnectorMetadata",
}) as any as S.Schema<ConnectorMetadata>;
export type TokenUrlList = string[];
export const TokenUrlList = S.Array(S.String);
export type AuthCodeUrlList = string[];
export const AuthCodeUrlList = S.Array(S.String);
export type ConnectorSuppliedValueList = string[];
export const ConnectorSuppliedValueList = S.Array(S.String);
export type OAuth2CustomPropType = "TOKEN_URL" | "AUTH_URL" | (string & {});
export const OAuth2CustomPropType = S.String;
export interface OAuth2CustomParameter {
  key?: string;
  isRequired?: boolean;
  label?: string;
  description?: string;
  isSensitiveField?: boolean;
  connectorSuppliedValues?: string[];
  type?: OAuth2CustomPropType;
}
export const OAuth2CustomParameter = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    isRequired: S.optional(S.Boolean),
    label: S.optional(S.String),
    description: S.optional(S.String),
    isSensitiveField: S.optional(S.Boolean),
    connectorSuppliedValues: S.optional(ConnectorSuppliedValueList),
    type: S.optional(OAuth2CustomPropType),
  }),
).annotations({
  identifier: "OAuth2CustomParameter",
}) as any as S.Schema<OAuth2CustomParameter>;
export type OAuth2CustomPropertiesList = OAuth2CustomParameter[];
export const OAuth2CustomPropertiesList = S.Array(OAuth2CustomParameter);
export interface OAuth2Defaults {
  oauthScopes?: string[];
  tokenUrls?: string[];
  authCodeUrls?: string[];
  oauth2GrantTypesSupported?: OAuth2GrantType[];
  oauth2CustomProperties?: OAuth2CustomParameter[];
}
export const OAuth2Defaults = S.suspend(() =>
  S.Struct({
    oauthScopes: S.optional(OAuthScopeList),
    tokenUrls: S.optional(TokenUrlList),
    authCodeUrls: S.optional(AuthCodeUrlList),
    oauth2GrantTypesSupported: S.optional(OAuth2GrantTypeSupportedList),
    oauth2CustomProperties: S.optional(OAuth2CustomPropertiesList),
  }),
).annotations({
  identifier: "OAuth2Defaults",
}) as any as S.Schema<OAuth2Defaults>;
export interface AuthParameter {
  key?: string;
  isRequired?: boolean;
  label?: string;
  description?: string;
  isSensitiveField?: boolean;
  connectorSuppliedValues?: string[];
}
export const AuthParameter = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    isRequired: S.optional(S.Boolean),
    label: S.optional(S.String),
    description: S.optional(S.String),
    isSensitiveField: S.optional(S.Boolean),
    connectorSuppliedValues: S.optional(ConnectorSuppliedValueList),
  }),
).annotations({
  identifier: "AuthParameter",
}) as any as S.Schema<AuthParameter>;
export type AuthParameterList = AuthParameter[];
export const AuthParameterList = S.Array(AuthParameter);
export interface CustomAuthConfig {
  customAuthenticationType?: string;
  authParameters?: AuthParameter[];
}
export const CustomAuthConfig = S.suspend(() =>
  S.Struct({
    customAuthenticationType: S.optional(S.String),
    authParameters: S.optional(AuthParameterList),
  }),
).annotations({
  identifier: "CustomAuthConfig",
}) as any as S.Schema<CustomAuthConfig>;
export type CustomAuthConfigList = CustomAuthConfig[];
export const CustomAuthConfigList = S.Array(CustomAuthConfig);
export interface AuthenticationConfig {
  isBasicAuthSupported?: boolean;
  isApiKeyAuthSupported?: boolean;
  isOAuth2Supported?: boolean;
  isCustomAuthSupported?: boolean;
  oAuth2Defaults?: OAuth2Defaults;
  customAuthConfigs?: CustomAuthConfig[];
}
export const AuthenticationConfig = S.suspend(() =>
  S.Struct({
    isBasicAuthSupported: S.optional(S.Boolean),
    isApiKeyAuthSupported: S.optional(S.Boolean),
    isOAuth2Supported: S.optional(S.Boolean),
    isCustomAuthSupported: S.optional(S.Boolean),
    oAuth2Defaults: S.optional(OAuth2Defaults),
    customAuthConfigs: S.optional(CustomAuthConfigList),
  }),
).annotations({
  identifier: "AuthenticationConfig",
}) as any as S.Schema<AuthenticationConfig>;
export type ConnectorSuppliedValueOptionList = string[];
export const ConnectorSuppliedValueOptionList = S.Array(S.String);
export interface ConnectorRuntimeSetting {
  key?: string;
  dataType?: string;
  isRequired?: boolean;
  label?: string;
  description?: string;
  scope?: string;
  connectorSuppliedValueOptions?: string[];
}
export const ConnectorRuntimeSetting = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String),
    dataType: S.optional(S.String),
    isRequired: S.optional(S.Boolean),
    label: S.optional(S.String),
    description: S.optional(S.String),
    scope: S.optional(S.String),
    connectorSuppliedValueOptions: S.optional(ConnectorSuppliedValueOptionList),
  }),
).annotations({
  identifier: "ConnectorRuntimeSetting",
}) as any as S.Schema<ConnectorRuntimeSetting>;
export type ConnectorRuntimeSettingList = ConnectorRuntimeSetting[];
export const ConnectorRuntimeSettingList = S.Array(ConnectorRuntimeSetting);
export type SupportedDataTransferApis = DataTransferApi[];
export const SupportedDataTransferApis = S.Array(DataTransferApi);
export interface ConnectorConfiguration {
  canUseAsSource?: boolean;
  canUseAsDestination?: boolean;
  supportedDestinationConnectors?: ConnectorType[];
  supportedSchedulingFrequencies?: ScheduleFrequencyType[];
  isPrivateLinkEnabled?: boolean;
  isPrivateLinkEndpointUrlRequired?: boolean;
  supportedTriggerTypes?: TriggerType[];
  connectorMetadata?: ConnectorMetadata;
  connectorType?: ConnectorType;
  connectorLabel?: string;
  connectorDescription?: string;
  connectorOwner?: string;
  connectorName?: string;
  connectorVersion?: string;
  connectorArn?: string;
  connectorModes?: string[];
  authenticationConfig?: AuthenticationConfig;
  connectorRuntimeSettings?: ConnectorRuntimeSetting[];
  supportedApiVersions?: string[];
  supportedOperators?: Operators[];
  supportedWriteOperations?: WriteOperationType[];
  connectorProvisioningType?: ConnectorProvisioningType;
  connectorProvisioningConfig?: ConnectorProvisioningConfig;
  logoURL?: string;
  registeredAt?: Date;
  registeredBy?: string;
  supportedDataTransferTypes?: SupportedDataTransferType[];
  supportedDataTransferApis?: DataTransferApi[];
}
export const ConnectorConfiguration = S.suspend(() =>
  S.Struct({
    canUseAsSource: S.optional(S.Boolean),
    canUseAsDestination: S.optional(S.Boolean),
    supportedDestinationConnectors: S.optional(ConnectorTypeList),
    supportedSchedulingFrequencies: S.optional(SchedulingFrequencyTypeList),
    isPrivateLinkEnabled: S.optional(S.Boolean),
    isPrivateLinkEndpointUrlRequired: S.optional(S.Boolean),
    supportedTriggerTypes: S.optional(TriggerTypeList),
    connectorMetadata: S.optional(ConnectorMetadata),
    connectorType: S.optional(ConnectorType),
    connectorLabel: S.optional(S.String),
    connectorDescription: S.optional(S.String),
    connectorOwner: S.optional(S.String),
    connectorName: S.optional(S.String),
    connectorVersion: S.optional(S.String),
    connectorArn: S.optional(S.String),
    connectorModes: S.optional(ConnectorModeList),
    authenticationConfig: S.optional(AuthenticationConfig),
    connectorRuntimeSettings: S.optional(ConnectorRuntimeSettingList),
    supportedApiVersions: S.optional(SupportedApiVersionList),
    supportedOperators: S.optional(SupportedOperatorList),
    supportedWriteOperations: S.optional(SupportedWriteOperationList),
    connectorProvisioningType: S.optional(ConnectorProvisioningType),
    connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
    logoURL: S.optional(S.String),
    registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registeredBy: S.optional(S.String),
    supportedDataTransferTypes: S.optional(SupportedDataTransferTypeList),
    supportedDataTransferApis: S.optional(SupportedDataTransferApis),
  }),
).annotations({
  identifier: "ConnectorConfiguration",
}) as any as S.Schema<ConnectorConfiguration>;
export type ConnectorConfigurationsMap = {
  [key in ConnectorType]?: ConnectorConfiguration;
};
export const ConnectorConfigurationsMap = S.partial(
  S.Record({
    key: ConnectorType,
    value: S.UndefinedOr(ConnectorConfiguration),
  }),
);
export interface ExecutionDetails {
  mostRecentExecutionMessage?: string;
  mostRecentExecutionTime?: Date;
  mostRecentExecutionStatus?: ExecutionStatus;
}
export const ExecutionDetails = S.suspend(() =>
  S.Struct({
    mostRecentExecutionMessage: S.optional(S.String),
    mostRecentExecutionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    mostRecentExecutionStatus: S.optional(ExecutionStatus),
  }),
).annotations({
  identifier: "ExecutionDetails",
}) as any as S.Schema<ExecutionDetails>;
export interface FlowDefinition {
  flowArn?: string;
  description?: string;
  flowName?: string;
  flowStatus?: FlowStatus;
  sourceConnectorType?: ConnectorType;
  sourceConnectorLabel?: string;
  destinationConnectorType?: ConnectorType;
  destinationConnectorLabel?: string;
  triggerType?: TriggerType;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
  tags?: { [key: string]: string | undefined };
  lastRunExecutionDetails?: ExecutionDetails;
}
export const FlowDefinition = S.suspend(() =>
  S.Struct({
    flowArn: S.optional(S.String),
    description: S.optional(S.String),
    flowName: S.optional(S.String),
    flowStatus: S.optional(FlowStatus),
    sourceConnectorType: S.optional(ConnectorType),
    sourceConnectorLabel: S.optional(S.String),
    destinationConnectorType: S.optional(ConnectorType),
    destinationConnectorLabel: S.optional(S.String),
    triggerType: S.optional(TriggerType),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
    tags: S.optional(TagMap),
    lastRunExecutionDetails: S.optional(ExecutionDetails),
  }),
).annotations({
  identifier: "FlowDefinition",
}) as any as S.Schema<FlowDefinition>;
export type FlowList = FlowDefinition[];
export const FlowList = S.Array(FlowDefinition);
export type PrivateConnectionProvisioningStatus =
  | "FAILED"
  | "PENDING"
  | "CREATED"
  | (string & {});
export const PrivateConnectionProvisioningStatus = S.String;
export type PrivateConnectionProvisioningFailureCause =
  | "CONNECTOR_AUTHENTICATION"
  | "CONNECTOR_SERVER"
  | "INTERNAL_SERVER"
  | "ACCESS_DENIED"
  | "VALIDATION"
  | (string & {});
export const PrivateConnectionProvisioningFailureCause = S.String;
export interface DescribeConnectorsResponse {
  connectorConfigurations?: {
    [key: string]: ConnectorConfiguration | undefined;
  };
  connectors?: ConnectorDetail[];
  nextToken?: string;
}
export const DescribeConnectorsResponse = S.suspend(() =>
  S.Struct({
    connectorConfigurations: S.optional(ConnectorConfigurationsMap),
    connectors: S.optional(ConnectorList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeConnectorsResponse",
}) as any as S.Schema<DescribeConnectorsResponse>;
export interface ListFlowsResponse {
  flows?: FlowDefinition[];
  nextToken?: string;
}
export const ListFlowsResponse = S.suspend(() =>
  S.Struct({ flows: S.optional(FlowList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFlowsResponse",
}) as any as S.Schema<ListFlowsResponse>;
export interface RegisterConnectorRequest {
  connectorLabel?: string;
  description?: string;
  connectorProvisioningType?: ConnectorProvisioningType;
  connectorProvisioningConfig?: ConnectorProvisioningConfig;
  clientToken?: string;
}
export const RegisterConnectorRequest = S.suspend(() =>
  S.Struct({
    connectorLabel: S.optional(S.String),
    description: S.optional(S.String),
    connectorProvisioningType: S.optional(ConnectorProvisioningType),
    connectorProvisioningConfig: S.optional(ConnectorProvisioningConfig),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/register-connector" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterConnectorRequest",
}) as any as S.Schema<RegisterConnectorRequest>;
export interface SourceFieldProperties {
  isRetrievable?: boolean;
  isQueryable?: boolean;
  isTimestampFieldForIncrementalQueries?: boolean;
}
export const SourceFieldProperties = S.suspend(() =>
  S.Struct({
    isRetrievable: S.optional(S.Boolean),
    isQueryable: S.optional(S.Boolean),
    isTimestampFieldForIncrementalQueries: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SourceFieldProperties",
}) as any as S.Schema<SourceFieldProperties>;
export interface DestinationFieldProperties {
  isCreatable?: boolean;
  isNullable?: boolean;
  isUpsertable?: boolean;
  isUpdatable?: boolean;
  isDefaultedOnCreate?: boolean;
  supportedWriteOperations?: WriteOperationType[];
}
export const DestinationFieldProperties = S.suspend(() =>
  S.Struct({
    isCreatable: S.optional(S.Boolean),
    isNullable: S.optional(S.Boolean),
    isUpsertable: S.optional(S.Boolean),
    isUpdatable: S.optional(S.Boolean),
    isDefaultedOnCreate: S.optional(S.Boolean),
    supportedWriteOperations: S.optional(SupportedWriteOperationList),
  }),
).annotations({
  identifier: "DestinationFieldProperties",
}) as any as S.Schema<DestinationFieldProperties>;
export interface PrivateConnectionProvisioningState {
  status?: PrivateConnectionProvisioningStatus;
  failureMessage?: string;
  failureCause?: PrivateConnectionProvisioningFailureCause;
}
export const PrivateConnectionProvisioningState = S.suspend(() =>
  S.Struct({
    status: S.optional(PrivateConnectionProvisioningStatus),
    failureMessage: S.optional(S.String),
    failureCause: S.optional(PrivateConnectionProvisioningFailureCause),
  }),
).annotations({
  identifier: "PrivateConnectionProvisioningState",
}) as any as S.Schema<PrivateConnectionProvisioningState>;
export interface RegistrationOutput {
  message?: string;
  result?: string;
  status?: ExecutionStatus;
}
export const RegistrationOutput = S.suspend(() =>
  S.Struct({
    message: S.optional(S.String),
    result: S.optional(S.String),
    status: S.optional(ExecutionStatus),
  }),
).annotations({
  identifier: "RegistrationOutput",
}) as any as S.Schema<RegistrationOutput>;
export interface ConnectorEntity {
  name: string;
  label?: string;
  hasNestedEntities?: boolean;
}
export const ConnectorEntity = S.suspend(() =>
  S.Struct({
    name: S.String,
    label: S.optional(S.String),
    hasNestedEntities: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ConnectorEntity",
}) as any as S.Schema<ConnectorEntity>;
export type ConnectorEntityList = ConnectorEntity[];
export const ConnectorEntityList = S.Array(ConnectorEntity);
export type FilterOperatorList = Operator[];
export const FilterOperatorList = S.Array(Operator);
export type SupportedValueList = string[];
export const SupportedValueList = S.Array(S.String);
export interface ConnectorProfile {
  connectorProfileArn?: string;
  connectorProfileName?: string;
  connectorType?: ConnectorType;
  connectorLabel?: string;
  connectionMode?: ConnectionMode;
  credentialsArn?: string;
  connectorProfileProperties?: ConnectorProfileProperties;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  privateConnectionProvisioningState?: PrivateConnectionProvisioningState;
}
export const ConnectorProfile = S.suspend(() =>
  S.Struct({
    connectorProfileArn: S.optional(S.String),
    connectorProfileName: S.optional(S.String),
    connectorType: S.optional(ConnectorType),
    connectorLabel: S.optional(S.String),
    connectionMode: S.optional(ConnectionMode),
    credentialsArn: S.optional(S.String),
    connectorProfileProperties: S.optional(ConnectorProfileProperties),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    privateConnectionProvisioningState: S.optional(
      PrivateConnectionProvisioningState,
    ),
  }),
).annotations({
  identifier: "ConnectorProfile",
}) as any as S.Schema<ConnectorProfile>;
export type ConnectorProfileDetailList = ConnectorProfile[];
export const ConnectorProfileDetailList = S.Array(ConnectorProfile);
export interface MetadataCatalogDetail {
  catalogType?: CatalogType;
  tableName?: string;
  tableRegistrationOutput?: RegistrationOutput;
  partitionRegistrationOutput?: RegistrationOutput;
}
export const MetadataCatalogDetail = S.suspend(() =>
  S.Struct({
    catalogType: S.optional(CatalogType),
    tableName: S.optional(S.String),
    tableRegistrationOutput: S.optional(RegistrationOutput),
    partitionRegistrationOutput: S.optional(RegistrationOutput),
  }),
).annotations({
  identifier: "MetadataCatalogDetail",
}) as any as S.Schema<MetadataCatalogDetail>;
export type MetadataCatalogDetails = MetadataCatalogDetail[];
export const MetadataCatalogDetails = S.Array(MetadataCatalogDetail);
export type ConnectorEntityMap = {
  [key: string]: ConnectorEntity[] | undefined;
};
export const ConnectorEntityMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ConnectorEntityList),
});
export interface ErrorInfo {
  putFailuresCount?: number;
  executionMessage?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({
    putFailuresCount: S.optional(S.Number),
    executionMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface DescribeConnectorProfilesResponse {
  connectorProfileDetails?: ConnectorProfile[];
  nextToken?: string;
}
export const DescribeConnectorProfilesResponse = S.suspend(() =>
  S.Struct({
    connectorProfileDetails: S.optional(ConnectorProfileDetailList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeConnectorProfilesResponse",
}) as any as S.Schema<DescribeConnectorProfilesResponse>;
export interface DescribeFlowResponse {
  flowArn?: string;
  description?: string;
  flowName?: string;
  kmsArn?: string;
  flowStatus?: FlowStatus;
  flowStatusMessage?: string;
  sourceFlowConfig?: SourceFlowConfig;
  destinationFlowConfigList?: DestinationFlowConfig[];
  lastRunExecutionDetails?: ExecutionDetails;
  triggerConfig?: TriggerConfig;
  tasks?: Task[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string;
  lastUpdatedBy?: string;
  tags?: { [key: string]: string | undefined };
  metadataCatalogConfig?: MetadataCatalogConfig;
  lastRunMetadataCatalogDetails?: MetadataCatalogDetail[];
  schemaVersion?: number;
}
export const DescribeFlowResponse = S.suspend(() =>
  S.Struct({
    flowArn: S.optional(S.String),
    description: S.optional(S.String),
    flowName: S.optional(S.String),
    kmsArn: S.optional(S.String),
    flowStatus: S.optional(FlowStatus),
    flowStatusMessage: S.optional(S.String),
    sourceFlowConfig: S.optional(SourceFlowConfig),
    destinationFlowConfigList: S.optional(DestinationFlowConfigList),
    lastRunExecutionDetails: S.optional(ExecutionDetails),
    triggerConfig: S.optional(TriggerConfig),
    tasks: S.optional(Tasks),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
    tags: S.optional(TagMap),
    metadataCatalogConfig: S.optional(MetadataCatalogConfig),
    lastRunMetadataCatalogDetails: S.optional(MetadataCatalogDetails),
    schemaVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeFlowResponse",
}) as any as S.Schema<DescribeFlowResponse>;
export interface ListConnectorEntitiesResponse {
  connectorEntityMap: { [key: string]: ConnectorEntity[] | undefined };
  nextToken?: string;
}
export const ListConnectorEntitiesResponse = S.suspend(() =>
  S.Struct({
    connectorEntityMap: ConnectorEntityMap,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorEntitiesResponse",
}) as any as S.Schema<ListConnectorEntitiesResponse>;
export interface RegisterConnectorResponse {
  connectorArn?: string;
}
export const RegisterConnectorResponse = S.suspend(() =>
  S.Struct({ connectorArn: S.optional(S.String) }),
).annotations({
  identifier: "RegisterConnectorResponse",
}) as any as S.Schema<RegisterConnectorResponse>;
export interface ExecutionResult {
  errorInfo?: ErrorInfo;
  bytesProcessed?: number;
  bytesWritten?: number;
  recordsProcessed?: number;
  numParallelProcesses?: number;
  maxPageSize?: number;
}
export const ExecutionResult = S.suspend(() =>
  S.Struct({
    errorInfo: S.optional(ErrorInfo),
    bytesProcessed: S.optional(S.Number),
    bytesWritten: S.optional(S.Number),
    recordsProcessed: S.optional(S.Number),
    numParallelProcesses: S.optional(S.Number),
    maxPageSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExecutionResult",
}) as any as S.Schema<ExecutionResult>;
export interface Range {
  maximum?: number;
  minimum?: number;
}
export const Range = S.suspend(() =>
  S.Struct({ maximum: S.optional(S.Number), minimum: S.optional(S.Number) }),
).annotations({ identifier: "Range" }) as any as S.Schema<Range>;
export interface ExecutionRecord {
  executionId?: string;
  executionStatus?: ExecutionStatus;
  executionResult?: ExecutionResult;
  startedAt?: Date;
  lastUpdatedAt?: Date;
  dataPullStartTime?: Date;
  dataPullEndTime?: Date;
  metadataCatalogDetails?: MetadataCatalogDetail[];
}
export const ExecutionRecord = S.suspend(() =>
  S.Struct({
    executionId: S.optional(S.String),
    executionStatus: S.optional(ExecutionStatus),
    executionResult: S.optional(ExecutionResult),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    dataPullStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    dataPullEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    metadataCatalogDetails: S.optional(MetadataCatalogDetails),
  }),
).annotations({
  identifier: "ExecutionRecord",
}) as any as S.Schema<ExecutionRecord>;
export type FlowExecutionList = ExecutionRecord[];
export const FlowExecutionList = S.Array(ExecutionRecord);
export interface FieldTypeDetails {
  fieldType: string;
  filterOperators: Operator[];
  supportedValues?: string[];
  valueRegexPattern?: string;
  supportedDateFormat?: string;
  fieldValueRange?: Range;
  fieldLengthRange?: Range;
}
export const FieldTypeDetails = S.suspend(() =>
  S.Struct({
    fieldType: S.String,
    filterOperators: FilterOperatorList,
    supportedValues: S.optional(SupportedValueList),
    valueRegexPattern: S.optional(S.String),
    supportedDateFormat: S.optional(S.String),
    fieldValueRange: S.optional(Range),
    fieldLengthRange: S.optional(Range),
  }),
).annotations({
  identifier: "FieldTypeDetails",
}) as any as S.Schema<FieldTypeDetails>;
export interface DescribeFlowExecutionRecordsResponse {
  flowExecutions?: ExecutionRecord[];
  nextToken?: string;
}
export const DescribeFlowExecutionRecordsResponse = S.suspend(() =>
  S.Struct({
    flowExecutions: S.optional(FlowExecutionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFlowExecutionRecordsResponse",
}) as any as S.Schema<DescribeFlowExecutionRecordsResponse>;
export interface SupportedFieldTypeDetails {
  v1: FieldTypeDetails;
}
export const SupportedFieldTypeDetails = S.suspend(() =>
  S.Struct({ v1: FieldTypeDetails }),
).annotations({
  identifier: "SupportedFieldTypeDetails",
}) as any as S.Schema<SupportedFieldTypeDetails>;
export interface ConnectorEntityField {
  identifier: string;
  parentIdentifier?: string;
  label?: string;
  isPrimaryKey?: boolean;
  defaultValue?: string;
  isDeprecated?: boolean;
  supportedFieldTypeDetails?: SupportedFieldTypeDetails;
  description?: string;
  sourceProperties?: SourceFieldProperties;
  destinationProperties?: DestinationFieldProperties;
  customProperties?: { [key: string]: string | undefined };
}
export const ConnectorEntityField = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    parentIdentifier: S.optional(S.String),
    label: S.optional(S.String),
    isPrimaryKey: S.optional(S.Boolean),
    defaultValue: S.optional(S.String),
    isDeprecated: S.optional(S.Boolean),
    supportedFieldTypeDetails: S.optional(SupportedFieldTypeDetails),
    description: S.optional(S.String),
    sourceProperties: S.optional(SourceFieldProperties),
    destinationProperties: S.optional(DestinationFieldProperties),
    customProperties: S.optional(CustomProperties),
  }),
).annotations({
  identifier: "ConnectorEntityField",
}) as any as S.Schema<ConnectorEntityField>;
export type ConnectorEntityFieldList = ConnectorEntityField[];
export const ConnectorEntityFieldList = S.Array(ConnectorEntityField);
export interface CreateConnectorProfileRequest {
  connectorProfileName: string;
  kmsArn?: string;
  connectorType: ConnectorType;
  connectorLabel?: string;
  connectionMode: ConnectionMode;
  connectorProfileConfig: ConnectorProfileConfig;
  clientToken?: string;
}
export const CreateConnectorProfileRequest = S.suspend(() =>
  S.Struct({
    connectorProfileName: S.String,
    kmsArn: S.optional(S.String),
    connectorType: ConnectorType,
    connectorLabel: S.optional(S.String),
    connectionMode: ConnectionMode,
    connectorProfileConfig: ConnectorProfileConfig,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-connector-profile" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorProfileRequest",
}) as any as S.Schema<CreateConnectorProfileRequest>;
export interface CreateFlowRequest {
  flowName: string;
  description?: string;
  kmsArn?: string;
  triggerConfig: TriggerConfig;
  sourceFlowConfig: SourceFlowConfig;
  destinationFlowConfigList: DestinationFlowConfig[];
  tasks: Task[];
  tags?: { [key: string]: string | undefined };
  metadataCatalogConfig?: MetadataCatalogConfig;
  clientToken?: string;
}
export const CreateFlowRequest = S.suspend(() =>
  S.Struct({
    flowName: S.String,
    description: S.optional(S.String),
    kmsArn: S.optional(S.String),
    triggerConfig: TriggerConfig,
    sourceFlowConfig: SourceFlowConfig,
    destinationFlowConfigList: DestinationFlowConfigList,
    tasks: Tasks,
    tags: S.optional(TagMap),
    metadataCatalogConfig: S.optional(MetadataCatalogConfig),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFlowRequest",
}) as any as S.Schema<CreateFlowRequest>;
export interface DescribeConnectorResponse {
  connectorConfiguration?: ConnectorConfiguration;
}
export const DescribeConnectorResponse = S.suspend(() =>
  S.Struct({ connectorConfiguration: S.optional(ConnectorConfiguration) }),
).annotations({
  identifier: "DescribeConnectorResponse",
}) as any as S.Schema<DescribeConnectorResponse>;
export interface DescribeConnectorEntityResponse {
  connectorEntityFields: ConnectorEntityField[];
}
export const DescribeConnectorEntityResponse = S.suspend(() =>
  S.Struct({ connectorEntityFields: ConnectorEntityFieldList }),
).annotations({
  identifier: "DescribeConnectorEntityResponse",
}) as any as S.Schema<DescribeConnectorEntityResponse>;
export interface CreateConnectorProfileResponse {
  connectorProfileArn?: string;
}
export const CreateConnectorProfileResponse = S.suspend(() =>
  S.Struct({ connectorProfileArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateConnectorProfileResponse",
}) as any as S.Schema<CreateConnectorProfileResponse>;
export interface CreateFlowResponse {
  flowArn?: string;
  flowStatus?: FlowStatus;
}
export const CreateFlowResponse = S.suspend(() =>
  S.Struct({
    flowArn: S.optional(S.String),
    flowStatus: S.optional(FlowStatus),
  }),
).annotations({
  identifier: "CreateFlowResponse",
}) as any as S.Schema<CreateFlowResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConnectorAuthenticationException extends S.TaggedError<ConnectorAuthenticationException>()(
  "ConnectorAuthenticationException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConnectorServerException extends S.TaggedError<ConnectorServerException>()(
  "ConnectorServerException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Returns the list of all registered custom connectors in your Amazon Web Services account.
 * This API lists only custom connectors registered in this account, not the Amazon Web Services
 * authored connectors.
 */
export const listConnectors: {
  (
    input: ListConnectorsRequest,
  ): effect.Effect<
    ListConnectorsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorsRequest,
  ) => stream.Stream<
    ListConnectorsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectorsRequest,
  output: ListConnectorsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Enables your application to delete an existing flow. Before deleting the flow, Amazon AppFlow validates the request by checking the flow configuration and status. You can
 * delete flows one at a time.
 */
export const deleteFlow: (
  input: DeleteFlowRequest,
) => effect.Effect<
  DeleteFlowResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowRequest,
  output: DeleteFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Resets metadata about your connector entities that Amazon AppFlow stored in its
 * cache. Use this action when you want Amazon AppFlow to return the latest information
 * about the data that you have in a source application.
 *
 * Amazon AppFlow returns metadata about your entities when you use the
 * ListConnectorEntities or DescribeConnectorEntities actions. Following these actions, Amazon AppFlow caches the metadata to reduce the number of API requests that it must send to
 * the source application. Amazon AppFlow automatically resets the cache once every hour,
 * but you can use this action when you want to get the latest metadata right away.
 */
export const resetConnectorMetadataCache: (
  input: ResetConnectorMetadataCacheRequest,
) => effect.Effect<
  ResetConnectorMetadataCacheResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetConnectorMetadataCacheRequest,
  output: ResetConnectorMetadataCacheResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Unregisters the custom connector registered in your account that matches the connector
 * label provided in the request.
 */
export const unregisterConnector: (
  input: UnregisterConnectorRequest,
) => effect.Effect<
  UnregisterConnectorResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnregisterConnectorRequest,
  output: UnregisterConnectorResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes a tag from the specified flow.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Enables you to delete an existing connector profile.
 */
export const deleteConnectorProfile: (
  input: DeleteConnectorProfileRequest,
) => effect.Effect<
  DeleteConnectorProfileResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorProfileRequest,
  output: DeleteConnectorProfileResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the tags that are associated with a specified flow.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Describes the connectors vended by Amazon AppFlow for specified connector types. If
 * you don't specify a connector type, this operation describes all connectors vended by Amazon AppFlow. If there are more connectors than can be returned in one page, the response
 * contains a `nextToken` object, which can be be passed in to the next call to the
 * `DescribeConnectors` API operation to retrieve the next page.
 */
export const describeConnectors: {
  (
    input: DescribeConnectorsRequest,
  ): effect.Effect<
    DescribeConnectorsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConnectorsRequest,
  ) => stream.Stream<
    DescribeConnectorsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConnectorsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConnectorsRequest,
  output: DescribeConnectorsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all of the flows associated with your account.
 */
export const listFlows: {
  (
    input: ListFlowsRequest,
  ): effect.Effect<
    ListFlowsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListFlowsRequest,
  ) => stream.Stream<
    ListFlowsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListFlowsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFlowsRequest,
  output: ListFlowsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Applies a tag to the specified flow.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Updates a given connector profile associated with your account.
 */
export const updateConnectorProfile: (
  input: UpdateConnectorProfileRequest,
) => effect.Effect<
  UpdateConnectorProfileResponse,
  | ConflictException
  | ConnectorAuthenticationException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorProfileRequest,
  output: UpdateConnectorProfileResponse,
  errors: [
    ConflictException,
    ConnectorAuthenticationException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of `connector-profile` details matching the provided
 * `connector-profile` names and `connector-types`. Both input lists are
 * optional, and you can use them to filter the result.
 *
 * If no names or `connector-types` are provided, returns all connector profiles
 * in a paginated form. If there is no match, this operation returns an empty list.
 */
export const describeConnectorProfiles: {
  (
    input: DescribeConnectorProfilesRequest,
  ): effect.Effect<
    DescribeConnectorProfilesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConnectorProfilesRequest,
  ) => stream.Stream<
    DescribeConnectorProfilesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConnectorProfilesRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConnectorProfilesRequest,
  output: DescribeConnectorProfilesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides a description of the specified flow.
 */
export const describeFlow: (
  input: DescribeFlowRequest,
) => effect.Effect<
  DescribeFlowResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlowRequest,
  output: DescribeFlowResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Activates an existing flow. For on-demand flows, this operation runs the flow
 * immediately. For schedule and event-triggered flows, this operation activates the flow.
 */
export const startFlow: (
  input: StartFlowRequest,
) => effect.Effect<
  StartFlowResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFlowRequest,
  output: StartFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Deactivates the existing flow. For on-demand flows, this operation returns an
 * `unsupportedOperationException` error message. For schedule and event-triggered
 * flows, this operation deactivates the flow.
 */
export const stopFlow: (
  input: StopFlowRequest,
) => effect.Effect<
  StopFlowResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFlowRequest,
  output: StopFlowResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Cancels active runs for a flow.
 *
 * You can cancel all of the active runs for a flow, or you can cancel specific runs by
 * providing their IDs.
 *
 * You can cancel a flow run only when the run is in progress. You can't cancel a run that
 * has already completed or failed. You also can't cancel a run that's scheduled to occur but
 * hasn't started yet. To prevent a scheduled run, you can deactivate the flow with the
 * `StopFlow` action.
 *
 * You cannot resume a run after you cancel it.
 *
 * When you send your request, the status for each run becomes `CancelStarted`.
 * When the cancellation completes, the status becomes `Canceled`.
 *
 * When you cancel a run, you still incur charges for any data that the run already
 * processed before the cancellation. If the run had already written some data to the flow
 * destination, then that data remains in the destination. If you configured the flow to use a
 * batch API (such as the Salesforce Bulk API 2.0), then the run will finish reading or writing
 * its entire batch of data after the cancellation. For these operations, the data processing
 * charges for Amazon AppFlow apply. For the pricing information, see Amazon AppFlow pricing.
 */
export const cancelFlowExecutions: (
  input: CancelFlowExecutionsRequest,
) => effect.Effect<
  CancelFlowExecutionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelFlowExecutionsRequest,
  output: CancelFlowExecutionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing flow.
 */
export const updateFlow: (
  input: UpdateFlowRequest,
) => effect.Effect<
  UpdateFlowResponse,
  | AccessDeniedException
  | ConflictException
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowRequest,
  output: UpdateFlowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the list of available connector entities supported by Amazon AppFlow. For
 * example, you can query Salesforce for *Account* and
 * *Opportunity* entities, or query ServiceNow for the
 * *Incident* entity.
 */
export const listConnectorEntities: (
  input: ListConnectorEntitiesRequest,
) => effect.Effect<
  ListConnectorEntitiesResponse,
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectorEntitiesRequest,
  output: ListConnectorEntitiesResponse,
  errors: [
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Registers a new custom connector with your Amazon Web Services account. Before you can
 * register the connector, you must deploy the associated AWS lambda function in your
 * account.
 */
export const registerConnector: (
  input: RegisterConnectorRequest,
) => effect.Effect<
  RegisterConnectorResponse,
  | AccessDeniedException
  | ConflictException
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterConnectorRequest,
  output: RegisterConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a custom connector that you've previously registered. This operation updates the
 * connector with one of the following:
 *
 * - The latest version of the AWS Lambda function that's assigned to the connector
 *
 * - A new AWS Lambda function that you specify
 */
export const updateConnectorRegistration: (
  input: UpdateConnectorRegistrationRequest,
) => effect.Effect<
  UpdateConnectorRegistrationResponse,
  | AccessDeniedException
  | ConflictException
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorRegistrationRequest,
  output: UpdateConnectorRegistrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the execution history of the flow.
 */
export const describeFlowExecutionRecords: {
  (
    input: DescribeFlowExecutionRecordsRequest,
  ): effect.Effect<
    DescribeFlowExecutionRecordsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFlowExecutionRecordsRequest,
  ) => stream.Stream<
    DescribeFlowExecutionRecordsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFlowExecutionRecordsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeFlowExecutionRecordsRequest,
  output: DescribeFlowExecutionRecordsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes the given custom connector registered in your Amazon Web Services account. This
 * API can be used for custom connectors that are registered in your account and also for Amazon
 * authored connectors.
 */
export const describeConnector: (
  input: DescribeConnectorRequest,
) => effect.Effect<
  DescribeConnectorResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorRequest,
  output: DescribeConnectorResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides details regarding the entity used with the connector, with a description of the
 * data model for each field in that entity.
 */
export const describeConnectorEntity: (
  input: DescribeConnectorEntityRequest,
) => effect.Effect<
  DescribeConnectorEntityResponse,
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorEntityRequest,
  output: DescribeConnectorEntityResponse,
  errors: [
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new connector profile associated with your Amazon Web Services account. There is
 * a soft quota of 100 connector profiles per Amazon Web Services account. If you need more
 * connector profiles than this quota allows, you can submit a request to the Amazon AppFlow
 * team through the Amazon AppFlow support channel. In each connector profile that you
 * create, you can provide the credentials and properties for only one connector.
 */
export const createConnectorProfile: (
  input: CreateConnectorProfileRequest,
) => effect.Effect<
  CreateConnectorProfileResponse,
  | ConflictException
  | ConnectorAuthenticationException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorProfileRequest,
  output: CreateConnectorProfileResponse,
  errors: [
    ConflictException,
    ConnectorAuthenticationException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Enables your application to create a new flow using Amazon AppFlow. You must create
 * a connector profile before calling this API. Please note that the Request Syntax below shows
 * syntax for multiple destinations, however, you can only transfer data to one item in this list
 * at a time. Amazon AppFlow does not currently support flows to multiple destinations at
 * once.
 */
export const createFlow: (
  input: CreateFlowRequest,
) => effect.Effect<
  CreateFlowResponse,
  | AccessDeniedException
  | ConflictException
  | ConnectorAuthenticationException
  | ConnectorServerException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowRequest,
  output: CreateFlowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ConnectorAuthenticationException,
    ConnectorServerException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

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
const svc = T.AwsApiService({ sdkId: "Ssm Sap", serviceShapeName: "SsmSap" });
const auth = T.AwsAuthSigv4({ name: "ssm-sap" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://ssm-sap-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ssm-sap-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ssm-sap.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ssm-sap.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type ApplicationId = string;
export type SsmSapArn = string;
export type AppRegistryArn = string;
export type ComponentId = string;
export type OperationId = string;
export type DatabaseId = string;
export type NextToken = string;
export type MaxResults = number;
export type SubCheckResultId = string;
export type InstanceId = string;
export type SAPInstanceNumber = string;
export type SID = string;
export type TagKey = string;
export type FilterName = string;
export type FilterValue = string;
export type TagValue = string;
export type DatabaseName = string;
export type SecretId = string | redacted.Redacted<string>;
export type OperationType = string;
export type ResourceType = string;
export type ResourceId = string;
export type RuleResultId = string;
export type OperationEventResourceType = string;
export type RuleResultMetadataKey = string;
export type RuleResultMetadataValue = string;

//# Schemas
export type PermissionActionType = "RESTORE" | (string & {});
export const PermissionActionType = S.String;
export type ConfigurationCheckOperationListingMode =
  | "ALL_OPERATIONS"
  | "LATEST_PER_CHECK"
  | (string & {});
export const ConfigurationCheckOperationListingMode = S.String;
export type ApplicationType = "HANA" | "SAP_ABAP" | (string & {});
export const ApplicationType = S.String;
export type InstanceList = string[];
export const InstanceList = S.Array(S.String);
export type ConfigurationCheckType =
  | "SAP_CHECK_01"
  | "SAP_CHECK_02"
  | "SAP_CHECK_03"
  | (string & {});
export const ConfigurationCheckType = S.String;
export type ConfigurationCheckTypeList = ConfigurationCheckType[];
export const ConfigurationCheckTypeList = S.Array(ConfigurationCheckType);
export type ConnectedEntityType = "DBMS" | (string & {});
export const ConnectedEntityType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteResourcePermissionInput {
  ActionType?: PermissionActionType;
  SourceResourceArn?: string;
  ResourceArn: string;
}
export const DeleteResourcePermissionInput = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(PermissionActionType),
    SourceResourceArn: S.optional(S.String),
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-resource-permission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePermissionInput",
}) as any as S.Schema<DeleteResourcePermissionInput>;
export interface DeregisterApplicationInput {
  ApplicationId: string;
}
export const DeregisterApplicationInput = S.suspend(() =>
  S.Struct({ ApplicationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deregister-application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterApplicationInput",
}) as any as S.Schema<DeregisterApplicationInput>;
export interface DeregisterApplicationOutput {}
export const DeregisterApplicationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterApplicationOutput",
}) as any as S.Schema<DeregisterApplicationOutput>;
export interface GetApplicationInput {
  ApplicationId?: string;
  ApplicationArn?: string;
  AppRegistryArn?: string;
}
export const GetApplicationInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
    AppRegistryArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationInput",
}) as any as S.Schema<GetApplicationInput>;
export interface GetComponentInput {
  ApplicationId: string;
  ComponentId: string;
}
export const GetComponentInput = S.suspend(() =>
  S.Struct({ ApplicationId: S.String, ComponentId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-component" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComponentInput",
}) as any as S.Schema<GetComponentInput>;
export interface GetConfigurationCheckOperationInput {
  OperationId: string;
}
export const GetConfigurationCheckOperationInput = S.suspend(() =>
  S.Struct({ OperationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-configuration-check-operation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationCheckOperationInput",
}) as any as S.Schema<GetConfigurationCheckOperationInput>;
export interface GetDatabaseInput {
  ApplicationId?: string;
  ComponentId?: string;
  DatabaseId?: string;
  DatabaseArn?: string;
}
export const GetDatabaseInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    DatabaseId: S.optional(S.String),
    DatabaseArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-database" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDatabaseInput",
}) as any as S.Schema<GetDatabaseInput>;
export interface GetOperationInput {
  OperationId: string;
}
export const GetOperationInput = S.suspend(() =>
  S.Struct({ OperationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-operation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOperationInput",
}) as any as S.Schema<GetOperationInput>;
export interface GetResourcePermissionInput {
  ActionType?: PermissionActionType;
  ResourceArn: string;
}
export const GetResourcePermissionInput = S.suspend(() =>
  S.Struct({
    ActionType: S.optional(PermissionActionType),
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/get-resource-permission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePermissionInput",
}) as any as S.Schema<GetResourcePermissionInput>;
export interface ListComponentsInput {
  ApplicationId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListComponentsInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-components" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComponentsInput",
}) as any as S.Schema<ListComponentsInput>;
export interface ListConfigurationCheckDefinitionsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConfigurationCheckDefinitionsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-configuration-check-definitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationCheckDefinitionsInput",
}) as any as S.Schema<ListConfigurationCheckDefinitionsInput>;
export type FilterOperator =
  | "Equals"
  | "GreaterThanOrEquals"
  | "LessThanOrEquals"
  | (string & {});
export const FilterOperator = S.String;
export interface Filter {
  Name: string;
  Value: string;
  Operator: FilterOperator;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String, Operator: FilterOperator }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ListConfigurationCheckOperationsInput {
  ApplicationId: string;
  ListMode?: ConfigurationCheckOperationListingMode;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListConfigurationCheckOperationsInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    ListMode: S.optional(ConfigurationCheckOperationListingMode),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-configuration-check-operations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationCheckOperationsInput",
}) as any as S.Schema<ListConfigurationCheckOperationsInput>;
export interface ListDatabasesInput {
  ApplicationId?: string;
  ComponentId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDatabasesInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-databases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatabasesInput",
}) as any as S.Schema<ListDatabasesInput>;
export interface ListOperationEventsInput {
  OperationId: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListOperationEventsInput = S.suspend(() =>
  S.Struct({
    OperationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-operation-events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOperationEventsInput",
}) as any as S.Schema<ListOperationEventsInput>;
export interface ListOperationsInput {
  ApplicationId: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
}
export const ListOperationsInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-operations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOperationsInput",
}) as any as S.Schema<ListOperationsInput>;
export interface ListSubCheckResultsInput {
  OperationId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSubCheckResultsInput = S.suspend(() =>
  S.Struct({
    OperationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-sub-check-results" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubCheckResultsInput",
}) as any as S.Schema<ListSubCheckResultsInput>;
export interface ListSubCheckRuleResultsInput {
  SubCheckResultId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSubCheckRuleResultsInput = S.suspend(() =>
  S.Struct({
    SubCheckResultId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-sub-check-rule-results" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubCheckRuleResultsInput",
}) as any as S.Schema<ListSubCheckRuleResultsInput>;
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
export interface PutResourcePermissionInput {
  ActionType: PermissionActionType;
  SourceResourceArn: string;
  ResourceArn: string;
}
export const PutResourcePermissionInput = S.suspend(() =>
  S.Struct({
    ActionType: PermissionActionType,
    SourceResourceArn: S.String,
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/put-resource-permission" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePermissionInput",
}) as any as S.Schema<PutResourcePermissionInput>;
export interface StartApplicationInput {
  ApplicationId: string;
}
export const StartApplicationInput = S.suspend(() =>
  S.Struct({ ApplicationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartApplicationInput",
}) as any as S.Schema<StartApplicationInput>;
export interface StartApplicationRefreshInput {
  ApplicationId: string;
}
export const StartApplicationRefreshInput = S.suspend(() =>
  S.Struct({ ApplicationId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-application-refresh" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartApplicationRefreshInput",
}) as any as S.Schema<StartApplicationRefreshInput>;
export interface StartConfigurationChecksInput {
  ApplicationId: string;
  ConfigurationCheckIds?: ConfigurationCheckType[];
}
export const StartConfigurationChecksInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    ConfigurationCheckIds: S.optional(ConfigurationCheckTypeList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-configuration-checks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigurationChecksInput",
}) as any as S.Schema<StartConfigurationChecksInput>;
export interface StopApplicationInput {
  ApplicationId: string;
  StopConnectedEntity?: ConnectedEntityType;
  IncludeEc2InstanceShutdown?: boolean;
}
export const StopApplicationInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    StopConnectedEntity: S.optional(ConnectedEntityType),
    IncludeEc2InstanceShutdown: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/stop-application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopApplicationInput",
}) as any as S.Schema<StopApplicationInput>;
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
export type CredentialType = "ADMIN" | (string & {});
export const CredentialType = S.String;
export type ComponentType =
  | "HANA"
  | "HANA_NODE"
  | "ABAP"
  | "ASCS"
  | "DIALOG"
  | "WEBDISP"
  | "WD"
  | "ERS"
  | (string & {});
export const ComponentType = S.String;
export type BackintMode = "AWSBackup" | (string & {});
export const BackintMode = S.String;
export type OperationStatus =
  | "INPROGRESS"
  | "SUCCESS"
  | "ERROR"
  | (string & {});
export const OperationStatus = S.String;
export interface RuleStatusCounts {
  Failed?: number;
  Warning?: number;
  Info?: number;
  Passed?: number;
  Unknown?: number;
}
export const RuleStatusCounts = S.suspend(() =>
  S.Struct({
    Failed: S.optional(S.Number),
    Warning: S.optional(S.Number),
    Info: S.optional(S.Number),
    Passed: S.optional(S.Number),
    Unknown: S.optional(S.Number),
  }),
).annotations({
  identifier: "RuleStatusCounts",
}) as any as S.Schema<RuleStatusCounts>;
export interface ConfigurationCheckOperation {
  Id?: string;
  ApplicationId?: string;
  Status?: OperationStatus;
  StatusMessage?: string;
  ConfigurationCheckId?: ConfigurationCheckType;
  ConfigurationCheckName?: string;
  ConfigurationCheckDescription?: string;
  StartTime?: Date;
  EndTime?: Date;
  RuleStatusCounts?: RuleStatusCounts;
}
export const ConfigurationCheckOperation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    Status: S.optional(OperationStatus),
    StatusMessage: S.optional(S.String),
    ConfigurationCheckId: S.optional(ConfigurationCheckType),
    ConfigurationCheckName: S.optional(S.String),
    ConfigurationCheckDescription: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RuleStatusCounts: S.optional(RuleStatusCounts),
  }),
).annotations({
  identifier: "ConfigurationCheckOperation",
}) as any as S.Schema<ConfigurationCheckOperation>;
export type ConfigurationCheckOperationList = ConfigurationCheckOperation[];
export const ConfigurationCheckOperationList = S.Array(
  ConfigurationCheckOperation,
);
export type OperationProperties = { [key: string]: string | undefined };
export const OperationProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
}).pipe(T.Sparse());
export interface Operation {
  Id?: string;
  Type?: string;
  Status?: OperationStatus;
  StatusMessage?: string;
  Properties?: { [key: string]: string | undefined };
  ResourceType?: string;
  ResourceId?: string;
  ResourceArn?: string;
  StartTime?: Date;
  EndTime?: Date;
  LastUpdatedTime?: Date;
}
export const Operation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(S.String),
    Status: S.optional(OperationStatus),
    StatusMessage: S.optional(S.String),
    Properties: S.optional(OperationProperties),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Operation" }) as any as S.Schema<Operation>;
export type OperationList = Operation[];
export const OperationList = S.Array(Operation);
export interface ApplicationCredential {
  DatabaseName: string;
  CredentialType: CredentialType;
  SecretId: string | redacted.Redacted<string>;
}
export const ApplicationCredential = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    CredentialType: CredentialType,
    SecretId: SensitiveString,
  }),
).annotations({
  identifier: "ApplicationCredential",
}) as any as S.Schema<ApplicationCredential>;
export type ApplicationCredentialList = ApplicationCredential[];
export const ApplicationCredentialList = S.Array(ApplicationCredential);
export interface ComponentInfo {
  ComponentType: ComponentType;
  Sid: string;
  Ec2InstanceId: string;
}
export const ComponentInfo = S.suspend(() =>
  S.Struct({
    ComponentType: ComponentType,
    Sid: S.String,
    Ec2InstanceId: S.String,
  }),
).annotations({
  identifier: "ComponentInfo",
}) as any as S.Schema<ComponentInfo>;
export type ComponentInfoList = ComponentInfo[];
export const ComponentInfoList = S.Array(ComponentInfo);
export interface BackintConfig {
  BackintMode: BackintMode;
  EnsureNoBackupInProcess: boolean;
}
export const BackintConfig = S.suspend(() =>
  S.Struct({ BackintMode: BackintMode, EnsureNoBackupInProcess: S.Boolean }),
).annotations({
  identifier: "BackintConfig",
}) as any as S.Schema<BackintConfig>;
export interface DeleteResourcePermissionOutput {
  Policy?: string;
}
export const DeleteResourcePermissionOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "DeleteResourcePermissionOutput",
}) as any as S.Schema<DeleteResourcePermissionOutput>;
export interface GetResourcePermissionOutput {
  Policy?: string;
}
export const GetResourcePermissionOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePermissionOutput",
}) as any as S.Schema<GetResourcePermissionOutput>;
export interface ListApplicationsInput {
  NextToken?: string;
  MaxResults?: number;
  Filters?: Filter[];
}
export const ListApplicationsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(FilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsInput",
}) as any as S.Schema<ListApplicationsInput>;
export interface ListConfigurationCheckOperationsOutput {
  ConfigurationCheckOperations?: ConfigurationCheckOperation[];
  NextToken?: string;
}
export const ListConfigurationCheckOperationsOutput = S.suspend(() =>
  S.Struct({
    ConfigurationCheckOperations: S.optional(ConfigurationCheckOperationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationCheckOperationsOutput",
}) as any as S.Schema<ListConfigurationCheckOperationsOutput>;
export interface ListOperationsOutput {
  Operations?: Operation[];
  NextToken?: string;
}
export const ListOperationsOutput = S.suspend(() =>
  S.Struct({
    Operations: S.optional(OperationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOperationsOutput",
}) as any as S.Schema<ListOperationsOutput>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourcePermissionOutput {
  Policy?: string;
}
export const PutResourcePermissionOutput = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "PutResourcePermissionOutput",
}) as any as S.Schema<PutResourcePermissionOutput>;
export interface RegisterApplicationInput {
  ApplicationId: string;
  ApplicationType: ApplicationType;
  Instances: string[];
  SapInstanceNumber?: string;
  Sid?: string;
  Tags?: { [key: string]: string | undefined };
  Credentials?: ApplicationCredential[];
  DatabaseArn?: string;
  ComponentsInfo?: ComponentInfo[];
}
export const RegisterApplicationInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    ApplicationType: ApplicationType,
    Instances: InstanceList,
    SapInstanceNumber: S.optional(S.String),
    Sid: S.optional(S.String),
    Tags: S.optional(TagMap),
    Credentials: S.optional(ApplicationCredentialList),
    DatabaseArn: S.optional(S.String),
    ComponentsInfo: S.optional(ComponentInfoList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/register-application" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterApplicationInput",
}) as any as S.Schema<RegisterApplicationInput>;
export interface StartApplicationOutput {
  OperationId?: string;
}
export const StartApplicationOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "StartApplicationOutput",
}) as any as S.Schema<StartApplicationOutput>;
export interface StartApplicationRefreshOutput {
  OperationId?: string;
}
export const StartApplicationRefreshOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "StartApplicationRefreshOutput",
}) as any as S.Schema<StartApplicationRefreshOutput>;
export interface StartConfigurationChecksOutput {
  ConfigurationCheckOperations?: ConfigurationCheckOperation[];
}
export const StartConfigurationChecksOutput = S.suspend(() =>
  S.Struct({
    ConfigurationCheckOperations: S.optional(ConfigurationCheckOperationList),
  }),
).annotations({
  identifier: "StartConfigurationChecksOutput",
}) as any as S.Schema<StartConfigurationChecksOutput>;
export interface StopApplicationOutput {
  OperationId?: string;
}
export const StopApplicationOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }),
).annotations({
  identifier: "StopApplicationOutput",
}) as any as S.Schema<StopApplicationOutput>;
export interface UpdateApplicationSettingsInput {
  ApplicationId: string;
  CredentialsToAddOrUpdate?: ApplicationCredential[];
  CredentialsToRemove?: ApplicationCredential[];
  Backint?: BackintConfig;
  DatabaseArn?: string;
}
export const UpdateApplicationSettingsInput = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String,
    CredentialsToAddOrUpdate: S.optional(ApplicationCredentialList),
    CredentialsToRemove: S.optional(ApplicationCredentialList),
    Backint: S.optional(BackintConfig),
    DatabaseArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-application-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationSettingsInput",
}) as any as S.Schema<UpdateApplicationSettingsInput>;
export type ApplicationStatus =
  | "ACTIVATED"
  | "STARTING"
  | "STOPPED"
  | "STOPPING"
  | "FAILED"
  | "REGISTERING"
  | "DELETING"
  | "UNKNOWN"
  | (string & {});
export const ApplicationStatus = S.String;
export type ApplicationDiscoveryStatus =
  | "SUCCESS"
  | "REGISTRATION_FAILED"
  | "REFRESH_FAILED"
  | "REGISTERING"
  | "DELETING"
  | (string & {});
export const ApplicationDiscoveryStatus = S.String;
export type ComponentIdList = string[];
export const ComponentIdList = S.Array(S.String);
export type ApplicationArnList = string[];
export const ApplicationArnList = S.Array(S.String);
export type ComponentStatus =
  | "ACTIVATED"
  | "STARTING"
  | "STOPPED"
  | "STOPPING"
  | "RUNNING"
  | "RUNNING_WITH_ERROR"
  | "UNDEFINED"
  | (string & {});
export const ComponentStatus = S.String;
export type DatabaseIdList = string[];
export const DatabaseIdList = S.Array(S.String);
export type DatabaseType = "SYSTEM" | "TENANT" | (string & {});
export const DatabaseType = S.String;
export type DatabaseStatus =
  | "RUNNING"
  | "STARTING"
  | "STOPPED"
  | "WARNING"
  | "UNKNOWN"
  | "ERROR"
  | "STOPPING"
  | (string & {});
export const DatabaseStatus = S.String;
export type ComponentArnList = string[];
export const ComponentArnList = S.Array(S.String);
export type ApplicationTypeList = ApplicationType[];
export const ApplicationTypeList = S.Array(ApplicationType);
export type OperationEventStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const OperationEventStatus = S.String;
export type SubCheckReferencesList = string[];
export const SubCheckReferencesList = S.Array(S.String);
export type RuleResultStatus =
  | "PASSED"
  | "FAILED"
  | "WARNING"
  | "INFO"
  | "UNKNOWN"
  | (string & {});
export const RuleResultStatus = S.String;
export interface Application {
  Id?: string;
  Type?: ApplicationType;
  Arn?: string;
  AppRegistryArn?: string;
  Status?: ApplicationStatus;
  DiscoveryStatus?: ApplicationDiscoveryStatus;
  Components?: string[];
  LastUpdated?: Date;
  StatusMessage?: string;
  AssociatedApplicationArns?: string[];
}
export const Application = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(ApplicationType),
    Arn: S.optional(S.String),
    AppRegistryArn: S.optional(S.String),
    Status: S.optional(ApplicationStatus),
    DiscoveryStatus: S.optional(ApplicationDiscoveryStatus),
    Components: S.optional(ComponentIdList),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusMessage: S.optional(S.String),
    AssociatedApplicationArns: S.optional(ApplicationArnList),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export interface Database {
  ApplicationId?: string;
  ComponentId?: string;
  Credentials?: ApplicationCredential[];
  DatabaseId?: string;
  DatabaseName?: string;
  DatabaseType?: DatabaseType;
  Arn?: string;
  Status?: DatabaseStatus;
  PrimaryHost?: string;
  SQLPort?: number;
  LastUpdated?: Date;
  ConnectedComponentArns?: string[];
}
export const Database = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    Credentials: S.optional(ApplicationCredentialList),
    DatabaseId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    DatabaseType: S.optional(DatabaseType),
    Arn: S.optional(S.String),
    Status: S.optional(DatabaseStatus),
    PrimaryHost: S.optional(S.String),
    SQLPort: S.optional(S.Number),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ConnectedComponentArns: S.optional(ComponentArnList),
  }),
).annotations({ identifier: "Database" }) as any as S.Schema<Database>;
export interface ComponentSummary {
  ApplicationId?: string;
  ComponentId?: string;
  ComponentType?: ComponentType;
  Tags?: { [key: string]: string | undefined };
  Arn?: string;
}
export const ComponentSummary = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    ComponentType: S.optional(ComponentType),
    Tags: S.optional(TagMap),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentSummary",
}) as any as S.Schema<ComponentSummary>;
export type ComponentSummaryList = ComponentSummary[];
export const ComponentSummaryList = S.Array(ComponentSummary);
export interface ConfigurationCheckDefinition {
  Id?: ConfigurationCheckType;
  Name?: string;
  Description?: string;
  ApplicableApplicationTypes?: ApplicationType[];
}
export const ConfigurationCheckDefinition = S.suspend(() =>
  S.Struct({
    Id: S.optional(ConfigurationCheckType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ApplicableApplicationTypes: S.optional(ApplicationTypeList),
  }),
).annotations({
  identifier: "ConfigurationCheckDefinition",
}) as any as S.Schema<ConfigurationCheckDefinition>;
export type ConfigurationCheckDefinitionList = ConfigurationCheckDefinition[];
export const ConfigurationCheckDefinitionList = S.Array(
  ConfigurationCheckDefinition,
);
export interface DatabaseSummary {
  ApplicationId?: string;
  ComponentId?: string;
  DatabaseId?: string;
  DatabaseType?: DatabaseType;
  Arn?: string;
  Tags?: { [key: string]: string | undefined };
}
export const DatabaseSummary = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ComponentId: S.optional(S.String),
    DatabaseId: S.optional(S.String),
    DatabaseType: S.optional(DatabaseType),
    Arn: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DatabaseSummary",
}) as any as S.Schema<DatabaseSummary>;
export type DatabaseSummaryList = DatabaseSummary[];
export const DatabaseSummaryList = S.Array(DatabaseSummary);
export interface SubCheckResult {
  Id?: string;
  Name?: string;
  Description?: string;
  References?: string[];
}
export const SubCheckResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    References: S.optional(SubCheckReferencesList),
  }),
).annotations({
  identifier: "SubCheckResult",
}) as any as S.Schema<SubCheckResult>;
export type SubCheckResultList = SubCheckResult[];
export const SubCheckResultList = S.Array(SubCheckResult);
export type OperationIdList = string[];
export const OperationIdList = S.Array(S.String);
export type ReplicationMode =
  | "PRIMARY"
  | "NONE"
  | "SYNC"
  | "SYNCMEM"
  | "ASYNC"
  | (string & {});
export const ReplicationMode = S.String;
export type OperationMode =
  | "PRIMARY"
  | "LOGREPLAY"
  | "DELTA_DATASHIPPING"
  | "LOGREPLAY_READACCESS"
  | "NONE"
  | (string & {});
export const OperationMode = S.String;
export type ClusterStatus =
  | "ONLINE"
  | "STANDBY"
  | "MAINTENANCE"
  | "OFFLINE"
  | "NONE"
  | (string & {});
export const ClusterStatus = S.String;
export type HostRole =
  | "LEADER"
  | "WORKER"
  | "STANDBY"
  | "UNKNOWN"
  | (string & {});
export const HostRole = S.String;
export type DatabaseConnectionMethod = "DIRECT" | "OVERLAY" | (string & {});
export const DatabaseConnectionMethod = S.String;
export interface GetApplicationOutput {
  Application?: Application;
  Tags?: { [key: string]: string | undefined };
}
export const GetApplicationOutput = S.suspend(() =>
  S.Struct({ Application: S.optional(Application), Tags: S.optional(TagMap) }),
).annotations({
  identifier: "GetApplicationOutput",
}) as any as S.Schema<GetApplicationOutput>;
export interface GetDatabaseOutput {
  Database?: Database;
  Tags?: { [key: string]: string | undefined };
}
export const GetDatabaseOutput = S.suspend(() =>
  S.Struct({ Database: S.optional(Database), Tags: S.optional(TagMap) }),
).annotations({
  identifier: "GetDatabaseOutput",
}) as any as S.Schema<GetDatabaseOutput>;
export interface ListComponentsOutput {
  Components?: ComponentSummary[];
  NextToken?: string;
}
export const ListComponentsOutput = S.suspend(() =>
  S.Struct({
    Components: S.optional(ComponentSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentsOutput",
}) as any as S.Schema<ListComponentsOutput>;
export interface ListConfigurationCheckDefinitionsOutput {
  ConfigurationChecks?: ConfigurationCheckDefinition[];
  NextToken?: string;
}
export const ListConfigurationCheckDefinitionsOutput = S.suspend(() =>
  S.Struct({
    ConfigurationChecks: S.optional(ConfigurationCheckDefinitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationCheckDefinitionsOutput",
}) as any as S.Schema<ListConfigurationCheckDefinitionsOutput>;
export interface ListDatabasesOutput {
  Databases?: DatabaseSummary[];
  NextToken?: string;
}
export const ListDatabasesOutput = S.suspend(() =>
  S.Struct({
    Databases: S.optional(DatabaseSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatabasesOutput",
}) as any as S.Schema<ListDatabasesOutput>;
export interface ListSubCheckResultsOutput {
  SubCheckResults?: SubCheckResult[];
  NextToken?: string;
}
export const ListSubCheckResultsOutput = S.suspend(() =>
  S.Struct({
    SubCheckResults: S.optional(SubCheckResultList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSubCheckResultsOutput",
}) as any as S.Schema<ListSubCheckResultsOutput>;
export interface RegisterApplicationOutput {
  Application?: Application;
  OperationId?: string;
}
export const RegisterApplicationOutput = S.suspend(() =>
  S.Struct({
    Application: S.optional(Application),
    OperationId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterApplicationOutput",
}) as any as S.Schema<RegisterApplicationOutput>;
export interface UpdateApplicationSettingsOutput {
  Message?: string;
  OperationIds?: string[];
}
export const UpdateApplicationSettingsOutput = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String),
    OperationIds: S.optional(OperationIdList),
  }),
).annotations({
  identifier: "UpdateApplicationSettingsOutput",
}) as any as S.Schema<UpdateApplicationSettingsOutput>;
export interface Resilience {
  HsrTier?: string;
  HsrReplicationMode?: ReplicationMode;
  HsrOperationMode?: OperationMode;
  ClusterStatus?: ClusterStatus;
  EnqueueReplication?: boolean;
}
export const Resilience = S.suspend(() =>
  S.Struct({
    HsrTier: S.optional(S.String),
    HsrReplicationMode: S.optional(ReplicationMode),
    HsrOperationMode: S.optional(OperationMode),
    ClusterStatus: S.optional(ClusterStatus),
    EnqueueReplication: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Resilience" }) as any as S.Schema<Resilience>;
export interface Host {
  HostName?: string;
  HostIp?: string;
  EC2InstanceId?: string;
  InstanceId?: string;
  HostRole?: HostRole;
  OsVersion?: string;
}
export const Host = S.suspend(() =>
  S.Struct({
    HostName: S.optional(S.String),
    HostIp: S.optional(S.String),
    EC2InstanceId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    HostRole: S.optional(HostRole),
    OsVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Host" }) as any as S.Schema<Host>;
export type HostList = Host[];
export const HostList = S.Array(Host);
export interface DatabaseConnection {
  DatabaseConnectionMethod?: DatabaseConnectionMethod;
  DatabaseArn?: string;
  ConnectionIp?: string;
}
export const DatabaseConnection = S.suspend(() =>
  S.Struct({
    DatabaseConnectionMethod: S.optional(DatabaseConnectionMethod),
    DatabaseArn: S.optional(S.String),
    ConnectionIp: S.optional(S.String),
  }),
).annotations({
  identifier: "DatabaseConnection",
}) as any as S.Schema<DatabaseConnection>;
export interface Resource {
  ResourceArn?: string;
  ResourceType?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type RuleResultMetadata = { [key: string]: string | undefined };
export const RuleResultMetadata = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type AllocationType =
  | "VPC_SUBNET"
  | "ELASTIC_IP"
  | "OVERLAY"
  | "UNKNOWN"
  | (string & {});
export const AllocationType = S.String;
export interface ApplicationSummary {
  Id?: string;
  DiscoveryStatus?: ApplicationDiscoveryStatus;
  Type?: ApplicationType;
  Arn?: string;
  Tags?: { [key: string]: string | undefined };
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    DiscoveryStatus: S.optional(ApplicationDiscoveryStatus),
    Type: S.optional(ApplicationType),
    Arn: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaryList = ApplicationSummary[];
export const ApplicationSummaryList = S.Array(ApplicationSummary);
export interface OperationEvent {
  Description?: string;
  Resource?: Resource;
  Status?: OperationEventStatus;
  StatusMessage?: string;
  Timestamp?: Date;
}
export const OperationEvent = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Resource: S.optional(Resource),
    Status: S.optional(OperationEventStatus),
    StatusMessage: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OperationEvent",
}) as any as S.Schema<OperationEvent>;
export type OperationEventList = OperationEvent[];
export const OperationEventList = S.Array(OperationEvent);
export interface RuleResult {
  Id?: string;
  Description?: string;
  Status?: RuleResultStatus;
  Message?: string;
  Metadata?: { [key: string]: string | undefined };
}
export const RuleResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(RuleResultStatus),
    Message: S.optional(S.String),
    Metadata: S.optional(RuleResultMetadata),
  }),
).annotations({ identifier: "RuleResult" }) as any as S.Schema<RuleResult>;
export type RuleResultList = RuleResult[];
export const RuleResultList = S.Array(RuleResult);
export interface IpAddressMember {
  IpAddress?: string;
  Primary?: boolean;
  AllocationType?: AllocationType;
}
export const IpAddressMember = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    Primary: S.optional(S.Boolean),
    AllocationType: S.optional(AllocationType),
  }),
).annotations({
  identifier: "IpAddressMember",
}) as any as S.Schema<IpAddressMember>;
export type IpAddressList = IpAddressMember[];
export const IpAddressList = S.Array(IpAddressMember);
export interface GetConfigurationCheckOperationOutput {
  ConfigurationCheckOperation?: ConfigurationCheckOperation;
}
export const GetConfigurationCheckOperationOutput = S.suspend(() =>
  S.Struct({
    ConfigurationCheckOperation: S.optional(ConfigurationCheckOperation),
  }),
).annotations({
  identifier: "GetConfigurationCheckOperationOutput",
}) as any as S.Schema<GetConfigurationCheckOperationOutput>;
export interface GetOperationOutput {
  Operation?: Operation;
}
export const GetOperationOutput = S.suspend(() =>
  S.Struct({ Operation: S.optional(Operation) }),
).annotations({
  identifier: "GetOperationOutput",
}) as any as S.Schema<GetOperationOutput>;
export interface ListApplicationsOutput {
  Applications?: ApplicationSummary[];
  NextToken?: string;
}
export const ListApplicationsOutput = S.suspend(() =>
  S.Struct({
    Applications: S.optional(ApplicationSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsOutput",
}) as any as S.Schema<ListApplicationsOutput>;
export interface ListOperationEventsOutput {
  OperationEvents?: OperationEvent[];
  NextToken?: string;
}
export const ListOperationEventsOutput = S.suspend(() =>
  S.Struct({
    OperationEvents: S.optional(OperationEventList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOperationEventsOutput",
}) as any as S.Schema<ListOperationEventsOutput>;
export interface ListSubCheckRuleResultsOutput {
  RuleResults?: RuleResult[];
  NextToken?: string;
}
export const ListSubCheckRuleResultsOutput = S.suspend(() =>
  S.Struct({
    RuleResults: S.optional(RuleResultList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSubCheckRuleResultsOutput",
}) as any as S.Schema<ListSubCheckRuleResultsOutput>;
export interface AssociatedHost {
  Hostname?: string;
  Ec2InstanceId?: string;
  IpAddresses?: IpAddressMember[];
  OsVersion?: string;
}
export const AssociatedHost = S.suspend(() =>
  S.Struct({
    Hostname: S.optional(S.String),
    Ec2InstanceId: S.optional(S.String),
    IpAddresses: S.optional(IpAddressList),
    OsVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociatedHost",
}) as any as S.Schema<AssociatedHost>;
export interface Component {
  ComponentId?: string;
  Sid?: string;
  SystemNumber?: string;
  ParentComponent?: string;
  ChildComponents?: string[];
  ApplicationId?: string;
  ComponentType?: ComponentType;
  Status?: ComponentStatus;
  SapHostname?: string;
  SapFeature?: string;
  SapKernelVersion?: string;
  HdbVersion?: string;
  Resilience?: Resilience;
  AssociatedHost?: AssociatedHost;
  Databases?: string[];
  Hosts?: Host[];
  PrimaryHost?: string;
  DatabaseConnection?: DatabaseConnection;
  LastUpdated?: Date;
  Arn?: string;
}
export const Component = S.suspend(() =>
  S.Struct({
    ComponentId: S.optional(S.String),
    Sid: S.optional(S.String),
    SystemNumber: S.optional(S.String),
    ParentComponent: S.optional(S.String),
    ChildComponents: S.optional(ComponentIdList),
    ApplicationId: S.optional(S.String),
    ComponentType: S.optional(ComponentType),
    Status: S.optional(ComponentStatus),
    SapHostname: S.optional(S.String),
    SapFeature: S.optional(S.String),
    SapKernelVersion: S.optional(S.String),
    HdbVersion: S.optional(S.String),
    Resilience: S.optional(Resilience),
    AssociatedHost: S.optional(AssociatedHost),
    Databases: S.optional(DatabaseIdList),
    Hosts: S.optional(HostList),
    PrimaryHost: S.optional(S.String),
    DatabaseConnection: S.optional(DatabaseConnection),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "Component" }) as any as S.Schema<Component>;
export interface GetComponentOutput {
  Component?: Component;
  Tags?: { [key: string]: string | undefined };
}
export const GetComponentOutput = S.suspend(() =>
  S.Struct({ Component: S.optional(Component), Tags: S.optional(TagMap) }),
).annotations({
  identifier: "GetComponentOutput",
}) as any as S.Schema<GetComponentOutput>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the operations performed by AWS Systems Manager for SAP.
 */
export const listOperations: {
  (
    input: ListOperationsInput,
  ): effect.Effect<
    ListOperationsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOperationsInput,
  ) => stream.Stream<
    ListOperationsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOperationsInput,
  ) => stream.Stream<
    Operation,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOperationsInput,
  output: ListOperationsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Operations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the sub-check results of a specified configuration check operation.
 */
export const listSubCheckResults: {
  (
    input: ListSubCheckResultsInput,
  ): effect.Effect<
    ListSubCheckResultsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubCheckResultsInput,
  ) => stream.Stream<
    ListSubCheckResultsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubCheckResultsInput,
  ) => stream.Stream<
    SubCheckResult,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubCheckResultsInput,
  output: ListSubCheckResultsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SubCheckResults",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Register an SAP application with AWS Systems Manager for SAP. You must meet the following requirements before registering.
 *
 * The SAP application you want to register with AWS Systems Manager for SAP is running on Amazon EC2.
 *
 * AWS Systems Manager Agent must be setup on an Amazon EC2 instance along with the required IAM permissions.
 *
 * Amazon EC2 instance(s) must have access to the secrets created in AWS Secrets Manager to manage SAP applications and components.
 */
export const registerApplication: (
  input: RegisterApplicationInput,
) => effect.Effect<
  RegisterApplicationOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterApplicationInput,
  output: RegisterApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the settings of an application registered with AWS Systems Manager for SAP.
 */
export const updateApplicationSettings: (
  input: UpdateApplicationSettingsInput,
) => effect.Effect<
  UpdateApplicationSettingsOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationSettingsInput,
  output: UpdateApplicationSettingsOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Lists the configuration check operations performed by AWS Systems Manager for SAP.
 */
export const listConfigurationCheckOperations: {
  (
    input: ListConfigurationCheckOperationsInput,
  ): effect.Effect<
    ListConfigurationCheckOperationsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationCheckOperationsInput,
  ) => stream.Stream<
    ListConfigurationCheckOperationsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationCheckOperationsInput,
  ) => stream.Stream<
    ConfigurationCheckOperation,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationCheckOperationsInput,
  output: ListConfigurationCheckOperationsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationCheckOperations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds permissions to the target database.
 */
export const putResourcePermission: (
  input: PutResourcePermissionInput,
) => effect.Effect<
  PutResourcePermissionOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePermissionInput,
  output: PutResourcePermissionOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates tag for a resource by specifying the ARN.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Removes permissions associated with the target database.
 */
export const deleteResourcePermission: (
  input: DeleteResourcePermissionInput,
) => effect.Effect<
  DeleteResourcePermissionOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePermissionInput,
  output: DeleteResourcePermissionOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Delete the tags for a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all tags on an SAP HANA application and/or database registered with AWS Systems Manager for SAP.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Request is an operation which starts an application.
 *
 * Parameter `ApplicationId` is required.
 */
export const startApplication: (
  input: StartApplicationInput,
) => effect.Effect<
  StartApplicationOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationInput,
  output: StartApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Refreshes a registered application.
 */
export const startApplicationRefresh: (
  input: StartApplicationRefreshInput,
) => effect.Effect<
  StartApplicationRefreshOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationRefreshInput,
  output: StartApplicationRefreshOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Initiates configuration check operations against a specified application.
 */
export const startConfigurationChecks: (
  input: StartConfigurationChecksInput,
) => effect.Effect<
  StartConfigurationChecksOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigurationChecksInput,
  output: StartConfigurationChecksOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Request is an operation to stop an application.
 *
 * Parameter `ApplicationId` is required. Parameters `StopConnectedEntity` and `IncludeEc2InstanceShutdown` are optional.
 */
export const stopApplication: (
  input: StopApplicationInput,
) => effect.Effect<
  StopApplicationOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationInput,
  output: StopApplicationOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregister an SAP application with AWS Systems Manager for SAP. This action does not aﬀect the existing setup of your SAP workloads on Amazon EC2.
 */
export const deregisterApplication: (
  input: DeregisterApplicationInput,
) => effect.Effect<
  DeregisterApplicationOutput,
  | InternalServerException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterApplicationInput,
  output: DeregisterApplicationOutput,
  errors: [InternalServerException, UnauthorizedException, ValidationException],
}));
/**
 * Gets an application registered with AWS Systems Manager for SAP. It also returns the components of the application.
 */
export const getApplication: (
  input: GetApplicationInput,
) => effect.Effect<
  GetApplicationOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationInput,
  output: GetApplicationOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets the SAP HANA database of an application registered with AWS Systems Manager for SAP.
 */
export const getDatabase: (
  input: GetDatabaseInput,
) => effect.Effect<
  GetDatabaseOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabaseInput,
  output: GetDatabaseOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets permissions associated with the target database.
 */
export const getResourcePermission: (
  input: GetResourcePermissionInput,
) => effect.Effect<
  GetResourcePermissionOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePermissionInput,
  output: GetResourcePermissionOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all the components registered with AWS Systems Manager for SAP.
 */
export const listComponents: {
  (
    input: ListComponentsInput,
  ): effect.Effect<
    ListComponentsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsInput,
  ) => stream.Stream<
    ListComponentsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsInput,
  ) => stream.Stream<
    ComponentSummary,
    | InternalServerException
    | ResourceNotFoundException
    | UnauthorizedException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsInput,
  output: ListComponentsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    UnauthorizedException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Components",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all configuration check types supported by AWS Systems Manager for SAP.
 */
export const listConfigurationCheckDefinitions: {
  (
    input: ListConfigurationCheckDefinitionsInput,
  ): effect.Effect<
    ListConfigurationCheckDefinitionsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationCheckDefinitionsInput,
  ) => stream.Stream<
    ListConfigurationCheckDefinitionsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationCheckDefinitionsInput,
  ) => stream.Stream<
    ConfigurationCheckDefinition,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationCheckDefinitionsInput,
  output: ListConfigurationCheckDefinitionsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationChecks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the SAP HANA databases of an application registered with AWS Systems Manager for SAP.
 */
export const listDatabases: {
  (
    input: ListDatabasesInput,
  ): effect.Effect<
    ListDatabasesOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatabasesInput,
  ) => stream.Stream<
    ListDatabasesOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatabasesInput,
  ) => stream.Stream<
    DatabaseSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatabasesInput,
  output: ListDatabasesOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Databases",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the details of a configuration check operation by specifying the operation ID.
 */
export const getConfigurationCheckOperation: (
  input: GetConfigurationCheckOperationInput,
) => effect.Effect<
  GetConfigurationCheckOperationOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationCheckOperationInput,
  output: GetConfigurationCheckOperationOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Gets the details of an operation by specifying the operation ID.
 */
export const getOperation: (
  input: GetOperationInput,
) => effect.Effect<
  GetOperationOutput,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOperationInput,
  output: GetOperationOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists all the applications registered with AWS Systems Manager for SAP.
 */
export const listApplications: {
  (
    input: ListApplicationsInput,
  ): effect.Effect<
    ListApplicationsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsInput,
  ) => stream.Stream<
    ListApplicationsOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsInput,
  ) => stream.Stream<
    ApplicationSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsInput,
  output: ListApplicationsOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Applications",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of operations events.
 *
 * Available parameters include `OperationID`, as well as optional parameters `MaxResults`, `NextToken`, and `Filters`.
 */
export const listOperationEvents: {
  (
    input: ListOperationEventsInput,
  ): effect.Effect<
    ListOperationEventsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOperationEventsInput,
  ) => stream.Stream<
    ListOperationEventsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOperationEventsInput,
  ) => stream.Stream<
    OperationEvent,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOperationEventsInput,
  output: ListOperationEventsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OperationEvents",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the rules of a specified sub-check belonging to a configuration check operation.
 */
export const listSubCheckRuleResults: {
  (
    input: ListSubCheckRuleResultsInput,
  ): effect.Effect<
    ListSubCheckRuleResultsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubCheckRuleResultsInput,
  ) => stream.Stream<
    ListSubCheckRuleResultsOutput,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubCheckRuleResultsInput,
  ) => stream.Stream<
    RuleResult,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubCheckRuleResultsInput,
  output: ListSubCheckRuleResultsOutput,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RuleResults",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the component of an application registered with AWS Systems Manager for SAP.
 */
export const getComponent: (
  input: GetComponentInput,
) => effect.Effect<
  GetComponentOutput,
  | InternalServerException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentInput,
  output: GetComponentOutput,
  errors: [InternalServerException, UnauthorizedException, ValidationException],
}));

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
  sdkId: "SSM QuickSetup",
  serviceShapeName: "QuickSetup",
});
const auth = T.AwsAuthSigv4({ name: "ssm-quicksetup" });
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
              `https://ssm-quicksetup-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ssm-quicksetup-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ssm-quicksetup.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ssm-quicksetup.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IAMRoleArn = string;

//# Schemas
export interface GetServiceSettingsRequest {}
export const GetServiceSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceSettingsRequest",
}) as any as S.Schema<GetServiceSettingsRequest>;
export interface ListQuickSetupTypesRequest {}
export const ListQuickSetupTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQuickSetupTypesRequest",
}) as any as S.Schema<ListQuickSetupTypesRequest>;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DeleteConfigurationManagerInput {
  ManagerArn: string;
}
export const DeleteConfigurationManagerInput = S.suspend(() =>
  S.Struct({ ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/configurationManager/{ManagerArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationManagerInput",
}) as any as S.Schema<DeleteConfigurationManagerInput>;
export interface DeleteConfigurationManagerResponse {}
export const DeleteConfigurationManagerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationManagerResponse",
}) as any as S.Schema<DeleteConfigurationManagerResponse>;
export interface GetConfigurationInput {
  ConfigurationId: string;
}
export const GetConfigurationInput = S.suspend(() =>
  S.Struct({
    ConfigurationId: S.String.pipe(T.HttpLabel("ConfigurationId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/getConfiguration/{ConfigurationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationInput",
}) as any as S.Schema<GetConfigurationInput>;
export interface GetConfigurationManagerInput {
  ManagerArn: string;
}
export const GetConfigurationManagerInput = S.suspend(() =>
  S.Struct({ ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configurationManager/{ManagerArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationManagerInput",
}) as any as S.Schema<GetConfigurationManagerInput>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface Filter {
  Key: string;
  Values: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: FilterValues }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FiltersList = Filter[];
export const FiltersList = S.Array(Filter);
export interface ListConfigurationsInput {
  StartingToken?: string;
  MaxItems?: number;
  Filters?: Filter[];
  ManagerArn?: string;
  ConfigurationDefinitionId?: string;
}
export const ListConfigurationsInput = S.suspend(() =>
  S.Struct({
    StartingToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Filters: S.optional(FiltersList),
    ManagerArn: S.optional(S.String),
    ConfigurationDefinitionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listConfigurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationsInput",
}) as any as S.Schema<ListConfigurationsInput>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export type TagsMap = { [key: string]: string | undefined };
export const TagsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceInput {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagsMap,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateConfigurationManagerInput {
  ManagerArn: string;
  Name?: string;
  Description?: string;
}
export const UpdateConfigurationManagerInput = S.suspend(() =>
  S.Struct({
    ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/configurationManager/{ManagerArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationManagerInput",
}) as any as S.Schema<UpdateConfigurationManagerInput>;
export interface UpdateConfigurationManagerResponse {}
export const UpdateConfigurationManagerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConfigurationManagerResponse",
}) as any as S.Schema<UpdateConfigurationManagerResponse>;
export interface UpdateServiceSettingsInput {
  ExplorerEnablingRoleArn?: string;
}
export const UpdateServiceSettingsInput = S.suspend(() =>
  S.Struct({ ExplorerEnablingRoleArn: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/serviceSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceSettingsInput",
}) as any as S.Schema<UpdateServiceSettingsInput>;
export interface UpdateServiceSettingsResponse {}
export const UpdateServiceSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateServiceSettingsResponse",
}) as any as S.Schema<UpdateServiceSettingsResponse>;
export type ConfigurationParametersMap = { [key: string]: string | undefined };
export const ConfigurationParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ConfigurationDefinitionInput {
  Type: string;
  Parameters: { [key: string]: string | undefined };
  TypeVersion?: string;
  LocalDeploymentExecutionRoleName?: string;
  LocalDeploymentAdministrationRoleArn?: string;
}
export const ConfigurationDefinitionInput = S.suspend(() =>
  S.Struct({
    Type: S.String,
    Parameters: ConfigurationParametersMap,
    TypeVersion: S.optional(S.String),
    LocalDeploymentExecutionRoleName: S.optional(S.String),
    LocalDeploymentAdministrationRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationDefinitionInput",
}) as any as S.Schema<ConfigurationDefinitionInput>;
export type ConfigurationDefinitionsInputList = ConfigurationDefinitionInput[];
export const ConfigurationDefinitionsInputList = S.Array(
  ConfigurationDefinitionInput,
);
export interface ServiceSettings {
  ExplorerEnablingRoleArn?: string;
}
export const ServiceSettings = S.suspend(() =>
  S.Struct({ ExplorerEnablingRoleArn: S.optional(S.String) }),
).annotations({
  identifier: "ServiceSettings",
}) as any as S.Schema<ServiceSettings>;
export interface QuickSetupTypeOutput {
  Type?: string;
  LatestVersion?: string;
}
export const QuickSetupTypeOutput = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), LatestVersion: S.optional(S.String) }),
).annotations({
  identifier: "QuickSetupTypeOutput",
}) as any as S.Schema<QuickSetupTypeOutput>;
export type QuickSetupTypeList = QuickSetupTypeOutput[];
export const QuickSetupTypeList = S.Array(QuickSetupTypeOutput);
export interface CreateConfigurationManagerInput {
  Name?: string;
  Description?: string;
  ConfigurationDefinitions: ConfigurationDefinitionInput[];
  Tags?: { [key: string]: string | undefined };
}
export const CreateConfigurationManagerInput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ConfigurationDefinitions: ConfigurationDefinitionsInputList,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configurationManager" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationManagerInput",
}) as any as S.Schema<CreateConfigurationManagerInput>;
export interface GetServiceSettingsOutput {
  ServiceSettings?: ServiceSettings;
}
export const GetServiceSettingsOutput = S.suspend(() =>
  S.Struct({ ServiceSettings: S.optional(ServiceSettings) }),
).annotations({
  identifier: "GetServiceSettingsOutput",
}) as any as S.Schema<GetServiceSettingsOutput>;
export interface ListConfigurationManagersInput {
  StartingToken?: string;
  MaxItems?: number;
  Filters?: Filter[];
}
export const ListConfigurationManagersInput = S.suspend(() =>
  S.Struct({
    StartingToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    Filters: S.optional(FiltersList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listConfigurationManagers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationManagersInput",
}) as any as S.Schema<ListConfigurationManagersInput>;
export interface ListQuickSetupTypesOutput {
  QuickSetupTypeList?: QuickSetupTypeOutput[];
}
export const ListQuickSetupTypesOutput = S.suspend(() =>
  S.Struct({ QuickSetupTypeList: S.optional(QuickSetupTypeList) }),
).annotations({
  identifier: "ListQuickSetupTypesOutput",
}) as any as S.Schema<ListQuickSetupTypesOutput>;
export interface UpdateConfigurationDefinitionInput {
  ManagerArn: string;
  Id: string;
  TypeVersion?: string;
  Parameters?: { [key: string]: string | undefined };
  LocalDeploymentExecutionRoleName?: string;
  LocalDeploymentAdministrationRoleArn?: string;
}
export const UpdateConfigurationDefinitionInput = S.suspend(() =>
  S.Struct({
    ManagerArn: S.String.pipe(T.HttpLabel("ManagerArn")),
    Id: S.String.pipe(T.HttpLabel("Id")),
    TypeVersion: S.optional(S.String),
    Parameters: S.optional(ConfigurationParametersMap),
    LocalDeploymentExecutionRoleName: S.optional(S.String),
    LocalDeploymentAdministrationRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/configurationDefinition/{ManagerArn}/{Id}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationDefinitionInput",
}) as any as S.Schema<UpdateConfigurationDefinitionInput>;
export interface UpdateConfigurationDefinitionResponse {}
export const UpdateConfigurationDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConfigurationDefinitionResponse",
}) as any as S.Schema<UpdateConfigurationDefinitionResponse>;
export type StatusType = "Deployment" | "AsyncExecutions" | (string & {});
export const StatusType = S.String;
export type Status =
  | "INITIALIZING"
  | "DEPLOYING"
  | "SUCCEEDED"
  | "DELETING"
  | "STOPPING"
  | "FAILED"
  | "STOPPED"
  | "DELETE_FAILED"
  | "STOP_FAILED"
  | "NONE"
  | (string & {});
export const Status = S.String;
export interface ConfigurationDefinition {
  Type: string;
  Parameters: { [key: string]: string | undefined };
  TypeVersion?: string;
  LocalDeploymentExecutionRoleName?: string;
  LocalDeploymentAdministrationRoleArn?: string;
  Id?: string;
}
export const ConfigurationDefinition = S.suspend(() =>
  S.Struct({
    Type: S.String,
    Parameters: ConfigurationParametersMap,
    TypeVersion: S.optional(S.String),
    LocalDeploymentExecutionRoleName: S.optional(S.String),
    LocalDeploymentAdministrationRoleArn: S.optional(S.String),
    Id: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationDefinition",
}) as any as S.Schema<ConfigurationDefinition>;
export type ConfigurationDefinitionsList = ConfigurationDefinition[];
export const ConfigurationDefinitionsList = S.Array(ConfigurationDefinition);
export type StatusDetails = { [key: string]: string | undefined };
export const StatusDetails = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface StatusSummary {
  StatusType: StatusType;
  Status?: Status;
  StatusMessage?: string;
  LastUpdatedAt: Date;
  StatusDetails?: { [key: string]: string | undefined };
}
export const StatusSummary = S.suspend(() =>
  S.Struct({
    StatusType: StatusType,
    Status: S.optional(Status),
    StatusMessage: S.optional(S.String),
    LastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    StatusDetails: S.optional(StatusDetails),
  }),
).annotations({
  identifier: "StatusSummary",
}) as any as S.Schema<StatusSummary>;
export type StatusSummariesList = StatusSummary[];
export const StatusSummariesList = S.Array(StatusSummary);
export interface ConfigurationSummary {
  Id?: string;
  ManagerArn?: string;
  ConfigurationDefinitionId?: string;
  Type?: string;
  TypeVersion?: string;
  Region?: string;
  Account?: string;
  CreatedAt?: Date;
  FirstClassParameters?: { [key: string]: string | undefined };
  StatusSummaries?: StatusSummary[];
}
export const ConfigurationSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ManagerArn: S.optional(S.String),
    ConfigurationDefinitionId: S.optional(S.String),
    Type: S.optional(S.String),
    TypeVersion: S.optional(S.String),
    Region: S.optional(S.String),
    Account: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    FirstClassParameters: S.optional(ConfigurationParametersMap),
    StatusSummaries: S.optional(StatusSummariesList),
  }),
).annotations({
  identifier: "ConfigurationSummary",
}) as any as S.Schema<ConfigurationSummary>;
export type ConfigurationsList = ConfigurationSummary[];
export const ConfigurationsList = S.Array(ConfigurationSummary);
export interface TagEntry {
  Key?: string;
  Value?: string;
}
export const TagEntry = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "TagEntry" }) as any as S.Schema<TagEntry>;
export type Tags = TagEntry[];
export const Tags = S.Array(TagEntry);
export interface CreateConfigurationManagerOutput {
  ManagerArn: string;
}
export const CreateConfigurationManagerOutput = S.suspend(() =>
  S.Struct({ ManagerArn: S.String }),
).annotations({
  identifier: "CreateConfigurationManagerOutput",
}) as any as S.Schema<CreateConfigurationManagerOutput>;
export interface GetConfigurationManagerOutput {
  ManagerArn: string;
  Description?: string;
  Name?: string;
  CreatedAt?: Date;
  LastModifiedAt?: Date;
  StatusSummaries?: StatusSummary[];
  ConfigurationDefinitions?: ConfigurationDefinition[];
  Tags?: { [key: string]: string | undefined };
}
export const GetConfigurationManagerOutput = S.suspend(() =>
  S.Struct({
    ManagerArn: S.String,
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusSummaries: S.optional(StatusSummariesList),
    ConfigurationDefinitions: S.optional(ConfigurationDefinitionsList),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "GetConfigurationManagerOutput",
}) as any as S.Schema<GetConfigurationManagerOutput>;
export interface ListConfigurationsOutput {
  ConfigurationsList?: ConfigurationSummary[];
  NextToken?: string;
}
export const ListConfigurationsOutput = S.suspend(() =>
  S.Struct({
    ConfigurationsList: S.optional(ConfigurationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationsOutput",
}) as any as S.Schema<ListConfigurationsOutput>;
export interface ListTagsForResourceResponse {
  Tags?: TagEntry[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface GetConfigurationOutput {
  Id?: string;
  ManagerArn?: string;
  ConfigurationDefinitionId?: string;
  Type?: string;
  TypeVersion?: string;
  Account?: string;
  Region?: string;
  CreatedAt?: Date;
  LastModifiedAt?: Date;
  StatusSummaries?: StatusSummary[];
  Parameters?: { [key: string]: string | undefined };
}
export const GetConfigurationOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ManagerArn: S.optional(S.String),
    ConfigurationDefinitionId: S.optional(S.String),
    Type: S.optional(S.String),
    TypeVersion: S.optional(S.String),
    Account: S.optional(S.String),
    Region: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusSummaries: S.optional(StatusSummariesList),
    Parameters: S.optional(ConfigurationParametersMap),
  }),
).annotations({
  identifier: "GetConfigurationOutput",
}) as any as S.Schema<GetConfigurationOutput>;
export interface ConfigurationDefinitionSummary {
  Id?: string;
  Type?: string;
  TypeVersion?: string;
  FirstClassParameters?: { [key: string]: string | undefined };
}
export const ConfigurationDefinitionSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(S.String),
    TypeVersion: S.optional(S.String),
    FirstClassParameters: S.optional(ConfigurationParametersMap),
  }),
).annotations({
  identifier: "ConfigurationDefinitionSummary",
}) as any as S.Schema<ConfigurationDefinitionSummary>;
export type ConfigurationDefinitionSummariesList =
  ConfigurationDefinitionSummary[];
export const ConfigurationDefinitionSummariesList = S.Array(
  ConfigurationDefinitionSummary,
);
export interface ConfigurationManagerSummary {
  ManagerArn: string;
  Description?: string;
  Name?: string;
  StatusSummaries?: StatusSummary[];
  ConfigurationDefinitionSummaries?: ConfigurationDefinitionSummary[];
}
export const ConfigurationManagerSummary = S.suspend(() =>
  S.Struct({
    ManagerArn: S.String,
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    StatusSummaries: S.optional(StatusSummariesList),
    ConfigurationDefinitionSummaries: S.optional(
      ConfigurationDefinitionSummariesList,
    ),
  }),
).annotations({
  identifier: "ConfigurationManagerSummary",
}) as any as S.Schema<ConfigurationManagerSummary>;
export type ConfigurationManagerList = ConfigurationManagerSummary[];
export const ConfigurationManagerList = S.Array(ConfigurationManagerSummary);
export interface ListConfigurationManagersOutput {
  ConfigurationManagersList?: ConfigurationManagerSummary[];
  NextToken?: string;
}
export const ListConfigurationManagersOutput = S.suspend(() =>
  S.Struct({
    ConfigurationManagersList: S.optional(ConfigurationManagerList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationManagersOutput",
}) as any as S.Schema<ListConfigurationManagersOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns settings configured for Quick Setup in the requesting Amazon Web Services account and Amazon Web Services Region.
 */
export const getServiceSettings: (
  input: GetServiceSettingsRequest,
) => effect.Effect<
  GetServiceSettingsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
  ],
}));
/**
 * Returns the available Quick Setup types.
 */
export const listQuickSetupTypes: (
  input: ListQuickSetupTypesRequest,
) => effect.Effect<
  ListQuickSetupTypesOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListQuickSetupTypesRequest,
  output: ListQuickSetupTypesOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
  ],
}));
/**
 * Returns details about the specified configuration.
 */
export const getConfiguration: (
  input: GetConfigurationInput,
) => effect.Effect<
  GetConfigurationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationInput,
  output: GetConfigurationOutput,
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
 * Returns a configuration manager.
 */
export const getConfigurationManager: (
  input: GetConfigurationManagerInput,
) => effect.Effect<
  GetConfigurationManagerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationManagerInput,
  output: GetConfigurationManagerOutput,
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
 * Returns configurations deployed by Quick Setup in the requesting Amazon Web Services account and Amazon Web Services Region.
 */
export const listConfigurations: {
  (
    input: ListConfigurationsInput,
  ): effect.Effect<
    ListConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationsInput,
  ) => stream.Stream<
    ListConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationsInput,
  ) => stream.Stream<
    ConfigurationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationsInput,
  output: ListConfigurationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "StartingToken",
    outputToken: "NextToken",
    items: "ConfigurationsList",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns tags assigned to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a Quick Setup configuration definition.
 */
export const updateConfigurationDefinition: (
  input: UpdateConfigurationDefinitionInput,
) => effect.Effect<
  UpdateConfigurationDefinitionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationDefinitionInput,
  output: UpdateConfigurationDefinitionResponse,
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
 * Assigns key-value pairs of metadata to Amazon Web Services resources.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
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
 * Removes tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
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
 * Updates a Quick Setup configuration manager.
 */
export const updateConfigurationManager: (
  input: UpdateConfigurationManagerInput,
) => effect.Effect<
  UpdateConfigurationManagerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationManagerInput,
  output: UpdateConfigurationManagerResponse,
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
 * Updates settings configured for Quick Setup.
 */
export const updateServiceSettings: (
  input: UpdateServiceSettingsInput,
) => effect.Effect<
  UpdateServiceSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSettingsInput,
  output: UpdateServiceSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a Quick Setup configuration manager resource. This object is a collection
 * of desired state configurations for multiple configuration definitions and
 * summaries describing the deployments of those definitions.
 */
export const createConfigurationManager: (
  input: CreateConfigurationManagerInput,
) => effect.Effect<
  CreateConfigurationManagerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationManagerInput,
  output: CreateConfigurationManagerOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a configuration manager.
 */
export const deleteConfigurationManager: (
  input: DeleteConfigurationManagerInput,
) => effect.Effect<
  DeleteConfigurationManagerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationManagerInput,
  output: DeleteConfigurationManagerResponse,
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
 * Returns Quick Setup configuration managers.
 */
export const listConfigurationManagers: {
  (
    input: ListConfigurationManagersInput,
  ): effect.Effect<
    ListConfigurationManagersOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationManagersInput,
  ) => stream.Stream<
    ListConfigurationManagersOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationManagersInput,
  ) => stream.Stream<
    ConfigurationManagerSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationManagersInput,
  output: ListConfigurationManagersOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "StartingToken",
    outputToken: "NextToken",
    items: "ConfigurationManagersList",
    pageSize: "MaxItems",
  } as const,
}));

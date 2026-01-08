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
const ns = T.XmlNamespace(
  "http://elasticbeanstalk.amazonaws.com/docs/2010-12-01/",
);
const svc = T.AwsApiService({
  sdkId: "Elastic Beanstalk",
  serviceShapeName: "AWSElasticBeanstalkService",
});
const auth = T.AwsAuthSigv4({ name: "elasticbeanstalk" });
const ver = T.ServiceVersion("2010-12-01");
const proto = T.AwsProtocolsAwsQuery();
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
              `https://elasticbeanstalk-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://elasticbeanstalk.${Region}.amazonaws.com`);
            }
            return e(
              `https://elasticbeanstalk-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://elasticbeanstalk.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://elasticbeanstalk.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EnvironmentId = string;
export type EnvironmentName = string;
export type OperationsRole = string;
export type DNSCnamePrefix = string;
export type ApplicationName = string;
export type GroupName = string;
export type VersionLabel = string;
export type Description = string;
export type AutoCreateApplication = boolean;
export type ApplicationVersionProccess = boolean;
export type ConfigurationTemplateName = string;
export type SolutionStackName = string;
export type PlatformArn = string;
export type PlatformName = string;
export type PlatformVersion = string;
export type S3Bucket = string;
export type TerminateEnvForce = boolean;
export type DeleteSourceBundle = boolean;
export type MaxRecords = number;
export type Token = string;
export type ManagedActionHistoryMaxItems = number;
export type IncludeDeleted = boolean;
export type IncludeDeletedBackTo = Date;
export type RequestId = string;
export type TimeFilterStart = Date;
export type TimeFilterEnd = Date;
export type NextToken = string;
export type PlatformBranchMaxRecords = number;
export type PlatformMaxRecords = number;
export type ResourceArn = string;
export type TerminateEnvironmentResources = boolean;
export type ForceTerminate = boolean;
export type TagKey = string;
export type TagValue = string;
export type SourceLocation = string;
export type S3Key = string;
export type NonEmptyString = string;
export type BoxedInt = number;
export type ResourceName = string;
export type OptionNamespace = string;
export type ConfigurationOptionName = string;
export type ConfigurationOptionValue = string;
export type FileTypeExtension = string;
export type SearchFilterAttribute = string;
export type SearchFilterOperator = string;
export type SearchFilterValue = string;
export type PlatformFilterType = string;
export type PlatformFilterOperator = string;
export type PlatformFilterValue = string;
export type ExceptionMessage = string;
export type CnameAvailability = boolean;
export type DNSCname = string;
export type Cause = string;
export type RefreshedAt = Date;
export type EndpointURL = string;
export type CreationDate = Date;
export type UpdateDate = Date;
export type AbortableOperationInProgress = boolean;
export type EnvironmentArn = string;
export type PlatformOwner = string;
export type PlatformCategory = string;
export type OperatingSystemName = string;
export type OperatingSystemVersion = string;
export type SupportedTier = string;
export type SupportedAddon = string;
export type PlatformLifecycleState = string;
export type BranchName = string;
export type PlatformBranchLifecycleState = string;
export type ARN = string;
export type ApplicationArn = string;
export type ApplicationVersionArn = string;
export type ConfigurationOptionDefaultValue = string;
export type ConfigurationOptionSeverity = string;
export type UserDefinedOption = boolean;
export type ConfigurationOptionPossibleValue = string;
export type OptionRestrictionMinValue = number;
export type OptionRestrictionMaxValue = number;
export type OptionRestrictionMaxLength = number;
export type RequestCount = number;
export type EventDate = Date;
export type EventMessage = string;
export type InstanceId = string;
export type LaunchedAt = Date;
export type Maintainer = string;
export type Ec2InstanceId = string;
export type SampleTimestamp = Date;
export type Message = string;
export type ValidationMessageString = string;
export type BoxedBoolean = boolean;
export type RegexPattern = string;
export type RegexLabel = string;
export type ResourceId = string;
export type LoadAverageValue = number;
export type DeploymentTimestamp = Date;
export type VirtualizationType = string;
export type ImageId = string;
export type BranchOrder = number;

//# Schemas
export interface CreateStorageLocationRequest {}
export const CreateStorageLocationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateStorageLocationRequest",
}) as any as S.Schema<CreateStorageLocationRequest>;
export interface DescribeAccountAttributesRequest {}
export const DescribeAccountAttributesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountAttributesRequest",
}) as any as S.Schema<DescribeAccountAttributesRequest>;
export interface ListAvailableSolutionStacksRequest {}
export const ListAvailableSolutionStacksRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAvailableSolutionStacksRequest",
}) as any as S.Schema<ListAvailableSolutionStacksRequest>;
export type VersionLabels = string[];
export const VersionLabels = S.Array(S.String);
export type ApplicationNamesList = string[];
export const ApplicationNamesList = S.Array(S.String);
export type VersionLabelsList = string[];
export const VersionLabelsList = S.Array(S.String);
export type EnvironmentHealthAttribute =
  | "Status"
  | "Color"
  | "Causes"
  | "ApplicationMetrics"
  | "InstancesHealth"
  | "All"
  | "HealthStatus"
  | "RefreshedAt";
export const EnvironmentHealthAttribute = S.Literal(
  "Status",
  "Color",
  "Causes",
  "ApplicationMetrics",
  "InstancesHealth",
  "All",
  "HealthStatus",
  "RefreshedAt",
);
export type EnvironmentHealthAttributes = EnvironmentHealthAttribute[];
export const EnvironmentHealthAttributes = S.Array(EnvironmentHealthAttribute);
export type ActionStatus = "Scheduled" | "Pending" | "Running" | "Unknown";
export const ActionStatus = S.Literal(
  "Scheduled",
  "Pending",
  "Running",
  "Unknown",
);
export type EnvironmentIdList = string[];
export const EnvironmentIdList = S.Array(S.String);
export type EnvironmentNamesList = string[];
export const EnvironmentNamesList = S.Array(S.String);
export type EventSeverity =
  | "TRACE"
  | "DEBUG"
  | "INFO"
  | "WARN"
  | "ERROR"
  | "FATAL";
export const EventSeverity = S.Literal(
  "TRACE",
  "DEBUG",
  "INFO",
  "WARN",
  "ERROR",
  "FATAL",
);
export type InstancesHealthAttribute =
  | "HealthStatus"
  | "Color"
  | "Causes"
  | "ApplicationMetrics"
  | "RefreshedAt"
  | "LaunchedAt"
  | "System"
  | "Deployment"
  | "AvailabilityZone"
  | "InstanceType"
  | "All";
export const InstancesHealthAttribute = S.Literal(
  "HealthStatus",
  "Color",
  "Causes",
  "ApplicationMetrics",
  "RefreshedAt",
  "LaunchedAt",
  "System",
  "Deployment",
  "AvailabilityZone",
  "InstanceType",
  "All",
);
export type InstancesHealthAttributes = InstancesHealthAttribute[];
export const InstancesHealthAttributes = S.Array(InstancesHealthAttribute);
export type AvailableSolutionStackNamesList = string[];
export const AvailableSolutionStackNamesList = S.Array(S.String);
export type EnvironmentInfoType = "tail" | "bundle";
export const EnvironmentInfoType = S.Literal("tail", "bundle");
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AbortEnvironmentUpdateMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
}
export const AbortEnvironmentUpdateMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AbortEnvironmentUpdateMessage",
}) as any as S.Schema<AbortEnvironmentUpdateMessage>;
export interface AbortEnvironmentUpdateResponse {}
export const AbortEnvironmentUpdateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AbortEnvironmentUpdateResponse",
}) as any as S.Schema<AbortEnvironmentUpdateResponse>;
export interface ApplyEnvironmentManagedActionRequest {
  EnvironmentName?: string;
  EnvironmentId?: string;
  ActionId: string;
}
export const ApplyEnvironmentManagedActionRequest = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ActionId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ApplyEnvironmentManagedActionRequest",
}) as any as S.Schema<ApplyEnvironmentManagedActionRequest>;
export interface AssociateEnvironmentOperationsRoleMessage {
  EnvironmentName: string;
  OperationsRole: string;
}
export const AssociateEnvironmentOperationsRoleMessage = S.suspend(() =>
  S.Struct({ EnvironmentName: S.String, OperationsRole: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateEnvironmentOperationsRoleMessage",
}) as any as S.Schema<AssociateEnvironmentOperationsRoleMessage>;
export interface AssociateEnvironmentOperationsRoleResponse {}
export const AssociateEnvironmentOperationsRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateEnvironmentOperationsRoleResponse",
}) as any as S.Schema<AssociateEnvironmentOperationsRoleResponse>;
export interface CheckDNSAvailabilityMessage {
  CNAMEPrefix: string;
}
export const CheckDNSAvailabilityMessage = S.suspend(() =>
  S.Struct({ CNAMEPrefix: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckDNSAvailabilityMessage",
}) as any as S.Schema<CheckDNSAvailabilityMessage>;
export interface ComposeEnvironmentsMessage {
  ApplicationName?: string;
  GroupName?: string;
  VersionLabels?: string[];
}
export const ComposeEnvironmentsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    GroupName: S.optional(S.String),
    VersionLabels: S.optional(VersionLabels),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ComposeEnvironmentsMessage",
}) as any as S.Schema<ComposeEnvironmentsMessage>;
export interface S3Location {
  S3Bucket?: string;
  S3Key?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ S3Bucket: S.optional(S.String), S3Key: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface ConfigurationOptionSetting {
  ResourceName?: string;
  Namespace?: string;
  OptionName?: string;
  Value?: string;
}
export const ConfigurationOptionSetting = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    Namespace: S.optional(S.String),
    OptionName: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationOptionSetting",
}) as any as S.Schema<ConfigurationOptionSetting>;
export type ConfigurationOptionSettingsList = ConfigurationOptionSetting[];
export const ConfigurationOptionSettingsList = S.Array(
  ConfigurationOptionSetting,
);
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreatePlatformVersionRequest {
  PlatformName: string;
  PlatformVersion: string;
  PlatformDefinitionBundle: S3Location;
  EnvironmentName?: string;
  OptionSettings?: ConfigurationOptionSetting[];
  Tags?: Tag[];
}
export const CreatePlatformVersionRequest = S.suspend(() =>
  S.Struct({
    PlatformName: S.String,
    PlatformVersion: S.String,
    PlatformDefinitionBundle: S3Location,
    EnvironmentName: S.optional(S.String),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePlatformVersionRequest",
}) as any as S.Schema<CreatePlatformVersionRequest>;
export interface CreateStorageLocationResultMessage {
  S3Bucket?: string;
}
export const CreateStorageLocationResultMessage = S.suspend(() =>
  S.Struct({ S3Bucket: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateStorageLocationResultMessage",
}) as any as S.Schema<CreateStorageLocationResultMessage>;
export interface DeleteApplicationMessage {
  ApplicationName: string;
  TerminateEnvByForce?: boolean;
}
export const DeleteApplicationMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    TerminateEnvByForce: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationMessage",
}) as any as S.Schema<DeleteApplicationMessage>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteApplicationVersionMessage {
  ApplicationName: string;
  VersionLabel: string;
  DeleteSourceBundle?: boolean;
}
export const DeleteApplicationVersionMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    VersionLabel: S.String,
    DeleteSourceBundle: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationVersionMessage",
}) as any as S.Schema<DeleteApplicationVersionMessage>;
export interface DeleteApplicationVersionResponse {}
export const DeleteApplicationVersionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationVersionResponse",
}) as any as S.Schema<DeleteApplicationVersionResponse>;
export interface DeleteConfigurationTemplateMessage {
  ApplicationName: string;
  TemplateName: string;
}
export const DeleteConfigurationTemplateMessage = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, TemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationTemplateMessage",
}) as any as S.Schema<DeleteConfigurationTemplateMessage>;
export interface DeleteConfigurationTemplateResponse {}
export const DeleteConfigurationTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationTemplateResponse",
}) as any as S.Schema<DeleteConfigurationTemplateResponse>;
export interface DeleteEnvironmentConfigurationMessage {
  ApplicationName: string;
  EnvironmentName: string;
}
export const DeleteEnvironmentConfigurationMessage = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, EnvironmentName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentConfigurationMessage",
}) as any as S.Schema<DeleteEnvironmentConfigurationMessage>;
export interface DeleteEnvironmentConfigurationResponse {}
export const DeleteEnvironmentConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEnvironmentConfigurationResponse",
}) as any as S.Schema<DeleteEnvironmentConfigurationResponse>;
export interface DeletePlatformVersionRequest {
  PlatformArn?: string;
}
export const DeletePlatformVersionRequest = S.suspend(() =>
  S.Struct({ PlatformArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePlatformVersionRequest",
}) as any as S.Schema<DeletePlatformVersionRequest>;
export interface DescribeApplicationsMessage {
  ApplicationNames?: string[];
}
export const DescribeApplicationsMessage = S.suspend(() =>
  S.Struct({ ApplicationNames: S.optional(ApplicationNamesList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeApplicationsMessage",
}) as any as S.Schema<DescribeApplicationsMessage>;
export interface DescribeApplicationVersionsMessage {
  ApplicationName?: string;
  VersionLabels?: string[];
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeApplicationVersionsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    VersionLabels: S.optional(VersionLabelsList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeApplicationVersionsMessage",
}) as any as S.Schema<DescribeApplicationVersionsMessage>;
export interface OptionSpecification {
  ResourceName?: string;
  Namespace?: string;
  OptionName?: string;
}
export const OptionSpecification = S.suspend(() =>
  S.Struct({
    ResourceName: S.optional(S.String),
    Namespace: S.optional(S.String),
    OptionName: S.optional(S.String),
  }),
).annotations({
  identifier: "OptionSpecification",
}) as any as S.Schema<OptionSpecification>;
export type OptionsSpecifierList = OptionSpecification[];
export const OptionsSpecifierList = S.Array(OptionSpecification);
export interface DescribeConfigurationOptionsMessage {
  ApplicationName?: string;
  TemplateName?: string;
  EnvironmentName?: string;
  SolutionStackName?: string;
  PlatformArn?: string;
  Options?: OptionSpecification[];
}
export const DescribeConfigurationOptionsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    TemplateName: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    Options: S.optional(OptionsSpecifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationOptionsMessage",
}) as any as S.Schema<DescribeConfigurationOptionsMessage>;
export interface DescribeConfigurationSettingsMessage {
  ApplicationName: string;
  TemplateName?: string;
  EnvironmentName?: string;
}
export const DescribeConfigurationSettingsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    TemplateName: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationSettingsMessage",
}) as any as S.Schema<DescribeConfigurationSettingsMessage>;
export interface DescribeEnvironmentHealthRequest {
  EnvironmentName?: string;
  EnvironmentId?: string;
  AttributeNames?: EnvironmentHealthAttribute[];
}
export const DescribeEnvironmentHealthRequest = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    AttributeNames: S.optional(EnvironmentHealthAttributes),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEnvironmentHealthRequest",
}) as any as S.Schema<DescribeEnvironmentHealthRequest>;
export interface DescribeEnvironmentManagedActionHistoryRequest {
  EnvironmentId?: string;
  EnvironmentName?: string;
  NextToken?: string;
  MaxItems?: number;
}
export const DescribeEnvironmentManagedActionHistoryRequest = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEnvironmentManagedActionHistoryRequest",
}) as any as S.Schema<DescribeEnvironmentManagedActionHistoryRequest>;
export interface DescribeEnvironmentManagedActionsRequest {
  EnvironmentName?: string;
  EnvironmentId?: string;
  Status?: ActionStatus;
}
export const DescribeEnvironmentManagedActionsRequest = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    Status: S.optional(ActionStatus),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEnvironmentManagedActionsRequest",
}) as any as S.Schema<DescribeEnvironmentManagedActionsRequest>;
export interface DescribeEnvironmentResourcesMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
}
export const DescribeEnvironmentResourcesMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEnvironmentResourcesMessage",
}) as any as S.Schema<DescribeEnvironmentResourcesMessage>;
export interface DescribeEnvironmentsMessage {
  ApplicationName?: string;
  VersionLabel?: string;
  EnvironmentIds?: string[];
  EnvironmentNames?: string[];
  IncludeDeleted?: boolean;
  IncludedDeletedBackTo?: Date;
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeEnvironmentsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    VersionLabel: S.optional(S.String),
    EnvironmentIds: S.optional(EnvironmentIdList),
    EnvironmentNames: S.optional(EnvironmentNamesList),
    IncludeDeleted: S.optional(S.Boolean),
    IncludedDeletedBackTo: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEnvironmentsMessage",
}) as any as S.Schema<DescribeEnvironmentsMessage>;
export interface DescribeEventsMessage {
  ApplicationName?: string;
  VersionLabel?: string;
  TemplateName?: string;
  EnvironmentId?: string;
  EnvironmentName?: string;
  PlatformArn?: string;
  RequestId?: string;
  Severity?: EventSeverity;
  StartTime?: Date;
  EndTime?: Date;
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeEventsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    VersionLabel: S.optional(S.String),
    TemplateName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    RequestId: S.optional(S.String),
    Severity: S.optional(EventSeverity),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventsMessage",
}) as any as S.Schema<DescribeEventsMessage>;
export interface DescribeInstancesHealthRequest {
  EnvironmentName?: string;
  EnvironmentId?: string;
  AttributeNames?: InstancesHealthAttribute[];
  NextToken?: string;
}
export const DescribeInstancesHealthRequest = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    AttributeNames: S.optional(InstancesHealthAttributes),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstancesHealthRequest",
}) as any as S.Schema<DescribeInstancesHealthRequest>;
export interface DescribePlatformVersionRequest {
  PlatformArn?: string;
}
export const DescribePlatformVersionRequest = S.suspend(() =>
  S.Struct({ PlatformArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePlatformVersionRequest",
}) as any as S.Schema<DescribePlatformVersionRequest>;
export interface DisassociateEnvironmentOperationsRoleMessage {
  EnvironmentName: string;
}
export const DisassociateEnvironmentOperationsRoleMessage = S.suspend(() =>
  S.Struct({ EnvironmentName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateEnvironmentOperationsRoleMessage",
}) as any as S.Schema<DisassociateEnvironmentOperationsRoleMessage>;
export interface DisassociateEnvironmentOperationsRoleResponse {}
export const DisassociateEnvironmentOperationsRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateEnvironmentOperationsRoleResponse",
}) as any as S.Schema<DisassociateEnvironmentOperationsRoleResponse>;
export interface ListTagsForResourceMessage {
  ResourceArn: string;
}
export const ListTagsForResourceMessage = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceMessage",
}) as any as S.Schema<ListTagsForResourceMessage>;
export interface RebuildEnvironmentMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
}
export const RebuildEnvironmentMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebuildEnvironmentMessage",
}) as any as S.Schema<RebuildEnvironmentMessage>;
export interface RebuildEnvironmentResponse {}
export const RebuildEnvironmentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RebuildEnvironmentResponse",
}) as any as S.Schema<RebuildEnvironmentResponse>;
export interface RequestEnvironmentInfoMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
  InfoType: EnvironmentInfoType;
}
export const RequestEnvironmentInfoMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    InfoType: EnvironmentInfoType,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RequestEnvironmentInfoMessage",
}) as any as S.Schema<RequestEnvironmentInfoMessage>;
export interface RequestEnvironmentInfoResponse {}
export const RequestEnvironmentInfoResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RequestEnvironmentInfoResponse",
}) as any as S.Schema<RequestEnvironmentInfoResponse>;
export interface RestartAppServerMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
}
export const RestartAppServerMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestartAppServerMessage",
}) as any as S.Schema<RestartAppServerMessage>;
export interface RestartAppServerResponse {}
export const RestartAppServerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RestartAppServerResponse",
}) as any as S.Schema<RestartAppServerResponse>;
export interface RetrieveEnvironmentInfoMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
  InfoType: EnvironmentInfoType;
}
export const RetrieveEnvironmentInfoMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    InfoType: EnvironmentInfoType,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetrieveEnvironmentInfoMessage",
}) as any as S.Schema<RetrieveEnvironmentInfoMessage>;
export interface SwapEnvironmentCNAMEsMessage {
  SourceEnvironmentId?: string;
  SourceEnvironmentName?: string;
  DestinationEnvironmentId?: string;
  DestinationEnvironmentName?: string;
}
export const SwapEnvironmentCNAMEsMessage = S.suspend(() =>
  S.Struct({
    SourceEnvironmentId: S.optional(S.String),
    SourceEnvironmentName: S.optional(S.String),
    DestinationEnvironmentId: S.optional(S.String),
    DestinationEnvironmentName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SwapEnvironmentCNAMEsMessage",
}) as any as S.Schema<SwapEnvironmentCNAMEsMessage>;
export interface SwapEnvironmentCNAMEsResponse {}
export const SwapEnvironmentCNAMEsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SwapEnvironmentCNAMEsResponse",
}) as any as S.Schema<SwapEnvironmentCNAMEsResponse>;
export interface TerminateEnvironmentMessage {
  EnvironmentId?: string;
  EnvironmentName?: string;
  TerminateResources?: boolean;
  ForceTerminate?: boolean;
}
export const TerminateEnvironmentMessage = S.suspend(() =>
  S.Struct({
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    TerminateResources: S.optional(S.Boolean),
    ForceTerminate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateEnvironmentMessage",
}) as any as S.Schema<TerminateEnvironmentMessage>;
export interface UpdateApplicationMessage {
  ApplicationName: string;
  Description?: string;
}
export const UpdateApplicationMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationMessage",
}) as any as S.Schema<UpdateApplicationMessage>;
export interface MaxCountRule {
  Enabled: boolean;
  MaxCount?: number;
  DeleteSourceFromS3?: boolean;
}
export const MaxCountRule = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    MaxCount: S.optional(S.Number),
    DeleteSourceFromS3: S.optional(S.Boolean),
  }),
).annotations({ identifier: "MaxCountRule" }) as any as S.Schema<MaxCountRule>;
export interface MaxAgeRule {
  Enabled: boolean;
  MaxAgeInDays?: number;
  DeleteSourceFromS3?: boolean;
}
export const MaxAgeRule = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    MaxAgeInDays: S.optional(S.Number),
    DeleteSourceFromS3: S.optional(S.Boolean),
  }),
).annotations({ identifier: "MaxAgeRule" }) as any as S.Schema<MaxAgeRule>;
export interface ApplicationVersionLifecycleConfig {
  MaxCountRule?: MaxCountRule;
  MaxAgeRule?: MaxAgeRule;
}
export const ApplicationVersionLifecycleConfig = S.suspend(() =>
  S.Struct({
    MaxCountRule: S.optional(MaxCountRule),
    MaxAgeRule: S.optional(MaxAgeRule),
  }),
).annotations({
  identifier: "ApplicationVersionLifecycleConfig",
}) as any as S.Schema<ApplicationVersionLifecycleConfig>;
export interface ApplicationResourceLifecycleConfig {
  ServiceRole?: string;
  VersionLifecycleConfig?: ApplicationVersionLifecycleConfig;
}
export const ApplicationResourceLifecycleConfig = S.suspend(() =>
  S.Struct({
    ServiceRole: S.optional(S.String),
    VersionLifecycleConfig: S.optional(ApplicationVersionLifecycleConfig),
  }),
).annotations({
  identifier: "ApplicationResourceLifecycleConfig",
}) as any as S.Schema<ApplicationResourceLifecycleConfig>;
export interface UpdateApplicationResourceLifecycleMessage {
  ApplicationName: string;
  ResourceLifecycleConfig: ApplicationResourceLifecycleConfig;
}
export const UpdateApplicationResourceLifecycleMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ResourceLifecycleConfig: ApplicationResourceLifecycleConfig,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationResourceLifecycleMessage",
}) as any as S.Schema<UpdateApplicationResourceLifecycleMessage>;
export interface UpdateApplicationVersionMessage {
  ApplicationName: string;
  VersionLabel: string;
  Description?: string;
}
export const UpdateApplicationVersionMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    VersionLabel: S.String,
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationVersionMessage",
}) as any as S.Schema<UpdateApplicationVersionMessage>;
export interface UpdateConfigurationTemplateMessage {
  ApplicationName: string;
  TemplateName: string;
  Description?: string;
  OptionSettings?: ConfigurationOptionSetting[];
  OptionsToRemove?: OptionSpecification[];
}
export const UpdateConfigurationTemplateMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    TemplateName: S.String,
    Description: S.optional(S.String),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
    OptionsToRemove: S.optional(OptionsSpecifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationTemplateMessage",
}) as any as S.Schema<UpdateConfigurationTemplateMessage>;
export interface EnvironmentTier {
  Name?: string;
  Type?: string;
  Version?: string;
}
export const EnvironmentTier = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentTier",
}) as any as S.Schema<EnvironmentTier>;
export interface UpdateEnvironmentMessage {
  ApplicationName?: string;
  EnvironmentId?: string;
  EnvironmentName?: string;
  GroupName?: string;
  Description?: string;
  Tier?: EnvironmentTier;
  VersionLabel?: string;
  TemplateName?: string;
  SolutionStackName?: string;
  PlatformArn?: string;
  OptionSettings?: ConfigurationOptionSetting[];
  OptionsToRemove?: OptionSpecification[];
}
export const UpdateEnvironmentMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    GroupName: S.optional(S.String),
    Description: S.optional(S.String),
    Tier: S.optional(EnvironmentTier),
    VersionLabel: S.optional(S.String),
    TemplateName: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
    OptionsToRemove: S.optional(OptionsSpecifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentMessage",
}) as any as S.Schema<UpdateEnvironmentMessage>;
export interface UpdateTagsForResourceMessage {
  ResourceArn: string;
  TagsToAdd?: Tag[];
  TagsToRemove?: string[];
}
export const UpdateTagsForResourceMessage = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    TagsToAdd: S.optional(TagList),
    TagsToRemove: S.optional(TagKeyList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTagsForResourceMessage",
}) as any as S.Schema<UpdateTagsForResourceMessage>;
export interface UpdateTagsForResourceResponse {}
export const UpdateTagsForResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateTagsForResourceResponse",
}) as any as S.Schema<UpdateTagsForResourceResponse>;
export interface ValidateConfigurationSettingsMessage {
  ApplicationName: string;
  TemplateName?: string;
  EnvironmentName?: string;
  OptionSettings: ConfigurationOptionSetting[];
}
export const ValidateConfigurationSettingsMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    TemplateName: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    OptionSettings: ConfigurationOptionSettingsList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateConfigurationSettingsMessage",
}) as any as S.Schema<ValidateConfigurationSettingsMessage>;
export type SourceType = "Git" | "Zip";
export const SourceType = S.Literal("Git", "Zip");
export type SourceRepository = "CodeCommit" | "S3";
export const SourceRepository = S.Literal("CodeCommit", "S3");
export type ComputeType =
  | "BUILD_GENERAL1_SMALL"
  | "BUILD_GENERAL1_MEDIUM"
  | "BUILD_GENERAL1_LARGE";
export const ComputeType = S.Literal(
  "BUILD_GENERAL1_SMALL",
  "BUILD_GENERAL1_MEDIUM",
  "BUILD_GENERAL1_LARGE",
);
export type SolutionStackFileTypeList = string[];
export const SolutionStackFileTypeList = S.Array(S.String);
export type SearchFilterValues = string[];
export const SearchFilterValues = S.Array(S.String);
export type PlatformFilterValueList = string[];
export const PlatformFilterValueList = S.Array(S.String);
export type ActionType = "InstanceRefresh" | "PlatformUpdate" | "Unknown";
export const ActionType = S.Literal(
  "InstanceRefresh",
  "PlatformUpdate",
  "Unknown",
);
export type EnvironmentStatus =
  | "Aborting"
  | "Launching"
  | "Updating"
  | "LinkingFrom"
  | "LinkingTo"
  | "Ready"
  | "Terminating"
  | "Terminated";
export const EnvironmentStatus = S.Literal(
  "Aborting",
  "Launching",
  "Updating",
  "LinkingFrom",
  "LinkingTo",
  "Ready",
  "Terminating",
  "Terminated",
);
export type EnvironmentHealth = "Green" | "Yellow" | "Red" | "Grey";
export const EnvironmentHealth = S.Literal("Green", "Yellow", "Red", "Grey");
export type EnvironmentHealthStatus =
  | "NoData"
  | "Unknown"
  | "Pending"
  | "Ok"
  | "Info"
  | "Warning"
  | "Degraded"
  | "Severe"
  | "Suspended";
export const EnvironmentHealthStatus = S.Literal(
  "NoData",
  "Unknown",
  "Pending",
  "Ok",
  "Info",
  "Warning",
  "Degraded",
  "Severe",
  "Suspended",
);
export interface Listener {
  Protocol?: string;
  Port?: number;
}
export const Listener = S.suspend(() =>
  S.Struct({ Protocol: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({ identifier: "Listener" }) as any as S.Schema<Listener>;
export type LoadBalancerListenersDescription = Listener[];
export const LoadBalancerListenersDescription = S.Array(Listener);
export interface LoadBalancerDescription {
  LoadBalancerName?: string;
  Domain?: string;
  Listeners?: Listener[];
}
export const LoadBalancerDescription = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    Domain: S.optional(S.String),
    Listeners: S.optional(LoadBalancerListenersDescription),
  }),
).annotations({
  identifier: "LoadBalancerDescription",
}) as any as S.Schema<LoadBalancerDescription>;
export interface EnvironmentResourcesDescription {
  LoadBalancer?: LoadBalancerDescription;
}
export const EnvironmentResourcesDescription = S.suspend(() =>
  S.Struct({ LoadBalancer: S.optional(LoadBalancerDescription) }),
).annotations({
  identifier: "EnvironmentResourcesDescription",
}) as any as S.Schema<EnvironmentResourcesDescription>;
export interface EnvironmentLink {
  LinkName?: string;
  EnvironmentName?: string;
}
export const EnvironmentLink = S.suspend(() =>
  S.Struct({
    LinkName: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentLink",
}) as any as S.Schema<EnvironmentLink>;
export type EnvironmentLinks = EnvironmentLink[];
export const EnvironmentLinks = S.Array(EnvironmentLink);
export interface EnvironmentDescription {
  EnvironmentName?: string;
  EnvironmentId?: string;
  ApplicationName?: string;
  VersionLabel?: string;
  SolutionStackName?: string;
  PlatformArn?: string;
  TemplateName?: string;
  Description?: string;
  EndpointURL?: string;
  CNAME?: string;
  DateCreated?: Date;
  DateUpdated?: Date;
  Status?: EnvironmentStatus;
  AbortableOperationInProgress?: boolean;
  Health?: EnvironmentHealth;
  HealthStatus?: EnvironmentHealthStatus;
  Resources?: EnvironmentResourcesDescription;
  Tier?: EnvironmentTier;
  EnvironmentLinks?: EnvironmentLink[];
  EnvironmentArn?: string;
  OperationsRole?: string;
}
export const EnvironmentDescription = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    EnvironmentId: S.optional(S.String),
    ApplicationName: S.optional(S.String),
    VersionLabel: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    TemplateName: S.optional(S.String),
    Description: S.optional(S.String),
    EndpointURL: S.optional(S.String),
    CNAME: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(EnvironmentStatus),
    AbortableOperationInProgress: S.optional(S.Boolean),
    Health: S.optional(EnvironmentHealth),
    HealthStatus: S.optional(EnvironmentHealthStatus),
    Resources: S.optional(EnvironmentResourcesDescription),
    Tier: S.optional(EnvironmentTier),
    EnvironmentLinks: S.optional(EnvironmentLinks),
    EnvironmentArn: S.optional(S.String),
    OperationsRole: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EnvironmentDescription",
}) as any as S.Schema<EnvironmentDescription>;
export type EnvironmentDescriptionsList = EnvironmentDescription[];
export const EnvironmentDescriptionsList = S.Array(EnvironmentDescription);
export interface SourceBuildInformation {
  SourceType: SourceType;
  SourceRepository: SourceRepository;
  SourceLocation: string;
}
export const SourceBuildInformation = S.suspend(() =>
  S.Struct({
    SourceType: SourceType,
    SourceRepository: SourceRepository,
    SourceLocation: S.String,
  }),
).annotations({
  identifier: "SourceBuildInformation",
}) as any as S.Schema<SourceBuildInformation>;
export interface BuildConfiguration {
  ArtifactName?: string;
  CodeBuildServiceRole: string;
  ComputeType?: ComputeType;
  Image: string;
  TimeoutInMinutes?: number;
}
export const BuildConfiguration = S.suspend(() =>
  S.Struct({
    ArtifactName: S.optional(S.String),
    CodeBuildServiceRole: S.String,
    ComputeType: S.optional(ComputeType),
    Image: S.String,
    TimeoutInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "BuildConfiguration",
}) as any as S.Schema<BuildConfiguration>;
export interface SourceConfiguration {
  ApplicationName?: string;
  TemplateName?: string;
}
export const SourceConfiguration = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    TemplateName: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceConfiguration",
}) as any as S.Schema<SourceConfiguration>;
export type ConfigurationDeploymentStatus = "deployed" | "pending" | "failed";
export const ConfigurationDeploymentStatus = S.Literal(
  "deployed",
  "pending",
  "failed",
);
export interface ConfigurationSettingsDescription {
  SolutionStackName?: string;
  PlatformArn?: string;
  ApplicationName?: string;
  TemplateName?: string;
  Description?: string;
  EnvironmentName?: string;
  DeploymentStatus?: ConfigurationDeploymentStatus;
  DateCreated?: Date;
  DateUpdated?: Date;
  OptionSettings?: ConfigurationOptionSetting[];
}
export const ConfigurationSettingsDescription = S.suspend(() =>
  S.Struct({
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    ApplicationName: S.optional(S.String),
    TemplateName: S.optional(S.String),
    Description: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    DeploymentStatus: S.optional(ConfigurationDeploymentStatus),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
  }).pipe(ns),
).annotations({
  identifier: "ConfigurationSettingsDescription",
}) as any as S.Schema<ConfigurationSettingsDescription>;
export type ConfigurationSettingsDescriptionList =
  ConfigurationSettingsDescription[];
export const ConfigurationSettingsDescriptionList = S.Array(
  ConfigurationSettingsDescription,
);
export type Causes = string[];
export const Causes = S.Array(S.String);
export interface SolutionStackDescription {
  SolutionStackName?: string;
  PermittedFileTypes?: string[];
}
export const SolutionStackDescription = S.suspend(() =>
  S.Struct({
    SolutionStackName: S.optional(S.String),
    PermittedFileTypes: S.optional(SolutionStackFileTypeList),
  }),
).annotations({
  identifier: "SolutionStackDescription",
}) as any as S.Schema<SolutionStackDescription>;
export type AvailableSolutionStackDetailsList = SolutionStackDescription[];
export const AvailableSolutionStackDetailsList = S.Array(
  SolutionStackDescription,
);
export interface SearchFilter {
  Attribute?: string;
  Operator?: string;
  Values?: string[];
}
export const SearchFilter = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(S.String),
    Operator: S.optional(S.String),
    Values: S.optional(SearchFilterValues),
  }),
).annotations({ identifier: "SearchFilter" }) as any as S.Schema<SearchFilter>;
export type SearchFilters = SearchFilter[];
export const SearchFilters = S.Array(SearchFilter);
export interface PlatformFilter {
  Type?: string;
  Operator?: string;
  Values?: string[];
}
export const PlatformFilter = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Operator: S.optional(S.String),
    Values: S.optional(PlatformFilterValueList),
  }),
).annotations({
  identifier: "PlatformFilter",
}) as any as S.Schema<PlatformFilter>;
export type PlatformFilters = PlatformFilter[];
export const PlatformFilters = S.Array(PlatformFilter);
export interface ApplyEnvironmentManagedActionResult {
  ActionId?: string;
  ActionDescription?: string;
  ActionType?: ActionType;
  Status?: string;
}
export const ApplyEnvironmentManagedActionResult = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    ActionDescription: S.optional(S.String),
    ActionType: S.optional(ActionType),
    Status: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ApplyEnvironmentManagedActionResult",
}) as any as S.Schema<ApplyEnvironmentManagedActionResult>;
export interface CheckDNSAvailabilityResultMessage {
  Available?: boolean;
  FullyQualifiedCNAME?: string;
}
export const CheckDNSAvailabilityResultMessage = S.suspend(() =>
  S.Struct({
    Available: S.optional(S.Boolean),
    FullyQualifiedCNAME: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CheckDNSAvailabilityResultMessage",
}) as any as S.Schema<CheckDNSAvailabilityResultMessage>;
export interface EnvironmentDescriptionsMessage {
  Environments?: EnvironmentDescription[];
  NextToken?: string;
}
export const EnvironmentDescriptionsMessage = S.suspend(() =>
  S.Struct({
    Environments: S.optional(EnvironmentDescriptionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EnvironmentDescriptionsMessage",
}) as any as S.Schema<EnvironmentDescriptionsMessage>;
export interface CreateApplicationVersionMessage {
  ApplicationName: string;
  VersionLabel: string;
  Description?: string;
  SourceBuildInformation?: SourceBuildInformation;
  SourceBundle?: S3Location;
  BuildConfiguration?: BuildConfiguration;
  AutoCreateApplication?: boolean;
  Process?: boolean;
  Tags?: Tag[];
}
export const CreateApplicationVersionMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    VersionLabel: S.String,
    Description: S.optional(S.String),
    SourceBuildInformation: S.optional(SourceBuildInformation),
    SourceBundle: S.optional(S3Location),
    BuildConfiguration: S.optional(BuildConfiguration),
    AutoCreateApplication: S.optional(S.Boolean),
    Process: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationVersionMessage",
}) as any as S.Schema<CreateApplicationVersionMessage>;
export interface CreateConfigurationTemplateMessage {
  ApplicationName: string;
  TemplateName: string;
  SolutionStackName?: string;
  PlatformArn?: string;
  SourceConfiguration?: SourceConfiguration;
  EnvironmentId?: string;
  Description?: string;
  OptionSettings?: ConfigurationOptionSetting[];
  Tags?: Tag[];
}
export const CreateConfigurationTemplateMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    TemplateName: S.String,
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    SourceConfiguration: S.optional(SourceConfiguration),
    EnvironmentId: S.optional(S.String),
    Description: S.optional(S.String),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationTemplateMessage",
}) as any as S.Schema<CreateConfigurationTemplateMessage>;
export interface CreateEnvironmentMessage {
  ApplicationName: string;
  EnvironmentName?: string;
  GroupName?: string;
  Description?: string;
  CNAMEPrefix?: string;
  Tier?: EnvironmentTier;
  Tags?: Tag[];
  VersionLabel?: string;
  TemplateName?: string;
  SolutionStackName?: string;
  PlatformArn?: string;
  OptionSettings?: ConfigurationOptionSetting[];
  OptionsToRemove?: OptionSpecification[];
  OperationsRole?: string;
}
export const CreateEnvironmentMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    EnvironmentName: S.optional(S.String),
    GroupName: S.optional(S.String),
    Description: S.optional(S.String),
    CNAMEPrefix: S.optional(S.String),
    Tier: S.optional(EnvironmentTier),
    Tags: S.optional(Tags),
    VersionLabel: S.optional(S.String),
    TemplateName: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    OptionSettings: S.optional(ConfigurationOptionSettingsList),
    OptionsToRemove: S.optional(OptionsSpecifierList),
    OperationsRole: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentMessage",
}) as any as S.Schema<CreateEnvironmentMessage>;
export type PlatformStatus =
  | "Creating"
  | "Failed"
  | "Ready"
  | "Deleting"
  | "Deleted";
export const PlatformStatus = S.Literal(
  "Creating",
  "Failed",
  "Ready",
  "Deleting",
  "Deleted",
);
export type SupportedTierList = string[];
export const SupportedTierList = S.Array(S.String);
export type SupportedAddonList = string[];
export const SupportedAddonList = S.Array(S.String);
export interface PlatformSummary {
  PlatformArn?: string;
  PlatformOwner?: string;
  PlatformStatus?: PlatformStatus;
  PlatformCategory?: string;
  OperatingSystemName?: string;
  OperatingSystemVersion?: string;
  SupportedTierList?: string[];
  SupportedAddonList?: string[];
  PlatformLifecycleState?: string;
  PlatformVersion?: string;
  PlatformBranchName?: string;
  PlatformBranchLifecycleState?: string;
}
export const PlatformSummary = S.suspend(() =>
  S.Struct({
    PlatformArn: S.optional(S.String),
    PlatformOwner: S.optional(S.String),
    PlatformStatus: S.optional(PlatformStatus),
    PlatformCategory: S.optional(S.String),
    OperatingSystemName: S.optional(S.String),
    OperatingSystemVersion: S.optional(S.String),
    SupportedTierList: S.optional(SupportedTierList),
    SupportedAddonList: S.optional(SupportedAddonList),
    PlatformLifecycleState: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    PlatformBranchName: S.optional(S.String),
    PlatformBranchLifecycleState: S.optional(S.String),
  }),
).annotations({
  identifier: "PlatformSummary",
}) as any as S.Schema<PlatformSummary>;
export interface DeletePlatformVersionResult {
  PlatformSummary?: PlatformSummary;
}
export const DeletePlatformVersionResult = S.suspend(() =>
  S.Struct({ PlatformSummary: S.optional(PlatformSummary) }).pipe(ns),
).annotations({
  identifier: "DeletePlatformVersionResult",
}) as any as S.Schema<DeletePlatformVersionResult>;
export interface ConfigurationSettingsDescriptions {
  ConfigurationSettings?: ConfigurationSettingsDescription[];
}
export const ConfigurationSettingsDescriptions = S.suspend(() =>
  S.Struct({
    ConfigurationSettings: S.optional(ConfigurationSettingsDescriptionList),
  }).pipe(ns),
).annotations({
  identifier: "ConfigurationSettingsDescriptions",
}) as any as S.Schema<ConfigurationSettingsDescriptions>;
export interface ListAvailableSolutionStacksResultMessage {
  SolutionStacks?: string[];
  SolutionStackDetails?: SolutionStackDescription[];
}
export const ListAvailableSolutionStacksResultMessage = S.suspend(() =>
  S.Struct({
    SolutionStacks: S.optional(AvailableSolutionStackNamesList),
    SolutionStackDetails: S.optional(AvailableSolutionStackDetailsList),
  }).pipe(ns),
).annotations({
  identifier: "ListAvailableSolutionStacksResultMessage",
}) as any as S.Schema<ListAvailableSolutionStacksResultMessage>;
export interface ListPlatformBranchesRequest {
  Filters?: SearchFilter[];
  MaxRecords?: number;
  NextToken?: string;
}
export const ListPlatformBranchesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(SearchFilters),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlatformBranchesRequest",
}) as any as S.Schema<ListPlatformBranchesRequest>;
export interface ListPlatformVersionsRequest {
  Filters?: PlatformFilter[];
  MaxRecords?: number;
  NextToken?: string;
}
export const ListPlatformVersionsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(PlatformFilters),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlatformVersionsRequest",
}) as any as S.Schema<ListPlatformVersionsRequest>;
export interface ResourceTagsDescriptionMessage {
  ResourceArn?: string;
  ResourceTags?: Tag[];
}
export const ResourceTagsDescriptionMessage = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourceTags: S.optional(TagList),
  }).pipe(ns),
).annotations({
  identifier: "ResourceTagsDescriptionMessage",
}) as any as S.Schema<ResourceTagsDescriptionMessage>;
export type ConfigurationTemplateNamesList = string[];
export const ConfigurationTemplateNamesList = S.Array(S.String);
export interface ApplicationDescription {
  ApplicationArn?: string;
  ApplicationName?: string;
  Description?: string;
  DateCreated?: Date;
  DateUpdated?: Date;
  Versions?: string[];
  ConfigurationTemplates?: string[];
  ResourceLifecycleConfig?: ApplicationResourceLifecycleConfig;
}
export const ApplicationDescription = S.suspend(() =>
  S.Struct({
    ApplicationArn: S.optional(S.String),
    ApplicationName: S.optional(S.String),
    Description: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Versions: S.optional(VersionLabelsList),
    ConfigurationTemplates: S.optional(ConfigurationTemplateNamesList),
    ResourceLifecycleConfig: S.optional(ApplicationResourceLifecycleConfig),
  }),
).annotations({
  identifier: "ApplicationDescription",
}) as any as S.Schema<ApplicationDescription>;
export interface ApplicationDescriptionMessage {
  Application?: ApplicationDescription;
}
export const ApplicationDescriptionMessage = S.suspend(() =>
  S.Struct({ Application: S.optional(ApplicationDescription) }).pipe(ns),
).annotations({
  identifier: "ApplicationDescriptionMessage",
}) as any as S.Schema<ApplicationDescriptionMessage>;
export interface ApplicationResourceLifecycleDescriptionMessage {
  ApplicationName?: string;
  ResourceLifecycleConfig?: ApplicationResourceLifecycleConfig;
}
export const ApplicationResourceLifecycleDescriptionMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.optional(S.String),
    ResourceLifecycleConfig: S.optional(ApplicationResourceLifecycleConfig),
  }).pipe(ns),
).annotations({
  identifier: "ApplicationResourceLifecycleDescriptionMessage",
}) as any as S.Schema<ApplicationResourceLifecycleDescriptionMessage>;
export type ApplicationVersionStatus =
  | "Processed"
  | "Unprocessed"
  | "Failed"
  | "Processing"
  | "Building";
export const ApplicationVersionStatus = S.Literal(
  "Processed",
  "Unprocessed",
  "Failed",
  "Processing",
  "Building",
);
export interface ApplicationVersionDescription {
  ApplicationVersionArn?: string;
  ApplicationName?: string;
  Description?: string;
  VersionLabel?: string;
  SourceBuildInformation?: SourceBuildInformation;
  BuildArn?: string;
  SourceBundle?: S3Location;
  DateCreated?: Date;
  DateUpdated?: Date;
  Status?: ApplicationVersionStatus;
}
export const ApplicationVersionDescription = S.suspend(() =>
  S.Struct({
    ApplicationVersionArn: S.optional(S.String),
    ApplicationName: S.optional(S.String),
    Description: S.optional(S.String),
    VersionLabel: S.optional(S.String),
    SourceBuildInformation: S.optional(SourceBuildInformation),
    BuildArn: S.optional(S.String),
    SourceBundle: S.optional(S3Location),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(ApplicationVersionStatus),
  }),
).annotations({
  identifier: "ApplicationVersionDescription",
}) as any as S.Schema<ApplicationVersionDescription>;
export interface ApplicationVersionDescriptionMessage {
  ApplicationVersion?: ApplicationVersionDescription;
}
export const ApplicationVersionDescriptionMessage = S.suspend(() =>
  S.Struct({
    ApplicationVersion: S.optional(ApplicationVersionDescription),
  }).pipe(ns),
).annotations({
  identifier: "ApplicationVersionDescriptionMessage",
}) as any as S.Schema<ApplicationVersionDescriptionMessage>;
export interface ResourceQuota {
  Maximum?: number;
}
export const ResourceQuota = S.suspend(() =>
  S.Struct({ Maximum: S.optional(S.Number) }),
).annotations({
  identifier: "ResourceQuota",
}) as any as S.Schema<ResourceQuota>;
export type ConfigurationOptionValueType = "Scalar" | "List";
export const ConfigurationOptionValueType = S.Literal("Scalar", "List");
export type ConfigurationOptionPossibleValues = string[];
export const ConfigurationOptionPossibleValues = S.Array(S.String);
export type FailureType =
  | "UpdateCancelled"
  | "CancellationFailed"
  | "RollbackFailed"
  | "RollbackSuccessful"
  | "InternalFailure"
  | "InvalidEnvironmentState"
  | "PermissionsError";
export const FailureType = S.Literal(
  "UpdateCancelled",
  "CancellationFailed",
  "RollbackFailed",
  "RollbackSuccessful",
  "InternalFailure",
  "InvalidEnvironmentState",
  "PermissionsError",
);
export type ActionHistoryStatus = "Completed" | "Failed" | "Unknown";
export const ActionHistoryStatus = S.Literal("Completed", "Failed", "Unknown");
export type ValidationSeverity = "error" | "warning";
export const ValidationSeverity = S.Literal("error", "warning");
export interface Builder {
  ARN?: string;
}
export const Builder = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String) }),
).annotations({ identifier: "Builder" }) as any as S.Schema<Builder>;
export interface ResourceQuotas {
  ApplicationQuota?: ResourceQuota;
  ApplicationVersionQuota?: ResourceQuota;
  EnvironmentQuota?: ResourceQuota;
  ConfigurationTemplateQuota?: ResourceQuota;
  CustomPlatformQuota?: ResourceQuota;
}
export const ResourceQuotas = S.suspend(() =>
  S.Struct({
    ApplicationQuota: S.optional(ResourceQuota),
    ApplicationVersionQuota: S.optional(ResourceQuota),
    EnvironmentQuota: S.optional(ResourceQuota),
    ConfigurationTemplateQuota: S.optional(ResourceQuota),
    CustomPlatformQuota: S.optional(ResourceQuota),
  }),
).annotations({
  identifier: "ResourceQuotas",
}) as any as S.Schema<ResourceQuotas>;
export type ApplicationDescriptionList = ApplicationDescription[];
export const ApplicationDescriptionList = S.Array(ApplicationDescription);
export type ApplicationVersionDescriptionList = ApplicationVersionDescription[];
export const ApplicationVersionDescriptionList = S.Array(
  ApplicationVersionDescription,
);
export interface InstanceHealthSummary {
  NoData?: number;
  Unknown?: number;
  Pending?: number;
  Ok?: number;
  Info?: number;
  Warning?: number;
  Degraded?: number;
  Severe?: number;
}
export const InstanceHealthSummary = S.suspend(() =>
  S.Struct({
    NoData: S.optional(S.Number),
    Unknown: S.optional(S.Number),
    Pending: S.optional(S.Number),
    Ok: S.optional(S.Number),
    Info: S.optional(S.Number),
    Warning: S.optional(S.Number),
    Degraded: S.optional(S.Number),
    Severe: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceHealthSummary",
}) as any as S.Schema<InstanceHealthSummary>;
export interface ManagedActionHistoryItem {
  ActionId?: string;
  ActionType?: ActionType;
  ActionDescription?: string;
  FailureType?: FailureType;
  Status?: ActionHistoryStatus;
  FailureDescription?: string;
  ExecutedTime?: Date;
  FinishedTime?: Date;
}
export const ManagedActionHistoryItem = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    ActionType: S.optional(ActionType),
    ActionDescription: S.optional(S.String),
    FailureType: S.optional(FailureType),
    Status: S.optional(ActionHistoryStatus),
    FailureDescription: S.optional(S.String),
    ExecutedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    FinishedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ManagedActionHistoryItem",
}) as any as S.Schema<ManagedActionHistoryItem>;
export type ManagedActionHistoryItems = ManagedActionHistoryItem[];
export const ManagedActionHistoryItems = S.Array(ManagedActionHistoryItem);
export interface ManagedAction {
  ActionId?: string;
  ActionDescription?: string;
  ActionType?: ActionType;
  Status?: ActionStatus;
  WindowStartTime?: Date;
}
export const ManagedAction = S.suspend(() =>
  S.Struct({
    ActionId: S.optional(S.String),
    ActionDescription: S.optional(S.String),
    ActionType: S.optional(ActionType),
    Status: S.optional(ActionStatus),
    WindowStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ManagedAction",
}) as any as S.Schema<ManagedAction>;
export type ManagedActions = ManagedAction[];
export const ManagedActions = S.Array(ManagedAction);
export interface EventDescription {
  EventDate?: Date;
  Message?: string;
  ApplicationName?: string;
  VersionLabel?: string;
  TemplateName?: string;
  EnvironmentName?: string;
  PlatformArn?: string;
  RequestId?: string;
  Severity?: EventSeverity;
}
export const EventDescription = S.suspend(() =>
  S.Struct({
    EventDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Message: S.optional(S.String),
    ApplicationName: S.optional(S.String),
    VersionLabel: S.optional(S.String),
    TemplateName: S.optional(S.String),
    EnvironmentName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    RequestId: S.optional(S.String),
    Severity: S.optional(EventSeverity),
  }),
).annotations({
  identifier: "EventDescription",
}) as any as S.Schema<EventDescription>;
export type EventDescriptionList = EventDescription[];
export const EventDescriptionList = S.Array(EventDescription);
export type PlatformSummaryList = PlatformSummary[];
export const PlatformSummaryList = S.Array(PlatformSummary);
export interface EnvironmentInfoDescription {
  InfoType?: EnvironmentInfoType;
  Ec2InstanceId?: string;
  SampleTimestamp?: Date;
  Message?: string;
}
export const EnvironmentInfoDescription = S.suspend(() =>
  S.Struct({
    InfoType: S.optional(EnvironmentInfoType),
    Ec2InstanceId: S.optional(S.String),
    SampleTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentInfoDescription",
}) as any as S.Schema<EnvironmentInfoDescription>;
export type EnvironmentInfoDescriptionList = EnvironmentInfoDescription[];
export const EnvironmentInfoDescriptionList = S.Array(
  EnvironmentInfoDescription,
);
export interface ValidationMessage {
  Message?: string;
  Severity?: ValidationSeverity;
  Namespace?: string;
  OptionName?: string;
}
export const ValidationMessage = S.suspend(() =>
  S.Struct({
    Message: S.optional(S.String),
    Severity: S.optional(ValidationSeverity),
    Namespace: S.optional(S.String),
    OptionName: S.optional(S.String),
  }),
).annotations({
  identifier: "ValidationMessage",
}) as any as S.Schema<ValidationMessage>;
export type ValidationMessagesList = ValidationMessage[];
export const ValidationMessagesList = S.Array(ValidationMessage);
export type LoadAverage = number[];
export const LoadAverage = S.Array(S.Number);
export interface CreatePlatformVersionResult {
  PlatformSummary?: PlatformSummary;
  Builder?: Builder;
}
export const CreatePlatformVersionResult = S.suspend(() =>
  S.Struct({
    PlatformSummary: S.optional(PlatformSummary),
    Builder: S.optional(Builder),
  }).pipe(ns),
).annotations({
  identifier: "CreatePlatformVersionResult",
}) as any as S.Schema<CreatePlatformVersionResult>;
export interface DescribeAccountAttributesResult {
  ResourceQuotas?: ResourceQuotas;
}
export const DescribeAccountAttributesResult = S.suspend(() =>
  S.Struct({ ResourceQuotas: S.optional(ResourceQuotas) }).pipe(ns),
).annotations({
  identifier: "DescribeAccountAttributesResult",
}) as any as S.Schema<DescribeAccountAttributesResult>;
export interface ApplicationDescriptionsMessage {
  Applications?: ApplicationDescription[];
}
export const ApplicationDescriptionsMessage = S.suspend(() =>
  S.Struct({ Applications: S.optional(ApplicationDescriptionList) }).pipe(ns),
).annotations({
  identifier: "ApplicationDescriptionsMessage",
}) as any as S.Schema<ApplicationDescriptionsMessage>;
export interface ApplicationVersionDescriptionsMessage {
  ApplicationVersions?: ApplicationVersionDescription[];
  NextToken?: string;
}
export const ApplicationVersionDescriptionsMessage = S.suspend(() =>
  S.Struct({
    ApplicationVersions: S.optional(ApplicationVersionDescriptionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ApplicationVersionDescriptionsMessage",
}) as any as S.Schema<ApplicationVersionDescriptionsMessage>;
export interface DescribeEnvironmentManagedActionHistoryResult {
  ManagedActionHistoryItems?: ManagedActionHistoryItem[];
  NextToken?: string;
}
export const DescribeEnvironmentManagedActionHistoryResult = S.suspend(() =>
  S.Struct({
    ManagedActionHistoryItems: S.optional(ManagedActionHistoryItems),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEnvironmentManagedActionHistoryResult",
}) as any as S.Schema<DescribeEnvironmentManagedActionHistoryResult>;
export interface DescribeEnvironmentManagedActionsResult {
  ManagedActions?: ManagedAction[];
}
export const DescribeEnvironmentManagedActionsResult = S.suspend(() =>
  S.Struct({ ManagedActions: S.optional(ManagedActions) }).pipe(ns),
).annotations({
  identifier: "DescribeEnvironmentManagedActionsResult",
}) as any as S.Schema<DescribeEnvironmentManagedActionsResult>;
export interface EventDescriptionsMessage {
  Events?: EventDescription[];
  NextToken?: string;
}
export const EventDescriptionsMessage = S.suspend(() =>
  S.Struct({
    Events: S.optional(EventDescriptionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "EventDescriptionsMessage",
}) as any as S.Schema<EventDescriptionsMessage>;
export interface ListPlatformVersionsResult {
  PlatformSummaryList?: PlatformSummary[];
  NextToken?: string;
}
export const ListPlatformVersionsResult = S.suspend(() =>
  S.Struct({
    PlatformSummaryList: S.optional(PlatformSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPlatformVersionsResult",
}) as any as S.Schema<ListPlatformVersionsResult>;
export interface RetrieveEnvironmentInfoResultMessage {
  EnvironmentInfo?: EnvironmentInfoDescription[];
}
export const RetrieveEnvironmentInfoResultMessage = S.suspend(() =>
  S.Struct({
    EnvironmentInfo: S.optional(EnvironmentInfoDescriptionList),
  }).pipe(ns),
).annotations({
  identifier: "RetrieveEnvironmentInfoResultMessage",
}) as any as S.Schema<RetrieveEnvironmentInfoResultMessage>;
export interface ConfigurationSettingsValidationMessages {
  Messages?: ValidationMessage[];
}
export const ConfigurationSettingsValidationMessages = S.suspend(() =>
  S.Struct({ Messages: S.optional(ValidationMessagesList) }).pipe(ns),
).annotations({
  identifier: "ConfigurationSettingsValidationMessages",
}) as any as S.Schema<ConfigurationSettingsValidationMessages>;
export interface OptionRestrictionRegex {
  Pattern?: string;
  Label?: string;
}
export const OptionRestrictionRegex = S.suspend(() =>
  S.Struct({ Pattern: S.optional(S.String), Label: S.optional(S.String) }),
).annotations({
  identifier: "OptionRestrictionRegex",
}) as any as S.Schema<OptionRestrictionRegex>;
export interface StatusCodes {
  Status2xx?: number;
  Status3xx?: number;
  Status4xx?: number;
  Status5xx?: number;
}
export const StatusCodes = S.suspend(() =>
  S.Struct({
    Status2xx: S.optional(S.Number),
    Status3xx: S.optional(S.Number),
    Status4xx: S.optional(S.Number),
    Status5xx: S.optional(S.Number),
  }),
).annotations({ identifier: "StatusCodes" }) as any as S.Schema<StatusCodes>;
export interface Latency {
  P999?: number;
  P99?: number;
  P95?: number;
  P90?: number;
  P85?: number;
  P75?: number;
  P50?: number;
  P10?: number;
}
export const Latency = S.suspend(() =>
  S.Struct({
    P999: S.optional(S.Number),
    P99: S.optional(S.Number),
    P95: S.optional(S.Number),
    P90: S.optional(S.Number),
    P85: S.optional(S.Number),
    P75: S.optional(S.Number),
    P50: S.optional(S.Number),
    P10: S.optional(S.Number),
  }),
).annotations({ identifier: "Latency" }) as any as S.Schema<Latency>;
export interface AutoScalingGroup {
  Name?: string;
}
export const AutoScalingGroup = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AutoScalingGroup",
}) as any as S.Schema<AutoScalingGroup>;
export type AutoScalingGroupList = AutoScalingGroup[];
export const AutoScalingGroupList = S.Array(AutoScalingGroup);
export interface Instance {
  Id?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceList = Instance[];
export const InstanceList = S.Array(Instance);
export interface LaunchConfiguration {
  Name?: string;
}
export const LaunchConfiguration = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "LaunchConfiguration",
}) as any as S.Schema<LaunchConfiguration>;
export type LaunchConfigurationList = LaunchConfiguration[];
export const LaunchConfigurationList = S.Array(LaunchConfiguration);
export interface LaunchTemplate {
  Id?: string;
}
export const LaunchTemplate = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "LaunchTemplate",
}) as any as S.Schema<LaunchTemplate>;
export type LaunchTemplateList = LaunchTemplate[];
export const LaunchTemplateList = S.Array(LaunchTemplate);
export interface LoadBalancer {
  Name?: string;
}
export const LoadBalancer = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({ identifier: "LoadBalancer" }) as any as S.Schema<LoadBalancer>;
export type LoadBalancerList = LoadBalancer[];
export const LoadBalancerList = S.Array(LoadBalancer);
export interface Trigger {
  Name?: string;
}
export const Trigger = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({ identifier: "Trigger" }) as any as S.Schema<Trigger>;
export type TriggerList = Trigger[];
export const TriggerList = S.Array(Trigger);
export interface Queue {
  Name?: string;
  URL?: string;
}
export const Queue = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), URL: S.optional(S.String) }),
).annotations({ identifier: "Queue" }) as any as S.Schema<Queue>;
export type QueueList = Queue[];
export const QueueList = S.Array(Queue);
export interface Deployment {
  VersionLabel?: string;
  DeploymentId?: number;
  Status?: string;
  DeploymentTime?: Date;
}
export const Deployment = S.suspend(() =>
  S.Struct({
    VersionLabel: S.optional(S.String),
    DeploymentId: S.optional(S.Number),
    Status: S.optional(S.String),
    DeploymentTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export interface PlatformProgrammingLanguage {
  Name?: string;
  Version?: string;
}
export const PlatformProgrammingLanguage = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Version: S.optional(S.String) }),
).annotations({
  identifier: "PlatformProgrammingLanguage",
}) as any as S.Schema<PlatformProgrammingLanguage>;
export type PlatformProgrammingLanguages = PlatformProgrammingLanguage[];
export const PlatformProgrammingLanguages = S.Array(
  PlatformProgrammingLanguage,
);
export interface PlatformFramework {
  Name?: string;
  Version?: string;
}
export const PlatformFramework = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Version: S.optional(S.String) }),
).annotations({
  identifier: "PlatformFramework",
}) as any as S.Schema<PlatformFramework>;
export type PlatformFrameworks = PlatformFramework[];
export const PlatformFrameworks = S.Array(PlatformFramework);
export interface CustomAmi {
  VirtualizationType?: string;
  ImageId?: string;
}
export const CustomAmi = S.suspend(() =>
  S.Struct({
    VirtualizationType: S.optional(S.String),
    ImageId: S.optional(S.String),
  }),
).annotations({ identifier: "CustomAmi" }) as any as S.Schema<CustomAmi>;
export type CustomAmiList = CustomAmi[];
export const CustomAmiList = S.Array(CustomAmi);
export interface ConfigurationOptionDescription {
  Namespace?: string;
  Name?: string;
  DefaultValue?: string;
  ChangeSeverity?: string;
  UserDefined?: boolean;
  ValueType?: ConfigurationOptionValueType;
  ValueOptions?: string[];
  MinValue?: number;
  MaxValue?: number;
  MaxLength?: number;
  Regex?: OptionRestrictionRegex;
}
export const ConfigurationOptionDescription = S.suspend(() =>
  S.Struct({
    Namespace: S.optional(S.String),
    Name: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    ChangeSeverity: S.optional(S.String),
    UserDefined: S.optional(S.Boolean),
    ValueType: S.optional(ConfigurationOptionValueType),
    ValueOptions: S.optional(ConfigurationOptionPossibleValues),
    MinValue: S.optional(S.Number),
    MaxValue: S.optional(S.Number),
    MaxLength: S.optional(S.Number),
    Regex: S.optional(OptionRestrictionRegex),
  }),
).annotations({
  identifier: "ConfigurationOptionDescription",
}) as any as S.Schema<ConfigurationOptionDescription>;
export type ConfigurationOptionDescriptionsList =
  ConfigurationOptionDescription[];
export const ConfigurationOptionDescriptionsList = S.Array(
  ConfigurationOptionDescription,
);
export interface ApplicationMetrics {
  Duration?: number;
  RequestCount?: number;
  StatusCodes?: StatusCodes;
  Latency?: Latency;
}
export const ApplicationMetrics = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number),
    RequestCount: S.optional(S.Number),
    StatusCodes: S.optional(StatusCodes),
    Latency: S.optional(Latency),
  }),
).annotations({
  identifier: "ApplicationMetrics",
}) as any as S.Schema<ApplicationMetrics>;
export interface EnvironmentResourceDescription {
  EnvironmentName?: string;
  AutoScalingGroups?: AutoScalingGroup[];
  Instances?: Instance[];
  LaunchConfigurations?: LaunchConfiguration[];
  LaunchTemplates?: LaunchTemplate[];
  LoadBalancers?: LoadBalancer[];
  Triggers?: Trigger[];
  Queues?: Queue[];
}
export const EnvironmentResourceDescription = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    AutoScalingGroups: S.optional(AutoScalingGroupList),
    Instances: S.optional(InstanceList),
    LaunchConfigurations: S.optional(LaunchConfigurationList),
    LaunchTemplates: S.optional(LaunchTemplateList),
    LoadBalancers: S.optional(LoadBalancerList),
    Triggers: S.optional(TriggerList),
    Queues: S.optional(QueueList),
  }),
).annotations({
  identifier: "EnvironmentResourceDescription",
}) as any as S.Schema<EnvironmentResourceDescription>;
export interface PlatformDescription {
  PlatformArn?: string;
  PlatformOwner?: string;
  PlatformName?: string;
  PlatformVersion?: string;
  SolutionStackName?: string;
  PlatformStatus?: PlatformStatus;
  DateCreated?: Date;
  DateUpdated?: Date;
  PlatformCategory?: string;
  Description?: string;
  Maintainer?: string;
  OperatingSystemName?: string;
  OperatingSystemVersion?: string;
  ProgrammingLanguages?: PlatformProgrammingLanguage[];
  Frameworks?: PlatformFramework[];
  CustomAmiList?: CustomAmi[];
  SupportedTierList?: string[];
  SupportedAddonList?: string[];
  PlatformLifecycleState?: string;
  PlatformBranchName?: string;
  PlatformBranchLifecycleState?: string;
}
export const PlatformDescription = S.suspend(() =>
  S.Struct({
    PlatformArn: S.optional(S.String),
    PlatformOwner: S.optional(S.String),
    PlatformName: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    SolutionStackName: S.optional(S.String),
    PlatformStatus: S.optional(PlatformStatus),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PlatformCategory: S.optional(S.String),
    Description: S.optional(S.String),
    Maintainer: S.optional(S.String),
    OperatingSystemName: S.optional(S.String),
    OperatingSystemVersion: S.optional(S.String),
    ProgrammingLanguages: S.optional(PlatformProgrammingLanguages),
    Frameworks: S.optional(PlatformFrameworks),
    CustomAmiList: S.optional(CustomAmiList),
    SupportedTierList: S.optional(SupportedTierList),
    SupportedAddonList: S.optional(SupportedAddonList),
    PlatformLifecycleState: S.optional(S.String),
    PlatformBranchName: S.optional(S.String),
    PlatformBranchLifecycleState: S.optional(S.String),
  }),
).annotations({
  identifier: "PlatformDescription",
}) as any as S.Schema<PlatformDescription>;
export interface PlatformBranchSummary {
  PlatformName?: string;
  BranchName?: string;
  LifecycleState?: string;
  BranchOrder?: number;
  SupportedTierList?: string[];
}
export const PlatformBranchSummary = S.suspend(() =>
  S.Struct({
    PlatformName: S.optional(S.String),
    BranchName: S.optional(S.String),
    LifecycleState: S.optional(S.String),
    BranchOrder: S.optional(S.Number),
    SupportedTierList: S.optional(SupportedTierList),
  }),
).annotations({
  identifier: "PlatformBranchSummary",
}) as any as S.Schema<PlatformBranchSummary>;
export type PlatformBranchSummaryList = PlatformBranchSummary[];
export const PlatformBranchSummaryList = S.Array(PlatformBranchSummary);
export interface CPUUtilization {
  User?: number;
  Nice?: number;
  System?: number;
  Idle?: number;
  IOWait?: number;
  IRQ?: number;
  SoftIRQ?: number;
  Privileged?: number;
}
export const CPUUtilization = S.suspend(() =>
  S.Struct({
    User: S.optional(S.Number),
    Nice: S.optional(S.Number),
    System: S.optional(S.Number),
    Idle: S.optional(S.Number),
    IOWait: S.optional(S.Number),
    IRQ: S.optional(S.Number),
    SoftIRQ: S.optional(S.Number),
    Privileged: S.optional(S.Number),
  }),
).annotations({
  identifier: "CPUUtilization",
}) as any as S.Schema<CPUUtilization>;
export interface CreateApplicationMessage {
  ApplicationName: string;
  Description?: string;
  ResourceLifecycleConfig?: ApplicationResourceLifecycleConfig;
  Tags?: Tag[];
}
export const CreateApplicationMessage = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    Description: S.optional(S.String),
    ResourceLifecycleConfig: S.optional(ApplicationResourceLifecycleConfig),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationMessage",
}) as any as S.Schema<CreateApplicationMessage>;
export interface ConfigurationOptionsDescription {
  SolutionStackName?: string;
  PlatformArn?: string;
  Options?: ConfigurationOptionDescription[];
}
export const ConfigurationOptionsDescription = S.suspend(() =>
  S.Struct({
    SolutionStackName: S.optional(S.String),
    PlatformArn: S.optional(S.String),
    Options: S.optional(ConfigurationOptionDescriptionsList),
  }).pipe(ns),
).annotations({
  identifier: "ConfigurationOptionsDescription",
}) as any as S.Schema<ConfigurationOptionsDescription>;
export interface DescribeEnvironmentHealthResult {
  EnvironmentName?: string;
  HealthStatus?: string;
  Status?: EnvironmentHealth;
  Color?: string;
  Causes?: string[];
  ApplicationMetrics?: ApplicationMetrics;
  InstancesHealth?: InstanceHealthSummary;
  RefreshedAt?: Date;
}
export const DescribeEnvironmentHealthResult = S.suspend(() =>
  S.Struct({
    EnvironmentName: S.optional(S.String),
    HealthStatus: S.optional(S.String),
    Status: S.optional(EnvironmentHealth),
    Color: S.optional(S.String),
    Causes: S.optional(Causes),
    ApplicationMetrics: S.optional(ApplicationMetrics),
    InstancesHealth: S.optional(InstanceHealthSummary),
    RefreshedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEnvironmentHealthResult",
}) as any as S.Schema<DescribeEnvironmentHealthResult>;
export interface EnvironmentResourceDescriptionsMessage {
  EnvironmentResources?: EnvironmentResourceDescription;
}
export const EnvironmentResourceDescriptionsMessage = S.suspend(() =>
  S.Struct({
    EnvironmentResources: S.optional(EnvironmentResourceDescription),
  }).pipe(ns),
).annotations({
  identifier: "EnvironmentResourceDescriptionsMessage",
}) as any as S.Schema<EnvironmentResourceDescriptionsMessage>;
export interface DescribePlatformVersionResult {
  PlatformDescription?: PlatformDescription;
}
export const DescribePlatformVersionResult = S.suspend(() =>
  S.Struct({ PlatformDescription: S.optional(PlatformDescription) }).pipe(ns),
).annotations({
  identifier: "DescribePlatformVersionResult",
}) as any as S.Schema<DescribePlatformVersionResult>;
export interface ListPlatformBranchesResult {
  PlatformBranchSummaryList?: PlatformBranchSummary[];
  NextToken?: string;
}
export const ListPlatformBranchesResult = S.suspend(() =>
  S.Struct({
    PlatformBranchSummaryList: S.optional(PlatformBranchSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPlatformBranchesResult",
}) as any as S.Schema<ListPlatformBranchesResult>;
export interface SystemStatus {
  CPUUtilization?: CPUUtilization;
  LoadAverage?: number[];
}
export const SystemStatus = S.suspend(() =>
  S.Struct({
    CPUUtilization: S.optional(CPUUtilization),
    LoadAverage: S.optional(LoadAverage),
  }),
).annotations({ identifier: "SystemStatus" }) as any as S.Schema<SystemStatus>;
export interface SingleInstanceHealth {
  InstanceId?: string;
  HealthStatus?: string;
  Color?: string;
  Causes?: string[];
  LaunchedAt?: Date;
  ApplicationMetrics?: ApplicationMetrics;
  System?: SystemStatus;
  Deployment?: Deployment;
  AvailabilityZone?: string;
  InstanceType?: string;
}
export const SingleInstanceHealth = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    HealthStatus: S.optional(S.String),
    Color: S.optional(S.String),
    Causes: S.optional(Causes),
    LaunchedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ApplicationMetrics: S.optional(ApplicationMetrics),
    System: S.optional(SystemStatus),
    Deployment: S.optional(Deployment),
    AvailabilityZone: S.optional(S.String),
    InstanceType: S.optional(S.String),
  }),
).annotations({
  identifier: "SingleInstanceHealth",
}) as any as S.Schema<SingleInstanceHealth>;
export type InstanceHealthList = SingleInstanceHealth[];
export const InstanceHealthList = S.Array(SingleInstanceHealth);
export interface DescribeInstancesHealthResult {
  InstanceHealthList?: SingleInstanceHealth[];
  RefreshedAt?: Date;
  NextToken?: string;
}
export const DescribeInstancesHealthResult = S.suspend(() =>
  S.Struct({
    InstanceHealthList: S.optional(InstanceHealthList),
    RefreshedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstancesHealthResult",
}) as any as S.Schema<DescribeInstancesHealthResult>;

//# Errors
export class InsufficientPrivilegesException extends S.TaggedError<InsufficientPrivilegesException>()(
  "InsufficientPrivilegesException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientPrivilegesException",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class OperationInProgressException extends S.TaggedError<OperationInProgressException>()(
  "OperationInProgressException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OperationInProgressFailure",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ElasticBeanstalkServiceException extends S.TaggedError<ElasticBeanstalkServiceException>()(
  "ElasticBeanstalkServiceException",
  { message: S.optional(S.String) },
) {}
export class TooManyEnvironmentsException extends S.TaggedError<TooManyEnvironmentsException>()(
  "TooManyEnvironmentsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyEnvironmentsException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CodeBuildNotInServiceRegionException extends S.TaggedError<CodeBuildNotInServiceRegionException>()(
  "CodeBuildNotInServiceRegionException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CodeBuildNotInServiceRegionException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyBucketsException extends S.TaggedError<TooManyBucketsException>()(
  "TooManyBucketsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyBucketsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class S3SubscriptionRequiredException extends S.TaggedError<S3SubscriptionRequiredException>()(
  "S3SubscriptionRequiredException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "S3SubscriptionRequiredException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class S3LocationNotInServiceRegionException extends S.TaggedError<S3LocationNotInServiceRegionException>()(
  "S3LocationNotInServiceRegionException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "S3LocationNotInServiceRegionException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ManagedActionInvalidStateException extends S.TaggedError<ManagedActionInvalidStateException>()(
  "ManagedActionInvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ManagedActionInvalidStateException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyConfigurationTemplatesException extends S.TaggedError<TooManyConfigurationTemplatesException>()(
  "TooManyConfigurationTemplatesException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyConfigurationTemplatesException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyPlatformsException extends S.TaggedError<TooManyPlatformsException>()(
  "TooManyPlatformsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyPlatformsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceTypeNotSupportedException extends S.TaggedError<ResourceTypeNotSupportedException>()(
  "ResourceTypeNotSupportedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceTypeNotSupportedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SourceBundleDeletionException extends S.TaggedError<SourceBundleDeletionException>()(
  "SourceBundleDeletionException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SourceBundleDeletionFailure",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class PlatformVersionStillReferencedException extends S.TaggedError<PlatformVersionStillReferencedException>()(
  "PlatformVersionStillReferencedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PlatformVersionStillReferencedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyApplicationsException extends S.TaggedError<TooManyApplicationsException>()(
  "TooManyApplicationsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyApplicationsException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRequestException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTagsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyApplicationVersionsException extends S.TaggedError<TooManyApplicationVersionsException>()(
  "TooManyApplicationVersionsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the draft configuration associated with the running environment.
 *
 * Updating a running environment with any configuration changes creates a draft
 * configuration set. You can get the draft configuration using DescribeConfigurationSettings while the update is in progress or if the update
 * fails. The `DeploymentStatus` for the draft configuration indicates whether the
 * deployment is in process or has failed. The draft configuration remains in existence until it
 * is deleted with this action.
 */
export const deleteEnvironmentConfiguration: (
  input: DeleteEnvironmentConfigurationMessage,
) => effect.Effect<
  DeleteEnvironmentConfigurationResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentConfigurationMessage,
  output: DeleteEnvironmentConfigurationResponse,
  errors: [],
}));
/**
 * Returns descriptions for existing environments.
 */
export const describeEnvironments: (
  input: DescribeEnvironmentsMessage,
) => effect.Effect<
  EnvironmentDescriptionsMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentsMessage,
  output: EnvironmentDescriptionsMessage,
  errors: [],
}));
/**
 * Initiates a request to compile the specified type of information of the deployed
 * environment.
 *
 * Setting the `InfoType` to `tail` compiles the last lines from
 * the application server log files of every Amazon EC2 instance in your environment.
 *
 * Setting the `InfoType` to `bundle` compresses the application
 * server log files for every Amazon EC2 instance into a `.zip` file. Legacy and .NET
 * containers do not support bundle logs.
 *
 * Use RetrieveEnvironmentInfo to obtain the set of logs.
 *
 * Related Topics
 *
 * - RetrieveEnvironmentInfo
 */
export const requestEnvironmentInfo: (
  input: RequestEnvironmentInfoMessage,
) => effect.Effect<
  RequestEnvironmentInfoResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestEnvironmentInfoMessage,
  output: RequestEnvironmentInfoResponse,
  errors: [],
}));
/**
 * Causes the environment to restart the application container server running on each
 * Amazon EC2 instance.
 */
export const restartAppServer: (
  input: RestartAppServerMessage,
) => effect.Effect<
  RestartAppServerResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestartAppServerMessage,
  output: RestartAppServerResponse,
  errors: [],
}));
/**
 * Swaps the CNAMEs of two environments.
 */
export const swapEnvironmentCNAMEs: (
  input: SwapEnvironmentCNAMEsMessage,
) => effect.Effect<
  SwapEnvironmentCNAMEsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SwapEnvironmentCNAMEsMessage,
  output: SwapEnvironmentCNAMEsResponse,
  errors: [],
}));
/**
 * Cancels in-progress environment configuration update or application version
 * deployment.
 */
export const abortEnvironmentUpdate: (
  input: AbortEnvironmentUpdateMessage,
) => effect.Effect<
  AbortEnvironmentUpdateResponse,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AbortEnvironmentUpdateMessage,
  output: AbortEnvironmentUpdateResponse,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Checks if the specified CNAME is available.
 */
export const checkDNSAvailability: (
  input: CheckDNSAvailabilityMessage,
) => effect.Effect<
  CheckDNSAvailabilityResultMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckDNSAvailabilityMessage,
  output: CheckDNSAvailabilityResultMessage,
  errors: [],
}));
/**
 * Deletes the specified application along with all associated versions and
 * configurations. The application versions will not be deleted from your Amazon S3
 * bucket.
 *
 * You cannot delete an application that has a running environment.
 */
export const deleteApplication: (
  input: DeleteApplicationMessage,
) => effect.Effect<
  DeleteApplicationResponse,
  OperationInProgressException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationMessage,
  output: DeleteApplicationResponse,
  errors: [OperationInProgressException],
}));
/**
 * Returns a list of the available solution stack names, with the public version first and
 * then in reverse chronological order.
 */
export const listAvailableSolutionStacks: (
  input: ListAvailableSolutionStacksRequest,
) => effect.Effect<
  ListAvailableSolutionStacksResultMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAvailableSolutionStacksRequest,
  output: ListAvailableSolutionStacksResultMessage,
  errors: [],
}));
/**
 * Updates the specified application to have the specified properties.
 *
 * If a property (for example, `description`) is not provided, the value
 * remains unchanged. To clear these properties, specify an empty string.
 */
export const updateApplication: (
  input: UpdateApplicationMessage,
) => effect.Effect<
  ApplicationDescriptionMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationMessage,
  output: ApplicationDescriptionMessage,
  errors: [],
}));
/**
 * Modifies lifecycle settings for an application.
 */
export const updateApplicationResourceLifecycle: (
  input: UpdateApplicationResourceLifecycleMessage,
) => effect.Effect<
  ApplicationResourceLifecycleDescriptionMessage,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationResourceLifecycleMessage,
  output: ApplicationResourceLifecycleDescriptionMessage,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Updates the specified application version to have the specified properties.
 *
 * If a property (for example, `description`) is not provided, the value
 * remains unchanged. To clear properties, specify an empty string.
 */
export const updateApplicationVersion: (
  input: UpdateApplicationVersionMessage,
) => effect.Effect<
  ApplicationVersionDescriptionMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationVersionMessage,
  output: ApplicationVersionDescriptionMessage,
  errors: [],
}));
/**
 * Add or change the operations role used by an environment. After this call is made, Elastic Beanstalk
 * uses the associated operations role for permissions to downstream services during subsequent
 * calls acting on this environment. For more information, see Operations roles in the
 * *AWS Elastic Beanstalk Developer Guide*.
 */
export const associateEnvironmentOperationsRole: (
  input: AssociateEnvironmentOperationsRoleMessage,
) => effect.Effect<
  AssociateEnvironmentOperationsRoleResponse,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateEnvironmentOperationsRoleMessage,
  output: AssociateEnvironmentOperationsRoleResponse,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Disassociate the operations role from an environment. After this call is made, Elastic Beanstalk uses
 * the caller's permissions for permissions to downstream services during subsequent calls acting
 * on this environment. For more information, see Operations roles in the
 * *AWS Elastic Beanstalk Developer Guide*.
 */
export const disassociateEnvironmentOperationsRole: (
  input: DisassociateEnvironmentOperationsRoleMessage,
) => effect.Effect<
  DisassociateEnvironmentOperationsRoleResponse,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateEnvironmentOperationsRoleMessage,
  output: DisassociateEnvironmentOperationsRoleResponse,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Deletes and recreates all of the AWS resources (for example: the Auto Scaling group,
 * load balancer, etc.) for a specified environment and forces a restart.
 */
export const rebuildEnvironment: (
  input: RebuildEnvironmentMessage,
) => effect.Effect<
  RebuildEnvironmentResponse,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebuildEnvironmentMessage,
  output: RebuildEnvironmentResponse,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Deletes the specified configuration template.
 *
 * When you launch an environment using a configuration template, the environment gets a
 * copy of the template. You can delete or modify the environment's copy of the template
 * without affecting the running environment.
 */
export const deleteConfigurationTemplate: (
  input: DeleteConfigurationTemplateMessage,
) => effect.Effect<
  DeleteConfigurationTemplateResponse,
  OperationInProgressException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationTemplateMessage,
  output: DeleteConfigurationTemplateResponse,
  errors: [OperationInProgressException],
}));
/**
 * Create or update a group of environments that each run a separate component of a single
 * application. Takes a list of version labels that specify application source bundles for each
 * of the environments to create or update. The name of each environment and other required
 * information must be included in the source bundles in an environment manifest named
 * `env.yaml`. See Compose Environments
 * for details.
 */
export const composeEnvironments: (
  input: ComposeEnvironmentsMessage,
) => effect.Effect<
  EnvironmentDescriptionsMessage,
  InsufficientPrivilegesException | TooManyEnvironmentsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ComposeEnvironmentsMessage,
  output: EnvironmentDescriptionsMessage,
  errors: [InsufficientPrivilegesException, TooManyEnvironmentsException],
}));
/**
 * Returns attributes related to AWS Elastic Beanstalk that are associated with the calling AWS
 * account.
 *
 * The result currently has one set of attributes—resource quotas.
 */
export const describeAccountAttributes: (
  input: DescribeAccountAttributesRequest,
) => effect.Effect<
  DescribeAccountAttributesResult,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountAttributesRequest,
  output: DescribeAccountAttributesResult,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Returns the descriptions of existing applications.
 */
export const describeApplications: (
  input: DescribeApplicationsMessage,
) => effect.Effect<
  ApplicationDescriptionsMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationsMessage,
  output: ApplicationDescriptionsMessage,
  errors: [],
}));
/**
 * Retrieve a list of application versions.
 */
export const describeApplicationVersions: (
  input: DescribeApplicationVersionsMessage,
) => effect.Effect<
  ApplicationVersionDescriptionsMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationVersionsMessage,
  output: ApplicationVersionDescriptionsMessage,
  errors: [],
}));
/**
 * Lists an environment's completed and failed managed actions.
 */
export const describeEnvironmentManagedActionHistory: {
  (
    input: DescribeEnvironmentManagedActionHistoryRequest,
  ): effect.Effect<
    DescribeEnvironmentManagedActionHistoryResult,
    ElasticBeanstalkServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEnvironmentManagedActionHistoryRequest,
  ) => stream.Stream<
    DescribeEnvironmentManagedActionHistoryResult,
    ElasticBeanstalkServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEnvironmentManagedActionHistoryRequest,
  ) => stream.Stream<
    ManagedActionHistoryItem,
    ElasticBeanstalkServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEnvironmentManagedActionHistoryRequest,
  output: DescribeEnvironmentManagedActionHistoryResult,
  errors: [ElasticBeanstalkServiceException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ManagedActionHistoryItems",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists an environment's upcoming and in-progress managed actions.
 */
export const describeEnvironmentManagedActions: (
  input: DescribeEnvironmentManagedActionsRequest,
) => effect.Effect<
  DescribeEnvironmentManagedActionsResult,
  ElasticBeanstalkServiceException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentManagedActionsRequest,
  output: DescribeEnvironmentManagedActionsResult,
  errors: [ElasticBeanstalkServiceException],
}));
/**
 * Returns list of event descriptions matching criteria up to the last 6 weeks.
 *
 * This action returns the most recent 1,000 events from the specified
 * `NextToken`.
 */
export const describeEvents: {
  (
    input: DescribeEventsMessage,
  ): effect.Effect<
    EventDescriptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsMessage,
  ) => stream.Stream<
    EventDescriptionsMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsMessage,
  ) => stream.Stream<
    EventDescription,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsMessage,
  output: EventDescriptionsMessage,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists the platform versions available for your account in an AWS Region. Provides
 * summary information about each platform version. Compare to DescribePlatformVersion, which provides full details about a single platform
 * version.
 *
 * For definitions of platform version and other platform-related terms, see AWS Elastic Beanstalk
 * Platforms Glossary.
 */
export const listPlatformVersions: {
  (
    input: ListPlatformVersionsRequest,
  ): effect.Effect<
    ListPlatformVersionsResult,
    | ElasticBeanstalkServiceException
    | InsufficientPrivilegesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlatformVersionsRequest,
  ) => stream.Stream<
    ListPlatformVersionsResult,
    | ElasticBeanstalkServiceException
    | InsufficientPrivilegesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlatformVersionsRequest,
  ) => stream.Stream<
    PlatformSummary,
    | ElasticBeanstalkServiceException
    | InsufficientPrivilegesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlatformVersionsRequest,
  output: ListPlatformVersionsResult,
  errors: [ElasticBeanstalkServiceException, InsufficientPrivilegesException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PlatformSummaryList",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Retrieves the compiled information from a RequestEnvironmentInfo
 * request.
 *
 * Related Topics
 *
 * - RequestEnvironmentInfo
 */
export const retrieveEnvironmentInfo: (
  input: RetrieveEnvironmentInfoMessage,
) => effect.Effect<
  RetrieveEnvironmentInfoResultMessage,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveEnvironmentInfoMessage,
  output: RetrieveEnvironmentInfoResultMessage,
  errors: [],
}));
/**
 * Takes a set of configuration settings and either a configuration template or
 * environment, and determines whether those values are valid.
 *
 * This action returns a list of messages indicating any errors or warnings associated
 * with the selection of option values.
 */
export const validateConfigurationSettings: (
  input: ValidateConfigurationSettingsMessage,
) => effect.Effect<
  ConfigurationSettingsValidationMessages,
  InsufficientPrivilegesException | TooManyBucketsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateConfigurationSettingsMessage,
  output: ConfigurationSettingsValidationMessages,
  errors: [InsufficientPrivilegesException, TooManyBucketsException],
}));
/**
 * Creates a bucket in Amazon S3 to store application versions, logs, and other files used
 * by Elastic Beanstalk environments. The Elastic Beanstalk console and EB CLI call this API the
 * first time you create an environment in a region. If the storage location already exists,
 * `CreateStorageLocation` still returns the bucket name but does not create a new
 * bucket.
 */
export const createStorageLocation: (
  input: CreateStorageLocationRequest,
) => effect.Effect<
  CreateStorageLocationResultMessage,
  | InsufficientPrivilegesException
  | S3SubscriptionRequiredException
  | TooManyBucketsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStorageLocationRequest,
  output: CreateStorageLocationResultMessage,
  errors: [
    InsufficientPrivilegesException,
    S3SubscriptionRequiredException,
    TooManyBucketsException,
  ],
}));
/**
 * Launches an AWS Elastic Beanstalk environment for the specified application using the specified
 * configuration.
 */
export const createEnvironment: (
  input: CreateEnvironmentMessage,
) => effect.Effect<
  EnvironmentDescription,
  InsufficientPrivilegesException | TooManyEnvironmentsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentMessage,
  output: EnvironmentDescription,
  errors: [InsufficientPrivilegesException, TooManyEnvironmentsException],
}));
/**
 * Returns a description of the settings for the specified configuration set, that is,
 * either a configuration template or the configuration set associated with a running
 * environment.
 *
 * When describing the settings for the configuration set associated with a running
 * environment, it is possible to receive two sets of setting descriptions. One is the deployed
 * configuration set, and the other is a draft configuration of an environment that is either in
 * the process of deployment or that failed to deploy.
 *
 * Related Topics
 *
 * - DeleteEnvironmentConfiguration
 */
export const describeConfigurationSettings: (
  input: DescribeConfigurationSettingsMessage,
) => effect.Effect<
  ConfigurationSettingsDescriptions,
  TooManyBucketsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationSettingsMessage,
  output: ConfigurationSettingsDescriptions,
  errors: [TooManyBucketsException],
}));
/**
 * Updates the specified configuration template to have the specified properties or
 * configuration option values.
 *
 * If a property (for example, `ApplicationName`) is not provided, its value
 * remains unchanged. To clear such properties, specify an empty string.
 *
 * Related Topics
 *
 * - DescribeConfigurationOptions
 */
export const updateConfigurationTemplate: (
  input: UpdateConfigurationTemplateMessage,
) => effect.Effect<
  ConfigurationSettingsDescription,
  InsufficientPrivilegesException | TooManyBucketsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationTemplateMessage,
  output: ConfigurationSettingsDescription,
  errors: [InsufficientPrivilegesException, TooManyBucketsException],
}));
/**
 * Updates the environment description, deploys a new application version, updates the
 * configuration settings to an entirely new configuration template, or updates select
 * configuration option values in the running environment.
 *
 * Attempting to update both the release and configuration is not allowed and AWS Elastic
 * Beanstalk returns an `InvalidParameterCombination` error.
 *
 * When updating the configuration settings to a new template or individual settings, a
 * draft configuration is created and DescribeConfigurationSettings for this
 * environment returns two setting descriptions with different `DeploymentStatus`
 * values.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentMessage,
) => effect.Effect<
  EnvironmentDescription,
  InsufficientPrivilegesException | TooManyBucketsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentMessage,
  output: EnvironmentDescription,
  errors: [InsufficientPrivilegesException, TooManyBucketsException],
}));
/**
 * Applies a scheduled managed action immediately. A managed action can be applied only if
 * its status is `Scheduled`. Get the status and action ID of a managed action with
 * DescribeEnvironmentManagedActions.
 */
export const applyEnvironmentManagedAction: (
  input: ApplyEnvironmentManagedActionRequest,
) => effect.Effect<
  ApplyEnvironmentManagedActionResult,
  | ElasticBeanstalkServiceException
  | ManagedActionInvalidStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyEnvironmentManagedActionRequest,
  output: ApplyEnvironmentManagedActionResult,
  errors: [
    ElasticBeanstalkServiceException,
    ManagedActionInvalidStateException,
  ],
}));
/**
 * Creates an AWS Elastic Beanstalk configuration template, associated with a specific Elastic Beanstalk
 * application. You define application configuration settings in a configuration template. You
 * can then use the configuration template to deploy different versions of the application with
 * the same configuration settings.
 *
 * Templates aren't associated with any environment. The `EnvironmentName`
 * response element is always `null`.
 *
 * Related Topics
 *
 * - DescribeConfigurationOptions
 *
 * - DescribeConfigurationSettings
 *
 * - ListAvailableSolutionStacks
 */
export const createConfigurationTemplate: (
  input: CreateConfigurationTemplateMessage,
) => effect.Effect<
  ConfigurationSettingsDescription,
  | InsufficientPrivilegesException
  | TooManyBucketsException
  | TooManyConfigurationTemplatesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationTemplateMessage,
  output: ConfigurationSettingsDescription,
  errors: [
    InsufficientPrivilegesException,
    TooManyBucketsException,
    TooManyConfigurationTemplatesException,
  ],
}));
/**
 * Create a new version of your custom platform.
 */
export const createPlatformVersion: (
  input: CreatePlatformVersionRequest,
) => effect.Effect<
  CreatePlatformVersionResult,
  | ElasticBeanstalkServiceException
  | InsufficientPrivilegesException
  | TooManyPlatformsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlatformVersionRequest,
  output: CreatePlatformVersionResult,
  errors: [
    ElasticBeanstalkServiceException,
    InsufficientPrivilegesException,
    TooManyPlatformsException,
  ],
}));
/**
 * Describes the configuration options that are used in a particular configuration
 * template or environment, or that a specified solution stack defines. The description includes
 * the values the options, their default values, and an indication of the required action on a
 * running environment if an option value is changed.
 */
export const describeConfigurationOptions: (
  input: DescribeConfigurationOptionsMessage,
) => effect.Effect<
  ConfigurationOptionsDescription,
  TooManyBucketsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationOptionsMessage,
  output: ConfigurationOptionsDescription,
  errors: [TooManyBucketsException],
}));
/**
 * Returns AWS resources for this environment.
 */
export const describeEnvironmentResources: (
  input: DescribeEnvironmentResourcesMessage,
) => effect.Effect<
  EnvironmentResourceDescriptionsMessage,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentResourcesMessage,
  output: EnvironmentResourceDescriptionsMessage,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Describes a platform version. Provides full details. Compare to ListPlatformVersions, which provides summary information about a list of
 * platform versions.
 *
 * For definitions of platform version and other platform-related terms, see AWS Elastic Beanstalk
 * Platforms Glossary.
 */
export const describePlatformVersion: (
  input: DescribePlatformVersionRequest,
) => effect.Effect<
  DescribePlatformVersionResult,
  | ElasticBeanstalkServiceException
  | InsufficientPrivilegesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePlatformVersionRequest,
  output: DescribePlatformVersionResult,
  errors: [ElasticBeanstalkServiceException, InsufficientPrivilegesException],
}));
/**
 * Lists the platform branches available for your account in an AWS Region. Provides
 * summary information about each platform branch.
 *
 * For definitions of platform branch and other platform-related terms, see AWS Elastic Beanstalk
 * Platforms Glossary.
 */
export const listPlatformBranches: {
  (
    input: ListPlatformBranchesRequest,
  ): effect.Effect<
    ListPlatformBranchesResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlatformBranchesRequest,
  ) => stream.Stream<
    ListPlatformBranchesResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlatformBranchesRequest,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlatformBranchesRequest,
  output: ListPlatformBranchesResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Return the tags applied to an AWS Elastic Beanstalk resource. The response contains a list of tag key-value pairs.
 *
 * Elastic Beanstalk supports tagging of all of its resources. For details about resource tagging, see
 * Tagging Application
 * Resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceMessage,
) => effect.Effect<
  ResourceTagsDescriptionMessage,
  | InsufficientPrivilegesException
  | ResourceNotFoundException
  | ResourceTypeNotSupportedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: ResourceTagsDescriptionMessage,
  errors: [
    InsufficientPrivilegesException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
  ],
}));
/**
 * Deletes the specified version from the specified application.
 *
 * You cannot delete an application version that is associated with a running
 * environment.
 */
export const deleteApplicationVersion: (
  input: DeleteApplicationVersionMessage,
) => effect.Effect<
  DeleteApplicationVersionResponse,
  | InsufficientPrivilegesException
  | OperationInProgressException
  | S3LocationNotInServiceRegionException
  | SourceBundleDeletionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationVersionMessage,
  output: DeleteApplicationVersionResponse,
  errors: [
    InsufficientPrivilegesException,
    OperationInProgressException,
    S3LocationNotInServiceRegionException,
    SourceBundleDeletionException,
  ],
}));
/**
 * Deletes the specified version of a custom platform.
 */
export const deletePlatformVersion: (
  input: DeletePlatformVersionRequest,
) => effect.Effect<
  DeletePlatformVersionResult,
  | ElasticBeanstalkServiceException
  | InsufficientPrivilegesException
  | OperationInProgressException
  | PlatformVersionStillReferencedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlatformVersionRequest,
  output: DeletePlatformVersionResult,
  errors: [
    ElasticBeanstalkServiceException,
    InsufficientPrivilegesException,
    OperationInProgressException,
    PlatformVersionStillReferencedException,
  ],
}));
/**
 * Creates an application that has one configuration template named `default`
 * and no application versions.
 */
export const createApplication: (
  input: CreateApplicationMessage,
) => effect.Effect<
  ApplicationDescriptionMessage,
  TooManyApplicationsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationMessage,
  output: ApplicationDescriptionMessage,
  errors: [TooManyApplicationsException],
}));
/**
 * Returns information about the overall health of the specified environment. The
 * **DescribeEnvironmentHealth** operation is only available with
 * AWS Elastic Beanstalk Enhanced Health.
 */
export const describeEnvironmentHealth: (
  input: DescribeEnvironmentHealthRequest,
) => effect.Effect<
  DescribeEnvironmentHealthResult,
  ElasticBeanstalkServiceException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentHealthRequest,
  output: DescribeEnvironmentHealthResult,
  errors: [ElasticBeanstalkServiceException, InvalidRequestException],
}));
/**
 * Retrieves detailed information about the health of instances in your AWS Elastic
 * Beanstalk. This operation requires enhanced health
 * reporting.
 */
export const describeInstancesHealth: (
  input: DescribeInstancesHealthRequest,
) => effect.Effect<
  DescribeInstancesHealthResult,
  ElasticBeanstalkServiceException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInstancesHealthRequest,
  output: DescribeInstancesHealthResult,
  errors: [ElasticBeanstalkServiceException, InvalidRequestException],
}));
/**
 * Terminates the specified environment.
 */
export const terminateEnvironment: (
  input: TerminateEnvironmentMessage,
) => effect.Effect<
  EnvironmentDescription,
  InsufficientPrivilegesException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateEnvironmentMessage,
  output: EnvironmentDescription,
  errors: [InsufficientPrivilegesException],
}));
/**
 * Update the list of tags applied to an AWS Elastic Beanstalk resource. Two lists can be passed: `TagsToAdd`
 * for tags to add or update, and `TagsToRemove`.
 *
 * Elastic Beanstalk supports tagging of all of its resources. For details about resource tagging, see
 * Tagging Application
 * Resources.
 *
 * If you create a custom IAM user policy to control permission to this operation, specify
 * one of the following two virtual actions (or both) instead of the API operation name:
 *
 * ### elasticbeanstalk:AddTags
 *
 * Controls permission to call `UpdateTagsForResource` and pass a list of tags to add in the `TagsToAdd`
 * parameter.
 *
 * ### elasticbeanstalk:RemoveTags
 *
 * Controls permission to call `UpdateTagsForResource` and pass a list of tag keys to remove in the `TagsToRemove`
 * parameter.
 *
 * For details about creating a custom user policy, see Creating a Custom User Policy.
 */
export const updateTagsForResource: (
  input: UpdateTagsForResourceMessage,
) => effect.Effect<
  UpdateTagsForResourceResponse,
  | InsufficientPrivilegesException
  | OperationInProgressException
  | ResourceNotFoundException
  | ResourceTypeNotSupportedException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTagsForResourceMessage,
  output: UpdateTagsForResourceResponse,
  errors: [
    InsufficientPrivilegesException,
    OperationInProgressException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    TooManyTagsException,
  ],
}));
/**
 * Creates an application version for the specified application. You can create an
 * application version from a source bundle in Amazon S3, a commit in AWS CodeCommit, or the
 * output of an AWS CodeBuild build as follows:
 *
 * Specify a commit in an AWS CodeCommit repository with
 * `SourceBuildInformation`.
 *
 * Specify a build in an AWS CodeBuild with `SourceBuildInformation` and
 * `BuildConfiguration`.
 *
 * Specify a source bundle in S3 with `SourceBundle`
 *
 * Omit both `SourceBuildInformation` and `SourceBundle` to use the
 * default sample application.
 *
 * After you create an application version with a specified Amazon S3 bucket and key
 * location, you can't change that Amazon S3 location. If you change the Amazon S3 location,
 * you receive an exception when you attempt to launch an environment from the application
 * version.
 */
export const createApplicationVersion: (
  input: CreateApplicationVersionMessage,
) => effect.Effect<
  ApplicationVersionDescriptionMessage,
  | CodeBuildNotInServiceRegionException
  | InsufficientPrivilegesException
  | S3LocationNotInServiceRegionException
  | TooManyApplicationsException
  | TooManyApplicationVersionsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationVersionMessage,
  output: ApplicationVersionDescriptionMessage,
  errors: [
    CodeBuildNotInServiceRegionException,
    InsufficientPrivilegesException,
    S3LocationNotInServiceRegionException,
    TooManyApplicationsException,
    TooManyApplicationVersionsException,
  ],
}));

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
  sdkId: "synthetics",
  serviceShapeName: "Synthetics",
});
const auth = T.AwsAuthSigv4({ name: "synthetics" });
const ver = T.ServiceVersion("2017-10-11");
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
              `https://synthetics-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://synthetics-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://synthetics.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://synthetics.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type GroupIdentifier = string;
export type CanaryArn = string;
export type CanaryName = string;
export type RoleArn = string;
export type MaxSize1024 = number;
export type GroupName = string;
export type Token = string;
export type MaxCanaryResults = number;
export type MaxSize100 = number;
export type UUID = string;
export type PaginationToken = string;
export type MaxGroupResults = number;
export type ResourceArn = string;
export type TagKey = string;
export type CodeHandler = string;
export type BlueprintType = string;
export type MaxOneYearInSeconds = number;
export type MaxFifteenMinutesInSeconds = number;
export type MaxSize3008 = number;
export type EphemeralStorageSize = number;
export type SubnetId = string;
export type SecurityGroupId = string;
export type TagValue = string;
export type ErrorMessage = string;
export type MaxRetries = number;
export type EnvironmentVariableName = string;
export type EnvironmentVariableValue = string;
export type KmsKeyArn = string;
export type BaseScreenshotConfigIgnoreCoordinate = string;
export type GroupArn = string;
export type FunctionArn = string;
export type RetryAttempt = number;
export type VpcId = string;

//# Schemas
export type ResourceToTag = "lambda-function" | (string & {});
export const ResourceToTag = S.String;
export type ResourceList = ResourceToTag[];
export const ResourceList = S.Array(ResourceToTag);
export type ProvisionedResourceCleanupSetting =
  | "AUTOMATIC"
  | "OFF"
  | (string & {});
export const ProvisionedResourceCleanupSetting = S.String;
export type DescribeCanariesNameFilter = string[];
export const DescribeCanariesNameFilter = S.Array(S.String);
export type DescribeCanariesLastRunNameFilter = string[];
export const DescribeCanariesLastRunNameFilter = S.Array(S.String);
export type BrowserType = "CHROME" | "FIREFOX" | (string & {});
export const BrowserType = S.String;
export type RunType = "CANARY_RUN" | "DRY_RUN" | (string & {});
export const RunType = S.String;
export type BaseScreenshotIgnoreCoordinates = string[];
export const BaseScreenshotIgnoreCoordinates = S.Array(S.String);
export interface BaseScreenshot {
  ScreenshotName: string;
  IgnoreCoordinates?: string[];
}
export const BaseScreenshot = S.suspend(() =>
  S.Struct({
    ScreenshotName: S.String,
    IgnoreCoordinates: S.optional(BaseScreenshotIgnoreCoordinates),
  }),
).annotations({
  identifier: "BaseScreenshot",
}) as any as S.Schema<BaseScreenshot>;
export type BaseScreenshots = BaseScreenshot[];
export const BaseScreenshots = S.Array(BaseScreenshot);
export interface VisualReferenceInput {
  BaseScreenshots?: BaseScreenshot[];
  BaseCanaryRunId: string;
  BrowserType?: BrowserType;
}
export const VisualReferenceInput = S.suspend(() =>
  S.Struct({
    BaseScreenshots: S.optional(BaseScreenshots),
    BaseCanaryRunId: S.String,
    BrowserType: S.optional(BrowserType),
  }),
).annotations({
  identifier: "VisualReferenceInput",
}) as any as S.Schema<VisualReferenceInput>;
export type VisualReferences = VisualReferenceInput[];
export const VisualReferences = S.Array(VisualReferenceInput);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateResourceRequest {
  GroupIdentifier: string;
  ResourceArn: string;
}
export const AssociateResourceRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/group/{GroupIdentifier}/associate" }),
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
export interface AssociateResourceResponse {}
export const AssociateResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateResourceResponse",
}) as any as S.Schema<AssociateResourceResponse>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateGroupRequest {
  Name: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Tags: S.optional(TagMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/group" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface DeleteCanaryRequest {
  Name: string;
  DeleteLambda?: boolean;
}
export const DeleteCanaryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    DeleteLambda: S.optional(S.Boolean).pipe(T.HttpQuery("deleteLambda")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/canary/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCanaryRequest",
}) as any as S.Schema<DeleteCanaryRequest>;
export interface DeleteCanaryResponse {}
export const DeleteCanaryResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteCanaryResponse",
}) as any as S.Schema<DeleteCanaryResponse>;
export interface DeleteGroupRequest {
  GroupIdentifier: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/group/{GroupIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResponse {}
export const DeleteGroupResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGroupResponse",
}) as any as S.Schema<DeleteGroupResponse>;
export interface DescribeCanariesRequest {
  NextToken?: string;
  MaxResults?: number;
  Names?: string[];
}
export const DescribeCanariesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Names: S.optional(DescribeCanariesNameFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCanariesRequest",
}) as any as S.Schema<DescribeCanariesRequest>;
export interface DescribeCanariesLastRunRequest {
  NextToken?: string;
  MaxResults?: number;
  Names?: string[];
  BrowserType?: BrowserType;
}
export const DescribeCanariesLastRunRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Names: S.optional(DescribeCanariesLastRunNameFilter),
    BrowserType: S.optional(BrowserType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canaries/last-run" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCanariesLastRunRequest",
}) as any as S.Schema<DescribeCanariesLastRunRequest>;
export interface DescribeRuntimeVersionsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRuntimeVersionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/runtime-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRuntimeVersionsRequest",
}) as any as S.Schema<DescribeRuntimeVersionsRequest>;
export interface DisassociateResourceRequest {
  GroupIdentifier: string;
  ResourceArn: string;
}
export const DisassociateResourceRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
    ResourceArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/group/{GroupIdentifier}/disassociate" }),
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
export interface DisassociateResourceResponse {}
export const DisassociateResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateResourceResponse",
}) as any as S.Schema<DisassociateResourceResponse>;
export interface GetCanaryRequest {
  Name: string;
  DryRunId?: string;
}
export const GetCanaryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    DryRunId: S.optional(S.String).pipe(T.HttpQuery("dryRunId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/canary/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCanaryRequest",
}) as any as S.Schema<GetCanaryRequest>;
export interface GetCanaryRunsRequest {
  Name: string;
  NextToken?: string;
  MaxResults?: number;
  DryRunId?: string;
  RunType?: RunType;
}
export const GetCanaryRunsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    DryRunId: S.optional(S.String),
    RunType: S.optional(RunType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canary/{Name}/runs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCanaryRunsRequest",
}) as any as S.Schema<GetCanaryRunsRequest>;
export interface GetGroupRequest {
  GroupIdentifier: string;
}
export const GetGroupRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/group/{GroupIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGroupRequest",
}) as any as S.Schema<GetGroupRequest>;
export interface ListAssociatedGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
  ResourceArn: string;
}
export const ListAssociatedGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resource/{ResourceArn}/groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedGroupsRequest",
}) as any as S.Schema<ListAssociatedGroupsRequest>;
export interface ListGroupResourcesRequest {
  NextToken?: string;
  MaxResults?: number;
  GroupIdentifier: string;
}
export const ListGroupResourcesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    GroupIdentifier: S.String.pipe(T.HttpLabel("GroupIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/group/{GroupIdentifier}/resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupResourcesRequest",
}) as any as S.Schema<ListGroupResourcesRequest>;
export interface ListGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
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
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
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
export interface StartCanaryRequest {
  Name: string;
}
export const StartCanaryRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canary/{Name}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCanaryRequest",
}) as any as S.Schema<StartCanaryRequest>;
export interface StartCanaryResponse {}
export const StartCanaryResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartCanaryResponse",
}) as any as S.Schema<StartCanaryResponse>;
export interface StopCanaryRequest {
  Name: string;
}
export const StopCanaryRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canary/{Name}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopCanaryRequest",
}) as any as S.Schema<StopCanaryRequest>;
export interface StopCanaryResponse {}
export const StopCanaryResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopCanaryResponse",
}) as any as S.Schema<StopCanaryResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type BlueprintTypes = string[];
export const BlueprintTypes = S.Array(S.String);
export type DependencyType = "LambdaLayer" | (string & {});
export const DependencyType = S.String;
export interface Dependency {
  Type?: DependencyType;
  Reference: string;
}
export const Dependency = S.suspend(() =>
  S.Struct({ Type: S.optional(DependencyType), Reference: S.String }),
).annotations({ identifier: "Dependency" }) as any as S.Schema<Dependency>;
export type Dependencies = Dependency[];
export const Dependencies = S.Array(Dependency);
export interface CanaryCodeInput {
  S3Bucket?: string;
  S3Key?: string;
  S3Version?: string;
  ZipFile?: Uint8Array;
  Handler?: string;
  BlueprintTypes?: string[];
  Dependencies?: Dependency[];
}
export const CanaryCodeInput = S.suspend(() =>
  S.Struct({
    S3Bucket: S.optional(S.String),
    S3Key: S.optional(S.String),
    S3Version: S.optional(S.String),
    ZipFile: S.optional(T.Blob),
    Handler: S.optional(S.String),
    BlueprintTypes: S.optional(BlueprintTypes),
    Dependencies: S.optional(Dependencies),
  }),
).annotations({
  identifier: "CanaryCodeInput",
}) as any as S.Schema<CanaryCodeInput>;
export interface RetryConfigInput {
  MaxRetries: number;
}
export const RetryConfigInput = S.suspend(() =>
  S.Struct({ MaxRetries: S.Number }),
).annotations({
  identifier: "RetryConfigInput",
}) as any as S.Schema<RetryConfigInput>;
export interface CanaryScheduleInput {
  Expression: string;
  DurationInSeconds?: number;
  RetryConfig?: RetryConfigInput;
}
export const CanaryScheduleInput = S.suspend(() =>
  S.Struct({
    Expression: S.String,
    DurationInSeconds: S.optional(S.Number),
    RetryConfig: S.optional(RetryConfigInput),
  }),
).annotations({
  identifier: "CanaryScheduleInput",
}) as any as S.Schema<CanaryScheduleInput>;
export type EnvironmentVariablesMap = { [key: string]: string | undefined };
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CanaryRunConfigInput {
  TimeoutInSeconds?: number;
  MemoryInMB?: number;
  ActiveTracing?: boolean;
  EnvironmentVariables?: { [key: string]: string | undefined };
  EphemeralStorage?: number;
}
export const CanaryRunConfigInput = S.suspend(() =>
  S.Struct({
    TimeoutInSeconds: S.optional(S.Number),
    MemoryInMB: S.optional(S.Number),
    ActiveTracing: S.optional(S.Boolean),
    EnvironmentVariables: S.optional(EnvironmentVariablesMap),
    EphemeralStorage: S.optional(S.Number),
  }),
).annotations({
  identifier: "CanaryRunConfigInput",
}) as any as S.Schema<CanaryRunConfigInput>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfigInput {
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
  Ipv6AllowedForDualStack?: boolean;
}
export const VpcConfigInput = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Ipv6AllowedForDualStack: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VpcConfigInput",
}) as any as S.Schema<VpcConfigInput>;
export type EncryptionMode = "SSE_S3" | "SSE_KMS" | (string & {});
export const EncryptionMode = S.String;
export interface S3EncryptionConfig {
  EncryptionMode?: EncryptionMode;
  KmsKeyArn?: string;
}
export const S3EncryptionConfig = S.suspend(() =>
  S.Struct({
    EncryptionMode: S.optional(EncryptionMode),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "S3EncryptionConfig",
}) as any as S.Schema<S3EncryptionConfig>;
export interface ArtifactConfigInput {
  S3Encryption?: S3EncryptionConfig;
}
export const ArtifactConfigInput = S.suspend(() =>
  S.Struct({ S3Encryption: S.optional(S3EncryptionConfig) }),
).annotations({
  identifier: "ArtifactConfigInput",
}) as any as S.Schema<ArtifactConfigInput>;
export interface BrowserConfig {
  BrowserType?: BrowserType;
}
export const BrowserConfig = S.suspend(() =>
  S.Struct({ BrowserType: S.optional(BrowserType) }),
).annotations({
  identifier: "BrowserConfig",
}) as any as S.Schema<BrowserConfig>;
export type BrowserConfigs = BrowserConfig[];
export const BrowserConfigs = S.Array(BrowserConfig);
export interface UpdateCanaryRequest {
  Name: string;
  Code?: CanaryCodeInput;
  ExecutionRoleArn?: string;
  RuntimeVersion?: string;
  Schedule?: CanaryScheduleInput;
  RunConfig?: CanaryRunConfigInput;
  SuccessRetentionPeriodInDays?: number;
  FailureRetentionPeriodInDays?: number;
  VpcConfig?: VpcConfigInput;
  VisualReference?: VisualReferenceInput;
  ArtifactS3Location?: string;
  ArtifactConfig?: ArtifactConfigInput;
  ProvisionedResourceCleanup?: ProvisionedResourceCleanupSetting;
  DryRunId?: string;
  VisualReferences?: VisualReferenceInput[];
  BrowserConfigs?: BrowserConfig[];
}
export const UpdateCanaryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Code: S.optional(CanaryCodeInput),
    ExecutionRoleArn: S.optional(S.String),
    RuntimeVersion: S.optional(S.String),
    Schedule: S.optional(CanaryScheduleInput),
    RunConfig: S.optional(CanaryRunConfigInput),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    VpcConfig: S.optional(VpcConfigInput),
    VisualReference: S.optional(VisualReferenceInput),
    ArtifactS3Location: S.optional(S.String),
    ArtifactConfig: S.optional(ArtifactConfigInput),
    ProvisionedResourceCleanup: S.optional(ProvisionedResourceCleanupSetting),
    DryRunId: S.optional(S.String),
    VisualReferences: S.optional(VisualReferences),
    BrowserConfigs: S.optional(BrowserConfigs),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/canary/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCanaryRequest",
}) as any as S.Schema<UpdateCanaryRequest>;
export interface UpdateCanaryResponse {}
export const UpdateCanaryResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateCanaryResponse",
}) as any as S.Schema<UpdateCanaryResponse>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface CanaryCodeOutput {
  SourceLocationArn?: string;
  Handler?: string;
  BlueprintTypes?: string[];
  Dependencies?: Dependency[];
}
export const CanaryCodeOutput = S.suspend(() =>
  S.Struct({
    SourceLocationArn: S.optional(S.String),
    Handler: S.optional(S.String),
    BlueprintTypes: S.optional(BlueprintTypes),
    Dependencies: S.optional(Dependencies),
  }),
).annotations({
  identifier: "CanaryCodeOutput",
}) as any as S.Schema<CanaryCodeOutput>;
export interface RetryConfigOutput {
  MaxRetries?: number;
}
export const RetryConfigOutput = S.suspend(() =>
  S.Struct({ MaxRetries: S.optional(S.Number) }),
).annotations({
  identifier: "RetryConfigOutput",
}) as any as S.Schema<RetryConfigOutput>;
export interface CanaryScheduleOutput {
  Expression?: string;
  DurationInSeconds?: number;
  RetryConfig?: RetryConfigOutput;
}
export const CanaryScheduleOutput = S.suspend(() =>
  S.Struct({
    Expression: S.optional(S.String),
    DurationInSeconds: S.optional(S.Number),
    RetryConfig: S.optional(RetryConfigOutput),
  }),
).annotations({
  identifier: "CanaryScheduleOutput",
}) as any as S.Schema<CanaryScheduleOutput>;
export interface CanaryRunConfigOutput {
  TimeoutInSeconds?: number;
  MemoryInMB?: number;
  ActiveTracing?: boolean;
  EphemeralStorage?: number;
}
export const CanaryRunConfigOutput = S.suspend(() =>
  S.Struct({
    TimeoutInSeconds: S.optional(S.Number),
    MemoryInMB: S.optional(S.Number),
    ActiveTracing: S.optional(S.Boolean),
    EphemeralStorage: S.optional(S.Number),
  }),
).annotations({
  identifier: "CanaryRunConfigOutput",
}) as any as S.Schema<CanaryRunConfigOutput>;
export type CanaryState =
  | "CREATING"
  | "READY"
  | "STARTING"
  | "RUNNING"
  | "UPDATING"
  | "STOPPING"
  | "STOPPED"
  | "ERROR"
  | "DELETING"
  | (string & {});
export const CanaryState = S.String;
export type CanaryStateReasonCode =
  | "INVALID_PERMISSIONS"
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "UPDATE_PENDING"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_COMPLETE"
  | "ROLLBACK_COMPLETE"
  | "ROLLBACK_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED"
  | "SYNC_DELETE_IN_PROGRESS"
  | (string & {});
export const CanaryStateReasonCode = S.String;
export interface CanaryStatus {
  State?: CanaryState;
  StateReason?: string;
  StateReasonCode?: CanaryStateReasonCode;
}
export const CanaryStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(CanaryState),
    StateReason: S.optional(S.String),
    StateReasonCode: S.optional(CanaryStateReasonCode),
  }),
).annotations({ identifier: "CanaryStatus" }) as any as S.Schema<CanaryStatus>;
export interface CanaryTimeline {
  Created?: Date;
  LastModified?: Date;
  LastStarted?: Date;
  LastStopped?: Date;
}
export const CanaryTimeline = S.suspend(() =>
  S.Struct({
    Created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastStarted: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastStopped: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CanaryTimeline",
}) as any as S.Schema<CanaryTimeline>;
export interface VpcConfigOutput {
  VpcId?: string;
  SubnetIds?: string[];
  SecurityGroupIds?: string[];
  Ipv6AllowedForDualStack?: boolean;
}
export const VpcConfigOutput = S.suspend(() =>
  S.Struct({
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Ipv6AllowedForDualStack: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VpcConfigOutput",
}) as any as S.Schema<VpcConfigOutput>;
export interface VisualReferenceOutput {
  BaseScreenshots?: BaseScreenshot[];
  BaseCanaryRunId?: string;
  BrowserType?: BrowserType;
}
export const VisualReferenceOutput = S.suspend(() =>
  S.Struct({
    BaseScreenshots: S.optional(BaseScreenshots),
    BaseCanaryRunId: S.optional(S.String),
    BrowserType: S.optional(BrowserType),
  }),
).annotations({
  identifier: "VisualReferenceOutput",
}) as any as S.Schema<VisualReferenceOutput>;
export interface EngineConfig {
  EngineArn?: string;
  BrowserType?: BrowserType;
}
export const EngineConfig = S.suspend(() =>
  S.Struct({
    EngineArn: S.optional(S.String),
    BrowserType: S.optional(BrowserType),
  }),
).annotations({ identifier: "EngineConfig" }) as any as S.Schema<EngineConfig>;
export type EngineConfigs = EngineConfig[];
export const EngineConfigs = S.Array(EngineConfig);
export type VisualReferencesOutput = VisualReferenceOutput[];
export const VisualReferencesOutput = S.Array(VisualReferenceOutput);
export interface ArtifactConfigOutput {
  S3Encryption?: S3EncryptionConfig;
}
export const ArtifactConfigOutput = S.suspend(() =>
  S.Struct({ S3Encryption: S.optional(S3EncryptionConfig) }),
).annotations({
  identifier: "ArtifactConfigOutput",
}) as any as S.Schema<ArtifactConfigOutput>;
export interface DryRunConfigOutput {
  DryRunId?: string;
  LastDryRunExecutionStatus?: string;
}
export const DryRunConfigOutput = S.suspend(() =>
  S.Struct({
    DryRunId: S.optional(S.String),
    LastDryRunExecutionStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "DryRunConfigOutput",
}) as any as S.Schema<DryRunConfigOutput>;
export interface Canary {
  Id?: string;
  Name?: string;
  Code?: CanaryCodeOutput;
  ExecutionRoleArn?: string;
  Schedule?: CanaryScheduleOutput;
  RunConfig?: CanaryRunConfigOutput;
  SuccessRetentionPeriodInDays?: number;
  FailureRetentionPeriodInDays?: number;
  Status?: CanaryStatus;
  Timeline?: CanaryTimeline;
  ArtifactS3Location?: string;
  EngineArn?: string;
  RuntimeVersion?: string;
  VpcConfig?: VpcConfigOutput;
  VisualReference?: VisualReferenceOutput;
  ProvisionedResourceCleanup?: ProvisionedResourceCleanupSetting;
  BrowserConfigs?: BrowserConfig[];
  EngineConfigs?: EngineConfig[];
  VisualReferences?: VisualReferenceOutput[];
  Tags?: { [key: string]: string | undefined };
  ArtifactConfig?: ArtifactConfigOutput;
  DryRunConfig?: DryRunConfigOutput;
}
export const Canary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Code: S.optional(CanaryCodeOutput),
    ExecutionRoleArn: S.optional(S.String),
    Schedule: S.optional(CanaryScheduleOutput),
    RunConfig: S.optional(CanaryRunConfigOutput),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    Status: S.optional(CanaryStatus),
    Timeline: S.optional(CanaryTimeline),
    ArtifactS3Location: S.optional(S.String),
    EngineArn: S.optional(S.String),
    RuntimeVersion: S.optional(S.String),
    VpcConfig: S.optional(VpcConfigOutput),
    VisualReference: S.optional(VisualReferenceOutput),
    ProvisionedResourceCleanup: S.optional(ProvisionedResourceCleanupSetting),
    BrowserConfigs: S.optional(BrowserConfigs),
    EngineConfigs: S.optional(EngineConfigs),
    VisualReferences: S.optional(VisualReferencesOutput),
    Tags: S.optional(TagMap),
    ArtifactConfig: S.optional(ArtifactConfigOutput),
    DryRunConfig: S.optional(DryRunConfigOutput),
  }),
).annotations({ identifier: "Canary" }) as any as S.Schema<Canary>;
export interface GetCanaryResponse {
  Canary?: Canary;
}
export const GetCanaryResponse = S.suspend(() =>
  S.Struct({ Canary: S.optional(Canary) }),
).annotations({
  identifier: "GetCanaryResponse",
}) as any as S.Schema<GetCanaryResponse>;
export interface Group {
  Id?: string;
  Name?: string;
  Arn?: string;
  Tags?: { [key: string]: string | undefined };
  CreatedTime?: Date;
  LastModifiedTime?: Date;
}
export const Group = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Tags: S.optional(TagMap),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export interface GetGroupResponse {
  Group?: Group;
}
export const GetGroupResponse = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "GetGroupResponse",
}) as any as S.Schema<GetGroupResponse>;
export interface ListGroupResourcesResponse {
  Resources?: string[];
  NextToken?: string;
}
export const ListGroupResourcesResponse = S.suspend(() =>
  S.Struct({
    Resources: S.optional(StringList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupResourcesResponse",
}) as any as S.Schema<ListGroupResourcesResponse>;
export interface GroupSummary {
  Id?: string;
  Name?: string;
  Arn?: string;
}
export const GroupSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "GroupSummary" }) as any as S.Schema<GroupSummary>;
export type GroupSummaryList = GroupSummary[];
export const GroupSummaryList = S.Array(GroupSummary);
export interface ListGroupsResponse {
  Groups?: GroupSummary[];
  NextToken?: string;
}
export const ListGroupsResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupsResponse",
}) as any as S.Schema<ListGroupsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type CanaryRunState = "RUNNING" | "PASSED" | "FAILED" | (string & {});
export const CanaryRunState = S.String;
export type CanaryRunStateReasonCode =
  | "CANARY_FAILURE"
  | "EXECUTION_FAILURE"
  | (string & {});
export const CanaryRunStateReasonCode = S.String;
export type CanaryRunTestResult =
  | "PASSED"
  | "FAILED"
  | "UNKNOWN"
  | (string & {});
export const CanaryRunTestResult = S.String;
export interface CanaryRunStatus {
  State?: CanaryRunState;
  StateReason?: string;
  StateReasonCode?: CanaryRunStateReasonCode;
  TestResult?: CanaryRunTestResult;
}
export const CanaryRunStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(CanaryRunState),
    StateReason: S.optional(S.String),
    StateReasonCode: S.optional(CanaryRunStateReasonCode),
    TestResult: S.optional(CanaryRunTestResult),
  }),
).annotations({
  identifier: "CanaryRunStatus",
}) as any as S.Schema<CanaryRunStatus>;
export interface CanaryRunTimeline {
  Started?: Date;
  Completed?: Date;
  MetricTimestampForRunAndRetries?: Date;
}
export const CanaryRunTimeline = S.suspend(() =>
  S.Struct({
    Started: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Completed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MetricTimestampForRunAndRetries: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CanaryRunTimeline",
}) as any as S.Schema<CanaryRunTimeline>;
export interface CanaryDryRunConfigOutput {
  DryRunId?: string;
}
export const CanaryDryRunConfigOutput = S.suspend(() =>
  S.Struct({ DryRunId: S.optional(S.String) }),
).annotations({
  identifier: "CanaryDryRunConfigOutput",
}) as any as S.Schema<CanaryDryRunConfigOutput>;
export interface CanaryRun {
  Id?: string;
  ScheduledRunId?: string;
  RetryAttempt?: number;
  Name?: string;
  Status?: CanaryRunStatus;
  Timeline?: CanaryRunTimeline;
  ArtifactS3Location?: string;
  DryRunConfig?: CanaryDryRunConfigOutput;
  BrowserType?: BrowserType;
}
export const CanaryRun = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ScheduledRunId: S.optional(S.String),
    RetryAttempt: S.optional(S.Number),
    Name: S.optional(S.String),
    Status: S.optional(CanaryRunStatus),
    Timeline: S.optional(CanaryRunTimeline),
    ArtifactS3Location: S.optional(S.String),
    DryRunConfig: S.optional(CanaryDryRunConfigOutput),
    BrowserType: S.optional(BrowserType),
  }),
).annotations({ identifier: "CanaryRun" }) as any as S.Schema<CanaryRun>;
export interface CanaryLastRun {
  CanaryName?: string;
  LastRun?: CanaryRun;
}
export const CanaryLastRun = S.suspend(() =>
  S.Struct({
    CanaryName: S.optional(S.String),
    LastRun: S.optional(CanaryRun),
  }),
).annotations({
  identifier: "CanaryLastRun",
}) as any as S.Schema<CanaryLastRun>;
export type CanariesLastRun = CanaryLastRun[];
export const CanariesLastRun = S.Array(CanaryLastRun);
export interface RuntimeVersion {
  VersionName?: string;
  Description?: string;
  ReleaseDate?: Date;
  DeprecationDate?: Date;
}
export const RuntimeVersion = S.suspend(() =>
  S.Struct({
    VersionName: S.optional(S.String),
    Description: S.optional(S.String),
    ReleaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeprecationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RuntimeVersion",
}) as any as S.Schema<RuntimeVersion>;
export type RuntimeVersionList = RuntimeVersion[];
export const RuntimeVersionList = S.Array(RuntimeVersion);
export interface CreateCanaryRequest {
  Name: string;
  Code: CanaryCodeInput;
  ArtifactS3Location: string;
  ExecutionRoleArn: string;
  Schedule: CanaryScheduleInput;
  RunConfig?: CanaryRunConfigInput;
  SuccessRetentionPeriodInDays?: number;
  FailureRetentionPeriodInDays?: number;
  RuntimeVersion: string;
  VpcConfig?: VpcConfigInput;
  ResourcesToReplicateTags?: ResourceToTag[];
  ProvisionedResourceCleanup?: ProvisionedResourceCleanupSetting;
  BrowserConfigs?: BrowserConfig[];
  Tags?: { [key: string]: string | undefined };
  ArtifactConfig?: ArtifactConfigInput;
}
export const CreateCanaryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Code: CanaryCodeInput,
    ArtifactS3Location: S.String,
    ExecutionRoleArn: S.String,
    Schedule: CanaryScheduleInput,
    RunConfig: S.optional(CanaryRunConfigInput),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    RuntimeVersion: S.String,
    VpcConfig: S.optional(VpcConfigInput),
    ResourcesToReplicateTags: S.optional(ResourceList),
    ProvisionedResourceCleanup: S.optional(ProvisionedResourceCleanupSetting),
    BrowserConfigs: S.optional(BrowserConfigs),
    Tags: S.optional(TagMap),
    ArtifactConfig: S.optional(ArtifactConfigInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCanaryRequest",
}) as any as S.Schema<CreateCanaryRequest>;
export interface CreateGroupResponse {
  Group?: Group;
}
export const CreateGroupResponse = S.suspend(() =>
  S.Struct({ Group: S.optional(Group) }),
).annotations({
  identifier: "CreateGroupResponse",
}) as any as S.Schema<CreateGroupResponse>;
export interface DescribeCanariesLastRunResponse {
  CanariesLastRun?: CanaryLastRun[];
  NextToken?: string;
}
export const DescribeCanariesLastRunResponse = S.suspend(() =>
  S.Struct({
    CanariesLastRun: S.optional(CanariesLastRun),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeCanariesLastRunResponse",
}) as any as S.Schema<DescribeCanariesLastRunResponse>;
export interface DescribeRuntimeVersionsResponse {
  RuntimeVersions?: RuntimeVersion[];
  NextToken?: string;
}
export const DescribeRuntimeVersionsResponse = S.suspend(() =>
  S.Struct({
    RuntimeVersions: S.optional(RuntimeVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRuntimeVersionsResponse",
}) as any as S.Schema<DescribeRuntimeVersionsResponse>;
export interface ListAssociatedGroupsResponse {
  Groups?: GroupSummary[];
  NextToken?: string;
}
export const ListAssociatedGroupsResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedGroupsResponse",
}) as any as S.Schema<ListAssociatedGroupsResponse>;
export interface StartCanaryDryRunRequest {
  Name: string;
  Code?: CanaryCodeInput;
  RuntimeVersion?: string;
  RunConfig?: CanaryRunConfigInput;
  VpcConfig?: VpcConfigInput;
  ExecutionRoleArn?: string;
  SuccessRetentionPeriodInDays?: number;
  FailureRetentionPeriodInDays?: number;
  VisualReference?: VisualReferenceInput;
  ArtifactS3Location?: string;
  ArtifactConfig?: ArtifactConfigInput;
  ProvisionedResourceCleanup?: ProvisionedResourceCleanupSetting;
  BrowserConfigs?: BrowserConfig[];
  VisualReferences?: VisualReferenceInput[];
}
export const StartCanaryDryRunRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Code: S.optional(CanaryCodeInput),
    RuntimeVersion: S.optional(S.String),
    RunConfig: S.optional(CanaryRunConfigInput),
    VpcConfig: S.optional(VpcConfigInput),
    ExecutionRoleArn: S.optional(S.String),
    SuccessRetentionPeriodInDays: S.optional(S.Number),
    FailureRetentionPeriodInDays: S.optional(S.Number),
    VisualReference: S.optional(VisualReferenceInput),
    ArtifactS3Location: S.optional(S.String),
    ArtifactConfig: S.optional(ArtifactConfigInput),
    ProvisionedResourceCleanup: S.optional(ProvisionedResourceCleanupSetting),
    BrowserConfigs: S.optional(BrowserConfigs),
    VisualReferences: S.optional(VisualReferences),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/canary/{Name}/dry-run/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCanaryDryRunRequest",
}) as any as S.Schema<StartCanaryDryRunRequest>;
export type CanaryRuns = CanaryRun[];
export const CanaryRuns = S.Array(CanaryRun);
export interface CreateCanaryResponse {
  Canary?: Canary;
}
export const CreateCanaryResponse = S.suspend(() =>
  S.Struct({ Canary: S.optional(Canary) }),
).annotations({
  identifier: "CreateCanaryResponse",
}) as any as S.Schema<CreateCanaryResponse>;
export interface GetCanaryRunsResponse {
  CanaryRuns?: CanaryRun[];
  NextToken?: string;
}
export const GetCanaryRunsResponse = S.suspend(() =>
  S.Struct({
    CanaryRuns: S.optional(CanaryRuns),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCanaryRunsResponse",
}) as any as S.Schema<GetCanaryRunsResponse>;
export interface StartCanaryDryRunResponse {
  DryRunConfig?: DryRunConfigOutput;
}
export const StartCanaryDryRunResponse = S.suspend(() =>
  S.Struct({ DryRunConfig: S.optional(DryRunConfigOutput) }),
).annotations({
  identifier: "StartCanaryDryRunResponse",
}) as any as S.Schema<StartCanaryDryRunResponse>;
export type Canaries = Canary[];
export const Canaries = S.Array(Canary);
export interface DescribeCanariesResponse {
  Canaries?: Canary[];
  NextToken?: string;
}
export const DescribeCanariesResponse = S.suspend(() =>
  S.Struct({ Canaries: S.optional(Canaries), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeCanariesResponse",
}) as any as S.Schema<DescribeCanariesResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestEntityTooLargeException extends S.TaggedError<RequestEntityTooLargeException>()(
  "RequestEntityTooLargeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Use this operation to see information from the most recent run of each canary that you have created.
 *
 * This operation supports resource-level authorization using an IAM policy and
 * the `Names` parameter. If you specify the `Names` parameter, the operation is successful only if you have authorization to view
 * all the canaries that you specify in your request. If you do not have permission to view any of
 * the canaries, the request fails with a 403 response.
 *
 * You are required to use the `Names` parameter if you are logged on to a user or role that has an
 * IAM policy that restricts which canaries that you are allowed to view. For more information,
 * see
 * Limiting a user to viewing specific canaries.
 */
export const describeCanariesLastRun: {
  (
    input: DescribeCanariesLastRunRequest,
  ): effect.Effect<
    DescribeCanariesLastRunResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCanariesLastRunRequest,
  ) => stream.Stream<
    DescribeCanariesLastRunResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCanariesLastRunRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCanariesLastRunRequest,
  output: DescribeCanariesLastRunResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of runs for a specified canary.
 */
export const getCanaryRuns: {
  (
    input: GetCanaryRunsRequest,
  ): effect.Effect<
    GetCanaryRunsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCanaryRunsRequest,
  ) => stream.Stream<
    GetCanaryRunsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCanaryRunsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCanaryRunsRequest,
  output: GetCanaryRunsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Use this operation to start a dry run for a canary that has already been created
 */
export const startCanaryDryRun: (
  input: StartCanaryDryRunRequest,
) => effect.Effect<
  StartCanaryDryRunResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCanaryDryRunRequest,
  output: StartCanaryDryRunResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of a canary that has already been created.
 *
 * For multibrowser canaries, you can add or remove browsers by updating the browserConfig list in the update call. For example:
 *
 * - To add Firefox to a canary that currently uses Chrome, specify browserConfigs as [CHROME, FIREFOX]
 *
 * - To remove Firefox and keep only Chrome, specify browserConfigs as [CHROME]
 *
 * You can't use this operation to update the tags of an existing canary. To change the tags of an existing canary, use
 * TagResource.
 *
 * When you use the `dryRunId` field when updating a canary, the only other field you can provide is the `Schedule`. Adding any other field will thrown an exception.
 */
export const updateCanary: (
  input: UpdateCanaryRequest,
) => effect.Effect<
  UpdateCanaryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | RequestEntityTooLargeException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCanaryRequest,
  output: UpdateCanaryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    RequestEntityTooLargeException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the groups that the specified canary is associated with. The canary
 * that you specify must be in the current Region.
 */
export const listAssociatedGroups: {
  (
    input: ListAssociatedGroupsRequest,
  ): effect.Effect<
    ListAssociatedGroupsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedGroupsRequest,
  ) => stream.Stream<
    ListAssociatedGroupsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedGroupsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedGroupsRequest,
  output: ListAssociatedGroupsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about one group. Groups are a global resource, so you can use this operation from
 * any Region.
 */
export const getGroup: (
  input: GetGroupRequest,
) => effect.Effect<
  GetGroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * This operation returns a list of the ARNs of the canaries that are associated with the specified group.
 */
export const listGroupResources: {
  (
    input: ListGroupResourcesRequest,
  ): effect.Effect<
    ListGroupResourcesResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupResourcesRequest,
  ) => stream.Stream<
    ListGroupResourcesResponse,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupResourcesRequest,
  ) => stream.Stream<
    unknown,
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupResourcesRequest,
  output: ListGroupResourcesResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Permanently deletes the specified canary.
 *
 * If the canary's `ProvisionedResourceCleanup` field is set to `AUTOMATIC`
 * or you specify `DeleteLambda` in this operation as `true`, CloudWatch Synthetics also deletes
 * the Lambda functions and layers that are used by the canary.
 *
 * Other resources used and created by the canary are not automatically deleted.
 * After you delete a canary, you
 * should also delete the following:
 *
 * - The CloudWatch alarms created for this canary. These alarms have a name of
 * Synthetics-Alarm-*first-198-characters-of-canary-name*-*canaryId*-*alarm number*
 *
 * - Amazon S3 objects and buckets, such as the canary's artifact location.
 *
 * - IAM roles created for the canary. If they were created in the console, these roles
 * have the name
 * role/service-role/CloudWatchSyntheticsRole-*First-21-Characters-of-CanaryName*
 *
 * - CloudWatch Logs log groups created for the canary. These logs groups have the name
 * /aws/lambda/cwsyn-*First-21-Characters-of-CanaryName*
 *
 * Before you delete a canary, you might want to use `GetCanary` to display
 * the information about this canary. Make
 * note of the information returned by this operation so that you can delete these resources
 * after you delete the canary.
 */
export const deleteCanary: (
  input: DeleteCanaryRequest,
) => effect.Effect<
  DeleteCanaryResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCanaryRequest,
  output: DeleteCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a group. The group doesn't need to be empty to be deleted. If there are canaries in the group,
 * they are not deleted when you delete the group.
 *
 * Groups are a global resource that appear in all Regions, but the request to delete a group
 * must be made from its home Region. You can find the home Region of a group within its ARN.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => effect.Effect<
  DeleteGroupResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a canary from a group. You must run this operation in the Region where the canary exists.
 */
export const disassociateResource: (
  input: DisassociateResourceRequest,
) => effect.Effect<
  DisassociateResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateResourceRequest,
  output: DisassociateResourceResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Use this operation to run a canary that has already been created.
 * The frequency of the canary runs is determined by the value of the canary's `Schedule`. To see a canary's schedule,
 * use GetCanary.
 */
export const startCanary: (
  input: StartCanaryRequest,
) => effect.Effect<
  StartCanaryResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCanaryRequest,
  output: StartCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops the canary to prevent all future runs. If the canary is currently running,the
 * run that is in progress completes on its own, publishes metrics, and uploads artifacts, but
 * it is not recorded in Synthetics as a completed run.
 *
 * You can use `StartCanary` to start it running again
 * with the canary’s current schedule at any point in the future.
 */
export const stopCanary: (
  input: StopCanaryRequest,
) => effect.Effect<
  StopCanaryResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCanaryRequest,
  output: StopCanaryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a canary with a group. Using groups can help you with
 * managing and automating your canaries, and you can also view aggregated run results and statistics
 * for all canaries in a group.
 *
 * You must run this operation in the Region where the canary exists.
 */
export const associateResource: (
  input: AssociateResourceRequest,
) => effect.Effect<
  AssociateResourceResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
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
    ValidationException,
  ],
}));
/**
 * Returns a list of Synthetics canary runtime versions. For more information,
 * see
 * Canary Runtime Versions.
 */
export const describeRuntimeVersions: {
  (
    input: DescribeRuntimeVersionsRequest,
  ): effect.Effect<
    DescribeRuntimeVersionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRuntimeVersionsRequest,
  ) => stream.Stream<
    DescribeRuntimeVersionsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRuntimeVersionsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRuntimeVersionsRequest,
  output: DescribeRuntimeVersionsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves complete information about one canary. You must specify
 * the name of the canary that you want. To get a list of canaries
 * and their names, use DescribeCanaries.
 */
export const getCanary: (
  input: GetCanaryRequest,
) => effect.Effect<
  GetCanaryResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCanaryRequest,
  output: GetCanaryResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Returns a list of all groups in the account, displaying their names, unique IDs, and ARNs. The groups
 * from all Regions are returned.
 */
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): effect.Effect<
    ListGroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    ListGroupsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a group which you can use to associate canaries with each other, including cross-Region
 * canaries. Using groups can help you with
 * managing and automating your canaries, and you can also view aggregated run results and statistics
 * for all canaries in a group.
 *
 * Groups are global resources. When you create a group, it is replicated across Amazon Web Services Regions, and
 * you can view it and add canaries to it from any Region.
 * Although the group ARN format reflects the Region name where it was created, a group is not constrained to any Region.
 * This means that you can put canaries from multiple Regions into the same group, and then use
 * that group to view and manage all of those canaries in a single view.
 *
 * Groups are supported in all Regions except the Regions that are disabled by default. For more information
 * about these Regions, see Enabling a Region.
 *
 * Each group can contain as many as 10 canaries. You can have as many as 20 groups in your account. Any single canary
 * can be a member of up to 10 groups.
 */
export const createGroup: (
  input: CreateGroupRequest,
) => effect.Effect<
  CreateGroupResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a canary. Canaries are scripts that monitor your endpoints and APIs from the
 * outside-in. Canaries help you check the availability and latency of your web services and
 * troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and
 * metrics. You can set up a canary to run continuously or just once.
 *
 * Do not use `CreateCanary` to modify an existing canary. Use UpdateCanary instead.
 *
 * To create canaries, you must have the `CloudWatchSyntheticsFullAccess` policy.
 * If you are creating a new IAM role for the canary, you also need the
 * `iam:CreateRole`, `iam:CreatePolicy` and
 * `iam:AttachRolePolicy` permissions. For more information, see Necessary
 * Roles and Permissions.
 *
 * Do not include secrets or proprietary information in your canary names. The canary name
 * makes up part of the Amazon Resource Name (ARN) for the canary, and the ARN is included in
 * outbound calls over the internet. For more information, see Security
 * Considerations for Synthetics Canaries.
 */
export const createCanary: (
  input: CreateCanaryRequest,
) => effect.Effect<
  CreateCanaryResponse,
  | InternalServerException
  | RequestEntityTooLargeException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCanaryRequest,
  output: CreateCanaryResponse,
  errors: [
    InternalServerException,
    RequestEntityTooLargeException,
    ValidationException,
  ],
}));
/**
 * This operation returns a list of the canaries in your account, along with full details
 * about each canary.
 *
 * This operation supports resource-level authorization using an IAM policy and
 * the `Names` parameter. If you specify the `Names` parameter, the operation is successful only if you have authorization to view
 * all the canaries that you specify in your request. If you do not have permission to view any of
 * the canaries, the request fails with a 403 response.
 *
 * You are required to use the `Names` parameter if you are logged on to a user or role that has an
 * IAM policy that restricts which canaries that you are allowed to view. For more information,
 * see
 * Limiting a user to viewing specific canaries.
 */
export const describeCanaries: {
  (
    input: DescribeCanariesRequest,
  ): effect.Effect<
    DescribeCanariesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCanariesRequest,
  ) => stream.Stream<
    DescribeCanariesResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCanariesRequest,
  ) => stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCanariesRequest,
  output: DescribeCanariesResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified canary or group.
 *
 * Tags can help you organize and categorize your
 * resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with
 * certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If you specify a new
 * tag key for the resource,
 * this tag is appended to the list of tags associated
 * with the resource. If you specify a tag key that is already associated with the resource, the new tag
 * value that you specify replaces
 * the previous value for that tag.
 *
 * You can associate as many as 50 tags with a canary or group.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Displays the tags associated with a canary or group.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ConflictException
  | InternalFailureException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalFailureException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));

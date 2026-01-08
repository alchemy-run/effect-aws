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
  "http://analytics.kinesis.amazonaws.com/doc/2018-05-23",
);
const svc = T.AwsApiService({
  sdkId: "Kinesis Analytics V2",
  serviceShapeName: "KinesisAnalytics_20180523",
});
const auth = T.AwsAuthSigv4({ name: "kinesisanalytics" });
const ver = T.ServiceVersion("2018-05-23");
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
              `https://kinesisanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://kinesisanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://kinesisanalytics.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://kinesisanalytics.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationName = string;
export type ApplicationVersionId = number;
export type ConditionalToken = string;
export type Id = string;
export type ApplicationDescription = string;
export type RoleARN = string;
export type SessionExpirationDurationInSeconds = number;
export type SnapshotName = string;
export type OperationId = string;
export type ResourceARN = string;
export type ListApplicationOperationsInputLimit = number;
export type NextToken = string;
export type Operation = string;
export type ListApplicationsInputLimit = number;
export type ListSnapshotsInputLimit = number;
export type ListApplicationVersionsInputLimit = number;
export type KinesisAnalyticsARN = string;
export type TagKey = string;
export type LogStreamARN = string;
export type InAppStreamName = string;
export type InAppTableName = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type TagValue = string;
export type BucketARN = string;
export type FileKey = string;
export type ApplicationMaintenanceWindowStartTime = string;
export type AuthorizedUrl = string;
export type ErrorMessage = string;
export type InputParallelismCount = number;
export type RecordEncoding = string;
export type KeyId = string;
export type RecordColumnName = string;
export type RecordColumnMapping = string;
export type RecordColumnSqlType = string;
export type CheckpointInterval = number;
export type MinPauseBetweenCheckpoints = number;
export type Parallelism = number;
export type ParallelismPerKPU = number;
export type TextContent = string;
export type ZipFileContent = Uint8Array;
export type ParsedInputRecordField = string;
export type ProcessedInputRecord = string;
export type RawInputRecord = string;
export type ApplicationMaintenanceWindowEndTime = string;
export type PropertyKey = string;
export type PropertyValue = string;
export type ObjectVersion = string;
export type DatabaseARN = string;
export type BasePath = string;
export type MavenGroupId = string;
export type MavenArtifactId = string;
export type MavenVersion = string;
export type VpcId = string;
export type JobPlanDescription = string;
export type ErrorString = string;
export type RecordRowPath = string;
export type RecordRowDelimiter = string;
export type RecordColumnDelimiter = string;
export type CodeMD5 = string;
export type CodeSize = number;

//# Schemas
export type RuntimeEnvironment =
  | "SQL-1_0"
  | "FLINK-1_6"
  | "FLINK-1_8"
  | "ZEPPELIN-FLINK-1_0"
  | "FLINK-1_11"
  | "FLINK-1_13"
  | "ZEPPELIN-FLINK-2_0"
  | "FLINK-1_15"
  | "ZEPPELIN-FLINK-3_0"
  | "FLINK-1_18"
  | "FLINK-1_19"
  | "FLINK-1_20";
export const RuntimeEnvironment = S.Literal(
  "SQL-1_0",
  "FLINK-1_6",
  "FLINK-1_8",
  "ZEPPELIN-FLINK-1_0",
  "FLINK-1_11",
  "FLINK-1_13",
  "ZEPPELIN-FLINK-2_0",
  "FLINK-1_15",
  "ZEPPELIN-FLINK-3_0",
  "FLINK-1_18",
  "FLINK-1_19",
  "FLINK-1_20",
);
export interface CloudWatchLoggingOption {
  LogStreamARN: string;
}
export const CloudWatchLoggingOption = S.suspend(() =>
  S.Struct({ LogStreamARN: S.String }),
).annotations({
  identifier: "CloudWatchLoggingOption",
}) as any as S.Schema<CloudWatchLoggingOption>;
export type CloudWatchLoggingOptions = CloudWatchLoggingOption[];
export const CloudWatchLoggingOptions = S.Array(CloudWatchLoggingOption);
export type ApplicationMode = "STREAMING" | "INTERACTIVE";
export const ApplicationMode = S.Literal("STREAMING", "INTERACTIVE");
export type UrlType = "FLINK_DASHBOARD_URL" | "ZEPPELIN_UI_URL";
export const UrlType = S.Literal("FLINK_DASHBOARD_URL", "ZEPPELIN_UI_URL");
export type OperationStatus =
  | "IN_PROGRESS"
  | "CANCELLED"
  | "SUCCESSFUL"
  | "FAILED";
export const OperationStatus = S.Literal(
  "IN_PROGRESS",
  "CANCELLED",
  "SUCCESSFUL",
  "FAILED",
);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface CreateApplicationPresignedUrlRequest {
  ApplicationName: string;
  UrlType: UrlType;
  SessionExpirationDurationInSeconds?: number;
}
export const CreateApplicationPresignedUrlRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    UrlType: UrlType,
    SessionExpirationDurationInSeconds: S.optional(S.Number),
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
  identifier: "CreateApplicationPresignedUrlRequest",
}) as any as S.Schema<CreateApplicationPresignedUrlRequest>;
export interface CreateApplicationSnapshotRequest {
  ApplicationName: string;
  SnapshotName: string;
}
export const CreateApplicationSnapshotRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, SnapshotName: S.String }).pipe(
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
  identifier: "CreateApplicationSnapshotRequest",
}) as any as S.Schema<CreateApplicationSnapshotRequest>;
export interface CreateApplicationSnapshotResponse {}
export const CreateApplicationSnapshotResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateApplicationSnapshotResponse",
}) as any as S.Schema<CreateApplicationSnapshotResponse>;
export interface DeleteApplicationRequest {
  ApplicationName: string;
  CreateTimestamp: Date;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CreateTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
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
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteApplicationCloudWatchLoggingOptionRequest {
  ApplicationName: string;
  CurrentApplicationVersionId?: number;
  CloudWatchLoggingOptionId: string;
  ConditionalToken?: string;
}
export const DeleteApplicationCloudWatchLoggingOptionRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionId: S.String,
    ConditionalToken: S.optional(S.String),
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
  identifier: "DeleteApplicationCloudWatchLoggingOptionRequest",
}) as any as S.Schema<DeleteApplicationCloudWatchLoggingOptionRequest>;
export interface DeleteApplicationInputProcessingConfigurationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  InputId: string;
}
export const DeleteApplicationInputProcessingConfigurationRequest = S.suspend(
  () =>
    S.Struct({
      ApplicationName: S.String,
      CurrentApplicationVersionId: S.Number,
      InputId: S.String,
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
  identifier: "DeleteApplicationInputProcessingConfigurationRequest",
}) as any as S.Schema<DeleteApplicationInputProcessingConfigurationRequest>;
export interface DeleteApplicationOutputRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  OutputId: string;
}
export const DeleteApplicationOutputRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    OutputId: S.String,
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
  identifier: "DeleteApplicationOutputRequest",
}) as any as S.Schema<DeleteApplicationOutputRequest>;
export interface DeleteApplicationReferenceDataSourceRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  ReferenceId: string;
}
export const DeleteApplicationReferenceDataSourceRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ReferenceId: S.String,
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
  identifier: "DeleteApplicationReferenceDataSourceRequest",
}) as any as S.Schema<DeleteApplicationReferenceDataSourceRequest>;
export interface DeleteApplicationSnapshotRequest {
  ApplicationName: string;
  SnapshotName: string;
  SnapshotCreationTimestamp: Date;
}
export const DeleteApplicationSnapshotRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    SnapshotName: S.String,
    SnapshotCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
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
  identifier: "DeleteApplicationSnapshotRequest",
}) as any as S.Schema<DeleteApplicationSnapshotRequest>;
export interface DeleteApplicationSnapshotResponse {}
export const DeleteApplicationSnapshotResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationSnapshotResponse",
}) as any as S.Schema<DeleteApplicationSnapshotResponse>;
export interface DeleteApplicationVpcConfigurationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId?: number;
  VpcConfigurationId: string;
  ConditionalToken?: string;
}
export const DeleteApplicationVpcConfigurationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    VpcConfigurationId: S.String,
    ConditionalToken: S.optional(S.String),
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
  identifier: "DeleteApplicationVpcConfigurationRequest",
}) as any as S.Schema<DeleteApplicationVpcConfigurationRequest>;
export interface DescribeApplicationRequest {
  ApplicationName: string;
  IncludeAdditionalDetails?: boolean;
}
export const DescribeApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    IncludeAdditionalDetails: S.optional(S.Boolean),
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
  identifier: "DescribeApplicationRequest",
}) as any as S.Schema<DescribeApplicationRequest>;
export interface DescribeApplicationOperationRequest {
  ApplicationName: string;
  OperationId: string;
}
export const DescribeApplicationOperationRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, OperationId: S.String }).pipe(
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
  identifier: "DescribeApplicationOperationRequest",
}) as any as S.Schema<DescribeApplicationOperationRequest>;
export interface DescribeApplicationSnapshotRequest {
  ApplicationName: string;
  SnapshotName: string;
}
export const DescribeApplicationSnapshotRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, SnapshotName: S.String }).pipe(
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
  identifier: "DescribeApplicationSnapshotRequest",
}) as any as S.Schema<DescribeApplicationSnapshotRequest>;
export interface DescribeApplicationVersionRequest {
  ApplicationName: string;
  ApplicationVersionId: number;
}
export const DescribeApplicationVersionRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, ApplicationVersionId: S.Number }).pipe(
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
  identifier: "DescribeApplicationVersionRequest",
}) as any as S.Schema<DescribeApplicationVersionRequest>;
export interface ListApplicationOperationsRequest {
  ApplicationName: string;
  Limit?: number;
  NextToken?: string;
  Operation?: string;
  OperationStatus?: OperationStatus;
}
export const ListApplicationOperationsRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Operation: S.optional(S.String),
    OperationStatus: S.optional(OperationStatus),
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
  identifier: "ListApplicationOperationsRequest",
}) as any as S.Schema<ListApplicationOperationsRequest>;
export interface ListApplicationsRequest {
  Limit?: number;
  NextToken?: string;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
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
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListApplicationSnapshotsRequest {
  ApplicationName: string;
  Limit?: number;
  NextToken?: string;
}
export const ListApplicationSnapshotsRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
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
  identifier: "ListApplicationSnapshotsRequest",
}) as any as S.Schema<ListApplicationSnapshotsRequest>;
export interface ListApplicationVersionsRequest {
  ApplicationName: string;
  Limit?: number;
  NextToken?: string;
}
export const ListApplicationVersionsRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
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
  identifier: "ListApplicationVersionsRequest",
}) as any as S.Schema<ListApplicationVersionsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface RollbackApplicationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
}
export const RollbackApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
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
  identifier: "RollbackApplicationRequest",
}) as any as S.Schema<RollbackApplicationRequest>;
export interface StopApplicationRequest {
  ApplicationName: string;
  Force?: boolean;
}
export const StopApplicationRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String, Force: S.optional(S.Boolean) }).pipe(
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
  identifier: "StopApplicationRequest",
}) as any as S.Schema<StopApplicationRequest>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: Tags }).pipe(
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeys }).pipe(
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfiguration {
  SubnetIds: string[];
  SecurityGroupIds: string[];
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({ SubnetIds: SubnetIds, SecurityGroupIds: SecurityGroupIds }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export type VpcConfigurations = VpcConfiguration[];
export const VpcConfigurations = S.Array(VpcConfiguration);
export type InputStartingPosition =
  | "NOW"
  | "TRIM_HORIZON"
  | "LAST_STOPPED_POINT";
export const InputStartingPosition = S.Literal(
  "NOW",
  "TRIM_HORIZON",
  "LAST_STOPPED_POINT",
);
export interface InputStartingPositionConfiguration {
  InputStartingPosition?: InputStartingPosition;
}
export const InputStartingPositionConfiguration = S.suspend(() =>
  S.Struct({ InputStartingPosition: S.optional(InputStartingPosition) }),
).annotations({
  identifier: "InputStartingPositionConfiguration",
}) as any as S.Schema<InputStartingPositionConfiguration>;
export interface S3Configuration {
  BucketARN: string;
  FileKey: string;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({ BucketARN: S.String, FileKey: S.String }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export type SnapshotStatus = "CREATING" | "READY" | "DELETING" | "FAILED";
export const SnapshotStatus = S.Literal(
  "CREATING",
  "READY",
  "DELETING",
  "FAILED",
);
export type KeyType = "AWS_OWNED_KEY" | "CUSTOMER_MANAGED_KEY";
export const KeyType = S.Literal("AWS_OWNED_KEY", "CUSTOMER_MANAGED_KEY");
export interface ApplicationEncryptionConfigurationDescription {
  KeyId?: string;
  KeyType: KeyType;
}
export const ApplicationEncryptionConfigurationDescription = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String), KeyType: KeyType }),
).annotations({
  identifier: "ApplicationEncryptionConfigurationDescription",
}) as any as S.Schema<ApplicationEncryptionConfigurationDescription>;
export interface SnapshotDetails {
  SnapshotName: string;
  SnapshotStatus: SnapshotStatus;
  ApplicationVersionId: number;
  SnapshotCreationTimestamp?: Date;
  RuntimeEnvironment?: RuntimeEnvironment;
  ApplicationEncryptionConfigurationDescription?: ApplicationEncryptionConfigurationDescription;
}
export const SnapshotDetails = S.suspend(() =>
  S.Struct({
    SnapshotName: S.String,
    SnapshotStatus: SnapshotStatus,
    ApplicationVersionId: S.Number,
    SnapshotCreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RuntimeEnvironment: S.optional(RuntimeEnvironment),
    ApplicationEncryptionConfigurationDescription: S.optional(
      ApplicationEncryptionConfigurationDescription,
    ),
  }),
).annotations({
  identifier: "SnapshotDetails",
}) as any as S.Schema<SnapshotDetails>;
export type SnapshotSummaries = SnapshotDetails[];
export const SnapshotSummaries = S.Array(SnapshotDetails);
export interface FlinkRunConfiguration {
  AllowNonRestoredState?: boolean;
}
export const FlinkRunConfiguration = S.suspend(() =>
  S.Struct({ AllowNonRestoredState: S.optional(S.Boolean) }),
).annotations({
  identifier: "FlinkRunConfiguration",
}) as any as S.Schema<FlinkRunConfiguration>;
export type ApplicationRestoreType =
  | "SKIP_RESTORE_FROM_SNAPSHOT"
  | "RESTORE_FROM_LATEST_SNAPSHOT"
  | "RESTORE_FROM_CUSTOM_SNAPSHOT";
export const ApplicationRestoreType = S.Literal(
  "SKIP_RESTORE_FROM_SNAPSHOT",
  "RESTORE_FROM_LATEST_SNAPSHOT",
  "RESTORE_FROM_CUSTOM_SNAPSHOT",
);
export interface ApplicationRestoreConfiguration {
  ApplicationRestoreType: ApplicationRestoreType;
  SnapshotName?: string;
}
export const ApplicationRestoreConfiguration = S.suspend(() =>
  S.Struct({
    ApplicationRestoreType: ApplicationRestoreType,
    SnapshotName: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationRestoreConfiguration",
}) as any as S.Schema<ApplicationRestoreConfiguration>;
export interface RunConfigurationUpdate {
  FlinkRunConfiguration?: FlinkRunConfiguration;
  ApplicationRestoreConfiguration?: ApplicationRestoreConfiguration;
}
export const RunConfigurationUpdate = S.suspend(() =>
  S.Struct({
    FlinkRunConfiguration: S.optional(FlinkRunConfiguration),
    ApplicationRestoreConfiguration: S.optional(
      ApplicationRestoreConfiguration,
    ),
  }),
).annotations({
  identifier: "RunConfigurationUpdate",
}) as any as S.Schema<RunConfigurationUpdate>;
export interface CloudWatchLoggingOptionUpdate {
  CloudWatchLoggingOptionId: string;
  LogStreamARNUpdate?: string;
}
export const CloudWatchLoggingOptionUpdate = S.suspend(() =>
  S.Struct({
    CloudWatchLoggingOptionId: S.String,
    LogStreamARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLoggingOptionUpdate",
}) as any as S.Schema<CloudWatchLoggingOptionUpdate>;
export type CloudWatchLoggingOptionUpdates = CloudWatchLoggingOptionUpdate[];
export const CloudWatchLoggingOptionUpdates = S.Array(
  CloudWatchLoggingOptionUpdate,
);
export interface ApplicationMaintenanceConfigurationUpdate {
  ApplicationMaintenanceWindowStartTimeUpdate: string;
}
export const ApplicationMaintenanceConfigurationUpdate = S.suspend(() =>
  S.Struct({ ApplicationMaintenanceWindowStartTimeUpdate: S.String }),
).annotations({
  identifier: "ApplicationMaintenanceConfigurationUpdate",
}) as any as S.Schema<ApplicationMaintenanceConfigurationUpdate>;
export type RecordFormatType = "JSON" | "CSV";
export const RecordFormatType = S.Literal("JSON", "CSV");
export interface InputLambdaProcessor {
  ResourceARN: string;
}
export const InputLambdaProcessor = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({
  identifier: "InputLambdaProcessor",
}) as any as S.Schema<InputLambdaProcessor>;
export interface InputProcessingConfiguration {
  InputLambdaProcessor: InputLambdaProcessor;
}
export const InputProcessingConfiguration = S.suspend(() =>
  S.Struct({ InputLambdaProcessor: InputLambdaProcessor }),
).annotations({
  identifier: "InputProcessingConfiguration",
}) as any as S.Schema<InputProcessingConfiguration>;
export interface KinesisStreamsInput {
  ResourceARN: string;
}
export const KinesisStreamsInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({
  identifier: "KinesisStreamsInput",
}) as any as S.Schema<KinesisStreamsInput>;
export interface KinesisFirehoseInput {
  ResourceARN: string;
}
export const KinesisFirehoseInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({
  identifier: "KinesisFirehoseInput",
}) as any as S.Schema<KinesisFirehoseInput>;
export interface InputParallelism {
  Count?: number;
}
export const InputParallelism = S.suspend(() =>
  S.Struct({ Count: S.optional(S.Number) }),
).annotations({
  identifier: "InputParallelism",
}) as any as S.Schema<InputParallelism>;
export interface JSONMappingParameters {
  RecordRowPath: string;
}
export const JSONMappingParameters = S.suspend(() =>
  S.Struct({ RecordRowPath: S.String }),
).annotations({
  identifier: "JSONMappingParameters",
}) as any as S.Schema<JSONMappingParameters>;
export interface CSVMappingParameters {
  RecordRowDelimiter: string;
  RecordColumnDelimiter: string;
}
export const CSVMappingParameters = S.suspend(() =>
  S.Struct({ RecordRowDelimiter: S.String, RecordColumnDelimiter: S.String }),
).annotations({
  identifier: "CSVMappingParameters",
}) as any as S.Schema<CSVMappingParameters>;
export interface MappingParameters {
  JSONMappingParameters?: JSONMappingParameters;
  CSVMappingParameters?: CSVMappingParameters;
}
export const MappingParameters = S.suspend(() =>
  S.Struct({
    JSONMappingParameters: S.optional(JSONMappingParameters),
    CSVMappingParameters: S.optional(CSVMappingParameters),
  }),
).annotations({
  identifier: "MappingParameters",
}) as any as S.Schema<MappingParameters>;
export interface RecordFormat {
  RecordFormatType: RecordFormatType;
  MappingParameters?: MappingParameters;
}
export const RecordFormat = S.suspend(() =>
  S.Struct({
    RecordFormatType: RecordFormatType,
    MappingParameters: S.optional(MappingParameters),
  }),
).annotations({ identifier: "RecordFormat" }) as any as S.Schema<RecordFormat>;
export interface RecordColumn {
  Name: string;
  Mapping?: string;
  SqlType: string;
}
export const RecordColumn = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Mapping: S.optional(S.String),
    SqlType: S.String,
  }),
).annotations({ identifier: "RecordColumn" }) as any as S.Schema<RecordColumn>;
export type RecordColumns = RecordColumn[];
export const RecordColumns = S.Array(RecordColumn);
export interface SourceSchema {
  RecordFormat: RecordFormat;
  RecordEncoding?: string;
  RecordColumns: RecordColumn[];
}
export const SourceSchema = S.suspend(() =>
  S.Struct({
    RecordFormat: RecordFormat,
    RecordEncoding: S.optional(S.String),
    RecordColumns: RecordColumns,
  }),
).annotations({ identifier: "SourceSchema" }) as any as S.Schema<SourceSchema>;
export interface Input {
  NamePrefix: string;
  InputProcessingConfiguration?: InputProcessingConfiguration;
  KinesisStreamsInput?: KinesisStreamsInput;
  KinesisFirehoseInput?: KinesisFirehoseInput;
  InputParallelism?: InputParallelism;
  InputSchema: SourceSchema;
}
export const Input = S.suspend(() =>
  S.Struct({
    NamePrefix: S.String,
    InputProcessingConfiguration: S.optional(InputProcessingConfiguration),
    KinesisStreamsInput: S.optional(KinesisStreamsInput),
    KinesisFirehoseInput: S.optional(KinesisFirehoseInput),
    InputParallelism: S.optional(InputParallelism),
    InputSchema: SourceSchema,
  }),
).annotations({ identifier: "Input" }) as any as S.Schema<Input>;
export type Inputs = Input[];
export const Inputs = S.Array(Input);
export interface KinesisStreamsOutput {
  ResourceARN: string;
}
export const KinesisStreamsOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({
  identifier: "KinesisStreamsOutput",
}) as any as S.Schema<KinesisStreamsOutput>;
export interface KinesisFirehoseOutput {
  ResourceARN: string;
}
export const KinesisFirehoseOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({
  identifier: "KinesisFirehoseOutput",
}) as any as S.Schema<KinesisFirehoseOutput>;
export interface LambdaOutput {
  ResourceARN: string;
}
export const LambdaOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }),
).annotations({ identifier: "LambdaOutput" }) as any as S.Schema<LambdaOutput>;
export interface DestinationSchema {
  RecordFormatType: RecordFormatType;
}
export const DestinationSchema = S.suspend(() =>
  S.Struct({ RecordFormatType: RecordFormatType }),
).annotations({
  identifier: "DestinationSchema",
}) as any as S.Schema<DestinationSchema>;
export interface Output {
  Name: string;
  KinesisStreamsOutput?: KinesisStreamsOutput;
  KinesisFirehoseOutput?: KinesisFirehoseOutput;
  LambdaOutput?: LambdaOutput;
  DestinationSchema: DestinationSchema;
}
export const Output = S.suspend(() =>
  S.Struct({
    Name: S.String,
    KinesisStreamsOutput: S.optional(KinesisStreamsOutput),
    KinesisFirehoseOutput: S.optional(KinesisFirehoseOutput),
    LambdaOutput: S.optional(LambdaOutput),
    DestinationSchema: DestinationSchema,
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type Outputs = Output[];
export const Outputs = S.Array(Output);
export interface S3ReferenceDataSource {
  BucketARN?: string;
  FileKey?: string;
}
export const S3ReferenceDataSource = S.suspend(() =>
  S.Struct({ BucketARN: S.optional(S.String), FileKey: S.optional(S.String) }),
).annotations({
  identifier: "S3ReferenceDataSource",
}) as any as S.Schema<S3ReferenceDataSource>;
export interface ReferenceDataSource {
  TableName: string;
  S3ReferenceDataSource?: S3ReferenceDataSource;
  ReferenceSchema: SourceSchema;
}
export const ReferenceDataSource = S.suspend(() =>
  S.Struct({
    TableName: S.String,
    S3ReferenceDataSource: S.optional(S3ReferenceDataSource),
    ReferenceSchema: SourceSchema,
  }),
).annotations({
  identifier: "ReferenceDataSource",
}) as any as S.Schema<ReferenceDataSource>;
export type ReferenceDataSources = ReferenceDataSource[];
export const ReferenceDataSources = S.Array(ReferenceDataSource);
export type CodeContentType = "PLAINTEXT" | "ZIPFILE";
export const CodeContentType = S.Literal("PLAINTEXT", "ZIPFILE");
export interface AddApplicationCloudWatchLoggingOptionRequest {
  ApplicationName: string;
  CurrentApplicationVersionId?: number;
  CloudWatchLoggingOption: CloudWatchLoggingOption;
  ConditionalToken?: string;
}
export const AddApplicationCloudWatchLoggingOptionRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOption: CloudWatchLoggingOption,
    ConditionalToken: S.optional(S.String),
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
  identifier: "AddApplicationCloudWatchLoggingOptionRequest",
}) as any as S.Schema<AddApplicationCloudWatchLoggingOptionRequest>;
export interface AddApplicationVpcConfigurationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId?: number;
  VpcConfiguration: VpcConfiguration;
  ConditionalToken?: string;
}
export const AddApplicationVpcConfigurationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    VpcConfiguration: VpcConfiguration,
    ConditionalToken: S.optional(S.String),
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
  identifier: "AddApplicationVpcConfigurationRequest",
}) as any as S.Schema<AddApplicationVpcConfigurationRequest>;
export interface CreateApplicationPresignedUrlResponse {
  AuthorizedUrl?: string;
}
export const CreateApplicationPresignedUrlResponse = S.suspend(() =>
  S.Struct({ AuthorizedUrl: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateApplicationPresignedUrlResponse",
}) as any as S.Schema<CreateApplicationPresignedUrlResponse>;
export interface DeleteApplicationInputProcessingConfigurationResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
}
export const DeleteApplicationInputProcessingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      ApplicationARN: S.optional(S.String),
      ApplicationVersionId: S.optional(S.Number),
    }).pipe(ns),
).annotations({
  identifier: "DeleteApplicationInputProcessingConfigurationResponse",
}) as any as S.Schema<DeleteApplicationInputProcessingConfigurationResponse>;
export interface DeleteApplicationOutputResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
}
export const DeleteApplicationOutputResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DeleteApplicationOutputResponse",
}) as any as S.Schema<DeleteApplicationOutputResponse>;
export interface DeleteApplicationReferenceDataSourceResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
}
export const DeleteApplicationReferenceDataSourceResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DeleteApplicationReferenceDataSourceResponse",
}) as any as S.Schema<DeleteApplicationReferenceDataSourceResponse>;
export interface DeleteApplicationVpcConfigurationResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  OperationId?: string;
}
export const DeleteApplicationVpcConfigurationResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteApplicationVpcConfigurationResponse",
}) as any as S.Schema<DeleteApplicationVpcConfigurationResponse>;
export type ApplicationStatus =
  | "DELETING"
  | "STARTING"
  | "STOPPING"
  | "READY"
  | "RUNNING"
  | "UPDATING"
  | "AUTOSCALING"
  | "FORCE_STOPPING"
  | "ROLLING_BACK"
  | "MAINTENANCE"
  | "ROLLED_BACK";
export const ApplicationStatus = S.Literal(
  "DELETING",
  "STARTING",
  "STOPPING",
  "READY",
  "RUNNING",
  "UPDATING",
  "AUTOSCALING",
  "FORCE_STOPPING",
  "ROLLING_BACK",
  "MAINTENANCE",
  "ROLLED_BACK",
);
export type InAppStreamNames = string[];
export const InAppStreamNames = S.Array(S.String);
export interface InputLambdaProcessorDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const InputLambdaProcessorDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "InputLambdaProcessorDescription",
}) as any as S.Schema<InputLambdaProcessorDescription>;
export interface InputProcessingConfigurationDescription {
  InputLambdaProcessorDescription?: InputLambdaProcessorDescription;
}
export const InputProcessingConfigurationDescription = S.suspend(() =>
  S.Struct({
    InputLambdaProcessorDescription: S.optional(
      InputLambdaProcessorDescription,
    ),
  }),
).annotations({
  identifier: "InputProcessingConfigurationDescription",
}) as any as S.Schema<InputProcessingConfigurationDescription>;
export interface KinesisStreamsInputDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const KinesisStreamsInputDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "KinesisStreamsInputDescription",
}) as any as S.Schema<KinesisStreamsInputDescription>;
export interface KinesisFirehoseInputDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const KinesisFirehoseInputDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "KinesisFirehoseInputDescription",
}) as any as S.Schema<KinesisFirehoseInputDescription>;
export interface InputDescription {
  InputId?: string;
  NamePrefix?: string;
  InAppStreamNames?: string[];
  InputProcessingConfigurationDescription?: InputProcessingConfigurationDescription;
  KinesisStreamsInputDescription?: KinesisStreamsInputDescription;
  KinesisFirehoseInputDescription?: KinesisFirehoseInputDescription;
  InputSchema?: SourceSchema;
  InputParallelism?: InputParallelism;
  InputStartingPositionConfiguration?: InputStartingPositionConfiguration;
}
export const InputDescription = S.suspend(() =>
  S.Struct({
    InputId: S.optional(S.String),
    NamePrefix: S.optional(S.String),
    InAppStreamNames: S.optional(InAppStreamNames),
    InputProcessingConfigurationDescription: S.optional(
      InputProcessingConfigurationDescription,
    ),
    KinesisStreamsInputDescription: S.optional(KinesisStreamsInputDescription),
    KinesisFirehoseInputDescription: S.optional(
      KinesisFirehoseInputDescription,
    ),
    InputSchema: S.optional(SourceSchema),
    InputParallelism: S.optional(InputParallelism),
    InputStartingPositionConfiguration: S.optional(
      InputStartingPositionConfiguration,
    ),
  }),
).annotations({
  identifier: "InputDescription",
}) as any as S.Schema<InputDescription>;
export type InputDescriptions = InputDescription[];
export const InputDescriptions = S.Array(InputDescription);
export interface KinesisStreamsOutputDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const KinesisStreamsOutputDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "KinesisStreamsOutputDescription",
}) as any as S.Schema<KinesisStreamsOutputDescription>;
export interface KinesisFirehoseOutputDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const KinesisFirehoseOutputDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "KinesisFirehoseOutputDescription",
}) as any as S.Schema<KinesisFirehoseOutputDescription>;
export interface LambdaOutputDescription {
  ResourceARN: string;
  RoleARN?: string;
}
export const LambdaOutputDescription = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.optional(S.String) }),
).annotations({
  identifier: "LambdaOutputDescription",
}) as any as S.Schema<LambdaOutputDescription>;
export interface OutputDescription {
  OutputId?: string;
  Name?: string;
  KinesisStreamsOutputDescription?: KinesisStreamsOutputDescription;
  KinesisFirehoseOutputDescription?: KinesisFirehoseOutputDescription;
  LambdaOutputDescription?: LambdaOutputDescription;
  DestinationSchema?: DestinationSchema;
}
export const OutputDescription = S.suspend(() =>
  S.Struct({
    OutputId: S.optional(S.String),
    Name: S.optional(S.String),
    KinesisStreamsOutputDescription: S.optional(
      KinesisStreamsOutputDescription,
    ),
    KinesisFirehoseOutputDescription: S.optional(
      KinesisFirehoseOutputDescription,
    ),
    LambdaOutputDescription: S.optional(LambdaOutputDescription),
    DestinationSchema: S.optional(DestinationSchema),
  }),
).annotations({
  identifier: "OutputDescription",
}) as any as S.Schema<OutputDescription>;
export type OutputDescriptions = OutputDescription[];
export const OutputDescriptions = S.Array(OutputDescription);
export interface S3ReferenceDataSourceDescription {
  BucketARN: string;
  FileKey: string;
  ReferenceRoleARN?: string;
}
export const S3ReferenceDataSourceDescription = S.suspend(() =>
  S.Struct({
    BucketARN: S.String,
    FileKey: S.String,
    ReferenceRoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ReferenceDataSourceDescription",
}) as any as S.Schema<S3ReferenceDataSourceDescription>;
export interface ReferenceDataSourceDescription {
  ReferenceId: string;
  TableName: string;
  S3ReferenceDataSourceDescription: S3ReferenceDataSourceDescription;
  ReferenceSchema?: SourceSchema;
}
export const ReferenceDataSourceDescription = S.suspend(() =>
  S.Struct({
    ReferenceId: S.String,
    TableName: S.String,
    S3ReferenceDataSourceDescription: S3ReferenceDataSourceDescription,
    ReferenceSchema: S.optional(SourceSchema),
  }),
).annotations({
  identifier: "ReferenceDataSourceDescription",
}) as any as S.Schema<ReferenceDataSourceDescription>;
export type ReferenceDataSourceDescriptions = ReferenceDataSourceDescription[];
export const ReferenceDataSourceDescriptions = S.Array(
  ReferenceDataSourceDescription,
);
export interface SqlApplicationConfigurationDescription {
  InputDescriptions?: InputDescription[];
  OutputDescriptions?: OutputDescription[];
  ReferenceDataSourceDescriptions?: ReferenceDataSourceDescription[];
}
export const SqlApplicationConfigurationDescription = S.suspend(() =>
  S.Struct({
    InputDescriptions: S.optional(InputDescriptions),
    OutputDescriptions: S.optional(OutputDescriptions),
    ReferenceDataSourceDescriptions: S.optional(
      ReferenceDataSourceDescriptions,
    ),
  }),
).annotations({
  identifier: "SqlApplicationConfigurationDescription",
}) as any as S.Schema<SqlApplicationConfigurationDescription>;
export interface S3ApplicationCodeLocationDescription {
  BucketARN: string;
  FileKey: string;
  ObjectVersion?: string;
}
export const S3ApplicationCodeLocationDescription = S.suspend(() =>
  S.Struct({
    BucketARN: S.String,
    FileKey: S.String,
    ObjectVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ApplicationCodeLocationDescription",
}) as any as S.Schema<S3ApplicationCodeLocationDescription>;
export interface CodeContentDescription {
  TextContent?: string;
  CodeMD5?: string;
  CodeSize?: number;
  S3ApplicationCodeLocationDescription?: S3ApplicationCodeLocationDescription;
}
export const CodeContentDescription = S.suspend(() =>
  S.Struct({
    TextContent: S.optional(S.String),
    CodeMD5: S.optional(S.String),
    CodeSize: S.optional(S.Number),
    S3ApplicationCodeLocationDescription: S.optional(
      S3ApplicationCodeLocationDescription,
    ),
  }),
).annotations({
  identifier: "CodeContentDescription",
}) as any as S.Schema<CodeContentDescription>;
export interface ApplicationCodeConfigurationDescription {
  CodeContentType: CodeContentType;
  CodeContentDescription?: CodeContentDescription;
}
export const ApplicationCodeConfigurationDescription = S.suspend(() =>
  S.Struct({
    CodeContentType: CodeContentType,
    CodeContentDescription: S.optional(CodeContentDescription),
  }),
).annotations({
  identifier: "ApplicationCodeConfigurationDescription",
}) as any as S.Schema<ApplicationCodeConfigurationDescription>;
export interface RunConfigurationDescription {
  ApplicationRestoreConfigurationDescription?: ApplicationRestoreConfiguration;
  FlinkRunConfigurationDescription?: FlinkRunConfiguration;
}
export const RunConfigurationDescription = S.suspend(() =>
  S.Struct({
    ApplicationRestoreConfigurationDescription: S.optional(
      ApplicationRestoreConfiguration,
    ),
    FlinkRunConfigurationDescription: S.optional(FlinkRunConfiguration),
  }),
).annotations({
  identifier: "RunConfigurationDescription",
}) as any as S.Schema<RunConfigurationDescription>;
export type ConfigurationType = "DEFAULT" | "CUSTOM";
export const ConfigurationType = S.Literal("DEFAULT", "CUSTOM");
export interface CheckpointConfigurationDescription {
  ConfigurationType?: ConfigurationType;
  CheckpointingEnabled?: boolean;
  CheckpointInterval?: number;
  MinPauseBetweenCheckpoints?: number;
}
export const CheckpointConfigurationDescription = S.suspend(() =>
  S.Struct({
    ConfigurationType: S.optional(ConfigurationType),
    CheckpointingEnabled: S.optional(S.Boolean),
    CheckpointInterval: S.optional(S.Number),
    MinPauseBetweenCheckpoints: S.optional(S.Number),
  }),
).annotations({
  identifier: "CheckpointConfigurationDescription",
}) as any as S.Schema<CheckpointConfigurationDescription>;
export type MetricsLevel = "APPLICATION" | "TASK" | "OPERATOR" | "PARALLELISM";
export const MetricsLevel = S.Literal(
  "APPLICATION",
  "TASK",
  "OPERATOR",
  "PARALLELISM",
);
export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";
export const LogLevel = S.Literal("INFO", "WARN", "ERROR", "DEBUG");
export interface MonitoringConfigurationDescription {
  ConfigurationType?: ConfigurationType;
  MetricsLevel?: MetricsLevel;
  LogLevel?: LogLevel;
}
export const MonitoringConfigurationDescription = S.suspend(() =>
  S.Struct({
    ConfigurationType: S.optional(ConfigurationType),
    MetricsLevel: S.optional(MetricsLevel),
    LogLevel: S.optional(LogLevel),
  }),
).annotations({
  identifier: "MonitoringConfigurationDescription",
}) as any as S.Schema<MonitoringConfigurationDescription>;
export interface ParallelismConfigurationDescription {
  ConfigurationType?: ConfigurationType;
  Parallelism?: number;
  ParallelismPerKPU?: number;
  CurrentParallelism?: number;
  AutoScalingEnabled?: boolean;
}
export const ParallelismConfigurationDescription = S.suspend(() =>
  S.Struct({
    ConfigurationType: S.optional(ConfigurationType),
    Parallelism: S.optional(S.Number),
    ParallelismPerKPU: S.optional(S.Number),
    CurrentParallelism: S.optional(S.Number),
    AutoScalingEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParallelismConfigurationDescription",
}) as any as S.Schema<ParallelismConfigurationDescription>;
export interface FlinkApplicationConfigurationDescription {
  CheckpointConfigurationDescription?: CheckpointConfigurationDescription;
  MonitoringConfigurationDescription?: MonitoringConfigurationDescription;
  ParallelismConfigurationDescription?: ParallelismConfigurationDescription;
  JobPlanDescription?: string;
}
export const FlinkApplicationConfigurationDescription = S.suspend(() =>
  S.Struct({
    CheckpointConfigurationDescription: S.optional(
      CheckpointConfigurationDescription,
    ),
    MonitoringConfigurationDescription: S.optional(
      MonitoringConfigurationDescription,
    ),
    ParallelismConfigurationDescription: S.optional(
      ParallelismConfigurationDescription,
    ),
    JobPlanDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "FlinkApplicationConfigurationDescription",
}) as any as S.Schema<FlinkApplicationConfigurationDescription>;
export type PropertyMap = { [key: string]: string };
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export interface PropertyGroup {
  PropertyGroupId: string;
  PropertyMap: { [key: string]: string };
}
export const PropertyGroup = S.suspend(() =>
  S.Struct({ PropertyGroupId: S.String, PropertyMap: PropertyMap }),
).annotations({
  identifier: "PropertyGroup",
}) as any as S.Schema<PropertyGroup>;
export type PropertyGroups = PropertyGroup[];
export const PropertyGroups = S.Array(PropertyGroup);
export interface EnvironmentPropertyDescriptions {
  PropertyGroupDescriptions?: PropertyGroup[];
}
export const EnvironmentPropertyDescriptions = S.suspend(() =>
  S.Struct({ PropertyGroupDescriptions: S.optional(PropertyGroups) }),
).annotations({
  identifier: "EnvironmentPropertyDescriptions",
}) as any as S.Schema<EnvironmentPropertyDescriptions>;
export interface ApplicationSnapshotConfigurationDescription {
  SnapshotsEnabled: boolean;
}
export const ApplicationSnapshotConfigurationDescription = S.suspend(() =>
  S.Struct({ SnapshotsEnabled: S.Boolean }),
).annotations({
  identifier: "ApplicationSnapshotConfigurationDescription",
}) as any as S.Schema<ApplicationSnapshotConfigurationDescription>;
export interface ApplicationSystemRollbackConfigurationDescription {
  RollbackEnabled: boolean;
}
export const ApplicationSystemRollbackConfigurationDescription = S.suspend(() =>
  S.Struct({ RollbackEnabled: S.Boolean }),
).annotations({
  identifier: "ApplicationSystemRollbackConfigurationDescription",
}) as any as S.Schema<ApplicationSystemRollbackConfigurationDescription>;
export interface VpcConfigurationDescription {
  VpcConfigurationId: string;
  VpcId: string;
  SubnetIds: string[];
  SecurityGroupIds: string[];
}
export const VpcConfigurationDescription = S.suspend(() =>
  S.Struct({
    VpcConfigurationId: S.String,
    VpcId: S.String,
    SubnetIds: SubnetIds,
    SecurityGroupIds: SecurityGroupIds,
  }),
).annotations({
  identifier: "VpcConfigurationDescription",
}) as any as S.Schema<VpcConfigurationDescription>;
export type VpcConfigurationDescriptions = VpcConfigurationDescription[];
export const VpcConfigurationDescriptions = S.Array(
  VpcConfigurationDescription,
);
export interface ZeppelinMonitoringConfigurationDescription {
  LogLevel?: LogLevel;
}
export const ZeppelinMonitoringConfigurationDescription = S.suspend(() =>
  S.Struct({ LogLevel: S.optional(LogLevel) }),
).annotations({
  identifier: "ZeppelinMonitoringConfigurationDescription",
}) as any as S.Schema<ZeppelinMonitoringConfigurationDescription>;
export interface GlueDataCatalogConfigurationDescription {
  DatabaseARN: string;
}
export const GlueDataCatalogConfigurationDescription = S.suspend(() =>
  S.Struct({ DatabaseARN: S.String }),
).annotations({
  identifier: "GlueDataCatalogConfigurationDescription",
}) as any as S.Schema<GlueDataCatalogConfigurationDescription>;
export interface CatalogConfigurationDescription {
  GlueDataCatalogConfigurationDescription: GlueDataCatalogConfigurationDescription;
}
export const CatalogConfigurationDescription = S.suspend(() =>
  S.Struct({
    GlueDataCatalogConfigurationDescription:
      GlueDataCatalogConfigurationDescription,
  }),
).annotations({
  identifier: "CatalogConfigurationDescription",
}) as any as S.Schema<CatalogConfigurationDescription>;
export interface S3ContentBaseLocationDescription {
  BucketARN: string;
  BasePath?: string;
}
export const S3ContentBaseLocationDescription = S.suspend(() =>
  S.Struct({ BucketARN: S.String, BasePath: S.optional(S.String) }),
).annotations({
  identifier: "S3ContentBaseLocationDescription",
}) as any as S.Schema<S3ContentBaseLocationDescription>;
export interface DeployAsApplicationConfigurationDescription {
  S3ContentLocationDescription: S3ContentBaseLocationDescription;
}
export const DeployAsApplicationConfigurationDescription = S.suspend(() =>
  S.Struct({ S3ContentLocationDescription: S3ContentBaseLocationDescription }),
).annotations({
  identifier: "DeployAsApplicationConfigurationDescription",
}) as any as S.Schema<DeployAsApplicationConfigurationDescription>;
export type ArtifactType = "UDF" | "DEPENDENCY_JAR";
export const ArtifactType = S.Literal("UDF", "DEPENDENCY_JAR");
export interface S3ContentLocation {
  BucketARN: string;
  FileKey: string;
  ObjectVersion?: string;
}
export const S3ContentLocation = S.suspend(() =>
  S.Struct({
    BucketARN: S.String,
    FileKey: S.String,
    ObjectVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ContentLocation",
}) as any as S.Schema<S3ContentLocation>;
export interface MavenReference {
  GroupId: string;
  ArtifactId: string;
  Version: string;
}
export const MavenReference = S.suspend(() =>
  S.Struct({ GroupId: S.String, ArtifactId: S.String, Version: S.String }),
).annotations({
  identifier: "MavenReference",
}) as any as S.Schema<MavenReference>;
export interface CustomArtifactConfigurationDescription {
  ArtifactType?: ArtifactType;
  S3ContentLocationDescription?: S3ContentLocation;
  MavenReferenceDescription?: MavenReference;
}
export const CustomArtifactConfigurationDescription = S.suspend(() =>
  S.Struct({
    ArtifactType: S.optional(ArtifactType),
    S3ContentLocationDescription: S.optional(S3ContentLocation),
    MavenReferenceDescription: S.optional(MavenReference),
  }),
).annotations({
  identifier: "CustomArtifactConfigurationDescription",
}) as any as S.Schema<CustomArtifactConfigurationDescription>;
export type CustomArtifactsConfigurationDescriptionList =
  CustomArtifactConfigurationDescription[];
export const CustomArtifactsConfigurationDescriptionList = S.Array(
  CustomArtifactConfigurationDescription,
);
export interface ZeppelinApplicationConfigurationDescription {
  MonitoringConfigurationDescription: ZeppelinMonitoringConfigurationDescription;
  CatalogConfigurationDescription?: CatalogConfigurationDescription;
  DeployAsApplicationConfigurationDescription?: DeployAsApplicationConfigurationDescription;
  CustomArtifactsConfigurationDescription?: CustomArtifactConfigurationDescription[];
}
export const ZeppelinApplicationConfigurationDescription = S.suspend(() =>
  S.Struct({
    MonitoringConfigurationDescription:
      ZeppelinMonitoringConfigurationDescription,
    CatalogConfigurationDescription: S.optional(
      CatalogConfigurationDescription,
    ),
    DeployAsApplicationConfigurationDescription: S.optional(
      DeployAsApplicationConfigurationDescription,
    ),
    CustomArtifactsConfigurationDescription: S.optional(
      CustomArtifactsConfigurationDescriptionList,
    ),
  }),
).annotations({
  identifier: "ZeppelinApplicationConfigurationDescription",
}) as any as S.Schema<ZeppelinApplicationConfigurationDescription>;
export interface ApplicationConfigurationDescription {
  SqlApplicationConfigurationDescription?: SqlApplicationConfigurationDescription;
  ApplicationCodeConfigurationDescription?: ApplicationCodeConfigurationDescription;
  RunConfigurationDescription?: RunConfigurationDescription;
  FlinkApplicationConfigurationDescription?: FlinkApplicationConfigurationDescription;
  EnvironmentPropertyDescriptions?: EnvironmentPropertyDescriptions;
  ApplicationSnapshotConfigurationDescription?: ApplicationSnapshotConfigurationDescription;
  ApplicationSystemRollbackConfigurationDescription?: ApplicationSystemRollbackConfigurationDescription;
  VpcConfigurationDescriptions?: VpcConfigurationDescription[];
  ZeppelinApplicationConfigurationDescription?: ZeppelinApplicationConfigurationDescription;
  ApplicationEncryptionConfigurationDescription?: ApplicationEncryptionConfigurationDescription;
}
export const ApplicationConfigurationDescription = S.suspend(() =>
  S.Struct({
    SqlApplicationConfigurationDescription: S.optional(
      SqlApplicationConfigurationDescription,
    ),
    ApplicationCodeConfigurationDescription: S.optional(
      ApplicationCodeConfigurationDescription,
    ),
    RunConfigurationDescription: S.optional(RunConfigurationDescription),
    FlinkApplicationConfigurationDescription: S.optional(
      FlinkApplicationConfigurationDescription,
    ),
    EnvironmentPropertyDescriptions: S.optional(
      EnvironmentPropertyDescriptions,
    ),
    ApplicationSnapshotConfigurationDescription: S.optional(
      ApplicationSnapshotConfigurationDescription,
    ),
    ApplicationSystemRollbackConfigurationDescription: S.optional(
      ApplicationSystemRollbackConfigurationDescription,
    ),
    VpcConfigurationDescriptions: S.optional(VpcConfigurationDescriptions),
    ZeppelinApplicationConfigurationDescription: S.optional(
      ZeppelinApplicationConfigurationDescription,
    ),
    ApplicationEncryptionConfigurationDescription: S.optional(
      ApplicationEncryptionConfigurationDescription,
    ),
  }),
).annotations({
  identifier: "ApplicationConfigurationDescription",
}) as any as S.Schema<ApplicationConfigurationDescription>;
export interface CloudWatchLoggingOptionDescription {
  CloudWatchLoggingOptionId?: string;
  LogStreamARN: string;
  RoleARN?: string;
}
export const CloudWatchLoggingOptionDescription = S.suspend(() =>
  S.Struct({
    CloudWatchLoggingOptionId: S.optional(S.String),
    LogStreamARN: S.String,
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLoggingOptionDescription",
}) as any as S.Schema<CloudWatchLoggingOptionDescription>;
export type CloudWatchLoggingOptionDescriptions =
  CloudWatchLoggingOptionDescription[];
export const CloudWatchLoggingOptionDescriptions = S.Array(
  CloudWatchLoggingOptionDescription,
);
export interface ApplicationMaintenanceConfigurationDescription {
  ApplicationMaintenanceWindowStartTime: string;
  ApplicationMaintenanceWindowEndTime: string;
}
export const ApplicationMaintenanceConfigurationDescription = S.suspend(() =>
  S.Struct({
    ApplicationMaintenanceWindowStartTime: S.String,
    ApplicationMaintenanceWindowEndTime: S.String,
  }),
).annotations({
  identifier: "ApplicationMaintenanceConfigurationDescription",
}) as any as S.Schema<ApplicationMaintenanceConfigurationDescription>;
export interface ApplicationDetail {
  ApplicationARN: string;
  ApplicationDescription?: string;
  ApplicationName: string;
  RuntimeEnvironment: RuntimeEnvironment;
  ServiceExecutionRole?: string;
  ApplicationStatus: ApplicationStatus;
  ApplicationVersionId: number;
  CreateTimestamp?: Date;
  LastUpdateTimestamp?: Date;
  ApplicationConfigurationDescription?: ApplicationConfigurationDescription;
  CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescription[];
  ApplicationMaintenanceConfigurationDescription?: ApplicationMaintenanceConfigurationDescription;
  ApplicationVersionUpdatedFrom?: number;
  ApplicationVersionRolledBackFrom?: number;
  ApplicationVersionCreateTimestamp?: Date;
  ConditionalToken?: string;
  ApplicationVersionRolledBackTo?: number;
  ApplicationMode?: ApplicationMode;
}
export const ApplicationDetail = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.String,
    ApplicationDescription: S.optional(S.String),
    ApplicationName: S.String,
    RuntimeEnvironment: RuntimeEnvironment,
    ServiceExecutionRole: S.optional(S.String),
    ApplicationStatus: ApplicationStatus,
    ApplicationVersionId: S.Number,
    CreateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ApplicationConfigurationDescription: S.optional(
      ApplicationConfigurationDescription,
    ),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    ApplicationMaintenanceConfigurationDescription: S.optional(
      ApplicationMaintenanceConfigurationDescription,
    ),
    ApplicationVersionUpdatedFrom: S.optional(S.Number),
    ApplicationVersionRolledBackFrom: S.optional(S.Number),
    ApplicationVersionCreateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ConditionalToken: S.optional(S.String),
    ApplicationVersionRolledBackTo: S.optional(S.Number),
    ApplicationMode: S.optional(ApplicationMode),
  }),
).annotations({
  identifier: "ApplicationDetail",
}) as any as S.Schema<ApplicationDetail>;
export interface DescribeApplicationVersionResponse {
  ApplicationVersionDetail?: ApplicationDetail;
}
export const DescribeApplicationVersionResponse = S.suspend(() =>
  S.Struct({ ApplicationVersionDetail: S.optional(ApplicationDetail) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeApplicationVersionResponse",
}) as any as S.Schema<DescribeApplicationVersionResponse>;
export interface DiscoverInputSchemaRequest {
  ResourceARN?: string;
  ServiceExecutionRole: string;
  InputStartingPositionConfiguration?: InputStartingPositionConfiguration;
  S3Configuration?: S3Configuration;
  InputProcessingConfiguration?: InputProcessingConfiguration;
}
export const DiscoverInputSchemaRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    ServiceExecutionRole: S.String,
    InputStartingPositionConfiguration: S.optional(
      InputStartingPositionConfiguration,
    ),
    S3Configuration: S.optional(S3Configuration),
    InputProcessingConfiguration: S.optional(InputProcessingConfiguration),
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
  identifier: "DiscoverInputSchemaRequest",
}) as any as S.Schema<DiscoverInputSchemaRequest>;
export interface ListApplicationSnapshotsResponse {
  SnapshotSummaries?: SnapshotDetails[];
  NextToken?: string;
}
export const ListApplicationSnapshotsResponse = S.suspend(() =>
  S.Struct({
    SnapshotSummaries: S.optional(SnapshotSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationSnapshotsResponse",
}) as any as S.Schema<ListApplicationSnapshotsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RollbackApplicationResponse {
  ApplicationDetail: ApplicationDetail;
  OperationId?: string;
}
export const RollbackApplicationResponse = S.suspend(() =>
  S.Struct({
    ApplicationDetail: ApplicationDetail,
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RollbackApplicationResponse",
}) as any as S.Schema<RollbackApplicationResponse>;
export interface StopApplicationResponse {
  OperationId?: string;
}
export const StopApplicationResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StopApplicationResponse",
}) as any as S.Schema<StopApplicationResponse>;
export interface UpdateApplicationMaintenanceConfigurationRequest {
  ApplicationName: string;
  ApplicationMaintenanceConfigurationUpdate: ApplicationMaintenanceConfigurationUpdate;
}
export const UpdateApplicationMaintenanceConfigurationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationMaintenanceConfigurationUpdate:
      ApplicationMaintenanceConfigurationUpdate,
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
  identifier: "UpdateApplicationMaintenanceConfigurationRequest",
}) as any as S.Schema<UpdateApplicationMaintenanceConfigurationRequest>;
export interface SqlApplicationConfiguration {
  Inputs?: Input[];
  Outputs?: Output[];
  ReferenceDataSources?: ReferenceDataSource[];
}
export const SqlApplicationConfiguration = S.suspend(() =>
  S.Struct({
    Inputs: S.optional(Inputs),
    Outputs: S.optional(Outputs),
    ReferenceDataSources: S.optional(ReferenceDataSources),
  }),
).annotations({
  identifier: "SqlApplicationConfiguration",
}) as any as S.Schema<SqlApplicationConfiguration>;
export interface ApplicationSnapshotConfiguration {
  SnapshotsEnabled: boolean;
}
export const ApplicationSnapshotConfiguration = S.suspend(() =>
  S.Struct({ SnapshotsEnabled: S.Boolean }),
).annotations({
  identifier: "ApplicationSnapshotConfiguration",
}) as any as S.Schema<ApplicationSnapshotConfiguration>;
export interface ApplicationSystemRollbackConfiguration {
  RollbackEnabled: boolean;
}
export const ApplicationSystemRollbackConfiguration = S.suspend(() =>
  S.Struct({ RollbackEnabled: S.Boolean }),
).annotations({
  identifier: "ApplicationSystemRollbackConfiguration",
}) as any as S.Schema<ApplicationSystemRollbackConfiguration>;
export interface ApplicationEncryptionConfiguration {
  KeyId?: string;
  KeyType: KeyType;
}
export const ApplicationEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KeyId: S.optional(S.String), KeyType: KeyType }),
).annotations({
  identifier: "ApplicationEncryptionConfiguration",
}) as any as S.Schema<ApplicationEncryptionConfiguration>;
export interface SqlRunConfiguration {
  InputId: string;
  InputStartingPositionConfiguration: InputStartingPositionConfiguration;
}
export const SqlRunConfiguration = S.suspend(() =>
  S.Struct({
    InputId: S.String,
    InputStartingPositionConfiguration: InputStartingPositionConfiguration,
  }),
).annotations({
  identifier: "SqlRunConfiguration",
}) as any as S.Schema<SqlRunConfiguration>;
export type SqlRunConfigurations = SqlRunConfiguration[];
export const SqlRunConfigurations = S.Array(SqlRunConfiguration);
export interface EnvironmentPropertyUpdates {
  PropertyGroups: PropertyGroup[];
}
export const EnvironmentPropertyUpdates = S.suspend(() =>
  S.Struct({ PropertyGroups: PropertyGroups }),
).annotations({
  identifier: "EnvironmentPropertyUpdates",
}) as any as S.Schema<EnvironmentPropertyUpdates>;
export interface ApplicationSnapshotConfigurationUpdate {
  SnapshotsEnabledUpdate: boolean;
}
export const ApplicationSnapshotConfigurationUpdate = S.suspend(() =>
  S.Struct({ SnapshotsEnabledUpdate: S.Boolean }),
).annotations({
  identifier: "ApplicationSnapshotConfigurationUpdate",
}) as any as S.Schema<ApplicationSnapshotConfigurationUpdate>;
export interface ApplicationSystemRollbackConfigurationUpdate {
  RollbackEnabledUpdate: boolean;
}
export const ApplicationSystemRollbackConfigurationUpdate = S.suspend(() =>
  S.Struct({ RollbackEnabledUpdate: S.Boolean }),
).annotations({
  identifier: "ApplicationSystemRollbackConfigurationUpdate",
}) as any as S.Schema<ApplicationSystemRollbackConfigurationUpdate>;
export interface VpcConfigurationUpdate {
  VpcConfigurationId: string;
  SubnetIdUpdates?: string[];
  SecurityGroupIdUpdates?: string[];
}
export const VpcConfigurationUpdate = S.suspend(() =>
  S.Struct({
    VpcConfigurationId: S.String,
    SubnetIdUpdates: S.optional(SubnetIds),
    SecurityGroupIdUpdates: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "VpcConfigurationUpdate",
}) as any as S.Schema<VpcConfigurationUpdate>;
export type VpcConfigurationUpdates = VpcConfigurationUpdate[];
export const VpcConfigurationUpdates = S.Array(VpcConfigurationUpdate);
export interface ApplicationEncryptionConfigurationUpdate {
  KeyIdUpdate?: string;
  KeyTypeUpdate: KeyType;
}
export const ApplicationEncryptionConfigurationUpdate = S.suspend(() =>
  S.Struct({ KeyIdUpdate: S.optional(S.String), KeyTypeUpdate: KeyType }),
).annotations({
  identifier: "ApplicationEncryptionConfigurationUpdate",
}) as any as S.Schema<ApplicationEncryptionConfigurationUpdate>;
export type ParsedInputRecord = string[];
export const ParsedInputRecord = S.Array(S.String);
export type ParsedInputRecords = string[][];
export const ParsedInputRecords = S.Array(ParsedInputRecord);
export type ProcessedInputRecords = string[];
export const ProcessedInputRecords = S.Array(S.String);
export type RawInputRecords = string[];
export const RawInputRecords = S.Array(S.String);
export interface ApplicationOperationInfo {
  Operation?: string;
  OperationId?: string;
  StartTime?: Date;
  EndTime?: Date;
  OperationStatus?: OperationStatus;
}
export const ApplicationOperationInfo = S.suspend(() =>
  S.Struct({
    Operation: S.optional(S.String),
    OperationId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OperationStatus: S.optional(OperationStatus),
  }),
).annotations({
  identifier: "ApplicationOperationInfo",
}) as any as S.Schema<ApplicationOperationInfo>;
export type ApplicationOperationInfoList = ApplicationOperationInfo[];
export const ApplicationOperationInfoList = S.Array(ApplicationOperationInfo);
export interface ApplicationSummary {
  ApplicationName: string;
  ApplicationARN: string;
  ApplicationStatus: ApplicationStatus;
  ApplicationVersionId: number;
  RuntimeEnvironment: RuntimeEnvironment;
  ApplicationMode?: ApplicationMode;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationARN: S.String,
    ApplicationStatus: ApplicationStatus,
    ApplicationVersionId: S.Number,
    RuntimeEnvironment: RuntimeEnvironment,
    ApplicationMode: S.optional(ApplicationMode),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaries = ApplicationSummary[];
export const ApplicationSummaries = S.Array(ApplicationSummary);
export interface ApplicationVersionSummary {
  ApplicationVersionId: number;
  ApplicationStatus: ApplicationStatus;
}
export const ApplicationVersionSummary = S.suspend(() =>
  S.Struct({
    ApplicationVersionId: S.Number,
    ApplicationStatus: ApplicationStatus,
  }),
).annotations({
  identifier: "ApplicationVersionSummary",
}) as any as S.Schema<ApplicationVersionSummary>;
export type ApplicationVersionSummaries = ApplicationVersionSummary[];
export const ApplicationVersionSummaries = S.Array(ApplicationVersionSummary);
export interface RunConfiguration {
  FlinkRunConfiguration?: FlinkRunConfiguration;
  SqlRunConfigurations?: SqlRunConfiguration[];
  ApplicationRestoreConfiguration?: ApplicationRestoreConfiguration;
}
export const RunConfiguration = S.suspend(() =>
  S.Struct({
    FlinkRunConfiguration: S.optional(FlinkRunConfiguration),
    SqlRunConfigurations: S.optional(SqlRunConfigurations),
    ApplicationRestoreConfiguration: S.optional(
      ApplicationRestoreConfiguration,
    ),
  }),
).annotations({
  identifier: "RunConfiguration",
}) as any as S.Schema<RunConfiguration>;
export interface CheckpointConfiguration {
  ConfigurationType: ConfigurationType;
  CheckpointingEnabled?: boolean;
  CheckpointInterval?: number;
  MinPauseBetweenCheckpoints?: number;
}
export const CheckpointConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationType: ConfigurationType,
    CheckpointingEnabled: S.optional(S.Boolean),
    CheckpointInterval: S.optional(S.Number),
    MinPauseBetweenCheckpoints: S.optional(S.Number),
  }),
).annotations({
  identifier: "CheckpointConfiguration",
}) as any as S.Schema<CheckpointConfiguration>;
export interface MonitoringConfiguration {
  ConfigurationType: ConfigurationType;
  MetricsLevel?: MetricsLevel;
  LogLevel?: LogLevel;
}
export const MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationType: ConfigurationType,
    MetricsLevel: S.optional(MetricsLevel),
    LogLevel: S.optional(LogLevel),
  }),
).annotations({
  identifier: "MonitoringConfiguration",
}) as any as S.Schema<MonitoringConfiguration>;
export interface ParallelismConfiguration {
  ConfigurationType: ConfigurationType;
  Parallelism?: number;
  ParallelismPerKPU?: number;
  AutoScalingEnabled?: boolean;
}
export const ParallelismConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationType: ConfigurationType,
    Parallelism: S.optional(S.Number),
    ParallelismPerKPU: S.optional(S.Number),
    AutoScalingEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParallelismConfiguration",
}) as any as S.Schema<ParallelismConfiguration>;
export interface ZeppelinMonitoringConfiguration {
  LogLevel: LogLevel;
}
export const ZeppelinMonitoringConfiguration = S.suspend(() =>
  S.Struct({ LogLevel: LogLevel }),
).annotations({
  identifier: "ZeppelinMonitoringConfiguration",
}) as any as S.Schema<ZeppelinMonitoringConfiguration>;
export interface CheckpointConfigurationUpdate {
  ConfigurationTypeUpdate?: ConfigurationType;
  CheckpointingEnabledUpdate?: boolean;
  CheckpointIntervalUpdate?: number;
  MinPauseBetweenCheckpointsUpdate?: number;
}
export const CheckpointConfigurationUpdate = S.suspend(() =>
  S.Struct({
    ConfigurationTypeUpdate: S.optional(ConfigurationType),
    CheckpointingEnabledUpdate: S.optional(S.Boolean),
    CheckpointIntervalUpdate: S.optional(S.Number),
    MinPauseBetweenCheckpointsUpdate: S.optional(S.Number),
  }),
).annotations({
  identifier: "CheckpointConfigurationUpdate",
}) as any as S.Schema<CheckpointConfigurationUpdate>;
export interface MonitoringConfigurationUpdate {
  ConfigurationTypeUpdate?: ConfigurationType;
  MetricsLevelUpdate?: MetricsLevel;
  LogLevelUpdate?: LogLevel;
}
export const MonitoringConfigurationUpdate = S.suspend(() =>
  S.Struct({
    ConfigurationTypeUpdate: S.optional(ConfigurationType),
    MetricsLevelUpdate: S.optional(MetricsLevel),
    LogLevelUpdate: S.optional(LogLevel),
  }),
).annotations({
  identifier: "MonitoringConfigurationUpdate",
}) as any as S.Schema<MonitoringConfigurationUpdate>;
export interface ParallelismConfigurationUpdate {
  ConfigurationTypeUpdate?: ConfigurationType;
  ParallelismUpdate?: number;
  ParallelismPerKPUUpdate?: number;
  AutoScalingEnabledUpdate?: boolean;
}
export const ParallelismConfigurationUpdate = S.suspend(() =>
  S.Struct({
    ConfigurationTypeUpdate: S.optional(ConfigurationType),
    ParallelismUpdate: S.optional(S.Number),
    ParallelismPerKPUUpdate: S.optional(S.Number),
    AutoScalingEnabledUpdate: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ParallelismConfigurationUpdate",
}) as any as S.Schema<ParallelismConfigurationUpdate>;
export interface ZeppelinMonitoringConfigurationUpdate {
  LogLevelUpdate: LogLevel;
}
export const ZeppelinMonitoringConfigurationUpdate = S.suspend(() =>
  S.Struct({ LogLevelUpdate: LogLevel }),
).annotations({
  identifier: "ZeppelinMonitoringConfigurationUpdate",
}) as any as S.Schema<ZeppelinMonitoringConfigurationUpdate>;
export interface AddApplicationCloudWatchLoggingOptionResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescription[];
  OperationId?: string;
}
export const AddApplicationCloudWatchLoggingOptionResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AddApplicationCloudWatchLoggingOptionResponse",
}) as any as S.Schema<AddApplicationCloudWatchLoggingOptionResponse>;
export interface AddApplicationInputProcessingConfigurationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  InputId: string;
  InputProcessingConfiguration: InputProcessingConfiguration;
}
export const AddApplicationInputProcessingConfigurationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    InputId: S.String,
    InputProcessingConfiguration: InputProcessingConfiguration,
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
  identifier: "AddApplicationInputProcessingConfigurationRequest",
}) as any as S.Schema<AddApplicationInputProcessingConfigurationRequest>;
export interface AddApplicationOutputRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  Output: Output;
}
export const AddApplicationOutputRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    Output: Output,
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
  identifier: "AddApplicationOutputRequest",
}) as any as S.Schema<AddApplicationOutputRequest>;
export interface AddApplicationReferenceDataSourceRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  ReferenceDataSource: ReferenceDataSource;
}
export const AddApplicationReferenceDataSourceRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ReferenceDataSource: ReferenceDataSource,
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
  identifier: "AddApplicationReferenceDataSourceRequest",
}) as any as S.Schema<AddApplicationReferenceDataSourceRequest>;
export interface DeleteApplicationCloudWatchLoggingOptionResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescription[];
  OperationId?: string;
}
export const DeleteApplicationCloudWatchLoggingOptionResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteApplicationCloudWatchLoggingOptionResponse",
}) as any as S.Schema<DeleteApplicationCloudWatchLoggingOptionResponse>;
export interface DiscoverInputSchemaResponse {
  InputSchema?: SourceSchema;
  ParsedInputRecords?: string[][];
  ProcessedInputRecords?: string[];
  RawInputRecords?: string[];
}
export const DiscoverInputSchemaResponse = S.suspend(() =>
  S.Struct({
    InputSchema: S.optional(SourceSchema),
    ParsedInputRecords: S.optional(ParsedInputRecords),
    ProcessedInputRecords: S.optional(ProcessedInputRecords),
    RawInputRecords: S.optional(RawInputRecords),
  }).pipe(ns),
).annotations({
  identifier: "DiscoverInputSchemaResponse",
}) as any as S.Schema<DiscoverInputSchemaResponse>;
export interface ListApplicationOperationsResponse {
  ApplicationOperationInfoList?: ApplicationOperationInfo[];
  NextToken?: string;
}
export const ListApplicationOperationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationOperationInfoList: S.optional(ApplicationOperationInfoList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationOperationsResponse",
}) as any as S.Schema<ListApplicationOperationsResponse>;
export interface ListApplicationsResponse {
  ApplicationSummaries: ApplicationSummary[];
  NextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSummaries: ApplicationSummaries,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListApplicationVersionsResponse {
  ApplicationVersionSummaries?: ApplicationVersionSummary[];
  NextToken?: string;
}
export const ListApplicationVersionsResponse = S.suspend(() =>
  S.Struct({
    ApplicationVersionSummaries: S.optional(ApplicationVersionSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationVersionsResponse",
}) as any as S.Schema<ListApplicationVersionsResponse>;
export interface StartApplicationRequest {
  ApplicationName: string;
  RunConfiguration?: RunConfiguration;
}
export const StartApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    RunConfiguration: S.optional(RunConfiguration),
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
  identifier: "StartApplicationRequest",
}) as any as S.Schema<StartApplicationRequest>;
export interface UpdateApplicationMaintenanceConfigurationResponse {
  ApplicationARN?: string;
  ApplicationMaintenanceConfigurationDescription?: ApplicationMaintenanceConfigurationDescription;
}
export const UpdateApplicationMaintenanceConfigurationResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationMaintenanceConfigurationDescription: S.optional(
      ApplicationMaintenanceConfigurationDescription,
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateApplicationMaintenanceConfigurationResponse",
}) as any as S.Schema<UpdateApplicationMaintenanceConfigurationResponse>;
export interface FlinkApplicationConfiguration {
  CheckpointConfiguration?: CheckpointConfiguration;
  MonitoringConfiguration?: MonitoringConfiguration;
  ParallelismConfiguration?: ParallelismConfiguration;
}
export const FlinkApplicationConfiguration = S.suspend(() =>
  S.Struct({
    CheckpointConfiguration: S.optional(CheckpointConfiguration),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
  }),
).annotations({
  identifier: "FlinkApplicationConfiguration",
}) as any as S.Schema<FlinkApplicationConfiguration>;
export interface ApplicationVersionChangeDetails {
  ApplicationVersionUpdatedFrom: number;
  ApplicationVersionUpdatedTo: number;
}
export const ApplicationVersionChangeDetails = S.suspend(() =>
  S.Struct({
    ApplicationVersionUpdatedFrom: S.Number,
    ApplicationVersionUpdatedTo: S.Number,
  }),
).annotations({
  identifier: "ApplicationVersionChangeDetails",
}) as any as S.Schema<ApplicationVersionChangeDetails>;
export interface FlinkApplicationConfigurationUpdate {
  CheckpointConfigurationUpdate?: CheckpointConfigurationUpdate;
  MonitoringConfigurationUpdate?: MonitoringConfigurationUpdate;
  ParallelismConfigurationUpdate?: ParallelismConfigurationUpdate;
}
export const FlinkApplicationConfigurationUpdate = S.suspend(() =>
  S.Struct({
    CheckpointConfigurationUpdate: S.optional(CheckpointConfigurationUpdate),
    MonitoringConfigurationUpdate: S.optional(MonitoringConfigurationUpdate),
    ParallelismConfigurationUpdate: S.optional(ParallelismConfigurationUpdate),
  }),
).annotations({
  identifier: "FlinkApplicationConfigurationUpdate",
}) as any as S.Schema<FlinkApplicationConfigurationUpdate>;
export interface GlueDataCatalogConfiguration {
  DatabaseARN: string;
}
export const GlueDataCatalogConfiguration = S.suspend(() =>
  S.Struct({ DatabaseARN: S.String }),
).annotations({
  identifier: "GlueDataCatalogConfiguration",
}) as any as S.Schema<GlueDataCatalogConfiguration>;
export interface S3ContentBaseLocation {
  BucketARN: string;
  BasePath?: string;
}
export const S3ContentBaseLocation = S.suspend(() =>
  S.Struct({ BucketARN: S.String, BasePath: S.optional(S.String) }),
).annotations({
  identifier: "S3ContentBaseLocation",
}) as any as S.Schema<S3ContentBaseLocation>;
export interface KinesisStreamsInputUpdate {
  ResourceARNUpdate: string;
}
export const KinesisStreamsInputUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "KinesisStreamsInputUpdate",
}) as any as S.Schema<KinesisStreamsInputUpdate>;
export interface KinesisFirehoseInputUpdate {
  ResourceARNUpdate: string;
}
export const KinesisFirehoseInputUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "KinesisFirehoseInputUpdate",
}) as any as S.Schema<KinesisFirehoseInputUpdate>;
export interface InputSchemaUpdate {
  RecordFormatUpdate?: RecordFormat;
  RecordEncodingUpdate?: string;
  RecordColumnUpdates?: RecordColumn[];
}
export const InputSchemaUpdate = S.suspend(() =>
  S.Struct({
    RecordFormatUpdate: S.optional(RecordFormat),
    RecordEncodingUpdate: S.optional(S.String),
    RecordColumnUpdates: S.optional(RecordColumns),
  }),
).annotations({
  identifier: "InputSchemaUpdate",
}) as any as S.Schema<InputSchemaUpdate>;
export interface InputParallelismUpdate {
  CountUpdate: number;
}
export const InputParallelismUpdate = S.suspend(() =>
  S.Struct({ CountUpdate: S.Number }),
).annotations({
  identifier: "InputParallelismUpdate",
}) as any as S.Schema<InputParallelismUpdate>;
export interface KinesisStreamsOutputUpdate {
  ResourceARNUpdate: string;
}
export const KinesisStreamsOutputUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "KinesisStreamsOutputUpdate",
}) as any as S.Schema<KinesisStreamsOutputUpdate>;
export interface KinesisFirehoseOutputUpdate {
  ResourceARNUpdate: string;
}
export const KinesisFirehoseOutputUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "KinesisFirehoseOutputUpdate",
}) as any as S.Schema<KinesisFirehoseOutputUpdate>;
export interface LambdaOutputUpdate {
  ResourceARNUpdate: string;
}
export const LambdaOutputUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "LambdaOutputUpdate",
}) as any as S.Schema<LambdaOutputUpdate>;
export interface S3ReferenceDataSourceUpdate {
  BucketARNUpdate?: string;
  FileKeyUpdate?: string;
}
export const S3ReferenceDataSourceUpdate = S.suspend(() =>
  S.Struct({
    BucketARNUpdate: S.optional(S.String),
    FileKeyUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ReferenceDataSourceUpdate",
}) as any as S.Schema<S3ReferenceDataSourceUpdate>;
export interface S3ContentLocationUpdate {
  BucketARNUpdate?: string;
  FileKeyUpdate?: string;
  ObjectVersionUpdate?: string;
}
export const S3ContentLocationUpdate = S.suspend(() =>
  S.Struct({
    BucketARNUpdate: S.optional(S.String),
    FileKeyUpdate: S.optional(S.String),
    ObjectVersionUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ContentLocationUpdate",
}) as any as S.Schema<S3ContentLocationUpdate>;
export interface GlueDataCatalogConfigurationUpdate {
  DatabaseARNUpdate: string;
}
export const GlueDataCatalogConfigurationUpdate = S.suspend(() =>
  S.Struct({ DatabaseARNUpdate: S.String }),
).annotations({
  identifier: "GlueDataCatalogConfigurationUpdate",
}) as any as S.Schema<GlueDataCatalogConfigurationUpdate>;
export interface S3ContentBaseLocationUpdate {
  BucketARNUpdate?: string;
  BasePathUpdate?: string;
}
export const S3ContentBaseLocationUpdate = S.suspend(() =>
  S.Struct({
    BucketARNUpdate: S.optional(S.String),
    BasePathUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ContentBaseLocationUpdate",
}) as any as S.Schema<S3ContentBaseLocationUpdate>;
export interface CodeContent {
  TextContent?: string;
  ZipFileContent?: Uint8Array;
  S3ContentLocation?: S3ContentLocation;
}
export const CodeContent = S.suspend(() =>
  S.Struct({
    TextContent: S.optional(S.String),
    ZipFileContent: S.optional(T.Blob),
    S3ContentLocation: S.optional(S3ContentLocation),
  }),
).annotations({ identifier: "CodeContent" }) as any as S.Schema<CodeContent>;
export interface CatalogConfiguration {
  GlueDataCatalogConfiguration: GlueDataCatalogConfiguration;
}
export const CatalogConfiguration = S.suspend(() =>
  S.Struct({ GlueDataCatalogConfiguration: GlueDataCatalogConfiguration }),
).annotations({
  identifier: "CatalogConfiguration",
}) as any as S.Schema<CatalogConfiguration>;
export interface DeployAsApplicationConfiguration {
  S3ContentLocation: S3ContentBaseLocation;
}
export const DeployAsApplicationConfiguration = S.suspend(() =>
  S.Struct({ S3ContentLocation: S3ContentBaseLocation }),
).annotations({
  identifier: "DeployAsApplicationConfiguration",
}) as any as S.Schema<DeployAsApplicationConfiguration>;
export interface CustomArtifactConfiguration {
  ArtifactType: ArtifactType;
  S3ContentLocation?: S3ContentLocation;
  MavenReference?: MavenReference;
}
export const CustomArtifactConfiguration = S.suspend(() =>
  S.Struct({
    ArtifactType: ArtifactType,
    S3ContentLocation: S.optional(S3ContentLocation),
    MavenReference: S.optional(MavenReference),
  }),
).annotations({
  identifier: "CustomArtifactConfiguration",
}) as any as S.Schema<CustomArtifactConfiguration>;
export type CustomArtifactsConfigurationList = CustomArtifactConfiguration[];
export const CustomArtifactsConfigurationList = S.Array(
  CustomArtifactConfiguration,
);
export interface ErrorInfo {
  ErrorString?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({ ErrorString: S.optional(S.String) }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export interface OutputUpdate {
  OutputId: string;
  NameUpdate?: string;
  KinesisStreamsOutputUpdate?: KinesisStreamsOutputUpdate;
  KinesisFirehoseOutputUpdate?: KinesisFirehoseOutputUpdate;
  LambdaOutputUpdate?: LambdaOutputUpdate;
  DestinationSchemaUpdate?: DestinationSchema;
}
export const OutputUpdate = S.suspend(() =>
  S.Struct({
    OutputId: S.String,
    NameUpdate: S.optional(S.String),
    KinesisStreamsOutputUpdate: S.optional(KinesisStreamsOutputUpdate),
    KinesisFirehoseOutputUpdate: S.optional(KinesisFirehoseOutputUpdate),
    LambdaOutputUpdate: S.optional(LambdaOutputUpdate),
    DestinationSchemaUpdate: S.optional(DestinationSchema),
  }),
).annotations({ identifier: "OutputUpdate" }) as any as S.Schema<OutputUpdate>;
export type OutputUpdates = OutputUpdate[];
export const OutputUpdates = S.Array(OutputUpdate);
export interface ReferenceDataSourceUpdate {
  ReferenceId: string;
  TableNameUpdate?: string;
  S3ReferenceDataSourceUpdate?: S3ReferenceDataSourceUpdate;
  ReferenceSchemaUpdate?: SourceSchema;
}
export const ReferenceDataSourceUpdate = S.suspend(() =>
  S.Struct({
    ReferenceId: S.String,
    TableNameUpdate: S.optional(S.String),
    S3ReferenceDataSourceUpdate: S.optional(S3ReferenceDataSourceUpdate),
    ReferenceSchemaUpdate: S.optional(SourceSchema),
  }),
).annotations({
  identifier: "ReferenceDataSourceUpdate",
}) as any as S.Schema<ReferenceDataSourceUpdate>;
export type ReferenceDataSourceUpdates = ReferenceDataSourceUpdate[];
export const ReferenceDataSourceUpdates = S.Array(ReferenceDataSourceUpdate);
export interface CodeContentUpdate {
  TextContentUpdate?: string;
  ZipFileContentUpdate?: Uint8Array;
  S3ContentLocationUpdate?: S3ContentLocationUpdate;
}
export const CodeContentUpdate = S.suspend(() =>
  S.Struct({
    TextContentUpdate: S.optional(S.String),
    ZipFileContentUpdate: S.optional(T.Blob),
    S3ContentLocationUpdate: S.optional(S3ContentLocationUpdate),
  }),
).annotations({
  identifier: "CodeContentUpdate",
}) as any as S.Schema<CodeContentUpdate>;
export interface CatalogConfigurationUpdate {
  GlueDataCatalogConfigurationUpdate: GlueDataCatalogConfigurationUpdate;
}
export const CatalogConfigurationUpdate = S.suspend(() =>
  S.Struct({
    GlueDataCatalogConfigurationUpdate: GlueDataCatalogConfigurationUpdate,
  }),
).annotations({
  identifier: "CatalogConfigurationUpdate",
}) as any as S.Schema<CatalogConfigurationUpdate>;
export interface DeployAsApplicationConfigurationUpdate {
  S3ContentLocationUpdate?: S3ContentBaseLocationUpdate;
}
export const DeployAsApplicationConfigurationUpdate = S.suspend(() =>
  S.Struct({
    S3ContentLocationUpdate: S.optional(S3ContentBaseLocationUpdate),
  }),
).annotations({
  identifier: "DeployAsApplicationConfigurationUpdate",
}) as any as S.Schema<DeployAsApplicationConfigurationUpdate>;
export interface AddApplicationOutputResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  OutputDescriptions?: OutputDescription[];
}
export const AddApplicationOutputResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    OutputDescriptions: S.optional(OutputDescriptions),
  }).pipe(ns),
).annotations({
  identifier: "AddApplicationOutputResponse",
}) as any as S.Schema<AddApplicationOutputResponse>;
export interface AddApplicationReferenceDataSourceResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  ReferenceDataSourceDescriptions?: ReferenceDataSourceDescription[];
}
export const AddApplicationReferenceDataSourceResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    ReferenceDataSourceDescriptions: S.optional(
      ReferenceDataSourceDescriptions,
    ),
  }).pipe(ns),
).annotations({
  identifier: "AddApplicationReferenceDataSourceResponse",
}) as any as S.Schema<AddApplicationReferenceDataSourceResponse>;
export interface AddApplicationVpcConfigurationResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  VpcConfigurationDescription?: VpcConfigurationDescription;
  OperationId?: string;
}
export const AddApplicationVpcConfigurationResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    VpcConfigurationDescription: S.optional(VpcConfigurationDescription),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AddApplicationVpcConfigurationResponse",
}) as any as S.Schema<AddApplicationVpcConfigurationResponse>;
export interface DescribeApplicationSnapshotResponse {
  SnapshotDetails: SnapshotDetails;
}
export const DescribeApplicationSnapshotResponse = S.suspend(() =>
  S.Struct({ SnapshotDetails: SnapshotDetails }).pipe(ns),
).annotations({
  identifier: "DescribeApplicationSnapshotResponse",
}) as any as S.Schema<DescribeApplicationSnapshotResponse>;
export interface StartApplicationResponse {
  OperationId?: string;
}
export const StartApplicationResponse = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartApplicationResponse",
}) as any as S.Schema<StartApplicationResponse>;
export interface InputLambdaProcessorUpdate {
  ResourceARNUpdate: string;
}
export const InputLambdaProcessorUpdate = S.suspend(() =>
  S.Struct({ ResourceARNUpdate: S.String }),
).annotations({
  identifier: "InputLambdaProcessorUpdate",
}) as any as S.Schema<InputLambdaProcessorUpdate>;
export interface EnvironmentProperties {
  PropertyGroups: PropertyGroup[];
}
export const EnvironmentProperties = S.suspend(() =>
  S.Struct({ PropertyGroups: PropertyGroups }),
).annotations({
  identifier: "EnvironmentProperties",
}) as any as S.Schema<EnvironmentProperties>;
export interface ApplicationCodeConfiguration {
  CodeContent?: CodeContent;
  CodeContentType: CodeContentType;
}
export const ApplicationCodeConfiguration = S.suspend(() =>
  S.Struct({
    CodeContent: S.optional(CodeContent),
    CodeContentType: CodeContentType,
  }),
).annotations({
  identifier: "ApplicationCodeConfiguration",
}) as any as S.Schema<ApplicationCodeConfiguration>;
export interface ZeppelinApplicationConfiguration {
  MonitoringConfiguration?: ZeppelinMonitoringConfiguration;
  CatalogConfiguration?: CatalogConfiguration;
  DeployAsApplicationConfiguration?: DeployAsApplicationConfiguration;
  CustomArtifactsConfiguration?: CustomArtifactConfiguration[];
}
export const ZeppelinApplicationConfiguration = S.suspend(() =>
  S.Struct({
    MonitoringConfiguration: S.optional(ZeppelinMonitoringConfiguration),
    CatalogConfiguration: S.optional(CatalogConfiguration),
    DeployAsApplicationConfiguration: S.optional(
      DeployAsApplicationConfiguration,
    ),
    CustomArtifactsConfiguration: S.optional(CustomArtifactsConfigurationList),
  }),
).annotations({
  identifier: "ZeppelinApplicationConfiguration",
}) as any as S.Schema<ZeppelinApplicationConfiguration>;
export interface OperationFailureDetails {
  RollbackOperationId?: string;
  ErrorInfo?: ErrorInfo;
}
export const OperationFailureDetails = S.suspend(() =>
  S.Struct({
    RollbackOperationId: S.optional(S.String),
    ErrorInfo: S.optional(ErrorInfo),
  }),
).annotations({
  identifier: "OperationFailureDetails",
}) as any as S.Schema<OperationFailureDetails>;
export interface ApplicationCodeConfigurationUpdate {
  CodeContentTypeUpdate?: CodeContentType;
  CodeContentUpdate?: CodeContentUpdate;
}
export const ApplicationCodeConfigurationUpdate = S.suspend(() =>
  S.Struct({
    CodeContentTypeUpdate: S.optional(CodeContentType),
    CodeContentUpdate: S.optional(CodeContentUpdate),
  }),
).annotations({
  identifier: "ApplicationCodeConfigurationUpdate",
}) as any as S.Schema<ApplicationCodeConfigurationUpdate>;
export interface ZeppelinApplicationConfigurationUpdate {
  MonitoringConfigurationUpdate?: ZeppelinMonitoringConfigurationUpdate;
  CatalogConfigurationUpdate?: CatalogConfigurationUpdate;
  DeployAsApplicationConfigurationUpdate?: DeployAsApplicationConfigurationUpdate;
  CustomArtifactsConfigurationUpdate?: CustomArtifactConfiguration[];
}
export const ZeppelinApplicationConfigurationUpdate = S.suspend(() =>
  S.Struct({
    MonitoringConfigurationUpdate: S.optional(
      ZeppelinMonitoringConfigurationUpdate,
    ),
    CatalogConfigurationUpdate: S.optional(CatalogConfigurationUpdate),
    DeployAsApplicationConfigurationUpdate: S.optional(
      DeployAsApplicationConfigurationUpdate,
    ),
    CustomArtifactsConfigurationUpdate: S.optional(
      CustomArtifactsConfigurationList,
    ),
  }),
).annotations({
  identifier: "ZeppelinApplicationConfigurationUpdate",
}) as any as S.Schema<ZeppelinApplicationConfigurationUpdate>;
export interface InputProcessingConfigurationUpdate {
  InputLambdaProcessorUpdate: InputLambdaProcessorUpdate;
}
export const InputProcessingConfigurationUpdate = S.suspend(() =>
  S.Struct({ InputLambdaProcessorUpdate: InputLambdaProcessorUpdate }),
).annotations({
  identifier: "InputProcessingConfigurationUpdate",
}) as any as S.Schema<InputProcessingConfigurationUpdate>;
export interface ApplicationConfiguration {
  SqlApplicationConfiguration?: SqlApplicationConfiguration;
  FlinkApplicationConfiguration?: FlinkApplicationConfiguration;
  EnvironmentProperties?: EnvironmentProperties;
  ApplicationCodeConfiguration?: ApplicationCodeConfiguration;
  ApplicationSnapshotConfiguration?: ApplicationSnapshotConfiguration;
  ApplicationSystemRollbackConfiguration?: ApplicationSystemRollbackConfiguration;
  VpcConfigurations?: VpcConfiguration[];
  ZeppelinApplicationConfiguration?: ZeppelinApplicationConfiguration;
  ApplicationEncryptionConfiguration?: ApplicationEncryptionConfiguration;
}
export const ApplicationConfiguration = S.suspend(() =>
  S.Struct({
    SqlApplicationConfiguration: S.optional(SqlApplicationConfiguration),
    FlinkApplicationConfiguration: S.optional(FlinkApplicationConfiguration),
    EnvironmentProperties: S.optional(EnvironmentProperties),
    ApplicationCodeConfiguration: S.optional(ApplicationCodeConfiguration),
    ApplicationSnapshotConfiguration: S.optional(
      ApplicationSnapshotConfiguration,
    ),
    ApplicationSystemRollbackConfiguration: S.optional(
      ApplicationSystemRollbackConfiguration,
    ),
    VpcConfigurations: S.optional(VpcConfigurations),
    ZeppelinApplicationConfiguration: S.optional(
      ZeppelinApplicationConfiguration,
    ),
    ApplicationEncryptionConfiguration: S.optional(
      ApplicationEncryptionConfiguration,
    ),
  }),
).annotations({
  identifier: "ApplicationConfiguration",
}) as any as S.Schema<ApplicationConfiguration>;
export interface ApplicationOperationInfoDetails {
  Operation: string;
  StartTime: Date;
  EndTime: Date;
  OperationStatus: OperationStatus;
  ApplicationVersionChangeDetails?: ApplicationVersionChangeDetails;
  OperationFailureDetails?: OperationFailureDetails;
}
export const ApplicationOperationInfoDetails = S.suspend(() =>
  S.Struct({
    Operation: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    OperationStatus: OperationStatus,
    ApplicationVersionChangeDetails: S.optional(
      ApplicationVersionChangeDetails,
    ),
    OperationFailureDetails: S.optional(OperationFailureDetails),
  }),
).annotations({
  identifier: "ApplicationOperationInfoDetails",
}) as any as S.Schema<ApplicationOperationInfoDetails>;
export interface InputUpdate {
  InputId: string;
  NamePrefixUpdate?: string;
  InputProcessingConfigurationUpdate?: InputProcessingConfigurationUpdate;
  KinesisStreamsInputUpdate?: KinesisStreamsInputUpdate;
  KinesisFirehoseInputUpdate?: KinesisFirehoseInputUpdate;
  InputSchemaUpdate?: InputSchemaUpdate;
  InputParallelismUpdate?: InputParallelismUpdate;
}
export const InputUpdate = S.suspend(() =>
  S.Struct({
    InputId: S.String,
    NamePrefixUpdate: S.optional(S.String),
    InputProcessingConfigurationUpdate: S.optional(
      InputProcessingConfigurationUpdate,
    ),
    KinesisStreamsInputUpdate: S.optional(KinesisStreamsInputUpdate),
    KinesisFirehoseInputUpdate: S.optional(KinesisFirehoseInputUpdate),
    InputSchemaUpdate: S.optional(InputSchemaUpdate),
    InputParallelismUpdate: S.optional(InputParallelismUpdate),
  }),
).annotations({ identifier: "InputUpdate" }) as any as S.Schema<InputUpdate>;
export type InputUpdates = InputUpdate[];
export const InputUpdates = S.Array(InputUpdate);
export interface CreateApplicationRequest {
  ApplicationName: string;
  ApplicationDescription?: string;
  RuntimeEnvironment: RuntimeEnvironment;
  ServiceExecutionRole: string;
  ApplicationConfiguration?: ApplicationConfiguration;
  CloudWatchLoggingOptions?: CloudWatchLoggingOption[];
  Tags?: Tag[];
  ApplicationMode?: ApplicationMode;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationDescription: S.optional(S.String),
    RuntimeEnvironment: RuntimeEnvironment,
    ServiceExecutionRole: S.String,
    ApplicationConfiguration: S.optional(ApplicationConfiguration),
    CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
    Tags: S.optional(Tags),
    ApplicationMode: S.optional(ApplicationMode),
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
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DescribeApplicationOperationResponse {
  ApplicationOperationInfoDetails?: ApplicationOperationInfoDetails;
}
export const DescribeApplicationOperationResponse = S.suspend(() =>
  S.Struct({
    ApplicationOperationInfoDetails: S.optional(
      ApplicationOperationInfoDetails,
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeApplicationOperationResponse",
}) as any as S.Schema<DescribeApplicationOperationResponse>;
export interface SqlApplicationConfigurationUpdate {
  InputUpdates?: InputUpdate[];
  OutputUpdates?: OutputUpdate[];
  ReferenceDataSourceUpdates?: ReferenceDataSourceUpdate[];
}
export const SqlApplicationConfigurationUpdate = S.suspend(() =>
  S.Struct({
    InputUpdates: S.optional(InputUpdates),
    OutputUpdates: S.optional(OutputUpdates),
    ReferenceDataSourceUpdates: S.optional(ReferenceDataSourceUpdates),
  }),
).annotations({
  identifier: "SqlApplicationConfigurationUpdate",
}) as any as S.Schema<SqlApplicationConfigurationUpdate>;
export interface ApplicationConfigurationUpdate {
  SqlApplicationConfigurationUpdate?: SqlApplicationConfigurationUpdate;
  ApplicationCodeConfigurationUpdate?: ApplicationCodeConfigurationUpdate;
  FlinkApplicationConfigurationUpdate?: FlinkApplicationConfigurationUpdate;
  EnvironmentPropertyUpdates?: EnvironmentPropertyUpdates;
  ApplicationSnapshotConfigurationUpdate?: ApplicationSnapshotConfigurationUpdate;
  ApplicationSystemRollbackConfigurationUpdate?: ApplicationSystemRollbackConfigurationUpdate;
  VpcConfigurationUpdates?: VpcConfigurationUpdate[];
  ZeppelinApplicationConfigurationUpdate?: ZeppelinApplicationConfigurationUpdate;
  ApplicationEncryptionConfigurationUpdate?: ApplicationEncryptionConfigurationUpdate;
}
export const ApplicationConfigurationUpdate = S.suspend(() =>
  S.Struct({
    SqlApplicationConfigurationUpdate: S.optional(
      SqlApplicationConfigurationUpdate,
    ),
    ApplicationCodeConfigurationUpdate: S.optional(
      ApplicationCodeConfigurationUpdate,
    ),
    FlinkApplicationConfigurationUpdate: S.optional(
      FlinkApplicationConfigurationUpdate,
    ),
    EnvironmentPropertyUpdates: S.optional(EnvironmentPropertyUpdates),
    ApplicationSnapshotConfigurationUpdate: S.optional(
      ApplicationSnapshotConfigurationUpdate,
    ),
    ApplicationSystemRollbackConfigurationUpdate: S.optional(
      ApplicationSystemRollbackConfigurationUpdate,
    ),
    VpcConfigurationUpdates: S.optional(VpcConfigurationUpdates),
    ZeppelinApplicationConfigurationUpdate: S.optional(
      ZeppelinApplicationConfigurationUpdate,
    ),
    ApplicationEncryptionConfigurationUpdate: S.optional(
      ApplicationEncryptionConfigurationUpdate,
    ),
  }),
).annotations({
  identifier: "ApplicationConfigurationUpdate",
}) as any as S.Schema<ApplicationConfigurationUpdate>;
export interface AddApplicationInputRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  Input: Input;
}
export const AddApplicationInputRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    Input: Input,
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
  identifier: "AddApplicationInputRequest",
}) as any as S.Schema<AddApplicationInputRequest>;
export interface AddApplicationInputProcessingConfigurationResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  InputId?: string;
  InputProcessingConfigurationDescription?: InputProcessingConfigurationDescription;
}
export const AddApplicationInputProcessingConfigurationResponse = S.suspend(
  () =>
    S.Struct({
      ApplicationARN: S.optional(S.String),
      ApplicationVersionId: S.optional(S.Number),
      InputId: S.optional(S.String),
      InputProcessingConfigurationDescription: S.optional(
        InputProcessingConfigurationDescription,
      ),
    }).pipe(ns),
).annotations({
  identifier: "AddApplicationInputProcessingConfigurationResponse",
}) as any as S.Schema<AddApplicationInputProcessingConfigurationResponse>;
export interface CreateApplicationResponse {
  ApplicationDetail: ApplicationDetail;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationDetail: ApplicationDetail }).pipe(ns),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface UpdateApplicationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId?: number;
  ApplicationConfigurationUpdate?: ApplicationConfigurationUpdate;
  ServiceExecutionRoleUpdate?: string;
  RunConfigurationUpdate?: RunConfigurationUpdate;
  CloudWatchLoggingOptionUpdates?: CloudWatchLoggingOptionUpdate[];
  ConditionalToken?: string;
  RuntimeEnvironmentUpdate?: RuntimeEnvironment;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    ApplicationConfigurationUpdate: S.optional(ApplicationConfigurationUpdate),
    ServiceExecutionRoleUpdate: S.optional(S.String),
    RunConfigurationUpdate: S.optional(RunConfigurationUpdate),
    CloudWatchLoggingOptionUpdates: S.optional(CloudWatchLoggingOptionUpdates),
    ConditionalToken: S.optional(S.String),
    RuntimeEnvironmentUpdate: S.optional(RuntimeEnvironment),
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
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface AddApplicationInputResponse {
  ApplicationARN?: string;
  ApplicationVersionId?: number;
  InputDescriptions?: InputDescription[];
}
export const AddApplicationInputResponse = S.suspend(() =>
  S.Struct({
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    InputDescriptions: S.optional(InputDescriptions),
  }).pipe(ns),
).annotations({
  identifier: "AddApplicationInputResponse",
}) as any as S.Schema<AddApplicationInputResponse>;
export interface DescribeApplicationResponse {
  ApplicationDetail: ApplicationDetail;
}
export const DescribeApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationDetail: ApplicationDetail }).pipe(ns),
).annotations({
  identifier: "DescribeApplicationResponse",
}) as any as S.Schema<DescribeApplicationResponse>;
export interface UpdateApplicationResponse {
  ApplicationDetail: ApplicationDetail;
  OperationId?: string;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({
    ApplicationDetail: ApplicationDetail,
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;

//# Errors
export class InvalidApplicationConfigurationException extends S.TaggedError<InvalidApplicationConfigurationException>()(
  "InvalidApplicationConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class ResourceProvisionedThroughputExceededException extends S.TaggedError<ResourceProvisionedThroughputExceededException>()(
  "ResourceProvisionedThroughputExceededException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class CodeValidationException extends S.TaggedError<CodeValidationException>()(
  "CodeValidationException",
  { Message: S.optional(S.String) },
) {}
export class UnableToDetectSchemaException extends S.TaggedError<UnableToDetectSchemaException>()(
  "UnableToDetectSchemaException",
  {
    Message: S.optional(S.String),
    RawInputRecords: S.optional(RawInputRecords),
    ProcessedInputRecords: S.optional(ProcessedInputRecords),
  },
) {}

//# Operations
/**
 * Starts the specified Managed Service for Apache Flink application. After creating an application, you must exclusively call this operation to
 * start your application.
 */
export const startApplication: (
  input: StartApplicationRequest,
) => effect.Effect<
  StartApplicationResponse,
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationRequest,
  output: StartApplicationResponse,
  errors: [
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists information about the current application snapshots.
 */
export const listApplicationSnapshots: {
  (
    input: ListApplicationSnapshotsRequest,
  ): effect.Effect<
    ListApplicationSnapshotsResponse,
    InvalidArgumentException | UnsupportedOperationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationSnapshotsRequest,
  ) => stream.Stream<
    ListApplicationSnapshotsResponse,
    InvalidArgumentException | UnsupportedOperationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationSnapshotsRequest,
  ) => stream.Stream<
    SnapshotDetails,
    InvalidArgumentException | UnsupportedOperationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationSnapshotsRequest,
  output: ListApplicationSnapshotsResponse,
  errors: [InvalidArgumentException, UnsupportedOperationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SnapshotSummaries",
    pageSize: "Limit",
  } as const,
}));
/**
 * Updates the maintenance configuration of the Managed Service for Apache Flink application.
 *
 * You can invoke this operation on an application that is in one of the two following
 * states: `READY` or `RUNNING`. If you invoke it when the application is
 * in a state other than these two states, it throws a `ResourceInUseException`. The
 * service makes use of the updated configuration the next time it schedules maintenance for the
 * application. If you invoke this operation after the service schedules maintenance, the service
 * will apply the configuration update the next time it schedules maintenance for the
 * application. This means that you might not see the maintenance configuration update applied to
 * the maintenance process that follows a successful invocation of this operation, but to the
 * following maintenance process instead.
 *
 * To see the current maintenance configuration of your application, invoke the
 * DescribeApplication operation.
 *
 * For information about application maintenance, see Managed Service for Apache Flink for Apache Flink Maintenance.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const updateApplicationMaintenanceConfiguration: (
  input: UpdateApplicationMaintenanceConfigurationRequest,
) => effect.Effect<
  UpdateApplicationMaintenanceConfigurationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationMaintenanceConfigurationRequest,
  output: UpdateApplicationMaintenanceConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes a VPC configuration from a Managed Service for Apache Flink application.
 */
export const deleteApplicationVpcConfiguration: (
  input: DeleteApplicationVpcConfigurationRequest,
) => effect.Effect<
  DeleteApplicationVpcConfigurationResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationVpcConfigurationRequest,
  output: DeleteApplicationVpcConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds a Virtual Private Cloud (VPC) configuration to the application. Applications can use VPCs to store
 * and access resources securely.
 *
 * Note the following about VPC configurations for Managed Service for Apache Flink applications:
 *
 * - VPC configurations are not supported for SQL applications.
 *
 * - When a VPC is added to a Managed Service for Apache Flink application, the application can no longer be accessed from the
 * Internet directly. To enable Internet access to the application, add an Internet gateway to your VPC.
 */
export const addApplicationVpcConfiguration: (
  input: AddApplicationVpcConfigurationRequest,
) => effect.Effect<
  AddApplicationVpcConfigurationResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationVpcConfigurationRequest,
  output: AddApplicationVpcConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of Managed Service for Apache Flink applications in your account. For each
 * application, the response includes the application name, Amazon Resource Name (ARN), and
 * status.
 *
 * If you want detailed information about a specific application, use
 * DescribeApplication.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): effect.Effect<
    ListApplicationsResponse,
    InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ListApplicationsResponse,
    InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => stream.Stream<
    ApplicationSummary,
    InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationSummaries",
    pageSize: "Limit",
  } as const,
}));
/**
 * Deletes the specified application. Managed Service for Apache Flink halts application execution and deletes the application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => effect.Effect<
  DeleteApplicationResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an InputProcessingConfiguration from an input.
 */
export const deleteApplicationInputProcessingConfiguration: (
  input: DeleteApplicationInputProcessingConfigurationRequest,
) => effect.Effect<
  DeleteApplicationInputProcessingConfigurationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationInputProcessingConfigurationRequest,
  output: DeleteApplicationInputProcessingConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the output destination configuration from your SQL-based Kinesis Data Analytics application's configuration.
 * Kinesis Data Analytics will no longer write data from
 * the corresponding in-application stream to the external output destination.
 */
export const deleteApplicationOutput: (
  input: DeleteApplicationOutputRequest,
) => effect.Effect<
  DeleteApplicationOutputResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationOutputRequest,
  output: DeleteApplicationOutputResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a reference data source configuration from the specified SQL-based Kinesis Data Analytics application's configuration.
 *
 * If the application is running, Kinesis Data Analytics immediately removes the in-application table
 * that you created using the AddApplicationReferenceDataSource operation.
 */
export const deleteApplicationReferenceDataSource: (
  input: DeleteApplicationReferenceDataSourceRequest,
) => effect.Effect<
  DeleteApplicationReferenceDataSourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationReferenceDataSourceRequest,
  output: DeleteApplicationReferenceDataSourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Reverts the application to the previous running version. You can roll back an
 * application if you suspect it is stuck in a transient status or in the running status.
 *
 * You can roll back an application only if it is in the `UPDATING`,
 * `AUTOSCALING`, or `RUNNING` statuses.
 *
 * When you rollback an application, it loads state data from the last successful snapshot.
 * If the application has no snapshots, Managed Service for Apache Flink rejects the rollback request.
 */
export const rollbackApplication: (
  input: RollbackApplicationRequest,
) => effect.Effect<
  RollbackApplicationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackApplicationRequest,
  output: RollbackApplicationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops the application from processing data. You can stop
 * an application only if it is in the running status, unless you set the `Force`
 * parameter to `true`.
 *
 * You can use the DescribeApplication operation to find the application status.
 *
 * Managed Service for Apache Flink takes a snapshot when the application is stopped, unless `Force` is set
 * to `true`.
 */
export const stopApplication: (
  input: StopApplicationRequest,
) => effect.Effect<
  StopApplicationResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationRequest,
  output: StopApplicationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a snapshot of application state.
 */
export const deleteApplicationSnapshot: (
  input: DeleteApplicationSnapshotRequest,
) => effect.Effect<
  DeleteApplicationSnapshotResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationSnapshotRequest,
  output: DeleteApplicationSnapshotResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds an Amazon CloudWatch log stream to monitor application configuration errors.
 */
export const addApplicationCloudWatchLoggingOption: (
  input: AddApplicationCloudWatchLoggingOptionRequest,
) => effect.Effect<
  AddApplicationCloudWatchLoggingOptionResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationCloudWatchLoggingOptionRequest,
  output: AddApplicationCloudWatchLoggingOptionResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds an external destination to your SQL-based Kinesis Data Analytics application.
 *
 * If you want Kinesis Data Analytics to deliver data from an in-application stream within
 * your application to an external destination (such as an Kinesis data stream, a Kinesis Data
 * Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to
 * your application using this operation. You can configure one or more outputs for your
 * application. Each output configuration maps an in-application stream and an external
 * destination.
 *
 * You can use one of the output configurations to deliver data from your
 * in-application error stream to an external destination so that you can analyze the
 * errors.
 *
 * Any configuration update, including adding a streaming source using this
 * operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application
 * version.
 */
export const addApplicationOutput: (
  input: AddApplicationOutputRequest,
) => effect.Effect<
  AddApplicationOutputResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationOutputRequest,
  output: AddApplicationOutputResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds a reference data source to an existing SQL-based Kinesis Data Analytics application.
 *
 * Kinesis Data Analytics reads reference data (that is, an Amazon S3 object) and creates an
 * in-application table within your application. In the request, you provide the source (S3
 * bucket name and object key name), name of the in-application table to create, and the
 * necessary mapping information that describes how data in an Amazon S3 object maps to columns
 * in the resulting in-application table.
 */
export const addApplicationReferenceDataSource: (
  input: AddApplicationReferenceDataSourceRequest,
) => effect.Effect<
  AddApplicationReferenceDataSourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationReferenceDataSourceRequest,
  output: AddApplicationReferenceDataSourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all the versions for the specified application, including versions that were rolled back. The response also includes a summary of the configuration
 * associated with each version.
 *
 * To get the complete description of a specific application version, invoke the DescribeApplicationVersion operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const listApplicationVersions: {
  (
    input: ListApplicationVersionsRequest,
  ): effect.Effect<
    ListApplicationVersionsResponse,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationVersionsRequest,
  ) => stream.Stream<
    ListApplicationVersionsResponse,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationVersionsRequest,
  ) => stream.Stream<
    ApplicationVersionSummary,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationVersionsRequest,
  output: ListApplicationVersionsResponse,
  errors: [
    InvalidArgumentException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationVersionSummaries",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides a detailed description of a specified version of the application. To see a list of all the versions of an application, invoke the ListApplicationVersions operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const describeApplicationVersion: (
  input: DescribeApplicationVersionRequest,
) => effect.Effect<
  DescribeApplicationVersionResponse,
  | InvalidArgumentException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationVersionRequest,
  output: DescribeApplicationVersionResponse,
  errors: [
    InvalidArgumentException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves the list of key-value tags assigned to the application. For more information, see
 * Using Tagging.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates and returns a URL that you can use to connect to
 * an application's extension.
 *
 * The IAM role or user used to call this API defines the permissions to access the
 * extension. After the presigned URL is created, no additional permission is required to access
 * this URL. IAM authorization policies for this API are also enforced for every HTTP request
 * that attempts to connect to the extension.
 *
 * You control the amount of time that the URL will be valid using the `SessionExpirationDurationInSeconds`
 * parameter. If you do not provide this parameter, the returned URL is valid for twelve hours.
 *
 * The URL that you get from a call to CreateApplicationPresignedUrl must be used within 3 minutes
 * to be valid.
 * If you first try to use the URL after the 3-minute limit expires, the service returns an HTTP 403 Forbidden error.
 */
export const createApplicationPresignedUrl: (
  input: CreateApplicationPresignedUrlRequest,
) => effect.Effect<
  CreateApplicationPresignedUrlResponse,
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationPresignedUrlRequest,
  output: CreateApplicationPresignedUrlResponse,
  errors: [
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes an Amazon CloudWatch log stream from an SQL-based Kinesis Data Analytics application.
 */
export const deleteApplicationCloudWatchLoggingOption: (
  input: DeleteApplicationCloudWatchLoggingOptionRequest,
) => effect.Effect<
  DeleteApplicationCloudWatchLoggingOptionResponse,
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationCloudWatchLoggingOptionRequest,
  output: DeleteApplicationCloudWatchLoggingOptionResponse,
  errors: [
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about a snapshot of application state data.
 */
export const describeApplicationSnapshot: (
  input: DescribeApplicationSnapshotRequest,
) => effect.Effect<
  DescribeApplicationSnapshotResponse,
  | InvalidArgumentException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationSnapshotRequest,
  output: DescribeApplicationSnapshotResponse,
  errors: [
    InvalidArgumentException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists all the operations performed for the specified application such as UpdateApplication, StartApplication etc.
 * The response also includes a summary of the operation.
 *
 * To get the complete description of a specific operation, invoke the DescribeApplicationOperation operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const listApplicationOperations: {
  (
    input: ListApplicationOperationsRequest,
  ): effect.Effect<
    ListApplicationOperationsResponse,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationOperationsRequest,
  ) => stream.Stream<
    ListApplicationOperationsResponse,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationOperationsRequest,
  ) => stream.Stream<
    ApplicationOperationInfo,
    | InvalidArgumentException
    | ResourceNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationOperationsRequest,
  output: ListApplicationOperationsResponse,
  errors: [
    InvalidArgumentException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApplicationOperationInfoList",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides a detailed description of a specified application operation. To see a list of all the operations of an application, invoke the ListApplicationOperations operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const describeApplicationOperation: (
  input: DescribeApplicationOperationRequest,
) => effect.Effect<
  DescribeApplicationOperationResponse,
  | InvalidArgumentException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationOperationRequest,
  output: DescribeApplicationOperationResponse,
  errors: [
    InvalidArgumentException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds one or more key-value tags to a Managed Service for Apache Flink application. Note that the maximum number of application
 * tags includes system tags. The maximum number of user-defined application tags is 50.
 * For more information, see Using Tagging.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a snapshot of the application's state data.
 */
export const createApplicationSnapshot: (
  input: CreateApplicationSnapshotRequest,
) => effect.Effect<
  CreateApplicationSnapshotResponse,
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationSnapshotRequest,
  output: CreateApplicationSnapshotResponse,
  errors: [
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes one or more tags from a Managed Service for Apache Flink application. For more information, see
 * Using Tagging.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Adds an InputProcessingConfiguration to a SQL-based Kinesis Data Analytics application. An input processor pre-processes records
 * on the input stream before the
 * application's SQL code executes. Currently, the only input processor available is Amazon Lambda.
 */
export const addApplicationInputProcessingConfiguration: (
  input: AddApplicationInputProcessingConfigurationRequest,
) => effect.Effect<
  AddApplicationInputProcessingConfigurationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationInputProcessingConfigurationRequest,
  output: AddApplicationInputProcessingConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a Managed Service for Apache Flink application. For information about creating a
 * Managed Service for Apache Flink application, see Creating an
 * Application.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | LimitExceededException
  | ResourceInUseException
  | TooManyTagsException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    LimitExceededException,
    ResourceInUseException,
    TooManyTagsException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about a specific Managed Service for Apache Flink application.
 *
 * If you want to retrieve a list of all applications in your account,
 * use the ListApplications operation.
 */
export const describeApplication: (
  input: DescribeApplicationRequest,
) => effect.Effect<
  DescribeApplicationResponse,
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationRequest,
  output: DescribeApplicationResponse,
  errors: [
    InvalidArgumentException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing Managed Service for Apache Flink application. Using this operation, you
 * can update application code, input configuration, and output configuration.
 *
 * Managed Service for Apache Flink updates the `ApplicationVersionId` each time you update
 * your application.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => effect.Effect<
  UpdateApplicationResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | InvalidRequestException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    InvalidRequestException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds a streaming source to your SQL-based Kinesis Data Analytics application.
 *
 * You can add a streaming source when you create an application, or you can use this
 * operation to add a streaming source after you create an application. For more information, see
 * CreateApplication.
 *
 * Any configuration update, including adding a streaming source using this operation,
 * results in a new version of the application. You can use the DescribeApplication operation
 * to find the current application version.
 */
export const addApplicationInput: (
  input: AddApplicationInputRequest,
) => effect.Effect<
  AddApplicationInputResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationInputRequest,
  output: AddApplicationInputResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidArgumentException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Infers a schema for a SQL-based Kinesis Data Analytics application by evaluating
 * sample records on the specified streaming source (Kinesis data stream or Kinesis Data Firehose
 * delivery stream) or Amazon S3 object. In the response, the operation returns the inferred
 * schema and also the sample records that the operation used to infer the schema.
 *
 * You can use the inferred schema when configuring a streaming source for your application.
 * When you create an application using the Kinesis Data Analytics console, the console uses this
 * operation to infer a schema and show it in the console user interface.
 */
export const discoverInputSchema: (
  input: DiscoverInputSchemaRequest,
) => effect.Effect<
  DiscoverInputSchemaResponse,
  | InvalidArgumentException
  | InvalidRequestException
  | ResourceProvisionedThroughputExceededException
  | ServiceUnavailableException
  | UnableToDetectSchemaException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverInputSchemaRequest,
  output: DiscoverInputSchemaResponse,
  errors: [
    InvalidArgumentException,
    InvalidRequestException,
    ResourceProvisionedThroughputExceededException,
    ServiceUnavailableException,
    UnableToDetectSchemaException,
    UnsupportedOperationException,
  ],
}));

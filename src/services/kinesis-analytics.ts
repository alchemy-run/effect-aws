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
const ns = T.XmlNamespace(
  "http://analytics.kinesis.amazonaws.com/doc/2015-08-14",
);
const svc = T.AwsApiService({
  sdkId: "Kinesis Analytics",
  serviceShapeName: "KinesisAnalytics_20150814",
});
const auth = T.AwsAuthSigv4({ name: "kinesisanalytics" });
const ver = T.ServiceVersion("2015-08-14");
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
export type Id = string;
export type ApplicationDescription = string;
export type ApplicationCode = string;
export type ResourceARN = string;
export type RoleARN = string;
export type ListApplicationsInputLimit = number;
export type KinesisAnalyticsARN = string;
export type TagKey = string;
export type LogStreamARN = string;
export type InAppStreamName = string;
export type InAppTableName = string;
export type TagValue = string;
export type BucketARN = string;
export type FileKey = string;
export type ErrorMessage = string;
export type InputParallelismCount = number;
export type RecordEncoding = string;
export type RecordColumnName = string;
export type RecordColumnMapping = string;
export type RecordColumnSqlType = string;
export type ParsedInputRecordField = string;
export type ProcessedInputRecord = string;
export type RawInputRecord = string;
export type RecordRowPath = string;
export type RecordRowDelimiter = string;
export type RecordColumnDelimiter = string;

//# Schemas
export interface InputLambdaProcessor {
  ResourceARN: string;
  RoleARN: string;
}
export const InputLambdaProcessor = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
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
  RoleARN: string;
}
export const KinesisStreamsInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
).annotations({
  identifier: "KinesisStreamsInput",
}) as any as S.Schema<KinesisStreamsInput>;
export interface KinesisFirehoseInput {
  ResourceARN: string;
  RoleARN: string;
}
export const KinesisFirehoseInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
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
  RecordFormatType: string;
  MappingParameters?: MappingParameters;
}
export const RecordFormat = S.suspend(() =>
  S.Struct({
    RecordFormatType: S.String,
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
  RecordColumns: RecordColumns;
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
  RoleARN: string;
}
export const KinesisStreamsOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
).annotations({
  identifier: "KinesisStreamsOutput",
}) as any as S.Schema<KinesisStreamsOutput>;
export interface KinesisFirehoseOutput {
  ResourceARN: string;
  RoleARN: string;
}
export const KinesisFirehoseOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
).annotations({
  identifier: "KinesisFirehoseOutput",
}) as any as S.Schema<KinesisFirehoseOutput>;
export interface LambdaOutput {
  ResourceARN: string;
  RoleARN: string;
}
export const LambdaOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, RoleARN: S.String }),
).annotations({ identifier: "LambdaOutput" }) as any as S.Schema<LambdaOutput>;
export interface DestinationSchema {
  RecordFormatType: string;
}
export const DestinationSchema = S.suspend(() =>
  S.Struct({ RecordFormatType: S.String }),
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
export interface CloudWatchLoggingOption {
  LogStreamARN: string;
  RoleARN: string;
}
export const CloudWatchLoggingOption = S.suspend(() =>
  S.Struct({ LogStreamARN: S.String, RoleARN: S.String }),
).annotations({
  identifier: "CloudWatchLoggingOption",
}) as any as S.Schema<CloudWatchLoggingOption>;
export type CloudWatchLoggingOptions = CloudWatchLoggingOption[];
export const CloudWatchLoggingOptions = S.Array(CloudWatchLoggingOption);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
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
  CurrentApplicationVersionId: number;
  CloudWatchLoggingOptionId: string;
}
export const DeleteApplicationCloudWatchLoggingOptionRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    CloudWatchLoggingOptionId: S.String,
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
export interface DeleteApplicationCloudWatchLoggingOptionResponse {}
export const DeleteApplicationCloudWatchLoggingOptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationCloudWatchLoggingOptionResponse",
}) as any as S.Schema<DeleteApplicationCloudWatchLoggingOptionResponse>;
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
export interface DeleteApplicationInputProcessingConfigurationResponse {}
export const DeleteApplicationInputProcessingConfigurationResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationInputProcessingConfigurationResponse",
}) as any as S.Schema<DeleteApplicationInputProcessingConfigurationResponse>;
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
export interface DeleteApplicationOutputResponse {}
export const DeleteApplicationOutputResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationOutputResponse",
}) as any as S.Schema<DeleteApplicationOutputResponse>;
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
export interface DeleteApplicationReferenceDataSourceResponse {}
export const DeleteApplicationReferenceDataSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationReferenceDataSourceResponse",
}) as any as S.Schema<DeleteApplicationReferenceDataSourceResponse>;
export interface DescribeApplicationRequest {
  ApplicationName: string;
}
export const DescribeApplicationRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String }).pipe(
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
export interface ListApplicationsRequest {
  Limit?: number;
  ExclusiveStartApplicationName?: string;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    Limit: S.optional(S.Number),
    ExclusiveStartApplicationName: S.optional(S.String),
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
export interface StopApplicationRequest {
  ApplicationName: string;
}
export const StopApplicationRequest = S.suspend(() =>
  S.Struct({ ApplicationName: S.String }).pipe(
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
export interface StopApplicationResponse {}
export const StopApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopApplicationResponse",
}) as any as S.Schema<StopApplicationResponse>;
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
  Tags: Tags;
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
  TagKeys: TagKeys;
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
export interface InputStartingPositionConfiguration {
  InputStartingPosition?: string;
}
export const InputStartingPositionConfiguration = S.suspend(() =>
  S.Struct({ InputStartingPosition: S.optional(S.String) }),
).annotations({
  identifier: "InputStartingPositionConfiguration",
}) as any as S.Schema<InputStartingPositionConfiguration>;
export interface S3Configuration {
  RoleARN: string;
  BucketARN: string;
  FileKey: string;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({ RoleARN: S.String, BucketARN: S.String, FileKey: S.String }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export interface InputConfiguration {
  Id: string;
  InputStartingPositionConfiguration: InputStartingPositionConfiguration;
}
export const InputConfiguration = S.suspend(() =>
  S.Struct({
    Id: S.String,
    InputStartingPositionConfiguration: InputStartingPositionConfiguration,
  }),
).annotations({
  identifier: "InputConfiguration",
}) as any as S.Schema<InputConfiguration>;
export type InputConfigurations = InputConfiguration[];
export const InputConfigurations = S.Array(InputConfiguration);
export interface AddApplicationCloudWatchLoggingOptionRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  CloudWatchLoggingOption: CloudWatchLoggingOption;
}
export const AddApplicationCloudWatchLoggingOptionRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    CloudWatchLoggingOption: CloudWatchLoggingOption,
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
export interface AddApplicationCloudWatchLoggingOptionResponse {}
export const AddApplicationCloudWatchLoggingOptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddApplicationCloudWatchLoggingOptionResponse",
}) as any as S.Schema<AddApplicationCloudWatchLoggingOptionResponse>;
export interface CreateApplicationRequest {
  ApplicationName: string;
  ApplicationDescription?: string;
  Inputs?: Inputs;
  Outputs?: Outputs;
  CloudWatchLoggingOptions?: CloudWatchLoggingOptions;
  ApplicationCode?: string;
  Tags?: Tags;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationDescription: S.optional(S.String),
    Inputs: S.optional(Inputs),
    Outputs: S.optional(Outputs),
    CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
    ApplicationCode: S.optional(S.String),
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
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DiscoverInputSchemaRequest {
  ResourceARN?: string;
  RoleARN?: string;
  InputStartingPositionConfiguration?: InputStartingPositionConfiguration;
  S3Configuration?: S3Configuration;
  InputProcessingConfiguration?: InputProcessingConfiguration;
}
export const DiscoverInputSchemaRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
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
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartApplicationRequest {
  ApplicationName: string;
  InputConfigurations: InputConfigurations;
}
export const StartApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    InputConfigurations: InputConfigurations,
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
export interface StartApplicationResponse {}
export const StartApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartApplicationResponse",
}) as any as S.Schema<StartApplicationResponse>;
export interface S3ReferenceDataSource {
  BucketARN: string;
  FileKey: string;
  ReferenceRoleARN: string;
}
export const S3ReferenceDataSource = S.suspend(() =>
  S.Struct({
    BucketARN: S.String,
    FileKey: S.String,
    ReferenceRoleARN: S.String,
  }),
).annotations({
  identifier: "S3ReferenceDataSource",
}) as any as S.Schema<S3ReferenceDataSource>;
export interface CloudWatchLoggingOptionUpdate {
  CloudWatchLoggingOptionId: string;
  LogStreamARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const CloudWatchLoggingOptionUpdate = S.suspend(() =>
  S.Struct({
    CloudWatchLoggingOptionId: S.String,
    LogStreamARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLoggingOptionUpdate",
}) as any as S.Schema<CloudWatchLoggingOptionUpdate>;
export type CloudWatchLoggingOptionUpdates = CloudWatchLoggingOptionUpdate[];
export const CloudWatchLoggingOptionUpdates = S.Array(
  CloudWatchLoggingOptionUpdate,
);
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
export type ParsedInputRecord = string[];
export const ParsedInputRecord = S.Array(S.String);
export type ParsedInputRecords = ParsedInputRecord[];
export const ParsedInputRecords = S.Array(ParsedInputRecord);
export type ProcessedInputRecords = string[];
export const ProcessedInputRecords = S.Array(S.String);
export type RawInputRecords = string[];
export const RawInputRecords = S.Array(S.String);
export interface ApplicationSummary {
  ApplicationName: string;
  ApplicationARN: string;
  ApplicationStatus: string;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationARN: S.String,
    ApplicationStatus: S.String,
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaries = ApplicationSummary[];
export const ApplicationSummaries = S.Array(ApplicationSummary);
export type InAppStreamNames = string[];
export const InAppStreamNames = S.Array(S.String);
export interface KinesisStreamsInputUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const KinesisStreamsInputUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisStreamsInputUpdate",
}) as any as S.Schema<KinesisStreamsInputUpdate>;
export interface KinesisFirehoseInputUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const KinesisFirehoseInputUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisFirehoseInputUpdate",
}) as any as S.Schema<KinesisFirehoseInputUpdate>;
export interface InputSchemaUpdate {
  RecordFormatUpdate?: RecordFormat;
  RecordEncodingUpdate?: string;
  RecordColumnUpdates?: RecordColumns;
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
  CountUpdate?: number;
}
export const InputParallelismUpdate = S.suspend(() =>
  S.Struct({ CountUpdate: S.optional(S.Number) }),
).annotations({
  identifier: "InputParallelismUpdate",
}) as any as S.Schema<InputParallelismUpdate>;
export interface KinesisStreamsOutputUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const KinesisStreamsOutputUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisStreamsOutputUpdate",
}) as any as S.Schema<KinesisStreamsOutputUpdate>;
export interface KinesisFirehoseOutputUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const KinesisFirehoseOutputUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisFirehoseOutputUpdate",
}) as any as S.Schema<KinesisFirehoseOutputUpdate>;
export interface LambdaOutputUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const LambdaOutputUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaOutputUpdate",
}) as any as S.Schema<LambdaOutputUpdate>;
export interface S3ReferenceDataSourceUpdate {
  BucketARNUpdate?: string;
  FileKeyUpdate?: string;
  ReferenceRoleARNUpdate?: string;
}
export const S3ReferenceDataSourceUpdate = S.suspend(() =>
  S.Struct({
    BucketARNUpdate: S.optional(S.String),
    FileKeyUpdate: S.optional(S.String),
    ReferenceRoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ReferenceDataSourceUpdate",
}) as any as S.Schema<S3ReferenceDataSourceUpdate>;
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
export interface AddApplicationInputProcessingConfigurationResponse {}
export const AddApplicationInputProcessingConfigurationResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddApplicationInputProcessingConfigurationResponse",
}) as any as S.Schema<AddApplicationInputProcessingConfigurationResponse>;
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
export interface AddApplicationOutputResponse {}
export const AddApplicationOutputResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddApplicationOutputResponse",
}) as any as S.Schema<AddApplicationOutputResponse>;
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
export interface AddApplicationReferenceDataSourceResponse {}
export const AddApplicationReferenceDataSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddApplicationReferenceDataSourceResponse",
}) as any as S.Schema<AddApplicationReferenceDataSourceResponse>;
export interface CreateApplicationResponse {
  ApplicationSummary: ApplicationSummary;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationSummary: ApplicationSummary }).pipe(ns),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface DiscoverInputSchemaResponse {
  InputSchema?: SourceSchema;
  ParsedInputRecords?: ParsedInputRecords;
  ProcessedInputRecords?: ProcessedInputRecords;
  RawInputRecords?: RawInputRecords;
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
export interface ListApplicationsResponse {
  ApplicationSummaries: ApplicationSummaries;
  HasMoreApplications: boolean;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSummaries: ApplicationSummaries,
    HasMoreApplications: S.Boolean,
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface CloudWatchLoggingOptionDescription {
  CloudWatchLoggingOptionId?: string;
  LogStreamARN: string;
  RoleARN: string;
}
export const CloudWatchLoggingOptionDescription = S.suspend(() =>
  S.Struct({
    CloudWatchLoggingOptionId: S.optional(S.String),
    LogStreamARN: S.String,
    RoleARN: S.String,
  }),
).annotations({
  identifier: "CloudWatchLoggingOptionDescription",
}) as any as S.Schema<CloudWatchLoggingOptionDescription>;
export type CloudWatchLoggingOptionDescriptions =
  CloudWatchLoggingOptionDescription[];
export const CloudWatchLoggingOptionDescriptions = S.Array(
  CloudWatchLoggingOptionDescription,
);
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
export interface InputLambdaProcessorUpdate {
  ResourceARNUpdate?: string;
  RoleARNUpdate?: string;
}
export const InputLambdaProcessorUpdate = S.suspend(() =>
  S.Struct({
    ResourceARNUpdate: S.optional(S.String),
    RoleARNUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "InputLambdaProcessorUpdate",
}) as any as S.Schema<InputLambdaProcessorUpdate>;
export interface KinesisStreamsInputDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const KinesisStreamsInputDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisStreamsInputDescription",
}) as any as S.Schema<KinesisStreamsInputDescription>;
export interface KinesisFirehoseInputDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const KinesisFirehoseInputDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisFirehoseInputDescription",
}) as any as S.Schema<KinesisFirehoseInputDescription>;
export interface KinesisStreamsOutputDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const KinesisStreamsOutputDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisStreamsOutputDescription",
}) as any as S.Schema<KinesisStreamsOutputDescription>;
export interface KinesisFirehoseOutputDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const KinesisFirehoseOutputDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "KinesisFirehoseOutputDescription",
}) as any as S.Schema<KinesisFirehoseOutputDescription>;
export interface LambdaOutputDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const LambdaOutputDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaOutputDescription",
}) as any as S.Schema<LambdaOutputDescription>;
export interface S3ReferenceDataSourceDescription {
  BucketARN: string;
  FileKey: string;
  ReferenceRoleARN: string;
}
export const S3ReferenceDataSourceDescription = S.suspend(() =>
  S.Struct({
    BucketARN: S.String,
    FileKey: S.String,
    ReferenceRoleARN: S.String,
  }),
).annotations({
  identifier: "S3ReferenceDataSourceDescription",
}) as any as S.Schema<S3ReferenceDataSourceDescription>;
export interface InputProcessingConfigurationUpdate {
  InputLambdaProcessorUpdate: InputLambdaProcessorUpdate;
}
export const InputProcessingConfigurationUpdate = S.suspend(() =>
  S.Struct({ InputLambdaProcessorUpdate: InputLambdaProcessorUpdate }),
).annotations({
  identifier: "InputProcessingConfigurationUpdate",
}) as any as S.Schema<InputProcessingConfigurationUpdate>;
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
export interface InputLambdaProcessorDescription {
  ResourceARN?: string;
  RoleARN?: string;
}
export const InputLambdaProcessorDescription = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "InputLambdaProcessorDescription",
}) as any as S.Schema<InputLambdaProcessorDescription>;
export interface ApplicationUpdate {
  InputUpdates?: InputUpdates;
  ApplicationCodeUpdate?: string;
  OutputUpdates?: OutputUpdates;
  ReferenceDataSourceUpdates?: ReferenceDataSourceUpdates;
  CloudWatchLoggingOptionUpdates?: CloudWatchLoggingOptionUpdates;
}
export const ApplicationUpdate = S.suspend(() =>
  S.Struct({
    InputUpdates: S.optional(InputUpdates),
    ApplicationCodeUpdate: S.optional(S.String),
    OutputUpdates: S.optional(OutputUpdates),
    ReferenceDataSourceUpdates: S.optional(ReferenceDataSourceUpdates),
    CloudWatchLoggingOptionUpdates: S.optional(CloudWatchLoggingOptionUpdates),
  }),
).annotations({
  identifier: "ApplicationUpdate",
}) as any as S.Schema<ApplicationUpdate>;
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
export interface UpdateApplicationRequest {
  ApplicationName: string;
  CurrentApplicationVersionId: number;
  ApplicationUpdate: ApplicationUpdate;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ApplicationUpdate: ApplicationUpdate,
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
export interface UpdateApplicationResponse {}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface InputDescription {
  InputId?: string;
  NamePrefix?: string;
  InAppStreamNames?: InAppStreamNames;
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
export interface ApplicationDetail {
  ApplicationName: string;
  ApplicationDescription?: string;
  ApplicationARN: string;
  ApplicationStatus: string;
  CreateTimestamp?: Date;
  LastUpdateTimestamp?: Date;
  InputDescriptions?: InputDescriptions;
  OutputDescriptions?: OutputDescriptions;
  ReferenceDataSourceDescriptions?: ReferenceDataSourceDescriptions;
  CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescriptions;
  ApplicationCode?: string;
  ApplicationVersionId: number;
}
export const ApplicationDetail = S.suspend(() =>
  S.Struct({
    ApplicationName: S.String,
    ApplicationDescription: S.optional(S.String),
    ApplicationARN: S.String,
    ApplicationStatus: S.String,
    CreateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InputDescriptions: S.optional(InputDescriptions),
    OutputDescriptions: S.optional(OutputDescriptions),
    ReferenceDataSourceDescriptions: S.optional(
      ReferenceDataSourceDescriptions,
    ),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    ApplicationCode: S.optional(S.String),
    ApplicationVersionId: S.Number,
  }),
).annotations({
  identifier: "ApplicationDetail",
}) as any as S.Schema<ApplicationDetail>;
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
export interface AddApplicationInputResponse {}
export const AddApplicationInputResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
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

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { message: S.optional(S.String) },
) {}
export class InvalidApplicationConfigurationException extends S.TaggedError<InvalidApplicationConfigurationException>()(
  "InvalidApplicationConfigurationException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class CodeValidationException extends S.TaggedError<CodeValidationException>()(
  "CodeValidationException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class ResourceProvisionedThroughputExceededException extends S.TaggedError<ResourceProvisionedThroughputExceededException>()(
  "ResourceProvisionedThroughputExceededException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UnableToDetectSchemaException extends S.TaggedError<UnableToDetectSchemaException>()(
  "UnableToDetectSchemaException",
  {
    message: S.optional(S.String),
    RawInputRecords: S.optional(RawInputRecords),
    ProcessedInputRecords: S.optional(ProcessedInputRecords),
  },
) {}

//# Operations
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Returns a list of Amazon Kinesis Analytics applications in your account.
 * For each application, the response includes the application name,
 * Amazon Resource Name (ARN), and status.
 *
 * If the response returns the `HasMoreApplications` value as true,
 * you can send another request by adding the
 * `ExclusiveStartApplicationName` in the request body, and
 * set the value of this to the last application name from
 * the previous response.
 *
 * If you want detailed information about a specific application, use
 * DescribeApplication.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:ListApplications` action.
 */
export const listApplications: (
  input: ListApplicationsRequest,
) => Effect.Effect<
  ListApplicationsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [],
}));
/**
 * Retrieves the list of key-value tags assigned to the application. For more information, see Using Tagging.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
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
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Stops the application from processing input data. You can stop
 * an application only if it is in the running state.
 * You can use the DescribeApplication operation to find the application state.
 * After the application is stopped,
 * Amazon Kinesis Analytics stops reading data from the input, the
 * application stops processing data, and there is no output written to the destination.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:StopApplication` action.
 */
export const stopApplication: (
  input: StopApplicationRequest,
) => Effect.Effect<
  StopApplicationResponse,
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationRequest,
  output: StopApplicationResponse,
  errors: [
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds one or more key-value tags to a Kinesis Analytics application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50.
 * For more information, see Using Tagging.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
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
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Deletes a CloudWatch log stream from an application. For more information about
 * using CloudWatch log streams with Amazon Kinesis Analytics applications, see
 * Working with Amazon CloudWatch Logs.
 */
export const deleteApplicationCloudWatchLoggingOption: (
  input: DeleteApplicationCloudWatchLoggingOptionRequest,
) => Effect.Effect<
  DeleteApplicationCloudWatchLoggingOptionResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationCloudWatchLoggingOptionRequest,
  output: DeleteApplicationCloudWatchLoggingOptionResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Deletes an InputProcessingConfiguration from an input.
 */
export const deleteApplicationInputProcessingConfiguration: (
  input: DeleteApplicationInputProcessingConfigurationRequest,
) => Effect.Effect<
  DeleteApplicationInputProcessingConfigurationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationInputProcessingConfigurationRequest,
  output: DeleteApplicationInputProcessingConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Deletes output destination configuration from your application configuration. Amazon Kinesis Analytics will no longer write data from the corresponding in-application stream to the external output destination.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:DeleteApplicationOutput` action.
 */
export const deleteApplicationOutput: (
  input: DeleteApplicationOutputRequest,
) => Effect.Effect<
  DeleteApplicationOutputResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationOutputRequest,
  output: DeleteApplicationOutputResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Deletes a reference data source configuration from the specified application configuration.
 *
 * If the application is running, Amazon Kinesis Analytics immediately removes the in-application table
 * that you created using the AddApplicationReferenceDataSource operation.
 *
 * This operation requires permissions to perform the `kinesisanalytics.DeleteApplicationReferenceDataSource`
 * action.
 */
export const deleteApplicationReferenceDataSource: (
  input: DeleteApplicationReferenceDataSourceRequest,
) => Effect.Effect<
  DeleteApplicationReferenceDataSourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationReferenceDataSourceRequest,
  output: DeleteApplicationReferenceDataSourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds a CloudWatch log stream to monitor application configuration errors. For more
 * information about using CloudWatch log streams with Amazon Kinesis Analytics
 * applications, see Working with Amazon
 * CloudWatch Logs.
 */
export const addApplicationCloudWatchLoggingOption: (
  input: AddApplicationCloudWatchLoggingOptionRequest,
) => Effect.Effect<
  AddApplicationCloudWatchLoggingOptionResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationCloudWatchLoggingOptionRequest,
  output: AddApplicationCloudWatchLoggingOptionResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds an InputProcessingConfiguration to an application. An input processor preprocesses records on the input stream
 * before the application's SQL code executes. Currently, the only input processor available is
 * AWS Lambda.
 */
export const addApplicationInputProcessingConfiguration: (
  input: AddApplicationInputProcessingConfigurationRequest,
) => Effect.Effect<
  AddApplicationInputProcessingConfigurationResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationInputProcessingConfigurationRequest,
  output: AddApplicationInputProcessingConfigurationResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds an external destination to your Amazon Kinesis Analytics application.
 *
 * If you want Amazon Kinesis Analytics to deliver data from an in-application stream
 * within your application to an external destination (such as an Amazon Kinesis stream, an
 * Amazon Kinesis Firehose delivery stream, or an AWS Lambda function), you add the
 * relevant configuration to your application using this operation. You can configure one
 * or more outputs for your application. Each output configuration maps an in-application
 * stream and an external destination.
 *
 * You can use one of the output configurations to deliver data from your
 * in-application error stream to an external destination so that you can analyze the
 * errors. For more information, see Understanding Application
 * Output (Destination).
 *
 * Any configuration update, including adding a streaming source using this
 * operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application
 * version.
 *
 * For the limits on the number of application inputs and outputs
 * you can configure, see Limits.
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 */
export const addApplicationOutput: (
  input: AddApplicationOutputRequest,
) => Effect.Effect<
  AddApplicationOutputResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationOutputRequest,
  output: AddApplicationOutputResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds a reference data source to an existing application.
 *
 * Amazon Kinesis Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in Amazon S3 object maps to columns in the resulting in-application table.
 *
 * For conceptual information,
 * see Configuring Application Input.
 * For the limits on data sources you can add to your application, see
 * Limits.
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 */
export const addApplicationReferenceDataSource: (
  input: AddApplicationReferenceDataSourceRequest,
) => Effect.Effect<
  AddApplicationReferenceDataSourceResponse,
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationReferenceDataSourceRequest,
  output: AddApplicationReferenceDataSourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Deletes the specified application. Amazon Kinesis Analytics halts application execution and deletes the application, including any application artifacts (such as in-application streams, reference table, and application code).
 *
 * This operation requires permissions to perform the `kinesisanalytics:DeleteApplication` action.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | ConcurrentModificationException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    ConcurrentModificationException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Starts the specified Amazon Kinesis Analytics application. After creating an application, you must exclusively call this operation to start your application.
 *
 * After the application starts, it begins consuming the input data, processes it, and writes the output to the configured destination.
 *
 * The application status must be `READY` for you to start an application. You can
 * get the application status in the console or using the DescribeApplication operation.
 *
 * After you start the application, you can stop the application from processing
 * the input by calling the StopApplication operation.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:StartApplication` action.
 */
export const startApplication: (
  input: StartApplicationRequest,
) => Effect.Effect<
  StartApplicationResponse,
  | InvalidApplicationConfigurationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationRequest,
  output: StartApplicationResponse,
  errors: [
    InvalidApplicationConfigurationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes one or more tags from a Kinesis Analytics application. For more information, see Using Tagging.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
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
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Creates an Amazon Kinesis Analytics application.
 * You can configure each application with one streaming source as input,
 * application code to process the input, and up to
 * three destinations where
 * you want Amazon Kinesis Analytics to write the output data from your application.
 * For an overview, see
 * How it Works.
 *
 * In the input configuration, you map the streaming source to an in-application stream, which you can think of as a constantly updating table. In the mapping, you must provide a schema for the in-application stream and map each data column in the in-application stream to a
 * data element in the streaming source.
 *
 * Your application code is one or more SQL statements that read input data, transform it, and generate output. Your application code can create one or more SQL artifacts like SQL streams or pumps.
 *
 * In the output configuration, you can configure the application to write data from in-application streams created in your applications to up to three destinations.
 *
 * To read data from your source stream or write data to destination streams, Amazon Kinesis Analytics
 * needs your permissions. You grant these permissions by creating IAM roles. This operation requires permissions to perform the
 * `kinesisanalytics:CreateApplication` action.
 *
 * For introductory exercises to create an Amazon Kinesis Analytics application, see
 * Getting Started.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidArgumentException
  | LimitExceededException
  | ResourceInUseException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    TooManyTagsException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Updates an existing Amazon Kinesis Analytics application. Using this API,
 * you can update application code, input configuration, and
 * output configuration.
 *
 * Note that Amazon Kinesis Analytics updates the `CurrentApplicationVersionId`
 * each time you update your application.
 *
 * This operation requires permission for the
 * `kinesisanalytics:UpdateApplication` action.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds a streaming source to your Amazon Kinesis application.
 * For conceptual information,
 * see Configuring Application Input.
 *
 * You can add a streaming source either when you create an application or you can use
 * this operation to add a streaming source after you create an application. For more information, see
 * CreateApplication.
 *
 * Any configuration update, including adding a streaming source using this operation,
 * results in a new version of the application. You can use the DescribeApplication operation
 * to find the current application version.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:AddApplicationInput` action.
 */
export const addApplicationInput: (
  input: AddApplicationInputRequest,
) => Effect.Effect<
  AddApplicationInputResponse,
  | CodeValidationException
  | ConcurrentModificationException
  | InvalidArgumentException
  | ResourceInUseException
  | ResourceNotFoundException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddApplicationInputRequest,
  output: AddApplicationInputResponse,
  errors: [
    CodeValidationException,
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Returns information about a specific Amazon Kinesis Analytics application.
 *
 * If you want to retrieve a list of all applications in your account,
 * use the ListApplications operation.
 *
 * This operation requires permissions to perform the `kinesisanalytics:DescribeApplication`
 * action. You can use `DescribeApplication` to get the current application versionId, which you need to call other
 * operations such as `Update`.
 */
export const describeApplication: (
  input: DescribeApplicationRequest,
) => Effect.Effect<
  DescribeApplicationResponse,
  ResourceNotFoundException | UnsupportedOperationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationRequest,
  output: DescribeApplicationResponse,
  errors: [ResourceNotFoundException, UnsupportedOperationException],
}));
/**
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Infers a schema by evaluating sample records on the specified streaming source (Amazon Kinesis stream or Amazon Kinesis Firehose delivery stream) or S3 object. In the response, the operation returns the inferred schema and also the sample records that the operation used to infer the schema.
 *
 * You can use the inferred schema when configuring a streaming source
 * for your application. For conceptual information,
 * see Configuring Application Input.
 * Note that when you create an application using the Amazon Kinesis Analytics console,
 * the console uses this operation to infer a schema and show it in the console user interface.
 *
 * This operation requires permissions to perform the
 * `kinesisanalytics:DiscoverInputSchema` action.
 */
export const discoverInputSchema: (
  input: DiscoverInputSchemaRequest,
) => Effect.Effect<
  DiscoverInputSchemaResponse,
  | InvalidArgumentException
  | ResourceProvisionedThroughputExceededException
  | ServiceUnavailableException
  | UnableToDetectSchemaException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverInputSchemaRequest,
  output: DiscoverInputSchemaResponse,
  errors: [
    InvalidArgumentException,
    ResourceProvisionedThroughputExceededException,
    ServiceUnavailableException,
    UnableToDetectSchemaException,
  ],
}));

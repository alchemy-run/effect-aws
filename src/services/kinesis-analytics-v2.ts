import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://kinesisanalytics-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://kinesisanalytics-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://kinesisanalytics.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://kinesisanalytics.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export class CloudWatchLoggingOption extends S.Class<CloudWatchLoggingOption>(
  "CloudWatchLoggingOption",
)({ LogStreamARN: S.String }) {}
export const CloudWatchLoggingOptions = S.Array(CloudWatchLoggingOption);
export const TagKeys = S.Array(S.String);
export class CreateApplicationPresignedUrlRequest extends S.Class<CreateApplicationPresignedUrlRequest>(
  "CreateApplicationPresignedUrlRequest",
)(
  {
    ApplicationName: S.String,
    UrlType: S.String,
    SessionExpirationDurationInSeconds: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationSnapshotRequest extends S.Class<CreateApplicationSnapshotRequest>(
  "CreateApplicationSnapshotRequest",
)(
  { ApplicationName: S.String, SnapshotName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationSnapshotResponse extends S.Class<CreateApplicationSnapshotResponse>(
  "CreateApplicationSnapshotResponse",
)({}, ns) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  {
    ApplicationName: S.String,
    CreateTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}, ns) {}
export class DeleteApplicationCloudWatchLoggingOptionRequest extends S.Class<DeleteApplicationCloudWatchLoggingOptionRequest>(
  "DeleteApplicationCloudWatchLoggingOptionRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionId: S.String,
    ConditionalToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationInputProcessingConfigurationRequest extends S.Class<DeleteApplicationInputProcessingConfigurationRequest>(
  "DeleteApplicationInputProcessingConfigurationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    InputId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationOutputRequest extends S.Class<DeleteApplicationOutputRequest>(
  "DeleteApplicationOutputRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    OutputId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationReferenceDataSourceRequest extends S.Class<DeleteApplicationReferenceDataSourceRequest>(
  "DeleteApplicationReferenceDataSourceRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ReferenceId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationSnapshotRequest extends S.Class<DeleteApplicationSnapshotRequest>(
  "DeleteApplicationSnapshotRequest",
)(
  {
    ApplicationName: S.String,
    SnapshotName: S.String,
    SnapshotCreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationSnapshotResponse extends S.Class<DeleteApplicationSnapshotResponse>(
  "DeleteApplicationSnapshotResponse",
)({}, ns) {}
export class DeleteApplicationVpcConfigurationRequest extends S.Class<DeleteApplicationVpcConfigurationRequest>(
  "DeleteApplicationVpcConfigurationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    VpcConfigurationId: S.String,
    ConditionalToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationRequest extends S.Class<DescribeApplicationRequest>(
  "DescribeApplicationRequest",
)(
  {
    ApplicationName: S.String,
    IncludeAdditionalDetails: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationOperationRequest extends S.Class<DescribeApplicationOperationRequest>(
  "DescribeApplicationOperationRequest",
)(
  { ApplicationName: S.String, OperationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationSnapshotRequest extends S.Class<DescribeApplicationSnapshotRequest>(
  "DescribeApplicationSnapshotRequest",
)(
  { ApplicationName: S.String, SnapshotName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationVersionRequest extends S.Class<DescribeApplicationVersionRequest>(
  "DescribeApplicationVersionRequest",
)(
  { ApplicationName: S.String, ApplicationVersionId: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationOperationsRequest extends S.Class<ListApplicationOperationsRequest>(
  "ListApplicationOperationsRequest",
)(
  {
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Operation: S.optional(S.String),
    OperationStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  { Limit: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationSnapshotsRequest extends S.Class<ListApplicationSnapshotsRequest>(
  "ListApplicationSnapshotsRequest",
)(
  {
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationVersionsRequest extends S.Class<ListApplicationVersionsRequest>(
  "ListApplicationVersionsRequest",
)(
  {
    ApplicationName: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RollbackApplicationRequest extends S.Class<RollbackApplicationRequest>(
  "RollbackApplicationRequest",
)(
  { ApplicationName: S.String, CurrentApplicationVersionId: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopApplicationRequest extends S.Class<StopApplicationRequest>(
  "StopApplicationRequest",
)(
  { ApplicationName: S.String, Force: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const Tags = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({ SubnetIds: SubnetIds, SecurityGroupIds: SecurityGroupIds }) {}
export const VpcConfigurations = S.Array(VpcConfiguration);
export class InputStartingPositionConfiguration extends S.Class<InputStartingPositionConfiguration>(
  "InputStartingPositionConfiguration",
)({ InputStartingPosition: S.optional(S.String) }) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ BucketARN: S.String, FileKey: S.String }) {}
export class ApplicationEncryptionConfigurationDescription extends S.Class<ApplicationEncryptionConfigurationDescription>(
  "ApplicationEncryptionConfigurationDescription",
)({ KeyId: S.optional(S.String), KeyType: S.String }) {}
export class SnapshotDetails extends S.Class<SnapshotDetails>(
  "SnapshotDetails",
)({
  SnapshotName: S.String,
  SnapshotStatus: S.String,
  ApplicationVersionId: S.Number,
  SnapshotCreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RuntimeEnvironment: S.optional(S.String),
  ApplicationEncryptionConfigurationDescription: S.optional(
    ApplicationEncryptionConfigurationDescription,
  ),
}) {}
export const SnapshotSummaries = S.Array(SnapshotDetails);
export class FlinkRunConfiguration extends S.Class<FlinkRunConfiguration>(
  "FlinkRunConfiguration",
)({ AllowNonRestoredState: S.optional(S.Boolean) }) {}
export class ApplicationRestoreConfiguration extends S.Class<ApplicationRestoreConfiguration>(
  "ApplicationRestoreConfiguration",
)({ ApplicationRestoreType: S.String, SnapshotName: S.optional(S.String) }) {}
export class RunConfigurationUpdate extends S.Class<RunConfigurationUpdate>(
  "RunConfigurationUpdate",
)({
  FlinkRunConfiguration: S.optional(FlinkRunConfiguration),
  ApplicationRestoreConfiguration: S.optional(ApplicationRestoreConfiguration),
}) {}
export class CloudWatchLoggingOptionUpdate extends S.Class<CloudWatchLoggingOptionUpdate>(
  "CloudWatchLoggingOptionUpdate",
)({
  CloudWatchLoggingOptionId: S.String,
  LogStreamARNUpdate: S.optional(S.String),
}) {}
export const CloudWatchLoggingOptionUpdates = S.Array(
  CloudWatchLoggingOptionUpdate,
);
export class ApplicationMaintenanceConfigurationUpdate extends S.Class<ApplicationMaintenanceConfigurationUpdate>(
  "ApplicationMaintenanceConfigurationUpdate",
)({ ApplicationMaintenanceWindowStartTimeUpdate: S.String }) {}
export class InputLambdaProcessor extends S.Class<InputLambdaProcessor>(
  "InputLambdaProcessor",
)({ ResourceARN: S.String }) {}
export class InputProcessingConfiguration extends S.Class<InputProcessingConfiguration>(
  "InputProcessingConfiguration",
)({ InputLambdaProcessor: InputLambdaProcessor }) {}
export class KinesisStreamsInput extends S.Class<KinesisStreamsInput>(
  "KinesisStreamsInput",
)({ ResourceARN: S.String }) {}
export class KinesisFirehoseInput extends S.Class<KinesisFirehoseInput>(
  "KinesisFirehoseInput",
)({ ResourceARN: S.String }) {}
export class InputParallelism extends S.Class<InputParallelism>(
  "InputParallelism",
)({ Count: S.optional(S.Number) }) {}
export class JSONMappingParameters extends S.Class<JSONMappingParameters>(
  "JSONMappingParameters",
)({ RecordRowPath: S.String }) {}
export class CSVMappingParameters extends S.Class<CSVMappingParameters>(
  "CSVMappingParameters",
)({ RecordRowDelimiter: S.String, RecordColumnDelimiter: S.String }) {}
export class MappingParameters extends S.Class<MappingParameters>(
  "MappingParameters",
)({
  JSONMappingParameters: S.optional(JSONMappingParameters),
  CSVMappingParameters: S.optional(CSVMappingParameters),
}) {}
export class RecordFormat extends S.Class<RecordFormat>("RecordFormat")({
  RecordFormatType: S.String,
  MappingParameters: S.optional(MappingParameters),
}) {}
export class RecordColumn extends S.Class<RecordColumn>("RecordColumn")({
  Name: S.String,
  Mapping: S.optional(S.String),
  SqlType: S.String,
}) {}
export const RecordColumns = S.Array(RecordColumn);
export class SourceSchema extends S.Class<SourceSchema>("SourceSchema")({
  RecordFormat: RecordFormat,
  RecordEncoding: S.optional(S.String),
  RecordColumns: RecordColumns,
}) {}
export class Input extends S.Class<Input>("Input")({
  NamePrefix: S.String,
  InputProcessingConfiguration: S.optional(InputProcessingConfiguration),
  KinesisStreamsInput: S.optional(KinesisStreamsInput),
  KinesisFirehoseInput: S.optional(KinesisFirehoseInput),
  InputParallelism: S.optional(InputParallelism),
  InputSchema: SourceSchema,
}) {}
export const Inputs = S.Array(Input);
export class KinesisStreamsOutput extends S.Class<KinesisStreamsOutput>(
  "KinesisStreamsOutput",
)({ ResourceARN: S.String }) {}
export class KinesisFirehoseOutput extends S.Class<KinesisFirehoseOutput>(
  "KinesisFirehoseOutput",
)({ ResourceARN: S.String }) {}
export class LambdaOutput extends S.Class<LambdaOutput>("LambdaOutput")({
  ResourceARN: S.String,
}) {}
export class DestinationSchema extends S.Class<DestinationSchema>(
  "DestinationSchema",
)({ RecordFormatType: S.String }) {}
export class Output extends S.Class<Output>("Output")({
  Name: S.String,
  KinesisStreamsOutput: S.optional(KinesisStreamsOutput),
  KinesisFirehoseOutput: S.optional(KinesisFirehoseOutput),
  LambdaOutput: S.optional(LambdaOutput),
  DestinationSchema: DestinationSchema,
}) {}
export const Outputs = S.Array(Output);
export class S3ReferenceDataSource extends S.Class<S3ReferenceDataSource>(
  "S3ReferenceDataSource",
)({ BucketARN: S.optional(S.String), FileKey: S.optional(S.String) }) {}
export class ReferenceDataSource extends S.Class<ReferenceDataSource>(
  "ReferenceDataSource",
)({
  TableName: S.String,
  S3ReferenceDataSource: S.optional(S3ReferenceDataSource),
  ReferenceSchema: SourceSchema,
}) {}
export const ReferenceDataSources = S.Array(ReferenceDataSource);
export class AddApplicationCloudWatchLoggingOptionRequest extends S.Class<AddApplicationCloudWatchLoggingOptionRequest>(
  "AddApplicationCloudWatchLoggingOptionRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOption: CloudWatchLoggingOption,
    ConditionalToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationVpcConfigurationRequest extends S.Class<AddApplicationVpcConfigurationRequest>(
  "AddApplicationVpcConfigurationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    VpcConfiguration: VpcConfiguration,
    ConditionalToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationPresignedUrlResponse extends S.Class<CreateApplicationPresignedUrlResponse>(
  "CreateApplicationPresignedUrlResponse",
)({ AuthorizedUrl: S.optional(S.String) }, ns) {}
export class DeleteApplicationInputProcessingConfigurationResponse extends S.Class<DeleteApplicationInputProcessingConfigurationResponse>(
  "DeleteApplicationInputProcessingConfigurationResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
  },
  ns,
) {}
export class DeleteApplicationOutputResponse extends S.Class<DeleteApplicationOutputResponse>(
  "DeleteApplicationOutputResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
  },
  ns,
) {}
export class DeleteApplicationReferenceDataSourceResponse extends S.Class<DeleteApplicationReferenceDataSourceResponse>(
  "DeleteApplicationReferenceDataSourceResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
  },
  ns,
) {}
export class DeleteApplicationVpcConfigurationResponse extends S.Class<DeleteApplicationVpcConfigurationResponse>(
  "DeleteApplicationVpcConfigurationResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    OperationId: S.optional(S.String),
  },
  ns,
) {}
export const InAppStreamNames = S.Array(S.String);
export class InputLambdaProcessorDescription extends S.Class<InputLambdaProcessorDescription>(
  "InputLambdaProcessorDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class InputProcessingConfigurationDescription extends S.Class<InputProcessingConfigurationDescription>(
  "InputProcessingConfigurationDescription",
)({
  InputLambdaProcessorDescription: S.optional(InputLambdaProcessorDescription),
}) {}
export class KinesisStreamsInputDescription extends S.Class<KinesisStreamsInputDescription>(
  "KinesisStreamsInputDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class KinesisFirehoseInputDescription extends S.Class<KinesisFirehoseInputDescription>(
  "KinesisFirehoseInputDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class InputDescription extends S.Class<InputDescription>(
  "InputDescription",
)({
  InputId: S.optional(S.String),
  NamePrefix: S.optional(S.String),
  InAppStreamNames: S.optional(InAppStreamNames),
  InputProcessingConfigurationDescription: S.optional(
    InputProcessingConfigurationDescription,
  ),
  KinesisStreamsInputDescription: S.optional(KinesisStreamsInputDescription),
  KinesisFirehoseInputDescription: S.optional(KinesisFirehoseInputDescription),
  InputSchema: S.optional(SourceSchema),
  InputParallelism: S.optional(InputParallelism),
  InputStartingPositionConfiguration: S.optional(
    InputStartingPositionConfiguration,
  ),
}) {}
export const InputDescriptions = S.Array(InputDescription);
export class KinesisStreamsOutputDescription extends S.Class<KinesisStreamsOutputDescription>(
  "KinesisStreamsOutputDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class KinesisFirehoseOutputDescription extends S.Class<KinesisFirehoseOutputDescription>(
  "KinesisFirehoseOutputDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class LambdaOutputDescription extends S.Class<LambdaOutputDescription>(
  "LambdaOutputDescription",
)({ ResourceARN: S.String, RoleARN: S.optional(S.String) }) {}
export class OutputDescription extends S.Class<OutputDescription>(
  "OutputDescription",
)({
  OutputId: S.optional(S.String),
  Name: S.optional(S.String),
  KinesisStreamsOutputDescription: S.optional(KinesisStreamsOutputDescription),
  KinesisFirehoseOutputDescription: S.optional(
    KinesisFirehoseOutputDescription,
  ),
  LambdaOutputDescription: S.optional(LambdaOutputDescription),
  DestinationSchema: S.optional(DestinationSchema),
}) {}
export const OutputDescriptions = S.Array(OutputDescription);
export class S3ReferenceDataSourceDescription extends S.Class<S3ReferenceDataSourceDescription>(
  "S3ReferenceDataSourceDescription",
)({
  BucketARN: S.String,
  FileKey: S.String,
  ReferenceRoleARN: S.optional(S.String),
}) {}
export class ReferenceDataSourceDescription extends S.Class<ReferenceDataSourceDescription>(
  "ReferenceDataSourceDescription",
)({
  ReferenceId: S.String,
  TableName: S.String,
  S3ReferenceDataSourceDescription: S3ReferenceDataSourceDescription,
  ReferenceSchema: S.optional(SourceSchema),
}) {}
export const ReferenceDataSourceDescriptions = S.Array(
  ReferenceDataSourceDescription,
);
export class SqlApplicationConfigurationDescription extends S.Class<SqlApplicationConfigurationDescription>(
  "SqlApplicationConfigurationDescription",
)({
  InputDescriptions: S.optional(InputDescriptions),
  OutputDescriptions: S.optional(OutputDescriptions),
  ReferenceDataSourceDescriptions: S.optional(ReferenceDataSourceDescriptions),
}) {}
export class S3ApplicationCodeLocationDescription extends S.Class<S3ApplicationCodeLocationDescription>(
  "S3ApplicationCodeLocationDescription",
)({
  BucketARN: S.String,
  FileKey: S.String,
  ObjectVersion: S.optional(S.String),
}) {}
export class CodeContentDescription extends S.Class<CodeContentDescription>(
  "CodeContentDescription",
)({
  TextContent: S.optional(S.String),
  CodeMD5: S.optional(S.String),
  CodeSize: S.optional(S.Number),
  S3ApplicationCodeLocationDescription: S.optional(
    S3ApplicationCodeLocationDescription,
  ),
}) {}
export class ApplicationCodeConfigurationDescription extends S.Class<ApplicationCodeConfigurationDescription>(
  "ApplicationCodeConfigurationDescription",
)({
  CodeContentType: S.String,
  CodeContentDescription: S.optional(CodeContentDescription),
}) {}
export class RunConfigurationDescription extends S.Class<RunConfigurationDescription>(
  "RunConfigurationDescription",
)({
  ApplicationRestoreConfigurationDescription: S.optional(
    ApplicationRestoreConfiguration,
  ),
  FlinkRunConfigurationDescription: S.optional(FlinkRunConfiguration),
}) {}
export class CheckpointConfigurationDescription extends S.Class<CheckpointConfigurationDescription>(
  "CheckpointConfigurationDescription",
)({
  ConfigurationType: S.optional(S.String),
  CheckpointingEnabled: S.optional(S.Boolean),
  CheckpointInterval: S.optional(S.Number),
  MinPauseBetweenCheckpoints: S.optional(S.Number),
}) {}
export class MonitoringConfigurationDescription extends S.Class<MonitoringConfigurationDescription>(
  "MonitoringConfigurationDescription",
)({
  ConfigurationType: S.optional(S.String),
  MetricsLevel: S.optional(S.String),
  LogLevel: S.optional(S.String),
}) {}
export class ParallelismConfigurationDescription extends S.Class<ParallelismConfigurationDescription>(
  "ParallelismConfigurationDescription",
)({
  ConfigurationType: S.optional(S.String),
  Parallelism: S.optional(S.Number),
  ParallelismPerKPU: S.optional(S.Number),
  CurrentParallelism: S.optional(S.Number),
  AutoScalingEnabled: S.optional(S.Boolean),
}) {}
export class FlinkApplicationConfigurationDescription extends S.Class<FlinkApplicationConfigurationDescription>(
  "FlinkApplicationConfigurationDescription",
)({
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
}) {}
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export class PropertyGroup extends S.Class<PropertyGroup>("PropertyGroup")({
  PropertyGroupId: S.String,
  PropertyMap: PropertyMap,
}) {}
export const PropertyGroups = S.Array(PropertyGroup);
export class EnvironmentPropertyDescriptions extends S.Class<EnvironmentPropertyDescriptions>(
  "EnvironmentPropertyDescriptions",
)({ PropertyGroupDescriptions: S.optional(PropertyGroups) }) {}
export class ApplicationSnapshotConfigurationDescription extends S.Class<ApplicationSnapshotConfigurationDescription>(
  "ApplicationSnapshotConfigurationDescription",
)({ SnapshotsEnabled: S.Boolean }) {}
export class ApplicationSystemRollbackConfigurationDescription extends S.Class<ApplicationSystemRollbackConfigurationDescription>(
  "ApplicationSystemRollbackConfigurationDescription",
)({ RollbackEnabled: S.Boolean }) {}
export class VpcConfigurationDescription extends S.Class<VpcConfigurationDescription>(
  "VpcConfigurationDescription",
)({
  VpcConfigurationId: S.String,
  VpcId: S.String,
  SubnetIds: SubnetIds,
  SecurityGroupIds: SecurityGroupIds,
}) {}
export const VpcConfigurationDescriptions = S.Array(
  VpcConfigurationDescription,
);
export class ZeppelinMonitoringConfigurationDescription extends S.Class<ZeppelinMonitoringConfigurationDescription>(
  "ZeppelinMonitoringConfigurationDescription",
)({ LogLevel: S.optional(S.String) }) {}
export class GlueDataCatalogConfigurationDescription extends S.Class<GlueDataCatalogConfigurationDescription>(
  "GlueDataCatalogConfigurationDescription",
)({ DatabaseARN: S.String }) {}
export class CatalogConfigurationDescription extends S.Class<CatalogConfigurationDescription>(
  "CatalogConfigurationDescription",
)({
  GlueDataCatalogConfigurationDescription:
    GlueDataCatalogConfigurationDescription,
}) {}
export class S3ContentBaseLocationDescription extends S.Class<S3ContentBaseLocationDescription>(
  "S3ContentBaseLocationDescription",
)({ BucketARN: S.String, BasePath: S.optional(S.String) }) {}
export class DeployAsApplicationConfigurationDescription extends S.Class<DeployAsApplicationConfigurationDescription>(
  "DeployAsApplicationConfigurationDescription",
)({ S3ContentLocationDescription: S3ContentBaseLocationDescription }) {}
export class S3ContentLocation extends S.Class<S3ContentLocation>(
  "S3ContentLocation",
)({
  BucketARN: S.String,
  FileKey: S.String,
  ObjectVersion: S.optional(S.String),
}) {}
export class MavenReference extends S.Class<MavenReference>("MavenReference")({
  GroupId: S.String,
  ArtifactId: S.String,
  Version: S.String,
}) {}
export class CustomArtifactConfigurationDescription extends S.Class<CustomArtifactConfigurationDescription>(
  "CustomArtifactConfigurationDescription",
)({
  ArtifactType: S.optional(S.String),
  S3ContentLocationDescription: S.optional(S3ContentLocation),
  MavenReferenceDescription: S.optional(MavenReference),
}) {}
export const CustomArtifactsConfigurationDescriptionList = S.Array(
  CustomArtifactConfigurationDescription,
);
export class ZeppelinApplicationConfigurationDescription extends S.Class<ZeppelinApplicationConfigurationDescription>(
  "ZeppelinApplicationConfigurationDescription",
)({
  MonitoringConfigurationDescription:
    ZeppelinMonitoringConfigurationDescription,
  CatalogConfigurationDescription: S.optional(CatalogConfigurationDescription),
  DeployAsApplicationConfigurationDescription: S.optional(
    DeployAsApplicationConfigurationDescription,
  ),
  CustomArtifactsConfigurationDescription: S.optional(
    CustomArtifactsConfigurationDescriptionList,
  ),
}) {}
export class ApplicationConfigurationDescription extends S.Class<ApplicationConfigurationDescription>(
  "ApplicationConfigurationDescription",
)({
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
  EnvironmentPropertyDescriptions: S.optional(EnvironmentPropertyDescriptions),
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
}) {}
export class CloudWatchLoggingOptionDescription extends S.Class<CloudWatchLoggingOptionDescription>(
  "CloudWatchLoggingOptionDescription",
)({
  CloudWatchLoggingOptionId: S.optional(S.String),
  LogStreamARN: S.String,
  RoleARN: S.optional(S.String),
}) {}
export const CloudWatchLoggingOptionDescriptions = S.Array(
  CloudWatchLoggingOptionDescription,
);
export class ApplicationMaintenanceConfigurationDescription extends S.Class<ApplicationMaintenanceConfigurationDescription>(
  "ApplicationMaintenanceConfigurationDescription",
)({
  ApplicationMaintenanceWindowStartTime: S.String,
  ApplicationMaintenanceWindowEndTime: S.String,
}) {}
export class ApplicationDetail extends S.Class<ApplicationDetail>(
  "ApplicationDetail",
)({
  ApplicationARN: S.String,
  ApplicationDescription: S.optional(S.String),
  ApplicationName: S.String,
  RuntimeEnvironment: S.String,
  ServiceExecutionRole: S.optional(S.String),
  ApplicationStatus: S.String,
  ApplicationVersionId: S.Number,
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
  ApplicationMode: S.optional(S.String),
}) {}
export class DescribeApplicationVersionResponse extends S.Class<DescribeApplicationVersionResponse>(
  "DescribeApplicationVersionResponse",
)({ ApplicationVersionDetail: S.optional(ApplicationDetail) }, ns) {}
export class DiscoverInputSchemaRequest extends S.Class<DiscoverInputSchemaRequest>(
  "DiscoverInputSchemaRequest",
)(
  {
    ResourceARN: S.optional(S.String),
    ServiceExecutionRole: S.String,
    InputStartingPositionConfiguration: S.optional(
      InputStartingPositionConfiguration,
    ),
    S3Configuration: S.optional(S3Configuration),
    InputProcessingConfiguration: S.optional(InputProcessingConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationSnapshotsResponse extends S.Class<ListApplicationSnapshotsResponse>(
  "ListApplicationSnapshotsResponse",
)(
  {
    SnapshotSummaries: S.optional(SnapshotSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }, ns) {}
export class RollbackApplicationResponse extends S.Class<RollbackApplicationResponse>(
  "RollbackApplicationResponse",
)(
  { ApplicationDetail: ApplicationDetail, OperationId: S.optional(S.String) },
  ns,
) {}
export class StopApplicationResponse extends S.Class<StopApplicationResponse>(
  "StopApplicationResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateApplicationMaintenanceConfigurationRequest extends S.Class<UpdateApplicationMaintenanceConfigurationRequest>(
  "UpdateApplicationMaintenanceConfigurationRequest",
)(
  {
    ApplicationName: S.String,
    ApplicationMaintenanceConfigurationUpdate:
      ApplicationMaintenanceConfigurationUpdate,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SqlApplicationConfiguration extends S.Class<SqlApplicationConfiguration>(
  "SqlApplicationConfiguration",
)({
  Inputs: S.optional(Inputs),
  Outputs: S.optional(Outputs),
  ReferenceDataSources: S.optional(ReferenceDataSources),
}) {}
export class ApplicationSnapshotConfiguration extends S.Class<ApplicationSnapshotConfiguration>(
  "ApplicationSnapshotConfiguration",
)({ SnapshotsEnabled: S.Boolean }) {}
export class ApplicationSystemRollbackConfiguration extends S.Class<ApplicationSystemRollbackConfiguration>(
  "ApplicationSystemRollbackConfiguration",
)({ RollbackEnabled: S.Boolean }) {}
export class ApplicationEncryptionConfiguration extends S.Class<ApplicationEncryptionConfiguration>(
  "ApplicationEncryptionConfiguration",
)({ KeyId: S.optional(S.String), KeyType: S.String }) {}
export class SqlRunConfiguration extends S.Class<SqlRunConfiguration>(
  "SqlRunConfiguration",
)({
  InputId: S.String,
  InputStartingPositionConfiguration: InputStartingPositionConfiguration,
}) {}
export const SqlRunConfigurations = S.Array(SqlRunConfiguration);
export class EnvironmentPropertyUpdates extends S.Class<EnvironmentPropertyUpdates>(
  "EnvironmentPropertyUpdates",
)({ PropertyGroups: PropertyGroups }) {}
export class ApplicationSnapshotConfigurationUpdate extends S.Class<ApplicationSnapshotConfigurationUpdate>(
  "ApplicationSnapshotConfigurationUpdate",
)({ SnapshotsEnabledUpdate: S.Boolean }) {}
export class ApplicationSystemRollbackConfigurationUpdate extends S.Class<ApplicationSystemRollbackConfigurationUpdate>(
  "ApplicationSystemRollbackConfigurationUpdate",
)({ RollbackEnabledUpdate: S.Boolean }) {}
export class VpcConfigurationUpdate extends S.Class<VpcConfigurationUpdate>(
  "VpcConfigurationUpdate",
)({
  VpcConfigurationId: S.String,
  SubnetIdUpdates: S.optional(SubnetIds),
  SecurityGroupIdUpdates: S.optional(SecurityGroupIds),
}) {}
export const VpcConfigurationUpdates = S.Array(VpcConfigurationUpdate);
export class ApplicationEncryptionConfigurationUpdate extends S.Class<ApplicationEncryptionConfigurationUpdate>(
  "ApplicationEncryptionConfigurationUpdate",
)({ KeyIdUpdate: S.optional(S.String), KeyTypeUpdate: S.String }) {}
export const ParsedInputRecord = S.Array(S.String);
export const ParsedInputRecords = S.Array(ParsedInputRecord);
export const ProcessedInputRecords = S.Array(S.String);
export const RawInputRecords = S.Array(S.String);
export class ApplicationOperationInfo extends S.Class<ApplicationOperationInfo>(
  "ApplicationOperationInfo",
)({
  Operation: S.optional(S.String),
  OperationId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OperationStatus: S.optional(S.String),
}) {}
export const ApplicationOperationInfoList = S.Array(ApplicationOperationInfo);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  ApplicationName: S.String,
  ApplicationARN: S.String,
  ApplicationStatus: S.String,
  ApplicationVersionId: S.Number,
  RuntimeEnvironment: S.String,
  ApplicationMode: S.optional(S.String),
}) {}
export const ApplicationSummaries = S.Array(ApplicationSummary);
export class ApplicationVersionSummary extends S.Class<ApplicationVersionSummary>(
  "ApplicationVersionSummary",
)({ ApplicationVersionId: S.Number, ApplicationStatus: S.String }) {}
export const ApplicationVersionSummaries = S.Array(ApplicationVersionSummary);
export class RunConfiguration extends S.Class<RunConfiguration>(
  "RunConfiguration",
)({
  FlinkRunConfiguration: S.optional(FlinkRunConfiguration),
  SqlRunConfigurations: S.optional(SqlRunConfigurations),
  ApplicationRestoreConfiguration: S.optional(ApplicationRestoreConfiguration),
}) {}
export class CheckpointConfiguration extends S.Class<CheckpointConfiguration>(
  "CheckpointConfiguration",
)({
  ConfigurationType: S.String,
  CheckpointingEnabled: S.optional(S.Boolean),
  CheckpointInterval: S.optional(S.Number),
  MinPauseBetweenCheckpoints: S.optional(S.Number),
}) {}
export class MonitoringConfiguration extends S.Class<MonitoringConfiguration>(
  "MonitoringConfiguration",
)({
  ConfigurationType: S.String,
  MetricsLevel: S.optional(S.String),
  LogLevel: S.optional(S.String),
}) {}
export class ParallelismConfiguration extends S.Class<ParallelismConfiguration>(
  "ParallelismConfiguration",
)({
  ConfigurationType: S.String,
  Parallelism: S.optional(S.Number),
  ParallelismPerKPU: S.optional(S.Number),
  AutoScalingEnabled: S.optional(S.Boolean),
}) {}
export class ZeppelinMonitoringConfiguration extends S.Class<ZeppelinMonitoringConfiguration>(
  "ZeppelinMonitoringConfiguration",
)({ LogLevel: S.String }) {}
export class CheckpointConfigurationUpdate extends S.Class<CheckpointConfigurationUpdate>(
  "CheckpointConfigurationUpdate",
)({
  ConfigurationTypeUpdate: S.optional(S.String),
  CheckpointingEnabledUpdate: S.optional(S.Boolean),
  CheckpointIntervalUpdate: S.optional(S.Number),
  MinPauseBetweenCheckpointsUpdate: S.optional(S.Number),
}) {}
export class MonitoringConfigurationUpdate extends S.Class<MonitoringConfigurationUpdate>(
  "MonitoringConfigurationUpdate",
)({
  ConfigurationTypeUpdate: S.optional(S.String),
  MetricsLevelUpdate: S.optional(S.String),
  LogLevelUpdate: S.optional(S.String),
}) {}
export class ParallelismConfigurationUpdate extends S.Class<ParallelismConfigurationUpdate>(
  "ParallelismConfigurationUpdate",
)({
  ConfigurationTypeUpdate: S.optional(S.String),
  ParallelismUpdate: S.optional(S.Number),
  ParallelismPerKPUUpdate: S.optional(S.Number),
  AutoScalingEnabledUpdate: S.optional(S.Boolean),
}) {}
export class ZeppelinMonitoringConfigurationUpdate extends S.Class<ZeppelinMonitoringConfigurationUpdate>(
  "ZeppelinMonitoringConfigurationUpdate",
)({ LogLevelUpdate: S.String }) {}
export class AddApplicationCloudWatchLoggingOptionResponse extends S.Class<AddApplicationCloudWatchLoggingOptionResponse>(
  "AddApplicationCloudWatchLoggingOptionResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    OperationId: S.optional(S.String),
  },
  ns,
) {}
export class AddApplicationInputProcessingConfigurationRequest extends S.Class<AddApplicationInputProcessingConfigurationRequest>(
  "AddApplicationInputProcessingConfigurationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    InputId: S.String,
    InputProcessingConfiguration: InputProcessingConfiguration,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationOutputRequest extends S.Class<AddApplicationOutputRequest>(
  "AddApplicationOutputRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    Output: Output,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationReferenceDataSourceRequest extends S.Class<AddApplicationReferenceDataSourceRequest>(
  "AddApplicationReferenceDataSourceRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ReferenceDataSource: ReferenceDataSource,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationCloudWatchLoggingOptionResponse extends S.Class<DeleteApplicationCloudWatchLoggingOptionResponse>(
  "DeleteApplicationCloudWatchLoggingOptionResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    CloudWatchLoggingOptionDescriptions: S.optional(
      CloudWatchLoggingOptionDescriptions,
    ),
    OperationId: S.optional(S.String),
  },
  ns,
) {}
export class DiscoverInputSchemaResponse extends S.Class<DiscoverInputSchemaResponse>(
  "DiscoverInputSchemaResponse",
)(
  {
    InputSchema: S.optional(SourceSchema),
    ParsedInputRecords: S.optional(ParsedInputRecords),
    ProcessedInputRecords: S.optional(ProcessedInputRecords),
    RawInputRecords: S.optional(RawInputRecords),
  },
  ns,
) {}
export class ListApplicationOperationsResponse extends S.Class<ListApplicationOperationsResponse>(
  "ListApplicationOperationsResponse",
)(
  {
    ApplicationOperationInfoList: S.optional(ApplicationOperationInfoList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)(
  {
    ApplicationSummaries: ApplicationSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListApplicationVersionsResponse extends S.Class<ListApplicationVersionsResponse>(
  "ListApplicationVersionsResponse",
)(
  {
    ApplicationVersionSummaries: S.optional(ApplicationVersionSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartApplicationRequest extends S.Class<StartApplicationRequest>(
  "StartApplicationRequest",
)(
  { ApplicationName: S.String, RunConfiguration: S.optional(RunConfiguration) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationMaintenanceConfigurationResponse extends S.Class<UpdateApplicationMaintenanceConfigurationResponse>(
  "UpdateApplicationMaintenanceConfigurationResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationMaintenanceConfigurationDescription: S.optional(
      ApplicationMaintenanceConfigurationDescription,
    ),
  },
  ns,
) {}
export class FlinkApplicationConfiguration extends S.Class<FlinkApplicationConfiguration>(
  "FlinkApplicationConfiguration",
)({
  CheckpointConfiguration: S.optional(CheckpointConfiguration),
  MonitoringConfiguration: S.optional(MonitoringConfiguration),
  ParallelismConfiguration: S.optional(ParallelismConfiguration),
}) {}
export class ApplicationVersionChangeDetails extends S.Class<ApplicationVersionChangeDetails>(
  "ApplicationVersionChangeDetails",
)({
  ApplicationVersionUpdatedFrom: S.Number,
  ApplicationVersionUpdatedTo: S.Number,
}) {}
export class FlinkApplicationConfigurationUpdate extends S.Class<FlinkApplicationConfigurationUpdate>(
  "FlinkApplicationConfigurationUpdate",
)({
  CheckpointConfigurationUpdate: S.optional(CheckpointConfigurationUpdate),
  MonitoringConfigurationUpdate: S.optional(MonitoringConfigurationUpdate),
  ParallelismConfigurationUpdate: S.optional(ParallelismConfigurationUpdate),
}) {}
export class GlueDataCatalogConfiguration extends S.Class<GlueDataCatalogConfiguration>(
  "GlueDataCatalogConfiguration",
)({ DatabaseARN: S.String }) {}
export class S3ContentBaseLocation extends S.Class<S3ContentBaseLocation>(
  "S3ContentBaseLocation",
)({ BucketARN: S.String, BasePath: S.optional(S.String) }) {}
export class KinesisStreamsInputUpdate extends S.Class<KinesisStreamsInputUpdate>(
  "KinesisStreamsInputUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class KinesisFirehoseInputUpdate extends S.Class<KinesisFirehoseInputUpdate>(
  "KinesisFirehoseInputUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class InputSchemaUpdate extends S.Class<InputSchemaUpdate>(
  "InputSchemaUpdate",
)({
  RecordFormatUpdate: S.optional(RecordFormat),
  RecordEncodingUpdate: S.optional(S.String),
  RecordColumnUpdates: S.optional(RecordColumns),
}) {}
export class InputParallelismUpdate extends S.Class<InputParallelismUpdate>(
  "InputParallelismUpdate",
)({ CountUpdate: S.Number }) {}
export class KinesisStreamsOutputUpdate extends S.Class<KinesisStreamsOutputUpdate>(
  "KinesisStreamsOutputUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class KinesisFirehoseOutputUpdate extends S.Class<KinesisFirehoseOutputUpdate>(
  "KinesisFirehoseOutputUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class LambdaOutputUpdate extends S.Class<LambdaOutputUpdate>(
  "LambdaOutputUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class S3ReferenceDataSourceUpdate extends S.Class<S3ReferenceDataSourceUpdate>(
  "S3ReferenceDataSourceUpdate",
)({
  BucketARNUpdate: S.optional(S.String),
  FileKeyUpdate: S.optional(S.String),
}) {}
export class S3ContentLocationUpdate extends S.Class<S3ContentLocationUpdate>(
  "S3ContentLocationUpdate",
)({
  BucketARNUpdate: S.optional(S.String),
  FileKeyUpdate: S.optional(S.String),
  ObjectVersionUpdate: S.optional(S.String),
}) {}
export class GlueDataCatalogConfigurationUpdate extends S.Class<GlueDataCatalogConfigurationUpdate>(
  "GlueDataCatalogConfigurationUpdate",
)({ DatabaseARNUpdate: S.String }) {}
export class S3ContentBaseLocationUpdate extends S.Class<S3ContentBaseLocationUpdate>(
  "S3ContentBaseLocationUpdate",
)({
  BucketARNUpdate: S.optional(S.String),
  BasePathUpdate: S.optional(S.String),
}) {}
export class CodeContent extends S.Class<CodeContent>("CodeContent")({
  TextContent: S.optional(S.String),
  ZipFileContent: S.optional(T.Blob),
  S3ContentLocation: S.optional(S3ContentLocation),
}) {}
export class CatalogConfiguration extends S.Class<CatalogConfiguration>(
  "CatalogConfiguration",
)({ GlueDataCatalogConfiguration: GlueDataCatalogConfiguration }) {}
export class DeployAsApplicationConfiguration extends S.Class<DeployAsApplicationConfiguration>(
  "DeployAsApplicationConfiguration",
)({ S3ContentLocation: S3ContentBaseLocation }) {}
export class CustomArtifactConfiguration extends S.Class<CustomArtifactConfiguration>(
  "CustomArtifactConfiguration",
)({
  ArtifactType: S.String,
  S3ContentLocation: S.optional(S3ContentLocation),
  MavenReference: S.optional(MavenReference),
}) {}
export const CustomArtifactsConfigurationList = S.Array(
  CustomArtifactConfiguration,
);
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  ErrorString: S.optional(S.String),
}) {}
export class OutputUpdate extends S.Class<OutputUpdate>("OutputUpdate")({
  OutputId: S.String,
  NameUpdate: S.optional(S.String),
  KinesisStreamsOutputUpdate: S.optional(KinesisStreamsOutputUpdate),
  KinesisFirehoseOutputUpdate: S.optional(KinesisFirehoseOutputUpdate),
  LambdaOutputUpdate: S.optional(LambdaOutputUpdate),
  DestinationSchemaUpdate: S.optional(DestinationSchema),
}) {}
export const OutputUpdates = S.Array(OutputUpdate);
export class ReferenceDataSourceUpdate extends S.Class<ReferenceDataSourceUpdate>(
  "ReferenceDataSourceUpdate",
)({
  ReferenceId: S.String,
  TableNameUpdate: S.optional(S.String),
  S3ReferenceDataSourceUpdate: S.optional(S3ReferenceDataSourceUpdate),
  ReferenceSchemaUpdate: S.optional(SourceSchema),
}) {}
export const ReferenceDataSourceUpdates = S.Array(ReferenceDataSourceUpdate);
export class CodeContentUpdate extends S.Class<CodeContentUpdate>(
  "CodeContentUpdate",
)({
  TextContentUpdate: S.optional(S.String),
  ZipFileContentUpdate: S.optional(T.Blob),
  S3ContentLocationUpdate: S.optional(S3ContentLocationUpdate),
}) {}
export class CatalogConfigurationUpdate extends S.Class<CatalogConfigurationUpdate>(
  "CatalogConfigurationUpdate",
)({ GlueDataCatalogConfigurationUpdate: GlueDataCatalogConfigurationUpdate }) {}
export class DeployAsApplicationConfigurationUpdate extends S.Class<DeployAsApplicationConfigurationUpdate>(
  "DeployAsApplicationConfigurationUpdate",
)({ S3ContentLocationUpdate: S.optional(S3ContentBaseLocationUpdate) }) {}
export class AddApplicationOutputResponse extends S.Class<AddApplicationOutputResponse>(
  "AddApplicationOutputResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    OutputDescriptions: S.optional(OutputDescriptions),
  },
  ns,
) {}
export class AddApplicationReferenceDataSourceResponse extends S.Class<AddApplicationReferenceDataSourceResponse>(
  "AddApplicationReferenceDataSourceResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    ReferenceDataSourceDescriptions: S.optional(
      ReferenceDataSourceDescriptions,
    ),
  },
  ns,
) {}
export class AddApplicationVpcConfigurationResponse extends S.Class<AddApplicationVpcConfigurationResponse>(
  "AddApplicationVpcConfigurationResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    VpcConfigurationDescription: S.optional(VpcConfigurationDescription),
    OperationId: S.optional(S.String),
  },
  ns,
) {}
export class DescribeApplicationSnapshotResponse extends S.Class<DescribeApplicationSnapshotResponse>(
  "DescribeApplicationSnapshotResponse",
)({ SnapshotDetails: SnapshotDetails }, ns) {}
export class StartApplicationResponse extends S.Class<StartApplicationResponse>(
  "StartApplicationResponse",
)({ OperationId: S.optional(S.String) }, ns) {}
export class InputLambdaProcessorUpdate extends S.Class<InputLambdaProcessorUpdate>(
  "InputLambdaProcessorUpdate",
)({ ResourceARNUpdate: S.String }) {}
export class EnvironmentProperties extends S.Class<EnvironmentProperties>(
  "EnvironmentProperties",
)({ PropertyGroups: PropertyGroups }) {}
export class ApplicationCodeConfiguration extends S.Class<ApplicationCodeConfiguration>(
  "ApplicationCodeConfiguration",
)({ CodeContent: S.optional(CodeContent), CodeContentType: S.String }) {}
export class ZeppelinApplicationConfiguration extends S.Class<ZeppelinApplicationConfiguration>(
  "ZeppelinApplicationConfiguration",
)({
  MonitoringConfiguration: S.optional(ZeppelinMonitoringConfiguration),
  CatalogConfiguration: S.optional(CatalogConfiguration),
  DeployAsApplicationConfiguration: S.optional(
    DeployAsApplicationConfiguration,
  ),
  CustomArtifactsConfiguration: S.optional(CustomArtifactsConfigurationList),
}) {}
export class OperationFailureDetails extends S.Class<OperationFailureDetails>(
  "OperationFailureDetails",
)({
  RollbackOperationId: S.optional(S.String),
  ErrorInfo: S.optional(ErrorInfo),
}) {}
export class ApplicationCodeConfigurationUpdate extends S.Class<ApplicationCodeConfigurationUpdate>(
  "ApplicationCodeConfigurationUpdate",
)({
  CodeContentTypeUpdate: S.optional(S.String),
  CodeContentUpdate: S.optional(CodeContentUpdate),
}) {}
export class ZeppelinApplicationConfigurationUpdate extends S.Class<ZeppelinApplicationConfigurationUpdate>(
  "ZeppelinApplicationConfigurationUpdate",
)({
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
}) {}
export class InputProcessingConfigurationUpdate extends S.Class<InputProcessingConfigurationUpdate>(
  "InputProcessingConfigurationUpdate",
)({ InputLambdaProcessorUpdate: InputLambdaProcessorUpdate }) {}
export class ApplicationConfiguration extends S.Class<ApplicationConfiguration>(
  "ApplicationConfiguration",
)({
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
}) {}
export class ApplicationOperationInfoDetails extends S.Class<ApplicationOperationInfoDetails>(
  "ApplicationOperationInfoDetails",
)({
  Operation: S.String,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  OperationStatus: S.String,
  ApplicationVersionChangeDetails: S.optional(ApplicationVersionChangeDetails),
  OperationFailureDetails: S.optional(OperationFailureDetails),
}) {}
export class InputUpdate extends S.Class<InputUpdate>("InputUpdate")({
  InputId: S.String,
  NamePrefixUpdate: S.optional(S.String),
  InputProcessingConfigurationUpdate: S.optional(
    InputProcessingConfigurationUpdate,
  ),
  KinesisStreamsInputUpdate: S.optional(KinesisStreamsInputUpdate),
  KinesisFirehoseInputUpdate: S.optional(KinesisFirehoseInputUpdate),
  InputSchemaUpdate: S.optional(InputSchemaUpdate),
  InputParallelismUpdate: S.optional(InputParallelismUpdate),
}) {}
export const InputUpdates = S.Array(InputUpdate);
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    ApplicationName: S.String,
    ApplicationDescription: S.optional(S.String),
    RuntimeEnvironment: S.String,
    ServiceExecutionRole: S.String,
    ApplicationConfiguration: S.optional(ApplicationConfiguration),
    CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
    Tags: S.optional(Tags),
    ApplicationMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicationOperationResponse extends S.Class<DescribeApplicationOperationResponse>(
  "DescribeApplicationOperationResponse",
)(
  {
    ApplicationOperationInfoDetails: S.optional(
      ApplicationOperationInfoDetails,
    ),
  },
  ns,
) {}
export class SqlApplicationConfigurationUpdate extends S.Class<SqlApplicationConfigurationUpdate>(
  "SqlApplicationConfigurationUpdate",
)({
  InputUpdates: S.optional(InputUpdates),
  OutputUpdates: S.optional(OutputUpdates),
  ReferenceDataSourceUpdates: S.optional(ReferenceDataSourceUpdates),
}) {}
export class ApplicationConfigurationUpdate extends S.Class<ApplicationConfigurationUpdate>(
  "ApplicationConfigurationUpdate",
)({
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
}) {}
export class AddApplicationInputRequest extends S.Class<AddApplicationInputRequest>(
  "AddApplicationInputRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    Input: Input,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationInputProcessingConfigurationResponse extends S.Class<AddApplicationInputProcessingConfigurationResponse>(
  "AddApplicationInputProcessingConfigurationResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    InputId: S.optional(S.String),
    InputProcessingConfigurationDescription: S.optional(
      InputProcessingConfigurationDescription,
    ),
  },
  ns,
) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ ApplicationDetail: ApplicationDetail }, ns) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.optional(S.Number),
    ApplicationConfigurationUpdate: S.optional(ApplicationConfigurationUpdate),
    ServiceExecutionRoleUpdate: S.optional(S.String),
    RunConfigurationUpdate: S.optional(RunConfigurationUpdate),
    CloudWatchLoggingOptionUpdates: S.optional(CloudWatchLoggingOptionUpdates),
    ConditionalToken: S.optional(S.String),
    RuntimeEnvironmentUpdate: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationInputResponse extends S.Class<AddApplicationInputResponse>(
  "AddApplicationInputResponse",
)(
  {
    ApplicationARN: S.optional(S.String),
    ApplicationVersionId: S.optional(S.Number),
    InputDescriptions: S.optional(InputDescriptions),
  },
  ns,
) {}
export class DescribeApplicationResponse extends S.Class<DescribeApplicationResponse>(
  "DescribeApplicationResponse",
)({ ApplicationDetail: ApplicationDetail }, ns) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)(
  { ApplicationDetail: ApplicationDetail, OperationId: S.optional(S.String) },
  ns,
) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class InvalidApplicationConfigurationException extends S.TaggedError<InvalidApplicationConfigurationException>()(
  "InvalidApplicationConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class ResourceProvisionedThroughputExceededException extends S.TaggedError<ResourceProvisionedThroughputExceededException>()(
  "ResourceProvisionedThroughputExceededException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
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
export class CodeValidationException extends S.TaggedError<CodeValidationException>()(
  "CodeValidationException",
  {},
) {}

//# Operations
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
export const createApplicationPresignedUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateApplicationPresignedUrlRequest,
    output: CreateApplicationPresignedUrlResponse,
    errors: [
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Deletes the specified application. Managed Service for Apache Flink halts application execution and deletes the application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApplicationInputProcessingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApplicationOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApplicationOutputRequest,
    output: DeleteApplicationOutputResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArgumentException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a reference data source configuration from the specified SQL-based Kinesis Data Analytics application's configuration.
 *
 * If the application is running, Kinesis Data Analytics immediately removes the in-application table
 * that you created using the AddApplicationReferenceDataSource operation.
 */
export const deleteApplicationReferenceDataSource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes a VPC configuration from a Managed Service for Apache Flink application.
 */
export const deleteApplicationVpcConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Provides a detailed description of a specified version of the application. To see a list of all the versions of an application, invoke the ListApplicationVersions operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const describeApplicationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApplicationVersionRequest,
    output: DescribeApplicationVersionResponse,
    errors: [
      InvalidArgumentException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Lists information about the current application snapshots.
 */
export const listApplicationSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationSnapshotsRequest,
    output: ListApplicationSnapshotsResponse,
    errors: [InvalidArgumentException, UnsupportedOperationException],
  }),
);
/**
 * Retrieves the list of key-value tags assigned to the application. For more information, see
 * Using Tagging.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
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
export const rollbackApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes one or more tags from a Managed Service for Apache Flink application. For more information, see
 * Using Tagging.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds an Amazon CloudWatch log stream to monitor application configuration errors.
 */
export const addApplicationCloudWatchLoggingOption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an Amazon CloudWatch log stream from an SQL-based Kinesis Data Analytics application.
 */
export const deleteApplicationCloudWatchLoggingOption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a snapshot of application state.
 */
export const deleteApplicationSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all the operations performed for the specified application such as UpdateApplication, StartApplication etc.
 * The response also includes a summary of the operation.
 *
 * To get the complete description of a specific operation, invoke the DescribeApplicationOperation operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const listApplicationOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationOperationsRequest,
    output: ListApplicationOperationsResponse,
    errors: [
      InvalidArgumentException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Returns a list of Managed Service for Apache Flink applications in your account. For each
 * application, the response includes the application name, Amazon Resource Name (ARN), and
 * status.
 *
 * If you want detailed information about a specific application, use
 * DescribeApplication.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InvalidRequestException],
}));
/**
 * Lists all the versions for the specified application, including versions that were rolled back. The response also includes a summary of the configuration
 * associated with each version.
 *
 * To get the complete description of a specific application version, invoke the DescribeApplicationVersion operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const listApplicationVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationVersionsRequest,
    output: ListApplicationVersionsResponse,
    errors: [
      InvalidArgumentException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Adds one or more key-value tags to a Managed Service for Apache Flink application. Note that the maximum number of application
 * tags includes system tags. The maximum number of user-defined application tags is 50.
 * For more information, see Using Tagging.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplicationMaintenanceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addApplicationOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddApplicationOutputRequest,
    output: AddApplicationOutputResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArgumentException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds a reference data source to an existing SQL-based Kinesis Data Analytics application.
 *
 * Kinesis Data Analytics reads reference data (that is, an Amazon S3 object) and creates an
 * in-application table within your application. In the request, you provide the source (S3
 * bucket name and object key name), name of the in-application table to create, and the
 * necessary mapping information that describes how data in an Amazon S3 object maps to columns
 * in the resulting in-application table.
 */
export const addApplicationReferenceDataSource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addApplicationVpcConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a snapshot of the application's state data.
 */
export const createApplicationSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns information about a snapshot of application state data.
 */
export const describeApplicationSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApplicationSnapshotRequest,
    output: DescribeApplicationSnapshotResponse,
    errors: [
      InvalidArgumentException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Starts the specified Managed Service for Apache Flink application. After creating an application, you must exclusively call this operation to
 * start your application.
 */
export const startApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Provides a detailed description of a specified application operation. To see a list of all the operations of an application, invoke the ListApplicationOperations operation.
 *
 * This operation is supported only for Managed Service for Apache Flink.
 */
export const describeApplicationOperation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeApplicationOperationRequest,
    output: DescribeApplicationOperationResponse,
    errors: [
      InvalidArgumentException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Adds an InputProcessingConfiguration to a SQL-based Kinesis Data Analytics application. An input processor pre-processes records
 * on the input stream before the
 * application's SQL code executes. Currently, the only input processor available is Amazon Lambda.
 */
export const addApplicationInputProcessingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Infers a schema for a SQL-based Kinesis Data Analytics application by evaluating
 * sample records on the specified streaming source (Kinesis data stream or Kinesis Data Firehose
 * delivery stream) or Amazon S3 object. In the response, the operation returns the inferred
 * schema and also the sample records that the operation used to infer the schema.
 *
 * You can use the inferred schema when configuring a streaming source for your application.
 * When you create an application using the Kinesis Data Analytics console, the console uses this
 * operation to infer a schema and show it in the console user interface.
 */
export const discoverInputSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addApplicationInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a Managed Service for Apache Flink application. For information about creating a
 * Managed Service for Apache Flink application, see Creating an
 * Application.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
export class InputLambdaProcessor extends S.Class<InputLambdaProcessor>(
  "InputLambdaProcessor",
)({ ResourceARN: S.String, RoleARN: S.String }) {}
export class InputProcessingConfiguration extends S.Class<InputProcessingConfiguration>(
  "InputProcessingConfiguration",
)({ InputLambdaProcessor: InputLambdaProcessor }) {}
export class KinesisStreamsInput extends S.Class<KinesisStreamsInput>(
  "KinesisStreamsInput",
)({ ResourceARN: S.String, RoleARN: S.String }) {}
export class KinesisFirehoseInput extends S.Class<KinesisFirehoseInput>(
  "KinesisFirehoseInput",
)({ ResourceARN: S.String, RoleARN: S.String }) {}
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
)({ ResourceARN: S.String, RoleARN: S.String }) {}
export class KinesisFirehoseOutput extends S.Class<KinesisFirehoseOutput>(
  "KinesisFirehoseOutput",
)({ ResourceARN: S.String, RoleARN: S.String }) {}
export class LambdaOutput extends S.Class<LambdaOutput>("LambdaOutput")({
  ResourceARN: S.String,
  RoleARN: S.String,
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
export class CloudWatchLoggingOption extends S.Class<CloudWatchLoggingOption>(
  "CloudWatchLoggingOption",
)({ LogStreamARN: S.String, RoleARN: S.String }) {}
export const CloudWatchLoggingOptions = S.Array(CloudWatchLoggingOption);
export const TagKeys = S.Array(S.String);
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
    CurrentApplicationVersionId: S.Number,
    CloudWatchLoggingOptionId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationCloudWatchLoggingOptionResponse extends S.Class<DeleteApplicationCloudWatchLoggingOptionResponse>(
  "DeleteApplicationCloudWatchLoggingOptionResponse",
)({}, ns) {}
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
export class DeleteApplicationInputProcessingConfigurationResponse extends S.Class<DeleteApplicationInputProcessingConfigurationResponse>(
  "DeleteApplicationInputProcessingConfigurationResponse",
)({}, ns) {}
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
export class DeleteApplicationOutputResponse extends S.Class<DeleteApplicationOutputResponse>(
  "DeleteApplicationOutputResponse",
)({}, ns) {}
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
export class DeleteApplicationReferenceDataSourceResponse extends S.Class<DeleteApplicationReferenceDataSourceResponse>(
  "DeleteApplicationReferenceDataSourceResponse",
)({}, ns) {}
export class DescribeApplicationRequest extends S.Class<DescribeApplicationRequest>(
  "DescribeApplicationRequest",
)(
  { ApplicationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    Limit: S.optional(S.Number),
    ExclusiveStartApplicationName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopApplicationRequest extends S.Class<StopApplicationRequest>(
  "StopApplicationRequest",
)(
  { ApplicationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopApplicationResponse extends S.Class<StopApplicationResponse>(
  "StopApplicationResponse",
)({}, ns) {}
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
export class InputStartingPositionConfiguration extends S.Class<InputStartingPositionConfiguration>(
  "InputStartingPositionConfiguration",
)({ InputStartingPosition: S.optional(S.String) }) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({ RoleARN: S.String, BucketARN: S.String, FileKey: S.String }) {}
export class InputConfiguration extends S.Class<InputConfiguration>(
  "InputConfiguration",
)({
  Id: S.String,
  InputStartingPositionConfiguration: InputStartingPositionConfiguration,
}) {}
export const InputConfigurations = S.Array(InputConfiguration);
export class AddApplicationCloudWatchLoggingOptionRequest extends S.Class<AddApplicationCloudWatchLoggingOptionRequest>(
  "AddApplicationCloudWatchLoggingOptionRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    CloudWatchLoggingOption: CloudWatchLoggingOption,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddApplicationCloudWatchLoggingOptionResponse extends S.Class<AddApplicationCloudWatchLoggingOptionResponse>(
  "AddApplicationCloudWatchLoggingOptionResponse",
)({}, ns) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    ApplicationName: S.String,
    ApplicationDescription: S.optional(S.String),
    Inputs: S.optional(Inputs),
    Outputs: S.optional(Outputs),
    CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
    ApplicationCode: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DiscoverInputSchemaRequest extends S.Class<DiscoverInputSchemaRequest>(
  "DiscoverInputSchemaRequest",
)(
  {
    ResourceARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    InputStartingPositionConfiguration: S.optional(
      InputStartingPositionConfiguration,
    ),
    S3Configuration: S.optional(S3Configuration),
    InputProcessingConfiguration: S.optional(InputProcessingConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }, ns) {}
export class StartApplicationRequest extends S.Class<StartApplicationRequest>(
  "StartApplicationRequest",
)(
  { ApplicationName: S.String, InputConfigurations: InputConfigurations },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartApplicationResponse extends S.Class<StartApplicationResponse>(
  "StartApplicationResponse",
)({}, ns) {}
export class S3ReferenceDataSource extends S.Class<S3ReferenceDataSource>(
  "S3ReferenceDataSource",
)({ BucketARN: S.String, FileKey: S.String, ReferenceRoleARN: S.String }) {}
export class CloudWatchLoggingOptionUpdate extends S.Class<CloudWatchLoggingOptionUpdate>(
  "CloudWatchLoggingOptionUpdate",
)({
  CloudWatchLoggingOptionId: S.String,
  LogStreamARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export const CloudWatchLoggingOptionUpdates = S.Array(
  CloudWatchLoggingOptionUpdate,
);
export class ReferenceDataSource extends S.Class<ReferenceDataSource>(
  "ReferenceDataSource",
)({
  TableName: S.String,
  S3ReferenceDataSource: S.optional(S3ReferenceDataSource),
  ReferenceSchema: SourceSchema,
}) {}
export const ParsedInputRecord = S.Array(S.String);
export const ParsedInputRecords = S.Array(ParsedInputRecord);
export const ProcessedInputRecords = S.Array(S.String);
export const RawInputRecords = S.Array(S.String);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  ApplicationName: S.String,
  ApplicationARN: S.String,
  ApplicationStatus: S.String,
}) {}
export const ApplicationSummaries = S.Array(ApplicationSummary);
export const InAppStreamNames = S.Array(S.String);
export class KinesisStreamsInputUpdate extends S.Class<KinesisStreamsInputUpdate>(
  "KinesisStreamsInputUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class KinesisFirehoseInputUpdate extends S.Class<KinesisFirehoseInputUpdate>(
  "KinesisFirehoseInputUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class InputSchemaUpdate extends S.Class<InputSchemaUpdate>(
  "InputSchemaUpdate",
)({
  RecordFormatUpdate: S.optional(RecordFormat),
  RecordEncodingUpdate: S.optional(S.String),
  RecordColumnUpdates: S.optional(RecordColumns),
}) {}
export class InputParallelismUpdate extends S.Class<InputParallelismUpdate>(
  "InputParallelismUpdate",
)({ CountUpdate: S.optional(S.Number) }) {}
export class KinesisStreamsOutputUpdate extends S.Class<KinesisStreamsOutputUpdate>(
  "KinesisStreamsOutputUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class KinesisFirehoseOutputUpdate extends S.Class<KinesisFirehoseOutputUpdate>(
  "KinesisFirehoseOutputUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class LambdaOutputUpdate extends S.Class<LambdaOutputUpdate>(
  "LambdaOutputUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class S3ReferenceDataSourceUpdate extends S.Class<S3ReferenceDataSourceUpdate>(
  "S3ReferenceDataSourceUpdate",
)({
  BucketARNUpdate: S.optional(S.String),
  FileKeyUpdate: S.optional(S.String),
  ReferenceRoleARNUpdate: S.optional(S.String),
}) {}
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
export class AddApplicationInputProcessingConfigurationResponse extends S.Class<AddApplicationInputProcessingConfigurationResponse>(
  "AddApplicationInputProcessingConfigurationResponse",
)({}, ns) {}
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
export class AddApplicationOutputResponse extends S.Class<AddApplicationOutputResponse>(
  "AddApplicationOutputResponse",
)({}, ns) {}
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
export class AddApplicationReferenceDataSourceResponse extends S.Class<AddApplicationReferenceDataSourceResponse>(
  "AddApplicationReferenceDataSourceResponse",
)({}, ns) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ ApplicationSummary: ApplicationSummary }, ns) {}
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
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)(
  {
    ApplicationSummaries: ApplicationSummaries,
    HasMoreApplications: S.Boolean,
  },
  ns,
) {}
export class CloudWatchLoggingOptionDescription extends S.Class<CloudWatchLoggingOptionDescription>(
  "CloudWatchLoggingOptionDescription",
)({
  CloudWatchLoggingOptionId: S.optional(S.String),
  LogStreamARN: S.String,
  RoleARN: S.String,
}) {}
export const CloudWatchLoggingOptionDescriptions = S.Array(
  CloudWatchLoggingOptionDescription,
);
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
export class InputLambdaProcessorUpdate extends S.Class<InputLambdaProcessorUpdate>(
  "InputLambdaProcessorUpdate",
)({
  ResourceARNUpdate: S.optional(S.String),
  RoleARNUpdate: S.optional(S.String),
}) {}
export class KinesisStreamsInputDescription extends S.Class<KinesisStreamsInputDescription>(
  "KinesisStreamsInputDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class KinesisFirehoseInputDescription extends S.Class<KinesisFirehoseInputDescription>(
  "KinesisFirehoseInputDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class KinesisStreamsOutputDescription extends S.Class<KinesisStreamsOutputDescription>(
  "KinesisStreamsOutputDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class KinesisFirehoseOutputDescription extends S.Class<KinesisFirehoseOutputDescription>(
  "KinesisFirehoseOutputDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class LambdaOutputDescription extends S.Class<LambdaOutputDescription>(
  "LambdaOutputDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class S3ReferenceDataSourceDescription extends S.Class<S3ReferenceDataSourceDescription>(
  "S3ReferenceDataSourceDescription",
)({ BucketARN: S.String, FileKey: S.String, ReferenceRoleARN: S.String }) {}
export class InputProcessingConfigurationUpdate extends S.Class<InputProcessingConfigurationUpdate>(
  "InputProcessingConfigurationUpdate",
)({ InputLambdaProcessorUpdate: InputLambdaProcessorUpdate }) {}
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
export class InputLambdaProcessorDescription extends S.Class<InputLambdaProcessorDescription>(
  "InputLambdaProcessorDescription",
)({ ResourceARN: S.optional(S.String), RoleARN: S.optional(S.String) }) {}
export class ApplicationUpdate extends S.Class<ApplicationUpdate>(
  "ApplicationUpdate",
)({
  InputUpdates: S.optional(InputUpdates),
  ApplicationCodeUpdate: S.optional(S.String),
  OutputUpdates: S.optional(OutputUpdates),
  ReferenceDataSourceUpdates: S.optional(ReferenceDataSourceUpdates),
  CloudWatchLoggingOptionUpdates: S.optional(CloudWatchLoggingOptionUpdates),
}) {}
export class InputProcessingConfigurationDescription extends S.Class<InputProcessingConfigurationDescription>(
  "InputProcessingConfigurationDescription",
)({
  InputLambdaProcessorDescription: S.optional(InputLambdaProcessorDescription),
}) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    ApplicationName: S.String,
    CurrentApplicationVersionId: S.Number,
    ApplicationUpdate: ApplicationUpdate,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({}, ns) {}
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
export class ApplicationDetail extends S.Class<ApplicationDetail>(
  "ApplicationDetail",
)({
  ApplicationName: S.String,
  ApplicationDescription: S.optional(S.String),
  ApplicationARN: S.String,
  ApplicationStatus: S.String,
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InputDescriptions: S.optional(InputDescriptions),
  OutputDescriptions: S.optional(OutputDescriptions),
  ReferenceDataSourceDescriptions: S.optional(ReferenceDataSourceDescriptions),
  CloudWatchLoggingOptionDescriptions: S.optional(
    CloudWatchLoggingOptionDescriptions,
  ),
  ApplicationCode: S.optional(S.String),
  ApplicationVersionId: S.Number,
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
export class AddApplicationInputResponse extends S.Class<AddApplicationInputResponse>(
  "AddApplicationInputResponse",
)({}, ns) {}
export class DescribeApplicationResponse extends S.Class<DescribeApplicationResponse>(
  "DescribeApplicationResponse",
)({ ApplicationDetail: ApplicationDetail }, ns) {}

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
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}
export class InvalidApplicationConfigurationException extends S.TaggedError<InvalidApplicationConfigurationException>()(
  "InvalidApplicationConfigurationException",
  { message: S.optional(S.String) },
) {}
export class CodeValidationException extends S.TaggedError<CodeValidationException>()(
  "CodeValidationException",
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
) {}
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
export const stopApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationRequest,
  output: StopApplicationResponse,
  errors: [
    ResourceInUseException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes one or more tags from a Kinesis Analytics application. For more information, see Using Tagging.
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
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds a CloudWatch log stream to monitor application configuration errors. For more
 * information about using CloudWatch log streams with Amazon Kinesis Analytics
 * applications, see Working with Amazon
 * CloudWatch Logs.
 */
export const addApplicationCloudWatchLoggingOption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified application. Amazon Kinesis Analytics halts application execution and deletes the application, including any application artifacts (such as in-application streams, reference table, and application code).
 *
 * This operation requires permissions to perform the `kinesisanalytics:DeleteApplication` action.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a CloudWatch log stream from an application. For more information about
 * using CloudWatch log streams with Amazon Kinesis Analytics applications, see
 * Working with Amazon CloudWatch Logs.
 */
export const deleteApplicationCloudWatchLoggingOption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApplicationInputProcessingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApplicationOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApplicationOutputRequest,
    output: DeleteApplicationOutputResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
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
export const deleteApplicationReferenceDataSource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the list of key-value tags assigned to the application. For more information, see Using Tagging.
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
 * Adds one or more key-value tags to a Kinesis Analytics application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50.
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
 * This documentation is for version 1 of the Amazon Kinesis Data Analytics API, which only supports SQL applications. Version 2 of the API supports SQL and Java applications. For more information about version 2, see Amazon Kinesis Data Analytics API V2 Documentation.
 *
 * Adds an InputProcessingConfiguration to an application. An input processor preprocesses records on the input stream
 * before the application's SQL code executes. Currently, the only input processor available is
 * AWS Lambda.
 */
export const addApplicationInputProcessingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addApplicationOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddApplicationOutputRequest,
    output: AddApplicationOutputResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArgumentException,
      ResourceInUseException,
      ResourceNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
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
export const addApplicationReferenceDataSource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [],
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
export const startApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addApplicationInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const discoverInputSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverInputSchemaRequest,
  output: DiscoverInputSchemaResponse,
  errors: [
    InvalidArgumentException,
    ResourceProvisionedThroughputExceededException,
    ServiceUnavailableException,
    UnableToDetectSchemaException,
  ],
}));

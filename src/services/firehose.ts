import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://firehose.amazonaws.com/doc/2015-08-04");
const svc = T.AwsApiService({
  sdkId: "Firehose",
  serviceShapeName: "Firehose_20150804",
});
const auth = T.AwsAuthSigv4({ name: "firehose" });
const ver = T.ServiceVersion("2015-08-04");
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
                        url: "https://firehose-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://firehose-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://firehose.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://firehose.{Region}.{PartitionResult#dnsSuffix}",
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
export class Record extends S.Class<Record>("Record")({ Data: T.Blob }) {}
export const PutRecordBatchRequestEntryList = S.Array(Record);
export const TagKeyList = S.Array(S.String);
export class DeleteDeliveryStreamInput extends S.Class<DeleteDeliveryStreamInput>(
  "DeleteDeliveryStreamInput",
)(
  { DeliveryStreamName: S.String, AllowForceDelete: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliveryStreamOutput extends S.Class<DeleteDeliveryStreamOutput>(
  "DeleteDeliveryStreamOutput",
)({}, ns) {}
export class DescribeDeliveryStreamInput extends S.Class<DescribeDeliveryStreamInput>(
  "DescribeDeliveryStreamInput",
)(
  {
    DeliveryStreamName: S.String,
    Limit: S.optional(S.Number),
    ExclusiveStartDestinationId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeliveryStreamsInput extends S.Class<ListDeliveryStreamsInput>(
  "ListDeliveryStreamsInput",
)(
  {
    Limit: S.optional(S.Number),
    DeliveryStreamType: S.optional(S.String),
    ExclusiveStartDeliveryStreamName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForDeliveryStreamInput extends S.Class<ListTagsForDeliveryStreamInput>(
  "ListTagsForDeliveryStreamInput",
)(
  {
    DeliveryStreamName: S.String,
    ExclusiveStartTagKey: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRecordBatchInput extends S.Class<PutRecordBatchInput>(
  "PutRecordBatchInput",
)(
  { DeliveryStreamName: S.String, Records: PutRecordBatchRequestEntryList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeliveryStreamEncryptionConfigurationInput extends S.Class<DeliveryStreamEncryptionConfigurationInput>(
  "DeliveryStreamEncryptionConfigurationInput",
)({ KeyARN: S.optional(S.String), KeyType: S.String }) {}
export class StartDeliveryStreamEncryptionInput extends S.Class<StartDeliveryStreamEncryptionInput>(
  "StartDeliveryStreamEncryptionInput",
)(
  {
    DeliveryStreamName: S.String,
    DeliveryStreamEncryptionConfigurationInput: S.optional(
      DeliveryStreamEncryptionConfigurationInput,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDeliveryStreamEncryptionOutput extends S.Class<StartDeliveryStreamEncryptionOutput>(
  "StartDeliveryStreamEncryptionOutput",
)({}, ns) {}
export class StopDeliveryStreamEncryptionInput extends S.Class<StopDeliveryStreamEncryptionInput>(
  "StopDeliveryStreamEncryptionInput",
)(
  { DeliveryStreamName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDeliveryStreamEncryptionOutput extends S.Class<StopDeliveryStreamEncryptionOutput>(
  "StopDeliveryStreamEncryptionOutput",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagDeliveryStreamInputTagList = S.Array(Tag);
export class TagDeliveryStreamInput extends S.Class<TagDeliveryStreamInput>(
  "TagDeliveryStreamInput",
)(
  { DeliveryStreamName: S.String, Tags: TagDeliveryStreamInputTagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagDeliveryStreamOutput extends S.Class<TagDeliveryStreamOutput>(
  "TagDeliveryStreamOutput",
)({}, ns) {}
export class UntagDeliveryStreamInput extends S.Class<UntagDeliveryStreamInput>(
  "UntagDeliveryStreamInput",
)(
  { DeliveryStreamName: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagDeliveryStreamOutput extends S.Class<UntagDeliveryStreamOutput>(
  "UntagDeliveryStreamOutput",
)({}, ns) {}
export const DatabaseSurrogateKeyList = S.Array(S.String);
export class DirectPutSourceConfiguration extends S.Class<DirectPutSourceConfiguration>(
  "DirectPutSourceConfiguration",
)({ ThroughputHintInMBs: S.Number }) {}
export class KinesisStreamSourceConfiguration extends S.Class<KinesisStreamSourceConfiguration>(
  "KinesisStreamSourceConfiguration",
)({ KinesisStreamARN: S.String, RoleARN: S.String }) {}
export const DeliveryStreamNameList = S.Array(S.String);
export const ListTagsForDeliveryStreamOutputTagList = S.Array(Tag);
export class BufferingHints extends S.Class<BufferingHints>("BufferingHints")({
  SizeInMBs: S.optional(S.Number),
  IntervalInSeconds: S.optional(S.Number),
}) {}
export class KMSEncryptionConfig extends S.Class<KMSEncryptionConfig>(
  "KMSEncryptionConfig",
)({ AWSKMSKeyARN: S.String }) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({
  NoEncryptionConfig: S.optional(S.String),
  KMSEncryptionConfig: S.optional(KMSEncryptionConfig),
}) {}
export class CloudWatchLoggingOptions extends S.Class<CloudWatchLoggingOptions>(
  "CloudWatchLoggingOptions",
)({
  Enabled: S.optional(S.Boolean),
  LogGroupName: S.optional(S.String),
  LogStreamName: S.optional(S.String),
}) {}
export class S3DestinationUpdate extends S.Class<S3DestinationUpdate>(
  "S3DestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  BucketARN: S.optional(S.String),
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: S.optional(BufferingHints),
  CompressionFormat: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
}) {}
export class ProcessorParameter extends S.Class<ProcessorParameter>(
  "ProcessorParameter",
)({ ParameterName: S.String, ParameterValue: S.String }) {}
export const ProcessorParameterList = S.Array(ProcessorParameter);
export class Processor extends S.Class<Processor>("Processor")({
  Type: S.String,
  Parameters: S.optional(ProcessorParameterList),
}) {}
export const ProcessorList = S.Array(Processor);
export class ProcessingConfiguration extends S.Class<ProcessingConfiguration>(
  "ProcessingConfiguration",
)({ Enabled: S.optional(S.Boolean), Processors: S.optional(ProcessorList) }) {}
export class SchemaConfiguration extends S.Class<SchemaConfiguration>(
  "SchemaConfiguration",
)({
  RoleARN: S.optional(S.String),
  CatalogId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  Region: S.optional(S.String),
  VersionId: S.optional(S.String),
}) {}
export const ColumnToJsonKeyMappings = S.Record({
  key: S.String,
  value: S.String,
});
export class OpenXJsonSerDe extends S.Class<OpenXJsonSerDe>("OpenXJsonSerDe")({
  ConvertDotsInJsonKeysToUnderscores: S.optional(S.Boolean),
  CaseInsensitive: S.optional(S.Boolean),
  ColumnToJsonKeyMappings: S.optional(ColumnToJsonKeyMappings),
}) {}
export const ListOfNonEmptyStrings = S.Array(S.String);
export class HiveJsonSerDe extends S.Class<HiveJsonSerDe>("HiveJsonSerDe")({
  TimestampFormats: S.optional(ListOfNonEmptyStrings),
}) {}
export class Deserializer extends S.Class<Deserializer>("Deserializer")({
  OpenXJsonSerDe: S.optional(OpenXJsonSerDe),
  HiveJsonSerDe: S.optional(HiveJsonSerDe),
}) {}
export class InputFormatConfiguration extends S.Class<InputFormatConfiguration>(
  "InputFormatConfiguration",
)({ Deserializer: S.optional(Deserializer) }) {}
export class ParquetSerDe extends S.Class<ParquetSerDe>("ParquetSerDe")({
  BlockSizeBytes: S.optional(S.Number),
  PageSizeBytes: S.optional(S.Number),
  Compression: S.optional(S.String),
  EnableDictionaryCompression: S.optional(S.Boolean),
  MaxPaddingBytes: S.optional(S.Number),
  WriterVersion: S.optional(S.String),
}) {}
export const ListOfNonEmptyStringsWithoutWhitespace = S.Array(S.String);
export class OrcSerDe extends S.Class<OrcSerDe>("OrcSerDe")({
  StripeSizeBytes: S.optional(S.Number),
  BlockSizeBytes: S.optional(S.Number),
  RowIndexStride: S.optional(S.Number),
  EnablePadding: S.optional(S.Boolean),
  PaddingTolerance: S.optional(S.Number),
  Compression: S.optional(S.String),
  BloomFilterColumns: S.optional(ListOfNonEmptyStringsWithoutWhitespace),
  BloomFilterFalsePositiveProbability: S.optional(S.Number),
  DictionaryKeyThreshold: S.optional(S.Number),
  FormatVersion: S.optional(S.String),
}) {}
export class Serializer extends S.Class<Serializer>("Serializer")({
  ParquetSerDe: S.optional(ParquetSerDe),
  OrcSerDe: S.optional(OrcSerDe),
}) {}
export class OutputFormatConfiguration extends S.Class<OutputFormatConfiguration>(
  "OutputFormatConfiguration",
)({ Serializer: S.optional(Serializer) }) {}
export class DataFormatConversionConfiguration extends S.Class<DataFormatConversionConfiguration>(
  "DataFormatConversionConfiguration",
)({
  SchemaConfiguration: S.optional(SchemaConfiguration),
  InputFormatConfiguration: S.optional(InputFormatConfiguration),
  OutputFormatConfiguration: S.optional(OutputFormatConfiguration),
  Enabled: S.optional(S.Boolean),
}) {}
export class RetryOptions extends S.Class<RetryOptions>("RetryOptions")({
  DurationInSeconds: S.optional(S.Number),
}) {}
export class DynamicPartitioningConfiguration extends S.Class<DynamicPartitioningConfiguration>(
  "DynamicPartitioningConfiguration",
)({ RetryOptions: S.optional(RetryOptions), Enabled: S.optional(S.Boolean) }) {}
export class ExtendedS3DestinationUpdate extends S.Class<ExtendedS3DestinationUpdate>(
  "ExtendedS3DestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  BucketARN: S.optional(S.String),
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: S.optional(BufferingHints),
  CompressionFormat: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupUpdate: S.optional(S3DestinationUpdate),
  DataFormatConversionConfiguration: S.optional(
    DataFormatConversionConfiguration,
  ),
  DynamicPartitioningConfiguration: S.optional(
    DynamicPartitioningConfiguration,
  ),
  FileExtension: S.optional(S.String),
  CustomTimeZone: S.optional(S.String),
}) {}
export class CopyCommand extends S.Class<CopyCommand>("CopyCommand")({
  DataTableName: S.String,
  DataTableColumns: S.optional(S.String),
  CopyOptions: S.optional(S.String),
}) {}
export class RedshiftRetryOptions extends S.Class<RedshiftRetryOptions>(
  "RedshiftRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class SecretsManagerConfiguration extends S.Class<SecretsManagerConfiguration>(
  "SecretsManagerConfiguration",
)({
  SecretARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
  Enabled: S.Boolean,
}) {}
export class RedshiftDestinationUpdate extends S.Class<RedshiftDestinationUpdate>(
  "RedshiftDestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  ClusterJDBCURL: S.optional(S.String),
  CopyCommand: S.optional(CopyCommand),
  Username: S.optional(S.String),
  Password: S.optional(S.String),
  RetryOptions: S.optional(RedshiftRetryOptions),
  S3Update: S.optional(S3DestinationUpdate),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupUpdate: S.optional(S3DestinationUpdate),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class ElasticsearchBufferingHints extends S.Class<ElasticsearchBufferingHints>(
  "ElasticsearchBufferingHints",
)({
  IntervalInSeconds: S.optional(S.Number),
  SizeInMBs: S.optional(S.Number),
}) {}
export class ElasticsearchRetryOptions extends S.Class<ElasticsearchRetryOptions>(
  "ElasticsearchRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class DocumentIdOptions extends S.Class<DocumentIdOptions>(
  "DocumentIdOptions",
)({ DefaultDocumentIdFormat: S.String }) {}
export class ElasticsearchDestinationUpdate extends S.Class<ElasticsearchDestinationUpdate>(
  "ElasticsearchDestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(ElasticsearchBufferingHints),
  RetryOptions: S.optional(ElasticsearchRetryOptions),
  S3Update: S.optional(S3DestinationUpdate),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class AmazonopensearchserviceBufferingHints extends S.Class<AmazonopensearchserviceBufferingHints>(
  "AmazonopensearchserviceBufferingHints",
)({
  IntervalInSeconds: S.optional(S.Number),
  SizeInMBs: S.optional(S.Number),
}) {}
export class AmazonopensearchserviceRetryOptions extends S.Class<AmazonopensearchserviceRetryOptions>(
  "AmazonopensearchserviceRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class AmazonopensearchserviceDestinationUpdate extends S.Class<AmazonopensearchserviceDestinationUpdate>(
  "AmazonopensearchserviceDestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(AmazonopensearchserviceBufferingHints),
  RetryOptions: S.optional(AmazonopensearchserviceRetryOptions),
  S3Update: S.optional(S3DestinationUpdate),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class SplunkRetryOptions extends S.Class<SplunkRetryOptions>(
  "SplunkRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class SplunkBufferingHints extends S.Class<SplunkBufferingHints>(
  "SplunkBufferingHints",
)({
  IntervalInSeconds: S.optional(S.Number),
  SizeInMBs: S.optional(S.Number),
}) {}
export class SplunkDestinationUpdate extends S.Class<SplunkDestinationUpdate>(
  "SplunkDestinationUpdate",
)({
  HECEndpoint: S.optional(S.String),
  HECEndpointType: S.optional(S.String),
  HECToken: S.optional(S.String),
  HECAcknowledgmentTimeoutInSeconds: S.optional(S.Number),
  RetryOptions: S.optional(SplunkRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Update: S.optional(S3DestinationUpdate),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  BufferingHints: S.optional(SplunkBufferingHints),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class HttpEndpointConfiguration extends S.Class<HttpEndpointConfiguration>(
  "HttpEndpointConfiguration",
)({
  Url: S.String,
  Name: S.optional(S.String),
  AccessKey: S.optional(S.String),
}) {}
export class HttpEndpointBufferingHints extends S.Class<HttpEndpointBufferingHints>(
  "HttpEndpointBufferingHints",
)({
  SizeInMBs: S.optional(S.Number),
  IntervalInSeconds: S.optional(S.Number),
}) {}
export class HttpEndpointCommonAttribute extends S.Class<HttpEndpointCommonAttribute>(
  "HttpEndpointCommonAttribute",
)({ AttributeName: S.String, AttributeValue: S.String }) {}
export const HttpEndpointCommonAttributesList = S.Array(
  HttpEndpointCommonAttribute,
);
export class HttpEndpointRequestConfiguration extends S.Class<HttpEndpointRequestConfiguration>(
  "HttpEndpointRequestConfiguration",
)({
  ContentEncoding: S.optional(S.String),
  CommonAttributes: S.optional(HttpEndpointCommonAttributesList),
}) {}
export class HttpEndpointRetryOptions extends S.Class<HttpEndpointRetryOptions>(
  "HttpEndpointRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class HttpEndpointDestinationUpdate extends S.Class<HttpEndpointDestinationUpdate>(
  "HttpEndpointDestinationUpdate",
)({
  EndpointConfiguration: S.optional(HttpEndpointConfiguration),
  BufferingHints: S.optional(HttpEndpointBufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  RequestConfiguration: S.optional(HttpEndpointRequestConfiguration),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.optional(S.String),
  RetryOptions: S.optional(HttpEndpointRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Update: S.optional(S3DestinationUpdate),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class AmazonOpenSearchServerlessBufferingHints extends S.Class<AmazonOpenSearchServerlessBufferingHints>(
  "AmazonOpenSearchServerlessBufferingHints",
)({
  IntervalInSeconds: S.optional(S.Number),
  SizeInMBs: S.optional(S.Number),
}) {}
export class AmazonOpenSearchServerlessRetryOptions extends S.Class<AmazonOpenSearchServerlessRetryOptions>(
  "AmazonOpenSearchServerlessRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class AmazonOpenSearchServerlessDestinationUpdate extends S.Class<AmazonOpenSearchServerlessDestinationUpdate>(
  "AmazonOpenSearchServerlessDestinationUpdate",
)({
  RoleARN: S.optional(S.String),
  CollectionEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  BufferingHints: S.optional(AmazonOpenSearchServerlessBufferingHints),
  RetryOptions: S.optional(AmazonOpenSearchServerlessRetryOptions),
  S3Update: S.optional(S3DestinationUpdate),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
}) {}
export class SnowflakeRoleConfiguration extends S.Class<SnowflakeRoleConfiguration>(
  "SnowflakeRoleConfiguration",
)({ Enabled: S.optional(S.Boolean), SnowflakeRole: S.optional(S.String) }) {}
export class SnowflakeRetryOptions extends S.Class<SnowflakeRetryOptions>(
  "SnowflakeRetryOptions",
)({ DurationInSeconds: S.optional(S.Number) }) {}
export class SnowflakeBufferingHints extends S.Class<SnowflakeBufferingHints>(
  "SnowflakeBufferingHints",
)({
  SizeInMBs: S.optional(S.Number),
  IntervalInSeconds: S.optional(S.Number),
}) {}
export class SnowflakeDestinationUpdate extends S.Class<SnowflakeDestinationUpdate>(
  "SnowflakeDestinationUpdate",
)({
  AccountUrl: S.optional(S.String),
  PrivateKey: S.optional(S.String),
  KeyPassphrase: S.optional(S.String),
  User: S.optional(S.String),
  Database: S.optional(S.String),
  Schema: S.optional(S.String),
  Table: S.optional(S.String),
  SnowflakeRoleConfiguration: S.optional(SnowflakeRoleConfiguration),
  DataLoadingOption: S.optional(S.String),
  MetaDataColumnName: S.optional(S.String),
  ContentColumnName: S.optional(S.String),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.optional(S.String),
  RetryOptions: S.optional(SnowflakeRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Update: S.optional(S3DestinationUpdate),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
  BufferingHints: S.optional(SnowflakeBufferingHints),
}) {}
export class PartitionField extends S.Class<PartitionField>("PartitionField")({
  SourceName: S.String,
}) {}
export const PartitionFields = S.Array(PartitionField);
export class PartitionSpec extends S.Class<PartitionSpec>("PartitionSpec")({
  Identity: S.optional(PartitionFields),
}) {}
export class DestinationTableConfiguration extends S.Class<DestinationTableConfiguration>(
  "DestinationTableConfiguration",
)({
  DestinationTableName: S.String,
  DestinationDatabaseName: S.String,
  UniqueKeys: S.optional(ListOfNonEmptyStringsWithoutWhitespace),
  PartitionSpec: S.optional(PartitionSpec),
  S3ErrorOutputPrefix: S.optional(S.String),
}) {}
export const DestinationTableConfigurationList = S.Array(
  DestinationTableConfiguration,
);
export class SchemaEvolutionConfiguration extends S.Class<SchemaEvolutionConfiguration>(
  "SchemaEvolutionConfiguration",
)({ Enabled: S.Boolean }) {}
export class TableCreationConfiguration extends S.Class<TableCreationConfiguration>(
  "TableCreationConfiguration",
)({ Enabled: S.Boolean }) {}
export class CatalogConfiguration extends S.Class<CatalogConfiguration>(
  "CatalogConfiguration",
)({
  CatalogARN: S.optional(S.String),
  WarehouseLocation: S.optional(S.String),
}) {}
export class S3DestinationConfiguration extends S.Class<S3DestinationConfiguration>(
  "S3DestinationConfiguration",
)({
  RoleARN: S.String,
  BucketARN: S.String,
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: S.optional(BufferingHints),
  CompressionFormat: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
}) {}
export class IcebergDestinationUpdate extends S.Class<IcebergDestinationUpdate>(
  "IcebergDestinationUpdate",
)({
  DestinationTableConfigurationList: S.optional(
    DestinationTableConfigurationList,
  ),
  SchemaEvolutionConfiguration: S.optional(SchemaEvolutionConfiguration),
  TableCreationConfiguration: S.optional(TableCreationConfiguration),
  BufferingHints: S.optional(BufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  RetryOptions: S.optional(RetryOptions),
  RoleARN: S.optional(S.String),
  AppendOnly: S.optional(S.Boolean),
  CatalogConfiguration: S.optional(CatalogConfiguration),
  S3Configuration: S.optional(S3DestinationConfiguration),
}) {}
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const DatabaseIncludeOrExcludeList = S.Array(S.String);
export const DatabaseTableIncludeOrExcludeList = S.Array(S.String);
export const DatabaseColumnIncludeOrExcludeList = S.Array(S.String);
export class ListDeliveryStreamsOutput extends S.Class<ListDeliveryStreamsOutput>(
  "ListDeliveryStreamsOutput",
)(
  {
    DeliveryStreamNames: DeliveryStreamNameList,
    HasMoreDeliveryStreams: S.Boolean,
  },
  ns,
) {}
export class ListTagsForDeliveryStreamOutput extends S.Class<ListTagsForDeliveryStreamOutput>(
  "ListTagsForDeliveryStreamOutput",
)(
  { Tags: ListTagsForDeliveryStreamOutputTagList, HasMoreTags: S.Boolean },
  ns,
) {}
export class PutRecordInput extends S.Class<PutRecordInput>("PutRecordInput")(
  { DeliveryStreamName: S.String, Record: Record },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDestinationInput extends S.Class<UpdateDestinationInput>(
  "UpdateDestinationInput",
)(
  {
    DeliveryStreamName: S.String,
    CurrentDeliveryStreamVersionId: S.String,
    DestinationId: S.String,
    S3DestinationUpdate: S.optional(S3DestinationUpdate),
    ExtendedS3DestinationUpdate: S.optional(ExtendedS3DestinationUpdate),
    RedshiftDestinationUpdate: S.optional(RedshiftDestinationUpdate),
    ElasticsearchDestinationUpdate: S.optional(ElasticsearchDestinationUpdate),
    AmazonopensearchserviceDestinationUpdate: S.optional(
      AmazonopensearchserviceDestinationUpdate,
    ),
    SplunkDestinationUpdate: S.optional(SplunkDestinationUpdate),
    HttpEndpointDestinationUpdate: S.optional(HttpEndpointDestinationUpdate),
    AmazonOpenSearchServerlessDestinationUpdate: S.optional(
      AmazonOpenSearchServerlessDestinationUpdate,
    ),
    SnowflakeDestinationUpdate: S.optional(SnowflakeDestinationUpdate),
    IcebergDestinationUpdate: S.optional(IcebergDestinationUpdate),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDestinationOutput extends S.Class<UpdateDestinationOutput>(
  "UpdateDestinationOutput",
)({}, ns) {}
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({
  SubnetIds: SubnetIdList,
  RoleARN: S.String,
  SecurityGroupIds: SecurityGroupIdList,
}) {}
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({ RoleARN: S.String, Connectivity: S.String }) {}
export class SnowflakeVpcConfiguration extends S.Class<SnowflakeVpcConfiguration>(
  "SnowflakeVpcConfiguration",
)({ PrivateLinkVpceId: S.String }) {}
export class DatabaseList extends S.Class<DatabaseList>("DatabaseList")({
  Include: S.optional(DatabaseIncludeOrExcludeList),
  Exclude: S.optional(DatabaseIncludeOrExcludeList),
}) {}
export class DatabaseTableList extends S.Class<DatabaseTableList>(
  "DatabaseTableList",
)({
  Include: S.optional(DatabaseTableIncludeOrExcludeList),
  Exclude: S.optional(DatabaseTableIncludeOrExcludeList),
}) {}
export class DatabaseColumnList extends S.Class<DatabaseColumnList>(
  "DatabaseColumnList",
)({
  Include: S.optional(DatabaseColumnIncludeOrExcludeList),
  Exclude: S.optional(DatabaseColumnIncludeOrExcludeList),
}) {}
export class DatabaseSourceAuthenticationConfiguration extends S.Class<DatabaseSourceAuthenticationConfiguration>(
  "DatabaseSourceAuthenticationConfiguration",
)({ SecretsManagerConfiguration: SecretsManagerConfiguration }) {}
export class DatabaseSourceVPCConfiguration extends S.Class<DatabaseSourceVPCConfiguration>(
  "DatabaseSourceVPCConfiguration",
)({ VpcEndpointServiceName: S.String }) {}
export class RedshiftDestinationConfiguration extends S.Class<RedshiftDestinationConfiguration>(
  "RedshiftDestinationConfiguration",
)({
  RoleARN: S.String,
  ClusterJDBCURL: S.String,
  CopyCommand: CopyCommand,
  Username: S.optional(S.String),
  Password: S.optional(S.String),
  RetryOptions: S.optional(RedshiftRetryOptions),
  S3Configuration: S3DestinationConfiguration,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupConfiguration: S.optional(S3DestinationConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class ElasticsearchDestinationConfiguration extends S.Class<ElasticsearchDestinationConfiguration>(
  "ElasticsearchDestinationConfiguration",
)({
  RoleARN: S.String,
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.String,
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(ElasticsearchBufferingHints),
  RetryOptions: S.optional(ElasticsearchRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfiguration: S.optional(VpcConfiguration),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class AmazonopensearchserviceDestinationConfiguration extends S.Class<AmazonopensearchserviceDestinationConfiguration>(
  "AmazonopensearchserviceDestinationConfiguration",
)({
  RoleARN: S.String,
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.String,
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(AmazonopensearchserviceBufferingHints),
  RetryOptions: S.optional(AmazonopensearchserviceRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfiguration: S.optional(VpcConfiguration),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class SplunkDestinationConfiguration extends S.Class<SplunkDestinationConfiguration>(
  "SplunkDestinationConfiguration",
)({
  HECEndpoint: S.String,
  HECEndpointType: S.String,
  HECToken: S.optional(S.String),
  HECAcknowledgmentTimeoutInSeconds: S.optional(S.Number),
  RetryOptions: S.optional(SplunkRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  BufferingHints: S.optional(SplunkBufferingHints),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class AmazonOpenSearchServerlessDestinationConfiguration extends S.Class<AmazonOpenSearchServerlessDestinationConfiguration>(
  "AmazonOpenSearchServerlessDestinationConfiguration",
)({
  RoleARN: S.String,
  CollectionEndpoint: S.optional(S.String),
  IndexName: S.String,
  BufferingHints: S.optional(AmazonOpenSearchServerlessBufferingHints),
  RetryOptions: S.optional(AmazonOpenSearchServerlessRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfiguration: S.optional(VpcConfiguration),
}) {}
export class MSKSourceConfiguration extends S.Class<MSKSourceConfiguration>(
  "MSKSourceConfiguration",
)({
  MSKClusterARN: S.String,
  TopicName: S.String,
  AuthenticationConfiguration: AuthenticationConfiguration,
  ReadFromTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class SnowflakeDestinationConfiguration extends S.Class<SnowflakeDestinationConfiguration>(
  "SnowflakeDestinationConfiguration",
)({
  AccountUrl: S.String,
  PrivateKey: S.optional(S.String),
  KeyPassphrase: S.optional(S.String),
  User: S.optional(S.String),
  Database: S.String,
  Schema: S.String,
  Table: S.String,
  SnowflakeRoleConfiguration: S.optional(SnowflakeRoleConfiguration),
  DataLoadingOption: S.optional(S.String),
  MetaDataColumnName: S.optional(S.String),
  ContentColumnName: S.optional(S.String),
  SnowflakeVpcConfiguration: S.optional(SnowflakeVpcConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.String,
  RetryOptions: S.optional(SnowflakeRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
  BufferingHints: S.optional(SnowflakeBufferingHints),
}) {}
export class DatabaseSourceConfiguration extends S.Class<DatabaseSourceConfiguration>(
  "DatabaseSourceConfiguration",
)({
  Type: S.String,
  Endpoint: S.String,
  Port: S.Number,
  SSLMode: S.optional(S.String),
  Databases: DatabaseList,
  Tables: DatabaseTableList,
  Columns: S.optional(DatabaseColumnList),
  SurrogateKeys: S.optional(DatabaseSurrogateKeyList),
  SnapshotWatermarkTable: S.String,
  DatabaseSourceAuthenticationConfiguration:
    DatabaseSourceAuthenticationConfiguration,
  DatabaseSourceVPCConfiguration: DatabaseSourceVPCConfiguration,
}) {}
export class PutRecordBatchResponseEntry extends S.Class<PutRecordBatchResponseEntry>(
  "PutRecordBatchResponseEntry",
)({
  RecordId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PutRecordBatchResponseEntryList = S.Array(
  PutRecordBatchResponseEntry,
);
export class PutRecordOutput extends S.Class<PutRecordOutput>(
  "PutRecordOutput",
)({ RecordId: S.String, Encrypted: S.optional(S.Boolean) }, ns) {}
export class PutRecordBatchOutput extends S.Class<PutRecordBatchOutput>(
  "PutRecordBatchOutput",
)(
  {
    FailedPutCount: S.Number,
    Encrypted: S.optional(S.Boolean),
    RequestResponses: PutRecordBatchResponseEntryList,
  },
  ns,
) {}
export class FailureDescription extends S.Class<FailureDescription>(
  "FailureDescription",
)({ Type: S.String, Details: S.String }) {}
export class DeliveryStreamEncryptionConfiguration extends S.Class<DeliveryStreamEncryptionConfiguration>(
  "DeliveryStreamEncryptionConfiguration",
)({
  KeyARN: S.optional(S.String),
  KeyType: S.optional(S.String),
  Status: S.optional(S.String),
  FailureDescription: S.optional(FailureDescription),
}) {}
export class HttpEndpointDestinationConfiguration extends S.Class<HttpEndpointDestinationConfiguration>(
  "HttpEndpointDestinationConfiguration",
)({
  EndpointConfiguration: HttpEndpointConfiguration,
  BufferingHints: S.optional(HttpEndpointBufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  RequestConfiguration: S.optional(HttpEndpointRequestConfiguration),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.optional(S.String),
  RetryOptions: S.optional(HttpEndpointRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3Configuration: S3DestinationConfiguration,
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class DirectPutSourceDescription extends S.Class<DirectPutSourceDescription>(
  "DirectPutSourceDescription",
)({ ThroughputHintInMBs: S.optional(S.Number) }) {}
export class KinesisStreamSourceDescription extends S.Class<KinesisStreamSourceDescription>(
  "KinesisStreamSourceDescription",
)({
  KinesisStreamARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
  DeliveryStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class MSKSourceDescription extends S.Class<MSKSourceDescription>(
  "MSKSourceDescription",
)({
  MSKClusterARN: S.optional(S.String),
  TopicName: S.optional(S.String),
  AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
  DeliveryStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReadFromTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class S3DestinationDescription extends S.Class<S3DestinationDescription>(
  "S3DestinationDescription",
)({
  RoleARN: S.String,
  BucketARN: S.String,
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: BufferingHints,
  CompressionFormat: S.String,
  EncryptionConfiguration: EncryptionConfiguration,
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
}) {}
export class ExtendedS3DestinationDescription extends S.Class<ExtendedS3DestinationDescription>(
  "ExtendedS3DestinationDescription",
)({
  RoleARN: S.String,
  BucketARN: S.String,
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: BufferingHints,
  CompressionFormat: S.String,
  EncryptionConfiguration: EncryptionConfiguration,
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupDescription: S.optional(S3DestinationDescription),
  DataFormatConversionConfiguration: S.optional(
    DataFormatConversionConfiguration,
  ),
  DynamicPartitioningConfiguration: S.optional(
    DynamicPartitioningConfiguration,
  ),
  FileExtension: S.optional(S.String),
  CustomTimeZone: S.optional(S.String),
}) {}
export class RedshiftDestinationDescription extends S.Class<RedshiftDestinationDescription>(
  "RedshiftDestinationDescription",
)({
  RoleARN: S.String,
  ClusterJDBCURL: S.String,
  CopyCommand: CopyCommand,
  Username: S.optional(S.String),
  RetryOptions: S.optional(RedshiftRetryOptions),
  S3DestinationDescription: S3DestinationDescription,
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupDescription: S.optional(S3DestinationDescription),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class VpcConfigurationDescription extends S.Class<VpcConfigurationDescription>(
  "VpcConfigurationDescription",
)({
  SubnetIds: SubnetIdList,
  RoleARN: S.String,
  SecurityGroupIds: SecurityGroupIdList,
  VpcId: S.String,
}) {}
export class AmazonopensearchserviceDestinationDescription extends S.Class<AmazonopensearchserviceDestinationDescription>(
  "AmazonopensearchserviceDestinationDescription",
)({
  RoleARN: S.optional(S.String),
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(AmazonopensearchserviceBufferingHints),
  RetryOptions: S.optional(AmazonopensearchserviceRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfigurationDescription: S.optional(VpcConfigurationDescription),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class SplunkDestinationDescription extends S.Class<SplunkDestinationDescription>(
  "SplunkDestinationDescription",
)({
  HECEndpoint: S.optional(S.String),
  HECEndpointType: S.optional(S.String),
  HECToken: S.optional(S.String),
  HECAcknowledgmentTimeoutInSeconds: S.optional(S.Number),
  RetryOptions: S.optional(SplunkRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  BufferingHints: S.optional(SplunkBufferingHints),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class SnowflakeDestinationDescription extends S.Class<SnowflakeDestinationDescription>(
  "SnowflakeDestinationDescription",
)({
  AccountUrl: S.optional(S.String),
  User: S.optional(S.String),
  Database: S.optional(S.String),
  Schema: S.optional(S.String),
  Table: S.optional(S.String),
  SnowflakeRoleConfiguration: S.optional(SnowflakeRoleConfiguration),
  DataLoadingOption: S.optional(S.String),
  MetaDataColumnName: S.optional(S.String),
  ContentColumnName: S.optional(S.String),
  SnowflakeVpcConfiguration: S.optional(SnowflakeVpcConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.optional(S.String),
  RetryOptions: S.optional(SnowflakeRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
  BufferingHints: S.optional(SnowflakeBufferingHints),
}) {}
export class AmazonOpenSearchServerlessDestinationDescription extends S.Class<AmazonOpenSearchServerlessDestinationDescription>(
  "AmazonOpenSearchServerlessDestinationDescription",
)({
  RoleARN: S.optional(S.String),
  CollectionEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  BufferingHints: S.optional(AmazonOpenSearchServerlessBufferingHints),
  RetryOptions: S.optional(AmazonOpenSearchServerlessRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfigurationDescription: S.optional(VpcConfigurationDescription),
}) {}
export class IcebergDestinationDescription extends S.Class<IcebergDestinationDescription>(
  "IcebergDestinationDescription",
)({
  DestinationTableConfigurationList: S.optional(
    DestinationTableConfigurationList,
  ),
  SchemaEvolutionConfiguration: S.optional(SchemaEvolutionConfiguration),
  TableCreationConfiguration: S.optional(TableCreationConfiguration),
  BufferingHints: S.optional(BufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  RetryOptions: S.optional(RetryOptions),
  RoleARN: S.optional(S.String),
  AppendOnly: S.optional(S.Boolean),
  CatalogConfiguration: S.optional(CatalogConfiguration),
  S3DestinationDescription: S.optional(S3DestinationDescription),
}) {}
export class DatabaseSnapshotInfo extends S.Class<DatabaseSnapshotInfo>(
  "DatabaseSnapshotInfo",
)({
  Id: S.String,
  Table: S.String,
  RequestTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RequestedBy: S.String,
  Status: S.String,
  FailureDescription: S.optional(FailureDescription),
}) {}
export const DatabaseSnapshotInfoList = S.Array(DatabaseSnapshotInfo);
export class HttpEndpointDescription extends S.Class<HttpEndpointDescription>(
  "HttpEndpointDescription",
)({ Url: S.optional(S.String), Name: S.optional(S.String) }) {}
export class IcebergDestinationConfiguration extends S.Class<IcebergDestinationConfiguration>(
  "IcebergDestinationConfiguration",
)({
  DestinationTableConfigurationList: S.optional(
    DestinationTableConfigurationList,
  ),
  SchemaEvolutionConfiguration: S.optional(SchemaEvolutionConfiguration),
  TableCreationConfiguration: S.optional(TableCreationConfiguration),
  BufferingHints: S.optional(BufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  RetryOptions: S.optional(RetryOptions),
  RoleARN: S.String,
  AppendOnly: S.optional(S.Boolean),
  CatalogConfiguration: CatalogConfiguration,
  S3Configuration: S3DestinationConfiguration,
}) {}
export class DatabaseSourceDescription extends S.Class<DatabaseSourceDescription>(
  "DatabaseSourceDescription",
)({
  Type: S.optional(S.String),
  Endpoint: S.optional(S.String),
  Port: S.optional(S.Number),
  SSLMode: S.optional(S.String),
  Databases: S.optional(DatabaseList),
  Tables: S.optional(DatabaseTableList),
  Columns: S.optional(DatabaseColumnList),
  SurrogateKeys: S.optional(DatabaseColumnIncludeOrExcludeList),
  SnapshotWatermarkTable: S.optional(S.String),
  SnapshotInfo: S.optional(DatabaseSnapshotInfoList),
  DatabaseSourceAuthenticationConfiguration: S.optional(
    DatabaseSourceAuthenticationConfiguration,
  ),
  DatabaseSourceVPCConfiguration: S.optional(DatabaseSourceVPCConfiguration),
}) {}
export class ElasticsearchDestinationDescription extends S.Class<ElasticsearchDestinationDescription>(
  "ElasticsearchDestinationDescription",
)({
  RoleARN: S.optional(S.String),
  DomainARN: S.optional(S.String),
  ClusterEndpoint: S.optional(S.String),
  IndexName: S.optional(S.String),
  TypeName: S.optional(S.String),
  IndexRotationPeriod: S.optional(S.String),
  BufferingHints: S.optional(ElasticsearchBufferingHints),
  RetryOptions: S.optional(ElasticsearchRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  VpcConfigurationDescription: S.optional(VpcConfigurationDescription),
  DocumentIdOptions: S.optional(DocumentIdOptions),
}) {}
export class HttpEndpointDestinationDescription extends S.Class<HttpEndpointDestinationDescription>(
  "HttpEndpointDestinationDescription",
)({
  EndpointConfiguration: S.optional(HttpEndpointDescription),
  BufferingHints: S.optional(HttpEndpointBufferingHints),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  RequestConfiguration: S.optional(HttpEndpointRequestConfiguration),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  RoleARN: S.optional(S.String),
  RetryOptions: S.optional(HttpEndpointRetryOptions),
  S3BackupMode: S.optional(S.String),
  S3DestinationDescription: S.optional(S3DestinationDescription),
  SecretsManagerConfiguration: S.optional(SecretsManagerConfiguration),
}) {}
export class SourceDescription extends S.Class<SourceDescription>(
  "SourceDescription",
)({
  DirectPutSourceDescription: S.optional(DirectPutSourceDescription),
  KinesisStreamSourceDescription: S.optional(KinesisStreamSourceDescription),
  MSKSourceDescription: S.optional(MSKSourceDescription),
  DatabaseSourceDescription: S.optional(DatabaseSourceDescription),
}) {}
export class DestinationDescription extends S.Class<DestinationDescription>(
  "DestinationDescription",
)({
  DestinationId: S.String,
  S3DestinationDescription: S.optional(S3DestinationDescription),
  ExtendedS3DestinationDescription: S.optional(
    ExtendedS3DestinationDescription,
  ),
  RedshiftDestinationDescription: S.optional(RedshiftDestinationDescription),
  ElasticsearchDestinationDescription: S.optional(
    ElasticsearchDestinationDescription,
  ),
  AmazonopensearchserviceDestinationDescription: S.optional(
    AmazonopensearchserviceDestinationDescription,
  ),
  SplunkDestinationDescription: S.optional(SplunkDestinationDescription),
  HttpEndpointDestinationDescription: S.optional(
    HttpEndpointDestinationDescription,
  ),
  SnowflakeDestinationDescription: S.optional(SnowflakeDestinationDescription),
  AmazonOpenSearchServerlessDestinationDescription: S.optional(
    AmazonOpenSearchServerlessDestinationDescription,
  ),
  IcebergDestinationDescription: S.optional(IcebergDestinationDescription),
}) {}
export const DestinationDescriptionList = S.Array(DestinationDescription);
export class DeliveryStreamDescription extends S.Class<DeliveryStreamDescription>(
  "DeliveryStreamDescription",
)({
  DeliveryStreamName: S.String,
  DeliveryStreamARN: S.String,
  DeliveryStreamStatus: S.String,
  FailureDescription: S.optional(FailureDescription),
  DeliveryStreamEncryptionConfiguration: S.optional(
    DeliveryStreamEncryptionConfiguration,
  ),
  DeliveryStreamType: S.String,
  VersionId: S.String,
  CreateTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Source: S.optional(SourceDescription),
  Destinations: DestinationDescriptionList,
  HasMoreDestinations: S.Boolean,
}) {}
export class DescribeDeliveryStreamOutput extends S.Class<DescribeDeliveryStreamOutput>(
  "DescribeDeliveryStreamOutput",
)({ DeliveryStreamDescription: DeliveryStreamDescription }, ns) {}
export class ExtendedS3DestinationConfiguration extends S.Class<ExtendedS3DestinationConfiguration>(
  "ExtendedS3DestinationConfiguration",
)({
  RoleARN: S.String,
  BucketARN: S.String,
  Prefix: S.optional(S.String),
  ErrorOutputPrefix: S.optional(S.String),
  BufferingHints: S.optional(BufferingHints),
  CompressionFormat: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  CloudWatchLoggingOptions: S.optional(CloudWatchLoggingOptions),
  ProcessingConfiguration: S.optional(ProcessingConfiguration),
  S3BackupMode: S.optional(S.String),
  S3BackupConfiguration: S.optional(S3DestinationConfiguration),
  DataFormatConversionConfiguration: S.optional(
    DataFormatConversionConfiguration,
  ),
  DynamicPartitioningConfiguration: S.optional(
    DynamicPartitioningConfiguration,
  ),
  FileExtension: S.optional(S.String),
  CustomTimeZone: S.optional(S.String),
}) {}
export class CreateDeliveryStreamInput extends S.Class<CreateDeliveryStreamInput>(
  "CreateDeliveryStreamInput",
)(
  {
    DeliveryStreamName: S.String,
    DeliveryStreamType: S.optional(S.String),
    DirectPutSourceConfiguration: S.optional(DirectPutSourceConfiguration),
    KinesisStreamSourceConfiguration: S.optional(
      KinesisStreamSourceConfiguration,
    ),
    DeliveryStreamEncryptionConfigurationInput: S.optional(
      DeliveryStreamEncryptionConfigurationInput,
    ),
    S3DestinationConfiguration: S.optional(S3DestinationConfiguration),
    ExtendedS3DestinationConfiguration: S.optional(
      ExtendedS3DestinationConfiguration,
    ),
    RedshiftDestinationConfiguration: S.optional(
      RedshiftDestinationConfiguration,
    ),
    ElasticsearchDestinationConfiguration: S.optional(
      ElasticsearchDestinationConfiguration,
    ),
    AmazonopensearchserviceDestinationConfiguration: S.optional(
      AmazonopensearchserviceDestinationConfiguration,
    ),
    SplunkDestinationConfiguration: S.optional(SplunkDestinationConfiguration),
    HttpEndpointDestinationConfiguration: S.optional(
      HttpEndpointDestinationConfiguration,
    ),
    Tags: S.optional(TagDeliveryStreamInputTagList),
    AmazonOpenSearchServerlessDestinationConfiguration: S.optional(
      AmazonOpenSearchServerlessDestinationConfiguration,
    ),
    MSKSourceConfiguration: S.optional(MSKSourceConfiguration),
    SnowflakeDestinationConfiguration: S.optional(
      SnowflakeDestinationConfiguration,
    ),
    IcebergDestinationConfiguration: S.optional(
      IcebergDestinationConfiguration,
    ),
    DatabaseSourceConfiguration: S.optional(DatabaseSourceConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDeliveryStreamOutput extends S.Class<CreateDeliveryStreamOutput>(
  "CreateDeliveryStreamOutput",
)({ DeliveryStreamARN: S.optional(S.String) }, ns) {}

//# Errors
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
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
export class InvalidKMSResourceException extends S.TaggedError<InvalidKMSResourceException>()(
  "InvalidKMSResourceException",
  {},
) {}
export class InvalidSourceException extends S.TaggedError<InvalidSourceException>()(
  "InvalidSourceException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}

//# Operations
/**
 * Removes tags from the specified Firehose stream. Removed tags are deleted, and you
 * can't recover them after this operation successfully completes.
 *
 * If you specify a tag that doesn't exist, the operation ignores it.
 *
 * This operation has a limit of five transactions per second per account.
 */
export const untagDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagDeliveryStreamInput,
  output: UntagDeliveryStreamOutput,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a Firehose stream and its data.
 *
 * You can delete a Firehose stream only if it is in one of the following states:
 * `ACTIVE`, `DELETING`, `CREATING_FAILED`, or
 * `DELETING_FAILED`. You can't delete a Firehose stream that is in the
 * `CREATING` state. To check the state of a Firehose stream, use DescribeDeliveryStream.
 *
 * DeleteDeliveryStream is an asynchronous API. When an API request to DeleteDeliveryStream succeeds, the Firehose stream is marked for deletion, and it goes into the
 * `DELETING` state.While the Firehose stream is in the `DELETING` state, the service might
 * continue to accept records, but it doesn't make any guarantees with respect to delivering
 * the data. Therefore, as a best practice, first stop any applications that are sending
 * records before you delete a Firehose stream.
 *
 * Removal of a Firehose stream that is in the `DELETING` state is a low priority operation for the service. A stream may remain in the
 * `DELETING` state for several minutes. Therefore, as a best practice, applications should not wait for streams in the `DELETING` state
 * to be removed.
 */
export const deleteDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeliveryStreamInput,
    output: DeleteDeliveryStreamOutput,
    errors: [ResourceInUseException, ResourceNotFoundException],
  }),
);
/**
 * Lists your Firehose streams in alphabetical order of their names.
 *
 * The number of Firehose streams might be too large to return using a single call to
 * `ListDeliveryStreams`. You can limit the number of Firehose streams returned,
 * using the `Limit` parameter. To determine whether there are more delivery
 * streams to list, check the value of `HasMoreDeliveryStreams` in the output. If
 * there are more Firehose streams to list, you can request them by calling this operation
 * again and setting the `ExclusiveStartDeliveryStreamName` parameter to the name
 * of the last Firehose stream returned in the last call.
 */
export const listDeliveryStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeliveryStreamsInput,
  output: ListDeliveryStreamsOutput,
  errors: [],
}));
/**
 * Lists the tags for the specified Firehose stream. This operation has a limit of five
 * transactions per second per account.
 */
export const listTagsForDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTagsForDeliveryStreamInput,
    output: ListTagsForDeliveryStreamOutput,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disables server-side encryption (SSE) for the Firehose stream.
 *
 * This operation is asynchronous. It returns immediately. When you invoke it, Firehose first sets the encryption status of the stream to `DISABLING`, and then
 * to `DISABLED`. You can continue to read and write data to your stream while its
 * status is `DISABLING`. It can take up to 5 seconds after the encryption status
 * changes to `DISABLED` before all records written to the Firehose stream are no
 * longer subject to encryption. To find out whether a record or a batch of records was
 * encrypted, check the response elements PutRecordOutput$Encrypted and
 * PutRecordBatchOutput$Encrypted, respectively.
 *
 * To check the encryption state of a Firehose stream, use DescribeDeliveryStream.
 *
 * If SSE is enabled using a customer managed CMK and then you invoke
 * `StopDeliveryStreamEncryption`, Firehose schedules the related
 * KMS grant for retirement and then retires it after it ensures that it is finished
 * delivering records to the destination.
 *
 * The `StartDeliveryStreamEncryption` and
 * `StopDeliveryStreamEncryption` operations have a combined limit of 25 calls
 * per Firehose stream per 24 hours. For example, you reach the limit if you call
 * `StartDeliveryStreamEncryption` 13 times and
 * `StopDeliveryStreamEncryption` 12 times for the same Firehose stream in a
 * 24-hour period.
 */
export const stopDeliveryStreamEncryption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopDeliveryStreamEncryptionInput,
    output: StopDeliveryStreamEncryptionOutput,
    errors: [
      InvalidArgumentException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Adds or updates tags for the specified Firehose stream. A tag is a key-value pair
 * that you can define and assign to Amazon Web Services resources. If you specify a tag that
 * already exists, the tag value is replaced with the value that you specify in the request.
 * Tags are metadata. For example, you can add friendly names and descriptions or other types
 * of information that can help you distinguish the Firehose stream. For more information
 * about tags, see Using Cost Allocation
 * Tags in the Amazon Web Services Billing and Cost Management User
 * Guide.
 *
 * Each Firehose stream can have up to 50 tags.
 *
 * This operation has a limit of five transactions per second per account.
 */
export const tagDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagDeliveryStreamInput,
  output: TagDeliveryStreamOutput,
  errors: [
    InvalidArgumentException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables server-side encryption (SSE) for the Firehose stream.
 *
 * This operation is asynchronous. It returns immediately. When you invoke it, Firehose first sets the encryption status of the stream to `ENABLING`, and then
 * to `ENABLED`. The encryption status of a Firehose stream is the
 * `Status` property in DeliveryStreamEncryptionConfiguration.
 * If the operation fails, the encryption status changes to `ENABLING_FAILED`. You
 * can continue to read and write data to your Firehose stream while the encryption status is
 * `ENABLING`, but the data is not encrypted. It can take up to 5 seconds after
 * the encryption status changes to `ENABLED` before all records written to the
 * Firehose stream are encrypted. To find out whether a record or a batch of records was
 * encrypted, check the response elements PutRecordOutput$Encrypted and
 * PutRecordBatchOutput$Encrypted, respectively.
 *
 * To check the encryption status of a Firehose stream, use DescribeDeliveryStream.
 *
 * Even if encryption is currently enabled for a Firehose stream, you can still invoke this
 * operation on it to change the ARN of the CMK or both its type and ARN. If you invoke this
 * method to change the CMK, and the old CMK is of type `CUSTOMER_MANAGED_CMK`,
 * Firehose schedules the grant it had on the old CMK for retirement. If the new
 * CMK is of type `CUSTOMER_MANAGED_CMK`, Firehose creates a grant
 * that enables it to use the new CMK to encrypt and decrypt data and to manage the
 * grant.
 *
 * For the KMS grant creation to be successful, the Firehose API operations
 * `StartDeliveryStreamEncryption` and `CreateDeliveryStream` should
 * not be called with session credentials that are more than 6 hours old.
 *
 * If a Firehose stream already has encryption enabled and then you invoke this operation
 * to change the ARN of the CMK or both its type and ARN and you get
 * `ENABLING_FAILED`, this only means that the attempt to change the CMK failed.
 * In this case, encryption remains enabled with the old CMK.
 *
 * If the encryption status of your Firehose stream is `ENABLING_FAILED`, you
 * can invoke this operation again with a valid CMK. The CMK must be enabled and the key
 * policy mustn't explicitly deny the permission for Firehose to invoke KMS
 * encrypt and decrypt operations.
 *
 * You can enable SSE for a Firehose stream only if it's a Firehose stream that uses
 * `DirectPut` as its source.
 *
 * The `StartDeliveryStreamEncryption` and
 * `StopDeliveryStreamEncryption` operations have a combined limit of 25 calls
 * per Firehose stream per 24 hours. For example, you reach the limit if you call
 * `StartDeliveryStreamEncryption` 13 times and
 * `StopDeliveryStreamEncryption` 12 times for the same Firehose stream in a
 * 24-hour period.
 */
export const startDeliveryStreamEncryption =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDeliveryStreamEncryptionInput,
    output: StartDeliveryStreamEncryptionOutput,
    errors: [
      InvalidArgumentException,
      InvalidKMSResourceException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Updates the specified destination of the specified Firehose stream.
 *
 * Use this operation to change the destination type (for example, to replace the Amazon
 * S3 destination with Amazon Redshift) or change the parameters associated with a destination
 * (for example, to change the bucket name of the Amazon S3 destination). The update might not
 * occur immediately. The target Firehose stream remains active while the configurations are
 * updated, so data writes to the Firehose stream can continue during this process. The
 * updated configurations are usually effective within a few minutes.
 *
 * Switching between Amazon OpenSearch Service and other services is not supported. For
 * an Amazon OpenSearch Service destination, you can only update to another Amazon OpenSearch
 * Service destination.
 *
 * If the destination type is the same, Firehose merges the configuration
 * parameters specified with the destination configuration that already exists on the delivery
 * stream. If any of the parameters are not specified in the call, the existing values are
 * retained. For example, in the Amazon S3 destination, if EncryptionConfiguration is not specified, then the existing
 * `EncryptionConfiguration` is maintained on the destination.
 *
 * If the destination type is not the same, for example, changing the destination from
 * Amazon S3 to Amazon Redshift, Firehose does not merge any parameters. In this
 * case, all parameters must be specified.
 *
 * Firehose uses `CurrentDeliveryStreamVersionId` to avoid race
 * conditions and conflicting merges. This is a required field, and the service updates the
 * configuration only if the existing configuration has a version ID that matches. After the
 * update is applied successfully, the version ID is updated, and can be retrieved using DescribeDeliveryStream. Use the new version ID to set
 * `CurrentDeliveryStreamVersionId` in the next call.
 */
export const updateDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDestinationInput,
  output: UpdateDestinationOutput,
  errors: [
    ConcurrentModificationException,
    InvalidArgumentException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Writes a single data record into an Firehose stream. To
 * write multiple data records into a Firehose stream, use PutRecordBatch.
 * Applications using these operations are referred to as producers.
 *
 * By default, each Firehose stream can take in up to 2,000 transactions per second,
 * 5,000 records per second, or 5 MB per second. If you use PutRecord and
 * PutRecordBatch, the limits are an aggregate across these two
 * operations for each Firehose stream. For more information about limits and how to request
 * an increase, see Amazon
 * Firehose Limits.
 *
 * Firehose accumulates and publishes a particular metric for a customer account in one minute intervals. It is possible that the bursts of incoming bytes/records ingested to a Firehose stream last only for a few seconds. Due to this, the actual spikes in the traffic might not be fully visible in the customer's 1 minute CloudWatch metrics.
 *
 * You must specify the name of the Firehose stream and the data record when using PutRecord. The data record consists of a data blob that can be up to 1,000
 * KiB in size, and any kind of data. For example, it can be a segment from a log file,
 * geographic location data, website clickstream data, and so on.
 *
 * For multi record de-aggregation, you can not put more than 500 records even if the
 * data blob length is less than 1000 KiB. If you include more than 500 records, the request
 * succeeds but the record de-aggregation doesn't work as expected and transformation lambda
 * is invoked with the complete base64 encoded data blob instead of de-aggregated base64
 * decoded records.
 *
 * Firehose buffers records before delivering them to the destination. To
 * disambiguate the data blobs at the destination, a common solution is to use delimiters in
 * the data, such as a newline (`\n`) or some other character unique within the
 * data. This allows the consumer application to parse individual data items when reading the
 * data from the destination.
 *
 * The `PutRecord` operation returns a `RecordId`, which is a
 * unique string assigned to each record. Producer applications can use this ID for purposes
 * such as auditability and investigation.
 *
 * If the `PutRecord` operation throws a
 * `ServiceUnavailableException`, the API is automatically reinvoked (retried) 3
 * times. If the exception persists, it is possible that the throughput limits have been
 * exceeded for the Firehose stream.
 *
 * Re-invoking the Put API operations (for example, PutRecord and PutRecordBatch) can
 * result in data duplicates. For larger data assets, allow for a longer time out before
 * retrying Put API operations.
 *
 * Data records sent to Firehose are stored for 24 hours from the time they
 * are added to a Firehose stream as it tries to send the records to the destination. If the
 * destination is unreachable for more than 24 hours, the data is no longer
 * available.
 *
 * Don't concatenate two or more base64 strings to form the data fields of your records.
 * Instead, concatenate the raw data, then perform base64 encoding.
 */
export const putRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordInput,
  output: PutRecordOutput,
  errors: [
    InvalidArgumentException,
    InvalidKMSResourceException,
    InvalidSourceException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Writes multiple data records into a Firehose stream in a single call, which can
 * achieve higher throughput per producer than when writing single records. To write single
 * data records into a Firehose stream, use PutRecord. Applications using
 * these operations are referred to as producers.
 *
 * Firehose accumulates and publishes a particular metric for a customer account in one minute intervals. It is possible that the bursts of incoming bytes/records ingested to a Firehose stream last only for a few seconds. Due to this, the actual spikes in the traffic might not be fully visible in the customer's 1 minute CloudWatch metrics.
 *
 * For information about service quota, see Amazon Firehose
 * Quota.
 *
 * Each PutRecordBatch request supports up to 500 records. Each record
 * in the request can be as large as 1,000 KB (before base64 encoding), up to a limit of 4 MB
 * for the entire request. These limits cannot be changed.
 *
 * You must specify the name of the Firehose stream and the data record when using PutRecord. The data record consists of a data blob that can be up to 1,000
 * KB in size, and any kind of data. For example, it could be a segment from a log file,
 * geographic location data, website clickstream data, and so on.
 *
 * For multi record de-aggregation, you can not put more than 500 records even if the
 * data blob length is less than 1000 KiB. If you include more than 500 records, the request
 * succeeds but the record de-aggregation doesn't work as expected and transformation lambda
 * is invoked with the complete base64 encoded data blob instead of de-aggregated base64
 * decoded records.
 *
 * Firehose buffers records before delivering them to the destination. To
 * disambiguate the data blobs at the destination, a common solution is to use delimiters in
 * the data, such as a newline (`\n`) or some other character unique within the
 * data. This allows the consumer application to parse individual data items when reading the
 * data from the destination.
 *
 * The PutRecordBatch response includes a count of failed records,
 * `FailedPutCount`, and an array of responses, `RequestResponses`.
 * Even if the PutRecordBatch call succeeds, the value of
 * `FailedPutCount` may be greater than 0, indicating that there are records for
 * which the operation didn't succeed. Each entry in the `RequestResponses` array
 * provides additional information about the processed record. It directly correlates with a
 * record in the request array using the same ordering, from the top to the bottom. The
 * response array always includes the same number of records as the request array.
 * `RequestResponses` includes both successfully and unsuccessfully processed
 * records. Firehose tries to process all records in each PutRecordBatch request. A single record failure does not stop the processing
 * of subsequent records.
 *
 * A successfully processed record includes a `RecordId` value, which is
 * unique for the record. An unsuccessfully processed record includes `ErrorCode`
 * and `ErrorMessage` values. `ErrorCode` reflects the type of error,
 * and is one of the following values: `ServiceUnavailableException` or
 * `InternalFailure`. `ErrorMessage` provides more detailed
 * information about the error.
 *
 * If there is an internal server error or a timeout, the write might have completed or
 * it might have failed. If `FailedPutCount` is greater than 0, retry the request,
 * resending only those records that might have failed processing. This minimizes the possible
 * duplicate records and also reduces the total bytes sent (and corresponding charges). We
 * recommend that you handle any duplicates at the destination.
 *
 * If PutRecordBatch throws `ServiceUnavailableException`,
 * the API is automatically reinvoked (retried) 3 times. If the exception persists, it is
 * possible that the throughput limits have been exceeded for the Firehose stream.
 *
 * Re-invoking the Put API operations (for example, PutRecord and PutRecordBatch) can
 * result in data duplicates. For larger data assets, allow for a longer time out before
 * retrying Put API operations.
 *
 * Data records sent to Firehose are stored for 24 hours from the time they
 * are added to a Firehose stream as it attempts to send the records to the destination. If
 * the destination is unreachable for more than 24 hours, the data is no longer
 * available.
 *
 * Don't concatenate two or more base64 strings to form the data fields of your records.
 * Instead, concatenate the raw data, then perform base64 encoding.
 */
export const putRecordBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecordBatchInput,
  output: PutRecordBatchOutput,
  errors: [
    InvalidArgumentException,
    InvalidKMSResourceException,
    InvalidSourceException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes the specified Firehose stream and its status. For example, after your
 * Firehose stream is created, call `DescribeDeliveryStream` to see whether the
 * Firehose stream is `ACTIVE` and therefore ready for data to be sent to it.
 *
 * If the status of a Firehose stream is `CREATING_FAILED`, this status
 * doesn't change, and you can't invoke CreateDeliveryStream again on it.
 * However, you can invoke the DeleteDeliveryStream operation to delete it.
 * If the status is `DELETING_FAILED`, you can force deletion by invoking DeleteDeliveryStream again but with DeleteDeliveryStreamInput$AllowForceDelete set to true.
 */
export const describeDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDeliveryStreamInput,
    output: DescribeDeliveryStreamOutput,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * Creates a Firehose stream.
 *
 * By default, you can create up to 5,000 Firehose streams per Amazon Web Services
 * Region.
 *
 * This is an asynchronous operation that immediately returns. The initial status of the
 * Firehose stream is `CREATING`. After the Firehose stream is created, its status
 * is `ACTIVE` and it now accepts data. If the Firehose stream creation fails, the
 * status transitions to `CREATING_FAILED`. Attempts to send data to a delivery
 * stream that is not in the `ACTIVE` state cause an exception. To check the state
 * of a Firehose stream, use DescribeDeliveryStream.
 *
 * If the status of a Firehose stream is `CREATING_FAILED`, this status
 * doesn't change, and you can't invoke `CreateDeliveryStream` again on it.
 * However, you can invoke the DeleteDeliveryStream operation to delete
 * it.
 *
 * A Firehose stream can be configured to receive records directly
 * from providers using PutRecord or PutRecordBatch, or it
 * can be configured to use an existing Kinesis stream as its source. To specify a Kinesis
 * data stream as input, set the `DeliveryStreamType` parameter to
 * `KinesisStreamAsSource`, and provide the Kinesis stream Amazon Resource Name
 * (ARN) and role ARN in the `KinesisStreamSourceConfiguration`
 * parameter.
 *
 * To create a Firehose stream with server-side encryption (SSE) enabled, include DeliveryStreamEncryptionConfigurationInput in your request. This is
 * optional. You can also invoke StartDeliveryStreamEncryption to turn on
 * SSE for an existing Firehose stream that doesn't have SSE enabled.
 *
 * A Firehose stream is configured with a single destination, such as Amazon Simple
 * Storage Service (Amazon S3), Amazon Redshift, Amazon OpenSearch Service, Amazon OpenSearch
 * Serverless, Splunk, and any custom HTTP endpoint or HTTP endpoints owned by or supported by
 * third-party service providers, including Datadog, Dynatrace, LogicMonitor, MongoDB, New
 * Relic, and Sumo Logic. You must specify only one of the following destination configuration
 * parameters: `ExtendedS3DestinationConfiguration`,
 * `S3DestinationConfiguration`,
 * `ElasticsearchDestinationConfiguration`,
 * `RedshiftDestinationConfiguration`, or
 * `SplunkDestinationConfiguration`.
 *
 * When you specify `S3DestinationConfiguration`, you can also provide the
 * following optional values: BufferingHints, `EncryptionConfiguration`, and
 * `CompressionFormat`. By default, if no `BufferingHints` value is
 * provided, Firehose buffers data up to 5 MB or for 5 minutes, whichever
 * condition is satisfied first. `BufferingHints` is a hint, so there are some
 * cases where the service cannot adhere to these conditions strictly. For example, record
 * boundaries might be such that the size is a little over or under the configured buffering
 * size. By default, no encryption is performed. We strongly recommend that you enable
 * encryption to ensure secure data storage in Amazon S3.
 *
 * A few notes about Amazon Redshift as a destination:
 *
 * - An Amazon Redshift destination requires an S3 bucket as intermediate location.
 * Firehose first delivers data to Amazon S3 and then uses
 * `COPY` syntax to load data into an Amazon Redshift table. This is
 * specified in the `RedshiftDestinationConfiguration.S3Configuration`
 * parameter.
 *
 * - The compression formats `SNAPPY` or `ZIP` cannot be
 * specified in `RedshiftDestinationConfiguration.S3Configuration` because
 * the Amazon Redshift `COPY` operation that reads from the S3 bucket doesn't
 * support these compression formats.
 *
 * - We strongly recommend that you use the user name and password you provide
 * exclusively with Firehose, and that the permissions for the account are
 * restricted for Amazon Redshift `INSERT` permissions.
 *
 * Firehose assumes the IAM role that is configured as part of the
 * destination. The role should allow the Firehose principal to assume the role,
 * and the role should have permissions that allow the service to deliver the data. For more
 * information, see Grant Firehose Access to an Amazon S3 Destination in the *Amazon Firehose Developer Guide*.
 */
export const createDeliveryStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDeliveryStreamInput,
    output: CreateDeliveryStreamOutput,
    errors: [
      InvalidArgumentException,
      InvalidKMSResourceException,
      LimitExceededException,
      ResourceInUseException,
    ],
  }),
);

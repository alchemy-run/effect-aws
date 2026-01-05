import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Comprehend",
  serviceShapeName: "Comprehend_20171127",
});
const auth = T.AwsAuthSigv4({ name: "comprehend" });
const ver = T.ServiceVersion("2017-11-27");
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
                        url: "https://comprehend-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://comprehend-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://comprehend.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://comprehend.{Region}.{PartitionResult#dnsSuffix}",
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
export const CustomerInputStringList = S.Array(S.String);
export const TargetEventTypes = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchDetectDominantLanguageRequest extends S.Class<BatchDetectDominantLanguageRequest>(
  "BatchDetectDominantLanguageRequest",
)(
  { TextList: CustomerInputStringList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDetectEntitiesRequest extends S.Class<BatchDetectEntitiesRequest>(
  "BatchDetectEntitiesRequest",
)(
  { TextList: CustomerInputStringList, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDetectKeyPhrasesRequest extends S.Class<BatchDetectKeyPhrasesRequest>(
  "BatchDetectKeyPhrasesRequest",
)(
  { TextList: CustomerInputStringList, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDetectSentimentRequest extends S.Class<BatchDetectSentimentRequest>(
  "BatchDetectSentimentRequest",
)(
  { TextList: CustomerInputStringList, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDetectSyntaxRequest extends S.Class<BatchDetectSyntaxRequest>(
  "BatchDetectSyntaxRequest",
)(
  { TextList: CustomerInputStringList, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDetectTargetedSentimentRequest extends S.Class<BatchDetectTargetedSentimentRequest>(
  "BatchDetectTargetedSentimentRequest",
)(
  { TextList: CustomerInputStringList, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ContainsPiiEntitiesRequest extends S.Class<ContainsPiiEntitiesRequest>(
  "ContainsPiiEntitiesRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateEndpointRequest extends S.Class<CreateEndpointRequest>(
  "CreateEndpointRequest",
)(
  {
    EndpointName: S.String,
    ModelArn: S.optional(S.String),
    DesiredInferenceUnits: S.Number,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
    DataAccessRoleArn: S.optional(S.String),
    FlywheelArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDocumentClassifierRequest extends S.Class<DeleteDocumentClassifierRequest>(
  "DeleteDocumentClassifierRequest",
)(
  { DocumentClassifierArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDocumentClassifierResponse extends S.Class<DeleteDocumentClassifierResponse>(
  "DeleteDocumentClassifierResponse",
)({}) {}
export class DeleteEndpointRequest extends S.Class<DeleteEndpointRequest>(
  "DeleteEndpointRequest",
)(
  { EndpointArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({}) {}
export class DeleteEntityRecognizerRequest extends S.Class<DeleteEntityRecognizerRequest>(
  "DeleteEntityRecognizerRequest",
)(
  { EntityRecognizerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEntityRecognizerResponse extends S.Class<DeleteEntityRecognizerResponse>(
  "DeleteEntityRecognizerResponse",
)({}) {}
export class DeleteFlywheelRequest extends S.Class<DeleteFlywheelRequest>(
  "DeleteFlywheelRequest",
)(
  { FlywheelArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFlywheelResponse extends S.Class<DeleteFlywheelResponse>(
  "DeleteFlywheelResponse",
)({}) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String, PolicyRevisionId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { DatasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDocumentClassificationJobRequest extends S.Class<DescribeDocumentClassificationJobRequest>(
  "DescribeDocumentClassificationJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDocumentClassifierRequest extends S.Class<DescribeDocumentClassifierRequest>(
  "DescribeDocumentClassifierRequest",
)(
  { DocumentClassifierArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDominantLanguageDetectionJobRequest extends S.Class<DescribeDominantLanguageDetectionJobRequest>(
  "DescribeDominantLanguageDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointRequest extends S.Class<DescribeEndpointRequest>(
  "DescribeEndpointRequest",
)(
  { EndpointArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntitiesDetectionJobRequest extends S.Class<DescribeEntitiesDetectionJobRequest>(
  "DescribeEntitiesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntityRecognizerRequest extends S.Class<DescribeEntityRecognizerRequest>(
  "DescribeEntityRecognizerRequest",
)(
  { EntityRecognizerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsDetectionJobRequest extends S.Class<DescribeEventsDetectionJobRequest>(
  "DescribeEventsDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFlywheelRequest extends S.Class<DescribeFlywheelRequest>(
  "DescribeFlywheelRequest",
)(
  { FlywheelArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFlywheelIterationRequest extends S.Class<DescribeFlywheelIterationRequest>(
  "DescribeFlywheelIterationRequest",
)(
  { FlywheelArn: S.String, FlywheelIterationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeKeyPhrasesDetectionJobRequest extends S.Class<DescribeKeyPhrasesDetectionJobRequest>(
  "DescribeKeyPhrasesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePiiEntitiesDetectionJobRequest extends S.Class<DescribePiiEntitiesDetectionJobRequest>(
  "DescribePiiEntitiesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResourcePolicyRequest extends S.Class<DescribeResourcePolicyRequest>(
  "DescribeResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSentimentDetectionJobRequest extends S.Class<DescribeSentimentDetectionJobRequest>(
  "DescribeSentimentDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTargetedSentimentDetectionJobRequest extends S.Class<DescribeTargetedSentimentDetectionJobRequest>(
  "DescribeTargetedSentimentDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTopicsDetectionJobRequest extends S.Class<DescribeTopicsDetectionJobRequest>(
  "DescribeTopicsDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectDominantLanguageRequest extends S.Class<DetectDominantLanguageRequest>(
  "DetectDominantLanguageRequest",
)(
  { Text: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ListOfDocumentReadFeatureTypes = S.Array(S.String);
export class DocumentReaderConfig extends S.Class<DocumentReaderConfig>(
  "DocumentReaderConfig",
)({
  DocumentReadAction: S.String,
  DocumentReadMode: S.optional(S.String),
  FeatureTypes: S.optional(ListOfDocumentReadFeatureTypes),
}) {}
export class DetectEntitiesRequest extends S.Class<DetectEntitiesRequest>(
  "DetectEntitiesRequest",
)(
  {
    Text: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    EndpointArn: S.optional(S.String),
    Bytes: S.optional(T.Blob),
    DocumentReaderConfig: S.optional(DocumentReaderConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectKeyPhrasesRequest extends S.Class<DetectKeyPhrasesRequest>(
  "DetectKeyPhrasesRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectPiiEntitiesRequest extends S.Class<DetectPiiEntitiesRequest>(
  "DetectPiiEntitiesRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectSentimentRequest extends S.Class<DetectSentimentRequest>(
  "DetectSentimentRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectSyntaxRequest extends S.Class<DetectSyntaxRequest>(
  "DetectSyntaxRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectTargetedSentimentRequest extends S.Class<DetectTargetedSentimentRequest>(
  "DetectTargetedSentimentRequest",
)(
  { Text: S.String, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportModelRequest extends S.Class<ImportModelRequest>(
  "ImportModelRequest",
)(
  {
    SourceModelArn: S.String,
    ModelName: S.optional(S.String),
    VersionName: S.optional(S.String),
    ModelKmsKeyId: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDocumentClassifierSummariesRequest extends S.Class<ListDocumentClassifierSummariesRequest>(
  "ListDocumentClassifierSummariesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntityRecognizerSummariesRequest extends S.Class<ListEntityRecognizerSummariesRequest>(
  "ListEntityRecognizerSummariesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    ResourceArn: S.String,
    ResourcePolicy: S.String,
    PolicyRevisionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({
  S3Uri: S.String,
  InputFormat: S.optional(S.String),
  DocumentReaderConfig: S.optional(DocumentReaderConfig),
}) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export const SecurityGroupIds = S.Array(S.String);
export const Subnets = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  SecurityGroupIds: SecurityGroupIds,
  Subnets: Subnets,
}) {}
export class StartDominantLanguageDetectionJobRequest extends S.Class<StartDominantLanguageDetectionJobRequest>(
  "StartDominantLanguageDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEntitiesDetectionJobRequest extends S.Class<StartEntitiesDetectionJobRequest>(
  "StartEntitiesDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    EntityRecognizerArn: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
    FlywheelArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEventsDetectionJobRequest extends S.Class<StartEventsDetectionJobRequest>(
  "StartEventsDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    TargetEventTypes: TargetEventTypes,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFlywheelIterationRequest extends S.Class<StartFlywheelIterationRequest>(
  "StartFlywheelIterationRequest",
)(
  { FlywheelArn: S.String, ClientRequestToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartKeyPhrasesDetectionJobRequest extends S.Class<StartKeyPhrasesDetectionJobRequest>(
  "StartKeyPhrasesDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSentimentDetectionJobRequest extends S.Class<StartSentimentDetectionJobRequest>(
  "StartSentimentDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTargetedSentimentDetectionJobRequest extends S.Class<StartTargetedSentimentDetectionJobRequest>(
  "StartTargetedSentimentDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTopicsDetectionJobRequest extends S.Class<StartTopicsDetectionJobRequest>(
  "StartTopicsDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    NumberOfTopics: S.optional(S.Number),
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDominantLanguageDetectionJobRequest extends S.Class<StopDominantLanguageDetectionJobRequest>(
  "StopDominantLanguageDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEntitiesDetectionJobRequest extends S.Class<StopEntitiesDetectionJobRequest>(
  "StopEntitiesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEventsDetectionJobRequest extends S.Class<StopEventsDetectionJobRequest>(
  "StopEventsDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopKeyPhrasesDetectionJobRequest extends S.Class<StopKeyPhrasesDetectionJobRequest>(
  "StopKeyPhrasesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopPiiEntitiesDetectionJobRequest extends S.Class<StopPiiEntitiesDetectionJobRequest>(
  "StopPiiEntitiesDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopSentimentDetectionJobRequest extends S.Class<StopSentimentDetectionJobRequest>(
  "StopSentimentDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTargetedSentimentDetectionJobRequest extends S.Class<StopTargetedSentimentDetectionJobRequest>(
  "StopTargetedSentimentDetectionJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTrainingDocumentClassifierRequest extends S.Class<StopTrainingDocumentClassifierRequest>(
  "StopTrainingDocumentClassifierRequest",
)(
  { DocumentClassifierArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTrainingDocumentClassifierResponse extends S.Class<StopTrainingDocumentClassifierResponse>(
  "StopTrainingDocumentClassifierResponse",
)({}) {}
export class StopTrainingEntityRecognizerRequest extends S.Class<StopTrainingEntityRecognizerRequest>(
  "StopTrainingEntityRecognizerRequest",
)(
  { EntityRecognizerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTrainingEntityRecognizerResponse extends S.Class<StopTrainingEntityRecognizerResponse>(
  "StopTrainingEntityRecognizerResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateEndpointRequest extends S.Class<UpdateEndpointRequest>(
  "UpdateEndpointRequest",
)(
  {
    EndpointArn: S.String,
    DesiredModelArn: S.optional(S.String),
    DesiredInferenceUnits: S.optional(S.Number),
    DesiredDataAccessRoleArn: S.optional(S.String),
    FlywheelArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AttributeNamesList = S.Array(S.String);
export class AugmentedManifestsListItem extends S.Class<AugmentedManifestsListItem>(
  "AugmentedManifestsListItem",
)({
  S3Uri: S.String,
  Split: S.optional(S.String),
  AttributeNames: AttributeNamesList,
  AnnotationDataS3Uri: S.optional(S.String),
  SourceDocumentsS3Uri: S.optional(S.String),
  DocumentType: S.optional(S.String),
}) {}
export const EntityRecognizerAugmentedManifestsList = S.Array(
  AugmentedManifestsListItem,
);
export const ListOfPiiEntityTypes = S.Array(S.String);
export class DocumentClassifierOutputDataConfig extends S.Class<DocumentClassifierOutputDataConfig>(
  "DocumentClassifierOutputDataConfig",
)({
  S3Uri: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  FlywheelStatsS3Prefix: S.optional(S.String),
}) {}
export class DataSecurityConfig extends S.Class<DataSecurityConfig>(
  "DataSecurityConfig",
)({
  ModelKmsKeyId: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  DataLakeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class TextSegment extends S.Class<TextSegment>("TextSegment")({
  Text: S.String,
}) {}
export const ListOfTextSegments = S.Array(TextSegment);
export class DatasetFilter extends S.Class<DatasetFilter>("DatasetFilter")({
  Status: S.optional(S.String),
  DatasetType: S.optional(S.String),
  CreationTimeAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreationTimeBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DocumentClassificationJobFilter extends S.Class<DocumentClassificationJobFilter>(
  "DocumentClassificationJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DocumentClassifierFilter extends S.Class<DocumentClassifierFilter>(
  "DocumentClassifierFilter",
)({
  Status: S.optional(S.String),
  DocumentClassifierName: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DominantLanguageDetectionJobFilter extends S.Class<DominantLanguageDetectionJobFilter>(
  "DominantLanguageDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class EndpointFilter extends S.Class<EndpointFilter>("EndpointFilter")({
  ModelArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTimeBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreationTimeAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class EntitiesDetectionJobFilter extends S.Class<EntitiesDetectionJobFilter>(
  "EntitiesDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class EntityRecognizerFilter extends S.Class<EntityRecognizerFilter>(
  "EntityRecognizerFilter",
)({
  Status: S.optional(S.String),
  RecognizerName: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class EventsDetectionJobFilter extends S.Class<EventsDetectionJobFilter>(
  "EventsDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class FlywheelIterationFilter extends S.Class<FlywheelIterationFilter>(
  "FlywheelIterationFilter",
)({
  CreationTimeAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreationTimeBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class FlywheelFilter extends S.Class<FlywheelFilter>("FlywheelFilter")({
  Status: S.optional(S.String),
  CreationTimeAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreationTimeBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class KeyPhrasesDetectionJobFilter extends S.Class<KeyPhrasesDetectionJobFilter>(
  "KeyPhrasesDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PiiEntitiesDetectionJobFilter extends S.Class<PiiEntitiesDetectionJobFilter>(
  "PiiEntitiesDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class SentimentDetectionJobFilter extends S.Class<SentimentDetectionJobFilter>(
  "SentimentDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TargetedSentimentDetectionJobFilter extends S.Class<TargetedSentimentDetectionJobFilter>(
  "TargetedSentimentDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TopicsDetectionJobFilter extends S.Class<TopicsDetectionJobFilter>(
  "TopicsDetectionJobFilter",
)({
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  SubmitTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SubmitTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RedactionConfig extends S.Class<RedactionConfig>(
  "RedactionConfig",
)({
  PiiEntityTypes: S.optional(ListOfPiiEntityTypes),
  MaskMode: S.optional(S.String),
  MaskCharacter: S.optional(S.String),
}) {}
export class UpdateDataSecurityConfig extends S.Class<UpdateDataSecurityConfig>(
  "UpdateDataSecurityConfig",
)({
  ModelKmsKeyId: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export const LabelsList = S.Array(S.String);
export class ClassifyDocumentRequest extends S.Class<ClassifyDocumentRequest>(
  "ClassifyDocumentRequest",
)(
  {
    Text: S.optional(S.String),
    EndpointArn: S.String,
    Bytes: S.optional(T.Blob),
    DocumentReaderConfig: S.optional(DocumentReaderConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointResponse extends S.Class<CreateEndpointResponse>(
  "CreateEndpointResponse",
)({ EndpointArn: S.optional(S.String), ModelArn: S.optional(S.String) }) {}
export class DescribeResourcePolicyResponse extends S.Class<DescribeResourcePolicyResponse>(
  "DescribeResourcePolicyResponse",
)({
  ResourcePolicy: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PolicyRevisionId: S.optional(S.String),
}) {}
export class DetectToxicContentRequest extends S.Class<DetectToxicContentRequest>(
  "DetectToxicContentRequest",
)(
  { TextSegments: ListOfTextSegments, LanguageCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportModelResponse extends S.Class<ImportModelResponse>(
  "ImportModelResponse",
)({ ModelArn: S.optional(S.String) }) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    FlywheelArn: S.optional(S.String),
    Filter: S.optional(DatasetFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDocumentClassificationJobsRequest extends S.Class<ListDocumentClassificationJobsRequest>(
  "ListDocumentClassificationJobsRequest",
)(
  {
    Filter: S.optional(DocumentClassificationJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDocumentClassifiersRequest extends S.Class<ListDocumentClassifiersRequest>(
  "ListDocumentClassifiersRequest",
)(
  {
    Filter: S.optional(DocumentClassifierFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDominantLanguageDetectionJobsRequest extends S.Class<ListDominantLanguageDetectionJobsRequest>(
  "ListDominantLanguageDetectionJobsRequest",
)(
  {
    Filter: S.optional(DominantLanguageDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointsRequest extends S.Class<ListEndpointsRequest>(
  "ListEndpointsRequest",
)(
  {
    Filter: S.optional(EndpointFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntitiesDetectionJobsRequest extends S.Class<ListEntitiesDetectionJobsRequest>(
  "ListEntitiesDetectionJobsRequest",
)(
  {
    Filter: S.optional(EntitiesDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntityRecognizersRequest extends S.Class<ListEntityRecognizersRequest>(
  "ListEntityRecognizersRequest",
)(
  {
    Filter: S.optional(EntityRecognizerFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEventsDetectionJobsRequest extends S.Class<ListEventsDetectionJobsRequest>(
  "ListEventsDetectionJobsRequest",
)(
  {
    Filter: S.optional(EventsDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlywheelIterationHistoryRequest extends S.Class<ListFlywheelIterationHistoryRequest>(
  "ListFlywheelIterationHistoryRequest",
)(
  {
    FlywheelArn: S.String,
    Filter: S.optional(FlywheelIterationFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlywheelsRequest extends S.Class<ListFlywheelsRequest>(
  "ListFlywheelsRequest",
)(
  {
    Filter: S.optional(FlywheelFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListKeyPhrasesDetectionJobsRequest extends S.Class<ListKeyPhrasesDetectionJobsRequest>(
  "ListKeyPhrasesDetectionJobsRequest",
)(
  {
    Filter: S.optional(KeyPhrasesDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPiiEntitiesDetectionJobsRequest extends S.Class<ListPiiEntitiesDetectionJobsRequest>(
  "ListPiiEntitiesDetectionJobsRequest",
)(
  {
    Filter: S.optional(PiiEntitiesDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSentimentDetectionJobsRequest extends S.Class<ListSentimentDetectionJobsRequest>(
  "ListSentimentDetectionJobsRequest",
)(
  {
    Filter: S.optional(SentimentDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class ListTargetedSentimentDetectionJobsRequest extends S.Class<ListTargetedSentimentDetectionJobsRequest>(
  "ListTargetedSentimentDetectionJobsRequest",
)(
  {
    Filter: S.optional(TargetedSentimentDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTopicsDetectionJobsRequest extends S.Class<ListTopicsDetectionJobsRequest>(
  "ListTopicsDetectionJobsRequest",
)(
  {
    Filter: S.optional(TopicsDetectionJobFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ PolicyRevisionId: S.optional(S.String) }) {}
export class StartDocumentClassificationJobRequest extends S.Class<StartDocumentClassificationJobRequest>(
  "StartDocumentClassificationJobRequest",
)(
  {
    JobName: S.optional(S.String),
    DocumentClassifierArn: S.optional(S.String),
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    DataAccessRoleArn: S.String,
    ClientRequestToken: S.optional(S.String),
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
    FlywheelArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDominantLanguageDetectionJobResponse extends S.Class<StartDominantLanguageDetectionJobResponse>(
  "StartDominantLanguageDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StartEntitiesDetectionJobResponse extends S.Class<StartEntitiesDetectionJobResponse>(
  "StartEntitiesDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
  EntityRecognizerArn: S.optional(S.String),
}) {}
export class StartEventsDetectionJobResponse extends S.Class<StartEventsDetectionJobResponse>(
  "StartEventsDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StartFlywheelIterationResponse extends S.Class<StartFlywheelIterationResponse>(
  "StartFlywheelIterationResponse",
)({
  FlywheelArn: S.optional(S.String),
  FlywheelIterationId: S.optional(S.String),
}) {}
export class StartKeyPhrasesDetectionJobResponse extends S.Class<StartKeyPhrasesDetectionJobResponse>(
  "StartKeyPhrasesDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StartPiiEntitiesDetectionJobRequest extends S.Class<StartPiiEntitiesDetectionJobRequest>(
  "StartPiiEntitiesDetectionJobRequest",
)(
  {
    InputDataConfig: InputDataConfig,
    OutputDataConfig: OutputDataConfig,
    Mode: S.String,
    RedactionConfig: S.optional(RedactionConfig),
    DataAccessRoleArn: S.String,
    JobName: S.optional(S.String),
    LanguageCode: S.String,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSentimentDetectionJobResponse extends S.Class<StartSentimentDetectionJobResponse>(
  "StartSentimentDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StartTargetedSentimentDetectionJobResponse extends S.Class<StartTargetedSentimentDetectionJobResponse>(
  "StartTargetedSentimentDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StartTopicsDetectionJobResponse extends S.Class<StartTopicsDetectionJobResponse>(
  "StartTopicsDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class StopDominantLanguageDetectionJobResponse extends S.Class<StopDominantLanguageDetectionJobResponse>(
  "StopDominantLanguageDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopEntitiesDetectionJobResponse extends S.Class<StopEntitiesDetectionJobResponse>(
  "StopEntitiesDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopEventsDetectionJobResponse extends S.Class<StopEventsDetectionJobResponse>(
  "StopEventsDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopKeyPhrasesDetectionJobResponse extends S.Class<StopKeyPhrasesDetectionJobResponse>(
  "StopKeyPhrasesDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopPiiEntitiesDetectionJobResponse extends S.Class<StopPiiEntitiesDetectionJobResponse>(
  "StopPiiEntitiesDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopSentimentDetectionJobResponse extends S.Class<StopSentimentDetectionJobResponse>(
  "StopSentimentDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class StopTargetedSentimentDetectionJobResponse extends S.Class<StopTargetedSentimentDetectionJobResponse>(
  "StopTargetedSentimentDetectionJobResponse",
)({ JobId: S.optional(S.String), JobStatus: S.optional(S.String) }) {}
export class UpdateEndpointResponse extends S.Class<UpdateEndpointResponse>(
  "UpdateEndpointResponse",
)({ DesiredModelArn: S.optional(S.String) }) {}
export class UpdateFlywheelRequest extends S.Class<UpdateFlywheelRequest>(
  "UpdateFlywheelRequest",
)(
  {
    FlywheelArn: S.String,
    ActiveModelArn: S.optional(S.String),
    DataAccessRoleArn: S.optional(S.String),
    DataSecurityConfig: S.optional(UpdateDataSecurityConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DatasetAugmentedManifestsListItem extends S.Class<DatasetAugmentedManifestsListItem>(
  "DatasetAugmentedManifestsListItem",
)({
  AttributeNames: AttributeNamesList,
  S3Uri: S.String,
  AnnotationDataS3Uri: S.optional(S.String),
  SourceDocumentsS3Uri: S.optional(S.String),
  DocumentType: S.optional(S.String),
}) {}
export const DatasetAugmentedManifestsList = S.Array(
  DatasetAugmentedManifestsListItem,
);
export class DatasetDocumentClassifierInputDataConfig extends S.Class<DatasetDocumentClassifierInputDataConfig>(
  "DatasetDocumentClassifierInputDataConfig",
)({ S3Uri: S.String, LabelDelimiter: S.optional(S.String) }) {}
export const DocumentClassifierAugmentedManifestsList = S.Array(
  AugmentedManifestsListItem,
);
export class DocumentClassifierDocuments extends S.Class<DocumentClassifierDocuments>(
  "DocumentClassifierDocuments",
)({ S3Uri: S.String, TestS3Uri: S.optional(S.String) }) {}
export class EntityTypesListItem extends S.Class<EntityTypesListItem>(
  "EntityTypesListItem",
)({ Type: S.String }) {}
export const EntityTypesList = S.Array(EntityTypesListItem);
export class EntityRecognizerDocuments extends S.Class<EntityRecognizerDocuments>(
  "EntityRecognizerDocuments",
)({
  S3Uri: S.String,
  TestS3Uri: S.optional(S.String),
  InputFormat: S.optional(S.String),
}) {}
export class EntityRecognizerAnnotations extends S.Class<EntityRecognizerAnnotations>(
  "EntityRecognizerAnnotations",
)({ S3Uri: S.String, TestS3Uri: S.optional(S.String) }) {}
export class EntityRecognizerEntityList extends S.Class<EntityRecognizerEntityList>(
  "EntityRecognizerEntityList",
)({ S3Uri: S.String }) {}
export class DocumentClassificationConfig extends S.Class<DocumentClassificationConfig>(
  "DocumentClassificationConfig",
)({ Mode: S.String, Labels: S.optional(LabelsList) }) {}
export class EntityRecognitionConfig extends S.Class<EntityRecognitionConfig>(
  "EntityRecognitionConfig",
)({ EntityTypes: EntityTypesList }) {}
export const ListOfDescriptiveMentionIndices = S.Array(S.Number);
export class DominantLanguage extends S.Class<DominantLanguage>(
  "DominantLanguage",
)({ LanguageCode: S.optional(S.String), Score: S.optional(S.Number) }) {}
export const ListOfDominantLanguages = S.Array(DominantLanguage);
export class BatchDetectDominantLanguageItemResult extends S.Class<BatchDetectDominantLanguageItemResult>(
  "BatchDetectDominantLanguageItemResult",
)({
  Index: S.optional(S.Number),
  Languages: S.optional(ListOfDominantLanguages),
}) {}
export const ListOfDetectDominantLanguageResult = S.Array(
  BatchDetectDominantLanguageItemResult,
);
export class BatchItemError extends S.Class<BatchItemError>("BatchItemError")({
  Index: S.optional(S.Number),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchItemErrorList = S.Array(BatchItemError);
export class ChildBlock extends S.Class<ChildBlock>("ChildBlock")({
  ChildBlockId: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
}) {}
export const ListOfChildBlocks = S.Array(ChildBlock);
export class BlockReference extends S.Class<BlockReference>("BlockReference")({
  BlockId: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  ChildBlocks: S.optional(ListOfChildBlocks),
}) {}
export const ListOfBlockReferences = S.Array(BlockReference);
export class Entity extends S.Class<Entity>("Entity")({
  Score: S.optional(S.Number),
  Type: S.optional(S.String),
  Text: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  BlockReferences: S.optional(ListOfBlockReferences),
}) {}
export const ListOfEntities = S.Array(Entity);
export class BatchDetectEntitiesItemResult extends S.Class<BatchDetectEntitiesItemResult>(
  "BatchDetectEntitiesItemResult",
)({ Index: S.optional(S.Number), Entities: S.optional(ListOfEntities) }) {}
export const ListOfDetectEntitiesResult = S.Array(
  BatchDetectEntitiesItemResult,
);
export class KeyPhrase extends S.Class<KeyPhrase>("KeyPhrase")({
  Score: S.optional(S.Number),
  Text: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
}) {}
export const ListOfKeyPhrases = S.Array(KeyPhrase);
export class BatchDetectKeyPhrasesItemResult extends S.Class<BatchDetectKeyPhrasesItemResult>(
  "BatchDetectKeyPhrasesItemResult",
)({ Index: S.optional(S.Number), KeyPhrases: S.optional(ListOfKeyPhrases) }) {}
export const ListOfDetectKeyPhrasesResult = S.Array(
  BatchDetectKeyPhrasesItemResult,
);
export class SentimentScore extends S.Class<SentimentScore>("SentimentScore")({
  Positive: S.optional(S.Number),
  Negative: S.optional(S.Number),
  Neutral: S.optional(S.Number),
  Mixed: S.optional(S.Number),
}) {}
export class BatchDetectSentimentItemResult extends S.Class<BatchDetectSentimentItemResult>(
  "BatchDetectSentimentItemResult",
)({
  Index: S.optional(S.Number),
  Sentiment: S.optional(S.String),
  SentimentScore: S.optional(SentimentScore),
}) {}
export const ListOfDetectSentimentResult = S.Array(
  BatchDetectSentimentItemResult,
);
export class PartOfSpeechTag extends S.Class<PartOfSpeechTag>(
  "PartOfSpeechTag",
)({ Tag: S.optional(S.String), Score: S.optional(S.Number) }) {}
export class SyntaxToken extends S.Class<SyntaxToken>("SyntaxToken")({
  TokenId: S.optional(S.Number),
  Text: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
  PartOfSpeech: S.optional(PartOfSpeechTag),
}) {}
export const ListOfSyntaxTokens = S.Array(SyntaxToken);
export class BatchDetectSyntaxItemResult extends S.Class<BatchDetectSyntaxItemResult>(
  "BatchDetectSyntaxItemResult",
)({
  Index: S.optional(S.Number),
  SyntaxTokens: S.optional(ListOfSyntaxTokens),
}) {}
export const ListOfDetectSyntaxResult = S.Array(BatchDetectSyntaxItemResult);
export class MentionSentiment extends S.Class<MentionSentiment>(
  "MentionSentiment",
)({
  Sentiment: S.optional(S.String),
  SentimentScore: S.optional(SentimentScore),
}) {}
export class TargetedSentimentMention extends S.Class<TargetedSentimentMention>(
  "TargetedSentimentMention",
)({
  Score: S.optional(S.Number),
  GroupScore: S.optional(S.Number),
  Text: S.optional(S.String),
  Type: S.optional(S.String),
  MentionSentiment: S.optional(MentionSentiment),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
}) {}
export const ListOfMentions = S.Array(TargetedSentimentMention);
export class TargetedSentimentEntity extends S.Class<TargetedSentimentEntity>(
  "TargetedSentimentEntity",
)({
  DescriptiveMentionIndex: S.optional(ListOfDescriptiveMentionIndices),
  Mentions: S.optional(ListOfMentions),
}) {}
export const ListOfTargetedSentimentEntities = S.Array(TargetedSentimentEntity);
export class BatchDetectTargetedSentimentItemResult extends S.Class<BatchDetectTargetedSentimentItemResult>(
  "BatchDetectTargetedSentimentItemResult",
)({
  Index: S.optional(S.Number),
  Entities: S.optional(ListOfTargetedSentimentEntities),
}) {}
export const ListOfDetectTargetedSentimentResult = S.Array(
  BatchDetectTargetedSentimentItemResult,
);
export class EntityLabel extends S.Class<EntityLabel>("EntityLabel")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const ListOfEntityLabels = S.Array(EntityLabel);
export class DocumentClassifierInputDataConfig extends S.Class<DocumentClassifierInputDataConfig>(
  "DocumentClassifierInputDataConfig",
)({
  DataFormat: S.optional(S.String),
  S3Uri: S.optional(S.String),
  TestS3Uri: S.optional(S.String),
  LabelDelimiter: S.optional(S.String),
  AugmentedManifests: S.optional(DocumentClassifierAugmentedManifestsList),
  DocumentType: S.optional(S.String),
  Documents: S.optional(DocumentClassifierDocuments),
  DocumentReaderConfig: S.optional(DocumentReaderConfig),
}) {}
export class EntityRecognizerInputDataConfig extends S.Class<EntityRecognizerInputDataConfig>(
  "EntityRecognizerInputDataConfig",
)({
  DataFormat: S.optional(S.String),
  EntityTypes: EntityTypesList,
  Documents: S.optional(EntityRecognizerDocuments),
  Annotations: S.optional(EntityRecognizerAnnotations),
  EntityList: S.optional(EntityRecognizerEntityList),
  AugmentedManifests: S.optional(EntityRecognizerAugmentedManifestsList),
}) {}
export class TaskConfig extends S.Class<TaskConfig>("TaskConfig")({
  LanguageCode: S.String,
  DocumentClassificationConfig: S.optional(DocumentClassificationConfig),
  EntityRecognitionConfig: S.optional(EntityRecognitionConfig),
}) {}
export class DatasetProperties extends S.Class<DatasetProperties>(
  "DatasetProperties",
)({
  DatasetArn: S.optional(S.String),
  DatasetName: S.optional(S.String),
  DatasetType: S.optional(S.String),
  DatasetS3Uri: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  NumberOfDocuments: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DocumentClassificationJobProperties extends S.Class<DocumentClassificationJobProperties>(
  "DocumentClassificationJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DocumentClassifierArn: S.optional(S.String),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
  FlywheelArn: S.optional(S.String),
}) {}
export class DominantLanguageDetectionJobProperties extends S.Class<DominantLanguageDetectionJobProperties>(
  "DominantLanguageDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class EndpointProperties extends S.Class<EndpointProperties>(
  "EndpointProperties",
)({
  EndpointArn: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  ModelArn: S.optional(S.String),
  DesiredModelArn: S.optional(S.String),
  DesiredInferenceUnits: S.optional(S.Number),
  CurrentInferenceUnits: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataAccessRoleArn: S.optional(S.String),
  DesiredDataAccessRoleArn: S.optional(S.String),
  FlywheelArn: S.optional(S.String),
}) {}
export class EntitiesDetectionJobProperties extends S.Class<EntitiesDetectionJobProperties>(
  "EntitiesDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EntityRecognizerArn: S.optional(S.String),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
  FlywheelArn: S.optional(S.String),
}) {}
export class EventsDetectionJobProperties extends S.Class<EventsDetectionJobProperties>(
  "EventsDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  TargetEventTypes: S.optional(TargetEventTypes),
}) {}
export class FlywheelProperties extends S.Class<FlywheelProperties>(
  "FlywheelProperties",
)({
  FlywheelArn: S.optional(S.String),
  ActiveModelArn: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  TaskConfig: S.optional(TaskConfig),
  DataLakeS3Uri: S.optional(S.String),
  DataSecurityConfig: S.optional(DataSecurityConfig),
  Status: S.optional(S.String),
  ModelType: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestFlywheelIteration: S.optional(S.String),
}) {}
export class KeyPhrasesDetectionJobProperties extends S.Class<KeyPhrasesDetectionJobProperties>(
  "KeyPhrasesDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class SentimentDetectionJobProperties extends S.Class<SentimentDetectionJobProperties>(
  "SentimentDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class TargetedSentimentDetectionJobProperties extends S.Class<TargetedSentimentDetectionJobProperties>(
  "TargetedSentimentDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class TopicsDetectionJobProperties extends S.Class<TopicsDetectionJobProperties>(
  "TopicsDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  NumberOfTopics: S.optional(S.Number),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class DocumentTypeListItem extends S.Class<DocumentTypeListItem>(
  "DocumentTypeListItem",
)({ Page: S.optional(S.Number), Type: S.optional(S.String) }) {}
export const ListOfDocumentType = S.Array(DocumentTypeListItem);
export class ErrorsListItem extends S.Class<ErrorsListItem>("ErrorsListItem")({
  Page: S.optional(S.Number),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const ListOfErrors = S.Array(ErrorsListItem);
export class PiiEntity extends S.Class<PiiEntity>("PiiEntity")({
  Score: S.optional(S.Number),
  Type: S.optional(S.String),
  BeginOffset: S.optional(S.Number),
  EndOffset: S.optional(S.Number),
}) {}
export const ListOfPiiEntities = S.Array(PiiEntity);
export const DatasetPropertiesList = S.Array(DatasetProperties);
export const DocumentClassificationJobPropertiesList = S.Array(
  DocumentClassificationJobProperties,
);
export class ClassifierEvaluationMetrics extends S.Class<ClassifierEvaluationMetrics>(
  "ClassifierEvaluationMetrics",
)({
  Accuracy: S.optional(S.Number),
  Precision: S.optional(S.Number),
  Recall: S.optional(S.Number),
  F1Score: S.optional(S.Number),
  MicroPrecision: S.optional(S.Number),
  MicroRecall: S.optional(S.Number),
  MicroF1Score: S.optional(S.Number),
  HammingLoss: S.optional(S.Number),
}) {}
export class ClassifierMetadata extends S.Class<ClassifierMetadata>(
  "ClassifierMetadata",
)({
  NumberOfLabels: S.optional(S.Number),
  NumberOfTrainedDocuments: S.optional(S.Number),
  NumberOfTestDocuments: S.optional(S.Number),
  EvaluationMetrics: S.optional(ClassifierEvaluationMetrics),
}) {}
export class DocumentClassifierProperties extends S.Class<DocumentClassifierProperties>(
  "DocumentClassifierProperties",
)({
  DocumentClassifierArn: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TrainingEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(DocumentClassifierInputDataConfig),
  OutputDataConfig: S.optional(DocumentClassifierOutputDataConfig),
  ClassifierMetadata: S.optional(ClassifierMetadata),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
  Mode: S.optional(S.String),
  ModelKmsKeyId: S.optional(S.String),
  VersionName: S.optional(S.String),
  SourceModelArn: S.optional(S.String),
  FlywheelArn: S.optional(S.String),
}) {}
export const DocumentClassifierPropertiesList = S.Array(
  DocumentClassifierProperties,
);
export class DocumentClassifierSummary extends S.Class<DocumentClassifierSummary>(
  "DocumentClassifierSummary",
)({
  DocumentClassifierName: S.optional(S.String),
  NumberOfVersions: S.optional(S.Number),
  LatestVersionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestVersionName: S.optional(S.String),
  LatestVersionStatus: S.optional(S.String),
}) {}
export const DocumentClassifierSummariesList = S.Array(
  DocumentClassifierSummary,
);
export const DominantLanguageDetectionJobPropertiesList = S.Array(
  DominantLanguageDetectionJobProperties,
);
export const EndpointPropertiesList = S.Array(EndpointProperties);
export const EntitiesDetectionJobPropertiesList = S.Array(
  EntitiesDetectionJobProperties,
);
export class EntityRecognizerEvaluationMetrics extends S.Class<EntityRecognizerEvaluationMetrics>(
  "EntityRecognizerEvaluationMetrics",
)({
  Precision: S.optional(S.Number),
  Recall: S.optional(S.Number),
  F1Score: S.optional(S.Number),
}) {}
export class EntityTypesEvaluationMetrics extends S.Class<EntityTypesEvaluationMetrics>(
  "EntityTypesEvaluationMetrics",
)({
  Precision: S.optional(S.Number),
  Recall: S.optional(S.Number),
  F1Score: S.optional(S.Number),
}) {}
export class EntityRecognizerMetadataEntityTypesListItem extends S.Class<EntityRecognizerMetadataEntityTypesListItem>(
  "EntityRecognizerMetadataEntityTypesListItem",
)({
  Type: S.optional(S.String),
  EvaluationMetrics: S.optional(EntityTypesEvaluationMetrics),
  NumberOfTrainMentions: S.optional(S.Number),
}) {}
export const EntityRecognizerMetadataEntityTypesList = S.Array(
  EntityRecognizerMetadataEntityTypesListItem,
);
export class EntityRecognizerMetadata extends S.Class<EntityRecognizerMetadata>(
  "EntityRecognizerMetadata",
)({
  NumberOfTrainedDocuments: S.optional(S.Number),
  NumberOfTestDocuments: S.optional(S.Number),
  EvaluationMetrics: S.optional(EntityRecognizerEvaluationMetrics),
  EntityTypes: S.optional(EntityRecognizerMetadataEntityTypesList),
}) {}
export class EntityRecognizerOutputDataConfig extends S.Class<EntityRecognizerOutputDataConfig>(
  "EntityRecognizerOutputDataConfig",
)({ FlywheelStatsS3Prefix: S.optional(S.String) }) {}
export class EntityRecognizerProperties extends S.Class<EntityRecognizerProperties>(
  "EntityRecognizerProperties",
)({
  EntityRecognizerArn: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TrainingEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(EntityRecognizerInputDataConfig),
  RecognizerMetadata: S.optional(EntityRecognizerMetadata),
  DataAccessRoleArn: S.optional(S.String),
  VolumeKmsKeyId: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
  ModelKmsKeyId: S.optional(S.String),
  VersionName: S.optional(S.String),
  SourceModelArn: S.optional(S.String),
  FlywheelArn: S.optional(S.String),
  OutputDataConfig: S.optional(EntityRecognizerOutputDataConfig),
}) {}
export const EntityRecognizerPropertiesList = S.Array(
  EntityRecognizerProperties,
);
export class EntityRecognizerSummary extends S.Class<EntityRecognizerSummary>(
  "EntityRecognizerSummary",
)({
  RecognizerName: S.optional(S.String),
  NumberOfVersions: S.optional(S.Number),
  LatestVersionCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestVersionName: S.optional(S.String),
  LatestVersionStatus: S.optional(S.String),
}) {}
export const EntityRecognizerSummariesList = S.Array(EntityRecognizerSummary);
export const EventsDetectionJobPropertiesList = S.Array(
  EventsDetectionJobProperties,
);
export class FlywheelModelEvaluationMetrics extends S.Class<FlywheelModelEvaluationMetrics>(
  "FlywheelModelEvaluationMetrics",
)({
  AverageF1Score: S.optional(S.Number),
  AveragePrecision: S.optional(S.Number),
  AverageRecall: S.optional(S.Number),
  AverageAccuracy: S.optional(S.Number),
}) {}
export class FlywheelIterationProperties extends S.Class<FlywheelIterationProperties>(
  "FlywheelIterationProperties",
)({
  FlywheelArn: S.optional(S.String),
  FlywheelIterationId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  EvaluatedModelArn: S.optional(S.String),
  EvaluatedModelMetrics: S.optional(FlywheelModelEvaluationMetrics),
  TrainedModelArn: S.optional(S.String),
  TrainedModelMetrics: S.optional(FlywheelModelEvaluationMetrics),
  EvaluationManifestS3Prefix: S.optional(S.String),
}) {}
export const FlywheelIterationPropertiesList = S.Array(
  FlywheelIterationProperties,
);
export const KeyPhrasesDetectionJobPropertiesList = S.Array(
  KeyPhrasesDetectionJobProperties,
);
export class PiiOutputDataConfig extends S.Class<PiiOutputDataConfig>(
  "PiiOutputDataConfig",
)({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export class PiiEntitiesDetectionJobProperties extends S.Class<PiiEntitiesDetectionJobProperties>(
  "PiiEntitiesDetectionJobProperties",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobName: S.optional(S.String),
  JobStatus: S.optional(S.String),
  Message: S.optional(S.String),
  SubmitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(PiiOutputDataConfig),
  RedactionConfig: S.optional(RedactionConfig),
  LanguageCode: S.optional(S.String),
  DataAccessRoleArn: S.optional(S.String),
  Mode: S.optional(S.String),
}) {}
export const PiiEntitiesDetectionJobPropertiesList = S.Array(
  PiiEntitiesDetectionJobProperties,
);
export const SentimentDetectionJobPropertiesList = S.Array(
  SentimentDetectionJobProperties,
);
export const TargetedSentimentDetectionJobPropertiesList = S.Array(
  TargetedSentimentDetectionJobProperties,
);
export const TopicsDetectionJobPropertiesList = S.Array(
  TopicsDetectionJobProperties,
);
export class DatasetEntityRecognizerAnnotations extends S.Class<DatasetEntityRecognizerAnnotations>(
  "DatasetEntityRecognizerAnnotations",
)({ S3Uri: S.String }) {}
export class DatasetEntityRecognizerDocuments extends S.Class<DatasetEntityRecognizerDocuments>(
  "DatasetEntityRecognizerDocuments",
)({ S3Uri: S.String, InputFormat: S.optional(S.String) }) {}
export class DatasetEntityRecognizerEntityList extends S.Class<DatasetEntityRecognizerEntityList>(
  "DatasetEntityRecognizerEntityList",
)({ S3Uri: S.String }) {}
export const StringList = S.Array(S.String);
export class BatchDetectDominantLanguageResponse extends S.Class<BatchDetectDominantLanguageResponse>(
  "BatchDetectDominantLanguageResponse",
)({
  ResultList: ListOfDetectDominantLanguageResult,
  ErrorList: BatchItemErrorList,
}) {}
export class BatchDetectEntitiesResponse extends S.Class<BatchDetectEntitiesResponse>(
  "BatchDetectEntitiesResponse",
)({ ResultList: ListOfDetectEntitiesResult, ErrorList: BatchItemErrorList }) {}
export class BatchDetectKeyPhrasesResponse extends S.Class<BatchDetectKeyPhrasesResponse>(
  "BatchDetectKeyPhrasesResponse",
)({
  ResultList: ListOfDetectKeyPhrasesResult,
  ErrorList: BatchItemErrorList,
}) {}
export class BatchDetectSentimentResponse extends S.Class<BatchDetectSentimentResponse>(
  "BatchDetectSentimentResponse",
)({ ResultList: ListOfDetectSentimentResult, ErrorList: BatchItemErrorList }) {}
export class BatchDetectSyntaxResponse extends S.Class<BatchDetectSyntaxResponse>(
  "BatchDetectSyntaxResponse",
)({ ResultList: ListOfDetectSyntaxResult, ErrorList: BatchItemErrorList }) {}
export class BatchDetectTargetedSentimentResponse extends S.Class<BatchDetectTargetedSentimentResponse>(
  "BatchDetectTargetedSentimentResponse",
)({
  ResultList: ListOfDetectTargetedSentimentResult,
  ErrorList: BatchItemErrorList,
}) {}
export class ContainsPiiEntitiesResponse extends S.Class<ContainsPiiEntitiesResponse>(
  "ContainsPiiEntitiesResponse",
)({ Labels: S.optional(ListOfEntityLabels) }) {}
export class CreateDocumentClassifierRequest extends S.Class<CreateDocumentClassifierRequest>(
  "CreateDocumentClassifierRequest",
)(
  {
    DocumentClassifierName: S.String,
    VersionName: S.optional(S.String),
    DataAccessRoleArn: S.String,
    Tags: S.optional(TagList),
    InputDataConfig: DocumentClassifierInputDataConfig,
    OutputDataConfig: S.optional(DocumentClassifierOutputDataConfig),
    ClientRequestToken: S.optional(S.String),
    LanguageCode: S.String,
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    Mode: S.optional(S.String),
    ModelKmsKeyId: S.optional(S.String),
    ModelPolicy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEntityRecognizerRequest extends S.Class<CreateEntityRecognizerRequest>(
  "CreateEntityRecognizerRequest",
)(
  {
    RecognizerName: S.String,
    VersionName: S.optional(S.String),
    DataAccessRoleArn: S.String,
    Tags: S.optional(TagList),
    InputDataConfig: EntityRecognizerInputDataConfig,
    ClientRequestToken: S.optional(S.String),
    LanguageCode: S.String,
    VolumeKmsKeyId: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    ModelKmsKeyId: S.optional(S.String),
    ModelPolicy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFlywheelRequest extends S.Class<CreateFlywheelRequest>(
  "CreateFlywheelRequest",
)(
  {
    FlywheelName: S.String,
    ActiveModelArn: S.optional(S.String),
    DataAccessRoleArn: S.String,
    TaskConfig: S.optional(TaskConfig),
    ModelType: S.optional(S.String),
    DataLakeS3Uri: S.String,
    DataSecurityConfig: S.optional(DataSecurityConfig),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({ DatasetProperties: S.optional(DatasetProperties) }) {}
export class DescribeDocumentClassificationJobResponse extends S.Class<DescribeDocumentClassificationJobResponse>(
  "DescribeDocumentClassificationJobResponse",
)({
  DocumentClassificationJobProperties: S.optional(
    DocumentClassificationJobProperties,
  ),
}) {}
export class DescribeDominantLanguageDetectionJobResponse extends S.Class<DescribeDominantLanguageDetectionJobResponse>(
  "DescribeDominantLanguageDetectionJobResponse",
)({
  DominantLanguageDetectionJobProperties: S.optional(
    DominantLanguageDetectionJobProperties,
  ),
}) {}
export class DescribeEndpointResponse extends S.Class<DescribeEndpointResponse>(
  "DescribeEndpointResponse",
)({ EndpointProperties: S.optional(EndpointProperties) }) {}
export class DescribeEntitiesDetectionJobResponse extends S.Class<DescribeEntitiesDetectionJobResponse>(
  "DescribeEntitiesDetectionJobResponse",
)({
  EntitiesDetectionJobProperties: S.optional(EntitiesDetectionJobProperties),
}) {}
export class DescribeEventsDetectionJobResponse extends S.Class<DescribeEventsDetectionJobResponse>(
  "DescribeEventsDetectionJobResponse",
)({ EventsDetectionJobProperties: S.optional(EventsDetectionJobProperties) }) {}
export class DescribeFlywheelResponse extends S.Class<DescribeFlywheelResponse>(
  "DescribeFlywheelResponse",
)({ FlywheelProperties: S.optional(FlywheelProperties) }) {}
export class DescribeKeyPhrasesDetectionJobResponse extends S.Class<DescribeKeyPhrasesDetectionJobResponse>(
  "DescribeKeyPhrasesDetectionJobResponse",
)({
  KeyPhrasesDetectionJobProperties: S.optional(
    KeyPhrasesDetectionJobProperties,
  ),
}) {}
export class DescribeSentimentDetectionJobResponse extends S.Class<DescribeSentimentDetectionJobResponse>(
  "DescribeSentimentDetectionJobResponse",
)({
  SentimentDetectionJobProperties: S.optional(SentimentDetectionJobProperties),
}) {}
export class DescribeTargetedSentimentDetectionJobResponse extends S.Class<DescribeTargetedSentimentDetectionJobResponse>(
  "DescribeTargetedSentimentDetectionJobResponse",
)({
  TargetedSentimentDetectionJobProperties: S.optional(
    TargetedSentimentDetectionJobProperties,
  ),
}) {}
export class DescribeTopicsDetectionJobResponse extends S.Class<DescribeTopicsDetectionJobResponse>(
  "DescribeTopicsDetectionJobResponse",
)({ TopicsDetectionJobProperties: S.optional(TopicsDetectionJobProperties) }) {}
export class DetectDominantLanguageResponse extends S.Class<DetectDominantLanguageResponse>(
  "DetectDominantLanguageResponse",
)({ Languages: S.optional(ListOfDominantLanguages) }) {}
export class DetectKeyPhrasesResponse extends S.Class<DetectKeyPhrasesResponse>(
  "DetectKeyPhrasesResponse",
)({ KeyPhrases: S.optional(ListOfKeyPhrases) }) {}
export class DetectPiiEntitiesResponse extends S.Class<DetectPiiEntitiesResponse>(
  "DetectPiiEntitiesResponse",
)({ Entities: S.optional(ListOfPiiEntities) }) {}
export class DetectSentimentResponse extends S.Class<DetectSentimentResponse>(
  "DetectSentimentResponse",
)({
  Sentiment: S.optional(S.String),
  SentimentScore: S.optional(SentimentScore),
}) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({
  DatasetPropertiesList: S.optional(DatasetPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListDocumentClassificationJobsResponse extends S.Class<ListDocumentClassificationJobsResponse>(
  "ListDocumentClassificationJobsResponse",
)({
  DocumentClassificationJobPropertiesList: S.optional(
    DocumentClassificationJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListDocumentClassifiersResponse extends S.Class<ListDocumentClassifiersResponse>(
  "ListDocumentClassifiersResponse",
)({
  DocumentClassifierPropertiesList: S.optional(
    DocumentClassifierPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListDocumentClassifierSummariesResponse extends S.Class<ListDocumentClassifierSummariesResponse>(
  "ListDocumentClassifierSummariesResponse",
)({
  DocumentClassifierSummariesList: S.optional(DocumentClassifierSummariesList),
  NextToken: S.optional(S.String),
}) {}
export class ListDominantLanguageDetectionJobsResponse extends S.Class<ListDominantLanguageDetectionJobsResponse>(
  "ListDominantLanguageDetectionJobsResponse",
)({
  DominantLanguageDetectionJobPropertiesList: S.optional(
    DominantLanguageDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListEndpointsResponse extends S.Class<ListEndpointsResponse>(
  "ListEndpointsResponse",
)({
  EndpointPropertiesList: S.optional(EndpointPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListEntitiesDetectionJobsResponse extends S.Class<ListEntitiesDetectionJobsResponse>(
  "ListEntitiesDetectionJobsResponse",
)({
  EntitiesDetectionJobPropertiesList: S.optional(
    EntitiesDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListEntityRecognizersResponse extends S.Class<ListEntityRecognizersResponse>(
  "ListEntityRecognizersResponse",
)({
  EntityRecognizerPropertiesList: S.optional(EntityRecognizerPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListEntityRecognizerSummariesResponse extends S.Class<ListEntityRecognizerSummariesResponse>(
  "ListEntityRecognizerSummariesResponse",
)({
  EntityRecognizerSummariesList: S.optional(EntityRecognizerSummariesList),
  NextToken: S.optional(S.String),
}) {}
export class ListEventsDetectionJobsResponse extends S.Class<ListEventsDetectionJobsResponse>(
  "ListEventsDetectionJobsResponse",
)({
  EventsDetectionJobPropertiesList: S.optional(
    EventsDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListFlywheelIterationHistoryResponse extends S.Class<ListFlywheelIterationHistoryResponse>(
  "ListFlywheelIterationHistoryResponse",
)({
  FlywheelIterationPropertiesList: S.optional(FlywheelIterationPropertiesList),
  NextToken: S.optional(S.String),
}) {}
export class ListKeyPhrasesDetectionJobsResponse extends S.Class<ListKeyPhrasesDetectionJobsResponse>(
  "ListKeyPhrasesDetectionJobsResponse",
)({
  KeyPhrasesDetectionJobPropertiesList: S.optional(
    KeyPhrasesDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListPiiEntitiesDetectionJobsResponse extends S.Class<ListPiiEntitiesDetectionJobsResponse>(
  "ListPiiEntitiesDetectionJobsResponse",
)({
  PiiEntitiesDetectionJobPropertiesList: S.optional(
    PiiEntitiesDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListSentimentDetectionJobsResponse extends S.Class<ListSentimentDetectionJobsResponse>(
  "ListSentimentDetectionJobsResponse",
)({
  SentimentDetectionJobPropertiesList: S.optional(
    SentimentDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListTargetedSentimentDetectionJobsResponse extends S.Class<ListTargetedSentimentDetectionJobsResponse>(
  "ListTargetedSentimentDetectionJobsResponse",
)({
  TargetedSentimentDetectionJobPropertiesList: S.optional(
    TargetedSentimentDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListTopicsDetectionJobsResponse extends S.Class<ListTopicsDetectionJobsResponse>(
  "ListTopicsDetectionJobsResponse",
)({
  TopicsDetectionJobPropertiesList: S.optional(
    TopicsDetectionJobPropertiesList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class StartDocumentClassificationJobResponse extends S.Class<StartDocumentClassificationJobResponse>(
  "StartDocumentClassificationJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
  DocumentClassifierArn: S.optional(S.String),
}) {}
export class StartPiiEntitiesDetectionJobResponse extends S.Class<StartPiiEntitiesDetectionJobResponse>(
  "StartPiiEntitiesDetectionJobResponse",
)({
  JobId: S.optional(S.String),
  JobArn: S.optional(S.String),
  JobStatus: S.optional(S.String),
}) {}
export class UpdateFlywheelResponse extends S.Class<UpdateFlywheelResponse>(
  "UpdateFlywheelResponse",
)({ FlywheelProperties: S.optional(FlywheelProperties) }) {}
export class DatasetEntityRecognizerInputDataConfig extends S.Class<DatasetEntityRecognizerInputDataConfig>(
  "DatasetEntityRecognizerInputDataConfig",
)({
  Annotations: S.optional(DatasetEntityRecognizerAnnotations),
  Documents: DatasetEntityRecognizerDocuments,
  EntityList: S.optional(DatasetEntityRecognizerEntityList),
}) {}
export class ExtractedCharactersListItem extends S.Class<ExtractedCharactersListItem>(
  "ExtractedCharactersListItem",
)({ Page: S.optional(S.Number), Count: S.optional(S.Number) }) {}
export const ListOfExtractedCharacters = S.Array(ExtractedCharactersListItem);
export class RelationshipsListItem extends S.Class<RelationshipsListItem>(
  "RelationshipsListItem",
)({ Ids: S.optional(StringList), Type: S.optional(S.String) }) {}
export const ListOfRelationships = S.Array(RelationshipsListItem);
export class DocumentClass extends S.Class<DocumentClass>("DocumentClass")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
  Page: S.optional(S.Number),
}) {}
export const ListOfClasses = S.Array(DocumentClass);
export class DocumentLabel extends S.Class<DocumentLabel>("DocumentLabel")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
  Page: S.optional(S.Number),
}) {}
export const ListOfLabels = S.Array(DocumentLabel);
export class WarningsListItem extends S.Class<WarningsListItem>(
  "WarningsListItem",
)({
  Page: S.optional(S.Number),
  WarnCode: S.optional(S.String),
  WarnMessage: S.optional(S.String),
}) {}
export const ListOfWarnings = S.Array(WarningsListItem);
export class DatasetInputDataConfig extends S.Class<DatasetInputDataConfig>(
  "DatasetInputDataConfig",
)({
  AugmentedManifests: S.optional(DatasetAugmentedManifestsList),
  DataFormat: S.optional(S.String),
  DocumentClassifierInputDataConfig: S.optional(
    DatasetDocumentClassifierInputDataConfig,
  ),
  EntityRecognizerInputDataConfig: S.optional(
    DatasetEntityRecognizerInputDataConfig,
  ),
}) {}
export class InvalidRequestDetail extends S.Class<InvalidRequestDetail>(
  "InvalidRequestDetail",
)({ Reason: S.optional(S.String) }) {}
export class DocumentMetadata extends S.Class<DocumentMetadata>(
  "DocumentMetadata",
)({
  Pages: S.optional(S.Number),
  ExtractedCharacters: S.optional(ListOfExtractedCharacters),
}) {}
export class FlywheelSummary extends S.Class<FlywheelSummary>(
  "FlywheelSummary",
)({
  FlywheelArn: S.optional(S.String),
  ActiveModelArn: S.optional(S.String),
  DataLakeS3Uri: S.optional(S.String),
  Status: S.optional(S.String),
  ModelType: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestFlywheelIteration: S.optional(S.String),
}) {}
export const FlywheelSummaryList = S.Array(FlywheelSummary);
export class BoundingBox extends S.Class<BoundingBox>("BoundingBox")({
  Height: S.optional(S.Number),
  Left: S.optional(S.Number),
  Top: S.optional(S.Number),
  Width: S.optional(S.Number),
}) {}
export class Point extends S.Class<Point>("Point")({
  X: S.optional(S.Number),
  Y: S.optional(S.Number),
}) {}
export const Polygon = S.Array(Point);
export class ClassifyDocumentResponse extends S.Class<ClassifyDocumentResponse>(
  "ClassifyDocumentResponse",
)({
  Classes: S.optional(ListOfClasses),
  Labels: S.optional(ListOfLabels),
  DocumentMetadata: S.optional(DocumentMetadata),
  DocumentType: S.optional(ListOfDocumentType),
  Errors: S.optional(ListOfErrors),
  Warnings: S.optional(ListOfWarnings),
}) {}
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    FlywheelArn: S.String,
    DatasetName: S.String,
    DatasetType: S.optional(S.String),
    Description: S.optional(S.String),
    InputDataConfig: DatasetInputDataConfig,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDocumentClassifierResponse extends S.Class<CreateDocumentClassifierResponse>(
  "CreateDocumentClassifierResponse",
)({ DocumentClassifierArn: S.optional(S.String) }) {}
export class CreateEntityRecognizerResponse extends S.Class<CreateEntityRecognizerResponse>(
  "CreateEntityRecognizerResponse",
)({ EntityRecognizerArn: S.optional(S.String) }) {}
export class CreateFlywheelResponse extends S.Class<CreateFlywheelResponse>(
  "CreateFlywheelResponse",
)({
  FlywheelArn: S.optional(S.String),
  ActiveModelArn: S.optional(S.String),
}) {}
export class DescribeFlywheelIterationResponse extends S.Class<DescribeFlywheelIterationResponse>(
  "DescribeFlywheelIterationResponse",
)({ FlywheelIterationProperties: S.optional(FlywheelIterationProperties) }) {}
export class DescribePiiEntitiesDetectionJobResponse extends S.Class<DescribePiiEntitiesDetectionJobResponse>(
  "DescribePiiEntitiesDetectionJobResponse",
)({
  PiiEntitiesDetectionJobProperties: S.optional(
    PiiEntitiesDetectionJobProperties,
  ),
}) {}
export class DetectSyntaxResponse extends S.Class<DetectSyntaxResponse>(
  "DetectSyntaxResponse",
)({ SyntaxTokens: S.optional(ListOfSyntaxTokens) }) {}
export class ListFlywheelsResponse extends S.Class<ListFlywheelsResponse>(
  "ListFlywheelsResponse",
)({
  FlywheelSummaryList: S.optional(FlywheelSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class Geometry extends S.Class<Geometry>("Geometry")({
  BoundingBox: S.optional(BoundingBox),
  Polygon: S.optional(Polygon),
}) {}
export class ToxicContent extends S.Class<ToxicContent>("ToxicContent")({
  Name: S.optional(S.String),
  Score: S.optional(S.Number),
}) {}
export const ListOfToxicContent = S.Array(ToxicContent);
export class Block extends S.Class<Block>("Block")({
  Id: S.optional(S.String),
  BlockType: S.optional(S.String),
  Text: S.optional(S.String),
  Page: S.optional(S.Number),
  Geometry: S.optional(Geometry),
  Relationships: S.optional(ListOfRelationships),
}) {}
export const ListOfBlocks = S.Array(Block);
export class ToxicLabels extends S.Class<ToxicLabels>("ToxicLabels")({
  Labels: S.optional(ListOfToxicContent),
  Toxicity: S.optional(S.Number),
}) {}
export const ListOfToxicLabels = S.Array(ToxicLabels);
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ DatasetArn: S.optional(S.String) }) {}
export class DescribeDocumentClassifierResponse extends S.Class<DescribeDocumentClassifierResponse>(
  "DescribeDocumentClassifierResponse",
)({ DocumentClassifierProperties: S.optional(DocumentClassifierProperties) }) {}
export class DetectEntitiesResponse extends S.Class<DetectEntitiesResponse>(
  "DetectEntitiesResponse",
)({
  Entities: S.optional(ListOfEntities),
  DocumentMetadata: S.optional(DocumentMetadata),
  DocumentType: S.optional(ListOfDocumentType),
  Blocks: S.optional(ListOfBlocks),
  Errors: S.optional(ListOfErrors),
}) {}
export class DetectTargetedSentimentResponse extends S.Class<DetectTargetedSentimentResponse>(
  "DetectTargetedSentimentResponse",
)({ Entities: S.optional(ListOfTargetedSentimentEntities) }) {}
export class DetectToxicContentResponse extends S.Class<DetectToxicContentResponse>(
  "DetectToxicContentResponse",
)({ ResultList: S.optional(ListOfToxicLabels) }) {}
export class DescribeEntityRecognizerResponse extends S.Class<DescribeEntityRecognizerResponse>(
  "DescribeEntityRecognizerResponse",
)({ EntityRecognizerProperties: S.optional(EntityRecognizerProperties) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class BatchSizeLimitExceededException extends S.TaggedError<BatchSizeLimitExceededException>()(
  "BatchSizeLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    Detail: S.optional(InvalidRequestDetail),
  },
) {}
export class InvalidFilterException extends S.TaggedError<InvalidFilterException>()(
  "InvalidFilterException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class JobNotFoundException extends S.TaggedError<JobNotFoundException>()(
  "JobNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class TextSizeLimitExceededException extends S.TaggedError<TextSizeLimitExceededException>()(
  "TextSizeLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class KmsKeyValidationException extends S.TaggedError<KmsKeyValidationException>()(
  "KmsKeyValidationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedLanguageException extends S.TaggedError<UnsupportedLanguageException>()(
  "UnsupportedLanguageException",
  { Message: S.optional(S.String) },
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagKeysException extends S.TaggedError<TooManyTagKeysException>()(
  "TooManyTagKeysException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets a list of the flywheels that you have created.
 */
export const listFlywheels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFlywheelsRequest,
    output: ListFlywheelsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a classification request to analyze a single document in real-time. `ClassifyDocument`
 * supports the following model types:
 *
 * - Custom classifier - a custom model that you have created and trained.
 * For input, you can provide plain text, a single-page document (PDF, Word, or image), or
 * Amazon Textract API output. For more information, see Custom classification in the *Amazon Comprehend Developer Guide*.
 *
 * - Prompt safety classifier - Amazon Comprehend provides a pre-trained model for classifying
 * input prompts for generative AI applications.
 * For input, you provide English plain text input.
 * For prompt safety classification, the response includes only the `Classes` field.
 * For more information about prompt safety classifiers, see Prompt safety classification in the *Amazon Comprehend Developer Guide*.
 *
 * If the system detects errors while processing a page in the input document,
 * the API response includes an `Errors` field that describes the errors.
 *
 * If the system detects a document-level error in your input document, the API returns an
 * `InvalidRequestException` error response.
 * For details about this exception, see
 *
 * Errors in semi-structured documents in the Comprehend Developer Guide.
 */
export const classifyDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClassifyDocumentRequest,
  output: ClassifyDocumentResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceUnavailableException,
    TextSizeLimitExceededException,
  ],
}));
/**
 * Start the flywheel iteration.This operation uses any new datasets to train a new model version.
 * For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const startFlywheelIteration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartFlywheelIterationRequest,
    output: StartFlywheelIterationResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a model-specific endpoint for a previously-trained custom model. All endpoints
 * must be deleted in order for the model to be deleted.
 * For information about endpoints, see Managing endpoints.
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointRequest,
  output: DeleteEndpointResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an entity recognizer.
 *
 * Only those recognizers that are in terminated states (IN_ERROR, TRAINED) will be deleted.
 * If an active inference job is using the model, a `ResourceInUseException` will be
 * returned.
 *
 * This is an asynchronous action that puts the recognizer into a DELETING state, and it is
 * then removed by a background job. Once removed, the recognizer disappears from your account
 * and is no longer available for use.
 */
export const deleteEntityRecognizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEntityRecognizerRequest,
    output: DeleteEntityRecognizerResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Deletes a flywheel. When you delete the flywheel, Amazon Comprehend
 * does not delete the data lake or the model associated with the flywheel.
 *
 * For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const deleteFlywheel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlywheelRequest,
  output: DeleteFlywheelResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * List the datasets that you have configured in this Region. For more information about datasets, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDatasetsRequest,
    output: ListDatasetsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets the details of a resource-based policy that is attached to a custom model, including
 * the JSON body of the policy.
 */
export const describeResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourcePolicyRequest,
    output: DescribeResourcePolicyResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists all tags associated with a given Amazon Comprehend resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Attaches a resource-based policy to a custom model. You can use this policy to authorize
 * an entity in another Amazon Web Services account to import the custom model, which replicates it in Amazon
 * Comprehend in their account.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a resource-based policy that is attached to a custom model.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Stops a document classifier training job while in progress.
 *
 * If the training job state is `TRAINING`, the job is marked for termination and
 * put into the `STOP_REQUESTED` state. If the training job completes before it can be
 * stopped, it is put into the `TRAINED`; otherwise the training job is stopped and
 * put into the `STOPPED` state and the service sends back an HTTP 200 response with
 * an empty HTTP body.
 */
export const stopTrainingDocumentClassifier =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopTrainingDocumentClassifierRequest,
    output: StopTrainingDocumentClassifierResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Stops an entity recognizer training job while in progress.
 *
 * If the training job state is `TRAINING`, the job is marked for termination and
 * put into the `STOP_REQUESTED` state. If the training job completes before it can be
 * stopped, it is put into the `TRAINED`; otherwise the training job is stopped and
 * putted into the `STOPPED` state and the service sends back an HTTP 200 response
 * with an empty HTTP body.
 */
export const stopTrainingEntityRecognizer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopTrainingEntityRecognizerRequest,
    output: StopTrainingEntityRecognizerResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Returns information about the dataset that you specify.
 * For more information about datasets, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the properties associated with a specific endpoint. Use this operation to get the
 * status of an endpoint.
 * For information about endpoints, see Managing endpoints.
 */
export const describeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointRequest,
  output: DescribeEndpointResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides configuration information about the flywheel. For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const describeFlywheel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFlywheelRequest,
  output: DescribeFlywheelResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Information about the history of a flywheel iteration.
 * For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const listFlywheelIterationHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFlywheelIterationHistoryRequest,
    output: ListFlywheelIterationHistoryResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes a previously created document classifier
 *
 * Only those classifiers that are in terminated states (IN_ERROR, TRAINED) will be deleted.
 * If an active inference job is using the model, a `ResourceInUseException` will be
 * returned.
 *
 * This is an asynchronous action that puts the classifier into a DELETING state, and it is
 * then removed by a background job. Once removed, the classifier disappears from your account
 * and is no longer available for use.
 */
export const deleteDocumentClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDocumentClassifierRequest,
    output: DeleteDocumentClassifierResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with a document classifier.
 */
export const describeDocumentClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDocumentClassifierRequest,
    output: DescribeDocumentClassifierResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Stops a dominant language detection job in progress.
 *
 * If the job state is `IN_PROGRESS` the job is marked for termination and put
 * into the `STOP_REQUESTED` state. If the job completes before it can be stopped, it
 * is put into the `COMPLETED` state; otherwise the job is stopped and put into the
 * `STOPPED` state.
 *
 * If the job is in the `COMPLETED` or `FAILED` state when you call the
 * `StopDominantLanguageDetectionJob` operation, the operation returns a 400
 * Internal Request Exception.
 *
 * When a job is stopped, any documents already processed are written to the output
 * location.
 */
export const stopDominantLanguageDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopDominantLanguageDetectionJobRequest,
    output: StopDominantLanguageDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }));
/**
 * Stops an entities detection job in progress.
 *
 * If the job state is `IN_PROGRESS` the job is marked for termination and put
 * into the `STOP_REQUESTED` state. If the job completes before it can be stopped, it
 * is put into the `COMPLETED` state; otherwise the job is stopped and put into the
 * `STOPPED` state.
 *
 * If the job is in the `COMPLETED` or `FAILED` state when you call the
 * `StopDominantLanguageDetectionJob` operation, the operation returns a 400
 * Internal Request Exception.
 *
 * When a job is stopped, any documents already processed are written to the output
 * location.
 */
export const stopEntitiesDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEntitiesDetectionJobRequest,
    output: StopEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }),
);
/**
 * Stops an events detection job in progress.
 */
export const stopEventsDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEventsDetectionJobRequest,
    output: StopEventsDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }),
);
/**
 * Stops a key phrases detection job in progress.
 *
 * If the job state is `IN_PROGRESS` the job is marked for termination and put
 * into the `STOP_REQUESTED` state. If the job completes before it can be stopped, it
 * is put into the `COMPLETED` state; otherwise the job is stopped and put into the
 * `STOPPED` state.
 *
 * If the job is in the `COMPLETED` or `FAILED` state when you call the
 * `StopDominantLanguageDetectionJob` operation, the operation returns a 400
 * Internal Request Exception.
 *
 * When a job is stopped, any documents already processed are written to the output
 * location.
 */
export const stopKeyPhrasesDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopKeyPhrasesDetectionJobRequest,
    output: StopKeyPhrasesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }),
);
/**
 * Stops a PII entities detection job in progress.
 */
export const stopPiiEntitiesDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopPiiEntitiesDetectionJobRequest,
    output: StopPiiEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }),
);
/**
 * Stops a sentiment detection job in progress.
 *
 * If the job state is `IN_PROGRESS`, the job is marked for termination and put
 * into the `STOP_REQUESTED` state. If the job completes before it can be stopped, it
 * is put into the `COMPLETED` state; otherwise the job is be stopped and put into the
 * `STOPPED` state.
 *
 * If the job is in the `COMPLETED` or `FAILED` state when you call the
 * `StopDominantLanguageDetectionJob` operation, the operation returns a 400
 * Internal Request Exception.
 *
 * When a job is stopped, any documents already processed are written to the output
 * location.
 */
export const stopSentimentDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopSentimentDetectionJobRequest,
    output: StopSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }),
);
/**
 * Stops a targeted sentiment detection job in progress.
 *
 * If the job state is `IN_PROGRESS`, the job is marked for termination and put
 * into the `STOP_REQUESTED` state. If the job completes before it can be stopped, it
 * is put into the `COMPLETED` state; otherwise the job is be stopped and put into the
 * `STOPPED` state.
 *
 * If the job is in the `COMPLETED` or `FAILED` state when you call the
 * `StopDominantLanguageDetectionJob` operation, the operation returns a 400
 * Internal Request Exception.
 *
 * When a job is stopped, any documents already processed are written to the output
 * location.
 */
export const stopTargetedSentimentDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopTargetedSentimentDetectionJobRequest,
    output: StopTargetedSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
    ],
  }));
/**
 * Gets the properties associated with a document classification job. Use this operation to
 * get the status of a classification job.
 */
export const describeDocumentClassificationJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDocumentClassificationJobRequest,
    output: DescribeDocumentClassificationJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the properties associated with a dominant language detection job. Use this operation
 * to get the status of a detection job.
 */
export const describeDominantLanguageDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDominantLanguageDetectionJobRequest,
    output: DescribeDominantLanguageDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the properties associated with an entities detection job. Use this operation to get
 * the status of a detection job.
 */
export const describeEntitiesDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEntitiesDetectionJobRequest,
    output: DescribeEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the status and details of an events detection job.
 */
export const describeEventsDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventsDetectionJobRequest,
    output: DescribeEventsDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with a key phrases detection job. Use this operation to get
 * the status of a detection job.
 */
export const describeKeyPhrasesDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeKeyPhrasesDetectionJobRequest,
    output: DescribeKeyPhrasesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the properties associated with a sentiment detection job. Use this operation to get
 * the status of a detection job.
 */
export const describeSentimentDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSentimentDetectionJobRequest,
    output: DescribeSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the properties associated with a targeted sentiment detection job. Use this operation
 * to get the status of the job.
 */
export const describeTargetedSentimentDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTargetedSentimentDetectionJobRequest,
    output: DescribeTargetedSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets the properties associated with a topic detection job. Use this operation to get
 * the status of a detection job.
 */
export const describeTopicsDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTopicsDetectionJobRequest,
    output: DescribeTopicsDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Determines the dominant language of the input text. For a list of languages that Amazon
 * Comprehend can detect, see Amazon Comprehend Supported Languages.
 */
export const detectDominantLanguage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectDominantLanguageRequest,
    output: DetectDominantLanguageResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
    ],
  }),
);
/**
 * Determines the dominant language of the input text for a batch of documents. For a list
 * of languages that Amazon Comprehend can detect, see Amazon Comprehend Supported Languages.
 */
export const batchDetectDominantLanguage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDetectDominantLanguageRequest,
    output: BatchDetectDominantLanguageResponse,
    errors: [
      BatchSizeLimitExceededException,
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
    ],
  }),
);
/**
 * Gets a list of summaries of the document classifiers that you have created
 */
export const listDocumentClassifierSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDocumentClassifierSummariesRequest,
    output: ListDocumentClassifierSummariesResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of all existing endpoints that you've created.
 * For information about endpoints, see Managing endpoints.
 */
export const listEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEndpointsRequest,
    output: ListEndpointsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "EndpointPropertiesList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets a list of summaries for the entity recognizers that you have created.
 */
export const listEntityRecognizerSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEntityRecognizerSummariesRequest,
    output: ListEntityRecognizerSummariesResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the documentation classification jobs that you have submitted.
 */
export const listDocumentClassificationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDocumentClassificationJobsRequest,
    output: ListDocumentClassificationJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the document classifiers that you have created.
 */
export const listDocumentClassifiers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDocumentClassifiersRequest,
    output: ListDocumentClassifiersResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the dominant language detection jobs that you have submitted.
 */
export const listDominantLanguageDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDominantLanguageDetectionJobsRequest,
    output: ListDominantLanguageDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the entity detection jobs that you have submitted.
 */
export const listEntitiesDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEntitiesDetectionJobsRequest,
    output: ListEntitiesDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the properties of all entity recognizers that you created, including
 * recognizers currently in training. Allows you to filter the list of recognizers based on
 * criteria such as status and submission time. This call returns up to 500 entity recognizers in
 * the list, with a default number of 100 recognizers in the list.
 *
 * The results of this list are not in any particular order. Please get the list and sort
 * locally if needed.
 */
export const listEntityRecognizers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEntityRecognizersRequest,
    output: ListEntityRecognizersResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the events detection jobs that you have submitted.
 */
export const listEventsDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEventsDetectionJobsRequest,
    output: ListEventsDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Get a list of key phrase detection jobs that you have submitted.
 */
export const listKeyPhrasesDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListKeyPhrasesDetectionJobsRequest,
    output: ListKeyPhrasesDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the PII entity detection jobs that you have submitted.
 */
export const listPiiEntitiesDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPiiEntitiesDetectionJobsRequest,
    output: ListPiiEntitiesDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PiiEntitiesDetectionJobPropertiesList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of sentiment detection jobs that you have submitted.
 */
export const listSentimentDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSentimentDetectionJobsRequest,
    output: ListSentimentDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of targeted sentiment detection jobs that you have submitted.
 */
export const listTargetedSentimentDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTargetedSentimentDetectionJobsRequest,
    output: ListTargetedSentimentDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets a list of the topic detection jobs that you have submitted.
 */
export const listTopicsDetectionJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTopicsDetectionJobsRequest,
    output: ListTopicsDetectionJobsResponse,
    errors: [
      InternalServerException,
      InvalidFilterException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieve the configuration properties of a flywheel iteration.
 * For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const describeFlywheelIteration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFlywheelIterationRequest,
    output: DescribeFlywheelIterationResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the properties associated with a PII entities detection job. For example, you can use
 * this operation to get the job status.
 */
export const describePiiEntitiesDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePiiEntitiesDetectionJobRequest,
    output: DescribePiiEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      JobNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Update the configuration information for an existing flywheel.
 */
export const updateFlywheel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlywheelRequest,
  output: UpdateFlywheelResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    KmsKeyValidationException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides details about an entity recognizer including status, S3 buckets containing
 * training data, recognizer metadata, metrics, and so on.
 */
export const describeEntityRecognizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEntityRecognizerRequest,
    output: DescribeEntityRecognizerResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Inspects text for syntax and the part of speech of words in the document. For more
 * information, see
 * Syntax in the Comprehend Developer Guide.
 */
export const detectSyntax = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectSyntaxRequest,
  output: DetectSyntaxResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Associates a specific tag with an Amazon Comprehend resource. A tag is a key-value pair
 * that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with
 * "Sales" as the key might be added to a resource to indicate its use by the sales department.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Removes a specific tag associated with an Amazon Comprehend resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyTagKeysException,
  ],
}));
/**
 * Inspects the input text and returns a sentiment analysis for each entity identified in the text.
 *
 * For more information about targeted sentiment, see Targeted sentiment in the *Amazon Comprehend Developer Guide*.
 */
export const detectTargetedSentiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectTargetedSentimentRequest,
    output: DetectTargetedSentimentResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
      UnsupportedLanguageException,
    ],
  }),
);
/**
 * Performs toxicity analysis on the list of text strings that you provide as input.
 * The API response contains a results list that matches the size of the input list.
 * For more information about toxicity detection, see Toxicity detection in the *Amazon Comprehend Developer Guide*.
 */
export const detectToxicContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectToxicContentRequest,
  output: DetectToxicContentResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Inspects the text of a batch of documents for named entities and returns information
 * about them. For more information about named entities, see
 * Entities in the Comprehend Developer Guide.
 */
export const batchDetectEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDetectEntitiesRequest,
  output: BatchDetectEntitiesResponse,
  errors: [
    BatchSizeLimitExceededException,
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Detects the key noun phrases found in a batch of documents.
 */
export const batchDetectKeyPhrases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDetectKeyPhrasesRequest,
    output: BatchDetectKeyPhrasesResponse,
    errors: [
      BatchSizeLimitExceededException,
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
      UnsupportedLanguageException,
    ],
  }),
);
/**
 * Inspects a batch of documents and returns an inference of the prevailing sentiment,
 * `POSITIVE`, `NEUTRAL`, `MIXED`, or `NEGATIVE`,
 * in each one.
 */
export const batchDetectSentiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDetectSentimentRequest,
    output: BatchDetectSentimentResponse,
    errors: [
      BatchSizeLimitExceededException,
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
      UnsupportedLanguageException,
    ],
  }),
);
/**
 * Inspects the text of a batch of documents for the syntax and part of speech of the words
 * in the document and returns information about them. For more information, see
 * Syntax in the Comprehend Developer Guide.
 */
export const batchDetectSyntax = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDetectSyntaxRequest,
  output: BatchDetectSyntaxResponse,
  errors: [
    BatchSizeLimitExceededException,
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Inspects a batch of documents and returns a sentiment analysis
 * for each entity identified in the documents.
 *
 * For more information about targeted sentiment, see Targeted sentiment in the *Amazon Comprehend Developer Guide*.
 */
export const batchDetectTargetedSentiment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDetectTargetedSentimentRequest,
    output: BatchDetectTargetedSentimentResponse,
    errors: [
      BatchSizeLimitExceededException,
      InternalServerException,
      InvalidRequestException,
      TextSizeLimitExceededException,
      UnsupportedLanguageException,
    ],
  }));
/**
 * Analyzes input text for the presence of personally identifiable information (PII) and
 * returns the labels of identified PII entity types such as name, address, bank account number,
 * or phone number.
 */
export const containsPiiEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ContainsPiiEntitiesRequest,
  output: ContainsPiiEntitiesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Detects the key noun phrases found in the text.
 */
export const detectKeyPhrases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectKeyPhrasesRequest,
  output: DetectKeyPhrasesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Inspects the input text for entities that contain personally identifiable information
 * (PII) and returns information about them.
 */
export const detectPiiEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectPiiEntitiesRequest,
  output: DetectPiiEntitiesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Inspects text and returns an inference of the prevailing sentiment
 * (`POSITIVE`, `NEUTRAL`, `MIXED`, or `NEGATIVE`).
 */
export const detectSentiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectSentimentRequest,
  output: DetectSentimentResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Detects named entities in input text when you use the pre-trained model.
 * Detects custom entities if you have a custom entity recognition model.
 *
 * When detecting named entities using the pre-trained model, use plain text as the input.
 * For more information about named entities, see
 * Entities in the Comprehend Developer Guide.
 *
 * When you use a custom entity recognition model,
 * you can input plain text or you can upload a single-page input document (text, PDF, Word, or image).
 *
 * If the system detects errors while processing a page in the input document, the API response
 * includes an entry in `Errors` for each error.
 *
 * If the system detects a document-level error in your input document, the API returns an
 * `InvalidRequestException` error response.
 * For details about this exception, see
 *
 * Errors in semi-structured documents in the Comprehend Developer Guide.
 */
export const detectEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectEntitiesRequest,
  output: DetectEntitiesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceUnavailableException,
    TextSizeLimitExceededException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Updates information about the specified endpoint.
 * For information about endpoints, see Managing endpoints.
 */
export const updateEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointRequest,
  output: UpdateEndpointResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a model-specific endpoint for synchronous inference for a previously trained
 * custom model
 * For information about endpoints, see Managing endpoints.
 */
export const createEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointRequest,
  output: CreateEndpointResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a dataset to upload training or test data for a model associated with a flywheel.
 * For more information about datasets, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a new document classifier that you can use to categorize documents. To create a
 * classifier, you provide a set of training documents that are labeled with the categories that you
 * want to use. For more information, see
 * Training classifier models
 * in the Comprehend Developer Guide.
 */
export const createDocumentClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDocumentClassifierRequest,
    output: CreateDocumentClassifierResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      ResourceLimitExceededException,
      TooManyRequestsException,
      TooManyTagsException,
      UnsupportedLanguageException,
    ],
  }),
);
/**
 * Creates an entity recognizer using submitted files. After your
 * `CreateEntityRecognizer` request is submitted, you can check job status using the
 * `DescribeEntityRecognizer` API.
 */
export const createEntityRecognizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEntityRecognizerRequest,
    output: CreateEntityRecognizerResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      ResourceLimitExceededException,
      TooManyRequestsException,
      TooManyTagsException,
      UnsupportedLanguageException,
    ],
  }),
);
/**
 * A flywheel is an Amazon Web Services resource that orchestrates the ongoing training of a model for custom classification
 * or custom entity recognition. You can create a flywheel to start with an existing trained model, or
 * Comprehend can create and train a new model.
 *
 * When you create the flywheel, Comprehend creates a data lake in your account. The data lake holds the training
 * data and test data for all versions of the model.
 *
 * To use a flywheel with an existing trained model, you specify the active model version. Comprehend copies the model's
 * training data and test data into the flywheel's data lake.
 *
 * To use the flywheel with a new model, you need to provide a dataset for training data (and optional test data)
 * when you create the flywheel.
 *
 * For more information about flywheels, see
 * Flywheel overview in the *Amazon Comprehend Developer Guide*.
 */
export const createFlywheel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlywheelRequest,
  output: CreateFlywheelResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    KmsKeyValidationException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
    TooManyTagsException,
    UnsupportedLanguageException,
  ],
}));
/**
 * Starts an asynchronous dominant language detection job for a collection of documents. Use
 * the operation to track the status
 * of a job.
 */
export const startDominantLanguageDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDominantLanguageDetectionJobRequest,
    output: StartDominantLanguageDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }));
/**
 * Starts an asynchronous entity detection job for a collection of documents. Use the operation to track the status of a job.
 *
 * This API can be used for either standard entity detection or custom entity recognition. In
 * order to be used for custom entity recognition, the optional `EntityRecognizerArn`
 * must be used in order to provide access to the recognizer being used to detect the custom
 * entity.
 */
export const startEntitiesDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartEntitiesDetectionJobRequest,
    output: StartEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Starts an asynchronous event detection job for a collection of documents.
 */
export const startEventsDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartEventsDetectionJobRequest,
    output: StartEventsDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Starts an asynchronous key phrase detection job for a collection of documents. Use the
 * operation to track the status of a
 * job.
 */
export const startKeyPhrasesDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartKeyPhrasesDetectionJobRequest,
    output: StartKeyPhrasesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Starts an asynchronous sentiment detection job for a collection of documents. Use the
 * operation to track the status of a
 * job.
 */
export const startSentimentDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSentimentDetectionJobRequest,
    output: StartSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Starts an asynchronous targeted sentiment detection job for a collection of documents. Use the
 * `DescribeTargetedSentimentDetectionJob` operation to track the status of a
 * job.
 */
export const startTargetedSentimentDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartTargetedSentimentDetectionJobRequest,
    output: StartTargetedSentimentDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }));
/**
 * Starts an asynchronous topic detection job. Use the
 * `DescribeTopicDetectionJob` operation to track the status of a job.
 */
export const startTopicsDetectionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTopicsDetectionJobRequest,
    output: StartTopicsDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Starts an asynchronous document classification job using a custom classification model. Use the
 * `DescribeDocumentClassificationJob`
 * operation to track the progress of the job.
 */
export const startDocumentClassificationJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDocumentClassificationJobRequest,
    output: StartDocumentClassificationJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }));
/**
 * Starts an asynchronous PII entity detection job for a collection of documents.
 */
export const startPiiEntitiesDetectionJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartPiiEntitiesDetectionJobRequest,
    output: StartPiiEntitiesDetectionJobResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      KmsKeyValidationException,
      ResourceInUseException,
      TooManyRequestsException,
      TooManyTagsException,
    ],
  }));
/**
 * Creates a new custom model that replicates a source custom model that you import. The
 * source model can be in your Amazon Web Services account or another one.
 *
 * If the source model is in another Amazon Web Services account, then it must have a resource-based policy
 * that authorizes you to import it.
 *
 * The source model must be in the same Amazon Web Services Region that you're using when you import. You
 * can't import a model that's in a different Region.
 */
export const importModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportModelRequest,
  output: ImportModelResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    KmsKeyValidationException,
    ResourceInUseException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));

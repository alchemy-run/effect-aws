import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://hawksnest.amazonaws.com/doc/2019-11-15");
const svc = T.AwsApiService({
  sdkId: "FraudDetector",
  serviceShapeName: "AWSHawksNestServiceFacade",
});
const auth = T.AwsAuthSigv4({ name: "frauddetector" });
const ver = T.ServiceVersion("2019-11-15");
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
                        url: "https://frauddetector-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://frauddetector-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://frauddetector.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://frauddetector.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetKMSEncryptionKeyRequest extends S.Class<GetKMSEncryptionKeyRequest>(
  "GetKMSEncryptionKeyRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const NameList = S.Array(S.String);
export const ListOfStrings = S.Array(S.String);
export const ElementsList = S.Array(S.String);
export const NonEmptyListOfStrings = S.Array(S.String);
export const tagKeyList = S.Array(S.String);
export class BatchGetVariableRequest extends S.Class<BatchGetVariableRequest>(
  "BatchGetVariableRequest",
)(
  { names: NameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelBatchImportJobRequest extends S.Class<CancelBatchImportJobRequest>(
  "CancelBatchImportJobRequest",
)(
  { jobId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelBatchImportJobResult extends S.Class<CancelBatchImportJobResult>(
  "CancelBatchImportJobResult",
)({}, ns) {}
export class CancelBatchPredictionJobRequest extends S.Class<CancelBatchPredictionJobRequest>(
  "CancelBatchPredictionJobRequest",
)(
  { jobId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelBatchPredictionJobResult extends S.Class<CancelBatchPredictionJobResult>(
  "CancelBatchPredictionJobResult",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const tagList = S.Array(Tag);
export class CreateBatchImportJobRequest extends S.Class<CreateBatchImportJobRequest>(
  "CreateBatchImportJobRequest",
)(
  {
    jobId: S.String,
    inputPath: S.String,
    outputPath: S.String,
    eventTypeName: S.String,
    iamRoleArn: S.String,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBatchImportJobResult extends S.Class<CreateBatchImportJobResult>(
  "CreateBatchImportJobResult",
)({}, ns) {}
export class CreateBatchPredictionJobRequest extends S.Class<CreateBatchPredictionJobRequest>(
  "CreateBatchPredictionJobRequest",
)(
  {
    jobId: S.String,
    inputPath: S.String,
    outputPath: S.String,
    eventTypeName: S.String,
    detectorName: S.String,
    detectorVersion: S.optional(S.String),
    iamRoleArn: S.String,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBatchPredictionJobResult extends S.Class<CreateBatchPredictionJobResult>(
  "CreateBatchPredictionJobResult",
)({}, ns) {}
export class CreateListRequest extends S.Class<CreateListRequest>(
  "CreateListRequest",
)(
  {
    name: S.String,
    elements: S.optional(ElementsList),
    variableType: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateListResult extends S.Class<CreateListResult>(
  "CreateListResult",
)({}, ns) {}
export class CreateModelRequest extends S.Class<CreateModelRequest>(
  "CreateModelRequest",
)(
  {
    modelId: S.String,
    modelType: S.String,
    description: S.optional(S.String),
    eventTypeName: S.String,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelResult extends S.Class<CreateModelResult>(
  "CreateModelResult",
)({}, ns) {}
export class CreateRuleRequest extends S.Class<CreateRuleRequest>(
  "CreateRuleRequest",
)(
  {
    ruleId: S.String,
    detectorId: S.String,
    description: S.optional(S.String),
    expression: S.String,
    language: S.String,
    outcomes: NonEmptyListOfStrings,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVariableRequest extends S.Class<CreateVariableRequest>(
  "CreateVariableRequest",
)(
  {
    name: S.String,
    dataType: S.String,
    dataSource: S.String,
    defaultValue: S.String,
    description: S.optional(S.String),
    variableType: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVariableResult extends S.Class<CreateVariableResult>(
  "CreateVariableResult",
)({}, ns) {}
export class DeleteBatchImportJobRequest extends S.Class<DeleteBatchImportJobRequest>(
  "DeleteBatchImportJobRequest",
)(
  { jobId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBatchImportJobResult extends S.Class<DeleteBatchImportJobResult>(
  "DeleteBatchImportJobResult",
)({}, ns) {}
export class DeleteBatchPredictionJobRequest extends S.Class<DeleteBatchPredictionJobRequest>(
  "DeleteBatchPredictionJobRequest",
)(
  { jobId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBatchPredictionJobResult extends S.Class<DeleteBatchPredictionJobResult>(
  "DeleteBatchPredictionJobResult",
)({}, ns) {}
export class DeleteDetectorRequest extends S.Class<DeleteDetectorRequest>(
  "DeleteDetectorRequest",
)(
  { detectorId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDetectorResult extends S.Class<DeleteDetectorResult>(
  "DeleteDetectorResult",
)({}, ns) {}
export class DeleteDetectorVersionRequest extends S.Class<DeleteDetectorVersionRequest>(
  "DeleteDetectorVersionRequest",
)(
  { detectorId: S.String, detectorVersionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDetectorVersionResult extends S.Class<DeleteDetectorVersionResult>(
  "DeleteDetectorVersionResult",
)({}, ns) {}
export class DeleteEntityTypeRequest extends S.Class<DeleteEntityTypeRequest>(
  "DeleteEntityTypeRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEntityTypeResult extends S.Class<DeleteEntityTypeResult>(
  "DeleteEntityTypeResult",
)({}, ns) {}
export class DeleteEventRequest extends S.Class<DeleteEventRequest>(
  "DeleteEventRequest",
)(
  {
    eventId: S.String,
    eventTypeName: S.String,
    deleteAuditHistory: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventResult extends S.Class<DeleteEventResult>(
  "DeleteEventResult",
)({}, ns) {}
export class DeleteEventsByEventTypeRequest extends S.Class<DeleteEventsByEventTypeRequest>(
  "DeleteEventsByEventTypeRequest",
)(
  { eventTypeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventTypeRequest extends S.Class<DeleteEventTypeRequest>(
  "DeleteEventTypeRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventTypeResult extends S.Class<DeleteEventTypeResult>(
  "DeleteEventTypeResult",
)({}, ns) {}
export class DeleteExternalModelRequest extends S.Class<DeleteExternalModelRequest>(
  "DeleteExternalModelRequest",
)(
  { modelEndpoint: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExternalModelResult extends S.Class<DeleteExternalModelResult>(
  "DeleteExternalModelResult",
)({}, ns) {}
export class DeleteLabelRequest extends S.Class<DeleteLabelRequest>(
  "DeleteLabelRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLabelResult extends S.Class<DeleteLabelResult>(
  "DeleteLabelResult",
)({}, ns) {}
export class DeleteListRequest extends S.Class<DeleteListRequest>(
  "DeleteListRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteListResult extends S.Class<DeleteListResult>(
  "DeleteListResult",
)({}, ns) {}
export class DeleteModelRequest extends S.Class<DeleteModelRequest>(
  "DeleteModelRequest",
)(
  { modelId: S.String, modelType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelResult extends S.Class<DeleteModelResult>(
  "DeleteModelResult",
)({}, ns) {}
export class DeleteModelVersionRequest extends S.Class<DeleteModelVersionRequest>(
  "DeleteModelVersionRequest",
)(
  { modelId: S.String, modelType: S.String, modelVersionNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelVersionResult extends S.Class<DeleteModelVersionResult>(
  "DeleteModelVersionResult",
)({}, ns) {}
export class DeleteOutcomeRequest extends S.Class<DeleteOutcomeRequest>(
  "DeleteOutcomeRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOutcomeResult extends S.Class<DeleteOutcomeResult>(
  "DeleteOutcomeResult",
)({}, ns) {}
export class Rule extends S.Class<Rule>("Rule")({
  detectorId: S.String,
  ruleId: S.String,
  ruleVersion: S.String,
}) {}
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  { rule: Rule },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleResult extends S.Class<DeleteRuleResult>(
  "DeleteRuleResult",
)({}, ns) {}
export class DeleteVariableRequest extends S.Class<DeleteVariableRequest>(
  "DeleteVariableRequest",
)(
  { name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVariableResult extends S.Class<DeleteVariableResult>(
  "DeleteVariableResult",
)({}, ns) {}
export class DescribeDetectorRequest extends S.Class<DescribeDetectorRequest>(
  "DescribeDetectorRequest",
)(
  {
    detectorId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelVersionsRequest extends S.Class<DescribeModelVersionsRequest>(
  "DescribeModelVersionsRequest",
)(
  {
    modelId: S.optional(S.String),
    modelVersionNumber: S.optional(S.String),
    modelType: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBatchImportJobsRequest extends S.Class<GetBatchImportJobsRequest>(
  "GetBatchImportJobsRequest",
)(
  {
    jobId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBatchPredictionJobsRequest extends S.Class<GetBatchPredictionJobsRequest>(
  "GetBatchPredictionJobsRequest",
)(
  {
    jobId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeleteEventsByEventTypeStatusRequest extends S.Class<GetDeleteEventsByEventTypeStatusRequest>(
  "GetDeleteEventsByEventTypeStatusRequest",
)(
  { eventTypeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDetectorsRequest extends S.Class<GetDetectorsRequest>(
  "GetDetectorsRequest",
)(
  {
    detectorId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDetectorVersionRequest extends S.Class<GetDetectorVersionRequest>(
  "GetDetectorVersionRequest",
)(
  { detectorId: S.String, detectorVersionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEntityTypesRequest extends S.Class<GetEntityTypesRequest>(
  "GetEntityTypesRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventRequest extends S.Class<GetEventRequest>(
  "GetEventRequest",
)(
  { eventId: S.String, eventTypeName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventPredictionMetadataRequest extends S.Class<GetEventPredictionMetadataRequest>(
  "GetEventPredictionMetadataRequest",
)(
  {
    eventId: S.String,
    eventTypeName: S.String,
    detectorId: S.String,
    detectorVersionId: S.String,
    predictionTimestamp: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventTypesRequest extends S.Class<GetEventTypesRequest>(
  "GetEventTypesRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExternalModelsRequest extends S.Class<GetExternalModelsRequest>(
  "GetExternalModelsRequest",
)(
  {
    modelEndpoint: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLabelsRequest extends S.Class<GetLabelsRequest>(
  "GetLabelsRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetListElementsRequest extends S.Class<GetListElementsRequest>(
  "GetListElementsRequest",
)(
  {
    name: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetListsMetadataRequest extends S.Class<GetListsMetadataRequest>(
  "GetListsMetadataRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetModelsRequest extends S.Class<GetModelsRequest>(
  "GetModelsRequest",
)(
  {
    modelId: S.optional(S.String),
    modelType: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetModelVersionRequest extends S.Class<GetModelVersionRequest>(
  "GetModelVersionRequest",
)(
  { modelId: S.String, modelType: S.String, modelVersionNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOutcomesRequest extends S.Class<GetOutcomesRequest>(
  "GetOutcomesRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRulesRequest extends S.Class<GetRulesRequest>(
  "GetRulesRequest",
)(
  {
    ruleId: S.optional(S.String),
    detectorId: S.String,
    ruleVersion: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetVariablesRequest extends S.Class<GetVariablesRequest>(
  "GetVariablesRequest",
)(
  {
    name: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    resourceARN: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDetectorRequest extends S.Class<PutDetectorRequest>(
  "PutDetectorRequest",
)(
  {
    detectorId: S.String,
    description: S.optional(S.String),
    eventTypeName: S.String,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDetectorResult extends S.Class<PutDetectorResult>(
  "PutDetectorResult",
)({}, ns) {}
export class PutEntityTypeRequest extends S.Class<PutEntityTypeRequest>(
  "PutEntityTypeRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEntityTypeResult extends S.Class<PutEntityTypeResult>(
  "PutEntityTypeResult",
)({}, ns) {}
export class PutKMSEncryptionKeyRequest extends S.Class<PutKMSEncryptionKeyRequest>(
  "PutKMSEncryptionKeyRequest",
)(
  { kmsEncryptionKeyArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutKMSEncryptionKeyResult extends S.Class<PutKMSEncryptionKeyResult>(
  "PutKMSEncryptionKeyResult",
)({}, ns) {}
export class PutLabelRequest extends S.Class<PutLabelRequest>(
  "PutLabelRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLabelResult extends S.Class<PutLabelResult>("PutLabelResult")(
  {},
  ns,
) {}
export class PutOutcomeRequest extends S.Class<PutOutcomeRequest>(
  "PutOutcomeRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutOutcomeResult extends S.Class<PutOutcomeResult>(
  "PutOutcomeResult",
)({}, ns) {}
export const EventVariableMap = S.Record({ key: S.String, value: S.String });
export class Entity extends S.Class<Entity>("Entity")({
  entityType: S.String,
  entityId: S.String,
}) {}
export const listOfEntities = S.Array(Entity);
export class SendEventRequest extends S.Class<SendEventRequest>(
  "SendEventRequest",
)(
  {
    eventId: S.String,
    eventTypeName: S.String,
    eventTimestamp: S.String,
    eventVariables: EventVariableMap,
    assignedLabel: S.optional(S.String),
    labelTimestamp: S.optional(S.String),
    entities: listOfEntities,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendEventResult extends S.Class<SendEventResult>(
  "SendEventResult",
)({}, ns) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceARN: S.String, tags: tagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceARN: S.String, tagKeys: tagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({}, ns) {}
export const RuleList = S.Array(Rule);
export class ModelVersion extends S.Class<ModelVersion>("ModelVersion")({
  modelId: S.String,
  modelType: S.String,
  modelVersionNumber: S.String,
  arn: S.optional(S.String),
}) {}
export const ListOfModelVersions = S.Array(ModelVersion);
export class UpdateDetectorVersionRequest extends S.Class<UpdateDetectorVersionRequest>(
  "UpdateDetectorVersionRequest",
)(
  {
    detectorId: S.String,
    detectorVersionId: S.String,
    externalModelEndpoints: ListOfStrings,
    rules: RuleList,
    description: S.optional(S.String),
    modelVersions: S.optional(ListOfModelVersions),
    ruleExecutionMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDetectorVersionResult extends S.Class<UpdateDetectorVersionResult>(
  "UpdateDetectorVersionResult",
)({}, ns) {}
export class UpdateDetectorVersionMetadataRequest extends S.Class<UpdateDetectorVersionMetadataRequest>(
  "UpdateDetectorVersionMetadataRequest",
)(
  { detectorId: S.String, detectorVersionId: S.String, description: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDetectorVersionMetadataResult extends S.Class<UpdateDetectorVersionMetadataResult>(
  "UpdateDetectorVersionMetadataResult",
)({}, ns) {}
export class UpdateDetectorVersionStatusRequest extends S.Class<UpdateDetectorVersionStatusRequest>(
  "UpdateDetectorVersionStatusRequest",
)(
  { detectorId: S.String, detectorVersionId: S.String, status: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDetectorVersionStatusResult extends S.Class<UpdateDetectorVersionStatusResult>(
  "UpdateDetectorVersionStatusResult",
)({}, ns) {}
export class UpdateEventLabelRequest extends S.Class<UpdateEventLabelRequest>(
  "UpdateEventLabelRequest",
)(
  {
    eventId: S.String,
    eventTypeName: S.String,
    assignedLabel: S.String,
    labelTimestamp: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEventLabelResult extends S.Class<UpdateEventLabelResult>(
  "UpdateEventLabelResult",
)({}, ns) {}
export class UpdateListRequest extends S.Class<UpdateListRequest>(
  "UpdateListRequest",
)(
  {
    name: S.String,
    elements: S.optional(ElementsList),
    description: S.optional(S.String),
    updateMode: S.optional(S.String),
    variableType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateListResult extends S.Class<UpdateListResult>(
  "UpdateListResult",
)({}, ns) {}
export class UpdateModelRequest extends S.Class<UpdateModelRequest>(
  "UpdateModelRequest",
)(
  { modelId: S.String, modelType: S.String, description: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateModelResult extends S.Class<UpdateModelResult>(
  "UpdateModelResult",
)({}, ns) {}
export class ExternalEventsDetail extends S.Class<ExternalEventsDetail>(
  "ExternalEventsDetail",
)({ dataLocation: S.String, dataAccessRoleArn: S.String }) {}
export class IngestedEventsTimeWindow extends S.Class<IngestedEventsTimeWindow>(
  "IngestedEventsTimeWindow",
)({ startTime: S.String, endTime: S.String }) {}
export class IngestedEventsDetail extends S.Class<IngestedEventsDetail>(
  "IngestedEventsDetail",
)({ ingestedEventsTimeWindow: IngestedEventsTimeWindow }) {}
export class UpdateModelVersionRequest extends S.Class<UpdateModelVersionRequest>(
  "UpdateModelVersionRequest",
)(
  {
    modelId: S.String,
    modelType: S.String,
    majorVersionNumber: S.String,
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateModelVersionStatusRequest extends S.Class<UpdateModelVersionStatusRequest>(
  "UpdateModelVersionStatusRequest",
)(
  {
    modelId: S.String,
    modelType: S.String,
    modelVersionNumber: S.String,
    status: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateModelVersionStatusResult extends S.Class<UpdateModelVersionStatusResult>(
  "UpdateModelVersionStatusResult",
)({}, ns) {}
export class UpdateRuleMetadataRequest extends S.Class<UpdateRuleMetadataRequest>(
  "UpdateRuleMetadataRequest",
)(
  { rule: Rule, description: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRuleMetadataResult extends S.Class<UpdateRuleMetadataResult>(
  "UpdateRuleMetadataResult",
)({}, ns) {}
export class UpdateRuleVersionRequest extends S.Class<UpdateRuleVersionRequest>(
  "UpdateRuleVersionRequest",
)(
  {
    rule: Rule,
    description: S.optional(S.String),
    expression: S.String,
    language: S.String,
    outcomes: NonEmptyListOfStrings,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateVariableRequest extends S.Class<UpdateVariableRequest>(
  "UpdateVariableRequest",
)(
  {
    name: S.String,
    defaultValue: S.optional(S.String),
    description: S.optional(S.String),
    variableType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateVariableResult extends S.Class<UpdateVariableResult>(
  "UpdateVariableResult",
)({}, ns) {}
export class VariableEntry extends S.Class<VariableEntry>("VariableEntry")({
  name: S.optional(S.String),
  dataType: S.optional(S.String),
  dataSource: S.optional(S.String),
  defaultValue: S.optional(S.String),
  description: S.optional(S.String),
  variableType: S.optional(S.String),
}) {}
export const VariableEntryList = S.Array(VariableEntry);
export class KMSKey extends S.Class<KMSKey>("KMSKey")({
  kmsEncryptionKeyArn: S.optional(S.String),
}) {}
export class FilterCondition extends S.Class<FilterCondition>(
  "FilterCondition",
)({ value: S.optional(S.String) }) {}
export class PredictionTimeRange extends S.Class<PredictionTimeRange>(
  "PredictionTimeRange",
)({ startTime: S.String, endTime: S.String }) {}
export class EventOrchestration extends S.Class<EventOrchestration>(
  "EventOrchestration",
)({ eventBridgeEnabled: S.Boolean }) {}
export class ModelInputConfiguration extends S.Class<ModelInputConfiguration>(
  "ModelInputConfiguration",
)({
  eventTypeName: S.optional(S.String),
  format: S.optional(S.String),
  useEventVariables: S.Boolean,
  jsonInputTemplate: S.optional(S.String),
  csvInputTemplate: S.optional(S.String),
}) {}
export class BatchCreateVariableRequest extends S.Class<BatchCreateVariableRequest>(
  "BatchCreateVariableRequest",
)(
  { variableEntries: VariableEntryList, tags: S.optional(tagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDetectorVersionRequest extends S.Class<CreateDetectorVersionRequest>(
  "CreateDetectorVersionRequest",
)(
  {
    detectorId: S.String,
    description: S.optional(S.String),
    externalModelEndpoints: S.optional(ListOfStrings),
    rules: RuleList,
    modelVersions: S.optional(ListOfModelVersions),
    ruleExecutionMode: S.optional(S.String),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRuleResult extends S.Class<CreateRuleResult>(
  "CreateRuleResult",
)({ rule: S.optional(Rule) }, ns) {}
export class DeleteEventsByEventTypeResult extends S.Class<DeleteEventsByEventTypeResult>(
  "DeleteEventsByEventTypeResult",
)(
  {
    eventTypeName: S.optional(S.String),
    eventsDeletionStatus: S.optional(S.String),
  },
  ns,
) {}
export class GetDeleteEventsByEventTypeStatusResult extends S.Class<GetDeleteEventsByEventTypeStatusResult>(
  "GetDeleteEventsByEventTypeStatusResult",
)(
  {
    eventTypeName: S.optional(S.String),
    eventsDeletionStatus: S.optional(S.String),
  },
  ns,
) {}
export class GetDetectorVersionResult extends S.Class<GetDetectorVersionResult>(
  "GetDetectorVersionResult",
)(
  {
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    description: S.optional(S.String),
    externalModelEndpoints: S.optional(ListOfStrings),
    modelVersions: S.optional(ListOfModelVersions),
    rules: S.optional(RuleList),
    status: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    ruleExecutionMode: S.optional(S.String),
    arn: S.optional(S.String),
  },
  ns,
) {}
export class GetKMSEncryptionKeyResult extends S.Class<GetKMSEncryptionKeyResult>(
  "GetKMSEncryptionKeyResult",
)({ kmsKey: S.optional(KMSKey) }, ns) {}
export class GetListElementsResult extends S.Class<GetListElementsResult>(
  "GetListElementsResult",
)(
  { elements: S.optional(ElementsList), nextToken: S.optional(S.String) },
  ns,
) {}
export const labelMapper = S.Record({ key: S.String, value: ListOfStrings });
export class LabelSchema extends S.Class<LabelSchema>("LabelSchema")({
  labelMapper: S.optional(labelMapper),
  unlabeledEventsTreatment: S.optional(S.String),
}) {}
export class TrainingDataSchema extends S.Class<TrainingDataSchema>(
  "TrainingDataSchema",
)({ modelVariables: ListOfStrings, labelSchema: S.optional(LabelSchema) }) {}
export class GetModelVersionResult extends S.Class<GetModelVersionResult>(
  "GetModelVersionResult",
)(
  {
    modelId: S.optional(S.String),
    modelType: S.optional(S.String),
    modelVersionNumber: S.optional(S.String),
    trainingDataSource: S.optional(S.String),
    trainingDataSchema: S.optional(TrainingDataSchema),
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
    status: S.optional(S.String),
    arn: S.optional(S.String),
  },
  ns,
) {}
export class Variable extends S.Class<Variable>("Variable")({
  name: S.optional(S.String),
  dataType: S.optional(S.String),
  dataSource: S.optional(S.String),
  defaultValue: S.optional(S.String),
  description: S.optional(S.String),
  variableType: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const VariableList = S.Array(Variable);
export class GetVariablesResult extends S.Class<GetVariablesResult>(
  "GetVariablesResult",
)(
  { variables: S.optional(VariableList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListEventPredictionsRequest extends S.Class<ListEventPredictionsRequest>(
  "ListEventPredictionsRequest",
)(
  {
    eventId: S.optional(FilterCondition),
    eventType: S.optional(FilterCondition),
    detectorId: S.optional(FilterCondition),
    detectorVersionId: S.optional(FilterCondition),
    predictionTimeRange: S.optional(PredictionTimeRange),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ tags: S.optional(tagList), nextToken: S.optional(S.String) }, ns) {}
export class PutEventTypeRequest extends S.Class<PutEventTypeRequest>(
  "PutEventTypeRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    eventVariables: NonEmptyListOfStrings,
    labels: S.optional(ListOfStrings),
    entityTypes: NonEmptyListOfStrings,
    eventIngestion: S.optional(S.String),
    tags: S.optional(tagList),
    eventOrchestration: S.optional(EventOrchestration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEventTypeResult extends S.Class<PutEventTypeResult>(
  "PutEventTypeResult",
)({}, ns) {}
export class UpdateModelVersionResult extends S.Class<UpdateModelVersionResult>(
  "UpdateModelVersionResult",
)(
  {
    modelId: S.optional(S.String),
    modelType: S.optional(S.String),
    modelVersionNumber: S.optional(S.String),
    status: S.optional(S.String),
  },
  ns,
) {}
export class UpdateRuleVersionResult extends S.Class<UpdateRuleVersionResult>(
  "UpdateRuleVersionResult",
)({ rule: S.optional(Rule) }, ns) {}
export class ModelEndpointDataBlob extends S.Class<ModelEndpointDataBlob>(
  "ModelEndpointDataBlob",
)({ byteBuffer: S.optional(T.Blob), contentType: S.optional(S.String) }) {}
export const JsonKeyToVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export const CsvIndexToVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export class BatchGetVariableError extends S.Class<BatchGetVariableError>(
  "BatchGetVariableError",
)({
  name: S.optional(S.String),
  code: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const BatchGetVariableErrorList = S.Array(BatchGetVariableError);
export class DetectorVersionSummary extends S.Class<DetectorVersionSummary>(
  "DetectorVersionSummary",
)({
  detectorVersionId: S.optional(S.String),
  status: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
}) {}
export const DetectorVersionSummaryList = S.Array(DetectorVersionSummary);
export class BatchImport extends S.Class<BatchImport>("BatchImport")({
  jobId: S.optional(S.String),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  startTime: S.optional(S.String),
  completionTime: S.optional(S.String),
  inputPath: S.optional(S.String),
  outputPath: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  iamRoleArn: S.optional(S.String),
  arn: S.optional(S.String),
  processedRecordsCount: S.optional(S.Number),
  failedRecordsCount: S.optional(S.Number),
  totalRecordsCount: S.optional(S.Number),
}) {}
export const BatchImportList = S.Array(BatchImport);
export class BatchPrediction extends S.Class<BatchPrediction>(
  "BatchPrediction",
)({
  jobId: S.optional(S.String),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  startTime: S.optional(S.String),
  completionTime: S.optional(S.String),
  lastHeartbeatTime: S.optional(S.String),
  inputPath: S.optional(S.String),
  outputPath: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  detectorName: S.optional(S.String),
  detectorVersion: S.optional(S.String),
  iamRoleArn: S.optional(S.String),
  arn: S.optional(S.String),
  processedRecordsCount: S.optional(S.Number),
  totalRecordsCount: S.optional(S.Number),
}) {}
export const BatchPredictionList = S.Array(BatchPrediction);
export class Detector extends S.Class<Detector>("Detector")({
  detectorId: S.optional(S.String),
  description: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const DetectorList = S.Array(Detector);
export class EntityType extends S.Class<EntityType>("EntityType")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const entityTypeList = S.Array(EntityType);
export const ExternalModelEndpointDataBlobMap = S.Record({
  key: S.String,
  value: ModelEndpointDataBlob,
});
export class EventVariableSummary extends S.Class<EventVariableSummary>(
  "EventVariableSummary",
)({
  name: S.optional(S.String),
  value: S.optional(S.String),
  source: S.optional(S.String),
}) {}
export const ListOfEventVariableSummaries = S.Array(EventVariableSummary);
export class EvaluatedRule extends S.Class<EvaluatedRule>("EvaluatedRule")({
  ruleId: S.optional(S.String),
  ruleVersion: S.optional(S.String),
  expression: S.optional(S.String),
  expressionWithValues: S.optional(S.String),
  outcomes: S.optional(ListOfStrings),
  evaluated: S.optional(S.Boolean),
  matched: S.optional(S.Boolean),
}) {}
export const EvaluatedRuleList = S.Array(EvaluatedRule);
export class ModelOutputConfiguration extends S.Class<ModelOutputConfiguration>(
  "ModelOutputConfiguration",
)({
  format: S.String,
  jsonKeyToVariableMap: S.optional(JsonKeyToVariableMap),
  csvIndexToVariableMap: S.optional(CsvIndexToVariableMap),
}) {}
export class ExternalModel extends S.Class<ExternalModel>("ExternalModel")({
  modelEndpoint: S.optional(S.String),
  modelSource: S.optional(S.String),
  invokeModelEndpointRoleArn: S.optional(S.String),
  inputConfiguration: S.optional(ModelInputConfiguration),
  outputConfiguration: S.optional(ModelOutputConfiguration),
  modelEndpointStatus: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const ExternalModelList = S.Array(ExternalModel);
export class Label extends S.Class<Label>("Label")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const labelList = S.Array(Label);
export class AllowDenyList extends S.Class<AllowDenyList>("AllowDenyList")({
  name: S.String,
  description: S.optional(S.String),
  variableType: S.optional(S.String),
  createdTime: S.optional(S.String),
  updatedTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const AllowDenyLists = S.Array(AllowDenyList);
export class Model extends S.Class<Model>("Model")({
  modelId: S.optional(S.String),
  modelType: S.optional(S.String),
  description: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  createdTime: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const modelList = S.Array(Model);
export class Outcome extends S.Class<Outcome>("Outcome")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const OutcomeList = S.Array(Outcome);
export class RuleDetail extends S.Class<RuleDetail>("RuleDetail")({
  ruleId: S.optional(S.String),
  description: S.optional(S.String),
  detectorId: S.optional(S.String),
  ruleVersion: S.optional(S.String),
  expression: S.optional(S.String),
  language: S.optional(S.String),
  outcomes: S.optional(NonEmptyListOfStrings),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const RuleDetailList = S.Array(RuleDetail);
export class BatchGetVariableResult extends S.Class<BatchGetVariableResult>(
  "BatchGetVariableResult",
)(
  {
    variables: S.optional(VariableList),
    errors: S.optional(BatchGetVariableErrorList),
  },
  ns,
) {}
export class CreateDetectorVersionResult extends S.Class<CreateDetectorVersionResult>(
  "CreateDetectorVersionResult",
)(
  {
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    status: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDetectorResult extends S.Class<DescribeDetectorResult>(
  "DescribeDetectorResult",
)(
  {
    detectorId: S.optional(S.String),
    detectorVersionSummaries: S.optional(DetectorVersionSummaryList),
    nextToken: S.optional(S.String),
    arn: S.optional(S.String),
  },
  ns,
) {}
export class GetBatchImportJobsResult extends S.Class<GetBatchImportJobsResult>(
  "GetBatchImportJobsResult",
)(
  {
    batchImports: S.optional(BatchImportList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetBatchPredictionJobsResult extends S.Class<GetBatchPredictionJobsResult>(
  "GetBatchPredictionJobsResult",
)(
  {
    batchPredictions: S.optional(BatchPredictionList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetDetectorsResult extends S.Class<GetDetectorsResult>(
  "GetDetectorsResult",
)(
  { detectors: S.optional(DetectorList), nextToken: S.optional(S.String) },
  ns,
) {}
export class GetEntityTypesResult extends S.Class<GetEntityTypesResult>(
  "GetEntityTypesResult",
)(
  { entityTypes: S.optional(entityTypeList), nextToken: S.optional(S.String) },
  ns,
) {}
export class GetEventPredictionRequest extends S.Class<GetEventPredictionRequest>(
  "GetEventPredictionRequest",
)(
  {
    detectorId: S.String,
    detectorVersionId: S.optional(S.String),
    eventId: S.String,
    eventTypeName: S.String,
    entities: listOfEntities,
    eventTimestamp: S.String,
    eventVariables: EventVariableMap,
    externalModelEndpointDataBlobs: S.optional(
      ExternalModelEndpointDataBlobMap,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExternalModelsResult extends S.Class<GetExternalModelsResult>(
  "GetExternalModelsResult",
)(
  {
    externalModels: S.optional(ExternalModelList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetLabelsResult extends S.Class<GetLabelsResult>(
  "GetLabelsResult",
)({ labels: S.optional(labelList), nextToken: S.optional(S.String) }, ns) {}
export class GetListsMetadataResult extends S.Class<GetListsMetadataResult>(
  "GetListsMetadataResult",
)({ lists: S.optional(AllowDenyLists), nextToken: S.optional(S.String) }, ns) {}
export class GetModelsResult extends S.Class<GetModelsResult>(
  "GetModelsResult",
)({ nextToken: S.optional(S.String), models: S.optional(modelList) }, ns) {}
export class GetOutcomesResult extends S.Class<GetOutcomesResult>(
  "GetOutcomesResult",
)({ outcomes: S.optional(OutcomeList), nextToken: S.optional(S.String) }, ns) {}
export class GetRulesResult extends S.Class<GetRulesResult>("GetRulesResult")(
  { ruleDetails: S.optional(RuleDetailList), nextToken: S.optional(S.String) },
  ns,
) {}
export class PutExternalModelRequest extends S.Class<PutExternalModelRequest>(
  "PutExternalModelRequest",
)(
  {
    modelEndpoint: S.String,
    modelSource: S.String,
    invokeModelEndpointRoleArn: S.String,
    inputConfiguration: ModelInputConfiguration,
    outputConfiguration: ModelOutputConfiguration,
    modelEndpointStatus: S.String,
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutExternalModelResult extends S.Class<PutExternalModelResult>(
  "PutExternalModelResult",
)({}, ns) {}
export const EventAttributeMap = S.Record({ key: S.String, value: S.String });
export const MapOfStrings = S.Record({ key: S.String, value: S.String });
export class IngestedEventStatistics extends S.Class<IngestedEventStatistics>(
  "IngestedEventStatistics",
)({
  numberOfEvents: S.optional(S.Number),
  eventDataSizeInBytes: S.optional(S.Number),
  leastRecentEvent: S.optional(S.String),
  mostRecentEvent: S.optional(S.String),
  lastUpdatedTime: S.optional(S.String),
}) {}
export class BatchCreateVariableError extends S.Class<BatchCreateVariableError>(
  "BatchCreateVariableError",
)({
  name: S.optional(S.String),
  code: S.optional(S.Number),
  message: S.optional(S.String),
}) {}
export const BatchCreateVariableErrorList = S.Array(BatchCreateVariableError);
export class Event extends S.Class<Event>("Event")({
  eventId: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  eventTimestamp: S.optional(S.String),
  eventVariables: S.optional(EventAttributeMap),
  currentLabel: S.optional(S.String),
  labelTimestamp: S.optional(S.String),
  entities: S.optional(listOfEntities),
}) {}
export class EvaluatedExternalModel extends S.Class<EvaluatedExternalModel>(
  "EvaluatedExternalModel",
)({
  modelEndpoint: S.optional(S.String),
  useEventVariables: S.optional(S.Boolean),
  inputVariables: S.optional(MapOfStrings),
  outputVariables: S.optional(MapOfStrings),
}) {}
export const ListOfEvaluatedExternalModels = S.Array(EvaluatedExternalModel);
export class EventType extends S.Class<EventType>("EventType")({
  name: S.optional(S.String),
  description: S.optional(S.String),
  eventVariables: S.optional(ListOfStrings),
  labels: S.optional(ListOfStrings),
  entityTypes: S.optional(NonEmptyListOfStrings),
  eventIngestion: S.optional(S.String),
  ingestedEventStatistics: S.optional(IngestedEventStatistics),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
  eventOrchestration: S.optional(EventOrchestration),
}) {}
export const eventTypeList = S.Array(EventType);
export class EventPredictionSummary extends S.Class<EventPredictionSummary>(
  "EventPredictionSummary",
)({
  eventId: S.optional(S.String),
  eventTypeName: S.optional(S.String),
  eventTimestamp: S.optional(S.String),
  predictionTimestamp: S.optional(S.String),
  detectorId: S.optional(S.String),
  detectorVersionId: S.optional(S.String),
}) {}
export const ListOfEventPredictionSummaries = S.Array(EventPredictionSummary);
export class BatchCreateVariableResult extends S.Class<BatchCreateVariableResult>(
  "BatchCreateVariableResult",
)({ errors: S.optional(BatchCreateVariableErrorList) }, ns) {}
export class CreateModelVersionRequest extends S.Class<CreateModelVersionRequest>(
  "CreateModelVersionRequest",
)(
  {
    modelId: S.String,
    modelType: S.String,
    trainingDataSource: S.String,
    trainingDataSchema: TrainingDataSchema,
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
    tags: S.optional(tagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventResult extends S.Class<GetEventResult>("GetEventResult")(
  { event: S.optional(Event) },
  ns,
) {}
export class GetEventTypesResult extends S.Class<GetEventTypesResult>(
  "GetEventTypesResult",
)(
  { eventTypes: S.optional(eventTypeList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListEventPredictionsResult extends S.Class<ListEventPredictionsResult>(
  "ListEventPredictionsResult",
)(
  {
    eventPredictionSummaries: S.optional(ListOfEventPredictionSummaries),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class FileValidationMessage extends S.Class<FileValidationMessage>(
  "FileValidationMessage",
)({
  title: S.optional(S.String),
  content: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const fileValidationMessageList = S.Array(FileValidationMessage);
export class FieldValidationMessage extends S.Class<FieldValidationMessage>(
  "FieldValidationMessage",
)({
  fieldName: S.optional(S.String),
  identifier: S.optional(S.String),
  title: S.optional(S.String),
  content: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const fieldValidationMessageList = S.Array(FieldValidationMessage);
export class MetricDataPoint extends S.Class<MetricDataPoint>(
  "MetricDataPoint",
)({
  fpr: S.optional(S.Number),
  precision: S.optional(S.Number),
  tpr: S.optional(S.Number),
  threshold: S.optional(S.Number),
}) {}
export const metricDataPointsList = S.Array(MetricDataPoint);
export class LogOddsMetric extends S.Class<LogOddsMetric>("LogOddsMetric")({
  variableName: S.String,
  variableType: S.String,
  variableImportance: S.Number,
}) {}
export const ListOfLogOddsMetrics = S.Array(LogOddsMetric);
export class AggregatedLogOddsMetric extends S.Class<AggregatedLogOddsMetric>(
  "AggregatedLogOddsMetric",
)({ variableNames: ListOfStrings, aggregatedVariablesImportance: S.Number }) {}
export const ListOfAggregatedLogOddsMetrics = S.Array(AggregatedLogOddsMetric);
export class VariableImpactExplanation extends S.Class<VariableImpactExplanation>(
  "VariableImpactExplanation",
)({
  eventVariableName: S.optional(S.String),
  relativeImpact: S.optional(S.String),
  logOddsImpact: S.optional(S.Number),
}) {}
export const listOfVariableImpactExplanations = S.Array(
  VariableImpactExplanation,
);
export class AggregatedVariablesImpactExplanation extends S.Class<AggregatedVariablesImpactExplanation>(
  "AggregatedVariablesImpactExplanation",
)({
  eventVariableNames: S.optional(ListOfStrings),
  relativeImpact: S.optional(S.String),
  logOddsImpact: S.optional(S.Number),
}) {}
export const ListOfAggregatedVariablesImpactExplanations = S.Array(
  AggregatedVariablesImpactExplanation,
);
export class RuleResult extends S.Class<RuleResult>("RuleResult")({
  ruleId: S.optional(S.String),
  outcomes: S.optional(ListOfStrings),
}) {}
export const ListOfRuleResults = S.Array(RuleResult);
export class DataValidationMetrics extends S.Class<DataValidationMetrics>(
  "DataValidationMetrics",
)({
  fileLevelMessages: S.optional(fileValidationMessageList),
  fieldLevelMessages: S.optional(fieldValidationMessageList),
}) {}
export class TrainingMetrics extends S.Class<TrainingMetrics>(
  "TrainingMetrics",
)({
  auc: S.optional(S.Number),
  metricDataPoints: S.optional(metricDataPointsList),
}) {}
export class VariableImportanceMetrics extends S.Class<VariableImportanceMetrics>(
  "VariableImportanceMetrics",
)({ logOddsMetrics: S.optional(ListOfLogOddsMetrics) }) {}
export class AggregatedVariablesImportanceMetrics extends S.Class<AggregatedVariablesImportanceMetrics>(
  "AggregatedVariablesImportanceMetrics",
)({ logOddsMetrics: S.optional(ListOfAggregatedLogOddsMetrics) }) {}
export class PredictionExplanations extends S.Class<PredictionExplanations>(
  "PredictionExplanations",
)({
  variableImpactExplanations: S.optional(listOfVariableImpactExplanations),
  aggregatedVariablesImpactExplanations: S.optional(
    ListOfAggregatedVariablesImpactExplanations,
  ),
}) {}
export class CreateModelVersionResult extends S.Class<CreateModelVersionResult>(
  "CreateModelVersionResult",
)(
  {
    modelId: S.optional(S.String),
    modelType: S.optional(S.String),
    modelVersionNumber: S.optional(S.String),
    status: S.optional(S.String),
  },
  ns,
) {}
export class OFIMetricDataPoint extends S.Class<OFIMetricDataPoint>(
  "OFIMetricDataPoint",
)({
  fpr: S.optional(S.Number),
  precision: S.optional(S.Number),
  tpr: S.optional(S.Number),
  threshold: S.optional(S.Number),
}) {}
export const OFIMetricDataPointsList = S.Array(OFIMetricDataPoint);
export class TFIMetricDataPoint extends S.Class<TFIMetricDataPoint>(
  "TFIMetricDataPoint",
)({
  fpr: S.optional(S.Number),
  precision: S.optional(S.Number),
  tpr: S.optional(S.Number),
  threshold: S.optional(S.Number),
}) {}
export const TFIMetricDataPointsList = S.Array(TFIMetricDataPoint);
export class UncertaintyRange extends S.Class<UncertaintyRange>(
  "UncertaintyRange",
)({ lowerBoundValue: S.Number, upperBoundValue: S.Number }) {}
export class TFIModelPerformance extends S.Class<TFIModelPerformance>(
  "TFIModelPerformance",
)({
  auc: S.optional(S.Number),
  uncertaintyRange: S.optional(UncertaintyRange),
}) {}
export class ATIMetricDataPoint extends S.Class<ATIMetricDataPoint>(
  "ATIMetricDataPoint",
)({
  cr: S.optional(S.Number),
  adr: S.optional(S.Number),
  threshold: S.optional(S.Number),
  atodr: S.optional(S.Number),
}) {}
export const ATIMetricDataPointsList = S.Array(ATIMetricDataPoint);
export class ATIModelPerformance extends S.Class<ATIModelPerformance>(
  "ATIModelPerformance",
)({ asi: S.optional(S.Number) }) {}
export class TrainingResult extends S.Class<TrainingResult>("TrainingResult")({
  dataValidationMetrics: S.optional(DataValidationMetrics),
  trainingMetrics: S.optional(TrainingMetrics),
  variableImportanceMetrics: S.optional(VariableImportanceMetrics),
}) {}
export const ModelPredictionMap = S.Record({ key: S.String, value: S.Number });
export class ExternalModelSummary extends S.Class<ExternalModelSummary>(
  "ExternalModelSummary",
)({ modelEndpoint: S.optional(S.String), modelSource: S.optional(S.String) }) {}
export const ExternalModelPredictionMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ModelVersionEvaluation extends S.Class<ModelVersionEvaluation>(
  "ModelVersionEvaluation",
)({
  outputVariableName: S.optional(S.String),
  evaluationScore: S.optional(S.String),
  predictionExplanations: S.optional(PredictionExplanations),
}) {}
export const ListOfModelVersionEvaluations = S.Array(ModelVersionEvaluation);
export class TFITrainingMetricsValue extends S.Class<TFITrainingMetricsValue>(
  "TFITrainingMetricsValue",
)({
  metricDataPoints: S.optional(TFIMetricDataPointsList),
  modelPerformance: S.optional(TFIModelPerformance),
}) {}
export class ATITrainingMetricsValue extends S.Class<ATITrainingMetricsValue>(
  "ATITrainingMetricsValue",
)({
  metricDataPoints: S.optional(ATIMetricDataPointsList),
  modelPerformance: S.optional(ATIModelPerformance),
}) {}
export class ModelScores extends S.Class<ModelScores>("ModelScores")({
  modelVersion: S.optional(ModelVersion),
  scores: S.optional(ModelPredictionMap),
}) {}
export const ListOfModelScores = S.Array(ModelScores);
export class ExternalModelOutputs extends S.Class<ExternalModelOutputs>(
  "ExternalModelOutputs",
)({
  externalModel: S.optional(ExternalModelSummary),
  outputs: S.optional(ExternalModelPredictionMap),
}) {}
export const ListOfExternalModelOutputs = S.Array(ExternalModelOutputs);
export class EvaluatedModelVersion extends S.Class<EvaluatedModelVersion>(
  "EvaluatedModelVersion",
)({
  modelId: S.optional(S.String),
  modelVersion: S.optional(S.String),
  modelType: S.optional(S.String),
  evaluations: S.optional(ListOfModelVersionEvaluations),
}) {}
export const ListOfEvaluatedModelVersions = S.Array(EvaluatedModelVersion);
export class OFIModelPerformance extends S.Class<OFIModelPerformance>(
  "OFIModelPerformance",
)({
  auc: S.optional(S.Number),
  uncertaintyRange: S.optional(UncertaintyRange),
}) {}
export class GetEventPredictionResult extends S.Class<GetEventPredictionResult>(
  "GetEventPredictionResult",
)(
  {
    modelScores: S.optional(ListOfModelScores),
    ruleResults: S.optional(ListOfRuleResults),
    externalModelOutputs: S.optional(ListOfExternalModelOutputs),
  },
  ns,
) {}
export class GetEventPredictionMetadataResult extends S.Class<GetEventPredictionMetadataResult>(
  "GetEventPredictionMetadataResult",
)(
  {
    eventId: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    entityId: S.optional(S.String),
    entityType: S.optional(S.String),
    eventTimestamp: S.optional(S.String),
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    detectorVersionStatus: S.optional(S.String),
    eventVariables: S.optional(ListOfEventVariableSummaries),
    rules: S.optional(EvaluatedRuleList),
    ruleExecutionMode: S.optional(S.String),
    outcomes: S.optional(ListOfStrings),
    evaluatedModelVersions: S.optional(ListOfEvaluatedModelVersions),
    evaluatedExternalModels: S.optional(ListOfEvaluatedExternalModels),
    predictionTimestamp: S.optional(S.String),
  },
  ns,
) {}
export class OFITrainingMetricsValue extends S.Class<OFITrainingMetricsValue>(
  "OFITrainingMetricsValue",
)({
  metricDataPoints: S.optional(OFIMetricDataPointsList),
  modelPerformance: S.optional(OFIModelPerformance),
}) {}
export class TrainingMetricsV2 extends S.Class<TrainingMetricsV2>(
  "TrainingMetricsV2",
)({
  ofi: S.optional(OFITrainingMetricsValue),
  tfi: S.optional(TFITrainingMetricsValue),
  ati: S.optional(ATITrainingMetricsValue),
}) {}
export class TrainingResultV2 extends S.Class<TrainingResultV2>(
  "TrainingResultV2",
)({
  dataValidationMetrics: S.optional(DataValidationMetrics),
  trainingMetricsV2: S.optional(TrainingMetricsV2),
  variableImportanceMetrics: S.optional(VariableImportanceMetrics),
  aggregatedVariablesImportanceMetrics: S.optional(
    AggregatedVariablesImportanceMetrics,
  ),
}) {}
export class ModelVersionDetail extends S.Class<ModelVersionDetail>(
  "ModelVersionDetail",
)({
  modelId: S.optional(S.String),
  modelType: S.optional(S.String),
  modelVersionNumber: S.optional(S.String),
  status: S.optional(S.String),
  trainingDataSource: S.optional(S.String),
  trainingDataSchema: S.optional(TrainingDataSchema),
  externalEventsDetail: S.optional(ExternalEventsDetail),
  ingestedEventsDetail: S.optional(IngestedEventsDetail),
  trainingResult: S.optional(TrainingResult),
  lastUpdatedTime: S.optional(S.String),
  createdTime: S.optional(S.String),
  arn: S.optional(S.String),
  trainingResultV2: S.optional(TrainingResultV2),
}) {}
export const modelVersionDetailList = S.Array(ModelVersionDetail);
export class DescribeModelVersionsResult extends S.Class<DescribeModelVersionsResult>(
  "DescribeModelVersionsResult",
)(
  {
    modelVersionDetails: S.optional(modelVersionDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets the encryption key if a KMS key has been specified to be used to encrypt content in Amazon Fraud Detector.
 */
export const getKMSEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKMSEncryptionKeyRequest,
  output: GetKMSEncryptionKeyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all tags associated with the resource. This is a paginated API. To get the next page results, provide the pagination token from the
 * response as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an Amazon SageMaker model endpoint. You can also use this action to update the configuration of the model endpoint, including the IAM role and/or the mapped variables.
 */
export const putExternalModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutExternalModelRequest,
  output: PutExternalModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rule for use with the specified detector.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a label.
 *
 * You cannot delete labels that are included in an event type in Amazon Fraud Detector.
 *
 * You cannot delete a label assigned to an event ID. You must first delete the relevant event ID.
 *
 * When you delete a label, Amazon Fraud Detector permanently deletes that label and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLabelRequest,
  output: DeleteLabelResult,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status of a `DeleteEventsByEventType` action.
 */
export const getDeleteEventsByEventTypeStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDeleteEventsByEventTypeStatusRequest,
    output: GetDeleteEventsByEventTypeStatusResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Gets a particular detector version.
 */
export const getDetectorVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorVersionRequest,
  output: GetDetectorVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all the elements in the specified list.
 */
export const getListElements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetListElementsRequest,
  output: GetListElementsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of the specified model version.
 */
export const getModelVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelVersionRequest,
  output: GetModelVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all of the variables or the specific variable. This is a
 * paginated API. Providing null `maxSizePerPage` results in retrieving maximum of
 * 100 records per page. If you provide `maxSizePerPage` the value must be between
 * 50 and 100. To get the next page result, a provide a pagination token from
 * `GetVariablesResult` as part of your request. Null pagination token
 * fetches the records from the beginning.
 */
export const getVariables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVariablesRequest,
  output: GetVariablesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an event type. An event is a business activity that is evaluated for fraud risk. With Amazon Fraud Detector, you generate fraud predictions for events. An event type defines the structure for an event sent to Amazon Fraud Detector. This includes the variables sent as part of the event, the entity performing the event (such as a customer), and the labels that classify the event. Example event types include online payment transactions, account registrations, and authentications.
 */
export const putEventType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventTypeRequest,
  output: PutEventTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a model version. Updating a model version retrains an existing model version using updated training data and produces a new minor version of the model. You can update the training data set location and data access role attributes using this action. This action creates and trains a new minor version of the model, for example version 1.01, 1.02, 1.03.
 */
export const updateModelVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelVersionRequest,
  output: UpdateModelVersionResult,
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
 * Updates a rule version resulting in a new rule version. Updates a rule version resulting in a new rule version (version 1, 2, 3 ...).
 */
export const updateRuleVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleVersionRequest,
  output: UpdateRuleVersionResult,
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
 * Cancels the specified batch prediction job.
 */
export const cancelBatchPredictionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelBatchPredictionJobRequest,
    output: CancelBatchPredictionJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a batch import job.
 */
export const createBatchImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBatchImportJobRequest,
    output: CreateBatchImportJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a batch prediction job.
 */
export const createBatchPredictionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBatchPredictionJobRequest,
    output: CreateBatchPredictionJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a list.
 *
 * List is a set of input data for a variable in your event dataset. You use the input data in a rule that's associated with your detector.
 * For more information, see Lists.
 */
export const createList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListRequest,
  output: CreateListResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a model using the specified model type.
 */
export const createModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelRequest,
  output: CreateModelResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a variable.
 */
export const createVariable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVariableRequest,
  output: CreateVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified batch import job ID record. This action does not delete the data that was batch imported.
 */
export const deleteBatchImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBatchImportJobRequest,
    output: DeleteBatchImportJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a batch prediction job.
 */
export const deleteBatchPredictionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBatchPredictionJobRequest,
    output: DeleteBatchPredictionJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the detector. Before deleting a detector, you must first delete all detector versions and rule versions associated with the detector.
 *
 * When you delete a detector, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorRequest,
  output: DeleteDetectorResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the detector version. You cannot delete detector versions that are in `ACTIVE` status.
 *
 * When you delete a detector version, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteDetectorVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDetectorVersionRequest,
    output: DeleteDetectorVersionResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an entity type.
 *
 * You cannot delete an entity type that is included in an event type.
 *
 * When you delete an entity type, Amazon Fraud Detector permanently deletes that entity type and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteEntityType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEntityTypeRequest,
  output: DeleteEntityTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified event.
 *
 * When you delete an event, Amazon Fraud Detector permanently deletes that event and the event data is no longer stored in Amazon Fraud Detector.
 * If `deleteAuditHistory` is `True`, event data is available through search for up to 30 seconds after the delete operation is completed.
 */
export const deleteEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventRequest,
  output: DeleteEventResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an event type.
 *
 * You cannot delete an event type that is used in a detector or a model.
 *
 * When you delete an event type, Amazon Fraud Detector permanently deletes that event type and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteEventType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventTypeRequest,
  output: DeleteEventTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a SageMaker model from Amazon Fraud Detector.
 *
 * You can remove an Amazon SageMaker model if it is not associated with a detector version. Removing a SageMaker model disconnects it from Amazon Fraud Detector, but the model remains available in SageMaker.
 */
export const deleteExternalModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExternalModelRequest,
  output: DeleteExternalModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the list, provided it is not used in a rule.
 *
 * When you delete a list, Amazon Fraud Detector permanently deletes that list and the elements in the list.
 */
export const deleteList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListRequest,
  output: DeleteListResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a model.
 *
 * You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.
 *
 * When you delete a model, Amazon Fraud Detector permanently deletes that model and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a model version.
 *
 * You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.
 *
 * When you delete a model version, Amazon Fraud Detector permanently deletes that model version and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteModelVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelVersionRequest,
  output: DeleteModelVersionResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an outcome.
 *
 * You cannot delete an outcome that is used in a rule version.
 *
 * When you delete an outcome, Amazon Fraud Detector permanently deletes that outcome and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteOutcome = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutcomeRequest,
  output: DeleteOutcomeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the rule. You cannot delete a rule if it is used by an `ACTIVE` or `INACTIVE` detector version.
 *
 * When you delete a rule, Amazon Fraud Detector permanently deletes that rule and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a variable.
 *
 * You can't delete variables that are included in an event type in Amazon Fraud Detector.
 *
 * Amazon Fraud Detector automatically deletes model output variables and SageMaker model output variables when you delete the model. You can't delete these variables manually.
 *
 * When you delete a variable, Amazon Fraud Detector permanently deletes that variable and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteVariable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVariableRequest,
  output: DeleteVariableResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a detector.
 */
export const putDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDetectorRequest,
  output: PutDetectorResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an entity type. An entity represents who is performing the event. As part of a fraud prediction, you pass the entity ID to indicate the specific entity who performed the event. An entity type classifies the entity. Example classifications include customer, merchant, or account.
 */
export const putEntityType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEntityTypeRequest,
  output: PutEntityTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Specifies the KMS key to be used to encrypt content in Amazon Fraud Detector.
 */
export const putKMSEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutKMSEncryptionKeyRequest,
  output: PutKMSEncryptionKeyResult,
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
 * Creates or updates label. A label classifies an event as fraudulent or legitimate. Labels are associated with event types and used to train supervised machine learning models in Amazon Fraud Detector.
 */
export const putLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLabelRequest,
  output: PutLabelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an outcome.
 */
export const putOutcome = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOutcomeRequest,
  output: PutOutcomeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stores events in Amazon Fraud Detector without generating fraud predictions for those events. For example, you can use `SendEvent` to upload a historical dataset, which you can then later use to train a model.
 */
export const sendEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEventRequest,
  output: SendEventResult,
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
 * Updates a detector version. The detector version attributes that you can update include models, external model endpoints, rules, rule execution mode, and description. You can only update a `DRAFT` detector version.
 */
export const updateDetectorVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDetectorVersionRequest,
    output: UpdateDetectorVersionResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the detector version's description. You can update the metadata for any detector version (`DRAFT, ACTIVE,` or
 * `INACTIVE`).
 */
export const updateDetectorVersionMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDetectorVersionMetadataRequest,
    output: UpdateDetectorVersionMetadataResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the detector version’s status. You can perform the following promotions or
 * demotions using `UpdateDetectorVersionStatus`: `DRAFT` to `ACTIVE`, `ACTIVE` to `INACTIVE`, and `INACTIVE` to `ACTIVE`.
 */
export const updateDetectorVersionStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDetectorVersionStatusRequest,
    output: UpdateDetectorVersionStatusResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the specified event with a new label.
 */
export const updateEventLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventLabelRequest,
  output: UpdateEventLabelResult,
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
 * Updates a list.
 */
export const updateList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateListRequest,
  output: UpdateListResult,
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
 * Updates model description.
 */
export const updateModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelRequest,
  output: UpdateModelResult,
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
 * Updates the status of a model version.
 *
 * You can perform the following status updates:
 *
 * - Change the `TRAINING_IN_PROGRESS` status to `TRAINING_CANCELLED`.
 *
 * - Change the `TRAINING_COMPLETE` status to `ACTIVE`.
 *
 * - Change `ACTIVE` to `INACTIVE`.
 */
export const updateModelVersionStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateModelVersionStatusRequest,
    output: UpdateModelVersionStatusResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a rule's metadata. The description attribute can be updated.
 */
export const updateRuleMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleMetadataRequest,
  output: UpdateRuleMetadataResult,
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
 * Updates a variable.
 */
export const updateVariable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVariableRequest,
  output: UpdateVariableResult,
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
 * Deletes all events of a particular event type.
 */
export const deleteEventsByEventType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventsByEventTypeRequest,
    output: DeleteEventsByEventTypeResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a batch of variables.
 */
export const batchGetVariable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetVariableRequest,
  output: BatchGetVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels an in-progress batch import job.
 */
export const cancelBatchImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelBatchImportJobRequest,
    output: CancelBatchImportJobResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a detector version. The detector version starts in a `DRAFT` status.
 */
export const createDetectorVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDetectorVersionRequest,
    output: CreateDetectorVersionResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets all versions for a specified detector.
 */
export const describeDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectorRequest,
  output: DescribeDetectorResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all batch import jobs or a specific job of the specified ID. This is a paginated API. If you provide a null `maxResults`,
 * this action retrieves a maximum of 50 records per page. If you provide a `maxResults`, the value must be between 1 and 50.
 * To get the next page results, provide the pagination token from the `GetBatchImportJobsResponse` as part of your request.
 * A null pagination token fetches the records from the beginning.
 */
export const getBatchImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBatchImportJobsRequest,
  output: GetBatchImportJobsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all batch prediction jobs or a specific job if you specify a job ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchPredictionJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
 */
export const getBatchPredictionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBatchPredictionJobsRequest,
    output: GetBatchPredictionJobsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets all detectors or a single detector if a `detectorId` is specified. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetDetectorsResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorsRequest,
  output: GetDetectorsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all entity types or a specific entity type if a name is specified. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetEntityTypesResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getEntityTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEntityTypesRequest,
  output: GetEntityTypesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details for one or more Amazon SageMaker models that have been imported into the
 * service. This is a paginated API. If you provide a null `maxResults`, this
 * actions retrieves a maximum of 10 records per page. If you provide a
 * `maxResults`, the value must be between 5 and 10. To get the next page
 * results, provide the pagination token from the `GetExternalModelsResult` as part
 * of your request. A null pagination token fetches the records from the beginning.
 */
export const getExternalModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExternalModelsRequest,
  output: GetExternalModelsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all labels or a specific label if name is provided. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 50 records
 * per page. If you provide a `maxResults`, the value must be between 10 and 50.
 * To get the next page results, provide the pagination token from the
 * `GetGetLabelsResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLabelsRequest,
  output: GetLabelsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the metadata of either all the lists under the account or the specified list.
 */
export const getListsMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetListsMetadataRequest,
  output: GetListsMetadataResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets one or more models. Gets all models for the Amazon Web Services account if no model type and no model id provided. Gets all models for the Amazon Web Services account and model type, if the model type is specified but model id is not provided. Gets a specific model if (model type, model id) tuple is specified.
 *
 * This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 1 and 10.
 * To get the next page results, provide the pagination token from the
 * response as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelsRequest,
  output: GetModelsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets one or more outcomes. This is a paginated
 * API. If you provide a null `maxResults`, this actions retrieves a maximum of
 * 100 records per page. If you provide a `maxResults`, the value must be
 * between 50 and 100. To get the next page results, provide the pagination token from the
 * `GetOutcomesResult` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getOutcomes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOutcomesRequest,
  output: GetOutcomesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get all rules for a detector (paginated) if `ruleId` and `ruleVersion` are not specified. Gets all rules for the detector and the `ruleId` if present (paginated). Gets a specific rule if both the `ruleId` and the `ruleVersion` are specified.
 *
 * This is a paginated API. Providing null maxResults results in retrieving maximum of 100 records per page. If you provide maxResults the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetRulesResult as part of your request. Null pagination token fetches the records from the beginning.
 */
export const getRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRulesRequest,
  output: GetRulesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a batch of variables.
 */
export const batchCreateVariable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateVariableRequest,
  output: BatchCreateVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of events stored with Amazon Fraud Detector. This action does not retrieve prediction results.
 */
export const getEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventRequest,
  output: GetEventResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all event types or a specific event type if name is provided. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetEventTypesResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getEventTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventTypesRequest,
  output: GetEventTypesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of past predictions. The list can be filtered by detector ID, detector version ID, event ID, event type, or by specifying a time period.
 * If filter is not specified, the most recent prediction is returned.
 *
 * For example, the following filter lists all past predictions for `xyz` event type -
 * {
 * "eventType":{
 * "value": "xyz" }”
 * }
 *
 * This is a paginated API. If you provide a null `maxResults`, this action will retrieve a maximum of 10 records per page.
 * If you provide a `maxResults`, the value must be between 50 and 100. To get the next page results, provide
 * the `nextToken` from the response as part of your request. A null `nextToken` fetches the records from the beginning.
 */
export const listEventPredictions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEventPredictionsRequest,
    output: ListEventPredictionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a version of the model using the specified model type and model id.
 */
export const createModelVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelVersionRequest,
  output: CreateModelVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details of the past fraud predictions for the specified event ID, event type, detector ID, and detector version ID that was generated in the specified time period.
 */
export const getEventPredictionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEventPredictionMetadataRequest,
    output: GetEventPredictionMetadataResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Evaluates an event against a detector version. If a version ID is not provided, the detector’s (`ACTIVE`) version is used.
 */
export const getEventPrediction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventPredictionRequest,
  output: GetEventPredictionResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all of the model versions for the specified model type or for the specified model type and model ID. You can also get details for a single, specified model version.
 */
export const describeModelVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeModelVersionsRequest,
    output: DescribeModelVersionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

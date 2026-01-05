import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CleanRoomsML",
  serviceShapeName: "AWSStarkControlService",
});
const auth = T.AwsAuthSigv4({ name: "cleanrooms-ml" });
const ver = T.ServiceVersion("2023-09-06");
const proto = T.AwsProtocolsRestJson1();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cleanrooms-ml-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cleanrooms-ml-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://cleanrooms-ml.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cleanrooms-ml.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeys = S.Array(S.String);
export const MetricsList = S.Array(S.String);
export const ConfiguredModelAlgorithmAssociationArnList = S.Array(S.String);
export class ListCollaborationConfiguredModelAlgorithmAssociationsRequest extends S.Class<ListCollaborationConfiguredModelAlgorithmAssociationsRequest>(
  "ListCollaborationConfiguredModelAlgorithmAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/configured-model-algorithm-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationMLInputChannelsRequest extends S.Class<ListCollaborationMLInputChannelsRequest>(
  "ListCollaborationMLInputChannelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/ml-input-channels",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationTrainedModelExportJobsRequest extends S.Class<ListCollaborationTrainedModelExportJobsRequest>(
  "ListCollaborationTrainedModelExportJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/trained-models/{trainedModelArn}/export-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationTrainedModelInferenceJobsRequest extends S.Class<ListCollaborationTrainedModelInferenceJobsRequest>(
  "ListCollaborationTrainedModelInferenceJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    trainedModelArn: S.optional(S.String).pipe(T.HttpQuery("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/trained-model-inference-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollaborationTrainedModelsRequest extends S.Class<ListCollaborationTrainedModelsRequest>(
  "ListCollaborationTrainedModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/trained-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class ListAudienceExportJobsRequest extends S.Class<ListAudienceExportJobsRequest>(
  "ListAudienceExportJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    audienceGenerationJobArn: S.optional(S.String).pipe(
      T.HttpQuery("audienceGenerationJobArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audience-export-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAudienceGenerationJobRequest extends S.Class<GetAudienceGenerationJobRequest>(
  "GetAudienceGenerationJobRequest",
)(
  {
    audienceGenerationJobArn: S.String.pipe(
      T.HttpLabel("audienceGenerationJobArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/audience-generation-job/{audienceGenerationJobArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAudienceGenerationJobRequest extends S.Class<DeleteAudienceGenerationJobRequest>(
  "DeleteAudienceGenerationJobRequest",
)(
  {
    audienceGenerationJobArn: S.String.pipe(
      T.HttpLabel("audienceGenerationJobArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/audience-generation-job/{audienceGenerationJobArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAudienceGenerationJobResponse extends S.Class<DeleteAudienceGenerationJobResponse>(
  "DeleteAudienceGenerationJobResponse",
)({}) {}
export class ListAudienceGenerationJobsRequest extends S.Class<ListAudienceGenerationJobsRequest>(
  "ListAudienceGenerationJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    configuredAudienceModelArn: S.optional(S.String).pipe(
      T.HttpQuery("configuredAudienceModelArn"),
    ),
    collaborationId: S.optional(S.String).pipe(T.HttpQuery("collaborationId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audience-generation-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateAudienceModelRequest extends S.Class<CreateAudienceModelRequest>(
  "CreateAudienceModelRequest",
)(
  {
    trainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    trainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    name: S.String,
    trainingDatasetArn: S.String,
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audience-model" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAudienceModelRequest extends S.Class<GetAudienceModelRequest>(
  "GetAudienceModelRequest",
)(
  { audienceModelArn: S.String.pipe(T.HttpLabel("audienceModelArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/audience-model/{audienceModelArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAudienceModelRequest extends S.Class<DeleteAudienceModelRequest>(
  "DeleteAudienceModelRequest",
)(
  { audienceModelArn: S.String.pipe(T.HttpLabel("audienceModelArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/audience-model/{audienceModelArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAudienceModelResponse extends S.Class<DeleteAudienceModelResponse>(
  "DeleteAudienceModelResponse",
)({}) {}
export class ListAudienceModelsRequest extends S.Class<ListAudienceModelsRequest>(
  "ListAudienceModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audience-model" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredAudienceModelRequest extends S.Class<GetConfiguredAudienceModelRequest>(
  "GetConfiguredAudienceModelRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/configured-audience-model/{configuredAudienceModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3ConfigMap extends S.Class<S3ConfigMap>("S3ConfigMap")({
  s3Uri: S.String,
}) {}
export class AudienceDestination extends S.Class<AudienceDestination>(
  "AudienceDestination",
)({ s3Destination: S3ConfigMap }) {}
export class ConfiguredAudienceModelOutputConfig extends S.Class<ConfiguredAudienceModelOutputConfig>(
  "ConfiguredAudienceModelOutputConfig",
)({ destination: AudienceDestination, roleArn: S.String }) {}
export const AudienceSizeBins = S.Array(S.Number);
export class AudienceSizeConfig extends S.Class<AudienceSizeConfig>(
  "AudienceSizeConfig",
)({ audienceSizeType: S.String, audienceSizeBins: AudienceSizeBins }) {}
export class UpdateConfiguredAudienceModelRequest extends S.Class<UpdateConfiguredAudienceModelRequest>(
  "UpdateConfiguredAudienceModelRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
    outputConfig: S.optional(ConfiguredAudienceModelOutputConfig),
    audienceModelArn: S.optional(S.String),
    sharedAudienceMetrics: S.optional(MetricsList),
    minMatchingSeedSize: S.optional(S.Number),
    audienceSizeConfig: S.optional(AudienceSizeConfig),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/configured-audience-model/{configuredAudienceModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelRequest extends S.Class<DeleteConfiguredAudienceModelRequest>(
  "DeleteConfiguredAudienceModelRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/configured-audience-model/{configuredAudienceModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelResponse extends S.Class<DeleteConfiguredAudienceModelResponse>(
  "DeleteConfiguredAudienceModelResponse",
)({}) {}
export class ListConfiguredAudienceModelsRequest extends S.Class<ListConfiguredAudienceModelsRequest>(
  "ListConfiguredAudienceModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/configured-audience-model" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutConfiguredAudienceModelPolicyRequest extends S.Class<PutConfiguredAudienceModelPolicyRequest>(
  "PutConfiguredAudienceModelPolicyRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
    configuredAudienceModelPolicy: S.String,
    previousPolicyHash: S.optional(S.String),
    policyExistenceCondition: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredAudienceModelPolicyRequest extends S.Class<GetConfiguredAudienceModelPolicyRequest>(
  "GetConfiguredAudienceModelPolicyRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelPolicyRequest extends S.Class<DeleteConfiguredAudienceModelPolicyRequest>(
  "DeleteConfiguredAudienceModelPolicyRequest",
)(
  {
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredAudienceModelPolicyResponse extends S.Class<DeleteConfiguredAudienceModelPolicyResponse>(
  "DeleteConfiguredAudienceModelPolicyResponse",
)({}) {}
export class GetConfiguredModelAlgorithmRequest extends S.Class<GetConfiguredModelAlgorithmRequest>(
  "GetConfiguredModelAlgorithmRequest",
)(
  {
    configuredModelAlgorithmArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/configured-model-algorithms/{configuredModelAlgorithmArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredModelAlgorithmRequest extends S.Class<DeleteConfiguredModelAlgorithmRequest>(
  "DeleteConfiguredModelAlgorithmRequest",
)(
  {
    configuredModelAlgorithmArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmArn"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/configured-model-algorithms/{configuredModelAlgorithmArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredModelAlgorithmResponse extends S.Class<DeleteConfiguredModelAlgorithmResponse>(
  "DeleteConfiguredModelAlgorithmResponse",
)({}) {}
export class ListConfiguredModelAlgorithmsRequest extends S.Class<ListConfiguredModelAlgorithmsRequest>(
  "ListConfiguredModelAlgorithmsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/configured-model-algorithms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfiguredModelAlgorithmAssociationRequest extends S.Class<GetConfiguredModelAlgorithmAssociationRequest>(
  "GetConfiguredModelAlgorithmAssociationRequest",
)(
  {
    configuredModelAlgorithmAssociationArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmAssociationArn"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredModelAlgorithmAssociationRequest extends S.Class<DeleteConfiguredModelAlgorithmAssociationRequest>(
  "DeleteConfiguredModelAlgorithmAssociationRequest",
)(
  {
    configuredModelAlgorithmAssociationArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmAssociationArn"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfiguredModelAlgorithmAssociationResponse extends S.Class<DeleteConfiguredModelAlgorithmAssociationResponse>(
  "DeleteConfiguredModelAlgorithmAssociationResponse",
)({}) {}
export class ListConfiguredModelAlgorithmAssociationsRequest extends S.Class<ListConfiguredModelAlgorithmAssociationsRequest>(
  "ListConfiguredModelAlgorithmAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationConfiguredModelAlgorithmAssociationRequest extends S.Class<GetCollaborationConfiguredModelAlgorithmAssociationRequest>(
  "GetCollaborationConfiguredModelAlgorithmAssociationRequest",
)(
  {
    configuredModelAlgorithmAssociationArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmAssociationArn"),
    ),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLConfigurationRequest extends S.Class<GetMLConfigurationRequest>(
  "GetMLConfigurationRequest",
)(
  { membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/ml-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMLConfigurationRequest extends S.Class<DeleteMLConfigurationRequest>(
  "DeleteMLConfigurationRequest",
)(
  { membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/ml-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMLConfigurationResponse extends S.Class<DeleteMLConfigurationResponse>(
  "DeleteMLConfigurationResponse",
)({}) {}
export class GetMLInputChannelRequest extends S.Class<GetMLInputChannelRequest>(
  "GetMLInputChannelRequest",
)(
  {
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/ml-input-channels/{mlInputChannelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMLInputChannelDataRequest extends S.Class<DeleteMLInputChannelDataRequest>(
  "DeleteMLInputChannelDataRequest",
)(
  {
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/ml-input-channels/{mlInputChannelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMLInputChannelDataResponse extends S.Class<DeleteMLInputChannelDataResponse>(
  "DeleteMLInputChannelDataResponse",
)({}) {}
export class ListMLInputChannelsRequest extends S.Class<ListMLInputChannelsRequest>(
  "ListMLInputChannelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/ml-input-channels",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCollaborationMLInputChannelRequest extends S.Class<GetCollaborationMLInputChannelRequest>(
  "GetCollaborationMLInputChannelRequest",
)(
  {
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/ml-input-channels/{mlInputChannelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrainedModelRequest extends S.Class<GetTrainedModelRequest>(
  "GetTrainedModelRequest",
)(
  {
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrainedModelOutputRequest extends S.Class<DeleteTrainedModelOutputRequest>(
  "DeleteTrainedModelOutputRequest",
)(
  {
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrainedModelOutputResponse extends S.Class<DeleteTrainedModelOutputResponse>(
  "DeleteTrainedModelOutputResponse",
)({}) {}
export class ListTrainedModelsRequest extends S.Class<ListTrainedModelsRequest>(
  "ListTrainedModelsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/trained-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTrainedModelRequest extends S.Class<CancelTrainedModelRequest>(
  "CancelTrainedModelRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTrainedModelResponse extends S.Class<CancelTrainedModelResponse>(
  "CancelTrainedModelResponse",
)({}) {}
export class GetCollaborationTrainedModelRequest extends S.Class<GetCollaborationTrainedModelRequest>(
  "GetCollaborationTrainedModelRequest",
)(
  {
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/collaborations/{collaborationIdentifier}/trained-models/{trainedModelArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrainedModelVersionsRequest extends S.Class<ListTrainedModelVersionsRequest>(
  "ListTrainedModelVersionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrainedModelInferenceJobRequest extends S.Class<GetTrainedModelInferenceJobRequest>(
  "GetTrainedModelInferenceJobRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelInferenceJobArn: S.String.pipe(
      T.HttpLabel("trainedModelInferenceJobArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs/{trainedModelInferenceJobArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrainedModelInferenceJobsRequest extends S.Class<ListTrainedModelInferenceJobsRequest>(
  "ListTrainedModelInferenceJobsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.optional(S.String).pipe(T.HttpQuery("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTrainedModelInferenceJobRequest extends S.Class<CancelTrainedModelInferenceJobRequest>(
  "CancelTrainedModelInferenceJobRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelInferenceJobArn: S.String.pipe(
      T.HttpLabel("trainedModelInferenceJobArn"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs/{trainedModelInferenceJobArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelTrainedModelInferenceJobResponse extends S.Class<CancelTrainedModelInferenceJobResponse>(
  "CancelTrainedModelInferenceJobResponse",
)({}) {}
export class GetTrainingDatasetRequest extends S.Class<GetTrainingDatasetRequest>(
  "GetTrainingDatasetRequest",
)(
  { trainingDatasetArn: S.String.pipe(T.HttpLabel("trainingDatasetArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/training-dataset/{trainingDatasetArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrainingDatasetRequest extends S.Class<DeleteTrainingDatasetRequest>(
  "DeleteTrainingDatasetRequest",
)(
  { trainingDatasetArn: S.String.pipe(T.HttpLabel("trainingDatasetArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/training-dataset/{trainingDatasetArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrainingDatasetResponse extends S.Class<DeleteTrainingDatasetResponse>(
  "DeleteTrainingDatasetResponse",
)({}) {}
export class ListTrainingDatasetsRequest extends S.Class<ListTrainingDatasetsRequest>(
  "ListTrainingDatasetsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/training-dataset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ContainerEntrypoint = S.Array(S.String);
export const ContainerArguments = S.Array(S.String);
export class AudienceSize extends S.Class<AudienceSize>("AudienceSize")({
  type: S.String,
  value: S.Number,
}) {}
export class InferenceContainerConfig extends S.Class<InferenceContainerConfig>(
  "InferenceContainerConfig",
)({ imageUri: S.String }) {}
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export const Environment = S.Record({ key: S.String, value: S.String });
export class ResourceConfig extends S.Class<ResourceConfig>("ResourceConfig")({
  instanceCount: S.optional(S.Number),
  instanceType: S.String,
  volumeSizeInGB: S.Number,
}) {}
export class StoppingCondition extends S.Class<StoppingCondition>(
  "StoppingCondition",
)({ maxRuntimeInSeconds: S.optional(S.Number) }) {}
export class IncrementalTrainingDataChannel extends S.Class<IncrementalTrainingDataChannel>(
  "IncrementalTrainingDataChannel",
)({
  trainedModelArn: S.String,
  versionIdentifier: S.optional(S.String),
  channelName: S.String,
}) {}
export const IncrementalTrainingDataChannels = S.Array(
  IncrementalTrainingDataChannel,
);
export class ModelTrainingDataChannel extends S.Class<ModelTrainingDataChannel>(
  "ModelTrainingDataChannel",
)({
  mlInputChannelArn: S.String,
  channelName: S.String,
  s3DataDistributionType: S.optional(S.String),
}) {}
export const ModelTrainingDataChannels = S.Array(ModelTrainingDataChannel);
export class InferenceResourceConfig extends S.Class<InferenceResourceConfig>(
  "InferenceResourceConfig",
)({ instanceType: S.String, instanceCount: S.optional(S.Number) }) {}
export class ModelInferenceDataSource extends S.Class<ModelInferenceDataSource>(
  "ModelInferenceDataSource",
)({ mlInputChannelArn: S.String }) {}
export class InferenceContainerExecutionParameters extends S.Class<InferenceContainerExecutionParameters>(
  "InferenceContainerExecutionParameters",
)({ maxPayloadInMB: S.optional(S.Number) }) {}
export const InferenceEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class StartAudienceExportJobRequest extends S.Class<StartAudienceExportJobRequest>(
  "StartAudienceExportJobRequest",
)(
  {
    name: S.String,
    audienceGenerationJobArn: S.String,
    audienceSize: AudienceSize,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audience-export-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAudienceExportJobResponse extends S.Class<StartAudienceExportJobResponse>(
  "StartAudienceExportJobResponse",
)({}) {}
export class CreateAudienceModelResponse extends S.Class<CreateAudienceModelResponse>(
  "CreateAudienceModelResponse",
)({ audienceModelArn: S.String }) {}
export class StatusDetails extends S.Class<StatusDetails>("StatusDetails")({
  statusCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class GetAudienceModelResponse extends S.Class<GetAudienceModelResponse>(
  "GetAudienceModelResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainingDataStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  trainingDataEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  audienceModelArn: S.String,
  name: S.String,
  trainingDatasetArn: S.String,
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  kmsKeyArn: S.optional(S.String),
  tags: S.optional(TagMap),
  description: S.optional(S.String),
}) {}
export class GetConfiguredAudienceModelResponse extends S.Class<GetConfiguredAudienceModelResponse>(
  "GetConfiguredAudienceModelResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredAudienceModelArn: S.String,
  name: S.String,
  audienceModelArn: S.String,
  outputConfig: ConfiguredAudienceModelOutputConfig,
  description: S.optional(S.String),
  status: S.String,
  sharedAudienceMetrics: MetricsList,
  minMatchingSeedSize: S.optional(S.Number),
  audienceSizeConfig: S.optional(AudienceSizeConfig),
  tags: S.optional(TagMap),
  childResourceTagOnCreatePolicy: S.optional(S.String),
}) {}
export class UpdateConfiguredAudienceModelResponse extends S.Class<UpdateConfiguredAudienceModelResponse>(
  "UpdateConfiguredAudienceModelResponse",
)({ configuredAudienceModelArn: S.String }) {}
export class PutConfiguredAudienceModelPolicyResponse extends S.Class<PutConfiguredAudienceModelPolicyResponse>(
  "PutConfiguredAudienceModelPolicyResponse",
)({ configuredAudienceModelPolicy: S.String, policyHash: S.String }) {}
export class GetConfiguredAudienceModelPolicyResponse extends S.Class<GetConfiguredAudienceModelPolicyResponse>(
  "GetConfiguredAudienceModelPolicyResponse",
)({
  configuredAudienceModelArn: S.String,
  configuredAudienceModelPolicy: S.String,
  policyHash: S.String,
}) {}
export class MetricDefinition extends S.Class<MetricDefinition>(
  "MetricDefinition",
)({ name: S.String, regex: S.String }) {}
export const MetricDefinitionList = S.Array(MetricDefinition);
export class ContainerConfig extends S.Class<ContainerConfig>(
  "ContainerConfig",
)({
  imageUri: S.String,
  entrypoint: S.optional(ContainerEntrypoint),
  arguments: S.optional(ContainerArguments),
  metricDefinitions: S.optional(MetricDefinitionList),
}) {}
export class GetConfiguredModelAlgorithmResponse extends S.Class<GetConfiguredModelAlgorithmResponse>(
  "GetConfiguredModelAlgorithmResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmArn: S.String,
  name: S.String,
  trainingContainerConfig: S.optional(ContainerConfig),
  inferenceContainerConfig: S.optional(InferenceContainerConfig),
  roleArn: S.String,
  description: S.optional(S.String),
  tags: S.optional(TagMap),
  kmsKeyArn: S.optional(S.String),
}) {}
export const AccountIdList = S.Array(S.String);
export const EntityTypeList = S.Array(S.String);
export const CustomDataIdentifierList = S.Array(S.String);
export class CustomEntityConfig extends S.Class<CustomEntityConfig>(
  "CustomEntityConfig",
)({ customDataIdentifiers: CustomDataIdentifierList }) {}
export class LogRedactionConfiguration extends S.Class<LogRedactionConfiguration>(
  "LogRedactionConfiguration",
)({
  entitiesToRedact: EntityTypeList,
  customEntityConfig: S.optional(CustomEntityConfig),
}) {}
export class LogsConfigurationPolicy extends S.Class<LogsConfigurationPolicy>(
  "LogsConfigurationPolicy",
)({
  allowedAccountIds: AccountIdList,
  filterPattern: S.optional(S.String),
  logType: S.optional(S.String),
  logRedactionConfiguration: S.optional(LogRedactionConfiguration),
}) {}
export const LogsConfigurationPolicyList = S.Array(LogsConfigurationPolicy);
export class MetricsConfigurationPolicy extends S.Class<MetricsConfigurationPolicy>(
  "MetricsConfigurationPolicy",
)({ noiseLevel: S.String }) {}
export class TrainedModelArtifactMaxSize extends S.Class<TrainedModelArtifactMaxSize>(
  "TrainedModelArtifactMaxSize",
)({ unit: S.String, value: S.Number }) {}
export class TrainedModelsConfigurationPolicy extends S.Class<TrainedModelsConfigurationPolicy>(
  "TrainedModelsConfigurationPolicy",
)({
  containerLogs: S.optional(LogsConfigurationPolicyList),
  containerMetrics: S.optional(MetricsConfigurationPolicy),
  maxArtifactSize: S.optional(TrainedModelArtifactMaxSize),
}) {}
export class TrainedModelExportsMaxSize extends S.Class<TrainedModelExportsMaxSize>(
  "TrainedModelExportsMaxSize",
)({ unit: S.String, value: S.Number }) {}
export const TrainedModelExportFileTypeList = S.Array(S.String);
export class TrainedModelExportsConfigurationPolicy extends S.Class<TrainedModelExportsConfigurationPolicy>(
  "TrainedModelExportsConfigurationPolicy",
)({
  maxSize: TrainedModelExportsMaxSize,
  filesToExport: TrainedModelExportFileTypeList,
}) {}
export class TrainedModelInferenceMaxOutputSize extends S.Class<TrainedModelInferenceMaxOutputSize>(
  "TrainedModelInferenceMaxOutputSize",
)({ unit: S.String, value: S.Number }) {}
export class TrainedModelInferenceJobsConfigurationPolicy extends S.Class<TrainedModelInferenceJobsConfigurationPolicy>(
  "TrainedModelInferenceJobsConfigurationPolicy",
)({
  containerLogs: S.optional(LogsConfigurationPolicyList),
  maxOutputSize: S.optional(TrainedModelInferenceMaxOutputSize),
}) {}
export class PrivacyConfigurationPolicies extends S.Class<PrivacyConfigurationPolicies>(
  "PrivacyConfigurationPolicies",
)({
  trainedModels: S.optional(TrainedModelsConfigurationPolicy),
  trainedModelExports: S.optional(TrainedModelExportsConfigurationPolicy),
  trainedModelInferenceJobs: S.optional(
    TrainedModelInferenceJobsConfigurationPolicy,
  ),
}) {}
export class PrivacyConfiguration extends S.Class<PrivacyConfiguration>(
  "PrivacyConfiguration",
)({ policies: PrivacyConfigurationPolicies }) {}
export class GetConfiguredModelAlgorithmAssociationResponse extends S.Class<GetConfiguredModelAlgorithmAssociationResponse>(
  "GetConfiguredModelAlgorithmAssociationResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmAssociationArn: S.String,
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  configuredModelAlgorithmArn: S.String,
  name: S.String,
  privacyConfiguration: S.optional(PrivacyConfiguration),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class GetCollaborationConfiguredModelAlgorithmAssociationResponse extends S.Class<GetCollaborationConfiguredModelAlgorithmAssociationResponse>(
  "GetCollaborationConfiguredModelAlgorithmAssociationResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmAssociationArn: S.String,
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  configuredModelAlgorithmArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  creatorAccountId: S.String,
  privacyConfiguration: S.optional(PrivacyConfiguration),
}) {}
export class Destination extends S.Class<Destination>("Destination")({
  s3Destination: S3ConfigMap,
}) {}
export class MLOutputConfiguration extends S.Class<MLOutputConfiguration>(
  "MLOutputConfiguration",
)({ destination: S.optional(Destination), roleArn: S.String }) {}
export class GetMLConfigurationResponse extends S.Class<GetMLConfigurationResponse>(
  "GetMLConfigurationResponse",
)({
  membershipIdentifier: S.String,
  defaultOutputLocation: MLOutputConfiguration,
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class AccessBudgetDetails extends S.Class<AccessBudgetDetails>(
  "AccessBudgetDetails",
)({
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  remainingBudget: S.Number,
  budget: S.Number,
  budgetType: S.String,
  autoRefresh: S.optional(S.String),
}) {}
export const AccessBudgetDetailsList = S.Array(AccessBudgetDetails);
export class AccessBudget extends S.Class<AccessBudget>("AccessBudget")({
  resourceArn: S.String,
  details: AccessBudgetDetailsList,
  aggregateRemainingBudget: S.Number,
}) {}
export const AccessBudgets = S.Array(AccessBudget);
export const PrivacyBudgets = S.Union(
  S.Struct({ accessBudgets: AccessBudgets }),
);
export class SyntheticDataColumnProperties extends S.Class<SyntheticDataColumnProperties>(
  "SyntheticDataColumnProperties",
)({
  columnName: S.String,
  columnType: S.String,
  isPredictiveValue: S.Boolean,
}) {}
export const ColumnMappingList = S.Array(SyntheticDataColumnProperties);
export class ColumnClassificationDetails extends S.Class<ColumnClassificationDetails>(
  "ColumnClassificationDetails",
)({ columnMapping: ColumnMappingList }) {}
export class MLSyntheticDataParameters extends S.Class<MLSyntheticDataParameters>(
  "MLSyntheticDataParameters",
)({
  epsilon: S.Number,
  maxMembershipInferenceAttackScore: S.Number,
  columnClassification: ColumnClassificationDetails,
}) {}
export class MembershipInferenceAttackScore extends S.Class<MembershipInferenceAttackScore>(
  "MembershipInferenceAttackScore",
)({ attackVersion: S.String, score: S.Number }) {}
export const MembershipInferenceAttackScoreList = S.Array(
  MembershipInferenceAttackScore,
);
export class DataPrivacyScores extends S.Class<DataPrivacyScores>(
  "DataPrivacyScores",
)({ membershipInferenceAttackScores: MembershipInferenceAttackScoreList }) {}
export class SyntheticDataEvaluationScores extends S.Class<SyntheticDataEvaluationScores>(
  "SyntheticDataEvaluationScores",
)({ dataPrivacyScores: DataPrivacyScores }) {}
export class SyntheticDataConfiguration extends S.Class<SyntheticDataConfiguration>(
  "SyntheticDataConfiguration",
)({
  syntheticDataParameters: MLSyntheticDataParameters,
  syntheticDataEvaluationScores: S.optional(SyntheticDataEvaluationScores),
}) {}
export class GetCollaborationMLInputChannelResponse extends S.Class<GetCollaborationMLInputChannelResponse>(
  "GetCollaborationMLInputChannelResponse",
)({
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  mlInputChannelArn: S.String,
  name: S.String,
  configuredModelAlgorithmAssociations:
    ConfiguredModelAlgorithmAssociationArnList,
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  retentionInDays: S.Number,
  numberOfRecords: S.optional(S.Number),
  privacyBudgets: S.optional(PrivacyBudgets),
  description: S.optional(S.String),
  syntheticDataConfiguration: S.optional(SyntheticDataConfiguration),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  creatorAccountId: S.String,
}) {}
export class CreateTrainedModelRequest extends S.Class<CreateTrainedModelRequest>(
  "CreateTrainedModelRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    configuredModelAlgorithmAssociationArn: S.String,
    hyperparameters: S.optional(HyperParameters),
    environment: S.optional(Environment),
    resourceConfig: ResourceConfig,
    stoppingCondition: S.optional(StoppingCondition),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannels,
    ),
    dataChannels: ModelTrainingDataChannels,
    trainingInputMode: S.optional(S.String),
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/trained-models",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IncrementalTrainingDataChannelOutput extends S.Class<IncrementalTrainingDataChannelOutput>(
  "IncrementalTrainingDataChannelOutput",
)({
  channelName: S.String,
  versionIdentifier: S.optional(S.String),
  modelName: S.String,
}) {}
export const IncrementalTrainingDataChannelsOutput = S.Array(
  IncrementalTrainingDataChannelOutput,
);
export class GetCollaborationTrainedModelResponse extends S.Class<GetCollaborationTrainedModelResponse>(
  "GetCollaborationTrainedModelResponse",
)({
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  trainedModelArn: S.String,
  versionIdentifier: S.optional(S.String),
  incrementalTrainingDataChannels: S.optional(
    IncrementalTrainingDataChannelsOutput,
  ),
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  configuredModelAlgorithmAssociationArn: S.String,
  resourceConfig: S.optional(ResourceConfig),
  trainingInputMode: S.optional(S.String),
  stoppingCondition: S.optional(StoppingCondition),
  metricsStatus: S.optional(S.String),
  metricsStatusDetails: S.optional(S.String),
  logsStatus: S.optional(S.String),
  logsStatusDetails: S.optional(S.String),
  trainingContainerImageDigest: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  creatorAccountId: S.String,
}) {}
export class TrainedModelSummary extends S.Class<TrainedModelSummary>(
  "TrainedModelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainedModelArn: S.String,
  versionIdentifier: S.optional(S.String),
  incrementalTrainingDataChannels: S.optional(
    IncrementalTrainingDataChannelsOutput,
  ),
  name: S.String,
  description: S.optional(S.String),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  status: S.String,
  configuredModelAlgorithmAssociationArn: S.String,
}) {}
export const TrainedModelList = S.Array(TrainedModelSummary);
export class ListTrainedModelVersionsResponse extends S.Class<ListTrainedModelVersionsResponse>(
  "ListTrainedModelVersionsResponse",
)({ nextToken: S.optional(S.String), trainedModels: TrainedModelList }) {}
export class InferenceReceiverMember extends S.Class<InferenceReceiverMember>(
  "InferenceReceiverMember",
)({ accountId: S.String }) {}
export const InferenceReceiverMembers = S.Array(InferenceReceiverMember);
export class InferenceOutputConfiguration extends S.Class<InferenceOutputConfiguration>(
  "InferenceOutputConfiguration",
)({ accept: S.optional(S.String), members: InferenceReceiverMembers }) {}
export class GetTrainedModelInferenceJobResponse extends S.Class<GetTrainedModelInferenceJobResponse>(
  "GetTrainedModelInferenceJobResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainedModelInferenceJobArn: S.String,
  configuredModelAlgorithmAssociationArn: S.optional(S.String),
  name: S.String,
  status: S.String,
  trainedModelArn: S.String,
  trainedModelVersionIdentifier: S.optional(S.String),
  resourceConfig: InferenceResourceConfig,
  outputConfiguration: InferenceOutputConfiguration,
  membershipIdentifier: S.String,
  dataSource: ModelInferenceDataSource,
  containerExecutionParameters: S.optional(
    InferenceContainerExecutionParameters,
  ),
  statusDetails: S.optional(StatusDetails),
  description: S.optional(S.String),
  inferenceContainerImageDigest: S.optional(S.String),
  environment: S.optional(InferenceEnvironmentMap),
  kmsKeyArn: S.optional(S.String),
  metricsStatus: S.optional(S.String),
  metricsStatusDetails: S.optional(S.String),
  logsStatus: S.optional(S.String),
  logsStatusDetails: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const ColumnTypeList = S.Array(S.String);
export class ColumnSchema extends S.Class<ColumnSchema>("ColumnSchema")({
  columnName: S.String,
  columnTypes: ColumnTypeList,
}) {}
export const DatasetSchemaList = S.Array(ColumnSchema);
export class GlueDataSource extends S.Class<GlueDataSource>("GlueDataSource")({
  tableName: S.String,
  databaseName: S.String,
  catalogId: S.optional(S.String),
}) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  glueDataSource: GlueDataSource,
}) {}
export class DatasetInputConfig extends S.Class<DatasetInputConfig>(
  "DatasetInputConfig",
)({ schema: DatasetSchemaList, dataSource: DataSource }) {}
export class Dataset extends S.Class<Dataset>("Dataset")({
  type: S.String,
  inputConfig: DatasetInputConfig,
}) {}
export const DatasetList = S.Array(Dataset);
export class GetTrainingDatasetResponse extends S.Class<GetTrainingDatasetResponse>(
  "GetTrainingDatasetResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainingDatasetArn: S.String,
  name: S.String,
  trainingData: DatasetList,
  status: S.String,
  roleArn: S.String,
  tags: S.optional(TagMap),
  description: S.optional(S.String),
}) {}
export class TrainedModelExportReceiverMember extends S.Class<TrainedModelExportReceiverMember>(
  "TrainedModelExportReceiverMember",
)({ accountId: S.String }) {}
export const TrainedModelExportReceiverMembers = S.Array(
  TrainedModelExportReceiverMember,
);
export class CollaborationConfiguredModelAlgorithmAssociationSummary extends S.Class<CollaborationConfiguredModelAlgorithmAssociationSummary>(
  "CollaborationConfiguredModelAlgorithmAssociationSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmAssociationArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  configuredModelAlgorithmArn: S.String,
  creatorAccountId: S.String,
}) {}
export const CollaborationConfiguredModelAlgorithmAssociationList = S.Array(
  CollaborationConfiguredModelAlgorithmAssociationSummary,
);
export class CollaborationMLInputChannelSummary extends S.Class<CollaborationMLInputChannelSummary>(
  "CollaborationMLInputChannelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  name: S.String,
  configuredModelAlgorithmAssociations:
    ConfiguredModelAlgorithmAssociationArnList,
  mlInputChannelArn: S.String,
  status: S.String,
  creatorAccountId: S.String,
  description: S.optional(S.String),
}) {}
export const CollaborationMLInputChannelsList = S.Array(
  CollaborationMLInputChannelSummary,
);
export class TrainedModelExportOutputConfiguration extends S.Class<TrainedModelExportOutputConfiguration>(
  "TrainedModelExportOutputConfiguration",
)({ members: TrainedModelExportReceiverMembers }) {}
export class CollaborationTrainedModelExportJobSummary extends S.Class<CollaborationTrainedModelExportJobSummary>(
  "CollaborationTrainedModelExportJobSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  name: S.String,
  outputConfiguration: TrainedModelExportOutputConfiguration,
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  description: S.optional(S.String),
  creatorAccountId: S.String,
  trainedModelArn: S.String,
  trainedModelVersionIdentifier: S.optional(S.String),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
}) {}
export const CollaborationTrainedModelExportJobList = S.Array(
  CollaborationTrainedModelExportJobSummary,
);
export class CollaborationTrainedModelInferenceJobSummary extends S.Class<CollaborationTrainedModelInferenceJobSummary>(
  "CollaborationTrainedModelInferenceJobSummary",
)({
  trainedModelInferenceJobArn: S.String,
  configuredModelAlgorithmAssociationArn: S.optional(S.String),
  membershipIdentifier: S.String,
  trainedModelArn: S.String,
  trainedModelVersionIdentifier: S.optional(S.String),
  collaborationIdentifier: S.String,
  status: S.String,
  outputConfiguration: InferenceOutputConfiguration,
  name: S.String,
  description: S.optional(S.String),
  metricsStatus: S.optional(S.String),
  metricsStatusDetails: S.optional(S.String),
  logsStatus: S.optional(S.String),
  logsStatusDetails: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  creatorAccountId: S.String,
}) {}
export const CollaborationTrainedModelInferenceJobList = S.Array(
  CollaborationTrainedModelInferenceJobSummary,
);
export class CollaborationTrainedModelSummary extends S.Class<CollaborationTrainedModelSummary>(
  "CollaborationTrainedModelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainedModelArn: S.String,
  name: S.String,
  versionIdentifier: S.optional(S.String),
  incrementalTrainingDataChannels: S.optional(
    IncrementalTrainingDataChannelsOutput,
  ),
  description: S.optional(S.String),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  status: S.String,
  configuredModelAlgorithmAssociationArn: S.String,
  creatorAccountId: S.String,
}) {}
export const CollaborationTrainedModelList = S.Array(
  CollaborationTrainedModelSummary,
);
export class AudienceExportJobSummary extends S.Class<AudienceExportJobSummary>(
  "AudienceExportJobSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  name: S.String,
  audienceGenerationJobArn: S.String,
  audienceSize: AudienceSize,
  description: S.optional(S.String),
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  outputLocation: S.optional(S.String),
}) {}
export const AudienceExportJobList = S.Array(AudienceExportJobSummary);
export class AudienceGenerationJobSummary extends S.Class<AudienceGenerationJobSummary>(
  "AudienceGenerationJobSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  audienceGenerationJobArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  configuredAudienceModelArn: S.String,
  collaborationId: S.optional(S.String),
  startedBy: S.optional(S.String),
}) {}
export const AudienceGenerationJobList = S.Array(AudienceGenerationJobSummary);
export class AudienceModelSummary extends S.Class<AudienceModelSummary>(
  "AudienceModelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  audienceModelArn: S.String,
  name: S.String,
  trainingDatasetArn: S.String,
  status: S.String,
  description: S.optional(S.String),
}) {}
export const AudienceModelList = S.Array(AudienceModelSummary);
export class ConfiguredAudienceModelSummary extends S.Class<ConfiguredAudienceModelSummary>(
  "ConfiguredAudienceModelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  name: S.String,
  audienceModelArn: S.String,
  outputConfig: ConfiguredAudienceModelOutputConfig,
  description: S.optional(S.String),
  configuredAudienceModelArn: S.String,
  status: S.String,
}) {}
export const ConfiguredAudienceModelList = S.Array(
  ConfiguredAudienceModelSummary,
);
export class ConfiguredModelAlgorithmSummary extends S.Class<ConfiguredModelAlgorithmSummary>(
  "ConfiguredModelAlgorithmSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmArn: S.String,
  name: S.String,
  description: S.optional(S.String),
}) {}
export const ConfiguredModelAlgorithmList = S.Array(
  ConfiguredModelAlgorithmSummary,
);
export class ConfiguredModelAlgorithmAssociationSummary extends S.Class<ConfiguredModelAlgorithmAssociationSummary>(
  "ConfiguredModelAlgorithmAssociationSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  configuredModelAlgorithmAssociationArn: S.String,
  configuredModelAlgorithmArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
}) {}
export const ConfiguredModelAlgorithmAssociationList = S.Array(
  ConfiguredModelAlgorithmAssociationSummary,
);
export class MLInputChannelSummary extends S.Class<MLInputChannelSummary>(
  "MLInputChannelSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  name: S.String,
  configuredModelAlgorithmAssociations:
    ConfiguredModelAlgorithmAssociationArnList,
  protectedQueryIdentifier: S.optional(S.String),
  mlInputChannelArn: S.String,
  status: S.String,
  description: S.optional(S.String),
}) {}
export const MLInputChannelsList = S.Array(MLInputChannelSummary);
export class TrainedModelInferenceJobSummary extends S.Class<TrainedModelInferenceJobSummary>(
  "TrainedModelInferenceJobSummary",
)({
  trainedModelInferenceJobArn: S.String,
  configuredModelAlgorithmAssociationArn: S.optional(S.String),
  membershipIdentifier: S.String,
  trainedModelArn: S.String,
  trainedModelVersionIdentifier: S.optional(S.String),
  collaborationIdentifier: S.String,
  status: S.String,
  outputConfiguration: InferenceOutputConfiguration,
  name: S.String,
  description: S.optional(S.String),
  metricsStatus: S.optional(S.String),
  metricsStatusDetails: S.optional(S.String),
  logsStatus: S.optional(S.String),
  logsStatusDetails: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const TrainedModelInferenceJobList = S.Array(
  TrainedModelInferenceJobSummary,
);
export class TrainingDatasetSummary extends S.Class<TrainingDatasetSummary>(
  "TrainingDatasetSummary",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  trainingDatasetArn: S.String,
  name: S.String,
  status: S.String,
  description: S.optional(S.String),
}) {}
export const TrainingDatasetList = S.Array(TrainingDatasetSummary);
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export class WorkerComputeConfiguration extends S.Class<WorkerComputeConfiguration>(
  "WorkerComputeConfiguration",
)({ type: S.optional(S.String), number: S.optional(S.Number) }) {}
export class ProtectedQuerySQLParameters extends S.Class<ProtectedQuerySQLParameters>(
  "ProtectedQuerySQLParameters",
)({
  queryString: S.optional(S.String),
  analysisTemplateArn: S.optional(S.String),
  parameters: S.optional(ParameterMap),
}) {}
export const ComputeConfiguration = S.Union(
  S.Struct({ worker: WorkerComputeConfiguration }),
);
export class ProtectedQueryInputParameters extends S.Class<ProtectedQueryInputParameters>(
  "ProtectedQueryInputParameters",
)({
  sqlParameters: ProtectedQuerySQLParameters,
  computeConfiguration: S.optional(ComputeConfiguration),
  resultFormat: S.optional(S.String),
}) {}
export class ListCollaborationConfiguredModelAlgorithmAssociationsResponse extends S.Class<ListCollaborationConfiguredModelAlgorithmAssociationsResponse>(
  "ListCollaborationConfiguredModelAlgorithmAssociationsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationConfiguredModelAlgorithmAssociations:
    CollaborationConfiguredModelAlgorithmAssociationList,
}) {}
export class ListCollaborationMLInputChannelsResponse extends S.Class<ListCollaborationMLInputChannelsResponse>(
  "ListCollaborationMLInputChannelsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationMLInputChannelsList: CollaborationMLInputChannelsList,
}) {}
export class ListCollaborationTrainedModelExportJobsResponse extends S.Class<ListCollaborationTrainedModelExportJobsResponse>(
  "ListCollaborationTrainedModelExportJobsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationTrainedModelExportJobs: CollaborationTrainedModelExportJobList,
}) {}
export class ListCollaborationTrainedModelInferenceJobsResponse extends S.Class<ListCollaborationTrainedModelInferenceJobsResponse>(
  "ListCollaborationTrainedModelInferenceJobsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationTrainedModelInferenceJobs:
    CollaborationTrainedModelInferenceJobList,
}) {}
export class ListCollaborationTrainedModelsResponse extends S.Class<ListCollaborationTrainedModelsResponse>(
  "ListCollaborationTrainedModelsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationTrainedModels: CollaborationTrainedModelList,
}) {}
export class ListAudienceExportJobsResponse extends S.Class<ListAudienceExportJobsResponse>(
  "ListAudienceExportJobsResponse",
)({
  nextToken: S.optional(S.String),
  audienceExportJobs: AudienceExportJobList,
}) {}
export class ListAudienceGenerationJobsResponse extends S.Class<ListAudienceGenerationJobsResponse>(
  "ListAudienceGenerationJobsResponse",
)({
  nextToken: S.optional(S.String),
  audienceGenerationJobs: AudienceGenerationJobList,
}) {}
export class ListAudienceModelsResponse extends S.Class<ListAudienceModelsResponse>(
  "ListAudienceModelsResponse",
)({ nextToken: S.optional(S.String), audienceModels: AudienceModelList }) {}
export class CreateConfiguredAudienceModelRequest extends S.Class<CreateConfiguredAudienceModelRequest>(
  "CreateConfiguredAudienceModelRequest",
)(
  {
    name: S.String,
    audienceModelArn: S.String,
    outputConfig: ConfiguredAudienceModelOutputConfig,
    description: S.optional(S.String),
    sharedAudienceMetrics: MetricsList,
    minMatchingSeedSize: S.optional(S.Number),
    audienceSizeConfig: S.optional(AudienceSizeConfig),
    tags: S.optional(TagMap),
    childResourceTagOnCreatePolicy: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configured-audience-model" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfiguredAudienceModelsResponse extends S.Class<ListConfiguredAudienceModelsResponse>(
  "ListConfiguredAudienceModelsResponse",
)({
  nextToken: S.optional(S.String),
  configuredAudienceModels: ConfiguredAudienceModelList,
}) {}
export class CreateConfiguredModelAlgorithmRequest extends S.Class<CreateConfiguredModelAlgorithmRequest>(
  "CreateConfiguredModelAlgorithmRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    trainingContainerConfig: S.optional(ContainerConfig),
    inferenceContainerConfig: S.optional(InferenceContainerConfig),
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configured-model-algorithms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfiguredModelAlgorithmsResponse extends S.Class<ListConfiguredModelAlgorithmsResponse>(
  "ListConfiguredModelAlgorithmsResponse",
)({
  nextToken: S.optional(S.String),
  configuredModelAlgorithms: ConfiguredModelAlgorithmList,
}) {}
export class ListConfiguredModelAlgorithmAssociationsResponse extends S.Class<ListConfiguredModelAlgorithmAssociationsResponse>(
  "ListConfiguredModelAlgorithmAssociationsResponse",
)({
  nextToken: S.optional(S.String),
  configuredModelAlgorithmAssociations: ConfiguredModelAlgorithmAssociationList,
}) {}
export class PutMLConfigurationRequest extends S.Class<PutMLConfigurationRequest>(
  "PutMLConfigurationRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    defaultOutputLocation: MLOutputConfiguration,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/memberships/{membershipIdentifier}/ml-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutMLConfigurationResponse extends S.Class<PutMLConfigurationResponse>(
  "PutMLConfigurationResponse",
)({}) {}
export class ListMLInputChannelsResponse extends S.Class<ListMLInputChannelsResponse>(
  "ListMLInputChannelsResponse",
)({
  nextToken: S.optional(S.String),
  mlInputChannelsList: MLInputChannelsList,
}) {}
export class CreateTrainedModelResponse extends S.Class<CreateTrainedModelResponse>(
  "CreateTrainedModelResponse",
)({ trainedModelArn: S.String, versionIdentifier: S.optional(S.String) }) {}
export class GetTrainedModelResponse extends S.Class<GetTrainedModelResponse>(
  "GetTrainedModelResponse",
)({
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  trainedModelArn: S.String,
  versionIdentifier: S.optional(S.String),
  incrementalTrainingDataChannels: S.optional(
    IncrementalTrainingDataChannelsOutput,
  ),
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  configuredModelAlgorithmAssociationArn: S.String,
  resourceConfig: S.optional(ResourceConfig),
  trainingInputMode: S.optional(S.String),
  stoppingCondition: S.optional(StoppingCondition),
  metricsStatus: S.optional(S.String),
  metricsStatusDetails: S.optional(S.String),
  logsStatus: S.optional(S.String),
  logsStatusDetails: S.optional(S.String),
  trainingContainerImageDigest: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  hyperparameters: S.optional(HyperParameters),
  environment: S.optional(Environment),
  kmsKeyArn: S.optional(S.String),
  tags: S.optional(TagMap),
  dataChannels: ModelTrainingDataChannels,
}) {}
export class ListTrainedModelsResponse extends S.Class<ListTrainedModelsResponse>(
  "ListTrainedModelsResponse",
)({ nextToken: S.optional(S.String), trainedModels: TrainedModelList }) {}
export class StartTrainedModelExportJobRequest extends S.Class<StartTrainedModelExportJobRequest>(
  "StartTrainedModelExportJobRequest",
)(
  {
    name: S.String,
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    outputConfiguration: TrainedModelExportOutputConfiguration,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}/export-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTrainedModelExportJobResponse extends S.Class<StartTrainedModelExportJobResponse>(
  "StartTrainedModelExportJobResponse",
)({}) {}
export class StartTrainedModelInferenceJobRequest extends S.Class<StartTrainedModelInferenceJobRequest>(
  "StartTrainedModelInferenceJobRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    configuredModelAlgorithmAssociationArn: S.optional(S.String),
    resourceConfig: InferenceResourceConfig,
    outputConfiguration: InferenceOutputConfiguration,
    dataSource: ModelInferenceDataSource,
    description: S.optional(S.String),
    containerExecutionParameters: S.optional(
      InferenceContainerExecutionParameters,
    ),
    environment: S.optional(InferenceEnvironmentMap),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrainedModelInferenceJobsResponse extends S.Class<ListTrainedModelInferenceJobsResponse>(
  "ListTrainedModelInferenceJobsResponse",
)({
  nextToken: S.optional(S.String),
  trainedModelInferenceJobs: TrainedModelInferenceJobList,
}) {}
export class ListTrainingDatasetsResponse extends S.Class<ListTrainingDatasetsResponse>(
  "ListTrainingDatasetsResponse",
)({ nextToken: S.optional(S.String), trainingDatasets: TrainingDatasetList }) {}
export class RelevanceMetric extends S.Class<RelevanceMetric>(
  "RelevanceMetric",
)({ audienceSize: AudienceSize, score: S.optional(S.Number) }) {}
export const RelevanceMetrics = S.Array(RelevanceMetric);
export const InputChannelDataSource = S.Union(
  S.Struct({ protectedQueryInputParameters: ProtectedQueryInputParameters }),
);
export class AudienceGenerationJobDataSource extends S.Class<AudienceGenerationJobDataSource>(
  "AudienceGenerationJobDataSource",
)({
  dataSource: S.optional(S3ConfigMap),
  roleArn: S.String,
  sqlParameters: S.optional(ProtectedQuerySQLParameters),
  sqlComputeConfiguration: S.optional(ComputeConfiguration),
}) {}
export class AudienceQualityMetrics extends S.Class<AudienceQualityMetrics>(
  "AudienceQualityMetrics",
)({ relevanceMetrics: RelevanceMetrics, recallMetric: S.optional(S.Number) }) {}
export class InputChannel extends S.Class<InputChannel>("InputChannel")({
  dataSource: InputChannelDataSource,
  roleArn: S.String,
}) {}
export class StartAudienceGenerationJobRequest extends S.Class<StartAudienceGenerationJobRequest>(
  "StartAudienceGenerationJobRequest",
)(
  {
    name: S.String,
    configuredAudienceModelArn: S.String,
    seedAudience: AudienceGenerationJobDataSource,
    includeSeedInOutput: S.optional(S.Boolean),
    collaborationId: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audience-generation-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAudienceGenerationJobResponse extends S.Class<GetAudienceGenerationJobResponse>(
  "GetAudienceGenerationJobResponse",
)({
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  audienceGenerationJobArn: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  configuredAudienceModelArn: S.String,
  seedAudience: S.optional(AudienceGenerationJobDataSource),
  includeSeedInOutput: S.optional(S.Boolean),
  collaborationId: S.optional(S.String),
  metrics: S.optional(AudienceQualityMetrics),
  startedBy: S.optional(S.String),
  tags: S.optional(TagMap),
  protectedQueryIdentifier: S.optional(S.String),
}) {}
export class CreateConfiguredAudienceModelResponse extends S.Class<CreateConfiguredAudienceModelResponse>(
  "CreateConfiguredAudienceModelResponse",
)({ configuredAudienceModelArn: S.String }) {}
export class CreateConfiguredModelAlgorithmResponse extends S.Class<CreateConfiguredModelAlgorithmResponse>(
  "CreateConfiguredModelAlgorithmResponse",
)({ configuredModelAlgorithmArn: S.String }) {}
export class CreateMLInputChannelRequest extends S.Class<CreateMLInputChannelRequest>(
  "CreateMLInputChannelRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    inputChannel: InputChannel,
    name: S.String,
    retentionInDays: S.Number,
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/ml-input-channels",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTrainedModelInferenceJobResponse extends S.Class<StartTrainedModelInferenceJobResponse>(
  "StartTrainedModelInferenceJobResponse",
)({ trainedModelInferenceJobArn: S.String }) {}
export class StartAudienceGenerationJobResponse extends S.Class<StartAudienceGenerationJobResponse>(
  "StartAudienceGenerationJobResponse",
)({ audienceGenerationJobArn: S.String }) {}
export class CreateMLInputChannelResponse extends S.Class<CreateMLInputChannelResponse>(
  "CreateMLInputChannelResponse",
)({ mlInputChannelArn: S.String }) {}
export class CreateTrainingDatasetRequest extends S.Class<CreateTrainingDatasetRequest>(
  "CreateTrainingDatasetRequest",
)(
  {
    name: S.String,
    roleArn: S.String,
    trainingData: DatasetList,
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/training-dataset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMLInputChannelResponse extends S.Class<GetMLInputChannelResponse>(
  "GetMLInputChannelResponse",
)({
  membershipIdentifier: S.String,
  collaborationIdentifier: S.String,
  mlInputChannelArn: S.String,
  name: S.String,
  configuredModelAlgorithmAssociations:
    ConfiguredModelAlgorithmAssociationArnList,
  status: S.String,
  statusDetails: S.optional(StatusDetails),
  retentionInDays: S.Number,
  numberOfRecords: S.optional(S.Number),
  privacyBudgets: S.optional(PrivacyBudgets),
  description: S.optional(S.String),
  syntheticDataConfiguration: S.optional(SyntheticDataConfiguration),
  createTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  inputChannel: InputChannel,
  protectedQueryIdentifier: S.optional(S.String),
  numberOfFiles: S.optional(S.Number),
  sizeInGb: S.optional(S.Number),
  kmsKeyArn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class CreateTrainingDatasetResponse extends S.Class<CreateTrainingDatasetResponse>(
  "CreateTrainingDatasetResponse",
)({ trainingDatasetArn: S.String }) {}
export class CreateConfiguredModelAlgorithmAssociationRequest extends S.Class<CreateConfiguredModelAlgorithmAssociationRequest>(
  "CreateConfiguredModelAlgorithmAssociationRequest",
)(
  {
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    privacyConfiguration: S.optional(PrivacyConfiguration),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConfiguredModelAlgorithmAssociationResponse extends S.Class<CreateConfiguredModelAlgorithmAssociationResponse>(
  "CreateConfiguredModelAlgorithmAssociationResponse",
)({ configuredModelAlgorithmAssociationArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
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
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    quotaName: S.optional(S.String),
    quotaValue: S.optional(S.Number),
  },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}

//# Operations
/**
 * Removes metadata tags from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Export an audience of a specified size after you have generated an audience.
 */
export const startAudienceExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAudienceExportJobRequest,
    output: StartAudienceExportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about an audience generation job.
 */
export const getAudienceGenerationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAudienceGenerationJobRequest,
    output: GetAudienceGenerationJobResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Defines the information necessary to create a configured audience model.
 */
export const createConfiguredAudienceModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredAudienceModelRequest,
    output: CreateConfiguredAudienceModelResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Creates a configured model algorithm using a container image stored in an ECR repository.
 */
export const createConfiguredModelAlgorithm =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredModelAlgorithmRequest,
    output: CreateConfiguredModelAlgorithmResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Creates a trained model from an associated configured model algorithm using data from any member of the collaboration.
 */
export const createTrainedModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrainedModelRequest,
  output: CreateTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Defines the information necessary to begin a trained model inference job.
 */
export const startTrainedModelInferenceJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartTrainedModelInferenceJobRequest,
    output: StartTrainedModelInferenceJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of the ML input channels in a collaboration.
 */
export const listCollaborationMLInputChannels =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationMLInputChannelsRequest,
    output: ListCollaborationMLInputChannelsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Returns a list of the export jobs for a trained model in a collaboration.
 */
export const listCollaborationTrainedModelExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationTrainedModelExportJobsRequest,
    output: ListCollaborationTrainedModelExportJobsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Returns a list of trained model inference jobs in a specified collaboration.
 */
export const listCollaborationTrainedModelInferenceJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationTrainedModelInferenceJobsRequest,
    output: ListCollaborationTrainedModelInferenceJobsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Returns a list of the trained models in a collaboration.
 */
export const listCollaborationTrainedModels =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationTrainedModelsRequest,
    output: ListCollaborationTrainedModelsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Returns a list of configured model algorithm associations.
 */
export const listConfiguredModelAlgorithmAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfiguredModelAlgorithmAssociationsRequest,
    output: ListConfiguredModelAlgorithmAssociationsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Assigns information about an ML configuration.
 */
export const putMLConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMLConfigurationRequest,
  output: PutMLConfigurationResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns a list of ML input channels.
 */
export const listMLInputChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMLInputChannelsRequest,
  output: ListMLInputChannelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns information about a trained model.
 */
export const getTrainedModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrainedModelRequest,
  output: GetTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of trained models.
 */
export const listTrainedModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrainedModelsRequest,
  output: ListTrainedModelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Provides the information necessary to start a trained model export job.
 */
export const startTrainedModelExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTrainedModelExportJobRequest,
    output: StartTrainedModelExportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of trained model inference jobs that match the request parameters.
 */
export const listTrainedModelInferenceJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTrainedModelInferenceJobsRequest,
    output: ListTrainedModelInferenceJobsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Returns information about a configured model algorithm association.
 */
export const getConfiguredModelAlgorithmAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredModelAlgorithmAssociationRequest,
    output: GetConfiguredModelAlgorithmAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about the configured model algorithm association in a collaboration.
 */
export const getCollaborationConfiguredModelAlgorithmAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationConfiguredModelAlgorithmAssociationRequest,
    output: GetCollaborationConfiguredModelAlgorithmAssociationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a specific ML configuration.
 */
export const getMLConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLConfigurationRequest,
  output: GetMLConfigurationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific ML input channel in a collaboration.
 */
export const getCollaborationMLInputChannel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationMLInputChannelRequest,
    output: GetCollaborationMLInputChannelResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a trained model in a collaboration.
 */
export const getCollaborationTrainedModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCollaborationTrainedModelRequest,
    output: GetCollaborationTrainedModelResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of trained model versions for a specified trained model. This operation allows you to view all versions of a trained model, including information about their status and creation details. You can use this to track the evolution of your trained models and select specific versions for inference or further training.
 */
export const listTrainedModelVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTrainedModelVersionsRequest,
    output: ListTrainedModelVersionsResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a trained model inference job.
 */
export const getTrainedModelInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTrainedModelInferenceJobRequest,
    output: GetTrainedModelInferenceJobResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a ML modeling configuration.
 */
export const deleteMLConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMLConfigurationRequest,
    output: DeleteMLConfigurationResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a configured model algorithm association.
 */
export const deleteConfiguredModelAlgorithmAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredModelAlgorithmAssociationRequest,
    output: DeleteConfiguredModelAlgorithmAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Provides the information necessary to delete an ML input channel.
 */
export const deleteMLInputChannelData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMLInputChannelDataRequest,
    output: DeleteMLInputChannelDataResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the model artifacts stored by the service.
 */
export const deleteTrainedModelOutput = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTrainedModelOutputRequest,
    output: DeleteTrainedModelOutputResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Submits a request to cancel the trained model job.
 */
export const cancelTrainedModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTrainedModelRequest,
  output: CancelTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Submits a request to cancel a trained model inference job.
 */
export const cancelTrainedModelInferenceJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelTrainedModelInferenceJobRequest,
    output: CancelTrainedModelInferenceJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of the audience export jobs.
 */
export const listAudienceExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAudienceExportJobsRequest,
    output: ListAudienceExportJobsResponse,
    errors: [AccessDeniedException, ValidationException],
  }),
);
/**
 * Returns a list of audience generation jobs.
 */
export const listAudienceGenerationJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAudienceGenerationJobsRequest,
    output: ListAudienceGenerationJobsResponse,
    errors: [AccessDeniedException, ValidationException],
  }),
);
/**
 * Returns a list of audience models.
 */
export const listAudienceModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAudienceModelsRequest,
  output: ListAudienceModelsResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Returns a list of the configured audience models.
 */
export const listConfiguredAudienceModels =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfiguredAudienceModelsRequest,
    output: ListConfiguredAudienceModelsResponse,
    errors: [AccessDeniedException, ValidationException],
  }));
/**
 * Returns a list of configured model algorithms.
 */
export const listConfiguredModelAlgorithms =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfiguredModelAlgorithmsRequest,
    output: ListConfiguredModelAlgorithmsResponse,
    errors: [AccessDeniedException, ValidationException],
  }));
/**
 * Returns a list of training datasets.
 */
export const listTrainingDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTrainingDatasetsRequest,
    output: ListTrainingDatasetsResponse,
    errors: [AccessDeniedException, ValidationException],
  }),
);
/**
 * Returns information about an audience model
 */
export const getAudienceModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAudienceModelRequest,
  output: GetAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specified configured audience model.
 */
export const getConfiguredAudienceModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConfiguredAudienceModelRequest,
    output: GetConfiguredAudienceModelResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Create or update the resource policy for a configured audience model.
 */
export const putConfiguredAudienceModelPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfiguredAudienceModelPolicyRequest,
    output: PutConfiguredAudienceModelPolicyResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a configured audience model policy.
 */
export const getConfiguredAudienceModelPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfiguredAudienceModelPolicyRequest,
    output: GetConfiguredAudienceModelPolicyResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a configured model algorithm.
 */
export const getConfiguredModelAlgorithm = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConfiguredModelAlgorithmRequest,
    output: GetConfiguredModelAlgorithmResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a training dataset.
 */
export const getTrainingDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrainingDatasetRequest,
  output: GetTrainingDatasetResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified configured audience model policy.
 */
export const deleteConfiguredAudienceModelPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredAudienceModelPolicyRequest,
    output: DeleteConfiguredAudienceModelPolicyResponse,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of tags for a provided resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds metadata tags to a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides the information necessary to update a configured audience model. Updates that impact audience generation jobs take effect when a new job starts, but do not impact currently running jobs.
 */
export const updateConfiguredAudienceModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfiguredAudienceModelRequest,
    output: UpdateConfiguredAudienceModelResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes the specified audience generation job, and removes all data associated with the job.
 */
export const deleteAudienceGenerationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAudienceGenerationJobRequest,
    output: DeleteAudienceGenerationJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Specifies an audience model that you want to delete. You can't delete an audience model if there are any configured audience models that depend on the audience model.
 */
export const deleteAudienceModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAudienceModelRequest,
  output: DeleteAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified configured audience model. You can't delete a configured audience model if there are any lookalike models that use the configured audience model. If you delete a configured audience model, it will be removed from any collaborations that it is associated to.
 */
export const deleteConfiguredAudienceModel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredAudienceModelRequest,
    output: DeleteConfiguredAudienceModelResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes a configured model algorithm.
 */
export const deleteConfiguredModelAlgorithm =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfiguredModelAlgorithmRequest,
    output: DeleteConfiguredModelAlgorithmResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Specifies a training dataset that you want to delete. You can't delete a training dataset if there are any audience models that depend on the training dataset. In Clean Rooms ML, the `TrainingDataset` is metadata that points to a Glue table, which is read only during `AudienceModel` creation. This action deletes the metadata.
 */
export const deleteTrainingDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTrainingDatasetRequest,
    output: DeleteTrainingDatasetResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of the configured model algorithm associations in a collaboration.
 */
export const listCollaborationConfiguredModelAlgorithmAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
    output: ListCollaborationConfiguredModelAlgorithmAssociationsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
  }));
/**
 * Defines the information necessary to create an audience model. An audience model is a machine learning model that Clean Rooms ML trains to measure similarity between users. Clean Rooms ML manages training and storing the audience model. The audience model can be used in multiple calls to the StartAudienceGenerationJob API.
 */
export const createAudienceModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAudienceModelRequest,
  output: CreateAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Information necessary to start the audience generation job.
 */
export const startAudienceGenerationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAudienceGenerationJobRequest,
    output: StartAudienceGenerationJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Provides the information to create an ML input channel. An ML input channel is the result of a query that can be used for ML modeling.
 */
export const createMLInputChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMLInputChannelRequest,
    output: CreateMLInputChannelResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about an ML input channel.
 */
export const getMLInputChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLInputChannelRequest,
  output: GetMLInputChannelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Defines the information necessary to create a training dataset. In Clean Rooms ML, the `TrainingDataset` is metadata that points to a Glue table, which is read only during `AudienceModel` creation.
 */
export const createTrainingDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTrainingDatasetRequest,
    output: CreateTrainingDatasetResponse,
    errors: [AccessDeniedException, ConflictException, ValidationException],
  }),
);
/**
 * Associates a configured model algorithm to a collaboration for use by any member of the collaboration.
 */
export const createConfiguredModelAlgorithmAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfiguredModelAlgorithmAssociationRequest,
    output: CreateConfiguredModelAlgorithmAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));

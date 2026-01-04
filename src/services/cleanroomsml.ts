import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
export class ListCollaborationConfiguredModelAlgorithmAssociationsRequest extends S.Class<ListCollaborationConfiguredModelAlgorithmAssociationsRequest>(
  "ListCollaborationConfiguredModelAlgorithmAssociationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(T.HttpLabel()),
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
    collaborationIdentifier: S.String.pipe(T.HttpLabel()),
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
    collaborationIdentifier: S.String.pipe(T.HttpLabel()),
    trainedModelArn: S.String.pipe(T.HttpLabel()),
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
    collaborationIdentifier: S.String.pipe(T.HttpLabel()),
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
    collaborationIdentifier: S.String.pipe(T.HttpLabel()),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
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
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export const ConfiguredModelAlgorithmAssociationArnList = S.Array(S.String);
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
export class StatusDetails extends S.Class<StatusDetails>("StatusDetails")({
  statusCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
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
export class TrainedModelExportReceiverMember extends S.Class<TrainedModelExportReceiverMember>(
  "TrainedModelExportReceiverMember",
)({ accountId: S.String }) {}
export const TrainedModelExportReceiverMembers = S.Array(
  TrainedModelExportReceiverMember,
);
export class InferenceReceiverMember extends S.Class<InferenceReceiverMember>(
  "InferenceReceiverMember",
)({ accountId: S.String }) {}
export const InferenceReceiverMembers = S.Array(InferenceReceiverMember);
export class ListCollaborationTrainedModelsResponse extends S.Class<ListCollaborationTrainedModelsResponse>(
  "ListCollaborationTrainedModelsResponse",
)({
  nextToken: S.optional(S.String),
  collaborationTrainedModels: CollaborationTrainedModelList,
}) {}
export class TrainedModelExportOutputConfiguration extends S.Class<TrainedModelExportOutputConfiguration>(
  "TrainedModelExportOutputConfiguration",
)({ members: TrainedModelExportReceiverMembers }) {}
export class InferenceOutputConfiguration extends S.Class<InferenceOutputConfiguration>(
  "InferenceOutputConfiguration",
)({ accept: S.optional(S.String), members: InferenceReceiverMembers }) {}
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

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
 * Returns a list of the ML input channels in a collaboration.
 */
export const listCollaborationMLInputChannels =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationMLInputChannelsRequest,
    output: ListCollaborationMLInputChannelsResponse,
    errors: [AccessDeniedException, ThrottlingException, ValidationException],
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
 * Returns a list of the configured model algorithm associations in a collaboration.
 */
export const listCollaborationConfiguredModelAlgorithmAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
    output: ListCollaborationConfiguredModelAlgorithmAssociationsResponse,
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

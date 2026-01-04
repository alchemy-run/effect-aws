import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SupplyChain",
  serviceShapeName: "GalaxyPublicAPIGateway",
});
const auth = T.AwsAuthSigv4({ name: "scn" });
const ver = T.ServiceVersion("2024-01-01");
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
                                url: "https://scn-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://scn-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://scn.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://scn.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class GetDataIntegrationEventRequest extends S.Class<GetDataIntegrationEventRequest>(
  "GetDataIntegrationEventRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel()),
    eventId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events/{eventId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataIntegrationFlowExecutionRequest extends S.Class<GetDataIntegrationFlowExecutionRequest>(
  "GetDataIntegrationFlowExecutionRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel()),
    flowName: S.String.pipe(T.HttpLabel()),
    executionId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-flows/{flowName}/executions/{executionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationEventsRequest extends S.Class<ListDataIntegrationEventsRequest>(
  "ListDataIntegrationEventsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel()),
    eventType: S.optional(S.String).pipe(T.HttpQuery("eventType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataIntegrationFlowExecutionsRequest extends S.Class<ListDataIntegrationFlowExecutionsRequest>(
  "ListDataIntegrationFlowExecutionsRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel()),
    flowName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-flows/{flowName}/executions",
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
    T.Http({ method: "GET", uri: "/api/tags/{resourceArn}" }),
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
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/api/tags/{resourceArn}" }),
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
export class DataIntegrationEventDatasetLoadExecutionDetails extends S.Class<DataIntegrationEventDatasetLoadExecutionDetails>(
  "DataIntegrationEventDatasetLoadExecutionDetails",
)({ status: S.String, message: S.optional(S.String) }) {}
export class DataIntegrationEventDatasetTargetDetails extends S.Class<DataIntegrationEventDatasetTargetDetails>(
  "DataIntegrationEventDatasetTargetDetails",
)({
  datasetIdentifier: S.String,
  operationType: S.String,
  datasetLoadExecution: DataIntegrationEventDatasetLoadExecutionDetails,
}) {}
export class DataIntegrationEvent extends S.Class<DataIntegrationEvent>(
  "DataIntegrationEvent",
)({
  instanceId: S.String,
  eventId: S.String,
  eventType: S.String,
  eventGroupId: S.String,
  eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  datasetTargetDetails: S.optional(DataIntegrationEventDatasetTargetDetails),
}) {}
export const DataIntegrationEventList = S.Array(DataIntegrationEvent);
export class DataIntegrationFlowS3Source extends S.Class<DataIntegrationFlowS3Source>(
  "DataIntegrationFlowS3Source",
)({ bucketName: S.String, key: S.String }) {}
export class DataIntegrationFlowDatasetSource extends S.Class<DataIntegrationFlowDatasetSource>(
  "DataIntegrationFlowDatasetSource",
)({ datasetIdentifier: S.String }) {}
export class DataIntegrationFlowExecutionSourceInfo extends S.Class<DataIntegrationFlowExecutionSourceInfo>(
  "DataIntegrationFlowExecutionSourceInfo",
)({
  sourceType: S.String,
  s3Source: S.optional(DataIntegrationFlowS3Source),
  datasetSource: S.optional(DataIntegrationFlowDatasetSource),
}) {}
export class DataIntegrationFlowExecutionOutputMetadata extends S.Class<DataIntegrationFlowExecutionOutputMetadata>(
  "DataIntegrationFlowExecutionOutputMetadata",
)({ diagnosticReportsRootS3URI: S.optional(S.String) }) {}
export class DataIntegrationFlowExecution extends S.Class<DataIntegrationFlowExecution>(
  "DataIntegrationFlowExecution",
)({
  instanceId: S.String,
  flowName: S.String,
  executionId: S.String,
  status: S.optional(S.String),
  sourceInfo: S.optional(DataIntegrationFlowExecutionSourceInfo),
  message: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  outputMetadata: S.optional(DataIntegrationFlowExecutionOutputMetadata),
}) {}
export const DataIntegrationFlowExecutionList = S.Array(
  DataIntegrationFlowExecution,
);
export class DataIntegrationEventDatasetTargetConfiguration extends S.Class<DataIntegrationEventDatasetTargetConfiguration>(
  "DataIntegrationEventDatasetTargetConfiguration",
)({ datasetIdentifier: S.String, operationType: S.String }) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class ListDataIntegrationEventsResponse extends S.Class<ListDataIntegrationEventsResponse>(
  "ListDataIntegrationEventsResponse",
)({ events: DataIntegrationEventList, nextToken: S.optional(S.String) }) {}
export class ListDataIntegrationFlowExecutionsResponse extends S.Class<ListDataIntegrationFlowExecutionsResponse>(
  "ListDataIntegrationFlowExecutionsResponse",
)({
  flowExecutions: DataIntegrationFlowExecutionList,
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class SendDataIntegrationEventRequest extends S.Class<SendDataIntegrationEventRequest>(
  "SendDataIntegrationEventRequest",
)(
  {
    instanceId: S.String.pipe(T.HttpLabel()),
    eventType: S.String,
    data: S.String,
    eventGroupId: S.String,
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.optional(S.String),
    datasetTarget: S.optional(DataIntegrationEventDatasetTargetConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/api-data/data-integration/instance/{instanceId}/data-integration-events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/api/tags/{resourceArn}" }),
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
export class SendDataIntegrationEventResponse extends S.Class<SendDataIntegrationEventResponse>(
  "SendDataIntegrationEventResponse",
)({ eventId: S.String }) {}
export class GetDataIntegrationEventResponse extends S.Class<GetDataIntegrationEventResponse>(
  "GetDataIntegrationEventResponse",
)({ event: DataIntegrationEvent }) {}
export class GetDataIntegrationFlowExecutionResponse extends S.Class<GetDataIntegrationFlowExecutionResponse>(
  "GetDataIntegrationFlowExecutionResponse",
)({ flowExecution: DataIntegrationFlowExecution }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * You can delete tags for an Amazon Web Services Supply chain resource such as instance, data flow, or dataset in AWS Supply Chain. During the data ingestion process, you can delete tags such as dev, test, or prod to data flows created during the data ingestion process in the AWS Supply Chain datasets.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically list all data integration events for the provided Amazon Web Services Supply Chain instance.
 */
export const listDataIntegrationEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataIntegrationEventsRequest,
    output: ListDataIntegrationEventsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * List flow executions.
 */
export const listDataIntegrationFlowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataIntegrationFlowExecutionsRequest,
    output: ListDataIntegrationFlowExecutionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List all the tags for an Amazon Web ServicesSupply Chain resource. You can list all the tags added to a resource. By listing the tags, developers can view the tag level information on a resource and perform actions such as, deleting a resource associated with a particular tag.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * You can create tags during or after creating a resource such as instance, data flow, or dataset in AWS Supply chain. During the data ingestion process, you can add tags such as dev, test, or prod to data flows created during the data ingestion process in the AWS Supply Chain datasets. You can use these tags to identify a group of resources or a single resource used by the developer.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to programmatically view an Amazon Web Services Supply Chain Data Integration Event. Developers can view the eventType, eventGroupId, eventTimestamp, datasetTarget, datasetLoadExecution.
 */
export const getDataIntegrationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataIntegrationEventRequest,
    output: GetDataIntegrationEventResponse,
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
 * Get the flow execution.
 */
export const getDataIntegrationFlowExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataIntegrationFlowExecutionRequest,
    output: GetDataIntegrationFlowExecutionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Send the data payload for the event with real-time data for analysis or monitoring. The real-time data events are stored in an Amazon Web Services service before being processed and stored in data lake.
 */
export const sendDataIntegrationEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendDataIntegrationEventRequest,
    output: SendDataIntegrationEventResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

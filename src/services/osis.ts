import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://osis.amazonaws.com/doc/2022-01-01");
const svc = T.AwsApiService({
  sdkId: "OSIS",
  serviceShapeName: "AmazonOpenSearchIngestionService",
});
const auth = T.AwsAuthSigv4({ name: "osis" });
const ver = T.ServiceVersion("2022-01-01");
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
                                url: "https://osis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://osis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://osis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://osis.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListPipelineBlueprintsRequest extends S.Class<ListPipelineBlueprintsRequest>(
  "ListPipelineBlueprintsRequest",
)(
  {},
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/listPipelineBlueprints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PipelineEndpointIdsList = S.Array(S.String);
export const StringList = S.Array(S.String);
export class DeletePipelineRequest extends S.Class<DeletePipelineRequest>(
  "DeletePipelineRequest",
)(
  { PipelineName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2022-01-01/osis/deletePipeline/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePipelineResponse extends S.Class<DeletePipelineResponse>(
  "DeletePipelineResponse",
)({}, ns) {}
export class DeletePipelineEndpointRequest extends S.Class<DeletePipelineEndpointRequest>(
  "DeletePipelineEndpointRequest",
)(
  { EndpointId: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2022-01-01/osis/deletePipelineEndpoint/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePipelineEndpointResponse extends S.Class<DeletePipelineEndpointResponse>(
  "DeletePipelineEndpointResponse",
)({}, ns) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/2022-01-01/osis/resourcePolicy/{ResourceArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class GetPipelineRequest extends S.Class<GetPipelineRequest>(
  "GetPipelineRequest",
)(
  { PipelineName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2022-01-01/osis/getPipeline/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPipelineBlueprintRequest extends S.Class<GetPipelineBlueprintRequest>(
  "GetPipelineBlueprintRequest",
)(
  {
    BlueprintName: S.String.pipe(T.HttpLabel()),
    Format: S.optional(S.String).pipe(T.HttpQuery("format")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2022-01-01/osis/getPipelineBlueprint/{BlueprintName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPipelineChangeProgressRequest extends S.Class<GetPipelineChangeProgressRequest>(
  "GetPipelineChangeProgressRequest",
)(
  { PipelineName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2022-01-01/osis/getPipelineChangeProgress/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2022-01-01/osis/resourcePolicy/{ResourceArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPipelineEndpointConnectionsRequest extends S.Class<ListPipelineEndpointConnectionsRequest>(
  "ListPipelineEndpointConnectionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/2022-01-01/osis/listPipelineEndpointConnections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPipelineEndpointsRequest extends S.Class<ListPipelineEndpointsRequest>(
  "ListPipelineEndpointsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2022-01-01/osis/listPipelineEndpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPipelinesRequest extends S.Class<ListPipelinesRequest>(
  "ListPipelinesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2022-01-01/osis/listPipelines" }),
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
  { Arn: S.String.pipe(T.HttpQuery("arn")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/2022-01-01/osis/listTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Policy: S.String },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2022-01-01/osis/resourcePolicy/{ResourceArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokePipelineEndpointConnectionsRequest extends S.Class<RevokePipelineEndpointConnectionsRequest>(
  "RevokePipelineEndpointConnectionsRequest",
)(
  { PipelineArn: S.String, EndpointIds: PipelineEndpointIdsList },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/2022-01-01/osis/revokePipelineEndpointConnections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartPipelineRequest extends S.Class<StartPipelineRequest>(
  "StartPipelineRequest",
)(
  { PipelineName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2022-01-01/osis/startPipeline/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopPipelineRequest extends S.Class<StopPipelineRequest>(
  "StopPipelineRequest",
)(
  { PipelineName: S.String.pipe(T.HttpLabel()) },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2022-01-01/osis/stopPipeline/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { Arn: S.String.pipe(T.HttpQuery("arn")), Tags: TagList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/tagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { Arn: S.String.pipe(T.HttpQuery("arn")), TagKeys: StringList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/untagResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class CloudWatchLogDestination extends S.Class<CloudWatchLogDestination>(
  "CloudWatchLogDestination",
)({ LogGroup: S.String }) {}
export class LogPublishingOptions extends S.Class<LogPublishingOptions>(
  "LogPublishingOptions",
)({
  IsLoggingEnabled: S.optional(S.Boolean),
  CloudWatchLogDestination: S.optional(CloudWatchLogDestination),
}) {}
export class BufferOptions extends S.Class<BufferOptions>("BufferOptions")({
  PersistentBufferEnabled: S.Boolean,
}) {}
export class EncryptionAtRestOptions extends S.Class<EncryptionAtRestOptions>(
  "EncryptionAtRestOptions",
)({ KmsKeyArn: S.String }) {}
export class UpdatePipelineRequest extends S.Class<UpdatePipelineRequest>(
  "UpdatePipelineRequest",
)(
  {
    PipelineName: S.String.pipe(T.HttpLabel()),
    MinUnits: S.optional(S.Number),
    MaxUnits: S.optional(S.Number),
    PipelineConfigurationBody: S.optional(S.String),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    BufferOptions: S.optional(BufferOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    PipelineRoleArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "PUT",
      uri: "/2022-01-01/osis/updatePipeline/{PipelineName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidatePipelineRequest extends S.Class<ValidatePipelineRequest>(
  "ValidatePipelineRequest",
)(
  { PipelineConfigurationBody: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/validatePipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class PipelineEndpointVpcOptions extends S.Class<PipelineEndpointVpcOptions>(
  "PipelineEndpointVpcOptions",
)({
  SubnetIds: S.optional(SubnetIds),
  SecurityGroupIds: S.optional(SecurityGroupIds),
}) {}
export class PipelineBlueprintSummary extends S.Class<PipelineBlueprintSummary>(
  "PipelineBlueprintSummary",
)({
  BlueprintName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  DisplayDescription: S.optional(S.String),
  Service: S.optional(S.String),
  UseCase: S.optional(S.String),
}) {}
export const PipelineBlueprintsSummaryList = S.Array(PipelineBlueprintSummary);
export class CreatePipelineEndpointRequest extends S.Class<CreatePipelineEndpointRequest>(
  "CreatePipelineEndpointRequest",
)(
  { PipelineArn: S.String, VpcOptions: PipelineEndpointVpcOptions },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/createPipelineEndpoint" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({ ResourceArn: S.optional(S.String), Policy: S.optional(S.String) }, ns) {}
export class ListPipelineBlueprintsResponse extends S.Class<ListPipelineBlueprintsResponse>(
  "ListPipelineBlueprintsResponse",
)({ Blueprints: S.optional(PipelineBlueprintsSummaryList) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ ResourceArn: S.optional(S.String), Policy: S.optional(S.String) }, ns) {}
export class RevokePipelineEndpointConnectionsResponse extends S.Class<RevokePipelineEndpointConnectionsResponse>(
  "RevokePipelineEndpointConnectionsResponse",
)({ PipelineArn: S.optional(S.String) }, ns) {}
export class PipelineStatusReason extends S.Class<PipelineStatusReason>(
  "PipelineStatusReason",
)({ Description: S.optional(S.String) }) {}
export const IngestEndpointUrlsList = S.Array(S.String);
export class VpcAttachmentOptions extends S.Class<VpcAttachmentOptions>(
  "VpcAttachmentOptions",
)({ AttachToVpc: S.Boolean, CidrBlock: S.optional(S.String) }) {}
export class VpcOptions extends S.Class<VpcOptions>("VpcOptions")({
  SubnetIds: SubnetIds,
  SecurityGroupIds: S.optional(SecurityGroupIds),
  VpcAttachmentOptions: S.optional(VpcAttachmentOptions),
  VpcEndpointManagement: S.optional(S.String),
}) {}
export class VpcEndpoint extends S.Class<VpcEndpoint>("VpcEndpoint")({
  VpcEndpointId: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcOptions: S.optional(VpcOptions),
}) {}
export const VpcEndpointsList = S.Array(VpcEndpoint);
export class ServiceVpcEndpoint extends S.Class<ServiceVpcEndpoint>(
  "ServiceVpcEndpoint",
)({ ServiceName: S.optional(S.String), VpcEndpointId: S.optional(S.String) }) {}
export const ServiceVpcEndpointsList = S.Array(ServiceVpcEndpoint);
export class PipelineDestination extends S.Class<PipelineDestination>(
  "PipelineDestination",
)({ ServiceName: S.optional(S.String), Endpoint: S.optional(S.String) }) {}
export const PipelineDestinationList = S.Array(PipelineDestination);
export class Pipeline extends S.Class<Pipeline>("Pipeline")({
  PipelineName: S.optional(S.String),
  PipelineArn: S.optional(S.String),
  MinUnits: S.optional(S.Number),
  MaxUnits: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusReason: S.optional(PipelineStatusReason),
  PipelineConfigurationBody: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IngestEndpointUrls: S.optional(IngestEndpointUrlsList),
  LogPublishingOptions: S.optional(LogPublishingOptions),
  VpcEndpoints: S.optional(VpcEndpointsList),
  BufferOptions: S.optional(BufferOptions),
  EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
  VpcEndpointService: S.optional(S.String),
  ServiceVpcEndpoints: S.optional(ServiceVpcEndpointsList),
  Destinations: S.optional(PipelineDestinationList),
  Tags: S.optional(TagList),
  PipelineRoleArn: S.optional(S.String),
}) {}
export class StartPipelineResponse extends S.Class<StartPipelineResponse>(
  "StartPipelineResponse",
)({ Pipeline: S.optional(Pipeline) }, ns) {}
export class StopPipelineResponse extends S.Class<StopPipelineResponse>(
  "StopPipelineResponse",
)({ Pipeline: S.optional(Pipeline) }, ns) {}
export class UpdatePipelineResponse extends S.Class<UpdatePipelineResponse>(
  "UpdatePipelineResponse",
)({ Pipeline: S.optional(Pipeline) }, ns) {}
export class PipelineBlueprint extends S.Class<PipelineBlueprint>(
  "PipelineBlueprint",
)({
  BlueprintName: S.optional(S.String),
  PipelineConfigurationBody: S.optional(S.String),
  DisplayName: S.optional(S.String),
  DisplayDescription: S.optional(S.String),
  Service: S.optional(S.String),
  UseCase: S.optional(S.String),
}) {}
export class PipelineEndpointConnection extends S.Class<PipelineEndpointConnection>(
  "PipelineEndpointConnection",
)({
  PipelineArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
  Status: S.optional(S.String),
  VpcEndpointOwner: S.optional(S.String),
}) {}
export const PipelineEndpointConnectionsSummaryList = S.Array(
  PipelineEndpointConnection,
);
export class PipelineEndpoint extends S.Class<PipelineEndpoint>(
  "PipelineEndpoint",
)({
  PipelineArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
  Status: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcOptions: S.optional(PipelineEndpointVpcOptions),
  IngestEndpointUrl: S.optional(S.String),
}) {}
export const PipelineEndpointsSummaryList = S.Array(PipelineEndpoint);
export class PipelineSummary extends S.Class<PipelineSummary>(
  "PipelineSummary",
)({
  Status: S.optional(S.String),
  StatusReason: S.optional(PipelineStatusReason),
  PipelineName: S.optional(S.String),
  PipelineArn: S.optional(S.String),
  MinUnits: S.optional(S.Number),
  MaxUnits: S.optional(S.Number),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Destinations: S.optional(PipelineDestinationList),
  Tags: S.optional(TagList),
}) {}
export const PipelineSummaryList = S.Array(PipelineSummary);
export class ValidationMessage extends S.Class<ValidationMessage>(
  "ValidationMessage",
)({ Message: S.optional(S.String) }) {}
export const ValidationMessageList = S.Array(ValidationMessage);
export class CreatePipelineRequest extends S.Class<CreatePipelineRequest>(
  "CreatePipelineRequest",
)(
  {
    PipelineName: S.String,
    MinUnits: S.Number,
    MaxUnits: S.Number,
    PipelineConfigurationBody: S.String,
    LogPublishingOptions: S.optional(LogPublishingOptions),
    VpcOptions: S.optional(VpcOptions),
    BufferOptions: S.optional(BufferOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    Tags: S.optional(TagList),
    PipelineRoleArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/2022-01-01/osis/createPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePipelineEndpointResponse extends S.Class<CreatePipelineEndpointResponse>(
  "CreatePipelineEndpointResponse",
)(
  {
    PipelineArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Status: S.optional(S.String),
    VpcId: S.optional(S.String),
  },
  ns,
) {}
export class GetPipelineBlueprintResponse extends S.Class<GetPipelineBlueprintResponse>(
  "GetPipelineBlueprintResponse",
)(
  { Blueprint: S.optional(PipelineBlueprint), Format: S.optional(S.String) },
  ns,
) {}
export class ListPipelineEndpointConnectionsResponse extends S.Class<ListPipelineEndpointConnectionsResponse>(
  "ListPipelineEndpointConnectionsResponse",
)(
  {
    NextToken: S.optional(S.String),
    PipelineEndpointConnections: S.optional(
      PipelineEndpointConnectionsSummaryList,
    ),
  },
  ns,
) {}
export class ListPipelineEndpointsResponse extends S.Class<ListPipelineEndpointsResponse>(
  "ListPipelineEndpointsResponse",
)(
  {
    NextToken: S.optional(S.String),
    PipelineEndpoints: S.optional(PipelineEndpointsSummaryList),
  },
  ns,
) {}
export class ListPipelinesResponse extends S.Class<ListPipelinesResponse>(
  "ListPipelinesResponse",
)(
  {
    NextToken: S.optional(S.String),
    Pipelines: S.optional(PipelineSummaryList),
  },
  ns,
) {}
export class ValidatePipelineResponse extends S.Class<ValidatePipelineResponse>(
  "ValidatePipelineResponse",
)(
  { isValid: S.optional(S.Boolean), Errors: S.optional(ValidationMessageList) },
  ns,
) {}
export class ChangeProgressStage extends S.Class<ChangeProgressStage>(
  "ChangeProgressStage",
)({
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ChangeProgressStageList = S.Array(ChangeProgressStage);
export class ChangeProgressStatus extends S.Class<ChangeProgressStatus>(
  "ChangeProgressStatus",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  TotalNumberOfStages: S.optional(S.Number),
  ChangeProgressStages: S.optional(ChangeProgressStageList),
}) {}
export const ChangeProgressStatusList = S.Array(ChangeProgressStatus);
export class CreatePipelineResponse extends S.Class<CreatePipelineResponse>(
  "CreatePipelineResponse",
)({ Pipeline: S.optional(Pipeline) }, ns) {}
export class GetPipelineResponse extends S.Class<GetPipelineResponse>(
  "GetPipelineResponse",
)({ Pipeline: S.optional(Pipeline) }, ns) {}
export class GetPipelineChangeProgressResponse extends S.Class<GetPipelineChangeProgressResponse>(
  "GetPipelineChangeProgressResponse",
)({ ChangeProgressStatuses: S.optional(ChangeProgressStatusList) }, ns) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  {},
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a resource-based policy from an OpenSearch Ingestion resource.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the resource-based policy attached to an OpenSearch Ingestion resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all resource tags associated with an OpenSearch Ingestion pipeline. For more information,
 * see Tagging Amazon OpenSearch Ingestion pipelines.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Attaches a resource-based policy to an OpenSearch Ingestion resource. Resource-based
 * policies grant permissions to principals to perform actions on the resource.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Revokes pipeline endpoints from specified endpoint IDs.
 */
export const revokePipelineEndpointConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RevokePipelineEndpointConnectionsRequest,
    output: RevokePipelineEndpointConnectionsResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ValidationException,
    ],
  }));
/**
 * Starts an OpenSearch Ingestion pipeline. For more information, see Starting an OpenSearch Ingestion pipeline.
 */
export const startPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPipelineRequest,
  output: StartPipelineResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops an OpenSearch Ingestion pipeline. For more information, see Stopping
 * an OpenSearch Ingestion pipeline.
 */
export const stopPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopPipelineRequest,
  output: StopPipelineResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Tags an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch
 * Ingestion pipelines.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from an OpenSearch Ingestion pipeline. For more information, see Tagging
 * Amazon OpenSearch Ingestion pipelines.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates an OpenSearch Ingestion pipeline. For more information, see Updating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const updatePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePipelineRequest,
  output: UpdatePipelineResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a VPC endpoint for an OpenSearch Ingestion pipeline. Pipeline endpoints allow you to
 * ingest data from your VPC into pipelines that you have access to.
 */
export const createPipelineEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePipelineEndpointRequest,
    output: CreatePipelineEndpointResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an OpenSearch Ingestion pipeline. For more information, see Deleting Amazon OpenSearch
 * Ingestion pipelines.
 */
export const deletePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineRequest,
  output: DeletePipelineResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a VPC endpoint for an OpenSearch Ingestion pipeline.
 */
export const deletePipelineEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePipelineEndpointRequest,
    output: DeletePipelineEndpointResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information about a specific blueprint for OpenSearch Ingestion. Blueprints are
 * templates for the configuration needed for a `CreatePipeline` request. For more
 * information, see Using
 * blueprints to create a pipeline.
 */
export const getPipelineBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPipelineBlueprintRequest,
    output: GetPipelineBlueprintResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of all available blueprints for Data Prepper. For more information, see
 * Using
 * blueprints to create a pipeline.
 */
export const listPipelineBlueprints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPipelineBlueprintsRequest,
    output: ListPipelineBlueprintsResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      InvalidPaginationTokenException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the pipeline endpoints connected to pipelines in your account.
 */
export const listPipelineEndpointConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPipelineEndpointConnectionsRequest,
    output: ListPipelineEndpointConnectionsResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ValidationException,
    ],
  }));
/**
 * Lists all pipeline endpoints in your account.
 */
export const listPipelineEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPipelineEndpointsRequest,
    output: ListPipelineEndpointsResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      LimitExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all OpenSearch Ingestion pipelines in the current Amazon Web Services account and Region.
 * For more information, see Viewing Amazon OpenSearch
 * Ingestion pipelines.
 */
export const listPipelines = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPipelinesRequest,
  output: ListPipelinesResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    InvalidPaginationTokenException,
    ValidationException,
  ],
}));
/**
 * Checks whether an OpenSearch Ingestion pipeline configuration is valid prior to creation. For
 * more information, see Creating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const validatePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidatePipelineRequest,
  output: ValidatePipelineResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an OpenSearch Ingestion pipeline.
 */
export const getPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineRequest,
  output: GetPipelineResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns progress information for the current change happening on an OpenSearch Ingestion
 * pipeline. Currently, this operation only returns information when a pipeline is being
 * created.
 *
 * For more information, see Tracking the status of pipeline creation.
 */
export const getPipelineChangeProgress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPipelineChangeProgressRequest,
    output: GetPipelineChangeProgressResponse,
    errors: [
      AccessDeniedException,
      DisabledOperationException,
      InternalException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an OpenSearch Ingestion pipeline. For more information, see Creating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const createPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipelineRequest,
  output: CreatePipelineResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

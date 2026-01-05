import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "IoTThingsGraph",
  serviceShapeName: "IotThingsGraphFrontEndService",
});
const auth = T.AwsAuthSigv4({ name: "iotthingsgraph" });
const ver = T.ServiceVersion("2018-09-06");
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
                        url: "https://iotthingsgraph-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://iotthingsgraph-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://iotthingsgraph.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://iotthingsgraph.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://iotthingsgraph.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteNamespaceRequest extends S.Class<DeleteNamespaceRequest>(
  "DeleteNamespaceRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNamespaceDeletionStatusRequest extends S.Class<GetNamespaceDeletionStatusRequest>(
  "GetNamespaceDeletionStatusRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Urns = S.Array(S.String);
export const EntityTypes = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateEntityToThingRequest extends S.Class<AssociateEntityToThingRequest>(
  "AssociateEntityToThingRequest",
)(
  {
    thingName: S.String,
    entityId: S.String,
    namespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateEntityToThingResponse extends S.Class<AssociateEntityToThingResponse>(
  "AssociateEntityToThingResponse",
)({}) {}
export class DefinitionDocument extends S.Class<DefinitionDocument>(
  "DefinitionDocument",
)({ language: S.String, text: S.String }) {}
export class CreateSystemTemplateRequest extends S.Class<CreateSystemTemplateRequest>(
  "CreateSystemTemplateRequest",
)(
  {
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFlowTemplateRequest extends S.Class<DeleteFlowTemplateRequest>(
  "DeleteFlowTemplateRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFlowTemplateResponse extends S.Class<DeleteFlowTemplateResponse>(
  "DeleteFlowTemplateResponse",
)({}) {}
export class DeleteNamespaceResponse extends S.Class<DeleteNamespaceResponse>(
  "DeleteNamespaceResponse",
)({
  namespaceArn: S.optional(S.String),
  namespaceName: S.optional(S.String),
}) {}
export class DeleteSystemInstanceRequest extends S.Class<DeleteSystemInstanceRequest>(
  "DeleteSystemInstanceRequest",
)(
  { id: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSystemInstanceResponse extends S.Class<DeleteSystemInstanceResponse>(
  "DeleteSystemInstanceResponse",
)({}) {}
export class DeleteSystemTemplateRequest extends S.Class<DeleteSystemTemplateRequest>(
  "DeleteSystemTemplateRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSystemTemplateResponse extends S.Class<DeleteSystemTemplateResponse>(
  "DeleteSystemTemplateResponse",
)({}) {}
export class DeploySystemInstanceRequest extends S.Class<DeploySystemInstanceRequest>(
  "DeploySystemInstanceRequest",
)(
  { id: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateFlowTemplateRequest extends S.Class<DeprecateFlowTemplateRequest>(
  "DeprecateFlowTemplateRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateFlowTemplateResponse extends S.Class<DeprecateFlowTemplateResponse>(
  "DeprecateFlowTemplateResponse",
)({}) {}
export class DeprecateSystemTemplateRequest extends S.Class<DeprecateSystemTemplateRequest>(
  "DeprecateSystemTemplateRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeprecateSystemTemplateResponse extends S.Class<DeprecateSystemTemplateResponse>(
  "DeprecateSystemTemplateResponse",
)({}) {}
export class DescribeNamespaceRequest extends S.Class<DescribeNamespaceRequest>(
  "DescribeNamespaceRequest",
)(
  { namespaceName: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DissociateEntityFromThingRequest extends S.Class<DissociateEntityFromThingRequest>(
  "DissociateEntityFromThingRequest",
)(
  { thingName: S.String, entityType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DissociateEntityFromThingResponse extends S.Class<DissociateEntityFromThingResponse>(
  "DissociateEntityFromThingResponse",
)({}) {}
export class GetEntitiesRequest extends S.Class<GetEntitiesRequest>(
  "GetEntitiesRequest",
)(
  { ids: Urns, namespaceVersion: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFlowTemplateRequest extends S.Class<GetFlowTemplateRequest>(
  "GetFlowTemplateRequest",
)(
  { id: S.String, revisionNumber: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFlowTemplateRevisionsRequest extends S.Class<GetFlowTemplateRevisionsRequest>(
  "GetFlowTemplateRevisionsRequest",
)(
  {
    id: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNamespaceDeletionStatusResponse extends S.Class<GetNamespaceDeletionStatusResponse>(
  "GetNamespaceDeletionStatusResponse",
)({
  namespaceArn: S.optional(S.String),
  namespaceName: S.optional(S.String),
  status: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class GetSystemInstanceRequest extends S.Class<GetSystemInstanceRequest>(
  "GetSystemInstanceRequest",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSystemTemplateRequest extends S.Class<GetSystemTemplateRequest>(
  "GetSystemTemplateRequest",
)(
  { id: S.String, revisionNumber: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSystemTemplateRevisionsRequest extends S.Class<GetSystemTemplateRevisionsRequest>(
  "GetSystemTemplateRevisionsRequest",
)(
  {
    id: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUploadStatusRequest extends S.Class<GetUploadStatusRequest>(
  "GetUploadStatusRequest",
)(
  { uploadId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlowExecutionMessagesRequest extends S.Class<ListFlowExecutionMessagesRequest>(
  "ListFlowExecutionMessagesRequest",
)(
  {
    flowExecutionId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    maxResults: S.optional(S.Number),
    resourceArn: S.String,
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchFlowExecutionsRequest extends S.Class<SearchFlowExecutionsRequest>(
  "SearchFlowExecutionsRequest",
)(
  {
    systemInstanceId: S.String,
    flowExecutionId: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchThingsRequest extends S.Class<SearchThingsRequest>(
  "SearchThingsRequest",
)(
  {
    entityId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    namespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UndeploySystemInstanceRequest extends S.Class<UndeploySystemInstanceRequest>(
  "UndeploySystemInstanceRequest",
)(
  { id: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateFlowTemplateRequest extends S.Class<UpdateFlowTemplateRequest>(
  "UpdateFlowTemplateRequest",
)(
  {
    id: S.String,
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSystemTemplateRequest extends S.Class<UpdateSystemTemplateRequest>(
  "UpdateSystemTemplateRequest",
)(
  {
    id: S.String,
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UploadEntityDefinitionsRequest extends S.Class<UploadEntityDefinitionsRequest>(
  "UploadEntityDefinitionsRequest",
)(
  {
    document: S.optional(DefinitionDocument),
    syncWithPublicNamespace: S.optional(S.Boolean),
    deprecateExistingEntities: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EntityFilterValues = S.Array(S.String);
export const FlowTemplateFilterValues = S.Array(S.String);
export const SystemInstanceFilterValues = S.Array(S.String);
export const SystemTemplateFilterValues = S.Array(S.String);
export class MetricsConfiguration extends S.Class<MetricsConfiguration>(
  "MetricsConfiguration",
)({
  cloudMetricEnabled: S.optional(S.Boolean),
  metricRuleRoleArn: S.optional(S.String),
}) {}
export class SystemTemplateSummary extends S.Class<SystemTemplateSummary>(
  "SystemTemplateSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  revisionNumber: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SystemTemplateSummaries = S.Array(SystemTemplateSummary);
export const StringList = S.Array(S.String);
export class EntityFilter extends S.Class<EntityFilter>("EntityFilter")({
  name: S.optional(S.String),
  value: S.optional(EntityFilterValues),
}) {}
export const EntityFilters = S.Array(EntityFilter);
export class FlowTemplateFilter extends S.Class<FlowTemplateFilter>(
  "FlowTemplateFilter",
)({ name: S.String, value: FlowTemplateFilterValues }) {}
export const FlowTemplateFilters = S.Array(FlowTemplateFilter);
export class SystemInstanceFilter extends S.Class<SystemInstanceFilter>(
  "SystemInstanceFilter",
)({
  name: S.optional(S.String),
  value: S.optional(SystemInstanceFilterValues),
}) {}
export const SystemInstanceFilters = S.Array(SystemInstanceFilter);
export class SystemTemplateFilter extends S.Class<SystemTemplateFilter>(
  "SystemTemplateFilter",
)({ name: S.String, value: SystemTemplateFilterValues }) {}
export const SystemTemplateFilters = S.Array(SystemTemplateFilter);
export class CreateFlowTemplateRequest extends S.Class<CreateFlowTemplateRequest>(
  "CreateFlowTemplateRequest",
)(
  {
    definition: DefinitionDocument,
    compatibleNamespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSystemInstanceRequest extends S.Class<CreateSystemInstanceRequest>(
  "CreateSystemInstanceRequest",
)(
  {
    tags: S.optional(TagList),
    definition: DefinitionDocument,
    target: S.String,
    greengrassGroupName: S.optional(S.String),
    s3BucketName: S.optional(S.String),
    metricsConfiguration: S.optional(MetricsConfiguration),
    flowActionsRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNamespaceResponse extends S.Class<DescribeNamespaceResponse>(
  "DescribeNamespaceResponse",
)({
  namespaceArn: S.optional(S.String),
  namespaceName: S.optional(S.String),
  trackingNamespaceName: S.optional(S.String),
  trackingNamespaceVersion: S.optional(S.Number),
  namespaceVersion: S.optional(S.Number),
}) {}
export class GetSystemTemplateRevisionsResponse extends S.Class<GetSystemTemplateRevisionsResponse>(
  "GetSystemTemplateRevisionsResponse",
)({
  summaries: S.optional(SystemTemplateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetUploadStatusResponse extends S.Class<GetUploadStatusResponse>(
  "GetUploadStatusResponse",
)({
  uploadId: S.String,
  uploadStatus: S.String,
  namespaceArn: S.optional(S.String),
  namespaceName: S.optional(S.String),
  namespaceVersion: S.optional(S.Number),
  failureReason: S.optional(StringList),
  createdDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList), nextToken: S.optional(S.String) }) {}
export class SearchEntitiesRequest extends S.Class<SearchEntitiesRequest>(
  "SearchEntitiesRequest",
)(
  {
    entityTypes: EntityTypes,
    filters: S.optional(EntityFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    namespaceVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchFlowTemplatesRequest extends S.Class<SearchFlowTemplatesRequest>(
  "SearchFlowTemplatesRequest",
)(
  {
    filters: S.optional(FlowTemplateFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchSystemInstancesRequest extends S.Class<SearchSystemInstancesRequest>(
  "SearchSystemInstancesRequest",
)(
  {
    filters: S.optional(SystemInstanceFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchSystemTemplatesRequest extends S.Class<SearchSystemTemplatesRequest>(
  "SearchSystemTemplatesRequest",
)(
  {
    filters: S.optional(SystemTemplateFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SystemInstanceSummary extends S.Class<SystemInstanceSummary>(
  "SystemInstanceSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  target: S.optional(S.String),
  greengrassGroupName: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  greengrassGroupId: S.optional(S.String),
  greengrassGroupVersionId: S.optional(S.String),
}) {}
export class UndeploySystemInstanceResponse extends S.Class<UndeploySystemInstanceResponse>(
  "UndeploySystemInstanceResponse",
)({ summary: S.optional(SystemInstanceSummary) }) {}
export class FlowTemplateSummary extends S.Class<FlowTemplateSummary>(
  "FlowTemplateSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  revisionNumber: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateFlowTemplateResponse extends S.Class<UpdateFlowTemplateResponse>(
  "UpdateFlowTemplateResponse",
)({ summary: S.optional(FlowTemplateSummary) }) {}
export class UpdateSystemTemplateResponse extends S.Class<UpdateSystemTemplateResponse>(
  "UpdateSystemTemplateResponse",
)({ summary: S.optional(SystemTemplateSummary) }) {}
export class UploadEntityDefinitionsResponse extends S.Class<UploadEntityDefinitionsResponse>(
  "UploadEntityDefinitionsResponse",
)({ uploadId: S.String }) {}
export class EntityDescription extends S.Class<EntityDescription>(
  "EntityDescription",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  type: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  definition: S.optional(DefinitionDocument),
}) {}
export const EntityDescriptions = S.Array(EntityDescription);
export class FlowTemplateDescription extends S.Class<FlowTemplateDescription>(
  "FlowTemplateDescription",
)({
  summary: S.optional(FlowTemplateSummary),
  definition: S.optional(DefinitionDocument),
  validatedNamespaceVersion: S.optional(S.Number),
}) {}
export const FlowTemplateSummaries = S.Array(FlowTemplateSummary);
export class SystemTemplateDescription extends S.Class<SystemTemplateDescription>(
  "SystemTemplateDescription",
)({
  summary: S.optional(SystemTemplateSummary),
  definition: S.optional(DefinitionDocument),
  validatedNamespaceVersion: S.optional(S.Number),
}) {}
export class FlowExecutionMessage extends S.Class<FlowExecutionMessage>(
  "FlowExecutionMessage",
)({
  messageId: S.optional(S.String),
  eventType: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  payload: S.optional(S.String),
}) {}
export const FlowExecutionMessages = S.Array(FlowExecutionMessage);
export class FlowExecutionSummary extends S.Class<FlowExecutionSummary>(
  "FlowExecutionSummary",
)({
  flowExecutionId: S.optional(S.String),
  status: S.optional(S.String),
  systemInstanceId: S.optional(S.String),
  flowTemplateId: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FlowExecutionSummaries = S.Array(FlowExecutionSummary);
export const SystemInstanceSummaries = S.Array(SystemInstanceSummary);
export class Thing extends S.Class<Thing>("Thing")({
  thingArn: S.optional(S.String),
  thingName: S.optional(S.String),
}) {}
export const Things = S.Array(Thing);
export class CreateFlowTemplateResponse extends S.Class<CreateFlowTemplateResponse>(
  "CreateFlowTemplateResponse",
)({ summary: S.optional(FlowTemplateSummary) }) {}
export class CreateSystemInstanceResponse extends S.Class<CreateSystemInstanceResponse>(
  "CreateSystemInstanceResponse",
)({ summary: S.optional(SystemInstanceSummary) }) {}
export class CreateSystemTemplateResponse extends S.Class<CreateSystemTemplateResponse>(
  "CreateSystemTemplateResponse",
)({ summary: S.optional(SystemTemplateSummary) }) {}
export class DeploySystemInstanceResponse extends S.Class<DeploySystemInstanceResponse>(
  "DeploySystemInstanceResponse",
)({
  summary: SystemInstanceSummary,
  greengrassDeploymentId: S.optional(S.String),
}) {}
export class GetEntitiesResponse extends S.Class<GetEntitiesResponse>(
  "GetEntitiesResponse",
)({ descriptions: S.optional(EntityDescriptions) }) {}
export class GetFlowTemplateResponse extends S.Class<GetFlowTemplateResponse>(
  "GetFlowTemplateResponse",
)({ description: S.optional(FlowTemplateDescription) }) {}
export class GetFlowTemplateRevisionsResponse extends S.Class<GetFlowTemplateRevisionsResponse>(
  "GetFlowTemplateRevisionsResponse",
)({
  summaries: S.optional(FlowTemplateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class GetSystemTemplateResponse extends S.Class<GetSystemTemplateResponse>(
  "GetSystemTemplateResponse",
)({ description: S.optional(SystemTemplateDescription) }) {}
export class ListFlowExecutionMessagesResponse extends S.Class<ListFlowExecutionMessagesResponse>(
  "ListFlowExecutionMessagesResponse",
)({
  messages: S.optional(FlowExecutionMessages),
  nextToken: S.optional(S.String),
}) {}
export class SearchEntitiesResponse extends S.Class<SearchEntitiesResponse>(
  "SearchEntitiesResponse",
)({
  descriptions: S.optional(EntityDescriptions),
  nextToken: S.optional(S.String),
}) {}
export class SearchFlowExecutionsResponse extends S.Class<SearchFlowExecutionsResponse>(
  "SearchFlowExecutionsResponse",
)({
  summaries: S.optional(FlowExecutionSummaries),
  nextToken: S.optional(S.String),
}) {}
export class SearchFlowTemplatesResponse extends S.Class<SearchFlowTemplatesResponse>(
  "SearchFlowTemplatesResponse",
)({
  summaries: S.optional(FlowTemplateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class SearchSystemInstancesResponse extends S.Class<SearchSystemInstancesResponse>(
  "SearchSystemInstancesResponse",
)({
  summaries: S.optional(SystemInstanceSummaries),
  nextToken: S.optional(S.String),
}) {}
export class SearchSystemTemplatesResponse extends S.Class<SearchSystemTemplatesResponse>(
  "SearchSystemTemplatesResponse",
)({
  summaries: S.optional(SystemTemplateSummaries),
  nextToken: S.optional(S.String),
}) {}
export class SearchThingsResponse extends S.Class<SearchThingsResponse>(
  "SearchThingsResponse",
)({ things: S.optional(Things), nextToken: S.optional(S.String) }) {}
export class DependencyRevision extends S.Class<DependencyRevision>(
  "DependencyRevision",
)({ id: S.optional(S.String), revisionNumber: S.optional(S.Number) }) {}
export const DependencyRevisions = S.Array(DependencyRevision);
export class SystemInstanceDescription extends S.Class<SystemInstanceDescription>(
  "SystemInstanceDescription",
)({
  summary: S.optional(SystemInstanceSummary),
  definition: S.optional(DefinitionDocument),
  s3BucketName: S.optional(S.String),
  metricsConfiguration: S.optional(MetricsConfiguration),
  validatedNamespaceVersion: S.optional(S.Number),
  validatedDependencyRevisions: S.optional(DependencyRevisions),
  flowActionsRoleArn: S.optional(S.String),
}) {}
export class GetSystemInstanceResponse extends S.Class<GetSystemInstanceResponse>(
  "GetSystemInstanceResponse",
)({ description: S.optional(SystemInstanceDescription) }) {}

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified namespace. This action deletes all of the entities in the namespace. Delete the systems and flows that use entities in the namespace before performing this action. This action takes no
 * request parameters.
 */
export const deleteNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [InternalFailureException, ThrottlingException],
}));
/**
 * Asynchronously uploads one or more entity definitions to the user's namespace. The `document` parameter is required if
 * `syncWithPublicNamespace` and `deleteExistingEntites` are false. If the `syncWithPublicNamespace` parameter is set to
 * `true`, the user's namespace will synchronize with the latest version of the public namespace. If `deprecateExistingEntities` is set to true,
 * all entities in the latest version will be deleted before the new `DefinitionDocument` is uploaded.
 *
 * When a user uploads entity definitions for the first time, the service creates a new namespace for the user. The new namespace tracks the public namespace. Currently users
 * can have only one namespace. The namespace version increments whenever a user uploads entity definitions that are backwards-incompatible and whenever a user sets the
 * `syncWithPublicNamespace` parameter or the `deprecateExistingEntities` parameter to `true`.
 *
 * The IDs for all of the entities should be in URN format. Each entity must be in the user's namespace. Users can't create entities in the public namespace, but entity definitions can refer to entities in the public namespace.
 *
 * Valid entities are `Device`, `DeviceModel`, `Service`, `Capability`, `State`, `Action`, `Event`, `Property`,
 * `Mapping`, `Enum`.
 */
export const uploadEntityDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UploadEntityDefinitionsRequest,
    output: UploadEntityDefinitionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets the status of a namespace deletion task.
 */
export const getNamespaceDeletionStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetNamespaceDeletionStatusRequest,
    output: GetNamespaceDeletionStatusResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches for entities of the specified type. You can search for entities in your namespace and the public namespace that you're tracking.
 */
export const searchEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchEntitiesRequest,
  output: SearchEntitiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Searches for summary information about workflows.
 */
export const searchFlowTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchFlowTemplatesRequest,
  output: SearchFlowTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Searches for system instances in the user's account.
 */
export const searchSystemInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchSystemInstancesRequest,
    output: SearchSystemInstancesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches for summary information about systems in the user's account. You can filter by the ID of a workflow to return only systems that use the specified workflow.
 */
export const searchSystemTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchSystemTemplatesRequest,
    output: SearchSystemTemplatesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ThrottlingException,
    ],
  }),
);
/**
 * Associates a device with a concrete thing that is in the user's registry.
 *
 * A thing can be associated with only one device at a time. If you associate a thing with a new device id, its previous association will be removed.
 */
export const associateEntityToThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateEntityToThingRequest,
    output: AssociateEntityToThingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a system. The system is validated against the entities in the
 * latest version of the user's namespace unless another namespace version is specified in the request.
 */
export const createSystemTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSystemTemplateRequest,
    output: CreateSystemTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * **Greengrass and Cloud Deployments**
 *
 * Deploys the system instance to the target specified in `CreateSystemInstance`.
 *
 * **Greengrass Deployments**
 *
 * If the system or any workflows and entities have been updated before this action is called, then the deployment will create a new Amazon Simple Storage Service
 * resource file and then deploy it.
 *
 * Since this action creates a Greengrass deployment on the caller's behalf, the calling identity must have write permissions
 * to the specified Greengrass group. Otherwise, the call will fail with an authorization error.
 *
 * For information about the artifacts that get added to your Greengrass core device when you use this API, see AWS IoT Things Graph and AWS IoT Greengrass.
 */
export const deploySystemInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeploySystemInstanceRequest,
    output: DeploySystemInstanceResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets a system instance.
 */
export const getSystemInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSystemInstanceRequest,
  output: GetSystemInstanceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets definitions of the specified entities. Uses the latest version of the user's namespace by default. This API returns the
 * following TDM entities.
 *
 * - Properties
 *
 * - States
 *
 * - Events
 *
 * - Actions
 *
 * - Capabilities
 *
 * - Mappings
 *
 * - Devices
 *
 * - Device Models
 *
 * - Services
 *
 * This action doesn't return definitions for systems, flows, and deployments.
 */
export const getEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEntitiesRequest,
  output: GetEntitiesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the latest version of the `DefinitionDocument` and `FlowTemplateSummary` for the specified workflow.
 */
export const getFlowTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowTemplateRequest,
  output: GetFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets revisions of the specified workflow. Only the last 100 revisions are stored. If the workflow has been deprecated,
 * this action will return revisions that occurred before the deprecation. This action won't work for workflows that have been deleted.
 */
export const getFlowTemplateRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFlowTemplateRevisionsRequest,
    output: GetFlowTemplateRevisionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets a system.
 */
export const getSystemTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSystemTemplateRequest,
  output: GetSystemTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of objects that contain information about events in a flow execution.
 */
export const listFlowExecutionMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFlowExecutionMessagesRequest,
    output: ListFlowExecutionMessagesResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches for AWS IoT Things Graph workflow execution instances.
 */
export const searchFlowExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchFlowExecutionsRequest,
    output: SearchFlowExecutionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Searches for things associated with the specified entity. You can search by both device and device model.
 *
 * For example, if two different devices, camera1 and camera2, implement the camera device model, the user can associate thing1 to camera1 and thing2 to camera2.
 * `SearchThings(camera2)` will return only thing2, but `SearchThings(camera)` will return both thing1 and thing2.
 *
 * This action searches for exact matches and doesn't perform partial text matching.
 */
export const searchThings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchThingsRequest,
  output: SearchThingsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the latest version of the user's namespace and the public version that it is tracking.
 */
export const describeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNamespaceRequest,
  output: DescribeNamespaceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets revisions made to the specified system template. Only the previous 100 revisions are stored. If the system has been deprecated, this action will return
 * the revisions that occurred before its deprecation. This action won't work with systems that have been deleted.
 */
export const getSystemTemplateRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSystemTemplateRevisionsRequest,
    output: GetSystemTemplateRevisionsResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets the status of the specified upload.
 */
export const getUploadStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUploadStatusRequest,
  output: GetUploadStatusResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified workflow. All deployed systems and system instances that use the workflow will see the changes in the flow when it is redeployed. If you don't want this
 * behavior, copy the workflow (creating a new workflow with a different ID), and update the copy. The workflow can contain only entities in the specified namespace.
 */
export const updateFlowTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFlowTemplateRequest,
  output: UpdateFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified system. You don't need to run this action after updating a workflow. Any deployment that uses the system will see the changes in the system when it is redeployed.
 */
export const updateSystemTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSystemTemplateRequest,
    output: UpdateSystemTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deprecates the specified workflow. This action marks the workflow for deletion. Deprecated flows can't be deployed, but existing deployments will continue to run.
 */
export const deprecateFlowTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeprecateFlowTemplateRequest,
    output: DeprecateFlowTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deprecates the specified system.
 */
export const deprecateSystemTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeprecateSystemTemplateRequest,
    output: DeprecateSystemTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Dissociates a device entity from a concrete thing. The action takes only the type of the entity that you need to dissociate because only
 * one entity of a particular type can be associated with a thing.
 */
export const dissociateEntityFromThing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DissociateEntityFromThingRequest,
    output: DissociateEntityFromThingResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a system instance.
 *
 * This action validates the system instance, prepares the deployment-related resources. For Greengrass deployments, it updates the Greengrass group that is
 * specified by the `greengrassGroupName` parameter. It also adds a file to the S3 bucket specified by the `s3BucketName` parameter. You need to
 * call `DeploySystemInstance` after running this action.
 *
 * For Greengrass deployments, since this action modifies and adds resources to a Greengrass group and an S3 bucket on the caller's behalf, the calling identity must have write permissions
 * to both the specified Greengrass group and S3 bucket. Otherwise, the call will fail with an authorization error.
 *
 * For cloud deployments, this action requires a `flowActionsRoleArn` value. This is an IAM role
 * that has permissions to access AWS services, such as AWS Lambda and AWS IoT, that the flow uses when it executes.
 *
 * If the definition document doesn't specify a version of the user's namespace, the latest version will be used by default.
 */
export const createSystemInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSystemInstanceRequest,
    output: CreateSystemInstanceResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all tags on an AWS IoT Things Graph resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a tag for the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Removes a tag from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Creates a workflow template. Workflows can be created only in the user's namespace. (The public namespace contains only
 * entities.) The workflow can contain only entities in the specified namespace. The workflow is validated against the entities in the
 * latest version of the user's namespace unless another namespace version is specified in the request.
 */
export const createFlowTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFlowTemplateRequest,
  output: CreateFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Removes a system instance from its target (Cloud or Greengrass).
 */
export const undeploySystemInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UndeploySystemInstanceRequest,
    output: UndeploySystemInstanceResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a workflow. Any new system or deployment that contains this workflow will fail to update or deploy.
 * Existing deployments that contain the workflow will continue to run (since they use a snapshot of the workflow taken at the time of deployment).
 */
export const deleteFlowTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFlowTemplateRequest,
  output: DeleteFlowTemplateResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceInUseException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a system instance.
 * Only system instances that have never been deployed, or that have been undeployed can be deleted.
 *
 * Users can create a new system instance that has the same ID as a deleted system instance.
 */
export const deleteSystemInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSystemInstanceRequest,
    output: DeleteSystemInstanceResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceInUseException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a system. New deployments can't contain the system after its deletion.
 * Existing deployments that contain the system will continue to work because they use a snapshot of the system that is taken when it is deployed.
 */
export const deleteSystemTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSystemTemplateRequest,
    output: DeleteSystemTemplateResponse,
    errors: [
      InternalFailureException,
      InvalidRequestException,
      ResourceInUseException,
      ThrottlingException,
    ],
  }),
);

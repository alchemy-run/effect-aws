import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://ec2.amazon.com/awsposiedon/V2015_11_01/");
const svc = T.AwsApiService({
  sdkId: "Application Discovery Service",
  serviceShapeName: "AWSPoseidonService_V2015_11_01",
});
const auth = T.AwsAuthSigv4({ name: "discovery" });
const ver = T.ServiceVersion("2015-11-01");
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
                        url: "https://discovery-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://discovery-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://discovery.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://discovery.{Region}.{PartitionResult#dnsSuffix}",
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
export class ExportConfigurationsRequest extends S.Class<ExportConfigurationsRequest>(
  "ExportConfigurationsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDiscoverySummaryRequest extends S.Class<GetDiscoverySummaryRequest>(
  "GetDiscoverySummaryRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartContinuousExportRequest extends S.Class<StartContinuousExportRequest>(
  "StartContinuousExportRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ConfigurationIdList = S.Array(S.String);
export const ToDeleteIdentifierList = S.Array(S.String);
export const ApplicationIdsList = S.Array(S.String);
export const AgentIds = S.Array(S.String);
export const ContinuousExportIds = S.Array(S.String);
export const ExportIds = S.Array(S.String);
export const ExportDataFormats = S.Array(S.String);
export class AssociateConfigurationItemsToApplicationRequest extends S.Class<AssociateConfigurationItemsToApplicationRequest>(
  "AssociateConfigurationItemsToApplicationRequest",
)(
  {
    applicationConfigurationId: S.String,
    configurationIds: ConfigurationIdList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateConfigurationItemsToApplicationResponse extends S.Class<AssociateConfigurationItemsToApplicationResponse>(
  "AssociateConfigurationItemsToApplicationResponse",
)({}, ns) {}
export class BatchDeleteImportDataRequest extends S.Class<BatchDeleteImportDataRequest>(
  "BatchDeleteImportDataRequest",
)(
  {
    importTaskIds: ToDeleteIdentifierList,
    deleteHistory: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    wave: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationsRequest extends S.Class<DeleteApplicationsRequest>(
  "DeleteApplicationsRequest",
)(
  { configurationIds: ApplicationIdsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationsResponse extends S.Class<DeleteApplicationsResponse>(
  "DeleteApplicationsResponse",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagSet = S.Array(Tag.pipe(T.XmlName("item")));
export class DeleteTagsRequest extends S.Class<DeleteTagsRequest>(
  "DeleteTagsRequest",
)(
  { configurationIds: ConfigurationIdList, tags: S.optional(TagSet) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}, ns) {}
export class DescribeBatchDeleteConfigurationTaskRequest extends S.Class<DescribeBatchDeleteConfigurationTaskRequest>(
  "DescribeBatchDeleteConfigurationTaskRequest",
)(
  { taskId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationsRequest extends S.Class<DescribeConfigurationsRequest>(
  "DescribeConfigurationsRequest",
)(
  { configurationIds: ConfigurationIdList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeContinuousExportsRequest extends S.Class<DescribeContinuousExportsRequest>(
  "DescribeContinuousExportsRequest",
)(
  {
    exportIds: S.optional(ContinuousExportIds),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExportConfigurationsRequest extends S.Class<DescribeExportConfigurationsRequest>(
  "DescribeExportConfigurationsRequest",
)(
  {
    exportIds: S.optional(ExportIds),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateConfigurationItemsFromApplicationRequest extends S.Class<DisassociateConfigurationItemsFromApplicationRequest>(
  "DisassociateConfigurationItemsFromApplicationRequest",
)(
  {
    applicationConfigurationId: S.String,
    configurationIds: ConfigurationIdList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateConfigurationItemsFromApplicationResponse extends S.Class<DisassociateConfigurationItemsFromApplicationResponse>(
  "DisassociateConfigurationItemsFromApplicationResponse",
)({}, ns) {}
export class ExportConfigurationsResponse extends S.Class<ExportConfigurationsResponse>(
  "ExportConfigurationsResponse",
)({ exportId: S.optional(S.String) }, ns) {}
export class ListServerNeighborsRequest extends S.Class<ListServerNeighborsRequest>(
  "ListServerNeighborsRequest",
)(
  {
    configurationId: S.String,
    portInformationNeeded: S.optional(S.Boolean),
    neighborConfigurationIds: S.optional(ConfigurationIdList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBatchDeleteConfigurationTaskRequest extends S.Class<StartBatchDeleteConfigurationTaskRequest>(
  "StartBatchDeleteConfigurationTaskRequest",
)(
  { configurationType: S.String, configurationIds: ConfigurationIdList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDataCollectionByAgentIdsRequest extends S.Class<StartDataCollectionByAgentIdsRequest>(
  "StartDataCollectionByAgentIdsRequest",
)(
  { agentIds: AgentIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartImportTaskRequest extends S.Class<StartImportTaskRequest>(
  "StartImportTaskRequest",
)(
  {
    clientRequestToken: S.optional(S.String),
    name: S.String,
    importUrl: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopContinuousExportRequest extends S.Class<StopContinuousExportRequest>(
  "StopContinuousExportRequest",
)(
  { exportId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDataCollectionByAgentIdsRequest extends S.Class<StopDataCollectionByAgentIdsRequest>(
  "StopDataCollectionByAgentIdsRequest",
)(
  { agentIds: AgentIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    configurationId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    wave: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({}, ns) {}
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export const ImportTaskFilterValueList = S.Array(S.String);
export class DeleteAgent extends S.Class<DeleteAgent>("DeleteAgent")({
  agentId: S.String,
  force: S.optional(S.Boolean),
}) {}
export const DeleteAgents = S.Array(DeleteAgent);
export class Filter extends S.Class<Filter>("Filter")({
  name: S.String,
  values: FilterValues,
  condition: S.String,
}) {}
export const Filters = S.Array(Filter);
export class ExportFilter extends S.Class<ExportFilter>("ExportFilter")({
  name: S.String,
  values: FilterValues,
  condition: S.String,
}) {}
export const ExportFilters = S.Array(ExportFilter);
export class ImportTaskFilter extends S.Class<ImportTaskFilter>(
  "ImportTaskFilter",
)({
  name: S.optional(S.String),
  values: S.optional(ImportTaskFilterValueList),
}) {}
export const DescribeImportTasksFilterList = S.Array(ImportTaskFilter);
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  name: S.String,
  values: FilterValues,
}) {}
export const TagFilters = S.Array(TagFilter);
export class CustomerAgentInfo extends S.Class<CustomerAgentInfo>(
  "CustomerAgentInfo",
)({
  activeAgents: S.Number,
  healthyAgents: S.Number,
  blackListedAgents: S.Number,
  shutdownAgents: S.Number,
  unhealthyAgents: S.Number,
  totalAgents: S.Number,
  unknownAgents: S.Number,
}) {}
export class CustomerConnectorInfo extends S.Class<CustomerConnectorInfo>(
  "CustomerConnectorInfo",
)({
  activeConnectors: S.Number,
  healthyConnectors: S.Number,
  blackListedConnectors: S.Number,
  shutdownConnectors: S.Number,
  unhealthyConnectors: S.Number,
  totalConnectors: S.Number,
  unknownConnectors: S.Number,
}) {}
export class CustomerMeCollectorInfo extends S.Class<CustomerMeCollectorInfo>(
  "CustomerMeCollectorInfo",
)({
  activeMeCollectors: S.Number,
  healthyMeCollectors: S.Number,
  denyListedMeCollectors: S.Number,
  shutdownMeCollectors: S.Number,
  unhealthyMeCollectors: S.Number,
  totalMeCollectors: S.Number,
  unknownMeCollectors: S.Number,
}) {}
export class CustomerAgentlessCollectorInfo extends S.Class<CustomerAgentlessCollectorInfo>(
  "CustomerAgentlessCollectorInfo",
)({
  activeAgentlessCollectors: S.Number,
  healthyAgentlessCollectors: S.Number,
  denyListedAgentlessCollectors: S.Number,
  shutdownAgentlessCollectors: S.Number,
  unhealthyAgentlessCollectors: S.Number,
  totalAgentlessCollectors: S.Number,
  unknownAgentlessCollectors: S.Number,
}) {}
export class OrderByElement extends S.Class<OrderByElement>("OrderByElement")({
  fieldName: S.String,
  sortOrder: S.optional(S.String),
}) {}
export const OrderByList = S.Array(OrderByElement);
export const SchemaStorageConfig = S.Record({ key: S.String, value: S.String });
export const ExcludedInstanceTypes = S.Array(S.String);
export class BatchDeleteAgentsRequest extends S.Class<BatchDeleteAgentsRequest>(
  "BatchDeleteAgentsRequest",
)(
  { deleteAgents: DeleteAgents },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ configurationId: S.optional(S.String) }, ns) {}
export class CreateTagsRequest extends S.Class<CreateTagsRequest>(
  "CreateTagsRequest",
)(
  { configurationIds: ConfigurationIdList, tags: TagSet },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTagsResponse extends S.Class<CreateTagsResponse>(
  "CreateTagsResponse",
)({}, ns) {}
export class DescribeAgentsRequest extends S.Class<DescribeAgentsRequest>(
  "DescribeAgentsRequest",
)(
  {
    agentIds: S.optional(AgentIds),
    filters: S.optional(Filters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExportTasksRequest extends S.Class<DescribeExportTasksRequest>(
  "DescribeExportTasksRequest",
)(
  {
    exportIds: S.optional(ExportIds),
    filters: S.optional(ExportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImportTasksRequest extends S.Class<DescribeImportTasksRequest>(
  "DescribeImportTasksRequest",
)(
  {
    filters: S.optional(DescribeImportTasksFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsRequest extends S.Class<DescribeTagsRequest>(
  "DescribeTagsRequest",
)(
  {
    filters: S.optional(TagFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDiscoverySummaryResponse extends S.Class<GetDiscoverySummaryResponse>(
  "GetDiscoverySummaryResponse",
)(
  {
    servers: S.optional(S.Number),
    applications: S.optional(S.Number),
    serversMappedToApplications: S.optional(S.Number),
    serversMappedtoTags: S.optional(S.Number),
    agentSummary: S.optional(CustomerAgentInfo),
    connectorSummary: S.optional(CustomerConnectorInfo),
    meCollectorSummary: S.optional(CustomerMeCollectorInfo),
    agentlessCollectorSummary: S.optional(CustomerAgentlessCollectorInfo),
  },
  ns,
) {}
export class ListConfigurationsRequest extends S.Class<ListConfigurationsRequest>(
  "ListConfigurationsRequest",
)(
  {
    configurationType: S.String,
    filters: S.optional(Filters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    orderBy: S.optional(OrderByList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBatchDeleteConfigurationTaskResponse extends S.Class<StartBatchDeleteConfigurationTaskResponse>(
  "StartBatchDeleteConfigurationTaskResponse",
)({ taskId: S.optional(S.String) }, ns) {}
export class StartContinuousExportResponse extends S.Class<StartContinuousExportResponse>(
  "StartContinuousExportResponse",
)(
  {
    exportId: S.optional(S.String),
    s3Bucket: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    dataSource: S.optional(S.String),
    schemaStorageConfig: S.optional(SchemaStorageConfig),
  },
  ns,
) {}
export class StopContinuousExportResponse extends S.Class<StopContinuousExportResponse>(
  "StopContinuousExportResponse",
)(
  {
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class AgentConfigurationStatus extends S.Class<AgentConfigurationStatus>(
  "AgentConfigurationStatus",
)({
  agentId: S.optional(S.String),
  operationSucceeded: S.optional(S.Boolean),
  description: S.optional(S.String),
}) {}
export const AgentConfigurationStatusList = S.Array(AgentConfigurationStatus);
export class StopDataCollectionByAgentIdsResponse extends S.Class<StopDataCollectionByAgentIdsResponse>(
  "StopDataCollectionByAgentIdsResponse",
)(
  { agentsConfigurationStatus: S.optional(AgentConfigurationStatusList) },
  ns,
) {}
export class BatchDeleteImportDataError extends S.Class<BatchDeleteImportDataError>(
  "BatchDeleteImportDataError",
)({
  importTaskId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorDescription: S.optional(S.String),
}) {}
export const BatchDeleteImportDataErrorList = S.Array(
  BatchDeleteImportDataError,
);
export const DescribeConfigurationsAttribute = S.Record({
  key: S.String,
  value: S.String,
});
export const DescribeConfigurationsAttributes = S.Array(
  DescribeConfigurationsAttribute,
);
export class ContinuousExportDescription extends S.Class<ContinuousExportDescription>(
  "ContinuousExportDescription",
)({
  exportId: S.optional(S.String),
  status: S.optional(S.String),
  statusDetail: S.optional(S.String),
  s3Bucket: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dataSource: S.optional(S.String),
  schemaStorageConfig: S.optional(SchemaStorageConfig),
}) {}
export const ContinuousExportDescriptions = S.Array(
  ContinuousExportDescription,
);
export class ExportInfo extends S.Class<ExportInfo>("ExportInfo")({
  exportId: S.String,
  exportStatus: S.String,
  statusMessage: S.String,
  configurationsDownloadUrl: S.optional(S.String),
  exportRequestTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  isTruncated: S.optional(S.Boolean),
  requestedStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  requestedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ExportsInfo = S.Array(ExportInfo);
export class ImportTask extends S.Class<ImportTask>("ImportTask")({
  importTaskId: S.optional(S.String),
  clientRequestToken: S.optional(S.String),
  name: S.optional(S.String),
  importUrl: S.optional(S.String),
  status: S.optional(S.String),
  importRequestTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  importCompletionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  importDeletedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  fileClassification: S.optional(S.String),
  serverImportSuccess: S.optional(S.Number),
  serverImportFailure: S.optional(S.Number),
  applicationImportSuccess: S.optional(S.Number),
  applicationImportFailure: S.optional(S.Number),
  errorsAndFailedEntriesZip: S.optional(S.String),
}) {}
export const ImportTaskList = S.Array(ImportTask);
export class NeighborConnectionDetail extends S.Class<NeighborConnectionDetail>(
  "NeighborConnectionDetail",
)({
  sourceServerId: S.String,
  destinationServerId: S.String,
  destinationPort: S.optional(S.Number),
  transportProtocol: S.optional(S.String),
  connectionsCount: S.Number,
}) {}
export const NeighborDetailsList = S.Array(NeighborConnectionDetail);
export class UsageMetricBasis extends S.Class<UsageMetricBasis>(
  "UsageMetricBasis",
)({ name: S.optional(S.String), percentageAdjust: S.optional(S.Number) }) {}
export class ReservedInstanceOptions extends S.Class<ReservedInstanceOptions>(
  "ReservedInstanceOptions",
)({
  purchasingOption: S.String,
  offeringClass: S.String,
  termLength: S.String,
}) {}
export class BatchDeleteImportDataResponse extends S.Class<BatchDeleteImportDataResponse>(
  "BatchDeleteImportDataResponse",
)({ errors: S.optional(BatchDeleteImportDataErrorList) }, ns) {}
export class DescribeConfigurationsResponse extends S.Class<DescribeConfigurationsResponse>(
  "DescribeConfigurationsResponse",
)({ configurations: S.optional(DescribeConfigurationsAttributes) }, ns) {}
export class DescribeContinuousExportsResponse extends S.Class<DescribeContinuousExportsResponse>(
  "DescribeContinuousExportsResponse",
)(
  {
    descriptions: S.optional(ContinuousExportDescriptions),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeExportConfigurationsResponse extends S.Class<DescribeExportConfigurationsResponse>(
  "DescribeExportConfigurationsResponse",
)(
  { exportsInfo: S.optional(ExportsInfo), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeExportTasksResponse extends S.Class<DescribeExportTasksResponse>(
  "DescribeExportTasksResponse",
)(
  { exportsInfo: S.optional(ExportsInfo), nextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeImportTasksResponse extends S.Class<DescribeImportTasksResponse>(
  "DescribeImportTasksResponse",
)({ nextToken: S.optional(S.String), tasks: S.optional(ImportTaskList) }, ns) {}
export class ListServerNeighborsResponse extends S.Class<ListServerNeighborsResponse>(
  "ListServerNeighborsResponse",
)(
  {
    neighbors: NeighborDetailsList,
    nextToken: S.optional(S.String),
    knownDependencyCount: S.optional(S.Number),
  },
  ns,
) {}
export class StartDataCollectionByAgentIdsResponse extends S.Class<StartDataCollectionByAgentIdsResponse>(
  "StartDataCollectionByAgentIdsResponse",
)(
  { agentsConfigurationStatus: S.optional(AgentConfigurationStatusList) },
  ns,
) {}
export class StartImportTaskResponse extends S.Class<StartImportTaskResponse>(
  "StartImportTaskResponse",
)({ task: S.optional(ImportTask) }, ns) {}
export class FailedConfiguration extends S.Class<FailedConfiguration>(
  "FailedConfiguration",
)({
  configurationId: S.optional(S.String),
  errorStatusCode: S.optional(S.Number),
  errorMessage: S.optional(S.String),
}) {}
export const FailedConfigurationList = S.Array(FailedConfiguration);
export class DeletionWarning extends S.Class<DeletionWarning>(
  "DeletionWarning",
)({
  configurationId: S.optional(S.String),
  warningCode: S.optional(S.Number),
  warningText: S.optional(S.String),
}) {}
export const DeletionWarningsList = S.Array(DeletionWarning);
export class Ec2RecommendationsExportPreferences extends S.Class<Ec2RecommendationsExportPreferences>(
  "Ec2RecommendationsExportPreferences",
)({
  enabled: S.optional(S.Boolean),
  cpuPerformanceMetricBasis: S.optional(UsageMetricBasis),
  ramPerformanceMetricBasis: S.optional(UsageMetricBasis),
  tenancy: S.optional(S.String),
  excludedInstanceTypes: S.optional(ExcludedInstanceTypes),
  preferredRegion: S.optional(S.String),
  reservedInstanceOptions: S.optional(ReservedInstanceOptions),
}) {}
export class BatchDeleteAgentError extends S.Class<BatchDeleteAgentError>(
  "BatchDeleteAgentError",
)({ agentId: S.String, errorMessage: S.String, errorCode: S.String }) {}
export const BatchDeleteAgentErrors = S.Array(BatchDeleteAgentError);
export class BatchDeleteConfigurationTask extends S.Class<BatchDeleteConfigurationTask>(
  "BatchDeleteConfigurationTask",
)({
  taskId: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  configurationType: S.optional(S.String),
  requestedConfigurations: S.optional(ConfigurationIdList),
  deletedConfigurations: S.optional(ConfigurationIdList),
  failedConfigurations: S.optional(FailedConfigurationList),
  deletionWarnings: S.optional(DeletionWarningsList),
}) {}
export class ConfigurationTag extends S.Class<ConfigurationTag>(
  "ConfigurationTag",
)({
  configurationType: S.optional(S.String),
  configurationId: S.optional(S.String),
  key: S.optional(S.String),
  value: S.optional(S.String),
  timeOfCreation: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ConfigurationTagSet = S.Array(
  ConfigurationTag.pipe(T.XmlName("item")),
);
export const Configuration = S.Record({ key: S.String, value: S.String });
export const Configurations = S.Array(Configuration);
export const ExportPreferences = S.Union(
  S.Struct({
    ec2RecommendationsPreferences: Ec2RecommendationsExportPreferences,
  }),
);
export class BatchDeleteAgentsResponse extends S.Class<BatchDeleteAgentsResponse>(
  "BatchDeleteAgentsResponse",
)({ errors: S.optional(BatchDeleteAgentErrors) }, ns) {}
export class DescribeBatchDeleteConfigurationTaskResponse extends S.Class<DescribeBatchDeleteConfigurationTaskResponse>(
  "DescribeBatchDeleteConfigurationTaskResponse",
)({ task: S.optional(BatchDeleteConfigurationTask) }, ns) {}
export class DescribeTagsResponse extends S.Class<DescribeTagsResponse>(
  "DescribeTagsResponse",
)(
  { tags: S.optional(ConfigurationTagSet), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListConfigurationsResponse extends S.Class<ListConfigurationsResponse>(
  "ListConfigurationsResponse",
)(
  {
    configurations: S.optional(Configurations),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartExportTaskRequest extends S.Class<StartExportTaskRequest>(
  "StartExportTaskRequest",
)(
  {
    exportDataFormat: S.optional(ExportDataFormats),
    filters: S.optional(ExportFilters),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    preferences: S.optional(ExportPreferences),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AgentNetworkInfo extends S.Class<AgentNetworkInfo>(
  "AgentNetworkInfo",
)({ ipAddress: S.optional(S.String), macAddress: S.optional(S.String) }) {}
export const AgentNetworkInfoList = S.Array(AgentNetworkInfo);
export class AgentInfo extends S.Class<AgentInfo>("AgentInfo")({
  agentId: S.optional(S.String),
  hostName: S.optional(S.String),
  agentNetworkInfoList: S.optional(AgentNetworkInfoList),
  connectorId: S.optional(S.String),
  version: S.optional(S.String),
  health: S.optional(S.String),
  lastHealthPingTime: S.optional(S.String),
  collectionStatus: S.optional(S.String),
  agentType: S.optional(S.String),
  registeredTime: S.optional(S.String),
}) {}
export const AgentsInfo = S.Array(AgentInfo);
export class DescribeAgentsResponse extends S.Class<DescribeAgentsResponse>(
  "DescribeAgentsResponse",
)(
  { agentsInfo: S.optional(AgentsInfo), nextToken: S.optional(S.String) },
  ns,
) {}
export class StartExportTaskResponse extends S.Class<StartExportTaskResponse>(
  "StartExportTaskResponse",
)({ exportId: S.optional(S.String) }, ns) {}

//# Errors
export class AuthorizationErrorException extends S.TaggedError<AuthorizationErrorException>()(
  "AuthorizationErrorException",
  { message: S.optional(S.String) },
) {}
export class HomeRegionNotSetException extends S.TaggedError<HomeRegionNotSetException>()(
  "HomeRegionNotSetException",
  { message: S.optional(S.String) },
) {}
export class ConflictErrorException extends S.TaggedError<ConflictErrorException>()(
  "ConflictErrorException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
) {}
export class ServerInternalErrorException extends S.TaggedError<ServerInternalErrorException>()(
  "ServerInternalErrorException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Associates one or more configuration items with an application.
 */
export const associateConfigurationItemsToApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateConfigurationItemsToApplicationRequest,
    output: AssociateConfigurationItemsToApplicationResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Begins the export of a discovered data report to an Amazon S3 bucket managed by Amazon Web Services.
 *
 * Exports might provide an estimate of fees and savings based on certain information
 * that you provide. Fee estimates do not include any taxes that might apply.
 * Your actual fees and savings depend on a variety of factors, including your actual usage of Amazon Web Services
 * services, which might vary from the estimates provided in this report.
 *
 * If you do not specify `preferences` or `agentIds` in the filter, a
 * summary of all servers, applications, tags, and performance is generated. This data is an
 * aggregation of all server data collected through on-premises tooling, file import, application
 * grouping and applying tags.
 *
 * If you specify `agentIds` in a filter, the task exports up to 72 hours of
 * detailed data collected by the identified Application Discovery Agent, including network,
 * process, and performance details. A time range for exported agent data may be set by using
 * `startTime` and `endTime`. Export of detailed agent data is limited to
 * five concurrently running exports.
 * Export of detailed agent data is limited to two exports per day.
 *
 * If you enable `ec2RecommendationsPreferences` in `preferences`
 * , an
 * Amazon EC2 instance matching the characteristics of each server in Application Discovery Service is generated.
 * Changing the attributes of the `ec2RecommendationsPreferences` changes the
 * criteria of the recommendation.
 */
export const startExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExportTaskRequest,
  output: StartExportTaskResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    OperationNotPermittedException,
    ServerInternalErrorException,
  ],
}));
/**
 * Retrieves a list of configuration items that have tags as specified by the key-value
 * pairs, name and value, passed to the optional parameter `filters`.
 *
 * There are three valid tag filter names:
 *
 * - tagKey
 *
 * - tagValue
 *
 * - configurationId
 *
 * Also, all configuration items associated with your user that have tags can be
 * listed if you call `DescribeTags` as is without passing any parameters.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeTagsRequest,
    output: DescribeTagsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "tags",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Starts an import task, which allows you to import details of your on-premises environment
 * directly into Amazon Web Services Migration Hub without having to use the Amazon Web Services Application Discovery
 * Service (Application Discovery Service) tools such as the Amazon Web Services Application Discovery Service Agentless Collector
 * or Application Discovery Agent. This gives you the option to
 * perform migration assessment and planning directly from your imported data, including the
 * ability to group your devices as applications and track their migration status.
 *
 * To start an import request, do this:
 *
 * - Download the specially formatted comma separated value (CSV) import template, which
 * you can find here: https://s3.us-west-2.amazonaws.com/templates-7cffcf56-bd96-4b1c-b45b-a5b42f282e46/import_template.csv.
 *
 * - Fill out the template with your server and application data.
 *
 * - Upload your import file to an Amazon S3 bucket, and make a note of it's Object URL.
 * Your import file must be in the CSV format.
 *
 * - Use the console or the `StartImportTask` command with the Amazon Web Services CLI or one
 * of the Amazon Web Services SDKs to import the records from your file.
 *
 * For more information, including step-by-step procedures, see Migration Hub
 * Import in the Amazon Web Services Application Discovery Service User
 * Guide.
 *
 * There are limits to the number of import tasks you can create (and delete) in an Amazon Web Services
 * account. For more information, see Amazon Web Services Application
 * Discovery Service Limits in the Amazon Web Services Application Discovery Service User
 * Guide.
 */
export const startImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportTaskRequest,
  output: StartImportTaskResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ResourceInUseException,
    ServerInternalErrorException,
  ],
}));
/**
 * Takes a list of configurationId as input and starts an asynchronous deletion
 * task to remove the configurationItems. Returns a unique deletion task identifier.
 */
export const startBatchDeleteConfigurationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartBatchDeleteConfigurationTaskRequest,
    output: StartBatchDeleteConfigurationTaskResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      LimitExceededException,
      OperationNotPermittedException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Lists agents or collectors as specified by ID or other filters. All agents/collectors
 * associated with your user can be listed if you call `DescribeAgents` as is
 * without passing any parameters.
 */
export const describeAgents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeAgentsRequest,
    output: DescribeAgentsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "agentsInfo",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes one or more agents or collectors as specified by ID. Deleting an agent or collector does not
 * delete the previously discovered data.
 * To delete the data collected, use `StartBatchDeleteConfigurationTask`.
 */
export const batchDeleteAgents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteAgentsRequest,
  output: BatchDeleteAgentsResponse,
  errors: [
    AuthorizationErrorException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Takes a unique deletion task identifier as input and returns metadata about a configuration deletion task.
 */
export const describeBatchDeleteConfigurationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeBatchDeleteConfigurationTaskRequest,
    output: DescribeBatchDeleteConfigurationTaskResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Deletes one or more import tasks, each identified by their import ID. Each import task has
 * a number of records that can identify servers or applications.
 *
 * Amazon Web Services Application Discovery Service has built-in matching logic that will identify when
 * discovered servers match existing entries that you've previously discovered, the information
 * for the already-existing discovered server is updated. When you delete an import task that
 * contains records that were used to match, the information in those matched records that comes
 * from the deleted records will also be deleted.
 */
export const batchDeleteImportData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteImportDataRequest,
    output: BatchDeleteImportDataResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }),
);
/**
 * Retrieves attributes for a list of configuration item IDs.
 *
 * All of the supplied IDs must be for the same asset type from one of the
 * following:
 *
 * - server
 *
 * - application
 *
 * - process
 *
 * - connection
 *
 * Output fields are specific to the asset type specified. For example, the output for a
 * *server* configuration item includes a list of attributes about the
 * server, such as host name, operating system, number of network cards, etc.
 *
 * For a complete list of outputs for each asset type, see Using the DescribeConfigurations Action in the Amazon Web Services Application
 * Discovery Service User Guide.
 */
export const describeConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConfigurationsRequest,
    output: DescribeConfigurationsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }),
);
/**
 * Retrieve status of one or more export tasks. You can retrieve the status of up to 100
 * export tasks.
 */
export const describeExportTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeExportTasksRequest,
    output: DescribeExportTasksResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "exportsInfo",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns an array of import tasks for your account, including status information, times,
 * IDs, the Amazon S3 Object URL for the import file, and more.
 */
export const describeImportTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeImportTasksRequest,
    output: DescribeImportTasksResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "tasks",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves a list of servers that are one network hop away from a specified
 * server.
 */
export const listServerNeighbors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServerNeighborsRequest,
  output: ListServerNeighborsResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Instructs the specified agents to start collecting data.
 */
export const startDataCollectionByAgentIds =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDataCollectionByAgentIdsRequest,
    output: StartDataCollectionByAgentIdsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Creates an application with the given name and description.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Retrieves a short summary of discovered assets.
 *
 * This API operation takes no request parameters and is called as is at the command
 * prompt as shown in the example.
 */
export const getDiscoverySummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDiscoverySummaryRequest,
  output: GetDiscoverySummaryResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Instructs the specified agents to stop collecting data.
 */
export const stopDataCollectionByAgentIds =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopDataCollectionByAgentIdsRequest,
    output: StopDataCollectionByAgentIdsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Deletes a list of applications and their associations with configuration
 * items.
 */
export const deleteApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationsRequest,
  output: DeleteApplicationsResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Disassociates one or more configuration items from an application.
 */
export const disassociateConfigurationItemsFromApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateConfigurationItemsFromApplicationRequest,
    output: DisassociateConfigurationItemsFromApplicationResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ServerInternalErrorException,
    ],
  }));
/**
 * Updates metadata about an application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Lists exports as specified by ID. All continuous exports associated with your user
 * can be listed if you call `DescribeContinuousExports` as is without passing
 * any parameters.
 */
export const describeContinuousExports =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeContinuousExportsRequest,
    output: DescribeContinuousExportsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      OperationNotPermittedException,
      ResourceNotFoundException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "descriptions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Start the continuous flow of agent's discovered data into Amazon Athena.
 */
export const startContinuousExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContinuousExportRequest,
    output: StartContinuousExportResponse,
    errors: [
      AuthorizationErrorException,
      ConflictErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      OperationNotPermittedException,
      ResourceInUseException,
      ServerInternalErrorException,
    ],
  }),
);
/**
 * Stop the continuous flow of agent's discovered data into Amazon Athena.
 */
export const stopContinuousExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopContinuousExportRequest,
    output: StopContinuousExportResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      OperationNotPermittedException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServerInternalErrorException,
    ],
  }),
);
/**
 * Deprecated. Use `StartExportTask` instead.
 *
 * Exports all discovered configuration data to an Amazon S3 bucket or an application that
 * enables you to view and evaluate the data. Data includes tags and tag associations, processes,
 * connections, servers, and system performance. This API returns an export ID that you can query
 * using the *DescribeExportConfigurations* API. The system imposes a limit of
 * two configuration exports in six hours.
 */
export const exportConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExportConfigurationsRequest,
    output: ExportConfigurationsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      OperationNotPermittedException,
      ServerInternalErrorException,
    ],
  }),
);
/**
 * Retrieves a list of configuration items as specified by the value passed to the
 * required parameter `configurationType`. Optional filtering may be applied to refine
 * search results.
 */
export const listConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConfigurationsRequest,
    output: ListConfigurationsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "configurations",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * `DescribeExportConfigurations` is deprecated. Use DescribeExportTasks, instead.
 */
export const describeExportConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeExportConfigurationsRequest,
    output: DescribeExportConfigurationsResponse,
    errors: [
      AuthorizationErrorException,
      HomeRegionNotSetException,
      InvalidParameterException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServerInternalErrorException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "exportsInfo",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates one or more tags for configuration items. Tags are metadata that help you
 * categorize IT assets. This API accepts a list of multiple configuration items.
 *
 * Do not store sensitive information (like personal data) in tags.
 */
export const createTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServerInternalErrorException,
  ],
}));
/**
 * Deletes the association between configuration items and one or more tags. This API
 * accepts a list of multiple configuration items.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ServerInternalErrorException,
  ],
}));

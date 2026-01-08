import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://ec2.amazon.com/awsposiedon/V2015_11_01/");
const svc = T.AwsApiService({
  sdkId: "Application Discovery Service",
  serviceShapeName: "AWSPoseidonService_V2015_11_01",
});
const auth = T.AwsAuthSigv4({ name: "discovery" });
const ver = T.ServiceVersion("2015-11-01");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://discovery-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://discovery-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://discovery.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://discovery.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationId = string;
export type ConfigurationId = string;
export type ImportTaskIdentifier = string;
export type ApplicationName = string;
export type ApplicationDescription = string;
export type ApplicationWave = string;
export type AgentId = string;
export type NextToken = string;
export type UUID = string;
export type ConfigurationsExportId = string;
export type DescribeContinuousExportsMaxResults = number;
export type DescribeImportTasksMaxResults = number;
export type S3Bucket = string;
export type ClientRequestToken = string;
export type ImportTaskName = string;
export type ImportURL = string;
export type TagKey = string;
export type TagValue = string;
export type FilterValue = string;
export type Condition = string;
export type FilterName = string;
export type ImportTaskFilterValue = string;
export type OrderByElementFieldName = string;
export type DatabaseName = string;
export type Message = string;
export type ExportEnabled = boolean;
export type EC2InstanceType = string;
export type UserPreferredRegion = string;
export type BatchDeleteImportDataErrorDescription = string;
export type StringMax255 = string;
export type ExportStatusMessage = string;
export type ConfigurationsDownloadUrl = string;
export type ExportRequestTime = Date;
export type BoxedInteger = number;
export type S3PresignedUrl = string;
export type UsageMetricBasisName = string;
export type UsageMetricPercentageAdjust = number;
export type ErrorStatusCode = number;
export type ErrorMessage = string;
export type WarningCode = number;
export type WarningText = string;

//# Schemas
export interface ExportConfigurationsRequest {}
export const ExportConfigurationsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportConfigurationsRequest",
}) as any as S.Schema<ExportConfigurationsRequest>;
export interface GetDiscoverySummaryRequest {}
export const GetDiscoverySummaryRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDiscoverySummaryRequest",
}) as any as S.Schema<GetDiscoverySummaryRequest>;
export interface StartContinuousExportRequest {}
export const StartContinuousExportRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartContinuousExportRequest",
}) as any as S.Schema<StartContinuousExportRequest>;
export type ConfigurationIdList = string[];
export const ConfigurationIdList = S.Array(S.String);
export type ToDeleteIdentifierList = string[];
export const ToDeleteIdentifierList = S.Array(S.String);
export type ApplicationIdsList = string[];
export const ApplicationIdsList = S.Array(S.String);
export type AgentIds = string[];
export const AgentIds = S.Array(S.String);
export type ContinuousExportIds = string[];
export const ContinuousExportIds = S.Array(S.String);
export type ExportIds = string[];
export const ExportIds = S.Array(S.String);
export type ConfigurationItemType =
  | "SERVER"
  | "PROCESS"
  | "CONNECTION"
  | "APPLICATION";
export const ConfigurationItemType = S.Literal(
  "SERVER",
  "PROCESS",
  "CONNECTION",
  "APPLICATION",
);
export type DeletionConfigurationItemType = "SERVER";
export const DeletionConfigurationItemType = S.Literal("SERVER");
export type DataSource = "AGENT";
export const DataSource = S.Literal("AGENT");
export type ExportDataFormat = "CSV";
export const ExportDataFormat = S.Literal("CSV");
export type ExportDataFormats = ExportDataFormat[];
export const ExportDataFormats = S.Array(ExportDataFormat);
export interface AssociateConfigurationItemsToApplicationRequest {
  applicationConfigurationId: string;
  configurationIds: string[];
}
export const AssociateConfigurationItemsToApplicationRequest = S.suspend(() =>
  S.Struct({
    applicationConfigurationId: S.String,
    configurationIds: ConfigurationIdList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateConfigurationItemsToApplicationRequest",
}) as any as S.Schema<AssociateConfigurationItemsToApplicationRequest>;
export interface AssociateConfigurationItemsToApplicationResponse {}
export const AssociateConfigurationItemsToApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateConfigurationItemsToApplicationResponse",
}) as any as S.Schema<AssociateConfigurationItemsToApplicationResponse>;
export interface BatchDeleteImportDataRequest {
  importTaskIds: string[];
  deleteHistory?: boolean;
}
export const BatchDeleteImportDataRequest = S.suspend(() =>
  S.Struct({
    importTaskIds: ToDeleteIdentifierList,
    deleteHistory: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteImportDataRequest",
}) as any as S.Schema<BatchDeleteImportDataRequest>;
export interface CreateApplicationRequest {
  name: string;
  description?: string;
  wave?: string;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    wave: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DeleteApplicationsRequest {
  configurationIds: string[];
}
export const DeleteApplicationsRequest = S.suspend(() =>
  S.Struct({ configurationIds: ApplicationIdsList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationsRequest",
}) as any as S.Schema<DeleteApplicationsRequest>;
export interface DeleteApplicationsResponse {}
export const DeleteApplicationsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationsResponse",
}) as any as S.Schema<DeleteApplicationsResponse>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagSet = Tag[];
export const TagSet = S.Array(
  Tag.pipe(T.XmlName("item")).annotations({ identifier: "Tag" }),
);
export interface DeleteTagsRequest {
  configurationIds: string[];
  tags?: Tag[];
}
export const DeleteTagsRequest = S.suspend(() =>
  S.Struct({
    configurationIds: ConfigurationIdList,
    tags: S.optional(TagSet),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsRequest",
}) as any as S.Schema<DeleteTagsRequest>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DescribeBatchDeleteConfigurationTaskRequest {
  taskId: string;
}
export const DescribeBatchDeleteConfigurationTaskRequest = S.suspend(() =>
  S.Struct({ taskId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBatchDeleteConfigurationTaskRequest",
}) as any as S.Schema<DescribeBatchDeleteConfigurationTaskRequest>;
export interface DescribeConfigurationsRequest {
  configurationIds: string[];
}
export const DescribeConfigurationsRequest = S.suspend(() =>
  S.Struct({ configurationIds: ConfigurationIdList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationsRequest",
}) as any as S.Schema<DescribeConfigurationsRequest>;
export interface DescribeContinuousExportsRequest {
  exportIds?: string[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeContinuousExportsRequest = S.suspend(() =>
  S.Struct({
    exportIds: S.optional(ContinuousExportIds),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeContinuousExportsRequest",
}) as any as S.Schema<DescribeContinuousExportsRequest>;
export interface DescribeExportConfigurationsRequest {
  exportIds?: string[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeExportConfigurationsRequest = S.suspend(() =>
  S.Struct({
    exportIds: S.optional(ExportIds),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeExportConfigurationsRequest",
}) as any as S.Schema<DescribeExportConfigurationsRequest>;
export interface DisassociateConfigurationItemsFromApplicationRequest {
  applicationConfigurationId: string;
  configurationIds: string[];
}
export const DisassociateConfigurationItemsFromApplicationRequest = S.suspend(
  () =>
    S.Struct({
      applicationConfigurationId: S.String,
      configurationIds: ConfigurationIdList,
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DisassociateConfigurationItemsFromApplicationRequest",
}) as any as S.Schema<DisassociateConfigurationItemsFromApplicationRequest>;
export interface DisassociateConfigurationItemsFromApplicationResponse {}
export const DisassociateConfigurationItemsFromApplicationResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateConfigurationItemsFromApplicationResponse",
}) as any as S.Schema<DisassociateConfigurationItemsFromApplicationResponse>;
export interface ExportConfigurationsResponse {
  exportId?: string;
}
export const ExportConfigurationsResponse = S.suspend(() =>
  S.Struct({ exportId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ExportConfigurationsResponse",
}) as any as S.Schema<ExportConfigurationsResponse>;
export interface ListServerNeighborsRequest {
  configurationId: string;
  portInformationNeeded?: boolean;
  neighborConfigurationIds?: string[];
  maxResults?: number;
  nextToken?: string;
}
export const ListServerNeighborsRequest = S.suspend(() =>
  S.Struct({
    configurationId: S.String,
    portInformationNeeded: S.optional(S.Boolean),
    neighborConfigurationIds: S.optional(ConfigurationIdList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServerNeighborsRequest",
}) as any as S.Schema<ListServerNeighborsRequest>;
export interface StartBatchDeleteConfigurationTaskRequest {
  configurationType: DeletionConfigurationItemType;
  configurationIds: string[];
}
export const StartBatchDeleteConfigurationTaskRequest = S.suspend(() =>
  S.Struct({
    configurationType: DeletionConfigurationItemType,
    configurationIds: ConfigurationIdList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartBatchDeleteConfigurationTaskRequest",
}) as any as S.Schema<StartBatchDeleteConfigurationTaskRequest>;
export interface StartDataCollectionByAgentIdsRequest {
  agentIds: string[];
}
export const StartDataCollectionByAgentIdsRequest = S.suspend(() =>
  S.Struct({ agentIds: AgentIds }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDataCollectionByAgentIdsRequest",
}) as any as S.Schema<StartDataCollectionByAgentIdsRequest>;
export interface StartImportTaskRequest {
  clientRequestToken?: string;
  name: string;
  importUrl: string;
}
export const StartImportTaskRequest = S.suspend(() =>
  S.Struct({
    clientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    name: S.String,
    importUrl: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportTaskRequest",
}) as any as S.Schema<StartImportTaskRequest>;
export interface StopContinuousExportRequest {
  exportId: string;
}
export const StopContinuousExportRequest = S.suspend(() =>
  S.Struct({ exportId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopContinuousExportRequest",
}) as any as S.Schema<StopContinuousExportRequest>;
export interface StopDataCollectionByAgentIdsRequest {
  agentIds: string[];
}
export const StopDataCollectionByAgentIdsRequest = S.suspend(() =>
  S.Struct({ agentIds: AgentIds }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopDataCollectionByAgentIdsRequest",
}) as any as S.Schema<StopDataCollectionByAgentIdsRequest>;
export interface UpdateApplicationRequest {
  configurationId: string;
  name?: string;
  description?: string;
  wave?: string;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    configurationId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    wave: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateApplicationResponse {}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export type ImportTaskFilterName =
  | "IMPORT_TASK_ID"
  | "STATUS"
  | "NAME"
  | "FILE_CLASSIFICATION";
export const ImportTaskFilterName = S.Literal(
  "IMPORT_TASK_ID",
  "STATUS",
  "NAME",
  "FILE_CLASSIFICATION",
);
export type ImportTaskFilterValueList = string[];
export const ImportTaskFilterValueList = S.Array(S.String);
export type orderString = "ASC" | "DESC";
export const orderString = S.Literal("ASC", "DESC");
export interface DeleteAgent {
  agentId: string;
  force?: boolean;
}
export const DeleteAgent = S.suspend(() =>
  S.Struct({ agentId: S.String, force: S.optional(S.Boolean) }),
).annotations({ identifier: "DeleteAgent" }) as any as S.Schema<DeleteAgent>;
export type DeleteAgents = DeleteAgent[];
export const DeleteAgents = S.Array(DeleteAgent);
export interface Filter {
  name: string;
  values: string[];
  condition: string;
}
export const Filter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues, condition: S.String }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface ExportFilter {
  name: string;
  values: string[];
  condition: string;
}
export const ExportFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues, condition: S.String }),
).annotations({ identifier: "ExportFilter" }) as any as S.Schema<ExportFilter>;
export type ExportFilters = ExportFilter[];
export const ExportFilters = S.Array(ExportFilter);
export interface ImportTaskFilter {
  name?: ImportTaskFilterName;
  values?: string[];
}
export const ImportTaskFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(ImportTaskFilterName),
    values: S.optional(ImportTaskFilterValueList),
  }),
).annotations({
  identifier: "ImportTaskFilter",
}) as any as S.Schema<ImportTaskFilter>;
export type DescribeImportTasksFilterList = ImportTaskFilter[];
export const DescribeImportTasksFilterList = S.Array(ImportTaskFilter);
export interface TagFilter {
  name: string;
  values: string[];
}
export const TagFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: FilterValues }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export type TagFilters = TagFilter[];
export const TagFilters = S.Array(TagFilter);
export interface CustomerAgentInfo {
  activeAgents: number;
  healthyAgents: number;
  blackListedAgents: number;
  shutdownAgents: number;
  unhealthyAgents: number;
  totalAgents: number;
  unknownAgents: number;
}
export const CustomerAgentInfo = S.suspend(() =>
  S.Struct({
    activeAgents: S.Number,
    healthyAgents: S.Number,
    blackListedAgents: S.Number,
    shutdownAgents: S.Number,
    unhealthyAgents: S.Number,
    totalAgents: S.Number,
    unknownAgents: S.Number,
  }),
).annotations({
  identifier: "CustomerAgentInfo",
}) as any as S.Schema<CustomerAgentInfo>;
export interface CustomerConnectorInfo {
  activeConnectors: number;
  healthyConnectors: number;
  blackListedConnectors: number;
  shutdownConnectors: number;
  unhealthyConnectors: number;
  totalConnectors: number;
  unknownConnectors: number;
}
export const CustomerConnectorInfo = S.suspend(() =>
  S.Struct({
    activeConnectors: S.Number,
    healthyConnectors: S.Number,
    blackListedConnectors: S.Number,
    shutdownConnectors: S.Number,
    unhealthyConnectors: S.Number,
    totalConnectors: S.Number,
    unknownConnectors: S.Number,
  }),
).annotations({
  identifier: "CustomerConnectorInfo",
}) as any as S.Schema<CustomerConnectorInfo>;
export interface CustomerMeCollectorInfo {
  activeMeCollectors: number;
  healthyMeCollectors: number;
  denyListedMeCollectors: number;
  shutdownMeCollectors: number;
  unhealthyMeCollectors: number;
  totalMeCollectors: number;
  unknownMeCollectors: number;
}
export const CustomerMeCollectorInfo = S.suspend(() =>
  S.Struct({
    activeMeCollectors: S.Number,
    healthyMeCollectors: S.Number,
    denyListedMeCollectors: S.Number,
    shutdownMeCollectors: S.Number,
    unhealthyMeCollectors: S.Number,
    totalMeCollectors: S.Number,
    unknownMeCollectors: S.Number,
  }),
).annotations({
  identifier: "CustomerMeCollectorInfo",
}) as any as S.Schema<CustomerMeCollectorInfo>;
export interface CustomerAgentlessCollectorInfo {
  activeAgentlessCollectors: number;
  healthyAgentlessCollectors: number;
  denyListedAgentlessCollectors: number;
  shutdownAgentlessCollectors: number;
  unhealthyAgentlessCollectors: number;
  totalAgentlessCollectors: number;
  unknownAgentlessCollectors: number;
}
export const CustomerAgentlessCollectorInfo = S.suspend(() =>
  S.Struct({
    activeAgentlessCollectors: S.Number,
    healthyAgentlessCollectors: S.Number,
    denyListedAgentlessCollectors: S.Number,
    shutdownAgentlessCollectors: S.Number,
    unhealthyAgentlessCollectors: S.Number,
    totalAgentlessCollectors: S.Number,
    unknownAgentlessCollectors: S.Number,
  }),
).annotations({
  identifier: "CustomerAgentlessCollectorInfo",
}) as any as S.Schema<CustomerAgentlessCollectorInfo>;
export interface OrderByElement {
  fieldName: string;
  sortOrder?: orderString;
}
export const OrderByElement = S.suspend(() =>
  S.Struct({ fieldName: S.String, sortOrder: S.optional(orderString) }),
).annotations({
  identifier: "OrderByElement",
}) as any as S.Schema<OrderByElement>;
export type OrderByList = OrderByElement[];
export const OrderByList = S.Array(OrderByElement);
export type SchemaStorageConfig = { [key: string]: string };
export const SchemaStorageConfig = S.Record({ key: S.String, value: S.String });
export type Tenancy = "DEDICATED" | "SHARED";
export const Tenancy = S.Literal("DEDICATED", "SHARED");
export type ExcludedInstanceTypes = string[];
export const ExcludedInstanceTypes = S.Array(S.String);
export interface BatchDeleteAgentsRequest {
  deleteAgents: DeleteAgent[];
}
export const BatchDeleteAgentsRequest = S.suspend(() =>
  S.Struct({ deleteAgents: DeleteAgents }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteAgentsRequest",
}) as any as S.Schema<BatchDeleteAgentsRequest>;
export interface CreateApplicationResponse {
  configurationId?: string;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ configurationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateTagsRequest {
  configurationIds: string[];
  tags: Tag[];
}
export const CreateTagsRequest = S.suspend(() =>
  S.Struct({ configurationIds: ConfigurationIdList, tags: TagSet }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTagsRequest",
}) as any as S.Schema<CreateTagsRequest>;
export interface CreateTagsResponse {}
export const CreateTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateTagsResponse",
}) as any as S.Schema<CreateTagsResponse>;
export interface DescribeAgentsRequest {
  agentIds?: string[];
  filters?: Filter[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeAgentsRequest = S.suspend(() =>
  S.Struct({
    agentIds: S.optional(AgentIds),
    filters: S.optional(Filters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAgentsRequest",
}) as any as S.Schema<DescribeAgentsRequest>;
export interface DescribeExportTasksRequest {
  exportIds?: string[];
  filters?: ExportFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeExportTasksRequest = S.suspend(() =>
  S.Struct({
    exportIds: S.optional(ExportIds),
    filters: S.optional(ExportFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeExportTasksRequest",
}) as any as S.Schema<DescribeExportTasksRequest>;
export interface DescribeImportTasksRequest {
  filters?: ImportTaskFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeImportTasksRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(DescribeImportTasksFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImportTasksRequest",
}) as any as S.Schema<DescribeImportTasksRequest>;
export interface DescribeTagsRequest {
  filters?: TagFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeTagsRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(TagFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsRequest",
}) as any as S.Schema<DescribeTagsRequest>;
export interface GetDiscoverySummaryResponse {
  servers?: number;
  applications?: number;
  serversMappedToApplications?: number;
  serversMappedtoTags?: number;
  agentSummary?: CustomerAgentInfo;
  connectorSummary?: CustomerConnectorInfo;
  meCollectorSummary?: CustomerMeCollectorInfo;
  agentlessCollectorSummary?: CustomerAgentlessCollectorInfo;
}
export const GetDiscoverySummaryResponse = S.suspend(() =>
  S.Struct({
    servers: S.optional(S.Number),
    applications: S.optional(S.Number),
    serversMappedToApplications: S.optional(S.Number),
    serversMappedtoTags: S.optional(S.Number),
    agentSummary: S.optional(CustomerAgentInfo),
    connectorSummary: S.optional(CustomerConnectorInfo),
    meCollectorSummary: S.optional(CustomerMeCollectorInfo),
    agentlessCollectorSummary: S.optional(CustomerAgentlessCollectorInfo),
  }).pipe(ns),
).annotations({
  identifier: "GetDiscoverySummaryResponse",
}) as any as S.Schema<GetDiscoverySummaryResponse>;
export interface ListConfigurationsRequest {
  configurationType: ConfigurationItemType;
  filters?: Filter[];
  maxResults?: number;
  nextToken?: string;
  orderBy?: OrderByElement[];
}
export const ListConfigurationsRequest = S.suspend(() =>
  S.Struct({
    configurationType: ConfigurationItemType,
    filters: S.optional(Filters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    orderBy: S.optional(OrderByList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationsRequest",
}) as any as S.Schema<ListConfigurationsRequest>;
export interface StartBatchDeleteConfigurationTaskResponse {
  taskId?: string;
}
export const StartBatchDeleteConfigurationTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartBatchDeleteConfigurationTaskResponse",
}) as any as S.Schema<StartBatchDeleteConfigurationTaskResponse>;
export interface StartContinuousExportResponse {
  exportId?: string;
  s3Bucket?: string;
  startTime?: Date;
  dataSource?: DataSource;
  schemaStorageConfig?: { [key: string]: string };
}
export const StartContinuousExportResponse = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    s3Bucket: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    dataSource: S.optional(DataSource),
    schemaStorageConfig: S.optional(SchemaStorageConfig),
  }).pipe(ns),
).annotations({
  identifier: "StartContinuousExportResponse",
}) as any as S.Schema<StartContinuousExportResponse>;
export interface StopContinuousExportResponse {
  startTime?: Date;
  stopTime?: Date;
}
export const StopContinuousExportResponse = S.suspend(() =>
  S.Struct({
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "StopContinuousExportResponse",
}) as any as S.Schema<StopContinuousExportResponse>;
export interface AgentConfigurationStatus {
  agentId?: string;
  operationSucceeded?: boolean;
  description?: string;
}
export const AgentConfigurationStatus = S.suspend(() =>
  S.Struct({
    agentId: S.optional(S.String),
    operationSucceeded: S.optional(S.Boolean),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentConfigurationStatus",
}) as any as S.Schema<AgentConfigurationStatus>;
export type AgentConfigurationStatusList = AgentConfigurationStatus[];
export const AgentConfigurationStatusList = S.Array(AgentConfigurationStatus);
export interface StopDataCollectionByAgentIdsResponse {
  agentsConfigurationStatus?: AgentConfigurationStatus[];
}
export const StopDataCollectionByAgentIdsResponse = S.suspend(() =>
  S.Struct({
    agentsConfigurationStatus: S.optional(AgentConfigurationStatusList),
  }).pipe(ns),
).annotations({
  identifier: "StopDataCollectionByAgentIdsResponse",
}) as any as S.Schema<StopDataCollectionByAgentIdsResponse>;
export type BatchDeleteImportDataErrorCode =
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "OVER_LIMIT";
export const BatchDeleteImportDataErrorCode = S.Literal(
  "NOT_FOUND",
  "INTERNAL_SERVER_ERROR",
  "OVER_LIMIT",
);
export type BatchDeleteConfigurationTaskStatus =
  | "INITIALIZING"
  | "VALIDATING"
  | "DELETING"
  | "COMPLETED"
  | "FAILED";
export const BatchDeleteConfigurationTaskStatus = S.Literal(
  "INITIALIZING",
  "VALIDATING",
  "DELETING",
  "COMPLETED",
  "FAILED",
);
export type ContinuousExportStatus =
  | "START_IN_PROGRESS"
  | "START_FAILED"
  | "ACTIVE"
  | "ERROR"
  | "STOP_IN_PROGRESS"
  | "STOP_FAILED"
  | "INACTIVE";
export const ContinuousExportStatus = S.Literal(
  "START_IN_PROGRESS",
  "START_FAILED",
  "ACTIVE",
  "ERROR",
  "STOP_IN_PROGRESS",
  "STOP_FAILED",
  "INACTIVE",
);
export type ExportStatus = "FAILED" | "SUCCEEDED" | "IN_PROGRESS";
export const ExportStatus = S.Literal("FAILED", "SUCCEEDED", "IN_PROGRESS");
export type ImportStatus =
  | "IMPORT_IN_PROGRESS"
  | "IMPORT_COMPLETE"
  | "IMPORT_COMPLETE_WITH_ERRORS"
  | "IMPORT_FAILED"
  | "IMPORT_FAILED_SERVER_LIMIT_EXCEEDED"
  | "IMPORT_FAILED_RECORD_LIMIT_EXCEEDED"
  | "IMPORT_FAILED_UNSUPPORTED_FILE_TYPE"
  | "DELETE_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED"
  | "DELETE_FAILED_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";
export const ImportStatus = S.Literal(
  "IMPORT_IN_PROGRESS",
  "IMPORT_COMPLETE",
  "IMPORT_COMPLETE_WITH_ERRORS",
  "IMPORT_FAILED",
  "IMPORT_FAILED_SERVER_LIMIT_EXCEEDED",
  "IMPORT_FAILED_RECORD_LIMIT_EXCEEDED",
  "IMPORT_FAILED_UNSUPPORTED_FILE_TYPE",
  "DELETE_IN_PROGRESS",
  "DELETE_COMPLETE",
  "DELETE_FAILED",
  "DELETE_FAILED_LIMIT_EXCEEDED",
  "INTERNAL_ERROR",
);
export type FileClassification =
  | "MODELIZEIT_EXPORT"
  | "RVTOOLS_EXPORT"
  | "VMWARE_NSX_EXPORT"
  | "IMPORT_TEMPLATE";
export const FileClassification = S.Literal(
  "MODELIZEIT_EXPORT",
  "RVTOOLS_EXPORT",
  "VMWARE_NSX_EXPORT",
  "IMPORT_TEMPLATE",
);
export type PurchasingOption = "ALL_UPFRONT" | "PARTIAL_UPFRONT" | "NO_UPFRONT";
export const PurchasingOption = S.Literal(
  "ALL_UPFRONT",
  "PARTIAL_UPFRONT",
  "NO_UPFRONT",
);
export type OfferingClass = "STANDARD" | "CONVERTIBLE";
export const OfferingClass = S.Literal("STANDARD", "CONVERTIBLE");
export type TermLength = "ONE_YEAR" | "THREE_YEAR";
export const TermLength = S.Literal("ONE_YEAR", "THREE_YEAR");
export interface BatchDeleteImportDataError {
  importTaskId?: string;
  errorCode?: BatchDeleteImportDataErrorCode;
  errorDescription?: string;
}
export const BatchDeleteImportDataError = S.suspend(() =>
  S.Struct({
    importTaskId: S.optional(S.String),
    errorCode: S.optional(BatchDeleteImportDataErrorCode),
    errorDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteImportDataError",
}) as any as S.Schema<BatchDeleteImportDataError>;
export type BatchDeleteImportDataErrorList = BatchDeleteImportDataError[];
export const BatchDeleteImportDataErrorList = S.Array(
  BatchDeleteImportDataError,
);
export type DescribeConfigurationsAttribute = { [key: string]: string };
export const DescribeConfigurationsAttribute = S.Record({
  key: S.String,
  value: S.String,
});
export type DescribeConfigurationsAttributes = { [key: string]: string }[];
export const DescribeConfigurationsAttributes = S.Array(
  DescribeConfigurationsAttribute,
);
export interface ContinuousExportDescription {
  exportId?: string;
  status?: ContinuousExportStatus;
  statusDetail?: string;
  s3Bucket?: string;
  startTime?: Date;
  stopTime?: Date;
  dataSource?: DataSource;
  schemaStorageConfig?: { [key: string]: string };
}
export const ContinuousExportDescription = S.suspend(() =>
  S.Struct({
    exportId: S.optional(S.String),
    status: S.optional(ContinuousExportStatus),
    statusDetail: S.optional(S.String),
    s3Bucket: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    dataSource: S.optional(DataSource),
    schemaStorageConfig: S.optional(SchemaStorageConfig),
  }),
).annotations({
  identifier: "ContinuousExportDescription",
}) as any as S.Schema<ContinuousExportDescription>;
export type ContinuousExportDescriptions = ContinuousExportDescription[];
export const ContinuousExportDescriptions = S.Array(
  ContinuousExportDescription,
);
export interface ExportInfo {
  exportId: string;
  exportStatus: ExportStatus;
  statusMessage: string;
  configurationsDownloadUrl?: string;
  exportRequestTime: Date;
  isTruncated?: boolean;
  requestedStartTime?: Date;
  requestedEndTime?: Date;
}
export const ExportInfo = S.suspend(() =>
  S.Struct({
    exportId: S.String,
    exportStatus: ExportStatus,
    statusMessage: S.String,
    configurationsDownloadUrl: S.optional(S.String),
    exportRequestTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    isTruncated: S.optional(S.Boolean),
    requestedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    requestedEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ExportInfo" }) as any as S.Schema<ExportInfo>;
export type ExportsInfo = ExportInfo[];
export const ExportsInfo = S.Array(ExportInfo);
export interface ImportTask {
  importTaskId?: string;
  clientRequestToken?: string;
  name?: string;
  importUrl?: string;
  status?: ImportStatus;
  importRequestTime?: Date;
  importCompletionTime?: Date;
  importDeletedTime?: Date;
  fileClassification?: FileClassification;
  serverImportSuccess?: number;
  serverImportFailure?: number;
  applicationImportSuccess?: number;
  applicationImportFailure?: number;
  errorsAndFailedEntriesZip?: string;
}
export const ImportTask = S.suspend(() =>
  S.Struct({
    importTaskId: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    name: S.optional(S.String),
    importUrl: S.optional(S.String),
    status: S.optional(ImportStatus),
    importRequestTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    importCompletionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    importDeletedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    fileClassification: S.optional(FileClassification),
    serverImportSuccess: S.optional(S.Number),
    serverImportFailure: S.optional(S.Number),
    applicationImportSuccess: S.optional(S.Number),
    applicationImportFailure: S.optional(S.Number),
    errorsAndFailedEntriesZip: S.optional(S.String),
  }),
).annotations({ identifier: "ImportTask" }) as any as S.Schema<ImportTask>;
export type ImportTaskList = ImportTask[];
export const ImportTaskList = S.Array(ImportTask);
export interface NeighborConnectionDetail {
  sourceServerId: string;
  destinationServerId: string;
  destinationPort?: number;
  transportProtocol?: string;
  connectionsCount: number;
}
export const NeighborConnectionDetail = S.suspend(() =>
  S.Struct({
    sourceServerId: S.String,
    destinationServerId: S.String,
    destinationPort: S.optional(S.Number),
    transportProtocol: S.optional(S.String),
    connectionsCount: S.Number,
  }),
).annotations({
  identifier: "NeighborConnectionDetail",
}) as any as S.Schema<NeighborConnectionDetail>;
export type NeighborDetailsList = NeighborConnectionDetail[];
export const NeighborDetailsList = S.Array(NeighborConnectionDetail);
export interface UsageMetricBasis {
  name?: string;
  percentageAdjust?: number;
}
export const UsageMetricBasis = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    percentageAdjust: S.optional(S.Number),
  }),
).annotations({
  identifier: "UsageMetricBasis",
}) as any as S.Schema<UsageMetricBasis>;
export interface ReservedInstanceOptions {
  purchasingOption: PurchasingOption;
  offeringClass: OfferingClass;
  termLength: TermLength;
}
export const ReservedInstanceOptions = S.suspend(() =>
  S.Struct({
    purchasingOption: PurchasingOption,
    offeringClass: OfferingClass,
    termLength: TermLength,
  }),
).annotations({
  identifier: "ReservedInstanceOptions",
}) as any as S.Schema<ReservedInstanceOptions>;
export interface BatchDeleteImportDataResponse {
  errors?: BatchDeleteImportDataError[];
}
export const BatchDeleteImportDataResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchDeleteImportDataErrorList) }).pipe(ns),
).annotations({
  identifier: "BatchDeleteImportDataResponse",
}) as any as S.Schema<BatchDeleteImportDataResponse>;
export interface DescribeConfigurationsResponse {
  configurations?: { [key: string]: string }[];
}
export const DescribeConfigurationsResponse = S.suspend(() =>
  S.Struct({
    configurations: S.optional(DescribeConfigurationsAttributes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationsResponse",
}) as any as S.Schema<DescribeConfigurationsResponse>;
export interface DescribeContinuousExportsResponse {
  descriptions?: ContinuousExportDescription[];
  nextToken?: string;
}
export const DescribeContinuousExportsResponse = S.suspend(() =>
  S.Struct({
    descriptions: S.optional(ContinuousExportDescriptions),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeContinuousExportsResponse",
}) as any as S.Schema<DescribeContinuousExportsResponse>;
export interface DescribeExportConfigurationsResponse {
  exportsInfo?: ExportInfo[];
  nextToken?: string;
}
export const DescribeExportConfigurationsResponse = S.suspend(() =>
  S.Struct({
    exportsInfo: S.optional(ExportsInfo),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeExportConfigurationsResponse",
}) as any as S.Schema<DescribeExportConfigurationsResponse>;
export interface DescribeExportTasksResponse {
  exportsInfo?: ExportInfo[];
  nextToken?: string;
}
export const DescribeExportTasksResponse = S.suspend(() =>
  S.Struct({
    exportsInfo: S.optional(ExportsInfo),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeExportTasksResponse",
}) as any as S.Schema<DescribeExportTasksResponse>;
export interface DescribeImportTasksResponse {
  nextToken?: string;
  tasks?: ImportTask[];
}
export const DescribeImportTasksResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    tasks: S.optional(ImportTaskList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImportTasksResponse",
}) as any as S.Schema<DescribeImportTasksResponse>;
export interface ListServerNeighborsResponse {
  neighbors: NeighborConnectionDetail[];
  nextToken?: string;
  knownDependencyCount?: number;
}
export const ListServerNeighborsResponse = S.suspend(() =>
  S.Struct({
    neighbors: NeighborDetailsList,
    nextToken: S.optional(S.String),
    knownDependencyCount: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "ListServerNeighborsResponse",
}) as any as S.Schema<ListServerNeighborsResponse>;
export interface StartDataCollectionByAgentIdsResponse {
  agentsConfigurationStatus?: AgentConfigurationStatus[];
}
export const StartDataCollectionByAgentIdsResponse = S.suspend(() =>
  S.Struct({
    agentsConfigurationStatus: S.optional(AgentConfigurationStatusList),
  }).pipe(ns),
).annotations({
  identifier: "StartDataCollectionByAgentIdsResponse",
}) as any as S.Schema<StartDataCollectionByAgentIdsResponse>;
export interface StartImportTaskResponse {
  task?: ImportTask;
}
export const StartImportTaskResponse = S.suspend(() =>
  S.Struct({ task: S.optional(ImportTask) }).pipe(ns),
).annotations({
  identifier: "StartImportTaskResponse",
}) as any as S.Schema<StartImportTaskResponse>;
export type DeleteAgentErrorCode =
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "AGENT_IN_USE";
export const DeleteAgentErrorCode = S.Literal(
  "NOT_FOUND",
  "INTERNAL_SERVER_ERROR",
  "AGENT_IN_USE",
);
export type AgentStatus =
  | "HEALTHY"
  | "UNHEALTHY"
  | "RUNNING"
  | "UNKNOWN"
  | "BLACKLISTED"
  | "SHUTDOWN";
export const AgentStatus = S.Literal(
  "HEALTHY",
  "UNHEALTHY",
  "RUNNING",
  "UNKNOWN",
  "BLACKLISTED",
  "SHUTDOWN",
);
export interface FailedConfiguration {
  configurationId?: string;
  errorStatusCode?: number;
  errorMessage?: string;
}
export const FailedConfiguration = S.suspend(() =>
  S.Struct({
    configurationId: S.optional(S.String),
    errorStatusCode: S.optional(S.Number),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedConfiguration",
}) as any as S.Schema<FailedConfiguration>;
export type FailedConfigurationList = FailedConfiguration[];
export const FailedConfigurationList = S.Array(FailedConfiguration);
export interface DeletionWarning {
  configurationId?: string;
  warningCode?: number;
  warningText?: string;
}
export const DeletionWarning = S.suspend(() =>
  S.Struct({
    configurationId: S.optional(S.String),
    warningCode: S.optional(S.Number),
    warningText: S.optional(S.String),
  }),
).annotations({
  identifier: "DeletionWarning",
}) as any as S.Schema<DeletionWarning>;
export type DeletionWarningsList = DeletionWarning[];
export const DeletionWarningsList = S.Array(DeletionWarning);
export interface Ec2RecommendationsExportPreferences {
  enabled?: boolean;
  cpuPerformanceMetricBasis?: UsageMetricBasis;
  ramPerformanceMetricBasis?: UsageMetricBasis;
  tenancy?: Tenancy;
  excludedInstanceTypes?: string[];
  preferredRegion?: string;
  reservedInstanceOptions?: ReservedInstanceOptions;
}
export const Ec2RecommendationsExportPreferences = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    cpuPerformanceMetricBasis: S.optional(UsageMetricBasis),
    ramPerformanceMetricBasis: S.optional(UsageMetricBasis),
    tenancy: S.optional(Tenancy),
    excludedInstanceTypes: S.optional(ExcludedInstanceTypes),
    preferredRegion: S.optional(S.String),
    reservedInstanceOptions: S.optional(ReservedInstanceOptions),
  }),
).annotations({
  identifier: "Ec2RecommendationsExportPreferences",
}) as any as S.Schema<Ec2RecommendationsExportPreferences>;
export interface BatchDeleteAgentError {
  agentId: string;
  errorMessage: string;
  errorCode: DeleteAgentErrorCode;
}
export const BatchDeleteAgentError = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    errorMessage: S.String,
    errorCode: DeleteAgentErrorCode,
  }),
).annotations({
  identifier: "BatchDeleteAgentError",
}) as any as S.Schema<BatchDeleteAgentError>;
export type BatchDeleteAgentErrors = BatchDeleteAgentError[];
export const BatchDeleteAgentErrors = S.Array(BatchDeleteAgentError);
export interface BatchDeleteConfigurationTask {
  taskId?: string;
  status?: BatchDeleteConfigurationTaskStatus;
  startTime?: Date;
  endTime?: Date;
  configurationType?: DeletionConfigurationItemType;
  requestedConfigurations?: string[];
  deletedConfigurations?: string[];
  failedConfigurations?: FailedConfiguration[];
  deletionWarnings?: DeletionWarning[];
}
export const BatchDeleteConfigurationTask = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    status: S.optional(BatchDeleteConfigurationTaskStatus),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    configurationType: S.optional(DeletionConfigurationItemType),
    requestedConfigurations: S.optional(ConfigurationIdList),
    deletedConfigurations: S.optional(ConfigurationIdList),
    failedConfigurations: S.optional(FailedConfigurationList),
    deletionWarnings: S.optional(DeletionWarningsList),
  }),
).annotations({
  identifier: "BatchDeleteConfigurationTask",
}) as any as S.Schema<BatchDeleteConfigurationTask>;
export interface ConfigurationTag {
  configurationType?: ConfigurationItemType;
  configurationId?: string;
  key?: string;
  value?: string;
  timeOfCreation?: Date;
}
export const ConfigurationTag = S.suspend(() =>
  S.Struct({
    configurationType: S.optional(ConfigurationItemType),
    configurationId: S.optional(S.String),
    key: S.optional(S.String),
    value: S.optional(S.String),
    timeOfCreation: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConfigurationTag",
}) as any as S.Schema<ConfigurationTag>;
export type ConfigurationTagSet = ConfigurationTag[];
export const ConfigurationTagSet = S.Array(
  ConfigurationTag.pipe(T.XmlName("item")).annotations({
    identifier: "ConfigurationTag",
  }),
);
export type Configuration = { [key: string]: string };
export const Configuration = S.Record({ key: S.String, value: S.String });
export type Configurations = { [key: string]: string }[];
export const Configurations = S.Array(Configuration);
export type ExportPreferences = {
  ec2RecommendationsPreferences: Ec2RecommendationsExportPreferences;
};
export const ExportPreferences = S.Union(
  S.Struct({
    ec2RecommendationsPreferences: Ec2RecommendationsExportPreferences,
  }),
);
export interface BatchDeleteAgentsResponse {
  errors?: BatchDeleteAgentError[];
}
export const BatchDeleteAgentsResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchDeleteAgentErrors) }).pipe(ns),
).annotations({
  identifier: "BatchDeleteAgentsResponse",
}) as any as S.Schema<BatchDeleteAgentsResponse>;
export interface DescribeBatchDeleteConfigurationTaskResponse {
  task?: BatchDeleteConfigurationTask;
}
export const DescribeBatchDeleteConfigurationTaskResponse = S.suspend(() =>
  S.Struct({ task: S.optional(BatchDeleteConfigurationTask) }).pipe(ns),
).annotations({
  identifier: "DescribeBatchDeleteConfigurationTaskResponse",
}) as any as S.Schema<DescribeBatchDeleteConfigurationTaskResponse>;
export interface DescribeTagsResponse {
  tags?: ConfigurationTag[];
  nextToken?: string;
}
export const DescribeTagsResponse = S.suspend(() =>
  S.Struct({
    tags: S.optional(ConfigurationTagSet),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTagsResponse",
}) as any as S.Schema<DescribeTagsResponse>;
export interface ListConfigurationsResponse {
  configurations?: { [key: string]: string }[];
  nextToken?: string;
}
export const ListConfigurationsResponse = S.suspend(() =>
  S.Struct({
    configurations: S.optional(Configurations),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConfigurationsResponse",
}) as any as S.Schema<ListConfigurationsResponse>;
export interface StartExportTaskRequest {
  exportDataFormat?: ExportDataFormat[];
  filters?: ExportFilter[];
  startTime?: Date;
  endTime?: Date;
  preferences?: ExportPreferences;
}
export const StartExportTaskRequest = S.suspend(() =>
  S.Struct({
    exportDataFormat: S.optional(ExportDataFormats),
    filters: S.optional(ExportFilters),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    preferences: S.optional(ExportPreferences),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartExportTaskRequest",
}) as any as S.Schema<StartExportTaskRequest>;
export interface AgentNetworkInfo {
  ipAddress?: string;
  macAddress?: string;
}
export const AgentNetworkInfo = S.suspend(() =>
  S.Struct({
    ipAddress: S.optional(S.String),
    macAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "AgentNetworkInfo",
}) as any as S.Schema<AgentNetworkInfo>;
export type AgentNetworkInfoList = AgentNetworkInfo[];
export const AgentNetworkInfoList = S.Array(AgentNetworkInfo);
export interface AgentInfo {
  agentId?: string;
  hostName?: string;
  agentNetworkInfoList?: AgentNetworkInfo[];
  connectorId?: string;
  version?: string;
  health?: AgentStatus;
  lastHealthPingTime?: string;
  collectionStatus?: string;
  agentType?: string;
  registeredTime?: string;
}
export const AgentInfo = S.suspend(() =>
  S.Struct({
    agentId: S.optional(S.String),
    hostName: S.optional(S.String),
    agentNetworkInfoList: S.optional(AgentNetworkInfoList),
    connectorId: S.optional(S.String),
    version: S.optional(S.String),
    health: S.optional(AgentStatus),
    lastHealthPingTime: S.optional(S.String),
    collectionStatus: S.optional(S.String),
    agentType: S.optional(S.String),
    registeredTime: S.optional(S.String),
  }),
).annotations({ identifier: "AgentInfo" }) as any as S.Schema<AgentInfo>;
export type AgentsInfo = AgentInfo[];
export const AgentsInfo = S.Array(AgentInfo);
export interface DescribeAgentsResponse {
  agentsInfo?: AgentInfo[];
  nextToken?: string;
}
export const DescribeAgentsResponse = S.suspend(() =>
  S.Struct({
    agentsInfo: S.optional(AgentsInfo),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAgentsResponse",
}) as any as S.Schema<DescribeAgentsResponse>;
export interface StartExportTaskResponse {
  exportId?: string;
}
export const StartExportTaskResponse = S.suspend(() =>
  S.Struct({ exportId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartExportTaskResponse",
}) as any as S.Schema<StartExportTaskResponse>;

//# Errors
export class AuthorizationErrorException extends S.TaggedError<AuthorizationErrorException>()(
  "AuthorizationErrorException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class HomeRegionNotSetException extends S.TaggedError<HomeRegionNotSetException>()(
  "HomeRegionNotSetException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictErrorException extends S.TaggedError<ConflictErrorException>()(
  "ConflictErrorException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServerInternalErrorException extends S.TaggedError<ServerInternalErrorException>()(
  "ServerInternalErrorException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Associates one or more configuration items with an application.
 */
export const associateConfigurationItemsToApplication: (
  input: AssociateConfigurationItemsToApplicationRequest,
) => effect.Effect<
  AssociateConfigurationItemsToApplicationResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startExportTask: (
  input: StartExportTaskRequest,
) => effect.Effect<
  StartExportTaskResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | OperationNotPermittedException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTags: {
  (
    input: DescribeTagsRequest,
  ): effect.Effect<
    DescribeTagsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTagsRequest,
  ) => stream.Stream<
    DescribeTagsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTagsRequest,
  ) => stream.Stream<
    ConfigurationTag,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const startImportTask: (
  input: StartImportTaskRequest,
) => effect.Effect<
  StartImportTaskResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ResourceInUseException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startBatchDeleteConfigurationTask: (
  input: StartBatchDeleteConfigurationTaskRequest,
) => effect.Effect<
  StartBatchDeleteConfigurationTaskResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | LimitExceededException
  | OperationNotPermittedException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAgents: {
  (
    input: DescribeAgentsRequest,
  ): effect.Effect<
    DescribeAgentsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAgentsRequest,
  ) => stream.Stream<
    DescribeAgentsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAgentsRequest,
  ) => stream.Stream<
    AgentInfo,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes one or more agents or collectors as specified by ID. Deleting an agent or collector does not
 * delete the previously discovered data.
 * To delete the data collected, use `StartBatchDeleteConfigurationTask`.
 */
export const batchDeleteAgents: (
  input: BatchDeleteAgentsRequest,
) => effect.Effect<
  BatchDeleteAgentsResponse,
  | AuthorizationErrorException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBatchDeleteConfigurationTask: (
  input: DescribeBatchDeleteConfigurationTaskRequest,
) => effect.Effect<
  DescribeBatchDeleteConfigurationTaskResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteImportData: (
  input: BatchDeleteImportDataRequest,
) => effect.Effect<
  BatchDeleteImportDataResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteImportDataRequest,
  output: BatchDeleteImportDataResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
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
export const describeConfigurations: (
  input: DescribeConfigurationsRequest,
) => effect.Effect<
  DescribeConfigurationsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationsRequest,
  output: DescribeConfigurationsResponse,
  errors: [
    AuthorizationErrorException,
    HomeRegionNotSetException,
    InvalidParameterException,
    InvalidParameterValueException,
    ServerInternalErrorException,
  ],
}));
/**
 * Retrieve status of one or more export tasks. You can retrieve the status of up to 100
 * export tasks.
 */
export const describeExportTasks: {
  (
    input: DescribeExportTasksRequest,
  ): effect.Effect<
    DescribeExportTasksResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeExportTasksRequest,
  ) => stream.Stream<
    DescribeExportTasksResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeExportTasksRequest,
  ) => stream.Stream<
    ExportInfo,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeImportTasks: {
  (
    input: DescribeImportTasksRequest,
  ): effect.Effect<
    DescribeImportTasksResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeImportTasksRequest,
  ) => stream.Stream<
    DescribeImportTasksResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeImportTasksRequest,
  ) => stream.Stream<
    ImportTask,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listServerNeighbors: (
  input: ListServerNeighborsRequest,
) => effect.Effect<
  ListServerNeighborsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDataCollectionByAgentIds: (
  input: StartDataCollectionByAgentIdsRequest,
) => effect.Effect<
  StartDataCollectionByAgentIdsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication: (
  input: CreateApplicationRequest,
) => effect.Effect<
  CreateApplicationResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDiscoverySummary: (
  input: GetDiscoverySummaryRequest,
) => effect.Effect<
  GetDiscoverySummaryResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopDataCollectionByAgentIds: (
  input: StopDataCollectionByAgentIdsRequest,
) => effect.Effect<
  StopDataCollectionByAgentIdsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApplications: (
  input: DeleteApplicationsRequest,
) => effect.Effect<
  DeleteApplicationsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateConfigurationItemsFromApplication: (
  input: DisassociateConfigurationItemsFromApplicationRequest,
) => effect.Effect<
  DisassociateConfigurationItemsFromApplicationResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplication: (
  input: UpdateApplicationRequest,
) => effect.Effect<
  UpdateApplicationResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeContinuousExports: {
  (
    input: DescribeContinuousExportsRequest,
  ): effect.Effect<
    DescribeContinuousExportsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeContinuousExportsRequest,
  ) => stream.Stream<
    DescribeContinuousExportsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeContinuousExportsRequest,
  ) => stream.Stream<
    ContinuousExportDescription,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | OperationNotPermittedException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startContinuousExport: (
  input: StartContinuousExportRequest,
) => effect.Effect<
  StartContinuousExportResponse,
  | AuthorizationErrorException
  | ConflictErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | OperationNotPermittedException
  | ResourceInUseException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Stop the continuous flow of agent's discovered data into Amazon Athena.
 */
export const stopContinuousExport: (
  input: StopContinuousExportRequest,
) => effect.Effect<
  StopContinuousExportResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | OperationNotPermittedException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deprecated. Use `StartExportTask` instead.
 *
 * Exports all discovered configuration data to an Amazon S3 bucket or an application that
 * enables you to view and evaluate the data. Data includes tags and tag associations, processes,
 * connections, servers, and system performance. This API returns an export ID that you can query
 * using the *DescribeExportConfigurations* API. The system imposes a limit of
 * two configuration exports in six hours.
 */
export const exportConfigurations: (
  input: ExportConfigurationsRequest,
) => effect.Effect<
  ExportConfigurationsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | OperationNotPermittedException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves a list of configuration items as specified by the value passed to the
 * required parameter `configurationType`. Optional filtering may be applied to refine
 * search results.
 */
export const listConfigurations: {
  (
    input: ListConfigurationsRequest,
  ): effect.Effect<
    ListConfigurationsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationsRequest,
  ) => stream.Stream<
    ListConfigurationsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationsRequest,
  ) => stream.Stream<
    { [key: string]: string },
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * `DescribeExportConfigurations` is deprecated. Use DescribeExportTasks, instead.
 */
export const describeExportConfigurations: {
  (
    input: DescribeExportConfigurationsRequest,
  ): effect.Effect<
    DescribeExportConfigurationsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeExportConfigurationsRequest,
  ) => stream.Stream<
    DescribeExportConfigurationsResponse,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeExportConfigurationsRequest,
  ) => stream.Stream<
    ExportInfo,
    | AuthorizationErrorException
    | HomeRegionNotSetException
    | InvalidParameterException
    | InvalidParameterValueException
    | ResourceNotFoundException
    | ServerInternalErrorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createTags: (
  input: CreateTagsRequest,
) => effect.Effect<
  CreateTagsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTags: (
  input: DeleteTagsRequest,
) => effect.Effect<
  DeleteTagsResponse,
  | AuthorizationErrorException
  | HomeRegionNotSetException
  | InvalidParameterException
  | InvalidParameterValueException
  | ResourceNotFoundException
  | ServerInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

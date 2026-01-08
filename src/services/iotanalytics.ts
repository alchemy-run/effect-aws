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
const svc = T.AwsApiService({
  sdkId: "IoTAnalytics",
  serviceShapeName: "AWSIoTAnalytics",
});
const auth = T.AwsAuthSigv4({ name: "iotanalytics" });
const ver = T.ServiceVersion("2017-11-27");
const proto = T.AwsProtocolsRestJson1();
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
              `https://iotanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://iotanalytics-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://iotanalytics.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://iotanalytics.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ChannelName = string;
export type PipelineName = string;
export type ReprocessingId = string;
export type DatasetName = string;
export type DatasetContentVersion = string;
export type DatastoreName = string;
export type IncludeStatisticsFlag = boolean;
export type NextToken = string;
export type MaxResults = number;
export type ResourceArn = string;
export type MessagePayload = Uint8Array;
export type MaxMessages = number;
export type StartTime = Date;
export type EndTime = Date;
export type TagKey = string;
export type MessageId = string;
export type UnlimitedRetentionPeriod = boolean;
export type RetentionPeriodInDays = number;
export type TagValue = string;
export type DatasetActionName = string;
export type EntryName = string;
export type UnlimitedVersioning = boolean;
export type MaxVersions = number;
export type LateDataRuleName = string;
export type RoleArn = string;
export type LoggingEnabled = boolean;
export type S3PathChannelMessage = string;
export type ErrorMessage = string;
export type LogResult = string;
export type BucketName = string;
export type S3KeyPrefix = string;
export type SqlQuery = string;
export type Image = string;
export type ScheduleExpression = string;
export type ActivityName = string;
export type LambdaName = string;
export type ActivityBatchSize = number;
export type AttributeName = string;
export type FilterExpression = string;
export type MathExpression = string;
export type ChannelArn = string;
export type DatasetArn = string;
export type DatastoreArn = string;
export type PipelineArn = string;
export type PresignedURI = string;
export type Reason = string;
export type VolumeSizeInGB = number;
export type VariableName = string;
export type StringValue = string;
export type DoubleValue = number;
export type IotEventsInputName = string;
export type BucketKeyExpression = string;
export type SessionTimeoutInMinutes = number;
export type PartitionAttributeName = string;
export type TimestampFormat = string;
export type SizeInBytes = number;
export type OffsetSeconds = number;
export type TimeExpression = string;
export type OutputFileName = string;
export type GlueTableName = string;
export type GlueDatabaseName = string;
export type ColumnName = string;
export type ColumnDataType = string;
export type ErrorCode = string;
export type ResourceId = string;
export type ResourceArn2 = string;

//# Schemas
export interface DescribeLoggingOptionsRequest {}
export const DescribeLoggingOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoggingOptionsRequest",
}) as any as S.Schema<DescribeLoggingOptionsRequest>;
export type MessagePayloads = Uint8Array[];
export const MessagePayloads = S.Array(T.Blob);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelPipelineReprocessingRequest {
  pipelineName: string;
  reprocessingId: string;
}
export const CancelPipelineReprocessingRequest = S.suspend(() =>
  S.Struct({
    pipelineName: S.String.pipe(T.HttpLabel("pipelineName")),
    reprocessingId: S.String.pipe(T.HttpLabel("reprocessingId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/pipelines/{pipelineName}/reprocessing/{reprocessingId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelPipelineReprocessingRequest",
}) as any as S.Schema<CancelPipelineReprocessingRequest>;
export interface CancelPipelineReprocessingResponse {}
export const CancelPipelineReprocessingResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelPipelineReprocessingResponse",
}) as any as S.Schema<CancelPipelineReprocessingResponse>;
export interface CreateDatasetContentRequest {
  datasetName: string;
  versionId?: string;
}
export const CreateDatasetContentRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String.pipe(T.HttpLabel("datasetName")),
    versionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets/{datasetName}/content" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatasetContentRequest",
}) as any as S.Schema<CreateDatasetContentRequest>;
export interface DeleteChannelRequest {
  channelName: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ channelName: S.String.pipe(T.HttpLabel("channelName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channels/{channelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelRequest",
}) as any as S.Schema<DeleteChannelRequest>;
export interface DeleteChannelResponse {}
export const DeleteChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteChannelResponse",
}) as any as S.Schema<DeleteChannelResponse>;
export interface DeleteDatasetRequest {
  datasetName: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({ datasetName: S.String.pipe(T.HttpLabel("datasetName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datasets/{datasetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteDatasetResponse {}
export const DeleteDatasetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeleteDatasetContentRequest {
  datasetName: string;
  versionId?: string;
}
export const DeleteDatasetContentRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String.pipe(T.HttpLabel("datasetName")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datasets/{datasetName}/content" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatasetContentRequest",
}) as any as S.Schema<DeleteDatasetContentRequest>;
export interface DeleteDatasetContentResponse {}
export const DeleteDatasetContentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDatasetContentResponse",
}) as any as S.Schema<DeleteDatasetContentResponse>;
export interface DeleteDatastoreRequest {
  datastoreName: string;
}
export const DeleteDatastoreRequest = S.suspend(() =>
  S.Struct({ datastoreName: S.String.pipe(T.HttpLabel("datastoreName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datastores/{datastoreName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatastoreRequest",
}) as any as S.Schema<DeleteDatastoreRequest>;
export interface DeleteDatastoreResponse {}
export const DeleteDatastoreResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDatastoreResponse",
}) as any as S.Schema<DeleteDatastoreResponse>;
export interface DeletePipelineRequest {
  pipelineName: string;
}
export const DeletePipelineRequest = S.suspend(() =>
  S.Struct({ pipelineName: S.String.pipe(T.HttpLabel("pipelineName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/pipelines/{pipelineName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePipelineRequest",
}) as any as S.Schema<DeletePipelineRequest>;
export interface DeletePipelineResponse {}
export const DeletePipelineResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeletePipelineResponse" },
) as any as S.Schema<DeletePipelineResponse>;
export interface DescribeChannelRequest {
  channelName: string;
  includeStatistics?: boolean;
}
export const DescribeChannelRequest = S.suspend(() =>
  S.Struct({
    channelName: S.String.pipe(T.HttpLabel("channelName")),
    includeStatistics: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeStatistics"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{channelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelRequest",
}) as any as S.Schema<DescribeChannelRequest>;
export interface DescribeDatasetRequest {
  datasetName: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ datasetName: S.String.pipe(T.HttpLabel("datasetName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeDatastoreRequest {
  datastoreName: string;
  includeStatistics?: boolean;
}
export const DescribeDatastoreRequest = S.suspend(() =>
  S.Struct({
    datastoreName: S.String.pipe(T.HttpLabel("datastoreName")),
    includeStatistics: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeStatistics"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datastores/{datastoreName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDatastoreRequest",
}) as any as S.Schema<DescribeDatastoreRequest>;
export interface DescribePipelineRequest {
  pipelineName: string;
}
export const DescribePipelineRequest = S.suspend(() =>
  S.Struct({ pipelineName: S.String.pipe(T.HttpLabel("pipelineName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pipelines/{pipelineName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePipelineRequest",
}) as any as S.Schema<DescribePipelineRequest>;
export interface GetDatasetContentRequest {
  datasetName: string;
  versionId?: string;
}
export const GetDatasetContentRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String.pipe(T.HttpLabel("datasetName")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetName}/content" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDatasetContentRequest",
}) as any as S.Schema<GetDatasetContentRequest>;
export interface ListChannelsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsRequest",
}) as any as S.Schema<ListChannelsRequest>;
export interface ListDatasetContentsRequest {
  datasetName: string;
  nextToken?: string;
  maxResults?: number;
  scheduledOnOrAfter?: Date;
  scheduledBefore?: Date;
}
export const ListDatasetContentsRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String.pipe(T.HttpLabel("datasetName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    scheduledOnOrAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("scheduledOnOrAfter")),
    scheduledBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("scheduledBefore")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{datasetName}/contents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatasetContentsRequest",
}) as any as S.Schema<ListDatasetContentsRequest>;
export interface ListDatasetsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListDatastoresRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDatastoresRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datastores" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatastoresRequest",
}) as any as S.Schema<ListDatastoresRequest>;
export interface ListPipelinesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListPipelinesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pipelines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPipelinesRequest",
}) as any as S.Schema<ListPipelinesRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type LoggingLevel = "ERROR";
export const LoggingLevel = S.Literal("ERROR");
export interface LoggingOptions {
  roleArn: string;
  level: LoggingLevel;
  enabled: boolean;
}
export const LoggingOptions = S.suspend(() =>
  S.Struct({ roleArn: S.String, level: LoggingLevel, enabled: S.Boolean }),
).annotations({
  identifier: "LoggingOptions",
}) as any as S.Schema<LoggingOptions>;
export interface PutLoggingOptionsRequest {
  loggingOptions: LoggingOptions;
}
export const PutLoggingOptionsRequest = S.suspend(() =>
  S.Struct({ loggingOptions: LoggingOptions }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/logging" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLoggingOptionsRequest",
}) as any as S.Schema<PutLoggingOptionsRequest>;
export interface PutLoggingOptionsResponse {}
export const PutLoggingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutLoggingOptionsResponse",
}) as any as S.Schema<PutLoggingOptionsResponse>;
export interface ChannelActivity {
  name: string;
  channelName: string;
  next?: string;
}
export const ChannelActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    channelName: S.String,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelActivity",
}) as any as S.Schema<ChannelActivity>;
export interface LambdaActivity {
  name: string;
  lambdaName: string;
  batchSize: number;
  next?: string;
}
export const LambdaActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    lambdaName: S.String,
    batchSize: S.Number,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaActivity",
}) as any as S.Schema<LambdaActivity>;
export interface DatastoreActivity {
  name: string;
  datastoreName: string;
}
export const DatastoreActivity = S.suspend(() =>
  S.Struct({ name: S.String, datastoreName: S.String }),
).annotations({
  identifier: "DatastoreActivity",
}) as any as S.Schema<DatastoreActivity>;
export type AttributeNameMapping = { [key: string]: string };
export const AttributeNameMapping = S.Record({
  key: S.String,
  value: S.String,
});
export interface AddAttributesActivity {
  name: string;
  attributes: { [key: string]: string };
  next?: string;
}
export const AddAttributesActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attributes: AttributeNameMapping,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "AddAttributesActivity",
}) as any as S.Schema<AddAttributesActivity>;
export type AttributeNames = string[];
export const AttributeNames = S.Array(S.String);
export interface RemoveAttributesActivity {
  name: string;
  attributes: string[];
  next?: string;
}
export const RemoveAttributesActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attributes: AttributeNames,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "RemoveAttributesActivity",
}) as any as S.Schema<RemoveAttributesActivity>;
export interface SelectAttributesActivity {
  name: string;
  attributes: string[];
  next?: string;
}
export const SelectAttributesActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attributes: AttributeNames,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "SelectAttributesActivity",
}) as any as S.Schema<SelectAttributesActivity>;
export interface FilterActivity {
  name: string;
  filter: string;
  next?: string;
}
export const FilterActivity = S.suspend(() =>
  S.Struct({ name: S.String, filter: S.String, next: S.optional(S.String) }),
).annotations({
  identifier: "FilterActivity",
}) as any as S.Schema<FilterActivity>;
export interface MathActivity {
  name: string;
  attribute: string;
  math: string;
  next?: string;
}
export const MathActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attribute: S.String,
    math: S.String,
    next: S.optional(S.String),
  }),
).annotations({ identifier: "MathActivity" }) as any as S.Schema<MathActivity>;
export interface DeviceRegistryEnrichActivity {
  name: string;
  attribute: string;
  thingName: string;
  roleArn: string;
  next?: string;
}
export const DeviceRegistryEnrichActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attribute: S.String,
    thingName: S.String,
    roleArn: S.String,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceRegistryEnrichActivity",
}) as any as S.Schema<DeviceRegistryEnrichActivity>;
export interface DeviceShadowEnrichActivity {
  name: string;
  attribute: string;
  thingName: string;
  roleArn: string;
  next?: string;
}
export const DeviceShadowEnrichActivity = S.suspend(() =>
  S.Struct({
    name: S.String,
    attribute: S.String,
    thingName: S.String,
    roleArn: S.String,
    next: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceShadowEnrichActivity",
}) as any as S.Schema<DeviceShadowEnrichActivity>;
export interface PipelineActivity {
  channel?: ChannelActivity;
  lambda?: LambdaActivity;
  datastore?: DatastoreActivity;
  addAttributes?: AddAttributesActivity;
  removeAttributes?: RemoveAttributesActivity;
  selectAttributes?: SelectAttributesActivity;
  filter?: FilterActivity;
  math?: MathActivity;
  deviceRegistryEnrich?: DeviceRegistryEnrichActivity;
  deviceShadowEnrich?: DeviceShadowEnrichActivity;
}
export const PipelineActivity = S.suspend(() =>
  S.Struct({
    channel: S.optional(ChannelActivity),
    lambda: S.optional(LambdaActivity),
    datastore: S.optional(DatastoreActivity),
    addAttributes: S.optional(AddAttributesActivity),
    removeAttributes: S.optional(RemoveAttributesActivity),
    selectAttributes: S.optional(SelectAttributesActivity),
    filter: S.optional(FilterActivity),
    math: S.optional(MathActivity),
    deviceRegistryEnrich: S.optional(DeviceRegistryEnrichActivity),
    deviceShadowEnrich: S.optional(DeviceShadowEnrichActivity),
  }),
).annotations({
  identifier: "PipelineActivity",
}) as any as S.Schema<PipelineActivity>;
export interface RunPipelineActivityRequest {
  pipelineActivity: PipelineActivity;
  payloads: Uint8Array[];
}
export const RunPipelineActivityRequest = S.suspend(() =>
  S.Struct({
    pipelineActivity: PipelineActivity,
    payloads: MessagePayloads,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pipelineactivities/run" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RunPipelineActivityRequest",
}) as any as S.Schema<RunPipelineActivityRequest>;
export interface SampleChannelDataRequest {
  channelName: string;
  maxMessages?: number;
  startTime?: Date;
  endTime?: Date;
}
export const SampleChannelDataRequest = S.suspend(() =>
  S.Struct({
    channelName: S.String.pipe(T.HttpLabel("channelName")),
    maxMessages: S.optional(S.Number).pipe(T.HttpQuery("maxMessages")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("startTime"),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("endTime"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{channelName}/sample" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SampleChannelDataRequest",
}) as any as S.Schema<SampleChannelDataRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface ServiceManagedChannelS3Storage {}
export const ServiceManagedChannelS3Storage = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ServiceManagedChannelS3Storage",
}) as any as S.Schema<ServiceManagedChannelS3Storage>;
export interface CustomerManagedChannelS3Storage {
  bucket: string;
  keyPrefix?: string;
  roleArn: string;
}
export const CustomerManagedChannelS3Storage = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    keyPrefix: S.optional(S.String),
    roleArn: S.String,
  }),
).annotations({
  identifier: "CustomerManagedChannelS3Storage",
}) as any as S.Schema<CustomerManagedChannelS3Storage>;
export interface ChannelStorage {
  serviceManagedS3?: ServiceManagedChannelS3Storage;
  customerManagedS3?: CustomerManagedChannelS3Storage;
}
export const ChannelStorage = S.suspend(() =>
  S.Struct({
    serviceManagedS3: S.optional(ServiceManagedChannelS3Storage),
    customerManagedS3: S.optional(CustomerManagedChannelS3Storage),
  }),
).annotations({
  identifier: "ChannelStorage",
}) as any as S.Schema<ChannelStorage>;
export interface RetentionPeriod {
  unlimited?: boolean;
  numberOfDays?: number;
}
export const RetentionPeriod = S.suspend(() =>
  S.Struct({
    unlimited: S.optional(S.Boolean),
    numberOfDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "RetentionPeriod",
}) as any as S.Schema<RetentionPeriod>;
export interface UpdateChannelRequest {
  channelName: string;
  channelStorage?: ChannelStorage;
  retentionPeriod?: RetentionPeriod;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    channelName: S.String.pipe(T.HttpLabel("channelName")),
    channelStorage: S.optional(ChannelStorage),
    retentionPeriod: S.optional(RetentionPeriod),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{channelName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelRequest",
}) as any as S.Schema<UpdateChannelRequest>;
export interface UpdateChannelResponse {}
export const UpdateChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface DeltaTime {
  offsetSeconds: number;
  timeExpression: string;
}
export const DeltaTime = S.suspend(() =>
  S.Struct({ offsetSeconds: S.Number, timeExpression: S.String }),
).annotations({ identifier: "DeltaTime" }) as any as S.Schema<DeltaTime>;
export interface QueryFilter {
  deltaTime?: DeltaTime;
}
export const QueryFilter = S.suspend(() =>
  S.Struct({ deltaTime: S.optional(DeltaTime) }),
).annotations({ identifier: "QueryFilter" }) as any as S.Schema<QueryFilter>;
export type QueryFilters = QueryFilter[];
export const QueryFilters = S.Array(QueryFilter);
export interface SqlQueryDatasetAction {
  sqlQuery: string;
  filters?: QueryFilter[];
}
export const SqlQueryDatasetAction = S.suspend(() =>
  S.Struct({ sqlQuery: S.String, filters: S.optional(QueryFilters) }),
).annotations({
  identifier: "SqlQueryDatasetAction",
}) as any as S.Schema<SqlQueryDatasetAction>;
export type ComputeType = "ACU_1" | "ACU_2";
export const ComputeType = S.Literal("ACU_1", "ACU_2");
export interface ResourceConfiguration {
  computeType: ComputeType;
  volumeSizeInGB: number;
}
export const ResourceConfiguration = S.suspend(() =>
  S.Struct({ computeType: ComputeType, volumeSizeInGB: S.Number }),
).annotations({
  identifier: "ResourceConfiguration",
}) as any as S.Schema<ResourceConfiguration>;
export interface DatasetContentVersionValue {
  datasetName: string;
}
export const DatasetContentVersionValue = S.suspend(() =>
  S.Struct({ datasetName: S.String }),
).annotations({
  identifier: "DatasetContentVersionValue",
}) as any as S.Schema<DatasetContentVersionValue>;
export interface OutputFileUriValue {
  fileName: string;
}
export const OutputFileUriValue = S.suspend(() =>
  S.Struct({ fileName: S.String }),
).annotations({
  identifier: "OutputFileUriValue",
}) as any as S.Schema<OutputFileUriValue>;
export interface Variable {
  name: string;
  stringValue?: string;
  doubleValue?: number;
  datasetContentVersionValue?: DatasetContentVersionValue;
  outputFileUriValue?: OutputFileUriValue;
}
export const Variable = S.suspend(() =>
  S.Struct({
    name: S.String,
    stringValue: S.optional(S.String),
    doubleValue: S.optional(S.Number),
    datasetContentVersionValue: S.optional(DatasetContentVersionValue),
    outputFileUriValue: S.optional(OutputFileUriValue),
  }),
).annotations({ identifier: "Variable" }) as any as S.Schema<Variable>;
export type Variables = Variable[];
export const Variables = S.Array(Variable);
export interface ContainerDatasetAction {
  image: string;
  executionRoleArn: string;
  resourceConfiguration: ResourceConfiguration;
  variables?: Variable[];
}
export const ContainerDatasetAction = S.suspend(() =>
  S.Struct({
    image: S.String,
    executionRoleArn: S.String,
    resourceConfiguration: ResourceConfiguration,
    variables: S.optional(Variables),
  }),
).annotations({
  identifier: "ContainerDatasetAction",
}) as any as S.Schema<ContainerDatasetAction>;
export interface DatasetAction {
  actionName?: string;
  queryAction?: SqlQueryDatasetAction;
  containerAction?: ContainerDatasetAction;
}
export const DatasetAction = S.suspend(() =>
  S.Struct({
    actionName: S.optional(S.String),
    queryAction: S.optional(SqlQueryDatasetAction),
    containerAction: S.optional(ContainerDatasetAction),
  }),
).annotations({
  identifier: "DatasetAction",
}) as any as S.Schema<DatasetAction>;
export type DatasetActions = DatasetAction[];
export const DatasetActions = S.Array(DatasetAction);
export interface Schedule {
  expression?: string;
}
export const Schedule = S.suspend(() =>
  S.Struct({ expression: S.optional(S.String) }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export interface TriggeringDataset {
  name: string;
}
export const TriggeringDataset = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "TriggeringDataset",
}) as any as S.Schema<TriggeringDataset>;
export interface DatasetTrigger {
  schedule?: Schedule;
  dataset?: TriggeringDataset;
}
export const DatasetTrigger = S.suspend(() =>
  S.Struct({
    schedule: S.optional(Schedule),
    dataset: S.optional(TriggeringDataset),
  }),
).annotations({
  identifier: "DatasetTrigger",
}) as any as S.Schema<DatasetTrigger>;
export type DatasetTriggers = DatasetTrigger[];
export const DatasetTriggers = S.Array(DatasetTrigger);
export interface IotEventsDestinationConfiguration {
  inputName: string;
  roleArn: string;
}
export const IotEventsDestinationConfiguration = S.suspend(() =>
  S.Struct({ inputName: S.String, roleArn: S.String }),
).annotations({
  identifier: "IotEventsDestinationConfiguration",
}) as any as S.Schema<IotEventsDestinationConfiguration>;
export interface GlueConfiguration {
  tableName: string;
  databaseName: string;
}
export const GlueConfiguration = S.suspend(() =>
  S.Struct({ tableName: S.String, databaseName: S.String }),
).annotations({
  identifier: "GlueConfiguration",
}) as any as S.Schema<GlueConfiguration>;
export interface S3DestinationConfiguration {
  bucket: string;
  key: string;
  glueConfiguration?: GlueConfiguration;
  roleArn: string;
}
export const S3DestinationConfiguration = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    key: S.String,
    glueConfiguration: S.optional(GlueConfiguration),
    roleArn: S.String,
  }),
).annotations({
  identifier: "S3DestinationConfiguration",
}) as any as S.Schema<S3DestinationConfiguration>;
export interface DatasetContentDeliveryDestination {
  iotEventsDestinationConfiguration?: IotEventsDestinationConfiguration;
  s3DestinationConfiguration?: S3DestinationConfiguration;
}
export const DatasetContentDeliveryDestination = S.suspend(() =>
  S.Struct({
    iotEventsDestinationConfiguration: S.optional(
      IotEventsDestinationConfiguration,
    ),
    s3DestinationConfiguration: S.optional(S3DestinationConfiguration),
  }),
).annotations({
  identifier: "DatasetContentDeliveryDestination",
}) as any as S.Schema<DatasetContentDeliveryDestination>;
export interface DatasetContentDeliveryRule {
  entryName?: string;
  destination: DatasetContentDeliveryDestination;
}
export const DatasetContentDeliveryRule = S.suspend(() =>
  S.Struct({
    entryName: S.optional(S.String),
    destination: DatasetContentDeliveryDestination,
  }),
).annotations({
  identifier: "DatasetContentDeliveryRule",
}) as any as S.Schema<DatasetContentDeliveryRule>;
export type DatasetContentDeliveryRules = DatasetContentDeliveryRule[];
export const DatasetContentDeliveryRules = S.Array(DatasetContentDeliveryRule);
export interface VersioningConfiguration {
  unlimited?: boolean;
  maxVersions?: number;
}
export const VersioningConfiguration = S.suspend(() =>
  S.Struct({
    unlimited: S.optional(S.Boolean),
    maxVersions: S.optional(S.Number),
  }),
).annotations({
  identifier: "VersioningConfiguration",
}) as any as S.Schema<VersioningConfiguration>;
export interface DeltaTimeSessionWindowConfiguration {
  timeoutInMinutes: number;
}
export const DeltaTimeSessionWindowConfiguration = S.suspend(() =>
  S.Struct({ timeoutInMinutes: S.Number }),
).annotations({
  identifier: "DeltaTimeSessionWindowConfiguration",
}) as any as S.Schema<DeltaTimeSessionWindowConfiguration>;
export interface LateDataRuleConfiguration {
  deltaTimeSessionWindowConfiguration?: DeltaTimeSessionWindowConfiguration;
}
export const LateDataRuleConfiguration = S.suspend(() =>
  S.Struct({
    deltaTimeSessionWindowConfiguration: S.optional(
      DeltaTimeSessionWindowConfiguration,
    ),
  }),
).annotations({
  identifier: "LateDataRuleConfiguration",
}) as any as S.Schema<LateDataRuleConfiguration>;
export interface LateDataRule {
  ruleName?: string;
  ruleConfiguration: LateDataRuleConfiguration;
}
export const LateDataRule = S.suspend(() =>
  S.Struct({
    ruleName: S.optional(S.String),
    ruleConfiguration: LateDataRuleConfiguration,
  }),
).annotations({ identifier: "LateDataRule" }) as any as S.Schema<LateDataRule>;
export type LateDataRules = LateDataRule[];
export const LateDataRules = S.Array(LateDataRule);
export interface UpdateDatasetRequest {
  datasetName: string;
  actions: DatasetAction[];
  triggers?: DatasetTrigger[];
  contentDeliveryRules?: DatasetContentDeliveryRule[];
  retentionPeriod?: RetentionPeriod;
  versioningConfiguration?: VersioningConfiguration;
  lateDataRules?: LateDataRule[];
}
export const UpdateDatasetRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String.pipe(T.HttpLabel("datasetName")),
    actions: DatasetActions,
    triggers: S.optional(DatasetTriggers),
    contentDeliveryRules: S.optional(DatasetContentDeliveryRules),
    retentionPeriod: S.optional(RetentionPeriod),
    versioningConfiguration: S.optional(VersioningConfiguration),
    lateDataRules: S.optional(LateDataRules),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/datasets/{datasetName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDatasetRequest",
}) as any as S.Schema<UpdateDatasetRequest>;
export interface UpdateDatasetResponse {}
export const UpdateDatasetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateDatasetResponse",
}) as any as S.Schema<UpdateDatasetResponse>;
export interface ServiceManagedDatastoreS3Storage {}
export const ServiceManagedDatastoreS3Storage = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ServiceManagedDatastoreS3Storage",
}) as any as S.Schema<ServiceManagedDatastoreS3Storage>;
export interface CustomerManagedDatastoreS3Storage {
  bucket: string;
  keyPrefix?: string;
  roleArn: string;
}
export const CustomerManagedDatastoreS3Storage = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    keyPrefix: S.optional(S.String),
    roleArn: S.String,
  }),
).annotations({
  identifier: "CustomerManagedDatastoreS3Storage",
}) as any as S.Schema<CustomerManagedDatastoreS3Storage>;
export interface IotSiteWiseCustomerManagedDatastoreS3Storage {
  bucket: string;
  keyPrefix?: string;
}
export const IotSiteWiseCustomerManagedDatastoreS3Storage = S.suspend(() =>
  S.Struct({ bucket: S.String, keyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "IotSiteWiseCustomerManagedDatastoreS3Storage",
}) as any as S.Schema<IotSiteWiseCustomerManagedDatastoreS3Storage>;
export interface DatastoreIotSiteWiseMultiLayerStorage {
  customerManagedS3Storage: IotSiteWiseCustomerManagedDatastoreS3Storage;
}
export const DatastoreIotSiteWiseMultiLayerStorage = S.suspend(() =>
  S.Struct({
    customerManagedS3Storage: IotSiteWiseCustomerManagedDatastoreS3Storage,
  }),
).annotations({
  identifier: "DatastoreIotSiteWiseMultiLayerStorage",
}) as any as S.Schema<DatastoreIotSiteWiseMultiLayerStorage>;
export type DatastoreStorage =
  | { serviceManagedS3: ServiceManagedDatastoreS3Storage }
  | { customerManagedS3: CustomerManagedDatastoreS3Storage }
  | { iotSiteWiseMultiLayerStorage: DatastoreIotSiteWiseMultiLayerStorage };
export const DatastoreStorage = S.Union(
  S.Struct({ serviceManagedS3: ServiceManagedDatastoreS3Storage }),
  S.Struct({ customerManagedS3: CustomerManagedDatastoreS3Storage }),
  S.Struct({
    iotSiteWiseMultiLayerStorage: DatastoreIotSiteWiseMultiLayerStorage,
  }),
);
export interface JsonConfiguration {}
export const JsonConfiguration = S.suspend(() => S.Struct({})).annotations({
  identifier: "JsonConfiguration",
}) as any as S.Schema<JsonConfiguration>;
export interface Column {
  name: string;
  type: string;
}
export const Column = S.suspend(() =>
  S.Struct({ name: S.String, type: S.String }),
).annotations({ identifier: "Column" }) as any as S.Schema<Column>;
export type Columns = Column[];
export const Columns = S.Array(Column);
export interface SchemaDefinition {
  columns?: Column[];
}
export const SchemaDefinition = S.suspend(() =>
  S.Struct({ columns: S.optional(Columns) }),
).annotations({
  identifier: "SchemaDefinition",
}) as any as S.Schema<SchemaDefinition>;
export interface ParquetConfiguration {
  schemaDefinition?: SchemaDefinition;
}
export const ParquetConfiguration = S.suspend(() =>
  S.Struct({ schemaDefinition: S.optional(SchemaDefinition) }),
).annotations({
  identifier: "ParquetConfiguration",
}) as any as S.Schema<ParquetConfiguration>;
export interface FileFormatConfiguration {
  jsonConfiguration?: JsonConfiguration;
  parquetConfiguration?: ParquetConfiguration;
}
export const FileFormatConfiguration = S.suspend(() =>
  S.Struct({
    jsonConfiguration: S.optional(JsonConfiguration),
    parquetConfiguration: S.optional(ParquetConfiguration),
  }),
).annotations({
  identifier: "FileFormatConfiguration",
}) as any as S.Schema<FileFormatConfiguration>;
export interface UpdateDatastoreRequest {
  datastoreName: string;
  retentionPeriod?: RetentionPeriod;
  datastoreStorage?: DatastoreStorage;
  fileFormatConfiguration?: FileFormatConfiguration;
}
export const UpdateDatastoreRequest = S.suspend(() =>
  S.Struct({
    datastoreName: S.String.pipe(T.HttpLabel("datastoreName")),
    retentionPeriod: S.optional(RetentionPeriod),
    datastoreStorage: S.optional(DatastoreStorage),
    fileFormatConfiguration: S.optional(FileFormatConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/datastores/{datastoreName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDatastoreRequest",
}) as any as S.Schema<UpdateDatastoreRequest>;
export interface UpdateDatastoreResponse {}
export const UpdateDatastoreResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDatastoreResponse",
}) as any as S.Schema<UpdateDatastoreResponse>;
export type PipelineActivities = PipelineActivity[];
export const PipelineActivities = S.Array(PipelineActivity);
export interface UpdatePipelineRequest {
  pipelineName: string;
  pipelineActivities: PipelineActivity[];
}
export const UpdatePipelineRequest = S.suspend(() =>
  S.Struct({
    pipelineName: S.String.pipe(T.HttpLabel("pipelineName")),
    pipelineActivities: PipelineActivities,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/pipelines/{pipelineName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePipelineRequest",
}) as any as S.Schema<UpdatePipelineRequest>;
export interface UpdatePipelineResponse {}
export const UpdatePipelineResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdatePipelineResponse" },
) as any as S.Schema<UpdatePipelineResponse>;
export type S3PathChannelMessages = string[];
export const S3PathChannelMessages = S.Array(S.String);
export interface Message {
  messageId: string;
  payload: Uint8Array;
}
export const Message = S.suspend(() =>
  S.Struct({ messageId: S.String, payload: T.Blob }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export type Messages = Message[];
export const Messages = S.Array(Message);
export interface ChannelMessages {
  s3Paths?: string[];
}
export const ChannelMessages = S.suspend(() =>
  S.Struct({ s3Paths: S.optional(S3PathChannelMessages) }),
).annotations({
  identifier: "ChannelMessages",
}) as any as S.Schema<ChannelMessages>;
export interface BatchPutMessageRequest {
  channelName: string;
  messages: Message[];
}
export const BatchPutMessageRequest = S.suspend(() =>
  S.Struct({ channelName: S.String, messages: Messages }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/messages/batch" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutMessageRequest",
}) as any as S.Schema<BatchPutMessageRequest>;
export interface CreateDatasetContentResponse {
  versionId?: string;
}
export const CreateDatasetContentResponse = S.suspend(() =>
  S.Struct({ versionId: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetContentResponse",
}) as any as S.Schema<CreateDatasetContentResponse>;
export interface DescribeLoggingOptionsResponse {
  loggingOptions?: LoggingOptions;
}
export const DescribeLoggingOptionsResponse = S.suspend(() =>
  S.Struct({ loggingOptions: S.optional(LoggingOptions) }),
).annotations({
  identifier: "DescribeLoggingOptionsResponse",
}) as any as S.Schema<DescribeLoggingOptionsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RunPipelineActivityResponse {
  payloads?: Uint8Array[];
  logResult?: string;
}
export const RunPipelineActivityResponse = S.suspend(() =>
  S.Struct({
    payloads: S.optional(MessagePayloads),
    logResult: S.optional(S.String),
  }),
).annotations({
  identifier: "RunPipelineActivityResponse",
}) as any as S.Schema<RunPipelineActivityResponse>;
export interface SampleChannelDataResponse {
  payloads?: Uint8Array[];
}
export const SampleChannelDataResponse = S.suspend(() =>
  S.Struct({ payloads: S.optional(MessagePayloads) }),
).annotations({
  identifier: "SampleChannelDataResponse",
}) as any as S.Schema<SampleChannelDataResponse>;
export interface StartPipelineReprocessingRequest {
  pipelineName: string;
  startTime?: Date;
  endTime?: Date;
  channelMessages?: ChannelMessages;
}
export const StartPipelineReprocessingRequest = S.suspend(() =>
  S.Struct({
    pipelineName: S.String.pipe(T.HttpLabel("pipelineName")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    channelMessages: S.optional(ChannelMessages),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pipelines/{pipelineName}/reprocessing" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartPipelineReprocessingRequest",
}) as any as S.Schema<StartPipelineReprocessingRequest>;
export type ChannelStatus = "CREATING" | "ACTIVE" | "DELETING";
export const ChannelStatus = S.Literal("CREATING", "ACTIVE", "DELETING");
export type DatasetStatus = "CREATING" | "ACTIVE" | "DELETING";
export const DatasetStatus = S.Literal("CREATING", "ACTIVE", "DELETING");
export type DatastoreStatus = "CREATING" | "ACTIVE" | "DELETING";
export const DatastoreStatus = S.Literal("CREATING", "ACTIVE", "DELETING");
export type DatasetContentState = "CREATING" | "SUCCEEDED" | "FAILED";
export const DatasetContentState = S.Literal("CREATING", "SUCCEEDED", "FAILED");
export type FileFormatType = "JSON" | "PARQUET";
export const FileFormatType = S.Literal("JSON", "PARQUET");
export interface Channel {
  name?: string;
  storage?: ChannelStorage;
  arn?: string;
  status?: ChannelStatus;
  retentionPeriod?: RetentionPeriod;
  creationTime?: Date;
  lastUpdateTime?: Date;
  lastMessageArrivalTime?: Date;
}
export const Channel = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    storage: S.optional(ChannelStorage),
    arn: S.optional(S.String),
    status: S.optional(ChannelStatus),
    retentionPeriod: S.optional(RetentionPeriod),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastMessageArrivalTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export interface Dataset {
  name?: string;
  arn?: string;
  actions?: DatasetAction[];
  triggers?: DatasetTrigger[];
  contentDeliveryRules?: DatasetContentDeliveryRule[];
  status?: DatasetStatus;
  creationTime?: Date;
  lastUpdateTime?: Date;
  retentionPeriod?: RetentionPeriod;
  versioningConfiguration?: VersioningConfiguration;
  lateDataRules?: LateDataRule[];
}
export const Dataset = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    actions: S.optional(DatasetActions),
    triggers: S.optional(DatasetTriggers),
    contentDeliveryRules: S.optional(DatasetContentDeliveryRules),
    status: S.optional(DatasetStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    retentionPeriod: S.optional(RetentionPeriod),
    versioningConfiguration: S.optional(VersioningConfiguration),
    lateDataRules: S.optional(LateDataRules),
  }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export interface Partition {
  attributeName: string;
}
export const Partition = S.suspend(() =>
  S.Struct({ attributeName: S.String }),
).annotations({ identifier: "Partition" }) as any as S.Schema<Partition>;
export interface TimestampPartition {
  attributeName: string;
  timestampFormat?: string;
}
export const TimestampPartition = S.suspend(() =>
  S.Struct({ attributeName: S.String, timestampFormat: S.optional(S.String) }),
).annotations({
  identifier: "TimestampPartition",
}) as any as S.Schema<TimestampPartition>;
export interface DatastorePartition {
  attributePartition?: Partition;
  timestampPartition?: TimestampPartition;
}
export const DatastorePartition = S.suspend(() =>
  S.Struct({
    attributePartition: S.optional(Partition),
    timestampPartition: S.optional(TimestampPartition),
  }),
).annotations({
  identifier: "DatastorePartition",
}) as any as S.Schema<DatastorePartition>;
export type Partitions = DatastorePartition[];
export const Partitions = S.Array(DatastorePartition);
export interface DatastorePartitions {
  partitions?: DatastorePartition[];
}
export const DatastorePartitions = S.suspend(() =>
  S.Struct({ partitions: S.optional(Partitions) }),
).annotations({
  identifier: "DatastorePartitions",
}) as any as S.Schema<DatastorePartitions>;
export interface Datastore {
  name?: string;
  storage?: DatastoreStorage;
  arn?: string;
  status?: DatastoreStatus;
  retentionPeriod?: RetentionPeriod;
  creationTime?: Date;
  lastUpdateTime?: Date;
  lastMessageArrivalTime?: Date;
  fileFormatConfiguration?: FileFormatConfiguration;
  datastorePartitions?: DatastorePartitions;
}
export const Datastore = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    storage: S.optional(DatastoreStorage),
    arn: S.optional(S.String),
    status: S.optional(DatastoreStatus),
    retentionPeriod: S.optional(RetentionPeriod),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastMessageArrivalTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    fileFormatConfiguration: S.optional(FileFormatConfiguration),
    datastorePartitions: S.optional(DatastorePartitions),
  }),
).annotations({ identifier: "Datastore" }) as any as S.Schema<Datastore>;
export interface EstimatedResourceSize {
  estimatedSizeInBytes?: number;
  estimatedOn?: Date;
}
export const EstimatedResourceSize = S.suspend(() =>
  S.Struct({
    estimatedSizeInBytes: S.optional(S.Number),
    estimatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EstimatedResourceSize",
}) as any as S.Schema<EstimatedResourceSize>;
export interface DatastoreStatistics {
  size?: EstimatedResourceSize;
}
export const DatastoreStatistics = S.suspend(() =>
  S.Struct({ size: S.optional(EstimatedResourceSize) }),
).annotations({
  identifier: "DatastoreStatistics",
}) as any as S.Schema<DatastoreStatistics>;
export interface DatasetEntry {
  entryName?: string;
  dataURI?: string;
}
export const DatasetEntry = S.suspend(() =>
  S.Struct({ entryName: S.optional(S.String), dataURI: S.optional(S.String) }),
).annotations({ identifier: "DatasetEntry" }) as any as S.Schema<DatasetEntry>;
export type DatasetEntries = DatasetEntry[];
export const DatasetEntries = S.Array(DatasetEntry);
export interface DatasetContentStatus {
  state?: DatasetContentState;
  reason?: string;
}
export const DatasetContentStatus = S.suspend(() =>
  S.Struct({
    state: S.optional(DatasetContentState),
    reason: S.optional(S.String),
  }),
).annotations({
  identifier: "DatasetContentStatus",
}) as any as S.Schema<DatasetContentStatus>;
export interface DatasetContentSummary {
  version?: string;
  status?: DatasetContentStatus;
  creationTime?: Date;
  scheduleTime?: Date;
  completionTime?: Date;
}
export const DatasetContentSummary = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    status: S.optional(DatasetContentStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    scheduleTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DatasetContentSummary",
}) as any as S.Schema<DatasetContentSummary>;
export type DatasetContentSummaries = DatasetContentSummary[];
export const DatasetContentSummaries = S.Array(DatasetContentSummary);
export type ReprocessingStatus =
  | "RUNNING"
  | "SUCCEEDED"
  | "CANCELLED"
  | "FAILED";
export const ReprocessingStatus = S.Literal(
  "RUNNING",
  "SUCCEEDED",
  "CANCELLED",
  "FAILED",
);
export interface ReprocessingSummary {
  id?: string;
  status?: ReprocessingStatus;
  creationTime?: Date;
}
export const ReprocessingSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    status: S.optional(ReprocessingStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ReprocessingSummary",
}) as any as S.Schema<ReprocessingSummary>;
export type ReprocessingSummaries = ReprocessingSummary[];
export const ReprocessingSummaries = S.Array(ReprocessingSummary);
export interface PipelineSummary {
  pipelineName?: string;
  reprocessingSummaries?: ReprocessingSummary[];
  creationTime?: Date;
  lastUpdateTime?: Date;
}
export const PipelineSummary = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    reprocessingSummaries: S.optional(ReprocessingSummaries),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PipelineSummary",
}) as any as S.Schema<PipelineSummary>;
export type PipelineSummaries = PipelineSummary[];
export const PipelineSummaries = S.Array(PipelineSummary);
export interface ServiceManagedChannelS3StorageSummary {}
export const ServiceManagedChannelS3StorageSummary = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ServiceManagedChannelS3StorageSummary",
}) as any as S.Schema<ServiceManagedChannelS3StorageSummary>;
export type DatasetActionType = "QUERY" | "CONTAINER";
export const DatasetActionType = S.Literal("QUERY", "CONTAINER");
export interface ServiceManagedDatastoreS3StorageSummary {}
export const ServiceManagedDatastoreS3StorageSummary = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ServiceManagedDatastoreS3StorageSummary",
}) as any as S.Schema<ServiceManagedDatastoreS3StorageSummary>;
export interface CreateChannelRequest {
  channelName: string;
  channelStorage?: ChannelStorage;
  retentionPeriod?: RetentionPeriod;
  tags?: Tag[];
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    channelName: S.String,
    channelStorage: S.optional(ChannelStorage),
    retentionPeriod: S.optional(RetentionPeriod),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelRequest",
}) as any as S.Schema<CreateChannelRequest>;
export interface DescribeDatasetResponse {
  dataset?: Dataset;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({ dataset: S.optional(Dataset) }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeDatastoreResponse {
  datastore?: Datastore;
  statistics?: DatastoreStatistics;
}
export const DescribeDatastoreResponse = S.suspend(() =>
  S.Struct({
    datastore: S.optional(Datastore),
    statistics: S.optional(DatastoreStatistics),
  }),
).annotations({
  identifier: "DescribeDatastoreResponse",
}) as any as S.Schema<DescribeDatastoreResponse>;
export interface GetDatasetContentResponse {
  entries?: DatasetEntry[];
  timestamp?: Date;
  status?: DatasetContentStatus;
}
export const GetDatasetContentResponse = S.suspend(() =>
  S.Struct({
    entries: S.optional(DatasetEntries),
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(DatasetContentStatus),
  }),
).annotations({
  identifier: "GetDatasetContentResponse",
}) as any as S.Schema<GetDatasetContentResponse>;
export interface ListDatasetContentsResponse {
  datasetContentSummaries?: DatasetContentSummary[];
  nextToken?: string;
}
export const ListDatasetContentsResponse = S.suspend(() =>
  S.Struct({
    datasetContentSummaries: S.optional(DatasetContentSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetContentsResponse",
}) as any as S.Schema<ListDatasetContentsResponse>;
export interface ListPipelinesResponse {
  pipelineSummaries?: PipelineSummary[];
  nextToken?: string;
}
export const ListPipelinesResponse = S.suspend(() =>
  S.Struct({
    pipelineSummaries: S.optional(PipelineSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPipelinesResponse",
}) as any as S.Schema<ListPipelinesResponse>;
export interface StartPipelineReprocessingResponse {
  reprocessingId?: string;
}
export const StartPipelineReprocessingResponse = S.suspend(() =>
  S.Struct({ reprocessingId: S.optional(S.String) }),
).annotations({
  identifier: "StartPipelineReprocessingResponse",
}) as any as S.Schema<StartPipelineReprocessingResponse>;
export interface DatasetActionSummary {
  actionName?: string;
  actionType?: DatasetActionType;
}
export const DatasetActionSummary = S.suspend(() =>
  S.Struct({
    actionName: S.optional(S.String),
    actionType: S.optional(DatasetActionType),
  }),
).annotations({
  identifier: "DatasetActionSummary",
}) as any as S.Schema<DatasetActionSummary>;
export type DatasetActionSummaries = DatasetActionSummary[];
export const DatasetActionSummaries = S.Array(DatasetActionSummary);
export interface BatchPutMessageErrorEntry {
  messageId?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchPutMessageErrorEntry = S.suspend(() =>
  S.Struct({
    messageId: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchPutMessageErrorEntry",
}) as any as S.Schema<BatchPutMessageErrorEntry>;
export type BatchPutMessageErrorEntries = BatchPutMessageErrorEntry[];
export const BatchPutMessageErrorEntries = S.Array(BatchPutMessageErrorEntry);
export interface ChannelStatistics {
  size?: EstimatedResourceSize;
}
export const ChannelStatistics = S.suspend(() =>
  S.Struct({ size: S.optional(EstimatedResourceSize) }),
).annotations({
  identifier: "ChannelStatistics",
}) as any as S.Schema<ChannelStatistics>;
export interface Pipeline {
  name?: string;
  arn?: string;
  activities?: PipelineActivity[];
  reprocessingSummaries?: ReprocessingSummary[];
  creationTime?: Date;
  lastUpdateTime?: Date;
}
export const Pipeline = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    activities: S.optional(PipelineActivities),
    reprocessingSummaries: S.optional(ReprocessingSummaries),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Pipeline" }) as any as S.Schema<Pipeline>;
export interface DatasetSummary {
  datasetName?: string;
  status?: DatasetStatus;
  creationTime?: Date;
  lastUpdateTime?: Date;
  triggers?: DatasetTrigger[];
  actions?: DatasetActionSummary[];
}
export const DatasetSummary = S.suspend(() =>
  S.Struct({
    datasetName: S.optional(S.String),
    status: S.optional(DatasetStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    triggers: S.optional(DatasetTriggers),
    actions: S.optional(DatasetActionSummaries),
  }),
).annotations({
  identifier: "DatasetSummary",
}) as any as S.Schema<DatasetSummary>;
export type DatasetSummaries = DatasetSummary[];
export const DatasetSummaries = S.Array(DatasetSummary);
export interface CustomerManagedChannelS3StorageSummary {
  bucket?: string;
  keyPrefix?: string;
  roleArn?: string;
}
export const CustomerManagedChannelS3StorageSummary = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    keyPrefix: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomerManagedChannelS3StorageSummary",
}) as any as S.Schema<CustomerManagedChannelS3StorageSummary>;
export interface CustomerManagedDatastoreS3StorageSummary {
  bucket?: string;
  keyPrefix?: string;
  roleArn?: string;
}
export const CustomerManagedDatastoreS3StorageSummary = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    keyPrefix: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomerManagedDatastoreS3StorageSummary",
}) as any as S.Schema<CustomerManagedDatastoreS3StorageSummary>;
export interface BatchPutMessageResponse {
  batchPutMessageErrorEntries?: BatchPutMessageErrorEntry[];
}
export const BatchPutMessageResponse = S.suspend(() =>
  S.Struct({
    batchPutMessageErrorEntries: S.optional(BatchPutMessageErrorEntries),
  }),
).annotations({
  identifier: "BatchPutMessageResponse",
}) as any as S.Schema<BatchPutMessageResponse>;
export interface CreateChannelResponse {
  channelName?: string;
  channelArn?: string;
  retentionPeriod?: RetentionPeriod;
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    channelName: S.optional(S.String),
    channelArn: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
  }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface CreatePipelineRequest {
  pipelineName: string;
  pipelineActivities: PipelineActivity[];
  tags?: Tag[];
}
export const CreatePipelineRequest = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    pipelineActivities: PipelineActivities,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pipelines" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePipelineRequest",
}) as any as S.Schema<CreatePipelineRequest>;
export interface DescribeChannelResponse {
  channel?: Channel;
  statistics?: ChannelStatistics;
}
export const DescribeChannelResponse = S.suspend(() =>
  S.Struct({
    channel: S.optional(Channel),
    statistics: S.optional(ChannelStatistics),
  }),
).annotations({
  identifier: "DescribeChannelResponse",
}) as any as S.Schema<DescribeChannelResponse>;
export interface DescribePipelineResponse {
  pipeline?: Pipeline;
}
export const DescribePipelineResponse = S.suspend(() =>
  S.Struct({ pipeline: S.optional(Pipeline) }),
).annotations({
  identifier: "DescribePipelineResponse",
}) as any as S.Schema<DescribePipelineResponse>;
export interface ListDatasetsResponse {
  datasetSummaries?: DatasetSummary[];
  nextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({
    datasetSummaries: S.optional(DatasetSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ChannelStorageSummary {
  serviceManagedS3?: ServiceManagedChannelS3StorageSummary;
  customerManagedS3?: CustomerManagedChannelS3StorageSummary;
}
export const ChannelStorageSummary = S.suspend(() =>
  S.Struct({
    serviceManagedS3: S.optional(ServiceManagedChannelS3StorageSummary),
    customerManagedS3: S.optional(CustomerManagedChannelS3StorageSummary),
  }),
).annotations({
  identifier: "ChannelStorageSummary",
}) as any as S.Schema<ChannelStorageSummary>;
export interface IotSiteWiseCustomerManagedDatastoreS3StorageSummary {
  bucket?: string;
  keyPrefix?: string;
}
export const IotSiteWiseCustomerManagedDatastoreS3StorageSummary = S.suspend(
  () =>
    S.Struct({ bucket: S.optional(S.String), keyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "IotSiteWiseCustomerManagedDatastoreS3StorageSummary",
}) as any as S.Schema<IotSiteWiseCustomerManagedDatastoreS3StorageSummary>;
export interface ChannelSummary {
  channelName?: string;
  channelStorage?: ChannelStorageSummary;
  status?: ChannelStatus;
  creationTime?: Date;
  lastUpdateTime?: Date;
  lastMessageArrivalTime?: Date;
}
export const ChannelSummary = S.suspend(() =>
  S.Struct({
    channelName: S.optional(S.String),
    channelStorage: S.optional(ChannelStorageSummary),
    status: S.optional(ChannelStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastMessageArrivalTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ChannelSummary",
}) as any as S.Schema<ChannelSummary>;
export type ChannelSummaries = ChannelSummary[];
export const ChannelSummaries = S.Array(ChannelSummary);
export interface DatastoreIotSiteWiseMultiLayerStorageSummary {
  customerManagedS3Storage?: IotSiteWiseCustomerManagedDatastoreS3StorageSummary;
}
export const DatastoreIotSiteWiseMultiLayerStorageSummary = S.suspend(() =>
  S.Struct({
    customerManagedS3Storage: S.optional(
      IotSiteWiseCustomerManagedDatastoreS3StorageSummary,
    ),
  }),
).annotations({
  identifier: "DatastoreIotSiteWiseMultiLayerStorageSummary",
}) as any as S.Schema<DatastoreIotSiteWiseMultiLayerStorageSummary>;
export interface CreateDatasetRequest {
  datasetName: string;
  actions: DatasetAction[];
  triggers?: DatasetTrigger[];
  contentDeliveryRules?: DatasetContentDeliveryRule[];
  retentionPeriod?: RetentionPeriod;
  versioningConfiguration?: VersioningConfiguration;
  tags?: Tag[];
  lateDataRules?: LateDataRule[];
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    datasetName: S.String,
    actions: DatasetActions,
    triggers: S.optional(DatasetTriggers),
    contentDeliveryRules: S.optional(DatasetContentDeliveryRules),
    retentionPeriod: S.optional(RetentionPeriod),
    versioningConfiguration: S.optional(VersioningConfiguration),
    tags: S.optional(TagList),
    lateDataRules: S.optional(LateDataRules),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateDatastoreRequest {
  datastoreName: string;
  datastoreStorage?: DatastoreStorage;
  retentionPeriod?: RetentionPeriod;
  tags?: Tag[];
  fileFormatConfiguration?: FileFormatConfiguration;
  datastorePartitions?: DatastorePartitions;
}
export const CreateDatastoreRequest = S.suspend(() =>
  S.Struct({
    datastoreName: S.String,
    datastoreStorage: S.optional(DatastoreStorage),
    retentionPeriod: S.optional(RetentionPeriod),
    tags: S.optional(TagList),
    fileFormatConfiguration: S.optional(FileFormatConfiguration),
    datastorePartitions: S.optional(DatastorePartitions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datastores" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatastoreRequest",
}) as any as S.Schema<CreateDatastoreRequest>;
export interface CreatePipelineResponse {
  pipelineName?: string;
  pipelineArn?: string;
}
export const CreatePipelineResponse = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    pipelineArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreatePipelineResponse",
}) as any as S.Schema<CreatePipelineResponse>;
export interface ListChannelsResponse {
  channelSummaries?: ChannelSummary[];
  nextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    channelSummaries: S.optional(ChannelSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface DatastoreStorageSummary {
  serviceManagedS3?: ServiceManagedDatastoreS3StorageSummary;
  customerManagedS3?: CustomerManagedDatastoreS3StorageSummary;
  iotSiteWiseMultiLayerStorage?: DatastoreIotSiteWiseMultiLayerStorageSummary;
}
export const DatastoreStorageSummary = S.suspend(() =>
  S.Struct({
    serviceManagedS3: S.optional(ServiceManagedDatastoreS3StorageSummary),
    customerManagedS3: S.optional(CustomerManagedDatastoreS3StorageSummary),
    iotSiteWiseMultiLayerStorage: S.optional(
      DatastoreIotSiteWiseMultiLayerStorageSummary,
    ),
  }),
).annotations({
  identifier: "DatastoreStorageSummary",
}) as any as S.Schema<DatastoreStorageSummary>;
export interface DatastoreSummary {
  datastoreName?: string;
  datastoreStorage?: DatastoreStorageSummary;
  status?: DatastoreStatus;
  creationTime?: Date;
  lastUpdateTime?: Date;
  lastMessageArrivalTime?: Date;
  fileFormatType?: FileFormatType;
  datastorePartitions?: DatastorePartitions;
}
export const DatastoreSummary = S.suspend(() =>
  S.Struct({
    datastoreName: S.optional(S.String),
    datastoreStorage: S.optional(DatastoreStorageSummary),
    status: S.optional(DatastoreStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastMessageArrivalTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    fileFormatType: S.optional(FileFormatType),
    datastorePartitions: S.optional(DatastorePartitions),
  }),
).annotations({
  identifier: "DatastoreSummary",
}) as any as S.Schema<DatastoreSummary>;
export type DatastoreSummaries = DatastoreSummary[];
export const DatastoreSummaries = S.Array(DatastoreSummary);
export interface CreateDatasetResponse {
  datasetName?: string;
  datasetArn?: string;
  retentionPeriod?: RetentionPeriod;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({
    datasetName: S.optional(S.String),
    datasetArn: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
  }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;
export interface CreateDatastoreResponse {
  datastoreName?: string;
  datastoreArn?: string;
  retentionPeriod?: RetentionPeriod;
}
export const CreateDatastoreResponse = S.suspend(() =>
  S.Struct({
    datastoreName: S.optional(S.String),
    datastoreArn: S.optional(S.String),
    retentionPeriod: S.optional(RetentionPeriod),
  }),
).annotations({
  identifier: "CreateDatastoreResponse",
}) as any as S.Schema<CreateDatastoreResponse>;
export interface ListDatastoresResponse {
  datastoreSummaries?: DatastoreSummary[];
  nextToken?: string;
}
export const ListDatastoresResponse = S.suspend(() =>
  S.Struct({
    datastoreSummaries: S.optional(DatastoreSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatastoresResponse",
}) as any as S.Schema<ListDatastoresResponse>;

//# Errors
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Retrieves a list of pipelines.
 */
export const listPipelines: {
  (
    input: ListPipelinesRequest,
  ): effect.Effect<
    ListPipelinesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelinesRequest,
  ) => stream.Stream<
    ListPipelinesResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelinesRequest,
  ) => stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelinesRequest,
  output: ListPipelinesResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts the reprocessing of raw message data through the pipeline.
 */
export const startPipelineReprocessing: (
  input: StartPipelineReprocessingRequest,
) => effect.Effect<
  StartPipelineReprocessingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPipelineReprocessingRequest,
  output: StartPipelineReprocessingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the tags (metadata) that you have assigned to the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a dataset.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => effect.Effect<
  DescribeDatasetResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a data store.
 */
export const describeDatastore: (
  input: DescribeDatastoreRequest,
) => effect.Effect<
  DescribeDatastoreResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatastoreRequest,
  output: DescribeDatastoreResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the contents of a dataset as presigned URIs.
 */
export const getDatasetContent: (
  input: GetDatasetContentRequest,
) => effect.Effect<
  GetDatasetContentResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatasetContentRequest,
  output: GetDatasetContentResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists information about dataset contents that have been created.
 */
export const listDatasetContents: {
  (
    input: ListDatasetContentsRequest,
  ): effect.Effect<
    ListDatasetContentsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetContentsRequest,
  ) => stream.Stream<
    ListDatasetContentsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetContentsRequest,
  ) => stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetContentsRequest,
  output: ListDatasetContentsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates the content of a dataset by applying a `queryAction` (a SQL query) or a
 * `containerAction` (executing a containerized application).
 */
export const createDatasetContent: (
  input: CreateDatasetContentRequest,
) => effect.Effect<
  CreateDatasetContentResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetContentRequest,
  output: CreateDatasetContentResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the current settings of the IoT Analytics logging options.
 */
export const describeLoggingOptions: (
  input: DescribeLoggingOptionsRequest,
) => effect.Effect<
  DescribeLoggingOptionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLoggingOptionsRequest,
  output: DescribeLoggingOptionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a sample of messages from the specified channel ingested during the specified
 * timeframe. Up to 10 messages can be retrieved.
 */
export const sampleChannelData: (
  input: SampleChannelDataRequest,
) => effect.Effect<
  SampleChannelDataResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SampleChannelDataRequest,
  output: SampleChannelDataResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified channel.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => effect.Effect<
  DeleteChannelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified dataset.
 *
 * You do not have to delete the content of the dataset before you perform this
 * operation.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the content of the specified dataset.
 */
export const deleteDatasetContent: (
  input: DeleteDatasetContentRequest,
) => effect.Effect<
  DeleteDatasetContentResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetContentRequest,
  output: DeleteDatasetContentResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified data store.
 */
export const deleteDatastore: (
  input: DeleteDatastoreRequest,
) => effect.Effect<
  DeleteDatastoreResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatastoreRequest,
  output: DeleteDatastoreResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified pipeline.
 */
export const deletePipeline: (
  input: DeletePipelineRequest,
) => effect.Effect<
  DeletePipelineResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineRequest,
  output: DeletePipelineResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Used to update the settings of a channel.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => effect.Effect<
  UpdateChannelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the settings of a dataset.
 */
export const updateDataset: (
  input: UpdateDatasetRequest,
) => effect.Effect<
  UpdateDatasetResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Used to update the settings of a data store.
 */
export const updateDatastore: (
  input: UpdateDatastoreRequest,
) => effect.Effect<
  UpdateDatastoreResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatastoreRequest,
  output: UpdateDatastoreResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Sends messages to a channel.
 */
export const batchPutMessage: (
  input: BatchPutMessageRequest,
) => effect.Effect<
  BatchPutMessageResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutMessageRequest,
  output: BatchPutMessageResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Simulates the results of running a pipeline activity on a message payload.
 */
export const runPipelineActivity: (
  input: RunPipelineActivityRequest,
) => effect.Effect<
  RunPipelineActivityResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunPipelineActivityRequest,
  output: RunPipelineActivityResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Sets or updates the IoT Analytics logging options.
 *
 * If you update the value of any `loggingOptions` field, it takes up to one
 * minute for the change to take effect. Also, if you change the policy attached to the role you
 * specified in the `roleArn` field (for example, to correct an invalid policy), it
 * takes up to five minutes for that change to take effect.
 */
export const putLoggingOptions: (
  input: PutLoggingOptionsRequest,
) => effect.Effect<
  PutLoggingOptionsResponse,
  | InternalFailureException
  | InvalidRequestException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingOptionsRequest,
  output: PutLoggingOptionsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Cancels the reprocessing of data through the pipeline.
 */
export const cancelPipelineReprocessing: (
  input: CancelPipelineReprocessingRequest,
) => effect.Effect<
  CancelPipelineReprocessingResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelPipelineReprocessingRequest,
  output: CancelPipelineReprocessingResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a channel.
 */
export const describeChannel: (
  input: DescribeChannelRequest,
) => effect.Effect<
  DescribeChannelResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about a pipeline.
 */
export const describePipeline: (
  input: DescribePipelineRequest,
) => effect.Effect<
  DescribePipelineResponse,
  | InternalFailureException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePipelineRequest,
  output: DescribePipelineResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves information about datasets.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used to
 * manage a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes the given tags (metadata) from the resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the settings of a pipeline. You must specify both a `channel` and a
 * `datastore` activity and, optionally, as many as 23 additional activities in the
 * `pipelineActivities` array.
 */
export const updatePipeline: (
  input: UpdatePipelineRequest,
) => effect.Effect<
  UpdatePipelineResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePipelineRequest,
  output: UpdatePipelineResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Used to create a channel. A channel collects data from an MQTT topic and archives the raw,
 * unprocessed messages before publishing the data to a pipeline.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => effect.Effect<
  CreateChannelResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a pipeline. A pipeline consumes messages from a channel and allows you to process
 * the messages before storing them in a data store. You must specify both a `channel`
 * and a `datastore` activity and, optionally, as many as 23 additional activities in
 * the `pipelineActivities` array.
 */
export const createPipeline: (
  input: CreatePipelineRequest,
) => effect.Effect<
  CreatePipelineResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipelineRequest,
  output: CreatePipelineResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a list of channels.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): effect.Effect<
    ListChannelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ListChannelsResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Used to create a dataset. A dataset stores data retrieved from a data store by applying a
 * `queryAction` (a SQL query) or a `containerAction` (executing a
 * containerized application). This operation creates the skeleton of a dataset. The dataset can
 * be populated manually by calling `CreateDatasetContent` or automatically according
 * to a trigger you specify.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a data store, which is a repository for messages.
 */
export const createDatastore: (
  input: CreateDatastoreRequest,
) => effect.Effect<
  CreateDatastoreResponse,
  | InternalFailureException
  | InvalidRequestException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatastoreRequest,
  output: CreateDatastoreResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a list of data stores.
 */
export const listDatastores: {
  (
    input: ListDatastoresRequest,
  ): effect.Effect<
    ListDatastoresResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatastoresRequest,
  ) => stream.Stream<
    ListDatastoresResponse,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatastoresRequest,
  ) => stream.Stream<
    unknown,
    | InternalFailureException
    | InvalidRequestException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatastoresRequest,
  output: ListDatastoresResponse,
  errors: [
    InternalFailureException,
    InvalidRequestException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));

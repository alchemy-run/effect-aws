import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://osis.amazonaws.com/doc/2022-01-01");
const svc = T.AwsApiService({
  sdkId: "OSIS",
  serviceShapeName: "AmazonOpenSearchIngestionService",
});
const auth = T.AwsAuthSigv4({ name: "osis" });
const ver = T.ServiceVersion("2022-01-01");
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
              `https://osis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://osis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://osis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://osis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PipelineName = string;
export type PipelineUnits = number;
export type PipelineConfigurationBody = string;
export type PipelineRoleArn = string;
export type PipelineArn = string;
export type PipelineEndpointId = string;
export type BlueprintFormat = string;
export type MaxResults = number;
export type NextToken = string;
export type ResourcePolicy = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type KmsKeyArn = string;
export type TagKey = string;
export type TagValue = string;
export type ErrorMessage = string;
export type LogGroup = string;
export type CidrBlock = string;
export type Integer = number;
export type AwsAccountId = string;

//# Schemas
export interface ListPipelineBlueprintsRequest {}
export const ListPipelineBlueprintsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2022-01-01/osis/listPipelineBlueprints",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPipelineBlueprintsRequest",
}) as any as S.Schema<ListPipelineBlueprintsRequest>;
export type PipelineEndpointIdsList = string[];
export const PipelineEndpointIdsList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface DeletePipelineRequest {
  PipelineName: string;
}
export const DeletePipelineRequest = S.suspend(() =>
  S.Struct({ PipelineName: S.String.pipe(T.HttpLabel("PipelineName")) }).pipe(
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
  ),
).annotations({
  identifier: "DeletePipelineRequest",
}) as any as S.Schema<DeletePipelineRequest>;
export interface DeletePipelineResponse {}
export const DeletePipelineResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePipelineResponse",
}) as any as S.Schema<DeletePipelineResponse>;
export interface DeletePipelineEndpointRequest {
  EndpointId: string;
}
export const DeletePipelineEndpointRequest = S.suspend(() =>
  S.Struct({ EndpointId: S.String.pipe(T.HttpLabel("EndpointId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeletePipelineEndpointRequest",
}) as any as S.Schema<DeletePipelineEndpointRequest>;
export interface DeletePipelineEndpointResponse {}
export const DeletePipelineEndpointResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePipelineEndpointResponse",
}) as any as S.Schema<DeletePipelineEndpointResponse>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface GetPipelineRequest {
  PipelineName: string;
}
export const GetPipelineRequest = S.suspend(() =>
  S.Struct({ PipelineName: S.String.pipe(T.HttpLabel("PipelineName")) }).pipe(
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
  ),
).annotations({
  identifier: "GetPipelineRequest",
}) as any as S.Schema<GetPipelineRequest>;
export interface GetPipelineBlueprintRequest {
  BlueprintName: string;
  Format?: string;
}
export const GetPipelineBlueprintRequest = S.suspend(() =>
  S.Struct({
    BlueprintName: S.String.pipe(T.HttpLabel("BlueprintName")),
    Format: S.optional(S.String).pipe(T.HttpQuery("format")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPipelineBlueprintRequest",
}) as any as S.Schema<GetPipelineBlueprintRequest>;
export interface GetPipelineChangeProgressRequest {
  PipelineName: string;
}
export const GetPipelineChangeProgressRequest = S.suspend(() =>
  S.Struct({ PipelineName: S.String.pipe(T.HttpLabel("PipelineName")) }).pipe(
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
  ),
).annotations({
  identifier: "GetPipelineChangeProgressRequest",
}) as any as S.Schema<GetPipelineChangeProgressRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
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
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListPipelineEndpointConnectionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPipelineEndpointConnectionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListPipelineEndpointConnectionsRequest",
}) as any as S.Schema<ListPipelineEndpointConnectionsRequest>;
export interface ListPipelineEndpointsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPipelineEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2022-01-01/osis/listPipelineEndpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPipelineEndpointsRequest",
}) as any as S.Schema<ListPipelineEndpointsRequest>;
export interface ListPipelinesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPipelinesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2022-01-01/osis/listPipelines" }),
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
  Arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/2022-01-01/osis/listTagsForResource" }),
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
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Policy: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface RevokePipelineEndpointConnectionsRequest {
  PipelineArn: string;
  EndpointIds: PipelineEndpointIdsList;
}
export const RevokePipelineEndpointConnectionsRequest = S.suspend(() =>
  S.Struct({
    PipelineArn: S.String,
    EndpointIds: PipelineEndpointIdsList,
  }).pipe(
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
  ),
).annotations({
  identifier: "RevokePipelineEndpointConnectionsRequest",
}) as any as S.Schema<RevokePipelineEndpointConnectionsRequest>;
export interface StartPipelineRequest {
  PipelineName: string;
}
export const StartPipelineRequest = S.suspend(() =>
  S.Struct({ PipelineName: S.String.pipe(T.HttpLabel("PipelineName")) }).pipe(
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
  ),
).annotations({
  identifier: "StartPipelineRequest",
}) as any as S.Schema<StartPipelineRequest>;
export interface StopPipelineRequest {
  PipelineName: string;
}
export const StopPipelineRequest = S.suspend(() =>
  S.Struct({ PipelineName: S.String.pipe(T.HttpLabel("PipelineName")) }).pipe(
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
  ),
).annotations({
  identifier: "StopPipelineRequest",
}) as any as S.Schema<StopPipelineRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  Arn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpQuery("arn")), Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2022-01-01/osis/tagResource" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  Arn: string;
  TagKeys: StringList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpQuery("arn")),
    TagKeys: StringList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2022-01-01/osis/untagResource" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface CloudWatchLogDestination {
  LogGroup: string;
}
export const CloudWatchLogDestination = S.suspend(() =>
  S.Struct({ LogGroup: S.String }),
).annotations({
  identifier: "CloudWatchLogDestination",
}) as any as S.Schema<CloudWatchLogDestination>;
export interface LogPublishingOptions {
  IsLoggingEnabled?: boolean;
  CloudWatchLogDestination?: CloudWatchLogDestination;
}
export const LogPublishingOptions = S.suspend(() =>
  S.Struct({
    IsLoggingEnabled: S.optional(S.Boolean),
    CloudWatchLogDestination: S.optional(CloudWatchLogDestination),
  }),
).annotations({
  identifier: "LogPublishingOptions",
}) as any as S.Schema<LogPublishingOptions>;
export interface BufferOptions {
  PersistentBufferEnabled: boolean;
}
export const BufferOptions = S.suspend(() =>
  S.Struct({ PersistentBufferEnabled: S.Boolean }),
).annotations({
  identifier: "BufferOptions",
}) as any as S.Schema<BufferOptions>;
export interface EncryptionAtRestOptions {
  KmsKeyArn: string;
}
export const EncryptionAtRestOptions = S.suspend(() =>
  S.Struct({ KmsKeyArn: S.String }),
).annotations({
  identifier: "EncryptionAtRestOptions",
}) as any as S.Schema<EncryptionAtRestOptions>;
export interface UpdatePipelineRequest {
  PipelineName: string;
  MinUnits?: number;
  MaxUnits?: number;
  PipelineConfigurationBody?: string;
  LogPublishingOptions?: LogPublishingOptions;
  BufferOptions?: BufferOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  PipelineRoleArn?: string;
}
export const UpdatePipelineRequest = S.suspend(() =>
  S.Struct({
    PipelineName: S.String.pipe(T.HttpLabel("PipelineName")),
    MinUnits: S.optional(S.Number),
    MaxUnits: S.optional(S.Number),
    PipelineConfigurationBody: S.optional(S.String),
    LogPublishingOptions: S.optional(LogPublishingOptions),
    BufferOptions: S.optional(BufferOptions),
    EncryptionAtRestOptions: S.optional(EncryptionAtRestOptions),
    PipelineRoleArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdatePipelineRequest",
}) as any as S.Schema<UpdatePipelineRequest>;
export interface ValidatePipelineRequest {
  PipelineConfigurationBody: string;
}
export const ValidatePipelineRequest = S.suspend(() =>
  S.Struct({ PipelineConfigurationBody: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2022-01-01/osis/validatePipeline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidatePipelineRequest",
}) as any as S.Schema<ValidatePipelineRequest>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface PipelineEndpointVpcOptions {
  SubnetIds?: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
}
export const PipelineEndpointVpcOptions = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "PipelineEndpointVpcOptions",
}) as any as S.Schema<PipelineEndpointVpcOptions>;
export interface PipelineBlueprintSummary {
  BlueprintName?: string;
  DisplayName?: string;
  DisplayDescription?: string;
  Service?: string;
  UseCase?: string;
}
export const PipelineBlueprintSummary = S.suspend(() =>
  S.Struct({
    BlueprintName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    DisplayDescription: S.optional(S.String),
    Service: S.optional(S.String),
    UseCase: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineBlueprintSummary",
}) as any as S.Schema<PipelineBlueprintSummary>;
export type PipelineBlueprintsSummaryList = PipelineBlueprintSummary[];
export const PipelineBlueprintsSummaryList = S.Array(PipelineBlueprintSummary);
export interface CreatePipelineEndpointRequest {
  PipelineArn: string;
  VpcOptions: PipelineEndpointVpcOptions;
}
export const CreatePipelineEndpointRequest = S.suspend(() =>
  S.Struct({
    PipelineArn: S.String,
    VpcOptions: PipelineEndpointVpcOptions,
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/2022-01-01/osis/createPipelineEndpoint",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePipelineEndpointRequest",
}) as any as S.Schema<CreatePipelineEndpointRequest>;
export interface GetResourcePolicyResponse {
  ResourceArn?: string;
  Policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListPipelineBlueprintsResponse {
  Blueprints?: PipelineBlueprintsSummaryList;
}
export const ListPipelineBlueprintsResponse = S.suspend(() =>
  S.Struct({ Blueprints: S.optional(PipelineBlueprintsSummaryList) }).pipe(ns),
).annotations({
  identifier: "ListPipelineBlueprintsResponse",
}) as any as S.Schema<ListPipelineBlueprintsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourcePolicyResponse {
  ResourceArn?: string;
  Policy?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface RevokePipelineEndpointConnectionsResponse {
  PipelineArn?: string;
}
export const RevokePipelineEndpointConnectionsResponse = S.suspend(() =>
  S.Struct({ PipelineArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RevokePipelineEndpointConnectionsResponse",
}) as any as S.Schema<RevokePipelineEndpointConnectionsResponse>;
export interface PipelineStatusReason {
  Description?: string;
}
export const PipelineStatusReason = S.suspend(() =>
  S.Struct({ Description: S.optional(S.String) }),
).annotations({
  identifier: "PipelineStatusReason",
}) as any as S.Schema<PipelineStatusReason>;
export type IngestEndpointUrlsList = string[];
export const IngestEndpointUrlsList = S.Array(S.String);
export interface VpcAttachmentOptions {
  AttachToVpc: boolean;
  CidrBlock?: string;
}
export const VpcAttachmentOptions = S.suspend(() =>
  S.Struct({ AttachToVpc: S.Boolean, CidrBlock: S.optional(S.String) }),
).annotations({
  identifier: "VpcAttachmentOptions",
}) as any as S.Schema<VpcAttachmentOptions>;
export interface VpcOptions {
  SubnetIds: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
  VpcAttachmentOptions?: VpcAttachmentOptions;
  VpcEndpointManagement?: string;
}
export const VpcOptions = S.suspend(() =>
  S.Struct({
    SubnetIds: SubnetIds,
    SecurityGroupIds: S.optional(SecurityGroupIds),
    VpcAttachmentOptions: S.optional(VpcAttachmentOptions),
    VpcEndpointManagement: S.optional(S.String),
  }),
).annotations({ identifier: "VpcOptions" }) as any as S.Schema<VpcOptions>;
export interface VpcEndpoint {
  VpcEndpointId?: string;
  VpcId?: string;
  VpcOptions?: VpcOptions;
}
export const VpcEndpoint = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    VpcId: S.optional(S.String),
    VpcOptions: S.optional(VpcOptions),
  }),
).annotations({ identifier: "VpcEndpoint" }) as any as S.Schema<VpcEndpoint>;
export type VpcEndpointsList = VpcEndpoint[];
export const VpcEndpointsList = S.Array(VpcEndpoint);
export interface ServiceVpcEndpoint {
  ServiceName?: string;
  VpcEndpointId?: string;
}
export const ServiceVpcEndpoint = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceVpcEndpoint",
}) as any as S.Schema<ServiceVpcEndpoint>;
export type ServiceVpcEndpointsList = ServiceVpcEndpoint[];
export const ServiceVpcEndpointsList = S.Array(ServiceVpcEndpoint);
export interface PipelineDestination {
  ServiceName?: string;
  Endpoint?: string;
}
export const PipelineDestination = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(S.String),
    Endpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineDestination",
}) as any as S.Schema<PipelineDestination>;
export type PipelineDestinationList = PipelineDestination[];
export const PipelineDestinationList = S.Array(PipelineDestination);
export interface Pipeline {
  PipelineName?: string;
  PipelineArn?: string;
  MinUnits?: number;
  MaxUnits?: number;
  Status?: string;
  StatusReason?: PipelineStatusReason;
  PipelineConfigurationBody?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  IngestEndpointUrls?: IngestEndpointUrlsList;
  LogPublishingOptions?: LogPublishingOptions;
  VpcEndpoints?: VpcEndpointsList;
  BufferOptions?: BufferOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  VpcEndpointService?: string;
  ServiceVpcEndpoints?: ServiceVpcEndpointsList;
  Destinations?: PipelineDestinationList;
  Tags?: TagList;
  PipelineRoleArn?: string;
}
export const Pipeline = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Pipeline" }) as any as S.Schema<Pipeline>;
export interface StartPipelineResponse {
  Pipeline?: Pipeline;
}
export const StartPipelineResponse = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(Pipeline) }).pipe(ns),
).annotations({
  identifier: "StartPipelineResponse",
}) as any as S.Schema<StartPipelineResponse>;
export interface StopPipelineResponse {
  Pipeline?: Pipeline;
}
export const StopPipelineResponse = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(Pipeline) }).pipe(ns),
).annotations({
  identifier: "StopPipelineResponse",
}) as any as S.Schema<StopPipelineResponse>;
export interface UpdatePipelineResponse {
  Pipeline?: Pipeline;
}
export const UpdatePipelineResponse = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(Pipeline) }).pipe(ns),
).annotations({
  identifier: "UpdatePipelineResponse",
}) as any as S.Schema<UpdatePipelineResponse>;
export interface PipelineBlueprint {
  BlueprintName?: string;
  PipelineConfigurationBody?: string;
  DisplayName?: string;
  DisplayDescription?: string;
  Service?: string;
  UseCase?: string;
}
export const PipelineBlueprint = S.suspend(() =>
  S.Struct({
    BlueprintName: S.optional(S.String),
    PipelineConfigurationBody: S.optional(S.String),
    DisplayName: S.optional(S.String),
    DisplayDescription: S.optional(S.String),
    Service: S.optional(S.String),
    UseCase: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineBlueprint",
}) as any as S.Schema<PipelineBlueprint>;
export interface PipelineEndpointConnection {
  PipelineArn?: string;
  EndpointId?: string;
  Status?: string;
  VpcEndpointOwner?: string;
}
export const PipelineEndpointConnection = S.suspend(() =>
  S.Struct({
    PipelineArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Status: S.optional(S.String),
    VpcEndpointOwner: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineEndpointConnection",
}) as any as S.Schema<PipelineEndpointConnection>;
export type PipelineEndpointConnectionsSummaryList =
  PipelineEndpointConnection[];
export const PipelineEndpointConnectionsSummaryList = S.Array(
  PipelineEndpointConnection,
);
export interface PipelineEndpoint {
  PipelineArn?: string;
  EndpointId?: string;
  Status?: string;
  VpcId?: string;
  VpcOptions?: PipelineEndpointVpcOptions;
  IngestEndpointUrl?: string;
}
export const PipelineEndpoint = S.suspend(() =>
  S.Struct({
    PipelineArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Status: S.optional(S.String),
    VpcId: S.optional(S.String),
    VpcOptions: S.optional(PipelineEndpointVpcOptions),
    IngestEndpointUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineEndpoint",
}) as any as S.Schema<PipelineEndpoint>;
export type PipelineEndpointsSummaryList = PipelineEndpoint[];
export const PipelineEndpointsSummaryList = S.Array(PipelineEndpoint);
export interface PipelineSummary {
  Status?: string;
  StatusReason?: PipelineStatusReason;
  PipelineName?: string;
  PipelineArn?: string;
  MinUnits?: number;
  MaxUnits?: number;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Destinations?: PipelineDestinationList;
  Tags?: TagList;
}
export const PipelineSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PipelineSummary",
}) as any as S.Schema<PipelineSummary>;
export type PipelineSummaryList = PipelineSummary[];
export const PipelineSummaryList = S.Array(PipelineSummary);
export interface ValidationMessage {
  Message?: string;
}
export const ValidationMessage = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "ValidationMessage",
}) as any as S.Schema<ValidationMessage>;
export type ValidationMessageList = ValidationMessage[];
export const ValidationMessageList = S.Array(ValidationMessage);
export interface CreatePipelineRequest {
  PipelineName: string;
  MinUnits: number;
  MaxUnits: number;
  PipelineConfigurationBody: string;
  LogPublishingOptions?: LogPublishingOptions;
  VpcOptions?: VpcOptions;
  BufferOptions?: BufferOptions;
  EncryptionAtRestOptions?: EncryptionAtRestOptions;
  Tags?: TagList;
  PipelineRoleArn?: string;
}
export const CreatePipelineRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/2022-01-01/osis/createPipeline" }),
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
export interface CreatePipelineEndpointResponse {
  PipelineArn?: string;
  EndpointId?: string;
  Status?: string;
  VpcId?: string;
}
export const CreatePipelineEndpointResponse = S.suspend(() =>
  S.Struct({
    PipelineArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Status: S.optional(S.String),
    VpcId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreatePipelineEndpointResponse",
}) as any as S.Schema<CreatePipelineEndpointResponse>;
export interface GetPipelineBlueprintResponse {
  Blueprint?: PipelineBlueprint;
  Format?: string;
}
export const GetPipelineBlueprintResponse = S.suspend(() =>
  S.Struct({
    Blueprint: S.optional(PipelineBlueprint),
    Format: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPipelineBlueprintResponse",
}) as any as S.Schema<GetPipelineBlueprintResponse>;
export interface ListPipelineEndpointConnectionsResponse {
  NextToken?: string;
  PipelineEndpointConnections?: PipelineEndpointConnectionsSummaryList;
}
export const ListPipelineEndpointConnectionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PipelineEndpointConnections: S.optional(
      PipelineEndpointConnectionsSummaryList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelineEndpointConnectionsResponse",
}) as any as S.Schema<ListPipelineEndpointConnectionsResponse>;
export interface ListPipelineEndpointsResponse {
  NextToken?: string;
  PipelineEndpoints?: PipelineEndpointsSummaryList;
}
export const ListPipelineEndpointsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PipelineEndpoints: S.optional(PipelineEndpointsSummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelineEndpointsResponse",
}) as any as S.Schema<ListPipelineEndpointsResponse>;
export interface ListPipelinesResponse {
  NextToken?: string;
  Pipelines?: PipelineSummaryList;
}
export const ListPipelinesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Pipelines: S.optional(PipelineSummaryList),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelinesResponse",
}) as any as S.Schema<ListPipelinesResponse>;
export interface ValidatePipelineResponse {
  isValid?: boolean;
  Errors?: ValidationMessageList;
}
export const ValidatePipelineResponse = S.suspend(() =>
  S.Struct({
    isValid: S.optional(S.Boolean),
    Errors: S.optional(ValidationMessageList),
  }).pipe(ns),
).annotations({
  identifier: "ValidatePipelineResponse",
}) as any as S.Schema<ValidatePipelineResponse>;
export interface ChangeProgressStage {
  Name?: string;
  Status?: string;
  Description?: string;
  LastUpdatedAt?: Date;
}
export const ChangeProgressStage = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Description: S.optional(S.String),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChangeProgressStage",
}) as any as S.Schema<ChangeProgressStage>;
export type ChangeProgressStageList = ChangeProgressStage[];
export const ChangeProgressStageList = S.Array(ChangeProgressStage);
export interface ChangeProgressStatus {
  StartTime?: Date;
  Status?: string;
  TotalNumberOfStages?: number;
  ChangeProgressStages?: ChangeProgressStageList;
}
export const ChangeProgressStatus = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    TotalNumberOfStages: S.optional(S.Number),
    ChangeProgressStages: S.optional(ChangeProgressStageList),
  }),
).annotations({
  identifier: "ChangeProgressStatus",
}) as any as S.Schema<ChangeProgressStatus>;
export type ChangeProgressStatusList = ChangeProgressStatus[];
export const ChangeProgressStatusList = S.Array(ChangeProgressStatus);
export interface CreatePipelineResponse {
  Pipeline?: Pipeline;
}
export const CreatePipelineResponse = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(Pipeline) }).pipe(ns),
).annotations({
  identifier: "CreatePipelineResponse",
}) as any as S.Schema<CreatePipelineResponse>;
export interface GetPipelineResponse {
  Pipeline?: Pipeline;
}
export const GetPipelineResponse = S.suspend(() =>
  S.Struct({ Pipeline: S.optional(Pipeline) }).pipe(ns),
).annotations({
  identifier: "GetPipelineResponse",
}) as any as S.Schema<GetPipelineResponse>;
export interface GetPipelineChangeProgressResponse {
  ChangeProgressStatuses?: ChangeProgressStatusList;
}
export const GetPipelineChangeProgressResponse = S.suspend(() =>
  S.Struct({
    ChangeProgressStatuses: S.optional(ChangeProgressStatusList),
  }).pipe(ns),
).annotations({
  identifier: "GetPipelineChangeProgressResponse",
}) as any as S.Schema<GetPipelineChangeProgressResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DisabledOperationException extends S.TaggedError<DisabledOperationException>()(
  "DisabledOperationException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Checks whether an OpenSearch Ingestion pipeline configuration is valid prior to creation. For
 * more information, see Creating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const validatePipeline: (
  input: ValidatePipelineRequest,
) => Effect.Effect<
  ValidatePipelineResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts an OpenSearch Ingestion pipeline. For more information, see Starting an OpenSearch Ingestion pipeline.
 */
export const startPipeline: (
  input: StartPipelineRequest,
) => Effect.Effect<
  StartPipelineResponse,
  | AccessDeniedException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the pipeline endpoints connected to pipelines in your account.
 */
export const listPipelineEndpointConnections: {
  (
    input: ListPipelineEndpointConnectionsRequest,
  ): Effect.Effect<
    ListPipelineEndpointConnectionsResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelineEndpointConnectionsRequest,
  ) => Stream.Stream<
    ListPipelineEndpointConnectionsResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelineEndpointConnectionsRequest,
  ) => Stream.Stream<
    PipelineEndpointConnection,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelineEndpointConnectionsRequest,
  output: ListPipelineEndpointConnectionsResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PipelineEndpointConnections",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all pipeline endpoints in your account.
 */
export const listPipelineEndpoints: {
  (
    input: ListPipelineEndpointsRequest,
  ): Effect.Effect<
    ListPipelineEndpointsResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelineEndpointsRequest,
  ) => Stream.Stream<
    ListPipelineEndpointsResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelineEndpointsRequest,
  ) => Stream.Stream<
    PipelineEndpoint,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | LimitExceededException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelineEndpointsRequest,
  output: ListPipelineEndpointsResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    LimitExceededException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PipelineEndpoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Attaches a resource-based policy to an OpenSearch Ingestion resource. Resource-based
 * policies grant permissions to principals to perform actions on the resource.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const revokePipelineEndpointConnections: (
  input: RevokePipelineEndpointConnectionsRequest,
) => Effect.Effect<
  RevokePipelineEndpointConnectionsResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a resource-based policy from an OpenSearch Ingestion resource.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tags an OpenSearch Ingestion pipeline. For more information, see Tagging Amazon OpenSearch
 * Ingestion pipelines.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a VPC endpoint for an OpenSearch Ingestion pipeline. Pipeline endpoints allow you to
 * ingest data from your VPC into pipelines that you have access to.
 */
export const createPipelineEndpoint: (
  input: CreatePipelineEndpointRequest,
) => Effect.Effect<
  CreatePipelineEndpointResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves a list of all available blueprints for Data Prepper. For more information, see
 * Using
 * blueprints to create a pipeline.
 */
export const listPipelineBlueprints: (
  input: ListPipelineBlueprintsRequest,
) => Effect.Effect<
  ListPipelineBlueprintsResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | InvalidPaginationTokenException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPipelineBlueprintsRequest,
  output: ListPipelineBlueprintsResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    InvalidPaginationTokenException,
    ValidationException,
  ],
}));
/**
 * Deletes a VPC endpoint for an OpenSearch Ingestion pipeline.
 */
export const deletePipelineEndpoint: (
  input: DeletePipelineEndpointRequest,
) => Effect.Effect<
  DeletePipelineEndpointResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineEndpointRequest,
  output: DeletePipelineEndpointResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ValidationException,
  ],
}));
/**
 * Lists all OpenSearch Ingestion pipelines in the current Amazon Web Services account and Region.
 * For more information, see Viewing Amazon OpenSearch
 * Ingestion pipelines.
 */
export const listPipelines: {
  (
    input: ListPipelinesRequest,
  ): Effect.Effect<
    ListPipelinesResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | InvalidPaginationTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelinesRequest,
  ) => Stream.Stream<
    ListPipelinesResponse,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | InvalidPaginationTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelinesRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | DisabledOperationException
    | InternalException
    | InvalidPaginationTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelinesRequest,
  output: ListPipelinesResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    InvalidPaginationTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Stops an OpenSearch Ingestion pipeline. For more information, see Stopping
 * an OpenSearch Ingestion pipeline.
 */
export const stopPipeline: (
  input: StopPipelineRequest,
) => Effect.Effect<
  StopPipelineResponse,
  | AccessDeniedException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an OpenSearch Ingestion pipeline. For more information, see Updating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const updatePipeline: (
  input: UpdatePipelineRequest,
) => Effect.Effect<
  UpdatePipelineResponse,
  | AccessDeniedException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all resource tags associated with an OpenSearch Ingestion pipeline. For more information,
 * see Tagging Amazon OpenSearch Ingestion pipelines.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes one or more tags from an OpenSearch Ingestion pipeline. For more information, see Tagging
 * Amazon OpenSearch Ingestion pipelines.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an OpenSearch Ingestion pipeline. For more information, see Deleting Amazon OpenSearch
 * Ingestion pipelines.
 */
export const deletePipeline: (
  input: DeletePipelineRequest,
) => Effect.Effect<
  DeletePipelineResponse,
  | AccessDeniedException
  | ConflictException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about a specific blueprint for OpenSearch Ingestion. Blueprints are
 * templates for the configuration needed for a `CreatePipeline` request. For more
 * information, see Using
 * blueprints to create a pipeline.
 */
export const getPipelineBlueprint: (
  input: GetPipelineBlueprintRequest,
) => Effect.Effect<
  GetPipelineBlueprintResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineBlueprintRequest,
  output: GetPipelineBlueprintResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an OpenSearch Ingestion pipeline.
 */
export const getPipeline: (
  input: GetPipelineRequest,
) => Effect.Effect<
  GetPipelineResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPipelineChangeProgress: (
  input: GetPipelineChangeProgressRequest,
) => Effect.Effect<
  GetPipelineChangeProgressResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineChangeProgressRequest,
  output: GetPipelineChangeProgressResponse,
  errors: [
    AccessDeniedException,
    DisabledOperationException,
    InternalException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the resource-based policy attached to an OpenSearch Ingestion resource.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => Effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an OpenSearch Ingestion pipeline. For more information, see Creating Amazon OpenSearch
 * Ingestion pipelines.
 */
export const createPipeline: (
  input: CreatePipelineRequest,
) => Effect.Effect<
  CreatePipelineResponse,
  | AccessDeniedException
  | DisabledOperationException
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

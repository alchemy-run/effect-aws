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
const svc = T.AwsApiService({
  sdkId: "DataExchange",
  serviceShapeName: "DataExchange",
});
const auth = T.AwsAuthSigv4({ name: "dataexchange" });
const ver = T.ServiceVersion("2017-07-25");
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
              `https://dataexchange-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://dataexchange-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://dataexchange.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://dataexchange.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DataGrantArn = string;
export type Id = string;
export type DataGrantName = string;
export type GrantDistributionScope = string;
export type ReceiverPrincipal = string;
export type Description = string;
export type AssetType = string;
export type Name = string;
export type Type = string;
export type __stringMin0Max16384 = string;
export type DataGrantId = string;
export type __string = string;
export type MaxResults = number;
export type AcceptanceStateFilterValue = string;
export type __stringMin10Max512 = string;
export type ClientToken = string;
export type __stringMin0Max4096 = string;
export type NotificationType = string;
export type AssetName = string;
export type SenderPrincipal = string;
export type DataGrantDescription = string;
export type DataGrantAcceptanceState = string;
export type Arn = string;
export type ResourceType = string;
export type Origin = string;
export type State = string;
export type NextToken = string;
export type __stringMin24Max24PatternAZaZ094AZaZ092AZaZ093 = string;
export type ApiDescription = string;
export type ProtocolType = string;
export type AwsAccountId = string;
export type RoleArn = string;
export type Code = string;
export type JobErrorLimitName = string;
export type __double = number;
export type JobErrorResourceTypes = string;
export type ServerSideEncryptionTypes = string;
export type DatabaseLFTagPolicyPermission = string;
export type TableTagPolicyLFPermission = string;
export type SchemaChangeType = string;
export type __doubleMin0 = number;
export type LakeFormationDataPermissionType = string;
export type LFPermission = string;
export type KmsKeyArn = string;
export type LimitName = string;
export type LFResourceType = string;
export type ExceptionCause = string;

//# Schemas
export type AcceptanceStateFilterValues = string[];
export const AcceptanceStateFilterValues = S.Array(S.String);
export type ListOf__string = string[];
export const ListOf__string = S.Array(S.String);
export interface AcceptDataGrantRequest {
  DataGrantArn: string;
}
export const AcceptDataGrantRequest = S.suspend(() =>
  S.Struct({ DataGrantArn: S.String.pipe(T.HttpLabel("DataGrantArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/data-grants/{DataGrantArn}/accept" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptDataGrantRequest",
}) as any as S.Schema<AcceptDataGrantRequest>;
export interface CancelJobRequest {
  JobId: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface CancelJobResponse {}
export const CancelJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelJobResponse",
}) as any as S.Schema<CancelJobResponse>;
export type MapOf__string = { [key: string]: string };
export const MapOf__string = S.Record({ key: S.String, value: S.String });
export interface CreateDataSetRequest {
  AssetType: string;
  Description: string;
  Name: string;
  Tags?: MapOf__string;
}
export const CreateDataSetRequest = S.suspend(() =>
  S.Struct({
    AssetType: S.String,
    Description: S.String,
    Name: S.String,
    Tags: S.optional(MapOf__string),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/data-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataSetRequest",
}) as any as S.Schema<CreateDataSetRequest>;
export interface CreateRevisionRequest {
  Comment?: string;
  DataSetId: string;
  Tags?: MapOf__string;
}
export const CreateRevisionRequest = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Tags: S.optional(MapOf__string),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/data-sets/{DataSetId}/revisions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRevisionRequest",
}) as any as S.Schema<CreateRevisionRequest>;
export interface DeleteAssetRequest {
  AssetId: string;
  DataSetId: string;
  RevisionId: string;
}
export const DeleteAssetRequest = S.suspend(() =>
  S.Struct({
    AssetId: S.String.pipe(T.HttpLabel("AssetId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssetRequest",
}) as any as S.Schema<DeleteAssetRequest>;
export interface DeleteAssetResponse {}
export const DeleteAssetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAssetResponse",
}) as any as S.Schema<DeleteAssetResponse>;
export interface DeleteDataGrantRequest {
  DataGrantId: string;
}
export const DeleteDataGrantRequest = S.suspend(() =>
  S.Struct({ DataGrantId: S.String.pipe(T.HttpLabel("DataGrantId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/data-grants/{DataGrantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataGrantRequest",
}) as any as S.Schema<DeleteDataGrantRequest>;
export interface DeleteDataGrantResponse {}
export const DeleteDataGrantResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataGrantResponse",
}) as any as S.Schema<DeleteDataGrantResponse>;
export interface DeleteDataSetRequest {
  DataSetId: string;
}
export const DeleteDataSetRequest = S.suspend(() =>
  S.Struct({ DataSetId: S.String.pipe(T.HttpLabel("DataSetId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/data-sets/{DataSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDataSetRequest",
}) as any as S.Schema<DeleteDataSetRequest>;
export interface DeleteDataSetResponse {}
export const DeleteDataSetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDataSetResponse",
}) as any as S.Schema<DeleteDataSetResponse>;
export interface DeleteEventActionRequest {
  EventActionId: string;
}
export const DeleteEventActionRequest = S.suspend(() =>
  S.Struct({ EventActionId: S.String.pipe(T.HttpLabel("EventActionId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/event-actions/{EventActionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventActionRequest",
}) as any as S.Schema<DeleteEventActionRequest>;
export interface DeleteEventActionResponse {}
export const DeleteEventActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventActionResponse",
}) as any as S.Schema<DeleteEventActionResponse>;
export interface DeleteRevisionRequest {
  DataSetId: string;
  RevisionId: string;
}
export const DeleteRevisionRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRevisionRequest",
}) as any as S.Schema<DeleteRevisionRequest>;
export interface DeleteRevisionResponse {}
export const DeleteRevisionResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteRevisionResponse" },
) as any as S.Schema<DeleteRevisionResponse>;
export interface GetAssetRequest {
  AssetId: string;
  DataSetId: string;
  RevisionId: string;
}
export const GetAssetRequest = S.suspend(() =>
  S.Struct({
    AssetId: S.String.pipe(T.HttpLabel("AssetId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssetRequest",
}) as any as S.Schema<GetAssetRequest>;
export interface GetDataGrantRequest {
  DataGrantId: string;
}
export const GetDataGrantRequest = S.suspend(() =>
  S.Struct({ DataGrantId: S.String.pipe(T.HttpLabel("DataGrantId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/data-grants/{DataGrantId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataGrantRequest",
}) as any as S.Schema<GetDataGrantRequest>;
export interface GetDataSetRequest {
  DataSetId: string;
}
export const GetDataSetRequest = S.suspend(() =>
  S.Struct({ DataSetId: S.String.pipe(T.HttpLabel("DataSetId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/data-sets/{DataSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDataSetRequest",
}) as any as S.Schema<GetDataSetRequest>;
export interface GetEventActionRequest {
  EventActionId: string;
}
export const GetEventActionRequest = S.suspend(() =>
  S.Struct({ EventActionId: S.String.pipe(T.HttpLabel("EventActionId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/event-actions/{EventActionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventActionRequest",
}) as any as S.Schema<GetEventActionRequest>;
export interface GetJobRequest {
  JobId: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface GetReceivedDataGrantRequest {
  DataGrantArn: string;
}
export const GetReceivedDataGrantRequest = S.suspend(() =>
  S.Struct({ DataGrantArn: S.String.pipe(T.HttpLabel("DataGrantArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/received-data-grants/{DataGrantArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReceivedDataGrantRequest",
}) as any as S.Schema<GetReceivedDataGrantRequest>;
export interface GetRevisionRequest {
  DataSetId: string;
  RevisionId: string;
}
export const GetRevisionRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRevisionRequest",
}) as any as S.Schema<GetRevisionRequest>;
export interface ListDataGrantsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDataGrantsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/data-grants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataGrantsRequest",
}) as any as S.Schema<ListDataGrantsRequest>;
export interface ListDataSetRevisionsRequest {
  DataSetId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDataSetRevisionsRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/data-sets/{DataSetId}/revisions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSetRevisionsRequest",
}) as any as S.Schema<ListDataSetRevisionsRequest>;
export interface ListDataSetsRequest {
  MaxResults?: number;
  NextToken?: string;
  Origin?: string;
}
export const ListDataSetsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Origin: S.optional(S.String).pipe(T.HttpQuery("origin")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/data-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSetsRequest",
}) as any as S.Schema<ListDataSetsRequest>;
export interface ListEventActionsRequest {
  EventSourceId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEventActionsRequest = S.suspend(() =>
  S.Struct({
    EventSourceId: S.optional(S.String).pipe(T.HttpQuery("eventSourceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/event-actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventActionsRequest",
}) as any as S.Schema<ListEventActionsRequest>;
export interface ListJobsRequest {
  DataSetId?: string;
  MaxResults?: number;
  NextToken?: string;
  RevisionId?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.optional(S.String).pipe(T.HttpQuery("dataSetId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RevisionId: S.optional(S.String).pipe(T.HttpQuery("revisionId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListReceivedDataGrantsRequest {
  MaxResults?: number;
  NextToken?: string;
  AcceptanceState?: AcceptanceStateFilterValues;
}
export const ListReceivedDataGrantsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    AcceptanceState: S.optional(AcceptanceStateFilterValues).pipe(
      T.HttpQuery("acceptanceState"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/received-data-grants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceivedDataGrantsRequest",
}) as any as S.Schema<ListReceivedDataGrantsRequest>;
export interface ListRevisionAssetsRequest {
  DataSetId: string;
  MaxResults?: number;
  NextToken?: string;
  RevisionId: string;
}
export const ListRevisionAssetsRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRevisionAssetsRequest",
}) as any as S.Schema<ListRevisionAssetsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface RevokeRevisionRequest {
  DataSetId: string;
  RevisionId: string;
  RevocationComment: string;
}
export const RevokeRevisionRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
    RevocationComment: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/revoke",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeRevisionRequest",
}) as any as S.Schema<RevokeRevisionRequest>;
export interface SendApiAssetRequest {
  Body?: string;
  QueryStringParameters?: MapOf__string;
  AssetId: string;
  DataSetId: string;
  RequestHeaders?: MapOf__string;
  Method?: string;
  Path?: string;
  RevisionId: string;
}
export const SendApiAssetRequest = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String).pipe(T.HttpPayload()),
    QueryStringParameters: S.optional(MapOf__string).pipe(T.HttpQueryParams()),
    AssetId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-asset-id")),
    DataSetId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-data-set-id")),
    RequestHeaders: S.optional(MapOf__string).pipe(
      T.HttpPrefixHeaders("x-amzn-dataexchange-header-"),
    ),
    Method: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-dataexchange-http-method"),
    ),
    Path: S.optional(S.String).pipe(T.HttpHeader("x-amzn-dataexchange-path")),
    RevisionId: S.String.pipe(T.HttpHeader("x-amzn-dataexchange-revision-id")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/v1" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendApiAssetRequest",
}) as any as S.Schema<SendApiAssetRequest>;
export interface StartJobRequest {
  JobId: string;
}
export const StartJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v1/jobs/{JobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobRequest",
}) as any as S.Schema<StartJobRequest>;
export interface StartJobResponse {}
export const StartJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartJobResponse",
}) as any as S.Schema<StartJobResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: MapOf__string;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: MapOf__string.pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: ListOf__string;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: ListOf__string.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateAssetRequest {
  AssetId: string;
  DataSetId: string;
  Name: string;
  RevisionId: string;
}
export const UpdateAssetRequest = S.suspend(() =>
  S.Struct({
    AssetId: S.String.pipe(T.HttpLabel("AssetId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Name: S.String,
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}/assets/{AssetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssetRequest",
}) as any as S.Schema<UpdateAssetRequest>;
export interface UpdateDataSetRequest {
  DataSetId: string;
  Description?: string;
  Name?: string;
}
export const UpdateDataSetRequest = S.suspend(() =>
  S.Struct({
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v1/data-sets/{DataSetId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDataSetRequest",
}) as any as S.Schema<UpdateDataSetRequest>;
export interface ExportServerSideEncryption {
  KmsKeyArn?: string;
  Type: string;
}
export const ExportServerSideEncryption = S.suspend(() =>
  S.Struct({ KmsKeyArn: S.optional(S.String), Type: S.String }),
).annotations({
  identifier: "ExportServerSideEncryption",
}) as any as S.Schema<ExportServerSideEncryption>;
export interface AutoExportRevisionDestinationEntry {
  Bucket: string;
  KeyPattern?: string;
}
export const AutoExportRevisionDestinationEntry = S.suspend(() =>
  S.Struct({ Bucket: S.String, KeyPattern: S.optional(S.String) }),
).annotations({
  identifier: "AutoExportRevisionDestinationEntry",
}) as any as S.Schema<AutoExportRevisionDestinationEntry>;
export interface AutoExportRevisionToS3RequestDetails {
  Encryption?: ExportServerSideEncryption;
  RevisionDestination: AutoExportRevisionDestinationEntry;
}
export const AutoExportRevisionToS3RequestDetails = S.suspend(() =>
  S.Struct({
    Encryption: S.optional(ExportServerSideEncryption),
    RevisionDestination: AutoExportRevisionDestinationEntry,
  }),
).annotations({
  identifier: "AutoExportRevisionToS3RequestDetails",
}) as any as S.Schema<AutoExportRevisionToS3RequestDetails>;
export interface Action {
  ExportRevisionToS3?: AutoExportRevisionToS3RequestDetails;
}
export const Action = S.suspend(() =>
  S.Struct({
    ExportRevisionToS3: S.optional(AutoExportRevisionToS3RequestDetails),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export interface UpdateEventActionRequest {
  Action?: Action;
  EventActionId: string;
}
export const UpdateEventActionRequest = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    EventActionId: S.String.pipe(T.HttpLabel("EventActionId")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/v1/event-actions/{EventActionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventActionRequest",
}) as any as S.Schema<UpdateEventActionRequest>;
export interface UpdateRevisionRequest {
  Comment?: string;
  DataSetId: string;
  Finalized?: boolean;
  RevisionId: string;
}
export const UpdateRevisionRequest = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Finalized: S.optional(S.Boolean),
    RevisionId: S.String.pipe(T.HttpLabel("RevisionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/v1/data-sets/{DataSetId}/revisions/{RevisionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRevisionRequest",
}) as any as S.Schema<UpdateRevisionRequest>;
export interface AcceptDataGrantResponse {
  Name: string;
  SenderPrincipal?: string;
  ReceiverPrincipal: string;
  Description?: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  GrantDistributionScope: string;
  DataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
export const AcceptDataGrantResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.optional(S.String),
    ReceiverPrincipal: S.String,
    Description: S.optional(S.String),
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    GrantDistributionScope: S.String,
    DataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AcceptDataGrantResponse",
}) as any as S.Schema<AcceptDataGrantResponse>;
export interface CreateDataGrantRequest {
  Name: string;
  GrantDistributionScope: string;
  ReceiverPrincipal: string;
  SourceDataSetId: string;
  EndsAt?: Date;
  Description?: string;
  Tags?: MapOf__string;
}
export const CreateDataGrantRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    GrantDistributionScope: S.String,
    ReceiverPrincipal: S.String,
    SourceDataSetId: S.String,
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    Tags: S.optional(MapOf__string),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/data-grants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDataGrantRequest",
}) as any as S.Schema<CreateDataGrantRequest>;
export interface CreateRevisionResponse {
  Arn?: string;
  Comment?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Finalized?: boolean;
  Id?: string;
  SourceId?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
  RevocationComment?: string;
  Revoked?: boolean;
  RevokedAt?: Date;
}
export const CreateRevisionResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Comment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Finalized: S.optional(S.Boolean),
    Id: S.optional(S.String),
    SourceId: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RevocationComment: S.optional(S.String),
    Revoked: S.optional(S.Boolean),
    RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateRevisionResponse",
}) as any as S.Schema<CreateRevisionResponse>;
export interface GetDataGrantResponse {
  Name: string;
  SenderPrincipal: string;
  ReceiverPrincipal: string;
  Description?: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  GrantDistributionScope: string;
  DataSetId: string;
  SourceDataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Tags?: MapOf__string;
}
export const GetDataGrantResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.String,
    ReceiverPrincipal: S.String,
    Description: S.optional(S.String),
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    GrantDistributionScope: S.String,
    DataSetId: S.String,
    SourceDataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Tags: S.optional(MapOf__string),
  }),
).annotations({
  identifier: "GetDataGrantResponse",
}) as any as S.Schema<GetDataGrantResponse>;
export interface OriginDetails {
  ProductId?: string;
  DataGrantId?: string;
}
export const OriginDetails = S.suspend(() =>
  S.Struct({
    ProductId: S.optional(S.String),
    DataGrantId: S.optional(S.String),
  }),
).annotations({
  identifier: "OriginDetails",
}) as any as S.Schema<OriginDetails>;
export interface GetDataSetResponse {
  Arn?: string;
  AssetType?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  Name?: string;
  Origin?: string;
  OriginDetails?: OriginDetails;
  SourceId?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
}
export const GetDataSetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssetType: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Origin: S.optional(S.String),
    OriginDetails: S.optional(OriginDetails),
    SourceId: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetDataSetResponse",
}) as any as S.Schema<GetDataSetResponse>;
export interface RevisionPublished {
  DataSetId: string;
}
export const RevisionPublished = S.suspend(() =>
  S.Struct({ DataSetId: S.String }),
).annotations({
  identifier: "RevisionPublished",
}) as any as S.Schema<RevisionPublished>;
export interface Event {
  RevisionPublished?: RevisionPublished;
}
export const Event = S.suspend(() =>
  S.Struct({ RevisionPublished: S.optional(RevisionPublished) }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export interface GetEventActionResponse {
  Action?: Action;
  Arn?: string;
  CreatedAt?: Date;
  Event?: Event;
  Id?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
}
export const GetEventActionResponse = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Event: S.optional(Event),
    Id: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetEventActionResponse",
}) as any as S.Schema<GetEventActionResponse>;
export interface GetReceivedDataGrantResponse {
  Name: string;
  SenderPrincipal?: string;
  ReceiverPrincipal: string;
  Description?: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  GrantDistributionScope: string;
  DataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
export const GetReceivedDataGrantResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.optional(S.String),
    ReceiverPrincipal: S.String,
    Description: S.optional(S.String),
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    GrantDistributionScope: S.String,
    DataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetReceivedDataGrantResponse",
}) as any as S.Schema<GetReceivedDataGrantResponse>;
export interface GetRevisionResponse {
  Arn?: string;
  Comment?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Finalized?: boolean;
  Id?: string;
  SourceId?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
  RevocationComment?: string;
  Revoked?: boolean;
  RevokedAt?: Date;
}
export const GetRevisionResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Comment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Finalized: S.optional(S.Boolean),
    Id: S.optional(S.String),
    SourceId: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RevocationComment: S.optional(S.String),
    Revoked: S.optional(S.Boolean),
    RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetRevisionResponse",
}) as any as S.Schema<GetRevisionResponse>;
export interface ListTagsForResourceResponse {
  Tags?: MapOf__string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(MapOf__string).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RevokeRevisionResponse {
  Arn?: string;
  Comment?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Finalized?: boolean;
  Id?: string;
  SourceId?: string;
  UpdatedAt?: Date;
  RevocationComment?: string;
  Revoked?: boolean;
  RevokedAt?: Date;
}
export const RevokeRevisionResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Comment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Finalized: S.optional(S.Boolean),
    Id: S.optional(S.String),
    SourceId: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RevocationComment: S.optional(S.String),
    Revoked: S.optional(S.Boolean),
    RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RevokeRevisionResponse",
}) as any as S.Schema<RevokeRevisionResponse>;
export interface SendApiAssetResponse {
  Body?: string;
  ResponseHeaders?: MapOf__string;
}
export const SendApiAssetResponse = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String).pipe(T.HttpPayload()),
    ResponseHeaders: S.optional(MapOf__string).pipe(T.HttpPrefixHeaders("")),
  }),
).annotations({
  identifier: "SendApiAssetResponse",
}) as any as S.Schema<SendApiAssetResponse>;
export interface S3SnapshotAsset {
  Size: number;
}
export const S3SnapshotAsset = S.suspend(() =>
  S.Struct({ Size: S.Number }),
).annotations({
  identifier: "S3SnapshotAsset",
}) as any as S.Schema<S3SnapshotAsset>;
export interface RedshiftDataShareAsset {
  Arn: string;
}
export const RedshiftDataShareAsset = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({
  identifier: "RedshiftDataShareAsset",
}) as any as S.Schema<RedshiftDataShareAsset>;
export interface ApiGatewayApiAsset {
  ApiDescription?: string;
  ApiEndpoint?: string;
  ApiId?: string;
  ApiKey?: string;
  ApiName?: string;
  ApiSpecificationDownloadUrl?: string;
  ApiSpecificationDownloadUrlExpiresAt?: Date;
  ProtocolType?: string;
  Stage?: string;
}
export const ApiGatewayApiAsset = S.suspend(() =>
  S.Struct({
    ApiDescription: S.optional(S.String),
    ApiEndpoint: S.optional(S.String),
    ApiId: S.optional(S.String),
    ApiKey: S.optional(S.String),
    ApiName: S.optional(S.String),
    ApiSpecificationDownloadUrl: S.optional(S.String),
    ApiSpecificationDownloadUrlExpiresAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ProtocolType: S.optional(S.String),
    Stage: S.optional(S.String),
  }),
).annotations({
  identifier: "ApiGatewayApiAsset",
}) as any as S.Schema<ApiGatewayApiAsset>;
export interface KmsKeyToGrant {
  KmsKeyArn: string;
}
export const KmsKeyToGrant = S.suspend(() =>
  S.Struct({ KmsKeyArn: S.String }),
).annotations({
  identifier: "KmsKeyToGrant",
}) as any as S.Schema<KmsKeyToGrant>;
export type ListOfKmsKeysToGrant = KmsKeyToGrant[];
export const ListOfKmsKeysToGrant = S.Array(KmsKeyToGrant);
export interface S3DataAccessAsset {
  Bucket: string;
  KeyPrefixes?: ListOf__string;
  Keys?: ListOf__string;
  S3AccessPointAlias?: string;
  S3AccessPointArn?: string;
  KmsKeysToGrant?: ListOfKmsKeysToGrant;
}
export const S3DataAccessAsset = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    KeyPrefixes: S.optional(ListOf__string),
    Keys: S.optional(ListOf__string),
    S3AccessPointAlias: S.optional(S.String),
    S3AccessPointArn: S.optional(S.String),
    KmsKeysToGrant: S.optional(ListOfKmsKeysToGrant),
  }),
).annotations({
  identifier: "S3DataAccessAsset",
}) as any as S.Schema<S3DataAccessAsset>;
export type ListOfLFTagValues = string[];
export const ListOfLFTagValues = S.Array(S.String);
export interface LFTag {
  TagKey: string;
  TagValues: ListOfLFTagValues;
}
export const LFTag = S.suspend(() =>
  S.Struct({ TagKey: S.String, TagValues: ListOfLFTagValues }),
).annotations({ identifier: "LFTag" }) as any as S.Schema<LFTag>;
export type ListOfLFTags = LFTag[];
export const ListOfLFTags = S.Array(LFTag);
export interface DatabaseLFTagPolicy {
  Expression: ListOfLFTags;
}
export const DatabaseLFTagPolicy = S.suspend(() =>
  S.Struct({ Expression: ListOfLFTags }),
).annotations({
  identifier: "DatabaseLFTagPolicy",
}) as any as S.Schema<DatabaseLFTagPolicy>;
export interface TableLFTagPolicy {
  Expression: ListOfLFTags;
}
export const TableLFTagPolicy = S.suspend(() =>
  S.Struct({ Expression: ListOfLFTags }),
).annotations({
  identifier: "TableLFTagPolicy",
}) as any as S.Schema<TableLFTagPolicy>;
export interface LFResourceDetails {
  Database?: DatabaseLFTagPolicy;
  Table?: TableLFTagPolicy;
}
export const LFResourceDetails = S.suspend(() =>
  S.Struct({
    Database: S.optional(DatabaseLFTagPolicy),
    Table: S.optional(TableLFTagPolicy),
  }),
).annotations({
  identifier: "LFResourceDetails",
}) as any as S.Schema<LFResourceDetails>;
export interface LFTagPolicyDetails {
  CatalogId: string;
  ResourceType: string;
  ResourceDetails: LFResourceDetails;
}
export const LFTagPolicyDetails = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    ResourceType: S.String,
    ResourceDetails: LFResourceDetails,
  }),
).annotations({
  identifier: "LFTagPolicyDetails",
}) as any as S.Schema<LFTagPolicyDetails>;
export interface LakeFormationDataPermissionDetails {
  LFTagPolicy?: LFTagPolicyDetails;
}
export const LakeFormationDataPermissionDetails = S.suspend(() =>
  S.Struct({ LFTagPolicy: S.optional(LFTagPolicyDetails) }),
).annotations({
  identifier: "LakeFormationDataPermissionDetails",
}) as any as S.Schema<LakeFormationDataPermissionDetails>;
export type ListOfLFPermissions = string[];
export const ListOfLFPermissions = S.Array(S.String);
export interface LakeFormationDataPermissionAsset {
  LakeFormationDataPermissionDetails: LakeFormationDataPermissionDetails;
  LakeFormationDataPermissionType: string;
  Permissions: ListOfLFPermissions;
  RoleArn?: string;
}
export const LakeFormationDataPermissionAsset = S.suspend(() =>
  S.Struct({
    LakeFormationDataPermissionDetails: LakeFormationDataPermissionDetails,
    LakeFormationDataPermissionType: S.String,
    Permissions: ListOfLFPermissions,
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "LakeFormationDataPermissionAsset",
}) as any as S.Schema<LakeFormationDataPermissionAsset>;
export interface AssetDetails {
  S3SnapshotAsset?: S3SnapshotAsset;
  RedshiftDataShareAsset?: RedshiftDataShareAsset;
  ApiGatewayApiAsset?: ApiGatewayApiAsset;
  S3DataAccessAsset?: S3DataAccessAsset;
  LakeFormationDataPermissionAsset?: LakeFormationDataPermissionAsset;
}
export const AssetDetails = S.suspend(() =>
  S.Struct({
    S3SnapshotAsset: S.optional(S3SnapshotAsset),
    RedshiftDataShareAsset: S.optional(RedshiftDataShareAsset),
    ApiGatewayApiAsset: S.optional(ApiGatewayApiAsset),
    S3DataAccessAsset: S.optional(S3DataAccessAsset),
    LakeFormationDataPermissionAsset: S.optional(
      LakeFormationDataPermissionAsset,
    ),
  }),
).annotations({ identifier: "AssetDetails" }) as any as S.Schema<AssetDetails>;
export interface UpdateAssetResponse {
  Arn?: string;
  AssetDetails?: AssetDetails;
  AssetType?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Id?: string;
  Name?: string;
  RevisionId?: string;
  SourceId?: string;
  UpdatedAt?: Date;
}
export const UpdateAssetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssetDetails: S.optional(AssetDetails),
    AssetType: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    RevisionId: S.optional(S.String),
    SourceId: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateAssetResponse",
}) as any as S.Schema<UpdateAssetResponse>;
export interface UpdateDataSetResponse {
  Arn?: string;
  AssetType?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  Name?: string;
  Origin?: string;
  OriginDetails?: OriginDetails;
  SourceId?: string;
  UpdatedAt?: Date;
}
export const UpdateDataSetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssetType: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Origin: S.optional(S.String),
    OriginDetails: S.optional(OriginDetails),
    SourceId: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateDataSetResponse",
}) as any as S.Schema<UpdateDataSetResponse>;
export interface UpdateEventActionResponse {
  Action?: Action;
  Arn?: string;
  CreatedAt?: Date;
  Event?: Event;
  Id?: string;
  UpdatedAt?: Date;
}
export const UpdateEventActionResponse = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Event: S.optional(Event),
    Id: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateEventActionResponse",
}) as any as S.Schema<UpdateEventActionResponse>;
export interface UpdateRevisionResponse {
  Arn?: string;
  Comment?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Finalized?: boolean;
  Id?: string;
  SourceId?: string;
  UpdatedAt?: Date;
  RevocationComment?: string;
  Revoked?: boolean;
  RevokedAt?: Date;
}
export const UpdateRevisionResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Comment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Finalized: S.optional(S.Boolean),
    Id: S.optional(S.String),
    SourceId: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RevocationComment: S.optional(S.String),
    Revoked: S.optional(S.Boolean),
    RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UpdateRevisionResponse",
}) as any as S.Schema<UpdateRevisionResponse>;
export interface ExportAssetToSignedUrlRequestDetails {
  AssetId: string;
  DataSetId: string;
  RevisionId: string;
}
export const ExportAssetToSignedUrlRequestDetails = S.suspend(() =>
  S.Struct({ AssetId: S.String, DataSetId: S.String, RevisionId: S.String }),
).annotations({
  identifier: "ExportAssetToSignedUrlRequestDetails",
}) as any as S.Schema<ExportAssetToSignedUrlRequestDetails>;
export interface ImportAssetFromSignedUrlRequestDetails {
  AssetName: string;
  DataSetId: string;
  Md5Hash: string;
  RevisionId: string;
}
export const ImportAssetFromSignedUrlRequestDetails = S.suspend(() =>
  S.Struct({
    AssetName: S.String,
    DataSetId: S.String,
    Md5Hash: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ImportAssetFromSignedUrlRequestDetails",
}) as any as S.Schema<ImportAssetFromSignedUrlRequestDetails>;
export interface ImportAssetFromApiGatewayApiRequestDetails {
  ApiDescription?: string;
  ApiId: string;
  ApiKey?: string;
  ApiName: string;
  ApiSpecificationMd5Hash: string;
  DataSetId: string;
  ProtocolType: string;
  RevisionId: string;
  Stage: string;
}
export const ImportAssetFromApiGatewayApiRequestDetails = S.suspend(() =>
  S.Struct({
    ApiDescription: S.optional(S.String),
    ApiId: S.String,
    ApiKey: S.optional(S.String),
    ApiName: S.String,
    ApiSpecificationMd5Hash: S.String,
    DataSetId: S.String,
    ProtocolType: S.String,
    RevisionId: S.String,
    Stage: S.String,
  }),
).annotations({
  identifier: "ImportAssetFromApiGatewayApiRequestDetails",
}) as any as S.Schema<ImportAssetFromApiGatewayApiRequestDetails>;
export interface LakeFormationTagPolicyDetails {
  Database?: string;
  Table?: string;
}
export const LakeFormationTagPolicyDetails = S.suspend(() =>
  S.Struct({ Database: S.optional(S.String), Table: S.optional(S.String) }),
).annotations({
  identifier: "LakeFormationTagPolicyDetails",
}) as any as S.Schema<LakeFormationTagPolicyDetails>;
export type ListOfLakeFormationTagPolicies = LakeFormationTagPolicyDetails[];
export const ListOfLakeFormationTagPolicies = S.Array(
  LakeFormationTagPolicyDetails,
);
export interface RedshiftDataShareDetails {
  Arn: string;
  Database: string;
  Function?: string;
  Table?: string;
  Schema?: string;
  View?: string;
}
export const RedshiftDataShareDetails = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Database: S.String,
    Function: S.optional(S.String),
    Table: S.optional(S.String),
    Schema: S.optional(S.String),
    View: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftDataShareDetails",
}) as any as S.Schema<RedshiftDataShareDetails>;
export type ListOfRedshiftDataShares = RedshiftDataShareDetails[];
export const ListOfRedshiftDataShares = S.Array(RedshiftDataShareDetails);
export interface S3DataAccessDetails {
  KeyPrefixes?: ListOf__string;
  Keys?: ListOf__string;
}
export const S3DataAccessDetails = S.suspend(() =>
  S.Struct({
    KeyPrefixes: S.optional(ListOf__string),
    Keys: S.optional(ListOf__string),
  }),
).annotations({
  identifier: "S3DataAccessDetails",
}) as any as S.Schema<S3DataAccessDetails>;
export type ListOfS3DataAccesses = S3DataAccessDetails[];
export const ListOfS3DataAccesses = S.Array(S3DataAccessDetails);
export interface DataUpdateRequestDetails {
  DataUpdatedAt?: Date;
}
export const DataUpdateRequestDetails = S.suspend(() =>
  S.Struct({
    DataUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DataUpdateRequestDetails",
}) as any as S.Schema<DataUpdateRequestDetails>;
export interface DeprecationRequestDetails {
  DeprecationAt: Date;
}
export const DeprecationRequestDetails = S.suspend(() =>
  S.Struct({ DeprecationAt: S.Date.pipe(T.TimestampFormat("date-time")) }),
).annotations({
  identifier: "DeprecationRequestDetails",
}) as any as S.Schema<DeprecationRequestDetails>;
export type ListOfDatabaseLFTagPolicyPermissions = string[];
export const ListOfDatabaseLFTagPolicyPermissions = S.Array(S.String);
export type ListOfTableTagPolicyLFPermissions = string[];
export const ListOfTableTagPolicyLFPermissions = S.Array(S.String);
export interface DataGrantSummaryEntry {
  Name: string;
  SenderPrincipal: string;
  ReceiverPrincipal: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  DataSetId: string;
  SourceDataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
export const DataGrantSummaryEntry = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.String,
    ReceiverPrincipal: S.String,
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.String,
    SourceDataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DataGrantSummaryEntry",
}) as any as S.Schema<DataGrantSummaryEntry>;
export type ListOfDataGrantSummaryEntry = DataGrantSummaryEntry[];
export const ListOfDataGrantSummaryEntry = S.Array(DataGrantSummaryEntry);
export interface RevisionEntry {
  Arn: string;
  Comment?: string;
  CreatedAt: Date;
  DataSetId: string;
  Finalized?: boolean;
  Id: string;
  SourceId?: string;
  UpdatedAt: Date;
  RevocationComment?: string;
  Revoked?: boolean;
  RevokedAt?: Date;
}
export const RevisionEntry = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Comment: S.optional(S.String),
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    DataSetId: S.String,
    Finalized: S.optional(S.Boolean),
    Id: S.String,
    SourceId: S.optional(S.String),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    RevocationComment: S.optional(S.String),
    Revoked: S.optional(S.Boolean),
    RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RevisionEntry",
}) as any as S.Schema<RevisionEntry>;
export type ListOfRevisionEntry = RevisionEntry[];
export const ListOfRevisionEntry = S.Array(RevisionEntry);
export interface DataSetEntry {
  Arn: string;
  AssetType: string;
  CreatedAt: Date;
  Description: string;
  Id: string;
  Name: string;
  Origin: string;
  OriginDetails?: OriginDetails;
  SourceId?: string;
  UpdatedAt: Date;
}
export const DataSetEntry = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    AssetType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Description: S.String,
    Id: S.String,
    Name: S.String,
    Origin: S.String,
    OriginDetails: S.optional(OriginDetails),
    SourceId: S.optional(S.String),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "DataSetEntry" }) as any as S.Schema<DataSetEntry>;
export type ListOfDataSetEntry = DataSetEntry[];
export const ListOfDataSetEntry = S.Array(DataSetEntry);
export interface EventActionEntry {
  Action: Action;
  Arn: string;
  CreatedAt: Date;
  Event: Event;
  Id: string;
  UpdatedAt: Date;
}
export const EventActionEntry = S.suspend(() =>
  S.Struct({
    Action: Action,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Event: Event,
    Id: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "EventActionEntry",
}) as any as S.Schema<EventActionEntry>;
export type ListOfEventActionEntry = EventActionEntry[];
export const ListOfEventActionEntry = S.Array(EventActionEntry);
export interface ExportAssetToSignedUrlResponseDetails {
  AssetId: string;
  DataSetId: string;
  RevisionId: string;
  SignedUrl?: string;
  SignedUrlExpiresAt?: Date;
}
export const ExportAssetToSignedUrlResponseDetails = S.suspend(() =>
  S.Struct({
    AssetId: S.String,
    DataSetId: S.String,
    RevisionId: S.String,
    SignedUrl: S.optional(S.String),
    SignedUrlExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ExportAssetToSignedUrlResponseDetails",
}) as any as S.Schema<ExportAssetToSignedUrlResponseDetails>;
export interface AssetDestinationEntry {
  AssetId: string;
  Bucket: string;
  Key?: string;
}
export const AssetDestinationEntry = S.suspend(() =>
  S.Struct({ AssetId: S.String, Bucket: S.String, Key: S.optional(S.String) }),
).annotations({
  identifier: "AssetDestinationEntry",
}) as any as S.Schema<AssetDestinationEntry>;
export type ListOfAssetDestinationEntry = AssetDestinationEntry[];
export const ListOfAssetDestinationEntry = S.Array(AssetDestinationEntry);
export interface ExportAssetsToS3ResponseDetails {
  AssetDestinations: ListOfAssetDestinationEntry;
  DataSetId: string;
  Encryption?: ExportServerSideEncryption;
  RevisionId: string;
}
export const ExportAssetsToS3ResponseDetails = S.suspend(() =>
  S.Struct({
    AssetDestinations: ListOfAssetDestinationEntry,
    DataSetId: S.String,
    Encryption: S.optional(ExportServerSideEncryption),
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ExportAssetsToS3ResponseDetails",
}) as any as S.Schema<ExportAssetsToS3ResponseDetails>;
export interface RevisionDestinationEntry {
  Bucket: string;
  KeyPattern?: string;
  RevisionId: string;
}
export const RevisionDestinationEntry = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    KeyPattern: S.optional(S.String),
    RevisionId: S.String,
  }),
).annotations({
  identifier: "RevisionDestinationEntry",
}) as any as S.Schema<RevisionDestinationEntry>;
export type ListOfRevisionDestinationEntry = RevisionDestinationEntry[];
export const ListOfRevisionDestinationEntry = S.Array(RevisionDestinationEntry);
export interface ExportRevisionsToS3ResponseDetails {
  DataSetId: string;
  Encryption?: ExportServerSideEncryption;
  RevisionDestinations: ListOfRevisionDestinationEntry;
  EventActionArn?: string;
}
export const ExportRevisionsToS3ResponseDetails = S.suspend(() =>
  S.Struct({
    DataSetId: S.String,
    Encryption: S.optional(ExportServerSideEncryption),
    RevisionDestinations: ListOfRevisionDestinationEntry,
    EventActionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportRevisionsToS3ResponseDetails",
}) as any as S.Schema<ExportRevisionsToS3ResponseDetails>;
export interface ImportAssetFromSignedUrlResponseDetails {
  AssetName: string;
  DataSetId: string;
  Md5Hash?: string;
  RevisionId: string;
  SignedUrl?: string;
  SignedUrlExpiresAt?: Date;
}
export const ImportAssetFromSignedUrlResponseDetails = S.suspend(() =>
  S.Struct({
    AssetName: S.String,
    DataSetId: S.String,
    Md5Hash: S.optional(S.String),
    RevisionId: S.String,
    SignedUrl: S.optional(S.String),
    SignedUrlExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ImportAssetFromSignedUrlResponseDetails",
}) as any as S.Schema<ImportAssetFromSignedUrlResponseDetails>;
export interface AssetSourceEntry {
  Bucket: string;
  Key: string;
}
export const AssetSourceEntry = S.suspend(() =>
  S.Struct({ Bucket: S.String, Key: S.String }),
).annotations({
  identifier: "AssetSourceEntry",
}) as any as S.Schema<AssetSourceEntry>;
export type ListOfAssetSourceEntry = AssetSourceEntry[];
export const ListOfAssetSourceEntry = S.Array(AssetSourceEntry);
export interface ImportAssetsFromS3ResponseDetails {
  AssetSources: ListOfAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromS3ResponseDetails = S.suspend(() =>
  S.Struct({
    AssetSources: ListOfAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ImportAssetsFromS3ResponseDetails",
}) as any as S.Schema<ImportAssetsFromS3ResponseDetails>;
export interface RedshiftDataShareAssetSourceEntry {
  DataShareArn: string;
}
export const RedshiftDataShareAssetSourceEntry = S.suspend(() =>
  S.Struct({ DataShareArn: S.String }),
).annotations({
  identifier: "RedshiftDataShareAssetSourceEntry",
}) as any as S.Schema<RedshiftDataShareAssetSourceEntry>;
export type ListOfRedshiftDataShareAssetSourceEntry =
  RedshiftDataShareAssetSourceEntry[];
export const ListOfRedshiftDataShareAssetSourceEntry = S.Array(
  RedshiftDataShareAssetSourceEntry,
);
export interface ImportAssetsFromRedshiftDataSharesResponseDetails {
  AssetSources: ListOfRedshiftDataShareAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromRedshiftDataSharesResponseDetails = S.suspend(() =>
  S.Struct({
    AssetSources: ListOfRedshiftDataShareAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ImportAssetsFromRedshiftDataSharesResponseDetails",
}) as any as S.Schema<ImportAssetsFromRedshiftDataSharesResponseDetails>;
export interface ImportAssetFromApiGatewayApiResponseDetails {
  ApiDescription?: string;
  ApiId: string;
  ApiKey?: string;
  ApiName: string;
  ApiSpecificationMd5Hash: string;
  ApiSpecificationUploadUrl: string;
  ApiSpecificationUploadUrlExpiresAt: Date;
  DataSetId: string;
  ProtocolType: string;
  RevisionId: string;
  Stage: string;
}
export const ImportAssetFromApiGatewayApiResponseDetails = S.suspend(() =>
  S.Struct({
    ApiDescription: S.optional(S.String),
    ApiId: S.String,
    ApiKey: S.optional(S.String),
    ApiName: S.String,
    ApiSpecificationMd5Hash: S.String,
    ApiSpecificationUploadUrl: S.String,
    ApiSpecificationUploadUrlExpiresAt: S.Date.pipe(
      T.TimestampFormat("date-time"),
    ),
    DataSetId: S.String,
    ProtocolType: S.String,
    RevisionId: S.String,
    Stage: S.String,
  }),
).annotations({
  identifier: "ImportAssetFromApiGatewayApiResponseDetails",
}) as any as S.Schema<ImportAssetFromApiGatewayApiResponseDetails>;
export interface S3DataAccessAssetSourceEntry {
  Bucket: string;
  KeyPrefixes?: ListOf__string;
  Keys?: ListOf__string;
  KmsKeysToGrant?: ListOfKmsKeysToGrant;
}
export const S3DataAccessAssetSourceEntry = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    KeyPrefixes: S.optional(ListOf__string),
    Keys: S.optional(ListOf__string),
    KmsKeysToGrant: S.optional(ListOfKmsKeysToGrant),
  }),
).annotations({
  identifier: "S3DataAccessAssetSourceEntry",
}) as any as S.Schema<S3DataAccessAssetSourceEntry>;
export interface CreateS3DataAccessFromS3BucketResponseDetails {
  AssetSource: S3DataAccessAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const CreateS3DataAccessFromS3BucketResponseDetails = S.suspend(() =>
  S.Struct({
    AssetSource: S3DataAccessAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "CreateS3DataAccessFromS3BucketResponseDetails",
}) as any as S.Schema<CreateS3DataAccessFromS3BucketResponseDetails>;
export interface DatabaseLFTagPolicyAndPermissions {
  Expression: ListOfLFTags;
  Permissions: ListOfDatabaseLFTagPolicyPermissions;
}
export const DatabaseLFTagPolicyAndPermissions = S.suspend(() =>
  S.Struct({
    Expression: ListOfLFTags,
    Permissions: ListOfDatabaseLFTagPolicyPermissions,
  }),
).annotations({
  identifier: "DatabaseLFTagPolicyAndPermissions",
}) as any as S.Schema<DatabaseLFTagPolicyAndPermissions>;
export interface TableLFTagPolicyAndPermissions {
  Expression: ListOfLFTags;
  Permissions: ListOfTableTagPolicyLFPermissions;
}
export const TableLFTagPolicyAndPermissions = S.suspend(() =>
  S.Struct({
    Expression: ListOfLFTags,
    Permissions: ListOfTableTagPolicyLFPermissions,
  }),
).annotations({
  identifier: "TableLFTagPolicyAndPermissions",
}) as any as S.Schema<TableLFTagPolicyAndPermissions>;
export interface ImportAssetsFromLakeFormationTagPolicyResponseDetails {
  CatalogId: string;
  Database?: DatabaseLFTagPolicyAndPermissions;
  Table?: TableLFTagPolicyAndPermissions;
  RoleArn: string;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromLakeFormationTagPolicyResponseDetails = S.suspend(
  () =>
    S.Struct({
      CatalogId: S.String,
      Database: S.optional(DatabaseLFTagPolicyAndPermissions),
      Table: S.optional(TableLFTagPolicyAndPermissions),
      RoleArn: S.String,
      DataSetId: S.String,
      RevisionId: S.String,
    }),
).annotations({
  identifier: "ImportAssetsFromLakeFormationTagPolicyResponseDetails",
}) as any as S.Schema<ImportAssetsFromLakeFormationTagPolicyResponseDetails>;
export interface ResponseDetails {
  ExportAssetToSignedUrl?: ExportAssetToSignedUrlResponseDetails;
  ExportAssetsToS3?: ExportAssetsToS3ResponseDetails;
  ExportRevisionsToS3?: ExportRevisionsToS3ResponseDetails;
  ImportAssetFromSignedUrl?: ImportAssetFromSignedUrlResponseDetails;
  ImportAssetsFromS3?: ImportAssetsFromS3ResponseDetails;
  ImportAssetsFromRedshiftDataShares?: ImportAssetsFromRedshiftDataSharesResponseDetails;
  ImportAssetFromApiGatewayApi?: ImportAssetFromApiGatewayApiResponseDetails;
  CreateS3DataAccessFromS3Bucket?: CreateS3DataAccessFromS3BucketResponseDetails;
  ImportAssetsFromLakeFormationTagPolicy?: ImportAssetsFromLakeFormationTagPolicyResponseDetails;
}
export const ResponseDetails = S.suspend(() =>
  S.Struct({
    ExportAssetToSignedUrl: S.optional(ExportAssetToSignedUrlResponseDetails),
    ExportAssetsToS3: S.optional(ExportAssetsToS3ResponseDetails),
    ExportRevisionsToS3: S.optional(ExportRevisionsToS3ResponseDetails),
    ImportAssetFromSignedUrl: S.optional(
      ImportAssetFromSignedUrlResponseDetails,
    ),
    ImportAssetsFromS3: S.optional(ImportAssetsFromS3ResponseDetails),
    ImportAssetsFromRedshiftDataShares: S.optional(
      ImportAssetsFromRedshiftDataSharesResponseDetails,
    ),
    ImportAssetFromApiGatewayApi: S.optional(
      ImportAssetFromApiGatewayApiResponseDetails,
    ),
    CreateS3DataAccessFromS3Bucket: S.optional(
      CreateS3DataAccessFromS3BucketResponseDetails,
    ),
    ImportAssetsFromLakeFormationTagPolicy: S.optional(
      ImportAssetsFromLakeFormationTagPolicyResponseDetails,
    ),
  }),
).annotations({
  identifier: "ResponseDetails",
}) as any as S.Schema<ResponseDetails>;
export interface ImportAssetFromSignedUrlJobErrorDetails {
  AssetName: string;
}
export const ImportAssetFromSignedUrlJobErrorDetails = S.suspend(() =>
  S.Struct({ AssetName: S.String }),
).annotations({
  identifier: "ImportAssetFromSignedUrlJobErrorDetails",
}) as any as S.Schema<ImportAssetFromSignedUrlJobErrorDetails>;
export interface Details {
  ImportAssetFromSignedUrlJobErrorDetails?: ImportAssetFromSignedUrlJobErrorDetails;
  ImportAssetsFromS3JobErrorDetails?: ListOfAssetSourceEntry;
}
export const Details = S.suspend(() =>
  S.Struct({
    ImportAssetFromSignedUrlJobErrorDetails: S.optional(
      ImportAssetFromSignedUrlJobErrorDetails,
    ),
    ImportAssetsFromS3JobErrorDetails: S.optional(ListOfAssetSourceEntry),
  }),
).annotations({ identifier: "Details" }) as any as S.Schema<Details>;
export interface JobError {
  Code: string;
  Details?: Details;
  LimitName?: string;
  LimitValue?: number;
  Message: string;
  ResourceId?: string;
  ResourceType?: string;
}
export const JobError = S.suspend(() =>
  S.Struct({
    Code: S.String,
    Details: S.optional(Details),
    LimitName: S.optional(S.String),
    LimitValue: S.optional(S.Number),
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({ identifier: "JobError" }) as any as S.Schema<JobError>;
export type ListOfJobError = JobError[];
export const ListOfJobError = S.Array(JobError);
export interface JobEntry {
  Arn: string;
  CreatedAt: Date;
  Details: ResponseDetails;
  Errors?: ListOfJobError;
  Id: string;
  State: string;
  Type: string;
  UpdatedAt: Date;
}
export const JobEntry = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Details: ResponseDetails,
    Errors: S.optional(ListOfJobError),
    Id: S.String,
    State: S.String,
    Type: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "JobEntry" }) as any as S.Schema<JobEntry>;
export type ListOfJobEntry = JobEntry[];
export const ListOfJobEntry = S.Array(JobEntry);
export interface ReceivedDataGrantSummariesEntry {
  Name: string;
  SenderPrincipal: string;
  ReceiverPrincipal: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  DataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}
export const ReceivedDataGrantSummariesEntry = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.String,
    ReceiverPrincipal: S.String,
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ReceivedDataGrantSummariesEntry",
}) as any as S.Schema<ReceivedDataGrantSummariesEntry>;
export type ListOfReceivedDataGrantSummariesEntry =
  ReceivedDataGrantSummariesEntry[];
export const ListOfReceivedDataGrantSummariesEntry = S.Array(
  ReceivedDataGrantSummariesEntry,
);
export interface AssetEntry {
  Arn: string;
  AssetDetails: AssetDetails;
  AssetType: string;
  CreatedAt: Date;
  DataSetId: string;
  Id: string;
  Name: string;
  RevisionId: string;
  SourceId?: string;
  UpdatedAt: Date;
}
export const AssetEntry = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    AssetDetails: AssetDetails,
    AssetType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    DataSetId: S.String,
    Id: S.String,
    Name: S.String,
    RevisionId: S.String,
    SourceId: S.optional(S.String),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "AssetEntry" }) as any as S.Schema<AssetEntry>;
export type ListOfAssetEntry = AssetEntry[];
export const ListOfAssetEntry = S.Array(AssetEntry);
export interface ScopeDetails {
  LakeFormationTagPolicies?: ListOfLakeFormationTagPolicies;
  RedshiftDataShares?: ListOfRedshiftDataShares;
  S3DataAccesses?: ListOfS3DataAccesses;
}
export const ScopeDetails = S.suspend(() =>
  S.Struct({
    LakeFormationTagPolicies: S.optional(ListOfLakeFormationTagPolicies),
    RedshiftDataShares: S.optional(ListOfRedshiftDataShares),
    S3DataAccesses: S.optional(ListOfS3DataAccesses),
  }),
).annotations({ identifier: "ScopeDetails" }) as any as S.Schema<ScopeDetails>;
export interface SchemaChangeDetails {
  Name: string;
  Type: string;
  Description?: string;
}
export const SchemaChangeDetails = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaChangeDetails",
}) as any as S.Schema<SchemaChangeDetails>;
export type ListOfSchemaChangeDetails = SchemaChangeDetails[];
export const ListOfSchemaChangeDetails = S.Array(SchemaChangeDetails);
export interface CreateDataGrantResponse {
  Name: string;
  SenderPrincipal: string;
  ReceiverPrincipal: string;
  Description?: string;
  AcceptanceState: string;
  AcceptedAt?: Date;
  EndsAt?: Date;
  GrantDistributionScope: string;
  DataSetId: string;
  SourceDataSetId: string;
  Id: string;
  Arn: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  Tags?: MapOf__string;
}
export const CreateDataGrantResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SenderPrincipal: S.String,
    ReceiverPrincipal: S.String,
    Description: S.optional(S.String),
    AcceptanceState: S.String,
    AcceptedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndsAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    GrantDistributionScope: S.String,
    DataSetId: S.String,
    SourceDataSetId: S.String,
    Id: S.String,
    Arn: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Tags: S.optional(MapOf__string),
  }),
).annotations({
  identifier: "CreateDataGrantResponse",
}) as any as S.Schema<CreateDataGrantResponse>;
export interface CreateDataSetResponse {
  Arn?: string;
  AssetType?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  Name?: string;
  Origin?: string;
  OriginDetails?: OriginDetails;
  SourceId?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
}
export const CreateDataSetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssetType: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Origin: S.optional(S.String),
    OriginDetails: S.optional(OriginDetails),
    SourceId: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateDataSetResponse",
}) as any as S.Schema<CreateDataSetResponse>;
export interface ListDataGrantsResponse {
  DataGrantSummaries?: ListOfDataGrantSummaryEntry;
  NextToken?: string;
}
export const ListDataGrantsResponse = S.suspend(() =>
  S.Struct({
    DataGrantSummaries: S.optional(ListOfDataGrantSummaryEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataGrantsResponse",
}) as any as S.Schema<ListDataGrantsResponse>;
export interface ListDataSetRevisionsResponse {
  NextToken?: string;
  Revisions?: ListOfRevisionEntry;
}
export const ListDataSetRevisionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Revisions: S.optional(ListOfRevisionEntry),
  }),
).annotations({
  identifier: "ListDataSetRevisionsResponse",
}) as any as S.Schema<ListDataSetRevisionsResponse>;
export interface ListDataSetsResponse {
  DataSets?: ListOfDataSetEntry;
  NextToken?: string;
}
export const ListDataSetsResponse = S.suspend(() =>
  S.Struct({
    DataSets: S.optional(ListOfDataSetEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSetsResponse",
}) as any as S.Schema<ListDataSetsResponse>;
export interface ListEventActionsResponse {
  EventActions?: ListOfEventActionEntry;
  NextToken?: string;
}
export const ListEventActionsResponse = S.suspend(() =>
  S.Struct({
    EventActions: S.optional(ListOfEventActionEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventActionsResponse",
}) as any as S.Schema<ListEventActionsResponse>;
export interface ListJobsResponse {
  Jobs?: ListOfJobEntry;
  NextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(ListOfJobEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface ListReceivedDataGrantsResponse {
  DataGrantSummaries?: ListOfReceivedDataGrantSummariesEntry;
  NextToken?: string;
}
export const ListReceivedDataGrantsResponse = S.suspend(() =>
  S.Struct({
    DataGrantSummaries: S.optional(ListOfReceivedDataGrantSummariesEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReceivedDataGrantsResponse",
}) as any as S.Schema<ListReceivedDataGrantsResponse>;
export interface ListRevisionAssetsResponse {
  Assets?: ListOfAssetEntry;
  NextToken?: string;
}
export const ListRevisionAssetsResponse = S.suspend(() =>
  S.Struct({
    Assets: S.optional(ListOfAssetEntry),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRevisionAssetsResponse",
}) as any as S.Schema<ListRevisionAssetsResponse>;
export interface ExportAssetsToS3RequestDetails {
  AssetDestinations: ListOfAssetDestinationEntry;
  DataSetId: string;
  Encryption?: ExportServerSideEncryption;
  RevisionId: string;
}
export const ExportAssetsToS3RequestDetails = S.suspend(() =>
  S.Struct({
    AssetDestinations: ListOfAssetDestinationEntry,
    DataSetId: S.String,
    Encryption: S.optional(ExportServerSideEncryption),
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ExportAssetsToS3RequestDetails",
}) as any as S.Schema<ExportAssetsToS3RequestDetails>;
export interface ExportRevisionsToS3RequestDetails {
  DataSetId: string;
  Encryption?: ExportServerSideEncryption;
  RevisionDestinations: ListOfRevisionDestinationEntry;
}
export const ExportRevisionsToS3RequestDetails = S.suspend(() =>
  S.Struct({
    DataSetId: S.String,
    Encryption: S.optional(ExportServerSideEncryption),
    RevisionDestinations: ListOfRevisionDestinationEntry,
  }),
).annotations({
  identifier: "ExportRevisionsToS3RequestDetails",
}) as any as S.Schema<ExportRevisionsToS3RequestDetails>;
export interface ImportAssetsFromS3RequestDetails {
  AssetSources: ListOfAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromS3RequestDetails = S.suspend(() =>
  S.Struct({
    AssetSources: ListOfAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ImportAssetsFromS3RequestDetails",
}) as any as S.Schema<ImportAssetsFromS3RequestDetails>;
export interface ImportAssetsFromRedshiftDataSharesRequestDetails {
  AssetSources: ListOfRedshiftDataShareAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromRedshiftDataSharesRequestDetails = S.suspend(() =>
  S.Struct({
    AssetSources: ListOfRedshiftDataShareAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "ImportAssetsFromRedshiftDataSharesRequestDetails",
}) as any as S.Schema<ImportAssetsFromRedshiftDataSharesRequestDetails>;
export interface SchemaChangeRequestDetails {
  Changes?: ListOfSchemaChangeDetails;
  SchemaChangeAt: Date;
}
export const SchemaChangeRequestDetails = S.suspend(() =>
  S.Struct({
    Changes: S.optional(ListOfSchemaChangeDetails),
    SchemaChangeAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "SchemaChangeRequestDetails",
}) as any as S.Schema<SchemaChangeRequestDetails>;
export interface NotificationDetails {
  DataUpdate?: DataUpdateRequestDetails;
  Deprecation?: DeprecationRequestDetails;
  SchemaChange?: SchemaChangeRequestDetails;
}
export const NotificationDetails = S.suspend(() =>
  S.Struct({
    DataUpdate: S.optional(DataUpdateRequestDetails),
    Deprecation: S.optional(DeprecationRequestDetails),
    SchemaChange: S.optional(SchemaChangeRequestDetails),
  }),
).annotations({
  identifier: "NotificationDetails",
}) as any as S.Schema<NotificationDetails>;
export interface CreateEventActionRequest {
  Action: Action;
  Event: Event;
  Tags?: MapOf__string;
}
export const CreateEventActionRequest = S.suspend(() =>
  S.Struct({
    Action: Action,
    Event: Event,
    Tags: S.optional(MapOf__string),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/event-actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventActionRequest",
}) as any as S.Schema<CreateEventActionRequest>;
export interface SendDataSetNotificationRequest {
  Scope?: ScopeDetails;
  ClientToken?: string;
  Comment?: string;
  DataSetId: string;
  Details?: NotificationDetails;
  Type: string;
}
export const SendDataSetNotificationRequest = S.suspend(() =>
  S.Struct({
    Scope: S.optional(ScopeDetails),
    ClientToken: S.optional(S.String),
    Comment: S.optional(S.String),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Details: S.optional(NotificationDetails),
    Type: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/data-sets/{DataSetId}/notification" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendDataSetNotificationRequest",
}) as any as S.Schema<SendDataSetNotificationRequest>;
export interface SendDataSetNotificationResponse {}
export const SendDataSetNotificationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendDataSetNotificationResponse",
}) as any as S.Schema<SendDataSetNotificationResponse>;
export interface CreateS3DataAccessFromS3BucketRequestDetails {
  AssetSource: S3DataAccessAssetSourceEntry;
  DataSetId: string;
  RevisionId: string;
}
export const CreateS3DataAccessFromS3BucketRequestDetails = S.suspend(() =>
  S.Struct({
    AssetSource: S3DataAccessAssetSourceEntry,
    DataSetId: S.String,
    RevisionId: S.String,
  }),
).annotations({
  identifier: "CreateS3DataAccessFromS3BucketRequestDetails",
}) as any as S.Schema<CreateS3DataAccessFromS3BucketRequestDetails>;
export interface ImportAssetsFromLakeFormationTagPolicyRequestDetails {
  CatalogId: string;
  Database?: DatabaseLFTagPolicyAndPermissions;
  Table?: TableLFTagPolicyAndPermissions;
  RoleArn: string;
  DataSetId: string;
  RevisionId: string;
}
export const ImportAssetsFromLakeFormationTagPolicyRequestDetails = S.suspend(
  () =>
    S.Struct({
      CatalogId: S.String,
      Database: S.optional(DatabaseLFTagPolicyAndPermissions),
      Table: S.optional(TableLFTagPolicyAndPermissions),
      RoleArn: S.String,
      DataSetId: S.String,
      RevisionId: S.String,
    }),
).annotations({
  identifier: "ImportAssetsFromLakeFormationTagPolicyRequestDetails",
}) as any as S.Schema<ImportAssetsFromLakeFormationTagPolicyRequestDetails>;
export interface RequestDetails {
  ExportAssetToSignedUrl?: ExportAssetToSignedUrlRequestDetails;
  ExportAssetsToS3?: ExportAssetsToS3RequestDetails;
  ExportRevisionsToS3?: ExportRevisionsToS3RequestDetails;
  ImportAssetFromSignedUrl?: ImportAssetFromSignedUrlRequestDetails;
  ImportAssetsFromS3?: ImportAssetsFromS3RequestDetails;
  ImportAssetsFromRedshiftDataShares?: ImportAssetsFromRedshiftDataSharesRequestDetails;
  ImportAssetFromApiGatewayApi?: ImportAssetFromApiGatewayApiRequestDetails;
  CreateS3DataAccessFromS3Bucket?: CreateS3DataAccessFromS3BucketRequestDetails;
  ImportAssetsFromLakeFormationTagPolicy?: ImportAssetsFromLakeFormationTagPolicyRequestDetails;
}
export const RequestDetails = S.suspend(() =>
  S.Struct({
    ExportAssetToSignedUrl: S.optional(ExportAssetToSignedUrlRequestDetails),
    ExportAssetsToS3: S.optional(ExportAssetsToS3RequestDetails),
    ExportRevisionsToS3: S.optional(ExportRevisionsToS3RequestDetails),
    ImportAssetFromSignedUrl: S.optional(
      ImportAssetFromSignedUrlRequestDetails,
    ),
    ImportAssetsFromS3: S.optional(ImportAssetsFromS3RequestDetails),
    ImportAssetsFromRedshiftDataShares: S.optional(
      ImportAssetsFromRedshiftDataSharesRequestDetails,
    ),
    ImportAssetFromApiGatewayApi: S.optional(
      ImportAssetFromApiGatewayApiRequestDetails,
    ),
    CreateS3DataAccessFromS3Bucket: S.optional(
      CreateS3DataAccessFromS3BucketRequestDetails,
    ),
    ImportAssetsFromLakeFormationTagPolicy: S.optional(
      ImportAssetsFromLakeFormationTagPolicyRequestDetails,
    ),
  }),
).annotations({
  identifier: "RequestDetails",
}) as any as S.Schema<RequestDetails>;
export interface CreateEventActionResponse {
  Action?: Action;
  Arn?: string;
  CreatedAt?: Date;
  Event?: Event;
  Id?: string;
  Tags?: MapOf__string;
  UpdatedAt?: Date;
}
export const CreateEventActionResponse = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Event: S.optional(Event),
    Id: S.optional(S.String),
    Tags: S.optional(MapOf__string),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateEventActionResponse",
}) as any as S.Schema<CreateEventActionResponse>;
export interface CreateJobRequest {
  Details: RequestDetails;
  Type: string;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({ Details: RequestDetails, Type: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface GetJobResponse {
  Arn?: string;
  CreatedAt?: Date;
  Details?: ResponseDetails;
  Errors?: ListOfJobError;
  Id?: string;
  State?: string;
  Type?: string;
  UpdatedAt?: Date;
}
export const GetJobResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Details: S.optional(ResponseDetails),
    Errors: S.optional(ListOfJobError),
    Id: S.optional(S.String),
    State: S.optional(S.String),
    Type: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetJobResponse",
}) as any as S.Schema<GetJobResponse>;
export interface CreateJobResponse {
  Arn?: string;
  CreatedAt?: Date;
  Details?: ResponseDetails;
  Errors?: ListOfJobError;
  Id?: string;
  State?: string;
  Type?: string;
  UpdatedAt?: Date;
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Details: S.optional(ResponseDetails),
    Errors: S.optional(ListOfJobError),
    Id: S.optional(S.String),
    State: S.optional(S.String),
    Type: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;
export interface GetAssetResponse {
  Arn?: string;
  AssetDetails?: AssetDetails;
  AssetType?: string;
  CreatedAt?: Date;
  DataSetId?: string;
  Id?: string;
  Name?: string;
  RevisionId?: string;
  SourceId?: string;
  UpdatedAt?: Date;
}
export const GetAssetResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AssetDetails: S.optional(AssetDetails),
    AssetType: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DataSetId: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    RevisionId: S.optional(S.String),
    SourceId: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetAssetResponse",
}) as any as S.Schema<GetAssetResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  {
    LimitName: S.optional(S.String),
    LimitValue: S.optional(S.Number),
    Message: S.String,
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, ExceptionCause: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * This operation tags a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * This operation removes one or more tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * This operation lists the tags on the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * This operation deletes the event action.
 */
export const deleteEventAction: (
  input: DeleteEventActionRequest,
) => Effect.Effect<
  DeleteEventActionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventActionRequest,
  output: DeleteEventActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a job.
 */
export const getJob: (
  input: GetJobRequest,
) => Effect.Effect<
  GetJobResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The type of event associated with the data set.
 */
export const sendDataSetNotification: (
  input: SendDataSetNotificationRequest,
) => Effect.Effect<
  SendDataSetNotificationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendDataSetNotificationRequest,
  output: SendDataSetNotificationResponse,
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
 * This operation creates a data grant.
 */
export const createDataGrant: (
  input: CreateDataGrantRequest,
) => Effect.Effect<
  CreateDataGrantResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataGrantRequest,
  output: CreateDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about all data grants.
 */
export const listDataGrants: {
  (
    input: ListDataGrantsRequest,
  ): Effect.Effect<
    ListDataGrantsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataGrantsRequest,
  ) => Stream.Stream<
    ListDataGrantsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataGrantsRequest,
  ) => Stream.Stream<
    DataGrantSummaryEntry,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataGrantsRequest,
  output: ListDataGrantsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataGrantSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation lists a data set's revisions sorted by CreatedAt in descending
 * order.
 */
export const listDataSetRevisions: {
  (
    input: ListDataSetRevisionsRequest,
  ): Effect.Effect<
    ListDataSetRevisionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSetRevisionsRequest,
  ) => Stream.Stream<
    ListDataSetRevisionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSetRevisionsRequest,
  ) => Stream.Stream<
    RevisionEntry,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSetRevisionsRequest,
  output: ListDataSetRevisionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Revisions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation lists your data sets. When listing by origin OWNED, results are sorted by
 * CreatedAt in descending order. When listing by origin ENTITLED, there is no order.
 */
export const listDataSets: {
  (
    input: ListDataSetsRequest,
  ): Effect.Effect<
    ListDataSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSetsRequest,
  ) => Stream.Stream<
    ListDataSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSetsRequest,
  ) => Stream.Stream<
    DataSetEntry,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataSetsRequest,
  output: ListDataSetsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataSets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation lists your event actions.
 */
export const listEventActions: {
  (
    input: ListEventActionsRequest,
  ): Effect.Effect<
    ListEventActionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventActionsRequest,
  ) => Stream.Stream<
    ListEventActionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventActionsRequest,
  ) => Stream.Stream<
    EventActionEntry,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventActionsRequest,
  output: ListEventActionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventActions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation lists your jobs sorted by CreatedAt in descending order.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): Effect.Effect<
    ListJobsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    ListJobsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    JobEntry,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Jobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation returns information about all received data grants.
 */
export const listReceivedDataGrants: {
  (
    input: ListReceivedDataGrantsRequest,
  ): Effect.Effect<
    ListReceivedDataGrantsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReceivedDataGrantsRequest,
  ) => Stream.Stream<
    ListReceivedDataGrantsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReceivedDataGrantsRequest,
  ) => Stream.Stream<
    ReceivedDataGrantSummariesEntry,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReceivedDataGrantsRequest,
  output: ListReceivedDataGrantsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataGrantSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation lists a revision's assets sorted alphabetically in descending
 * order.
 */
export const listRevisionAssets: {
  (
    input: ListRevisionAssetsRequest,
  ): Effect.Effect<
    ListRevisionAssetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRevisionAssetsRequest,
  ) => Stream.Stream<
    ListRevisionAssetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRevisionAssetsRequest,
  ) => Stream.Stream<
    AssetEntry,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRevisionAssetsRequest,
  output: ListRevisionAssetsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Assets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation returns information about a data grant.
 */
export const getDataGrant: (
  input: GetDataGrantRequest,
) => Effect.Effect<
  GetDataGrantResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataGrantRequest,
  output: GetDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a data set.
 */
export const getDataSet: (
  input: GetDataSetRequest,
) => Effect.Effect<
  GetDataSetResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSetRequest,
  output: GetDataSetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation retrieves information about an event action.
 */
export const getEventAction: (
  input: GetEventActionRequest,
) => Effect.Effect<
  GetEventActionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventActionRequest,
  output: GetEventActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a received data grant.
 */
export const getReceivedDataGrant: (
  input: GetReceivedDataGrantRequest,
) => Effect.Effect<
  GetReceivedDataGrantResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReceivedDataGrantRequest,
  output: GetReceivedDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation returns information about a revision.
 */
export const getRevision: (
  input: GetRevisionRequest,
) => Effect.Effect<
  GetRevisionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRevisionRequest,
  output: GetRevisionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation revokes subscribers' access to a revision.
 */
export const revokeRevision: (
  input: RevokeRevisionRequest,
) => Effect.Effect<
  RevokeRevisionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeRevisionRequest,
  output: RevokeRevisionResponse,
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
 * This operation invokes an API Gateway API asset. The request is proxied to the
 * provider’s API Gateway API.
 */
export const sendApiAsset: (
  input: SendApiAssetRequest,
) => Effect.Effect<
  SendApiAssetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendApiAssetRequest,
  output: SendApiAssetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates an asset.
 */
export const updateAsset: (
  input: UpdateAssetRequest,
) => Effect.Effect<
  UpdateAssetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssetRequest,
  output: UpdateAssetResponse,
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
 * This operation updates a data set.
 */
export const updateDataSet: (
  input: UpdateDataSetRequest,
) => Effect.Effect<
  UpdateDataSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSetRequest,
  output: UpdateDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates the event action.
 */
export const updateEventAction: (
  input: UpdateEventActionRequest,
) => Effect.Effect<
  UpdateEventActionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventActionRequest,
  output: UpdateEventActionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation updates a revision.
 */
export const updateRevision: (
  input: UpdateRevisionRequest,
) => Effect.Effect<
  UpdateRevisionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRevisionRequest,
  output: UpdateRevisionResponse,
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
 * This operation deletes a data grant.
 */
export const deleteDataGrant: (
  input: DeleteDataGrantRequest,
) => Effect.Effect<
  DeleteDataGrantResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataGrantRequest,
  output: DeleteDataGrantResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation deletes a data set.
 */
export const deleteDataSet: (
  input: DeleteDataSetRequest,
) => Effect.Effect<
  DeleteDataSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSetRequest,
  output: DeleteDataSetResponse,
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
 * This operation deletes a revision.
 */
export const deleteRevision: (
  input: DeleteRevisionRequest,
) => Effect.Effect<
  DeleteRevisionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRevisionRequest,
  output: DeleteRevisionResponse,
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
 * This operation starts a job.
 */
export const startJob: (
  input: StartJobRequest,
) => Effect.Effect<
  StartJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRequest,
  output: StartJobResponse,
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
 * This operation accepts a data grant.
 */
export const acceptDataGrant: (
  input: AcceptDataGrantRequest,
) => Effect.Effect<
  AcceptDataGrantResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptDataGrantRequest,
  output: AcceptDataGrantResponse,
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
 * This operation creates a revision for a data set.
 */
export const createRevision: (
  input: CreateRevisionRequest,
) => Effect.Effect<
  CreateRevisionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRevisionRequest,
  output: CreateRevisionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation cancels a job. Jobs can be cancelled only when they are in the WAITING
 * state.
 */
export const cancelJob: (
  input: CancelJobRequest,
) => Effect.Effect<
  CancelJobResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation deletes an asset.
 */
export const deleteAsset: (
  input: DeleteAssetRequest,
) => Effect.Effect<
  DeleteAssetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssetRequest,
  output: DeleteAssetResponse,
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
 * This operation creates a data set.
 */
export const createDataSet: (
  input: CreateDataSetRequest,
) => Effect.Effect<
  CreateDataSetResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSetRequest,
  output: CreateDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation creates an event action.
 */
export const createEventAction: (
  input: CreateEventActionRequest,
) => Effect.Effect<
  CreateEventActionResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceLimitExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventActionRequest,
  output: CreateEventActionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceLimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation creates a job.
 */
export const createJob: (
  input: CreateJobRequest,
) => Effect.Effect<
  CreateJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
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
 * This operation returns information about an asset.
 */
export const getAsset: (
  input: GetAssetRequest,
) => Effect.Effect<
  GetAssetResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssetRequest,
  output: GetAssetResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

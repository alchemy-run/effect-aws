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
  sdkId: "Medical Imaging",
  serviceShapeName: "AHIGatewayService",
});
const auth = T.AwsAuthSigv4({ name: "medical-imaging" });
const ver = T.ServiceVersion("2023-07-19");
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
              `https://medical-imaging-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://medical-imaging-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://medical-imaging.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://medical-imaging.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DatastoreId = string;
export type ImageSetId = string;
export type JobId = string;
export type ImageSetExternalVersionId = string;
export type NextToken = string;
export type Arn = string;
export type JobName = string;
export type RoleArn = string;
export type ClientToken = string;
export type S3Uri = string;
export type AwsAccountId = string;
export type TagKey = string;
export type DatastoreName = string;
export type KmsKeyArn = string;
export type LambdaArn = string;
export type ImageFrameId = string;
export type TagValue = string;
export type Message = string;
export type DICOMAttribute = Uint8Array | redacted.Redacted<Uint8Array>;
export type CopiableAttributes = string | redacted.Redacted<string>;
export type DICOMPatientId = string | redacted.Redacted<string>;
export type DICOMAccessionNumber = string | redacted.Redacted<string>;
export type DICOMStudyId = string | redacted.Redacted<string>;
export type DICOMStudyInstanceUID = string | redacted.Redacted<string>;
export type DICOMSeriesInstanceUID = string | redacted.Redacted<string>;
export type DICOMStudyDate = string | redacted.Redacted<string>;
export type DICOMStudyTime = string | redacted.Redacted<string>;
export type DICOMPatientName = string | redacted.Redacted<string>;
export type DICOMPatientBirthDate = string | redacted.Redacted<string>;
export type DICOMPatientSex = string | redacted.Redacted<string>;
export type DICOMStudyDescription = string | redacted.Redacted<string>;
export type DICOMNumberOfStudyRelatedSeries = number;
export type DICOMNumberOfStudyRelatedInstances = number;
export type DICOMSeriesModality = string | redacted.Redacted<string>;
export type DICOMSeriesBodyPart = string | redacted.Redacted<string>;
export type DICOMSeriesNumber = number;

//# Schemas
export type JobStatus = "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export const JobStatus = S.Literal(
  "SUBMITTED",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type LosslessStorageFormat = "HTJ2K" | "JPEG_2000_LOSSLESS";
export const LosslessStorageFormat = S.Literal("HTJ2K", "JPEG_2000_LOSSLESS");
export type DatastoreStatus =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETING"
  | "DELETED";
export const DatastoreStatus = S.Literal(
  "CREATING",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETING",
  "DELETED",
);
export interface DeleteImageSetRequest {
  datastoreId: string;
  imageSetId: string;
}
export const DeleteImageSetRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/deleteImageSet",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImageSetRequest",
}) as any as S.Schema<DeleteImageSetRequest>;
export interface GetDICOMImportJobRequest {
  datastoreId: string;
  jobId: string;
}
export const GetDICOMImportJobRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/getDICOMImportJob/datastore/{datastoreId}/job/{jobId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDICOMImportJobRequest",
}) as any as S.Schema<GetDICOMImportJobRequest>;
export interface GetImageSetRequest {
  datastoreId: string;
  imageSetId: string;
  versionId?: string;
}
export const GetImageSetRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/getImageSet",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImageSetRequest",
}) as any as S.Schema<GetImageSetRequest>;
export interface GetImageSetMetadataRequest {
  datastoreId: string;
  imageSetId: string;
  versionId?: string;
}
export const GetImageSetMetadataRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/getImageSetMetadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImageSetMetadataRequest",
}) as any as S.Schema<GetImageSetMetadataRequest>;
export interface ListDICOMImportJobsRequest {
  datastoreId: string;
  jobStatus?: JobStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListDICOMImportJobsRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    jobStatus: S.optional(JobStatus).pipe(T.HttpQuery("jobStatus")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/listDICOMImportJobs/datastore/{datastoreId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDICOMImportJobsRequest",
}) as any as S.Schema<ListDICOMImportJobsRequest>;
export interface ListImageSetVersionsRequest {
  datastoreId: string;
  imageSetId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListImageSetVersionsRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/listImageSetVersions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImageSetVersionsRequest",
}) as any as S.Schema<ListImageSetVersionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface StartDICOMImportJobRequest {
  jobName?: string;
  dataAccessRoleArn: string;
  clientToken: string;
  datastoreId: string;
  inputS3Uri: string;
  outputS3Uri: string;
  inputOwnerAccountId?: string;
}
export const StartDICOMImportJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    dataAccessRoleArn: S.String,
    clientToken: S.String.pipe(T.IdempotencyToken()),
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    inputS3Uri: S.String,
    outputS3Uri: S.String,
    inputOwnerAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/startDICOMImportJob/datastore/{datastoreId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDICOMImportJobRequest",
}) as any as S.Schema<StartDICOMImportJobRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateDatastoreRequest {
  datastoreName?: string;
  clientToken: string;
  tags?: { [key: string]: string };
  kmsKeyArn?: string;
  lambdaAuthorizerArn?: string;
  losslessStorageFormat?: LosslessStorageFormat;
}
export const CreateDatastoreRequest = S.suspend(() =>
  S.Struct({
    datastoreName: S.optional(S.String),
    clientToken: S.String.pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
    lambdaAuthorizerArn: S.optional(S.String),
    losslessStorageFormat: S.optional(LosslessStorageFormat),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datastore" }),
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
export interface GetDatastoreRequest {
  datastoreId: string;
}
export const GetDatastoreRequest = S.suspend(() =>
  S.Struct({ datastoreId: S.String.pipe(T.HttpLabel("datastoreId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datastore/{datastoreId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDatastoreRequest",
}) as any as S.Schema<GetDatastoreRequest>;
export interface DeleteDatastoreRequest {
  datastoreId: string;
}
export const DeleteDatastoreRequest = S.suspend(() =>
  S.Struct({ datastoreId: S.String.pipe(T.HttpLabel("datastoreId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datastore/{datastoreId}" }),
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
export interface ListDatastoresRequest {
  datastoreStatus?: DatastoreStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListDatastoresRequest = S.suspend(() =>
  S.Struct({
    datastoreStatus: S.optional(DatastoreStatus).pipe(
      T.HttpQuery("datastoreStatus"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datastore" }),
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
export type ImageSetState = "ACTIVE" | "LOCKED" | "DELETED";
export const ImageSetState = S.Literal("ACTIVE", "LOCKED", "DELETED");
export type ImageSetWorkflowStatus =
  | "CREATED"
  | "COPIED"
  | "COPYING"
  | "COPYING_WITH_READ_ONLY_ACCESS"
  | "COPY_FAILED"
  | "UPDATING"
  | "UPDATED"
  | "UPDATE_FAILED"
  | "DELETING"
  | "DELETED"
  | "IMPORTING"
  | "IMPORTED"
  | "IMPORT_FAILED";
export const ImageSetWorkflowStatus = S.Literal(
  "CREATED",
  "COPIED",
  "COPYING",
  "COPYING_WITH_READ_ONLY_ACCESS",
  "COPY_FAILED",
  "UPDATING",
  "UPDATED",
  "UPDATE_FAILED",
  "DELETING",
  "DELETED",
  "IMPORTING",
  "IMPORTED",
  "IMPORT_FAILED",
);
export interface ImageFrameInformation {
  imageFrameId: string;
}
export const ImageFrameInformation = S.suspend(() =>
  S.Struct({ imageFrameId: S.String }),
).annotations({
  identifier: "ImageFrameInformation",
}) as any as S.Schema<ImageFrameInformation>;
export type StorageTier = "FREQUENT_ACCESS" | "ARCHIVE_INSTANT_ACCESS";
export const StorageTier = S.Literal(
  "FREQUENT_ACCESS",
  "ARCHIVE_INSTANT_ACCESS",
);
export type Operator = "EQUAL" | "BETWEEN";
export const Operator = S.Literal("EQUAL", "BETWEEN");
export type SortOrder = "ASC" | "DESC";
export const SortOrder = S.Literal("ASC", "DESC");
export type SortField = "updatedAt" | "createdAt" | "DICOMStudyDateAndTime";
export const SortField = S.Literal(
  "updatedAt",
  "createdAt",
  "DICOMStudyDateAndTime",
);
export interface DeleteImageSetResponse {
  datastoreId: string;
  imageSetId: string;
  imageSetState: ImageSetState;
  imageSetWorkflowStatus: ImageSetWorkflowStatus;
}
export const DeleteImageSetResponse = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    imageSetId: S.String,
    imageSetState: ImageSetState,
    imageSetWorkflowStatus: ImageSetWorkflowStatus,
  }),
).annotations({
  identifier: "DeleteImageSetResponse",
}) as any as S.Schema<DeleteImageSetResponse>;
export interface GetImageFrameRequest {
  datastoreId: string;
  imageSetId: string;
  imageFrameInformation: ImageFrameInformation;
}
export const GetImageFrameRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    imageFrameInformation: ImageFrameInformation.pipe(
      T.HttpPayload(),
    ).annotations({ identifier: "ImageFrameInformation" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/getImageFrame",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImageFrameRequest",
}) as any as S.Schema<GetImageFrameRequest>;
export interface GetImageSetMetadataResponse {
  imageSetMetadataBlob: T.StreamingOutputBody;
  contentType?: string;
  contentEncoding?: string;
}
export const GetImageSetMetadataResponse = S.suspend(() =>
  S.Struct({
    imageSetMetadataBlob: T.StreamingOutput.pipe(T.HttpPayload()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    contentEncoding: S.optional(S.String).pipe(
      T.HttpHeader("Content-Encoding"),
    ),
  }),
).annotations({
  identifier: "GetImageSetMetadataResponse",
}) as any as S.Schema<GetImageSetMetadataResponse>;
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartDICOMImportJobResponse {
  datastoreId: string;
  jobId: string;
  jobStatus: JobStatus;
  submittedAt: Date;
}
export const StartDICOMImportJobResponse = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    jobId: S.String,
    jobStatus: JobStatus,
    submittedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "StartDICOMImportJobResponse",
}) as any as S.Schema<StartDICOMImportJobResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface CreateDatastoreResponse {
  datastoreId: string;
  datastoreStatus: DatastoreStatus;
}
export const CreateDatastoreResponse = S.suspend(() =>
  S.Struct({ datastoreId: S.String, datastoreStatus: DatastoreStatus }),
).annotations({
  identifier: "CreateDatastoreResponse",
}) as any as S.Schema<CreateDatastoreResponse>;
export interface DeleteDatastoreResponse {
  datastoreId: string;
  datastoreStatus: DatastoreStatus;
}
export const DeleteDatastoreResponse = S.suspend(() =>
  S.Struct({ datastoreId: S.String, datastoreStatus: DatastoreStatus }),
).annotations({
  identifier: "DeleteDatastoreResponse",
}) as any as S.Schema<DeleteDatastoreResponse>;
export interface CopyDestinationImageSet {
  imageSetId: string;
  latestVersionId: string;
}
export const CopyDestinationImageSet = S.suspend(() =>
  S.Struct({ imageSetId: S.String, latestVersionId: S.String }),
).annotations({
  identifier: "CopyDestinationImageSet",
}) as any as S.Schema<CopyDestinationImageSet>;
export interface Sort {
  sortOrder: SortOrder;
  sortField: SortField;
}
export const Sort = S.suspend(() =>
  S.Struct({ sortOrder: SortOrder, sortField: SortField }),
).annotations({ identifier: "Sort" }) as any as S.Schema<Sort>;
export interface DICOMUpdates {
  removableAttributes?: Uint8Array | redacted.Redacted<Uint8Array>;
  updatableAttributes?: Uint8Array | redacted.Redacted<Uint8Array>;
}
export const DICOMUpdates = S.suspend(() =>
  S.Struct({
    removableAttributes: S.optional(SensitiveBlob),
    updatableAttributes: S.optional(SensitiveBlob),
  }),
).annotations({ identifier: "DICOMUpdates" }) as any as S.Schema<DICOMUpdates>;
export interface DICOMImportJobProperties {
  jobId: string;
  jobName: string;
  jobStatus: JobStatus;
  datastoreId: string;
  dataAccessRoleArn: string;
  endedAt?: Date;
  submittedAt?: Date;
  inputS3Uri: string;
  outputS3Uri: string;
  message?: string;
}
export const DICOMImportJobProperties = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    jobName: S.String,
    jobStatus: JobStatus,
    datastoreId: S.String,
    dataAccessRoleArn: S.String,
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    inputS3Uri: S.String,
    outputS3Uri: S.String,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DICOMImportJobProperties",
}) as any as S.Schema<DICOMImportJobProperties>;
export interface Overrides {
  forced?: boolean;
}
export const Overrides = S.suspend(() =>
  S.Struct({ forced: S.optional(S.Boolean) }),
).annotations({ identifier: "Overrides" }) as any as S.Schema<Overrides>;
export interface DICOMImportJobSummary {
  jobId: string;
  jobName: string;
  jobStatus: JobStatus;
  datastoreId: string;
  dataAccessRoleArn?: string;
  endedAt?: Date;
  submittedAt?: Date;
  message?: string;
}
export const DICOMImportJobSummary = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    jobName: S.String,
    jobStatus: JobStatus,
    datastoreId: S.String,
    dataAccessRoleArn: S.optional(S.String),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DICOMImportJobSummary",
}) as any as S.Schema<DICOMImportJobSummary>;
export type DICOMImportJobSummaries = DICOMImportJobSummary[];
export const DICOMImportJobSummaries = S.Array(DICOMImportJobSummary);
export interface ImageSetProperties {
  imageSetId: string;
  versionId: string;
  imageSetState: ImageSetState;
  ImageSetWorkflowStatus?: ImageSetWorkflowStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  message?: string;
  overrides?: Overrides;
  isPrimary?: boolean;
}
export const ImageSetProperties = S.suspend(() =>
  S.Struct({
    imageSetId: S.String,
    versionId: S.String,
    imageSetState: ImageSetState,
    ImageSetWorkflowStatus: S.optional(ImageSetWorkflowStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
    overrides: S.optional(Overrides),
    isPrimary: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ImageSetProperties",
}) as any as S.Schema<ImageSetProperties>;
export type ImageSetPropertiesList = ImageSetProperties[];
export const ImageSetPropertiesList = S.Array(ImageSetProperties);
export type MetadataUpdates =
  | { DICOMUpdates: DICOMUpdates }
  | { revertToVersionId: string };
export const MetadataUpdates = S.Union(
  S.Struct({ DICOMUpdates: DICOMUpdates }),
  S.Struct({ revertToVersionId: S.String }),
);
export interface DatastoreProperties {
  datastoreId: string;
  datastoreName: string;
  datastoreStatus: DatastoreStatus;
  kmsKeyArn?: string;
  lambdaAuthorizerArn?: string;
  losslessStorageFormat?: LosslessStorageFormat;
  datastoreArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const DatastoreProperties = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    datastoreName: S.String,
    datastoreStatus: DatastoreStatus,
    kmsKeyArn: S.optional(S.String),
    lambdaAuthorizerArn: S.optional(S.String),
    losslessStorageFormat: S.optional(LosslessStorageFormat),
    datastoreArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DatastoreProperties",
}) as any as S.Schema<DatastoreProperties>;
export interface DatastoreSummary {
  datastoreId: string;
  datastoreName: string;
  datastoreStatus: DatastoreStatus;
  datastoreArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const DatastoreSummary = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    datastoreName: S.String,
    datastoreStatus: DatastoreStatus,
    datastoreArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DatastoreSummary",
}) as any as S.Schema<DatastoreSummary>;
export type DatastoreSummaries = DatastoreSummary[];
export const DatastoreSummaries = S.Array(DatastoreSummary);
export interface MetadataCopies {
  copiableAttributes: string | redacted.Redacted<string>;
}
export const MetadataCopies = S.suspend(() =>
  S.Struct({ copiableAttributes: SensitiveString }),
).annotations({
  identifier: "MetadataCopies",
}) as any as S.Schema<MetadataCopies>;
export interface GetDICOMImportJobResponse {
  jobProperties: DICOMImportJobProperties;
}
export const GetDICOMImportJobResponse = S.suspend(() =>
  S.Struct({ jobProperties: DICOMImportJobProperties }),
).annotations({
  identifier: "GetDICOMImportJobResponse",
}) as any as S.Schema<GetDICOMImportJobResponse>;
export interface GetImageFrameResponse {
  imageFrameBlob: T.StreamingOutputBody;
  contentType?: string;
}
export const GetImageFrameResponse = S.suspend(() =>
  S.Struct({
    imageFrameBlob: T.StreamingOutput.pipe(T.HttpPayload()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  }),
).annotations({
  identifier: "GetImageFrameResponse",
}) as any as S.Schema<GetImageFrameResponse>;
export interface GetImageSetResponse {
  datastoreId: string;
  imageSetId: string;
  versionId: string;
  imageSetState: ImageSetState;
  imageSetWorkflowStatus?: ImageSetWorkflowStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  message?: string;
  imageSetArn?: string;
  overrides?: Overrides;
  isPrimary?: boolean;
  lastAccessedAt?: Date;
  storageTier?: StorageTier;
}
export const GetImageSetResponse = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    imageSetId: S.String,
    versionId: S.String,
    imageSetState: ImageSetState,
    imageSetWorkflowStatus: S.optional(ImageSetWorkflowStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
    imageSetArn: S.optional(S.String),
    overrides: S.optional(Overrides),
    isPrimary: S.optional(S.Boolean),
    lastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    storageTier: S.optional(StorageTier),
  }),
).annotations({
  identifier: "GetImageSetResponse",
}) as any as S.Schema<GetImageSetResponse>;
export interface ListDICOMImportJobsResponse {
  jobSummaries: DICOMImportJobSummary[];
  nextToken?: string;
}
export const ListDICOMImportJobsResponse = S.suspend(() =>
  S.Struct({
    jobSummaries: DICOMImportJobSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDICOMImportJobsResponse",
}) as any as S.Schema<ListDICOMImportJobsResponse>;
export interface ListImageSetVersionsResponse {
  imageSetPropertiesList: ImageSetProperties[];
  nextToken?: string;
}
export const ListImageSetVersionsResponse = S.suspend(() =>
  S.Struct({
    imageSetPropertiesList: ImageSetPropertiesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImageSetVersionsResponse",
}) as any as S.Schema<ListImageSetVersionsResponse>;
export interface UpdateImageSetMetadataRequest {
  datastoreId: string;
  imageSetId: string;
  latestVersionId: string;
  force?: boolean;
  updateImageSetMetadataUpdates: MetadataUpdates;
}
export const UpdateImageSetMetadataRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    latestVersionId: S.String.pipe(T.HttpQuery("latestVersion")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    updateImageSetMetadataUpdates: MetadataUpdates.pipe(T.HttpPayload()),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{imageSetId}/updateImageSetMetadata",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateImageSetMetadataRequest",
}) as any as S.Schema<UpdateImageSetMetadataRequest>;
export interface GetDatastoreResponse {
  datastoreProperties: DatastoreProperties;
}
export const GetDatastoreResponse = S.suspend(() =>
  S.Struct({ datastoreProperties: DatastoreProperties }),
).annotations({
  identifier: "GetDatastoreResponse",
}) as any as S.Schema<GetDatastoreResponse>;
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
export interface CopySourceImageSetInformation {
  latestVersionId: string;
  DICOMCopies?: MetadataCopies;
}
export const CopySourceImageSetInformation = S.suspend(() =>
  S.Struct({
    latestVersionId: S.String,
    DICOMCopies: S.optional(MetadataCopies),
  }),
).annotations({
  identifier: "CopySourceImageSetInformation",
}) as any as S.Schema<CopySourceImageSetInformation>;
export interface DICOMStudyDateAndTime {
  DICOMStudyDate: string | redacted.Redacted<string>;
  DICOMStudyTime?: string | redacted.Redacted<string>;
}
export const DICOMStudyDateAndTime = S.suspend(() =>
  S.Struct({
    DICOMStudyDate: SensitiveString,
    DICOMStudyTime: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "DICOMStudyDateAndTime",
}) as any as S.Schema<DICOMStudyDateAndTime>;
export interface CopyImageSetInformation {
  sourceImageSet: CopySourceImageSetInformation;
  destinationImageSet?: CopyDestinationImageSet;
}
export const CopyImageSetInformation = S.suspend(() =>
  S.Struct({
    sourceImageSet: CopySourceImageSetInformation,
    destinationImageSet: S.optional(CopyDestinationImageSet),
  }),
).annotations({
  identifier: "CopyImageSetInformation",
}) as any as S.Schema<CopyImageSetInformation>;
export type SearchByAttributeValue =
  | { DICOMPatientId: string | redacted.Redacted<string> }
  | { DICOMAccessionNumber: string | redacted.Redacted<string> }
  | { DICOMStudyId: string | redacted.Redacted<string> }
  | { DICOMStudyInstanceUID: string | redacted.Redacted<string> }
  | { DICOMSeriesInstanceUID: string | redacted.Redacted<string> }
  | { createdAt: Date }
  | { updatedAt: Date }
  | { DICOMStudyDateAndTime: DICOMStudyDateAndTime }
  | { isPrimary: boolean };
export const SearchByAttributeValue = S.Union(
  S.Struct({ DICOMPatientId: SensitiveString }),
  S.Struct({ DICOMAccessionNumber: SensitiveString }),
  S.Struct({ DICOMStudyId: SensitiveString }),
  S.Struct({ DICOMStudyInstanceUID: SensitiveString }),
  S.Struct({ DICOMSeriesInstanceUID: SensitiveString }),
  S.Struct({ createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ DICOMStudyDateAndTime: DICOMStudyDateAndTime }),
  S.Struct({ isPrimary: S.Boolean }),
);
export type SearchByAttributeValues = SearchByAttributeValue[];
export const SearchByAttributeValues = S.Array(SearchByAttributeValue);
export interface CopyImageSetRequest {
  datastoreId: string;
  sourceImageSetId: string;
  copyImageSetInformation: CopyImageSetInformation;
  force?: boolean;
  promoteToPrimary?: boolean;
}
export const CopyImageSetRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    sourceImageSetId: S.String.pipe(T.HttpLabel("sourceImageSetId")),
    copyImageSetInformation: CopyImageSetInformation.pipe(
      T.HttpPayload(),
    ).annotations({ identifier: "CopyImageSetInformation" }),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    promoteToPrimary: S.optional(S.Boolean).pipe(
      T.HttpQuery("promoteToPrimary"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/imageSet/{sourceImageSetId}/copyImageSet",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyImageSetRequest",
}) as any as S.Schema<CopyImageSetRequest>;
export interface UpdateImageSetMetadataResponse {
  datastoreId: string;
  imageSetId: string;
  latestVersionId: string;
  imageSetState: ImageSetState;
  imageSetWorkflowStatus?: ImageSetWorkflowStatus;
  createdAt?: Date;
  updatedAt?: Date;
  message?: string;
}
export const UpdateImageSetMetadataResponse = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    imageSetId: S.String,
    latestVersionId: S.String,
    imageSetState: ImageSetState,
    imageSetWorkflowStatus: S.optional(ImageSetWorkflowStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateImageSetMetadataResponse",
}) as any as S.Schema<UpdateImageSetMetadataResponse>;
export interface SearchFilter {
  values: SearchByAttributeValue[];
  operator: Operator;
}
export const SearchFilter = S.suspend(() =>
  S.Struct({ values: SearchByAttributeValues, operator: Operator }),
).annotations({ identifier: "SearchFilter" }) as any as S.Schema<SearchFilter>;
export type SearchFilters = SearchFilter[];
export const SearchFilters = S.Array(SearchFilter);
export interface SearchCriteria {
  filters?: SearchFilter[];
  sort?: Sort;
}
export const SearchCriteria = S.suspend(() =>
  S.Struct({ filters: S.optional(SearchFilters), sort: S.optional(Sort) }),
).annotations({
  identifier: "SearchCriteria",
}) as any as S.Schema<SearchCriteria>;
export interface SearchImageSetsRequest {
  datastoreId: string;
  searchCriteria?: SearchCriteria;
  maxResults?: number;
  nextToken?: string;
}
export const SearchImageSetsRequest = S.suspend(() =>
  S.Struct({
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    searchCriteria: S.optional(SearchCriteria)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SearchCriteria" }),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/datastore/{datastoreId}/searchImageSets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchImageSetsRequest",
}) as any as S.Schema<SearchImageSetsRequest>;
export interface CopySourceImageSetProperties {
  imageSetId: string;
  latestVersionId: string;
  imageSetState?: ImageSetState;
  imageSetWorkflowStatus?: ImageSetWorkflowStatus;
  createdAt?: Date;
  updatedAt?: Date;
  imageSetArn?: string;
}
export const CopySourceImageSetProperties = S.suspend(() =>
  S.Struct({
    imageSetId: S.String,
    latestVersionId: S.String,
    imageSetState: S.optional(ImageSetState),
    imageSetWorkflowStatus: S.optional(ImageSetWorkflowStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    imageSetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CopySourceImageSetProperties",
}) as any as S.Schema<CopySourceImageSetProperties>;
export interface CopyDestinationImageSetProperties {
  imageSetId: string;
  latestVersionId: string;
  imageSetState?: ImageSetState;
  imageSetWorkflowStatus?: ImageSetWorkflowStatus;
  createdAt?: Date;
  updatedAt?: Date;
  imageSetArn?: string;
}
export const CopyDestinationImageSetProperties = S.suspend(() =>
  S.Struct({
    imageSetId: S.String,
    latestVersionId: S.String,
    imageSetState: S.optional(ImageSetState),
    imageSetWorkflowStatus: S.optional(ImageSetWorkflowStatus),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    imageSetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CopyDestinationImageSetProperties",
}) as any as S.Schema<CopyDestinationImageSetProperties>;
export interface CopyImageSetResponse {
  datastoreId: string;
  sourceImageSetProperties: CopySourceImageSetProperties;
  destinationImageSetProperties: CopyDestinationImageSetProperties;
}
export const CopyImageSetResponse = S.suspend(() =>
  S.Struct({
    datastoreId: S.String,
    sourceImageSetProperties: CopySourceImageSetProperties,
    destinationImageSetProperties: CopyDestinationImageSetProperties,
  }),
).annotations({
  identifier: "CopyImageSetResponse",
}) as any as S.Schema<CopyImageSetResponse>;
export interface DICOMTags {
  DICOMPatientId?: string | redacted.Redacted<string>;
  DICOMPatientName?: string | redacted.Redacted<string>;
  DICOMPatientBirthDate?: string | redacted.Redacted<string>;
  DICOMPatientSex?: string | redacted.Redacted<string>;
  DICOMStudyInstanceUID?: string | redacted.Redacted<string>;
  DICOMStudyId?: string | redacted.Redacted<string>;
  DICOMStudyDescription?: string | redacted.Redacted<string>;
  DICOMNumberOfStudyRelatedSeries?: number;
  DICOMNumberOfStudyRelatedInstances?: number;
  DICOMAccessionNumber?: string | redacted.Redacted<string>;
  DICOMSeriesInstanceUID?: string | redacted.Redacted<string>;
  DICOMSeriesModality?: string | redacted.Redacted<string>;
  DICOMSeriesBodyPart?: string | redacted.Redacted<string>;
  DICOMSeriesNumber?: number;
  DICOMStudyDate?: string | redacted.Redacted<string>;
  DICOMStudyTime?: string | redacted.Redacted<string>;
}
export const DICOMTags = S.suspend(() =>
  S.Struct({
    DICOMPatientId: S.optional(SensitiveString),
    DICOMPatientName: S.optional(SensitiveString),
    DICOMPatientBirthDate: S.optional(SensitiveString),
    DICOMPatientSex: S.optional(SensitiveString),
    DICOMStudyInstanceUID: S.optional(SensitiveString),
    DICOMStudyId: S.optional(SensitiveString),
    DICOMStudyDescription: S.optional(SensitiveString),
    DICOMNumberOfStudyRelatedSeries: S.optional(S.Number),
    DICOMNumberOfStudyRelatedInstances: S.optional(S.Number),
    DICOMAccessionNumber: S.optional(SensitiveString),
    DICOMSeriesInstanceUID: S.optional(SensitiveString),
    DICOMSeriesModality: S.optional(SensitiveString),
    DICOMSeriesBodyPart: S.optional(SensitiveString),
    DICOMSeriesNumber: S.optional(S.Number),
    DICOMStudyDate: S.optional(SensitiveString),
    DICOMStudyTime: S.optional(SensitiveString),
  }),
).annotations({ identifier: "DICOMTags" }) as any as S.Schema<DICOMTags>;
export interface ImageSetsMetadataSummary {
  imageSetId: string;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastAccessedAt?: Date;
  storageTier?: StorageTier;
  DICOMTags?: DICOMTags;
  isPrimary?: boolean;
}
export const ImageSetsMetadataSummary = S.suspend(() =>
  S.Struct({
    imageSetId: S.String,
    version: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    storageTier: S.optional(StorageTier),
    DICOMTags: S.optional(DICOMTags),
    isPrimary: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ImageSetsMetadataSummary",
}) as any as S.Schema<ImageSetsMetadataSummary>;
export type ImageSetsMetadataSummaries = ImageSetsMetadataSummary[];
export const ImageSetsMetadataSummaries = S.Array(ImageSetsMetadataSummary);
export interface SearchImageSetsResponse {
  imageSetsMetadataSummaries: ImageSetsMetadataSummary[];
  sort?: Sort;
  nextToken?: string;
}
export const SearchImageSetsResponse = S.suspend(() =>
  S.Struct({
    imageSetsMetadataSummaries: ImageSetsMetadataSummaries,
    sort: S.optional(Sort),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchImageSetsResponse",
}) as any as S.Schema<SearchImageSetsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List data stores.
 */
export const listDatastores: {
  (
    input: ListDatastoresRequest,
  ): effect.Effect<
    ListDatastoresResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatastoresRequest,
  ) => stream.Stream<
    ListDatastoresResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatastoresRequest,
  ) => stream.Stream<
    DatastoreSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatastoresRequest,
  output: ListDatastoresResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datastoreSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create a data store.
 */
export const createDatastore: (
  input: CreateDatastoreRequest,
) => effect.Effect<
  CreateDatastoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatastoreRequest,
  output: CreateDatastoreResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Start importing bulk data into an `ACTIVE` data store. The import job imports DICOM P10 files found in the S3 prefix specified by the `inputS3Uri` parameter. The import job stores processing results in the file specified by the `outputS3Uri` parameter.
 */
export const startDICOMImportJob: (
  input: StartDICOMImportJobRequest,
) => effect.Effect<
  StartDICOMImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDICOMImportJobRequest,
  output: StartDICOMImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get data store properties.
 */
export const getDatastore: (
  input: GetDatastoreRequest,
) => effect.Effect<
  GetDatastoreResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatastoreRequest,
  output: GetDatastoreResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags associated with a medical imaging resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds a user-specifed key and value tag to a medical imaging resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Delete a data store.
 *
 * Before a data store can be deleted, you must first delete all image sets within it.
 */
export const deleteDatastore: (
  input: DeleteDatastoreRequest,
) => effect.Effect<
  DeleteDatastoreResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatastoreRequest,
  output: DeleteDatastoreResponse,
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
 * Delete an image set.
 */
export const deleteImageSet: (
  input: DeleteImageSetRequest,
) => effect.Effect<
  DeleteImageSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageSetRequest,
  output: DeleteImageSetResponse,
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
 * Get metadata attributes for an image set.
 */
export const getImageSetMetadata: (
  input: GetImageSetMetadataRequest,
) => effect.Effect<
  GetImageSetMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImageSetMetadataRequest,
  output: GetImageSetMetadataResponse,
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
 * Get the import job properties to learn more about the job or job progress.
 *
 * The `jobStatus` refers to the execution of the import job. Therefore, an import job can return a `jobStatus` as `COMPLETED` even if validation issues are discovered during the import process. If a `jobStatus` returns as `COMPLETED`, we still recommend you review the output manifests written to S3, as they provide details on the success or failure of individual P10 object imports.
 */
export const getDICOMImportJob: (
  input: GetDICOMImportJobRequest,
) => effect.Effect<
  GetDICOMImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDICOMImportJobRequest,
  output: GetDICOMImportJobResponse,
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
 * Get an image frame (pixel data) for an image set.
 */
export const getImageFrame: (
  input: GetImageFrameRequest,
) => effect.Effect<
  GetImageFrameResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImageFrameRequest,
  output: GetImageFrameResponse,
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
 * Get image set properties.
 */
export const getImageSet: (
  input: GetImageSetRequest,
) => effect.Effect<
  GetImageSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImageSetRequest,
  output: GetImageSetResponse,
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
 * List import jobs created for a specific data store.
 */
export const listDICOMImportJobs: {
  (
    input: ListDICOMImportJobsRequest,
  ): effect.Effect<
    ListDICOMImportJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDICOMImportJobsRequest,
  ) => stream.Stream<
    ListDICOMImportJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDICOMImportJobsRequest,
  ) => stream.Stream<
    DICOMImportJobSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDICOMImportJobsRequest,
  output: ListDICOMImportJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List image set versions.
 */
export const listImageSetVersions: {
  (
    input: ListImageSetVersionsRequest,
  ): effect.Effect<
    ListImageSetVersionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImageSetVersionsRequest,
  ) => stream.Stream<
    ListImageSetVersionsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImageSetVersionsRequest,
  ) => stream.Stream<
    ImageSetProperties,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImageSetVersionsRequest,
  output: ListImageSetVersionsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "imageSetPropertiesList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes tags from a medical imaging resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Update image set metadata attributes.
 */
export const updateImageSetMetadata: (
  input: UpdateImageSetMetadataRequest,
) => effect.Effect<
  UpdateImageSetMetadataResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImageSetMetadataRequest,
  output: UpdateImageSetMetadataResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Copy an image set.
 */
export const copyImageSet: (
  input: CopyImageSetRequest,
) => effect.Effect<
  CopyImageSetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyImageSetRequest,
  output: CopyImageSetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Search image sets based on defined input attributes.
 *
 * `SearchImageSets` accepts a single search query parameter and returns a paginated response of all image sets that have the matching criteria. All date range queries must be input as `(lowerBound, upperBound)`.
 *
 * By default, `SearchImageSets` uses the `updatedAt` field for sorting in descending order from newest to oldest.
 */
export const searchImageSets: {
  (
    input: SearchImageSetsRequest,
  ): effect.Effect<
    SearchImageSetsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchImageSetsRequest,
  ) => stream.Stream<
    SearchImageSetsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchImageSetsRequest,
  ) => stream.Stream<
    ImageSetsMetadataSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchImageSetsRequest,
  output: SearchImageSetsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "imageSetsMetadataSummaries",
    pageSize: "maxResults",
  } as const,
}));

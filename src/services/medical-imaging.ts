import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Medical Imaging",
  serviceShapeName: "AHIGatewayService",
});
const auth = T.AwsAuthSigv4({ name: "medical-imaging" });
const ver = T.ServiceVersion("2023-07-19");
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
                                url: "https://medical-imaging-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://medical-imaging-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://medical-imaging.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://medical-imaging.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteImageSetRequest extends S.Class<DeleteImageSetRequest>(
  "DeleteImageSetRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
  },
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
) {}
export class GetDICOMImportJobRequest extends S.Class<GetDICOMImportJobRequest>(
  "GetDICOMImportJobRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
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
) {}
export class GetImageSetRequest extends S.Class<GetImageSetRequest>(
  "GetImageSetRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
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
) {}
export class GetImageSetMetadataRequest extends S.Class<GetImageSetMetadataRequest>(
  "GetImageSetMetadataRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    versionId: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
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
) {}
export class ListDICOMImportJobsRequest extends S.Class<ListDICOMImportJobsRequest>(
  "ListDICOMImportJobsRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    jobStatus: S.optional(S.String).pipe(T.HttpQuery("jobStatus")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListImageSetVersionsRequest extends S.Class<ListImageSetVersionsRequest>(
  "ListImageSetVersionsRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDICOMImportJobRequest extends S.Class<StartDICOMImportJobRequest>(
  "StartDICOMImportJobRequest",
)(
  {
    jobName: S.optional(S.String),
    dataAccessRoleArn: S.String,
    clientToken: S.String,
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    inputS3Uri: S.String,
    outputS3Uri: S.String,
    inputOwnerAccountId: S.optional(S.String),
  },
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
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class CreateDatastoreRequest extends S.Class<CreateDatastoreRequest>(
  "CreateDatastoreRequest",
)(
  {
    datastoreName: S.optional(S.String),
    clientToken: S.String,
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
    lambdaAuthorizerArn: S.optional(S.String),
    losslessStorageFormat: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datastore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDatastoreRequest extends S.Class<GetDatastoreRequest>(
  "GetDatastoreRequest",
)(
  { datastoreId: S.String.pipe(T.HttpLabel("datastoreId")) },
  T.all(
    T.Http({ method: "GET", uri: "/datastore/{datastoreId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDatastoreRequest extends S.Class<DeleteDatastoreRequest>(
  "DeleteDatastoreRequest",
)(
  { datastoreId: S.String.pipe(T.HttpLabel("datastoreId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/datastore/{datastoreId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatastoresRequest extends S.Class<ListDatastoresRequest>(
  "ListDatastoresRequest",
)(
  {
    datastoreStatus: S.optional(S.String).pipe(T.HttpQuery("datastoreStatus")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datastore" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImageFrameInformation extends S.Class<ImageFrameInformation>(
  "ImageFrameInformation",
)({ imageFrameId: S.String }) {}
export class DeleteImageSetResponse extends S.Class<DeleteImageSetResponse>(
  "DeleteImageSetResponse",
)({
  datastoreId: S.String,
  imageSetId: S.String,
  imageSetState: S.String,
  imageSetWorkflowStatus: S.String,
}) {}
export class GetImageFrameRequest extends S.Class<GetImageFrameRequest>(
  "GetImageFrameRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    imageFrameInformation: ImageFrameInformation.pipe(T.HttpPayload()),
  },
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
) {}
export class GetImageSetMetadataResponse extends S.Class<GetImageSetMetadataResponse>(
  "GetImageSetMetadataResponse",
)({
  imageSetMetadataBlob: T.StreamingOutput.pipe(T.HttpPayload()),
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  contentEncoding: S.optional(S.String).pipe(T.HttpHeader("Content-Encoding")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
export class StartDICOMImportJobResponse extends S.Class<StartDICOMImportJobResponse>(
  "StartDICOMImportJobResponse",
)({
  datastoreId: S.String,
  jobId: S.String,
  jobStatus: S.String,
  submittedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class CreateDatastoreResponse extends S.Class<CreateDatastoreResponse>(
  "CreateDatastoreResponse",
)({ datastoreId: S.String, datastoreStatus: S.String }) {}
export class DeleteDatastoreResponse extends S.Class<DeleteDatastoreResponse>(
  "DeleteDatastoreResponse",
)({ datastoreId: S.String, datastoreStatus: S.String }) {}
export class CopyDestinationImageSet extends S.Class<CopyDestinationImageSet>(
  "CopyDestinationImageSet",
)({ imageSetId: S.String, latestVersionId: S.String }) {}
export class Sort extends S.Class<Sort>("Sort")({
  sortOrder: S.String,
  sortField: S.String,
}) {}
export class DICOMUpdates extends S.Class<DICOMUpdates>("DICOMUpdates")({
  removableAttributes: S.optional(T.Blob),
  updatableAttributes: S.optional(T.Blob),
}) {}
export class DICOMImportJobProperties extends S.Class<DICOMImportJobProperties>(
  "DICOMImportJobProperties",
)({
  jobId: S.String,
  jobName: S.String,
  jobStatus: S.String,
  datastoreId: S.String,
  dataAccessRoleArn: S.String,
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inputS3Uri: S.String,
  outputS3Uri: S.String,
  message: S.optional(S.String),
}) {}
export class Overrides extends S.Class<Overrides>("Overrides")({
  forced: S.optional(S.Boolean),
}) {}
export class DICOMImportJobSummary extends S.Class<DICOMImportJobSummary>(
  "DICOMImportJobSummary",
)({
  jobId: S.String,
  jobName: S.String,
  jobStatus: S.String,
  datastoreId: S.String,
  dataAccessRoleArn: S.optional(S.String),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
}) {}
export const DICOMImportJobSummaries = S.Array(DICOMImportJobSummary);
export class ImageSetProperties extends S.Class<ImageSetProperties>(
  "ImageSetProperties",
)({
  imageSetId: S.String,
  versionId: S.String,
  imageSetState: S.String,
  ImageSetWorkflowStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  overrides: S.optional(Overrides),
  isPrimary: S.optional(S.Boolean),
}) {}
export const ImageSetPropertiesList = S.Array(ImageSetProperties);
export const MetadataUpdates = S.Union(
  S.Struct({ DICOMUpdates: DICOMUpdates }),
  S.Struct({ revertToVersionId: S.String }),
);
export class DatastoreProperties extends S.Class<DatastoreProperties>(
  "DatastoreProperties",
)({
  datastoreId: S.String,
  datastoreName: S.String,
  datastoreStatus: S.String,
  kmsKeyArn: S.optional(S.String),
  lambdaAuthorizerArn: S.optional(S.String),
  losslessStorageFormat: S.optional(S.String),
  datastoreArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DatastoreSummary extends S.Class<DatastoreSummary>(
  "DatastoreSummary",
)({
  datastoreId: S.String,
  datastoreName: S.String,
  datastoreStatus: S.String,
  datastoreArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DatastoreSummaries = S.Array(DatastoreSummary);
export class MetadataCopies extends S.Class<MetadataCopies>("MetadataCopies")({
  copiableAttributes: S.String,
}) {}
export class GetDICOMImportJobResponse extends S.Class<GetDICOMImportJobResponse>(
  "GetDICOMImportJobResponse",
)({ jobProperties: DICOMImportJobProperties }) {}
export class GetImageFrameResponse extends S.Class<GetImageFrameResponse>(
  "GetImageFrameResponse",
)({
  imageFrameBlob: T.StreamingOutput.pipe(T.HttpPayload()),
  contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
}) {}
export class GetImageSetResponse extends S.Class<GetImageSetResponse>(
  "GetImageSetResponse",
)({
  datastoreId: S.String,
  imageSetId: S.String,
  versionId: S.String,
  imageSetState: S.String,
  imageSetWorkflowStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
  imageSetArn: S.optional(S.String),
  overrides: S.optional(Overrides),
  isPrimary: S.optional(S.Boolean),
  lastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  storageTier: S.optional(S.String),
}) {}
export class ListDICOMImportJobsResponse extends S.Class<ListDICOMImportJobsResponse>(
  "ListDICOMImportJobsResponse",
)({ jobSummaries: DICOMImportJobSummaries, nextToken: S.optional(S.String) }) {}
export class ListImageSetVersionsResponse extends S.Class<ListImageSetVersionsResponse>(
  "ListImageSetVersionsResponse",
)({
  imageSetPropertiesList: ImageSetPropertiesList,
  nextToken: S.optional(S.String),
}) {}
export class UpdateImageSetMetadataRequest extends S.Class<UpdateImageSetMetadataRequest>(
  "UpdateImageSetMetadataRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    imageSetId: S.String.pipe(T.HttpLabel("imageSetId")),
    latestVersionId: S.String.pipe(T.HttpQuery("latestVersion")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    updateImageSetMetadataUpdates: MetadataUpdates.pipe(T.HttpPayload()),
  },
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
) {}
export class GetDatastoreResponse extends S.Class<GetDatastoreResponse>(
  "GetDatastoreResponse",
)({ datastoreProperties: DatastoreProperties }) {}
export class ListDatastoresResponse extends S.Class<ListDatastoresResponse>(
  "ListDatastoresResponse",
)({
  datastoreSummaries: S.optional(DatastoreSummaries),
  nextToken: S.optional(S.String),
}) {}
export class CopySourceImageSetInformation extends S.Class<CopySourceImageSetInformation>(
  "CopySourceImageSetInformation",
)({ latestVersionId: S.String, DICOMCopies: S.optional(MetadataCopies) }) {}
export class DICOMStudyDateAndTime extends S.Class<DICOMStudyDateAndTime>(
  "DICOMStudyDateAndTime",
)({ DICOMStudyDate: S.String, DICOMStudyTime: S.optional(S.String) }) {}
export class CopyImageSetInformation extends S.Class<CopyImageSetInformation>(
  "CopyImageSetInformation",
)({
  sourceImageSet: CopySourceImageSetInformation,
  destinationImageSet: S.optional(CopyDestinationImageSet),
}) {}
export const SearchByAttributeValue = S.Union(
  S.Struct({ DICOMPatientId: S.String }),
  S.Struct({ DICOMAccessionNumber: S.String }),
  S.Struct({ DICOMStudyId: S.String }),
  S.Struct({ DICOMStudyInstanceUID: S.String }),
  S.Struct({ DICOMSeriesInstanceUID: S.String }),
  S.Struct({ createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")) }),
  S.Struct({ DICOMStudyDateAndTime: DICOMStudyDateAndTime }),
  S.Struct({ isPrimary: S.Boolean }),
);
export const SearchByAttributeValues = S.Array(SearchByAttributeValue);
export class CopyImageSetRequest extends S.Class<CopyImageSetRequest>(
  "CopyImageSetRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    sourceImageSetId: S.String.pipe(T.HttpLabel("sourceImageSetId")),
    copyImageSetInformation: CopyImageSetInformation.pipe(T.HttpPayload()),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
    promoteToPrimary: S.optional(S.Boolean).pipe(
      T.HttpQuery("promoteToPrimary"),
    ),
  },
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
) {}
export class UpdateImageSetMetadataResponse extends S.Class<UpdateImageSetMetadataResponse>(
  "UpdateImageSetMetadataResponse",
)({
  datastoreId: S.String,
  imageSetId: S.String,
  latestVersionId: S.String,
  imageSetState: S.String,
  imageSetWorkflowStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
}) {}
export class SearchFilter extends S.Class<SearchFilter>("SearchFilter")({
  values: SearchByAttributeValues,
  operator: S.String,
}) {}
export const SearchFilters = S.Array(SearchFilter);
export class SearchCriteria extends S.Class<SearchCriteria>("SearchCriteria")({
  filters: S.optional(SearchFilters),
  sort: S.optional(Sort),
}) {}
export class SearchImageSetsRequest extends S.Class<SearchImageSetsRequest>(
  "SearchImageSetsRequest",
)(
  {
    datastoreId: S.String.pipe(T.HttpLabel("datastoreId")),
    searchCriteria: S.optional(SearchCriteria).pipe(T.HttpPayload()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datastore/{datastoreId}/searchImageSets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CopySourceImageSetProperties extends S.Class<CopySourceImageSetProperties>(
  "CopySourceImageSetProperties",
)({
  imageSetId: S.String,
  latestVersionId: S.String,
  imageSetState: S.optional(S.String),
  imageSetWorkflowStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  imageSetArn: S.optional(S.String),
}) {}
export class CopyDestinationImageSetProperties extends S.Class<CopyDestinationImageSetProperties>(
  "CopyDestinationImageSetProperties",
)({
  imageSetId: S.String,
  latestVersionId: S.String,
  imageSetState: S.optional(S.String),
  imageSetWorkflowStatus: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  imageSetArn: S.optional(S.String),
}) {}
export class CopyImageSetResponse extends S.Class<CopyImageSetResponse>(
  "CopyImageSetResponse",
)({
  datastoreId: S.String,
  sourceImageSetProperties: CopySourceImageSetProperties,
  destinationImageSetProperties: CopyDestinationImageSetProperties,
}) {}
export class DICOMTags extends S.Class<DICOMTags>("DICOMTags")({
  DICOMPatientId: S.optional(S.String),
  DICOMPatientName: S.optional(S.String),
  DICOMPatientBirthDate: S.optional(S.String),
  DICOMPatientSex: S.optional(S.String),
  DICOMStudyInstanceUID: S.optional(S.String),
  DICOMStudyId: S.optional(S.String),
  DICOMStudyDescription: S.optional(S.String),
  DICOMNumberOfStudyRelatedSeries: S.optional(S.Number),
  DICOMNumberOfStudyRelatedInstances: S.optional(S.Number),
  DICOMAccessionNumber: S.optional(S.String),
  DICOMSeriesInstanceUID: S.optional(S.String),
  DICOMSeriesModality: S.optional(S.String),
  DICOMSeriesBodyPart: S.optional(S.String),
  DICOMSeriesNumber: S.optional(S.Number),
  DICOMStudyDate: S.optional(S.String),
  DICOMStudyTime: S.optional(S.String),
}) {}
export class ImageSetsMetadataSummary extends S.Class<ImageSetsMetadataSummary>(
  "ImageSetsMetadataSummary",
)({
  imageSetId: S.String,
  version: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastAccessedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  storageTier: S.optional(S.String),
  DICOMTags: S.optional(DICOMTags),
  isPrimary: S.optional(S.Boolean),
}) {}
export const ImageSetsMetadataSummaries = S.Array(ImageSetsMetadataSummary);
export class SearchImageSetsResponse extends S.Class<SearchImageSetsResponse>(
  "SearchImageSetsResponse",
)({
  imageSetsMetadataSummaries: ImageSetsMetadataSummaries,
  sort: S.optional(Sort),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * List data stores.
 */
export const listDatastores = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Create a data store.
 */
export const createDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDICOMImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds a user-specifed key and value tag to a medical imaging resource.
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
 * Delete a data store.
 *
 * Before a data store can be deleted, you must first delete all image sets within it.
 */
export const deleteDatastore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteImageSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImageSetMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDICOMImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImageFrame = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImageSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDICOMImportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listImageSetVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
 * Update image set metadata attributes.
 */
export const updateImageSetMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Copy an image set.
 */
export const copyImageSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchImageSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);

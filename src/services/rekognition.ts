import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Rekognition",
  serviceShapeName: "RekognitionService",
});
const auth = T.AwsAuthSigv4({ name: "rekognition" });
const ver = T.ServiceVersion("2016-06-27");
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
                        url: "https://rekognition-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rekognition-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rekognition.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rekognition.{Region}.{PartitionResult#dnsSuffix}",
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
export const UserFaceIdList = S.Array(S.String);
export const FaceIdList = S.Array(S.String);
export const ProjectNames = S.Array(S.String);
export const CustomizationFeatures = S.Array(S.String);
export const VersionNames = S.Array(S.String);
export const Attributes = S.Array(S.String);
export const DetectLabelsFeatureList = S.Array(S.String);
export const DatasetLabels = S.Array(S.String);
export const LabelDetectionFeatureList = S.Array(S.String);
export const SegmentTypes = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const StreamProcessorParametersToDelete = S.Array(S.String);
export class AssociateFacesRequest extends S.Class<AssociateFacesRequest>(
  "AssociateFacesRequest",
)(
  {
    CollectionId: S.String,
    UserId: S.String,
    FaceIds: UserFaceIdList,
    UserMatchThreshold: S.optional(S.Number),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateCollectionRequest extends S.Class<CreateCollectionRequest>(
  "CreateCollectionRequest",
)(
  { CollectionId: S.String, Tags: S.optional(TagMap) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    ProjectName: S.String,
    Feature: S.optional(S.String),
    AutoUpdate: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    CollectionId: S.String,
    UserId: S.String,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({}) {}
export class DeleteCollectionRequest extends S.Class<DeleteCollectionRequest>(
  "DeleteCollectionRequest",
)(
  { CollectionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  { DatasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({}) {}
export class DeleteFacesRequest extends S.Class<DeleteFacesRequest>(
  "DeleteFacesRequest",
)(
  { CollectionId: S.String, FaceIds: FaceIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectRequest extends S.Class<DeleteProjectRequest>(
  "DeleteProjectRequest",
)(
  { ProjectArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectPolicyRequest extends S.Class<DeleteProjectPolicyRequest>(
  "DeleteProjectPolicyRequest",
)(
  {
    ProjectArn: S.String,
    PolicyName: S.String,
    PolicyRevisionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectPolicyResponse extends S.Class<DeleteProjectPolicyResponse>(
  "DeleteProjectPolicyResponse",
)({}) {}
export class DeleteProjectVersionRequest extends S.Class<DeleteProjectVersionRequest>(
  "DeleteProjectVersionRequest",
)(
  { ProjectVersionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStreamProcessorRequest extends S.Class<DeleteStreamProcessorRequest>(
  "DeleteStreamProcessorRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStreamProcessorResponse extends S.Class<DeleteStreamProcessorResponse>(
  "DeleteStreamProcessorResponse",
)({}) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    CollectionId: S.String,
    UserId: S.String,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class DescribeCollectionRequest extends S.Class<DescribeCollectionRequest>(
  "DescribeCollectionRequest",
)(
  { CollectionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { DatasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProjectsRequest extends S.Class<DescribeProjectsRequest>(
  "DescribeProjectsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ProjectNames: S.optional(ProjectNames),
    Features: S.optional(CustomizationFeatures),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProjectVersionsRequest extends S.Class<DescribeProjectVersionsRequest>(
  "DescribeProjectVersionsRequest",
)(
  {
    ProjectArn: S.String,
    VersionNames: S.optional(VersionNames),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStreamProcessorRequest extends S.Class<DescribeStreamProcessorRequest>(
  "DescribeStreamProcessorRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3Object extends S.Class<S3Object>("S3Object")({
  Bucket: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class Image extends S.Class<Image>("Image")({
  Bytes: S.optional(T.Blob),
  S3Object: S.optional(S3Object),
}) {}
export class DetectCustomLabelsRequest extends S.Class<DetectCustomLabelsRequest>(
  "DetectCustomLabelsRequest",
)(
  {
    ProjectVersionArn: S.String,
    Image: Image,
    MaxResults: S.optional(S.Number),
    MinConfidence: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectFacesRequest extends S.Class<DetectFacesRequest>(
  "DetectFacesRequest",
)(
  { Image: Image, Attributes: S.optional(Attributes) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFacesRequest extends S.Class<DisassociateFacesRequest>(
  "DisassociateFacesRequest",
)(
  {
    CollectionId: S.String,
    UserId: S.String,
    ClientRequestToken: S.optional(S.String),
    FaceIds: UserFaceIdList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCelebrityInfoRequest extends S.Class<GetCelebrityInfoRequest>(
  "GetCelebrityInfoRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCelebrityRecognitionRequest extends S.Class<GetCelebrityRecognitionRequest>(
  "GetCelebrityRecognitionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContentModerationRequest extends S.Class<GetContentModerationRequest>(
  "GetContentModerationRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    AggregateBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFaceDetectionRequest extends S.Class<GetFaceDetectionRequest>(
  "GetFaceDetectionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFaceLivenessSessionResultsRequest extends S.Class<GetFaceLivenessSessionResultsRequest>(
  "GetFaceLivenessSessionResultsRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFaceSearchRequest extends S.Class<GetFaceSearchRequest>(
  "GetFaceSearchRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLabelDetectionRequest extends S.Class<GetLabelDetectionRequest>(
  "GetLabelDetectionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    AggregateBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMediaAnalysisJobRequest extends S.Class<GetMediaAnalysisJobRequest>(
  "GetMediaAnalysisJobRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPersonTrackingRequest extends S.Class<GetPersonTrackingRequest>(
  "GetPersonTrackingRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSegmentDetectionRequest extends S.Class<GetSegmentDetectionRequest>(
  "GetSegmentDetectionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTextDetectionRequest extends S.Class<GetTextDetectionRequest>(
  "GetTextDetectionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IndexFacesRequest extends S.Class<IndexFacesRequest>(
  "IndexFacesRequest",
)(
  {
    CollectionId: S.String,
    Image: Image,
    ExternalImageId: S.optional(S.String),
    DetectionAttributes: S.optional(Attributes),
    MaxFaces: S.optional(S.Number),
    QualityFilter: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCollectionsRequest extends S.Class<ListCollectionsRequest>(
  "ListCollectionsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetEntriesRequest extends S.Class<ListDatasetEntriesRequest>(
  "ListDatasetEntriesRequest",
)(
  {
    DatasetArn: S.String,
    ContainsLabels: S.optional(DatasetLabels),
    Labeled: S.optional(S.Boolean),
    SourceRefContains: S.optional(S.String),
    HasErrors: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetLabelsRequest extends S.Class<ListDatasetLabelsRequest>(
  "ListDatasetLabelsRequest",
)(
  {
    DatasetArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFacesRequest extends S.Class<ListFacesRequest>(
  "ListFacesRequest",
)(
  {
    CollectionId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    UserId: S.optional(S.String),
    FaceIds: S.optional(FaceIdList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMediaAnalysisJobsRequest extends S.Class<ListMediaAnalysisJobsRequest>(
  "ListMediaAnalysisJobsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProjectPoliciesRequest extends S.Class<ListProjectPoliciesRequest>(
  "ListProjectPoliciesRequest",
)(
  {
    ProjectArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStreamProcessorsRequest extends S.Class<ListStreamProcessorsRequest>(
  "ListStreamProcessorsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    CollectionId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutProjectPolicyRequest extends S.Class<PutProjectPolicyRequest>(
  "PutProjectPolicyRequest",
)(
  {
    ProjectArn: S.String,
    PolicyName: S.String,
    PolicyRevisionId: S.optional(S.String),
    PolicyDocument: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecognizeCelebritiesRequest extends S.Class<RecognizeCelebritiesRequest>(
  "RecognizeCelebritiesRequest",
)(
  { Image: Image },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchFacesRequest extends S.Class<SearchFacesRequest>(
  "SearchFacesRequest",
)(
  {
    CollectionId: S.String,
    FaceId: S.String,
    MaxFaces: S.optional(S.Number),
    FaceMatchThreshold: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchFacesByImageRequest extends S.Class<SearchFacesByImageRequest>(
  "SearchFacesByImageRequest",
)(
  {
    CollectionId: S.String,
    Image: Image,
    MaxFaces: S.optional(S.Number),
    FaceMatchThreshold: S.optional(S.Number),
    QualityFilter: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchUsersRequest extends S.Class<SearchUsersRequest>(
  "SearchUsersRequest",
)(
  {
    CollectionId: S.String,
    UserId: S.optional(S.String),
    FaceId: S.optional(S.String),
    UserMatchThreshold: S.optional(S.Number),
    MaxUsers: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchUsersByImageRequest extends S.Class<SearchUsersByImageRequest>(
  "SearchUsersByImageRequest",
)(
  {
    CollectionId: S.String,
    Image: Image,
    UserMatchThreshold: S.optional(S.Number),
    MaxUsers: S.optional(S.Number),
    QualityFilter: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Video extends S.Class<Video>("Video")({
  S3Object: S.optional(S3Object),
}) {}
export class NotificationChannel extends S.Class<NotificationChannel>(
  "NotificationChannel",
)({ SNSTopicArn: S.String, RoleArn: S.String }) {}
export class StartContentModerationRequest extends S.Class<StartContentModerationRequest>(
  "StartContentModerationRequest",
)(
  {
    Video: Video,
    MinConfidence: S.optional(S.Number),
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFaceDetectionRequest extends S.Class<StartFaceDetectionRequest>(
  "StartFaceDetectionRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    FaceAttributes: S.optional(S.String),
    JobTag: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFaceSearchRequest extends S.Class<StartFaceSearchRequest>(
  "StartFaceSearchRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    FaceMatchThreshold: S.optional(S.Number),
    CollectionId: S.String,
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartPersonTrackingRequest extends S.Class<StartPersonTrackingRequest>(
  "StartPersonTrackingRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartProjectVersionRequest extends S.Class<StartProjectVersionRequest>(
  "StartProjectVersionRequest",
)(
  {
    ProjectVersionArn: S.String,
    MinInferenceUnits: S.Number,
    MaxInferenceUnits: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopProjectVersionRequest extends S.Class<StopProjectVersionRequest>(
  "StopProjectVersionRequest",
)(
  { ProjectVersionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopStreamProcessorRequest extends S.Class<StopStreamProcessorRequest>(
  "StopStreamProcessorRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopStreamProcessorResponse extends S.Class<StopStreamProcessorResponse>(
  "StopStreamProcessorResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const ProtectiveEquipmentTypes = S.Array(S.String);
export class OutputConfig extends S.Class<OutputConfig>("OutputConfig")({
  S3Bucket: S.optional(S.String),
  S3KeyPrefix: S.optional(S.String),
}) {}
export class GroundTruthManifest extends S.Class<GroundTruthManifest>(
  "GroundTruthManifest",
)({ S3Object: S.optional(S3Object) }) {}
export class Asset extends S.Class<Asset>("Asset")({
  GroundTruthManifest: S.optional(GroundTruthManifest),
}) {}
export const Assets = S.Array(Asset);
export class TestingData extends S.Class<TestingData>("TestingData")({
  Assets: S.optional(Assets),
  AutoCreate: S.optional(S.Boolean),
}) {}
export class StreamProcessorNotificationChannel extends S.Class<StreamProcessorNotificationChannel>(
  "StreamProcessorNotificationChannel",
)({ SNSTopicArn: S.String }) {}
export class StreamProcessorDataSharingPreference extends S.Class<StreamProcessorDataSharingPreference>(
  "StreamProcessorDataSharingPreference",
)({ OptIn: S.Boolean }) {}
export class ProtectiveEquipmentSummarizationAttributes extends S.Class<ProtectiveEquipmentSummarizationAttributes>(
  "ProtectiveEquipmentSummarizationAttributes",
)({
  MinConfidence: S.Number,
  RequiredEquipmentTypes: ProtectiveEquipmentTypes,
}) {}
export class DistributeDataset extends S.Class<DistributeDataset>(
  "DistributeDataset",
)({ Arn: S.String }) {}
export const DistributeDatasetMetadataList = S.Array(DistributeDataset);
export const Urls = S.Array(S.String);
export class BoundingBox extends S.Class<BoundingBox>("BoundingBox")({
  Width: S.optional(S.Number),
  Height: S.optional(S.Number),
  Left: S.optional(S.Number),
  Top: S.optional(S.Number),
}) {}
export class AuditImage extends S.Class<AuditImage>("AuditImage")({
  Bytes: S.optional(T.Blob),
  S3Object: S.optional(S3Object),
  BoundingBox: S.optional(BoundingBox),
}) {}
export const AuditImages = S.Array(AuditImage);
export class VideoMetadata extends S.Class<VideoMetadata>("VideoMetadata")({
  Codec: S.optional(S.String),
  DurationMillis: S.optional(S.Number),
  Format: S.optional(S.String),
  FrameRate: S.optional(S.Number),
  FrameHeight: S.optional(S.Number),
  FrameWidth: S.optional(S.Number),
  ColorRange: S.optional(S.String),
}) {}
export const VideoMetadataList = S.Array(VideoMetadata);
export const CollectionIdList = S.Array(S.String);
export const FaceModelVersionList = S.Array(S.String);
export const DatasetEntries = S.Array(S.String);
export const GeneralLabelsFilterList = S.Array(S.String);
export class GeneralLabelsSettings extends S.Class<GeneralLabelsSettings>(
  "GeneralLabelsSettings",
)({
  LabelInclusionFilters: S.optional(GeneralLabelsFilterList),
  LabelExclusionFilters: S.optional(GeneralLabelsFilterList),
  LabelCategoryInclusionFilters: S.optional(GeneralLabelsFilterList),
  LabelCategoryExclusionFilters: S.optional(GeneralLabelsFilterList),
}) {}
export class LabelDetectionSettings extends S.Class<LabelDetectionSettings>(
  "LabelDetectionSettings",
)({ GeneralLabels: S.optional(GeneralLabelsSettings) }) {}
export class MediaAnalysisInput extends S.Class<MediaAnalysisInput>(
  "MediaAnalysisInput",
)({ S3Object: S3Object }) {}
export class MediaAnalysisOutputConfig extends S.Class<MediaAnalysisOutputConfig>(
  "MediaAnalysisOutputConfig",
)({ S3Bucket: S.String, S3KeyPrefix: S.optional(S.String) }) {}
export class StreamProcessingStopSelector extends S.Class<StreamProcessingStopSelector>(
  "StreamProcessingStopSelector",
)({ MaxDurationInSeconds: S.optional(S.Number) }) {}
export class DetectionFilter extends S.Class<DetectionFilter>(
  "DetectionFilter",
)({
  MinConfidence: S.optional(S.Number),
  MinBoundingBoxHeight: S.optional(S.Number),
  MinBoundingBoxWidth: S.optional(S.Number),
}) {}
export class Point extends S.Class<Point>("Point")({
  X: S.optional(S.Number),
  Y: S.optional(S.Number),
}) {}
export const Polygon = S.Array(Point);
export class RegionOfInterest extends S.Class<RegionOfInterest>(
  "RegionOfInterest",
)({ BoundingBox: S.optional(BoundingBox), Polygon: S.optional(Polygon) }) {}
export const RegionsOfInterest = S.Array(RegionOfInterest);
export class StartTextDetectionFilters extends S.Class<StartTextDetectionFilters>(
  "StartTextDetectionFilters",
)({
  WordFilter: S.optional(DetectionFilter),
  RegionsOfInterest: S.optional(RegionsOfInterest),
}) {}
export class DatasetChanges extends S.Class<DatasetChanges>("DatasetChanges")({
  GroundTruth: T.Blob,
}) {}
export const ConnectedHomeLabels = S.Array(S.String);
export const ContentClassifiers = S.Array(S.String);
export class CopyProjectVersionRequest extends S.Class<CopyProjectVersionRequest>(
  "CopyProjectVersionRequest",
)(
  {
    SourceProjectArn: S.String,
    SourceProjectVersionArn: S.String,
    DestinationProjectArn: S.String,
    VersionName: S.String,
    OutputConfig: OutputConfig,
    Tags: S.optional(TagMap),
    KmsKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCollectionResponse extends S.Class<CreateCollectionResponse>(
  "CreateCollectionResponse",
)({
  StatusCode: S.optional(S.Number),
  CollectionArn: S.optional(S.String),
  FaceModelVersion: S.optional(S.String),
}) {}
export class CreateProjectResponse extends S.Class<CreateProjectResponse>(
  "CreateProjectResponse",
)({ ProjectArn: S.optional(S.String) }) {}
export class DeleteCollectionResponse extends S.Class<DeleteCollectionResponse>(
  "DeleteCollectionResponse",
)({ StatusCode: S.optional(S.Number) }) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({ Status: S.optional(S.String) }) {}
export class DeleteProjectVersionResponse extends S.Class<DeleteProjectVersionResponse>(
  "DeleteProjectVersionResponse",
)({ Status: S.optional(S.String) }) {}
export class DescribeCollectionResponse extends S.Class<DescribeCollectionResponse>(
  "DescribeCollectionResponse",
)({
  FaceCount: S.optional(S.Number),
  FaceModelVersion: S.optional(S.String),
  CollectionARN: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  UserCount: S.optional(S.Number),
}) {}
export class KinesisVideoStream extends S.Class<KinesisVideoStream>(
  "KinesisVideoStream",
)({ Arn: S.optional(S.String) }) {}
export class StreamProcessorInput extends S.Class<StreamProcessorInput>(
  "StreamProcessorInput",
)({ KinesisVideoStream: S.optional(KinesisVideoStream) }) {}
export class KinesisDataStream extends S.Class<KinesisDataStream>(
  "KinesisDataStream",
)({ Arn: S.optional(S.String) }) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  Bucket: S.optional(S.String),
  KeyPrefix: S.optional(S.String),
}) {}
export class StreamProcessorOutput extends S.Class<StreamProcessorOutput>(
  "StreamProcessorOutput",
)({
  KinesisDataStream: S.optional(KinesisDataStream),
  S3Destination: S.optional(S3Destination),
}) {}
export class FaceSearchSettings extends S.Class<FaceSearchSettings>(
  "FaceSearchSettings",
)({
  CollectionId: S.optional(S.String),
  FaceMatchThreshold: S.optional(S.Number),
}) {}
export class ConnectedHomeSettings extends S.Class<ConnectedHomeSettings>(
  "ConnectedHomeSettings",
)({ Labels: ConnectedHomeLabels, MinConfidence: S.optional(S.Number) }) {}
export class StreamProcessorSettings extends S.Class<StreamProcessorSettings>(
  "StreamProcessorSettings",
)({
  FaceSearch: S.optional(FaceSearchSettings),
  ConnectedHome: S.optional(ConnectedHomeSettings),
}) {}
export class DescribeStreamProcessorResponse extends S.Class<DescribeStreamProcessorResponse>(
  "DescribeStreamProcessorResponse",
)({
  Name: S.optional(S.String),
  StreamProcessorArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Input: S.optional(StreamProcessorInput),
  Output: S.optional(StreamProcessorOutput),
  RoleArn: S.optional(S.String),
  Settings: S.optional(StreamProcessorSettings),
  NotificationChannel: S.optional(StreamProcessorNotificationChannel),
  KmsKeyId: S.optional(S.String),
  RegionsOfInterest: S.optional(RegionsOfInterest),
  DataSharingPreference: S.optional(StreamProcessorDataSharingPreference),
}) {}
export class DetectProtectiveEquipmentRequest extends S.Class<DetectProtectiveEquipmentRequest>(
  "DetectProtectiveEquipmentRequest",
)(
  {
    Image: Image,
    SummarizationAttributes: S.optional(
      ProtectiveEquipmentSummarizationAttributes,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DistributeDatasetEntriesRequest extends S.Class<DistributeDatasetEntriesRequest>(
  "DistributeDatasetEntriesRequest",
)(
  { Datasets: DistributeDatasetMetadataList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DistributeDatasetEntriesResponse extends S.Class<DistributeDatasetEntriesResponse>(
  "DistributeDatasetEntriesResponse",
)({}) {}
export class ListCollectionsResponse extends S.Class<ListCollectionsResponse>(
  "ListCollectionsResponse",
)({
  CollectionIds: S.optional(CollectionIdList),
  NextToken: S.optional(S.String),
  FaceModelVersions: S.optional(FaceModelVersionList),
}) {}
export class ListDatasetEntriesResponse extends S.Class<ListDatasetEntriesResponse>(
  "ListDatasetEntriesResponse",
)({
  DatasetEntries: S.optional(DatasetEntries),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class PutProjectPolicyResponse extends S.Class<PutProjectPolicyResponse>(
  "PutProjectPolicyResponse",
)({ PolicyRevisionId: S.optional(S.String) }) {}
export class Face extends S.Class<Face>("Face")({
  FaceId: S.optional(S.String),
  BoundingBox: S.optional(BoundingBox),
  ImageId: S.optional(S.String),
  ExternalImageId: S.optional(S.String),
  Confidence: S.optional(S.Number),
  IndexFacesModelVersion: S.optional(S.String),
  UserId: S.optional(S.String),
}) {}
export class FaceMatch extends S.Class<FaceMatch>("FaceMatch")({
  Similarity: S.optional(S.Number),
  Face: S.optional(Face),
}) {}
export const FaceMatchList = S.Array(FaceMatch);
export class SearchFacesByImageResponse extends S.Class<SearchFacesByImageResponse>(
  "SearchFacesByImageResponse",
)({
  SearchedFaceBoundingBox: S.optional(BoundingBox),
  SearchedFaceConfidence: S.optional(S.Number),
  FaceMatches: S.optional(FaceMatchList),
  FaceModelVersion: S.optional(S.String),
}) {}
export class StartCelebrityRecognitionRequest extends S.Class<StartCelebrityRecognitionRequest>(
  "StartCelebrityRecognitionRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartContentModerationResponse extends S.Class<StartContentModerationResponse>(
  "StartContentModerationResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartFaceDetectionResponse extends S.Class<StartFaceDetectionResponse>(
  "StartFaceDetectionResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartFaceSearchResponse extends S.Class<StartFaceSearchResponse>(
  "StartFaceSearchResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartLabelDetectionRequest extends S.Class<StartLabelDetectionRequest>(
  "StartLabelDetectionRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    MinConfidence: S.optional(S.Number),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
    Features: S.optional(LabelDetectionFeatureList),
    Settings: S.optional(LabelDetectionSettings),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartPersonTrackingResponse extends S.Class<StartPersonTrackingResponse>(
  "StartPersonTrackingResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartProjectVersionResponse extends S.Class<StartProjectVersionResponse>(
  "StartProjectVersionResponse",
)({ Status: S.optional(S.String) }) {}
export class StartTextDetectionRequest extends S.Class<StartTextDetectionRequest>(
  "StartTextDetectionRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
    Filters: S.optional(StartTextDetectionFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopProjectVersionResponse extends S.Class<StopProjectVersionResponse>(
  "StopProjectVersionResponse",
)({ Status: S.optional(S.String) }) {}
export class UpdateDatasetEntriesRequest extends S.Class<UpdateDatasetEntriesRequest>(
  "UpdateDatasetEntriesRequest",
)(
  { DatasetArn: S.String, Changes: DatasetChanges },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDatasetEntriesResponse extends S.Class<UpdateDatasetEntriesResponse>(
  "UpdateDatasetEntriesResponse",
)({}) {}
export const UnsuccessfulFaceAssociationReasons = S.Array(S.String);
export class LivenessOutputConfig extends S.Class<LivenessOutputConfig>(
  "LivenessOutputConfig",
)({ S3Bucket: S.String, S3KeyPrefix: S.optional(S.String) }) {}
export class CustomizationFeatureContentModerationConfig extends S.Class<CustomizationFeatureContentModerationConfig>(
  "CustomizationFeatureContentModerationConfig",
)({ ConfidenceThreshold: S.optional(S.Number) }) {}
export const UnsuccessfulFaceDeletionReasons = S.Array(S.String);
export class DetectLabelsImagePropertiesSettings extends S.Class<DetectLabelsImagePropertiesSettings>(
  "DetectLabelsImagePropertiesSettings",
)({ MaxDominantColors: S.optional(S.Number) }) {}
export class HumanLoopDataAttributes extends S.Class<HumanLoopDataAttributes>(
  "HumanLoopDataAttributes",
)({ ContentClassifiers: S.optional(ContentClassifiers) }) {}
export const UnsuccessfulFaceDisassociationReasons = S.Array(S.String);
export const Reasons = S.Array(S.String);
export const UnsearchedFaceReasons = S.Array(S.String);
export class MediaAnalysisDetectModerationLabelsConfig extends S.Class<MediaAnalysisDetectModerationLabelsConfig>(
  "MediaAnalysisDetectModerationLabelsConfig",
)({
  MinConfidence: S.optional(S.Number),
  ProjectVersion: S.optional(S.String),
}) {}
export class StartShotDetectionFilter extends S.Class<StartShotDetectionFilter>(
  "StartShotDetectionFilter",
)({ MinSegmentConfidence: S.optional(S.Number) }) {}
export class KinesisVideoStreamStartSelector extends S.Class<KinesisVideoStreamStartSelector>(
  "KinesisVideoStreamStartSelector",
)({
  ProducerTimestamp: S.optional(S.Number),
  FragmentNumber: S.optional(S.String),
}) {}
export class ConnectedHomeSettingsForUpdate extends S.Class<ConnectedHomeSettingsForUpdate>(
  "ConnectedHomeSettingsForUpdate",
)({
  Labels: S.optional(ConnectedHomeLabels),
  MinConfidence: S.optional(S.Number),
}) {}
export class AssociatedFace extends S.Class<AssociatedFace>("AssociatedFace")({
  FaceId: S.optional(S.String),
}) {}
export const AssociatedFacesList = S.Array(AssociatedFace);
export class UnsuccessfulFaceAssociation extends S.Class<UnsuccessfulFaceAssociation>(
  "UnsuccessfulFaceAssociation",
)({
  FaceId: S.optional(S.String),
  UserId: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Reasons: S.optional(UnsuccessfulFaceAssociationReasons),
}) {}
export const UnsuccessfulFaceAssociationList = S.Array(
  UnsuccessfulFaceAssociation,
);
export class DatasetSource extends S.Class<DatasetSource>("DatasetSource")({
  GroundTruthManifest: S.optional(GroundTruthManifest),
  DatasetArn: S.optional(S.String),
}) {}
export class TrainingData extends S.Class<TrainingData>("TrainingData")({
  Assets: S.optional(Assets),
}) {}
export class CustomizationFeatureConfig extends S.Class<CustomizationFeatureConfig>(
  "CustomizationFeatureConfig",
)({
  ContentModeration: S.optional(CustomizationFeatureContentModerationConfig),
}) {}
export class UnsuccessfulFaceDeletion extends S.Class<UnsuccessfulFaceDeletion>(
  "UnsuccessfulFaceDeletion",
)({
  FaceId: S.optional(S.String),
  UserId: S.optional(S.String),
  Reasons: S.optional(UnsuccessfulFaceDeletionReasons),
}) {}
export const UnsuccessfulFaceDeletionsList = S.Array(UnsuccessfulFaceDeletion);
export class DetectLabelsSettings extends S.Class<DetectLabelsSettings>(
  "DetectLabelsSettings",
)({
  GeneralLabels: S.optional(GeneralLabelsSettings),
  ImageProperties: S.optional(DetectLabelsImagePropertiesSettings),
}) {}
export class HumanLoopConfig extends S.Class<HumanLoopConfig>(
  "HumanLoopConfig",
)({
  HumanLoopName: S.String,
  FlowDefinitionArn: S.String,
  DataAttributes: S.optional(HumanLoopDataAttributes),
}) {}
export class DetectTextFilters extends S.Class<DetectTextFilters>(
  "DetectTextFilters",
)({
  WordFilter: S.optional(DetectionFilter),
  RegionsOfInterest: S.optional(RegionsOfInterest),
}) {}
export class DisassociatedFace extends S.Class<DisassociatedFace>(
  "DisassociatedFace",
)({ FaceId: S.optional(S.String) }) {}
export const DisassociatedFacesList = S.Array(DisassociatedFace);
export class UnsuccessfulFaceDisassociation extends S.Class<UnsuccessfulFaceDisassociation>(
  "UnsuccessfulFaceDisassociation",
)({
  FaceId: S.optional(S.String),
  UserId: S.optional(S.String),
  Reasons: S.optional(UnsuccessfulFaceDisassociationReasons),
}) {}
export const UnsuccessfulFaceDisassociationList = S.Array(
  UnsuccessfulFaceDisassociation,
);
export class KnownGender extends S.Class<KnownGender>("KnownGender")({
  Type: S.optional(S.String),
}) {}
export class GetContentModerationRequestMetadata extends S.Class<GetContentModerationRequestMetadata>(
  "GetContentModerationRequestMetadata",
)({ SortBy: S.optional(S.String), AggregateBy: S.optional(S.String) }) {}
export class AgeRange extends S.Class<AgeRange>("AgeRange")({
  Low: S.optional(S.Number),
  High: S.optional(S.Number),
}) {}
export class Smile extends S.Class<Smile>("Smile")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class Eyeglasses extends S.Class<Eyeglasses>("Eyeglasses")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class Sunglasses extends S.Class<Sunglasses>("Sunglasses")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class Gender extends S.Class<Gender>("Gender")({
  Value: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export class Beard extends S.Class<Beard>("Beard")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class Mustache extends S.Class<Mustache>("Mustache")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class EyeOpen extends S.Class<EyeOpen>("EyeOpen")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class MouthOpen extends S.Class<MouthOpen>("MouthOpen")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class Emotion extends S.Class<Emotion>("Emotion")({
  Type: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export const Emotions = S.Array(Emotion);
export class Landmark extends S.Class<Landmark>("Landmark")({
  Type: S.optional(S.String),
  X: S.optional(S.Number),
  Y: S.optional(S.Number),
}) {}
export const Landmarks = S.Array(Landmark);
export class Pose extends S.Class<Pose>("Pose")({
  Roll: S.optional(S.Number),
  Yaw: S.optional(S.Number),
  Pitch: S.optional(S.Number),
}) {}
export class ImageQuality extends S.Class<ImageQuality>("ImageQuality")({
  Brightness: S.optional(S.Number),
  Sharpness: S.optional(S.Number),
}) {}
export class FaceOccluded extends S.Class<FaceOccluded>("FaceOccluded")({
  Value: S.optional(S.Boolean),
  Confidence: S.optional(S.Number),
}) {}
export class EyeDirection extends S.Class<EyeDirection>("EyeDirection")({
  Yaw: S.optional(S.Number),
  Pitch: S.optional(S.Number),
  Confidence: S.optional(S.Number),
}) {}
export class FaceDetail extends S.Class<FaceDetail>("FaceDetail")({
  BoundingBox: S.optional(BoundingBox),
  AgeRange: S.optional(AgeRange),
  Smile: S.optional(Smile),
  Eyeglasses: S.optional(Eyeglasses),
  Sunglasses: S.optional(Sunglasses),
  Gender: S.optional(Gender),
  Beard: S.optional(Beard),
  Mustache: S.optional(Mustache),
  EyesOpen: S.optional(EyeOpen),
  MouthOpen: S.optional(MouthOpen),
  Emotions: S.optional(Emotions),
  Landmarks: S.optional(Landmarks),
  Pose: S.optional(Pose),
  Quality: S.optional(ImageQuality),
  Confidence: S.optional(S.Number),
  FaceOccluded: S.optional(FaceOccluded),
  EyeDirection: S.optional(EyeDirection),
}) {}
export class FaceDetection extends S.Class<FaceDetection>("FaceDetection")({
  Timestamp: S.optional(S.Number),
  Face: S.optional(FaceDetail),
}) {}
export const FaceDetections = S.Array(FaceDetection);
export class Challenge extends S.Class<Challenge>("Challenge")({
  Type: S.String,
  Version: S.String,
}) {}
export class GetLabelDetectionRequestMetadata extends S.Class<GetLabelDetectionRequestMetadata>(
  "GetLabelDetectionRequestMetadata",
)({ SortBy: S.optional(S.String), AggregateBy: S.optional(S.String) }) {}
export class MediaAnalysisJobFailureDetails extends S.Class<MediaAnalysisJobFailureDetails>(
  "MediaAnalysisJobFailureDetails",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class MediaAnalysisManifestSummary extends S.Class<MediaAnalysisManifestSummary>(
  "MediaAnalysisManifestSummary",
)({ S3Object: S.optional(S3Object) }) {}
export class PersonDetail extends S.Class<PersonDetail>("PersonDetail")({
  Index: S.optional(S.Number),
  BoundingBox: S.optional(BoundingBox),
  Face: S.optional(FaceDetail),
}) {}
export class PersonDetection extends S.Class<PersonDetection>(
  "PersonDetection",
)({ Timestamp: S.optional(S.Number), Person: S.optional(PersonDetail) }) {}
export const PersonDetections = S.Array(PersonDetection);
export class AudioMetadata extends S.Class<AudioMetadata>("AudioMetadata")({
  Codec: S.optional(S.String),
  DurationMillis: S.optional(S.Number),
  SampleRate: S.optional(S.Number),
  NumberOfChannels: S.optional(S.Number),
}) {}
export const AudioMetadataList = S.Array(AudioMetadata);
export class SegmentTypeInfo extends S.Class<SegmentTypeInfo>(
  "SegmentTypeInfo",
)({ Type: S.optional(S.String), ModelVersion: S.optional(S.String) }) {}
export const SegmentTypesInfo = S.Array(SegmentTypeInfo);
export class FaceRecord extends S.Class<FaceRecord>("FaceRecord")({
  Face: S.optional(Face),
  FaceDetail: S.optional(FaceDetail),
}) {}
export const FaceRecordList = S.Array(FaceRecord);
export class UnindexedFace extends S.Class<UnindexedFace>("UnindexedFace")({
  Reasons: S.optional(Reasons),
  FaceDetail: S.optional(FaceDetail),
}) {}
export const UnindexedFaces = S.Array(UnindexedFace);
export const FaceList = S.Array(Face);
export class MediaAnalysisOperationsConfig extends S.Class<MediaAnalysisOperationsConfig>(
  "MediaAnalysisOperationsConfig",
)({
  DetectModerationLabels: S.optional(MediaAnalysisDetectModerationLabelsConfig),
}) {}
export class MediaAnalysisModelVersions extends S.Class<MediaAnalysisModelVersions>(
  "MediaAnalysisModelVersions",
)({ Moderation: S.optional(S.String) }) {}
export class MediaAnalysisResults extends S.Class<MediaAnalysisResults>(
  "MediaAnalysisResults",
)({
  S3Object: S.optional(S3Object),
  ModelVersions: S.optional(MediaAnalysisModelVersions),
}) {}
export class MediaAnalysisJobDescription extends S.Class<MediaAnalysisJobDescription>(
  "MediaAnalysisJobDescription",
)({
  JobId: S.String,
  JobName: S.optional(S.String),
  OperationsConfig: MediaAnalysisOperationsConfig,
  Status: S.String,
  FailureDetails: S.optional(MediaAnalysisJobFailureDetails),
  CreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CompletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Input: MediaAnalysisInput,
  OutputConfig: MediaAnalysisOutputConfig,
  KmsKeyId: S.optional(S.String),
  Results: S.optional(MediaAnalysisResults),
  ManifestSummary: S.optional(MediaAnalysisManifestSummary),
}) {}
export const MediaAnalysisJobDescriptions = S.Array(
  MediaAnalysisJobDescription,
);
export class ProjectPolicy extends S.Class<ProjectPolicy>("ProjectPolicy")({
  ProjectArn: S.optional(S.String),
  PolicyName: S.optional(S.String),
  PolicyRevisionId: S.optional(S.String),
  PolicyDocument: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ProjectPolicies = S.Array(ProjectPolicy);
export class StreamProcessor extends S.Class<StreamProcessor>(
  "StreamProcessor",
)({ Name: S.optional(S.String), Status: S.optional(S.String) }) {}
export const StreamProcessorList = S.Array(StreamProcessor);
export class User extends S.Class<User>("User")({
  UserId: S.optional(S.String),
  UserStatus: S.optional(S.String),
}) {}
export const UserList = S.Array(User);
export class ComparedFace extends S.Class<ComparedFace>("ComparedFace")({
  BoundingBox: S.optional(BoundingBox),
  Confidence: S.optional(S.Number),
  Landmarks: S.optional(Landmarks),
  Pose: S.optional(Pose),
  Quality: S.optional(ImageQuality),
  Emotions: S.optional(Emotions),
  Smile: S.optional(Smile),
}) {}
export class Celebrity extends S.Class<Celebrity>("Celebrity")({
  Urls: S.optional(Urls),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Face: S.optional(ComparedFace),
  MatchConfidence: S.optional(S.Number),
  KnownGender: S.optional(KnownGender),
}) {}
export const CelebrityList = S.Array(Celebrity);
export const ComparedFaceList = S.Array(ComparedFace);
export class SearchedFace extends S.Class<SearchedFace>("SearchedFace")({
  FaceId: S.optional(S.String),
}) {}
export class SearchedUser extends S.Class<SearchedUser>("SearchedUser")({
  UserId: S.optional(S.String),
}) {}
export class SearchedFaceDetails extends S.Class<SearchedFaceDetails>(
  "SearchedFaceDetails",
)({ FaceDetail: S.optional(FaceDetail) }) {}
export class UnsearchedFace extends S.Class<UnsearchedFace>("UnsearchedFace")({
  FaceDetails: S.optional(FaceDetail),
  Reasons: S.optional(UnsearchedFaceReasons),
}) {}
export const UnsearchedFacesList = S.Array(UnsearchedFace);
export class StreamProcessingStartSelector extends S.Class<StreamProcessingStartSelector>(
  "StreamProcessingStartSelector",
)({ KVSStreamStartSelector: S.optional(KinesisVideoStreamStartSelector) }) {}
export class StreamProcessorSettingsForUpdate extends S.Class<StreamProcessorSettingsForUpdate>(
  "StreamProcessorSettingsForUpdate",
)({ ConnectedHomeForUpdate: S.optional(ConnectedHomeSettingsForUpdate) }) {}
export class Versions extends S.Class<Versions>("Versions")({
  Minimum: S.optional(S.String),
  Maximum: S.optional(S.String),
}) {}
export class BlackFrame extends S.Class<BlackFrame>("BlackFrame")({
  MaxPixelThreshold: S.optional(S.Number),
  MinCoveragePercentage: S.optional(S.Number),
}) {}
export class AssociateFacesResponse extends S.Class<AssociateFacesResponse>(
  "AssociateFacesResponse",
)({
  AssociatedFaces: S.optional(AssociatedFacesList),
  UnsuccessfulFaceAssociations: S.optional(UnsuccessfulFaceAssociationList),
  UserStatus: S.optional(S.String),
}) {}
export class CompareFacesRequest extends S.Class<CompareFacesRequest>(
  "CompareFacesRequest",
)(
  {
    SourceImage: Image,
    TargetImage: Image,
    SimilarityThreshold: S.optional(S.Number),
    QualityFilter: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyProjectVersionResponse extends S.Class<CopyProjectVersionResponse>(
  "CopyProjectVersionResponse",
)({ ProjectVersionArn: S.optional(S.String) }) {}
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    DatasetSource: S.optional(DatasetSource),
    DatasetType: S.String,
    ProjectArn: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProjectVersionRequest extends S.Class<CreateProjectVersionRequest>(
  "CreateProjectVersionRequest",
)(
  {
    ProjectArn: S.String,
    VersionName: S.String,
    OutputConfig: OutputConfig,
    TrainingData: S.optional(TrainingData),
    TestingData: S.optional(TestingData),
    Tags: S.optional(TagMap),
    KmsKeyId: S.optional(S.String),
    VersionDescription: S.optional(S.String),
    FeatureConfig: S.optional(CustomizationFeatureConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStreamProcessorRequest extends S.Class<CreateStreamProcessorRequest>(
  "CreateStreamProcessorRequest",
)(
  {
    Input: StreamProcessorInput,
    Output: StreamProcessorOutput,
    Name: S.String,
    Settings: StreamProcessorSettings,
    RoleArn: S.String,
    Tags: S.optional(TagMap),
    NotificationChannel: S.optional(StreamProcessorNotificationChannel),
    KmsKeyId: S.optional(S.String),
    RegionsOfInterest: S.optional(RegionsOfInterest),
    DataSharingPreference: S.optional(StreamProcessorDataSharingPreference),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFacesResponse extends S.Class<DeleteFacesResponse>(
  "DeleteFacesResponse",
)({
  DeletedFaces: S.optional(FaceIdList),
  UnsuccessfulFaceDeletions: S.optional(UnsuccessfulFaceDeletionsList),
}) {}
export class DetectLabelsRequest extends S.Class<DetectLabelsRequest>(
  "DetectLabelsRequest",
)(
  {
    Image: Image,
    MaxLabels: S.optional(S.Number),
    MinConfidence: S.optional(S.Number),
    Features: S.optional(DetectLabelsFeatureList),
    Settings: S.optional(DetectLabelsSettings),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectModerationLabelsRequest extends S.Class<DetectModerationLabelsRequest>(
  "DetectModerationLabelsRequest",
)(
  {
    Image: Image,
    MinConfidence: S.optional(S.Number),
    HumanLoopConfig: S.optional(HumanLoopConfig),
    ProjectVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectTextRequest extends S.Class<DetectTextRequest>(
  "DetectTextRequest",
)(
  { Image: Image, Filters: S.optional(DetectTextFilters) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFacesResponse extends S.Class<DisassociateFacesResponse>(
  "DisassociateFacesResponse",
)({
  DisassociatedFaces: S.optional(DisassociatedFacesList),
  UnsuccessfulFaceDisassociations: S.optional(
    UnsuccessfulFaceDisassociationList,
  ),
  UserStatus: S.optional(S.String),
}) {}
export class GetCelebrityInfoResponse extends S.Class<GetCelebrityInfoResponse>(
  "GetCelebrityInfoResponse",
)({
  Urls: S.optional(Urls),
  Name: S.optional(S.String),
  KnownGender: S.optional(KnownGender),
}) {}
export class GetFaceDetectionResponse extends S.Class<GetFaceDetectionResponse>(
  "GetFaceDetectionResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  NextToken: S.optional(S.String),
  Faces: S.optional(FaceDetections),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class GetFaceLivenessSessionResultsResponse extends S.Class<GetFaceLivenessSessionResultsResponse>(
  "GetFaceLivenessSessionResultsResponse",
)({
  SessionId: S.String,
  Status: S.String,
  Confidence: S.optional(S.Number),
  ReferenceImage: S.optional(AuditImage),
  AuditImages: S.optional(AuditImages),
  Challenge: S.optional(Challenge),
}) {}
export class GetPersonTrackingResponse extends S.Class<GetPersonTrackingResponse>(
  "GetPersonTrackingResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  NextToken: S.optional(S.String),
  Persons: S.optional(PersonDetections),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class IndexFacesResponse extends S.Class<IndexFacesResponse>(
  "IndexFacesResponse",
)({
  FaceRecords: S.optional(FaceRecordList),
  OrientationCorrection: S.optional(S.String),
  FaceModelVersion: S.optional(S.String),
  UnindexedFaces: S.optional(UnindexedFaces),
}) {}
export class ListFacesResponse extends S.Class<ListFacesResponse>(
  "ListFacesResponse",
)({
  Faces: S.optional(FaceList),
  NextToken: S.optional(S.String),
  FaceModelVersion: S.optional(S.String),
}) {}
export class ListMediaAnalysisJobsResponse extends S.Class<ListMediaAnalysisJobsResponse>(
  "ListMediaAnalysisJobsResponse",
)({
  NextToken: S.optional(S.String),
  MediaAnalysisJobs: MediaAnalysisJobDescriptions,
}) {}
export class ListProjectPoliciesResponse extends S.Class<ListProjectPoliciesResponse>(
  "ListProjectPoliciesResponse",
)({
  ProjectPolicies: S.optional(ProjectPolicies),
  NextToken: S.optional(S.String),
}) {}
export class ListStreamProcessorsResponse extends S.Class<ListStreamProcessorsResponse>(
  "ListStreamProcessorsResponse",
)({
  NextToken: S.optional(S.String),
  StreamProcessors: S.optional(StreamProcessorList),
}) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ Users: S.optional(UserList), NextToken: S.optional(S.String) }) {}
export class RecognizeCelebritiesResponse extends S.Class<RecognizeCelebritiesResponse>(
  "RecognizeCelebritiesResponse",
)({
  CelebrityFaces: S.optional(CelebrityList),
  UnrecognizedFaces: S.optional(ComparedFaceList),
  OrientationCorrection: S.optional(S.String),
}) {}
export class SearchFacesResponse extends S.Class<SearchFacesResponse>(
  "SearchFacesResponse",
)({
  SearchedFaceId: S.optional(S.String),
  FaceMatches: S.optional(FaceMatchList),
  FaceModelVersion: S.optional(S.String),
}) {}
export class MatchedUser extends S.Class<MatchedUser>("MatchedUser")({
  UserId: S.optional(S.String),
  UserStatus: S.optional(S.String),
}) {}
export class UserMatch extends S.Class<UserMatch>("UserMatch")({
  Similarity: S.optional(S.Number),
  User: S.optional(MatchedUser),
}) {}
export const UserMatchList = S.Array(UserMatch);
export class SearchUsersByImageResponse extends S.Class<SearchUsersByImageResponse>(
  "SearchUsersByImageResponse",
)({
  UserMatches: S.optional(UserMatchList),
  FaceModelVersion: S.optional(S.String),
  SearchedFace: S.optional(SearchedFaceDetails),
  UnsearchedFaces: S.optional(UnsearchedFacesList),
}) {}
export class StartCelebrityRecognitionResponse extends S.Class<StartCelebrityRecognitionResponse>(
  "StartCelebrityRecognitionResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartLabelDetectionResponse extends S.Class<StartLabelDetectionResponse>(
  "StartLabelDetectionResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartMediaAnalysisJobRequest extends S.Class<StartMediaAnalysisJobRequest>(
  "StartMediaAnalysisJobRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    JobName: S.optional(S.String),
    OperationsConfig: MediaAnalysisOperationsConfig,
    Input: MediaAnalysisInput,
    OutputConfig: MediaAnalysisOutputConfig,
    KmsKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartStreamProcessorRequest extends S.Class<StartStreamProcessorRequest>(
  "StartStreamProcessorRequest",
)(
  {
    Name: S.String,
    StartSelector: S.optional(StreamProcessingStartSelector),
    StopSelector: S.optional(StreamProcessingStopSelector),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTextDetectionResponse extends S.Class<StartTextDetectionResponse>(
  "StartTextDetectionResponse",
)({ JobId: S.optional(S.String) }) {}
export class UpdateStreamProcessorRequest extends S.Class<UpdateStreamProcessorRequest>(
  "UpdateStreamProcessorRequest",
)(
  {
    Name: S.String,
    SettingsForUpdate: S.optional(StreamProcessorSettingsForUpdate),
    RegionsOfInterestForUpdate: S.optional(RegionsOfInterest),
    DataSharingPreferenceForUpdate: S.optional(
      StreamProcessorDataSharingPreference,
    ),
    ParametersToDelete: S.optional(StreamProcessorParametersToDelete),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStreamProcessorResponse extends S.Class<UpdateStreamProcessorResponse>(
  "UpdateStreamProcessorResponse",
)({}) {}
export class ChallengePreference extends S.Class<ChallengePreference>(
  "ChallengePreference",
)({ Type: S.String, Versions: S.optional(Versions) }) {}
export const ChallengePreferences = S.Array(ChallengePreference);
export class DatasetStats extends S.Class<DatasetStats>("DatasetStats")({
  LabeledEntries: S.optional(S.Number),
  TotalEntries: S.optional(S.Number),
  TotalLabels: S.optional(S.Number),
  ErrorEntries: S.optional(S.Number),
}) {}
export class DatasetMetadata extends S.Class<DatasetMetadata>(
  "DatasetMetadata",
)({
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DatasetType: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  StatusMessageCode: S.optional(S.String),
}) {}
export const DatasetMetadataList = S.Array(DatasetMetadata);
export class ValidationData extends S.Class<ValidationData>("ValidationData")({
  Assets: S.optional(Assets),
}) {}
export class TestingDataResult extends S.Class<TestingDataResult>(
  "TestingDataResult",
)({
  Input: S.optional(TestingData),
  Output: S.optional(TestingData),
  Validation: S.optional(ValidationData),
}) {}
export class Geometry extends S.Class<Geometry>("Geometry")({
  BoundingBox: S.optional(BoundingBox),
  Polygon: S.optional(Polygon),
}) {}
export const ProtectiveEquipmentPersonIds = S.Array(S.Number);
export class CelebrityDetail extends S.Class<CelebrityDetail>(
  "CelebrityDetail",
)({
  Urls: S.optional(Urls),
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Confidence: S.optional(S.Number),
  BoundingBox: S.optional(BoundingBox),
  Face: S.optional(FaceDetail),
  KnownGender: S.optional(KnownGender),
}) {}
export class ModerationLabel extends S.Class<ModerationLabel>(
  "ModerationLabel",
)({
  Confidence: S.optional(S.Number),
  Name: S.optional(S.String),
  ParentName: S.optional(S.String),
  TaxonomyLevel: S.optional(S.Number),
}) {}
export class ContentType extends S.Class<ContentType>("ContentType")({
  Confidence: S.optional(S.Number),
  Name: S.optional(S.String),
}) {}
export const ContentTypes = S.Array(ContentType);
export class TechnicalCueSegment extends S.Class<TechnicalCueSegment>(
  "TechnicalCueSegment",
)({ Type: S.optional(S.String), Confidence: S.optional(S.Number) }) {}
export class ShotSegment extends S.Class<ShotSegment>("ShotSegment")({
  Index: S.optional(S.Number),
  Confidence: S.optional(S.Number),
}) {}
export class TextDetection extends S.Class<TextDetection>("TextDetection")({
  DetectedText: S.optional(S.String),
  Type: S.optional(S.String),
  Id: S.optional(S.Number),
  ParentId: S.optional(S.Number),
  Confidence: S.optional(S.Number),
  Geometry: S.optional(Geometry),
}) {}
export class DatasetLabelStats extends S.Class<DatasetLabelStats>(
  "DatasetLabelStats",
)({
  EntryCount: S.optional(S.Number),
  BoundingBoxCount: S.optional(S.Number),
}) {}
export class StartTechnicalCueDetectionFilter extends S.Class<StartTechnicalCueDetectionFilter>(
  "StartTechnicalCueDetectionFilter",
)({
  MinSegmentConfidence: S.optional(S.Number),
  BlackFrame: S.optional(BlackFrame),
}) {}
export const CompareFacesUnmatchList = S.Array(ComparedFace);
export class CreateFaceLivenessSessionRequestSettings extends S.Class<CreateFaceLivenessSessionRequestSettings>(
  "CreateFaceLivenessSessionRequestSettings",
)({
  OutputConfig: S.optional(LivenessOutputConfig),
  AuditImagesLimit: S.optional(S.Number),
  ChallengePreferences: S.optional(ChallengePreferences),
}) {}
export class DatasetDescription extends S.Class<DatasetDescription>(
  "DatasetDescription",
)({
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  StatusMessageCode: S.optional(S.String),
  DatasetStats: S.optional(DatasetStats),
}) {}
export class ProjectDescription extends S.Class<ProjectDescription>(
  "ProjectDescription",
)({
  ProjectArn: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Status: S.optional(S.String),
  Datasets: S.optional(DatasetMetadataList),
  Feature: S.optional(S.String),
  AutoUpdate: S.optional(S.String),
}) {}
export const ProjectDescriptions = S.Array(ProjectDescription);
export class CustomLabel extends S.Class<CustomLabel>("CustomLabel")({
  Name: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Geometry: S.optional(Geometry),
}) {}
export const CustomLabels = S.Array(CustomLabel);
export const FaceDetailList = S.Array(FaceDetail);
export class DominantColor extends S.Class<DominantColor>("DominantColor")({
  Red: S.optional(S.Number),
  Blue: S.optional(S.Number),
  Green: S.optional(S.Number),
  HexCode: S.optional(S.String),
  CSSColor: S.optional(S.String),
  SimplifiedColor: S.optional(S.String),
  PixelPercent: S.optional(S.Number),
}) {}
export const DominantColors = S.Array(DominantColor);
export class Instance extends S.Class<Instance>("Instance")({
  BoundingBox: S.optional(BoundingBox),
  Confidence: S.optional(S.Number),
  DominantColors: S.optional(DominantColors),
}) {}
export const Instances = S.Array(Instance);
export class Parent extends S.Class<Parent>("Parent")({
  Name: S.optional(S.String),
}) {}
export const Parents = S.Array(Parent);
export class LabelAlias extends S.Class<LabelAlias>("LabelAlias")({
  Name: S.optional(S.String),
}) {}
export const LabelAliases = S.Array(LabelAlias);
export class LabelCategory extends S.Class<LabelCategory>("LabelCategory")({
  Name: S.optional(S.String),
}) {}
export const LabelCategories = S.Array(LabelCategory);
export class Label extends S.Class<Label>("Label")({
  Name: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Instances: S.optional(Instances),
  Parents: S.optional(Parents),
  Aliases: S.optional(LabelAliases),
  Categories: S.optional(LabelCategories),
}) {}
export const Labels = S.Array(Label);
export const ModerationLabels = S.Array(ModerationLabel);
export class ProtectiveEquipmentSummary extends S.Class<ProtectiveEquipmentSummary>(
  "ProtectiveEquipmentSummary",
)({
  PersonsWithRequiredEquipment: S.optional(ProtectiveEquipmentPersonIds),
  PersonsWithoutRequiredEquipment: S.optional(ProtectiveEquipmentPersonIds),
  PersonsIndeterminate: S.optional(ProtectiveEquipmentPersonIds),
}) {}
export const TextDetectionList = S.Array(TextDetection);
export class CelebrityRecognition extends S.Class<CelebrityRecognition>(
  "CelebrityRecognition",
)({
  Timestamp: S.optional(S.Number),
  Celebrity: S.optional(CelebrityDetail),
}) {}
export const CelebrityRecognitions = S.Array(CelebrityRecognition);
export class ContentModerationDetection extends S.Class<ContentModerationDetection>(
  "ContentModerationDetection",
)({
  Timestamp: S.optional(S.Number),
  ModerationLabel: S.optional(ModerationLabel),
  StartTimestampMillis: S.optional(S.Number),
  EndTimestampMillis: S.optional(S.Number),
  DurationMillis: S.optional(S.Number),
  ContentTypes: S.optional(ContentTypes),
}) {}
export const ContentModerationDetections = S.Array(ContentModerationDetection);
export class PersonMatch extends S.Class<PersonMatch>("PersonMatch")({
  Timestamp: S.optional(S.Number),
  Person: S.optional(PersonDetail),
  FaceMatches: S.optional(FaceMatchList),
}) {}
export const PersonMatches = S.Array(PersonMatch);
export class SegmentDetection extends S.Class<SegmentDetection>(
  "SegmentDetection",
)({
  Type: S.optional(S.String),
  StartTimestampMillis: S.optional(S.Number),
  EndTimestampMillis: S.optional(S.Number),
  DurationMillis: S.optional(S.Number),
  StartTimecodeSMPTE: S.optional(S.String),
  EndTimecodeSMPTE: S.optional(S.String),
  DurationSMPTE: S.optional(S.String),
  TechnicalCueSegment: S.optional(TechnicalCueSegment),
  ShotSegment: S.optional(ShotSegment),
  StartFrameNumber: S.optional(S.Number),
  EndFrameNumber: S.optional(S.Number),
  DurationFrames: S.optional(S.Number),
}) {}
export const SegmentDetections = S.Array(SegmentDetection);
export class TextDetectionResult extends S.Class<TextDetectionResult>(
  "TextDetectionResult",
)({
  Timestamp: S.optional(S.Number),
  TextDetection: S.optional(TextDetection),
}) {}
export const TextDetectionResults = S.Array(TextDetectionResult);
export class DatasetLabelDescription extends S.Class<DatasetLabelDescription>(
  "DatasetLabelDescription",
)({
  LabelName: S.optional(S.String),
  LabelStats: S.optional(DatasetLabelStats),
}) {}
export const DatasetLabelDescriptions = S.Array(DatasetLabelDescription);
export class StartSegmentDetectionFilters extends S.Class<StartSegmentDetectionFilters>(
  "StartSegmentDetectionFilters",
)({
  TechnicalCueFilter: S.optional(StartTechnicalCueDetectionFilter),
  ShotFilter: S.optional(StartShotDetectionFilter),
}) {}
export class Summary extends S.Class<Summary>("Summary")({
  S3Object: S.optional(S3Object),
}) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ DatasetArn: S.optional(S.String) }) {}
export class CreateFaceLivenessSessionRequest extends S.Class<CreateFaceLivenessSessionRequest>(
  "CreateFaceLivenessSessionRequest",
)(
  {
    KmsKeyId: S.optional(S.String),
    Settings: S.optional(CreateFaceLivenessSessionRequestSettings),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProjectVersionResponse extends S.Class<CreateProjectVersionResponse>(
  "CreateProjectVersionResponse",
)({ ProjectVersionArn: S.optional(S.String) }) {}
export class CreateStreamProcessorResponse extends S.Class<CreateStreamProcessorResponse>(
  "CreateStreamProcessorResponse",
)({ StreamProcessorArn: S.optional(S.String) }) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({ DatasetDescription: S.optional(DatasetDescription) }) {}
export class DescribeProjectsResponse extends S.Class<DescribeProjectsResponse>(
  "DescribeProjectsResponse",
)({
  ProjectDescriptions: S.optional(ProjectDescriptions),
  NextToken: S.optional(S.String),
}) {}
export class DetectCustomLabelsResponse extends S.Class<DetectCustomLabelsResponse>(
  "DetectCustomLabelsResponse",
)({ CustomLabels: S.optional(CustomLabels) }) {}
export class DetectFacesResponse extends S.Class<DetectFacesResponse>(
  "DetectFacesResponse",
)({
  FaceDetails: S.optional(FaceDetailList),
  OrientationCorrection: S.optional(S.String),
}) {}
export class DetectTextResponse extends S.Class<DetectTextResponse>(
  "DetectTextResponse",
)({
  TextDetections: S.optional(TextDetectionList),
  TextModelVersion: S.optional(S.String),
}) {}
export class GetCelebrityRecognitionResponse extends S.Class<GetCelebrityRecognitionResponse>(
  "GetCelebrityRecognitionResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  NextToken: S.optional(S.String),
  Celebrities: S.optional(CelebrityRecognitions),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class GetContentModerationResponse extends S.Class<GetContentModerationResponse>(
  "GetContentModerationResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  ModerationLabels: S.optional(ContentModerationDetections),
  NextToken: S.optional(S.String),
  ModerationModelVersion: S.optional(S.String),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
  GetRequestMetadata: S.optional(GetContentModerationRequestMetadata),
}) {}
export class GetFaceSearchResponse extends S.Class<GetFaceSearchResponse>(
  "GetFaceSearchResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  NextToken: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  Persons: S.optional(PersonMatches),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class GetMediaAnalysisJobResponse extends S.Class<GetMediaAnalysisJobResponse>(
  "GetMediaAnalysisJobResponse",
)({
  JobId: S.String,
  JobName: S.optional(S.String),
  OperationsConfig: MediaAnalysisOperationsConfig,
  Status: S.String,
  FailureDetails: S.optional(MediaAnalysisJobFailureDetails),
  CreationTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CompletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Input: MediaAnalysisInput,
  OutputConfig: MediaAnalysisOutputConfig,
  KmsKeyId: S.optional(S.String),
  Results: S.optional(MediaAnalysisResults),
  ManifestSummary: S.optional(MediaAnalysisManifestSummary),
}) {}
export class GetSegmentDetectionResponse extends S.Class<GetSegmentDetectionResponse>(
  "GetSegmentDetectionResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadataList),
  AudioMetadata: S.optional(AudioMetadataList),
  NextToken: S.optional(S.String),
  Segments: S.optional(SegmentDetections),
  SelectedSegmentTypes: S.optional(SegmentTypesInfo),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class GetTextDetectionResponse extends S.Class<GetTextDetectionResponse>(
  "GetTextDetectionResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  TextDetections: S.optional(TextDetectionResults),
  NextToken: S.optional(S.String),
  TextModelVersion: S.optional(S.String),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
}) {}
export class ListDatasetLabelsResponse extends S.Class<ListDatasetLabelsResponse>(
  "ListDatasetLabelsResponse",
)({
  DatasetLabelDescriptions: S.optional(DatasetLabelDescriptions),
  NextToken: S.optional(S.String),
}) {}
export class SearchUsersResponse extends S.Class<SearchUsersResponse>(
  "SearchUsersResponse",
)({
  UserMatches: S.optional(UserMatchList),
  FaceModelVersion: S.optional(S.String),
  SearchedFace: S.optional(SearchedFace),
  SearchedUser: S.optional(SearchedUser),
}) {}
export class StartMediaAnalysisJobResponse extends S.Class<StartMediaAnalysisJobResponse>(
  "StartMediaAnalysisJobResponse",
)({ JobId: S.String }) {}
export class StartSegmentDetectionRequest extends S.Class<StartSegmentDetectionRequest>(
  "StartSegmentDetectionRequest",
)(
  {
    Video: Video,
    ClientRequestToken: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    JobTag: S.optional(S.String),
    Filters: S.optional(StartSegmentDetectionFilters),
    SegmentTypes: SegmentTypes,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartStreamProcessorResponse extends S.Class<StartStreamProcessorResponse>(
  "StartStreamProcessorResponse",
)({ SessionId: S.optional(S.String) }) {}
export class TrainingDataResult extends S.Class<TrainingDataResult>(
  "TrainingDataResult",
)({
  Input: S.optional(TrainingData),
  Output: S.optional(TrainingData),
  Validation: S.optional(ValidationData),
}) {}
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({ F1Score: S.optional(S.Number), Summary: S.optional(Summary) }) {}
export const HumanLoopActivationReasons = S.Array(S.String);
export class ComparedSourceImageFace extends S.Class<ComparedSourceImageFace>(
  "ComparedSourceImageFace",
)({ BoundingBox: S.optional(BoundingBox), Confidence: S.optional(S.Number) }) {}
export class CompareFacesMatch extends S.Class<CompareFacesMatch>(
  "CompareFacesMatch",
)({ Similarity: S.optional(S.Number), Face: S.optional(ComparedFace) }) {}
export const CompareFacesMatchList = S.Array(CompareFacesMatch);
export class ProjectVersionDescription extends S.Class<ProjectVersionDescription>(
  "ProjectVersionDescription",
)({
  ProjectVersionArn: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  MinInferenceUnits: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  BillableTrainingTimeInSeconds: S.optional(S.Number),
  TrainingEndTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OutputConfig: S.optional(OutputConfig),
  TrainingDataResult: S.optional(TrainingDataResult),
  TestingDataResult: S.optional(TestingDataResult),
  EvaluationResult: S.optional(EvaluationResult),
  ManifestSummary: S.optional(GroundTruthManifest),
  KmsKeyId: S.optional(S.String),
  MaxInferenceUnits: S.optional(S.Number),
  SourceProjectVersionArn: S.optional(S.String),
  VersionDescription: S.optional(S.String),
  Feature: S.optional(S.String),
  BaseModelVersion: S.optional(S.String),
  FeatureConfig: S.optional(CustomizationFeatureConfig),
}) {}
export const ProjectVersionDescriptions = S.Array(ProjectVersionDescription);
export class HumanLoopActivationOutput extends S.Class<HumanLoopActivationOutput>(
  "HumanLoopActivationOutput",
)({
  HumanLoopArn: S.optional(S.String),
  HumanLoopActivationReasons: S.optional(HumanLoopActivationReasons),
  HumanLoopActivationConditionsEvaluationResults: S.optional(S.String),
}) {}
export class CompareFacesResponse extends S.Class<CompareFacesResponse>(
  "CompareFacesResponse",
)({
  SourceImageFace: S.optional(ComparedSourceImageFace),
  FaceMatches: S.optional(CompareFacesMatchList),
  UnmatchedFaces: S.optional(CompareFacesUnmatchList),
  SourceImageOrientationCorrection: S.optional(S.String),
  TargetImageOrientationCorrection: S.optional(S.String),
}) {}
export class CreateFaceLivenessSessionResponse extends S.Class<CreateFaceLivenessSessionResponse>(
  "CreateFaceLivenessSessionResponse",
)({ SessionId: S.String }) {}
export class DescribeProjectVersionsResponse extends S.Class<DescribeProjectVersionsResponse>(
  "DescribeProjectVersionsResponse",
)({
  ProjectVersionDescriptions: S.optional(ProjectVersionDescriptions),
  NextToken: S.optional(S.String),
}) {}
export class DetectModerationLabelsResponse extends S.Class<DetectModerationLabelsResponse>(
  "DetectModerationLabelsResponse",
)({
  ModerationLabels: S.optional(ModerationLabels),
  ModerationModelVersion: S.optional(S.String),
  HumanLoopActivationOutput: S.optional(HumanLoopActivationOutput),
  ProjectVersion: S.optional(S.String),
  ContentTypes: S.optional(ContentTypes),
}) {}
export class StartSegmentDetectionResponse extends S.Class<StartSegmentDetectionResponse>(
  "StartSegmentDetectionResponse",
)({ JobId: S.optional(S.String) }) {}
export class DetectLabelsImageQuality extends S.Class<DetectLabelsImageQuality>(
  "DetectLabelsImageQuality",
)({
  Brightness: S.optional(S.Number),
  Sharpness: S.optional(S.Number),
  Contrast: S.optional(S.Number),
}) {}
export class DetectLabelsImageForeground extends S.Class<DetectLabelsImageForeground>(
  "DetectLabelsImageForeground",
)({
  Quality: S.optional(DetectLabelsImageQuality),
  DominantColors: S.optional(DominantColors),
}) {}
export class DetectLabelsImageBackground extends S.Class<DetectLabelsImageBackground>(
  "DetectLabelsImageBackground",
)({
  Quality: S.optional(DetectLabelsImageQuality),
  DominantColors: S.optional(DominantColors),
}) {}
export class CoversBodyPart extends S.Class<CoversBodyPart>("CoversBodyPart")({
  Confidence: S.optional(S.Number),
  Value: S.optional(S.Boolean),
}) {}
export class DetectLabelsImageProperties extends S.Class<DetectLabelsImageProperties>(
  "DetectLabelsImageProperties",
)({
  Quality: S.optional(DetectLabelsImageQuality),
  DominantColors: S.optional(DominantColors),
  Foreground: S.optional(DetectLabelsImageForeground),
  Background: S.optional(DetectLabelsImageBackground),
}) {}
export class LabelDetection extends S.Class<LabelDetection>("LabelDetection")({
  Timestamp: S.optional(S.Number),
  Label: S.optional(Label),
  StartTimestampMillis: S.optional(S.Number),
  EndTimestampMillis: S.optional(S.Number),
  DurationMillis: S.optional(S.Number),
}) {}
export const LabelDetections = S.Array(LabelDetection);
export class EquipmentDetection extends S.Class<EquipmentDetection>(
  "EquipmentDetection",
)({
  BoundingBox: S.optional(BoundingBox),
  Confidence: S.optional(S.Number),
  Type: S.optional(S.String),
  CoversBodyPart: S.optional(CoversBodyPart),
}) {}
export const EquipmentDetections = S.Array(EquipmentDetection);
export class DetectLabelsResponse extends S.Class<DetectLabelsResponse>(
  "DetectLabelsResponse",
)({
  Labels: S.optional(Labels),
  OrientationCorrection: S.optional(S.String),
  LabelModelVersion: S.optional(S.String),
  ImageProperties: S.optional(DetectLabelsImageProperties),
}) {}
export class GetLabelDetectionResponse extends S.Class<GetLabelDetectionResponse>(
  "GetLabelDetectionResponse",
)({
  JobStatus: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  VideoMetadata: S.optional(VideoMetadata),
  NextToken: S.optional(S.String),
  Labels: S.optional(LabelDetections),
  LabelModelVersion: S.optional(S.String),
  JobId: S.optional(S.String),
  Video: S.optional(Video),
  JobTag: S.optional(S.String),
  GetRequestMetadata: S.optional(GetLabelDetectionRequestMetadata),
}) {}
export class ProtectiveEquipmentBodyPart extends S.Class<ProtectiveEquipmentBodyPart>(
  "ProtectiveEquipmentBodyPart",
)({
  Name: S.optional(S.String),
  Confidence: S.optional(S.Number),
  EquipmentDetections: S.optional(EquipmentDetections),
}) {}
export const BodyParts = S.Array(ProtectiveEquipmentBodyPart);
export class ProtectiveEquipmentPerson extends S.Class<ProtectiveEquipmentPerson>(
  "ProtectiveEquipmentPerson",
)({
  BodyParts: S.optional(BodyParts),
  BoundingBox: S.optional(BoundingBox),
  Confidence: S.optional(S.Number),
  Id: S.optional(S.Number),
}) {}
export const ProtectiveEquipmentPersons = S.Array(ProtectiveEquipmentPerson);
export class DetectProtectiveEquipmentResponse extends S.Class<DetectProtectiveEquipmentResponse>(
  "DetectProtectiveEquipmentResponse",
)({
  ProtectiveEquipmentModelVersion: S.optional(S.String),
  Persons: S.optional(ProtectiveEquipmentPersons),
  Summary: S.optional(ProtectiveEquipmentSummary),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ImageTooLargeException extends S.TaggedError<ImageTooLargeException>()(
  "ImageTooLargeException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidImageFormatException extends S.TaggedError<InvalidImageFormatException>()(
  "InvalidImageFormatException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ProvisionedThroughputExceededException extends S.TaggedError<ProvisionedThroughputExceededException>()(
  "ProvisionedThroughputExceededException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidS3ObjectException extends S.TaggedError<InvalidS3ObjectException>()(
  "InvalidS3ObjectException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidManifestException extends S.TaggedError<InvalidManifestException>()(
  "InvalidManifestException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class InvalidPolicyRevisionIdException extends S.TaggedError<InvalidPolicyRevisionIdException>()(
  "InvalidPolicyRevisionIdException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class HumanLoopQuotaExceededException extends S.TaggedError<HumanLoopQuotaExceededException>()(
  "HumanLoopQuotaExceededException",
  {
    ResourceType: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class SessionNotFoundException extends S.TaggedError<SessionNotFoundException>()(
  "SessionNotFoundException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}
export class VideoTooLargeException extends S.TaggedError<VideoTooLargeException>()(
  "VideoTooLargeException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    Logref: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Returns a list of media analysis jobs. Results are sorted by `CreationTimestamp` in descending order.
 */
export const listMediaAnalysisJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMediaAnalysisJobsRequest,
    output: ListMediaAnalysisJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists and describes the versions of an Amazon Rekognition project. You can specify up to 10 model or
 * adapter versions in `ProjectVersionArns`. If you don't specify a value,
 * descriptions for all model/adapter versions in the project are returned.
 *
 * This operation requires permissions to perform the `rekognition:DescribeProjectVersions`
 * action.
 */
export const describeProjectVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeProjectVersionsRequest,
    output: DescribeProjectVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProjectVersionDescriptions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * For a given input image, first detects the largest face in the image, and then searches
 * the specified collection for matching faces. The operation compares the features of the input
 * face with faces in the specified collection.
 *
 * To search for all faces in an input image, you might first call the IndexFaces operation, and then use the face IDs returned in subsequent calls
 * to the SearchFaces operation.
 *
 * You can also call the `DetectFaces` operation and use the bounding boxes
 * in the response to make face crops, which then you can pass in to the
 * `SearchFacesByImage` operation.
 *
 * You pass the input image either as base64-encoded image bytes or as a reference to an
 * image in an Amazon S3 bucket. If you use the
 * AWS
 * CLI to call Amazon Rekognition operations, passing image bytes is not
 * supported. The image must be either a PNG or JPEG formatted file.
 *
 * The response returns an array of faces that match, ordered by similarity score with
 * the highest similarity first. More specifically, it is an array of metadata for each face
 * match found. Along with the metadata, the response also includes a `similarity`
 * indicating how similar the face is to the input face. In the response, the operation also
 * returns the bounding box (and a confidence level that the bounding box contains a face) of the
 * face that Amazon Rekognition used for the input image.
 *
 * If no faces are detected in the input image, `SearchFacesByImage` returns an
 * `InvalidParameterException` error.
 *
 * For an example, Searching for a Face Using an Image in the Amazon Rekognition
 * Developer Guide.
 *
 * The `QualityFilter` input parameter allows you to filter out detected faces
 * that don’t meet a required quality bar. The quality bar is based on a variety of common use
 * cases. Use `QualityFilter` to set the quality bar for filtering by specifying
 * `LOW`, `MEDIUM`, or `HIGH`. If you do not want to filter
 * detected faces, specify `NONE`. The default value is `NONE`.
 *
 * To use quality filtering, you need a collection associated with version 3 of the face
 * model or higher. To get the version of the face model associated with a collection, call
 * DescribeCollection.
 *
 * This operation requires permissions to perform the
 * `rekognition:SearchFacesByImage` action.
 */
export const searchFacesByImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchFacesByImageRequest,
  output: SearchFacesByImageResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Describes an Amazon Rekognition Custom Labels dataset. You can get information such as the current status of a dataset and
 * statistics about the images and labels in a dataset.
 *
 * This operation requires permissions to perform the `rekognition:DescribeDataset` action.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets face detection results for a Amazon Rekognition Video analysis started by StartFaceDetection.
 *
 * Face detection with Amazon Rekognition Video is an asynchronous operation. You start face detection by calling StartFaceDetection
 * which returns a job identifier (`JobId`). When the face detection operation finishes, Amazon Rekognition Video publishes a completion status to
 * the Amazon Simple Notification Service topic registered in the initial call to `StartFaceDetection`. To get the results
 * of the face detection operation, first check that the status value published to the Amazon SNS topic is `SUCCEEDED`.
 * If so, call GetFaceDetection and pass the job identifier
 * (`JobId`) from the initial call to `StartFaceDetection`.
 *
 * `GetFaceDetection` returns an array of detected faces (`Faces`) sorted by the time the faces were detected.
 *
 * Use MaxResults parameter to limit the number of labels returned. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains a pagination token for getting the next set
 * of results. To get the next page of results, call `GetFaceDetection` and populate the `NextToken` request parameter with the token
 * value returned from the previous call to `GetFaceDetection`.
 *
 * Note that for the `GetFaceDetection` operation, the returned values for
 * `FaceOccluded` and `EyeDirection` will always be "null".
 */
export const getFaceDetection = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetFaceDetectionRequest,
    output: GetFaceDetectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets the face search results for Amazon Rekognition Video face search started by
 * StartFaceSearch. The search returns faces in a collection that match the faces
 * of persons detected in a video. It also includes the time(s) that faces are matched in the video.
 *
 * Face search in a video is an asynchronous operation. You start face search by calling
 * to StartFaceSearch which returns a job identifier (`JobId`).
 * When the search operation finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service
 * topic registered in the initial call to `StartFaceSearch`.
 * To get the search results, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call `GetFaceSearch` and pass the job identifier
 * (`JobId`) from the initial call to `StartFaceSearch`.
 *
 * For more information, see Searching Faces in a Collection in the
 * Amazon Rekognition Developer Guide.
 *
 * The search results are retured in an array, `Persons`, of
 * PersonMatch objects. Each`PersonMatch` element contains
 * details about the matching faces in the input collection, person information (facial attributes,
 * bounding boxes, and person identifer)
 * for the matched person, and the time the person was matched in the video.
 *
 * `GetFaceSearch` only returns the default
 * facial attributes (`BoundingBox`, `Confidence`,
 * `Landmarks`, `Pose`, and `Quality`). The other facial attributes listed
 * in the `Face` object of the following response syntax are not returned. For more information,
 * see FaceDetail in the Amazon Rekognition Developer Guide.
 *
 * By default, the `Persons` array is sorted by the time, in milliseconds from the
 * start of the video, persons are matched.
 * You can also sort by persons by specifying `INDEX` for the `SORTBY` input
 * parameter.
 */
export const getFaceSearch = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetFaceSearchRequest,
    output: GetFaceSearchResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves the results for a given media analysis job.
 * Takes a `JobId` returned by StartMediaAnalysisJob.
 */
export const getMediaAnalysisJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMediaAnalysisJobRequest,
  output: GetMediaAnalysisJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the segment detection results of a Amazon Rekognition Video analysis started by StartSegmentDetection.
 *
 * Segment detection with Amazon Rekognition Video is an asynchronous operation. You start segment detection by
 * calling StartSegmentDetection which returns a job identifier (`JobId`).
 * When the segment detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service
 * topic registered in the initial call to `StartSegmentDetection`. To get the results
 * of the segment detection operation, first check that the status value published to the Amazon SNS topic is `SUCCEEDED`.
 * if so, call `GetSegmentDetection` and pass the job identifier (`JobId`) from the initial call
 * of `StartSegmentDetection`.
 *
 * `GetSegmentDetection` returns detected segments in an array (`Segments`)
 * of SegmentDetection objects. `Segments` is sorted by the segment types
 * specified in the `SegmentTypes` input parameter of `StartSegmentDetection`.
 * Each element of the array includes the detected segment, the precentage confidence in the acuracy
 * of the detected segment, the type of the segment, and the frame in which the segment was detected.
 *
 * Use `SelectedSegmentTypes` to find out the type of segment detection requested in the
 * call to `StartSegmentDetection`.
 *
 * Use the `MaxResults` parameter to limit the number of segment detections returned. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains
 * a pagination token for getting the next set of results. To get the next page of results, call `GetSegmentDetection`
 * and populate the `NextToken` request parameter with the token value returned from the previous
 * call to `GetSegmentDetection`.
 *
 * For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
 */
export const getSegmentDetection =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetSegmentDetectionRequest,
    output: GetSegmentDetectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the text detection results of a Amazon Rekognition Video analysis started by StartTextDetection.
 *
 * Text detection with Amazon Rekognition Video is an asynchronous operation. You start text detection by
 * calling StartTextDetection which returns a job identifier (`JobId`)
 * When the text detection operation finishes, Amazon Rekognition publishes a completion status to the Amazon Simple Notification Service
 * topic registered in the initial call to `StartTextDetection`. To get the results
 * of the text detection operation, first check that the status value published to the Amazon SNS topic is `SUCCEEDED`.
 * if so, call `GetTextDetection` and pass the job identifier (`JobId`) from the initial call
 * of `StartLabelDetection`.
 *
 * `GetTextDetection` returns an array of detected text (`TextDetections`) sorted by
 * the time the text was detected, up to 100 words per frame of video.
 *
 * Each element of the array includes the detected text, the precentage confidence in the acuracy
 * of the detected text, the time the text was detected, bounding box information for where the text
 * was located, and unique identifiers for words and their lines.
 *
 * Use MaxResults parameter to limit the number of text detections returned. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains
 * a pagination token for getting the next set of results. To get the next page of results, call `GetTextDetection`
 * and populate the `NextToken` request parameter with the token value returned from the previous
 * call to `GetTextDetection`.
 */
export const getTextDetection = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetTextDetectionRequest,
    output: GetTextDetectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches for UserIDs within a collection based on a `FaceId` or
 * `UserId`. This API can be used to find the closest UserID (with a highest
 * similarity) to associate a face. The request must be provided with either `FaceId`
 * or `UserId`. The operation returns an array of UserID that match the
 * `FaceId` or `UserId`, ordered by similarity score with the highest
 * similarity first.
 */
export const searchUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchUsersRequest,
  output: SearchUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes faces from a collection. You specify a collection ID and an array of face IDs
 * to remove from the collection.
 *
 * This operation requires permissions to perform the `rekognition:DeleteFaces`
 * action.
 */
export const deleteFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFacesRequest,
  output: DeleteFacesResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets the name and additional information about a celebrity based on their Amazon Rekognition ID.
 * The additional information is returned as an array of URLs. If there is no additional
 * information about the celebrity, this list is empty.
 *
 * For more information, see Getting information about a celebrity in the
 * Amazon Rekognition Developer Guide.
 *
 * This operation requires permissions to perform the
 * `rekognition:GetCelebrityInfo` action.
 */
export const getCelebrityInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCelebrityInfoRequest,
  output: GetCelebrityInfoResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * For a given input face ID, searches for matching faces in the collection the face
 * belongs to. You get a face ID when you add a face to the collection using the IndexFaces operation. The operation compares the features of the input face with
 * faces in the specified collection.
 *
 * You can also search faces without indexing faces by using the
 * `SearchFacesByImage` operation.
 *
 * The operation response returns an array of faces that match, ordered by similarity
 * score with the highest similarity first. More specifically, it is an array of metadata for
 * each face match that is found. Along with the metadata, the response also includes a
 * `confidence` value for each face match, indicating the confidence that the
 * specific face matches the input face.
 *
 * For an example, see Searching for a face using its face ID in the Amazon Rekognition
 * Developer Guide.
 *
 * This operation requires permissions to perform the `rekognition:SearchFaces`
 * action.
 */
export const searchFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchFacesRequest,
  output: SearchFacesResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified UserID within the collection. Faces that are associated with the
 * UserID are disassociated from the UserID before deleting the specified UserID. If the
 * specified `Collection` or `UserID` is already deleted or not found, a
 * `ResourceNotFoundException` will be thrown. If the action is successful with a
 * 200 response, an empty HTTP body is returned.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the specified collection. You can use `DescribeCollection` to get
 * information, such as the number of faces indexed into a collection and the version of the
 * model used by the collection for face detection.
 *
 * For more information, see Describing a Collection in the
 * Amazon Rekognition Developer Guide.
 */
export const describeCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCollectionRequest,
  output: DescribeCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Provides information about a stream processor created by CreateStreamProcessor. You can get information about the input and output streams, the input parameters for the face recognition being performed,
 * and the current status of the stream processor.
 */
export const describeStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStreamProcessorRequest,
    output: DescribeStreamProcessorResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns a list of tags in an Amazon Rekognition collection, stream processor, or Custom Labels
 * model.
 *
 * This operation requires permissions to perform the
 * `rekognition:ListTagsForResource` action.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes one or more tags from an Amazon Rekognition collection, stream processor, or Custom Labels
 * model.
 *
 * This operation requires permissions to perform the
 * `rekognition:UntagResource` action.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes the association between a `Face` supplied in an array of
 * `FaceIds` and the User. If the User is not present already, then a
 * `ResourceNotFound` exception is thrown. If successful, an array of faces that are
 * disassociated from the User is returned. If a given face is already disassociated from the
 * given UserID, it will be ignored and not be returned in the response. If a given face is
 * already associated with a different User or not found in the collection it will be returned as
 * part of `UnsuccessfulDisassociations`. You can remove 1 - 100 face IDs from a user
 * at one time.
 */
export const disassociateFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFacesRequest,
  output: DisassociateFacesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * *End of support notice:* On October 31, 2025, AWS will discontinue
 * support for Amazon Rekognition People Pathing. After October 31, 2025, you will no
 * longer be able to use the Rekognition People Pathing capability. For more information,
 * visit this blog post.
 *
 * Gets the path tracking results of a Amazon Rekognition Video analysis started by StartPersonTracking.
 *
 * The person path tracking operation is started by a call to `StartPersonTracking`
 * which returns a job identifier (`JobId`). When the operation finishes, Amazon Rekognition Video publishes a completion status to
 * the Amazon Simple Notification Service topic registered in the initial call to `StartPersonTracking`.
 *
 * To get the results of the person path tracking operation, first check
 * that the status value published to the Amazon SNS topic is `SUCCEEDED`.
 * If so, call GetPersonTracking and pass the job identifier
 * (`JobId`) from the initial call to `StartPersonTracking`.
 *
 * `GetPersonTracking` returns an array, `Persons`, of tracked persons and the time(s) their
 * paths were tracked in the video.
 *
 * `GetPersonTracking` only returns the default
 * facial attributes (`BoundingBox`, `Confidence`,
 * `Landmarks`, `Pose`, and `Quality`). The other facial attributes listed
 * in the `Face` object of the following response syntax are not returned.
 *
 * For more information, see FaceDetail in the Amazon Rekognition Developer Guide.
 *
 * By default, the array is sorted by the time(s) a person's path is tracked in the video.
 * You can sort by tracked persons by specifying `INDEX` for the `SortBy` input parameter.
 *
 * Use the `MaxResults` parameter to limit the number of items returned. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains a pagination token for getting the next set
 * of results. To get the next page of results, call `GetPersonTracking` and populate the `NextToken` request parameter with the token
 * value returned from the previous call to `GetPersonTracking`.
 */
export const getPersonTracking = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetPersonTrackingRequest,
    output: GetPersonTrackingResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns metadata for faces in the specified collection. This metadata
 * includes information such as the bounding box coordinates, the confidence (that the bounding
 * box contains a face), and face ID. For an example, see Listing Faces in a Collection in the
 * Amazon Rekognition Developer Guide.
 *
 * This operation requires permissions to perform the `rekognition:ListFaces`
 * action.
 */
export const listFaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFacesRequest,
  output: ListFacesResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidPaginationTokenException,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Faces",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Gets a list of the project policies attached to a project.
 *
 * To attach a project policy to a project, call PutProjectPolicy. To remove a project policy from a project, call DeleteProjectPolicy.
 *
 * This operation requires permissions to perform the `rekognition:ListProjectPolicies` action.
 */
export const listProjectPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProjectPoliciesRequest,
    output: ListProjectPoliciesResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProjectPolicies",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns metadata of the User such as `UserID` in the specified collection.
 * Anonymous User (to reserve faces without any identity) is not returned as part of this
 * request. The results are sorted by system generated primary key ID. If the response is
 * truncated, `NextToken` is returned in the response that can be used in the
 * subsequent request to retrieve the next set of identities.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidPaginationTokenException,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns list of collection IDs in your account. If the result is truncated, the
 * response also provides a `NextToken` that you can use in the subsequent request to
 * fetch the next set of collection IDs.
 *
 * For an example, see Listing collections in the Amazon Rekognition Developer
 * Guide.
 *
 * This operation requires permissions to perform the
 * `rekognition:ListCollections` action.
 */
export const listCollections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCollectionsRequest,
    output: ListCollectionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CollectionIds",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets the celebrity recognition results for a Amazon Rekognition Video analysis started by
 * StartCelebrityRecognition.
 *
 * Celebrity recognition in a video is an asynchronous operation. Analysis is started by a
 * call to StartCelebrityRecognition which returns a job identifier
 * (`JobId`).
 *
 * When the celebrity recognition operation finishes, Amazon Rekognition Video publishes a completion
 * status to the Amazon Simple Notification Service topic registered in the initial call to
 * `StartCelebrityRecognition`. To get the results of the celebrity recognition
 * analysis, first check that the status value published to the Amazon SNS topic is
 * `SUCCEEDED`. If so, call `GetCelebrityDetection` and pass the job
 * identifier (`JobId`) from the initial call to `StartCelebrityDetection`.
 *
 * For more information, see Working With Stored Videos in the Amazon Rekognition Developer Guide.
 *
 * `GetCelebrityRecognition` returns detected celebrities and the time(s) they
 * are detected in an array (`Celebrities`) of CelebrityRecognition
 * objects. Each `CelebrityRecognition`
 * contains information about the celebrity in a CelebrityDetail object and the
 * time, `Timestamp`, the celebrity was detected. This CelebrityDetail object stores information about the detected celebrity's face
 * attributes, a face bounding box, known gender, the celebrity's name, and a confidence
 * estimate.
 *
 * `GetCelebrityRecognition` only returns the default facial
 * attributes (`BoundingBox`, `Confidence`, `Landmarks`,
 * `Pose`, and `Quality`). The `BoundingBox` field only
 * applies to the detected face instance. The other facial attributes listed in the
 * `Face` object of the following response syntax are not returned. For more
 * information, see FaceDetail in the Amazon Rekognition Developer Guide.
 *
 * By default, the `Celebrities` array is sorted by time (milliseconds from the start of the video).
 * You can also sort the array by celebrity by specifying the value `ID` in the `SortBy` input parameter.
 *
 * The `CelebrityDetail` object includes the celebrity identifer and additional information urls. If you don't store
 * the additional information urls, you can get them later by calling GetCelebrityInfo with the celebrity identifer.
 *
 * No information is returned for faces not recognized as celebrities.
 *
 * Use MaxResults parameter to limit the number of labels returned. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains a
 * pagination token for getting the next set of results. To get the next page of results, call `GetCelebrityDetection`
 * and populate the `NextToken` request parameter with the token
 * value returned from the previous call to `GetCelebrityRecognition`.
 */
export const getCelebrityRecognition =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetCelebrityRecognitionRequest,
    output: GetCelebrityRecognitionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets the inappropriate, unwanted, or offensive content analysis results for a Amazon Rekognition Video analysis started by
 * StartContentModeration. For a list of moderation labels in Amazon Rekognition, see
 * Using the image and video moderation APIs.
 *
 * Amazon Rekognition Video inappropriate or offensive content detection in a stored video is an asynchronous operation. You start analysis by calling
 * StartContentModeration which returns a job identifier (`JobId`).
 * When analysis finishes, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service
 * topic registered in the initial call to `StartContentModeration`.
 * To get the results of the content analysis, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call `GetContentModeration` and pass the job identifier
 * (`JobId`) from the initial call to `StartContentModeration`.
 *
 * For more information, see Working with Stored Videos in the
 * Amazon Rekognition Devlopers Guide.
 *
 * `GetContentModeration` returns detected inappropriate, unwanted, or offensive content moderation labels,
 * and the time they are detected, in an array, `ModerationLabels`, of
 * ContentModerationDetection objects.
 *
 * By default, the moderated labels are returned sorted by time, in milliseconds from the start of the
 * video. You can also sort them by moderated label by specifying `NAME` for the `SortBy`
 * input parameter.
 *
 * Since video analysis can return a large number of results, use the `MaxResults` parameter to limit
 * the number of labels returned in a single call to `GetContentModeration`. If there are more results than
 * specified in `MaxResults`, the value of `NextToken` in the operation response contains a
 * pagination token for getting the next set of results. To get the next page of results, call `GetContentModeration`
 * and populate the `NextToken` request parameter with the value of `NextToken`
 * returned from the previous call to `GetContentModeration`.
 *
 * For more information, see moderating content in the Amazon Rekognition Developer Guide.
 */
export const getContentModeration =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetContentModerationRequest,
    output: GetContentModerationResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Searches for UserIDs using a supplied image. It first detects the largest face in the
 * image, and then searches a specified collection for matching UserIDs.
 *
 * The operation returns an array of UserIDs that match the face in the supplied image,
 * ordered by similarity score with the highest similarity first. It also returns a bounding box
 * for the face found in the input image.
 *
 * Information about faces detected in the supplied image, but not used for the search, is
 * returned in an array of `UnsearchedFace` objects. If no valid face is detected in
 * the image, the response will contain an empty `UserMatches` list and no
 * `SearchedFace` object.
 */
export const searchUsersByImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchUsersByImageRequest,
  output: SearchUsersByImageResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Deletes an existing project policy.
 *
 * To get a list of project policies attached to a project, call ListProjectPolicies. To attach a project policy to a project, call PutProjectPolicy.
 *
 * This operation requires permissions to perform the `rekognition:DeleteProjectPolicy` action.
 */
export const deleteProjectPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectPolicyRequest,
  output: DeleteProjectPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    InvalidPolicyRevisionIdException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Starts processing a stream processor. You create a stream processor by calling CreateStreamProcessor.
 * To tell `StartStreamProcessor` which stream processor to start, use the value of the `Name` field specified in the call to
 * `CreateStreamProcessor`.
 *
 * If you are using a label detection stream processor to detect labels, you need to provide a `Start selector` and a `Stop selector` to determine the length of the stream processing time.
 */
export const startStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartStreamProcessorRequest,
    output: StartStreamProcessorResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Allows you to update a stream processor. You can change some settings and regions of interest and delete certain parameters.
 */
export const updateStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStreamProcessorRequest,
    output: UpdateStreamProcessorResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a Amazon Rekognition project. To delete a project you must first delete all models or
 * adapters associated with the project. To delete a model or adapter, see DeleteProjectVersion.
 *
 * `DeleteProject` is an asynchronous operation. To check if the project is
 * deleted, call DescribeProjects. The project is deleted when the project
 * no longer appears in the response. Be aware that deleting a given project will also delete
 * any `ProjectPolicies` associated with that project.
 *
 * This operation requires permissions to perform the
 * `rekognition:DeleteProject` action.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a Rekognition project model or project version, like a Amazon Rekognition Custom Labels model or a custom
 * adapter.
 *
 * You can't delete a project version if it is running or if it is training. To check
 * the status of a project version, use the Status field returned from DescribeProjectVersions. To stop a project version call StopProjectVersion. If the project version is training, wait until it
 * finishes.
 *
 * This operation requires permissions to perform the
 * `rekognition:DeleteProjectVersion` action.
 */
export const deleteProjectVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProjectVersionRequest,
    output: DeleteProjectVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Stops a running model. The operation might take a while to complete. To check the
 * current status, call DescribeProjectVersions. Only applies to Custom
 * Labels projects.
 *
 * This operation requires permissions to perform the `rekognition:StopProjectVersion` action.
 */
export const stopProjectVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopProjectVersionRequest,
  output: StopProjectVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the stream processor identified by `Name`. You assign the value for `Name` when you create the stream processor with
 * CreateStreamProcessor. You might not be able to use the same name for a stream processor for a few seconds after calling `DeleteStreamProcessor`.
 */
export const deleteStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStreamProcessorRequest,
    output: DeleteStreamProcessorResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Stops a running stream processor that was created by CreateStreamProcessor.
 */
export const stopStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopStreamProcessorRequest,
  output: StopStreamProcessorResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Adds or updates one or more entries (images) in a dataset. An entry is a JSON Line which contains the
 * information for a single image, including
 * the image location, assigned labels, and object location bounding boxes. For more information,
 * see Image-Level labels in manifest files and Object localization in manifest files in the *Amazon Rekognition Custom Labels Developer Guide*.
 *
 * If the `source-ref` field in the JSON line references an existing image, the existing image in the dataset
 * is updated.
 * If `source-ref` field doesn't reference an existing image, the image is added as a new image to the dataset.
 *
 * You specify the changes that you want to make in the `Changes` input parameter.
 * There isn't a limit to the number JSON Lines that you can change, but the size of `Changes` must be less
 * than 5MB.
 *
 * `UpdateDatasetEntries` returns immediatly, but the dataset update might take a while to complete.
 * Use DescribeDataset to check the
 * current status. The dataset updated successfully if the value of `Status` is
 * `UPDATE_COMPLETE`.
 *
 * To check if any non-terminal errors occured, call ListDatasetEntries
 * and check for the presence of `errors` lists in the JSON Lines.
 *
 * Dataset update fails if a terminal error occurs (`Status` = `UPDATE_FAILED`).
 * Currently, you can't access the terminal error information from the Amazon Rekognition Custom Labels SDK.
 *
 * This operation requires permissions to perform the `rekognition:UpdateDatasetEntries` action.
 */
export const updateDatasetEntries = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDatasetEntriesRequest,
    output: UpdateDatasetEntriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Deletes an existing Amazon Rekognition Custom Labels dataset.
 * Deleting a dataset might take while. Use DescribeDataset to check the
 * current status. The dataset is still deleting if the value of `Status` is
 * `DELETE_IN_PROGRESS`. If you try to access the dataset after it is deleted, you get
 * a `ResourceNotFoundException` exception.
 *
 * You can't delete a dataset while it is creating (`Status` = `CREATE_IN_PROGRESS`)
 * or if the dataset is updating (`Status` = `UPDATE_IN_PROGRESS`).
 *
 * This operation requires permissions to perform the `rekognition:DeleteDataset` action.
 */
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new Amazon Rekognition project. A project is a group of resources (datasets, model
 * versions) that you use to create and manage a Amazon Rekognition Custom Labels Model or custom adapter. You can
 * specify a feature to create the project with, if no feature is specified then Custom Labels
 * is used by default. For adapters, you can also choose whether or not to have the project
 * auto update by using the AutoUpdate argument. This operation requires permissions to
 * perform the `rekognition:CreateProject` action.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Creates a new Amazon Rekognition Custom Labels dataset. You can create a dataset by using
 * an Amazon Sagemaker format manifest file or by copying an existing Amazon Rekognition Custom Labels dataset.
 *
 * To create a training dataset for a project, specify `TRAIN` for the value of
 * `DatasetType`. To create the test dataset for a project,
 * specify `TEST` for the value of `DatasetType`.
 *
 * The response from `CreateDataset` is the Amazon Resource Name (ARN) for the dataset.
 * Creating a dataset takes a while to complete. Use DescribeDataset to check the
 * current status. The dataset created successfully if the value of `Status` is
 * `CREATE_COMPLETE`.
 *
 * To check if any non-terminal errors occurred, call ListDatasetEntries
 * and check for the presence of `errors` lists in the JSON Lines.
 *
 * Dataset creation fails if a terminal error occurs (`Status` = `CREATE_FAILED`).
 * Currently, you can't access the terminal error information.
 *
 * For more information, see Creating dataset in the *Amazon Rekognition Custom Labels Developer Guide*.
 *
 * This operation requires permissions to perform the `rekognition:CreateDataset` action.
 * If you want to copy an existing dataset, you also require permission to perform the `rekognition:ListDatasetEntries` action.
 */
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Gets a list of stream processors that you have created with CreateStreamProcessor.
 */
export const listStreamProcessors =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStreamProcessorsRequest,
    output: ListStreamProcessorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Gets information about your Rekognition projects.
 *
 * This operation requires permissions to perform the `rekognition:DescribeProjects` action.
 */
export const describeProjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeProjectsRequest,
    output: DescribeProjectsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ProjectDescriptions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This API operation initiates a Face Liveness session. It returns a `SessionId`,
 * which you can use to start streaming Face Liveness video and get the results for a Face
 * Liveness session.
 *
 * You can use the `OutputConfig` option in the Settings parameter to provide an
 * Amazon S3 bucket location. The Amazon S3 bucket stores reference images and audit images. If no Amazon S3
 * bucket is defined, raw bytes are sent instead.
 *
 * You can use `AuditImagesLimit` to limit the number of audit images returned
 * when `GetFaceLivenessSessionResults` is called. This number is between 0 and 4. By
 * default, it is set to 0. The limit is best effort and based on the duration of the
 * selfie-video.
 */
export const createFaceLivenessSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFaceLivenessSessionRequest,
    output: CreateFaceLivenessSessionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns an array of celebrities recognized in the input image. For more
 * information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.
 *
 * `RecognizeCelebrities` returns the 64 largest faces in the image. It lists
 * the recognized celebrities in the `CelebrityFaces` array and any unrecognized faces
 * in the `UnrecognizedFaces` array. `RecognizeCelebrities` doesn't return
 * celebrities whose faces aren't among the largest 64 faces in the image.
 *
 * For each celebrity recognized, `RecognizeCelebrities` returns a
 * `Celebrity` object. The `Celebrity` object contains the celebrity
 * name, ID, URL links to additional information, match confidence, and a
 * `ComparedFace` object that you can use to locate the celebrity's face on the
 * image.
 *
 * Amazon Rekognition doesn't retain information about which images a celebrity has been recognized
 * in. Your application must store this information and use the `Celebrity` ID
 * property as a unique identifier for the celebrity. If you don't store the celebrity name or
 * additional information URLs returned by `RecognizeCelebrities`, you will need the
 * ID to identify the celebrity in a call to the GetCelebrityInfo
 * operation.
 *
 * You pass the input image either as base64-encoded image bytes or as a reference to an
 * image in an Amazon S3 bucket. If you use the
 * AWS
 * CLI to call Amazon Rekognition operations, passing image bytes is not
 * supported. The image must be either a PNG or JPEG formatted file.
 *
 * For an example, see Recognizing celebrities in an image in the Amazon Rekognition
 * Developer Guide.
 *
 * This operation requires permissions to perform the
 * `rekognition:RecognizeCelebrities` operation.
 */
export const recognizeCelebrities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RecognizeCelebritiesRequest,
    output: RecognizeCelebritiesResponse,
    errors: [
      AccessDeniedException,
      ImageTooLargeException,
      InternalServerError,
      InvalidImageFormatException,
      InvalidParameterException,
      InvalidS3ObjectException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Detects faces within an image that is provided as input.
 *
 * `DetectFaces` detects the 100 largest faces in the image. For each face
 * detected, the operation returns face details. These details include a bounding box of the
 * face, a confidence value (that the bounding box contains a face), and a fixed set of
 * attributes such as facial landmarks (for example, coordinates of eye and mouth), pose,
 * presence of facial occlusion, and so on.
 *
 * The face-detection algorithm is most effective on frontal faces. For non-frontal or
 * obscured faces, the algorithm might not detect the faces or might detect faces with lower
 * confidence.
 *
 * You pass the input image either as base64-encoded image bytes or as a reference to an
 * image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations,
 * passing image bytes is not supported. The image must be either a PNG or JPEG formatted file.
 *
 * This is a stateless API operation. That is, the operation does not persist any
 * data.
 *
 * This operation requires permissions to perform the `rekognition:DetectFaces`
 * action.
 */
export const detectFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectFacesRequest,
  output: DetectFacesResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Detects text in the input image and converts it into machine-readable text.
 *
 * Pass the input image as base64-encoded image bytes or as a reference to an image in an
 * Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, you must pass it as a
 * reference to an image in an Amazon S3 bucket. For the AWS CLI, passing image bytes is not
 * supported. The image must be either a .png or .jpeg formatted file.
 *
 * The `DetectText` operation returns text in an array of TextDetection elements, `TextDetections`. Each
 * `TextDetection` element provides information about a single word or line of text
 * that was detected in the image.
 *
 * A word is one or more script characters that are not separated by spaces.
 * `DetectText` can detect up to 100 words in an image.
 *
 * A line is a string of equally spaced words. A line isn't necessarily a complete
 * sentence. For example, a driver's license number is detected as a line. A line ends when there
 * is no aligned text after it. Also, a line ends when there is a large gap between words,
 * relative to the length of the words. This means, depending on the gap between words, Amazon Rekognition
 * may detect multiple lines in text aligned in the same direction. Periods don't represent the
 * end of a line. If a sentence spans multiple lines, the `DetectText` operation
 * returns multiple lines.
 *
 * To determine whether a `TextDetection` element is a line of text or a word,
 * use the `TextDetection` object `Type` field.
 *
 * To be detected, text must be within +/- 90 degrees orientation of the horizontal
 * axis.
 *
 * For more information, see Detecting text in the Amazon Rekognition Developer
 * Guide.
 */
export const detectText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectTextRequest,
  output: DetectTextResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Compares a face in the *source* input image with each of the 100
 * largest faces detected in the *target* input image.
 *
 * If the source image contains multiple faces, the service detects the largest face and
 * compares it with each face detected in the target image.
 *
 * CompareFaces uses machine learning algorithms, which are probabilistic. A false negative
 * is an incorrect prediction that a face in the target image has a low similarity confidence
 * score when compared to the face in the source image. To reduce the probability of false
 * negatives, we recommend that you compare the target image against multiple source images. If
 * you plan to use `CompareFaces` to make a decision that impacts an individual's
 * rights, privacy, or access to services, we recommend that you pass the result to a human for
 * review and further validation before taking action.
 *
 * You pass the input and target images either as base64-encoded image bytes or as
 * references to images in an Amazon S3 bucket. If you use the
 * AWS
 * CLI to call Amazon Rekognition operations, passing image bytes isn't
 * supported. The image must be formatted as a PNG or JPEG file.
 *
 * In response, the operation returns an array of face matches ordered by similarity score
 * in descending order. For each face match, the response provides a bounding box of the face,
 * facial landmarks, pose details (pitch, roll, and yaw), quality (brightness and sharpness), and
 * confidence value (indicating the level of confidence that the bounding box contains a face).
 * The response also provides a similarity score, which indicates how closely the faces match.
 *
 * By default, only faces with a similarity score of greater than or equal to 80% are
 * returned in the response. You can change this value by specifying the
 * `SimilarityThreshold` parameter.
 *
 * `CompareFaces` also returns an array of faces that don't match the source
 * image. For each face, it returns a bounding box, confidence value, landmarks, pose details,
 * and quality. The response also returns information about the face in the source image,
 * including the bounding box of the face and confidence value.
 *
 * The `QualityFilter` input parameter allows you to filter out detected faces
 * that don’t meet a required quality bar. The quality bar is based on a variety of common use
 * cases. Use `QualityFilter` to set the quality bar by specifying `LOW`,
 * `MEDIUM`, or `HIGH`. If you do not want to filter detected faces,
 * specify `NONE`. The default value is `NONE`.
 *
 * If the image doesn't contain Exif metadata, `CompareFaces` returns
 * orientation information for the source and target images. Use these values to display the
 * images with the correct image orientation.
 *
 * If no faces are detected in the source or target images, `CompareFaces`
 * returns an `InvalidParameterException` error.
 *
 * This is a stateless API operation. That is, data returned by this operation doesn't
 * persist.
 *
 * For an example, see Comparing Faces in Images in the Amazon Rekognition Developer
 * Guide.
 *
 * This operation requires permissions to perform the
 * `rekognition:CompareFaces` action.
 */
export const compareFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompareFacesRequest,
  output: CompareFacesResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified collection. Note that this operation removes all faces in the
 * collection. For an example, see Deleting a
 * collection.
 *
 * This operation requires permissions to perform the
 * `rekognition:DeleteCollection` action.
 */
export const deleteCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCollectionRequest,
  output: DeleteCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Detects instances of real-world entities within an image (JPEG or PNG) provided as
 * input. This includes objects like flower, tree, and table; events like wedding, graduation,
 * and birthday party; and concepts like landscape, evening, and nature.
 *
 * For an example, see Analyzing images stored in an Amazon S3 bucket in the
 * Amazon Rekognition Developer Guide.
 *
 * You pass the input image as base64-encoded image bytes or as a reference to an image in
 * an Amazon S3 bucket. If you use the
 * AWS
 * CLI to call Amazon Rekognition operations, passing image bytes is not
 * supported. The image must be either a PNG or JPEG formatted file.
 *
 * **Optional Parameters**
 *
 * You can specify one or both of the `GENERAL_LABELS` and
 * `IMAGE_PROPERTIES` feature types when calling the DetectLabels API. Including
 * `GENERAL_LABELS` will ensure the response includes the labels detected in the
 * input image, while including `IMAGE_PROPERTIES `will ensure the response includes
 * information about the image quality and color.
 *
 * When using `GENERAL_LABELS` and/or `IMAGE_PROPERTIES` you can
 * provide filtering criteria to the Settings parameter. You can filter with sets of individual
 * labels or with label categories. You can specify inclusive filters, exclusive filters, or a
 * combination of inclusive and exclusive filters. For more information on filtering see Detecting
 * Labels in an Image.
 *
 * When getting labels, you can specify `MinConfidence` to control the
 * confidence threshold for the labels returned. The default is 55%. You can also add the
 * `MaxLabels` parameter to limit the number of labels returned. The default and
 * upper limit is 1000 labels. These arguments are only valid when supplying GENERAL_LABELS as a
 * feature type.
 *
 * **Response Elements**
 *
 * For each object, scene, and concept the API returns one or more labels. The API
 * returns the following types of information about labels:
 *
 * - Name - The name of the detected label.
 *
 * - Confidence - The level of confidence in the label assigned to a detected object.
 *
 * - Parents - The ancestor labels for a detected label. DetectLabels returns a
 * hierarchical taxonomy of detected labels. For example, a detected car might be assigned
 * the label car. The label car has two parent labels: Vehicle (its parent) and
 * Transportation (its grandparent). The response includes the all ancestors for a label,
 * where every ancestor is a unique label. In the previous example, Car, Vehicle, and
 * Transportation are returned as unique labels in the response.
 *
 * - Aliases - Possible Aliases for the label.
 *
 * - Categories - The label categories that the detected label belongs to.
 *
 * - BoundingBox — Bounding boxes are described for all instances of detected common
 * object labels, returned in an array of Instance objects. An Instance object contains a
 * BoundingBox object, describing the location of the label on the input image. It also
 * includes the confidence for the accuracy of the detected bounding box.
 *
 * The API returns the following information regarding the image, as part of the
 * ImageProperties structure:
 *
 * - Quality - Information about the Sharpness, Brightness, and Contrast of the input
 * image, scored between 0 to 100. Image quality is returned for the entire image, as well as
 * the background and the foreground.
 *
 * - Dominant Color - An array of the dominant colors in the image.
 *
 * - Foreground - Information about the sharpness, brightness, and dominant colors of the
 * input image’s foreground.
 *
 * - Background - Information about the sharpness, brightness, and dominant colors of the
 * input image’s background.
 *
 * The list of returned labels will include at least one label for every detected object,
 * along with information about that label. In the following example, suppose the input image has
 * a lighthouse, the sea, and a rock. The response includes all three labels, one for each
 * object, as well as the confidence in the label:
 *
 * `{Name: lighthouse, Confidence: 98.4629}`
 *
 * `{Name: rock,Confidence: 79.2097}`
 *
 * ` {Name: sea,Confidence: 75.061}`
 *
 * The list of labels can include multiple labels for the same object. For example, if the
 * input image shows a flower (for example, a tulip), the operation might return the following
 * three labels.
 *
 * `{Name: flower,Confidence: 99.0562}`
 *
 * `{Name: plant,Confidence: 99.0562}`
 *
 * `{Name: tulip,Confidence: 99.0562}`
 *
 * In this example, the detection algorithm more precisely identifies the flower as a
 * tulip.
 *
 * If the object detected is a person, the operation doesn't provide the same facial
 * details that the DetectFaces operation provides.
 *
 * This is a stateless API operation that doesn't return any data.
 *
 * This operation requires permissions to perform the
 * `rekognition:DetectLabels` action.
 */
export const detectLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectLabelsRequest,
  output: DetectLabelsResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets the label detection results of a Amazon Rekognition Video analysis started by StartLabelDetection.
 *
 * The label detection operation is started by a call to StartLabelDetection which returns a job identifier (`JobId`). When
 * the label detection operation finishes, Amazon Rekognition publishes a completion status to the
 * Amazon Simple Notification Service topic registered in the initial call to `StartlabelDetection`.
 *
 * To get the results of the label detection operation, first check that the status value
 * published to the Amazon SNS topic is `SUCCEEDED`. If so, call GetLabelDetection and pass the job identifier (`JobId`) from the
 * initial call to `StartLabelDetection`.
 *
 * `GetLabelDetection` returns an array of detected labels
 * (`Labels`) sorted by the time the labels were detected. You can also sort by the
 * label name by specifying `NAME` for the `SortBy` input parameter. If
 * there is no `NAME` specified, the default sort is by
 * timestamp.
 *
 * You can select how results are aggregated by using the `AggregateBy` input
 * parameter. The default aggregation method is `TIMESTAMPS`. You can also aggregate
 * by `SEGMENTS`, which aggregates all instances of labels detected in a given
 * segment.
 *
 * The returned Labels array may include the following attributes:
 *
 * - Name - The name of the detected label.
 *
 * - Confidence - The level of confidence in the label assigned to a detected object.
 *
 * - Parents - The ancestor labels for a detected label. GetLabelDetection returns a hierarchical
 * taxonomy of detected labels. For example, a detected car might be assigned the label car.
 * The label car has two parent labels: Vehicle (its parent) and Transportation (its
 * grandparent). The response includes the all ancestors for a label, where every ancestor is
 * a unique label. In the previous example, Car, Vehicle, and Transportation are returned as
 * unique labels in the response.
 *
 * - Aliases - Possible Aliases for the label.
 *
 * - Categories - The label categories that the detected label belongs to.
 *
 * - BoundingBox — Bounding boxes are described for all instances of detected common object labels,
 * returned in an array of Instance objects. An Instance object contains a BoundingBox object, describing
 * the location of the label on the input image. It also includes the confidence for the accuracy of the detected bounding box.
 *
 * - Timestamp - Time, in milliseconds from the start of the video, that the label was detected.
 * For aggregation by `SEGMENTS`, the `StartTimestampMillis`,
 * `EndTimestampMillis`, and `DurationMillis` structures are what
 * define a segment. Although the “Timestamp” structure is still returned with each label,
 * its value is set to be the same as `StartTimestampMillis`.
 *
 * Timestamp and Bounding box information are returned for detected Instances, only if
 * aggregation is done by `TIMESTAMPS`. If aggregating by `SEGMENTS`,
 * information about detected instances isn’t returned.
 *
 * The version of the label model used for the detection is also returned.
 *
 * Note `DominantColors` isn't returned for `Instances`,
 * although it is shown as part of the response in the sample seen below.
 *
 * Use `MaxResults` parameter to limit the number of labels returned. If
 * there are more results than specified in `MaxResults`, the value of
 * `NextToken` in the operation response contains a pagination token for getting the
 * next set of results. To get the next page of results, call `GetlabelDetection` and
 * populate the `NextToken` request parameter with the token value returned from the
 * previous call to `GetLabelDetection`.
 *
 * If you are retrieving results while using the Amazon Simple Notification Service, note that you will receive an
 * "ERROR" notification if the job encounters an issue.
 */
export const getLabelDetection = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetLabelDetectionRequest,
    output: GetLabelDetectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Starts the running of the version of a model. Starting a model takes a while to
 * complete. To check the current state of the model, use DescribeProjectVersions.
 *
 * Once the model is running, you can detect custom labels in new images by calling
 * DetectCustomLabels.
 *
 * You are charged for the amount of time that the model is running. To stop a running
 * model, call StopProjectVersion.
 *
 * This operation requires permissions to perform the
 * `rekognition:StartProjectVersion` action.
 */
export const startProjectVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProjectVersionRequest,
  output: StartProjectVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the results of a specific Face Liveness session. It requires the
 * `sessionId` as input, which was created using
 * `CreateFaceLivenessSession`. Returns the corresponding Face Liveness confidence
 * score, a reference image that includes a face bounding box, and audit images that also contain
 * face bounding boxes. The Face Liveness confidence score ranges from 0 to 100.
 *
 * The number of audit images returned by `GetFaceLivenessSessionResults` is
 * defined by the `AuditImagesLimit` paramater when calling
 * `CreateFaceLivenessSession`. Reference images are always returned when
 * possible.
 */
export const getFaceLivenessSessionResults =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFaceLivenessSessionResultsRequest,
    output: GetFaceLivenessSessionResultsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      SessionNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Detects unsafe content in a specified JPEG or PNG format image. Use
 * `DetectModerationLabels` to moderate images depending on your requirements. For
 * example, you might want to filter images that contain nudity, but not images containing
 * suggestive content.
 *
 * To filter images, use the labels returned by `DetectModerationLabels` to
 * determine which types of content are appropriate.
 *
 * For information about moderation labels, see Detecting Unsafe Content in the
 * Amazon Rekognition Developer Guide.
 *
 * You pass the input image either as base64-encoded image bytes or as a reference to an
 * image in an Amazon S3 bucket. If you use the
 * AWS
 * CLI to call Amazon Rekognition operations, passing image bytes is not
 * supported. The image must be either a PNG or JPEG formatted file.
 *
 * You can specify an adapter to use when retrieving label predictions by providing a
 * `ProjectVersionArn` to the `ProjectVersion` argument.
 */
export const detectModerationLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectModerationLabelsRequest,
    output: DetectModerationLabelsResponse,
    errors: [
      AccessDeniedException,
      HumanLoopQuotaExceededException,
      ImageTooLargeException,
      InternalServerError,
      InvalidImageFormatException,
      InvalidParameterException,
      InvalidS3ObjectException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ThrottlingException,
    ],
  }),
);
/**
 * Detects Personal Protective Equipment (PPE) worn by people detected in an image. Amazon Rekognition can detect the
 * following types of PPE.
 *
 * - Face cover
 *
 * - Hand cover
 *
 * - Head cover
 *
 * You pass the input image as base64-encoded image bytes or as a reference to an image in an Amazon S3 bucket.
 * The image must be either a PNG or JPG formatted file.
 *
 * `DetectProtectiveEquipment` detects PPE worn by up to 15 persons detected in an image.
 *
 * For each person detected in the image the API returns an array of body parts (face, head, left-hand, right-hand).
 * For each body part, an array of detected items of PPE is returned, including an indicator of whether or not the PPE
 * covers the body part. The API returns the confidence it has in each detection
 * (person, PPE, body part and body part coverage). It also returns a bounding box (BoundingBox) for each detected
 * person and each detected item of PPE.
 *
 * You can optionally request a summary of detected PPE items with the `SummarizationAttributes` input parameter.
 * The summary provides the following information.
 *
 * - The persons detected as wearing all of the types of PPE that you specify.
 *
 * - The persons detected as not wearing all of the types PPE that you specify.
 *
 * - The persons detected where PPE adornment could not be determined.
 *
 * This is a stateless API operation. That is, the operation does not persist any data.
 *
 * This operation requires permissions to perform the `rekognition:DetectProtectiveEquipment` action.
 */
export const detectProtectiveEquipment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectProtectiveEquipmentRequest,
    output: DetectProtectiveEquipmentResponse,
    errors: [
      AccessDeniedException,
      ImageTooLargeException,
      InternalServerError,
      InvalidImageFormatException,
      InvalidParameterException,
      InvalidS3ObjectException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a collection in an AWS Region. You can add faces to the collection using the
 * IndexFaces operation.
 *
 * For example, you might create collections, one for each of your application users. A
 * user can then index faces using the `IndexFaces` operation and persist results in a
 * specific collection. Then, a user can search the collection for faces in the user-specific
 * container.
 *
 * When you create a collection, it is associated with the latest version of the face model
 * version.
 *
 * Collection names are case-sensitive.
 *
 * This operation requires permissions to perform the
 * `rekognition:CreateCollection` action. If you want to tag your collection, you
 * also require permission to perform the `rekognition:TagResource`
 * operation.
 */
export const createCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCollectionRequest,
  output: CreateCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceAlreadyExistsException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Starts the asynchronous search for faces in a collection that match the faces of persons detected in a stored video.
 *
 * The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name
 * and the filename of the video. `StartFaceSearch`
 * returns a job identifier (`JobId`) which you use to get the search results once the search has completed.
 * When searching is finished, Amazon Rekognition Video publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 * To get the search results, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetFaceSearch and pass the job identifier
 * (`JobId`) from the initial call to `StartFaceSearch`. For more information, see
 * Searching stored videos for faces.
 */
export const startFaceSearch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFaceSearchRequest,
  output: StartFaceSearchResponse,
  errors: [
    AccessDeniedException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    VideoTooLargeException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Distributes the entries (images) in a training dataset across the training dataset and the test dataset for a project.
 * `DistributeDatasetEntries` moves 20% of the training dataset images to the test dataset.
 * An entry is a JSON Line that describes an image.
 *
 * You supply the Amazon Resource Names (ARN) of a project's training dataset and test dataset.
 * The training dataset must contain the images that you want to split. The test dataset
 * must be empty. The datasets must belong to the same project. To create training and test datasets for a project, call CreateDataset.
 *
 * Distributing a dataset takes a while to complete. To check the status call `DescribeDataset`. The operation
 * is complete when the `Status` field for the training dataset and the test dataset is `UPDATE_COMPLETE`.
 * If the dataset split fails, the value of `Status` is `UPDATE_FAILED`.
 *
 * This operation requires permissions to perform the `rekognition:DistributeDatasetEntries` action.
 */
export const distributeDatasetEntries = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DistributeDatasetEntriesRequest,
    output: DistributeDatasetEntriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ThrottlingException,
    ],
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Detects custom labels in a supplied image by using an Amazon Rekognition Custom Labels model.
 *
 * You specify which version of a model version to use by using the `ProjectVersionArn` input
 * parameter.
 *
 * You pass the input image as base64-encoded image bytes or as a reference to an image in
 * an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations, passing
 * image bytes is not supported. The image must be either a PNG or JPEG formatted file.
 *
 * For each object that the model version detects on an image, the API returns a
 * (`CustomLabel`) object in an array (`CustomLabels`).
 * Each `CustomLabel` object provides the label name (`Name`), the level
 * of confidence that the image contains the object (`Confidence`), and
 * object location information, if it exists, for the label on the image (`Geometry`).
 *
 * To filter labels that are returned, specify a value for `MinConfidence`.
 * `DetectCustomLabelsLabels` only returns labels with a confidence that's higher than
 * the specified value.
 *
 * The value of `MinConfidence` maps to the assumed threshold values
 * created during training. For more information, see *Assumed threshold*
 * in the Amazon Rekognition Custom Labels Developer Guide.
 * Amazon Rekognition Custom Labels metrics expresses an assumed threshold as a floating point value between 0-1. The range of
 * `MinConfidence` normalizes the threshold value to a percentage value (0-100). Confidence
 * responses from `DetectCustomLabels` are also returned as a percentage.
 * You can use `MinConfidence` to change the precision and recall or your model.
 * For more information, see
 * *Analyzing an image* in the Amazon Rekognition Custom Labels Developer Guide.
 *
 * If you don't specify a value for `MinConfidence`, `DetectCustomLabels`
 * returns labels based on the assumed threshold of each label.
 *
 * This is a stateless API operation. That is, the operation does not persist any
 * data.
 *
 * This operation requires permissions to perform the
 * `rekognition:DetectCustomLabels` action.
 *
 * For more information, see
 * *Analyzing an image* in the Amazon Rekognition Custom Labels Developer Guide.
 */
export const detectCustomLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectCustomLabelsRequest,
  output: DetectCustomLabelsResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
  ],
}));
/**
 * Initiates a new media analysis job. Accepts a manifest file in an Amazon S3 bucket. The
 * output is a manifest file and a summary of the manifest stored in the Amazon S3 bucket.
 */
export const startMediaAnalysisJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMediaAnalysisJobRequest,
    output: StartMediaAnalysisJobResponse,
    errors: [
      AccessDeniedException,
      IdempotentParameterMismatchException,
      InternalServerError,
      InvalidManifestException,
      InvalidParameterException,
      InvalidS3ObjectException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ThrottlingException,
    ],
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see
 * Labeling images.
 *
 * Lists the labels in a dataset. Amazon Rekognition Custom Labels uses labels to describe images. For more information, see Labeling images
 * in the *Amazon Rekognition Custom Labels Developer Guide*.
 */
export const listDatasetLabels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDatasetLabelsRequest,
    output: ListDatasetLabelsResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DatasetLabelDescriptions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Lists the entries (images) within a dataset. An entry is a
 * JSON Line that contains the information for a single image, including
 * the image location, assigned labels, and object location bounding boxes. For
 * more information, see Creating a manifest file.
 *
 * JSON Lines in the response include information about non-terminal
 * errors found in the dataset.
 * Non terminal errors are reported in `errors` lists within each JSON Line. The
 * same information is reported in the training and testing validation result manifests that
 * Amazon Rekognition Custom Labels creates during model training.
 *
 * You can filter the response in variety of ways, such as choosing which labels to return and returning JSON Lines created after a specific date.
 *
 * This operation requires permissions to perform the `rekognition:ListDatasetEntries` action.
 */
export const listDatasetEntries = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDatasetEntriesRequest,
    output: ListDatasetEntriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidPaginationTokenException,
      InvalidParameterException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ResourceNotReadyException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DatasetEntries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Associates one or more faces with an existing UserID. Takes an array of
 * `FaceIds`. Each `FaceId` that are present in the `FaceIds`
 * list is associated with the provided UserID. The number of FaceIds that can be used as input
 * in a single request is limited to 100.
 *
 * Note that the total number of faces that can be associated with a single
 * `UserID` is also limited to 100. Once a `UserID` has 100 faces
 * associated with it, no additional faces can be added. If more API calls are made after the
 * limit is reached, a `ServiceQuotaExceededException` will result.
 *
 * The `UserMatchThreshold` parameter specifies the minimum user match confidence
 * required for the face to be associated with a UserID that has at least one `FaceID`
 * already associated. This ensures that the `FaceIds` are associated with the right
 * UserID. The value ranges from 0-100 and default value is 75.
 *
 * If successful, an array of `AssociatedFace` objects containing the associated
 * `FaceIds` is returned. If a given face is already associated with the given
 * `UserID`, it will be ignored and will not be returned in the response. If a given
 * face is already associated to a different `UserID`, isn't found in the collection,
 * doesn’t meet the `UserMatchThreshold`, or there are already 100 faces associated
 * with the `UserID`, it will be returned as part of an array of
 * `UnsuccessfulFaceAssociations.`
 *
 * The `UserStatus` reflects the status of an operation which updates a UserID
 * representation with a list of given faces. The `UserStatus` can be:
 *
 * - ACTIVE - All associations or disassociations of FaceID(s) for a UserID are
 * complete.
 *
 * - CREATED - A UserID has been created, but has no FaceID(s) associated with it.
 *
 * - UPDATING - A UserID is being updated and there are current associations or
 * disassociations of FaceID(s) taking place.
 */
export const associateFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFacesRequest,
  output: AssociateFacesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Adds one or more key-value tags to an Amazon Rekognition collection, stream processor, or Custom
 * Labels model. For more information, see Tagging AWS
 * Resources.
 *
 * This operation requires permissions to perform the `rekognition:TagResource`
 * action.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new User within a collection specified by `CollectionId`. Takes
 * `UserId` as a parameter, which is a user provided ID which should be unique
 * within the collection. The provided `UserId` will alias the system generated UUID
 * to make the `UserId` more user friendly.
 *
 * Uses a `ClientToken`, an idempotency token that ensures a call to
 * `CreateUser` completes only once. If the value is not supplied, the AWS SDK
 * generates an idempotency token for the requests. This prevents retries after a network error
 * results from making multiple `CreateUser` calls.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Detects faces in the input image and adds them to the specified collection.
 *
 * Amazon Rekognition doesn't save the actual faces that are detected. Instead, the underlying
 * detection algorithm first detects the faces in the input image. For each face, the algorithm
 * extracts facial features into a feature vector, and stores it in the backend database.
 * Amazon Rekognition uses feature vectors when it performs face match and search operations using the
 * SearchFaces and SearchFacesByImage operations.
 *
 * For more information, see Adding faces to a collection in the Amazon Rekognition
 * Developer Guide.
 *
 * To get the number of faces in a collection, call DescribeCollection.
 *
 * If you're using version 1.0 of the face detection model, `IndexFaces`
 * indexes the 15 largest faces in the input image. Later versions of the face detection model
 * index the 100 largest faces in the input image.
 *
 * If you're using version 4 or later of the face model, image orientation information is not
 * returned in the `OrientationCorrection` field.
 *
 * To determine which version of the model you're using, call DescribeCollection and supply the collection ID. You can also get the model
 * version from the value of `FaceModelVersion` in the response from
 * `IndexFaces`
 *
 * For more information, see Model Versioning in the Amazon Rekognition Developer
 * Guide.
 *
 * If you provide the optional `ExternalImageId` for the input image you
 * provided, Amazon Rekognition associates this ID with all faces that it detects. When you call the ListFaces operation, the response returns the external ID. You can use this
 * external image ID to create a client-side index to associate the faces with each image. You
 * can then use the index to find all faces in an image.
 *
 * You can specify the maximum number of faces to index with the `MaxFaces` input
 * parameter. This is useful when you want to index the largest faces in an image and don't want
 * to index smaller faces, such as those belonging to people standing in the background.
 *
 * The `QualityFilter` input parameter allows you to filter out detected faces
 * that don’t meet a required quality bar. The quality bar is based on a variety of common use
 * cases. By default, `IndexFaces` chooses the quality bar that's used to filter
 * faces. You can also explicitly choose the quality bar. Use `QualityFilter`, to set
 * the quality bar by specifying `LOW`, `MEDIUM`, or `HIGH`. If
 * you do not want to filter detected faces, specify `NONE`.
 *
 * To use quality filtering, you need a collection associated with version 3 of the face
 * model or higher. To get the version of the face model associated with a collection, call
 * DescribeCollection.
 *
 * Information about faces detected in an image, but not indexed, is returned in an array of
 * UnindexedFace objects, `UnindexedFaces`. Faces aren't indexed
 * for reasons such as:
 *
 * - The number of faces detected exceeds the value of the `MaxFaces` request
 * parameter.
 *
 * - The face is too small compared to the image dimensions.
 *
 * - The face is too blurry.
 *
 * - The image is too dark.
 *
 * - The face has an extreme pose.
 *
 * - The face doesn’t have enough detail to be suitable for face search.
 *
 * In response, the `IndexFaces` operation returns an array of metadata for all
 * detected faces, `FaceRecords`. This includes:
 *
 * - The bounding box, `BoundingBox`, of the detected face.
 *
 * - A confidence value, `Confidence`, which indicates the confidence that the
 * bounding box contains a face.
 *
 * - A face ID, `FaceId`, assigned by the service for each face that's detected
 * and stored.
 *
 * - An image ID, `ImageId`, assigned by the service for the input image.
 *
 * If you request `ALL` or specific facial attributes (e.g.,
 * `FACE_OCCLUDED`) by using the detectionAttributes parameter, Amazon Rekognition
 * returns detailed facial attributes, such as facial landmarks (for example, location of eye and
 * mouth), facial occlusion, and other facial attributes.
 *
 * If you provide the same image, specify the same collection, and use the same external ID
 * in the `IndexFaces` operation, Amazon Rekognition doesn't save duplicate face
 * metadata.
 *
 * The input image is passed either as base64-encoded image bytes, or as a reference to an
 * image in an Amazon S3 bucket. If you use the AWS CLI to call Amazon Rekognition operations,
 * passing image bytes isn't supported. The image must be formatted as a PNG or JPEG file.
 *
 * This operation requires permissions to perform the `rekognition:IndexFaces`
 * action.
 */
export const indexFaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IndexFacesRequest,
  output: IndexFacesResponse,
  errors: [
    AccessDeniedException,
    ImageTooLargeException,
    InternalServerError,
    InvalidImageFormatException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Attaches a project policy to a Amazon Rekognition Custom Labels project in a trusting AWS account. A
 * project policy specifies that a trusted AWS account can copy a model version from a
 * trusting AWS account to a project in the trusted AWS account. To copy a model version
 * you use the CopyProjectVersion operation. Only applies to Custom Labels
 * projects.
 *
 * For more information about the format of a project policy document, see Attaching a project policy (SDK)
 * in the *Amazon Rekognition Custom Labels Developer Guide*.
 *
 * The response from `PutProjectPolicy` is a revision ID for the project policy.
 * You can attach multiple project policies to a project. You can also update an existing
 * project policy by specifying the policy revision ID of the existing policy.
 *
 * To remove a project policy from a project, call DeleteProjectPolicy.
 * To get a list of project policies attached to a project, call ListProjectPolicies.
 *
 * You copy a model version by calling CopyProjectVersion.
 *
 * This operation requires permissions to perform the `rekognition:PutProjectPolicy` action.
 */
export const putProjectPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProjectPolicyRequest,
  output: PutProjectPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    InvalidPolicyRevisionIdException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    ProvisionedThroughputExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * This operation applies only to Amazon Rekognition Custom Labels.
 *
 * Copies a version of an Amazon Rekognition Custom Labels model from a source project to a destination project. The source and
 * destination projects can be in different AWS accounts but must be in the same AWS Region.
 * You can't copy a model to another AWS service.
 *
 * To copy a model version to a different AWS account, you need to create a resource-based policy known as a
 * *project policy*. You attach the project policy to the
 * source project by calling PutProjectPolicy. The project policy
 * gives permission to copy the model version from a trusting AWS account to a trusted account.
 *
 * For more information creating and attaching a project policy, see Attaching a project policy (SDK)
 * in the *Amazon Rekognition Custom Labels Developer Guide*.
 *
 * If you are copying a model version to a project in the same AWS account, you don't need to create a project policy.
 *
 * Copying project versions is supported only for Custom Labels models.
 *
 * To copy a model, the destination project, source project, and source model version
 * must already exist.
 *
 * Copying a model version takes a while to complete. To get the current status, call DescribeProjectVersions and check the value of `Status` in the
 * ProjectVersionDescription object. The copy operation has finished when
 * the value of `Status` is `COPYING_COMPLETED`.
 *
 * This operation requires permissions to perform the `rekognition:CopyProjectVersion` action.
 */
export const copyProjectVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyProjectVersionRequest,
  output: CopyProjectVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new version of Amazon Rekognition project (like a Custom Labels model or a custom adapter)
 * and begins training. Models and adapters are managed as part of a Rekognition project. The
 * response from `CreateProjectVersion` is an Amazon Resource Name (ARN) for the
 * project version.
 *
 * The FeatureConfig operation argument allows you to configure specific model or adapter
 * settings. You can provide a description to the project version by using the
 * VersionDescription argment. Training can take a while to complete. You can get the current
 * status by calling DescribeProjectVersions. Training completed
 * successfully if the value of the `Status` field is
 * `TRAINING_COMPLETED`. Once training has successfully completed, call DescribeProjectVersions to get the training results and evaluate the
 * model.
 *
 * This operation requires permissions to perform the
 * `rekognition:CreateProjectVersion` action.
 *
 * The following applies only to projects with Amazon Rekognition Custom Labels as the chosen
 * feature:
 *
 * You can train a model in a project that doesn't have associated datasets by specifying manifest files in the
 * `TrainingData` and `TestingData` fields.
 *
 * If you open the console after training a model with manifest files, Amazon Rekognition Custom Labels creates
 * the datasets for you using the most recent manifest files. You can no longer train
 * a model version for the project by specifying manifest files.
 *
 * Instead of training with a project without associated datasets,
 * we recommend that you use the manifest
 * files to create training and test datasets for the project.
 */
export const createProjectVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProjectVersionRequest,
    output: CreateProjectVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an Amazon Rekognition stream processor that you can use to detect and recognize faces or to detect labels in a streaming video.
 *
 * Amazon Rekognition Video is a consumer of live video from Amazon Kinesis Video Streams. There are two different settings for stream processors in Amazon Rekognition: detecting faces and detecting labels.
 *
 * - If you are creating a stream processor for detecting faces, you provide as input a Kinesis video stream
 * (`Input`) and a Kinesis data stream (`Output`) stream for receiving
 * the output. You must use the `FaceSearch` option in
 * `Settings`, specifying the collection that contains the faces you
 * want to recognize. After you have finished analyzing a streaming video, use
 * StopStreamProcessor to stop processing.
 *
 * - If you are creating a stream processor to detect labels, you provide as input a Kinesis video stream
 * (`Input`), Amazon S3 bucket information (`Output`), and an
 * Amazon SNS topic ARN (`NotificationChannel`). You can also provide a KMS
 * key ID to encrypt the data sent to your Amazon S3 bucket. You specify what you want
 * to detect by using the `ConnectedHome` option in settings, and
 * selecting one of the following: `PERSON`, `PET`,
 * `PACKAGE`, `ALL` You can also specify where in the
 * frame you want Amazon Rekognition to monitor with `RegionsOfInterest`. When
 * you run the StartStreamProcessor operation on a label
 * detection stream processor, you input start and stop information to determine
 * the length of the processing time.
 *
 * Use `Name` to assign an identifier for the stream processor. You use `Name`
 * to manage the stream processor. For example, you can start processing the source video by calling StartStreamProcessor with
 * the `Name` field.
 *
 * This operation requires permissions to perform the
 * `rekognition:CreateStreamProcessor` action. If you want to tag your stream processor, you also require permission to perform the `rekognition:TagResource` operation.
 */
export const createStreamProcessor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStreamProcessorRequest,
    output: CreateStreamProcessorResponse,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidParameterException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ResourceInUseException,
      ServiceQuotaExceededException,
      ThrottlingException,
    ],
  }),
);
/**
 * Starts asynchronous detection of inappropriate, unwanted, or offensive content in a stored video. For a list of moderation labels in Amazon Rekognition, see
 * Using the image and video moderation APIs.
 *
 * Amazon Rekognition Video can moderate content in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name
 * and the filename of the video. `StartContentModeration`
 * returns a job identifier (`JobId`) which you use to get the results of the analysis.
 * When content analysis is finished, Amazon Rekognition Video publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 *
 * To get the results of the content analysis, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetContentModeration and pass the job identifier
 * (`JobId`) from the initial call to `StartContentModeration`.
 *
 * For more information, see Moderating content in the Amazon Rekognition Developer Guide.
 */
export const startContentModeration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartContentModerationRequest,
    output: StartContentModerationResponse,
    errors: [
      AccessDeniedException,
      IdempotentParameterMismatchException,
      InternalServerError,
      InvalidParameterException,
      InvalidS3ObjectException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
      VideoTooLargeException,
    ],
  }),
);
/**
 * Starts asynchronous detection of labels in a stored video.
 *
 * Amazon Rekognition Video can detect labels in a video. Labels are instances of real-world entities.
 * This includes objects like flower, tree, and table; events like
 * wedding, graduation, and birthday party; concepts like landscape, evening, and nature; and activities
 * like a person getting out of a car or a person skiing.
 *
 * The video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name
 * and the filename of the video.
 * `StartLabelDetection` returns a job identifier (`JobId`) which you use to get the
 * results of the operation. When label detection is finished, Amazon Rekognition Video publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 *
 * To get the results of the label detection operation, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetLabelDetection and pass the job identifier
 * (`JobId`) from the initial call to `StartLabelDetection`.
 *
 * *Optional Parameters*
 *
 * `StartLabelDetection` has the `GENERAL_LABELS` Feature applied by
 * default. This feature allows you to provide filtering criteria to the `Settings`
 * parameter. You can filter with sets of individual labels or with label categories. You can
 * specify inclusive filters, exclusive filters, or a combination of inclusive and exclusive
 * filters. For more information on filtering, see Detecting labels in a
 * video.
 *
 * You can specify `MinConfidence` to control the confidence threshold for the
 * labels returned. The default is 50.
 */
export const startLabelDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLabelDetectionRequest,
  output: StartLabelDetectionResponse,
  errors: [
    AccessDeniedException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    VideoTooLargeException,
  ],
}));
/**
 * Starts asynchronous detection of text in a stored video.
 *
 * Amazon Rekognition Video can detect text in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and
 * the filename of the video. `StartTextDetection` returns a job identifier (`JobId`) which you use to get
 * the results of the operation. When text detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic
 * that you specify in `NotificationChannel`.
 *
 * To get the results of the text detection operation, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. if so, call GetTextDetection and pass the job identifier (`JobId`)
 * from the initial call to `StartTextDetection`.
 */
export const startTextDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTextDetectionRequest,
  output: StartTextDetectionResponse,
  errors: [
    AccessDeniedException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    VideoTooLargeException,
  ],
}));
/**
 * Starts asynchronous detection of faces in a stored video.
 *
 * Amazon Rekognition Video can detect faces in a video stored in an Amazon S3 bucket.
 * Use Video to specify the bucket name and the filename of the video.
 * `StartFaceDetection` returns a job identifier (`JobId`) that you
 * use to get the results of the operation.
 * When face detection is finished, Amazon Rekognition Video publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 * To get the results of the face detection operation, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetFaceDetection and pass the job identifier
 * (`JobId`) from the initial call to `StartFaceDetection`.
 *
 * For more information, see Detecting faces in a stored video in the
 * Amazon Rekognition Developer Guide.
 */
export const startFaceDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFaceDetectionRequest,
  output: StartFaceDetectionResponse,
  errors: [
    AccessDeniedException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    VideoTooLargeException,
  ],
}));
/**
 * *End of support notice:* On October 31, 2025, AWS will discontinue
 * support for Amazon Rekognition People Pathing. After October 31, 2025, you will no
 * longer be able to use the Rekognition People Pathing capability. For more information,
 * visit this blog post.
 *
 * Starts the asynchronous tracking of a person's path in a stored video.
 *
 * Amazon Rekognition Video can track the path of people in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name
 * and the filename of the video. `StartPersonTracking`
 * returns a job identifier (`JobId`) which you use to get the results of the operation.
 * When label detection is finished, Amazon Rekognition publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 *
 * To get the results of the person detection operation, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetPersonTracking and pass the job identifier
 * (`JobId`) from the initial call to `StartPersonTracking`.
 */
export const startPersonTracking = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPersonTrackingRequest,
  output: StartPersonTrackingResponse,
  errors: [
    AccessDeniedException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    VideoTooLargeException,
  ],
}));
/**
 * Starts asynchronous recognition of celebrities in a stored video.
 *
 * Amazon Rekognition Video can detect celebrities in a video must be stored in an Amazon S3 bucket. Use Video to specify the bucket name
 * and the filename of the video.
 * `StartCelebrityRecognition`
 * returns a job identifier (`JobId`) which you use to get the results of the analysis.
 * When celebrity recognition analysis is finished, Amazon Rekognition Video publishes a completion status
 * to the Amazon Simple Notification Service topic that you specify in `NotificationChannel`.
 * To get the results of the celebrity recognition analysis, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. If so, call GetCelebrityRecognition and pass the job identifier
 * (`JobId`) from the initial call to `StartCelebrityRecognition`.
 *
 * For more information, see Recognizing celebrities in the Amazon Rekognition Developer Guide.
 */
export const startCelebrityRecognition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCelebrityRecognitionRequest,
    output: StartCelebrityRecognitionResponse,
    errors: [
      AccessDeniedException,
      IdempotentParameterMismatchException,
      InternalServerError,
      InvalidParameterException,
      InvalidS3ObjectException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
      VideoTooLargeException,
    ],
  }),
);
/**
 * Starts asynchronous detection of segment detection in a stored video.
 *
 * Amazon Rekognition Video can detect segments in a video stored in an Amazon S3 bucket. Use Video to specify the bucket name and
 * the filename of the video. `StartSegmentDetection` returns a job identifier (`JobId`) which you use to get
 * the results of the operation. When segment detection is finished, Amazon Rekognition Video publishes a completion status to the Amazon Simple Notification Service topic
 * that you specify in `NotificationChannel`.
 *
 * You can use the `Filters` (StartSegmentDetectionFilters)
 * input parameter to specify the minimum detection confidence returned in the response.
 * Within `Filters`, use `ShotFilter` (StartShotDetectionFilter)
 * to filter detected shots. Use `TechnicalCueFilter` (StartTechnicalCueDetectionFilter)
 * to filter technical cues.
 *
 * To get the results of the segment detection operation, first check that the status value published to the Amazon SNS
 * topic is `SUCCEEDED`. if so, call GetSegmentDetection and pass the job identifier (`JobId`)
 * from the initial call to `StartSegmentDetection`.
 *
 * For more information, see Detecting video segments in stored video in the Amazon Rekognition Developer Guide.
 */
export const startSegmentDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSegmentDetectionRequest,
    output: StartSegmentDetectionResponse,
    errors: [
      AccessDeniedException,
      IdempotentParameterMismatchException,
      InternalServerError,
      InvalidParameterException,
      InvalidS3ObjectException,
      LimitExceededException,
      ProvisionedThroughputExceededException,
      ThrottlingException,
      VideoTooLargeException,
    ],
  }),
);

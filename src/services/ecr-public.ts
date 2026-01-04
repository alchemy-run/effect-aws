import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://ecr-public.amazonaws.com/doc/2020-12-02/");
const svc = T.AwsApiService({
  sdkId: "ECR PUBLIC",
  serviceShapeName: "SpencerFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "ecr-public" });
const ver = T.ServiceVersion("2020-10-30");
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
                        url: "https://api.ecr-public-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://api.ecr-public-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ecr-public.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://api.ecr-public.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.ecr-public.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAuthorizationTokenRequest extends S.Class<GetAuthorizationTokenRequest>(
  "GetAuthorizationTokenRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegistryCatalogDataRequest extends S.Class<GetRegistryCatalogDataRequest>(
  "GetRegistryCatalogDataRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const BatchedOperationLayerDigestList = S.Array(S.String);
export const LayerDigestList = S.Array(S.String);
export const RepositoryNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchCheckLayerAvailabilityRequest extends S.Class<BatchCheckLayerAvailabilityRequest>(
  "BatchCheckLayerAvailabilityRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    layerDigests: BatchedOperationLayerDigestList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompleteLayerUploadRequest extends S.Class<CompleteLayerUploadRequest>(
  "CompleteLayerUploadRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    uploadId: S.String,
    layerDigests: LayerDigestList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryRequest extends S.Class<DeleteRepositoryRequest>(
  "DeleteRepositoryRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryPolicyRequest extends S.Class<DeleteRepositoryPolicyRequest>(
  "DeleteRepositoryPolicyRequest",
)(
  { registryId: S.optional(S.String), repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImageIdentifier extends S.Class<ImageIdentifier>(
  "ImageIdentifier",
)({ imageDigest: S.optional(S.String), imageTag: S.optional(S.String) }) {}
export const ImageIdentifierList = S.Array(ImageIdentifier);
export class DescribeImagesRequest extends S.Class<DescribeImagesRequest>(
  "DescribeImagesRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: S.optional(ImageIdentifierList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImageTagsRequest extends S.Class<DescribeImageTagsRequest>(
  "DescribeImageTagsRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistriesRequest extends S.Class<DescribeRegistriesRequest>(
  "DescribeRegistriesRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRepositoriesRequest extends S.Class<DescribeRepositoriesRequest>(
  "DescribeRepositoriesRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryNames: S.optional(RepositoryNameList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryCatalogDataRequest extends S.Class<GetRepositoryCatalogDataRequest>(
  "GetRepositoryCatalogDataRequest",
)(
  { registryId: S.optional(S.String), repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryPolicyRequest extends S.Class<GetRepositoryPolicyRequest>(
  "GetRepositoryPolicyRequest",
)(
  { registryId: S.optional(S.String), repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InitiateLayerUploadRequest extends S.Class<InitiateLayerUploadRequest>(
  "InitiateLayerUploadRequest",
)(
  { registryId: S.optional(S.String), repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutImageRequest extends S.Class<PutImageRequest>(
  "PutImageRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageManifest: S.String,
    imageManifestMediaType: S.optional(S.String),
    imageTag: S.optional(S.String),
    imageDigest: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRegistryCatalogDataRequest extends S.Class<PutRegistryCatalogDataRequest>(
  "PutRegistryCatalogDataRequest",
)(
  { displayName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ArchitectureList = S.Array(S.String);
export const OperatingSystemList = S.Array(S.String);
export class RepositoryCatalogDataInput extends S.Class<RepositoryCatalogDataInput>(
  "RepositoryCatalogDataInput",
)({
  description: S.optional(S.String),
  architectures: S.optional(ArchitectureList),
  operatingSystems: S.optional(OperatingSystemList),
  logoImageBlob: S.optional(T.Blob),
  aboutText: S.optional(S.String),
  usageText: S.optional(S.String),
}) {}
export class PutRepositoryCatalogDataRequest extends S.Class<PutRepositoryCatalogDataRequest>(
  "PutRepositoryCatalogDataRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    catalogData: RepositoryCatalogDataInput,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetRepositoryPolicyRequest extends S.Class<SetRepositoryPolicyRequest>(
  "SetRepositoryPolicyRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    policyText: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UploadLayerPartRequest extends S.Class<UploadLayerPartRequest>(
  "UploadLayerPartRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    uploadId: S.String,
    partFirstByte: S.Number,
    partLastByte: S.Number,
    layerPartBlob: T.Blob,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Repository extends S.Class<Repository>("Repository")({
  repositoryArn: S.optional(S.String),
  registryId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  repositoryUri: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RepositoryList = S.Array(Repository);
export class AuthorizationData extends S.Class<AuthorizationData>(
  "AuthorizationData",
)({
  authorizationToken: S.optional(S.String),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RegistryCatalogData extends S.Class<RegistryCatalogData>(
  "RegistryCatalogData",
)({ displayName: S.optional(S.String) }) {}
export class BatchDeleteImageRequest extends S.Class<BatchDeleteImageRequest>(
  "BatchDeleteImageRequest",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: ImageIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompleteLayerUploadResponse extends S.Class<CompleteLayerUploadResponse>(
  "CompleteLayerUploadResponse",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    uploadId: S.optional(S.String),
    layerDigest: S.optional(S.String),
  },
  ns,
) {}
export class CreateRepositoryRequest extends S.Class<CreateRepositoryRequest>(
  "CreateRepositoryRequest",
)(
  {
    repositoryName: S.String,
    catalogData: S.optional(RepositoryCatalogDataInput),
    tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryPolicyResponse extends S.Class<DeleteRepositoryPolicyResponse>(
  "DeleteRepositoryPolicyResponse",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRepositoriesResponse extends S.Class<DescribeRepositoriesResponse>(
  "DescribeRepositoriesResponse",
)(
  { repositories: S.optional(RepositoryList), nextToken: S.optional(S.String) },
  ns,
) {}
export class GetAuthorizationTokenResponse extends S.Class<GetAuthorizationTokenResponse>(
  "GetAuthorizationTokenResponse",
)({ authorizationData: S.optional(AuthorizationData) }, ns) {}
export class GetRegistryCatalogDataResponse extends S.Class<GetRegistryCatalogDataResponse>(
  "GetRegistryCatalogDataResponse",
)({ registryCatalogData: RegistryCatalogData }, ns) {}
export class GetRepositoryPolicyResponse extends S.Class<GetRepositoryPolicyResponse>(
  "GetRepositoryPolicyResponse",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  },
  ns,
) {}
export class InitiateLayerUploadResponse extends S.Class<InitiateLayerUploadResponse>(
  "InitiateLayerUploadResponse",
)({ uploadId: S.optional(S.String), partSize: S.optional(S.Number) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }, ns) {}
export class PutRegistryCatalogDataResponse extends S.Class<PutRegistryCatalogDataResponse>(
  "PutRegistryCatalogDataResponse",
)({ registryCatalogData: RegistryCatalogData }, ns) {}
export class RepositoryCatalogData extends S.Class<RepositoryCatalogData>(
  "RepositoryCatalogData",
)({
  description: S.optional(S.String),
  architectures: S.optional(ArchitectureList),
  operatingSystems: S.optional(OperatingSystemList),
  logoUrl: S.optional(S.String),
  aboutText: S.optional(S.String),
  usageText: S.optional(S.String),
  marketplaceCertified: S.optional(S.Boolean),
}) {}
export class PutRepositoryCatalogDataResponse extends S.Class<PutRepositoryCatalogDataResponse>(
  "PutRepositoryCatalogDataResponse",
)({ catalogData: S.optional(RepositoryCatalogData) }, ns) {}
export class SetRepositoryPolicyResponse extends S.Class<SetRepositoryPolicyResponse>(
  "SetRepositoryPolicyResponse",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  },
  ns,
) {}
export class UploadLayerPartResponse extends S.Class<UploadLayerPartResponse>(
  "UploadLayerPartResponse",
)(
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    uploadId: S.optional(S.String),
    lastByteReceived: S.optional(S.Number),
  },
  ns,
) {}
export const ImageTagList = S.Array(S.String);
export class Layer extends S.Class<Layer>("Layer")({
  layerDigest: S.optional(S.String),
  layerAvailability: S.optional(S.String),
  layerSize: S.optional(S.Number),
  mediaType: S.optional(S.String),
}) {}
export const LayerList = S.Array(Layer);
export class LayerFailure extends S.Class<LayerFailure>("LayerFailure")({
  layerDigest: S.optional(S.String),
  failureCode: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export const LayerFailureList = S.Array(LayerFailure);
export class ImageDetail extends S.Class<ImageDetail>("ImageDetail")({
  registryId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  imageDigest: S.optional(S.String),
  imageTags: S.optional(ImageTagList),
  imageSizeInBytes: S.optional(S.Number),
  imagePushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  imageManifestMediaType: S.optional(S.String),
  artifactMediaType: S.optional(S.String),
}) {}
export const ImageDetailList = S.Array(ImageDetail);
export class Image extends S.Class<Image>("Image")({
  registryId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  imageId: S.optional(ImageIdentifier),
  imageManifest: S.optional(S.String),
  imageManifestMediaType: S.optional(S.String),
}) {}
export class BatchCheckLayerAvailabilityResponse extends S.Class<BatchCheckLayerAvailabilityResponse>(
  "BatchCheckLayerAvailabilityResponse",
)(
  { layers: S.optional(LayerList), failures: S.optional(LayerFailureList) },
  ns,
) {}
export class CreateRepositoryResponse extends S.Class<CreateRepositoryResponse>(
  "CreateRepositoryResponse",
)(
  {
    repository: S.optional(Repository),
    catalogData: S.optional(RepositoryCatalogData),
  },
  ns,
) {}
export class DeleteRepositoryResponse extends S.Class<DeleteRepositoryResponse>(
  "DeleteRepositoryResponse",
)({ repository: S.optional(Repository) }, ns) {}
export class DescribeImagesResponse extends S.Class<DescribeImagesResponse>(
  "DescribeImagesResponse",
)(
  {
    imageDetails: S.optional(ImageDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetRepositoryCatalogDataResponse extends S.Class<GetRepositoryCatalogDataResponse>(
  "GetRepositoryCatalogDataResponse",
)({ catalogData: S.optional(RepositoryCatalogData) }, ns) {}
export class PutImageResponse extends S.Class<PutImageResponse>(
  "PutImageResponse",
)({ image: S.optional(Image) }, ns) {}
export class ReferencedImageDetail extends S.Class<ReferencedImageDetail>(
  "ReferencedImageDetail",
)({
  imageDigest: S.optional(S.String),
  imageSizeInBytes: S.optional(S.Number),
  imagePushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  imageManifestMediaType: S.optional(S.String),
  artifactMediaType: S.optional(S.String),
}) {}
export class RegistryAlias extends S.Class<RegistryAlias>("RegistryAlias")({
  name: S.String,
  status: S.String,
  primaryRegistryAlias: S.Boolean,
  defaultRegistryAlias: S.Boolean,
}) {}
export const RegistryAliasList = S.Array(RegistryAlias);
export class ImageFailure extends S.Class<ImageFailure>("ImageFailure")({
  imageId: S.optional(ImageIdentifier),
  failureCode: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export const ImageFailureList = S.Array(ImageFailure);
export class ImageTagDetail extends S.Class<ImageTagDetail>("ImageTagDetail")({
  imageTag: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  imageDetail: S.optional(ReferencedImageDetail),
}) {}
export const ImageTagDetailList = S.Array(ImageTagDetail);
export class Registry extends S.Class<Registry>("Registry")({
  registryId: S.String,
  registryArn: S.String,
  registryUri: S.String,
  verified: S.Boolean,
  aliases: RegistryAliasList,
}) {}
export const RegistryList = S.Array(Registry);
export class BatchDeleteImageResponse extends S.Class<BatchDeleteImageResponse>(
  "BatchDeleteImageResponse",
)(
  {
    imageIds: S.optional(ImageIdentifierList),
    failures: S.optional(ImageFailureList),
  },
  ns,
) {}
export class DescribeImageTagsResponse extends S.Class<DescribeImageTagsResponse>(
  "DescribeImageTagsResponse",
)(
  {
    imageTagDetails: S.optional(ImageTagDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRegistriesResponse extends S.Class<DescribeRegistriesResponse>(
  "DescribeRegistriesResponse",
)({ registries: RegistryList, nextToken: S.optional(S.String) }, ns) {}

//# Errors
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class RepositoryNotFoundException extends S.TaggedError<RepositoryNotFoundException>()(
  "RepositoryNotFoundException",
  {},
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  {},
) {}
export class UnsupportedCommandException extends S.TaggedError<UnsupportedCommandException>()(
  "UnsupportedCommandException",
  {},
) {}
export class InvalidTagParameterException extends S.TaggedError<InvalidTagParameterException>()(
  "InvalidTagParameterException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}
export class RegistryNotFoundException extends S.TaggedError<RegistryNotFoundException>()(
  "RegistryNotFoundException",
  {},
) {}
export class EmptyUploadException extends S.TaggedError<EmptyUploadException>()(
  "EmptyUploadException",
  { message: S.optional(S.String) },
) {}
export class RepositoryPolicyNotFoundException extends S.TaggedError<RepositoryPolicyNotFoundException>()(
  "RepositoryPolicyNotFoundException",
  {},
) {}
export class InvalidLayerPartException extends S.TaggedError<InvalidLayerPartException>()(
  "InvalidLayerPartException",
  {
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    uploadId: S.optional(S.String),
    lastValidByteReceived: S.optional(S.Number),
    message: S.optional(S.String),
  },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class InvalidLayerException extends S.TaggedError<InvalidLayerException>()(
  "InvalidLayerException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNotEmptyException extends S.TaggedError<RepositoryNotEmptyException>()(
  "RepositoryNotEmptyException",
  { message: S.optional(S.String) },
) {}
export class ImageNotFoundException extends S.TaggedError<ImageNotFoundException>()(
  "ImageNotFoundException",
  { message: S.optional(S.String) },
) {}
export class RepositoryCatalogDataNotFoundException extends S.TaggedError<RepositoryCatalogDataNotFoundException>()(
  "RepositoryCatalogDataNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ImageAlreadyExistsException extends S.TaggedError<ImageAlreadyExistsException>()(
  "ImageAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class UploadNotFoundException extends S.TaggedError<UploadNotFoundException>()(
  "UploadNotFoundException",
  { message: S.optional(S.String) },
) {}
export class LayerAlreadyExistsException extends S.TaggedError<LayerAlreadyExistsException>()(
  "LayerAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class RepositoryAlreadyExistsException extends S.TaggedError<RepositoryAlreadyExistsException>()(
  "RepositoryAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ImageDigestDoesNotMatchException extends S.TaggedError<ImageDigestDoesNotMatchException>()(
  "ImageDigestDoesNotMatchException",
  { message: S.optional(S.String) },
) {}
export class LayerPartTooSmallException extends S.TaggedError<LayerPartTooSmallException>()(
  "LayerPartTooSmallException",
  { message: S.optional(S.String) },
) {}
export class ImageTagAlreadyExistsException extends S.TaggedError<ImageTagAlreadyExistsException>()(
  "ImageTagAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class LayersNotFoundException extends S.TaggedError<LayersNotFoundException>()(
  "LayersNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ReferencedImagesNotFoundException extends S.TaggedError<ReferencedImagesNotFoundException>()(
  "ReferencedImagesNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves catalog metadata for a public registry.
 */
export const getRegistryCatalogData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRegistryCatalogDataRequest,
    output: GetRegistryCatalogDataResponse,
    errors: [ServerException, UnsupportedCommandException],
  }),
);
/**
 * List the tags for an Amazon ECR Public resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Create or update the catalog data for a public registry.
 */
export const putRegistryCatalogData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRegistryCatalogDataRequest,
    output: PutRegistryCatalogDataResponse,
    errors: [
      InvalidParameterException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Creates or updates the catalog data for a repository in a public registry.
 */
export const putRepositoryCatalogData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRepositoryCatalogDataRequest,
    output: PutRepositoryCatalogDataResponse,
    errors: [
      InvalidParameterException,
      RepositoryNotFoundException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Applies a repository policy to the specified public repository to control access
 * permissions. For more information, see Amazon ECR Repository
 * Policies in the *Amazon Elastic Container Registry User Guide*.
 */
export const setRepositoryPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetRepositoryPolicyRequest,
  output: SetRepositoryPolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    RepositoryNotFoundException,
    ServerException,
    TooManyTagsException,
    UnsupportedCommandException,
  ],
}));
/**
 * Checks the availability of one or more image layers that are within a repository in a
 * public registry. When an image is pushed to a repository, each image layer is checked to
 * verify if it has been uploaded before. If it has been uploaded, then the image layer is
 * skipped.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const batchCheckLayerAvailability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchCheckLayerAvailabilityRequest,
    output: BatchCheckLayerAvailabilityResponse,
    errors: [
      InvalidParameterException,
      RegistryNotFoundException,
      RepositoryNotFoundException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Deletes the repository policy that's associated with the specified repository.
 */
export const deleteRepositoryPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRepositoryPolicyRequest,
    output: DeleteRepositoryPolicyResponse,
    errors: [
      InvalidParameterException,
      RepositoryNotFoundException,
      RepositoryPolicyNotFoundException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Describes repositories that are in a public registry.
 */
export const describeRepositories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRepositoriesRequest,
    output: DescribeRepositoriesResponse,
    errors: [
      InvalidParameterException,
      RepositoryNotFoundException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Retrieves an authorization token. An authorization token represents your IAM
 * authentication credentials. You can use it to access any Amazon ECR registry that your IAM
 * principal has access to. The authorization token is valid for 12 hours. This API requires
 * the `ecr-public:GetAuthorizationToken` and
 * `sts:GetServiceBearerToken` permissions.
 */
export const getAuthorizationToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAuthorizationTokenRequest,
    output: GetAuthorizationTokenResponse,
    errors: [
      InvalidParameterException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Retrieves the repository policy for the specified repository.
 */
export const getRepositoryPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryPolicyRequest,
  output: GetRepositoryPolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    RepositoryPolicyNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Notifies Amazon ECR that you intend to upload an image layer.
 *
 * When an image is pushed, the InitiateLayerUpload API is called once for each image layer
 * that hasn't already been uploaded. Whether an image layer uploads is determined by the
 * BatchCheckLayerAvailability API action.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const initiateLayerUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateLayerUploadRequest,
  output: InitiateLayerUploadResponse,
  errors: [
    InvalidParameterException,
    RegistryNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource aren't specified in the request parameters, they aren't
 * changed. When a resource is deleted, the tags associated with that resource are also
 * deleted.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    RepositoryNotFoundException,
    ServerException,
    TooManyTagsException,
    UnsupportedCommandException,
  ],
}));
/**
 * Deletes a list of specified images that are within a repository in a public registry.
 * Images are specified with either an `imageTag` or
 * `imageDigest`.
 *
 * You can remove a tag from an image by specifying the image's tag in your request. When
 * you remove the last tag from an image, the image is deleted from your repository.
 *
 * You can completely delete an image (and all of its tags) by specifying the digest of the
 * image in your request.
 */
export const batchDeleteImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteImageRequest,
  output: BatchDeleteImageResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Deletes a repository in a public registry. If the repository contains images, you must
 * either manually delete all images in the repository or use the `force` option.
 * This option deletes all images on your behalf before deleting the repository.
 */
export const deleteRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryRequest,
  output: DeleteRepositoryResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotEmptyException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Returns metadata that's related to the images in a repository in a public
 * registry.
 *
 * Beginning with Docker version 1.9, the Docker client compresses image layers before
 * pushing them to a V2 Docker registry. The output of the `docker images`
 * command shows the uncompressed image size. Therefore, it might return a larger image
 * size than the image sizes that are returned by DescribeImages.
 */
export const describeImages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImagesRequest,
  output: DescribeImagesResponse,
  errors: [
    ImageNotFoundException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Returns the image tag details for a repository in a public registry.
 */
export const describeImageTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImageTagsRequest,
  output: DescribeImageTagsResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Returns details for a public registry.
 */
export const describeRegistries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRegistriesRequest,
  output: DescribeRegistriesResponse,
  errors: [
    InvalidParameterException,
    ServerException,
    UnsupportedCommandException,
  ],
}));
/**
 * Retrieve catalog metadata for a repository in a public registry. This metadata is
 * displayed publicly in the Amazon ECR Public Gallery.
 */
export const getRepositoryCatalogData = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRepositoryCatalogDataRequest,
    output: GetRepositoryCatalogDataResponse,
    errors: [
      InvalidParameterException,
      RepositoryCatalogDataNotFoundException,
      RepositoryNotFoundException,
      ServerException,
      UnsupportedCommandException,
    ],
  }),
);
/**
 * Uploads an image layer part to Amazon ECR.
 *
 * When an image is pushed, each new image layer is uploaded in parts. The maximum size of
 * each image layer part can be 20971520 bytes (about 20MB). The UploadLayerPart API is called
 * once for each new image layer part.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const uploadLayerPart = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadLayerPartRequest,
  output: UploadLayerPartResponse,
  errors: [
    InvalidLayerPartException,
    InvalidParameterException,
    LimitExceededException,
    RegistryNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
    UploadNotFoundException,
  ],
}));
/**
 * Creates a repository in a public registry. For more information, see Amazon ECR
 * repositories in the *Amazon Elastic Container Registry User Guide*.
 */
export const createRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryRequest,
  output: CreateRepositoryResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    LimitExceededException,
    RepositoryAlreadyExistsException,
    ServerException,
    TooManyTagsException,
    UnsupportedCommandException,
  ],
}));
/**
 * Informs Amazon ECR that the image layer upload is complete for a specified public registry,
 * repository name, and upload ID. You can optionally provide a `sha256` digest of
 * the image layer for data validation purposes.
 *
 * When an image is pushed, the CompleteLayerUpload API is called once for each new image
 * layer to verify that the upload is complete.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const completeLayerUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteLayerUploadRequest,
  output: CompleteLayerUploadResponse,
  errors: [
    EmptyUploadException,
    InvalidLayerException,
    InvalidParameterException,
    LayerAlreadyExistsException,
    LayerPartTooSmallException,
    RegistryNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
    UploadNotFoundException,
  ],
}));
/**
 * Creates or updates the image manifest and tags that are associated with an image.
 *
 * When an image is pushed and all new image layers have been uploaded, the PutImage API is
 * called once to create or update the image manifest and the tags that are associated with
 * the image.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const putImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutImageRequest,
  output: PutImageResponse,
  errors: [
    ImageAlreadyExistsException,
    ImageDigestDoesNotMatchException,
    ImageTagAlreadyExistsException,
    InvalidParameterException,
    LayersNotFoundException,
    LimitExceededException,
    ReferencedImagesNotFoundException,
    RegistryNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedCommandException,
  ],
}));

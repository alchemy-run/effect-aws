import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "signer",
  serviceShapeName: "WallabyService",
});
const auth = T.AwsAuthSigv4({ name: "signer" });
const ver = T.ServiceVersion("2017-08-25");
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
                        url: "https://signer-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://signer-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://signer.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://signer.{Region}.{PartitionResult#dnsSuffix}",
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
export const CertificateHashes = S.Array(S.String);
export const Statuses = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AddProfilePermissionRequest extends S.Class<AddProfilePermissionRequest>(
  "AddProfilePermissionRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    profileVersion: S.optional(S.String),
    action: S.String,
    principal: S.String,
    revisionId: S.optional(S.String),
    statementId: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/signing-profiles/{profileName}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSigningProfileRequest extends S.Class<CancelSigningProfileRequest>(
  "CancelSigningProfileRequest",
)(
  { profileName: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/signing-profiles/{profileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSigningProfileResponse extends S.Class<CancelSigningProfileResponse>(
  "CancelSigningProfileResponse",
)({}) {}
export class DescribeSigningJobRequest extends S.Class<DescribeSigningJobRequest>(
  "DescribeSigningJobRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/signing-jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRevocationStatusRequest extends S.Class<GetRevocationStatusRequest>(
  "GetRevocationStatusRequest",
)(
  {
    signatureTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("signatureTimestamp"),
    ),
    platformId: S.String.pipe(T.HttpQuery("platformId")),
    profileVersionArn: S.String.pipe(T.HttpQuery("profileVersionArn")),
    jobArn: S.String.pipe(T.HttpQuery("jobArn")),
    certificateHashes: CertificateHashes.pipe(T.HttpQuery("certificateHashes")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/revocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSigningPlatformRequest extends S.Class<GetSigningPlatformRequest>(
  "GetSigningPlatformRequest",
)(
  { platformId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/signing-platforms/{platformId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSigningProfileRequest extends S.Class<GetSigningProfileRequest>(
  "GetSigningProfileRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    profileOwner: S.optional(S.String).pipe(T.HttpQuery("profileOwner")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signing-profiles/{profileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProfilePermissionsRequest extends S.Class<ListProfilePermissionsRequest>(
  "ListProfilePermissionsRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/signing-profiles/{profileName}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSigningJobsRequest extends S.Class<ListSigningJobsRequest>(
  "ListSigningJobsRequest",
)(
  {
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    platformId: S.optional(S.String).pipe(T.HttpQuery("platformId")),
    requestedBy: S.optional(S.String).pipe(T.HttpQuery("requestedBy")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    isRevoked: S.optional(S.Boolean).pipe(T.HttpQuery("isRevoked")),
    signatureExpiresBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("signatureExpiresBefore")),
    signatureExpiresAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("signatureExpiresAfter")),
    jobInvoker: S.optional(S.String).pipe(T.HttpQuery("jobInvoker")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signing-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSigningPlatformsRequest extends S.Class<ListSigningPlatformsRequest>(
  "ListSigningPlatformsRequest",
)(
  {
    category: S.optional(S.String).pipe(T.HttpQuery("category")),
    partner: S.optional(S.String).pipe(T.HttpQuery("partner")),
    target: S.optional(S.String).pipe(T.HttpQuery("target")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signing-platforms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSigningProfilesRequest extends S.Class<ListSigningProfilesRequest>(
  "ListSigningProfilesRequest",
)(
  {
    includeCanceled: S.optional(S.Boolean).pipe(T.HttpQuery("includeCanceled")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    platformId: S.optional(S.String).pipe(T.HttpQuery("platformId")),
    statuses: S.optional(Statuses).pipe(T.HttpQuery("statuses")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/signing-profiles" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveProfilePermissionRequest extends S.Class<RemoveProfilePermissionRequest>(
  "RemoveProfilePermissionRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    revisionId: S.String.pipe(T.HttpQuery("revisionId")),
    statementId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/signing-profiles/{profileName}/permissions/{statementId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeSignatureRequest extends S.Class<RevokeSignatureRequest>(
  "RevokeSignatureRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    jobOwner: S.optional(S.String),
    reason: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/signing-jobs/{jobId}/revoke" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeSignatureResponse extends S.Class<RevokeSignatureResponse>(
  "RevokeSignatureResponse",
)({}) {}
export class RevokeSigningProfileRequest extends S.Class<RevokeSigningProfileRequest>(
  "RevokeSigningProfileRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    profileVersion: S.String,
    reason: S.String,
    effectiveTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/signing-profiles/{profileName}/revoke" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeSigningProfileResponse extends S.Class<RevokeSigningProfileResponse>(
  "RevokeSigningProfileResponse",
)({}) {}
export class SignPayloadRequest extends S.Class<SignPayloadRequest>(
  "SignPayloadRequest",
)(
  {
    profileName: S.String,
    profileOwner: S.optional(S.String),
    payload: T.Blob,
    payloadFormat: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/signing-jobs/with-payload" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export const RevokedEntities = S.Array(S.String);
export class SigningMaterial extends S.Class<SigningMaterial>(
  "SigningMaterial",
)({ certificateArn: S.String }) {}
export class SignatureValidityPeriod extends S.Class<SignatureValidityPeriod>(
  "SignatureValidityPeriod",
)({ value: S.optional(S.Number), type: S.optional(S.String) }) {}
export const SigningParameters = S.Record({ key: S.String, value: S.String });
export class AddProfilePermissionResponse extends S.Class<AddProfilePermissionResponse>(
  "AddProfilePermissionResponse",
)({ revisionId: S.optional(S.String) }) {}
export class GetRevocationStatusResponse extends S.Class<GetRevocationStatusResponse>(
  "GetRevocationStatusResponse",
)({ revokedEntities: S.optional(RevokedEntities) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class RemoveProfilePermissionResponse extends S.Class<RemoveProfilePermissionResponse>(
  "RemoveProfilePermissionResponse",
)({ revisionId: S.optional(S.String) }) {}
export const ImageFormats = S.Array(S.String);
export class SigningConfigurationOverrides extends S.Class<SigningConfigurationOverrides>(
  "SigningConfigurationOverrides",
)({
  encryptionAlgorithm: S.optional(S.String),
  hashAlgorithm: S.optional(S.String),
}) {}
export class S3Source extends S.Class<S3Source>("S3Source")({
  bucketName: S.String,
  key: S.String,
  version: S.String,
}) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  bucketName: S.optional(S.String),
  prefix: S.optional(S.String),
}) {}
export class SigningJobRevocationRecord extends S.Class<SigningJobRevocationRecord>(
  "SigningJobRevocationRecord",
)({
  reason: S.optional(S.String),
  revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  revokedBy: S.optional(S.String),
}) {}
export class SigningImageFormat extends S.Class<SigningImageFormat>(
  "SigningImageFormat",
)({ supportedFormats: ImageFormats, defaultFormat: S.String }) {}
export class SigningProfileRevocationRecord extends S.Class<SigningProfileRevocationRecord>(
  "SigningProfileRevocationRecord",
)({
  revocationEffectiveFrom: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  revokedBy: S.optional(S.String),
}) {}
export class Permission extends S.Class<Permission>("Permission")({
  action: S.optional(S.String),
  principal: S.optional(S.String),
  statementId: S.optional(S.String),
  profileVersion: S.optional(S.String),
}) {}
export const Permissions = S.Array(Permission);
export class Source extends S.Class<Source>("Source")({
  s3: S.optional(S3Source),
}) {}
export class S3SignedObject extends S.Class<S3SignedObject>("S3SignedObject")({
  bucketName: S.optional(S.String),
  key: S.optional(S.String),
}) {}
export class SignedObject extends S.Class<SignedObject>("SignedObject")({
  s3: S.optional(S3SignedObject),
}) {}
export class SigningJob extends S.Class<SigningJob>("SigningJob")({
  jobId: S.optional(S.String),
  source: S.optional(Source),
  signedObject: S.optional(SignedObject),
  signingMaterial: S.optional(SigningMaterial),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  isRevoked: S.optional(S.Boolean),
  profileName: S.optional(S.String),
  profileVersion: S.optional(S.String),
  platformId: S.optional(S.String),
  platformDisplayName: S.optional(S.String),
  signatureExpiresAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  jobOwner: S.optional(S.String),
  jobInvoker: S.optional(S.String),
}) {}
export const SigningJobs = S.Array(SigningJob);
export const EncryptionAlgorithms = S.Array(S.String);
export class EncryptionAlgorithmOptions extends S.Class<EncryptionAlgorithmOptions>(
  "EncryptionAlgorithmOptions",
)({ allowedValues: EncryptionAlgorithms, defaultValue: S.String }) {}
export const HashAlgorithms = S.Array(S.String);
export class HashAlgorithmOptions extends S.Class<HashAlgorithmOptions>(
  "HashAlgorithmOptions",
)({ allowedValues: HashAlgorithms, defaultValue: S.String }) {}
export class SigningConfiguration extends S.Class<SigningConfiguration>(
  "SigningConfiguration",
)({
  encryptionAlgorithmOptions: EncryptionAlgorithmOptions,
  hashAlgorithmOptions: HashAlgorithmOptions,
}) {}
export class SigningPlatform extends S.Class<SigningPlatform>(
  "SigningPlatform",
)({
  platformId: S.optional(S.String),
  displayName: S.optional(S.String),
  partner: S.optional(S.String),
  target: S.optional(S.String),
  category: S.optional(S.String),
  signingConfiguration: S.optional(SigningConfiguration),
  signingImageFormat: S.optional(SigningImageFormat),
  maxSizeInMB: S.optional(S.Number),
  revocationSupported: S.optional(S.Boolean),
}) {}
export const SigningPlatforms = S.Array(SigningPlatform);
export class SigningProfile extends S.Class<SigningProfile>("SigningProfile")({
  profileName: S.optional(S.String),
  profileVersion: S.optional(S.String),
  profileVersionArn: S.optional(S.String),
  signingMaterial: S.optional(SigningMaterial),
  signatureValidityPeriod: S.optional(SignatureValidityPeriod),
  platformId: S.optional(S.String),
  platformDisplayName: S.optional(S.String),
  signingParameters: S.optional(SigningParameters),
  status: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const SigningProfiles = S.Array(SigningProfile);
export class SigningPlatformOverrides extends S.Class<SigningPlatformOverrides>(
  "SigningPlatformOverrides",
)({
  signingConfiguration: S.optional(SigningConfigurationOverrides),
  signingImageFormat: S.optional(S.String),
}) {}
export const Metadata = S.Record({ key: S.String, value: S.String });
export class Destination extends S.Class<Destination>("Destination")({
  s3: S.optional(S3Destination),
}) {}
export class GetSigningProfileResponse extends S.Class<GetSigningProfileResponse>(
  "GetSigningProfileResponse",
)({
  profileName: S.optional(S.String),
  profileVersion: S.optional(S.String),
  profileVersionArn: S.optional(S.String),
  revocationRecord: S.optional(SigningProfileRevocationRecord),
  signingMaterial: S.optional(SigningMaterial),
  platformId: S.optional(S.String),
  platformDisplayName: S.optional(S.String),
  signatureValidityPeriod: S.optional(SignatureValidityPeriod),
  overrides: S.optional(SigningPlatformOverrides),
  signingParameters: S.optional(SigningParameters),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class ListProfilePermissionsResponse extends S.Class<ListProfilePermissionsResponse>(
  "ListProfilePermissionsResponse",
)({
  revisionId: S.optional(S.String),
  policySizeBytes: S.optional(S.Number),
  permissions: S.optional(Permissions),
  nextToken: S.optional(S.String),
}) {}
export class ListSigningJobsResponse extends S.Class<ListSigningJobsResponse>(
  "ListSigningJobsResponse",
)({ jobs: S.optional(SigningJobs), nextToken: S.optional(S.String) }) {}
export class ListSigningPlatformsResponse extends S.Class<ListSigningPlatformsResponse>(
  "ListSigningPlatformsResponse",
)({
  platforms: S.optional(SigningPlatforms),
  nextToken: S.optional(S.String),
}) {}
export class ListSigningProfilesResponse extends S.Class<ListSigningProfilesResponse>(
  "ListSigningProfilesResponse",
)({ profiles: S.optional(SigningProfiles), nextToken: S.optional(S.String) }) {}
export class PutSigningProfileRequest extends S.Class<PutSigningProfileRequest>(
  "PutSigningProfileRequest",
)(
  {
    profileName: S.String.pipe(T.HttpLabel()),
    signingMaterial: S.optional(SigningMaterial),
    signatureValidityPeriod: S.optional(SignatureValidityPeriod),
    platformId: S.String,
    overrides: S.optional(SigningPlatformOverrides),
    signingParameters: S.optional(SigningParameters),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/signing-profiles/{profileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SignPayloadResponse extends S.Class<SignPayloadResponse>(
  "SignPayloadResponse",
)({
  jobId: S.optional(S.String),
  jobOwner: S.optional(S.String),
  metadata: S.optional(Metadata),
  signature: S.optional(T.Blob),
}) {}
export class StartSigningJobRequest extends S.Class<StartSigningJobRequest>(
  "StartSigningJobRequest",
)(
  {
    source: Source,
    destination: Destination,
    profileName: S.String,
    clientRequestToken: S.String,
    profileOwner: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/signing-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSigningJobResponse extends S.Class<DescribeSigningJobResponse>(
  "DescribeSigningJobResponse",
)({
  jobId: S.optional(S.String),
  source: S.optional(Source),
  signingMaterial: S.optional(SigningMaterial),
  platformId: S.optional(S.String),
  platformDisplayName: S.optional(S.String),
  profileName: S.optional(S.String),
  profileVersion: S.optional(S.String),
  overrides: S.optional(SigningPlatformOverrides),
  signingParameters: S.optional(SigningParameters),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  signatureExpiresAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  requestedBy: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  revocationRecord: S.optional(SigningJobRevocationRecord),
  signedObject: S.optional(SignedObject),
  jobOwner: S.optional(S.String),
  jobInvoker: S.optional(S.String),
}) {}
export class GetSigningPlatformResponse extends S.Class<GetSigningPlatformResponse>(
  "GetSigningPlatformResponse",
)({
  platformId: S.optional(S.String),
  displayName: S.optional(S.String),
  partner: S.optional(S.String),
  target: S.optional(S.String),
  category: S.optional(S.String),
  signingConfiguration: S.optional(SigningConfiguration),
  signingImageFormat: S.optional(SigningImageFormat),
  maxSizeInMB: S.optional(S.Number),
  revocationSupported: S.optional(S.Boolean),
}) {}
export class PutSigningProfileResponse extends S.Class<PutSigningProfileResponse>(
  "PutSigningProfileResponse",
)({
  arn: S.optional(S.String),
  profileVersion: S.optional(S.String),
  profileVersionArn: S.optional(S.String),
}) {}
export class StartSigningJobResponse extends S.Class<StartSigningJobResponse>(
  "StartSigningJobResponse",
)({ jobId: S.optional(S.String), jobOwner: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  { message: S.optional(S.String), code: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String), code: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of the tags associated with a signing profile resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes cross-account permissions from a signing profile.
 */
export const removeProfilePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveProfilePermissionRequest,
    output: RemoveProfilePermissionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Changes the state of a signing job to `REVOKED`. This indicates that the signature is no
 * longer valid.
 */
export const revokeSignature = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeSignatureRequest,
  output: RevokeSignatureResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Changes the state of a signing profile to `REVOKED`. This indicates that signatures
 * generated using the signing profile after an effective start date are no longer
 * valid. A revoked profile is still viewable with the `ListSigningProfiles`
 * operation, but it cannot perform new signing jobs. See Data Retention
 * for more information on scheduled deletion of a revoked signing profile.
 */
export const revokeSigningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RevokeSigningProfileRequest,
    output: RevokeSigningProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Adds one or more tags to a signing profile. Tags are labels that you can use to
 * identify and organize your AWS resources. Each tag consists of a key and an optional
 * value. To specify the signing profile, use its Amazon Resource Name (ARN). To specify
 * the tag, use a key-value pair.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes one or more tags from a signing profile. To remove the tags, specify a list of
 * tag keys.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Changes the state of an `ACTIVE` signing profile to `CANCELED`.
 * A canceled profile is still viewable with the `ListSigningProfiles`
 * operation, but it cannot perform new signing jobs. See Data Retention for more information on scheduled deletion of a canceled signing profile.
 */
export const cancelSigningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelSigningProfileRequest,
    output: CancelSigningProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves the revocation status of one or more of the signing profile, signing job,
 * and signing certificate.
 */
export const getRevocationStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRevocationStatusRequest,
  output: GetRevocationStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Returns information on a specific signing profile.
 */
export const getSigningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSigningProfileRequest,
  output: GetSigningProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the cross-account permissions associated with a signing profile.
 */
export const listProfilePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProfilePermissionsRequest,
    output: ListProfilePermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all your signing jobs. You can use the `maxResults` parameter to limit the
 * number of signing jobs that are returned in the response. If additional jobs remain to
 * be listed, AWS Signer returns a `nextToken` value. Use this value in
 * subsequent calls to `ListSigningJobs` to fetch the remaining values. You can
 * continue calling `ListSigningJobs` with your `maxResults`
 * parameter and with new values that Signer returns in the `nextToken`
 * parameter until all of your signing jobs have been returned.
 */
export const listSigningJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSigningJobsRequest,
  output: ListSigningJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Lists all signing platforms available in AWS Signer that match the request parameters. If
 * additional jobs remain to be listed, Signer returns a `nextToken` value.
 * Use this value in subsequent calls to `ListSigningJobs` to fetch the
 * remaining values. You can continue calling `ListSigningJobs` with your
 * `maxResults` parameter and with new values that Signer returns in the
 * `nextToken` parameter until all of your signing jobs have been
 * returned.
 */
export const listSigningPlatforms = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSigningPlatformsRequest,
    output: ListSigningPlatformsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceErrorException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all available signing profiles in your AWS account. Returns only profiles with an
 * `ACTIVE` status unless the `includeCanceled` request field is
 * set to `true`. If additional jobs remain to be listed, AWS Signer returns a
 * `nextToken` value. Use this value in subsequent calls to
 * `ListSigningJobs` to fetch the remaining values. You can continue calling
 * `ListSigningJobs` with your `maxResults` parameter and with
 * new values that Signer returns in the `nextToken` parameter until all of
 * your signing jobs have been returned.
 */
export const listSigningProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSigningProfilesRequest,
  output: ListSigningProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Signs a binary payload and returns a signature envelope.
 */
export const signPayload = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignPayloadRequest,
  output: SignPayloadResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Adds cross-account permissions to a signing profile.
 */
export const addProfilePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddProfilePermissionRequest,
    output: AddProfilePermissionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceErrorException,
      ResourceNotFoundException,
      ServiceLimitExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Returns information about a specific code signing job. You specify the job by using the
 * `jobId` value that is returned by the StartSigningJob
 * operation.
 */
export const describeSigningJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSigningJobRequest,
  output: DescribeSigningJobResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information on a specific signing platform.
 */
export const getSigningPlatform = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSigningPlatformRequest,
  output: GetSigningPlatformResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a signing profile. A signing profile is a code-signing template that can be used to
 * carry out a pre-defined signing job.
 */
export const putSigningProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSigningProfileRequest,
  output: PutSigningProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Initiates a signing job to be performed on the code provided. Signing jobs are
 * viewable by the `ListSigningJobs` operation. Note the following requirements:
 *
 * - You must create an Amazon S3 source bucket. For more information, see Creating a Bucket in the
 * *Amazon S3 Getting Started Guide*.
 *
 * - Your S3 source bucket must be version enabled.
 *
 * - You must create an S3 destination bucket. AWS Signer uses your S3 destination bucket to
 * write your signed code.
 *
 * - You specify the name of the source and destination buckets when calling the
 * `StartSigningJob` operation.
 *
 * - You must ensure the S3 buckets are from the same Region as the signing profile. Cross-Region signing isn't supported.
 *
 * - You must also specify a request token that identifies your request to Signer.
 *
 * You can call the DescribeSigningJob and the ListSigningJobs actions after you call
 * `StartSigningJob`.
 *
 * For a Java example that shows how to use this action, see StartSigningJob.
 */
export const startSigningJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSigningJobRequest,
  output: StartSigningJobResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyRequestsException,
    ValidationException,
  ],
}));

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
  sdkId: "signer",
  serviceShapeName: "WallabyService",
});
const auth = T.AwsAuthSigv4({ name: "signer" });
const ver = T.ServiceVersion("2017-08-25");
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
              `https://signer-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://signer-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://signer.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://signer.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ProfileName = string;
export type ProfileVersion = string;
export type JobId = string;
export type PlatformId = string;
export type Arn = string;
export type AccountId = string;
export type RequestedBy = string;
export type MaxResults = number;
export type NextToken = string;
export type RevocationReasonString = string;
export type Payload = Uint8Array;
export type ClientRequestToken = string;
export type TagKey = string;
export type CertificateArn = string;
export type SigningParameterKey = string;
export type SigningParameterValue = string;
export type TagValue = string;
export type ErrorMessage = string;
export type ErrorCode = string;
export type DisplayName = string;
export type StatusReason = string;
export type MaxSizeInMB = number;
export type PolicySizeBytes = number;
export type BucketName = string;
export type Key = string;
export type Version = string;
export type Prefix = string;

//# Schemas
export type CertificateHashes = string[];
export const CertificateHashes = S.Array(S.String);
export type SigningStatus =
  | "InProgress"
  | "Failed"
  | "Succeeded"
  | (string & {});
export const SigningStatus = S.String;
export type SigningProfileStatus =
  | "Active"
  | "Canceled"
  | "Revoked"
  | (string & {});
export const SigningProfileStatus = S.String;
export type Statuses = SigningProfileStatus[];
export const Statuses = S.Array(SigningProfileStatus);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AddProfilePermissionRequest {
  profileName: string;
  profileVersion?: string;
  action: string;
  principal: string;
  revisionId?: string;
  statementId: string;
}
export const AddProfilePermissionRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    profileVersion: S.optional(S.String),
    action: S.String,
    principal: S.String,
    revisionId: S.optional(S.String),
    statementId: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AddProfilePermissionRequest",
}) as any as S.Schema<AddProfilePermissionRequest>;
export interface CancelSigningProfileRequest {
  profileName: string;
}
export const CancelSigningProfileRequest = S.suspend(() =>
  S.Struct({ profileName: S.String.pipe(T.HttpLabel("profileName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/signing-profiles/{profileName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelSigningProfileRequest",
}) as any as S.Schema<CancelSigningProfileRequest>;
export interface CancelSigningProfileResponse {}
export const CancelSigningProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelSigningProfileResponse",
}) as any as S.Schema<CancelSigningProfileResponse>;
export interface DescribeSigningJobRequest {
  jobId: string;
}
export const DescribeSigningJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String.pipe(T.HttpLabel("jobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSigningJobRequest",
}) as any as S.Schema<DescribeSigningJobRequest>;
export interface GetRevocationStatusRequest {
  signatureTimestamp: Date;
  platformId: string;
  profileVersionArn: string;
  jobArn: string;
  certificateHashes: string[];
}
export const GetRevocationStatusRequest = S.suspend(() =>
  S.Struct({
    signatureTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("signatureTimestamp"),
    ),
    platformId: S.String.pipe(T.HttpQuery("platformId")),
    profileVersionArn: S.String.pipe(T.HttpQuery("profileVersionArn")),
    jobArn: S.String.pipe(T.HttpQuery("jobArn")),
    certificateHashes: CertificateHashes.pipe(T.HttpQuery("certificateHashes")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/revocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRevocationStatusRequest",
}) as any as S.Schema<GetRevocationStatusRequest>;
export interface GetSigningPlatformRequest {
  platformId: string;
}
export const GetSigningPlatformRequest = S.suspend(() =>
  S.Struct({ platformId: S.String.pipe(T.HttpLabel("platformId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-platforms/{platformId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSigningPlatformRequest",
}) as any as S.Schema<GetSigningPlatformRequest>;
export interface GetSigningProfileRequest {
  profileName: string;
  profileOwner?: string;
}
export const GetSigningProfileRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    profileOwner: S.optional(S.String).pipe(T.HttpQuery("profileOwner")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-profiles/{profileName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSigningProfileRequest",
}) as any as S.Schema<GetSigningProfileRequest>;
export interface ListProfilePermissionsRequest {
  profileName: string;
  nextToken?: string;
}
export const ListProfilePermissionsRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListProfilePermissionsRequest",
}) as any as S.Schema<ListProfilePermissionsRequest>;
export interface ListSigningJobsRequest {
  status?: SigningStatus;
  platformId?: string;
  requestedBy?: string;
  maxResults?: number;
  nextToken?: string;
  isRevoked?: boolean;
  signatureExpiresBefore?: Date;
  signatureExpiresAfter?: Date;
  jobInvoker?: string;
}
export const ListSigningJobsRequest = S.suspend(() =>
  S.Struct({
    status: S.optional(SigningStatus).pipe(T.HttpQuery("status")),
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
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSigningJobsRequest",
}) as any as S.Schema<ListSigningJobsRequest>;
export interface ListSigningPlatformsRequest {
  category?: string;
  partner?: string;
  target?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSigningPlatformsRequest = S.suspend(() =>
  S.Struct({
    category: S.optional(S.String).pipe(T.HttpQuery("category")),
    partner: S.optional(S.String).pipe(T.HttpQuery("partner")),
    target: S.optional(S.String).pipe(T.HttpQuery("target")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-platforms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSigningPlatformsRequest",
}) as any as S.Schema<ListSigningPlatformsRequest>;
export interface ListSigningProfilesRequest {
  includeCanceled?: boolean;
  maxResults?: number;
  nextToken?: string;
  platformId?: string;
  statuses?: SigningProfileStatus[];
}
export const ListSigningProfilesRequest = S.suspend(() =>
  S.Struct({
    includeCanceled: S.optional(S.Boolean).pipe(T.HttpQuery("includeCanceled")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    platformId: S.optional(S.String).pipe(T.HttpQuery("platformId")),
    statuses: S.optional(Statuses).pipe(T.HttpQuery("statuses")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/signing-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSigningProfilesRequest",
}) as any as S.Schema<ListSigningProfilesRequest>;
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
export interface RemoveProfilePermissionRequest {
  profileName: string;
  revisionId: string;
  statementId: string;
}
export const RemoveProfilePermissionRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    revisionId: S.String.pipe(T.HttpQuery("revisionId")),
    statementId: S.String.pipe(T.HttpLabel("statementId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveProfilePermissionRequest",
}) as any as S.Schema<RemoveProfilePermissionRequest>;
export interface RevokeSignatureRequest {
  jobId: string;
  jobOwner?: string;
  reason: string;
}
export const RevokeSignatureRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    jobOwner: S.optional(S.String),
    reason: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/signing-jobs/{jobId}/revoke" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeSignatureRequest",
}) as any as S.Schema<RevokeSignatureRequest>;
export interface RevokeSignatureResponse {}
export const RevokeSignatureResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RevokeSignatureResponse",
}) as any as S.Schema<RevokeSignatureResponse>;
export interface RevokeSigningProfileRequest {
  profileName: string;
  profileVersion: string;
  reason: string;
  effectiveTime: Date;
}
export const RevokeSigningProfileRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    profileVersion: S.String,
    reason: S.String,
    effectiveTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/signing-profiles/{profileName}/revoke" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeSigningProfileRequest",
}) as any as S.Schema<RevokeSigningProfileRequest>;
export interface RevokeSigningProfileResponse {}
export const RevokeSigningProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RevokeSigningProfileResponse",
}) as any as S.Schema<RevokeSigningProfileResponse>;
export interface SignPayloadRequest {
  profileName: string;
  profileOwner?: string;
  payload: Uint8Array;
  payloadFormat: string;
}
export const SignPayloadRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String,
    profileOwner: S.optional(S.String),
    payload: T.Blob,
    payloadFormat: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/signing-jobs/with-payload" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SignPayloadRequest",
}) as any as S.Schema<SignPayloadRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
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
export type ValidityType = "DAYS" | "MONTHS" | "YEARS" | (string & {});
export const ValidityType = S.String;
export type ImageFormat =
  | "JSON"
  | "JSONEmbedded"
  | "JSONDetached"
  | (string & {});
export const ImageFormat = S.String;
export type RevokedEntities = string[];
export const RevokedEntities = S.Array(S.String);
export type Category = "AWSIoT" | (string & {});
export const Category = S.String;
export interface SigningMaterial {
  certificateArn: string;
}
export const SigningMaterial = S.suspend(() =>
  S.Struct({ certificateArn: S.String }),
).annotations({
  identifier: "SigningMaterial",
}) as any as S.Schema<SigningMaterial>;
export interface SignatureValidityPeriod {
  value?: number;
  type?: ValidityType;
}
export const SignatureValidityPeriod = S.suspend(() =>
  S.Struct({ value: S.optional(S.Number), type: S.optional(ValidityType) }),
).annotations({
  identifier: "SignatureValidityPeriod",
}) as any as S.Schema<SignatureValidityPeriod>;
export type SigningParameters = { [key: string]: string | undefined };
export const SigningParameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type EncryptionAlgorithm = "RSA" | "ECDSA" | (string & {});
export const EncryptionAlgorithm = S.String;
export type HashAlgorithm = "SHA1" | "SHA256" | (string & {});
export const HashAlgorithm = S.String;
export interface AddProfilePermissionResponse {
  revisionId?: string;
}
export const AddProfilePermissionResponse = S.suspend(() =>
  S.Struct({ revisionId: S.optional(S.String) }),
).annotations({
  identifier: "AddProfilePermissionResponse",
}) as any as S.Schema<AddProfilePermissionResponse>;
export interface GetRevocationStatusResponse {
  revokedEntities?: string[];
}
export const GetRevocationStatusResponse = S.suspend(() =>
  S.Struct({ revokedEntities: S.optional(RevokedEntities) }),
).annotations({
  identifier: "GetRevocationStatusResponse",
}) as any as S.Schema<GetRevocationStatusResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RemoveProfilePermissionResponse {
  revisionId?: string;
}
export const RemoveProfilePermissionResponse = S.suspend(() =>
  S.Struct({ revisionId: S.optional(S.String) }),
).annotations({
  identifier: "RemoveProfilePermissionResponse",
}) as any as S.Schema<RemoveProfilePermissionResponse>;
export type ImageFormats = ImageFormat[];
export const ImageFormats = S.Array(ImageFormat);
export interface SigningConfigurationOverrides {
  encryptionAlgorithm?: EncryptionAlgorithm;
  hashAlgorithm?: HashAlgorithm;
}
export const SigningConfigurationOverrides = S.suspend(() =>
  S.Struct({
    encryptionAlgorithm: S.optional(EncryptionAlgorithm),
    hashAlgorithm: S.optional(HashAlgorithm),
  }),
).annotations({
  identifier: "SigningConfigurationOverrides",
}) as any as S.Schema<SigningConfigurationOverrides>;
export interface S3Source {
  bucketName: string;
  key: string;
  version: string;
}
export const S3Source = S.suspend(() =>
  S.Struct({ bucketName: S.String, key: S.String, version: S.String }),
).annotations({ identifier: "S3Source" }) as any as S.Schema<S3Source>;
export interface S3Destination {
  bucketName?: string;
  prefix?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface SigningJobRevocationRecord {
  reason?: string;
  revokedAt?: Date;
  revokedBy?: string;
}
export const SigningJobRevocationRecord = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    revokedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "SigningJobRevocationRecord",
}) as any as S.Schema<SigningJobRevocationRecord>;
export interface SigningImageFormat {
  supportedFormats: ImageFormat[];
  defaultFormat: ImageFormat;
}
export const SigningImageFormat = S.suspend(() =>
  S.Struct({ supportedFormats: ImageFormats, defaultFormat: ImageFormat }),
).annotations({
  identifier: "SigningImageFormat",
}) as any as S.Schema<SigningImageFormat>;
export interface SigningProfileRevocationRecord {
  revocationEffectiveFrom?: Date;
  revokedAt?: Date;
  revokedBy?: string;
}
export const SigningProfileRevocationRecord = S.suspend(() =>
  S.Struct({
    revocationEffectiveFrom: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    revokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    revokedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "SigningProfileRevocationRecord",
}) as any as S.Schema<SigningProfileRevocationRecord>;
export interface Permission {
  action?: string;
  principal?: string;
  statementId?: string;
  profileVersion?: string;
}
export const Permission = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    principal: S.optional(S.String),
    statementId: S.optional(S.String),
    profileVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Permission" }) as any as S.Schema<Permission>;
export type Permissions = Permission[];
export const Permissions = S.Array(Permission);
export interface Source {
  s3?: S3Source;
}
export const Source = S.suspend(() =>
  S.Struct({ s3: S.optional(S3Source) }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export interface S3SignedObject {
  bucketName?: string;
  key?: string;
}
export const S3SignedObject = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), key: S.optional(S.String) }),
).annotations({
  identifier: "S3SignedObject",
}) as any as S.Schema<S3SignedObject>;
export interface SignedObject {
  s3?: S3SignedObject;
}
export const SignedObject = S.suspend(() =>
  S.Struct({ s3: S.optional(S3SignedObject) }),
).annotations({ identifier: "SignedObject" }) as any as S.Schema<SignedObject>;
export interface SigningJob {
  jobId?: string;
  source?: Source;
  signedObject?: SignedObject;
  signingMaterial?: SigningMaterial;
  createdAt?: Date;
  status?: SigningStatus;
  isRevoked?: boolean;
  profileName?: string;
  profileVersion?: string;
  platformId?: string;
  platformDisplayName?: string;
  signatureExpiresAt?: Date;
  jobOwner?: string;
  jobInvoker?: string;
}
export const SigningJob = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    source: S.optional(Source),
    signedObject: S.optional(SignedObject),
    signingMaterial: S.optional(SigningMaterial),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(SigningStatus),
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
  }),
).annotations({ identifier: "SigningJob" }) as any as S.Schema<SigningJob>;
export type SigningJobs = SigningJob[];
export const SigningJobs = S.Array(SigningJob);
export type EncryptionAlgorithms = EncryptionAlgorithm[];
export const EncryptionAlgorithms = S.Array(EncryptionAlgorithm);
export interface EncryptionAlgorithmOptions {
  allowedValues: EncryptionAlgorithm[];
  defaultValue: EncryptionAlgorithm;
}
export const EncryptionAlgorithmOptions = S.suspend(() =>
  S.Struct({
    allowedValues: EncryptionAlgorithms,
    defaultValue: EncryptionAlgorithm,
  }),
).annotations({
  identifier: "EncryptionAlgorithmOptions",
}) as any as S.Schema<EncryptionAlgorithmOptions>;
export type HashAlgorithms = HashAlgorithm[];
export const HashAlgorithms = S.Array(HashAlgorithm);
export interface HashAlgorithmOptions {
  allowedValues: HashAlgorithm[];
  defaultValue: HashAlgorithm;
}
export const HashAlgorithmOptions = S.suspend(() =>
  S.Struct({ allowedValues: HashAlgorithms, defaultValue: HashAlgorithm }),
).annotations({
  identifier: "HashAlgorithmOptions",
}) as any as S.Schema<HashAlgorithmOptions>;
export interface SigningConfiguration {
  encryptionAlgorithmOptions: EncryptionAlgorithmOptions;
  hashAlgorithmOptions: HashAlgorithmOptions;
}
export const SigningConfiguration = S.suspend(() =>
  S.Struct({
    encryptionAlgorithmOptions: EncryptionAlgorithmOptions,
    hashAlgorithmOptions: HashAlgorithmOptions,
  }),
).annotations({
  identifier: "SigningConfiguration",
}) as any as S.Schema<SigningConfiguration>;
export interface SigningPlatform {
  platformId?: string;
  displayName?: string;
  partner?: string;
  target?: string;
  category?: Category;
  signingConfiguration?: SigningConfiguration;
  signingImageFormat?: SigningImageFormat;
  maxSizeInMB?: number;
  revocationSupported?: boolean;
}
export const SigningPlatform = S.suspend(() =>
  S.Struct({
    platformId: S.optional(S.String),
    displayName: S.optional(S.String),
    partner: S.optional(S.String),
    target: S.optional(S.String),
    category: S.optional(Category),
    signingConfiguration: S.optional(SigningConfiguration),
    signingImageFormat: S.optional(SigningImageFormat),
    maxSizeInMB: S.optional(S.Number),
    revocationSupported: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SigningPlatform",
}) as any as S.Schema<SigningPlatform>;
export type SigningPlatforms = SigningPlatform[];
export const SigningPlatforms = S.Array(SigningPlatform);
export interface SigningProfile {
  profileName?: string;
  profileVersion?: string;
  profileVersionArn?: string;
  signingMaterial?: SigningMaterial;
  signatureValidityPeriod?: SignatureValidityPeriod;
  platformId?: string;
  platformDisplayName?: string;
  signingParameters?: { [key: string]: string | undefined };
  status?: SigningProfileStatus;
  arn?: string;
  tags?: { [key: string]: string | undefined };
}
export const SigningProfile = S.suspend(() =>
  S.Struct({
    profileName: S.optional(S.String),
    profileVersion: S.optional(S.String),
    profileVersionArn: S.optional(S.String),
    signingMaterial: S.optional(SigningMaterial),
    signatureValidityPeriod: S.optional(SignatureValidityPeriod),
    platformId: S.optional(S.String),
    platformDisplayName: S.optional(S.String),
    signingParameters: S.optional(SigningParameters),
    status: S.optional(SigningProfileStatus),
    arn: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "SigningProfile",
}) as any as S.Schema<SigningProfile>;
export type SigningProfiles = SigningProfile[];
export const SigningProfiles = S.Array(SigningProfile);
export interface SigningPlatformOverrides {
  signingConfiguration?: SigningConfigurationOverrides;
  signingImageFormat?: ImageFormat;
}
export const SigningPlatformOverrides = S.suspend(() =>
  S.Struct({
    signingConfiguration: S.optional(SigningConfigurationOverrides),
    signingImageFormat: S.optional(ImageFormat),
  }),
).annotations({
  identifier: "SigningPlatformOverrides",
}) as any as S.Schema<SigningPlatformOverrides>;
export type Metadata = { [key: string]: string | undefined };
export const Metadata = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Destination {
  s3?: S3Destination;
}
export const Destination = S.suspend(() =>
  S.Struct({ s3: S.optional(S3Destination) }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface GetSigningProfileResponse {
  profileName?: string;
  profileVersion?: string;
  profileVersionArn?: string;
  revocationRecord?: SigningProfileRevocationRecord;
  signingMaterial?: SigningMaterial;
  platformId?: string;
  platformDisplayName?: string;
  signatureValidityPeriod?: SignatureValidityPeriod;
  overrides?: SigningPlatformOverrides;
  signingParameters?: { [key: string]: string | undefined };
  status?: SigningProfileStatus;
  statusReason?: string;
  arn?: string;
  tags?: { [key: string]: string | undefined };
}
export const GetSigningProfileResponse = S.suspend(() =>
  S.Struct({
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
    status: S.optional(SigningProfileStatus),
    statusReason: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetSigningProfileResponse",
}) as any as S.Schema<GetSigningProfileResponse>;
export interface ListProfilePermissionsResponse {
  revisionId?: string;
  policySizeBytes?: number;
  permissions?: Permission[];
  nextToken?: string;
}
export const ListProfilePermissionsResponse = S.suspend(() =>
  S.Struct({
    revisionId: S.optional(S.String),
    policySizeBytes: S.optional(S.Number),
    permissions: S.optional(Permissions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfilePermissionsResponse",
}) as any as S.Schema<ListProfilePermissionsResponse>;
export interface ListSigningJobsResponse {
  jobs?: SigningJob[];
  nextToken?: string;
}
export const ListSigningJobsResponse = S.suspend(() =>
  S.Struct({ jobs: S.optional(SigningJobs), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSigningJobsResponse",
}) as any as S.Schema<ListSigningJobsResponse>;
export interface ListSigningPlatformsResponse {
  platforms?: SigningPlatform[];
  nextToken?: string;
}
export const ListSigningPlatformsResponse = S.suspend(() =>
  S.Struct({
    platforms: S.optional(SigningPlatforms),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSigningPlatformsResponse",
}) as any as S.Schema<ListSigningPlatformsResponse>;
export interface ListSigningProfilesResponse {
  profiles?: SigningProfile[];
  nextToken?: string;
}
export const ListSigningProfilesResponse = S.suspend(() =>
  S.Struct({
    profiles: S.optional(SigningProfiles),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSigningProfilesResponse",
}) as any as S.Schema<ListSigningProfilesResponse>;
export interface PutSigningProfileRequest {
  profileName: string;
  signingMaterial?: SigningMaterial;
  signatureValidityPeriod?: SignatureValidityPeriod;
  platformId: string;
  overrides?: SigningPlatformOverrides;
  signingParameters?: { [key: string]: string | undefined };
  tags?: { [key: string]: string | undefined };
}
export const PutSigningProfileRequest = S.suspend(() =>
  S.Struct({
    profileName: S.String.pipe(T.HttpLabel("profileName")),
    signingMaterial: S.optional(SigningMaterial),
    signatureValidityPeriod: S.optional(SignatureValidityPeriod),
    platformId: S.String,
    overrides: S.optional(SigningPlatformOverrides),
    signingParameters: S.optional(SigningParameters),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/signing-profiles/{profileName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSigningProfileRequest",
}) as any as S.Schema<PutSigningProfileRequest>;
export interface SignPayloadResponse {
  jobId?: string;
  jobOwner?: string;
  metadata?: { [key: string]: string | undefined };
  signature?: Uint8Array;
}
export const SignPayloadResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    jobOwner: S.optional(S.String),
    metadata: S.optional(Metadata),
    signature: S.optional(T.Blob),
  }),
).annotations({
  identifier: "SignPayloadResponse",
}) as any as S.Schema<SignPayloadResponse>;
export interface StartSigningJobRequest {
  source: Source;
  destination: Destination;
  profileName: string;
  clientRequestToken: string;
  profileOwner?: string;
}
export const StartSigningJobRequest = S.suspend(() =>
  S.Struct({
    source: Source,
    destination: Destination,
    profileName: S.String,
    clientRequestToken: S.String.pipe(T.IdempotencyToken()),
    profileOwner: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/signing-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSigningJobRequest",
}) as any as S.Schema<StartSigningJobRequest>;
export interface DescribeSigningJobResponse {
  jobId?: string;
  source?: Source;
  signingMaterial?: SigningMaterial;
  platformId?: string;
  platformDisplayName?: string;
  profileName?: string;
  profileVersion?: string;
  overrides?: SigningPlatformOverrides;
  signingParameters?: { [key: string]: string | undefined };
  createdAt?: Date;
  completedAt?: Date;
  signatureExpiresAt?: Date;
  requestedBy?: string;
  status?: SigningStatus;
  statusReason?: string;
  revocationRecord?: SigningJobRevocationRecord;
  signedObject?: SignedObject;
  jobOwner?: string;
  jobInvoker?: string;
}
export const DescribeSigningJobResponse = S.suspend(() =>
  S.Struct({
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
    status: S.optional(SigningStatus),
    statusReason: S.optional(S.String),
    revocationRecord: S.optional(SigningJobRevocationRecord),
    signedObject: S.optional(SignedObject),
    jobOwner: S.optional(S.String),
    jobInvoker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSigningJobResponse",
}) as any as S.Schema<DescribeSigningJobResponse>;
export interface GetSigningPlatformResponse {
  platformId?: string;
  displayName?: string;
  partner?: string;
  target?: string;
  category?: Category;
  signingConfiguration?: SigningConfiguration;
  signingImageFormat?: SigningImageFormat;
  maxSizeInMB?: number;
  revocationSupported?: boolean;
}
export const GetSigningPlatformResponse = S.suspend(() =>
  S.Struct({
    platformId: S.optional(S.String),
    displayName: S.optional(S.String),
    partner: S.optional(S.String),
    target: S.optional(S.String),
    category: S.optional(Category),
    signingConfiguration: S.optional(SigningConfiguration),
    signingImageFormat: S.optional(SigningImageFormat),
    maxSizeInMB: S.optional(S.Number),
    revocationSupported: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetSigningPlatformResponse",
}) as any as S.Schema<GetSigningPlatformResponse>;
export interface PutSigningProfileResponse {
  arn?: string;
  profileVersion?: string;
  profileVersionArn?: string;
}
export const PutSigningProfileResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    profileVersion: S.optional(S.String),
    profileVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutSigningProfileResponse",
}) as any as S.Schema<PutSigningProfileResponse>;
export interface StartSigningJobResponse {
  jobId?: string;
  jobOwner?: string;
}
export const StartSigningJobResponse = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String), jobOwner: S.optional(S.String) }),
).annotations({
  identifier: "StartSigningJobResponse",
}) as any as S.Schema<StartSigningJobResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Adds one or more tags to a signing profile. Tags are labels that you can use to
 * identify and organize your AWS resources. Each tag consists of a key and an optional
 * value. To specify the signing profile, use its Amazon Resource Name (ARN). To specify
 * the tag, use a key-value pair.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information on a specific signing profile.
 */
export const getSigningProfile: (
  input: GetSigningProfileRequest,
) => effect.Effect<
  GetSigningProfileResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all available signing profiles in your AWS account. Returns only profiles with an
 * `ACTIVE` status unless the `includeCanceled` request field is
 * set to `true`. If additional jobs remain to be listed, AWS Signer returns a
 * `nextToken` value. Use this value in subsequent calls to
 * `ListSigningJobs` to fetch the remaining values. You can continue calling
 * `ListSigningJobs` with your `maxResults` parameter and with
 * new values that Signer returns in the `nextToken` parameter until all of
 * your signing jobs have been returned.
 */
export const listSigningProfiles: {
  (
    input: ListSigningProfilesRequest,
  ): effect.Effect<
    ListSigningProfilesResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSigningProfilesRequest,
  ) => stream.Stream<
    ListSigningProfilesResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSigningProfilesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSigningProfilesRequest,
  output: ListSigningProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Changes the state of an `ACTIVE` signing profile to `CANCELED`.
 * A canceled profile is still viewable with the `ListSigningProfiles`
 * operation, but it cannot perform new signing jobs. See Data Retention for more information on scheduled deletion of a canceled signing profile.
 */
export const cancelSigningProfile: (
  input: CancelSigningProfileRequest,
) => effect.Effect<
  CancelSigningProfileResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSigningProfileRequest,
  output: CancelSigningProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns information about a specific code signing job. You specify the job by using the
 * `jobId` value that is returned by the StartSigningJob
 * operation.
 */
export const describeSigningJob: (
  input: DescribeSigningJobRequest,
) => effect.Effect<
  DescribeSigningJobResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSigningPlatform: (
  input: GetSigningPlatformRequest,
) => effect.Effect<
  GetSigningPlatformResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes one or more tags from a signing profile. To remove the tags, specify a list of
 * tag keys.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of the tags associated with a signing profile resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all your signing jobs. You can use the `maxResults` parameter to limit the
 * number of signing jobs that are returned in the response. If additional jobs remain to
 * be listed, AWS Signer returns a `nextToken` value. Use this value in
 * subsequent calls to `ListSigningJobs` to fetch the remaining values. You can
 * continue calling `ListSigningJobs` with your `maxResults`
 * parameter and with new values that Signer returns in the `nextToken`
 * parameter until all of your signing jobs have been returned.
 */
export const listSigningJobs: {
  (
    input: ListSigningJobsRequest,
  ): effect.Effect<
    ListSigningJobsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSigningJobsRequest,
  ) => stream.Stream<
    ListSigningJobsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSigningJobsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSigningJobsRequest,
  output: ListSigningJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
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
export const startSigningJob: (
  input: StartSigningJobRequest,
) => effect.Effect<
  StartSigningJobResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Adds cross-account permissions to a signing profile.
 */
export const addProfilePermission: (
  input: AddProfilePermissionRequest,
) => effect.Effect<
  AddProfilePermissionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | ServiceLimitExceededException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a signing profile. A signing profile is a code-signing template that can be used to
 * carry out a pre-defined signing job.
 */
export const putSigningProfile: (
  input: PutSigningProfileRequest,
) => effect.Effect<
  PutSigningProfileResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the cross-account permissions associated with a signing profile.
 */
export const listProfilePermissions: (
  input: ListProfilePermissionsRequest,
) => effect.Effect<
  ListProfilePermissionsResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProfilePermissionsRequest,
  output: ListProfilePermissionsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Removes cross-account permissions from a signing profile.
 */
export const removeProfilePermission: (
  input: RemoveProfilePermissionRequest,
) => effect.Effect<
  RemoveProfilePermissionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Signs a binary payload and returns a signature envelope.
 */
export const signPayload: (
  input: SignPayloadRequest,
) => effect.Effect<
  SignPayloadResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Changes the state of a signing job to `REVOKED`. This indicates that the signature is no
 * longer valid.
 */
export const revokeSignature: (
  input: RevokeSignatureRequest,
) => effect.Effect<
  RevokeSignatureResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const revokeSigningProfile: (
  input: RevokeSigningProfileRequest,
) => effect.Effect<
  RevokeSigningProfileResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | ResourceNotFoundException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeSigningProfileRequest,
  output: RevokeSigningProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    ResourceNotFoundException,
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
export const listSigningPlatforms: {
  (
    input: ListSigningPlatformsRequest,
  ): effect.Effect<
    ListSigningPlatformsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSigningPlatformsRequest,
  ) => stream.Stream<
    ListSigningPlatformsResponse,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSigningPlatformsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | TooManyRequestsException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSigningPlatformsRequest,
  output: ListSigningPlatformsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the revocation status of one or more of the signing profile, signing job,
 * and signing certificate.
 */
export const getRevocationStatus: (
  input: GetRevocationStatusRequest,
) => effect.Effect<
  GetRevocationStatusResponse,
  | AccessDeniedException
  | InternalServiceErrorException
  | TooManyRequestsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRevocationStatusRequest,
  output: GetRevocationStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    TooManyRequestsException,
    ValidationException,
  ],
}));

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
  sdkId: "ACM PCA",
  serviceShapeName: "ACMPrivateCA",
});
const auth = T.AwsAuthSigv4({ name: "acm-pca" });
const ver = T.ServiceVersion("2017-08-22");
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
              `https://acm-pca-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://acm-pca.${Region}.amazonaws.com`);
            }
            return e(
              `https://acm-pca-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://acm-pca.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://acm-pca.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IdempotencyToken = string;
export type Arn = string;
export type S3BucketName = string;
export type Principal = string;
export type AccountId = string;
export type PermanentDeletionTimeInDays = number;
export type AuditReportId = string;
export type CertificateBodyBlob = Uint8Array;
export type CertificateChainBlob = Uint8Array;
export type CsrBlob = Uint8Array;
export type MaxResults = number;
export type NextToken = string;
export type AWSPolicy = string;
export type String128 = string;
export type TagKey = string;
export type TagValue = string;
export type PositiveLong = number;
export type S3Key = string;
export type CertificateBody = string;
export type CertificateChain = string;
export type CsrBody = string;
export type CountryCodeString = string;
export type String64 = string;
export type ASN1PrintableString64 = string;
export type String40 = string;
export type String16 = string;
export type String5 = string;
export type String3 = string;
export type Integer1To5000 = number;
export type CnameString = string;
export type S3BucketName3To255 = string;
export type CrlPathString = string;
export type CustomObjectIdentifier = string;
export type String1To256 = string;
export type String256 = string;
export type String253 = string;
export type String39 = string;
export type Base64String1To4096 = string;

//# Schemas
export type CertificateAuthorityType = "ROOT" | "SUBORDINATE" | (string & {});
export const CertificateAuthorityType = S.String;
export type KeyStorageSecurityStandard =
  | "FIPS_140_2_LEVEL_2_OR_HIGHER"
  | "FIPS_140_2_LEVEL_3_OR_HIGHER"
  | "CCPC_LEVEL_1_OR_HIGHER"
  | (string & {});
export const KeyStorageSecurityStandard = S.String;
export type CertificateAuthorityUsageMode =
  | "GENERAL_PURPOSE"
  | "SHORT_LIVED_CERTIFICATE"
  | (string & {});
export const CertificateAuthorityUsageMode = S.String;
export type AuditReportResponseFormat = "JSON" | "CSV" | (string & {});
export const AuditReportResponseFormat = S.String;
export type ActionType =
  | "IssueCertificate"
  | "GetCertificate"
  | "ListPermissions"
  | (string & {});
export const ActionType = S.String;
export type ActionList = ActionType[];
export const ActionList = S.Array(ActionType);
export type SigningAlgorithm =
  | "SHA256WITHECDSA"
  | "SHA384WITHECDSA"
  | "SHA512WITHECDSA"
  | "SHA256WITHRSA"
  | "SHA384WITHRSA"
  | "SHA512WITHRSA"
  | "SM3WITHSM2"
  | "ML_DSA_44"
  | "ML_DSA_65"
  | "ML_DSA_87"
  | (string & {});
export const SigningAlgorithm = S.String;
export type ResourceOwner = "SELF" | "OTHER_ACCOUNTS" | (string & {});
export const ResourceOwner = S.String;
export type RevocationReason =
  | "UNSPECIFIED"
  | "KEY_COMPROMISE"
  | "CERTIFICATE_AUTHORITY_COMPROMISE"
  | "AFFILIATION_CHANGED"
  | "SUPERSEDED"
  | "CESSATION_OF_OPERATION"
  | "PRIVILEGE_WITHDRAWN"
  | "A_A_COMPROMISE"
  | (string & {});
export const RevocationReason = S.String;
export type CertificateAuthorityStatus =
  | "CREATING"
  | "PENDING_CERTIFICATE"
  | "ACTIVE"
  | "DELETED"
  | "DISABLED"
  | "EXPIRED"
  | "FAILED"
  | (string & {});
export const CertificateAuthorityStatus = S.String;
export interface CreateCertificateAuthorityAuditReportRequest {
  CertificateAuthorityArn: string;
  S3BucketName: string;
  AuditReportResponseFormat: AuditReportResponseFormat;
}
export const CreateCertificateAuthorityAuditReportRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    S3BucketName: S.String,
    AuditReportResponseFormat: AuditReportResponseFormat,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCertificateAuthorityAuditReportRequest",
}) as any as S.Schema<CreateCertificateAuthorityAuditReportRequest>;
export interface CreatePermissionRequest {
  CertificateAuthorityArn: string;
  Principal: string;
  SourceAccount?: string;
  Actions: ActionType[];
}
export const CreatePermissionRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    Principal: S.String,
    SourceAccount: S.optional(S.String),
    Actions: ActionList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePermissionRequest",
}) as any as S.Schema<CreatePermissionRequest>;
export interface CreatePermissionResponse {}
export const CreatePermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreatePermissionResponse",
}) as any as S.Schema<CreatePermissionResponse>;
export interface DeleteCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
  PermanentDeletionTimeInDays?: number;
}
export const DeleteCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    PermanentDeletionTimeInDays: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCertificateAuthorityRequest",
}) as any as S.Schema<DeleteCertificateAuthorityRequest>;
export interface DeleteCertificateAuthorityResponse {}
export const DeleteCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCertificateAuthorityResponse",
}) as any as S.Schema<DeleteCertificateAuthorityResponse>;
export interface DeletePermissionRequest {
  CertificateAuthorityArn: string;
  Principal: string;
  SourceAccount?: string;
}
export const DeletePermissionRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    Principal: S.String,
    SourceAccount: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePermissionRequest",
}) as any as S.Schema<DeletePermissionRequest>;
export interface DeletePermissionResponse {}
export const DeletePermissionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePermissionResponse",
}) as any as S.Schema<DeletePermissionResponse>;
export interface DeletePolicyRequest {
  ResourceArn: string;
}
export const DeletePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePolicyRequest",
}) as any as S.Schema<DeletePolicyRequest>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface DescribeCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
}
export const DescribeCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCertificateAuthorityRequest",
}) as any as S.Schema<DescribeCertificateAuthorityRequest>;
export interface DescribeCertificateAuthorityAuditReportRequest {
  CertificateAuthorityArn: string;
  AuditReportId: string;
}
export const DescribeCertificateAuthorityAuditReportRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String, AuditReportId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCertificateAuthorityAuditReportRequest",
}) as any as S.Schema<DescribeCertificateAuthorityAuditReportRequest>;
export interface GetCertificateRequest {
  CertificateAuthorityArn: string;
  CertificateArn: string;
}
export const GetCertificateRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    CertificateArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCertificateRequest",
}) as any as S.Schema<GetCertificateRequest>;
export interface GetCertificateAuthorityCertificateRequest {
  CertificateAuthorityArn: string;
}
export const GetCertificateAuthorityCertificateRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCertificateAuthorityCertificateRequest",
}) as any as S.Schema<GetCertificateAuthorityCertificateRequest>;
export interface GetCertificateAuthorityCsrRequest {
  CertificateAuthorityArn: string;
}
export const GetCertificateAuthorityCsrRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCertificateAuthorityCsrRequest",
}) as any as S.Schema<GetCertificateAuthorityCsrRequest>;
export interface GetPolicyRequest {
  ResourceArn: string;
}
export const GetPolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPolicyRequest",
}) as any as S.Schema<GetPolicyRequest>;
export interface ImportCertificateAuthorityCertificateRequest {
  CertificateAuthorityArn: string;
  Certificate: Uint8Array;
  CertificateChain?: Uint8Array;
}
export const ImportCertificateAuthorityCertificateRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    Certificate: T.Blob,
    CertificateChain: S.optional(T.Blob),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportCertificateAuthorityCertificateRequest",
}) as any as S.Schema<ImportCertificateAuthorityCertificateRequest>;
export interface ImportCertificateAuthorityCertificateResponse {}
export const ImportCertificateAuthorityCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ImportCertificateAuthorityCertificateResponse",
}) as any as S.Schema<ImportCertificateAuthorityCertificateResponse>;
export interface ListCertificateAuthoritiesRequest {
  MaxResults?: number;
  NextToken?: string;
  ResourceOwner?: ResourceOwner;
}
export const ListCertificateAuthoritiesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ResourceOwner: S.optional(ResourceOwner),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCertificateAuthoritiesRequest",
}) as any as S.Schema<ListCertificateAuthoritiesRequest>;
export interface ListPermissionsRequest {
  MaxResults?: number;
  NextToken?: string;
  CertificateAuthorityArn: string;
}
export const ListPermissionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    CertificateAuthorityArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPermissionsRequest",
}) as any as S.Schema<ListPermissionsRequest>;
export interface ListTagsRequest {
  MaxResults?: number;
  NextToken?: string;
  CertificateAuthorityArn: string;
}
export const ListTagsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    CertificateAuthorityArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface PutPolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutPolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutPolicyRequest",
}) as any as S.Schema<PutPolicyRequest>;
export interface PutPolicyResponse {}
export const PutPolicyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutPolicyResponse",
}) as any as S.Schema<PutPolicyResponse>;
export interface RestoreCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
}
export const RestoreCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreCertificateAuthorityRequest",
}) as any as S.Schema<RestoreCertificateAuthorityRequest>;
export interface RestoreCertificateAuthorityResponse {}
export const RestoreCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RestoreCertificateAuthorityResponse",
}) as any as S.Schema<RestoreCertificateAuthorityResponse>;
export interface RevokeCertificateRequest {
  CertificateAuthorityArn: string;
  CertificateSerial: string;
  RevocationReason: RevocationReason;
}
export const RevokeCertificateRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    CertificateSerial: S.String,
    RevocationReason: RevocationReason,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RevokeCertificateRequest",
}) as any as S.Schema<RevokeCertificateRequest>;
export interface RevokeCertificateResponse {}
export const RevokeCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RevokeCertificateResponse",
}) as any as S.Schema<RevokeCertificateResponse>;
export interface Tag {
  Key: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
  Tags: Tag[];
}
export const TagCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagCertificateAuthorityRequest",
}) as any as S.Schema<TagCertificateAuthorityRequest>;
export interface TagCertificateAuthorityResponse {}
export const TagCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TagCertificateAuthorityResponse",
}) as any as S.Schema<TagCertificateAuthorityResponse>;
export interface UntagCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
  Tags: Tag[];
}
export const UntagCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagCertificateAuthorityRequest",
}) as any as S.Schema<UntagCertificateAuthorityRequest>;
export interface UntagCertificateAuthorityResponse {}
export const UntagCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UntagCertificateAuthorityResponse",
}) as any as S.Schema<UntagCertificateAuthorityResponse>;
export type S3ObjectAcl =
  | "PUBLIC_READ"
  | "BUCKET_OWNER_FULL_CONTROL"
  | (string & {});
export const S3ObjectAcl = S.String;
export interface CrlDistributionPointExtensionConfiguration {
  OmitExtension: boolean;
}
export const CrlDistributionPointExtensionConfiguration = S.suspend(() =>
  S.Struct({ OmitExtension: S.Boolean }),
).annotations({
  identifier: "CrlDistributionPointExtensionConfiguration",
}) as any as S.Schema<CrlDistributionPointExtensionConfiguration>;
export type CrlType = "COMPLETE" | "PARTITIONED" | (string & {});
export const CrlType = S.String;
export interface CrlConfiguration {
  Enabled: boolean;
  ExpirationInDays?: number;
  CustomCname?: string;
  S3BucketName?: string;
  S3ObjectAcl?: S3ObjectAcl;
  CrlDistributionPointExtensionConfiguration?: CrlDistributionPointExtensionConfiguration;
  CrlType?: CrlType;
  CustomPath?: string;
}
export const CrlConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    ExpirationInDays: S.optional(S.Number),
    CustomCname: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3ObjectAcl: S.optional(S3ObjectAcl),
    CrlDistributionPointExtensionConfiguration: S.optional(
      CrlDistributionPointExtensionConfiguration,
    ),
    CrlType: S.optional(CrlType),
    CustomPath: S.optional(S.String),
  }),
).annotations({
  identifier: "CrlConfiguration",
}) as any as S.Schema<CrlConfiguration>;
export interface OcspConfiguration {
  Enabled: boolean;
  OcspCustomCname?: string;
}
export const OcspConfiguration = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, OcspCustomCname: S.optional(S.String) }),
).annotations({
  identifier: "OcspConfiguration",
}) as any as S.Schema<OcspConfiguration>;
export interface RevocationConfiguration {
  CrlConfiguration?: CrlConfiguration;
  OcspConfiguration?: OcspConfiguration;
}
export const RevocationConfiguration = S.suspend(() =>
  S.Struct({
    CrlConfiguration: S.optional(CrlConfiguration),
    OcspConfiguration: S.optional(OcspConfiguration),
  }),
).annotations({
  identifier: "RevocationConfiguration",
}) as any as S.Schema<RevocationConfiguration>;
export interface UpdateCertificateAuthorityRequest {
  CertificateAuthorityArn: string;
  RevocationConfiguration?: RevocationConfiguration;
  Status?: CertificateAuthorityStatus;
}
export const UpdateCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    RevocationConfiguration: S.optional(RevocationConfiguration),
    Status: S.optional(CertificateAuthorityStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCertificateAuthorityRequest",
}) as any as S.Schema<UpdateCertificateAuthorityRequest>;
export interface UpdateCertificateAuthorityResponse {}
export const UpdateCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCertificateAuthorityResponse",
}) as any as S.Schema<UpdateCertificateAuthorityResponse>;
export type KeyAlgorithm =
  | "RSA_2048"
  | "RSA_3072"
  | "RSA_4096"
  | "EC_prime256v1"
  | "EC_secp384r1"
  | "EC_secp521r1"
  | "ML_DSA_44"
  | "ML_DSA_65"
  | "ML_DSA_87"
  | "SM2"
  | (string & {});
export const KeyAlgorithm = S.String;
export type ValidityPeriodType =
  | "END_DATE"
  | "ABSOLUTE"
  | "DAYS"
  | "MONTHS"
  | "YEARS"
  | (string & {});
export const ValidityPeriodType = S.String;
export type AuditReportStatus =
  | "CREATING"
  | "SUCCESS"
  | "FAILED"
  | (string & {});
export const AuditReportStatus = S.String;
export interface Validity {
  Value: number;
  Type: ValidityPeriodType;
}
export const Validity = S.suspend(() =>
  S.Struct({ Value: S.Number, Type: ValidityPeriodType }),
).annotations({ identifier: "Validity" }) as any as S.Schema<Validity>;
export type FailureReason =
  | "REQUEST_TIMED_OUT"
  | "UNSUPPORTED_ALGORITHM"
  | "OTHER"
  | (string & {});
export const FailureReason = S.String;
export interface CustomAttribute {
  ObjectIdentifier: string;
  Value: string;
}
export const CustomAttribute = S.suspend(() =>
  S.Struct({ ObjectIdentifier: S.String, Value: S.String }),
).annotations({
  identifier: "CustomAttribute",
}) as any as S.Schema<CustomAttribute>;
export type CustomAttributeList = CustomAttribute[];
export const CustomAttributeList = S.Array(CustomAttribute);
export interface ASN1Subject {
  Country?: string;
  Organization?: string;
  OrganizationalUnit?: string;
  DistinguishedNameQualifier?: string;
  State?: string;
  CommonName?: string;
  SerialNumber?: string;
  Locality?: string;
  Title?: string;
  Surname?: string;
  GivenName?: string;
  Initials?: string;
  Pseudonym?: string;
  GenerationQualifier?: string;
  CustomAttributes?: CustomAttribute[];
}
export const ASN1Subject = S.suspend(() =>
  S.Struct({
    Country: S.optional(S.String),
    Organization: S.optional(S.String),
    OrganizationalUnit: S.optional(S.String),
    DistinguishedNameQualifier: S.optional(S.String),
    State: S.optional(S.String),
    CommonName: S.optional(S.String),
    SerialNumber: S.optional(S.String),
    Locality: S.optional(S.String),
    Title: S.optional(S.String),
    Surname: S.optional(S.String),
    GivenName: S.optional(S.String),
    Initials: S.optional(S.String),
    Pseudonym: S.optional(S.String),
    GenerationQualifier: S.optional(S.String),
    CustomAttributes: S.optional(CustomAttributeList),
  }),
).annotations({ identifier: "ASN1Subject" }) as any as S.Schema<ASN1Subject>;
export interface KeyUsage {
  DigitalSignature?: boolean;
  NonRepudiation?: boolean;
  KeyEncipherment?: boolean;
  DataEncipherment?: boolean;
  KeyAgreement?: boolean;
  KeyCertSign?: boolean;
  CRLSign?: boolean;
  EncipherOnly?: boolean;
  DecipherOnly?: boolean;
}
export const KeyUsage = S.suspend(() =>
  S.Struct({
    DigitalSignature: S.optional(S.Boolean),
    NonRepudiation: S.optional(S.Boolean),
    KeyEncipherment: S.optional(S.Boolean),
    DataEncipherment: S.optional(S.Boolean),
    KeyAgreement: S.optional(S.Boolean),
    KeyCertSign: S.optional(S.Boolean),
    CRLSign: S.optional(S.Boolean),
    EncipherOnly: S.optional(S.Boolean),
    DecipherOnly: S.optional(S.Boolean),
  }),
).annotations({ identifier: "KeyUsage" }) as any as S.Schema<KeyUsage>;
export type AccessMethodType =
  | "CA_REPOSITORY"
  | "RESOURCE_PKI_MANIFEST"
  | "RESOURCE_PKI_NOTIFY"
  | (string & {});
export const AccessMethodType = S.String;
export interface AccessMethod {
  CustomObjectIdentifier?: string;
  AccessMethodType?: AccessMethodType;
}
export const AccessMethod = S.suspend(() =>
  S.Struct({
    CustomObjectIdentifier: S.optional(S.String),
    AccessMethodType: S.optional(AccessMethodType),
  }),
).annotations({ identifier: "AccessMethod" }) as any as S.Schema<AccessMethod>;
export interface OtherName {
  TypeId: string;
  Value: string;
}
export const OtherName = S.suspend(() =>
  S.Struct({ TypeId: S.String, Value: S.String }),
).annotations({ identifier: "OtherName" }) as any as S.Schema<OtherName>;
export interface EdiPartyName {
  PartyName: string;
  NameAssigner?: string;
}
export const EdiPartyName = S.suspend(() =>
  S.Struct({ PartyName: S.String, NameAssigner: S.optional(S.String) }),
).annotations({ identifier: "EdiPartyName" }) as any as S.Schema<EdiPartyName>;
export interface GeneralName {
  OtherName?: OtherName;
  Rfc822Name?: string;
  DnsName?: string;
  DirectoryName?: ASN1Subject;
  EdiPartyName?: EdiPartyName;
  UniformResourceIdentifier?: string;
  IpAddress?: string;
  RegisteredId?: string;
}
export const GeneralName = S.suspend(() =>
  S.Struct({
    OtherName: S.optional(OtherName),
    Rfc822Name: S.optional(S.String),
    DnsName: S.optional(S.String),
    DirectoryName: S.optional(ASN1Subject),
    EdiPartyName: S.optional(EdiPartyName),
    UniformResourceIdentifier: S.optional(S.String),
    IpAddress: S.optional(S.String),
    RegisteredId: S.optional(S.String),
  }),
).annotations({ identifier: "GeneralName" }) as any as S.Schema<GeneralName>;
export interface AccessDescription {
  AccessMethod: AccessMethod;
  AccessLocation: GeneralName;
}
export const AccessDescription = S.suspend(() =>
  S.Struct({ AccessMethod: AccessMethod, AccessLocation: GeneralName }),
).annotations({
  identifier: "AccessDescription",
}) as any as S.Schema<AccessDescription>;
export type AccessDescriptionList = AccessDescription[];
export const AccessDescriptionList = S.Array(AccessDescription);
export interface CsrExtensions {
  KeyUsage?: KeyUsage;
  SubjectInformationAccess?: AccessDescription[];
}
export const CsrExtensions = S.suspend(() =>
  S.Struct({
    KeyUsage: S.optional(KeyUsage),
    SubjectInformationAccess: S.optional(AccessDescriptionList),
  }),
).annotations({
  identifier: "CsrExtensions",
}) as any as S.Schema<CsrExtensions>;
export interface CertificateAuthorityConfiguration {
  KeyAlgorithm: KeyAlgorithm;
  SigningAlgorithm: SigningAlgorithm;
  Subject: ASN1Subject;
  CsrExtensions?: CsrExtensions;
}
export const CertificateAuthorityConfiguration = S.suspend(() =>
  S.Struct({
    KeyAlgorithm: KeyAlgorithm,
    SigningAlgorithm: SigningAlgorithm,
    Subject: ASN1Subject,
    CsrExtensions: S.optional(CsrExtensions),
  }),
).annotations({
  identifier: "CertificateAuthorityConfiguration",
}) as any as S.Schema<CertificateAuthorityConfiguration>;
export interface CertificateAuthority {
  Arn?: string;
  OwnerAccount?: string;
  CreatedAt?: Date;
  LastStateChangeAt?: Date;
  Type?: CertificateAuthorityType;
  Serial?: string;
  Status?: CertificateAuthorityStatus;
  NotBefore?: Date;
  NotAfter?: Date;
  FailureReason?: FailureReason;
  CertificateAuthorityConfiguration?: CertificateAuthorityConfiguration;
  RevocationConfiguration?: RevocationConfiguration;
  RestorableUntil?: Date;
  KeyStorageSecurityStandard?: KeyStorageSecurityStandard;
  UsageMode?: CertificateAuthorityUsageMode;
}
export const CertificateAuthority = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastStateChangeAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Type: S.optional(CertificateAuthorityType),
    Serial: S.optional(S.String),
    Status: S.optional(CertificateAuthorityStatus),
    NotBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NotAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(FailureReason),
    CertificateAuthorityConfiguration: S.optional(
      CertificateAuthorityConfiguration,
    ),
    RevocationConfiguration: S.optional(RevocationConfiguration),
    RestorableUntil: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KeyStorageSecurityStandard: S.optional(KeyStorageSecurityStandard),
    UsageMode: S.optional(CertificateAuthorityUsageMode),
  }),
).annotations({
  identifier: "CertificateAuthority",
}) as any as S.Schema<CertificateAuthority>;
export type CertificateAuthorities = CertificateAuthority[];
export const CertificateAuthorities = S.Array(CertificateAuthority);
export interface CreateCertificateAuthorityAuditReportResponse {
  AuditReportId?: string;
  S3Key?: string;
}
export const CreateCertificateAuthorityAuditReportResponse = S.suspend(() =>
  S.Struct({
    AuditReportId: S.optional(S.String),
    S3Key: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCertificateAuthorityAuditReportResponse",
}) as any as S.Schema<CreateCertificateAuthorityAuditReportResponse>;
export interface DescribeCertificateAuthorityAuditReportResponse {
  AuditReportStatus?: AuditReportStatus;
  S3BucketName?: string;
  S3Key?: string;
  CreatedAt?: Date;
}
export const DescribeCertificateAuthorityAuditReportResponse = S.suspend(() =>
  S.Struct({
    AuditReportStatus: S.optional(AuditReportStatus),
    S3BucketName: S.optional(S.String),
    S3Key: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeCertificateAuthorityAuditReportResponse",
}) as any as S.Schema<DescribeCertificateAuthorityAuditReportResponse>;
export interface GetCertificateResponse {
  Certificate?: string;
  CertificateChain?: string;
}
export const GetCertificateResponse = S.suspend(() =>
  S.Struct({
    Certificate: S.optional(S.String),
    CertificateChain: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCertificateResponse",
}) as any as S.Schema<GetCertificateResponse>;
export interface GetCertificateAuthorityCertificateResponse {
  Certificate?: string;
  CertificateChain?: string;
}
export const GetCertificateAuthorityCertificateResponse = S.suspend(() =>
  S.Struct({
    Certificate: S.optional(S.String),
    CertificateChain: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCertificateAuthorityCertificateResponse",
}) as any as S.Schema<GetCertificateAuthorityCertificateResponse>;
export interface GetCertificateAuthorityCsrResponse {
  Csr?: string;
}
export const GetCertificateAuthorityCsrResponse = S.suspend(() =>
  S.Struct({ Csr: S.optional(S.String) }),
).annotations({
  identifier: "GetCertificateAuthorityCsrResponse",
}) as any as S.Schema<GetCertificateAuthorityCsrResponse>;
export interface GetPolicyResponse {
  Policy?: string;
}
export const GetPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetPolicyResponse",
}) as any as S.Schema<GetPolicyResponse>;
export interface ListCertificateAuthoritiesResponse {
  NextToken?: string;
  CertificateAuthorities?: CertificateAuthority[];
}
export const ListCertificateAuthoritiesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CertificateAuthorities: S.optional(CertificateAuthorities),
  }),
).annotations({
  identifier: "ListCertificateAuthoritiesResponse",
}) as any as S.Schema<ListCertificateAuthoritiesResponse>;
export interface ListTagsResponse {
  NextToken?: string;
  Tags?: Tag[];
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export type ExtendedKeyUsageType =
  | "SERVER_AUTH"
  | "CLIENT_AUTH"
  | "CODE_SIGNING"
  | "EMAIL_PROTECTION"
  | "TIME_STAMPING"
  | "OCSP_SIGNING"
  | "SMART_CARD_LOGIN"
  | "DOCUMENT_SIGNING"
  | "CERTIFICATE_TRANSPARENCY"
  | (string & {});
export const ExtendedKeyUsageType = S.String;
export interface Permission {
  CertificateAuthorityArn?: string;
  CreatedAt?: Date;
  Principal?: string;
  SourceAccount?: string;
  Actions?: ActionType[];
  Policy?: string;
}
export const Permission = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Principal: S.optional(S.String),
    SourceAccount: S.optional(S.String),
    Actions: S.optional(ActionList),
    Policy: S.optional(S.String),
  }),
).annotations({ identifier: "Permission" }) as any as S.Schema<Permission>;
export type PermissionList = Permission[];
export const PermissionList = S.Array(Permission);
export interface ExtendedKeyUsage {
  ExtendedKeyUsageType?: ExtendedKeyUsageType;
  ExtendedKeyUsageObjectIdentifier?: string;
}
export const ExtendedKeyUsage = S.suspend(() =>
  S.Struct({
    ExtendedKeyUsageType: S.optional(ExtendedKeyUsageType),
    ExtendedKeyUsageObjectIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ExtendedKeyUsage",
}) as any as S.Schema<ExtendedKeyUsage>;
export type ExtendedKeyUsageList = ExtendedKeyUsage[];
export const ExtendedKeyUsageList = S.Array(ExtendedKeyUsage);
export interface CustomExtension {
  ObjectIdentifier: string;
  Value: string;
  Critical?: boolean;
}
export const CustomExtension = S.suspend(() =>
  S.Struct({
    ObjectIdentifier: S.String,
    Value: S.String,
    Critical: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CustomExtension",
}) as any as S.Schema<CustomExtension>;
export type CustomExtensionList = CustomExtension[];
export const CustomExtensionList = S.Array(CustomExtension);
export interface DescribeCertificateAuthorityResponse {
  CertificateAuthority?: CertificateAuthority;
}
export const DescribeCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({ CertificateAuthority: S.optional(CertificateAuthority) }),
).annotations({
  identifier: "DescribeCertificateAuthorityResponse",
}) as any as S.Schema<DescribeCertificateAuthorityResponse>;
export type PolicyQualifierId = "CPS" | (string & {});
export const PolicyQualifierId = S.String;
export interface ListPermissionsResponse {
  NextToken?: string;
  Permissions?: Permission[];
}
export const ListPermissionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Permissions: S.optional(PermissionList),
  }),
).annotations({
  identifier: "ListPermissionsResponse",
}) as any as S.Schema<ListPermissionsResponse>;
export type GeneralNameList = GeneralName[];
export const GeneralNameList = S.Array(GeneralName);
export interface Qualifier {
  CpsUri: string;
}
export const Qualifier = S.suspend(() =>
  S.Struct({ CpsUri: S.String }),
).annotations({ identifier: "Qualifier" }) as any as S.Schema<Qualifier>;
export interface PolicyQualifierInfo {
  PolicyQualifierId: PolicyQualifierId;
  Qualifier: Qualifier;
}
export const PolicyQualifierInfo = S.suspend(() =>
  S.Struct({ PolicyQualifierId: PolicyQualifierId, Qualifier: Qualifier }),
).annotations({
  identifier: "PolicyQualifierInfo",
}) as any as S.Schema<PolicyQualifierInfo>;
export type PolicyQualifierInfoList = PolicyQualifierInfo[];
export const PolicyQualifierInfoList = S.Array(PolicyQualifierInfo);
export interface PolicyInformation {
  CertPolicyId: string;
  PolicyQualifiers?: PolicyQualifierInfo[];
}
export const PolicyInformation = S.suspend(() =>
  S.Struct({
    CertPolicyId: S.String,
    PolicyQualifiers: S.optional(PolicyQualifierInfoList),
  }),
).annotations({
  identifier: "PolicyInformation",
}) as any as S.Schema<PolicyInformation>;
export type CertificatePolicyList = PolicyInformation[];
export const CertificatePolicyList = S.Array(PolicyInformation);
export interface CreateCertificateAuthorityRequest {
  CertificateAuthorityConfiguration: CertificateAuthorityConfiguration;
  RevocationConfiguration?: RevocationConfiguration;
  CertificateAuthorityType: CertificateAuthorityType;
  IdempotencyToken?: string;
  KeyStorageSecurityStandard?: KeyStorageSecurityStandard;
  Tags?: Tag[];
  UsageMode?: CertificateAuthorityUsageMode;
}
export const CreateCertificateAuthorityRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityConfiguration: CertificateAuthorityConfiguration,
    RevocationConfiguration: S.optional(RevocationConfiguration),
    CertificateAuthorityType: CertificateAuthorityType,
    IdempotencyToken: S.optional(S.String),
    KeyStorageSecurityStandard: S.optional(KeyStorageSecurityStandard),
    Tags: S.optional(TagList),
    UsageMode: S.optional(CertificateAuthorityUsageMode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCertificateAuthorityRequest",
}) as any as S.Schema<CreateCertificateAuthorityRequest>;
export interface Extensions {
  CertificatePolicies?: PolicyInformation[];
  ExtendedKeyUsage?: ExtendedKeyUsage[];
  KeyUsage?: KeyUsage;
  SubjectAlternativeNames?: GeneralName[];
  CustomExtensions?: CustomExtension[];
}
export const Extensions = S.suspend(() =>
  S.Struct({
    CertificatePolicies: S.optional(CertificatePolicyList),
    ExtendedKeyUsage: S.optional(ExtendedKeyUsageList),
    KeyUsage: S.optional(KeyUsage),
    SubjectAlternativeNames: S.optional(GeneralNameList),
    CustomExtensions: S.optional(CustomExtensionList),
  }),
).annotations({ identifier: "Extensions" }) as any as S.Schema<Extensions>;
export interface ApiPassthrough {
  Extensions?: Extensions;
  Subject?: ASN1Subject;
}
export const ApiPassthrough = S.suspend(() =>
  S.Struct({
    Extensions: S.optional(Extensions),
    Subject: S.optional(ASN1Subject),
  }),
).annotations({
  identifier: "ApiPassthrough",
}) as any as S.Schema<ApiPassthrough>;
export interface CreateCertificateAuthorityResponse {
  CertificateAuthorityArn?: string;
}
export const CreateCertificateAuthorityResponse = S.suspend(() =>
  S.Struct({ CertificateAuthorityArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateCertificateAuthorityResponse",
}) as any as S.Schema<CreateCertificateAuthorityResponse>;
export interface IssueCertificateRequest {
  ApiPassthrough?: ApiPassthrough;
  CertificateAuthorityArn: string;
  Csr: Uint8Array;
  SigningAlgorithm: SigningAlgorithm;
  TemplateArn?: string;
  Validity: Validity;
  ValidityNotBefore?: Validity;
  IdempotencyToken?: string;
}
export const IssueCertificateRequest = S.suspend(() =>
  S.Struct({
    ApiPassthrough: S.optional(ApiPassthrough),
    CertificateAuthorityArn: S.String,
    Csr: T.Blob,
    SigningAlgorithm: SigningAlgorithm,
    TemplateArn: S.optional(S.String),
    Validity: Validity,
    ValidityNotBefore: S.optional(Validity),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "IssueCertificateRequest",
}) as any as S.Schema<IssueCertificateRequest>;
export interface IssueCertificateResponse {
  CertificateArn?: string;
}
export const IssueCertificateResponse = S.suspend(() =>
  S.Struct({ CertificateArn: S.optional(S.String) }),
).annotations({
  identifier: "IssueCertificateResponse",
}) as any as S.Schema<IssueCertificateResponse>;

//# Errors
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class CertificateMismatchException extends S.TaggedError<CertificateMismatchException>()(
  "CertificateMismatchException",
  { message: S.optional(S.String) },
) {}
export class InvalidArgsException extends S.TaggedError<InvalidArgsException>()(
  "InvalidArgsException",
  { message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class MalformedCertificateException extends S.TaggedError<MalformedCertificateException>()(
  "MalformedCertificateException",
  { message: S.optional(S.String) },
) {}
export class RequestFailedException extends S.TaggedError<RequestFailedException>()(
  "RequestFailedException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  { message: S.optional(S.String) },
) {}
export class LockoutPreventedException extends S.TaggedError<LockoutPreventedException>()(
  "LockoutPreventedException",
  { message: S.optional(S.String) },
) {}
export class PermissionAlreadyExistsException extends S.TaggedError<PermissionAlreadyExistsException>()(
  "PermissionAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class RequestAlreadyProcessedException extends S.TaggedError<RequestAlreadyProcessedException>()(
  "RequestAlreadyProcessedException",
  { message: S.optional(S.String) },
) {}
export class RequestInProgressException extends S.TaggedError<RequestInProgressException>()(
  "RequestInProgressException",
  { message: S.optional(S.String) },
) {}
export class MalformedCSRException extends S.TaggedError<MalformedCSRException>()(
  "MalformedCSRException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the private certificate authorities that you created by using the CreateCertificateAuthority action.
 */
export const listCertificateAuthorities: {
  (
    input: ListCertificateAuthoritiesRequest,
  ): effect.Effect<
    ListCertificateAuthoritiesResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCertificateAuthoritiesRequest,
  ) => stream.Stream<
    ListCertificateAuthoritiesResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCertificateAuthoritiesRequest,
  ) => stream.Stream<
    CertificateAuthority,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCertificateAuthoritiesRequest,
  output: ListCertificateAuthoritiesResponse,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CertificateAuthorities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists information about your private certificate authority (CA) or one that has been shared with you. You specify the private CA on input by its ARN (Amazon Resource Name). The output contains the status of your CA. This can be any of the following:
 *
 * - `CREATING` - Amazon Web Services Private CA is creating your private certificate authority.
 *
 * - `PENDING_CERTIFICATE` - The certificate is pending. You must use your Amazon Web Services Private CA-hosted or on-premises root or subordinate CA to sign your private CA CSR and then import it into Amazon Web Services Private CA.
 *
 * - `ACTIVE` - Your private CA is active.
 *
 * - `DISABLED` - Your private CA has been disabled.
 *
 * - `EXPIRED` - Your private CA certificate has expired.
 *
 * - `FAILED` - Your private CA has failed. Your CA can fail because of problems such a network outage or back-end Amazon Web Services failure or other errors. A failed CA can never return to the pending state. You must create a new CA.
 *
 * - `DELETED` - Your private CA is within the restoration period, after which it is permanently deleted. The length of time remaining in the CA's restoration period is also included in this action's output.
 */
export const describeCertificateAuthority: (
  input: DescribeCertificateAuthorityRequest,
) => effect.Effect<
  DescribeCertificateAuthorityResponse,
  InvalidArnException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateAuthorityRequest,
  output: DescribeCertificateAuthorityResponse,
  errors: [InvalidArnException, ResourceNotFoundException],
}));
/**
 * List all permissions on a private CA, if any, granted to the Certificate Manager (ACM) service principal (acm.amazonaws.com).
 *
 * These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA.
 *
 * Permissions can be granted with the CreatePermission action and revoked with the DeletePermission action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const listPermissions: {
  (
    input: ListPermissionsRequest,
  ): effect.Effect<
    ListPermissionsResponse,
    | InvalidArnException
    | InvalidNextTokenException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    ListPermissionsResponse,
    | InvalidArnException
    | InvalidNextTokenException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPermissionsRequest,
  ) => stream.Stream<
    Permission,
    | InvalidArnException
    | InvalidNextTokenException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPermissionsRequest,
  output: ListPermissionsResponse,
  errors: [
    InvalidArnException,
    InvalidNextTokenException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Permissions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the resource-based policy attached to a private CA. Deletion will remove any access that the policy has granted. If there is no policy attached to the private CA, this action will return successful.
 *
 * If you delete a policy that was applied through Amazon Web Services Resource Access Manager (RAM), the CA will be removed from all shares in which it was included.
 *
 * The Certificate Manager Service Linked Role that the policy supports is not affected when you delete the policy.
 *
 * The current policy can be shown with GetPolicy and updated with PutPolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const deletePolicy: (
  input: DeletePolicyRequest,
) => effect.Effect<
  DeletePolicyResponse,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidStateException
  | LockoutPreventedException
  | RequestFailedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidStateException,
    LockoutPreventedException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists information about a specific audit report created by calling the CreateCertificateAuthorityAuditReport action. Audit information is created every time the certificate authority (CA) private key is used. The private key is used when you call the IssueCertificate action or the RevokeCertificate action.
 */
export const describeCertificateAuthorityAuditReport: (
  input: DescribeCertificateAuthorityAuditReportRequest,
) => effect.Effect<
  DescribeCertificateAuthorityAuditReportResponse,
  | InvalidArgsException
  | InvalidArnException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateAuthorityAuditReportRequest,
  output: DescribeCertificateAuthorityAuditReportResponse,
  errors: [
    InvalidArgsException,
    InvalidArnException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a private certificate authority (CA). You must provide the Amazon Resource Name (ARN) of the private CA that you want to delete. You can find the ARN by calling the ListCertificateAuthorities action.
 *
 * Deleting a CA will invalidate other CAs and certificates below it in your CA hierarchy.
 *
 * Before you can delete a CA that you have created and activated, you must disable it. To do this, call the UpdateCertificateAuthority action and set the **CertificateAuthorityStatus** parameter to `DISABLED`.
 *
 * Additionally, you can delete a CA if you are waiting for it to be created (that is, the status of the CA is `CREATING`). You can also delete it if the CA has been created but you haven't yet imported the signed certificate into Amazon Web Services Private CA (that is, the status of the CA is `PENDING_CERTIFICATE`).
 *
 * When you successfully call DeleteCertificateAuthority, the CA's status changes to `DELETED`. However, the CA won't be permanently deleted until the restoration period has passed. By default, if you do not set the `PermanentDeletionTimeInDays` parameter, the CA remains restorable for 30 days. You can set the parameter from 7 to 30 days. The DescribeCertificateAuthority action returns the time remaining in the restoration window of a private CA in the `DELETED` state. To restore an eligible CA, call the RestoreCertificateAuthority action.
 *
 * A private CA can be deleted if it is in the `PENDING_CERTIFICATE`, `CREATING`, `EXPIRED`, `DISABLED`, or `FAILED` state. To delete a CA in the `ACTIVE` state, you must first disable it, or else the delete request results in an exception. If you are deleting a private CA in the `PENDING_CERTIFICATE` or `DISABLED` state, you can set the length of its restoration period to 7-30 days. The default is 30. During this time, the status is set to `DELETED` and the CA can be restored. A private CA deleted in the `CREATING` or `FAILED` state has no assigned restoration period and cannot be restored.
 */
export const deleteCertificateAuthority: (
  input: DeleteCertificateAuthorityRequest,
) => effect.Effect<
  DeleteCertificateAuthorityResponse,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateAuthorityRequest,
  output: DeleteCertificateAuthorityResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the certificate and certificate chain for your private certificate authority (CA) or one that has been shared with you. Both the certificate and the chain are base64 PEM-encoded. The chain does not include the CA certificate. Each certificate in the chain signs the one before it.
 */
export const getCertificateAuthorityCertificate: (
  input: GetCertificateAuthorityCertificateRequest,
) => effect.Effect<
  GetCertificateAuthorityCertificateResponse,
  | InvalidArnException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificateAuthorityCertificateRequest,
  output: GetCertificateAuthorityCertificateResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Restores a certificate authority (CA) that is in the `DELETED` state. You can restore a CA during the period that you defined in the **PermanentDeletionTimeInDays** parameter of the DeleteCertificateAuthority action. Currently, you can specify 7 to 30 days. If you did not specify a **PermanentDeletionTimeInDays** value, by default you can restore the CA at any time in a 30 day period. You can check the time remaining in the restoration period of a private CA in the `DELETED` state by calling the DescribeCertificateAuthority or ListCertificateAuthorities actions. The status of a restored CA is set to its pre-deletion status when the **RestoreCertificateAuthority** action returns. To change its status to `ACTIVE`, call the UpdateCertificateAuthority action. If the private CA was in the `PENDING_CERTIFICATE` state at deletion, you must use the ImportCertificateAuthorityCertificate action to import a certificate authority into the private CA before it can be activated. You cannot restore a CA after the restoration period has ended.
 */
export const restoreCertificateAuthority: (
  input: RestoreCertificateAuthorityRequest,
) => effect.Effect<
  RestoreCertificateAuthorityResponse,
  | InvalidArnException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreCertificateAuthorityRequest,
  output: RestoreCertificateAuthorityResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the status or configuration of a private certificate authority (CA). Your private CA must be in the `ACTIVE` or `DISABLED` state before you can update it. You can disable a private CA that is in the `ACTIVE` state or make a CA that is in the `DISABLED` state active again.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 */
export const updateCertificateAuthority: (
  input: UpdateCertificateAuthorityRequest,
) => effect.Effect<
  UpdateCertificateAuthorityResponse,
  | ConcurrentModificationException
  | InvalidArgsException
  | InvalidArnException
  | InvalidPolicyException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCertificateAuthorityRequest,
  output: UpdateCertificateAuthorityResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArgsException,
    InvalidArnException,
    InvalidPolicyException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the resource-based policy attached to a private CA. If either the private CA resource or the policy cannot be found, this action returns a `ResourceNotFoundException`.
 *
 * The policy can be attached or updated with PutPolicy and removed with DeletePolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const getPolicy: (
  input: GetPolicyRequest,
) => effect.Effect<
  GetPolicyResponse,
  | InvalidArnException
  | InvalidStateException
  | RequestFailedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the tags, if any, that are associated with your private CA or one that has been shared with you. Tags are labels that you can use to identify and organize your CAs. Each tag consists of a key and an optional value. Call the TagCertificateAuthority action to add one or more tags to your CA. Call the UntagCertificateAuthority action to remove tags.
 */
export const listTags: {
  (
    input: ListTagsRequest,
  ): effect.Effect<
    ListTagsResponse,
    | InvalidArnException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsRequest,
  ) => stream.Stream<
    ListTagsResponse,
    | InvalidArnException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsRequest,
  ) => stream.Stream<
    Tag,
    | InvalidArnException
    | InvalidStateException
    | RequestFailedException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Revokes permissions on a private CA granted to the Certificate Manager (ACM) service principal (acm.amazonaws.com).
 *
 * These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA. If you revoke these permissions, ACM will no longer renew the affected certificates automatically.
 *
 * Permissions can be granted with the CreatePermission action and listed with the ListPermissions action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const deletePermission: (
  input: DeletePermissionRequest,
) => effect.Effect<
  DeletePermissionResponse,
  | InvalidArnException
  | InvalidStateException
  | RequestFailedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionRequest,
  output: DeletePermissionResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Remove one or more tags from your private CA. A tag consists of a key-value pair. If you do not specify the value portion of the tag when calling this action, the tag will be removed regardless of value. If you specify a value, the tag is removed only if it is associated with the specified value. To add tags to a private CA, use the TagCertificateAuthority. Call the ListTags action to see what tags are associated with your CA.
 */
export const untagCertificateAuthority: (
  input: UntagCertificateAuthorityRequest,
) => effect.Effect<
  UntagCertificateAuthorityResponse,
  | InvalidArnException
  | InvalidStateException
  | InvalidTagException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagCertificateAuthorityRequest,
  output: UntagCertificateAuthorityResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    InvalidTagException,
    ResourceNotFoundException,
  ],
}));
/**
 * Attaches a resource-based policy to a private CA.
 *
 * A policy can also be applied by sharing a private CA through Amazon Web Services Resource Access Manager (RAM). For more information, see Attach a Policy for Cross-Account Access.
 *
 * The policy can be displayed with GetPolicy and removed with DeletePolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const putPolicy: (
  input: PutPolicyRequest,
) => effect.Effect<
  PutPolicyResponse,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidPolicyException
  | InvalidStateException
  | LockoutPreventedException
  | RequestFailedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyRequest,
  output: PutPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidPolicyException,
    InvalidStateException,
    LockoutPreventedException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Grants one or more permissions on a private CA to the Certificate Manager (ACM) service principal (`acm.amazonaws.com`). These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA.
 *
 * You can list current permissions with the ListPermissions action and revoke them with the DeletePermission action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const createPermission: (
  input: CreatePermissionRequest,
) => effect.Effect<
  CreatePermissionResponse,
  | InvalidArnException
  | InvalidStateException
  | LimitExceededException
  | PermissionAlreadyExistsException
  | RequestFailedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionRequest,
  output: CreatePermissionResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    LimitExceededException,
    PermissionAlreadyExistsException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more tags to your private CA. Tags are labels that you can use to identify and organize your Amazon Web Services resources. Each tag consists of a key and an optional value. You specify the private CA on input by its Amazon Resource Name (ARN). You specify the tag by using a key-value pair. You can apply a tag to just one private CA if you want to identify a specific characteristic of that CA, or you can apply the same tag to multiple private CAs if you want to filter for a common relationship among those CAs. To remove one or more tags, use the UntagCertificateAuthority action. Call the ListTags action to see what tags are associated with your CA.
 *
 * To attach tags to a private CA during the creation procedure, a CA administrator must first associate an inline IAM policy with the `CreateCertificateAuthority` action and explicitly allow tagging. For more information, see Attaching tags to a CA at the time of creation.
 */
export const tagCertificateAuthority: (
  input: TagCertificateAuthorityRequest,
) => effect.Effect<
  TagCertificateAuthorityResponse,
  | InvalidArnException
  | InvalidStateException
  | InvalidTagException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagCertificateAuthorityRequest,
  output: TagCertificateAuthorityResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    InvalidTagException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Retrieves a certificate from your private CA or one that has been shared with you. The ARN of the certificate is returned when you call the IssueCertificate action. You must specify both the ARN of your private CA and the ARN of the issued certificate when calling the **GetCertificate** action. You can retrieve the certificate if it is in the **ISSUED**, **EXPIRED**, or **REVOKED** state. You can call the CreateCertificateAuthorityAuditReport action to create a report that contains information about all of the certificates issued and revoked by your private CA.
 */
export const getCertificate: (
  input: GetCertificateRequest,
) => effect.Effect<
  GetCertificateResponse,
  | InvalidArnException
  | InvalidStateException
  | RequestFailedException
  | RequestInProgressException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificateRequest,
  output: GetCertificateResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the certificate signing request (CSR) for your private certificate authority (CA). The CSR is created when you call the CreateCertificateAuthority action. Sign the CSR with your Amazon Web Services Private CA-hosted or on-premises root or subordinate CA. Then import the signed certificate back into Amazon Web Services Private CA by calling the ImportCertificateAuthorityCertificate action. The CSR is returned as a base64 PEM-encoded string.
 */
export const getCertificateAuthorityCsr: (
  input: GetCertificateAuthorityCsrRequest,
) => effect.Effect<
  GetCertificateAuthorityCsrResponse,
  | InvalidArnException
  | InvalidStateException
  | RequestFailedException
  | RequestInProgressException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificateAuthorityCsrRequest,
  output: GetCertificateAuthorityCsrResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an audit report that lists every time that your CA private key is used to issue a certificate. The IssueCertificate and RevokeCertificate actions use the private key.
 *
 * To save the audit report to your designated Amazon S3 bucket, you must create a bucket policy that grants Amazon Web Services Private CA permission to access and write to it. For an example policy, see Prepare an Amazon S3 bucket for audit reports.
 *
 * Amazon Web Services Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your Audit Reports.
 *
 * You can generate a maximum of one report every 30 minutes.
 */
export const createCertificateAuthorityAuditReport: (
  input: CreateCertificateAuthorityAuditReportRequest,
) => effect.Effect<
  CreateCertificateAuthorityAuditReportResponse,
  | InvalidArgsException
  | InvalidArnException
  | InvalidStateException
  | RequestFailedException
  | RequestInProgressException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateAuthorityAuditReportRequest,
  output: CreateCertificateAuthorityAuditReportResponse,
  errors: [
    InvalidArgsException,
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Imports a signed private CA certificate into Amazon Web Services Private CA. This action is used when you are using a chain of trust whose root is located outside Amazon Web Services Private CA. Before you can call this action, the following preparations must in place:
 *
 * - In Amazon Web Services Private CA, call the CreateCertificateAuthority action to create the private CA that you plan to back with the imported certificate.
 *
 * - Call the GetCertificateAuthorityCsr action to generate a certificate signing request (CSR).
 *
 * - Sign the CSR using a root or intermediate CA hosted by either an on-premises PKI hierarchy or by a commercial CA.
 *
 * - Create a certificate chain and copy the signed certificate and the certificate chain to your working directory.
 *
 * Amazon Web Services Private CA supports three scenarios for installing a CA certificate:
 *
 * - Installing a certificate for a root CA hosted by Amazon Web Services Private CA.
 *
 * - Installing a subordinate CA certificate whose parent authority is hosted by Amazon Web Services Private CA.
 *
 * - Installing a subordinate CA certificate whose parent authority is externally hosted.
 *
 * The following additional requirements apply when you import a CA certificate.
 *
 * - Only a self-signed certificate can be imported as a root CA.
 *
 * - A self-signed certificate cannot be imported as a subordinate CA.
 *
 * - Your certificate chain must not include the private CA certificate that you are importing.
 *
 * - Your root CA must be the last certificate in your chain. The subordinate certificate, if any, that your root CA signed must be next to last. The subordinate certificate signed by the preceding subordinate CA must come next, and so on until your chain is built.
 *
 * - The chain must be PEM-encoded.
 *
 * - The maximum allowed size of a certificate is 32 KB.
 *
 * - The maximum allowed size of a certificate chain is 2 MB.
 *
 * *Enforcement of Critical Constraints*
 *
 * Amazon Web Services Private CA allows the following extensions to be marked critical in the imported CA certificate or chain.
 *
 * - Authority key identifier
 *
 * - Basic constraints (*must* be marked critical)
 *
 * - Certificate policies
 *
 * - Extended key usage
 *
 * - Inhibit anyPolicy
 *
 * - Issuer alternative name
 *
 * - Key usage
 *
 * - Name constraints
 *
 * - Policy mappings
 *
 * - Subject alternative name
 *
 * - Subject directory attributes
 *
 * - Subject key identifier
 *
 * - Subject information access
 *
 * Amazon Web Services Private CA rejects the following extensions when they are marked critical in an imported CA certificate or chain.
 *
 * - Authority information access
 *
 * - CRL distribution points
 *
 * - Freshest CRL
 *
 * - Policy constraints
 *
 * Amazon Web Services Private Certificate Authority will also reject any other extension marked as critical not contained on the preceding list of allowed extensions.
 */
export const importCertificateAuthorityCertificate: (
  input: ImportCertificateAuthorityCertificateRequest,
) => effect.Effect<
  ImportCertificateAuthorityCertificateResponse,
  | CertificateMismatchException
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidRequestException
  | InvalidStateException
  | MalformedCertificateException
  | RequestFailedException
  | RequestInProgressException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCertificateAuthorityCertificateRequest,
  output: ImportCertificateAuthorityCertificateResponse,
  errors: [
    CertificateMismatchException,
    ConcurrentModificationException,
    InvalidArnException,
    InvalidRequestException,
    InvalidStateException,
    MalformedCertificateException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Revokes a certificate that was issued inside Amazon Web Services Private CA. If you enable a certificate revocation list (CRL) when you create or update your private CA, information about the revoked certificates will be included in the CRL. Amazon Web Services Private CA writes the CRL to an S3 bucket that you specify. A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason the CRL update fails, Amazon Web Services Private CA attempts makes further attempts every 15 minutes. With Amazon CloudWatch, you can create alarms for the metrics `CRLGenerated` and `MisconfiguredCRLBucket`. For more information, see Supported CloudWatch Metrics.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 *
 * Amazon Web Services Private CA also writes revocation information to the audit report. For more information, see CreateCertificateAuthorityAuditReport.
 *
 * You cannot revoke a root CA self-signed certificate.
 */
export const revokeCertificate: (
  input: RevokeCertificateRequest,
) => effect.Effect<
  RevokeCertificateResponse,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidRequestException
  | InvalidStateException
  | LimitExceededException
  | RequestAlreadyProcessedException
  | RequestFailedException
  | RequestInProgressException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeCertificateRequest,
  output: RevokeCertificateResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidRequestException,
    InvalidStateException,
    LimitExceededException,
    RequestAlreadyProcessedException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a root or subordinate private certificate authority (CA). You must specify the CA configuration, an optional configuration for Online Certificate Status Protocol (OCSP) and/or a certificate revocation list (CRL), the CA type, and an optional idempotency token to avoid accidental creation of multiple CAs. The CA configuration specifies the name of the algorithm and key size to be used to create the CA private key, the type of signing algorithm that the CA uses, and X.500 subject information. The OCSP configuration can optionally specify a custom URL for the OCSP responder. The CRL configuration specifies the CRL expiration period in days (the validity period of the CRL), the Amazon S3 bucket that will contain the CRL, and a CNAME alias for the S3 bucket that is included in certificates issued by the CA. If successful, this action returns the Amazon Resource Name (ARN) of the CA.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 *
 * Amazon Web Services Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your CRLs.
 */
export const createCertificateAuthority: (
  input: CreateCertificateAuthorityRequest,
) => effect.Effect<
  CreateCertificateAuthorityResponse,
  | InvalidArgsException
  | InvalidPolicyException
  | InvalidTagException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCertificateAuthorityRequest,
  output: CreateCertificateAuthorityResponse,
  errors: [
    InvalidArgsException,
    InvalidPolicyException,
    InvalidTagException,
    LimitExceededException,
  ],
}));
/**
 * Uses your private certificate authority (CA), or one that has been shared with you, to issue a client certificate. This action returns the Amazon Resource Name (ARN) of the certificate. You can retrieve the certificate by calling the GetCertificate action and specifying the ARN.
 *
 * You cannot use the ACM **ListCertificateAuthorities** action to retrieve the ARNs of the certificates that you issue by using Amazon Web Services Private CA.
 */
export const issueCertificate: (
  input: IssueCertificateRequest,
) => effect.Effect<
  IssueCertificateResponse,
  | InvalidArgsException
  | InvalidArnException
  | InvalidStateException
  | LimitExceededException
  | MalformedCSRException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IssueCertificateRequest,
  output: IssueCertificateResponse,
  errors: [
    InvalidArgsException,
    InvalidArnException,
    InvalidStateException,
    LimitExceededException,
    MalformedCSRException,
    ResourceNotFoundException,
  ],
}));

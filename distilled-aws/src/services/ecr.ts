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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://ecr.amazonaws.com/doc/2015-09-21/");
const svc = T.AwsApiService({
  sdkId: "ECR",
  serviceShapeName: "AmazonEC2ContainerRegistry_V20150921",
});
const auth = T.AwsAuthSigv4({ name: "ecr" });
const ver = T.ServiceVersion("2015-09-21");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://api.ecr-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://api.ecr.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RegistryId = string;
export type RepositoryName = string;
export type BatchedOperationLayerDigest = string;
export type MediaType = string;
export type UploadId = string;
export type LayerDigest = string;
export type PullThroughCacheRuleRepositoryPrefix = string;
export type Url = string;
export type CredentialArn = string;
export type CustomRoleArn = string;
export type Prefix = string;
export type RepositoryTemplateDescription = string;
export type RepositoryPolicyText = string;
export type LifecyclePolicyTextForRepositoryCreationTemplate = string;
export type RegistryPolicyText = string;
export type ForceFlag = boolean;
export type PrincipalArn = string;
export type NextToken = string;
export type MaxResults = number;
export type AccountSettingName = string;
export type LifecyclePreviewMaxResults = number;
export type FiftyMaxResults = number;
export type Arn = string;
export type AccountSettingValue = string;
export type ImageManifest = string;
export type ImageTag = string;
export type ImageDigest = string;
export type LifecyclePolicyText = string;
export type TagKey = string;
export type PartSize = number;
export type LayerPartBlob = Uint8Array;
export type TagValue = string;
export type ImageTagMutabilityExclusionFilterValue = string;
export type ScanOnPushFlag = boolean;
export type KmsKey = string;
export type KmsKeyForRepositoryCreationTemplate = string;
export type ArtifactType = string;
export type CreationTimestamp = Date;
export type EvaluationTimestamp = Date;
export type ExceptionMessage = string;
export type UpdatedTimestamp = Date;
export type IsPTCRuleValid = boolean;
export type PTCValidateFailure = string;
export type SigningProfileArn = string;
export type ScanningRepositoryFilterValue = string;
export type LayerSizeInBytes = number;
export type LayerFailureReason = string;
export type ImageFailureReason = string;
export type ScanningConfigurationFailureReason = string;
export type Region = string;
export type ReplicationError = string;
export type ScanStatusDescription = string;
export type ScanTimestamp = Date;
export type VulnerabilitySourceUpdateTimestamp = Date;
export type SigningStatusFailureCode = string;
export type SigningStatusFailureReason = string;
export type Base64 = string;
export type ExpirationTimestamp = Date;
export type ProxyEndpoint = string;
export type SigningRepositoryFilterValue = string;
export type RepositoryFilterValue = string;
export type KmsError = string;
export type SeverityCount = number;
export type FindingName = string;
export type FindingDescription = string;
export type FindingArn = string;
export type Score = number;
export type Severity = string;
export type Status = string;
export type Title = string;
export type Type = string;
export type FixAvailable = string;
export type ExploitAvailable = string;
export type ImageSizeInBytes = number;
export type PushTimestamp = Date;
export type RecordedPullTimestamp = Date;
export type LastArchivedAtTimestamp = Date;
export type LastActivatedAtTimestamp = Date;
export type LifecyclePolicyRulePriority = number;
export type ImageCount = number;
export type AttributeKey = string;
export type AttributeValue = string;
export type RelatedVulnerability = string;
export type Source = string;
export type VulnerabilityId = string;
export type ResourceId = string;
export type BaseScore = number;
export type ScoringVector = string;
export type Version = string;
export type Arch = string;
export type Epoch = number;
export type FilePath = string;
export type VulnerablePackageName = string;
export type PackageManager = string;
export type Release = string;
export type SourceLayerHash = string;
export type FixedInVersion = string;
export type RecommendationText = string;
export type Author = string;
export type Platform = string;
export type InUseCount = number;
export type Metric = string;
export type Reason = string;

//# Schemas
export interface DeleteRegistryPolicyRequest {}
export const DeleteRegistryPolicyRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRegistryPolicyRequest",
}) as any as S.Schema<DeleteRegistryPolicyRequest>;
export interface DeleteSigningConfigurationRequest {}
export const DeleteSigningConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSigningConfigurationRequest",
}) as any as S.Schema<DeleteSigningConfigurationRequest>;
export interface DescribeRegistryRequest {}
export const DescribeRegistryRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRegistryRequest",
}) as any as S.Schema<DescribeRegistryRequest>;
export interface GetRegistryPolicyRequest {}
export const GetRegistryPolicyRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegistryPolicyRequest",
}) as any as S.Schema<GetRegistryPolicyRequest>;
export interface GetRegistryScanningConfigurationRequest {}
export const GetRegistryScanningConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRegistryScanningConfigurationRequest",
}) as any as S.Schema<GetRegistryScanningConfigurationRequest>;
export interface GetSigningConfigurationRequest {}
export const GetSigningConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSigningConfigurationRequest",
}) as any as S.Schema<GetSigningConfigurationRequest>;
export type BatchedOperationLayerDigestList = string[];
export const BatchedOperationLayerDigestList = S.Array(S.String);
export type MediaTypeList = string[];
export const MediaTypeList = S.Array(S.String);
export type ScanningConfigurationRepositoryNameList = string[];
export const ScanningConfigurationRepositoryNameList = S.Array(S.String);
export type LayerDigestList = string[];
export const LayerDigestList = S.Array(S.String);
export type UpstreamRegistry =
  | "ecr"
  | "ecr-public"
  | "quay"
  | "k8s"
  | "docker-hub"
  | "github-container-registry"
  | "azure-container-registry"
  | "gitlab-container-registry"
  | (string & {});
export const UpstreamRegistry = S.String;
export type ImageTagMutability =
  | "MUTABLE"
  | "IMMUTABLE"
  | "IMMUTABLE_WITH_EXCLUSION"
  | "MUTABLE_WITH_EXCLUSION"
  | (string & {});
export const ImageTagMutability = S.String;
export type RCTAppliedFor =
  | "REPLICATION"
  | "PULL_THROUGH_CACHE"
  | "CREATE_ON_PUSH"
  | (string & {});
export const RCTAppliedFor = S.String;
export type RCTAppliedForList = RCTAppliedFor[];
export const RCTAppliedForList = S.Array(RCTAppliedFor);
export type PullThroughCacheRuleRepositoryPrefixList = string[];
export const PullThroughCacheRuleRepositoryPrefixList = S.Array(S.String);
export type RepositoryNameList = string[];
export const RepositoryNameList = S.Array(S.String);
export type PrefixList = string[];
export const PrefixList = S.Array(S.String);
export type GetAuthorizationTokenRegistryIdList = string[];
export const GetAuthorizationTokenRegistryIdList = S.Array(S.String);
export type ScanType = "BASIC" | "ENHANCED" | (string & {});
export const ScanType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TargetStorageClass = "STANDARD" | "ARCHIVE" | (string & {});
export const TargetStorageClass = S.String;
export interface BatchCheckLayerAvailabilityRequest {
  registryId?: string;
  repositoryName: string;
  layerDigests: string[];
}
export const BatchCheckLayerAvailabilityRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    layerDigests: BatchedOperationLayerDigestList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCheckLayerAvailabilityRequest",
}) as any as S.Schema<BatchCheckLayerAvailabilityRequest>;
export interface ImageIdentifier {
  imageDigest?: string;
  imageTag?: string;
}
export const ImageIdentifier = S.suspend(() =>
  S.Struct({
    imageDigest: S.optional(S.String),
    imageTag: S.optional(S.String),
  }),
).annotations({
  identifier: "ImageIdentifier",
}) as any as S.Schema<ImageIdentifier>;
export type ImageIdentifierList = ImageIdentifier[];
export const ImageIdentifierList = S.Array(ImageIdentifier);
export interface BatchGetImageRequest {
  registryId?: string;
  repositoryName: string;
  imageIds: ImageIdentifier[];
  acceptedMediaTypes?: string[];
}
export const BatchGetImageRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: ImageIdentifierList,
    acceptedMediaTypes: S.optional(MediaTypeList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetImageRequest",
}) as any as S.Schema<BatchGetImageRequest>;
export interface BatchGetRepositoryScanningConfigurationRequest {
  repositoryNames: string[];
}
export const BatchGetRepositoryScanningConfigurationRequest = S.suspend(() =>
  S.Struct({ repositoryNames: ScanningConfigurationRepositoryNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRepositoryScanningConfigurationRequest",
}) as any as S.Schema<BatchGetRepositoryScanningConfigurationRequest>;
export interface CompleteLayerUploadRequest {
  registryId?: string;
  repositoryName: string;
  uploadId: string;
  layerDigests: string[];
}
export const CompleteLayerUploadRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    uploadId: S.String,
    layerDigests: LayerDigestList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteLayerUploadRequest",
}) as any as S.Schema<CompleteLayerUploadRequest>;
export interface CreatePullThroughCacheRuleRequest {
  ecrRepositoryPrefix: string;
  upstreamRegistryUrl: string;
  registryId?: string;
  upstreamRegistry?: UpstreamRegistry;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
}
export const CreatePullThroughCacheRuleRequest = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.String,
    upstreamRegistryUrl: S.String,
    registryId: S.optional(S.String),
    upstreamRegistry: S.optional(UpstreamRegistry),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePullThroughCacheRuleRequest",
}) as any as S.Schema<CreatePullThroughCacheRuleRequest>;
export interface DeleteLifecyclePolicyRequest {
  registryId?: string;
  repositoryName: string;
}
export const DeleteLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ registryId: S.optional(S.String), repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLifecyclePolicyRequest",
}) as any as S.Schema<DeleteLifecyclePolicyRequest>;
export interface DeletePullThroughCacheRuleRequest {
  ecrRepositoryPrefix: string;
  registryId?: string;
}
export const DeletePullThroughCacheRuleRequest = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.String,
    registryId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePullThroughCacheRuleRequest",
}) as any as S.Schema<DeletePullThroughCacheRuleRequest>;
export interface DeleteRegistryPolicyResponse {
  registryId?: string;
  policyText?: string;
}
export const DeleteRegistryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteRegistryPolicyResponse",
}) as any as S.Schema<DeleteRegistryPolicyResponse>;
export interface DeleteRepositoryRequest {
  registryId?: string;
  repositoryName: string;
  force?: boolean;
}
export const DeleteRepositoryRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryRequest",
}) as any as S.Schema<DeleteRepositoryRequest>;
export interface DeleteRepositoryCreationTemplateRequest {
  prefix: string;
}
export const DeleteRepositoryCreationTemplateRequest = S.suspend(() =>
  S.Struct({ prefix: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryCreationTemplateRequest",
}) as any as S.Schema<DeleteRepositoryCreationTemplateRequest>;
export interface DeleteRepositoryPolicyRequest {
  registryId?: string;
  repositoryName: string;
}
export const DeleteRepositoryPolicyRequest = S.suspend(() =>
  S.Struct({ registryId: S.optional(S.String), repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryPolicyRequest",
}) as any as S.Schema<DeleteRepositoryPolicyRequest>;
export interface DeregisterPullTimeUpdateExclusionRequest {
  principalArn: string;
}
export const DeregisterPullTimeUpdateExclusionRequest = S.suspend(() =>
  S.Struct({ principalArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterPullTimeUpdateExclusionRequest",
}) as any as S.Schema<DeregisterPullTimeUpdateExclusionRequest>;
export interface DescribeImageReplicationStatusRequest {
  repositoryName: string;
  imageId: ImageIdentifier;
  registryId?: string;
}
export const DescribeImageReplicationStatusRequest = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    imageId: ImageIdentifier,
    registryId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImageReplicationStatusRequest",
}) as any as S.Schema<DescribeImageReplicationStatusRequest>;
export interface DescribeImageScanFindingsRequest {
  registryId?: string;
  repositoryName: string;
  imageId: ImageIdentifier;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeImageScanFindingsRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageId: ImageIdentifier,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImageScanFindingsRequest",
}) as any as S.Schema<DescribeImageScanFindingsRequest>;
export interface DescribeImageSigningStatusRequest {
  repositoryName: string;
  imageId: ImageIdentifier;
  registryId?: string;
}
export const DescribeImageSigningStatusRequest = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    imageId: ImageIdentifier,
    registryId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImageSigningStatusRequest",
}) as any as S.Schema<DescribeImageSigningStatusRequest>;
export interface DescribePullThroughCacheRulesRequest {
  registryId?: string;
  ecrRepositoryPrefixes?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribePullThroughCacheRulesRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    ecrRepositoryPrefixes: S.optional(PullThroughCacheRuleRepositoryPrefixList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePullThroughCacheRulesRequest",
}) as any as S.Schema<DescribePullThroughCacheRulesRequest>;
export interface DescribeRepositoriesRequest {
  registryId?: string;
  repositoryNames?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeRepositoriesRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryNames: S.optional(RepositoryNameList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRepositoriesRequest",
}) as any as S.Schema<DescribeRepositoriesRequest>;
export interface DescribeRepositoryCreationTemplatesRequest {
  prefixes?: string[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeRepositoryCreationTemplatesRequest = S.suspend(() =>
  S.Struct({
    prefixes: S.optional(PrefixList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRepositoryCreationTemplatesRequest",
}) as any as S.Schema<DescribeRepositoryCreationTemplatesRequest>;
export interface GetAccountSettingRequest {
  name: string;
}
export const GetAccountSettingRequest = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSettingRequest",
}) as any as S.Schema<GetAccountSettingRequest>;
export interface GetAuthorizationTokenRequest {
  registryIds?: string[];
}
export const GetAuthorizationTokenRequest = S.suspend(() =>
  S.Struct({
    registryIds: S.optional(GetAuthorizationTokenRegistryIdList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAuthorizationTokenRequest",
}) as any as S.Schema<GetAuthorizationTokenRequest>;
export interface GetDownloadUrlForLayerRequest {
  registryId?: string;
  repositoryName: string;
  layerDigest: string;
}
export const GetDownloadUrlForLayerRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    layerDigest: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDownloadUrlForLayerRequest",
}) as any as S.Schema<GetDownloadUrlForLayerRequest>;
export interface GetLifecyclePolicyRequest {
  registryId?: string;
  repositoryName: string;
}
export const GetLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ registryId: S.optional(S.String), repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLifecyclePolicyRequest",
}) as any as S.Schema<GetLifecyclePolicyRequest>;
export interface GetRegistryPolicyResponse {
  registryId?: string;
  policyText?: string;
}
export const GetRegistryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRegistryPolicyResponse",
}) as any as S.Schema<GetRegistryPolicyResponse>;
export interface GetRepositoryPolicyRequest {
  registryId?: string;
  repositoryName: string;
}
export const GetRepositoryPolicyRequest = S.suspend(() =>
  S.Struct({ registryId: S.optional(S.String), repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRepositoryPolicyRequest",
}) as any as S.Schema<GetRepositoryPolicyRequest>;
export type SigningRepositoryFilterType = "WILDCARD_MATCH" | (string & {});
export const SigningRepositoryFilterType = S.String;
export interface SigningRepositoryFilter {
  filter: string;
  filterType: SigningRepositoryFilterType;
}
export const SigningRepositoryFilter = S.suspend(() =>
  S.Struct({ filter: S.String, filterType: SigningRepositoryFilterType }),
).annotations({
  identifier: "SigningRepositoryFilter",
}) as any as S.Schema<SigningRepositoryFilter>;
export type SigningRepositoryFilterList = SigningRepositoryFilter[];
export const SigningRepositoryFilterList = S.Array(SigningRepositoryFilter);
export interface SigningRule {
  signingProfileArn: string;
  repositoryFilters?: SigningRepositoryFilter[];
}
export const SigningRule = S.suspend(() =>
  S.Struct({
    signingProfileArn: S.String,
    repositoryFilters: S.optional(SigningRepositoryFilterList),
  }),
).annotations({ identifier: "SigningRule" }) as any as S.Schema<SigningRule>;
export type SigningRuleList = SigningRule[];
export const SigningRuleList = S.Array(SigningRule);
export interface SigningConfiguration {
  rules: SigningRule[];
}
export const SigningConfiguration = S.suspend(() =>
  S.Struct({ rules: SigningRuleList }),
).annotations({
  identifier: "SigningConfiguration",
}) as any as S.Schema<SigningConfiguration>;
export interface GetSigningConfigurationResponse {
  registryId?: string;
  signingConfiguration?: SigningConfiguration;
}
export const GetSigningConfigurationResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    signingConfiguration: S.optional(SigningConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "GetSigningConfigurationResponse",
}) as any as S.Schema<GetSigningConfigurationResponse>;
export interface InitiateLayerUploadRequest {
  registryId?: string;
  repositoryName: string;
}
export const InitiateLayerUploadRequest = S.suspend(() =>
  S.Struct({ registryId: S.optional(S.String), repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitiateLayerUploadRequest",
}) as any as S.Schema<InitiateLayerUploadRequest>;
export interface ListPullTimeUpdateExclusionsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListPullTimeUpdateExclusionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPullTimeUpdateExclusionsRequest",
}) as any as S.Schema<ListPullTimeUpdateExclusionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface PutAccountSettingRequest {
  name: string;
  value: string;
}
export const PutAccountSettingRequest = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountSettingRequest",
}) as any as S.Schema<PutAccountSettingRequest>;
export interface PutImageRequest {
  registryId?: string;
  repositoryName: string;
  imageManifest: string;
  imageManifestMediaType?: string;
  imageTag?: string;
  imageDigest?: string;
}
export const PutImageRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageManifest: S.String,
    imageManifestMediaType: S.optional(S.String),
    imageTag: S.optional(S.String),
    imageDigest: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutImageRequest",
}) as any as S.Schema<PutImageRequest>;
export interface ImageScanningConfiguration {
  scanOnPush?: boolean;
}
export const ImageScanningConfiguration = S.suspend(() =>
  S.Struct({ scanOnPush: S.optional(S.Boolean) }),
).annotations({
  identifier: "ImageScanningConfiguration",
}) as any as S.Schema<ImageScanningConfiguration>;
export interface PutImageScanningConfigurationRequest {
  registryId?: string;
  repositoryName: string;
  imageScanningConfiguration: ImageScanningConfiguration;
}
export const PutImageScanningConfigurationRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageScanningConfiguration: ImageScanningConfiguration,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutImageScanningConfigurationRequest",
}) as any as S.Schema<PutImageScanningConfigurationRequest>;
export type ImageTagMutabilityExclusionFilterType = "WILDCARD" | (string & {});
export const ImageTagMutabilityExclusionFilterType = S.String;
export interface ImageTagMutabilityExclusionFilter {
  filterType: ImageTagMutabilityExclusionFilterType;
  filter: string;
}
export const ImageTagMutabilityExclusionFilter = S.suspend(() =>
  S.Struct({
    filterType: ImageTagMutabilityExclusionFilterType,
    filter: S.String,
  }),
).annotations({
  identifier: "ImageTagMutabilityExclusionFilter",
}) as any as S.Schema<ImageTagMutabilityExclusionFilter>;
export type ImageTagMutabilityExclusionFilters =
  ImageTagMutabilityExclusionFilter[];
export const ImageTagMutabilityExclusionFilters = S.Array(
  ImageTagMutabilityExclusionFilter,
);
export interface PutImageTagMutabilityRequest {
  registryId?: string;
  repositoryName: string;
  imageTagMutability: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
}
export const PutImageTagMutabilityRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageTagMutability: ImageTagMutability,
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutImageTagMutabilityRequest",
}) as any as S.Schema<PutImageTagMutabilityRequest>;
export interface PutLifecyclePolicyRequest {
  registryId?: string;
  repositoryName: string;
  lifecyclePolicyText: string;
}
export const PutLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    lifecyclePolicyText: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLifecyclePolicyRequest",
}) as any as S.Schema<PutLifecyclePolicyRequest>;
export interface PutRegistryPolicyRequest {
  policyText: string;
}
export const PutRegistryPolicyRequest = S.suspend(() =>
  S.Struct({ policyText: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRegistryPolicyRequest",
}) as any as S.Schema<PutRegistryPolicyRequest>;
export interface ReplicationDestination {
  region: string;
  registryId: string;
}
export const ReplicationDestination = S.suspend(() =>
  S.Struct({ region: S.String, registryId: S.String }),
).annotations({
  identifier: "ReplicationDestination",
}) as any as S.Schema<ReplicationDestination>;
export type ReplicationDestinationList = ReplicationDestination[];
export const ReplicationDestinationList = S.Array(ReplicationDestination);
export type RepositoryFilterType = "PREFIX_MATCH" | (string & {});
export const RepositoryFilterType = S.String;
export interface RepositoryFilter {
  filter: string;
  filterType: RepositoryFilterType;
}
export const RepositoryFilter = S.suspend(() =>
  S.Struct({ filter: S.String, filterType: RepositoryFilterType }),
).annotations({
  identifier: "RepositoryFilter",
}) as any as S.Schema<RepositoryFilter>;
export type RepositoryFilterList = RepositoryFilter[];
export const RepositoryFilterList = S.Array(RepositoryFilter);
export interface ReplicationRule {
  destinations: ReplicationDestination[];
  repositoryFilters?: RepositoryFilter[];
}
export const ReplicationRule = S.suspend(() =>
  S.Struct({
    destinations: ReplicationDestinationList,
    repositoryFilters: S.optional(RepositoryFilterList),
  }),
).annotations({
  identifier: "ReplicationRule",
}) as any as S.Schema<ReplicationRule>;
export type ReplicationRuleList = ReplicationRule[];
export const ReplicationRuleList = S.Array(ReplicationRule);
export interface ReplicationConfiguration {
  rules: ReplicationRule[];
}
export const ReplicationConfiguration = S.suspend(() =>
  S.Struct({ rules: ReplicationRuleList }),
).annotations({
  identifier: "ReplicationConfiguration",
}) as any as S.Schema<ReplicationConfiguration>;
export interface PutReplicationConfigurationRequest {
  replicationConfiguration: ReplicationConfiguration;
}
export const PutReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({ replicationConfiguration: ReplicationConfiguration }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutReplicationConfigurationRequest",
}) as any as S.Schema<PutReplicationConfigurationRequest>;
export interface PutSigningConfigurationRequest {
  signingConfiguration: SigningConfiguration;
}
export const PutSigningConfigurationRequest = S.suspend(() =>
  S.Struct({ signingConfiguration: SigningConfiguration }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSigningConfigurationRequest",
}) as any as S.Schema<PutSigningConfigurationRequest>;
export interface RegisterPullTimeUpdateExclusionRequest {
  principalArn: string;
}
export const RegisterPullTimeUpdateExclusionRequest = S.suspend(() =>
  S.Struct({ principalArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterPullTimeUpdateExclusionRequest",
}) as any as S.Schema<RegisterPullTimeUpdateExclusionRequest>;
export interface SetRepositoryPolicyRequest {
  registryId?: string;
  repositoryName: string;
  policyText: string;
  force?: boolean;
}
export const SetRepositoryPolicyRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    policyText: S.String,
    force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetRepositoryPolicyRequest",
}) as any as S.Schema<SetRepositoryPolicyRequest>;
export interface StartImageScanRequest {
  registryId?: string;
  repositoryName: string;
  imageId: ImageIdentifier;
}
export const StartImageScanRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageId: ImageIdentifier,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImageScanRequest",
}) as any as S.Schema<StartImageScanRequest>;
export interface StartLifecyclePolicyPreviewRequest {
  registryId?: string;
  repositoryName: string;
  lifecyclePolicyText?: string;
}
export const StartLifecyclePolicyPreviewRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    lifecyclePolicyText: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartLifecyclePolicyPreviewRequest",
}) as any as S.Schema<StartLifecyclePolicyPreviewRequest>;
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
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface UpdateImageStorageClassRequest {
  registryId?: string;
  repositoryName: string;
  imageId: ImageIdentifier;
  targetStorageClass: TargetStorageClass;
}
export const UpdateImageStorageClassRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageId: ImageIdentifier,
    targetStorageClass: TargetStorageClass,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateImageStorageClassRequest",
}) as any as S.Schema<UpdateImageStorageClassRequest>;
export interface UpdatePullThroughCacheRuleRequest {
  registryId?: string;
  ecrRepositoryPrefix: string;
  credentialArn?: string;
  customRoleArn?: string;
}
export const UpdatePullThroughCacheRuleRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    ecrRepositoryPrefix: S.String,
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullThroughCacheRuleRequest",
}) as any as S.Schema<UpdatePullThroughCacheRuleRequest>;
export type EncryptionType = "AES256" | "KMS" | "KMS_DSSE" | (string & {});
export const EncryptionType = S.String;
export interface EncryptionConfigurationForRepositoryCreationTemplate {
  encryptionType: EncryptionType;
  kmsKey?: string;
}
export const EncryptionConfigurationForRepositoryCreationTemplate = S.suspend(
  () =>
    S.Struct({ encryptionType: EncryptionType, kmsKey: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfigurationForRepositoryCreationTemplate",
}) as any as S.Schema<EncryptionConfigurationForRepositoryCreationTemplate>;
export interface UpdateRepositoryCreationTemplateRequest {
  prefix: string;
  description?: string;
  encryptionConfiguration?: EncryptionConfigurationForRepositoryCreationTemplate;
  resourceTags?: Tag[];
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
  repositoryPolicy?: string;
  lifecyclePolicy?: string;
  appliedFor?: RCTAppliedFor[];
  customRoleArn?: string;
}
export const UpdateRepositoryCreationTemplateRequest = S.suspend(() =>
  S.Struct({
    prefix: S.String,
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(
      EncryptionConfigurationForRepositoryCreationTemplate,
    ),
    resourceTags: S.optional(TagList),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
    repositoryPolicy: S.optional(S.String),
    lifecyclePolicy: S.optional(S.String),
    appliedFor: S.optional(RCTAppliedForList),
    customRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRepositoryCreationTemplateRequest",
}) as any as S.Schema<UpdateRepositoryCreationTemplateRequest>;
export interface UploadLayerPartRequest {
  registryId?: string;
  repositoryName: string;
  uploadId: string;
  partFirstByte: number;
  partLastByte: number;
  layerPartBlob: Uint8Array;
}
export const UploadLayerPartRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    uploadId: S.String,
    partFirstByte: S.Number,
    partLastByte: S.Number,
    layerPartBlob: T.Blob,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UploadLayerPartRequest",
}) as any as S.Schema<UploadLayerPartRequest>;
export interface ValidatePullThroughCacheRuleRequest {
  ecrRepositoryPrefix: string;
  registryId?: string;
}
export const ValidatePullThroughCacheRuleRequest = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.String,
    registryId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidatePullThroughCacheRuleRequest",
}) as any as S.Schema<ValidatePullThroughCacheRuleRequest>;
export type TagStatus = "TAGGED" | "UNTAGGED" | "ANY" | (string & {});
export const TagStatus = S.String;
export type ImageStatusFilter =
  | "ACTIVE"
  | "ARCHIVED"
  | "ACTIVATING"
  | "ANY"
  | (string & {});
export const ImageStatusFilter = S.String;
export type ArtifactTypeList = string[];
export const ArtifactTypeList = S.Array(S.String);
export type ArtifactStatusFilter =
  | "ACTIVE"
  | "ARCHIVED"
  | "ACTIVATING"
  | "ANY"
  | (string & {});
export const ArtifactStatusFilter = S.String;
export type ScanFrequency =
  | "SCAN_ON_PUSH"
  | "CONTINUOUS_SCAN"
  | "MANUAL"
  | (string & {});
export const ScanFrequency = S.String;
export interface EncryptionConfiguration {
  encryptionType: EncryptionType;
  kmsKey?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ encryptionType: EncryptionType, kmsKey: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface DescribeImagesFilter {
  tagStatus?: TagStatus;
  imageStatus?: ImageStatusFilter;
}
export const DescribeImagesFilter = S.suspend(() =>
  S.Struct({
    tagStatus: S.optional(TagStatus),
    imageStatus: S.optional(ImageStatusFilter),
  }),
).annotations({
  identifier: "DescribeImagesFilter",
}) as any as S.Schema<DescribeImagesFilter>;
export interface Repository {
  repositoryArn?: string;
  registryId?: string;
  repositoryName?: string;
  repositoryUri?: string;
  createdAt?: Date;
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
  imageScanningConfiguration?: ImageScanningConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const Repository = S.suspend(() =>
  S.Struct({
    repositoryArn: S.optional(S.String),
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    repositoryUri: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({ identifier: "Repository" }) as any as S.Schema<Repository>;
export type RepositoryList = Repository[];
export const RepositoryList = S.Array(Repository);
export interface RepositoryCreationTemplate {
  prefix?: string;
  description?: string;
  encryptionConfiguration?: EncryptionConfigurationForRepositoryCreationTemplate;
  resourceTags?: Tag[];
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
  repositoryPolicy?: string;
  lifecyclePolicy?: string;
  appliedFor?: RCTAppliedFor[];
  customRoleArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const RepositoryCreationTemplate = S.suspend(() =>
  S.Struct({
    prefix: S.optional(S.String),
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(
      EncryptionConfigurationForRepositoryCreationTemplate,
    ),
    resourceTags: S.optional(TagList),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
    repositoryPolicy: S.optional(S.String),
    lifecyclePolicy: S.optional(S.String),
    appliedFor: S.optional(RCTAppliedForList),
    customRoleArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "RepositoryCreationTemplate",
}) as any as S.Schema<RepositoryCreationTemplate>;
export type RepositoryCreationTemplateList = RepositoryCreationTemplate[];
export const RepositoryCreationTemplateList = S.Array(
  RepositoryCreationTemplate,
);
export interface LifecyclePolicyPreviewFilter {
  tagStatus?: TagStatus;
}
export const LifecyclePolicyPreviewFilter = S.suspend(() =>
  S.Struct({ tagStatus: S.optional(TagStatus) }),
).annotations({
  identifier: "LifecyclePolicyPreviewFilter",
}) as any as S.Schema<LifecyclePolicyPreviewFilter>;
export type ScanningRepositoryFilterType = "WILDCARD" | (string & {});
export const ScanningRepositoryFilterType = S.String;
export interface ScanningRepositoryFilter {
  filter: string;
  filterType: ScanningRepositoryFilterType;
}
export const ScanningRepositoryFilter = S.suspend(() =>
  S.Struct({ filter: S.String, filterType: ScanningRepositoryFilterType }),
).annotations({
  identifier: "ScanningRepositoryFilter",
}) as any as S.Schema<ScanningRepositoryFilter>;
export type ScanningRepositoryFilterList = ScanningRepositoryFilter[];
export const ScanningRepositoryFilterList = S.Array(ScanningRepositoryFilter);
export interface RegistryScanningRule {
  scanFrequency: ScanFrequency;
  repositoryFilters: ScanningRepositoryFilter[];
}
export const RegistryScanningRule = S.suspend(() =>
  S.Struct({
    scanFrequency: ScanFrequency,
    repositoryFilters: ScanningRepositoryFilterList,
  }),
).annotations({
  identifier: "RegistryScanningRule",
}) as any as S.Schema<RegistryScanningRule>;
export type RegistryScanningRuleList = RegistryScanningRule[];
export const RegistryScanningRuleList = S.Array(RegistryScanningRule);
export interface RegistryScanningConfiguration {
  scanType?: ScanType;
  rules?: RegistryScanningRule[];
}
export const RegistryScanningConfiguration = S.suspend(() =>
  S.Struct({
    scanType: S.optional(ScanType),
    rules: S.optional(RegistryScanningRuleList),
  }),
).annotations({
  identifier: "RegistryScanningConfiguration",
}) as any as S.Schema<RegistryScanningConfiguration>;
export interface SubjectIdentifier {
  imageDigest: string;
}
export const SubjectIdentifier = S.suspend(() =>
  S.Struct({ imageDigest: S.String }),
).annotations({
  identifier: "SubjectIdentifier",
}) as any as S.Schema<SubjectIdentifier>;
export interface ListImageReferrersFilter {
  artifactTypes?: string[];
  artifactStatus?: ArtifactStatusFilter;
}
export const ListImageReferrersFilter = S.suspend(() =>
  S.Struct({
    artifactTypes: S.optional(ArtifactTypeList),
    artifactStatus: S.optional(ArtifactStatusFilter),
  }),
).annotations({
  identifier: "ListImageReferrersFilter",
}) as any as S.Schema<ListImageReferrersFilter>;
export interface ListImagesFilter {
  tagStatus?: TagStatus;
  imageStatus?: ImageStatusFilter;
}
export const ListImagesFilter = S.suspend(() =>
  S.Struct({
    tagStatus: S.optional(TagStatus),
    imageStatus: S.optional(ImageStatusFilter),
  }),
).annotations({
  identifier: "ListImagesFilter",
}) as any as S.Schema<ListImagesFilter>;
export type PullTimeUpdateExclusionList = string[];
export const PullTimeUpdateExclusionList = S.Array(S.String);
export type LifecyclePolicyPreviewStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "EXPIRED"
  | "FAILED"
  | (string & {});
export const LifecyclePolicyPreviewStatus = S.String;
export type ImageStatus = "ACTIVE" | "ARCHIVED" | "ACTIVATING" | (string & {});
export const ImageStatus = S.String;
export interface BatchDeleteImageRequest {
  registryId?: string;
  repositoryName: string;
  imageIds: ImageIdentifier[];
}
export const BatchDeleteImageRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: ImageIdentifierList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteImageRequest",
}) as any as S.Schema<BatchDeleteImageRequest>;
export interface CompleteLayerUploadResponse {
  registryId?: string;
  repositoryName?: string;
  uploadId?: string;
  layerDigest?: string;
}
export const CompleteLayerUploadResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    uploadId: S.optional(S.String),
    layerDigest: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CompleteLayerUploadResponse",
}) as any as S.Schema<CompleteLayerUploadResponse>;
export interface CreatePullThroughCacheRuleResponse {
  ecrRepositoryPrefix?: string;
  upstreamRegistryUrl?: string;
  createdAt?: Date;
  registryId?: string;
  upstreamRegistry?: UpstreamRegistry;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
}
export const CreatePullThroughCacheRuleResponse = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.optional(S.String),
    upstreamRegistryUrl: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registryId: S.optional(S.String),
    upstreamRegistry: S.optional(UpstreamRegistry),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreatePullThroughCacheRuleResponse",
}) as any as S.Schema<CreatePullThroughCacheRuleResponse>;
export interface CreateRepositoryRequest {
  registryId?: string;
  repositoryName: string;
  tags?: Tag[];
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
  imageScanningConfiguration?: ImageScanningConfiguration;
  encryptionConfiguration?: EncryptionConfiguration;
}
export const CreateRepositoryRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    tags: S.optional(TagList),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
    encryptionConfiguration: S.optional(EncryptionConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRepositoryRequest",
}) as any as S.Schema<CreateRepositoryRequest>;
export interface CreateRepositoryCreationTemplateRequest {
  prefix: string;
  description?: string;
  encryptionConfiguration?: EncryptionConfigurationForRepositoryCreationTemplate;
  resourceTags?: Tag[];
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
  repositoryPolicy?: string;
  lifecyclePolicy?: string;
  appliedFor: RCTAppliedFor[];
  customRoleArn?: string;
}
export const CreateRepositoryCreationTemplateRequest = S.suspend(() =>
  S.Struct({
    prefix: S.String,
    description: S.optional(S.String),
    encryptionConfiguration: S.optional(
      EncryptionConfigurationForRepositoryCreationTemplate,
    ),
    resourceTags: S.optional(TagList),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
    repositoryPolicy: S.optional(S.String),
    lifecyclePolicy: S.optional(S.String),
    appliedFor: RCTAppliedForList,
    customRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRepositoryCreationTemplateRequest",
}) as any as S.Schema<CreateRepositoryCreationTemplateRequest>;
export interface DeleteLifecyclePolicyResponse {
  registryId?: string;
  repositoryName?: string;
  lifecyclePolicyText?: string;
  lastEvaluatedAt?: Date;
}
export const DeleteLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    lifecyclePolicyText: S.optional(S.String),
    lastEvaluatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeleteLifecyclePolicyResponse",
}) as any as S.Schema<DeleteLifecyclePolicyResponse>;
export interface DeletePullThroughCacheRuleResponse {
  ecrRepositoryPrefix?: string;
  upstreamRegistryUrl?: string;
  createdAt?: Date;
  registryId?: string;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
}
export const DeletePullThroughCacheRuleResponse = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.optional(S.String),
    upstreamRegistryUrl: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registryId: S.optional(S.String),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeletePullThroughCacheRuleResponse",
}) as any as S.Schema<DeletePullThroughCacheRuleResponse>;
export interface DeleteRepositoryPolicyResponse {
  registryId?: string;
  repositoryName?: string;
  policyText?: string;
}
export const DeleteRepositoryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteRepositoryPolicyResponse",
}) as any as S.Schema<DeleteRepositoryPolicyResponse>;
export interface DeregisterPullTimeUpdateExclusionResponse {
  principalArn?: string;
}
export const DeregisterPullTimeUpdateExclusionResponse = S.suspend(() =>
  S.Struct({ principalArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeregisterPullTimeUpdateExclusionResponse",
}) as any as S.Schema<DeregisterPullTimeUpdateExclusionResponse>;
export interface DescribeImagesRequest {
  registryId?: string;
  repositoryName: string;
  imageIds?: ImageIdentifier[];
  nextToken?: string;
  maxResults?: number;
  filter?: DescribeImagesFilter;
}
export const DescribeImagesRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: S.optional(ImageIdentifierList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(DescribeImagesFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeImagesRequest",
}) as any as S.Schema<DescribeImagesRequest>;
export interface DescribeRepositoriesResponse {
  repositories?: Repository[];
  nextToken?: string;
}
export const DescribeRepositoriesResponse = S.suspend(() =>
  S.Struct({
    repositories: S.optional(RepositoryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRepositoriesResponse",
}) as any as S.Schema<DescribeRepositoriesResponse>;
export interface DescribeRepositoryCreationTemplatesResponse {
  registryId?: string;
  repositoryCreationTemplates?: RepositoryCreationTemplate[];
  nextToken?: string;
}
export const DescribeRepositoryCreationTemplatesResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryCreationTemplates: S.optional(RepositoryCreationTemplateList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRepositoryCreationTemplatesResponse",
}) as any as S.Schema<DescribeRepositoryCreationTemplatesResponse>;
export interface GetAccountSettingResponse {
  name?: string;
  value?: string;
}
export const GetAccountSettingResponse = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetAccountSettingResponse",
}) as any as S.Schema<GetAccountSettingResponse>;
export interface GetDownloadUrlForLayerResponse {
  downloadUrl?: string;
  layerDigest?: string;
}
export const GetDownloadUrlForLayerResponse = S.suspend(() =>
  S.Struct({
    downloadUrl: S.optional(S.String),
    layerDigest: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDownloadUrlForLayerResponse",
}) as any as S.Schema<GetDownloadUrlForLayerResponse>;
export interface GetLifecyclePolicyResponse {
  registryId?: string;
  repositoryName?: string;
  lifecyclePolicyText?: string;
  lastEvaluatedAt?: Date;
}
export const GetLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    lifecyclePolicyText: S.optional(S.String),
    lastEvaluatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetLifecyclePolicyResponse",
}) as any as S.Schema<GetLifecyclePolicyResponse>;
export interface GetLifecyclePolicyPreviewRequest {
  registryId?: string;
  repositoryName: string;
  imageIds?: ImageIdentifier[];
  nextToken?: string;
  maxResults?: number;
  filter?: LifecyclePolicyPreviewFilter;
}
export const GetLifecyclePolicyPreviewRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    imageIds: S.optional(ImageIdentifierList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(LifecyclePolicyPreviewFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLifecyclePolicyPreviewRequest",
}) as any as S.Schema<GetLifecyclePolicyPreviewRequest>;
export interface GetRegistryScanningConfigurationResponse {
  registryId?: string;
  scanningConfiguration?: RegistryScanningConfiguration;
}
export const GetRegistryScanningConfigurationResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    scanningConfiguration: S.optional(RegistryScanningConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "GetRegistryScanningConfigurationResponse",
}) as any as S.Schema<GetRegistryScanningConfigurationResponse>;
export interface GetRepositoryPolicyResponse {
  registryId?: string;
  repositoryName?: string;
  policyText?: string;
}
export const GetRepositoryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRepositoryPolicyResponse",
}) as any as S.Schema<GetRepositoryPolicyResponse>;
export interface InitiateLayerUploadResponse {
  uploadId?: string;
  partSize?: number;
}
export const InitiateLayerUploadResponse = S.suspend(() =>
  S.Struct({
    uploadId: S.optional(S.String),
    partSize: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "InitiateLayerUploadResponse",
}) as any as S.Schema<InitiateLayerUploadResponse>;
export interface ListImageReferrersRequest {
  registryId?: string;
  repositoryName: string;
  subjectId: SubjectIdentifier;
  filter?: ListImageReferrersFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListImageReferrersRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    subjectId: SubjectIdentifier,
    filter: S.optional(ListImageReferrersFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImageReferrersRequest",
}) as any as S.Schema<ListImageReferrersRequest>;
export interface ListImagesRequest {
  registryId?: string;
  repositoryName: string;
  nextToken?: string;
  maxResults?: number;
  filter?: ListImagesFilter;
}
export const ListImagesRequest = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(ListImagesFilter),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImagesRequest",
}) as any as S.Schema<ListImagesRequest>;
export interface ListPullTimeUpdateExclusionsResponse {
  pullTimeUpdateExclusions?: string[];
  nextToken?: string;
}
export const ListPullTimeUpdateExclusionsResponse = S.suspend(() =>
  S.Struct({
    pullTimeUpdateExclusions: S.optional(PullTimeUpdateExclusionList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPullTimeUpdateExclusionsResponse",
}) as any as S.Schema<ListPullTimeUpdateExclusionsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutAccountSettingResponse {
  name?: string;
  value?: string;
}
export const PutAccountSettingResponse = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "PutAccountSettingResponse",
}) as any as S.Schema<PutAccountSettingResponse>;
export interface Image {
  registryId?: string;
  repositoryName?: string;
  imageId?: ImageIdentifier;
  imageManifest?: string;
  imageManifestMediaType?: string;
}
export const Image = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    imageManifest: S.optional(S.String),
    imageManifestMediaType: S.optional(S.String),
  }),
).annotations({ identifier: "Image" }) as any as S.Schema<Image>;
export interface PutImageResponse {
  image?: Image;
}
export const PutImageResponse = S.suspend(() =>
  S.Struct({ image: S.optional(Image) }).pipe(ns),
).annotations({
  identifier: "PutImageResponse",
}) as any as S.Schema<PutImageResponse>;
export interface PutImageScanningConfigurationResponse {
  registryId?: string;
  repositoryName?: string;
  imageScanningConfiguration?: ImageScanningConfiguration;
}
export const PutImageScanningConfigurationResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "PutImageScanningConfigurationResponse",
}) as any as S.Schema<PutImageScanningConfigurationResponse>;
export interface PutImageTagMutabilityResponse {
  registryId?: string;
  repositoryName?: string;
  imageTagMutability?: ImageTagMutability;
  imageTagMutabilityExclusionFilters?: ImageTagMutabilityExclusionFilter[];
}
export const PutImageTagMutabilityResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageTagMutability: S.optional(ImageTagMutability),
    imageTagMutabilityExclusionFilters: S.optional(
      ImageTagMutabilityExclusionFilters,
    ),
  }).pipe(ns),
).annotations({
  identifier: "PutImageTagMutabilityResponse",
}) as any as S.Schema<PutImageTagMutabilityResponse>;
export interface PutLifecyclePolicyResponse {
  registryId?: string;
  repositoryName?: string;
  lifecyclePolicyText?: string;
}
export const PutLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    lifecyclePolicyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutLifecyclePolicyResponse",
}) as any as S.Schema<PutLifecyclePolicyResponse>;
export interface PutRegistryPolicyResponse {
  registryId?: string;
  policyText?: string;
}
export const PutRegistryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutRegistryPolicyResponse",
}) as any as S.Schema<PutRegistryPolicyResponse>;
export interface PutReplicationConfigurationResponse {
  replicationConfiguration?: ReplicationConfiguration;
}
export const PutReplicationConfigurationResponse = S.suspend(() =>
  S.Struct({
    replicationConfiguration: S.optional(ReplicationConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "PutReplicationConfigurationResponse",
}) as any as S.Schema<PutReplicationConfigurationResponse>;
export interface PutSigningConfigurationResponse {
  signingConfiguration?: SigningConfiguration;
}
export const PutSigningConfigurationResponse = S.suspend(() =>
  S.Struct({ signingConfiguration: S.optional(SigningConfiguration) }).pipe(ns),
).annotations({
  identifier: "PutSigningConfigurationResponse",
}) as any as S.Schema<PutSigningConfigurationResponse>;
export interface RegisterPullTimeUpdateExclusionResponse {
  principalArn?: string;
  createdAt?: Date;
}
export const RegisterPullTimeUpdateExclusionResponse = S.suspend(() =>
  S.Struct({
    principalArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "RegisterPullTimeUpdateExclusionResponse",
}) as any as S.Schema<RegisterPullTimeUpdateExclusionResponse>;
export interface SetRepositoryPolicyResponse {
  registryId?: string;
  repositoryName?: string;
  policyText?: string;
}
export const SetRepositoryPolicyResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    policyText: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SetRepositoryPolicyResponse",
}) as any as S.Schema<SetRepositoryPolicyResponse>;
export type ScanStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "FAILED"
  | "UNSUPPORTED_IMAGE"
  | "ACTIVE"
  | "PENDING"
  | "SCAN_ELIGIBILITY_EXPIRED"
  | "FINDINGS_UNAVAILABLE"
  | "LIMIT_EXCEEDED"
  | "IMAGE_ARCHIVED"
  | (string & {});
export const ScanStatus = S.String;
export interface ImageScanStatus {
  status?: ScanStatus;
  description?: string;
}
export const ImageScanStatus = S.suspend(() =>
  S.Struct({
    status: S.optional(ScanStatus),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ImageScanStatus",
}) as any as S.Schema<ImageScanStatus>;
export interface StartImageScanResponse {
  registryId?: string;
  repositoryName?: string;
  imageId?: ImageIdentifier;
  imageScanStatus?: ImageScanStatus;
}
export const StartImageScanResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    imageScanStatus: S.optional(ImageScanStatus),
  }).pipe(ns),
).annotations({
  identifier: "StartImageScanResponse",
}) as any as S.Schema<StartImageScanResponse>;
export interface StartLifecyclePolicyPreviewResponse {
  registryId?: string;
  repositoryName?: string;
  lifecyclePolicyText?: string;
  status?: LifecyclePolicyPreviewStatus;
}
export const StartLifecyclePolicyPreviewResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    lifecyclePolicyText: S.optional(S.String),
    status: S.optional(LifecyclePolicyPreviewStatus),
  }).pipe(ns),
).annotations({
  identifier: "StartLifecyclePolicyPreviewResponse",
}) as any as S.Schema<StartLifecyclePolicyPreviewResponse>;
export interface UpdateImageStorageClassResponse {
  registryId?: string;
  repositoryName?: string;
  imageId?: ImageIdentifier;
  imageStatus?: ImageStatus;
}
export const UpdateImageStorageClassResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    imageStatus: S.optional(ImageStatus),
  }).pipe(ns),
).annotations({
  identifier: "UpdateImageStorageClassResponse",
}) as any as S.Schema<UpdateImageStorageClassResponse>;
export interface UpdatePullThroughCacheRuleResponse {
  ecrRepositoryPrefix?: string;
  registryId?: string;
  updatedAt?: Date;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
}
export const UpdatePullThroughCacheRuleResponse = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.optional(S.String),
    registryId: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdatePullThroughCacheRuleResponse",
}) as any as S.Schema<UpdatePullThroughCacheRuleResponse>;
export interface UpdateRepositoryCreationTemplateResponse {
  registryId?: string;
  repositoryCreationTemplate?: RepositoryCreationTemplate;
}
export const UpdateRepositoryCreationTemplateResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryCreationTemplate: S.optional(RepositoryCreationTemplate),
  }).pipe(ns),
).annotations({
  identifier: "UpdateRepositoryCreationTemplateResponse",
}) as any as S.Schema<UpdateRepositoryCreationTemplateResponse>;
export interface UploadLayerPartResponse {
  registryId?: string;
  repositoryName?: string;
  uploadId?: string;
  lastByteReceived?: number;
}
export const UploadLayerPartResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    uploadId: S.optional(S.String),
    lastByteReceived: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "UploadLayerPartResponse",
}) as any as S.Schema<UploadLayerPartResponse>;
export interface ValidatePullThroughCacheRuleResponse {
  ecrRepositoryPrefix?: string;
  registryId?: string;
  upstreamRegistryUrl?: string;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
  isValid?: boolean;
  failure?: string;
}
export const ValidatePullThroughCacheRuleResponse = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.optional(S.String),
    registryId: S.optional(S.String),
    upstreamRegistryUrl: S.optional(S.String),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
    isValid: S.optional(S.Boolean),
    failure: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ValidatePullThroughCacheRuleResponse",
}) as any as S.Schema<ValidatePullThroughCacheRuleResponse>;
export type LayerAvailability =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "ARCHIVED"
  | (string & {});
export const LayerAvailability = S.String;
export type LayerFailureCode =
  | "InvalidLayerDigest"
  | "MissingLayerDigest"
  | (string & {});
export const LayerFailureCode = S.String;
export type ImageFailureCode =
  | "InvalidImageDigest"
  | "InvalidImageTag"
  | "ImageTagDoesNotMatchDigest"
  | "ImageNotFound"
  | "MissingDigestAndTag"
  | "ImageReferencedByManifestList"
  | "KmsError"
  | "UpstreamAccessDenied"
  | "UpstreamTooManyRequests"
  | "UpstreamUnavailable"
  | "ImageInaccessible"
  | (string & {});
export const ImageFailureCode = S.String;
export type ScanningConfigurationFailureCode =
  | "REPOSITORY_NOT_FOUND"
  | (string & {});
export const ScanningConfigurationFailureCode = S.String;
export type ReplicationStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "FAILED"
  | (string & {});
export const ReplicationStatus = S.String;
export type SigningStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "FAILED"
  | (string & {});
export const SigningStatus = S.String;
export interface Layer {
  layerDigest?: string;
  layerAvailability?: LayerAvailability;
  layerSize?: number;
  mediaType?: string;
}
export const Layer = S.suspend(() =>
  S.Struct({
    layerDigest: S.optional(S.String),
    layerAvailability: S.optional(LayerAvailability),
    layerSize: S.optional(S.Number),
    mediaType: S.optional(S.String),
  }),
).annotations({ identifier: "Layer" }) as any as S.Schema<Layer>;
export type LayerList = Layer[];
export const LayerList = S.Array(Layer);
export interface LayerFailure {
  layerDigest?: string;
  failureCode?: LayerFailureCode;
  failureReason?: string;
}
export const LayerFailure = S.suspend(() =>
  S.Struct({
    layerDigest: S.optional(S.String),
    failureCode: S.optional(LayerFailureCode),
    failureReason: S.optional(S.String),
  }),
).annotations({ identifier: "LayerFailure" }) as any as S.Schema<LayerFailure>;
export type LayerFailureList = LayerFailure[];
export const LayerFailureList = S.Array(LayerFailure);
export type ImageList = Image[];
export const ImageList = S.Array(Image);
export interface ImageFailure {
  imageId?: ImageIdentifier;
  failureCode?: ImageFailureCode;
  failureReason?: string;
}
export const ImageFailure = S.suspend(() =>
  S.Struct({
    imageId: S.optional(ImageIdentifier),
    failureCode: S.optional(ImageFailureCode),
    failureReason: S.optional(S.String),
  }),
).annotations({ identifier: "ImageFailure" }) as any as S.Schema<ImageFailure>;
export type ImageFailureList = ImageFailure[];
export const ImageFailureList = S.Array(ImageFailure);
export interface RepositoryScanningConfiguration {
  repositoryArn?: string;
  repositoryName?: string;
  scanOnPush?: boolean;
  scanFrequency?: ScanFrequency;
  appliedScanFilters?: ScanningRepositoryFilter[];
}
export const RepositoryScanningConfiguration = S.suspend(() =>
  S.Struct({
    repositoryArn: S.optional(S.String),
    repositoryName: S.optional(S.String),
    scanOnPush: S.optional(S.Boolean),
    scanFrequency: S.optional(ScanFrequency),
    appliedScanFilters: S.optional(ScanningRepositoryFilterList),
  }),
).annotations({
  identifier: "RepositoryScanningConfiguration",
}) as any as S.Schema<RepositoryScanningConfiguration>;
export type RepositoryScanningConfigurationList =
  RepositoryScanningConfiguration[];
export const RepositoryScanningConfigurationList = S.Array(
  RepositoryScanningConfiguration,
);
export interface RepositoryScanningConfigurationFailure {
  repositoryName?: string;
  failureCode?: ScanningConfigurationFailureCode;
  failureReason?: string;
}
export const RepositoryScanningConfigurationFailure = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    failureCode: S.optional(ScanningConfigurationFailureCode),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "RepositoryScanningConfigurationFailure",
}) as any as S.Schema<RepositoryScanningConfigurationFailure>;
export type RepositoryScanningConfigurationFailureList =
  RepositoryScanningConfigurationFailure[];
export const RepositoryScanningConfigurationFailureList = S.Array(
  RepositoryScanningConfigurationFailure,
);
export interface ImageReplicationStatus {
  region?: string;
  registryId?: string;
  status?: ReplicationStatus;
  failureCode?: string;
}
export const ImageReplicationStatus = S.suspend(() =>
  S.Struct({
    region: S.optional(S.String),
    registryId: S.optional(S.String),
    status: S.optional(ReplicationStatus),
    failureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ImageReplicationStatus",
}) as any as S.Schema<ImageReplicationStatus>;
export type ImageReplicationStatusList = ImageReplicationStatus[];
export const ImageReplicationStatusList = S.Array(ImageReplicationStatus);
export interface ImageSigningStatus {
  signingProfileArn?: string;
  failureCode?: string;
  failureReason?: string;
  status?: SigningStatus;
}
export const ImageSigningStatus = S.suspend(() =>
  S.Struct({
    signingProfileArn: S.optional(S.String),
    failureCode: S.optional(S.String),
    failureReason: S.optional(S.String),
    status: S.optional(SigningStatus),
  }),
).annotations({
  identifier: "ImageSigningStatus",
}) as any as S.Schema<ImageSigningStatus>;
export type ImageSigningStatusList = ImageSigningStatus[];
export const ImageSigningStatusList = S.Array(ImageSigningStatus);
export interface PullThroughCacheRule {
  ecrRepositoryPrefix?: string;
  upstreamRegistryUrl?: string;
  createdAt?: Date;
  registryId?: string;
  credentialArn?: string;
  customRoleArn?: string;
  upstreamRepositoryPrefix?: string;
  upstreamRegistry?: UpstreamRegistry;
  updatedAt?: Date;
}
export const PullThroughCacheRule = S.suspend(() =>
  S.Struct({
    ecrRepositoryPrefix: S.optional(S.String),
    upstreamRegistryUrl: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registryId: S.optional(S.String),
    credentialArn: S.optional(S.String),
    customRoleArn: S.optional(S.String),
    upstreamRepositoryPrefix: S.optional(S.String),
    upstreamRegistry: S.optional(UpstreamRegistry),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PullThroughCacheRule",
}) as any as S.Schema<PullThroughCacheRule>;
export type PullThroughCacheRuleList = PullThroughCacheRule[];
export const PullThroughCacheRuleList = S.Array(PullThroughCacheRule);
export interface AuthorizationData {
  authorizationToken?: string;
  expiresAt?: Date;
  proxyEndpoint?: string;
}
export const AuthorizationData = S.suspend(() =>
  S.Struct({
    authorizationToken: S.optional(S.String),
    expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    proxyEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthorizationData",
}) as any as S.Schema<AuthorizationData>;
export type AuthorizationDataList = AuthorizationData[];
export const AuthorizationDataList = S.Array(AuthorizationData);
export type FindingSeverity =
  | "INFORMATIONAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | "UNDEFINED"
  | (string & {});
export const FindingSeverity = S.String;
export interface BatchCheckLayerAvailabilityResponse {
  layers?: Layer[];
  failures?: LayerFailure[];
}
export const BatchCheckLayerAvailabilityResponse = S.suspend(() =>
  S.Struct({
    layers: S.optional(LayerList),
    failures: S.optional(LayerFailureList),
  }).pipe(ns),
).annotations({
  identifier: "BatchCheckLayerAvailabilityResponse",
}) as any as S.Schema<BatchCheckLayerAvailabilityResponse>;
export interface BatchDeleteImageResponse {
  imageIds?: ImageIdentifier[];
  failures?: ImageFailure[];
}
export const BatchDeleteImageResponse = S.suspend(() =>
  S.Struct({
    imageIds: S.optional(ImageIdentifierList),
    failures: S.optional(ImageFailureList),
  }).pipe(ns),
).annotations({
  identifier: "BatchDeleteImageResponse",
}) as any as S.Schema<BatchDeleteImageResponse>;
export interface BatchGetImageResponse {
  images?: Image[];
  failures?: ImageFailure[];
}
export const BatchGetImageResponse = S.suspend(() =>
  S.Struct({
    images: S.optional(ImageList),
    failures: S.optional(ImageFailureList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetImageResponse",
}) as any as S.Schema<BatchGetImageResponse>;
export interface BatchGetRepositoryScanningConfigurationResponse {
  scanningConfigurations?: RepositoryScanningConfiguration[];
  failures?: RepositoryScanningConfigurationFailure[];
}
export const BatchGetRepositoryScanningConfigurationResponse = S.suspend(() =>
  S.Struct({
    scanningConfigurations: S.optional(RepositoryScanningConfigurationList),
    failures: S.optional(RepositoryScanningConfigurationFailureList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetRepositoryScanningConfigurationResponse",
}) as any as S.Schema<BatchGetRepositoryScanningConfigurationResponse>;
export interface CreateRepositoryResponse {
  repository?: Repository;
}
export const CreateRepositoryResponse = S.suspend(() =>
  S.Struct({ repository: S.optional(Repository) }).pipe(ns),
).annotations({
  identifier: "CreateRepositoryResponse",
}) as any as S.Schema<CreateRepositoryResponse>;
export interface CreateRepositoryCreationTemplateResponse {
  registryId?: string;
  repositoryCreationTemplate?: RepositoryCreationTemplate;
}
export const CreateRepositoryCreationTemplateResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryCreationTemplate: S.optional(RepositoryCreationTemplate),
  }).pipe(ns),
).annotations({
  identifier: "CreateRepositoryCreationTemplateResponse",
}) as any as S.Schema<CreateRepositoryCreationTemplateResponse>;
export interface DeleteRepositoryResponse {
  repository?: Repository;
}
export const DeleteRepositoryResponse = S.suspend(() =>
  S.Struct({ repository: S.optional(Repository) }).pipe(ns),
).annotations({
  identifier: "DeleteRepositoryResponse",
}) as any as S.Schema<DeleteRepositoryResponse>;
export interface DeleteRepositoryCreationTemplateResponse {
  registryId?: string;
  repositoryCreationTemplate?: RepositoryCreationTemplate;
}
export const DeleteRepositoryCreationTemplateResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryCreationTemplate: S.optional(RepositoryCreationTemplate),
  }).pipe(ns),
).annotations({
  identifier: "DeleteRepositoryCreationTemplateResponse",
}) as any as S.Schema<DeleteRepositoryCreationTemplateResponse>;
export interface DescribeImageReplicationStatusResponse {
  repositoryName?: string;
  imageId?: ImageIdentifier;
  replicationStatuses?: ImageReplicationStatus[];
}
export const DescribeImageReplicationStatusResponse = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    replicationStatuses: S.optional(ImageReplicationStatusList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImageReplicationStatusResponse",
}) as any as S.Schema<DescribeImageReplicationStatusResponse>;
export interface DescribeImageSigningStatusResponse {
  repositoryName?: string;
  imageId?: ImageIdentifier;
  registryId?: string;
  signingStatuses?: ImageSigningStatus[];
}
export const DescribeImageSigningStatusResponse = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    registryId: S.optional(S.String),
    signingStatuses: S.optional(ImageSigningStatusList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImageSigningStatusResponse",
}) as any as S.Schema<DescribeImageSigningStatusResponse>;
export interface DescribePullThroughCacheRulesResponse {
  pullThroughCacheRules?: PullThroughCacheRule[];
  nextToken?: string;
}
export const DescribePullThroughCacheRulesResponse = S.suspend(() =>
  S.Struct({
    pullThroughCacheRules: S.optional(PullThroughCacheRuleList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePullThroughCacheRulesResponse",
}) as any as S.Schema<DescribePullThroughCacheRulesResponse>;
export interface GetAuthorizationTokenResponse {
  authorizationData?: AuthorizationData[];
}
export const GetAuthorizationTokenResponse = S.suspend(() =>
  S.Struct({ authorizationData: S.optional(AuthorizationDataList) }).pipe(ns),
).annotations({
  identifier: "GetAuthorizationTokenResponse",
}) as any as S.Schema<GetAuthorizationTokenResponse>;
export interface ListImagesResponse {
  imageIds?: ImageIdentifier[];
  nextToken?: string;
}
export const ListImagesResponse = S.suspend(() =>
  S.Struct({
    imageIds: S.optional(ImageIdentifierList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImagesResponse",
}) as any as S.Schema<ListImagesResponse>;
export interface PutRegistryScanningConfigurationRequest {
  scanType?: ScanType;
  rules?: RegistryScanningRule[];
}
export const PutRegistryScanningConfigurationRequest = S.suspend(() =>
  S.Struct({
    scanType: S.optional(ScanType),
    rules: S.optional(RegistryScanningRuleList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRegistryScanningConfigurationRequest",
}) as any as S.Schema<PutRegistryScanningConfigurationRequest>;
export type ImageTagList = string[];
export const ImageTagList = S.Array(S.String);
export type FindingSeverityCounts = { [key in FindingSeverity]?: number };
export const FindingSeverityCounts = S.partial(
  S.Record({ key: FindingSeverity, value: S.UndefinedOr(S.Number) }),
);
export type LifecyclePolicyStorageClass =
  | "ARCHIVE"
  | "STANDARD"
  | (string & {});
export const LifecyclePolicyStorageClass = S.String;
export type ArtifactStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "ACTIVATING"
  | (string & {});
export const ArtifactStatus = S.String;
export type ReferenceUrlsList = string[];
export const ReferenceUrlsList = S.Array(S.String);
export type RelatedVulnerabilitiesList = string[];
export const RelatedVulnerabilitiesList = S.Array(S.String);
export interface Attribute {
  key: string;
  value?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type AttributeList = Attribute[];
export const AttributeList = S.Array(Attribute);
export type ImageActionType = "EXPIRE" | "TRANSITION" | (string & {});
export const ImageActionType = S.String;
export type LifecyclePolicyTargetStorageClass = "ARCHIVE" | (string & {});
export const LifecyclePolicyTargetStorageClass = S.String;
export interface DeleteSigningConfigurationResponse {
  registryId?: string;
  signingConfiguration?: SigningConfiguration;
}
export const DeleteSigningConfigurationResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    signingConfiguration: S.optional(SigningConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DeleteSigningConfigurationResponse",
}) as any as S.Schema<DeleteSigningConfigurationResponse>;
export interface DescribeRegistryResponse {
  registryId?: string;
  replicationConfiguration?: ReplicationConfiguration;
}
export const DescribeRegistryResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    replicationConfiguration: S.optional(ReplicationConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRegistryResponse",
}) as any as S.Schema<DescribeRegistryResponse>;
export interface PutRegistryScanningConfigurationResponse {
  registryScanningConfiguration?: RegistryScanningConfiguration;
}
export const PutRegistryScanningConfigurationResponse = S.suspend(() =>
  S.Struct({
    registryScanningConfiguration: S.optional(RegistryScanningConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "PutRegistryScanningConfigurationResponse",
}) as any as S.Schema<PutRegistryScanningConfigurationResponse>;
export interface ImageScanFindingsSummary {
  imageScanCompletedAt?: Date;
  vulnerabilitySourceUpdatedAt?: Date;
  findingSeverityCounts?: { [key: string]: number | undefined };
}
export const ImageScanFindingsSummary = S.suspend(() =>
  S.Struct({
    imageScanCompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    vulnerabilitySourceUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    findingSeverityCounts: S.optional(FindingSeverityCounts),
  }),
).annotations({
  identifier: "ImageScanFindingsSummary",
}) as any as S.Schema<ImageScanFindingsSummary>;
export interface ImageScanFinding {
  name?: string;
  description?: string;
  uri?: string;
  severity?: FindingSeverity;
  attributes?: Attribute[];
}
export const ImageScanFinding = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    uri: S.optional(S.String),
    severity: S.optional(FindingSeverity),
    attributes: S.optional(AttributeList),
  }),
).annotations({
  identifier: "ImageScanFinding",
}) as any as S.Schema<ImageScanFinding>;
export type ImageScanFindingList = ImageScanFinding[];
export const ImageScanFindingList = S.Array(ImageScanFinding);
export interface LifecyclePolicyRuleAction {
  type?: ImageActionType;
  targetStorageClass?: LifecyclePolicyTargetStorageClass;
}
export const LifecyclePolicyRuleAction = S.suspend(() =>
  S.Struct({
    type: S.optional(ImageActionType),
    targetStorageClass: S.optional(LifecyclePolicyTargetStorageClass),
  }),
).annotations({
  identifier: "LifecyclePolicyRuleAction",
}) as any as S.Schema<LifecyclePolicyRuleAction>;
export interface TransitioningImageTotalCount {
  targetStorageClass?: LifecyclePolicyTargetStorageClass;
  imageTotalCount?: number;
}
export const TransitioningImageTotalCount = S.suspend(() =>
  S.Struct({
    targetStorageClass: S.optional(LifecyclePolicyTargetStorageClass),
    imageTotalCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "TransitioningImageTotalCount",
}) as any as S.Schema<TransitioningImageTotalCount>;
export type TransitioningImageTotalCounts = TransitioningImageTotalCount[];
export const TransitioningImageTotalCounts = S.Array(
  TransitioningImageTotalCount,
);
export type Annotations = { [key: string]: string | undefined };
export const Annotations = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CvssScore {
  baseScore?: number;
  scoringVector?: string;
  source?: string;
  version?: string;
}
export const CvssScore = S.suspend(() =>
  S.Struct({
    baseScore: S.optional(S.Number),
    scoringVector: S.optional(S.String),
    source: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({ identifier: "CvssScore" }) as any as S.Schema<CvssScore>;
export type CvssScoreList = CvssScore[];
export const CvssScoreList = S.Array(CvssScore);
export interface VulnerablePackage {
  arch?: string;
  epoch?: number;
  filePath?: string;
  name?: string;
  packageManager?: string;
  release?: string;
  sourceLayerHash?: string;
  version?: string;
  fixedInVersion?: string;
}
export const VulnerablePackage = S.suspend(() =>
  S.Struct({
    arch: S.optional(S.String),
    epoch: S.optional(S.Number),
    filePath: S.optional(S.String),
    name: S.optional(S.String),
    packageManager: S.optional(S.String),
    release: S.optional(S.String),
    sourceLayerHash: S.optional(S.String),
    version: S.optional(S.String),
    fixedInVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "VulnerablePackage",
}) as any as S.Schema<VulnerablePackage>;
export type VulnerablePackagesList = VulnerablePackage[];
export const VulnerablePackagesList = S.Array(VulnerablePackage);
export interface Recommendation {
  url?: string;
  text?: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({ url: S.optional(S.String), text: S.optional(S.String) }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface ImageDetail {
  registryId?: string;
  repositoryName?: string;
  imageDigest?: string;
  imageTags?: string[];
  imageSizeInBytes?: number;
  imagePushedAt?: Date;
  imageScanStatus?: ImageScanStatus;
  imageScanFindingsSummary?: ImageScanFindingsSummary;
  imageManifestMediaType?: string;
  artifactMediaType?: string;
  lastRecordedPullTime?: Date;
  subjectManifestDigest?: string;
  imageStatus?: ImageStatus;
  lastArchivedAt?: Date;
  lastActivatedAt?: Date;
}
export const ImageDetail = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageDigest: S.optional(S.String),
    imageTags: S.optional(ImageTagList),
    imageSizeInBytes: S.optional(S.Number),
    imagePushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    imageScanStatus: S.optional(ImageScanStatus),
    imageScanFindingsSummary: S.optional(ImageScanFindingsSummary),
    imageManifestMediaType: S.optional(S.String),
    artifactMediaType: S.optional(S.String),
    lastRecordedPullTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    subjectManifestDigest: S.optional(S.String),
    imageStatus: S.optional(ImageStatus),
    lastArchivedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastActivatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ImageDetail" }) as any as S.Schema<ImageDetail>;
export type ImageDetailList = ImageDetail[];
export const ImageDetailList = S.Array(ImageDetail);
export type ImageTagsList = string[];
export const ImageTagsList = S.Array(S.String);
export interface LifecyclePolicyPreviewResult {
  imageTags?: string[];
  imageDigest?: string;
  imagePushedAt?: Date;
  action?: LifecyclePolicyRuleAction;
  appliedRulePriority?: number;
  storageClass?: LifecyclePolicyStorageClass;
}
export const LifecyclePolicyPreviewResult = S.suspend(() =>
  S.Struct({
    imageTags: S.optional(ImageTagList),
    imageDigest: S.optional(S.String),
    imagePushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    action: S.optional(LifecyclePolicyRuleAction),
    appliedRulePriority: S.optional(S.Number),
    storageClass: S.optional(LifecyclePolicyStorageClass),
  }),
).annotations({
  identifier: "LifecyclePolicyPreviewResult",
}) as any as S.Schema<LifecyclePolicyPreviewResult>;
export type LifecyclePolicyPreviewResultList = LifecyclePolicyPreviewResult[];
export const LifecyclePolicyPreviewResultList = S.Array(
  LifecyclePolicyPreviewResult,
);
export interface LifecyclePolicyPreviewSummary {
  expiringImageTotalCount?: number;
  transitioningImageTotalCounts?: TransitioningImageTotalCount[];
}
export const LifecyclePolicyPreviewSummary = S.suspend(() =>
  S.Struct({
    expiringImageTotalCount: S.optional(S.Number),
    transitioningImageTotalCounts: S.optional(TransitioningImageTotalCounts),
  }),
).annotations({
  identifier: "LifecyclePolicyPreviewSummary",
}) as any as S.Schema<LifecyclePolicyPreviewSummary>;
export interface ImageReferrer {
  digest: string;
  mediaType: string;
  artifactType?: string;
  size: number;
  annotations?: { [key: string]: string | undefined };
  artifactStatus?: ArtifactStatus;
}
export const ImageReferrer = S.suspend(() =>
  S.Struct({
    digest: S.String,
    mediaType: S.String,
    artifactType: S.optional(S.String),
    size: S.Number,
    annotations: S.optional(Annotations),
    artifactStatus: S.optional(ArtifactStatus),
  }),
).annotations({
  identifier: "ImageReferrer",
}) as any as S.Schema<ImageReferrer>;
export type ImageReferrerList = ImageReferrer[];
export const ImageReferrerList = S.Array(ImageReferrer);
export interface PackageVulnerabilityDetails {
  cvss?: CvssScore[];
  referenceUrls?: string[];
  relatedVulnerabilities?: string[];
  source?: string;
  sourceUrl?: string;
  vendorCreatedAt?: Date;
  vendorSeverity?: string;
  vendorUpdatedAt?: Date;
  vulnerabilityId?: string;
  vulnerablePackages?: VulnerablePackage[];
}
export const PackageVulnerabilityDetails = S.suspend(() =>
  S.Struct({
    cvss: S.optional(CvssScoreList),
    referenceUrls: S.optional(ReferenceUrlsList),
    relatedVulnerabilities: S.optional(RelatedVulnerabilitiesList),
    source: S.optional(S.String),
    sourceUrl: S.optional(S.String),
    vendorCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    vendorSeverity: S.optional(S.String),
    vendorUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    vulnerabilityId: S.optional(S.String),
    vulnerablePackages: S.optional(VulnerablePackagesList),
  }),
).annotations({
  identifier: "PackageVulnerabilityDetails",
}) as any as S.Schema<PackageVulnerabilityDetails>;
export interface Remediation {
  recommendation?: Recommendation;
}
export const Remediation = S.suspend(() =>
  S.Struct({ recommendation: S.optional(Recommendation) }),
).annotations({ identifier: "Remediation" }) as any as S.Schema<Remediation>;
export interface DescribeImagesResponse {
  imageDetails?: ImageDetail[];
  nextToken?: string;
}
export const DescribeImagesResponse = S.suspend(() =>
  S.Struct({
    imageDetails: S.optional(ImageDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImagesResponse",
}) as any as S.Schema<DescribeImagesResponse>;
export interface AwsEcrContainerImageDetails {
  architecture?: string;
  author?: string;
  imageHash?: string;
  imageTags?: string[];
  platform?: string;
  pushedAt?: Date;
  lastInUseAt?: Date;
  inUseCount?: number;
  registry?: string;
  repositoryName?: string;
}
export const AwsEcrContainerImageDetails = S.suspend(() =>
  S.Struct({
    architecture: S.optional(S.String),
    author: S.optional(S.String),
    imageHash: S.optional(S.String),
    imageTags: S.optional(ImageTagsList),
    platform: S.optional(S.String),
    pushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastInUseAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    inUseCount: S.optional(S.Number),
    registry: S.optional(S.String),
    repositoryName: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsEcrContainerImageDetails",
}) as any as S.Schema<AwsEcrContainerImageDetails>;
export interface CvssScoreAdjustment {
  metric?: string;
  reason?: string;
}
export const CvssScoreAdjustment = S.suspend(() =>
  S.Struct({ metric: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({
  identifier: "CvssScoreAdjustment",
}) as any as S.Schema<CvssScoreAdjustment>;
export type CvssScoreAdjustmentList = CvssScoreAdjustment[];
export const CvssScoreAdjustmentList = S.Array(CvssScoreAdjustment);
export interface GetLifecyclePolicyPreviewResponse {
  registryId?: string;
  repositoryName?: string;
  lifecyclePolicyText?: string;
  status?: LifecyclePolicyPreviewStatus;
  nextToken?: string;
  previewResults?: LifecyclePolicyPreviewResult[];
  summary?: LifecyclePolicyPreviewSummary;
}
export const GetLifecyclePolicyPreviewResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    lifecyclePolicyText: S.optional(S.String),
    status: S.optional(LifecyclePolicyPreviewStatus),
    nextToken: S.optional(S.String),
    previewResults: S.optional(LifecyclePolicyPreviewResultList),
    summary: S.optional(LifecyclePolicyPreviewSummary),
  }).pipe(ns),
).annotations({
  identifier: "GetLifecyclePolicyPreviewResponse",
}) as any as S.Schema<GetLifecyclePolicyPreviewResponse>;
export interface ListImageReferrersResponse {
  referrers?: ImageReferrer[];
  nextToken?: string;
}
export const ListImageReferrersResponse = S.suspend(() =>
  S.Struct({
    referrers: S.optional(ImageReferrerList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImageReferrersResponse",
}) as any as S.Schema<ListImageReferrersResponse>;
export interface ResourceDetails {
  awsEcrContainerImage?: AwsEcrContainerImageDetails;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({ awsEcrContainerImage: S.optional(AwsEcrContainerImageDetails) }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface CvssScoreDetails {
  adjustments?: CvssScoreAdjustment[];
  score?: number;
  scoreSource?: string;
  scoringVector?: string;
  version?: string;
}
export const CvssScoreDetails = S.suspend(() =>
  S.Struct({
    adjustments: S.optional(CvssScoreAdjustmentList),
    score: S.optional(S.Number),
    scoreSource: S.optional(S.String),
    scoringVector: S.optional(S.String),
    version: S.optional(S.String),
  }),
).annotations({
  identifier: "CvssScoreDetails",
}) as any as S.Schema<CvssScoreDetails>;
export interface Resource {
  details?: ResourceDetails;
  id?: string;
  tags?: { [key: string]: string | undefined };
  type?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    details: S.optional(ResourceDetails),
    id: S.optional(S.String),
    tags: S.optional(Tags),
    type: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type ResourceList = Resource[];
export const ResourceList = S.Array(Resource);
export interface ScoreDetails {
  cvss?: CvssScoreDetails;
}
export const ScoreDetails = S.suspend(() =>
  S.Struct({ cvss: S.optional(CvssScoreDetails) }),
).annotations({ identifier: "ScoreDetails" }) as any as S.Schema<ScoreDetails>;
export interface EnhancedImageScanFinding {
  awsAccountId?: string;
  description?: string;
  findingArn?: string;
  firstObservedAt?: Date;
  lastObservedAt?: Date;
  packageVulnerabilityDetails?: PackageVulnerabilityDetails;
  remediation?: Remediation;
  resources?: Resource[];
  score?: number;
  scoreDetails?: ScoreDetails;
  severity?: string;
  status?: string;
  title?: string;
  type?: string;
  updatedAt?: Date;
  fixAvailable?: string;
  exploitAvailable?: string;
}
export const EnhancedImageScanFinding = S.suspend(() =>
  S.Struct({
    awsAccountId: S.optional(S.String),
    description: S.optional(S.String),
    findingArn: S.optional(S.String),
    firstObservedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastObservedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    packageVulnerabilityDetails: S.optional(PackageVulnerabilityDetails),
    remediation: S.optional(Remediation),
    resources: S.optional(ResourceList),
    score: S.optional(S.Number),
    scoreDetails: S.optional(ScoreDetails),
    severity: S.optional(S.String),
    status: S.optional(S.String),
    title: S.optional(S.String),
    type: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    fixAvailable: S.optional(S.String),
    exploitAvailable: S.optional(S.String),
  }),
).annotations({
  identifier: "EnhancedImageScanFinding",
}) as any as S.Schema<EnhancedImageScanFinding>;
export type EnhancedImageScanFindingList = EnhancedImageScanFinding[];
export const EnhancedImageScanFindingList = S.Array(EnhancedImageScanFinding);
export interface ImageScanFindings {
  imageScanCompletedAt?: Date;
  vulnerabilitySourceUpdatedAt?: Date;
  findingSeverityCounts?: { [key: string]: number | undefined };
  findings?: ImageScanFinding[];
  enhancedFindings?: EnhancedImageScanFinding[];
}
export const ImageScanFindings = S.suspend(() =>
  S.Struct({
    imageScanCompletedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    vulnerabilitySourceUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    findingSeverityCounts: S.optional(FindingSeverityCounts),
    findings: S.optional(ImageScanFindingList),
    enhancedFindings: S.optional(EnhancedImageScanFindingList),
  }),
).annotations({
  identifier: "ImageScanFindings",
}) as any as S.Schema<ImageScanFindings>;
export interface DescribeImageScanFindingsResponse {
  registryId?: string;
  repositoryName?: string;
  imageId?: ImageIdentifier;
  imageScanStatus?: ImageScanStatus;
  imageScanFindings?: ImageScanFindings;
  nextToken?: string;
}
export const DescribeImageScanFindingsResponse = S.suspend(() =>
  S.Struct({
    registryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    imageId: S.optional(ImageIdentifier),
    imageScanStatus: S.optional(ImageScanStatus),
    imageScanFindings: S.optional(ImageScanFindings),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeImageScanFindingsResponse",
}) as any as S.Schema<DescribeImageScanFindingsResponse>;

//# Errors
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class EmptyUploadException extends S.TaggedError<EmptyUploadException>()(
  "EmptyUploadException",
  { message: S.optional(S.String) },
) {}
export class RegistryPolicyNotFoundException extends S.TaggedError<RegistryPolicyNotFoundException>()(
  "RegistryPolicyNotFoundException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNotFoundException extends S.TaggedError<RepositoryNotFoundException>()(
  "RepositoryNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ExclusionNotFoundException extends S.TaggedError<ExclusionNotFoundException>()(
  "ExclusionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  { message: S.optional(S.String) },
) {}
export class LayerInaccessibleException extends S.TaggedError<LayerInaccessibleException>()(
  "LayerInaccessibleException",
  { message: S.optional(S.String) },
) {}
export class LifecyclePolicyNotFoundException extends S.TaggedError<LifecyclePolicyNotFoundException>()(
  "LifecyclePolicyNotFoundException",
  { message: S.optional(S.String) },
) {}
export class KmsException extends S.TaggedError<KmsException>()(
  "KmsException",
  { message: S.optional(S.String), kmsError: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ImageAlreadyExistsException extends S.TaggedError<ImageAlreadyExistsException>()(
  "ImageAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class ExclusionAlreadyExistsException extends S.TaggedError<ExclusionAlreadyExistsException>()(
  "ExclusionAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class ImageArchivedException extends S.TaggedError<ImageArchivedException>()(
  "ImageArchivedException",
  { message: S.optional(S.String) },
) {}
export class ImageNotFoundException extends S.TaggedError<ImageNotFoundException>()(
  "ImageNotFoundException",
  { message: S.optional(S.String) },
) {}
export class PullThroughCacheRuleNotFoundException extends S.TaggedError<PullThroughCacheRuleNotFoundException>()(
  "PullThroughCacheRuleNotFoundException",
  { message: S.optional(S.String) },
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
export class InvalidTagParameterException extends S.TaggedError<InvalidTagParameterException>()(
  "InvalidTagParameterException",
  { message: S.optional(S.String) },
) {}
export class InvalidLayerException extends S.TaggedError<InvalidLayerException>()(
  "InvalidLayerException",
  { message: S.optional(S.String) },
) {}
export class RepositoryPolicyNotFoundException extends S.TaggedError<RepositoryPolicyNotFoundException>()(
  "RepositoryPolicyNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LayersNotFoundException extends S.TaggedError<LayersNotFoundException>()(
  "LayersNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ImageDigestDoesNotMatchException extends S.TaggedError<ImageDigestDoesNotMatchException>()(
  "ImageDigestDoesNotMatchException",
  { message: S.optional(S.String) },
) {}
export class ImageStorageClassUpdateNotSupportedException extends S.TaggedError<ImageStorageClassUpdateNotSupportedException>()(
  "ImageStorageClassUpdateNotSupportedException",
  { message: S.optional(S.String) },
) {}
export class SecretNotFoundException extends S.TaggedError<SecretNotFoundException>()(
  "SecretNotFoundException",
  { message: S.optional(S.String) },
) {}
export class UploadNotFoundException extends S.TaggedError<UploadNotFoundException>()(
  "UploadNotFoundException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class TemplateNotFoundException extends S.TaggedError<TemplateNotFoundException>()(
  "TemplateNotFoundException",
  { message: S.optional(S.String) },
) {}
export class SigningConfigurationNotFoundException extends S.TaggedError<SigningConfigurationNotFoundException>()(
  "SigningConfigurationNotFoundException",
  { message: S.optional(S.String) },
) {}
export class LifecyclePolicyPreviewInProgressException extends S.TaggedError<LifecyclePolicyPreviewInProgressException>()(
  "LifecyclePolicyPreviewInProgressException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNotEmptyException extends S.TaggedError<RepositoryNotEmptyException>()(
  "RepositoryNotEmptyException",
  { message: S.optional(S.String) },
) {}
export class PullThroughCacheRuleAlreadyExistsException extends S.TaggedError<PullThroughCacheRuleAlreadyExistsException>()(
  "PullThroughCacheRuleAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class UnableToGetUpstreamImageException extends S.TaggedError<UnableToGetUpstreamImageException>()(
  "UnableToGetUpstreamImageException",
  { message: S.optional(S.String) },
) {}
export class TemplateAlreadyExistsException extends S.TaggedError<TemplateAlreadyExistsException>()(
  "TemplateAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class UnsupportedImageTypeException extends S.TaggedError<UnsupportedImageTypeException>()(
  "UnsupportedImageTypeException",
  { message: S.optional(S.String) },
) {}
export class RepositoryAlreadyExistsException extends S.TaggedError<RepositoryAlreadyExistsException>()(
  "RepositoryAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class LayerAlreadyExistsException extends S.TaggedError<LayerAlreadyExistsException>()(
  "LayerAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class UnableToGetUpstreamLayerException extends S.TaggedError<UnableToGetUpstreamLayerException>()(
  "UnableToGetUpstreamLayerException",
  { message: S.optional(S.String) },
) {}
export class ImageTagAlreadyExistsException extends S.TaggedError<ImageTagAlreadyExistsException>()(
  "ImageTagAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class BlockedByOrganizationPolicyException extends S.TaggedError<BlockedByOrganizationPolicyException>()(
  "BlockedByOrganizationPolicyException",
  { message: S.optional(S.String) },
) {}
export class UnableToAccessSecretException extends S.TaggedError<UnableToAccessSecretException>()(
  "UnableToAccessSecretException",
  { message: S.optional(S.String) },
) {}
export class LayerPartTooSmallException extends S.TaggedError<LayerPartTooSmallException>()(
  "LayerPartTooSmallException",
  { message: S.optional(S.String) },
) {}
export class LifecyclePolicyPreviewNotFoundException extends S.TaggedError<LifecyclePolicyPreviewNotFoundException>()(
  "LifecyclePolicyPreviewNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ReferencedImagesNotFoundException extends S.TaggedError<ReferencedImagesNotFoundException>()(
  "ReferencedImagesNotFoundException",
  { message: S.optional(S.String) },
) {}
export class UnableToDecryptSecretValueException extends S.TaggedError<UnableToDecryptSecretValueException>()(
  "UnableToDecryptSecretValueException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedUpstreamRegistryException extends S.TaggedError<UnsupportedUpstreamRegistryException>()(
  "UnsupportedUpstreamRegistryException",
  { message: S.optional(S.String) },
) {}
export class ScanNotFoundException extends S.TaggedError<ScanNotFoundException>()(
  "ScanNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves an authorization token. An authorization token represents your IAM
 * authentication credentials and can be used to access any Amazon ECR registry that your IAM
 * principal has access to. The authorization token is valid for 12 hours.
 *
 * The `authorizationToken` returned is a base64 encoded string that can be
 * decoded and used in a `docker login` command to authenticate to a registry.
 * The CLI offers an `get-login-password` command that simplifies the login
 * process. For more information, see Registry
 * authentication in the *Amazon Elastic Container Registry User Guide*.
 */
export const getAuthorizationToken: (
  input: GetAuthorizationTokenRequest,
) => effect.Effect<
  GetAuthorizationTokenResponse,
  InvalidParameterException | ServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAuthorizationTokenRequest,
  output: GetAuthorizationTokenResponse,
  errors: [InvalidParameterException, ServerException],
}));
/**
 * Notifies Amazon ECR that you intend to upload an image layer.
 *
 * When an image is pushed, the InitiateLayerUpload API is called once per image layer
 * that has not already been uploaded. Whether or not an image layer has been uploaded is
 * determined by the BatchCheckLayerAvailability API action.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const initiateLayerUpload: (
  input: InitiateLayerUploadRequest,
) => effect.Effect<
  InitiateLayerUploadResponse,
  | InvalidParameterException
  | KmsException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateLayerUploadRequest,
  output: InitiateLayerUploadResponse,
  errors: [
    InvalidParameterException,
    KmsException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Lists all the image IDs for the specified repository.
 *
 * You can filter images based on whether or not they are tagged by using the
 * `tagStatus` filter and specifying either `TAGGED`,
 * `UNTAGGED` or `ANY`. For example, you can filter your results
 * to return only `UNTAGGED` images and then pipe that result to a BatchDeleteImage operation to delete them. Or, you can filter your
 * results to return only `TAGGED` images to list all of the tags in your
 * repository.
 */
export const listImages: {
  (
    input: ListImagesRequest,
  ): effect.Effect<
    ListImagesResponse,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListImagesRequest,
  ) => stream.Stream<
    ListImagesResponse,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListImagesRequest,
  ) => stream.Stream<
    ImageIdentifier,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImagesRequest,
  output: ListImagesResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "imageIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes image repositories in a registry.
 */
export const describeRepositories: {
  (
    input: DescribeRepositoriesRequest,
  ): effect.Effect<
    DescribeRepositoriesResponse,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRepositoriesRequest,
  ) => stream.Stream<
    DescribeRepositoriesResponse,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRepositoriesRequest,
  ) => stream.Stream<
    Repository,
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRepositoriesRequest,
  output: DescribeRepositoriesResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "repositories",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the tags for an Amazon ECR resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates the image tag mutability settings for the specified repository. For more
 * information, see Image tag
 * mutability in the *Amazon Elastic Container Registry User Guide*.
 */
export const putImageTagMutability: (
  input: PutImageTagMutabilityRequest,
) => effect.Effect<
  PutImageTagMutabilityResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutImageTagMutabilityRequest,
  output: PutImageTagMutabilityResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Applies a repository policy to the specified repository to control access permissions.
 * For more information, see Amazon ECR Repository
 * policies in the *Amazon Elastic Container Registry User Guide*.
 */
export const setRepositoryPolicy: (
  input: SetRepositoryPolicyRequest,
) => effect.Effect<
  SetRepositoryPolicyResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetRepositoryPolicyRequest,
  output: SetRepositoryPolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Checks the availability of one or more image layers in a repository.
 *
 * When an image is pushed to a repository, each image layer is checked to verify if it
 * has been uploaded before. If it has been uploaded, then the image layer is
 * skipped.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const batchCheckLayerAvailability: (
  input: BatchCheckLayerAvailabilityRequest,
) => effect.Effect<
  BatchCheckLayerAvailabilityResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCheckLayerAvailabilityRequest,
  output: BatchCheckLayerAvailabilityResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes a list of specified images within a repository. Images are specified with
 * either an `imageTag` or `imageDigest`.
 *
 * You can remove a tag from an image by specifying the image's tag in your request. When
 * you remove the last tag from an image, the image is deleted from your repository.
 *
 * You can completely delete an image (and all of its tags) by specifying the image's
 * digest in your request.
 */
export const batchDeleteImage: (
  input: BatchDeleteImageRequest,
) => effect.Effect<
  BatchDeleteImageResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteImageRequest,
  output: BatchDeleteImageResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes the repository policy associated with the specified repository.
 */
export const deleteRepositoryPolicy: (
  input: DeleteRepositoryPolicyRequest,
) => effect.Effect<
  DeleteRepositoryPolicyResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | RepositoryPolicyNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryPolicyRequest,
  output: DeleteRepositoryPolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    RepositoryPolicyNotFoundException,
    ServerException,
  ],
}));
/**
 * Returns details about the repository creation templates in a registry. The
 * `prefixes` request parameter can be used to return the details for a
 * specific repository creation template.
 */
export const describeRepositoryCreationTemplates: {
  (
    input: DescribeRepositoryCreationTemplatesRequest,
  ): effect.Effect<
    DescribeRepositoryCreationTemplatesResponse,
    | InvalidParameterException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRepositoryCreationTemplatesRequest,
  ) => stream.Stream<
    DescribeRepositoryCreationTemplatesResponse,
    | InvalidParameterException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRepositoryCreationTemplatesRequest,
  ) => stream.Stream<
    RepositoryCreationTemplate,
    | InvalidParameterException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRepositoryCreationTemplatesRequest,
  output: DescribeRepositoryCreationTemplatesResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "repositoryCreationTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Transitions an image between storage classes. You can transition images from Amazon ECR standard storage class to Amazon ECR archival storage class for long-term storage, or restore archived images back to Amazon ECR standard.
 */
export const updateImageStorageClass: (
  input: UpdateImageStorageClassRequest,
) => effect.Effect<
  UpdateImageStorageClassResponse,
  | ImageNotFoundException
  | ImageStorageClassUpdateNotSupportedException
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImageStorageClassRequest,
  output: UpdateImageStorageClassResponse,
  errors: [
    ImageNotFoundException,
    ImageStorageClassUpdateNotSupportedException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Uploads an image layer part to Amazon ECR.
 *
 * When an image is pushed, each new image layer is uploaded in parts. The maximum size
 * of each image layer part can be 20971520 bytes (or about 20MB). The UploadLayerPart API
 * is called once per each new image layer part.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const uploadLayerPart: (
  input: UploadLayerPartRequest,
) => effect.Effect<
  UploadLayerPartResponse,
  | InvalidLayerPartException
  | InvalidParameterException
  | KmsException
  | LimitExceededException
  | RepositoryNotFoundException
  | ServerException
  | UploadNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UploadLayerPartRequest,
  output: UploadLayerPartResponse,
  errors: [
    InvalidLayerPartException,
    InvalidParameterException,
    KmsException,
    LimitExceededException,
    RepositoryNotFoundException,
    ServerException,
    UploadNotFoundException,
  ],
}));
/**
 * Adds specified tags to a resource with the specified ARN. Existing tags on a resource
 * are not changed if they are not specified in the request parameters.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidParameterException
  | InvalidTagParameterException
  | RepositoryNotFoundException
  | ServerException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    RepositoryNotFoundException,
    ServerException,
    TooManyTagsException,
  ],
}));
/**
 * Retrieves the repository policy for the specified repository.
 */
export const getRepositoryPolicy: (
  input: GetRepositoryPolicyRequest,
) => effect.Effect<
  GetRepositoryPolicyResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | RepositoryPolicyNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryPolicyRequest,
  output: GetRepositoryPolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    RepositoryPolicyNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an existing repository creation template.
 */
export const updateRepositoryCreationTemplate: (
  input: UpdateRepositoryCreationTemplateRequest,
) => effect.Effect<
  UpdateRepositoryCreationTemplateResponse,
  | InvalidParameterException
  | ServerException
  | TemplateNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryCreationTemplateRequest,
  output: UpdateRepositoryCreationTemplateResponse,
  errors: [
    InvalidParameterException,
    ServerException,
    TemplateNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the registry's signing configuration, which defines
 * rules for automatically signing images using Amazon Web Services Signer.
 *
 * For more information, see Managed signing in the
 * *Amazon Elastic Container Registry User Guide*.
 */
export const getSigningConfiguration: (
  input: GetSigningConfigurationRequest,
) => effect.Effect<
  GetSigningConfigurationResponse,
  | InvalidParameterException
  | ServerException
  | SigningConfigurationNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSigningConfigurationRequest,
  output: GetSigningConfigurationResponse,
  errors: [
    InvalidParameterException,
    ServerException,
    SigningConfigurationNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the lifecycle policy for the specified repository.
 */
export const getLifecyclePolicy: (
  input: GetLifecyclePolicyRequest,
) => effect.Effect<
  GetLifecyclePolicyResponse,
  | InvalidParameterException
  | LifecyclePolicyNotFoundException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyRequest,
  output: GetLifecyclePolicyResponse,
  errors: [
    InvalidParameterException,
    LifecyclePolicyNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Lists the IAM principals that are excluded from having their image pull times recorded.
 */
export const listPullTimeUpdateExclusions: (
  input: ListPullTimeUpdateExclusionsRequest,
) => effect.Effect<
  ListPullTimeUpdateExclusionsResponse,
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPullTimeUpdateExclusionsRequest,
  output: ListPullTimeUpdateExclusionsResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Adds an IAM principal to the pull time update exclusion list for a registry. Amazon ECR will not record the pull time if an excluded principal pulls an image.
 */
export const registerPullTimeUpdateExclusion: (
  input: RegisterPullTimeUpdateExclusionRequest,
) => effect.Effect<
  RegisterPullTimeUpdateExclusionResponse,
  | ExclusionAlreadyExistsException
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterPullTimeUpdateExclusionRequest,
  output: RegisterPullTimeUpdateExclusionResponse,
  errors: [
    ExclusionAlreadyExistsException,
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Retrieves the permissions policy for a registry.
 */
export const getRegistryPolicy: (
  input: GetRegistryPolicyRequest,
) => effect.Effect<
  GetRegistryPolicyResponse,
  | InvalidParameterException
  | RegistryPolicyNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegistryPolicyRequest,
  output: GetRegistryPolicyResponse,
  errors: [
    InvalidParameterException,
    RegistryPolicyNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * The `PutImageScanningConfiguration` API is being deprecated, in favor
 * of specifying the image scanning configuration at the registry level. For more
 * information, see PutRegistryScanningConfiguration.
 *
 * Updates the image scanning configuration for the specified repository.
 */
export const putImageScanningConfiguration: (
  input: PutImageScanningConfigurationRequest,
) => effect.Effect<
  PutImageScanningConfigurationResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutImageScanningConfigurationRequest,
  output: PutImageScanningConfigurationResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the lifecycle policy for the specified repository. For more
 * information, see Lifecycle policy
 * template.
 */
export const putLifecyclePolicy: (
  input: PutLifecyclePolicyRequest,
) => effect.Effect<
  PutLifecyclePolicyResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLifecyclePolicyRequest,
  output: PutLifecyclePolicyResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Gets the scanning configuration for one or more repositories.
 */
export const batchGetRepositoryScanningConfiguration: (
  input: BatchGetRepositoryScanningConfigurationRequest,
) => effect.Effect<
  BatchGetRepositoryScanningConfigurationResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRepositoryScanningConfigurationRequest,
  output: BatchGetRepositoryScanningConfigurationResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Retrieves the account setting value for the specified setting name.
 */
export const getAccountSetting: (
  input: GetAccountSettingRequest,
) => effect.Effect<
  GetAccountSettingResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingRequest,
  output: GetAccountSettingResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Retrieves the scanning configuration for a registry.
 */
export const getRegistryScanningConfiguration: (
  input: GetRegistryScanningConfigurationRequest,
) => effect.Effect<
  GetRegistryScanningConfigurationResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegistryScanningConfigurationRequest,
  output: GetRegistryScanningConfigurationResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Creates or updates the permissions policy for your registry.
 *
 * A registry policy is used to specify permissions for another Amazon Web Services account and is used
 * when configuring cross-account replication. For more information, see Registry permissions in the *Amazon Elastic Container Registry User Guide*.
 */
export const putRegistryPolicy: (
  input: PutRegistryPolicyRequest,
) => effect.Effect<
  PutRegistryPolicyResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRegistryPolicyRequest,
  output: PutRegistryPolicyResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Creates or updates the replication configuration for a registry. The existing
 * replication configuration for a repository can be retrieved with the DescribeRegistry API action. The first time the
 * PutReplicationConfiguration API is called, a service-linked IAM role is created in
 * your account for the replication process. For more information, see Using
 * service-linked roles for Amazon ECR in the *Amazon Elastic Container Registry User Guide*.
 * For more information on the custom role for replication, see Creating an IAM role for replication.
 *
 * When configuring cross-account replication, the destination account must grant the
 * source account permission to replicate. This permission is controlled using a
 * registry permissions policy. For more information, see PutRegistryPolicy.
 */
export const putReplicationConfiguration: (
  input: PutReplicationConfigurationRequest,
) => effect.Effect<
  PutReplicationConfigurationResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutReplicationConfigurationRequest,
  output: PutReplicationConfigurationResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Creates or updates the registry's signing configuration, which defines
 * rules for automatically signing images with Amazon Web Services Signer.
 *
 * For more information, see Managed signing in the
 * *Amazon Elastic Container Registry User Guide*.
 *
 * To successfully generate a signature, the IAM principal pushing images must have
 * permission to sign payloads with the Amazon Web Services Signer signing profile referenced in the signing
 * configuration.
 */
export const putSigningConfiguration: (
  input: PutSigningConfigurationRequest,
) => effect.Effect<
  PutSigningConfigurationResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSigningConfigurationRequest,
  output: PutSigningConfigurationResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Deletes the registry permissions policy.
 */
export const deleteRegistryPolicy: (
  input: DeleteRegistryPolicyRequest,
) => effect.Effect<
  DeleteRegistryPolicyResponse,
  | InvalidParameterException
  | RegistryPolicyNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegistryPolicyRequest,
  output: DeleteRegistryPolicyResponse,
  errors: [
    InvalidParameterException,
    RegistryPolicyNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Deletes the lifecycle policy associated with the specified repository.
 */
export const deleteLifecyclePolicy: (
  input: DeleteLifecyclePolicyRequest,
) => effect.Effect<
  DeleteLifecyclePolicyResponse,
  | InvalidParameterException
  | LifecyclePolicyNotFoundException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecyclePolicyRequest,
  output: DeleteLifecyclePolicyResponse,
  errors: [
    InvalidParameterException,
    LifecyclePolicyNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Allows you to change the basic scan type version or registry policy scope.
 */
export const putAccountSetting: (
  input: PutAccountSettingRequest,
) => effect.Effect<
  PutAccountSettingResponse,
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSettingRequest,
  output: PutAccountSettingResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Removes a principal from the pull time update exclusion list for a registry. Once removed, Amazon ECR will resume updating the pull time if the specified principal pulls an image.
 */
export const deregisterPullTimeUpdateExclusion: (
  input: DeregisterPullTimeUpdateExclusionRequest,
) => effect.Effect<
  DeregisterPullTimeUpdateExclusionResponse,
  | ExclusionNotFoundException
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterPullTimeUpdateExclusionRequest,
  output: DeregisterPullTimeUpdateExclusionResponse,
  errors: [
    ExclusionNotFoundException,
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Returns the replication status for a specified image.
 */
export const describeImageReplicationStatus: (
  input: DescribeImageReplicationStatusRequest,
) => effect.Effect<
  DescribeImageReplicationStatusResponse,
  | ImageNotFoundException
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImageReplicationStatusRequest,
  output: DescribeImageReplicationStatusResponse,
  errors: [
    ImageNotFoundException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Returns the signing status for a specified image. If the image matched
 * signing rules that reference different signing profiles, a status is returned
 * for each profile.
 *
 * For more information, see Managed signing in the
 * *Amazon Elastic Container Registry User Guide*.
 */
export const describeImageSigningStatus: (
  input: DescribeImageSigningStatusRequest,
) => effect.Effect<
  DescribeImageSigningStatusResponse,
  | ImageNotFoundException
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImageSigningStatusRequest,
  output: DescribeImageSigningStatusResponse,
  errors: [
    ImageNotFoundException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Validates an existing pull through cache rule for an upstream registry that requires
 * authentication. This will retrieve the contents of the Amazon Web Services Secrets Manager secret, verify the
 * syntax, and then validate that authentication to the upstream registry is
 * successful.
 */
export const validatePullThroughCacheRule: (
  input: ValidatePullThroughCacheRuleRequest,
) => effect.Effect<
  ValidatePullThroughCacheRuleResponse,
  | InvalidParameterException
  | PullThroughCacheRuleNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidatePullThroughCacheRuleRequest,
  output: ValidatePullThroughCacheRuleResponse,
  errors: [
    InvalidParameterException,
    PullThroughCacheRuleNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Deletes a pull through cache rule.
 */
export const deletePullThroughCacheRule: (
  input: DeletePullThroughCacheRuleRequest,
) => effect.Effect<
  DeletePullThroughCacheRuleResponse,
  | InvalidParameterException
  | PullThroughCacheRuleNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePullThroughCacheRuleRequest,
  output: DeletePullThroughCacheRuleResponse,
  errors: [
    InvalidParameterException,
    PullThroughCacheRuleNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Returns the pull through cache rules for a registry.
 */
export const describePullThroughCacheRules: {
  (
    input: DescribePullThroughCacheRulesRequest,
  ): effect.Effect<
    DescribePullThroughCacheRulesResponse,
    | InvalidParameterException
    | PullThroughCacheRuleNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePullThroughCacheRulesRequest,
  ) => stream.Stream<
    DescribePullThroughCacheRulesResponse,
    | InvalidParameterException
    | PullThroughCacheRuleNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePullThroughCacheRulesRequest,
  ) => stream.Stream<
    PullThroughCacheRule,
    | InvalidParameterException
    | PullThroughCacheRuleNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePullThroughCacheRulesRequest,
  output: DescribePullThroughCacheRulesResponse,
  errors: [
    InvalidParameterException,
    PullThroughCacheRuleNotFoundException,
    ServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "pullThroughCacheRules",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes the settings for a registry. The replication configuration for a repository
 * can be created or updated with the PutReplicationConfiguration API
 * action.
 */
export const describeRegistry: (
  input: DescribeRegistryRequest,
) => effect.Effect<
  DescribeRegistryResponse,
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRegistryRequest,
  output: DescribeRegistryResponse,
  errors: [InvalidParameterException, ServerException, ValidationException],
}));
/**
 * Starts a preview of a lifecycle policy for the specified repository. This allows you
 * to see the results before associating the lifecycle policy with the repository.
 */
export const startLifecyclePolicyPreview: (
  input: StartLifecyclePolicyPreviewRequest,
) => effect.Effect<
  StartLifecyclePolicyPreviewResponse,
  | InvalidParameterException
  | LifecyclePolicyNotFoundException
  | LifecyclePolicyPreviewInProgressException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLifecyclePolicyPreviewRequest,
  output: StartLifecyclePolicyPreviewResponse,
  errors: [
    InvalidParameterException,
    LifecyclePolicyNotFoundException,
    LifecyclePolicyPreviewInProgressException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Deletes a repository. If the repository isn't empty, you must either delete the
 * contents of the repository or use the `force` option to delete the repository
 * and have Amazon ECR delete all of its contents on your behalf.
 */
export const deleteRepository: (
  input: DeleteRepositoryRequest,
) => effect.Effect<
  DeleteRepositoryResponse,
  | InvalidParameterException
  | KmsException
  | RepositoryNotEmptyException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryRequest,
  output: DeleteRepositoryResponse,
  errors: [
    InvalidParameterException,
    KmsException,
    RepositoryNotEmptyException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Gets detailed information for an image. Images are specified with either an
 * `imageTag` or `imageDigest`.
 *
 * When an image is pulled, the BatchGetImage API is called once to retrieve the image
 * manifest.
 */
export const batchGetImage: (
  input: BatchGetImageRequest,
) => effect.Effect<
  BatchGetImageResponse,
  | InvalidParameterException
  | LimitExceededException
  | RepositoryNotFoundException
  | ServerException
  | UnableToGetUpstreamImageException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetImageRequest,
  output: BatchGetImageResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    RepositoryNotFoundException,
    ServerException,
    UnableToGetUpstreamImageException,
  ],
}));
/**
 * Creates a repository creation template. This template is used to define the settings
 * for repositories created by Amazon ECR on your behalf. For example, repositories created
 * through pull through cache actions. For more information, see Private
 * repository creation templates in the
 * *Amazon Elastic Container Registry User Guide*.
 */
export const createRepositoryCreationTemplate: (
  input: CreateRepositoryCreationTemplateRequest,
) => effect.Effect<
  CreateRepositoryCreationTemplateResponse,
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | TemplateAlreadyExistsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryCreationTemplateRequest,
  output: CreateRepositoryCreationTemplateResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    TemplateAlreadyExistsException,
    ValidationException,
  ],
}));
/**
 * Starts a basic image vulnerability scan.
 *
 * A basic image scan can only be started once per 24 hours on an individual image. This
 * limit includes if an image was scanned on initial push. You can start up to 100,000
 * basic scans per 24 hours. This limit includes both scans on initial push and scans
 * initiated by the StartImageScan API. For more information, see Basic scanning in the *Amazon Elastic Container Registry User Guide*.
 */
export const startImageScan: (
  input: StartImageScanRequest,
) => effect.Effect<
  StartImageScanResponse,
  | ImageArchivedException
  | ImageNotFoundException
  | InvalidParameterException
  | LimitExceededException
  | RepositoryNotFoundException
  | ServerException
  | UnsupportedImageTypeException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImageScanRequest,
  output: StartImageScanResponse,
  errors: [
    ImageArchivedException,
    ImageNotFoundException,
    InvalidParameterException,
    LimitExceededException,
    RepositoryNotFoundException,
    ServerException,
    UnsupportedImageTypeException,
    ValidationException,
  ],
}));
/**
 * Creates a repository. For more information, see Amazon ECR repositories in the
 * *Amazon Elastic Container Registry User Guide*.
 */
export const createRepository: (
  input: CreateRepositoryRequest,
) => effect.Effect<
  CreateRepositoryResponse,
  | InvalidParameterException
  | InvalidTagParameterException
  | KmsException
  | LimitExceededException
  | RepositoryAlreadyExistsException
  | ServerException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryRequest,
  output: CreateRepositoryResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    KmsException,
    LimitExceededException,
    RepositoryAlreadyExistsException,
    ServerException,
    TooManyTagsException,
  ],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InvalidParameterException
  | InvalidTagParameterException
  | RepositoryNotFoundException
  | ServerException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    InvalidTagParameterException,
    RepositoryNotFoundException,
    ServerException,
    TooManyTagsException,
  ],
}));
/**
 * Deletes a repository creation template.
 */
export const deleteRepositoryCreationTemplate: (
  input: DeleteRepositoryCreationTemplateRequest,
) => effect.Effect<
  DeleteRepositoryCreationTemplateResponse,
  | InvalidParameterException
  | ServerException
  | TemplateNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryCreationTemplateRequest,
  output: DeleteRepositoryCreationTemplateResponse,
  errors: [
    InvalidParameterException,
    ServerException,
    TemplateNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the registry's signing configuration. Images pushed after deletion of the signing
 * configuration will no longer be automatically signed.
 *
 * For more information, see Managed signing in the
 * *Amazon Elastic Container Registry User Guide*.
 *
 * Deleting the signing configuration does not affect existing image signatures.
 */
export const deleteSigningConfiguration: (
  input: DeleteSigningConfigurationRequest,
) => effect.Effect<
  DeleteSigningConfigurationResponse,
  | ServerException
  | SigningConfigurationNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSigningConfigurationRequest,
  output: DeleteSigningConfigurationResponse,
  errors: [
    ServerException,
    SigningConfigurationNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns metadata about the images in a repository.
 *
 * Starting with Docker version 1.9, the Docker client compresses image layers before
 * pushing them to a V2 Docker registry. The output of the `docker images`
 * command shows the uncompressed image size. Therefore, Docker might return a larger
 * image than the image shown in the Amazon Web Services Management Console.
 *
 * The new version of Amazon ECR
 * *Basic Scanning* doesn't use the ImageDetail$imageScanFindingsSummary and ImageDetail$imageScanStatus attributes from the API response to
 * return scan results. Use the DescribeImageScanFindings API
 * instead. For more information about Amazon Web Services native basic scanning, see Scan
 * images for software vulnerabilities in Amazon ECR.
 */
export const describeImages: {
  (
    input: DescribeImagesRequest,
  ): effect.Effect<
    DescribeImagesResponse,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeImagesRequest,
  ) => stream.Stream<
    DescribeImagesResponse,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeImagesRequest,
  ) => stream.Stream<
    ImageDetail,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeImagesRequest,
  output: DescribeImagesResponse,
  errors: [
    ImageNotFoundException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "imageDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the pre-signed Amazon S3 download URL corresponding to an image layer. You can
 * only get URLs for image layers that are referenced in an image.
 *
 * When an image is pulled, the GetDownloadUrlForLayer API is called once per image layer
 * that is not already cached.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const getDownloadUrlForLayer: (
  input: GetDownloadUrlForLayerRequest,
) => effect.Effect<
  GetDownloadUrlForLayerResponse,
  | InvalidParameterException
  | LayerInaccessibleException
  | LayersNotFoundException
  | RepositoryNotFoundException
  | ServerException
  | UnableToGetUpstreamLayerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDownloadUrlForLayerRequest,
  output: GetDownloadUrlForLayerResponse,
  errors: [
    InvalidParameterException,
    LayerInaccessibleException,
    LayersNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    UnableToGetUpstreamLayerException,
  ],
}));
/**
 * Lists the artifacts associated with a specified subject image.
 */
export const listImageReferrers: (
  input: ListImageReferrersRequest,
) => effect.Effect<
  ListImageReferrersResponse,
  | InvalidParameterException
  | RepositoryNotFoundException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImageReferrersRequest,
  output: ListImageReferrersResponse,
  errors: [
    InvalidParameterException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the scanning configuration for your private registry.
 */
export const putRegistryScanningConfiguration: (
  input: PutRegistryScanningConfigurationRequest,
) => effect.Effect<
  PutRegistryScanningConfigurationResponse,
  | BlockedByOrganizationPolicyException
  | InvalidParameterException
  | ServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRegistryScanningConfigurationRequest,
  output: PutRegistryScanningConfigurationResponse,
  errors: [
    BlockedByOrganizationPolicyException,
    InvalidParameterException,
    ServerException,
    ValidationException,
  ],
}));
/**
 * Informs Amazon ECR that the image layer upload has completed for a specified registry,
 * repository name, and upload ID. You can optionally provide a `sha256` digest
 * of the image layer for data validation purposes.
 *
 * When an image is pushed, the CompleteLayerUpload API is called once per each new image
 * layer to verify that the upload has completed.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const completeLayerUpload: (
  input: CompleteLayerUploadRequest,
) => effect.Effect<
  CompleteLayerUploadResponse,
  | EmptyUploadException
  | InvalidLayerException
  | InvalidParameterException
  | KmsException
  | LayerAlreadyExistsException
  | LayerPartTooSmallException
  | RepositoryNotFoundException
  | ServerException
  | UploadNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteLayerUploadRequest,
  output: CompleteLayerUploadResponse,
  errors: [
    EmptyUploadException,
    InvalidLayerException,
    InvalidParameterException,
    KmsException,
    LayerAlreadyExistsException,
    LayerPartTooSmallException,
    RepositoryNotFoundException,
    ServerException,
    UploadNotFoundException,
  ],
}));
/**
 * Retrieves the results of the lifecycle policy preview request for the specified
 * repository.
 */
export const getLifecyclePolicyPreview: {
  (
    input: GetLifecyclePolicyPreviewRequest,
  ): effect.Effect<
    GetLifecyclePolicyPreviewResponse,
    | InvalidParameterException
    | LifecyclePolicyPreviewNotFoundException
    | RepositoryNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetLifecyclePolicyPreviewRequest,
  ) => stream.Stream<
    GetLifecyclePolicyPreviewResponse,
    | InvalidParameterException
    | LifecyclePolicyPreviewNotFoundException
    | RepositoryNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetLifecyclePolicyPreviewRequest,
  ) => stream.Stream<
    LifecyclePolicyPreviewResult,
    | InvalidParameterException
    | LifecyclePolicyPreviewNotFoundException
    | RepositoryNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetLifecyclePolicyPreviewRequest,
  output: GetLifecyclePolicyPreviewResponse,
  errors: [
    InvalidParameterException,
    LifecyclePolicyPreviewNotFoundException,
    RepositoryNotFoundException,
    ServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "previewResults",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates or updates the image manifest and tags associated with an image.
 *
 * When an image is pushed and all new image layers have been uploaded, the PutImage API
 * is called once to create or update the image manifest and the tags associated with the
 * image.
 *
 * This operation is used by the Amazon ECR proxy and is not generally used by
 * customers for pulling and pushing images. In most cases, you should use the `docker` CLI to pull, tag, and push images.
 */
export const putImage: (
  input: PutImageRequest,
) => effect.Effect<
  PutImageResponse,
  | ImageAlreadyExistsException
  | ImageDigestDoesNotMatchException
  | ImageTagAlreadyExistsException
  | InvalidParameterException
  | KmsException
  | LayersNotFoundException
  | LimitExceededException
  | ReferencedImagesNotFoundException
  | RepositoryNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutImageRequest,
  output: PutImageResponse,
  errors: [
    ImageAlreadyExistsException,
    ImageDigestDoesNotMatchException,
    ImageTagAlreadyExistsException,
    InvalidParameterException,
    KmsException,
    LayersNotFoundException,
    LimitExceededException,
    ReferencedImagesNotFoundException,
    RepositoryNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an existing pull through cache rule.
 */
export const updatePullThroughCacheRule: (
  input: UpdatePullThroughCacheRuleRequest,
) => effect.Effect<
  UpdatePullThroughCacheRuleResponse,
  | InvalidParameterException
  | PullThroughCacheRuleNotFoundException
  | SecretNotFoundException
  | ServerException
  | UnableToAccessSecretException
  | UnableToDecryptSecretValueException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullThroughCacheRuleRequest,
  output: UpdatePullThroughCacheRuleResponse,
  errors: [
    InvalidParameterException,
    PullThroughCacheRuleNotFoundException,
    SecretNotFoundException,
    ServerException,
    UnableToAccessSecretException,
    UnableToDecryptSecretValueException,
    ValidationException,
  ],
}));
/**
 * Creates a pull through cache rule. A pull through cache rule provides a way to cache
 * images from an upstream registry source in your Amazon ECR private registry. For more
 * information, see Using pull through cache
 * rules in the *Amazon Elastic Container Registry User Guide*.
 */
export const createPullThroughCacheRule: (
  input: CreatePullThroughCacheRuleRequest,
) => effect.Effect<
  CreatePullThroughCacheRuleResponse,
  | InvalidParameterException
  | LimitExceededException
  | PullThroughCacheRuleAlreadyExistsException
  | SecretNotFoundException
  | ServerException
  | UnableToAccessSecretException
  | UnableToDecryptSecretValueException
  | UnsupportedUpstreamRegistryException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePullThroughCacheRuleRequest,
  output: CreatePullThroughCacheRuleResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    PullThroughCacheRuleAlreadyExistsException,
    SecretNotFoundException,
    ServerException,
    UnableToAccessSecretException,
    UnableToDecryptSecretValueException,
    UnsupportedUpstreamRegistryException,
    ValidationException,
  ],
}));
/**
 * Returns the scan findings for the specified image.
 */
export const describeImageScanFindings: {
  (
    input: DescribeImageScanFindingsRequest,
  ): effect.Effect<
    DescribeImageScanFindingsResponse,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ScanNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeImageScanFindingsRequest,
  ) => stream.Stream<
    DescribeImageScanFindingsResponse,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ScanNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeImageScanFindingsRequest,
  ) => stream.Stream<
    unknown,
    | ImageNotFoundException
    | InvalidParameterException
    | RepositoryNotFoundException
    | ScanNotFoundException
    | ServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeImageScanFindingsRequest,
  output: DescribeImageScanFindingsResponse,
  errors: [
    ImageNotFoundException,
    InvalidParameterException,
    RepositoryNotFoundException,
    ScanNotFoundException,
    ServerException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));

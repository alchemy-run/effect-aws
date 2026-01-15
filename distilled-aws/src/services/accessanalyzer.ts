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
  sdkId: "AccessAnalyzer",
  serviceShapeName: "AccessAnalyzer",
});
const auth = T.AwsAuthSigv4({ name: "access-analyzer" });
const ver = T.ServiceVersion("2019-11-01");
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
              `https://access-analyzer-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://access-analyzer.${Region}.amazonaws.com`);
            }
            return e(
              `https://access-analyzer-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://access-analyzer.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://access-analyzer.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AnalyzerArn = string;
export type Name = string;
export type JobId = string;
export type AccessCheckPolicyDocument = string | redacted.Redacted<string>;
export type AccessCheckPolicyType = string;
export type AccessCheckResourceType = string;
export type AccessPreviewId = string;
export type ResourceArn = string;
export type FindingId = string;
export type Token = string;
export type ResourceType = string;
export type PrincipalArn = string;
export type FindingStatusUpdate = string;
export type Locale = string;
export type PolicyDocument = string;
export type PolicyType = string;
export type ValidatePolicyResourceType = string;
export type Type = string;
export type Action = string;
export type Resource = string;
export type ConfigurationsMapKey = string;
export type OrderBy = string;
export type RoleArn = string;
export type CheckNoNewAccessResult = string;
export type CheckNoPublicAccessResult = string;
export type RecommendationType = string;
export type Status = string;
export type FindingStatus = string;
export type FindingType = string;
export type CloudTrailArn = string;
export type AccessPreviewStatus = string;
export type ResourceControlPolicyRestriction = string;
export type JobStatus = string;
export type ValidatePolicyFindingType = string;
export type IssueCode = string;
export type LearnMoreLink = string;
export type AnalyzerStatus = string;
export type EbsUserId = string;
export type EbsGroup = string;
export type EbsSnapshotDataEncryptionKeyId = string;
export type EcrRepositoryPolicy = string;
export type IamTrustPolicy = string;
export type EfsFileSystemPolicy = string;
export type RdsDbClusterSnapshotKmsKeyId = string;
export type RdsDbSnapshotKmsKeyId = string;
export type SecretsManagerSecretKmsId = string;
export type SecretsManagerSecretPolicy = string;
export type S3BucketPolicy = string;
export type SnsTopicPolicy = string;
export type SqsQueuePolicy = string;
export type S3ExpressDirectoryBucketPolicy = string;
export type DynamodbStreamPolicy = string;
export type DynamodbTablePolicy = string;
export type CheckAccessNotGrantedResult = string;
export type AccessPreviewStatusReasonCode = string;
export type FindingSourceType = string;
export type RecommendedRemediationAction = string;
export type InternalAccessType = string;
export type PrincipalType = string;
export type ServiceControlPolicyRestriction = string;
export type JobErrorCode = string;
export type ReasonCode = string;
export type PolicyName = string;
export type KmsKeyPolicy = string;
export type KmsGrantOperation = string;
export type GranteePrincipal = string;
export type RetiringPrincipal = string;
export type IssuingAccount = string;
export type RdsDbClusterSnapshotAttributeName = string;
export type RdsDbSnapshotAttributeName = string;
export type AclPermission = string;
export type AccessPointArn = string;
export type S3ExpressDirectoryAccessPointArn = string;
export type RdsDbClusterSnapshotAccountId = string;
export type RdsDbSnapshotAccountId = string;
export type AclCanonicalId = string;
export type AclUri = string;
export type AccessPointPolicy = string;
export type KmsConstraintsKey = string;
export type KmsConstraintsValue = string;
export type AccessPreviewFindingId = string;
export type FindingChangeType = string;
export type ValidationExceptionReason = string;
export type VpcId = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type FindingIdList = string[];
export const FindingIdList = S.Array(S.String);
export interface ApplyArchiveRuleRequest {
  analyzerArn: string;
  ruleName: string;
  clientToken?: string;
}
export const ApplyArchiveRuleRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    ruleName: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/archive-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ApplyArchiveRuleRequest",
}) as any as S.Schema<ApplyArchiveRuleRequest>;
export interface ApplyArchiveRuleResponse {}
export const ApplyArchiveRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ApplyArchiveRuleResponse",
}) as any as S.Schema<ApplyArchiveRuleResponse>;
export interface CancelPolicyGenerationRequest {
  jobId: string;
}
export const CancelPolicyGenerationRequest = S.suspend(() =>
  S.Struct({ jobId: S.String.pipe(T.HttpLabel("jobId")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/policy/generation/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelPolicyGenerationRequest",
}) as any as S.Schema<CancelPolicyGenerationRequest>;
export interface CancelPolicyGenerationResponse {}
export const CancelPolicyGenerationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelPolicyGenerationResponse",
}) as any as S.Schema<CancelPolicyGenerationResponse>;
export interface CheckNoNewAccessRequest {
  newPolicyDocument: string | redacted.Redacted<string>;
  existingPolicyDocument: string | redacted.Redacted<string>;
  policyType: string;
}
export const CheckNoNewAccessRequest = S.suspend(() =>
  S.Struct({
    newPolicyDocument: SensitiveString,
    existingPolicyDocument: SensitiveString,
    policyType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/check-no-new-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckNoNewAccessRequest",
}) as any as S.Schema<CheckNoNewAccessRequest>;
export interface CheckNoPublicAccessRequest {
  policyDocument: string | redacted.Redacted<string>;
  resourceType: string;
}
export const CheckNoPublicAccessRequest = S.suspend(() =>
  S.Struct({ policyDocument: SensitiveString, resourceType: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/check-no-public-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckNoPublicAccessRequest",
}) as any as S.Schema<CheckNoPublicAccessRequest>;
export interface GenerateFindingRecommendationRequest {
  analyzerArn: string;
  id: string;
}
export const GenerateFindingRecommendationRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recommendation/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateFindingRecommendationRequest",
}) as any as S.Schema<GenerateFindingRecommendationRequest>;
export interface GenerateFindingRecommendationResponse {}
export const GenerateFindingRecommendationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "GenerateFindingRecommendationResponse",
}) as any as S.Schema<GenerateFindingRecommendationResponse>;
export interface GetAccessPreviewRequest {
  accessPreviewId: string;
  analyzerArn: string;
}
export const GetAccessPreviewRequest = S.suspend(() =>
  S.Struct({
    accessPreviewId: S.String.pipe(T.HttpLabel("accessPreviewId")),
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-preview/{accessPreviewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessPreviewRequest",
}) as any as S.Schema<GetAccessPreviewRequest>;
export interface GetAnalyzedResourceRequest {
  analyzerArn: string;
  resourceArn: string;
}
export const GetAnalyzedResourceRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/analyzed-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAnalyzedResourceRequest",
}) as any as S.Schema<GetAnalyzedResourceRequest>;
export interface GetFindingRequest {
  analyzerArn: string;
  id: string;
}
export const GetFindingRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/finding/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingRequest",
}) as any as S.Schema<GetFindingRequest>;
export interface GetFindingRecommendationRequest {
  analyzerArn: string;
  id: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetFindingRecommendationRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel("id")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recommendation/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingRecommendationRequest",
}) as any as S.Schema<GetFindingRecommendationRequest>;
export interface GetFindingsStatisticsRequest {
  analyzerArn: string;
}
export const GetFindingsStatisticsRequest = S.suspend(() =>
  S.Struct({ analyzerArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/analyzer/findings/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsStatisticsRequest",
}) as any as S.Schema<GetFindingsStatisticsRequest>;
export interface GetFindingV2Request {
  analyzerArn: string;
  id: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetFindingV2Request = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel("id")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findingv2/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingV2Request",
}) as any as S.Schema<GetFindingV2Request>;
export interface GetGeneratedPolicyRequest {
  jobId: string;
  includeResourcePlaceholders?: boolean;
  includeServiceLevelTemplate?: boolean;
}
export const GetGeneratedPolicyRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    includeResourcePlaceholders: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeResourcePlaceholders"),
    ),
    includeServiceLevelTemplate: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeServiceLevelTemplate"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy/generation/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGeneratedPolicyRequest",
}) as any as S.Schema<GetGeneratedPolicyRequest>;
export interface ListAccessPreviewsRequest {
  analyzerArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAccessPreviewsRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/access-preview" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessPreviewsRequest",
}) as any as S.Schema<ListAccessPreviewsRequest>;
export interface ListAnalyzedResourcesRequest {
  analyzerArn: string;
  resourceType?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAnalyzedResourcesRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    resourceType: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/analyzed-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnalyzedResourcesRequest",
}) as any as S.Schema<ListAnalyzedResourcesRequest>;
export type ValueList = string[];
export const ValueList = S.Array(S.String);
export interface Criterion {
  eq?: string[];
  neq?: string[];
  contains?: string[];
  exists?: boolean;
}
export const Criterion = S.suspend(() =>
  S.Struct({
    eq: S.optional(ValueList),
    neq: S.optional(ValueList),
    contains: S.optional(ValueList),
    exists: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Criterion" }) as any as S.Schema<Criterion>;
export type FilterCriteriaMap = { [key: string]: Criterion | undefined };
export const FilterCriteriaMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(Criterion),
});
export interface SortCriteria {
  attributeName?: string;
  orderBy?: string;
}
export const SortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(S.String),
    orderBy: S.optional(S.String),
  }),
).annotations({ identifier: "SortCriteria" }) as any as S.Schema<SortCriteria>;
export interface ListFindingsV2Request {
  analyzerArn: string;
  filter?: { [key: string]: Criterion | undefined };
  maxResults?: number;
  nextToken?: string;
  sort?: SortCriteria;
}
export const ListFindingsV2Request = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    sort: S.optional(SortCriteria),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingv2" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsV2Request",
}) as any as S.Schema<ListFindingsV2Request>;
export interface ListPolicyGenerationsRequest {
  principalArn?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListPolicyGenerationsRequest = S.suspend(() =>
  S.Struct({
    principalArn: S.optional(S.String).pipe(T.HttpQuery("principalArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy/generation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyGenerationsRequest",
}) as any as S.Schema<ListPolicyGenerationsRequest>;
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
export interface StartResourceScanRequest {
  analyzerArn: string;
  resourceArn: string;
  resourceOwnerAccount?: string;
}
export const StartResourceScanRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    resourceArn: S.String,
    resourceOwnerAccount: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resource/scan" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartResourceScanRequest",
}) as any as S.Schema<StartResourceScanRequest>;
export interface StartResourceScanResponse {}
export const StartResourceScanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartResourceScanResponse",
}) as any as S.Schema<StartResourceScanResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateFindingsRequest {
  analyzerArn: string;
  status: string;
  ids?: string[];
  resourceArn?: string;
  clientToken?: string;
}
export const UpdateFindingsRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    status: S.String,
    ids: S.optional(FindingIdList),
    resourceArn: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/finding" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFindingsRequest",
}) as any as S.Schema<UpdateFindingsRequest>;
export interface UpdateFindingsResponse {}
export const UpdateFindingsResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateFindingsResponse" },
) as any as S.Schema<UpdateFindingsResponse>;
export interface ValidatePolicyRequest {
  locale?: string;
  maxResults?: number;
  nextToken?: string;
  policyDocument: string;
  policyType: string;
  validatePolicyResourceType?: string;
}
export const ValidatePolicyRequest = S.suspend(() =>
  S.Struct({
    locale: S.optional(S.String),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    policyDocument: S.String,
    policyType: S.String,
    validatePolicyResourceType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/validation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidatePolicyRequest",
}) as any as S.Schema<ValidatePolicyRequest>;
export interface GetAnalyzerRequest {
  analyzerName: string;
}
export const GetAnalyzerRequest = S.suspend(() =>
  S.Struct({ analyzerName: S.String.pipe(T.HttpLabel("analyzerName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/analyzer/{analyzerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAnalyzerRequest",
}) as any as S.Schema<GetAnalyzerRequest>;
export type AccountIdsList = string[];
export const AccountIdsList = S.Array(S.String);
export type TagsMap = { [key: string]: string | undefined };
export const TagsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type TagsList = { [key: string]: string | undefined }[];
export const TagsList = S.Array(TagsMap);
export interface AnalysisRuleCriteria {
  accountIds?: string[];
  resourceTags?: { [key: string]: string | undefined }[];
}
export const AnalysisRuleCriteria = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIdsList),
    resourceTags: S.optional(TagsList),
  }),
).annotations({
  identifier: "AnalysisRuleCriteria",
}) as any as S.Schema<AnalysisRuleCriteria>;
export type AnalysisRuleCriteriaList = AnalysisRuleCriteria[];
export const AnalysisRuleCriteriaList = S.Array(AnalysisRuleCriteria);
export interface AnalysisRule {
  exclusions?: AnalysisRuleCriteria[];
}
export const AnalysisRule = S.suspend(() =>
  S.Struct({ exclusions: S.optional(AnalysisRuleCriteriaList) }),
).annotations({ identifier: "AnalysisRule" }) as any as S.Schema<AnalysisRule>;
export interface UnusedAccessConfiguration {
  unusedAccessAge?: number;
  analysisRule?: AnalysisRule;
}
export const UnusedAccessConfiguration = S.suspend(() =>
  S.Struct({
    unusedAccessAge: S.optional(S.Number),
    analysisRule: S.optional(AnalysisRule),
  }),
).annotations({
  identifier: "UnusedAccessConfiguration",
}) as any as S.Schema<UnusedAccessConfiguration>;
export type ResourceTypeList = string[];
export const ResourceTypeList = S.Array(S.String);
export type ResourceArnsList = string[];
export const ResourceArnsList = S.Array(S.String);
export interface InternalAccessAnalysisRuleCriteria {
  accountIds?: string[];
  resourceTypes?: string[];
  resourceArns?: string[];
}
export const InternalAccessAnalysisRuleCriteria = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIdsList),
    resourceTypes: S.optional(ResourceTypeList),
    resourceArns: S.optional(ResourceArnsList),
  }),
).annotations({
  identifier: "InternalAccessAnalysisRuleCriteria",
}) as any as S.Schema<InternalAccessAnalysisRuleCriteria>;
export type InternalAccessAnalysisRuleCriteriaList =
  InternalAccessAnalysisRuleCriteria[];
export const InternalAccessAnalysisRuleCriteriaList = S.Array(
  InternalAccessAnalysisRuleCriteria,
);
export interface InternalAccessAnalysisRule {
  inclusions?: InternalAccessAnalysisRuleCriteria[];
}
export const InternalAccessAnalysisRule = S.suspend(() =>
  S.Struct({ inclusions: S.optional(InternalAccessAnalysisRuleCriteriaList) }),
).annotations({
  identifier: "InternalAccessAnalysisRule",
}) as any as S.Schema<InternalAccessAnalysisRule>;
export interface InternalAccessConfiguration {
  analysisRule?: InternalAccessAnalysisRule;
}
export const InternalAccessConfiguration = S.suspend(() =>
  S.Struct({ analysisRule: S.optional(InternalAccessAnalysisRule) }),
).annotations({
  identifier: "InternalAccessConfiguration",
}) as any as S.Schema<InternalAccessConfiguration>;
export type AnalyzerConfiguration =
  | { unusedAccess: UnusedAccessConfiguration; internalAccess?: never }
  | { unusedAccess?: never; internalAccess: InternalAccessConfiguration };
export const AnalyzerConfiguration = S.Union(
  S.Struct({ unusedAccess: UnusedAccessConfiguration }),
  S.Struct({ internalAccess: InternalAccessConfiguration }),
);
export interface UpdateAnalyzerRequest {
  analyzerName: string;
  configuration?: AnalyzerConfiguration;
}
export const UpdateAnalyzerRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    configuration: S.optional(AnalyzerConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/analyzer/{analyzerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAnalyzerRequest",
}) as any as S.Schema<UpdateAnalyzerRequest>;
export interface DeleteAnalyzerRequest {
  analyzerName: string;
  clientToken?: string;
}
export const DeleteAnalyzerRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/analyzer/{analyzerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAnalyzerRequest",
}) as any as S.Schema<DeleteAnalyzerRequest>;
export interface DeleteAnalyzerResponse {}
export const DeleteAnalyzerResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteAnalyzerResponse" },
) as any as S.Schema<DeleteAnalyzerResponse>;
export interface ListAnalyzersRequest {
  nextToken?: string;
  maxResults?: number;
  type?: string;
}
export const ListAnalyzersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/analyzer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnalyzersRequest",
}) as any as S.Schema<ListAnalyzersRequest>;
export interface CreateArchiveRuleRequest {
  analyzerName: string;
  ruleName: string;
  filter: { [key: string]: Criterion | undefined };
  clientToken?: string;
}
export const CreateArchiveRuleRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    ruleName: S.String,
    filter: FilterCriteriaMap,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/analyzer/{analyzerName}/archive-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateArchiveRuleRequest",
}) as any as S.Schema<CreateArchiveRuleRequest>;
export interface CreateArchiveRuleResponse {}
export const CreateArchiveRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateArchiveRuleResponse",
}) as any as S.Schema<CreateArchiveRuleResponse>;
export interface GetArchiveRuleRequest {
  analyzerName: string;
  ruleName: string;
}
export const GetArchiveRuleRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    ruleName: S.String.pipe(T.HttpLabel("ruleName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/analyzer/{analyzerName}/archive-rule/{ruleName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetArchiveRuleRequest",
}) as any as S.Schema<GetArchiveRuleRequest>;
export interface UpdateArchiveRuleRequest {
  analyzerName: string;
  ruleName: string;
  filter: { [key: string]: Criterion | undefined };
  clientToken?: string;
}
export const UpdateArchiveRuleRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    ruleName: S.String.pipe(T.HttpLabel("ruleName")),
    filter: FilterCriteriaMap,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/analyzer/{analyzerName}/archive-rule/{ruleName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateArchiveRuleRequest",
}) as any as S.Schema<UpdateArchiveRuleRequest>;
export interface UpdateArchiveRuleResponse {}
export const UpdateArchiveRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateArchiveRuleResponse",
}) as any as S.Schema<UpdateArchiveRuleResponse>;
export interface DeleteArchiveRuleRequest {
  analyzerName: string;
  ruleName: string;
  clientToken?: string;
}
export const DeleteArchiveRuleRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    ruleName: S.String.pipe(T.HttpLabel("ruleName")),
    clientToken: S.optional(S.String).pipe(
      T.HttpQuery("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/analyzer/{analyzerName}/archive-rule/{ruleName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteArchiveRuleRequest",
}) as any as S.Schema<DeleteArchiveRuleRequest>;
export interface DeleteArchiveRuleResponse {}
export const DeleteArchiveRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteArchiveRuleResponse",
}) as any as S.Schema<DeleteArchiveRuleResponse>;
export interface ListArchiveRulesRequest {
  analyzerName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListArchiveRulesRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String.pipe(T.HttpLabel("analyzerName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/analyzer/{analyzerName}/archive-rule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListArchiveRulesRequest",
}) as any as S.Schema<ListArchiveRulesRequest>;
export type ActionsList = string[];
export const ActionsList = S.Array(S.String);
export type ResourcesList = string[];
export const ResourcesList = S.Array(S.String);
export interface Access {
  actions?: string[];
  resources?: string[];
}
export const Access = S.suspend(() =>
  S.Struct({
    actions: S.optional(ActionsList),
    resources: S.optional(ResourcesList),
  }),
).annotations({ identifier: "Access" }) as any as S.Schema<Access>;
export type AccessList = Access[];
export const AccessList = S.Array(Access);
export interface PolicyGenerationDetails {
  principalArn: string;
}
export const PolicyGenerationDetails = S.suspend(() =>
  S.Struct({ principalArn: S.String }),
).annotations({
  identifier: "PolicyGenerationDetails",
}) as any as S.Schema<PolicyGenerationDetails>;
export interface InlineArchiveRule {
  ruleName: string;
  filter: { [key: string]: Criterion | undefined };
}
export const InlineArchiveRule = S.suspend(() =>
  S.Struct({ ruleName: S.String, filter: FilterCriteriaMap }),
).annotations({
  identifier: "InlineArchiveRule",
}) as any as S.Schema<InlineArchiveRule>;
export type InlineArchiveRulesList = InlineArchiveRule[];
export const InlineArchiveRulesList = S.Array(InlineArchiveRule);
export interface StatusReason {
  code: string;
}
export const StatusReason = S.suspend(() =>
  S.Struct({ code: S.String }),
).annotations({ identifier: "StatusReason" }) as any as S.Schema<StatusReason>;
export interface AnalyzerSummary {
  arn: string;
  name: string;
  type: string;
  createdAt: Date;
  lastResourceAnalyzed?: string;
  lastResourceAnalyzedAt?: Date;
  tags?: { [key: string]: string | undefined };
  status: string;
  statusReason?: StatusReason;
  configuration?: AnalyzerConfiguration;
}
export const AnalyzerSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    type: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastResourceAnalyzed: S.optional(S.String),
    lastResourceAnalyzedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    tags: S.optional(TagsMap),
    status: S.String,
    statusReason: S.optional(StatusReason),
    configuration: S.optional(AnalyzerConfiguration),
  }),
).annotations({
  identifier: "AnalyzerSummary",
}) as any as S.Schema<AnalyzerSummary>;
export type AnalyzersList = AnalyzerSummary[];
export const AnalyzersList = S.Array(AnalyzerSummary);
export interface ArchiveRuleSummary {
  ruleName: string;
  filter: { [key: string]: Criterion | undefined };
  createdAt: Date;
  updatedAt: Date;
}
export const ArchiveRuleSummary = S.suspend(() =>
  S.Struct({
    ruleName: S.String,
    filter: FilterCriteriaMap,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ArchiveRuleSummary",
}) as any as S.Schema<ArchiveRuleSummary>;
export type ArchiveRulesList = ArchiveRuleSummary[];
export const ArchiveRulesList = S.Array(ArchiveRuleSummary);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export interface CheckAccessNotGrantedRequest {
  policyDocument: string | redacted.Redacted<string>;
  access: Access[];
  policyType: string;
}
export const CheckAccessNotGrantedRequest = S.suspend(() =>
  S.Struct({
    policyDocument: SensitiveString,
    access: AccessList,
    policyType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policy/check-access-not-granted" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CheckAccessNotGrantedRequest",
}) as any as S.Schema<CheckAccessNotGrantedRequest>;
export interface ReasonSummary {
  description?: string;
  statementIndex?: number;
  statementId?: string;
}
export const ReasonSummary = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    statementIndex: S.optional(S.Number),
    statementId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReasonSummary",
}) as any as S.Schema<ReasonSummary>;
export type ReasonSummaryList = ReasonSummary[];
export const ReasonSummaryList = S.Array(ReasonSummary);
export interface CheckNoPublicAccessResponse {
  result?: string;
  message?: string;
  reasons?: ReasonSummary[];
}
export const CheckNoPublicAccessResponse = S.suspend(() =>
  S.Struct({
    result: S.optional(S.String),
    message: S.optional(S.String),
    reasons: S.optional(ReasonSummaryList),
  }),
).annotations({
  identifier: "CheckNoPublicAccessResponse",
}) as any as S.Schema<CheckNoPublicAccessResponse>;
export interface ListFindingsRequest {
  analyzerArn: string;
  filter?: { [key: string]: Criterion | undefined };
  sort?: SortCriteria;
  nextToken?: string;
  maxResults?: number;
}
export const ListFindingsRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    sort: S.optional(SortCriteria),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/finding" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsRequest",
}) as any as S.Schema<ListFindingsRequest>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
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
export interface UpdateAnalyzerResponse {
  configuration?: AnalyzerConfiguration;
}
export const UpdateAnalyzerResponse = S.suspend(() =>
  S.Struct({ configuration: S.optional(AnalyzerConfiguration) }),
).annotations({
  identifier: "UpdateAnalyzerResponse",
}) as any as S.Schema<UpdateAnalyzerResponse>;
export interface ListAnalyzersResponse {
  analyzers: AnalyzerSummary[];
  nextToken?: string;
}
export const ListAnalyzersResponse = S.suspend(() =>
  S.Struct({ analyzers: AnalyzersList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAnalyzersResponse",
}) as any as S.Schema<ListAnalyzersResponse>;
export interface ListArchiveRulesResponse {
  archiveRules: ArchiveRuleSummary[];
  nextToken?: string;
}
export const ListArchiveRulesResponse = S.suspend(() =>
  S.Struct({ archiveRules: ArchiveRulesList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListArchiveRulesResponse",
}) as any as S.Schema<ListArchiveRulesResponse>;
export type ActionList = string[];
export const ActionList = S.Array(S.String);
export type SharedViaList = string[];
export const SharedViaList = S.Array(S.String);
export interface Trail {
  cloudTrailArn: string;
  regions?: string[];
  allRegions?: boolean;
}
export const Trail = S.suspend(() =>
  S.Struct({
    cloudTrailArn: S.String,
    regions: S.optional(RegionList),
    allRegions: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Trail" }) as any as S.Schema<Trail>;
export type TrailList = Trail[];
export const TrailList = S.Array(Trail);
export type EbsUserIdList = string[];
export const EbsUserIdList = S.Array(S.String);
export type EbsGroupList = string[];
export const EbsGroupList = S.Array(S.String);
export interface AnalyzedResource {
  resourceArn: string;
  resourceType: string;
  createdAt: Date;
  analyzedAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  actions?: string[];
  sharedVia?: string[];
  status?: string;
  resourceOwnerAccount: string;
  error?: string;
}
export const AnalyzedResource = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    resourceType: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    isPublic: S.Boolean,
    actions: S.optional(ActionList),
    sharedVia: S.optional(SharedViaList),
    status: S.optional(S.String),
    resourceOwnerAccount: S.String,
    error: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyzedResource",
}) as any as S.Schema<AnalyzedResource>;
export interface RecommendationError {
  code: string;
  message: string;
}
export const RecommendationError = S.suspend(() =>
  S.Struct({ code: S.String, message: S.String }),
).annotations({
  identifier: "RecommendationError",
}) as any as S.Schema<RecommendationError>;
export interface AccessPreviewStatusReason {
  code: string;
}
export const AccessPreviewStatusReason = S.suspend(() =>
  S.Struct({ code: S.String }),
).annotations({
  identifier: "AccessPreviewStatusReason",
}) as any as S.Schema<AccessPreviewStatusReason>;
export interface AccessPreviewSummary {
  id: string;
  analyzerArn: string;
  createdAt: Date;
  status: string;
  statusReason?: AccessPreviewStatusReason;
}
export const AccessPreviewSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    analyzerArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    statusReason: S.optional(AccessPreviewStatusReason),
  }),
).annotations({
  identifier: "AccessPreviewSummary",
}) as any as S.Schema<AccessPreviewSummary>;
export type AccessPreviewsList = AccessPreviewSummary[];
export const AccessPreviewsList = S.Array(AccessPreviewSummary);
export interface AnalyzedResourceSummary {
  resourceArn: string;
  resourceOwnerAccount: string;
  resourceType: string;
}
export const AnalyzedResourceSummary = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    resourceOwnerAccount: S.String,
    resourceType: S.String,
  }),
).annotations({
  identifier: "AnalyzedResourceSummary",
}) as any as S.Schema<AnalyzedResourceSummary>;
export type AnalyzedResourcesList = AnalyzedResourceSummary[];
export const AnalyzedResourcesList = S.Array(AnalyzedResourceSummary);
export interface FindingSummaryV2 {
  analyzedAt: Date;
  createdAt: Date;
  error?: string;
  id: string;
  resource?: string;
  resourceType: string;
  resourceOwnerAccount: string;
  status: string;
  updatedAt: Date;
  findingType?: string;
}
export const FindingSummaryV2 = S.suspend(() =>
  S.Struct({
    analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    error: S.optional(S.String),
    id: S.String,
    resource: S.optional(S.String),
    resourceType: S.String,
    resourceOwnerAccount: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    findingType: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingSummaryV2",
}) as any as S.Schema<FindingSummaryV2>;
export type FindingsListV2 = FindingSummaryV2[];
export const FindingsListV2 = S.Array(FindingSummaryV2);
export interface PolicyGeneration {
  jobId: string;
  principalArn: string;
  status: string;
  startedOn: Date;
  completedOn?: Date;
}
export const PolicyGeneration = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    principalArn: S.String,
    status: S.String,
    startedOn: S.Date.pipe(T.TimestampFormat("date-time")),
    completedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PolicyGeneration",
}) as any as S.Schema<PolicyGeneration>;
export type PolicyGenerationList = PolicyGeneration[];
export const PolicyGenerationList = S.Array(PolicyGeneration);
export interface CloudTrailDetails {
  trails: Trail[];
  accessRole: string;
  startTime: Date;
  endTime?: Date;
}
export const CloudTrailDetails = S.suspend(() =>
  S.Struct({
    trails: TrailList,
    accessRole: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CloudTrailDetails",
}) as any as S.Schema<CloudTrailDetails>;
export interface EbsSnapshotConfiguration {
  userIds?: string[];
  groups?: string[];
  kmsKeyId?: string;
}
export const EbsSnapshotConfiguration = S.suspend(() =>
  S.Struct({
    userIds: S.optional(EbsUserIdList),
    groups: S.optional(EbsGroupList),
    kmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "EbsSnapshotConfiguration",
}) as any as S.Schema<EbsSnapshotConfiguration>;
export interface EcrRepositoryConfiguration {
  repositoryPolicy?: string;
}
export const EcrRepositoryConfiguration = S.suspend(() =>
  S.Struct({ repositoryPolicy: S.optional(S.String) }),
).annotations({
  identifier: "EcrRepositoryConfiguration",
}) as any as S.Schema<EcrRepositoryConfiguration>;
export interface IamRoleConfiguration {
  trustPolicy?: string;
}
export const IamRoleConfiguration = S.suspend(() =>
  S.Struct({ trustPolicy: S.optional(S.String) }),
).annotations({
  identifier: "IamRoleConfiguration",
}) as any as S.Schema<IamRoleConfiguration>;
export interface EfsFileSystemConfiguration {
  fileSystemPolicy?: string;
}
export const EfsFileSystemConfiguration = S.suspend(() =>
  S.Struct({ fileSystemPolicy: S.optional(S.String) }),
).annotations({
  identifier: "EfsFileSystemConfiguration",
}) as any as S.Schema<EfsFileSystemConfiguration>;
export interface SecretsManagerSecretConfiguration {
  kmsKeyId?: string;
  secretPolicy?: string;
}
export const SecretsManagerSecretConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    secretPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "SecretsManagerSecretConfiguration",
}) as any as S.Schema<SecretsManagerSecretConfiguration>;
export interface SnsTopicConfiguration {
  topicPolicy?: string;
}
export const SnsTopicConfiguration = S.suspend(() =>
  S.Struct({ topicPolicy: S.optional(S.String) }),
).annotations({
  identifier: "SnsTopicConfiguration",
}) as any as S.Schema<SnsTopicConfiguration>;
export interface SqsQueueConfiguration {
  queuePolicy?: string;
}
export const SqsQueueConfiguration = S.suspend(() =>
  S.Struct({ queuePolicy: S.optional(S.String) }),
).annotations({
  identifier: "SqsQueueConfiguration",
}) as any as S.Schema<SqsQueueConfiguration>;
export interface DynamodbStreamConfiguration {
  streamPolicy?: string;
}
export const DynamodbStreamConfiguration = S.suspend(() =>
  S.Struct({ streamPolicy: S.optional(S.String) }),
).annotations({
  identifier: "DynamodbStreamConfiguration",
}) as any as S.Schema<DynamodbStreamConfiguration>;
export interface DynamodbTableConfiguration {
  tablePolicy?: string;
}
export const DynamodbTableConfiguration = S.suspend(() =>
  S.Struct({ tablePolicy: S.optional(S.String) }),
).annotations({
  identifier: "DynamodbTableConfiguration",
}) as any as S.Schema<DynamodbTableConfiguration>;
export interface CheckAccessNotGrantedResponse {
  result?: string;
  message?: string;
  reasons?: ReasonSummary[];
}
export const CheckAccessNotGrantedResponse = S.suspend(() =>
  S.Struct({
    result: S.optional(S.String),
    message: S.optional(S.String),
    reasons: S.optional(ReasonSummaryList),
  }),
).annotations({
  identifier: "CheckAccessNotGrantedResponse",
}) as any as S.Schema<CheckAccessNotGrantedResponse>;
export interface CheckNoNewAccessResponse {
  result?: string;
  message?: string;
  reasons?: ReasonSummary[];
}
export const CheckNoNewAccessResponse = S.suspend(() =>
  S.Struct({
    result: S.optional(S.String),
    message: S.optional(S.String),
    reasons: S.optional(ReasonSummaryList),
  }),
).annotations({
  identifier: "CheckNoNewAccessResponse",
}) as any as S.Schema<CheckNoNewAccessResponse>;
export type KmsGrantOperationsList = string[];
export const KmsGrantOperationsList = S.Array(S.String);
export interface GetAnalyzedResourceResponse {
  resource?: AnalyzedResource;
}
export const GetAnalyzedResourceResponse = S.suspend(() =>
  S.Struct({ resource: S.optional(AnalyzedResource) }),
).annotations({
  identifier: "GetAnalyzedResourceResponse",
}) as any as S.Schema<GetAnalyzedResourceResponse>;
export interface ListAccessPreviewFindingsRequest {
  accessPreviewId: string;
  analyzerArn: string;
  filter?: { [key: string]: Criterion | undefined };
  nextToken?: string;
  maxResults?: number;
}
export const ListAccessPreviewFindingsRequest = S.suspend(() =>
  S.Struct({
    accessPreviewId: S.String.pipe(T.HttpLabel("accessPreviewId")),
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/access-preview/{accessPreviewId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessPreviewFindingsRequest",
}) as any as S.Schema<ListAccessPreviewFindingsRequest>;
export interface ListAccessPreviewsResponse {
  accessPreviews: AccessPreviewSummary[];
  nextToken?: string;
}
export const ListAccessPreviewsResponse = S.suspend(() =>
  S.Struct({
    accessPreviews: AccessPreviewsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessPreviewsResponse",
}) as any as S.Schema<ListAccessPreviewsResponse>;
export interface ListAnalyzedResourcesResponse {
  analyzedResources: AnalyzedResourceSummary[];
  nextToken?: string;
}
export const ListAnalyzedResourcesResponse = S.suspend(() =>
  S.Struct({
    analyzedResources: AnalyzedResourcesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnalyzedResourcesResponse",
}) as any as S.Schema<ListAnalyzedResourcesResponse>;
export interface ListFindingsV2Response {
  findings: FindingSummaryV2[];
  nextToken?: string;
}
export const ListFindingsV2Response = S.suspend(() =>
  S.Struct({ findings: FindingsListV2, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFindingsV2Response",
}) as any as S.Schema<ListFindingsV2Response>;
export interface ListPolicyGenerationsResponse {
  policyGenerations: PolicyGeneration[];
  nextToken?: string;
}
export const ListPolicyGenerationsResponse = S.suspend(() =>
  S.Struct({
    policyGenerations: PolicyGenerationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPolicyGenerationsResponse",
}) as any as S.Schema<ListPolicyGenerationsResponse>;
export interface StartPolicyGenerationRequest {
  policyGenerationDetails: PolicyGenerationDetails;
  cloudTrailDetails?: CloudTrailDetails;
  clientToken?: string;
}
export const StartPolicyGenerationRequest = S.suspend(() =>
  S.Struct({
    policyGenerationDetails: PolicyGenerationDetails,
    cloudTrailDetails: S.optional(CloudTrailDetails),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/policy/generation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartPolicyGenerationRequest",
}) as any as S.Schema<StartPolicyGenerationRequest>;
export interface GetArchiveRuleResponse {
  archiveRule: ArchiveRuleSummary;
}
export const GetArchiveRuleResponse = S.suspend(() =>
  S.Struct({ archiveRule: ArchiveRuleSummary }),
).annotations({
  identifier: "GetArchiveRuleResponse",
}) as any as S.Schema<GetArchiveRuleResponse>;
export type PrincipalMap = { [key: string]: string | undefined };
export const PrincipalMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ConditionKeyMap = { [key: string]: string | undefined };
export const ConditionKeyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface UnusedPermissionsRecommendedStep {
  policyUpdatedAt?: Date;
  recommendedAction: string;
  recommendedPolicy?: string;
  existingPolicyId?: string;
}
export const UnusedPermissionsRecommendedStep = S.suspend(() =>
  S.Struct({
    policyUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    recommendedAction: S.String,
    recommendedPolicy: S.optional(S.String),
    existingPolicyId: S.optional(S.String),
  }),
).annotations({
  identifier: "UnusedPermissionsRecommendedStep",
}) as any as S.Schema<UnusedPermissionsRecommendedStep>;
export interface FindingSourceDetail {
  accessPointArn?: string;
  accessPointAccount?: string;
}
export const FindingSourceDetail = S.suspend(() =>
  S.Struct({
    accessPointArn: S.optional(S.String),
    accessPointAccount: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingSourceDetail",
}) as any as S.Schema<FindingSourceDetail>;
export interface FindingSource {
  type: string;
  detail?: FindingSourceDetail;
}
export const FindingSource = S.suspend(() =>
  S.Struct({ type: S.String, detail: S.optional(FindingSourceDetail) }),
).annotations({
  identifier: "FindingSource",
}) as any as S.Schema<FindingSource>;
export type FindingSourceList = FindingSource[];
export const FindingSourceList = S.Array(FindingSource);
export interface InternalAccessDetails {
  action?: string[];
  condition?: { [key: string]: string | undefined };
  principal?: { [key: string]: string | undefined };
  principalOwnerAccount?: string;
  accessType?: string;
  principalType?: string;
  sources?: FindingSource[];
  resourceControlPolicyRestriction?: string;
  serviceControlPolicyRestriction?: string;
}
export const InternalAccessDetails = S.suspend(() =>
  S.Struct({
    action: S.optional(ActionList),
    condition: S.optional(ConditionKeyMap),
    principal: S.optional(PrincipalMap),
    principalOwnerAccount: S.optional(S.String),
    accessType: S.optional(S.String),
    principalType: S.optional(S.String),
    sources: S.optional(FindingSourceList),
    resourceControlPolicyRestriction: S.optional(S.String),
    serviceControlPolicyRestriction: S.optional(S.String),
  }),
).annotations({
  identifier: "InternalAccessDetails",
}) as any as S.Schema<InternalAccessDetails>;
export interface ExternalAccessDetails {
  action?: string[];
  condition: { [key: string]: string | undefined };
  isPublic?: boolean;
  principal?: { [key: string]: string | undefined };
  sources?: FindingSource[];
  resourceControlPolicyRestriction?: string;
}
export const ExternalAccessDetails = S.suspend(() =>
  S.Struct({
    action: S.optional(ActionList),
    condition: ConditionKeyMap,
    isPublic: S.optional(S.Boolean),
    principal: S.optional(PrincipalMap),
    sources: S.optional(FindingSourceList),
    resourceControlPolicyRestriction: S.optional(S.String),
  }),
).annotations({
  identifier: "ExternalAccessDetails",
}) as any as S.Schema<ExternalAccessDetails>;
export interface UnusedIamUserAccessKeyDetails {
  accessKeyId: string;
  lastAccessed?: Date;
}
export const UnusedIamUserAccessKeyDetails = S.suspend(() =>
  S.Struct({
    accessKeyId: S.String,
    lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UnusedIamUserAccessKeyDetails",
}) as any as S.Schema<UnusedIamUserAccessKeyDetails>;
export interface UnusedIamRoleDetails {
  lastAccessed?: Date;
}
export const UnusedIamRoleDetails = S.suspend(() =>
  S.Struct({
    lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UnusedIamRoleDetails",
}) as any as S.Schema<UnusedIamRoleDetails>;
export interface UnusedIamUserPasswordDetails {
  lastAccessed?: Date;
}
export const UnusedIamUserPasswordDetails = S.suspend(() =>
  S.Struct({
    lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UnusedIamUserPasswordDetails",
}) as any as S.Schema<UnusedIamUserPasswordDetails>;
export interface JobError {
  code: string;
  message: string;
}
export const JobError = S.suspend(() =>
  S.Struct({ code: S.String, message: S.String }),
).annotations({ identifier: "JobError" }) as any as S.Schema<JobError>;
export interface GeneratedPolicy {
  policy: string;
}
export const GeneratedPolicy = S.suspend(() =>
  S.Struct({ policy: S.String }),
).annotations({
  identifier: "GeneratedPolicy",
}) as any as S.Schema<GeneratedPolicy>;
export type GeneratedPolicyList = GeneratedPolicy[];
export const GeneratedPolicyList = S.Array(GeneratedPolicy);
export type KmsKeyPoliciesMap = { [key: string]: string | undefined };
export const KmsKeyPoliciesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface S3PublicAccessBlockConfiguration {
  ignorePublicAcls: boolean;
  restrictPublicBuckets: boolean;
}
export const S3PublicAccessBlockConfiguration = S.suspend(() =>
  S.Struct({ ignorePublicAcls: S.Boolean, restrictPublicBuckets: S.Boolean }),
).annotations({
  identifier: "S3PublicAccessBlockConfiguration",
}) as any as S.Schema<S3PublicAccessBlockConfiguration>;
export type RdsDbClusterSnapshotAccountIdsList = string[];
export const RdsDbClusterSnapshotAccountIdsList = S.Array(S.String);
export type RdsDbSnapshotAccountIdsList = string[];
export const RdsDbSnapshotAccountIdsList = S.Array(S.String);
export type KmsConstraintsMap = { [key: string]: string | undefined };
export const KmsConstraintsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface KmsGrantConstraints {
  encryptionContextEquals?: { [key: string]: string | undefined };
  encryptionContextSubset?: { [key: string]: string | undefined };
}
export const KmsGrantConstraints = S.suspend(() =>
  S.Struct({
    encryptionContextEquals: S.optional(KmsConstraintsMap),
    encryptionContextSubset: S.optional(KmsConstraintsMap),
  }),
).annotations({
  identifier: "KmsGrantConstraints",
}) as any as S.Schema<KmsGrantConstraints>;
export interface KmsGrantConfiguration {
  operations: string[];
  granteePrincipal: string;
  retiringPrincipal?: string;
  constraints?: KmsGrantConstraints;
  issuingAccount: string;
}
export const KmsGrantConfiguration = S.suspend(() =>
  S.Struct({
    operations: KmsGrantOperationsList,
    granteePrincipal: S.String,
    retiringPrincipal: S.optional(S.String),
    constraints: S.optional(KmsGrantConstraints),
    issuingAccount: S.String,
  }),
).annotations({
  identifier: "KmsGrantConfiguration",
}) as any as S.Schema<KmsGrantConfiguration>;
export type KmsGrantConfigurationsList = KmsGrantConfiguration[];
export const KmsGrantConfigurationsList = S.Array(KmsGrantConfiguration);
export interface KmsKeyConfiguration {
  keyPolicies?: { [key: string]: string | undefined };
  grants?: KmsGrantConfiguration[];
}
export const KmsKeyConfiguration = S.suspend(() =>
  S.Struct({
    keyPolicies: S.optional(KmsKeyPoliciesMap),
    grants: S.optional(KmsGrantConfigurationsList),
  }),
).annotations({
  identifier: "KmsKeyConfiguration",
}) as any as S.Schema<KmsKeyConfiguration>;
export type RdsDbClusterSnapshotAttributeValue = { accountIds: string[] };
export const RdsDbClusterSnapshotAttributeValue = S.Union(
  S.Struct({ accountIds: RdsDbClusterSnapshotAccountIdsList }),
);
export type RdsDbClusterSnapshotAttributesMap = {
  [key: string]: RdsDbClusterSnapshotAttributeValue | undefined;
};
export const RdsDbClusterSnapshotAttributesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(RdsDbClusterSnapshotAttributeValue),
});
export interface RdsDbClusterSnapshotConfiguration {
  attributes?: {
    [key: string]: RdsDbClusterSnapshotAttributeValue | undefined;
  };
  kmsKeyId?: string;
}
export const RdsDbClusterSnapshotConfiguration = S.suspend(() =>
  S.Struct({
    attributes: S.optional(RdsDbClusterSnapshotAttributesMap),
    kmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "RdsDbClusterSnapshotConfiguration",
}) as any as S.Schema<RdsDbClusterSnapshotConfiguration>;
export type RdsDbSnapshotAttributeValue = { accountIds: string[] };
export const RdsDbSnapshotAttributeValue = S.Union(
  S.Struct({ accountIds: RdsDbSnapshotAccountIdsList }),
);
export type RdsDbSnapshotAttributesMap = {
  [key: string]: RdsDbSnapshotAttributeValue | undefined;
};
export const RdsDbSnapshotAttributesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(RdsDbSnapshotAttributeValue),
});
export interface RdsDbSnapshotConfiguration {
  attributes?: { [key: string]: RdsDbSnapshotAttributeValue | undefined };
  kmsKeyId?: string;
}
export const RdsDbSnapshotConfiguration = S.suspend(() =>
  S.Struct({
    attributes: S.optional(RdsDbSnapshotAttributesMap),
    kmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "RdsDbSnapshotConfiguration",
}) as any as S.Schema<RdsDbSnapshotConfiguration>;
export type AclGrantee =
  | { id: string; uri?: never }
  | { id?: never; uri: string };
export const AclGrantee = S.Union(
  S.Struct({ id: S.String }),
  S.Struct({ uri: S.String }),
);
export interface S3BucketAclGrantConfiguration {
  permission: string;
  grantee: AclGrantee;
}
export const S3BucketAclGrantConfiguration = S.suspend(() =>
  S.Struct({ permission: S.String, grantee: AclGrantee }),
).annotations({
  identifier: "S3BucketAclGrantConfiguration",
}) as any as S.Schema<S3BucketAclGrantConfiguration>;
export type S3BucketAclGrantConfigurationsList =
  S3BucketAclGrantConfiguration[];
export const S3BucketAclGrantConfigurationsList = S.Array(
  S3BucketAclGrantConfiguration,
);
export interface VpcConfiguration {
  vpcId: string;
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({ vpcId: S.String }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export interface InternetConfiguration {}
export const InternetConfiguration = S.suspend(() => S.Struct({})).annotations({
  identifier: "InternetConfiguration",
}) as any as S.Schema<InternetConfiguration>;
export type NetworkOriginConfiguration =
  | { vpcConfiguration: VpcConfiguration; internetConfiguration?: never }
  | { vpcConfiguration?: never; internetConfiguration: InternetConfiguration };
export const NetworkOriginConfiguration = S.Union(
  S.Struct({ vpcConfiguration: VpcConfiguration }),
  S.Struct({ internetConfiguration: InternetConfiguration }),
);
export interface S3AccessPointConfiguration {
  accessPointPolicy?: string;
  publicAccessBlock?: S3PublicAccessBlockConfiguration;
  networkOrigin?: NetworkOriginConfiguration;
}
export const S3AccessPointConfiguration = S.suspend(() =>
  S.Struct({
    accessPointPolicy: S.optional(S.String),
    publicAccessBlock: S.optional(S3PublicAccessBlockConfiguration),
    networkOrigin: S.optional(NetworkOriginConfiguration),
  }),
).annotations({
  identifier: "S3AccessPointConfiguration",
}) as any as S.Schema<S3AccessPointConfiguration>;
export type S3AccessPointConfigurationsMap = {
  [key: string]: S3AccessPointConfiguration | undefined;
};
export const S3AccessPointConfigurationsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S3AccessPointConfiguration),
});
export interface S3BucketConfiguration {
  bucketPolicy?: string;
  bucketAclGrants?: S3BucketAclGrantConfiguration[];
  bucketPublicAccessBlock?: S3PublicAccessBlockConfiguration;
  accessPoints?: { [key: string]: S3AccessPointConfiguration | undefined };
}
export const S3BucketConfiguration = S.suspend(() =>
  S.Struct({
    bucketPolicy: S.optional(S.String),
    bucketAclGrants: S.optional(S3BucketAclGrantConfigurationsList),
    bucketPublicAccessBlock: S.optional(S3PublicAccessBlockConfiguration),
    accessPoints: S.optional(S3AccessPointConfigurationsMap),
  }),
).annotations({
  identifier: "S3BucketConfiguration",
}) as any as S.Schema<S3BucketConfiguration>;
export interface S3ExpressDirectoryAccessPointConfiguration {
  accessPointPolicy?: string;
  networkOrigin?: NetworkOriginConfiguration;
}
export const S3ExpressDirectoryAccessPointConfiguration = S.suspend(() =>
  S.Struct({
    accessPointPolicy: S.optional(S.String),
    networkOrigin: S.optional(NetworkOriginConfiguration),
  }),
).annotations({
  identifier: "S3ExpressDirectoryAccessPointConfiguration",
}) as any as S.Schema<S3ExpressDirectoryAccessPointConfiguration>;
export type S3ExpressDirectoryAccessPointConfigurationsMap = {
  [key: string]: S3ExpressDirectoryAccessPointConfiguration | undefined;
};
export const S3ExpressDirectoryAccessPointConfigurationsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S3ExpressDirectoryAccessPointConfiguration),
});
export interface S3ExpressDirectoryBucketConfiguration {
  bucketPolicy?: string;
  accessPoints?: {
    [key: string]: S3ExpressDirectoryAccessPointConfiguration | undefined;
  };
}
export const S3ExpressDirectoryBucketConfiguration = S.suspend(() =>
  S.Struct({
    bucketPolicy: S.optional(S.String),
    accessPoints: S.optional(S3ExpressDirectoryAccessPointConfigurationsMap),
  }),
).annotations({
  identifier: "S3ExpressDirectoryBucketConfiguration",
}) as any as S.Schema<S3ExpressDirectoryBucketConfiguration>;
export type Configuration =
  | {
      ebsSnapshot: EbsSnapshotConfiguration;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository: EcrRepositoryConfiguration;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole: IamRoleConfiguration;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem: EfsFileSystemConfiguration;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey: KmsKeyConfiguration;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot: RdsDbClusterSnapshotConfiguration;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot: RdsDbSnapshotConfiguration;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret: SecretsManagerSecretConfiguration;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket: S3BucketConfiguration;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic: SnsTopicConfiguration;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue: SqsQueueConfiguration;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket: S3ExpressDirectoryBucketConfiguration;
      dynamodbStream?: never;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream: DynamodbStreamConfiguration;
      dynamodbTable?: never;
    }
  | {
      ebsSnapshot?: never;
      ecrRepository?: never;
      iamRole?: never;
      efsFileSystem?: never;
      kmsKey?: never;
      rdsDbClusterSnapshot?: never;
      rdsDbSnapshot?: never;
      secretsManagerSecret?: never;
      s3Bucket?: never;
      snsTopic?: never;
      sqsQueue?: never;
      s3ExpressDirectoryBucket?: never;
      dynamodbStream?: never;
      dynamodbTable: DynamodbTableConfiguration;
    };
export const Configuration = S.Union(
  S.Struct({ ebsSnapshot: EbsSnapshotConfiguration }),
  S.Struct({ ecrRepository: EcrRepositoryConfiguration }),
  S.Struct({ iamRole: IamRoleConfiguration }),
  S.Struct({ efsFileSystem: EfsFileSystemConfiguration }),
  S.Struct({ kmsKey: KmsKeyConfiguration }),
  S.Struct({ rdsDbClusterSnapshot: RdsDbClusterSnapshotConfiguration }),
  S.Struct({ rdsDbSnapshot: RdsDbSnapshotConfiguration }),
  S.Struct({ secretsManagerSecret: SecretsManagerSecretConfiguration }),
  S.Struct({ s3Bucket: S3BucketConfiguration }),
  S.Struct({ snsTopic: SnsTopicConfiguration }),
  S.Struct({ sqsQueue: SqsQueueConfiguration }),
  S.Struct({ s3ExpressDirectoryBucket: S3ExpressDirectoryBucketConfiguration }),
  S.Struct({ dynamodbStream: DynamodbStreamConfiguration }),
  S.Struct({ dynamodbTable: DynamodbTableConfiguration }),
);
export type ConfigurationsMap = { [key: string]: Configuration | undefined };
export const ConfigurationsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(Configuration),
});
export interface AccessPreview {
  id: string;
  analyzerArn: string;
  configurations: { [key: string]: Configuration | undefined };
  createdAt: Date;
  status: string;
  statusReason?: AccessPreviewStatusReason;
}
export const AccessPreview = S.suspend(() =>
  S.Struct({
    id: S.String,
    analyzerArn: S.String,
    configurations: ConfigurationsMap,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    statusReason: S.optional(AccessPreviewStatusReason),
  }),
).annotations({
  identifier: "AccessPreview",
}) as any as S.Schema<AccessPreview>;
export type RecommendedStep = {
  unusedPermissionsRecommendedStep: UnusedPermissionsRecommendedStep;
};
export const RecommendedStep = S.Union(
  S.Struct({
    unusedPermissionsRecommendedStep: UnusedPermissionsRecommendedStep,
  }),
);
export type RecommendedStepList = RecommendedStep[];
export const RecommendedStepList = S.Array(RecommendedStep);
export interface JobDetails {
  jobId: string;
  status: string;
  startedOn: Date;
  completedOn?: Date;
  jobError?: JobError;
}
export const JobDetails = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    status: S.String,
    startedOn: S.Date.pipe(T.TimestampFormat("date-time")),
    completedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    jobError: S.optional(JobError),
  }),
).annotations({ identifier: "JobDetails" }) as any as S.Schema<JobDetails>;
export interface FindingSummary {
  id: string;
  principal?: { [key: string]: string | undefined };
  action?: string[];
  resource?: string;
  isPublic?: boolean;
  resourceType: string;
  condition: { [key: string]: string | undefined };
  createdAt: Date;
  analyzedAt: Date;
  updatedAt: Date;
  status: string;
  resourceOwnerAccount: string;
  error?: string;
  sources?: FindingSource[];
  resourceControlPolicyRestriction?: string;
}
export const FindingSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    principal: S.optional(PrincipalMap),
    action: S.optional(ActionList),
    resource: S.optional(S.String),
    isPublic: S.optional(S.Boolean),
    resourceType: S.String,
    condition: ConditionKeyMap,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    resourceOwnerAccount: S.String,
    error: S.optional(S.String),
    sources: S.optional(FindingSourceList),
    resourceControlPolicyRestriction: S.optional(S.String),
  }),
).annotations({
  identifier: "FindingSummary",
}) as any as S.Schema<FindingSummary>;
export type FindingsList = FindingSummary[];
export const FindingsList = S.Array(FindingSummary);
export interface UnusedAccessTypeStatistics {
  unusedAccessType?: string;
  total?: number;
}
export const UnusedAccessTypeStatistics = S.suspend(() =>
  S.Struct({
    unusedAccessType: S.optional(S.String),
    total: S.optional(S.Number),
  }),
).annotations({
  identifier: "UnusedAccessTypeStatistics",
}) as any as S.Schema<UnusedAccessTypeStatistics>;
export type UnusedAccessTypeStatisticsList = UnusedAccessTypeStatistics[];
export const UnusedAccessTypeStatisticsList = S.Array(
  UnusedAccessTypeStatistics,
);
export interface UnusedAction {
  action: string;
  lastAccessed?: Date;
}
export const UnusedAction = S.suspend(() =>
  S.Struct({
    action: S.String,
    lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "UnusedAction" }) as any as S.Schema<UnusedAction>;
export type UnusedActionList = UnusedAction[];
export const UnusedActionList = S.Array(UnusedAction);
export interface GetAccessPreviewResponse {
  accessPreview: AccessPreview;
}
export const GetAccessPreviewResponse = S.suspend(() =>
  S.Struct({ accessPreview: AccessPreview }),
).annotations({
  identifier: "GetAccessPreviewResponse",
}) as any as S.Schema<GetAccessPreviewResponse>;
export interface GetFindingRecommendationResponse {
  startedAt: Date;
  completedAt?: Date;
  nextToken?: string;
  error?: RecommendationError;
  resourceArn: string;
  recommendedSteps?: RecommendedStep[];
  recommendationType: string;
  status: string;
}
export const GetFindingRecommendationResponse = S.suspend(() =>
  S.Struct({
    startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    nextToken: S.optional(S.String),
    error: S.optional(RecommendationError),
    resourceArn: S.String,
    recommendedSteps: S.optional(RecommendedStepList),
    recommendationType: S.String,
    status: S.String,
  }),
).annotations({
  identifier: "GetFindingRecommendationResponse",
}) as any as S.Schema<GetFindingRecommendationResponse>;
export interface ListFindingsResponse {
  findings: FindingSummary[];
  nextToken?: string;
}
export const ListFindingsResponse = S.suspend(() =>
  S.Struct({ findings: FindingsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFindingsResponse",
}) as any as S.Schema<ListFindingsResponse>;
export interface StartPolicyGenerationResponse {
  jobId: string;
}
export const StartPolicyGenerationResponse = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "StartPolicyGenerationResponse",
}) as any as S.Schema<StartPolicyGenerationResponse>;
export interface GetAnalyzerResponse {
  analyzer: AnalyzerSummary;
}
export const GetAnalyzerResponse = S.suspend(() =>
  S.Struct({ analyzer: AnalyzerSummary }),
).annotations({
  identifier: "GetAnalyzerResponse",
}) as any as S.Schema<GetAnalyzerResponse>;
export interface UnusedPermissionDetails {
  actions?: UnusedAction[];
  serviceNamespace: string;
  lastAccessed?: Date;
}
export const UnusedPermissionDetails = S.suspend(() =>
  S.Struct({
    actions: S.optional(UnusedActionList),
    serviceNamespace: S.String,
    lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "UnusedPermissionDetails",
}) as any as S.Schema<UnusedPermissionDetails>;
export interface ResourceTypeDetails {
  totalActivePublic?: number;
  totalActiveCrossAccount?: number;
  totalActiveErrors?: number;
}
export const ResourceTypeDetails = S.suspend(() =>
  S.Struct({
    totalActivePublic: S.optional(S.Number),
    totalActiveCrossAccount: S.optional(S.Number),
    totalActiveErrors: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourceTypeDetails",
}) as any as S.Schema<ResourceTypeDetails>;
export interface InternalAccessResourceTypeDetails {
  totalActiveFindings?: number;
  totalResolvedFindings?: number;
  totalArchivedFindings?: number;
}
export const InternalAccessResourceTypeDetails = S.suspend(() =>
  S.Struct({
    totalActiveFindings: S.optional(S.Number),
    totalResolvedFindings: S.optional(S.Number),
    totalArchivedFindings: S.optional(S.Number),
  }),
).annotations({
  identifier: "InternalAccessResourceTypeDetails",
}) as any as S.Schema<InternalAccessResourceTypeDetails>;
export type FindingAggregationAccountDetailsMap = {
  [key: string]: number | undefined;
};
export const FindingAggregationAccountDetailsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export interface TrailProperties {
  cloudTrailArn: string;
  regions?: string[];
  allRegions?: boolean;
}
export const TrailProperties = S.suspend(() =>
  S.Struct({
    cloudTrailArn: S.String,
    regions: S.optional(RegionList),
    allRegions: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TrailProperties",
}) as any as S.Schema<TrailProperties>;
export type TrailPropertiesList = TrailProperties[];
export const TrailPropertiesList = S.Array(TrailProperties);
export interface Substring {
  start: number;
  length: number;
}
export const Substring = S.suspend(() =>
  S.Struct({ start: S.Number, length: S.Number }),
).annotations({ identifier: "Substring" }) as any as S.Schema<Substring>;
export interface Position {
  line: number;
  column: number;
  offset: number;
}
export const Position = S.suspend(() =>
  S.Struct({ line: S.Number, column: S.Number, offset: S.Number }),
).annotations({ identifier: "Position" }) as any as S.Schema<Position>;
export interface Finding {
  id: string;
  principal?: { [key: string]: string | undefined };
  action?: string[];
  resource?: string;
  isPublic?: boolean;
  resourceType: string;
  condition: { [key: string]: string | undefined };
  createdAt: Date;
  analyzedAt: Date;
  updatedAt: Date;
  status: string;
  resourceOwnerAccount: string;
  error?: string;
  sources?: FindingSource[];
  resourceControlPolicyRestriction?: string;
}
export const Finding = S.suspend(() =>
  S.Struct({
    id: S.String,
    principal: S.optional(PrincipalMap),
    action: S.optional(ActionList),
    resource: S.optional(S.String),
    isPublic: S.optional(S.Boolean),
    resourceType: S.String,
    condition: ConditionKeyMap,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    resourceOwnerAccount: S.String,
    error: S.optional(S.String),
    sources: S.optional(FindingSourceList),
    resourceControlPolicyRestriction: S.optional(S.String),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type FindingDetails =
  | {
      internalAccessDetails: InternalAccessDetails;
      externalAccessDetails?: never;
      unusedPermissionDetails?: never;
      unusedIamUserAccessKeyDetails?: never;
      unusedIamRoleDetails?: never;
      unusedIamUserPasswordDetails?: never;
    }
  | {
      internalAccessDetails?: never;
      externalAccessDetails: ExternalAccessDetails;
      unusedPermissionDetails?: never;
      unusedIamUserAccessKeyDetails?: never;
      unusedIamRoleDetails?: never;
      unusedIamUserPasswordDetails?: never;
    }
  | {
      internalAccessDetails?: never;
      externalAccessDetails?: never;
      unusedPermissionDetails: UnusedPermissionDetails;
      unusedIamUserAccessKeyDetails?: never;
      unusedIamRoleDetails?: never;
      unusedIamUserPasswordDetails?: never;
    }
  | {
      internalAccessDetails?: never;
      externalAccessDetails?: never;
      unusedPermissionDetails?: never;
      unusedIamUserAccessKeyDetails: UnusedIamUserAccessKeyDetails;
      unusedIamRoleDetails?: never;
      unusedIamUserPasswordDetails?: never;
    }
  | {
      internalAccessDetails?: never;
      externalAccessDetails?: never;
      unusedPermissionDetails?: never;
      unusedIamUserAccessKeyDetails?: never;
      unusedIamRoleDetails: UnusedIamRoleDetails;
      unusedIamUserPasswordDetails?: never;
    }
  | {
      internalAccessDetails?: never;
      externalAccessDetails?: never;
      unusedPermissionDetails?: never;
      unusedIamUserAccessKeyDetails?: never;
      unusedIamRoleDetails?: never;
      unusedIamUserPasswordDetails: UnusedIamUserPasswordDetails;
    };
export const FindingDetails = S.Union(
  S.Struct({ internalAccessDetails: InternalAccessDetails }),
  S.Struct({ externalAccessDetails: ExternalAccessDetails }),
  S.Struct({ unusedPermissionDetails: UnusedPermissionDetails }),
  S.Struct({ unusedIamUserAccessKeyDetails: UnusedIamUserAccessKeyDetails }),
  S.Struct({ unusedIamRoleDetails: UnusedIamRoleDetails }),
  S.Struct({ unusedIamUserPasswordDetails: UnusedIamUserPasswordDetails }),
);
export type FindingDetailsList = FindingDetails[];
export const FindingDetailsList = S.Array(FindingDetails);
export interface AccessPreviewFinding {
  id: string;
  existingFindingId?: string;
  existingFindingStatus?: string;
  principal?: { [key: string]: string | undefined };
  action?: string[];
  condition?: { [key: string]: string | undefined };
  resource?: string;
  isPublic?: boolean;
  resourceType: string;
  createdAt: Date;
  changeType: string;
  status: string;
  resourceOwnerAccount: string;
  error?: string;
  sources?: FindingSource[];
  resourceControlPolicyRestriction?: string;
}
export const AccessPreviewFinding = S.suspend(() =>
  S.Struct({
    id: S.String,
    existingFindingId: S.optional(S.String),
    existingFindingStatus: S.optional(S.String),
    principal: S.optional(PrincipalMap),
    action: S.optional(ActionList),
    condition: S.optional(ConditionKeyMap),
    resource: S.optional(S.String),
    isPublic: S.optional(S.Boolean),
    resourceType: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    changeType: S.String,
    status: S.String,
    resourceOwnerAccount: S.String,
    error: S.optional(S.String),
    sources: S.optional(FindingSourceList),
    resourceControlPolicyRestriction: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessPreviewFinding",
}) as any as S.Schema<AccessPreviewFinding>;
export type AccessPreviewFindingsList = AccessPreviewFinding[];
export const AccessPreviewFindingsList = S.Array(AccessPreviewFinding);
export type ResourceTypeStatisticsMap = {
  [key: string]: ResourceTypeDetails | undefined;
};
export const ResourceTypeStatisticsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ResourceTypeDetails),
});
export type InternalAccessResourceTypeStatisticsMap = {
  [key: string]: InternalAccessResourceTypeDetails | undefined;
};
export const InternalAccessResourceTypeStatisticsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(InternalAccessResourceTypeDetails),
});
export interface FindingAggregationAccountDetails {
  account?: string;
  numberOfActiveFindings?: number;
  details?: { [key: string]: number | undefined };
}
export const FindingAggregationAccountDetails = S.suspend(() =>
  S.Struct({
    account: S.optional(S.String),
    numberOfActiveFindings: S.optional(S.Number),
    details: S.optional(FindingAggregationAccountDetailsMap),
  }),
).annotations({
  identifier: "FindingAggregationAccountDetails",
}) as any as S.Schema<FindingAggregationAccountDetails>;
export type AccountAggregations = FindingAggregationAccountDetails[];
export const AccountAggregations = S.Array(FindingAggregationAccountDetails);
export interface CloudTrailProperties {
  trailProperties: TrailProperties[];
  startTime: Date;
  endTime: Date;
}
export const CloudTrailProperties = S.suspend(() =>
  S.Struct({
    trailProperties: TrailPropertiesList,
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CloudTrailProperties",
}) as any as S.Schema<CloudTrailProperties>;
export type PathElement =
  | { index: number; key?: never; substring?: never; value?: never }
  | { index?: never; key: string; substring?: never; value?: never }
  | { index?: never; key?: never; substring: Substring; value?: never }
  | { index?: never; key?: never; substring?: never; value: string };
export const PathElement = S.Union(
  S.Struct({ index: S.Number }),
  S.Struct({ key: S.String }),
  S.Struct({ substring: Substring }),
  S.Struct({ value: S.String }),
);
export type PathElementList = PathElement[];
export const PathElementList = S.Array(PathElement);
export interface Span {
  start: Position;
  end: Position;
}
export const Span = S.suspend(() =>
  S.Struct({ start: Position, end: Position }),
).annotations({ identifier: "Span" }) as any as S.Schema<Span>;
export interface GetFindingResponse {
  finding?: Finding;
}
export const GetFindingResponse = S.suspend(() =>
  S.Struct({ finding: S.optional(Finding) }),
).annotations({
  identifier: "GetFindingResponse",
}) as any as S.Schema<GetFindingResponse>;
export interface GetFindingV2Response {
  analyzedAt: Date;
  createdAt: Date;
  error?: string;
  id: string;
  nextToken?: string;
  resource?: string;
  resourceType: string;
  resourceOwnerAccount: string;
  status: string;
  updatedAt: Date;
  findingDetails: FindingDetails[];
  findingType?: string;
}
export const GetFindingV2Response = S.suspend(() =>
  S.Struct({
    analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    error: S.optional(S.String),
    id: S.String,
    nextToken: S.optional(S.String),
    resource: S.optional(S.String),
    resourceType: S.String,
    resourceOwnerAccount: S.String,
    status: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    findingDetails: FindingDetailsList,
    findingType: S.optional(S.String),
  }),
).annotations({
  identifier: "GetFindingV2Response",
}) as any as S.Schema<GetFindingV2Response>;
export interface ListAccessPreviewFindingsResponse {
  findings: AccessPreviewFinding[];
  nextToken?: string;
}
export const ListAccessPreviewFindingsResponse = S.suspend(() =>
  S.Struct({
    findings: AccessPreviewFindingsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessPreviewFindingsResponse",
}) as any as S.Schema<ListAccessPreviewFindingsResponse>;
export interface CreateAnalyzerRequest {
  analyzerName: string;
  type: string;
  archiveRules?: InlineArchiveRule[];
  tags?: { [key: string]: string | undefined };
  clientToken?: string;
  configuration?: AnalyzerConfiguration;
}
export const CreateAnalyzerRequest = S.suspend(() =>
  S.Struct({
    analyzerName: S.String,
    type: S.String,
    archiveRules: S.optional(InlineArchiveRulesList),
    tags: S.optional(TagsMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    configuration: S.optional(AnalyzerConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/analyzer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAnalyzerRequest",
}) as any as S.Schema<CreateAnalyzerRequest>;
export interface ExternalAccessFindingsStatistics {
  resourceTypeStatistics?: { [key: string]: ResourceTypeDetails | undefined };
  totalActiveFindings?: number;
  totalArchivedFindings?: number;
  totalResolvedFindings?: number;
}
export const ExternalAccessFindingsStatistics = S.suspend(() =>
  S.Struct({
    resourceTypeStatistics: S.optional(ResourceTypeStatisticsMap),
    totalActiveFindings: S.optional(S.Number),
    totalArchivedFindings: S.optional(S.Number),
    totalResolvedFindings: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExternalAccessFindingsStatistics",
}) as any as S.Schema<ExternalAccessFindingsStatistics>;
export interface InternalAccessFindingsStatistics {
  resourceTypeStatistics?: {
    [key: string]: InternalAccessResourceTypeDetails | undefined;
  };
  totalActiveFindings?: number;
  totalArchivedFindings?: number;
  totalResolvedFindings?: number;
}
export const InternalAccessFindingsStatistics = S.suspend(() =>
  S.Struct({
    resourceTypeStatistics: S.optional(InternalAccessResourceTypeStatisticsMap),
    totalActiveFindings: S.optional(S.Number),
    totalArchivedFindings: S.optional(S.Number),
    totalResolvedFindings: S.optional(S.Number),
  }),
).annotations({
  identifier: "InternalAccessFindingsStatistics",
}) as any as S.Schema<InternalAccessFindingsStatistics>;
export interface UnusedAccessFindingsStatistics {
  unusedAccessTypeStatistics?: UnusedAccessTypeStatistics[];
  topAccounts?: FindingAggregationAccountDetails[];
  totalActiveFindings?: number;
  totalArchivedFindings?: number;
  totalResolvedFindings?: number;
}
export const UnusedAccessFindingsStatistics = S.suspend(() =>
  S.Struct({
    unusedAccessTypeStatistics: S.optional(UnusedAccessTypeStatisticsList),
    topAccounts: S.optional(AccountAggregations),
    totalActiveFindings: S.optional(S.Number),
    totalArchivedFindings: S.optional(S.Number),
    totalResolvedFindings: S.optional(S.Number),
  }),
).annotations({
  identifier: "UnusedAccessFindingsStatistics",
}) as any as S.Schema<UnusedAccessFindingsStatistics>;
export interface GeneratedPolicyProperties {
  isComplete?: boolean;
  principalArn: string;
  cloudTrailProperties?: CloudTrailProperties;
}
export const GeneratedPolicyProperties = S.suspend(() =>
  S.Struct({
    isComplete: S.optional(S.Boolean),
    principalArn: S.String,
    cloudTrailProperties: S.optional(CloudTrailProperties),
  }),
).annotations({
  identifier: "GeneratedPolicyProperties",
}) as any as S.Schema<GeneratedPolicyProperties>;
export interface Location {
  path: PathElement[];
  span: Span;
}
export const Location = S.suspend(() =>
  S.Struct({ path: PathElementList, span: Span }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export type LocationList = Location[];
export const LocationList = S.Array(Location);
export type FindingsStatistics =
  | {
      externalAccessFindingsStatistics: ExternalAccessFindingsStatistics;
      internalAccessFindingsStatistics?: never;
      unusedAccessFindingsStatistics?: never;
    }
  | {
      externalAccessFindingsStatistics?: never;
      internalAccessFindingsStatistics: InternalAccessFindingsStatistics;
      unusedAccessFindingsStatistics?: never;
    }
  | {
      externalAccessFindingsStatistics?: never;
      internalAccessFindingsStatistics?: never;
      unusedAccessFindingsStatistics: UnusedAccessFindingsStatistics;
    };
export const FindingsStatistics = S.Union(
  S.Struct({
    externalAccessFindingsStatistics: ExternalAccessFindingsStatistics,
  }),
  S.Struct({
    internalAccessFindingsStatistics: InternalAccessFindingsStatistics,
  }),
  S.Struct({ unusedAccessFindingsStatistics: UnusedAccessFindingsStatistics }),
);
export type FindingsStatisticsList = FindingsStatistics[];
export const FindingsStatisticsList = S.Array(FindingsStatistics);
export interface GeneratedPolicyResult {
  properties: GeneratedPolicyProperties;
  generatedPolicies?: GeneratedPolicy[];
}
export const GeneratedPolicyResult = S.suspend(() =>
  S.Struct({
    properties: GeneratedPolicyProperties,
    generatedPolicies: S.optional(GeneratedPolicyList),
  }),
).annotations({
  identifier: "GeneratedPolicyResult",
}) as any as S.Schema<GeneratedPolicyResult>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface ValidatePolicyFinding {
  findingDetails: string;
  findingType: string;
  issueCode: string;
  learnMoreLink: string;
  locations: Location[];
}
export const ValidatePolicyFinding = S.suspend(() =>
  S.Struct({
    findingDetails: S.String,
    findingType: S.String,
    issueCode: S.String,
    learnMoreLink: S.String,
    locations: LocationList,
  }),
).annotations({
  identifier: "ValidatePolicyFinding",
}) as any as S.Schema<ValidatePolicyFinding>;
export type ValidatePolicyFindingList = ValidatePolicyFinding[];
export const ValidatePolicyFindingList = S.Array(ValidatePolicyFinding);
export interface GetFindingsStatisticsResponse {
  findingsStatistics?: FindingsStatistics[];
  lastUpdatedAt?: Date;
}
export const GetFindingsStatisticsResponse = S.suspend(() =>
  S.Struct({
    findingsStatistics: S.optional(FindingsStatisticsList),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetFindingsStatisticsResponse",
}) as any as S.Schema<GetFindingsStatisticsResponse>;
export interface GetGeneratedPolicyResponse {
  jobDetails: JobDetails;
  generatedPolicyResult: GeneratedPolicyResult;
}
export const GetGeneratedPolicyResponse = S.suspend(() =>
  S.Struct({
    jobDetails: JobDetails,
    generatedPolicyResult: GeneratedPolicyResult,
  }),
).annotations({
  identifier: "GetGeneratedPolicyResponse",
}) as any as S.Schema<GetGeneratedPolicyResponse>;
export interface ValidatePolicyResponse {
  findings: ValidatePolicyFinding[];
  nextToken?: string;
}
export const ValidatePolicyResponse = S.suspend(() =>
  S.Struct({
    findings: ValidatePolicyFindingList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ValidatePolicyResponse",
}) as any as S.Schema<ValidatePolicyResponse>;
export interface CreateAnalyzerResponse {
  arn?: string;
}
export const CreateAnalyzerResponse = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAnalyzerResponse",
}) as any as S.Schema<CreateAnalyzerResponse>;
export interface CreateAccessPreviewRequest {
  analyzerArn: string;
  configurations: { [key: string]: Configuration | undefined };
  clientToken?: string;
}
export const CreateAccessPreviewRequest = S.suspend(() =>
  S.Struct({
    analyzerArn: S.String,
    configurations: ConfigurationsMap,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/access-preview" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessPreviewRequest",
}) as any as S.Schema<CreateAccessPreviewRequest>;
export interface CreateAccessPreviewResponse {
  id: string;
}
export const CreateAccessPreviewResponse = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "CreateAccessPreviewResponse",
}) as any as S.Schema<CreateAccessPreviewResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withQuotaError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all of the policy generations requested in the last seven days.
 */
export const listPolicyGenerations: {
  (
    input: ListPolicyGenerationsRequest,
  ): effect.Effect<
    ListPolicyGenerationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyGenerationsRequest,
  ) => stream.Stream<
    ListPolicyGenerationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyGenerationsRequest,
  ) => stream.Stream<
    PolicyGeneration,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyGenerationsRequest,
  output: ListPolicyGenerationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "policyGenerations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Requests the validation of a policy and returns a list of findings. The findings help you identify issues and provide actionable recommendations to resolve the issue and enable you to author functional policies that meet security best practices.
 */
export const validatePolicy: {
  (
    input: ValidatePolicyRequest,
  ): effect.Effect<
    ValidatePolicyResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ValidatePolicyRequest,
  ) => stream.Stream<
    ValidatePolicyResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ValidatePolicyRequest,
  ) => stream.Stream<
    ValidatePolicyFinding,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ValidatePolicyRequest,
  output: ValidatePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an analyzer for your account.
 */
export const createAnalyzer: (
  input: CreateAnalyzerRequest,
) => effect.Effect<
  CreateAnalyzerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnalyzerRequest,
  output: CreateAnalyzerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified analyzer.
 */
export const getAnalyzer: (
  input: GetAnalyzerRequest,
) => effect.Effect<
  GetAnalyzerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnalyzerRequest,
  output: GetAnalyzerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a resource that was analyzed.
 *
 * This action is supported only for external access analyzers.
 */
export const getAnalyzedResource: (
  input: GetAnalyzedResourceRequest,
) => effect.Effect<
  GetAnalyzedResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnalyzedResourceRequest,
  output: GetAnalyzedResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of access previews for the specified analyzer.
 */
export const listAccessPreviews: {
  (
    input: ListAccessPreviewsRequest,
  ): effect.Effect<
    ListAccessPreviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessPreviewsRequest,
  ) => stream.Stream<
    ListAccessPreviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessPreviewsRequest,
  ) => stream.Stream<
    AccessPreviewSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessPreviewsRequest,
  output: ListAccessPreviewsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accessPreviews",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of resources of the specified type that have been analyzed by the specified analyzer.
 */
export const listAnalyzedResources: {
  (
    input: ListAnalyzedResourcesRequest,
  ): effect.Effect<
    ListAnalyzedResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnalyzedResourcesRequest,
  ) => stream.Stream<
    ListAnalyzedResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnalyzedResourcesRequest,
  ) => stream.Stream<
    AnalyzedResourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnalyzedResourcesRequest,
  output: ListAnalyzedResourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "analyzedResources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of findings generated by the specified analyzer. ListFindings and ListFindingsV2 both use `access-analyzer:ListFindings` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:ListFindings` action.
 *
 * To learn about filter keys that you can use to retrieve a list of findings, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 */
export const listFindingsV2: {
  (
    input: ListFindingsV2Request,
  ): effect.Effect<
    ListFindingsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsV2Request,
  ) => stream.Stream<
    ListFindingsV2Response,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsV2Request,
  ) => stream.Stream<
    FindingSummaryV2,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsV2Request,
  output: ListFindingsV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Modifies the configuration of an existing analyzer.
 *
 * This action is not supported for external access analyzers.
 */
export const updateAnalyzer: (
  input: UpdateAnalyzerRequest,
) => effect.Effect<
  UpdateAnalyzerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnalyzerRequest,
  output: UpdateAnalyzerResponse,
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
 * Retrieves information about an archive rule.
 *
 * To learn about filter keys that you can use to create an archive rule, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 */
export const getArchiveRule: (
  input: GetArchiveRuleRequest,
) => effect.Effect<
  GetArchiveRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArchiveRuleRequest,
  output: GetArchiveRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of tags applied to the specified resource.
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
 * Adds a tag to the specified resource.
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
 * Immediately starts a scan of the policies applied to the specified resource.
 *
 * This action is supported only for external access analyzers.
 */
export const startResourceScan: (
  input: StartResourceScanRequest,
) => effect.Effect<
  StartResourceScanResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceScanRequest,
  output: StartResourceScanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from the specified resource.
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
 * Updates the status for the specified findings.
 */
export const updateFindings: (
  input: UpdateFindingsRequest,
) => effect.Effect<
  UpdateFindingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingsRequest,
  output: UpdateFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified analyzer. When you delete an analyzer, IAM Access Analyzer is disabled for the account or organization in the current or specific Region. All findings that were generated by the analyzer are deleted. You cannot undo this action.
 */
export const deleteAnalyzer: (
  input: DeleteAnalyzerRequest,
) => effect.Effect<
  DeleteAnalyzerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnalyzerRequest,
  output: DeleteAnalyzerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the criteria and values for the specified archive rule.
 */
export const updateArchiveRule: (
  input: UpdateArchiveRuleRequest,
) => effect.Effect<
  UpdateArchiveRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArchiveRuleRequest,
  output: UpdateArchiveRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified archive rule.
 */
export const deleteArchiveRule: (
  input: DeleteArchiveRuleRequest,
) => effect.Effect<
  DeleteArchiveRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveRuleRequest,
  output: DeleteArchiveRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of analyzers.
 */
export const listAnalyzers: {
  (
    input: ListAnalyzersRequest,
  ): effect.Effect<
    ListAnalyzersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnalyzersRequest,
  ) => stream.Stream<
    ListAnalyzersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnalyzersRequest,
  ) => stream.Stream<
    AnalyzerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnalyzersRequest,
  output: ListAnalyzersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "analyzers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of archive rules created for the specified analyzer.
 */
export const listArchiveRules: {
  (
    input: ListArchiveRulesRequest,
  ): effect.Effect<
    ListArchiveRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListArchiveRulesRequest,
  ) => stream.Stream<
    ListArchiveRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListArchiveRulesRequest,
  ) => stream.Stream<
    ArchiveRuleSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListArchiveRulesRequest,
  output: ListArchiveRulesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "archiveRules",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Cancels the requested policy generation.
 */
export const cancelPolicyGeneration: (
  input: CancelPolicyGenerationRequest,
) => effect.Effect<
  CancelPolicyGenerationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelPolicyGenerationRequest,
  output: CancelPolicyGenerationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a recommendation for an unused permissions finding.
 */
export const generateFindingRecommendation: (
  input: GenerateFindingRecommendationRequest,
) => effect.Effect<
  GenerateFindingRecommendationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateFindingRecommendationRequest,
  output: GenerateFindingRecommendationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retroactively applies the archive rule to existing findings that meet the archive rule criteria.
 */
export const applyArchiveRule: (
  input: ApplyArchiveRuleRequest,
) => effect.Effect<
  ApplyArchiveRuleResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyArchiveRuleRequest,
  output: ApplyArchiveRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an access preview for the specified analyzer.
 */
export const getAccessPreview: (
  input: GetAccessPreviewRequest,
) => effect.Effect<
  GetAccessPreviewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPreviewRequest,
  output: GetAccessPreviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a finding recommendation for the specified analyzer.
 */
export const getFindingRecommendation: {
  (
    input: GetFindingRecommendationRequest,
  ): effect.Effect<
    GetFindingRecommendationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingRecommendationRequest,
  ) => stream.Stream<
    GetFindingRecommendationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingRecommendationRequest,
  ) => stream.Stream<
    RecommendedStep,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingRecommendationRequest,
  output: GetFindingRecommendationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendedSteps",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of findings generated by the specified analyzer. ListFindings and ListFindingsV2 both use `access-analyzer:ListFindings` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:ListFindings` action.
 *
 * To learn about filter keys that you can use to retrieve a list of findings, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 *
 * ListFindings is supported only for external access analyzers. You must use ListFindingsV2 for internal and unused access analyzers.
 */
export const listFindings: {
  (
    input: ListFindingsRequest,
  ): effect.Effect<
    ListFindingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    ListFindingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    FindingSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the specified finding. GetFinding and GetFindingV2 both use `access-analyzer:GetFinding` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:GetFinding` action.
 *
 * GetFinding is supported only for external access analyzers. You must use GetFindingV2 for internal and unused access analyzers.
 */
export const getFinding: (
  input: GetFindingRequest,
) => effect.Effect<
  GetFindingResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingRequest,
  output: GetFindingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified finding. GetFinding and GetFindingV2 both use `access-analyzer:GetFinding` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:GetFinding` action.
 */
export const getFindingV2: {
  (
    input: GetFindingV2Request,
  ): effect.Effect<
    GetFindingV2Response,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetFindingV2Request,
  ) => stream.Stream<
    GetFindingV2Response,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetFindingV2Request,
  ) => stream.Stream<
    FindingDetails,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetFindingV2Request,
  output: GetFindingV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findingDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of access preview findings generated by the specified access preview.
 */
export const listAccessPreviewFindings: {
  (
    input: ListAccessPreviewFindingsRequest,
  ): effect.Effect<
    ListAccessPreviewFindingsResponse,
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
    input: ListAccessPreviewFindingsRequest,
  ) => stream.Stream<
    ListAccessPreviewFindingsResponse,
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
    input: ListAccessPreviewFindingsRequest,
  ) => stream.Stream<
    AccessPreviewFinding,
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
  input: ListAccessPreviewFindingsRequest,
  output: ListAccessPreviewFindingsResponse,
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
    items: "findings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts the policy generation request.
 */
export const startPolicyGeneration: (
  input: StartPolicyGenerationRequest,
) => effect.Effect<
  StartPolicyGenerationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPolicyGenerationRequest,
  output: StartPolicyGenerationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Checks whether new access is allowed for an updated policy when compared to the existing policy.
 *
 * You can find examples for reference policies and learn how to set up and run a custom policy check for new access in the IAM Access Analyzer custom policy checks samples repository on GitHub. The reference policies in this repository are meant to be passed to the `existingPolicyDocument` request parameter.
 */
export const checkNoNewAccess: (
  input: CheckNoNewAccessRequest,
) => effect.Effect<
  CheckNoNewAccessResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterException
  | ThrottlingException
  | UnprocessableEntityException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckNoNewAccessRequest,
  output: CheckNoNewAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
    UnprocessableEntityException,
    ValidationException,
  ],
}));
/**
 * Creates an archive rule for the specified analyzer. Archive rules automatically archive new findings that meet the criteria you define when you create the rule.
 *
 * To learn about filter keys that you can use to create an archive rule, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 */
export const createArchiveRule: (
  input: CreateArchiveRuleRequest,
) => effect.Effect<
  CreateArchiveRuleResponse,
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
  input: CreateArchiveRuleRequest,
  output: CreateArchiveRuleResponse,
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
 * Checks whether a resource policy can grant public access to the specified resource type.
 */
export const checkNoPublicAccess: (
  input: CheckNoPublicAccessRequest,
) => effect.Effect<
  CheckNoPublicAccessResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterException
  | ThrottlingException
  | UnprocessableEntityException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckNoPublicAccessRequest,
  output: CheckNoPublicAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
    UnprocessableEntityException,
    ValidationException,
  ],
}));
/**
 * Checks whether the specified access isn't allowed by a policy.
 */
export const checkAccessNotGranted: (
  input: CheckAccessNotGrantedRequest,
) => effect.Effect<
  CheckAccessNotGrantedResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterException
  | ThrottlingException
  | UnprocessableEntityException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckAccessNotGrantedRequest,
  output: CheckAccessNotGrantedResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
    UnprocessableEntityException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of aggregated finding statistics for an external access or unused access analyzer.
 */
export const getFindingsStatistics: (
  input: GetFindingsStatisticsRequest,
) => effect.Effect<
  GetFindingsStatisticsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsStatisticsRequest,
  output: GetFindingsStatisticsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the policy that was generated using `StartPolicyGeneration`.
 */
export const getGeneratedPolicy: (
  input: GetGeneratedPolicyRequest,
) => effect.Effect<
  GetGeneratedPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeneratedPolicyRequest,
  output: GetGeneratedPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an access preview that allows you to preview IAM Access Analyzer findings for your resource before deploying resource permissions.
 */
export const createAccessPreview: (
  input: CreateAccessPreviewRequest,
) => effect.Effect<
  CreateAccessPreviewResponse,
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
  input: CreateAccessPreviewRequest,
  output: CreateAccessPreviewResponse,
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

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
  sdkId: "Secrets Manager",
  serviceShapeName: "secretsmanager",
});
const auth = T.AwsAuthSigv4({ name: "secretsmanager" });
const ver = T.ServiceVersion("2017-10-17");
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
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://secretsmanager-fips.${Region}.amazonaws.com`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://secretsmanager-fips.${Region}.amazonaws.com`);
            }
            return e(
              `https://secretsmanager-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://secretsmanager-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://secretsmanager.${Region}.amazonaws.com`);
            }
            if ("aws-cn" === _.getAttr(PartitionResult, "name")) {
              return e(`https://secretsmanager.${Region}.amazonaws.com.cn`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://secretsmanager.${Region}.amazonaws.com`);
            }
            return e(
              `https://secretsmanager.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://secretsmanager.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SecretIdType = string;
export type MaxResultsBatchType = number;
export type NextTokenType = string;
export type NameType = string;
export type ClientRequestTokenType = string;
export type DescriptionType = string;
export type KmsKeyIdType = string;
export type SecretBinaryType = Uint8Array | redacted.Redacted<Uint8Array>;
export type SecretStringType = string | redacted.Redacted<string>;
export type MedeaTypeType = string;
export type RecoveryWindowInDaysType = number;
export type PasswordLengthType = number;
export type ExcludeCharactersType = string;
export type ExcludeNumbersType = boolean;
export type ExcludePunctuationType = boolean;
export type ExcludeUppercaseType = boolean;
export type ExcludeLowercaseType = boolean;
export type IncludeSpaceType = boolean;
export type RequireEachIncludedTypeType = boolean;
export type SecretVersionIdType = string;
export type SecretVersionStageType = string;
export type MaxResultsType = number;
export type NonEmptyResourcePolicyType = string;
export type RotationTokenType = string | redacted.Redacted<string>;
export type RegionType = string;
export type RotationLambdaARNType = string;
export type RoleARNType = string;
export type TagKeyType = string;
export type FilterValueStringType = string;
export type TagValueType = string;
export type AutomaticallyRotateAfterDaysType = number;
export type DurationType = string;
export type ScheduleExpressionType = string;
export type ExternalSecretRotationMetadataItemKeyType = string;
export type ExternalSecretRotationMetadataItemValueType = string;
export type SecretARNType = string;
export type SecretNameType = string;
export type DeletionDateType = Date;
export type RotationEnabledType = boolean;
export type LastRotatedDateType = Date;
export type LastChangedDateType = Date;
export type LastAccessedDateType = Date;
export type DeletedDateType = Date;
export type NextRotationDateType = Date;
export type OwningServiceType = string;
export type RandomPasswordType = string | redacted.Redacted<string>;
export type CreatedDateType = Date;
export type ErrorMessage = string;
export type StatusMessageType = string;
export type ErrorCode = string;

//# Schemas
export type SecretIdListType = string[];
export const SecretIdListType = S.Array(S.String);
export type SortOrderType = "asc" | "desc" | (string & {});
export const SortOrderType = S.String;
export type SortByType =
  | "created-date"
  | "last-accessed-date"
  | "last-changed-date"
  | "name"
  | (string & {});
export const SortByType = S.String;
export type SecretVersionStagesType = string[];
export const SecretVersionStagesType = S.Array(S.String);
export type RemoveReplicaRegionListType = string[];
export const RemoveReplicaRegionListType = S.Array(S.String);
export type TagKeyListType = string[];
export const TagKeyListType = S.Array(S.String);
export interface CancelRotateSecretRequest {
  SecretId: string;
}
export const CancelRotateSecretRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelRotateSecretRequest",
}) as any as S.Schema<CancelRotateSecretRequest>;
export interface DeleteResourcePolicyRequest {
  SecretId: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteSecretRequest {
  SecretId: string;
  RecoveryWindowInDays?: number;
  ForceDeleteWithoutRecovery?: boolean;
}
export const DeleteSecretRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    RecoveryWindowInDays: S.optional(S.Number),
    ForceDeleteWithoutRecovery: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSecretRequest",
}) as any as S.Schema<DeleteSecretRequest>;
export interface DescribeSecretRequest {
  SecretId: string;
}
export const DescribeSecretRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSecretRequest",
}) as any as S.Schema<DescribeSecretRequest>;
export interface GetRandomPasswordRequest {
  PasswordLength?: number;
  ExcludeCharacters?: string;
  ExcludeNumbers?: boolean;
  ExcludePunctuation?: boolean;
  ExcludeUppercase?: boolean;
  ExcludeLowercase?: boolean;
  IncludeSpace?: boolean;
  RequireEachIncludedType?: boolean;
}
export const GetRandomPasswordRequest = S.suspend(() =>
  S.Struct({
    PasswordLength: S.optional(S.Number),
    ExcludeCharacters: S.optional(S.String),
    ExcludeNumbers: S.optional(S.Boolean),
    ExcludePunctuation: S.optional(S.Boolean),
    ExcludeUppercase: S.optional(S.Boolean),
    ExcludeLowercase: S.optional(S.Boolean),
    IncludeSpace: S.optional(S.Boolean),
    RequireEachIncludedType: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRandomPasswordRequest",
}) as any as S.Schema<GetRandomPasswordRequest>;
export interface GetResourcePolicyRequest {
  SecretId: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetSecretValueRequest {
  SecretId: string;
  VersionId?: string;
  VersionStage?: string;
}
export const GetSecretValueRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    VersionId: S.optional(S.String),
    VersionStage: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSecretValueRequest",
}) as any as S.Schema<GetSecretValueRequest>;
export type FilterNameStringType =
  | "description"
  | "name"
  | "tag-key"
  | "tag-value"
  | "primary-region"
  | "owning-service"
  | "all"
  | (string & {});
export const FilterNameStringType = S.String;
export type FilterValuesStringList = string[];
export const FilterValuesStringList = S.Array(S.String);
export interface Filter {
  Key?: FilterNameStringType;
  Values?: string[];
}
export const Filter = S.suspend(() =>
  S.Struct({
    Key: S.optional(FilterNameStringType),
    Values: S.optional(FilterValuesStringList),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FiltersListType = Filter[];
export const FiltersListType = S.Array(Filter);
export interface ListSecretsRequest {
  IncludePlannedDeletion?: boolean;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filter[];
  SortOrder?: SortOrderType;
  SortBy?: SortByType;
}
export const ListSecretsRequest = S.suspend(() =>
  S.Struct({
    IncludePlannedDeletion: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(FiltersListType),
    SortOrder: S.optional(SortOrderType),
    SortBy: S.optional(SortByType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSecretsRequest",
}) as any as S.Schema<ListSecretsRequest>;
export interface ListSecretVersionIdsRequest {
  SecretId: string;
  MaxResults?: number;
  NextToken?: string;
  IncludeDeprecated?: boolean;
}
export const ListSecretVersionIdsRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeDeprecated: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSecretVersionIdsRequest",
}) as any as S.Schema<ListSecretVersionIdsRequest>;
export interface PutResourcePolicyRequest {
  SecretId: string;
  ResourcePolicy: string;
  BlockPublicPolicy?: boolean;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    ResourcePolicy: S.String,
    BlockPublicPolicy: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface PutSecretValueRequest {
  SecretId: string;
  ClientRequestToken?: string;
  SecretBinary?: Uint8Array | redacted.Redacted<Uint8Array>;
  SecretString?: string | redacted.Redacted<string>;
  VersionStages?: string[];
  RotationToken?: string | redacted.Redacted<string>;
}
export const PutSecretValueRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    SecretBinary: S.optional(SensitiveBlob),
    SecretString: S.optional(SensitiveString),
    VersionStages: S.optional(SecretVersionStagesType),
    RotationToken: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutSecretValueRequest",
}) as any as S.Schema<PutSecretValueRequest>;
export interface RemoveRegionsFromReplicationRequest {
  SecretId: string;
  RemoveReplicaRegions: string[];
}
export const RemoveRegionsFromReplicationRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    RemoveReplicaRegions: RemoveReplicaRegionListType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveRegionsFromReplicationRequest",
}) as any as S.Schema<RemoveRegionsFromReplicationRequest>;
export interface ReplicaRegionType {
  Region?: string;
  KmsKeyId?: string;
}
export const ReplicaRegionType = S.suspend(() =>
  S.Struct({ Region: S.optional(S.String), KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "ReplicaRegionType",
}) as any as S.Schema<ReplicaRegionType>;
export type AddReplicaRegionListType = ReplicaRegionType[];
export const AddReplicaRegionListType = S.Array(ReplicaRegionType);
export interface ReplicateSecretToRegionsRequest {
  SecretId: string;
  AddReplicaRegions: ReplicaRegionType[];
  ForceOverwriteReplicaSecret?: boolean;
}
export const ReplicateSecretToRegionsRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    AddReplicaRegions: AddReplicaRegionListType,
    ForceOverwriteReplicaSecret: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ReplicateSecretToRegionsRequest",
}) as any as S.Schema<ReplicateSecretToRegionsRequest>;
export interface RestoreSecretRequest {
  SecretId: string;
}
export const RestoreSecretRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreSecretRequest",
}) as any as S.Schema<RestoreSecretRequest>;
export interface StopReplicationToReplicaRequest {
  SecretId: string;
}
export const StopReplicationToReplicaRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopReplicationToReplicaRequest",
}) as any as S.Schema<StopReplicationToReplicaRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagListType = Tag[];
export const TagListType = S.Array(Tag);
export interface TagResourceRequest {
  SecretId: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String, Tags: TagListType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  SecretId: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ SecretId: S.String, TagKeys: TagKeyListType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateSecretRequest {
  SecretId: string;
  ClientRequestToken?: string;
  Description?: string;
  KmsKeyId?: string;
  SecretBinary?: Uint8Array | redacted.Redacted<Uint8Array>;
  SecretString?: string | redacted.Redacted<string>;
  Type?: string;
}
export const UpdateSecretRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    SecretBinary: S.optional(SensitiveBlob),
    SecretString: S.optional(SensitiveString),
    Type: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSecretRequest",
}) as any as S.Schema<UpdateSecretRequest>;
export interface UpdateSecretVersionStageRequest {
  SecretId: string;
  VersionStage: string;
  RemoveFromVersionId?: string;
  MoveToVersionId?: string;
}
export const UpdateSecretVersionStageRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    VersionStage: S.String,
    RemoveFromVersionId: S.optional(S.String),
    MoveToVersionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSecretVersionStageRequest",
}) as any as S.Schema<UpdateSecretVersionStageRequest>;
export interface ValidateResourcePolicyRequest {
  SecretId?: string;
  ResourcePolicy: string;
}
export const ValidateResourcePolicyRequest = S.suspend(() =>
  S.Struct({ SecretId: S.optional(S.String), ResourcePolicy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ValidateResourcePolicyRequest",
}) as any as S.Schema<ValidateResourcePolicyRequest>;
export interface RotationRulesType {
  AutomaticallyAfterDays?: number;
  Duration?: string;
  ScheduleExpression?: string;
}
export const RotationRulesType = S.suspend(() =>
  S.Struct({
    AutomaticallyAfterDays: S.optional(S.Number),
    Duration: S.optional(S.String),
    ScheduleExpression: S.optional(S.String),
  }),
).annotations({
  identifier: "RotationRulesType",
}) as any as S.Schema<RotationRulesType>;
export interface ExternalSecretRotationMetadataItem {
  Key?: string;
  Value?: string;
}
export const ExternalSecretRotationMetadataItem = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "ExternalSecretRotationMetadataItem",
}) as any as S.Schema<ExternalSecretRotationMetadataItem>;
export type ExternalSecretRotationMetadataType =
  ExternalSecretRotationMetadataItem[];
export const ExternalSecretRotationMetadataType = S.Array(
  ExternalSecretRotationMetadataItem,
);
export interface BatchGetSecretValueRequest {
  SecretIdList?: string[];
  Filters?: Filter[];
  MaxResults?: number;
  NextToken?: string;
}
export const BatchGetSecretValueRequest = S.suspend(() =>
  S.Struct({
    SecretIdList: S.optional(SecretIdListType),
    Filters: S.optional(FiltersListType),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetSecretValueRequest",
}) as any as S.Schema<BatchGetSecretValueRequest>;
export interface CancelRotateSecretResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
}
export const CancelRotateSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelRotateSecretResponse",
}) as any as S.Schema<CancelRotateSecretResponse>;
export interface CreateSecretRequest {
  Name: string;
  ClientRequestToken?: string;
  Description?: string;
  KmsKeyId?: string;
  SecretBinary?: Uint8Array | redacted.Redacted<Uint8Array>;
  SecretString?: string | redacted.Redacted<string>;
  Tags?: Tag[];
  AddReplicaRegions?: ReplicaRegionType[];
  ForceOverwriteReplicaSecret?: boolean;
  Type?: string;
}
export const CreateSecretRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Description: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    SecretBinary: S.optional(SensitiveBlob),
    SecretString: S.optional(SensitiveString),
    Tags: S.optional(TagListType),
    AddReplicaRegions: S.optional(AddReplicaRegionListType),
    ForceOverwriteReplicaSecret: S.optional(S.Boolean),
    Type: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSecretRequest",
}) as any as S.Schema<CreateSecretRequest>;
export interface DeleteResourcePolicyResponse {
  ARN?: string;
  Name?: string;
}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteSecretResponse {
  ARN?: string;
  Name?: string;
  DeletionDate?: Date;
}
export const DeleteSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DeleteSecretResponse",
}) as any as S.Schema<DeleteSecretResponse>;
export interface GetRandomPasswordResponse {
  RandomPassword?: string | redacted.Redacted<string>;
}
export const GetRandomPasswordResponse = S.suspend(() =>
  S.Struct({ RandomPassword: S.optional(SensitiveString) }),
).annotations({
  identifier: "GetRandomPasswordResponse",
}) as any as S.Schema<GetRandomPasswordResponse>;
export interface GetResourcePolicyResponse {
  ARN?: string;
  Name?: string;
  ResourcePolicy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface GetSecretValueResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
  SecretBinary?: Uint8Array | redacted.Redacted<Uint8Array>;
  SecretString?: string | redacted.Redacted<string>;
  VersionStages?: string[];
  CreatedDate?: Date;
}
export const GetSecretValueResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
    SecretBinary: S.optional(SensitiveBlob),
    SecretString: S.optional(SensitiveString),
    VersionStages: S.optional(SecretVersionStagesType),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetSecretValueResponse",
}) as any as S.Schema<GetSecretValueResponse>;
export interface PutResourcePolicyResponse {
  ARN?: string;
  Name?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface PutSecretValueResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
  VersionStages?: string[];
}
export const PutSecretValueResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
    VersionStages: S.optional(SecretVersionStagesType),
  }),
).annotations({
  identifier: "PutSecretValueResponse",
}) as any as S.Schema<PutSecretValueResponse>;
export type StatusType = "InSync" | "Failed" | "InProgress" | (string & {});
export const StatusType = S.String;
export interface ReplicationStatusType {
  Region?: string;
  KmsKeyId?: string;
  Status?: StatusType;
  StatusMessage?: string;
  LastAccessedDate?: Date;
}
export const ReplicationStatusType = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Status: S.optional(StatusType),
    StatusMessage: S.optional(S.String),
    LastAccessedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ReplicationStatusType",
}) as any as S.Schema<ReplicationStatusType>;
export type ReplicationStatusListType = ReplicationStatusType[];
export const ReplicationStatusListType = S.Array(ReplicationStatusType);
export interface RemoveRegionsFromReplicationResponse {
  ARN?: string;
  ReplicationStatus?: ReplicationStatusType[];
}
export const RemoveRegionsFromReplicationResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    ReplicationStatus: S.optional(ReplicationStatusListType),
  }),
).annotations({
  identifier: "RemoveRegionsFromReplicationResponse",
}) as any as S.Schema<RemoveRegionsFromReplicationResponse>;
export interface ReplicateSecretToRegionsResponse {
  ARN?: string;
  ReplicationStatus?: ReplicationStatusType[];
}
export const ReplicateSecretToRegionsResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    ReplicationStatus: S.optional(ReplicationStatusListType),
  }),
).annotations({
  identifier: "ReplicateSecretToRegionsResponse",
}) as any as S.Schema<ReplicateSecretToRegionsResponse>;
export interface RestoreSecretResponse {
  ARN?: string;
  Name?: string;
}
export const RestoreSecretResponse = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "RestoreSecretResponse",
}) as any as S.Schema<RestoreSecretResponse>;
export interface RotateSecretRequest {
  SecretId: string;
  ClientRequestToken?: string;
  RotationLambdaARN?: string;
  RotationRules?: RotationRulesType;
  ExternalSecretRotationMetadata?: ExternalSecretRotationMetadataItem[];
  ExternalSecretRotationRoleArn?: string;
  RotateImmediately?: boolean;
}
export const RotateSecretRequest = S.suspend(() =>
  S.Struct({
    SecretId: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    RotationLambdaARN: S.optional(S.String),
    RotationRules: S.optional(RotationRulesType),
    ExternalSecretRotationMetadata: S.optional(
      ExternalSecretRotationMetadataType,
    ),
    ExternalSecretRotationRoleArn: S.optional(S.String),
    RotateImmediately: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RotateSecretRequest",
}) as any as S.Schema<RotateSecretRequest>;
export interface StopReplicationToReplicaResponse {
  ARN?: string;
}
export const StopReplicationToReplicaResponse = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String) }),
).annotations({
  identifier: "StopReplicationToReplicaResponse",
}) as any as S.Schema<StopReplicationToReplicaResponse>;
export interface UpdateSecretResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
}
export const UpdateSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSecretResponse",
}) as any as S.Schema<UpdateSecretResponse>;
export interface UpdateSecretVersionStageResponse {
  ARN?: string;
  Name?: string;
}
export const UpdateSecretVersionStageResponse = S.suspend(() =>
  S.Struct({ ARN: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSecretVersionStageResponse",
}) as any as S.Schema<UpdateSecretVersionStageResponse>;
export type KmsKeyIdListType = string[];
export const KmsKeyIdListType = S.Array(S.String);
export type SecretVersionsToStagesMapType = {
  [key: string]: string[] | undefined;
};
export const SecretVersionsToStagesMapType = S.Record({
  key: S.String,
  value: S.UndefinedOr(SecretVersionStagesType),
});
export interface SecretListEntry {
  ARN?: string;
  Name?: string;
  Type?: string;
  Description?: string;
  KmsKeyId?: string;
  RotationEnabled?: boolean;
  RotationLambdaARN?: string;
  RotationRules?: RotationRulesType;
  ExternalSecretRotationMetadata?: ExternalSecretRotationMetadataItem[];
  ExternalSecretRotationRoleArn?: string;
  LastRotatedDate?: Date;
  LastChangedDate?: Date;
  LastAccessedDate?: Date;
  DeletedDate?: Date;
  NextRotationDate?: Date;
  Tags?: Tag[];
  SecretVersionsToStages?: { [key: string]: string[] | undefined };
  OwningService?: string;
  CreatedDate?: Date;
  PrimaryRegion?: string;
}
export const SecretListEntry = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    RotationEnabled: S.optional(S.Boolean),
    RotationLambdaARN: S.optional(S.String),
    RotationRules: S.optional(RotationRulesType),
    ExternalSecretRotationMetadata: S.optional(
      ExternalSecretRotationMetadataType,
    ),
    ExternalSecretRotationRoleArn: S.optional(S.String),
    LastRotatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastChangedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAccessedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeletedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextRotationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagListType),
    SecretVersionsToStages: S.optional(SecretVersionsToStagesMapType),
    OwningService: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PrimaryRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "SecretListEntry",
}) as any as S.Schema<SecretListEntry>;
export type SecretListType = SecretListEntry[];
export const SecretListType = S.Array(SecretListEntry);
export interface SecretVersionsListEntry {
  VersionId?: string;
  VersionStages?: string[];
  LastAccessedDate?: Date;
  CreatedDate?: Date;
  KmsKeyIds?: string[];
}
export const SecretVersionsListEntry = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String),
    VersionStages: S.optional(SecretVersionStagesType),
    LastAccessedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    KmsKeyIds: S.optional(KmsKeyIdListType),
  }),
).annotations({
  identifier: "SecretVersionsListEntry",
}) as any as S.Schema<SecretVersionsListEntry>;
export type SecretVersionsListType = SecretVersionsListEntry[];
export const SecretVersionsListType = S.Array(SecretVersionsListEntry);
export interface ValidationErrorsEntry {
  CheckName?: string;
  ErrorMessage?: string;
}
export const ValidationErrorsEntry = S.suspend(() =>
  S.Struct({
    CheckName: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ValidationErrorsEntry",
}) as any as S.Schema<ValidationErrorsEntry>;
export type ValidationErrorsType = ValidationErrorsEntry[];
export const ValidationErrorsType = S.Array(ValidationErrorsEntry);
export interface CreateSecretResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
  ReplicationStatus?: ReplicationStatusType[];
}
export const CreateSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
    ReplicationStatus: S.optional(ReplicationStatusListType),
  }),
).annotations({
  identifier: "CreateSecretResponse",
}) as any as S.Schema<CreateSecretResponse>;
export interface DescribeSecretResponse {
  ARN?: string;
  Name?: string;
  Type?: string;
  Description?: string;
  KmsKeyId?: string;
  RotationEnabled?: boolean;
  RotationLambdaARN?: string;
  RotationRules?: RotationRulesType;
  ExternalSecretRotationMetadata?: ExternalSecretRotationMetadataItem[];
  ExternalSecretRotationRoleArn?: string;
  LastRotatedDate?: Date;
  LastChangedDate?: Date;
  LastAccessedDate?: Date;
  DeletedDate?: Date;
  NextRotationDate?: Date;
  Tags?: Tag[];
  VersionIdsToStages?: { [key: string]: string[] | undefined };
  OwningService?: string;
  CreatedDate?: Date;
  PrimaryRegion?: string;
  ReplicationStatus?: ReplicationStatusType[];
}
export const DescribeSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    RotationEnabled: S.optional(S.Boolean),
    RotationLambdaARN: S.optional(S.String),
    RotationRules: S.optional(RotationRulesType),
    ExternalSecretRotationMetadata: S.optional(
      ExternalSecretRotationMetadataType,
    ),
    ExternalSecretRotationRoleArn: S.optional(S.String),
    LastRotatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastChangedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAccessedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeletedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextRotationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagListType),
    VersionIdsToStages: S.optional(SecretVersionsToStagesMapType),
    OwningService: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PrimaryRegion: S.optional(S.String),
    ReplicationStatus: S.optional(ReplicationStatusListType),
  }),
).annotations({
  identifier: "DescribeSecretResponse",
}) as any as S.Schema<DescribeSecretResponse>;
export interface ListSecretsResponse {
  SecretList?: SecretListEntry[];
  NextToken?: string;
}
export const ListSecretsResponse = S.suspend(() =>
  S.Struct({
    SecretList: S.optional(SecretListType),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecretsResponse",
}) as any as S.Schema<ListSecretsResponse>;
export interface ListSecretVersionIdsResponse {
  Versions?: SecretVersionsListEntry[];
  NextToken?: string;
  ARN?: string;
  Name?: string;
}
export const ListSecretVersionIdsResponse = S.suspend(() =>
  S.Struct({
    Versions: S.optional(SecretVersionsListType),
    NextToken: S.optional(S.String),
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSecretVersionIdsResponse",
}) as any as S.Schema<ListSecretVersionIdsResponse>;
export interface RotateSecretResponse {
  ARN?: string;
  Name?: string;
  VersionId?: string;
}
export const RotateSecretResponse = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "RotateSecretResponse",
}) as any as S.Schema<RotateSecretResponse>;
export interface ValidateResourcePolicyResponse {
  PolicyValidationPassed?: boolean;
  ValidationErrors?: ValidationErrorsEntry[];
}
export const ValidateResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyValidationPassed: S.optional(S.Boolean),
    ValidationErrors: S.optional(ValidationErrorsType),
  }),
).annotations({
  identifier: "ValidateResourcePolicyResponse",
}) as any as S.Schema<ValidateResourcePolicyResponse>;
export interface SecretValueEntry {
  ARN?: string;
  Name?: string;
  VersionId?: string;
  SecretBinary?: Uint8Array | redacted.Redacted<Uint8Array>;
  SecretString?: string | redacted.Redacted<string>;
  VersionStages?: string[];
  CreatedDate?: Date;
}
export const SecretValueEntry = S.suspend(() =>
  S.Struct({
    ARN: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
    SecretBinary: S.optional(SensitiveBlob),
    SecretString: S.optional(SensitiveString),
    VersionStages: S.optional(SecretVersionStagesType),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SecretValueEntry",
}) as any as S.Schema<SecretValueEntry>;
export type SecretValuesType = SecretValueEntry[];
export const SecretValuesType = S.Array(SecretValueEntry);
export interface APIErrorType {
  SecretId?: string;
  ErrorCode?: string;
  Message?: string;
}
export const APIErrorType = S.suspend(() =>
  S.Struct({
    SecretId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({ identifier: "APIErrorType" }) as any as S.Schema<APIErrorType>;
export type APIErrorListType = APIErrorType[];
export const APIErrorListType = S.Array(APIErrorType);
export interface BatchGetSecretValueResponse {
  SecretValues?: SecretValueEntry[];
  NextToken?: string;
  Errors?: APIErrorType[];
}
export const BatchGetSecretValueResponse = S.suspend(() =>
  S.Struct({
    SecretValues: S.optional(SecretValuesType),
    NextToken: S.optional(S.String),
    Errors: S.optional(APIErrorListType),
  }),
).annotations({
  identifier: "BatchGetSecretValueResponse",
}) as any as S.Schema<BatchGetSecretValueResponse>;

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.optional(S.String) },
) {}
export class DecryptionFailure extends S.TaggedError<DecryptionFailure>()(
  "DecryptionFailure",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class EncryptionFailure extends S.TaggedError<EncryptionFailure>()(
  "EncryptionFailure",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { Message: S.optional(S.String) },
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.optional(S.String) },
) {}
export class PreconditionNotMetException extends S.TaggedError<PreconditionNotMetException>()(
  "PreconditionNotMetException",
  { Message: S.optional(S.String) },
) {}
export class PublicPolicyException extends S.TaggedError<PublicPolicyException>()(
  "PublicPolicyException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the details of a secret. It does not include the encrypted secret value.
 * Secrets Manager only returns fields that have a value in the response.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:DescribeSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const describeSecret: (
  input: DescribeSecretRequest,
) => effect.Effect<
  DescribeSecretResponse,
  | InternalServiceError
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecretRequest,
  output: DescribeSecretResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes specific tags from a secret.
 *
 * This operation is idempotent. If a requested tag is not attached to the secret, no
 * error is returned and the secret metadata is unchanged.
 *
 * If you use tags as part of your security strategy, then removing a tag can change
 * permissions. If successfully completing this operation would result in you losing
 * your permissions for this secret, then the operation is blocked and returns an
 * Access Denied error.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:UntagResource`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Turns off automatic rotation, and if a rotation is currently in progress, cancels the
 * rotation.
 *
 * If you cancel a rotation in progress, it can leave the `VersionStage`
 * labels in an unexpected state. You might need to remove the staging label
 * `AWSPENDING` from the partially created version. You also need to
 * determine whether to roll back to the previous version of the secret by moving the
 * staging label `AWSCURRENT` to the version that has `AWSPENDING`.
 * To determine which version has a specific staging label, call ListSecretVersionIds. Then use UpdateSecretVersionStage to change staging labels. For more information, see How rotation
 * works.
 *
 * To turn on automatic rotation again, call RotateSecret.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:CancelRotateSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const cancelRotateSecret: (
  input: CancelRotateSecretRequest,
) => effect.Effect<
  CancelRotateSecretResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelRotateSecretRequest,
  output: CancelRotateSecretResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the resource-based permission policy attached to the secret. To attach a
 * policy to a secret, use PutResourcePolicy.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:DeleteResourcePolicy`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a secret and all of its versions. You can specify a recovery window during
 * which you can restore the secret. The minimum recovery window is 7 days. The default
 * recovery window is 30 days. Secrets Manager attaches a `DeletionDate` stamp to the
 * secret that specifies the end of the recovery window. At the end of the recovery window,
 * Secrets Manager deletes the secret permanently.
 *
 * You can't delete a primary secret that is replicated to other Regions. You must first
 * delete the replicas using RemoveRegionsFromReplication, and then
 * delete the primary secret. When you delete a replica, it is deleted immediately.
 *
 * You can't directly delete a version of a secret. Instead, you remove all staging
 * labels from the version using UpdateSecretVersionStage. This marks the
 * version as deprecated, and then Secrets Manager can automatically delete the version in the
 * background.
 *
 * To determine whether an application still uses a secret, you can create an Amazon CloudWatch alarm
 * to alert you to any attempts to access a secret during the recovery window. For more
 * information, see
 * Monitor secrets scheduled for deletion.
 *
 * Secrets Manager performs the permanent secret deletion at the end of the waiting period as a
 * background task with low priority. There is no guarantee of a specific time after the
 * recovery window for the permanent delete to occur.
 *
 * At any time before recovery window ends, you can use RestoreSecret
 * to remove the `DeletionDate` and cancel the deletion of the secret.
 *
 * When a secret is scheduled for deletion, you cannot retrieve the secret value. You
 * must first cancel the deletion with RestoreSecret and then you can
 * retrieve the secret.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:DeleteSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const deleteSecret: (
  input: DeleteSecretRequest,
) => effect.Effect<
  DeleteSecretResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecretRequest,
  output: DeleteSecretResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Generates a random password. We recommend that you specify the maximum length and
 * include every character type that the system you are generating a password for can
 * support. By default, Secrets Manager uses uppercase and lowercase letters, numbers, and the
 * following characters in passwords:
 * `!\"#$%&'()*+,-./:;?@[\\]^_`{|}~`
 *
 * Secrets Manager generates a CloudTrail log entry when you call this
 * action.
 *
 * Required permissions:
 *
 * `secretsmanager:GetRandomPassword`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const getRandomPassword: (
  input: GetRandomPasswordRequest,
) => effect.Effect<
  GetRandomPasswordResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRandomPasswordRequest,
  output: GetRandomPasswordResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
  ],
}));
/**
 * Retrieves the JSON text of the resource-based policy document attached to the secret.
 * For more information about permissions policies attached to a secret, see Permissions policies attached to a secret.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:GetResourcePolicy`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * For a secret that is replicated to other Regions, deletes the secret replicas from the
 * Regions you specify.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:RemoveRegionsFromReplication`.
 * For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const removeRegionsFromReplication: (
  input: RemoveRegionsFromReplicationRequest,
) => effect.Effect<
  RemoveRegionsFromReplicationResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveRegionsFromReplicationRequest,
  output: RemoveRegionsFromReplicationResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Replicates the secret to a new Regions. See Multi-Region secrets.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:ReplicateSecretToRegions`. If the primary
 * secret is encrypted with a KMS key other than `aws/secretsmanager`, you also
 * need `kms:Decrypt` permission to the key. To encrypt the replicated secret
 * with a KMS key other than `aws/secretsmanager`, you need
 * `kms:GenerateDataKey` and `kms:Encrypt` to the key.
 * For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const replicateSecretToRegions: (
  input: ReplicateSecretToRegionsRequest,
) => effect.Effect<
  ReplicateSecretToRegionsResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReplicateSecretToRegionsRequest,
  output: ReplicateSecretToRegionsResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Cancels the scheduled deletion of a secret by removing the `DeletedDate`
 * time stamp. You can access a secret again after it has been restored.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:RestoreSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const restoreSecret: (
  input: RestoreSecretRequest,
) => effect.Effect<
  RestoreSecretResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreSecretRequest,
  output: RestoreSecretResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the link between the replica secret and the primary secret and promotes the
 * replica to a primary secret in the replica Region.
 *
 * You must call this operation from the Region in which you want to promote the replica
 * to a primary secret.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:StopReplicationToReplica`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const stopReplicationToReplica: (
  input: StopReplicationToReplicaRequest,
) => effect.Effect<
  StopReplicationToReplicaResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationToReplicaRequest,
  output: StopReplicationToReplicaResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the contents of the encrypted fields `SecretString` or
 * `SecretBinary` from the specified version of a secret, whichever contains
 * content.
 *
 * To retrieve the values for a group of secrets, call BatchGetSecretValue.
 *
 * We recommend that you cache your secret values by using client-side caching. Caching
 * secrets improves speed and reduces your costs. For more information, see Cache secrets for your applications.
 *
 * To retrieve the previous version of a secret, use `VersionStage` and
 * specify AWSPREVIOUS. To revert to the previous version of a secret, call UpdateSecretVersionStage.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:GetSecretValue`. If the secret is encrypted
 * using a customer-managed key instead of the Amazon Web Services managed key
 * `aws/secretsmanager`, then you also need `kms:Decrypt`
 * permissions for that key. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const getSecretValue: (
  input: GetSecretValueRequest,
) => effect.Effect<
  GetSecretValueResponse,
  | DecryptionFailure
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecretValueRequest,
  output: GetSecretValueResponse,
  errors: [
    DecryptionFailure,
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Configures and starts the asynchronous process of rotating the secret. For information
 * about rotation, see Rotate secrets
 * in the *Secrets Manager User Guide*. If you include the configuration
 * parameters, the operation sets the values for the secret and then immediately starts a
 * rotation. If you don't include the configuration parameters, the operation starts a
 * rotation with the values already stored in the secret.
 *
 * When rotation is successful, the `AWSPENDING` staging label might be
 * attached to the same version as the `AWSCURRENT` version, or it might not be
 * attached to any version. If the `AWSPENDING` staging label is present but not
 * attached to the same version as `AWSCURRENT`, then any later invocation of
 * `RotateSecret` assumes that a previous rotation request is still in
 * progress and returns an error. When rotation is unsuccessful, the
 * `AWSPENDING` staging label might be attached to an empty secret version.
 * For more information, see Troubleshoot
 * rotation in the *Secrets Manager User Guide*.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:RotateSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager. You also
 * need `lambda:InvokeFunction` permissions on the rotation function. For more
 * information, see Permissions for rotation.
 */
export const rotateSecret: (
  input: RotateSecretRequest,
) => effect.Effect<
  RotateSecretResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateSecretRequest,
  output: RotateSecretResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the secrets that are stored by Secrets Manager in the Amazon Web Services account, not including secrets
 * that are marked for deletion. To see secrets marked for deletion, use the Secrets Manager
 * console.
 *
 * All Secrets Manager operations are eventually consistent. ListSecrets might not
 * reflect changes from the last five minutes. You can get more recent information for a
 * specific secret by calling DescribeSecret.
 *
 * To list the versions of a secret, use ListSecretVersionIds.
 *
 * To retrieve the values for the secrets, call BatchGetSecretValue or
 * GetSecretValue.
 *
 * For information about finding secrets in the console, see Find secrets in
 * Secrets Manager.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:ListSecrets`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const listSecrets: {
  (
    input: ListSecretsRequest,
  ): effect.Effect<
    ListSecretsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecretsRequest,
  ) => stream.Stream<
    ListSecretsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecretsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecretsRequest,
  output: ListSecretsResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Attaches tags to a secret. Tags consist of a key name and a value. Tags are part of
 * the secret's metadata. They are not associated with specific versions of the secret.
 * This operation appends tags to the existing list of tags.
 *
 * For tag quotas and naming restrictions, see Service quotas for
 * Tagging in the *Amazon Web Services General Reference guide*.
 *
 * If you use tags as part of your security strategy, then adding or removing a tag
 * can change permissions. If successfully completing this operation would result in
 * you losing your permissions for this secret, then the operation is blocked and
 * returns an Access Denied error.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:TagResource`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the versions of a secret. Secrets Manager uses staging labels to indicate the different
 * versions of a secret. For more information, see Secrets Manager
 * concepts: Versions.
 *
 * To list the secrets in the account, use ListSecrets.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:ListSecretVersionIds`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const listSecretVersionIds: {
  (
    input: ListSecretVersionIdsRequest,
  ): effect.Effect<
    ListSecretVersionIdsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecretVersionIdsRequest,
  ) => stream.Stream<
    ListSecretVersionIdsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecretVersionIdsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecretVersionIdsRequest,
  output: ListSecretVersionIdsResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the contents of the encrypted fields `SecretString` or
 * `SecretBinary` for up to 20 secrets. To retrieve a single secret, call
 * GetSecretValue.
 *
 * To choose which secrets to retrieve, you can specify a list of secrets by name or ARN,
 * or you can use filters. If Secrets Manager encounters errors such as
 * `AccessDeniedException` while attempting to retrieve any of the secrets,
 * you can see the errors in `Errors` in the response.
 *
 * Secrets Manager generates CloudTrail
 * `GetSecretValue` log entries for each secret you request when you call this
 * action. Do not include sensitive information in request parameters because it might be
 * logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * **Required permissions: **
 * `secretsmanager:BatchGetSecretValue`, and you must have
 * `secretsmanager:GetSecretValue` for each secret. If you use filters, you
 * must also have `secretsmanager:ListSecrets`. If the secrets are encrypted
 * using customer-managed keys instead of the Amazon Web Services managed key
 * `aws/secretsmanager`, then you also need `kms:Decrypt`
 * permissions for the keys. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const batchGetSecretValue: {
  (
    input: BatchGetSecretValueRequest,
  ): effect.Effect<
    BatchGetSecretValueResponse,
    | DecryptionFailure
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: BatchGetSecretValueRequest,
  ) => stream.Stream<
    BatchGetSecretValueResponse,
    | DecryptionFailure
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: BatchGetSecretValueRequest,
  ) => stream.Stream<
    unknown,
    | DecryptionFailure
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidParameterException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: BatchGetSecretValueRequest,
  output: BatchGetSecretValueResponse,
  errors: [
    DecryptionFailure,
    InternalServiceError,
    InvalidNextTokenException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Validates that a resource policy does not grant a wide range of principals access to
 * your secret. A resource-based policy is optional for secrets.
 *
 * The API performs three checks when validating the policy:
 *
 * - Sends a call to Zelkova, an automated reasoning engine, to ensure your resource
 * policy does not allow broad access to your secret, for example policies that use
 * a wildcard for the principal.
 *
 * - Checks for correct syntax in a policy.
 *
 * - Verifies the policy does not lock out a caller.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:ValidateResourcePolicy` and
 * `secretsmanager:PutResourcePolicy`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const validateResourcePolicy: (
  input: ValidateResourcePolicyRequest,
) => effect.Effect<
  ValidateResourcePolicyResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | MalformedPolicyDocumentException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateResourcePolicyRequest,
  output: ValidateResourcePolicyResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    MalformedPolicyDocumentException,
    ResourceNotFoundException,
  ],
}));
/**
 * Modifies the staging labels attached to a version of a secret. Secrets Manager uses staging
 * labels to track a version as it progresses through the secret rotation process. Each
 * staging label can be attached to only one version at a time. To add a staging label to a
 * version when it is already attached to another version, Secrets Manager first removes it from the
 * other version first and then attaches it to this one. For more information about
 * versions and staging labels, see Concepts:
 * Version.
 *
 * The staging labels that you specify in the `VersionStage` parameter are
 * added to the existing list of staging labels for the version.
 *
 * You can move the `AWSCURRENT` staging label to this version by including it
 * in this call.
 *
 * Whenever you move `AWSCURRENT`, Secrets Manager automatically moves the label
 * `AWSPREVIOUS` to the version that `AWSCURRENT` was removed
 * from.
 *
 * If this action results in the last label being removed from a version, then the
 * version is considered to be 'deprecated' and can be deleted by Secrets Manager.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:UpdateSecretVersionStage`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const updateSecretVersionStage: (
  input: UpdateSecretVersionStageRequest,
) => effect.Effect<
  UpdateSecretVersionStageResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecretVersionStageRequest,
  output: UpdateSecretVersionStageResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new version of your secret by creating a new encrypted value and attaching
 * it to the secret. version can contain a new `SecretString` value or a new
 * `SecretBinary` value.
 *
 * Do not call `PutSecretValue` at a sustained rate of more than once every 10
 * minutes. When you update the secret value, Secrets Manager creates a new version of the secret.
 * Secrets Manager keeps 100 of the most recent versions, but it keeps *all*
 * secret versions created in the last 24 hours. If you call `PutSecretValue`
 * more than once every 10 minutes, you will create more versions than Secrets Manager removes, and
 * you will reach the quota for secret versions.
 *
 * You can specify the staging labels to attach to the new version in
 * `VersionStages`. If you don't include `VersionStages`, then
 * Secrets Manager automatically moves the staging label `AWSCURRENT` to this version. If
 * this operation creates the first version for the secret, then Secrets Manager automatically
 * attaches the staging label `AWSCURRENT` to it. If this operation moves the
 * staging label `AWSCURRENT` from another version to this version, then Secrets Manager
 * also automatically moves the staging label `AWSPREVIOUS` to the version that
 * `AWSCURRENT` was removed from.
 *
 * This operation is idempotent. If you call this operation with a
 * `ClientRequestToken` that matches an existing version's VersionId, and
 * you specify the same secret data, the operation succeeds but does nothing. However, if
 * the secret data is different, then the operation fails because you can't modify an
 * existing version; you can only create new ones.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action.
 * Do not include sensitive information in request parameters except
 * `SecretBinary`, `SecretString`, or `RotationToken`
 * because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:PutSecretValue`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 *
 * When you enter commands in a command shell, there is a risk of the command history being accessed or utilities having access to your command parameters. This is a concern if the command includes the value of a secret. Learn how to Mitigate the risks of using command-line tools to store Secrets Manager secrets.
 */
export const putSecretValue: (
  input: PutSecretValueRequest,
) => effect.Effect<
  PutSecretValueResponse,
  | DecryptionFailure
  | EncryptionFailure
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | ResourceExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSecretValueRequest,
  output: PutSecretValueResponse,
  errors: [
    DecryptionFailure,
    EncryptionFailure,
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Modifies the details of a secret, including metadata and the secret value. To change
 * the secret value, you can also use PutSecretValue.
 *
 * To change the rotation configuration of a secret, use RotateSecret
 * instead.
 *
 * To change a secret so that it is managed by another service, you need to recreate the
 * secret in that service. See Secrets Manager secrets
 * managed by other Amazon Web Services services.
 *
 * We recommend you avoid calling `UpdateSecret` at a sustained rate of more
 * than once every 10 minutes. When you call `UpdateSecret` to update the secret
 * value, Secrets Manager creates a new version of the secret. Secrets Manager removes outdated versions when
 * there are more than 100, but it does not remove versions created less than 24 hours ago.
 * If you update the secret value more than once every 10 minutes, you create more versions
 * than Secrets Manager removes, and you will reach the quota for secret versions.
 *
 * If you include `SecretString` or `SecretBinary` to create a new
 * secret version, Secrets Manager automatically moves the staging label `AWSCURRENT` to
 * the new version. Then it attaches the label `AWSPREVIOUS` to the version that
 * `AWSCURRENT` was removed from.
 *
 * If you call this operation with a `ClientRequestToken` that matches an
 * existing version's `VersionId`, the operation results in an error. You can't
 * modify an existing version, you can only create a new version. To remove a version,
 * remove all staging labels from it. See UpdateSecretVersionStage.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action.
 * Do not include sensitive information in request parameters except
 * `SecretBinary` or `SecretString` because it might be logged.
 * For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:UpdateSecret`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager. If you use a
 * customer managed key, you must also have `kms:GenerateDataKey`,
 * `kms:Encrypt`, and `kms:Decrypt` permissions on the key. If
 * you change the KMS key and you don't have `kms:Encrypt` permission to the new
 * key, Secrets Manager does not re-encrypt existing secret versions with the new key. For more
 * information, see Secret encryption
 * and decryption.
 *
 * When you enter commands in a command shell, there is a risk of the command history being accessed or utilities having access to your command parameters. This is a concern if the command includes the value of a secret. Learn how to Mitigate the risks of using command-line tools to store Secrets Manager secrets.
 */
export const updateSecret: (
  input: UpdateSecretRequest,
) => effect.Effect<
  UpdateSecretResponse,
  | DecryptionFailure
  | EncryptionFailure
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | PreconditionNotMetException
  | ResourceExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSecretRequest,
  output: UpdateSecretResponse,
  errors: [
    DecryptionFailure,
    EncryptionFailure,
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    PreconditionNotMetException,
    ResourceExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Attaches a resource-based permission policy to a secret. A resource-based policy is
 * optional. For more information, see Authentication and access control for Secrets Manager
 *
 * For information about attaching a policy in the console, see Attach a permissions policy to a secret.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action. Do not include sensitive information in request parameters because it might be logged. For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:PutResourcePolicy`. For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | MalformedPolicyDocumentException
  | PublicPolicyException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    MalformedPolicyDocumentException,
    PublicPolicyException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new secret. A *secret* can be a password, a set of
 * credentials such as a user name and password, an OAuth token, or other secret
 * information that you store in an encrypted form in Secrets Manager. The secret also includes the
 * connection information to access a database or other service, which Secrets Manager doesn't
 * encrypt. A secret in Secrets Manager consists of both the protected secret data and the important
 * information needed to manage the secret.
 *
 * For secrets that use *managed rotation*, you need to create the
 * secret through the managing service. For more information, see Secrets Manager secrets
 * managed by other Amazon Web Services services.
 *
 * For information about creating a secret in the console, see Create a
 * secret.
 *
 * To create a secret, you can provide the secret value to be encrypted in either the
 * `SecretString` parameter or the `SecretBinary` parameter, but
 * not both. If you include `SecretString` or `SecretBinary` then
 * Secrets Manager creates an initial secret version and automatically attaches the staging label
 * `AWSCURRENT` to it.
 *
 * For database credentials you want to rotate, for Secrets Manager to be able to rotate the
 * secret, you must make sure the JSON you store in the `SecretString` matches
 * the JSON
 * structure of a database secret.
 *
 * If you don't specify an KMS encryption key, Secrets Manager uses the Amazon Web Services managed key
 * `aws/secretsmanager`. If this key doesn't already exist in your account,
 * then Secrets Manager creates it for you automatically. All users and roles in the Amazon Web Services account
 * automatically have access to use `aws/secretsmanager`. Creating
 * `aws/secretsmanager` can result in a one-time significant delay in
 * returning the result.
 *
 * If the secret is in a different Amazon Web Services account from the credentials calling the API,
 * then you can't use `aws/secretsmanager` to encrypt the secret, and you must
 * create and use a customer managed KMS key.
 *
 * Secrets Manager generates a CloudTrail log entry when you call this action.
 * Do not include sensitive information in request parameters except
 * `SecretBinary` or `SecretString` because it might be logged.
 * For more information, see Logging Secrets Manager events with CloudTrail.
 *
 * Required permissions:
 *
 * `secretsmanager:CreateSecret`. If you include tags in the
 * secret, you also need `secretsmanager:TagResource`. To add replica Regions,
 * you must also have `secretsmanager:ReplicateSecretToRegions`.
 * For more information, see
 * IAM policy actions for Secrets Manager and Authentication
 * and access control in Secrets Manager.
 *
 * To encrypt the secret with a KMS key other than `aws/secretsmanager`, you
 * need `kms:GenerateDataKey` and `kms:Decrypt` permission to the
 * key.
 *
 * When you enter commands in a command shell, there is a risk of the command history being accessed or utilities having access to your command parameters. This is a concern if the command includes the value of a secret. Learn how to Mitigate the risks of using command-line tools to store Secrets Manager secrets.
 */
export const createSecret: (
  input: CreateSecretRequest,
) => effect.Effect<
  CreateSecretResponse,
  | DecryptionFailure
  | EncryptionFailure
  | InternalServiceError
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | MalformedPolicyDocumentException
  | PreconditionNotMetException
  | ResourceExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecretRequest,
  output: CreateSecretResponse,
  errors: [
    DecryptionFailure,
    EncryptionFailure,
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
    MalformedPolicyDocumentException,
    PreconditionNotMetException,
    ResourceExistsException,
    ResourceNotFoundException,
  ],
}));

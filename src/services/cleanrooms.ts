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
  sdkId: "CleanRooms",
  serviceShapeName: "AWSBastionControlPlaneServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "cleanrooms" });
const ver = T.ServiceVersion("2022-02-17");
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
              `https://cleanrooms-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cleanrooms-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cleanrooms.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cleanrooms.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CleanroomsArn = string;
export type TagKey = string;
export type ResourceDescription = string;
export type MembershipIdentifier = string;
export type TableAlias = string;
export type AnalysisTemplateIdentifier = string;
export type PaginationToken = string;
export type MaxResults = number;
export type CollaborationName = string;
export type CollaborationDescription = string;
export type DisplayName = string;
export type CollaborationIdentifier = string;
export type FilterableMemberStatus = string;
export type AnalysisTemplateArn = string;
export type AccountId = string;
export type CollaborationChangeRequestIdentifier = string;
export type ConfiguredAudienceModelAssociationIdentifier = string;
export type IdNamespaceAssociationIdentifier = string;
export type PrivacyBudgetTemplateIdentifier = string;
export type BudgetedResourceArn = string;
export type ConfiguredAudienceModelArn = string;
export type ConfiguredAudienceModelAssociationName = string;
export type TableDescription = string;
export type ConfiguredTableIdentifier = string;
export type RoleArn = string;
export type ConfiguredTableAssociationIdentifier = string;
export type ColumnName = string;
export type ResourceAlias = string;
export type KMSKeyArn = string;
export type UUID = string;
export type GenericResourceName = string;
export type MembershipStatus = string;
export type ProtectedJobIdentifier = string;
export type ProtectedQueryIdentifier = string;
export type ProtectedQueryStatus = string;
export type ProtectedQueryType = string;
export type TargetProtectedQueryStatus = string;
export type TagValue = string;
export type AnalysisTemplateText = string | redacted.Redacted<string>;
export type ParameterName = string;
export type ParameterValue = string;
export type IdMappingTableInputReferenceArn = string;
export type IdNamespaceAssociationInputReferenceArn = string;
export type ResourceType = string;
export type AccessDeniedExceptionReason = string;
export type MaxMembershipInferenceAttackScore = number;
export type GlueTableName = string;
export type GlueDatabaseName = string;
export type SecretsManagerArn = string;
export type SnowflakeAccountIdentifier = string;
export type SnowflakeDatabaseName = string;
export type SnowflakeTableName = string;
export type SnowflakeSchemaName = string;
export type AthenaWorkGroup = string;
export type AthenaOutputLocation = string;
export type AthenaDatabaseName = string;
export type AthenaTableName = string;
export type Epsilon = number;
export type UsersNoisePerQuery = number;
export type CollaborationArn = string;
export type MembershipArn = string;
export type MemberStatus = string;
export type SchemaResourceArn = string;
export type ConfiguredAudienceModelAssociationArn = string;
export type IdNamespaceAssociationArn = string;
export type PrivacyBudgetTemplateArn = string;
export type ConfiguredTableAssociationArn = string;
export type ConfiguredTableArn = string;
export type IdMappingTableArn = string;
export type AdditionalAnalysesResourceArn = string;
export type AnalysisRuleColumnName = string;
export type JoinOperator = string;
export type JoinRequiredOption = string;
export type ScalarFunctions = string;
export type AnalysisTemplateArnOrQueryWildcard = string;
export type ResultFormat = string;
export type KeyPrefix = string;
export type Budget = number;
export type ValidationExceptionReason = string;
export type ConflictExceptionReason = string;
export type ColumnTypeString = string;
export type SyntheticDataColumnName = string;
export type AggregateFunctionName = string;
export type AggregationType = string;
export type SparkPropertyKey = string;
export type SparkPropertyValue = string;
export type RemainingBudget = number;
export type DifferentialPrivacyAggregationExpression = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type AnalysisFormat = "SQL" | "PYSPARK_1_0" | (string & {});
export const AnalysisFormat = S.String;
export type MemberAbility =
  | "CAN_QUERY"
  | "CAN_RECEIVE_RESULTS"
  | "CAN_RUN_JOB"
  | (string & {});
export const MemberAbility = S.String;
export type MemberAbilities = MemberAbility[];
export const MemberAbilities = S.Array(MemberAbility);
export type CollaborationQueryLogStatus =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const CollaborationQueryLogStatus = S.String;
export type CollaborationJobLogStatus = "ENABLED" | "DISABLED" | (string & {});
export const CollaborationJobLogStatus = S.String;
export type AnalyticsEngine = "SPARK" | "CLEAN_ROOMS_SQL" | (string & {});
export const AnalyticsEngine = S.String;
export type AutoApprovedChangeType =
  | "ADD_MEMBER"
  | "GRANT_RECEIVE_RESULTS_ABILITY"
  | "REVOKE_RECEIVE_RESULTS_ABILITY"
  | (string & {});
export const AutoApprovedChangeType = S.String;
export type AutoApprovedChangeTypeList = AutoApprovedChangeType[];
export const AutoApprovedChangeTypeList = S.Array(AutoApprovedChangeType);
export type SupportedS3Region =
  | "us-west-1"
  | "us-west-2"
  | "us-east-1"
  | "us-east-2"
  | "af-south-1"
  | "ap-east-1"
  | "ap-east-2"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-southeast-5"
  | "ap-southeast-4"
  | "ap-southeast-7"
  | "ap-south-1"
  | "ap-northeast-3"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ca-central-1"
  | "ca-west-1"
  | "eu-south-1"
  | "eu-west-3"
  | "eu-south-2"
  | "eu-central-2"
  | "eu-central-1"
  | "eu-north-1"
  | "eu-west-1"
  | "eu-west-2"
  | "me-south-1"
  | "me-central-1"
  | "il-central-1"
  | "sa-east-1"
  | "mx-central-1"
  | (string & {});
export const SupportedS3Region = S.String;
export type AllowedResultRegions = SupportedS3Region[];
export const AllowedResultRegions = S.Array(SupportedS3Region);
export type AnalysisTemplateArnList = string[];
export const AnalysisTemplateArnList = S.Array(S.String);
export type TableAliasList = string[];
export const TableAliasList = S.Array(S.String);
export type AnalysisRuleType =
  | "AGGREGATION"
  | "LIST"
  | "CUSTOM"
  | "ID_MAPPING_TABLE"
  | (string & {});
export const AnalysisRuleType = S.String;
export type ChangeRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "CANCELLED"
  | "DENIED"
  | "COMMITTED"
  | (string & {});
export const ChangeRequestStatus = S.String;
export type PrivacyBudgetType =
  | "DIFFERENTIAL_PRIVACY"
  | "ACCESS_BUDGET"
  | (string & {});
export const PrivacyBudgetType = S.String;
export type SchemaType = "TABLE" | "ID_MAPPING_TABLE" | (string & {});
export const SchemaType = S.String;
export type ChangeRequestAction =
  | "APPROVE"
  | "DENY"
  | "CANCEL"
  | "COMMIT"
  | (string & {});
export const ChangeRequestAction = S.String;
export type ConfiguredTableAssociationAnalysisRuleType =
  | "AGGREGATION"
  | "LIST"
  | "CUSTOM"
  | (string & {});
export const ConfiguredTableAssociationAnalysisRuleType = S.String;
export type AllowedColumnList = string[];
export const AllowedColumnList = S.Array(S.String);
export type AnalysisMethod =
  | "DIRECT_QUERY"
  | "DIRECT_JOB"
  | "MULTIPLE"
  | (string & {});
export const AnalysisMethod = S.String;
export type SelectedAnalysisMethod =
  | "DIRECT_QUERY"
  | "DIRECT_JOB"
  | (string & {});
export const SelectedAnalysisMethod = S.String;
export type SelectedAnalysisMethods = SelectedAnalysisMethod[];
export const SelectedAnalysisMethods = S.Array(SelectedAnalysisMethod);
export type ConfiguredTableAnalysisRuleType =
  | "AGGREGATION"
  | "LIST"
  | "CUSTOM"
  | (string & {});
export const ConfiguredTableAnalysisRuleType = S.String;
export type JobType = "BATCH" | "INCREMENTAL" | "DELETE_ONLY" | (string & {});
export const JobType = S.String;
export type MembershipQueryLogStatus = "ENABLED" | "DISABLED" | (string & {});
export const MembershipQueryLogStatus = S.String;
export type MembershipJobLogStatus = "ENABLED" | "DISABLED" | (string & {});
export const MembershipJobLogStatus = S.String;
export type ProtectedJobStatus =
  | "SUBMITTED"
  | "STARTED"
  | "CANCELLED"
  | "CANCELLING"
  | "FAILED"
  | "SUCCESS"
  | (string & {});
export const ProtectedJobStatus = S.String;
export type ProtectedJobType = "PYSPARK" | (string & {});
export const ProtectedJobType = S.String;
export type TargetProtectedJobStatus = "CANCELLED" | (string & {});
export const TargetProtectedJobStatus = S.String;
export type PrivacyBudgetTemplateAutoRefresh =
  | "CALENDAR_MONTH"
  | "NONE"
  | (string & {});
export const PrivacyBudgetTemplateAutoRefresh = S.String;
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetAnalysisTemplateInput {
  membershipIdentifier: string;
  analysisTemplateIdentifier: string;
}
export const GetAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAnalysisTemplateInput",
}) as any as S.Schema<GetAnalysisTemplateInput>;
export interface UpdateAnalysisTemplateInput {
  membershipIdentifier: string;
  analysisTemplateIdentifier: string;
  description?: string;
}
export const UpdateAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAnalysisTemplateInput",
}) as any as S.Schema<UpdateAnalysisTemplateInput>;
export interface DeleteAnalysisTemplateInput {
  membershipIdentifier: string;
  analysisTemplateIdentifier: string;
}
export const DeleteAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    analysisTemplateIdentifier: S.String.pipe(
      T.HttpLabel("analysisTemplateIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/analysistemplates/{analysisTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAnalysisTemplateInput",
}) as any as S.Schema<DeleteAnalysisTemplateInput>;
export interface DeleteAnalysisTemplateOutput {}
export const DeleteAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAnalysisTemplateOutput",
}) as any as S.Schema<DeleteAnalysisTemplateOutput>;
export interface ListAnalysisTemplatesInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAnalysisTemplatesInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/analysistemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnalysisTemplatesInput",
}) as any as S.Schema<ListAnalysisTemplatesInput>;
export interface GetCollaborationInput {
  collaborationIdentifier: string;
}
export const GetCollaborationInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationInput",
}) as any as S.Schema<GetCollaborationInput>;
export interface UpdateCollaborationInput {
  collaborationIdentifier: string;
  name?: string;
  description?: string;
  analyticsEngine?: AnalyticsEngine;
}
export const UpdateCollaborationInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.optional(S.String),
    description: S.optional(S.String),
    analyticsEngine: S.optional(AnalyticsEngine),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/collaborations/{collaborationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCollaborationInput",
}) as any as S.Schema<UpdateCollaborationInput>;
export interface DeleteCollaborationInput {
  collaborationIdentifier: string;
}
export const DeleteCollaborationInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/collaborations/{collaborationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCollaborationInput",
}) as any as S.Schema<DeleteCollaborationInput>;
export interface DeleteCollaborationOutput {}
export const DeleteCollaborationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCollaborationOutput",
}) as any as S.Schema<DeleteCollaborationOutput>;
export interface ListCollaborationsInput {
  nextToken?: string;
  maxResults?: number;
  memberStatus?: string;
}
export const ListCollaborationsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    memberStatus: S.optional(S.String).pipe(T.HttpQuery("memberStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/collaborations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationsInput",
}) as any as S.Schema<ListCollaborationsInput>;
export interface BatchGetCollaborationAnalysisTemplateInput {
  collaborationIdentifier: string;
  analysisTemplateArns: string[];
}
export const BatchGetCollaborationAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    analysisTemplateArns: AnalysisTemplateArnList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/collaborations/{collaborationIdentifier}/batch-analysistemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetCollaborationAnalysisTemplateInput",
}) as any as S.Schema<BatchGetCollaborationAnalysisTemplateInput>;
export interface BatchGetSchemaInput {
  collaborationIdentifier: string;
  names: string[];
}
export const BatchGetSchemaInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    names: TableAliasList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/collaborations/{collaborationIdentifier}/batch-schema",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetSchemaInput",
}) as any as S.Schema<BatchGetSchemaInput>;
export interface DeleteMemberInput {
  collaborationIdentifier: string;
  accountId: string;
}
export const DeleteMemberInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/collaborations/{collaborationIdentifier}/member/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMemberInput",
}) as any as S.Schema<DeleteMemberInput>;
export interface DeleteMemberOutput {}
export const DeleteMemberOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMemberOutput",
}) as any as S.Schema<DeleteMemberOutput>;
export interface GetCollaborationAnalysisTemplateInput {
  collaborationIdentifier: string;
  analysisTemplateArn: string;
}
export const GetCollaborationAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    analysisTemplateArn: S.String.pipe(T.HttpLabel("analysisTemplateArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/analysistemplates/{analysisTemplateArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationAnalysisTemplateInput",
}) as any as S.Schema<GetCollaborationAnalysisTemplateInput>;
export interface GetCollaborationChangeRequestInput {
  collaborationIdentifier: string;
  changeRequestIdentifier: string;
}
export const GetCollaborationChangeRequestInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changeRequestIdentifier: S.String.pipe(
      T.HttpLabel("changeRequestIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/changeRequests/{changeRequestIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationChangeRequestInput",
}) as any as S.Schema<GetCollaborationChangeRequestInput>;
export interface GetCollaborationConfiguredAudienceModelAssociationInput {
  collaborationIdentifier: string;
  configuredAudienceModelAssociationIdentifier: string;
}
export const GetCollaborationConfiguredAudienceModelAssociationInput =
  S.suspend(() =>
    S.Struct({
      collaborationIdentifier: S.String.pipe(
        T.HttpLabel("collaborationIdentifier"),
      ),
      configuredAudienceModelAssociationIdentifier: S.String.pipe(
        T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
      ),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/collaborations/{collaborationIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "GetCollaborationConfiguredAudienceModelAssociationInput",
  }) as any as S.Schema<GetCollaborationConfiguredAudienceModelAssociationInput>;
export interface GetCollaborationIdNamespaceAssociationInput {
  collaborationIdentifier: string;
  idNamespaceAssociationIdentifier: string;
}
export const GetCollaborationIdNamespaceAssociationInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationIdNamespaceAssociationInput",
}) as any as S.Schema<GetCollaborationIdNamespaceAssociationInput>;
export interface GetCollaborationPrivacyBudgetTemplateInput {
  collaborationIdentifier: string;
  privacyBudgetTemplateIdentifier: string;
}
export const GetCollaborationPrivacyBudgetTemplateInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationPrivacyBudgetTemplateInput",
}) as any as S.Schema<GetCollaborationPrivacyBudgetTemplateInput>;
export interface GetSchemaInput {
  collaborationIdentifier: string;
  name: string;
}
export const GetSchemaInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.String.pipe(T.HttpLabel("name")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/schemas/{name}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSchemaInput",
}) as any as S.Schema<GetSchemaInput>;
export interface GetSchemaAnalysisRuleInput {
  collaborationIdentifier: string;
  name: string;
  type: AnalysisRuleType;
}
export const GetSchemaAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    name: S.String.pipe(T.HttpLabel("name")),
    type: AnalysisRuleType.pipe(T.HttpLabel("type")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/schemas/{name}/analysisRule/{type}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSchemaAnalysisRuleInput",
}) as any as S.Schema<GetSchemaAnalysisRuleInput>;
export interface ListCollaborationAnalysisTemplatesInput {
  collaborationIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollaborationAnalysisTemplatesInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/analysistemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationAnalysisTemplatesInput",
}) as any as S.Schema<ListCollaborationAnalysisTemplatesInput>;
export interface ListCollaborationChangeRequestsInput {
  collaborationIdentifier: string;
  status?: ChangeRequestStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollaborationChangeRequestsInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    status: S.optional(ChangeRequestStatus).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/changeRequests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationChangeRequestsInput",
}) as any as S.Schema<ListCollaborationChangeRequestsInput>;
export interface ListCollaborationConfiguredAudienceModelAssociationsInput {
  collaborationIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollaborationConfiguredAudienceModelAssociationsInput =
  S.suspend(() =>
    S.Struct({
      collaborationIdentifier: S.String.pipe(
        T.HttpLabel("collaborationIdentifier"),
      ),
      nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
      maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/collaborations/{collaborationIdentifier}/configuredaudiencemodelassociations",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "ListCollaborationConfiguredAudienceModelAssociationsInput",
  }) as any as S.Schema<ListCollaborationConfiguredAudienceModelAssociationsInput>;
export interface ListCollaborationIdNamespaceAssociationsInput {
  collaborationIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollaborationIdNamespaceAssociationsInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/idnamespaceassociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationIdNamespaceAssociationsInput",
}) as any as S.Schema<ListCollaborationIdNamespaceAssociationsInput>;
export interface ListCollaborationPrivacyBudgetsInput {
  collaborationIdentifier: string;
  privacyBudgetType: PrivacyBudgetType;
  maxResults?: number;
  nextToken?: string;
  accessBudgetResourceArn?: string;
}
export const ListCollaborationPrivacyBudgetsInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    privacyBudgetType: PrivacyBudgetType.pipe(T.HttpQuery("privacyBudgetType")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    accessBudgetResourceArn: S.optional(S.String).pipe(
      T.HttpQuery("accessBudgetResourceArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/privacybudgets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationPrivacyBudgetsInput",
}) as any as S.Schema<ListCollaborationPrivacyBudgetsInput>;
export interface ListCollaborationPrivacyBudgetTemplatesInput {
  collaborationIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCollaborationPrivacyBudgetTemplatesInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/privacybudgettemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationPrivacyBudgetTemplatesInput",
}) as any as S.Schema<ListCollaborationPrivacyBudgetTemplatesInput>;
export interface ListMembersInput {
  collaborationIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMembersInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/members",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembersInput",
}) as any as S.Schema<ListMembersInput>;
export interface ListSchemasInput {
  collaborationIdentifier: string;
  schemaType?: SchemaType;
  nextToken?: string;
  maxResults?: number;
}
export const ListSchemasInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    schemaType: S.optional(SchemaType).pipe(T.HttpQuery("schemaType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/schemas",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchemasInput",
}) as any as S.Schema<ListSchemasInput>;
export interface UpdateCollaborationChangeRequestInput {
  collaborationIdentifier: string;
  changeRequestIdentifier: string;
  action: ChangeRequestAction;
}
export const UpdateCollaborationChangeRequestInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changeRequestIdentifier: S.String.pipe(
      T.HttpLabel("changeRequestIdentifier"),
    ),
    action: ChangeRequestAction,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/collaborations/{collaborationIdentifier}/changeRequests/{changeRequestIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCollaborationChangeRequestInput",
}) as any as S.Schema<UpdateCollaborationChangeRequestInput>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateConfiguredAudienceModelAssociationInput {
  membershipIdentifier: string;
  configuredAudienceModelArn: string;
  configuredAudienceModelAssociationName: string;
  manageResourcePolicies: boolean;
  tags?: { [key: string]: string | undefined };
  description?: string;
}
export const CreateConfiguredAudienceModelAssociationInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredAudienceModelArn: S.String,
    configuredAudienceModelAssociationName: S.String,
    manageResourcePolicies: S.Boolean,
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredAudienceModelAssociationInput",
}) as any as S.Schema<CreateConfiguredAudienceModelAssociationInput>;
export interface GetConfiguredAudienceModelAssociationInput {
  configuredAudienceModelAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const GetConfiguredAudienceModelAssociationInput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredAudienceModelAssociationInput",
}) as any as S.Schema<GetConfiguredAudienceModelAssociationInput>;
export interface UpdateConfiguredAudienceModelAssociationInput {
  configuredAudienceModelAssociationIdentifier: string;
  membershipIdentifier: string;
  description?: string;
  name?: string;
}
export const UpdateConfiguredAudienceModelAssociationInput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    name: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredAudienceModelAssociationInput",
}) as any as S.Schema<UpdateConfiguredAudienceModelAssociationInput>;
export interface DeleteConfiguredAudienceModelAssociationInput {
  configuredAudienceModelAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const DeleteConfiguredAudienceModelAssociationInput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredAudienceModelAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations/{configuredAudienceModelAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredAudienceModelAssociationInput",
}) as any as S.Schema<DeleteConfiguredAudienceModelAssociationInput>;
export interface DeleteConfiguredAudienceModelAssociationOutput {}
export const DeleteConfiguredAudienceModelAssociationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredAudienceModelAssociationOutput",
}) as any as S.Schema<DeleteConfiguredAudienceModelAssociationOutput>;
export interface ListConfiguredAudienceModelAssociationsInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListConfiguredAudienceModelAssociationsInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configuredaudiencemodelassociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredAudienceModelAssociationsInput",
}) as any as S.Schema<ListConfiguredAudienceModelAssociationsInput>;
export interface CreateConfiguredTableAssociationInput {
  name: string;
  description?: string;
  membershipIdentifier: string;
  configuredTableIdentifier: string;
  roleArn: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateConfiguredTableAssociationInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableIdentifier: S.String,
    roleArn: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredTableAssociationInput",
}) as any as S.Schema<CreateConfiguredTableAssociationInput>;
export interface GetConfiguredTableAssociationInput {
  configuredTableAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const GetConfiguredTableAssociationInput = S.suspend(() =>
  S.Struct({
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredTableAssociationInput",
}) as any as S.Schema<GetConfiguredTableAssociationInput>;
export interface UpdateConfiguredTableAssociationInput {
  configuredTableAssociationIdentifier: string;
  membershipIdentifier: string;
  description?: string;
  roleArn?: string;
}
export const UpdateConfiguredTableAssociationInput = S.suspend(() =>
  S.Struct({
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredTableAssociationInput",
}) as any as S.Schema<UpdateConfiguredTableAssociationInput>;
export interface DeleteConfiguredTableAssociationInput {
  configuredTableAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const DeleteConfiguredTableAssociationInput = S.suspend(() =>
  S.Struct({
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredTableAssociationInput",
}) as any as S.Schema<DeleteConfiguredTableAssociationInput>;
export interface DeleteConfiguredTableAssociationOutput {}
export const DeleteConfiguredTableAssociationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredTableAssociationOutput",
}) as any as S.Schema<DeleteConfiguredTableAssociationOutput>;
export interface ListConfiguredTableAssociationsInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListConfiguredTableAssociationsInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredTableAssociationsInput",
}) as any as S.Schema<ListConfiguredTableAssociationsInput>;
export interface DeleteConfiguredTableAssociationAnalysisRuleInput {
  membershipIdentifier: string;
  configuredTableAssociationIdentifier: string;
  analysisRuleType: ConfiguredTableAssociationAnalysisRuleType;
}
export const DeleteConfiguredTableAssociationAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAssociationAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredTableAssociationAnalysisRuleInput",
}) as any as S.Schema<DeleteConfiguredTableAssociationAnalysisRuleInput>;
export interface DeleteConfiguredTableAssociationAnalysisRuleOutput {}
export const DeleteConfiguredTableAssociationAnalysisRuleOutput = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredTableAssociationAnalysisRuleOutput",
}) as any as S.Schema<DeleteConfiguredTableAssociationAnalysisRuleOutput>;
export interface GetConfiguredTableAssociationAnalysisRuleInput {
  membershipIdentifier: string;
  configuredTableAssociationIdentifier: string;
  analysisRuleType: ConfiguredTableAssociationAnalysisRuleType;
}
export const GetConfiguredTableAssociationAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAssociationAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredTableAssociationAnalysisRuleInput",
}) as any as S.Schema<GetConfiguredTableAssociationAnalysisRuleInput>;
export type AllowedResultReceivers = string[];
export const AllowedResultReceivers = S.Array(S.String);
export type AllowedAdditionalAnalyses = string[];
export const AllowedAdditionalAnalyses = S.Array(S.String);
export interface ConfiguredTableAssociationAnalysisRuleList {
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConfiguredTableAssociationAnalysisRuleList = S.suspend(() =>
  S.Struct({
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConfiguredTableAssociationAnalysisRuleList",
}) as any as S.Schema<ConfiguredTableAssociationAnalysisRuleList>;
export interface ConfiguredTableAssociationAnalysisRuleAggregation {
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConfiguredTableAssociationAnalysisRuleAggregation = S.suspend(() =>
  S.Struct({
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConfiguredTableAssociationAnalysisRuleAggregation",
}) as any as S.Schema<ConfiguredTableAssociationAnalysisRuleAggregation>;
export interface ConfiguredTableAssociationAnalysisRuleCustom {
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConfiguredTableAssociationAnalysisRuleCustom = S.suspend(() =>
  S.Struct({
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConfiguredTableAssociationAnalysisRuleCustom",
}) as any as S.Schema<ConfiguredTableAssociationAnalysisRuleCustom>;
export type ConfiguredTableAssociationAnalysisRulePolicyV1 =
  | {
      list: ConfiguredTableAssociationAnalysisRuleList;
      aggregation?: never;
      custom?: never;
    }
  | {
      list?: never;
      aggregation: ConfiguredTableAssociationAnalysisRuleAggregation;
      custom?: never;
    }
  | {
      list?: never;
      aggregation?: never;
      custom: ConfiguredTableAssociationAnalysisRuleCustom;
    };
export const ConfiguredTableAssociationAnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: ConfiguredTableAssociationAnalysisRuleList }),
  S.Struct({ aggregation: ConfiguredTableAssociationAnalysisRuleAggregation }),
  S.Struct({ custom: ConfiguredTableAssociationAnalysisRuleCustom }),
);
export type ConfiguredTableAssociationAnalysisRulePolicy = {
  v1: ConfiguredTableAssociationAnalysisRulePolicyV1;
};
export const ConfiguredTableAssociationAnalysisRulePolicy = S.Union(
  S.Struct({ v1: ConfiguredTableAssociationAnalysisRulePolicyV1 }),
);
export interface UpdateConfiguredTableAssociationAnalysisRuleInput {
  membershipIdentifier: string;
  configuredTableAssociationIdentifier: string;
  analysisRuleType: ConfiguredTableAssociationAnalysisRuleType;
  analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy;
}
export const UpdateConfiguredTableAssociationAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAssociationAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
    analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredTableAssociationAnalysisRuleInput",
}) as any as S.Schema<UpdateConfiguredTableAssociationAnalysisRuleInput>;
export interface GetConfiguredTableInput {
  configuredTableIdentifier: string;
}
export const GetConfiguredTableInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/configuredTables/{configuredTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredTableInput",
}) as any as S.Schema<GetConfiguredTableInput>;
export type CommercialRegion =
  | "us-west-1"
  | "us-west-2"
  | "us-east-1"
  | "us-east-2"
  | "af-south-1"
  | "ap-east-1"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-southeast-5"
  | "ap-southeast-4"
  | "ap-southeast-7"
  | "ap-south-1"
  | "ap-northeast-3"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ca-central-1"
  | "ca-west-1"
  | "eu-south-1"
  | "eu-west-3"
  | "eu-south-2"
  | "eu-central-2"
  | "eu-central-1"
  | "eu-north-1"
  | "eu-west-1"
  | "eu-west-2"
  | "me-south-1"
  | "me-central-1"
  | "il-central-1"
  | "sa-east-1"
  | "mx-central-1"
  | "ap-east-2"
  | (string & {});
export const CommercialRegion = S.String;
export interface GlueTableReference {
  region?: CommercialRegion;
  tableName: string;
  databaseName: string;
}
export const GlueTableReference = S.suspend(() =>
  S.Struct({
    region: S.optional(CommercialRegion),
    tableName: S.String,
    databaseName: S.String,
  }),
).annotations({
  identifier: "GlueTableReference",
}) as any as S.Schema<GlueTableReference>;
export interface SnowflakeTableSchemaV1 {
  columnName: string;
  columnType: string;
}
export const SnowflakeTableSchemaV1 = S.suspend(() =>
  S.Struct({ columnName: S.String, columnType: S.String }),
).annotations({
  identifier: "SnowflakeTableSchemaV1",
}) as any as S.Schema<SnowflakeTableSchemaV1>;
export type SnowflakeTableSchemaList = SnowflakeTableSchemaV1[];
export const SnowflakeTableSchemaList = S.Array(SnowflakeTableSchemaV1);
export type SnowflakeTableSchema = { v1: SnowflakeTableSchemaV1[] };
export const SnowflakeTableSchema = S.Union(
  S.Struct({ v1: SnowflakeTableSchemaList }),
);
export interface SnowflakeTableReference {
  secretArn: string;
  accountIdentifier: string;
  databaseName: string;
  tableName: string;
  schemaName: string;
  tableSchema: SnowflakeTableSchema;
}
export const SnowflakeTableReference = S.suspend(() =>
  S.Struct({
    secretArn: S.String,
    accountIdentifier: S.String,
    databaseName: S.String,
    tableName: S.String,
    schemaName: S.String,
    tableSchema: SnowflakeTableSchema,
  }),
).annotations({
  identifier: "SnowflakeTableReference",
}) as any as S.Schema<SnowflakeTableReference>;
export interface AthenaTableReference {
  region?: CommercialRegion;
  workGroup: string;
  outputLocation?: string;
  databaseName: string;
  tableName: string;
}
export const AthenaTableReference = S.suspend(() =>
  S.Struct({
    region: S.optional(CommercialRegion),
    workGroup: S.String,
    outputLocation: S.optional(S.String),
    databaseName: S.String,
    tableName: S.String,
  }),
).annotations({
  identifier: "AthenaTableReference",
}) as any as S.Schema<AthenaTableReference>;
export type TableReference =
  | { glue: GlueTableReference; snowflake?: never; athena?: never }
  | { glue?: never; snowflake: SnowflakeTableReference; athena?: never }
  | { glue?: never; snowflake?: never; athena: AthenaTableReference };
export const TableReference = S.Union(
  S.Struct({ glue: GlueTableReference }),
  S.Struct({ snowflake: SnowflakeTableReference }),
  S.Struct({ athena: AthenaTableReference }),
);
export interface UpdateConfiguredTableInput {
  configuredTableIdentifier: string;
  name?: string;
  description?: string;
  tableReference?: TableReference;
  allowedColumns?: string[];
  analysisMethod?: AnalysisMethod;
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
}
export const UpdateConfiguredTableInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    name: S.optional(S.String),
    description: S.optional(S.String),
    tableReference: S.optional(TableReference),
    allowedColumns: S.optional(AllowedColumnList),
    analysisMethod: S.optional(AnalysisMethod),
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/configuredTables/{configuredTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredTableInput",
}) as any as S.Schema<UpdateConfiguredTableInput>;
export interface DeleteConfiguredTableInput {
  configuredTableIdentifier: string;
}
export const DeleteConfiguredTableInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/configuredTables/{configuredTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredTableInput",
}) as any as S.Schema<DeleteConfiguredTableInput>;
export interface DeleteConfiguredTableOutput {}
export const DeleteConfiguredTableOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredTableOutput",
}) as any as S.Schema<DeleteConfiguredTableOutput>;
export interface ListConfiguredTablesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListConfiguredTablesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configuredTables" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredTablesInput",
}) as any as S.Schema<ListConfiguredTablesInput>;
export interface DeleteConfiguredTableAnalysisRuleInput {
  configuredTableIdentifier: string;
  analysisRuleType: ConfiguredTableAnalysisRuleType;
}
export const DeleteConfiguredTableAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredTableAnalysisRuleInput",
}) as any as S.Schema<DeleteConfiguredTableAnalysisRuleInput>;
export interface DeleteConfiguredTableAnalysisRuleOutput {}
export const DeleteConfiguredTableAnalysisRuleOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredTableAnalysisRuleOutput",
}) as any as S.Schema<DeleteConfiguredTableAnalysisRuleOutput>;
export interface GetConfiguredTableAnalysisRuleInput {
  configuredTableIdentifier: string;
  analysisRuleType: ConfiguredTableAnalysisRuleType;
}
export const GetConfiguredTableAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredTableAnalysisRuleInput",
}) as any as S.Schema<GetConfiguredTableAnalysisRuleInput>;
export type AnalysisRuleColumnList = string[];
export const AnalysisRuleColumnList = S.Array(S.String);
export type JoinOperatorsList = string[];
export const JoinOperatorsList = S.Array(S.String);
export type AdditionalAnalyses =
  | "ALLOWED"
  | "REQUIRED"
  | "NOT_ALLOWED"
  | (string & {});
export const AdditionalAnalyses = S.String;
export interface AnalysisRuleList {
  joinColumns: string[];
  allowedJoinOperators?: string[];
  listColumns: string[];
  additionalAnalyses?: AdditionalAnalyses;
}
export const AnalysisRuleList = S.suspend(() =>
  S.Struct({
    joinColumns: AnalysisRuleColumnList,
    allowedJoinOperators: S.optional(JoinOperatorsList),
    listColumns: AnalysisRuleColumnList,
    additionalAnalyses: S.optional(AdditionalAnalyses),
  }),
).annotations({
  identifier: "AnalysisRuleList",
}) as any as S.Schema<AnalysisRuleList>;
export type AnalysisRuleColumnNameList = string[];
export const AnalysisRuleColumnNameList = S.Array(S.String);
export interface AggregateColumn {
  columnNames: string[];
  function: string;
}
export const AggregateColumn = S.suspend(() =>
  S.Struct({ columnNames: AnalysisRuleColumnNameList, function: S.String }),
).annotations({
  identifier: "AggregateColumn",
}) as any as S.Schema<AggregateColumn>;
export type AggregateColumnList = AggregateColumn[];
export const AggregateColumnList = S.Array(AggregateColumn);
export type ScalarFunctionsList = string[];
export const ScalarFunctionsList = S.Array(S.String);
export interface AggregationConstraint {
  columnName: string;
  minimum: number;
  type: string;
}
export const AggregationConstraint = S.suspend(() =>
  S.Struct({ columnName: S.String, minimum: S.Number, type: S.String }),
).annotations({
  identifier: "AggregationConstraint",
}) as any as S.Schema<AggregationConstraint>;
export type AggregationConstraints = AggregationConstraint[];
export const AggregationConstraints = S.Array(AggregationConstraint);
export interface AnalysisRuleAggregation {
  aggregateColumns: AggregateColumn[];
  joinColumns: string[];
  joinRequired?: string;
  allowedJoinOperators?: string[];
  dimensionColumns: string[];
  scalarFunctions: string[];
  outputConstraints: AggregationConstraint[];
  additionalAnalyses?: AdditionalAnalyses;
}
export const AnalysisRuleAggregation = S.suspend(() =>
  S.Struct({
    aggregateColumns: AggregateColumnList,
    joinColumns: AnalysisRuleColumnList,
    joinRequired: S.optional(S.String),
    allowedJoinOperators: S.optional(JoinOperatorsList),
    dimensionColumns: AnalysisRuleColumnList,
    scalarFunctions: ScalarFunctionsList,
    outputConstraints: AggregationConstraints,
    additionalAnalyses: S.optional(AdditionalAnalyses),
  }),
).annotations({
  identifier: "AnalysisRuleAggregation",
}) as any as S.Schema<AnalysisRuleAggregation>;
export type AllowedAnalysesList = string[];
export const AllowedAnalysesList = S.Array(S.String);
export type AllowedAnalysisProviderList = string[];
export const AllowedAnalysisProviderList = S.Array(S.String);
export interface DifferentialPrivacyColumn {
  name: string;
}
export const DifferentialPrivacyColumn = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "DifferentialPrivacyColumn",
}) as any as S.Schema<DifferentialPrivacyColumn>;
export type DifferentialPrivacyColumnList = DifferentialPrivacyColumn[];
export const DifferentialPrivacyColumnList = S.Array(DifferentialPrivacyColumn);
export interface DifferentialPrivacyConfiguration {
  columns: DifferentialPrivacyColumn[];
}
export const DifferentialPrivacyConfiguration = S.suspend(() =>
  S.Struct({ columns: DifferentialPrivacyColumnList }),
).annotations({
  identifier: "DifferentialPrivacyConfiguration",
}) as any as S.Schema<DifferentialPrivacyConfiguration>;
export interface AnalysisRuleCustom {
  allowedAnalyses: string[];
  allowedAnalysisProviders?: string[];
  additionalAnalyses?: AdditionalAnalyses;
  disallowedOutputColumns?: string[];
  differentialPrivacy?: DifferentialPrivacyConfiguration;
}
export const AnalysisRuleCustom = S.suspend(() =>
  S.Struct({
    allowedAnalyses: AllowedAnalysesList,
    allowedAnalysisProviders: S.optional(AllowedAnalysisProviderList),
    additionalAnalyses: S.optional(AdditionalAnalyses),
    disallowedOutputColumns: S.optional(AnalysisRuleColumnList),
    differentialPrivacy: S.optional(DifferentialPrivacyConfiguration),
  }),
).annotations({
  identifier: "AnalysisRuleCustom",
}) as any as S.Schema<AnalysisRuleCustom>;
export type ConfiguredTableAnalysisRulePolicyV1 =
  | { list: AnalysisRuleList; aggregation?: never; custom?: never }
  | { list?: never; aggregation: AnalysisRuleAggregation; custom?: never }
  | { list?: never; aggregation?: never; custom: AnalysisRuleCustom };
export const ConfiguredTableAnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: AnalysisRuleList }),
  S.Struct({ aggregation: AnalysisRuleAggregation }),
  S.Struct({ custom: AnalysisRuleCustom }),
);
export type ConfiguredTableAnalysisRulePolicy = {
  v1: ConfiguredTableAnalysisRulePolicyV1;
};
export const ConfiguredTableAnalysisRulePolicy = S.Union(
  S.Struct({ v1: ConfiguredTableAnalysisRulePolicyV1 }),
);
export interface UpdateConfiguredTableAnalysisRuleInput {
  configuredTableIdentifier: string;
  analysisRuleType: ConfiguredTableAnalysisRuleType;
  analysisRulePolicy: ConfiguredTableAnalysisRulePolicy;
}
export const UpdateConfiguredTableAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAnalysisRuleType.pipe(
      T.HttpLabel("analysisRuleType"),
    ),
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/configuredTables/{configuredTableIdentifier}/analysisRule/{analysisRuleType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredTableAnalysisRuleInput",
}) as any as S.Schema<UpdateConfiguredTableAnalysisRuleInput>;
export interface GetIdMappingTableInput {
  idMappingTableIdentifier: string;
  membershipIdentifier: string;
}
export const GetIdMappingTableInput = S.suspend(() =>
  S.Struct({
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdMappingTableInput",
}) as any as S.Schema<GetIdMappingTableInput>;
export interface UpdateIdMappingTableInput {
  idMappingTableIdentifier: string;
  membershipIdentifier: string;
  description?: string;
  kmsKeyArn?: string;
}
export const UpdateIdMappingTableInput = S.suspend(() =>
  S.Struct({
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIdMappingTableInput",
}) as any as S.Schema<UpdateIdMappingTableInput>;
export interface DeleteIdMappingTableInput {
  idMappingTableIdentifier: string;
  membershipIdentifier: string;
}
export const DeleteIdMappingTableInput = S.suspend(() =>
  S.Struct({
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdMappingTableInput",
}) as any as S.Schema<DeleteIdMappingTableInput>;
export interface DeleteIdMappingTableOutput {}
export const DeleteIdMappingTableOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdMappingTableOutput",
}) as any as S.Schema<DeleteIdMappingTableOutput>;
export interface ListIdMappingTablesInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListIdMappingTablesInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/idmappingtables",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdMappingTablesInput",
}) as any as S.Schema<ListIdMappingTablesInput>;
export interface PopulateIdMappingTableInput {
  idMappingTableIdentifier: string;
  membershipIdentifier: string;
  jobType?: JobType;
}
export const PopulateIdMappingTableInput = S.suspend(() =>
  S.Struct({
    idMappingTableIdentifier: S.String.pipe(
      T.HttpLabel("idMappingTableIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    jobType: S.optional(JobType),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/idmappingtables/{idMappingTableIdentifier}/populate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PopulateIdMappingTableInput",
}) as any as S.Schema<PopulateIdMappingTableInput>;
export interface GetIdNamespaceAssociationInput {
  idNamespaceAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const GetIdNamespaceAssociationInput = S.suspend(() =>
  S.Struct({
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdNamespaceAssociationInput",
}) as any as S.Schema<GetIdNamespaceAssociationInput>;
export interface IdMappingConfig {
  allowUseAsDimensionColumn: boolean;
}
export const IdMappingConfig = S.suspend(() =>
  S.Struct({ allowUseAsDimensionColumn: S.Boolean }),
).annotations({
  identifier: "IdMappingConfig",
}) as any as S.Schema<IdMappingConfig>;
export interface UpdateIdNamespaceAssociationInput {
  idNamespaceAssociationIdentifier: string;
  membershipIdentifier: string;
  name?: string;
  description?: string;
  idMappingConfig?: IdMappingConfig;
}
export const UpdateIdNamespaceAssociationInput = S.suspend(() =>
  S.Struct({
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    idMappingConfig: S.optional(IdMappingConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIdNamespaceAssociationInput",
}) as any as S.Schema<UpdateIdNamespaceAssociationInput>;
export interface DeleteIdNamespaceAssociationInput {
  idNamespaceAssociationIdentifier: string;
  membershipIdentifier: string;
}
export const DeleteIdNamespaceAssociationInput = S.suspend(() =>
  S.Struct({
    idNamespaceAssociationIdentifier: S.String.pipe(
      T.HttpLabel("idNamespaceAssociationIdentifier"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/idnamespaceassociations/{idNamespaceAssociationIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdNamespaceAssociationInput",
}) as any as S.Schema<DeleteIdNamespaceAssociationInput>;
export interface DeleteIdNamespaceAssociationOutput {}
export const DeleteIdNamespaceAssociationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdNamespaceAssociationOutput",
}) as any as S.Schema<DeleteIdNamespaceAssociationOutput>;
export interface ListIdNamespaceAssociationsInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListIdNamespaceAssociationsInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/idnamespaceassociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdNamespaceAssociationsInput",
}) as any as S.Schema<ListIdNamespaceAssociationsInput>;
export interface GetMembershipInput {
  membershipIdentifier: string;
}
export const GetMembershipInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/memberships/{membershipIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMembershipInput",
}) as any as S.Schema<GetMembershipInput>;
export interface ProtectedQueryS3OutputConfiguration {
  resultFormat: string;
  bucket: string;
  keyPrefix?: string;
  singleFileOutput?: boolean;
}
export const ProtectedQueryS3OutputConfiguration = S.suspend(() =>
  S.Struct({
    resultFormat: S.String,
    bucket: S.String,
    keyPrefix: S.optional(S.String),
    singleFileOutput: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ProtectedQueryS3OutputConfiguration",
}) as any as S.Schema<ProtectedQueryS3OutputConfiguration>;
export type MembershipProtectedQueryOutputConfiguration = {
  s3: ProtectedQueryS3OutputConfiguration;
};
export const MembershipProtectedQueryOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
);
export interface MembershipProtectedQueryResultConfiguration {
  outputConfiguration: MembershipProtectedQueryOutputConfiguration;
  roleArn?: string;
}
export const MembershipProtectedQueryResultConfiguration = S.suspend(() =>
  S.Struct({
    outputConfiguration: MembershipProtectedQueryOutputConfiguration,
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MembershipProtectedQueryResultConfiguration",
}) as any as S.Schema<MembershipProtectedQueryResultConfiguration>;
export interface ProtectedJobS3OutputConfigurationInput {
  bucket: string;
  keyPrefix?: string;
}
export const ProtectedJobS3OutputConfigurationInput = S.suspend(() =>
  S.Struct({ bucket: S.String, keyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "ProtectedJobS3OutputConfigurationInput",
}) as any as S.Schema<ProtectedJobS3OutputConfigurationInput>;
export type MembershipProtectedJobOutputConfiguration = {
  s3: ProtectedJobS3OutputConfigurationInput;
};
export const MembershipProtectedJobOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedJobS3OutputConfigurationInput }),
);
export interface MembershipProtectedJobResultConfiguration {
  outputConfiguration: MembershipProtectedJobOutputConfiguration;
  roleArn: string;
}
export const MembershipProtectedJobResultConfiguration = S.suspend(() =>
  S.Struct({
    outputConfiguration: MembershipProtectedJobOutputConfiguration,
    roleArn: S.String,
  }),
).annotations({
  identifier: "MembershipProtectedJobResultConfiguration",
}) as any as S.Schema<MembershipProtectedJobResultConfiguration>;
export interface UpdateMembershipInput {
  membershipIdentifier: string;
  queryLogStatus?: MembershipQueryLogStatus;
  jobLogStatus?: MembershipJobLogStatus;
  defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  defaultJobResultConfiguration?: MembershipProtectedJobResultConfiguration;
}
export const UpdateMembershipInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    queryLogStatus: S.optional(MembershipQueryLogStatus),
    jobLogStatus: S.optional(MembershipJobLogStatus),
    defaultResultConfiguration: S.optional(
      MembershipProtectedQueryResultConfiguration,
    ),
    defaultJobResultConfiguration: S.optional(
      MembershipProtectedJobResultConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/memberships/{membershipIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMembershipInput",
}) as any as S.Schema<UpdateMembershipInput>;
export interface DeleteMembershipInput {
  membershipIdentifier: string;
}
export const DeleteMembershipInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/memberships/{membershipIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMembershipInput",
}) as any as S.Schema<DeleteMembershipInput>;
export interface DeleteMembershipOutput {}
export const DeleteMembershipOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteMembershipOutput" },
) as any as S.Schema<DeleteMembershipOutput>;
export interface ListMembershipsInput {
  nextToken?: string;
  maxResults?: number;
  status?: string;
}
export const ListMembershipsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/memberships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembershipsInput",
}) as any as S.Schema<ListMembershipsInput>;
export interface GetProtectedJobInput {
  membershipIdentifier: string;
  protectedJobIdentifier: string;
}
export const GetProtectedJobInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedJobIdentifier: S.String.pipe(
      T.HttpLabel("protectedJobIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/protectedJobs/{protectedJobIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProtectedJobInput",
}) as any as S.Schema<GetProtectedJobInput>;
export interface GetProtectedQueryInput {
  membershipIdentifier: string;
  protectedQueryIdentifier: string;
}
export const GetProtectedQueryInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedQueryIdentifier: S.String.pipe(
      T.HttpLabel("protectedQueryIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/protectedQueries/{protectedQueryIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProtectedQueryInput",
}) as any as S.Schema<GetProtectedQueryInput>;
export interface ListPrivacyBudgetsInput {
  membershipIdentifier: string;
  privacyBudgetType: PrivacyBudgetType;
  nextToken?: string;
  maxResults?: number;
  accessBudgetResourceArn?: string;
}
export const ListPrivacyBudgetsInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetType: PrivacyBudgetType.pipe(T.HttpQuery("privacyBudgetType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    accessBudgetResourceArn: S.optional(S.String).pipe(
      T.HttpQuery("accessBudgetResourceArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/privacybudgets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrivacyBudgetsInput",
}) as any as S.Schema<ListPrivacyBudgetsInput>;
export interface ListProtectedJobsInput {
  membershipIdentifier: string;
  status?: ProtectedJobStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListProtectedJobsInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    status: S.optional(ProtectedJobStatus).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/protectedJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProtectedJobsInput",
}) as any as S.Schema<ListProtectedJobsInput>;
export interface ListProtectedQueriesInput {
  membershipIdentifier: string;
  status?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListProtectedQueriesInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/protectedQueries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProtectedQueriesInput",
}) as any as S.Schema<ListProtectedQueriesInput>;
export interface UpdateProtectedJobInput {
  membershipIdentifier: string;
  protectedJobIdentifier: string;
  targetStatus: TargetProtectedJobStatus;
}
export const UpdateProtectedJobInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedJobIdentifier: S.String.pipe(
      T.HttpLabel("protectedJobIdentifier"),
    ),
    targetStatus: TargetProtectedJobStatus,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/protectedJobs/{protectedJobIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProtectedJobInput",
}) as any as S.Schema<UpdateProtectedJobInput>;
export interface UpdateProtectedQueryInput {
  membershipIdentifier: string;
  protectedQueryIdentifier: string;
  targetStatus: string;
}
export const UpdateProtectedQueryInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    protectedQueryIdentifier: S.String.pipe(
      T.HttpLabel("protectedQueryIdentifier"),
    ),
    targetStatus: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/protectedQueries/{protectedQueryIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProtectedQueryInput",
}) as any as S.Schema<UpdateProtectedQueryInput>;
export interface GetPrivacyBudgetTemplateInput {
  membershipIdentifier: string;
  privacyBudgetTemplateIdentifier: string;
}
export const GetPrivacyBudgetTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPrivacyBudgetTemplateInput",
}) as any as S.Schema<GetPrivacyBudgetTemplateInput>;
export interface DeletePrivacyBudgetTemplateInput {
  membershipIdentifier: string;
  privacyBudgetTemplateIdentifier: string;
}
export const DeletePrivacyBudgetTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePrivacyBudgetTemplateInput",
}) as any as S.Schema<DeletePrivacyBudgetTemplateInput>;
export interface DeletePrivacyBudgetTemplateOutput {}
export const DeletePrivacyBudgetTemplateOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePrivacyBudgetTemplateOutput",
}) as any as S.Schema<DeletePrivacyBudgetTemplateOutput>;
export interface ListPrivacyBudgetTemplatesInput {
  membershipIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPrivacyBudgetTemplatesInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/privacybudgettemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPrivacyBudgetTemplatesInput",
}) as any as S.Schema<ListPrivacyBudgetTemplatesInput>;
export type ParameterType =
  | "SMALLINT"
  | "INTEGER"
  | "BIGINT"
  | "DECIMAL"
  | "REAL"
  | "DOUBLE_PRECISION"
  | "BOOLEAN"
  | "CHAR"
  | "VARCHAR"
  | "DATE"
  | "TIMESTAMP"
  | "TIMESTAMPTZ"
  | "TIME"
  | "TIMETZ"
  | "VARBYTE"
  | "BINARY"
  | "BYTE"
  | "CHARACTER"
  | "DOUBLE"
  | "FLOAT"
  | "INT"
  | "LONG"
  | "NUMERIC"
  | "SHORT"
  | "STRING"
  | "TIMESTAMP_LTZ"
  | "TIMESTAMP_NTZ"
  | "TINYINT"
  | (string & {});
export const ParameterType = S.String;
export type QueryTables = string[];
export const QueryTables = S.Array(S.String);
export type ErrorMessageType = "DETAILED" | (string & {});
export const ErrorMessageType = S.String;
export type CustomMLMemberAbility =
  | "CAN_RECEIVE_MODEL_OUTPUT"
  | "CAN_RECEIVE_INFERENCE_OUTPUT"
  | (string & {});
export const CustomMLMemberAbility = S.String;
export type CustomMLMemberAbilities = CustomMLMemberAbility[];
export const CustomMLMemberAbilities = S.Array(CustomMLMemberAbility);
export type ChangeSpecificationType =
  | "MEMBER"
  | "COLLABORATION"
  | (string & {});
export const ChangeSpecificationType = S.String;
export interface AnalysisParameter {
  name: string;
  type: ParameterType;
  defaultValue?: string;
}
export const AnalysisParameter = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: ParameterType,
    defaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalysisParameter",
}) as any as S.Schema<AnalysisParameter>;
export type AnalysisParameterList = AnalysisParameter[];
export const AnalysisParameterList = S.Array(AnalysisParameter);
export interface AnalysisSchema {
  referencedTables?: string[];
}
export const AnalysisSchema = S.suspend(() =>
  S.Struct({ referencedTables: S.optional(QueryTables) }),
).annotations({
  identifier: "AnalysisSchema",
}) as any as S.Schema<AnalysisSchema>;
export interface ErrorMessageConfiguration {
  type: ErrorMessageType;
}
export const ErrorMessageConfiguration = S.suspend(() =>
  S.Struct({ type: ErrorMessageType }),
).annotations({
  identifier: "ErrorMessageConfiguration",
}) as any as S.Schema<ErrorMessageConfiguration>;
export interface MLMemberAbilities {
  customMLMemberAbilities: CustomMLMemberAbility[];
}
export const MLMemberAbilities = S.suspend(() =>
  S.Struct({ customMLMemberAbilities: CustomMLMemberAbilities }),
).annotations({
  identifier: "MLMemberAbilities",
}) as any as S.Schema<MLMemberAbilities>;
export interface QueryComputePaymentConfig {
  isResponsible: boolean;
}
export const QueryComputePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "QueryComputePaymentConfig",
}) as any as S.Schema<QueryComputePaymentConfig>;
export interface ModelTrainingPaymentConfig {
  isResponsible: boolean;
}
export const ModelTrainingPaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "ModelTrainingPaymentConfig",
}) as any as S.Schema<ModelTrainingPaymentConfig>;
export interface ModelInferencePaymentConfig {
  isResponsible: boolean;
}
export const ModelInferencePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "ModelInferencePaymentConfig",
}) as any as S.Schema<ModelInferencePaymentConfig>;
export interface SyntheticDataGenerationPaymentConfig {
  isResponsible: boolean;
}
export const SyntheticDataGenerationPaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "SyntheticDataGenerationPaymentConfig",
}) as any as S.Schema<SyntheticDataGenerationPaymentConfig>;
export interface MLPaymentConfig {
  modelTraining?: ModelTrainingPaymentConfig;
  modelInference?: ModelInferencePaymentConfig;
  syntheticDataGeneration?: SyntheticDataGenerationPaymentConfig;
}
export const MLPaymentConfig = S.suspend(() =>
  S.Struct({
    modelTraining: S.optional(ModelTrainingPaymentConfig),
    modelInference: S.optional(ModelInferencePaymentConfig),
    syntheticDataGeneration: S.optional(SyntheticDataGenerationPaymentConfig),
  }),
).annotations({
  identifier: "MLPaymentConfig",
}) as any as S.Schema<MLPaymentConfig>;
export interface JobComputePaymentConfig {
  isResponsible: boolean;
}
export const JobComputePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "JobComputePaymentConfig",
}) as any as S.Schema<JobComputePaymentConfig>;
export interface PaymentConfiguration {
  queryCompute: QueryComputePaymentConfig;
  machineLearning?: MLPaymentConfig;
  jobCompute?: JobComputePaymentConfig;
}
export const PaymentConfiguration = S.suspend(() =>
  S.Struct({
    queryCompute: QueryComputePaymentConfig,
    machineLearning: S.optional(MLPaymentConfig),
    jobCompute: S.optional(JobComputePaymentConfig),
  }),
).annotations({
  identifier: "PaymentConfiguration",
}) as any as S.Schema<PaymentConfiguration>;
export interface MemberSpecification {
  accountId: string;
  memberAbilities: MemberAbility[];
  mlMemberAbilities?: MLMemberAbilities;
  displayName: string;
  paymentConfiguration?: PaymentConfiguration;
}
export const MemberSpecification = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    memberAbilities: MemberAbilities,
    mlMemberAbilities: S.optional(MLMemberAbilities),
    displayName: S.String,
    paymentConfiguration: S.optional(PaymentConfiguration),
  }),
).annotations({
  identifier: "MemberSpecification",
}) as any as S.Schema<MemberSpecification>;
export type MemberList = MemberSpecification[];
export const MemberList = S.Array(MemberSpecification);
export interface DataEncryptionMetadata {
  allowCleartext: boolean;
  allowDuplicates: boolean;
  allowJoinsOnColumnsWithDifferentNames: boolean;
  preserveNulls: boolean;
}
export const DataEncryptionMetadata = S.suspend(() =>
  S.Struct({
    allowCleartext: S.Boolean,
    allowDuplicates: S.Boolean,
    allowJoinsOnColumnsWithDifferentNames: S.Boolean,
    preserveNulls: S.Boolean,
  }),
).annotations({
  identifier: "DataEncryptionMetadata",
}) as any as S.Schema<DataEncryptionMetadata>;
export interface SchemaAnalysisRuleRequest {
  name: string;
  type: AnalysisRuleType;
}
export const SchemaAnalysisRuleRequest = S.suspend(() =>
  S.Struct({ name: S.String, type: AnalysisRuleType }),
).annotations({
  identifier: "SchemaAnalysisRuleRequest",
}) as any as S.Schema<SchemaAnalysisRuleRequest>;
export type SchemaAnalysisRuleRequestList = SchemaAnalysisRuleRequest[];
export const SchemaAnalysisRuleRequestList = S.Array(SchemaAnalysisRuleRequest);
export interface IdMappingTableInputReferenceConfig {
  inputReferenceArn: string;
  manageResourcePolicies: boolean;
}
export const IdMappingTableInputReferenceConfig = S.suspend(() =>
  S.Struct({ inputReferenceArn: S.String, manageResourcePolicies: S.Boolean }),
).annotations({
  identifier: "IdMappingTableInputReferenceConfig",
}) as any as S.Schema<IdMappingTableInputReferenceConfig>;
export interface IdNamespaceAssociationInputReferenceConfig {
  inputReferenceArn: string;
  manageResourcePolicies: boolean;
}
export const IdNamespaceAssociationInputReferenceConfig = S.suspend(() =>
  S.Struct({ inputReferenceArn: S.String, manageResourcePolicies: S.Boolean }),
).annotations({
  identifier: "IdNamespaceAssociationInputReferenceConfig",
}) as any as S.Schema<IdNamespaceAssociationInputReferenceConfig>;
export interface ProtectedJobParameters {
  analysisTemplateArn: string;
}
export const ProtectedJobParameters = S.suspend(() =>
  S.Struct({ analysisTemplateArn: S.String }),
).annotations({
  identifier: "ProtectedJobParameters",
}) as any as S.Schema<ProtectedJobParameters>;
export interface S3Location {
  bucket: string;
  key: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface AnalysisTemplateArtifact {
  location: S3Location;
}
export const AnalysisTemplateArtifact = S.suspend(() =>
  S.Struct({ location: S3Location }),
).annotations({
  identifier: "AnalysisTemplateArtifact",
}) as any as S.Schema<AnalysisTemplateArtifact>;
export type AnalysisTemplateArtifactList = AnalysisTemplateArtifact[];
export const AnalysisTemplateArtifactList = S.Array(AnalysisTemplateArtifact);
export type ProtectedJobWorkerComputeType = "CR.1X" | "CR.4X" | (string & {});
export const ProtectedJobWorkerComputeType = S.String;
export type WorkerComputeType = "CR.1X" | "CR.4X" | (string & {});
export const WorkerComputeType = S.String;
export interface ListTagsForResourceOutput {
  tags: { [key: string]: string | undefined };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceInput = S.suspend(() =>
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
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface AnalysisTemplateArtifacts {
  entryPoint: AnalysisTemplateArtifact;
  additionalArtifacts?: AnalysisTemplateArtifact[];
  roleArn: string;
}
export const AnalysisTemplateArtifacts = S.suspend(() =>
  S.Struct({
    entryPoint: AnalysisTemplateArtifact,
    additionalArtifacts: S.optional(AnalysisTemplateArtifactList),
    roleArn: S.String,
  }),
).annotations({
  identifier: "AnalysisTemplateArtifacts",
}) as any as S.Schema<AnalysisTemplateArtifacts>;
export type AnalysisSource =
  | { text: string | redacted.Redacted<string>; artifacts?: never }
  | { text?: never; artifacts: AnalysisTemplateArtifacts };
export const AnalysisSource = S.Union(
  S.Struct({ text: SensitiveString }),
  S.Struct({ artifacts: AnalysisTemplateArtifacts }),
);
export interface Hash {
  sha256?: string;
}
export const Hash = S.suspend(() =>
  S.Struct({ sha256: S.optional(S.String) }),
).annotations({ identifier: "Hash" }) as any as S.Schema<Hash>;
export type HashList = Hash[];
export const HashList = S.Array(Hash);
export interface AnalysisTemplateArtifactMetadata {
  entryPointHash: Hash;
  additionalArtifactHashes?: Hash[];
}
export const AnalysisTemplateArtifactMetadata = S.suspend(() =>
  S.Struct({
    entryPointHash: Hash,
    additionalArtifactHashes: S.optional(HashList),
  }),
).annotations({
  identifier: "AnalysisTemplateArtifactMetadata",
}) as any as S.Schema<AnalysisTemplateArtifactMetadata>;
export type AnalysisSourceMetadata = {
  artifacts: AnalysisTemplateArtifactMetadata;
};
export const AnalysisSourceMetadata = S.Union(
  S.Struct({ artifacts: AnalysisTemplateArtifactMetadata }),
);
export type AnalysisTemplateValidationType =
  | "DIFFERENTIAL_PRIVACY"
  | (string & {});
export const AnalysisTemplateValidationType = S.String;
export type AnalysisTemplateValidationStatus =
  | "VALID"
  | "INVALID"
  | "UNABLE_TO_VALIDATE"
  | (string & {});
export const AnalysisTemplateValidationStatus = S.String;
export interface AnalysisTemplateValidationStatusReason {
  message: string;
}
export const AnalysisTemplateValidationStatusReason = S.suspend(() =>
  S.Struct({ message: S.String }),
).annotations({
  identifier: "AnalysisTemplateValidationStatusReason",
}) as any as S.Schema<AnalysisTemplateValidationStatusReason>;
export type AnalysisTemplateValidationStatusReasonList =
  AnalysisTemplateValidationStatusReason[];
export const AnalysisTemplateValidationStatusReasonList = S.Array(
  AnalysisTemplateValidationStatusReason,
);
export interface AnalysisTemplateValidationStatusDetail {
  type: AnalysisTemplateValidationType;
  status: AnalysisTemplateValidationStatus;
  reasons?: AnalysisTemplateValidationStatusReason[];
}
export const AnalysisTemplateValidationStatusDetail = S.suspend(() =>
  S.Struct({
    type: AnalysisTemplateValidationType,
    status: AnalysisTemplateValidationStatus,
    reasons: S.optional(AnalysisTemplateValidationStatusReasonList),
  }),
).annotations({
  identifier: "AnalysisTemplateValidationStatusDetail",
}) as any as S.Schema<AnalysisTemplateValidationStatusDetail>;
export type AnalysisTemplateValidationStatusDetailList =
  AnalysisTemplateValidationStatusDetail[];
export const AnalysisTemplateValidationStatusDetailList = S.Array(
  AnalysisTemplateValidationStatusDetail,
);
export type SyntheticDataColumnType =
  | "CATEGORICAL"
  | "NUMERICAL"
  | (string & {});
export const SyntheticDataColumnType = S.String;
export interface SyntheticDataColumnProperties {
  columnName: string;
  columnType: SyntheticDataColumnType;
  isPredictiveValue: boolean;
}
export const SyntheticDataColumnProperties = S.suspend(() =>
  S.Struct({
    columnName: S.String,
    columnType: SyntheticDataColumnType,
    isPredictiveValue: S.Boolean,
  }),
).annotations({
  identifier: "SyntheticDataColumnProperties",
}) as any as S.Schema<SyntheticDataColumnProperties>;
export type ColumnMappingList = SyntheticDataColumnProperties[];
export const ColumnMappingList = S.Array(SyntheticDataColumnProperties);
export interface ColumnClassificationDetails {
  columnMapping: SyntheticDataColumnProperties[];
}
export const ColumnClassificationDetails = S.suspend(() =>
  S.Struct({ columnMapping: ColumnMappingList }),
).annotations({
  identifier: "ColumnClassificationDetails",
}) as any as S.Schema<ColumnClassificationDetails>;
export interface MLSyntheticDataParameters {
  epsilon: number;
  maxMembershipInferenceAttackScore: number;
  columnClassification: ColumnClassificationDetails;
}
export const MLSyntheticDataParameters = S.suspend(() =>
  S.Struct({
    epsilon: S.Number,
    maxMembershipInferenceAttackScore: S.Number,
    columnClassification: ColumnClassificationDetails,
  }),
).annotations({
  identifier: "MLSyntheticDataParameters",
}) as any as S.Schema<MLSyntheticDataParameters>;
export type SyntheticDataParameters = {
  mlSyntheticDataParameters: MLSyntheticDataParameters;
};
export const SyntheticDataParameters = S.Union(
  S.Struct({ mlSyntheticDataParameters: MLSyntheticDataParameters }),
);
export interface AnalysisTemplate {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  membershipId: string;
  membershipArn: string;
  description?: string;
  name: string;
  createTime: Date;
  updateTime: Date;
  schema: AnalysisSchema;
  format: AnalysisFormat;
  source: AnalysisSource;
  sourceMetadata?: AnalysisSourceMetadata;
  analysisParameters?: AnalysisParameter[];
  validations?: AnalysisTemplateValidationStatusDetail[];
  errorMessageConfiguration?: ErrorMessageConfiguration;
  syntheticDataParameters?: SyntheticDataParameters;
}
export const AnalysisTemplate = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    description: S.optional(S.String),
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    schema: AnalysisSchema,
    format: AnalysisFormat,
    source: AnalysisSource,
    sourceMetadata: S.optional(AnalysisSourceMetadata),
    analysisParameters: S.optional(AnalysisParameterList),
    validations: S.optional(AnalysisTemplateValidationStatusDetailList),
    errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
    syntheticDataParameters: S.optional(SyntheticDataParameters),
  }),
).annotations({
  identifier: "AnalysisTemplate",
}) as any as S.Schema<AnalysisTemplate>;
export interface UpdateAnalysisTemplateOutput {
  analysisTemplate: AnalysisTemplate;
}
export const UpdateAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({ analysisTemplate: AnalysisTemplate }),
).annotations({
  identifier: "UpdateAnalysisTemplateOutput",
}) as any as S.Schema<UpdateAnalysisTemplateOutput>;
export interface Collaboration {
  id: string;
  arn: string;
  name: string;
  description?: string;
  creatorAccountId: string;
  creatorDisplayName: string;
  createTime: Date;
  updateTime: Date;
  memberStatus: string;
  membershipId?: string;
  membershipArn?: string;
  dataEncryptionMetadata?: DataEncryptionMetadata;
  queryLogStatus: CollaborationQueryLogStatus;
  jobLogStatus?: CollaborationJobLogStatus;
  analyticsEngine?: AnalyticsEngine;
  autoApprovedChangeTypes?: AutoApprovedChangeType[];
  allowedResultRegions?: SupportedS3Region[];
  isMetricsEnabled?: boolean;
}
export const Collaboration = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.optional(S.String),
    creatorAccountId: S.String,
    creatorDisplayName: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    memberStatus: S.String,
    membershipId: S.optional(S.String),
    membershipArn: S.optional(S.String),
    dataEncryptionMetadata: S.optional(DataEncryptionMetadata),
    queryLogStatus: CollaborationQueryLogStatus,
    jobLogStatus: S.optional(CollaborationJobLogStatus),
    analyticsEngine: S.optional(AnalyticsEngine),
    autoApprovedChangeTypes: S.optional(AutoApprovedChangeTypeList),
    allowedResultRegions: S.optional(AllowedResultRegions),
    isMetricsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "Collaboration",
}) as any as S.Schema<Collaboration>;
export interface UpdateCollaborationOutput {
  collaboration: Collaboration;
}
export const UpdateCollaborationOutput = S.suspend(() =>
  S.Struct({ collaboration: Collaboration }),
).annotations({
  identifier: "UpdateCollaborationOutput",
}) as any as S.Schema<UpdateCollaborationOutput>;
export interface BatchGetSchemaAnalysisRuleInput {
  collaborationIdentifier: string;
  schemaAnalysisRuleRequests: SchemaAnalysisRuleRequest[];
}
export const BatchGetSchemaAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    schemaAnalysisRuleRequests: SchemaAnalysisRuleRequestList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/collaborations/{collaborationIdentifier}/batch-schema-analysis-rule",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetSchemaAnalysisRuleInput",
}) as any as S.Schema<BatchGetSchemaAnalysisRuleInput>;
export interface CollaborationAnalysisTemplate {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  description?: string;
  creatorAccountId: string;
  name: string;
  createTime: Date;
  updateTime: Date;
  schema: AnalysisSchema;
  format: AnalysisFormat;
  source?: AnalysisSource;
  sourceMetadata?: AnalysisSourceMetadata;
  analysisParameters?: AnalysisParameter[];
  validations?: AnalysisTemplateValidationStatusDetail[];
  errorMessageConfiguration?: ErrorMessageConfiguration;
  syntheticDataParameters?: SyntheticDataParameters;
}
export const CollaborationAnalysisTemplate = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    description: S.optional(S.String),
    creatorAccountId: S.String,
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    schema: AnalysisSchema,
    format: AnalysisFormat,
    source: S.optional(AnalysisSource),
    sourceMetadata: S.optional(AnalysisSourceMetadata),
    analysisParameters: S.optional(AnalysisParameterList),
    validations: S.optional(AnalysisTemplateValidationStatusDetailList),
    errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
    syntheticDataParameters: S.optional(SyntheticDataParameters),
  }),
).annotations({
  identifier: "CollaborationAnalysisTemplate",
}) as any as S.Schema<CollaborationAnalysisTemplate>;
export interface GetCollaborationAnalysisTemplateOutput {
  collaborationAnalysisTemplate: CollaborationAnalysisTemplate;
}
export const GetCollaborationAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({ collaborationAnalysisTemplate: CollaborationAnalysisTemplate }),
).annotations({
  identifier: "GetCollaborationAnalysisTemplateOutput",
}) as any as S.Schema<GetCollaborationAnalysisTemplateOutput>;
export interface Column {
  name: string;
  type: string;
}
export const Column = S.suspend(() =>
  S.Struct({ name: S.String, type: S.String }),
).annotations({ identifier: "Column" }) as any as S.Schema<Column>;
export type ColumnList = Column[];
export const ColumnList = S.Array(Column);
export type AnalysisRuleTypeList = AnalysisRuleType[];
export const AnalysisRuleTypeList = S.Array(AnalysisRuleType);
export type SchemaStatus = "READY" | "NOT_READY" | (string & {});
export const SchemaStatus = S.String;
export type SchemaStatusReasonCode =
  | "ANALYSIS_RULE_MISSING"
  | "ANALYSIS_TEMPLATES_NOT_CONFIGURED"
  | "ANALYSIS_PROVIDERS_NOT_CONFIGURED"
  | "DIFFERENTIAL_PRIVACY_POLICY_NOT_CONFIGURED"
  | "ID_MAPPING_TABLE_NOT_POPULATED"
  | "COLLABORATION_ANALYSIS_RULE_NOT_CONFIGURED"
  | "ADDITIONAL_ANALYSES_NOT_CONFIGURED"
  | "RESULT_RECEIVERS_NOT_CONFIGURED"
  | "ADDITIONAL_ANALYSES_NOT_ALLOWED"
  | "RESULT_RECEIVERS_NOT_ALLOWED"
  | "ANALYSIS_RULE_TYPES_NOT_COMPATIBLE"
  | (string & {});
export const SchemaStatusReasonCode = S.String;
export interface SchemaStatusReason {
  code: SchemaStatusReasonCode;
  message: string;
}
export const SchemaStatusReason = S.suspend(() =>
  S.Struct({ code: SchemaStatusReasonCode, message: S.String }),
).annotations({
  identifier: "SchemaStatusReason",
}) as any as S.Schema<SchemaStatusReason>;
export type SchemaStatusReasonList = SchemaStatusReason[];
export const SchemaStatusReasonList = S.Array(SchemaStatusReason);
export type SchemaConfiguration = "DIFFERENTIAL_PRIVACY" | (string & {});
export const SchemaConfiguration = S.String;
export type SchemaConfigurationList = SchemaConfiguration[];
export const SchemaConfigurationList = S.Array(SchemaConfiguration);
export type AnalysisType =
  | "DIRECT_ANALYSIS"
  | "ADDITIONAL_ANALYSIS"
  | (string & {});
export const AnalysisType = S.String;
export interface SchemaStatusDetail {
  status: SchemaStatus;
  reasons?: SchemaStatusReason[];
  analysisRuleType?: AnalysisRuleType;
  configurations?: SchemaConfiguration[];
  analysisType: AnalysisType;
}
export const SchemaStatusDetail = S.suspend(() =>
  S.Struct({
    status: SchemaStatus,
    reasons: S.optional(SchemaStatusReasonList),
    analysisRuleType: S.optional(AnalysisRuleType),
    configurations: S.optional(SchemaConfigurationList),
    analysisType: AnalysisType,
  }),
).annotations({
  identifier: "SchemaStatusDetail",
}) as any as S.Schema<SchemaStatusDetail>;
export type SchemaStatusDetailList = SchemaStatusDetail[];
export const SchemaStatusDetailList = S.Array(SchemaStatusDetail);
export type IdNamespaceType = "SOURCE" | "TARGET" | (string & {});
export const IdNamespaceType = S.String;
export interface IdMappingTableInputSource {
  idNamespaceAssociationId: string;
  type: IdNamespaceType;
}
export const IdMappingTableInputSource = S.suspend(() =>
  S.Struct({ idNamespaceAssociationId: S.String, type: IdNamespaceType }),
).annotations({
  identifier: "IdMappingTableInputSource",
}) as any as S.Schema<IdMappingTableInputSource>;
export type IdMappingTableInputSourceList = IdMappingTableInputSource[];
export const IdMappingTableInputSourceList = S.Array(IdMappingTableInputSource);
export interface IdMappingTableSchemaTypeProperties {
  idMappingTableInputSource: IdMappingTableInputSource[];
}
export const IdMappingTableSchemaTypeProperties = S.suspend(() =>
  S.Struct({ idMappingTableInputSource: IdMappingTableInputSourceList }),
).annotations({
  identifier: "IdMappingTableSchemaTypeProperties",
}) as any as S.Schema<IdMappingTableSchemaTypeProperties>;
export type SchemaTypeProperties = {
  idMappingTable: IdMappingTableSchemaTypeProperties;
};
export const SchemaTypeProperties = S.Union(
  S.Struct({ idMappingTable: IdMappingTableSchemaTypeProperties }),
);
export interface Schema {
  columns: Column[];
  partitionKeys: Column[];
  analysisRuleTypes: AnalysisRuleType[];
  analysisMethod?: AnalysisMethod;
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
  creatorAccountId: string;
  name: string;
  collaborationId: string;
  collaborationArn: string;
  description: string;
  createTime: Date;
  updateTime: Date;
  type: SchemaType;
  schemaStatusDetails: SchemaStatusDetail[];
  resourceArn?: string;
  schemaTypeProperties?: SchemaTypeProperties;
}
export const Schema = S.suspend(() =>
  S.Struct({
    columns: ColumnList,
    partitionKeys: ColumnList,
    analysisRuleTypes: AnalysisRuleTypeList,
    analysisMethod: S.optional(AnalysisMethod),
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
    creatorAccountId: S.String,
    name: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    description: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    type: SchemaType,
    schemaStatusDetails: SchemaStatusDetailList,
    resourceArn: S.optional(S.String),
    schemaTypeProperties: S.optional(SchemaTypeProperties),
  }),
).annotations({ identifier: "Schema" }) as any as S.Schema<Schema>;
export interface GetSchemaOutput {
  schema: Schema;
}
export const GetSchemaOutput = S.suspend(() =>
  S.Struct({ schema: Schema }),
).annotations({
  identifier: "GetSchemaOutput",
}) as any as S.Schema<GetSchemaOutput>;
export interface MemberChangeSpecification {
  accountId: string;
  memberAbilities: MemberAbility[];
  displayName?: string;
}
export const MemberChangeSpecification = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    memberAbilities: MemberAbilities,
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "MemberChangeSpecification",
}) as any as S.Schema<MemberChangeSpecification>;
export interface CollaborationChangeSpecification {
  autoApprovedChangeTypes?: AutoApprovedChangeType[];
}
export const CollaborationChangeSpecification = S.suspend(() =>
  S.Struct({ autoApprovedChangeTypes: S.optional(AutoApprovedChangeTypeList) }),
).annotations({
  identifier: "CollaborationChangeSpecification",
}) as any as S.Schema<CollaborationChangeSpecification>;
export type ChangeSpecification =
  | { member: MemberChangeSpecification; collaboration?: never }
  | { member?: never; collaboration: CollaborationChangeSpecification };
export const ChangeSpecification = S.Union(
  S.Struct({ member: MemberChangeSpecification }),
  S.Struct({ collaboration: CollaborationChangeSpecification }),
);
export type ChangeType =
  | "ADD_MEMBER"
  | "GRANT_RECEIVE_RESULTS_ABILITY"
  | "REVOKE_RECEIVE_RESULTS_ABILITY"
  | "EDIT_AUTO_APPROVED_CHANGE_TYPES"
  | (string & {});
export const ChangeType = S.String;
export type ChangeTypeList = ChangeType[];
export const ChangeTypeList = S.Array(ChangeType);
export interface Change {
  specificationType: ChangeSpecificationType;
  specification: ChangeSpecification;
  types: ChangeType[];
}
export const Change = S.suspend(() =>
  S.Struct({
    specificationType: ChangeSpecificationType,
    specification: ChangeSpecification,
    types: ChangeTypeList,
  }),
).annotations({ identifier: "Change" }) as any as S.Schema<Change>;
export type ChangeList = Change[];
export const ChangeList = S.Array(Change);
export type ApprovalStatus = "APPROVED" | "DENIED" | "PENDING" | (string & {});
export const ApprovalStatus = S.String;
export interface ApprovalStatusDetails {
  status: ApprovalStatus;
}
export const ApprovalStatusDetails = S.suspend(() =>
  S.Struct({ status: ApprovalStatus }),
).annotations({
  identifier: "ApprovalStatusDetails",
}) as any as S.Schema<ApprovalStatusDetails>;
export type ApprovalStatuses = {
  [key: string]: ApprovalStatusDetails | undefined;
};
export const ApprovalStatuses = S.Record({
  key: S.String,
  value: S.UndefinedOr(ApprovalStatusDetails),
});
export interface CollaborationChangeRequest {
  id: string;
  collaborationId: string;
  createTime: Date;
  updateTime: Date;
  status: ChangeRequestStatus;
  isAutoApproved: boolean;
  changes: Change[];
  approvals?: { [key: string]: ApprovalStatusDetails | undefined };
}
export const CollaborationChangeRequest = S.suspend(() =>
  S.Struct({
    id: S.String,
    collaborationId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: ChangeRequestStatus,
    isAutoApproved: S.Boolean,
    changes: ChangeList,
    approvals: S.optional(ApprovalStatuses),
  }),
).annotations({
  identifier: "CollaborationChangeRequest",
}) as any as S.Schema<CollaborationChangeRequest>;
export interface UpdateCollaborationChangeRequestOutput {
  collaborationChangeRequest: CollaborationChangeRequest;
}
export const UpdateCollaborationChangeRequestOutput = S.suspend(() =>
  S.Struct({ collaborationChangeRequest: CollaborationChangeRequest }),
).annotations({
  identifier: "UpdateCollaborationChangeRequestOutput",
}) as any as S.Schema<UpdateCollaborationChangeRequestOutput>;
export interface ConfiguredAudienceModelAssociation {
  id: string;
  arn: string;
  configuredAudienceModelArn: string;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  name: string;
  manageResourcePolicies: boolean;
  description?: string;
  createTime: Date;
  updateTime: Date;
}
export const ConfiguredAudienceModelAssociation = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    configuredAudienceModelArn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    name: S.String,
    manageResourcePolicies: S.Boolean,
    description: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ConfiguredAudienceModelAssociation",
}) as any as S.Schema<ConfiguredAudienceModelAssociation>;
export interface GetConfiguredAudienceModelAssociationOutput {
  configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation;
}
export const GetConfiguredAudienceModelAssociationOutput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation,
  }),
).annotations({
  identifier: "GetConfiguredAudienceModelAssociationOutput",
}) as any as S.Schema<GetConfiguredAudienceModelAssociationOutput>;
export interface UpdateConfiguredAudienceModelAssociationOutput {
  configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation;
}
export const UpdateConfiguredAudienceModelAssociationOutput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation,
  }),
).annotations({
  identifier: "UpdateConfiguredAudienceModelAssociationOutput",
}) as any as S.Schema<UpdateConfiguredAudienceModelAssociationOutput>;
export type ConfiguredTableAssociationAnalysisRuleTypeList =
  ConfiguredTableAssociationAnalysisRuleType[];
export const ConfiguredTableAssociationAnalysisRuleTypeList = S.Array(
  ConfiguredTableAssociationAnalysisRuleType,
);
export interface ConfiguredTableAssociation {
  arn: string;
  id: string;
  configuredTableId: string;
  configuredTableArn: string;
  membershipId: string;
  membershipArn: string;
  roleArn: string;
  name: string;
  description?: string;
  analysisRuleTypes?: ConfiguredTableAssociationAnalysisRuleType[];
  createTime: Date;
  updateTime: Date;
}
export const ConfiguredTableAssociation = S.suspend(() =>
  S.Struct({
    arn: S.String,
    id: S.String,
    configuredTableId: S.String,
    configuredTableArn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    roleArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    analysisRuleTypes: S.optional(
      ConfiguredTableAssociationAnalysisRuleTypeList,
    ),
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ConfiguredTableAssociation",
}) as any as S.Schema<ConfiguredTableAssociation>;
export interface GetConfiguredTableAssociationOutput {
  configuredTableAssociation: ConfiguredTableAssociation;
}
export const GetConfiguredTableAssociationOutput = S.suspend(() =>
  S.Struct({ configuredTableAssociation: ConfiguredTableAssociation }),
).annotations({
  identifier: "GetConfiguredTableAssociationOutput",
}) as any as S.Schema<GetConfiguredTableAssociationOutput>;
export interface UpdateConfiguredTableAssociationOutput {
  configuredTableAssociation: ConfiguredTableAssociation;
}
export const UpdateConfiguredTableAssociationOutput = S.suspend(() =>
  S.Struct({ configuredTableAssociation: ConfiguredTableAssociation }),
).annotations({
  identifier: "UpdateConfiguredTableAssociationOutput",
}) as any as S.Schema<UpdateConfiguredTableAssociationOutput>;
export interface ConfiguredTableAssociationAnalysisRule {
  membershipIdentifier: string;
  configuredTableAssociationId: string;
  configuredTableAssociationArn: string;
  policy: ConfiguredTableAssociationAnalysisRulePolicy;
  type: ConfiguredTableAssociationAnalysisRuleType;
  createTime: Date;
  updateTime: Date;
}
export const ConfiguredTableAssociationAnalysisRule = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    configuredTableAssociationId: S.String,
    configuredTableAssociationArn: S.String,
    policy: ConfiguredTableAssociationAnalysisRulePolicy,
    type: ConfiguredTableAssociationAnalysisRuleType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ConfiguredTableAssociationAnalysisRule",
}) as any as S.Schema<ConfiguredTableAssociationAnalysisRule>;
export interface UpdateConfiguredTableAssociationAnalysisRuleOutput {
  analysisRule: ConfiguredTableAssociationAnalysisRule;
}
export const UpdateConfiguredTableAssociationAnalysisRuleOutput = S.suspend(
  () => S.Struct({ analysisRule: ConfiguredTableAssociationAnalysisRule }),
).annotations({
  identifier: "UpdateConfiguredTableAssociationAnalysisRuleOutput",
}) as any as S.Schema<UpdateConfiguredTableAssociationAnalysisRuleOutput>;
export type ConfiguredTableAnalysisRuleTypeList =
  ConfiguredTableAnalysisRuleType[];
export const ConfiguredTableAnalysisRuleTypeList = S.Array(
  ConfiguredTableAnalysisRuleType,
);
export interface ConfiguredTable {
  id: string;
  arn: string;
  name: string;
  description?: string;
  tableReference: TableReference;
  createTime: Date;
  updateTime: Date;
  analysisRuleTypes: ConfiguredTableAnalysisRuleType[];
  analysisMethod: AnalysisMethod;
  allowedColumns: string[];
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
}
export const ConfiguredTable = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.optional(S.String),
    tableReference: TableReference,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList,
    analysisMethod: AnalysisMethod,
    allowedColumns: AllowedColumnList,
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  }),
).annotations({
  identifier: "ConfiguredTable",
}) as any as S.Schema<ConfiguredTable>;
export interface UpdateConfiguredTableOutput {
  configuredTable: ConfiguredTable;
}
export const UpdateConfiguredTableOutput = S.suspend(() =>
  S.Struct({ configuredTable: ConfiguredTable }),
).annotations({
  identifier: "UpdateConfiguredTableOutput",
}) as any as S.Schema<UpdateConfiguredTableOutput>;
export interface ConfiguredTableAnalysisRule {
  configuredTableId: string;
  configuredTableArn: string;
  policy: ConfiguredTableAnalysisRulePolicy;
  type: ConfiguredTableAnalysisRuleType;
  createTime: Date;
  updateTime: Date;
}
export const ConfiguredTableAnalysisRule = S.suspend(() =>
  S.Struct({
    configuredTableId: S.String,
    configuredTableArn: S.String,
    policy: ConfiguredTableAnalysisRulePolicy,
    type: ConfiguredTableAnalysisRuleType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ConfiguredTableAnalysisRule",
}) as any as S.Schema<ConfiguredTableAnalysisRule>;
export interface UpdateConfiguredTableAnalysisRuleOutput {
  analysisRule: ConfiguredTableAnalysisRule;
}
export const UpdateConfiguredTableAnalysisRuleOutput = S.suspend(() =>
  S.Struct({ analysisRule: ConfiguredTableAnalysisRule }),
).annotations({
  identifier: "UpdateConfiguredTableAnalysisRuleOutput",
}) as any as S.Schema<UpdateConfiguredTableAnalysisRuleOutput>;
export interface CreateIdMappingTableInput {
  membershipIdentifier: string;
  name: string;
  description?: string;
  inputReferenceConfig: IdMappingTableInputReferenceConfig;
  tags?: { [key: string]: string | undefined };
  kmsKeyArn?: string;
}
export const CreateIdMappingTableInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    description: S.optional(S.String),
    inputReferenceConfig: IdMappingTableInputReferenceConfig,
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/idmappingtables",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdMappingTableInput",
}) as any as S.Schema<CreateIdMappingTableInput>;
export interface IdMappingTableInputReferenceProperties {
  idMappingTableInputSource: IdMappingTableInputSource[];
}
export const IdMappingTableInputReferenceProperties = S.suspend(() =>
  S.Struct({ idMappingTableInputSource: IdMappingTableInputSourceList }),
).annotations({
  identifier: "IdMappingTableInputReferenceProperties",
}) as any as S.Schema<IdMappingTableInputReferenceProperties>;
export interface IdMappingTable {
  id: string;
  arn: string;
  inputReferenceConfig: IdMappingTableInputReferenceConfig;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  description?: string;
  name: string;
  createTime: Date;
  updateTime: Date;
  inputReferenceProperties: IdMappingTableInputReferenceProperties;
  kmsKeyArn?: string;
}
export const IdMappingTable = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    inputReferenceConfig: IdMappingTableInputReferenceConfig,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    description: S.optional(S.String),
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    inputReferenceProperties: IdMappingTableInputReferenceProperties,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IdMappingTable",
}) as any as S.Schema<IdMappingTable>;
export interface UpdateIdMappingTableOutput {
  idMappingTable: IdMappingTable;
}
export const UpdateIdMappingTableOutput = S.suspend(() =>
  S.Struct({ idMappingTable: IdMappingTable }),
).annotations({
  identifier: "UpdateIdMappingTableOutput",
}) as any as S.Schema<UpdateIdMappingTableOutput>;
export interface PopulateIdMappingTableOutput {
  idMappingJobId: string;
}
export const PopulateIdMappingTableOutput = S.suspend(() =>
  S.Struct({ idMappingJobId: S.String }),
).annotations({
  identifier: "PopulateIdMappingTableOutput",
}) as any as S.Schema<PopulateIdMappingTableOutput>;
export interface CreateIdNamespaceAssociationInput {
  membershipIdentifier: string;
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig;
  tags?: { [key: string]: string | undefined };
  name: string;
  description?: string;
  idMappingConfig?: IdMappingConfig;
}
export const CreateIdNamespaceAssociationInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    tags: S.optional(TagMap),
    name: S.String,
    description: S.optional(S.String),
    idMappingConfig: S.optional(IdMappingConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/idnamespaceassociations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdNamespaceAssociationInput",
}) as any as S.Schema<CreateIdNamespaceAssociationInput>;
export type IdMappingWorkflowsSupported = any[];
export const IdMappingWorkflowsSupported = S.Array(S.Any);
export interface IdNamespaceAssociationInputReferenceProperties {
  idNamespaceType: IdNamespaceType;
  idMappingWorkflowsSupported: any[];
}
export const IdNamespaceAssociationInputReferenceProperties = S.suspend(() =>
  S.Struct({
    idNamespaceType: IdNamespaceType,
    idMappingWorkflowsSupported: IdMappingWorkflowsSupported,
  }),
).annotations({
  identifier: "IdNamespaceAssociationInputReferenceProperties",
}) as any as S.Schema<IdNamespaceAssociationInputReferenceProperties>;
export interface IdNamespaceAssociation {
  id: string;
  arn: string;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  name: string;
  description?: string;
  createTime: Date;
  updateTime: Date;
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig;
  inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties;
  idMappingConfig?: IdMappingConfig;
}
export const IdNamespaceAssociation = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties,
    idMappingConfig: S.optional(IdMappingConfig),
  }),
).annotations({
  identifier: "IdNamespaceAssociation",
}) as any as S.Schema<IdNamespaceAssociation>;
export interface UpdateIdNamespaceAssociationOutput {
  idNamespaceAssociation: IdNamespaceAssociation;
}
export const UpdateIdNamespaceAssociationOutput = S.suspend(() =>
  S.Struct({ idNamespaceAssociation: IdNamespaceAssociation }),
).annotations({
  identifier: "UpdateIdNamespaceAssociationOutput",
}) as any as S.Schema<UpdateIdNamespaceAssociationOutput>;
export interface MembershipQueryComputePaymentConfig {
  isResponsible: boolean;
}
export const MembershipQueryComputePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "MembershipQueryComputePaymentConfig",
}) as any as S.Schema<MembershipQueryComputePaymentConfig>;
export interface MembershipModelTrainingPaymentConfig {
  isResponsible: boolean;
}
export const MembershipModelTrainingPaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "MembershipModelTrainingPaymentConfig",
}) as any as S.Schema<MembershipModelTrainingPaymentConfig>;
export interface MembershipModelInferencePaymentConfig {
  isResponsible: boolean;
}
export const MembershipModelInferencePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "MembershipModelInferencePaymentConfig",
}) as any as S.Schema<MembershipModelInferencePaymentConfig>;
export interface MembershipSyntheticDataGenerationPaymentConfig {
  isResponsible: boolean;
}
export const MembershipSyntheticDataGenerationPaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "MembershipSyntheticDataGenerationPaymentConfig",
}) as any as S.Schema<MembershipSyntheticDataGenerationPaymentConfig>;
export interface MembershipMLPaymentConfig {
  modelTraining?: MembershipModelTrainingPaymentConfig;
  modelInference?: MembershipModelInferencePaymentConfig;
  syntheticDataGeneration?: MembershipSyntheticDataGenerationPaymentConfig;
}
export const MembershipMLPaymentConfig = S.suspend(() =>
  S.Struct({
    modelTraining: S.optional(MembershipModelTrainingPaymentConfig),
    modelInference: S.optional(MembershipModelInferencePaymentConfig),
    syntheticDataGeneration: S.optional(
      MembershipSyntheticDataGenerationPaymentConfig,
    ),
  }),
).annotations({
  identifier: "MembershipMLPaymentConfig",
}) as any as S.Schema<MembershipMLPaymentConfig>;
export interface MembershipJobComputePaymentConfig {
  isResponsible: boolean;
}
export const MembershipJobComputePaymentConfig = S.suspend(() =>
  S.Struct({ isResponsible: S.Boolean }),
).annotations({
  identifier: "MembershipJobComputePaymentConfig",
}) as any as S.Schema<MembershipJobComputePaymentConfig>;
export interface MembershipPaymentConfiguration {
  queryCompute: MembershipQueryComputePaymentConfig;
  machineLearning?: MembershipMLPaymentConfig;
  jobCompute?: MembershipJobComputePaymentConfig;
}
export const MembershipPaymentConfiguration = S.suspend(() =>
  S.Struct({
    queryCompute: MembershipQueryComputePaymentConfig,
    machineLearning: S.optional(MembershipMLPaymentConfig),
    jobCompute: S.optional(MembershipJobComputePaymentConfig),
  }),
).annotations({
  identifier: "MembershipPaymentConfiguration",
}) as any as S.Schema<MembershipPaymentConfiguration>;
export interface Membership {
  id: string;
  arn: string;
  collaborationArn: string;
  collaborationId: string;
  collaborationCreatorAccountId: string;
  collaborationCreatorDisplayName: string;
  collaborationName: string;
  createTime: Date;
  updateTime: Date;
  status: string;
  memberAbilities: MemberAbility[];
  mlMemberAbilities?: MLMemberAbilities;
  queryLogStatus: MembershipQueryLogStatus;
  jobLogStatus?: MembershipJobLogStatus;
  defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  defaultJobResultConfiguration?: MembershipProtectedJobResultConfiguration;
  paymentConfiguration: MembershipPaymentConfiguration;
  isMetricsEnabled?: boolean;
}
export const Membership = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationArn: S.String,
    collaborationId: S.String,
    collaborationCreatorAccountId: S.String,
    collaborationCreatorDisplayName: S.String,
    collaborationName: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    memberAbilities: MemberAbilities,
    mlMemberAbilities: S.optional(MLMemberAbilities),
    queryLogStatus: MembershipQueryLogStatus,
    jobLogStatus: S.optional(MembershipJobLogStatus),
    defaultResultConfiguration: S.optional(
      MembershipProtectedQueryResultConfiguration,
    ),
    defaultJobResultConfiguration: S.optional(
      MembershipProtectedJobResultConfiguration,
    ),
    paymentConfiguration: MembershipPaymentConfiguration,
    isMetricsEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Membership" }) as any as S.Schema<Membership>;
export interface UpdateMembershipOutput {
  membership: Membership;
}
export const UpdateMembershipOutput = S.suspend(() =>
  S.Struct({ membership: Membership }),
).annotations({
  identifier: "UpdateMembershipOutput",
}) as any as S.Schema<UpdateMembershipOutput>;
export interface ProtectedJobS3OutputConfigurationOutput {
  bucket: string;
  keyPrefix?: string;
}
export const ProtectedJobS3OutputConfigurationOutput = S.suspend(() =>
  S.Struct({ bucket: S.String, keyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "ProtectedJobS3OutputConfigurationOutput",
}) as any as S.Schema<ProtectedJobS3OutputConfigurationOutput>;
export interface ProtectedJobMemberOutputConfigurationOutput {
  accountId: string;
}
export const ProtectedJobMemberOutputConfigurationOutput = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "ProtectedJobMemberOutputConfigurationOutput",
}) as any as S.Schema<ProtectedJobMemberOutputConfigurationOutput>;
export type ProtectedJobOutputConfigurationOutput =
  | { s3: ProtectedJobS3OutputConfigurationOutput; member?: never }
  | { s3?: never; member: ProtectedJobMemberOutputConfigurationOutput };
export const ProtectedJobOutputConfigurationOutput = S.Union(
  S.Struct({ s3: ProtectedJobS3OutputConfigurationOutput }),
  S.Struct({ member: ProtectedJobMemberOutputConfigurationOutput }),
);
export interface ProtectedJobResultConfigurationOutput {
  outputConfiguration: ProtectedJobOutputConfigurationOutput;
}
export const ProtectedJobResultConfigurationOutput = S.suspend(() =>
  S.Struct({ outputConfiguration: ProtectedJobOutputConfigurationOutput }),
).annotations({
  identifier: "ProtectedJobResultConfigurationOutput",
}) as any as S.Schema<ProtectedJobResultConfigurationOutput>;
export interface BilledJobResourceUtilization {
  units: number;
}
export const BilledJobResourceUtilization = S.suspend(() =>
  S.Struct({ units: S.Number }),
).annotations({
  identifier: "BilledJobResourceUtilization",
}) as any as S.Schema<BilledJobResourceUtilization>;
export interface ProtectedJobStatistics {
  totalDurationInMillis?: number;
  billedResourceUtilization?: BilledJobResourceUtilization;
}
export const ProtectedJobStatistics = S.suspend(() =>
  S.Struct({
    totalDurationInMillis: S.optional(S.Number),
    billedResourceUtilization: S.optional(BilledJobResourceUtilization),
  }),
).annotations({
  identifier: "ProtectedJobStatistics",
}) as any as S.Schema<ProtectedJobStatistics>;
export interface ProtectedJobS3Output {
  location: string;
}
export const ProtectedJobS3Output = S.suspend(() =>
  S.Struct({ location: S.String }),
).annotations({
  identifier: "ProtectedJobS3Output",
}) as any as S.Schema<ProtectedJobS3Output>;
export interface ProtectedJobSingleMemberOutput {
  accountId: string;
}
export const ProtectedJobSingleMemberOutput = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "ProtectedJobSingleMemberOutput",
}) as any as S.Schema<ProtectedJobSingleMemberOutput>;
export type ProtectedJobMemberOutputList = ProtectedJobSingleMemberOutput[];
export const ProtectedJobMemberOutputList = S.Array(
  ProtectedJobSingleMemberOutput,
);
export type ProtectedJobOutput =
  | { s3: ProtectedJobS3Output; memberList?: never }
  | { s3?: never; memberList: ProtectedJobSingleMemberOutput[] };
export const ProtectedJobOutput = S.Union(
  S.Struct({ s3: ProtectedJobS3Output }),
  S.Struct({ memberList: ProtectedJobMemberOutputList }),
);
export interface ProtectedJobResult {
  output: ProtectedJobOutput;
}
export const ProtectedJobResult = S.suspend(() =>
  S.Struct({ output: ProtectedJobOutput }),
).annotations({
  identifier: "ProtectedJobResult",
}) as any as S.Schema<ProtectedJobResult>;
export interface ProtectedJobError {
  message: string;
  code: string;
}
export const ProtectedJobError = S.suspend(() =>
  S.Struct({ message: S.String, code: S.String }),
).annotations({
  identifier: "ProtectedJobError",
}) as any as S.Schema<ProtectedJobError>;
export interface ProtectedJobWorkerComputeConfiguration {
  type: ProtectedJobWorkerComputeType;
  number: number;
}
export const ProtectedJobWorkerComputeConfiguration = S.suspend(() =>
  S.Struct({ type: ProtectedJobWorkerComputeType, number: S.Number }),
).annotations({
  identifier: "ProtectedJobWorkerComputeConfiguration",
}) as any as S.Schema<ProtectedJobWorkerComputeConfiguration>;
export type ProtectedJobComputeConfiguration = {
  worker: ProtectedJobWorkerComputeConfiguration;
};
export const ProtectedJobComputeConfiguration = S.Union(
  S.Struct({ worker: ProtectedJobWorkerComputeConfiguration }),
);
export interface ProtectedJob {
  id: string;
  membershipId: string;
  membershipArn: string;
  createTime: Date;
  jobParameters?: ProtectedJobParameters;
  status: ProtectedJobStatus;
  resultConfiguration?: ProtectedJobResultConfigurationOutput;
  statistics?: ProtectedJobStatistics;
  result?: ProtectedJobResult;
  error?: ProtectedJobError;
  computeConfiguration?: ProtectedJobComputeConfiguration;
}
export const ProtectedJob = S.suspend(() =>
  S.Struct({
    id: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    jobParameters: S.optional(ProtectedJobParameters),
    status: ProtectedJobStatus,
    resultConfiguration: S.optional(ProtectedJobResultConfigurationOutput),
    statistics: S.optional(ProtectedJobStatistics),
    result: S.optional(ProtectedJobResult),
    error: S.optional(ProtectedJobError),
    computeConfiguration: S.optional(ProtectedJobComputeConfiguration),
  }),
).annotations({ identifier: "ProtectedJob" }) as any as S.Schema<ProtectedJob>;
export interface UpdateProtectedJobOutput {
  protectedJob: ProtectedJob;
}
export const UpdateProtectedJobOutput = S.suspend(() =>
  S.Struct({ protectedJob: ProtectedJob }),
).annotations({
  identifier: "UpdateProtectedJobOutput",
}) as any as S.Schema<UpdateProtectedJobOutput>;
export type ParameterMap = { [key: string]: string | undefined };
export const ParameterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ProtectedQuerySQLParameters {
  queryString?: string;
  analysisTemplateArn?: string;
  parameters?: { [key: string]: string | undefined };
}
export const ProtectedQuerySQLParameters = S.suspend(() =>
  S.Struct({
    queryString: S.optional(S.String),
    analysisTemplateArn: S.optional(S.String),
    parameters: S.optional(ParameterMap),
  }),
).annotations({
  identifier: "ProtectedQuerySQLParameters",
}) as any as S.Schema<ProtectedQuerySQLParameters>;
export interface ProtectedQueryMemberOutputConfiguration {
  accountId: string;
}
export const ProtectedQueryMemberOutputConfiguration = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "ProtectedQueryMemberOutputConfiguration",
}) as any as S.Schema<ProtectedQueryMemberOutputConfiguration>;
export type ProtectedQueryDistributeOutputConfigurationLocation =
  | { s3: ProtectedQueryS3OutputConfiguration; member?: never }
  | { s3?: never; member: ProtectedQueryMemberOutputConfiguration };
export const ProtectedQueryDistributeOutputConfigurationLocation = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
  S.Struct({ member: ProtectedQueryMemberOutputConfiguration }),
);
export type ProtectedQueryDistributeOutputConfigurationLocations =
  ProtectedQueryDistributeOutputConfigurationLocation[];
export const ProtectedQueryDistributeOutputConfigurationLocations = S.Array(
  ProtectedQueryDistributeOutputConfigurationLocation,
);
export interface ProtectedQueryDistributeOutputConfiguration {
  locations: ProtectedQueryDistributeOutputConfigurationLocation[];
}
export const ProtectedQueryDistributeOutputConfiguration = S.suspend(() =>
  S.Struct({ locations: ProtectedQueryDistributeOutputConfigurationLocations }),
).annotations({
  identifier: "ProtectedQueryDistributeOutputConfiguration",
}) as any as S.Schema<ProtectedQueryDistributeOutputConfiguration>;
export type ProtectedQueryOutputConfiguration =
  | {
      s3: ProtectedQueryS3OutputConfiguration;
      member?: never;
      distribute?: never;
    }
  | {
      s3?: never;
      member: ProtectedQueryMemberOutputConfiguration;
      distribute?: never;
    }
  | {
      s3?: never;
      member?: never;
      distribute: ProtectedQueryDistributeOutputConfiguration;
    };
export const ProtectedQueryOutputConfiguration = S.Union(
  S.Struct({ s3: ProtectedQueryS3OutputConfiguration }),
  S.Struct({ member: ProtectedQueryMemberOutputConfiguration }),
  S.Struct({ distribute: ProtectedQueryDistributeOutputConfiguration }),
);
export interface ProtectedQueryResultConfiguration {
  outputConfiguration: ProtectedQueryOutputConfiguration;
}
export const ProtectedQueryResultConfiguration = S.suspend(() =>
  S.Struct({ outputConfiguration: ProtectedQueryOutputConfiguration }),
).annotations({
  identifier: "ProtectedQueryResultConfiguration",
}) as any as S.Schema<ProtectedQueryResultConfiguration>;
export interface BilledResourceUtilization {
  units: number;
}
export const BilledResourceUtilization = S.suspend(() =>
  S.Struct({ units: S.Number }),
).annotations({
  identifier: "BilledResourceUtilization",
}) as any as S.Schema<BilledResourceUtilization>;
export interface ProtectedQueryStatistics {
  totalDurationInMillis?: number;
  billedResourceUtilization?: BilledResourceUtilization;
}
export const ProtectedQueryStatistics = S.suspend(() =>
  S.Struct({
    totalDurationInMillis: S.optional(S.Number),
    billedResourceUtilization: S.optional(BilledResourceUtilization),
  }),
).annotations({
  identifier: "ProtectedQueryStatistics",
}) as any as S.Schema<ProtectedQueryStatistics>;
export interface ProtectedQueryS3Output {
  location: string;
}
export const ProtectedQueryS3Output = S.suspend(() =>
  S.Struct({ location: S.String }),
).annotations({
  identifier: "ProtectedQueryS3Output",
}) as any as S.Schema<ProtectedQueryS3Output>;
export interface ProtectedQuerySingleMemberOutput {
  accountId: string;
}
export const ProtectedQuerySingleMemberOutput = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "ProtectedQuerySingleMemberOutput",
}) as any as S.Schema<ProtectedQuerySingleMemberOutput>;
export type ProtectedQueryMemberOutputList = ProtectedQuerySingleMemberOutput[];
export const ProtectedQueryMemberOutputList = S.Array(
  ProtectedQuerySingleMemberOutput,
);
export interface ProtectedQueryDistributeOutput {
  s3?: ProtectedQueryS3Output;
  memberList?: ProtectedQuerySingleMemberOutput[];
}
export const ProtectedQueryDistributeOutput = S.suspend(() =>
  S.Struct({
    s3: S.optional(ProtectedQueryS3Output),
    memberList: S.optional(ProtectedQueryMemberOutputList),
  }),
).annotations({
  identifier: "ProtectedQueryDistributeOutput",
}) as any as S.Schema<ProtectedQueryDistributeOutput>;
export type ProtectedQueryOutput =
  | { s3: ProtectedQueryS3Output; memberList?: never; distribute?: never }
  | {
      s3?: never;
      memberList: ProtectedQuerySingleMemberOutput[];
      distribute?: never;
    }
  | {
      s3?: never;
      memberList?: never;
      distribute: ProtectedQueryDistributeOutput;
    };
export const ProtectedQueryOutput = S.Union(
  S.Struct({ s3: ProtectedQueryS3Output }),
  S.Struct({ memberList: ProtectedQueryMemberOutputList }),
  S.Struct({ distribute: ProtectedQueryDistributeOutput }),
);
export interface ProtectedQueryResult {
  output: ProtectedQueryOutput;
}
export const ProtectedQueryResult = S.suspend(() =>
  S.Struct({ output: ProtectedQueryOutput }),
).annotations({
  identifier: "ProtectedQueryResult",
}) as any as S.Schema<ProtectedQueryResult>;
export interface ProtectedQueryError {
  message: string;
  code: string;
}
export const ProtectedQueryError = S.suspend(() =>
  S.Struct({ message: S.String, code: S.String }),
).annotations({
  identifier: "ProtectedQueryError",
}) as any as S.Schema<ProtectedQueryError>;
export type DifferentialPrivacyAggregationType =
  | "AVG"
  | "COUNT"
  | "COUNT_DISTINCT"
  | "SUM"
  | "STDDEV"
  | (string & {});
export const DifferentialPrivacyAggregationType = S.String;
export interface DifferentialPrivacySensitivityParameters {
  aggregationType: DifferentialPrivacyAggregationType;
  aggregationExpression: string;
  userContributionLimit: number;
  minColumnValue?: number;
  maxColumnValue?: number;
}
export const DifferentialPrivacySensitivityParameters = S.suspend(() =>
  S.Struct({
    aggregationType: DifferentialPrivacyAggregationType,
    aggregationExpression: S.String,
    userContributionLimit: S.Number,
    minColumnValue: S.optional(S.Number),
    maxColumnValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "DifferentialPrivacySensitivityParameters",
}) as any as S.Schema<DifferentialPrivacySensitivityParameters>;
export type DifferentialPrivacySensitivityParametersList =
  DifferentialPrivacySensitivityParameters[];
export const DifferentialPrivacySensitivityParametersList = S.Array(
  DifferentialPrivacySensitivityParameters,
);
export interface DifferentialPrivacyParameters {
  sensitivityParameters: DifferentialPrivacySensitivityParameters[];
}
export const DifferentialPrivacyParameters = S.suspend(() =>
  S.Struct({
    sensitivityParameters: DifferentialPrivacySensitivityParametersList,
  }),
).annotations({
  identifier: "DifferentialPrivacyParameters",
}) as any as S.Schema<DifferentialPrivacyParameters>;
export type SparkProperties = { [key: string]: string | undefined };
export const SparkProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type WorkerComputeConfigurationProperties = {
  spark: { [key: string]: string | undefined };
};
export const WorkerComputeConfigurationProperties = S.Union(
  S.Struct({ spark: SparkProperties }),
);
export interface WorkerComputeConfiguration {
  type?: WorkerComputeType;
  number?: number;
  properties?: WorkerComputeConfigurationProperties;
}
export const WorkerComputeConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(WorkerComputeType),
    number: S.optional(S.Number),
    properties: S.optional(WorkerComputeConfigurationProperties),
  }),
).annotations({
  identifier: "WorkerComputeConfiguration",
}) as any as S.Schema<WorkerComputeConfiguration>;
export type ComputeConfiguration = { worker: WorkerComputeConfiguration };
export const ComputeConfiguration = S.Union(
  S.Struct({ worker: WorkerComputeConfiguration }),
);
export interface ProtectedQuery {
  id: string;
  membershipId: string;
  membershipArn: string;
  createTime: Date;
  sqlParameters?: ProtectedQuerySQLParameters;
  status: string;
  resultConfiguration?: ProtectedQueryResultConfiguration;
  statistics?: ProtectedQueryStatistics;
  result?: ProtectedQueryResult;
  error?: ProtectedQueryError;
  differentialPrivacy?: DifferentialPrivacyParameters;
  computeConfiguration?: ComputeConfiguration;
}
export const ProtectedQuery = S.suspend(() =>
  S.Struct({
    id: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    sqlParameters: S.optional(ProtectedQuerySQLParameters),
    status: S.String,
    resultConfiguration: S.optional(ProtectedQueryResultConfiguration),
    statistics: S.optional(ProtectedQueryStatistics),
    result: S.optional(ProtectedQueryResult),
    error: S.optional(ProtectedQueryError),
    differentialPrivacy: S.optional(DifferentialPrivacyParameters),
    computeConfiguration: S.optional(ComputeConfiguration),
  }),
).annotations({
  identifier: "ProtectedQuery",
}) as any as S.Schema<ProtectedQuery>;
export interface UpdateProtectedQueryOutput {
  protectedQuery: ProtectedQuery;
}
export const UpdateProtectedQueryOutput = S.suspend(() =>
  S.Struct({ protectedQuery: ProtectedQuery }),
).annotations({
  identifier: "UpdateProtectedQueryOutput",
}) as any as S.Schema<UpdateProtectedQueryOutput>;
export interface DifferentialPrivacyPreviewParametersInput {
  epsilon: number;
  usersNoisePerQuery: number;
}
export const DifferentialPrivacyPreviewParametersInput = S.suspend(() =>
  S.Struct({ epsilon: S.Number, usersNoisePerQuery: S.Number }),
).annotations({
  identifier: "DifferentialPrivacyPreviewParametersInput",
}) as any as S.Schema<DifferentialPrivacyPreviewParametersInput>;
export interface DifferentialPrivacyTemplateParametersInput {
  epsilon: number;
  usersNoisePerQuery: number;
}
export const DifferentialPrivacyTemplateParametersInput = S.suspend(() =>
  S.Struct({ epsilon: S.Number, usersNoisePerQuery: S.Number }),
).annotations({
  identifier: "DifferentialPrivacyTemplateParametersInput",
}) as any as S.Schema<DifferentialPrivacyTemplateParametersInput>;
export interface DifferentialPrivacyTemplateUpdateParameters {
  epsilon?: number;
  usersNoisePerQuery?: number;
}
export const DifferentialPrivacyTemplateUpdateParameters = S.suspend(() =>
  S.Struct({
    epsilon: S.optional(S.Number),
    usersNoisePerQuery: S.optional(S.Number),
  }),
).annotations({
  identifier: "DifferentialPrivacyTemplateUpdateParameters",
}) as any as S.Schema<DifferentialPrivacyTemplateUpdateParameters>;
export type AccessBudgetType =
  | "CALENDAR_DAY"
  | "CALENDAR_MONTH"
  | "CALENDAR_WEEK"
  | "LIFETIME"
  | (string & {});
export const AccessBudgetType = S.String;
export type AutoRefreshMode = "ENABLED" | "DISABLED" | (string & {});
export const AutoRefreshMode = S.String;
export interface BudgetParameter {
  type: AccessBudgetType;
  budget: number;
  autoRefresh?: AutoRefreshMode;
}
export const BudgetParameter = S.suspend(() =>
  S.Struct({
    type: AccessBudgetType,
    budget: S.Number,
    autoRefresh: S.optional(AutoRefreshMode),
  }),
).annotations({
  identifier: "BudgetParameter",
}) as any as S.Schema<BudgetParameter>;
export type BudgetParameters = BudgetParameter[];
export const BudgetParameters = S.Array(BudgetParameter);
export interface AccessBudgetsPrivacyTemplateUpdateParameters {
  budgetParameters: BudgetParameter[];
}
export const AccessBudgetsPrivacyTemplateUpdateParameters = S.suspend(() =>
  S.Struct({ budgetParameters: BudgetParameters }),
).annotations({
  identifier: "AccessBudgetsPrivacyTemplateUpdateParameters",
}) as any as S.Schema<AccessBudgetsPrivacyTemplateUpdateParameters>;
export interface AnalysisTemplateSummary {
  arn: string;
  createTime: Date;
  id: string;
  name: string;
  updateTime: Date;
  membershipArn: string;
  membershipId: string;
  collaborationArn: string;
  collaborationId: string;
  description?: string;
  isSyntheticData?: boolean;
}
export const AnalysisTemplateSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    name: S.String,
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    membershipArn: S.String,
    membershipId: S.String,
    collaborationArn: S.String,
    collaborationId: S.String,
    description: S.optional(S.String),
    isSyntheticData: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AnalysisTemplateSummary",
}) as any as S.Schema<AnalysisTemplateSummary>;
export type AnalysisTemplateSummaryList = AnalysisTemplateSummary[];
export const AnalysisTemplateSummaryList = S.Array(AnalysisTemplateSummary);
export interface CollaborationSummary {
  id: string;
  arn: string;
  name: string;
  creatorAccountId: string;
  creatorDisplayName: string;
  createTime: Date;
  updateTime: Date;
  memberStatus: string;
  membershipId?: string;
  membershipArn?: string;
  analyticsEngine?: AnalyticsEngine;
}
export const CollaborationSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    creatorAccountId: S.String,
    creatorDisplayName: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    memberStatus: S.String,
    membershipId: S.optional(S.String),
    membershipArn: S.optional(S.String),
    analyticsEngine: S.optional(AnalyticsEngine),
  }),
).annotations({
  identifier: "CollaborationSummary",
}) as any as S.Schema<CollaborationSummary>;
export type CollaborationSummaryList = CollaborationSummary[];
export const CollaborationSummaryList = S.Array(CollaborationSummary);
export type CollaborationAnalysisTemplateList = CollaborationAnalysisTemplate[];
export const CollaborationAnalysisTemplateList = S.Array(
  CollaborationAnalysisTemplate,
);
export interface BatchGetCollaborationAnalysisTemplateError {
  arn: string;
  code: string;
  message: string;
}
export const BatchGetCollaborationAnalysisTemplateError = S.suspend(() =>
  S.Struct({ arn: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "BatchGetCollaborationAnalysisTemplateError",
}) as any as S.Schema<BatchGetCollaborationAnalysisTemplateError>;
export type BatchGetCollaborationAnalysisTemplateErrorList =
  BatchGetCollaborationAnalysisTemplateError[];
export const BatchGetCollaborationAnalysisTemplateErrorList = S.Array(
  BatchGetCollaborationAnalysisTemplateError,
);
export interface BatchGetSchemaError {
  name: string;
  code: string;
  message: string;
}
export const BatchGetSchemaError = S.suspend(() =>
  S.Struct({ name: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "BatchGetSchemaError",
}) as any as S.Schema<BatchGetSchemaError>;
export type BatchGetSchemaErrorList = BatchGetSchemaError[];
export const BatchGetSchemaErrorList = S.Array(BatchGetSchemaError);
export interface QueryConstraintRequireOverlap {
  columns?: string[];
}
export const QueryConstraintRequireOverlap = S.suspend(() =>
  S.Struct({ columns: S.optional(AnalysisRuleColumnList) }),
).annotations({
  identifier: "QueryConstraintRequireOverlap",
}) as any as S.Schema<QueryConstraintRequireOverlap>;
export type QueryConstraint = { requireOverlap: QueryConstraintRequireOverlap };
export const QueryConstraint = S.Union(
  S.Struct({ requireOverlap: QueryConstraintRequireOverlap }),
);
export type QueryConstraintList = QueryConstraint[];
export const QueryConstraintList = S.Array(QueryConstraint);
export interface AnalysisRuleIdMappingTable {
  joinColumns: string[];
  queryConstraints: QueryConstraint[];
  dimensionColumns?: string[];
}
export const AnalysisRuleIdMappingTable = S.suspend(() =>
  S.Struct({
    joinColumns: AnalysisRuleColumnList,
    queryConstraints: QueryConstraintList,
    dimensionColumns: S.optional(AnalysisRuleColumnList),
  }),
).annotations({
  identifier: "AnalysisRuleIdMappingTable",
}) as any as S.Schema<AnalysisRuleIdMappingTable>;
export type AnalysisRulePolicyV1 =
  | {
      list: AnalysisRuleList;
      aggregation?: never;
      custom?: never;
      idMappingTable?: never;
    }
  | {
      list?: never;
      aggregation: AnalysisRuleAggregation;
      custom?: never;
      idMappingTable?: never;
    }
  | {
      list?: never;
      aggregation?: never;
      custom: AnalysisRuleCustom;
      idMappingTable?: never;
    }
  | {
      list?: never;
      aggregation?: never;
      custom?: never;
      idMappingTable: AnalysisRuleIdMappingTable;
    };
export const AnalysisRulePolicyV1 = S.Union(
  S.Struct({ list: AnalysisRuleList }),
  S.Struct({ aggregation: AnalysisRuleAggregation }),
  S.Struct({ custom: AnalysisRuleCustom }),
  S.Struct({ idMappingTable: AnalysisRuleIdMappingTable }),
);
export type AnalysisRulePolicy = { v1: AnalysisRulePolicyV1 };
export const AnalysisRulePolicy = S.Union(
  S.Struct({ v1: AnalysisRulePolicyV1 }),
);
export interface ConsolidatedPolicyList {
  joinColumns: string[];
  allowedJoinOperators?: string[];
  listColumns: string[];
  additionalAnalyses?: AdditionalAnalyses;
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConsolidatedPolicyList = S.suspend(() =>
  S.Struct({
    joinColumns: AnalysisRuleColumnList,
    allowedJoinOperators: S.optional(JoinOperatorsList),
    listColumns: AnalysisRuleColumnList,
    additionalAnalyses: S.optional(AdditionalAnalyses),
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConsolidatedPolicyList",
}) as any as S.Schema<ConsolidatedPolicyList>;
export interface ConsolidatedPolicyAggregation {
  aggregateColumns: AggregateColumn[];
  joinColumns: string[];
  joinRequired?: string;
  allowedJoinOperators?: string[];
  dimensionColumns: string[];
  scalarFunctions: string[];
  outputConstraints: AggregationConstraint[];
  additionalAnalyses?: AdditionalAnalyses;
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConsolidatedPolicyAggregation = S.suspend(() =>
  S.Struct({
    aggregateColumns: AggregateColumnList,
    joinColumns: AnalysisRuleColumnList,
    joinRequired: S.optional(S.String),
    allowedJoinOperators: S.optional(JoinOperatorsList),
    dimensionColumns: AnalysisRuleColumnList,
    scalarFunctions: ScalarFunctionsList,
    outputConstraints: AggregationConstraints,
    additionalAnalyses: S.optional(AdditionalAnalyses),
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConsolidatedPolicyAggregation",
}) as any as S.Schema<ConsolidatedPolicyAggregation>;
export interface ConsolidatedPolicyCustom {
  allowedAnalyses: string[];
  allowedAnalysisProviders?: string[];
  additionalAnalyses?: AdditionalAnalyses;
  disallowedOutputColumns?: string[];
  differentialPrivacy?: DifferentialPrivacyConfiguration;
  allowedResultReceivers?: string[];
  allowedAdditionalAnalyses?: string[];
}
export const ConsolidatedPolicyCustom = S.suspend(() =>
  S.Struct({
    allowedAnalyses: AllowedAnalysesList,
    allowedAnalysisProviders: S.optional(AllowedAnalysisProviderList),
    additionalAnalyses: S.optional(AdditionalAnalyses),
    disallowedOutputColumns: S.optional(AnalysisRuleColumnList),
    differentialPrivacy: S.optional(DifferentialPrivacyConfiguration),
    allowedResultReceivers: S.optional(AllowedResultReceivers),
    allowedAdditionalAnalyses: S.optional(AllowedAdditionalAnalyses),
  }),
).annotations({
  identifier: "ConsolidatedPolicyCustom",
}) as any as S.Schema<ConsolidatedPolicyCustom>;
export type ConsolidatedPolicyV1 =
  | { list: ConsolidatedPolicyList; aggregation?: never; custom?: never }
  | { list?: never; aggregation: ConsolidatedPolicyAggregation; custom?: never }
  | { list?: never; aggregation?: never; custom: ConsolidatedPolicyCustom };
export const ConsolidatedPolicyV1 = S.Union(
  S.Struct({ list: ConsolidatedPolicyList }),
  S.Struct({ aggregation: ConsolidatedPolicyAggregation }),
  S.Struct({ custom: ConsolidatedPolicyCustom }),
);
export type ConsolidatedPolicy = { v1: ConsolidatedPolicyV1 };
export const ConsolidatedPolicy = S.Union(
  S.Struct({ v1: ConsolidatedPolicyV1 }),
);
export interface AnalysisRule {
  collaborationId: string;
  type: AnalysisRuleType;
  name: string;
  createTime: Date;
  updateTime: Date;
  policy: AnalysisRulePolicy;
  collaborationPolicy?: ConfiguredTableAssociationAnalysisRulePolicy;
  consolidatedPolicy?: ConsolidatedPolicy;
}
export const AnalysisRule = S.suspend(() =>
  S.Struct({
    collaborationId: S.String,
    type: AnalysisRuleType,
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    policy: AnalysisRulePolicy,
    collaborationPolicy: S.optional(
      ConfiguredTableAssociationAnalysisRulePolicy,
    ),
    consolidatedPolicy: S.optional(ConsolidatedPolicy),
  }),
).annotations({ identifier: "AnalysisRule" }) as any as S.Schema<AnalysisRule>;
export type SchemaAnalysisRuleList = AnalysisRule[];
export const SchemaAnalysisRuleList = S.Array(AnalysisRule);
export interface CollaborationConfiguredAudienceModelAssociation {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  configuredAudienceModelArn: string;
  name: string;
  description?: string;
  creatorAccountId: string;
  createTime: Date;
  updateTime: Date;
}
export const CollaborationConfiguredAudienceModelAssociation = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    configuredAudienceModelArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    creatorAccountId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CollaborationConfiguredAudienceModelAssociation",
}) as any as S.Schema<CollaborationConfiguredAudienceModelAssociation>;
export interface CollaborationAnalysisTemplateSummary {
  arn: string;
  createTime: Date;
  id: string;
  name: string;
  updateTime: Date;
  collaborationArn: string;
  collaborationId: string;
  creatorAccountId: string;
  description?: string;
  isSyntheticData?: boolean;
}
export const CollaborationAnalysisTemplateSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    name: S.String,
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    collaborationArn: S.String,
    collaborationId: S.String,
    creatorAccountId: S.String,
    description: S.optional(S.String),
    isSyntheticData: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CollaborationAnalysisTemplateSummary",
}) as any as S.Schema<CollaborationAnalysisTemplateSummary>;
export type CollaborationAnalysisTemplateSummaryList =
  CollaborationAnalysisTemplateSummary[];
export const CollaborationAnalysisTemplateSummaryList = S.Array(
  CollaborationAnalysisTemplateSummary,
);
export interface CollaborationChangeRequestSummary {
  id: string;
  collaborationId: string;
  createTime: Date;
  updateTime: Date;
  status: ChangeRequestStatus;
  isAutoApproved: boolean;
  changes: Change[];
  approvals?: { [key: string]: ApprovalStatusDetails | undefined };
}
export const CollaborationChangeRequestSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    collaborationId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: ChangeRequestStatus,
    isAutoApproved: S.Boolean,
    changes: ChangeList,
    approvals: S.optional(ApprovalStatuses),
  }),
).annotations({
  identifier: "CollaborationChangeRequestSummary",
}) as any as S.Schema<CollaborationChangeRequestSummary>;
export type CollaborationChangeRequestSummaryList =
  CollaborationChangeRequestSummary[];
export const CollaborationChangeRequestSummaryList = S.Array(
  CollaborationChangeRequestSummary,
);
export interface CollaborationConfiguredAudienceModelAssociationSummary {
  arn: string;
  createTime: Date;
  id: string;
  name: string;
  updateTime: Date;
  collaborationArn: string;
  collaborationId: string;
  creatorAccountId: string;
  description?: string;
}
export const CollaborationConfiguredAudienceModelAssociationSummary = S.suspend(
  () =>
    S.Struct({
      arn: S.String,
      createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      id: S.String,
      name: S.String,
      updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      collaborationArn: S.String,
      collaborationId: S.String,
      creatorAccountId: S.String,
      description: S.optional(S.String),
    }),
).annotations({
  identifier: "CollaborationConfiguredAudienceModelAssociationSummary",
}) as any as S.Schema<CollaborationConfiguredAudienceModelAssociationSummary>;
export type CollaborationConfiguredAudienceModelAssociationSummaryList =
  CollaborationConfiguredAudienceModelAssociationSummary[];
export const CollaborationConfiguredAudienceModelAssociationSummaryList =
  S.Array(CollaborationConfiguredAudienceModelAssociationSummary);
export interface CollaborationPrivacyBudgetTemplateSummary {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  creatorAccountId: string;
  privacyBudgetType: PrivacyBudgetType;
  createTime: Date;
  updateTime: Date;
}
export const CollaborationPrivacyBudgetTemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    creatorAccountId: S.String,
    privacyBudgetType: PrivacyBudgetType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CollaborationPrivacyBudgetTemplateSummary",
}) as any as S.Schema<CollaborationPrivacyBudgetTemplateSummary>;
export type CollaborationPrivacyBudgetTemplateSummaryList =
  CollaborationPrivacyBudgetTemplateSummary[];
export const CollaborationPrivacyBudgetTemplateSummaryList = S.Array(
  CollaborationPrivacyBudgetTemplateSummary,
);
export interface MemberSummary {
  accountId: string;
  status: string;
  displayName: string;
  abilities: MemberAbility[];
  mlAbilities?: MLMemberAbilities;
  createTime: Date;
  updateTime: Date;
  membershipId?: string;
  membershipArn?: string;
  paymentConfiguration: PaymentConfiguration;
}
export const MemberSummary = S.suspend(() =>
  S.Struct({
    accountId: S.String,
    status: S.String,
    displayName: S.String,
    abilities: MemberAbilities,
    mlAbilities: S.optional(MLMemberAbilities),
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    membershipId: S.optional(S.String),
    membershipArn: S.optional(S.String),
    paymentConfiguration: PaymentConfiguration,
  }),
).annotations({
  identifier: "MemberSummary",
}) as any as S.Schema<MemberSummary>;
export type MemberSummaryList = MemberSummary[];
export const MemberSummaryList = S.Array(MemberSummary);
export interface SchemaSummary {
  name: string;
  type: SchemaType;
  creatorAccountId: string;
  createTime: Date;
  updateTime: Date;
  collaborationId: string;
  collaborationArn: string;
  analysisRuleTypes: AnalysisRuleType[];
  analysisMethod?: AnalysisMethod;
  resourceArn?: string;
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
}
export const SchemaSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: SchemaType,
    creatorAccountId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    collaborationId: S.String,
    collaborationArn: S.String,
    analysisRuleTypes: AnalysisRuleTypeList,
    analysisMethod: S.optional(AnalysisMethod),
    resourceArn: S.optional(S.String),
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  }),
).annotations({
  identifier: "SchemaSummary",
}) as any as S.Schema<SchemaSummary>;
export type SchemaSummaryList = SchemaSummary[];
export const SchemaSummaryList = S.Array(SchemaSummary);
export interface ConfiguredAudienceModelAssociationSummary {
  membershipId: string;
  membershipArn: string;
  collaborationArn: string;
  collaborationId: string;
  createTime: Date;
  updateTime: Date;
  id: string;
  arn: string;
  name: string;
  configuredAudienceModelArn: string;
  description?: string;
}
export const ConfiguredAudienceModelAssociationSummary = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    membershipArn: S.String,
    collaborationArn: S.String,
    collaborationId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    arn: S.String,
    name: S.String,
    configuredAudienceModelArn: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfiguredAudienceModelAssociationSummary",
}) as any as S.Schema<ConfiguredAudienceModelAssociationSummary>;
export type ConfiguredAudienceModelAssociationSummaryList =
  ConfiguredAudienceModelAssociationSummary[];
export const ConfiguredAudienceModelAssociationSummaryList = S.Array(
  ConfiguredAudienceModelAssociationSummary,
);
export interface ConfiguredTableAssociationSummary {
  configuredTableId: string;
  membershipId: string;
  membershipArn: string;
  name: string;
  createTime: Date;
  updateTime: Date;
  id: string;
  arn: string;
  analysisRuleTypes?: ConfiguredTableAssociationAnalysisRuleType[];
}
export const ConfiguredTableAssociationSummary = S.suspend(() =>
  S.Struct({
    configuredTableId: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    arn: S.String,
    analysisRuleTypes: S.optional(
      ConfiguredTableAssociationAnalysisRuleTypeList,
    ),
  }),
).annotations({
  identifier: "ConfiguredTableAssociationSummary",
}) as any as S.Schema<ConfiguredTableAssociationSummary>;
export type ConfiguredTableAssociationSummaryList =
  ConfiguredTableAssociationSummary[];
export const ConfiguredTableAssociationSummaryList = S.Array(
  ConfiguredTableAssociationSummary,
);
export interface ConfiguredTableSummary {
  id: string;
  arn: string;
  name: string;
  createTime: Date;
  updateTime: Date;
  analysisRuleTypes: ConfiguredTableAnalysisRuleType[];
  analysisMethod: AnalysisMethod;
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
}
export const ConfiguredTableSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    analysisRuleTypes: ConfiguredTableAnalysisRuleTypeList,
    analysisMethod: AnalysisMethod,
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
  }),
).annotations({
  identifier: "ConfiguredTableSummary",
}) as any as S.Schema<ConfiguredTableSummary>;
export type ConfiguredTableSummaryList = ConfiguredTableSummary[];
export const ConfiguredTableSummaryList = S.Array(ConfiguredTableSummary);
export interface IdMappingTableSummary {
  collaborationArn: string;
  collaborationId: string;
  membershipId: string;
  membershipArn: string;
  createTime: Date;
  updateTime: Date;
  id: string;
  arn: string;
  description?: string;
  inputReferenceConfig: IdMappingTableInputReferenceConfig;
  name: string;
}
export const IdMappingTableSummary = S.suspend(() =>
  S.Struct({
    collaborationArn: S.String,
    collaborationId: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    arn: S.String,
    description: S.optional(S.String),
    inputReferenceConfig: IdMappingTableInputReferenceConfig,
    name: S.String,
  }),
).annotations({
  identifier: "IdMappingTableSummary",
}) as any as S.Schema<IdMappingTableSummary>;
export type IdMappingTableSummaryList = IdMappingTableSummary[];
export const IdMappingTableSummaryList = S.Array(IdMappingTableSummary);
export interface IdNamespaceAssociationInputReferencePropertiesSummary {
  idNamespaceType: IdNamespaceType;
}
export const IdNamespaceAssociationInputReferencePropertiesSummary = S.suspend(
  () => S.Struct({ idNamespaceType: IdNamespaceType }),
).annotations({
  identifier: "IdNamespaceAssociationInputReferencePropertiesSummary",
}) as any as S.Schema<IdNamespaceAssociationInputReferencePropertiesSummary>;
export interface IdNamespaceAssociationSummary {
  membershipId: string;
  membershipArn: string;
  collaborationArn: string;
  collaborationId: string;
  createTime: Date;
  updateTime: Date;
  id: string;
  arn: string;
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig;
  name: string;
  description?: string;
  inputReferenceProperties: IdNamespaceAssociationInputReferencePropertiesSummary;
}
export const IdNamespaceAssociationSummary = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    membershipArn: S.String,
    collaborationArn: S.String,
    collaborationId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    arn: S.String,
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    name: S.String,
    description: S.optional(S.String),
    inputReferenceProperties:
      IdNamespaceAssociationInputReferencePropertiesSummary,
  }),
).annotations({
  identifier: "IdNamespaceAssociationSummary",
}) as any as S.Schema<IdNamespaceAssociationSummary>;
export type IdNamespaceAssociationSummaryList = IdNamespaceAssociationSummary[];
export const IdNamespaceAssociationSummaryList = S.Array(
  IdNamespaceAssociationSummary,
);
export interface MembershipSummary {
  id: string;
  arn: string;
  collaborationArn: string;
  collaborationId: string;
  collaborationCreatorAccountId: string;
  collaborationCreatorDisplayName: string;
  collaborationName: string;
  createTime: Date;
  updateTime: Date;
  status: string;
  memberAbilities: MemberAbility[];
  mlMemberAbilities?: MLMemberAbilities;
  paymentConfiguration: MembershipPaymentConfiguration;
}
export const MembershipSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationArn: S.String,
    collaborationId: S.String,
    collaborationCreatorAccountId: S.String,
    collaborationCreatorDisplayName: S.String,
    collaborationName: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    memberAbilities: MemberAbilities,
    mlMemberAbilities: S.optional(MLMemberAbilities),
    paymentConfiguration: MembershipPaymentConfiguration,
  }),
).annotations({
  identifier: "MembershipSummary",
}) as any as S.Schema<MembershipSummary>;
export type MembershipSummaryList = MembershipSummary[];
export const MembershipSummaryList = S.Array(MembershipSummary);
export interface DifferentialPrivacyPrivacyBudgetAggregation {
  type: DifferentialPrivacyAggregationType;
  maxCount: number;
  remainingCount: number;
}
export const DifferentialPrivacyPrivacyBudgetAggregation = S.suspend(() =>
  S.Struct({
    type: DifferentialPrivacyAggregationType,
    maxCount: S.Number,
    remainingCount: S.Number,
  }),
).annotations({
  identifier: "DifferentialPrivacyPrivacyBudgetAggregation",
}) as any as S.Schema<DifferentialPrivacyPrivacyBudgetAggregation>;
export type DifferentialPrivacyPrivacyBudgetAggregationList =
  DifferentialPrivacyPrivacyBudgetAggregation[];
export const DifferentialPrivacyPrivacyBudgetAggregationList = S.Array(
  DifferentialPrivacyPrivacyBudgetAggregation,
);
export interface DifferentialPrivacyPrivacyBudget {
  aggregations: DifferentialPrivacyPrivacyBudgetAggregation[];
  epsilon: number;
}
export const DifferentialPrivacyPrivacyBudget = S.suspend(() =>
  S.Struct({
    aggregations: DifferentialPrivacyPrivacyBudgetAggregationList,
    epsilon: S.Number,
  }),
).annotations({
  identifier: "DifferentialPrivacyPrivacyBudget",
}) as any as S.Schema<DifferentialPrivacyPrivacyBudget>;
export interface AccessBudgetDetails {
  startTime: Date;
  endTime?: Date;
  remainingBudget: number;
  budget: number;
  budgetType: AccessBudgetType;
  autoRefresh?: AutoRefreshMode;
}
export const AccessBudgetDetails = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    remainingBudget: S.Number,
    budget: S.Number,
    budgetType: AccessBudgetType,
    autoRefresh: S.optional(AutoRefreshMode),
  }),
).annotations({
  identifier: "AccessBudgetDetails",
}) as any as S.Schema<AccessBudgetDetails>;
export type AccessBudgetDetailsList = AccessBudgetDetails[];
export const AccessBudgetDetailsList = S.Array(AccessBudgetDetails);
export interface AccessBudget {
  resourceArn: string;
  details: AccessBudgetDetails[];
  aggregateRemainingBudget: number;
}
export const AccessBudget = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    details: AccessBudgetDetailsList,
    aggregateRemainingBudget: S.Number,
  }),
).annotations({ identifier: "AccessBudget" }) as any as S.Schema<AccessBudget>;
export type PrivacyBudget =
  | {
      differentialPrivacy: DifferentialPrivacyPrivacyBudget;
      accessBudget?: never;
    }
  | { differentialPrivacy?: never; accessBudget: AccessBudget };
export const PrivacyBudget = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPrivacyBudget }),
  S.Struct({ accessBudget: AccessBudget }),
);
export interface PrivacyBudgetSummary {
  id: string;
  privacyBudgetTemplateId: string;
  privacyBudgetTemplateArn: string;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  type: PrivacyBudgetType;
  createTime: Date;
  updateTime: Date;
  budget: PrivacyBudget;
}
export const PrivacyBudgetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    privacyBudgetTemplateId: S.String,
    privacyBudgetTemplateArn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    type: PrivacyBudgetType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    budget: PrivacyBudget,
  }),
).annotations({
  identifier: "PrivacyBudgetSummary",
}) as any as S.Schema<PrivacyBudgetSummary>;
export type PrivacyBudgetSummaryList = PrivacyBudgetSummary[];
export const PrivacyBudgetSummaryList = S.Array(PrivacyBudgetSummary);
export type PreviewPrivacyImpactParametersInput = {
  differentialPrivacy: DifferentialPrivacyPreviewParametersInput;
};
export const PreviewPrivacyImpactParametersInput = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPreviewParametersInput }),
);
export interface DifferentialPrivacyTemplateParametersOutput {
  epsilon: number;
  usersNoisePerQuery: number;
}
export const DifferentialPrivacyTemplateParametersOutput = S.suspend(() =>
  S.Struct({ epsilon: S.Number, usersNoisePerQuery: S.Number }),
).annotations({
  identifier: "DifferentialPrivacyTemplateParametersOutput",
}) as any as S.Schema<DifferentialPrivacyTemplateParametersOutput>;
export interface AccessBudgetsPrivacyTemplateParametersOutput {
  budgetParameters: BudgetParameter[];
  resourceArn: string;
}
export const AccessBudgetsPrivacyTemplateParametersOutput = S.suspend(() =>
  S.Struct({ budgetParameters: BudgetParameters, resourceArn: S.String }),
).annotations({
  identifier: "AccessBudgetsPrivacyTemplateParametersOutput",
}) as any as S.Schema<AccessBudgetsPrivacyTemplateParametersOutput>;
export type PrivacyBudgetTemplateParametersOutput =
  | {
      differentialPrivacy: DifferentialPrivacyTemplateParametersOutput;
      accessBudget?: never;
    }
  | {
      differentialPrivacy?: never;
      accessBudget: AccessBudgetsPrivacyTemplateParametersOutput;
    };
export const PrivacyBudgetTemplateParametersOutput = S.Union(
  S.Struct({
    differentialPrivacy: DifferentialPrivacyTemplateParametersOutput,
  }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateParametersOutput }),
);
export interface PrivacyBudgetTemplate {
  id: string;
  arn: string;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  createTime: Date;
  updateTime: Date;
  privacyBudgetType: PrivacyBudgetType;
  autoRefresh: PrivacyBudgetTemplateAutoRefresh;
  parameters: PrivacyBudgetTemplateParametersOutput;
}
export const PrivacyBudgetTemplate = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    privacyBudgetType: PrivacyBudgetType,
    autoRefresh: PrivacyBudgetTemplateAutoRefresh,
    parameters: PrivacyBudgetTemplateParametersOutput,
  }),
).annotations({
  identifier: "PrivacyBudgetTemplate",
}) as any as S.Schema<PrivacyBudgetTemplate>;
export type PrivacyBudgetTemplateUpdateParameters =
  | {
      differentialPrivacy: DifferentialPrivacyTemplateUpdateParameters;
      accessBudget?: never;
    }
  | {
      differentialPrivacy?: never;
      accessBudget: AccessBudgetsPrivacyTemplateUpdateParameters;
    };
export const PrivacyBudgetTemplateUpdateParameters = S.Union(
  S.Struct({
    differentialPrivacy: DifferentialPrivacyTemplateUpdateParameters,
  }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateUpdateParameters }),
);
export interface PrivacyBudgetTemplateSummary {
  id: string;
  arn: string;
  membershipId: string;
  membershipArn: string;
  collaborationId: string;
  collaborationArn: string;
  privacyBudgetType: PrivacyBudgetType;
  createTime: Date;
  updateTime: Date;
}
export const PrivacyBudgetTemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    privacyBudgetType: PrivacyBudgetType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "PrivacyBudgetTemplateSummary",
}) as any as S.Schema<PrivacyBudgetTemplateSummary>;
export type PrivacyBudgetTemplateSummaryList = PrivacyBudgetTemplateSummary[];
export const PrivacyBudgetTemplateSummaryList = S.Array(
  PrivacyBudgetTemplateSummary,
);
export type ProtectedJobAnalysisType = "DIRECT_ANALYSIS" | (string & {});
export const ProtectedJobAnalysisType = S.String;
export interface ProtectedJobMemberOutputConfigurationInput {
  accountId: string;
}
export const ProtectedJobMemberOutputConfigurationInput = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "ProtectedJobMemberOutputConfigurationInput",
}) as any as S.Schema<ProtectedJobMemberOutputConfigurationInput>;
export interface ListAnalysisTemplatesOutput {
  nextToken?: string;
  analysisTemplateSummaries: AnalysisTemplateSummary[];
}
export const ListAnalysisTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    analysisTemplateSummaries: AnalysisTemplateSummaryList,
  }),
).annotations({
  identifier: "ListAnalysisTemplatesOutput",
}) as any as S.Schema<ListAnalysisTemplatesOutput>;
export interface GetCollaborationOutput {
  collaboration: Collaboration;
}
export const GetCollaborationOutput = S.suspend(() =>
  S.Struct({ collaboration: Collaboration }),
).annotations({
  identifier: "GetCollaborationOutput",
}) as any as S.Schema<GetCollaborationOutput>;
export interface ListCollaborationsOutput {
  nextToken?: string;
  collaborationList: CollaborationSummary[];
}
export const ListCollaborationsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationList: CollaborationSummaryList,
  }),
).annotations({
  identifier: "ListCollaborationsOutput",
}) as any as S.Schema<ListCollaborationsOutput>;
export interface BatchGetCollaborationAnalysisTemplateOutput {
  collaborationAnalysisTemplates: CollaborationAnalysisTemplate[];
  errors: BatchGetCollaborationAnalysisTemplateError[];
}
export const BatchGetCollaborationAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({
    collaborationAnalysisTemplates: CollaborationAnalysisTemplateList,
    errors: BatchGetCollaborationAnalysisTemplateErrorList,
  }),
).annotations({
  identifier: "BatchGetCollaborationAnalysisTemplateOutput",
}) as any as S.Schema<BatchGetCollaborationAnalysisTemplateOutput>;
export interface GetCollaborationConfiguredAudienceModelAssociationOutput {
  collaborationConfiguredAudienceModelAssociation: CollaborationConfiguredAudienceModelAssociation;
}
export const GetCollaborationConfiguredAudienceModelAssociationOutput =
  S.suspend(() =>
    S.Struct({
      collaborationConfiguredAudienceModelAssociation:
        CollaborationConfiguredAudienceModelAssociation,
    }),
  ).annotations({
    identifier: "GetCollaborationConfiguredAudienceModelAssociationOutput",
  }) as any as S.Schema<GetCollaborationConfiguredAudienceModelAssociationOutput>;
export interface ListCollaborationAnalysisTemplatesOutput {
  nextToken?: string;
  collaborationAnalysisTemplateSummaries: CollaborationAnalysisTemplateSummary[];
}
export const ListCollaborationAnalysisTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationAnalysisTemplateSummaries:
      CollaborationAnalysisTemplateSummaryList,
  }),
).annotations({
  identifier: "ListCollaborationAnalysisTemplatesOutput",
}) as any as S.Schema<ListCollaborationAnalysisTemplatesOutput>;
export interface ListCollaborationChangeRequestsOutput {
  collaborationChangeRequestSummaries: CollaborationChangeRequestSummary[];
  nextToken?: string;
}
export const ListCollaborationChangeRequestsOutput = S.suspend(() =>
  S.Struct({
    collaborationChangeRequestSummaries: CollaborationChangeRequestSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCollaborationChangeRequestsOutput",
}) as any as S.Schema<ListCollaborationChangeRequestsOutput>;
export interface ListCollaborationConfiguredAudienceModelAssociationsOutput {
  collaborationConfiguredAudienceModelAssociationSummaries: CollaborationConfiguredAudienceModelAssociationSummary[];
  nextToken?: string;
}
export const ListCollaborationConfiguredAudienceModelAssociationsOutput =
  S.suspend(() =>
    S.Struct({
      collaborationConfiguredAudienceModelAssociationSummaries:
        CollaborationConfiguredAudienceModelAssociationSummaryList,
      nextToken: S.optional(S.String),
    }),
  ).annotations({
    identifier: "ListCollaborationConfiguredAudienceModelAssociationsOutput",
  }) as any as S.Schema<ListCollaborationConfiguredAudienceModelAssociationsOutput>;
export interface ListCollaborationPrivacyBudgetTemplatesOutput {
  nextToken?: string;
  collaborationPrivacyBudgetTemplateSummaries: CollaborationPrivacyBudgetTemplateSummary[];
}
export const ListCollaborationPrivacyBudgetTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationPrivacyBudgetTemplateSummaries:
      CollaborationPrivacyBudgetTemplateSummaryList,
  }),
).annotations({
  identifier: "ListCollaborationPrivacyBudgetTemplatesOutput",
}) as any as S.Schema<ListCollaborationPrivacyBudgetTemplatesOutput>;
export interface ListMembersOutput {
  nextToken?: string;
  memberSummaries: MemberSummary[];
}
export const ListMembersOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    memberSummaries: MemberSummaryList,
  }),
).annotations({
  identifier: "ListMembersOutput",
}) as any as S.Schema<ListMembersOutput>;
export interface ListSchemasOutput {
  schemaSummaries: SchemaSummary[];
  nextToken?: string;
}
export const ListSchemasOutput = S.suspend(() =>
  S.Struct({
    schemaSummaries: SchemaSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemasOutput",
}) as any as S.Schema<ListSchemasOutput>;
export interface CreateConfiguredAudienceModelAssociationOutput {
  configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation;
}
export const CreateConfiguredAudienceModelAssociationOutput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociation: ConfiguredAudienceModelAssociation,
  }),
).annotations({
  identifier: "CreateConfiguredAudienceModelAssociationOutput",
}) as any as S.Schema<CreateConfiguredAudienceModelAssociationOutput>;
export interface ListConfiguredAudienceModelAssociationsOutput {
  configuredAudienceModelAssociationSummaries: ConfiguredAudienceModelAssociationSummary[];
  nextToken?: string;
}
export const ListConfiguredAudienceModelAssociationsOutput = S.suspend(() =>
  S.Struct({
    configuredAudienceModelAssociationSummaries:
      ConfiguredAudienceModelAssociationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfiguredAudienceModelAssociationsOutput",
}) as any as S.Schema<ListConfiguredAudienceModelAssociationsOutput>;
export interface CreateConfiguredTableAssociationOutput {
  configuredTableAssociation: ConfiguredTableAssociation;
}
export const CreateConfiguredTableAssociationOutput = S.suspend(() =>
  S.Struct({ configuredTableAssociation: ConfiguredTableAssociation }),
).annotations({
  identifier: "CreateConfiguredTableAssociationOutput",
}) as any as S.Schema<CreateConfiguredTableAssociationOutput>;
export interface ListConfiguredTableAssociationsOutput {
  configuredTableAssociationSummaries: ConfiguredTableAssociationSummary[];
  nextToken?: string;
}
export const ListConfiguredTableAssociationsOutput = S.suspend(() =>
  S.Struct({
    configuredTableAssociationSummaries: ConfiguredTableAssociationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfiguredTableAssociationsOutput",
}) as any as S.Schema<ListConfiguredTableAssociationsOutput>;
export interface GetConfiguredTableAssociationAnalysisRuleOutput {
  analysisRule: ConfiguredTableAssociationAnalysisRule;
}
export const GetConfiguredTableAssociationAnalysisRuleOutput = S.suspend(() =>
  S.Struct({ analysisRule: ConfiguredTableAssociationAnalysisRule }),
).annotations({
  identifier: "GetConfiguredTableAssociationAnalysisRuleOutput",
}) as any as S.Schema<GetConfiguredTableAssociationAnalysisRuleOutput>;
export interface GetConfiguredTableOutput {
  configuredTable: ConfiguredTable;
}
export const GetConfiguredTableOutput = S.suspend(() =>
  S.Struct({ configuredTable: ConfiguredTable }),
).annotations({
  identifier: "GetConfiguredTableOutput",
}) as any as S.Schema<GetConfiguredTableOutput>;
export interface ListConfiguredTablesOutput {
  configuredTableSummaries: ConfiguredTableSummary[];
  nextToken?: string;
}
export const ListConfiguredTablesOutput = S.suspend(() =>
  S.Struct({
    configuredTableSummaries: ConfiguredTableSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfiguredTablesOutput",
}) as any as S.Schema<ListConfiguredTablesOutput>;
export interface GetConfiguredTableAnalysisRuleOutput {
  analysisRule: ConfiguredTableAnalysisRule;
}
export const GetConfiguredTableAnalysisRuleOutput = S.suspend(() =>
  S.Struct({ analysisRule: ConfiguredTableAnalysisRule }),
).annotations({
  identifier: "GetConfiguredTableAnalysisRuleOutput",
}) as any as S.Schema<GetConfiguredTableAnalysisRuleOutput>;
export interface CreateIdMappingTableOutput {
  idMappingTable: IdMappingTable;
}
export const CreateIdMappingTableOutput = S.suspend(() =>
  S.Struct({ idMappingTable: IdMappingTable }),
).annotations({
  identifier: "CreateIdMappingTableOutput",
}) as any as S.Schema<CreateIdMappingTableOutput>;
export interface ListIdMappingTablesOutput {
  idMappingTableSummaries: IdMappingTableSummary[];
  nextToken?: string;
}
export const ListIdMappingTablesOutput = S.suspend(() =>
  S.Struct({
    idMappingTableSummaries: IdMappingTableSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIdMappingTablesOutput",
}) as any as S.Schema<ListIdMappingTablesOutput>;
export interface CreateIdNamespaceAssociationOutput {
  idNamespaceAssociation: IdNamespaceAssociation;
}
export const CreateIdNamespaceAssociationOutput = S.suspend(() =>
  S.Struct({ idNamespaceAssociation: IdNamespaceAssociation }),
).annotations({
  identifier: "CreateIdNamespaceAssociationOutput",
}) as any as S.Schema<CreateIdNamespaceAssociationOutput>;
export interface GetIdNamespaceAssociationOutput {
  idNamespaceAssociation: IdNamespaceAssociation;
}
export const GetIdNamespaceAssociationOutput = S.suspend(() =>
  S.Struct({ idNamespaceAssociation: IdNamespaceAssociation }),
).annotations({
  identifier: "GetIdNamespaceAssociationOutput",
}) as any as S.Schema<GetIdNamespaceAssociationOutput>;
export interface ListIdNamespaceAssociationsOutput {
  nextToken?: string;
  idNamespaceAssociationSummaries: IdNamespaceAssociationSummary[];
}
export const ListIdNamespaceAssociationsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    idNamespaceAssociationSummaries: IdNamespaceAssociationSummaryList,
  }),
).annotations({
  identifier: "ListIdNamespaceAssociationsOutput",
}) as any as S.Schema<ListIdNamespaceAssociationsOutput>;
export interface GetMembershipOutput {
  membership: Membership;
}
export const GetMembershipOutput = S.suspend(() =>
  S.Struct({ membership: Membership }),
).annotations({
  identifier: "GetMembershipOutput",
}) as any as S.Schema<GetMembershipOutput>;
export interface ListMembershipsOutput {
  nextToken?: string;
  membershipSummaries: MembershipSummary[];
}
export const ListMembershipsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    membershipSummaries: MembershipSummaryList,
  }),
).annotations({
  identifier: "ListMembershipsOutput",
}) as any as S.Schema<ListMembershipsOutput>;
export interface ListPrivacyBudgetsOutput {
  privacyBudgetSummaries: PrivacyBudgetSummary[];
  nextToken?: string;
}
export const ListPrivacyBudgetsOutput = S.suspend(() =>
  S.Struct({
    privacyBudgetSummaries: PrivacyBudgetSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPrivacyBudgetsOutput",
}) as any as S.Schema<ListPrivacyBudgetsOutput>;
export interface PreviewPrivacyImpactInput {
  membershipIdentifier: string;
  parameters: PreviewPrivacyImpactParametersInput;
}
export const PreviewPrivacyImpactInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    parameters: PreviewPrivacyImpactParametersInput,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/previewprivacyimpact",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PreviewPrivacyImpactInput",
}) as any as S.Schema<PreviewPrivacyImpactInput>;
export interface GetPrivacyBudgetTemplateOutput {
  privacyBudgetTemplate: PrivacyBudgetTemplate;
}
export const GetPrivacyBudgetTemplateOutput = S.suspend(() =>
  S.Struct({ privacyBudgetTemplate: PrivacyBudgetTemplate }),
).annotations({
  identifier: "GetPrivacyBudgetTemplateOutput",
}) as any as S.Schema<GetPrivacyBudgetTemplateOutput>;
export interface UpdatePrivacyBudgetTemplateInput {
  membershipIdentifier: string;
  privacyBudgetTemplateIdentifier: string;
  privacyBudgetType: PrivacyBudgetType;
  parameters?: PrivacyBudgetTemplateUpdateParameters;
}
export const UpdatePrivacyBudgetTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    privacyBudgetTemplateIdentifier: S.String.pipe(
      T.HttpLabel("privacyBudgetTemplateIdentifier"),
    ),
    privacyBudgetType: PrivacyBudgetType,
    parameters: S.optional(PrivacyBudgetTemplateUpdateParameters),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/privacybudgettemplates/{privacyBudgetTemplateIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePrivacyBudgetTemplateInput",
}) as any as S.Schema<UpdatePrivacyBudgetTemplateInput>;
export interface ListPrivacyBudgetTemplatesOutput {
  nextToken?: string;
  privacyBudgetTemplateSummaries: PrivacyBudgetTemplateSummary[];
}
export const ListPrivacyBudgetTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    privacyBudgetTemplateSummaries: PrivacyBudgetTemplateSummaryList,
  }),
).annotations({
  identifier: "ListPrivacyBudgetTemplatesOutput",
}) as any as S.Schema<ListPrivacyBudgetTemplatesOutput>;
export type ProtectedJobOutputConfigurationInput = {
  member: ProtectedJobMemberOutputConfigurationInput;
};
export const ProtectedJobOutputConfigurationInput = S.Union(
  S.Struct({ member: ProtectedJobMemberOutputConfigurationInput }),
);
export interface AccessBudgetsPrivacyTemplateParametersInput {
  budgetParameters: BudgetParameter[];
  resourceArn: string;
}
export const AccessBudgetsPrivacyTemplateParametersInput = S.suspend(() =>
  S.Struct({ budgetParameters: BudgetParameters, resourceArn: S.String }),
).annotations({
  identifier: "AccessBudgetsPrivacyTemplateParametersInput",
}) as any as S.Schema<AccessBudgetsPrivacyTemplateParametersInput>;
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
export interface BatchGetSchemaAnalysisRuleError {
  name: string;
  type: AnalysisRuleType;
  code: string;
  message: string;
}
export const BatchGetSchemaAnalysisRuleError = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: AnalysisRuleType,
    code: S.String,
    message: S.String,
  }),
).annotations({
  identifier: "BatchGetSchemaAnalysisRuleError",
}) as any as S.Schema<BatchGetSchemaAnalysisRuleError>;
export type BatchGetSchemaAnalysisRuleErrorList =
  BatchGetSchemaAnalysisRuleError[];
export const BatchGetSchemaAnalysisRuleErrorList = S.Array(
  BatchGetSchemaAnalysisRuleError,
);
export interface ChangeInput {
  specificationType: ChangeSpecificationType;
  specification: ChangeSpecification;
}
export const ChangeInput = S.suspend(() =>
  S.Struct({
    specificationType: ChangeSpecificationType,
    specification: ChangeSpecification,
  }),
).annotations({ identifier: "ChangeInput" }) as any as S.Schema<ChangeInput>;
export type ChangeInputList = ChangeInput[];
export const ChangeInputList = S.Array(ChangeInput);
export interface CollaborationIdNamespaceAssociation {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  name: string;
  description?: string;
  creatorAccountId: string;
  createTime: Date;
  updateTime: Date;
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig;
  inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties;
  idMappingConfig?: IdMappingConfig;
}
export const CollaborationIdNamespaceAssociation = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    creatorAccountId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    inputReferenceProperties: IdNamespaceAssociationInputReferenceProperties,
    idMappingConfig: S.optional(IdMappingConfig),
  }),
).annotations({
  identifier: "CollaborationIdNamespaceAssociation",
}) as any as S.Schema<CollaborationIdNamespaceAssociation>;
export interface CollaborationIdNamespaceAssociationSummary {
  arn: string;
  createTime: Date;
  id: string;
  updateTime: Date;
  collaborationArn: string;
  collaborationId: string;
  creatorAccountId: string;
  inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig;
  name: string;
  description?: string;
  inputReferenceProperties: IdNamespaceAssociationInputReferencePropertiesSummary;
}
export const CollaborationIdNamespaceAssociationSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    id: S.String,
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    collaborationArn: S.String,
    collaborationId: S.String,
    creatorAccountId: S.String,
    inputReferenceConfig: IdNamespaceAssociationInputReferenceConfig,
    name: S.String,
    description: S.optional(S.String),
    inputReferenceProperties:
      IdNamespaceAssociationInputReferencePropertiesSummary,
  }),
).annotations({
  identifier: "CollaborationIdNamespaceAssociationSummary",
}) as any as S.Schema<CollaborationIdNamespaceAssociationSummary>;
export type CollaborationIdNamespaceAssociationSummaryList =
  CollaborationIdNamespaceAssociationSummary[];
export const CollaborationIdNamespaceAssociationSummaryList = S.Array(
  CollaborationIdNamespaceAssociationSummary,
);
export interface ProtectedJobResultConfigurationInput {
  outputConfiguration: ProtectedJobOutputConfigurationInput;
}
export const ProtectedJobResultConfigurationInput = S.suspend(() =>
  S.Struct({ outputConfiguration: ProtectedJobOutputConfigurationInput }),
).annotations({
  identifier: "ProtectedJobResultConfigurationInput",
}) as any as S.Schema<ProtectedJobResultConfigurationInput>;
export type PrivacyBudgetTemplateParametersInput =
  | {
      differentialPrivacy: DifferentialPrivacyTemplateParametersInput;
      accessBudget?: never;
    }
  | {
      differentialPrivacy?: never;
      accessBudget: AccessBudgetsPrivacyTemplateParametersInput;
    };
export const PrivacyBudgetTemplateParametersInput = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyTemplateParametersInput }),
  S.Struct({ accessBudget: AccessBudgetsPrivacyTemplateParametersInput }),
);
export interface CreateCollaborationInput {
  members: MemberSpecification[];
  name: string;
  description: string;
  creatorMemberAbilities: MemberAbility[];
  creatorMLMemberAbilities?: MLMemberAbilities;
  creatorDisplayName: string;
  dataEncryptionMetadata?: DataEncryptionMetadata;
  queryLogStatus: CollaborationQueryLogStatus;
  jobLogStatus?: CollaborationJobLogStatus;
  tags?: { [key: string]: string | undefined };
  creatorPaymentConfiguration?: PaymentConfiguration;
  analyticsEngine?: AnalyticsEngine;
  autoApprovedChangeRequestTypes?: AutoApprovedChangeType[];
  allowedResultRegions?: SupportedS3Region[];
  isMetricsEnabled?: boolean;
}
export const CreateCollaborationInput = S.suspend(() =>
  S.Struct({
    members: MemberList,
    name: S.String,
    description: S.String,
    creatorMemberAbilities: MemberAbilities,
    creatorMLMemberAbilities: S.optional(MLMemberAbilities),
    creatorDisplayName: S.String,
    dataEncryptionMetadata: S.optional(DataEncryptionMetadata),
    queryLogStatus: CollaborationQueryLogStatus,
    jobLogStatus: S.optional(CollaborationJobLogStatus),
    tags: S.optional(TagMap),
    creatorPaymentConfiguration: S.optional(PaymentConfiguration),
    analyticsEngine: S.optional(AnalyticsEngine),
    autoApprovedChangeRequestTypes: S.optional(AutoApprovedChangeTypeList),
    allowedResultRegions: S.optional(AllowedResultRegions),
    isMetricsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/collaborations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCollaborationInput",
}) as any as S.Schema<CreateCollaborationInput>;
export interface BatchGetSchemaAnalysisRuleOutput {
  analysisRules: AnalysisRule[];
  errors: BatchGetSchemaAnalysisRuleError[];
}
export const BatchGetSchemaAnalysisRuleOutput = S.suspend(() =>
  S.Struct({
    analysisRules: SchemaAnalysisRuleList,
    errors: BatchGetSchemaAnalysisRuleErrorList,
  }),
).annotations({
  identifier: "BatchGetSchemaAnalysisRuleOutput",
}) as any as S.Schema<BatchGetSchemaAnalysisRuleOutput>;
export interface CreateCollaborationChangeRequestInput {
  collaborationIdentifier: string;
  changes: ChangeInput[];
}
export const CreateCollaborationChangeRequestInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    changes: ChangeInputList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/collaborations/{collaborationIdentifier}/changeRequests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCollaborationChangeRequestInput",
}) as any as S.Schema<CreateCollaborationChangeRequestInput>;
export interface GetCollaborationIdNamespaceAssociationOutput {
  collaborationIdNamespaceAssociation: CollaborationIdNamespaceAssociation;
}
export const GetCollaborationIdNamespaceAssociationOutput = S.suspend(() =>
  S.Struct({
    collaborationIdNamespaceAssociation: CollaborationIdNamespaceAssociation,
  }),
).annotations({
  identifier: "GetCollaborationIdNamespaceAssociationOutput",
}) as any as S.Schema<GetCollaborationIdNamespaceAssociationOutput>;
export interface ListCollaborationIdNamespaceAssociationsOutput {
  nextToken?: string;
  collaborationIdNamespaceAssociationSummaries: CollaborationIdNamespaceAssociationSummary[];
}
export const ListCollaborationIdNamespaceAssociationsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationIdNamespaceAssociationSummaries:
      CollaborationIdNamespaceAssociationSummaryList,
  }),
).annotations({
  identifier: "ListCollaborationIdNamespaceAssociationsOutput",
}) as any as S.Schema<ListCollaborationIdNamespaceAssociationsOutput>;
export interface CreateConfiguredTableAssociationAnalysisRuleInput {
  membershipIdentifier: string;
  configuredTableAssociationIdentifier: string;
  analysisRuleType: ConfiguredTableAssociationAnalysisRuleType;
  analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy;
}
export const CreateConfiguredTableAssociationAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredTableAssociationIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableAssociationIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAssociationAnalysisRuleType,
    analysisRulePolicy: ConfiguredTableAssociationAnalysisRulePolicy,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/configuredTableAssociations/{configuredTableAssociationIdentifier}/analysisRule",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredTableAssociationAnalysisRuleInput",
}) as any as S.Schema<CreateConfiguredTableAssociationAnalysisRuleInput>;
export interface CreateMembershipInput {
  collaborationIdentifier: string;
  queryLogStatus: MembershipQueryLogStatus;
  jobLogStatus?: MembershipJobLogStatus;
  tags?: { [key: string]: string | undefined };
  defaultResultConfiguration?: MembershipProtectedQueryResultConfiguration;
  defaultJobResultConfiguration?: MembershipProtectedJobResultConfiguration;
  paymentConfiguration?: MembershipPaymentConfiguration;
  isMetricsEnabled?: boolean;
}
export const CreateMembershipInput = S.suspend(() =>
  S.Struct({
    collaborationIdentifier: S.String,
    queryLogStatus: MembershipQueryLogStatus,
    jobLogStatus: S.optional(MembershipJobLogStatus),
    tags: S.optional(TagMap),
    defaultResultConfiguration: S.optional(
      MembershipProtectedQueryResultConfiguration,
    ),
    defaultJobResultConfiguration: S.optional(
      MembershipProtectedJobResultConfiguration,
    ),
    paymentConfiguration: S.optional(MembershipPaymentConfiguration),
    isMetricsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memberships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMembershipInput",
}) as any as S.Schema<CreateMembershipInput>;
export type ProtectedJobReceiverAccountIds = string[];
export const ProtectedJobReceiverAccountIds = S.Array(S.String);
export type ReceiverAccountIds = string[];
export const ReceiverAccountIds = S.Array(S.String);
export interface StartProtectedJobInput {
  type: ProtectedJobType;
  membershipIdentifier: string;
  jobParameters: ProtectedJobParameters;
  resultConfiguration?: ProtectedJobResultConfigurationInput;
  computeConfiguration?: ProtectedJobComputeConfiguration;
}
export const StartProtectedJobInput = S.suspend(() =>
  S.Struct({
    type: ProtectedJobType,
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    jobParameters: ProtectedJobParameters,
    resultConfiguration: S.optional(ProtectedJobResultConfigurationInput),
    computeConfiguration: S.optional(ProtectedJobComputeConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/protectedJobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartProtectedJobInput",
}) as any as S.Schema<StartProtectedJobInput>;
export interface CreatePrivacyBudgetTemplateInput {
  membershipIdentifier: string;
  autoRefresh?: PrivacyBudgetTemplateAutoRefresh;
  privacyBudgetType: PrivacyBudgetType;
  parameters: PrivacyBudgetTemplateParametersInput;
  tags?: { [key: string]: string | undefined };
}
export const CreatePrivacyBudgetTemplateInput = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    autoRefresh: S.optional(PrivacyBudgetTemplateAutoRefresh),
    privacyBudgetType: PrivacyBudgetType,
    parameters: PrivacyBudgetTemplateParametersInput,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/privacybudgettemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePrivacyBudgetTemplateInput",
}) as any as S.Schema<CreatePrivacyBudgetTemplateInput>;
export interface UpdatePrivacyBudgetTemplateOutput {
  privacyBudgetTemplate: PrivacyBudgetTemplate;
}
export const UpdatePrivacyBudgetTemplateOutput = S.suspend(() =>
  S.Struct({ privacyBudgetTemplate: PrivacyBudgetTemplate }),
).annotations({
  identifier: "UpdatePrivacyBudgetTemplateOutput",
}) as any as S.Schema<UpdatePrivacyBudgetTemplateOutput>;
export interface ProtectedJobDirectAnalysisConfigurationDetails {
  receiverAccountIds?: string[];
}
export const ProtectedJobDirectAnalysisConfigurationDetails = S.suspend(() =>
  S.Struct({ receiverAccountIds: S.optional(ProtectedJobReceiverAccountIds) }),
).annotations({
  identifier: "ProtectedJobDirectAnalysisConfigurationDetails",
}) as any as S.Schema<ProtectedJobDirectAnalysisConfigurationDetails>;
export interface DirectAnalysisConfigurationDetails {
  receiverAccountIds?: string[];
}
export const DirectAnalysisConfigurationDetails = S.suspend(() =>
  S.Struct({ receiverAccountIds: S.optional(ReceiverAccountIds) }),
).annotations({
  identifier: "DirectAnalysisConfigurationDetails",
}) as any as S.Schema<DirectAnalysisConfigurationDetails>;
export type SchemaList = Schema[];
export const SchemaList = S.Array(Schema);
export interface CollaborationPrivacyBudgetTemplate {
  id: string;
  arn: string;
  collaborationId: string;
  collaborationArn: string;
  creatorAccountId: string;
  createTime: Date;
  updateTime: Date;
  privacyBudgetType: PrivacyBudgetType;
  autoRefresh: PrivacyBudgetTemplateAutoRefresh;
  parameters: PrivacyBudgetTemplateParametersOutput;
}
export const CollaborationPrivacyBudgetTemplate = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    creatorAccountId: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    privacyBudgetType: PrivacyBudgetType,
    autoRefresh: PrivacyBudgetTemplateAutoRefresh,
    parameters: PrivacyBudgetTemplateParametersOutput,
  }),
).annotations({
  identifier: "CollaborationPrivacyBudgetTemplate",
}) as any as S.Schema<CollaborationPrivacyBudgetTemplate>;
export type ProtectedJobConfigurationDetails = {
  directAnalysisConfigurationDetails: ProtectedJobDirectAnalysisConfigurationDetails;
};
export const ProtectedJobConfigurationDetails = S.Union(
  S.Struct({
    directAnalysisConfigurationDetails:
      ProtectedJobDirectAnalysisConfigurationDetails,
  }),
);
export type ConfigurationDetails = {
  directAnalysisConfigurationDetails: DirectAnalysisConfigurationDetails;
};
export const ConfigurationDetails = S.Union(
  S.Struct({
    directAnalysisConfigurationDetails: DirectAnalysisConfigurationDetails,
  }),
);
export interface CreateAnalysisTemplateInput {
  description?: string;
  membershipIdentifier: string;
  name: string;
  format: AnalysisFormat;
  source: AnalysisSource;
  tags?: { [key: string]: string | undefined };
  analysisParameters?: AnalysisParameter[];
  schema?: AnalysisSchema;
  errorMessageConfiguration?: ErrorMessageConfiguration;
  syntheticDataParameters?: SyntheticDataParameters;
}
export const CreateAnalysisTemplateInput = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    format: AnalysisFormat,
    source: AnalysisSource,
    tags: S.optional(TagMap),
    analysisParameters: S.optional(AnalysisParameterList),
    schema: S.optional(AnalysisSchema),
    errorMessageConfiguration: S.optional(ErrorMessageConfiguration),
    syntheticDataParameters: S.optional(SyntheticDataParameters),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/analysistemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAnalysisTemplateInput",
}) as any as S.Schema<CreateAnalysisTemplateInput>;
export interface CreateCollaborationOutput {
  collaboration: Collaboration;
}
export const CreateCollaborationOutput = S.suspend(() =>
  S.Struct({ collaboration: Collaboration }),
).annotations({
  identifier: "CreateCollaborationOutput",
}) as any as S.Schema<CreateCollaborationOutput>;
export interface BatchGetSchemaOutput {
  schemas: Schema[];
  errors: BatchGetSchemaError[];
}
export const BatchGetSchemaOutput = S.suspend(() =>
  S.Struct({ schemas: SchemaList, errors: BatchGetSchemaErrorList }),
).annotations({
  identifier: "BatchGetSchemaOutput",
}) as any as S.Schema<BatchGetSchemaOutput>;
export interface CreateCollaborationChangeRequestOutput {
  collaborationChangeRequest: CollaborationChangeRequest;
}
export const CreateCollaborationChangeRequestOutput = S.suspend(() =>
  S.Struct({ collaborationChangeRequest: CollaborationChangeRequest }),
).annotations({
  identifier: "CreateCollaborationChangeRequestOutput",
}) as any as S.Schema<CreateCollaborationChangeRequestOutput>;
export interface GetCollaborationChangeRequestOutput {
  collaborationChangeRequest: CollaborationChangeRequest;
}
export const GetCollaborationChangeRequestOutput = S.suspend(() =>
  S.Struct({ collaborationChangeRequest: CollaborationChangeRequest }),
).annotations({
  identifier: "GetCollaborationChangeRequestOutput",
}) as any as S.Schema<GetCollaborationChangeRequestOutput>;
export interface GetCollaborationPrivacyBudgetTemplateOutput {
  collaborationPrivacyBudgetTemplate: CollaborationPrivacyBudgetTemplate;
}
export const GetCollaborationPrivacyBudgetTemplateOutput = S.suspend(() =>
  S.Struct({
    collaborationPrivacyBudgetTemplate: CollaborationPrivacyBudgetTemplate,
  }),
).annotations({
  identifier: "GetCollaborationPrivacyBudgetTemplateOutput",
}) as any as S.Schema<GetCollaborationPrivacyBudgetTemplateOutput>;
export interface CreateConfiguredTableAssociationAnalysisRuleOutput {
  analysisRule: ConfiguredTableAssociationAnalysisRule;
}
export const CreateConfiguredTableAssociationAnalysisRuleOutput = S.suspend(
  () => S.Struct({ analysisRule: ConfiguredTableAssociationAnalysisRule }),
).annotations({
  identifier: "CreateConfiguredTableAssociationAnalysisRuleOutput",
}) as any as S.Schema<CreateConfiguredTableAssociationAnalysisRuleOutput>;
export interface CreateConfiguredTableInput {
  name: string;
  description?: string;
  tableReference: TableReference;
  allowedColumns: string[];
  analysisMethod: AnalysisMethod;
  selectedAnalysisMethods?: SelectedAnalysisMethod[];
  tags?: { [key: string]: string | undefined };
}
export const CreateConfiguredTableInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    tableReference: TableReference,
    allowedColumns: AllowedColumnList,
    analysisMethod: AnalysisMethod,
    selectedAnalysisMethods: S.optional(SelectedAnalysisMethods),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configuredTables" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredTableInput",
}) as any as S.Schema<CreateConfiguredTableInput>;
export interface GetIdMappingTableOutput {
  idMappingTable: IdMappingTable;
}
export const GetIdMappingTableOutput = S.suspend(() =>
  S.Struct({ idMappingTable: IdMappingTable }),
).annotations({
  identifier: "GetIdMappingTableOutput",
}) as any as S.Schema<GetIdMappingTableOutput>;
export interface CreateMembershipOutput {
  membership: Membership;
}
export const CreateMembershipOutput = S.suspend(() =>
  S.Struct({ membership: Membership }),
).annotations({
  identifier: "CreateMembershipOutput",
}) as any as S.Schema<CreateMembershipOutput>;
export interface StartProtectedJobOutput {
  protectedJob: ProtectedJob;
}
export const StartProtectedJobOutput = S.suspend(() =>
  S.Struct({ protectedJob: ProtectedJob }),
).annotations({
  identifier: "StartProtectedJobOutput",
}) as any as S.Schema<StartProtectedJobOutput>;
export interface StartProtectedQueryInput {
  type: string;
  membershipIdentifier: string;
  sqlParameters: ProtectedQuerySQLParameters;
  resultConfiguration?: ProtectedQueryResultConfiguration;
  computeConfiguration?: ComputeConfiguration;
}
export const StartProtectedQueryInput = S.suspend(() =>
  S.Struct({
    type: S.String,
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    sqlParameters: ProtectedQuerySQLParameters,
    resultConfiguration: S.optional(ProtectedQueryResultConfiguration),
    computeConfiguration: S.optional(ComputeConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/protectedQueries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartProtectedQueryInput",
}) as any as S.Schema<StartProtectedQueryInput>;
export interface CreatePrivacyBudgetTemplateOutput {
  privacyBudgetTemplate: PrivacyBudgetTemplate;
}
export const CreatePrivacyBudgetTemplateOutput = S.suspend(() =>
  S.Struct({ privacyBudgetTemplate: PrivacyBudgetTemplate }),
).annotations({
  identifier: "CreatePrivacyBudgetTemplateOutput",
}) as any as S.Schema<CreatePrivacyBudgetTemplateOutput>;
export interface ProtectedJobReceiverConfiguration {
  analysisType: ProtectedJobAnalysisType;
  configurationDetails?: ProtectedJobConfigurationDetails;
}
export const ProtectedJobReceiverConfiguration = S.suspend(() =>
  S.Struct({
    analysisType: ProtectedJobAnalysisType,
    configurationDetails: S.optional(ProtectedJobConfigurationDetails),
  }),
).annotations({
  identifier: "ProtectedJobReceiverConfiguration",
}) as any as S.Schema<ProtectedJobReceiverConfiguration>;
export type ProtectedJobReceiverConfigurations =
  ProtectedJobReceiverConfiguration[];
export const ProtectedJobReceiverConfigurations = S.Array(
  ProtectedJobReceiverConfiguration,
);
export interface ReceiverConfiguration {
  analysisType: AnalysisType;
  configurationDetails?: ConfigurationDetails;
}
export const ReceiverConfiguration = S.suspend(() =>
  S.Struct({
    analysisType: AnalysisType,
    configurationDetails: S.optional(ConfigurationDetails),
  }),
).annotations({
  identifier: "ReceiverConfiguration",
}) as any as S.Schema<ReceiverConfiguration>;
export type ReceiverConfigurationsList = ReceiverConfiguration[];
export const ReceiverConfigurationsList = S.Array(ReceiverConfiguration);
export interface CollaborationPrivacyBudgetSummary {
  id: string;
  privacyBudgetTemplateId: string;
  privacyBudgetTemplateArn: string;
  collaborationId: string;
  collaborationArn: string;
  creatorAccountId: string;
  type: PrivacyBudgetType;
  createTime: Date;
  updateTime: Date;
  budget: PrivacyBudget;
}
export const CollaborationPrivacyBudgetSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    privacyBudgetTemplateId: S.String,
    privacyBudgetTemplateArn: S.String,
    collaborationId: S.String,
    collaborationArn: S.String,
    creatorAccountId: S.String,
    type: PrivacyBudgetType,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    budget: PrivacyBudget,
  }),
).annotations({
  identifier: "CollaborationPrivacyBudgetSummary",
}) as any as S.Schema<CollaborationPrivacyBudgetSummary>;
export type CollaborationPrivacyBudgetSummaryList =
  CollaborationPrivacyBudgetSummary[];
export const CollaborationPrivacyBudgetSummaryList = S.Array(
  CollaborationPrivacyBudgetSummary,
);
export interface ProtectedJobSummary {
  id: string;
  membershipId: string;
  membershipArn: string;
  createTime: Date;
  status: ProtectedJobStatus;
  receiverConfigurations: ProtectedJobReceiverConfiguration[];
}
export const ProtectedJobSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: ProtectedJobStatus,
    receiverConfigurations: ProtectedJobReceiverConfigurations,
  }),
).annotations({
  identifier: "ProtectedJobSummary",
}) as any as S.Schema<ProtectedJobSummary>;
export type ProtectedJobSummaryList = ProtectedJobSummary[];
export const ProtectedJobSummaryList = S.Array(ProtectedJobSummary);
export interface ProtectedQuerySummary {
  id: string;
  membershipId: string;
  membershipArn: string;
  createTime: Date;
  status: string;
  receiverConfigurations: ReceiverConfiguration[];
}
export const ProtectedQuerySummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    membershipId: S.String,
    membershipArn: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    receiverConfigurations: ReceiverConfigurationsList,
  }),
).annotations({
  identifier: "ProtectedQuerySummary",
}) as any as S.Schema<ProtectedQuerySummary>;
export type ProtectedQuerySummaryList = ProtectedQuerySummary[];
export const ProtectedQuerySummaryList = S.Array(ProtectedQuerySummary);
export interface DifferentialPrivacyPreviewAggregation {
  type: DifferentialPrivacyAggregationType;
  maxCount: number;
}
export const DifferentialPrivacyPreviewAggregation = S.suspend(() =>
  S.Struct({ type: DifferentialPrivacyAggregationType, maxCount: S.Number }),
).annotations({
  identifier: "DifferentialPrivacyPreviewAggregation",
}) as any as S.Schema<DifferentialPrivacyPreviewAggregation>;
export type DifferentialPrivacyPreviewAggregationList =
  DifferentialPrivacyPreviewAggregation[];
export const DifferentialPrivacyPreviewAggregationList = S.Array(
  DifferentialPrivacyPreviewAggregation,
);
export interface CreateAnalysisTemplateOutput {
  analysisTemplate: AnalysisTemplate;
}
export const CreateAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({ analysisTemplate: AnalysisTemplate }),
).annotations({
  identifier: "CreateAnalysisTemplateOutput",
}) as any as S.Schema<CreateAnalysisTemplateOutput>;
export interface GetAnalysisTemplateOutput {
  analysisTemplate: AnalysisTemplate;
}
export const GetAnalysisTemplateOutput = S.suspend(() =>
  S.Struct({ analysisTemplate: AnalysisTemplate }),
).annotations({
  identifier: "GetAnalysisTemplateOutput",
}) as any as S.Schema<GetAnalysisTemplateOutput>;
export interface ListCollaborationPrivacyBudgetsOutput {
  collaborationPrivacyBudgetSummaries: CollaborationPrivacyBudgetSummary[];
  nextToken?: string;
}
export const ListCollaborationPrivacyBudgetsOutput = S.suspend(() =>
  S.Struct({
    collaborationPrivacyBudgetSummaries: CollaborationPrivacyBudgetSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCollaborationPrivacyBudgetsOutput",
}) as any as S.Schema<ListCollaborationPrivacyBudgetsOutput>;
export interface CreateConfiguredTableOutput {
  configuredTable: ConfiguredTable;
}
export const CreateConfiguredTableOutput = S.suspend(() =>
  S.Struct({ configuredTable: ConfiguredTable }),
).annotations({
  identifier: "CreateConfiguredTableOutput",
}) as any as S.Schema<CreateConfiguredTableOutput>;
export interface CreateConfiguredTableAnalysisRuleInput {
  configuredTableIdentifier: string;
  analysisRuleType: ConfiguredTableAnalysisRuleType;
  analysisRulePolicy: ConfiguredTableAnalysisRulePolicy;
}
export const CreateConfiguredTableAnalysisRuleInput = S.suspend(() =>
  S.Struct({
    configuredTableIdentifier: S.String.pipe(
      T.HttpLabel("configuredTableIdentifier"),
    ),
    analysisRuleType: ConfiguredTableAnalysisRuleType,
    analysisRulePolicy: ConfiguredTableAnalysisRulePolicy,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/configuredTables/{configuredTableIdentifier}/analysisRule",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredTableAnalysisRuleInput",
}) as any as S.Schema<CreateConfiguredTableAnalysisRuleInput>;
export interface GetProtectedJobOutput {
  protectedJob: ProtectedJob;
}
export const GetProtectedJobOutput = S.suspend(() =>
  S.Struct({ protectedJob: ProtectedJob }),
).annotations({
  identifier: "GetProtectedJobOutput",
}) as any as S.Schema<GetProtectedJobOutput>;
export interface GetProtectedQueryOutput {
  protectedQuery: ProtectedQuery;
}
export const GetProtectedQueryOutput = S.suspend(() =>
  S.Struct({ protectedQuery: ProtectedQuery }),
).annotations({
  identifier: "GetProtectedQueryOutput",
}) as any as S.Schema<GetProtectedQueryOutput>;
export interface ListProtectedJobsOutput {
  nextToken?: string;
  protectedJobs: ProtectedJobSummary[];
}
export const ListProtectedJobsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    protectedJobs: ProtectedJobSummaryList,
  }),
).annotations({
  identifier: "ListProtectedJobsOutput",
}) as any as S.Schema<ListProtectedJobsOutput>;
export interface ListProtectedQueriesOutput {
  nextToken?: string;
  protectedQueries: ProtectedQuerySummary[];
}
export const ListProtectedQueriesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    protectedQueries: ProtectedQuerySummaryList,
  }),
).annotations({
  identifier: "ListProtectedQueriesOutput",
}) as any as S.Schema<ListProtectedQueriesOutput>;
export interface StartProtectedQueryOutput {
  protectedQuery: ProtectedQuery;
}
export const StartProtectedQueryOutput = S.suspend(() =>
  S.Struct({ protectedQuery: ProtectedQuery }),
).annotations({
  identifier: "StartProtectedQueryOutput",
}) as any as S.Schema<StartProtectedQueryOutput>;
export interface DifferentialPrivacyPrivacyImpact {
  aggregations: DifferentialPrivacyPreviewAggregation[];
}
export const DifferentialPrivacyPrivacyImpact = S.suspend(() =>
  S.Struct({ aggregations: DifferentialPrivacyPreviewAggregationList }),
).annotations({
  identifier: "DifferentialPrivacyPrivacyImpact",
}) as any as S.Schema<DifferentialPrivacyPrivacyImpact>;
export type PrivacyImpact = {
  differentialPrivacy: DifferentialPrivacyPrivacyImpact;
};
export const PrivacyImpact = S.Union(
  S.Struct({ differentialPrivacy: DifferentialPrivacyPrivacyImpact }),
);
export interface CreateConfiguredTableAnalysisRuleOutput {
  analysisRule: ConfiguredTableAnalysisRule;
}
export const CreateConfiguredTableAnalysisRuleOutput = S.suspend(() =>
  S.Struct({ analysisRule: ConfiguredTableAnalysisRule }),
).annotations({
  identifier: "CreateConfiguredTableAnalysisRuleOutput",
}) as any as S.Schema<CreateConfiguredTableAnalysisRuleOutput>;
export interface PreviewPrivacyImpactOutput {
  privacyImpact: PrivacyImpact;
}
export const PreviewPrivacyImpactOutput = S.suspend(() =>
  S.Struct({ privacyImpact: PrivacyImpact }),
).annotations({
  identifier: "PreviewPrivacyImpactOutput",
}) as any as S.Schema<PreviewPrivacyImpactOutput>;
export interface GetSchemaAnalysisRuleOutput {
  analysisRule: AnalysisRule;
}
export const GetSchemaAnalysisRuleOutput = S.suspend(() =>
  S.Struct({ analysisRule: AnalysisRule }),
).annotations({
  identifier: "GetSchemaAnalysisRuleOutput",
}) as any as S.Schema<GetSchemaAnalysisRuleOutput>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), reason: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    reason: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, quotaName: S.String, quotaValue: S.Number },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes a tag or list of tags from a resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an analysis template.
 */
export const deleteAnalysisTemplate: (
  input: DeleteAnalysisTemplateInput,
) => effect.Effect<
  DeleteAnalysisTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnalysisTemplateInput,
  output: DeleteAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves multiple analysis rule schemas.
 */
export const batchGetSchemaAnalysisRule: (
  input: BatchGetSchemaAnalysisRuleInput,
) => effect.Effect<
  BatchGetSchemaAnalysisRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSchemaAnalysisRuleInput,
  output: BatchGetSchemaAnalysisRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves an ID namespace association from a specific collaboration.
 */
export const getCollaborationIdNamespaceAssociation: (
  input: GetCollaborationIdNamespaceAssociationInput,
) => effect.Effect<
  GetCollaborationIdNamespaceAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationIdNamespaceAssociationInput,
  output: GetCollaborationIdNamespaceAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the ID namespace associations in a collaboration.
 */
export const listCollaborationIdNamespaceAssociations: {
  (
    input: ListCollaborationIdNamespaceAssociationsInput,
  ): effect.Effect<
    ListCollaborationIdNamespaceAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationIdNamespaceAssociationsInput,
  ) => stream.Stream<
    ListCollaborationIdNamespaceAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationIdNamespaceAssociationsInput,
  ) => stream.Stream<
    CollaborationIdNamespaceAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationIdNamespaceAssociationsInput,
  output: ListCollaborationIdNamespaceAssociationsOutput,
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
    items: "collaborationIdNamespaceAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides the details necessary to create a configured audience model association.
 */
export const createConfiguredAudienceModelAssociation: (
  input: CreateConfiguredAudienceModelAssociationInput,
) => effect.Effect<
  CreateConfiguredAudienceModelAssociationOutput,
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
  input: CreateConfiguredAudienceModelAssociationInput,
  output: CreateConfiguredAudienceModelAssociationOutput,
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
 * Updates the privacy budget template for the specified collaboration.
 */
export const updatePrivacyBudgetTemplate: (
  input: UpdatePrivacyBudgetTemplateInput,
) => effect.Effect<
  UpdatePrivacyBudgetTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePrivacyBudgetTemplateInput,
  output: UpdatePrivacyBudgetTemplateOutput,
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
 * Lists all of the tags that have been added to a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Tags a resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists analysis templates that the caller owns.
 */
export const listAnalysisTemplates: {
  (
    input: ListAnalysisTemplatesInput,
  ): effect.Effect<
    ListAnalysisTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnalysisTemplatesInput,
  ) => stream.Stream<
    ListAnalysisTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnalysisTemplatesInput,
  ) => stream.Stream<
    AnalysisTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnalysisTemplatesInput,
  output: ListAnalysisTemplatesOutput,
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
    items: "analysisTemplateSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns metadata about a collaboration.
 */
export const getCollaboration: (
  input: GetCollaborationInput,
) => effect.Effect<
  GetCollaborationOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationInput,
  output: GetCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists collaborations the caller owns, is active in, or has been invited to.
 */
export const listCollaborations: {
  (
    input: ListCollaborationsInput,
  ): effect.Effect<
    ListCollaborationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationsInput,
  ) => stream.Stream<
    ListCollaborationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationsInput,
  ) => stream.Stream<
    CollaborationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationsInput,
  output: ListCollaborationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves multiple analysis templates within a collaboration by their Amazon Resource Names (ARNs).
 */
export const batchGetCollaborationAnalysisTemplate: (
  input: BatchGetCollaborationAnalysisTemplateInput,
) => effect.Effect<
  BatchGetCollaborationAnalysisTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCollaborationAnalysisTemplateInput,
  output: BatchGetCollaborationAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a configured audience model association within a collaboration.
 */
export const getCollaborationConfiguredAudienceModelAssociation: (
  input: GetCollaborationConfiguredAudienceModelAssociationInput,
) => effect.Effect<
  GetCollaborationConfiguredAudienceModelAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationConfiguredAudienceModelAssociationInput,
  output: GetCollaborationConfiguredAudienceModelAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists analysis templates within a collaboration.
 */
export const listCollaborationAnalysisTemplates: {
  (
    input: ListCollaborationAnalysisTemplatesInput,
  ): effect.Effect<
    ListCollaborationAnalysisTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationAnalysisTemplatesInput,
  ) => stream.Stream<
    ListCollaborationAnalysisTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationAnalysisTemplatesInput,
  ) => stream.Stream<
    CollaborationAnalysisTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationAnalysisTemplatesInput,
  output: ListCollaborationAnalysisTemplatesOutput,
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
    items: "collaborationAnalysisTemplateSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all change requests for a collaboration with pagination support. Returns change requests sorted by creation time.
 */
export const listCollaborationChangeRequests: {
  (
    input: ListCollaborationChangeRequestsInput,
  ): effect.Effect<
    ListCollaborationChangeRequestsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationChangeRequestsInput,
  ) => stream.Stream<
    ListCollaborationChangeRequestsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationChangeRequestsInput,
  ) => stream.Stream<
    CollaborationChangeRequestSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationChangeRequestsInput,
  output: ListCollaborationChangeRequestsOutput,
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
    items: "collaborationChangeRequestSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists configured audience model associations within a collaboration.
 */
export const listCollaborationConfiguredAudienceModelAssociations: {
  (
    input: ListCollaborationConfiguredAudienceModelAssociationsInput,
  ): effect.Effect<
    ListCollaborationConfiguredAudienceModelAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationConfiguredAudienceModelAssociationsInput,
  ) => stream.Stream<
    ListCollaborationConfiguredAudienceModelAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationConfiguredAudienceModelAssociationsInput,
  ) => stream.Stream<
    CollaborationConfiguredAudienceModelAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationConfiguredAudienceModelAssociationsInput,
  output: ListCollaborationConfiguredAudienceModelAssociationsOutput,
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
    items: "collaborationConfiguredAudienceModelAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns an array that summarizes each privacy budget template in a specified collaboration.
 */
export const listCollaborationPrivacyBudgetTemplates: {
  (
    input: ListCollaborationPrivacyBudgetTemplatesInput,
  ): effect.Effect<
    ListCollaborationPrivacyBudgetTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationPrivacyBudgetTemplatesInput,
  ) => stream.Stream<
    ListCollaborationPrivacyBudgetTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationPrivacyBudgetTemplatesInput,
  ) => stream.Stream<
    CollaborationPrivacyBudgetTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationPrivacyBudgetTemplatesInput,
  output: ListCollaborationPrivacyBudgetTemplatesOutput,
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
    items: "collaborationPrivacyBudgetTemplateSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all members within a collaboration.
 */
export const listMembers: {
  (
    input: ListMembersInput,
  ): effect.Effect<
    ListMembersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersInput,
  ) => stream.Stream<
    ListMembersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersInput,
  ) => stream.Stream<
    MemberSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersInput,
  output: ListMembersOutput,
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
    items: "memberSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the schemas for relations within a collaboration.
 */
export const listSchemas: {
  (
    input: ListSchemasInput,
  ): effect.Effect<
    ListSchemasOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemasInput,
  ) => stream.Stream<
    ListSchemasOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemasInput,
  ) => stream.Stream<
    SchemaSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemasInput,
  output: ListSchemasOutput,
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
    items: "schemaSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing collaboration change request. This operation allows approval actions for pending change requests in collaborations (APPROVE, DENY, CANCEL, COMMIT).
 *
 * For change requests without automatic approval, a member in the collaboration can manually APPROVE or DENY a change request. The collaboration owner can manually CANCEL or COMMIT a change request.
 */
export const updateCollaborationChangeRequest: (
  input: UpdateCollaborationChangeRequestInput,
) => effect.Effect<
  UpdateCollaborationChangeRequestOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCollaborationChangeRequestInput,
  output: UpdateCollaborationChangeRequestOutput,
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
 * Lists information about requested configured audience model associations.
 */
export const listConfiguredAudienceModelAssociations: {
  (
    input: ListConfiguredAudienceModelAssociationsInput,
  ): effect.Effect<
    ListConfiguredAudienceModelAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredAudienceModelAssociationsInput,
  ) => stream.Stream<
    ListConfiguredAudienceModelAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredAudienceModelAssociationsInput,
  ) => stream.Stream<
    ConfiguredAudienceModelAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredAudienceModelAssociationsInput,
  output: ListConfiguredAudienceModelAssociationsOutput,
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
    items: "configuredAudienceModelAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists configured table associations for a membership.
 */
export const listConfiguredTableAssociations: {
  (
    input: ListConfiguredTableAssociationsInput,
  ): effect.Effect<
    ListConfiguredTableAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredTableAssociationsInput,
  ) => stream.Stream<
    ListConfiguredTableAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredTableAssociationsInput,
  ) => stream.Stream<
    ConfiguredTableAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredTableAssociationsInput,
  output: ListConfiguredTableAssociationsOutput,
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
    items: "configuredTableAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the analysis rule for a configured table association.
 */
export const getConfiguredTableAssociationAnalysisRule: (
  input: GetConfiguredTableAssociationAnalysisRuleInput,
) => effect.Effect<
  GetConfiguredTableAssociationAnalysisRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredTableAssociationAnalysisRuleInput,
  output: GetConfiguredTableAssociationAnalysisRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a configured table.
 */
export const getConfiguredTable: (
  input: GetConfiguredTableInput,
) => effect.Effect<
  GetConfiguredTableOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredTableInput,
  output: GetConfiguredTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists configured tables.
 */
export const listConfiguredTables: {
  (
    input: ListConfiguredTablesInput,
  ): effect.Effect<
    ListConfiguredTablesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredTablesInput,
  ) => stream.Stream<
    ListConfiguredTablesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredTablesInput,
  ) => stream.Stream<
    ConfiguredTableSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredTablesInput,
  output: ListConfiguredTablesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configuredTableSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a configured table analysis rule.
 */
export const getConfiguredTableAnalysisRule: (
  input: GetConfiguredTableAnalysisRuleInput,
) => effect.Effect<
  GetConfiguredTableAnalysisRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredTableAnalysisRuleInput,
  output: GetConfiguredTableAnalysisRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of ID mapping tables.
 */
export const listIdMappingTables: {
  (
    input: ListIdMappingTablesInput,
  ): effect.Effect<
    ListIdMappingTablesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdMappingTablesInput,
  ) => stream.Stream<
    ListIdMappingTablesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdMappingTablesInput,
  ) => stream.Stream<
    IdMappingTableSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdMappingTablesInput,
  output: ListIdMappingTablesOutput,
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
    items: "idMappingTableSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves an ID namespace association.
 */
export const getIdNamespaceAssociation: (
  input: GetIdNamespaceAssociationInput,
) => effect.Effect<
  GetIdNamespaceAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdNamespaceAssociationInput,
  output: GetIdNamespaceAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of ID namespace associations.
 */
export const listIdNamespaceAssociations: {
  (
    input: ListIdNamespaceAssociationsInput,
  ): effect.Effect<
    ListIdNamespaceAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdNamespaceAssociationsInput,
  ) => stream.Stream<
    ListIdNamespaceAssociationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdNamespaceAssociationsInput,
  ) => stream.Stream<
    IdNamespaceAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdNamespaceAssociationsInput,
  output: ListIdNamespaceAssociationsOutput,
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
    items: "idNamespaceAssociationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a specified membership for an identifier.
 */
export const getMembership: (
  input: GetMembershipInput,
) => effect.Effect<
  GetMembershipOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembershipInput,
  output: GetMembershipOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all memberships resources within the caller's account.
 */
export const listMemberships: {
  (
    input: ListMembershipsInput,
  ): effect.Effect<
    ListMembershipsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembershipsInput,
  ) => stream.Stream<
    ListMembershipsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembershipsInput,
  ) => stream.Stream<
    MembershipSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembershipsInput,
  output: ListMembershipsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "membershipSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns detailed information about the privacy budgets in a specified membership.
 */
export const listPrivacyBudgets: {
  (
    input: ListPrivacyBudgetsInput,
  ): effect.Effect<
    ListPrivacyBudgetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrivacyBudgetsInput,
  ) => stream.Stream<
    ListPrivacyBudgetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrivacyBudgetsInput,
  ) => stream.Stream<
    PrivacyBudgetSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrivacyBudgetsInput,
  output: ListPrivacyBudgetsOutput,
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
    items: "privacyBudgetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns details for a specified privacy budget template.
 */
export const getPrivacyBudgetTemplate: (
  input: GetPrivacyBudgetTemplateInput,
) => effect.Effect<
  GetPrivacyBudgetTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrivacyBudgetTemplateInput,
  output: GetPrivacyBudgetTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about the privacy budget templates in a specified membership.
 */
export const listPrivacyBudgetTemplates: {
  (
    input: ListPrivacyBudgetTemplatesInput,
  ): effect.Effect<
    ListPrivacyBudgetTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPrivacyBudgetTemplatesInput,
  ) => stream.Stream<
    ListPrivacyBudgetTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPrivacyBudgetTemplatesInput,
  ) => stream.Stream<
    PrivacyBudgetTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPrivacyBudgetTemplatesInput,
  output: ListPrivacyBudgetTemplatesOutput,
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
    items: "privacyBudgetTemplateSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates collaboration metadata and can only be called by the collaboration owner.
 */
export const updateCollaboration: (
  input: UpdateCollaborationInput,
) => effect.Effect<
  UpdateCollaborationOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCollaborationInput,
  output: UpdateCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves an analysis template within a collaboration.
 */
export const getCollaborationAnalysisTemplate: (
  input: GetCollaborationAnalysisTemplateInput,
) => effect.Effect<
  GetCollaborationAnalysisTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationAnalysisTemplateInput,
  output: GetCollaborationAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the schema for a relation within a collaboration.
 */
export const getSchema: (
  input: GetSchemaInput,
) => effect.Effect<
  GetSchemaOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaInput,
  output: GetSchemaOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a configured audience model association.
 */
export const getConfiguredAudienceModelAssociation: (
  input: GetConfiguredAudienceModelAssociationInput,
) => effect.Effect<
  GetConfiguredAudienceModelAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredAudienceModelAssociationInput,
  output: GetConfiguredAudienceModelAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the details necessary to update a configured audience model association.
 */
export const updateConfiguredAudienceModelAssociation: (
  input: UpdateConfiguredAudienceModelAssociationInput,
) => effect.Effect<
  UpdateConfiguredAudienceModelAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfiguredAudienceModelAssociationInput,
  output: UpdateConfiguredAudienceModelAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a configured table association.
 */
export const getConfiguredTableAssociation: (
  input: GetConfiguredTableAssociationInput,
) => effect.Effect<
  GetConfiguredTableAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredTableAssociationInput,
  output: GetConfiguredTableAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the details that are necessary to update an ID mapping table.
 */
export const updateIdMappingTable: (
  input: UpdateIdMappingTableInput,
) => effect.Effect<
  UpdateIdMappingTableOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdMappingTableInput,
  output: UpdateIdMappingTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the details that are necessary to update an ID namespace association.
 */
export const updateIdNamespaceAssociation: (
  input: UpdateIdNamespaceAssociationInput,
) => effect.Effect<
  UpdateIdNamespaceAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdNamespaceAssociationInput,
  output: UpdateIdNamespaceAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a collaboration. It can only be called by the collaboration owner.
 */
export const deleteCollaboration: (
  input: DeleteCollaborationInput,
) => effect.Effect<
  DeleteCollaborationOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCollaborationInput,
  output: DeleteCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the information necessary to delete a configured audience model association.
 */
export const deleteConfiguredAudienceModelAssociation: (
  input: DeleteConfiguredAudienceModelAssociationInput,
) => effect.Effect<
  DeleteConfiguredAudienceModelAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredAudienceModelAssociationInput,
  output: DeleteConfiguredAudienceModelAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ID mapping table.
 */
export const deleteIdMappingTable: (
  input: DeleteIdMappingTableInput,
) => effect.Effect<
  DeleteIdMappingTableOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdMappingTableInput,
  output: DeleteIdMappingTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an ID namespace association.
 */
export const deleteIdNamespaceAssociation: (
  input: DeleteIdNamespaceAssociationInput,
) => effect.Effect<
  DeleteIdNamespaceAssociationOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdNamespaceAssociationInput,
  output: DeleteIdNamespaceAssociationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a privacy budget template for a specified collaboration.
 */
export const deletePrivacyBudgetTemplate: (
  input: DeletePrivacyBudgetTemplateInput,
) => effect.Effect<
  DeletePrivacyBudgetTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePrivacyBudgetTemplateInput,
  output: DeletePrivacyBudgetTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the analysis template metadata.
 */
export const updateAnalysisTemplate: (
  input: UpdateAnalysisTemplateInput,
) => effect.Effect<
  UpdateAnalysisTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnalysisTemplateInput,
  output: UpdateAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a configured table association.
 */
export const updateConfiguredTableAssociation: (
  input: UpdateConfiguredTableAssociationInput,
) => effect.Effect<
  UpdateConfiguredTableAssociationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfiguredTableAssociationInput,
  output: UpdateConfiguredTableAssociationOutput,
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
 * Updates the analysis rule for a configured table association.
 */
export const updateConfiguredTableAssociationAnalysisRule: (
  input: UpdateConfiguredTableAssociationAnalysisRuleInput,
) => effect.Effect<
  UpdateConfiguredTableAssociationAnalysisRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfiguredTableAssociationAnalysisRuleInput,
  output: UpdateConfiguredTableAssociationAnalysisRuleOutput,
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
 * Updates a configured table analysis rule.
 */
export const updateConfiguredTableAnalysisRule: (
  input: UpdateConfiguredTableAnalysisRuleInput,
) => effect.Effect<
  UpdateConfiguredTableAnalysisRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfiguredTableAnalysisRuleInput,
  output: UpdateConfiguredTableAnalysisRuleOutput,
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
 * Updates a membership.
 */
export const updateMembership: (
  input: UpdateMembershipInput,
) => effect.Effect<
  UpdateMembershipOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMembershipInput,
  output: UpdateMembershipOutput,
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
 * Updates the processing of a currently running job.
 */
export const updateProtectedJob: (
  input: UpdateProtectedJobInput,
) => effect.Effect<
  UpdateProtectedJobOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProtectedJobInput,
  output: UpdateProtectedJobOutput,
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
 * Updates the processing of a currently running query.
 */
export const updateProtectedQuery: (
  input: UpdateProtectedQueryInput,
) => effect.Effect<
  UpdateProtectedQueryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProtectedQueryInput,
  output: UpdateProtectedQueryOutput,
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
 * Removes the specified member from a collaboration. The removed member is placed in the Removed status and can't interact with the collaboration. The removed member's data is inaccessible to active members of the collaboration.
 */
export const deleteMember: (
  input: DeleteMemberInput,
) => effect.Effect<
  DeleteMemberOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemberInput,
  output: DeleteMemberOutput,
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
 * Deletes a configured table association.
 */
export const deleteConfiguredTableAssociation: (
  input: DeleteConfiguredTableAssociationInput,
) => effect.Effect<
  DeleteConfiguredTableAssociationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredTableAssociationInput,
  output: DeleteConfiguredTableAssociationOutput,
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
 * Deletes an analysis rule for a configured table association.
 */
export const deleteConfiguredTableAssociationAnalysisRule: (
  input: DeleteConfiguredTableAssociationAnalysisRuleInput,
) => effect.Effect<
  DeleteConfiguredTableAssociationAnalysisRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredTableAssociationAnalysisRuleInput,
  output: DeleteConfiguredTableAssociationAnalysisRuleOutput,
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
 * Deletes a configured table.
 */
export const deleteConfiguredTable: (
  input: DeleteConfiguredTableInput,
) => effect.Effect<
  DeleteConfiguredTableOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredTableInput,
  output: DeleteConfiguredTableOutput,
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
 * Deletes a configured table analysis rule.
 */
export const deleteConfiguredTableAnalysisRule: (
  input: DeleteConfiguredTableAnalysisRuleInput,
) => effect.Effect<
  DeleteConfiguredTableAnalysisRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredTableAnalysisRuleInput,
  output: DeleteConfiguredTableAnalysisRuleOutput,
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
 * Deletes a specified membership. All resources under a membership must be deleted.
 */
export const deleteMembership: (
  input: DeleteMembershipInput,
) => effect.Effect<
  DeleteMembershipOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembershipInput,
  output: DeleteMembershipOutput,
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
 * Creates a configured table association. A configured table association links a configured table with a collaboration.
 */
export const createConfiguredTableAssociation: (
  input: CreateConfiguredTableAssociationInput,
) => effect.Effect<
  CreateConfiguredTableAssociationOutput,
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
  input: CreateConfiguredTableAssociationInput,
  output: CreateConfiguredTableAssociationOutput,
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
 * Creates an ID mapping table.
 */
export const createIdMappingTable: (
  input: CreateIdMappingTableInput,
) => effect.Effect<
  CreateIdMappingTableOutput,
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
  input: CreateIdMappingTableInput,
  output: CreateIdMappingTableOutput,
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
 * Creates an ID namespace association.
 */
export const createIdNamespaceAssociation: (
  input: CreateIdNamespaceAssociationInput,
) => effect.Effect<
  CreateIdNamespaceAssociationOutput,
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
  input: CreateIdNamespaceAssociationInput,
  output: CreateIdNamespaceAssociationOutput,
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
 * Updates a configured table.
 */
export const updateConfiguredTable: (
  input: UpdateConfiguredTableInput,
) => effect.Effect<
  UpdateConfiguredTableOutput,
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
  input: UpdateConfiguredTableInput,
  output: UpdateConfiguredTableOutput,
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
 * Defines the information that's necessary to populate an ID mapping table.
 */
export const populateIdMappingTable: (
  input: PopulateIdMappingTableInput,
) => effect.Effect<
  PopulateIdMappingTableOutput,
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
  input: PopulateIdMappingTableInput,
  output: PopulateIdMappingTableOutput,
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
 * Creates a new collaboration.
 */
export const createCollaboration: (
  input: CreateCollaborationInput,
) => effect.Effect<
  CreateCollaborationOutput,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCollaborationInput,
  output: CreateCollaborationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves multiple schemas by their identifiers.
 */
export const batchGetSchema: (
  input: BatchGetSchemaInput,
) => effect.Effect<
  BatchGetSchemaOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSchemaInput,
  output: BatchGetSchemaOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new change request to modify an existing collaboration. This enables post-creation modifications to collaborations through a structured API-driven approach.
 */
export const createCollaborationChangeRequest: (
  input: CreateCollaborationChangeRequestInput,
) => effect.Effect<
  CreateCollaborationChangeRequestOutput,
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
  input: CreateCollaborationChangeRequestInput,
  output: CreateCollaborationChangeRequestOutput,
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
 * Retrieves detailed information about a specific collaboration change request.
 */
export const getCollaborationChangeRequest: (
  input: GetCollaborationChangeRequestInput,
) => effect.Effect<
  GetCollaborationChangeRequestOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationChangeRequestInput,
  output: GetCollaborationChangeRequestOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details about a specified privacy budget template.
 */
export const getCollaborationPrivacyBudgetTemplate: (
  input: GetCollaborationPrivacyBudgetTemplateInput,
) => effect.Effect<
  GetCollaborationPrivacyBudgetTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationPrivacyBudgetTemplateInput,
  output: GetCollaborationPrivacyBudgetTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new analysis rule for an associated configured table.
 */
export const createConfiguredTableAssociationAnalysisRule: (
  input: CreateConfiguredTableAssociationAnalysisRuleInput,
) => effect.Effect<
  CreateConfiguredTableAssociationAnalysisRuleOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfiguredTableAssociationAnalysisRuleInput,
  output: CreateConfiguredTableAssociationAnalysisRuleOutput,
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
 * Retrieves an ID mapping table.
 */
export const getIdMappingTable: (
  input: GetIdMappingTableInput,
) => effect.Effect<
  GetIdMappingTableOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdMappingTableInput,
  output: GetIdMappingTableOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a membership for a specific collaboration identifier and joins the collaboration.
 */
export const createMembership: (
  input: CreateMembershipInput,
) => effect.Effect<
  CreateMembershipOutput,
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
  input: CreateMembershipInput,
  output: CreateMembershipOutput,
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
 * Creates a protected job that is started by Clean Rooms.
 */
export const startProtectedJob: (
  input: StartProtectedJobInput,
) => effect.Effect<
  StartProtectedJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProtectedJobInput,
  output: StartProtectedJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a privacy budget template for a specified collaboration. Each collaboration can have only one privacy budget template. If you need to change the privacy budget template, use the UpdatePrivacyBudgetTemplate operation.
 */
export const createPrivacyBudgetTemplate: (
  input: CreatePrivacyBudgetTemplateInput,
) => effect.Effect<
  CreatePrivacyBudgetTemplateOutput,
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
  input: CreatePrivacyBudgetTemplateInput,
  output: CreatePrivacyBudgetTemplateOutput,
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
 * Creates a new analysis template.
 */
export const createAnalysisTemplate: (
  input: CreateAnalysisTemplateInput,
) => effect.Effect<
  CreateAnalysisTemplateOutput,
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
  input: CreateAnalysisTemplateInput,
  output: CreateAnalysisTemplateOutput,
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
 * Retrieves an analysis template.
 */
export const getAnalysisTemplate: (
  input: GetAnalysisTemplateInput,
) => effect.Effect<
  GetAnalysisTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnalysisTemplateInput,
  output: GetAnalysisTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns an array that summarizes each privacy budget in a specified collaboration. The summary includes the collaboration ARN, creation time, creating account, and privacy budget details.
 */
export const listCollaborationPrivacyBudgets: {
  (
    input: ListCollaborationPrivacyBudgetsInput,
  ): effect.Effect<
    ListCollaborationPrivacyBudgetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationPrivacyBudgetsInput,
  ) => stream.Stream<
    ListCollaborationPrivacyBudgetsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationPrivacyBudgetsInput,
  ) => stream.Stream<
    CollaborationPrivacyBudgetSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationPrivacyBudgetsInput,
  output: ListCollaborationPrivacyBudgetsOutput,
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
    items: "collaborationPrivacyBudgetSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new configured table resource.
 */
export const createConfiguredTable: (
  input: CreateConfiguredTableInput,
) => effect.Effect<
  CreateConfiguredTableOutput,
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
  input: CreateConfiguredTableInput,
  output: CreateConfiguredTableOutput,
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
 * Returns job processing metadata.
 */
export const getProtectedJob: (
  input: GetProtectedJobInput,
) => effect.Effect<
  GetProtectedJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectedJobInput,
  output: GetProtectedJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns query processing metadata.
 */
export const getProtectedQuery: (
  input: GetProtectedQueryInput,
) => effect.Effect<
  GetProtectedQueryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectedQueryInput,
  output: GetProtectedQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists protected jobs, sorted by most recent job.
 */
export const listProtectedJobs: {
  (
    input: ListProtectedJobsInput,
  ): effect.Effect<
    ListProtectedJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtectedJobsInput,
  ) => stream.Stream<
    ListProtectedJobsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtectedJobsInput,
  ) => stream.Stream<
    ProtectedJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtectedJobsInput,
  output: ListProtectedJobsOutput,
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
    items: "protectedJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists protected queries, sorted by the most recent query.
 */
export const listProtectedQueries: {
  (
    input: ListProtectedQueriesInput,
  ): effect.Effect<
    ListProtectedQueriesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtectedQueriesInput,
  ) => stream.Stream<
    ListProtectedQueriesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtectedQueriesInput,
  ) => stream.Stream<
    ProtectedQuerySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtectedQueriesInput,
  output: ListProtectedQueriesOutput,
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
    items: "protectedQueries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a protected query that is started by Clean Rooms.
 */
export const startProtectedQuery: (
  input: StartProtectedQueryInput,
) => effect.Effect<
  StartProtectedQueryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProtectedQueryInput,
  output: StartProtectedQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new analysis rule for a configured table. Currently, only one analysis rule can be created for a given configured table.
 */
export const createConfiguredTableAnalysisRule: (
  input: CreateConfiguredTableAnalysisRuleInput,
) => effect.Effect<
  CreateConfiguredTableAnalysisRuleOutput,
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
  input: CreateConfiguredTableAnalysisRuleInput,
  output: CreateConfiguredTableAnalysisRuleOutput,
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
 * An estimate of the number of aggregation functions that the member who can query can run given epsilon and noise parameters.
 */
export const previewPrivacyImpact: (
  input: PreviewPrivacyImpactInput,
) => effect.Effect<
  PreviewPrivacyImpactOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PreviewPrivacyImpactInput,
  output: PreviewPrivacyImpactOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a schema analysis rule.
 */
export const getSchemaAnalysisRule: (
  input: GetSchemaAnalysisRuleInput,
) => effect.Effect<
  GetSchemaAnalysisRuleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaAnalysisRuleInput,
  output: GetSchemaAnalysisRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

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
  sdkId: "resiliencehub",
  serviceShapeName: "AwsResilienceHub",
});
const auth = T.AwsAuthSigv4({ name: "resiliencehub" });
const ver = T.ServiceVersion("2020-04-30");
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
              `https://resiliencehub-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://resiliencehub-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://resiliencehub.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://resiliencehub.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type EntityName = string;
export type EntityDescription = string;
export type ClientToken = string;
export type String255 = string;
export type String2048 = string;
export type AwsRegion = string;
export type CustomerId = string;
export type Uuid = string;
export type EntityVersion = string;
export type NextToken = string;
export type MaxResults = number;
export type AppTemplateBody = string;
export type TagKey = string;
export type SpecReferenceId = string;
export type EntityName255 = string;
export type TagValue = string;
export type IamRoleName = string;
export type IamRoleArn = string;
export type String128WithoutWhitespace = string;
export type String1024 = string;
export type S3Url = string;
export type EksNamespace = string;
export type String500 = string;
export type Seconds = number;
export type ErrorMessage = string;
export type EntityId = string;
export type DocumentName = string;
export type ResourceId = string;
export type ResourceType = string;
export type CurrencyCode = string;
export type RetryAfterSeconds = number;

//# Schemas
export type AppAssessmentScheduleType = "Disabled" | "Daily" | (string & {});
export const AppAssessmentScheduleType = S.String;
export type AppComponentNameList = string[];
export const AppComponentNameList = S.Array(S.String);
export type RecommendationIdList = string[];
export const RecommendationIdList = S.Array(S.String);
export type TemplateFormat = "CfnYaml" | "CfnJson" | (string & {});
export const TemplateFormat = S.String;
export type RenderRecommendationType = "Alarm" | "Sop" | "Test" | (string & {});
export const RenderRecommendationType = S.String;
export type RenderRecommendationTypeList = RenderRecommendationType[];
export const RenderRecommendationTypeList = S.Array(RenderRecommendationType);
export type DataLocationConstraint =
  | "AnyLocation"
  | "SameContinent"
  | "SameCountry"
  | (string & {});
export const DataLocationConstraint = S.String;
export type ResiliencyPolicyTier =
  | "MissionCritical"
  | "Critical"
  | "Important"
  | "CoreServices"
  | "NonCritical"
  | "NotApplicable"
  | (string & {});
export const ResiliencyPolicyTier = S.String;
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export interface TerraformSource {
  s3StateFileUrl: string;
}
export const TerraformSource = S.suspend(() =>
  S.Struct({ s3StateFileUrl: S.String }),
).annotations({
  identifier: "TerraformSource",
}) as any as S.Schema<TerraformSource>;
export type TerraformSourceList = TerraformSource[];
export const TerraformSourceList = S.Array(TerraformSource);
export type ResourceImportStrategyType =
  | "AddOnly"
  | "ReplaceAll"
  | (string & {});
export const ResourceImportStrategyType = S.String;
export type AssessmentStatus =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const AssessmentStatus = S.String;
export type AssessmentStatusList = AssessmentStatus[];
export const AssessmentStatusList = S.Array(AssessmentStatus);
export type ComplianceStatus =
  | "PolicyBreached"
  | "PolicyMet"
  | "NotApplicable"
  | "MissingPolicy"
  | (string & {});
export const ComplianceStatus = S.String;
export type AssessmentInvoker = "User" | "System" | (string & {});
export const AssessmentInvoker = S.String;
export type RecommendationTemplateStatus =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const RecommendationTemplateStatus = S.String;
export type RecommendationTemplateStatusList = RecommendationTemplateStatus[];
export const RecommendationTemplateStatusList = S.Array(
  RecommendationTemplateStatus,
);
export type EntityNameList = string[];
export const EntityNameList = S.Array(S.String);
export type String255List = string[];
export const String255List = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateRecommendationTemplateRequest {
  recommendationIds?: string[];
  format?: TemplateFormat;
  recommendationTypes?: RenderRecommendationType[];
  assessmentArn: string;
  name: string;
  clientToken?: string;
  tags?: { [key: string]: string | undefined };
  bucketName?: string;
}
export const CreateRecommendationTemplateRequest = S.suspend(() =>
  S.Struct({
    recommendationIds: S.optional(RecommendationIdList),
    format: S.optional(TemplateFormat),
    recommendationTypes: S.optional(RenderRecommendationTypeList),
    assessmentArn: S.String,
    name: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
    bucketName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-recommendation-template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecommendationTemplateRequest",
}) as any as S.Schema<CreateRecommendationTemplateRequest>;
export interface DeleteAppRequest {
  appArn: string;
  forceDelete?: boolean;
  clientToken?: string;
}
export const DeleteAppRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    forceDelete: S.optional(S.Boolean),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-app" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppRequest",
}) as any as S.Schema<DeleteAppRequest>;
export interface DeleteAppAssessmentRequest {
  assessmentArn: string;
  clientToken?: string;
}
export const DeleteAppAssessmentRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-app-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppAssessmentRequest",
}) as any as S.Schema<DeleteAppAssessmentRequest>;
export interface DeleteAppVersionAppComponentRequest {
  appArn: string;
  id: string;
  clientToken?: string;
}
export const DeleteAppVersionAppComponentRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    id: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-app-version-app-component" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppVersionAppComponentRequest",
}) as any as S.Schema<DeleteAppVersionAppComponentRequest>;
export interface LogicalResourceId {
  identifier: string;
  logicalStackName?: string;
  resourceGroupName?: string;
  terraformSourceName?: string;
  eksSourceName?: string;
}
export const LogicalResourceId = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    logicalStackName: S.optional(S.String),
    resourceGroupName: S.optional(S.String),
    terraformSourceName: S.optional(S.String),
    eksSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "LogicalResourceId",
}) as any as S.Schema<LogicalResourceId>;
export interface DeleteAppVersionResourceRequest {
  appArn: string;
  resourceName?: string;
  logicalResourceId?: LogicalResourceId;
  physicalResourceId?: string;
  awsRegion?: string;
  awsAccountId?: string;
  clientToken?: string;
}
export const DeleteAppVersionResourceRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-app-version-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppVersionResourceRequest",
}) as any as S.Schema<DeleteAppVersionResourceRequest>;
export interface DeleteRecommendationTemplateRequest {
  recommendationTemplateArn: string;
  clientToken?: string;
}
export const DeleteRecommendationTemplateRequest = S.suspend(() =>
  S.Struct({
    recommendationTemplateArn: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-recommendation-template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecommendationTemplateRequest",
}) as any as S.Schema<DeleteRecommendationTemplateRequest>;
export interface DeleteResiliencyPolicyRequest {
  policyArn: string;
  clientToken?: string;
}
export const DeleteResiliencyPolicyRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-resiliency-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResiliencyPolicyRequest",
}) as any as S.Schema<DeleteResiliencyPolicyRequest>;
export interface DescribeAppRequest {
  appArn: string;
}
export const DescribeAppRequest = S.suspend(() =>
  S.Struct({ appArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppRequest",
}) as any as S.Schema<DescribeAppRequest>;
export interface DescribeAppAssessmentRequest {
  assessmentArn: string;
}
export const DescribeAppAssessmentRequest = S.suspend(() =>
  S.Struct({ assessmentArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppAssessmentRequest",
}) as any as S.Schema<DescribeAppAssessmentRequest>;
export interface DescribeAppVersionRequest {
  appArn: string;
  appVersion: string;
}
export const DescribeAppVersionRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, appVersion: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app-version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppVersionRequest",
}) as any as S.Schema<DescribeAppVersionRequest>;
export interface DescribeAppVersionAppComponentRequest {
  appArn: string;
  appVersion: string;
  id: string;
}
export const DescribeAppVersionAppComponentRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, appVersion: S.String, id: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app-version-app-component" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppVersionAppComponentRequest",
}) as any as S.Schema<DescribeAppVersionAppComponentRequest>;
export interface DescribeAppVersionResourceRequest {
  appArn: string;
  appVersion: string;
  resourceName?: string;
  logicalResourceId?: LogicalResourceId;
  physicalResourceId?: string;
  awsRegion?: string;
  awsAccountId?: string;
}
export const DescribeAppVersionResourceRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app-version-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppVersionResourceRequest",
}) as any as S.Schema<DescribeAppVersionResourceRequest>;
export interface DescribeAppVersionResourcesResolutionStatusRequest {
  appArn: string;
  appVersion: string;
  resolutionId?: string;
}
export const DescribeAppVersionResourcesResolutionStatusRequest = S.suspend(
  () =>
    S.Struct({
      appArn: S.String,
      appVersion: S.String,
      resolutionId: S.optional(S.String),
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/describe-app-version-resources-resolution-status",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeAppVersionResourcesResolutionStatusRequest",
}) as any as S.Schema<DescribeAppVersionResourcesResolutionStatusRequest>;
export interface DescribeAppVersionTemplateRequest {
  appArn: string;
  appVersion: string;
}
export const DescribeAppVersionTemplateRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, appVersion: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-app-version-template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAppVersionTemplateRequest",
}) as any as S.Schema<DescribeAppVersionTemplateRequest>;
export interface DescribeDraftAppVersionResourcesImportStatusRequest {
  appArn: string;
}
export const DescribeDraftAppVersionResourcesImportStatusRequest = S.suspend(
  () =>
    S.Struct({ appArn: S.String }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/describe-draft-app-version-resources-import-status",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeDraftAppVersionResourcesImportStatusRequest",
}) as any as S.Schema<DescribeDraftAppVersionResourcesImportStatusRequest>;
export interface DescribeMetricsExportRequest {
  metricsExportId: string;
}
export const DescribeMetricsExportRequest = S.suspend(() =>
  S.Struct({ metricsExportId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-metrics-export" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMetricsExportRequest",
}) as any as S.Schema<DescribeMetricsExportRequest>;
export interface DescribeResiliencyPolicyRequest {
  policyArn: string;
}
export const DescribeResiliencyPolicyRequest = S.suspend(() =>
  S.Struct({ policyArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describe-resiliency-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResiliencyPolicyRequest",
}) as any as S.Schema<DescribeResiliencyPolicyRequest>;
export interface DescribeResourceGroupingRecommendationTaskRequest {
  appArn: string;
  groupingId?: string;
}
export const DescribeResourceGroupingRecommendationTaskRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, groupingId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/describe-resource-grouping-recommendation-task",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResourceGroupingRecommendationTaskRequest",
}) as any as S.Schema<DescribeResourceGroupingRecommendationTaskRequest>;
export interface ListAlarmRecommendationsRequest {
  assessmentArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAlarmRecommendationsRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-alarm-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAlarmRecommendationsRequest",
}) as any as S.Schema<ListAlarmRecommendationsRequest>;
export interface ListAppAssessmentComplianceDriftsRequest {
  assessmentArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppAssessmentComplianceDriftsRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-assessment-compliance-drifts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppAssessmentComplianceDriftsRequest",
}) as any as S.Schema<ListAppAssessmentComplianceDriftsRequest>;
export interface ListAppAssessmentResourceDriftsRequest {
  assessmentArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppAssessmentResourceDriftsRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-assessment-resource-drifts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppAssessmentResourceDriftsRequest",
}) as any as S.Schema<ListAppAssessmentResourceDriftsRequest>;
export interface ListAppAssessmentsRequest {
  appArn?: string;
  assessmentName?: string;
  assessmentStatus?: AssessmentStatus[];
  complianceStatus?: ComplianceStatus;
  invoker?: AssessmentInvoker;
  reverseOrder?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppAssessmentsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    assessmentName: S.optional(S.String).pipe(T.HttpQuery("assessmentName")),
    assessmentStatus: S.optional(AssessmentStatusList).pipe(
      T.HttpQuery("assessmentStatus"),
    ),
    complianceStatus: S.optional(ComplianceStatus).pipe(
      T.HttpQuery("complianceStatus"),
    ),
    invoker: S.optional(AssessmentInvoker).pipe(T.HttpQuery("invoker")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-app-assessments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppAssessmentsRequest",
}) as any as S.Schema<ListAppAssessmentsRequest>;
export interface ListAppComponentCompliancesRequest {
  nextToken?: string;
  maxResults?: number;
  assessmentArn: string;
}
export const ListAppComponentCompliancesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-component-compliances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppComponentCompliancesRequest",
}) as any as S.Schema<ListAppComponentCompliancesRequest>;
export interface ListAppComponentRecommendationsRequest {
  assessmentArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppComponentRecommendationsRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-component-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppComponentRecommendationsRequest",
}) as any as S.Schema<ListAppComponentRecommendationsRequest>;
export interface ListAppInputSourcesRequest {
  appArn: string;
  appVersion: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppInputSourcesRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-input-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppInputSourcesRequest",
}) as any as S.Schema<ListAppInputSourcesRequest>;
export interface ListAppsRequest {
  nextToken?: string;
  maxResults?: number;
  name?: string;
  appArn?: string;
  fromLastAssessmentTime?: Date;
  toLastAssessmentTime?: Date;
  reverseOrder?: boolean;
  awsApplicationArn?: string;
}
export const ListAppsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    fromLastAssessmentTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("fromLastAssessmentTime")),
    toLastAssessmentTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("toLastAssessmentTime")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    awsApplicationArn: S.optional(S.String).pipe(
      T.HttpQuery("awsApplicationArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-apps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppsRequest",
}) as any as S.Schema<ListAppsRequest>;
export interface ListAppVersionAppComponentsRequest {
  appArn: string;
  appVersion: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppVersionAppComponentsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-version-app-components" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppVersionAppComponentsRequest",
}) as any as S.Schema<ListAppVersionAppComponentsRequest>;
export interface ListAppVersionResourceMappingsRequest {
  appArn: string;
  appVersion: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppVersionResourceMappingsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-version-resource-mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppVersionResourceMappingsRequest",
}) as any as S.Schema<ListAppVersionResourceMappingsRequest>;
export interface ListAppVersionResourcesRequest {
  appArn: string;
  appVersion: string;
  resolutionId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAppVersionResourcesRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-version-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppVersionResourcesRequest",
}) as any as S.Schema<ListAppVersionResourcesRequest>;
export interface ListAppVersionsRequest {
  appArn: string;
  nextToken?: string;
  maxResults?: number;
  startTime?: Date;
  endTime?: Date;
}
export const ListAppVersionsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-app-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppVersionsRequest",
}) as any as S.Schema<ListAppVersionsRequest>;
export interface ListRecommendationTemplatesRequest {
  assessmentArn?: string;
  reverseOrder?: boolean;
  status?: RecommendationTemplateStatus[];
  recommendationTemplateArn?: string;
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRecommendationTemplatesRequest = S.suspend(() =>
  S.Struct({
    assessmentArn: S.optional(S.String).pipe(T.HttpQuery("assessmentArn")),
    reverseOrder: S.optional(S.Boolean).pipe(T.HttpQuery("reverseOrder")),
    status: S.optional(RecommendationTemplateStatusList).pipe(
      T.HttpQuery("status"),
    ),
    recommendationTemplateArn: S.optional(S.String).pipe(
      T.HttpQuery("recommendationTemplateArn"),
    ),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-recommendation-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommendationTemplatesRequest",
}) as any as S.Schema<ListRecommendationTemplatesRequest>;
export interface ListResiliencyPoliciesRequest {
  policyName?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListResiliencyPoliciesRequest = S.suspend(() =>
  S.Struct({
    policyName: S.optional(S.String).pipe(T.HttpQuery("policyName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-resiliency-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResiliencyPoliciesRequest",
}) as any as S.Schema<ListResiliencyPoliciesRequest>;
export interface ListResourceGroupingRecommendationsRequest {
  appArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListResourceGroupingRecommendationsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String).pipe(T.HttpQuery("appArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-resource-grouping-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceGroupingRecommendationsRequest",
}) as any as S.Schema<ListResourceGroupingRecommendationsRequest>;
export interface ListSopRecommendationsRequest {
  nextToken?: string;
  maxResults?: number;
  assessmentArn: string;
}
export const ListSopRecommendationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-sop-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSopRecommendationsRequest",
}) as any as S.Schema<ListSopRecommendationsRequest>;
export interface ListSuggestedResiliencyPoliciesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSuggestedResiliencyPoliciesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-suggested-resiliency-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSuggestedResiliencyPoliciesRequest",
}) as any as S.Schema<ListSuggestedResiliencyPoliciesRequest>;
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
export interface ListTestRecommendationsRequest {
  nextToken?: string;
  maxResults?: number;
  assessmentArn: string;
}
export const ListTestRecommendationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    assessmentArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-test-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTestRecommendationsRequest",
}) as any as S.Schema<ListTestRecommendationsRequest>;
export interface ListUnsupportedAppVersionResourcesRequest {
  appArn: string;
  appVersion: string;
  resolutionId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListUnsupportedAppVersionResourcesRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/list-unsupported-app-version-resources",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUnsupportedAppVersionResourcesRequest",
}) as any as S.Schema<ListUnsupportedAppVersionResourcesRequest>;
export interface PublishAppVersionRequest {
  appArn: string;
  versionName?: string;
}
export const PublishAppVersionRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, versionName: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/publish-app-version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishAppVersionRequest",
}) as any as S.Schema<PublishAppVersionRequest>;
export interface PutDraftAppVersionTemplateRequest {
  appArn: string;
  appTemplateBody: string;
}
export const PutDraftAppVersionTemplateRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, appTemplateBody: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/put-draft-app-version-template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDraftAppVersionTemplateRequest",
}) as any as S.Schema<PutDraftAppVersionTemplateRequest>;
export interface RemoveDraftAppVersionResourceMappingsRequest {
  appArn: string;
  resourceNames?: string[];
  logicalStackNames?: string[];
  appRegistryAppNames?: string[];
  resourceGroupNames?: string[];
  terraformSourceNames?: string[];
  eksSourceNames?: string[];
}
export const RemoveDraftAppVersionResourceMappingsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    resourceNames: S.optional(EntityNameList),
    logicalStackNames: S.optional(String255List),
    appRegistryAppNames: S.optional(EntityNameList),
    resourceGroupNames: S.optional(EntityNameList),
    terraformSourceNames: S.optional(String255List),
    eksSourceNames: S.optional(String255List),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/remove-draft-app-version-resource-mappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveDraftAppVersionResourceMappingsRequest",
}) as any as S.Schema<RemoveDraftAppVersionResourceMappingsRequest>;
export interface ResolveAppVersionResourcesRequest {
  appArn: string;
  appVersion: string;
}
export const ResolveAppVersionResourcesRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, appVersion: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resolve-app-version-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResolveAppVersionResourcesRequest",
}) as any as S.Schema<ResolveAppVersionResourcesRequest>;
export interface StartAppAssessmentRequest {
  appArn: string;
  appVersion: string;
  assessmentName: string;
  clientToken?: string;
  tags?: { [key: string]: string | undefined };
}
export const StartAppAssessmentRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    assessmentName: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-app-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAppAssessmentRequest",
}) as any as S.Schema<StartAppAssessmentRequest>;
export interface StartMetricsExportRequest {
  bucketName?: string;
  clientToken?: string;
}
export const StartMetricsExportRequest = S.suspend(() =>
  S.Struct({
    bucketName: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-metrics-export" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMetricsExportRequest",
}) as any as S.Schema<StartMetricsExportRequest>;
export interface StartResourceGroupingRecommendationTaskRequest {
  appArn: string;
}
export const StartResourceGroupingRecommendationTaskRequest = S.suspend(() =>
  S.Struct({ appArn: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/start-resource-grouping-recommendation-task",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartResourceGroupingRecommendationTaskRequest",
}) as any as S.Schema<StartResourceGroupingRecommendationTaskRequest>;
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
export type PermissionModelType = "LegacyIAMUser" | "RoleBased" | (string & {});
export const PermissionModelType = S.String;
export type IamRoleArnList = string[];
export const IamRoleArnList = S.Array(S.String);
export interface PermissionModel {
  type: PermissionModelType;
  invokerRoleName?: string;
  crossAccountRoleArns?: string[];
}
export const PermissionModel = S.suspend(() =>
  S.Struct({
    type: PermissionModelType,
    invokerRoleName: S.optional(S.String),
    crossAccountRoleArns: S.optional(IamRoleArnList),
  }),
).annotations({
  identifier: "PermissionModel",
}) as any as S.Schema<PermissionModel>;
export type EventType =
  | "ScheduledAssessmentFailure"
  | "DriftDetected"
  | (string & {});
export const EventType = S.String;
export interface EventSubscription {
  name: string;
  eventType: EventType;
  snsTopicArn?: string;
}
export const EventSubscription = S.suspend(() =>
  S.Struct({
    name: S.String,
    eventType: EventType,
    snsTopicArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EventSubscription",
}) as any as S.Schema<EventSubscription>;
export type EventSubscriptionList = EventSubscription[];
export const EventSubscriptionList = S.Array(EventSubscription);
export interface UpdateAppRequest {
  appArn: string;
  description?: string;
  policyArn?: string;
  clearResiliencyPolicyArn?: boolean;
  assessmentSchedule?: AppAssessmentScheduleType;
  permissionModel?: PermissionModel;
  eventSubscriptions?: EventSubscription[];
}
export const UpdateAppRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    description: S.optional(S.String),
    policyArn: S.optional(S.String),
    clearResiliencyPolicyArn: S.optional(S.Boolean),
    assessmentSchedule: S.optional(AppAssessmentScheduleType),
    permissionModel: S.optional(PermissionModel),
    eventSubscriptions: S.optional(EventSubscriptionList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-app" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppRequest",
}) as any as S.Schema<UpdateAppRequest>;
export type AdditionalInfoValueList = string[];
export const AdditionalInfoValueList = S.Array(S.String);
export type AdditionalInfoMap = { [key: string]: string[] | undefined };
export const AdditionalInfoMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(AdditionalInfoValueList),
});
export interface UpdateAppVersionRequest {
  appArn: string;
  additionalInfo?: { [key: string]: string[] | undefined };
}
export const UpdateAppVersionRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    additionalInfo: S.optional(AdditionalInfoMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-app-version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppVersionRequest",
}) as any as S.Schema<UpdateAppVersionRequest>;
export interface UpdateAppVersionAppComponentRequest {
  appArn: string;
  id: string;
  name?: string;
  type?: string;
  additionalInfo?: { [key: string]: string[] | undefined };
}
export const UpdateAppVersionAppComponentRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    id: S.String,
    name: S.optional(S.String),
    type: S.optional(S.String),
    additionalInfo: S.optional(AdditionalInfoMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-app-version-app-component" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppVersionAppComponentRequest",
}) as any as S.Schema<UpdateAppVersionAppComponentRequest>;
export interface UpdateAppVersionResourceRequest {
  appArn: string;
  resourceName?: string;
  logicalResourceId?: LogicalResourceId;
  physicalResourceId?: string;
  awsRegion?: string;
  awsAccountId?: string;
  resourceType?: string;
  appComponents?: string[];
  additionalInfo?: { [key: string]: string[] | undefined };
  excluded?: boolean;
}
export const UpdateAppVersionResourceRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: S.optional(LogicalResourceId),
    physicalResourceId: S.optional(S.String),
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    resourceType: S.optional(S.String),
    appComponents: S.optional(AppComponentNameList),
    additionalInfo: S.optional(AdditionalInfoMap),
    excluded: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-app-version-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppVersionResourceRequest",
}) as any as S.Schema<UpdateAppVersionResourceRequest>;
export type DisruptionType =
  | "Software"
  | "Hardware"
  | "AZ"
  | "Region"
  | (string & {});
export const DisruptionType = S.String;
export interface FailurePolicy {
  rtoInSecs: number;
  rpoInSecs: number;
}
export const FailurePolicy = S.suspend(() =>
  S.Struct({ rtoInSecs: S.Number, rpoInSecs: S.Number }),
).annotations({
  identifier: "FailurePolicy",
}) as any as S.Schema<FailurePolicy>;
export type DisruptionPolicy = { [key in DisruptionType]?: FailurePolicy };
export const DisruptionPolicy = S.partial(
  S.Record({ key: DisruptionType, value: S.UndefinedOr(FailurePolicy) }),
);
export interface UpdateResiliencyPolicyRequest {
  policyArn: string;
  policyName?: string;
  policyDescription?: string;
  dataLocationConstraint?: DataLocationConstraint;
  tier?: ResiliencyPolicyTier;
  policy?: { [key: string]: FailurePolicy | undefined };
}
export const UpdateResiliencyPolicyRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    policyName: S.optional(S.String),
    policyDescription: S.optional(S.String),
    dataLocationConstraint: S.optional(DataLocationConstraint),
    tier: S.optional(ResiliencyPolicyTier),
    policy: S.optional(DisruptionPolicy),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-resiliency-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResiliencyPolicyRequest",
}) as any as S.Schema<UpdateResiliencyPolicyRequest>;
export type ResourceMappingType =
  | "CfnStack"
  | "Resource"
  | "AppRegistryApp"
  | "ResourceGroup"
  | "Terraform"
  | "EKS"
  | (string & {});
export const ResourceMappingType = S.String;
export type ExcludeRecommendationReason =
  | "AlreadyImplemented"
  | "NotRelevant"
  | "ComplexityOfImplementation"
  | (string & {});
export const ExcludeRecommendationReason = S.String;
export type EksNamespaceList = string[];
export const EksNamespaceList = S.Array(S.String);
export type FieldAggregationType =
  | "Min"
  | "Max"
  | "Sum"
  | "Avg"
  | "Count"
  | (string & {});
export const FieldAggregationType = S.String;
export type ConditionOperatorType =
  | "Equals"
  | "NotEquals"
  | "GreaterThen"
  | "GreaterOrEquals"
  | "LessThen"
  | "LessOrEquals"
  | (string & {});
export const ConditionOperatorType = S.String;
export type GroupingRecommendationRejectionReason =
  | "DistinctBusinessPurpose"
  | "SeparateDataConcern"
  | "DistinctUserGroupHandling"
  | "Other"
  | (string & {});
export const GroupingRecommendationRejectionReason = S.String;
export interface AcceptGroupingRecommendationEntry {
  groupingRecommendationId: string;
}
export const AcceptGroupingRecommendationEntry = S.suspend(() =>
  S.Struct({ groupingRecommendationId: S.String }),
).annotations({
  identifier: "AcceptGroupingRecommendationEntry",
}) as any as S.Schema<AcceptGroupingRecommendationEntry>;
export type AcceptGroupingRecommendationEntries =
  AcceptGroupingRecommendationEntry[];
export const AcceptGroupingRecommendationEntries = S.Array(
  AcceptGroupingRecommendationEntry,
);
export interface EksSourceClusterNamespace {
  eksClusterArn: string;
  namespace: string;
}
export const EksSourceClusterNamespace = S.suspend(() =>
  S.Struct({ eksClusterArn: S.String, namespace: S.String }),
).annotations({
  identifier: "EksSourceClusterNamespace",
}) as any as S.Schema<EksSourceClusterNamespace>;
export type ResourceResolutionStatusType =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const ResourceResolutionStatusType = S.String;
export type ResourceImportStatusType =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const ResourceImportStatusType = S.String;
export type MetricsExportStatusType =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const MetricsExportStatusType = S.String;
export type ResourcesGroupingRecGenStatusType =
  | "Pending"
  | "InProgress"
  | "Failed"
  | "Success"
  | (string & {});
export const ResourcesGroupingRecGenStatusType = S.String;
export interface EksSource {
  eksClusterArn: string;
  namespaces: string[];
}
export const EksSource = S.suspend(() =>
  S.Struct({ eksClusterArn: S.String, namespaces: EksNamespaceList }),
).annotations({ identifier: "EksSource" }) as any as S.Schema<EksSource>;
export type EksSourceList = EksSource[];
export const EksSourceList = S.Array(EksSource);
export interface AppComponent {
  name: string;
  type: string;
  id?: string;
  additionalInfo?: { [key: string]: string[] | undefined };
}
export const AppComponent = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    id: S.optional(S.String),
    additionalInfo: S.optional(AdditionalInfoMap),
  }),
).annotations({ identifier: "AppComponent" }) as any as S.Schema<AppComponent>;
export type AppComponentList = AppComponent[];
export const AppComponentList = S.Array(AppComponent);
export type PhysicalIdentifierType = "Arn" | "Native" | (string & {});
export const PhysicalIdentifierType = S.String;
export interface PhysicalResourceId {
  identifier: string;
  type: PhysicalIdentifierType;
  awsRegion?: string;
  awsAccountId?: string;
}
export const PhysicalResourceId = S.suspend(() =>
  S.Struct({
    identifier: S.String,
    type: PhysicalIdentifierType,
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalResourceId",
}) as any as S.Schema<PhysicalResourceId>;
export type ResourceSourceType = "AppTemplate" | "Discovered" | (string & {});
export const ResourceSourceType = S.String;
export interface PhysicalResource {
  resourceName?: string;
  logicalResourceId: LogicalResourceId;
  physicalResourceId: PhysicalResourceId;
  resourceType: string;
  appComponents?: AppComponent[];
  additionalInfo?: { [key: string]: string[] | undefined };
  excluded?: boolean;
  sourceType?: ResourceSourceType;
  parentResourceName?: string;
}
export const PhysicalResource = S.suspend(() =>
  S.Struct({
    resourceName: S.optional(S.String),
    logicalResourceId: LogicalResourceId,
    physicalResourceId: PhysicalResourceId,
    resourceType: S.String,
    appComponents: S.optional(AppComponentList),
    additionalInfo: S.optional(AdditionalInfoMap),
    excluded: S.optional(S.Boolean),
    sourceType: S.optional(ResourceSourceType),
    parentResourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalResource",
}) as any as S.Schema<PhysicalResource>;
export type PhysicalResourceList = PhysicalResource[];
export const PhysicalResourceList = S.Array(PhysicalResource);
export interface Field {
  name: string;
  aggregation?: FieldAggregationType;
}
export const Field = S.suspend(() =>
  S.Struct({ name: S.String, aggregation: S.optional(FieldAggregationType) }),
).annotations({ identifier: "Field" }) as any as S.Schema<Field>;
export type FieldList = Field[];
export const FieldList = S.Array(Field);
export interface Condition {
  field: string;
  operator: ConditionOperatorType;
  value?: string;
}
export const Condition = S.suspend(() =>
  S.Struct({
    field: S.String,
    operator: ConditionOperatorType,
    value: S.optional(S.String),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type ConditionList = Condition[];
export const ConditionList = S.Array(Condition);
export interface Sort {
  field: string;
  ascending?: boolean;
}
export const Sort = S.suspend(() =>
  S.Struct({ field: S.String, ascending: S.optional(S.Boolean) }),
).annotations({ identifier: "Sort" }) as any as S.Schema<Sort>;
export type SortList = Sort[];
export const SortList = S.Array(Sort);
export interface S3Location {
  bucket?: string;
  prefix?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface RecommendationTemplate {
  templatesLocation?: S3Location;
  assessmentArn: string;
  appArn?: string;
  recommendationIds?: string[];
  recommendationTypes: RenderRecommendationType[];
  format: TemplateFormat;
  recommendationTemplateArn: string;
  message?: string;
  status: RecommendationTemplateStatus;
  name: string;
  startTime?: Date;
  endTime?: Date;
  tags?: { [key: string]: string | undefined };
  needsReplacements?: boolean;
}
export const RecommendationTemplate = S.suspend(() =>
  S.Struct({
    templatesLocation: S.optional(S3Location),
    assessmentArn: S.String,
    appArn: S.optional(S.String),
    recommendationIds: S.optional(RecommendationIdList),
    recommendationTypes: RenderRecommendationTypeList,
    format: TemplateFormat,
    recommendationTemplateArn: S.String,
    message: S.optional(S.String),
    status: RecommendationTemplateStatus,
    name: S.String,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
    needsReplacements: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RecommendationTemplate",
}) as any as S.Schema<RecommendationTemplate>;
export type RecommendationTemplateList = RecommendationTemplate[];
export const RecommendationTemplateList = S.Array(RecommendationTemplate);
export type EstimatedCostTier = "L1" | "L2" | "L3" | "L4" | (string & {});
export const EstimatedCostTier = S.String;
export interface ResiliencyPolicy {
  policyArn?: string;
  policyName?: string;
  policyDescription?: string;
  dataLocationConstraint?: DataLocationConstraint;
  tier?: ResiliencyPolicyTier;
  estimatedCostTier?: EstimatedCostTier;
  policy?: { [key: string]: FailurePolicy | undefined };
  creationTime?: Date;
  tags?: { [key: string]: string | undefined };
}
export const ResiliencyPolicy = S.suspend(() =>
  S.Struct({
    policyArn: S.optional(S.String),
    policyName: S.optional(S.String),
    policyDescription: S.optional(S.String),
    dataLocationConstraint: S.optional(DataLocationConstraint),
    tier: S.optional(ResiliencyPolicyTier),
    estimatedCostTier: S.optional(EstimatedCostTier),
    policy: S.optional(DisruptionPolicy),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ResiliencyPolicy",
}) as any as S.Schema<ResiliencyPolicy>;
export type ResiliencyPolicies = ResiliencyPolicy[];
export const ResiliencyPolicies = S.Array(ResiliencyPolicy);
export interface RejectGroupingRecommendationEntry {
  groupingRecommendationId: string;
  rejectionReason?: GroupingRecommendationRejectionReason;
}
export const RejectGroupingRecommendationEntry = S.suspend(() =>
  S.Struct({
    groupingRecommendationId: S.String,
    rejectionReason: S.optional(GroupingRecommendationRejectionReason),
  }),
).annotations({
  identifier: "RejectGroupingRecommendationEntry",
}) as any as S.Schema<RejectGroupingRecommendationEntry>;
export type RejectGroupingRecommendationEntries =
  RejectGroupingRecommendationEntry[];
export const RejectGroupingRecommendationEntries = S.Array(
  RejectGroupingRecommendationEntry,
);
export interface AcceptResourceGroupingRecommendationsRequest {
  appArn: string;
  entries: AcceptGroupingRecommendationEntry[];
}
export const AcceptResourceGroupingRecommendationsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    entries: AcceptGroupingRecommendationEntries,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accept-resource-grouping-recommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptResourceGroupingRecommendationsRequest",
}) as any as S.Schema<AcceptResourceGroupingRecommendationsRequest>;
export interface CreateAppRequest {
  name: string;
  description?: string;
  policyArn?: string;
  tags?: { [key: string]: string | undefined };
  clientToken?: string;
  assessmentSchedule?: AppAssessmentScheduleType;
  permissionModel?: PermissionModel;
  eventSubscriptions?: EventSubscription[];
  awsApplicationArn?: string;
}
export const CreateAppRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    policyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    assessmentSchedule: S.optional(AppAssessmentScheduleType),
    permissionModel: S.optional(PermissionModel),
    eventSubscriptions: S.optional(EventSubscriptionList),
    awsApplicationArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-app" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppRequest",
}) as any as S.Schema<CreateAppRequest>;
export interface CreateAppVersionAppComponentRequest {
  appArn: string;
  id?: string;
  name: string;
  type: string;
  additionalInfo?: { [key: string]: string[] | undefined };
  clientToken?: string;
}
export const CreateAppVersionAppComponentRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    id: S.optional(S.String),
    name: S.String,
    type: S.String,
    additionalInfo: S.optional(AdditionalInfoMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-app-version-app-component" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppVersionAppComponentRequest",
}) as any as S.Schema<CreateAppVersionAppComponentRequest>;
export interface CreateAppVersionResourceRequest {
  appArn: string;
  resourceName?: string;
  logicalResourceId: LogicalResourceId;
  physicalResourceId: string;
  awsRegion?: string;
  awsAccountId?: string;
  resourceType: string;
  appComponents: string[];
  additionalInfo?: { [key: string]: string[] | undefined };
  clientToken?: string;
}
export const CreateAppVersionResourceRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    resourceName: S.optional(S.String),
    logicalResourceId: LogicalResourceId,
    physicalResourceId: S.String,
    awsRegion: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    resourceType: S.String,
    appComponents: AppComponentNameList,
    additionalInfo: S.optional(AdditionalInfoMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-app-version-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppVersionResourceRequest",
}) as any as S.Schema<CreateAppVersionResourceRequest>;
export interface DeleteAppResponse {
  appArn: string;
}
export const DeleteAppResponse = S.suspend(() =>
  S.Struct({ appArn: S.String }),
).annotations({
  identifier: "DeleteAppResponse",
}) as any as S.Schema<DeleteAppResponse>;
export interface DeleteAppAssessmentResponse {
  assessmentArn: string;
  assessmentStatus: AssessmentStatus;
}
export const DeleteAppAssessmentResponse = S.suspend(() =>
  S.Struct({ assessmentArn: S.String, assessmentStatus: AssessmentStatus }),
).annotations({
  identifier: "DeleteAppAssessmentResponse",
}) as any as S.Schema<DeleteAppAssessmentResponse>;
export interface DeleteAppInputSourceRequest {
  appArn: string;
  sourceArn?: string;
  terraformSource?: TerraformSource;
  clientToken?: string;
  eksSourceClusterNamespace?: EksSourceClusterNamespace;
}
export const DeleteAppInputSourceRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    sourceArn: S.optional(S.String),
    terraformSource: S.optional(TerraformSource),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    eksSourceClusterNamespace: S.optional(EksSourceClusterNamespace),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-app-input-source" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppInputSourceRequest",
}) as any as S.Schema<DeleteAppInputSourceRequest>;
export interface DeleteRecommendationTemplateResponse {
  recommendationTemplateArn: string;
  status: RecommendationTemplateStatus;
}
export const DeleteRecommendationTemplateResponse = S.suspend(() =>
  S.Struct({
    recommendationTemplateArn: S.String,
    status: RecommendationTemplateStatus,
  }),
).annotations({
  identifier: "DeleteRecommendationTemplateResponse",
}) as any as S.Schema<DeleteRecommendationTemplateResponse>;
export interface DeleteResiliencyPolicyResponse {
  policyArn: string;
}
export const DeleteResiliencyPolicyResponse = S.suspend(() =>
  S.Struct({ policyArn: S.String }),
).annotations({
  identifier: "DeleteResiliencyPolicyResponse",
}) as any as S.Schema<DeleteResiliencyPolicyResponse>;
export interface DescribeAppVersionResponse {
  appArn: string;
  appVersion: string;
  additionalInfo?: { [key: string]: string[] | undefined };
}
export const DescribeAppVersionResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    additionalInfo: S.optional(AdditionalInfoMap),
  }),
).annotations({
  identifier: "DescribeAppVersionResponse",
}) as any as S.Schema<DescribeAppVersionResponse>;
export interface DescribeAppVersionAppComponentResponse {
  appArn: string;
  appVersion: string;
  appComponent?: AppComponent;
}
export const DescribeAppVersionAppComponentResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appComponent: S.optional(AppComponent),
  }),
).annotations({
  identifier: "DescribeAppVersionAppComponentResponse",
}) as any as S.Schema<DescribeAppVersionAppComponentResponse>;
export interface DescribeAppVersionResourceResponse {
  appArn: string;
  appVersion: string;
  physicalResource?: PhysicalResource;
}
export const DescribeAppVersionResourceResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    physicalResource: S.optional(PhysicalResource),
  }),
).annotations({
  identifier: "DescribeAppVersionResourceResponse",
}) as any as S.Schema<DescribeAppVersionResourceResponse>;
export interface DescribeAppVersionResourcesResolutionStatusResponse {
  appArn: string;
  appVersion: string;
  resolutionId: string;
  status: ResourceResolutionStatusType;
  errorMessage?: string;
}
export const DescribeAppVersionResourcesResolutionStatusResponse = S.suspend(
  () =>
    S.Struct({
      appArn: S.String,
      appVersion: S.String,
      resolutionId: S.String,
      status: ResourceResolutionStatusType,
      errorMessage: S.optional(S.String),
    }),
).annotations({
  identifier: "DescribeAppVersionResourcesResolutionStatusResponse",
}) as any as S.Schema<DescribeAppVersionResourcesResolutionStatusResponse>;
export interface DescribeAppVersionTemplateResponse {
  appArn: string;
  appVersion: string;
  appTemplateBody: string;
}
export const DescribeAppVersionTemplateResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appTemplateBody: S.String,
  }),
).annotations({
  identifier: "DescribeAppVersionTemplateResponse",
}) as any as S.Schema<DescribeAppVersionTemplateResponse>;
export interface DescribeResourceGroupingRecommendationTaskResponse {
  groupingId: string;
  status: ResourcesGroupingRecGenStatusType;
  errorMessage?: string;
}
export const DescribeResourceGroupingRecommendationTaskResponse = S.suspend(
  () =>
    S.Struct({
      groupingId: S.String,
      status: ResourcesGroupingRecGenStatusType,
      errorMessage: S.optional(S.String),
    }),
).annotations({
  identifier: "DescribeResourceGroupingRecommendationTaskResponse",
}) as any as S.Schema<DescribeResourceGroupingRecommendationTaskResponse>;
export interface ImportResourcesToDraftAppVersionRequest {
  appArn: string;
  sourceArns?: string[];
  terraformSources?: TerraformSource[];
  importStrategy?: ResourceImportStrategyType;
  eksSources?: EksSource[];
}
export const ImportResourcesToDraftAppVersionRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    sourceArns: S.optional(ArnList),
    terraformSources: S.optional(TerraformSourceList),
    importStrategy: S.optional(ResourceImportStrategyType),
    eksSources: S.optional(EksSourceList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/import-resources-to-draft-app-version" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportResourcesToDraftAppVersionRequest",
}) as any as S.Schema<ImportResourcesToDraftAppVersionRequest>;
export interface ListAppVersionAppComponentsResponse {
  appArn: string;
  appVersion: string;
  appComponents?: AppComponent[];
  nextToken?: string;
}
export const ListAppVersionAppComponentsResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appComponents: S.optional(AppComponentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppVersionAppComponentsResponse",
}) as any as S.Schema<ListAppVersionAppComponentsResponse>;
export interface ResourceMapping {
  resourceName?: string;
  logicalStackName?: string;
  appRegistryAppName?: string;
  resourceGroupName?: string;
  mappingType: ResourceMappingType;
  physicalResourceId: PhysicalResourceId;
  terraformSourceName?: string;
  eksSourceName?: string;
}
export const ResourceMapping = S.suspend(() =>
  S.Struct({
    resourceName: S.optional(S.String),
    logicalStackName: S.optional(S.String),
    appRegistryAppName: S.optional(S.String),
    resourceGroupName: S.optional(S.String),
    mappingType: ResourceMappingType,
    physicalResourceId: PhysicalResourceId,
    terraformSourceName: S.optional(S.String),
    eksSourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceMapping",
}) as any as S.Schema<ResourceMapping>;
export type ResourceMappingList = ResourceMapping[];
export const ResourceMappingList = S.Array(ResourceMapping);
export interface ListAppVersionResourceMappingsResponse {
  resourceMappings: ResourceMapping[];
  nextToken?: string;
}
export const ListAppVersionResourceMappingsResponse = S.suspend(() =>
  S.Struct({
    resourceMappings: ResourceMappingList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppVersionResourceMappingsResponse",
}) as any as S.Schema<ListAppVersionResourceMappingsResponse>;
export interface ListAppVersionResourcesResponse {
  physicalResources: PhysicalResource[];
  resolutionId: string;
  nextToken?: string;
}
export const ListAppVersionResourcesResponse = S.suspend(() =>
  S.Struct({
    physicalResources: PhysicalResourceList,
    resolutionId: S.String,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppVersionResourcesResponse",
}) as any as S.Schema<ListAppVersionResourcesResponse>;
export interface ListMetricsRequest {
  nextToken?: string;
  maxResults?: number;
  fields?: Field[];
  dataSource?: string;
  conditions?: Condition[];
  sorts?: Sort[];
}
export const ListMetricsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    fields: S.optional(FieldList),
    dataSource: S.optional(S.String),
    conditions: S.optional(ConditionList),
    sorts: S.optional(SortList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-metrics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMetricsRequest",
}) as any as S.Schema<ListMetricsRequest>;
export interface ListRecommendationTemplatesResponse {
  nextToken?: string;
  recommendationTemplates?: RecommendationTemplate[];
}
export const ListRecommendationTemplatesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    recommendationTemplates: S.optional(RecommendationTemplateList),
  }),
).annotations({
  identifier: "ListRecommendationTemplatesResponse",
}) as any as S.Schema<ListRecommendationTemplatesResponse>;
export interface ListResiliencyPoliciesResponse {
  resiliencyPolicies: ResiliencyPolicy[];
  nextToken?: string;
}
export const ListResiliencyPoliciesResponse = S.suspend(() =>
  S.Struct({
    resiliencyPolicies: ResiliencyPolicies,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResiliencyPoliciesResponse",
}) as any as S.Schema<ListResiliencyPoliciesResponse>;
export interface ListSuggestedResiliencyPoliciesResponse {
  resiliencyPolicies: ResiliencyPolicy[];
  nextToken?: string;
}
export const ListSuggestedResiliencyPoliciesResponse = S.suspend(() =>
  S.Struct({
    resiliencyPolicies: ResiliencyPolicies,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSuggestedResiliencyPoliciesResponse",
}) as any as S.Schema<ListSuggestedResiliencyPoliciesResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PublishAppVersionResponse {
  appArn: string;
  appVersion?: string;
  identifier?: number;
  versionName?: string;
}
export const PublishAppVersionResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.optional(S.String),
    identifier: S.optional(S.Number),
    versionName: S.optional(S.String),
  }),
).annotations({
  identifier: "PublishAppVersionResponse",
}) as any as S.Schema<PublishAppVersionResponse>;
export interface PutDraftAppVersionTemplateResponse {
  appArn?: string;
  appVersion?: string;
}
export const PutDraftAppVersionTemplateResponse = S.suspend(() =>
  S.Struct({ appArn: S.optional(S.String), appVersion: S.optional(S.String) }),
).annotations({
  identifier: "PutDraftAppVersionTemplateResponse",
}) as any as S.Schema<PutDraftAppVersionTemplateResponse>;
export interface RejectResourceGroupingRecommendationsRequest {
  appArn: string;
  entries: RejectGroupingRecommendationEntry[];
}
export const RejectResourceGroupingRecommendationsRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    entries: RejectGroupingRecommendationEntries,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/reject-resource-grouping-recommendations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectResourceGroupingRecommendationsRequest",
}) as any as S.Schema<RejectResourceGroupingRecommendationsRequest>;
export interface RemoveDraftAppVersionResourceMappingsResponse {
  appArn?: string;
  appVersion?: string;
}
export const RemoveDraftAppVersionResourceMappingsResponse = S.suspend(() =>
  S.Struct({ appArn: S.optional(S.String), appVersion: S.optional(S.String) }),
).annotations({
  identifier: "RemoveDraftAppVersionResourceMappingsResponse",
}) as any as S.Schema<RemoveDraftAppVersionResourceMappingsResponse>;
export interface ResolveAppVersionResourcesResponse {
  appArn: string;
  appVersion: string;
  resolutionId: string;
  status: ResourceResolutionStatusType;
}
export const ResolveAppVersionResourcesResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    resolutionId: S.String,
    status: ResourceResolutionStatusType,
  }),
).annotations({
  identifier: "ResolveAppVersionResourcesResponse",
}) as any as S.Schema<ResolveAppVersionResourcesResponse>;
export type CostFrequency =
  | "Hourly"
  | "Daily"
  | "Monthly"
  | "Yearly"
  | (string & {});
export const CostFrequency = S.String;
export interface Cost {
  amount: number;
  currency: string;
  frequency: CostFrequency;
}
export const Cost = S.suspend(() =>
  S.Struct({ amount: S.Number, currency: S.String, frequency: CostFrequency }),
).annotations({ identifier: "Cost" }) as any as S.Schema<Cost>;
export type DisruptionResiliencyScore = { [key in DisruptionType]?: number };
export const DisruptionResiliencyScore = S.partial(
  S.Record({ key: DisruptionType, value: S.UndefinedOr(S.Number) }),
);
export type ResiliencyScoreType =
  | "Compliance"
  | "Test"
  | "Alarm"
  | "Sop"
  | (string & {});
export const ResiliencyScoreType = S.String;
export interface ScoringComponentResiliencyScore {
  score?: number;
  possibleScore?: number;
  outstandingCount?: number;
  excludedCount?: number;
}
export const ScoringComponentResiliencyScore = S.suspend(() =>
  S.Struct({
    score: S.optional(S.Number),
    possibleScore: S.optional(S.Number),
    outstandingCount: S.optional(S.Number),
    excludedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScoringComponentResiliencyScore",
}) as any as S.Schema<ScoringComponentResiliencyScore>;
export type ScoringComponentResiliencyScores = {
  [key in ResiliencyScoreType]?: ScoringComponentResiliencyScore;
};
export const ScoringComponentResiliencyScores = S.partial(
  S.Record({
    key: ResiliencyScoreType,
    value: S.UndefinedOr(ScoringComponentResiliencyScore),
  }),
);
export interface ResiliencyScore {
  score: number;
  disruptionScore: { [key: string]: number | undefined };
  componentScore?: {
    [key: string]: ScoringComponentResiliencyScore | undefined;
  };
}
export const ResiliencyScore = S.suspend(() =>
  S.Struct({
    score: S.Number,
    disruptionScore: DisruptionResiliencyScore,
    componentScore: S.optional(ScoringComponentResiliencyScores),
  }),
).annotations({
  identifier: "ResiliencyScore",
}) as any as S.Schema<ResiliencyScore>;
export interface DisruptionCompliance {
  achievableRtoInSecs?: number;
  currentRtoInSecs?: number;
  rtoReferenceId?: string;
  rtoDescription?: string;
  currentRpoInSecs?: number;
  rpoReferenceId?: string;
  rpoDescription?: string;
  complianceStatus: ComplianceStatus;
  achievableRpoInSecs?: number;
  message?: string;
}
export const DisruptionCompliance = S.suspend(() =>
  S.Struct({
    achievableRtoInSecs: S.optional(S.Number),
    currentRtoInSecs: S.optional(S.Number),
    rtoReferenceId: S.optional(S.String),
    rtoDescription: S.optional(S.String),
    currentRpoInSecs: S.optional(S.Number),
    rpoReferenceId: S.optional(S.String),
    rpoDescription: S.optional(S.String),
    complianceStatus: ComplianceStatus,
    achievableRpoInSecs: S.optional(S.Number),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DisruptionCompliance",
}) as any as S.Schema<DisruptionCompliance>;
export type AssessmentCompliance = {
  [key in DisruptionType]?: DisruptionCompliance;
};
export const AssessmentCompliance = S.partial(
  S.Record({ key: DisruptionType, value: S.UndefinedOr(DisruptionCompliance) }),
);
export interface ResourceError {
  logicalResourceId?: string;
  physicalResourceId?: string;
  reason?: string;
}
export const ResourceError = S.suspend(() =>
  S.Struct({
    logicalResourceId: S.optional(S.String),
    physicalResourceId: S.optional(S.String),
    reason: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceError",
}) as any as S.Schema<ResourceError>;
export type ResourceErrorList = ResourceError[];
export const ResourceErrorList = S.Array(ResourceError);
export interface ResourceErrorsDetails {
  resourceErrors?: ResourceError[];
  hasMoreErrors?: boolean;
}
export const ResourceErrorsDetails = S.suspend(() =>
  S.Struct({
    resourceErrors: S.optional(ResourceErrorList),
    hasMoreErrors: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResourceErrorsDetails",
}) as any as S.Schema<ResourceErrorsDetails>;
export type DriftStatus =
  | "NotChecked"
  | "NotDetected"
  | "Detected"
  | (string & {});
export const DriftStatus = S.String;
export interface AssessmentRiskRecommendation {
  risk?: string;
  recommendation?: string;
  appComponents?: string[];
}
export const AssessmentRiskRecommendation = S.suspend(() =>
  S.Struct({
    risk: S.optional(S.String),
    recommendation: S.optional(S.String),
    appComponents: S.optional(AppComponentNameList),
  }),
).annotations({
  identifier: "AssessmentRiskRecommendation",
}) as any as S.Schema<AssessmentRiskRecommendation>;
export type AssessmentRiskRecommendationList = AssessmentRiskRecommendation[];
export const AssessmentRiskRecommendationList = S.Array(
  AssessmentRiskRecommendation,
);
export interface AssessmentSummary {
  summary?: string;
  riskRecommendations?: AssessmentRiskRecommendation[];
}
export const AssessmentSummary = S.suspend(() =>
  S.Struct({
    summary: S.optional(S.String),
    riskRecommendations: S.optional(AssessmentRiskRecommendationList),
  }),
).annotations({
  identifier: "AssessmentSummary",
}) as any as S.Schema<AssessmentSummary>;
export interface AppAssessment {
  appArn?: string;
  appVersion?: string;
  invoker: AssessmentInvoker;
  cost?: Cost;
  resiliencyScore?: ResiliencyScore;
  compliance?: { [key: string]: DisruptionCompliance | undefined };
  complianceStatus?: ComplianceStatus;
  assessmentStatus: AssessmentStatus;
  startTime?: Date;
  endTime?: Date;
  message?: string;
  assessmentName?: string;
  assessmentArn: string;
  policy?: ResiliencyPolicy;
  tags?: { [key: string]: string | undefined };
  resourceErrorsDetails?: ResourceErrorsDetails;
  versionName?: string;
  driftStatus?: DriftStatus;
  summary?: AssessmentSummary;
}
export const AppAssessment = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String),
    appVersion: S.optional(S.String),
    invoker: AssessmentInvoker,
    cost: S.optional(Cost),
    resiliencyScore: S.optional(ResiliencyScore),
    compliance: S.optional(AssessmentCompliance),
    complianceStatus: S.optional(ComplianceStatus),
    assessmentStatus: AssessmentStatus,
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
    assessmentName: S.optional(S.String),
    assessmentArn: S.String,
    policy: S.optional(ResiliencyPolicy),
    tags: S.optional(TagMap),
    resourceErrorsDetails: S.optional(ResourceErrorsDetails),
    versionName: S.optional(S.String),
    driftStatus: S.optional(DriftStatus),
    summary: S.optional(AssessmentSummary),
  }),
).annotations({
  identifier: "AppAssessment",
}) as any as S.Schema<AppAssessment>;
export interface StartAppAssessmentResponse {
  assessment: AppAssessment;
}
export const StartAppAssessmentResponse = S.suspend(() =>
  S.Struct({ assessment: AppAssessment }),
).annotations({
  identifier: "StartAppAssessmentResponse",
}) as any as S.Schema<StartAppAssessmentResponse>;
export interface StartMetricsExportResponse {
  metricsExportId: string;
  status: MetricsExportStatusType;
}
export const StartMetricsExportResponse = S.suspend(() =>
  S.Struct({ metricsExportId: S.String, status: MetricsExportStatusType }),
).annotations({
  identifier: "StartMetricsExportResponse",
}) as any as S.Schema<StartMetricsExportResponse>;
export interface StartResourceGroupingRecommendationTaskResponse {
  appArn: string;
  groupingId: string;
  status: ResourcesGroupingRecGenStatusType;
  errorMessage?: string;
}
export const StartResourceGroupingRecommendationTaskResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    groupingId: S.String,
    status: ResourcesGroupingRecGenStatusType,
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "StartResourceGroupingRecommendationTaskResponse",
}) as any as S.Schema<StartResourceGroupingRecommendationTaskResponse>;
export type AppStatusType = "Active" | "Deleting" | (string & {});
export const AppStatusType = S.String;
export type AppComplianceStatusType =
  | "PolicyBreached"
  | "PolicyMet"
  | "NotAssessed"
  | "ChangesDetected"
  | "NotApplicable"
  | "MissingPolicy"
  | (string & {});
export const AppComplianceStatusType = S.String;
export type AppDriftStatusType =
  | "NotChecked"
  | "NotDetected"
  | "Detected"
  | (string & {});
export const AppDriftStatusType = S.String;
export interface App {
  appArn: string;
  name: string;
  description?: string;
  policyArn?: string;
  creationTime: Date;
  status?: AppStatusType;
  complianceStatus?: AppComplianceStatusType;
  lastAppComplianceEvaluationTime?: Date;
  resiliencyScore?: number;
  lastResiliencyScoreEvaluationTime?: Date;
  tags?: { [key: string]: string | undefined };
  assessmentSchedule?: AppAssessmentScheduleType;
  permissionModel?: PermissionModel;
  eventSubscriptions?: EventSubscription[];
  driftStatus?: AppDriftStatusType;
  lastDriftEvaluationTime?: Date;
  rtoInSecs?: number;
  rpoInSecs?: number;
  awsApplicationArn?: string;
}
export const App = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    policyArn: S.optional(S.String),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.optional(AppStatusType),
    complianceStatus: S.optional(AppComplianceStatusType),
    lastAppComplianceEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    resiliencyScore: S.optional(S.Number),
    lastResiliencyScoreEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(TagMap),
    assessmentSchedule: S.optional(AppAssessmentScheduleType),
    permissionModel: S.optional(PermissionModel),
    eventSubscriptions: S.optional(EventSubscriptionList),
    driftStatus: S.optional(AppDriftStatusType),
    lastDriftEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    rtoInSecs: S.optional(S.Number),
    rpoInSecs: S.optional(S.Number),
    awsApplicationArn: S.optional(S.String),
  }),
).annotations({ identifier: "App" }) as any as S.Schema<App>;
export interface UpdateAppResponse {
  app: App;
}
export const UpdateAppResponse = S.suspend(() =>
  S.Struct({ app: App }),
).annotations({
  identifier: "UpdateAppResponse",
}) as any as S.Schema<UpdateAppResponse>;
export interface UpdateAppVersionResponse {
  appArn: string;
  appVersion: string;
  additionalInfo?: { [key: string]: string[] | undefined };
}
export const UpdateAppVersionResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    additionalInfo: S.optional(AdditionalInfoMap),
  }),
).annotations({
  identifier: "UpdateAppVersionResponse",
}) as any as S.Schema<UpdateAppVersionResponse>;
export interface UpdateAppVersionAppComponentResponse {
  appArn: string;
  appVersion: string;
  appComponent?: AppComponent;
}
export const UpdateAppVersionAppComponentResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appComponent: S.optional(AppComponent),
  }),
).annotations({
  identifier: "UpdateAppVersionAppComponentResponse",
}) as any as S.Schema<UpdateAppVersionAppComponentResponse>;
export interface UpdateAppVersionResourceResponse {
  appArn: string;
  appVersion: string;
  physicalResource?: PhysicalResource;
}
export const UpdateAppVersionResourceResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    physicalResource: S.optional(PhysicalResource),
  }),
).annotations({
  identifier: "UpdateAppVersionResourceResponse",
}) as any as S.Schema<UpdateAppVersionResourceResponse>;
export interface UpdateResiliencyPolicyResponse {
  policy: ResiliencyPolicy;
}
export const UpdateResiliencyPolicyResponse = S.suspend(() =>
  S.Struct({ policy: ResiliencyPolicy }),
).annotations({
  identifier: "UpdateResiliencyPolicyResponse",
}) as any as S.Schema<UpdateResiliencyPolicyResponse>;
export interface UpdateRecommendationStatusItem {
  resourceId?: string;
  targetAccountId?: string;
  targetRegion?: string;
}
export const UpdateRecommendationStatusItem = S.suspend(() =>
  S.Struct({
    resourceId: S.optional(S.String),
    targetAccountId: S.optional(S.String),
    targetRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateRecommendationStatusItem",
}) as any as S.Schema<UpdateRecommendationStatusItem>;
export type AlarmType =
  | "Metric"
  | "Composite"
  | "Canary"
  | "Logs"
  | "Event"
  | (string & {});
export const AlarmType = S.String;
export type RecommendationStatus =
  | "Implemented"
  | "Inactive"
  | "NotImplemented"
  | "Excluded"
  | (string & {});
export const RecommendationStatus = S.String;
export type DriftType =
  | "ApplicationCompliance"
  | "AppComponentResiliencyComplianceStatus"
  | (string & {});
export const DriftType = S.String;
export type DifferenceType = "NotEqual" | "Added" | "Removed" | (string & {});
export const DifferenceType = S.String;
export type RecommendationComplianceStatus =
  | "BreachedUnattainable"
  | "BreachedCanMeet"
  | "MetCanImprove"
  | "MissingPolicy"
  | (string & {});
export const RecommendationComplianceStatus = S.String;
export type GroupingRecommendationStatusType =
  | "Accepted"
  | "Rejected"
  | "PendingDecision"
  | (string & {});
export const GroupingRecommendationStatusType = S.String;
export type GroupingRecommendationConfidenceLevel =
  | "High"
  | "Medium"
  | (string & {});
export const GroupingRecommendationConfidenceLevel = S.String;
export type SopServiceType = "SSM" | (string & {});
export const SopServiceType = S.String;
export type TestRisk = "Small" | "Medium" | "High" | (string & {});
export const TestRisk = S.String;
export type TestType =
  | "Software"
  | "Hardware"
  | "AZ"
  | "Region"
  | (string & {});
export const TestType = S.String;
export type AlarmReferenceIdList = string[];
export const AlarmReferenceIdList = S.Array(S.String);
export interface UpdateRecommendationStatusRequestEntry {
  entryId: string;
  referenceId: string;
  item?: UpdateRecommendationStatusItem;
  excluded: boolean;
  appComponentId?: string;
  excludeReason?: ExcludeRecommendationReason;
}
export const UpdateRecommendationStatusRequestEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    referenceId: S.String,
    item: S.optional(UpdateRecommendationStatusItem),
    excluded: S.Boolean,
    appComponentId: S.optional(S.String),
    excludeReason: S.optional(ExcludeRecommendationReason),
  }),
).annotations({
  identifier: "UpdateRecommendationStatusRequestEntry",
}) as any as S.Schema<UpdateRecommendationStatusRequestEntry>;
export type UpdateRecommendationStatusRequestEntries =
  UpdateRecommendationStatusRequestEntry[];
export const UpdateRecommendationStatusRequestEntries = S.Array(
  UpdateRecommendationStatusRequestEntry,
);
export interface ErrorDetail {
  errorMessage?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({ errorMessage: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetailList = ErrorDetail[];
export const ErrorDetailList = S.Array(ErrorDetail);
export interface ComplianceDrift {
  entityId?: string;
  entityType?: string;
  driftType?: DriftType;
  appId?: string;
  appVersion?: string;
  expectedReferenceId?: string;
  expectedValue?: { [key: string]: DisruptionCompliance | undefined };
  actualReferenceId?: string;
  actualValue?: { [key: string]: DisruptionCompliance | undefined };
  diffType?: DifferenceType;
}
export const ComplianceDrift = S.suspend(() =>
  S.Struct({
    entityId: S.optional(S.String),
    entityType: S.optional(S.String),
    driftType: S.optional(DriftType),
    appId: S.optional(S.String),
    appVersion: S.optional(S.String),
    expectedReferenceId: S.optional(S.String),
    expectedValue: S.optional(AssessmentCompliance),
    actualReferenceId: S.optional(S.String),
    actualValue: S.optional(AssessmentCompliance),
    diffType: S.optional(DifferenceType),
  }),
).annotations({
  identifier: "ComplianceDrift",
}) as any as S.Schema<ComplianceDrift>;
export type ComplianceDriftList = ComplianceDrift[];
export const ComplianceDriftList = S.Array(ComplianceDrift);
export interface AppAssessmentSummary {
  appArn?: string;
  appVersion?: string;
  assessmentStatus: AssessmentStatus;
  invoker?: AssessmentInvoker;
  startTime?: Date;
  endTime?: Date;
  message?: string;
  assessmentName?: string;
  assessmentArn: string;
  complianceStatus?: ComplianceStatus;
  cost?: Cost;
  resiliencyScore?: number;
  versionName?: string;
  driftStatus?: DriftStatus;
}
export const AppAssessmentSummary = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String),
    appVersion: S.optional(S.String),
    assessmentStatus: AssessmentStatus,
    invoker: S.optional(AssessmentInvoker),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
    assessmentName: S.optional(S.String),
    assessmentArn: S.String,
    complianceStatus: S.optional(ComplianceStatus),
    cost: S.optional(Cost),
    resiliencyScore: S.optional(S.Number),
    versionName: S.optional(S.String),
    driftStatus: S.optional(DriftStatus),
  }),
).annotations({
  identifier: "AppAssessmentSummary",
}) as any as S.Schema<AppAssessmentSummary>;
export type AppAssessmentSummaryList = AppAssessmentSummary[];
export const AppAssessmentSummaryList = S.Array(AppAssessmentSummary);
export interface AppComponentCompliance {
  cost?: Cost;
  appComponentName?: string;
  compliance?: { [key: string]: DisruptionCompliance | undefined };
  message?: string;
  status?: ComplianceStatus;
  resiliencyScore?: ResiliencyScore;
}
export const AppComponentCompliance = S.suspend(() =>
  S.Struct({
    cost: S.optional(Cost),
    appComponentName: S.optional(S.String),
    compliance: S.optional(AssessmentCompliance),
    message: S.optional(S.String),
    status: S.optional(ComplianceStatus),
    resiliencyScore: S.optional(ResiliencyScore),
  }),
).annotations({
  identifier: "AppComponentCompliance",
}) as any as S.Schema<AppComponentCompliance>;
export type ComponentCompliancesList = AppComponentCompliance[];
export const ComponentCompliancesList = S.Array(AppComponentCompliance);
export interface AppInputSource {
  sourceName?: string;
  importType: ResourceMappingType;
  sourceArn?: string;
  terraformSource?: TerraformSource;
  resourceCount?: number;
  eksSourceClusterNamespace?: EksSourceClusterNamespace;
}
export const AppInputSource = S.suspend(() =>
  S.Struct({
    sourceName: S.optional(S.String),
    importType: ResourceMappingType,
    sourceArn: S.optional(S.String),
    terraformSource: S.optional(TerraformSource),
    resourceCount: S.optional(S.Number),
    eksSourceClusterNamespace: S.optional(EksSourceClusterNamespace),
  }),
).annotations({
  identifier: "AppInputSource",
}) as any as S.Schema<AppInputSource>;
export type AppInputSourceList = AppInputSource[];
export const AppInputSourceList = S.Array(AppInputSource);
export interface AppSummary {
  appArn: string;
  name: string;
  description?: string;
  creationTime: Date;
  complianceStatus?: AppComplianceStatusType;
  resiliencyScore?: number;
  assessmentSchedule?: AppAssessmentScheduleType;
  status?: AppStatusType;
  driftStatus?: AppDriftStatusType;
  lastAppComplianceEvaluationTime?: Date;
  rtoInSecs?: number;
  rpoInSecs?: number;
  awsApplicationArn?: string;
}
export const AppSummary = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    complianceStatus: S.optional(AppComplianceStatusType),
    resiliencyScore: S.optional(S.Number),
    assessmentSchedule: S.optional(AppAssessmentScheduleType),
    status: S.optional(AppStatusType),
    driftStatus: S.optional(AppDriftStatusType),
    lastAppComplianceEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    rtoInSecs: S.optional(S.Number),
    rpoInSecs: S.optional(S.Number),
    awsApplicationArn: S.optional(S.String),
  }),
).annotations({ identifier: "AppSummary" }) as any as S.Schema<AppSummary>;
export type AppSummaryList = AppSummary[];
export const AppSummaryList = S.Array(AppSummary);
export interface AppVersionSummary {
  appVersion: string;
  identifier?: number;
  creationTime?: Date;
  versionName?: string;
}
export const AppVersionSummary = S.suspend(() =>
  S.Struct({
    appVersion: S.String,
    identifier: S.optional(S.Number),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    versionName: S.optional(S.String),
  }),
).annotations({
  identifier: "AppVersionSummary",
}) as any as S.Schema<AppVersionSummary>;
export type AppVersionList = AppVersionSummary[];
export const AppVersionList = S.Array(AppVersionSummary);
export type Row = string[];
export const Row = S.Array(S.String);
export type RowList = string[][];
export const RowList = S.Array(Row);
export interface Experiment {
  experimentArn?: string;
  experimentTemplateId?: string;
}
export const Experiment = S.suspend(() =>
  S.Struct({
    experimentArn: S.optional(S.String),
    experimentTemplateId: S.optional(S.String),
  }),
).annotations({ identifier: "Experiment" }) as any as S.Schema<Experiment>;
export interface Alarm {
  alarmArn?: string;
  source?: string;
}
export const Alarm = S.suspend(() =>
  S.Struct({ alarmArn: S.optional(S.String), source: S.optional(S.String) }),
).annotations({ identifier: "Alarm" }) as any as S.Schema<Alarm>;
export interface RecommendationItem {
  resourceId?: string;
  targetAccountId?: string;
  targetRegion?: string;
  alreadyImplemented?: boolean;
  excluded?: boolean;
  excludeReason?: ExcludeRecommendationReason;
  latestDiscoveredExperiment?: Experiment;
  discoveredAlarm?: Alarm;
}
export const RecommendationItem = S.suspend(() =>
  S.Struct({
    resourceId: S.optional(S.String),
    targetAccountId: S.optional(S.String),
    targetRegion: S.optional(S.String),
    alreadyImplemented: S.optional(S.Boolean),
    excluded: S.optional(S.Boolean),
    excludeReason: S.optional(ExcludeRecommendationReason),
    latestDiscoveredExperiment: S.optional(Experiment),
    discoveredAlarm: S.optional(Alarm),
  }),
).annotations({
  identifier: "RecommendationItem",
}) as any as S.Schema<RecommendationItem>;
export type RecommendationItemList = RecommendationItem[];
export const RecommendationItemList = S.Array(RecommendationItem);
export interface SopRecommendation {
  serviceType: SopServiceType;
  appComponentName?: string;
  description?: string;
  recommendationId: string;
  name?: string;
  items?: RecommendationItem[];
  referenceId: string;
  prerequisite?: string;
  recommendationStatus?: RecommendationStatus;
}
export const SopRecommendation = S.suspend(() =>
  S.Struct({
    serviceType: SopServiceType,
    appComponentName: S.optional(S.String),
    description: S.optional(S.String),
    recommendationId: S.String,
    name: S.optional(S.String),
    items: S.optional(RecommendationItemList),
    referenceId: S.String,
    prerequisite: S.optional(S.String),
    recommendationStatus: S.optional(RecommendationStatus),
  }),
).annotations({
  identifier: "SopRecommendation",
}) as any as S.Schema<SopRecommendation>;
export type SopRecommendationList = SopRecommendation[];
export const SopRecommendationList = S.Array(SopRecommendation);
export interface TestRecommendation {
  recommendationId?: string;
  referenceId: string;
  appComponentId?: string;
  appComponentName?: string;
  name?: string;
  intent?: string;
  risk?: TestRisk;
  type?: TestType;
  description?: string;
  items?: RecommendationItem[];
  prerequisite?: string;
  dependsOnAlarms?: string[];
  recommendationStatus?: RecommendationStatus;
}
export const TestRecommendation = S.suspend(() =>
  S.Struct({
    recommendationId: S.optional(S.String),
    referenceId: S.String,
    appComponentId: S.optional(S.String),
    appComponentName: S.optional(S.String),
    name: S.optional(S.String),
    intent: S.optional(S.String),
    risk: S.optional(TestRisk),
    type: S.optional(TestType),
    description: S.optional(S.String),
    items: S.optional(RecommendationItemList),
    prerequisite: S.optional(S.String),
    dependsOnAlarms: S.optional(AlarmReferenceIdList),
    recommendationStatus: S.optional(RecommendationStatus),
  }),
).annotations({
  identifier: "TestRecommendation",
}) as any as S.Schema<TestRecommendation>;
export type TestRecommendationList = TestRecommendation[];
export const TestRecommendationList = S.Array(TestRecommendation);
export interface UnsupportedResource {
  logicalResourceId: LogicalResourceId;
  physicalResourceId: PhysicalResourceId;
  resourceType: string;
  unsupportedResourceStatus?: string;
}
export const UnsupportedResource = S.suspend(() =>
  S.Struct({
    logicalResourceId: LogicalResourceId,
    physicalResourceId: PhysicalResourceId,
    resourceType: S.String,
    unsupportedResourceStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "UnsupportedResource",
}) as any as S.Schema<UnsupportedResource>;
export type UnsupportedResourceList = UnsupportedResource[];
export const UnsupportedResourceList = S.Array(UnsupportedResource);
export type ConfigRecommendationOptimizationType =
  | "LeastCost"
  | "LeastChange"
  | "BestAZRecovery"
  | "LeastErrors"
  | "BestAttainable"
  | "BestRegionRecovery"
  | (string & {});
export const ConfigRecommendationOptimizationType = S.String;
export type SuggestedChangesList = string[];
export const SuggestedChangesList = S.Array(S.String);
export type HaArchitecture =
  | "MultiSite"
  | "WarmStandby"
  | "PilotLight"
  | "BackupAndRestore"
  | "NoRecoveryPlan"
  | (string & {});
export const HaArchitecture = S.String;
export interface AddDraftAppVersionResourceMappingsRequest {
  appArn: string;
  resourceMappings: ResourceMapping[];
}
export const AddDraftAppVersionResourceMappingsRequest = S.suspend(() =>
  S.Struct({ appArn: S.String, resourceMappings: ResourceMappingList }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/add-draft-app-version-resource-mappings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddDraftAppVersionResourceMappingsRequest",
}) as any as S.Schema<AddDraftAppVersionResourceMappingsRequest>;
export interface BatchUpdateRecommendationStatusRequest {
  appArn: string;
  requestEntries: UpdateRecommendationStatusRequestEntry[];
}
export const BatchUpdateRecommendationStatusRequest = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    requestEntries: UpdateRecommendationStatusRequestEntries,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/batch-update-recommendation-status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateRecommendationStatusRequest",
}) as any as S.Schema<BatchUpdateRecommendationStatusRequest>;
export interface CreateAppResponse {
  app: App;
}
export const CreateAppResponse = S.suspend(() =>
  S.Struct({ app: App }),
).annotations({
  identifier: "CreateAppResponse",
}) as any as S.Schema<CreateAppResponse>;
export interface CreateAppVersionAppComponentResponse {
  appArn: string;
  appVersion: string;
  appComponent?: AppComponent;
}
export const CreateAppVersionAppComponentResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appComponent: S.optional(AppComponent),
  }),
).annotations({
  identifier: "CreateAppVersionAppComponentResponse",
}) as any as S.Schema<CreateAppVersionAppComponentResponse>;
export interface CreateAppVersionResourceResponse {
  appArn: string;
  appVersion: string;
  physicalResource?: PhysicalResource;
}
export const CreateAppVersionResourceResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    physicalResource: S.optional(PhysicalResource),
  }),
).annotations({
  identifier: "CreateAppVersionResourceResponse",
}) as any as S.Schema<CreateAppVersionResourceResponse>;
export interface CreateRecommendationTemplateResponse {
  recommendationTemplate?: RecommendationTemplate;
}
export const CreateRecommendationTemplateResponse = S.suspend(() =>
  S.Struct({ recommendationTemplate: S.optional(RecommendationTemplate) }),
).annotations({
  identifier: "CreateRecommendationTemplateResponse",
}) as any as S.Schema<CreateRecommendationTemplateResponse>;
export interface CreateResiliencyPolicyRequest {
  policyName: string;
  policyDescription?: string;
  dataLocationConstraint?: DataLocationConstraint;
  tier: ResiliencyPolicyTier;
  policy: { [key: string]: FailurePolicy | undefined };
  clientToken?: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateResiliencyPolicyRequest = S.suspend(() =>
  S.Struct({
    policyName: S.String,
    policyDescription: S.optional(S.String),
    dataLocationConstraint: S.optional(DataLocationConstraint),
    tier: ResiliencyPolicyTier,
    policy: DisruptionPolicy,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-resiliency-policy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResiliencyPolicyRequest",
}) as any as S.Schema<CreateResiliencyPolicyRequest>;
export interface DeleteAppInputSourceResponse {
  appArn?: string;
  appInputSource?: AppInputSource;
}
export const DeleteAppInputSourceResponse = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String),
    appInputSource: S.optional(AppInputSource),
  }),
).annotations({
  identifier: "DeleteAppInputSourceResponse",
}) as any as S.Schema<DeleteAppInputSourceResponse>;
export interface DeleteAppVersionAppComponentResponse {
  appArn: string;
  appVersion: string;
  appComponent?: AppComponent;
}
export const DeleteAppVersionAppComponentResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    appComponent: S.optional(AppComponent),
  }),
).annotations({
  identifier: "DeleteAppVersionAppComponentResponse",
}) as any as S.Schema<DeleteAppVersionAppComponentResponse>;
export interface DeleteAppVersionResourceResponse {
  appArn: string;
  appVersion: string;
  physicalResource?: PhysicalResource;
}
export const DeleteAppVersionResourceResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    physicalResource: S.optional(PhysicalResource),
  }),
).annotations({
  identifier: "DeleteAppVersionResourceResponse",
}) as any as S.Schema<DeleteAppVersionResourceResponse>;
export interface DescribeAppResponse {
  app: App;
}
export const DescribeAppResponse = S.suspend(() =>
  S.Struct({ app: App }),
).annotations({
  identifier: "DescribeAppResponse",
}) as any as S.Schema<DescribeAppResponse>;
export interface DescribeDraftAppVersionResourcesImportStatusResponse {
  appArn: string;
  appVersion: string;
  status: ResourceImportStatusType;
  statusChangeTime: Date;
  errorMessage?: string;
  errorDetails?: ErrorDetail[];
}
export const DescribeDraftAppVersionResourcesImportStatusResponse = S.suspend(
  () =>
    S.Struct({
      appArn: S.String,
      appVersion: S.String,
      status: ResourceImportStatusType,
      statusChangeTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      errorMessage: S.optional(S.String),
      errorDetails: S.optional(ErrorDetailList),
    }),
).annotations({
  identifier: "DescribeDraftAppVersionResourcesImportStatusResponse",
}) as any as S.Schema<DescribeDraftAppVersionResourcesImportStatusResponse>;
export interface DescribeMetricsExportResponse {
  metricsExportId: string;
  status: MetricsExportStatusType;
  exportLocation?: S3Location;
  errorMessage?: string;
}
export const DescribeMetricsExportResponse = S.suspend(() =>
  S.Struct({
    metricsExportId: S.String,
    status: MetricsExportStatusType,
    exportLocation: S.optional(S3Location),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeMetricsExportResponse",
}) as any as S.Schema<DescribeMetricsExportResponse>;
export interface DescribeResiliencyPolicyResponse {
  policy: ResiliencyPolicy;
}
export const DescribeResiliencyPolicyResponse = S.suspend(() =>
  S.Struct({ policy: ResiliencyPolicy }),
).annotations({
  identifier: "DescribeResiliencyPolicyResponse",
}) as any as S.Schema<DescribeResiliencyPolicyResponse>;
export interface ImportResourcesToDraftAppVersionResponse {
  appArn: string;
  appVersion: string;
  sourceArns?: string[];
  status: ResourceImportStatusType;
  terraformSources?: TerraformSource[];
  eksSources?: EksSource[];
}
export const ImportResourcesToDraftAppVersionResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    sourceArns: S.optional(ArnList),
    status: ResourceImportStatusType,
    terraformSources: S.optional(TerraformSourceList),
    eksSources: S.optional(EksSourceList),
  }),
).annotations({
  identifier: "ImportResourcesToDraftAppVersionResponse",
}) as any as S.Schema<ImportResourcesToDraftAppVersionResponse>;
export interface ListAppAssessmentComplianceDriftsResponse {
  complianceDrifts: ComplianceDrift[];
  nextToken?: string;
}
export const ListAppAssessmentComplianceDriftsResponse = S.suspend(() =>
  S.Struct({
    complianceDrifts: ComplianceDriftList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppAssessmentComplianceDriftsResponse",
}) as any as S.Schema<ListAppAssessmentComplianceDriftsResponse>;
export interface ListAppAssessmentsResponse {
  nextToken?: string;
  assessmentSummaries: AppAssessmentSummary[];
}
export const ListAppAssessmentsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    assessmentSummaries: AppAssessmentSummaryList,
  }),
).annotations({
  identifier: "ListAppAssessmentsResponse",
}) as any as S.Schema<ListAppAssessmentsResponse>;
export interface ListAppComponentCompliancesResponse {
  componentCompliances: AppComponentCompliance[];
  nextToken?: string;
}
export const ListAppComponentCompliancesResponse = S.suspend(() =>
  S.Struct({
    componentCompliances: ComponentCompliancesList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppComponentCompliancesResponse",
}) as any as S.Schema<ListAppComponentCompliancesResponse>;
export interface ListAppInputSourcesResponse {
  appInputSources: AppInputSource[];
  nextToken?: string;
}
export const ListAppInputSourcesResponse = S.suspend(() =>
  S.Struct({
    appInputSources: AppInputSourceList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppInputSourcesResponse",
}) as any as S.Schema<ListAppInputSourcesResponse>;
export interface ListAppsResponse {
  appSummaries: AppSummary[];
  nextToken?: string;
}
export const ListAppsResponse = S.suspend(() =>
  S.Struct({ appSummaries: AppSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAppsResponse",
}) as any as S.Schema<ListAppsResponse>;
export interface ListAppVersionsResponse {
  appVersions: AppVersionSummary[];
  nextToken?: string;
}
export const ListAppVersionsResponse = S.suspend(() =>
  S.Struct({ appVersions: AppVersionList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAppVersionsResponse",
}) as any as S.Schema<ListAppVersionsResponse>;
export interface ListMetricsResponse {
  rows: string[][];
  nextToken?: string;
}
export const ListMetricsResponse = S.suspend(() =>
  S.Struct({ rows: RowList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMetricsResponse",
}) as any as S.Schema<ListMetricsResponse>;
export interface ListSopRecommendationsResponse {
  nextToken?: string;
  sopRecommendations: SopRecommendation[];
}
export const ListSopRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    sopRecommendations: SopRecommendationList,
  }),
).annotations({
  identifier: "ListSopRecommendationsResponse",
}) as any as S.Schema<ListSopRecommendationsResponse>;
export interface ListTestRecommendationsResponse {
  nextToken?: string;
  testRecommendations: TestRecommendation[];
}
export const ListTestRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    testRecommendations: TestRecommendationList,
  }),
).annotations({
  identifier: "ListTestRecommendationsResponse",
}) as any as S.Schema<ListTestRecommendationsResponse>;
export interface ListUnsupportedAppVersionResourcesResponse {
  unsupportedResources: UnsupportedResource[];
  resolutionId: string;
  nextToken?: string;
}
export const ListUnsupportedAppVersionResourcesResponse = S.suspend(() =>
  S.Struct({
    unsupportedResources: UnsupportedResourceList,
    resolutionId: S.String,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUnsupportedAppVersionResourcesResponse",
}) as any as S.Schema<ListUnsupportedAppVersionResourcesResponse>;
export interface FailedGroupingRecommendationEntry {
  groupingRecommendationId: string;
  errorMessage: string;
}
export const FailedGroupingRecommendationEntry = S.suspend(() =>
  S.Struct({ groupingRecommendationId: S.String, errorMessage: S.String }),
).annotations({
  identifier: "FailedGroupingRecommendationEntry",
}) as any as S.Schema<FailedGroupingRecommendationEntry>;
export type FailedGroupingRecommendationEntries =
  FailedGroupingRecommendationEntry[];
export const FailedGroupingRecommendationEntries = S.Array(
  FailedGroupingRecommendationEntry,
);
export interface RejectResourceGroupingRecommendationsResponse {
  appArn: string;
  failedEntries: FailedGroupingRecommendationEntry[];
}
export const RejectResourceGroupingRecommendationsResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    failedEntries: FailedGroupingRecommendationEntries,
  }),
).annotations({
  identifier: "RejectResourceGroupingRecommendationsResponse",
}) as any as S.Schema<RejectResourceGroupingRecommendationsResponse>;
export interface ResourceIdentifier {
  logicalResourceId?: LogicalResourceId;
  resourceType?: string;
}
export const ResourceIdentifier = S.suspend(() =>
  S.Struct({
    logicalResourceId: S.optional(LogicalResourceId),
    resourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceIdentifier",
}) as any as S.Schema<ResourceIdentifier>;
export interface GroupingAppComponent {
  appComponentId: string;
  appComponentType: string;
  appComponentName: string;
}
export const GroupingAppComponent = S.suspend(() =>
  S.Struct({
    appComponentId: S.String,
    appComponentType: S.String,
    appComponentName: S.String,
  }),
).annotations({
  identifier: "GroupingAppComponent",
}) as any as S.Schema<GroupingAppComponent>;
export interface GroupingResource {
  resourceName: string;
  resourceType: string;
  physicalResourceId: PhysicalResourceId;
  logicalResourceId: LogicalResourceId;
  sourceAppComponentIds: string[];
}
export const GroupingResource = S.suspend(() =>
  S.Struct({
    resourceName: S.String,
    resourceType: S.String,
    physicalResourceId: PhysicalResourceId,
    logicalResourceId: LogicalResourceId,
    sourceAppComponentIds: String255List,
  }),
).annotations({
  identifier: "GroupingResource",
}) as any as S.Schema<GroupingResource>;
export type GroupingResourceList = GroupingResource[];
export const GroupingResourceList = S.Array(GroupingResource);
export interface ResourceDrift {
  appArn?: string;
  appVersion?: string;
  referenceId?: string;
  resourceIdentifier?: ResourceIdentifier;
  diffType?: DifferenceType;
}
export const ResourceDrift = S.suspend(() =>
  S.Struct({
    appArn: S.optional(S.String),
    appVersion: S.optional(S.String),
    referenceId: S.optional(S.String),
    resourceIdentifier: S.optional(ResourceIdentifier),
    diffType: S.optional(DifferenceType),
  }),
).annotations({
  identifier: "ResourceDrift",
}) as any as S.Schema<ResourceDrift>;
export type ResourceDriftList = ResourceDrift[];
export const ResourceDriftList = S.Array(ResourceDrift);
export interface GroupingRecommendation {
  groupingRecommendationId: string;
  groupingAppComponent: GroupingAppComponent;
  resources: GroupingResource[];
  score: number;
  recommendationReasons: string[];
  status: GroupingRecommendationStatusType;
  confidenceLevel: GroupingRecommendationConfidenceLevel;
  creationTime: Date;
  rejectionReason?: GroupingRecommendationRejectionReason;
}
export const GroupingRecommendation = S.suspend(() =>
  S.Struct({
    groupingRecommendationId: S.String,
    groupingAppComponent: GroupingAppComponent,
    resources: GroupingResourceList,
    score: S.Number,
    recommendationReasons: String255List,
    status: GroupingRecommendationStatusType,
    confidenceLevel: GroupingRecommendationConfidenceLevel,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    rejectionReason: S.optional(GroupingRecommendationRejectionReason),
  }),
).annotations({
  identifier: "GroupingRecommendation",
}) as any as S.Schema<GroupingRecommendation>;
export type GroupingRecommendationList = GroupingRecommendation[];
export const GroupingRecommendationList = S.Array(GroupingRecommendation);
export interface AcceptResourceGroupingRecommendationsResponse {
  appArn: string;
  failedEntries: FailedGroupingRecommendationEntry[];
}
export const AcceptResourceGroupingRecommendationsResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    failedEntries: FailedGroupingRecommendationEntries,
  }),
).annotations({
  identifier: "AcceptResourceGroupingRecommendationsResponse",
}) as any as S.Schema<AcceptResourceGroupingRecommendationsResponse>;
export interface AddDraftAppVersionResourceMappingsResponse {
  appArn: string;
  appVersion: string;
  resourceMappings: ResourceMapping[];
}
export const AddDraftAppVersionResourceMappingsResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    appVersion: S.String,
    resourceMappings: ResourceMappingList,
  }),
).annotations({
  identifier: "AddDraftAppVersionResourceMappingsResponse",
}) as any as S.Schema<AddDraftAppVersionResourceMappingsResponse>;
export interface CreateResiliencyPolicyResponse {
  policy: ResiliencyPolicy;
}
export const CreateResiliencyPolicyResponse = S.suspend(() =>
  S.Struct({ policy: ResiliencyPolicy }),
).annotations({
  identifier: "CreateResiliencyPolicyResponse",
}) as any as S.Schema<CreateResiliencyPolicyResponse>;
export interface ListAppAssessmentResourceDriftsResponse {
  resourceDrifts: ResourceDrift[];
  nextToken?: string;
}
export const ListAppAssessmentResourceDriftsResponse = S.suspend(() =>
  S.Struct({
    resourceDrifts: ResourceDriftList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppAssessmentResourceDriftsResponse",
}) as any as S.Schema<ListAppAssessmentResourceDriftsResponse>;
export interface ListResourceGroupingRecommendationsResponse {
  groupingRecommendations: GroupingRecommendation[];
  nextToken?: string;
}
export const ListResourceGroupingRecommendationsResponse = S.suspend(() =>
  S.Struct({
    groupingRecommendations: GroupingRecommendationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceGroupingRecommendationsResponse",
}) as any as S.Schema<ListResourceGroupingRecommendationsResponse>;
export interface RecommendationDisruptionCompliance {
  expectedComplianceStatus: ComplianceStatus;
  expectedRtoInSecs?: number;
  expectedRtoDescription?: string;
  expectedRpoInSecs?: number;
  expectedRpoDescription?: string;
}
export const RecommendationDisruptionCompliance = S.suspend(() =>
  S.Struct({
    expectedComplianceStatus: ComplianceStatus,
    expectedRtoInSecs: S.optional(S.Number),
    expectedRtoDescription: S.optional(S.String),
    expectedRpoInSecs: S.optional(S.Number),
    expectedRpoDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationDisruptionCompliance",
}) as any as S.Schema<RecommendationDisruptionCompliance>;
export interface BatchUpdateRecommendationStatusSuccessfulEntry {
  entryId: string;
  referenceId: string;
  item?: UpdateRecommendationStatusItem;
  excluded: boolean;
  appComponentId?: string;
  excludeReason?: ExcludeRecommendationReason;
}
export const BatchUpdateRecommendationStatusSuccessfulEntry = S.suspend(() =>
  S.Struct({
    entryId: S.String,
    referenceId: S.String,
    item: S.optional(UpdateRecommendationStatusItem),
    excluded: S.Boolean,
    appComponentId: S.optional(S.String),
    excludeReason: S.optional(ExcludeRecommendationReason),
  }),
).annotations({
  identifier: "BatchUpdateRecommendationStatusSuccessfulEntry",
}) as any as S.Schema<BatchUpdateRecommendationStatusSuccessfulEntry>;
export type BatchUpdateRecommendationStatusSuccessfulEntries =
  BatchUpdateRecommendationStatusSuccessfulEntry[];
export const BatchUpdateRecommendationStatusSuccessfulEntries = S.Array(
  BatchUpdateRecommendationStatusSuccessfulEntry,
);
export interface BatchUpdateRecommendationStatusFailedEntry {
  entryId: string;
  errorMessage: string;
}
export const BatchUpdateRecommendationStatusFailedEntry = S.suspend(() =>
  S.Struct({ entryId: S.String, errorMessage: S.String }),
).annotations({
  identifier: "BatchUpdateRecommendationStatusFailedEntry",
}) as any as S.Schema<BatchUpdateRecommendationStatusFailedEntry>;
export type BatchUpdateRecommendationStatusFailedEntries =
  BatchUpdateRecommendationStatusFailedEntry[];
export const BatchUpdateRecommendationStatusFailedEntries = S.Array(
  BatchUpdateRecommendationStatusFailedEntry,
);
export interface AlarmRecommendation {
  recommendationId: string;
  referenceId: string;
  name: string;
  description?: string;
  type: AlarmType;
  appComponentName?: string;
  items?: RecommendationItem[];
  prerequisite?: string;
  appComponentNames?: string[];
  recommendationStatus?: RecommendationStatus;
}
export const AlarmRecommendation = S.suspend(() =>
  S.Struct({
    recommendationId: S.String,
    referenceId: S.String,
    name: S.String,
    description: S.optional(S.String),
    type: AlarmType,
    appComponentName: S.optional(S.String),
    items: S.optional(RecommendationItemList),
    prerequisite: S.optional(S.String),
    appComponentNames: S.optional(AppComponentNameList),
    recommendationStatus: S.optional(RecommendationStatus),
  }),
).annotations({
  identifier: "AlarmRecommendation",
}) as any as S.Schema<AlarmRecommendation>;
export type AlarmRecommendationList = AlarmRecommendation[];
export const AlarmRecommendationList = S.Array(AlarmRecommendation);
export type RecommendationCompliance = {
  [key in DisruptionType]?: RecommendationDisruptionCompliance;
};
export const RecommendationCompliance = S.partial(
  S.Record({
    key: DisruptionType,
    value: S.UndefinedOr(RecommendationDisruptionCompliance),
  }),
);
export interface BatchUpdateRecommendationStatusResponse {
  appArn: string;
  successfulEntries: BatchUpdateRecommendationStatusSuccessfulEntry[];
  failedEntries: BatchUpdateRecommendationStatusFailedEntry[];
}
export const BatchUpdateRecommendationStatusResponse = S.suspend(() =>
  S.Struct({
    appArn: S.String,
    successfulEntries: BatchUpdateRecommendationStatusSuccessfulEntries,
    failedEntries: BatchUpdateRecommendationStatusFailedEntries,
  }),
).annotations({
  identifier: "BatchUpdateRecommendationStatusResponse",
}) as any as S.Schema<BatchUpdateRecommendationStatusResponse>;
export interface ListAlarmRecommendationsResponse {
  alarmRecommendations: AlarmRecommendation[];
  nextToken?: string;
}
export const ListAlarmRecommendationsResponse = S.suspend(() =>
  S.Struct({
    alarmRecommendations: AlarmRecommendationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAlarmRecommendationsResponse",
}) as any as S.Schema<ListAlarmRecommendationsResponse>;
export interface ConfigRecommendation {
  cost?: Cost;
  appComponentName?: string;
  compliance?: { [key: string]: DisruptionCompliance | undefined };
  recommendationCompliance?: {
    [key: string]: RecommendationDisruptionCompliance | undefined;
  };
  optimizationType: ConfigRecommendationOptimizationType;
  name: string;
  description?: string;
  suggestedChanges?: string[];
  haArchitecture?: HaArchitecture;
  referenceId: string;
}
export const ConfigRecommendation = S.suspend(() =>
  S.Struct({
    cost: S.optional(Cost),
    appComponentName: S.optional(S.String),
    compliance: S.optional(AssessmentCompliance),
    recommendationCompliance: S.optional(RecommendationCompliance),
    optimizationType: ConfigRecommendationOptimizationType,
    name: S.String,
    description: S.optional(S.String),
    suggestedChanges: S.optional(SuggestedChangesList),
    haArchitecture: S.optional(HaArchitecture),
    referenceId: S.String,
  }),
).annotations({
  identifier: "ConfigRecommendation",
}) as any as S.Schema<ConfigRecommendation>;
export type ConfigRecommendationList = ConfigRecommendation[];
export const ConfigRecommendationList = S.Array(ConfigRecommendation);
export interface ComponentRecommendation {
  appComponentName: string;
  recommendationStatus: RecommendationComplianceStatus;
  configRecommendations: ConfigRecommendation[];
}
export const ComponentRecommendation = S.suspend(() =>
  S.Struct({
    appComponentName: S.String,
    recommendationStatus: RecommendationComplianceStatus,
    configRecommendations: ConfigRecommendationList,
  }),
).annotations({
  identifier: "ComponentRecommendation",
}) as any as S.Schema<ComponentRecommendation>;
export type ComponentRecommendationList = ComponentRecommendation[];
export const ComponentRecommendationList = S.Array(ComponentRecommendation);
export interface DescribeAppAssessmentResponse {
  assessment: AppAssessment;
}
export const DescribeAppAssessmentResponse = S.suspend(() =>
  S.Struct({ assessment: AppAssessment }),
).annotations({
  identifier: "DescribeAppAssessmentResponse",
}) as any as S.Schema<DescribeAppAssessmentResponse>;
export interface ListAppComponentRecommendationsResponse {
  componentRecommendations: ComponentRecommendation[];
  nextToken?: string;
}
export const ListAppComponentRecommendationsResponse = S.suspend(() =>
  S.Struct({
    componentRecommendations: ComponentRecommendationList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAppComponentRecommendationsResponse",
}) as any as S.Schema<ListAppComponentRecommendationsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String), retryAfterSeconds: S.optional(S.Number) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the recommendation templates for the Resilience Hub applications.
 */
export const listRecommendationTemplates: {
  (
    input: ListRecommendationTemplatesRequest,
  ): effect.Effect<
    ListRecommendationTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationTemplatesRequest,
  ) => stream.Stream<
    ListRecommendationTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationTemplatesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendationTemplatesRequest,
  output: ListRecommendationTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an application.
 */
export const updateApp: (
  input: UpdateAppRequest,
) => effect.Effect<
  UpdateAppResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppRequest,
  output: UpdateAppResponse,
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
 * Updates the Resilience Hub application version.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * information for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const updateAppVersion: (
  input: UpdateAppVersionRequest,
) => effect.Effect<
  UpdateAppVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppVersionRequest,
  output: UpdateAppVersionResponse,
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
 * Updates an existing Application Component in the Resilience Hub application.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const updateAppVersionAppComponent: (
  input: UpdateAppVersionAppComponentRequest,
) => effect.Effect<
  UpdateAppVersionAppComponentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppVersionAppComponentRequest,
  output: UpdateAppVersionAppComponentResponse,
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
 * Updates the resource details in the Resilience Hub application.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - To update application version with new `physicalResourceID`, you must
 * call `ResolveAppVersionResources` API.
 */
export const updateAppVersionResource: (
  input: UpdateAppVersionResourceRequest,
) => effect.Effect<
  UpdateAppVersionResourceResponse,
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
  input: UpdateAppVersionResourceRequest,
  output: UpdateAppVersionResourceResponse,
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
 * Updates a resiliency policy.
 *
 * Resilience Hub allows you to provide a value of zero for `rtoInSecs`
 * and `rpoInSecs` of your resiliency policy. But, while assessing your application,
 * the lowest possible assessment result is near zero. Hence, if you provide value zero for
 * `rtoInSecs` and `rpoInSecs`, the estimated workload RTO and
 * estimated workload RPO result will be near zero and the Compliance
 * status for your application will be set to Policy
 * breached.
 */
export const updateResiliencyPolicy: (
  input: UpdateResiliencyPolicyRequest,
) => effect.Effect<
  UpdateResiliencyPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResiliencyPolicyRequest,
  output: UpdateResiliencyPolicyResponse,
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
 * Deletes an Resilience Hub application assessment. This is a destructive action
 * that can't be undone.
 */
export const deleteAppAssessment: (
  input: DeleteAppAssessmentRequest,
) => effect.Effect<
  DeleteAppAssessmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppAssessmentRequest,
  output: DeleteAppAssessmentResponse,
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
 * Deletes a resiliency policy. This is a destructive action that can't be undone.
 */
export const deleteResiliencyPolicy: (
  input: DeleteResiliencyPolicyRequest,
) => effect.Effect<
  DeleteResiliencyPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResiliencyPolicyRequest,
  output: DeleteResiliencyPolicyResponse,
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
 * Describes an Application Component in the Resilience Hub application.
 */
export const describeAppVersionAppComponent: (
  input: DescribeAppVersionAppComponentRequest,
) => effect.Effect<
  DescribeAppVersionAppComponentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionAppComponentRequest,
  output: DescribeAppVersionAppComponentResponse,
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
 * Describes a resource of the Resilience Hub application.
 *
 * This API accepts only one of the following parameters to describe the resource:
 *
 * - `resourceName`
 *
 * - `logicalResourceId`
 *
 * - `physicalResourceId` (Along with `physicalResourceId`, you can
 * also provide `awsAccountId`, and `awsRegion`)
 */
export const describeAppVersionResource: (
  input: DescribeAppVersionResourceRequest,
) => effect.Effect<
  DescribeAppVersionResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionResourceRequest,
  output: DescribeAppVersionResourceResponse,
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
 * Lists all the Application Components in the Resilience Hub application.
 */
export const listAppVersionAppComponents: {
  (
    input: ListAppVersionAppComponentsRequest,
  ): effect.Effect<
    ListAppVersionAppComponentsResponse,
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
    input: ListAppVersionAppComponentsRequest,
  ) => stream.Stream<
    ListAppVersionAppComponentsResponse,
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
    input: ListAppVersionAppComponentsRequest,
  ) => stream.Stream<
    unknown,
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
  input: ListAppVersionAppComponentsRequest,
  output: ListAppVersionAppComponentsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the resources in an Resilience Hub application.
 */
export const listAppVersionResources: {
  (
    input: ListAppVersionResourcesRequest,
  ): effect.Effect<
    ListAppVersionResourcesResponse,
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
    input: ListAppVersionResourcesRequest,
  ) => stream.Stream<
    ListAppVersionResourcesResponse,
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
    input: ListAppVersionResourcesRequest,
  ) => stream.Stream<
    unknown,
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
  input: ListAppVersionResourcesRequest,
  output: ListAppVersionResourcesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Publishes a new version of a specific Resilience Hub application.
 */
export const publishAppVersion: (
  input: PublishAppVersionRequest,
) => effect.Effect<
  PublishAppVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishAppVersionRequest,
  output: PublishAppVersionResponse,
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
 * Adds or updates the app template for an Resilience Hub application draft
 * version.
 */
export const putDraftAppVersionTemplate: (
  input: PutDraftAppVersionTemplateRequest,
) => effect.Effect<
  PutDraftAppVersionTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDraftAppVersionTemplateRequest,
  output: PutDraftAppVersionTemplateResponse,
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
 * Removes resource mappings from a draft application version.
 */
export const removeDraftAppVersionResourceMappings: (
  input: RemoveDraftAppVersionResourceMappingsRequest,
) => effect.Effect<
  RemoveDraftAppVersionResourceMappingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveDraftAppVersionResourceMappingsRequest,
  output: RemoveDraftAppVersionResourceMappingsResponse,
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
 * Resolves the resources for an application version.
 */
export const resolveAppVersionResources: (
  input: ResolveAppVersionResourcesRequest,
) => effect.Effect<
  ResolveAppVersionResourcesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResolveAppVersionResourcesRequest,
  output: ResolveAppVersionResourcesResponse,
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
 * Creates a new application assessment for an application.
 */
export const startAppAssessment: (
  input: StartAppAssessmentRequest,
) => effect.Effect<
  StartAppAssessmentResponse,
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
  input: StartAppAssessmentRequest,
  output: StartAppAssessmentResponse,
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
 * Starts grouping recommendation task.
 */
export const startResourceGroupingRecommendationTask: (
  input: StartResourceGroupingRecommendationTaskRequest,
) => effect.Effect<
  StartResourceGroupingRecommendationTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceGroupingRecommendationTaskRequest,
  output: StartResourceGroupingRecommendationTaskResponse,
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
 * Creates an Resilience Hub application. An Resilience Hub application is a
 * collection of Amazon Web Services resources structured to prevent and recover Amazon Web Services application disruptions. To describe a Resilience Hub application, you provide an
 * application name, resources from one or more CloudFormation stacks, Resource Groups, Terraform state files, AppRegistry applications, and an appropriate
 * resiliency policy. In addition, you can also add resources that are located on Amazon Elastic Kubernetes Service (Amazon EKS) clusters as optional resources. For more information
 * about the number of resources supported per application, see Service
 * quotas.
 *
 * After you create an Resilience Hub application, you publish it so that you can run
 * a resiliency assessment on it. You can then use recommendations from the assessment to improve
 * resiliency by running another assessment, comparing results, and then iterating the process
 * until you achieve your goals for recovery time objective (RTO) and recovery point objective
 * (RPO).
 */
export const createApp: (
  input: CreateAppRequest,
) => effect.Effect<
  CreateAppResponse,
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
  input: CreateAppRequest,
  output: CreateAppResponse,
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
 * Creates a new Application Component in the Resilience Hub application.
 *
 * This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const createAppVersionAppComponent: (
  input: CreateAppVersionAppComponentRequest,
) => effect.Effect<
  CreateAppVersionAppComponentResponse,
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
  input: CreateAppVersionAppComponentRequest,
  output: CreateAppVersionAppComponentResponse,
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
 * Adds a resource to the Resilience Hub application and assigns it to the specified
 * Application Components. If you specify a new Application Component, Resilience Hub will
 * automatically create the Application Component.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - To update application version with new `physicalResourceID`, you must
 * call `ResolveAppVersionResources` API.
 */
export const createAppVersionResource: (
  input: CreateAppVersionResourceRequest,
) => effect.Effect<
  CreateAppVersionResourceResponse,
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
  input: CreateAppVersionResourceRequest,
  output: CreateAppVersionResourceResponse,
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
 * Creates a new recommendation template for the Resilience Hub application.
 */
export const createRecommendationTemplate: (
  input: CreateRecommendationTemplateRequest,
) => effect.Effect<
  CreateRecommendationTemplateResponse,
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
  input: CreateRecommendationTemplateRequest,
  output: CreateRecommendationTemplateResponse,
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
 * Removes one or more tags from a resource.
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
 * Deletes a recommendation template. This is a destructive action that can't be
 * undone.
 */
export const deleteRecommendationTemplate: (
  input: DeleteRecommendationTemplateRequest,
) => effect.Effect<
  DeleteRecommendationTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecommendationTemplateRequest,
  output: DeleteRecommendationTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the Resilience Hub application version.
 */
export const describeAppVersion: (
  input: DescribeAppVersionRequest,
) => effect.Effect<
  DescribeAppVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionRequest,
  output: DescribeAppVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resolution status for the specified resolution identifier for an application
 * version. If `resolutionId` is not specified, the current resolution status is
 * returned.
 */
export const describeAppVersionResourcesResolutionStatus: (
  input: DescribeAppVersionResourcesResolutionStatusRequest,
) => effect.Effect<
  DescribeAppVersionResourcesResolutionStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionResourcesResolutionStatusRequest,
  output: DescribeAppVersionResourcesResolutionStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes details about an Resilience Hub application.
 */
export const describeAppVersionTemplate: (
  input: DescribeAppVersionTemplateRequest,
) => effect.Effect<
  DescribeAppVersionTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppVersionTemplateRequest,
  output: DescribeAppVersionTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the resource grouping recommendation tasks run by Resilience Hub for your application.
 */
export const describeResourceGroupingRecommendationTask: (
  input: DescribeResourceGroupingRecommendationTaskRequest,
) => effect.Effect<
  DescribeResourceGroupingRecommendationTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceGroupingRecommendationTaskRequest,
  output: DescribeResourceGroupingRecommendationTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists how the resources in an application version are mapped/sourced from. Mappings can be
 * physical resource identifiers, CloudFormation stacks, resource-groups, or an application registry
 * app.
 */
export const listAppVersionResourceMappings: {
  (
    input: ListAppVersionResourceMappingsRequest,
  ): effect.Effect<
    ListAppVersionResourceMappingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppVersionResourceMappingsRequest,
  ) => stream.Stream<
    ListAppVersionResourceMappingsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppVersionResourceMappingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppVersionResourceMappingsRequest,
  output: ListAppVersionResourceMappingsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the resiliency policies for the Resilience Hub applications.
 */
export const listResiliencyPolicies: {
  (
    input: ListResiliencyPoliciesRequest,
  ): effect.Effect<
    ListResiliencyPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResiliencyPoliciesRequest,
  ) => stream.Stream<
    ListResiliencyPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResiliencyPoliciesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResiliencyPoliciesRequest,
  output: ListResiliencyPoliciesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the suggested resiliency policies for the Resilience Hub
 * applications.
 */
export const listSuggestedResiliencyPolicies: {
  (
    input: ListSuggestedResiliencyPoliciesRequest,
  ): effect.Effect<
    ListSuggestedResiliencyPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSuggestedResiliencyPoliciesRequest,
  ) => stream.Stream<
    ListSuggestedResiliencyPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSuggestedResiliencyPoliciesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSuggestedResiliencyPoliciesRequest,
  output: ListSuggestedResiliencyPoliciesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the tags for your resources in your Resilience Hub applications.
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
 * Deletes an Resilience Hub application. This is a destructive action that can't be
 * undone.
 */
export const deleteApp: (
  input: DeleteAppRequest,
) => effect.Effect<
  DeleteAppResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppRequest,
  output: DeleteAppResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the input source and all of its imported resources from the Resilience Hub
 * application.
 */
export const deleteAppInputSource: (
  input: DeleteAppInputSourceRequest,
) => effect.Effect<
  DeleteAppInputSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInputSourceRequest,
  output: DeleteAppInputSourceResponse,
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
 * Deletes an Application Component from the Resilience Hub application.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * Application Component for running assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 *
 * - You will not be able to delete an Application Component if it has resources associated
 * with it.
 */
export const deleteAppVersionAppComponent: (
  input: DeleteAppVersionAppComponentRequest,
) => effect.Effect<
  DeleteAppVersionAppComponentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppVersionAppComponentRequest,
  output: DeleteAppVersionAppComponentResponse,
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
 * Deletes a resource from the Resilience Hub application.
 *
 * - You can only delete a manually added resource. To exclude non-manually added
 * resources, use the `UpdateAppVersionResource` API.
 *
 * - This action has no effect outside Resilience Hub.
 *
 * - This API updates the Resilience Hub application draft version. To use this
 * resource for running resiliency assessments, you must publish the Resilience Hub
 * application using the `PublishAppVersion` API.
 */
export const deleteAppVersionResource: (
  input: DeleteAppVersionResourceRequest,
) => effect.Effect<
  DeleteAppVersionResourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppVersionResourceRequest,
  output: DeleteAppVersionResourceResponse,
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
 * Describes an Resilience Hub application.
 */
export const describeApp: (
  input: DescribeAppRequest,
) => effect.Effect<
  DescribeAppResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppRequest,
  output: DescribeAppResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the status of importing resources to an application version.
 *
 * If you get a 404 error with
 * `ResourceImportStatusNotFoundAppMetadataException`, you must call
 * `importResourcesToDraftAppVersion` after creating the application and before
 * calling `describeDraftAppVersionResourcesImportStatus` to obtain the
 * status.
 */
export const describeDraftAppVersionResourcesImportStatus: (
  input: DescribeDraftAppVersionResourcesImportStatusRequest,
) => effect.Effect<
  DescribeDraftAppVersionResourcesImportStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDraftAppVersionResourcesImportStatusRequest,
  output: DescribeDraftAppVersionResourcesImportStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the metrics of the application configuration being exported.
 */
export const describeMetricsExport: (
  input: DescribeMetricsExportRequest,
) => effect.Effect<
  DescribeMetricsExportResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMetricsExportRequest,
  output: DescribeMetricsExportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes a specified resiliency policy for an Resilience Hub application. The
 * returned policy object includes creation time, data location constraints, the Amazon Resource
 * Name (ARN) for the policy, tags, tier, and more.
 */
export const describeResiliencyPolicy: (
  input: DescribeResiliencyPolicyRequest,
) => effect.Effect<
  DescribeResiliencyPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResiliencyPolicyRequest,
  output: DescribeResiliencyPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Imports resources to Resilience Hub application draft version from different input
 * sources. For more information about the input sources supported by Resilience Hub, see
 * Discover the structure and describe your Resilience Hub application.
 */
export const importResourcesToDraftAppVersion: (
  input: ImportResourcesToDraftAppVersionRequest,
) => effect.Effect<
  ImportResourcesToDraftAppVersionResponse,
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
  input: ImportResourcesToDraftAppVersionRequest,
  output: ImportResourcesToDraftAppVersionResponse,
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
 * Lists the assessments for an Resilience Hub application. You can use request
 * parameters to refine the results for the response object.
 */
export const listAppAssessments: {
  (
    input: ListAppAssessmentsRequest,
  ): effect.Effect<
    ListAppAssessmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppAssessmentsRequest,
  ) => stream.Stream<
    ListAppAssessmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppAssessmentsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppAssessmentsRequest,
  output: ListAppAssessmentsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the compliances for an Resilience Hub Application Component.
 */
export const listAppComponentCompliances: {
  (
    input: ListAppComponentCompliancesRequest,
  ): effect.Effect<
    ListAppComponentCompliancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppComponentCompliancesRequest,
  ) => stream.Stream<
    ListAppComponentCompliancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppComponentCompliancesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppComponentCompliancesRequest,
  output: ListAppComponentCompliancesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the input sources of the Resilience Hub application. For more
 * information about the input sources supported by Resilience Hub, see Discover
 * the structure and describe your Resilience Hub application.
 */
export const listAppInputSources: {
  (
    input: ListAppInputSourcesRequest,
  ): effect.Effect<
    ListAppInputSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppInputSourcesRequest,
  ) => stream.Stream<
    ListAppInputSourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppInputSourcesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppInputSourcesRequest,
  output: ListAppInputSourcesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the different versions for the Resilience Hub applications.
 */
export const listAppVersions: {
  (
    input: ListAppVersionsRequest,
  ): effect.Effect<
    ListAppVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppVersionsRequest,
  ) => stream.Stream<
    ListAppVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppVersionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppVersionsRequest,
  output: ListAppVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the standard operating procedure (SOP) recommendations for the Resilience Hub applications.
 */
export const listSopRecommendations: {
  (
    input: ListSopRecommendationsRequest,
  ): effect.Effect<
    ListSopRecommendationsResponse,
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
    input: ListSopRecommendationsRequest,
  ) => stream.Stream<
    ListSopRecommendationsResponse,
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
    input: ListSopRecommendationsRequest,
  ) => stream.Stream<
    unknown,
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
  input: ListSopRecommendationsRequest,
  output: ListSopRecommendationsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the test recommendations for the Resilience Hub application.
 */
export const listTestRecommendations: {
  (
    input: ListTestRecommendationsRequest,
  ): effect.Effect<
    ListTestRecommendationsResponse,
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
    input: ListTestRecommendationsRequest,
  ) => stream.Stream<
    ListTestRecommendationsResponse,
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
    input: ListTestRecommendationsRequest,
  ) => stream.Stream<
    unknown,
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
  input: ListTestRecommendationsRequest,
  output: ListTestRecommendationsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the resources that are not currently supported in Resilience Hub. An
 * unsupported resource is a resource that exists in the object that was used to create an app,
 * but is not supported by Resilience Hub.
 */
export const listUnsupportedAppVersionResources: {
  (
    input: ListUnsupportedAppVersionResourcesRequest,
  ): effect.Effect<
    ListUnsupportedAppVersionResourcesResponse,
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
    input: ListUnsupportedAppVersionResourcesRequest,
  ) => stream.Stream<
    ListUnsupportedAppVersionResourcesResponse,
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
    input: ListUnsupportedAppVersionResourcesRequest,
  ) => stream.Stream<
    unknown,
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
  input: ListUnsupportedAppVersionResourcesRequest,
  output: ListUnsupportedAppVersionResourcesResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Rejects resource grouping recommendations.
 */
export const rejectResourceGroupingRecommendations: (
  input: RejectResourceGroupingRecommendationsRequest,
) => effect.Effect<
  RejectResourceGroupingRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectResourceGroupingRecommendationsRequest,
  output: RejectResourceGroupingRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Accepts the resource grouping recommendations suggested by Resilience Hub for your application.
 */
export const acceptResourceGroupingRecommendations: (
  input: AcceptResourceGroupingRecommendationsRequest,
) => effect.Effect<
  AcceptResourceGroupingRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptResourceGroupingRecommendationsRequest,
  output: AcceptResourceGroupingRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds the source of resource-maps to the draft version of an application. During
 * assessment, Resilience Hub will use these resource-maps to resolve the latest physical
 * ID for each resource in the application template. For more information about different types
 * of resources supported by Resilience Hub and how to add them in your application, see
 * Step
 * 2: How is your application managed? in the Resilience Hub User Guide.
 */
export const addDraftAppVersionResourceMappings: (
  input: AddDraftAppVersionResourceMappingsRequest,
) => effect.Effect<
  AddDraftAppVersionResourceMappingsResponse,
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
  input: AddDraftAppVersionResourceMappingsRequest,
  output: AddDraftAppVersionResourceMappingsResponse,
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
 * Lists the resource grouping recommendations suggested by Resilience Hub for your application.
 */
export const listResourceGroupingRecommendations: {
  (
    input: ListResourceGroupingRecommendationsRequest,
  ): effect.Effect<
    ListResourceGroupingRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceGroupingRecommendationsRequest,
  ) => stream.Stream<
    ListResourceGroupingRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceGroupingRecommendationsRequest,
  ) => stream.Stream<
    GroupingRecommendation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceGroupingRecommendationsRequest,
  output: ListResourceGroupingRecommendationsResponse,
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
    items: "groupingRecommendations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a resiliency policy for an application.
 *
 * Resilience Hub allows you to provide a value of zero for `rtoInSecs`
 * and `rpoInSecs` of your resiliency policy. But, while assessing your application,
 * the lowest possible assessment result is near zero. Hence, if you provide value zero for
 * `rtoInSecs` and `rpoInSecs`, the estimated workload RTO and
 * estimated workload RPO result will be near zero and the Compliance
 * status for your application will be set to Policy
 * breached.
 */
export const createResiliencyPolicy: (
  input: CreateResiliencyPolicyRequest,
) => effect.Effect<
  CreateResiliencyPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResiliencyPolicyRequest,
  output: CreateResiliencyPolicyResponse,
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
 * List of compliance drifts that were detected while running an
 * assessment.
 */
export const listAppAssessmentComplianceDrifts: {
  (
    input: ListAppAssessmentComplianceDriftsRequest,
  ): effect.Effect<
    ListAppAssessmentComplianceDriftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppAssessmentComplianceDriftsRequest,
  ) => stream.Stream<
    ListAppAssessmentComplianceDriftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppAssessmentComplianceDriftsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppAssessmentComplianceDriftsRequest,
  output: ListAppAssessmentComplianceDriftsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your Resilience Hub applications.
 *
 * You can filter applications using only one filter at a time or without using any filter.
 * If you try to filter applications using multiple filters, you will get the following
 * error:
 *
 * An error occurred (ValidationException) when calling the ListApps operation: Only
 * one filter is supported for this operation.
 */
export const listApps: {
  (
    input: ListAppsRequest,
  ): effect.Effect<
    ListAppsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppsRequest,
  ) => stream.Stream<
    ListAppsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppsRequest,
  output: ListAppsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the metrics that can be exported.
 */
export const listMetrics: {
  (
    input: ListMetricsRequest,
  ): effect.Effect<
    ListMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetricsRequest,
  ) => stream.Stream<
    ListMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMetricsRequest,
  ) => stream.Stream<
    String255[],
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetricsRequest,
  output: ListMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "rows",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List of resource drifts that were detected while running an
 * assessment.
 */
export const listAppAssessmentResourceDrifts: {
  (
    input: ListAppAssessmentResourceDriftsRequest,
  ): effect.Effect<
    ListAppAssessmentResourceDriftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppAssessmentResourceDriftsRequest,
  ) => stream.Stream<
    ListAppAssessmentResourceDriftsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppAssessmentResourceDriftsRequest,
  ) => stream.Stream<
    ResourceDrift,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppAssessmentResourceDriftsRequest,
  output: ListAppAssessmentResourceDriftsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resourceDrifts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Applies one or more tags to a resource.
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
 * Initiates the export task of metrics.
 */
export const startMetricsExport: (
  input: StartMetricsExportRequest,
) => effect.Effect<
  StartMetricsExportResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMetricsExportRequest,
  output: StartMetricsExportResponse,
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
 * Enables you to include or exclude one or more operational recommendations.
 */
export const batchUpdateRecommendationStatus: (
  input: BatchUpdateRecommendationStatusRequest,
) => effect.Effect<
  BatchUpdateRecommendationStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateRecommendationStatusRequest,
  output: BatchUpdateRecommendationStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the alarm recommendations for an Resilience Hub application.
 */
export const listAlarmRecommendations: {
  (
    input: ListAlarmRecommendationsRequest,
  ): effect.Effect<
    ListAlarmRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAlarmRecommendationsRequest,
  ) => stream.Stream<
    ListAlarmRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAlarmRecommendationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAlarmRecommendationsRequest,
  output: ListAlarmRecommendationsResponse,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes an assessment for an Resilience Hub application.
 */
export const describeAppAssessment: (
  input: DescribeAppAssessmentRequest,
) => effect.Effect<
  DescribeAppAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppAssessmentRequest,
  output: DescribeAppAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the recommendations for an Resilience Hub Application Component.
 */
export const listAppComponentRecommendations: {
  (
    input: ListAppComponentRecommendationsRequest,
  ): effect.Effect<
    ListAppComponentRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppComponentRecommendationsRequest,
  ) => stream.Stream<
    ListAppComponentRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppComponentRecommendationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppComponentRecommendationsRequest,
  output: ListAppComponentRecommendationsResponse,
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
    pageSize: "maxResults",
  } as const,
}));

import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "fis",
  serviceShapeName: "FaultInjectionSimulator",
});
const auth = T.AwsAuthSigv4({ name: "fis" });
const ver = T.ServiceVersion("2020-12-01");
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
              `https://fis-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://fis.${Region}.amazonaws.com`);
            }
            return e(
              `https://fis-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://fis.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://fis.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientToken = string;
export type ExperimentTemplateDescription = string;
export type RoleArn = string;
export type ExperimentTemplateId = string;
export type TargetAccountId = string;
export type TargetAccountConfigurationDescription = string;
export type ActionId = string;
export type ExperimentId = string;
export type SafetyLeverId = string;
export type TargetResourceTypeId = string;
export type ListActionsMaxResults = number;
export type NextToken = string;
export type ListExperimentResolvedTargetsMaxResults = number;
export type TargetName = string;
export type ListExperimentsMaxResults = number;
export type ListExperimentTemplatesMaxResults = number;
export type ResourceArn = string;
export type ListTargetAccountConfigurationsMaxResults = number;
export type ListTargetResourceTypesMaxResults = number;
export type TagKey = string;
export type StopConditionSource = string;
export type StopConditionValue = string;
export type ExperimentTemplateTargetName = string;
export type ExperimentTemplateActionName = string;
export type TagValue = string;
export type LogSchemaVersion = number;
export type ReportConfigurationDuration = string;
export type SafetyLeverStatusReason = string;
export type ExperimentTemplateTargetSelectionMode = string;
export type ExperimentTemplateActionDescription = string;
export type ExperimentTemplateActionStartAfter = string;
export type CloudWatchLogGroupArn = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type TargetAccountConfigurationsCount = number;
export type ActionDescription = string;
export type TargetResourceTypeDescription = string;
export type ExperimentTemplateTargetFilterPath = string;
export type ExperimentTemplateTargetFilterValue = string;
export type ExperimentTemplateTargetParameterName = string;
export type ExperimentTemplateTargetParameterValue = string;
export type ExperimentTemplateActionParameterName = string;
export type ExperimentTemplateActionParameter = string;
export type ExperimentTemplateActionTargetName = string;
export type ReportConfigurationS3OutputPrefix = string;
export type ReportConfigurationCloudWatchDashboardIdentifier = string;
export type ExceptionMessage = string;
export type ActionParameterName = string;
export type ActionTargetName = string;
export type ExperimentStatusReason = string;
export type ExperimentTargetName = string;
export type ExperimentActionName = string;
export type TargetResourceTypeParameterName = string;
export type TargetInformationKey = string;
export type TargetInformationValue = string;
export type ActionParameterDescription = string;
export type ExperimentErrorAccountId = string;
export type ExperimentErrorCode = string;
export type ExperimentErrorLocation = string;
export type ExperimentTargetSelectionMode = string;
export type ExperimentActionDescription = string;
export type ExperimentActionStartAfter = string;
export type ExperimentReportReason = string;
export type ExperimentReportS3ReportArn = string;
export type ExperimentReportS3ReportType = string;
export type TargetResourceTypeParameterDescription = string;
export type ExperimentTargetFilterPath = string;
export type ExperimentTargetFilterValue = string;
export type ExperimentTargetParameterName = string;
export type ExperimentTargetParameterValue = string;
export type ExperimentActionParameterName = string;
export type ExperimentActionParameter = string;
export type ExperimentActionTargetName = string;
export type ExperimentActionStatusReason = string;
export type ExperimentReportErrorCode = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateTargetAccountConfigurationRequest {
  clientToken?: string;
  experimentTemplateId: string;
  accountId: string;
  roleArn: string;
  description?: string;
}
export const CreateTargetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    experimentTemplateId: S.String.pipe(T.HttpLabel("experimentTemplateId")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    roleArn: S.String,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTargetAccountConfigurationRequest",
}) as any as S.Schema<CreateTargetAccountConfigurationRequest>;
export interface DeleteExperimentTemplateRequest {
  id: string;
}
export const DeleteExperimentTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/experimentTemplates/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteExperimentTemplateRequest",
}) as any as S.Schema<DeleteExperimentTemplateRequest>;
export interface DeleteTargetAccountConfigurationRequest {
  experimentTemplateId: string;
  accountId: string;
}
export const DeleteTargetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    experimentTemplateId: S.String.pipe(T.HttpLabel("experimentTemplateId")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTargetAccountConfigurationRequest",
}) as any as S.Schema<DeleteTargetAccountConfigurationRequest>;
export interface GetActionRequest {
  id: string;
}
export const GetActionRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/actions/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetActionRequest",
}) as any as S.Schema<GetActionRequest>;
export interface GetExperimentRequest {
  id: string;
}
export const GetExperimentRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/experiments/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExperimentRequest",
}) as any as S.Schema<GetExperimentRequest>;
export interface GetExperimentTargetAccountConfigurationRequest {
  experimentId: string;
  accountId: string;
}
export const GetExperimentTargetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    experimentId: S.String.pipe(T.HttpLabel("experimentId")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/experiments/{experimentId}/targetAccountConfigurations/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExperimentTargetAccountConfigurationRequest",
}) as any as S.Schema<GetExperimentTargetAccountConfigurationRequest>;
export interface GetExperimentTemplateRequest {
  id: string;
}
export const GetExperimentTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/experimentTemplates/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExperimentTemplateRequest",
}) as any as S.Schema<GetExperimentTemplateRequest>;
export interface GetSafetyLeverRequest {
  id: string;
}
export const GetSafetyLeverRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/safetyLevers/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSafetyLeverRequest",
}) as any as S.Schema<GetSafetyLeverRequest>;
export interface GetTargetAccountConfigurationRequest {
  experimentTemplateId: string;
  accountId: string;
}
export const GetTargetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    experimentTemplateId: S.String.pipe(T.HttpLabel("experimentTemplateId")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTargetAccountConfigurationRequest",
}) as any as S.Schema<GetTargetAccountConfigurationRequest>;
export interface GetTargetResourceTypeRequest {
  resourceType: string;
}
export const GetTargetResourceTypeRequest = S.suspend(() =>
  S.Struct({ resourceType: S.String.pipe(T.HttpLabel("resourceType")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/targetResourceTypes/{resourceType}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTargetResourceTypeRequest",
}) as any as S.Schema<GetTargetResourceTypeRequest>;
export interface ListActionsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListActionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListActionsRequest",
}) as any as S.Schema<ListActionsRequest>;
export interface ListExperimentResolvedTargetsRequest {
  experimentId: string;
  maxResults?: number;
  nextToken?: string;
  targetName?: string;
}
export const ListExperimentResolvedTargetsRequest = S.suspend(() =>
  S.Struct({
    experimentId: S.String.pipe(T.HttpLabel("experimentId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    targetName: S.optional(S.String).pipe(T.HttpQuery("targetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/experiments/{experimentId}/resolvedTargets",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExperimentResolvedTargetsRequest",
}) as any as S.Schema<ListExperimentResolvedTargetsRequest>;
export interface ListExperimentsRequest {
  maxResults?: number;
  nextToken?: string;
  experimentTemplateId?: string;
}
export const ListExperimentsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    experimentTemplateId: S.optional(S.String).pipe(
      T.HttpQuery("experimentTemplateId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/experiments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExperimentsRequest",
}) as any as S.Schema<ListExperimentsRequest>;
export interface ListExperimentTargetAccountConfigurationsRequest {
  experimentId: string;
  nextToken?: string;
}
export const ListExperimentTargetAccountConfigurationsRequest = S.suspend(() =>
  S.Struct({
    experimentId: S.String.pipe(T.HttpLabel("experimentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/experiments/{experimentId}/targetAccountConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExperimentTargetAccountConfigurationsRequest",
}) as any as S.Schema<ListExperimentTargetAccountConfigurationsRequest>;
export interface ListExperimentTemplatesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListExperimentTemplatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/experimentTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExperimentTemplatesRequest",
}) as any as S.Schema<ListExperimentTemplatesRequest>;
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
export interface ListTargetAccountConfigurationsRequest {
  experimentTemplateId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTargetAccountConfigurationsRequest = S.suspend(() =>
  S.Struct({
    experimentTemplateId: S.String.pipe(T.HttpLabel("experimentTemplateId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetAccountConfigurationsRequest",
}) as any as S.Schema<ListTargetAccountConfigurationsRequest>;
export interface ListTargetResourceTypesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListTargetResourceTypesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/targetResourceTypes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetResourceTypesRequest",
}) as any as S.Schema<ListTargetResourceTypesRequest>;
export interface StopExperimentRequest {
  id: string;
}
export const StopExperimentRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/experiments/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopExperimentRequest",
}) as any as S.Schema<StopExperimentRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
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
  tagKeys?: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: S.optional(TagKeyList).pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateTargetAccountConfigurationRequest {
  experimentTemplateId: string;
  accountId: string;
  roleArn?: string;
  description?: string;
}
export const UpdateTargetAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    experimentTemplateId: S.String.pipe(T.HttpLabel("experimentTemplateId")),
    accountId: S.String.pipe(T.HttpLabel("accountId")),
    roleArn: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTargetAccountConfigurationRequest",
}) as any as S.Schema<UpdateTargetAccountConfigurationRequest>;
export interface CreateExperimentTemplateStopConditionInput {
  source: string;
  value?: string;
}
export const CreateExperimentTemplateStopConditionInput = S.suspend(() =>
  S.Struct({ source: S.String, value: S.optional(S.String) }),
).annotations({
  identifier: "CreateExperimentTemplateStopConditionInput",
}) as any as S.Schema<CreateExperimentTemplateStopConditionInput>;
export type CreateExperimentTemplateStopConditionInputList =
  CreateExperimentTemplateStopConditionInput[];
export const CreateExperimentTemplateStopConditionInputList = S.Array(
  CreateExperimentTemplateStopConditionInput,
);
export interface CreateExperimentTemplateExperimentOptionsInput {
  accountTargeting?: string;
  emptyTargetResolutionMode?: string;
}
export const CreateExperimentTemplateExperimentOptionsInput = S.suspend(() =>
  S.Struct({
    accountTargeting: S.optional(S.String),
    emptyTargetResolutionMode: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateExperimentTemplateExperimentOptionsInput",
}) as any as S.Schema<CreateExperimentTemplateExperimentOptionsInput>;
export interface StartExperimentExperimentOptionsInput {
  actionsMode?: string;
}
export const StartExperimentExperimentOptionsInput = S.suspend(() =>
  S.Struct({ actionsMode: S.optional(S.String) }),
).annotations({
  identifier: "StartExperimentExperimentOptionsInput",
}) as any as S.Schema<StartExperimentExperimentOptionsInput>;
export interface UpdateExperimentTemplateStopConditionInput {
  source: string;
  value?: string;
}
export const UpdateExperimentTemplateStopConditionInput = S.suspend(() =>
  S.Struct({ source: S.String, value: S.optional(S.String) }),
).annotations({
  identifier: "UpdateExperimentTemplateStopConditionInput",
}) as any as S.Schema<UpdateExperimentTemplateStopConditionInput>;
export type UpdateExperimentTemplateStopConditionInputList =
  UpdateExperimentTemplateStopConditionInput[];
export const UpdateExperimentTemplateStopConditionInputList = S.Array(
  UpdateExperimentTemplateStopConditionInput,
);
export interface ExperimentTemplateCloudWatchLogsLogConfigurationInput {
  logGroupArn: string;
}
export const ExperimentTemplateCloudWatchLogsLogConfigurationInput = S.suspend(
  () => S.Struct({ logGroupArn: S.String }),
).annotations({
  identifier: "ExperimentTemplateCloudWatchLogsLogConfigurationInput",
}) as any as S.Schema<ExperimentTemplateCloudWatchLogsLogConfigurationInput>;
export interface ExperimentTemplateS3LogConfigurationInput {
  bucketName: string;
  prefix?: string;
}
export const ExperimentTemplateS3LogConfigurationInput = S.suspend(() =>
  S.Struct({ bucketName: S.String, prefix: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentTemplateS3LogConfigurationInput",
}) as any as S.Schema<ExperimentTemplateS3LogConfigurationInput>;
export interface UpdateExperimentTemplateLogConfigurationInput {
  cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfigurationInput;
  s3Configuration?: ExperimentTemplateS3LogConfigurationInput;
  logSchemaVersion?: number;
}
export const UpdateExperimentTemplateLogConfigurationInput = S.suspend(() =>
  S.Struct({
    cloudWatchLogsConfiguration: S.optional(
      ExperimentTemplateCloudWatchLogsLogConfigurationInput,
    ),
    s3Configuration: S.optional(ExperimentTemplateS3LogConfigurationInput),
    logSchemaVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateExperimentTemplateLogConfigurationInput",
}) as any as S.Schema<UpdateExperimentTemplateLogConfigurationInput>;
export interface UpdateExperimentTemplateExperimentOptionsInput {
  emptyTargetResolutionMode?: string;
}
export const UpdateExperimentTemplateExperimentOptionsInput = S.suspend(() =>
  S.Struct({ emptyTargetResolutionMode: S.optional(S.String) }),
).annotations({
  identifier: "UpdateExperimentTemplateExperimentOptionsInput",
}) as any as S.Schema<UpdateExperimentTemplateExperimentOptionsInput>;
export interface ReportConfigurationS3OutputInput {
  bucketName?: string;
  prefix?: string;
}
export const ReportConfigurationS3OutputInput = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "ReportConfigurationS3OutputInput",
}) as any as S.Schema<ReportConfigurationS3OutputInput>;
export interface ExperimentTemplateReportConfigurationOutputsInput {
  s3Configuration?: ReportConfigurationS3OutputInput;
}
export const ExperimentTemplateReportConfigurationOutputsInput = S.suspend(() =>
  S.Struct({ s3Configuration: S.optional(ReportConfigurationS3OutputInput) }),
).annotations({
  identifier: "ExperimentTemplateReportConfigurationOutputsInput",
}) as any as S.Schema<ExperimentTemplateReportConfigurationOutputsInput>;
export interface ReportConfigurationCloudWatchDashboardInput {
  dashboardIdentifier?: string;
}
export const ReportConfigurationCloudWatchDashboardInput = S.suspend(() =>
  S.Struct({ dashboardIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "ReportConfigurationCloudWatchDashboardInput",
}) as any as S.Schema<ReportConfigurationCloudWatchDashboardInput>;
export type ReportConfigurationCloudWatchDashboardInputList =
  ReportConfigurationCloudWatchDashboardInput[];
export const ReportConfigurationCloudWatchDashboardInputList = S.Array(
  ReportConfigurationCloudWatchDashboardInput,
);
export interface ExperimentTemplateReportConfigurationDataSourcesInput {
  cloudWatchDashboards?: ReportConfigurationCloudWatchDashboardInputList;
}
export const ExperimentTemplateReportConfigurationDataSourcesInput = S.suspend(
  () =>
    S.Struct({
      cloudWatchDashboards: S.optional(
        ReportConfigurationCloudWatchDashboardInputList,
      ),
    }),
).annotations({
  identifier: "ExperimentTemplateReportConfigurationDataSourcesInput",
}) as any as S.Schema<ExperimentTemplateReportConfigurationDataSourcesInput>;
export interface UpdateExperimentTemplateReportConfigurationInput {
  outputs?: ExperimentTemplateReportConfigurationOutputsInput;
  dataSources?: ExperimentTemplateReportConfigurationDataSourcesInput;
  preExperimentDuration?: string;
  postExperimentDuration?: string;
}
export const UpdateExperimentTemplateReportConfigurationInput = S.suspend(() =>
  S.Struct({
    outputs: S.optional(ExperimentTemplateReportConfigurationOutputsInput),
    dataSources: S.optional(
      ExperimentTemplateReportConfigurationDataSourcesInput,
    ),
    preExperimentDuration: S.optional(S.String),
    postExperimentDuration: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateExperimentTemplateReportConfigurationInput",
}) as any as S.Schema<UpdateExperimentTemplateReportConfigurationInput>;
export interface UpdateSafetyLeverStateInput {
  status: string;
  reason: string;
}
export const UpdateSafetyLeverStateInput = S.suspend(() =>
  S.Struct({ status: S.String, reason: S.String }),
).annotations({
  identifier: "UpdateSafetyLeverStateInput",
}) as any as S.Schema<UpdateSafetyLeverStateInput>;
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type ExperimentTemplateActionStartAfterList = string[];
export const ExperimentTemplateActionStartAfterList = S.Array(S.String);
export interface TargetAccountConfiguration {
  roleArn?: string;
  accountId?: string;
  description?: string;
}
export const TargetAccountConfiguration = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    accountId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetAccountConfiguration",
}) as any as S.Schema<TargetAccountConfiguration>;
export interface DeleteTargetAccountConfigurationResponse {
  targetAccountConfiguration?: TargetAccountConfiguration;
}
export const DeleteTargetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfiguration: S.optional(TargetAccountConfiguration),
  }),
).annotations({
  identifier: "DeleteTargetAccountConfigurationResponse",
}) as any as S.Schema<DeleteTargetAccountConfigurationResponse>;
export type ExperimentTemplateTargetFilterValues = string[];
export const ExperimentTemplateTargetFilterValues = S.Array(S.String);
export interface ExperimentTemplateTargetFilter {
  path?: string;
  values?: ExperimentTemplateTargetFilterValues;
}
export const ExperimentTemplateTargetFilter = S.suspend(() =>
  S.Struct({
    path: S.optional(S.String),
    values: S.optional(ExperimentTemplateTargetFilterValues),
  }),
).annotations({
  identifier: "ExperimentTemplateTargetFilter",
}) as any as S.Schema<ExperimentTemplateTargetFilter>;
export type ExperimentTemplateTargetFilterList =
  ExperimentTemplateTargetFilter[];
export const ExperimentTemplateTargetFilterList = S.Array(
  ExperimentTemplateTargetFilter,
);
export type ExperimentTemplateTargetParameterMap = { [key: string]: string };
export const ExperimentTemplateTargetParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ExperimentTemplateTarget {
  resourceType?: string;
  resourceArns?: ResourceArnList;
  resourceTags?: TagMap;
  filters?: ExperimentTemplateTargetFilterList;
  selectionMode?: string;
  parameters?: ExperimentTemplateTargetParameterMap;
}
export const ExperimentTemplateTarget = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    resourceArns: S.optional(ResourceArnList),
    resourceTags: S.optional(TagMap),
    filters: S.optional(ExperimentTemplateTargetFilterList),
    selectionMode: S.optional(S.String),
    parameters: S.optional(ExperimentTemplateTargetParameterMap),
  }),
).annotations({
  identifier: "ExperimentTemplateTarget",
}) as any as S.Schema<ExperimentTemplateTarget>;
export type ExperimentTemplateTargetMap = {
  [key: string]: ExperimentTemplateTarget;
};
export const ExperimentTemplateTargetMap = S.Record({
  key: S.String,
  value: ExperimentTemplateTarget,
});
export type ExperimentTemplateActionParameterMap = { [key: string]: string };
export const ExperimentTemplateActionParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ExperimentTemplateActionTargetMap = { [key: string]: string };
export const ExperimentTemplateActionTargetMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ExperimentTemplateAction {
  actionId?: string;
  description?: string;
  parameters?: ExperimentTemplateActionParameterMap;
  targets?: ExperimentTemplateActionTargetMap;
  startAfter?: ExperimentTemplateActionStartAfterList;
}
export const ExperimentTemplateAction = S.suspend(() =>
  S.Struct({
    actionId: S.optional(S.String),
    description: S.optional(S.String),
    parameters: S.optional(ExperimentTemplateActionParameterMap),
    targets: S.optional(ExperimentTemplateActionTargetMap),
    startAfter: S.optional(ExperimentTemplateActionStartAfterList),
  }),
).annotations({
  identifier: "ExperimentTemplateAction",
}) as any as S.Schema<ExperimentTemplateAction>;
export type ExperimentTemplateActionMap = {
  [key: string]: ExperimentTemplateAction;
};
export const ExperimentTemplateActionMap = S.Record({
  key: S.String,
  value: ExperimentTemplateAction,
});
export interface ExperimentTemplateStopCondition {
  source?: string;
  value?: string;
}
export const ExperimentTemplateStopCondition = S.suspend(() =>
  S.Struct({ source: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentTemplateStopCondition",
}) as any as S.Schema<ExperimentTemplateStopCondition>;
export type ExperimentTemplateStopConditionList =
  ExperimentTemplateStopCondition[];
export const ExperimentTemplateStopConditionList = S.Array(
  ExperimentTemplateStopCondition,
);
export interface ExperimentTemplateCloudWatchLogsLogConfiguration {
  logGroupArn?: string;
}
export const ExperimentTemplateCloudWatchLogsLogConfiguration = S.suspend(() =>
  S.Struct({ logGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentTemplateCloudWatchLogsLogConfiguration",
}) as any as S.Schema<ExperimentTemplateCloudWatchLogsLogConfiguration>;
export interface ExperimentTemplateS3LogConfiguration {
  bucketName?: string;
  prefix?: string;
}
export const ExperimentTemplateS3LogConfiguration = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentTemplateS3LogConfiguration",
}) as any as S.Schema<ExperimentTemplateS3LogConfiguration>;
export interface ExperimentTemplateLogConfiguration {
  cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfiguration;
  s3Configuration?: ExperimentTemplateS3LogConfiguration;
  logSchemaVersion?: number;
}
export const ExperimentTemplateLogConfiguration = S.suspend(() =>
  S.Struct({
    cloudWatchLogsConfiguration: S.optional(
      ExperimentTemplateCloudWatchLogsLogConfiguration,
    ),
    s3Configuration: S.optional(ExperimentTemplateS3LogConfiguration),
    logSchemaVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExperimentTemplateLogConfiguration",
}) as any as S.Schema<ExperimentTemplateLogConfiguration>;
export interface ExperimentTemplateExperimentOptions {
  accountTargeting?: string;
  emptyTargetResolutionMode?: string;
}
export const ExperimentTemplateExperimentOptions = S.suspend(() =>
  S.Struct({
    accountTargeting: S.optional(S.String),
    emptyTargetResolutionMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentTemplateExperimentOptions",
}) as any as S.Schema<ExperimentTemplateExperimentOptions>;
export interface ReportConfigurationS3Output {
  bucketName?: string;
  prefix?: string;
}
export const ReportConfigurationS3Output = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "ReportConfigurationS3Output",
}) as any as S.Schema<ReportConfigurationS3Output>;
export interface ExperimentTemplateReportConfigurationOutputs {
  s3Configuration?: ReportConfigurationS3Output;
}
export const ExperimentTemplateReportConfigurationOutputs = S.suspend(() =>
  S.Struct({ s3Configuration: S.optional(ReportConfigurationS3Output) }),
).annotations({
  identifier: "ExperimentTemplateReportConfigurationOutputs",
}) as any as S.Schema<ExperimentTemplateReportConfigurationOutputs>;
export interface ExperimentTemplateReportConfigurationCloudWatchDashboard {
  dashboardIdentifier?: string;
}
export const ExperimentTemplateReportConfigurationCloudWatchDashboard =
  S.suspend(() =>
    S.Struct({ dashboardIdentifier: S.optional(S.String) }),
  ).annotations({
    identifier: "ExperimentTemplateReportConfigurationCloudWatchDashboard",
  }) as any as S.Schema<ExperimentTemplateReportConfigurationCloudWatchDashboard>;
export type ExperimentTemplateReportConfigurationCloudWatchDashboardList =
  ExperimentTemplateReportConfigurationCloudWatchDashboard[];
export const ExperimentTemplateReportConfigurationCloudWatchDashboardList =
  S.Array(ExperimentTemplateReportConfigurationCloudWatchDashboard);
export interface ExperimentTemplateReportConfigurationDataSources {
  cloudWatchDashboards?: ExperimentTemplateReportConfigurationCloudWatchDashboardList;
}
export const ExperimentTemplateReportConfigurationDataSources = S.suspend(() =>
  S.Struct({
    cloudWatchDashboards: S.optional(
      ExperimentTemplateReportConfigurationCloudWatchDashboardList,
    ),
  }),
).annotations({
  identifier: "ExperimentTemplateReportConfigurationDataSources",
}) as any as S.Schema<ExperimentTemplateReportConfigurationDataSources>;
export interface ExperimentTemplateReportConfiguration {
  outputs?: ExperimentTemplateReportConfigurationOutputs;
  dataSources?: ExperimentTemplateReportConfigurationDataSources;
  preExperimentDuration?: string;
  postExperimentDuration?: string;
}
export const ExperimentTemplateReportConfiguration = S.suspend(() =>
  S.Struct({
    outputs: S.optional(ExperimentTemplateReportConfigurationOutputs),
    dataSources: S.optional(ExperimentTemplateReportConfigurationDataSources),
    preExperimentDuration: S.optional(S.String),
    postExperimentDuration: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentTemplateReportConfiguration",
}) as any as S.Schema<ExperimentTemplateReportConfiguration>;
export interface ExperimentTemplate {
  id?: string;
  arn?: string;
  description?: string;
  targets?: ExperimentTemplateTargetMap;
  actions?: ExperimentTemplateActionMap;
  stopConditions?: ExperimentTemplateStopConditionList;
  creationTime?: Date;
  lastUpdateTime?: Date;
  roleArn?: string;
  tags?: TagMap;
  logConfiguration?: ExperimentTemplateLogConfiguration;
  experimentOptions?: ExperimentTemplateExperimentOptions;
  targetAccountConfigurationsCount?: number;
  experimentReportConfiguration?: ExperimentTemplateReportConfiguration;
}
export const ExperimentTemplate = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    targets: S.optional(ExperimentTemplateTargetMap),
    actions: S.optional(ExperimentTemplateActionMap),
    stopConditions: S.optional(ExperimentTemplateStopConditionList),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    roleArn: S.optional(S.String),
    tags: S.optional(TagMap),
    logConfiguration: S.optional(ExperimentTemplateLogConfiguration),
    experimentOptions: S.optional(ExperimentTemplateExperimentOptions),
    targetAccountConfigurationsCount: S.optional(S.Number),
    experimentReportConfiguration: S.optional(
      ExperimentTemplateReportConfiguration,
    ),
  }),
).annotations({
  identifier: "ExperimentTemplate",
}) as any as S.Schema<ExperimentTemplate>;
export interface GetExperimentTemplateResponse {
  experimentTemplate?: ExperimentTemplate;
}
export const GetExperimentTemplateResponse = S.suspend(() =>
  S.Struct({ experimentTemplate: S.optional(ExperimentTemplate) }),
).annotations({
  identifier: "GetExperimentTemplateResponse",
}) as any as S.Schema<GetExperimentTemplateResponse>;
export interface GetTargetAccountConfigurationResponse {
  targetAccountConfiguration?: TargetAccountConfiguration;
}
export const GetTargetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfiguration: S.optional(TargetAccountConfiguration),
  }),
).annotations({
  identifier: "GetTargetAccountConfigurationResponse",
}) as any as S.Schema<GetTargetAccountConfigurationResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartExperimentRequest {
  clientToken: string;
  experimentTemplateId: string;
  experimentOptions?: StartExperimentExperimentOptionsInput;
  tags?: TagMap;
}
export const StartExperimentRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    experimentTemplateId: S.String,
    experimentOptions: S.optional(StartExperimentExperimentOptionsInput),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/experiments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartExperimentRequest",
}) as any as S.Schema<StartExperimentRequest>;
export interface ExperimentError {
  accountId?: string;
  code?: string;
  location?: string;
}
export const ExperimentError = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    code: S.optional(S.String),
    location: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentError",
}) as any as S.Schema<ExperimentError>;
export interface ExperimentState {
  status?: string;
  reason?: string;
  error?: ExperimentError;
}
export const ExperimentState = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    reason: S.optional(S.String),
    error: S.optional(ExperimentError),
  }),
).annotations({
  identifier: "ExperimentState",
}) as any as S.Schema<ExperimentState>;
export type ExperimentTargetFilterValues = string[];
export const ExperimentTargetFilterValues = S.Array(S.String);
export interface ExperimentTargetFilter {
  path?: string;
  values?: ExperimentTargetFilterValues;
}
export const ExperimentTargetFilter = S.suspend(() =>
  S.Struct({
    path: S.optional(S.String),
    values: S.optional(ExperimentTargetFilterValues),
  }),
).annotations({
  identifier: "ExperimentTargetFilter",
}) as any as S.Schema<ExperimentTargetFilter>;
export type ExperimentTargetFilterList = ExperimentTargetFilter[];
export const ExperimentTargetFilterList = S.Array(ExperimentTargetFilter);
export type ExperimentTargetParameterMap = { [key: string]: string };
export const ExperimentTargetParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ExperimentTarget {
  resourceType?: string;
  resourceArns?: ResourceArnList;
  resourceTags?: TagMap;
  filters?: ExperimentTargetFilterList;
  selectionMode?: string;
  parameters?: ExperimentTargetParameterMap;
}
export const ExperimentTarget = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    resourceArns: S.optional(ResourceArnList),
    resourceTags: S.optional(TagMap),
    filters: S.optional(ExperimentTargetFilterList),
    selectionMode: S.optional(S.String),
    parameters: S.optional(ExperimentTargetParameterMap),
  }),
).annotations({
  identifier: "ExperimentTarget",
}) as any as S.Schema<ExperimentTarget>;
export type ExperimentTargetMap = { [key: string]: ExperimentTarget };
export const ExperimentTargetMap = S.Record({
  key: S.String,
  value: ExperimentTarget,
});
export type ExperimentActionParameterMap = { [key: string]: string };
export const ExperimentActionParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ExperimentActionTargetMap = { [key: string]: string };
export const ExperimentActionTargetMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ExperimentActionStartAfterList = string[];
export const ExperimentActionStartAfterList = S.Array(S.String);
export interface ExperimentActionState {
  status?: string;
  reason?: string;
}
export const ExperimentActionState = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentActionState",
}) as any as S.Schema<ExperimentActionState>;
export interface ExperimentAction {
  actionId?: string;
  description?: string;
  parameters?: ExperimentActionParameterMap;
  targets?: ExperimentActionTargetMap;
  startAfter?: ExperimentActionStartAfterList;
  state?: ExperimentActionState;
  startTime?: Date;
  endTime?: Date;
}
export const ExperimentAction = S.suspend(() =>
  S.Struct({
    actionId: S.optional(S.String),
    description: S.optional(S.String),
    parameters: S.optional(ExperimentActionParameterMap),
    targets: S.optional(ExperimentActionTargetMap),
    startAfter: S.optional(ExperimentActionStartAfterList),
    state: S.optional(ExperimentActionState),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ExperimentAction",
}) as any as S.Schema<ExperimentAction>;
export type ExperimentActionMap = { [key: string]: ExperimentAction };
export const ExperimentActionMap = S.Record({
  key: S.String,
  value: ExperimentAction,
});
export interface ExperimentStopCondition {
  source?: string;
  value?: string;
}
export const ExperimentStopCondition = S.suspend(() =>
  S.Struct({ source: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentStopCondition",
}) as any as S.Schema<ExperimentStopCondition>;
export type ExperimentStopConditionList = ExperimentStopCondition[];
export const ExperimentStopConditionList = S.Array(ExperimentStopCondition);
export interface ExperimentCloudWatchLogsLogConfiguration {
  logGroupArn?: string;
}
export const ExperimentCloudWatchLogsLogConfiguration = S.suspend(() =>
  S.Struct({ logGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentCloudWatchLogsLogConfiguration",
}) as any as S.Schema<ExperimentCloudWatchLogsLogConfiguration>;
export interface ExperimentS3LogConfiguration {
  bucketName?: string;
  prefix?: string;
}
export const ExperimentS3LogConfiguration = S.suspend(() =>
  S.Struct({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentS3LogConfiguration",
}) as any as S.Schema<ExperimentS3LogConfiguration>;
export interface ExperimentLogConfiguration {
  cloudWatchLogsConfiguration?: ExperimentCloudWatchLogsLogConfiguration;
  s3Configuration?: ExperimentS3LogConfiguration;
  logSchemaVersion?: number;
}
export const ExperimentLogConfiguration = S.suspend(() =>
  S.Struct({
    cloudWatchLogsConfiguration: S.optional(
      ExperimentCloudWatchLogsLogConfiguration,
    ),
    s3Configuration: S.optional(ExperimentS3LogConfiguration),
    logSchemaVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExperimentLogConfiguration",
}) as any as S.Schema<ExperimentLogConfiguration>;
export interface ExperimentOptions {
  accountTargeting?: string;
  emptyTargetResolutionMode?: string;
  actionsMode?: string;
}
export const ExperimentOptions = S.suspend(() =>
  S.Struct({
    accountTargeting: S.optional(S.String),
    emptyTargetResolutionMode: S.optional(S.String),
    actionsMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentOptions",
}) as any as S.Schema<ExperimentOptions>;
export interface ExperimentReportConfigurationOutputsS3Configuration {
  bucketName?: string;
  prefix?: string;
}
export const ExperimentReportConfigurationOutputsS3Configuration = S.suspend(
  () =>
    S.Struct({
      bucketName: S.optional(S.String),
      prefix: S.optional(S.String),
    }),
).annotations({
  identifier: "ExperimentReportConfigurationOutputsS3Configuration",
}) as any as S.Schema<ExperimentReportConfigurationOutputsS3Configuration>;
export interface ExperimentReportConfigurationOutputs {
  s3Configuration?: ExperimentReportConfigurationOutputsS3Configuration;
}
export const ExperimentReportConfigurationOutputs = S.suspend(() =>
  S.Struct({
    s3Configuration: S.optional(
      ExperimentReportConfigurationOutputsS3Configuration,
    ),
  }),
).annotations({
  identifier: "ExperimentReportConfigurationOutputs",
}) as any as S.Schema<ExperimentReportConfigurationOutputs>;
export interface ExperimentReportConfigurationCloudWatchDashboard {
  dashboardIdentifier?: string;
}
export const ExperimentReportConfigurationCloudWatchDashboard = S.suspend(() =>
  S.Struct({ dashboardIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentReportConfigurationCloudWatchDashboard",
}) as any as S.Schema<ExperimentReportConfigurationCloudWatchDashboard>;
export type ExperimentReportConfigurationCloudWatchDashboardList =
  ExperimentReportConfigurationCloudWatchDashboard[];
export const ExperimentReportConfigurationCloudWatchDashboardList = S.Array(
  ExperimentReportConfigurationCloudWatchDashboard,
);
export interface ExperimentReportConfigurationDataSources {
  cloudWatchDashboards?: ExperimentReportConfigurationCloudWatchDashboardList;
}
export const ExperimentReportConfigurationDataSources = S.suspend(() =>
  S.Struct({
    cloudWatchDashboards: S.optional(
      ExperimentReportConfigurationCloudWatchDashboardList,
    ),
  }),
).annotations({
  identifier: "ExperimentReportConfigurationDataSources",
}) as any as S.Schema<ExperimentReportConfigurationDataSources>;
export interface ExperimentReportConfiguration {
  outputs?: ExperimentReportConfigurationOutputs;
  dataSources?: ExperimentReportConfigurationDataSources;
  preExperimentDuration?: string;
  postExperimentDuration?: string;
}
export const ExperimentReportConfiguration = S.suspend(() =>
  S.Struct({
    outputs: S.optional(ExperimentReportConfigurationOutputs),
    dataSources: S.optional(ExperimentReportConfigurationDataSources),
    preExperimentDuration: S.optional(S.String),
    postExperimentDuration: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentReportConfiguration",
}) as any as S.Schema<ExperimentReportConfiguration>;
export interface ExperimentReportError {
  code?: string;
}
export const ExperimentReportError = S.suspend(() =>
  S.Struct({ code: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentReportError",
}) as any as S.Schema<ExperimentReportError>;
export interface ExperimentReportState {
  status?: string;
  reason?: string;
  error?: ExperimentReportError;
}
export const ExperimentReportState = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    reason: S.optional(S.String),
    error: S.optional(ExperimentReportError),
  }),
).annotations({
  identifier: "ExperimentReportState",
}) as any as S.Schema<ExperimentReportState>;
export interface ExperimentReportS3Report {
  arn?: string;
  reportType?: string;
}
export const ExperimentReportS3Report = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), reportType: S.optional(S.String) }),
).annotations({
  identifier: "ExperimentReportS3Report",
}) as any as S.Schema<ExperimentReportS3Report>;
export type ExperimentReportS3ReportList = ExperimentReportS3Report[];
export const ExperimentReportS3ReportList = S.Array(ExperimentReportS3Report);
export interface ExperimentReport {
  state?: ExperimentReportState;
  s3Reports?: ExperimentReportS3ReportList;
}
export const ExperimentReport = S.suspend(() =>
  S.Struct({
    state: S.optional(ExperimentReportState),
    s3Reports: S.optional(ExperimentReportS3ReportList),
  }),
).annotations({
  identifier: "ExperimentReport",
}) as any as S.Schema<ExperimentReport>;
export interface Experiment {
  id?: string;
  arn?: string;
  experimentTemplateId?: string;
  roleArn?: string;
  state?: ExperimentState;
  targets?: ExperimentTargetMap;
  actions?: ExperimentActionMap;
  stopConditions?: ExperimentStopConditionList;
  creationTime?: Date;
  startTime?: Date;
  endTime?: Date;
  tags?: TagMap;
  logConfiguration?: ExperimentLogConfiguration;
  experimentOptions?: ExperimentOptions;
  targetAccountConfigurationsCount?: number;
  experimentReportConfiguration?: ExperimentReportConfiguration;
  experimentReport?: ExperimentReport;
}
export const Experiment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    experimentTemplateId: S.optional(S.String),
    roleArn: S.optional(S.String),
    state: S.optional(ExperimentState),
    targets: S.optional(ExperimentTargetMap),
    actions: S.optional(ExperimentActionMap),
    stopConditions: S.optional(ExperimentStopConditionList),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
    logConfiguration: S.optional(ExperimentLogConfiguration),
    experimentOptions: S.optional(ExperimentOptions),
    targetAccountConfigurationsCount: S.optional(S.Number),
    experimentReportConfiguration: S.optional(ExperimentReportConfiguration),
    experimentReport: S.optional(ExperimentReport),
  }),
).annotations({ identifier: "Experiment" }) as any as S.Schema<Experiment>;
export interface StopExperimentResponse {
  experiment?: Experiment;
}
export const StopExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: S.optional(Experiment) }),
).annotations({
  identifier: "StopExperimentResponse",
}) as any as S.Schema<StopExperimentResponse>;
export interface UpdateSafetyLeverStateRequest {
  id: string;
  state: UpdateSafetyLeverStateInput;
}
export const UpdateSafetyLeverStateRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    state: UpdateSafetyLeverStateInput,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/safetyLevers/{id}/state" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSafetyLeverStateRequest",
}) as any as S.Schema<UpdateSafetyLeverStateRequest>;
export interface UpdateTargetAccountConfigurationResponse {
  targetAccountConfiguration?: TargetAccountConfiguration;
}
export const UpdateTargetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfiguration: S.optional(TargetAccountConfiguration),
  }),
).annotations({
  identifier: "UpdateTargetAccountConfigurationResponse",
}) as any as S.Schema<UpdateTargetAccountConfigurationResponse>;
export interface ExperimentTemplateTargetInputFilter {
  path: string;
  values: ExperimentTemplateTargetFilterValues;
}
export const ExperimentTemplateTargetInputFilter = S.suspend(() =>
  S.Struct({ path: S.String, values: ExperimentTemplateTargetFilterValues }),
).annotations({
  identifier: "ExperimentTemplateTargetInputFilter",
}) as any as S.Schema<ExperimentTemplateTargetInputFilter>;
export type ExperimentTemplateTargetFilterInputList =
  ExperimentTemplateTargetInputFilter[];
export const ExperimentTemplateTargetFilterInputList = S.Array(
  ExperimentTemplateTargetInputFilter,
);
export interface UpdateExperimentTemplateTargetInput {
  resourceType: string;
  resourceArns?: ResourceArnList;
  resourceTags?: TagMap;
  filters?: ExperimentTemplateTargetFilterInputList;
  selectionMode: string;
  parameters?: ExperimentTemplateTargetParameterMap;
}
export const UpdateExperimentTemplateTargetInput = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    resourceArns: S.optional(ResourceArnList),
    resourceTags: S.optional(TagMap),
    filters: S.optional(ExperimentTemplateTargetFilterInputList),
    selectionMode: S.String,
    parameters: S.optional(ExperimentTemplateTargetParameterMap),
  }),
).annotations({
  identifier: "UpdateExperimentTemplateTargetInput",
}) as any as S.Schema<UpdateExperimentTemplateTargetInput>;
export interface UpdateExperimentTemplateActionInputItem {
  actionId?: string;
  description?: string;
  parameters?: ExperimentTemplateActionParameterMap;
  targets?: ExperimentTemplateActionTargetMap;
  startAfter?: ExperimentTemplateActionStartAfterList;
}
export const UpdateExperimentTemplateActionInputItem = S.suspend(() =>
  S.Struct({
    actionId: S.optional(S.String),
    description: S.optional(S.String),
    parameters: S.optional(ExperimentTemplateActionParameterMap),
    targets: S.optional(ExperimentTemplateActionTargetMap),
    startAfter: S.optional(ExperimentTemplateActionStartAfterList),
  }),
).annotations({
  identifier: "UpdateExperimentTemplateActionInputItem",
}) as any as S.Schema<UpdateExperimentTemplateActionInputItem>;
export interface CreateExperimentTemplateLogConfigurationInput {
  cloudWatchLogsConfiguration?: ExperimentTemplateCloudWatchLogsLogConfigurationInput;
  s3Configuration?: ExperimentTemplateS3LogConfigurationInput;
  logSchemaVersion: number;
}
export const CreateExperimentTemplateLogConfigurationInput = S.suspend(() =>
  S.Struct({
    cloudWatchLogsConfiguration: S.optional(
      ExperimentTemplateCloudWatchLogsLogConfigurationInput,
    ),
    s3Configuration: S.optional(ExperimentTemplateS3LogConfigurationInput),
    logSchemaVersion: S.Number,
  }),
).annotations({
  identifier: "CreateExperimentTemplateLogConfigurationInput",
}) as any as S.Schema<CreateExperimentTemplateLogConfigurationInput>;
export interface ExperimentTargetAccountConfiguration {
  roleArn?: string;
  accountId?: string;
  description?: string;
}
export const ExperimentTargetAccountConfiguration = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    accountId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentTargetAccountConfiguration",
}) as any as S.Schema<ExperimentTargetAccountConfiguration>;
export interface ActionTarget {
  resourceType?: string;
}
export const ActionTarget = S.suspend(() =>
  S.Struct({ resourceType: S.optional(S.String) }),
).annotations({ identifier: "ActionTarget" }) as any as S.Schema<ActionTarget>;
export type ActionTargetMap = { [key: string]: ActionTarget };
export const ActionTargetMap = S.Record({ key: S.String, value: ActionTarget });
export interface ActionSummary {
  id?: string;
  arn?: string;
  description?: string;
  targets?: ActionTargetMap;
  tags?: TagMap;
}
export const ActionSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    targets: S.optional(ActionTargetMap),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ActionSummary",
}) as any as S.Schema<ActionSummary>;
export type ActionSummaryList = ActionSummary[];
export const ActionSummaryList = S.Array(ActionSummary);
export interface ExperimentSummary {
  id?: string;
  arn?: string;
  experimentTemplateId?: string;
  state?: ExperimentState;
  creationTime?: Date;
  tags?: TagMap;
  experimentOptions?: ExperimentOptions;
}
export const ExperimentSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    experimentTemplateId: S.optional(S.String),
    state: S.optional(ExperimentState),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
    experimentOptions: S.optional(ExperimentOptions),
  }),
).annotations({
  identifier: "ExperimentSummary",
}) as any as S.Schema<ExperimentSummary>;
export type ExperimentSummaryList = ExperimentSummary[];
export const ExperimentSummaryList = S.Array(ExperimentSummary);
export interface ExperimentTargetAccountConfigurationSummary {
  roleArn?: string;
  accountId?: string;
  description?: string;
}
export const ExperimentTargetAccountConfigurationSummary = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    accountId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentTargetAccountConfigurationSummary",
}) as any as S.Schema<ExperimentTargetAccountConfigurationSummary>;
export type ExperimentTargetAccountConfigurationList =
  ExperimentTargetAccountConfigurationSummary[];
export const ExperimentTargetAccountConfigurationList = S.Array(
  ExperimentTargetAccountConfigurationSummary,
);
export interface ExperimentTemplateSummary {
  id?: string;
  arn?: string;
  description?: string;
  creationTime?: Date;
  lastUpdateTime?: Date;
  tags?: TagMap;
}
export const ExperimentTemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ExperimentTemplateSummary",
}) as any as S.Schema<ExperimentTemplateSummary>;
export type ExperimentTemplateSummaryList = ExperimentTemplateSummary[];
export const ExperimentTemplateSummaryList = S.Array(ExperimentTemplateSummary);
export interface TargetAccountConfigurationSummary {
  roleArn?: string;
  accountId?: string;
  description?: string;
}
export const TargetAccountConfigurationSummary = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    accountId: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetAccountConfigurationSummary",
}) as any as S.Schema<TargetAccountConfigurationSummary>;
export type TargetAccountConfigurationList =
  TargetAccountConfigurationSummary[];
export const TargetAccountConfigurationList = S.Array(
  TargetAccountConfigurationSummary,
);
export interface TargetResourceTypeSummary {
  resourceType?: string;
  description?: string;
}
export const TargetResourceTypeSummary = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetResourceTypeSummary",
}) as any as S.Schema<TargetResourceTypeSummary>;
export type TargetResourceTypeSummaryList = TargetResourceTypeSummary[];
export const TargetResourceTypeSummaryList = S.Array(TargetResourceTypeSummary);
export type UpdateExperimentTemplateTargetInputMap = {
  [key: string]: UpdateExperimentTemplateTargetInput;
};
export const UpdateExperimentTemplateTargetInputMap = S.Record({
  key: S.String,
  value: UpdateExperimentTemplateTargetInput,
});
export type UpdateExperimentTemplateActionInputMap = {
  [key: string]: UpdateExperimentTemplateActionInputItem;
};
export const UpdateExperimentTemplateActionInputMap = S.Record({
  key: S.String,
  value: UpdateExperimentTemplateActionInputItem,
});
export interface CreateTargetAccountConfigurationResponse {
  targetAccountConfiguration?: TargetAccountConfiguration;
}
export const CreateTargetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfiguration: S.optional(TargetAccountConfiguration),
  }),
).annotations({
  identifier: "CreateTargetAccountConfigurationResponse",
}) as any as S.Schema<CreateTargetAccountConfigurationResponse>;
export interface GetExperimentTargetAccountConfigurationResponse {
  targetAccountConfiguration?: ExperimentTargetAccountConfiguration;
}
export const GetExperimentTargetAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfiguration: S.optional(
      ExperimentTargetAccountConfiguration,
    ),
  }),
).annotations({
  identifier: "GetExperimentTargetAccountConfigurationResponse",
}) as any as S.Schema<GetExperimentTargetAccountConfigurationResponse>;
export interface ListActionsResponse {
  actions?: ActionSummaryList;
  nextToken?: string;
}
export const ListActionsResponse = S.suspend(() =>
  S.Struct({
    actions: S.optional(ActionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListActionsResponse",
}) as any as S.Schema<ListActionsResponse>;
export interface ListExperimentsResponse {
  experiments?: ExperimentSummaryList;
  nextToken?: string;
}
export const ListExperimentsResponse = S.suspend(() =>
  S.Struct({
    experiments: S.optional(ExperimentSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperimentsResponse",
}) as any as S.Schema<ListExperimentsResponse>;
export interface ListExperimentTargetAccountConfigurationsResponse {
  targetAccountConfigurations?: ExperimentTargetAccountConfigurationList;
  nextToken?: string;
}
export const ListExperimentTargetAccountConfigurationsResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfigurations: S.optional(
      ExperimentTargetAccountConfigurationList,
    ),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperimentTargetAccountConfigurationsResponse",
}) as any as S.Schema<ListExperimentTargetAccountConfigurationsResponse>;
export interface ListExperimentTemplatesResponse {
  experimentTemplates?: ExperimentTemplateSummaryList;
  nextToken?: string;
}
export const ListExperimentTemplatesResponse = S.suspend(() =>
  S.Struct({
    experimentTemplates: S.optional(ExperimentTemplateSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperimentTemplatesResponse",
}) as any as S.Schema<ListExperimentTemplatesResponse>;
export interface ListTargetAccountConfigurationsResponse {
  targetAccountConfigurations?: TargetAccountConfigurationList;
  nextToken?: string;
}
export const ListTargetAccountConfigurationsResponse = S.suspend(() =>
  S.Struct({
    targetAccountConfigurations: S.optional(TargetAccountConfigurationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTargetAccountConfigurationsResponse",
}) as any as S.Schema<ListTargetAccountConfigurationsResponse>;
export interface ListTargetResourceTypesResponse {
  targetResourceTypes?: TargetResourceTypeSummaryList;
  nextToken?: string;
}
export const ListTargetResourceTypesResponse = S.suspend(() =>
  S.Struct({
    targetResourceTypes: S.optional(TargetResourceTypeSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTargetResourceTypesResponse",
}) as any as S.Schema<ListTargetResourceTypesResponse>;
export interface StartExperimentResponse {
  experiment?: Experiment;
}
export const StartExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: S.optional(Experiment) }),
).annotations({
  identifier: "StartExperimentResponse",
}) as any as S.Schema<StartExperimentResponse>;
export interface UpdateExperimentTemplateRequest {
  id: string;
  description?: string;
  stopConditions?: UpdateExperimentTemplateStopConditionInputList;
  targets?: UpdateExperimentTemplateTargetInputMap;
  actions?: UpdateExperimentTemplateActionInputMap;
  roleArn?: string;
  logConfiguration?: UpdateExperimentTemplateLogConfigurationInput;
  experimentOptions?: UpdateExperimentTemplateExperimentOptionsInput;
  experimentReportConfiguration?: UpdateExperimentTemplateReportConfigurationInput;
}
export const UpdateExperimentTemplateRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    description: S.optional(S.String),
    stopConditions: S.optional(UpdateExperimentTemplateStopConditionInputList),
    targets: S.optional(UpdateExperimentTemplateTargetInputMap),
    actions: S.optional(UpdateExperimentTemplateActionInputMap),
    roleArn: S.optional(S.String),
    logConfiguration: S.optional(UpdateExperimentTemplateLogConfigurationInput),
    experimentOptions: S.optional(
      UpdateExperimentTemplateExperimentOptionsInput,
    ),
    experimentReportConfiguration: S.optional(
      UpdateExperimentTemplateReportConfigurationInput,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/experimentTemplates/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateExperimentTemplateRequest",
}) as any as S.Schema<UpdateExperimentTemplateRequest>;
export interface SafetyLeverState {
  status?: string;
  reason?: string;
}
export const SafetyLeverState = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), reason: S.optional(S.String) }),
).annotations({
  identifier: "SafetyLeverState",
}) as any as S.Schema<SafetyLeverState>;
export interface SafetyLever {
  id?: string;
  arn?: string;
  state?: SafetyLeverState;
}
export const SafetyLever = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    state: S.optional(SafetyLeverState),
  }),
).annotations({ identifier: "SafetyLever" }) as any as S.Schema<SafetyLever>;
export interface UpdateSafetyLeverStateResponse {
  safetyLever?: SafetyLever;
}
export const UpdateSafetyLeverStateResponse = S.suspend(() =>
  S.Struct({ safetyLever: S.optional(SafetyLever) }),
).annotations({
  identifier: "UpdateSafetyLeverStateResponse",
}) as any as S.Schema<UpdateSafetyLeverStateResponse>;
export interface CreateExperimentTemplateTargetInput {
  resourceType: string;
  resourceArns?: ResourceArnList;
  resourceTags?: TagMap;
  filters?: ExperimentTemplateTargetFilterInputList;
  selectionMode: string;
  parameters?: ExperimentTemplateTargetParameterMap;
}
export const CreateExperimentTemplateTargetInput = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    resourceArns: S.optional(ResourceArnList),
    resourceTags: S.optional(TagMap),
    filters: S.optional(ExperimentTemplateTargetFilterInputList),
    selectionMode: S.String,
    parameters: S.optional(ExperimentTemplateTargetParameterMap),
  }),
).annotations({
  identifier: "CreateExperimentTemplateTargetInput",
}) as any as S.Schema<CreateExperimentTemplateTargetInput>;
export interface CreateExperimentTemplateActionInput {
  actionId: string;
  description?: string;
  parameters?: ExperimentTemplateActionParameterMap;
  targets?: ExperimentTemplateActionTargetMap;
  startAfter?: ExperimentTemplateActionStartAfterList;
}
export const CreateExperimentTemplateActionInput = S.suspend(() =>
  S.Struct({
    actionId: S.String,
    description: S.optional(S.String),
    parameters: S.optional(ExperimentTemplateActionParameterMap),
    targets: S.optional(ExperimentTemplateActionTargetMap),
    startAfter: S.optional(ExperimentTemplateActionStartAfterList),
  }),
).annotations({
  identifier: "CreateExperimentTemplateActionInput",
}) as any as S.Schema<CreateExperimentTemplateActionInput>;
export type TargetInformationMap = { [key: string]: string };
export const TargetInformationMap = S.Record({
  key: S.String,
  value: S.String,
});
export type CreateExperimentTemplateTargetInputMap = {
  [key: string]: CreateExperimentTemplateTargetInput;
};
export const CreateExperimentTemplateTargetInputMap = S.Record({
  key: S.String,
  value: CreateExperimentTemplateTargetInput,
});
export type CreateExperimentTemplateActionInputMap = {
  [key: string]: CreateExperimentTemplateActionInput;
};
export const CreateExperimentTemplateActionInputMap = S.Record({
  key: S.String,
  value: CreateExperimentTemplateActionInput,
});
export interface CreateExperimentTemplateReportConfigurationInput {
  outputs?: ExperimentTemplateReportConfigurationOutputsInput;
  dataSources?: ExperimentTemplateReportConfigurationDataSourcesInput;
  preExperimentDuration?: string;
  postExperimentDuration?: string;
}
export const CreateExperimentTemplateReportConfigurationInput = S.suspend(() =>
  S.Struct({
    outputs: S.optional(ExperimentTemplateReportConfigurationOutputsInput),
    dataSources: S.optional(
      ExperimentTemplateReportConfigurationDataSourcesInput,
    ),
    preExperimentDuration: S.optional(S.String),
    postExperimentDuration: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateExperimentTemplateReportConfigurationInput",
}) as any as S.Schema<CreateExperimentTemplateReportConfigurationInput>;
export interface ResolvedTarget {
  resourceType?: string;
  targetName?: string;
  targetInformation?: TargetInformationMap;
}
export const ResolvedTarget = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    targetName: S.optional(S.String),
    targetInformation: S.optional(TargetInformationMap),
  }),
).annotations({
  identifier: "ResolvedTarget",
}) as any as S.Schema<ResolvedTarget>;
export type ResolvedTargetList = ResolvedTarget[];
export const ResolvedTargetList = S.Array(ResolvedTarget);
export interface ActionParameter {
  description?: string;
  required?: boolean;
}
export const ActionParameter = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ActionParameter",
}) as any as S.Schema<ActionParameter>;
export interface TargetResourceTypeParameter {
  description?: string;
  required?: boolean;
}
export const TargetResourceTypeParameter = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TargetResourceTypeParameter",
}) as any as S.Schema<TargetResourceTypeParameter>;
export interface CreateExperimentTemplateRequest {
  clientToken: string;
  description: string;
  stopConditions: CreateExperimentTemplateStopConditionInputList;
  targets?: CreateExperimentTemplateTargetInputMap;
  actions: CreateExperimentTemplateActionInputMap;
  roleArn: string;
  tags?: TagMap;
  logConfiguration?: CreateExperimentTemplateLogConfigurationInput;
  experimentOptions?: CreateExperimentTemplateExperimentOptionsInput;
  experimentReportConfiguration?: CreateExperimentTemplateReportConfigurationInput;
}
export const CreateExperimentTemplateRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    description: S.String,
    stopConditions: CreateExperimentTemplateStopConditionInputList,
    targets: S.optional(CreateExperimentTemplateTargetInputMap),
    actions: CreateExperimentTemplateActionInputMap,
    roleArn: S.String,
    tags: S.optional(TagMap),
    logConfiguration: S.optional(CreateExperimentTemplateLogConfigurationInput),
    experimentOptions: S.optional(
      CreateExperimentTemplateExperimentOptionsInput,
    ),
    experimentReportConfiguration: S.optional(
      CreateExperimentTemplateReportConfigurationInput,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/experimentTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateExperimentTemplateRequest",
}) as any as S.Schema<CreateExperimentTemplateRequest>;
export interface GetSafetyLeverResponse {
  safetyLever?: SafetyLever;
}
export const GetSafetyLeverResponse = S.suspend(() =>
  S.Struct({ safetyLever: S.optional(SafetyLever) }),
).annotations({
  identifier: "GetSafetyLeverResponse",
}) as any as S.Schema<GetSafetyLeverResponse>;
export interface ListExperimentResolvedTargetsResponse {
  resolvedTargets?: ResolvedTargetList;
  nextToken?: string;
}
export const ListExperimentResolvedTargetsResponse = S.suspend(() =>
  S.Struct({
    resolvedTargets: S.optional(ResolvedTargetList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperimentResolvedTargetsResponse",
}) as any as S.Schema<ListExperimentResolvedTargetsResponse>;
export interface UpdateExperimentTemplateResponse {
  experimentTemplate?: ExperimentTemplate;
}
export const UpdateExperimentTemplateResponse = S.suspend(() =>
  S.Struct({ experimentTemplate: S.optional(ExperimentTemplate) }),
).annotations({
  identifier: "UpdateExperimentTemplateResponse",
}) as any as S.Schema<UpdateExperimentTemplateResponse>;
export type ActionParameterMap = { [key: string]: ActionParameter };
export const ActionParameterMap = S.Record({
  key: S.String,
  value: ActionParameter,
});
export type TargetResourceTypeParameterMap = {
  [key: string]: TargetResourceTypeParameter;
};
export const TargetResourceTypeParameterMap = S.Record({
  key: S.String,
  value: TargetResourceTypeParameter,
});
export interface Action {
  id?: string;
  arn?: string;
  description?: string;
  parameters?: ActionParameterMap;
  targets?: ActionTargetMap;
  tags?: TagMap;
}
export const Action = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
    parameters: S.optional(ActionParameterMap),
    targets: S.optional(ActionTargetMap),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export interface TargetResourceType {
  resourceType?: string;
  description?: string;
  parameters?: TargetResourceTypeParameterMap;
}
export const TargetResourceType = S.suspend(() =>
  S.Struct({
    resourceType: S.optional(S.String),
    description: S.optional(S.String),
    parameters: S.optional(TargetResourceTypeParameterMap),
  }),
).annotations({
  identifier: "TargetResourceType",
}) as any as S.Schema<TargetResourceType>;
export interface CreateExperimentTemplateResponse {
  experimentTemplate?: ExperimentTemplate;
}
export const CreateExperimentTemplateResponse = S.suspend(() =>
  S.Struct({ experimentTemplate: S.optional(ExperimentTemplate) }),
).annotations({
  identifier: "CreateExperimentTemplateResponse",
}) as any as S.Schema<CreateExperimentTemplateResponse>;
export interface GetActionResponse {
  action?: Action;
}
export const GetActionResponse = S.suspend(() =>
  S.Struct({ action: S.optional(Action) }),
).annotations({
  identifier: "GetActionResponse",
}) as any as S.Schema<GetActionResponse>;
export interface GetTargetResourceTypeResponse {
  targetResourceType?: TargetResourceType;
}
export const GetTargetResourceTypeResponse = S.suspend(() =>
  S.Struct({ targetResourceType: S.optional(TargetResourceType) }),
).annotations({
  identifier: "GetTargetResourceTypeResponse",
}) as any as S.Schema<GetTargetResourceTypeResponse>;
export interface DeleteExperimentTemplateResponse {
  experimentTemplate?: ExperimentTemplate;
}
export const DeleteExperimentTemplateResponse = S.suspend(() =>
  S.Struct({ experimentTemplate: S.optional(ExperimentTemplate) }),
).annotations({
  identifier: "DeleteExperimentTemplateResponse",
}) as any as S.Schema<DeleteExperimentTemplateResponse>;
export interface GetExperimentResponse {
  experiment?: Experiment;
}
export const GetExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: S.optional(Experiment) }),
).annotations({
  identifier: "GetExperimentResponse",
}) as any as S.Schema<GetExperimentResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceQuotaExceededException",
    httpResponseCode: 402,
  }),
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Applies the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Deletes the specified target account configuration of the experiment template.
 */
export const deleteTargetAccountConfiguration: (
  input: DeleteTargetAccountConfigurationRequest,
) => Effect.Effect<
  DeleteTargetAccountConfigurationResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetAccountConfigurationRequest,
  output: DeleteTargetAccountConfigurationResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified safety lever.
 */
export const getSafetyLever: (
  input: GetSafetyLeverRequest,
) => Effect.Effect<
  GetSafetyLeverResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSafetyLeverRequest,
  output: GetSafetyLeverResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the resolved targets information of the specified experiment.
 */
export const listExperimentResolvedTargets: {
  (
    input: ListExperimentResolvedTargetsRequest,
  ): Effect.Effect<
    ListExperimentResolvedTargetsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperimentResolvedTargetsRequest,
  ) => Stream.Stream<
    ListExperimentResolvedTargetsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperimentResolvedTargetsRequest,
  ) => Stream.Stream<
    ResolvedTarget,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperimentResolvedTargetsRequest,
  output: ListExperimentResolvedTargetsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resolvedTargets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the specified safety lever state.
 */
export const updateSafetyLeverState: (
  input: UpdateSafetyLeverStateRequest,
) => Effect.Effect<
  UpdateSafetyLeverStateResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSafetyLeverStateRequest,
  output: UpdateSafetyLeverStateResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified target account configuration of the experiment.
 */
export const getExperimentTargetAccountConfiguration: (
  input: GetExperimentTargetAccountConfigurationRequest,
) => Effect.Effect<
  GetExperimentTargetAccountConfigurationResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentTargetAccountConfigurationRequest,
  output: GetExperimentTargetAccountConfigurationResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists the available FIS actions.
 */
export const listActions: {
  (
    input: ListActionsRequest,
  ): Effect.Effect<
    ListActionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActionsRequest,
  ) => Stream.Stream<
    ListActionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActionsRequest,
  ) => Stream.Stream<
    ActionSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListActionsRequest,
  output: ListActionsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists your experiments.
 */
export const listExperiments: {
  (
    input: ListExperimentsRequest,
  ): Effect.Effect<
    ListExperimentsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperimentsRequest,
  ) => Stream.Stream<
    ListExperimentsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperimentsRequest,
  ) => Stream.Stream<
    ExperimentSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperimentsRequest,
  output: ListExperimentsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "experiments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the target account configurations of the specified experiment.
 */
export const listExperimentTargetAccountConfigurations: (
  input: ListExperimentTargetAccountConfigurationsRequest,
) => Effect.Effect<
  ListExperimentTargetAccountConfigurationsResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExperimentTargetAccountConfigurationsRequest,
  output: ListExperimentTargetAccountConfigurationsResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists your experiment templates.
 */
export const listExperimentTemplates: {
  (
    input: ListExperimentTemplatesRequest,
  ): Effect.Effect<
    ListExperimentTemplatesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperimentTemplatesRequest,
  ) => Stream.Stream<
    ListExperimentTemplatesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperimentTemplatesRequest,
  ) => Stream.Stream<
    ExperimentTemplateSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperimentTemplatesRequest,
  output: ListExperimentTemplatesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "experimentTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the target account configurations of the specified experiment template.
 */
export const listTargetAccountConfigurations: {
  (
    input: ListTargetAccountConfigurationsRequest,
  ): Effect.Effect<
    ListTargetAccountConfigurationsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetAccountConfigurationsRequest,
  ) => Stream.Stream<
    ListTargetAccountConfigurationsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetAccountConfigurationsRequest,
  ) => Stream.Stream<
    TargetAccountConfigurationSummary,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetAccountConfigurationsRequest,
  output: ListTargetAccountConfigurationsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "targetAccountConfigurations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the target resource types.
 */
export const listTargetResourceTypes: {
  (
    input: ListTargetResourceTypesRequest,
  ): Effect.Effect<
    ListTargetResourceTypesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTargetResourceTypesRequest,
  ) => Stream.Stream<
    ListTargetResourceTypesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTargetResourceTypesRequest,
  ) => Stream.Stream<
    TargetResourceTypeSummary,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTargetResourceTypesRequest,
  output: ListTargetResourceTypesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "targetResourceTypes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about the specified experiment template.
 */
export const getExperimentTemplate: (
  input: GetExperimentTemplateRequest,
) => Effect.Effect<
  GetExperimentTemplateResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentTemplateRequest,
  output: GetExperimentTemplateResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified target account configuration of the experiment template.
 */
export const getTargetAccountConfiguration: (
  input: GetTargetAccountConfigurationRequest,
) => Effect.Effect<
  GetTargetAccountConfigurationResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTargetAccountConfigurationRequest,
  output: GetTargetAccountConfigurationResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Stops the specified experiment.
 */
export const stopExperiment: (
  input: StopExperimentRequest,
) => Effect.Effect<
  StopExperimentResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopExperimentRequest,
  output: StopExperimentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Updates the target account configuration for the specified experiment template.
 */
export const updateTargetAccountConfiguration: (
  input: UpdateTargetAccountConfigurationRequest,
) => Effect.Effect<
  UpdateTargetAccountConfigurationResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTargetAccountConfigurationRequest,
  output: UpdateTargetAccountConfigurationResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Creates a target account configuration for the experiment template. A target account configuration
 * is required when `accountTargeting` of `experimentOptions` is set to `multi-account`.
 * For more information, see experiment options
 * in the *Fault Injection Service User Guide*.
 */
export const createTargetAccountConfiguration: (
  input: CreateTargetAccountConfigurationRequest,
) => Effect.Effect<
  CreateTargetAccountConfigurationResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTargetAccountConfigurationRequest,
  output: CreateTargetAccountConfigurationResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified FIS action.
 */
export const getAction: (
  input: GetActionRequest,
) => Effect.Effect<
  GetActionResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActionRequest,
  output: GetActionResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified resource type.
 */
export const getTargetResourceType: (
  input: GetTargetResourceTypeRequest,
) => Effect.Effect<
  GetTargetResourceTypeResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTargetResourceTypeRequest,
  output: GetTargetResourceTypeResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Updates the specified experiment template.
 */
export const updateExperimentTemplate: (
  input: UpdateExperimentTemplateRequest,
) => Effect.Effect<
  UpdateExperimentTemplateResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExperimentTemplateRequest,
  output: UpdateExperimentTemplateResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts running an experiment from the specified experiment template.
 */
export const startExperiment: (
  input: StartExperimentRequest,
) => Effect.Effect<
  StartExperimentResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExperimentRequest,
  output: StartExperimentResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an experiment template.
 *
 * An experiment template includes the following components:
 *
 * - **Targets**: A target can be a specific resource in
 * your Amazon Web Services environment, or one or more resources that match criteria that you
 * specify, for example, resources that have specific tags.
 *
 * - **Actions**: The actions to carry out on the
 * target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.
 *
 * - **Stop conditions**: If a stop condition is
 * triggered while an experiment is running, the experiment is automatically
 * stopped. You can define a stop condition as a CloudWatch alarm.
 *
 * For more information, see experiment templates
 * in the *Fault Injection Service User Guide*.
 */
export const createExperimentTemplate: (
  input: CreateExperimentTemplateRequest,
) => Effect.Effect<
  CreateExperimentTemplateResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExperimentTemplateRequest,
  output: CreateExperimentTemplateResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified experiment template.
 */
export const deleteExperimentTemplate: (
  input: DeleteExperimentTemplateRequest,
) => Effect.Effect<
  DeleteExperimentTemplateResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExperimentTemplateRequest,
  output: DeleteExperimentTemplateResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified experiment.
 */
export const getExperiment: (
  input: GetExperimentRequest,
) => Effect.Effect<
  GetExperimentResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentRequest,
  output: GetExperimentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));

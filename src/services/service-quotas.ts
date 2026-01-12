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
  sdkId: "Service Quotas",
  serviceShapeName: "ServiceQuotasV20190624",
});
const auth = T.AwsAuthSigv4({ name: "servicequotas" });
const ver = T.ServiceVersion("2019-06-24");
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
              `https://servicequotas-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://servicequotas.${Region}.amazonaws.com`);
            }
            return e(
              `https://servicequotas-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://servicequotas.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://servicequotas.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ExceptionMessage = string;
export type RequestId = string;
export type ServiceCode = string;
export type QuotaCode = string;
export type AwsRegion = string;
export type AmazonResourceName = string;
export type ReportId = string;
export type NextToken = string;
export type MaxResultsUtilization = number;
export type QuotaContextId = string;
export type MaxResults = number;
export type QuotaValue = number;
export type SupportCaseAllowed = boolean;
export type ReportMessage = string;
export type TagKey = string;
export type ExcludedService = string;
export type ExcludedLimit = string;
export type TagValue = string;
export type TotalCount = number;
export type ReportErrorCode = string;
export type ReportErrorMessage = string;
export type QuotaName = string;
export type ServiceName = string;
export type QuotaArn = string;
export type QuotaUnit = string;
export type QuotaAdjustable = boolean;
export type GlobalQuota = boolean;
export type QuotaDescription = string;
export type QuotaMetricNamespace = string;
export type UtilizationPct = number;
export type DefaultValue = number;
export type AppliedValue = number;
export type CustomerServiceEngagementId = string;
export type Requester = string;
export type QuotaMetricName = string;
export type Statistic = string;
export type PeriodValue = number;
export type ErrorMessage = string;
export type QuotaContextScopeType = string;
export type MetricDimensionName = string;
export type MetricDimensionValue = string;

//# Schemas
export interface AssociateServiceQuotaTemplateRequest {}
export const AssociateServiceQuotaTemplateRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateServiceQuotaTemplateRequest",
}) as any as S.Schema<AssociateServiceQuotaTemplateRequest>;
export interface AssociateServiceQuotaTemplateResponse {}
export const AssociateServiceQuotaTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateServiceQuotaTemplateResponse",
}) as any as S.Schema<AssociateServiceQuotaTemplateResponse>;
export interface DisassociateServiceQuotaTemplateRequest {}
export const DisassociateServiceQuotaTemplateRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateServiceQuotaTemplateRequest",
}) as any as S.Schema<DisassociateServiceQuotaTemplateRequest>;
export interface DisassociateServiceQuotaTemplateResponse {}
export const DisassociateServiceQuotaTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateServiceQuotaTemplateResponse",
}) as any as S.Schema<DisassociateServiceQuotaTemplateResponse>;
export interface GetAssociationForServiceQuotaTemplateRequest {}
export const GetAssociationForServiceQuotaTemplateRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAssociationForServiceQuotaTemplateRequest",
}) as any as S.Schema<GetAssociationForServiceQuotaTemplateRequest>;
export interface GetAutoManagementConfigurationRequest {}
export const GetAutoManagementConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAutoManagementConfigurationRequest",
}) as any as S.Schema<GetAutoManagementConfigurationRequest>;
export interface StartQuotaUtilizationReportRequest {}
export const StartQuotaUtilizationReportRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartQuotaUtilizationReportRequest",
}) as any as S.Schema<StartQuotaUtilizationReportRequest>;
export interface StopAutoManagementRequest {}
export const StopAutoManagementRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopAutoManagementRequest",
}) as any as S.Schema<StopAutoManagementRequest>;
export interface StopAutoManagementResponse {}
export const StopAutoManagementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopAutoManagementResponse",
}) as any as S.Schema<StopAutoManagementResponse>;
export type ServiceQuotaTemplateAssociationStatus =
  | "ASSOCIATED"
  | "DISASSOCIATED"
  | (string & {});
export const ServiceQuotaTemplateAssociationStatus = S.String;
export type OptInLevel = "ACCOUNT" | (string & {});
export const OptInLevel = S.String;
export type OptInType = "NotifyOnly" | "NotifyAndAdjust" | (string & {});
export const OptInType = S.String;
export type OptInStatus = "ENABLED" | "DISABLED" | (string & {});
export const OptInStatus = S.String;
export type RequestStatus =
  | "PENDING"
  | "CASE_OPENED"
  | "APPROVED"
  | "DENIED"
  | "CASE_CLOSED"
  | "NOT_APPROVED"
  | "INVALID_REQUEST"
  | (string & {});
export const RequestStatus = S.String;
export type AppliedLevelEnum = "ACCOUNT" | "RESOURCE" | "ALL" | (string & {});
export const AppliedLevelEnum = S.String;
export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | (string & {});
export const ReportStatus = S.String;
export type InputTagKeys = string[];
export const InputTagKeys = S.Array(S.String);
export interface CreateSupportCaseRequest {
  RequestId: string;
}
export const CreateSupportCaseRequest = S.suspend(() =>
  S.Struct({ RequestId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSupportCaseRequest",
}) as any as S.Schema<CreateSupportCaseRequest>;
export interface CreateSupportCaseResponse {}
export const CreateSupportCaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateSupportCaseResponse",
}) as any as S.Schema<CreateSupportCaseResponse>;
export interface DeleteServiceQuotaIncreaseRequestFromTemplateRequest {
  ServiceCode: string;
  QuotaCode: string;
  AwsRegion: string;
}
export const DeleteServiceQuotaIncreaseRequestFromTemplateRequest = S.suspend(
  () =>
    S.Struct({
      ServiceCode: S.String,
      QuotaCode: S.String,
      AwsRegion: S.String,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DeleteServiceQuotaIncreaseRequestFromTemplateRequest",
}) as any as S.Schema<DeleteServiceQuotaIncreaseRequestFromTemplateRequest>;
export interface DeleteServiceQuotaIncreaseRequestFromTemplateResponse {}
export const DeleteServiceQuotaIncreaseRequestFromTemplateResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteServiceQuotaIncreaseRequestFromTemplateResponse",
}) as any as S.Schema<DeleteServiceQuotaIncreaseRequestFromTemplateResponse>;
export interface GetAssociationForServiceQuotaTemplateResponse {
  ServiceQuotaTemplateAssociationStatus?: ServiceQuotaTemplateAssociationStatus;
}
export const GetAssociationForServiceQuotaTemplateResponse = S.suspend(() =>
  S.Struct({
    ServiceQuotaTemplateAssociationStatus: S.optional(
      ServiceQuotaTemplateAssociationStatus,
    ),
  }),
).annotations({
  identifier: "GetAssociationForServiceQuotaTemplateResponse",
}) as any as S.Schema<GetAssociationForServiceQuotaTemplateResponse>;
export interface GetAWSDefaultServiceQuotaRequest {
  ServiceCode: string;
  QuotaCode: string;
}
export const GetAWSDefaultServiceQuotaRequest = S.suspend(() =>
  S.Struct({ ServiceCode: S.String, QuotaCode: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAWSDefaultServiceQuotaRequest",
}) as any as S.Schema<GetAWSDefaultServiceQuotaRequest>;
export interface GetQuotaUtilizationReportRequest {
  ReportId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetQuotaUtilizationReportRequest = S.suspend(() =>
  S.Struct({
    ReportId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQuotaUtilizationReportRequest",
}) as any as S.Schema<GetQuotaUtilizationReportRequest>;
export interface GetRequestedServiceQuotaChangeRequest {
  RequestId: string;
}
export const GetRequestedServiceQuotaChangeRequest = S.suspend(() =>
  S.Struct({ RequestId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRequestedServiceQuotaChangeRequest",
}) as any as S.Schema<GetRequestedServiceQuotaChangeRequest>;
export interface GetServiceQuotaRequest {
  ServiceCode: string;
  QuotaCode: string;
  ContextId?: string;
}
export const GetServiceQuotaRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    QuotaCode: S.String,
    ContextId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceQuotaRequest",
}) as any as S.Schema<GetServiceQuotaRequest>;
export interface GetServiceQuotaIncreaseRequestFromTemplateRequest {
  ServiceCode: string;
  QuotaCode: string;
  AwsRegion: string;
}
export const GetServiceQuotaIncreaseRequestFromTemplateRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    QuotaCode: S.String,
    AwsRegion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceQuotaIncreaseRequestFromTemplateRequest",
}) as any as S.Schema<GetServiceQuotaIncreaseRequestFromTemplateRequest>;
export interface ListAWSDefaultServiceQuotasRequest {
  ServiceCode: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAWSDefaultServiceQuotasRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAWSDefaultServiceQuotasRequest",
}) as any as S.Schema<ListAWSDefaultServiceQuotasRequest>;
export interface ListRequestedServiceQuotaChangeHistoryRequest {
  ServiceCode?: string;
  Status?: RequestStatus;
  NextToken?: string;
  MaxResults?: number;
  QuotaRequestedAtLevel?: AppliedLevelEnum;
}
export const ListRequestedServiceQuotaChangeHistoryRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    Status: S.optional(RequestStatus),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QuotaRequestedAtLevel: S.optional(AppliedLevelEnum),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRequestedServiceQuotaChangeHistoryRequest",
}) as any as S.Schema<ListRequestedServiceQuotaChangeHistoryRequest>;
export interface ListRequestedServiceQuotaChangeHistoryByQuotaRequest {
  ServiceCode: string;
  QuotaCode: string;
  Status?: RequestStatus;
  NextToken?: string;
  MaxResults?: number;
  QuotaRequestedAtLevel?: AppliedLevelEnum;
}
export const ListRequestedServiceQuotaChangeHistoryByQuotaRequest = S.suspend(
  () =>
    S.Struct({
      ServiceCode: S.String,
      QuotaCode: S.String,
      Status: S.optional(RequestStatus),
      NextToken: S.optional(S.String),
      MaxResults: S.optional(S.Number),
      QuotaRequestedAtLevel: S.optional(AppliedLevelEnum),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "ListRequestedServiceQuotaChangeHistoryByQuotaRequest",
}) as any as S.Schema<ListRequestedServiceQuotaChangeHistoryByQuotaRequest>;
export interface ListServiceQuotaIncreaseRequestsInTemplateRequest {
  ServiceCode?: string;
  AwsRegion?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListServiceQuotaIncreaseRequestsInTemplateRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    AwsRegion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceQuotaIncreaseRequestsInTemplateRequest",
}) as any as S.Schema<ListServiceQuotaIncreaseRequestsInTemplateRequest>;
export interface ListServiceQuotasRequest {
  ServiceCode: string;
  NextToken?: string;
  MaxResults?: number;
  QuotaCode?: string;
  QuotaAppliedAtLevel?: AppliedLevelEnum;
}
export const ListServiceQuotasRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QuotaCode: S.optional(S.String),
    QuotaAppliedAtLevel: S.optional(AppliedLevelEnum),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceQuotasRequest",
}) as any as S.Schema<ListServiceQuotasRequest>;
export interface ListServicesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListServicesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServicesRequest",
}) as any as S.Schema<ListServicesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutServiceQuotaIncreaseRequestIntoTemplateRequest {
  QuotaCode: string;
  ServiceCode: string;
  AwsRegion: string;
  DesiredValue: number;
}
export const PutServiceQuotaIncreaseRequestIntoTemplateRequest = S.suspend(() =>
  S.Struct({
    QuotaCode: S.String,
    ServiceCode: S.String,
    AwsRegion: S.String,
    DesiredValue: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutServiceQuotaIncreaseRequestIntoTemplateRequest",
}) as any as S.Schema<PutServiceQuotaIncreaseRequestIntoTemplateRequest>;
export interface RequestServiceQuotaIncreaseRequest {
  ServiceCode: string;
  QuotaCode: string;
  DesiredValue: number;
  ContextId?: string;
  SupportCaseAllowed?: boolean;
}
export const RequestServiceQuotaIncreaseRequest = S.suspend(() =>
  S.Struct({
    ServiceCode: S.String,
    QuotaCode: S.String,
    DesiredValue: S.Number,
    ContextId: S.optional(S.String),
    SupportCaseAllowed: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RequestServiceQuotaIncreaseRequest",
}) as any as S.Schema<RequestServiceQuotaIncreaseRequest>;
export interface StartQuotaUtilizationReportResponse {
  ReportId?: string;
  Status?: ReportStatus;
  Message?: string;
}
export const StartQuotaUtilizationReportResponse = S.suspend(() =>
  S.Struct({
    ReportId: S.optional(S.String),
    Status: S.optional(ReportStatus),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "StartQuotaUtilizationReportResponse",
}) as any as S.Schema<StartQuotaUtilizationReportResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: InputTagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ExcludedQuotaList = string[];
export const ExcludedQuotaList = S.Array(S.String);
export type ExclusionList = { [key: string]: string[] | undefined };
export const ExclusionList = S.Record({
  key: S.String,
  value: S.UndefinedOr(ExcludedQuotaList),
});
export interface UpdateAutoManagementRequest {
  OptInType?: OptInType;
  NotificationArn?: string;
  ExclusionList?: { [key: string]: string[] | undefined };
}
export const UpdateAutoManagementRequest = S.suspend(() =>
  S.Struct({
    OptInType: S.optional(OptInType),
    NotificationArn: S.optional(S.String),
    ExclusionList: S.optional(ExclusionList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAutoManagementRequest",
}) as any as S.Schema<UpdateAutoManagementRequest>;
export interface UpdateAutoManagementResponse {}
export const UpdateAutoManagementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAutoManagementResponse",
}) as any as S.Schema<UpdateAutoManagementResponse>;
export type MetricDimensionsMapDefinition = {
  [key: string]: string | undefined;
};
export const MetricDimensionsMapDefinition = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface MetricInfo {
  MetricNamespace?: string;
  MetricName?: string;
  MetricDimensions?: { [key: string]: string | undefined };
  MetricStatisticRecommendation?: string;
}
export const MetricInfo = S.suspend(() =>
  S.Struct({
    MetricNamespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    MetricDimensions: S.optional(MetricDimensionsMapDefinition),
    MetricStatisticRecommendation: S.optional(S.String),
  }),
).annotations({ identifier: "MetricInfo" }) as any as S.Schema<MetricInfo>;
export type PeriodUnit =
  | "MICROSECOND"
  | "MILLISECOND"
  | "SECOND"
  | "MINUTE"
  | "HOUR"
  | "DAY"
  | "WEEK"
  | (string & {});
export const PeriodUnit = S.String;
export interface QuotaPeriod {
  PeriodValue?: number;
  PeriodUnit?: PeriodUnit;
}
export const QuotaPeriod = S.suspend(() =>
  S.Struct({
    PeriodValue: S.optional(S.Number),
    PeriodUnit: S.optional(PeriodUnit),
  }),
).annotations({ identifier: "QuotaPeriod" }) as any as S.Schema<QuotaPeriod>;
export type ErrorCode =
  | "DEPENDENCY_ACCESS_DENIED_ERROR"
  | "DEPENDENCY_THROTTLING_ERROR"
  | "DEPENDENCY_SERVICE_ERROR"
  | "SERVICE_QUOTA_NOT_AVAILABLE_ERROR"
  | (string & {});
export const ErrorCode = S.String;
export interface ErrorReason {
  ErrorCode?: ErrorCode;
  ErrorMessage?: string;
}
export const ErrorReason = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(ErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorReason" }) as any as S.Schema<ErrorReason>;
export type QuotaContextScope = "RESOURCE" | "ACCOUNT" | (string & {});
export const QuotaContextScope = S.String;
export interface QuotaContextInfo {
  ContextScope?: QuotaContextScope;
  ContextScopeType?: string;
  ContextId?: string;
}
export const QuotaContextInfo = S.suspend(() =>
  S.Struct({
    ContextScope: S.optional(QuotaContextScope),
    ContextScopeType: S.optional(S.String),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "QuotaContextInfo",
}) as any as S.Schema<QuotaContextInfo>;
export interface ServiceQuota {
  ServiceCode?: string;
  ServiceName?: string;
  QuotaArn?: string;
  QuotaCode?: string;
  QuotaName?: string;
  Value?: number;
  Unit?: string;
  Adjustable?: boolean;
  GlobalQuota?: boolean;
  UsageMetric?: MetricInfo;
  Period?: QuotaPeriod;
  ErrorReason?: ErrorReason;
  QuotaAppliedAtLevel?: AppliedLevelEnum;
  QuotaContext?: QuotaContextInfo;
  Description?: string;
}
export const ServiceQuota = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    ServiceName: S.optional(S.String),
    QuotaArn: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    QuotaName: S.optional(S.String),
    Value: S.optional(S.Number),
    Unit: S.optional(S.String),
    Adjustable: S.optional(S.Boolean),
    GlobalQuota: S.optional(S.Boolean),
    UsageMetric: S.optional(MetricInfo),
    Period: S.optional(QuotaPeriod),
    ErrorReason: S.optional(ErrorReason),
    QuotaAppliedAtLevel: S.optional(AppliedLevelEnum),
    QuotaContext: S.optional(QuotaContextInfo),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "ServiceQuota" }) as any as S.Schema<ServiceQuota>;
export type ServiceQuotaListDefinition = ServiceQuota[];
export const ServiceQuotaListDefinition = S.Array(ServiceQuota);
export type RequestType = "AutomaticManagement" | (string & {});
export const RequestType = S.String;
export interface RequestedServiceQuotaChange {
  Id?: string;
  RequestType?: RequestType;
  CaseId?: string;
  ServiceCode?: string;
  ServiceName?: string;
  QuotaCode?: string;
  QuotaName?: string;
  DesiredValue?: number;
  Status?: RequestStatus;
  Created?: Date;
  LastUpdated?: Date;
  Requester?: string;
  QuotaArn?: string;
  GlobalQuota?: boolean;
  Unit?: string;
  QuotaRequestedAtLevel?: AppliedLevelEnum;
  QuotaContext?: QuotaContextInfo;
}
export const RequestedServiceQuotaChange = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    RequestType: S.optional(RequestType),
    CaseId: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    ServiceName: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    QuotaName: S.optional(S.String),
    DesiredValue: S.optional(S.Number),
    Status: S.optional(RequestStatus),
    Created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Requester: S.optional(S.String),
    QuotaArn: S.optional(S.String),
    GlobalQuota: S.optional(S.Boolean),
    Unit: S.optional(S.String),
    QuotaRequestedAtLevel: S.optional(AppliedLevelEnum),
    QuotaContext: S.optional(QuotaContextInfo),
  }),
).annotations({
  identifier: "RequestedServiceQuotaChange",
}) as any as S.Schema<RequestedServiceQuotaChange>;
export type RequestedServiceQuotaChangeHistoryListDefinition =
  RequestedServiceQuotaChange[];
export const RequestedServiceQuotaChangeHistoryListDefinition = S.Array(
  RequestedServiceQuotaChange,
);
export interface ServiceQuotaIncreaseRequestInTemplate {
  ServiceCode?: string;
  ServiceName?: string;
  QuotaCode?: string;
  QuotaName?: string;
  DesiredValue?: number;
  AwsRegion?: string;
  Unit?: string;
  GlobalQuota?: boolean;
}
export const ServiceQuotaIncreaseRequestInTemplate = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    ServiceName: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    QuotaName: S.optional(S.String),
    DesiredValue: S.optional(S.Number),
    AwsRegion: S.optional(S.String),
    Unit: S.optional(S.String),
    GlobalQuota: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ServiceQuotaIncreaseRequestInTemplate",
}) as any as S.Schema<ServiceQuotaIncreaseRequestInTemplate>;
export type ServiceQuotaIncreaseRequestInTemplateList =
  ServiceQuotaIncreaseRequestInTemplate[];
export const ServiceQuotaIncreaseRequestInTemplateList = S.Array(
  ServiceQuotaIncreaseRequestInTemplate,
);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type OutputTags = Tag[];
export const OutputTags = S.Array(Tag);
export type InputTags = Tag[];
export const InputTags = S.Array(Tag);
export interface GetServiceQuotaResponse {
  Quota?: ServiceQuota;
}
export const GetServiceQuotaResponse = S.suspend(() =>
  S.Struct({ Quota: S.optional(ServiceQuota) }),
).annotations({
  identifier: "GetServiceQuotaResponse",
}) as any as S.Schema<GetServiceQuotaResponse>;
export interface ListAWSDefaultServiceQuotasResponse {
  NextToken?: string;
  Quotas?: ServiceQuota[];
}
export const ListAWSDefaultServiceQuotasResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Quotas: S.optional(ServiceQuotaListDefinition),
  }),
).annotations({
  identifier: "ListAWSDefaultServiceQuotasResponse",
}) as any as S.Schema<ListAWSDefaultServiceQuotasResponse>;
export interface ListRequestedServiceQuotaChangeHistoryResponse {
  NextToken?: string;
  RequestedQuotas?: RequestedServiceQuotaChange[];
}
export const ListRequestedServiceQuotaChangeHistoryResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    RequestedQuotas: S.optional(
      RequestedServiceQuotaChangeHistoryListDefinition,
    ),
  }),
).annotations({
  identifier: "ListRequestedServiceQuotaChangeHistoryResponse",
}) as any as S.Schema<ListRequestedServiceQuotaChangeHistoryResponse>;
export interface ListRequestedServiceQuotaChangeHistoryByQuotaResponse {
  NextToken?: string;
  RequestedQuotas?: RequestedServiceQuotaChange[];
}
export const ListRequestedServiceQuotaChangeHistoryByQuotaResponse = S.suspend(
  () =>
    S.Struct({
      NextToken: S.optional(S.String),
      RequestedQuotas: S.optional(
        RequestedServiceQuotaChangeHistoryListDefinition,
      ),
    }),
).annotations({
  identifier: "ListRequestedServiceQuotaChangeHistoryByQuotaResponse",
}) as any as S.Schema<ListRequestedServiceQuotaChangeHistoryByQuotaResponse>;
export interface ListServiceQuotaIncreaseRequestsInTemplateResponse {
  ServiceQuotaIncreaseRequestInTemplateList?: ServiceQuotaIncreaseRequestInTemplate[];
  NextToken?: string;
}
export const ListServiceQuotaIncreaseRequestsInTemplateResponse = S.suspend(
  () =>
    S.Struct({
      ServiceQuotaIncreaseRequestInTemplateList: S.optional(
        ServiceQuotaIncreaseRequestInTemplateList,
      ),
      NextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListServiceQuotaIncreaseRequestsInTemplateResponse",
}) as any as S.Schema<ListServiceQuotaIncreaseRequestsInTemplateResponse>;
export interface ListServiceQuotasResponse {
  NextToken?: string;
  Quotas?: ServiceQuota[];
}
export const ListServiceQuotasResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Quotas: S.optional(ServiceQuotaListDefinition),
  }),
).annotations({
  identifier: "ListServiceQuotasResponse",
}) as any as S.Schema<ListServiceQuotasResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(OutputTags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutServiceQuotaIncreaseRequestIntoTemplateResponse {
  ServiceQuotaIncreaseRequestInTemplate?: ServiceQuotaIncreaseRequestInTemplate;
}
export const PutServiceQuotaIncreaseRequestIntoTemplateResponse = S.suspend(
  () =>
    S.Struct({
      ServiceQuotaIncreaseRequestInTemplate: S.optional(
        ServiceQuotaIncreaseRequestInTemplate,
      ),
    }),
).annotations({
  identifier: "PutServiceQuotaIncreaseRequestIntoTemplateResponse",
}) as any as S.Schema<PutServiceQuotaIncreaseRequestIntoTemplateResponse>;
export interface RequestServiceQuotaIncreaseResponse {
  RequestedQuota?: RequestedServiceQuotaChange;
}
export const RequestServiceQuotaIncreaseResponse = S.suspend(() =>
  S.Struct({ RequestedQuota: S.optional(RequestedServiceQuotaChange) }),
).annotations({
  identifier: "RequestServiceQuotaIncreaseResponse",
}) as any as S.Schema<RequestServiceQuotaIncreaseResponse>;
export interface StartAutoManagementRequest {
  OptInLevel: OptInLevel;
  OptInType: OptInType;
  NotificationArn?: string;
  ExclusionList?: { [key: string]: string[] | undefined };
}
export const StartAutoManagementRequest = S.suspend(() =>
  S.Struct({
    OptInLevel: OptInLevel,
    OptInType: OptInType,
    NotificationArn: S.optional(S.String),
    ExclusionList: S.optional(ExclusionList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAutoManagementRequest",
}) as any as S.Schema<StartAutoManagementRequest>;
export interface StartAutoManagementResponse {}
export const StartAutoManagementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartAutoManagementResponse",
}) as any as S.Schema<StartAutoManagementResponse>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: InputTags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface QuotaInfo {
  QuotaCode?: string;
  QuotaName?: string;
}
export const QuotaInfo = S.suspend(() =>
  S.Struct({
    QuotaCode: S.optional(S.String),
    QuotaName: S.optional(S.String),
  }),
).annotations({ identifier: "QuotaInfo" }) as any as S.Schema<QuotaInfo>;
export type QuotaInfoList = QuotaInfo[];
export const QuotaInfoList = S.Array(QuotaInfo);
export type ExclusionQuotaList = { [key: string]: QuotaInfo[] | undefined };
export const ExclusionQuotaList = S.Record({
  key: S.String,
  value: S.UndefinedOr(QuotaInfoList),
});
export interface QuotaUtilizationInfo {
  QuotaCode?: string;
  ServiceCode?: string;
  QuotaName?: string;
  Namespace?: string;
  Utilization?: number;
  DefaultValue?: number;
  AppliedValue?: number;
  ServiceName?: string;
  Adjustable?: boolean;
}
export const QuotaUtilizationInfo = S.suspend(() =>
  S.Struct({
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    QuotaName: S.optional(S.String),
    Namespace: S.optional(S.String),
    Utilization: S.optional(S.Number),
    DefaultValue: S.optional(S.Number),
    AppliedValue: S.optional(S.Number),
    ServiceName: S.optional(S.String),
    Adjustable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "QuotaUtilizationInfo",
}) as any as S.Schema<QuotaUtilizationInfo>;
export type QuotaUtilizationInfoList = QuotaUtilizationInfo[];
export const QuotaUtilizationInfoList = S.Array(QuotaUtilizationInfo);
export interface ServiceInfo {
  ServiceCode?: string;
  ServiceName?: string;
}
export const ServiceInfo = S.suspend(() =>
  S.Struct({
    ServiceCode: S.optional(S.String),
    ServiceName: S.optional(S.String),
  }),
).annotations({ identifier: "ServiceInfo" }) as any as S.Schema<ServiceInfo>;
export type ServiceInfoListDefinition = ServiceInfo[];
export const ServiceInfoListDefinition = S.Array(ServiceInfo);
export interface GetAutoManagementConfigurationResponse {
  OptInLevel?: OptInLevel;
  OptInType?: OptInType;
  NotificationArn?: string;
  OptInStatus?: OptInStatus;
  ExclusionList?: { [key: string]: QuotaInfo[] | undefined };
}
export const GetAutoManagementConfigurationResponse = S.suspend(() =>
  S.Struct({
    OptInLevel: S.optional(OptInLevel),
    OptInType: S.optional(OptInType),
    NotificationArn: S.optional(S.String),
    OptInStatus: S.optional(OptInStatus),
    ExclusionList: S.optional(ExclusionQuotaList),
  }),
).annotations({
  identifier: "GetAutoManagementConfigurationResponse",
}) as any as S.Schema<GetAutoManagementConfigurationResponse>;
export interface GetQuotaUtilizationReportResponse {
  ReportId?: string;
  Status?: ReportStatus;
  GeneratedAt?: Date;
  TotalCount?: number;
  Quotas?: QuotaUtilizationInfo[];
  NextToken?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const GetQuotaUtilizationReportResponse = S.suspend(() =>
  S.Struct({
    ReportId: S.optional(S.String),
    Status: S.optional(ReportStatus),
    GeneratedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TotalCount: S.optional(S.Number),
    Quotas: S.optional(QuotaUtilizationInfoList),
    NextToken: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQuotaUtilizationReportResponse",
}) as any as S.Schema<GetQuotaUtilizationReportResponse>;
export interface GetRequestedServiceQuotaChangeResponse {
  RequestedQuota?: RequestedServiceQuotaChange;
}
export const GetRequestedServiceQuotaChangeResponse = S.suspend(() =>
  S.Struct({ RequestedQuota: S.optional(RequestedServiceQuotaChange) }),
).annotations({
  identifier: "GetRequestedServiceQuotaChangeResponse",
}) as any as S.Schema<GetRequestedServiceQuotaChangeResponse>;
export interface GetServiceQuotaIncreaseRequestFromTemplateResponse {
  ServiceQuotaIncreaseRequestInTemplate?: ServiceQuotaIncreaseRequestInTemplate;
}
export const GetServiceQuotaIncreaseRequestFromTemplateResponse = S.suspend(
  () =>
    S.Struct({
      ServiceQuotaIncreaseRequestInTemplate: S.optional(
        ServiceQuotaIncreaseRequestInTemplate,
      ),
    }),
).annotations({
  identifier: "GetServiceQuotaIncreaseRequestFromTemplateResponse",
}) as any as S.Schema<GetServiceQuotaIncreaseRequestFromTemplateResponse>;
export interface ListServicesResponse {
  NextToken?: string;
  Services?: ServiceInfo[];
}
export const ListServicesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Services: S.optional(ServiceInfoListDefinition),
  }),
).annotations({
  identifier: "ListServicesResponse",
}) as any as S.Schema<ListServicesResponse>;
export interface GetAWSDefaultServiceQuotaResponse {
  Quota?: ServiceQuota;
}
export const GetAWSDefaultServiceQuotaResponse = S.suspend(() =>
  S.Struct({ Quota: S.optional(ServiceQuota) }),
).annotations({
  identifier: "GetAWSDefaultServiceQuotaResponse",
}) as any as S.Schema<GetAWSDefaultServiceQuotaResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class AWSServiceAccessNotEnabledException extends S.TaggedError<AWSServiceAccessNotEnabledException>()(
  "AWSServiceAccessNotEnabledException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class DependencyAccessDeniedException extends S.TaggedError<DependencyAccessDeniedException>()(
  "DependencyAccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoSuchResourceException extends S.TaggedError<NoSuchResourceException>()(
  "NoSuchResourceException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NoAvailableOrganizationException extends S.TaggedError<NoAvailableOrganizationException>()(
  "NoAvailableOrganizationException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withAlreadyExistsError) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class QuotaExceededException extends S.TaggedError<QuotaExceededException>()(
  "QuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TagPolicyViolationException extends S.TaggedError<TagPolicyViolationException>()(
  "TagPolicyViolationException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class TemplatesNotAvailableInRegionException extends S.TaggedError<TemplatesNotAvailableInRegionException>()(
  "TemplatesNotAvailableInRegionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaTemplateNotInUseException extends S.TaggedError<ServiceQuotaTemplateNotInUseException>()(
  "ServiceQuotaTemplateNotInUseException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Creates a Support case for an existing quota increase request. This call only creates
 * a Support case if the request has a `Pending` status.
 */
export const createSupportCase: (
  input: CreateSupportCaseRequest,
) => effect.Effect<
  CreateSupportCaseResponse,
  | AccessDeniedException
  | DependencyAccessDeniedException
  | IllegalArgumentException
  | InvalidResourceStateException
  | NoSuchResourceException
  | ResourceAlreadyExistsException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSupportCaseRequest,
  output: CreateSupportCaseResponse,
  errors: [
    AccessDeniedException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    InvalidResourceStateException,
    NoSuchResourceException,
    ResourceAlreadyExistsException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the quota increase request for the specified quota from your quota request
 * template.
 */
export const deleteServiceQuotaIncreaseRequestFromTemplate: (
  input: DeleteServiceQuotaIncreaseRequestFromTemplateRequest,
) => effect.Effect<
  DeleteServiceQuotaIncreaseRequestFromTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | IllegalArgumentException
  | NoAvailableOrganizationException
  | NoSuchResourceException
  | ServiceException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceQuotaIncreaseRequestFromTemplateRequest,
  output: DeleteServiceQuotaIncreaseRequestFromTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    NoAvailableOrganizationException,
    NoSuchResourceException,
    ServiceException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the status of the association for the quota request template.
 */
export const getAssociationForServiceQuotaTemplate: (
  input: GetAssociationForServiceQuotaTemplateRequest,
) => effect.Effect<
  GetAssociationForServiceQuotaTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | NoAvailableOrganizationException
  | ServiceException
  | ServiceQuotaTemplateNotInUseException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssociationForServiceQuotaTemplateRequest,
  output: GetAssociationForServiceQuotaTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    NoAvailableOrganizationException,
    ServiceException,
    ServiceQuotaTemplateNotInUseException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the default values for the quotas for the specified Amazon Web Services service. A default
 * value does not reflect any quota increases.
 */
export const listAWSDefaultServiceQuotas: {
  (
    input: ListAWSDefaultServiceQuotasRequest,
  ): effect.Effect<
    ListAWSDefaultServiceQuotasResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAWSDefaultServiceQuotasRequest,
  ) => stream.Stream<
    ListAWSDefaultServiceQuotasResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAWSDefaultServiceQuotasRequest,
  ) => stream.Stream<
    ServiceQuota,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAWSDefaultServiceQuotasRequest,
  output: ListAWSDefaultServiceQuotasResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Quotas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the quota increase requests for the specified Amazon Web Services service. Filter
 * responses to return quota requests at either the account level, resource level, or all
 * levels. Responses include any open or closed requests within 90 days.
 */
export const listRequestedServiceQuotaChangeHistory: {
  (
    input: ListRequestedServiceQuotaChangeHistoryRequest,
  ): effect.Effect<
    ListRequestedServiceQuotaChangeHistoryResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequestedServiceQuotaChangeHistoryRequest,
  ) => stream.Stream<
    ListRequestedServiceQuotaChangeHistoryResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequestedServiceQuotaChangeHistoryRequest,
  ) => stream.Stream<
    RequestedServiceQuotaChange,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequestedServiceQuotaChangeHistoryRequest,
  output: ListRequestedServiceQuotaChangeHistoryResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RequestedQuotas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the quota increase requests for the specified quota. Filter responses to
 * return quota requests at either the account level, resource level, or all levels.
 */
export const listRequestedServiceQuotaChangeHistoryByQuota: {
  (
    input: ListRequestedServiceQuotaChangeHistoryByQuotaRequest,
  ): effect.Effect<
    ListRequestedServiceQuotaChangeHistoryByQuotaResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequestedServiceQuotaChangeHistoryByQuotaRequest,
  ) => stream.Stream<
    ListRequestedServiceQuotaChangeHistoryByQuotaResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequestedServiceQuotaChangeHistoryByQuotaRequest,
  ) => stream.Stream<
    RequestedServiceQuotaChange,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequestedServiceQuotaChangeHistoryByQuotaRequest,
  output: ListRequestedServiceQuotaChangeHistoryByQuotaResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RequestedQuotas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the applied quota values for the specified Amazon Web Services service. For some quotas, only
 * the default values are available. If the applied quota value is not available for a
 * quota, the quota is not retrieved. Filter responses to return applied quota values at
 * either the account level, resource level, or all levels.
 */
export const listServiceQuotas: {
  (
    input: ListServiceQuotasRequest,
  ): effect.Effect<
    ListServiceQuotasResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceQuotasRequest,
  ) => stream.Stream<
    ListServiceQuotasResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceQuotasRequest,
  ) => stream.Stream<
    ServiceQuota,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | NoSuchResourceException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceQuotasRequest,
  output: ListServiceQuotasResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Quotas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the names and codes for the Amazon Web Services services integrated with Service Quotas.
 */
export const listServices: {
  (
    input: ListServicesRequest,
  ): effect.Effect<
    ListServicesResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ListServicesResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ServiceInfo,
    | AccessDeniedException
    | IllegalArgumentException
    | InvalidPaginationTokenException
    | ServiceException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    ServiceException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Services",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes tags from the specified applied quota. You can specify one or more tags to
 * remove.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates your Service Quotas Automatic Management configuration, including notification preferences and
 * excluded quotas. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const updateAutoManagement: (
  input: UpdateAutoManagementRequest,
) => effect.Effect<
  UpdateAutoManagementResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutoManagementRequest,
  output: UpdateAutoManagementResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops Service Quotas Automatic Management for an Amazon Web Services account and removes all associated
 * configurations. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const stopAutoManagement: (
  input: StopAutoManagementRequest,
) => effect.Effect<
  StopAutoManagementResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAutoManagementRequest,
  output: StopAutoManagementResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the applied quota value for the specified account-level or resource-level
 * quota. For some quotas, only the default values are available. If the applied quota
 * value is not available for a quota, the quota is not retrieved.
 */
export const getServiceQuota: (
  input: GetServiceQuotaRequest,
) => effect.Effect<
  GetServiceQuotaResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceQuotaRequest,
  output: GetServiceQuotaResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns a list of the tags assigned to the specified applied quota.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts Service Quotas Automatic Management for an Amazon Web Services account, including notification preferences
 * and excluded quotas configurations. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const startAutoManagement: (
  input: StartAutoManagementRequest,
) => effect.Effect<
  StartAutoManagementResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAutoManagementRequest,
  output: StartAutoManagementResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about your Service Quotas Automatic Management configuration. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const getAutoManagementConfiguration: (
  input: GetAutoManagementConfigurationRequest,
) => effect.Effect<
  GetAutoManagementConfigurationResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoManagementConfigurationRequest,
  output: GetAutoManagementConfigurationResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the quota utilization report for your Amazon Web Services account. This operation returns
 * paginated results showing your quota usage across all Amazon Web Services services, sorted by utilization
 * percentage in descending order (highest utilization first).
 *
 * You must first initiate a report using the `StartQuotaUtilizationReport`
 * operation. The report generation process is asynchronous and may take several seconds to
 * complete. Poll this operation periodically to check the status and retrieve results when
 * the report is ready.
 *
 * Each report contains up to 1,000 quota records per page. Use the `NextToken`
 * parameter to retrieve additional pages of results. Reports are automatically deleted after
 * 15 minutes.
 */
export const getQuotaUtilizationReport: (
  input: GetQuotaUtilizationReportRequest,
) => effect.Effect<
  GetQuotaUtilizationReportResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQuotaUtilizationReportRequest,
  output: GetQuotaUtilizationReportResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the specified quota increase request.
 */
export const getRequestedServiceQuotaChange: (
  input: GetRequestedServiceQuotaChangeRequest,
) => effect.Effect<
  GetRequestedServiceQuotaChangeResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRequestedServiceQuotaChangeRequest,
  output: GetRequestedServiceQuotaChangeResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates the generation of a quota utilization report for your Amazon Web Services account. This
 * asynchronous operation analyzes your quota usage across all Amazon Web Services services and returns
 * a unique report identifier that you can use to retrieve the results.
 *
 * The report generation process may take several seconds to complete, depending on the
 * number of quotas in your account. Use the `GetQuotaUtilizationReport` operation
 * to check the status and retrieve the results when the report is ready.
 */
export const startQuotaUtilizationReport: (
  input: StartQuotaUtilizationReportRequest,
) => effect.Effect<
  StartQuotaUtilizationReportResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | InvalidPaginationTokenException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQuotaUtilizationReportRequest,
  output: StartQuotaUtilizationReportResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Submits a quota increase request for the specified quota at the account or resource
 * level.
 */
export const requestServiceQuotaIncrease: (
  input: RequestServiceQuotaIncreaseRequest,
) => effect.Effect<
  RequestServiceQuotaIncreaseResponse,
  | AccessDeniedException
  | DependencyAccessDeniedException
  | IllegalArgumentException
  | InvalidResourceStateException
  | NoSuchResourceException
  | QuotaExceededException
  | ResourceAlreadyExistsException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestServiceQuotaIncreaseRequest,
  output: RequestServiceQuotaIncreaseResponse,
  errors: [
    AccessDeniedException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    InvalidResourceStateException,
    NoSuchResourceException,
    QuotaExceededException,
    ResourceAlreadyExistsException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the default value for the specified quota. The default value does not
 * reflect any quota increases.
 */
export const getAWSDefaultServiceQuota: (
  input: GetAWSDefaultServiceQuotaRequest,
) => effect.Effect<
  GetAWSDefaultServiceQuotaResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAWSDefaultServiceQuotaRequest,
  output: GetAWSDefaultServiceQuotaResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the quota increase requests in the specified quota request template.
 */
export const listServiceQuotaIncreaseRequestsInTemplate: {
  (
    input: ListServiceQuotaIncreaseRequestsInTemplateRequest,
  ): effect.Effect<
    ListServiceQuotaIncreaseRequestsInTemplateResponse,
    | AccessDeniedException
    | AWSServiceAccessNotEnabledException
    | DependencyAccessDeniedException
    | IllegalArgumentException
    | NoAvailableOrganizationException
    | ServiceException
    | TemplatesNotAvailableInRegionException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceQuotaIncreaseRequestsInTemplateRequest,
  ) => stream.Stream<
    ListServiceQuotaIncreaseRequestsInTemplateResponse,
    | AccessDeniedException
    | AWSServiceAccessNotEnabledException
    | DependencyAccessDeniedException
    | IllegalArgumentException
    | NoAvailableOrganizationException
    | ServiceException
    | TemplatesNotAvailableInRegionException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceQuotaIncreaseRequestsInTemplateRequest,
  ) => stream.Stream<
    ServiceQuotaIncreaseRequestInTemplate,
    | AccessDeniedException
    | AWSServiceAccessNotEnabledException
    | DependencyAccessDeniedException
    | IllegalArgumentException
    | NoAvailableOrganizationException
    | ServiceException
    | TemplatesNotAvailableInRegionException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceQuotaIncreaseRequestsInTemplateRequest,
  output: ListServiceQuotaIncreaseRequestsInTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    NoAvailableOrganizationException,
    ServiceException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServiceQuotaIncreaseRequestInTemplateList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about the specified quota increase request in your quota request
 * template.
 */
export const getServiceQuotaIncreaseRequestFromTemplate: (
  input: GetServiceQuotaIncreaseRequestFromTemplateRequest,
) => effect.Effect<
  GetServiceQuotaIncreaseRequestFromTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | IllegalArgumentException
  | NoAvailableOrganizationException
  | NoSuchResourceException
  | ServiceException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceQuotaIncreaseRequestFromTemplateRequest,
  output: GetServiceQuotaIncreaseRequestFromTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    NoAvailableOrganizationException,
    NoSuchResourceException,
    ServiceException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Associates your quota request template with your organization. When a new
 * Amazon Web Services account is created in your organization, the quota increase requests in the
 * template are automatically applied to the account. You can add a quota increase request
 * for any adjustable quota to your template.
 */
export const associateServiceQuotaTemplate: (
  input: AssociateServiceQuotaTemplateRequest,
) => effect.Effect<
  AssociateServiceQuotaTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | NoAvailableOrganizationException
  | OrganizationNotInAllFeaturesModeException
  | ServiceException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateServiceQuotaTemplateRequest,
  output: AssociateServiceQuotaTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    NoAvailableOrganizationException,
    OrganizationNotInAllFeaturesModeException,
    ServiceException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds a quota increase request to your quota request template.
 */
export const putServiceQuotaIncreaseRequestIntoTemplate: (
  input: PutServiceQuotaIncreaseRequestIntoTemplateRequest,
) => effect.Effect<
  PutServiceQuotaIncreaseRequestIntoTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | IllegalArgumentException
  | NoAvailableOrganizationException
  | NoSuchResourceException
  | QuotaExceededException
  | ServiceException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutServiceQuotaIncreaseRequestIntoTemplateRequest,
  output: PutServiceQuotaIncreaseRequestIntoTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    IllegalArgumentException,
    NoAvailableOrganizationException,
    NoSuchResourceException,
    QuotaExceededException,
    ServiceException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables your quota request template. After a template is disabled, the quota increase
 * requests in the template are not applied to new Amazon Web Services accounts in your organization.
 * Disabling a quota request template does not apply its quota increase requests.
 */
export const disassociateServiceQuotaTemplate: (
  input: DisassociateServiceQuotaTemplateRequest,
) => effect.Effect<
  DisassociateServiceQuotaTemplateResponse,
  | AccessDeniedException
  | AWSServiceAccessNotEnabledException
  | DependencyAccessDeniedException
  | NoAvailableOrganizationException
  | ServiceException
  | ServiceQuotaTemplateNotInUseException
  | TemplatesNotAvailableInRegionException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateServiceQuotaTemplateRequest,
  output: DisassociateServiceQuotaTemplateResponse,
  errors: [
    AccessDeniedException,
    AWSServiceAccessNotEnabledException,
    DependencyAccessDeniedException,
    NoAvailableOrganizationException,
    ServiceException,
    ServiceQuotaTemplateNotInUseException,
    TemplatesNotAvailableInRegionException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds tags to the specified applied quota. You can include one or more tags to add to
 * the quota.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | NoSuchResourceException
  | ServiceException
  | TagPolicyViolationException
  | TooManyRequestsException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    NoSuchResourceException,
    ServiceException,
    TagPolicyViolationException,
    TooManyRequestsException,
    TooManyTagsException,
  ],
}));

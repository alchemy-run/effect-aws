import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Service Quotas",
  serviceShapeName: "ServiceQuotasV20190624",
});
const auth = T.AwsAuthSigv4({ name: "servicequotas" });
const ver = T.ServiceVersion("2019-06-24");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://servicequotas-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://servicequotas.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://servicequotas-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://servicequotas.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://servicequotas.{Region}.{PartitionResult#dnsSuffix}",
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
export class AssociateServiceQuotaTemplateRequest extends S.Class<AssociateServiceQuotaTemplateRequest>(
  "AssociateServiceQuotaTemplateRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateServiceQuotaTemplateResponse extends S.Class<AssociateServiceQuotaTemplateResponse>(
  "AssociateServiceQuotaTemplateResponse",
)({}) {}
export class DisassociateServiceQuotaTemplateRequest extends S.Class<DisassociateServiceQuotaTemplateRequest>(
  "DisassociateServiceQuotaTemplateRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateServiceQuotaTemplateResponse extends S.Class<DisassociateServiceQuotaTemplateResponse>(
  "DisassociateServiceQuotaTemplateResponse",
)({}) {}
export class GetAssociationForServiceQuotaTemplateRequest extends S.Class<GetAssociationForServiceQuotaTemplateRequest>(
  "GetAssociationForServiceQuotaTemplateRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutoManagementConfigurationRequest extends S.Class<GetAutoManagementConfigurationRequest>(
  "GetAutoManagementConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartQuotaUtilizationReportRequest extends S.Class<StartQuotaUtilizationReportRequest>(
  "StartQuotaUtilizationReportRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAutoManagementRequest extends S.Class<StopAutoManagementRequest>(
  "StopAutoManagementRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAutoManagementResponse extends S.Class<StopAutoManagementResponse>(
  "StopAutoManagementResponse",
)({}) {}
export const InputTagKeys = S.Array(S.String);
export class CreateSupportCaseRequest extends S.Class<CreateSupportCaseRequest>(
  "CreateSupportCaseRequest",
)(
  { RequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSupportCaseResponse extends S.Class<CreateSupportCaseResponse>(
  "CreateSupportCaseResponse",
)({}) {}
export class DeleteServiceQuotaIncreaseRequestFromTemplateRequest extends S.Class<DeleteServiceQuotaIncreaseRequestFromTemplateRequest>(
  "DeleteServiceQuotaIncreaseRequestFromTemplateRequest",
)(
  { ServiceCode: S.String, QuotaCode: S.String, AwsRegion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceQuotaIncreaseRequestFromTemplateResponse extends S.Class<DeleteServiceQuotaIncreaseRequestFromTemplateResponse>(
  "DeleteServiceQuotaIncreaseRequestFromTemplateResponse",
)({}) {}
export class GetAssociationForServiceQuotaTemplateResponse extends S.Class<GetAssociationForServiceQuotaTemplateResponse>(
  "GetAssociationForServiceQuotaTemplateResponse",
)({ ServiceQuotaTemplateAssociationStatus: S.optional(S.String) }) {}
export class GetAWSDefaultServiceQuotaRequest extends S.Class<GetAWSDefaultServiceQuotaRequest>(
  "GetAWSDefaultServiceQuotaRequest",
)(
  { ServiceCode: S.String, QuotaCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQuotaUtilizationReportRequest extends S.Class<GetQuotaUtilizationReportRequest>(
  "GetQuotaUtilizationReportRequest",
)(
  {
    ReportId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRequestedServiceQuotaChangeRequest extends S.Class<GetRequestedServiceQuotaChangeRequest>(
  "GetRequestedServiceQuotaChangeRequest",
)(
  { RequestId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceQuotaRequest extends S.Class<GetServiceQuotaRequest>(
  "GetServiceQuotaRequest",
)(
  {
    ServiceCode: S.String,
    QuotaCode: S.String,
    ContextId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceQuotaIncreaseRequestFromTemplateRequest extends S.Class<GetServiceQuotaIncreaseRequestFromTemplateRequest>(
  "GetServiceQuotaIncreaseRequestFromTemplateRequest",
)(
  { ServiceCode: S.String, QuotaCode: S.String, AwsRegion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAWSDefaultServiceQuotasRequest extends S.Class<ListAWSDefaultServiceQuotasRequest>(
  "ListAWSDefaultServiceQuotasRequest",
)(
  {
    ServiceCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRequestedServiceQuotaChangeHistoryRequest extends S.Class<ListRequestedServiceQuotaChangeHistoryRequest>(
  "ListRequestedServiceQuotaChangeHistoryRequest",
)(
  {
    ServiceCode: S.optional(S.String),
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QuotaRequestedAtLevel: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRequestedServiceQuotaChangeHistoryByQuotaRequest extends S.Class<ListRequestedServiceQuotaChangeHistoryByQuotaRequest>(
  "ListRequestedServiceQuotaChangeHistoryByQuotaRequest",
)(
  {
    ServiceCode: S.String,
    QuotaCode: S.String,
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QuotaRequestedAtLevel: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceQuotaIncreaseRequestsInTemplateRequest extends S.Class<ListServiceQuotaIncreaseRequestsInTemplateRequest>(
  "ListServiceQuotaIncreaseRequestsInTemplateRequest",
)(
  {
    ServiceCode: S.optional(S.String),
    AwsRegion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceQuotasRequest extends S.Class<ListServiceQuotasRequest>(
  "ListServiceQuotasRequest",
)(
  {
    ServiceCode: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QuotaCode: S.optional(S.String),
    QuotaAppliedAtLevel: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutServiceQuotaIncreaseRequestIntoTemplateRequest extends S.Class<PutServiceQuotaIncreaseRequestIntoTemplateRequest>(
  "PutServiceQuotaIncreaseRequestIntoTemplateRequest",
)(
  {
    QuotaCode: S.String,
    ServiceCode: S.String,
    AwsRegion: S.String,
    DesiredValue: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RequestServiceQuotaIncreaseRequest extends S.Class<RequestServiceQuotaIncreaseRequest>(
  "RequestServiceQuotaIncreaseRequest",
)(
  {
    ServiceCode: S.String,
    QuotaCode: S.String,
    DesiredValue: S.Number,
    ContextId: S.optional(S.String),
    SupportCaseAllowed: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartQuotaUtilizationReportResponse extends S.Class<StartQuotaUtilizationReportResponse>(
  "StartQuotaUtilizationReportResponse",
)({
  ReportId: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: InputTagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const ExcludedQuotaList = S.Array(S.String);
export const ExclusionList = S.Record({
  key: S.String,
  value: ExcludedQuotaList,
});
export class UpdateAutoManagementRequest extends S.Class<UpdateAutoManagementRequest>(
  "UpdateAutoManagementRequest",
)(
  {
    OptInType: S.optional(S.String),
    NotificationArn: S.optional(S.String),
    ExclusionList: S.optional(ExclusionList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAutoManagementResponse extends S.Class<UpdateAutoManagementResponse>(
  "UpdateAutoManagementResponse",
)({}) {}
export const MetricDimensionsMapDefinition = S.Record({
  key: S.String,
  value: S.String,
});
export class MetricInfo extends S.Class<MetricInfo>("MetricInfo")({
  MetricNamespace: S.optional(S.String),
  MetricName: S.optional(S.String),
  MetricDimensions: S.optional(MetricDimensionsMapDefinition),
  MetricStatisticRecommendation: S.optional(S.String),
}) {}
export class QuotaPeriod extends S.Class<QuotaPeriod>("QuotaPeriod")({
  PeriodValue: S.optional(S.Number),
  PeriodUnit: S.optional(S.String),
}) {}
export class ErrorReason extends S.Class<ErrorReason>("ErrorReason")({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class QuotaContextInfo extends S.Class<QuotaContextInfo>(
  "QuotaContextInfo",
)({
  ContextScope: S.optional(S.String),
  ContextScopeType: S.optional(S.String),
  ContextId: S.optional(S.String),
}) {}
export class ServiceQuota extends S.Class<ServiceQuota>("ServiceQuota")({
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
  QuotaAppliedAtLevel: S.optional(S.String),
  QuotaContext: S.optional(QuotaContextInfo),
  Description: S.optional(S.String),
}) {}
export const ServiceQuotaListDefinition = S.Array(ServiceQuota);
export class RequestedServiceQuotaChange extends S.Class<RequestedServiceQuotaChange>(
  "RequestedServiceQuotaChange",
)({
  Id: S.optional(S.String),
  RequestType: S.optional(S.String),
  CaseId: S.optional(S.String),
  ServiceCode: S.optional(S.String),
  ServiceName: S.optional(S.String),
  QuotaCode: S.optional(S.String),
  QuotaName: S.optional(S.String),
  DesiredValue: S.optional(S.Number),
  Status: S.optional(S.String),
  Created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Requester: S.optional(S.String),
  QuotaArn: S.optional(S.String),
  GlobalQuota: S.optional(S.Boolean),
  Unit: S.optional(S.String),
  QuotaRequestedAtLevel: S.optional(S.String),
  QuotaContext: S.optional(QuotaContextInfo),
}) {}
export const RequestedServiceQuotaChangeHistoryListDefinition = S.Array(
  RequestedServiceQuotaChange,
);
export class ServiceQuotaIncreaseRequestInTemplate extends S.Class<ServiceQuotaIncreaseRequestInTemplate>(
  "ServiceQuotaIncreaseRequestInTemplate",
)({
  ServiceCode: S.optional(S.String),
  ServiceName: S.optional(S.String),
  QuotaCode: S.optional(S.String),
  QuotaName: S.optional(S.String),
  DesiredValue: S.optional(S.Number),
  AwsRegion: S.optional(S.String),
  Unit: S.optional(S.String),
  GlobalQuota: S.optional(S.Boolean),
}) {}
export const ServiceQuotaIncreaseRequestInTemplateList = S.Array(
  ServiceQuotaIncreaseRequestInTemplate,
);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const OutputTags = S.Array(Tag);
export const InputTags = S.Array(Tag);
export class GetServiceQuotaResponse extends S.Class<GetServiceQuotaResponse>(
  "GetServiceQuotaResponse",
)({ Quota: S.optional(ServiceQuota) }) {}
export class ListAWSDefaultServiceQuotasResponse extends S.Class<ListAWSDefaultServiceQuotasResponse>(
  "ListAWSDefaultServiceQuotasResponse",
)({
  NextToken: S.optional(S.String),
  Quotas: S.optional(ServiceQuotaListDefinition),
}) {}
export class ListRequestedServiceQuotaChangeHistoryResponse extends S.Class<ListRequestedServiceQuotaChangeHistoryResponse>(
  "ListRequestedServiceQuotaChangeHistoryResponse",
)({
  NextToken: S.optional(S.String),
  RequestedQuotas: S.optional(RequestedServiceQuotaChangeHistoryListDefinition),
}) {}
export class ListRequestedServiceQuotaChangeHistoryByQuotaResponse extends S.Class<ListRequestedServiceQuotaChangeHistoryByQuotaResponse>(
  "ListRequestedServiceQuotaChangeHistoryByQuotaResponse",
)({
  NextToken: S.optional(S.String),
  RequestedQuotas: S.optional(RequestedServiceQuotaChangeHistoryListDefinition),
}) {}
export class ListServiceQuotaIncreaseRequestsInTemplateResponse extends S.Class<ListServiceQuotaIncreaseRequestsInTemplateResponse>(
  "ListServiceQuotaIncreaseRequestsInTemplateResponse",
)({
  ServiceQuotaIncreaseRequestInTemplateList: S.optional(
    ServiceQuotaIncreaseRequestInTemplateList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListServiceQuotasResponse extends S.Class<ListServiceQuotasResponse>(
  "ListServiceQuotasResponse",
)({
  NextToken: S.optional(S.String),
  Quotas: S.optional(ServiceQuotaListDefinition),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(OutputTags) }) {}
export class PutServiceQuotaIncreaseRequestIntoTemplateResponse extends S.Class<PutServiceQuotaIncreaseRequestIntoTemplateResponse>(
  "PutServiceQuotaIncreaseRequestIntoTemplateResponse",
)({
  ServiceQuotaIncreaseRequestInTemplate: S.optional(
    ServiceQuotaIncreaseRequestInTemplate,
  ),
}) {}
export class RequestServiceQuotaIncreaseResponse extends S.Class<RequestServiceQuotaIncreaseResponse>(
  "RequestServiceQuotaIncreaseResponse",
)({ RequestedQuota: S.optional(RequestedServiceQuotaChange) }) {}
export class StartAutoManagementRequest extends S.Class<StartAutoManagementRequest>(
  "StartAutoManagementRequest",
)(
  {
    OptInLevel: S.String,
    OptInType: S.String,
    NotificationArn: S.optional(S.String),
    ExclusionList: S.optional(ExclusionList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAutoManagementResponse extends S.Class<StartAutoManagementResponse>(
  "StartAutoManagementResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: InputTags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class QuotaInfo extends S.Class<QuotaInfo>("QuotaInfo")({
  QuotaCode: S.optional(S.String),
  QuotaName: S.optional(S.String),
}) {}
export const QuotaInfoList = S.Array(QuotaInfo);
export const ExclusionQuotaList = S.Record({
  key: S.String,
  value: QuotaInfoList,
});
export class QuotaUtilizationInfo extends S.Class<QuotaUtilizationInfo>(
  "QuotaUtilizationInfo",
)({
  QuotaCode: S.optional(S.String),
  ServiceCode: S.optional(S.String),
  QuotaName: S.optional(S.String),
  Namespace: S.optional(S.String),
  Utilization: S.optional(S.Number),
  DefaultValue: S.optional(S.Number),
  AppliedValue: S.optional(S.Number),
  ServiceName: S.optional(S.String),
  Adjustable: S.optional(S.Boolean),
}) {}
export const QuotaUtilizationInfoList = S.Array(QuotaUtilizationInfo);
export class ServiceInfo extends S.Class<ServiceInfo>("ServiceInfo")({
  ServiceCode: S.optional(S.String),
  ServiceName: S.optional(S.String),
}) {}
export const ServiceInfoListDefinition = S.Array(ServiceInfo);
export class GetAutoManagementConfigurationResponse extends S.Class<GetAutoManagementConfigurationResponse>(
  "GetAutoManagementConfigurationResponse",
)({
  OptInLevel: S.optional(S.String),
  OptInType: S.optional(S.String),
  NotificationArn: S.optional(S.String),
  OptInStatus: S.optional(S.String),
  ExclusionList: S.optional(ExclusionQuotaList),
}) {}
export class GetQuotaUtilizationReportResponse extends S.Class<GetQuotaUtilizationReportResponse>(
  "GetQuotaUtilizationReportResponse",
)({
  ReportId: S.optional(S.String),
  Status: S.optional(S.String),
  GeneratedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TotalCount: S.optional(S.Number),
  Quotas: S.optional(QuotaUtilizationInfoList),
  NextToken: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class GetRequestedServiceQuotaChangeResponse extends S.Class<GetRequestedServiceQuotaChangeResponse>(
  "GetRequestedServiceQuotaChangeResponse",
)({ RequestedQuota: S.optional(RequestedServiceQuotaChange) }) {}
export class GetServiceQuotaIncreaseRequestFromTemplateResponse extends S.Class<GetServiceQuotaIncreaseRequestFromTemplateResponse>(
  "GetServiceQuotaIncreaseRequestFromTemplateResponse",
)({
  ServiceQuotaIncreaseRequestInTemplate: S.optional(
    ServiceQuotaIncreaseRequestInTemplate,
  ),
}) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)({
  NextToken: S.optional(S.String),
  Services: S.optional(ServiceInfoListDefinition),
}) {}
export class GetAWSDefaultServiceQuotaResponse extends S.Class<GetAWSDefaultServiceQuotaResponse>(
  "GetAWSDefaultServiceQuotaResponse",
)({ Quota: S.optional(ServiceQuota) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class AWSServiceAccessNotEnabledException extends S.TaggedError<AWSServiceAccessNotEnabledException>()(
  "AWSServiceAccessNotEnabledException",
  {},
) {}
export class DependencyAccessDeniedException extends S.TaggedError<DependencyAccessDeniedException>()(
  "DependencyAccessDeniedException",
  {},
) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  {},
) {}
export class NoAvailableOrganizationException extends S.TaggedError<NoAvailableOrganizationException>()(
  "NoAvailableOrganizationException",
  {},
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  {},
) {}
export class NoSuchResourceException extends S.TaggedError<NoSuchResourceException>()(
  "NoSuchResourceException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaTemplateNotInUseException extends S.TaggedError<ServiceQuotaTemplateNotInUseException>()(
  "ServiceQuotaTemplateNotInUseException",
  {},
) {}
export class TemplatesNotAvailableInRegionException extends S.TaggedError<TemplatesNotAvailableInRegionException>()(
  "TemplatesNotAvailableInRegionException",
  {},
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  {},
) {}
export class QuotaExceededException extends S.TaggedError<QuotaExceededException>()(
  "QuotaExceededException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  { Message: S.optional(S.String) },
) {}
export class TagPolicyViolationException extends S.TaggedError<TagPolicyViolationException>()(
  "TagPolicyViolationException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Updates your Service Quotas Automatic Management configuration, including notification preferences and
 * excluded quotas. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const updateAutoManagement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAutoManagementRequest,
    output: UpdateAutoManagementResponse,
    errors: [
      AccessDeniedException,
      IllegalArgumentException,
      NoSuchResourceException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Disables your quota request template. After a template is disabled, the quota increase
 * requests in the template are not applied to new Amazon Web Services accounts in your organization.
 * Disabling a quota request template does not apply its quota increase requests.
 */
export const disassociateServiceQuotaTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the status of the association for the quota request template.
 */
export const getAssociationForServiceQuotaTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the applied quota value for the specified account-level or resource-level
 * quota. For some quotas, only the default values are available. If the applied quota
 * value is not available for a quota, the quota is not retrieved.
 */
export const getServiceQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the default values for the quotas for the specified Amazon Web Services service. A default
 * value does not reflect any quota increases.
 */
export const listAWSDefaultServiceQuotas = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves the quota increase requests for the specified Amazon Web Services service. Filter
 * responses to return quota requests at either the account level, resource level, or all
 * levels. Responses include any open or closed requests within 90 days.
 */
export const listRequestedServiceQuotaChangeHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Retrieves the quota increase requests for the specified quota. Filter responses to
 * return quota requests at either the account level, resource level, or all levels.
 */
export const listRequestedServiceQuotaChangeHistoryByQuota =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Lists the quota increase requests in the specified quota request template.
 */
export const listServiceQuotaIncreaseRequestsInTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
  }));
/**
 * Lists the applied quota values for the specified Amazon Web Services service. For some quotas, only
 * the default values are available. If the applied quota value is not available for a
 * quota, the quota is not retrieved. Filter responses to return applied quota values at
 * either the account level, resource level, or all levels.
 */
export const listServiceQuotas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of the tags assigned to the specified applied quota.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Submits a quota increase request for the specified quota at the account or resource
 * level.
 */
export const requestServiceQuotaIncrease = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Starts Service Quotas Automatic Management for an Amazon Web Services account, including notification preferences
 * and excluded quotas configurations. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const startAutoManagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Initiates the generation of a quota utilization report for your Amazon Web Services account. This
 * asynchronous operation analyzes your quota usage across all Amazon Web Services services and returns
 * a unique report identifier that you can use to retrieve the results.
 *
 * The report generation process may take several seconds to complete, depending on the
 * number of quotas in your account. Use the `GetQuotaUtilizationReport` operation
 * to check the status and retrieve the results when the report is ready.
 */
export const startQuotaUtilizationReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Stops Service Quotas Automatic Management for an Amazon Web Services account and removes all associated
 * configurations. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const stopAutoManagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes tags from the specified applied quota. You can specify one or more tags to
 * remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associates your quota request template with your organization. When a new
 * Amazon Web Services account is created in your organization, the quota increase requests in the
 * template are automatically applied to the account. You can add a quota increase request
 * for any adjustable quota to your template.
 */
export const associateServiceQuotaTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a Support case for an existing quota increase request. This call only creates
 * a Support case if the request has a `Pending` status.
 */
export const createSupportCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteServiceQuotaIncreaseRequestFromTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about your Service Quotas Automatic Management configuration. Automatic Management monitors your Service Quotas utilization and notifies you before you
 * run out of your allocated quotas.
 */
export const getAutoManagementConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQuotaUtilizationReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQuotaUtilizationReportRequest,
    output: GetQuotaUtilizationReportResponse,
    errors: [
      AccessDeniedException,
      IllegalArgumentException,
      NoSuchResourceException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the specified quota increase request.
 */
export const getRequestedServiceQuotaChange =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about the specified quota increase request in your quota request
 * template.
 */
export const getServiceQuotaIncreaseRequestFromTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the names and codes for the Amazon Web Services services integrated with Service Quotas.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InvalidPaginationTokenException,
    ServiceException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds a quota increase request to your quota request template.
 */
export const putServiceQuotaIncreaseRequestIntoTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds tags to the specified applied quota. You can include one or more tags to add to
 * the quota.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Retrieves the default value for the specified quota. The default value does not
 * reflect any quota increases.
 */
export const getAWSDefaultServiceQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAWSDefaultServiceQuotaRequest,
    output: GetAWSDefaultServiceQuotaResponse,
    errors: [
      AccessDeniedException,
      IllegalArgumentException,
      NoSuchResourceException,
      ServiceException,
      TooManyRequestsException,
    ],
  }),
);

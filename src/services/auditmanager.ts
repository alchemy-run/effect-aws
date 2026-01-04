import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "AuditManager",
  serviceShapeName: "BedrockAssessmentManagerLambda",
});
const auth = T.AwsAuthSigv4({ name: "auditmanager" });
const ver = T.ServiceVersion("2017-07-25");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://auditmanager-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://auditmanager-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://auditmanager.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://auditmanager.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeregisterAccountRequest extends S.Class<DeregisterAccountRequest>(
  "DeregisterAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/account/deregisterAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccountStatusRequest extends S.Class<GetAccountStatusRequest>(
  "GetAccountStatusRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightsRequest extends S.Class<GetInsightsRequest>(
  "GetInsightsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/insights" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOrganizationAdminAccountRequest extends S.Class<GetOrganizationAdminAccountRequest>(
  "GetOrganizationAdminAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account/organizationAdminAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServicesInScopeRequest extends S.Class<GetServicesInScopeRequest>(
  "GetServicesInScopeRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/services" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const EvidenceIds = S.Array(S.String);
export const DelegationIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateAssessmentReportEvidenceFolderRequest extends S.Class<AssociateAssessmentReportEvidenceFolderRequest>(
  "AssociateAssessmentReportEvidenceFolderRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()), evidenceFolderId: S.String },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/associateToAssessmentReport",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateAssessmentReportEvidenceFolderResponse extends S.Class<AssociateAssessmentReportEvidenceFolderResponse>(
  "AssociateAssessmentReportEvidenceFolderResponse",
)({}) {}
export class BatchAssociateAssessmentReportEvidenceRequest extends S.Class<BatchAssociateAssessmentReportEvidenceRequest>(
  "BatchAssociateAssessmentReportEvidenceRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    evidenceFolderId: S.String,
    evidenceIds: EvidenceIds,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/batchAssociateToAssessmentReport",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteDelegationByAssessmentRequest extends S.Class<BatchDeleteDelegationByAssessmentRequest>(
  "BatchDeleteDelegationByAssessmentRequest",
)(
  { delegationIds: DelegationIds, assessmentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PUT", uri: "/assessments/{assessmentId}/delegations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateAssessmentReportEvidenceRequest extends S.Class<BatchDisassociateAssessmentReportEvidenceRequest>(
  "BatchDisassociateAssessmentReportEvidenceRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    evidenceFolderId: S.String,
    evidenceIds: EvidenceIds,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/batchDisassociateFromAssessmentReport",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssessmentReportRequest extends S.Class<CreateAssessmentReportRequest>(
  "CreateAssessmentReportRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    assessmentId: S.String.pipe(T.HttpLabel()),
    queryStatement: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assessments/{assessmentId}/reports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssessmentRequest extends S.Class<DeleteAssessmentRequest>(
  "DeleteAssessmentRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/assessments/{assessmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssessmentResponse extends S.Class<DeleteAssessmentResponse>(
  "DeleteAssessmentResponse",
)({}) {}
export class DeleteAssessmentFrameworkRequest extends S.Class<DeleteAssessmentFrameworkRequest>(
  "DeleteAssessmentFrameworkRequest",
)(
  { frameworkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/assessmentFrameworks/{frameworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssessmentFrameworkResponse extends S.Class<DeleteAssessmentFrameworkResponse>(
  "DeleteAssessmentFrameworkResponse",
)({}) {}
export class DeleteAssessmentFrameworkShareRequest extends S.Class<DeleteAssessmentFrameworkShareRequest>(
  "DeleteAssessmentFrameworkShareRequest",
)(
  {
    requestId: S.String.pipe(T.HttpLabel()),
    requestType: S.String.pipe(T.HttpQuery("requestType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/assessmentFrameworkShareRequests/{requestId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssessmentFrameworkShareResponse extends S.Class<DeleteAssessmentFrameworkShareResponse>(
  "DeleteAssessmentFrameworkShareResponse",
)({}) {}
export class DeleteAssessmentReportRequest extends S.Class<DeleteAssessmentReportRequest>(
  "DeleteAssessmentReportRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    assessmentReportId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/assessments/{assessmentId}/reports/{assessmentReportId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAssessmentReportResponse extends S.Class<DeleteAssessmentReportResponse>(
  "DeleteAssessmentReportResponse",
)({}) {}
export class DeleteControlRequest extends S.Class<DeleteControlRequest>(
  "DeleteControlRequest",
)(
  { controlId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/controls/{controlId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteControlResponse extends S.Class<DeleteControlResponse>(
  "DeleteControlResponse",
)({}) {}
export class DeregisterAccountResponse extends S.Class<DeregisterAccountResponse>(
  "DeregisterAccountResponse",
)({ status: S.optional(S.String) }) {}
export class DeregisterOrganizationAdminAccountRequest extends S.Class<DeregisterOrganizationAdminAccountRequest>(
  "DeregisterOrganizationAdminAccountRequest",
)(
  { adminAccountId: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/account/deregisterOrganizationAdminAccount",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterOrganizationAdminAccountResponse extends S.Class<DeregisterOrganizationAdminAccountResponse>(
  "DeregisterOrganizationAdminAccountResponse",
)({}) {}
export class DisassociateAssessmentReportEvidenceFolderRequest extends S.Class<DisassociateAssessmentReportEvidenceFolderRequest>(
  "DisassociateAssessmentReportEvidenceFolderRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()), evidenceFolderId: S.String },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/disassociateFromAssessmentReport",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateAssessmentReportEvidenceFolderResponse extends S.Class<DisassociateAssessmentReportEvidenceFolderResponse>(
  "DisassociateAssessmentReportEvidenceFolderResponse",
)({}) {}
export class GetAccountStatusResponse extends S.Class<GetAccountStatusResponse>(
  "GetAccountStatusResponse",
)({ status: S.optional(S.String) }) {}
export class GetAssessmentRequest extends S.Class<GetAssessmentRequest>(
  "GetAssessmentRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/assessments/{assessmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssessmentFrameworkRequest extends S.Class<GetAssessmentFrameworkRequest>(
  "GetAssessmentFrameworkRequest",
)(
  { frameworkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/assessmentFrameworks/{frameworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssessmentReportUrlRequest extends S.Class<GetAssessmentReportUrlRequest>(
  "GetAssessmentReportUrlRequest",
)(
  {
    assessmentReportId: S.String.pipe(T.HttpLabel()),
    assessmentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/reports/{assessmentReportId}/url",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChangeLogsRequest extends S.Class<GetChangeLogsRequest>(
  "GetChangeLogsRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.optional(S.String).pipe(T.HttpQuery("controlSetId")),
    controlId: S.optional(S.String).pipe(T.HttpQuery("controlId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assessments/{assessmentId}/changelogs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetControlRequest extends S.Class<GetControlRequest>(
  "GetControlRequest",
)(
  { controlId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/controls/{controlId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDelegationsRequest extends S.Class<GetDelegationsRequest>(
  "GetDelegationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/delegations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceRequest extends S.Class<GetEvidenceRequest>(
  "GetEvidenceRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    evidenceFolderId: S.String.pipe(T.HttpLabel()),
    evidenceId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}/evidence/{evidenceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceByEvidenceFolderRequest extends S.Class<GetEvidenceByEvidenceFolderRequest>(
  "GetEvidenceByEvidenceFolderRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    evidenceFolderId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}/evidence",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceFileUploadUrlRequest extends S.Class<GetEvidenceFileUploadUrlRequest>(
  "GetEvidenceFileUploadUrlRequest",
)(
  { fileName: S.String.pipe(T.HttpQuery("fileName")) },
  T.all(
    T.Http({ method: "GET", uri: "/evidenceFileUploadUrl" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceFolderRequest extends S.Class<GetEvidenceFolderRequest>(
  "GetEvidenceFolderRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    evidenceFolderId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceFoldersByAssessmentRequest extends S.Class<GetEvidenceFoldersByAssessmentRequest>(
  "GetEvidenceFoldersByAssessmentRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/evidenceFolders",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceFoldersByAssessmentControlRequest extends S.Class<GetEvidenceFoldersByAssessmentControlRequest>(
  "GetEvidenceFoldersByAssessmentControlRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    controlId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/assessments/{assessmentId}/evidenceFolders-by-assessment-control/{controlSetId}/{controlId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightsByAssessmentRequest extends S.Class<GetInsightsByAssessmentRequest>(
  "GetInsightsByAssessmentRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/insights/assessments/{assessmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOrganizationAdminAccountResponse extends S.Class<GetOrganizationAdminAccountResponse>(
  "GetOrganizationAdminAccountResponse",
)({
  adminAccountId: S.optional(S.String),
  organizationId: S.optional(S.String),
}) {}
export class GetSettingsRequest extends S.Class<GetSettingsRequest>(
  "GetSettingsRequest",
)(
  { attribute: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/settings/{attribute}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssessmentControlInsightsByControlDomainRequest extends S.Class<ListAssessmentControlInsightsByControlDomainRequest>(
  "ListAssessmentControlInsightsByControlDomainRequest",
)(
  {
    controlDomainId: S.String.pipe(T.HttpQuery("controlDomainId")),
    assessmentId: S.String.pipe(T.HttpQuery("assessmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/insights/controls-by-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssessmentFrameworksRequest extends S.Class<ListAssessmentFrameworksRequest>(
  "ListAssessmentFrameworksRequest",
)(
  {
    frameworkType: S.String.pipe(T.HttpQuery("frameworkType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assessmentFrameworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssessmentFrameworkShareRequestsRequest extends S.Class<ListAssessmentFrameworkShareRequestsRequest>(
  "ListAssessmentFrameworkShareRequestsRequest",
)(
  {
    requestType: S.String.pipe(T.HttpQuery("requestType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assessmentFrameworkShareRequests" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssessmentReportsRequest extends S.Class<ListAssessmentReportsRequest>(
  "ListAssessmentReportsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assessmentReports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssessmentsRequest extends S.Class<ListAssessmentsRequest>(
  "ListAssessmentsRequest",
)(
  {
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assessments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListControlDomainInsightsRequest extends S.Class<ListControlDomainInsightsRequest>(
  "ListControlDomainInsightsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/insights/control-domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListControlDomainInsightsByAssessmentRequest extends S.Class<ListControlDomainInsightsByAssessmentRequest>(
  "ListControlDomainInsightsByAssessmentRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpQuery("assessmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/insights/control-domains-by-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListControlInsightsByControlDomainRequest extends S.Class<ListControlInsightsByControlDomainRequest>(
  "ListControlInsightsByControlDomainRequest",
)(
  {
    controlDomainId: S.String.pipe(T.HttpQuery("controlDomainId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/insights/controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListControlsRequest extends S.Class<ListControlsRequest>(
  "ListControlsRequest",
)(
  {
    controlType: S.String.pipe(T.HttpQuery("controlType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    controlCatalogId: S.optional(S.String).pipe(
      T.HttpQuery("controlCatalogId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListKeywordsForDataSourceRequest extends S.Class<ListKeywordsForDataSourceRequest>(
  "ListKeywordsForDataSourceRequest",
)(
  {
    source: S.String.pipe(T.HttpQuery("source")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/dataSourceKeywords" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationsRequest extends S.Class<ListNotificationsRequest>(
  "ListNotificationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/notifications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterAccountRequest extends S.Class<RegisterAccountRequest>(
  "RegisterAccountRequest",
)(
  { kmsKey: S.optional(S.String), delegatedAdminAccount: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/account/registerAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterOrganizationAdminAccountRequest extends S.Class<RegisterOrganizationAdminAccountRequest>(
  "RegisterOrganizationAdminAccountRequest",
)(
  { adminAccountId: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/account/registerOrganizationAdminAccount",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAssessmentFrameworkShareRequest extends S.Class<StartAssessmentFrameworkShareRequest>(
  "StartAssessmentFrameworkShareRequest",
)(
  {
    frameworkId: S.String.pipe(T.HttpLabel()),
    destinationAccount: S.String,
    destinationRegion: S.String,
    comment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/assessmentFrameworks/{frameworkId}/shareRequests",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class AWSAccount extends S.Class<AWSAccount>("AWSAccount")({
  id: S.optional(S.String),
  emailAddress: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export const AWSAccounts = S.Array(AWSAccount);
export class AWSService extends S.Class<AWSService>("AWSService")({
  serviceName: S.optional(S.String),
}) {}
export const AWSServices = S.Array(AWSService);
export class Scope extends S.Class<Scope>("Scope")({
  awsAccounts: S.optional(AWSAccounts),
  awsServices: S.optional(AWSServices),
}) {}
export class AssessmentReportsDestination extends S.Class<AssessmentReportsDestination>(
  "AssessmentReportsDestination",
)({
  destinationType: S.optional(S.String),
  destination: S.optional(S.String),
}) {}
export class Role extends S.Class<Role>("Role")({
  roleType: S.String,
  roleArn: S.String,
}) {}
export const Roles = S.Array(Role);
export class UpdateAssessmentRequest extends S.Class<UpdateAssessmentRequest>(
  "UpdateAssessmentRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    assessmentName: S.optional(S.String),
    assessmentDescription: S.optional(S.String),
    scope: Scope,
    assessmentReportsDestination: S.optional(AssessmentReportsDestination),
    roles: S.optional(Roles),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/assessments/{assessmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssessmentControlRequest extends S.Class<UpdateAssessmentControlRequest>(
  "UpdateAssessmentControlRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    controlId: S.String.pipe(T.HttpLabel()),
    controlStatus: S.optional(S.String),
    commentBody: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/controls/{controlId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssessmentControlSetStatusRequest extends S.Class<UpdateAssessmentControlSetStatusRequest>(
  "UpdateAssessmentControlSetStatusRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    status: S.String,
    comment: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssessmentFrameworkShareRequest extends S.Class<UpdateAssessmentFrameworkShareRequest>(
  "UpdateAssessmentFrameworkShareRequest",
)(
  {
    requestId: S.String.pipe(T.HttpLabel()),
    requestType: S.String,
    action: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/assessmentFrameworkShareRequests/{requestId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssessmentStatusRequest extends S.Class<UpdateAssessmentStatusRequest>(
  "UpdateAssessmentStatusRequest",
)(
  { assessmentId: S.String.pipe(T.HttpLabel()), status: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/assessments/{assessmentId}/status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateAssessmentReportIntegrityRequest extends S.Class<ValidateAssessmentReportIntegrityRequest>(
  "ValidateAssessmentReportIntegrityRequest",
)(
  { s3RelativePath: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/assessmentReports/integrity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDelegationRequest extends S.Class<CreateDelegationRequest>(
  "CreateDelegationRequest",
)({
  comment: S.optional(S.String),
  controlSetId: S.optional(S.String),
  roleArn: S.optional(S.String),
  roleType: S.optional(S.String),
}) {}
export const CreateDelegationRequests = S.Array(CreateDelegationRequest);
export class ManualEvidence extends S.Class<ManualEvidence>("ManualEvidence")({
  s3ResourcePath: S.optional(S.String),
  textResponse: S.optional(S.String),
  evidenceFileName: S.optional(S.String),
}) {}
export const ManualEvidenceList = S.Array(ManualEvidence);
export class Resource extends S.Class<Resource>("Resource")({
  arn: S.optional(S.String),
  value: S.optional(S.String),
  complianceCheck: S.optional(S.String),
}) {}
export const Resources = S.Array(Resource);
export const EvidenceAttributes = S.Record({ key: S.String, value: S.String });
export class Evidence extends S.Class<Evidence>("Evidence")({
  dataSource: S.optional(S.String),
  evidenceAwsAccountId: S.optional(S.String),
  time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  eventSource: S.optional(S.String),
  eventName: S.optional(S.String),
  evidenceByType: S.optional(S.String),
  resourcesIncluded: S.optional(Resources),
  attributes: S.optional(EvidenceAttributes),
  iamId: S.optional(S.String),
  complianceCheck: S.optional(S.String),
  awsOrganization: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  evidenceFolderId: S.optional(S.String),
  id: S.optional(S.String),
  assessmentReportSelection: S.optional(S.String),
}) {}
export const EvidenceList = S.Array(Evidence);
export class AssessmentEvidenceFolder extends S.Class<AssessmentEvidenceFolder>(
  "AssessmentEvidenceFolder",
)({
  name: S.optional(S.String),
  date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  assessmentId: S.optional(S.String),
  controlSetId: S.optional(S.String),
  controlId: S.optional(S.String),
  id: S.optional(S.String),
  dataSource: S.optional(S.String),
  author: S.optional(S.String),
  totalEvidence: S.optional(S.Number),
  assessmentReportSelectionCount: S.optional(S.Number),
  controlName: S.optional(S.String),
  evidenceResourcesIncludedCount: S.optional(S.Number),
  evidenceByTypeConfigurationDataCount: S.optional(S.Number),
  evidenceByTypeManualCount: S.optional(S.Number),
  evidenceByTypeComplianceCheckCount: S.optional(S.Number),
  evidenceByTypeComplianceCheckIssuesCount: S.optional(S.Number),
  evidenceByTypeUserActivityCount: S.optional(S.Number),
  evidenceAwsServiceSourceCount: S.optional(S.Number),
}) {}
export const AssessmentEvidenceFolders = S.Array(AssessmentEvidenceFolder);
export class Insights extends S.Class<Insights>("Insights")({
  activeAssessmentsCount: S.optional(S.Number),
  noncompliantEvidenceCount: S.optional(S.Number),
  compliantEvidenceCount: S.optional(S.Number),
  inconclusiveEvidenceCount: S.optional(S.Number),
  assessmentControlsCountByNoncompliantEvidence: S.optional(S.Number),
  totalAssessmentControlsCount: S.optional(S.Number),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ServiceMetadata extends S.Class<ServiceMetadata>(
  "ServiceMetadata",
)({
  name: S.optional(S.String),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export const ServiceMetadataList = S.Array(ServiceMetadata);
export const Keywords = S.Array(S.String);
export class CreateAssessmentFrameworkControl extends S.Class<CreateAssessmentFrameworkControl>(
  "CreateAssessmentFrameworkControl",
)({ id: S.String }) {}
export const CreateAssessmentFrameworkControls = S.Array(
  CreateAssessmentFrameworkControl,
);
export class UpdateAssessmentFrameworkControlSet extends S.Class<UpdateAssessmentFrameworkControlSet>(
  "UpdateAssessmentFrameworkControlSet",
)({
  id: S.optional(S.String),
  name: S.String,
  controls: CreateAssessmentFrameworkControls,
}) {}
export const UpdateAssessmentFrameworkControlSets = S.Array(
  UpdateAssessmentFrameworkControlSet,
);
export class SourceKeyword extends S.Class<SourceKeyword>("SourceKeyword")({
  keywordInputType: S.optional(S.String),
  keywordValue: S.optional(S.String),
}) {}
export class ControlMappingSource extends S.Class<ControlMappingSource>(
  "ControlMappingSource",
)({
  sourceId: S.optional(S.String),
  sourceName: S.optional(S.String),
  sourceDescription: S.optional(S.String),
  sourceSetUpOption: S.optional(S.String),
  sourceType: S.optional(S.String),
  sourceKeyword: S.optional(SourceKeyword),
  sourceFrequency: S.optional(S.String),
  troubleshootingText: S.optional(S.String),
}) {}
export const ControlMappingSources = S.Array(ControlMappingSource);
export class DeregistrationPolicy extends S.Class<DeregistrationPolicy>(
  "DeregistrationPolicy",
)({ deleteResources: S.optional(S.String) }) {}
export class DefaultExportDestination extends S.Class<DefaultExportDestination>(
  "DefaultExportDestination",
)({
  destinationType: S.optional(S.String),
  destination: S.optional(S.String),
}) {}
export const ValidationErrors = S.Array(S.String);
export class BatchCreateDelegationByAssessmentRequest extends S.Class<BatchCreateDelegationByAssessmentRequest>(
  "BatchCreateDelegationByAssessmentRequest",
)(
  {
    createDelegationRequests: CreateDelegationRequests,
    assessmentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assessments/{assessmentId}/delegations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssessmentReportEvidenceError extends S.Class<AssessmentReportEvidenceError>(
  "AssessmentReportEvidenceError",
)({
  evidenceId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const AssessmentReportEvidenceErrors = S.Array(
  AssessmentReportEvidenceError,
);
export class BatchDisassociateAssessmentReportEvidenceResponse extends S.Class<BatchDisassociateAssessmentReportEvidenceResponse>(
  "BatchDisassociateAssessmentReportEvidenceResponse",
)({
  evidenceIds: S.optional(EvidenceIds),
  errors: S.optional(AssessmentReportEvidenceErrors),
}) {}
export class BatchImportEvidenceToAssessmentControlRequest extends S.Class<BatchImportEvidenceToAssessmentControlRequest>(
  "BatchImportEvidenceToAssessmentControlRequest",
)(
  {
    assessmentId: S.String.pipe(T.HttpLabel()),
    controlSetId: S.String.pipe(T.HttpLabel()),
    controlId: S.String.pipe(T.HttpLabel()),
    manualEvidence: ManualEvidenceList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/controls/{controlId}/evidence",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEvidenceByEvidenceFolderResponse extends S.Class<GetEvidenceByEvidenceFolderResponse>(
  "GetEvidenceByEvidenceFolderResponse",
)({ evidence: S.optional(EvidenceList), nextToken: S.optional(S.String) }) {}
export class GetEvidenceFileUploadUrlResponse extends S.Class<GetEvidenceFileUploadUrlResponse>(
  "GetEvidenceFileUploadUrlResponse",
)({
  evidenceFileName: S.optional(S.String),
  uploadUrl: S.optional(S.String),
}) {}
export class GetEvidenceFoldersByAssessmentResponse extends S.Class<GetEvidenceFoldersByAssessmentResponse>(
  "GetEvidenceFoldersByAssessmentResponse",
)({
  evidenceFolders: S.optional(AssessmentEvidenceFolders),
  nextToken: S.optional(S.String),
}) {}
export class GetEvidenceFoldersByAssessmentControlResponse extends S.Class<GetEvidenceFoldersByAssessmentControlResponse>(
  "GetEvidenceFoldersByAssessmentControlResponse",
)({
  evidenceFolders: S.optional(AssessmentEvidenceFolders),
  nextToken: S.optional(S.String),
}) {}
export class GetInsightsResponse extends S.Class<GetInsightsResponse>(
  "GetInsightsResponse",
)({ insights: S.optional(Insights) }) {}
export class GetServicesInScopeResponse extends S.Class<GetServicesInScopeResponse>(
  "GetServicesInScopeResponse",
)({ serviceMetadata: S.optional(ServiceMetadataList) }) {}
export class EvidenceInsights extends S.Class<EvidenceInsights>(
  "EvidenceInsights",
)({
  noncompliantEvidenceCount: S.optional(S.Number),
  compliantEvidenceCount: S.optional(S.Number),
  inconclusiveEvidenceCount: S.optional(S.Number),
}) {}
export class ControlDomainInsights extends S.Class<ControlDomainInsights>(
  "ControlDomainInsights",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  controlsCountByNoncompliantEvidence: S.optional(S.Number),
  totalControlsCount: S.optional(S.Number),
  evidenceInsights: S.optional(EvidenceInsights),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ControlDomainInsightsList = S.Array(ControlDomainInsights);
export class ListControlDomainInsightsByAssessmentResponse extends S.Class<ListControlDomainInsightsByAssessmentResponse>(
  "ListControlDomainInsightsByAssessmentResponse",
)({
  controlDomainInsights: S.optional(ControlDomainInsightsList),
  nextToken: S.optional(S.String),
}) {}
export class ListKeywordsForDataSourceResponse extends S.Class<ListKeywordsForDataSourceResponse>(
  "ListKeywordsForDataSourceResponse",
)({ keywords: S.optional(Keywords), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class RegisterAccountResponse extends S.Class<RegisterAccountResponse>(
  "RegisterAccountResponse",
)({ status: S.optional(S.String) }) {}
export class RegisterOrganizationAdminAccountResponse extends S.Class<RegisterOrganizationAdminAccountResponse>(
  "RegisterOrganizationAdminAccountResponse",
)({
  adminAccountId: S.optional(S.String),
  organizationId: S.optional(S.String),
}) {}
export class AssessmentFrameworkShareRequest extends S.Class<AssessmentFrameworkShareRequest>(
  "AssessmentFrameworkShareRequest",
)({
  id: S.optional(S.String),
  frameworkId: S.optional(S.String),
  frameworkName: S.optional(S.String),
  frameworkDescription: S.optional(S.String),
  status: S.optional(S.String),
  sourceAccount: S.optional(S.String),
  destinationAccount: S.optional(S.String),
  destinationRegion: S.optional(S.String),
  expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  comment: S.optional(S.String),
  standardControlsCount: S.optional(S.Number),
  customControlsCount: S.optional(S.Number),
  complianceType: S.optional(S.String),
}) {}
export class StartAssessmentFrameworkShareResponse extends S.Class<StartAssessmentFrameworkShareResponse>(
  "StartAssessmentFrameworkShareResponse",
)({
  assessmentFrameworkShareRequest: S.optional(AssessmentFrameworkShareRequest),
}) {}
export class Delegation extends S.Class<Delegation>("Delegation")({
  id: S.optional(S.String),
  assessmentName: S.optional(S.String),
  assessmentId: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  roleType: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  controlSetId: S.optional(S.String),
  comment: S.optional(S.String),
  createdBy: S.optional(S.String),
}) {}
export const Delegations = S.Array(Delegation);
export class AssessmentMetadata extends S.Class<AssessmentMetadata>(
  "AssessmentMetadata",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  complianceType: S.optional(S.String),
  status: S.optional(S.String),
  assessmentReportsDestination: S.optional(AssessmentReportsDestination),
  scope: S.optional(Scope),
  roles: S.optional(Roles),
  delegations: S.optional(Delegations),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class FrameworkMetadata extends S.Class<FrameworkMetadata>(
  "FrameworkMetadata",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  logo: S.optional(S.String),
  complianceType: S.optional(S.String),
}) {}
export class ControlComment extends S.Class<ControlComment>("ControlComment")({
  authorName: S.optional(S.String),
  commentBody: S.optional(S.String),
  postedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ControlComments = S.Array(ControlComment);
export const EvidenceSources = S.Array(S.String);
export class AssessmentControl extends S.Class<AssessmentControl>(
  "AssessmentControl",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  response: S.optional(S.String),
  comments: S.optional(ControlComments),
  evidenceSources: S.optional(EvidenceSources),
  evidenceCount: S.optional(S.Number),
  assessmentReportEvidenceCount: S.optional(S.Number),
}) {}
export const AssessmentControls = S.Array(AssessmentControl);
export class AssessmentControlSet extends S.Class<AssessmentControlSet>(
  "AssessmentControlSet",
)({
  id: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  roles: S.optional(Roles),
  controls: S.optional(AssessmentControls),
  delegations: S.optional(Delegations),
  systemEvidenceCount: S.optional(S.Number),
  manualEvidenceCount: S.optional(S.Number),
}) {}
export const AssessmentControlSets = S.Array(AssessmentControlSet);
export class AssessmentFramework extends S.Class<AssessmentFramework>(
  "AssessmentFramework",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  metadata: S.optional(FrameworkMetadata),
  controlSets: S.optional(AssessmentControlSets),
}) {}
export class Assessment extends S.Class<Assessment>("Assessment")({
  arn: S.optional(S.String),
  awsAccount: S.optional(AWSAccount),
  metadata: S.optional(AssessmentMetadata),
  framework: S.optional(AssessmentFramework),
  tags: S.optional(TagMap),
}) {}
export class UpdateAssessmentResponse extends S.Class<UpdateAssessmentResponse>(
  "UpdateAssessmentResponse",
)({ assessment: S.optional(Assessment) }) {}
export class UpdateAssessmentFrameworkRequest extends S.Class<UpdateAssessmentFrameworkRequest>(
  "UpdateAssessmentFrameworkRequest",
)(
  {
    frameworkId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    description: S.optional(S.String),
    complianceType: S.optional(S.String),
    controlSets: UpdateAssessmentFrameworkControlSets,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/assessmentFrameworks/{frameworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAssessmentFrameworkShareResponse extends S.Class<UpdateAssessmentFrameworkShareResponse>(
  "UpdateAssessmentFrameworkShareResponse",
)({
  assessmentFrameworkShareRequest: S.optional(AssessmentFrameworkShareRequest),
}) {}
export class UpdateAssessmentStatusResponse extends S.Class<UpdateAssessmentStatusResponse>(
  "UpdateAssessmentStatusResponse",
)({ assessment: S.optional(Assessment) }) {}
export class UpdateControlRequest extends S.Class<UpdateControlRequest>(
  "UpdateControlRequest",
)(
  {
    controlId: S.String.pipe(T.HttpLabel()),
    name: S.String,
    description: S.optional(S.String),
    testingInformation: S.optional(S.String),
    actionPlanTitle: S.optional(S.String),
    actionPlanInstructions: S.optional(S.String),
    controlMappingSources: ControlMappingSources,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/controls/{controlId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSettingsRequest extends S.Class<UpdateSettingsRequest>(
  "UpdateSettingsRequest",
)(
  {
    snsTopic: S.optional(S.String),
    defaultAssessmentReportsDestination: S.optional(
      AssessmentReportsDestination,
    ),
    defaultProcessOwners: S.optional(Roles),
    kmsKey: S.optional(S.String),
    evidenceFinderEnabled: S.optional(S.Boolean),
    deregistrationPolicy: S.optional(DeregistrationPolicy),
    defaultExportDestination: S.optional(DefaultExportDestination),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidateAssessmentReportIntegrityResponse extends S.Class<ValidateAssessmentReportIntegrityResponse>(
  "ValidateAssessmentReportIntegrityResponse",
)({
  signatureValid: S.optional(S.Boolean),
  signatureAlgorithm: S.optional(S.String),
  signatureDateTime: S.optional(S.String),
  signatureKeyId: S.optional(S.String),
  validationErrors: S.optional(ValidationErrors),
}) {}
export class BatchDeleteDelegationByAssessmentError extends S.Class<BatchDeleteDelegationByAssessmentError>(
  "BatchDeleteDelegationByAssessmentError",
)({
  delegationId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchDeleteDelegationByAssessmentErrors = S.Array(
  BatchDeleteDelegationByAssessmentError,
);
export class CreateAssessmentFrameworkControlSet extends S.Class<CreateAssessmentFrameworkControlSet>(
  "CreateAssessmentFrameworkControlSet",
)({
  name: S.String,
  controls: S.optional(CreateAssessmentFrameworkControls),
}) {}
export const CreateAssessmentFrameworkControlSets = S.Array(
  CreateAssessmentFrameworkControlSet,
);
export class AssessmentReport extends S.Class<AssessmentReport>(
  "AssessmentReport",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  assessmentId: S.optional(S.String),
  assessmentName: S.optional(S.String),
  author: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateControlMappingSource extends S.Class<CreateControlMappingSource>(
  "CreateControlMappingSource",
)({
  sourceName: S.optional(S.String),
  sourceDescription: S.optional(S.String),
  sourceSetUpOption: S.optional(S.String),
  sourceType: S.optional(S.String),
  sourceKeyword: S.optional(SourceKeyword),
  sourceFrequency: S.optional(S.String),
  troubleshootingText: S.optional(S.String),
}) {}
export const CreateControlMappingSources = S.Array(CreateControlMappingSource);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class URL extends S.Class<URL>("URL")({
  hyperlinkName: S.optional(S.String),
  link: S.optional(S.String),
}) {}
export class ChangeLog extends S.Class<ChangeLog>("ChangeLog")({
  objectType: S.optional(S.String),
  objectName: S.optional(S.String),
  action: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
}) {}
export const ChangeLogs = S.Array(ChangeLog);
export class Control extends S.Class<Control>("Control")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  testingInformation: S.optional(S.String),
  actionPlanTitle: S.optional(S.String),
  actionPlanInstructions: S.optional(S.String),
  controlSources: S.optional(S.String),
  controlMappingSources: S.optional(ControlMappingSources),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
  tags: S.optional(TagMap),
  state: S.optional(S.String),
}) {}
export class DelegationMetadata extends S.Class<DelegationMetadata>(
  "DelegationMetadata",
)({
  id: S.optional(S.String),
  assessmentName: S.optional(S.String),
  assessmentId: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  controlSetName: S.optional(S.String),
}) {}
export const DelegationMetadataList = S.Array(DelegationMetadata);
export class InsightsByAssessment extends S.Class<InsightsByAssessment>(
  "InsightsByAssessment",
)({
  noncompliantEvidenceCount: S.optional(S.Number),
  compliantEvidenceCount: S.optional(S.Number),
  inconclusiveEvidenceCount: S.optional(S.Number),
  assessmentControlsCountByNoncompliantEvidence: S.optional(S.Number),
  totalAssessmentControlsCount: S.optional(S.Number),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AssessmentFrameworkMetadata extends S.Class<AssessmentFrameworkMetadata>(
  "AssessmentFrameworkMetadata",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  logo: S.optional(S.String),
  complianceType: S.optional(S.String),
  controlsCount: S.optional(S.Number),
  controlSetsCount: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FrameworkMetadataList = S.Array(AssessmentFrameworkMetadata);
export const AssessmentFrameworkShareRequestList = S.Array(
  AssessmentFrameworkShareRequest,
);
export class AssessmentReportMetadata extends S.Class<AssessmentReportMetadata>(
  "AssessmentReportMetadata",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  assessmentId: S.optional(S.String),
  assessmentName: S.optional(S.String),
  author: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AssessmentReportsMetadata = S.Array(AssessmentReportMetadata);
export class ControlInsightsMetadataItem extends S.Class<ControlInsightsMetadataItem>(
  "ControlInsightsMetadataItem",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  evidenceInsights: S.optional(EvidenceInsights),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ControlInsightsMetadata = S.Array(ControlInsightsMetadataItem);
export class ControlMetadata extends S.Class<ControlMetadata>(
  "ControlMetadata",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  controlSources: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ControlMetadataList = S.Array(ControlMetadata);
export class Notification extends S.Class<Notification>("Notification")({
  id: S.optional(S.String),
  assessmentId: S.optional(S.String),
  assessmentName: S.optional(S.String),
  controlSetId: S.optional(S.String),
  controlSetName: S.optional(S.String),
  description: S.optional(S.String),
  eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  source: S.optional(S.String),
}) {}
export const Notifications = S.Array(Notification);
export const Controls = S.Array(Control);
export class BatchAssociateAssessmentReportEvidenceResponse extends S.Class<BatchAssociateAssessmentReportEvidenceResponse>(
  "BatchAssociateAssessmentReportEvidenceResponse",
)({
  evidenceIds: S.optional(EvidenceIds),
  errors: S.optional(AssessmentReportEvidenceErrors),
}) {}
export class BatchDeleteDelegationByAssessmentResponse extends S.Class<BatchDeleteDelegationByAssessmentResponse>(
  "BatchDeleteDelegationByAssessmentResponse",
)({ errors: S.optional(BatchDeleteDelegationByAssessmentErrors) }) {}
export class CreateAssessmentRequest extends S.Class<CreateAssessmentRequest>(
  "CreateAssessmentRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    assessmentReportsDestination: AssessmentReportsDestination,
    scope: Scope,
    roles: Roles,
    frameworkId: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assessments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssessmentFrameworkRequest extends S.Class<CreateAssessmentFrameworkRequest>(
  "CreateAssessmentFrameworkRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    complianceType: S.optional(S.String),
    controlSets: CreateAssessmentFrameworkControlSets,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/assessmentFrameworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAssessmentReportResponse extends S.Class<CreateAssessmentReportResponse>(
  "CreateAssessmentReportResponse",
)({ assessmentReport: S.optional(AssessmentReport) }) {}
export class CreateControlRequest extends S.Class<CreateControlRequest>(
  "CreateControlRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    testingInformation: S.optional(S.String),
    actionPlanTitle: S.optional(S.String),
    actionPlanInstructions: S.optional(S.String),
    controlMappingSources: CreateControlMappingSources,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/controls" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssessmentReportUrlResponse extends S.Class<GetAssessmentReportUrlResponse>(
  "GetAssessmentReportUrlResponse",
)({ preSignedUrl: S.optional(URL) }) {}
export class GetChangeLogsResponse extends S.Class<GetChangeLogsResponse>(
  "GetChangeLogsResponse",
)({ changeLogs: S.optional(ChangeLogs), nextToken: S.optional(S.String) }) {}
export class GetControlResponse extends S.Class<GetControlResponse>(
  "GetControlResponse",
)({ control: S.optional(Control) }) {}
export class GetDelegationsResponse extends S.Class<GetDelegationsResponse>(
  "GetDelegationsResponse",
)({
  delegations: S.optional(DelegationMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class GetEvidenceFolderResponse extends S.Class<GetEvidenceFolderResponse>(
  "GetEvidenceFolderResponse",
)({ evidenceFolder: S.optional(AssessmentEvidenceFolder) }) {}
export class GetInsightsByAssessmentResponse extends S.Class<GetInsightsByAssessmentResponse>(
  "GetInsightsByAssessmentResponse",
)({ insights: S.optional(InsightsByAssessment) }) {}
export class ListAssessmentFrameworksResponse extends S.Class<ListAssessmentFrameworksResponse>(
  "ListAssessmentFrameworksResponse",
)({
  frameworkMetadataList: S.optional(FrameworkMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListAssessmentFrameworkShareRequestsResponse extends S.Class<ListAssessmentFrameworkShareRequestsResponse>(
  "ListAssessmentFrameworkShareRequestsResponse",
)({
  assessmentFrameworkShareRequests: S.optional(
    AssessmentFrameworkShareRequestList,
  ),
  nextToken: S.optional(S.String),
}) {}
export class ListAssessmentReportsResponse extends S.Class<ListAssessmentReportsResponse>(
  "ListAssessmentReportsResponse",
)({
  assessmentReports: S.optional(AssessmentReportsMetadata),
  nextToken: S.optional(S.String),
}) {}
export class ListControlDomainInsightsResponse extends S.Class<ListControlDomainInsightsResponse>(
  "ListControlDomainInsightsResponse",
)({
  controlDomainInsights: S.optional(ControlDomainInsightsList),
  nextToken: S.optional(S.String),
}) {}
export class ListControlInsightsByControlDomainResponse extends S.Class<ListControlInsightsByControlDomainResponse>(
  "ListControlInsightsByControlDomainResponse",
)({
  controlInsightsMetadata: S.optional(ControlInsightsMetadata),
  nextToken: S.optional(S.String),
}) {}
export class ListControlsResponse extends S.Class<ListControlsResponse>(
  "ListControlsResponse",
)({
  controlMetadataList: S.optional(ControlMetadataList),
  nextToken: S.optional(S.String),
}) {}
export class ListNotificationsResponse extends S.Class<ListNotificationsResponse>(
  "ListNotificationsResponse",
)({
  notifications: S.optional(Notifications),
  nextToken: S.optional(S.String),
}) {}
export class UpdateAssessmentControlSetStatusResponse extends S.Class<UpdateAssessmentControlSetStatusResponse>(
  "UpdateAssessmentControlSetStatusResponse",
)({ controlSet: S.optional(AssessmentControlSet) }) {}
export class ControlSet extends S.Class<ControlSet>("ControlSet")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  controls: S.optional(Controls),
}) {}
export const ControlSets = S.Array(ControlSet);
export class Framework extends S.Class<Framework>("Framework")({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  complianceType: S.optional(S.String),
  description: S.optional(S.String),
  logo: S.optional(S.String),
  controlSources: S.optional(S.String),
  controlSets: S.optional(ControlSets),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdBy: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class UpdateAssessmentFrameworkResponse extends S.Class<UpdateAssessmentFrameworkResponse>(
  "UpdateAssessmentFrameworkResponse",
)({ framework: S.optional(Framework) }) {}
export class UpdateControlResponse extends S.Class<UpdateControlResponse>(
  "UpdateControlResponse",
)({ control: S.optional(Control) }) {}
export class EvidenceFinderEnablement extends S.Class<EvidenceFinderEnablement>(
  "EvidenceFinderEnablement",
)({
  eventDataStoreArn: S.optional(S.String),
  enablementStatus: S.optional(S.String),
  backfillStatus: S.optional(S.String),
  error: S.optional(S.String),
}) {}
export class Settings extends S.Class<Settings>("Settings")({
  isAwsOrgEnabled: S.optional(S.Boolean),
  snsTopic: S.optional(S.String),
  defaultAssessmentReportsDestination: S.optional(AssessmentReportsDestination),
  defaultProcessOwners: S.optional(Roles),
  kmsKey: S.optional(S.String),
  evidenceFinderEnablement: S.optional(EvidenceFinderEnablement),
  deregistrationPolicy: S.optional(DeregistrationPolicy),
  defaultExportDestination: S.optional(DefaultExportDestination),
}) {}
export class UpdateSettingsResponse extends S.Class<UpdateSettingsResponse>(
  "UpdateSettingsResponse",
)({ settings: S.optional(Settings) }) {}
export class BatchCreateDelegationByAssessmentError extends S.Class<BatchCreateDelegationByAssessmentError>(
  "BatchCreateDelegationByAssessmentError",
)({
  createDelegationRequest: S.optional(CreateDelegationRequest),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchCreateDelegationByAssessmentErrors = S.Array(
  BatchCreateDelegationByAssessmentError,
);
export class BatchImportEvidenceToAssessmentControlError extends S.Class<BatchImportEvidenceToAssessmentControlError>(
  "BatchImportEvidenceToAssessmentControlError",
)({
  manualEvidence: S.optional(ManualEvidence),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchImportEvidenceToAssessmentControlErrors = S.Array(
  BatchImportEvidenceToAssessmentControlError,
);
export class ControlInsightsMetadataByAssessmentItem extends S.Class<ControlInsightsMetadataByAssessmentItem>(
  "ControlInsightsMetadataByAssessmentItem",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  evidenceInsights: S.optional(EvidenceInsights),
  controlSetName: S.optional(S.String),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ControlInsightsMetadataByAssessment = S.Array(
  ControlInsightsMetadataByAssessmentItem,
);
export class AssessmentMetadataItem extends S.Class<AssessmentMetadataItem>(
  "AssessmentMetadataItem",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  complianceType: S.optional(S.String),
  status: S.optional(S.String),
  roles: S.optional(Roles),
  delegations: S.optional(Delegations),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ListAssessmentMetadata = S.Array(AssessmentMetadataItem);
export class BatchCreateDelegationByAssessmentResponse extends S.Class<BatchCreateDelegationByAssessmentResponse>(
  "BatchCreateDelegationByAssessmentResponse",
)({
  delegations: S.optional(Delegations),
  errors: S.optional(BatchCreateDelegationByAssessmentErrors),
}) {}
export class BatchImportEvidenceToAssessmentControlResponse extends S.Class<BatchImportEvidenceToAssessmentControlResponse>(
  "BatchImportEvidenceToAssessmentControlResponse",
)({ errors: S.optional(BatchImportEvidenceToAssessmentControlErrors) }) {}
export class CreateAssessmentResponse extends S.Class<CreateAssessmentResponse>(
  "CreateAssessmentResponse",
)({ assessment: S.optional(Assessment) }) {}
export class CreateAssessmentFrameworkResponse extends S.Class<CreateAssessmentFrameworkResponse>(
  "CreateAssessmentFrameworkResponse",
)({ framework: S.optional(Framework) }) {}
export class CreateControlResponse extends S.Class<CreateControlResponse>(
  "CreateControlResponse",
)({ control: S.optional(Control) }) {}
export class GetAssessmentFrameworkResponse extends S.Class<GetAssessmentFrameworkResponse>(
  "GetAssessmentFrameworkResponse",
)({ framework: S.optional(Framework) }) {}
export class GetEvidenceResponse extends S.Class<GetEvidenceResponse>(
  "GetEvidenceResponse",
)({ evidence: S.optional(Evidence) }) {}
export class GetSettingsResponse extends S.Class<GetSettingsResponse>(
  "GetSettingsResponse",
)({ settings: S.optional(Settings) }) {}
export class ListAssessmentControlInsightsByControlDomainResponse extends S.Class<ListAssessmentControlInsightsByControlDomainResponse>(
  "ListAssessmentControlInsightsByControlDomainResponse",
)({
  controlInsightsByAssessment: S.optional(ControlInsightsMetadataByAssessment),
  nextToken: S.optional(S.String),
}) {}
export class ListAssessmentsResponse extends S.Class<ListAssessmentsResponse>(
  "ListAssessmentsResponse",
)({
  assessmentMetadata: S.optional(ListAssessmentMetadata),
  nextToken: S.optional(S.String),
}) {}
export class UpdateAssessmentControlResponse extends S.Class<UpdateAssessmentControlResponse>(
  "UpdateAssessmentControlResponse",
)({ control: S.optional(AssessmentControl) }) {}
export class GetAssessmentResponse extends S.Class<GetAssessmentResponse>(
  "GetAssessmentResponse",
)({ assessment: S.optional(Assessment), userRole: S.optional(Role) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Deletes an assessment report in Audit Manager.
 *
 * When you run the `DeleteAssessmentReport` operation, Audit Manager
 * attempts to delete the following data:
 *
 * - The specified assessment report that’s stored in your S3 bucket
 *
 * - The associated metadata that’s stored in Audit Manager
 *
 * If Audit Manager can’t access the assessment report in your S3 bucket, the report
 * isn’t deleted. In this event, the `DeleteAssessmentReport` operation doesn’t
 * fail. Instead, it proceeds to delete the associated metadata only. You must then delete the
 * assessment report from the S3 bucket yourself.
 *
 * This scenario happens when Audit Manager receives a `403 (Forbidden)` or
 * `404 (Not Found)` error from Amazon S3. To avoid this, make sure that
 * your S3 bucket is available, and that you configured the correct permissions for Audit Manager to delete resources in your S3 bucket. For an example permissions policy that
 * you can use, see Assessment report destination permissions in the *Audit Manager User Guide*. For information about the issues that could cause a 403
 * (Forbidden) or `404 (Not Found`) error from Amazon S3, see
 * List of Error Codes in the Amazon Simple Storage Service API
 * Reference.
 */
export const deleteAssessmentReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAssessmentReportRequest,
    output: DeleteAssessmentReportResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a custom control in Audit Manager.
 *
 * When you invoke this operation, the custom control is deleted from any frameworks or
 * assessments that it’s currently part of. As a result, Audit Manager will stop
 * collecting evidence for that custom control in all of your assessments. This includes
 * assessments that you previously created before you deleted the custom control.
 */
export const deleteControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteControlRequest,
  output: DeleteControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregisters an account in Audit Manager.
 *
 * Before you deregister, you can use the UpdateSettings API operation to set your preferred data retention policy. By
 * default, Audit Manager retains your data. If you want to delete your data, you can
 * use the `DeregistrationPolicy` attribute to request the deletion of your
 * data.
 *
 * For more information about data retention, see Data
 * Protection in the *Audit Manager User Guide*.
 */
export const deregisterAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterAccountRequest,
  output: DeregisterAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes the specified Amazon Web Services account as a delegated administrator for
 * Audit Manager.
 *
 * When you remove a delegated administrator from your Audit Manager settings, you
 * continue to have access to the evidence that you previously collected under that account.
 * This is also the case when you deregister a delegated administrator from Organizations. However, Audit Manager stops collecting and attaching evidence to
 * that delegated administrator account moving forward.
 *
 * Keep in mind the following cleanup task if you use evidence finder:
 *
 * Before you use your management account to remove a delegated administrator, make sure
 * that the current delegated administrator account signs in to Audit Manager and
 * disables evidence finder first. Disabling evidence finder automatically deletes the
 * event data store that was created in their account when they enabled evidence finder. If
 * this task isn’t completed, the event data store remains in their account. In this case,
 * we recommend that the original delegated administrator goes to CloudTrail Lake
 * and manually deletes the
 * event data store.
 *
 * This cleanup task is necessary to ensure that you don't end up with multiple event
 * data stores. Audit Manager ignores an unused event data store after you remove or
 * change a delegated administrator account. However, the unused event data store continues
 * to incur storage costs from CloudTrail Lake if you don't delete it.
 *
 * When you deregister a delegated administrator account for Audit Manager, the data
 * for that account isn’t deleted. If you want to delete resource data for a delegated
 * administrator account, you must perform that task separately before you deregister the
 * account. Either, you can do this in the Audit Manager console. Or, you can use one of
 * the delete API operations that are provided by Audit Manager.
 *
 * To delete your Audit Manager resource data, see the following instructions:
 *
 * - DeleteAssessment (see also: Deleting an
 * assessment in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentFramework (see also: Deleting a
 * custom framework in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentFrameworkShare (see also: Deleting a share request in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentReport (see also: Deleting an assessment report in the Audit Manager User
 * Guide)
 *
 * - DeleteControl (see also: Deleting a custom
 * control in the Audit Manager User
 * Guide)
 *
 * At this time, Audit Manager doesn't provide an option to delete evidence for a
 * specific delegated administrator. Instead, when your management account deregisters Audit Manager, we perform a cleanup for the current delegated administrator account at the
 * time of deregistration.
 */
export const deregisterOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterOrganizationAdminAccountRequest,
    output: DeregisterOrganizationAdminAccountResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Disassociates an evidence folder from the specified assessment report in Audit Manager.
 */
export const disassociateAssessmentReportEvidenceFolder =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateAssessmentReportEvidenceFolderRequest,
    output: DisassociateAssessmentReportEvidenceFolderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets the registration status of an account in Audit Manager.
 */
export const getAccountStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountStatusRequest,
  output: GetAccountStatusResponse,
  errors: [InternalServerException],
}));
/**
 * Gets the name of the delegated Amazon Web Services administrator account for a specified
 * organization.
 */
export const getOrganizationAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOrganizationAdminAccountRequest,
    output: GetOrganizationAdminAccountResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Tags the specified resource in Audit Manager.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource in Audit Manager.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates an evidence folder to an assessment report in an Audit Manager
 * assessment.
 */
export const associateAssessmentReportEvidenceFolder =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateAssessmentReportEvidenceFolderRequest,
    output: AssociateAssessmentReportEvidenceFolderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a list of evidence from an assessment report in Audit Manager.
 */
export const batchDisassociateAssessmentReportEvidence =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateAssessmentReportEvidenceRequest,
    output: BatchDisassociateAssessmentReportEvidenceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes an assessment in Audit Manager.
 */
export const deleteAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentRequest,
  output: DeleteAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom framework in Audit Manager.
 */
export const deleteAssessmentFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAssessmentFrameworkRequest,
    output: DeleteAssessmentFrameworkResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets all evidence from a specified evidence folder in Audit Manager.
 */
export const getEvidenceByEvidenceFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEvidenceByEvidenceFolderRequest,
    output: GetEvidenceByEvidenceFolderResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the evidence folders from a specified assessment in Audit Manager.
 */
export const getEvidenceFoldersByAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEvidenceFoldersByAssessmentRequest,
    output: GetEvidenceFoldersByAssessmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets a list of evidence folders that are associated with a specified control in an
 * Audit Manager assessment.
 */
export const getEvidenceFoldersByAssessmentControl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEvidenceFoldersByAssessmentControlRequest,
    output: GetEvidenceFoldersByAssessmentControlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets the latest analytics data for all your current active assessments.
 */
export const getInsights = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightsRequest,
  output: GetInsightsResponse,
  errors: [AccessDeniedException, InternalServerException],
}));
/**
 * Gets a list of the Amazon Web Services services from which Audit Manager can collect
 * evidence.
 *
 * Audit Manager defines which Amazon Web Services services are in scope for an
 * assessment. Audit Manager infers this scope by examining the assessment’s controls and
 * their data sources, and then mapping this information to one or more of the corresponding
 * Amazon Web Services services that are in this list.
 *
 * For information about why it's no longer possible to specify services in scope manually, see
 * I can't edit the services in scope for my assessment in
 * the *Troubleshooting* section of the Audit Manager user
 * guide.
 */
export const getServicesInScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServicesInScopeRequest,
  output: GetServicesInScopeResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Lists analytics data for control domains within a specified active assessment.
 *
 * Audit Manager supports the control domains that are provided by Amazon Web Services
 * Control Catalog. For information about how to find a list of available control domains, see
 *
 * `ListDomains`
 * in the Amazon Web Services Control
 * Catalog API Reference.
 *
 * A control domain is listed only if at least one of the controls within that domain
 * collected evidence on the `lastUpdated` date of
 * `controlDomainInsights`. If this condition isn’t met, no data is listed
 * for that domain.
 */
export const listControlDomainInsightsByAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListControlDomainInsightsByAssessmentRequest,
    output: ListControlDomainInsightsByAssessmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of keywords that are pre-mapped to the specified control data
 * source.
 */
export const listKeywordsForDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListKeywordsForDataSourceRequest,
    output: ListKeywordsForDataSourceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of tags for the specified resource in Audit Manager.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Enables Audit Manager for the specified Amazon Web Services account.
 */
export const registerAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAccountRequest,
  output: RegisterAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables an Amazon Web Services account within the organization as the delegated
 * administrator for Audit Manager.
 */
export const registerOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterOrganizationAdminAccountRequest,
    output: RegisterOrganizationAdminAccountResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a share request for a custom framework in Audit Manager.
 *
 * The share request specifies a recipient and notifies them that a custom framework is
 * available. Recipients have 120 days to accept or decline the request. If no action is
 * taken, the share request expires.
 *
 * When you create a share request, Audit Manager stores a snapshot of your custom
 * framework in the US East (N. Virginia) Amazon Web Services Region. Audit Manager also
 * stores a backup of the same snapshot in the US West (Oregon) Amazon Web Services Region.
 *
 * Audit Manager deletes the snapshot and the backup snapshot when one of the following
 * events occurs:
 *
 * - The sender revokes the share request.
 *
 * - The recipient declines the share request.
 *
 * - The recipient encounters an error and doesn't successfully accept the share
 * request.
 *
 * - The share request expires before the recipient responds to the request.
 *
 * When a sender resends a share request, the snapshot is replaced with an updated version that
 * corresponds with the latest version of the custom framework.
 *
 * When a recipient accepts a share request, the snapshot is replicated into their Amazon Web Services account under the Amazon Web Services Region that was specified in the share
 * request.
 *
 * When you invoke the `StartAssessmentFrameworkShare` API, you are about to
 * share a custom framework with another Amazon Web Services account. You may not share a
 * custom framework that is derived from a standard framework if the standard framework is
 * designated as not eligible for sharing by Amazon Web Services, unless you have obtained
 * permission to do so from the owner of the standard framework. To learn more about which
 * standard frameworks are eligible for sharing, see Framework sharing eligibility in the Audit Manager User
 * Guide.
 */
export const startAssessmentFrameworkShare =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartAssessmentFrameworkShareRequest,
    output: StartAssessmentFrameworkShareResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates a share request for a custom framework in Audit Manager.
 */
export const updateAssessmentFrameworkShare =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAssessmentFrameworkShareRequest,
    output: UpdateAssessmentFrameworkShareResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Updates the status of an assessment in Audit Manager.
 */
export const updateAssessmentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAssessmentStatusRequest,
    output: UpdateAssessmentStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Validates the integrity of an assessment report in Audit Manager.
 */
export const validateAssessmentReportIntegrity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateAssessmentReportIntegrityRequest,
    output: ValidateAssessmentReportIntegrityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Associates a list of evidence to an assessment report in an Audit Manager
 * assessment.
 */
export const batchAssociateAssessmentReportEvidence =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAssociateAssessmentReportEvidenceRequest,
    output: BatchAssociateAssessmentReportEvidenceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes a batch of delegations for an assessment in Audit Manager.
 */
export const batchDeleteDelegationByAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteDelegationByAssessmentRequest,
    output: BatchDeleteDelegationByAssessmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates an assessment report for the specified assessment.
 */
export const createAssessmentReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAssessmentReportRequest,
    output: CreateAssessmentReportResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a share request for a custom framework in Audit Manager.
 */
export const deleteAssessmentFrameworkShare =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAssessmentFrameworkShareRequest,
    output: DeleteAssessmentFrameworkShareResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Gets the URL of an assessment report in Audit Manager.
 */
export const getAssessmentReportUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssessmentReportUrlRequest,
    output: GetAssessmentReportUrlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of changelogs from Audit Manager.
 */
export const getChangeLogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChangeLogsRequest,
  output: GetChangeLogsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified control.
 */
export const getControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlRequest,
  output: GetControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a list of delegations from an audit owner to a delegate.
 */
export const getDelegations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDelegationsRequest,
  output: GetDelegationsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Creates a presigned Amazon S3 URL that can be used to upload a file as manual
 * evidence. For instructions on how to use this operation, see Upload a file from your browser in the Audit Manager User
 * Guide.
 *
 * The following restrictions apply to this operation:
 *
 * - Maximum size of an individual evidence file: 100 MB
 *
 * - Number of daily manual evidence uploads per control: 100
 *
 * - Supported file formats: See Supported file types for manual evidence in the *Audit Manager User Guide*
 *
 * For more information about Audit Manager service restrictions, see Quotas and
 * restrictions for Audit Manager.
 */
export const getEvidenceFileUploadUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEvidenceFileUploadUrlRequest,
    output: GetEvidenceFileUploadUrlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets an evidence folder from a specified assessment in Audit Manager.
 */
export const getEvidenceFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvidenceFolderRequest,
  output: GetEvidenceFolderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the latest analytics data for a specific active assessment.
 */
export const getInsightsByAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetInsightsByAssessmentRequest,
    output: GetInsightsByAssessmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of the frameworks that are available in the Audit Manager framework
 * library.
 */
export const listAssessmentFrameworks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssessmentFrameworksRequest,
    output: ListAssessmentFrameworksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of sent or received share requests for custom frameworks in Audit Manager.
 */
export const listAssessmentFrameworkShareRequests =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssessmentFrameworkShareRequestsRequest,
    output: ListAssessmentFrameworkShareRequestsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of assessment reports created in Audit Manager.
 */
export const listAssessmentReports = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssessmentReportsRequest,
    output: ListAssessmentReportsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the latest analytics data for control domains across all of your active
 * assessments.
 *
 * Audit Manager supports the control domains that are provided by Amazon Web Services
 * Control Catalog. For information about how to find a list of available control domains, see
 *
 * `ListDomains`
 * in the Amazon Web Services Control
 * Catalog API Reference.
 *
 * A control domain is listed only if at least one of the controls within that domain
 * collected evidence on the `lastUpdated` date of
 * `controlDomainInsights`. If this condition isn’t met, no data is listed
 * for that control domain.
 */
export const listControlDomainInsights = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListControlDomainInsightsRequest,
    output: ListControlDomainInsightsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the latest analytics data for controls within a specific control domain across all
 * active assessments.
 *
 * Control insights are listed only if the control belongs to the control domain that
 * was specified and the control collected evidence on the `lastUpdated` date of
 * `controlInsightsMetadata`. If neither of these conditions are met, no data
 * is listed for that control.
 */
export const listControlInsightsByControlDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListControlInsightsByControlDomainRequest,
    output: ListControlInsightsByControlDomainResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of controls from Audit Manager.
 */
export const listControls = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListControlsRequest,
  output: ListControlsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Returns a list of all Audit Manager notifications.
 */
export const listNotifications = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNotificationsRequest,
  output: ListNotificationsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Edits an Audit Manager assessment.
 */
export const updateAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentRequest,
  output: UpdateAssessmentResponse,
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
 * Updates the status of a control set in an Audit Manager assessment.
 */
export const updateAssessmentControlSetStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAssessmentControlSetStatusRequest,
    output: UpdateAssessmentControlSetStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates a custom framework in Audit Manager.
 */
export const updateAssessmentFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAssessmentFrameworkRequest,
    output: UpdateAssessmentFrameworkResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a custom control in Audit Manager.
 */
export const updateControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateControlRequest,
  output: UpdateControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates Audit Manager settings for the current account.
 */
export const updateSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSettingsRequest,
  output: UpdateSettingsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Creates a batch of delegations for an assessment in Audit Manager.
 */
export const batchCreateDelegationByAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateDelegationByAssessmentRequest,
    output: BatchCreateDelegationByAssessmentResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Adds one or more pieces of evidence to a control in an Audit Manager assessment.
 *
 * You can import manual evidence from any S3 bucket by specifying the S3 URI of the
 * object. You can also upload a file from your browser, or enter plain text in response to a
 * risk assessment question.
 *
 * The following restrictions apply to this action:
 *
 * - `manualEvidence` can be only one of the following:
 * `evidenceFileName`, `s3ResourcePath`, or
 * `textResponse`
 *
 * - Maximum size of an individual evidence file: 100 MB
 *
 * - Number of daily manual evidence uploads per control: 100
 *
 * - Supported file formats: See Supported file types for manual evidence in the *Audit Manager User Guide*
 *
 * For more information about Audit Manager service restrictions, see Quotas and
 * restrictions for Audit Manager.
 */
export const batchImportEvidenceToAssessmentControl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchImportEvidenceToAssessmentControlRequest,
    output: BatchImportEvidenceToAssessmentControlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates an assessment in Audit Manager.
 */
export const createAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentRequest,
  output: CreateAssessmentResponse,
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
 * Creates a custom framework in Audit Manager.
 */
export const createAssessmentFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAssessmentFrameworkRequest,
    output: CreateAssessmentFrameworkResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new custom control in Audit Manager.
 */
export const createControl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateControlRequest,
  output: CreateControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified framework.
 */
export const getAssessmentFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAssessmentFrameworkRequest,
    output: GetAssessmentFrameworkResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a specified evidence item.
 */
export const getEvidence = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvidenceRequest,
  output: GetEvidenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the settings for a specified Amazon Web Services account.
 */
export const getSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSettingsRequest,
  output: GetSettingsResponse,
  errors: [AccessDeniedException, InternalServerException],
}));
/**
 * Lists the latest analytics data for controls within a specific control domain and a
 * specific active assessment.
 *
 * Control insights are listed only if the control belongs to the control domain and
 * assessment that was specified. Moreover, the control must have collected evidence on the
 * `lastUpdated` date of `controlInsightsByAssessment`. If neither
 * of these conditions are met, no data is listed for that control.
 */
export const listAssessmentControlInsightsByControlDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssessmentControlInsightsByControlDomainRequest,
    output: ListAssessmentControlInsightsByControlDomainResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of current and past assessments from Audit Manager.
 */
export const listAssessments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssessmentsRequest,
  output: ListAssessmentsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Updates a control within an assessment in Audit Manager.
 */
export const updateAssessmentControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAssessmentControlRequest,
    output: UpdateAssessmentControlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a specified assessment.
 */
export const getAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentRequest,
  output: GetAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

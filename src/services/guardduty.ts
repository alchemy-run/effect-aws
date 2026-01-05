import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "GuardDuty",
  serviceShapeName: "GuardDutyAPIService",
});
const auth = T.AwsAuthSigv4({ name: "guardduty" });
const ver = T.ServiceVersion("2017-11-28");
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
                        url: "https://guardduty-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://guardduty.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://guardduty-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://guardduty.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://guardduty.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetInvitationsCountRequest extends S.Class<GetInvitationsCountRequest>(
  "GetInvitationsCountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/invitation/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetOrganizationStatisticsRequest extends S.Class<GetOrganizationStatisticsRequest>(
  "GetOrganizationStatisticsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FindingIds = S.Array(S.String);
export const FindingTypes = S.Array(S.String);
export const AccountIds = S.Array(S.String);
export const CoverageStatisticsTypeList = S.Array(S.String);
export const FindingStatisticTypes = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AcceptAdministratorInvitationRequest extends S.Class<AcceptAdministratorInvitationRequest>(
  "AcceptAdministratorInvitationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AdministratorId: S.String.pipe(T.JsonName("administratorId")),
    InvitationId: S.String.pipe(T.JsonName("invitationId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/administrator" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptAdministratorInvitationResponse extends S.Class<AcceptAdministratorInvitationResponse>(
  "AcceptAdministratorInvitationResponse",
)({}) {}
export class AcceptInvitationRequest extends S.Class<AcceptInvitationRequest>(
  "AcceptInvitationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MasterId: S.String.pipe(T.JsonName("masterId")),
    InvitationId: S.String.pipe(T.JsonName("invitationId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/master" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptInvitationResponse extends S.Class<AcceptInvitationResponse>(
  "AcceptInvitationResponse",
)({}) {}
export class ArchiveFindingsRequest extends S.Class<ArchiveFindingsRequest>(
  "ArchiveFindingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: FindingIds.pipe(T.JsonName("findingIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/archive" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ArchiveFindingsResponse extends S.Class<ArchiveFindingsResponse>(
  "ArchiveFindingsResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateIPSetRequest extends S.Class<CreateIPSetRequest>(
  "CreateIPSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Format: S.String.pipe(T.JsonName("format")),
    Location: S.String.pipe(T.JsonName("location")),
    Activate: S.Boolean.pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/ipset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSampleFindingsRequest extends S.Class<CreateSampleFindingsRequest>(
  "CreateSampleFindingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingTypes: S.optional(FindingTypes).pipe(T.JsonName("findingTypes")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSampleFindingsResponse extends S.Class<CreateSampleFindingsResponse>(
  "CreateSampleFindingsResponse",
)({}) {}
export class CreateThreatEntitySetRequest extends S.Class<CreateThreatEntitySetRequest>(
  "CreateThreatEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Format: S.String.pipe(T.JsonName("format")),
    Location: S.String.pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.Boolean.pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/threatentityset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThreatIntelSetRequest extends S.Class<CreateThreatIntelSetRequest>(
  "CreateThreatIntelSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Format: S.String.pipe(T.JsonName("format")),
    Location: S.String.pipe(T.JsonName("location")),
    Activate: S.Boolean.pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/threatintelset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTrustedEntitySetRequest extends S.Class<CreateTrustedEntitySetRequest>(
  "CreateTrustedEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Format: S.String.pipe(T.JsonName("format")),
    Location: S.String.pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.Boolean.pipe(T.JsonName("activate")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/trustedentityset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeclineInvitationsRequest extends S.Class<DeclineInvitationsRequest>(
  "DeclineInvitationsRequest",
)(
  { AccountIds: AccountIds.pipe(T.JsonName("accountIds")) },
  T.all(
    T.Http({ method: "POST", uri: "/invitation/decline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDetectorRequest extends S.Class<DeleteDetectorRequest>(
  "DeleteDetectorRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/detector/{DetectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDetectorResponse extends S.Class<DeleteDetectorResponse>(
  "DeleteDetectorResponse",
)({}) {}
export class DeleteFilterRequest extends S.Class<DeleteFilterRequest>(
  "DeleteFilterRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/detector/{DetectorId}/filter/{FilterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFilterResponse extends S.Class<DeleteFilterResponse>(
  "DeleteFilterResponse",
)({}) {}
export class DeleteInvitationsRequest extends S.Class<DeleteInvitationsRequest>(
  "DeleteInvitationsRequest",
)(
  { AccountIds: AccountIds.pipe(T.JsonName("accountIds")) },
  T.all(
    T.Http({ method: "POST", uri: "/invitation/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIPSetRequest extends S.Class<DeleteIPSetRequest>(
  "DeleteIPSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/detector/{DetectorId}/ipset/{IpSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIPSetResponse extends S.Class<DeleteIPSetResponse>(
  "DeleteIPSetResponse",
)({}) {}
export class DeleteMalwareProtectionPlanRequest extends S.Class<DeleteMalwareProtectionPlanRequest>(
  "DeleteMalwareProtectionPlanRequest",
)(
  {
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMalwareProtectionPlanResponse extends S.Class<DeleteMalwareProtectionPlanResponse>(
  "DeleteMalwareProtectionPlanResponse",
)({}) {}
export class DeleteMembersRequest extends S.Class<DeleteMembersRequest>(
  "DeleteMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePublishingDestinationRequest extends S.Class<DeletePublishingDestinationRequest>(
  "DeletePublishingDestinationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePublishingDestinationResponse extends S.Class<DeletePublishingDestinationResponse>(
  "DeletePublishingDestinationResponse",
)({}) {}
export class DeleteThreatEntitySetRequest extends S.Class<DeleteThreatEntitySetRequest>(
  "DeleteThreatEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThreatEntitySetResponse extends S.Class<DeleteThreatEntitySetResponse>(
  "DeleteThreatEntitySetResponse",
)({}) {}
export class DeleteThreatIntelSetRequest extends S.Class<DeleteThreatIntelSetRequest>(
  "DeleteThreatIntelSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThreatIntelSetResponse extends S.Class<DeleteThreatIntelSetResponse>(
  "DeleteThreatIntelSetResponse",
)({}) {}
export class DeleteTrustedEntitySetRequest extends S.Class<DeleteTrustedEntitySetRequest>(
  "DeleteTrustedEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrustedEntitySetResponse extends S.Class<DeleteTrustedEntitySetResponse>(
  "DeleteTrustedEntitySetResponse",
)({}) {}
export class DescribeOrganizationConfigurationRequest extends S.Class<DescribeOrganizationConfigurationRequest>(
  "DescribeOrganizationConfigurationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/admin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePublishingDestinationRequest extends S.Class<DescribePublishingDestinationRequest>(
  "DescribePublishingDestinationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableOrganizationAdminAccountRequest extends S.Class<DisableOrganizationAdminAccountRequest>(
  "DisableOrganizationAdminAccountRequest",
)(
  { AdminAccountId: S.String.pipe(T.JsonName("adminAccountId")) },
  T.all(
    T.Http({ method: "POST", uri: "/admin/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableOrganizationAdminAccountResponse extends S.Class<DisableOrganizationAdminAccountResponse>(
  "DisableOrganizationAdminAccountResponse",
)({}) {}
export class DisassociateFromAdministratorAccountRequest extends S.Class<DisassociateFromAdministratorAccountRequest>(
  "DisassociateFromAdministratorAccountRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/administrator/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromAdministratorAccountResponse extends S.Class<DisassociateFromAdministratorAccountResponse>(
  "DisassociateFromAdministratorAccountResponse",
)({}) {}
export class DisassociateFromMasterAccountRequest extends S.Class<DisassociateFromMasterAccountRequest>(
  "DisassociateFromMasterAccountRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/master/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromMasterAccountResponse extends S.Class<DisassociateFromMasterAccountResponse>(
  "DisassociateFromMasterAccountResponse",
)({}) {}
export class DisassociateMembersRequest extends S.Class<DisassociateMembersRequest>(
  "DisassociateMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/member/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableOrganizationAdminAccountRequest extends S.Class<EnableOrganizationAdminAccountRequest>(
  "EnableOrganizationAdminAccountRequest",
)(
  { AdminAccountId: S.String.pipe(T.JsonName("adminAccountId")) },
  T.all(
    T.Http({ method: "POST", uri: "/admin/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableOrganizationAdminAccountResponse extends S.Class<EnableOrganizationAdminAccountResponse>(
  "EnableOrganizationAdminAccountResponse",
)({}) {}
export class GetAdministratorAccountRequest extends S.Class<GetAdministratorAccountRequest>(
  "GetAdministratorAccountRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/administrator" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDetectorRequest extends S.Class<GetDetectorRequest>(
  "GetDetectorRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFilterRequest extends S.Class<GetFilterRequest>(
  "GetFilterRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/filter/{FilterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SortCriteria extends S.Class<SortCriteria>("SortCriteria")({
  AttributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  OrderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class GetFindingsRequest extends S.Class<GetFindingsRequest>(
  "GetFindingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: FindingIds.pipe(T.JsonName("findingIds")),
    SortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Eq = S.Array(S.String);
export const Neq = S.Array(S.String);
export const Equals = S.Array(S.String);
export const NotEquals = S.Array(S.String);
export const Matches = S.Array(S.String);
export const NotMatches = S.Array(S.String);
export class Condition extends S.Class<Condition>("Condition")({
  Eq: S.optional(Eq).pipe(T.JsonName("eq")),
  Neq: S.optional(Neq).pipe(T.JsonName("neq")),
  Gt: S.optional(S.Number).pipe(T.JsonName("gt")),
  Gte: S.optional(S.Number).pipe(T.JsonName("gte")),
  Lt: S.optional(S.Number).pipe(T.JsonName("lt")),
  Lte: S.optional(S.Number).pipe(T.JsonName("lte")),
  Equals: S.optional(Equals).pipe(T.JsonName("equals")),
  NotEquals: S.optional(NotEquals).pipe(T.JsonName("notEquals")),
  GreaterThan: S.optional(S.Number).pipe(T.JsonName("greaterThan")),
  GreaterThanOrEqual: S.optional(S.Number).pipe(
    T.JsonName("greaterThanOrEqual"),
  ),
  LessThan: S.optional(S.Number).pipe(T.JsonName("lessThan")),
  LessThanOrEqual: S.optional(S.Number).pipe(T.JsonName("lessThanOrEqual")),
  Matches: S.optional(Matches).pipe(T.JsonName("matches")),
  NotMatches: S.optional(NotMatches).pipe(T.JsonName("notMatches")),
}) {}
export const Criterion = S.Record({ key: S.String, value: Condition });
export class FindingCriteria extends S.Class<FindingCriteria>(
  "FindingCriteria",
)({ Criterion: S.optional(Criterion).pipe(T.JsonName("criterion")) }) {}
export class GetFindingsStatisticsRequest extends S.Class<GetFindingsStatisticsRequest>(
  "GetFindingsStatisticsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingStatisticTypes: S.optional(FindingStatisticTypes).pipe(
      T.JsonName("findingStatisticTypes"),
    ),
    FindingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
    GroupBy: S.optional(S.String).pipe(T.JsonName("groupBy")),
    OrderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/findings/statistics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvitationsCountResponse extends S.Class<GetInvitationsCountResponse>(
  "GetInvitationsCountResponse",
)({
  InvitationsCount: S.optional(S.Number).pipe(T.JsonName("invitationsCount")),
}) {}
export class GetIPSetRequest extends S.Class<GetIPSetRequest>(
  "GetIPSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/ipset/{IpSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMalwareProtectionPlanRequest extends S.Class<GetMalwareProtectionPlanRequest>(
  "GetMalwareProtectionPlanRequest",
)(
  {
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMalwareScanRequest extends S.Class<GetMalwareScanRequest>(
  "GetMalwareScanRequest",
)(
  { ScanId: S.String.pipe(T.HttpLabel("ScanId"), T.JsonName("scanId")) },
  T.all(
    T.Http({ method: "GET", uri: "/malware-scan/{ScanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMalwareScanSettingsRequest extends S.Class<GetMalwareScanSettingsRequest>(
  "GetMalwareScanSettingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/malware-scan-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMasterAccountRequest extends S.Class<GetMasterAccountRequest>(
  "GetMasterAccountRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/master" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemberDetectorsRequest extends S.Class<GetMemberDetectorsRequest>(
  "GetMemberDetectorsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/member/detector/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMembersRequest extends S.Class<GetMembersRequest>(
  "GetMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRemainingFreeTrialDaysRequest extends S.Class<GetRemainingFreeTrialDaysRequest>(
  "GetRemainingFreeTrialDaysRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/freeTrial/daysRemaining",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThreatEntitySetRequest extends S.Class<GetThreatEntitySetRequest>(
  "GetThreatEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetThreatIntelSetRequest extends S.Class<GetThreatIntelSetRequest>(
  "GetThreatIntelSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTrustedEntitySetRequest extends S.Class<GetTrustedEntitySetRequest>(
  "GetTrustedEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InviteMembersRequest extends S.Class<InviteMembersRequest>(
  "InviteMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
    DisableEmailNotification: S.optional(S.Boolean).pipe(
      T.JsonName("disableEmailNotification"),
    ),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/invite" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorsRequest extends S.Class<ListDetectorsRequest>(
  "ListDetectorsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFiltersRequest extends S.Class<ListFiltersRequest>(
  "ListFiltersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/filter" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFindingsRequest extends S.Class<ListFindingsRequest>(
  "ListFindingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
    SortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvitationsRequest extends S.Class<ListInvitationsRequest>(
  "ListInvitationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/invitation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIPSetsRequest extends S.Class<ListIPSetsRequest>(
  "ListIPSetsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/ipset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMalwareProtectionPlansRequest extends S.Class<ListMalwareProtectionPlansRequest>(
  "ListMalwareProtectionPlansRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/malware-protection-plan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembersRequest extends S.Class<ListMembersRequest>(
  "ListMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
    OnlyAssociated: S.optional(S.String).pipe(
      T.HttpQuery("onlyAssociated"),
      T.JsonName("onlyAssociated"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/member" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationAdminAccountsRequest extends S.Class<ListOrganizationAdminAccountsRequest>(
  "ListOrganizationAdminAccountsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(T.Http({ method: "GET", uri: "/admin" }), svc, auth, proto, ver, rules),
) {}
export class ListPublishingDestinationsRequest extends S.Class<ListPublishingDestinationsRequest>(
  "ListPublishingDestinationsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/detector/{DetectorId}/publishingDestination",
    }),
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
  {
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThreatEntitySetsRequest extends S.Class<ListThreatEntitySetsRequest>(
  "ListThreatEntitySetsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/threatentityset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThreatIntelSetsRequest extends S.Class<ListThreatIntelSetsRequest>(
  "ListThreatIntelSetsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/threatintelset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrustedEntitySetsRequest extends S.Class<ListTrustedEntitySetsRequest>(
  "ListTrustedEntitySetsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/detector/{DetectorId}/trustedentityset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMonitoringMembersRequest extends S.Class<StartMonitoringMembersRequest>(
  "StartMonitoringMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopMonitoringMembersRequest extends S.Class<StopMonitoringMembersRequest>(
  "StopMonitoringMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
    Tags: TagMap.pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class UnarchiveFindingsRequest extends S.Class<UnarchiveFindingsRequest>(
  "UnarchiveFindingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: FindingIds.pipe(T.JsonName("findingIds")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/findings/unarchive",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnarchiveFindingsResponse extends S.Class<UnarchiveFindingsResponse>(
  "UnarchiveFindingsResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(
      T.HttpLabel("ResourceArn"),
      T.JsonName("resourceArn"),
    ),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys"), T.JsonName("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class S3LogsConfiguration extends S.Class<S3LogsConfiguration>(
  "S3LogsConfiguration",
)({ Enable: S.Boolean.pipe(T.JsonName("enable")) }) {}
export class KubernetesAuditLogsConfiguration extends S.Class<KubernetesAuditLogsConfiguration>(
  "KubernetesAuditLogsConfiguration",
)({ Enable: S.Boolean.pipe(T.JsonName("enable")) }) {}
export class KubernetesConfiguration extends S.Class<KubernetesConfiguration>(
  "KubernetesConfiguration",
)({
  AuditLogs: KubernetesAuditLogsConfiguration.pipe(T.JsonName("auditLogs")),
}) {}
export class ScanEc2InstanceWithFindings extends S.Class<ScanEc2InstanceWithFindings>(
  "ScanEc2InstanceWithFindings",
)({ EbsVolumes: S.optional(S.Boolean).pipe(T.JsonName("ebsVolumes")) }) {}
export class MalwareProtectionConfiguration extends S.Class<MalwareProtectionConfiguration>(
  "MalwareProtectionConfiguration",
)({
  ScanEc2InstanceWithFindings: S.optional(ScanEc2InstanceWithFindings).pipe(
    T.JsonName("scanEc2InstanceWithFindings"),
  ),
}) {}
export class DataSourceConfigurations extends S.Class<DataSourceConfigurations>(
  "DataSourceConfigurations",
)({
  S3Logs: S.optional(S3LogsConfiguration).pipe(T.JsonName("s3Logs")),
  Kubernetes: S.optional(KubernetesConfiguration).pipe(
    T.JsonName("kubernetes"),
  ),
  MalwareProtection: S.optional(MalwareProtectionConfiguration).pipe(
    T.JsonName("malwareProtection"),
  ),
}) {}
export class DetectorAdditionalConfiguration extends S.Class<DetectorAdditionalConfiguration>(
  "DetectorAdditionalConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const DetectorAdditionalConfigurations = S.Array(
  DetectorAdditionalConfiguration,
);
export class DetectorFeatureConfiguration extends S.Class<DetectorFeatureConfiguration>(
  "DetectorFeatureConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  AdditionalConfiguration: S.optional(DetectorAdditionalConfigurations).pipe(
    T.JsonName("additionalConfiguration"),
  ),
}) {}
export const DetectorFeatureConfigurations = S.Array(
  DetectorFeatureConfiguration,
);
export class UpdateDetectorRequest extends S.Class<UpdateDetectorRequest>(
  "UpdateDetectorRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Enable: S.optional(S.Boolean).pipe(T.JsonName("enable")),
    FindingPublishingFrequency: S.optional(S.String).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    DataSources: S.optional(DataSourceConfigurations).pipe(
      T.JsonName("dataSources"),
    ),
    Features: S.optional(DetectorFeatureConfigurations).pipe(
      T.JsonName("features"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDetectorResponse extends S.Class<UpdateDetectorResponse>(
  "UpdateDetectorResponse",
)({}) {}
export class UpdateFilterRequest extends S.Class<UpdateFilterRequest>(
  "UpdateFilterRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterName: S.String.pipe(
      T.HttpLabel("FilterName"),
      T.JsonName("filterName"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Action: S.optional(S.String).pipe(T.JsonName("action")),
    Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
    FindingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/filter/{FilterName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFindingsFeedbackRequest extends S.Class<UpdateFindingsFeedbackRequest>(
  "UpdateFindingsFeedbackRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FindingIds: FindingIds.pipe(T.JsonName("findingIds")),
    Feedback: S.String.pipe(T.JsonName("feedback")),
    Comments: S.optional(S.String).pipe(T.JsonName("comments")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/findings/feedback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFindingsFeedbackResponse extends S.Class<UpdateFindingsFeedbackResponse>(
  "UpdateFindingsFeedbackResponse",
)({}) {}
export class UpdateIPSetRequest extends S.Class<UpdateIPSetRequest>(
  "UpdateIPSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    IpSetId: S.String.pipe(T.HttpLabel("IpSetId"), T.JsonName("ipSetId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/ipset/{IpSetId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIPSetResponse extends S.Class<UpdateIPSetResponse>(
  "UpdateIPSetResponse",
)({}) {}
export class DestinationProperties extends S.Class<DestinationProperties>(
  "DestinationProperties",
)({
  DestinationArn: S.optional(S.String).pipe(T.JsonName("destinationArn")),
  KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
}) {}
export class UpdatePublishingDestinationRequest extends S.Class<UpdatePublishingDestinationRequest>(
  "UpdatePublishingDestinationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationId: S.String.pipe(
      T.HttpLabel("DestinationId"),
      T.JsonName("destinationId"),
    ),
    DestinationProperties: S.optional(DestinationProperties).pipe(
      T.JsonName("destinationProperties"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/publishingDestination/{DestinationId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePublishingDestinationResponse extends S.Class<UpdatePublishingDestinationResponse>(
  "UpdatePublishingDestinationResponse",
)({}) {}
export class UpdateThreatEntitySetRequest extends S.Class<UpdateThreatEntitySetRequest>(
  "UpdateThreatEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatEntitySetId: S.String.pipe(
      T.HttpLabel("ThreatEntitySetId"),
      T.JsonName("threatEntitySetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/threatentityset/{ThreatEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThreatEntitySetResponse extends S.Class<UpdateThreatEntitySetResponse>(
  "UpdateThreatEntitySetResponse",
)({}) {}
export class UpdateThreatIntelSetRequest extends S.Class<UpdateThreatIntelSetRequest>(
  "UpdateThreatIntelSetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ThreatIntelSetId: S.String.pipe(
      T.HttpLabel("ThreatIntelSetId"),
      T.JsonName("threatIntelSetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/threatintelset/{ThreatIntelSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThreatIntelSetResponse extends S.Class<UpdateThreatIntelSetResponse>(
  "UpdateThreatIntelSetResponse",
)({}) {}
export class UpdateTrustedEntitySetRequest extends S.Class<UpdateTrustedEntitySetRequest>(
  "UpdateTrustedEntitySetRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    TrustedEntitySetId: S.String.pipe(
      T.HttpLabel("TrustedEntitySetId"),
      T.JsonName("trustedEntitySetId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Location: S.optional(S.String).pipe(T.JsonName("location")),
    ExpectedBucketOwner: S.optional(S.String).pipe(
      T.JsonName("expectedBucketOwner"),
    ),
    Activate: S.optional(S.Boolean).pipe(T.JsonName("activate")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/trustedentityset/{TrustedEntitySetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTrustedEntitySetResponse extends S.Class<UpdateTrustedEntitySetResponse>(
  "UpdateTrustedEntitySetResponse",
)({}) {}
export const DataSourceList = S.Array(S.String);
export const ResourceList = S.Array(S.String);
export const UsageFeatureList = S.Array(S.String);
export class AccountDetail extends S.Class<AccountDetail>("AccountDetail")({
  AccountId: S.String.pipe(T.JsonName("accountId")),
  Email: S.String.pipe(T.JsonName("email")),
}) {}
export const AccountDetails = S.Array(AccountDetail);
export class UsageCriteria extends S.Class<UsageCriteria>("UsageCriteria")({
  AccountIds: S.optional(AccountIds).pipe(T.JsonName("accountIds")),
  DataSources: S.optional(DataSourceList).pipe(T.JsonName("dataSources")),
  Resources: S.optional(ResourceList).pipe(T.JsonName("resources")),
  Features: S.optional(UsageFeatureList).pipe(T.JsonName("features")),
}) {}
export class CoverageSortCriteria extends S.Class<CoverageSortCriteria>(
  "CoverageSortCriteria",
)({
  AttributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  OrderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export const DetectorIds = S.Array(S.String);
export const FilterNames = S.Array(S.String);
export const IpSetIds = S.Array(S.String);
export const ThreatEntitySetIds = S.Array(S.String);
export const ThreatIntelSetIds = S.Array(S.String);
export const TrustedEntitySetIds = S.Array(S.String);
export class S3ObjectForSendObjectMalwareScan extends S.Class<S3ObjectForSendObjectMalwareScan>(
  "S3ObjectForSendObjectMalwareScan",
)({
  Bucket: S.optional(S.String).pipe(T.JsonName("bucket")),
  Key: S.optional(S.String).pipe(T.JsonName("key")),
  VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
}) {}
export const MalwareProtectionPlanObjectPrefixesList = S.Array(S.String);
export class CreateIPSetResponse extends S.Class<CreateIPSetResponse>(
  "CreateIPSetResponse",
)({ IpSetId: S.String.pipe(T.JsonName("ipSetId")) }) {}
export class CreateMembersRequest extends S.Class<CreateMembersRequest>(
  "CreateMembersRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountDetails: AccountDetails.pipe(T.JsonName("accountDetails")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/member" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePublishingDestinationRequest extends S.Class<CreatePublishingDestinationRequest>(
  "CreatePublishingDestinationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    DestinationType: S.String.pipe(T.JsonName("destinationType")),
    DestinationProperties: DestinationProperties.pipe(
      T.JsonName("destinationProperties"),
    ),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/publishingDestination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThreatEntitySetResponse extends S.Class<CreateThreatEntitySetResponse>(
  "CreateThreatEntitySetResponse",
)({ ThreatEntitySetId: S.String.pipe(T.JsonName("threatEntitySetId")) }) {}
export class CreateThreatIntelSetResponse extends S.Class<CreateThreatIntelSetResponse>(
  "CreateThreatIntelSetResponse",
)({ ThreatIntelSetId: S.String.pipe(T.JsonName("threatIntelSetId")) }) {}
export class CreateTrustedEntitySetResponse extends S.Class<CreateTrustedEntitySetResponse>(
  "CreateTrustedEntitySetResponse",
)({ TrustedEntitySetId: S.String.pipe(T.JsonName("trustedEntitySetId")) }) {}
export class UnprocessedAccount extends S.Class<UnprocessedAccount>(
  "UnprocessedAccount",
)({
  AccountId: S.String.pipe(T.JsonName("accountId")),
  Result: S.String.pipe(T.JsonName("result")),
}) {}
export const UnprocessedAccounts = S.Array(UnprocessedAccount);
export class DeleteInvitationsResponse extends S.Class<DeleteInvitationsResponse>(
  "DeleteInvitationsResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class DeleteMembersResponse extends S.Class<DeleteMembersResponse>(
  "DeleteMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class DescribePublishingDestinationResponse extends S.Class<DescribePublishingDestinationResponse>(
  "DescribePublishingDestinationResponse",
)({
  DestinationId: S.String.pipe(T.JsonName("destinationId")),
  DestinationType: S.String.pipe(T.JsonName("destinationType")),
  Status: S.String.pipe(T.JsonName("status")),
  PublishingFailureStartTimestamp: S.Number.pipe(
    T.JsonName("publishingFailureStartTimestamp"),
  ),
  DestinationProperties: DestinationProperties.pipe(
    T.JsonName("destinationProperties"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class DisassociateMembersResponse extends S.Class<DisassociateMembersResponse>(
  "DisassociateMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class GetFilterResponse extends S.Class<GetFilterResponse>(
  "GetFilterResponse",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Action: S.String.pipe(T.JsonName("action")),
  Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
  FindingCriteria: FindingCriteria.pipe(T.JsonName("findingCriteria")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetIPSetResponse extends S.Class<GetIPSetResponse>(
  "GetIPSetResponse",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Format: S.String.pipe(T.JsonName("format")),
  Location: S.String.pipe(T.JsonName("location")),
  Status: S.String.pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  ExpectedBucketOwner: S.optional(S.String).pipe(
    T.JsonName("expectedBucketOwner"),
  ),
}) {}
export class ScanConditionPair extends S.Class<ScanConditionPair>(
  "ScanConditionPair",
)({
  Key: S.String.pipe(T.JsonName("key")),
  Value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const MapEquals = S.Array(ScanConditionPair);
export class ScanCondition extends S.Class<ScanCondition>("ScanCondition")({
  MapEquals: MapEquals.pipe(T.JsonName("mapEquals")),
}) {}
export const ScanCriterion = S.Record({ key: S.String, value: ScanCondition });
export class ScanResourceCriteria extends S.Class<ScanResourceCriteria>(
  "ScanResourceCriteria",
)({
  Include: S.optional(ScanCriterion).pipe(T.JsonName("include")),
  Exclude: S.optional(ScanCriterion).pipe(T.JsonName("exclude")),
}) {}
export class GetMalwareScanSettingsResponse extends S.Class<GetMalwareScanSettingsResponse>(
  "GetMalwareScanSettingsResponse",
)({
  ScanResourceCriteria: S.optional(ScanResourceCriteria).pipe(
    T.JsonName("scanResourceCriteria"),
  ),
  EbsSnapshotPreservation: S.optional(S.String).pipe(
    T.JsonName("ebsSnapshotPreservation"),
  ),
}) {}
export class GetThreatEntitySetResponse extends S.Class<GetThreatEntitySetResponse>(
  "GetThreatEntitySetResponse",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Format: S.String.pipe(T.JsonName("format")),
  Location: S.String.pipe(T.JsonName("location")),
  ExpectedBucketOwner: S.optional(S.String).pipe(
    T.JsonName("expectedBucketOwner"),
  ),
  Status: S.String.pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
  ErrorDetails: S.optional(S.String).pipe(T.JsonName("errorDetails")),
}) {}
export class GetThreatIntelSetResponse extends S.Class<GetThreatIntelSetResponse>(
  "GetThreatIntelSetResponse",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Format: S.String.pipe(T.JsonName("format")),
  Location: S.String.pipe(T.JsonName("location")),
  Status: S.String.pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  ExpectedBucketOwner: S.optional(S.String).pipe(
    T.JsonName("expectedBucketOwner"),
  ),
}) {}
export class GetTrustedEntitySetResponse extends S.Class<GetTrustedEntitySetResponse>(
  "GetTrustedEntitySetResponse",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Format: S.String.pipe(T.JsonName("format")),
  Location: S.String.pipe(T.JsonName("location")),
  ExpectedBucketOwner: S.optional(S.String).pipe(
    T.JsonName("expectedBucketOwner"),
  ),
  Status: S.String.pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
  ErrorDetails: S.optional(S.String).pipe(T.JsonName("errorDetails")),
}) {}
export class GetUsageStatisticsRequest extends S.Class<GetUsageStatisticsRequest>(
  "GetUsageStatisticsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    UsageStatisticType: S.String.pipe(T.JsonName("usageStatisticsType")),
    UsageCriteria: UsageCriteria.pipe(T.JsonName("usageCriteria")),
    Unit: S.optional(S.String).pipe(T.JsonName("unit")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/usage/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InviteMembersResponse extends S.Class<InviteMembersResponse>(
  "InviteMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class CoverageFilterCondition extends S.Class<CoverageFilterCondition>(
  "CoverageFilterCondition",
)({
  Equals: S.optional(Equals).pipe(T.JsonName("equals")),
  NotEquals: S.optional(NotEquals).pipe(T.JsonName("notEquals")),
}) {}
export class CoverageFilterCriterion extends S.Class<CoverageFilterCriterion>(
  "CoverageFilterCriterion",
)({
  CriterionKey: S.optional(S.String).pipe(T.JsonName("criterionKey")),
  FilterCondition: S.optional(CoverageFilterCondition).pipe(
    T.JsonName("filterCondition"),
  ),
}) {}
export const CoverageFilterCriterionList = S.Array(CoverageFilterCriterion);
export class CoverageFilterCriteria extends S.Class<CoverageFilterCriteria>(
  "CoverageFilterCriteria",
)({
  FilterCriterion: S.optional(CoverageFilterCriterionList).pipe(
    T.JsonName("filterCriterion"),
  ),
}) {}
export class ListCoverageRequest extends S.Class<ListCoverageRequest>(
  "ListCoverageRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    FilterCriteria: S.optional(CoverageFilterCriteria).pipe(
      T.JsonName("filterCriteria"),
    ),
    SortCriteria: S.optional(CoverageSortCriteria).pipe(
      T.JsonName("sortCriteria"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/coverage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDetectorsResponse extends S.Class<ListDetectorsResponse>(
  "ListDetectorsResponse",
)({
  DetectorIds: DetectorIds.pipe(T.JsonName("detectorIds")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListFiltersResponse extends S.Class<ListFiltersResponse>(
  "ListFiltersResponse",
)({
  FilterNames: FilterNames.pipe(T.JsonName("filterNames")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListFindingsResponse extends S.Class<ListFindingsResponse>(
  "ListFindingsResponse",
)({
  FindingIds: FindingIds.pipe(T.JsonName("findingIds")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListIPSetsResponse extends S.Class<ListIPSetsResponse>(
  "ListIPSetsResponse",
)({
  IpSetIds: IpSetIds.pipe(T.JsonName("ipSetIds")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class Member extends S.Class<Member>("Member")({
  AccountId: S.String.pipe(T.JsonName("accountId")),
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  MasterId: S.String.pipe(T.JsonName("masterId")),
  Email: S.String.pipe(T.JsonName("email")),
  RelationshipStatus: S.String.pipe(T.JsonName("relationshipStatus")),
  InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
  UpdatedAt: S.String.pipe(T.JsonName("updatedAt")),
  AdministratorId: S.optional(S.String).pipe(T.JsonName("administratorId")),
}) {}
export const Members = S.Array(Member);
export class ListMembersResponse extends S.Class<ListMembersResponse>(
  "ListMembersResponse",
)({
  Members: S.optional(Members).pipe(T.JsonName("members")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap).pipe(T.JsonName("tags")) }) {}
export class ListThreatEntitySetsResponse extends S.Class<ListThreatEntitySetsResponse>(
  "ListThreatEntitySetsResponse",
)({
  ThreatEntitySetIds: ThreatEntitySetIds.pipe(T.JsonName("threatEntitySetIds")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListThreatIntelSetsResponse extends S.Class<ListThreatIntelSetsResponse>(
  "ListThreatIntelSetsResponse",
)({
  ThreatIntelSetIds: ThreatIntelSetIds.pipe(T.JsonName("threatIntelSetIds")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTrustedEntitySetsResponse extends S.Class<ListTrustedEntitySetsResponse>(
  "ListTrustedEntitySetsResponse",
)({
  TrustedEntitySetIds: TrustedEntitySetIds.pipe(
    T.JsonName("trustedEntitySetIds"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class SendObjectMalwareScanRequest extends S.Class<SendObjectMalwareScanRequest>(
  "SendObjectMalwareScanRequest",
)(
  {
    S3Object: S.optional(S3ObjectForSendObjectMalwareScan).pipe(
      T.JsonName("s3Object"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/object-malware-scan/send" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendObjectMalwareScanResponse extends S.Class<SendObjectMalwareScanResponse>(
  "SendObjectMalwareScanResponse",
)({}) {}
export class StartMonitoringMembersResponse extends S.Class<StartMonitoringMembersResponse>(
  "StartMonitoringMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class StopMonitoringMembersResponse extends S.Class<StopMonitoringMembersResponse>(
  "StopMonitoringMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class UpdateFilterResponse extends S.Class<UpdateFilterResponse>(
  "UpdateFilterResponse",
)({ Name: S.String.pipe(T.JsonName("name")) }) {}
export class CreateS3BucketResource extends S.Class<CreateS3BucketResource>(
  "CreateS3BucketResource",
)({
  BucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
  ObjectPrefixes: S.optional(MalwareProtectionPlanObjectPrefixesList).pipe(
    T.JsonName("objectPrefixes"),
  ),
}) {}
export class MalwareProtectionPlanTaggingAction extends S.Class<MalwareProtectionPlanTaggingAction>(
  "MalwareProtectionPlanTaggingAction",
)({ Status: S.optional(S.String).pipe(T.JsonName("status")) }) {}
export class FilterCondition extends S.Class<FilterCondition>(
  "FilterCondition",
)({
  EqualsValue: S.optional(S.String).pipe(T.JsonName("equalsValue")),
  GreaterThan: S.optional(S.Number).pipe(T.JsonName("greaterThan")),
  LessThan: S.optional(S.Number).pipe(T.JsonName("lessThan")),
}) {}
export class ListMalwareScansFilterCriterion extends S.Class<ListMalwareScansFilterCriterion>(
  "ListMalwareScansFilterCriterion",
)({
  ListMalwareScansCriterionKey: S.optional(S.String).pipe(
    T.JsonName("criterionKey"),
  ),
  FilterCondition: S.optional(FilterCondition).pipe(
    T.JsonName("filterCondition"),
  ),
}) {}
export const ListMalwareScansFilterCriterionList = S.Array(
  ListMalwareScansFilterCriterion,
);
export class IncrementalScanDetails extends S.Class<IncrementalScanDetails>(
  "IncrementalScanDetails",
)({ BaselineResourceArn: S.String.pipe(T.JsonName("baselineResourceArn")) }) {}
export class RecoveryPoint extends S.Class<RecoveryPoint>("RecoveryPoint")({
  BackupVaultName: S.String.pipe(T.JsonName("backupVaultName")),
}) {}
export class UpdateS3BucketResource extends S.Class<UpdateS3BucketResource>(
  "UpdateS3BucketResource",
)({
  ObjectPrefixes: S.optional(MalwareProtectionPlanObjectPrefixesList).pipe(
    T.JsonName("objectPrefixes"),
  ),
}) {}
export class MemberAdditionalConfiguration extends S.Class<MemberAdditionalConfiguration>(
  "MemberAdditionalConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const MemberAdditionalConfigurations = S.Array(
  MemberAdditionalConfiguration,
);
export class OrganizationS3LogsConfiguration extends S.Class<OrganizationS3LogsConfiguration>(
  "OrganizationS3LogsConfiguration",
)({ AutoEnable: S.Boolean.pipe(T.JsonName("autoEnable")) }) {}
export class OrganizationAdditionalConfiguration extends S.Class<OrganizationAdditionalConfiguration>(
  "OrganizationAdditionalConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  AutoEnable: S.optional(S.String).pipe(T.JsonName("autoEnable")),
}) {}
export const OrganizationAdditionalConfigurations = S.Array(
  OrganizationAdditionalConfiguration,
);
export class CreateProtectedResource extends S.Class<CreateProtectedResource>(
  "CreateProtectedResource",
)({
  S3Bucket: S.optional(CreateS3BucketResource).pipe(T.JsonName("s3Bucket")),
}) {}
export class MalwareProtectionPlanActions extends S.Class<MalwareProtectionPlanActions>(
  "MalwareProtectionPlanActions",
)({
  Tagging: S.optional(MalwareProtectionPlanTaggingAction).pipe(
    T.JsonName("tagging"),
  ),
}) {}
export class Administrator extends S.Class<Administrator>("Administrator")({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  RelationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
  InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
}) {}
export class MalwareProtectionPlanStatusReason extends S.Class<MalwareProtectionPlanStatusReason>(
  "MalwareProtectionPlanStatusReason",
)({
  Code: S.optional(S.String).pipe(T.JsonName("code")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export const MalwareProtectionPlanStatusReasonsList = S.Array(
  MalwareProtectionPlanStatusReason,
);
export class Master extends S.Class<Master>("Master")({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  RelationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
  InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
}) {}
export class Invitation extends S.Class<Invitation>("Invitation")({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  InvitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  RelationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
  InvitedAt: S.optional(S.String).pipe(T.JsonName("invitedAt")),
}) {}
export const Invitations = S.Array(Invitation);
export class MalwareProtectionPlanSummary extends S.Class<MalwareProtectionPlanSummary>(
  "MalwareProtectionPlanSummary",
)({
  MalwareProtectionPlanId: S.optional(S.String).pipe(
    T.JsonName("malwareProtectionPlanId"),
  ),
}) {}
export const MalwareProtectionPlansSummary = S.Array(
  MalwareProtectionPlanSummary,
);
export class ListMalwareScansFilterCriteria extends S.Class<ListMalwareScansFilterCriteria>(
  "ListMalwareScansFilterCriteria",
)({
  ListMalwareScansFilterCriterion: S.optional(
    ListMalwareScansFilterCriterionList,
  ).pipe(T.JsonName("filterCriterion")),
}) {}
export class AdminAccount extends S.Class<AdminAccount>("AdminAccount")({
  AdminAccountId: S.optional(S.String).pipe(T.JsonName("adminAccountId")),
  AdminStatus: S.optional(S.String).pipe(T.JsonName("adminStatus")),
}) {}
export const AdminAccounts = S.Array(AdminAccount);
export class Destination extends S.Class<Destination>("Destination")({
  DestinationId: S.String.pipe(T.JsonName("destinationId")),
  DestinationType: S.String.pipe(T.JsonName("destinationType")),
  Status: S.String.pipe(T.JsonName("status")),
}) {}
export const Destinations = S.Array(Destination);
export class StartMalwareScanConfiguration extends S.Class<StartMalwareScanConfiguration>(
  "StartMalwareScanConfiguration",
)({
  Role: S.String.pipe(T.JsonName("role")),
  IncrementalScanDetails: S.optional(IncrementalScanDetails).pipe(
    T.JsonName("incrementalScanDetails"),
  ),
  RecoveryPoint: S.optional(RecoveryPoint).pipe(T.JsonName("recoveryPoint")),
}) {}
export class UpdateProtectedResource extends S.Class<UpdateProtectedResource>(
  "UpdateProtectedResource",
)({
  S3Bucket: S.optional(UpdateS3BucketResource).pipe(T.JsonName("s3Bucket")),
}) {}
export class MemberFeaturesConfiguration extends S.Class<MemberFeaturesConfiguration>(
  "MemberFeaturesConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  AdditionalConfiguration: S.optional(MemberAdditionalConfigurations).pipe(
    T.JsonName("additionalConfiguration"),
  ),
}) {}
export const MemberFeaturesConfigurations = S.Array(
  MemberFeaturesConfiguration,
);
export class OrganizationFeatureConfiguration extends S.Class<OrganizationFeatureConfiguration>(
  "OrganizationFeatureConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  AutoEnable: S.optional(S.String).pipe(T.JsonName("autoEnable")),
  AdditionalConfiguration: S.optional(
    OrganizationAdditionalConfigurations,
  ).pipe(T.JsonName("additionalConfiguration")),
}) {}
export const OrganizationFeaturesConfigurations = S.Array(
  OrganizationFeatureConfiguration,
);
export class OrganizationKubernetesAuditLogsConfiguration extends S.Class<OrganizationKubernetesAuditLogsConfiguration>(
  "OrganizationKubernetesAuditLogsConfiguration",
)({ AutoEnable: S.Boolean.pipe(T.JsonName("autoEnable")) }) {}
export class CreateMalwareProtectionPlanRequest extends S.Class<CreateMalwareProtectionPlanRequest>(
  "CreateMalwareProtectionPlanRequest",
)(
  {
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Role: S.String.pipe(T.JsonName("role")),
    ProtectedResource: CreateProtectedResource.pipe(
      T.JsonName("protectedResource"),
    ),
    Actions: S.optional(MalwareProtectionPlanActions).pipe(
      T.JsonName("actions"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/malware-protection-plan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMembersResponse extends S.Class<CreateMembersResponse>(
  "CreateMembersResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class CreatePublishingDestinationResponse extends S.Class<CreatePublishingDestinationResponse>(
  "CreatePublishingDestinationResponse",
)({ DestinationId: S.String.pipe(T.JsonName("destinationId")) }) {}
export class DeclineInvitationsResponse extends S.Class<DeclineInvitationsResponse>(
  "DeclineInvitationsResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class GetAdministratorAccountResponse extends S.Class<GetAdministratorAccountResponse>(
  "GetAdministratorAccountResponse",
)({ Administrator: Administrator.pipe(T.JsonName("administrator")) }) {}
export class GetMalwareProtectionPlanResponse extends S.Class<GetMalwareProtectionPlanResponse>(
  "GetMalwareProtectionPlanResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  ProtectedResource: S.optional(CreateProtectedResource).pipe(
    T.JsonName("protectedResource"),
  ),
  Actions: S.optional(MalwareProtectionPlanActions).pipe(T.JsonName("actions")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  StatusReasons: S.optional(MalwareProtectionPlanStatusReasonsList).pipe(
    T.JsonName("statusReasons"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetMasterAccountResponse extends S.Class<GetMasterAccountResponse>(
  "GetMasterAccountResponse",
)({ Master: Master.pipe(T.JsonName("master")) }) {}
export class GetMembersResponse extends S.Class<GetMembersResponse>(
  "GetMembersResponse",
)({
  Members: Members.pipe(T.JsonName("members")),
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class ListInvitationsResponse extends S.Class<ListInvitationsResponse>(
  "ListInvitationsResponse",
)({
  Invitations: S.optional(Invitations).pipe(T.JsonName("invitations")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListMalwareProtectionPlansResponse extends S.Class<ListMalwareProtectionPlansResponse>(
  "ListMalwareProtectionPlansResponse",
)({
  MalwareProtectionPlans: S.optional(MalwareProtectionPlansSummary).pipe(
    T.JsonName("malwareProtectionPlans"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListMalwareScansRequest extends S.Class<ListMalwareScansRequest>(
  "ListMalwareScansRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("maxResults"),
      T.JsonName("maxResults"),
    ),
    NextToken: S.optional(S.String).pipe(
      T.HttpQuery("nextToken"),
      T.JsonName("nextToken"),
    ),
    FilterCriteria: S.optional(ListMalwareScansFilterCriteria).pipe(
      T.JsonName("filterCriteria"),
    ),
    SortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/malware-scan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationAdminAccountsResponse extends S.Class<ListOrganizationAdminAccountsResponse>(
  "ListOrganizationAdminAccountsResponse",
)({
  AdminAccounts: S.optional(AdminAccounts).pipe(T.JsonName("adminAccounts")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListPublishingDestinationsResponse extends S.Class<ListPublishingDestinationsResponse>(
  "ListPublishingDestinationsResponse",
)({
  Destinations: Destinations.pipe(T.JsonName("destinations")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class StartMalwareScanRequest extends S.Class<StartMalwareScanRequest>(
  "StartMalwareScanRequest",
)(
  {
    ResourceArn: S.String.pipe(T.JsonName("resourceArn")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    ScanConfiguration: S.optional(StartMalwareScanConfiguration).pipe(
      T.JsonName("scanConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/malware-scan/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMalwareProtectionPlanRequest extends S.Class<UpdateMalwareProtectionPlanRequest>(
  "UpdateMalwareProtectionPlanRequest",
)(
  {
    MalwareProtectionPlanId: S.String.pipe(
      T.HttpLabel("MalwareProtectionPlanId"),
      T.JsonName("malwareProtectionPlanId"),
    ),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    Actions: S.optional(MalwareProtectionPlanActions).pipe(
      T.JsonName("actions"),
    ),
    ProtectedResource: S.optional(UpdateProtectedResource).pipe(
      T.JsonName("protectedResource"),
    ),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/malware-protection-plan/{MalwareProtectionPlanId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMalwareProtectionPlanResponse extends S.Class<UpdateMalwareProtectionPlanResponse>(
  "UpdateMalwareProtectionPlanResponse",
)({}) {}
export class UpdateMemberDetectorsRequest extends S.Class<UpdateMemberDetectorsRequest>(
  "UpdateMemberDetectorsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AccountIds: AccountIds.pipe(T.JsonName("accountIds")),
    DataSources: S.optional(DataSourceConfigurations).pipe(
      T.JsonName("dataSources"),
    ),
    Features: S.optional(MemberFeaturesConfigurations).pipe(
      T.JsonName("features"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/member/detector/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FilterCriterion extends S.Class<FilterCriterion>(
  "FilterCriterion",
)({
  CriterionKey: S.optional(S.String).pipe(T.JsonName("criterionKey")),
  FilterCondition: S.optional(FilterCondition).pipe(
    T.JsonName("filterCondition"),
  ),
}) {}
export const FilterCriterionList = S.Array(FilterCriterion);
export class OrganizationS3LogsConfigurationResult extends S.Class<OrganizationS3LogsConfigurationResult>(
  "OrganizationS3LogsConfigurationResult",
)({ AutoEnable: S.Boolean.pipe(T.JsonName("autoEnable")) }) {}
export class OrganizationAdditionalConfigurationResult extends S.Class<OrganizationAdditionalConfigurationResult>(
  "OrganizationAdditionalConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  AutoEnable: S.optional(S.String).pipe(T.JsonName("autoEnable")),
}) {}
export const OrganizationAdditionalConfigurationResults = S.Array(
  OrganizationAdditionalConfigurationResult,
);
export class CloudTrailConfigurationResult extends S.Class<CloudTrailConfigurationResult>(
  "CloudTrailConfigurationResult",
)({ Status: S.String.pipe(T.JsonName("status")) }) {}
export class DNSLogsConfigurationResult extends S.Class<DNSLogsConfigurationResult>(
  "DNSLogsConfigurationResult",
)({ Status: S.String.pipe(T.JsonName("status")) }) {}
export class FlowLogsConfigurationResult extends S.Class<FlowLogsConfigurationResult>(
  "FlowLogsConfigurationResult",
)({ Status: S.String.pipe(T.JsonName("status")) }) {}
export class S3LogsConfigurationResult extends S.Class<S3LogsConfigurationResult>(
  "S3LogsConfigurationResult",
)({ Status: S.String.pipe(T.JsonName("status")) }) {}
export class DetectorAdditionalConfigurationResult extends S.Class<DetectorAdditionalConfigurationResult>(
  "DetectorAdditionalConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const DetectorAdditionalConfigurationResults = S.Array(
  DetectorAdditionalConfigurationResult,
);
export const CountBySeverity = S.Record({ key: S.String, value: S.Number });
export class AccountStatistics extends S.Class<AccountStatistics>(
  "AccountStatistics",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  LastGeneratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastGeneratedAt")),
  TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
}) {}
export const GroupedByAccount = S.Array(AccountStatistics);
export class DateStatistics extends S.Class<DateStatistics>("DateStatistics")({
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("date"),
  ),
  LastGeneratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastGeneratedAt")),
  Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
  TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
}) {}
export const GroupedByDate = S.Array(DateStatistics);
export class FindingTypeStatistics extends S.Class<FindingTypeStatistics>(
  "FindingTypeStatistics",
)({
  FindingType: S.optional(S.String).pipe(T.JsonName("findingType")),
  LastGeneratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastGeneratedAt")),
  TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
}) {}
export const GroupedByFindingType = S.Array(FindingTypeStatistics);
export class ResourceStatistics extends S.Class<ResourceStatistics>(
  "ResourceStatistics",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  LastGeneratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastGeneratedAt")),
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
}) {}
export const GroupedByResource = S.Array(ResourceStatistics);
export class SeverityStatistics extends S.Class<SeverityStatistics>(
  "SeverityStatistics",
)({
  LastGeneratedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastGeneratedAt")),
  Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
  TotalFindings: S.optional(S.Number).pipe(T.JsonName("totalFindings")),
}) {}
export const GroupedBySeverity = S.Array(SeverityStatistics);
export class TriggerDetails extends S.Class<TriggerDetails>("TriggerDetails")({
  GuardDutyFindingId: S.optional(S.String).pipe(
    T.JsonName("guardDutyFindingId"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  TriggerType: S.optional(S.String).pipe(T.JsonName("triggerType")),
}) {}
export class ScanConfigurationRecoveryPoint extends S.Class<ScanConfigurationRecoveryPoint>(
  "ScanConfigurationRecoveryPoint",
)({
  BackupVaultName: S.optional(S.String).pipe(T.JsonName("backupVaultName")),
}) {}
export class FreeTrialFeatureConfigurationResult extends S.Class<FreeTrialFeatureConfigurationResult>(
  "FreeTrialFeatureConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  FreeTrialDaysRemaining: S.optional(S.Number).pipe(
    T.JsonName("freeTrialDaysRemaining"),
  ),
}) {}
export const FreeTrialFeatureConfigurationsResults = S.Array(
  FreeTrialFeatureConfigurationResult,
);
export class OrganizationKubernetesConfiguration extends S.Class<OrganizationKubernetesConfiguration>(
  "OrganizationKubernetesConfiguration",
)({
  AuditLogs: OrganizationKubernetesAuditLogsConfiguration.pipe(
    T.JsonName("auditLogs"),
  ),
}) {}
export class VolumeDetail extends S.Class<VolumeDetail>("VolumeDetail")({
  VolumeArn: S.optional(S.String).pipe(T.JsonName("volumeArn")),
  VolumeType: S.optional(S.String).pipe(T.JsonName("volumeType")),
  DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")),
  VolumeSizeInGB: S.optional(S.Number).pipe(T.JsonName("volumeSizeInGB")),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  SnapshotArn: S.optional(S.String).pipe(T.JsonName("snapshotArn")),
  KmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
}) {}
export const VolumeDetails = S.Array(VolumeDetail);
export const Sources = S.Array(S.String);
export class OrganizationFeatureStatisticsAdditionalConfiguration extends S.Class<OrganizationFeatureStatisticsAdditionalConfiguration>(
  "OrganizationFeatureStatisticsAdditionalConfiguration",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  EnabledAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("enabledAccountsCount"),
  ),
}) {}
export const OrganizationFeatureStatisticsAdditionalConfigurations = S.Array(
  OrganizationFeatureStatisticsAdditionalConfiguration,
);
export class OrganizationEbsVolumes extends S.Class<OrganizationEbsVolumes>(
  "OrganizationEbsVolumes",
)({ AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")) }) {}
export class FilterCriteria extends S.Class<FilterCriteria>("FilterCriteria")({
  FilterCriterion: S.optional(FilterCriterionList).pipe(
    T.JsonName("filterCriterion"),
  ),
}) {}
export class OrganizationFeatureConfigurationResult extends S.Class<OrganizationFeatureConfigurationResult>(
  "OrganizationFeatureConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  AutoEnable: S.optional(S.String).pipe(T.JsonName("autoEnable")),
  AdditionalConfiguration: S.optional(
    OrganizationAdditionalConfigurationResults,
  ).pipe(T.JsonName("additionalConfiguration")),
}) {}
export const OrganizationFeaturesConfigurationsResults = S.Array(
  OrganizationFeatureConfigurationResult,
);
export class DetectorFeatureConfigurationResult extends S.Class<DetectorFeatureConfigurationResult>(
  "DetectorFeatureConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
  AdditionalConfiguration: S.optional(
    DetectorAdditionalConfigurationResults,
  ).pipe(T.JsonName("additionalConfiguration")),
}) {}
export const DetectorFeatureConfigurationsResults = S.Array(
  DetectorFeatureConfigurationResult,
);
export class FindingStatistics extends S.Class<FindingStatistics>(
  "FindingStatistics",
)({
  CountBySeverity: S.optional(CountBySeverity).pipe(
    T.JsonName("countBySeverity"),
  ),
  GroupedByAccount: S.optional(GroupedByAccount).pipe(
    T.JsonName("groupedByAccount"),
  ),
  GroupedByDate: S.optional(GroupedByDate).pipe(T.JsonName("groupedByDate")),
  GroupedByFindingType: S.optional(GroupedByFindingType).pipe(
    T.JsonName("groupedByFindingType"),
  ),
  GroupedByResource: S.optional(GroupedByResource).pipe(
    T.JsonName("groupedByResource"),
  ),
  GroupedBySeverity: S.optional(GroupedBySeverity).pipe(
    T.JsonName("groupedBySeverity"),
  ),
}) {}
export class ScanConfiguration extends S.Class<ScanConfiguration>(
  "ScanConfiguration",
)({
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  TriggerDetails: S.optional(TriggerDetails).pipe(T.JsonName("triggerDetails")),
  IncrementalScanDetails: S.optional(IncrementalScanDetails).pipe(
    T.JsonName("incrementalScanDetails"),
  ),
  RecoveryPoint: S.optional(ScanConfigurationRecoveryPoint).pipe(
    T.JsonName("recoveryPoint"),
  ),
}) {}
export class OrganizationKubernetesAuditLogsConfigurationResult extends S.Class<OrganizationKubernetesAuditLogsConfigurationResult>(
  "OrganizationKubernetesAuditLogsConfigurationResult",
)({ AutoEnable: S.Boolean.pipe(T.JsonName("autoEnable")) }) {}
export class KubernetesAuditLogsConfigurationResult extends S.Class<KubernetesAuditLogsConfigurationResult>(
  "KubernetesAuditLogsConfigurationResult",
)({ Status: S.String.pipe(T.JsonName("status")) }) {}
export class AccessKeyDetails extends S.Class<AccessKeyDetails>(
  "AccessKeyDetails",
)({
  AccessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
  PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  UserName: S.optional(S.String).pipe(T.JsonName("userName")),
  UserType: S.optional(S.String).pipe(T.JsonName("userType")),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String).pipe(T.JsonName("key")),
  Value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const Tags = S.Array(Tag);
export class EksClusterDetails extends S.Class<EksClusterDetails>(
  "EksClusterDetails",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
}) {}
export class EbsVolumeDetails extends S.Class<EbsVolumeDetails>(
  "EbsVolumeDetails",
)({
  ScannedVolumeDetails: S.optional(VolumeDetails).pipe(
    T.JsonName("scannedVolumeDetails"),
  ),
  SkippedVolumeDetails: S.optional(VolumeDetails).pipe(
    T.JsonName("skippedVolumeDetails"),
  ),
}) {}
export class RdsDbInstanceDetails extends S.Class<RdsDbInstanceDetails>(
  "RdsDbInstanceDetails",
)({
  DbInstanceIdentifier: S.optional(S.String).pipe(
    T.JsonName("dbInstanceIdentifier"),
  ),
  Engine: S.optional(S.String).pipe(T.JsonName("engine")),
  EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
  DbClusterIdentifier: S.optional(S.String).pipe(
    T.JsonName("dbClusterIdentifier"),
  ),
  DbInstanceArn: S.optional(S.String).pipe(T.JsonName("dbInstanceArn")),
  DbiResourceId: S.optional(S.String).pipe(T.JsonName("dbiResourceId")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class RdsLimitlessDbDetails extends S.Class<RdsLimitlessDbDetails>(
  "RdsLimitlessDbDetails",
)({
  DbShardGroupIdentifier: S.optional(S.String).pipe(
    T.JsonName("dbShardGroupIdentifier"),
  ),
  DbShardGroupResourceId: S.optional(S.String).pipe(
    T.JsonName("dbShardGroupResourceId"),
  ),
  DbShardGroupArn: S.optional(S.String).pipe(T.JsonName("dbShardGroupArn")),
  Engine: S.optional(S.String).pipe(T.JsonName("engine")),
  EngineVersion: S.optional(S.String).pipe(T.JsonName("engineVersion")),
  DbClusterIdentifier: S.optional(S.String).pipe(
    T.JsonName("dbClusterIdentifier"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class RdsDbUserDetails extends S.Class<RdsDbUserDetails>(
  "RdsDbUserDetails",
)({
  User: S.optional(S.String).pipe(T.JsonName("user")),
  Application: S.optional(S.String).pipe(T.JsonName("application")),
  Database: S.optional(S.String).pipe(T.JsonName("database")),
  Ssl: S.optional(S.String).pipe(T.JsonName("ssl")),
  AuthMethod: S.optional(S.String).pipe(T.JsonName("authMethod")),
}) {}
export class EbsSnapshotDetails extends S.Class<EbsSnapshotDetails>(
  "EbsSnapshotDetails",
)({ SnapshotArn: S.optional(S.String).pipe(T.JsonName("snapshotArn")) }) {}
export class Ec2ImageDetails extends S.Class<Ec2ImageDetails>(
  "Ec2ImageDetails",
)({ ImageArn: S.optional(S.String).pipe(T.JsonName("imageArn")) }) {}
export class RecoveryPointDetails extends S.Class<RecoveryPointDetails>(
  "RecoveryPointDetails",
)({
  RecoveryPointArn: S.optional(S.String).pipe(T.JsonName("recoveryPointArn")),
  BackupVaultName: S.optional(S.String).pipe(T.JsonName("backupVaultName")),
}) {}
export class ServiceAdditionalInfo extends S.Class<ServiceAdditionalInfo>(
  "ServiceAdditionalInfo",
)({
  Value: S.optional(S.String).pipe(T.JsonName("value")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class EbsSnapshot extends S.Class<EbsSnapshot>("EbsSnapshot")({
  DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")),
}) {}
export class MemberAdditionalConfigurationResult extends S.Class<MemberAdditionalConfigurationResult>(
  "MemberAdditionalConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const MemberAdditionalConfigurationResults = S.Array(
  MemberAdditionalConfigurationResult,
);
export class OrganizationFeatureStatistics extends S.Class<OrganizationFeatureStatistics>(
  "OrganizationFeatureStatistics",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  EnabledAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("enabledAccountsCount"),
  ),
  AdditionalConfiguration: S.optional(
    OrganizationFeatureStatisticsAdditionalConfigurations,
  ).pipe(T.JsonName("additionalConfiguration")),
}) {}
export const OrganizationFeatureStatisticsResults = S.Array(
  OrganizationFeatureStatistics,
);
export class DataSourceFreeTrial extends S.Class<DataSourceFreeTrial>(
  "DataSourceFreeTrial",
)({
  FreeTrialDaysRemaining: S.optional(S.Number).pipe(
    T.JsonName("freeTrialDaysRemaining"),
  ),
}) {}
export class KubernetesDataSourceFreeTrial extends S.Class<KubernetesDataSourceFreeTrial>(
  "KubernetesDataSourceFreeTrial",
)({
  AuditLogs: S.optional(DataSourceFreeTrial).pipe(T.JsonName("auditLogs")),
}) {}
export class MalwareProtectionDataSourceFreeTrial extends S.Class<MalwareProtectionDataSourceFreeTrial>(
  "MalwareProtectionDataSourceFreeTrial",
)({
  ScanEc2InstanceWithFindings: S.optional(DataSourceFreeTrial).pipe(
    T.JsonName("scanEc2InstanceWithFindings"),
  ),
}) {}
export class OrganizationScanEc2InstanceWithFindings extends S.Class<OrganizationScanEc2InstanceWithFindings>(
  "OrganizationScanEc2InstanceWithFindings",
)({
  EbsVolumes: S.optional(OrganizationEbsVolumes).pipe(T.JsonName("ebsVolumes")),
}) {}
export class CreateDetectorRequest extends S.Class<CreateDetectorRequest>(
  "CreateDetectorRequest",
)(
  {
    Enable: S.Boolean.pipe(T.JsonName("enable")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    FindingPublishingFrequency: S.optional(S.String).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    DataSources: S.optional(DataSourceConfigurations).pipe(
      T.JsonName("dataSources"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    Features: S.optional(DetectorFeatureConfigurations).pipe(
      T.JsonName("features"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFilterRequest extends S.Class<CreateFilterRequest>(
  "CreateFilterRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    Name: S.String.pipe(T.JsonName("name")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Action: S.optional(S.String).pipe(T.JsonName("action")),
    Rank: S.optional(S.Number).pipe(T.JsonName("rank")),
    FindingCriteria: FindingCriteria.pipe(T.JsonName("findingCriteria")),
    ClientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/filter" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMalwareProtectionPlanResponse extends S.Class<CreateMalwareProtectionPlanResponse>(
  "CreateMalwareProtectionPlanResponse",
)({
  MalwareProtectionPlanId: S.optional(S.String).pipe(
    T.JsonName("malwareProtectionPlanId"),
  ),
}) {}
export class DescribeMalwareScansRequest extends S.Class<DescribeMalwareScansRequest>(
  "DescribeMalwareScansRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    FilterCriteria: S.optional(FilterCriteria).pipe(
      T.JsonName("filterCriteria"),
    ),
    SortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/malware-scans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCoverageStatisticsRequest extends S.Class<GetCoverageStatisticsRequest>(
  "GetCoverageStatisticsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    FilterCriteria: S.optional(CoverageFilterCriteria).pipe(
      T.JsonName("filterCriteria"),
    ),
    StatisticsType: CoverageStatisticsTypeList.pipe(
      T.JsonName("statisticsType"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/coverage/statistics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Ipv6Addresses = S.Array(S.String);
export const Groups = S.Array(S.String);
export const SessionNameList = S.Array(S.String);
export class VolumeMount extends S.Class<VolumeMount>("VolumeMount")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  MountPath: S.optional(S.String).pipe(T.JsonName("mountPath")),
}) {}
export const VolumeMounts = S.Array(VolumeMount);
export class SecurityContext extends S.Class<SecurityContext>(
  "SecurityContext",
)({
  Privileged: S.optional(S.Boolean).pipe(T.JsonName("privileged")),
  AllowPrivilegeEscalation: S.optional(S.Boolean).pipe(
    T.JsonName("allowPrivilegeEscalation"),
  ),
}) {}
export class Container extends S.Class<Container>("Container")({
  ContainerRuntime: S.optional(S.String).pipe(T.JsonName("containerRuntime")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Image: S.optional(S.String).pipe(T.JsonName("image")),
  ImagePrefix: S.optional(S.String).pipe(T.JsonName("imagePrefix")),
  VolumeMounts: S.optional(VolumeMounts).pipe(T.JsonName("volumeMounts")),
  SecurityContext: S.optional(SecurityContext).pipe(
    T.JsonName("securityContext"),
  ),
}) {}
export const Containers = S.Array(Container);
export const SubnetIds = S.Array(S.String);
export const SourceIps = S.Array(S.String);
export const ThreatNames = S.Array(S.String);
export const FlagsList = S.Array(S.String);
export const MemoryRegionsList = S.Array(S.String);
export const AdditionalSequenceTypes = S.Array(S.String);
export class GetFindingsStatisticsResponse extends S.Class<GetFindingsStatisticsResponse>(
  "GetFindingsStatisticsResponse",
)({
  FindingStatistics: FindingStatistics.pipe(T.JsonName("findingStatistics")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class StartMalwareScanResponse extends S.Class<StartMalwareScanResponse>(
  "StartMalwareScanResponse",
)({ ScanId: S.optional(S.String).pipe(T.JsonName("scanId")) }) {}
export class UpdateMemberDetectorsResponse extends S.Class<UpdateMemberDetectorsResponse>(
  "UpdateMemberDetectorsResponse",
)({
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class OrganizationKubernetesConfigurationResult extends S.Class<OrganizationKubernetesConfigurationResult>(
  "OrganizationKubernetesConfigurationResult",
)({
  AuditLogs: OrganizationKubernetesAuditLogsConfigurationResult.pipe(
    T.JsonName("auditLogs"),
  ),
}) {}
export class KubernetesConfigurationResult extends S.Class<KubernetesConfigurationResult>(
  "KubernetesConfigurationResult",
)({
  AuditLogs: KubernetesAuditLogsConfigurationResult.pipe(
    T.JsonName("auditLogs"),
  ),
}) {}
export class ScannedResourceDetails extends S.Class<ScannedResourceDetails>(
  "ScannedResourceDetails",
)({
  EbsVolume: S.optional(VolumeDetail).pipe(T.JsonName("ebsVolume")),
  EbsSnapshot: S.optional(EbsSnapshot).pipe(T.JsonName("ebsSnapshot")),
}) {}
export class MemberFeaturesConfigurationResult extends S.Class<MemberFeaturesConfigurationResult>(
  "MemberFeaturesConfigurationResult",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
  AdditionalConfiguration: S.optional(
    MemberAdditionalConfigurationResults,
  ).pipe(T.JsonName("additionalConfiguration")),
}) {}
export const MemberFeaturesConfigurationsResults = S.Array(
  MemberFeaturesConfigurationResult,
);
export class OrganizationStatistics extends S.Class<OrganizationStatistics>(
  "OrganizationStatistics",
)({
  TotalAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("totalAccountsCount"),
  ),
  MemberAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("memberAccountsCount"),
  ),
  ActiveAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("activeAccountsCount"),
  ),
  EnabledAccountsCount: S.optional(S.Number).pipe(
    T.JsonName("enabledAccountsCount"),
  ),
  CountByFeature: S.optional(OrganizationFeatureStatisticsResults).pipe(
    T.JsonName("countByFeature"),
  ),
}) {}
export class DataSourcesFreeTrial extends S.Class<DataSourcesFreeTrial>(
  "DataSourcesFreeTrial",
)({
  CloudTrail: S.optional(DataSourceFreeTrial).pipe(T.JsonName("cloudTrail")),
  DnsLogs: S.optional(DataSourceFreeTrial).pipe(T.JsonName("dnsLogs")),
  FlowLogs: S.optional(DataSourceFreeTrial).pipe(T.JsonName("flowLogs")),
  S3Logs: S.optional(DataSourceFreeTrial).pipe(T.JsonName("s3Logs")),
  Kubernetes: S.optional(KubernetesDataSourceFreeTrial).pipe(
    T.JsonName("kubernetes"),
  ),
  MalwareProtection: S.optional(MalwareProtectionDataSourceFreeTrial).pipe(
    T.JsonName("malwareProtection"),
  ),
}) {}
export class Total extends S.Class<Total>("Total")({
  Amount: S.optional(S.String).pipe(T.JsonName("amount")),
  Unit: S.optional(S.String).pipe(T.JsonName("unit")),
}) {}
export class UsageDataSourceResult extends S.Class<UsageDataSourceResult>(
  "UsageDataSourceResult",
)({
  DataSource: S.optional(S.String).pipe(T.JsonName("dataSource")),
  Total: S.optional(Total).pipe(T.JsonName("total")),
}) {}
export const UsageDataSourceResultList = S.Array(UsageDataSourceResult);
export class UsageResourceResult extends S.Class<UsageResourceResult>(
  "UsageResourceResult",
)({
  Resource: S.optional(S.String).pipe(T.JsonName("resource")),
  Total: S.optional(Total).pipe(T.JsonName("total")),
}) {}
export const UsageResourceResultList = S.Array(UsageResourceResult);
export class UsageFeatureResult extends S.Class<UsageFeatureResult>(
  "UsageFeatureResult",
)({
  Feature: S.optional(S.String).pipe(T.JsonName("feature")),
  Total: S.optional(Total).pipe(T.JsonName("total")),
}) {}
export const UsageFeatureResultList = S.Array(UsageFeatureResult);
export class OrganizationMalwareProtectionConfiguration extends S.Class<OrganizationMalwareProtectionConfiguration>(
  "OrganizationMalwareProtectionConfiguration",
)({
  ScanEc2InstanceWithFindings: S.optional(
    OrganizationScanEc2InstanceWithFindings,
  ).pipe(T.JsonName("scanEc2InstanceWithFindings")),
}) {}
export class OrganizationEbsVolumesResult extends S.Class<OrganizationEbsVolumesResult>(
  "OrganizationEbsVolumesResult",
)({ AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")) }) {}
export class EbsVolumesResult extends S.Class<EbsVolumesResult>(
  "EbsVolumesResult",
)({
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Reason: S.optional(S.String).pipe(T.JsonName("reason")),
}) {}
export class Owner extends S.Class<Owner>("Owner")({
  Id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class DefaultServerSideEncryption extends S.Class<DefaultServerSideEncryption>(
  "DefaultServerSideEncryption",
)({
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  KmsMasterKeyArn: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyArn")),
}) {}
export class S3ObjectDetail extends S.Class<S3ObjectDetail>("S3ObjectDetail")({
  ObjectArn: S.optional(S.String).pipe(T.JsonName("objectArn")),
  Key: S.optional(S.String).pipe(T.JsonName("key")),
  ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
}) {}
export const S3ObjectDetails = S.Array(S3ObjectDetail);
export class IamInstanceProfile extends S.Class<IamInstanceProfile>(
  "IamInstanceProfile",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class ProductCode extends S.Class<ProductCode>("ProductCode")({
  Code: S.optional(S.String).pipe(T.JsonName("productCodeId")),
  ProductType: S.optional(S.String).pipe(T.JsonName("productCodeType")),
}) {}
export const ProductCodes = S.Array(ProductCode);
export class HostPath extends S.Class<HostPath>("HostPath")({
  Path: S.optional(S.String).pipe(T.JsonName("path")),
}) {}
export class Volume extends S.Class<Volume>("Volume")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  HostPath: S.optional(HostPath).pipe(T.JsonName("hostPath")),
}) {}
export const Volumes = S.Array(Volume);
export class EcsTaskDetails extends S.Class<EcsTaskDetails>("EcsTaskDetails")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  DefinitionArn: S.optional(S.String).pipe(T.JsonName("definitionArn")),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
  TaskCreatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("createdAt")),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("startedAt"),
  ),
  StartedBy: S.optional(S.String).pipe(T.JsonName("startedBy")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Volumes: S.optional(Volumes).pipe(T.JsonName("volumes")),
  Containers: S.optional(Containers).pipe(T.JsonName("containers")),
  Group: S.optional(S.String).pipe(T.JsonName("group")),
  LaunchType: S.optional(S.String).pipe(T.JsonName("launchType")),
}) {}
export class SecurityGroup extends S.Class<SecurityGroup>("SecurityGroup")({
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  GroupName: S.optional(S.String).pipe(T.JsonName("groupName")),
}) {}
export const SecurityGroups = S.Array(SecurityGroup);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  SubnetIds: S.optional(SubnetIds).pipe(T.JsonName("subnetIds")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  SecurityGroups: S.optional(SecurityGroups).pipe(T.JsonName("securityGroups")),
}) {}
export class DnsRequestAction extends S.Class<DnsRequestAction>(
  "DnsRequestAction",
)({
  Domain: S.optional(S.String).pipe(T.JsonName("domain")),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
  Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
  DomainWithSuffix: S.optional(S.String).pipe(T.JsonName("domainWithSuffix")),
  VpcOwnerAccountId: S.optional(S.String).pipe(T.JsonName("vpcOwnerAccountId")),
}) {}
export class City extends S.Class<City>("City")({
  CityName: S.optional(S.String).pipe(T.JsonName("cityName")),
}) {}
export class Country extends S.Class<Country>("Country")({
  CountryCode: S.optional(S.String).pipe(T.JsonName("countryCode")),
  CountryName: S.optional(S.String).pipe(T.JsonName("countryName")),
}) {}
export class GeoLocation extends S.Class<GeoLocation>("GeoLocation")({
  Lat: S.optional(S.Number).pipe(T.JsonName("lat")),
  Lon: S.optional(S.Number).pipe(T.JsonName("lon")),
}) {}
export class Organization extends S.Class<Organization>("Organization")({
  Asn: S.optional(S.String).pipe(T.JsonName("asn")),
  AsnOrg: S.optional(S.String).pipe(T.JsonName("asnOrg")),
  Isp: S.optional(S.String).pipe(T.JsonName("isp")),
  Org: S.optional(S.String).pipe(T.JsonName("org")),
}) {}
export class RemoteIpDetails extends S.Class<RemoteIpDetails>(
  "RemoteIpDetails",
)({
  City: S.optional(City).pipe(T.JsonName("city")),
  Country: S.optional(Country).pipe(T.JsonName("country")),
  GeoLocation: S.optional(GeoLocation).pipe(T.JsonName("geoLocation")),
  IpAddressV4: S.optional(S.String).pipe(T.JsonName("ipAddressV4")),
  IpAddressV6: S.optional(S.String).pipe(T.JsonName("ipAddressV6")),
  Organization: S.optional(Organization).pipe(T.JsonName("organization")),
}) {}
export class KubernetesApiCallAction extends S.Class<KubernetesApiCallAction>(
  "KubernetesApiCallAction",
)({
  RequestUri: S.optional(S.String).pipe(T.JsonName("requestUri")),
  Verb: S.optional(S.String).pipe(T.JsonName("verb")),
  SourceIps: S.optional(SourceIps).pipe(T.JsonName("sourceIPs")),
  UserAgent: S.optional(S.String).pipe(T.JsonName("userAgent")),
  RemoteIpDetails: S.optional(RemoteIpDetails).pipe(
    T.JsonName("remoteIpDetails"),
  ),
  StatusCode: S.optional(S.Number).pipe(T.JsonName("statusCode")),
  Parameters: S.optional(S.String).pipe(T.JsonName("parameters")),
  Resource: S.optional(S.String).pipe(T.JsonName("resource")),
  Subresource: S.optional(S.String).pipe(T.JsonName("subresource")),
  Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
  ResourceName: S.optional(S.String).pipe(T.JsonName("resourceName")),
}) {}
export class KubernetesPermissionCheckedDetails extends S.Class<KubernetesPermissionCheckedDetails>(
  "KubernetesPermissionCheckedDetails",
)({
  Verb: S.optional(S.String).pipe(T.JsonName("verb")),
  Resource: S.optional(S.String).pipe(T.JsonName("resource")),
  Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
  Allowed: S.optional(S.Boolean).pipe(T.JsonName("allowed")),
}) {}
export class KubernetesRoleBindingDetails extends S.Class<KubernetesRoleBindingDetails>(
  "KubernetesRoleBindingDetails",
)({
  Kind: S.optional(S.String).pipe(T.JsonName("kind")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Uid: S.optional(S.String).pipe(T.JsonName("uid")),
  RoleRefName: S.optional(S.String).pipe(T.JsonName("roleRefName")),
  RoleRefKind: S.optional(S.String).pipe(T.JsonName("roleRefKind")),
}) {}
export class KubernetesRoleDetails extends S.Class<KubernetesRoleDetails>(
  "KubernetesRoleDetails",
)({
  Kind: S.optional(S.String).pipe(T.JsonName("kind")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Uid: S.optional(S.String).pipe(T.JsonName("uid")),
}) {}
export class ThreatIntelligenceDetail extends S.Class<ThreatIntelligenceDetail>(
  "ThreatIntelligenceDetail",
)({
  ThreatListName: S.optional(S.String).pipe(T.JsonName("threatListName")),
  ThreatNames: S.optional(ThreatNames).pipe(T.JsonName("threatNames")),
  ThreatFileSha256: S.optional(S.String).pipe(T.JsonName("threatFileSha256")),
}) {}
export const ThreatIntelligenceDetails = S.Array(ThreatIntelligenceDetail);
export class LineageObject extends S.Class<LineageObject>("LineageObject")({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("startTime"),
  ),
  NamespacePid: S.optional(S.Number).pipe(T.JsonName("namespacePid")),
  UserId: S.optional(S.Number).pipe(T.JsonName("userId")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
  Uuid: S.optional(S.String).pipe(T.JsonName("uuid")),
  ExecutablePath: S.optional(S.String).pipe(T.JsonName("executablePath")),
  Euid: S.optional(S.Number).pipe(T.JsonName("euid")),
  ParentUuid: S.optional(S.String).pipe(T.JsonName("parentUuid")),
}) {}
export const Lineage = S.Array(LineageObject);
export class ProcessDetails extends S.Class<ProcessDetails>("ProcessDetails")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  ExecutablePath: S.optional(S.String).pipe(T.JsonName("executablePath")),
  ExecutableSha256: S.optional(S.String).pipe(T.JsonName("executableSha256")),
  NamespacePid: S.optional(S.Number).pipe(T.JsonName("namespacePid")),
  Pwd: S.optional(S.String).pipe(T.JsonName("pwd")),
  Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("startTime"),
  ),
  Uuid: S.optional(S.String).pipe(T.JsonName("uuid")),
  ParentUuid: S.optional(S.String).pipe(T.JsonName("parentUuid")),
  User: S.optional(S.String).pipe(T.JsonName("user")),
  UserId: S.optional(S.Number).pipe(T.JsonName("userId")),
  Euid: S.optional(S.Number).pipe(T.JsonName("euid")),
  Lineage: S.optional(Lineage).pipe(T.JsonName("lineage")),
}) {}
export class RuntimeContext extends S.Class<RuntimeContext>("RuntimeContext")({
  ModifyingProcess: S.optional(ProcessDetails).pipe(
    T.JsonName("modifyingProcess"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  ScriptPath: S.optional(S.String).pipe(T.JsonName("scriptPath")),
  LibraryPath: S.optional(S.String).pipe(T.JsonName("libraryPath")),
  LdPreloadValue: S.optional(S.String).pipe(T.JsonName("ldPreloadValue")),
  SocketPath: S.optional(S.String).pipe(T.JsonName("socketPath")),
  RuncBinaryPath: S.optional(S.String).pipe(T.JsonName("runcBinaryPath")),
  ReleaseAgentPath: S.optional(S.String).pipe(T.JsonName("releaseAgentPath")),
  MountSource: S.optional(S.String).pipe(T.JsonName("mountSource")),
  MountTarget: S.optional(S.String).pipe(T.JsonName("mountTarget")),
  FileSystemType: S.optional(S.String).pipe(T.JsonName("fileSystemType")),
  Flags: S.optional(FlagsList).pipe(T.JsonName("flags")),
  ModuleName: S.optional(S.String).pipe(T.JsonName("moduleName")),
  ModuleFilePath: S.optional(S.String).pipe(T.JsonName("moduleFilePath")),
  ModuleSha256: S.optional(S.String).pipe(T.JsonName("moduleSha256")),
  ShellHistoryFilePath: S.optional(S.String).pipe(
    T.JsonName("shellHistoryFilePath"),
  ),
  TargetProcess: S.optional(ProcessDetails).pipe(T.JsonName("targetProcess")),
  AddressFamily: S.optional(S.String).pipe(T.JsonName("addressFamily")),
  IanaProtocolNumber: S.optional(S.Number).pipe(
    T.JsonName("ianaProtocolNumber"),
  ),
  MemoryRegions: S.optional(MemoryRegionsList).pipe(
    T.JsonName("memoryRegions"),
  ),
  ToolName: S.optional(S.String).pipe(T.JsonName("toolName")),
  ToolCategory: S.optional(S.String).pipe(T.JsonName("toolCategory")),
  ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  CommandLineExample: S.optional(S.String).pipe(
    T.JsonName("commandLineExample"),
  ),
  ThreatFilePath: S.optional(S.String).pipe(T.JsonName("threatFilePath")),
}) {}
export class MalwareProtectionFindingsScanConfiguration extends S.Class<MalwareProtectionFindingsScanConfiguration>(
  "MalwareProtectionFindingsScanConfiguration",
)({
  TriggerType: S.optional(S.String).pipe(T.JsonName("triggerType")),
  IncrementalScanDetails: S.optional(IncrementalScanDetails).pipe(
    T.JsonName("incrementalScanDetails"),
  ),
}) {}
export class AdditionalInfo extends S.Class<AdditionalInfo>("AdditionalInfo")({
  VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
  DeviceName: S.optional(S.String).pipe(T.JsonName("deviceName")),
}) {}
export const ResourceUids = S.Array(S.String);
export const ActorIds = S.Array(S.String);
export const EndpointIds = S.Array(S.String);
export const IndicatorValues = S.Array(S.String);
export class ScannedResource extends S.Class<ScannedResource>(
  "ScannedResource",
)({
  ScannedResourceArn: S.optional(S.String).pipe(
    T.JsonName("scannedResourceArn"),
  ),
  ScannedResourceType: S.optional(S.String).pipe(
    T.JsonName("scannedResourceType"),
  ),
  ScannedResourceStatus: S.optional(S.String).pipe(
    T.JsonName("scannedResourceStatus"),
  ),
  ScanStatusReason: S.optional(S.String).pipe(T.JsonName("scanStatusReason")),
  ResourceDetails: S.optional(ScannedResourceDetails).pipe(
    T.JsonName("resourceDetails"),
  ),
}) {}
export const ScannedResources = S.Array(ScannedResource);
export class ScanEc2InstanceWithFindingsResult extends S.Class<ScanEc2InstanceWithFindingsResult>(
  "ScanEc2InstanceWithFindingsResult",
)({
  EbsVolumes: S.optional(EbsVolumesResult).pipe(T.JsonName("ebsVolumes")),
}) {}
export class MalwareProtectionConfigurationResult extends S.Class<MalwareProtectionConfigurationResult>(
  "MalwareProtectionConfigurationResult",
)({
  ScanEc2InstanceWithFindings: S.optional(
    ScanEc2InstanceWithFindingsResult,
  ).pipe(T.JsonName("scanEc2InstanceWithFindings")),
  ServiceRole: S.optional(S.String).pipe(T.JsonName("serviceRole")),
}) {}
export class DataSourceConfigurationsResult extends S.Class<DataSourceConfigurationsResult>(
  "DataSourceConfigurationsResult",
)({
  CloudTrail: CloudTrailConfigurationResult.pipe(T.JsonName("cloudTrail")),
  DNSLogs: DNSLogsConfigurationResult.pipe(T.JsonName("dnsLogs")),
  FlowLogs: FlowLogsConfigurationResult.pipe(T.JsonName("flowLogs")),
  S3Logs: S3LogsConfigurationResult.pipe(T.JsonName("s3Logs")),
  Kubernetes: S.optional(KubernetesConfigurationResult).pipe(
    T.JsonName("kubernetes"),
  ),
  MalwareProtection: S.optional(MalwareProtectionConfigurationResult).pipe(
    T.JsonName("malwareProtection"),
  ),
}) {}
export class MemberDataSourceConfiguration extends S.Class<MemberDataSourceConfiguration>(
  "MemberDataSourceConfiguration",
)({
  AccountId: S.String.pipe(T.JsonName("accountId")),
  DataSources: S.optional(DataSourceConfigurationsResult).pipe(
    T.JsonName("dataSources"),
  ),
  Features: S.optional(MemberFeaturesConfigurationsResults).pipe(
    T.JsonName("features"),
  ),
}) {}
export const MemberDataSourceConfigurations = S.Array(
  MemberDataSourceConfiguration,
);
export class OrganizationDetails extends S.Class<OrganizationDetails>(
  "OrganizationDetails",
)({
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
  OrganizationStatistics: S.optional(OrganizationStatistics).pipe(
    T.JsonName("organizationStatistics"),
  ),
}) {}
export class AccountFreeTrialInfo extends S.Class<AccountFreeTrialInfo>(
  "AccountFreeTrialInfo",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  DataSources: S.optional(DataSourcesFreeTrial).pipe(T.JsonName("dataSources")),
  Features: S.optional(FreeTrialFeatureConfigurationsResults).pipe(
    T.JsonName("features"),
  ),
}) {}
export const AccountFreeTrialInfos = S.Array(AccountFreeTrialInfo);
export class MalwareScan extends S.Class<MalwareScan>("MalwareScan")({
  ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
  ScanStatus: S.optional(S.String).pipe(T.JsonName("scanStatus")),
  ScanResultStatus: S.optional(S.String).pipe(T.JsonName("scanResultStatus")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  ScanStartedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanStartedAt")),
  ScanCompletedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanCompletedAt")),
}) {}
export const MalwareScans = S.Array(MalwareScan);
export class OrganizationDataSourceConfigurations extends S.Class<OrganizationDataSourceConfigurations>(
  "OrganizationDataSourceConfigurations",
)({
  S3Logs: S.optional(OrganizationS3LogsConfiguration).pipe(
    T.JsonName("s3Logs"),
  ),
  Kubernetes: S.optional(OrganizationKubernetesConfiguration).pipe(
    T.JsonName("kubernetes"),
  ),
  MalwareProtection: S.optional(
    OrganizationMalwareProtectionConfiguration,
  ).pipe(T.JsonName("malwareProtection")),
}) {}
export class OrganizationScanEc2InstanceWithFindingsResult extends S.Class<OrganizationScanEc2InstanceWithFindingsResult>(
  "OrganizationScanEc2InstanceWithFindingsResult",
)({
  EbsVolumes: S.optional(OrganizationEbsVolumesResult).pipe(
    T.JsonName("ebsVolumes"),
  ),
}) {}
export class EcsClusterDetails extends S.Class<EcsClusterDetails>(
  "EcsClusterDetails",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  ActiveServicesCount: S.optional(S.Number).pipe(
    T.JsonName("activeServicesCount"),
  ),
  RegisteredContainerInstancesCount: S.optional(S.Number).pipe(
    T.JsonName("registeredContainerInstancesCount"),
  ),
  RunningTasksCount: S.optional(S.Number).pipe(T.JsonName("runningTasksCount")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  TaskDetails: S.optional(EcsTaskDetails).pipe(T.JsonName("taskDetails")),
}) {}
export class LambdaDetails extends S.Class<LambdaDetails>("LambdaDetails")({
  FunctionArn: S.optional(S.String).pipe(T.JsonName("functionArn")),
  FunctionName: S.optional(S.String).pipe(T.JsonName("functionName")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  LastModifiedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("lastModifiedAt")),
  RevisionId: S.optional(S.String).pipe(T.JsonName("revisionId")),
  FunctionVersion: S.optional(S.String).pipe(T.JsonName("functionVersion")),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  VpcConfig: S.optional(VpcConfig).pipe(T.JsonName("vpcConfig")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class Evidence extends S.Class<Evidence>("Evidence")({
  ThreatIntelligenceDetails: S.optional(ThreatIntelligenceDetails).pipe(
    T.JsonName("threatIntelligenceDetails"),
  ),
}) {}
export class ItemDetails extends S.Class<ItemDetails>("ItemDetails")({
  ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
  ItemPath: S.optional(S.String).pipe(T.JsonName("itemPath")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  AdditionalInfo: S.optional(AdditionalInfo).pipe(T.JsonName("additionalInfo")),
}) {}
export const ItemDetailsList = S.Array(ItemDetails);
export class UsageTopAccountResult extends S.Class<UsageTopAccountResult>(
  "UsageTopAccountResult",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  Total: S.optional(Total).pipe(T.JsonName("total")),
}) {}
export const UsageTopAccountsByFeatureList = S.Array(UsageTopAccountResult);
export class CreateFilterResponse extends S.Class<CreateFilterResponse>(
  "CreateFilterResponse",
)({ Name: S.String.pipe(T.JsonName("name")) }) {}
export class PrivateIpAddressDetails extends S.Class<PrivateIpAddressDetails>(
  "PrivateIpAddressDetails",
)({
  PrivateDnsName: S.optional(S.String).pipe(T.JsonName("privateDnsName")),
  PrivateIpAddress: S.optional(S.String).pipe(T.JsonName("privateIpAddress")),
}) {}
export const PrivateIpAddresses = S.Array(PrivateIpAddressDetails);
export class ImpersonatedUser extends S.Class<ImpersonatedUser>(
  "ImpersonatedUser",
)({
  Username: S.optional(S.String).pipe(T.JsonName("username")),
  Groups: S.optional(Groups).pipe(T.JsonName("groups")),
}) {}
export class DomainDetails extends S.Class<DomainDetails>("DomainDetails")({
  Domain: S.optional(S.String).pipe(T.JsonName("domain")),
}) {}
export class RemoteAccountDetails extends S.Class<RemoteAccountDetails>(
  "RemoteAccountDetails",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  Affiliated: S.optional(S.Boolean).pipe(T.JsonName("affiliated")),
}) {}
export const AffectedResources = S.Record({ key: S.String, value: S.String });
export class LocalPortDetails extends S.Class<LocalPortDetails>(
  "LocalPortDetails",
)({
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  PortName: S.optional(S.String).pipe(T.JsonName("portName")),
}) {}
export class LocalIpDetails extends S.Class<LocalIpDetails>("LocalIpDetails")({
  IpAddressV4: S.optional(S.String).pipe(T.JsonName("ipAddressV4")),
  IpAddressV6: S.optional(S.String).pipe(T.JsonName("ipAddressV6")),
}) {}
export class RemotePortDetails extends S.Class<RemotePortDetails>(
  "RemotePortDetails",
)({
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  PortName: S.optional(S.String).pipe(T.JsonName("portName")),
}) {}
export class PortProbeDetail extends S.Class<PortProbeDetail>(
  "PortProbeDetail",
)({
  LocalPortDetails: S.optional(LocalPortDetails).pipe(
    T.JsonName("localPortDetails"),
  ),
  LocalIpDetails: S.optional(LocalIpDetails).pipe(T.JsonName("localIpDetails")),
  RemoteIpDetails: S.optional(RemoteIpDetails).pipe(
    T.JsonName("remoteIpDetails"),
  ),
}) {}
export const PortProbeDetails = S.Array(PortProbeDetail);
export class LoginAttribute extends S.Class<LoginAttribute>("LoginAttribute")({
  User: S.optional(S.String).pipe(T.JsonName("user")),
  Application: S.optional(S.String).pipe(T.JsonName("application")),
  FailedLoginAttempts: S.optional(S.Number).pipe(
    T.JsonName("failedLoginAttempts"),
  ),
  SuccessfulLoginAttempts: S.optional(S.Number).pipe(
    T.JsonName("successfulLoginAttempts"),
  ),
}) {}
export const LoginAttributes = S.Array(LoginAttribute);
export class ScannedItemCount extends S.Class<ScannedItemCount>(
  "ScannedItemCount",
)({
  TotalGb: S.optional(S.Number).pipe(T.JsonName("totalGb")),
  Files: S.optional(S.Number).pipe(T.JsonName("files")),
  Volumes: S.optional(S.Number).pipe(T.JsonName("volumes")),
}) {}
export class ThreatsDetectedItemCount extends S.Class<ThreatsDetectedItemCount>(
  "ThreatsDetectedItemCount",
)({ Files: S.optional(S.Number).pipe(T.JsonName("files")) }) {}
export class HighestSeverityThreatDetails extends S.Class<HighestSeverityThreatDetails>(
  "HighestSeverityThreatDetails",
)({
  Severity: S.optional(S.String).pipe(T.JsonName("severity")),
  ThreatName: S.optional(S.String).pipe(T.JsonName("threatName")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
}) {}
export class Indicator extends S.Class<Indicator>("Indicator")({
  Key: S.String.pipe(T.JsonName("key")),
  Values: S.optional(IndicatorValues).pipe(T.JsonName("values")),
  Title: S.optional(S.String).pipe(T.JsonName("title")),
}) {}
export const Indicators = S.Array(Indicator);
export class Signal extends S.Class<Signal>("Signal")({
  Uid: S.String.pipe(T.JsonName("uid")),
  Type: S.String.pipe(T.JsonName("type")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Name: S.String.pipe(T.JsonName("name")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
    T.JsonName("createdAt"),
  ),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
    T.JsonName("updatedAt"),
  ),
  FirstSeenAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
    T.JsonName("firstSeenAt"),
  ),
  LastSeenAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
    T.JsonName("lastSeenAt"),
  ),
  Severity: S.optional(S.Number).pipe(T.JsonName("severity")),
  Count: S.Number.pipe(T.JsonName("count")),
  ResourceUids: S.optional(ResourceUids).pipe(T.JsonName("resourceUids")),
  ActorIds: S.optional(ActorIds).pipe(T.JsonName("actorIds")),
  EndpointIds: S.optional(EndpointIds).pipe(T.JsonName("endpointIds")),
  SignalIndicators: S.optional(Indicators).pipe(T.JsonName("signalIndicators")),
}) {}
export const Signals = S.Array(Signal);
export class ItemPath extends S.Class<ItemPath>("ItemPath")({
  NestedItemPath: S.optional(S.String).pipe(T.JsonName("nestedItemPath")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
}) {}
export const ItemPaths = S.Array(ItemPath);
export class GetMemberDetectorsResponse extends S.Class<GetMemberDetectorsResponse>(
  "GetMemberDetectorsResponse",
)({
  MemberDataSourceConfigurations: MemberDataSourceConfigurations.pipe(
    T.JsonName("members"),
  ),
  UnprocessedAccounts: UnprocessedAccounts.pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class GetOrganizationStatisticsResponse extends S.Class<GetOrganizationStatisticsResponse>(
  "GetOrganizationStatisticsResponse",
)({
  OrganizationDetails: S.optional(OrganizationDetails).pipe(
    T.JsonName("organizationDetails"),
  ),
}) {}
export class GetRemainingFreeTrialDaysResponse extends S.Class<GetRemainingFreeTrialDaysResponse>(
  "GetRemainingFreeTrialDaysResponse",
)({
  Accounts: S.optional(AccountFreeTrialInfos).pipe(T.JsonName("accounts")),
  UnprocessedAccounts: S.optional(UnprocessedAccounts).pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export const Issues = S.Array(S.String);
export class ListMalwareScansResponse extends S.Class<ListMalwareScansResponse>(
  "ListMalwareScansResponse",
)({
  Scans: MalwareScans.pipe(T.JsonName("scans")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateMalwareScanSettingsRequest extends S.Class<UpdateMalwareScanSettingsRequest>(
  "UpdateMalwareScanSettingsRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    ScanResourceCriteria: S.optional(ScanResourceCriteria).pipe(
      T.JsonName("scanResourceCriteria"),
    ),
    EbsSnapshotPreservation: S.optional(S.String).pipe(
      T.JsonName("ebsSnapshotPreservation"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/detector/{DetectorId}/malware-scan-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMalwareScanSettingsResponse extends S.Class<UpdateMalwareScanSettingsResponse>(
  "UpdateMalwareScanSettingsResponse",
)({}) {}
export class UpdateOrganizationConfigurationRequest extends S.Class<UpdateOrganizationConfigurationRequest>(
  "UpdateOrganizationConfigurationRequest",
)(
  {
    DetectorId: S.String.pipe(
      T.HttpLabel("DetectorId"),
      T.JsonName("detectorId"),
    ),
    AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
    DataSources: S.optional(OrganizationDataSourceConfigurations).pipe(
      T.JsonName("dataSources"),
    ),
    Features: S.optional(OrganizationFeaturesConfigurations).pipe(
      T.JsonName("features"),
    ),
    AutoEnableOrganizationMembers: S.optional(S.String).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/detector/{DetectorId}/admin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrganizationConfigurationResponse extends S.Class<UpdateOrganizationConfigurationResponse>(
  "UpdateOrganizationConfigurationResponse",
)({}) {}
export class OrganizationMalwareProtectionConfigurationResult extends S.Class<OrganizationMalwareProtectionConfigurationResult>(
  "OrganizationMalwareProtectionConfigurationResult",
)({
  ScanEc2InstanceWithFindings: S.optional(
    OrganizationScanEc2InstanceWithFindingsResult,
  ).pipe(T.JsonName("scanEc2InstanceWithFindings")),
}) {}
export class ScanResultThreat extends S.Class<ScanResultThreat>(
  "ScanResultThreat",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Source: S.optional(S.String).pipe(T.JsonName("source")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  ItemDetails: S.optional(ItemDetailsList).pipe(T.JsonName("itemDetails")),
}) {}
export const ScanResultThreats = S.Array(ScanResultThreat);
export class UsageAccountResult extends S.Class<UsageAccountResult>(
  "UsageAccountResult",
)({
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  Total: S.optional(Total).pipe(T.JsonName("total")),
}) {}
export const UsageAccountResultList = S.Array(UsageAccountResult);
export class UsageTopAccountsResult extends S.Class<UsageTopAccountsResult>(
  "UsageTopAccountsResult",
)({
  Feature: S.optional(S.String).pipe(T.JsonName("feature")),
  Accounts: S.optional(UsageTopAccountsByFeatureList).pipe(
    T.JsonName("accounts"),
  ),
}) {}
export const UsageTopAccountsResultList = S.Array(UsageTopAccountsResult);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  Ipv6Addresses: S.optional(Ipv6Addresses).pipe(T.JsonName("ipv6Addresses")),
  NetworkInterfaceId: S.optional(S.String).pipe(
    T.JsonName("networkInterfaceId"),
  ),
  PrivateDnsName: S.optional(S.String).pipe(T.JsonName("privateDnsName")),
  PrivateIpAddress: S.optional(S.String).pipe(T.JsonName("privateIpAddress")),
  PrivateIpAddresses: S.optional(PrivateIpAddresses).pipe(
    T.JsonName("privateIpAddresses"),
  ),
  PublicDnsName: S.optional(S.String).pipe(T.JsonName("publicDnsName")),
  PublicIp: S.optional(S.String).pipe(T.JsonName("publicIp")),
  SecurityGroups: S.optional(SecurityGroups).pipe(T.JsonName("securityGroups")),
  SubnetId: S.optional(S.String).pipe(T.JsonName("subnetId")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
}) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class KubernetesUserDetails extends S.Class<KubernetesUserDetails>(
  "KubernetesUserDetails",
)({
  Username: S.optional(S.String).pipe(T.JsonName("username")),
  Uid: S.optional(S.String).pipe(T.JsonName("uid")),
  Groups: S.optional(Groups).pipe(T.JsonName("groups")),
  SessionName: S.optional(SessionNameList).pipe(T.JsonName("sessionName")),
  ImpersonatedUser: S.optional(ImpersonatedUser).pipe(
    T.JsonName("impersonatedUser"),
  ),
}) {}
export class NetworkConnectionAction extends S.Class<NetworkConnectionAction>(
  "NetworkConnectionAction",
)({
  Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
  ConnectionDirection: S.optional(S.String).pipe(
    T.JsonName("connectionDirection"),
  ),
  LocalPortDetails: S.optional(LocalPortDetails).pipe(
    T.JsonName("localPortDetails"),
  ),
  Protocol: S.optional(S.String).pipe(T.JsonName("protocol")),
  LocalIpDetails: S.optional(LocalIpDetails).pipe(T.JsonName("localIpDetails")),
  LocalNetworkInterface: S.optional(S.String).pipe(
    T.JsonName("localNetworkInterface"),
  ),
  RemoteIpDetails: S.optional(RemoteIpDetails).pipe(
    T.JsonName("remoteIpDetails"),
  ),
  RemotePortDetails: S.optional(RemotePortDetails).pipe(
    T.JsonName("remotePortDetails"),
  ),
}) {}
export class PortProbeAction extends S.Class<PortProbeAction>(
  "PortProbeAction",
)({
  Blocked: S.optional(S.Boolean).pipe(T.JsonName("blocked")),
  PortProbeDetails: S.optional(PortProbeDetails).pipe(
    T.JsonName("portProbeDetails"),
  ),
}) {}
export class RdsLoginAttemptAction extends S.Class<RdsLoginAttemptAction>(
  "RdsLoginAttemptAction",
)({
  RemoteIpDetails: S.optional(RemoteIpDetails).pipe(
    T.JsonName("remoteIpDetails"),
  ),
  LoginAttributes: S.optional(LoginAttributes),
}) {}
export class Threat extends S.Class<Threat>("Threat")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Source: S.optional(S.String).pipe(T.JsonName("source")),
  ItemPaths: S.optional(ItemPaths).pipe(T.JsonName("itemPaths")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  ItemDetails: S.optional(ItemDetailsList).pipe(T.JsonName("itemDetails")),
}) {}
export const Threats = S.Array(Threat);
export class AddonDetails extends S.Class<AddonDetails>("AddonDetails")({
  AddonVersion: S.optional(S.String).pipe(T.JsonName("addonVersion")),
  AddonStatus: S.optional(S.String).pipe(T.JsonName("addonStatus")),
}) {}
export class FargateDetails extends S.Class<FargateDetails>("FargateDetails")({
  Issues: S.optional(Issues).pipe(T.JsonName("issues")),
  ManagementType: S.optional(S.String).pipe(T.JsonName("managementType")),
}) {}
export class ContainerInstanceDetails extends S.Class<ContainerInstanceDetails>(
  "ContainerInstanceDetails",
)({
  CoveredContainerInstances: S.optional(S.Number).pipe(
    T.JsonName("coveredContainerInstances"),
  ),
  CompatibleContainerInstances: S.optional(S.Number).pipe(
    T.JsonName("compatibleContainerInstances"),
  ),
}) {}
export class AgentDetails extends S.Class<AgentDetails>("AgentDetails")({
  Version: S.optional(S.String).pipe(T.JsonName("version")),
}) {}
export class UnprocessedDataSourcesResult extends S.Class<UnprocessedDataSourcesResult>(
  "UnprocessedDataSourcesResult",
)({
  MalwareProtection: S.optional(MalwareProtectionConfigurationResult).pipe(
    T.JsonName("malwareProtection"),
  ),
}) {}
export class OrganizationDataSourceConfigurationsResult extends S.Class<OrganizationDataSourceConfigurationsResult>(
  "OrganizationDataSourceConfigurationsResult",
)({
  S3Logs: OrganizationS3LogsConfigurationResult.pipe(T.JsonName("s3Logs")),
  Kubernetes: S.optional(OrganizationKubernetesConfigurationResult).pipe(
    T.JsonName("kubernetes"),
  ),
  MalwareProtection: S.optional(
    OrganizationMalwareProtectionConfigurationResult,
  ).pipe(T.JsonName("malwareProtection")),
}) {}
export class BlockPublicAccess extends S.Class<BlockPublicAccess>(
  "BlockPublicAccess",
)({
  IgnorePublicAcls: S.optional(S.Boolean).pipe(T.JsonName("ignorePublicAcls")),
  RestrictPublicBuckets: S.optional(S.Boolean).pipe(
    T.JsonName("restrictPublicBuckets"),
  ),
  BlockPublicAcls: S.optional(S.Boolean).pipe(T.JsonName("blockPublicAcls")),
  BlockPublicPolicy: S.optional(S.Boolean).pipe(
    T.JsonName("blockPublicPolicy"),
  ),
}) {}
export class AccountLevelPermissions extends S.Class<AccountLevelPermissions>(
  "AccountLevelPermissions",
)({
  BlockPublicAccess: S.optional(BlockPublicAccess).pipe(
    T.JsonName("blockPublicAccess"),
  ),
}) {}
export class Session extends S.Class<Session>("Session")({
  Uid: S.optional(S.String).pipe(T.JsonName("uid")),
  MfaStatus: S.optional(S.String).pipe(T.JsonName("mfaStatus")),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdTime"),
  ),
  Issuer: S.optional(S.String).pipe(T.JsonName("issuer")),
}) {}
export class ActorProcess extends S.Class<ActorProcess>("ActorProcess")({
  Name: S.String.pipe(T.JsonName("name")),
  Path: S.String.pipe(T.JsonName("path")),
  Sha256: S.optional(S.String).pipe(T.JsonName("sha256")),
}) {}
export class NetworkGeoLocation extends S.Class<NetworkGeoLocation>(
  "NetworkGeoLocation",
)({
  City: S.String.pipe(T.JsonName("city")),
  Country: S.String.pipe(T.JsonName("country")),
  Latitude: S.Number.pipe(T.JsonName("lat")),
  Longitude: S.Number.pipe(T.JsonName("lon")),
}) {}
export class AutonomousSystem extends S.Class<AutonomousSystem>(
  "AutonomousSystem",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Number: S.Number.pipe(T.JsonName("number")),
}) {}
export class NetworkConnection extends S.Class<NetworkConnection>(
  "NetworkConnection",
)({ Direction: S.String.pipe(T.JsonName("direction")) }) {}
export class GetMalwareScanResultDetails extends S.Class<GetMalwareScanResultDetails>(
  "GetMalwareScanResultDetails",
)({
  ScanResultStatus: S.optional(S.String).pipe(T.JsonName("scanResultStatus")),
  SkippedFileCount: S.optional(S.Number).pipe(T.JsonName("skippedFileCount")),
  FailedFileCount: S.optional(S.Number).pipe(T.JsonName("failedFileCount")),
  ThreatFoundFileCount: S.optional(S.Number).pipe(
    T.JsonName("threatFoundFileCount"),
  ),
  TotalFileCount: S.optional(S.Number).pipe(T.JsonName("totalFileCount")),
  TotalBytes: S.optional(S.Number).pipe(T.JsonName("totalBytes")),
  UniqueThreatCount: S.optional(S.Number).pipe(T.JsonName("uniqueThreatCount")),
  Threats: S.optional(ScanResultThreats).pipe(T.JsonName("threats")),
}) {}
export class UsageStatistics extends S.Class<UsageStatistics>(
  "UsageStatistics",
)({
  SumByAccount: S.optional(UsageAccountResultList).pipe(
    T.JsonName("sumByAccount"),
  ),
  TopAccountsByFeature: S.optional(UsageTopAccountsResultList).pipe(
    T.JsonName("topAccountsByFeature"),
  ),
  SumByDataSource: S.optional(UsageDataSourceResultList).pipe(
    T.JsonName("sumByDataSource"),
  ),
  SumByResource: S.optional(UsageResourceResultList).pipe(
    T.JsonName("sumByResource"),
  ),
  TopResources: S.optional(UsageResourceResultList).pipe(
    T.JsonName("topResources"),
  ),
  SumByFeature: S.optional(UsageFeatureResultList).pipe(
    T.JsonName("sumByFeature"),
  ),
}) {}
export class InstanceDetails extends S.Class<InstanceDetails>(
  "InstanceDetails",
)({
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  IamInstanceProfile: S.optional(IamInstanceProfile).pipe(
    T.JsonName("iamInstanceProfile"),
  ),
  ImageDescription: S.optional(S.String).pipe(T.JsonName("imageDescription")),
  ImageId: S.optional(S.String).pipe(T.JsonName("imageId")),
  InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
  InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
  InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
  OutpostArn: S.optional(S.String).pipe(T.JsonName("outpostArn")),
  LaunchTime: S.optional(S.String).pipe(T.JsonName("launchTime")),
  NetworkInterfaces: S.optional(NetworkInterfaces).pipe(
    T.JsonName("networkInterfaces"),
  ),
  Platform: S.optional(S.String).pipe(T.JsonName("platform")),
  ProductCodes: S.optional(ProductCodes).pipe(T.JsonName("productCodes")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class RuntimeDetails extends S.Class<RuntimeDetails>("RuntimeDetails")({
  Process: S.optional(ProcessDetails).pipe(T.JsonName("process")),
  Context: S.optional(RuntimeContext).pipe(T.JsonName("context")),
}) {}
export const S3ObjectUids = S.Array(S.String);
export const Ec2NetworkInterfaceUids = S.Array(S.String);
export const Ec2InstanceUids = S.Array(S.String);
export const ContainerUids = S.Array(S.String);
export class MalwareScanDetails extends S.Class<MalwareScanDetails>(
  "MalwareScanDetails",
)({
  Threats: S.optional(Threats).pipe(T.JsonName("threats")),
  ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  ScanCategory: S.optional(S.String).pipe(T.JsonName("scanCategory")),
  ScanConfiguration: S.optional(
    MalwareProtectionFindingsScanConfiguration,
  ).pipe(T.JsonName("scanConfiguration")),
  UniqueThreatCount: S.optional(S.Number).pipe(T.JsonName("uniqueThreatCount")),
}) {}
export class CoverageEksClusterDetails extends S.Class<CoverageEksClusterDetails>(
  "CoverageEksClusterDetails",
)({
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  CoveredNodes: S.optional(S.Number).pipe(T.JsonName("coveredNodes")),
  CompatibleNodes: S.optional(S.Number).pipe(T.JsonName("compatibleNodes")),
  AddonDetails: S.optional(AddonDetails).pipe(T.JsonName("addonDetails")),
  ManagementType: S.optional(S.String).pipe(T.JsonName("managementType")),
}) {}
export class CoverageEcsClusterDetails extends S.Class<CoverageEcsClusterDetails>(
  "CoverageEcsClusterDetails",
)({
  ClusterName: S.optional(S.String).pipe(T.JsonName("clusterName")),
  FargateDetails: S.optional(FargateDetails).pipe(T.JsonName("fargateDetails")),
  ContainerInstanceDetails: S.optional(ContainerInstanceDetails).pipe(
    T.JsonName("containerInstanceDetails"),
  ),
}) {}
export class CoverageEc2InstanceDetails extends S.Class<CoverageEc2InstanceDetails>(
  "CoverageEc2InstanceDetails",
)({
  InstanceId: S.optional(S.String).pipe(T.JsonName("instanceId")),
  InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
  ClusterArn: S.optional(S.String).pipe(T.JsonName("clusterArn")),
  AgentDetails: S.optional(AgentDetails).pipe(T.JsonName("agentDetails")),
  ManagementType: S.optional(S.String).pipe(T.JsonName("managementType")),
}) {}
export class CreateDetectorResponse extends S.Class<CreateDetectorResponse>(
  "CreateDetectorResponse",
)({
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  UnprocessedDataSources: S.optional(UnprocessedDataSourcesResult).pipe(
    T.JsonName("unprocessedDataSources"),
  ),
}) {}
export class DescribeOrganizationConfigurationResponse extends S.Class<DescribeOrganizationConfigurationResponse>(
  "DescribeOrganizationConfigurationResponse",
)({
  AutoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  MemberAccountLimitReached: S.Boolean.pipe(
    T.JsonName("memberAccountLimitReached"),
  ),
  DataSources: S.optional(OrganizationDataSourceConfigurationsResult).pipe(
    T.JsonName("dataSources"),
  ),
  Features: S.optional(OrganizationFeaturesConfigurationsResults).pipe(
    T.JsonName("features"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  AutoEnableOrganizationMembers: S.optional(S.String).pipe(
    T.JsonName("autoEnableOrganizationMembers"),
  ),
}) {}
export class GetDetectorResponse extends S.Class<GetDetectorResponse>(
  "GetDetectorResponse",
)({
  CreatedAt: S.optional(S.String).pipe(T.JsonName("createdAt")),
  FindingPublishingFrequency: S.optional(S.String).pipe(
    T.JsonName("findingPublishingFrequency"),
  ),
  ServiceRole: S.String.pipe(T.JsonName("serviceRole")),
  Status: S.String.pipe(T.JsonName("status")),
  UpdatedAt: S.optional(S.String).pipe(T.JsonName("updatedAt")),
  DataSources: S.optional(DataSourceConfigurationsResult).pipe(
    T.JsonName("dataSources"),
  ),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  Features: S.optional(DetectorFeatureConfigurationsResults).pipe(
    T.JsonName("features"),
  ),
}) {}
export class NetworkEndpoint extends S.Class<NetworkEndpoint>(
  "NetworkEndpoint",
)({
  Id: S.String.pipe(T.JsonName("id")),
  Ip: S.optional(S.String).pipe(T.JsonName("ip")),
  Domain: S.optional(S.String).pipe(T.JsonName("domain")),
  Port: S.optional(S.Number).pipe(T.JsonName("port")),
  Location: S.optional(NetworkGeoLocation).pipe(T.JsonName("location")),
  AutonomousSystem: S.optional(AutonomousSystem).pipe(
    T.JsonName("autonomousSystem"),
  ),
  Connection: S.optional(NetworkConnection).pipe(T.JsonName("connection")),
}) {}
export const NetworkEndpoints = S.Array(NetworkEndpoint);
export class GetMalwareScanResponse extends S.Class<GetMalwareScanResponse>(
  "GetMalwareScanResponse",
)({
  ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  AdminDetectorId: S.optional(S.String).pipe(T.JsonName("adminDetectorId")),
  ResourceArn: S.optional(S.String).pipe(T.JsonName("resourceArn")),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  ScannedResourcesCount: S.optional(S.Number).pipe(
    T.JsonName("scannedResourcesCount"),
  ),
  SkippedResourcesCount: S.optional(S.Number).pipe(
    T.JsonName("skippedResourcesCount"),
  ),
  FailedResourcesCount: S.optional(S.Number).pipe(
    T.JsonName("failedResourcesCount"),
  ),
  ScannedResources: S.optional(ScannedResources).pipe(
    T.JsonName("scannedResources"),
  ),
  ScanConfiguration: S.optional(ScanConfiguration).pipe(
    T.JsonName("scanConfiguration"),
  ),
  ScanCategory: S.optional(S.String).pipe(T.JsonName("scanCategory")),
  ScanStatus: S.optional(S.String).pipe(T.JsonName("scanStatus")),
  ScanStatusReason: S.optional(S.String).pipe(T.JsonName("scanStatusReason")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  ScanStartedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanStartedAt")),
  ScanCompletedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanCompletedAt")),
  ScanResultDetails: S.optional(GetMalwareScanResultDetails).pipe(
    T.JsonName("scanResultDetails"),
  ),
}) {}
export class GetUsageStatisticsResponse extends S.Class<GetUsageStatisticsResponse>(
  "GetUsageStatisticsResponse",
)({
  UsageStatistics: S.optional(UsageStatistics).pipe(
    T.JsonName("usageStatistics"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({ InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")) }) {}
export class ScanResultDetails extends S.Class<ScanResultDetails>(
  "ScanResultDetails",
)({ ScanResult: S.optional(S.String).pipe(T.JsonName("scanResult")) }) {}
export const CountByResourceType = S.Record({ key: S.String, value: S.Number });
export const CountByCoverageStatus = S.Record({
  key: S.String,
  value: S.Number,
});
export class AccessControlList extends S.Class<AccessControlList>(
  "AccessControlList",
)({
  AllowsPublicReadAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicReadAccess"),
  ),
  AllowsPublicWriteAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicWriteAccess"),
  ),
}) {}
export class BucketPolicy extends S.Class<BucketPolicy>("BucketPolicy")({
  AllowsPublicReadAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicReadAccess"),
  ),
  AllowsPublicWriteAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicWriteAccess"),
  ),
}) {}
export class ScanFilePath extends S.Class<ScanFilePath>("ScanFilePath")({
  FilePath: S.optional(S.String).pipe(T.JsonName("filePath")),
  VolumeArn: S.optional(S.String).pipe(T.JsonName("volumeArn")),
  Hash: S.optional(S.String).pipe(T.JsonName("hash")),
  FileName: S.optional(S.String).pipe(T.JsonName("fileName")),
}) {}
export const FilePaths = S.Array(ScanFilePath);
export const ObservationTexts = S.Array(S.String);
export class Observations extends S.Class<Observations>("Observations")({
  Text: S.optional(ObservationTexts).pipe(T.JsonName("text")),
}) {}
export class AnomalyObject extends S.Class<AnomalyObject>("AnomalyObject")({
  ProfileType: S.optional(S.String).pipe(T.JsonName("profileType")),
  ProfileSubtype: S.optional(S.String).pipe(T.JsonName("profileSubtype")),
  Observations: S.optional(Observations).pipe(T.JsonName("observations")),
}) {}
export const AnomalyUnusualBehaviorFeature = S.Record({
  key: S.String,
  value: AnomalyObject,
});
export class Account extends S.Class<Account>("Account")({
  Uid: S.String.pipe(T.JsonName("uid")),
  Name: S.optional(S.String).pipe(T.JsonName("account")),
}) {}
export class Ec2Instance extends S.Class<Ec2Instance>("Ec2Instance")({
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  ImageDescription: S.optional(S.String).pipe(T.JsonName("imageDescription")),
  InstanceState: S.optional(S.String).pipe(T.JsonName("instanceState")),
  IamInstanceProfile: S.optional(IamInstanceProfile),
  InstanceType: S.optional(S.String).pipe(T.JsonName("instanceType")),
  OutpostArn: S.optional(S.String).pipe(T.JsonName("outpostArn")),
  Platform: S.optional(S.String).pipe(T.JsonName("platform")),
  ProductCodes: S.optional(ProductCodes).pipe(T.JsonName("productCodes")),
  Ec2NetworkInterfaceUids: S.optional(Ec2NetworkInterfaceUids).pipe(
    T.JsonName("ec2NetworkInterfaceUids"),
  ),
}) {}
export class AccessKey extends S.Class<AccessKey>("AccessKey")({
  PrincipalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  UserName: S.optional(S.String).pipe(T.JsonName("userName")),
  UserType: S.optional(S.String).pipe(T.JsonName("userType")),
}) {}
export class Ec2NetworkInterface extends S.Class<Ec2NetworkInterface>(
  "Ec2NetworkInterface",
)({
  Ipv6Addresses: S.optional(Ipv6Addresses).pipe(T.JsonName("ipv6Addresses")),
  PrivateIpAddresses: S.optional(PrivateIpAddresses).pipe(
    T.JsonName("privateIpAddresses"),
  ),
  PublicIp: S.optional(S.String).pipe(T.JsonName("publicIp")),
  SecurityGroups: S.optional(SecurityGroups).pipe(T.JsonName("securityGroups")),
  SubNetId: S.optional(S.String).pipe(T.JsonName("subNetId")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
}) {}
export class S3Object extends S.Class<S3Object>("S3Object")({
  ETag: S.optional(S.String).pipe(T.JsonName("eTag")),
  Key: S.optional(S.String).pipe(T.JsonName("key")),
  VersionId: S.optional(S.String).pipe(T.JsonName("versionId")),
}) {}
export class EksCluster extends S.Class<EksCluster>("EksCluster")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  VpcId: S.optional(S.String).pipe(T.JsonName("vpcId")),
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class KubernetesWorkload extends S.Class<KubernetesWorkload>(
  "KubernetesWorkload",
)({
  ContainerUids: S.optional(ContainerUids).pipe(T.JsonName("containerUids")),
  Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
  KubernetesResourcesTypes: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class ContainerFindingResource extends S.Class<ContainerFindingResource>(
  "ContainerFindingResource",
)({
  Image: S.String.pipe(T.JsonName("image")),
  ImageUid: S.optional(S.String).pipe(T.JsonName("imageUid")),
}) {}
export class EcsCluster extends S.Class<EcsCluster>("EcsCluster")({
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class EcsTask extends S.Class<EcsTask>("EcsTask")({
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  TaskDefinitionArn: S.optional(S.String).pipe(T.JsonName("taskDefinitionArn")),
  LaunchType: S.optional(S.String).pipe(T.JsonName("launchType")),
  ContainerUids: S.optional(ContainerUids).pipe(T.JsonName("containerUids")),
}) {}
export class IamInstanceProfileV2 extends S.Class<IamInstanceProfileV2>(
  "IamInstanceProfileV2",
)({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class AutoscalingAutoScalingGroup extends S.Class<AutoscalingAutoScalingGroup>(
  "AutoscalingAutoScalingGroup",
)({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class Ec2LaunchTemplate extends S.Class<Ec2LaunchTemplate>(
  "Ec2LaunchTemplate",
)({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
}) {}
export class Ec2Vpc extends S.Class<Ec2Vpc>("Ec2Vpc")({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class Ec2Image extends S.Class<Ec2Image>("Ec2Image")({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class CloudformationStack extends S.Class<CloudformationStack>(
  "CloudformationStack",
)({
  Ec2InstanceUids: S.optional(Ec2InstanceUids).pipe(
    T.JsonName("ec2InstanceUids"),
  ),
}) {}
export class CoverageResourceDetails extends S.Class<CoverageResourceDetails>(
  "CoverageResourceDetails",
)({
  EksClusterDetails: S.optional(CoverageEksClusterDetails).pipe(
    T.JsonName("eksClusterDetails"),
  ),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  EcsClusterDetails: S.optional(CoverageEcsClusterDetails).pipe(
    T.JsonName("ecsClusterDetails"),
  ),
  Ec2InstanceDetails: S.optional(CoverageEc2InstanceDetails).pipe(
    T.JsonName("ec2InstanceDetails"),
  ),
}) {}
export class KubernetesWorkloadDetails extends S.Class<KubernetesWorkloadDetails>(
  "KubernetesWorkloadDetails",
)({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  Uid: S.optional(S.String).pipe(T.JsonName("uid")),
  Namespace: S.optional(S.String).pipe(T.JsonName("namespace")),
  HostNetwork: S.optional(S.Boolean).pipe(T.JsonName("hostNetwork")),
  Containers: S.optional(Containers).pipe(T.JsonName("containers")),
  Volumes: S.optional(Volumes).pipe(T.JsonName("volumes")),
  ServiceAccountName: S.optional(S.String).pipe(
    T.JsonName("serviceAccountName"),
  ),
  HostIPC: S.optional(S.Boolean).pipe(T.JsonName("hostIPC")),
  HostPID: S.optional(S.Boolean).pipe(T.JsonName("hostPID")),
}) {}
export class AwsApiCallAction extends S.Class<AwsApiCallAction>(
  "AwsApiCallAction",
)({
  Api: S.optional(S.String).pipe(T.JsonName("api")),
  CallerType: S.optional(S.String).pipe(T.JsonName("callerType")),
  DomainDetails: S.optional(DomainDetails).pipe(T.JsonName("domainDetails")),
  ErrorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  UserAgent: S.optional(S.String).pipe(T.JsonName("userAgent")),
  RemoteIpDetails: S.optional(RemoteIpDetails).pipe(
    T.JsonName("remoteIpDetails"),
  ),
  ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  RemoteAccountDetails: S.optional(RemoteAccountDetails).pipe(
    T.JsonName("remoteAccountDetails"),
  ),
  AffectedResources: S.optional(AffectedResources).pipe(
    T.JsonName("affectedResources"),
  ),
}) {}
export class Scan extends S.Class<Scan>("Scan")({
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  AdminDetectorId: S.optional(S.String).pipe(T.JsonName("adminDetectorId")),
  ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
  ScanStatus: S.optional(S.String).pipe(T.JsonName("scanStatus")),
  FailureReason: S.optional(S.String).pipe(T.JsonName("failureReason")),
  ScanStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanStartTime")),
  ScanEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("scanEndTime"),
  ),
  TriggerDetails: S.optional(TriggerDetails).pipe(T.JsonName("triggerDetails")),
  ResourceDetails: S.optional(ResourceDetails).pipe(
    T.JsonName("resourceDetails"),
  ),
  ScanResultDetails: S.optional(ScanResultDetails).pipe(
    T.JsonName("scanResultDetails"),
  ),
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  TotalBytes: S.optional(S.Number).pipe(T.JsonName("totalBytes")),
  FileCount: S.optional(S.Number).pipe(T.JsonName("fileCount")),
  AttachedVolumes: S.optional(VolumeDetails).pipe(
    T.JsonName("attachedVolumes"),
  ),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
}) {}
export const Scans = S.Array(Scan);
export class CoverageStatistics extends S.Class<CoverageStatistics>(
  "CoverageStatistics",
)({
  CountByResourceType: S.optional(CountByResourceType).pipe(
    T.JsonName("countByResourceType"),
  ),
  CountByCoverageStatus: S.optional(CountByCoverageStatus).pipe(
    T.JsonName("countByCoverageStatus"),
  ),
}) {}
export class BucketLevelPermissions extends S.Class<BucketLevelPermissions>(
  "BucketLevelPermissions",
)({
  AccessControlList: S.optional(AccessControlList).pipe(
    T.JsonName("accessControlList"),
  ),
  BucketPolicy: S.optional(BucketPolicy).pipe(T.JsonName("bucketPolicy")),
  BlockPublicAccess: S.optional(BlockPublicAccess).pipe(
    T.JsonName("blockPublicAccess"),
  ),
}) {}
export class ScanThreatName extends S.Class<ScanThreatName>("ScanThreatName")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Severity: S.optional(S.String).pipe(T.JsonName("severity")),
  ItemCount: S.optional(S.Number).pipe(T.JsonName("itemCount")),
  FilePaths: S.optional(FilePaths).pipe(T.JsonName("filePaths")),
}) {}
export const ScanThreatNames = S.Array(ScanThreatName);
export const Behavior = S.Record({
  key: S.String,
  value: AnomalyUnusualBehaviorFeature,
});
export class User extends S.Class<User>("User")({
  Name: S.String.pipe(T.JsonName("name")),
  Uid: S.String.pipe(T.JsonName("uid")),
  Type: S.String.pipe(T.JsonName("type")),
  CredentialUid: S.optional(S.String).pipe(T.JsonName("credentialUid")),
  Account: S.optional(Account).pipe(T.JsonName("account")),
}) {}
export class CoverageResource extends S.Class<CoverageResource>(
  "CoverageResource",
)({
  ResourceId: S.optional(S.String).pipe(T.JsonName("resourceId")),
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  ResourceDetails: S.optional(CoverageResourceDetails).pipe(
    T.JsonName("resourceDetails"),
  ),
  CoverageStatus: S.optional(S.String).pipe(T.JsonName("coverageStatus")),
  Issue: S.optional(S.String).pipe(T.JsonName("issue")),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const CoverageResources = S.Array(CoverageResource);
export class KubernetesDetails extends S.Class<KubernetesDetails>(
  "KubernetesDetails",
)({
  KubernetesUserDetails: S.optional(KubernetesUserDetails).pipe(
    T.JsonName("kubernetesUserDetails"),
  ),
  KubernetesWorkloadDetails: S.optional(KubernetesWorkloadDetails).pipe(
    T.JsonName("kubernetesWorkloadDetails"),
  ),
}) {}
export class Action extends S.Class<Action>("Action")({
  ActionType: S.optional(S.String).pipe(T.JsonName("actionType")),
  AwsApiCallAction: S.optional(AwsApiCallAction).pipe(
    T.JsonName("awsApiCallAction"),
  ),
  DnsRequestAction: S.optional(DnsRequestAction).pipe(
    T.JsonName("dnsRequestAction"),
  ),
  NetworkConnectionAction: S.optional(NetworkConnectionAction).pipe(
    T.JsonName("networkConnectionAction"),
  ),
  PortProbeAction: S.optional(PortProbeAction).pipe(
    T.JsonName("portProbeAction"),
  ),
  KubernetesApiCallAction: S.optional(KubernetesApiCallAction).pipe(
    T.JsonName("kubernetesApiCallAction"),
  ),
  RdsLoginAttemptAction: S.optional(RdsLoginAttemptAction).pipe(
    T.JsonName("rdsLoginAttemptAction"),
  ),
  KubernetesPermissionCheckedDetails: S.optional(
    KubernetesPermissionCheckedDetails,
  ).pipe(T.JsonName("kubernetesPermissionCheckedDetails")),
  KubernetesRoleBindingDetails: S.optional(KubernetesRoleBindingDetails).pipe(
    T.JsonName("kubernetesRoleBindingDetails"),
  ),
  KubernetesRoleDetails: S.optional(KubernetesRoleDetails).pipe(
    T.JsonName("kubernetesRoleDetails"),
  ),
}) {}
export class PublicAccessConfiguration extends S.Class<PublicAccessConfiguration>(
  "PublicAccessConfiguration",
)({
  PublicAclAccess: S.optional(S.String).pipe(T.JsonName("publicAclAccess")),
  PublicPolicyAccess: S.optional(S.String).pipe(
    T.JsonName("publicPolicyAccess"),
  ),
  PublicAclIgnoreBehavior: S.optional(S.String).pipe(
    T.JsonName("publicAclIgnoreBehavior"),
  ),
  PublicBucketRestrictBehavior: S.optional(S.String).pipe(
    T.JsonName("publicBucketRestrictBehavior"),
  ),
}) {}
export class DescribeMalwareScansResponse extends S.Class<DescribeMalwareScansResponse>(
  "DescribeMalwareScansResponse",
)({
  Scans: Scans.pipe(T.JsonName("scans")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class GetCoverageStatisticsResponse extends S.Class<GetCoverageStatisticsResponse>(
  "GetCoverageStatisticsResponse",
)({
  CoverageStatistics: S.optional(CoverageStatistics).pipe(
    T.JsonName("coverageStatistics"),
  ),
}) {}
export class PermissionConfiguration extends S.Class<PermissionConfiguration>(
  "PermissionConfiguration",
)({
  BucketLevelPermissions: S.optional(BucketLevelPermissions).pipe(
    T.JsonName("bucketLevelPermissions"),
  ),
  AccountLevelPermissions: S.optional(AccountLevelPermissions).pipe(
    T.JsonName("accountLevelPermissions"),
  ),
}) {}
export class ThreatDetectedByName extends S.Class<ThreatDetectedByName>(
  "ThreatDetectedByName",
)({
  ItemCount: S.optional(S.Number).pipe(T.JsonName("itemCount")),
  UniqueThreatNameCount: S.optional(S.Number).pipe(
    T.JsonName("uniqueThreatNameCount"),
  ),
  Shortened: S.optional(S.Boolean).pipe(T.JsonName("shortened")),
  ThreatNames: S.optional(ScanThreatNames).pipe(T.JsonName("threatNames")),
}) {}
export class AnomalyUnusual extends S.Class<AnomalyUnusual>("AnomalyUnusual")({
  Behavior: S.optional(Behavior).pipe(T.JsonName("behavior")),
}) {}
export class Actor extends S.Class<Actor>("Actor")({
  Id: S.String.pipe(T.JsonName("id")),
  User: S.optional(User).pipe(T.JsonName("user")),
  Session: S.optional(Session).pipe(T.JsonName("session")),
  Process: S.optional(ActorProcess).pipe(T.JsonName("process")),
}) {}
export const Actors = S.Array(Actor);
export class ListCoverageResponse extends S.Class<ListCoverageResponse>(
  "ListCoverageResponse",
)({
  Resources: CoverageResources.pipe(T.JsonName("resources")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export const AnomalyProfileFeatureObjects = S.Array(AnomalyObject);
export class S3Bucket extends S.Class<S3Bucket>("S3Bucket")({
  OwnerId: S.optional(S.String).pipe(T.JsonName("ownerId")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  EncryptionKeyArn: S.optional(S.String).pipe(T.JsonName("encryptionKeyArn")),
  EffectivePermission: S.optional(S.String).pipe(
    T.JsonName("effectivePermission"),
  ),
  PublicReadAccess: S.optional(S.String).pipe(T.JsonName("publicReadAccess")),
  PublicWriteAccess: S.optional(S.String).pipe(T.JsonName("publicWriteAccess")),
  AccountPublicAccess: S.optional(PublicAccessConfiguration).pipe(
    T.JsonName("accountPublicAccess"),
  ),
  BucketPublicAccess: S.optional(PublicAccessConfiguration).pipe(
    T.JsonName("bucketPublicAccess"),
  ),
  S3ObjectUids: S.optional(S3ObjectUids).pipe(T.JsonName("s3ObjectUids")),
}) {}
export class PublicAccess extends S.Class<PublicAccess>("PublicAccess")({
  PermissionConfiguration: S.optional(PermissionConfiguration).pipe(
    T.JsonName("permissionConfiguration"),
  ),
  EffectivePermission: S.optional(S.String).pipe(
    T.JsonName("effectivePermission"),
  ),
}) {}
export class ScanDetections extends S.Class<ScanDetections>("ScanDetections")({
  ScannedItemCount: S.optional(ScannedItemCount).pipe(
    T.JsonName("scannedItemCount"),
  ),
  ThreatsDetectedItemCount: S.optional(ThreatsDetectedItemCount).pipe(
    T.JsonName("threatsDetectedItemCount"),
  ),
  HighestSeverityThreatDetails: S.optional(HighestSeverityThreatDetails).pipe(
    T.JsonName("highestSeverityThreatDetails"),
  ),
  ThreatDetectedByName: S.optional(ThreatDetectedByName).pipe(
    T.JsonName("threatDetectedByName"),
  ),
}) {}
export const AnomalyProfileFeatures = S.Record({
  key: S.String,
  value: AnomalyProfileFeatureObjects,
});
export class ResourceData extends S.Class<ResourceData>("ResourceData")({
  S3Bucket: S.optional(S3Bucket).pipe(T.JsonName("s3Bucket")),
  Ec2Instance: S.optional(Ec2Instance).pipe(T.JsonName("ec2Instance")),
  AccessKey: S.optional(AccessKey).pipe(T.JsonName("accessKey")),
  Ec2NetworkInterface: S.optional(Ec2NetworkInterface).pipe(
    T.JsonName("ec2NetworkInterface"),
  ),
  S3Object: S.optional(S3Object).pipe(T.JsonName("s3Object")),
  EksCluster: S.optional(EksCluster).pipe(T.JsonName("eksCluster")),
  KubernetesWorkload: S.optional(KubernetesWorkload).pipe(
    T.JsonName("kubernetesWorkload"),
  ),
  Container: S.optional(ContainerFindingResource).pipe(T.JsonName("container")),
  EcsCluster: S.optional(EcsCluster).pipe(T.JsonName("ecsCluster")),
  EcsTask: S.optional(EcsTask).pipe(T.JsonName("ecsTask")),
  IamInstanceProfile: S.optional(IamInstanceProfileV2).pipe(
    T.JsonName("iamInstanceProfile"),
  ),
  AutoscalingAutoScalingGroup: S.optional(AutoscalingAutoScalingGroup).pipe(
    T.JsonName("autoscalingAutoScalingGroup"),
  ),
  Ec2LaunchTemplate: S.optional(Ec2LaunchTemplate).pipe(
    T.JsonName("ec2LaunchTemplate"),
  ),
  Ec2Vpc: S.optional(Ec2Vpc).pipe(T.JsonName("ec2Vpc")),
  Ec2Image: S.optional(Ec2Image).pipe(T.JsonName("ec2Image")),
  CloudformationStack: S.optional(CloudformationStack).pipe(
    T.JsonName("cloudformationStack"),
  ),
}) {}
export class S3BucketDetail extends S.Class<S3BucketDetail>("S3BucketDetail")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
    T.JsonName("createdAt"),
  ),
  Owner: S.optional(Owner).pipe(T.JsonName("owner")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  DefaultServerSideEncryption: S.optional(DefaultServerSideEncryption).pipe(
    T.JsonName("defaultServerSideEncryption"),
  ),
  PublicAccess: S.optional(PublicAccess).pipe(T.JsonName("publicAccess")),
  S3ObjectDetails: S.optional(S3ObjectDetails).pipe(
    T.JsonName("s3ObjectDetails"),
  ),
}) {}
export const S3BucketDetails = S.Array(S3BucketDetail);
export class EbsVolumeScanDetails extends S.Class<EbsVolumeScanDetails>(
  "EbsVolumeScanDetails",
)({
  ScanId: S.optional(S.String).pipe(T.JsonName("scanId")),
  ScanStartedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanStartedAt")),
  ScanCompletedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ).pipe(T.JsonName("scanCompletedAt")),
  TriggerFindingId: S.optional(S.String).pipe(T.JsonName("triggerFindingId")),
  Sources: S.optional(Sources).pipe(T.JsonName("sources")),
  ScanDetections: S.optional(ScanDetections).pipe(T.JsonName("scanDetections")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
}) {}
export const AnomalyProfiles = S.Record({
  key: S.String,
  value: AnomalyProfileFeatures,
});
export class ResourceV2 extends S.Class<ResourceV2>("ResourceV2")({
  Uid: S.String.pipe(T.JsonName("uid")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  AccountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  ResourceType: S.String.pipe(T.JsonName("resourceType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  Service: S.optional(S.String).pipe(T.JsonName("service")),
  CloudPartition: S.optional(S.String).pipe(T.JsonName("cloudPartition")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Data: S.optional(ResourceData).pipe(T.JsonName("data")),
}) {}
export const Resources = S.Array(ResourceV2);
export class Resource extends S.Class<Resource>("Resource")({
  AccessKeyDetails: S.optional(AccessKeyDetails).pipe(
    T.JsonName("accessKeyDetails"),
  ),
  S3BucketDetails: S.optional(S3BucketDetails).pipe(
    T.JsonName("s3BucketDetails"),
  ),
  InstanceDetails: S.optional(InstanceDetails).pipe(
    T.JsonName("instanceDetails"),
  ),
  EksClusterDetails: S.optional(EksClusterDetails).pipe(
    T.JsonName("eksClusterDetails"),
  ),
  KubernetesDetails: S.optional(KubernetesDetails).pipe(
    T.JsonName("kubernetesDetails"),
  ),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  EbsVolumeDetails: S.optional(EbsVolumeDetails).pipe(
    T.JsonName("ebsVolumeDetails"),
  ),
  EcsClusterDetails: S.optional(EcsClusterDetails).pipe(
    T.JsonName("ecsClusterDetails"),
  ),
  ContainerDetails: S.optional(Container).pipe(T.JsonName("containerDetails")),
  RdsDbInstanceDetails: S.optional(RdsDbInstanceDetails).pipe(
    T.JsonName("rdsDbInstanceDetails"),
  ),
  RdsLimitlessDbDetails: S.optional(RdsLimitlessDbDetails).pipe(
    T.JsonName("rdsLimitlessDbDetails"),
  ),
  RdsDbUserDetails: S.optional(RdsDbUserDetails).pipe(
    T.JsonName("rdsDbUserDetails"),
  ),
  LambdaDetails: S.optional(LambdaDetails).pipe(T.JsonName("lambdaDetails")),
  EbsSnapshotDetails: S.optional(EbsSnapshotDetails).pipe(
    T.JsonName("ebsSnapshotDetails"),
  ),
  Ec2ImageDetails: S.optional(Ec2ImageDetails).pipe(
    T.JsonName("ec2ImageDetails"),
  ),
  RecoveryPointDetails: S.optional(RecoveryPointDetails).pipe(
    T.JsonName("recoveryPointDetails"),
  ),
}) {}
export class Anomaly extends S.Class<Anomaly>("Anomaly")({
  Profiles: S.optional(AnomalyProfiles).pipe(T.JsonName("profiles")),
  Unusual: S.optional(AnomalyUnusual).pipe(T.JsonName("unusual")),
}) {}
export class Sequence extends S.Class<Sequence>("Sequence")({
  Uid: S.String.pipe(T.JsonName("uid")),
  Description: S.String.pipe(T.JsonName("description")),
  Actors: S.optional(Actors).pipe(T.JsonName("actors")),
  Resources: S.optional(Resources).pipe(T.JsonName("resources")),
  Endpoints: S.optional(NetworkEndpoints).pipe(T.JsonName("endpoints")),
  Signals: Signals.pipe(T.JsonName("signals")),
  SequenceIndicators: S.optional(Indicators).pipe(
    T.JsonName("sequenceIndicators"),
  ),
  AdditionalSequenceTypes: S.optional(AdditionalSequenceTypes).pipe(
    T.JsonName("additionalSequenceTypes"),
  ),
}) {}
export class Detection extends S.Class<Detection>("Detection")({
  Anomaly: S.optional(Anomaly).pipe(T.JsonName("anomaly")),
  Sequence: S.optional(Sequence).pipe(T.JsonName("sequence")),
}) {}
export class Service extends S.Class<Service>("Service")({
  Action: S.optional(Action).pipe(T.JsonName("action")),
  Evidence: S.optional(Evidence).pipe(T.JsonName("evidence")),
  Archived: S.optional(S.Boolean).pipe(T.JsonName("archived")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  DetectorId: S.optional(S.String).pipe(T.JsonName("detectorId")),
  EventFirstSeen: S.optional(S.String).pipe(T.JsonName("eventFirstSeen")),
  EventLastSeen: S.optional(S.String).pipe(T.JsonName("eventLastSeen")),
  ResourceRole: S.optional(S.String).pipe(T.JsonName("resourceRole")),
  ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  UserFeedback: S.optional(S.String).pipe(T.JsonName("userFeedback")),
  AdditionalInfo: S.optional(ServiceAdditionalInfo).pipe(
    T.JsonName("additionalInfo"),
  ),
  FeatureName: S.optional(S.String).pipe(T.JsonName("featureName")),
  EbsVolumeScanDetails: S.optional(EbsVolumeScanDetails).pipe(
    T.JsonName("ebsVolumeScanDetails"),
  ),
  RuntimeDetails: S.optional(RuntimeDetails).pipe(T.JsonName("runtimeDetails")),
  Detection: S.optional(Detection).pipe(T.JsonName("detection")),
  MalwareScanDetails: S.optional(MalwareScanDetails).pipe(
    T.JsonName("malwareScanDetails"),
  ),
}) {}
export class Finding extends S.Class<Finding>("Finding")({
  AccountId: S.String.pipe(T.JsonName("accountId")),
  Arn: S.String.pipe(T.JsonName("arn")),
  Confidence: S.optional(S.Number).pipe(T.JsonName("confidence")),
  CreatedAt: S.String.pipe(T.JsonName("createdAt")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.String.pipe(T.JsonName("id")),
  Partition: S.optional(S.String).pipe(T.JsonName("partition")),
  Region: S.String.pipe(T.JsonName("region")),
  Resource: Resource.pipe(T.JsonName("resource")),
  SchemaVersion: S.String.pipe(T.JsonName("schemaVersion")),
  Service: S.optional(Service).pipe(T.JsonName("service")),
  Severity: S.Number.pipe(T.JsonName("severity")),
  Title: S.optional(S.String).pipe(T.JsonName("title")),
  Type: S.String.pipe(T.JsonName("type")),
  UpdatedAt: S.String.pipe(T.JsonName("updatedAt")),
  AssociatedAttackSequenceArn: S.optional(S.String).pipe(
    T.JsonName("associatedAttackSequenceArn"),
  ),
}) {}
export const Findings = S.Array(Finding);
export class GetFindingsResponse extends S.Class<GetFindingsResponse>(
  "GetFindingsResponse",
)({ Findings: Findings.pipe(T.JsonName("findings")) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    Type: S.optional(S.String).pipe(T.JsonName("__type")),
  },
) {}

//# Operations
/**
 * Accepts the invitation to be a member account and get monitored by a GuardDuty
 * administrator account that sent the invitation.
 */
export const acceptAdministratorInvitation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptAdministratorInvitationRequest,
    output: AcceptAdministratorInvitationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Creates member accounts of the current Amazon Web Services account by specifying a list of Amazon Web Services account
 * IDs. This step is a prerequisite for managing the associated member accounts either by
 * invitation or through an organization.
 *
 * As a delegated administrator, using `CreateMembers` will enable GuardDuty in
 * the added member accounts, with the exception of the
 * organization delegated administrator account. A delegated administrator must enable GuardDuty
 * prior to being added as a member.
 *
 * When you use CreateMembers as an Organizations delegated
 * administrator, GuardDuty applies your organization's auto-enable settings to the member
 * accounts in this request, irrespective of the accounts being new or existing members. For
 * more information about the existing auto-enable settings for your organization, see
 * DescribeOrganizationConfiguration.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const createMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembersRequest,
  output: CreateMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates a publishing destination where you can export your GuardDuty findings. Before you start exporting the
 * findings, the destination resource must exist.
 */
export const createPublishingDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePublishingDestinationRequest,
    output: CreatePublishingDestinationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Declines invitations sent to the current member account by Amazon Web Services accounts specified by
 * their account IDs.
 */
export const declineInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Provides the details of the GuardDuty administrator account associated with the current
 * GuardDuty member account.
 *
 * Based on the type of account that runs this API, the following list shows how the API behavior varies:
 *
 * - When the GuardDuty administrator account runs this API, it will return success (`HTTP 200`) but no content.
 *
 * - When a member account runs this API, it will return the details of the GuardDuty administrator account that is associated
 * with this calling member account.
 *
 * - When an individual account (not associated with an organization) runs this API, it will return success (`HTTP 200`)
 * but no content.
 */
export const getAdministratorAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAdministratorAccountRequest,
    output: GetAdministratorAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Provides the details for the GuardDuty administrator account associated with the current
 * GuardDuty member account.
 */
export const getMasterAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves GuardDuty member accounts (of the current GuardDuty administrator account)
 * specified by the account IDs.
 */
export const getMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembersRequest,
  output: GetMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Lists all GuardDuty membership invitations that were sent to the current Amazon Web Services
 * account.
 */
export const listInvitations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInvitationsRequest,
    output: ListInvitationsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Invitations",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the Malware Protection plan IDs associated with the protected
 * resources in your Amazon Web Services account.
 */
export const listMalwareProtectionPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMalwareProtectionPlansRequest,
    output: ListMalwareProtectionPlansResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Lists the accounts designated as GuardDuty delegated administrators.
 * Only the organization's management account can run this
 * API operation.
 */
export const listOrganizationAdminAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOrganizationAdminAccountsRequest,
    output: ListOrganizationAdminAccountsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AdminAccounts",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of publishing destinations associated with the specified
 * `detectorId`.
 */
export const listPublishingDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPublishingDestinationsRequest,
    output: ListPublishingDestinationsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a new threat entity set. In a threat entity set, you can provide known malicious
 * IP addresses and domains for your Amazon Web Services environment.
 * GuardDuty generates findings based on the entries in the threat entity sets.
 * Only users of the administrator account can manage entity sets, which automatically apply
 * to member accounts.
 */
export const createThreatEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateThreatEntitySetRequest,
    output: CreateThreatEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Creates a new trusted entity set. In the trusted entity set, you can provide IP addresses
 * and domains that you believe are secure for communication in your Amazon Web Services environment. GuardDuty
 * will not generate findings for the entries that are specified in a trusted entity set. At any
 * given time, you can have only one trusted entity set.
 *
 * Only users of the administrator account can manage the entity sets, which automatically
 * apply to member accounts.
 */
export const createTrustedEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTrustedEntitySetRequest,
    output: CreateTrustedEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Deletes invitations sent to the current member account by Amazon Web Services accounts specified by
 * their account IDs.
 */
export const deleteInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes GuardDuty member accounts (to the current GuardDuty administrator account)
 * specified by the account IDs.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disable GuardDuty for a member
 * account in your organization.
 */
export const deleteMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembersRequest,
  output: DeleteMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns information about the publishing destination specified by the provided
 * `destinationId`.
 */
export const describePublishingDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePublishingDestinationRequest,
    output: DescribePublishingDestinationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Disassociates GuardDuty member accounts (from the current administrator account) specified
 * by the account IDs.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disassociate a member account
 * before removing them from your organization.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const disassociateMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMembersRequest,
  output: DisassociateMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns the details of the filter specified by the filter name.
 */
export const getFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFilterRequest,
  output: GetFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the IPSet specified by the `ipSetId`.
 */
export const getIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIPSetRequest,
  output: GetIPSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns the details of the malware scan settings.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMalwareScanSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMalwareScanSettingsRequest,
    output: GetMalwareScanSettingsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Retrieves the threat entity set associated with the specified `threatEntitySetId`.
 */
export const getThreatEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThreatEntitySetRequest,
  output: GetThreatEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the ThreatIntelSet that is specified by the ThreatIntelSet ID.
 */
export const getThreatIntelSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThreatIntelSetRequest,
  output: GetThreatIntelSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the trusted entity set associated with the specified `trustedEntitySetId`.
 */
export const getTrustedEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrustedEntitySetRequest,
  output: GetTrustedEntitySetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Invites Amazon Web Services accounts to become members of an organization administered by the Amazon Web Services account
 * that invokes this API. If you are using Amazon Web Services Organizations to manage your GuardDuty environment, this step is not
 * needed. For more information, see Managing accounts with organizations.
 *
 * To invite Amazon Web Services accounts, the first step is
 * to ensure that GuardDuty has been enabled in the potential member accounts. You can now invoke this API
 * to add accounts by invitation. The
 * invited accounts can either accept or decline the invitation from their GuardDuty accounts. Each invited Amazon Web Services account can
 * choose to accept the invitation from only one Amazon Web Services account. For more information, see
 * Managing GuardDuty accounts
 * by invitation.
 *
 * After the invite has been accepted and you choose to disassociate a member account
 * (by using DisassociateMembers) from your account,
 * the details of the member account obtained by invoking CreateMembers, including the
 * associated email addresses, will be retained.
 * This is done so that you can invoke InviteMembers without the need to invoke
 * CreateMembers again. To
 * remove the details associated with a member account, you must also invoke
 * DeleteMembers.
 *
 * If you disassociate a member account that was added by invitation, the member account details
 * obtained from this API, including the associated email addresses, will be retained.
 * This is done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * When the member accounts added through Organizations are later disassociated, you (administrator)
 * can't invite them by calling the InviteMembers API. You can create an association with these
 * member accounts again only by calling the CreateMembers API.
 */
export const inviteMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteMembersRequest,
  output: InviteMembersResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Lists detectorIds of all the existing Amazon GuardDuty detector resources.
 */
export const listDetectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDetectorsRequest,
    output: ListDetectorsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DetectorIds",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a paginated list of the current filters.
 */
export const listFilters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFiltersRequest,
    output: ListFiltersResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FilterNames",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists GuardDuty findings for the specified detector ID.
 *
 * There might be regional differences because some flags might not be available in all the Regions where GuardDuty
 * is currently supported. For more information, see Regions and endpoints.
 */
export const listFindings = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFindingsRequest,
    output: ListFindingsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FindingIds",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the IPSets of the GuardDuty service specified by the detector ID. If you use this
 * operation from a member account, the IPSets returned are the IPSets from the associated
 * administrator account.
 */
export const listIPSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIPSetsRequest,
  output: ListIPSetsResponse,
  errors: [BadRequestException, InternalServerErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IpSetIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists details about all member accounts for the current GuardDuty administrator
 * account.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMembersRequest,
    output: ListMembersResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Members",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists tags for a resource. Tagging is currently supported for detectors, finding filters,
 * IP sets, threat intel sets, and publishing destination, with a limit of 50 tags per resource.
 * When invoked, this
 * operation returns all assigned tags for a given resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Lists the threat entity sets associated with the specified GuardDuty detector ID. If you use this
 * operation from a member account, the threat entity sets that are returned as a response, belong to the
 * administrator account.
 */
export const listThreatEntitySets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListThreatEntitySetsRequest,
    output: ListThreatEntitySetsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ThreatEntitySetIds",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the ThreatIntelSets of the GuardDuty service specified by the detector ID. If you
 * use this operation from a member account, the ThreatIntelSets associated with the
 * administrator account are returned.
 */
export const listThreatIntelSets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListThreatIntelSetsRequest,
    output: ListThreatIntelSetsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ThreatIntelSetIds",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the trusted entity sets associated with the specified GuardDuty detector ID. If you use this
 * operation from a member account, the trusted entity sets that are returned as a response, belong to the
 * administrator account.
 */
export const listTrustedEntitySets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrustedEntitySetsRequest,
    output: ListTrustedEntitySetsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TrustedEntitySetIds",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Initiates a malware scan for a specific S3 object. This API allows you to perform on-demand malware scanning of individual objects in S3 buckets that have Malware Protection for S3 enabled.
 *
 * When you use this API, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const sendObjectMalwareScan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendObjectMalwareScanRequest,
    output: SendObjectMalwareScanResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Turns on GuardDuty monitoring of the specified member accounts. Use this operation to
 * restart monitoring of accounts that you stopped monitoring with the StopMonitoringMembers operation.
 */
export const startMonitoringMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMonitoringMembersRequest,
    output: StartMonitoringMembersResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Stops GuardDuty monitoring for the specified member accounts. Use the
 * `StartMonitoringMembers` operation to restart monitoring for those
 * accounts.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to stop monitoring the member
 * accounts in your organization.
 */
export const stopMonitoringMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopMonitoringMembersRequest,
    output: StopMonitoringMembersResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Updates the filter specified by the filter name.
 */
export const updateFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFilterRequest,
  output: UpdateFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Accepts the invitation to be monitored by a GuardDuty administrator account.
 */
export const acceptInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Archives GuardDuty findings that are specified by the list of finding IDs.
 *
 * Only the administrator account can archive findings. Member accounts don't have
 * permission to archive findings from their accounts.
 */
export const archiveFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ArchiveFindingsRequest,
  output: ArchiveFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Generates sample findings of types specified by the list of finding types. If 'NULL' is
 * specified for `findingTypes`, the API generates sample findings of all supported
 * finding types.
 */
export const createSampleFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSampleFindingsRequest,
    output: CreateSampleFindingsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Deletes an Amazon GuardDuty detector that is specified by the detector ID.
 */
export const deleteDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorRequest,
  output: DeleteDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the filter specified by the filter name.
 */
export const deleteFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFilterRequest,
  output: DeleteFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the IPSet specified by the `ipSetId`. IPSets are called trusted IP
 * lists in the console user interface.
 */
export const deleteIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIPSetRequest,
  output: DeleteIPSetResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Deletes the publishing definition with the specified `destinationId`.
 */
export const deletePublishingDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePublishingDestinationRequest,
    output: DeletePublishingDestinationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Deletes the threat entity set that is associated with the specified
 * `threatEntitySetId`.
 */
export const deleteThreatEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteThreatEntitySetRequest,
    output: DeleteThreatEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Deletes the ThreatIntelSet specified by the ThreatIntelSet ID.
 */
export const deleteThreatIntelSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteThreatIntelSetRequest,
    output: DeleteThreatIntelSetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Deletes the trusted entity set that is associated with the specified
 * `trustedEntitySetId`.
 */
export const deleteTrustedEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTrustedEntitySetRequest,
    output: DeleteTrustedEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Removes the existing GuardDuty delegated
 * administrator of the organization. Only the organization's management account can run this
 * API operation.
 */
export const disableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOrganizationAdminAccountRequest,
    output: DisableOrganizationAdminAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Disassociates the current GuardDuty member account from its administrator account.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 *
 * With `autoEnableOrganizationMembers` configuration for your organization set to
 * `ALL`, you'll receive an error if you attempt to disable GuardDuty in a member
 * account.
 */
export const disassociateFromAdministratorAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromAdministratorAccountRequest,
    output: DisassociateFromAdministratorAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Disassociates the current GuardDuty member account from its administrator account.
 *
 * When you
 * disassociate an invited member from a GuardDuty delegated administrator, the member account details
 * obtained from the CreateMembers API, including the associated email addresses, are retained. This is
 * done so that the delegated administrator can invoke the InviteMembers API without the need to invoke the CreateMembers API again. To
 * remove the details associated with a member account, the delegated administrator must invoke the
 * DeleteMembers API.
 */
export const disassociateFromMasterAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromMasterAccountRequest,
    output: DisassociateFromMasterAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Designates an Amazon Web Services account within the organization as your GuardDuty delegated
 * administrator. Only the organization's management account can run this
 * API operation.
 */
export const enableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOrganizationAdminAccountRequest,
    output: EnableOrganizationAdminAccountResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Returns the count of all GuardDuty membership invitations that were sent to the current
 * member account except the currently accepted invitation.
 */
export const getInvitationsCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Unarchives GuardDuty findings specified by the `findingIds`.
 */
export const unarchiveFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnarchiveFindingsRequest,
  output: UnarchiveFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Updates the GuardDuty detector specified by the detector ID.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorRequest,
  output: UpdateDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Marks the specified GuardDuty findings as useful or not useful.
 */
export const updateFindingsFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFindingsFeedbackRequest,
    output: UpdateFindingsFeedbackResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Updates information about the publishing destination specified by the
 * `destinationId`.
 */
export const updatePublishingDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePublishingDestinationRequest,
    output: UpdatePublishingDestinationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Updates the threat entity set associated with the specified `threatEntitySetId`.
 */
export const updateThreatEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateThreatEntitySetRequest,
    output: UpdateThreatEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Updates the trusted entity set associated with the specified `trustedEntitySetId`.
 */
export const updateTrustedEntitySet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTrustedEntitySetRequest,
    output: UpdateTrustedEntitySetResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Adds tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Updates the IPSet specified by the IPSet ID.
 */
export const updateIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIPSetRequest,
  output: UpdateIPSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Updates the ThreatIntelSet specified by the ThreatIntelSet ID.
 */
export const updateThreatIntelSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateThreatIntelSetRequest,
    output: UpdateThreatIntelSetResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Creates a new IPSet, which is called a trusted IP list in the console user interface. An
 * IPSet is a list of IP addresses that are trusted for secure communication with Amazon Web Services
 * infrastructure and applications. GuardDuty doesn't generate findings for IP addresses that are
 * included in IPSets. Only users from the administrator account can use this operation.
 */
export const createIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIPSetRequest,
  output: CreateIPSetResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a new ThreatIntelSet. ThreatIntelSets consist of known malicious IP addresses.
 * GuardDuty generates findings based on ThreatIntelSets. Only users of the administrator
 * account can use this operation.
 */
export const createThreatIntelSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateThreatIntelSetRequest,
    output: CreateThreatIntelSetResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Lists GuardDuty findings statistics for the specified detector ID.
 *
 * You must provide either `findingStatisticTypes` or
 * `groupBy` parameter, and not both. You can use the `maxResults` and `orderBy`
 * parameters only when using `groupBy`.
 *
 * There might be regional differences because some flags might not be available in all the Regions where GuardDuty
 * is currently supported. For more information, see Regions and endpoints.
 */
export const getFindingsStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingsStatisticsRequest,
    output: GetFindingsStatisticsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Retrieves the Malware Protection plan details associated with a Malware Protection
 * plan ID.
 */
export const getMalwareProtectionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMalwareProtectionPlanRequest,
    output: GetMalwareProtectionPlanResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Contains information on member accounts to be updated.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateMemberDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMemberDetectorsRequest,
    output: UpdateMemberDetectorsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Updates an existing Malware Protection plan resource.
 */
export const updateMalwareProtectionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMalwareProtectionPlanRequest,
    output: UpdateMalwareProtectionPlanResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes the Malware Protection plan ID associated with the Malware Protection plan resource.
 * Use this API only when you no longer want to protect the resource associated with this
 * Malware Protection plan ID.
 */
export const deleteMalwareProtectionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMalwareProtectionPlanRequest,
    output: DeleteMalwareProtectionPlanResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      InternalServerErrorException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a filter using the specified finding criteria. The maximum number of saved filters
 * per Amazon Web Services account per Region is 100. For more information, see Quotas for GuardDuty.
 */
export const createFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFilterRequest,
  output: CreateFilterResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Creates a new Malware Protection plan for the protected resource.
 *
 * When you create a Malware Protection plan, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const createMalwareProtectionPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMalwareProtectionPlanRequest,
    output: CreateMalwareProtectionPlanResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerErrorException,
    ],
  }),
);
/**
 * Describes which data sources are enabled for the member account's detector.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMemberDetectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberDetectorsRequest,
  output: GetMemberDetectorsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves how many active member accounts have
 * each feature enabled within GuardDuty. Only a delegated GuardDuty administrator of an organization can run this API.
 *
 * When you create a new organization, it might take up to 24
 * hours to generate the statistics for the entire organization.
 */
export const getOrganizationStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOrganizationStatisticsRequest,
    output: GetOrganizationStatisticsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Provides the number of days left for each data source used in the free trial
 * period.
 */
export const getRemainingFreeTrialDays = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRemainingFreeTrialDaysRequest,
    output: GetRemainingFreeTrialDaysResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Returns a list of malware scans. Each member account can view the malware scans for their
 * own accounts. An administrator can view the malware scans for all of its members' accounts.
 */
export const listMalwareScans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMalwareScansRequest,
    output: ListMalwareScansResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Scans",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates the malware scan settings.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateMalwareScanSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMalwareScanSettingsRequest,
    output: UpdateMalwareScanSettingsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Configures the delegated administrator account with the provided values. You must provide
 * a value for either `autoEnableOrganizationMembers` or `autoEnable`, but not both.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const updateOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrganizationConfigurationRequest,
    output: UpdateOrganizationConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }));
/**
 * Initiates the malware scan. Invoking this API will automatically create the Service-linked role in
 * the corresponding account if the resourceArn belongs to an EC2 instance.
 *
 * When the malware scan starts, you can use the associated scan ID to track the status of the scan. For more information,
 * see ListMalwareScans and GetMalwareScan.
 *
 * When you use this API, the Amazon Web Services service terms for GuardDuty Malware
 * Protection apply. For more information, see Amazon Web Services service terms for GuardDuty Malware Protection.
 */
export const startMalwareScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMalwareScanRequest,
  output: StartMalwareScanResponse,
  errors: [
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
  ],
}));
/**
 * Creates a single GuardDuty detector. A detector is a resource that represents the
 * GuardDuty service. To start using GuardDuty, you must create a detector in each Region where
 * you enable the service. You can have only one detector per account per Region. All data
 * sources are enabled in a new detector by default.
 *
 * - When you don't specify any `features`, with an
 * exception to `RUNTIME_MONITORING`, all the optional features are
 * enabled by default.
 *
 * - When you specify some of the `features`, any feature that is not specified in the
 * API call gets enabled by default, with an exception to `RUNTIME_MONITORING`.
 *
 * Specifying both EKS Runtime Monitoring (`EKS_RUNTIME_MONITORING`)
 * and Runtime Monitoring (`RUNTIME_MONITORING`) will cause an error.
 * You can add only one of these two features because Runtime Monitoring already includes the
 * threat detection for Amazon EKS resources. For more information, see
 * Runtime Monitoring.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const createDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDetectorRequest,
  output: CreateDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Returns information about the account selected as the delegated administrator for
 * GuardDuty.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const describeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeOrganizationConfigurationRequest,
    output: DescribeOrganizationConfigurationResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves a GuardDuty detector specified by the detectorId.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getDetector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorRequest,
  output: GetDetectorResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));
/**
 * Retrieves the detailed information for a specific malware scan. Each member account can view the malware scan details for their
 * own account. An administrator can view malware scan details for all accounts in the organization.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const getMalwareScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMalwareScanRequest,
  output: GetMalwareScanResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists Amazon GuardDuty usage statistics over the last 30 days for the specified detector
 * ID. For newly enabled detectors or data sources, the cost returned will include only the usage
 * so far under 30 days. This may differ from the cost metrics in the console, which project
 * usage over 30 days to provide a monthly cost estimate. For more information, see Understanding How Usage Costs are Calculated.
 */
export const getUsageStatistics = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetUsageStatisticsRequest,
    output: GetUsageStatisticsResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of malware scans. Each member account can view the malware scans for their
 * own accounts. An administrator can view the malware scans for all the member accounts.
 *
 * There might be regional differences because some data sources might not be
 * available in all the Amazon Web Services Regions where GuardDuty is presently supported. For more
 * information, see Regions and endpoints.
 */
export const describeMalwareScans =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMalwareScansRequest,
    output: DescribeMalwareScansResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Scans",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves aggregated statistics for your account. If you are a GuardDuty administrator, you
 * can retrieve the statistics for all the resources associated with the active member accounts
 * in your organization who have enabled Runtime Monitoring and have the GuardDuty security agent running
 * on their resources.
 */
export const getCoverageStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCoverageStatisticsRequest,
    output: GetCoverageStatisticsResponse,
    errors: [BadRequestException, InternalServerErrorException],
  }),
);
/**
 * Lists coverage details for your GuardDuty account. If you're a GuardDuty administrator, you can
 * retrieve all resources associated with the active member accounts in your organization.
 *
 * Make sure the accounts have Runtime Monitoring enabled and GuardDuty agent running on
 * their resources.
 */
export const listCoverage = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCoverageRequest,
    output: ListCoverageResponse,
    errors: [BadRequestException, InternalServerErrorException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Resources",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Describes Amazon GuardDuty findings specified by finding IDs.
 */
export const getFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsRequest,
  output: GetFindingsResponse,
  errors: [BadRequestException, InternalServerErrorException],
}));

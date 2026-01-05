import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "PartnerCentral Channel",
  serviceShapeName: "PartnerCentralChannel",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-channel" });
const ver = T.ServiceVersion("2024-03-18");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: {
            url: { ref: "Endpoint" },
            properties: {
              authSchemes: [
                { name: "sigv4a", signingRegionSet: ["*"] },
                { name: "sigv4" },
              ],
            },
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                  ],
                  endpoint: {
                    url: "https://partnercentral-channel.us-gov.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        { name: "sigv4a", signingRegionSet: ["*"] },
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  endpoint: {
                    url: "https://partnercentral-channel-fips.us-gov.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        { name: "sigv4a", signingRegionSet: ["*"] },
                        { name: "sigv4", signingRegion: "us-gov-west-1" },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  endpoint: {
                    url: "https://partnercentral-channel-fips.global.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        { name: "sigv4a", signingRegionSet: ["*"] },
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://partnercentral-channel.global.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
                        { name: "sigv4a", signingRegionSet: ["*"] },
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const HandshakeStatusList = S.Array(S.String);
export const AssociatedResourceIdentifierList = S.Array(S.String);
export const ProgramManagementAccountDisplayNameList = S.Array(S.String);
export const ProgramList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const ProgramManagementAccountStatusList = S.Array(S.String);
export const AssociationTypeList = S.Array(S.String);
export const RelationshipDisplayNameList = S.Array(S.String);
export const ProgramManagementAccountIdentifierList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/UntagResource" }),
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
export class AcceptChannelHandshakeRequest extends S.Class<AcceptChannelHandshakeRequest>(
  "AcceptChannelHandshakeRequest",
)(
  { catalog: S.String, identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/AcceptChannelHandshake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelChannelHandshakeRequest extends S.Class<CancelChannelHandshakeRequest>(
  "CancelChannelHandshakeRequest",
)(
  { catalog: S.String, identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/CancelChannelHandshake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectChannelHandshakeRequest extends S.Class<RejectChannelHandshakeRequest>(
  "RejectChannelHandshakeRequest",
)(
  { catalog: S.String, identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/RejectChannelHandshake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateProgramManagementAccountRequest extends S.Class<CreateProgramManagementAccountRequest>(
  "CreateProgramManagementAccountRequest",
)(
  {
    catalog: S.String,
    program: S.String,
    displayName: S.String,
    accountId: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateProgramManagementAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateProgramManagementAccountRequest extends S.Class<UpdateProgramManagementAccountRequest>(
  "UpdateProgramManagementAccountRequest",
)(
  {
    catalog: S.String,
    identifier: S.String,
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateProgramManagementAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProgramManagementAccountRequest extends S.Class<DeleteProgramManagementAccountRequest>(
  "DeleteProgramManagementAccountRequest",
)(
  {
    catalog: S.String,
    identifier: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteProgramManagementAccount" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProgramManagementAccountResponse extends S.Class<DeleteProgramManagementAccountResponse>(
  "DeleteProgramManagementAccountResponse",
)({}) {}
export class GetRelationshipRequest extends S.Class<GetRelationshipRequest>(
  "GetRelationshipRequest",
)(
  {
    catalog: S.String,
    programManagementAccountIdentifier: S.String,
    identifier: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetRelationship" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResoldBusiness extends S.Class<ResoldBusiness>("ResoldBusiness")({
  coverage: S.String,
}) {}
export class ResoldEnterprise extends S.Class<ResoldEnterprise>(
  "ResoldEnterprise",
)({
  coverage: S.String,
  tamLocation: S.String,
  chargeAccountId: S.optional(S.String),
}) {}
export class PartnerLedSupport extends S.Class<PartnerLedSupport>(
  "PartnerLedSupport",
)({
  coverage: S.String,
  provider: S.optional(S.String),
  tamLocation: S.String,
}) {}
export const SupportPlan = S.Union(
  S.Struct({ resoldBusiness: ResoldBusiness }),
  S.Struct({ resoldEnterprise: ResoldEnterprise }),
  S.Struct({ partnerLedSupport: PartnerLedSupport }),
);
export class UpdateRelationshipRequest extends S.Class<UpdateRelationshipRequest>(
  "UpdateRelationshipRequest",
)(
  {
    catalog: S.String,
    identifier: S.String,
    programManagementAccountIdentifier: S.String,
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
    requestedSupportPlan: S.optional(SupportPlan),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateRelationship" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelationshipRequest extends S.Class<DeleteRelationshipRequest>(
  "DeleteRelationshipRequest",
)(
  {
    catalog: S.String,
    identifier: S.String,
    programManagementAccountIdentifier: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteRelationship" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRelationshipResponse extends S.Class<DeleteRelationshipResponse>(
  "DeleteRelationshipResponse",
)({}) {}
export class ListProgramManagementAccountsSortBase extends S.Class<ListProgramManagementAccountsSortBase>(
  "ListProgramManagementAccountsSortBase",
)({ sortOrder: S.String, sortBy: S.String }) {}
export class ListRelationshipsSortBase extends S.Class<ListRelationshipsSortBase>(
  "ListRelationshipsSortBase",
)({ sortOrder: S.String, sortBy: S.String }) {}
export const ServicePeriodTypeList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/TagResource" }),
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
export class ListProgramManagementAccountsRequest extends S.Class<ListProgramManagementAccountsRequest>(
  "ListProgramManagementAccountsRequest",
)(
  {
    catalog: S.String,
    maxResults: S.optional(S.Number),
    displayNames: S.optional(ProgramManagementAccountDisplayNameList),
    programs: S.optional(ProgramList),
    accountIds: S.optional(AccountIdList),
    statuses: S.optional(ProgramManagementAccountStatusList),
    sort: S.optional(ListProgramManagementAccountsSortBase),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListProgramManagementAccounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRelationshipsRequest extends S.Class<ListRelationshipsRequest>(
  "ListRelationshipsRequest",
)(
  {
    catalog: S.String,
    maxResults: S.optional(S.Number),
    associatedAccountIds: S.optional(AccountIdList),
    associationTypes: S.optional(AssociationTypeList),
    displayNames: S.optional(RelationshipDisplayNameList),
    programManagementAccountIdentifiers: S.optional(
      ProgramManagementAccountIdentifierList,
    ),
    sort: S.optional(ListRelationshipsSortBase),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListRelationships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartServicePeriodPayload extends S.Class<StartServicePeriodPayload>(
  "StartServicePeriodPayload",
)({
  programManagementAccountIdentifier: S.String,
  note: S.optional(S.String),
  servicePeriodType: S.String,
  minimumNoticeDays: S.optional(S.String),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class RevokeServicePeriodPayload extends S.Class<RevokeServicePeriodPayload>(
  "RevokeServicePeriodPayload",
)({
  programManagementAccountIdentifier: S.String,
  note: S.optional(S.String),
}) {}
export class StartServicePeriodTypeFilters extends S.Class<StartServicePeriodTypeFilters>(
  "StartServicePeriodTypeFilters",
)({ servicePeriodTypes: S.optional(ServicePeriodTypeList) }) {}
export class RevokeServicePeriodTypeFilters extends S.Class<RevokeServicePeriodTypeFilters>(
  "RevokeServicePeriodTypeFilters",
)({ servicePeriodTypes: S.optional(ServicePeriodTypeList) }) {}
export class ProgramManagementAccountTypeFilters extends S.Class<ProgramManagementAccountTypeFilters>(
  "ProgramManagementAccountTypeFilters",
)({ programs: S.optional(ProgramList) }) {}
export class StartServicePeriodTypeSort extends S.Class<StartServicePeriodTypeSort>(
  "StartServicePeriodTypeSort",
)({ sortOrder: S.String, sortBy: S.String }) {}
export class RevokeServicePeriodTypeSort extends S.Class<RevokeServicePeriodTypeSort>(
  "RevokeServicePeriodTypeSort",
)({ sortOrder: S.String, sortBy: S.String }) {}
export class ProgramManagementAccountTypeSort extends S.Class<ProgramManagementAccountTypeSort>(
  "ProgramManagementAccountTypeSort",
)({ sortOrder: S.String, sortBy: S.String }) {}
export const ChannelHandshakePayload = S.Union(
  S.Struct({ startServicePeriodPayload: StartServicePeriodPayload }),
  S.Struct({ revokeServicePeriodPayload: RevokeServicePeriodPayload }),
);
export const ListChannelHandshakesTypeFilters = S.Union(
  S.Struct({ startServicePeriodTypeFilters: StartServicePeriodTypeFilters }),
  S.Struct({ revokeServicePeriodTypeFilters: RevokeServicePeriodTypeFilters }),
  S.Struct({
    programManagementAccountTypeFilters: ProgramManagementAccountTypeFilters,
  }),
);
export const ListChannelHandshakesTypeSort = S.Union(
  S.Struct({ startServicePeriodTypeSort: StartServicePeriodTypeSort }),
  S.Struct({ revokeServicePeriodTypeSort: RevokeServicePeriodTypeSort }),
  S.Struct({
    programManagementAccountTypeSort: ProgramManagementAccountTypeSort,
  }),
);
export class AcceptChannelHandshakeDetail extends S.Class<AcceptChannelHandshakeDetail>(
  "AcceptChannelHandshakeDetail",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CancelChannelHandshakeDetail extends S.Class<CancelChannelHandshakeDetail>(
  "CancelChannelHandshakeDetail",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class RejectChannelHandshakeDetail extends S.Class<RejectChannelHandshakeDetail>(
  "RejectChannelHandshakeDetail",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CreateProgramManagementAccountDetail extends S.Class<CreateProgramManagementAccountDetail>(
  "CreateProgramManagementAccountDetail",
)({ id: S.optional(S.String), arn: S.optional(S.String) }) {}
export class UpdateProgramManagementAccountDetail extends S.Class<UpdateProgramManagementAccountDetail>(
  "UpdateProgramManagementAccountDetail",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  revision: S.optional(S.String),
  displayName: S.optional(S.String),
}) {}
export class RelationshipDetail extends S.Class<RelationshipDetail>(
  "RelationshipDetail",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  revision: S.optional(S.String),
  catalog: S.optional(S.String),
  associationType: S.optional(S.String),
  programManagementAccountId: S.optional(S.String),
  associatedAccountId: S.optional(S.String),
  displayName: S.optional(S.String),
  resaleAccountModel: S.optional(S.String),
  sector: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateRelationshipDetail extends S.Class<UpdateRelationshipDetail>(
  "UpdateRelationshipDetail",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  revision: S.optional(S.String),
  displayName: S.optional(S.String),
}) {}
export class CreateChannelHandshakeRequest extends S.Class<CreateChannelHandshakeRequest>(
  "CreateChannelHandshakeRequest",
)(
  {
    handshakeType: S.String,
    catalog: S.String,
    associatedResourceIdentifier: S.String,
    payload: S.optional(ChannelHandshakePayload),
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateChannelHandshake" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelHandshakesRequest extends S.Class<ListChannelHandshakesRequest>(
  "ListChannelHandshakesRequest",
)(
  {
    handshakeType: S.String,
    catalog: S.String,
    participantType: S.String,
    maxResults: S.optional(S.Number),
    statuses: S.optional(HandshakeStatusList),
    associatedResourceIdentifiers: S.optional(AssociatedResourceIdentifierList),
    handshakeTypeFilters: S.optional(ListChannelHandshakesTypeFilters),
    handshakeTypeSort: S.optional(ListChannelHandshakesTypeSort),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListChannelHandshakes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptChannelHandshakeResponse extends S.Class<AcceptChannelHandshakeResponse>(
  "AcceptChannelHandshakeResponse",
)({ channelHandshakeDetail: S.optional(AcceptChannelHandshakeDetail) }) {}
export class CancelChannelHandshakeResponse extends S.Class<CancelChannelHandshakeResponse>(
  "CancelChannelHandshakeResponse",
)({ channelHandshakeDetail: S.optional(CancelChannelHandshakeDetail) }) {}
export class RejectChannelHandshakeResponse extends S.Class<RejectChannelHandshakeResponse>(
  "RejectChannelHandshakeResponse",
)({ channelHandshakeDetail: S.optional(RejectChannelHandshakeDetail) }) {}
export class CreateProgramManagementAccountResponse extends S.Class<CreateProgramManagementAccountResponse>(
  "CreateProgramManagementAccountResponse",
)({
  programManagementAccountDetail: S.optional(
    CreateProgramManagementAccountDetail,
  ),
}) {}
export class UpdateProgramManagementAccountResponse extends S.Class<UpdateProgramManagementAccountResponse>(
  "UpdateProgramManagementAccountResponse",
)({
  programManagementAccountDetail: S.optional(
    UpdateProgramManagementAccountDetail,
  ),
}) {}
export class CreateRelationshipRequest extends S.Class<CreateRelationshipRequest>(
  "CreateRelationshipRequest",
)(
  {
    catalog: S.String,
    associationType: S.String,
    programManagementAccountIdentifier: S.String,
    associatedAccountId: S.String,
    displayName: S.String,
    resaleAccountModel: S.optional(S.String),
    sector: S.String,
    clientToken: S.optional(S.String),
    tags: S.optional(TagList),
    requestedSupportPlan: S.optional(SupportPlan),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateRelationship" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRelationshipResponse extends S.Class<GetRelationshipResponse>(
  "GetRelationshipResponse",
)({ relationshipDetail: S.optional(RelationshipDetail) }) {}
export class UpdateRelationshipResponse extends S.Class<UpdateRelationshipResponse>(
  "UpdateRelationshipResponse",
)({ relationshipDetail: S.optional(UpdateRelationshipDetail) }) {}
export class ProgramManagementAccountSummary extends S.Class<ProgramManagementAccountSummary>(
  "ProgramManagementAccountSummary",
)({
  id: S.optional(S.String),
  revision: S.optional(S.String),
  catalog: S.optional(S.String),
  program: S.optional(S.String),
  displayName: S.optional(S.String),
  accountId: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
}) {}
export const ProgramManagementAccountSummaries = S.Array(
  ProgramManagementAccountSummary,
);
export class RelationshipSummary extends S.Class<RelationshipSummary>(
  "RelationshipSummary",
)({
  arn: S.optional(S.String),
  id: S.optional(S.String),
  revision: S.optional(S.String),
  catalog: S.optional(S.String),
  associationType: S.optional(S.String),
  programManagementAccountId: S.optional(S.String),
  associatedAccountId: S.optional(S.String),
  displayName: S.optional(S.String),
  sector: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const RelationshipSummaries = S.Array(RelationshipSummary);
export class ListProgramManagementAccountsResponse extends S.Class<ListProgramManagementAccountsResponse>(
  "ListProgramManagementAccountsResponse",
)({
  items: S.optional(ProgramManagementAccountSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListRelationshipsResponse extends S.Class<ListRelationshipsResponse>(
  "ListRelationshipsResponse",
)({
  items: S.optional(RelationshipSummaries),
  nextToken: S.optional(S.String),
}) {}
export class CreateChannelHandshakeDetail extends S.Class<CreateChannelHandshakeDetail>(
  "CreateChannelHandshakeDetail",
)({ id: S.optional(S.String), arn: S.optional(S.String) }) {}
export class CreateRelationshipDetail extends S.Class<CreateRelationshipDetail>(
  "CreateRelationshipDetail",
)({ arn: S.optional(S.String), id: S.optional(S.String) }) {}
export class CreateChannelHandshakeResponse extends S.Class<CreateChannelHandshakeResponse>(
  "CreateChannelHandshakeResponse",
)({ channelHandshakeDetail: S.optional(CreateChannelHandshakeDetail) }) {}
export class CreateRelationshipResponse extends S.Class<CreateRelationshipResponse>(
  "CreateRelationshipResponse",
)({ relationshipDetail: S.optional(CreateRelationshipDetail) }) {}
export class StartServicePeriodHandshakeDetail extends S.Class<StartServicePeriodHandshakeDetail>(
  "StartServicePeriodHandshakeDetail",
)({
  note: S.optional(S.String),
  servicePeriodType: S.optional(S.String),
  minimumNoticeDays: S.optional(S.String),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class RevokeServicePeriodHandshakeDetail extends S.Class<RevokeServicePeriodHandshakeDetail>(
  "RevokeServicePeriodHandshakeDetail",
)({
  note: S.optional(S.String),
  servicePeriodType: S.optional(S.String),
  minimumNoticeDays: S.optional(S.String),
  startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ProgramManagementAccountHandshakeDetail extends S.Class<ProgramManagementAccountHandshakeDetail>(
  "ProgramManagementAccountHandshakeDetail",
)({ program: S.optional(S.String) }) {}
export const HandshakeDetail = S.Union(
  S.Struct({
    startServicePeriodHandshakeDetail: StartServicePeriodHandshakeDetail,
  }),
  S.Struct({
    revokeServicePeriodHandshakeDetail: RevokeServicePeriodHandshakeDetail,
  }),
  S.Struct({
    programManagementAccountHandshakeDetail:
      ProgramManagementAccountHandshakeDetail,
  }),
);
export class ChannelHandshakeSummary extends S.Class<ChannelHandshakeSummary>(
  "ChannelHandshakeSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  catalog: S.optional(S.String),
  handshakeType: S.optional(S.String),
  ownerAccountId: S.optional(S.String),
  senderAccountId: S.optional(S.String),
  senderDisplayName: S.optional(S.String),
  receiverAccountId: S.optional(S.String),
  associatedResourceId: S.optional(S.String),
  detail: S.optional(HandshakeDetail),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  status: S.optional(S.String),
}) {}
export const ChannelHandshakeSummaries = S.Array(ChannelHandshakeSummary);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, code: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ListChannelHandshakesResponse extends S.Class<ListChannelHandshakesResponse>(
  "ListChannelHandshakesResponse",
)({
  items: S.optional(ChannelHandshakeSummaries),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String, reason: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    quotaCode: S.String,
  },
  T.Retryable(),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Lists tags associated with a specific resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new program management account for managing partner relationships.
 */
export const createProgramManagementAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateProgramManagementAccountRequest,
    output: CreateProgramManagementAccountResponse,
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
 * Deletes a program management account.
 */
export const deleteProgramManagementAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProgramManagementAccountRequest,
    output: DeleteProgramManagementAccountResponse,
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
 * Deletes a partner relationship.
 */
export const deleteRelationship = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRelationshipRequest,
  output: DeleteRelationshipResponse,
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
 * Adds or updates tags for a specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
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
 * Removes tags from a specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
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
 * Accepts a pending channel handshake request from another AWS account.
 */
export const acceptChannelHandshake = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptChannelHandshakeRequest,
    output: AcceptChannelHandshakeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Cancels a pending channel handshake request.
 */
export const cancelChannelHandshake = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelChannelHandshakeRequest,
    output: CancelChannelHandshakeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Rejects a pending channel handshake request.
 */
export const rejectChannelHandshake = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectChannelHandshakeRequest,
    output: RejectChannelHandshakeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the properties of a program management account.
 */
export const updateProgramManagementAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProgramManagementAccountRequest,
    output: UpdateProgramManagementAccountResponse,
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
 * Retrieves details of a specific partner relationship.
 */
export const getRelationship = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRelationshipRequest,
  output: GetRelationshipResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of a partner relationship.
 */
export const updateRelationship = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRelationshipRequest,
  output: UpdateRelationshipResponse,
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
 * Lists program management accounts based on specified criteria.
 */
export const listProgramManagementAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProgramManagementAccountsRequest,
    output: ListProgramManagementAccountsResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists partner relationships based on specified criteria.
 */
export const listRelationships = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRelationshipsRequest,
    output: ListRelationshipsResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a new channel handshake request to establish a partnership with another AWS account.
 */
export const createChannelHandshake = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateChannelHandshakeRequest,
    output: CreateChannelHandshakeResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new partner relationship between accounts.
 */
export const createRelationship = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRelationshipRequest,
  output: CreateRelationshipResponse,
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
 * Lists channel handshakes based on specified criteria.
 */
export const listChannelHandshakes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListChannelHandshakesRequest,
    output: ListChannelHandshakesResponse,
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
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));

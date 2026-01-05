import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MPA",
  serviceShapeName: "AWSFluffyCoreService",
});
const auth = T.AwsAuthSigv4({ name: "mpa" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsRestJson1();
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                  ],
                  endpoint: {
                    url: "https://mpa-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://mpa.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export class GetPolicyVersionRequest extends S.Class<GetPolicyVersionRequest>(
  "GetPolicyVersionRequest",
)(
  { PolicyVersionArn: S.String.pipe(T.HttpLabel("PolicyVersionArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/policy-versions/{PolicyVersionArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String, PolicyName: S.String, PolicyType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetResourcePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyVersionsRequest extends S.Class<ListPolicyVersionsRequest>(
  "ListPolicyVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PolicyArn: S.String.pipe(T.HttpLabel("PolicyArn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies/{PolicyArn}/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourcePoliciesRequest extends S.Class<ListResourcePoliciesRequest>(
  "ListResourcePoliciesRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resource-policies/{ResourceArn}/?List" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList,
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
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetApprovalTeamRequest extends S.Class<GetApprovalTeamRequest>(
  "GetApprovalTeamRequest",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/approval-teams/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MofNApprovalStrategy extends S.Class<MofNApprovalStrategy>(
  "MofNApprovalStrategy",
)({ MinApprovalsRequired: S.Number }) {}
export const ApprovalStrategy = S.Union(
  S.Struct({ MofN: MofNApprovalStrategy }),
);
export class ApprovalTeamRequestApprover extends S.Class<ApprovalTeamRequestApprover>(
  "ApprovalTeamRequestApprover",
)({ PrimaryIdentityId: S.String, PrimaryIdentitySourceArn: S.String }) {}
export const ApprovalTeamRequestApprovers = S.Array(
  ApprovalTeamRequestApprover,
);
export class UpdateApprovalTeamRequest extends S.Class<UpdateApprovalTeamRequest>(
  "UpdateApprovalTeamRequest",
)(
  {
    ApprovalStrategy: S.optional(ApprovalStrategy),
    Approvers: S.optional(ApprovalTeamRequestApprovers),
    Description: S.optional(S.String),
    Arn: S.String.pipe(T.HttpLabel("Arn")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/approval-teams/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInactiveApprovalTeamVersionRequest extends S.Class<DeleteInactiveApprovalTeamVersionRequest>(
  "DeleteInactiveApprovalTeamVersionRequest",
)(
  {
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/approval-teams/{Arn}/{VersionId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInactiveApprovalTeamVersionResponse extends S.Class<DeleteInactiveApprovalTeamVersionResponse>(
  "DeleteInactiveApprovalTeamVersionResponse",
)({}) {}
export class ListApprovalTeamsRequest extends S.Class<ListApprovalTeamsRequest>(
  "ListApprovalTeamsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/approval-teams/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartActiveApprovalTeamDeletionRequest extends S.Class<StartActiveApprovalTeamDeletionRequest>(
  "StartActiveApprovalTeamDeletionRequest",
)(
  {
    PendingWindowDays: S.optional(S.Number),
    Arn: S.String.pipe(T.HttpLabel("Arn")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/approval-teams/{Arn}?Delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetIdentitySourceRequest extends S.Class<GetIdentitySourceRequest>(
  "GetIdentitySourceRequest",
)(
  { IdentitySourceArn: S.String.pipe(T.HttpLabel("IdentitySourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/identity-sources/{IdentitySourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdentitySourceRequest extends S.Class<DeleteIdentitySourceRequest>(
  "DeleteIdentitySourceRequest",
)(
  { IdentitySourceArn: S.String.pipe(T.HttpLabel("IdentitySourceArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/identity-sources/{IdentitySourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdentitySourceResponse extends S.Class<DeleteIdentitySourceResponse>(
  "DeleteIdentitySourceResponse",
)({}) {}
export class ListIdentitySourcesRequest extends S.Class<ListIdentitySourcesRequest>(
  "ListIdentitySourcesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identity-sources/?List" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  { SessionArn: S.String.pipe(T.HttpLabel("SessionArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/sessions/{SessionArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSessionRequest extends S.Class<CancelSessionRequest>(
  "CancelSessionRequest",
)(
  { SessionArn: S.String.pipe(T.HttpLabel("SessionArn")) },
  T.all(
    T.Http({ method: "PUT", uri: "/sessions/{SessionArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSessionResponse extends S.Class<CancelSessionResponse>(
  "CancelSessionResponse",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class PolicyReference extends S.Class<PolicyReference>(
  "PolicyReference",
)({ PolicyArn: S.String }) {}
export const PoliciesReferences = S.Array(PolicyReference);
export class Filter extends S.Class<Filter>("Filter")({
  FieldName: S.optional(S.String),
  Operator: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const Filters = S.Array(Filter);
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({
  ResourceArn: S.String,
  PolicyType: S.String,
  PolicyVersionArn: S.optional(S.String),
  PolicyName: S.String,
  PolicyDocument: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export class UpdateApprovalTeamResponse extends S.Class<UpdateApprovalTeamResponse>(
  "UpdateApprovalTeamResponse",
)({ VersionId: S.optional(S.String) }) {}
export class StartActiveApprovalTeamDeletionResponse extends S.Class<StartActiveApprovalTeamDeletionResponse>(
  "StartActiveApprovalTeamDeletionResponse",
)({
  DeletionCompletionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  DeletionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    ApprovalTeamArn: S.String.pipe(T.HttpLabel("ApprovalTeamArn")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/approval-teams/{ApprovalTeamArn}/sessions/?List",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class IamIdentityCenter extends S.Class<IamIdentityCenter>(
  "IamIdentityCenter",
)({ InstanceArn: S.String, Region: S.String }) {}
export class PolicyVersion extends S.Class<PolicyVersion>("PolicyVersion")({
  Arn: S.String,
  PolicyArn: S.String,
  VersionId: S.Number,
  PolicyType: S.String,
  IsDefault: S.Boolean,
  Name: S.String,
  Status: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Document: S.String,
}) {}
export class Policy extends S.Class<Policy>("Policy")({
  Arn: S.String,
  DefaultVersion: S.Number,
  PolicyType: S.String,
  Name: S.String,
}) {}
export const Policies = S.Array(Policy);
export class PolicyVersionSummary extends S.Class<PolicyVersionSummary>(
  "PolicyVersionSummary",
)({
  Arn: S.String,
  PolicyArn: S.String,
  VersionId: S.Number,
  PolicyType: S.String,
  IsDefault: S.Boolean,
  Name: S.String,
  Status: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PolicyVersions = S.Array(PolicyVersionSummary);
export class ListResourcePoliciesResponseResourcePolicy extends S.Class<ListResourcePoliciesResponseResourcePolicy>(
  "ListResourcePoliciesResponseResourcePolicy",
)({
  PolicyArn: S.optional(S.String),
  PolicyType: S.optional(S.String),
  PolicyName: S.optional(S.String),
}) {}
export const ListResourcePoliciesResponseResourcePolicies = S.Array(
  ListResourcePoliciesResponseResourcePolicy,
);
export const ApprovalStrategyResponse = S.Union(
  S.Struct({ MofN: MofNApprovalStrategy }),
);
export class GetApprovalTeamResponseApprover extends S.Class<GetApprovalTeamResponseApprover>(
  "GetApprovalTeamResponseApprover",
)({
  ApproverId: S.optional(S.String),
  ResponseTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PrimaryIdentityId: S.optional(S.String),
  PrimaryIdentitySourceArn: S.optional(S.String),
  PrimaryIdentityStatus: S.optional(S.String),
}) {}
export const GetApprovalTeamResponseApprovers = S.Array(
  GetApprovalTeamResponseApprover,
);
export class PendingUpdate extends S.Class<PendingUpdate>("PendingUpdate")({
  VersionId: S.optional(S.String),
  Description: S.optional(S.String),
  ApprovalStrategy: S.optional(ApprovalStrategyResponse),
  NumberOfApprovers: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  Approvers: S.optional(GetApprovalTeamResponseApprovers),
  UpdateInitiationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListApprovalTeamsResponseApprovalTeam extends S.Class<ListApprovalTeamsResponseApprovalTeam>(
  "ListApprovalTeamsResponseApprovalTeam",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ApprovalStrategy: S.optional(ApprovalStrategyResponse),
  NumberOfApprovers: S.optional(S.Number),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const ListApprovalTeamsResponseApprovalTeams = S.Array(
  ListApprovalTeamsResponseApprovalTeam,
);
export class IdentitySourceParameters extends S.Class<IdentitySourceParameters>(
  "IdentitySourceParameters",
)({ IamIdentityCenter: S.optional(IamIdentityCenter) }) {}
export const SessionMetadata = S.Record({ key: S.String, value: S.String });
export class GetSessionResponseApproverResponse extends S.Class<GetSessionResponseApproverResponse>(
  "GetSessionResponseApproverResponse",
)({
  ApproverId: S.optional(S.String),
  IdentitySourceArn: S.optional(S.String),
  IdentityId: S.optional(S.String),
  Response: S.optional(S.String),
  ResponseTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const GetSessionResponseApproverResponses = S.Array(
  GetSessionResponseApproverResponse,
);
export class GetPolicyVersionResponse extends S.Class<GetPolicyVersionResponse>(
  "GetPolicyVersionResponse",
)({ PolicyVersion: PolicyVersion }) {}
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)({ NextToken: S.optional(S.String), Policies: S.optional(Policies) }) {}
export class ListPolicyVersionsResponse extends S.Class<ListPolicyVersionsResponse>(
  "ListPolicyVersionsResponse",
)({
  NextToken: S.optional(S.String),
  PolicyVersions: S.optional(PolicyVersions),
}) {}
export class ListResourcePoliciesResponse extends S.Class<ListResourcePoliciesResponse>(
  "ListResourcePoliciesResponse",
)({
  NextToken: S.optional(S.String),
  ResourcePolicies: S.optional(ListResourcePoliciesResponseResourcePolicies),
}) {}
export class CreateApprovalTeamRequest extends S.Class<CreateApprovalTeamRequest>(
  "CreateApprovalTeamRequest",
)(
  {
    ClientToken: S.optional(S.String),
    ApprovalStrategy: ApprovalStrategy,
    Approvers: ApprovalTeamRequestApprovers,
    Description: S.String,
    Policies: PoliciesReferences,
    Name: S.String,
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/approval-teams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApprovalTeamResponse extends S.Class<GetApprovalTeamResponse>(
  "GetApprovalTeamResponse",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ApprovalStrategy: S.optional(ApprovalStrategyResponse),
  NumberOfApprovers: S.optional(S.Number),
  Approvers: S.optional(GetApprovalTeamResponseApprovers),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  UpdateSessionArn: S.optional(S.String),
  VersionId: S.optional(S.String),
  Policies: S.optional(PoliciesReferences),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PendingUpdate: S.optional(PendingUpdate),
}) {}
export class ListApprovalTeamsResponse extends S.Class<ListApprovalTeamsResponse>(
  "ListApprovalTeamsResponse",
)({
  NextToken: S.optional(S.String),
  ApprovalTeams: S.optional(ListApprovalTeamsResponseApprovalTeams),
}) {}
export class CreateIdentitySourceRequest extends S.Class<CreateIdentitySourceRequest>(
  "CreateIdentitySourceRequest",
)(
  {
    IdentitySourceParameters: IdentitySourceParameters,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identity-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
  SessionArn: S.optional(S.String),
  ApprovalTeamArn: S.optional(S.String),
  ApprovalTeamName: S.optional(S.String),
  ProtectedResourceArn: S.optional(S.String),
  ApprovalStrategy: S.optional(ApprovalStrategyResponse),
  NumberOfApprovers: S.optional(S.Number),
  InitiationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  Metadata: S.optional(SessionMetadata),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ExecutionStatus: S.optional(S.String),
  ActionName: S.optional(S.String),
  RequesterServicePrincipal: S.optional(S.String),
  RequesterPrincipalArn: S.optional(S.String),
  RequesterAccountId: S.optional(S.String),
  RequesterRegion: S.optional(S.String),
  RequesterComment: S.optional(S.String),
  ActionCompletionStrategy: S.optional(S.String),
  ApproverResponses: S.optional(GetSessionResponseApproverResponses),
}) {}
export class IamIdentityCenterForGet extends S.Class<IamIdentityCenterForGet>(
  "IamIdentityCenterForGet",
)({
  InstanceArn: S.optional(S.String),
  ApprovalPortalUrl: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export const IdentitySourceParametersForGet = S.Union(
  S.Struct({ IamIdentityCenter: IamIdentityCenterForGet }),
);
export class ListSessionsResponseSession extends S.Class<ListSessionsResponseSession>(
  "ListSessionsResponseSession",
)({
  SessionArn: S.optional(S.String),
  ApprovalTeamName: S.optional(S.String),
  ApprovalTeamArn: S.optional(S.String),
  InitiationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  ActionName: S.optional(S.String),
  ProtectedResourceArn: S.optional(S.String),
  RequesterServicePrincipal: S.optional(S.String),
  RequesterPrincipalArn: S.optional(S.String),
  RequesterRegion: S.optional(S.String),
  RequesterAccountId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ActionCompletionStrategy: S.optional(S.String),
}) {}
export const ListSessionsResponseSessions = S.Array(
  ListSessionsResponseSession,
);
export class IamIdentityCenterForList extends S.Class<IamIdentityCenterForList>(
  "IamIdentityCenterForList",
)({
  InstanceArn: S.optional(S.String),
  ApprovalPortalUrl: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export class CreateApprovalTeamResponse extends S.Class<CreateApprovalTeamResponse>(
  "CreateApprovalTeamResponse",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  VersionId: S.optional(S.String),
}) {}
export class CreateIdentitySourceResponse extends S.Class<CreateIdentitySourceResponse>(
  "CreateIdentitySourceResponse",
)({
  IdentitySourceType: S.optional(S.String),
  IdentitySourceArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetIdentitySourceResponse extends S.Class<GetIdentitySourceResponse>(
  "GetIdentitySourceResponse",
)({
  IdentitySourceType: S.optional(S.String),
  IdentitySourceParameters: S.optional(IdentitySourceParametersForGet),
  IdentitySourceArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({
  NextToken: S.optional(S.String),
  Sessions: S.optional(ListSessionsResponseSessions),
}) {}
export const IdentitySourceParametersForList = S.Union(
  S.Struct({ IamIdentityCenter: IamIdentityCenterForList }),
);
export class IdentitySourceForList extends S.Class<IdentitySourceForList>(
  "IdentitySourceForList",
)({
  IdentitySourceType: S.optional(S.String),
  IdentitySourceParameters: S.optional(IdentitySourceParametersForList),
  IdentitySourceArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  StatusCode: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const IdentitySources = S.Array(IdentitySourceForList);
export class ListIdentitySourcesResponse extends S.Class<ListIdentitySourcesResponse>(
  "ListIdentitySourcesResponse",
)({
  NextToken: S.optional(S.String),
  IdentitySources: S.optional(IdentitySources),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.String, ResourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of approval teams.
 */
export const listApprovalTeams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApprovalTeamsRequest,
  output: ListApprovalTeamsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of identity sources. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const listIdentitySources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentitySourcesRequest,
  output: ListIdentitySourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a new identity source. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const createIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIdentitySourceRequest,
    output: CreateIdentitySourceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an approval team. You can request to update the team description, approval threshold, and approvers in the team.
 *
 * **Updates require team approval**
 *
 * Updates to an active team must be approved by the team.
 */
export const updateApprovalTeam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApprovalTeamRequest,
  output: UpdateApprovalTeamResponse,
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
 * Returns details for an identity source. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const getIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentitySourceRequest,
  output: GetIdentitySourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of approval sessions. For more information, see Session in the *Multi-party approval User Guide*.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details for an approval team.
 */
export const getApprovalTeam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApprovalTeamRequest,
  output: GetApprovalTeamResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details for an approval session. For more information, see Session in the *Multi-party approval User Guide*.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details about a policy for a resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InvalidParameterException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the tags for a resource.
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
 * Returns details for the version of a policy. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const getPolicyVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyVersionRequest,
  output: GetPolicyVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the versions for policies. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const listPolicyVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of policies for a resource.
 */
export const listResourcePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourcePoliciesRequest,
    output: ListResourcePoliciesResponse,
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
 * Starts the deletion process for an active approval team.
 *
 * **Deletions require team approval**
 *
 * Requests to delete an active team must be approved by the team.
 */
export const startActiveApprovalTeamDeletion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartActiveApprovalTeamDeletionRequest,
    output: StartActiveApprovalTeamDeletionResponse,
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
 * Deletes an inactive approval team. For more information, see Team health in the *Multi-party approval User Guide*.
 *
 * You can also use this operation to delete a team draft. For more information, see Interacting with drafts in the *Multi-party approval User Guide*.
 */
export const deleteInactiveApprovalTeamVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteInactiveApprovalTeamVersionRequest,
    output: DeleteInactiveApprovalTeamVersionResponse,
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
 * Cancels an approval session. For more information, see Session in the *Multi-party approval User Guide*.
 */
export const cancelSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSessionRequest,
  output: CancelSessionResponse,
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
 * Returns a list of policies. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an identity source. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const deleteIdentitySource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdentitySourceRequest,
    output: DeleteIdentitySourceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new approval team. For more information, see Approval team in the *Multi-party approval User Guide*.
 */
export const createApprovalTeam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApprovalTeamRequest,
  output: CreateApprovalTeamResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

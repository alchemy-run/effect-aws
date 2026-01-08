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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "MPA",
  serviceShapeName: "AWSFluffyCoreService",
});
const auth = T.AwsAuthSigv4({ name: "mpa" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://mpa-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://mpa.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type QualifiedPolicyArn = string;
export type MaxResults = number;
export type Token = string;
export type UnqualifiedPolicyArn = string;
export type TagKey = string | Redacted.Redacted<string>;
export type Description = string | Redacted.Redacted<string>;
export type ApprovalTeamName = string;
export type ApprovalTeamArn = string;
export type SessionArn = string;
export type TagValue = string | Redacted.Redacted<string>;
export type IdentityId = string;
export type PolicyName = string;
export type PolicyDocument = string | Redacted.Redacted<string>;
export type Message = string;
export type ActionName = string;
export type ServicePrincipal = string;
export type AccountId = string;
export type Region = string;
export type RequesterComment = string | Redacted.Redacted<string>;
export type IdcInstanceArn = string;
export type PolicyVersionId = number;
export type ParticipantId = string;
export type SessionKey = string | Redacted.Redacted<string>;
export type SessionValue = string | Redacted.Redacted<string>;

//# Schemas
export type TagKeyList = string | Redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface GetPolicyVersionRequest {
  PolicyVersionArn: string;
}
export const GetPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    PolicyVersionArn: S.String.pipe(T.HttpLabel("PolicyVersionArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policy-versions/{PolicyVersionArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPolicyVersionRequest",
}) as any as S.Schema<GetPolicyVersionRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
  PolicyName: string;
  PolicyType: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    PolicyName: S.String,
    PolicyType: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourcePolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListPoliciesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPoliciesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies/?List" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPoliciesRequest",
}) as any as S.Schema<ListPoliciesRequest>;
export interface ListPolicyVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
  PolicyArn: string;
}
export const ListPolicyVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PolicyArn: S.String.pipe(T.HttpLabel("PolicyArn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies/{PolicyArn}/?List" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPolicyVersionsRequest",
}) as any as S.Schema<ListPolicyVersionsRequest>;
export interface ListResourcePoliciesRequest {
  ResourceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourcePoliciesRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/resource-policies/{ResourceArn}/?List" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcePoliciesRequest",
}) as any as S.Schema<ListResourcePoliciesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export interface GetApprovalTeamRequest {
  Arn: string;
}
export const GetApprovalTeamRequest = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/approval-teams/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApprovalTeamRequest",
}) as any as S.Schema<GetApprovalTeamRequest>;
export interface MofNApprovalStrategy {
  MinApprovalsRequired: number;
}
export const MofNApprovalStrategy = S.suspend(() =>
  S.Struct({ MinApprovalsRequired: S.Number }),
).annotations({
  identifier: "MofNApprovalStrategy",
}) as any as S.Schema<MofNApprovalStrategy>;
export type ApprovalStrategy = { MofN: MofNApprovalStrategy };
export const ApprovalStrategy = S.Union(
  S.Struct({ MofN: MofNApprovalStrategy }),
);
export interface ApprovalTeamRequestApprover {
  PrimaryIdentityId: string;
  PrimaryIdentitySourceArn: string;
}
export const ApprovalTeamRequestApprover = S.suspend(() =>
  S.Struct({ PrimaryIdentityId: S.String, PrimaryIdentitySourceArn: S.String }),
).annotations({
  identifier: "ApprovalTeamRequestApprover",
}) as any as S.Schema<ApprovalTeamRequestApprover>;
export type ApprovalTeamRequestApprovers = ApprovalTeamRequestApprover[];
export const ApprovalTeamRequestApprovers = S.Array(
  ApprovalTeamRequestApprover,
);
export interface UpdateApprovalTeamRequest {
  ApprovalStrategy?: (typeof ApprovalStrategy)["Type"];
  Approvers?: ApprovalTeamRequestApprovers;
  Description?: string | Redacted.Redacted<string>;
  Arn: string;
}
export const UpdateApprovalTeamRequest = S.suspend(() =>
  S.Struct({
    ApprovalStrategy: S.optional(ApprovalStrategy),
    Approvers: S.optional(ApprovalTeamRequestApprovers),
    Description: S.optional(SensitiveString),
    Arn: S.String.pipe(T.HttpLabel("Arn")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/approval-teams/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApprovalTeamRequest",
}) as any as S.Schema<UpdateApprovalTeamRequest>;
export interface DeleteInactiveApprovalTeamVersionRequest {
  Arn: string;
  VersionId: string;
}
export const DeleteInactiveApprovalTeamVersionRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String.pipe(T.HttpLabel("Arn")),
    VersionId: S.String.pipe(T.HttpLabel("VersionId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/approval-teams/{Arn}/{VersionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInactiveApprovalTeamVersionRequest",
}) as any as S.Schema<DeleteInactiveApprovalTeamVersionRequest>;
export interface DeleteInactiveApprovalTeamVersionResponse {}
export const DeleteInactiveApprovalTeamVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInactiveApprovalTeamVersionResponse",
}) as any as S.Schema<DeleteInactiveApprovalTeamVersionResponse>;
export interface ListApprovalTeamsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListApprovalTeamsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/approval-teams/?List" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApprovalTeamsRequest",
}) as any as S.Schema<ListApprovalTeamsRequest>;
export interface StartActiveApprovalTeamDeletionRequest {
  PendingWindowDays?: number;
  Arn: string;
}
export const StartActiveApprovalTeamDeletionRequest = S.suspend(() =>
  S.Struct({
    PendingWindowDays: S.optional(S.Number),
    Arn: S.String.pipe(T.HttpLabel("Arn")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/approval-teams/{Arn}?Delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartActiveApprovalTeamDeletionRequest",
}) as any as S.Schema<StartActiveApprovalTeamDeletionRequest>;
export interface GetIdentitySourceRequest {
  IdentitySourceArn: string;
}
export const GetIdentitySourceRequest = S.suspend(() =>
  S.Struct({
    IdentitySourceArn: S.String.pipe(T.HttpLabel("IdentitySourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/identity-sources/{IdentitySourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentitySourceRequest",
}) as any as S.Schema<GetIdentitySourceRequest>;
export interface DeleteIdentitySourceRequest {
  IdentitySourceArn: string;
}
export const DeleteIdentitySourceRequest = S.suspend(() =>
  S.Struct({
    IdentitySourceArn: S.String.pipe(T.HttpLabel("IdentitySourceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/identity-sources/{IdentitySourceArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdentitySourceRequest",
}) as any as S.Schema<DeleteIdentitySourceRequest>;
export interface DeleteIdentitySourceResponse {}
export const DeleteIdentitySourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdentitySourceResponse",
}) as any as S.Schema<DeleteIdentitySourceResponse>;
export interface ListIdentitySourcesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListIdentitySourcesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identity-sources/?List" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentitySourcesRequest",
}) as any as S.Schema<ListIdentitySourcesRequest>;
export interface GetSessionRequest {
  SessionArn: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({ SessionArn: S.String.pipe(T.HttpLabel("SessionArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/sessions/{SessionArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface CancelSessionRequest {
  SessionArn: string;
}
export const CancelSessionRequest = S.suspend(() =>
  S.Struct({ SessionArn: S.String.pipe(T.HttpLabel("SessionArn")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/sessions/{SessionArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelSessionRequest",
}) as any as S.Schema<CancelSessionRequest>;
export interface CancelSessionResponse {}
export const CancelSessionResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CancelSessionResponse",
}) as any as S.Schema<CancelSessionResponse>;
export type Tags = { [key: string]: string | Redacted.Redacted<string> };
export const Tags = S.Record({ key: S.String, value: SensitiveString });
export interface PolicyReference {
  PolicyArn: string;
}
export const PolicyReference = S.suspend(() =>
  S.Struct({ PolicyArn: S.String }),
).annotations({
  identifier: "PolicyReference",
}) as any as S.Schema<PolicyReference>;
export type PoliciesReferences = PolicyReference[];
export const PoliciesReferences = S.Array(PolicyReference);
export interface Filter {
  FieldName?: string;
  Operator?: string;
  Value?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(S.String),
    Operator: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface GetResourcePolicyResponse {
  ResourceArn: string;
  PolicyType: string;
  PolicyVersionArn?: string;
  PolicyName: string;
  PolicyDocument: string | Redacted.Redacted<string>;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    PolicyType: S.String,
    PolicyVersionArn: S.optional(S.String),
    PolicyName: S.String,
    PolicyDocument: SensitiveString,
  }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export interface UpdateApprovalTeamResponse {
  VersionId?: string;
}
export const UpdateApprovalTeamResponse = S.suspend(() =>
  S.Struct({ VersionId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateApprovalTeamResponse",
}) as any as S.Schema<UpdateApprovalTeamResponse>;
export interface StartActiveApprovalTeamDeletionResponse {
  DeletionCompletionTime?: Date;
  DeletionStartTime?: Date;
}
export const StartActiveApprovalTeamDeletionResponse = S.suspend(() =>
  S.Struct({
    DeletionCompletionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeletionStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartActiveApprovalTeamDeletionResponse",
}) as any as S.Schema<StartActiveApprovalTeamDeletionResponse>;
export interface ListSessionsRequest {
  ApprovalTeamArn: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: Filters;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    ApprovalTeamArn: S.String.pipe(T.HttpLabel("ApprovalTeamArn")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface IamIdentityCenter {
  InstanceArn: string;
  Region: string;
}
export const IamIdentityCenter = S.suspend(() =>
  S.Struct({ InstanceArn: S.String, Region: S.String }),
).annotations({
  identifier: "IamIdentityCenter",
}) as any as S.Schema<IamIdentityCenter>;
export interface PolicyVersion {
  Arn: string;
  PolicyArn: string;
  VersionId: number;
  PolicyType: string;
  IsDefault: boolean;
  Name: string;
  Status: string;
  CreationTime: Date;
  LastUpdatedTime: Date;
  Document: string | Redacted.Redacted<string>;
}
export const PolicyVersion = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    PolicyArn: S.String,
    VersionId: S.Number,
    PolicyType: S.String,
    IsDefault: S.Boolean,
    Name: S.String,
    Status: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Document: SensitiveString,
  }),
).annotations({
  identifier: "PolicyVersion",
}) as any as S.Schema<PolicyVersion>;
export interface Policy {
  Arn: string;
  DefaultVersion: number;
  PolicyType: string;
  Name: string;
}
export const Policy = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    DefaultVersion: S.Number,
    PolicyType: S.String,
    Name: S.String,
  }),
).annotations({ identifier: "Policy" }) as any as S.Schema<Policy>;
export type Policies = Policy[];
export const Policies = S.Array(Policy);
export interface PolicyVersionSummary {
  Arn: string;
  PolicyArn: string;
  VersionId: number;
  PolicyType: string;
  IsDefault: boolean;
  Name: string;
  Status: string;
  CreationTime: Date;
  LastUpdatedTime: Date;
}
export const PolicyVersionSummary = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    PolicyArn: S.String,
    VersionId: S.Number,
    PolicyType: S.String,
    IsDefault: S.Boolean,
    Name: S.String,
    Status: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    LastUpdatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PolicyVersionSummary",
}) as any as S.Schema<PolicyVersionSummary>;
export type PolicyVersions = PolicyVersionSummary[];
export const PolicyVersions = S.Array(PolicyVersionSummary);
export interface ListResourcePoliciesResponseResourcePolicy {
  PolicyArn?: string;
  PolicyType?: string;
  PolicyName?: string;
}
export const ListResourcePoliciesResponseResourcePolicy = S.suspend(() =>
  S.Struct({
    PolicyArn: S.optional(S.String),
    PolicyType: S.optional(S.String),
    PolicyName: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcePoliciesResponseResourcePolicy",
}) as any as S.Schema<ListResourcePoliciesResponseResourcePolicy>;
export type ListResourcePoliciesResponseResourcePolicies =
  ListResourcePoliciesResponseResourcePolicy[];
export const ListResourcePoliciesResponseResourcePolicies = S.Array(
  ListResourcePoliciesResponseResourcePolicy,
);
export type ApprovalStrategyResponse = { MofN: MofNApprovalStrategy };
export const ApprovalStrategyResponse = S.Union(
  S.Struct({ MofN: MofNApprovalStrategy }),
);
export interface GetApprovalTeamResponseApprover {
  ApproverId?: string;
  ResponseTime?: Date;
  PrimaryIdentityId?: string;
  PrimaryIdentitySourceArn?: string;
  PrimaryIdentityStatus?: string;
}
export const GetApprovalTeamResponseApprover = S.suspend(() =>
  S.Struct({
    ApproverId: S.optional(S.String),
    ResponseTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PrimaryIdentityId: S.optional(S.String),
    PrimaryIdentitySourceArn: S.optional(S.String),
    PrimaryIdentityStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetApprovalTeamResponseApprover",
}) as any as S.Schema<GetApprovalTeamResponseApprover>;
export type GetApprovalTeamResponseApprovers =
  GetApprovalTeamResponseApprover[];
export const GetApprovalTeamResponseApprovers = S.Array(
  GetApprovalTeamResponseApprover,
);
export interface PendingUpdate {
  VersionId?: string;
  Description?: string;
  ApprovalStrategy?: (typeof ApprovalStrategyResponse)["Type"];
  NumberOfApprovers?: number;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
  Approvers?: GetApprovalTeamResponseApprovers;
  UpdateInitiationTime?: Date;
}
export const PendingUpdate = S.suspend(() =>
  S.Struct({
    VersionId: S.optional(S.String),
    Description: S.optional(S.String),
    ApprovalStrategy: S.optional(ApprovalStrategyResponse),
    NumberOfApprovers: S.optional(S.Number),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    Approvers: S.optional(GetApprovalTeamResponseApprovers),
    UpdateInitiationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "PendingUpdate",
}) as any as S.Schema<PendingUpdate>;
export interface ListApprovalTeamsResponseApprovalTeam {
  CreationTime?: Date;
  ApprovalStrategy?: (typeof ApprovalStrategyResponse)["Type"];
  NumberOfApprovers?: number;
  Arn?: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
}
export const ListApprovalTeamsResponseApprovalTeam = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ApprovalStrategy: S.optional(ApprovalStrategyResponse),
    NumberOfApprovers: S.optional(S.Number),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApprovalTeamsResponseApprovalTeam",
}) as any as S.Schema<ListApprovalTeamsResponseApprovalTeam>;
export type ListApprovalTeamsResponseApprovalTeams =
  ListApprovalTeamsResponseApprovalTeam[];
export const ListApprovalTeamsResponseApprovalTeams = S.Array(
  ListApprovalTeamsResponseApprovalTeam,
);
export interface IdentitySourceParameters {
  IamIdentityCenter?: IamIdentityCenter;
}
export const IdentitySourceParameters = S.suspend(() =>
  S.Struct({ IamIdentityCenter: S.optional(IamIdentityCenter) }),
).annotations({
  identifier: "IdentitySourceParameters",
}) as any as S.Schema<IdentitySourceParameters>;
export type SessionMetadata = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const SessionMetadata = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface GetSessionResponseApproverResponse {
  ApproverId?: string;
  IdentitySourceArn?: string;
  IdentityId?: string;
  Response?: string;
  ResponseTime?: Date;
}
export const GetSessionResponseApproverResponse = S.suspend(() =>
  S.Struct({
    ApproverId: S.optional(S.String),
    IdentitySourceArn: S.optional(S.String),
    IdentityId: S.optional(S.String),
    Response: S.optional(S.String),
    ResponseTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetSessionResponseApproverResponse",
}) as any as S.Schema<GetSessionResponseApproverResponse>;
export type GetSessionResponseApproverResponses =
  GetSessionResponseApproverResponse[];
export const GetSessionResponseApproverResponses = S.Array(
  GetSessionResponseApproverResponse,
);
export interface GetPolicyVersionResponse {
  PolicyVersion: PolicyVersion;
}
export const GetPolicyVersionResponse = S.suspend(() =>
  S.Struct({ PolicyVersion: PolicyVersion }),
).annotations({
  identifier: "GetPolicyVersionResponse",
}) as any as S.Schema<GetPolicyVersionResponse>;
export interface ListPoliciesResponse {
  NextToken?: string;
  Policies?: Policies;
}
export const ListPoliciesResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Policies: S.optional(Policies) }),
).annotations({
  identifier: "ListPoliciesResponse",
}) as any as S.Schema<ListPoliciesResponse>;
export interface ListPolicyVersionsResponse {
  NextToken?: string;
  PolicyVersions?: PolicyVersions;
}
export const ListPolicyVersionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PolicyVersions: S.optional(PolicyVersions),
  }),
).annotations({
  identifier: "ListPolicyVersionsResponse",
}) as any as S.Schema<ListPolicyVersionsResponse>;
export interface ListResourcePoliciesResponse {
  NextToken?: string;
  ResourcePolicies?: ListResourcePoliciesResponseResourcePolicies;
}
export const ListResourcePoliciesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ResourcePolicies: S.optional(ListResourcePoliciesResponseResourcePolicies),
  }),
).annotations({
  identifier: "ListResourcePoliciesResponse",
}) as any as S.Schema<ListResourcePoliciesResponse>;
export interface CreateApprovalTeamRequest {
  ClientToken?: string;
  ApprovalStrategy: (typeof ApprovalStrategy)["Type"];
  Approvers: ApprovalTeamRequestApprovers;
  Description: string | Redacted.Redacted<string>;
  Policies: PoliciesReferences;
  Name: string;
  Tags?: Tags;
}
export const CreateApprovalTeamRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    ApprovalStrategy: ApprovalStrategy,
    Approvers: ApprovalTeamRequestApprovers,
    Description: SensitiveString,
    Policies: PoliciesReferences,
    Name: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/approval-teams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApprovalTeamRequest",
}) as any as S.Schema<CreateApprovalTeamRequest>;
export interface GetApprovalTeamResponse {
  CreationTime?: Date;
  ApprovalStrategy?: (typeof ApprovalStrategyResponse)["Type"];
  NumberOfApprovers?: number;
  Approvers?: GetApprovalTeamResponseApprovers;
  Arn?: string;
  Description?: string | Redacted.Redacted<string>;
  Name?: string;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
  UpdateSessionArn?: string;
  VersionId?: string;
  Policies?: PoliciesReferences;
  LastUpdateTime?: Date;
  PendingUpdate?: PendingUpdate;
}
export const GetApprovalTeamResponse = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ApprovalStrategy: S.optional(ApprovalStrategyResponse),
    NumberOfApprovers: S.optional(S.Number),
    Approvers: S.optional(GetApprovalTeamResponseApprovers),
    Arn: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    UpdateSessionArn: S.optional(S.String),
    VersionId: S.optional(S.String),
    Policies: S.optional(PoliciesReferences),
    LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PendingUpdate: S.optional(PendingUpdate),
  }),
).annotations({
  identifier: "GetApprovalTeamResponse",
}) as any as S.Schema<GetApprovalTeamResponse>;
export interface ListApprovalTeamsResponse {
  NextToken?: string;
  ApprovalTeams?: ListApprovalTeamsResponseApprovalTeams;
}
export const ListApprovalTeamsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ApprovalTeams: S.optional(ListApprovalTeamsResponseApprovalTeams),
  }),
).annotations({
  identifier: "ListApprovalTeamsResponse",
}) as any as S.Schema<ListApprovalTeamsResponse>;
export interface CreateIdentitySourceRequest {
  IdentitySourceParameters: IdentitySourceParameters;
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateIdentitySourceRequest = S.suspend(() =>
  S.Struct({
    IdentitySourceParameters: IdentitySourceParameters,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identity-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateIdentitySourceRequest",
}) as any as S.Schema<CreateIdentitySourceRequest>;
export interface GetSessionResponse {
  SessionArn?: string;
  ApprovalTeamArn?: string;
  ApprovalTeamName?: string;
  ProtectedResourceArn?: string;
  ApprovalStrategy?: (typeof ApprovalStrategyResponse)["Type"];
  NumberOfApprovers?: number;
  InitiationTime?: Date;
  ExpirationTime?: Date;
  CompletionTime?: Date;
  Description?: string | Redacted.Redacted<string>;
  Metadata?: SessionMetadata;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
  ExecutionStatus?: string;
  ActionName?: string;
  RequesterServicePrincipal?: string;
  RequesterPrincipalArn?: string;
  RequesterAccountId?: string;
  RequesterRegion?: string;
  RequesterComment?: string | Redacted.Redacted<string>;
  ActionCompletionStrategy?: string;
  ApproverResponses?: GetSessionResponseApproverResponses;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
    SessionArn: S.optional(S.String),
    ApprovalTeamArn: S.optional(S.String),
    ApprovalTeamName: S.optional(S.String),
    ProtectedResourceArn: S.optional(S.String),
    ApprovalStrategy: S.optional(ApprovalStrategyResponse),
    NumberOfApprovers: S.optional(S.Number),
    InitiationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(SensitiveString),
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
    RequesterComment: S.optional(SensitiveString),
    ActionCompletionStrategy: S.optional(S.String),
    ApproverResponses: S.optional(GetSessionResponseApproverResponses),
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface IamIdentityCenterForGet {
  InstanceArn?: string;
  ApprovalPortalUrl?: string;
  Region?: string;
}
export const IamIdentityCenterForGet = S.suspend(() =>
  S.Struct({
    InstanceArn: S.optional(S.String),
    ApprovalPortalUrl: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "IamIdentityCenterForGet",
}) as any as S.Schema<IamIdentityCenterForGet>;
export type IdentitySourceParametersForGet = {
  IamIdentityCenter: IamIdentityCenterForGet;
};
export const IdentitySourceParametersForGet = S.Union(
  S.Struct({ IamIdentityCenter: IamIdentityCenterForGet }),
);
export interface ListSessionsResponseSession {
  SessionArn?: string;
  ApprovalTeamName?: string;
  ApprovalTeamArn?: string;
  InitiationTime?: Date;
  ExpirationTime?: Date;
  CompletionTime?: Date;
  Description?: string | Redacted.Redacted<string>;
  ActionName?: string;
  ProtectedResourceArn?: string;
  RequesterServicePrincipal?: string;
  RequesterPrincipalArn?: string;
  RequesterRegion?: string;
  RequesterAccountId?: string;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
  ActionCompletionStrategy?: string;
}
export const ListSessionsResponseSession = S.suspend(() =>
  S.Struct({
    SessionArn: S.optional(S.String),
    ApprovalTeamName: S.optional(S.String),
    ApprovalTeamArn: S.optional(S.String),
    InitiationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "ListSessionsResponseSession",
}) as any as S.Schema<ListSessionsResponseSession>;
export type ListSessionsResponseSessions = ListSessionsResponseSession[];
export const ListSessionsResponseSessions = S.Array(
  ListSessionsResponseSession,
);
export interface IamIdentityCenterForList {
  InstanceArn?: string;
  ApprovalPortalUrl?: string;
  Region?: string;
}
export const IamIdentityCenterForList = S.suspend(() =>
  S.Struct({
    InstanceArn: S.optional(S.String),
    ApprovalPortalUrl: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "IamIdentityCenterForList",
}) as any as S.Schema<IamIdentityCenterForList>;
export interface CreateApprovalTeamResponse {
  CreationTime?: Date;
  Arn?: string;
  Name?: string;
  VersionId?: string;
}
export const CreateApprovalTeamResponse = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    VersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateApprovalTeamResponse",
}) as any as S.Schema<CreateApprovalTeamResponse>;
export interface CreateIdentitySourceResponse {
  IdentitySourceType?: string;
  IdentitySourceArn?: string;
  CreationTime?: Date;
}
export const CreateIdentitySourceResponse = S.suspend(() =>
  S.Struct({
    IdentitySourceType: S.optional(S.String),
    IdentitySourceArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateIdentitySourceResponse",
}) as any as S.Schema<CreateIdentitySourceResponse>;
export interface GetIdentitySourceResponse {
  IdentitySourceType?: string;
  IdentitySourceParameters?: (typeof IdentitySourceParametersForGet)["Type"];
  IdentitySourceArn?: string;
  CreationTime?: Date;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
}
export const GetIdentitySourceResponse = S.suspend(() =>
  S.Struct({
    IdentitySourceType: S.optional(S.String),
    IdentitySourceParameters: S.optional(IdentitySourceParametersForGet),
    IdentitySourceArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetIdentitySourceResponse",
}) as any as S.Schema<GetIdentitySourceResponse>;
export interface ListSessionsResponse {
  NextToken?: string;
  Sessions?: ListSessionsResponseSessions;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Sessions: S.optional(ListSessionsResponseSessions),
  }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export type IdentitySourceParametersForList = {
  IamIdentityCenter: IamIdentityCenterForList;
};
export const IdentitySourceParametersForList = S.Union(
  S.Struct({ IamIdentityCenter: IamIdentityCenterForList }),
);
export interface IdentitySourceForList {
  IdentitySourceType?: string;
  IdentitySourceParameters?: (typeof IdentitySourceParametersForList)["Type"];
  IdentitySourceArn?: string;
  CreationTime?: Date;
  Status?: string;
  StatusCode?: string;
  StatusMessage?: string;
}
export const IdentitySourceForList = S.suspend(() =>
  S.Struct({
    IdentitySourceType: S.optional(S.String),
    IdentitySourceParameters: S.optional(IdentitySourceParametersForList),
    IdentitySourceArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentitySourceForList",
}) as any as S.Schema<IdentitySourceForList>;
export type IdentitySources = IdentitySourceForList[];
export const IdentitySources = S.Array(IdentitySourceForList);
export interface ListIdentitySourcesResponse {
  NextToken?: string;
  IdentitySources?: IdentitySources;
}
export const ListIdentitySourcesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    IdentitySources: S.optional(IdentitySources),
  }),
).annotations({
  identifier: "ListIdentitySourcesResponse",
}) as any as S.Schema<ListIdentitySourcesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.String, ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of approval teams.
 */
export const listApprovalTeams: {
  (
    input: ListApprovalTeamsRequest,
  ): Effect.Effect<
    ListApprovalTeamsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListApprovalTeamsRequest,
  ) => Stream.Stream<
    ListApprovalTeamsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListApprovalTeamsRequest,
  ) => Stream.Stream<
    ListApprovalTeamsResponseApprovalTeam,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApprovalTeamsRequest,
  output: ListApprovalTeamsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ApprovalTeams",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of identity sources. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const listIdentitySources: {
  (
    input: ListIdentitySourcesRequest,
  ): Effect.Effect<
    ListIdentitySourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentitySourcesRequest,
  ) => Stream.Stream<
    ListIdentitySourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentitySourcesRequest,
  ) => Stream.Stream<
    IdentitySourceForList,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdentitySourcesRequest,
  output: ListIdentitySourcesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IdentitySources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIdentitySource: (
  input: CreateIdentitySourceRequest,
) => Effect.Effect<
  CreateIdentitySourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentitySourceRequest,
  output: CreateIdentitySourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an approval team. You can request to update the team description, approval threshold, and approvers in the team.
 *
 * **Updates require team approval**
 *
 * Updates to an active team must be approved by the team.
 */
export const updateApprovalTeam: (
  input: UpdateApprovalTeamRequest,
) => Effect.Effect<
  UpdateApprovalTeamResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentitySource: (
  input: GetIdentitySourceRequest,
) => Effect.Effect<
  GetIdentitySourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): Effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => Stream.Stream<
    ListSessionsResponseSession,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Sessions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details for an approval team.
 */
export const getApprovalTeam: (
  input: GetApprovalTeamRequest,
) => Effect.Effect<
  GetApprovalTeamResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSession: (
  input: GetSessionRequest,
) => Effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => Effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Returns details for the version of a policy. Policies define the permissions for team resources.
 *
 * The protected operation for a service integration might require specific permissions. For more information, see How other services work with Multi-party approval in the *Multi-party approval User Guide*.
 */
export const getPolicyVersion: (
  input: GetPolicyVersionRequest,
) => Effect.Effect<
  GetPolicyVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPolicyVersions: {
  (
    input: ListPolicyVersionsRequest,
  ): Effect.Effect<
    ListPolicyVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPolicyVersionsRequest,
  ) => Stream.Stream<
    ListPolicyVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPolicyVersionsRequest,
  ) => Stream.Stream<
    PolicyVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPolicyVersionsRequest,
  output: ListPolicyVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PolicyVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of policies for a resource.
 */
export const listResourcePolicies: {
  (
    input: ListResourcePoliciesRequest,
  ): Effect.Effect<
    ListResourcePoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcePoliciesRequest,
  ) => Stream.Stream<
    ListResourcePoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcePoliciesRequest,
  ) => Stream.Stream<
    ListResourcePoliciesResponseResourcePolicy,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcePoliciesRequest,
  output: ListResourcePoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourcePolicies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts the deletion process for an active approval team.
 *
 * **Deletions require team approval**
 *
 * Requests to delete an active team must be approved by the team.
 */
export const startActiveApprovalTeamDeletion: (
  input: StartActiveApprovalTeamDeletionRequest,
) => Effect.Effect<
  StartActiveApprovalTeamDeletionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInactiveApprovalTeamVersion: (
  input: DeleteInactiveApprovalTeamVersionRequest,
) => Effect.Effect<
  DeleteInactiveApprovalTeamVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelSession: (
  input: CancelSessionRequest,
) => Effect.Effect<
  CancelSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPolicies: {
  (
    input: ListPoliciesRequest,
  ): Effect.Effect<
    ListPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoliciesRequest,
  ) => Stream.Stream<
    ListPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPoliciesRequest,
  ) => Stream.Stream<
    Policy,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Policies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes an identity source. For more information, see Identity Source in the *Multi-party approval User Guide*.
 */
export const deleteIdentitySource: (
  input: DeleteIdentitySourceRequest,
) => Effect.Effect<
  DeleteIdentitySourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentitySourceRequest,
  output: DeleteIdentitySourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a resource tag. Each tag is a label consisting of a user-defined key and value. Tags can help you manage, identify, organize, search for, and filter resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Creates a new approval team. For more information, see Approval team in the *Multi-party approval User Guide*.
 */
export const createApprovalTeam: (
  input: CreateApprovalTeamRequest,
) => Effect.Effect<
  CreateApprovalTeamResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
